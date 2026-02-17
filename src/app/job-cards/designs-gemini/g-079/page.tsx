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
  EyeOff,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Users,
  TrendingUp,
  Shield,
  Code,
  Zap,
  Award,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Building2,
} from 'lucide-react';

// 디자인 메타정보 / Design metadata
const designInfo = {
  id: 'g-079',
  name: '블라인드×잡플래닛×점핏',
  category: 'unique',
  author: 'Gemini',
};

// 블라인드 스타일 익명 평점 카테고리 / Blind-style anonymous rating categories
const ratingCategories = [
  { label: '업무/삶 균형', labelEn: 'Work-Life Balance', icon: Clock },
  { label: '급여/복지', labelEn: 'Compensation', icon: TrendingUp },
  { label: '경영진', labelEn: 'Management', icon: Shield },
  { label: '문화/분위기', labelEn: 'Culture', icon: MessageSquare },
  { label: '커리어성장', labelEn: 'Career Growth', icon: Award },
];

// 점핏 스타일 기술 스택 태그 / Jumpit-style tech stack tags
const techStackMap: Record<string, string[]> = {
  '제조': ['PLC', 'AutoCAD', '품질관리', 'SPC', '6시그마'],
  '숙박/음식': ['HACCP', '위생관리', '일식조리', 'POS', '재고관리'],
  'IT/소프트웨어': ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
  '건설': ['AutoCAD', '안전관리', '철근공사', 'BIM', '측량'],
  '물류/운송': ['WMS', '지게차', '바코드', 'SCM', '재고관리'],
};

// 기술 스택 배지 색상 / Tech stack badge colors
const stackColors = [
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/30',
];

// 시드 기반 평점 생성 (일관된 점수) / Seed-based rating generation (consistent scores)
function generateRatings(jobId: string): number[] {
  let seed = 0;
  for (let i = 0; i < jobId.length; i++) {
    seed += jobId.charCodeAt(i);
  }
  return ratingCategories.map((_, idx) => {
    const val = ((seed * (idx + 3) * 7 + 13) % 30 + 25) / 10;
    return Math.round(val * 10) / 10;
  });
}

