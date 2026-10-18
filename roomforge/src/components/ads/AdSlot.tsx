'use client';

import React, { useEffect } from 'react';

export type AdFormat = 'horizontal-banner' | 'medium-rectangle' | 'in-article' | 'sidebar';

interface AdSlotProps {
  slot?: string;
  format?: AdFormat;
  className?: string;
}

const FORMAT_CONFIG: Record<AdFormat, { minHeight: string; label: string; containerClass: string }> = {
  'horizontal-banner': {
    minHeight: 'min-h-[90px]',
    label: 'Leaderboard (728×90 / 320×50)',
    containerClass: 'w-full max-w-[728px] mx-auto',
  },
  'medium-rectangle': {
    minHeight: 'min-h-[250px]',
    label: 'Medium Rectangle (300×250)',
    containerClass: 'w-full max-w-[300px] mx-auto',
  },
  'in-article': {
    minHeight: 'min-h-[120px]',
    label: 'Native Content Placement',
    containerClass: 'w-full my-6',
  },
  'sidebar': {
    minHeight: 'min-h-[600px]',
    label: 'Half-Page Skyscraper (300×600)',
    containerClass: 'w-full max-w-[300px] mx-auto',
  },
};

/**
 * AdSlot Component
 * Fully compliant with Google AdSense Policies and Better Ads Standards.
 * - Displays mandatory "ADVERTISEMENT" disclosure
 * - Reserves exact minimum dimensions to avoid Cumulative Layout Shift (CLS)
 * - Safely detects if NEXT_PUBLIC_ADSENSE_CLIENT_ID is configured
 * - Isolated from any studio drawing canvases or interactive controls
 */
export function AdSlot({ slot, format = 'horizontal-banner', className = '' }: AdSlotProps) {
  const config = FORMAT_CONFIG[format] ?? FORMAT_CONFIG['horizontal-banner'];
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adsenseClientId && slot) {
      try {
        // @ts-expect-error Google Adsense global window queue
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Silently catch adblocker rejections or network errors
      }
    }
  }, [adsenseClientId, slot]);

  return (
    <aside
      aria-label="Advertisement"
      className={`relative my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 p-3 text-center transition-colors ${config.minHeight} ${config.containerClass} ${className}`}
    >
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        Advertisement
      </span>

      {adsenseClientId && slot ? (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: 'block' }}
          data-ad-client={adsenseClientId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-4 text-xs text-muted-foreground">
          <div className="mb-1 rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground/90">
            Ad Space Reserved
          </div>
          <span className="text-[11px] text-muted-foreground/60">
            {config.label} • Policy Compliant
          </span>
        </div>
      )}
    </aside>
  );
}
