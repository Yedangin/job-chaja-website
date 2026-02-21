'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock,
  Banknote,
  Star,
  Heart,
  ChevronRight,
  ChevronLeft,
  Shield,
  X,
  Loader2,
  Briefcase,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {
  AlbaJobResponse,
  AlbaJobSearchItem,
  DayOfWeek,
} from '@/app/company/alba/create/variants/a/types';
import {
  searchAlbaJobs,
  getPremiumAlbaJobs,
} from '@/app/company/alba/create/variants/a/api';
import {
  MOCK_ALBA_JOBS,
  MOCK_SEARCH_ITEMS,
  DAY_LABELS,
  BENEFIT_LABELS,
  MOCK_JOB_CATEGORIES,
} from '@/app/company/alba/create/variants/a/mock-data';

/**
 * 알바 공고 검색 페이지 - 구직자용 (Variant A: 미니멀/Toss 스타일)
 * Alba job search page - for job seekers (Variant A: Minimal/Toss style)
 *
 * 프리미엄 캐러셀 + 검색 필터 + 비자 기반 자동 필터링 + 공고 리스트
 * Premium carousel + search filters + visa-based auto-filtering + job list
 */

/** 정렬 옵션 / Sort options */
const SORT_OPTIONS: { value: string; label: string; labelEn: string }[] = [
  { value: 'LATEST', label: '최신순', labelEn: 'Latest' },
  { value: 'WAGE_HIGH', label: '시급 높은순', labelEn: 'Highest wage' },
  { value: 'DISTANCE', label: '거리순', labelEn: 'Distance' },
  { value: 'DEADLINE', label: '마감임박', labelEn: 'Deadline' },
];

