import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GUIDES } from './guidesData';

export function GuidesHubClient() {
  return (
    <div className="min-h-screen bg-sand-100/50 pb-24">
      <div className="border-b border-sand-300 bg-white/70 backdrop-blur-md pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge variant="sage" className="mb-3 font-mono text-xs">
            ROOMFORGE FIELD GUIDES
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-forest tracking-tight">
            Flooring Formulas, Math & Field Guides
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
            Architectural guides and mathematical formulas to help you measure spaces accurately, optimize cutting waste, and budget renovations with confidence.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10" id="main-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GUIDES.map((guide) => (
            <Card key={guide.slug} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between text-xs text-muted mb-2 font-mono">
                  <span>{guide.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-sage-600" />
                    {guide.readTime}
                  </span>
                </div>
                <CardTitle className="text-xl hover:text-clay-600 transition-colors">
                  <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                </CardTitle>
                <p className="text-xs text-muted leading-relaxed mt-2">{guide.summary}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/guides/${guide.slug}`}>
                  <Button variant="outline" className="gap-2 text-xs font-bold w-full sm:w-auto">
                    Read Complete Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
