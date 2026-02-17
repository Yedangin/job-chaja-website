'use client';

import { useState } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  Eye,
  Users,
  MapPin,
  Clock,
  Briefcase,
  Star,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Lock,
} from 'lucide-react';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-092',
  name: 'Netflix x Blind x Glassdoor',
  author: 'Gemini',
  description:
    'Netflix 카드 확장 + Blind 블러 익명성 + Glassdoor 급여 차트. 다크 미스터리 퓨전 / Netflix card expansion + Blind blur anonymity + Glassdoor salary charts. Dark mystery fusion.',
};

// 익명 리뷰 목데이터 / Anonymous review mock data
const anonymousReviews: Record<
  string,
  { rating: number; pros: string; cons: string; position: string }[]
> = {
  'job-001': [
    { rating: 4.2, pros: '복지가 좋고 안정적', cons: '야근이 가끔 있음', position: '현직원' },
    { rating: 3.8, pros: '기숙사 제공이 큰 장점', cons: '교대 근무 힘듦', position: '전직원' },
  ],
  'job-002': [
    { rating: 3.5, pros: '배울게 많음', cons: '체력적으로 힘듦', position: '현직원' },
    { rating: 4.0, pros: '팀 분위기 좋음', cons: '급여가 낮은 편', position: '현직원' },
  ],
  'job-003': [
    { rating: 4.5, pros: '자유로운 문화, 높은 연봉', cons: '업무 강도 높음', position: '현직원' },
    { rating: 4.3, pros: '기술 스택이 최신', cons: '워라밸 보통', position: '전직원' },
  ],
  'job-004': [
    { rating: 3.2, pros: '일급이 높음', cons: '날씨 영향 큼', position: '현직원' },
    { rating: 3.0, pros: '경험 쌓기 좋음', cons: '위험할 수 있음', position: '전직원' },
  ],
  'job-005': [
    { rating: 3.7, pros: '야간수당 쏠쏠', cons: '생활 리듬 깨짐', position: '현직원' },
    { rating: 3.5, pros: '단순 반복 업무', cons: '체력 소모 큼', position: '전직원' },
  ],
  'job-006': [
    { rating: 4.0, pros: '대기업 경력 가능', cons: '현장 근무 힘듦', position: '현직원' },
    { rating: 4.1, pros: '복리후생 좋음', cons: '출퇴근 거리', position: '전직원' },
  ],
};

// 급여 비교 바 계산 (업종 평균 대비) / Salary comparison bar (vs industry avg)
function getSalaryBarData(job: MockJobPostingV2) {
  // 급여 기준값 결정 / Determine salary reference value
  const salary = job.salaryMin
    ? (job.salaryMin + (job.salaryMax || job.salaryMin)) / 2
    : job.hourlyWage
      ? job.hourlyWage * 2080
      : 0;

  // 업종 평균 (목업) / Industry average (mock)
  const industryAvgMap: Record<string, number> = {
    '제조': 30000000,
    '숙박/음식': 24000000,
    'IT/소프트웨어': 55000000,
    '건설': 32000000,
    '물류/운송': 28000000,
  };

  const industryAvg = industryAvgMap[job.industry] || 30000000;
  const percent = Math.min(Math.round((salary / industryAvg) * 100), 150);
  const diff = Math.round(((salary - industryAvg) / industryAvg) * 100);

  return { salary, industryAvg, percent, diff };
}

// 별점 렌더러 / Star rating renderer
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'
          }
        />
      ))}
      <span className="ml-1 text-xs font-mono text-yellow-400">{rating.toFixed(1)}</span>
    </div>
  );
}

// 급여 바 차트 컴포넌트 / Salary bar chart component
function SalaryChart({ job }: { job: MockJobPostingV2 }) {
  const { percent, diff } = getSalaryBarData(job);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-400 flex items-center gap-1">
          <BarChart3 size={12} />
          업종 평균 대비 급여 수준
        </span>
        <span
          className={`font-mono font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {diff >= 0 ? '+' : ''}
          {diff}%
        </span>
      </div>
      {/* 바 차트 / Bar chart */}
      <div className="relative h-6 bg-neutral-800 rounded-full overflow-hidden">
        {/* 업종 평균 기준선 / Industry average baseline */}
        <div
          className="absolute top-0 h-full w-px bg-neutral-500 z-10"
          style={{ left: '66.6%' }}
        />
        <div
          className="absolute -top-5 text-[9px] text-neutral-500 z-10"
          style={{ left: '66.6%', transform: 'translateX(-50%)' }}
        >
          평균
        </div>
        {/* 현재 급여 바 / Current salary bar */}
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.min((percent / 150) * 100, 100)}%`,
            background:
              diff >= 10
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : diff >= 0
                  ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-neutral-500">
        <span>0</span>
        <span>{formatSalary(job)}</span>
      </div>
    </div>
  );
}

