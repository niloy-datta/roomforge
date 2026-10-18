/**
 * Concrete Slab & Footing Calculation Engine
 * Computes exact cubic volume, pre-mix bag yields, and ready-mix yardage.
 */

export interface ConcreteInput {
  lengthFeet: number;
  widthFeet: number;
  thicknessInches: number; // e.g. 4, 5, 6
  wastePercent: number; // e.g. 10%
  pricePerCubicYard?: number; // e.g. 150.00
  pricePer80LbBag?: number; // e.g. 6.50
}

export interface ConcreteResult {
  valid: boolean;
  errors: Record<string, string>;
  surfaceAreaSqFt: number;
  surfaceAreaSqM: number;
  netVolumeCuFt: number;
  grossVolumeCuFt: number;
  cubicYards: number;
  cubicMeters: number;
  bags60Lb: number; // 0.45 cu ft each
  bags80Lb: number; // 0.60 cu ft each
  bags50Lb: number; // 0.375 cu ft each
  deliveryTypeRecommendation: 'bags' | 'truck';
  truckCostEstimate: number;
  bagCostEstimate: number;
}

export const SLAB_THICKNESS_PRESETS = [
  { label: '4 inches (10 cm) — Sidewalks, Walkways, Patios', value: 4 },
  { label: '5 inches (12.7 cm) — Residential Driveways, Sheds', value: 5 },
  { label: '6 inches (15.2 cm) — Heavy Vehicles, Garage Floors', value: 6 },
  { label: '8 inches (20.3 cm) — Commercial Foundation Footings', value: 8 },
];

export function calculateConcrete(input: ConcreteInput): ConcreteResult {
  const errors: Record<string, string> = {};

  const L = Number(input.lengthFeet);
  const W = Number(input.widthFeet);
  const T = Number(input.thicknessInches);
  const waste = Number(input.wastePercent ?? 10);
  const yardPrice = Number(input.pricePerCubicYard ?? 150);
  const bagPrice = Number(input.pricePer80LbBag ?? 6.5);

  if (!Number.isFinite(L) || L <= 0 || L > 500) {
    errors.lengthFeet = 'Length must be between 1 and 500 feet.';
  }
  if (!Number.isFinite(W) || W <= 0 || W > 500) {
    errors.widthFeet = 'Width must be between 1 and 500 feet.';
  }
  if (!Number.isFinite(T) || T < 1 || T > 36) {
    errors.thicknessInches = 'Thickness must be between 1 and 36 inches.';
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
      surfaceAreaSqFt: 0,
      surfaceAreaSqM: 0,
      netVolumeCuFt: 0,
      grossVolumeCuFt: 0,
      cubicYards: 0,
      cubicMeters: 0,
      bags60Lb: 0,
      bags80Lb: 0,
      bags50Lb: 0,
      deliveryTypeRecommendation: 'bags',
      truckCostEstimate: 0,
      bagCostEstimate: 0,
    };
  }

  const surfaceAreaSqFt = L * W;
  const surfaceAreaSqM = surfaceAreaSqFt / 10.7639;

  // Depth converted to feet
  const depthFt = T / 12;
  const netVolumeCuFt = surfaceAreaSqFt * depthFt;
  const grossVolumeCuFt = netVolumeCuFt * (1 + waste / 100);

  // 1 Cubic Yard = 27 Cubic Feet
  const cubicYards = Number((grossVolumeCuFt / 27).toFixed(2));
  // 1 Cubic Meter = 35.3147 Cubic Feet
  const cubicMeters = Number((grossVolumeCuFt / 35.3147).toFixed(2));

  // Bag yields:
  // 80 lb bag yields 0.60 cu ft
  const bags80Lb = Math.ceil(grossVolumeCuFt / 0.6);
  // 60 lb bag yields 0.45 cu ft
  const bags60Lb = Math.ceil(grossVolumeCuFt / 0.45);
  // 50 lb bag yields 0.375 cu ft
  const bags50Lb = Math.ceil(grossVolumeCuFt / 0.375);

  // If over 1.5 cubic yards (or > 65 bags), ready-mix truck is significantly faster, cheaper, and less physically exhausting
  const deliveryTypeRecommendation: 'bags' | 'truck' = cubicYards >= 1.5 ? 'truck' : 'bags';

  const truckCostEstimate = Math.ceil(cubicYards) * yardPrice;
  const bagCostEstimate = bags80Lb * bagPrice;

  return {
    valid: true,
    errors: {},
    surfaceAreaSqFt,
    surfaceAreaSqM,
    netVolumeCuFt,
    grossVolumeCuFt,
    cubicYards,
    cubicMeters,
    bags60Lb,
    bags80Lb,
    bags50Lb,
    deliveryTypeRecommendation,
    truckCostEstimate,
    bagCostEstimate,
  };
}
