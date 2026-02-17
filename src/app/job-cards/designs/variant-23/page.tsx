'use client';

// 시안 23: 그라디언트 보더 / 아웃라인 카드 / Variant 23: Gradient Border / Outline Card
// 카드가 그라디언트 테두리로 정의됨. 흰색 내부, 두꺼운 애니메이션 그라디언트 보더
// Cards defined by gradient borders. White interior, thick animated gradient borders
// PREMIUM 카드는 회전하는 그라디언트 보더 애니메이션 / PREMIUM cards get rotating gradient animation
// Apple 제품 페이지 스타일 클린 타이포그래피 / Apple product page style clean typography

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  ChevronRight,
  Crown,
  Zap,
  Star,
} from 'lucide-react';

// 업종별 그라디언트 매핑 / Industry-to-gradient mapping
const industryGradients: Record<string, { colors: string; direction: string }> = {
  '제조': { colors: 'from-blue-500 via-cyan-400 to-teal-500', direction: 'bg-gradient-to-r' },
  '숙박/음식': { colors: 'from-orange-400 via-rose-400 to-pink-500', direction: 'bg-gradient-to-br' },
  'IT/소프트웨어': { colors: 'from-violet-500 via-purple-500 to-indigo-500', direction: 'bg-gradient-to-bl' },
  '건설': { colors: 'from-amber-500 via-yellow-500 to-orange-400', direction: 'bg-gradient-to-tr' },
  '물류/운송': { colors: 'from-emerald-400 via-green-500 to-teal-500', direction: 'bg-gradient-to-l' },
  '교육': { colors: 'from-pink-400 via-fuchsia-500 to-purple-500', direction: 'bg-gradient-to-tl' },
};

// 기본 그라디언트 / Default gradient fallback
const defaultGradient = { colors: 'from-gray-400 via-gray-500 to-gray-600', direction: 'bg-gradient-to-r' };

// 그라디언트 정보 가져오기 / Get gradient info for industry
function getGradient(industry: string): { colors: string; direction: string } {
  return industryGradients[industry] || defaultGradient;
}

// D-day 스타일 결정 / Determine D-day styling
function getDDayStyle(dDay: string | null): string {
  if (!dDay || dDay === '상시모집') return 'text-gray-400';
  if (dDay === '마감') return 'text-gray-400 line-through';
  if (dDay === 'D-Day') return 'text-red-500 font-semibold';
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 7) return 'text-red-500 font-medium';
  return 'text-gray-500';
}

// 개별 채용공고 카드 컴포넌트 / Individual job card component
function GradientBorderCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 업종 그라디언트 / Industry gradient
  const gradient = getGradient(job.industry);
  // 프리미엄 여부 / Is premium
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div className="group relative">
      {/* 그라디언트 보더 배경 레이어 / Gradient border background layer */}
      <div
        className={`
          absolute inset-0 rounded-2xl p-[2.5px]
          ${gradient.direction} ${gradient.colors}
          ${isPremium ? 'animate-gradient-rotate' : ''}
        `}
      >
        {/* 내부 흰색 영역 (보더 안쪽) / Inner white area (inside border) */}
        <div className="absolute inset-[2.5px] rounded-[13.5px] bg-white transition-opacity duration-500 group-hover:opacity-[0.92]" />
      </div>

      {/* 카드 콘텐츠 / Card content */}
      <div className="relative z-10 p-6 flex flex-col gap-5 min-h-[280px]">
        {/* 상단 행: 배지들 / Top row: badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 고용형태 배지 / Employment type badge */}
            <span className={`
              text-[11px] tracking-wider uppercase font-medium px-2.5 py-1 rounded-full
              ${job.boardType === 'FULL_TIME'
                ? 'bg-gray-100 text-gray-600'
                : 'bg-gray-50 text-gray-500'}
            `}>
              {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
            </span>

            {/* 프리미엄 배지 / Premium badge */}
            {isPremium && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-600 border border-amber-200/50">
                <Crown className="w-3 h-3" />
                PREMIUM
              </span>
            )}

            {/* 긴급 배지 / Urgent badge */}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-500">
                <Zap className="w-3 h-3" />
                급구
              </span>
            )}
          </div>

          {/* D-day 표시 / D-day display */}
          <span className={`text-xs font-mono ${getDDayStyle(dDay)}`}>
            {dDay}
          </span>
        </div>

        {/* 메인 콘텐츠: 제목 + 회사 / Main content: title + company */}
        <div className="flex-1 flex flex-col gap-2">
          {/* 공고 제목 / Job title */}
          <h3 className="text-[17px] font-semibold text-gray-900 leading-snug tracking-tight line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {job.title}
          </h3>

          {/* 회사명 / Company name */}
          <p className="text-sm text-gray-500 font-medium">
            {job.company}
          </p>

          {/* 위치 + 근무시간 / Location + work hours */}
          <div className="flex items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            {job.workHours && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                {job.workHours}
              </span>
            )}
          </div>
        </div>

        {/* 급여 / Salary */}
        <div className={`
          text-base font-bold tracking-tight
          bg-clip-text text-transparent
          ${gradient.direction} ${gradient.colors}
        `}>
          {salary}
        </div>

        {/* 비자 태그 / Visa tags */}
        <div className="flex flex-wrap gap-1.5">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100"
            >
              {visa}
            </span>
          ))}
        </div>

        {/* 하단 행: 통계 + 화살표 / Bottom row: stats + arrow */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100/80">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {job.applicantCount}명 지원
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {job.viewCount.toLocaleString()}
            </span>
            <span>{timeAgo}</span>
          </div>

          {/* 화살표 아이콘 / Arrow icon */}
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
}

// 추천 배지 카드 / Featured badge card
function FeaturedIndicator() {
  return (
    <div className="absolute -top-2.5 left-6 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold shadow-lg shadow-amber-200/40">
      <Star className="w-3 h-3 fill-current" />
      추천
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function Variant23Page() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 커스텀 키프레임 스타일 / Custom keyframe styles */}
      <style>{`
        @keyframes gradient-rotate {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(30deg); }
          100% { filter: hue-rotate(0deg); }
        }
        .animate-gradient-rotate {
          animation: gradient-rotate 4s ease-in-out infinite;
        }
      `}</style>

      {/* 페이지 헤더 / Page header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            채용공고
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-medium">
            Gradient Border / Outline Card
          </p>
        </div>

        {/* 업종 범례 / Industry legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {Object.entries(industryGradients).map(([industry, grad]) => (
            <div key={industry} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${grad.direction} ${grad.colors}`} />
              <span className="text-xs text-gray-400">{industry}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobs.map((job) => (
            <div key={job.id} className="relative">
              {/* 추천 배지 / Featured badge */}
              {job.isFeatured && <FeaturedIndicator />}
              <GradientBorderCard job={job} />
            </div>
          ))}
        </div>
      </div>

      {/* 디자인 설명 영역 / Design description area */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight mb-4">
            디자인 특징 / Design Features
          </h2>
          <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
              업종별 고유 그라디언트 방향 + 컬러 조합 / Unique gradient direction + color combo per industry
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
              PREMIUM 카드: hue-rotate 애니메이션으로 테두리 반짝임 / PREMIUM: shimmer via hue-rotate animation
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
              호버 시 그라디언트가 내부로 스며듦 (opacity 변화) / Hover: gradient bleeds inward via opacity change
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
              급여가 업종 그라디언트 색상으로 표시 / Salary shown in industry gradient colors
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
              Apple 제품 페이지 영감: 넉넉한 여백 + 클린 타이포 / Apple-inspired: breathing room + clean type
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
