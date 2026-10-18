import { Ruler, Palette, Calculator } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Measure your space',
      desc: 'Enter your room width and length. Instant top-down 2D floor plans render dynamically with real dimensions.',
      icon: Ruler,
      color: 'bg-sage-100 text-sage-800',
    },
    {
      num: '02',
      title: 'Explore materials & patterns',
      desc: 'Test luxury vinyl, engineered oak, porcelain tile, and laminate. Toggle straight vs staggered layouts in real time.',
      icon: Palette,
      color: 'bg-clay-100 text-clay-800',
    },
    {
      num: '03',
      title: 'Know exact box counts',
      desc: 'Get deterministic box quantities, customizable waste allowances, surplus offcut calculations, and complete material costs.',
      icon: Calculator,
      color: 'bg-sand-200 text-forest',
    },
  ];

  return (
    <section className="py-20 border-t border-sand-300 bg-sand-100/40" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-clay-600 mb-2">
            THE PROCESS / 01
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
            From &ldquo;what if&rdquo; to <em className="italic font-serif">what&apos;s possible.</em>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Three straightforward steps between you and a smarter renovation. Make confident flooring decisions before spending a single dollar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="rounded-2xl border border-sand-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-muted">{step.num}</span>
                  <div className={`p-2.5 rounded-xl ${step.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">{step.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
