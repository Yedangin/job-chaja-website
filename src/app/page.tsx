'use client';

import Header from '@/components/header';
import HeroSlider from '@/components/hero-slider';
import QuickAccess from '@/components/quick-access';
import QuickSearch from '@/components/quick-search';
import PremiumJobs from '@/components/premium-jobs';
import RealtimeJobs from '@/components/realtime-jobs';
import Footer from '@/components/footer';

/**
 * 메인 페이지 (공용 랜딩) / Main landing page (public)
 * 레이아웃: 사라민 스타일 — 슬라이더 → 바로가기 → 검색바 → 프리미엄 → 일반 공고
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <Header />

      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6 fade-in-up">

          {/* 배너 슬라이더 */}
          <HeroSlider />

          {/* 빠른 바로가기 아이콘 행 */}
          <QuickAccess />

          {/* 사라민식 가로 검색바 */}
          <QuickSearch />

          {/* 프리미엄 공고 — amber/gold 테마 */}
          <PremiumJobs />

          {/* 실시간 공고 — 일반 sky 테마 */}
          <RealtimeJobs />

        </div>
      </main>

      <Footer />
    </div>
  );
}
