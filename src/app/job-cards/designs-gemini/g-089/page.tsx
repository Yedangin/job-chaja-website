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
  TrendingUp,
  Sparkles,
  Crown,
  Heart,
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-089',
  name: '원티드×토스×Figma (Wanted×Toss×Figma)',
  description:
    '프리미엄 골드 시머 + 숫자 카운트업 + Figma 4색 프레임 / Premium gold shimmer + count-up numbers + Figma 4-color frame',
  author: 'Gemini',
  category: 'premium',
  references: ['Wanted', 'Toss', 'Figma'],
};

// Figma 4색 / Figma 4 colors
const FIGMA_COLORS = {
  red: '#F24E1E',
  purple: '#A259FF',
  green: '#0ACF83',
  blue: '#1ABCFE',
};

// 카운트업 훅 / Count-up animation hook
function useCountUp(
  target: number,
  duration: number = 1200,
  shouldStart: boolean = false
): number {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) {
      setCurrent(0);
      return;
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo 이징 / easeOutExpo easing
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, shouldStart]);

  return current;
}

// 급여 숫자 추출 (만원 단위) / Extract salary number in 만원 units
function extractSalaryNumber(job: MockJobPostingV2): number {
  if (job.hourlyWage) return job.hourlyWage;
  if (job.salaryMax) return Math.round(job.salaryMax / 10000);
  if (job.salaryMin) return Math.round(job.salaryMin / 10000);
  return 0;
}

// 급여 라벨 / Salary label
function getSalaryLabel(job: MockJobPostingV2): string {
  if (job.hourlyWage) return '원/시';
  return '만원';
}

// 급여 접두사 / Salary prefix
function getSalaryPrefix(job: MockJobPostingV2): string {
  if (job.hourlyWage) return '시급';
  return '연봉 최대';
}

