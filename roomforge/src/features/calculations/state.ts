import { calculateFlooring } from './calculations';
import { DEFAULT_SETTINGS, MATERIALS } from './materials';
import { FlooringMaterialKey, FlooringPattern, FlooringUnit, StudioSettings } from './types';

export const STORAGE_KEY = 'roomforge-project-v2';

export const PARAM_MAP: Record<keyof StudioSettings, string> = {
  width: 'w',
  length: 'l',
  unit: 'u',
  material: 'm',
  pattern: 'p',
  waste: 'wa',
  coverage: 'c',
  price: 'pr',
  tax: 'tx',
};

export function validatedSettings(candidate: Partial<Record<string, unknown>> = {}): StudioSettings {
  const settings: StudioSettings = { ...DEFAULT_SETTINGS };

  if (candidate.width !== undefined && candidate.width !== null && candidate.width !== '') {
    const val = Number(candidate.width);
    if (Number.isFinite(val)) settings.width = val;
  }
  if (candidate.length !== undefined && candidate.length !== null && candidate.length !== '') {
    const val = Number(candidate.length);
    if (Number.isFinite(val)) settings.length = val;
  }
  if (candidate.waste !== undefined && candidate.waste !== null && candidate.waste !== '') {
    const val = Number(candidate.waste);
    if (Number.isFinite(val)) settings.waste = val;
  }
  if (candidate.coverage !== undefined && candidate.coverage !== null && candidate.coverage !== '') {
    const val = Number(candidate.coverage);
    if (Number.isFinite(val)) settings.coverage = val;
  }
  if (candidate.price !== undefined && candidate.price !== null && candidate.price !== '') {
    const val = Number(candidate.price);
    if (Number.isFinite(val)) settings.price = val;
  }
  if (candidate.tax !== undefined && candidate.tax !== null && candidate.tax !== '') {
    const val = Number(candidate.tax);
    if (Number.isFinite(val)) settings.tax = val;
  }

  const mat = String(candidate.material || '');
  if (mat in MATERIALS) settings.material = mat as FlooringMaterialKey;

  const pat = String(candidate.pattern || '');
  if (pat === 'straight' || pat === 'staggered') settings.pattern = pat as FlooringPattern;

  const un = String(candidate.unit || '');
  if (un === 'ft' || un === 'm') settings.unit = un as FlooringUnit;

  if (!calculateFlooring(settings).valid) {
    return { ...DEFAULT_SETTINGS };
  }
  return settings;
}

export function parseSearchParams(search: URLSearchParams): StudioSettings {
  if (search.has('w') || search.has('l')) {
    const state: Record<string, string> = {};
    for (const [key, param] of Object.entries(PARAM_MAP) as [keyof StudioSettings, string][]) {
      const val = search.get(param);
      if (val !== null) state[key] = val;
    }
    return validatedSettings(state);
  }
  return { ...DEFAULT_SETTINGS };
}

export function buildShareUrl(settings: StudioSettings, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  const url = new URL('/studio', base || 'http://localhost:3000');
  for (const [key, param] of Object.entries(PARAM_MAP) as [keyof StudioSettings, string][]) {
    url.searchParams.set(param, String(settings[key]));
  }
  return url.toString();
}

export function saveSettings(settings: StudioSettings): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

export function loadSettings(): StudioSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return validatedSettings(JSON.parse(raw));
  } catch {
    // fallback
  }
  return { ...DEFAULT_SETTINGS };
}

export function clearSettings(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
