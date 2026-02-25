'use client';

import Header from '@/components/header';
import HeroSlider from '@/components/hero-slider';
import QuickSearch from '@/components/quick-search';
import PremiumJobs from '@/components/premium-jobs';
import RealtimeJobs from '@/components/realtime-jobs';
import Footer from '@/components/footer';

/**
 * 메인 페이지 (공용 랜딩) / Main landing page (public)
 * 로그인 후에는 역할별 대시보드로 리다이렉트
 * 레이아웃: 사라민 스타일 — 슬라이더 → 검색바 → 가로형 채용 목록
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <Header />

      <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6 fade-in-up">

          {/* 슬라이더 / Banner slider */}
          <HeroSlider />

          {/* 사라민식 가로 검색바 / Saramin-style horizontal search bar */}
          <QuickSearch />

          {/* 프리미엄 공고 / Premium jobs — horizontal card list */}
          <PremiumJobs />

          {/* 실시간 공고 / Realtime jobs — horizontal card list */}
          <RealtimeJobs />

        </div>
      </main>

      <Footer />
    </div>
  );
}
