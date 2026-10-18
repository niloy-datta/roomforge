'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, ArrowRight, RotateCcw, Truck, Package, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  calculateConcrete,
  SLAB_THICKNESS_PRESETS,
} from '@/features/calculations/concreteCalculations';
import { formatMoney, formatNumber } from '@/features/calculations/calculations';
import { AdSlot } from '@/components/ads/AdSlot';

export function ConcreteCalculatorClient() {
  const [length, setLength] = useState('20');
  const [width, setWidth] = useState('10');
  const [thickness, setThickness] = useState('4');
  const [wastePercent, setWastePercent] = useState('10');
  const [pricePerYard, setPricePerYard] = useState('155');
  const [pricePerBag, setPricePerBag] = useState('6.75');

  const result = calculateConcrete({
    lengthFeet: Number(length) || 0,
    widthFeet: Number(width) || 0,
    thicknessInches: Number(thickness) || 4,
    wastePercent: Number(wastePercent) || 10,
    pricePerCubicYard: Number(pricePerYard) || 155,
    pricePer80LbBag: Number(pricePerBag) || 6.75,
  });

  const handleReset = () => {
    setLength('20');
    setWidth('10');
    setThickness('4');
    setWastePercent('10');
    setPricePerYard('155');
    setPricePerBag('6.75');
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
                <Box className="h-5 w-5 text-clay-500" />
                Slab & Foundation Geometry
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-muted">
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Defaults
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Length and Width */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">1. Slab Dimensions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Slab Length</label>
                    <Input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      suffix="ft"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Slab Width</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      suffix="ft"
                    />
                  </div>
                </div>
              </div>

              {/* Thickness / Depth */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">2. Slab Depth / Thickness</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Depth in Inches</label>
                    <Input
                      type="number"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      suffix="inches"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SLAB_THICKNESS_PRESETS.map((p) => {
                      const isSelected = Number(thickness) === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setThickness(String(p.value))}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            isSelected
                              ? 'border-forest bg-forest/5 font-bold text-forest ring-1 ring-forest/30'
                              : 'border-sand-300 bg-white text-muted hover:bg-sand-50'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pricing & Waste */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-sand-200">
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
                  <label className="block text-xs font-bold text-forest mb-1">Price / Cu Yard</label>
                  <Input
                    type="number"
                    value={pricePerYard}
                    onChange={(e) => setPricePerYard(e.target.value)}
                    prefix="$"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Price / 80lb Bag</label>
                  <Input
                    type="number"
                    value={pricePerBag}
                    onChange={(e) => setPricePerBag(e.target.value)}
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
                VOLUMETRIC SLAB YIELD
              </Badge>
              <CardTitle className="text-2xl font-black">
                {result.valid ? `${result.cubicYards} Cubic Yards` : 'Enter Dimensions'}
              </CardTitle>
              <p className="text-xs text-sand-200">
                {result.cubicMeters} m³ volume for {result.surfaceAreaSqFt} sq ft surface (+{wastePercent}% grade allowance)
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Ready-Mix vs Pre-Mix Recommendation */}
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/70 space-y-2">
                <div className="flex items-center gap-2">
                  {result.deliveryTypeRecommendation === 'truck' ? (
                    <Truck className="h-5 w-5 text-clay-600" />
                  ) : (
                    <Package className="h-5 w-5 text-forest" />
                  )}
                  <span className="font-bold text-xs uppercase tracking-wider text-forest">
                    {result.deliveryTypeRecommendation === 'truck'
                      ? 'Recommendation: Order Ready-Mix Truck'
                      : 'Recommendation: Buy Pre-Mix Bags'}
                  </span>
                </div>
                <p className="text-xs text-muted leading-tight">
                  {result.deliveryTypeRecommendation === 'truck'
                    ? `At ${result.cubicYards} cu yds (${result.bags80Lb} bags of 80 lb), manual hand-mixing is physically grueling. Ready-mix transit trucks deliver poured concrete in minutes.`
                    : `At ${result.cubicYards} cu yds (${result.bags80Lb} bags), pre-mix bags mixed in a wheelbarrow or portable rental mixer are cost-efficient.`}
                </p>
              </div>

              {/* Bag Counts Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-sand-100/60 rounded-xl border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-muted block">80 lb Bags</span>
                  <span className="text-lg font-black text-forest mt-0.5 block">{result.bags80Lb}</span>
                  <span className="text-[10px] text-muted">0.60 cu ft/bag</span>
                </div>
                <div className="p-2.5 bg-sand-100/60 rounded-xl border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-muted block">60 lb Bags</span>
                  <span className="text-lg font-black text-forest mt-0.5 block">{result.bags60Lb}</span>
                  <span className="text-[10px] text-muted">0.45 cu ft/bag</span>
                </div>
                <div className="p-2.5 bg-sand-100/60 rounded-xl border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-muted block">50 lb Bags</span>
                  <span className="text-lg font-black text-forest mt-0.5 block">{result.bags50Lb}</span>
                  <span className="text-[10px] text-muted">0.375 cu ft/bag</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs border-y border-sand-200 py-4">
                <div className="flex justify-between">
                  <span className="text-muted">Total Slab Footprint:</span>
                  <span className="font-semibold text-forest">{result.surfaceAreaSqFt} ft² ({formatNumber(result.surfaceAreaSqM, 1)} m²)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Net vs Gross Volume:</span>
                  <span className="font-semibold">{formatNumber(result.netVolumeCuFt, 1)} ft³ → {formatNumber(result.grossVolumeCuFt, 1)} ft³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Ready-Mix Truck Cost Est:</span>
                  <span className="font-semibold">{formatMoney(result.truckCostEstimate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">80-lb Bag Retail Cost Est:</span>
                  <span className="font-semibold">{formatMoney(result.bagCostEstimate)}</span>
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
                  Computes 27 cu ft per yard with subgrade unevenness allowance
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
