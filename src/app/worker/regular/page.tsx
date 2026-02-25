'use client';

/**
 * 정규채용관 목록 페이지 / Full-time job board listing page
 * - 로그인 사용자: 비자 적격 필터 토글 제공
 * - 필터 칩: 지역, 경력, 연봉, 직종
 * - 리스트형 카드 (그리드 아님)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  MapPin, ChevronLeft, ChevronRight, Briefcase,
  CheckCircle, AlertTriangle, XCircle, DollarSign,
  Building2, Clock, ChevronDown, X, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';

/* ─────────────────────────────────────────────
   타입 정의 / Type definitions
───────────────────────────────────────────── */
interface RegularJob {
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
  fulltimeAttributes: {
    salaryMin: number | null;
    salaryMax: number | null;
    experienceLevel: 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR';
    educationLevel: string;
    employmentType: string;
  } | null;
  company: {
    companyId: string;
    companyName: string;
    brandName: string | null;
    logoImageUrl: string | null;
  } | null;
  eligibility?: {
    eligible: boolean;
    visaCode: string;
    restrictions: string[];
  };
}

/* ─────────────────────────────────────────────
   상수 / Constants
───────────────────────────────────────────── */

/** 경력 레이블 / Experience level labels */
const EXP_LABELS: Record<string, string> = {
  ENTRY:  '신입',
  JUNIOR: '1~3년',
  MID:    '3~5년',
  SENIOR: '5년↑',
};

/** 정렬 옵션 / Sort options */
const SORT_OPTIONS = [
  { value: 'latest',  label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'salary',  label: '연봉순' },
];

/* 지역 필터 칩 / Region filter chips */
const REGION_CHIPS = ['전체', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '제주'];

/* 경력 필터 칩 / Experience filter chips */
type ExpChip = { label: string; value: string };
const EXP_CHIPS: ExpChip[] = [
  { label: '전체',  value: '' },
  { label: '신입',  value: 'ENTRY' },
  { label: '1년↑', value: 'JUNIOR' },
  { label: '3년↑', value: 'MID' },
  { label: '5년↑', value: 'SENIOR' },
];

/* 연봉 필터 칩 / Salary filter chips (client-side) */
type SalaryChip = { label: string; min: number | null };
const SALARY_CHIPS: SalaryChip[] = [
  { label: '전체',    min: null },
  { label: '2천만↑', min: 20000000 },
  { label: '3천만↑', min: 30000000 },
  { label: '4천만↑', min: 40000000 },
  { label: '5천만↑', min: 50000000 },
];

/* 직종 필터 칩 / Job category chips (client-side keyword match) */
type CategoryChip = { label: string; keyword: string };
const CATEGORY_CHIPS: CategoryChip[] = [
  { label: '전체',      keyword: '' },
  { label: '제조/생산', keyword: '제조|생산|공장|포장|조립' },
  { label: '서비스/판매', keyword: '서비스|판매|영업|매장|음식|식당' },
  { label: 'IT/기술',   keyword: 'IT|개발|프로그램|소프트웨어|기술|엔지니어' },
  { label: '건설/건축', keyword: '건설|건축|토목|시공|현장' },
  { label: '농업/어업', keyword: '농업|농장|어업|수산|축산' },
];

/* ─────────────────────────────────────────────
   헬퍼 함수 / Helper functions
───────────────────────────────────────────── */

/** 연봉 포맷 / Format salary range */
function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return '급여 협의';
  const toMan = (v: number) => Math.round(v / 10000).toLocaleString();
  if (min && max) return `${toMan(min)}~${toMan(max)}만원`;
  if (min)        return `${toMan(min)}만원↑`;
  if (max)        return `~${toMan(max)}만원`;
  return '급여 협의';
}

