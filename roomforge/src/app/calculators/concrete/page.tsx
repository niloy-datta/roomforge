import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';
import { ConcreteCalculatorClient } from '@/features/calculators/ConcreteCalculatorClient';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Concrete Calculator — Cubic Yards, Bags & Slab Volume | ROOMFORGE',
  description: 'Calculate concrete volume in cubic yards, cubic meters, and 80-lb, 60-lb, or 50-lb pre-mix bags. Compares bag mixing vs ready-mix delivery truck costs.',
  alternates: {
    canonical: '/calculators/concrete',
  },
  openGraph: {
    title: 'Concrete Calculator — Cubic Yards, Bags & Slab Volume | ROOMFORGE',
    description: 'Calculate cubic yards and how many bags of concrete you need for patios, driveways, sidewalks, and foundation footings.',
    url: '/calculators/concrete',
    type: 'article',
  },
};

export default function ConcreteCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ROOMFORGE Concrete Calculator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Calculates concrete volume in cubic yards, cubic feet, and cubic meters, estimating bags of pre-mix concrete needed for slabs and footings.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do you calculate cubic yards of concrete for a slab?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Formula: (Length in feet × Width in feet × [Thickness in inches / 12]) / 27. For example, a 10 ft × 10 ft patio at 4 inches thick: (10 × 10 × 0.333) / 27 = 1.23 cubic yards. Adding 10% subgrade waste yields 1.35 cubic yards.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many 80 lb bags of concrete make 1 cubic yard?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'One 80-lb bag yields 0.60 cubic feet of mixed concrete. Since 1 cubic yard equals 27 cubic feet, it takes exactly 45 bags of 80-lb concrete (or 60 bags of 60-lb concrete) to make 1 cubic yard.',
        },
      },
      {
        '@type': 'Question',
        name: 'When should I order a concrete truck instead of mixing bags?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The standard cutoff is 1.5 to 2.0 cubic yards (approx 70 to 90 bags). Hand-mixing more than 60 bags takes hours and risks cold joints where early batches start curing before the later batches are poured. Ready-mix trucks pour the entire slab monolithically in under 20 minutes.',
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
            <span className="text-forest">Concrete Calculator</span>
          </nav>

          <Badge variant="sage" className="mb-2 font-mono text-xs">
            CIVIL & RESIDENTIAL SLAB CALCULATOR
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-forest tracking-tight">
            Concrete Slab & Footing Calculator
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
            Eliminate costly truck short-load fees or running short mid-pour. Computes volume in cubic yards, cubic meters, and pre-mix bag yields.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <ConcreteCalculatorClient />

        {/* Educational Guide */}
        <article className="mt-16 rounded-2xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xs space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
              Civil Engineering Slab Math Explained
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Concrete is measured and ordered in volume (cubic yards or cubic meters), while forms are built in length, width, and inches of depth. Converting between these units requires precise dimensional analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 1</span>
              <h3 className="font-bold text-forest">Convert Depth to Feet</h3>
              <p className="text-xs text-muted leading-relaxed">
                Divide slab thickness by 12. A 4-inch sidewalk slab equals 0.333 feet. A 6-inch garage slab equals 0.50 feet.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 2</span>
              <h3 className="font-bold text-forest">Calculate Cubic Feet</h3>
              <p className="text-xs text-muted leading-relaxed">
                Multiply Length (ft) × Width (ft) × Depth (ft). A 12&apos;×12&apos; patio at 4 inches depth equals 144 × 0.333 = 48 cubic feet.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 3</span>
              <h3 className="font-bold text-forest">Divide by 27 cu ft/yd</h3>
              <p className="text-xs text-muted leading-relaxed">
                Divide total cubic feet by 27 to obtain cubic yards. 48 / 27 = 1.78 cubic yards. Add 10% subgrade unevenness = 1.95 yards.
              </p>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="rounded-xl border border-sage-300 bg-sage-50/60 p-6 space-y-3">
            <div className="flex items-center gap-2 text-forest font-bold text-sm">
              <CheckCircle className="h-5 w-5 text-forest" />
              Pro Tip: Beware of Ground Compaction & Excavation Dip
            </div>
            <p className="text-xs text-forest/80 leading-relaxed">
              Excavated subgrades are rarely laser-level. If your subbase dips by just 1/2 inch across a 20×20 slab, it will consume an extra 1/2 cubic yard of concrete! Never order exact theoretical volume; always maintain a 10% safety cushion.
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
                <h4 className="font-bold text-forest text-sm">How do you calculate cubic yards of concrete for a slab?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Formula: (Length in feet × Width in feet × [Thickness in inches / 12]) / 27. For example, a 10 ft × 10 ft patio at 4 inches thick: (10 × 10 × 0.333) / 27 = 1.23 cubic yards. Adding 10% subgrade waste yields 1.35 cubic yards.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">How many 80 lb bags of concrete make 1 cubic yard?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  One 80-lb bag yields 0.60 cubic feet of mixed concrete. Since 1 cubic yard equals 27 cubic feet, it takes exactly 45 bags of 80-lb concrete (or 60 bags of 60-lb concrete) to make 1 cubic yard.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">When should I order a concrete truck instead of mixing bags?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  The standard cutoff is 1.5 to 2.0 cubic yards (approx 70 to 90 bags). Hand-mixing more than 60 bags takes hours and risks cold joints where early batches start curing before the later batches are poured. Ready-mix trucks pour the entire slab monolithically in under 20 minutes.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
