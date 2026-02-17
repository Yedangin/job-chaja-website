'use client';

// 시안 14: 소셜 미디어 카드 (인스타그램 스타일) / Variant 14: Social Media Card (Instagram-like)
// 인스타그램/소셜 미디어 포스트 스타일 카드 — 정사각형 비율, 그래디언트, 해시태그
// Instagram/social media post style cards — square ratio, gradients, hashtags
// 상단 스토리 행 + 피드 스타일 그리드
// Stories row at top + feed-style grid

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  MessageCircle,
  Send,
  MapPin,
  Verified,
  Users,
} from 'lucide-react';

// 그래디언트 색상 매핑 (업종별) / Gradient color mapping (by industry)
// 각 업종에 고유한 그래디언트 배경 부여 / Assign unique gradient backgrounds per industry
function getGradient(industry: string): string {
  const gradients: Record<string, string> = {
    '제조': 'from-blue-600 via-blue-500 to-cyan-400',
    '숙박/음식': 'from-orange-500 via-rose-500 to-pink-500',
    'IT/소프트웨어': 'from-violet-600 via-purple-500 to-fuchsia-400',
    '건설': 'from-amber-600 via-orange-500 to-yellow-400',
    '물류/운송': 'from-emerald-600 via-teal-500 to-cyan-400',
    '교육': 'from-sky-500 via-indigo-500 to-violet-500',
  };
  return gradients[industry] || 'from-gray-600 via-gray-500 to-gray-400';
}

// 스토리 아이템 컴포넌트 / Story item component — 상단 스토리 행에 사용
// Used in the stories row at the top, showing company logos in circular frames
function StoryItem({ job }: { job: MockJobPosting }) {
  // 회사명 이니셜 추출 / Extract company name initial
  const initial = job.company.charAt(0);
  // 업종별 그래디언트 / Industry-specific gradient
  const gradient = getGradient(job.industry);

  return (
    <button className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
      {/* 스토리 링 (그래디언트 테두리) / Story ring (gradient border) */}
      <div className={`p-[3px] rounded-full bg-gradient-to-br ${gradient}`}>
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white p-[2px]">
          <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-lg md:text-xl font-bold text-gray-700">
              {initial}
            </span>
          </div>
        </div>
      </div>
      {/* 회사명 (2줄 제한) / Company name (2 line max) */}
      <span className="text-[10px] text-gray-600 text-center w-16 md:w-18 line-clamp-1 group-hover:text-gray-900 transition-colors">
        {job.company.split(' ')[0]}
      </span>
    </button>
  );
}

