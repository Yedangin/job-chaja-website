'use client';

// 시안 20: 대시보드 위젯 카드 / Variant 20: Dashboard Widget Card
// 어드민/분석 대시보드 스타일 — 지표 숫자, CSS 바 차트, 스파크라인, 그리드 레이아웃
// Admin/analytics dashboard style — metric numbers, CSS bar charts, sparklines, grid layout

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  Users,
  Eye,
  Target,
  TrendingUp,
  TrendingDown,
  Briefcase,
  MapPin,
  Clock,
  Crown,
  BarChart3,
  Activity,
  ArrowUpRight,
  Calendar,
  Zap,
  Shield,
} from 'lucide-react';

// 지원자 트렌드 가짜 데이터 생성 (7일) / Generate fake applicant trend data (7 days)
function getApplicantTrend(jobId: string): number[] {
  const seed = jobId.charCodeAt(jobId.length - 1);
  const base = seed % 20 + 5;
  return Array.from({ length: 7 }, (_, i) => {
    const wave = Math.sin((seed + i) * 0.8) * 10;
    return Math.max(1, Math.floor(base + wave + i * 1.5));
  });
}

// 조회수 스파크라인 데이터 (14일) / View sparkline data (14 days)
function getViewSparkline(jobId: string): number[] {
  const seed = jobId.charCodeAt(jobId.length - 1);
  return Array.from({ length: 14 }, (_, i) => {
    const wave = Math.sin((seed * 2 + i) * 0.5) * 30;
    return Math.max(5, Math.floor(50 + wave + i * 3));
  });
}

// 트렌드 방향 결정 / Determine trend direction
function getTrend(data: number[]): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';
  const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const older = data.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  if (recent > older * 1.1) return 'up';
  if (recent < older * 0.9) return 'down';
  return 'stable';
}

// CSS 전용 미니 바 차트 컴포넌트 / CSS-only mini bar chart component
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const maxVal = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px] h-10">
      {data.map((val, i) => {
        const height = maxVal > 0 ? (val / maxVal) * 100 : 0;
        const isLast = i === data.length - 1;
        return (
          <div
            key={i}
            className={`
              w-full rounded-t-sm transition-all duration-300
              ${isLast ? color : `${color} opacity-60`}
            `}
            style={{ height: `${height}%`, minHeight: '2px' }}
          />
        );
      })}
    </div>
  );
}

// CSS 전용 스파크라인 컴포넌트 / CSS-only sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  return (
    <div className="flex items-end gap-[2px] h-8">
      {data.map((val, i) => {
        const normalized = ((val - minVal) / range) * 100;
        return (
          <div
            key={i}
            className={`w-[3px] rounded-full ${color}`}
            style={{
              height: `${Math.max(normalized, 8)}%`,
              opacity: 0.4 + (i / data.length) * 0.6,
            }}
          />
        );
      })}
    </div>
  );
}

