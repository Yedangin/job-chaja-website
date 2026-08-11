import type { Metadata } from 'next';
import { CanonicalInfoBoardList } from '@/features/board/components/canonical-info-board-list';

export const metadata: Metadata = {
  title: 'Foreign worker guide | JobChaja',
  alternates: { canonical: '/worker/guide' },
  robots: { index: false, follow: false },
};

export default function WorkerGuidePage() {
  return <CanonicalInfoBoardList access="worker" kind="guide" basePath="/worker/guide" />;
}
