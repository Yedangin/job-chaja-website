import type { Metadata } from 'next';
import { CanonicalInfoBoardList } from '@/features/board/components/canonical-info-board-list';

export const metadata: Metadata = {
  title: 'Employer support guide | JobChaja',
  alternates: { canonical: '/company/support/guide' },
  robots: { index: false, follow: false },
};

export default function CompanySupportGuidePage() {
  return (
    <CanonicalInfoBoardList
      access="company"
      kind="guide"
      basePath="/company/support/guide"
    />
  );
}
