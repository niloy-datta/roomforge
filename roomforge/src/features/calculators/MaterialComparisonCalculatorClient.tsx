'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scale, ArrowRight, RotateCcw, Check, X, Shield, Droplets, Wrench, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  calculateComparison,
  COMPARISON_DATABASE,
} from '@/features/calculations/comparisonCalculations';
import { formatMoney } from '@/features/calculations/calculations';
import { AdSlot } from '@/components/ads/AdSlot';

export function MaterialComparisonCalculatorClient() {
  const [sqFt, setSqFt] = useState('350');
  const [isDiy, setIsDiy] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'solid-hardwood',
    'luxury-vinyl-plank',
    'porcelain-tile',
  ]);

  const toggleMaterial = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const metrics = calculateComparison(selectedIds, Number(sqFt) || 350, isDiy);

  const handleReset = () => {
    setSqFt('350');
    setIsDiy(false);
    setSelectedIds(['solid-hardwood', 'luxury-vinyl-plank', 'porcelain-tile']);
  };

  return (
    <div className="space-y-8">
      <AdSlot format="horizontal-banner" />

      {/* Top Controls Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-xl font-bold text-forest flex items-center gap-2">
              <Scale className="h-5 w-5 text-clay-500" />
              Material Lifecycle & Total Cost of Ownership (TCO)
            </CardTitle>
            <p className="text-xs text-muted mt-1">
              Select 2 to 4 materials to benchmark initial investment against 10-year maintenance and lifespan durability.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-forest">Floor Area:</label>
              <Input
                type="number"
                value={sqFt}
                onChange={(e) => setSqFt(e.target.value)}
                className="w-24 h-8 text-xs"
                suffix="ft²"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-muted">
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {/* Material Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {COMPARISON_DATABASE.map((mat) => {
              const isSelected = selectedIds.includes(mat.id);
              return (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => toggleMaterial(mat.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-forest bg-forest text-sand-50 shadow-xs font-bold'
                      : 'border-sand-300 bg-white text-forest hover:bg-sand-50'
                  }`}
                >
                  <span className="block text-xs leading-tight">{mat.name}</span>
                  <span className="text-[10px] opacity-80 block mt-1">
                    ~${mat.materialCostPerSqFt}/sq ft
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-forest">
              <input
                type="checkbox"
                checked={isDiy}
                onChange={(e) => setIsDiy(e.target.checked)}
                className="h-4 w-4 rounded border-sand-400 text-forest focus:ring-forest"
              />
              DIY Installation (Zero Professional Labor Cost)
            </label>
            <span className="text-[11px] text-muted">
              Comparing {selectedIds.length} materials for {sqFt} sq ft
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${metrics.length >= 3 ? 'lg:grid-cols-3' : ''} ${metrics.length === 4 ? 'xl:grid-cols-4' : ''} gap-6 items-stretch`}>
        {metrics.map((m) => (
          <Card key={m.item.id} className="border-sand-300 flex flex-col justify-between shadow-xs bg-white">
            <div>
              <CardHeader className="bg-sand-100/70 border-b border-sand-200 pb-4">
                <Badge variant="sage" className="w-fit text-[10px] font-mono mb-1">
                  {m.item.category.toUpperCase()}
                </Badge>
                <CardTitle className="text-lg font-bold text-forest">
                  {m.item.name}
                </CardTitle>
                <div className="mt-2 pt-2 border-t border-sand-200/80 flex items-baseline justify-between">
                  <span className="text-xs text-muted font-bold">10-Yr Total Cost:</span>
                  <span className="text-2xl font-black text-clay-600">
                    {formatMoney(m.tenYearTCO)}
                  </span>
                </div>
                <span className="text-[11px] text-muted block text-right">
                  ~{formatMoney(m.annualizedCostPerYear)} / year annualized
                </span>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* Initial Cost Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Material ({sqFt} ft²):</span>
                    <span className="font-semibold">{formatMoney(m.materialCost)} (${m.item.materialCostPerSqFt}/ft²)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Pro Labor:</span>
                    <span className="font-semibold">{isDiy ? '$0 (DIY)' : `${formatMoney(m.laborCost)} ($${m.item.laborCostPerSqFt}/ft²)`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-forest pt-1 border-t border-sand-200">
                    <span>Upfront Day-1 Cost:</span>
                    <span>{formatMoney(m.initialTotalCost)}</span>
                  </div>
                  <div className="flex justify-between text-muted pt-1">
                    <span>10-Yr Maintenance/Seal:</span>
                    <span>{formatMoney(m.tenYearMaintenanceCost)}</span>
                  </div>
                </div>

                {/* Scorecards */}
                <div className="space-y-2 pt-3 border-t border-sand-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-blue-500" />
                      Water Resistance:
                    </span>
                    <span className="font-bold font-mono text-forest">
                      {'★'.repeat(m.item.waterResistanceScore)}{'☆'.repeat(5 - m.item.waterResistanceScore)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-forest" />
                      Durability / Scratches:
                    </span>
                    <span className="font-bold font-mono text-forest">
                      {'★'.repeat(m.item.durabilityScore)}{'☆'.repeat(5 - m.item.durabilityScore)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-clay-500" />
                      DIY Friendly Score:
                    </span>
                    <span className="font-bold text-forest">
                      {m.item.diyDifficultyScore === 1 ? 'Extremely Easy (Click)' : m.item.diyDifficultyScore === 3 ? 'Moderate' : 'Advanced / Wet Saw'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted">Radiant Floor Heat:</span>
                    <span className="font-bold flex items-center gap-1">
                      {m.item.radiantHeatCompatible ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-forest" />
                          Compatible
                        </>
                      ) : (
                        <>
                          <X className="h-3.5 w-3.5 text-red-500" />
                          Not Recommended
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted">Expected Lifespan:</span>
                    <span className="font-bold text-forest">{m.item.lifespanYears} Years</span>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="space-y-3 pt-3 border-t border-sand-200 text-[11px]">
                  <div>
                    <span className="font-bold text-forest block mb-1">Key Advantages:</span>
                    <ul className="space-y-1 text-muted">
                      {m.item.pros.map((p) => (
                        <li key={p} className="flex items-start gap-1">
                          <Check className="h-3 w-3 text-forest shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-clay-700 block mb-1">Trade-Offs & Limits:</span>
                    <ul className="space-y-1 text-muted">
                      {m.item.cons.map((c) => (
                        <li key={c} className="flex items-start gap-1">
                          <span className="text-clay-500 font-bold shrink-0">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-4 bg-sand-50/80 border-t border-sand-200">
              <Link href={`/studio?m=${m.item.category}`}>
                <Button variant="outline" size="sm" className="w-full text-xs font-bold text-forest hover:bg-forest hover:text-sand-50">
                  Preview in 2D Studio
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted pt-2">
        <CheckCircle2 className="h-4 w-4 text-forest" />
        TCO models include standard maintenance intervals (resealing grout, hardwood screen & recoat, buffing)
      </div>

      <AdSlot format="horizontal-banner" />
    </div>
  );
}
