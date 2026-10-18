/**
 * Safe CSV export utility with formula injection mitigation (CWE-1236).
 * Ensures mathematical accuracy and prevents executable spreadsheet injection.
 */

import { FlooringResult, StudioSettings } from '@/features/calculations/types';
import { MATERIALS } from '@/features/calculations/materials';
import { formatNumber } from '@/features/calculations/calculations';

export interface CsvMaterialRow {
  category: string;
  item: string;
  quantity: string | number;
  unit: string;
  unitPrice: string | number;
  subtotal: string | number;
  notes: string;
}

/**
 * Sanitizes a cell value to prevent CSV formula injection in Excel, Google Sheets, etc.
 * Any value starting with '=', '+', '-', '@', '\t', or '\r' is prepended with a single quote.
 */
export function sanitizeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);

  // Formula injection prevention (OWASP CWE-1236)
  const isDangerousStart = /^[\s]*[=+\-@\t\r]/.test(str);
  const safeStr = isDangerousStart ? `'${str}` : str;

  // Escape quotation marks and wrap in quotes if containing comma, newline, or quote
  if (safeStr.includes('"') || safeStr.includes(',') || safeStr.includes('\n') || safeStr.includes('\r')) {
    return `"${safeStr.replace(/"/g, '""')}"`;
  }
  return safeStr;
}

/**
 * Converts an array of structured material rows into a valid CSV string.
 */
export function generateMaterialsCsv(rows: CsvMaterialRow[], headerNotes?: string[]): string {
  const lines: string[] = [];

  if (headerNotes && headerNotes.length > 0) {
    for (const note of headerNotes) {
      lines.push(`# ${note}`);
    }
  }

  const headers = ['Category', 'Item Description', 'Quantity', 'Purchase Unit', 'Unit Price ($)', 'Subtotal ($)', 'Notes & Estimating Basis'];
  lines.push(headers.map(sanitizeCsvCell).join(','));

  for (const row of rows) {
    const fields = [
      row.category,
      row.item,
      row.quantity,
      row.unit,
      row.unitPrice,
      row.subtotal,
      row.notes,
    ];
    lines.push(fields.map(sanitizeCsvCell).join(','));
  }

  return lines.join('\r\n');
}

/**
 * Generates rows for a Studio flooring project.
 */
export function buildFlooringMaterialRows(settings: StudioSettings, result: FlooringResult): CsvMaterialRow[] {
  const mat = MATERIALS[settings.material] || MATERIALS.vinyl;
  const shapeLabel = settings.shape === 'l-shape' ? 'L-Shaped Room' : 'Rectangular Room';

  const boxes = result.boxes ?? 0;
  const materialCost = result.materialCost ?? 0;
  const neededSqFt = result.neededSqFt ?? 0;
  const areaSqFt = result.areaSqFt ?? 0;
  const perimeterFt = result.perimeterFt ?? 0;
  const perimeterM = result.perimeterM ?? 0;
  const taxAmount = result.taxAmount ?? 0;
  const totalCost = result.totalCost ?? 0;

  const rows: CsvMaterialRow[] = [
    {
      category: 'Flooring Material',
      item: `${mat.name} (${settings.pattern} pattern)`,
      quantity: boxes,
      unit: 'Boxes / Cartons',
      unitPrice: settings.price.toFixed(2),
      subtotal: materialCost.toFixed(2),
      notes: `${formatNumber(settings.coverage, 2)} sq ft/box. Net room area: ${formatNumber(areaSqFt, 2)} sq ft (${shapeLabel}).`,
    },
    {
      category: 'Waste Allowance',
      item: `Cutting & Fitting Waste (${settings.waste}%)`,
      quantity: formatNumber(Math.max(0, neededSqFt - areaSqFt), 2),
      unit: 'Sq Ft',
      unitPrice: '0.00',
      subtotal: '0.00',
      notes: `Included in required coverage of ${formatNumber(neededSqFt, 2)} sq ft.`,
    },
    {
      category: 'Trim & Perimeter',
      item: 'Wall Baseboards / Quarter Round Trim (Estimated)',
      quantity: formatNumber(perimeterFt, 1),
      unit: 'Linear Feet',
      unitPrice: '0.00',
      subtotal: '0.00',
      notes: `${formatNumber(perimeterM, 1)} linear meters. Add 10% for miter cut corners when ordering.`,
    },
  ];

  if (taxAmount > 0) {
    rows.push({
      category: 'Taxes',
      item: `Estimated Sales Tax (${settings.tax}%)`,
      quantity: 1,
      unit: 'Allowance',
      unitPrice: taxAmount.toFixed(2),
      subtotal: taxAmount.toFixed(2),
      notes: 'Applied to materials subtotal.',
    });
  }

  rows.push({
    category: 'Project Total',
    item: 'Total Estimated Materials Cost',
    quantity: 1,
    unit: 'Project',
    unitPrice: totalCost.toFixed(2),
    subtotal: totalCost.toFixed(2),
    notes: 'Excludes demo, subfloor leveling, underlayment, adhesive, and professional labor.',
  });

  return rows;
}

/**
 * Triggers a client-side download of a UTF-8 encoded CSV file with BOM for Microsoft Excel.
 */
export function downloadCsv(filename: string, csvContent: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // Add UTF-8 BOM so Excel opens UTF-8 encoded characters properly
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (err) {
    console.error('Failed to trigger CSV download', err);
    return false;
  }
}
