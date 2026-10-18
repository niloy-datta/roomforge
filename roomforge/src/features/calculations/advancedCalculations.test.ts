import { describe, it, expect } from 'vitest';
import { calculateTile } from './tileCalculations';
import { calculatePaint } from './paintCalculations';
import { calculateConcrete } from './concreteCalculations';
import { calculateDrywall } from './drywallCalculations';
import { calculateRenovation } from './renovationCalculations';
import { calculateComparison } from './comparisonCalculations';

describe('Advanced Material & Trade Calculation Engines', () => {
  describe('calculateTile', () => {
    it('accurately calculates tiles, boxes, and grout for 120 sq ft room', () => {
      const result = calculateTile({
        area: 120,
        tileLengthInches: 12,
        tileWidthInches: 24, // 2 sq ft per tile
        jointWidthInches: 0.125,
        tileThicknessInches: 0.375,
        wastePercent: 10,
        tilesPerBox: 8, // 16 sq ft per box
        pricePerBox: 40,
        groutBagWeightLbs: 25,
        pricePerGroutBag: 25,
      });

      expect(result.valid).toBe(true);
      expect(result.netAreaSqFt).toBe(120);
      expect(result.grossAreaSqFt).toBe(132); // 120 * 1.10
      expect(result.tileAreaSqFt).toBe(2);
      expect(result.netTileCount).toBe(60);
      expect(result.grossTileCount).toBe(66);
      expect(result.boxesNeeded).toBe(9); // ceil(66 / 8) = 9
      expect(result.groutPounds).toBeGreaterThan(5);
      expect(result.groutBagsNeeded).toBeGreaterThanOrEqual(1);
      expect(result.tileCost).toBe(360); // 9 * 40
    });

    it('rejects negative or absurd dimensions gracefully', () => {
      const result = calculateTile({
        area: -50,
        tileLengthInches: 0,
        tileWidthInches: 500,
        jointWidthInches: 5,
        wastePercent: 10,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.area).toBeDefined();
      expect(result.errors.tileLengthInches).toBeDefined();
    });
  });

  describe('calculatePaint', () => {
    it('computes net wall area deducting doors and windows', () => {
      // 10x10 room, 8 ft ceiling: perimeter = 40, gross wall = 320 sq ft
      // 1 door (21 sq ft) + 2 windows (30 sq ft) = 51 sq ft deduction
      // net wall = 269 sq ft
      const result = calculatePaint({
        width: 10,
        length: 10,
        height: 8,
        doors: 1,
        windows: 2,
        coats: 2,
        includeCeiling: false,
        coveragePerGallon: 350,
        pricePerGallon: 40,
      });

      expect(result.valid).toBe(true);
      expect(result.grossWallAreaSqFt).toBe(320);
      expect(result.deductionAreaSqFt).toBe(51);
      expect(result.netWallAreaSqFt).toBe(269);
      expect(result.effectiveCoverageSqFt).toBe(538); // 269 * 2 coats
      expect(result.wallGallonsNeeded).toBe(2); // ceil(538 / 350) = 2
      expect(result.totalCost).toBe(80);
    });

    it('includes ceiling area when specified', () => {
      const result = calculatePaint({
        width: 10,
        length: 12,
        height: 9,
        doors: 1,
        windows: 1,
        coats: 2,
        includeCeiling: true,
        coveragePerGallon: 350,
      });
      expect(result.valid).toBe(true);
      expect(result.ceilingAreaSqFt).toBe(120);
      expect(result.ceilingGallonsNeeded).toBeGreaterThanOrEqual(1);
    });
  });

  describe('calculateConcrete', () => {
    it('calculates slab cubic yards, bags, and delivery recommendation', () => {
      // 10 ft x 10 ft slab at 4 inches (1/3 ft) = 33.33 cu ft net
      // with 10% waste = 36.67 cu ft = 1.36 cu yards
      const result = calculateConcrete({
        lengthFeet: 10,
        widthFeet: 10,
        thicknessInches: 4,
        wastePercent: 10,
        pricePerCubicYard: 150,
        pricePer80LbBag: 6.5,
      });

      expect(result.valid).toBe(true);
      expect(result.surfaceAreaSqFt).toBe(100);
      expect(result.cubicYards).toBeCloseTo(1.36, 1);
      expect(result.bags80Lb).toBe(62); // ceil(36.666 / 0.60) = 62
      expect(result.deliveryTypeRecommendation).toBe('bags'); // < 1.5 cu yd
    });

    it('recommends ready-mix truck delivery for larger jobs (> 1.5 cu yds)', () => {
      const result = calculateConcrete({
        lengthFeet: 20,
        widthFeet: 20,
        thicknessInches: 5,
        wastePercent: 10,
      });
      expect(result.valid).toBe(true);
      expect(result.cubicYards).toBeGreaterThan(6);
      expect(result.deliveryTypeRecommendation).toBe('truck');
    });
  });

  describe('calculateDrywall', () => {
    it('calculates 4x8 drywall sheets, screws, tape, and joint compound', () => {
      const result = calculateDrywall({
        roomLength: 12,
        roomWidth: 12,
        ceilingHeight: 8,
        sheetSize: '4x8',
        doorsCount: 1,
        windowsCount: 1,
        includeCeiling: true,
        wastePercent: 10,
      });

      expect(result.valid).toBe(true);
      expect(result.totalWallAreaSqFt).toBe(384);
      expect(result.ceilingAreaSqFt).toBe(144);
      expect(result.sheetsNeeded).toBeGreaterThan(15);
      expect(result.screwsNeeded).toBeGreaterThan(500);
      expect(result.mudBucketsNeeded).toBeGreaterThanOrEqual(1);
      expect(result.tapeRollsNeeded).toBeGreaterThanOrEqual(1);
    });
  });

  describe('calculateRenovation', () => {
    it('estimates kitchen remodel with trade breakdowns and contingency', () => {
      const result = calculateRenovation({
        roomType: 'kitchen',
        qualityTier: 'mid-grade',
        squareFootage: 200,
        diyLevel: 'full-contractor',
        customContingencyPercent: 15,
      });

      expect(result.valid).toBe(true);
      expect(result.totalEstimatedCost).toBeGreaterThan(25000);
      expect(result.contingencyPercent).toBe(15);
      expect(result.tradeBreakdown.length).toBeGreaterThan(4);
      expect(result.lowRangeCost).toBeLessThan(result.totalEstimatedCost);
      expect(result.highRangeCost).toBeGreaterThan(result.totalEstimatedCost);
    });

    it('reduces labor costs when complete DIY is selected', () => {
      const contractor = calculateRenovation({
        roomType: 'bathroom-master',
        qualityTier: 'mid-grade',
        squareFootage: 100,
        diyLevel: 'full-contractor',
      });

      const diy = calculateRenovation({
        roomType: 'bathroom-master',
        qualityTier: 'mid-grade',
        squareFootage: 100,
        diyLevel: 'complete-diy',
      });

      expect(diy.laborCost).toBeLessThan(contractor.laborCost);
      expect(diy.totalEstimatedCost).toBeLessThan(contractor.totalEstimatedCost);
    });
  });

  describe('calculateComparison', () => {
    it('compares selected materials over 10-year lifespan', () => {
      const metrics = calculateComparison(['solid-hardwood', 'luxury-vinyl-plank', 'porcelain-tile'], 300, false);

      expect(metrics.length).toBe(3);
      const hardwood = metrics.find((m) => m.item.id === 'solid-hardwood');
      const lvp = metrics.find((m) => m.item.id === 'luxury-vinyl-plank');

      expect(hardwood).toBeDefined();
      expect(lvp).toBeDefined();
      expect(lvp!.initialTotalCost).toBeLessThan(hardwood!.initialTotalCost);
      expect(hardwood!.item.lifespanYears).toBeGreaterThan(lvp!.item.lifespanYears);
    });
  });
});
