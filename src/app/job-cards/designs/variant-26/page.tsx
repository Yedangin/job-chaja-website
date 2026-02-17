'use client';

// 시안 26: 투톤 스플릿 카드 / Variant 26: Two-Tone Split Card
// 대각선 분할로 다크존(회사정보) + 라이트존(상세정보) — 패션 브랜드 룩북 스타일
// Diagonal split into dark zone (company info) + light zone (details) — fashion brand lookbook style

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  Crown,
  Zap,
  MapPin,
  Briefcase,
  Shield,
  Clock,
  Users,
  Eye,
  DollarSign,
  Star,
  ChevronRight,
  Sparkles,
  Building2,
  Timer,
} from 'lucide-react';

// 업종별 다크존 색상 매핑 / Industry-based dark zone color mapping
function getIndustryColors(industry: string): {
  darkBg: string;
  darkGradient: string;
  accent: string;
  accentBorder: string;
  lightAccent: string;
} {
  const colorMap: Record<string, {
    darkBg: string;
    darkGradient: string;
    accent: string;
    accentBorder: string;
    lightAccent: string;
  }> = {
    '제조': {
      darkBg: 'bg-slate-900',
      darkGradient: 'from-slate-900 via-slate-800 to-slate-900',
      accent: 'text-cyan-400',
      accentBorder: 'border-cyan-400/30',
      lightAccent: 'text-cyan-600',
    },
    '숙박/음식': {
      darkBg: 'bg-stone-900',
      darkGradient: 'from-stone-900 via-stone-800 to-stone-900',
      accent: 'text-orange-400',
      accentBorder: 'border-orange-400/30',
      lightAccent: 'text-orange-600',
    },
    'IT/소프트웨어': {
      darkBg: 'bg-indigo-950',
      darkGradient: 'from-indigo-950 via-indigo-900 to-indigo-950',
      accent: 'text-violet-400',
      accentBorder: 'border-violet-400/30',
      lightAccent: 'text-violet-600',
    },
    '건설': {
      darkBg: 'bg-zinc-900',
      darkGradient: 'from-zinc-900 via-zinc-800 to-zinc-900',
      accent: 'text-amber-400',
      accentBorder: 'border-amber-400/30',
      lightAccent: 'text-amber-600',
    },
    '물류/운송': {
      darkBg: 'bg-gray-900',
      darkGradient: 'from-gray-900 via-gray-800 to-gray-900',
      accent: 'text-emerald-400',
      accentBorder: 'border-emerald-400/30',
      lightAccent: 'text-emerald-600',
    },
    '교육': {
      darkBg: 'bg-blue-950',
      darkGradient: 'from-blue-950 via-blue-900 to-blue-950',
      accent: 'text-sky-400',
      accentBorder: 'border-sky-400/30',
      lightAccent: 'text-sky-600',
    },
  };

  return colorMap[industry] ?? {
    darkBg: 'bg-gray-900',
    darkGradient: 'from-gray-900 via-gray-800 to-gray-900',
    accent: 'text-blue-400',
    accentBorder: 'border-blue-400/30',
    lightAccent: 'text-blue-600',
  };
}

