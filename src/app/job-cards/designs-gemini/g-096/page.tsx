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
  Star,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Eye,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Zap,
  Crown,
  Award,
  TrendingUp,
  Building2,
  GraduationCap,
  Heart,
} from 'lucide-react';

// 디자인 메타 정보 / Design meta information
export const designInfo = {
  id: 'g-096',
  title: '잡플래닛×리멤버×인크루트 (JobPlanet×Remember×Incruit)',
  description:
    '한국 HR 데이터 퓨전 — 별점 평가 + 명함 뒤집기 + 테이블 행 하이라이트 / Korean HR data fusion — star rating + card flip + row highlight',
  author: 'Gemini',
  category: 'minimal',
  tags: ['star-rating', 'card-flip', 'row-highlight', 'data-table', 'korean-hr'],
};

// 별점 카테고리 생성 (잡플래닛 스타일) / Generate star rating categories (JobPlanet style)
function generateRatings(job: MockJobPostingV2) {
  const base = (job.matchScore || 70) / 100;
  return {
    // 워라밸 / Work-life balance
    workLife: Math.min(5, Math.max(1, Math.round((base * 4.5 + Math.random() * 0.8) * 10) / 10)),
    // 급여/복지 / Salary & benefits
    salary: Math.min(5, Math.max(1, Math.round((base * 4.2 + Math.random() * 1.0) * 10) / 10)),
    // 성장 가능성 / Growth potential
    growth: Math.min(5, Math.max(1, Math.round((base * 4.0 + Math.random() * 1.2) * 10) / 10)),
    // 경영진 / Management
    management: Math.min(5, Math.max(1, Math.round((base * 3.8 + Math.random() * 1.0) * 10) / 10)),
    // 기업 문화 / Company culture
    culture: Math.min(5, Math.max(1, Math.round((base * 4.3 + Math.random() * 0.6) * 10) / 10)),
  };
}

