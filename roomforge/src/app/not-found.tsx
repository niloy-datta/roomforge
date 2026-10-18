import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-sand-200 text-forest flex items-center justify-center mb-6 font-mono font-bold text-2xl">
        404
      </div>
      <h1 className="text-3xl font-black text-forest tracking-tight">Room Not Found</h1>
      <p className="mt-2 text-sm text-muted max-w-sm">
        The floor plan or page you are looking for does not exist or has been relocated.
      </p>
      <div className="mt-6 flex items-center space-x-3">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/studio">
          <Button className="gap-2 bg-clay-500 hover:bg-clay-600 text-white font-bold">
            <Compass className="h-4 w-4" />
            Open Studio
          </Button>
        </Link>
      </div>
    </main>
  );
}
