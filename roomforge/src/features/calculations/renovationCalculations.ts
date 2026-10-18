/**
 * Renovation Cost & Budget Estimating Engine
 * Industry benchmark cost models indexed by space type, tier, and trade breakdowns.
 */

export type RoomType = 'kitchen' | 'bathroom-master' | 'bathroom-standard' | 'living-room' | 'bedroom' | 'basement' | 'whole-home';
export type QualityTier = 'budget' | 'mid-grade' | 'high-end' | 'luxury-custom';

export interface RenovationInput {
  roomType: RoomType;
  qualityTier: QualityTier;
  squareFootage: number;
  diyLevel: 'full-contractor' | 'partial-diy' | 'complete-diy';
  customContingencyPercent?: number; // default 15%
  permitIncluded?: boolean;
}

export interface RenovationResult {
  valid: boolean;
  errors: Record<string, string>;
  squareFootage: number;
  baseCostPerSqFt: number;
  subtotal: number;
  laborCost: number;
  materialsCost: number;
  permitsAndDisposalCost: number;
  contingencyCost: number;
  contingencyPercent: number;
  totalEstimatedCost: number;
  lowRangeCost: number;
  highRangeCost: number;
  tradeBreakdown: {
    name: string;
    percentage: number;
    amount: number;
  }[];
}

export const ROOM_TYPE_OPTIONS: { id: RoomType; label: string; desc: string; defaultSqFt: number }[] = [
  { id: 'kitchen', label: 'Kitchen Remodel', desc: 'Cabinets, countertops, plumbing, appliances, backsplash', defaultSqFt: 200 },
  { id: 'bathroom-master', label: 'Primary / Master Bathroom', desc: 'Walk-in shower, freestanding tub, double vanity, tile floor', defaultSqFt: 100 },
  { id: 'bathroom-standard', label: 'Guest / Standard Bathroom', desc: 'Tub-shower combo, single vanity, toilet, flooring', defaultSqFt: 45 },
  { id: 'living-room', label: 'Living Room / Great Room', desc: 'Flooring, drywall, trim, recessed lighting, paint', defaultSqFt: 300 },
  { id: 'bedroom', label: 'Bedroom / Nursery', desc: 'Flooring, closet framing, baseboards, paint, lighting', defaultSqFt: 180 },
  { id: 'basement', label: 'Finished Basement', desc: 'Moisture barrier, framing, drywall, ceiling, flooring, HVAC', defaultSqFt: 600 },
  { id: 'whole-home', label: 'Full Home Overhaul', desc: 'Comprehensive renovation across all living zones', defaultSqFt: 1800 },
];

export const QUALITY_TIER_OPTIONS: { id: QualityTier; label: string; subtitle: string; multiplier: number }[] = [
  { id: 'budget', label: 'Budget / Refresh', subtitle: 'Stock materials, laminate/vinyl, refinishing existing elements', multiplier: 0.65 },
  { id: 'mid-grade', label: 'Standard / Mid-Grade', subtitle: 'Semi-custom cabinetry, quartz counters, engineered wood/tile', multiplier: 1.0 },
  { id: 'high-end', label: 'Premium / High-End', subtitle: 'Custom hardwood, marble/granite, smart fixtures, designer tile', multiplier: 1.65 },
  { id: 'luxury-custom', label: 'Architectural Luxury', subtitle: 'Imported stone, bespoke carpentry, architectural re-engineering', multiplier: 2.4 },
];

// Base mid-grade contractor cost per square foot benchmarks (National Averages)
const BASE_RATES_BY_ROOM: Record<RoomType, number> = {
  kitchen: 175,
  'bathroom-master': 250,
  'bathroom-standard': 210,
  'living-room': 45,
  bedroom: 38,
  basement: 65,
  'whole-home': 85,
};

