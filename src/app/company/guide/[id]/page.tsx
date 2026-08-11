import type { Metadata } from 'next';
import { CanonicalInfoBoardDetail } from '@/features/board/components/canonical-info-board-detail';

export const metadata: Metadata = {
  title: 'Foreign employment guide | JobChaja',
  robots: { index: false, follow: false },
};

export default async function CompanyGuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <CanonicalInfoBoardDetail
      access="company"
      postId={Number(id)}
      basePath="/company/guide"
    />
  );
}
