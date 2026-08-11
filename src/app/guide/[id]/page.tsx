import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CanonicalInfoBoardDetail } from '@/features/board/components/canonical-info-board-detail';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: 'Korea guide | JobChaja',
    alternates: { canonical: `/guide/${id}` },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <CanonicalInfoBoardDetail access="public" postId={Number(id)} basePath="/guide" />
      <Footer />
    </div>
  );
}
