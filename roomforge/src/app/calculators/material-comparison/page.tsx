import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';
import { MaterialComparisonCalculatorClient } from '@/features/calculators/MaterialComparisonCalculatorClient';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Flooring Material Comparison & 10-Year TCO Calculator | ROOMFORGE',
  description: 'Compare hardwood, luxury vinyl plank, laminate, porcelain tile, and natural stone across upfront material costs, installation labor, durability, and 10-year lifecycle TCO.',
  alternates: {
    canonical: 'https://roomforge.app/calculators/material-comparison',
  },
  openGraph: {
    title: 'Flooring Material Comparison & 10-Year TCO Calculator | ROOMFORGE',
    description: 'Compare upfront costs vs 10-year total cost of ownership across hardwood, LVP, tile, and laminate.',
    url: 'https://roomforge.app/calculators/material-comparison',
    type: 'article',
  },
};

export default function MaterialComparisonCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ROOMFORGE Material Comparison & Lifecycle TCO Calculator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Side-by-side material comparison engine calculating initial purchase, labor installation, 10-year maintenance, durability, and lifespan.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which flooring has the lowest 10-year total cost of ownership?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rigid-core Luxury Vinyl Plank (SPC) and high-density waterproof laminate consistently offer the lowest 10-year TCO. Their affordable initial purchase price ($3 to $4/sq ft), DIY click-lock installability ($0 labor), and virtually zero maintenance expense make them unbeatable for budget longevity.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does solid hardwood add more resale value to a home than luxury vinyl plank?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. National Association of Realtors (NAR) data shows authentic solid hardwood recoups 100% to 118% of its cost at home resale, making it an equity-building investment. Luxury vinyl plank recoups high value in rentals, but buyers in mid-to-luxury homes expect genuine wood or stone.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which flooring is most resistant to active dogs and pet claws?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Glazed porcelain tile is impervious to dog claws and pet urine. Among wood-look options, 20-mil to 28-mil wear-layer Luxury Vinyl Plank (SPC) and AC4/AC5 rated laminate resist claw gouges significantly better than real solid oak or pine.',
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
            <span className="text-forest">Material Comparison</span>
          </nav>

          <Badge variant="sage" className="mb-2 font-mono text-xs">
            LIFECYCLE TCO BENCHMARK
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-forest tracking-tight">
            Flooring Material Lifecycle & TCO Comparison
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
            The cheapest material on day one is not always the cheapest over 10 years. Benchmark real purchase prices, artisan labor, routine maintenance, and expected service lifespans side-by-side.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <MaterialComparisonCalculatorClient />

        {/* Educational Guide */}
        <article className="mt-16 rounded-2xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xs space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
              Evaluating Total Cost of Ownership (TCO) in Flooring
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              When remodeling floors, consumers often fixate solely on the price sticker on the showroom sample. However, the total financial outlay over 10 to 20 years is dictated by three distinct expense phases:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Phase 1</span>
              <h3 className="font-bold text-forest">Upfront Material & Prep</h3>
              <p className="text-xs text-muted leading-relaxed">
                Raw plank or tile price plus transition thresholds, underlayment padding, moisture vapor barriers, and subfloor self-leveling cement.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Phase 2</span>
              <h3 className="font-bold text-forest">Installation Trade Labor</h3>
              <p className="text-xs text-muted leading-relaxed">
                Click-lock vinyl floats over existing flat subfloors in a weekend ($0 DIY). In contrast, porcelain tile and solid hardwood require specialist wet saws, mortar, and nailers ($4 to $8/sq ft labor).
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Phase 3</span>
              <h3 className="font-bold text-forest">Maintenance & Lifespan</h3>
              <p className="text-xs text-muted leading-relaxed">
                Hardwood requires screen-and-recoat every 7-10 years and can last 80+ years. Natural stone requires annual penetrating sealer. Vinyl requires zero maintenance but must be discarded if damaged.
              </p>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="rounded-xl border border-sage-300 bg-sage-50/60 p-6 space-y-3">
            <div className="flex items-center gap-2 text-forest font-bold text-sm">
              <CheckCircle className="h-5 w-5 text-forest" />
              Pro Tip: The Subfloor Deciding Factor
            </div>
            <p className="text-xs text-forest/80 leading-relaxed">
              Never install solid hardwood directly over below-grade concrete (such as a basement). Moisture vapor migrating through concrete will cup and buckle solid planks within 18 months. Always choose 100% waterproof Luxury Vinyl Plank (SPC) or glazed porcelain tile for basements, laundry rooms, and bathrooms.
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
                <h4 className="font-bold text-forest text-sm">Which flooring has the lowest 10-year total cost of ownership?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Rigid-core Luxury Vinyl Plank (SPC) and high-density waterproof laminate consistently offer the lowest 10-year TCO. Their affordable initial purchase price ($3 to $4/sq ft), DIY click-lock installability ($0 labor), and virtually zero maintenance expense make them unbeatable for budget longevity.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">Does solid hardwood add more resale value to a home than luxury vinyl plank?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Yes. National Association of Realtors (NAR) data shows authentic solid hardwood recoups 100% to 118% of its cost at home resale, making it an equity-building investment. Luxury vinyl plank recoups high value in rentals, but buyers in mid-to-luxury homes expect genuine wood or stone.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">Which flooring is most resistant to active dogs and pet claws?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Glazed porcelain tile is impervious to dog claws and pet urine. Among wood-look options, 20-mil to 28-mil wear-layer Luxury Vinyl Plank (SPC) and AC4/AC5 rated laminate resist claw gouges significantly better than real solid oak or pine.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
