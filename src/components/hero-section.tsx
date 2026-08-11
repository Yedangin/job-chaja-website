'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, FileText, Route, CalendarClock, ListChecks, UserCheck } from 'lucide-react';
import FeaturedNoticeSlider from './featured-notice-slider';
import HomeInfoBoard from './home-info-board';

/**
 * 메인 히어로 — 3분할 (비자진단 | 가이드슬라이더+아이콘3 | 교육·생활리스트)
 * Main hero — 3-split (Visa diagnosis | Guide slider+3 icons | Education+Life list)
 *
 * 슬라이더: API에서 게시글을 불러와 동적 표시, 6초 자동 회전, 좌우 화살표
 * Slider: Fetches posts from API dynamically, 6s auto-rotate, left/right arrows
 */

/* ─── 서비스 아이콘 3개 / 3 service icons ────────────── */
const serviceIcons = [
  { icon: Briefcase, label: '채용공고', href: '#job-listings', color: 'text-[#0066FF]', bg: 'bg-[#0066FF]/8' },
  { icon: FileText, label: '이력서', href: '/worker/resume', color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/8' },
  { icon: Route, label: '비자 여정', href: '/worker/visa-journey', color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/8' },
];

const journeyTrustPoints = [
  { icon: CalendarClock, label: '정책 기준일 표시' },
  { icon: ListChecks, label: '조건·서류 분리 안내' },
  { icon: UserCheck, label: '전문가 연결 가능' },
];

/* ─── 메인 컴포넌트 / Main component ─────────────────── */
export default function HeroSection() {
  /* 스무스 스크롤 핸들러 / Smooth scroll handler */
  const handleScrollLink = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_340px] gap-5 py-6">

      {/* ═══ 1열: 비자 진단 (주력) / Col 1: Visa diagnosis (primary) ═══ */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/8 mb-5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
          <span className="text-[12px] font-semibold text-[#0066FF]">외국인 취업·생활 통합 플랫폼</span>
        </div>

        <h1 className="text-[28px] lg:text-[36px] font-bold text-[#191F28] leading-[1.2] tracking-[-0.02em] mb-3">
          한국 취업·생활,<br />비자부터 시작하세요
        </h1>

        <p className="text-[15px] text-[#6B7684] leading-[1.6] mb-6 max-w-md">
          현재 조건을 확인하고, 부족한 조건부터 셀프 수속까지<br />
          정책 기준일과 함께 단계별로 준비하세요.
        </p>

        {/* 두 서비스 버튼: 개인화 플래너 + 공개 비자 가이드 */}
        <div className="flex gap-2.5 mb-6 max-w-[340px]">
          {/* 개인 비자 여정 / Personal visa journey */}
          <Link
            href="/worker/visa-journey"
            className="group flex-1 flex flex-col gap-1 bg-[#0066FF] hover:bg-[#0052CC] text-white px-3.5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(0,102,255,0.25)] hover:shadow-[0_6px_16px_rgba(0,102,255,0.3)] hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold">내 비자 여정</span>
              <ArrowRight size={12} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-white/80">판단부터 셀프 수속까지</span>
          </Link>

          {/* 공개 비자 가이드 — 로그인 전에도 확인 가능 */}
          <Link
            href="/guide"
            className="group flex-1 flex flex-col gap-1 bg-[#191F28] hover:bg-[#333D4B] text-white px-3.5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)] hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold">비자 가이드</span>
              <ArrowRight size={12} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-white/70">비자별 취업 조건 확인</span>
          </Link>
        </div>

        {/* 신뢰 정보 / Trust information */}
        <div className="flex flex-wrap gap-2 max-w-[460px]" aria-label="비자 여정 제공 범위">
          {journeyTrustPoints.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-lg bg-[#F2F4F6] px-2.5 py-1.5 text-[11px] font-medium text-[#4E5968]">
              <Icon size={13} className="text-[#0066FF]" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ 2열: 가이드 슬라이더 + 아이콘 3개 / Col 2: Guide slider + 3 icons ═══ */}
      <div className="flex flex-col gap-3">
        {/* 가이드 슬라이더 — API 연동 / Guide slider — API connected */}
        <FeaturedNoticeSlider />

        {/* 서비스 아이콘 3개 1줄 / 3 service icons in 1 row */}
        <div className="grid grid-cols-3 gap-1">
          {serviceIcons.map((svc) => (
            <Link
              key={svc.label}
              href={svc.href}
              onClick={(e) => handleScrollLink(e, svc.href)}
              className="group flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[#F9FAFB] hover:bg-[#F2F4F6] transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${svc.bg} flex items-center justify-center`}>
                <svc.icon size={14} className={svc.color} />
              </div>
              <span className="text-[10px] font-medium text-[#6B7684] group-hover:text-[#191F28] transition-colors">
                {svc.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ 3열: 공개 교육·생활 게시판 / Col 3: Public education + life board ═══ */}
      <HomeInfoBoard />

    </div>
  );
}
