'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateFlooring } from '@/features/calculations/calculations';

export function HeroQuickStart() {
  const router = useRouter();
  const [width, setWidth] = useState('12');
  const [length, setLength] = useState('18');
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = Number(width);
    const l = Number(length);
    const check = calculateFlooring({ width: w, length: l, unit, waste: 10, coverage: 24, price: 45 });

    if (!check.valid) {
      setError(check.errors.width || check.errors.length || 'Enter valid dimensions.');
      return;
    }
    setError(null);
    router.push(`/studio?w=${w}&l=${l}&u=${unit}`);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-sand-300 bg-sand-200/60 px-3 py-1 text-xs font-semibold text-forest mb-4">
        <Sparkles className="h-3.5 w-3.5 text-clay-600" />
        <span>Architectural 2D Flooring Studio</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-forest leading-[1.08] font-serif">
        A room you love.<br />
        <em className="italic text-clay-500 font-normal">A budget you know.</em>
      </h1>

      <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
        Visual floor plans, instant box calculations and transparent material budgeting without spreadsheets or complex software.
      </p>

      {/* Quick Start Card Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-sand-300 bg-white/95 p-5 shadow-lg backdrop-blur-sm space-y-4"
        id="quick-start"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-forest">
            Room Dimensions Quick Start
          </span>
          <div className="flex items-center rounded-md border border-sand-300 bg-sand-100 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setUnit('ft')}
              className={`px-2 py-0.5 rounded transition-all ${
                unit === 'ft' ? 'bg-forest text-sand-50 font-bold' : 'text-muted'
              }`}
            >
              Feet
            </button>
            <button
              type="button"
              onClick={() => setUnit('m')}
              className={`px-2 py-0.5 rounded transition-all ${
                unit === 'm' ? 'bg-forest text-sand-50 font-bold' : 'text-muted'
              }`}
            >
              Meters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Room width</label>
            <Input
              id="home-width"
              type="number"
              step="any"
              min="0.1"
              max={unit === 'm' ? '152.4' : '500'}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              suffix={unit}
              placeholder="12"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Room length</label>
            <Input
              id="home-length"
              type="number"
              step="any"
              min="0.1"
              max={unit === 'm' ? '152.4' : '500'}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              suffix={unit}
              placeholder="18"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 font-semibold" role="alert" id="home-error">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full gap-2 font-bold bg-clay-500 hover:bg-clay-600 text-white shadow-md">
          Design My Room
          <ArrowRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center justify-between text-[11px] text-muted pt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-sage-600" /> Free to use
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-sage-600" /> No signup required
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-sage-600" /> Instant 2D preview
          </span>
        </div>
      </form>
    </div>
  );
}