// 투톤 스플릿 카드 컴포넌트 / Two-tone split card component
function TwoToneSplitCard({ job }: { job: MockJobPosting }) {
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const isPremium = job.tierType === 'PREMIUM';
  const isClosed = dDay === '마감';
  const colors = getIndustryColors(job.industry);
  const matchScore = job.matchScore ?? 0;

  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1 cursor-pointer group
        ${isClosed ? 'opacity-50' : ''}
        ${isPremium ? 'ring-2 ring-amber-400/40' : 'ring-1 ring-gray-200'}
      `}
      style={{ minHeight: '320px' }}
    >
      {/* 프리미엄 골드 스플릿 라인 / Premium gold split line */}
      {isPremium && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            // 대각선 골드 라인 / Diagonal gold line
            background: 'linear-gradient(152deg, transparent calc(50% - 2px), #fbbf24 calc(50% - 2px), #f59e0b 50%, #fbbf24 calc(50% + 2px), transparent calc(50% + 2px))',
          }}
        />
      )}

      {/* 다크존 (상단 대각선) — 회사 정보 / Dark zone (top diagonal) — company info */}
      <div
        className={`
          relative bg-gradient-to-br ${colors.darkGradient}
          overflow-hidden
        `}
        style={{
          // 대각선 클리핑 — 상단 영역 / Diagonal clipping — top area
          clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 70%)',
          paddingBottom: '60px',
        }}
      >
        {/* 배경 장식 패턴 (미묘한 기하학) / Background decorative pattern (subtle geometry) */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(255,255,255,0.1) 20px,
                rgba(255,255,255,0.1) 21px
              )`,
            }}
          />
        </div>

        <div className="relative z-20 p-5 pb-0">
          {/* 상단 배지 행 / Top badge row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isPremium && (
                <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm">
                  <Crown className="w-3 h-3" />
                  PREMIUM
                </span>
              )}
              {job.isUrgent && (
                <span className="inline-flex items-center gap-1 bg-red-500/20 border border-red-400/40 text-red-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm">
                  <Zap className="w-3 h-3" />
                  긴급
                </span>
              )}
              {job.isFeatured && (
                <span className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-400/40 text-purple-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm">
                  <Star className="w-3 h-3" />
                  추천
                </span>
              )}
            </div>
            {/* 업종 라벨 / Industry label */}
            <span className={`text-[10px] font-medium ${colors.accent} opacity-70`}>
              {job.industry}
            </span>
          </div>

          {/* 회사명 / Company name */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg bg-white/10 border ${colors.accentBorder} flex items-center justify-center`}>
              <Building2 className={`w-4 h-4 ${colors.accent}`} />
            </div>
            <span className="text-sm font-medium text-white/80">{job.company}</span>
          </div>

          {/* 공고 제목 (다크존의 메인 텍스트) / Job title (dark zone main text) */}
          <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-white/90 transition-colors mb-3">
            {job.title}
          </h3>

          {/* 위치 + 시간 / Location + time */}
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>
        </div>
      </div>

      {/* 라이트존 (하단 대각선) — 상세 정보 / Light zone (bottom diagonal) — details */}
      <div
        className="relative bg-white"
        style={{
          // 대각선 클리핑 — 하단 영역 / Diagonal clipping — bottom area
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          marginTop: '-40px',
          paddingTop: '10px',
        }}
      >
        <div className="px-5 pb-5">
          {/* 핵심 정보 그리드 / Key info grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* 급여 / Salary */}
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <DollarSign className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
              <p className="text-[10px] text-gray-400 mb-0.5">급여 / Salary</p>
              <p className="text-xs font-bold text-gray-800 leading-tight">{salary}</p>
            </div>

            {/* 고용형태 / Employment type */}
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <Briefcase className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
              <p className="text-[10px] text-gray-400 mb-0.5">고용 / Type</p>
              <p className="text-xs font-bold text-gray-800">
                {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
              </p>
            </div>

            {/* 매칭 점수 / Match score */}
            <div className={`rounded-lg p-2.5 text-center ${
              matchScore >= 90 ? 'bg-emerald-50' :
              matchScore >= 70 ? 'bg-blue-50' :
              matchScore >= 50 ? 'bg-amber-50' :
              'bg-red-50'
            }`}>
              <Sparkles className={`w-3.5 h-3.5 mx-auto mb-1 ${
                matchScore >= 90 ? 'text-emerald-400' :
                matchScore >= 70 ? 'text-blue-400' :
                matchScore >= 50 ? 'text-amber-400' :
                'text-red-400'
              }`} />
              <p className="text-[10px] text-gray-400 mb-0.5">매칭 / Match</p>
              <p className={`text-xs font-bold ${
                matchScore >= 90 ? 'text-emerald-700' :
                matchScore >= 70 ? 'text-blue-700' :
                matchScore >= 50 ? 'text-amber-700' :
                'text-red-700'
              }`}>
                {matchScore}%
              </p>
            </div>
          </div>

          {/* 비자 배지 / Visa badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            <Shield className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            {job.allowedVisas.map((visa) => (
              <span
                key={visa}
                className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100"
              >
                {visa}
              </span>
            ))}
          </div>

          {/* 복리후생 칩 / Benefits chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.benefits.slice(0, 4).map((benefit) => (
              <span
                key={benefit}
                className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 4 && (
              <span className="text-[10px] text-gray-400 font-medium px-1">
                +{job.benefits.length - 4}
              </span>
            )}
          </div>

          {/* 하단 행: 통계 + D-day + CTA / Bottom row: stats + D-day + CTA */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {/* 통계 / Stats */}
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-0.5">
                <Users className="w-3 h-3" />
                {job.applicantCount}명 지원
              </span>
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                {job.viewCount.toLocaleString()}
              </span>
            </div>

            {/* D-day + 화살표 / D-day + arrow */}
            <div className="flex items-center gap-2">
              {dDay && (
                <span className={`text-[10px] font-bold ${
                  dDay === '마감' ? 'text-gray-300' :
                  dDay === 'D-Day' ? 'text-red-500' :
                  dDay === '상시모집' ? 'text-emerald-500' :
                  'text-blue-500'
                }`}>
                  {dDay === '마감' ? (
                    <span className="flex items-center gap-0.5">
                      <Timer className="w-3 h-3" />
                      마감
                    </span>
                  ) : (
                    dDay
                  )}
                </span>
              )}
              <ChevronRight className={`w-4 h-4 ${colors.lightAccent} group-hover:translate-x-0.5 transition-transform`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant26Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 페이지 헤더 / Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                시안 26: Two-Tone Split Card
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                대각선 분할 투톤 — 다크존(회사/제목) + 라이트존(상세정보), 업종별 색상
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Diagonal split two-tone — dark zone (company/title) + light zone (details), industry-colored
              </p>
            </div>
            {/* 업종 색상 미리보기 / Industry color preview */}
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400">
              <span>업종별 색상:</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-slate-900" title="제조" />
                <div className="w-3 h-3 rounded-full bg-stone-900" title="숙박/음식" />
                <div className="w-3 h-3 rounded-full bg-indigo-950" title="IT/소프트웨어" />
                <div className="w-3 h-3 rounded-full bg-zinc-900" title="건설" />
                <div className="w-3 h-3 rounded-full bg-gray-900" title="물류/운송" />
                <div className="w-3 h-3 rounded-full bg-blue-950" title="교육" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobs.map((job) => (
            <TwoToneSplitCard key={job.id} job={job} />
          ))}
        </div>

        {/* 하단 범례 / Bottom legend */}
        <div className="mt-8 bg-white rounded-xl p-5 shadow-sm ring-1 ring-gray-100">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
            디자인 범례 / Design Legend
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 스플릿 설명 / Split explanation */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">분할 구조 / Split Structure</p>
              <div className="flex flex-col gap-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded bg-gradient-to-r from-gray-800 to-gray-900" />
                  <span>다크존: 회사 정보 + 제목 / Dark zone: Company + Title</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded bg-white border border-gray-200" />
                  <span>라이트존: 급여, 비자, 복리후생 / Light zone: Salary, Visa, Benefits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 rounded bg-gradient-to-r from-amber-400 to-amber-500" />
                  <span>프리미엄 골드 스플릿 라인 / Premium gold split line</span>
                </div>
              </div>
            </div>

            {/* 업종별 색상 / Industry colors */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">업종별 다크존 색상 / Industry Dark Zone Colors</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-900 flex-shrink-0" />
                  <span>제조 / Manufacturing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-stone-900 flex-shrink-0" />
                  <span>숙박/음식 / Hospitality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-indigo-950 flex-shrink-0" />
                  <span>IT/소프트웨어 / IT/Software</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-zinc-900 flex-shrink-0" />
                  <span>건설 / Construction</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-900 flex-shrink-0" />
                  <span>물류/운송 / Logistics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-950 flex-shrink-0" />
                  <span>교육 / Education</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