/** 요일 필터 / Day filter */
const ALL_DAYS: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/** 프리미엄 공고 캐러셀 / Premium job carousel */
function PremiumCarousel({ jobs }: { jobs: AlbaJobResponse[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 280;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, jobs]);

  if (jobs.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          <h2 className="text-base font-bold text-gray-900">
            주목할만한 채용공고
          </h2>
          <span className="text-xs text-gray-400">Featured Jobs</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="이전 / Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-30 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="다음 / Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 snap-x snap-mandatory"
        role="region"
        aria-label="프리미엄 공고 / Featured jobs"
      >
        {jobs.map((job) => (
          <Link
            key={job.jobId}
            href={`/worker/alba/${job.jobId}/variants/a`}
            className="snap-start shrink-0 w-[260px] bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-medium text-amber-700">PREMIUM</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
              {job.title}
            </h3>
            <p className="text-xs text-gray-600 mb-1">{job.companyName}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Banknote className="w-3 h-3" />
              <span className="font-semibold text-gray-800">
                {job.hourlyWage.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{job.displayAddress}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 공고 카드 (구직자용) / Job card (for job seekers) */
function WorkerJobCard({ job }: { job: AlbaJobSearchItem }) {
  const [isScrapped, setIsScrapped] = useState(false);

  // 스케줄 요약 / Schedule summary
  const scheduleSummary = job.schedule
    .map((s) => DAY_LABELS[s.dayOfWeek]?.koShort || s.dayOfWeek)
    .join('/');

  const timeRange = job.schedule.length > 0
    ? `${job.schedule[0].startTime}~${job.schedule[0].endTime}`
    : '';

  // 비자 매치 상태 / Visa match status
  const matchStatus = job.visaMatch.status;
  const isEligible = matchStatus === 'eligible';

  return (
    <Link
      href={`/worker/alba/${job.jobId}/variants/a`}
      className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* 프리미엄 배지 / Premium badge */}
          {job.isPremium && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 mb-2">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              PREMIUM
            </span>
          )}

          {/* 제목 / Title */}
          <h3 className="text-base font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2">
            {job.title}
          </h3>

          {/* 회사명 / Company name */}
          <p className="text-sm text-gray-500 mb-3">{job.companyName}</p>

          {/* 주요 정보 / Key info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <Banknote className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold text-gray-900">
                시급 {job.hourlyWage.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <span>
                {scheduleSummary} {timeRange}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{job.displayAddress}</span>
              {job.distanceFromSchool && (
                <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                  학교에서 {job.distanceFromSchool}
                </span>
              )}
            </div>
          </div>

          {/* 비자 매치 배지 / Visa match badge */}
          <div className="mt-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                isEligible
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200',
              )}
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  isEligible ? 'bg-green-500' : 'bg-amber-500',
                )}
              />
              {isEligible ? '지원 가능' : '조건부'}
              {!isEligible && job.visaMatch.conditions.length > 0 && (
                <span className="text-amber-600 font-normal ml-0.5 truncate max-w-[180px]">
                  - {job.visaMatch.conditions[0]}
                </span>
              )}
            </span>
          </div>

          {/* 복리후생 태그 / Benefit tags */}
          {job.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {job.benefits.slice(0, 3).map((b) => (
                <span
                  key={b}
                  className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
                >
                  {BENEFIT_LABELS[b]?.ko || b}
                </span>
              ))}
              {job.benefits.length > 3 && (
                <span className="text-[11px] text-gray-400 px-1">
                  +{job.benefits.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 스크랩 버튼 / Scrap button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsScrapped(!isScrapped);
          }}
          className={cn(
            'p-2 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0',
            isScrapped
              ? 'text-red-500 bg-red-50'
              : 'text-gray-300 hover:text-gray-400 hover:bg-gray-50',
          )}
          aria-label={isScrapped ? '스크랩 취소 / Unsave' : '스크랩 / Save'}
        >
          <Heart
            className={cn('w-5 h-5', isScrapped && 'fill-red-500')}
          />
        </button>
      </div>
    </Link>
  );
}

/** 필터 바텀시트 (모바일) / Filter bottom sheet (mobile) */
function FilterSheet({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    sido: string;
    jobCategoryCode: string;
    minWage: string;
    dayOfWeek: DayOfWeek[];
    sortBy: string;
  };
  onFiltersChange: (filters: {
    sido: string;
    jobCategoryCode: string;
    minWage: string;
    dayOfWeek: DayOfWeek[];
    sortBy: string;
  }) => void;
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 / Background overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 바텀시트 / Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* 헤더 / Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              필터 <span className="text-gray-400 font-normal text-sm">/ Filters</span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="닫기 / Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 지역 / Region */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              지역 <span className="text-gray-400 font-normal">/ Region</span>
            </label>
            <select
              value={localFilters.sido}
              onChange={(e) => setLocalFilters({ ...localFilters, sido: e.target.value })}
              className="w-full min-h-[48px] px-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              aria-label="지역 선택 / Select region"
            >
              <option value="">전체 / All</option>
              <option value="서울특별시">서울</option>
              <option value="경기도">경기</option>
              <option value="인천광역시">인천</option>
              <option value="부산광역시">부산</option>
              <option value="대구광역시">대구</option>
              <option value="대전광역시">대전</option>
              <option value="광주광역시">광주</option>
            </select>
          </div>

          {/* 직종 / Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              직종 <span className="text-gray-400 font-normal">/ Category</span>
            </label>
            <select
              value={localFilters.jobCategoryCode}
              onChange={(e) => setLocalFilters({ ...localFilters, jobCategoryCode: e.target.value })}
              className="w-full min-h-[48px] px-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              aria-label="직종 선택 / Select category"
            >
              <option value="">전체 / All</option>
              {MOCK_JOB_CATEGORIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 최소 시급 / Minimum wage */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              최소 시급 <span className="text-gray-400 font-normal">/ Min Wage</span>
            </label>
            <div className="relative">
              <Input
                type="number"
                value={localFilters.minWage}
                onChange={(e) => setLocalFilters({ ...localFilters, minWage: e.target.value })}
                placeholder="0"
                className="min-h-[48px] rounded-2xl pr-10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">원</span>
            </div>
          </div>

          {/* 요일 / Day of week */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              근무 요일 <span className="text-gray-400 font-normal">/ Work Days</span>
            </label>
            <div className="flex gap-2">
              {ALL_DAYS.map((day) => {
                const isSelected = localFilters.dayOfWeek.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const newDays = isSelected
                        ? localFilters.dayOfWeek.filter((d) => d !== day)
                        : [...localFilters.dayOfWeek, day];
                      setLocalFilters({ ...localFilters, dayOfWeek: newDays });
                    }}
                    className={cn(
                      'flex-1 min-h-[44px] rounded-xl text-sm font-medium transition-all',
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100',
                    )}
                    aria-pressed={isSelected}
                  >
                    {DAY_LABELS[day].koShort}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 정렬 / Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              정렬 <span className="text-gray-400 font-normal">/ Sort</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: opt.value })}
                  className={cn(
                    'px-4 min-h-[40px] rounded-full text-sm font-medium transition-all',
                    localFilters.sortBy === opt.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  )}
                  aria-pressed={localFilters.sortBy === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 적용 버튼 / Apply button */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                const reset = { sido: '', jobCategoryCode: '', minWage: '', dayOfWeek: [] as DayOfWeek[], sortBy: 'LATEST' };
                setLocalFilters(reset);
                onFiltersChange(reset);
                onClose();
              }}
              className="flex-1 min-h-[52px] rounded-2xl"
            >
              초기화
            </Button>
            <Button
              onClick={() => {
                onFiltersChange(localFilters);
                onClose();
              }}
              className="flex-1 min-h-[52px] rounded-2xl bg-blue-500 hover:bg-blue-600"
            >
              적용하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/** 빈 검색 결과 / Empty search result */
function EmptySearchResult() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        검색 결과가 없습니다
      </h3>
      <p className="text-sm text-gray-500">
        필터 조건을 변경해보세요
        <br />
        <span className="text-gray-400">Try adjusting your filters</span>
      </p>
    </div>
  );
}

