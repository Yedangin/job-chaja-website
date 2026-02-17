'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Clock,
  Briefcase,
  Users,
  Eye,
  Star,
  Zap,
  ChevronRight,
  Award,
  Shield,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';

// 디자인 메타정보 / Design meta info
export const designInfo = {
  id: 'g-100',
  title: '잡차자 올인원 (JobChaja All-in-One)',
  description: 'THE FINAL DESIGN — 비자매칭 히어로 + 로고 + 급여 카운트업 + 종합 프리미엄',
  author: 'Gemini',
  category: 'premium' as const,
  tags: ['flagship', 'visa-gauge', 'count-up', 'premium', 'all-in-one', 'final'],
};

// 매칭 점수 색상 / Match score color coding
function getScoreColor(score: number): { stroke: string; bg: string; text: string; label: string; glow: string } {
  if (score >= 85) return { stroke: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600', label: '최적합', glow: 'shadow-emerald-200' };
  if (score >= 70) return { stroke: '#3B82F6', bg: 'bg-blue-50', text: 'text-blue-600', label: '적합', glow: 'shadow-blue-200' };
  if (score >= 50) return { stroke: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-600', label: '보통', glow: 'shadow-amber-200' };
  return { stroke: '#EF4444', bg: 'bg-red-50', text: 'text-red-600', label: '부적합', glow: 'shadow-red-200' };
}

// 급여 숫자 추출 (카운트업 애니메이션용) / Extract salary number for count-up
function getSalaryNumber(job: MockJobPostingV2): number {
  if (job.hourlyWage) return job.hourlyWage;
  if (job.salaryMax) return Math.round(job.salaryMax / 10000);
  if (job.salaryMin) return Math.round(job.salaryMin / 10000);
  return 0;
}

// 급여 단위 / Salary unit label
function getSalaryUnit(job: MockJobPostingV2): string {
  if (job.hourlyWage) return '원/시급';
  if (job.salaryMin || job.salaryMax) return '만원/연봉';
  return '';
}

// easeOutExpo 이징 함수 / easeOutExpo easing function
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// 비자 매칭 게이지 SVG 컴포넌트 / Visa matching gauge SVG component
function MatchGauge({ score, isHovered, size = 88 }: { score: number; isHovered: boolean; size?: number }) {
  const scoreColor = getScoreColor(score);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;
  const [animatedOffset, setAnimatedOffset] = useState(circumference);
  const [displayScore, setDisplayScore] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered) {
      const startTime = performance.now();
      const duration = 1200;
      const startOffset = circumference;
      const startScore = 0;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);

        setAnimatedOffset(startOffset - (startOffset - targetOffset) * easedProgress);
        setDisplayScore(Math.round(startScore + (score - startScore) * easedProgress));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      setAnimatedOffset(circumference);
      setDisplayScore(0);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovered, score, circumference, targetOffset]);

  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* 글로우 이펙트 / Glow effect */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-700 ${isHovered ? `${scoreColor.glow} shadow-lg` : ''}`}
        style={{ filter: isHovered ? `drop-shadow(0 0 8px ${scoreColor.stroke}40)` : 'none' }}
      />
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 배경 트랙 / Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="5"
          className="transition-all duration-500"
        />
        {/* 진행 아크 / Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={scoreColor.stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          className="transition-colors duration-500"
        />
      </svg>
      {/* 중앙 점수 표시 / Center score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-black transition-all duration-500 ${scoreColor.text}`}
          style={{ fontSize: size * 0.28, lineHeight: 1 }}
        >
          {isHovered ? displayScore : '—'}
        </span>
        <span className="text-[9px] text-gray-400 font-medium mt-0.5">
          {isHovered ? scoreColor.label : 'MATCH'}
        </span>
      </div>
    </div>
  );
}

// 급여 카운트업 컴포넌트 / Salary count-up component
function SalaryCountUp({ target, isHovered, unit }: { target: number; isHovered: boolean; unit: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered && target > 0) {
      const startTime = performance.now();
      const duration = 1000;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        setDisplayValue(Math.round(target * easedProgress));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      setDisplayValue(0);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovered, target]);

  if (target === 0) return <span className="text-gray-400 text-sm">면접 후 결정</span>;

  return (
    <span className="tabular-nums font-black">
      {isHovered ? displayValue.toLocaleString() : target.toLocaleString()}
      <span className="text-xs font-medium text-gray-400 ml-1">{unit}</span>
    </span>
  );
}

