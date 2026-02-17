'use client';

import { useState } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Briefcase,
  TrendingUp,
  ChevronRight,
  Star,
  Zap,
  CheckCircle2,
  BarChart3,
  Send,
  Building2,
  GraduationCap,
  Shield,
  Award,
  ArrowUpRight,
  Heart,
  Share2,
  DollarSign,
} from 'lucide-react';

// 디자인 정보 / Design info
export const designInfo = {
  id: 'g-077',
  name: 'LinkedIn\u00d7Indeed\u00d7Glassdoor',
  category: 'premium',
  author: 'Gemini',
};

// 연봉 바 차트 컴포넌트 (Glassdoor 스타일) / Salary bar chart component (Glassdoor style)
function SalaryBarChart({ job }: { job: MockJobPostingV2 }) {
  if (!job.salaryMin || !job.salaryMax) return null;

  const min = Math.round(job.salaryMin / 10000);
  const max = Math.round(job.salaryMax / 10000);
  const mid = Math.round((min + max) / 2);
  // 시장 평균 (가상) / Market average (simulated)
  const marketAvg = Math.round(min * 0.9);
  const maxRange = max * 1.2;

  const minPercent = (min / maxRange) * 100;
  const maxPercent = (max / maxRange) * 100;
  const midPercent = (mid / maxRange) * 100;
  const avgPercent = (marketAvg / maxRange) * 100;

  return (
    <div className="mt-3 space-y-2">
      {/* 급여 범위 바 / Salary range bar */}
      <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
        {/* 시장 평균선 / Market average line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
          style={{ left: `${avgPercent}%` }}
        />
        {/* 급여 범위 / Salary range */}
        <div
          className="absolute top-1 bottom-1 bg-gradient-to-r from-sky-400 to-blue-600 rounded-md"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        {/* 중간값 마커 / Median marker */}
        <div
          className="absolute top-0 bottom-0 flex items-center z-10"
          style={{ left: `${midPercent}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-3 h-3 bg-white border-2 border-blue-700 rounded-full shadow-sm" />
        </div>
      </div>
      {/* 라벨 / Labels */}
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>{min.toLocaleString()}만</span>
        <span className="text-blue-700 font-semibold">중간 {mid.toLocaleString()}만</span>
        <span>{max.toLocaleString()}만</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        <div className="w-2 h-0.5 bg-slate-400 rounded" />
        <span>업계 평균 {marketAvg.toLocaleString()}만원</span>
      </div>
    </div>
  );
}

// 매칭 점수 링 (LinkedIn 스타일) / Match score ring (LinkedIn style)
function MatchScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? 'stroke-emerald-500'
      : score >= 60
        ? 'stroke-amber-500'
        : 'stroke-red-400';

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          className={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-slate-700">{score}%</span>
    </div>
  );
}

// 잡 카드 컴포넌트 / Job card component
function JobCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const isPremium = job.tierType === 'PREMIUM';
  const isFullTime = job.boardType === 'FULL_TIME';

  return (
    <div
      className={`
        relative bg-white rounded-xl border transition-all duration-300 overflow-hidden
        ${isHovered
          ? 'border-blue-300 shadow-xl shadow-blue-100/50 -translate-y-1'
          : 'border-slate-200 shadow-sm hover:shadow-md'
        }
        ${isPremium ? 'ring-1 ring-blue-100' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 프리미엄 상단 바 / Premium top bar */}
      {isPremium && (
        <div className="h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600" />
      )}

      {/* 메인 콘텐츠 영역 / Main content area */}
      <div className="p-5">
        {/* 상단: 회사 정보 + 액션 (LinkedIn 스타일) / Top: Company info + actions (LinkedIn style) */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* 회사 로고 / Company logo */}
            <div className="relative">
              <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-9 h-9 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-lg font-bold text-blue-600">${job.companyInitial}</span>`;
                    }
                  }}
                />
              </div>
              {/* 인증 배지 / Verified badge */}
              {isPremium && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            {/* 회사명 + 위치 / Company name + location */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                {job.company}
                {isPremium && (
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                )}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{job.location}</span>
                <span className="text-slate-300 mx-0.5">|</span>
                <Building2 className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{job.industry}</span>
              </div>
            </div>
          </div>

          {/* 저장/공유 버튼 (LinkedIn 스타일) / Save/Share buttons (LinkedIn style) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-1.5 rounded-full transition-colors ${
                isSaved
                  ? 'text-red-500 bg-red-50'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
            </button>
            <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h2 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {job.title}
        </h2>

        {/* 태그 행: 배지들 / Tag row: badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {job.isUrgent && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
              <Zap className="w-2.5 h-2.5" />
              긴급
            </span>
          )}
          {job.isFeatured && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-amber-900 rounded-full">
              <Star className="w-2.5 h-2.5" />
              추천
            </span>
          )}
          <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
            isFullTime
              ? 'bg-blue-50 text-blue-700'
              : 'bg-teal-50 text-teal-700'
          }`}>
            {isFullTime ? '정규직' : '파트타임'}
          </span>
          {dDay && (
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
              dDay === '마감'
                ? 'bg-slate-100 text-slate-500'
                : dDay === 'D-Day' || (dDay.startsWith('D-') && parseInt(dDay.slice(2)) <= 3)
                  ? 'bg-red-50 text-red-600'
                  : 'bg-slate-50 text-slate-600'
            }`}>
              {dDay}
            </span>
          )}
        </div>

        {/* 급여 정보 + 차트 (Glassdoor 스타일) / Salary info + chart (Glassdoor style) */}
        <div className="bg-slate-50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">예상 급여 / Salary</p>
                <p className="text-sm font-bold text-slate-800">{salary}</p>
              </div>
            </div>
            {job.salaryMin && job.salaryMax && (
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>시장 대비 +12%</span>
              </div>
            )}
          </div>
          {/* Glassdoor 스타일 급여 바 차트 / Glassdoor-style salary bar chart */}
          <SalaryBarChart job={job} />
        </div>

        {/* 근무 조건 (LinkedIn 스타일 아이콘 리스트) / Work conditions (LinkedIn-style icon list) */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {job.workHours && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{job.workHours}</span>
            </div>
          )}
          {job.experienceRequired && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.experienceRequired}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>지원자 {job.applicantCount}명</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>조회 {job.viewCount.toLocaleString()}</span>
          </div>
        </div>

        {/* 비자 칩 / Visa chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {job.allowedVisas.map((visa) => {
            const color = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${color.bg} ${color.text}`}
              >
                {visa}
              </span>
            );
          })}
        </div>

        {/* 복리후생 (칩) / Benefits (chips) */}
        {job.benefits.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.benefits.slice(0, 4).map((benefit) => (
              <span
                key={benefit}
                className="px-2 py-0.5 text-[10px] text-slate-500 bg-white border border-slate-200 rounded-md"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] text-slate-400">
                +{job.benefits.length - 4}
              </span>
            )}
          </div>
        )}

        {/* 호버 시 프로필 매칭 패널 / Profile matching panel on hover */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isHovered ? 'max-h-40 opacity-100 mb-3' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-dashed border-blue-200 pt-3">
            <div className="flex items-center gap-3">
              {/* 매칭 점수 링 / Match score ring */}
              {job.matchScore && <MatchScoreRing score={job.matchScore} />}
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-700 mb-1.5">
                  프로필 매칭 분석 / Profile Match
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-slate-600">비자 자격 충족</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-slate-600">근무 조건 적합</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(job.matchScore ?? 0) >= 70 ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border-2 border-amber-400" />
                    )}
                    <span className="text-[10px] text-slate-600">경력 요건 일치</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단: 원클릭 지원 버튼 (Indeed 스타일) / Bottom: One-click apply button (Indeed style) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsApplied(!isApplied)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isApplied
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-200'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                지원 완료
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                간편 지원하기
              </>
            )}
          </button>
          <button className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 하단 연결 바 (LinkedIn "사람도 이 공고에 지원했습니다" 스타일) / Bottom connection bar */}
      <div className={`transition-all duration-300 ${isHovered ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 px-5 py-2.5 border-t border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center">
                  <span className="text-[8px] font-bold text-blue-700">A</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-sky-200 border-2 border-white flex items-center justify-center">
                  <span className="text-[8px] font-bold text-sky-700">B</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center">
                  <span className="text-[8px] font-bold text-indigo-700">C</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500">
                {job.applicantCount > 10
                  ? `${job.applicantCount - 3}명이 더 지원했습니다`
                  : '지원자가 빠르게 증가 중'}
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G077Page() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'fulltime' | 'parttime'>('all');

  const filteredJobs = sampleJobsV2.filter((job) => {
    if (activeFilter === 'fulltime') return job.boardType === 'FULL_TIME';
    if (activeFilter === 'parttime') return job.boardType === 'PART_TIME';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* 상단 헤더 (LinkedIn 스타일 네이비 블루) / Top header (LinkedIn-style navy blue) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 로고 영역 / Logo area */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-blue-900 leading-none">JobChaJa</h1>
                  <p className="text-[10px] text-slate-400">외국인 채용 플랫폼</p>
                </div>
              </div>

              {/* 필터 탭 / Filter tabs */}
              <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 ml-4">
                {[
                  { key: 'all' as const, label: '전체' },
                  { key: 'fulltime' as const, label: '정규직' },
                  { key: 'parttime' as const, label: '파트타임' },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeFilter === filter.key
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 통계 요약 / Stats summary */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                  <span><strong className="text-slate-700">{sampleJobsV2.length}</strong>개 공고</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span><strong className="text-slate-700">
                    {sampleJobsV2.filter((j) => j.tierType === 'PREMIUM').length}
                  </strong>개 프리미엄</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 콘텐츠 / Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 결과 카운트 + 정렬 / Result count + sort */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-600">
            <strong className="text-slate-800">{filteredJobs.length}개</strong>의 채용 공고
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>매칭도순 정렬</span>
          </div>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* 하단 안내 / Bottom info */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-sm">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-slate-600">
              모든 급여 데이터는 공고 정보 기반입니다
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}