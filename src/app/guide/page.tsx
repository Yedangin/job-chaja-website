import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CanonicalInfoBoardList } from '@/features/board/components/canonical-info-board-list';

export const metadata: Metadata = {
  title: 'Guide to life in Korea | JobChaja',
  description: 'Verified guidance for living and working in Korea.',
  alternates: { canonical: '/guide' },
};

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <CanonicalInfoBoardList access="public" kind="guide" basePath="/guide" />
      <Footer />
    </div>
  );
}
