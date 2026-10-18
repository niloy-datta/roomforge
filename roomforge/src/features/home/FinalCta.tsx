import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCta() {
  return (
    <section className="py-24 bg-forest text-sand-50 text-center relative overflow-hidden">
      {/* Decorative radial circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-sage-700/40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-sage-800/30 pointer-events-none" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <p className="text-xs font-bold uppercase tracking-widest text-clay-400">
          YOUR NEXT PROJECT STARTS HERE
        </p>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
          Less wondering. <br />
          <em className="italic font-serif text-clay-300">More making.</em>
        </h2>
        <p className="text-sm sm:text-base text-sand-200/80 max-w-lg mx-auto">
          Start planning your floor layout with real materials and print-ready shopping estimates today.
        </p>
        <div className="pt-2">
          <Link href="/studio">
            <Button size="lg" className="gap-2 bg-clay-500 hover:bg-clay-600 text-white font-bold shadow-xl px-8 h-12 text-base">
              Start Designing — It&apos;s Free
              <ArrowUpRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
