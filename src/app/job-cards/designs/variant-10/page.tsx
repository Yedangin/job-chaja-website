'use client';

// 시안 10: 초밀집 리스트 아이템 (인크루트 스타일) / Variant 10: Compact List Item (Incruit Style)
// 테이블처럼 생긴 단일 행 리스트, 줄무늬 배경, 데이터 밀도 극대화
// Table-like single-row list, alternating backgrounds, maximum data density

import { sampleJobs, getDDay, formatSalary } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import { Crown, Clock, ChevronRight } from 'lucide-react';

// D-day 텍스트 스타일 결정 / Determine D-day text style
function getDDayStyle(dDay: string | null): string {
  if (!dDay) return 'text-gray-400';
  if (dDay === '마감') return 'text-gray-400 line-through';
  if (dDay === '상시모집') return 'text-emerald-600 font-semibold';
  if (dDay === 'D-Day') return 'text-red-600 font-bold';
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 3) return 'text-red-600 font-bold';
  if (!isNaN(num) && num <= 7) return 'text-orange-600 font-semibold';
  return 'text-blue-600 font-semibold';
}

// 급여 짧은 포맷 (리스트용, 줄여서 표시) / Short salary format for list view
function formatSalaryShort(job: MockJobPosting): string {
  if (job.hourlyWage) return `${job.hourlyWage.toLocaleString()}원/시`;
  if (job.salaryMin && job.salaryMax) {
    const min = Math.round(job.salaryMin / 10000);
    const max = Math.round(job.salaryMax / 10000);
    return `${min}~${max}만원`;
  }
  return '협의';
}

