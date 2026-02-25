'use client';

/**
 * 알바채용관 (개인회원용) — 비자 필터 + 칩 기반 필터 + 맞춤 공고 토글
 * Part-time Job Board (worker) — visa filter + chip filters + personalized toggle
 */

import { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  Briefcase,
  Clock,
  Calendar,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

// ─── 타입 정의 / Type definitions ───────────────────────────────────────────

interface AlbaJob {
  id: string;
  title: string;
  boardType: string;
  tierType: 'PREMIUM' | 'STANDARD';
  status: string;
  displayAddress: string;
  allowedVisas: string;
  applicationMethod: string;
  viewCount: number;
  scrapCount: number;
  applyCount: number;
  closingDate: string | null;
  createdAt: string;
  albaAttributes: {
    hourlyWage: number;
    workPeriod: string | null;
    workDaysMask: string;
    workTimeStart: string | null;
    workTimeEnd: string | null;
  } | null;
  company: {
    companyId: string;
    companyName: string;
    brandName: string | null;
    logoImageUrl: string | null;
  } | null;
  /** 비자 필터 적용 시 서버에서 내려주는 적격 정보 / Eligibility info from visa-filtered API */
  eligibility?: {
    eligible: boolean;
    visaCode: string;
    restrictions: string[];
    notes?: string[];
    documentsRequired?: string[];
  };
}

// ─── 필터 옵션 상수 / Filter option constants ────────────────────────────────

/** 지역 필터 / Region filter options */
const REGION_OPTIONS = [
  { label: '전체', value: '' },
  { label: '서울', value: '서울' },
  { label: '경기', value: '경기' },
  { label: '인천', value: '인천' },
  { label: '부산', value: '부산' },
  { label: '대구', value: '대구' },
  { label: '대전', value: '대전' },
  { label: '광주', value: '광주' },
  { label: '울산', value: '울산' },
  { label: '제주', value: '제주' },
];

/** 시간대 필터 / Time-of-day filter options */
const TIME_OPTIONS = [
  { label: '전체', value: '' },
  { label: '오전(06~12)', value: 'morning' },
  { label: '오후(12~18)', value: 'afternoon' },
  { label: '저녁(18~22)', value: 'evening' },
  { label: '야간(22~06)', value: 'night' },
  { label: '시간협의', value: 'flexible' },
];

/** 시급 필터 / Hourly wage filter options */
const WAGE_OPTIONS = [
  { label: '전체', value: '' },
  { label: '최저시급(~10,030)', value: '0' },
  { label: '1만원+', value: '10000' },
  { label: '1.2만원+', value: '12000' },
  { label: '1.5만원+', value: '15000' },
];

/** 근무일 필터 / Work days filter options */
const WORKDAY_OPTIONS = [
  { label: '전체', value: '' },
  { label: '주중', value: 'weekday' },
  { label: '주말', value: 'weekend' },
  { label: '요일협의', value: 'flexible' },
];

/** 정렬 옵션 / Sort options */
const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '시급 높은순', value: 'wage_desc' },
  { label: '마감임박순', value: 'closing' },
  { label: '지원자 많은순', value: 'apply_desc' },
];

// ─── 유틸 함수 / Utility functions ───────────────────────────────────────────

