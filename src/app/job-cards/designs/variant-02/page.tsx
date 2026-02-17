'use client';

// 시안 02: 프리미엄 그라데이션 헤더 (잡코리아 프리미엄 스타일)
// Variant 02: Premium Gradient Header (JobKorea Premium Style)
// 상단 그라데이션 바, 프리미엄 배지, 호버 시 그림자 상승 효과
// Gradient header bar, premium badge, hover lift with shadow effect

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Building2,
  TrendingUp,
  Bookmark,
} from 'lucide-react';

// 개별 채용공고 카드 컴포넌트 / Individual job card component
function PremiumJobCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 프리미엄 여부 / Is premium
  const isPremium = job.tierType === 'PREMIUM';

  // 그라데이션 클래스 결정 / Determine gradient classes
  // 프리미엄: 앰버→오렌지, 스탠다드: 회색 / Premium: amber-to-orange, Standard: gray
  const headerGradient = isPremium
    ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500'
    : 'bg-gradient-to-r from-gray-300 to-gray-400';

  // D-day 색상 / D-day colors
  const getDDayStyle = (dDay: string | null): string => {
    if (!dDay || dDay === '상시모집') return 'bg-white/30 text-white';
    if (dDay === '마감') return 'bg-black/20 text-white/70';
    if (dDay === 'D-Day') return 'bg-red-600 text-white';
    const num = parseInt(dDay.replace('D-', ''), 10);
    if (!isNaN(num) && num <= 3) return 'bg-red-600 text-white';
    if (!isNaN(num) && num <= 7) return 'bg-orange-600 text-white';
    return 'bg-white/30 text-white';
  };

  // 비자 배지 색상 매핑 / Visa badge color mapping
  const getVisaBadgeColor = (visa: string): string => {
    // E 계열 취업비자 / E-series work visas
    if (visa.startsWith('E-7')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (visa.startsWith('E-9')) return 'bg-teal-100 text-teal-700 border-teal-200';
    if (visa.startsWith('E-2')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (visa.startsWith('E-')) return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    // F 계열 거주비자 / F-series residence visas
    if (visa.startsWith('F-5')) return 'bg-green-100 text-green-700 border-green-200';
    if (visa.startsWith('F-4')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (visa.startsWith('F-2')) return 'bg-lime-100 text-lime-700 border-lime-200';
    if (visa.startsWith('F-')) return 'bg-green-100 text-green-600 border-green-200';
    // H 계열 방문취업 / H-series working visit
    if (visa.startsWith('H-')) return 'bg-amber-100 text-amber-700 border-amber-200';
    // 기본 / Default
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col group">
      {/* 그라데이션 헤더 바 / Gradient header bar */}
      <div className={`${headerGradient} px-4 py-3 flex items-center justify-between relative`}>
        {/* 좌측: 배지 + D-day / Left: badge + D-day */}
        <div className="flex items-center gap-2">
          {/* 프리미엄/스탠다드 배지 / Premium/Standard badge */}
          {isPremium ? (
            <span className="text-[11px] font-bold px-2 py-0.5 bg-white/90 text-amber-700 rounded-full tracking-wide shadow-sm">
              PREMIUM
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 bg-white/50 text-gray-600 rounded-full">
              STANDARD
            </span>
          )}

          {/* 긴급 배지 / Urgent badge */}
          {job.isUrgent && (
            <span className="text-[11px] font-bold px-2 py-0.5 bg-red-600 text-white rounded-full animate-pulse">
              급구
            </span>
          )}
        </div>

        {/* 우측: D-day / Right: D-day */}
        {dDay && (
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getDDayStyle(dDay)}`}>
            {dDay}
          </span>
        )}

        {/* 회사 로고 플레이스홀더 (우상단 겹침) / Company logo placeholder (top-right overlap) */}
        <div className="absolute -bottom-5 right-4 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
          <Building2 className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* 카드 본문 / Card body */}
      <div className="px-4 pt-5 pb-4 flex flex-col gap-2.5 flex-1">
        {/* 공고 제목 / Job title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 pr-8 group-hover:text-amber-700 transition-colors">
          {job.title}
        </h3>

        {/* 회사명 + 빌딩 아이콘 / Company name + building icon */}
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600">{job.company}</span>
        </div>

        {/* 위치 / Location */}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-500">{job.location}</span>
        </div>

        {/* 급여 + 차트 아이콘 / Salary + chart icon */}
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-blue-600">{salary}</span>
        </div>

        {/* 고용형태 + 경력 / Employment type + experience */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
          {job.experienceRequired && (
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
              {job.experienceRequired}
            </span>
          )}
        </div>

        {/* 비자 배지 / Visa badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-gray-100">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${getVisaBadgeColor(visa)}`}
            >
              {visa}
            </span>
          ))}
        </div>
      </div>

      {/* 카드 푸터 / Card footer */}
      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center gap-3">
          <span>지원 {job.applicantCount}명</span>
          <span>조회 {job.viewCount.toLocaleString()}</span>
        </div>
        {/* 북마크 아이콘 / Bookmark icon */}
        <button
          className="p-1 hover:text-amber-500 transition-colors"
          aria-label="북마크"
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant02Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-gray-900">시안 02: Premium Gradient Header</h1>
        <p className="text-sm text-gray-500 mt-1">
          잡코리아 프리미엄 스타일 — 그라데이션 헤더, 프리미엄 배지, 호버 리프트 효과
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          JobKorea Premium-inspired — Gradient header bar, tier badges, hover lift with shadow
        </p>
      </div>

      {/* 카드 그리드 / Card grid */}
      {/* 반응형: 모바일 1열, 태블릿 2열, 데스크탑 3열 */}
      {/* Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleJobs.map((job) => (
            <PremiumJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
