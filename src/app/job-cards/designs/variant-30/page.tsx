'use client';

// 시안 30: 리본 / 배너 카드 / Variant 30: Ribbon / Banner Card
// 장식 리본, 배너 스트립, 코너 리본 — 상장/선물 포장 미학
// Decorative ribbons, banner strips, corner ribbons — certificate/gift wrapping aesthetic

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  Crown,
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Eye,
  Briefcase,
  Star,
  Shield,
  BadgeCheck,
  Award,
  ChevronRight,
  Calendar,
} from 'lucide-react';

// 산업별 색상 테마 / Industry color themes
function getIndustryTheme(industry: string): {
  primary: string;
  primaryBg: string;
  primaryText: string;
  gradient: string;
  border: string;
  light: string;
  pattern: string;
} {
  const themes: Record<string, {
    primary: string;
    primaryBg: string;
    primaryText: string;
    gradient: string;
    border: string;
    light: string;
    pattern: string;
  }> = {
    '제조': {
      primary: '#2563eb',
      primaryBg: 'bg-blue-600',
      primaryText: 'text-blue-700',
      gradient: 'from-blue-600 to-blue-800',
      border: 'border-blue-200',
      light: 'bg-blue-50',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
    },
    '숙박/음식': {
      primary: '#ea580c',
      primaryBg: 'bg-orange-600',
      primaryText: 'text-orange-700',
      gradient: 'from-orange-500 to-orange-700',
      border: 'border-orange-200',
      light: 'bg-orange-50',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px)',
    },
    'IT/소프트웨어': {
      primary: '#7c3aed',
      primaryBg: 'bg-violet-600',
      primaryText: 'text-violet-700',
      gradient: 'from-violet-600 to-purple-800',
      border: 'border-violet-200',
      light: 'bg-violet-50',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.15) 6px, rgba(255,255,255,0.15) 12px)',
    },
    '건설': {
      primary: '#d97706',
      primaryBg: 'bg-amber-600',
      primaryText: 'text-amber-700',
      gradient: 'from-amber-500 to-amber-700',
      border: 'border-amber-200',
      light: 'bg-amber-50',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.1) 12px, rgba(255,255,255,0.1) 24px)',
    },
    '물류/운송': {
      primary: '#0d9488',
      primaryBg: 'bg-teal-600',
      primaryText: 'text-teal-700',
      gradient: 'from-teal-500 to-teal-700',
      border: 'border-teal-200',
      light: 'bg-teal-50',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.12) 10px, rgba(255,255,255,0.12) 20px)',
    },
    '교육': {
      primary: '#059669',
      primaryBg: 'bg-emerald-600',
      primaryText: 'text-emerald-700',
      gradient: 'from-emerald-500 to-emerald-700',
      border: 'border-emerald-200',
      light: 'bg-emerald-50',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px)',
    },
  };
  return themes[industry] || {
    primary: '#6b7280',
    primaryBg: 'bg-gray-600',
    primaryText: 'text-gray-700',
    gradient: 'from-gray-500 to-gray-700',
    border: 'border-gray-200',
    light: 'bg-gray-50',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
  };
}

// 매칭 점수에 따른 색상 / Color based on match score
function getMatchColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-500';
}

