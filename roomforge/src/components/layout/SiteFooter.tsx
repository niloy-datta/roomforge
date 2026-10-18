import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Ruler, Sparkles } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-sand-300 bg-sand-200/60 pt-16 pb-12 text-charcoal">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-sand-50 font-black tracking-tighter text-sm">
                R<span className="text-clay-400">.</span>
              </span>
              <span className="text-lg font-black tracking-tight text-forest">
                roomforge<span className="text-clay-500">.</span>
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              Architectural flooring studio & material estimation engine. Plan room layouts, test patterns and calculate exact box quantities with total mathematical transparency.
            </p>
            <div className="flex items-center space-x-3 text-xs text-muted font-medium pt-2">
              <span className="inline-flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5 text-sage-600" /> Exact 2D Math
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-sage-600" /> Client-Side Privacy
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-forest mb-3">Studio & Tools</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/studio" className="hover:text-forest transition-colors flex items-center gap-1">
                  Flooring Studio <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-forest transition-colors">
                  Flooring Tools Suite
                </Link>
              </li>
              <li>
                <Link href="/tools?tab=converter" className="hover:text-forest transition-colors">
                  Feet to Meters Converter
                </Link>
              </li>
              <li>
                <Link href="/tools?tab=waste" className="hover:text-forest transition-colors">
                  Pattern Waste Estimator
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-forest mb-3">Field Guides</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/guides/flooring-calculator" className="hover:text-forest transition-colors">
                  How to Calculate Flooring Boxes
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-forest transition-colors">
                  All Field Guides & Formulas
                </Link>
              </li>
              <li>
                <Link href="/about#transparency" className="hover:text-forest transition-colors">
                  Deterministic Math Specs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-forest transition-colors">
                  Architecture & Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimers & Info */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-forest mb-3">Transparency</h4>
            <p className="text-[11px] text-muted leading-relaxed">
              Material cost estimates exclude labor, subfloor prep, trims, transitions, and delivery. Waste allowance is an estimation factor, not an individualized cutting diagram.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-sand-300/40 border border-sand-300/60 text-[11px] text-forest font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-clay-600 flex-shrink-0" />
              <span>Free, open and running completely in your browser.</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-sand-300 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {new Date().getFullYear()} ROOMFORGE. Better spaces begin with a better plan.</p>
          <div className="flex items-center space-x-6">
            <Link href="/studio" className="hover:text-forest transition-colors">Studio</Link>
            <Link href="/tools" className="hover:text-forest transition-colors">Tools</Link>
            <Link href="/guides" className="hover:text-forest transition-colors">Guides</Link>
            <Link href="/about" className="hover:text-forest transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
