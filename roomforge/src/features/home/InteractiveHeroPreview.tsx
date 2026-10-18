'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RoomSvgRenderer } from '@/components/shared/RoomSvgRenderer';
import { DEFAULT_SETTINGS, MATERIALS, MATERIAL_KEYS } from '@/features/calculations/materials';
import { FlooringMaterialKey, StudioSettings } from '@/features/calculations/types';

export function InteractiveHeroPreview() {
  const [activeMaterial, setActiveMaterial] = useState<FlooringMaterialKey>('oak');

  const settings: StudioSettings = {
    ...DEFAULT_SETTINGS,
    width: 12,
    length: 18,
    material: activeMaterial,
    pattern: activeMaterial === 'tile' ? 'straight' : 'staggered',
  };


  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Decorative backdrop glow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sage-200/50 via-clay-100/40 to-sand-200/50 blur-xl opacity-70 -z-10" />

      <div className="rounded-2xl border border-sand-300/80 bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-sand-200 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sage-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-forest">
              Interactive 2D Living Room
            </span>
          </div>
          <Link
            href="/studio"
            className="text-xs font-semibold text-clay-600 hover:text-clay-700 flex items-center gap-1"
          >
            Full Studio <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* SVG Canvas */}
        <div className="aspect-[720/510] w-full rounded-xl bg-sand-50/70 p-2 flex items-center justify-center border border-sand-200">
          <RoomSvgRenderer settings={settings} />
        </div>

        {/* Live Material Swatches Selector */}
        <div className="mt-4 pt-3 border-t border-sand-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {MATERIAL_KEYS.map((k) => {
              const m = MATERIALS[k];
              const isSelected = activeMaterial === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setActiveMaterial(k)}
                  className={`h-7 px-2.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'border-clay-500 bg-clay-50/80 text-clay-800 ring-2 ring-clay-300'
                      : 'border-sand-300 bg-white text-muted hover:border-sand-400'
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="hidden sm:inline">{m.short}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs font-bold text-forest">
            216 FT² · 10 Boxes
          </span>
        </div>
      </div>
    </div>
  );
}
