import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CanonicalInfoBoardList } from '@/features/board/components/canonical-info-board-list';

export const metadata: Metadata = {
  title: 'Notices | JobChaja',
  description: 'Official JobChaja service and Korea stay notices.',
  alternates: { canonical: '/notice' },
};

export default function NoticePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <CanonicalInfoBoardList access="public" kind="notice" basePath="/notice" />
      <Footer />
    </div>
  );
}
