'use client';

import React from 'react';
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
// 아이콘 임포트 / Icon imports (lucide-react only)
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Sparkles,
  Flame,
  Crown,
  Briefcase,
  CalendarDays,
} from 'lucide-react';

// ──────────────────────────────────────────────────────
// [시안 ID]: g-006
// [시안 이름]: 원티드 엘레강스 (Wanted Elegance)
// [카테고리]: 프리미엄
// [레퍼런스]: 원티드 (Wanted)
// [마우스오버]: 골드 보더 + 반짝임 shimmer 애니메이션 (@keyframes)
// [핵심]: 로고 대형(48px), 프리미엄 골드 배지, 산업 이미지 상단 배경,
//         그라데이션 오버레이
// ──────────────────────────────────────────────────────

/**
 * 원티드 엘레강스 스타일 채용공고 카드 컴포넌트
 * Wanted Elegance style job posting card component
 */
const JobCardG006: React.FC<{ job: MockJobPostingV2 }> = ({ job }) => {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 산업별 색상 / Industry color
  const industryColor = getIndustryColor(job.industry);

  // 프리미엄 여부 / Whether premium
  const isPremium = job.tierType === 'PREMIUM';

  // 비자 최대 표시 개수 / Max visas to display
  const MAX_VISAS = 3;
  const visibleVisas = job.allowedVisas.slice(0, MAX_VISAS);
  const hiddenVisaCount = job.allowedVisas.length - visibleVisas.length;

  // D-day 7일 이하 긴급 / D-day within 7 days is urgent
  const isDDayUrgent =
    dDay !== null &&
    dDay.startsWith('D-') &&
    parseInt(dDay.substring(2), 10) <= 7;

  return (
    <div
      className={`
        group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white
        shadow-md transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-amber-100/50
        ${isPremium ? 'ring-1 ring-amber-200/60' : 'ring-1 ring-gray-100'}
      `}
      style={{
        /* 호버 시 골드 보더로 전환 / Gold border on hover via CSS custom property */
      }}
    >
      {/* 호버 시 shimmer 오버레이 / Shimmer overlay on hover */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.08) 45%, rgba(255,215,0,0.15) 50%, rgba(255,215,0,0.08) 55%, transparent 60%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite linear',
        }}
      />

      {/* 산업 이미지 상단 배경 / Industry image top background */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={job.industryImage}
          alt={`${job.industry} industry`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* 그라데이션 오버레이 / Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* 프리미엄 골드 배지 (이미지 위) / Premium gold badge (over image) */}
        {isPremium && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 shadow-lg shadow-amber-200/50">
            <Crown size={12} className="text-white" />
            <span className="text-xs font-bold text-white">PREMIUM</span>
          </div>
        )}

        {/* 긴급 배지 / Urgent badge */}
        {job.isUrgent && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 shadow-lg">
            <Flame size={12} className="text-white" />
            <span className="text-xs font-bold text-white">긴급</span>
          </div>
        )}

        {/* 추천 배지 / Featured badge */}
        {job.isFeatured && !job.isUrgent && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-violet-500 px-2.5 py-1 shadow-lg">
            <Sparkles size={12} className="text-white" />
            <span className="text-xs font-bold text-white">추천</span>
          </div>
        )}

        {/* 이미지 하단: D-day + 산업 태그 / Bottom of image: D-day + industry tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold backdrop-blur-sm ${
              industryColor.bg
            } ${industryColor.text} bg-opacity-90`}
          >
            {job.industry}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-bold backdrop-blur-sm ${
              isDDayUrgent
                ? 'bg-red-500/90 text-white'
                : 'bg-white/90 text-gray-700'
            }`}
          >
            {dDay || '상시모집'}
          </span>
        </div>
      </div>

      {/* 카드 본문 / Card body */}
      <div className="flex flex-1 flex-col p-5">
        {/* 회사 정보: 대형 로고(48px) + 회사명 / Company info: large logo (48px) + name */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-800">
              {job.company}
            </p>
            <p className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={11} />
              {job.location}
            </p>
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className="mt-3.5 line-clamp-2 text-[15px] font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-amber-700">
          {job.title}
        </h3>

        {/* 급여 정보 / Salary info */}
        <div className="mt-3 flex items-center gap-2">
          <Briefcase size={14} className="shrink-0 text-amber-500" />
          <span
            className={`text-sm font-bold ${
              isPremium ? 'text-amber-600' : 'text-gray-700'
            }`}
          >
            {salary}
          </span>
        </div>

        {/* 근무조건 / Work conditions */}
        {(job.workHours || job.experienceRequired) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
            {job.workHours && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {job.workHours}
              </span>
            )}
            {job.experienceRequired && (
              <span className="flex items-center gap-1">
                <CalendarDays size={11} />
                경력 {job.experienceRequired}
              </span>
            )}
          </div>
        )}

        {/* 구분선 / Divider */}
        <div className="my-3 border-b border-gray-100" />

        {/* 비자 정보 / Visa information */}
        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            고용 가능 비자
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleVisas.map((visa) => {
              const { bg, text } = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${bg} ${text}`}
                >
                  {visa}
                </span>
              );
            })}
            {hiddenVisaCount > 0 && (
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                +{hiddenVisaCount}
              </span>
            )}
          </div>
        </div>

        {/* 복리후생 태그 / Benefits tags */}
        {job.benefits.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.benefits.slice(0, 3).map((benefit) => (
              <span
                key={benefit}
                className="rounded-full bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-500"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 3 && (
              <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-400">
                +{job.benefits.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 하단 메타 정보 / Bottom meta info */}
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users size={11} />
              지원 {job.applicantCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {job.viewCount.toLocaleString()}
            </span>
          </div>
          <span>{getTimeAgo(job.postedDate)}</span>
        </div>
      </div>

      {/* CTA 버튼 / CTA button */}
      <div className="px-5 pb-5">
        <button
          className={`w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 ${
            isPremium
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-200/40 hover:from-amber-600 hover:to-yellow-600 hover:shadow-lg hover:shadow-amber-200/60'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          지원하기
        </button>
      </div>

      {/* 호버 시 골드 보더 / Gold border on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-500 group-hover:border-amber-400/70" />
    </div>
  );
};

/**
 * G-006 원티드 엘레강스 디자인 페이지
 * G-006 Wanted Elegance design page
 */
export default function GeminiDesignG006Page() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-amber-50/30 p-4 md:p-8">
      {/* shimmer 키프레임 애니메이션 정의 / Shimmer keyframe animation definition */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `,
        }}
      />
      <div className="mx-auto max-w-7xl">
        {/* 시안 정보 헤더 / Design info header */}
        <div className="mb-8 rounded-2xl border border-amber-200/50 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shadow-amber-200/50">
              <Crown size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                [G-006] 원티드 엘레강스 (Wanted Elegance)
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                <span className="font-semibold text-gray-600">카테고리:</span>{' '}
                프리미엄 &middot;{' '}
                <span className="font-semibold text-gray-600">레퍼런스:</span>{' '}
                원티드 &middot;{' '}
                <span className="font-semibold text-gray-600">핵심:</span> 로고
                대형(48px), 골드 배지, 산업 이미지 배경, shimmer 호버
              </p>
            </div>
          </div>
        </div>

        {/* 카드 그리드 (반응형: 1열 -> 2열 -> 3열) / Card grid (responsive: 1 -> 2 -> 3 columns) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleJobsV2.map((job) => (
            <JobCardG006 key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
