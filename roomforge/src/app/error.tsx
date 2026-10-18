'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('RoomForge route error:', error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-black text-forest">Something went wrong</h2>
      <p className="mt-2 text-xs text-muted max-w-sm">
        An unexpected error occurred while rendering this page.
      </p>
      <div className="mt-6">
        <Button onClick={() => reset()} className="gap-2 bg-forest text-sand-50">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </main>
  );
}
