import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeatureBand() {
  const points = [
    'Interactive 2D top-down room preview with live scaled dimensions',
    'Real-time box count and surplus offcut calculations',
    'Customizable waste allowance based on laying pattern',
    'Printable shopping list and shareable URL links for clients or contractors',
  ];

  return (
    <section className="py-20 bg-forest text-sand-50" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-clay-400">
              A NEW WAY TO SEE / 02
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Make room for <br />
              <em className="italic font-serif text-clay-300">better ideas.</em>
            </h2>
            <p className="text-sm sm:text-base text-sand-200/80 leading-relaxed max-w-xl">
              Not just another static calculator. RoomForge is a dedicated interactive studio to experiment, compare textures, and order exact material quantities with zero guesswork.
            </p>

            <div className="space-y-3 pt-2">
              {points.map((pt, i) => (
                <div key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-sand-100">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-clay-500 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/studio">
                <Button size="lg" className="gap-2 bg-clay-500 hover:bg-clay-600 text-white font-bold shadow-lg">
                  Explore The Studio
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mini Studio Card Graphic */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-sage-600/50 bg-sage-900/60 p-5 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-sage-700/60 pb-3 text-xs text-sand-300 font-mono">
                <span>roomforge / studio</span>
                <span className="text-clay-400 font-bold">● LIVE PREVIEW</span>
              </div>
              <div className="rounded-xl bg-forest/80 border border-sage-700 p-4 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-sage-800">
                  <span className="text-sand-300">Room Size</span>
                  <span className="font-bold text-sand-50">12 ft × 18 ft</span>
                </div>
                <div className="flex justify-between py-1 border-b border-sage-800">
                  <span className="text-sand-300">Flooring</span>
                  <span className="font-bold text-sand-50">Luxury Vinyl Plank</span>
                </div>
                <div className="flex justify-between py-1 border-b border-sage-800">
                  <span className="text-sand-300">Waste Factor</span>
                  <span className="font-bold text-sand-50">10%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-sage-800">
                  <span className="text-sand-300">Required Boxes</span>
                  <span className="font-bold text-clay-400 text-sm">10 Boxes</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-black">
                  <span className="text-sand-50">Estimated Total</span>
                  <span className="text-clay-400">$450.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
