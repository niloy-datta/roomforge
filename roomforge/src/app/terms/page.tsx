import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ChevronRight, AlertTriangle, CheckCircle, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Terms of Service & Estimating Disclaimer | ROOMFORGE',
  description: 'Terms of service, engineering disclaimer, and fair use guidelines for ROOMFORGE calculations and visual design tools.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-sand-100/40 pb-24">
      {/* Header */}
      <div className="border-b border-sand-300 bg-white/80 backdrop-blur-md pt-8 pb-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-muted mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-forest">Terms of Service</span>
          </nav>

          <Badge variant="sage" className="mb-2 font-mono text-xs">
            TERMS & CONDITIONS
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
            Terms of Service & Disclaimer
          </h1>
          <p className="mt-2 text-sm text-muted">
            Last Updated: October 2026 • Please read carefully before using ROOMFORGE
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="rounded-2xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xs space-y-10 text-forest/90">
          {/* Engineering Disclaimer Alert */}
          <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-6 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              Important Architectural & Engineering Disclaimer
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              ROOMFORGE provides mathematical estimations, material carton quantity projections, and conceptual 2D visual layout previews for planning and budgeting guidance only. <strong>ROOMFORGE does not provide certified civil engineering, structural blueprints, or professional building code compliance certifications.</strong>
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-forest flex items-center gap-2">
              <Scale className="h-5 w-5 text-forest" />
              1. Acceptance of Terms
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              By accessing and using ROOMFORGE (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our calculation tools or visual planners.
            </p>
          </section>

          <section className="space-y-3 border-t border-sand-200 pt-8">
            <h2 className="text-xl font-black text-forest flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-forest" />
              2. User Responsibilities & On-Site Verification
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              Construction and remodeling involve real-world physical tolerances that cannot be modeled entirely in software. As a user, you agree and acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs text-muted pl-2">
              <li>
                <strong>Physical Field Measurements:</strong> You are solely responsible for measuring physical on-site conditions, verifying plumb walls, level subfloors, and moisture vapor emissions before ordering materials or cutting planks.
              </li>
              <li>
                <strong>Manufacturer Guidelines:</strong> Always consult and adhere strictly to your specific material manufacturer&apos;s written installation manuals, expansion gap requirements, acclimatization times, and warranty conditions.
              </li>
              <li>
                <strong>Building Codes:</strong> Ensure all work complies with local municipal building regulations, electrical codes (NEC), plumbing codes (UPC/IPC), and permit requirements.
              </li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-sand-200 pt-8">
            <h2 className="text-xl font-black text-forest flex items-center gap-2">
              <FileText className="h-5 w-5 text-forest" />
              3. Limitation of Liability
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              To the fullest extent permitted by applicable law, ROOMFORGE and its operators, developers, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from: (a) material shortages or overages, (b) installation labor delays or defects, (c) project cost overruns, or (d) reliance on estimated calculation figures. All tools and calculations are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind.
            </p>
          </section>

          <section className="space-y-3 border-t border-sand-200 pt-8">
            <h2 className="text-xl font-black text-forest">
              4. Intellectual Property & Fair Use
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              The ROOMFORGE name, visual brand identity, software user interface, custom algorithms, and educational articles are protected by copyright and intellectual property laws. You are welcome to use our tools, share links, and print project receipts for personal and commercial renovation planning. Automated scraping, bulk extraction, or unauthorized duplication of our proprietary code is prohibited.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