/** 스켈레톤 / Skeleton */
function SearchSkeleton() {
  return (
    <div className="space-y-3 animate-pulse px-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="w-2/3 h-5 bg-gray-200 rounded-lg mb-2" />
          <div className="w-1/3 h-4 bg-gray-100 rounded-lg mb-3" />
          <div className="space-y-2">
            <div className="w-1/2 h-4 bg-gray-100 rounded-lg" />
            <div className="w-2/3 h-4 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WorkerAlbaSearchVariantAPage() {
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({
    sido: '',
    jobCategoryCode: '',
    minWage: '',
    dayOfWeek: [] as DayOfWeek[],
    sortBy: 'LATEST',
  });
  const [showFilter, setShowFilter] = useState(false);
  const [jobs, setJobs] = useState<AlbaJobSearchItem[]>([]);
  const [premiumJobs, setPremiumJobs] = useState<AlbaJobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 활성 필터 수 / Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.sido) count++;
    if (filters.jobCategoryCode) count++;
    if (filters.minWage) count++;
    if (filters.dayOfWeek.length > 0) count++;
    return count;
  }, [filters]);

  // 검색 실행 / Execute search
  const executeSearch = useCallback(async (resetPage = true) => {
    if (resetPage) {
      setPage(1);
      setLoading(true);
    }

    try {
      const params: Record<string, string | number | string[]> = {
        page: resetPage ? 1 : page,
        limit: 20,
        sortBy: filters.sortBy,
      };
      if (keyword) params.keyword = keyword;
      if (filters.sido) params.sido = filters.sido;
      if (filters.jobCategoryCode) params.jobCategoryCode = filters.jobCategoryCode;
      if (filters.minWage) params.minWage = parseInt(filters.minWage);
      if (filters.dayOfWeek.length > 0) params.dayOfWeek = filters.dayOfWeek;

      const result = await searchAlbaJobs(params);
      if (resetPage) {
        setJobs(result.jobs);
      } else {
        setJobs((prev) => [...prev, ...result.jobs]);
      }
      setHasMore(result.pagination.page < result.pagination.totalPages);
    } catch (err) {
      // 개발용 폴백 / Development fallback
      setJobs(MOCK_SEARCH_ITEMS);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [keyword, filters, page]);

  // 프리미엄 공고 불러오기 / Fetch premium jobs
  useEffect(() => {
    async function fetchPremium() {
      try {
        const result = await getPremiumAlbaJobs();
        setPremiumJobs(result.jobs);
      } catch (err) {
        // 개발용 폴백 / Development fallback
        setPremiumJobs(MOCK_ALBA_JOBS.filter((j) => j.isPremium));
      }
    }
    fetchPremium();
  }, []);

  // 초기 검색 / Initial search
  useEffect(() => {
    executeSearch(true);
  }, [filters.sortBy]);

  // 더 불러오기 / Load more
  const handleLoadMore = useCallback(() => {
    setPage((p) => p + 1);
    executeSearch(false);
  }, [executeSearch]);

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* 상단 검색 바 / Top search bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeSearch(true)}
              placeholder="알바 검색 / Search part-time jobs"
              className="w-full min-h-[48px] pl-10 pr-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              aria-label="알바 검색 / Search part-time jobs"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilter(true)}
            className={cn(
              'relative min-w-[48px] min-h-[48px] flex items-center justify-center rounded-2xl transition-all',
              activeFilterCount > 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100',
            )}
            aria-label={`필터 (${activeFilterCount}개 활성) / Filter (${activeFilterCount} active)`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* 정렬 + 필터 칩 / Sort + filter chips */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-hide">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, sortBy: opt.value }))}
              className={cn(
                'px-3 min-h-[32px] rounded-full text-xs font-medium whitespace-nowrap transition-all',
                filters.sortBy === opt.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
              )}
              aria-pressed={filters.sortBy === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 프리미엄 캐러셀 / Premium carousel */}
      <div className="pt-4">
        <PremiumCarousel jobs={premiumJobs} />
      </div>

      {/* 검색 결과 / Search results */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800">
            전체 알바 공고
            <span className="text-gray-400 font-normal ml-1">
              {loading ? '' : `${jobs.length}건`}
            </span>
          </h2>
        </div>

        {loading ? (
          <SearchSkeleton />
        ) : jobs.length === 0 ? (
          <EmptySearchResult />
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <WorkerJobCard key={job.jobId} job={job} />
            ))}
          </div>
        )}

        {/* 더 불러오기 / Load more */}
        {!loading && hasMore && jobs.length > 0 && (
          <div className="flex justify-center py-8">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              className="min-h-[44px] rounded-2xl px-8"
            >
              더 보기 / Load More
            </Button>
          </div>
        )}
      </div>

      {/* 필터 바텀시트 / Filter bottom sheet */}
      <FilterSheet
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          executeSearch(true);
        }}
      />
    </div>
  );
}
