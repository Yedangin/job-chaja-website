'use client';

import { useState } from 'react';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import PremiumJobs from '@/components/premium-jobs';
import RealtimeJobs from '@/components/realtime-jobs';
import CompanyLogos from '@/components/company-logos';
import InfoHub from '@/components/info-hub';
import Footer from '@/components/footer';
import { Briefcase, Clock } from 'lucide-react';

/**
 * 메인 페이지 — 외국인 생활 플랫폼 / Main page — Foreign worker life platform
 *
 * 히어로 3분할: 비자진단 | 공지슬라이더+아이콘3 | 교육·생활리스트
 * Hero 3-split: Visa diagnosis | Notice slider+3 icons | Education+Life list
 *
 * 채용 섹션: 알바/정규직 토글로 필터링
 * Job section: Alba/Fulltime toggle filtering
 *
 * [1] 히어로 (비자진단 | 공지+아이콘 | 교육·생활리스트) — white
 * [2] 채용 정보 (알바/정규직 토글 + 프리미엄 + 실시간) — #F9FAFB
 * [3] 기업로고 + 정보허브 — white
 */
export default function Home() {
  /* 알바/정규직 토글 상태 — '' = 전체 / '' = show all */
  const [jobType, setJobType] = useState<'' | 'PART_TIME' | 'FULL_TIME'>('');

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <Header />

      <main className="grow">
        {/* [1] 히어로 / Hero */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HeroSection />
          </div>
        </div>

        {/* [2] 채용 정보 / Job listings */}
        <div id="job-listings" className="bg-[#F9FAFB] py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* 알바/정규직 토글 — 컴팩트 스타일 / Compact alba/fulltime toggle */}
            <div className="flex items-center justify-center mb-4">
              <div className="inline-flex bg-white rounded-xl p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#F2F4F6]">
                <button
                  onClick={() => setJobType((prev) => (prev === 'PART_TIME' ? '' : 'PART_TIME'))}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-[13px] font-bold transition-all duration-200 ${
                    jobType === 'PART_TIME'
                      ? 'bg-[#0066FF] text-white shadow-sm'
                      : 'text-[#6B7684] hover:text-[#333D4B]'
                  }`}
                >
                  <Clock size={14} />
                  알바
                </button>
                <button
                  onClick={() => setJobType((prev) => (prev === 'FULL_TIME' ? '' : 'FULL_TIME'))}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-[13px] font-bold transition-all duration-200 ${
                    jobType === 'FULL_TIME'
                      ? 'bg-[#191F28] text-white shadow-sm'
                      : 'text-[#6B7684] hover:text-[#333D4B]'
                  }`}
                >
                  <Briefcase size={14} />
                  정규직
                </button>
              </div>
            </div>

            <div className="space-y-10">
              <PremiumJobs boardFilter={jobType} />
              <RealtimeJobs boardFilter={jobType} />
            </div>
          </div>
        </div>

        {/* [3] 기업 로고 + 정보 허브 / Logos + Info hub */}
        <div id="info-hub" className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <CompanyLogos />
            <InfoHub />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
