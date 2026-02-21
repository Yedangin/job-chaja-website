'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, SlidersHorizontal, ChevronDown, ChevronUp,
  MapPin, Clock, DollarSign,
  Heart, Star, Check, AlertTriangle, X, ArrowUpDown,
  Command,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import type { AlbaJobSearchItem, DayOfWeek } from '../../../../company/alba/create/variants/d/alba-types';
import {
  ALL_DAYS, DAY_LABELS, BENEFIT_LABELS, JOB_CATEGORIES,
} from '../../../../company/alba/create/variants/d/alba-types';
import { MOCK_SEARCH_RESULTS, MOCK_PREMIUM_JOBS } from '../../../../company/alba/create/variants/d/mock-data';

/**
 * 구직자용 알바 공고 검색 — Variant D (커맨드 바 + 패싯 필터 스타일)
 * Worker alba job search — Variant D (Command bar + faceted filter style)
 *
 * 상단 커맨드 바 검색 + 접을 수 있는 패싯 필터 + 상세 리스트 행
 * Top command bar search + collapsible faceted filters + detailed list rows
 */

type SortOption = 'LATEST' | 'WAGE_HIGH' | 'DISTANCE' | 'DEADLINE';

const SORT_OPTIONS: { value: SortOption; label: string; labelEn: string }[] = [
  { value: 'LATEST', label: '최신순', labelEn: 'Latest' },
  { value: 'WAGE_HIGH', label: '시급높은순', labelEn: 'Highest wage' },
  { value: 'DISTANCE', label: '거리순', labelEn: 'Distance' },
  { value: 'DEADLINE', label: '마감임박순', labelEn: 'Closing soon' },
];

const REGIONS = ['서울특별시', '경기도', '인천광역시', '부산광역시', '대구광역시'];
const DISTRICTS: Record<string, string[]> = {
  '서울특별시': ['강남구', '서초구', '마포구', '용산구', '서대문구', '광진구', '성동구', '송파구'],
  '경기도': ['수원시', '성남시', '고양시', '안산시', '용인시'],
};

