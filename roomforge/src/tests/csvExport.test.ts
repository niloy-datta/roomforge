import { describe, it, expect } from 'vitest';
import { sanitizeCsvCell, generateMaterialsCsv, buildFlooringMaterialRows } from '@/lib/csvExport';
import { DEFAULT_SETTINGS } from '@/features/calculations/materials';
import { calculateFlooring } from '@/features/calculations/calculations';

describe('CSV Export Utility', () => {
  it('neutralizes spreadsheet formula injection (CWE-1236)', () => {
    expect(sanitizeCsvCell('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)");
    expect(sanitizeCsvCell('+cmd|/c calc')).toBe("'+cmd|/c calc");
    expect(sanitizeCsvCell('-10')).toBe("'-10");
    expect(sanitizeCsvCell('@HYPERLINK("http://evil.com")')).toBe('"\'@HYPERLINK(""http://evil.com"")"');
  });

  it('escapes quotes and wraps comma-containing strings in double quotes', () => {
    expect(sanitizeCsvCell('Oak, White')).toBe('"Oak, White"');
    expect(sanitizeCsvCell('Tile "Gloss" Finish')).toBe('"Tile ""Gloss"" Finish"');
    expect(sanitizeCsvCell('Normal text')).toBe('Normal text');
    expect(sanitizeCsvCell(123.45)).toBe('123.45');
    expect(sanitizeCsvCell(null)).toBe('');
  });

  it('generates well-formatted CSV with headers and rows', () => {
    const rows = [
      {
        category: 'Flooring',
        item: 'Vinyl Planks',
        quantity: 10,
        unit: 'Boxes',
        unitPrice: 50.0,
        subtotal: 500.0,
        notes: 'Includes 10% waste',
      },
    ];
    const csv = generateMaterialsCsv(rows, ['ROOMFORGE Estimate']);
    expect(csv).toContain('# ROOMFORGE Estimate');
    expect(csv).toContain('Category,Item Description,Quantity,Purchase Unit,Unit Price ($),Subtotal ($),Notes & Estimating Basis');
    expect(csv).toContain('Flooring,Vinyl Planks,10,Boxes,50,500,Includes 10% waste');
  });

  it('builds flooring material rows matching calculation results', () => {
    const result = calculateFlooring(DEFAULT_SETTINGS);
    const rows = buildFlooringMaterialRows(DEFAULT_SETTINGS, result);
    expect(rows.length).toBeGreaterThanOrEqual(3);
    expect(rows[0].item).toContain('Luxury vinyl plank');
    expect(rows[0].quantity).toBe(result.boxes);
    expect(rows[rows.length - 1].subtotal).toBe(result.totalCost!.toFixed(2));
  });
});
