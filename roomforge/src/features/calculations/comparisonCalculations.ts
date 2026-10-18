/**
 * Material Comparison & Lifecycle TCO (Total Cost of Ownership) Engine
 * Compares flooring & finishes across upfront purchase, pro installation, maintenance, and lifespan.
 */

export interface MaterialComparisonItem {
  id: string;
  name: string;
  category: 'hardwood' | 'engineered' | 'laminate' | 'vinyl' | 'tile' | 'stone';
  materialCostPerSqFt: number;
  laborCostPerSqFt: number;
  annualMaintenancePerSqFt: number;
  lifespanYears: number;
  waterResistanceScore: number; // 1-5
  durabilityScore: number; // 1-5
  diyDifficultyScore: number; // 1-5 (1 easiest, 5 expert)
  radiantHeatCompatible: boolean;
  pros: string[];
  cons: string[];
}

export const COMPARISON_DATABASE: MaterialComparisonItem[] = [
  {
    id: 'solid-hardwood',
    name: 'Solid White Oak Hardwood',
    category: 'hardwood',
    materialCostPerSqFt: 8.5,
    laborCostPerSqFt: 5.5,
    annualMaintenancePerSqFt: 0.35,
    lifespanYears: 80,
    waterResistanceScore: 2,
    durabilityScore: 4,
    diyDifficultyScore: 4,
    radiantHeatCompatible: false,
    pros: ['Can be sanded & refinished 4-6 times', 'Highest long-term real estate appraisal value', 'Natural authentic grain aesthetics'],
    cons: ['Vulnerable to standing moisture & humidity swings', 'Cannot be installed below grade / basements', 'Requires nail-down specialist install'],
  },
  {
    id: 'engineered-hardwood',
    name: 'Engineered European Oak',
    category: 'engineered',
    materialCostPerSqFt: 6.2,
    laborCostPerSqFt: 4.25,
    annualMaintenancePerSqFt: 0.25,
    lifespanYears: 35,
    waterResistanceScore: 3,
    durabilityScore: 4,
    diyDifficultyScore: 3,
    radiantHeatCompatible: true,
    pros: ['Cross-ply core resists seasonal expansion/contraction', 'Can be installed on concrete slabs & over radiant heating', 'Real hardwood top veneer layer'],
    cons: ['Can only be refinished 1-2 times (thin wear layer)', 'Susceptible to deep scratches from heavy pets', 'More expensive than vinyl/laminate'],
  },
  {
    id: 'luxury-vinyl-plank',
    name: 'Rigid Core Luxury Vinyl Plank (SPC)',
    category: 'vinyl',
    materialCostPerSqFt: 3.4,
    laborCostPerSqFt: 2.25,
    annualMaintenancePerSqFt: 0.05,
    lifespanYears: 25,
    waterResistanceScore: 5,
    durabilityScore: 5,
    diyDifficultyScore: 1,
    radiantHeatCompatible: true,
    pros: ['100% waterproof — ideal for bathrooms, kitchens & basements', 'Extremely DIY-friendly click-lock installation', 'Scratch & dent resistant wear layer'],
    cons: ['Does not add equity value comparable to real wood', 'Cannot be refinished; must replace damaged planks', 'Sensitive to direct intense sun exposure'],
  },
  {
    id: 'porcelain-tile',
    name: 'Glazed Porcelain Floor Tile',
    category: 'tile',
    materialCostPerSqFt: 4.8,
    laborCostPerSqFt: 7.5,
    annualMaintenancePerSqFt: 0.15,
    lifespanYears: 60,
    waterResistanceScore: 5,
    durabilityScore: 5,
    diyDifficultyScore: 5,
    radiantHeatCompatible: true,
    pros: ['Completely impervious to water and stains', 'Near-infinite durability in heavy commercial foot traffic', 'Superior performance over in-floor heating'],
    cons: ['Cold and hard underfoot without radiant heating', 'Grout joints require periodic sealing', 'Labor-intensive installation needing wet saw'],
  },
  {
    id: 'premium-laminate',
    name: 'Waterproof AC4 Laminate Flooring',
    category: 'laminate',
    materialCostPerSqFt: 2.75,
    laborCostPerSqFt: 2.2,
    annualMaintenancePerSqFt: 0.08,
    lifespanYears: 20,
    waterResistanceScore: 4,
    durabilityScore: 4,
    diyDifficultyScore: 1,
    radiantHeatCompatible: true,
    pros: ['High scratch resistance against pet claws', 'Most affordable wood-look option per square foot', 'Rapid floating click-lock installation'],
    cons: ['Vulnerable if water penetrates under seams for >24 hrs', 'Hollow sound if subfloor is uneven or underlayment cheap', 'Cannot be sanded or refinished'],
  },
  {
    id: 'natural-stone',
    name: 'Honed Travertine Natural Stone',
    category: 'stone',
    materialCostPerSqFt: 11.0,
    laborCostPerSqFt: 8.5,
    annualMaintenancePerSqFt: 0.45,
    lifespanYears: 100,
    waterResistanceScore: 4,
    durabilityScore: 4,
    diyDifficultyScore: 5,
    radiantHeatCompatible: true,
    pros: ['Timeless, luxurious organic visual texture', 'Increases architectural home appraisal value', 'Can last a century when maintained'],
    cons: ['Porous natural stone requires annual penetration sealing', 'Acidic spills (lemon, vinegar) can etch the finish', 'Highest material and skilled artisan labor cost'],
  },
];

export interface ComparisonMetrics {
  item: MaterialComparisonItem;
  materialCost: number;
  laborCost: number;
  initialTotalCost: number;
  tenYearMaintenanceCost: number;
  tenYearTCO: number;
  annualizedCostPerYear: number;
}

export function calculateComparison(
  selectedIds: string[],
  roomSqFt: number,
  isDiyInstall: boolean = false
): ComparisonMetrics[] {
  const sqFt = Math.max(10, Math.min(10000, Number(roomSqFt) || 250));

  return selectedIds
    .map((id) => COMPARISON_DATABASE.find((m) => m.id === id))
    .filter((m): m is MaterialComparisonItem => Boolean(m))
    .map((item) => {
      const materialCost = Math.round(sqFt * item.materialCostPerSqFt);
      const laborCost = isDiyInstall ? 0 : Math.round(sqFt * item.laborCostPerSqFt);
      const initialTotalCost = materialCost + laborCost;
      const tenYearMaintenanceCost = Math.round(sqFt * item.annualMaintenancePerSqFt * 10);
      const tenYearTCO = initialTotalCost + tenYearMaintenanceCost;
      const annualizedCostPerYear = Math.round(tenYearTCO / Math.min(item.lifespanYears, 10));

      return {
        item,
        materialCost,
        laborCost,
        initialTotalCost,
        tenYearMaintenanceCost,
        tenYearTCO,
        annualizedCostPerYear,
      };
    });
}
