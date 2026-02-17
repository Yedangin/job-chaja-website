'use client';

// 시안 05: 다크모드 카드 / Variant 05: Dark Mode Card
// 다크 테마 (bg-gray-900 페이지, bg-gray-800 카드), 네온 포인트 컬러
// Dark theme (bg-gray-900 page, bg-gray-800 cards), neon accent colors
// 급여는 cyan-400, 비자 배지별 다른 네온 컬러, PREMIUM은 골드 링 보더
// Salary in cyan-400, each visa badge a different neon color, PREMIUM gets gold ring border

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import { MapPin, Eye, Users, Clock, Zap } from 'lucide-react';

// 비자 배지별 네온 컬러 매핑 / Neon color mapping per visa badge
// 각 비자 유형에 고유한 네온 컬러를 부여하여 시각적 구분 극대화
// Assign unique neon colors to each visa type for maximum visual distinction
const VISA_NEON_COLORS: Record<string, string> = {
  'E-2': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'E-7-1': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'E-9': 'bg-green-500/20 text-green-400 border-green-500/30',
  'F-2': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'F-4': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'F-5': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'H-2': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

// 기본 네온 컬러 (매핑에 없는 비자용) / Default neon color for unmapped visas
const DEFAULT_NEON = 'bg-teal-500/20 text-teal-400 border-teal-500/30';

// 비자 배지의 네온 컬러 반환 / Get neon color for a visa badge
function getVisaNeonColor(visa: string): string {
  return VISA_NEON_COLORS[visa] || DEFAULT_NEON;
}

// D-day 색상 결정 (다크모드용) / D-day color for dark mode
function getDDayStyle(dDay: string | null): string {
  if (!dDay) return 'text-gray-500';
  if (dDay === '마감') return 'text-gray-600';
  if (dDay === 'D-Day') return 'text-red-500 animate-pulse';
  // D-숫자 파싱 / Parse D-number
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 3) return 'text-red-500';
  if (!isNaN(num) && num <= 7) return 'text-red-400';
  return 'text-gray-400';
}

// 개별 다크모드 채용카드 컴포넌트 / Individual dark mode job card component
function DarkJobCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);

  // PREMIUM 카드는 골드 링 보더, STANDARD는 gray-700 보더
  // PREMIUM cards get gold ring border, STANDARD gets gray-700 border
  const isPremium = job.tierType === 'PREMIUM';
  const cardBorder = isPremium
    ? 'border-amber-500/60 ring-1 ring-amber-500/30'
    : 'border-gray-700';

  return (
    <div
      className={`
        bg-gray-800 border rounded-lg p-5 flex flex-col gap-3
        ${cardBorder}
        hover:ring-1 hover:ring-cyan-500/50 hover:border-gray-600
        transition-all duration-200 cursor-pointer group
        relative overflow-hidden
      `}
    >
      {/* PREMIUM 골드 코너 라벨 / PREMIUM gold corner label */}
      {isPremium && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-l from-amber-500 to-amber-600 text-gray-900 text-[10px] font-bold px-3 py-0.5 rounded-bl-md">
            PREMIUM
          </div>
        </div>
      )}

      {/* 상단 행: 고용형태 + 긴급 배지 + D-day / Top row: employment type + urgent + D-day */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 고용형태 뱃지 / Employment type badge */}
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 border border-gray-600">
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
          {/* 긴급 채용 네온 배지 / Urgent hiring neon badge */}
          {job.isUrgent && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              급구
            </span>
          )}
        </div>
        {/* D-day 표시 / D-day display */}
        {dDay && (
          <span className={`text-xs font-semibold ${getDDayStyle(dDay)}`}>
            {dDay}
          </span>
        )}
      </div>

      {/* 공고 제목 — 흰색, 호버 시 시안 글로우 / Job title — white, cyan glow on hover */}
      <h3 className="text-[15px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors duration-200">
        {job.title}
      </h3>

      {/* 회사명 — gray-400 / Company name — gray-400 */}
      <p className="text-sm text-gray-400">{job.company}</p>

      {/* 급여 — 네온 시안 / Salary — neon cyan */}
      <p className="text-sm font-bold text-cyan-400">{salary}</p>

      {/* 위치 — 페이딩 아이콘 / Location — faded icon */}
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
        <span className="text-xs text-gray-400">{job.location}</span>
      </div>

      {/* 비자 배지 — 각각 다른 네온 컬러 / Visa badges — each a different neon color */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {job.allowedVisas.map((visa) => (
          <span
            key={visa}
            className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${getVisaNeonColor(visa)}`}
          >
            {visa}
          </span>
        ))}
      </div>

      {/* 하단 통계 행: 조회수 + 지원자수 + 경과시간 / Bottom stats: views + applicants + time ago */}
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-700/50">
        <div className="flex items-center gap-3">
          {/* 조회수 / View count */}
          <span className="flex items-center gap-1 text-[11px] text-gray-500">
            <Eye className="w-3 h-3" />
            {job.viewCount.toLocaleString()}
          </span>
          {/* 지원자수 / Applicant count */}
          <span className="flex items-center gap-1 text-[11px] text-gray-500">
            <Users className="w-3 h-3" />
            {job.applicantCount}
          </span>
        </div>
        {/* 게시 경과 시간 / Posted time ago */}
        <span className="flex items-center gap-1 text-[11px] text-gray-500">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </span>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant05Page() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-white">
          시안 05: Dark Mode Card
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          다크 테마 — 네온 포인트 컬러, 골드 프리미엄 링, 글로우 호버 효과
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Dark theme — Neon accent colors, gold premium ring, glow hover effects
        </p>

        {/* 디자인 특징 요약 / Design feature summary */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: '페이지 배경 / Page BG', value: 'gray-900' },
            { label: '카드 배경 / Card BG', value: 'gray-800' },
            { label: '급여 컬러 / Salary', value: 'cyan-400', colorClass: 'text-cyan-400' },
            { label: '프리미엄 / Premium', value: 'gold ring', colorClass: 'text-amber-500' },
            { label: '호버 / Hover', value: 'cyan glow', colorClass: 'text-cyan-300' },
          ].map((feature) => (
            <span
              key={feature.label}
              className="text-[11px] px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-400"
            >
              {feature.label}:{' '}
              <span className={feature.colorClass || 'text-gray-300'}>
                {feature.value}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      {/* 반응형: 모바일 1열, 태블릿 2열, 데스크탑 3열 */}
      {/* Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleJobs.map((job) => (
            <DarkJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
