'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatMoney, formatNumber } from '@/features/calculations/calculations';
import { AdSlot } from '@/components/ads/AdSlot';

const PATTERNS = [
  { id: 'straight', label: 'Straight / Grid (8% waste)', waste: 8, desc: 'Planks run parallel with standard minimal edge trimming.' },
  { id: 'staggered', label: 'Standard Staggered (10% waste)', waste: 10, desc: 'Classic 1/3 offset. Recommended for standard plank flooring.' },
  { id: 'diagonal', label: 'Diagonal 45° (15% waste)', waste: 15, desc: 'Every perimeter wall requires 45-degree angled corner cuts.' },
  { id: 'herringbone', label: 'Herringbone / Chevron (18% waste)', waste: 18, desc: 'Geometric parquet interlocking points create higher offcut waste.' },
];

export function FlooringCalculatorClient() {
  const [length, setLength] = useState('16');
  const [width, setWidth] = useState('14');
  const [pattern, setPattern] = useState('staggered');
  const [boxCoverage, setBoxCoverage] = useState('22.5');
  const [pricePerBox, setPricePerBox] = useState('54');
  const [includeUnderlayment, setIncludeUnderlayment] = useState(true);
  const [underlaymentRollPrice, setUnderlaymentRollPrice] = useState('65'); // 100 sq ft per roll

  const L = Math.max(0, Number(length) || 0);
  const W = Math.max(0, Number(width) || 0);
  const netArea = L * W;

  const selectedPattern = PATTERNS.find((p) => p.id === pattern) ?? PATTERNS[1];
  const grossArea = netArea * (1 + selectedPattern.waste / 100);

  const coveragePerBox = Math.max(0.1, Number(boxCoverage) || 20);
  const boxesNeeded = netArea > 0 ? Math.ceil(grossArea / coveragePerBox) : 0;
  const totalCovered = boxesNeeded * coveragePerBox;
  const surplus = totalCovered - grossArea;

  const flooringCost = boxesNeeded * (Number(pricePerBox) || 0);
  const underlaymentRolls = includeUnderlayment && netArea > 0 ? Math.ceil(netArea / 100) : 0;
  const underlaymentCost = underlaymentRolls * (Number(underlaymentRollPrice) || 0);
  const totalCost = flooringCost + underlaymentCost;

  const handleReset = () => {
    setLength('16');
    setWidth('14');
    setPattern('staggered');
    setBoxCoverage('22.5');
    setPricePerBox('54');
    setIncludeUnderlayment(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Ad Slot */}
      <AdSlot format="horizontal-banner" />

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold text-forest flex items-center gap-2">
                <Layers className="h-5 w-5 text-clay-500" />
                Room & Material Parameters
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-muted">
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Defaults
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Dimensions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">1. Room Dimensions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Room Length</label>
                    <Input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      suffix="ft"
                      placeholder="16"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Room Width</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      suffix="ft"
                      placeholder="14"
                    />
                  </div>
                </div>
              </div>

              {/* Laying Pattern */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">2. Installation Pattern & Waste Allowance</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PATTERNS.map((p) => {
                    const isSelected = pattern === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPattern(p.id)}
                        className={`p-3 text-left rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'border-forest bg-forest/5 ring-2 ring-forest/20'
                            : 'border-sand-300 bg-white hover:bg-sand-50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-forest">
                          <span>{p.label}</span>
                        </div>
                        <p className="text-[11px] text-muted mt-1 leading-tight">{p.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Box Specs & Pricing */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">3. Packaging Specifications & Pricing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Carton Coverage</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={boxCoverage}
                      onChange={(e) => setBoxCoverage(e.target.value)}
                      suffix="ft² / box"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Price per Carton</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={pricePerBox}
                      onChange={(e) => setPricePerBox(e.target.value)}
                      prefix="$"
                    />
                  </div>
                </div>
              </div>

              {/* Underlayment Option */}
              <div className="rounded-xl border border-sand-300 p-4 bg-sand-50/60">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUnderlayment}
                    onChange={(e) => setIncludeUnderlayment(e.target.checked)}
                    className="h-4 w-4 rounded border-sand-400 text-forest focus:ring-forest"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-forest block">Include Subfloor Acoustic/Moisture Underlayment</span>
                    <span className="text-muted">Adds rolls of 100 sq ft foam/cork underlayment</span>
                  </div>
                </label>

                {includeUnderlayment && (
                  <div className="mt-3 pt-3 border-t border-sand-200">
                    <label className="block text-xs font-bold text-forest mb-1">Price per 100 sq ft roll</label>
                    <Input
                      type="number"
                      value={underlaymentRollPrice}
                      onChange={(e) => setUnderlaymentRollPrice(e.target.value)}
                      prefix="$"
                      className="max-w-[200px]"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-forest/20 shadow-md bg-white">
            <CardHeader className="bg-forest text-sand-50 rounded-t-xl pb-4">
              <Badge variant="sage" className="w-fit text-[10px] font-mono mb-1">
                SUMMARY ESTIMATE
              </Badge>
              <CardTitle className="text-2xl font-black">
                {boxesNeeded > 0 ? `${boxesNeeded} Cartons Required` : 'Enter Dimensions'}
              </CardTitle>
              <p className="text-xs text-sand-200">
                Covers {formatNumber(totalCovered, 1)} sq ft for a {formatNumber(netArea, 0)} sq ft room (+{selectedPattern.waste}% pattern allowance)
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-center">
                  <span className="text-[11px] uppercase font-bold text-muted block">Net Room Area</span>
                  <span className="text-xl font-black text-forest mt-0.5 block">{formatNumber(netArea, 0)} ft²</span>
                </div>
                <div className="p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-center">
                  <span className="text-[11px] uppercase font-bold text-muted block">Gross Needed</span>
                  <span className="text-xl font-black text-forest mt-0.5 block">{formatNumber(grossArea, 1)} ft²</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs border-y border-sand-200 py-4">
                <div className="flex justify-between">
                  <span className="text-muted">Carton Quantity:</span>
                  <span className="font-bold text-forest">{boxesNeeded} boxes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Surplus Offcut / Attic Stock:</span>
                  <span className="font-semibold">{formatNumber(surplus, 1)} ft²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Flooring Material Cost:</span>
                  <span className="font-semibold">{formatMoney(flooringCost)}</span>
                </div>
                {includeUnderlayment && (
                  <div className="flex justify-between">
                    <span className="text-muted">Underlayment ({underlaymentRolls} rolls):</span>
                    <span className="font-semibold">{formatMoney(underlaymentCost)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-sand-200 font-bold text-sm">
                  <span className="text-forest">Total Estimated Cost:</span>
                  <span className="text-clay-600 font-black text-base">{formatMoney(totalCost)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href={`/studio?w=${length}&l=${width}&m=hardwood`}>
                  <Button className="w-full gap-2 bg-clay-500 hover:bg-clay-600 font-bold text-white shadow-md">
                    Visualize in 2D Floor Plan Studio
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-forest" />
                  Deterministic calculations with zero hidden markups
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar In-Article Ad Slot */}
          <AdSlot format="medium-rectangle" />
        </div>
      </div>
    </div>
  );
}
