'use client';

// 시안 25: 프로그레스 / 매칭 점수 중심 카드 / Variant 25: Progress / Match Score Focus Card
// 피트니스 트래커 스타일 도넛 차트 중심 — 매칭 점수가 지배적 시각 요소
// Fitness tracker style donut chart focus — match score as the dominant visual element

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  Trophy,
  Crown,
  Zap,
  MapPin,
  Briefcase,
  Shield,
  Clock,
  Users,
  Eye,
  ChevronDown,
  ChevronUp,
  Target,
  DollarSign,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// 매칭 점수에 따른 색상 반환 / Return color based on match score
function getScoreColor(score: number): {
  ring: string;
  text: string;
  bg: string;
  stroke: string;
  label: string;
} {
  if (score >= 90) {
    return {
      ring: 'text-emerald-500',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      stroke: '#10b981',
      label: '최적 매칭', // Optimal match
    };
  }
  if (score >= 70) {
    return {
      ring: 'text-blue-500',
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      stroke: '#3b82f6',
      label: '우수 매칭', // Good match
    };
  }
  if (score >= 50) {
    return {
      ring: 'text-amber-500',
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      stroke: '#f59e0b',
      label: '보통 매칭', // Fair match
    };
  }
  return {
    ring: 'text-red-500',
    text: 'text-red-600',
    bg: 'bg-red-50',
    stroke: '#ef4444',
    label: '낮은 매칭', // Low match
  };
}

// 개별 기준 점수 시뮬레이션 (일관된 해시 기반) / Simulate individual criteria scores (consistent hash-based)
function getCriteriaScores(job: MockJobPosting): {
  visa: number;
  salary: number;
  location: number;
  experience: number;
} {
  const seed = job.id.charCodeAt(job.id.length - 1);
  const base = job.matchScore ?? 50;

  // 비자 호환성: 허용 비자 수에 비례 / Visa compatibility: proportional to allowed visa count
  const visa = Math.min(100, Math.max(20, base + (job.allowedVisas.length * 8) - 10 + (seed % 10)));

  // 급여 범위: 급여 수준 기반 / Salary range: based on salary level
  const salaryBase = job.salaryMax ? Math.min(100, Math.round(job.salaryMax / 700000)) : (job.hourlyWage ? Math.min(100, Math.round(job.hourlyWage / 200)) : 60);
  const salary = Math.min(100, Math.max(15, salaryBase + (seed % 15)));

  // 위치 접근성: 시드 기반 / Location accessibility: seed-based
  const location = Math.min(100, Math.max(25, base - 5 + (seed % 20)));

  // 경력 요건 매칭 / Experience requirement match
  const expMap: Record<string, number> = { '무관': 95, '1년 이상': 75, '2년 이상': 60, '3년 이상': 50 };
  const experience = expMap[job.experienceRequired ?? '무관'] ?? 70;

  return { visa, salary, location, experience };
}

