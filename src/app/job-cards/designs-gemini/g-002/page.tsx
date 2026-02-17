'use client';

// g-002: 잡코리아 라인 (JobKorea Line) - 미니멀 라인형 카드 디자인
// g-002: JobKorea Line - Minimal line-style card design

import React from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getTimeAgo,
  getIndustryColor,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  MapPin,
  Clock,
  Wallet,
  Users,
  Eye,
  Flame,
  Star,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

// 산업별 좌측 바 solid 색상 매핑 / Industry solid color mapping for left bar
function getIndustryBarColor(industry: string): string {
  const map: Record<string, string> = {
    '제조': 'bg-blue-500',
    '숙박/음식': 'bg-orange-500',
    'IT/소프트웨어': 'bg-violet-500',
    '건설': 'bg-amber-500',
    '물류/운송': 'bg-teal-500',
    '교육': 'bg-rose-500',
  };
  return map[industry] || 'bg-gray-500';
}

// 시안 정보 헤더 컴포넌트 / Design info header component
function DesignInfoHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="px-2.5 py-1 text-xs font-bold bg-gray-900 text-white rounded">
          g-002
        </span>
        <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
          미니멀
        </span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        잡코리아 라인 (JobKorea Line)
      </h1>
      <p className="text-sm text-gray-500">
        레퍼런스: 잡코리아 | 라인형 카드, 좌측 산업 컬러 바, 한줄 요약 구조, 깔끔한 세퍼레이터
      </p>
      <p className="text-sm text-gray-400 mt-1">
        마우스오버: 좌측 컬러 보더 3px → 6px 확장 + 배경 변경
      </p>
    </div>
  );
}

// 개별 채용공고 카드 컴포넌트 / Individual job card component
function JobCard({ job }: { job: MockJobPostingV2 }) {
  const industryColor = getIndustryColor(job.industry);
  const barColor = getIndustryBarColor(job.industry);
  const dDay = getDDay(job.closingDate);

  // D-day 긴급도 판단 / Determine D-day urgency
  const isDDayUrgent =
    dDay === 'D-Day' ||
    dDay === '마감' ||
    (dDay !== null && dDay.startsWith('D-') && parseInt(dDay.substring(2), 10) <= 7);

  return (
    <div className="group relative flex bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-slate-50/60 hover:border-gray-300 cursor-pointer">
      {/* 좌측 산업 컬러 바 / Left industry color bar */}
      <div
        className={`${barColor} w-[3px] shrink-0 transition-all duration-300 ease-in-out group-hover:w-1.5`}
      />

      {/* 카드 본문 / Card body */}
      <div className="flex-1 p-4 min-w-0">
        {/* 상단: 배지 영역 / Top: Badge area */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 프리미엄 배지 / Premium badge */}
            {job.tierType === 'PREMIUM' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded">
                <Star size={10} className="fill-amber-500 text-amber-500" />
                프리미엄
              </span>
            )}
            {/* 긴급 배지 / Urgent badge */}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-red-50 text-red-600 border border-red-200 rounded">
                <Flame size={10} />
                긴급
              </span>
            )}
            {/* 산업 분류 배지 / Industry badge */}
            <span
              className={`px-2 py-0.5 text-[11px] font-medium rounded ${industryColor.bg} ${industryColor.text}`}
            >
              {job.industry}
            </span>
            {/* 고용형태 배지 / Employment type badge */}
            <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-gray-100 text-gray-600">
              {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
            </span>
          </div>

          {/* D-day 표시 / D-day display */}
          {dDay && (
            <span
              className={`shrink-0 ml-2 px-2 py-0.5 text-[11px] font-bold rounded ${
                isDDayUrgent
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {dDay}
            </span>
          )}
        </div>

        {/* 중단: 회사 + 제목 / Middle: Company + Title */}
        <div className="flex items-center gap-2.5 mb-2.5">
          {/* 회사 로고 / Company logo */}
          <img
            src={job.companyLogo}
            alt={`${job.company} logo`}
            className="h-7 w-auto object-contain shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">{job.company}</p>
            <h3 className="text-[15px] font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-blue-700 transition-colors duration-200">
              {job.title}
            </h3>
          </div>
        </div>

        {/* 핵심 정보 한줄 요약 (세퍼레이터 구분) / Key info one-line summary with separators */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-gray-600 mb-3">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} className="text-gray-400" />
            {job.location}
          </span>
          <span className="text-gray-300">|</span>
          <span className="inline-flex items-center gap-1">
            <Wallet size={13} className="text-gray-400" />
            {formatSalary(job)}
          </span>
          {job.experienceRequired && (
            <>
              <span className="text-gray-300">|</span>
              <span className="inline-flex items-center gap-1">
                <Briefcase size={13} className="text-gray-400" />
                {job.experienceRequired}
              </span>
            </>
          )}
          {job.workHours && (
            <>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <span className="hidden sm:inline-flex items-center gap-1">
                <Clock size={13} className="text-gray-400" />
                {job.workHours}
              </span>
            </>
          )}
        </div>

        {/* 하단: 비자 + 메타 정보 (세퍼레이터) / Bottom: Visa + meta info with separator */}
        <div className="pt-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          {/* 허용 비자 목록 / Allowed visa list */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {job.allowedVisas.slice(0, 4).map((visa) => {
              const vc = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${vc.bg} ${vc.text}`}
                >
                  {visa}
                </span>
              );
            })}
            {job.allowedVisas.length > 4 && (
              <span className="text-[10px] text-gray-400 font-medium">
                +{job.allowedVisas.length - 4}
              </span>
            )}
          </div>

          {/* 지원자 수, 조회수, 등록일 / Applicants, views, posted date */}
          <div className="flex items-center gap-2.5 text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Users size={11} />
              {job.applicantCount}
            </span>
            <span className="text-gray-200">|</span>
            <span className="inline-flex items-center gap-1">
              <Eye size={11} />
              {job.viewCount.toLocaleString()}
            </span>
            <span className="text-gray-200">|</span>
            <span>{getTimeAgo(job.postedDate)}</span>
          </div>
        </div>
      </div>

      {/* 호버 시 화살표 아이콘 / Arrow icon on hover */}
      <div className="hidden group-hover:flex items-center pr-3 text-gray-300 transition-opacity duration-200">
        <ChevronRight size={18} />
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G002JobKoreaLinePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:px-8">
        {/* 시안 정보 헤더 / Design info header */}
        <DesignInfoHeader />

        {/* 공고 카드 그리드 / Job card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* 하단 범례 / Bottom legend */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            산업별 좌측 컬러 바 범례 / Industry Color Bar Legend
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: '제조', color: 'bg-blue-500' },
              { label: '숙박/음식', color: 'bg-orange-500' },
              { label: 'IT/소프트웨어', color: 'bg-violet-500' },
              { label: '건설', color: 'bg-amber-500' },
              { label: '물류/운송', color: 'bg-teal-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
