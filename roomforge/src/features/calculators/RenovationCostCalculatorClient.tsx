'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  calculateRenovation,
  ROOM_TYPE_OPTIONS,
  QUALITY_TIER_OPTIONS,
  RoomType,
  QualityTier,
} from '@/features/calculations/renovationCalculations';
import { formatMoney } from '@/features/calculations/calculations';
import { AdSlot } from '@/components/ads/AdSlot';

export function RenovationCostCalculatorClient() {
  const [roomType, setRoomType] = useState<RoomType>('kitchen');
  const [qualityTier, setQualityTier] = useState<QualityTier>('mid-grade');
  const [squareFootage, setSquareFootage] = useState('200');
  const [diyLevel, setDiyLevel] = useState<'full-contractor' | 'partial-diy' | 'complete-diy'>('full-contractor');
  const [contingencyPercent, setContingencyPercent] = useState('15');
  const [permitIncluded, setPermitIncluded] = useState(true);

  const handleRoomTypeChange = (rt: RoomType) => {
    setRoomType(rt);
    const opt = ROOM_TYPE_OPTIONS.find((o) => o.id === rt);
    if (opt) {
      setSquareFootage(String(opt.defaultSqFt));
    }
  };

  const result = calculateRenovation({
    roomType,
    qualityTier,
    squareFootage: Number(squareFootage) || 0,
    diyLevel,
    customContingencyPercent: Number(contingencyPercent) || 15,
    permitIncluded,
  });

  const handleReset = () => {
    handleRoomTypeChange('kitchen');
    setQualityTier('mid-grade');
    setDiyLevel('full-contractor');
    setContingencyPercent('15');
    setPermitIncluded(true);
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
                <DollarSign className="h-5 w-5 text-clay-500" />
                Project Scope & Specifications
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-muted">
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Defaults
              </Button>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Room Selection */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">1. Select Space to Remodel</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ROOM_TYPE_OPTIONS.map((opt) => {
                    const isSelected = roomType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleRoomTypeChange(opt.id)}
                        className={`p-3 text-left rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'border-forest bg-forest/5 font-bold text-forest ring-1 ring-forest/30'
                            : 'border-sand-300 bg-white text-muted hover:bg-sand-50'
                        }`}
                      >
                        <span className="block font-bold text-forest">{opt.label}</span>
                        <span className="text-[11px] text-muted block mt-0.5 leading-tight">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Square Footage & Finish Tier */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted">2. Finish Quality Tier</h4>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-forest">Room Size:</label>
                    <Input
                      type="number"
                      value={squareFootage}
                      onChange={(e) => setSquareFootage(e.target.value)}
                      className="w-24 h-8 text-xs"
                      suffix="ft²"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {QUALITY_TIER_OPTIONS.map((tier) => {
                    const isSelected = qualityTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setQualityTier(tier.id)}
                        className={`p-3 text-left rounded-xl border text-xs transition-all ${
                          isSelected
                            ? 'border-clay-500 bg-clay-50/50 font-bold text-forest ring-2 ring-clay-300'
                            : 'border-sand-300 bg-white text-muted hover:bg-sand-50'
                        }`}
                      >
                        <span className="block font-bold text-forest">{tier.label}</span>
                        <span className="text-[11px] text-muted block mt-0.5 leading-tight">{tier.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Labor vs DIY Strategy */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">3. Labor & Contracting Approach</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'full-contractor', label: 'Full General Contractor', desc: '100% turnkey labor' },
                    { id: 'partial-diy', label: 'Partial DIY (Demo/Paint)', desc: 'Save ~45% on labor' },
                    { id: 'complete-diy', label: 'Complete DIY Project', desc: 'Materials only focus' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDiyLevel(d.id as typeof diyLevel)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        diyLevel === d.id
                          ? 'border-forest bg-forest text-sand-50 font-bold shadow-xs'
                          : 'border-sand-300 bg-white text-muted hover:bg-sand-50'
                      }`}
                    >
                      <span className="block font-bold">{d.label}</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contingency Buffer & Permits */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-sand-200">
                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Contingency Buffer</label>
                  <Input
                    type="number"
                    value={contingencyPercent}
                    onChange={(e) => setContingencyPercent(e.target.value)}
                    suffix="%"
                  />
                  <span className="text-[10px] text-muted block mt-1">Recommended: 15% (20% for older homes)</span>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest">
                    <input
                      type="checkbox"
                      checked={permitIncluded}
                      onChange={(e) => setPermitIncluded(e.target.checked)}
                      className="h-4 w-4 rounded border-sand-400 text-forest focus:ring-forest"
                    />
                    Include Municipal Permits & Debris Dumpster
                  </label>
                  <span className="text-[10px] text-muted block ml-6 mt-1">Covers building permits and roll-off dumpster</span>
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
                TOTAL ESTIMATED PROJECT INVESTMENT
              </Badge>
              <CardTitle className="text-3xl font-black">
                {result.valid ? formatMoney(result.totalEstimatedCost) : 'Enter Project Data'}
              </CardTitle>
              <p className="text-xs text-sand-200">
                Estimated Range: {formatMoney(result.lowRangeCost)} — {formatMoney(result.highRangeCost)} (~${result.baseCostPerSqFt}/sq ft)
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Cost Split Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-center">
                  <span className="text-[11px] uppercase font-bold text-muted block">Contractor Labor</span>
                  <span className="text-xl font-black text-forest mt-0.5 block">{formatMoney(result.laborCost)}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-sand-100/60 border border-sand-200 text-center">
                  <span className="text-[11px] uppercase font-bold text-muted block">Materials & Fixtures</span>
                  <span className="text-xl font-black text-forest mt-0.5 block">{formatMoney(result.materialsCost)}</span>
                </div>
              </div>

              {/* Trade Breakdown */}
              <div className="rounded-xl border border-sand-200 bg-sand-50/70 p-4 space-y-2.5">
                <h5 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center justify-between">
                  <span>Estimated Trade Allocation:</span>
                  <span className="text-[11px] text-muted font-normal">Approximate %</span>
                </h5>

                <div className="space-y-1.5 text-xs">
                  {result.tradeBreakdown.map((t) => (
                    <div key={t.name} className="flex justify-between items-center py-0.5 border-b border-sand-200/60 last:border-0">
                      <span className="text-muted">{t.name} ({t.percentage}%):</span>
                      <span className="font-semibold text-forest">{formatMoney(t.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 text-xs border-y border-sand-200 py-4">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal (Labor + Materials):</span>
                  <span className="font-semibold">{formatMoney(result.subtotal)}</span>
                </div>
                {result.permitsAndDisposalCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Building Permits & Waste Disposal:</span>
                    <span className="font-semibold">{formatMoney(result.permitsAndDisposalCost)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">Contingency Safety Buffer ({result.contingencyPercent}%):</span>
                  <span className="font-semibold text-clay-600">+{formatMoney(result.contingencyCost)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-sand-200 font-bold text-sm">
                  <span className="text-forest">Expected Out-of-Pocket Budget:</span>
                  <span className="text-clay-600 font-black text-base">{formatMoney(result.totalEstimatedCost)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href="/studio">
                  <Button className="w-full gap-2 bg-clay-500 hover:bg-clay-600 font-bold text-white shadow-md">
                    Open Room Studio to Plan Layout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
                  <ShieldCheck className="h-3.5 w-3.5 text-forest" />
                  National contractor industry benchmark cost distributions
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
