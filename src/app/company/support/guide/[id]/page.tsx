import type { Metadata } from 'next';
import { CanonicalInfoBoardDetail } from '@/features/board/components/canonical-info-board-detail';

export const metadata: Metadata = {
  title: 'Employer support guide | JobChaja',
  robots: { index: false, follow: false },
};

export default async function CompanySupportGuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <CanonicalInfoBoardDetail
      access="company"
      postId={Number(id)}
      basePath="/company/support/guide"
    />
  );
}
