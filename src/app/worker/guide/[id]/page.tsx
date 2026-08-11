import type { Metadata } from 'next';
import { CanonicalInfoBoardDetail } from '@/features/board/components/canonical-info-board-detail';

export const metadata: Metadata = {
  title: 'Foreign worker guide | JobChaja',
  robots: { index: false, follow: false },
};

export default async function WorkerGuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <CanonicalInfoBoardDetail
      access="worker"
      postId={Number(id)}
      basePath="/worker/guide"
    />
  );
}
