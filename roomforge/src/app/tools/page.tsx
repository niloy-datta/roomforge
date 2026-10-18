import { Metadata } from 'next';
import { ToolsHubClient } from '@/features/tools/ToolsHubClient';

export const metadata: Metadata = {
  title: 'Flooring Calculators & Tools Suite | ROOMFORGE',
  description: 'Free calculators for carton counts, laying pattern waste estimation, square footage to square meters conversion, and side-by-side material budget comparisons.',
  alternates: {
    canonical: '/tools',
  },
};

export default function ToolsPage() {
  return <ToolsHubClient />;
}
