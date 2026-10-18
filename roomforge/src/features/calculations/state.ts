import { calculateFlooring } from './calculations';
import { DEFAULT_SETTINGS, MATERIALS } from './materials';
import { FlooringMaterialKey, FlooringPattern, FlooringUnit, StudioSettings } from './types';

export const STORAGE_KEY = 'roomforge-project-v2';

export const PARAM_MAP: Record<keyof StudioSettings, string> = {
  shape: 's',
  width: 'w',
  length: 'l',
  cutoutWidth: 'cw',
  cutoutLength: 'cl',
  unit: 'u',
  material: 'm',
  pattern: 'p',
  waste: 'wa',
  coverage: 'c',
  price: 'pr',
  tax: 'tx',
  showGrid: 'gr',
};

export function validatedSettings(
  candidate: Partial<StudioSettings> | Partial<Record<string, unknown>> = {}
): StudioSettings {
  const settings: StudioSettings = { ...DEFAULT_SETTINGS };

  if (candidate.shape === 'l-shape' || candidate.shape === 'l') {
    settings.shape = 'l-shape';
  } else {
    settings.shape = 'rectangle';
  }

  if (candidate.width !== undefined && candidate.width !== null && candidate.width !== '') {
    const val = Number(candidate.width);
    if (Number.isFinite(val)) settings.width = val;
  }
  if (candidate.length !== undefined && candidate.length !== null && candidate.length !== '') {
    const val = Number(candidate.length);
    if (Number.isFinite(val)) settings.length = val;
  }
  if (candidate.cutoutWidth !== undefined && candidate.cutoutWidth !== null && candidate.cutoutWidth !== '') {
    const val = Number(candidate.cutoutWidth);
    if (Number.isFinite(val)) settings.cutoutWidth = val;
  }
  if (candidate.cutoutLength !== undefined && candidate.cutoutLength !== null && candidate.cutoutLength !== '') {
    const val = Number(candidate.cutoutLength);
    if (Number.isFinite(val)) settings.cutoutLength = val;
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
  if (candidate.showGrid !== undefined) {
    settings.showGrid = candidate.showGrid === true || candidate.showGrid === '1' || candidate.showGrid === 'true';
  }

  const mat = String(candidate.material || '');
  if (mat in MATERIALS) settings.material = mat as FlooringMaterialKey;

  const pat = String(candidate.pattern || '');
  if (pat === 'straight' || pat === 'staggered' || pat === 'diagonal' || pat === 'herringbone') {
    settings.pattern = pat as FlooringPattern;
  }

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

export const PROJECTS_STORAGE_KEY = 'roomforge-saved-projects-v1';

export interface SavedProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  settings: StudioSettings;
  schemaVersion: number;
}

export interface ExportedProjectPayload {
  format: 'roomforge-project';
  schemaVersion: number;
  exportedAt: string;
  name: string;
  settings: StudioSettings;
}

/**
 * Returns all saved projects from localStorage.
 */
export function getSavedProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => item && typeof item === 'object' && item.id && item.settings)
        .map((item) => ({
          id: String(item.id),
          name: String(item.name || 'Untitled Room'),
          createdAt: String(item.createdAt || new Date().toISOString()),
          updatedAt: String(item.updatedAt || new Date().toISOString()),
          settings: validatedSettings(item.settings),
          schemaVersion: Number(item.schemaVersion || 1),
        }));
    }
  } catch {
    // fallback empty array
  }
  return [];
}

/**
 * Saves or updates a named project in the projects list.
 */
export function saveNamedProject(name: string, settings: StudioSettings, existingId?: string): SavedProject {
  const projects = getSavedProjects();
  const validSettings = validatedSettings(settings);
  const now = new Date().toISOString();

  let target: SavedProject;
  if (existingId) {
    const index = projects.findIndex((p) => p.id === existingId);
    if (index >= 0) {
      target = {
        ...projects[index],
        name: name.trim() || projects[index].name,
        updatedAt: now,
        settings: validSettings,
      };
      projects[index] = target;
    } else {
      target = {
        id: existingId,
        name: name.trim() || 'Room Project',
        createdAt: now,
        updatedAt: now,
        settings: validSettings,
        schemaVersion: 1,
      };
      projects.unshift(target);
    }
  } else {
    target = {
      id: `rf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim() || `Room Project ${projects.length + 1}`,
      createdAt: now,
      updatedAt: now,
      settings: validSettings,
      schemaVersion: 1,
    };
    projects.unshift(target);
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed to save project list to localStorage', e);
    }
  }

  return target;
}

/**
 * Deletes a project by id.
 */
export function deleteSavedProject(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const projects = getSavedProjects().filter((p) => p.id !== id);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch {
    return false;
  }
}

/**
 * Exports project as a JSON string payload.
 */
export function exportProjectAsJson(settings: StudioSettings, name: string = 'RoomForge Plan'): string {
  const payload: ExportedProjectPayload = {
    format: 'roomforge-project',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    name,
    settings: validatedSettings(settings),
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Validates and parses an imported project JSON file.
 * Rejects invalid schemas, unvalidated strings, and code injection.
 */
export function validateAndImportProjectJson(
  rawJson: string
): { success: true; settings: StudioSettings; name: string } | { success: false; error: string } {
  try {
    if (!rawJson || rawJson.length > 500000) {
      return { success: false, error: 'File size exceeds maximum allowed project configuration (500KB).' };
    }
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON structure.' };
    }

    // Support both direct StudioSettings or wrapped ExportedProjectPayload
    let candidateSettings: Partial<Record<string, unknown>> = {};
    let projectName = 'Imported Room Project';

    if (parsed.format === 'roomforge-project' && parsed.settings) {
      candidateSettings = parsed.settings;
      if (typeof parsed.name === 'string') {
        projectName = parsed.name.slice(0, 80);
      }
    } else if (parsed.width !== undefined && parsed.length !== undefined) {
      candidateSettings = parsed;
    } else {
      return { success: false, error: 'Unrecognized ROOMFORGE project file format.' };
    }

    const validated = validatedSettings(candidateSettings);
    return {
      success: true,
      settings: validated,
      name: projectName,
    };
  } catch {
    return { success: false, error: 'Failed to parse JSON file. Ensure the file is not corrupted.' };
  }
}

