import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ChevronRight, Lock, Cookie, Eye, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Privacy Policy & Cookie Disclosure | ROOMFORGE',
  description: 'Learn how ROOMFORGE protects your privacy, uses local device storage for calculations, and complies with GDPR, CCPA, and Google AdSense policies.',
  alternates: {
    canonical: 'https://roomforge.app/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-sand-100/40 pb-24">
      {/* Header */}
      <div className="border-b border-sand-300 bg-white/80 backdrop-blur-md pt-8 pb-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-muted mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-forest">Privacy Policy</span>
          </nav>

          <Badge variant="sage" className="mb-2 font-mono text-xs">
            LEGAL & COMPLIANCE
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted">
            Last Updated: October 2026 • Effective Immediately
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="rounded-2xl border border-sand-300 bg-white p-8 sm:p-12 shadow-xs space-y-10 text-forest/90">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-forest flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-forest" />
              1. Our Core Commitment: Client-Side Privacy
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              At ROOMFORGE, your privacy is fundamental to our software architecture. All room dimensions, geometry inputs, material price overrides, and custom room layout plans are processed <strong>entirely inside your web browser</strong> using client-side JavaScript. We do not transmit, log, or store your room measurements or renovation project quotes on external servers.
            </p>
          </section>

          <section className="space-y-3 border-t border-sand-200 pt-8">
            <h2 className="text-xl font-black text-forest flex items-center gap-2">
              <Cookie className="h-5 w-5 text-clay-500" />
              2. Google AdSense & Third-Party Advertising
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              We may display advertisements served by Google AdSense and its advertising partners to support our free calculation services.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs text-muted pl-2">
              <li>
                <strong>Third-party vendors</strong>, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites across the Internet.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to ROOMFORGE and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest font-bold underline"
                >
                  Google Ads Settings
                </a>
                {' '}or by visiting{' '}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest font-bold underline"
                >
                  aboutads.info
                </a>.
              </li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-sand-200 pt-8">
            <h2 className="text-xl font-black text-forest flex items-center gap-2">
              <Lock className="h-5 w-5 text-forest" />
              3. Local Device Storage & URL State
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              ROOMFORGE utilizes standard browser APIs (such as <code className="bg-sand-100 px-1.5 py-0.5 rounded font-mono text-xs">localStorage</code> and URL search query parameters) solely to provide uninterrupted workflow convenience:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-muted pl-2">
              <li>Restoring your last active room dimensions, shapes, and material selections when returning to the studio.</li>
              <li>Enabling shareable URL links so you can send your exact room calculation to a contractor or spouse.</li>
              <li>Remembering your preferred measurement unit preference (Imperial feet vs Metric meters).</li>
            </ul>
            <p className="text-xs text-muted">
              You can clear this stored data at any time by clearing your browser cache or clicking &quot;Reset Defaults&quot; inside any calculator.
            </p>
          </section>

          <section className="space-y-3 border-t border-sand-200 pt-8">
            <h2 className="text-xl font-black text-forest flex items-center gap-2">
              <Eye className="h-5 w-5 text-forest" />
              4. Analytics & Performance Telemetry
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              We may collect anonymized, aggregated traffic metrics (such as page load duration, browser type, approximate country-level geographic region, and Core Web Vitals) to ensure high responsiveness and identify broken browser layouts. This technical data contains no personally identifiable information (PII).
            </p>
          </section>

          <section className="space-y-3 border-t border-sand-200 pt-8">
            <h2 className="text-xl font-black text-forest">
              5. Rights Under GDPR (EU/UK) and CCPA/CPRA (California)
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              Depending on your jurisdiction, you possess statutory privacy rights including the right to know what personal data is collected, request its deletion, and opt out of the sale or sharing of personal information. Because ROOMFORGE does not collect user accounts or store personal dossiers, we do not sell your personal data.
            </p>
          </section>

          <section className="space-y-3 border-t border-sand-200 pt-8">
            <h2 className="text-xl font-black text-forest flex items-center gap-2">
              <Mail className="h-5 w-5 text-clay-500" />
              6. Contact Us
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              If you have any questions or data privacy inquiries regarding this policy, please reach out via our open GitHub repository or email us at{' '}
              <a href="mailto:privacy@roomforge.app" className="text-forest font-bold underline">
                privacy@roomforge.app
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
