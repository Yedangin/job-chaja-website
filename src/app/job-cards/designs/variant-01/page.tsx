'use client';

// 시안 01: 미니멀 클린 (사람인 스타일) / Variant 01: Minimal Clean (Saramin Style)
// 극도로 깔끔한 흰색 카드, 얇은 테두리, 그림자 없음
// Ultra-minimal white cards, thin borders, no shadows

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import { MapPin } from 'lucide-react';

// 개별 채용공고 카드 컴포넌트 / Individual job card component
function MinimalJobCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);

  // D-day 텍스트 색상 결정 / Determine D-day text color
  const getDDayColor = (dDay: string | null): string => {
    if (!dDay) return 'text-gray-400';
    if (dDay === '마감') return 'text-gray-400';
    if (dDay === 'D-Day') return 'text-red-500';
    // D-숫자 파싱 / Parse D-number
    const num = parseInt(dDay.replace('D-', ''), 10);
    if (!isNaN(num) && num <= 7) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5 flex flex-col gap-3 hover:border-gray-300 transition-colors duration-150">
      {/* 상단: 고용형태 + D-day / Top: employment type + D-day */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 tracking-wide">
          {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          {job.isUrgent && (
            <span className="ml-2 text-red-500 font-medium">급구</span>
          )}
        </span>
        {dDay && (
          <span className={`text-xs font-medium ${getDDayColor(dDay)}`}>
            {dDay}
          </span>
        )}
      </div>

      {/* 공고 제목 / Job title */}
      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
        {job.title}
      </h3>

      {/* 회사명 / Company name */}
      <p className="text-sm text-gray-500">{job.company}</p>

      {/* 급여 / Salary */}
      <p className="text-sm font-medium text-blue-600">{salary}</p>

      {/* 하단 정보: 위치 + 비자 / Bottom info: location + visas */}
      <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-gray-100">
        {/* 위치 / Location */}
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">{job.location}</span>
        </div>

        {/* 비자 배지 / Visa badges */}
        <div className="flex flex-wrap gap-1">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className="text-[11px] px-1.5 py-0.5 bg-gray-50 text-gray-500 border border-gray-150 rounded-sm"
            >
              {visa}
            </span>
          ))}
        </div>
      </div>

      {/* 최하단 메타 / Bottom meta */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
        <span>{timeAgo}</span>
        <span>조회 {job.viewCount.toLocaleString()}</span>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant01Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-gray-900">시안 01: Minimal Clean</h1>
        <p className="text-sm text-gray-500 mt-1">
          사람인 스타일 — 극도로 깔끔한 흰색 카드, 콘텐츠 중심 디자인
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Saramin-inspired — Ultra-clean white cards, content-first approach
        </p>
      </div>

      {/* 카드 그리드 / Card grid */}
      {/* 반응형: 모바일 1열, 태블릿 2열, 데스크탑 3열 */}
      {/* Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sampleJobs.map((job) => (
            <MinimalJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