export default function WorkerAlbaSearchVariantD() {
  // ─── 검색/필터 상태 / Search/filter state ───
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('LATEST');
  const [selectedSido, setSelectedSido] = useState('');
  const [selectedSigungu, setSelectedSigungu] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(new Set());
  const [minWage, setMinWage] = useState<number | ''>('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [showSortMenu, setShowSortMenu] = useState(false);

  // ─── 목업 데이터 / Mock data ───
  const allJobs = MOCK_SEARCH_RESULTS;
  const premiumJobs = MOCK_PREMIUM_JOBS;

  // ─── 필터링 / Filtering ───
  const filteredJobs = useMemo(() => {
    let result = allJobs;

    // 키워드 검색 / Keyword search
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.jobCategoryName.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q),
      );
    }

    // 지역 필터 / Region filter
    if (selectedSido) {
      result = result.filter((j) => j.address.sido === selectedSido);
      if (selectedSigungu) {
        result = result.filter((j) => j.address.sigungu === selectedSigungu);
      }
    }

    // 직종 필터 / Category filter
    if (selectedCategory) {
      result = result.filter((j) => j.jobCategoryCode === selectedCategory);
    }

    // 요일 필터 / Day filter
    if (selectedDays.size > 0) {
      result = result.filter((j) =>
        j.schedule.some((s) => selectedDays.has(s.dayOfWeek)),
      );
    }

    // 최소 시급 필터 / Minimum wage filter
    if (minWage !== '' && minWage > 0) {
      result = result.filter((j) => j.hourlyWage >= minWage);
    }

    // 정렬 / Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'LATEST') return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === 'WAGE_HIGH') return b.hourlyWage - a.hourlyWage;
      if (sortBy === 'DEADLINE') {
        const aExp = a.expiresAt || '9999';
        const bExp = b.expiresAt || '9999';
        return aExp.localeCompare(bExp);
      }
      return 0;
    });

    return result;
  }, [allJobs, keyword, selectedSido, selectedSigungu, selectedCategory, selectedDays, minWage, sortBy]);

  // ─── 북마크 토글 / Bookmark toggle ───
  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ─── 요일 토글 / Day toggle ───
  const toggleDay = useCallback((day: DayOfWeek) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }, []);

  // ─── 필터 초기화 / Clear filters ───
  const clearFilters = useCallback(() => {
    setSelectedSido('');
    setSelectedSigungu('');
    setSelectedCategory('');
    setSelectedDays(new Set());
    setMinWage('');
    setKeyword('');
  }, []);

  // ─── 활성 필터 개수 / Active filter count ───
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSido) count++;
    if (selectedCategory) count++;
    if (selectedDays.size > 0) count++;
    if (minWage !== '' && minWage > 0) count++;
    return count;
  }, [selectedSido, selectedCategory, selectedDays, minWage]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ─── 상단 검색 바 (커맨드 팔레트 스타일) / Top search bar (command palette style) ─── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* 페이지 제목 / Page title */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-sm font-semibold text-gray-900">알바 검색</h1>
              <p className="text-[11px] text-gray-400 font-mono">Alba Job Search</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span>D-2 유학</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            </div>
          </div>

          {/* 검색 입력 / Search input */}
          <div className="relative">
            <Command className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="직종, 지역, 키워드 검색... / Search jobs, location, keywords..."
              className="h-11 pl-10 pr-20 text-sm bg-[#F7F8FA] border-gray-200 rounded-lg font-mono focus:bg-white"
              aria-label="알바 검색 / Search alba jobs"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  aria-label="검색어 지우기 / Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 font-mono">
                /
              </kbd>
            </div>
          </div>

          {/* 필터 토글 + 정렬 / Filter toggle + Sort */}
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors min-h-9',
                filtersOpen
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
              aria-expanded={filtersOpen}
              aria-label="필터 열기/닫기 / Toggle filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              필터
              {activeFilterCount > 0 && (
                <span className={cn(
                  'ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono',
                  filtersOpen ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600',
                )}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* 정렬 드롭다운 / Sort dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors min-h-9"
                aria-label="정렬 / Sort"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                <ChevronDown className="w-3 h-3" />
              </button>

              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-sm py-1 min-w-40">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortMenu(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors',
                          sortBy === opt.value && 'bg-gray-50 font-medium text-gray-900',
                        )}
                      >
                        {sortBy === opt.value && <Check className="w-3 h-3 text-indigo-600" />}
                        <span className={sortBy !== opt.value ? 'ml-5' : ''}>
                          {opt.label} <span className="text-gray-400">{opt.labelEn}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ─── 패싯 필터 패널 / Faceted filter panel ─── */}
        {filtersOpen && (
          <div className="border-t border-gray-100 bg-white">
            <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
              {/* 지역 필터 / Region filter */}
              <FilterSection label="지역 / Region">
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip
                    label="전체"
                    active={!selectedSido}
                    onClick={() => { setSelectedSido(''); setSelectedSigungu(''); }}
                  />
                  {REGIONS.map((r) => (
                    <FilterChip
                      key={r}
                      label={r.replace('특별시', '').replace('광역시', '').replace('도', '')}
                      active={selectedSido === r}
                      onClick={() => { setSelectedSido(r); setSelectedSigungu(''); }}
                    />
                  ))}
                </div>
                {selectedSido && DISTRICTS[selectedSido] && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-2 border-l-2 border-gray-200">
                    {DISTRICTS[selectedSido].map((d) => (
                      <FilterChip
                        key={d}
                        label={d}
                        active={selectedSigungu === d}
                        onClick={() => setSelectedSigungu(selectedSigungu === d ? '' : d)}
                      />
                    ))}
                  </div>
                )}
              </FilterSection>

              {/* 직종 필터 / Category filter */}
              <FilterSection label="직종 / Category">
                <div className="flex flex-wrap gap-1.5">
                  <FilterChip
                    label="전체"
                    active={!selectedCategory}
                    onClick={() => setSelectedCategory('')}
                  />
                  {JOB_CATEGORIES.slice(0, 10).map((cat) => (
                    <FilterChip
                      key={cat.code}
                      label={cat.name}
                      active={selectedCategory === cat.code}
                      onClick={() => setSelectedCategory(selectedCategory === cat.code ? '' : cat.code)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* 요일 필터 / Day filter */}
              <FilterSection label="요일 / Day">
                <div className="flex gap-1.5">
                  {ALL_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={cn(
                        'w-10 h-10 rounded text-xs font-medium transition-colors border',
                        selectedDays.has(day)
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400',
                      )}
                      aria-pressed={selectedDays.has(day)}
                      aria-label={`${DAY_LABELS[day].ko} / ${DAY_LABELS[day].en}`}
                    >
                      {DAY_LABELS[day].short}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* 최소 시급 / Minimum wage */}
              <FilterSection label="최소 시급 / Min Wage">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={minWage}
                    onChange={(e) => setMinWage(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="10,030"
                    className="h-9 w-32 font-mono text-sm"
                    min={0}
                    step={500}
                    aria-label="최소 시급 / Minimum wage"
                  />
                  <span className="text-xs text-gray-400">원 이상 / KRW+</span>
                </div>
              </FilterSection>

              {/* 필터 초기화 / Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  aria-label="필터 초기화 / Clear all filters"
                >
                  필터 초기화 / Clear all
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── 메인 컨텐츠 / Main content ─── */}
      <main className="max-w-4xl mx-auto px-4 py-4 pb-24">
        {/* 프리미엄 공고 영역 / Premium jobs area */}
        {premiumJobs.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-gray-700">주목 공고</h2>
              <span className="text-[11px] text-gray-400 font-mono">Featured</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {premiumJobs.map((job) => (
                <PremiumJobCard
                  key={job.jobId}
                  job={job}
                  bookmarked={bookmarkedIds.has(job.jobId)}
                  onToggleBookmark={() => toggleBookmark(job.jobId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 결과 수 / Result count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">
            <span className="font-mono font-semibold text-gray-700">{filteredJobs.length}</span>
            건 / results
          </p>
        </div>

        {/* 공고 리스트 / Job list */}
        {filteredJobs.length === 0 ? (
          <div className="py-16 text-center">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">검색 결과가 없습니다</p>
            <p className="text-xs text-gray-400 mb-3">No results found. Try different filters.</p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              필터 초기화
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredJobs.map((job) => (
              <JobSearchRow
                key={job.jobId}
                job={job}
                bookmarked={bookmarkedIds.has(job.jobId)}
                onToggleBookmark={() => toggleBookmark(job.jobId)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ─── 필터 섹션 / Filter section ───

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── 필터 칩 / Filter chip ───

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-2.5 py-1.5 rounded text-xs font-medium transition-colors border min-h-8',
        active
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

// ─── 프리미엄 공고 카드 / Premium job card ───

function PremiumJobCard({
  job,
  bookmarked,
  onToggleBookmark,
}: {
  job: AlbaJobSearchItem;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const scheduleText = job.schedule
    .map((s) => `${DAY_LABELS[s.dayOfWeek].short} ${s.startTime}-${s.endTime}`)
    .join(', ');

  return (
    <div className="relative border border-amber-200 bg-white rounded p-4 hover:border-amber-300 transition-colors">
      {/* 프리미엄 배지 / Premium badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onToggleBookmark(); }}
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="스크랩 / Bookmark"
          aria-pressed={bookmarked}
        >
          <Heart className={cn('w-4 h-4', bookmarked && 'fill-red-500 text-red-500')} />
        </button>
      </div>

      <Link href={`/worker/alba/${job.jobId}/variants/d`}>
        {/* 비자 배지 / Visa badge */}
        <VisaStatusBadge status={job.visaMatch.status} />

        {/* 제목 / Title */}
        <h3 className="text-sm font-semibold text-gray-900 mt-2 mb-1 pr-8 line-clamp-1">
          {job.title}
        </h3>

        {/* 회사명 / Company name */}
        <p className="text-xs text-gray-500 mb-2">{job.companyName}</p>

        {/* 메타 / Meta */}
        <div className="space-y-1 text-xs font-mono text-gray-600">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3 h-3 text-gray-400" />
            <span className="font-semibold">{job.hourlyWage.toLocaleString()}원</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="truncate">{scheduleText}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>{job.displayAddress}</span>
            {job.distanceFromSchool && (
              <span className="text-indigo-500">({job.distanceFromSchool})</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── 검색 결과 행 / Search result row ───

function JobSearchRow({
  job,
  bookmarked,
  onToggleBookmark,
}: {
  job: AlbaJobSearchItem;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const scheduleText = job.schedule
    .map((s) => DAY_LABELS[s.dayOfWeek].short)
    .join('/');
  const timeText = job.schedule.length > 0
    ? `${job.schedule[0].startTime}-${job.schedule[0].endTime}`
    : '';

  // 경과 시간 계산 / Time ago calculation
  const timeAgo = useMemo(() => {
    const now = new Date('2026-02-18T12:00:00Z');
    const created = new Date(job.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return '오늘 / today';
    if (diffDays === 1) return '어제 / yesterday';
    return `${diffDays}일 전 / ${diffDays}d ago`;
  }, [job.createdAt]);

  return (
    <Link href={`/worker/alba/${job.jobId}/variants/d`}>
      <div className={cn(
        'flex items-start gap-3 px-4 py-3.5 bg-white border rounded hover:border-gray-300 transition-colors',
        job.isPremium ? 'border-amber-200' : 'border-gray-200',
      )}>
        {/* 비자 상태 도트 / Visa status dot */}
        <div className="pt-1 shrink-0">
          <span className={cn(
            'block w-2.5 h-2.5 rounded-full',
            job.visaMatch.status === 'eligible' && 'bg-emerald-500',
            job.visaMatch.status === 'conditional' && 'bg-amber-500',
          )} />
        </div>

        {/* 주요 정보 / Main info */}
        <div className="flex-1 min-w-0">
          {/* 첫 줄: 제목 / Title row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
              {job.isPremium && (
                <Star className="inline w-3.5 h-3.5 text-amber-500 mr-1 -mt-0.5" />
              )}
              {job.title}
            </h3>
            <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap shrink-0">
              {timeAgo}
            </span>
          </div>

          {/* 둘째 줄: 회사명 / Company name */}
          <p className="text-xs text-gray-500 mt-0.5">{job.companyName}</p>

          {/* 셋째 줄: 메타 데이터 그리드 / Meta data grid */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs font-mono text-gray-600">
            <span className="font-semibold text-gray-800">
              {job.hourlyWage.toLocaleString()}원
            </span>
            <span>{scheduleText} {timeText}</span>
            <span className="text-gray-400">
              {job.displayAddress}
              {job.distanceFromSchool && (
                <span className="text-indigo-500 ml-1">({job.distanceFromSchool})</span>
              )}
            </span>
          </div>

          {/* 넷째 줄: 비자 태그 + 조건 / Visa tag + conditions */}
          <div className="flex items-center gap-2 mt-2">
            <VisaStatusBadge status={job.visaMatch.status} />
            {job.visaMatch.conditions.length > 0 && (
              <span className="text-[10px] text-amber-600 truncate">
                {job.visaMatch.conditions[0]}
              </span>
            )}
          </div>

          {/* 복리후생 태그 / Benefit tags */}
          {job.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {job.benefits.slice(0, 3).map((b) => (
                <span
                  key={b}
                  className="px-1.5 py-0.5 bg-gray-100 text-[10px] text-gray-500 rounded"
                >
                  {BENEFIT_LABELS[b as keyof typeof BENEFIT_LABELS]?.ko || b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 북마크 / Bookmark */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onToggleBookmark(); }}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
          aria-label="스크랩 / Bookmark"
          aria-pressed={bookmarked}
        >
          <Heart className={cn('w-4 h-4', bookmarked && 'fill-red-500 text-red-500')} />
        </button>
      </div>
    </Link>
  );
}

// ─── 비자 상태 배지 / Visa status badge ───

function VisaStatusBadge({ status }: { status: 'eligible' | 'conditional' }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
      status === 'eligible' && 'bg-emerald-50 text-emerald-700',
      status === 'conditional' && 'bg-amber-50 text-amber-700',
    )}>
      {status === 'eligible' ? (
        <Check className="w-2.5 h-2.5" />
      ) : (
        <AlertTriangle className="w-2.5 h-2.5" />
      )}
      {status === 'eligible' ? '지원 가능' : '조건부'}
    </span>
  );
}
