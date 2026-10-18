export type FlooringUnit = 'ft' | 'm';

export type RoomShape = 'rectangle' | 'l-shape';

export type FlooringMaterialKey = 'vinyl' | 'oak' | 'tile' | 'laminate' | 'stone' | 'hardwood';

export type FlooringPattern = 'staggered' | 'straight' | 'diagonal' | 'herringbone';

export interface MaterialConfig {
  id: FlooringMaterialKey;
  name: string;
  short: string;
  type: 'plank' | 'tile';
  category: 'hardwood' | 'laminate' | 'vinyl' | 'ceramic' | 'stone';
  coverage: number; // in sq ft per box
  price: number; // price per box in USD
  color: string;
  light: string;
  dark: string;
  description: string;
  waterproof: boolean;
  durabilityRating: string;
}

export interface FlooringInput {
  shape?: RoomShape;
  width: number | string;
  length: number | string;
  cutoutWidth?: number | string;
  cutoutLength?: number | string;
  unit: FlooringUnit | string;
  waste: number | string;
  coverage: number | string;
  price: number | string;
  tax?: number | string;
}

export interface FlooringErrors {
  unit?: string;
  shape?: string;
  width?: string;
  length?: string;
  cutoutWidth?: string;
  cutoutLength?: string;
  waste?: string;
  coverage?: string;
  price?: string;
  tax?: string;
}

export interface FlooringResult {
  valid: boolean;
  errors: FlooringErrors;
  shape: RoomShape;
  widthFt?: number;
  lengthFt?: number;
  cutoutWidthFt?: number;
  cutoutLengthFt?: number;
  perimeterFt?: number;
  perimeterM?: number;
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
  shape: RoomShape;
  width: number;
  length: number;
  cutoutWidth: number;
  cutoutLength: number;
  unit: FlooringUnit;
  material: FlooringMaterialKey;
  pattern: FlooringPattern;
  waste: number;
  coverage: number;
  price: number;
  tax: number;
  showGrid?: boolean;
}
