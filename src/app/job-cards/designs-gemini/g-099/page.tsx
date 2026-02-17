'use client';

import { useState, useMemo } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
} from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Star,
  Clock,
  MapPin,
  Briefcase,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  Crown,
  DollarSign,
  Activity,
  Database,
  Layers,
  ArrowUpRight,
  Sparkles,
  GripVertical,
  Hash,
  Calendar,
  Building2,
  Shield,
} from 'lucide-react';

// 디자인 메타 정보 / Design meta information
export const designInfo = {
  id: 'g-099',
  title: 'Glassdoor x Stripe x Notion',
  description: 'Data-driven premium cards with salary charts, dashboard widgets, and database filter chips',
  author: 'Gemini',
  category: 'premium' as const,
  tags: ['glassdoor', 'stripe', 'notion', 'dashboard', 'data-driven', 'charts'],
};

// 급여 차트 바 컴포넌트 / Salary chart bar component
function SalaryChart({ job }: { job: MockJobPostingV2 }) {
  // 산업 평균 급여 기준 / Industry average salary baseline
  const industryAvg = job.boardType === 'FULL_TIME' ? 35000000 : 13000;
  const jobSalary = job.boardType === 'FULL_TIME'
    ? ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2
    : (job.hourlyWage || 0);
  const maxScale = industryAvg * 2;
  const jobPct = Math.min((jobSalary / maxScale) * 100, 100);
  const avgPct = Math.min((industryAvg / maxScale) * 100, 100);
  const isAboveAvg = jobSalary >= industryAvg;

  return (
    <div className="space-y-2">
      {/* 급여 비교 레이블 / Salary comparison label */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">급여 수준</span>
        <span className={`font-semibold ${isAboveAvg ? 'text-emerald-600' : 'text-amber-600'}`}>
          {isAboveAvg ? '평균 이상' : '평균 이하'}
        </span>
      </div>
      {/* 차트 바 / Chart bar */}
      <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
        {/* 이 직무 급여 / This job salary */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${jobPct}%`,
            background: isAboveAvg
              ? 'linear-gradient(90deg, #8b5cf6, #6d28d9)'
              : 'linear-gradient(90deg, #f59e0b, #d97706)',
          }}
        />
        {/* 평균 마커 / Average marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-slate-400"
          style={{ left: `${avgPct}%` }}
        />
        <div
          className="absolute -top-5 text-[10px] text-slate-400 font-medium whitespace-nowrap"
          style={{ left: `${avgPct}%`, transform: 'translateX(-50%)' }}
        >
          평균
        </div>
      </div>
      {/* 수치 / Values */}
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>0</span>
        <span>{formatSalary(job)}</span>
      </div>
    </div>
  );
}

// 스파크라인 미니 차트 / Sparkline mini chart
function Sparkline({ data, color = '#8b5cf6' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 끝점 도트 / End point dot */}
      {data.length > 0 && (
        <circle
          cx={(data.length - 1) / (data.length - 1) * width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="2.5"
          fill={color}
        />
      )}
    </svg>
  );
}

// 대시보드 위젯 / Dashboard widget component
function MetricWidget({
  icon: Icon,
  label,
  value,
  trend,
  sparkData,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  sparkData: number[];
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-white/60 rounded-lg border border-slate-100">
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${color}`}>
          <Icon className="w-3 h-3 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] text-slate-400 truncate">{label}</div>
          <div className="text-xs font-bold text-slate-700">{value}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Sparkline data={sparkData} color={color.includes('purple') ? '#8b5cf6' : color.includes('emerald') ? '#10b981' : '#6366f1'} />
        {trend && (
          <span className="text-[10px] font-semibold text-emerald-500">{trend}</span>
        )}
      </div>
    </div>
  );
}

// Notion 스타일 프로퍼티 칩 / Notion-style property chip
function PropertyChip({
  icon: Icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  colorClass?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${colorClass || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      <Icon className="w-3 h-3 opacity-60" />
      <span className="text-slate-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}

// 별점 렌더러 / Star rating renderer
function StarRating({ score }: { score: number }) {
  const fullStars = Math.floor(score / 20);
  const partialWidth = ((score % 20) / 20) * 100;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="relative w-3.5 h-3.5">
          <Star className="w-3.5 h-3.5 text-slate-200 fill-slate-200 absolute" />
          {i < fullStars && (
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 absolute" />
          )}
          {i === fullStars && partialWidth > 0 && (
            <div className="absolute overflow-hidden" style={{ width: `${partialWidth}%` }}>
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
          )}
        </div>
      ))}
      <span className="ml-1 text-xs font-bold text-slate-600">{(score / 20).toFixed(1)}</span>
    </div>
  );
}

