'use client';

// 시안 13: 매거진 / 에디토리얼 스타일 / Variant 13: Magazine / Editorial Style
// Monocle/Bloomberg 스타일의 에디토리얼 레이아웃 — 대형 피처 카드 + 소형 사이드 카드
// Monocle/Bloomberg-inspired editorial layout — large featured cards + smaller sidebar cards
// 세리프 타이포그래피, 흑백 기반 + 악센트 컬러 팝
// Serif typography, black & white base with accent color pops

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Clock,
  Users,
  ArrowUpRight,
  Briefcase,
  Star,
  ChevronRight,
} from 'lucide-react';

// 피처 카드 (대형) / Featured card (large) — 첫 2개 공고에 사용
// Used for the first 2 jobs in the editorial layout
function FeaturedCard({ job, index }: { job: MockJobPosting; index: number }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);

  // 첫 번째는 풀 너비, 두 번째는 절반 너비 / First is full width, second is half
  const isFirst = index === 0;

  return (
    <article
      className={`group relative bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:border-black ${
        isFirst ? 'col-span-1 md:col-span-2' : 'col-span-1'
      }`}
    >
      {/* 상단 악센트 라인 / Top accent line */}
      <div className="h-1 bg-black w-full" />

      <div className={`p-6 md:p-8 ${isFirst ? 'md:p-10' : ''}`}>
        {/* 카테고리 라벨 + 마감일 / Category label + closing date */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            {/* 업종 카테고리 / Industry category */}
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 border-b border-gray-300 pb-0.5">
              {job.industry}
            </span>
            {/* 긴급 채용 배지 / Urgent hiring badge */}
            {job.isUrgent && (
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-600 bg-red-50 px-2 py-0.5 border border-red-200">
                URGENT
              </span>
            )}
            {/* 프리미엄 배지 / Premium badge */}
            {job.tierType === 'PREMIUM' && (
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                PREMIUM
              </span>
            )}
          </div>
          {/* D-day 표시 / D-day display */}
          {dDay && (
            <span
              className={`text-xs font-mono tracking-wider ${
                dDay === '마감'
                  ? 'text-gray-400'
                  : dDay === 'D-Day' || (dDay.startsWith('D-') && parseInt(dDay.replace('D-', ''), 10) <= 7)
                  ? 'text-red-600 font-bold'
                  : 'text-gray-500'
              }`}
            >
              {dDay}
            </span>
          )}
        </div>

        {/* 회사명 (큰 타이포) / Company name (large typography) */}
        <h2
          className={`font-serif text-gray-400 tracking-wide mb-2 ${
            isFirst ? 'text-sm md:text-base' : 'text-sm'
          }`}
        >
          {job.company}
        </h2>

        {/* 공고 제목 (에디토리얼 헤드라인) / Job title (editorial headline) */}
        <h1
          className={`font-serif font-bold text-gray-950 leading-tight mb-4 md:mb-6 group-hover:text-gray-700 transition-colors ${
            isFirst
              ? 'text-2xl md:text-3xl lg:text-4xl'
              : 'text-xl md:text-2xl'
          }`}
        >
          {job.title}
        </h1>

        {/* 급여 풀쿼트 스타일 / Salary pull-quote style */}
        <div className="border-l-4 border-black pl-4 md:pl-6 mb-6 md:mb-8">
          <p
            className={`font-serif italic text-gray-900 ${
              isFirst ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
            }`}
          >
            {salary}
          </p>
          {/* 고용형태 / Employment type */}
          <p className="text-xs font-mono uppercase tracking-[0.15em] text-gray-500 mt-1">
            {job.boardType === 'FULL_TIME' ? 'Full-Time / 정규직' : 'Part-Time / 알바'}
          </p>
        </div>

        {/* 상세 정보 그리드 / Detail info grid */}
        <div
          className={`grid gap-4 mb-6 ${
            isFirst ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'
          }`}
        >
          {/* 근무지 / Location */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-gray-400 mb-0.5">
                Location
              </p>
              <p className="text-sm text-gray-800">{job.location}</p>
            </div>
          </div>

          {/* 근무시간 / Work hours */}
          {job.workHours && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-gray-400 mb-0.5">
                  Hours
                </p>
                <p className="text-sm text-gray-800">{job.workHours}</p>
              </div>
            </div>
          )}

          {/* 경력요건 / Experience */}
          {job.experienceRequired && (
            <div className="flex items-start gap-2">
              <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-gray-400 mb-0.5">
                  Experience
                </p>
                <p className="text-sm text-gray-800">{job.experienceRequired}</p>
              </div>
            </div>
          )}

          {/* 지원자 수 / Applicant count */}
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-gray-400 mb-0.5">
                Applicants
              </p>
              <p className="text-sm text-gray-800">{job.applicantCount}명</p>
            </div>
          </div>
        </div>

        {/* 하단: 비자 유형 + 조회수 + 게시일 / Bottom: visa types + views + posted */}
        <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
          {/* 비자 유형 / Visa types */}
          <div className="flex flex-wrap gap-2">
            {job.allowedVisas.map((visa) => (
              <span
                key={visa}
                className="text-[11px] font-mono tracking-wider px-2 py-1 border border-gray-300 text-gray-700 hover:bg-black hover:text-white transition-colors cursor-default"
              >
                {visa}
              </span>
            ))}
          </div>

          {/* 메타 정보 행 / Meta info row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
              <span>{timeAgo}</span>
              <span>|</span>
              <span>{job.viewCount.toLocaleString()} views</span>
              {/* 매칭 점수 / Match score */}
              {job.matchScore && (
                <>
                  <span>|</span>
                  <span className="text-gray-700 font-medium">
                    Match {job.matchScore}%
                  </span>
                </>
              )}
            </div>
            {/* 화살표 링크 / Arrow link */}
            <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
          </div>
        </div>
      </div>
    </article>
  );
}

