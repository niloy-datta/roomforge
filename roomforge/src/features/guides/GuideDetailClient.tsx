'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GuideArticle } from './guidesData';

export function GuideDetailClient({ guide }: { guide: GuideArticle }) {
  return (
    <div className="min-h-screen bg-sand-100/50 pb-24">
      <div className="border-b border-sand-300 bg-white/70 backdrop-blur-md pt-8 pb-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-forest mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all guides
          </Link>
          <div className="flex items-center gap-3 mb-2 font-mono text-xs text-muted">
            <Badge variant="sage">{guide.category}</Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-sage-600" />
              {guide.readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
            {guide.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {guide.subtitle}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10" id="main-content">
        <div className="space-y-10 bg-white p-6 sm:p-10 rounded-2xl border border-sand-300 shadow-sm">
          {guide.sections.map((sec, i) => {
    const secId = i === 0 ? "area" : i === 1 ? "waste" : i === 2 ? "boxes" : i === 3 ? "budget" : undefined;
    return (
            <section key={i} id={secId} className="space-y-3 pb-8 border-b border-sand-200 last:border-b-0">
              <h2 className="text-xl font-black text-forest">{sec.title}</h2>

              {sec.formula && (
                <div className="p-3.5 rounded-lg bg-sand-100 border border-sand-300 font-mono text-xs sm:text-sm font-bold text-forest">
                  {sec.formula}
                </div>
              )}

              <div className="space-y-2 text-sm text-charcoal leading-relaxed">
                {sec.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {sec.example && (
                <div className="p-4 rounded-xl bg-sage-50/70 border border-sage-200 text-xs sm:text-sm text-forest font-medium flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sage-600 shrink-0 mt-0.5" />
                  <span><strong>Worked Example:</strong> {sec.example}</span>
                </div>
              )}
            </section>
          );})}

          {/* Call to action at bottom of guide */}
          <div className="rounded-xl bg-forest p-6 text-sand-50 text-center space-y-3">
            <h3 className="text-xl font-black">Ready to visualize this in your room?</h3>
            <p className="text-xs sm:text-sm text-sand-200/80 max-w-md mx-auto">
              Test your room dimensions, preview luxury vinyl, engineered oak, and porcelain tile with our live visual studio.
            </p>
            <div className="pt-2">
              <Link href="/studio">
                <Button className="bg-clay-500 hover:bg-clay-600 font-bold gap-2 text-white">
                  Open The Flooring Studio
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
