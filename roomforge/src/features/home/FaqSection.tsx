'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is RoomForge really free?',
      a: 'Yes. RoomForge\'s interactive planner, calculations, unit conversion, and shopping list generators are completely free to use with no account, subscription or credit card required.',
    },
    {
      q: 'How accurate are the box count estimates?',
      a: 'Calculations use deterministic math: room dimensions × waste allowance ÷ box coverage rounded up to the nearest whole box. While mathematically precise for rectangular rooms, irregular alcoves or complex diagonal patterns may require additional cutting allowances.',
    },
    {
      q: 'Can I switch between feet and meters?',
      a: 'Yes. Switch units in the studio or tools suite and the physical dimensions are converted seamlessly while preserving geometric accuracy.',
    },
    {
      q: 'Are my projects saved in my browser?',
      a: 'Yes. Your recent configurations are automatically stored in your local browser\'s storage. You can also generate a persistent shareable URL or copy your shopping list at any time.',
    },
  ];

  return (
    <section className="py-20 border-t border-sand-300 bg-sand-100/50" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-clay-600 mb-2">
            GOOD TO KNOW
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-sand-300 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm sm:text-base font-bold text-forest hover:bg-sand-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn('h-4 w-4 text-muted transition-transform duration-200', isOpen && 'rotate-180')}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-muted leading-relaxed border-t border-sand-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
