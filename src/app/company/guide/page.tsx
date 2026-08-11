import type { Metadata } from 'next';
import { CanonicalInfoBoardList } from '@/features/board/components/canonical-info-board-list';

export const metadata: Metadata = {
  title: 'Foreign employment guide | JobChaja',
  alternates: { canonical: '/company/guide' },
  robots: { index: false, follow: false },
};

export default function CompanyGuidePage() {
  return <CanonicalInfoBoardList access="company" kind="guide" basePath="/company/guide" />;
}
