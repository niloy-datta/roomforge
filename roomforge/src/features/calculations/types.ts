export type FlooringUnit = 'ft' | 'm';

export type FlooringMaterialKey = 'vinyl' | 'oak' | 'tile' | 'laminate';

export type FlooringPattern = 'staggered' | 'straight';

export interface MaterialConfig {
  id: FlooringMaterialKey;
  name: string;
  short: string;
  type: 'plank' | 'tile';
  coverage: number; // in sq ft
  price: number; // price per box in USD
  color: string;
  light: string;
  dark: string;
  description: string;
}

export interface FlooringInput {
  width: number | string;
  length: number | string;
  unit: FlooringUnit | string;
  waste: number | string;
  coverage: number | string;
  price: number | string;
  tax?: number | string;
}

export interface FlooringErrors {
  unit?: string;
  width?: string;
  length?: string;
  waste?: string;
  coverage?: string;
  price?: string;
  tax?: string;
}

export interface FlooringResult {
  valid: boolean;
  errors: FlooringErrors;
  widthFt?: number;
  lengthFt?: number;
  areaSqFt?: number;
  areaSqM?: number;
  neededSqFt?: number;
  neededSqM?: number;
  boxes?: number;
  purchasedSqFt?: number;
  surplusSqFt?: number;
  materialCost?: number;
  taxAmount?: number;
  totalCost?: number;
  wasteAllowance?: number;
  costPerSqFt?: number;
}

export interface StudioSettings {
  width: number;
  length: number;
  unit: FlooringUnit;
  material: FlooringMaterialKey;
  pattern: FlooringPattern;
  waste: number;
  coverage: number;
  price: number;
  tax: number;
}
