// 시안: g-008 'Glassdoor 인사이트 (Glassdoor Insight)'
// Design: g-008 'Glassdoor Insight'
// 카테고리: 프리미엄 / Category: Premium
// 레퍼런스: Glassdoor / Reference: Glassdoor
// hover: 카드 확장 (height 증가) + 연봉 비교 미니 바 차트 노출
// Hover: Card expand (height increase) + salary comparison mini bar chart reveal
// 핵심: 연봉 그래프(CSS bar chart), 기업 평점(별 5개), 면접 난이도, 추천율(%), CEO 승인율 목업
// Key: Salary graph (CSS bar chart), company rating (5 stars), interview difficulty, recommendation %, CEO approval mockup

'use client';

import { useState, useMemo } from 'react';
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  ThumbsUp,
  UserCheck,
  BarChart3,
  Briefcase,
  Users,
  Eye,
  Zap,
  Award,
  ChevronDown,
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getTimeAgo,
  getIndustryColor,
  getVisaColor,
} from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';

// 기업별 Glassdoor 인사이트 목업 데이터 / Glassdoor insight mockup data per company
interface GlassdoorInsight {
  rating: number; // 기업 평점 (1~5) / Company rating
  interviewDifficulty: 'Easy' | 'Medium' | 'Hard'; // 면접 난이도 / Interview difficulty
  recommendRate: number; // 추천율 (%) / Recommendation rate
  ceoApproval: number; // CEO 승인율 (%) / CEO approval rate
  salaryComparison: {
    // 업계 연봉 비교 / Industry salary comparison
    industryMin: number; // 업계 최저 / Industry min
    industryAvg: number; // 업계 평균 / Industry avg
    industryMax: number; // 업계 최고 / Industry max
  };
}

// 공고별 인사이트 목업 / Insight mockup per job posting
const insightMap: Record<string, GlassdoorInsight> = {
  'job-001': {
    rating: 4.3,
    interviewDifficulty: 'Medium',
    recommendRate: 88,
    ceoApproval: 82,
    salaryComparison: { industryMin: 24000000, industryAvg: 32000000, industryMax: 45000000 },
  },
  'job-002': {
    rating: 3.9,
    interviewDifficulty: 'Easy',
    recommendRate: 76,
    ceoApproval: 70,
    salaryComparison: { industryMin: 10000, industryAvg: 13000, industryMax: 16000 },
  },
  'job-003': {
    rating: 4.7,
    interviewDifficulty: 'Hard',
    recommendRate: 94,
    ceoApproval: 91,
    salaryComparison: { industryMin: 40000000, industryAvg: 58000000, industryMax: 85000000 },
  },
  'job-004': {
    rating: 3.6,
    interviewDifficulty: 'Medium',
    recommendRate: 68,
    ceoApproval: 65,
    salaryComparison: { industryMin: 14000, industryAvg: 17500, industryMax: 22000 },
  },
  'job-005': {
    rating: 4.1,
    interviewDifficulty: 'Easy',
    recommendRate: 82,
    ceoApproval: 78,
    salaryComparison: { industryMin: 11000, industryAvg: 14500, industryMax: 18000 },
  },
  'job-006': {
    rating: 4.5,
    interviewDifficulty: 'Hard',
    recommendRate: 90,
    ceoApproval: 86,
    salaryComparison: { industryMin: 26000000, industryAvg: 36000000, industryMax: 50000000 },
  },
};

