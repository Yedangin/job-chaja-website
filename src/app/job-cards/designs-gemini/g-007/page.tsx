// [시안]: g-007 '잡플래닛 신뢰 (JobPlanet Trust)'
// [카테고리]: 프리미엄
// [레퍼런스]: 잡플래닛
// [hover]: 평점 별점 확대 + 디테일 패널 슬라이드 다운 (상세 정보 영역 확장)
// [핵심]: 기업 평점 별점(4.2/5.0 등 목업), 리뷰 한줄 미리보기, 신뢰도 배지, 추천율 % 표시, 면접 난이도 표시
// [이미지]: 없음
// [로고]: companyLogo <img> h-8

'use client';

import { useState } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getTimeAgo,
  getIndustryColor,
  getVisaColor,
} from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import {
  Star,
  MapPin,
  Briefcase,
  Calendar,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Award,
  Users,
  Eye,
  Clock,
  Flame,
  Crown,
} from 'lucide-react';

// 기업 신뢰 목업 데이터 / Mock trust data for companies
interface TrustInfo {
  rating: number; // 평점 / Rating (e.g. 4.2)
  reviewSnippet: string; // 리뷰 한줄 미리보기 / One-line review preview
  trustScore: number; // 신뢰도 점수 % / Trust score %
  recommendationRate: number; // 추천율 % / Recommendation rate %
  interviewDifficulty: string; // 면접 난이도 / Interview difficulty
}

// 기업별 목업 신뢰 데이터 매핑 / Company mock trust data mapping
const companyTrustMap: Record<string, TrustInfo> = {
  '삼성전자 평택캠퍼스': {
    rating: 4.2,
    reviewSnippet: '복지가 좋고 체계적인 교육 시스템이 인상적',
    trustScore: 92,
    recommendationRate: 85,
    interviewDifficulty: '보통',
  },
  '현대그린푸드': {
    rating: 3.8,
    reviewSnippet: '워라밸이 좋고 식사 퀄리티가 높음',
    trustScore: 78,
    recommendationRate: 72,
    interviewDifficulty: '쉬움',
  },
  '쿠팡': {
    rating: 3.5,
    reviewSnippet: '빠르게 성장 가능하지만 업무 강도 높음',
    trustScore: 75,
    recommendationRate: 65,
    interviewDifficulty: '어려움',
  },
  '현대건설': {
    rating: 4.0,
    reviewSnippet: '안정적이고 현장 관리가 체계적',
    trustScore: 88,
    recommendationRate: 80,
    interviewDifficulty: '보통',
  },
  '쿠팡 로지스틱스': {
    rating: 3.3,
    reviewSnippet: '야간 수당이 확실하고 동료가 친절함',
    trustScore: 70,
    recommendationRate: 60,
    interviewDifficulty: '쉬움',
  },
  '삼성물산': {
    rating: 4.4,
    reviewSnippet: '대기업 체계와 건설 전문성이 돋보임',
    trustScore: 95,
    recommendationRate: 88,
    interviewDifficulty: '어려움',
  },
};

// 기본 신뢰 데이터 (매핑 없는 경우) / Default trust data (fallback)
const defaultTrust: TrustInfo = {
  rating: 3.5,
  reviewSnippet: '전반적으로 괜찮은 근무 환경',
  trustScore: 70,
  recommendationRate: 65,
  interviewDifficulty: '보통',
};

// 신뢰 데이터 가져오기 / Get trust data for a company
function getTrustInfo(company: string): TrustInfo {
  return companyTrustMap[company] || defaultTrust;
}

