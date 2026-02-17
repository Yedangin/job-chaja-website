'use client';

import React from 'react';
// 목데이터 임포트 / Mock data import
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getTimeAgo,
  getVisaColor,
} from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
// 아이콘 임포트 / Icon imports (lucide-react only)
import { MapPin, Sparkles, Flame } from 'lucide-react';

// ──────────────────────────────────────────────────────
// [시안 ID]: g-005
// [시안 이름]: 토스 클린 (Toss Clean)
// [카테고리]: 미니멀
// [레퍼런스]: 토스 (Toss)
// [마우스오버]: 스케일 업 (scale 1.02) + 그림자 확대
// [핵심]: 숫자(급여) 중심, 토스 블루(#0064FF), 깔끔한 구분선
// ──────────────────────────────────────────────────────

/**
 * 급여 포맷에서 숫자와 통화/기간 부분을 분리하는 헬퍼 함수
 * Helper function to separate numbers and currency/period from the salary format.
 * e.g., "연봉 2,800~3,500만원" -> { prefix: "연봉", amount: "2,800~3,500", suffix: "만원" }
 * e.g., "시급 12,500원" -> { prefix: "시급", amount: "12,500", suffix: "원" }
 */
const parseSalary = (
  formattedSalary: string,
): { prefix: string; amount: string; suffix: string } => {
  const parts = formattedSalary.split(' ');
  if (parts.length < 2) {
    return { prefix: '', amount: formattedSalary, suffix: '' };
  }

  // 접두사 추출 (예: "연봉", "시급") / Extract prefix (e.g., "연봉", "시급")
  const prefix = parts[0];

  // 첫 번째 숫자 위치 / Find first digit position
  const firstDigitIndex = formattedSalary.search(/\d/);
  // 마지막 숫자 위치 / Find last digit position
  const lastDigitIndex = formattedSalary.search(/\d(?=[^\d]*$)/);

  if (firstDigitIndex === -1 || lastDigitIndex === -1) {
    return { prefix: '', amount: formattedSalary, suffix: '' };
  }

  // 숫자 부분 추출 / Extract amount portion
  const amount = formattedSalary.substring(firstDigitIndex, lastDigitIndex + 1);
  // 접미사 추출 (예: "만원", "원") / Extract suffix (e.g., "만원", "원")
  const suffix = formattedSalary.substring(lastDigitIndex + 1).trim();

  return { prefix, amount, suffix };
};

/**
 * 토스 클린 스타일 채용공고 카드 컴포넌트
 * Toss Clean style job posting card component
 */
const JobCardG005: React.FC<{ job: MockJobPostingV2 }> = ({ job }) => {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 및 파싱 / Format and parse salary
  const formattedSalary = formatSalary(job);
  const {
    prefix: salaryPrefix,
    amount: salaryAmount,
    suffix: salarySuffix,
  } = parseSalary(formattedSalary);

  // 비자 최대 표시 개수 / Max visas to display before truncating
  const MAX_VISAS_DISPLAY = 3;
  const visibleVisas = job.allowedVisas.slice(0, MAX_VISAS_DISPLAY);
  const hiddenVisaCount = job.allowedVisas.length - visibleVisas.length;

  // D-day 7일 이하 긴급 표시 여부 / Whether D-day is within 7 days (urgent)
  const isDDayUrgent =
    dDay !== null &&
    dDay.startsWith('D-') &&
    parseInt(dDay.substring(2), 10) <= 7;

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
    >
      {/* 프리미엄 상단 그라디언트 바 / Premium top gradient bar */}
      {job.tierType === 'PREMIUM' && (
        <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-400 to-[#0064FF]" />
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* 상단: 로고 + 회사명 + 뱃지 / Top: Logo + company + badges */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {/* 회사 로고 (높이 24px) / Company logo (24px height) */}
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="h-6 w-auto object-contain"
            />
            <div>
              <p className="text-sm font-bold text-gray-800">{job.company}</p>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={11} />
                {job.location}
              </p>
            </div>
          </div>
          {/* 뱃지 영역 / Badge area */}
          <div className="flex items-center gap-1.5">
            {job.isUrgent && (
              <span className="flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-500">
                <Flame size={11} />
                긴급
              </span>
            )}
            {job.tierType === 'PREMIUM' && (
              <span className="flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#0064FF]">
                <Sparkles size={11} />
                프리미엄
              </span>
            )}
          </div>
        </div>

        {/* 급여 섹션 - 카드의 핵심 (가장 큰 텍스트) / Salary section - card focal point (largest text) */}
        <div className="mt-5 mb-4">
          <p className="text-sm font-medium text-gray-400 transition-all duration-300 group-hover:text-gray-500">
            {salaryPrefix}
          </p>
          <p className="text-3xl font-bold text-[#0064FF] transition-all duration-300 ease-in-out group-hover:text-4xl">
            {salaryAmount}
            <span className="ml-0.5 text-xl font-semibold text-[#0064FF]/70 transition-all duration-300 group-hover:text-2xl">
              {salarySuffix}
            </span>
          </p>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className="mb-3 text-base font-bold leading-snug text-gray-900">
          {job.title}
        </h3>

        {/* 구분선 / Divider */}
        <div className="border-b border-gray-100" />

        {/* 비자 정보 / Visa information */}
        <div className="mt-3 mb-4">
          <p className="mb-1.5 text-xs font-semibold text-gray-500">
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

        {/* 하단 메타 정보 / Bottom meta info */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-400">
          <span
            className={`font-bold ${isDDayUrgent ? 'text-red-500' : 'text-gray-500'}`}
          >
            {dDay || '상시모집'}
          </span>
          <span>{getTimeAgo(job.postedDate)} 등록</span>
        </div>
      </div>

      {/* CTA 버튼 (토스 블루, 풀너비) / CTA button (Toss blue, full width) */}
      <div className="px-5 pb-5">
        <button
          className="w-full rounded-xl bg-[#0064FF] py-3.5 text-base font-bold text-white transition-colors duration-200 hover:bg-[#0050CC] active:bg-[#003EA6]"
        >
          지원하기
        </button>
      </div>
    </div>
  );
};

/**
 * G-005 토스 클린 디자인 페이지
 * G-005 Toss Clean design page
 */
export default function GeminiDesignG005Page() {
  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* 시안 정보 헤더 / Design info header */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5">
          <h1 className="text-xl font-bold text-gray-900">
            [G-005] 토스 클린 (Toss Clean)
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            <span className="font-semibold text-gray-600">카테고리:</span> 미니멀 &middot;{' '}
            <span className="font-semibold text-gray-600">레퍼런스:</span> Toss &middot;{' '}
            <span className="font-semibold text-gray-600">핵심:</span> 숫자(급여) 중심 큰 표시, 토스 블루 포인트 컬러, 모바일 퍼스트
          </p>
        </div>

        {/* 카드 그리드 (반응형: 1열→2열→3열) / Card grid (responsive: 1→2→3 columns) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sampleJobsV2.map((job) => (
            <JobCardG005 key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
