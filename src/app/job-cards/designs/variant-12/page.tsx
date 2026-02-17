'use client';

// 시안 12: 뉴모피즘 카드 / Variant 12: Neumorphism Card
// 소프트 UI 스타일, 인셋/아웃셋 그림자, 밝은 회색 배경
// Soft UI style, inset/outset shadows, light gray background

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Crown,
  Zap,
  Star,
  Briefcase,
  DollarSign,
  CalendarDays,
  Gift,
  Shield,
  ChevronRight,
} from 'lucide-react';

// 뉴모피즘 기본 배경색 / Neumorphism base background color
const BG = '#e0e5ec';
// 어두운 그림자 / Dark shadow
const SHADOW_DARK = '#b8b9be';
// 밝은 그림자 / Light shadow
const SHADOW_LIGHT = '#ffffff';

// D-day 색상 결정 / Determine D-day styling for neumorphic context
function getDDayStyle(dday: string | null): string {
  if (!dday) return 'text-gray-400';
  if (dday === '마감') return 'text-red-500';
  if (dday === 'D-Day' || dday === 'D-1' || dday === 'D-2' || dday === 'D-3')
    return 'text-red-500 font-bold';
  if (dday === '상시모집') return 'text-emerald-600';
  return 'text-gray-600';
}

// 비자 배지 색상 (뉴모피즘 호환) / Visa badge color (neumorphism-compatible)
function getVisaBadgeColor(visa: string): string {
  if (visa.startsWith('E-7')) return 'text-blue-700 bg-blue-100';
  if (visa.startsWith('E-9')) return 'text-orange-700 bg-orange-100';
  if (visa.startsWith('E-2')) return 'text-purple-700 bg-purple-100';
  if (visa.startsWith('H-2')) return 'text-teal-700 bg-teal-100';
  if (visa.startsWith('F-')) return 'text-green-700 bg-green-100';
  return 'text-gray-600 bg-gray-200';
}

// 매칭 점수 색상 / Match score color for circular gauge
function getScoreColor(score: number): string {
  if (score >= 90) return '#10b981'; // emerald-500
  if (score >= 75) return '#3b82f6'; // blue-500
  if (score >= 60) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
}

// 원형 게이지 SVG / Circular gauge SVG component for match score
function CircularGauge({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div
      className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center"
      style={{
        boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
      }}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        width="72"
        height="72"
        viewBox="0 0 72 72"
      >
        {/* 배경 트랙 / Background track */}
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#d1d5db"
          strokeWidth="5"
          opacity="0.3"
        />
        {/* 점수 아크 / Score arc */}
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {/* 점수 텍스트 / Score text */}
      <div className="relative flex flex-col items-center">
        <span className="text-lg font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[9px] text-gray-400 -mt-0.5">매칭</span>
      </div>
    </div>
  );
}