// 리본/배너 카드 컴포넌트 / Ribbon/Banner Card component
function RibbonBannerCard({ job }: { job: MockJobPosting }) {
  const theme = getIndustryTheme(job.industry);
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const isPremium = job.tierType === 'PREMIUM';
  const isUrgent = job.isUrgent;

  return (
    <div className="relative group">
      {/* 장식 테두리 / Ornamental border — outer */}
      <div className={`absolute inset-0 rounded-2xl border-2 ${theme.border} opacity-60`} />
      <div className="absolute inset-[3px] rounded-xl border border-gray-200 opacity-40" />

      {/* 메인 카드 / Main card */}
      <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 m-[5px]">

        {/* === 프리미엄 대각선 코너 리본 (좌상단) / Premium diagonal corner ribbon (top-left) === */}
        {isPremium && (
          <div className="absolute top-0 left-0 z-20 overflow-hidden w-28 h-28 pointer-events-none">
            <div
              className="absolute top-[18px] left-[-30px] w-[170px] text-center py-1 shadow-md"
              style={{
                transform: 'rotate(-45deg)',
                background: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
              }}
            >
              <span className="text-white text-[10px] font-black tracking-[0.15em] uppercase flex items-center justify-center gap-1">
                <Crown className="w-3 h-3 inline" />
                PREMIUM
              </span>
            </div>
          </div>
        )}

        {/* === 긴급 대각선 코너 리본 (우상단) / Urgent diagonal corner ribbon (top-right) === */}
        {isUrgent && (
          <div className="absolute top-0 right-0 z-20 overflow-hidden w-28 h-28 pointer-events-none">
            <div
              className="absolute top-[18px] right-[-30px] w-[170px] text-center py-1 shadow-md"
              style={{
                transform: 'rotate(45deg)',
                background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
              }}
            >
              <span className="text-white text-[10px] font-black tracking-[0.15em] uppercase flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3 inline" />
                {/* 긴급 / Urgent */}
                긴급
              </span>
            </div>
          </div>
        )}

        {/* === 상단 배너 스트립 (산업 색상 + 패턴) / Top banner strip (industry color + pattern) === */}
        <div
          className={`relative h-14 bg-gradient-to-r ${theme.gradient} overflow-hidden`}
        >
          {/* 패턴 오버레이 / Pattern overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: theme.pattern }}
          />

          {/* 배너 내용 / Banner content */}
          <div className="relative h-full flex items-center justify-between px-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{job.company}</p>
                <p className="text-white/70 text-[10px]">{job.industry}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* 추천 배지 / Featured badge */}
              {job.isFeatured && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  <span className="text-white text-[10px] font-semibold">
                    {/* 추천 / Featured */}
                    추천
                  </span>
                </div>
              )}
              {/* D-Day 배지 / D-Day badge */}
              <div className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                dDay === '마감' ? 'bg-red-500/80 text-white' :
                dDay === 'D-Day' ? 'bg-red-500/80 text-white animate-pulse' :
                dDay === '상시모집' ? 'bg-white/20 text-white' :
                'bg-white/25 text-white'
              }`}>
                {dDay}
              </div>
            </div>
          </div>

          {/* 배너 하단 삼각 장식 / Banner bottom triangle decoration */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div
              className="w-6 h-3"
              style={{
                background: 'white',
                clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                transform: 'rotate(180deg)',
              }}
            />
          </div>
        </div>

        {/* === 카드 본문 / Card body === */}
        <div className="relative px-5 pt-5 pb-3">
          {/* 공고 제목 / Job title */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug pr-2">
            {job.title}
          </h3>

          {/* 위치 + 근무시간 / Location + work hours */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            {job.workHours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {job.workHours}
              </span>
            )}
            {job.experienceRequired && (
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                {job.experienceRequired}
              </span>
            )}
          </div>

          {/* 복리후생 / Benefits */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.benefits.slice(0, 4).map((benefit) => (
              <span
                key={benefit}
                className={`text-[10px] px-2 py-0.5 rounded-full ${theme.light} ${theme.primaryText} font-medium`}
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                +{job.benefits.length - 4}
              </span>
            )}
          </div>

          {/* === 비자 유형 사이드 리본 (세로 텍스트) / Visa type side ribbons (vertical text) === */}
          <div className="absolute top-14 right-0 flex flex-col gap-1 z-10">
            {job.allowedVisas.slice(0, 3).map((visa) => (
              <div
                key={visa}
                className={`${theme.primaryBg} text-white text-[9px] font-bold px-1.5 py-2 rounded-l-md shadow-sm`}
                style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
              >
                {visa}
              </div>
            ))}
            {job.allowedVisas.length > 3 && (
              <div
                className="bg-gray-400 text-white text-[9px] font-bold px-1.5 py-2 rounded-l-md"
                style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
              >
                +{job.allowedVisas.length - 3}
              </div>
            )}
          </div>

          {/* 통계 행 / Stats row */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {/* 지원자 / Applicants */}
              {job.applicantCount}명 지원
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {/* 조회수 / Views */}
              {job.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {timeAgo}
            </span>
          </div>

          {/* === 인증 도장 / Verified seal/stamp === */}
          {isPremium && (
            <div className="absolute bottom-3 right-5 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
              <div
                className="w-16 h-16 rounded-full border-[3px] flex items-center justify-center"
                style={{
                  borderColor: theme.primary,
                  transform: 'rotate(-15deg)',
                }}
              >
                <div className="text-center">
                  <BadgeCheck
                    className="w-5 h-5 mx-auto"
                    style={{ color: theme.primary }}
                  />
                  <p
                    className="text-[7px] font-black uppercase tracking-wider mt-0.5"
                    style={{ color: theme.primary }}
                  >
                    {/* 인증됨 / Verified */}
                    인증됨
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 매칭 점수 배지 / Match score badge */}
          {job.matchScore !== undefined && (
            <div className="flex items-center gap-1.5">
              <Award className={`w-4 h-4 ${getMatchColor(job.matchScore)}`} />
              <span className={`text-xs font-bold ${getMatchColor(job.matchScore)}`}>
                {/* 매칭 적합도 / Match compatibility */}
                매칭 {job.matchScore}%
              </span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden ml-1">
                <div
                  className={`h-full rounded-full transition-all ${
                    job.matchScore >= 80 ? 'bg-green-500' :
                    job.matchScore >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${job.matchScore}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* === 하단 배너 — 급여 대형 텍스트 / Bottom banner — salary in large text === */}
        <div className={`relative ${theme.light} border-t ${theme.border} px-5 py-3`}>
          {/* 장식 테두리 패턴 / Decorative border pattern */}
          <div className="absolute top-0 left-0 right-0 h-px">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, ${theme.primary} 0px, ${theme.primary} 4px, transparent 4px, transparent 8px)`,
                opacity: 0.3,
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">
                {/* 급여 / Salary */}
                Salary
              </p>
              <p className={`text-lg font-black ${theme.primaryText}`}>
                {salary}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* 고용형태 배지 / Employment type badge */}
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                job.boardType === 'FULL_TIME'
                  ? `${theme.border} ${theme.primaryText}`
                  : 'border-gray-300 text-gray-600'
              }`}>
                {job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'}
              </span>
              {/* 상세보기 버튼 / View details button */}
              <button
                className={`${theme.primaryBg} text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 hover:opacity-90 transition-opacity`}
              >
                {/* 상세보기 / View Details */}
                상세보기
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant30Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-rose-500 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {/* 시안 30: 리본/배너 카드 / Variant 30: Ribbon/Banner Card */}
              Variant 30 -- Ribbon / Banner Card
            </h1>
            <p className="text-sm text-gray-500">
              {/* 장식 리본과 배너 스트립 스타일 채용공고 카드 / Decorative ribbon and banner strip style job cards */}
              Decorative ribbons and banner strips style job listing cards
            </p>
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {sampleJobs.map((job) => (
          <RibbonBannerCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
