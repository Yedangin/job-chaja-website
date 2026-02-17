'use client';

// 시안 19: 트위터/X 포스트 카드 / Variant 19: Twitter/X Post Card
// 트위터 타임라인 스타일 — 회사 아바타, @핸들, 트윗 본문, 인터랙션 메트릭, 인용 트윗 비자 정보
// Twitter timeline style — company avatar, @handle, tweet body, engagement metrics, quoted tweet visa info

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  BadgeCheck,
  MapPin,
  Briefcase,
  Clock,
  Shield,
  Bookmark,
  MoreHorizontal,
  Share,
} from 'lucide-react';

// 회사명을 @핸들로 변환 / Convert company name to @handle
function toHandle(company: string): string {
  return '@' + company
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9가-힣]/g, '')
    .slice(0, 16);
}

// 회사 로고 이니셜 색상 / Company logo initial colors
const avatarColors: string[] = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-cyan-500',
];

// 뷰 카운트 포맷 (1.2K 스타일) / Format view count (1.2K style)
function formatCount(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// 랜덤 공유 수 (시드 기반) / Pseudo-random share count (seed-based)
function getShareCount(id: string): number {
  const seed = id.charCodeAt(id.length - 1);
  return Math.floor(seed * 3.7) + 5;
}

// 랜덤 북마크 수 / Pseudo-random bookmark count
function getBookmarkCount(id: string): number {
  const seed = id.charCodeAt(id.length - 1);
  return Math.floor(seed * 1.3) + 2;
}

// 쓰레드 연결선이 필요한 공고 인덱스 결정 (같은 업종끼리) / Determine thread lines between same-industry jobs
function getThreadConnections(jobs: MockJobPosting[]): Set<number> {
  const connections = new Set<number>();
  for (let i = 0; i < jobs.length - 1; i++) {
    if (jobs[i].industry === jobs[i + 1].industry) {
      connections.add(i);
    }
  }
  return connections;
}

// 개별 트윗 카드 컴포넌트 / Individual tweet card component
function TweetCard({
  job,
  colorIndex,
  hasThreadLine,
}: {
  job: MockJobPosting;
  colorIndex: number;
  hasThreadLine: boolean;
}) {
  // 기본 데이터 계산 / Calculate base data
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const handle = toHandle(job.company);
  const isPremium = job.tierType === 'PREMIUM';
  const isClosed = dDay === '마감';
  const initial = job.company.charAt(0);
  const avatarColor = avatarColors[colorIndex % avatarColors.length];

  return (
    <article
      className={`
        relative bg-white border-b border-gray-200
        hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer
        ${isClosed ? 'opacity-60' : ''}
      `}
    >
      <div className="flex px-4 pt-3 pb-1">
        {/* 왼쪽: 아바타 + 쓰레드 라인 / Left: Avatar + thread line */}
        <div className="flex flex-col items-center mr-3 flex-shrink-0">
          {/* 회사 아바타 / Company avatar */}
          <div
            className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
              text-white font-bold text-base sm:text-lg ${avatarColor}
              ring-2 ring-white shadow-sm
            `}
          >
            {initial}
          </div>
          {/* 쓰레드 연결선 / Thread connecting line */}
          {hasThreadLine && (
            <div className="w-0.5 flex-1 bg-gray-200 mt-2 min-h-[20px]" />
          )}
        </div>

        {/* 오른쪽: 트윗 콘텐츠 / Right: Tweet content */}
        <div className="flex-1 min-w-0">
          {/* 헤더: 회사명 + 핸들 + 시간 / Header: company + handle + time */}
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {/* 회사명 (굵은 글씨) / Company name (bold) */}
              <span className="font-bold text-[15px] text-gray-900 truncate">
                {job.company}
              </span>
              {/* 프리미엄 인증 배지 (파란 체크) / Premium verified badge (blue check) */}
              {isPremium && (
                <BadgeCheck className="w-[18px] h-[18px] text-blue-500 flex-shrink-0" />
              )}
              {/* @핸들 / @handle */}
              <span className="text-gray-500 text-[15px] truncate hidden sm:inline">
                {handle}
              </span>
              {/* 구분점 + 시간 / Separator + time */}
              <span className="text-gray-500 text-sm flex-shrink-0">
                · {timeAgo}
              </span>
            </div>
            {/* 더보기 버튼 / More button */}
            <button className="p-1.5 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* 트윗 본문: 공고 제목 + 설명 / Tweet body: job title + description */}
          <div className="mb-2">
            {/* 긴급 배지 / Urgent badge */}
            {job.isUrgent && (
              <span className="inline-block text-xs font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded mr-1.5 mb-1">
                긴급 URGENT
              </span>
            )}
            {/* 공고 제목 (트윗 본문처럼) / Job title (as tweet body) */}
            <p className="text-[15px] text-gray-900 leading-snug">
              {job.title}
            </p>
            {/* 추가 정보 (해시태그 스타일) / Additional info (hashtag style) */}
            <p className="text-[15px] text-gray-500 mt-1 leading-snug">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
              <span className="mx-2">·</span>
              <span className="inline-flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
              </span>
              <span className="mx-2">·</span>
              <span className="font-semibold text-gray-800">{salary}</span>
            </p>
            {/* 해시태그 / Hashtags */}
            <p className="text-[15px] text-blue-500 mt-1">
              #{job.industry.replace('/', '_')} #{job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
              {job.experienceRequired && ` #${job.experienceRequired}`}
              {dDay && dDay !== '마감' && ` #${dDay}`}
            </p>
          </div>

          {/* 인용 트윗: 비자 정보 카드 / Quoted tweet: visa info card */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3 hover:bg-gray-50 transition-colors">
            {/* 인용 헤더 / Quote header */}
            <div className="px-3 pt-2.5 pb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-bold text-gray-700">
                잡차자 비자 매칭 / JobChaJa Visa Match
              </span>
              <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
            </div>
            {/* 인용 본문: 비자 배지들 / Quote body: visa badges */}
            <div className="px-3 pb-2.5">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {job.allowedVisas.map((visa) => (
                  <span
                    key={visa}
                    className="text-xs font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full"
                  >
                    {visa}
                  </span>
                ))}
              </div>
              {/* 매칭 스코어 + 복리후생 / Match score + benefits */}
              <div className="flex items-center gap-2 flex-wrap">
                {job.matchScore && (
                  <span className="text-xs font-bold text-emerald-600">
                    매칭 {job.matchScore}%
                  </span>
                )}
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500 truncate">
                  {job.benefits.slice(0, 3).join(' · ')}
                  {job.benefits.length > 3 && ` 외 ${job.benefits.length - 3}건`}
                </span>
              </div>
            </div>
          </div>

          {/* 인터랙션 메트릭 행 / Engagement metrics row */}
          <div className="flex items-center justify-between max-w-[425px] -ml-2 pb-2">
            {/* 지원자 (댓글 아이콘) / Applicants (comment icon) */}
            <button className="flex items-center gap-1.5 group/btn p-2 rounded-full hover:bg-blue-50 transition-colors">
              <MessageCircle className="w-[18px] h-[18px] text-gray-500 group-hover/btn:text-blue-500 transition-colors" />
              <span className="text-[13px] text-gray-500 group-hover/btn:text-blue-500 transition-colors">
                {job.applicantCount}
              </span>
            </button>

            {/* 공유 (리트윗 아이콘) / Shares (retweet icon) */}
            <button className="flex items-center gap-1.5 group/btn p-2 rounded-full hover:bg-emerald-50 transition-colors">
              <Repeat2 className="w-[18px] h-[18px] text-gray-500 group-hover/btn:text-emerald-500 transition-colors" />
              <span className="text-[13px] text-gray-500 group-hover/btn:text-emerald-500 transition-colors">
                {getShareCount(job.id)}
              </span>
            </button>

            {/* 북마크 (하트 아이콘) / Bookmarks (heart icon) */}
            <button className="flex items-center gap-1.5 group/btn p-2 rounded-full hover:bg-rose-50 transition-colors">
              <Heart className="w-[18px] h-[18px] text-gray-500 group-hover/btn:text-rose-500 transition-colors" />
              <span className="text-[13px] text-gray-500 group-hover/btn:text-rose-500 transition-colors">
                {getBookmarkCount(job.id)}
              </span>
            </button>

            {/* 조회수 (차트 아이콘) / Views (chart icon) */}
            <button className="flex items-center gap-1.5 group/btn p-2 rounded-full hover:bg-blue-50 transition-colors">
              <BarChart3 className="w-[18px] h-[18px] text-gray-500 group-hover/btn:text-blue-500 transition-colors" />
              <span className="text-[13px] text-gray-500 group-hover/btn:text-blue-500 transition-colors">
                {formatCount(job.viewCount)}
              </span>
            </button>

            {/* 북마크 + 공유 / Bookmark + Share */}
            <div className="flex items-center gap-0.5">
              <button className="p-2 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-500 transition-colors">
                <Bookmark className="w-[18px] h-[18px]" />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-500 transition-colors">
                <Share className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant19Page() {
  // 쓰레드 연결 계산 / Calculate thread connections
  const threadConnections = getThreadConnections(sampleJobs);

  return (
    <div className="min-h-screen bg-black">
      {/* 상단 네비게이션 바 (X 스타일) / Top navigation bar (X style) */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[600px] mx-auto px-4">
          <div className="flex items-center justify-between h-[53px]">
            <h1 className="text-xl font-bold text-white">
              채용공고 / Jobs
            </h1>
            <div className="text-xs text-gray-500">
              시안 19 / Variant 19
            </div>
          </div>
          {/* 탭 바 / Tab bar */}
          <div className="flex">
            <button className="flex-1 text-center py-3 text-sm font-bold text-white border-b-4 border-blue-500">
              추천 / For You
            </button>
            <button className="flex-1 text-center py-3 text-sm font-bold text-gray-500 hover:bg-gray-900/50 transition-colors">
              팔로잉 / Following
            </button>
          </div>
        </div>
      </header>

      {/* 페이지 설명 (디자인 프리뷰용) / Page description (for design preview) */}
      <div className="max-w-[600px] mx-auto px-4 py-4 border-b border-gray-800">
        <p className="text-sm text-gray-400">
          트위터/X 타임라인 스타일 — 아바타, @핸들, 인용 트윗 비자 카드, 인터랙션 메트릭
        </p>
        <p className="text-xs text-gray-600 mt-0.5">
          Twitter/X timeline style — avatar, @handle, quoted tweet visa card, engagement metrics
        </p>
      </div>

      {/* 타임라인 피드 / Timeline feed */}
      <main className="max-w-[600px] mx-auto">
        {sampleJobs.map((job, index) => (
          <TweetCard
            key={job.id}
            job={job}
            colorIndex={index}
            hasThreadLine={threadConnections.has(index)}
          />
        ))}

        {/* "더 보기" 프롬프트 / "Show more" prompt */}
        <div className="py-6 text-center border-b border-gray-800">
          <button className="text-blue-500 text-[15px] hover:underline">
            더 많은 채용공고 보기 / Show more jobs
          </button>
        </div>

        {/* 하단 여백 / Bottom spacing */}
        <div className="h-20" />
      </main>

      {/* 우측 사이드바 (데스크탑만) / Right sidebar (desktop only) */}
      <aside className="hidden xl:block fixed right-[calc(50%-480px)] top-0 w-[350px] h-screen border-l border-gray-800 p-6 pt-4">
        {/* 검색 바 / Search bar */}
        <div className="bg-gray-900 rounded-full px-4 py-2.5 mb-6">
          <span className="text-gray-500 text-[15px]">
            채용공고 검색 / Search jobs
          </span>
        </div>

        {/* 트렌딩 섹션 / Trending section */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <h2 className="px-4 py-3 text-xl font-bold text-white">
            채용 트렌드 / Hiring Trends
          </h2>
          {/* 트렌딩 아이템들 / Trending items */}
          {['제조업', 'IT/소프트웨어', '건설', '교육', '물류/운송'].map(
            (trend, idx) => (
              <div
                key={trend}
                className="px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <p className="text-xs text-gray-500">
                  {idx + 1} · 채용 트렌드 / Hiring trend
                </p>
                <p className="text-[15px] font-bold text-white mt-0.5">
                  #{trend}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {Math.floor(Math.random() * 500 + 100)}개 공고
                </p>
              </div>
            )
          )}
        </div>

        {/* 비자 정보 섹션 / Visa info section */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden mt-4">
          <h2 className="px-4 py-3 text-xl font-bold text-white">
            비자 가이드 / Visa Guide
          </h2>
          <div className="px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-[15px] text-white">E-9 비전문취업</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">가장 많은 매칭 공고</p>
          </div>
          <div className="px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-[15px] text-white">H-2 방문취업</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">빠른 취업 가능</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
