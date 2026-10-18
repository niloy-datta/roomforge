import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';
import { DrywallCalculatorClient } from '@/features/calculators/DrywallCalculatorClient';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Drywall Calculator — Sheets, Screws, Mud & Tape Estimator | ROOMFORGE',
  description: 'Calculate drywall sheets (4x8, 4x10, 4x12), drywall screws, joint tape rolls, and all-purpose compound mud buckets for walls and ceilings.',
  alternates: {
    canonical: '/calculators/drywall',
  },
  openGraph: {
    title: 'Drywall Calculator — Sheets, Screws, Mud & Tape Estimator | ROOMFORGE',
    description: 'Calculate how many sheets of drywall, buckets of mud, and boxes of screws you need for your room or basement finishing project.',
    url: '/calculators/drywall',
    type: 'article',
  },
};

export default function DrywallCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ROOMFORGE Drywall & Sheetrock Calculator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Professional drywall estimation calculating 4x8, 4x10, and 4x12 sheets, fastener screws, joint tape linear feet, and joint compound pails.',
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Should I buy 4x8 or 4x12 drywall sheets?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use 4x12 sheets if you have a helper or drywall lift; 12-foot boards eliminate 33% of vertical butt joints, making taping and finishing far faster and smoother. Use 4x8 sheets for tight staircases, DIY solo installations, or smaller rooms.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much joint compound (mud) do I need per sheet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The industry rule of thumb is approximately 0.053 gallons per square foot of drywall for a complete 3-coat finish (bedding coat, fill coat, and skim coat). One standard 4.5-gallon pail of joint compound finishes approximately 80 to 90 square feet (about 3 sheets of 4x8).',
        },
      },
      {
        '@type': 'Question',
        name: 'How many screws are used per 4x8 drywall sheet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On standard 16-inch on-center wall studs, use approximately 32 screws per 4x8 sheet (spaced 12 to 16 inches apart along each stud). For ceilings, code requires screws every 12 inches, averaging 36 to 40 screws per sheet.',
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
            <span className="text-forest">Drywall Calculator</span>
          </nav>

          <Badge variant="sage" className="mb-2 font-mono text-xs">
            GYPSUM FINISHING SPECIFICATION
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-forest tracking-tight">
            Drywall & Sheetrock Calculator
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
            Plan your hanging and taping materials with precision. Estimates 4×8, 4×10, and 4×12 sheets, coarse-thread drywall screws, joint tape rolls, and all-purpose compound buckets.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <DrywallCalculatorClient />

        {/* Educational Guide */}
        <article className="mt-16 rounded-2xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xs space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-forest tracking-tight">
              Drywall Installation & Estimating Standards
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              Drywall estimation is more than counting panels; it requires factoring in ceiling orientation, horizontal wall stacking (which strengthens wall shear strength compared to vertical hanging), and multi-phase joint finishing compounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 1</span>
              <h3 className="font-bold text-forest">Hang Horizontally</h3>
              <p className="text-xs text-muted leading-relaxed">
                Always hang sheets horizontally across wall studs. This cuts linear joint seam length by 25% and places the taped seam at comfortable working chest height.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 2</span>
              <h3 className="font-bold text-forest">Ceilings Before Walls</h3>
              <p className="text-xs text-muted leading-relaxed">
                Install ceiling drywall first. Wall sheets then fit snugly underneath, supporting the edges of the ceiling panels and locking the perimeter joint in place.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
              <span className="text-xs font-mono font-bold text-clay-600 uppercase">Step 3</span>
              <h3 className="font-bold text-forest">Compound Mud Rule</h3>
              <p className="text-xs text-muted leading-relaxed">
                Budget 1 standard 4.5-gallon pail of joint compound per 80 to 90 sq ft. This provides adequate mud for tape embedment, 2nd fill coat, and final feathered skim coat.
              </p>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="rounded-xl border border-sage-300 bg-sage-50/60 p-6 space-y-3">
            <div className="flex items-center gap-2 text-forest font-bold text-sm">
              <CheckCircle className="h-5 w-5 text-forest" />
              Pro Tip: Screw Depth Matters
            </div>
            <p className="text-xs text-forest/80 leading-relaxed">
              Use a dimpled drywall screw setter bit. The screw head must be driven just slightly below the paper surface without tearing the paper face. If the paper tears, the screw loses 80% of its holding power, which causes screw pops over time.
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
                <h4 className="font-bold text-forest text-sm">Should I buy 4x8 or 4x12 drywall sheets?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  Use 4x12 sheets if you have a helper or drywall lift; 12-foot boards eliminate 33% of vertical butt joints, making taping and finishing far faster and smoother. Use 4x8 sheets for tight staircases, DIY solo installations, or smaller rooms.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">How much joint compound (mud) do I need per sheet?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  The industry rule of thumb is approximately 0.053 gallons per square foot of drywall for a complete 3-coat finish (bedding coat, fill coat, and skim coat). One standard 4.5-gallon pail of joint compound finishes approximately 80 to 90 square feet (about 3 sheets of 4x8).
                </p>
              </div>
              <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/40">
                <h4 className="font-bold text-forest text-sm">How many screws are used per 4x8 drywall sheet?</h4>
                <p className="text-muted mt-1 leading-relaxed">
                  On standard 16-inch on-center wall studs, use approximately 32 screws per 4x8 sheet (spaced 12 to 16 inches apart along each stud). For ceilings, code requires screws every 12 inches, averaging 36 to 40 screws per sheet.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
