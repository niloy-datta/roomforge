import { HeroQuickStart } from '@/features/home/HeroQuickStart';
import { InteractiveHeroPreview } from '@/features/home/InteractiveHeroPreview';
import { ProcessSection } from '@/features/home/ProcessSection';
import { FeatureBand } from '@/features/home/FeatureBand';
import { AccuracyMathSection } from '@/features/home/AccuracyMathSection';
import { FaqSection } from '@/features/home/FaqSection';
import { FinalCta } from '@/features/home/FinalCta';

export default function HomePage() {
  return (
    <main id="main-content" className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <HeroQuickStart />
            </div>
            <div className="lg:col-span-5">
              <InteractiveHeroPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="border-y border-sand-300 bg-sand-200/50 py-3.5 text-xs font-bold tracking-widest text-forest uppercase">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-around gap-4 text-center">
          <span>Design before you decide</span>
          <span className="hidden md:inline">·</span>
          <span>No spreadsheets or guesswork</span>
          <span className="hidden md:inline">·</span>
          <span>Deterministic client-side math</span>
        </div>
      </div>

      <ProcessSection />
      <FeatureBand />
      <AccuracyMathSection />
      <FaqSection />
      <FinalCta />
    </main>
  );
}
