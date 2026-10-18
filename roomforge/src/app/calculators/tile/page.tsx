import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';
import { TileCalculatorClient } from '@/features/calculators/TileCalculatorClient';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Tile & Grout Calculator — Coverage Formulas & Box Estimator | ROOMFORGE',
  description: 'Calculate ceramic and porcelain tiles, boxes needed, grout pounds by joint width, and spacer counts. Based on standard industry volumetric coverage formulas.',
  alternates: {
    canonical: '/calculators/tile',
  },
  openGraph: {
    title: 'Tile & Grout Calculator — Coverage Formulas & Box Estimator | ROOMFORGE',
    description: 'Calculate tile counts, cartons, and grout powder pounds for floors, backsplashes, and walk-in showers.',
    url: '/calculators/tile',
    type: 'article',
  },
};

export default function TileCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ROOMFORGE Tile & Grout Calculator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Accurate tile calculator determining box counts, gross tile numbers, grout weight in pounds, and spacer needs based on volumetric formulas.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do you calculate how much grout is needed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The standard formula calculates grout volume based on tile length, width, thickness, and joint width: Volume (cu in) = ((Length + Width) × Joint Width × Thickness × Area in sq inches) / (Length × Width). Grout dry density is approximately 0.059 lbs per cubic inch. Always verify with your specific grout manufacturer bag coverage table.',
        },
      },
      {
        '@type': 'Question',
        name: 'What grout joint size should I use for large format tiles?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For rectified porcelain tiles (edges ground to exact 90 degrees), a 1/16-inch (1.6 mm) or 1/8-inch (3.2 mm) joint is standard. For non-rectified or handmade rustic tiles, use 3/16-inch or 1/4-inch to absorb minor tile size variations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I choose sanded or unsanded grout?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use unsanded grout for joints narrower than 1/8-inch and polished marble/glass that can be scratched by quartz silica. Use sanded or high-performance polymer grout for joints 1/8-inch and wider to prevent shrinkage cracking.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-sand-100/40 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header */}
      <div className="border-b border-sand-300 bg-white/80 backdrop-blur-md pt-8 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-muted mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/calculators" className="hover:text-forest transition-colors">Calculators</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-forest">Tile Calculator</span>
          </nav>

          <Badge variant="sage" className="mb-2 font-mono text-xs">
            VOLUMETRIC GROUT ESTIMATOR
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-forest tracking-tight">
            Tile & Grout Estimator
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
            Accurately size floor, shower wall, and kitchen backsplash installations. Calculates exact tile pieces, full carton packaging, dry grout weight in pounds, and tile spacers.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <TileCalculatorClient />

        {/* Educational Guide */}
        <article className="mt-16 rounded-2xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xs space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
              Understanding Tile & Grout Geometry
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Tiling projects fail most commonly due to two errors: underestimating diagonal cuts around perimeter walls and plumbing penetrations, or running out of grout halfway through the job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 1</span>
              <h3 className="font-bold text-forest">Tile Surface Area</h3>
              <p className="text-xs text-muted leading-relaxed">
                Convert tile dimensions to square feet: (Length in inches × Width in inches) / 144. For a 12&quot;×24&quot; tile, each unit covers exactly 2.0 sq ft.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 2</span>
              <h3 className="font-bold text-forest">TCNA Volumetric Grout</h3>
              <p className="text-xs text-muted leading-relaxed">
                Joint width and tile thickness dictate grout volume. Thicker tiles (3/8&quot;) require 50% more grout than thin 1/4&quot; wall tiles for the identical joint width.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 3</span>
              <h3 className="font-bold text-forest">Box Packaging Rounds</h3>
              <p className="text-xs text-muted leading-relaxed">
                Ceramic and porcelain are packaged in sealed boxes. Distributors never break boxes; always purchase to the nearest full unopened carton.
              </p>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="rounded-xl border border-sage-300 bg-sage-50/60 p-6 space-y-3">
            <div className="flex items-center gap-2 text-forest font-bold text-sm">
              <CheckCircle className="h-5 w-5 text-forest" />
              Pro Tip: Check Dye Lot & Caliber Numbers
            </div>
            <p className="text-xs text-forest/80 leading-relaxed">
              When receiving tile boxes, inspect the dye lot code printed on the side. All cartons for a continuous room must share the identical dye lot number to guarantee uniform shade, gloss, and edge calibration.
            </p>
          </div>

          {/* FAQs */}
          <div className="space-y-4 pt-4 border-t border-sand-200">
            <h3 className="text-xl font-bold text-forest flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-clay-500" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">How do you calculate how much grout is needed?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  The TCNA formula calculates grout volume based on tile length, width, thickness, and joint width: Volume (cu in) = ((Length + Width) × Joint Width × Thickness × Area in sq inches) / (Length × Width). Grout dry density is approximately 0.059 lbs per cubic inch.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">What grout joint size should I use for large format tiles?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  For rectified porcelain tiles (edges ground to exact 90 degrees), a 1/16-inch (1.6 mm) or 1/8-inch (3.2 mm) joint is standard. For non-rectified or handmade rustic tiles, use 3/16-inch or 1/4-inch to absorb minor tile size variations.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">Should I choose sanded or unsanded grout?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Use unsanded grout for joints narrower than 1/8-inch and polished marble/glass that can be scratched by quartz silica. Use sanded or high-performance polymer grout for joints 1/8-inch and wider to prevent shrinkage cracking.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