// 개별 리스트 아이템 컴포넌트 / Individual list item component
function CompactListItem({
  job,
  index,
}: {
  job: MockJobPosting;
  index: number;
}) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 (짧은 버전) / Short salary format
  const salaryShort = formatSalaryShort(job);
  // 전체 급여 (툴팁용) / Full salary (for tooltip)
  const salaryFull = formatSalary(job);
  // D-day 스타일 / D-day style
  const dDayStyle = getDDayStyle(dDay);
  // 프리미엄 여부 / Premium check
  const isPremium = job.tierType === 'PREMIUM';
  // 짝수/홀수 행 배경 / Alternating row background
  const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  // 마감 여부 / Closed check
  const isClosed = dDay === '마감';

  return (
    <div
      className={`
        ${rowBg} ${isClosed ? 'opacity-50' : ''}
        border-b border-gray-100 hover:bg-blue-50/40 transition-colors duration-100
        group cursor-pointer
      `}
    >
      {/* 데스크탑 레이아웃 (md 이상) / Desktop layout (md+) */}
      <div className="hidden md:flex items-center px-4 py-3 gap-3">
        {/* 프리미엄 배지 열 / Premium badge column */}
        <div className="w-[72px] flex-shrink-0 flex justify-center">
          {isPremium ? (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">
              <Crown className="w-3 h-3" />
              AD
            </span>
          ) : (
            <span className="text-[10px] text-gray-300">일반</span>
          )}
        </div>

        {/* 공고 제목 열 (가변폭) / Title column (flexible) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* 긴급 배지 / Urgent badge */}
            {job.isUrgent && (
              <span className="flex-shrink-0 text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                급구
              </span>
            )}
            {/* 고용형태 / Employment type */}
            <span className="flex-shrink-0 text-[10px] text-gray-400 border border-gray-200 rounded px-1 py-0.5">
              {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
            </span>
            {/* 제목 (말줄임) / Title (truncated) */}
            <span className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
              {job.title}
            </span>
          </div>
        </div>

        {/* 회사명 열 / Company column */}
        <div className="w-[130px] flex-shrink-0 truncate">
          <span className="text-sm text-gray-500 truncate">{job.company}</span>
        </div>

        {/* 지역 열 / Location column */}
        <div className="w-[90px] flex-shrink-0">
          <span className="text-xs text-gray-400 truncate block">{job.location}</span>
        </div>

        {/* 급여 열 / Salary column */}
        <div className="w-[110px] flex-shrink-0 text-right" title={salaryFull}>
          <span className="text-sm font-bold text-blue-600">{salaryShort}</span>
        </div>

        {/* 비자 배지 열 / Visa pills column */}
        <div className="w-[140px] flex-shrink-0 flex flex-wrap gap-0.5 justify-center">
          {job.allowedVisas.slice(0, 3).map((visa) => (
            <span
              key={visa}
              className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded font-medium"
            >
              {visa}
            </span>
          ))}
          {job.allowedVisas.length > 3 && (
            <span className="text-[10px] px-1 py-0.5 text-gray-400 font-medium">
              +{job.allowedVisas.length - 3}
            </span>
          )}
        </div>

        {/* D-day 열 / D-day column */}
        <div className="w-[70px] flex-shrink-0 text-center">
          <span className={`text-sm ${dDayStyle}`}>{dDay}</span>
        </div>

        {/* 화살표 (호버) / Arrow (hover) */}
        <div className="w-[20px] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* 모바일 레이아웃 (md 미만) / Mobile layout (below md) */}
      <div className="md:hidden px-4 py-3">
        {/* 첫째 줄: 배지 + 제목 / First row: badges + title */}
        <div className="flex items-center gap-2 mb-1.5">
          {isPremium && (
            <span className="flex-shrink-0 inline-flex items-center gap-0.5 bg-amber-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
              <Crown className="w-2.5 h-2.5" />
              AD
            </span>
          )}
          {job.isUrgent && (
            <span className="flex-shrink-0 text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
              급구
            </span>
          )}
          <span className="text-sm font-semibold text-gray-900 truncate">
            {job.title}
          </span>
        </div>

        {/* 둘째 줄: 회사 + 지역 + 급여 / Second row: company + location + salary */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
          <span className="truncate">{job.company}</span>
          <span className="text-gray-300">|</span>
          <span className="truncate">{job.location}</span>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-blue-600 flex-shrink-0">{salaryShort}</span>
        </div>

        {/* 셋째 줄: 비자 + D-day / Third row: visas + D-day */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {job.allowedVisas.slice(0, 3).map((visa) => (
              <span
                key={visa}
                className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded font-medium"
              >
                {visa}
              </span>
            ))}
            {job.allowedVisas.length > 3 && (
              <span className="text-[10px] text-gray-400">+{job.allowedVisas.length - 3}</span>
            )}
          </div>
          <span className={`text-xs ${dDayStyle}`}>{dDay}</span>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant10Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-gray-900">
          시안 10: Compact List Item
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          인크루트 스타일 — 테이블형 초밀집 리스트, 줄무늬 배경, 데이터 밀도 극대화
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Incruit-inspired — Table-like ultra-compact list, alternating rows, maximum data density
        </p>
      </div>

      {/* 리스트 컨테이너 / List container */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* 요약 바 / Summary bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                전체 <span className="text-blue-600">{sampleJobs.length}</span>건
              </span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                최신순
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              데이터 밀도 뷰 / Data-dense view
            </span>
          </div>

          {/* 테이블 헤더 (데스크탑) / Table header (desktop) */}
          <div className="hidden md:flex items-center px-4 py-2 bg-gray-100 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider gap-3">
            <div className="w-[72px] flex-shrink-0 text-center">구분</div>
            <div className="flex-1 min-w-0">공고명 / Title</div>
            <div className="w-[130px] flex-shrink-0">기업명 / Company</div>
            <div className="w-[90px] flex-shrink-0">지역 / Location</div>
            <div className="w-[110px] flex-shrink-0 text-right">급여 / Salary</div>
            <div className="w-[140px] flex-shrink-0 text-center">비자 / Visa</div>
            <div className="w-[70px] flex-shrink-0 text-center">마감 / D-day</div>
            <div className="w-[20px] flex-shrink-0" />
          </div>

          {/* 공고 리스트 아이템들 / Job list items */}
          {sampleJobs.map((job, index) => (
            <CompactListItem key={job.id} job={job} index={index} />
          ))}

          {/* 하단 페이지네이션 힌트 / Bottom pagination hint */}
          <div className="flex items-center justify-center py-3 bg-gray-50 border-t border-gray-200">
            <span className="text-xs text-gray-400">
              1 / 1 페이지 &middot; {sampleJobs.length}개 공고
            </span>
          </div>
        </div>

        {/* 범례 / Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 bg-amber-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
              <Crown className="w-2.5 h-2.5" />
              AD
            </span>
            <span>프리미엄 공고 / Premium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">급구</span>
            <span>긴급 채용 / Urgent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-red-600 font-bold text-[11px]">D-3</span>
            <span>마감 임박 / Closing soon</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold text-[11px]">상시모집</span>
            <span>항시 접수 / Always open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
