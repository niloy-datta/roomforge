import { Ruler, ShieldCheck, Code2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AboutClient() {
  return (
    <div className="min-h-screen bg-sand-100/50 pb-24">
      {/* Header */}
      <div className="border-b border-sand-300 bg-white/70 backdrop-blur-md pt-12 pb-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge variant="sage" className="mb-3 font-mono text-xs">
            ROOMFORGE ARCHITECTURE
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
            Deterministic Precision: The RoomForge Manifesto
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            Why we built RoomForge: to replace opaque contractor spreadsheets and retail guesswork with verifiable 2D visual plans and client-side deterministic math.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 space-y-8" id="main-content">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="p-2.5 rounded-xl bg-sage-100 text-sage-800 w-fit mb-2">
                <Ruler className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Exact 2D Math</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted leading-relaxed">
                Calculations execute deterministically without cloud servers or unpredictable rounding discrepancies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2.5 rounded-xl bg-clay-100 text-clay-800 w-fit mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Private & Client-Side</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted leading-relaxed">
                Your measurements and project data stay strictly inside your browser&apos;s local storage. No trackers, accounts or logins.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2.5 rounded-xl bg-sand-200 text-forest w-fit mb-2">
                <Code2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Modern Next.js Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted leading-relaxed">
                Engineered with Next.js 15 App Router, TypeScript strict mode, Tailwind CSS, Lucide icons, Vitest, and Playwright.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Narrative */}
        <div className="bg-white rounded-2xl border border-sand-300 p-8 sm:p-10 space-y-6 shadow-sm">
          <h2 className="text-2xl font-black text-forest">The RoomForge Methodology</h2>
          <div className="space-y-4 text-sm text-charcoal leading-relaxed">
            <p>
              When renovating a home, calculating flooring materials has traditionally been divided between two poor extremes: basic online calculators that hide their formulas, or cumbersome architectural software with steep learning curves.
            </p>
            <p>
              RoomForge bridges this gap by combining an interactive top-down 2D floor visualizer with deterministic material estimation. You see how different plank sizes and laying patterns visually transform a rectangular room while watching exact carton counts adjust in real time.
            </p>
          </div>

          <div id="transparency" className="pt-4 border-t border-sand-200 space-y-3">
            <h3 className="text-lg font-bold text-forest">Transparent Formula Specification</h3>
            <div className="p-4 rounded-xl bg-sand-100 font-mono text-xs space-y-2 text-forest border border-sand-300">
              <p>Area (ft²) = Width (ft) × Length (ft)</p>
              <p>Coverage Needed (ft²) = Area × (1 + Waste % ÷ 100)</p>
              <p>Boxes to Order = Math.ceil(Coverage Needed ÷ Box Coverage)</p>
              <p>Material Cost = Boxes to Order × Price per Box</p>
              <p>Total Estimated Budget = Material Cost × (1 + Sales Tax % ÷ 100)</p>
            </div>
          </div>

          <div className="pt-4 border-t border-sand-200">
            <h3 className="text-lg font-bold text-forest mb-2">Disclaimers & Site Conditions</h3>
            <p className="text-xs text-muted leading-relaxed">
              All calculations provide material quantities for rectangular rooms with standard waste allowances. They do not optimize individual cutting layouts, angled walls, or include trim transitions, underlayment, adhesive, subfloor leveling, labor, delivery, or tool rental. Always consult with your licensed flooring contractor before purchasing materials.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
