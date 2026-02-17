'use client';

// 시안 07: 가로형 리스트 카드 (링크드인 스타일) / Variant 07: Horizontal List Card (LinkedIn Style)
// 넓은 가로형 카드, 세로 스택. 왼쪽: 회사 로고, 중앙: 제목+회사+비자, 오른쪽: 급여+D-day+지원 버튼
// Wide horizontal cards stacked vertically. Left: company logo. Center: title+company+visas. Right: salary+D-day+apply.

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Building2,
  Clock,
  Users,
  Briefcase,
  ChevronRight,
  Star,
  AlertCircle,
  Eye,
} from 'lucide-react';

// D-day 색상 결정 / Determine D-day color styling
function getDDayStyle(dDay: string | null): string {
  if (!dDay) return 'text-gray-400';
  if (dDay === '마감') return 'text-gray-400 line-through';
  if (dDay === 'D-Day') return 'text-red-600 font-bold';
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 3) return 'text-red-600 font-semibold';
  if (!isNaN(num) && num <= 7) return 'text-orange-500 font-medium';
  return 'text-gray-500';
}

// 회사 로고 플레이스홀더 색상 / Company logo placeholder colors
const logoColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
];

// 개별 가로형 카드 컴포넌트 / Individual horizontal list card component
function LinkedInJobCard({ job, index }: { job: MockJobPosting; index: number }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 프리미엄 여부 / Is premium
  const isPremium = job.tierType === 'PREMIUM';
  // 마감 여부 / Is closed
  const isClosed = dDay === '마감';

  return (
    <div
      className={`
        group relative flex items-center gap-4 px-5 py-4
        bg-white
        transition-all duration-200 ease-in-out
        hover:bg-blue-50/60
        cursor-pointer
        ${isPremium ? 'border-l-[3px] border-l-blue-500' : 'border-l-[3px] border-l-transparent'}
      `}
    >
      {/* 왼쪽: 회사 로고 플레이스홀더 / Left: Company logo placeholder */}
      <div className="flex-shrink-0">
        <div
          className={`
            w-12 h-12 rounded-lg ${logoColors[index % logoColors.length]}
            flex items-center justify-center text-white font-bold text-lg
            shadow-sm
          `}
        >
          {job.company.charAt(0)}
        </div>
      </div>

      {/* 중앙: 공고 정보 / Center: Job info */}
      <div className="flex-1 min-w-0">
        {/* 제목 행 / Title row */}
        <div className="flex items-center gap-2 mb-1">
          {/* 긴급 뱃지 / Urgent badge */}
          {job.isUrgent && (
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
              <AlertCircle className="w-3 h-3" />
              긴급
            </span>
          )}
          {/* 추천 뱃지 / Featured badge */}
          {job.isFeatured && (
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3" />
              추천
            </span>
          )}
          {/* 프리미엄 뱃지 / Premium badge */}
          {isPremium && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              PREMIUM
            </span>
          )}
          {/* 공고 제목 / Job title */}
          <h3
            className={`
              text-[15px] font-semibold text-gray-900 truncate
              group-hover:text-blue-700 transition-colors
              ${isClosed ? 'line-through text-gray-400' : ''}
            `}
          >
            {job.title}
          </h3>
        </div>

        {/* 회사명 + 위치 + 메타정보 / Company + location + meta */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-1.5">
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            {job.company}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {job.workHours || '협의'}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-400 text-xs">{timeAgo}</span>
        </div>

        {/* 비자 배지 행 / Visa badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className="inline-block text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full"
            >
              {visa}
            </span>
          ))}
          {/* 고용형태 뱃지 / Employment type badge */}
          <span
            className={`
              inline-block text-xs font-medium px-2 py-0.5 rounded-full
              ${job.boardType === 'FULL_TIME'
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                : 'text-orange-700 bg-orange-50 border border-orange-100'
              }
            `}
          >
            {job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'}
          </span>
          {/* 경력 뱃지 / Experience badge */}
          {job.experienceRequired && (
            <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {job.experienceRequired}
            </span>
          )}
        </div>
      </div>

      {/* 오른쪽: 급여 + D-day + 지원 / Right: Salary + D-day + Apply */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2 min-w-[160px]">
        {/* 급여 / Salary */}
        <span className="text-[15px] font-bold text-blue-600 whitespace-nowrap">
          {salary}
        </span>

        {/* D-day + 조회/지원 수 / D-day + view/applicant counts */}
        <div className="flex items-center gap-3 text-xs">
          <span className={getDDayStyle(dDay)}>{dDay}</span>
          <span className="inline-flex items-center gap-0.5 text-gray-400">
            <Eye className="w-3 h-3" />
            {job.viewCount.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-0.5 text-gray-400">
            <Users className="w-3 h-3" />
            {job.applicantCount}
          </span>
        </div>

        {/* 지원하기 버튼 / Apply button */}
        <button
          className={`
            inline-flex items-center gap-1 text-sm font-medium px-4 py-1.5 rounded-full
            transition-all duration-200
            ${isClosed
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow'
            }
          `}
          disabled={isClosed}
        >
          <Briefcase className="w-3.5 h-3.5" />
          {isClosed ? '마감' : '지원하기'}
          {!isClosed && <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant07Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          시안 07: 가로형 리스트 카드
        </h1>
        <p className="text-sm text-gray-500">
          Variant 07: Horizontal List Card (LinkedIn Style) — 넓은 가로형 카드, 프로페셔널한 리스트 뷰
        </p>
      </div>

      {/* 카드 리스트 컨테이너 / Card list container */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 리스트 헤더 / List header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50/80 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            추천 채용공고 {sampleJobs.length}건
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
              최신순
            </span>
            <span className="px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
              급여순
            </span>
            <span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded cursor-pointer">
              추천순
            </span>
          </div>
        </div>

        {/* 카드 목록 / Card list */}
        {sampleJobs.map((job, index) => (
          <div key={job.id}>
            <LinkedInJobCard job={job} index={index} />
            {/* 마지막 카드 아래에는 구분선 없음 / No divider after last card */}
            {index < sampleJobs.length - 1 && (
              <div className="border-b border-gray-100 mx-5" />
            )}
          </div>
        ))}

        {/* 리스트 푸터 / List footer */}
        <div className="flex items-center justify-center py-4 border-t border-gray-200 bg-gray-50/50">
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">
            더 많은 채용공고 보기 →
          </button>
        </div>
      </div>

      {/* 디자인 설명 / Design notes */}
      <div className="max-w-5xl mx-auto mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">디자인 특징 / Design Notes</h2>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>- 전체 너비 가로형 카드, 세로 스택 / Full-width horizontal cards, vertically stacked</li>
          <li>- 왼쪽 회사 로고(48x48), 중앙 정보, 오른쪽 급여+액션 / Left logo, center info, right salary+action</li>
          <li>- 프리미엄 공고: 왼쪽 파란 보더 / Premium posts: subtle left blue border</li>
          <li>- 호버 시 연한 파란 배경 / Light blue hover highlight on entire row</li>
          <li>- 카드 사이 얇은 구분선 / Thin divider between cards</li>
          <li>- 비자 배지 인라인 표시 / Visa badges inline with info</li>
        </ul>
      </div>
    </div>
  );
}