// 개별 대시보드 위젯 카드 컴포넌트 / Individual dashboard widget card component
function DashboardCard({
  job,
  isWide,
}: {
  job: MockJobPosting;
  isWide: boolean;
}) {
  // 기본 데이터 계산 / Calculate base data
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const isPremium = job.tierType === 'PREMIUM';
  const isClosed = dDay === '마감';
  const applicantTrend = getApplicantTrend(job.id);
  const viewSparkline = getViewSparkline(job.id);
  const trend = getTrend(applicantTrend);

  // 전주 대비 변화율 계산 / Calculate week-over-week change
  const recentAvg = applicantTrend.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const olderAvg = applicantTrend.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const changePercent = olderAvg > 0
    ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
    : 0;

  return (
    <div
      className={`
        ${isWide ? 'md:col-span-2' : ''}
        bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
        hover:shadow-md transition-shadow duration-200 cursor-pointer
        ${isClosed ? 'opacity-60' : ''}
      `}
    >
      {/* 프리미엄 상단 골드 스트립 / Premium golden header strip */}
      {isPremium ? (
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />
      ) : (
        <div className="h-1 bg-gray-100" />
      )}

      <div className="p-4 sm:p-5">
        {/* 상단: 공고 기본 정보 바 / Top: Job basic info bar */}
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isPremium && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">
                  <Crown className="w-3 h-3" />
                  PREMIUM
                </span>
              )}
              {job.isUrgent && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">
                  <Zap className="w-3 h-3" />
                  긴급
                </span>
              )}
              {dDay && (
                <span className={`text-xs font-semibold ${
                  dDay === '마감' ? 'text-gray-400' :
                  dDay === 'D-Day' ? 'text-red-600' :
                  dDay === '상시모집' ? 'text-emerald-600' :
                  'text-blue-600'
                }`}>
                  {dDay}
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-gray-900 truncate mb-0.5" title={job.title}>
              {job.title}
            </h3>
            <p className="text-xs text-gray-500 truncate">{job.company}</p>
          </div>
          {/* 타임스탬프 / Timestamp */}
          <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 ml-2">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </div>
        </div>

        {/* 핵심 지표 행: 지원자, 조회수, 매칭점수 / Key metrics row: applicants, views, match score */}
        <div className={`grid ${isWide ? 'grid-cols-3 sm:grid-cols-3' : 'grid-cols-3'} gap-3 mb-4`}>
          {/* 지원자 수 / Applicant count */}
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] text-blue-500 font-medium">지원자</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-blue-700">
              {job.applicantCount}
            </p>
            {/* 트렌드 표시 / Trend indicator */}
            <div className={`flex items-center justify-center gap-0.5 mt-0.5 text-[10px] font-medium ${
              trend === 'up' ? 'text-emerald-600' :
              trend === 'down' ? 'text-red-500' :
              'text-gray-400'
            }`}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {changePercent > 0 ? '+' : ''}{changePercent}%
            </div>
          </div>

          {/* 조회수 / View count */}
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[10px] text-purple-500 font-medium">조회수</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-700">
              {job.viewCount.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">total</p>
          </div>

          {/* 매칭 점수 / Match score */}
          <div className="text-center p-2 bg-emerald-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] text-emerald-500 font-medium">매칭</span>
            </div>
            <p className={`text-xl sm:text-2xl font-extrabold ${
              (job.matchScore ?? 0) >= 80 ? 'text-emerald-700' :
              (job.matchScore ?? 0) >= 60 ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {job.matchScore ?? '--'}
              <span className="text-xs font-normal">%</span>
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">score</p>
          </div>
        </div>

        {/* 차트 영역 / Charts area */}
        {isWide ? (
          // 넓은 카드: 차트 2개 나란히 / Wide card: 2 charts side by side
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* 지원자 트렌드 바 차트 / Applicant trend bar chart */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  지원 추이 (7일) / Applicant Trend
                </span>
                <BarChart3 className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <MiniBarChart data={applicantTrend} color="bg-blue-500" />
              {/* 요일 라벨 / Day labels */}
              <div className="flex justify-between mt-1">
                {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                  <span key={day} className="text-[9px] text-gray-400">{day}</span>
                ))}
              </div>
            </div>

            {/* 조회수 스파크라인 / View sparkline */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  조회 추이 (14일) / View Trend
                </span>
                <Activity className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <Sparkline data={viewSparkline} color="bg-purple-500" />
            </div>
          </div>
        ) : (
          // 일반 카드: 바 차트만 / Normal card: bar chart only
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                지원 추이 / Trend
              </span>
              <BarChart3 className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <MiniBarChart data={applicantTrend} color="bg-blue-500" />
          </div>
        )}

        {/* 하단 컴팩트 공고 정보 / Bottom compact job info */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {job.experienceRequired ?? '무관'}
          </span>
          <span className="font-semibold text-gray-700">{salary}</span>
        </div>

        {/* 비자 배지 행 / Visa badge row */}
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
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant20Page() {
  // 요약 통계 계산 / Calculate summary stats
  const totalApplicants = sampleJobs.reduce((sum, j) => sum + j.applicantCount, 0);
  const totalViews = sampleJobs.reduce((sum, j) => sum + j.viewCount, 0);
  const avgMatchScore = Math.round(
    sampleJobs.reduce((sum, j) => sum + (j.matchScore ?? 0), 0) / sampleJobs.length
  );
  const premiumCount = sampleJobs.filter((j) => j.tierType === 'PREMIUM').length;
  const activeCount = sampleJobs.filter((j) => getDDay(j.closingDate) !== '마감').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 페이지 헤더 / Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                시안 20: Dashboard Widget Card
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                어드민/분석 대시보드 스타일 — 지표, 차트, 그리드 레이아웃
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Admin/analytics dashboard style — metrics, charts, grid layout
              </p>
            </div>
            {/* 타임스탬프 / Timestamp */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Activity className="w-4 h-4" />
              <span>실시간 / Live</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* 요약 통계 패널 / Summary stats panel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {/* 총 공고 수 / Total jobs */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">전체 공고</span>
              <Briefcase className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{sampleJobs.length}</p>
            <p className="text-[10px] text-emerald-600 font-medium mt-1">
              {activeCount}개 활성 / {activeCount} active
            </p>
          </div>

          {/* 총 지원자 / Total applicants */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">총 지원자</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-extrabold text-blue-700">{totalApplicants}</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3 h-3" />
              +12.3% 전주 대비
            </div>
          </div>

          {/* 총 조회수 / Total views */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">총 조회수</span>
              <Eye className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-purple-700">{totalViews.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3 h-3" />
              +8.7% 전주 대비
            </div>
          </div>

          {/* 평균 매칭 점수 / Average match score */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">평균 매칭</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-700">{avgMatchScore}%</p>
            <p className="text-[10px] text-gray-400 mt-1">avg match score</p>
          </div>

          {/* 프리미엄 공고 / Premium jobs */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-medium">프리미엄</span>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-amber-600">{premiumCount}</p>
            <p className="text-[10px] text-gray-400 mt-1">
              {sampleJobs.length}개 중 / of {sampleJobs.length}
            </p>
          </div>
        </div>

        {/* 대시보드 그리드: 혼합 크기 카드 / Dashboard grid: mixed-size cards */}
        {/* 프리미엄은 2칸, 일반은 1칸 / Premium spans 2 cols, standard 1 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sampleJobs.map((job) => (
            <DashboardCard
              key={job.id}
              job={job}
              isWide={job.tierType === 'PREMIUM'}
            />
          ))}
        </div>

        {/* 하단 범례 / Bottom legend */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 px-2 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded" />
            <span>프리미엄 / Premium (2칸)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-1 bg-gray-100 rounded" />
            <span>일반 / Standard (1칸)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[2px]">
              {[30, 60, 80, 50, 90].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-500 rounded-t-sm"
                  style={{ height: `${h * 0.12}px` }}
                />
              ))}
            </div>
            <span>지원자 추이 차트 / Applicant trend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[1px]">
              {[40, 70, 50, 80, 60, 90, 75].map((h, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-purple-500 rounded-full"
                  style={{ height: `${h * 0.1}px`, opacity: 0.4 + i * 0.08 }}
                />
              ))}
            </div>
            <span>조회수 스파크라인 / View sparkline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowUpRight className="w-3 h-3 text-emerald-500" />
            <span>상승 추세 / Uptrend</span>
          </div>
        </div>
      </div>
    </div>
  );
}
