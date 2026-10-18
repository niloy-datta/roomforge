import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function AccuracyMathSection() {
  return (
    <section className="py-20 border-t border-sand-300 bg-sand-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-clay-600">
              BUILT ON CLARITY / 03
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
              Numbers that <br />
              <em className="italic font-serif">actually mean something.</em>
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Every estimate is calculated from exact physical dimensions and transparent box coverage formulas. No mystery retail markups, no hidden variables.
            </p>
            <div className="pt-2">
              <Link
                href="/guides/flooring-calculator"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-clay-600 hover:text-clay-700"
              >
                See how we calculate <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-sand-300 bg-white p-6 shadow-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                THE MATH, MADE TRANSPARENT
              </span>
              <div className="flex justify-between py-2 border-b border-sand-200 text-xs sm:text-sm">
                <span className="text-muted">Room Area</span>
                <span className="font-bold text-forest">12 ft × 18 ft = 216 ft²</span>
              </div>
              <div className="flex justify-between py-2 border-b border-sand-200 text-xs sm:text-sm">
                <span className="text-muted">Allowance (+10% waste)</span>
                <span className="font-bold text-forest">+21.6 ft²</span>
              </div>
              <div className="flex justify-between py-2 border-b border-sand-200 text-xs sm:text-sm">
                <span className="text-muted">Total Coverage Needed</span>
                <span className="font-bold text-forest">237.6 ft²</span>
              </div>
              <div className="flex justify-between py-2 border-b border-sand-200 text-xs sm:text-sm">
                <span className="text-muted">Box Coverage Spec</span>
                <span className="font-bold text-forest">24 ft² / box</span>
              </div>
              <div className="flex justify-between py-3 rounded-lg bg-sage-50 px-3 text-sm font-bold text-forest">
                <span>Boxes to Buy (Ceiling)</span>
                <span className="text-clay-600 font-black">10 Boxes</span>
              </div>
              <p className="text-[11px] text-muted leading-tight pt-1">
                Illustrative example. Labor, transition strips, underlayment, and preparation excluded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
