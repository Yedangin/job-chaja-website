'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
  ArrowUpDown,
  Loader2,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Bookmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_ALBA_JOBS, MOCK_PREMIUM_JOBS } from '@/app/company/alba/create/variants/c/components/mock-data';
import { VisaBadgeInline } from '@/app/company/alba/create/variants/c/components/visa-match-badges';
import type { AlbaJobResponse, DayOfWeek } from '@/app/company/alba/create/variants/c/components/alba-types';
import { JOB_CATEGORIES, DAY_LABELS } from '@/app/company/alba/create/variants/c/components/alba-types';

/**
 * 구직자 알바 검색 페이지 — Variant C (카드 비주얼)
 * Worker alba search page — Variant C (card visual)
 *
 * 프리미엄 캐러셀 + 필 스크롤 필터 + 카드 그리드 (2열 모바일)
 * Premium carousel + pill scroll filter + card grid (2-col mobile)
 */

// 정렬 옵션 / Sort options
const SORT_OPTIONS = [
  { value: 'LATEST', label: '최신순', labelEn: 'Latest' },
  { value: 'WAGE_HIGH', label: '시급 높은순', labelEn: 'Highest Wage' },
  { value: 'DEADLINE', label: '마감 임박순', labelEn: 'Ending Soon' },
] as const;

// 직종 필터 (그룹) / Category filter groups
const CATEGORY_GROUPS = [
  { code: 'ALL', label: '전체', icon: '🔍' },
  { code: 'FOOD', label: '음식점/카페', icon: '🍽️' },
  { code: 'RETAIL', label: '판매/매장', icon: '🛒' },
  { code: 'LOGISTICS', label: '물류/배송', icon: '📦' },
  { code: 'MANUFACTURING', label: '제조/생산', icon: '🏭' },
  { code: 'OFFICE', label: '사무/전문', icon: '💼' },
  { code: 'SERVICE', label: '서비스', icon: '🏨' },
  { code: 'EDUCATION', label: '교육', icon: '📚' },
  { code: 'IT', label: 'IT/개발', icon: '💻' },
];