// 별점 렌더링 컴포넌트 / Star rating renderer component
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {/* 꽉 찬 별 / Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
      {/* 반 별 / Half star */}
      {hasHalf && (
        <div className="relative w-4 h-4">
          <Star className="absolute w-4 h-4 text-gray-300" />
          <div className="absolute overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      )}
      {/* 빈 별 / Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
}

// 면접 난이도 배지 / Interview difficulty badge
function DifficultyBadge({ difficulty }: { difficulty: 'Easy' | 'Medium' | 'Hard' }) {
  const styles: Record<string, string> = {
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-100 text-red-700 border-red-200',
  };
  const labels: Record<string, string> = {
    Easy: '쉬움',
    Medium: '보통',
    Hard: '어려움',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${styles[difficulty]}`}>
      {labels[difficulty]} ({difficulty})
    </span>
  );
}

// 연봉 바 차트 컴포넌트 / Salary bar chart component
function SalaryBarChart({
  job,
  insight,
}: {
  job: MockJobPostingV2;
  insight: GlassdoorInsight;
}) {
  const { industryMin, industryAvg, industryMax } = insight.salaryComparison;
  const totalRange = industryMax - industryMin;
  if (totalRange <= 0) return null;

  // 이 공고의 연봉 범위 계산 / Calculate this posting's salary range
  const jobMin = job.salaryMin ?? job.hourlyWage ?? industryMin;
  const jobMax = job.salaryMax ?? job.hourlyWage ?? industryMax;

  const barLeft = Math.max(0, ((jobMin - industryMin) / totalRange) * 100);
  const barWidth = Math.min(100 - barLeft, ((jobMax - jobMin) / totalRange) * 100);
  const avgPosition = ((industryAvg - industryMin) / totalRange) * 100;

  // 포맷 함수 / Format function
  const fmt = (val: number): string => {
    if (val >= 10000000) return `${Math.round(val / 10000).toLocaleString()}만`;
    if (val >= 10000) return `${(val / 10000).toFixed(1)}만`;
    return `${val.toLocaleString()}원`;
  };

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-1.5 font-medium flex items-center gap-1">
        <BarChart3 className="w-3.5 h-3.5" />
        {/* 업계 연봉 비교 / Industry salary comparison */}
        업계 연봉 비교
      </p>
      <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        {/* 이 공고의 연봉 범위 바 / This posting's salary range bar */}
        <div
          className="absolute h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
          style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 4)}%` }}
        />
        {/* 업계 평균 마커 / Industry average marker */}
        <div
          className="absolute top-0 h-3 w-0.5 bg-gray-600"
          style={{ left: `${avgPosition}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{fmt(industryMin)}</span>
        <span className="text-gray-600 font-medium">평균 {fmt(industryAvg)}</span>
        <span>{fmt(industryMax)}</span>
      </div>
    </div>
  );
}

