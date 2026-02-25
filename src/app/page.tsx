'use client';

import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import PremiumJobs from '@/components/premium-jobs';
import RealtimeJobs from '@/components/realtime-jobs';
import Footer from '@/components/footer';

/**
 * 메인 페이지 (공용 랜딩) / Main landing page (public)
 * 레이아웃: 히어로 섹션 → 프리미엄 공고 (카드 그리드) → 일반 공고 (리스트)
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <Header />

      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 fade-in-up">

          {/* 히어로 섹션 — auth 페이지와 동일한 slate-900 디자인 */}
          <HeroSection />

          {/* 프리미엄 공고 — 2열 카드 그리드 */}
          <PremiumJobs />

          {/* 실시간 공고 — 컴팩트 리스트 */}
          <RealtimeJobs />

        </div>
      </main>

      <Footer />
    </div>
  );
}
