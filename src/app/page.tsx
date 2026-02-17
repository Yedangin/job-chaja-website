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
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12 fade-in-up">
          {/* 히어로 섹션 / Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <HeroSlider />
            <QuickSearch />
          </section>

          {/* 프리미엄 공고 / Premium Jobs */}
          <PremiumJobs />

          {/* 실시간 공고 / Real-time Jobs */}
          <RealtimeJobs />
        </div>
      </main>

      <Footer />
    </div>
  );
}
