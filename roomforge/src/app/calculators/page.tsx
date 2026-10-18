import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Layers,
  Grid,
  Paintbrush,
  Box,
  Hammer,
  DollarSign,
  Scale,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdSlot } from '@/components/ads/AdSlot';

export const metadata: Metadata = {
  title: 'Renovation & Material Calculators Suite | ROOMFORGE',
  description: 'Free, professional construction and home improvement calculators. Compute flooring cartons, tile & grout weight, paint gallons, concrete volume, drywall sheets, and complete project budgets.',
  alternates: {
    canonical: '/calculators',
  },
  openGraph: {
    title: 'Renovation & Material Calculators Suite | ROOMFORGE',
    description: 'Free professional calculators for flooring, tile, paint, concrete, drywall, and renovation budgets.',
    url: '/calculators',
    type: 'website',
  },
};

const CALCULATOR_DIRECTORY = [
  {
    id: 'flooring',
    title: 'Flooring & Plank Calculator',
    description: 'Calculate carton requirements, waste allowances across straight, diagonal and herringbone patterns, and total material budget.',
    href: '/calculators/flooring',
    icon: Layers,
    badge: 'Popular',
    metrics: ['Box counts', 'Pattern waste', 'Cost per sq ft'],
  },
  {
    id: 'tile',
    title: 'Tile & Grout Calculator',
    description: 'Complies with TCNA standards. Computes gross tile count, grout pounds by joint width, spacer counts, and box quantities.',
    href: '/calculators/tile',
    icon: Grid,
    badge: 'TCNA Standards',
    metrics: ['Tile count', 'Grout weight (lbs)', 'Spacer counts'],
  },
  {
    id: 'paint',
    title: 'Paint & Surface Area Calculator',
    description: 'Accounts for window/door deductions and multi-coat applications. Calculates gallons, liters, and recommended sundries.',
    href: '/calculators/paint',
    icon: Paintbrush,
    badge: 'Architectural',
    metrics: ['Gallons & Liters', 'Door/Window Deductions', 'Primer Needs'],
  },
  {
    id: 'concrete',
    title: 'Concrete Slab & Footing Calculator',
    description: 'Accurately converts length, width, and slab depth into cubic yards, cubic meters, and 60/80-lb pre-mix bag yields.',
    href: '/calculators/concrete',
    icon: Box,
    badge: 'Cubic Volume',
    metrics: ['Cubic yards', '80lb / 60lb bags', 'Ready-mix recommendation'],
  },
  {
    id: 'drywall',
    title: 'Drywall & Sheetrock Calculator',
    description: 'Estimates 4×8, 4×10, and 4×12 gypsum sheets, screw quantities, joint tape linear footage, and drywall mud pails.',
    href: '/calculators/drywall',
    icon: Hammer,
    badge: 'Finishing',
    metrics: ['Sheets needed', 'Fastener counts', 'Mud buckets (4.5 gal)'],
  },
  {
    id: 'renovation-cost',
    title: 'Room Renovation Cost Estimator',
    description: 'Benchmark realistic budgets for kitchens, master baths, basements, and living spaces across 4 finish tiers with contingency buffers.',
    href: '/calculators/renovation-cost',
    icon: DollarSign,
    badge: 'Budgeting',
    metrics: ['Trade breakdown', 'Labor vs DIY savings', 'Contingency fund'],
  },
  {
    id: 'material-comparison',
    title: 'Material Lifecycle & TCO Comparison',
    description: 'Compare solid hardwood, engineered wood, luxury vinyl plank, porcelain tile, and laminate across upfront and 10-year total ownership costs.',
    href: '/calculators/material-comparison',
    icon: Scale,
    badge: '10-Yr TCO',
    metrics: ['Water resistance', 'Installation costs', '10-Year Lifecycle'],
  },
];

export default function CalculatorsHubPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ROOMFORGE Renovation & Construction Calculators',
    description: 'Professional interactive calculators for flooring, tile, paint, concrete, drywall, and home renovation cost estimates.',
    url: '/calculators',
    hasPart: CALCULATOR_DIRECTORY.map((c) => ({
      '@type': 'WebPage',
      name: c.title,
      description: c.description,
      url: c.href,
    })),
  };

  return (
    <div className="min-h-screen bg-sand-100/40 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="border-b border-sand-300 bg-white/80 backdrop-blur-md pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge variant="sage" className="mb-3 font-mono text-xs">
            PROFESSIONAL ESTIMATING SUITE
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-forest tracking-tight">
            Construction & Renovation Calculators
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
            Eliminate guesswork before ordering materials. Every ROOMFORGE calculator is calibrated to industry architectural standards, structural yield tolerances, and contractor purchasing units.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-forest" />
              100% Free & No Registration
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-forest" />
              Imperial & Metric Conversions
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-forest" />
              Deterministic Real-World Formulas
            </span>
          </div>
        </div>
      </section>

      {/* Leaderboard Ad */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <AdSlot format="horizontal-banner" />
      </div>

      {/* Directory Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CALCULATOR_DIRECTORY.map((calc) => {
            const Icon = calc.icon;
            return (
              <div
                key={calc.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-sand-300 bg-white p-6 shadow-xs transition-all hover:border-forest/50 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/5 text-forest group-hover:bg-forest group-hover:text-sand-50 transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-[11px] font-mono">
                      {calc.badge}
                    </Badge>
                  </div>

                  <h2 className="text-xl font-bold text-forest group-hover:text-clay-600 transition-colors">
                    {calc.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {calc.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {calc.metrics.map((m) => (
                      <span
                        key={m}
                        className="rounded-md bg-sand-100 px-2 py-0.5 text-[11px] font-medium text-forest"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-sand-200">
                  <Link href={calc.href}>
                    <Button variant="ghost" className="w-full justify-between font-bold text-forest group-hover:text-clay-600 px-0">
                      Launch Calculator
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Studio CTA Banner */}
        <div className="mt-14 rounded-3xl bg-forest p-8 sm:p-10 text-sand-50 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-sand-50/10 px-3 py-1 text-xs font-mono text-sand-200 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-clay-400" />
              VISUAL 2D INTERACTIVE STUDIO
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Prefer drawing your room before calculating?
            </h3>
            <p className="mt-2 text-sm text-sand-200 leading-relaxed">
              Open the ROOMFORGE Studio to plan rectangular and L-shaped floor plans with live 2D pattern previews, real-time perimeter dimensions, door cuts, and printable project cost receipts.
            </p>
          </div>
          <Link href="/studio">
            <Button size="lg" className="bg-clay-500 hover:bg-clay-600 text-white font-bold px-8 shadow-lg shrink-0">
              Open 2D Studio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
