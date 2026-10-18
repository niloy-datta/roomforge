/**
 * Drywall / Sheetrock Material Calculation Engine
 * Calculates drywall sheets (4x8, 4x10, 4x12), screws, joint tape, and joint compound.
 */

export interface DrywallInput {
  roomLength: number; // ft
  roomWidth: number; // ft
  ceilingHeight: number; // ft (e.g. 8, 9, 10)
  sheetSize: '4x8' | '4x10' | '4x12';
  doorsCount?: number;
  windowsCount?: number;
  includeCeiling: boolean;
  wastePercent: number; // e.g. 10%
  pricePerSheet?: number; // e.g. 14.50
  pricePerMudBucket?: number; // 4.5 gallon / 50 lb bucket, e.g. 21.00
  pricePerScrewBox?: number; // 5 lb box (~1,500 screws), e.g. 12.00
}

export interface DrywallResult {
  valid: boolean;
  errors: Record<string, string>;
  totalWallAreaSqFt: number;
  deductionAreaSqFt: number;
  netWallAreaSqFt: number;
  ceilingAreaSqFt: number;
  totalAreaSqFt: number;
  grossAreaSqFt: number;
  sheetSqFt: number;
  sheetsNeeded: number;
  screwsNeeded: number;
  screwBoxesNeeded: number; // 5 lb boxes (~1,500 screws each)
  jointTapeLinearFt: number;
  tapeRollsNeeded: number; // 250 ft rolls
  jointCompoundGallons: number;
  mudBucketsNeeded: number; // 4.5 gallon all-purpose compound buckets
  sheetCost: number;
  mudCost: number;
  screwCost: number;
  totalCost: number;
}

export const DRYWALL_SHEET_SIZES = {
  '4x8': { label: '4 ft × 8 ft (32 sq ft) — Standard DIY Friendly', sqFt: 32, length: 8, width: 4 },
  '4x10': { label: '4 ft × 10 ft (40 sq ft) — 9 ft Ceilings & Large Rooms', sqFt: 40, length: 10, width: 4 },
  '4x12': { label: '4 ft × 12 ft (48 sq ft) — Commercial & Pro Minimizing Seams', sqFt: 48, length: 12, width: 4 },
} as const;

export function calculateDrywall(input: DrywallInput): DrywallResult {
  const errors: Record<string, string> = {};

  const L = Number(input.roomLength);
  const W = Number(input.roomWidth);
  const H = Number(input.ceilingHeight);
  const doors = Number(input.doorsCount ?? 1);
  const windows = Number(input.windowsCount ?? 2);
  const includeCeiling = Boolean(input.includeCeiling);
  const waste = Number(input.wastePercent ?? 10);
  const sheetSizeKey = input.sheetSize in DRYWALL_SHEET_SIZES ? input.sheetSize : '4x8';
  const pricePerSheet = Number(input.pricePerSheet ?? 14.5);
  const pricePerMudBucket = Number(input.pricePerMudBucket ?? 21.0);
  const pricePerScrewBox = Number(input.pricePerScrewBox ?? 12.0);

  if (!Number.isFinite(L) || L <= 0 || L > 200) {
    errors.roomLength = 'Length must be between 1 and 200 ft.';
  }
  if (!Number.isFinite(W) || W <= 0 || W > 200) {
    errors.roomWidth = 'Width must be between 1 and 200 ft.';
  }
  if (!Number.isFinite(H) || H < 6 || H > 30) {
    errors.ceilingHeight = 'Ceiling height must be between 6 and 30 ft.';
  }

  const sheetConfig = DRYWALL_SHEET_SIZES[sheetSizeKey];

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
      totalWallAreaSqFt: 0,
      deductionAreaSqFt: 0,
      netWallAreaSqFt: 0,
      ceilingAreaSqFt: 0,
      totalAreaSqFt: 0,
      grossAreaSqFt: 0,
      sheetSqFt: sheetConfig.sqFt,
      sheetsNeeded: 0,
      screwsNeeded: 0,
      screwBoxesNeeded: 0,
      jointTapeLinearFt: 0,
      tapeRollsNeeded: 0,
      jointCompoundGallons: 0,
      mudBucketsNeeded: 0,
      sheetCost: 0,
      mudCost: 0,
      screwCost: 0,
      totalCost: 0,
    };
  }

  const perimeter = 2 * (L + W);
  const totalWallAreaSqFt = perimeter * H;
  const deductionAreaSqFt = doors * 21 + windows * 15;
  const netWallAreaSqFt = Math.max(10, totalWallAreaSqFt - deductionAreaSqFt);
  const ceilingAreaSqFt = includeCeiling ? L * W : 0;
  const totalAreaSqFt = netWallAreaSqFt + ceilingAreaSqFt;
  const grossAreaSqFt = totalAreaSqFt * (1 + waste / 100);

  const sheetsNeeded = Math.ceil(grossAreaSqFt / sheetConfig.sqFt);

  // Screws: Industry rule of thumb is ~32 screws per 4x8 sheet (16" O.C. stud spacing: 5 studs × 6-7 screws)
  // Or ~1 screw per square foot + 15% drop/strip allowance
  const screwsPerSheet = Math.round((sheetConfig.sqFt / 32) * 32 * 1.15);
  const screwsNeeded = sheetsNeeded * screwsPerSheet;
  const screwBoxesNeeded = Math.max(1, Math.ceil(screwsNeeded / 1500));

  // Tape: approx 1.05 to 1.1 linear feet of joint tape per square foot of drywall installed
  const jointTapeLinearFt = Math.ceil(totalAreaSqFt * 1.08);
  const tapeRollsNeeded = Math.max(1, Math.ceil(jointTapeLinearFt / 250)); // 250 ft per roll

  // Joint Compound: Industry average is ~0.053 gallons (or 5.3 gallons per 100 sq ft) for 3-coat finish
  const jointCompoundGallons = Number((totalAreaSqFt * 0.053).toFixed(1));
  const mudBucketsNeeded = Math.max(1, Math.ceil(jointCompoundGallons / 4.5)); // standard 4.5 gallon pail

  const sheetCost = sheetsNeeded * pricePerSheet;
  const mudCost = mudBucketsNeeded * pricePerMudBucket;
  const screwCost = screwBoxesNeeded * pricePerScrewBox;
  const totalCost = sheetCost + mudCost + screwCost;

  return {
    valid: true,
    errors: {},
    totalWallAreaSqFt,
    deductionAreaSqFt,
    netWallAreaSqFt,
    ceilingAreaSqFt,
    totalAreaSqFt,
    grossAreaSqFt,
    sheetSqFt: sheetConfig.sqFt,
    sheetsNeeded,
    screwsNeeded,
    screwBoxesNeeded,
    jointTapeLinearFt,
    tapeRollsNeeded,
    jointCompoundGallons,
    mudBucketsNeeded,
    sheetCost,
    mudCost,
    screwCost,
    totalCost,
  };
}