// 전체 평점 평균 / Overall rating average
function getOverallRating(ratings: number[]): number {
  const sum = ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

// 별점 렌더 컴포넌트 / Star rating render component
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const full = Math.floor(rating);
  const partial = rating - full;
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`relative ${starSize}`}>
          {/* 배경 빈 별 / Background empty star */}
          <Star className={`absolute inset-0 ${starSize} text-neutral-600 fill-neutral-700`} />
          {/* 채워진 별 / Filled star */}
          {i < full && (
            <Star className={`absolute inset-0 ${starSize} text-emerald-400 fill-emerald-400`} />
          )}
          {/* 부분 별 / Partial star */}
          {i === full && partial > 0 && (
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${partial * 100}%` }}>
              <Star className={`${starSize} text-emerald-400 fill-emerald-400`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 개별 잡카드 컴포넌트 / Individual job card component
function BlindJobPlanetCard({ job }: { job: MockJobPostingV2 }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hoveredStack, setHoveredStack] = useState<number | null>(null);
  const [showAllRatings, setShowAllRatings] = useState(false);

  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const ratings = generateRatings(job.id);
  const overall = getOverallRating(ratings);
  const stacks = techStackMap[job.industry] || ['일반업무', '현장관리', '팀워크'];

  // 추천 지수 (matchScore 기반) / Recommendation index (based on matchScore)
  const recommendPercent = job.matchScore || 70;

  return (
    <div className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]">
      {/* 상단 헤더: 블라인드 스타일 익명 + 잡플래닛 평점 / Top header: Blind anonymous + JobPlanet rating */}
      <div className="relative p-5 pb-4">
        {/* 프리미엄/긴급 배지 / Premium/Urgent badges */}
        <div className="flex items-center gap-2 mb-3">
          {job.tierType === 'PREMIUM' && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full tracking-wider uppercase">
              Premium
            </span>
          )}
          {job.isUrgent && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full tracking-wider uppercase">
              Urgent
            </span>
          )}
          {dday && (
            <span className={`ml-auto px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
              dday === '마감' ? 'bg-neutral-700 text-neutral-400' :
              dday === 'D-Day' ? 'bg-rose-500/20 text-rose-400 animate-pulse' :
              'bg-neutral-800 text-neutral-300'
            }`}>
              {dday}
            </span>
          )}
        </div>

        {/* 회사 정보: 블라인드 스타일 블러 / Company info: Blind-style blur */}
        <div className="flex items-start gap-4 mb-4">
          {/* 회사 이니셜 아바타 / Company initial avatar */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-all duration-700 ${
              isRevealed
                ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'
                : 'bg-neutral-800 text-neutral-500'
            }`}
          >
            {isRevealed ? job.companyInitial : '?'}
          </div>

          <div className="flex-1 min-w-0">
            {/* 블러된 회사명 (호버로 해제) / Blurred company name (reveal on hover) */}
            <div className="relative mb-1">
              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="flex items-center gap-2 group/reveal"
              >
                <h3
                  className={`text-sm font-bold transition-all duration-700 ${
                    isRevealed
                      ? 'text-white blur-0'
                      : 'text-neutral-400 blur-[6px] select-none'
                  }`}
                >
                  {job.company}
                </h3>
                {isRevealed ? (
                  <Eye className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-neutral-500 group-hover/reveal:text-emerald-400 transition-colors flex-shrink-0" />
                )}
              </button>
              {!isRevealed && (
                <p className="text-[10px] text-neutral-600 mt-0.5">
                  클릭하여 기업명 공개 / Click to reveal
                </p>
              )}
            </div>

            {/* 잡플래닛 스타일 전체 평점 / JobPlanet-style overall rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={overall} size="sm" />
              <span className="text-emerald-400 font-bold text-sm">{overall}</span>
              <span className="text-neutral-600 text-[10px]">/ 5.0</span>
              <span className="text-neutral-600 text-[10px]">
                ({Math.floor(job.viewCount / 10)}개 리뷰)
              </span>
            </div>
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h2 className="text-base font-bold text-white leading-snug mb-3 line-clamp-2 group-hover:text-emerald-300 transition-colors duration-300">
          {job.title}
        </h2>

        {/* 기본 정보 행 / Basic info row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-neutral-400 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-500" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-neutral-500" />
            {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-500" />
            {job.workHours || '협의'}
          </span>
        </div>

        {/* 급여 표시 / Salary display */}
        <div className="flex items-center justify-between bg-neutral-800/60 rounded-xl px-4 py-2.5 mb-4">
          <span className="text-emerald-400 font-bold text-sm">{salary}</span>
          <div className="flex items-center gap-1 text-[10px] text-neutral-500">
            <Users className="w-3 h-3" />
            지원 {job.applicantCount}명
          </div>
        </div>
      </div>

      {/* 잡플래닛 평점 상세 (펼침) / JobPlanet detailed ratings (expandable) */}
      <div className="px-5 pb-4">
        <button
          onClick={() => setShowAllRatings(!showAllRatings)}
          className="flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-emerald-400 transition-colors mb-3"
        >
          <Star className="w-3 h-3" />
          <span>기업 평가 상세보기</span>
          <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${showAllRatings ? 'rotate-90' : ''}`} />
        </button>

        <div
          className={`grid transition-all duration-500 overflow-hidden ${
            showAllRatings ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-2.5 pb-4">
              {ratingCategories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.label} className="flex items-center gap-3">
                    <Icon className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                    <span className="text-[11px] text-neutral-400 w-16 flex-shrink-0">{cat.label}</span>
                    {/* 바 차트 / Bar chart */}
                    <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700"
                        style={{
                          width: showAllRatings ? `${(ratings[idx] / 5) * 100}%` : '0%',
                          transitionDelay: `${idx * 100}ms`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 w-7 text-right">
                      {ratings[idx]}
                    </span>
                  </div>
                );
              })}

              {/* 추천 지수 / Recommendation index */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-800">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-neutral-300">이 기업을 추천합니다</span>
                <span className="ml-auto text-sm font-bold text-emerald-400">{recommendPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 점핏 스타일 기술 스택 배지 / Jumpit-style tech stack badges */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Code className="w-3 h-3 text-neutral-500" />
          <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
            Required Skills
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {stacks.map((stack, idx) => (
            <span
              key={stack}
              onMouseEnter={() => setHoveredStack(idx)}
              onMouseLeave={() => setHoveredStack(null)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all duration-300 cursor-default ${
                stackColors[idx % stackColors.length]
              } ${
                hoveredStack === idx
                  ? 'scale-110 shadow-lg shadow-emerald-500/10'
                  : hoveredStack !== null
                    ? 'opacity-50 scale-95'
                    : ''
              }`}
              style={{
                transitionDelay: hoveredStack === null ? `${idx * 50}ms` : '0ms',
              }}
            >
              {stack}
            </span>
          ))}
        </div>
      </div>

      {/* 비자 호환 배지 / Visa compatibility badges */}
      <div className="px-5 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {job.allowedVisas.map((visa) => {
            const color = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${color.bg} ${color.text} opacity-80 group-hover:opacity-100 transition-opacity`}
              >
                {visa}
              </span>
            );
          })}
        </div>
      </div>

      {/* 복리후생 / Benefits */}
      <div className="px-5 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {job.benefits.slice(0, 4).map((benefit) => (
            <span
              key={benefit}
              className="px-2 py-0.5 text-[10px] text-neutral-400 bg-neutral-800/50 rounded-md border border-neutral-700/50"
            >
              {benefit}
            </span>
          ))}
          {job.benefits.length > 4 && (
            <span className="px-2 py-0.5 text-[10px] text-neutral-500 bg-neutral-800/30 rounded-md">
              +{job.benefits.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* 하단: 매치 스코어 + CTA / Bottom: Match score + CTA */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
          {/* 매칭 스코어 / Match score */}
          {job.matchScore && (
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-1000 group-hover:w-full"
                    style={{ width: `${job.matchScore}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  {job.matchScore}%
                </span>
              </div>
            </div>
          )}

          {/* CTA 버튼 / CTA button */}
          <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
            <span>상세보기</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 호버 시 좌측 그라데이션 보더 / Hover left gradient border */}
      <div className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-emerald-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G079BlindJobPlanetJumpitPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* 헤더 / Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-black text-white tracking-tight ml-1.5">
                  Job<span className="text-emerald-400">ChaJa</span>
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-neutral-800/50 rounded-full">
                <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">
                  Blind
                </span>
                <span className="text-neutral-600">x</span>
                <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">
                  JobPlanet
                </span>
                <span className="text-neutral-600">x</span>
                <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">
                  Jumpit
                </span>
              </div>
            </div>

            {/* 디자인 정보 / Design info */}
            <div className="flex items-center gap-3 text-[10px] text-neutral-500">
              <span className="px-2 py-0.5 bg-neutral-800 rounded-full">
                {designInfo.id}
              </span>
              <span className="hidden sm:inline">{designInfo.category}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 페이지 타이틀 / Page title */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-2">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
            Company Reviews + Job Listings
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
          익명 기업 리뷰 기반 채용
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl">
          블라인드의 익명 기업 평가, 잡플래닛의 상세 평점, 점핏의 기술 스택 매칭을 하나로 통합한 종합 기업 채용 카드
        </p>

        {/* 기능 설명 칩 / Feature description chips */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            { icon: EyeOff, label: '블러 해제', desc: 'Blind 스타일' },
            { icon: Star, label: '별점 평가', desc: 'JobPlanet 스타일' },
            { icon: Code, label: '스택 배지', desc: 'Jumpit 스타일' },
          ].map((feat) => (
            <div
              key={feat.label}
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full"
            >
              <feat.icon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-white">{feat.label}</span>
              <span className="text-[10px] text-neutral-500">{feat.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 카드 그리드 / Card grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sampleJobsV2.map((job) => (
            <BlindJobPlanetCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* 푸터 / Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[10px] text-neutral-600">
            Design {designInfo.id} &middot; {designInfo.name} &middot; {designInfo.category} &middot; by {designInfo.author}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-neutral-600">
            <span>블라인드 익명 + 잡플래닛 평점 + 점핏 기술스택</span>
          </div>
        </div>
      </footer>
    </div>
  );
}