// 메인 카드 컴포넌트 / Main card component
function NetflixBlindCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const dDay = getDDay(job.closingDate);
  const reviews = anonymousReviews[job.id] || [];
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <div
      className={`
        group relative rounded-lg overflow-hidden
        bg-[#1a1a1a] border border-neutral-800
        transition-all duration-500 ease-out
        ${isExpanded ? 'row-span-2 shadow-2xl shadow-red-900/20 border-red-900/40 scale-[1.02] z-20' : 'hover:border-neutral-600 hover:shadow-lg hover:shadow-black/40'}
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 상단 이미지 영역 / Top image area */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={job.industryImage}
          alt={job.industry}
          className={`
            w-full h-full object-cover
            transition-all duration-500
            ${isExpanded ? 'scale-110 brightness-[0.3]' : 'brightness-[0.4] group-hover:scale-105 group-hover:brightness-[0.35]'}
          `}
        />
        {/* 어두운 그라데이션 / Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent" />

        {/* Netflix "N" 스타일 배지 / Netflix "N" style badge */}
        {job.tierType === 'PREMIUM' && (
          <div className="absolute top-3 left-3 w-7 h-7 bg-red-600 rounded flex items-center justify-center shadow-lg shadow-red-600/40">
            <span className="text-white font-black text-sm tracking-tighter">N</span>
          </div>
        )}

        {/* 상단 우측 배지들 / Top right badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {job.isUrgent && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse">
              <Zap size={10} className="inline mr-0.5" />
              URGENT
            </span>
          )}
          {job.isFeatured && (
            <span className="px-2 py-0.5 bg-yellow-500/90 text-black text-[10px] font-bold rounded">
              <Star size={10} className="inline mr-0.5 fill-black" />
              TOP
            </span>
          )}
        </div>

        {/* 매칭 점수 / Match score */}
        {job.matchScore && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 bg-black/70 rounded-full border border-neutral-700">
            <TrendingUp size={10} className="text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {job.matchScore}% MATCH
            </span>
          </div>
        )}

        {/* D-Day 오버레이 / D-Day overlay */}
        <div className="absolute bottom-3 right-3">
          <span
            className={`
            text-xs font-mono font-bold px-2 py-1 rounded
            ${dDay === '마감' ? 'bg-neutral-800 text-neutral-500' : dDay === 'D-Day' || (dDay && parseInt(dDay.replace('D-', '')) <= 3) ? 'bg-red-600/90 text-white' : 'bg-black/70 text-neutral-300 border border-neutral-700'}
          `}
          >
            {dDay}
          </span>
        </div>
      </div>

      {/* 카드 본문 / Card body */}
      <div className="p-4 space-y-3">
        {/* 회사명 (Blind 블러 효과) / Company name (Blind blur effect) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRevealed(!isRevealed);
              }}
              className="relative flex items-center gap-1.5 cursor-pointer group/blind"
              title={isRevealed ? '다시 블러 처리' : '회사명 보기'}
            >
              {/* 회사 이니셜 아바타 / Company initial avatar */}
              <div
                className={`
                w-8 h-8 rounded bg-neutral-800 border border-neutral-700
                flex items-center justify-center text-sm font-bold
                transition-all duration-300
                ${isRevealed ? 'text-white border-red-600/50' : 'text-neutral-500'}
              `}
              >
                {isRevealed ? job.companyInitial : '?'}
              </div>
              {/* 블러 처리된 회사명 / Blurred company name */}
              <span
                className={`
                text-sm font-semibold transition-all duration-500
                ${isRevealed ? 'text-white blur-0' : 'text-neutral-400 blur-[5px] group-hover/blind:blur-[3px]'}
              `}
              >
                {job.company}
              </span>
              {!isRevealed && (
                <Lock size={10} className="text-neutral-600 group-hover/blind:text-neutral-400 transition-colors" />
              )}
            </button>
          </div>
          {/* Glassdoor 별점 / Glassdoor rating */}
          {reviews.length > 0 && <StarRating rating={avgRating} />}
        </div>

        {/* 채용 제목 / Job title */}
        <h3 className="text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
          {job.title}
        </h3>

        {/* 위치 + 근무형태 / Location + work type */}
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={11} />
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
          {job.workHours && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {job.workHours}
            </span>
          )}
        </div>

        {/* 급여 (강조) / Salary (highlighted) */}
        <div className="py-2 px-3 bg-neutral-800/80 rounded-lg border border-neutral-700/50">
          <span className="text-white font-bold text-sm">{formatSalary(job)}</span>
        </div>

        {/* 비자 태그 / Visa tags */}
        <div className="flex flex-wrap gap-1">
          {job.allowedVisas.map((visa) => {
            const color = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`
                  px-1.5 py-0.5 text-[10px] font-medium rounded
                  bg-opacity-20 border border-opacity-30
                  ${color.bg} ${color.text}
                `}
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <Shield size={8} className="inline mr-0.5" />
                {visa}
              </span>
            );
          })}
        </div>

        {/* 통계 바 / Stats bar */}
        <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-800">
          <span className="flex items-center gap-1">
            <Users size={11} />
            지원 {job.applicantCount}명
          </span>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            조회 {job.viewCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={11} />
            리뷰 {reviews.length}
          </span>
        </div>

        {/* 확장 토글 버튼 / Expand toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            w-full py-2 rounded-lg text-xs font-medium
            flex items-center justify-center gap-1
            transition-all duration-300
            ${isExpanded ? 'bg-red-600/20 text-red-400 border border-red-800/50' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 border border-neutral-700'}
          `}
        >
          {isExpanded ? (
            <>
              접기 <ChevronUp size={14} />
            </>
          ) : (
            <>
              급여 분석 & 리뷰 보기 <ChevronDown size={14} />
            </>
          )}
        </button>

        {/* 확장 영역: Glassdoor 급여 차트 + 리뷰 / Expanded: Glassdoor salary chart + reviews */}
        {isExpanded && (
          <div className="space-y-4 pt-2 animate-[fadeSlideIn_0.4s_ease-out]">
            {/* 급여 비교 차트 / Salary comparison chart */}
            <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
              <SalaryChart job={job} />
            </div>

            {/* 혜택 태그 / Benefits tags */}
            <div className="flex flex-wrap gap-1.5">
              {job.benefits.map((b) => (
                <span
                  key={b}
                  className="px-2 py-1 text-[10px] bg-neutral-800 text-neutral-300 rounded-full border border-neutral-700"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Blind 스타일 익명 리뷰 / Blind-style anonymous reviews */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-300 flex items-center gap-1">
                <MessageSquare size={12} />
                익명 리뷰
                <span className="text-neutral-600 font-normal ml-1">by Blind</span>
              </h4>
              {reviews.map((review, ri) => (
                <div
                  key={ri}
                  className="p-3 bg-neutral-900/80 rounded-lg border border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
                      {review.position}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-emerald-500 flex items-center gap-1 mb-0.5">
                        <ThumbsUp size={9} /> 장점
                      </span>
                      <p className="text-neutral-400">{review.pros}</p>
                    </div>
                    <div>
                      <span className="text-red-400 flex items-center gap-1 mb-0.5">
                        <ThumbsDown size={9} /> 단점
                      </span>
                      <p className="text-neutral-400">{review.cons}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 경력/학력 요건 / Experience/education requirements */}
            {job.experienceRequired && (
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Briefcase size={12} />
                <span>
                  경력: <span className="text-neutral-300">{job.experienceRequired}</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단 레드 액센트 라인 (프리미엄만) / Bottom red accent line (premium only) */}
      {job.tierType === 'PREMIUM' && (
        <div className="h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />
      )}
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function G092Page() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* 글로벌 애니메이션 스타일 / Global animation styles */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* 헤더 / Header */}
      <header className="border-b border-neutral-800 bg-[#141414]/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Netflix 스타일 로고 / Netflix-style logo */}
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-lg shadow-red-600/30">
              <span className="text-white font-black text-lg tracking-tighter">J</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">
                JOB<span className="text-red-500">CHAJA</span>
              </h1>
              <p className="text-[10px] text-neutral-500 -mt-0.5 tracking-widest">
                DISCOVER OPPORTUNITIES
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="hidden sm:inline">{designInfo.id}</span>
            <span className="px-2 py-1 bg-neutral-800 rounded text-neutral-500 text-[10px]">
              {designInfo.author}
            </span>
          </div>
        </div>
      </header>

      {/* 서브 헤더 / Sub header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">
              채용 공고 <span className="text-red-500">{sampleJobsV2.length}</span>
            </h2>
            <p className="text-sm text-neutral-500">
              회사명을 클릭하면 블러가 해제됩니다. 카드를 확장하면 급여 분석과 익명 리뷰를 확인할 수 있습니다.
            </p>
          </div>
          {/* 범례 / Legend */}
          <div className="flex items-center gap-3 text-[10px] text-neutral-500">
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-600 rounded flex items-center justify-center text-white text-[8px] font-black">
                N
              </div>
              프리미엄
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-neutral-600 blur-[2px]" />
              블러 = 미확인
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 size={10} />
              급여 분석
            </span>
          </div>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          {sampleJobsV2.map((job, index) => (
            <NetflixBlindCard key={job.id} job={job} index={index} />
          ))}
        </div>
      </div>

      {/* 푸터 / Footer */}
      <footer className="border-t border-neutral-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-[11px] text-neutral-600">
            {designInfo.id} &middot; {designInfo.name} &middot; by {designInfo.author}
          </p>
          <p className="text-[10px] text-neutral-700 mt-1">
            Netflix card expansion + Blind blur anonymity + Glassdoor salary charts
          </p>
        </div>
      </footer>
    </div>
  );
}
