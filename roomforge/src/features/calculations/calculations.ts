import { FlooringErrors, FlooringInput, FlooringResult, FlooringUnit, RoomShape } from './types';

/** Pure calculation utilities; internally, all length is in feet. */
export const FEET_PER_METER = 3.280839895013123;
export const SQFT_PER_SQM = FEET_PER_METER ** 2; // ~10.763910416709722
export const MAX_LENGTH_FT = 500;

export function toFeet(value: number | string, unit: FlooringUnit = 'ft'): number {
  return Number(value) * (unit === 'm' ? FEET_PER_METER : 1);
}

export function fromFeet(value: number | string, unit: FlooringUnit = 'ft'): number {
  return Number(value) / (unit === 'm' ? FEET_PER_METER : 1);
}

export function convertLength(value: number | string, from: FlooringUnit, to: FlooringUnit): number {
  return fromFeet(toFeet(value, from), to);
}

/**
 * Returns a result with valid, errors and numeric values.
 * Waste is an allowance, not a precise cut-list prediction.
 * Supports both Rectangular and L-shaped room geometry.
 */
export function calculateFlooring(input: Partial<FlooringInput>): FlooringResult {
  const errors: FlooringErrors = {};
  const unit = (input.unit as FlooringUnit) || 'ft';
  if (unit !== 'ft' && unit !== 'm') {
    errors.unit = 'Choose feet or meters.';
  }

  const shape: RoomShape = input.shape === 'l-shape' ? 'l-shape' : 'rectangle';
  const width = Number(input.width);
  const length = Number(input.length);
  const waste = Number(input.waste);
  const coverage = Number(input.coverage);
  const price = Number(input.price);
  const tax = Number(input.tax ?? 0);
  const maxDisplayLength = unit === 'm' ? MAX_LENGTH_FT / FEET_PER_METER : MAX_LENGTH_FT;

  if (!Number.isFinite(width) || width <= 0 || width > maxDisplayLength) {
    errors.width = `Enter a width greater than 0 and no more than ${maxDisplayLength.toFixed(unit === 'm' ? 1 : 0)} ${unit || 'ft'}.`;
  }
  if (!Number.isFinite(length) || length <= 0 || length > maxDisplayLength) {
    errors.length = `Enter a length greater than 0 and no more than ${maxDisplayLength.toFixed(unit === 'm' ? 1 : 0)} ${unit || 'ft'}.`;
  }

  let cutoutWidth = 0;
  let cutoutLength = 0;

  if (shape === 'l-shape') {
    cutoutWidth = Number(input.cutoutWidth ?? 0);
    cutoutLength = Number(input.cutoutLength ?? 0);

    if (!Number.isFinite(cutoutWidth) || cutoutWidth <= 0 || (Number.isFinite(width) && cutoutWidth >= width)) {
      errors.cutoutWidth = `Corner cutout width must be between 0 and less than total room width (${width || 0} ${unit}).`;
    }
    if (!Number.isFinite(cutoutLength) || cutoutLength <= 0 || (Number.isFinite(length) && cutoutLength >= length)) {
      errors.cutoutLength = `Corner cutout length must be between 0 and less than total room length (${length || 0} ${unit}).`;
    }
  }

  if (!Number.isFinite(waste) || waste < 0 || waste > 50) {
    errors.waste = 'Waste allowance must be between 0% and 50%.';
  }
  if (!Number.isFinite(coverage) || coverage <= 0 || coverage > 2000) {
    errors.coverage = 'Box coverage must be greater than 0 and no more than 2,000 sq ft.';
  }
  if (!Number.isFinite(price) || price < 0 || price > 100000) {
    errors.price = 'Price per box must be between $0 and $100,000.';
  }
  if (!Number.isFinite(tax) || tax < 0 || tax > 40) {
    errors.tax = 'Sales tax must be between 0% and 40%.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors, shape };
  }

  const widthFt = toFeet(width, unit);
  const lengthFt = toFeet(length, unit);
  const cutoutWidthFt = shape === 'l-shape' ? toFeet(cutoutWidth, unit) : 0;
  const cutoutLengthFt = shape === 'l-shape' ? toFeet(cutoutLength, unit) : 0;

  const boundingAreaSqFt = widthFt * lengthFt;
  const cutoutAreaSqFt = cutoutWidthFt * cutoutLengthFt;
  const areaSqFt = Math.max(0.01, boundingAreaSqFt - cutoutAreaSqFt);
  const areaSqM = areaSqFt / SQFT_PER_SQM;

  const perimeterFt = 2 * (widthFt + lengthFt);
  const perimeterM = perimeterFt / FEET_PER_METER;

  const neededSqFt = areaSqFt * (1 + waste / 100);
  const boxes = Math.ceil(neededSqFt / coverage);
  const purchasedSqFt = boxes * coverage;
  const materialCost = boxes * price;
  const taxAmount = (materialCost * tax) / 100;
  const totalCost = materialCost + taxAmount;

  return {
    valid: true,
    errors: {},
    shape,
    widthFt,
    lengthFt,
    cutoutWidthFt: shape === 'l-shape' ? cutoutWidthFt : undefined,
    cutoutLengthFt: shape === 'l-shape' ? cutoutLengthFt : undefined,
    perimeterFt,
    perimeterM,
    areaSqFt,
    areaSqM,
    neededSqFt,
    neededSqM: neededSqFt / SQFT_PER_SQM,
    boxes,
    purchasedSqFt,
    surplusSqFt: purchasedSqFt - neededSqFt,
    materialCost,
    taxAmount,
    totalCost,
    wasteAllowance: waste,
    costPerSqFt: price / coverage,
  };
}

export const formatNumber = (n?: number | null, digits = 1): string =>
  typeof n === 'number' && Number.isFinite(n)
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(n)
    : '—';

export const formatMoney = (n?: number | null): string =>
  typeof n === 'number' && Number.isFinite(n)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
    : '—';
