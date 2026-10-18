import { Suspense } from 'react';
import { Metadata } from 'next';
import { StudioPageClient } from '@/features/studio/StudioPageClient';

export const metadata: Metadata = {
  title: 'Interactive Flooring Studio | ROOMFORGE',
  description: 'Visual 2D room floor plan editor with real-time material switches, box quantity calculations, and print-ready shopping summaries.',
  alternates: {
    canonical: '/studio',
  },
};

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-sand-100">
          <div className="flex flex-col items-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest border-t-transparent" />
            <span className="text-xs font-bold text-muted">Loading Visual Flooring Studio...</span>
          </div>
        </div>
      }
    >
      <StudioPageClient />
    </Suspense>
  );
}
