'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Grid, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  calculateTile,
  TILE_PRESETS,
  GROUT_WIDTH_PRESETS,
} from '@/features/calculations/tileCalculations';
import { formatMoney } from '@/features/calculations/calculations';
import { AdSlot } from '@/components/ads/AdSlot';

export function TileCalculatorClient() {
  const [area, setArea] = useState('150');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [tileLength, setTileLength] = useState(String(TILE_PRESETS[0].length));
  const [tileWidth, setTileWidth] = useState(String(TILE_PRESETS[0].width));
  const [tileThickness, setTileThickness] = useState(String(TILE_PRESETS[0].thickness));
  const [tilesPerBox, setTilesPerBox] = useState(String(TILE_PRESETS[0].defaultBox));
  const [jointWidth, setJointWidth] = useState(String(GROUT_WIDTH_PRESETS[1].value)); // 1/8"
  const [wastePercent, setWastePercent] = useState('10');
  const [pricePerBox, setPricePerBox] = useState('48');
  const [pricePerGroutBag, setPricePerGroutBag] = useState('29.50');

  const handlePresetChange = (idx: number) => {
    setSelectedPresetIndex(idx);
    const p = TILE_PRESETS[idx];
    setTileLength(String(p.length));
    setTileWidth(String(p.width));
    setTileThickness(String(p.thickness));
    setTilesPerBox(String(p.defaultBox));
  };

  const result = calculateTile({
    area: Number(area) || 0,
    tileLengthInches: Number(tileLength) || 12,
    tileWidthInches: Number(tileWidth) || 12,
    tileThicknessInches: Number(tileThickness) || 0.375,
    jointWidthInches: Number(jointWidth) || 0.125,
    wastePercent: Number(wastePercent) || 10,
    tilesPerBox: Number(tilesPerBox) || 8,
    pricePerBox: Number(pricePerBox) || 0,
    groutBagWeightLbs: 25,
    pricePerGroutBag: Number(pricePerGroutBag) || 0,
  });

  const handleReset = () => {
    setArea('150');
    handlePresetChange(0);
    setJointWidth(String(GROUT_WIDTH_PRESETS[1].value));
    setWastePercent('10');
    setPricePerBox('48');
    setPricePerGroutBag('29.50');
  };

  return (
    <div className="space-y-8">
      <AdSlot format="horizontal-banner" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold text-forest flex items-center gap-2">
                <Grid className="h-5 w-5 text-clay-500" />
                Tile & Grout Dimensions
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-muted">
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Defaults
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Coverage Area */}
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Total Installation Area (Walls, Floor or Backsplash)
                </label>
                <Input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  suffix="sq ft"
                  placeholder="150"
                />
              </div>

              {/* Tile Size Presets */}
              <div>
                <label className="block text-xs font-bold text-forest mb-2">Tile Dimension Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TILE_PRESETS.map((p, idx) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handlePresetChange(idx)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        selectedPresetIndex === idx
                          ? 'border-forest bg-forest/5 font-bold text-forest ring-1 ring-forest/30'
                          : 'border-sand-300 bg-white text-muted-foreground hover:bg-sand-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Tile Dimensions */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Tile Length</label>
                  <Input
                    type="number"
                    value={tileLength}
                    onChange={(e) => {
                      setTileLength(e.target.value);
                      setSelectedPresetIndex(-1);
                    }}
                    suffix="in"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Tile Width</label>
                  <Input
                    type="number"
                    value={tileWidth}
                    onChange={(e) => {
                      setTileWidth(e.target.value);
                      setSelectedPresetIndex(-1);
                    }}
                    suffix="in"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Thickness</label>
                  <Input
                    type="number"
                    step="0.05"
                    value={tileThickness}
                    onChange={(e) => setTileThickness(e.target.value)}
                    suffix="in"
                  />
                </div>
              </div>

              {/* Grout Joint Width */}
              <div>
                <label className="block text-xs font-bold text-forest mb-2">Grout Joint Spacing</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GROUT_WIDTH_PRESETS.map((g) => {
                    const isSelected = Number(jointWidth) === g.value;
                    return (
                      <button
                        key={g.label}
                        type="button"
                        onClick={() => setJointWidth(String(g.value))}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? 'border-forest bg-forest/5 font-bold text-forest ring-1 ring-forest/30'
                            : 'border-sand-300 bg-white text-muted hover:bg-sand-50'
                        }`}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Packaging and Pricing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-sand-200">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Tiles / Box</label>
                  <Input
                    type="number"
                    value={tilesPerBox}
                    onChange={(e) => setTilesPerBox(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Waste Factor</label>
                  <Input
                    type="number"
                    value={wastePercent}
                    onChange={(e) => setWastePercent(e.target.value)}
                    suffix="%"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Price / Box</label>
                  <Input
                    type="number"
                    value={pricePerBox}
                    onChange={(e) => setPricePerBox(e.target.value)}
                    prefix="$"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Grout / 25lb Bag</label>
                  <Input
                    type="number"
                    value={pricePerGroutBag}
                    onChange={(e) => setPricePerGroutBag(e.target.value)}
                    prefix="$"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-forest/20 shadow-md bg-white">
            <CardHeader className="bg-forest text-sand-50 rounded-t-xl pb-4">
              <Badge variant="sage" className="w-fit text-[10px] font-mono mb-1">
                TCNA STANDARD FORMULA
              </Badge>
              <CardTitle className="text-2xl font-black">
                {result.valid ? `${result.boxesNeeded} Tile Boxes Required` : 'Enter Valid Specs'}
              </CardTitle>
              <p className="text-xs text-sand-200">
                {result.grossTileCount} individual tiles needed for {result.grossAreaSqFt} sq ft gross coverage
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-center">
                  <span className="text-[11px] uppercase font-bold text-muted block">Grout Powder</span>
                  <span className="text-xl font-black text-forest mt-0.5 block">{result.groutPounds} lbs</span>
                  <span className="text-[10px] text-muted block mt-0.5">({result.groutBagsNeeded} × 25 lb bags)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-center">
                  <span className="text-[11px] uppercase font-bold text-muted block">Tile Spacers</span>
                  <span className="text-xl font-black text-forest mt-0.5 block">~{result.spacersCount} pcs</span>
                  <span className="text-[10px] text-muted block mt-0.5">(Includes 15% spares)</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs border-y border-sand-200 py-4">
                <div className="flex justify-between">
                  <span className="text-muted">Net vs Gross Area:</span>
                  <span className="font-semibold text-forest">{result.netAreaSqFt} ft² → {result.grossAreaSqFt} ft²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Total Cartons to Purchase:</span>
                  <span className="font-bold text-forest">{result.boxesNeeded} boxes ({result.totalBoxTileCount} tiles)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Surplus Offcut Spares:</span>
                  <span className="font-semibold">{result.surplusTiles} tiles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Tile Boxes Cost:</span>
                  <span className="font-semibold">{formatMoney(result.tileCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Polymer Grout Bags Cost:</span>
                  <span className="font-semibold">{formatMoney(result.groutCost)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sand-200 font-bold text-sm">
                  <span className="text-forest">Total Estimated Materials:</span>
                  <span className="text-clay-600 font-black text-base">{formatMoney(result.totalCost)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href="/studio">
                  <Button className="w-full gap-2 bg-clay-500 hover:bg-clay-600 font-bold text-white shadow-md">
                    Open Tile Pattern in 2D Studio
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-forest" />
                  Accurately factors joint width displacement & volumetric density
                </div>
              </div>
            </CardContent>
          </Card>

          <AdSlot format="medium-rectangle" />
        </div>
      </div>
    </div>
  );
}
