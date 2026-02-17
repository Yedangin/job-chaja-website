'use client';

// 시안 06: 이미지 오버레이 카드 (에어비앤비/야놀자 스타일)
// Variant 06: Image Overlay Card (Airbnb/Yanolja Style)
// 상단에 업종별 그라데이션 플레이스홀더 (180px), 이미지 위에 오버레이 배지
// Top gradient placeholder by industry (180px), overlay badges on image
// PREMIUM 리본 좌상단, D-day 우상단, 하트 북마크 우상단
// PREMIUM ribbon top-left, D-day top-right, heart bookmark top-right

import { useState } from 'react';
import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import { MapPin, Heart, Star, Users, Eye } from 'lucide-react';

// 업종별 그라데이션 컬러 매핑 / Industry-based gradient color mapping
// IT = 블루, 제조 = 오렌지, 건설 = 앰버, 물류 = 인디고, 교육 = 에메랄드, 숙박/음식 = 로즈
// IT = blue, Manufacturing = orange, Construction = amber, Logistics = indigo, Education = emerald, Hospitality = rose
const INDUSTRY_GRADIENTS: Record<string, { from: string; to: string; icon: string }> = {
  'IT/소프트웨어': { from: 'from-blue-600', to: 'to-indigo-800', icon: '💻' },
  '제조': { from: 'from-orange-500', to: 'to-red-700', icon: '🏭' },
  '건설': { from: 'from-amber-500', to: 'to-orange-700', icon: '🏗️' },
  '물류/운송': { from: 'from-indigo-500', to: 'to-purple-800', icon: '📦' },
  '교육': { from: 'from-emerald-500', to: 'to-teal-700', icon: '📚' },
  '숙박/음식': { from: 'from-rose-500', to: 'to-pink-700', icon: '🍳' },
};

// 기본 그라데이션 (매핑에 없는 업종용) / Default gradient for unmapped industries
const DEFAULT_GRADIENT = { from: 'from-slate-500', to: 'to-slate-700', icon: '🏢' };

// 업종별 그라데이션 반환 / Get gradient by industry
function getIndustryGradient(industry: string) {
  return INDUSTRY_GRADIENTS[industry] || DEFAULT_GRADIENT;
}

// D-day 배지 스타일 결정 / D-day badge style
function getDDayBadgeStyle(dDay: string | null): string {
  if (!dDay || dDay === '상시모집') return 'bg-gray-800/80 text-gray-200';
  if (dDay === '마감') return 'bg-gray-800/80 text-gray-400';
  if (dDay === 'D-Day') return 'bg-red-600 text-white';
  // D-숫자 파싱 / Parse D-number
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 3) return 'bg-red-600 text-white';
  if (!isNaN(num) && num <= 7) return 'bg-orange-500 text-white';
  return 'bg-gray-800/80 text-gray-200';
}

