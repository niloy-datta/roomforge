'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  Copy,
  Printer,
  RotateCcw,
  RotateCw,
  Check,
  Layers,
  Percent,
  PackageCheck,
  Grid,
  Maximize,
  FolderOpen,
  FileSpreadsheet,
  Box,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoomSvgRenderer } from '@/components/shared/RoomSvgRenderer';
import { Room3dPerspectiveRenderer } from '@/components/shared/Room3dPerspectiveRenderer';
import { ProjectsModal } from './ProjectsModal';
import { buildFlooringMaterialRows, downloadCsv, generateMaterialsCsv } from '@/lib/csvExport';
import {
  calculateFlooring,
  convertLength,
  formatMoney,
  formatNumber,
} from '@/features/calculations/calculations';
import { DEFAULT_SETTINGS, MATERIALS, MATERIAL_KEYS } from '@/features/calculations/materials';
import {
  buildShareUrl,
  clearSettings,
  loadSettings,
  parseSearchParams,
  saveSettings,
  validatedSettings,
} from '@/features/calculations/state';
import {
  FlooringMaterialKey,
  FlooringPattern,
  FlooringUnit,
  StudioSettings,
} from '@/features/calculations/types';

export function StudioPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [settings, setSettings] = useState<StudioSettings>(() => {
    return validatedSettings();
  });

  // History stack for Undo / Redo
  const [history, setHistory] = useState<StudioSettings[]>([DEFAULT_SETTINGS]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [mobileTab, setMobileTab] = useState<'inputs' | 'canvas' | 'estimate'>('canvas');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);
  const [isSavedLocally, setIsSavedLocally] = useState(false);
  const [canvasMode, setCanvasMode] = useState<'2d' | '3d'>('2d');
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  // Initialize settings from URL search params or localStorage
  useEffect(() => {
    if (searchParams && (searchParams.has('w') || searchParams.has('l'))) {
      const fromUrl = parseSearchParams(searchParams);
      setSettings(fromUrl);
      setHistory([fromUrl]);
      setHistoryIndex(0);
    } else {
      const fromStorage = loadSettings();
      setSettings(fromStorage);
      setHistory([fromStorage]);
      setHistoryIndex(0);
    }
  }, [searchParams]);

  // Recalculate on setting changes
  const result = useMemo(() => {
    return calculateFlooring(settings);
  }, [settings]);

  // Push state to history stack (debounced for inputs)
  const updateSettingsWithHistory = useCallback((newSettings: StudioSettings | ((prev: StudioSettings) => StudioSettings)) => {
    setSettings((prev) => {
      const next = typeof newSettings === 'function' ? newSettings(prev) : newSettings;
      setHistory((h) => {
        const sliced = h.slice(0, historyIndex + 1);
        return [...sliced, next].slice(-25); // preserve last 25 steps
      });
      setHistoryIndex((idx) => Math.min(idx + 1, 24));
      return next;
    });
  }, [historyIndex]);

  // Undo / Redo handlers
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    const prevIndex = historyIndex - 1;
    setHistoryIndex(prevIndex);
    setSettings(history[prevIndex]);
  }, [canUndo, historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    setSettings(history[nextIndex]);
  }, [canRedo, historyIndex, history]);

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Auto-save valid settings to localStorage
  useEffect(() => {
    if (result.valid) {
      const ok = saveSettings(settings);
      setIsSavedLocally(ok);
    } else {
      setIsSavedLocally(false);
    }
  }, [settings, result.valid]);

  const showToast = useCallback((msg: string) => {
    setCopiedNotice(msg);
    setTimeout(() => setCopiedNotice(null), 3500);
  }, []);

  const handleUnitToggle = (newUnit: FlooringUnit) => {
    if (newUnit === settings.unit) return;
    const oldUnit = settings.unit;
    const newWidth = Number.isFinite(settings.width)
      ? Number(convertLength(settings.width, oldUnit, newUnit).toPrecision(8))
      : settings.width;
    const newLength = Number.isFinite(settings.length)
      ? Number(convertLength(settings.length, oldUnit, newUnit).toPrecision(8))
      : settings.length;
    const newCutoutWidth = Number.isFinite(settings.cutoutWidth)
      ? Number(convertLength(settings.cutoutWidth, oldUnit, newUnit).toPrecision(8))
      : settings.cutoutWidth;
    const newCutoutLength = Number.isFinite(settings.cutoutLength)
      ? Number(convertLength(settings.cutoutLength, oldUnit, newUnit).toPrecision(8))
      : settings.cutoutLength;

    updateSettingsWithHistory((prev) => ({
      ...prev,
      unit: newUnit,
      width: newWidth,
      length: newLength,
      cutoutWidth: newCutoutWidth,
      cutoutLength: newCutoutLength,
    }));
  };

  const handleMaterialSelect = (matKey: FlooringMaterialKey) => {
    const mat = MATERIALS[matKey];
    updateSettingsWithHistory((prev) => ({
      ...prev,
      material: matKey,
      coverage: mat.coverage,
      price: mat.price,
    }));
    showToast(`Switched to ${mat.name}. Sample coverage and price updated.`);
  };

  const handleCopyShoppingList = async () => {
    if (!result.valid) {
      showToast('Enter valid room dimensions before copying.');
      return;
    }
    const mat = MATERIALS[settings.material];
    const shapeLabel = settings.shape === 'l-shape' ? 'L-Shaped Room' : 'Rectangular Room';
    const text = [
      'ROOMFORGE · Visual Flooring Shopping List',
      `Room Shape: ${shapeLabel}`,
      `Total Dimensions: ${formatNumber(settings.width, 2)} × ${formatNumber(settings.length, 2)} ${settings.unit}`,
      settings.shape === 'l-shape'
        ? `Corner Cutout: ${formatNumber(settings.cutoutWidth, 2)} × ${formatNumber(settings.cutoutLength, 2)} ${settings.unit}`
        : null,
      `Material: ${mat.name} (${settings.pattern} pattern)`,
      `Net Floor Area: ${formatNumber(result.areaSqFt, 2)} ft² (${formatNumber(result.areaSqM, 2)} m²)`,
      `Perimeter (Trims & Baseboards): ${formatNumber(result.perimeterFt, 1)} ft (${formatNumber(result.perimeterM, 1)} m)`,
      `Waste Allowance: ${settings.waste}%`,
      `Coverage Needed: ${formatNumber(result.neededSqFt, 2)} ft²`,
      `Coverage per Box: ${formatNumber(settings.coverage, 2)} ft²`,
      `Boxes to Purchase: ${result.boxes} boxes`,
      `Price per Box: ${formatMoney(settings.price)}`,
      `Material Subtotal: ${formatMoney(result.materialCost)}`,
      `Estimated Sales Tax: ${formatMoney(result.taxAmount)}`,
      `Total Project Cost: ${formatMoney(result.totalCost)}`,
      '',
      'Notes: Materials estimate only. Excludes subfloor prep, underlayment, trims, transitions, labor and tool rental.',
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(text);
      showToast('Shopping list copied to clipboard!');
    } catch {
      window.prompt('Copy your shopping list:', text);
    }
  };

  const handleShareUrl = async () => {
    if (!result.valid) {
      showToast('Please fix highlighted errors before sharing.');
      return;
    }
    const url = buildShareUrl(settings);
    try {
      await navigator.clipboard.writeText(url);
      showToast('Shareable project link copied to clipboard!');
    } catch {
      window.prompt('Copy project URL:', url);
    }
  };

  const handlePrint = () => {
    if (!result.valid) {
      showToast('Please enter valid dimensions before printing.');
      return;
    }
    window.print();
  };

  const handleExportCsv = () => {
    if (!result.valid) {
      showToast('Please enter valid room dimensions before exporting CSV.');
      return;
    }
    const rows = buildFlooringMaterialRows(settings, result);
    const csv = generateMaterialsCsv(rows, [
      'ROOMFORGE · Visual Flooring Shopping & Materials List',
      `Room Type: ${settings.shape === 'l-shape' ? 'L-Shaped Room' : 'Rectangular Room'} (${settings.width} × ${settings.length} ${settings.unit})`,
      `Generated: ${new Date().toLocaleDateString()}`,
    ]);
    const filename = `roomforge-${settings.material}-${settings.shape}-estimate.csv`;
    const ok = downloadCsv(filename, csv);
    if (ok) {
      showToast('Downloaded materials list (CSV) for Excel!');
    } else {
      showToast('Failed to trigger CSV download.');
    }
  };

  const handleReset = () => {
    if (confirm('Reset your room and material settings to the default sample project?')) {
      clearSettings();
      setSettings({ ...DEFAULT_SETTINGS });
      setHistory([DEFAULT_SETTINGS]);
      setHistoryIndex(0);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      router.replace('/studio');
      showToast('Project reset to default room.');
    }
  };

  const activeMaterial = MATERIALS[settings.material] || MATERIALS.vinyl;

  return (
    <div className="min-h-screen bg-sand-100/60 pb-20">
      {/* Toast Notification */}
      {copiedNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-sand-50 shadow-xl border border-sage-600 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="h-4 w-4 text-clay-400" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* Top Studio Action Bar */}
      <div className="border-b border-sand-300 bg-white/80 backdrop-blur-md sticky top-16 z-20 transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Badge variant="sage" className="gap-1.5 font-mono text-[11px] tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-500 animate-pulse" />
              Interactive Studio
            </Badge>
            <span className="text-xs text-muted hidden sm:inline">
              {result.valid ? (
                isSavedLocally ? (
                  <span className="text-sage-700 font-medium">✓ Saved in this browser</span>
                ) : (
                  'Valid project'
                )
              ) : (
                <span className="text-red-600 font-medium">⚠ Fix highlighted dimensions</span>
              )}
            </span>
          </div>

          {/* Quick Actions (Undo/Redo, Copy, Share, Print, Reset) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={!canUndo}
              className="h-8 px-2 text-xs"
              title="Undo change (Ctrl+Z)"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={!canRedo}
              className="h-8 px-2 text-xs"
              title="Redo change (Ctrl+Y)"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </Button>

            <Button
              id="projects-button"
              variant="outline"
              size="sm"
              onClick={() => setIsProjectsModalOpen(true)}
              className="gap-1.5 text-xs h-8 text-forest font-bold border-sand-300 hover:bg-sand-100"
              title="Open saved projects and plans"
            >
              <FolderOpen className="h-3.5 w-3.5 text-clay-600" />
              <span className="hidden sm:inline">Projects</span>
            </Button>

            <Button
              id="copy-button"
              variant="outline"
              size="sm"
              onClick={handleCopyShoppingList}
              className="gap-1.5 text-xs h-8"
              title="Copy shopping list to clipboard"
            >
              <Copy className="h-3.5 w-3.5 text-sage-600" />
              <span className="hidden md:inline">Copy List</span>
            </Button>

            <Button
              id="export-csv-button"
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="gap-1.5 text-xs h-8"
              title="Download materials list CSV for Excel / Sheets"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-sage-600" />
              <span className="hidden md:inline">CSV</span>
            </Button>

            <Button
              id="share-button"
              variant="outline"
              size="sm"
              onClick={handleShareUrl}
              className="gap-1.5 text-xs h-8"
              title="Copy shareable URL link"
            >
              <Share2 className="h-3.5 w-3.5 text-sage-600" />
              <span className="hidden md:inline">Share</span>
            </Button>

            <Button
              id="print-button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs h-8"
              title="Print project estimate"
            >
              <Printer className="h-3.5 w-3.5 text-sage-600" />
              <span className="hidden md:inline">Print</span>
            </Button>

            <Button
              id="reset-button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs text-muted hover:text-red-600"
              title="Reset to default settings"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden border-b border-sand-300 bg-sand-200/90 px-4 py-2 sticky top-[113px] z-10 flex space-x-2">
        <button
          type="button"
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
            mobileTab === 'canvas'
              ? 'bg-forest text-sand-50 shadow-xs'
              : 'text-muted-foreground hover:bg-sand-300'
          }`}
        >
          2D Plan
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('inputs')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
            mobileTab === 'inputs'
              ? 'bg-forest text-sand-50 shadow-xs'
              : 'text-muted-foreground hover:bg-sand-300'
          }`}
        >
          Room & Material
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('estimate')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
            mobileTab === 'estimate'
              ? 'bg-forest text-sand-50 shadow-xs'
              : 'text-muted-foreground hover:bg-sand-300'
          }`}
        >
          Estimate & Cost
        </button>
      </div>

      {/* Main Studio Body: 3-Column Architectural Desktop Layout */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6" id="main-content">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PANEL 1: Room Dimensions & Material Controls (Left Column) */}
          <section
            className={`lg:col-span-4 space-y-5 ${
              mobileTab !== 'inputs' ? 'hidden lg:block' : 'block'
            }`}
            aria-label="Room geometry and material settings"
          >
            {/* Room Geometry Card */}
            <Card className="border-sand-300 shadow-sm">
              <CardHeader className="pb-3 border-b border-sand-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2 text-forest">
                    <Maximize className="h-4 w-4 text-clay-600" />
                    Room Geometry
                  </CardTitle>
                  {/* Feet / Meters Switcher */}
                  <div className="flex rounded-md border border-sand-300 bg-sand-100 p-0.5 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('ft')}
                      className={`px-2 py-0.5 rounded transition-all ${
                        settings.unit === 'ft'
                          ? 'bg-forest text-sand-50 font-bold shadow-xs'
                          : 'text-muted hover:text-charcoal'
                      }`}
                    >
                      ft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('m')}
                      className={`px-2 py-0.5 rounded transition-all ${
                        settings.unit === 'm'
                          ? 'bg-forest text-sand-50 font-bold shadow-xs'
                          : 'text-muted hover:text-charcoal'
                      }`}
                    >
                      m
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Shape Selection: Rectangle vs L-Shape */}
                <div>
                  <label className="block text-xs font-bold text-forest mb-1.5">
                    Room Floor Shape
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateSettingsWithHistory((prev) => ({ ...prev, shape: 'rectangle' }))
                      }
                      className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center ${
                        settings.shape === 'rectangle'
                          ? 'border-forest bg-forest text-sand-50 shadow-xs'
                          : 'border-sand-300 bg-white text-charcoal hover:bg-sand-50'
                      }`}
                    >
                      Rectangular Room
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettingsWithHistory((prev) => ({ ...prev, shape: 'l-shape' }))
                      }
                      className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center ${
                        settings.shape === 'l-shape'
                          ? 'border-forest bg-forest text-sand-50 shadow-xs'
                          : 'border-sand-300 bg-white text-charcoal hover:bg-sand-50'
                      }`}
                    >
                      L-Shaped Room
                    </button>
                  </div>
                </div>

                {/* Overall Dimensions (Width x Length) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1.5">
                      Total Width ({settings.unit})
                    </label>
                    <Input
                      id="width"
                      type="number"
                      step="any"
                      min="0.1"
                      max={settings.unit === 'm' ? '152.4' : '500'}
                      value={Number.isFinite(settings.width) ? settings.width : ''}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          width: e.target.value === '' ? (NaN as unknown as number) : Number(e.target.value),
                        }))
                      }
                      suffix={settings.unit}
                      error={result.errors.width}
                      placeholder="e.g. 12"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1.5">
                      Total Length ({settings.unit})
                    </label>
                    <Input
                      id="length"
                      type="number"
                      step="any"
                      min="0.1"
                      max={settings.unit === 'm' ? '152.4' : '500'}
                      value={Number.isFinite(settings.length) ? settings.length : ''}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          length: e.target.value === '' ? (NaN as unknown as number) : Number(e.target.value),
                        }))
                      }
                      suffix={settings.unit}
                      error={result.errors.length}
                      placeholder="e.g. 18"
                    />
                  </div>
                </div>

                {/* L-Shaped Corner Cutout Inputs */}
                {settings.shape === 'l-shape' && (
                  <div className="p-3.5 rounded-xl bg-sand-200/60 border border-sand-300 space-y-3">
                    <span className="text-xs font-bold text-forest block">
                      Corner Cutout Dimensions
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-muted mb-1">
                          Cutout Width ({settings.unit})
                        </label>
                        <Input
                          type="number"
                          step="any"
                          min="0.1"
                          value={Number.isFinite(settings.cutoutWidth) ? settings.cutoutWidth : ''}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              cutoutWidth: e.target.value === '' ? (NaN as unknown as number) : Number(e.target.value),
                            }))
                          }
                          suffix={settings.unit}
                          error={result.errors.cutoutWidth}
                          placeholder="e.g. 4"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-muted mb-1">
                          Cutout Length ({settings.unit})
                        </label>
                        <Input
                          type="number"
                          step="any"
                          min="0.1"
                          value={Number.isFinite(settings.cutoutLength) ? settings.cutoutLength : ''}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              cutoutLength: e.target.value === '' ? (NaN as unknown as number) : Number(e.target.value),
                            }))
                          }
                          suffix={settings.unit}
                          error={result.errors.cutoutLength}
                          placeholder="e.g. 6"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Waste Allowance Slider */}
                <div className="pt-2 border-t border-sand-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-forest flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5 text-sage-600" />
                      Waste Allowance
                    </label>
                    <span className="text-xs font-bold text-clay-600 bg-clay-50 px-2 py-0.5 rounded border border-clay-200 font-mono">
                      {settings.waste}%
                    </span>
                  </div>
                  <input
                    id="waste"
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={settings.waste}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, waste: Number(e.target.value) }))
                    }
                    className="w-full h-1.5 bg-sand-300 rounded-lg appearance-none cursor-pointer accent-clay-500"
                  />
                  <div className="flex justify-between text-[10px] text-muted font-medium mt-1">
                    <span>0% (Tight)</span>
                    <span>10% (Standard)</span>
                    <span>20%+ (Diagonal/Cut heavy)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flooring Material Presets Card */}
            <Card className="border-sand-300 shadow-sm">
              <CardHeader className="pb-3 border-b border-sand-200">
                <CardTitle className="text-base flex items-center gap-2 text-forest">
                  <Layers className="h-4 w-4 text-clay-600" />
                  Flooring Material & Presets
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-2.5">
                  {MATERIAL_KEYS.map((key) => {
                    const mat = MATERIALS[key];
                    const isSelected = settings.material === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleMaterialSelect(key)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-clay-500 bg-clay-50/70 shadow-xs ring-1 ring-clay-400'
                            : 'border-sand-300 bg-white hover:bg-sand-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/15 shadow-xs shrink-0"
                            style={{ backgroundColor: mat.color }}
                          />
                          <span className="text-xs font-bold text-forest truncate">{mat.short}</span>
                        </div>
                        <p className="text-[10px] text-muted mt-1 truncate">
                          {formatMoney(mat.price)} · {mat.coverage} ft²/box
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Laying Pattern Selector */}
                <div className="pt-2 border-t border-sand-200">
                  <label className="block text-xs font-bold text-forest mb-2">
                    Laying Pattern
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'staggered', label: 'Staggered (1/2 Offset)' },
                      { id: 'straight', label: 'Straight (Grid Stack)' },
                      { id: 'diagonal', label: 'Diagonal 45° Angle' },
                      { id: 'herringbone', label: 'Herringbone Parquet' },
                    ].map((pat) => (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() =>
                          updateSettingsWithHistory((prev) => ({
                            ...prev,
                            pattern: pat.id as FlooringPattern,
                          }))
                        }
                        className={`p-2 rounded-lg border text-xs font-medium transition-all text-center ${
                          settings.pattern === pat.id
                            ? 'border-forest bg-forest text-sand-50 font-bold shadow-xs'
                            : 'border-sand-300 bg-white text-muted hover:text-charcoal hover:bg-sand-50'
                        }`}
                      >
                        {pat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editable Material Details (Box Coverage, Price, Sales Tax) */}
                <div className="pt-2 border-t border-sand-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-forest mb-1">
                        Coverage / Box
                      </label>
                      <Input
                        id="coverage"
                        type="number"
                        step="any"
                        min="1"
                        max="2000"
                        value={Number.isFinite(settings.coverage) ? settings.coverage : ''}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            coverage: e.target.value === '' ? (NaN as unknown as number) : Number(e.target.value),
                          }))
                        }
                        suffix="ft²"
                        error={result.errors.coverage}
                        placeholder="24"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-forest mb-1">
                        Price / Box
                      </label>
                      <Input
                        id="price"
                        type="number"
                        step="any"
                        min="0"
                        max="100000"
                        value={Number.isFinite(settings.price) ? settings.price : ''}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            price: e.target.value === '' ? (NaN as unknown as number) : Number(e.target.value),
                          }))
                        }
                        prefix="$"
                        error={result.errors.price}
                        placeholder="45"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Sales Tax (% optional)
                    </label>
                    <Input
                      id="tax"
                      type="number"
                      step="any"
                      min="0"
                      max="40"
                      value={Number.isFinite(settings.tax) ? settings.tax : ''}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          tax: e.target.value === '' ? (NaN as unknown as number) : Number(e.target.value),
                        }))
                      }
                      suffix="%"
                      error={result.errors.tax}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* PANEL 2: SVG Visualization Canvas (Middle Column) */}
          <section
            className={`lg:col-span-5 space-y-4 ${
              mobileTab !== 'canvas' ? 'hidden lg:block' : 'block'
            }`}
            aria-label="Interactive 2D room floor plan preview"
          >
            <div className="rounded-2xl border border-sand-300 bg-white p-4 shadow-sm relative overflow-hidden">
              {/* Canvas Header bar */}
              <div className="flex items-center justify-between border-b border-sand-200 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: activeMaterial.color }}
                  />
                  <span className="text-xs font-bold text-forest">{activeMaterial.name}</span>
                  <span className="text-[11px] text-muted capitalize hidden sm:inline">
                    ({settings.pattern})
                  </span>
                </div>

                {/* 2D / 3D Canvas Switcher */}
                <div className="flex rounded-md border border-sand-300 bg-sand-100 p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setCanvasMode('2d')}
                    className={`px-2.5 py-1 rounded transition-all text-xs ${
                      canvasMode === '2d'
                        ? 'bg-forest text-sand-50 shadow-xs font-bold'
                        : 'text-muted hover:text-charcoal'
                    }`}
                  >
                    2D Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanvasMode('3d')}
                    className={`px-2.5 py-1 rounded transition-all text-xs flex items-center gap-1.5 ${
                      canvasMode === '3d'
                        ? 'bg-forest text-sand-50 shadow-xs font-bold'
                        : 'text-muted hover:text-charcoal'
                    }`}
                  >
                    <Box className="h-3.5 w-3.5" />
                    3D View
                  </button>
                </div>

                {/* Canvas Zoom & View Controls (Only in 2D Mode) */}
                {canvasMode === '2d' && (
                  <div className="flex items-center space-x-1 rounded-lg border border-sand-200 bg-sand-50 p-1">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.15).toFixed(2))))}
                      disabled={zoom >= 1.95}
                      className="p-1 rounded text-forest hover:bg-sand-200 disabled:opacity-40"
                      title="Zoom in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                    <span className="text-[11px] font-mono font-semibold px-1 text-muted">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
                      disabled={zoom <= 0.55}
                      className="p-1 rounded text-forest hover:bg-sand-200 disabled:opacity-40"
                      title="Zoom out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                      }}
                      className="p-1 rounded text-forest hover:bg-sand-200"
                      title="Reset view"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettingsWithHistory((prev) => ({
                          ...prev,
                          showGrid: prev.showGrid === false ? true : false,
                        }))
                      }
                      className={`p-1 rounded transition-colors ${
                        settings.showGrid !== false ? 'text-forest bg-sand-200' : 'text-muted hover:bg-sand-200'
                      }`}
                      title="Toggle architectural grid"
                    >
                      <Grid className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Canvas Content: 2D Interactive SVG or 3D Spatial Perspective */}
              {canvasMode === '2d' ? (
                <>
                  <div className="relative aspect-[720/510] w-full rounded-xl bg-sand-50/70 p-2 flex items-center justify-center border border-sand-200/60 overflow-hidden">
                    <RoomSvgRenderer settings={settings} zoom={zoom} pan={pan} onPanChange={setPan} />
                  </div>
                  {/* Canvas bottom architectural legend */}
                  <div className="mt-3 pt-3 border-t border-sand-200 flex items-center justify-between text-[11px] text-muted font-medium">
                    <span>Scale 2D blueprint rendering</span>
                    <span>Includes door cutaway & drop shadow</span>
                  </div>
                </>
              ) : (
                <Room3dPerspectiveRenderer settings={settings} />
              )}
            </div>
          </section>

          {/* PANEL 3: Estimate & Shopping List (Right Column) */}
          <section
            className={`lg:col-span-3 space-y-5 ${
              mobileTab !== 'estimate' ? 'hidden lg:block' : 'block'
            }`}
            aria-label="Material quantity and cost estimate"
          >
            <Card className="border-forest/20 shadow-md bg-gradient-to-b from-white to-sand-50">
              <CardHeader className="pb-3 border-b border-sand-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-forest flex items-center gap-1.5">
                    <PackageCheck className="h-4 w-4 text-clay-600" />
                    Material Estimate
                  </CardTitle>
                  <Badge variant="sage" className="font-mono text-xs">
                    {result.boxes ? `${result.boxes} Boxes` : '—'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Highlight Total Boxes */}
                <div className="rounded-xl bg-sage-50 border border-sage-200 p-4 text-center">
                  <span className="text-xs uppercase font-bold text-sage-700 tracking-wider">
                    Boxes to Purchase
                  </span>
                  <div id="box-count" className="text-3xl font-black text-forest mt-0.5">
                    {result.boxes !== undefined ? `${result.boxes} boxes` : '—'}
                  </div>
                  <span className="text-[11px] text-muted mt-1 block">
                    {result.purchasedSqFt !== undefined
                      ? `${formatNumber(result.purchasedSqFt, 1)} ft² total coverage`
                      : '—'}
                  </span>
                </div>

                {/* Detailed Math Breakdown Rows */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-sand-200">
                    <span className="text-muted">Net Room Area</span>
                    <span id="area-number" className="font-bold text-forest">
                      {result.areaSqFt !== undefined
                        ? settings.unit === 'ft'
                          ? `${formatNumber(result.areaSqFt, 2)} ft²`
                          : `${formatNumber(result.areaSqM, 2)} m²`
                        : '—'}
                      <span className="text-[10px] text-muted font-normal ml-1">
                        (≈{' '}
                        {result.areaSqFt !== undefined
                          ? settings.unit === 'ft'
                            ? `${formatNumber(result.areaSqM, 2)} m²`
                            : `${formatNumber(result.areaSqFt, 2)} ft²`
                          : '—'}
                        )
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-sand-200">
                    <span className="text-muted">Perimeter (Trims)</span>
                    <span className="font-bold text-forest">
                      {result.perimeterFt !== undefined
                        ? settings.unit === 'ft'
                          ? `${formatNumber(result.perimeterFt, 1)} ft`
                          : `${formatNumber(result.perimeterM, 1)} m`
                        : '—'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-sand-200">
                    <span className="text-muted">Waste Allowance</span>
                    <span className="font-bold text-forest">{settings.waste}%</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-sand-200">
                    <span className="text-muted">Coverage Needed</span>
                    <span className="font-bold text-forest">
                      {result.neededSqFt !== undefined
                        ? `${formatNumber(result.neededSqFt, 2)} ft²`
                        : '—'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-sand-200">
                    <span className="text-muted">Surplus Offcut</span>
                    <span className="font-bold text-forest">
                      {result.surplusSqFt !== undefined
                        ? `${formatNumber(result.surplusSqFt, 2)} ft²`
                        : '—'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-sand-200">
                    <span className="text-muted">Price per Box</span>
                    <span className="font-bold text-forest">{formatMoney(settings.price)}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-sand-200">
                    <span className="text-muted">Cost per Sq Ft</span>
                    <span className="font-bold text-forest">{formatMoney(result.costPerSqFt)}/ft²</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-sand-200">
                    <span className="text-muted">Material Subtotal</span>
                    <span className="font-bold text-forest">{formatMoney(result.materialCost)}</span>
                  </div>

                  {settings.tax > 0 && (
                    <div className="flex justify-between py-1 border-b border-sand-200">
                      <span className="text-muted">Sales Tax ({settings.tax}%)</span>
                      <span className="font-bold text-forest">{formatMoney(result.taxAmount)}</span>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="flex justify-between pt-2 text-sm font-black text-forest">
                    <span>Estimated Total</span>
                    <span id="total-cost" className="text-clay-600 text-lg">{formatMoney(result.totalCost)}</span>
                  </div>
                </div>

                {/* Primary & Export Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={handleCopyShoppingList}
                    className="w-full gap-2 shadow-md bg-clay-500 hover:bg-clay-600 font-bold"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Shopping List
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleExportCsv}
                    className="w-full gap-2 border-sand-300 text-forest hover:bg-sand-100 font-semibold text-xs"
                    title="Download spreadsheet-compatible CSV materials estimate"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-clay-600" />
                    Export Materials (CSV)
                  </Button>
                </div>

                {/* Precision Note */}
                <p className="text-[10px] text-muted leading-tight text-center pt-2">
                  Deterministic calculation based on manufacturer specifications. Excludes subfloor preparation, adhesives, and labor.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Hidden Print Container: Printed cleanly when window.print() is called */}
      <div className="hidden print:block p-8 bg-white text-black print-only">
        <h1 className="text-2xl font-black mb-1">ROOMFORGE · Visual Flooring Shopping List</h1>
        <p className="text-xs text-gray-600 mb-6">Generated on {new Date().toLocaleDateString()}</p>
        <table className="w-full text-sm border-collapse border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Room Shape</td>
              <td className="py-2 px-3">{settings.shape === 'l-shape' ? 'L-Shaped Room' : 'Rectangular Room'}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Total Dimensions</td>
              <td className="py-2 px-3">{settings.width} × {settings.length} {settings.unit}</td>
            </tr>
            {settings.shape === 'l-shape' && (
              <tr className="border-b border-gray-300">
                <td className="py-2 px-3 font-bold bg-gray-100">Corner Cutout</td>
                <td className="py-2 px-3">{settings.cutoutWidth} × {settings.cutoutLength} {settings.unit}</td>
              </tr>
            )}
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Material & Pattern</td>
              <td className="py-2 px-3">{activeMaterial.name} ({settings.pattern})</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Net Floor Area</td>
              <td className="py-2 px-3">{formatNumber(result.areaSqFt, 2)} ft² ({formatNumber(result.areaSqM, 2)} m²)</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Perimeter (Trims)</td>
              <td className="py-2 px-3">{formatNumber(result.perimeterFt, 1)} ft</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Waste Factor</td>
              <td className="py-2 px-3">{settings.waste}%</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Total Required Coverage</td>
              <td className="py-2 px-3">{formatNumber(result.neededSqFt, 2)} ft²</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Box Specification</td>
              <td className="py-2 px-3">{settings.coverage} ft² per carton</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-50">
              <td className="py-2 px-3 font-bold">Boxes to Purchase</td>
              <td className="py-2 px-3 font-bold text-base">{result.boxes} boxes</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Material Subtotal</td>
              <td className="py-2 px-3">{formatMoney(result.materialCost)}</td>
            </tr>
            <tr className="border-b border-gray-300 bg-gray-100 font-bold">
              <td className="py-2 px-3">Total Estimated Cost</td>
              <td className="py-2 px-3 text-lg">{formatMoney(result.totalCost)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-[11px] text-gray-500 mt-6">
          * Materials estimation only. Excludes subfloor leveling, underlayment, baseboard trims, adhesives, and labor.
        </p>
      </div>

      {/* Multi-Project Management, Backup & JSON Restore Modal */}
      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        currentSettings={settings}
        onLoadProject={(newSettings) => updateSettingsWithHistory(newSettings)}
        onShowToast={showToast}
      />
    </div>
  );
}
