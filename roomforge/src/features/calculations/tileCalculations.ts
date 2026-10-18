/**
 * Tile & Grout Material Calculation Engine
 * Complies with TCNA (Tile Council of North America) coverage guidelines.
 */

export interface TileInput {
  area: number; // sq ft
  tileLengthInches: number; // e.g. 12
  tileWidthInches: number; // e.g. 24
  jointWidthInches: number; // e.g. 0.125 (1/8")
  tileThicknessInches?: number; // e.g. 0.375 (3/8")
  wastePercent: number; // e.g. 10%
  tilesPerBox?: number; // e.g. 8
  pricePerBox?: number; // e.g. 48.00
  groutBagWeightLbs?: number; // e.g. 25
  pricePerGroutBag?: number; // e.g. 29.50
}

export interface TileResult {
  valid: boolean;
  errors: Record<string, string>;
  netAreaSqFt: number;
  grossAreaSqFt: number;
  tileAreaSqFt: number;
  netTileCount: number;
  grossTileCount: number;
  boxesNeeded: number;
  totalBoxTileCount: number;
  surplusTiles: number;
  groutPounds: number;
  groutBagsNeeded: number;
  spacersCount: number;
  tileCost: number;
  groutCost: number;
  totalCost: number;
}

export const TILE_PRESETS = [
  { label: '12" × 24" Large Format', length: 24, width: 12, thickness: 0.375, defaultBox: 8 },
  { label: '12" × 12" Standard Square', length: 12, width: 12, thickness: 0.3125, defaultBox: 10 },
  { label: '24" × 24" Ultra Large', length: 24, width: 24, thickness: 0.375, defaultBox: 4 },
  { label: '6" × 24" Wood Look Plank', length: 24, width: 6, thickness: 0.35, defaultBox: 12 },
  { label: '3" × 6" Subway Backsplash', length: 6, width: 3, thickness: 0.25, defaultBox: 40 },
  { label: '4" × 4" Small Square', length: 4, width: 4, thickness: 0.25, defaultBox: 45 },
];

export const GROUT_WIDTH_PRESETS = [
  { label: '1/16" (1.6 mm) — Rectified / Narrow', value: 0.0625 },
  { label: '1/8" (3.2 mm) — Standard Floor Joint', value: 0.125 },
  { label: '3/16" (4.8 mm) — Textured / Handcrafted', value: 0.1875 },
  { label: '1/4" (6.4 mm) — Quarry / Saltillo Tile', value: 0.25 },
];

export function calculateTile(input: TileInput): TileResult {
  const errors: Record<string, string> = {};

  const area = Number(input.area);
  const L = Number(input.tileLengthInches);
  const W = Number(input.tileWidthInches);
  const J = Number(input.jointWidthInches);
  const T = Number(input.tileThicknessInches ?? 0.375);
  const waste = Number(input.wastePercent ?? 10);
  const tilesPerBox = Number(input.tilesPerBox ?? 10);
  const pricePerBox = Number(input.pricePerBox ?? 0);
  const groutBagWeight = Number(input.groutBagWeightLbs ?? 25);
  const pricePerGroutBag = Number(input.pricePerGroutBag ?? 0);

  if (!Number.isFinite(area) || area <= 0 || area > 20000) {
    errors.area = 'Enter an area between 1 and 20,000 sq ft.';
  }
  if (!Number.isFinite(L) || L <= 0 || L > 120) {
    errors.tileLengthInches = 'Tile length must be between 1" and 120".';
  }
  if (!Number.isFinite(W) || W <= 0 || W > 120) {
    errors.tileWidthInches = 'Tile width must be between 1" and 120".';
  }
  if (!Number.isFinite(J) || J < 0.03 || J > 1) {
    errors.jointWidthInches = 'Grout joint width must be between 1/32" (0.031) and 1" (1.0).';
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
      netAreaSqFt: 0,
      grossAreaSqFt: 0,
      tileAreaSqFt: 0,
      netTileCount: 0,
      grossTileCount: 0,
      boxesNeeded: 0,
      totalBoxTileCount: 0,
      surplusTiles: 0,
      groutPounds: 0,
      groutBagsNeeded: 0,
      spacersCount: 0,
      tileCost: 0,
      groutCost: 0,
      totalCost: 0,
    };
  }

  const grossAreaSqFt = area * (1 + waste / 100);
  const tileAreaSqFt = (L * W) / 144;
  const netTileCount = Math.ceil(area / tileAreaSqFt);
  const grossTileCount = Math.ceil(grossAreaSqFt / tileAreaSqFt);

  const boxesNeeded = tilesPerBox > 0 ? Math.ceil(grossTileCount / tilesPerBox) : 0;
  const totalBoxTileCount = boxesNeeded * tilesPerBox;
  const surplusTiles = totalBoxTileCount - grossTileCount;

  // Standard TCNA Grout Calculation:
  // Volume (cu.in) = ((L + W) * J * T * TotalSqInches) / (L * W)
  // Grout density approx 0.059 lbs / cu.inch (dry sanded/unsanded polymer grout)
  const totalSqInches = grossAreaSqFt * 144;
  const groutVolumeCuIn = ((L + W) * J * T * totalSqInches) / (L * W);
  const groutPounds = Math.max(1, Math.ceil(groutVolumeCuIn * 0.059));
  const groutBagsNeeded = groutBagWeight > 0 ? Math.ceil(groutPounds / groutBagWeight) : 1;

  // Approx 4 spacers per tile + 15% spare
  const spacersCount = Math.ceil(grossTileCount * 4 * 1.15);

  const tileCost = boxesNeeded * pricePerBox;
  const groutCost = groutBagsNeeded * pricePerGroutBag;
  const totalCost = tileCost + groutCost;

  return {
    valid: true,
    errors: {},
    netAreaSqFt: area,
    grossAreaSqFt,
    tileAreaSqFt,
    netTileCount,
    grossTileCount,
    boxesNeeded,
    totalBoxTileCount,
    surplusTiles,
    groutPounds,
    groutBagsNeeded,
    spacersCount,
    tileCost,
    groutCost,
    totalCost,
  };
}