// 별점 표시 컴포넌트 / Star rating display component
const StarRating = ({
  rating,
  maxRating = 5,
  size = 16,
}: {
  rating: number;
  maxRating?: number;
  size?: number;
}) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;
  const emptyStars = maxRating - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {/* 채워진 별 / Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" size={size} />
      ))}
      {/* 반 별 / Half star */}
      {hasHalf && <Star key="half" className="text-yellow-400 fill-yellow-200" size={size} />}
      {/* 빈 별 / Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-gray-300" size={size} />
      ))}
    </div>
  );
};

// 면접 난이도 색상 / Interview difficulty color mapping
function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case '쉬움':
      return 'text-green-600 bg-green-50';
    case '보통':
      return 'text-amber-600 bg-amber-50';
    case '어려움':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

// 채용공고 카드 컴포넌트 / Job posting card component
const JobCard = ({ job }: { job: MockJobPostingV2 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dDay = getDDay(job.closingDate);
  const timeAgo = getTimeAgo(job.postedDate);
  const salary = formatSalary(job);
  const trust = getTrustInfo(job.company);
  const industryColor = getIndustryColor(job.industry);

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 ease-in-out border border-gray-200 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* 프리미엄 상단 바 / Premium top accent bar */}
      {job.tierType === 'PREMIUM' && (
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
      )}

      <div className="p-5">
        {/* 상단: 로고 + 기업명 + 배지 / Header: logo + company + badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="h-8 w-auto object-contain"
              onError={(e) => {
                // 로고 로드 실패 시 이니셜 표시 / Show initial on logo load failure
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className =
                    'h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600';
                  fallback.textContent = job.companyInitial;
                  parent.insertBefore(fallback, target);
                }
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-600">{job.company}</p>
                {/* 신뢰도 배지 / Trust badge */}
                {trust.trustScore >= 80 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                    <ShieldCheck size={10} /> 인증기업
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base text-gray-900 leading-tight mt-0.5 line-clamp-2">
                {job.title}
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
            {job.isUrgent && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                <Flame size={10} /> 급구
              </span>
            )}
            {job.isFeatured && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <Crown size={10} /> 추천
              </span>
            )}
          </div>
        </div>

        {/* 별점 + 리뷰 섹션 / Rating + review section */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3 transition-all duration-300 group-hover:bg-yellow-50/50">
          <div className="flex items-center justify-between mb-1.5">
            {/* 별점 (호버 시 확대) / Rating (scales up on hover) */}
            <div className="flex items-center gap-2 transition-transform duration-300 origin-left group-hover:scale-110">
              <span className="font-bold text-lg text-gray-900">
                {trust.rating.toFixed(1)}
              </span>
              <StarRating rating={trust.rating} />
              <span className="text-xs text-gray-400">/ 5.0</span>
            </div>
            {/* D-Day 배지 / D-Day badge */}
            {dDay && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  dDay === '마감'
                    ? 'bg-gray-200 text-gray-500'
                    : dDay === 'D-Day'
                      ? 'bg-red-500 text-white'
                      : dDay === '상시모집'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                }`}
              >
                {dDay}
              </span>
            )}
          </div>
          {/* 리뷰 한줄 미리보기 / Review one-line preview */}
          <p className="text-xs text-gray-500 italic border-l-2 border-yellow-400 pl-2 line-clamp-1">
            &ldquo;{trust.reviewSnippet}&rdquo;
          </p>
        </div>

        {/* 신뢰 지표 3열 / Trust metrics 3 columns */}
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          {/* 신뢰도 / Trust score */}
          <div className="p-2 rounded-lg bg-blue-50 transition-all duration-300 group-hover:shadow-sm">
            <ShieldCheck className="mx-auto text-blue-500 mb-0.5" size={18} />
            <p className="text-[10px] font-medium text-blue-800">신뢰도</p>
            <p className="text-sm font-bold text-blue-600">{trust.trustScore}%</p>
          </div>
          {/* 추천율 / Recommendation rate */}
          <div className="p-2 rounded-lg bg-green-50 transition-all duration-300 group-hover:shadow-sm">
            <TrendingUp className="mx-auto text-green-500 mb-0.5" size={18} />
            <p className="text-[10px] font-medium text-green-800">추천율</p>
            <p className="text-sm font-bold text-green-600">{trust.recommendationRate}%</p>
          </div>
          {/* 면접 난이도 / Interview difficulty */}
          <div
            className={`p-2 rounded-lg transition-all duration-300 group-hover:shadow-sm ${getDifficultyColor(trust.interviewDifficulty)}`}
          >
            <BrainCircuit className="mx-auto mb-0.5" size={18} />
            <p className="text-[10px] font-medium">면접 난이도</p>
            <p className="text-sm font-bold">{trust.interviewDifficulty}</p>
          </div>
        </div>

        {/* 기본 정보 / Basic info */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={12} /> {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
          <span className="flex items-center gap-1">
            <Award size={12} /> {salary}
          </span>
        </div>
      </div>

      {/* 슬라이드 다운 디테일 패널 (호버 시 확장) / Slide-down detail panel (expands on hover) */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-100 px-5 py-4 bg-gradient-to-b from-gray-50 to-white">
          {/* 상세 근무 조건 / Detailed work conditions */}
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            상세 정보 / Details
          </h4>
          <div className="space-y-1.5 text-sm text-gray-600 mb-3">
            {job.workHours && (
              <p className="flex items-center gap-2">
                <Clock size={13} className="text-gray-400 shrink-0" />
                {job.workHours}
              </p>
            )}
            {job.experienceRequired && (
              <p className="flex items-center gap-2">
                <Briefcase size={13} className="text-gray-400 shrink-0" />
                경력: {job.experienceRequired}
              </p>
            )}
            <p className="flex items-center gap-2">
              <Calendar size={13} className="text-gray-400 shrink-0" />
              {timeAgo} 등록
            </p>
            <div className="flex items-center gap-2">
              <Users size={13} className="text-gray-400 shrink-0" />
              <span>지원자 {job.applicantCount}명</span>
              <span className="text-gray-300">|</span>
              <Eye size={13} className="text-gray-400 shrink-0" />
              <span>조회 {job.viewCount.toLocaleString()}</span>
            </div>
          </div>

          {/* 산업 + 비자 태그 / Industry + visa tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${industryColor.bg} ${industryColor.text} ${industryColor.border}`}
            >
              {job.industry}
            </span>
            {job.allowedVisas.map((visa) => {
              const visaColor = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${visaColor.bg} ${visaColor.text}`}
                >
                  {visa}
                </span>
              );
            })}
          </div>

          {/* 복리후생 / Benefits */}
          {job.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 호버 인디케이터 / Bottom hover indicator bar */}
      <div
        className={`h-0.5 transition-all duration-300 ${
          isExpanded
            ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'
            : 'bg-gray-200'
        }`}
      />
    </div>
  );
};

// 메인 페이지 컴포넌트 / Main page component
export default function G007JobPlanetTrustPage() {
  return (
    <div className="w-full bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 시안 정보 헤더 / Design info header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-gray-400 bg-gray-200 px-2 py-1 rounded">
              g-007
            </span>
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
              프리미엄
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            잡플래닛 신뢰 (JobPlanet Trust)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            기업 평점 별점, 리뷰 미리보기, 신뢰도 배지, 추천율, 면접 난이도 표시 |
            hover: 별점 확대 + 디테일 패널 슬라이드 다운
          </p>
        </div>

        {/* 반응형 그리드: 1열(모바일) / 2열(태블릿) / 3열(데스크톱) */}
        {/* Responsive grid: 1 col (mobile) / 2 col (tablet) / 3 col (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
