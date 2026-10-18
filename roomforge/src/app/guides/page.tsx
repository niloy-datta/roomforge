import { Metadata } from 'next';
import { GuidesHubClient } from '@/features/guides/GuidesHubClient';

export const metadata: Metadata = {
  title: 'Flooring Field Guides & Formulas | ROOMFORGE',
  description: 'Clear formulas, waste allowance benchmarks, and worked examples to calculate flooring boxes, avoid overbuying, and budget renovation projects.',
  alternates: {
    canonical: '/guides',
  },
};

export default function GuidesPage() {
  return <GuidesHubClient />;
}