// 개별 이미지 오버레이 카드 컴포넌트 / Individual image overlay card component
function ImageOverlayCard({ job }: { job: MockJobPosting }) {
  // 북마크(하트) 상태 / Bookmark (heart) state
  const [isBookmarked, setIsBookmarked] = useState(false);

  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 업종별 그라데이션 / Industry gradient
  const gradient = getIndustryGradient(job.industry);
  // PREMIUM 여부 / Is premium
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group border border-gray-100">
      {/* 상단 이미지 영역 — 업종별 그라데이션 플레이스홀더 (180px) */}
      {/* Top image area — industry-based gradient placeholder (180px) */}
      <div className={`relative h-[180px] bg-gradient-to-br ${gradient.from} ${gradient.to} overflow-hidden`}>
        {/* 그라데이션 위 장식 패턴 (비주얼 풍부하게) / Decorative pattern on gradient */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/20" />
          <div className="absolute bottom-6 right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute top-12 right-16 w-8 h-8 rounded-full bg-white/15" />
        </div>

        {/* 업종 아이콘 + 텍스트 (이미지 대체) / Industry icon + text (image substitute) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl mb-2">{gradient.icon}</span>
          <span className="text-white/60 text-xs font-medium tracking-wide">{job.industry}</span>
        </div>

        {/* 좌상단: PREMIUM 리본 / Top-left: PREMIUM ribbon */}
        {isPremium && (
          <div className="absolute top-0 left-0">
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 text-[10px] font-bold px-3 py-1 rounded-br-lg shadow-md">
              PREMIUM
            </div>
          </div>
        )}

        {/* 긴급 채용 배지 (PREMIUM 리본 아래) / Urgent badge (below PREMIUM ribbon) */}
        {job.isUrgent && (
          <div className={`absolute ${isPremium ? 'top-8' : 'top-0'} left-0`}>
            <div className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-br-lg shadow-md">
              긴급
            </div>
          </div>
        )}

        {/* 우상단: D-day 배지 / Top-right: D-day badge */}
        {dDay && (
          <div className="absolute top-2.5 right-12">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md ${getDDayBadgeStyle(dDay)}`}>
              {dDay}
            </span>
          </div>
        )}

        {/* 우상단 코너: 하트 북마크 버튼 / Top-right corner: Heart bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors duration-150"
          aria-label={isBookmarked ? '북마크 해제 / Remove bookmark' : '북마크 / Bookmark'}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-150 ${
              isBookmarked ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </button>

        {/* 하단 그라데이션 페이드 (콘텐츠와의 부드러운 전환) */}
        {/* Bottom gradient fade (smooth transition to content) */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* 하단 콘텐츠 영역 / Bottom content area */}
      <div className="p-4 flex flex-col gap-2.5">
        {/* 공고 제목 / Job title */}
        <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {job.title}
        </h3>

        {/* 회사명 행 + 별점 플레이스홀더 / Company row + star rating placeholder */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{job.company}</p>
          {/* 별점 플레이스홀더 (실제 데이터 없으므로 고정) / Star rating placeholder (fixed, no real data) */}
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs text-gray-500 font-medium">4.2</span>
          </div>
        </div>

        {/* 급여 — 굵게 강조 / Salary — bold emphasis */}
        <p className="text-base font-bold text-gray-900">{salary}</p>

        {/* 태그 행: 위치 칩 + 비자 칩 / Tags row: location chip + visa chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {/* 위치 칩 / Location chip */}
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
          {/* 비자 칩들 / Visa chips */}
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className="text-[11px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium"
            >
              {visa}
            </span>
          ))}
        </div>

        {/* 하단 메타 정보 / Bottom meta info */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
          <div className="flex items-center gap-3">
            {/* 지원자수 / Applicant count */}
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Users className="w-3 h-3" />
              지원 {job.applicantCount}
            </span>
            {/* 조회수 / View count */}
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Eye className="w-3 h-3" />
              {job.viewCount.toLocaleString()}
            </span>
          </div>
          {/* 게시 경과 시간 / Posted time ago */}
          <span className="text-[11px] text-gray-400">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant06Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-gray-900">
          시안 06: Image Overlay Card
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          에어비앤비/야놀자 스타일 — 이미지(그라데이션) + 오버레이 배지, 하트 북마크, 라운드 카드
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Airbnb/Yanolja style — Image (gradient) + overlay badges, heart bookmark, rounded cards
        </p>

        {/* 디자인 특징 요약 / Design feature summary */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: '이미지 / Image', value: '업종별 그라데이션 180px' },
            { label: '오버레이 / Overlay', value: 'PREMIUM 리본 + D-day 배지' },
            { label: '인터랙션 / Interaction', value: '하트 북마크 토글' },
            { label: '카드 스타일 / Card', value: 'rounded-xl + shadow hover' },
          ].map((feature) => (
            <span
              key={feature.label}
              className="text-[11px] px-2 py-1 rounded bg-white border border-gray-200 text-gray-500"
            >
              {feature.label}: <span className="text-gray-700">{feature.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      {/* 반응형: 모바일 1열, 태블릿 2열, 데스크탑 3열 */}
      {/* Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleJobs.map((job) => (
            <ImageOverlayCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
