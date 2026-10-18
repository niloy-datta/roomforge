import { Metadata } from 'next';
import { AboutClient } from '@/features/about/AboutClient';

export const metadata: Metadata = {
  title: 'About RoomForge & Architectural Methodology | ROOMFORGE',
  description: 'Our mission to bring deterministic precision, transparent math, and beautiful 2D visualization to flooring and interior renovation projects.',
};

export default function AboutPage() {
  return <AboutClient />;
}