// 메인 카드 컴포넌트 / Main card component
function JobCardG100({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dDay = getDDay(job.closingDate);
  const scoreColor = getScoreColor(job.matchScore || 0);
  const salaryNumber = getSalaryNumber(job);
  const salaryUnit = getSalaryUnit(job);
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div
      className="group relative w-full max-w-[380px] rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
      style={{
        boxShadow: isHovered
          ? '0 24px 48px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(99, 102, 241, 0.1)'
          : '0 4px 16px -4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 프리미엄 상단 그라데이션 바 / Premium top gradient bar */}
      <div
        className={`h-1 w-full transition-all duration-500 ${
          isPremium
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
        }`}
        style={{ opacity: isHovered ? 1 : 0.7 }}
      />

      {/* 메인 컨테이너 / Main container */}
      <div className="bg-white relative">
        {/* 호버 시 배경 그라데이션 / Hover background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-transparent to-purple-50/30 transition-opacity duration-700"
          style={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* 상단: 산업 이미지 영역 / Top: Industry image area */}
        <div className="relative h-36 overflow-hidden">
          {!imgError ? (
            <img
              src={job.industryImage}
              alt={job.industry}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
          )}
          {/* 이미지 오버레이 / Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* 왼쪽 상단: 배지 영역 / Top-left: Badge area */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {isPremium && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-[10px] font-bold text-amber-900 shadow-lg">
                <Sparkles className="w-3 h-3" />
                PREMIUM
              </span>
            )}
            {job.isUrgent && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                <Zap className="w-3 h-3" />
                긴급
              </span>
            )}
            {job.isFeatured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-lg">
                <Star className="w-3 h-3 fill-current" />
                추천
              </span>
            )}
          </div>

          {/* 오른쪽 상단: D-Day / Top-right: D-Day */}
          <div className="absolute top-3 right-3">
            {dDay && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${
                  dDay === '마감'
                    ? 'bg-gray-800/80 text-gray-300'
                    : dDay === 'D-Day'
                    ? 'bg-red-500/90 text-white animate-pulse'
                    : dDay === '상시모집'
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-white/90 text-gray-800'
                }`}
              >
                {dDay}
              </span>
            )}
          </div>

          {/* 이미지 하단: 비자 매칭 게이지 + 로고 / Bottom: Visa gauge + Logo */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
            {/* 로고 / Logo */}
            <div
              className="relative transition-all duration-500"
              style={{
                transform: isHovered ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
              }}
            >
              <div
                className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white bg-white shadow-xl flex items-center justify-center"
                style={{
                  boxShadow: isHovered
                    ? '0 8px 24px -4px rgba(0,0,0,0.3)'
                    : '0 4px 12px -2px rgba(0,0,0,0.15)',
                }}
              >
                {!logoError ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-10 h-10 object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-xl font-black text-indigo-500">
                    {job.companyInitial}
                  </span>
                )}
              </div>
              {/* 인증 배지 / Verified badge */}
              {isPremium && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white shadow-md">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* 비자 매칭 게이지 / Visa matching gauge */}
            <div className="transition-all duration-500" style={{ transform: isHovered ? 'translateY(-4px)' : '' }}>
              <MatchGauge score={job.matchScore || 0} isHovered={isHovered} size={80} />
            </div>
          </div>
        </div>

        {/* 콘텐츠 영역 / Content area */}
        <div className="relative p-4 pt-3">
          {/* 회사명 + 산업 / Company name + Industry */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-indigo-500 truncate">{job.company}</span>
            <span className="text-gray-300">·</span>
            <span className="text-[11px] text-gray-400">{job.industry}</span>
          </div>

          {/* 공고 제목 / Job title */}
          <h3
            className="text-[15px] font-bold text-gray-900 leading-snug mb-3 line-clamp-2 transition-colors duration-300"
            style={{ color: isHovered ? '#4338CA' : '#111827' }}
          >
            {job.title}
          </h3>

          {/* 급여 히어로 / Salary hero */}
          <div
            className={`rounded-xl px-3.5 py-2.5 mb-3 transition-all duration-500 ${
              isHovered
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100'
                : 'bg-gray-50 border border-gray-100'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <TrendingUp
                  className={`w-4 h-4 transition-colors duration-500 ${
                    isHovered ? 'text-indigo-500' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xl transition-colors duration-500 ${
                    isHovered ? 'text-indigo-700' : 'text-gray-800'
                  }`}
                >
                  <SalaryCountUp target={salaryNumber} isHovered={isHovered} unit={salaryUnit} />
                </span>
              </div>
              {/* 고용형태 / Employment type */}
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  job.boardType === 'FULL_TIME'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
              </span>
            </div>
            {/* 정적 급여 표시 (호버 전) / Static salary display (before hover) */}
            {!isHovered && (
              <p className="text-xs text-gray-500 mt-0.5">{formatSalary(job)}</p>
            )}
          </div>

          {/* 정보 행 / Info row */}
          <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {job.location}
            </span>
            {job.workHours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {job.workHours.length > 14 ? job.workHours.slice(0, 14) + '...' : job.workHours}
              </span>
            )}
          </div>

          {/* 비자 배지 / Visa badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {job.allowedVisas.map((visa) => {
              const vc = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${vc.bg} ${vc.text} transition-all duration-300`}
                  style={{
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isHovered ? '0 2px 8px -2px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {visa}
                </span>
              );
            })}
          </div>

          {/* 복리후생 / Benefits */}
          <div
            className="overflow-hidden transition-all duration-500"
            style={{
              maxHeight: isHovered ? '60px' : '0px',
              opacity: isHovered ? 1 : 0,
              marginBottom: isHovered ? '12px' : '0px',
            }}
          >
            <div className="flex flex-wrap gap-1.5">
              {job.benefits.slice(0, 4).map((benefit) => (
                <span
                  key={benefit}
                  className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-600 font-medium"
                >
                  {benefit}
                </span>
              ))}
              {job.benefits.length > 4 && (
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-400 font-medium">
                  +{job.benefits.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* 경력/조회/지원자 / Experience/Views/Applicants */}
          {job.experienceRequired && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-3">
              <Briefcase className="w-3 h-3" />
              <span>{job.experienceRequired}</span>
            </div>
          )}

          {/* 하단 구분선 / Bottom divider */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between">
              {/* 지원자/조회수 / Applicants & Views */}
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  지원 {job.applicantCount}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {job.viewCount.toLocaleString()}
                </span>
              </div>

              {/* 매칭 점수 인라인 / Inline match score */}
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all duration-500 ${
                  isHovered ? `${scoreColor.bg} ${scoreColor.text}` : 'bg-gray-50 text-gray-400'
                }`}
              >
                <Shield className="w-3 h-3" />
                {isHovered ? `매칭 ${job.matchScore}%` : '매칭 분석'}
              </div>
            </div>
          </div>
        </div>

        {/* 호버 오버레이: 지원하기 CTA / Hover overlay: Apply CTA */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            background: isHovered
              ? 'linear-gradient(to top, rgba(67, 56, 202, 0.92) 0%, rgba(67, 56, 202, 0.6) 40%, transparent 100%)'
              : 'transparent',
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center gap-2 transition-all duration-500"
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
              opacity: isHovered ? 1 : 0,
            }}
          >
            {/* 매칭 요약 / Match summary */}
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                비자 {job.allowedVisas.length}개 매칭
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                매칭 {job.matchScore}%
              </div>
            </div>

            {/* 지원하기 버튼 / Apply button */}
            <button
              className="pointer-events-auto w-full py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:bg-indigo-50 hover:shadow-lg active:scale-[0.98]"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              지원하기
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* 스크랩 / Save */}
            <button
              className="pointer-events-auto flex items-center gap-1 text-white/70 text-xs hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Heart className="w-3.5 h-3.5" />
              스크랩
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function G100Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* 히어로 헤더 / Hero header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Design #100 — The Grand Finale
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            잡차자 올인원
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-2">
            JobChaja All-in-One — 비자 매칭 게이지, 급여 카운트업, 프리미엄 로고 디스플레이
          </p>
          <p className="text-sm text-white/60 max-w-xl mx-auto">
            카드 위에 마우스를 올려 비자 매칭 분석, 급여 애니메이션, 지원하기 CTA를 확인하세요
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/50">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> 비자 매칭 엔진</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> 급여 카운트업</span>
            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> 프리미엄 UI</span>
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {sampleJobsV2.map((job) => (
            <JobCardG100 key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* 디자인 정보 푸터 / Design info footer */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold">
                  {designInfo.id.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{designInfo.title}</h3>
              </div>
              <p className="text-sm text-gray-500">{designInfo.description}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="px-2.5 py-1 rounded-full bg-gray-100 font-medium">Author: {designInfo.author}</span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">{designInfo.category}</span>
              {designInfo.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full bg-gray-50 text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
