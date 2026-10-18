import { DEFAULT_SETTINGS, MATERIALS } from './materials.js';
import { calculateFlooring } from './calculations.js';
export const STORAGE_KEY = 'roomforge-project-v1';
const PARAMS = {width:'w',length:'l',unit:'u',material:'m',pattern:'p',waste:'wa',coverage:'c',price:'pr',tax:'tx'};
export function validatedSettings(candidate = {}) {
  const settings = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(settings)) {
    if (candidate[key] === undefined || candidate[key] === null || candidate[key] === '') continue;
    if (['unit', 'material', 'pattern'].includes(key)) settings[key] = String(candidate[key]);
    else settings[key] = Number(candidate[key]);
  }
  if (!MATERIALS[settings.material]) settings.material = DEFAULT_SETTINGS.material;
  if (!['straight', 'staggered'].includes(settings.pattern)) settings.pattern = DEFAULT_SETTINGS.pattern;
  if (!['ft', 'm'].includes(settings.unit)) settings.unit = DEFAULT_SETTINGS.unit;
  if (!calculateFlooring(settings).valid) return { ...DEFAULT_SETTINGS };
  return settings;
}
export function loadSettings() {
  try {
    const search = new URLSearchParams(location.search);
    if (search.has('w') || search.has('l')) {
      const state = {};
      for (const [key, param] of Object.entries(PARAMS)) {
        if (search.has(param)) state[key] = search.get(param);
      }
      return validatedSettings(state);
    }
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return validatedSettings(local);
  } catch { return { ...DEFAULT_SETTINGS }; }
}
export function saveSettings(settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); return true; } catch { return false; }
}
export function clearSettings() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
}
export function buildShareUrl(settings) {
  const url = new URL('studio.html', new URL('./', location.href));
  for (const [key, param] of Object.entries(PARAMS)) url.searchParams.set(param, String(settings[key]));
  return url.toString();
}
