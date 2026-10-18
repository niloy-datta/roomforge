/**
 * Paint & Wall Surface Calculation Engine
 * Includes door/window architectural deductions and multi-coat spread rates.
 */

export interface PaintInput {
  width: number; // ft
  length: number; // ft
  height: number; // ft (standard 8, 9, 10 or 12)
  doors: number; // standard doors (21 sq ft deduction each)
  windows: number; // standard windows (15 sq ft deduction each)
  coats: number; // 1, 2, or 3 coats
  includeCeiling: boolean;
  primerCoats?: number; // 0 or 1
  coveragePerGallon?: number; // default 350 sq ft
  pricePerGallon?: number; // e.g. 45.00
  pricePerPrimerGallon?: number; // e.g. 28.00
}

export interface PaintResult {
  valid: boolean;
  errors: Record<string, string>;
  grossWallAreaSqFt: number;
  deductionAreaSqFt: number;
  netWallAreaSqFt: number;
  ceilingAreaSqFt: number;
  totalPaintAreaSqFt: number;
  effectiveCoverageSqFt: number;
  wallGallonsNeeded: number;
  ceilingGallonsNeeded: number;
  primerGallonsNeeded: number;
  totalGallons: number;
  totalLiters: number;
  quartsRemaining: number;
  paintCost: number;
  primerCost: number;
  totalCost: number;
  supplies: {
    rollers: number;
    tapeRolls: number;
    dropCloths: number;
  };
}

export const CEILING_HEIGHT_PRESETS = [
  { label: '8 ft (Standard Flat)', value: 8 },
  { label: '9 ft (Modern Standard)', value: 9 },
  { label: '10 ft (Tall / High Ceiling)', value: 10 },
  { label: '12 ft (Cathedral / Vaulted)', value: 12 },
];

export function calculatePaint(input: PaintInput): PaintResult {
  const errors: Record<string, string> = {};

  const width = Number(input.width);
  const length = Number(input.length);
  const height = Number(input.height);
  const doors = Number(input.doors ?? 1);
  const windows = Number(input.windows ?? 2);
  const coats = Number(input.coats ?? 2);
  const includeCeiling = Boolean(input.includeCeiling);
  const primerCoats = Number(input.primerCoats ?? 0);
  const coverageRate = Number(input.coveragePerGallon ?? 350);
  const paintPrice = Number(input.pricePerGallon ?? 0);
  const primerPrice = Number(input.pricePerPrimerGallon ?? 0);

  if (!Number.isFinite(width) || width <= 0 || width > 200) {
    errors.width = 'Enter a room width between 1 and 200 ft.';
  }
  if (!Number.isFinite(length) || length <= 0 || length > 200) {
    errors.length = 'Enter a room length between 1 and 200 ft.';
  }
  if (!Number.isFinite(height) || height < 6 || height > 40) {
    errors.height = 'Enter a ceiling height between 6 and 40 ft.';
  }
  if (!Number.isFinite(doors) || doors < 0 || doors > 20) {
    errors.doors = 'Door count must be between 0 and 20.';
  }
  if (!Number.isFinite(windows) || windows < 0 || windows > 30) {
    errors.windows = 'Window count must be between 0 and 30.';
  }
  if (!Number.isFinite(coats) || coats < 1 || coats > 4) {
    errors.coats = 'Number of coats must be between 1 and 4.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
      grossWallAreaSqFt: 0,
      deductionAreaSqFt: 0,
      netWallAreaSqFt: 0,
      ceilingAreaSqFt: 0,
      totalPaintAreaSqFt: 0,
      effectiveCoverageSqFt: 0,
      wallGallonsNeeded: 0,
      ceilingGallonsNeeded: 0,
      primerGallonsNeeded: 0,
      totalGallons: 0,
      totalLiters: 0,
      quartsRemaining: 0,
      paintCost: 0,
      primerCost: 0,
      totalCost: 0,
      supplies: { rollers: 0, tapeRolls: 0, dropCloths: 0 },
    };
  }

  const perimeter = 2 * (width + length);
  const grossWallAreaSqFt = perimeter * height;
  const deductionAreaSqFt = doors * 21 + windows * 15;
  const netWallAreaSqFt = Math.max(10, grossWallAreaSqFt - deductionAreaSqFt);
  const ceilingAreaSqFt = includeCeiling ? width * length : 0;
  const totalPaintAreaSqFt = netWallAreaSqFt + ceilingAreaSqFt;

  const totalWallCoverageNeeded = netWallAreaSqFt * coats;
  const wallGallonsNeeded = Math.ceil(totalWallCoverageNeeded / coverageRate);

  const totalCeilingCoverageNeeded = ceilingAreaSqFt * Math.min(coats, 2);
  const ceilingGallonsNeeded = includeCeiling ? Math.ceil(totalCeilingCoverageNeeded / coverageRate) : 0;

  const primerGallonsNeeded = primerCoats > 0 ? Math.ceil(totalPaintAreaSqFt / coverageRate) : 0;

  const totalGallons = wallGallonsNeeded + ceilingGallonsNeeded;
  const totalLiters = Number((totalGallons * 3.78541).toFixed(1));

  // Remaining fractional volume in quarts (4 quarts per gallon)
  const exactGallons = (totalWallCoverageNeeded + totalCeilingCoverageNeeded) / coverageRate;
  const quartsRemaining = Math.max(0, Math.round((totalGallons - exactGallons) * 4));

  const paintCost = totalGallons * paintPrice;
  const primerCost = primerGallonsNeeded * primerPrice;
  const totalCost = paintCost + primerCost;

  // Recommended supplies estimation
  const rollers = Math.max(2, Math.ceil(totalPaintAreaSqFt / 400));
  const tapeRolls = Math.max(1, Math.ceil((perimeter + doors * 17 + windows * 14) / 180));
  const dropCloths = Math.max(1, Math.ceil((width * length) / 150));

  return {
    valid: true,
    errors: {},
    grossWallAreaSqFt,
    deductionAreaSqFt,
    netWallAreaSqFt,
    ceilingAreaSqFt,
    totalPaintAreaSqFt,
    effectiveCoverageSqFt: totalWallCoverageNeeded + totalCeilingCoverageNeeded,
    wallGallonsNeeded,
    ceilingGallonsNeeded,
    primerGallonsNeeded,
    totalGallons,
    totalLiters,
    quartsRemaining,
    paintCost,
    primerCost,
    totalCost,
    supplies: {
      rollers,
      tapeRolls,
      dropCloths,
    },
  };
}