// 소형 카드 (사이드바 스타일) / Small card (sidebar style) — 나머지 4개 공고에 사용
// Used for the remaining 4 jobs in the editorial grid
function CompactCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);

  return (
    <article className="group bg-white border border-gray-200 p-5 transition-all duration-300 hover:border-black">
      {/* 상단: 번호 + 카테고리 / Top: number + category */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
          {job.industry}
        </span>
        <div className="flex items-center gap-2">
          {/* 긴급 배지 / Urgent badge */}
          {job.isUrgent && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          {/* D-day / D-day display */}
          {dDay && (
            <span
              className={`text-[11px] font-mono ${
                dDay === '마감'
                  ? 'text-gray-400'
                  : dDay === 'D-Day' || (dDay.startsWith('D-') && parseInt(dDay.replace('D-', ''), 10) <= 7)
                  ? 'text-red-600 font-bold'
                  : 'text-gray-500'
              }`}
            >
              {dDay}
            </span>
          )}
        </div>
      </div>

      {/* 회사명 / Company name */}
      <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
        {job.company}
      </p>

      {/* 공고 제목 / Job title */}
      <h3 className="font-serif text-base font-bold text-gray-950 leading-snug mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
        {job.title}
      </h3>

      {/* 급여 (인라인 풀쿼트) / Salary (inline pull-quote) */}
      <div className="border-l-2 border-black pl-3 mb-3">
        <p className="font-serif italic text-gray-900 text-sm">{salary}</p>
      </div>

      {/* 요약 정보 / Summary info */}
      <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{job.location}</span>
        </div>
        <span className="text-gray-300">|</span>
        <span>
          {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
        </span>
      </div>

      {/* 비자 태그 / Visa tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.allowedVisas.map((visa) => (
          <span
            key={visa}
            className="text-[10px] font-mono px-1.5 py-0.5 border border-gray-200 text-gray-600"
          >
            {visa}
          </span>
        ))}
      </div>

      {/* 하단 메타 / Bottom meta */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400">
          <span>{timeAgo}</span>
          <span>{job.applicantCount}명 지원</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
      </div>
    </article>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant13Page() {
  // 첫 2개는 피처 카드, 나머지 4개는 소형 카드 / First 2 are featured, rest are compact
  const featuredJobs = sampleJobs.slice(0, 2);
  const compactJobs = sampleJobs.slice(2);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 페이지 헤더 / Page header — 에디토리얼 스타일 마스트헤드 */}
      {/* Editorial-style masthead */}
      <header className="border-b border-gray-300">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-6">
          {/* 카테고리 / Section label */}
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 mb-3">
            Job Listings / 채용공고
          </p>

          {/* 메인 타이틀 / Main title */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-950 leading-tight mb-2">
            시안 13: Magazine Editorial
          </h1>

          {/* 부제 / Subtitle */}
          <p className="font-serif text-base md:text-lg text-gray-500 italic">
            Monocle/Bloomberg 스타일 에디토리얼 레이아웃 &mdash; 대형 피처 + 소형 그리드
          </p>

          {/* 날짜 / Date line */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
              {sampleJobs.length} Positions
            </span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 / Main content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* 피처 섹션 제목 / Featured section title */}
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-4 h-4 text-gray-400" />
          <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
            Featured Positions / 주요 채용
          </h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 피처 카드 그리드 (첫 2개) / Featured cards grid (first 2) */}
        {/* 첫 번째: 풀 너비, 두 번째: 절반 너비 */}
        {/* First: full width, second: half width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-14">
          {featuredJobs.map((job, idx) => (
            <FeaturedCard key={job.id} job={job} index={idx} />
          ))}
        </div>

        {/* 구분선 / Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400">
            &bull; &bull; &bull;
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 소형 카드 섹션 제목 / Compact section title */}
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
            More Opportunities / 추가 채용
          </h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 소형 카드 그리드 (나머지 4개) / Compact cards grid (remaining 4) */}
        {/* 반응형: 모바일 1열, 태블릿 2열, 데스크탑 4열 */}
        {/* Responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {compactJobs.map((job) => (
            <CompactCard key={job.id} job={job} />
          ))}
        </div>
      </main>

      {/* 페이지 푸터 / Page footer — 에디토리얼 스타일 */}
      <footer className="border-t border-gray-300 mt-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 text-center">
            JobChaJa Editorial &mdash; Magazine Style Layout
          </p>
        </div>
      </footer>
    </div>
  );
}
