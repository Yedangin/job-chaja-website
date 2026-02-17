'use client';

// 시안 24: 이모지 헤더 카드 / Variant 24: Emoji Header Card
// 큰 이모지가 카드의 비주얼 히어로 역할. 업종별 매핑된 이모지
// Large emoji as visual hero. Industry-mapped emojis
// Gen-Z 친화적 디자인, 파스텔 배경, 장난스러운 타이포 / Gen-Z friendly, pastel backgrounds, playful typography
// 복리후생도 이모지+텍스트 쌍으로 표시 / Benefits shown as emoji+text pairs

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Users,
  Eye,
  Sparkles,
  Zap,
} from 'lucide-react';

// 업종별 이모지 + 파스텔 컬러 매핑 / Industry emoji + pastel color mapping
interface IndustryTheme {
  emoji: string;
  bgColor: string;       // 카드 배경 / Card background
  headerBg: string;      // 이모지 영역 배경 / Emoji area background
  accentColor: string;   // 강조 텍스트 / Accent text
  badgeBg: string;       // 배지 배경 / Badge background
  badgeText: string;     // 배지 텍스트 / Badge text
}

const industryThemes: Record<string, IndustryTheme> = {
  '제조': {
    emoji: '\u{1F3ED}',
    bgColor: 'bg-blue-50/80',
    headerBg: 'bg-blue-100/60',
    accentColor: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-600',
  },
  '숙박/음식': {
    emoji: '\u{1F373}',
    bgColor: 'bg-orange-50/80',
    headerBg: 'bg-orange-100/60',
    accentColor: 'text-orange-600',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-600',
  },
  'IT/소프트웨어': {
    emoji: '\u{1F4BB}',
    bgColor: 'bg-violet-50/80',
    headerBg: 'bg-violet-100/60',
    accentColor: 'text-violet-600',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-600',
  },
  '건설': {
    emoji: '\u{1F3D7}\u{FE0F}',
    bgColor: 'bg-amber-50/80',
    headerBg: 'bg-amber-100/60',
    accentColor: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
  },
  '물류/운송': {
    emoji: '\u{1F4E6}',
    bgColor: 'bg-emerald-50/80',
    headerBg: 'bg-emerald-100/60',
    accentColor: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-600',
  },
  '교육': {
    emoji: '\u{1F4DA}',
    bgColor: 'bg-pink-50/80',
    headerBg: 'bg-pink-100/60',
    accentColor: 'text-pink-600',
    badgeBg: 'bg-pink-100',
    badgeText: 'text-pink-600',
  },
};

// 기본 테마 / Default theme fallback
const defaultTheme: IndustryTheme = {
  emoji: '\u{1F4BC}',
  bgColor: 'bg-gray-50/80',
  headerBg: 'bg-gray-100/60',
  accentColor: 'text-gray-600',
  badgeBg: 'bg-gray-100',
  badgeText: 'text-gray-600',
};

// 업종 테마 가져오기 / Get theme for industry
function getTheme(industry: string): IndustryTheme {
  return industryThemes[industry] || defaultTheme;
}

// 복리후생 이모지 매핑 / Benefits emoji mapping
const benefitEmojiMap: Record<string, string> = {
  '기숙사': '\u{1F3E0}',
  '통근버스': '\u{1F68C}',
  '중식제공': '\u{1F371}',
  '식사제공': '\u{1F371}',
  '식대지원': '\u{1F371}',
  '4대보험': '\u{1F6E1}\u{FE0F}',
  '유니폼': '\u{1F454}',
  '재택근무': '\u{1F3E0}',
  '유연근무': '\u{23F0}',
  '스톡옵션': '\u{1F4C8}',
  '안전장비': '\u{26D1}\u{FE0F}',
  '숙소지원': '\u{1F3E0}',
  '야간수당': '\u{1F31F}',
  '주거지원': '\u{1F3E0}',
  '항공권': '\u{2708}\u{FE0F}',
  '의료보험': '\u{1F3E5}',
  '연차': '\u{1F334}',
};

// 복리후생 이모지 가져오기 / Get emoji for benefit
function getBenefitEmoji(benefit: string): string {
  return benefitEmojiMap[benefit] || '\u{2728}';
}

// D-day 스타일 결정 / Determine D-day styling
function getDDayDisplay(dDay: string | null): { text: string; className: string } {
  if (!dDay || dDay === '상시모집') return { text: '\u{1F504} 상시모집', className: 'text-gray-500 bg-gray-100' };
  if (dDay === '마감') return { text: '\u{1F6D1} 마감', className: 'text-gray-400 bg-gray-100 line-through' };
  if (dDay === 'D-Day') return { text: '\u{23F0} D-Day!', className: 'text-red-600 bg-red-100 font-bold animate-pulse' };
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 3) return { text: `\u{23F0} ${dDay}`, className: 'text-red-600 bg-red-50 font-semibold' };
  if (!isNaN(num) && num <= 7) return { text: `\u{23F0} ${dDay}`, className: 'text-orange-600 bg-orange-50 font-medium' };
  return { text: `\u{1F4C5} ${dDay}`, className: 'text-gray-500 bg-gray-50' };
}