// 소셜 미디어 카드 컴포넌트 / Social media card component — 인스타그램 피드 스타일
// Instagram feed-style card with user header, content area, and action row
function SocialJobCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 업종별 그래디언트 / Industry-specific gradient
  const gradient = getGradient(job.industry);
  // 회사명 이니셜 / Company initial
  const initial = job.company.charAt(0);

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* === 헤더: 아바타 + 회사명 + 채용중 배지 (인스타 유저 헤더) === */}
      {/* === Header: Avatar + Company name + Hiring badge (Instagram user header) === */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          {/* 회사 아바타 / Company avatar */}
          <div className={`p-[2px] rounded-full bg-gradient-to-br ${gradient}`}>
            <div className="w-9 h-9 rounded-full bg-white p-[1px]">
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">{initial}</span>
              </div>
            </div>
          </div>
          {/* 회사명 + 위치 / Company name + location */}
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-semibold text-gray-900">
                {job.company}
              </span>
              {/* 인증 배지 (프리미엄 기업) / Verified badge (premium company) */}
              {job.tierType === 'PREMIUM' && (
                <Verified className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
              )}
            </div>
            <span className="text-[11px] text-gray-500">{job.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 채용중 배지 / Hiring badge */}
          <span className="text-[11px] font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full">
            채용중
          </span>
          {/* 더보기 버튼 / More button */}
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* === 콘텐츠 영역: 그래디언트 배경 + 공고 제목 === */}
      {/* === Content area: Gradient background + job title === */}
      <div
        className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} flex flex-col justify-between p-5`}
      >
        {/* 상단 라벨 행 / Top label row */}
        <div className="flex items-start justify-between">
          {/* 고용형태 배지 / Employment type badge */}
          <span className="text-[11px] font-medium text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>

          <div className="flex flex-col items-end gap-1.5">
            {/* 긴급 배지 / Urgent badge */}
            {job.isUrgent && (
              <span className="text-[11px] font-bold text-white bg-red-500/80 backdrop-blur-sm px-2.5 py-1 rounded-full animate-pulse">
                URGENT
              </span>
            )}
            {/* D-day 배지 / D-day badge */}
            {dDay && (
              <span className="text-[11px] font-medium text-white/90 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {dDay}
              </span>
            )}
          </div>
        </div>

        {/* 하단: 공고 제목 + 급여 (큰 흰색 텍스트) / Bottom: Job title + salary (bold white text) */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white leading-snug mb-2 line-clamp-2 drop-shadow-sm">
            {job.title}
          </h3>
          <p className="text-base md:text-lg font-semibold text-white/95 drop-shadow-sm">
            {salary}
          </p>
        </div>

        {/* 매칭 점수 오버레이 / Match score overlay */}
        {job.matchScore && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <div className="bg-white/25 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-white">
                매칭 {job.matchScore}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* === 액션 행: 좋아요, 댓글, 공유, 북마크 (인스타 액션 바) === */}
      {/* === Action row: Like, Comment, Share, Bookmark (Instagram action bar) === */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-4">
          {/* 좋아요 / Like */}
          <button className="group/btn flex items-center gap-1">
            <Heart className="w-6 h-6 text-gray-700 group-hover/btn:text-red-500 transition-colors" />
          </button>
          {/* 댓글 (지원하기 개념) / Comment (apply concept) */}
          <button className="group/btn flex items-center gap-1">
            <MessageCircle className="w-6 h-6 text-gray-700 group-hover/btn:text-blue-500 transition-colors" />
          </button>
          {/* 공유 / Share */}
          <button className="group/btn">
            <Send className="w-5.5 h-5.5 text-gray-700 group-hover/btn:text-green-500 transition-colors" />
          </button>
        </div>
        {/* 북마크 / Bookmark */}
        <button className="group/btn">
          <Bookmark className="w-6 h-6 text-gray-700 group-hover/btn:text-yellow-500 transition-colors" />
        </button>
      </div>

      {/* === 좋아요(관심) 수 + 비자 해시태그 === */}
      {/* === Likes (interest) count + visa hashtags === */}
      <div className="px-3.5 pb-3">
        {/* 좋아요 수 (지원자 수 활용) / Like count (using applicant count) */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Users className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[13px] font-semibold text-gray-900">
            {job.applicantCount}명 관심
          </span>
          <span className="text-[12px] text-gray-400 ml-1">
            &middot; 조회 {job.viewCount.toLocaleString()}
          </span>
        </div>

        {/* 복리후생 미리보기 / Benefits preview */}
        <p className="text-[12px] text-gray-700 mb-1.5 line-clamp-1">
          <span className="font-semibold">{job.company}</span>
          {' '}
          {job.benefits.slice(0, 3).join(' / ')}
          {job.benefits.length > 3 && ' ...'}
        </p>

        {/* 비자 해시태그 / Visa hashtags */}
        <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className="text-[12px] font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
            >
              #{visa}
            </span>
          ))}
          {/* 업종 해시태그 / Industry hashtag */}
          <span className="text-[12px] text-gray-400">
            #{job.industry.replace('/', '_')}
          </span>
          {/* 고용형태 해시태그 / Employment type hashtag */}
          <span className="text-[12px] text-gray-400">
            #{job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
        </div>

        {/* 게시 시간 / Posted time */}
        <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-wide">
          {timeAgo}
        </p>
      </div>
    </article>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant14Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-xl font-bold text-gray-900">
          시안 14: Social Media Card
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          인스타그램/소셜 미디어 포스트 스타일 &mdash; 그래디언트, 해시태그, 스토리
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Instagram/social-media post style &mdash; gradients, hashtags, stories
        </p>
      </div>

      {/* === 스토리 행: 회사 로고 원형 프레임 (인스타 스토리) === */}
      {/* === Stories row: Company logo circular frames (Instagram stories) === */}
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
            {sampleJobs.map((job) => (
              <StoryItem key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>

      {/* === 피드 카드 그리드 / Feed card grid === */}
      {/* 반응형: 모바일 1열, 태블릿 2열, 데스크탑 3열 */}
      {/* Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleJobs.map((job) => (
            <SocialJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