// 별점 렌더링 / Render star rating
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="relative">
          {/* 빈 별 배경 / Empty star background */}
          <Star className={`${sizeClass} text-gray-200 fill-gray-200`} />
          {/* 채워진 별 / Filled star */}
          {i < fullStars && (
            <Star
              className={`${sizeClass} text-amber-400 fill-amber-400 absolute inset-0`}
            />
          )}
          {i === fullStars && partial > 0 && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${partial * 100}%` }}
            >
              <Star className={`${sizeClass} text-amber-400 fill-amber-400`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 명함 카드 컴포넌트 (리멤버 스타일 뒤집기) / Business card component (Remember style flip)
function BusinessCardFlip({ job }: { job: MockJobPostingV2 }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const ratings = generateRatings(job);
  const avgRating =
    Math.round(
      ((ratings.workLife + ratings.salary + ratings.growth + ratings.management + ratings.culture) /
        5) *
        10
    ) / 10;
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);

  return (
    <div
      className="relative w-full h-[260px] cursor-pointer group"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-600"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          transitionDuration: '600ms',
        }}
      >
        {/* 앞면 — 채용공고 요약 (명함 스타일) / Front — Job summary (business card style) */}
        <div
          className="absolute inset-0 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* 상단 색상 라인 / Top color accent line */}
          <div
            className={`h-1 ${
              job.tierType === 'PREMIUM'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                : 'bg-gradient-to-r from-gray-300 to-gray-400'
            }`}
          />

          <div className="p-5">
            {/* 헤더 — 로고 + 회사정보 / Header — logo + company info */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-9 h-9 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-lg font-bold text-gray-400">
                  {job.companyInitial}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-gray-500 truncate">{job.company}</span>
                  {job.tierType === 'PREMIUM' && (
                    <Crown className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 leading-tight line-clamp-2">
                  {job.title}
                </h3>
              </div>
            </div>

            {/* 핵심 정보 그리드 / Key info grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                <span>{job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{job.workHours || '협의'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="truncate">{salary}</span>
              </div>
            </div>

            {/* 비자 배지 / Visa badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              {job.allowedVisas.slice(0, 4).map((visa) => {
                const vc = getVisaColor(visa);
                return (
                  <span
                    key={visa}
                    className={`px-2 py-0.5 text-xs font-medium rounded ${vc.bg} ${vc.text}`}
                  >
                    {visa}
                  </span>
                );
              })}
              {job.allowedVisas.length > 4 && (
                <span className="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
                  +{job.allowedVisas.length - 4}
                </span>
              )}
            </div>

            {/* 푸터 — D-Day + 뒤집기 힌트 / Footer — D-Day + flip hint */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                {dday && (
                  <span
                    className={`font-semibold ${
                      dday === 'D-Day' || dday === '마감'
                        ? 'text-red-500'
                        : dday.startsWith('D-') && parseInt(dday.slice(2)) <= 7
                          ? 'text-orange-500'
                          : 'text-gray-500'
                    }`}
                  >
                    {dday}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {job.applicantCount}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {job.viewCount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-emerald-500 transition-colors">
                <RotateCcw className="w-3 h-3" />
                <span>상세보기</span>
              </div>
            </div>
          </div>

          {/* 배지 / Badges */}
          {(job.isUrgent || job.isFeatured) && (
            <div className="absolute top-3 right-3 flex gap-1.5">
              {job.isUrgent && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-red-600 bg-red-50 rounded-full border border-red-100">
                  <Zap className="w-2.5 h-2.5" /> 긴급
                </span>
              )}
              {job.isFeatured && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full border border-emerald-100">
                  <Award className="w-2.5 h-2.5" /> 추천
                </span>
              )}
            </div>
          )}
        </div>

        {/* 뒷면 — 상세 정보 + 별점 (잡플래닛 스타일) / Back — Detail info + star ratings (JobPlanet style) */}
        <div
          className="absolute inset-0 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400" />

          <div className="p-5">
            {/* 뒷면 헤더 / Back header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{job.company}</p>
                  <p className="text-[11px] text-gray-400">{job.industry}</p>
                </div>
              </div>
              {/* 종합 평점 / Overall rating */}
              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-lg font-bold text-amber-600">{avgRating}</span>
              </div>
            </div>

            {/* 별점 카테고리 (잡플래닛) / Star rating categories (JobPlanet) */}
            <div className="space-y-2 mb-4">
              {[
                { label: '워라밸', labelEn: 'Work-Life', value: ratings.workLife },
                { label: '급여/복지', labelEn: 'Salary', value: ratings.salary },
                { label: '성장가능성', labelEn: 'Growth', value: ratings.growth },
                { label: '경영진', labelEn: 'Mgmt', value: ratings.management },
                { label: '기업문화', labelEn: 'Culture', value: ratings.culture },
              ].map((cat) => (
                <div key={cat.label} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16 flex-shrink-0">{cat.label}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-orange-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(cat.value / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-7 text-right">
                    {cat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* 상세 정보 / Detail info */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs">
                <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-500">경력:</span>
                <span className="font-medium text-gray-700">
                  {job.experienceRequired || '무관'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Heart className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-500">복리후생:</span>
                <span className="font-medium text-gray-700 truncate">
                  {job.benefits.slice(0, 3).join(', ')}
                </span>
              </div>
            </div>

            {/* 돌아가기 힌트 / Return hint */}
            <div className="flex items-center justify-center pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-amber-500 transition-colors">
                <RotateCcw className="w-3 h-3" />
                <span>뒤집어서 공고 보기</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 테이블 행 컴포넌트 (인크루트 스타일) / Table row component (Incruit style)
function TableRow({
  job,
  index,
  isExpanded,
  onToggle,
}: {
  job: MockJobPostingV2;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const ratings = generateRatings(job);
  const avgRating =
    Math.round(
      ((ratings.workLife + ratings.salary + ratings.growth + ratings.management + ratings.culture) /
        5) *
        10
    ) / 10;

  return (
    <div
      className={`border-b border-gray-100 transition-all duration-200 ${
        isHovered ? 'bg-emerald-50/50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 메인 행 / Main row */}
      <div
        className="flex items-center px-4 py-3 cursor-pointer gap-4"
        onClick={onToggle}
      >
        {/* 회사 로고 / Company logo */}
        <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-7 h-7 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden text-sm font-bold text-gray-400">{job.companyInitial}</span>
        </div>

        {/* 공고 제목 + 회사 / Job title + company */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-800 truncate">{job.title}</h4>
            {job.isUrgent && (
              <Zap className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            )}
            {job.tierType === 'PREMIUM' && (
              <Crown className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{job.company} · {job.location}</p>
        </div>

        {/* 별점 (호버 시 표시) / Star rating (visible on hover) */}
        <div
          className={`flex items-center gap-1.5 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-amber-600">{avgRating}</span>
        </div>

        {/* 급여 / Salary */}
        <div className="text-right w-40 flex-shrink-0 hidden md:block">
          <span className="text-sm font-medium text-emerald-600">{salary}</span>
        </div>

        {/* D-Day */}
        <div className="w-16 text-center flex-shrink-0">
          <span
            className={`text-xs font-semibold ${
              dday === 'D-Day' || dday === '마감'
                ? 'text-red-500'
                : dday === '상시모집'
                  ? 'text-blue-500'
                  : dday?.startsWith('D-') && parseInt(dday.slice(2)) <= 7
                    ? 'text-orange-500'
                    : 'text-gray-500'
            }`}
          >
            {dday}
          </span>
        </div>

        {/* 확장 토글 / Expand toggle */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* 확장 영역 / Expanded area */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 bg-white border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 좌측 — 기본 정보 / Left — basic info */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                채용 정보
              </h5>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">
                    {job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'} · {job.industry}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">{job.workHours || '협의'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">경력: {job.experienceRequired || '무관'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-600">
                    지원 {job.applicantCount}명 · 조회 {job.viewCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 중앙 — 비자 + 복리후생 / Center — visa + benefits */}
            <div className="space-y-3">
              <div>
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  허용 비자
                </h5>
                <div className="flex flex-wrap gap-1">
                  {job.allowedVisas.map((visa) => {
                    const vc = getVisaColor(visa);
                    return (
                      <span
                        key={visa}
                        className={`px-2 py-0.5 text-xs font-medium rounded ${vc.bg} ${vc.text}`}
                      >
                        {visa}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  복리후생
                </h5>
                <div className="flex flex-wrap gap-1">
                  {job.benefits.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 우측 — 별점 상세 / Right — rating detail */}
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                기업 평점
              </h5>
              <div className="space-y-1.5">
                {[
                  { label: '워라밸', value: ratings.workLife },
                  { label: '급여/복지', value: ratings.salary },
                  { label: '성장가능성', value: ratings.growth },
                  { label: '경영진', value: ratings.management },
                  { label: '기업문화', value: ratings.culture },
                ].map((cat) => (
                  <div key={cat.label} className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 w-14 flex-shrink-0">
                      {cat.label}
                    </span>
                    <StarRating rating={cat.value} size="sm" />
                    <span className="text-[11px] font-medium text-gray-500">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G096Page() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* 헤더 / Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">잡차자 채용공고</h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">
            잡플래닛 + 리멤버 + 인크루트 퓨전 — 평점 기반 데이터 테이블
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 섹션 1: 명함 뒤집기 카드 그리드 (리멤버 스타일) / Section 1: Business card flip grid (Remember style) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <RotateCcw className="w-4 h-4 text-emerald-500" />
            <h2 className="text-base font-semibold text-gray-800">
              추천 채용공고
            </h2>
            <span className="text-xs text-gray-400 ml-1">
              카드를 클릭하면 기업 평점을 확인할 수 있습니다
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleJobsV2.map((job) => (
              <BusinessCardFlip key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* 섹션 2: 데이터 테이블 (인크루트 스타일) / Section 2: Data table (Incruit style) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h2 className="text-base font-semibold text-gray-800">
              전체 채용공고
            </h2>
            <span className="text-xs text-gray-400 ml-1">
              행에 마우스를 올리면 기업 평점이 나타납니다
            </span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* 테이블 헤더 / Table header */}
            <div className="flex items-center px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider gap-4">
              <div className="w-10 flex-shrink-0" />
              <div className="flex-1">공고 / 기업</div>
              <div className="w-10" />
              <div className="w-40 text-right hidden md:block">급여</div>
              <div className="w-16 text-center">마감일</div>
              <div className="w-4" />
            </div>

            {/* 테이블 행 / Table rows */}
            {sampleJobsV2.map((job, idx) => (
              <TableRow
                key={job.id}
                job={job}
                index={idx}
                isExpanded={expandedRow === job.id}
                onToggle={() => setExpandedRow(expandedRow === job.id ? null : job.id)}
              />
            ))}
          </div>

          {/* 범례 / Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3 text-emerald-500" />
              <span>프리미엄</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-red-500" />
              <span>긴급</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-500" />
              <span>추천</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>기업 평점 (호버 시 표시)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