// SVG 도넛 차트 컴포넌트 / SVG donut chart component
function DonutChart({
  score,
  size = 120,
  strokeWidth = 10,
  isTopPerformer = false,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  isTopPerformer?: boolean;
}) {
  const colors = getScoreColor(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 배경 트랙 / Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          className="opacity-40"
        />
        {/* 점수 아크 / Score arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* 중앙 텍스트: 퍼센트 + 라벨 / Center text: percentage + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-extrabold ${colors.text}`}>
          {score}
          <span className="text-sm font-semibold">%</span>
        </span>
        <span className="text-[10px] text-gray-400 font-medium mt-0.5">매칭</span>
      </div>
      {/* 최고 성과자 왕관 / Top performer crown */}
      {isTopPerformer && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-200/50">
          <Crown className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

// 기준별 프로그레스 바 컴포넌트 / Criteria progress bar component
function CriteriaBar({
  label,
  labelEn,
  score,
  icon: Icon,
}: {
  label: string;
  labelEn: string;
  score: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const colors = getScoreColor(score);

  return (
    <div className="flex items-center gap-2">
      {/* 아이콘 / Icon */}
      <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-3 h-3 ${colors.text}`} />
      </div>
      {/* 라벨 + 바 / Label + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] text-gray-500 font-medium truncate">
            {label} <span className="text-gray-300">/ {labelEn}</span>
          </span>
          <span className={`text-[10px] font-bold ${colors.text} ml-1`}>{score}%</span>
        </div>
        {/* 프로그레스 바 / Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${score}%`,
              backgroundColor: colors.stroke,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// 개별 매칭 점수 카드 컴포넌트 / Individual match score card component
function MatchScoreCard({
  job,
  rank,
  isTopPerformer,
}: {
  job: MockJobPosting;
  rank: number;
  isTopPerformer: boolean;
}) {
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const isPremium = job.tierType === 'PREMIUM';
  const isClosed = dDay === '마감';
  const matchScore = job.matchScore ?? 0;
  const colors = getScoreColor(matchScore);
  const criteria = getCriteriaScores(job);

  return (
    <div
      className={`
        relative bg-white rounded-2xl overflow-hidden transition-all duration-300
        hover:shadow-xl hover:-translate-y-1 cursor-pointer group
        ${isPremium
          ? 'shadow-md ring-1 ring-amber-200/60'
          : 'shadow-sm ring-1 ring-gray-100'
        }
        ${isClosed ? 'opacity-50 grayscale' : ''}
      `}
    >
      {/* 순위 배지 (좌상단) / Rank badge (top-left) */}
      <div
        className={`
          absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center
          text-xs font-bold shadow-sm
          ${isTopPerformer
            ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
            : rank <= 3
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-600'
          }
        `}
      >
        {rank}
      </div>

      {/* 프리미엄 표시 (우상단) / Premium indicator (top-right) */}
      {isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
            <Trophy className="w-3 h-3" />
            PREMIUM
          </span>
        </div>
      )}

      {/* 상단 색상 그라데이션 바 (점수 색상) / Top color gradient bar (score-colored) */}
      <div
        className="h-1.5"
        style={{
          background: `linear-gradient(90deg, ${colors.stroke}40 0%, ${colors.stroke} 50%, ${colors.stroke}40 100%)`,
        }}
      />

      <div className="p-5">
        {/* 메인 영역: 도넛 차트 + 공고 정보 / Main area: donut chart + job info */}
        <div className="flex gap-4">
          {/* 도넛 차트 (왼쪽) / Donut chart (left) */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <DonutChart
              score={matchScore}
              size={110}
              strokeWidth={9}
              isTopPerformer={isTopPerformer}
            />
            {/* 매칭 레벨 라벨 / Match level label */}
            <span className={`mt-2 text-[10px] font-semibold ${colors.text} ${colors.bg} px-2 py-0.5 rounded-full`}>
              {colors.label}
            </span>
          </div>

          {/* 공고 정보 (오른쪽) / Job info (right) */}
          <div className="flex-1 min-w-0">
            {/* 배지 행: 긴급, 마감일 / Badge row: urgent, deadline */}
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {job.isUrgent && (
                <span className="inline-flex items-center gap-0.5 bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  <Zap className="w-3 h-3" />
                  긴급
                </span>
              )}
              {dDay && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  dDay === '마감' ? 'bg-gray-100 text-gray-400' :
                  dDay === 'D-Day' ? 'bg-red-50 text-red-600' :
                  dDay === '상시모집' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {dDay}
                </span>
              )}
              {job.isFeatured && (
                <span className="inline-flex items-center gap-0.5 bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  <Target className="w-3 h-3" />
                  추천
                </span>
              )}
            </div>

            {/* 공고 제목 / Job title */}
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-700 transition-colors">
              {job.title}
            </h3>

            {/* 회사 정보 / Company info */}
            <p className="text-xs text-gray-500 mb-2">{job.company}</p>

            {/* 메타 정보 행 / Meta info row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-0.5">
                <Briefcase className="w-3 h-3 text-gray-400" />
                {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
              </span>
              <span className="font-semibold text-gray-700">{salary}</span>
            </div>

            {/* 지원자/조회수 / Applicants/views */}
            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
              <span className="flex items-center gap-0.5">
                <Users className="w-3 h-3" />
                지원 {job.applicantCount}
              </span>
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                조회 {job.viewCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
            </div>
          </div>
        </div>

        {/* 구분선 / Divider */}
        <div className="my-4 h-px bg-gray-100" />

        {/* 기준별 분석 바 / Criteria breakdown bars */}
        <div className="space-y-2.5">
          <CriteriaBar
            label="비자 호환성"
            labelEn="Visa"
            score={criteria.visa}
            icon={Shield}
          />
          <CriteriaBar
            label="급여 범위"
            labelEn="Salary"
            score={criteria.salary}
            icon={DollarSign}
          />
          <CriteriaBar
            label="위치 접근성"
            labelEn="Location"
            score={criteria.location}
            icon={MapPin}
          />
          <CriteriaBar
            label="경력 요건"
            labelEn="Experience"
            score={criteria.experience}
            icon={GraduationCap}
          />
        </div>

        {/* 하단: 비자 배지 / Bottom: visa badges */}
        <div className="mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Shield className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            {job.allowedVisas.map((visa) => (
              <span
                key={visa}
                className="text-[10px] font-medium px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded"
              >
                {visa}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant25Page() {
  // 매칭 점수 기준 내림차순 정렬 / Sort by match score descending
  const sortedJobs = [...sampleJobs].sort(
    (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)
  );

  // 최고 매칭 점수 찾기 / Find top match score
  const topScore = sortedJobs[0]?.matchScore ?? 0;

  // 전체 평균 점수 / Overall average score
  const avgScore = Math.round(
    sampleJobs.reduce((sum, j) => sum + (j.matchScore ?? 0), 0) / sampleJobs.length
  );

  // 점수 분포 계산 / Calculate score distribution
  const distribution = {
    excellent: sampleJobs.filter((j) => (j.matchScore ?? 0) >= 90).length,
    good: sampleJobs.filter((j) => (j.matchScore ?? 0) >= 70 && (j.matchScore ?? 0) < 90).length,
    fair: sampleJobs.filter((j) => (j.matchScore ?? 0) >= 50 && (j.matchScore ?? 0) < 70).length,
    low: sampleJobs.filter((j) => (j.matchScore ?? 0) < 50).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* 페이지 헤더 / Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                시안 25: Progress / Match Score Focus Card
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                피트니스 트래커 스타일 도넛 차트 중심 — 매칭 점수가 지배적 시각 요소
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Fitness tracker style donut chart — match score as the dominant visual element
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* 요약 통계 패널 / Summary stats panel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* 평균 매칭 점수 / Average match score */}
          <div className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-2">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{avgScore}%</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">평균 매칭 / Avg Match</p>
          </div>

          {/* 최적 매칭 공고 수 / Excellent match count */}
          <div className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-600">{distribution.excellent}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">최적 매칭 / Excellent (90+)</p>
          </div>

          {/* 우수 매칭 공고 수 / Good match count */}
          <div className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-2">
              <ChevronUp className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-extrabold text-blue-600">{distribution.good}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">우수 매칭 / Good (70-89)</p>
          </div>

          {/* 보통/낮음 공고 수 / Fair+Low count */}
          <div className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 mb-2">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold text-amber-600">{distribution.fair + distribution.low}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">보통/낮음 / Fair+Low (&lt;70)</p>
          </div>
        </div>

        {/* 정렬 안내 / Sort notice */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <ChevronDown className="w-4 h-4" />
          <span>매칭 점수 높은 순 정렬 / Sorted by match score (descending)</span>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {sortedJobs.map((job, index) => (
            <MatchScoreCard
              key={job.id}
              job={job}
              rank={index + 1}
              isTopPerformer={job.matchScore === topScore}
            />
          ))}
        </div>

        {/* 하단 범례 / Bottom legend */}
        <div className="mt-8 bg-white rounded-xl p-4 shadow-sm ring-1 ring-gray-100">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
            매칭 점수 범례 / Match Score Legend
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-gray-500">90%+ 최적 매칭 / Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-[11px] text-gray-500">70-89% 우수 매칭 / Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-[11px] text-gray-500">50-69% 보통 매칭 / Fair</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-[11px] text-gray-500">&lt;50% 낮은 매칭 / Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
              <span className="text-[11px] text-gray-500">최고 점수 / Top Performer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
