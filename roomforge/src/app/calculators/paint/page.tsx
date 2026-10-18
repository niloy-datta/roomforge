import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';
import { PaintCalculatorClient } from '@/features/calculators/PaintCalculatorClient';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Paint Calculator — Gallons, Coats & Opening Deductions | ROOMFORGE',
  description: 'Calculate paint gallons and liters for interior walls and ceilings. Factors door & window deductions, primer coats, coverage rates, and painter supplies.',
  alternates: {
    canonical: '/calculators/paint',
  },
  openGraph: {
    title: 'Paint Calculator — Gallons, Coats & Opening Deductions | ROOMFORGE',
    description: 'Calculate how many gallons of paint you need for walls and ceilings with automatic door and window subtractions.',
    url: '/calculators/paint',
    type: 'article',
  },
};

export default function PaintCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ROOMFORGE Paint & Surface Area Calculator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Paint calculator with architectural deductions for doors and windows, multi-coat coverage, primer estimation, and recommended sundries.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much area does 1 gallon of paint cover?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One standard US gallon of quality architectural interior paint covers between 350 and 400 square feet of smooth, primed wall surface for a single coat. On rough texture or unprimed drywall, coverage drops to 250 to 300 square feet.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I really need 2 coats of paint?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Even "one-coat guarantee" paints rarely achieve true optical depth, color saturation, and scrub resistance in one pass. Two coats hide microscopic pinholes, roller lap marks, and provide durable washability.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do you calculate door and window deductions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standard architectural rules subtract 21 square feet for each standard interior door (3 ft × 7 ft) and 15 square feet for each standard residential window (3 ft × 5 ft).',
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
            <span className="text-forest">Paint Calculator</span>
          </nav>

          <Badge variant="sage" className="mb-2 font-mono text-xs">
            SURFACE COVERAGE ENGINE
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-forest tracking-tight">
            Paint & Surface Area Calculator
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
            Stop overbuying expensive specialty paint. Accurately deduct doors, windows, and fixtures while computing exact gallons, liters, and primer requirements.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <PaintCalculatorClient />

        {/* Educational Guide */}
        <article className="mt-16 rounded-2xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xs space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
              Professional Interior Painting Formulas
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Professional painters don&apos;t just guess; they calculate total perimeter wall area, subtract the exact square footage of doors and windows, and multiply by coat density.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 1</span>
              <h3 className="font-bold text-forest">Wall Perimeter × Height</h3>
              <p className="text-xs text-muted leading-relaxed">
                Add all four wall lengths (Perimeter = 2 × [Width + Length]) and multiply by ceiling height. A 12&apos;×14&apos; room with 9&apos; ceilings has 468 gross sq ft.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 2</span>
              <h3 className="font-bold text-forest">Subtractive Deductions</h3>
              <p className="text-xs text-muted leading-relaxed">
                Subtract 21 sq ft per door and 15 sq ft per window. In our 12&apos;×14&apos; room with 1 door and 2 windows, net painted surface equals 417 sq ft.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 3</span>
              <h3 className="font-bold text-forest">Divide by 350 sq ft/gal</h3>
              <p className="text-xs text-muted leading-relaxed">
                Multiply net area by number of coats, then divide by coverage spread rate (350 sq ft). Round up to full gallon cans.
              </p>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="rounded-xl border border-sage-300 bg-sage-50/60 p-6 space-y-3">
            <div className="flex items-center gap-2 text-forest font-bold text-sm">
              <CheckCircle className="h-5 w-5 text-forest" />
              Pro Tip: When is Primer Strictly Required?
            </div>
            <p className="text-xs text-forest/80 leading-relaxed">
              Self-priming paint works on previously painted walls in similar shades. You must apply a dedicated standalone bonding primer when painting over: (1) Fresh unpainted drywall or joint compound, (2) Glossy oil-based enamels, (3) Water or smoke stains, or (4) Transitioning from deep red/black to crisp white.
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
                <h4 className="font-bold text-forest text-sm">How much area does 1 gallon of paint cover?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  One standard US gallon of quality architectural interior paint covers between 350 and 400 square feet of smooth, primed wall surface for a single coat. On rough texture or unprimed drywall, coverage drops to 250 to 300 square feet.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">Do I really need 2 coats of paint?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Yes. Even &quot;one-coat guarantee&quot; paints rarely achieve true optical depth, color saturation, and scrub resistance in one pass. Two coats hide microscopic pinholes, roller lap marks, and provide durable washability.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">How do you calculate door and window deductions?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Standard architectural rules subtract 21 square feet for each standard interior door (3 ft × 7 ft) and 15 square feet for each standard residential window (3 ft × 5 ft).
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
