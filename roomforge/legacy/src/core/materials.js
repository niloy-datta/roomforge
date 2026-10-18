export const MATERIALS = {
  vinyl: { name: 'Luxury vinyl plank', short: 'Vinyl plank', type: 'plank', coverage: 24, price: 45, color: '#b88c61', light: '#d4ad7c', dark: '#906b47', description: 'Warm & versatile' },
  oak: { name: 'Engineered oak', short: 'Oak hardwood', type: 'plank', coverage: 20, price: 119, color: '#ad7850', light: '#d4a77a', dark: '#805237', description: 'Timeless character' },
  tile: { name: 'Porcelain tile', short: 'Porcelain tile', type: 'tile', coverage: 16, price: 52, color: '#c6c2b9', light: '#ebe7de', dark: '#98968e', description: 'Refined & durable' },
  laminate: { name: 'Oak-look laminate', short: 'Laminate', type: 'plank', coverage: 22, price: 55, color: '#bb9e7c', light: '#e1c4a1', dark: '#967653', description: 'Effortless everyday' },
};
export const MATERIAL_KEYS = Object.keys(MATERIALS);
export const DEFAULT_SETTINGS = {
  width: 12,
  length: 18,
  unit: 'ft',
  material: 'vinyl',
  pattern: 'staggered',
  waste: 10,
  coverage: MATERIALS.vinyl.coverage,
  price: MATERIALS.vinyl.price,
  tax: 0,
};