// 뉴모피즘 채용공고 카드 / Neumorphism job card component
function NeumorphicJobCard({ job }: { job: MockJobPosting }) {
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div className="group relative">
      {/* 프리미엄 골든 뉴모픽 링 / Premium golden neumorphic ring */}
      {isPremium && (
        <div
          className="absolute -inset-[3px] rounded-[22px]"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
            boxShadow: `4px 4px 10px ${SHADOW_DARK}, -4px -4px 10px ${SHADOW_LIGHT}`,
          }}
        />
      )}

      {/* 카드 본체 / Card body */}
      <div
        className="relative rounded-[20px] p-5 transition-all duration-300 group-hover:-translate-y-0.5"
        style={{
          backgroundColor: BG,
          boxShadow: isPremium
            ? `6px 6px 14px ${SHADOW_DARK}, -6px -6px 14px ${SHADOW_LIGHT}`
            : `5px 5px 10px ${SHADOW_DARK}, -5px -5px 10px ${SHADOW_LIGHT}`,
        }}
      >
        {/* 상단 영역: 배지 + D-day / Top area: badges + D-day */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* 프리미엄 배지 (뉴모피즘 눌린 스타일) / Premium badge (neumorphic pressed) */}
            {isPremium && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-amber-700 text-xs font-bold"
                style={{
                  backgroundColor: BG,
                  boxShadow: `inset 2px 2px 4px ${SHADOW_DARK}, inset -2px -2px 4px ${SHADOW_LIGHT}`,
                }}
              >
                <Crown className="w-3 h-3" />
                PREMIUM
              </span>
            )}

            {/* 긴급 배지 / Urgent badge */}
            {job.isUrgent && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-red-600 text-xs font-semibold"
                style={{
                  backgroundColor: BG,
                  boxShadow: `inset 2px 2px 4px ${SHADOW_DARK}, inset -2px -2px 4px ${SHADOW_LIGHT}`,
                }}
              >
                <Zap className="w-3 h-3" />
                긴급
              </span>
            )}

            {/* 추천 배지 / Featured badge */}
            {job.isFeatured && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-indigo-600 text-xs font-semibold"
                style={{
                  backgroundColor: BG,
                  boxShadow: `inset 2px 2px 4px ${SHADOW_DARK}, inset -2px -2px 4px ${SHADOW_LIGHT}`,
                }}
              >
                <Star className="w-3 h-3" />
                추천
              </span>
            )}
          </div>

          {/* D-day (뉴모피즘 볼록 스타일) / D-day (neumorphic raised) */}
          <span
            className={`text-sm font-mono font-semibold px-3 py-1 rounded-lg ${getDDayStyle(dday)}`}
            style={{
              backgroundColor: BG,
              boxShadow: `3px 3px 6px ${SHADOW_DARK}, -3px -3px 6px ${SHADOW_LIGHT}`,
            }}
          >
            {dday}
          </span>
        </div>

        {/* 메인 컨텐츠: 제목 + 매칭 게이지 / Main content: title + match gauge */}
        <div className="flex gap-4 mb-4">
          {/* 텍스트 영역 / Text area */}
          <div className="flex-1 min-w-0">
            {/* 기업명 / Company name */}
            <p className="text-gray-400 text-sm mb-1 truncate">{job.company}</p>

            {/* 공고 제목 / Job title */}
            <h3 className="text-gray-700 font-bold text-lg leading-snug line-clamp-2 mb-2">
              {job.title}
            </h3>

            {/* 고용형태 / Employment type */}
            <span
              className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${
                job.boardType === 'FULL_TIME'
                  ? 'text-cyan-700 bg-cyan-100'
                  : 'text-violet-700 bg-violet-100'
              }`}
            >
              {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
            </span>
          </div>

          {/* 뉴모피즘 원형 매칭 게이지 / Neumorphic circular match gauge */}
          {job.matchScore !== undefined && (
            <div className="flex-shrink-0">
              <CircularGauge score={job.matchScore} />
            </div>
          )}
        </div>

        {/* 핵심 정보 (뉴모피즘 인셋 패널) / Key info (neumorphic inset panel) */}
        <div
          className="rounded-xl p-3.5 mb-4 space-y-2"
          style={{
            backgroundColor: BG,
            boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}`,
          }}
        >
          {/* 급여 / Salary */}
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-gray-700 font-semibold">{salary}</span>
          </div>

          {/* 위치 / Location */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-500">{job.location}</span>
          </div>

          {/* 근무시간 / Work hours */}
          {job.workHours && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500">{job.workHours}</span>
            </div>
          )}

          {/* 경력 / Experience */}
          {job.experienceRequired && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500">
                경력 {job.experienceRequired}
              </span>
            </div>
          )}
        </div>

        {/* 비자 배지 (뉴모피즘 눌린 칩) / Visa badges (neumorphic pressed chips) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getVisaBadgeColor(visa)}`}
              style={{
                boxShadow: `inset 1px 1px 3px ${SHADOW_DARK}, inset -1px -1px 3px ${SHADOW_LIGHT}`,
              }}
            >
              <Shield className="w-3 h-3 inline mr-0.5 -mt-0.5" />
              {visa}
            </span>
          ))}
        </div>

        {/* 복리후생 (뉴모피즘 볼록 알약) / Benefits (neumorphic raised pills) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.benefits.slice(0, 4).map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-gray-500 font-medium"
              style={{
                backgroundColor: BG,
                boxShadow: `2px 2px 4px ${SHADOW_DARK}, -2px -2px 4px ${SHADOW_LIGHT}`,
              }}
            >
              <Gift className="w-3 h-3 text-gray-400" />
              {benefit}
            </span>
          ))}
          {job.benefits.length > 4 && (
            <span className="text-xs text-gray-400 self-center">
              +{job.benefits.length - 4}
            </span>
          )}
        </div>

        {/* 하단 메타 + 버튼 / Bottom meta + button */}
        <div className="flex items-center justify-between pt-3">
          {/* 메타 정보 / Meta info */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              지원 {job.applicantCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {job.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>

          {/* 상세보기 버튼 (뉴모피즘 볼록) / Detail button (neumorphic raised) */}
          <button
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-500 transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: BG,
              boxShadow: `3px 3px 6px ${SHADOW_DARK}, -3px -3px 6px ${SHADOW_LIGHT}`,
            }}
            onMouseDown={(e) => {
              // 눌림 효과 / Pressed effect
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}`;
            }}
            onMouseUp={(e) => {
              // 원복 / Restore
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `3px 3px 6px ${SHADOW_DARK}, -3px -3px 6px ${SHADOW_LIGHT}`;
            }}
            onMouseLeave={(e) => {
              // 마우스 떠남 시 원복 / Restore on mouse leave
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `3px 3px 6px ${SHADOW_DARK}, -3px -3px 6px ${SHADOW_LIGHT}`;
            }}
          >
            상세보기
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 / Main page component
export default function Variant12Page() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: BG }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 페이지 타이틀 (뉴모피즘 스타일) / Page title (neumorphic style) */}
        <div className="text-center mb-12">
          <h1
            className="inline-block text-3xl sm:text-4xl font-bold text-gray-600 px-8 py-4 rounded-2xl"
            style={{
              backgroundColor: BG,
              boxShadow: `6px 6px 12px ${SHADOW_DARK}, -6px -6px 12px ${SHADOW_LIGHT}`,
            }}
          >
            시안 12 — 뉴모피즘 카드
          </h1>
          <p className="text-gray-400 text-lg mt-4">
            Variant 12 — Neumorphism Card Design
          </p>
        </div>

        {/* 카드 그리드: 1열 모바일 / 2열 md / 3열 lg */}
        {/* Card grid: 1col mobile / 2col md / 3col lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleJobs.map((job) => (
            <NeumorphicJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