export function calculateRenovation(input: RenovationInput): RenovationResult {
  const errors: Record<string, string> = {};

  const sqFt = Number(input.squareFootage);
  const contingencyPct = Number(input.customContingencyPercent ?? 15);
  const permits = Boolean(input.permitIncluded ?? true);

  if (!Number.isFinite(sqFt) || sqFt <= 0 || sqFt > 20000) {
    errors.squareFootage = 'Enter square footage between 10 and 20,000 sq ft.';
  }

  const baseRate = BASE_RATES_BY_ROOM[input.roomType] ?? 75;
  const tierConfig = QUALITY_TIER_OPTIONS.find((t) => t.id === input.qualityTier) ?? QUALITY_TIER_OPTIONS[1];

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
      squareFootage: 0,
      baseCostPerSqFt: baseRate,
      subtotal: 0,
      laborCost: 0,
      materialsCost: 0,
      permitsAndDisposalCost: 0,
      contingencyCost: 0,
      contingencyPercent: contingencyPct,
      totalEstimatedCost: 0,
      lowRangeCost: 0,
      highRangeCost: 0,
      tradeBreakdown: [],
    };
  }

  // Cost per sq ft adjusted for tier
  const adjustedRate = baseRate * tierConfig.multiplier;
  const rawSubtotal = sqFt * adjustedRate;

  // DIY adjustment multiplier for labor
  // full-contractor = 100% labor, partial-diy = 50% labor saved, complete-diy = 85% labor saved
  const laborFactor = input.diyLevel === 'complete-diy' ? 0.15 : input.diyLevel === 'partial-diy' ? 0.55 : 1.0;

  // Standard labor/materials ratio is 55% labor, 45% materials
  const standardLabor = rawSubtotal * 0.55;
  const materialsCost = Math.round(rawSubtotal * 0.45);
  const laborCost = Math.round(standardLabor * laborFactor);

  const permitsAndDisposalCost = permits ? Math.round(Math.max(500, rawSubtotal * 0.04)) : 0;
  const subtotal = laborCost + materialsCost + permitsAndDisposalCost;
  const contingencyCost = Math.round(subtotal * (contingencyPct / 100));
  const totalEstimatedCost = subtotal + contingencyCost;

  const lowRangeCost = Math.round(totalEstimatedCost * 0.88);
  const highRangeCost = Math.round(totalEstimatedCost * 1.18);

  // Trade percentages according to space type
  let tradeWeights: { name: string; pct: number }[];
  if (input.roomType === 'kitchen') {
    tradeWeights = [
      { name: 'Cabinetry & Hardware', pct: 32 },
      { name: 'Countertops & Sinks', pct: 18 },
      { name: 'Appliances & Ventilation', pct: 15 },
      { name: 'Plumbing & Electrical Trades', pct: 14 },
      { name: 'Flooring & Backsplash Tile', pct: 12 },
      { name: 'Demolition & Disposal', pct: 5 },
      { name: 'Paint & Trim Detailing', pct: 4 },
    ];
  } else if (input.roomType.startsWith('bathroom')) {
    tradeWeights = [
      { name: 'Tile Shower, Pan & Walls', pct: 28 },
      { name: 'Plumbing Fixtures & Rough-in', pct: 22 },
      { name: 'Vanity, Mirror & Countertop', pct: 18 },
      { name: 'Electrical, Lighting & Exhaust', pct: 12 },
      { name: 'Waterproofing & Backerboard', pct: 8 },
      { name: 'Demolition & Disposal', pct: 7 },
      { name: 'Paint & Finishes', pct: 5 },
    ];
  } else {
    tradeWeights = [
      { name: 'Flooring & Subfloor Prep', pct: 30 },
      { name: 'Framing, Drywall & Insulation', pct: 25 },
      { name: 'Electrical & Lighting Fixtures', pct: 18 },
      { name: 'Doors, Trim & Moldings', pct: 12 },
      { name: 'Demolition & Debris Disposal', pct: 8 },
      { name: 'Paint & Wall Finishes', pct: 7 },
    ];
  }

  const tradeBreakdown = tradeWeights.map((t) => ({
    name: t.name,
    percentage: t.pct,
    amount: Math.round(subtotal * (t.pct / 100)),
  }));

  return {
    valid: true,
    errors: {},
    squareFootage: sqFt,
    baseCostPerSqFt: Math.round(adjustedRate),
    subtotal,
    laborCost,
    materialsCost,
    permitsAndDisposalCost,
    contingencyCost,
    contingencyPercent: contingencyPct,
    totalEstimatedCost,
    lowRangeCost,
    highRangeCost,
    tradeBreakdown,
  };
}
