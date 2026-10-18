'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Paintbrush, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculatePaint, CEILING_HEIGHT_PRESETS } from '@/features/calculations/paintCalculations';
import { formatMoney } from '@/features/calculations/calculations';
import { AdSlot } from '@/components/ads/AdSlot';

export function PaintCalculatorClient() {
  const [width, setWidth] = useState('14');
  const [length, setLength] = useState('16');
  const [height, setHeight] = useState('9');
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('2');
  const [coats, setCoats] = useState('2');
  const [includeCeiling, setIncludeCeiling] = useState(true);
  const [primerCoats, setPrimerCoats] = useState('0');
  const [pricePerGallon, setPricePerGallon] = useState('48');
  const [pricePerPrimerGallon, setPricePerPrimerGallon] = useState('28');

  const result = calculatePaint({
    width: Number(width) || 0,
    length: Number(length) || 0,
    height: Number(height) || 8,
    doors: Number(doors) || 0,
    windows: Number(windows) || 0,
    coats: Number(coats) || 2,
    includeCeiling,
    primerCoats: Number(primerCoats) || 0,
    coveragePerGallon: 350,
    pricePerGallon: Number(pricePerGallon) || 0,
    pricePerPrimerGallon: Number(pricePerPrimerGallon) || 0,
  });

  const handleReset = () => {
    setWidth('14');
    setLength('16');
    setHeight('9');
    setDoors('1');
    setWindows('2');
    setCoats('2');
    setIncludeCeiling(true);
    setPrimerCoats('0');
    setPricePerGallon('48');
    setPricePerPrimerGallon('28');
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
                <Paintbrush className="h-5 w-5 text-clay-500" />
                Room Architecture & Openings
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-muted">
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Defaults
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Room Dimensions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">1. Room Dimensions</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Room Width</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      suffix="ft"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Room Length</label>
                    <Input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
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

                {/* Ceiling Height Quick Buttons */}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {CEILING_HEIGHT_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setHeight(String(p.value))}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                        Number(height) === p.value
                          ? 'border-forest bg-forest/5 font-bold text-forest'
                          : 'border-sand-300 bg-white text-muted hover:bg-sand-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deductions: Doors & Windows */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">2. Architectural Deductions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Standard Doors (21 sq ft)</label>
                    <Input
                      type="number"
                      value={doors}
                      onChange={(e) => setDoors(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Standard Windows (15 sq ft)</label>
                    <Input
                      type="number"
                      value={windows}
                      onChange={(e) => setWindows(e.target.value)}
                      placeholder="2"
                    />
                  </div>
                </div>
              </div>

              {/* Application Options */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">3. Coats & Ceiling Coverage</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCoats(String(num))}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          Number(coats) === num
                            ? 'border-forest bg-forest text-sand-50 shadow-xs'
                            : 'border-sand-300 bg-white text-muted hover:bg-sand-50'
                        }`}
                      >
                        {num} {num === 1 ? 'Coat (Refresh)' : num === 2 ? 'Coats (Standard)' : 'Coats (Dark-to-Light)'}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest">
                      <input
                        type="checkbox"
                        checked={includeCeiling}
                        onChange={(e) => setIncludeCeiling(e.target.checked)}
                        className="h-4 w-4 rounded border-sand-400 text-forest focus:ring-forest"
                      />
                      Include Ceiling Painting
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest">
                      <input
                        type="checkbox"
                        checked={Number(primerCoats) > 0}
                        onChange={(e) => setPrimerCoats(e.target.checked ? '1' : '0')}
                        className="h-4 w-4 rounded border-sand-400 text-forest focus:ring-forest"
                      />
                      Include Primer Coat (Bare drywall/stains)
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-sand-200">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Paint Price / Gallon</label>
                  <Input
                    type="number"
                    value={pricePerGallon}
                    onChange={(e) => setPricePerGallon(e.target.value)}
                    prefix="$"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Primer Price / Gallon</label>
                  <Input
                    type="number"
                    value={pricePerPrimerGallon}
                    onChange={(e) => setPricePerPrimerGallon(e.target.value)}
                    prefix="$"
                    disabled={Number(primerCoats) === 0}
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
                PRECISE GALLON YIELD
              </Badge>
              <CardTitle className="text-2xl font-black">
                {result.valid ? `${result.totalGallons} Gallons Required` : 'Enter Dimensions'}
              </CardTitle>
              <p className="text-xs text-sand-200">
                {result.totalLiters} Liters total ({result.wallGallonsNeeded} wall + {result.ceilingGallonsNeeded} ceiling)
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-center">
                  <span className="text-[11px] uppercase font-bold text-muted block">Net Wall Surface</span>
                  <span className="text-xl font-black text-forest mt-0.5 block">{result.netWallAreaSqFt} ft²</span>
                  <span className="text-[10px] text-muted block mt-0.5">(-{result.deductionAreaSqFt} ft² openings)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-center">
                  <span className="text-[11px] uppercase font-bold text-muted block">Primer Needed</span>
                  <span className="text-xl font-black text-forest mt-0.5 block">{result.primerGallonsNeeded} gal</span>
                  <span className="text-[10px] text-muted block mt-0.5">(Full surface sealer)</span>
                </div>
              </div>

              {/* Recommended Supplies Card */}
              <div className="rounded-xl border border-sand-200 bg-sand-50/70 p-4 space-y-2">
                <h5 className="text-xs font-bold text-forest uppercase tracking-wider">Recommended Painter Sundries:</h5>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-lg border border-sand-200">
                    <span className="font-bold text-forest block">{result.supplies.rollers}</span>
                    <span className="text-[10px] text-muted">Rollers (3/8&quot;)</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-sand-200">
                    <span className="font-bold text-forest block">{result.supplies.tapeRolls}</span>
                    <span className="text-[10px] text-muted">Tape Rolls</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-sand-200">
                    <span className="font-bold text-forest block">{result.supplies.dropCloths}</span>
                    <span className="text-[10px] text-muted">Drop Cloths</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs border-y border-sand-200 py-4">
                <div className="flex justify-between">
                  <span className="text-muted">Effective Coverage Area:</span>
                  <span className="font-semibold text-forest">{result.effectiveCoverageSqFt} ft² ({coats} coats)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Paint Cost:</span>
                  <span className="font-semibold">{formatMoney(result.paintCost)}</span>
                </div>
                {result.primerCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Primer Cost:</span>
                    <span className="font-semibold">{formatMoney(result.primerCost)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-sand-200 font-bold text-sm">
                  <span className="text-forest">Total Estimated Paint Cost:</span>
                  <span className="text-clay-600 font-black text-base">{formatMoney(result.totalCost)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href="/studio">
                  <Button className="w-full gap-2 bg-clay-500 hover:bg-clay-600 font-bold text-white shadow-md">
                    Open 2D Studio for Layouts
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-forest" />
                  Calculates true subtractive door & window architectural allowances
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
