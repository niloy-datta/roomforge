import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';
import { FlooringCalculatorClient } from '@/features/calculators/FlooringCalculatorClient';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Flooring Calculator — Exact Box, Waste & Cost Estimator | ROOMFORGE',
  description: 'Calculate flooring cartons, square footage, pattern waste allowances (straight, diagonal, herringbone), and material budgets. Free contractor-grade flooring tool.',
  alternates: {
    canonical: '/calculators/flooring',
  },
  openGraph: {
    title: 'Flooring Calculator — Exact Box, Waste & Cost Estimator | ROOMFORGE',
    description: 'Calculate how many boxes of laminate, vinyl, or hardwood you need with exact pattern waste factors.',
    url: '/calculators/flooring',
    type: 'article',
  },
};

export default function FlooringCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ROOMFORGE Flooring Calculator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Online flooring calculator estimating room square footage, box requirements, laying pattern waste, and total material costs.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much extra flooring waste should I buy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Industry standards recommend 8% to 10% for straight or staggered plank runs. For diagonal 45-degree layouts, budget 15%. For intricate herringbone or chevron parquetry, plan for 18% to 20% waste due to perimeter diagonal triangular offcuts.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do manufacturers sell flooring by the carton instead of exact square feet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Flooring planks are manufactured in fixed mill runs and packed in sealed cardboard cartons (typically 18 to 24 sq ft per box) to prevent shipping warp and moisture absorption. Installers must round up to the nearest full unopened box.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I keep leftover flooring boxes after installation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Always preserve at least 1 unopened box (known as attic stock). Floor models and dye lots change frequently; having spare matching planks allows seamless spot repairs if a board gets scratched, gouged, or damaged by moisture years later.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-sand-100/40 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb & Header */}
      <div className="border-b border-sand-300 bg-white/80 backdrop-blur-md pt-8 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-muted mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/calculators" className="hover:text-forest transition-colors">Calculators</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-forest">Flooring Calculator</span>
          </nav>

          <Badge variant="sage" className="mb-2 font-mono text-xs">
            PROFESSIONAL FLOORING ESTIMATOR
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-forest tracking-tight">
            Flooring & Carton Calculator
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
            Eliminate installation shortages and avoid paying for excess cartons. Calculate exact net square footage, pattern-specific cutting allowances, and total material expenses in seconds.
          </p>
        </div>
      </div>

      {/* Main Calculator Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <FlooringCalculatorClient />

        {/* In-Depth Educational Guide (SEO & User Authority) */}
        <article className="mt-16 rounded-2xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xs space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
              How to Calculate Flooring Material Accurately
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Ordering flooring materials requires calculating two numbers: your room&apos;s physical footprint (net area) and the supplemental square footage lost to doorway cuts, wall irregularities, end-of-row trims, and defective boards (gross area).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 1</span>
              <h3 className="font-bold text-forest">Measure Room Dimensions</h3>
              <p className="text-xs text-muted leading-relaxed">
                Measure the longest length and width of the room in feet. For alcoves or closets, calculate each sub-rectangle separately and sum them together.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 2</span>
              <h3 className="font-bold text-forest">Apply Laying Waste Factor</h3>
              <p className="text-xs text-muted leading-relaxed">
                Add 8-10% for straight parallel planks, 15% for diagonal runs, and 18-20% for herringbone or chevron patterns where corner angles create offcuts.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 3</span>
              <h3 className="font-bold text-forest">Divide by Carton Coverage</h3>
              <p className="text-xs text-muted leading-relaxed">
                Divide gross square footage by the square footage printed on your manufacturer box. Always round up to the next integer carton.
              </p>
            </div>
          </div>

          {/* Waste Factor Reference Table */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-forest">
              Standard Laying Pattern Waste Benchmark Guide
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-sand-200 rounded-lg">
                <thead className="bg-sand-100 text-forest font-bold border-b border-sand-200">
                  <tr>
                    <th className="p-3">Laying Pattern</th>
                    <th className="p-3">Recommended Waste</th>
                    <th className="p-3">Primary Waste Cause</th>
                    <th className="p-3">DIY Skill Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  <tr>
                    <td className="p-3 font-semibold text-forest">Straight Planks (Grid)</td>
                    <td className="p-3 text-forest font-mono">8%</td>
                    <td className="p-3 text-muted">Perimeter wall cuts only</td>
                    <td className="p-3 text-forest">Beginner</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-forest">Standard Staggered (1/3 Offset)</td>
                    <td className="p-3 text-forest font-mono">10%</td>
                    <td className="p-3 text-muted">Offcuts reused at start of next row</td>
                    <td className="p-3 text-forest">Intermediate</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-forest">Diagonal 45-Degree</td>
                    <td className="p-3 text-forest font-mono">15%</td>
                    <td className="p-3 text-muted">Triangular corner perimeter cuts</td>
                    <td className="p-3 text-forest">Advanced</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-forest">Herringbone / Chevron Parquet</td>
                    <td className="p-3 text-forest font-mono">18% – 20%</td>
                    <td className="p-3 text-muted">Left & right tongue-groove pairs + edge routing</td>
                    <td className="p-3 text-forest">Professional / Master</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Expert Pro Tips */}
          <div className="rounded-xl border border-sage-300 bg-sage-50/60 p-6 space-y-3">
            <div className="flex items-center gap-2 text-forest font-bold text-sm">
              <CheckCircle className="h-5 w-5 text-forest" />
              Contractor Rule: Acclimate Before Installation
            </div>
            <p className="text-xs text-forest/80 leading-relaxed">
              Always stack hardwood, laminate, or luxury vinyl plank boxes flat inside the target room for at least 48 to 72 hours prior to laying. This stabilizes the core moisture content with the ambient indoor relative humidity, preventing seasonal buckling and gaping.
            </p>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-4 pt-4 border-t border-sand-200">
            <h3 className="text-xl font-bold text-forest flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-clay-500" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">How much extra flooring waste should I buy?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Industry standards recommend 8% to 10% for straight or staggered plank runs. For diagonal 45-degree layouts, budget 15%. For intricate herringbone or chevron parquetry, plan for 18% to 20% waste due to perimeter diagonal triangular offcuts.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">Why do manufacturers sell flooring by the carton instead of exact square feet?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Flooring planks are manufactured in fixed mill runs and packed in sealed cardboard cartons (typically 18 to 24 sq ft per box) to prevent shipping warp and moisture absorption. Installers must round up to the nearest full unopened box.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">Should I keep leftover flooring boxes after installation?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Yes! Always preserve at least 1 unopened box (known as attic stock). Floor models and dye lots change frequently; having spare matching planks allows seamless spot repairs if a board gets scratched, gouged, or damaged by moisture years later.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
