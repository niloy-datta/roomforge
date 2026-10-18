import { describe, it, expect } from 'vitest';
import { calculateFlooring, convertLength, toFeet, SQFT_PER_SQM } from './calculations';
import { validatedSettings } from './state';
import { FlooringInput } from './types';

const base: FlooringInput = {
  shape: 'rectangle',
  width: 12,
  length: 18,
  unit: 'ft',
  waste: 10,
  coverage: 24,
  price: 45,
  tax: 0,
};

describe('Flooring Calculations Engine', () => {
  it('spec sample: area, requirement, rounded boxes, cost', () => {
    const res = calculateFlooring(base);
    expect(res.valid).toBe(true);
    expect(res.areaSqFt).toBe(216);
    expect(res.neededSqFt).toBeCloseTo(237.6, 5);
    expect(res.boxes).toBe(10);
    expect(res.materialCost).toBe(450);
    expect(res.totalCost).toBe(450);
    expect(res.perimeterFt).toBe(60);
  });

  it('metric inputs preserve measurement accurately', () => {
    const m: FlooringInput = {
      ...base,
      width: convertLength(12, 'ft', 'm'),
      length: convertLength(18, 'ft', 'm'),
      unit: 'm',
    };
    const result = calculateFlooring(m);
    expect(result.valid).toBe(true);
    expect(result.areaSqFt).toBeCloseTo(216, 5);
    expect(result.boxes).toBe(10);
    expect(result.areaSqM).toBeCloseTo(216 / SQFT_PER_SQM, 5);
  });

  it('coverage rounding and exact divisible amount', () => {
    expect(calculateFlooring({ ...base, waste: 0, coverage: 24 }).boxes).toBe(9);
    expect(calculateFlooring({ ...base, waste: 10, coverage: 24 }).boxes).toBe(10);
  });

  it('tax adds separately without rounding intermediates', () => {
    const res = calculateFlooring({ ...base, tax: 8.5 });
    expect(res.taxAmount).toBe(38.25);
    expect(res.totalCost).toBe(488.25);
  });

  it('calculates L-shaped room geometry accurately', () => {
    const lRoom: FlooringInput = {
      shape: 'l-shape',
      width: 12,
      length: 18,
      cutoutWidth: 4,
      cutoutLength: 6,
      unit: 'ft',
      waste: 10,
      coverage: 24,
      price: 45,
      tax: 0,
    };
    const res = calculateFlooring(lRoom);
    expect(res.valid).toBe(true);
    // Bounding 12x18 = 216, cutout 4x6 = 24 => Net area = 192 sq ft
    expect(res.areaSqFt).toBe(192);
    expect(res.neededSqFt).toBeCloseTo(192 * 1.10, 5);
    // 211.2 / 24 = 8.8 => 9 boxes
    expect(res.boxes).toBe(9);
    expect(res.materialCost).toBe(9 * 45);
    expect(res.perimeterFt).toBe(60);
  });

  it('rejects invalid L-shape cutout dimensions', () => {
    // Cutout width equal or greater than room width
    expect(calculateFlooring({ ...base, shape: 'l-shape', cutoutWidth: 12, cutoutLength: 6 }).valid).toBe(false);
    expect(calculateFlooring({ ...base, shape: 'l-shape', cutoutWidth: 14, cutoutLength: 6 }).valid).toBe(false);
    // Cutout length equal or greater than room length
    expect(calculateFlooring({ ...base, shape: 'l-shape', cutoutWidth: 4, cutoutLength: 18 }).valid).toBe(false);
    expect(calculateFlooring({ ...base, shape: 'l-shape', cutoutWidth: 4, cutoutLength: 20 }).valid).toBe(false);
    // Negative or 0 cutout
    expect(calculateFlooring({ ...base, shape: 'l-shape', cutoutWidth: 0, cutoutLength: 6 }).valid).toBe(false);
  });

  it('validates geometry, missing/invalid, absurd values', () => {
    const invalidInputs: Partial<FlooringInput>[] = [
      { ...base, width: 0 },
      { ...base, length: -4 },
      { ...base, width: 'foo' },
      { ...base, length: 501 },
      { ...base, coverage: 0 },
      { ...base, waste: 55 },
      { ...base, price: -1 },
      { ...base, tax: 41 },
      { ...base, unit: 'in' },
    ];
    for (const candidate of invalidInputs) {
      expect(calculateFlooring(candidate).valid).toBe(false);
    }
  });

  it('metric length upper limit is physically equivalent', () => {
    const maxM = 500 / 3.280839895013123;
    expect(calculateFlooring({ ...base, width: maxM, unit: 'm' }).valid).toBe(true);
    expect(calculateFlooring({ ...base, width: maxM + 1, unit: 'm' }).valid).toBe(false);
  });

  it('share/load sanitization resets unsafe settings', () => {
    expect(validatedSettings({ width: -999 }).width).toBe(12);
    expect(validatedSettings({ material: 'bad' }).material).toBe('vinyl');
    expect(validatedSettings({ width: '15', length: '20' }).width).toBe(15);
    expect(validatedSettings({ shape: 'l' }).shape).toBe('l-shape');
  });

  it('conversion constants match reference', () => {
    expect(toFeet(1, 'm')).toBeCloseTo(3.280839895, 8);
  });
});
