'use client';

// 시안 31: 원형/둥근 버블 카드 / Variant 31: Circular / Rounded Bubble Card
// 모든 요소가 둥글고 원형인 버블/풍선 미학, 파스텔 색상
// Everything circular/rounded with bubble/balloon aesthetic, pastel color palette

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Briefcase,
  Star,
  Zap,
  Heart,
  Shield,
  Bus,
  UtensilsCrossed,
  Home,
  GraduationCap,
  Laptop,
  Plane,
  DollarSign,
  Timer,
  BadgeCheck,
} from 'lucide-react';

// 파스텔 색상 팔레트 / Pastel color palette for cards
const PASTEL_PALETTES = [
  { bg: 'bg-pink-50', accent: 'bg-pink-200', text: 'text-pink-700', border: 'border-pink-200', ring: 'stroke-pink-400', salaryBg: 'bg-pink-100', salaryText: 'text-pink-800' },
  { bg: 'bg-blue-50', accent: 'bg-blue-200', text: 'text-blue-700', border: 'border-blue-200', ring: 'stroke-blue-400', salaryBg: 'bg-blue-100', salaryText: 'text-blue-800' },
  { bg: 'bg-purple-50', accent: 'bg-purple-200', text: 'text-purple-700', border: 'border-purple-200', ring: 'stroke-purple-400', salaryBg: 'bg-purple-100', salaryText: 'text-purple-800' },
  { bg: 'bg-green-50', accent: 'bg-green-200', text: 'text-green-700', border: 'border-green-200', ring: 'stroke-green-400', salaryBg: 'bg-green-100', salaryText: 'text-green-800' },
  { bg: 'bg-amber-50', accent: 'bg-amber-200', text: 'text-amber-700', border: 'border-amber-200', ring: 'stroke-amber-400', salaryBg: 'bg-amber-100', salaryText: 'text-amber-800' },
  { bg: 'bg-teal-50', accent: 'bg-teal-200', text: 'text-teal-700', border: 'border-teal-200', ring: 'stroke-teal-400', salaryBg: 'bg-teal-100', salaryText: 'text-teal-800' },
];

// 복리후생 아이콘 매핑 / Benefits icon mapping
const BENEFIT_ICONS: Record<string, React.ReactNode> = {
  '기숙사': <Home className="w-3.5 h-3.5" />,
  '통근버스': <Bus className="w-3.5 h-3.5" />,
  '중식제공': <UtensilsCrossed className="w-3.5 h-3.5" />,
  '식사제공': <UtensilsCrossed className="w-3.5 h-3.5" />,
  '4대보험': <Shield className="w-3.5 h-3.5" />,
  '유니폼': <Briefcase className="w-3.5 h-3.5" />,
  '재택근무': <Laptop className="w-3.5 h-3.5" />,
  '유연근무': <Clock className="w-3.5 h-3.5" />,
  '스톡옵션': <DollarSign className="w-3.5 h-3.5" />,
  '식대지원': <UtensilsCrossed className="w-3.5 h-3.5" />,
  '안전장비': <Shield className="w-3.5 h-3.5" />,
  '숙소지원': <Home className="w-3.5 h-3.5" />,
  '야간수당': <Timer className="w-3.5 h-3.5" />,
  '주거지원': <Home className="w-3.5 h-3.5" />,
  '항공권': <Plane className="w-3.5 h-3.5" />,
  '의료보험': <Shield className="w-3.5 h-3.5" />,
  '연차': <Star className="w-3.5 h-3.5" />,
};

