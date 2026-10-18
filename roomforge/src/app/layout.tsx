import type { Metadata, Viewport } from 'next';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SkipLink } from '@/components/layout/SkipLink';
import './globals.css';

export const metadata: Metadata = {
  title: 'ROOMFORGE · Visual Flooring Studio & Material Estimator',
  description: 'Interactive 2D top-down flooring planner and deterministic box estimator. Test materials, waste allowances, and calculate precise flooring budgets.',
  keywords: ['flooring calculator', 'flooring visualizer', 'room planner', 'square footage calculator', 'box count calculator', 'luxury vinyl plank', 'engineered oak'],
  authors: [{ name: 'RoomForge Architecture Team' }],
  openGraph: {
    title: 'ROOMFORGE · Visual Flooring Studio & Material Estimator',
    description: 'Design your floor plan before buying. Calculate exact boxes, test patterns, and preview 2D room layouts.',
    type: 'website',
    locale: 'en_US',
    siteName: 'RoomForge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROOMFORGE · Visual Flooring Studio',
    description: 'Deterministic 2D flooring planner and material estimator.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#f8f7f4',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-sand-100/60 text-charcoal flex flex-col font-sans antialiased">
        <SkipLink />
        <SiteHeader />
        <div className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
