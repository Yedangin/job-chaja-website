'use client';

// ──────────────────────────────────────────────────────
// [시안 ID]: g-009
// [시안 이름]: Indeed 심플 (Indeed Simple)
// [카테고리]: 프리미엄 (Premium)
// [레퍼런스]: Indeed
// [마우스오버]: 체크마크 표시(지원 완료 느낌) + 저장(북마크) 아이콘 활성화 + 그림자 확대
// [핵심]: 큰 제목(text-xl), 급여 강조(볼드 블루), 원클릭 지원 버튼(큰 CTA),
//         저장 버튼, 간결한 2단 레이아웃
// [이미지]: 없음
// [로고]: companyLogo <img> h-8
// ──────────────────────────────────────────────────────

import { useState } from 'react';
// 목데이터 임포트 / Mock data import
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getTimeAgo,
  getIndustryColor,
  getVisaColor,
} from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
// 아이콘 임포트 (lucide-react only) / Icon imports (lucide-react only)
import {
  MapPin,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Briefcase,
  Star,
  Eye,
  Flame,
  Crown,
} from 'lucide-react';

// ────────────────────────────────────────
// 개별 공고 카드 컴포넌트 / Individual job card component
// ────────────────────────────────────────
function JobCardG009({ job }: { job: MockJobPostingV2 }) {
  // 호버 상태 / Hover state
  const [isHovered, setIsHovered] = useState(false);
  // 저장(북마크) 상태 / Saved (bookmark) state
  const [isSaved, setIsSaved] = useState(false);
  // 지원 완료 상태 / Applied state
  const [isApplied, setIsApplied] = useState(false);

  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 비자 색상 / Visa colors
  const visaColors = job.allowedVisas.map((v) => ({ visa: v, ...getVisaColor(v) }));
  // 산업 색상 / Industry color
  const industryColor = getIndustryColor(job.industry);
  // 프리미엄 여부 / Whether premium
  const isPremium = job.tierType === 'PREMIUM';
  // D-day 긴급 여부 / Whether D-day is urgent
  const isDdayUrgent = dDay === 'D-Day' || (dDay !== null && dDay !== '상시모집' && dDay !== '마감' && parseInt(dDay.replace('D-', '')) <= 3);

  // 지원 버튼 클릭 핸들러 / Apply button click handler
  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsApplied(!isApplied);
  };

  // 저장 버튼 클릭 핸들러 / Save button click handler
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-white rounded-lg border overflow-hidden
        transition-all duration-300 ease-in-out cursor-pointer
        ${isHovered
          ? 'shadow-xl border-blue-200 -translate-y-1'
          : 'shadow-sm border-gray-200 hover:shadow-md'
        }
        ${isPremium ? 'ring-1 ring-blue-100' : ''}
      `}
    >
      {/* 프리미엄 상단 바 / Premium top bar */}
      {isPremium && (
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />
      )}

      {/* 카드 본문 / Card body */}
      <div className="p-5">
        {/* 상단: 로고 + 회사명 + 저장 버튼 / Top: Logo + Company name + Save button */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* 회사 로고 / Company logo */}
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="h-8 w-auto object-contain flex-shrink-0"
              onError={(e) => {
                // 로고 로드 실패 시 이니셜 표시 / Show initial on logo load failure
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'h-8 w-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0';
                  fallback.textContent = job.companyInitial;
                  parent.insertBefore(fallback, target);
                }
              }}
            />
            <div>
              <p className="text-sm text-gray-500 font-medium">{job.company}</p>
              {/* 배지 행 / Badge row */}
              <div className="flex items-center gap-1.5 mt-0.5">
                {isPremium && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600">
                    <Crown className="w-3 h-3" />
                    <span>프리미엄</span>
                  </span>
                )}
                {job.isUrgent && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-500">
                    <Flame className="w-3 h-3" />
                    <span>긴급</span>
                  </span>
                )}
                {job.isFeatured && (
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>추천</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 저장(북마크) 버튼 / Save (bookmark) button */}
          <button
            onClick={handleSave}
            className={`
              p-1.5 rounded-full transition-all duration-200
              ${isSaved
                ? 'text-blue-600 bg-blue-50'
                : isHovered
                  ? 'text-gray-400 bg-gray-50 hover:text-blue-500 hover:bg-blue-50'
                  : 'text-transparent'
              }
            `}
            aria-label={isSaved ? '저장 해제 / Unsave' : '저장하기 / Save'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* 공고 제목 (큰 제목) / Job title (large) */}
        <h3 className="text-xl font-bold text-gray-900 leading-snug mb-3 line-clamp-2">
          {job.title}
        </h3>

        {/* 2단 레이아웃: 좌측 정보 + 우측 급여 / Two-column: left info + right salary */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* 좌측: 위치, 시간, 지원자 / Left: location, time, applicants */}
          <div className="flex flex-col gap-1.5 text-sm text-gray-500 min-w-0">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span>{job.workHours || (job.boardType === 'FULL_TIME' ? '정규직' : '파트타임')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span>지원자 {job.applicantCount}명</span>
              <span className="text-gray-300">|</span>
              <Eye className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
              <span>{job.viewCount.toLocaleString()}</span>
            </div>
          </div>

          {/* 우측: 급여 강조 / Right: salary highlight */}
          <div className="flex-shrink-0 text-right">
            <p className="text-lg font-bold text-blue-600 whitespace-nowrap">
              {salary}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {job.boardType === 'FULL_TIME' ? '정규직 / Full-time' : '파트타임 / Part-time'}
            </p>
          </div>
        </div>

        {/* 비자 배지 + 산업 배지 / Visa badges + Industry badge */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {/* 산업 배지 / Industry badge */}
          <span className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
            ${industryColor.bg} ${industryColor.text}
          `}>
            <Briefcase className="w-3 h-3" />
            {job.industry}
          </span>
          {/* 비자 배지들 / Visa badges */}
          {visaColors.map(({ visa, bg, text }) => (
            <span
              key={visa}
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}
            >
              {visa}
            </span>
          ))}
        </div>

        {/* 복리후생 / Benefits */}
        {job.benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.benefits.slice(0, 4).map((benefit) => (
              <span
                key={benefit}
                className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 4 && (
              <span className="px-2 py-0.5 text-gray-400 text-xs">
                +{job.benefits.length - 4}
              </span>
            )}
          </div>
        )}

        {/* 하단 구분선 / Bottom divider */}
        <div className="border-t border-gray-100 pt-3">
          {/* 하단: D-day + 게시일 + 지원 버튼 / Bottom: D-day + posted date + apply button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {/* D-day 배지 / D-day badge */}
              {dDay && (
                <span className={`
                  px-2 py-0.5 rounded-full font-semibold
                  ${dDay === '마감'
                    ? 'bg-gray-100 text-gray-400'
                    : isDdayUrgent
                      ? 'bg-red-50 text-red-600'
                      : dDay === '상시모집'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-blue-50 text-blue-600'
                  }
                `}>
                  {dDay}
                </span>
              )}
              <span>{timeAgo}</span>
            </div>

            {/* 원클릭 지원 CTA 버튼 / One-click apply CTA button */}
            <button
              onClick={handleApply}
              className={`
                inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold
                transition-all duration-200 ease-in-out
                ${isApplied
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md'
                }
              `}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>지원완료</span>
                </>
              ) : (
                <span>바로 지원</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 호버 시 체크마크 오버레이 (지원 완료 상태) / Hover checkmark overlay (applied state) */}
      {isApplied && isHovered && (
        <div className="absolute top-3 right-12 animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-green-500 drop-shadow-sm" />
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────
// 페이지 컴포넌트 / Page component
// ────────────────────────────────────────
export default function IndeedSimplePage() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* 상단 시안 정보 / Top design info */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">
              g-009
            </span>
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold">
              프리미엄 / Premium
            </span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold">
              Indeed
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Indeed 심플 (Indeed Simple)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            큰 제목, 급여 강조, 원클릭 지원 CTA, 저장 버튼, 간결한 2단 레이아웃 &mdash;
            카드 위에 마우스를 올려보세요.
            {/* Large title, salary emphasis, one-click apply CTA, save button, clean two-column layout — hover over the cards. */}
          </p>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sampleJobsV2.map((job) => (
            <JobCardG009 key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