export default function WorkerAlbaSearchVariantCPage() {
  // 검색어 / Keyword
  const [keyword, setKeyword] = useState('');
  // 카테고리 필터 / Category filter
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  // 정렬 / Sort
  const [sortBy, setSortBy] = useState<string>('LATEST');
  // 바텀시트 필터 오픈 / Bottom sheet open
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // 로딩 상태 / Loading state
  const [isLoading, setIsLoading] = useState(false);
  // 새로고침 / Refreshing
  const [isRefreshing, setIsRefreshing] = useState(false);
  // 저장된 공고 (스크랩) / Saved jobs (scrapped)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  // 프리미엄 캐러셀 인덱스 / Premium carousel index
  const [carouselIndex, setCarouselIndex] = useState(0);
  // 정렬 드롭다운 / Sort dropdown
  const [showSortMenu, setShowSortMenu] = useState(false);

  // 프리미엄 캐러셀 ref / Premium carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // ACTIVE 공고만 필터 / Only active jobs
  const activeJobs = useMemo(
    () => MOCK_ALBA_JOBS.filter((j) => j.status === 'ACTIVE'),
    []
  );

  // 필터 + 정렬된 공고 / Filtered + sorted jobs
  const filteredJobs = useMemo(() => {
    let result = activeJobs;

    // 카테고리 필터 / Category filter
    if (selectedCategory !== 'ALL') {
      const categoryCodes = JOB_CATEGORIES.filter((c) => c.group === selectedCategory).map((c) => c.code);
      result = result.filter((j) => categoryCodes.includes(j.jobCategoryCode));
    }

    // 키워드 필터 / Keyword filter
    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.jobCategoryName.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q)
      );
    }

    // 정렬 / Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'WAGE_HIGH':
          return b.hourlyWage - a.hourlyWage;
        case 'DEADLINE':
          if (!a.applicationDeadline) return 1;
          if (!b.applicationDeadline) return -1;
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        default: // LATEST
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [activeJobs, selectedCategory, keyword, sortBy]);

  // 비프리미엄 공고 (일반 목록용) / Non-premium jobs
  const nonPremiumJobs = useMemo(
    () => filteredJobs.filter((j) => !j.isPremium),
    [filteredJobs]
  );

  // 스크랩 토글 / Toggle scrap
  const toggleSave = useCallback((jobId: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  }, []);

  // 프리미엄 캐러셀 스크롤 / Carousel scroll
  const scrollCarousel = useCallback((dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 280;
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  // 새로고침 시뮬레이션 / Simulate refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 검색 바 / Top search bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="알바 검색... / Search part-time jobs..."
                className="pl-10 h-11 rounded-xl bg-gray-50 border-gray-200"
                aria-label="알바 검색 / Search jobs"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  aria-label="검색어 지우기 / Clear search"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                'flex items-center justify-center w-11 h-11 rounded-xl border transition min-h-[44px] min-w-[44px]',
                isFilterOpen
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
              )}
              aria-label="필터 / Filters"
              aria-expanded={isFilterOpen}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {/* 프리미엄 공고 캐러셀 / Premium job carousel */}
        {MOCK_PREMIUM_JOBS.length > 0 && (
          <section className="px-4 pt-5 pb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-gray-900">
                  {/* 주목할만한 채용공고 / Featured Postings */}
                  주목할만한 채용공고
                </h2>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="이전 / Previous"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="다음 / Next"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 pb-2 snap-x snap-mandatory"
            >
              {MOCK_PREMIUM_JOBS.map((job) => (
                <PremiumJobCard key={job.jobId} job={job} />
              ))}
            </div>
          </section>
        )}

        {/* 카테고리 필 바 (가로 스크롤) / Category pill bar (horizontal scroll) */}
        <section className="px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
            {CATEGORY_GROUPS.map((cat) => (
              <button
                key={cat.code}
                type="button"
                onClick={() => setSelectedCategory(cat.code)}
                className={cn(
                  'flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap min-h-[44px]',
                  selectedCategory === cat.code
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-200'
                )}
                aria-label={`${cat.label} 필터 / ${cat.label} filter`}
                aria-pressed={selectedCategory === cat.code}
              >
                <span role="img" aria-hidden="true">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* 결과 헤더 (갯수 + 정렬) / Results header (count + sort) */}
        <section className="px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {/* N건의 알바 / N jobs found */}
            {filteredJobs.length}건의 알바
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-600 transition min-h-[44px] px-2"
              aria-label="정렬 기준 / Sort by"
              aria-expanded={showSortMenu}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-10 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2.5 text-sm text-left min-h-[44px]',
                      sortBy === option.value
                        ? 'text-orange-600 font-semibold bg-orange-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                    aria-label={`${option.label} / ${option.labelEn}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 공고 카드 그리드 / Job card grid */}
        <section className="px-4 pb-24">
          {isRefreshing ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <WorkerEmptyState />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredJobs.map((job) => (
                <WorkerJobCard
                  key={job.jobId}
                  job={job}
                  isSaved={savedJobs.has(job.jobId)}
                  onToggleSave={() => toggleSave(job.jobId)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 바텀시트 필터 / Bottom sheet filter */}
      {isFilterOpen && (
        <BottomSheetFilter
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}

/**
 * 프리미엄 공고 캐러셀 카드 / Premium job carousel card
 */
function PremiumJobCard({ job }: { job: AlbaJobResponse }) {
  const category = JOB_CATEGORIES.find((c) => c.code === job.jobCategoryCode);

  return (
    <Link
      href={`/worker/alba/${job.jobId}/variants/c`}
      className="flex-shrink-0 w-[260px] snap-start"
    >
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-white rounded-2xl border border-amber-200/50 p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0">
        {/* 프리미엄 배지 + 카테고리 / Premium badge + category */}
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded-full">
            <Crown className="w-3 h-3" />
            PREMIUM
          </span>
          <span className="text-xl" role="img" aria-hidden="true">
            {category?.icon || '💼'}
          </span>
        </div>

        {/* 제목 / Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-2">
          {job.title}
        </h3>

        {/* 시급 강조 / Wage highlight */}
        <p className="text-lg font-extrabold text-orange-600 mb-1.5">
          {job.hourlyWage.toLocaleString()}원<span className="text-xs font-normal text-gray-400">/시간</span>
        </p>

        {/* 스케줄 / Schedule */}
        <div className="flex flex-wrap gap-1 mb-2">
          {job.schedule.map((s) => (
            <span
              key={s.dayOfWeek}
              className="px-2 py-0.5 bg-white rounded-md text-[10px] font-medium text-gray-600 border border-gray-100"
            >
              {DAY_LABELS[s.dayOfWeek].short} {s.startTime}~{s.endTime}
            </span>
          ))}
        </div>

        {/* 위치 / Location */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="w-3 h-3" />
          {job.displayAddress}
        </div>

        {/* 비자 배지 / Visa badges */}
        <div className="flex gap-1 mt-2">
          {job.matchedVisas.slice(0, 3).map((v) => (
            <VisaBadgeInline key={v.visaCode} status={v.status} visaCode={v.visaCode} />
          ))}
          {job.matchedVisas.length > 3 && (
            <span className="text-[9px] text-gray-400 self-center">+{job.matchedVisas.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * 일반 구직자 공고 카드 / Regular worker job card
 */
function WorkerJobCard({
  job,
  isSaved,
  onToggleSave,
}: {
  job: AlbaJobResponse;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  const category = JOB_CATEGORIES.find((c) => c.code === job.jobCategoryCode);

  // 비자 매칭 상태 (목업: 첫번째 결과 사용) / Visa match status (mock: use first result)
  const primaryVisa = job.matchedVisas[0];

  // 마감 임박 / Deadline approaching
  const daysUntilDeadline = job.applicationDeadline
    ? Math.max(0, Math.ceil((new Date(job.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="relative group">
      <Link href={`/worker/alba/${job.jobId}/variants/c`}>
        <Card className="rounded-2xl border-0 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 active:translate-y-0 overflow-hidden h-full">
          {/* 카테고리 아이콘 + 프리미엄 표시 / Category icon + premium indicator */}
          <div className={cn(
            'h-24 flex items-center justify-center relative',
            job.isPremium
              ? 'bg-gradient-to-br from-amber-100 to-orange-100'
              : 'bg-gradient-to-br from-gray-50 to-gray-100'
          )}>
            <span className="text-4xl" role="img" aria-hidden="true">
              {category?.icon || '💼'}
            </span>

            {/* 프리미엄 배지 / Premium badge */}
            {job.isPremium && (
              <span className="absolute top-2 left-2 flex items-center gap-0.5 px-2 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded-full">
                <Crown className="w-2.5 h-2.5" />
                AD
              </span>
            )}

            {/* 마감 임박 / Deadline approaching */}
            {daysUntilDeadline !== null && daysUntilDeadline <= 3 && (
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                D-{daysUntilDeadline}
              </span>
            )}
          </div>

          <CardContent className="pt-3 pb-3 px-3">
            {/* 회사명 / Company name */}
            <p className="text-[10px] text-gray-400 truncate mb-0.5">
              {job.companyName}
            </p>

            {/* 제목 / Title */}
            <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug min-h-[32px]">
              {job.title}
            </h3>

            {/* 시급 강조 / Wage highlight */}
            <p className="text-base font-extrabold text-orange-600 mt-1.5">
              {job.hourlyWage.toLocaleString()}<span className="text-[10px] font-normal text-gray-400">원/h</span>
            </p>

            {/* 스케줄 필 / Schedule pills */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {job.schedule.slice(0, 3).map((s) => (
                <span
                  key={s.dayOfWeek}
                  className="px-1.5 py-0.5 bg-gray-50 rounded text-[9px] text-gray-500"
                >
                  {DAY_LABELS[s.dayOfWeek].short}
                </span>
              ))}
              {job.schedule.length > 3 && (
                <span className="text-[9px] text-gray-400">+{job.schedule.length - 3}</span>
              )}
            </div>

            {/* 위치 / Location */}
            <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1.5">
              <MapPin className="w-2.5 h-2.5" />
              {job.displayAddress}
            </div>

            {/* 비자 배지 / Visa badge */}
            {primaryVisa && (
              <div className="mt-2">
                <VisaBadgeInline
                  status={primaryVisa.status}
                  visaCode={primaryVisa.visaCode}
                  label={primaryVisa.status === 'eligible' ? '지원가능' : '조건부'}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </Link>

      {/* 스크랩 버튼 (절대 위치) / Scrap button (absolute position) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleSave();
        }}
        className={cn(
          'absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition',
          isSaved
            ? 'bg-red-50 text-red-500'
            : 'bg-white/80 backdrop-blur-sm text-gray-400 opacity-0 group-hover:opacity-100'
        )}
        aria-label={isSaved ? '스크랩 해제 / Unsave' : '스크랩 / Save'}
      >
        <Heart className={cn('w-4 h-4', isSaved && 'fill-current')} />
      </button>
    </div>
  );
}

/**
 * 바텀시트 필터 / Bottom sheet filter
 */
function BottomSheetFilter({ onClose }: { onClose: () => void }) {
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(new Set());
  const [minWage, setMinWage] = useState('');

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  return (
    <>
      {/* 오버레이 / Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 시트 / Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="max-w-lg mx-auto px-6 py-6">
          {/* 핸들 / Handle */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">
              {/* 상세 필터 / Detailed Filters */}
              상세 필터
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="닫기 / Close"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 근무 요일 / Work days */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {/* 근무 요일 / Work Days */}
              근무 요일
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as DayOfWeek[]).map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    'py-3 rounded-xl text-sm font-medium transition-all min-h-[44px]',
                    selectedDays.has(day)
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                  aria-label={`${DAY_LABELS[day].full} / ${DAY_LABELS[day].shortEn}`}
                  aria-pressed={selectedDays.has(day)}
                >
                  {DAY_LABELS[day].short}
                </button>
              ))}
            </div>
          </div>

          {/* 최소 시급 / Minimum wage */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {/* 최소 시급 / Minimum Wage */}
              최소 시급
            </p>
            <div className="relative">
              <Input
                type="number"
                value={minWage}
                onChange={(e) => setMinWage(e.target.value)}
                placeholder="10,030"
                className="h-11 rounded-xl pr-10"
                aria-label="최소 시급 / Minimum wage"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
            </div>
          </div>

          {/* 지역 필터 (간략) / Region filter (brief) */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {/* 지역 / Region */}
              지역
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="시/도 (Province)"
                className="h-11 rounded-xl"
                aria-label="시/도 / Province"
              />
              <Input
                placeholder="시/군/구 (District)"
                className="h-11 rounded-xl"
                aria-label="시/군/구 / District"
              />
            </div>
          </div>

          {/* 적용 버튼 / Apply button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => {
                setSelectedDays(new Set());
                setMinWage('');
              }}
              aria-label="초기화 / Reset"
            >
              {/* 초기화 / Reset */}
              초기화
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-semibold"
              onClick={onClose}
              aria-label="적용하기 / Apply"
            >
              {/* 적용하기 / Apply */}
              적용하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * 구직자 빈 상태 / Worker empty state
 */
function WorkerEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
        <Search className="w-10 h-10 text-orange-300" />
      </div>
      <h3 className="text-base font-bold text-gray-700 mb-1">
        {/* 검색 결과가 없습니다 / No results found */}
        검색 결과가 없습니다
      </h3>
      <p className="text-sm text-gray-400">
        {/* 다른 조건으로 검색해보세요 / Try different search criteria */}
        다른 조건으로 검색해보세요
        <br />
        Try different search criteria
      </p>
    </div>
  );
}
