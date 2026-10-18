import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';
import { RenovationCostCalculatorClient } from '@/features/calculators/RenovationCostCalculatorClient';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Renovation Cost Calculator — Kitchen, Bath & Room Estimator | ROOMFORGE',
  description: 'Estimate remodeling budgets for kitchens, bathrooms, basements, and full houses. Features trade allocations, finish tiers, labor vs DIY splits, and contingency planning.',
  alternates: {
    canonical: 'https://roomforge.app/calculators/renovation-cost',
  },
  openGraph: {
    title: 'Renovation Cost Calculator — Kitchen, Bath & Room Estimator | ROOMFORGE',
    description: 'Accurately estimate home remodeling costs by room type, square footage, and contractor trade allocations.',
    url: 'https://roomforge.app/calculators/renovation-cost',
    type: 'article',
  },
};

export default function RenovationCostCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ROOMFORGE Renovation Cost Calculator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Renovation budget estimator modeling contractor labor rates, materials, trade breakdowns, and contingency reserves.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the average cost per square foot for a home remodel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Dry living spaces (bedrooms, living rooms) average $35 to $60 per square foot. Plumbing and cabinet-dense wet spaces cost significantly more: standard bathrooms average $200 to $250 per square foot, and full kitchen remodels range from $150 to $300+ per square foot depending on custom cabinetry and stone slabs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why is a 15% to 20% contingency fund recommended for renovations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Once drywall and subfloors are opened during demolition, hidden conditions frequently emerge: outdated knob-and-tube or aluminum wiring, unvented plumbing stacks, termite rot, or sagging floor joists. A dedicated contingency buffer prevents project delays and debt when these issues must be addressed to pass municipal building inspection.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much money can you save by handling parts of the renovation DIY?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tackling demolition, trash hauling, and interior painting yourself typically saves 15% to 25% of total project costs, leaving licensed electricians, plumbers, and precision tile setters to execute the technical core.',
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
            <span className="text-forest">Renovation Cost Calculator</span>
          </nav>

          <Badge variant="sage" className="mb-2 font-mono text-xs">
            FINANCIAL BENCHMARKING ENGINE
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-forest tracking-tight">
            Room Renovation Cost Estimator
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
            Eliminate budget shock before hiring contractors. Projects accurate labor and material splits, municipal permit buffers, and trade allocations across kitchens, bathrooms, and basements.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <RenovationCostCalculatorClient />

        {/* Educational Guide */}
        <article className="mt-16 rounded-2xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xs space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
              Anatomy of a Residential Remodeling Budget
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Renovation costs divide into two primary categories: hard costs (raw materials, fixtures, cabinetry) and labor trades (licensed electricians, plumbers, carpenters). Understanding the proportional trade weights prevents running out of funds before finish fixtures arrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Phase 1</span>
              <h3 className="font-bold text-forest">Demolition & Rough-In</h3>
              <p className="text-xs text-muted leading-relaxed">
                Tear-out, framing reconfigurations, mechanicals, plumbing supply/waste lines, and electrical rough wiring consume ~35% of overall budget before visible finishes appear.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Phase 2</span>
              <h3 className="font-bold text-forest">Enclosure & Surfaces</h3>
              <p className="text-xs text-muted leading-relaxed">
                Insulation, drywall hang and tape, waterproof shower pans, subfloor leveling, and tile setting establish durable room foundations.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Phase 3</span>
              <h3 className="font-bold text-forest">Finishes & Millwork</h3>
              <p className="text-xs text-muted leading-relaxed">
                Cabinets, stone countertops, plumbing trim kits, lighting fixtures, appliances, door casings, baseboards, and paint complete the aesthetic experience.
              </p>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="rounded-xl border border-sage-300 bg-sage-50/60 p-6 space-y-3">
            <div className="flex items-center gap-2 text-forest font-bold text-sm">
              <CheckCircle className="h-5 w-5 text-forest" />
              Pro Tip: The Golden Rule of Kitchen Cabinets
            </div>
            <p className="text-xs text-forest/80 leading-relaxed">
              In any major kitchen remodel, cabinetry and hardware alone represent approximately 30% to 35% of the total expenditures. Opting for ready-to-assemble (RTA) solid wood semi-custom boxes over full custom architectural cabinetry can save $8,000 to $15,000 on average.
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
                <h4 className="font-bold text-forest text-sm">What is the average cost per square foot for a home remodel?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Dry living spaces (bedrooms, living rooms) average $35 to $60 per square foot. Plumbing and cabinet-dense wet spaces cost significantly more: standard bathrooms average $200 to $250 per square foot, and full kitchen remodels range from $150 to $300+ per square foot depending on custom cabinetry and stone slabs.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">Why is a 15% to 20% contingency fund recommended for renovations?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Once drywall and subfloors are opened during demolition, hidden conditions frequently emerge: outdated knob-and-tube or aluminum wiring, unvented plumbing stacks, termite rot, or sagging floor joists. A dedicated contingency buffer prevents project delays and debt when these issues must be addressed to pass municipal building inspection.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">How much money can you save by handling parts of the renovation DIY?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Tackling demolition, trash hauling, and interior painting yourself typically saves 15% to 25% of total project costs, leaving licensed electricians, plumbers, and precision tile setters to execute the technical core.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
