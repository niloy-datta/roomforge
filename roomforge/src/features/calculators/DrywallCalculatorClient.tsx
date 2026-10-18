'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Hammer, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  calculateDrywall,
  DRYWALL_SHEET_SIZES,
} from '@/features/calculations/drywallCalculations';
import { formatMoney, formatNumber } from '@/features/calculations/calculations';
import { AdSlot } from '@/components/ads/AdSlot';

export function DrywallCalculatorClient() {
  const [length, setLength] = useState('14');
  const [width, setWidth] = useState('12');
  const [height, setHeight] = useState('8');
  const [sheetSize, setSheetSize] = useState<'4x8' | '4x10' | '4x12'>('4x8');
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('2');
  const [includeCeiling, setIncludeCeiling] = useState(true);
  const [wastePercent, setWastePercent] = useState('10');
  const [pricePerSheet, setPricePerSheet] = useState('15.50');
  const [pricePerMudBucket, setPricePerMudBucket] = useState('22.00');
  const [pricePerScrewBox, setPricePerScrewBox] = useState('12.50');

  const result = calculateDrywall({
    roomLength: Number(length) || 0,
    roomWidth: Number(width) || 0,
    ceilingHeight: Number(height) || 8,
    sheetSize,
    doorsCount: Number(doors) || 0,
    windowsCount: Number(windows) || 0,
    includeCeiling,
    wastePercent: Number(wastePercent) || 10,
    pricePerSheet: Number(pricePerSheet) || 15.5,
    pricePerMudBucket: Number(pricePerMudBucket) || 22,
    pricePerScrewBox: Number(pricePerScrewBox) || 12.5,
  });

  const handleReset = () => {
    setLength('14');
    setWidth('12');
    setHeight('8');
    setSheetSize('4x8');
    setDoors('1');
    setWindows('2');
    setIncludeCeiling(true);
    setWastePercent('10');
    setPricePerSheet('15.50');
    setPricePerMudBucket('22.00');
    setPricePerScrewBox('12.50');
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
                <Hammer className="h-5 w-5 text-clay-500" />
                Room & Drywall Specifications
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-muted">
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Defaults
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Room Dimensions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">1. Room Framing Footprint</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Length</label>
                    <Input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      suffix="ft"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Width</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      suffix="ft"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Ceiling Height</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      suffix="ft"
                    />
                  </div>
                </div>
              </div>

              {/* Sheet Selection */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">2. Gypsum Sheet Dimensions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(DRYWALL_SHEET_SIZES) as Array<keyof typeof DRYWALL_SHEET_SIZES>).map((key) => {
                    const item = DRYWALL_SHEET_SIZES[key];
                    const isSelected = sheetSize === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSheetSize(key)}
                        className={`p-3 text-left rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'border-forest bg-forest/5 font-bold text-forest ring-1 ring-forest/30'
                            : 'border-sand-300 bg-white text-muted hover:bg-sand-50'
                        }`}
                      >
                        <span className="block text-sm font-black text-forest">{item.label.split('—')[0]}</span>
                        <span className="text-[11px] text-muted block mt-0.5">{item.sqFt} sq ft per sheet</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deductions & Ceiling */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">3. Openings & Ceilings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Doors (21 sq ft)</label>
                    <Input
                      type="number"
                      value={doors}
                      onChange={(e) => setDoors(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Windows (15 sq ft)</label>
                    <Input
                      type="number"
                      value={windows}
                      onChange={(e) => setWindows(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest">
                    <input
                      type="checkbox"
                      checked={includeCeiling}
                      onChange={(e) => setIncludeCeiling(e.target.checked)}
                      className="h-4 w-4 rounded border-sand-400 text-forest focus:ring-forest"
                    />
                    Hang Drywall on Ceiling as well as Walls
                  </label>
                </div>
              </div>

              {/* Pricing & Material Rates */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-sand-200">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Price / Sheet</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={pricePerSheet}
                    onChange={(e) => setPricePerSheet(e.target.value)}
                    prefix="$"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Price / 4.5 Gal Mud</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={pricePerMudBucket}
                    onChange={(e) => setPricePerMudBucket(e.target.value)}
                    prefix="$"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Price / Screw Box</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={pricePerScrewBox}
                    onChange={(e) => setPricePerScrewBox(e.target.value)}
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
                COMPLETE SHEETROCK PACKAGE
              </Badge>
              <CardTitle className="text-2xl font-black">
                {result.valid ? `${result.sheetsNeeded} Sheets (${sheetSize})` : 'Enter Dimensions'}
              </CardTitle>
              <p className="text-xs text-sand-200">
                Covers {formatNumber(result.grossAreaSqFt, 0)} sq ft gross ({formatNumber(result.totalAreaSqFt, 0)} sq ft net area)
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Material Sundries breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-sand-100/60 rounded-xl border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-muted block">Joint Mud</span>
                  <span className="text-lg font-black text-forest mt-0.5 block">{result.mudBucketsNeeded} Pails</span>
                  <span className="text-[10px] text-muted">4.5 Gal All-Purpose</span>
                </div>
                <div className="p-2.5 bg-sand-100/60 rounded-xl border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-muted block">Joint Tape</span>
                  <span className="text-lg font-black text-forest mt-0.5 block">{result.tapeRollsNeeded} Rolls</span>
                  <span className="text-[10px] text-muted">{result.jointTapeLinearFt} lin ft</span>
                </div>
                <div className="p-2.5 bg-sand-100/60 rounded-xl border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-muted block">1.25&quot; Screws</span>
                  <span className="text-lg font-black text-forest mt-0.5 block">{result.screwBoxesNeeded} Box</span>
                  <span className="text-[10px] text-muted">~{result.screwsNeeded} screws</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs border-y border-sand-200 py-4">
                <div className="flex justify-between">
                  <span className="text-muted">Net Wall Area:</span>
                  <span className="font-semibold text-forest">{result.netWallAreaSqFt} ft²</span>
                </div>
                {includeCeiling && (
                  <div className="flex justify-between">
                    <span className="text-muted">Ceiling Area:</span>
                    <span className="font-semibold text-forest">{result.ceilingAreaSqFt} ft²</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">Drywall Sheets Cost:</span>
                  <span className="font-semibold">{formatMoney(result.sheetCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Compound Mud Cost:</span>
                  <span className="font-semibold">{formatMoney(result.mudCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Fasteners / Screws Cost:</span>
                  <span className="font-semibold">{formatMoney(result.screwCost)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sand-200 font-bold text-sm">
                  <span className="text-forest">Total Estimated Drywall Package:</span>
                  <span className="text-clay-600 font-black text-base">{formatMoney(result.totalCost)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href="/studio">
                  <Button className="w-full gap-2 bg-clay-500 hover:bg-clay-600 font-bold text-white shadow-md">
                    Open 2D Studio
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-forest" />
                  Includes full 3-coat tape and mud all-purpose joint compound allowances
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
