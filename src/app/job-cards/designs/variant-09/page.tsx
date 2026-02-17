'use client';

// 시안 09: 마감일/긴급 포커스 (알바몬 스타일) / Variant 09: Deadline / Urgency Focus (Albamon Style)
// D-day가 카드의 주인공. 거대한 D-day 숫자, 원형 프로그레스 링, 긴급 공고 펄스 애니메이션
// D-day is the HERO element. Giant D-day number, circular progress ring, pulsing urgent jobs

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import { MapPin, Users, Flame, Infinity, Clock, Briefcase } from 'lucide-react';

// D-day 숫자 파싱 유틸 / Parse D-day number utility
function parseDDayNumber(dDay: string | null): number | null {
  if (!dDay) return null;
  if (dDay === 'D-Day') return 0;
  if (dDay === '마감') return -1;
  if (dDay === '상시모집') return null;
  const match = dDay.match(/D-(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// 원형 프로그레스 링에 사용할 퍼센트 계산 / Calculate percentage for circular progress ring
// 공고일~마감일 기준 남은 비율 / Ratio remaining between posted and closing date
function getTimeRemainingPercent(postedDate: string, closingDate: string | null): number {
  if (!closingDate) return 100; // 상시모집은 항상 100% / Always-open is always 100%
  const posted = new Date(postedDate).getTime();
  const closing = new Date(closingDate).getTime();
  const now = Date.now();
  const total = closing - posted;
  const remaining = closing - now;
  if (total <= 0) return 0;
  const percent = Math.max(0, Math.min(100, (remaining / total) * 100));
  return Math.round(percent);
}

// D-day 색상 결정 / Determine D-day color scheme
function getDDayColorScheme(dDay: string | null): {
  textColor: string;
  ringColor: string;
  bgColor: string;
  strokeColor: string;
} {
  if (!dDay || dDay === '상시모집') {
    return {
      textColor: 'text-emerald-600',
      ringColor: 'stroke-emerald-500',
      bgColor: 'bg-emerald-50',
      strokeColor: '#10b981',
    };
  }
  if (dDay === '마감') {
    return {
      textColor: 'text-gray-400',
      ringColor: 'stroke-gray-300',
      bgColor: 'bg-gray-50',
      strokeColor: '#d1d5db',
    };
  }
  const num = parseDDayNumber(dDay);
  if (num !== null && num <= 3) {
    return {
      textColor: 'text-red-600',
      ringColor: 'stroke-red-500',
      bgColor: 'bg-red-50',
      strokeColor: '#ef4444',
    };
  }
  if (num !== null && num <= 7) {
    return {
      textColor: 'text-orange-600',
      ringColor: 'stroke-orange-500',
      bgColor: 'bg-orange-50',
      strokeColor: '#f97316',
    };
  }
  if (num !== null && num <= 14) {
    return {
      textColor: 'text-blue-600',
      ringColor: 'stroke-blue-500',
      bgColor: 'bg-blue-50',
      strokeColor: '#3b82f6',
    };
  }
  return {
    textColor: 'text-blue-600',
    ringColor: 'stroke-blue-500',
    bgColor: 'bg-blue-50',
    strokeColor: '#3b82f6',
  };
}

// 원형 프로그레스 링 SVG 컴포넌트 / Circular progress ring SVG component
function CircularProgress({
  percent,
  strokeColor,
  size = 100,
  strokeWidth = 5,
  children,
}: {
  percent: number;
  strokeColor: string;
  size?: number;
  strokeWidth?: number;
  children: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 남은 시간 비율에 따른 오프셋 / Offset based on remaining time ratio
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* 배경 원 / Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* 프로그레스 원 / Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* 중앙 콘텐츠 / Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// 개별 채용공고 카드 컴포넌트 / Individual job card component
function DeadlineJobCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 남은 시간 퍼센트 / Remaining time percent
  const remainPercent = getTimeRemainingPercent(job.postedDate, job.closingDate);
  // 색상 스키마 / Color scheme
  const colors = getDDayColorScheme(dDay);
  // 상시모집 여부 / Always-recruiting check
  const isAlwaysOpen = dDay === '상시모집';
  // 마감 여부 / Closed check
  const isClosed = dDay === '마감';
  // 긴급 여부 / Urgent check
  const isUrgent = job.isUrgent === true;

  return (
    <div
      className={`
        relative bg-white rounded-xl overflow-hidden flex flex-col
        transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
        ${isUrgent
          ? 'border-2 border-red-400 shadow-md animate-[urgentPulse_2s_ease-in-out_infinite]'
          : 'border border-gray-200 shadow-sm'
        }
        ${isClosed ? 'opacity-60' : ''}
      `}
    >
      {/* 긴급 배지 / Urgent flame badge */}
      {isUrgent && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
          <Flame className="w-3.5 h-3.5" />
          <span>긴급</span>
        </div>
      )}

      {/* 프리미엄 배지 / Premium badge */}
      {job.tierType === 'PREMIUM' && (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider shadow">
          PREMIUM
        </div>
      )}

      {/* D-day 히어로 섹션 / D-day hero section */}
      <div className={`flex justify-center pt-8 pb-4 ${colors.bgColor}`}>
        {isAlwaysOpen ? (
          // 상시모집: 녹색 무한대 심볼 / Always-open: green infinity symbol
          <div className="flex flex-col items-center gap-2">
            <div className="w-[100px] h-[100px] rounded-full bg-emerald-100 flex items-center justify-center border-[5px] border-emerald-300">
              <Infinity className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-emerald-600">상시모집</span>
          </div>
        ) : (
          // D-day 원형 프로그레스 / D-day circular progress
          <div className="flex flex-col items-center gap-2">
            <CircularProgress
              percent={isClosed ? 0 : remainPercent}
              strokeColor={colors.strokeColor}
              size={100}
              strokeWidth={5}
            >
              {/* D-day 숫자 / D-day number */}
              <span className={`text-2xl font-black ${colors.textColor} leading-none`}>
                {dDay === 'D-Day' ? 'D-Day' : dDay}
              </span>
              {!isClosed && (
                <span className="text-[10px] text-gray-400 mt-0.5">{remainPercent}% 남음</span>
              )}
            </CircularProgress>
            {/* 마감일 텍스트 / Closing date text */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>
                {job.closingDate
                  ? `${job.closingDate.slice(5).replace('-', '/')} 마감`
                  : '마감일 없음'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 카드 본문 / Card body */}
      <div className="flex flex-col gap-2.5 px-5 pb-5 pt-3 flex-1">
        {/* 공고 제목 / Job title */}
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2">
          {job.title}
        </h3>

        {/* 회사명 + 위치 / Company name + location */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600">{job.company}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-500">{job.location}</span>
          </div>
        </div>

        {/* 급여 / Salary */}
        <p className="text-sm font-semibold text-blue-600">{salary}</p>

        {/* 비자 배지 / Visa badges */}
        <div className="flex flex-wrap gap-1">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className="text-[11px] px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full font-medium"
            >
              {visa}
            </span>
          ))}
        </div>

        {/* 하단 메타 정보 / Bottom meta info */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 mt-auto border-t border-gray-100">
          <span>{timeAgo}</span>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>지원 {job.applicantCount}명</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant09Page() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 커스텀 키프레임 스타일 / Custom keyframe styles for urgent pulse */}
      <style jsx global>{`
        @keyframes urgentPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }
      `}</style>

      {/* 페이지 헤더 / Page header */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold text-gray-900">
          시안 09: Deadline / Urgency Focus
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          알바몬 스타일 — D-day가 카드의 주인공, 원형 프로그레스 링, 긴급 공고 펄스 애니메이션
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Albamon-inspired — D-day as hero element, circular progress ring, pulsing urgent animation
        </p>
      </div>

      {/* 범례 / Legend */}
      <div className="max-w-5xl mx-auto px-4 pb-4">
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>D-3 이하 (긴박)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span>D-7 이하 (주의)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>D-14 이하 (여유)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>상시모집</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3 h-3 text-red-500" />
            <span>긴급 공고</span>
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      {/* 반응형: 모바일 1열, 태블릿 2열, 데스크탑 3열 */}
      {/* Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleJobs.map((job) => (
            <DeadlineJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