/** 마감일 D-Day 계산 / Calculate D-Day from closing date */
function getDDay(closingDate: string | null): string | null {
  if (!closingDate) return null;
  const diff = Math.ceil((new Date(closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return '마감';
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

/** 근무 시간 문자열로 변환 / Format work time to display string */
function formatWorkTime(start: string | null, end: string | null): string {
  if (!start && !end) return '시간협의';
  if (start && end) return `${start}~${end}`;
  return start || end || '시간협의';
}

/** workDaysMask → 한글 텍스트 / Convert workDaysMask to Korean display text */
function formatWorkDays(mask: string): string {
  const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
  if (!mask || mask.length < 7) return '협의';
  const selected = DAYS.filter((_, i) => mask[i] === '1');
  if (selected.length === 0) return '협의';
  if (selected.length === 7) return '주 7일';
  const weekdays = ['월', '화', '수', '목', '금'];
  const weekends = ['토', '일'];
  const isWeekdays = selected.every(d => weekdays.includes(d)) && selected.length === 5;
  const isWeekend = selected.every(d => weekends.includes(d)) && selected.length === 2;
  if (isWeekdays) return '주 5일(주중)';
  if (isWeekend) return '주말';
  return `주 ${selected.length}일`;
}

// ─── 클라이언트 사이드 필터 함수 / Client-side filter functions ─────────────

/** 시간대로 공고 필터링 / Filter jobs by time-of-day */
function filterByTime(job: AlbaJob, timeFilter: string): boolean {
  if (!timeFilter) return true;
  const attrs = job.albaAttributes;
  if (!attrs) return timeFilter === 'flexible';
  const { workTimeStart } = attrs;
  if (timeFilter === 'flexible') return !workTimeStart;
  if (!workTimeStart) return false;
  const hour = parseInt(workTimeStart.split(':')[0], 10);
  if (timeFilter === 'morning')   return hour >= 6  && hour < 12;
  if (timeFilter === 'afternoon') return hour >= 12 && hour < 18;
  if (timeFilter === 'evening')   return hour >= 18 && hour < 22;
  if (timeFilter === 'night')     return hour >= 22 || hour < 6;
  return true;
}

/** 시급으로 공고 필터링 / Filter jobs by hourly wage */
function filterByWage(job: AlbaJob, wageFilter: string): boolean {
  if (!wageFilter) return true;
  const wage = job.albaAttributes?.hourlyWage ?? 0;
  const minWage = parseInt(wageFilter, 10);
  if (wageFilter === '0') return wage <= 10030;
  return wage >= minWage;
}

/** 근무일로 공고 필터링 / Filter jobs by work days */
function filterByWorkday(job: AlbaJob, workdayFilter: string): boolean {
  if (!workdayFilter) return true;
  const mask = job.albaAttributes?.workDaysMask;
  if (!mask || mask.length < 7) return workdayFilter === 'flexible';
  const WEEKDAY_MASK_INDICES = [0, 1, 2, 3, 4];
  const WEEKEND_MASK_INDICES = [5, 6];
  const hasWeekday = WEEKDAY_MASK_INDICES.some(i => mask[i] === '1');
  const hasWeekend = WEEKEND_MASK_INDICES.some(i => mask[i] === '1');
  if (workdayFilter === 'weekday') return hasWeekday && !hasWeekend;
  if (workdayFilter === 'weekend') return hasWeekend;
  if (workdayFilter === 'flexible') return !hasWeekday && !hasWeekend;
  return true;
}

/** 정렬 함수 / Sort jobs by selected option */
function sortJobs(jobs: AlbaJob[], sortBy: string): AlbaJob[] {
  const sorted = [...jobs];
  switch (sortBy) {
    case 'wage_desc':
      return sorted.sort((a, b) => (b.albaAttributes?.hourlyWage ?? 0) - (a.albaAttributes?.hourlyWage ?? 0));
    case 'closing':
      return sorted.sort((a, b) => {
        if (!a.closingDate) return 1;
        if (!b.closingDate) return -1;
        return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
      });
    case 'apply_desc':
      return sorted.sort((a, b) => b.applyCount - a.applyCount);
    default: // 'latest'
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

// ─── 메인 컴포넌트 / Main component ─────────────────────────────────────────

export default function WorkerAlbaPage() {
  const { isLoggedIn, role } = useAuth();

  // 데이터 상태 / Data state
  const [allJobs, setAllJobs] = useState<AlbaJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 비자 인증 상태 / Visa verification state
  const [visaVerified, setVisaVerified] = useState(false);
  const [visaCode, setVisaCode] = useState<string | null>(null);
  const [personalizedOn, setPersonalizedOn] = useState(false);

  // 필터 상태 / Filter state
  const [regionFilter, setRegionFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [wageFilter, setWageFilter] = useState('');
  const [workdayFilter, setWorkdayFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // 비자 인증 여부 확인 (개인회원만) / Check visa verification (individual users only)
  useEffect(() => {
    if (!isLoggedIn || role !== 'INDIVIDUAL') return;

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    fetch('/api/visa-verification/me', {
      headers: { Authorization: `Bearer ${sessionId}` },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(verification => {
        if (
          verification &&
          verification.visaCode &&
          verification.verificationStatus !== 'REJECTED'
        ) {
          setVisaVerified(true);
          setVisaCode(verification.visaCode);
          setPersonalizedOn(true); // 기본값 ON / Default ON for verified users
        }
      })
      .catch(() => {
        // 인증 없음 / No verification
      });
  }, [isLoggedIn, role]);

  // 공고 목록 조회 / Fetch job listings
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const params = new URLSearchParams({
        boardType: 'PART_TIME',
        page: page.toString(),
        limit: '50', // 클라이언트 필터용 충분한 수 / Fetch enough for client-side filtering
      });

      if (regionFilter) params.set('sido', regionFilter);

      // 개인 회원 + 비자 인증 + 맞춤 ON → eligible API / Individual + verified + ON → eligible API
      const useEligible = isLoggedIn && role === 'INDIVIDUAL' && visaVerified && personalizedOn;
      const endpoint = useEligible ? '/api/jobs/eligible' : '/api/jobs/listing';

      const headers: Record<string, string> = {};
      if (sessionId) headers['Authorization'] = `Bearer ${sessionId}`;

      const res = await fetch(`${endpoint}?${params}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setAllJobs(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch {
      // 에러 시 빈 목록 유지 / Keep empty on error
    } finally {
      setLoading(false);
    }
  }, [page, regionFilter, isLoggedIn, role, visaVerified, personalizedOn]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // 클라이언트 사이드 필터링 + 정렬 / Client-side filtering + sorting
  const filteredJobs = sortJobs(
    allJobs.filter(job =>
      filterByTime(job, timeFilter) &&
      filterByWage(job, wageFilter) &&
      filterByWorkday(job, workdayFilter)
    ),
    sortBy,
  );

  // 프리미엄 / 일반 분리 / Separate premium from standard
  const premiumJobs = filteredJobs.filter(j => j.tierType === 'PREMIUM');
  const standardJobs = filteredJobs.filter(j => j.tierType === 'STANDARD');

  /** 활성 필터 태그 / Active filter tags for dismissible display */
  const activeTags: { key: string; label: string; clear: () => void }[] = [];
  if (regionFilter) activeTags.push({ key: 'region', label: `지역: ${regionFilter}`, clear: () => setRegionFilter('') });
  if (timeFilter)   activeTags.push({ key: 'time', label: `시간: ${TIME_OPTIONS.find(o => o.value === timeFilter)?.label ?? timeFilter}`, clear: () => setTimeFilter('') });
  if (wageFilter)   activeTags.push({ key: 'wage', label: `시급: ${WAGE_OPTIONS.find(o => o.value === wageFilter)?.label ?? wageFilter}`, clear: () => setWageFilter('') });
  if (workdayFilter) activeTags.push({ key: 'workday', label: `근무일: ${WORKDAY_OPTIONS.find(o => o.value === workdayFilter)?.label ?? workdayFilter}`, clear: () => setWorkdayFilter('') });

  /** 적격 뱃지 렌더 / Render eligibility badge */
  const renderEligibilityBadge = (job: AlbaJob) => {
    if (!isLoggedIn) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-semibold rounded border border-gray-200">
          로그인 필요
        </span>
      );
    }
    if (!job.eligibility) return null;
    if (job.eligibility.eligible && job.eligibility.restrictions.length === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded border border-green-200">
          <CheckCircle className="w-3 h-3" />지원가능
        </span>
      );
    }
    if (job.eligibility.eligible && job.eligibility.restrictions.length > 0) {
      return (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-semibold rounded border border-yellow-200"
          title={job.eligibility.restrictions[0]}
        >
          <AlertTriangle className="w-3 h-3" />조건부
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-semibold rounded border border-red-200">
        <XCircle className="w-3 h-3" />지원불가
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">알바채용관</h1>
        <p className="text-xs text-gray-500 mt-0.5">Part-time Job Board · 외국인이 지원 가능한 알바 공고</p>
      </div>

      {/* 비자 미인증 배너 (개인회원 + 미인증) / Unverified individual banner */}
      {isLoggedIn && role === 'INDIVIDUAL' && !visaVerified && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">비자 인증 후 맞춤 공고를 확인하세요</p>
              <p className="text-xs text-blue-600 mt-0.5">내 비자로 지원 가능한 공고만 필터링하고 적격 여부를 바로 확인할 수 있어요</p>
            </div>
          </div>
          <Link
            href="/worker/visa-verification"
            className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
          >
            인증하기
          </Link>
        </div>
      )}

      {/* 나에게 맞는 공고만 보기 토글 (비자 인증 완료 시) / Personalized toggle (verified only) */}
      {isLoggedIn && role === 'INDIVIDUAL' && visaVerified && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <div>
              <span className="text-sm font-semibold text-green-800">
                나에게 맞는 공고만 보기
              </span>
              {visaCode && (
                <span className="ml-1.5 text-xs text-green-600 font-medium">({visaCode})</span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setPersonalizedOn(prev => !prev);
              setPage(1);
            }}
            className={`relative w-11 h-6 rounded-full transition-colors ${personalizedOn ? 'bg-green-500' : 'bg-gray-300'}`}
            aria-label="나에게 맞는 공고만 보기 토글 / Toggle personalized job filter"
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${personalizedOn ? 'translate-x-5' : ''}`}
            />
          </button>
        </div>
      )}

      {/* 필터 칩 바 / Filter chip bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3 overflow-hidden">
        {/* 지역 / Region */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-gray-500 shrink-0 w-10">지역</span>
          <div className="flex gap-1.5 flex-nowrap">
            {REGION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setRegionFilter(opt.value); setPage(1); }}
                className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition whitespace-nowrap ${
                  regionFilter === opt.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 시간대 / Time of day */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-gray-500 shrink-0 w-10">시간</span>
          <div className="flex gap-1.5 flex-nowrap">
            {TIME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTimeFilter(opt.value)}
                className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition whitespace-nowrap ${
                  timeFilter === opt.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 시급 / Hourly wage */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-gray-500 shrink-0 w-10">시급</span>
          <div className="flex gap-1.5 flex-nowrap">
            {WAGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setWageFilter(opt.value)}
                className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition whitespace-nowrap ${
                  wageFilter === opt.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 근무일 / Work days */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-gray-500 shrink-0 w-10">근무일</span>
          <div className="flex gap-1.5 flex-nowrap">
            {WORKDAY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setWorkdayFilter(opt.value)}
                className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition whitespace-nowrap ${
                  workdayFilter === opt.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 활성 필터 태그 + 결과 수 + 정렬 / Active filter tags + results count + sort */}
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* 결과 수 / Results count */}
          <span className="text-xs text-gray-500 font-medium">
            총 <span className="text-blue-600 font-semibold">{filteredJobs.length}</span>건
            {total > 0 && total !== filteredJobs.length && ` (전체 ${total}건)`}
          </span>
          {/* 활성 태그 / Active filter tags */}
          {activeTags.map(tag => (
            <button
              key={tag.key}
              onClick={tag.clear}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200 hover:bg-blue-100 transition"
            >
              {tag.label}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
        {/* 정렬 / Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 outline-none cursor-pointer hover:border-blue-400 transition"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* 로딩 스피너 / Loading spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
          <p className="text-sm text-gray-400">공고를 불러오는 중...</p>
        </div>
      ) : (
        <>
          {/* 프리미엄 공고 / Premium jobs */}
          {premiumJobs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-400 rounded-full" />
                프리미엄 공고
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {premiumJobs.map(job => (
                  <AlbaJobCard
                    key={job.id}
                    job={job}
                    eligibilityBadge={renderEligibilityBadge(job)}
                    isPremium
                  />
                ))}
              </div>
            </div>
          )}

          {/* 일반 공고 / Standard jobs */}
          <div className="mb-6">
            {premiumJobs.length > 0 && (
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                일반 공고
              </h2>
            )}
            {filteredJobs.length === 0 ? (
              /* 빈 상태 / Empty state */
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  조건에 맞는 공고가 없습니다
                </h3>
                <p className="text-sm text-gray-400">
                  {personalizedOn
                    ? '필터를 해제하거나 맞춤 공고 토글을 꺼보세요.'
                    : '검색 조건을 변경해보세요.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {standardJobs.map(job => (
                  <AlbaJobCard
                    key={job.id}
                    job={job}
                    eligibilityBadge={renderEligibilityBadge(job)}
                    isPremium={false}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 페이지네이션 / Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const num = start + i;
                return (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition ${
                      num === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── 공고 카드 컴포넌트 / Job card component ────────────────────────────────

interface AlbaJobCardProps {
  job: AlbaJob;
  eligibilityBadge: React.ReactNode;
  isPremium: boolean;
}

function AlbaJobCard({ job, eligibilityBadge, isPremium }: AlbaJobCardProps) {
  const dday = getDDay(job.closingDate);
  const companyName = job.company?.brandName || job.company?.companyName || '기업명 없음';
  const wages = job.albaAttributes?.hourlyWage;
  const workTime = job.albaAttributes
    ? formatWorkTime(job.albaAttributes.workTimeStart, job.albaAttributes.workTimeEnd)
    : null;
  const workDays = job.albaAttributes?.workDaysMask
    ? formatWorkDays(job.albaAttributes.workDaysMask)
    : null;

  return (
    <Link href={`/worker/alba/${job.id}`}>
      <div
        className={`bg-white rounded-xl border p-4 hover:shadow-md hover:border-blue-300 transition group cursor-pointer h-full ${
          isPremium ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200'
        }`}
      >
        {/* 헤더: 배지 + D-Day / Header: badges + D-Day */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isPremium && (
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                PREMIUM
              </span>
            )}
            {eligibilityBadge}
          </div>
          {dday && (
            <span
              className={`text-[11px] font-semibold shrink-0 ${
                dday === '마감' ? 'text-red-500' : 'text-blue-600'
              }`}
            >
              {dday}
            </span>
          )}
        </div>

        {/* 회사명 / Company name */}
        <p className="text-xs text-gray-500 mb-1">{companyName}</p>

        {/* 공고 제목 / Job title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2.5 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {job.title}
        </h3>

        {/* 핵심 정보 / Key info */}
        <div className="space-y-1 mb-3">
          {job.displayAddress && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{job.displayAddress}</span>
            </div>
          )}
          {workTime && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{workTime}</span>
            </div>
          )}
          {workDays && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{workDays}</span>
            </div>
          )}
        </div>

        {/* 하단: 시급 + 허용 비자 + 조회수 / Bottom: wage + allowed visas + view count */}
        <div className="flex items-end justify-between mt-auto pt-2.5 border-t border-gray-100">
          <div>
            {wages ? (
              <span className="text-sm font-bold text-blue-600">
                시급 {wages.toLocaleString()}원
              </span>
            ) : (
              <span className="text-xs text-gray-400">시급 협의</span>
            )}
            {/* 비자 배지 / Visa tags */}
            {job.allowedVisas && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {job.allowedVisas.split(',').slice(0, 3).map(v => (
                  <span
                    key={v}
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded"
                  >
                    {v.trim()}
                  </span>
                ))}
                {job.allowedVisas.split(',').length > 3 && (
                  <span className="text-[10px] text-gray-400">
                    +{job.allowedVisas.split(',').length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          <span className="text-[11px] text-gray-400 flex items-center gap-0.5 shrink-0">
            <Eye className="w-3 h-3" />
            {job.viewCount.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── 미사용 import 제거용 export (빌드 트리 쉐이킹) / Unused export for tree shaking ─
export type { AlbaJob };
