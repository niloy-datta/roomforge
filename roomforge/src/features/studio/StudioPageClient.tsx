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
  Check,
  Layers,
  Percent,
  DollarSign,
  PackageCheck,
  Maximize,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoomSvgRenderer } from '@/components/shared/RoomSvgRenderer';
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
  FlooringUnit,
  StudioSettings,
} from '@/features/calculations/types';

export function StudioPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [settings, setSettings] = useState<StudioSettings>(() => {
    return validatedSettings();
  });

  const [zoom, setZoom] = useState(1);
  const [mobileTab, setMobileTab] = useState<'inputs' | 'canvas' | 'estimate'>('canvas');
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);
  const [isSavedLocally, setIsSavedLocally] = useState(false);

  // Initialize settings from URL search params or localStorage
  useEffect(() => {
    if (searchParams && (searchParams.has('w') || searchParams.has('l'))) {
      const fromUrl = parseSearchParams(searchParams);
      setSettings(fromUrl);
    } else {
      const fromStorage = loadSettings();
      setSettings(fromStorage);
    }
  }, [searchParams]);

  // Recalculate on setting changes
  const result = useMemo(() => {
    return calculateFlooring(settings);
  }, [settings]);

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

    setSettings((prev) => ({
      ...prev,
      unit: newUnit,
      width: newWidth,
      length: newLength,
    }));
  };

  const handleMaterialSelect = (matKey: FlooringMaterialKey) => {
    const mat = MATERIALS[matKey];
    setSettings((prev) => ({
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
    const text = [
      'ROOMFORGE · Visual Flooring Shopping List',
      `Room Dimensions: ${formatNumber(settings.width, 2)} × ${formatNumber(settings.length, 2)} ${settings.unit}`,
      `Material: ${mat.name} (${settings.pattern} pattern)`,
      `Floor Area: ${formatNumber(result.areaSqFt, 2)} ft² (${formatNumber(result.areaSqM, 2)} m²)`,
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
    ].join('\n');

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

  const handleReset = () => {
    if (confirm('Reset your room and material settings to the default sample project?')) {
      clearSettings();
      setSettings({ ...DEFAULT_SETTINGS });
      setZoom(1);
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

      {/* Top Studio Bar */}
      <div className="border-b border-sand-300 bg-white/70 backdrop-blur-md sticky top-16 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Badge variant="sage" className="gap-1 font-mono text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-500 animate-pulse" />
              LIVE STUDIO
            </Badge>
            <span className="text-xs text-muted hidden sm:inline">
              {result.valid ? (
                isSavedLocally ? (
                  <span className="text-sage-700 font-medium">✓ Saved in this browser</span>
                ) : (
                  'Valid project'
                )
              ) : (
                <span className="text-red-600 font-medium">⚠ Fix inputs to calculate</span>
              )}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              id="copy-button"
              onClick={handleCopyShoppingList}
              className="gap-1.5 text-xs h-8"
              title="Copy shopping list to clipboard"
            >
              <Copy className="h-3.5 w-3.5 text-sage-600" />
              <span className="hidden md:inline">Copy List</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              id="share-button"
              onClick={handleShareUrl}
              className="gap-1.5 text-xs h-8"
              title="Copy shareable URL link"
            >
              <Share2 className="h-3.5 w-3.5 text-sage-600" />
              <span className="hidden md:inline">Share Link</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              id="print-button"
              onClick={handlePrint}
              className="gap-1.5 text-xs h-8"
              title="Print project estimate"
            >
              <Printer className="h-3.5 w-3.5 text-sage-600" />
              <span className="hidden md:inline">Print</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              id="reset-button"
              onClick={handleReset}
              className="text-xs h-8 text-muted hover:text-red-700 hover:bg-red-50"
              title="Reset to default"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden border-t border-sand-300 divide-x divide-sand-300 text-xs font-semibold bg-sand-50">
          <button
            type="button"
            onClick={() => setMobileTab('inputs')}
            className={`flex-1 py-2.5 text-center transition-colors ${
              mobileTab === 'inputs' ? 'bg-sand-200 text-forest font-bold' : 'text-muted'
            }`}
          >
            1. Dimensions
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('canvas')}
            className={`flex-1 py-2.5 text-center transition-colors ${
              mobileTab === 'canvas' ? 'bg-sand-200 text-forest font-bold' : 'text-muted'
            }`}
          >
            2. 2D Visualizer
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('estimate')}
            className={`flex-1 py-2.5 text-center transition-colors ${
              mobileTab === 'estimate' ? 'bg-sand-200 text-forest font-bold' : 'text-muted'
            }`}
          >
            3. Estimate
          </button>
        </div>
      </div>

      {/* Main Studio 3-Panel Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PANEL 1: Input Controls (Left Column) */}
          <section
            className={`lg:col-span-4 space-y-5 ${
              mobileTab !== 'inputs' ? 'hidden lg:block' : 'block'
            }`}
            aria-label="Room dimensions and materials controls"
          >
            {/* Room Dimensions Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-clay-600" />
                    Room Dimensions
                  </CardTitle>
                  {/* Unit Toggle */}
                  <div className="flex items-center rounded-lg border border-sand-300 bg-sand-100 p-0.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('ft')}
                      className={`rounded-md px-2.5 py-1 transition-all ${
                        settings.unit === 'ft'
                          ? 'bg-forest text-sand-50 shadow-xs'
                          : 'text-muted hover:text-charcoal'
                      }`}
                    >
                      Feet (ft)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitToggle('m')}
                      className={`rounded-md px-2.5 py-1 transition-all ${
                        settings.unit === 'm'
                          ? 'bg-forest text-sand-50 shadow-xs'
                          : 'text-muted hover:text-charcoal'
                      }`}
                    >
                      Meters (m)
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1.5">
                      Width ({settings.unit})
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
                      Length ({settings.unit})
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

                {/* Waste Allowance Slider */}
                <div className="pt-2 border-t border-sand-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-forest flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5 text-sage-600" />
                      Waste Allowance
                    </label>
                    <span className="text-xs font-bold text-clay-600 bg-clay-50 px-2 py-0.5 rounded border border-clay-200">
                      {settings.waste}%
                    </span>
                  </div>
                  <input
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-clay-600" />
                  Flooring Material
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  {MATERIAL_KEYS.map((key) => {
                    const mat = MATERIALS[key];
                    const isSelected = settings.material === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleMaterialSelect(key)}
                        className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-clay-500 bg-clay-50/40 ring-2 ring-clay-400/30'
                            : 'border-sand-300 bg-white hover:border-sand-400 hover:bg-sand-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <span
                            className="h-4 w-4 rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: mat.color }}
                          />
                          {isSelected && <Check className="h-3.5 w-3.5 text-clay-600" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-forest leading-tight">{mat.name}</p>
                          <p className="text-[11px] text-muted mt-0.5">
                            ${mat.price}/box · {mat.coverage} ft²
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Laying Pattern Switcher */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-forest mb-1.5">Laying Pattern</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings((p) => ({ ...p, pattern: 'staggered' }))}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        settings.pattern === 'staggered'
                          ? 'border-forest bg-forest text-sand-50'
                          : 'border-sand-300 bg-white text-muted-foreground hover:bg-sand-100'
                      }`}
                    >
                      Staggered Planks
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings((p) => ({ ...p, pattern: 'straight' }))}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        settings.pattern === 'straight'
                          ? 'border-forest bg-forest text-sand-50'
                          : 'border-sand-300 bg-white text-muted-foreground hover:bg-sand-100'
                      }`}
                    >
                      Straight Grid
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Box Coverage & Pricing Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-clay-600" />
                  Product & Pricing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Box Coverage (ft²)
                    </label>
                    <Input
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
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Price per Box</label>
                    <Input
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
                      suffix="$"
                      error={result.errors.price}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1">
                    Sales Tax (% optional)
                  </label>
                  <Input
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
                  <span className="text-[11px] text-muted">
                    ({settings.pattern === 'staggered' ? 'Staggered' : 'Straight'})
                  </span>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-1 rounded-lg border border-sand-200 bg-sand-50 p-1">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))}
                    disabled={zoom >= 1.7}
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
                    disabled={zoom <= 0.6}
                    className="p-1 rounded text-forest hover:bg-sand-200 disabled:opacity-40"
                    title="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="p-1 rounded text-forest hover:bg-sand-200"
                    title="Reset zoom"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* The Interactive SVG Canvas */}
              <div className="relative aspect-[720/510] w-full rounded-xl bg-sand-50/60 p-2 flex items-center justify-center border border-sand-200/60">
                <RoomSvgRenderer settings={settings} zoom={zoom} />
              </div>

              {/* Canvas bottom architectural legend */}
              <div className="mt-3 pt-3 border-t border-sand-200 flex items-center justify-between text-[11px] text-muted font-medium">
                <span>Top-down scale rendering</span>
                <span>Includes door cutaway & drop shadow</span>
              </div>
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
                    <span className="text-muted">Room Area</span>
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
                      <span className="text-muted">Sales Tax ({settings.waste}%)</span>
                      <span className="font-bold text-forest">{formatMoney(result.taxAmount)}</span>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="flex justify-between pt-2 text-sm font-black text-forest">
                    <span>Estimated Total</span>
                    <span id="total-cost" className="text-clay-600 text-lg">{formatMoney(result.totalCost)}</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <Button
                  onClick={handleCopyShoppingList}
                  className="w-full gap-2 shadow-md bg-clay-500 hover:bg-clay-600 font-bold"
                >
                  <Copy className="h-4 w-4" />
                  Copy Shopping List
                </Button>

                {/* Precision Note */}
                <p className="text-[10px] text-muted leading-tight text-center pt-2">
                  Material estimate only. Labor, transition trims, underlayment, subfloor prep and deliveries excluded.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Hidden Print Container */}
      <div className="hidden print:block p-8 bg-white text-black print-only">
        <h1 className="text-2xl font-black mb-1">ROOMFORGE · Visual Flooring Shopping List</h1>
        <p className="text-xs text-gray-600 mb-6">Generated on {new Date().toLocaleDateString()}</p>
        <table className="w-full text-sm border-collapse border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Room Dimensions</td>
              <td className="py-2 px-3">{settings.width} × {settings.length} {settings.unit}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Floor Area</td>
              <td className="py-2 px-3">{formatNumber(result.areaSqFt, 2)} ft² ({formatNumber(result.areaSqM, 2)} m²)</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Material</td>
              <td className="py-2 px-3">{activeMaterial.name} ({settings.pattern})</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Waste Allowance</td>
              <td className="py-2 px-3">{settings.waste}%</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Boxes to Purchase</td>
              <td className="py-2 px-3 font-bold text-base">{result.boxes} boxes</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Box Coverage</td>
              <td className="py-2 px-3">{formatNumber(settings.coverage, 2)} ft² / box</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Price per Box</td>
              <td className="py-2 px-3">{formatMoney(settings.price)}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-3 font-bold bg-gray-100">Estimated Total</td>
              <td className="py-2 px-3 font-bold text-base text-gray-900">{formatMoney(result.totalCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