// 필터 바 컴포넌트 / Filter bar component
function FilterBar({
  activeFilters,
  onToggle,
  onClear,
}: {
  activeFilters: string[];
  onToggle: (filter: string) => void;
  onClear: () => void;
}) {
  const filters = [
    { key: 'PREMIUM', label: 'Premium', icon: Crown },
    { key: 'FULL_TIME', label: '정규직', icon: Briefcase },
    { key: 'PART_TIME', label: '알바', icon: Clock },
    { key: 'URGENT', label: '긴급', icon: Zap },
    { key: 'HIGH_PAY', label: '고급여', icon: DollarSign },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
        <Filter className="w-3.5 h-3.5" />
        <span className="font-medium">Filters</span>
      </div>
      {filters.map((f) => {
        const isActive = activeFilters.includes(f.key);
        return (
          <button
            key={f.key}
            onClick={() => onToggle(f.key)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-200 ${
              isActive
                ? 'bg-violet-50 text-violet-700 border-violet-300 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <f.icon className="w-3 h-3" />
            {f.label}
            {isActive && <X className="w-2.5 h-2.5 ml-0.5" />}
          </button>
        );
      })}
      {activeFilters.length > 0 && (
        <button
          onClick={onClear}
          className="text-xs text-violet-500 hover:text-violet-700 font-medium ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

// 잡 카드 메인 컴포넌트 / Job card main component
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);

  // 가짜 스파크라인 데이터 생성 / Generate fake sparkline data
  const viewSparkData = useMemo(
    () => Array.from({ length: 7 }, (_, i) => Math.floor(job.viewCount / 7 * (0.6 + Math.random() * 0.8) * (i + 1) / 4)),
    [job.viewCount]
  );
  const applicantSparkData = useMemo(
    () => Array.from({ length: 7 }, (_, i) => Math.floor(job.applicantCount / 5 * (0.5 + Math.random() * 1) * (i + 1) / 4)),
    [job.applicantCount]
  );

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
        job.tierType === 'PREMIUM'
          ? 'border-violet-200 shadow-[0_1px_3px_rgba(139,92,246,0.12)]'
          : 'border-slate-200 shadow-sm'
      } ${isHovered ? 'shadow-xl shadow-violet-100/50 -translate-y-1 border-violet-300' : 'hover:shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stripe 스타일 상단 그라디언트 라인 / Stripe-style top gradient line */}
      <div
        className={`h-[3px] w-full transition-all duration-300 ${
          job.tierType === 'PREMIUM'
            ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500'
            : 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200'
        } ${isHovered ? 'h-[4px]' : ''}`}
      />

      {/* 카드 내용 / Card content */}
      <div className="p-5">
        {/* 헤더: 로고 + 기업 + 배지 / Header: logo + company + badges */}
        <div className="flex items-start gap-3 mb-3">
          {/* 회사 로고 / Company logo */}
          <div className="relative w-11 h-11 rounded-lg border border-slate-100 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.className = 'text-sm font-bold text-violet-600';
                  fallback.textContent = job.companyInitial;
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* 기업명 + 산업 / Company + industry */}
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-slate-800 truncate">{job.company}</span>
              {job.tierType === 'PREMIUM' && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gradient-to-r from-violet-500 to-purple-600 text-[10px] font-bold text-white whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5" />
                  PRO
                </span>
              )}
            </div>
            {/* 위치 + 산업 / Location + industry */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-0.5">
                <Building2 className="w-3 h-3" />
                {job.industry}
              </span>
            </div>
          </div>

          {/* D-Day + 긴급 배지 / D-Day + urgent badge */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {job.isUrgent && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold border border-red-200">
                <Zap className="w-2.5 h-2.5 fill-red-500" />
                긴급
              </span>
            )}
            {dday && (
              <span className={`text-xs font-bold ${
                dday === '마감' ? 'text-slate-400' :
                dday === 'D-Day' || (dday.startsWith('D-') && parseInt(dday.slice(2)) <= 3) ? 'text-red-500' :
                'text-violet-600'
              }`}>
                {dday}
              </span>
            )}
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className="text-base font-bold text-slate-900 mb-3 leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors">
          {job.title}
        </h3>

        {/* Notion 스타일 프로퍼티 행 / Notion-style property row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <PropertyChip
            icon={Briefcase}
            label=""
            value={job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
            colorClass={job.boardType === 'FULL_TIME' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-teal-50 text-teal-700 border-teal-200'}
          />
          <PropertyChip
            icon={DollarSign}
            label=""
            value={salary}
            colorClass="bg-emerald-50 text-emerald-700 border-emerald-200"
          />
          <PropertyChip
            icon={Clock}
            label=""
            value={job.workHours || '-'}
            colorClass="bg-slate-50 text-slate-600 border-slate-200"
          />
          {job.experienceRequired && (
            <PropertyChip
              icon={Layers}
              label=""
              value={job.experienceRequired}
              colorClass="bg-purple-50 text-purple-600 border-purple-200"
            />
          )}
        </div>

        {/* 비자 칩 / Visa chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          <span className="flex items-center gap-0.5 text-[10px] text-slate-400 mr-1">
            <Shield className="w-3 h-3" />
            비자
          </span>
          {job.allowedVisas.map((visa) => {
            const vc = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${vc.bg} ${vc.text}`}
              >
                {visa}
              </span>
            );
          })}
        </div>

        {/* Glassdoor 스타일 급여 차트 + 매치점수 / Glassdoor-style salary chart + match score */}
        <div className="bg-slate-50/80 rounded-lg p-3 mb-3 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <BarChart3 className="w-3.5 h-3.5 text-violet-500" />
              급여 분석
            </div>
            {job.matchScore && (
              <div className="flex items-center gap-1.5">
                <StarRating score={job.matchScore} />
              </div>
            )}
          </div>
          <SalaryChart job={job} />
        </div>

        {/* 호버 시 Stripe 대시보드 위젯 / Stripe dashboard widgets on hover */}
        <div
          className={`overflow-hidden transition-all duration-400 ease-in-out ${
            isHovered ? 'max-h-[200px] opacity-100 mb-3' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-2 pt-1">
            <MetricWidget
              icon={Eye}
              label="7일 조회수"
              value={job.viewCount.toLocaleString()}
              trend={`+${Math.floor(job.viewCount * 0.12)}%`}
              sparkData={viewSparkData}
              color="bg-purple-500"
            />
            <MetricWidget
              icon={Users}
              label="총 지원자"
              value={`${job.applicantCount}명`}
              trend={`+${Math.floor(job.applicantCount * 0.08)}%`}
              sparkData={applicantSparkData}
              color="bg-emerald-500"
            />
          </div>
        </div>

        {/* 호버 시 복리후생 확장 / Benefits expansion on hover */}
        <div
          className={`overflow-hidden transition-all duration-400 ease-in-out ${
            isHovered ? 'max-h-[120px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {job.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1 pb-2">
              {job.benefits.map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-medium rounded-full border border-violet-100"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 하단: 매치 스코어 바 + 액션 / Bottom: match score bar + actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {/* 매치 스코어 진행 바 / Match score progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400">Match</span>
            <div className="relative w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600 transition-all duration-500"
                style={{ width: `${job.matchScore || 0}%` }}
              />
            </div>
            <span className="text-xs font-bold text-violet-600">{job.matchScore || 0}%</span>
          </div>

          {/* 지원 버튼 / Apply button */}
          <button
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              job.tierType === 'PREMIUM'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-sm shadow-violet-200'
                : 'bg-slate-800 text-white hover:bg-slate-900'
            }`}
          >
            지원하기
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G099Page() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 필터 토글 / Filter toggle
  const handleToggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // 필터링된 잡 목록 / Filtered job list
  const filteredJobs = useMemo(() => {
    if (activeFilters.length === 0) return sampleJobsV2;
    return sampleJobsV2.filter((job) => {
      return activeFilters.every((filter) => {
        switch (filter) {
          case 'PREMIUM': return job.tierType === 'PREMIUM';
          case 'FULL_TIME': return job.boardType === 'FULL_TIME';
          case 'PART_TIME': return job.boardType === 'PART_TIME';
          case 'URGENT': return job.isUrgent;
          case 'HIGH_PAY': return (job.salaryMax && job.salaryMax >= 40000000) || (job.hourlyWage && job.hourlyWage >= 15000);
          default: return true;
        }
      });
    });
  }, [activeFilters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* 상단 헤더 / Top header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 타이틀 영역 / Title area */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">채용 데이터베이스</h1>
          </div>
          <p className="text-sm text-slate-500 ml-10">
            급여 분석, 실시간 통계, 비자 매칭을 한눈에
          </p>
        </div>

        {/* 글로벌 통계 대시보드 / Global stats dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800">{sampleJobsV2.length}</div>
              <div className="text-xs text-slate-400">전체 공고</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800">
                {sampleJobsV2.reduce((s, j) => s + j.applicantCount, 0)}
              </div>
              <div className="text-xs text-slate-400">총 지원자</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800">
                {Math.round(sampleJobsV2.reduce((s, j) => s + (j.matchScore || 0), 0) / sampleJobsV2.length)}%
              </div>
              <div className="text-xs text-slate-400">평균 매치</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800">
                {sampleJobsV2.reduce((s, j) => s + j.viewCount, 0).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">총 조회수</div>
            </div>
          </div>
        </div>

        {/* Notion 스타일 필터 바 / Notion-style filter bar */}
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <FilterBar
            activeFilters={activeFilters}
            onToggle={handleToggleFilter}
            onClear={() => setActiveFilters([])}
          />
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Database className="w-3.5 h-3.5" />
            <span>{filteredJobs.length}개 결과</span>
          </div>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredJobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>

        {/* 결과 없음 / No results */}
        {filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Filter className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-lg font-medium text-slate-500 mb-1">필터 조건에 맞는 공고가 없습니다</p>
            <p className="text-sm">필터를 조정하거나 초기화해 보세요</p>
            <button
              onClick={() => setActiveFilters([])}
              className="mt-4 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* 푸터 디자인 정보 / Footer design info */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Hash className="w-3.5 h-3.5" />
            <span>{designInfo.id}</span>
            <span className="text-slate-200">|</span>
            <span>{designInfo.title}</span>
          </div>
          <div>by {designInfo.author}</div>
        </div>
      </div>
    </div>
  );
}