/** D-Day 계산 / Calculate D-Day label */
function getDDay(closingDate: string | null): string | null {
  if (!closingDate) return null;
  const diff = Math.ceil((new Date(closingDate).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return '마감';
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

/** 직종 키워드 매칭 / Match job category by keyword */
function matchCategory(job: RegularJob, keyword: string): boolean {
  if (!keyword) return true;
  const patterns = keyword.split('|');
  const haystack = job.title.toLowerCase();
  return patterns.some(p => haystack.includes(p.toLowerCase()));
}

/* ─────────────────────────────────────────────
   서브 컴포넌트: 필터 칩 행 / Filter chip row
───────────────────────────────────────────── */
interface ChipRowProps {
  label: string;
  chips: string[];
  active: string;
  onChange: (v: string) => void;
}
function ChipRow({ label, chips, active, onChange }: ChipRowProps) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="text-xs font-semibold text-gray-500 w-12 shrink-0">{label}</span>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => onChange(chip === '전체' ? '' : chip)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition ${
              (chip === '전체' && !active) || active === chip
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   서브 컴포넌트: 적격 뱃지 / Eligibility badge
───────────────────────────────────────────── */
function EligibilityBadge({ eligibility }: { eligibility?: RegularJob['eligibility'] }) {
  if (!eligibility) return null;

  if (eligibility.eligible && eligibility.restrictions.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded border border-green-200">
        <CheckCircle className="w-3 h-3" />지원 가능
      </span>
    );
  }
  if (eligibility.eligible && eligibility.restrictions.length > 0) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-semibold rounded border border-yellow-200"
        title={eligibility.restrictions[0]}
      >
        <AlertTriangle className="w-3 h-3" />조건부
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-semibold rounded border border-gray-200">
      <XCircle className="w-3 h-3" />지원 불가
    </span>
  );
}

/* ─────────────────────────────────────────────
   서브 컴포넌트: 공고 카드 / Job card
───────────────────────────────────────────── */
function JobCard({ job, showEligibility }: { job: RegularJob; showEligibility: boolean }) {
  const dDay = getDDay(job.closingDate);
  const companyName = job.company?.brandName || job.company?.companyName || '기업명 미공개';
  const visas = job.allowedVisas
    ? job.allowedVisas.split(',').map(v => v.trim()).filter(Boolean)
    : [];

  return (
    <Link
      href={`/worker/regular/${job.id}`}
      className={`block bg-white rounded-xl border transition hover:shadow-md hover:border-blue-300 group ${
        job.tierType === 'PREMIUM' ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200'
      }`}
    >
      <div className="p-4">
        <div className="flex gap-3">
          {/* 회사 로고 / Company logo */}
          <div className="w-12 h-12 rounded-lg border border-gray-100 bg-white flex items-center justify-center overflow-hidden shrink-0">
            {job.company?.logoImageUrl ? (
              <Image
                src={job.company.logoImageUrl}
                alt={companyName}
                width={48}
                height={48}
                className="object-contain w-full h-full"
              />
            ) : (
              <Building2 className="w-6 h-6 text-gray-300" />
            )}
          </div>

          {/* 본문 / Main content */}
          <div className="flex-1 min-w-0">
            {/* 상단 행: 회사명 + 뱃지들 / Top row: company name + badges */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-xs text-gray-500 truncate">{companyName}</span>
              <div className="flex items-center gap-1 shrink-0">
                {job.tierType === 'PREMIUM' && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                    PREMIUM
                  </span>
                )}
                {dDay && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    dDay === '마감'
                      ? 'bg-red-100 text-red-600'
                      : dDay === 'D-Day'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-blue-50 text-blue-600'
                  }`}>
                    {dDay}
                  </span>
                )}
              </div>
            </div>

            {/* 공고 제목 / Job title */}
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-1">
              {job.title}
            </h3>

            {/* 핵심 정보 행 / Key info row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
              {job.displayAddress && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {job.displayAddress}
                </span>
              )}
              {job.fulltimeAttributes && (
                <span className="flex items-center gap-0.5 text-blue-600 font-semibold">
                  <DollarSign className="w-3 h-3 shrink-0" />
                  {formatSalary(job.fulltimeAttributes.salaryMin, job.fulltimeAttributes.salaryMax)}
                </span>
              )}
              {job.fulltimeAttributes?.experienceLevel && (
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3 shrink-0" />
                  경력 {EXP_LABELS[job.fulltimeAttributes.experienceLevel]}
                </span>
              )}
              {job.fulltimeAttributes?.employmentType && (
                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-600">
                  {job.fulltimeAttributes.employmentType}
                </span>
              )}
            </div>

            {/* 하단 행: 비자 태그 + 적격 뱃지 / Bottom row: visa tags + eligibility */}
            <div className="flex items-center gap-1 flex-wrap">
              {showEligibility && <EligibilityBadge eligibility={job.eligibility} />}
              {visas.slice(0, 4).map((v) => (
                <span key={v} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
                  {v}
                </span>
              ))}
              {visas.length > 4 && (
                <span className="text-[10px] text-gray-400">+{visas.length - 4}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   메인 컴포넌트 / Main component
───────────────────────────────────────────── */
export default function RegularJobsPage() {
  const { user } = useAuth();

  /* ── 상태 / State ── */
  const [jobs, setJobs]               = useState<RegularJob[]>([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [sort, setSort]               = useState('latest');
  const [sortOpen, setSortOpen]       = useState(false);

  /* 필터 / Filters */
  const [regionFilter, setRegionFilter]     = useState('');
  const [expFilter, setExpFilter]           = useState('');
  const [salaryMin, setSalaryMin]           = useState<number | null>(null);
  const [salaryLabel, setSalaryLabel]       = useState('');
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [categoryLabel, setCategoryLabel]   = useState('');

  /* 나에게 맞는 공고 토글 / Eligibility toggle */
  const [eligibilityFilterOn, setEligibilityFilterOn] = useState(false);
  const [isVerified, setIsVerified]                   = useState(false);
  const [userVisaCode, setUserVisaCode]               = useState<string | null>(null);
  const [checkingVisa, setCheckingVisa]               = useState(false);

  /* ── 비자 인증 여부 확인 / Check visa verification ── */
  useEffect(() => {
    if (!user) return;
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    setCheckingVisa(true);
    fetch('/api/visa-verification/me', {
      headers: { Authorization: `Bearer ${sessionId}` },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        if (data?.visaCode && data?.verificationStatus !== 'REJECTED') {
          setIsVerified(true);
          setUserVisaCode(data.visaCode);
          setEligibilityFilterOn(true); // 기본 ON / default ON
        }
      })
      .catch(() => { /* 미인증 상태 유지 / remain unverified */ })
      .finally(() => setCheckingVisa(false));
  }, [user]);

  /* ── 데이터 로드 / Data fetch ── */
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const authHeader: Record<string, string> = {};
      if (sessionId) authHeader['Authorization'] = `Bearer ${sessionId}`;

      const params = new URLSearchParams({
        boardType: 'FULL_TIME',
        page:      page.toString(),
        limit:     '20',
      });
      if (regionFilter) params.set('sido', regionFilter);
      if (expFilter)    params.set('experienceLevel', expFilter);
      if (sort === 'popular') params.set('sort', 'popular');
      if (sort === 'salary')  params.set('sort', 'salary');

      // 나에게 맞는 공고 ON + 인증 사용자 → eligible API
      // If eligibility filter ON and verified user → use eligible API
      const endpoint = (eligibilityFilterOn && isVerified)
        ? `/api/jobs/eligible?${params}`
        : `/api/jobs/listing?${params}`;

      const res = await fetch(endpoint, { headers: authHeader });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setJobs(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, regionFilter, expFilter, eligibilityFilterOn, isVerified]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  /* ── 클라이언트 필터 적용 / Apply client-side filters ── */
  const filteredJobs = jobs.filter(job => {
    // 연봉 필터 / Salary filter
    if (salaryMin !== null) {
      const jobSalary = job.fulltimeAttributes?.salaryMin ?? 0;
      if (jobSalary < salaryMin) return false;
    }
    // 직종 필터 / Category filter
    if (categoryKeyword && !matchCategory(job, categoryKeyword)) return false;
    return true;
  });

  /* 프리미엄 / 일반 분리 / Split premium vs standard */
  const premiumJobs  = filteredJobs.filter(j => j.tierType === 'PREMIUM');
  const standardJobs = filteredJobs.filter(j => j.tierType !== 'PREMIUM');

  /* ── 활성 필터 태그 목록 / Active filter tags ── */
  const activeTags: { label: string; clear: () => void }[] = [];
  if (regionFilter)   activeTags.push({ label: regionFilter,   clear: () => { setRegionFilter('');   setPage(1); } });
  if (expFilter)      activeTags.push({ label: EXP_LABELS[expFilter] ?? expFilter, clear: () => { setExpFilter(''); setPage(1); } });
  if (salaryLabel)    activeTags.push({ label: salaryLabel,    clear: () => { setSalaryMin(null); setSalaryLabel(''); } });
  if (categoryLabel)  activeTags.push({ label: categoryLabel,  clear: () => { setCategoryKeyword(''); setCategoryLabel(''); } });

  /* ── 헬퍼: 페이지 변경 / Page change helper ── */
  const goPage = (n: number) => {
    setPage(Math.max(1, Math.min(totalPages, n)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showEligibility = isVerified;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* ── 헤더 / Header ── */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">정규채용관</h1>
        <p className="text-xs text-gray-500 mt-0.5">Full-time Job Board — 외국인이 지원 가능한 정규직 공고</p>
      </div>

      {/* ── 나에게 맞는 공고만 보기 토글 / Eligibility toggle ── */}
      {user && (
        <div className={`rounded-xl border p-3 mb-4 flex items-center justify-between gap-3 ${
          isVerified
            ? 'bg-green-50 border-green-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          {checkingVisa ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>비자 인증 상태 확인 중...</span>
            </div>
          ) : isVerified ? (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-sm text-green-800 font-medium">
                  비자 인증 완료
                  {userVisaCode && <span className="text-green-600 ml-1">({userVisaCode})</span>}
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <span className="text-xs text-green-700 font-medium">나에게 맞는 공고만 보기</span>
                <button
                  onClick={() => { setEligibilityFilterOn(prev => !prev); setPage(1); }}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    eligibilityFilterOn ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    eligibilityFilterOn ? 'translate-x-5' : ''
                  }`} />
                </button>
              </label>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">비자 인증하면 맞춤 공고를 확인할 수 있어요</p>
                  <p className="text-xs text-blue-600 mt-0.5">내 비자로 지원 가능한 공고만 필터링하세요</p>
                </div>
              </div>
              <Link
                href="/worker/visa"
                className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
              >
                인증하기
              </Link>
            </>
          )}
        </div>
      )}

      {/* ── 필터 칩 바 / Filter chip bar ── */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 mb-4">
        <ChipRow
          label="지역"
          chips={REGION_CHIPS}
          active={regionFilter}
          onChange={(v) => { setRegionFilter(v); setPage(1); }}
        />
        <div className="border-t border-gray-100 my-0.5" />
        <ChipRow
          label="경력"
          chips={EXP_CHIPS.map(c => c.label)}
          active={EXP_CHIPS.find(c => c.value === expFilter)?.label ?? ''}
          onChange={(label) => {
            const found = EXP_CHIPS.find(c => c.label === label);
            setExpFilter(found ? found.value : '');
            setPage(1);
          }}
        />
        <div className="border-t border-gray-100 my-0.5" />
        <ChipRow
          label="연봉"
          chips={SALARY_CHIPS.map(c => c.label)}
          active={salaryLabel}
          onChange={(label) => {
            const found = SALARY_CHIPS.find(c => c.label === label);
            if (found) { setSalaryMin(found.min); setSalaryLabel(found.label === '전체' ? '' : found.label); }
          }}
        />
        <div className="border-t border-gray-100 my-0.5" />
        <ChipRow
          label="직종"
          chips={CATEGORY_CHIPS.map(c => c.label)}
          active={categoryLabel}
          onChange={(label) => {
            const found = CATEGORY_CHIPS.find(c => c.label === label);
            if (found) {
              setCategoryKeyword(found.keyword);
              setCategoryLabel(found.label === '전체' ? '' : found.label);
            }
          }}
        />
      </div>

      {/* ── 활성 필터 태그 / Active filter tags ── */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeTags.map((tag) => (
            <span
              key={tag.label}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
            >
              {tag.label}
              <button onClick={tag.clear} className="ml-0.5 hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              setRegionFilter(''); setExpFilter('');
              setSalaryMin(null); setSalaryLabel('');
              setCategoryKeyword(''); setCategoryLabel('');
              setPage(1);
            }}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            전체 초기화
          </button>
        </div>
      )}

      {/* ── 결과 수 + 정렬 / Results count + sort ── */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">
          {loading ? '검색 중...' : `총 ${total.toLocaleString()}건`}
        </span>
        <div className="relative">
          <button
            onClick={() => setSortOpen(o => !o)}
            className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 bg-white"
          >
            {SORT_OPTIONS.find(o => o.value === sort)?.label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-lg shadow-lg border py-1 z-10">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSort(opt.value); setSortOpen(false); setPage(1); }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    sort === opt.value ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 공고 목록 / Job list ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-600 mb-1">
            {eligibilityFilterOn ? '내 비자로 지원 가능한 공고가 없습니다' : '등록된 공고가 없습니다'}
          </h3>
          <p className="text-xs text-gray-400">
            {eligibilityFilterOn
              ? '필터를 해제하면 전체 공고를 볼 수 있어요.'
              : '조건을 변경하거나 나중에 다시 확인해보세요.'}
          </p>
          {eligibilityFilterOn && (
            <button
              onClick={() => { setEligibilityFilterOn(false); setPage(1); }}
              className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium underline"
            >
              전체 공고 보기
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* 프리미엄 공고 / Premium jobs */}
          {premiumJobs.length > 0 && (
            <>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">프리미엄 공고</p>
              {premiumJobs.map(job => (
                <JobCard key={job.id} job={job} showEligibility={showEligibility} />
              ))}
              {standardJobs.length > 0 && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-2">일반 공고</p>
              )}
            </>
          )}
          {/* 일반 공고 / Standard jobs */}
          {standardJobs.map(job => (
            <JobCard key={job.id} job={job} showEligibility={showEligibility} />
          ))}
        </div>
      )}

      {/* ── 페이지네이션 / Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-8">
          <button
            onClick={() => goPage(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            const num = start + i;
            return (
              <button
                key={num}
                onClick={() => goPage(num)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                  num === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {num}
              </button>
            );
          })}
          <button
            onClick={() => goPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
