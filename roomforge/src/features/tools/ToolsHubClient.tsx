'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Percent,
  Repeat,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  calculateFlooring,
  convertLength,
  formatMoney,
  formatNumber,
  SQFT_PER_SQM,
} from '@/features/calculations/calculations';
import { MATERIALS, MATERIAL_KEYS } from '@/features/calculations/materials';

export function ToolsHubClient() {
  const [activeTab, setActiveTab] = useState<'boxes' | 'waste' | 'converter' | 'compare'>('boxes');

  // Tool 1: Quick Box Calculator
  const [boxArea, setBoxArea] = useState('250');
  const [boxCoverage, setBoxCoverage] = useState('24');
  const [boxWaste, setBoxWaste] = useState('10');
  const neededArea = Number(boxArea) * (1 + Number(boxWaste) / 100);
  const totalBoxes = Number(boxCoverage) > 0 ? Math.ceil(neededArea / Number(boxCoverage)) : 0;

  // Tool 2: Laying Pattern Advisor
  const [patternType, setPatternType] = useState<'straight' | 'staggered' | 'diagonal' | 'herringbone'>('staggered');
  const [patternRoomArea, setPatternRoomArea] = useState('300');
  const patternFactors = {
    straight: { pct: 8, label: 'Straight / Grid Pattern', desc: 'Minimal cutting required along straight perimeter walls. Ideal for square rooms.' },
    staggered: { pct: 10, label: 'Staggered Planks (1/3 or random)', desc: 'Standard wood-look pattern. Offcuts from ends often start the next run.' },
    diagonal: { pct: 15, label: 'Diagonal 45° Installation', desc: 'Every perimeter plank requires an angled 45-degree cut, generating more offcut waste.' },
    herringbone: { pct: 18, label: 'Herringbone / Chevron Parquet', desc: 'Complex interlocking geometric points require substantial border trimming.' },
  };

  // Tool 3: Unit Converter
  const [convValue, setConvValue] = useState('100');
  const [convType, setConvType] = useState<'sqft-to-sqm' | 'sqm-to-sqft' | 'ft-to-m' | 'm-to-ft'>('sqft-to-sqm');

  const convResult = (() => {
    const val = Number(convValue);
    if (!Number.isFinite(val) || val <= 0) return 0;
    switch (convType) {
      case 'sqft-to-sqm': return val / SQFT_PER_SQM;
      case 'sqm-to-sqft': return val * SQFT_PER_SQM;
      case 'ft-to-m': return convertLength(val, 'ft', 'm');
      case 'm-to-ft': return convertLength(val, 'm', 'ft');
    }
  })();

  // Tool 4: Material Comparison for given dimensions
  const [compWidth, setCompWidth] = useState('14');
  const [compLength, setCompLength] = useState('20');

  return (
    <div className="min-h-screen bg-sand-100/50 pb-24">
      {/* Page Header */}
      <div className="border-b border-sand-300 bg-white/70 backdrop-blur-md pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge variant="sage" className="mb-3 font-mono text-xs">
            ROOMFORGE TOOLKIT
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
            Specialized Flooring Calculators
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            Fast, deterministic tools to estimate cartons, benchmark waste allowances across laying patterns, convert units, and compare material costs.
          </p>

          {/* Tool Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-sand-300 pb-px">
            {[
              { id: 'boxes', label: 'Box & Carton Calculator', icon: Calculator },
              { id: 'waste', label: 'Laying Pattern Waste Advisor', icon: Percent },
              { id: 'converter', label: 'Area & Length Converter', icon: Repeat },
              { id: 'compare', label: 'Material Budget Comparison', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    active
                      ? 'border-forest bg-white text-forest shadow-xs'
                      : 'border-transparent text-muted hover:text-charcoal hover:bg-white/50'
                  }`}
                >
                  <Icon className="h-4 w-4 text-clay-600" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8" id="main-content">
        {/* TAB 1: Box Calculator */}
        {activeTab === 'boxes' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6 space-y-4">
              <Card>
                <CardHeader id="box-calculator">
                  <CardTitle>Carton & Box Quantity Estimator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Total Room Area (sq ft)
                    </label>
                    <Input
                      type="number"
                      value={boxArea}
                      onChange={(e) => setBoxArea(e.target.value)}
                      suffix="ft²"
                      placeholder="e.g. 250"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Box Coverage Specification (sq ft per box)
                    </label>
                    <Input
                      type="number"
                      value={boxCoverage}
                      onChange={(e) => setBoxCoverage(e.target.value)}
                      suffix="ft²"
                      placeholder="e.g. 24"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Waste Allowance (%)
                    </label>
                    <Input
                      type="number"
                      value={boxWaste}
                      onChange={(e) => setBoxWaste(e.target.value)}
                      suffix="%"
                      placeholder="10"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-6">
              <Card className="bg-sage-50/70 border-sage-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-forest">Calculation Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="p-6 rounded-xl bg-white border border-sage-200 shadow-sm">
                    <span className="text-xs uppercase font-bold text-muted">Total Cartons Required</span>
                    <div className="text-4xl font-black text-forest mt-1">
                      {totalBoxes > 0 ? `${totalBoxes} boxes` : '—'}
                    </div>
                    <span className="text-xs text-muted block mt-2">
                      Covers {formatNumber(totalBoxes * Number(boxCoverage), 1)} ft² ({formatNumber(neededArea, 1)} ft² needed with {boxWaste}% waste)
                    </span>
                  </div>

                  <Link href="/studio">
                    <Button className="w-full gap-2 bg-clay-500 hover:bg-clay-600 font-bold">
                      Open Full Studio for Live 2D Floor Plan
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: Pattern Waste Advisor */}
        {activeTab === 'waste' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6 space-y-4">
              <Card>
                <CardHeader id="waste-comparator">
                  <CardTitle>Laying Pattern & Waste Factor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">Room Area (sq ft)</label>
                    <Input
                      type="number"
                      value={patternRoomArea}
                      onChange={(e) => setPatternRoomArea(e.target.value)}
                      suffix="ft²"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest mb-2">Choose Installation Pattern</label>
                    <div className="space-y-2">
                      {(Object.keys(patternFactors) as Array<keyof typeof patternFactors>).map((key) => {
                        const item = patternFactors[key];
                        const isSelected = patternType === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setPatternType(key)}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-clay-500 bg-clay-50/50 ring-2 ring-clay-300'
                                : 'border-sand-300 bg-white hover:bg-sand-50'
                            }`}
                          >
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-forest">{item.label}</p>
                              <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                            </div>
                            <span className="ml-3 font-mono text-xs font-bold text-clay-600 px-2.5 py-1 rounded-md bg-white border border-sand-200">
                              +{item.pct}%
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-6">
              <Card className="bg-sand-50 border-sand-300">
                <CardHeader>
                  <CardTitle>Recommended Coverage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-6 rounded-xl bg-white border border-sand-200 text-center space-y-2">
                    <span className="text-xs uppercase font-bold text-muted">Material to Order</span>
                    <div className="text-3xl font-black text-forest">
                      {formatNumber(Number(patternRoomArea) * (1 + patternFactors[patternType].pct / 100), 1)} ft²
                    </div>
                    <p className="text-xs text-muted">
                      Includes {patternFactors[patternType].pct}% allowance for {patternFactors[patternType].label.toLowerCase()}.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 3: Unit Converter */}
        {activeTab === 'converter' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader id="unit-converter">
                <CardTitle>Flooring Unit & Dimension Converter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sqft-to-sqm', label: 'Sq Ft → Sq Meters' },
                    { id: 'sqm-to-sqft', label: 'Sq Meters → Sq Ft' },
                    { id: 'ft-to-m', label: 'Linear Feet → Meters' },
                    { id: 'm-to-ft', label: 'Linear Meters → Feet' },
                  ].map((conv) => (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => setConvType(conv.id as typeof convType)}
                      className={`p-3 rounded-lg border text-xs font-bold text-center transition-all ${
                        convType === conv.id
                          ? 'border-forest bg-forest text-sand-50'
                          : 'border-sand-300 bg-white text-muted-foreground hover:bg-sand-100'
                      }`}
                    >
                      {conv.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest mb-1">Enter Value</label>
                  <Input
                    type="number"
                    step="any"
                    value={convValue}
                    onChange={(e) => setConvValue(e.target.value)}
                  />
                </div>

                <div className="p-5 rounded-xl bg-sand-100 border border-sand-200 text-center">
                  <span className="text-xs uppercase font-bold text-muted">Converted Value</span>
                  <div className="text-3xl font-black text-forest mt-1">
                    {formatNumber(convResult, 3)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: Compare Materials */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <Card>
              <CardHeader id="grout-estimator">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle>Side-by-Side Material Price Benchmark</CardTitle>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-muted font-bold">Room:</span>
                    <Input
                      type="number"
                      value={compWidth}
                      onChange={(e) => setCompWidth(e.target.value)}
                      className="w-20 h-8"
                      suffix="ft"
                    />
                    <span>×</span>
                    <Input
                      type="number"
                      value={compLength}
                      onChange={(e) => setCompLength(e.target.value)}
                      className="w-20 h-8"
                      suffix="ft"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MATERIAL_KEYS.map((k) => {
                    const m = MATERIALS[k];
                    const res = calculateFlooring({
                      width: Number(compWidth),
                      length: Number(compLength),
                      unit: 'ft',
                      waste: 10,
                      coverage: m.coverage,
                      price: m.price,
                    });

                    return (
                      <div
                        key={k}
                        className="p-5 rounded-xl border border-sand-300 bg-white shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: m.color }} />
                            <h4 className="font-bold text-sm text-forest">{m.name}</h4>
                          </div>
                          <p className="text-xs text-muted mb-4">{m.description}</p>
                          <div className="space-y-1.5 text-xs border-t border-sand-200 pt-3">
                            <div className="flex justify-between">
                              <span className="text-muted">Box Coverage:</span>
                              <span className="font-semibold">{m.coverage} ft²</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted">Price / Box:</span>
                              <span className="font-semibold">${m.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted">Boxes Needed:</span>
                              <span className="font-bold text-forest">{res.boxes || 0} boxes</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-sand-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-muted">Total:</span>
                          <span className="text-base font-black text-clay-600">
                            {formatMoney(res.totalCost)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