// Figma 노드 코너 컴포넌트 / Figma node corner component
function FigmaCorners({ visible }: { visible: boolean }) {
  const cornerSize = 14;
  const dotSize = 6;

  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* 좌상 - 빨강 / Top-left - Red */}
      <div
        className="absolute rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          top: -dotSize / 2,
          left: -dotSize / 2,
          background: FIGMA_COLORS.red,
          boxShadow: `0 0 6px ${FIGMA_COLORS.red}80`,
        }}
      />
      <div
        className="absolute"
        style={{
          width: cornerSize,
          height: 2,
          top: -1,
          left: 0,
          background: FIGMA_COLORS.red,
        }}
      />
      <div
        className="absolute"
        style={{
          width: 2,
          height: cornerSize,
          top: 0,
          left: -1,
          background: FIGMA_COLORS.red,
        }}
      />

      {/* 우상 - 보라 / Top-right - Purple */}
      <div
        className="absolute rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          top: -dotSize / 2,
          right: -dotSize / 2,
          background: FIGMA_COLORS.purple,
          boxShadow: `0 0 6px ${FIGMA_COLORS.purple}80`,
        }}
      />
      <div
        className="absolute"
        style={{
          width: cornerSize,
          height: 2,
          top: -1,
          right: 0,
          background: FIGMA_COLORS.purple,
        }}
      />
      <div
        className="absolute"
        style={{
          width: 2,
          height: cornerSize,
          top: 0,
          right: -1,
          background: FIGMA_COLORS.purple,
        }}
      />

      {/* 좌하 - 초록 / Bottom-left - Green */}
      <div
        className="absolute rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          bottom: -dotSize / 2,
          left: -dotSize / 2,
          background: FIGMA_COLORS.green,
          boxShadow: `0 0 6px ${FIGMA_COLORS.green}80`,
        }}
      />
      <div
        className="absolute"
        style={{
          width: cornerSize,
          height: 2,
          bottom: -1,
          left: 0,
          background: FIGMA_COLORS.green,
        }}
      />
      <div
        className="absolute"
        style={{
          width: 2,
          height: cornerSize,
          bottom: 0,
          left: -1,
          background: FIGMA_COLORS.green,
        }}
      />

      {/* 우하 - 파랑 / Bottom-right - Blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          bottom: -dotSize / 2,
          right: -dotSize / 2,
          background: FIGMA_COLORS.blue,
          boxShadow: `0 0 6px ${FIGMA_COLORS.blue}80`,
        }}
      />
      <div
        className="absolute"
        style={{
          width: cornerSize,
          height: 2,
          bottom: -1,
          right: 0,
          background: FIGMA_COLORS.blue,
        }}
      />
      <div
        className="absolute"
        style={{
          width: 2,
          height: cornerSize,
          bottom: 0,
          right: -1,
          background: FIGMA_COLORS.blue,
        }}
      />
    </div>
  );
}

// 골드 시머 오버레이 / Gold shimmer overlay
function GoldShimmer({ active }: { active: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl transition-opacity duration-300"
      style={{ opacity: active ? 1 : 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(120deg, transparent 30%, rgba(251, 191, 36, 0.08) 38%, rgba(251, 191, 36, 0.15) 40%, rgba(251, 191, 36, 0.08) 42%, transparent 50%)',
          backgroundSize: '200% 100%',
          animation: active ? 'goldShimmer 2s ease-in-out infinite' : 'none',
        }}
      />
    </div>
  );
}

// 카운트업 급여 표시 컴포넌트 / Count-up salary display component
function CountUpSalary({
  job,
  isHovered,
}: {
  job: MockJobPostingV2;
  isHovered: boolean;
}) {
  const targetNum = extractSalaryNumber(job);
  const countVal = useCountUp(targetNum, 1200, isHovered);
  const label = getSalaryLabel(job);
  const prefix = getSalaryPrefix(job);

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-xs text-gray-400 font-medium">{prefix}</span>
      <span
        className="text-2xl font-black tabular-nums transition-colors duration-300"
        style={{
          color: isHovered ? '#2563EB' : '#1E293B',
          fontFeatureSettings: '"tnum"',
        }}
      >
        {isHovered ? countVal.toLocaleString() : targetNum.toLocaleString()}
      </span>
      <span className="text-sm font-semibold text-gray-500">{label}</span>
    </div>
  );
}

// 잡카드 컴포넌트 / Job card component
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const isPremium = job.tierType === 'PREMIUM';
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);

  // Figma 4색 프레임 보더 그라디언트 / Figma 4-color frame border gradient
  const figmaBorderGradient = `linear-gradient(135deg, ${FIGMA_COLORS.red}, ${FIGMA_COLORS.purple}, ${FIGMA_COLORS.blue}, ${FIGMA_COLORS.green})`;

  return (
    <div
      className="group relative"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Figma 4색 보더 (호버 시) / Figma 4-color border (on hover) */}
      <div
        className="absolute -inset-[2px] rounded-[18px] transition-opacity duration-500"
        style={{
          background: figmaBorderGradient,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* 메인 카드 / Main card */}
      <div
        className="relative bg-white rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          boxShadow: isHovered
            ? '0 20px 60px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.02)'
            : '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
          transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        {/* 골드 시머 (프리미엄만) / Gold shimmer (premium only) */}
        {isPremium && <GoldShimmer active={isHovered} />}

        {/* Figma 노드 코너 / Figma node corners */}
        <FigmaCorners visible={isHovered} />

        {/* 상단 산업 이미지 영역 / Top industry image area */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={job.industryImage}
            alt={job.industry}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          {/* 그라데이션 오버레이 / Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* 프리미엄 배지 (좌상) / Premium badge (top-left) */}
          {isPremium && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[11px] font-bold shadow-lg">
              <Crown size={12} />
              PREMIUM
            </div>
          )}

          {/* 긴급/추천 배지 (우상) / Urgent/Featured badge (top-right) */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {job.isUrgent && (
              <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold shadow-md">
                <Zap size={10} />
                긴급
              </div>
            )}
            {job.isFeatured && (
              <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-blue-500 text-white text-[11px] font-bold shadow-md">
                <Star size={10} fill="currentColor" />
                추천
              </div>
            )}
          </div>

          {/* D-Day 배지 (하단) / D-Day badge (bottom) */}
          {dDay && (
            <div
              className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-bold"
              style={{
                background:
                  dDay === '마감'
                    ? 'rgba(100,100,100,0.85)'
                    : dDay === 'D-Day' || (dDay.startsWith('D-') && parseInt(dDay.slice(2)) <= 3)
                      ? 'rgba(239,68,68,0.9)'
                      : 'rgba(255,255,255,0.9)',
                color:
                  dDay === '마감' || dDay === 'D-Day' || (dDay.startsWith('D-') && parseInt(dDay.slice(2)) <= 3)
                    ? '#fff'
                    : '#1E293B',
              }}
            >
              {dDay}
            </div>
          )}

          {/* 좋아요 버튼 (하단 우측) / Like button (bottom-right) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-200 hover:scale-110"
          >
            <Heart
              size={16}
              className={isLiked ? 'text-red-500' : 'text-gray-400'}
              fill={isLiked ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* 본문 / Body */}
        <div className="p-5">
          {/* 회사 정보 행 / Company info row */}
          <div className="flex items-center gap-3 mb-3">
            {/* 회사 로고 (Wanted 스타일 대형 원형) / Company logo (Wanted-style large circle) */}
            <div
              className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center transition-shadow duration-300"
              style={{
                boxShadow: isHovered
                  ? '0 4px 12px rgba(0,0,0,0.1)'
                  : '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#fff',
              }}
            >
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-lg font-bold text-gray-500">${job.companyInitial}</span>`;
                  }
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500 truncate">
                {job.company}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin size={11} />
                <span>{job.location}</span>
                <span className="mx-0.5">|</span>
                <span>{job.industry}</span>
              </div>
            </div>
          </div>

          {/* 공고 제목 / Job title */}
          <h3
            className="text-base font-bold text-gray-900 leading-snug mb-3 line-clamp-2 transition-colors duration-200"
            style={{ color: isHovered ? '#2563EB' : '#0F172A' }}
          >
            {job.title}
          </h3>

          {/* 급여 카운트업 (토스 스타일) / Salary count-up (Toss style) */}
          <div
            className="mb-4 p-3 rounded-xl transition-all duration-300"
            style={{
              background: isHovered
                ? 'linear-gradient(135deg, #EFF6FF, #F0F9FF)'
                : '#F8FAFC',
            }}
          >
            <CountUpSalary job={job} isHovered={isHovered} />
            <p className="text-[11px] text-gray-400 mt-0.5">
              {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}{' '}
              {job.workHours && `· ${job.workHours}`}
            </p>
          </div>

          {/* 비자 배지 / Visa badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.allowedVisas.map((visa) => {
              const vc = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${vc.bg} ${vc.text}`}
                >
                  {visa}
                </span>
              );
            })}
          </div>

          {/* 혜택 / Benefits */}
          {job.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {job.benefits.slice(0, 3).map((b) => (
                <span
                  key={b}
                  className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100"
                >
                  {b}
                </span>
              ))}
              {job.benefits.length > 3 && (
                <span className="text-[11px] text-gray-400 px-1 py-0.5">
                  +{job.benefits.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 하단 메트릭 / Bottom metrics */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Users size={12} />
                지원 {job.applicantCount}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                조회 {job.viewCount.toLocaleString()}
              </span>
            </div>

            {/* 매치 스코어 (있을 때만) / Match score (only when present) */}
            {job.matchScore && (
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{
                  background:
                    job.matchScore >= 80
                      ? 'linear-gradient(135deg, #DCFCE7, #D1FAE5)'
                      : job.matchScore >= 60
                        ? 'linear-gradient(135deg, #FEF9C3, #FEF3C7)'
                        : '#F1F5F9',
                  color:
                    job.matchScore >= 80
                      ? '#15803D'
                      : job.matchScore >= 60
                        ? '#A16207'
                        : '#64748B',
                }}
              >
                <TrendingUp size={10} />
                {job.matchScore}%
              </div>
            )}
          </div>
        </div>

        {/* 하단 CTA 바 (호버 시) / Bottom CTA bar (on hover) */}
        <div
          className="overflow-hidden transition-all duration-500 ease-out"
          style={{
            maxHeight: isHovered ? '52px' : '0',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <span className="text-sm font-semibold">자세히 보기</span>
            <ChevronRight
              size={16}
              className="transition-transform duration-300"
              style={{
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 / Main page
export default function G089Page() {
  return (
    <>
      {/* 글로벌 키프레임 / Global keyframes */}
      <style jsx global>{`
        @keyframes goldShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-animate {
          animation: fadeSlideUp 0.5s ease-out both;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* 헤더 / Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: FIGMA_COLORS.red }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: FIGMA_COLORS.purple }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: FIGMA_COLORS.green }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: FIGMA_COLORS.blue }}
                />
              </div>
              <span className="text-xs font-mono text-gray-400">
                {designInfo.id}
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {designInfo.name}
            </h1>
            <p className="mt-2 text-gray-500 text-sm max-w-xl">
              {designInfo.description}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-xs font-medium text-gray-400">
                by {designInfo.author}
              </span>
              <span className="text-xs text-gray-300">|</span>
              {designInfo.references.map((ref) => (
                <span
                  key={ref}
                  className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full"
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 인터랙션 가이드 / Interaction guide */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-400" />
              프리미엄 카드: 골드 시머 효과
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-blue-500" />
              호버: 급여 카운트업 애니메이션
            </span>
            <span className="flex items-center gap-1.5">
              <Award size={12} className="text-purple-500" />
              호버: Figma 4색 프레임 + 노드 코너
            </span>
          </div>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleJobsV2.map((job, index) => (
              <div key={job.id} className="card-animate">
                <JobCard job={job} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* 푸터 / Footer */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                <div
                  className="w-2 h-2 rounded-sm"
                  style={{ background: FIGMA_COLORS.red }}
                />
                <div
                  className="w-2 h-2 rounded-sm"
                  style={{ background: FIGMA_COLORS.purple }}
                />
                <div
                  className="w-2 h-2 rounded-sm"
                  style={{ background: FIGMA_COLORS.green }}
                />
                <div
                  className="w-2 h-2 rounded-sm"
                  style={{ background: FIGMA_COLORS.blue }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                JobChaJa
              </span>
              <span className="text-xs text-gray-400">
                Design {designInfo.id}
              </span>
            </div>
            <span className="text-xs text-gray-300">
              Wanted + Toss + Figma Fusion
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