// 개별 채용공고 카드 컴포넌트 / Individual job card component
function EmojiHeaderCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 업종 테마 / Industry theme
  const theme = getTheme(job.industry);
  // D-day 표시 / D-day display
  const dDayInfo = getDDayDisplay(dDay);
  // 프리미엄 여부 / Is premium
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div className={`
      group relative overflow-hidden rounded-3xl
      ${theme.bgColor}
      border border-white/60
      shadow-sm hover:shadow-xl
      transition-all duration-300 ease-out
      hover:-translate-y-1
    `}>
      {/* 프리미엄 반짝이 효과 / Premium sparkle effect */}
      {isPremium && (
        <div className="absolute top-3 right-3 z-20">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 shadow-md">
            <Sparkles className="w-3 h-3" />
            PREMIUM
          </span>
        </div>
      )}

      {/* 이모지 헤더 영역 / Emoji header area */}
      <div className={`
        relative px-6 pt-6 pb-4
        ${theme.headerBg}
        flex items-center gap-4
      `}>
        {/* 대형 이모지 / Large emoji */}
        <div className="text-[56px] leading-none select-none group-hover:scale-110 transition-transform duration-300">
          {theme.emoji}
        </div>

        {/* 업종 + 고용형태 / Industry + employment type */}
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-bold tracking-wider uppercase ${theme.accentColor}`}>
            {job.industry}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`
              text-[11px] font-semibold px-2 py-0.5 rounded-lg
              ${theme.badgeBg} ${theme.badgeText}
            `}>
              {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
            </span>
            {job.isUrgent && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-red-100 text-red-600">
                <Zap className="w-3 h-3" />
                급구
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 카드 본문 / Card body */}
      <div className="px-6 pb-5 pt-4 flex flex-col gap-3">
        {/* 공고 제목 / Job title */}
        <h3 className="text-[16px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-gray-900 transition-colors">
          {job.title}
        </h3>

        {/* 회사명 + 위치 / Company + location */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-700">
            {job.company}
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </p>
        </div>

        {/* 급여 (이모지 강조) / Salary (emoji emphasized) */}
        <div className={`text-base font-extrabold ${theme.accentColor}`}>
          {'\u{1F4B0}'} {salary}
        </div>

        {/* 복리후생 이모지 태그 / Benefits as emoji tags */}
        <div className="flex flex-wrap gap-1.5">
          {job.benefits.slice(0, 4).map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-xl bg-white/70 text-gray-600 border border-white"
            >
              {getBenefitEmoji(benefit)} {benefit}
            </span>
          ))}
          {job.benefits.length > 4 && (
            <span className="text-[11px] font-medium px-2 py-1 rounded-xl bg-white/50 text-gray-400">
              +{job.benefits.length - 4}
            </span>
          )}
        </div>

        {/* 비자 유형 / Visa types */}
        <div className="flex flex-wrap gap-1">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className={`
                text-[10px] font-bold px-2 py-0.5 rounded-lg
                ${theme.badgeBg} ${theme.badgeText}
              `}
            >
              {visa}
            </span>
          ))}
        </div>

        {/* 하단: D-day + 통계 / Bottom: D-day + stats */}
        <div className="flex items-center justify-between pt-3 border-t border-white/60">
          {/* D-day 배지 / D-day badge */}
          <span className={`text-[11px] px-2.5 py-1 rounded-lg ${dDayInfo.className}`}>
            {dDayInfo.text}
          </span>

          {/* 지원자 + 조회수 / Applicants + views */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3" />
              {job.applicantCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {job.viewCount.toLocaleString()}
            </span>
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* 매칭 스코어 바 / Match score bar */}
        {job.matchScore !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-white/80 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  job.matchScore >= 80
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : job.matchScore >= 60
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                      : 'bg-gradient-to-r from-gray-300 to-gray-400'
                }`}
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold ${
              job.matchScore >= 80 ? 'text-emerald-600' : job.matchScore >= 60 ? 'text-amber-600' : 'text-gray-400'
            }`}>
              {job.matchScore}% {'\u{1F3AF}'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function Variant24Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center">
          {/* 헤더 이모지 장식 / Header emoji decoration */}
          <div className="text-4xl mb-3 select-none">
            {'\u{1F3AF}'}{'\u{1F4BC}'}{'\u{2728}'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            채용공고
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-medium">
            Emoji Header Card
          </p>
          <p className="mt-1 text-xs text-gray-300">
            업종별 이모지로 한눈에 파악 / Industry emojis at a glance
          </p>
        </div>

        {/* 업종 범례 / Industry legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {Object.entries(industryThemes).map(([industry, theme]) => (
            <div
              key={industry}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl
                ${theme.bgColor} border border-white/60
              `}
            >
              <span className="text-lg">{theme.emoji}</span>
              <span className="text-xs font-semibold text-gray-600">{industry}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleJobs.map((job) => (
            <EmojiHeaderCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* 디자인 설명 영역 / Design description area */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-sm font-semibold text-gray-900 tracking-tight mb-4">
            디자인 특징 / Design Features
          </h2>
          <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-sm">{'\u{1F3ED}'}</span>
              업종별 대형 이모지(56px)가 카드 히어로 / Large industry emoji (56px) as card hero
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-sm">{'\u{1F3A8}'}</span>
              업종 맞춤 파스텔 배경 컬러 / Industry-matched pastel background colors
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-sm">{'\u{1F381}'}</span>
              복리후생을 이모지+텍스트 쌍으로 표시 / Benefits as emoji+text pairs
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-sm">{'\u{1F4B0}'}</span>
              급여/D-day 이모지 강조 / Salary/D-day with emoji emphasis
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-sm">{'\u{1F60E}'}</span>
              Gen-Z 친화적: rounded-3xl, 장난스러운 타이포, 부드러운 색감 / Gen-Z friendly: rounded-3xl, playful type, soft colors
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
