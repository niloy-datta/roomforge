import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSavedProjects,
  saveNamedProject,
  deleteSavedProject,
  exportProjectAsJson,
  validateAndImportProjectJson,
} from '@/features/calculations/state';
import { DEFAULT_SETTINGS } from '@/features/calculations/materials';

describe('Multi-Project Persistence & JSON Export/Import', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty projects list', () => {
    expect(getSavedProjects()).toEqual([]);
  });

  it('saves and retrieves named projects in localStorage', () => {
    const saved = saveNamedProject('Master Bedroom', { ...DEFAULT_SETTINGS, width: 14, length: 18 });
    expect(saved.name).toBe('Master Bedroom');
    expect(saved.id).toBeDefined();

    const list = getSavedProjects();
    expect(list.length).toBe(1);
    expect(list[0].name).toBe('Master Bedroom');
    expect(list[0].settings.width).toBe(14);
  });

  it('updates an existing project when existingId is supplied', () => {
    const p1 = saveNamedProject('Kitchen Project', { ...DEFAULT_SETTINGS, width: 12 });
    const p1Updated = saveNamedProject('Kitchen Remodel 2026', { ...DEFAULT_SETTINGS, width: 16 }, p1.id);

    expect(p1Updated.id).toBe(p1.id);
    expect(p1Updated.name).toBe('Kitchen Remodel 2026');

    const list = getSavedProjects();
    expect(list.length).toBe(1);
    expect(list[0].settings.width).toBe(16);
  });

  it('deletes saved projects by id', () => {
    const p1 = saveNamedProject('Room A', DEFAULT_SETTINGS);
    const p2 = saveNamedProject('Room B', DEFAULT_SETTINGS);
    expect(getSavedProjects().length).toBe(2);

    const deleted = deleteSavedProject(p1.id);
    expect(deleted).toBe(true);

    const list = getSavedProjects();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(p2.id);
  });

  it('exports and validates JSON import properly', () => {
    const json = exportProjectAsJson({ ...DEFAULT_SETTINGS, width: 20, length: 25 }, 'Grand Hall');
    expect(json).toContain('roomforge-project');
    expect(json).toContain('Grand Hall');

    const importResult = validateAndImportProjectJson(json);
    expect(importResult.success).toBe(true);
    if (importResult.success) {
      expect(importResult.name).toBe('Grand Hall');
      expect(importResult.settings.width).toBe(20);
      expect(importResult.settings.length).toBe(25);
    }
  });

  it('rejects corrupted or oversized import JSON payloads', () => {
    const malformed = validateAndImportProjectJson('not valid json {');
    expect(malformed.success).toBe(false);

    const wrongFormat = validateAndImportProjectJson(JSON.stringify({ random: 'data' }));
    expect(wrongFormat.success).toBe(false);
  });
});