// 공고 카드 컴포넌트 / Job card component
function JobCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false);
  const insight = insightMap[job.id];
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const industryColor = getIndustryColor(job.industry);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-white border rounded-xl overflow-hidden transition-all duration-400 ease-in-out cursor-pointer
        ${job.tierType === 'PREMIUM' ? 'border-amber-300 shadow-md' : 'border-gray-200 shadow-sm'}
        ${isHovered ? 'shadow-xl -translate-y-1' : 'hover:shadow-md'}
      `}
    >
      {/* 프리미엄 상단 바 / Premium top bar */}
      {job.tierType === 'PREMIUM' && (
        <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
      )}

      <div className="p-5">
        {/* 상단: 로고 + 기업정보 + 평점 / Top: Logo + company info + rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* 기업 로고 / Company logo */}
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="h-8 w-auto object-contain flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="min-w-0">
              <p className="text-sm text-gray-500 truncate">{job.company}</p>
              <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">
                {job.title}
              </h3>
            </div>
          </div>
          {/* 기업 평점 / Company rating */}
          {insight && (
            <div className="flex-shrink-0 text-right">
              <StarRating rating={insight.rating} />
              <p className="text-xs text-gray-500 mt-0.5">{insight.rating.toFixed(1)}</p>
            </div>
          )}
        </div>

        {/* 배지 행: 산업, 비자, 긴급, 추천 / Badge row: industry, visa, urgent, featured */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${industryColor.bg} ${industryColor.text}`}>
            {job.industry}
          </span>
          {job.allowedVisas.slice(0, 3).map((visa) => {
            const vc = getVisaColor(visa);
            return (
              <span key={visa} className={`text-xs font-medium px-2 py-0.5 rounded-full ${vc.bg} ${vc.text}`}>
                {visa}
              </span>
            );
          })}
          {job.allowedVisas.length > 3 && (
            <span className="text-xs text-gray-500 px-1.5 py-0.5">+{job.allowedVisas.length - 3}</span>
          )}
          {job.isUrgent && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> 긴급
            </span>
          )}
          {job.isFeatured && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 flex items-center gap-0.5">
              <Award className="w-3 h-3" /> 추천
            </span>
          )}
        </div>

        {/* 기본 정보: 위치, 급여, 시간 / Basic info: location, salary, hours */}
        <div className="mt-3 space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="font-medium text-gray-800">{salary}</span>
          </div>
          {job.workHours && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{job.workHours}</span>
            </div>
          )}
        </div>

        {/* 하단 메타: D-Day, 지원자, 조회수 / Bottom meta: D-Day, applicants, views */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className={`font-bold ${dday === '마감' ? 'text-gray-400' : dday === 'D-Day' ? 'text-red-500' : 'text-blue-600'}`}>
              {dday}
            </span>
            <span className="flex items-center gap-0.5">
              <Users className="w-3.5 h-3.5" /> {job.applicantCount}명
            </span>
            <span className="flex items-center gap-0.5">
              <Eye className="w-3.5 h-3.5" /> {job.viewCount.toLocaleString()}
            </span>
          </div>
          <span>{timeAgo}</span>
        </div>

        {/* 호버 시 확장: Glassdoor 인사이트 패널 / Hover expansion: Glassdoor insight panel */}
        <div
          className={`overflow-hidden transition-all duration-400 ease-in-out ${
            isHovered ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="pt-3 border-t border-dashed border-gray-200">
            {/* 확장 헤더 / Expansion header */}
            <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-teal-600" />
              {/* 기업 인사이트 / Company Insights */}
              기업 인사이트 (Insights)
            </p>

            {insight && (
              <>
                {/* 3열 통계: 면접 난이도, 추천율, CEO 승인율 / 3-col stats */}
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  {/* 면접 난이도 / Interview difficulty */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-500 mb-1">면접 난이도</p>
                    <DifficultyBadge difficulty={insight.interviewDifficulty} />
                  </div>
                  {/* 추천율 / Recommendation rate */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-500 mb-1">추천율</p>
                    <p className="text-lg font-bold text-green-600 flex items-center justify-center gap-0.5">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {insight.recommendRate}%
                    </p>
                  </div>
                  {/* CEO 승인율 / CEO approval rate */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-500 mb-1">CEO 지지율</p>
                    <p className="text-lg font-bold text-blue-600 flex items-center justify-center gap-0.5">
                      <UserCheck className="w-3.5 h-3.5" />
                      {insight.ceoApproval}%
                    </p>
                  </div>
                </div>

                {/* 연봉 비교 바 차트 / Salary comparison bar chart */}
                <SalaryBarChart job={job} insight={insight} />
              </>
            )}
          </div>
        </div>

        {/* 호버 힌트 화살표 / Hover hint arrow */}
        <div
          className={`flex justify-center mt-2 transition-all duration-300 ${
            isHovered ? 'opacity-0' : 'opacity-50'
          }`}
        >
          <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 / Main page
export default function G008GlassdoorInsightPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 시안 정보 헤더 / Design info header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              PREMIUM
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
              g-008
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Glassdoor 인사이트 (Glassdoor Insight)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            카드 위에 마우스를 올리면 연봉 비교, 면접 난이도, 추천율 등 기업 인사이트가 펼쳐집니다.
            {/* Hover over a card to reveal company insights: salary comparison, interview difficulty, recommendation rate, etc. */}
          </p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-400">
            <span>레퍼런스: Glassdoor</span>
            <span>|</span>
            <span>hover: 카드 확장 + 연봉 바 차트</span>
            <span>|</span>
            <span>핵심: 기업 평점, 면접 난이도, 추천율, CEO 승인율</span>
          </div>
        </div>

        {/* 공고 카드 그리드 (반응형 1/2/3열) / Job card grid (responsive 1/2/3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
