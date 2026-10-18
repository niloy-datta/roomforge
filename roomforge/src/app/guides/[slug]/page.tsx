import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { GUIDES } from '@/features/guides/guidesData';
import { GuideDetailClient } from '@/features/guides/GuideDetailClient';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES.map((g) => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: 'Guide Not Found | ROOMFORGE' };

  return {
    title: `${guide.title} | ROOMFORGE Field Guide`,
    description: guide.summary,
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  return <GuideDetailClient guide={guide} />;
}
