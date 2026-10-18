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

          {/* Calculators Navigation */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-forest mb-3">Construction Calculators</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/calculators/flooring" className="hover:text-forest transition-colors">
                  Flooring & Carton Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/tile" className="hover:text-forest transition-colors">
                  Tile & Grout Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/paint" className="hover:text-forest transition-colors">
                  Paint & Surface Area
                </Link>
              </li>
              <li>
                <Link href="/calculators/concrete" className="hover:text-forest transition-colors">
                  Concrete Slab & Yards
                </Link>
              </li>
              <li>
                <Link href="/calculators/drywall" className="hover:text-forest transition-colors">
                  Drywall Sheets & Mud
                </Link>
              </li>
              <li>
                <Link href="/calculators/renovation-cost" className="hover:text-forest transition-colors">
                  Renovation Cost Estimator
                </Link>
              </li>
              <li>
                <Link href="/calculators/material-comparison" className="hover:text-forest transition-colors">
                  Material 10-Yr TCO
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides & Tools */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-forest mb-3">Studio & Guides</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/studio" className="hover:text-forest transition-colors flex items-center gap-1">
                  2D Room Studio <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-forest transition-colors">
                  All Calculators Directory
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-forest transition-colors">
                  Quick Toolkit & Converter
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-forest transition-colors">
                  Field Guides & Methodologies
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-forest transition-colors">
                  About & Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Disclaimers */}
          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-forest mb-3">Legal & Compliance</h4>
            <p className="text-[11px] text-muted leading-relaxed">
              Material cost estimates are mathematical projections for planning guidance and do not replace certified engineering blueprints or on-site inspections.
            </p>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div>
                <Link href="/privacy" className="hover:text-forest transition-colors">
                  Privacy Policy & Cookies
                </Link>
              </div>
              <div>
                <Link href="/terms" className="hover:text-forest transition-colors">
                  Terms of Service & Disclaimer
                </Link>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-sand-300/40 border border-sand-300/60 text-[11px] text-forest font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-clay-600 flex-shrink-0" />
              <span>100% Free & client-side calculation privacy.</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-sand-300 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {new Date().getFullYear()} ROOMFORGE. Better spaces begin with a better plan.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/studio" className="hover:text-forest transition-colors">Studio</Link>
            <Link href="/calculators" className="hover:text-forest transition-colors">Calculators</Link>
            <Link href="/tools" className="hover:text-forest transition-colors">Tools</Link>
            <Link href="/guides" className="hover:text-forest transition-colors">Guides</Link>
            <Link href="/privacy" className="hover:text-forest transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-forest transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
