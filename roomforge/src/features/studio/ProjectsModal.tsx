'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FolderOpen,
  X,
  Save,
  Trash2,
  Download,
  Upload,
  Copy,
  Calendar,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getSavedProjects,
  saveNamedProject,
  deleteSavedProject,
  exportProjectAsJson,
  validateAndImportProjectJson,
  SavedProject,
} from '@/features/calculations/state';
import { StudioSettings } from '@/features/calculations/types';
import { MATERIALS } from '@/features/calculations/materials';
import { formatNumber } from '@/features/calculations/calculations';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: StudioSettings;
  onLoadProject: (settings: StudioSettings, name: string) => void;
  onShowToast: (message: string) => void;
}

export function ProjectsModal({
  isOpen,
  onClose,
  currentSettings,
  onLoadProject,
  onShowToast,
}: ProjectsModalProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [projectName, setProjectName] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refresh saved projects list whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setProjects(getSavedProjects());
      setImportError(null);
      const mat = MATERIALS[currentSettings.material] || MATERIALS.vinyl;
      setProjectName(`${mat.short} Room (${formatNumber(currentSettings.width, 1)}×${formatNumber(currentSettings.length, 1)})`);
    }
  }, [isOpen, currentSettings]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    const saved = saveNamedProject(projectName, currentSettings);
    setProjects(getSavedProjects());
    onShowToast(`Saved "${saved.name}" to browser storage`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      deleteSavedProject(id);
      setProjects(getSavedProjects());
      onShowToast(`Deleted "${name}"`);
    }
  };

  const handleDuplicate = (project: SavedProject) => {
    saveNamedProject(`${project.name} (Copy)`, project.settings);
    setProjects(getSavedProjects());
    onShowToast(`Duplicated "${project.name}"`);
  };

  const handleExportJson = (project: SavedProject) => {
    const jsonStr = exportProjectAsJson(project.settings, project.name);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-roomforge.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onShowToast(`Exported "${project.name}" configuration`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = validateAndImportProjectJson(content);
      if (res.success) {
        saveNamedProject(res.name, res.settings);
        setProjects(getSavedProjects());
        onLoadProject(res.settings, res.name);
        onShowToast(`Imported and opened "${res.name}"`);
        onClose();
      } else {
        setImportError(res.error);
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read project file.');
    };
    reader.readAsText(file);
    // Reset input so re-selecting same file triggers change
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-sand-300 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="projects-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4 bg-sand-50/80">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-forest" />
            <h2 id="projects-modal-title" className="text-lg font-black text-forest">
              My Saved Projects & Plans
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-sand-200 hover:text-charcoal transition-colors"
            title="Close dialog (Escape)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Save Current Room Form */}
          <div className="rounded-xl border border-sand-300 bg-sand-100/50 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest mb-2 flex items-center gap-1.5">
              <Save className="h-3.5 w-3.5 text-clay-600" />
              Save Active Room
            </h3>
            <form onSubmit={handleSaveCurrent} className="flex gap-2">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Master Bedroom, Basement Living Area"
                className="flex-1 text-sm bg-white"
                maxLength={60}
              />
              <Button type="submit" size="sm" className="bg-forest hover:bg-forest/90 shrink-0 gap-1.5 font-bold">
                <Save className="h-4 w-4" />
                Save Plan
              </Button>
            </form>
          </div>

          {/* Import Error Message */}
          {importError && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Section 2: Saved Projects List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
              Stored in Browser ({projects.length})
            </h3>

            {projects.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-xl border border-dashed border-sand-300 bg-sand-50/50">
                <FileCode className="h-8 w-8 text-muted/60 mx-auto mb-2" />
                <p className="text-sm font-semibold text-forest">No saved projects yet</p>
                <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                  Save your active room dimensions above or import a previously exported project configuration.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {projects.map((proj) => {
                  const mat = MATERIALS[proj.settings.material] || MATERIALS.vinyl;
                  const shape = proj.settings.shape === 'l-shape' ? 'L-shaped' : 'Rectangle';
                  const dateStr = new Date(proj.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={proj.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-sand-200 bg-white hover:border-sand-300 hover:shadow-xs transition-all"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="font-bold text-sm text-forest truncate">{proj.name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-muted mt-0.5">
                          <span>
                            {formatNumber(proj.settings.width, 1)} × {formatNumber(proj.settings.length, 1)} {proj.settings.unit} ({shape})
                          </span>
                          <span>·</span>
                          <span className="truncate">{mat.name}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-muted/80">
                            <Calendar className="h-3 w-3" />
                            {dateStr}
                          </span>
                        </div>
                      </div>

                      {/* Row Action Buttons */}
                      <div className="flex items-center space-x-1 shrink-0">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            onLoadProject(proj.settings, proj.name);
                            onShowToast(`Loaded "${proj.name}"`);
                            onClose();
                          }}
                          className="h-7 text-xs bg-forest hover:bg-forest/90 font-bold px-2.5"
                          title="Open this project in Studio"
                        >
                          Open
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(proj)}
                          className="h-7 w-7 p-0 text-muted hover:text-forest"
                          title="Duplicate project"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportJson(proj)}
                          className="h-7 w-7 p-0 text-muted hover:text-forest"
                          title="Download project JSON"
                        >
                          <Download className="h-3 w-3" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(proj.id, proj.name)}
                          className="h-7 w-7 p-0 text-muted hover:text-red-600"
                          title="Delete project"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Import & JSON backup */}
        <div className="border-t border-sand-200 bg-sand-50/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 gap-1.5 text-xs text-forest font-semibold"
            >
              <Upload className="h-3.5 w-3.5 text-clay-600" />
              Import Project JSON
            </Button>
          </div>

          <p className="text-[11px] text-muted">
            Projects stay privately on your device. Export JSON to sync between devices.
          </p>
        </div>
      </div>
    </div>
  );
}