// 도넛 링 매칭 점수 컴포넌트 / Donut ring match score component
function DonutScore({ score, palette }: { score: number; palette: typeof PASTEL_PALETTES[0] }) {
  // SVG 도넛 링 계산 / SVG donut ring calculation
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-[72px] h-[72px] flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        {/* 배경 링 / Background ring */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
        />
        {/* 점수 링 / Score ring */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          className={palette.ring}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {/* 중앙 점수 텍스트 / Center score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${palette.text}`}>{score}</span>
        <span className="text-[10px] text-gray-400">점</span>
      </div>
    </div>
  );
}

// D-day 색상 결정 / Determine D-day color
function getDDayStyle(dDay: string | null): string {
  if (!dDay) return 'bg-gray-100 text-gray-500';
  if (dDay === '마감') return 'bg-gray-200 text-gray-500';
  if (dDay === 'D-Day') return 'bg-red-100 text-red-600';
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 7) return 'bg-red-100 text-red-600';
  return 'bg-gray-100 text-gray-600';
}

// 개별 버블 카드 컴포넌트 / Individual bubble card component
function BubbleJobCard({ job, index }: { job: MockJobPosting; index: number }) {
  const palette = PASTEL_PALETTES[index % PASTEL_PALETTES.length];
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);

  // 회사 로고 이니셜 생성 / Generate company logo initial
  const logoInitial = job.company.charAt(0);

  return (
    <div
      className={`relative ${palette.bg} rounded-[32px] p-6 pt-12 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-1`}
    >
      {/* 상단 원형 로고 (카드 엣지에 겹침) / Circular logo overlapping card edge */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
        <div
          className={`w-14 h-14 rounded-full ${palette.accent} flex items-center justify-center shadow-md border-4 border-white`}
        >
          <span className={`text-xl font-bold ${palette.text}`}>{logoInitial}</span>
        </div>
      </div>

      {/* 상단 배지 라인 / Top badge line */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1.5 flex-wrap">
          {/* 프리미엄 배지 / Premium badge */}
          {job.tierType === 'PREMIUM' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
              <Star className="w-3 h-3" />
              PREMIUM
            </span>
          )}
          {/* 긴급 배지 / Urgent badge */}
          {job.isUrgent && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
              <Zap className="w-3 h-3" />
              긴급
            </span>
          )}
          {/* 추천 배지 / Featured badge */}
          {job.isFeatured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 text-violet-600 text-xs font-semibold">
              <BadgeCheck className="w-3 h-3" />
              추천
            </span>
          )}
        </div>
        {/* D-day 필 배지 / D-day pill badge */}
        {dDay && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDDayStyle(dDay)}`}>
            {dDay}
          </span>
        )}
      </div>

      {/* 회사명 / Company name */}
      <p className="text-xs text-gray-500 mb-1 text-center">{job.company}</p>

      {/* 공고 제목 / Job title */}
      <h3 className="text-sm font-bold text-gray-800 text-center leading-snug mb-4 line-clamp-2">
        {job.title}
      </h3>

      {/* 급여 원형 배지 / Salary circular badge */}
      <div className="flex justify-center mb-4">
        <div
          className={`px-5 py-2.5 rounded-full ${palette.salaryBg} ${palette.salaryText} font-bold text-sm shadow-inner`}
        >
          {salary}
        </div>
      </div>

      {/* 정보 필 배지 행 / Info pill badge row */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-4">
        {/* 위치 / Location */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 text-gray-600 text-xs">
          <MapPin className="w-3 h-3" />
          {job.location}
        </span>
        {/* 고용형태 / Employment type */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 text-gray-600 text-xs">
          <Briefcase className="w-3 h-3" />
          {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
        </span>
        {/* 근무시간 / Work hours */}
        {job.workHours && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/70 text-gray-600 text-xs">
            <Clock className="w-3 h-3" />
            {job.workHours}
          </span>
        )}
      </div>

      {/* 비자 배지 / Visa badges */}
      <div className="flex flex-wrap justify-center gap-1 mb-4">
        {job.allowedVisas.map((visa) => (
          <span
            key={visa}
            className={`px-2.5 py-0.5 rounded-full ${palette.accent} ${palette.text} text-[11px] font-medium`}
          >
            {visa}
          </span>
        ))}
      </div>

      {/* 하단: 매칭 도넛 + 복리후생 버블 / Bottom: Match donut + benefit bubbles */}
      <div className="flex items-center gap-3 mt-2">
        {/* 매칭 점수 도넛 링 / Match score donut ring */}
        {job.matchScore !== undefined && (
          <div className="flex-shrink-0">
            <DonutScore score={job.matchScore} palette={palette} />
          </div>
        )}

        {/* 복리후생 원형 아이콘 버블들 / Benefits circular icon bubbles */}
        <div className="flex flex-wrap gap-1.5 flex-1 justify-center">
          {job.benefits.map((benefit) => (
            <div
              key={benefit}
              className={`w-8 h-8 rounded-full ${palette.accent} flex items-center justify-center ${palette.text} hover:scale-110 transition-transform cursor-default`}
              title={benefit}
            >
              {BENEFIT_ICONS[benefit] || <Star className="w-3.5 h-3.5" />}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 통계 + 시간 / Bottom stats + time */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Users className="w-3 h-3" />
            {job.applicantCount}명
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {job.viewCount.toLocaleString()}
          </span>
        </div>
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>

      {/* 좋아요 버튼 / Like button */}
      <button
        className="absolute top-14 right-5 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm"
        aria-label="스크랩 / Bookmark"
      >
        <Heart className="w-4 h-4 text-gray-400 hover:text-red-400" />
      </button>
    </div>
  );
}

// 메인 페이지 / Main page
export default function Variant31Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-6 md:p-10">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          채용공고
        </h1>
        <p className="text-sm text-gray-500">
          비자 매칭 기반 채용 정보 / Visa-matched job listings
        </p>
      </div>

      {/* 매서너리 스타일 카드 레이아웃 / Masonry-style card layout */}
      {/* 카드가 약간씩 겹치는 매서너리 배치 / Slightly overlapping masonry placement */}
      <div className="max-w-5xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-4">
        {sampleJobs.map((job, index) => (
          <div
            key={job.id}
            className={`break-inside-avoid mb-6 ${
              // 홀수/짝수 카드에 다른 상단 마진 적용 (겹침 효과) / Different top margin for odd/even cards (overlap effect)
              index % 2 === 1 ? 'mt-4' : 'mt-0'
            }`}
            style={{
              // 카드별 미세 회전으로 유기적 느낌 / Slight rotation per card for organic feel
              transform: `rotate(${index % 2 === 0 ? -0.5 : 0.5}deg)`,
            }}
          >
            <BubbleJobCard job={job} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
