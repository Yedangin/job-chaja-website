'use client';

/**
 * 스크랩한 공고 목록 페이지 / Saved Jobs page
 * - 북마크된 공고를 페이지네이션과 함께 표시
 * - Displays bookmarked job listings with pagination and boardType filter
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Bookmark,
  Building2,
  MapPin,
  Trash2,
  LogIn,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';

// ── 타입 정의 / Type definitions ───────────────────────────────────────────────

// 공고 보드 타입 / Job board type
type BoardType = 'PART_TIME' | 'FULL_TIME';

// 공고 상태 / Job status
type JobStatus = 'ACTIVE' | 'CLOSED' | 'EXPIRED';

// 공고 티어 / Job tier
type TierType = 'PREMIUM' | 'STANDARD';

// 알바 공고 속성 / Part-time job attributes
interface AlbaAttributes {
  hourlyWage: number;
  workDaysMask: string;
  workTimeStart: string | null;
  workTimeEnd: string | null;
}

// 정규직 공고 속성 / Full-time job attributes
interface FulltimeAttributes {
  salaryMin: number | null;
  salaryMax: number | null;
  experienceLevel: string;
}

// 공고 정보 / Job info embedded in scrap
interface ScrapJob {
  id: string;
  title: string;
  boardType: BoardType;
  status: JobStatus;
  displayAddress: string;
  closingDate: string | null;
  tierType: TierType;
  albaAttributes: AlbaAttributes | null;
  fulltimeAttributes: FulltimeAttributes | null;
  company: {
    companyName: string;
    brandName: string | null;
    logoImageUrl: string | null;
  } | null;
}

// 스크랩 항목 / Single scrap entry
interface ScrapItem {
  id: string;
  jobId: string;
  createdAt: string;
  job: ScrapJob;
}

// API 페이지네이션 응답 / Paginated API response
interface ScrapListResponse {
  items: ScrapItem[];
  total: number;
  page: number;
  limit: number;
}

// 필터 탭 키 / Filter tab key
type FilterTab = 'ALL' | 'PART_TIME' | 'FULL_TIME';

// ── 헬퍼 함수 / Helper functions ───────────────────────────────────────────────

/**
 * D-Day 문자열 계산 / Calculate D-Day string
 */
function getDDay(closingDate: string | null): string {
  if (!closingDate) return '상시채용';
  const diff = Math.ceil((new Date(closingDate).getTime() - Date.now()) / 86400000);
  if (diff < 0) return '마감';
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

/**
 * 날짜 포맷 "YYYY.MM.DD" / Format date as "YYYY.MM.DD"
 */
function formatDate(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/**
 * 숫자를 "N만원" 또는 "N천만원" 형식으로 변환 / Format salary number to Korean unit
 */
function formatSalary(amount: number | null): string {
  if (amount === null) return '';
  const man = Math.floor(amount / 10000);
  if (man >= 10000) {
    const eok = (man / 10000).toFixed(1).replace(/\.0$/, '');
    return `${eok}억원`;
  }
  if (man >= 1000) {
    const chun = (man / 1000).toFixed(1).replace(/\.0$/, '');
    return `${chun}천만원`;
  }
  return `${man}만원`;
}

/**
 * 알바 근무요일 마스크를 간략히 표시 / Summarize work days mask
 * 마스크: 월화수목금토일 순 7비트 문자열 / 7-char bitmask Mon–Sun
 */
function formatWorkDays(mask: string): string {
  if (!mask || mask.length < 7) return '';
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const active = days.filter((_, i) => mask[i] === '1');
  if (active.length === 5 && mask.slice(0, 5) === '11111') return '주5일';
  if (active.length === 6 && mask.slice(0, 6) === '111111') return '주6일';
  if (active.length === 7) return '주7일';
  if (active.length === 0) return '';
  return active.join('') + '요일';
}

// ── 서브 컴포넌트 / Sub-components ────────────────────────────────────────────

// 로딩 스켈레톤 카드 / Loading skeleton card
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        {/* 로고 자리 / Logo placeholder */}
        <div className="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="flex gap-1.5">
              <div className="h-5 w-14 bg-gray-200 rounded-full" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
          </div>
          <div className="h-5 w-56 bg-gray-200 rounded mb-3" />
          <div className="h-3 w-36 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-48 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// 미로그인 상태 / Not logged in state
function NotLoggedIn() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <LogIn className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        로그인이 필요합니다
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        로그인하여 스크랩한 공고를 확인하세요.
        <br />
        Log in to view your saved jobs.
      </p>
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
      >
        <LogIn className="w-4 h-4" />
        로그인하기
      </Link>
    </div>
  );
}

// 빈 상태 / Empty state
function EmptyState({ activeTab }: { activeTab: FilterTab }) {
  const isFiltered = activeTab !== 'ALL';
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Bookmark className="w-8 h-8 text-blue-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        {isFiltered ? '해당 유형의 스크랩 공고가 없습니다' : '스크랩한 공고가 없습니다'}
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        {isFiltered
          ? '다른 탭을 선택하거나 전체 보기로 전환해보세요.'
          : '관심 있는 공고를 스크랩하면 여기서 모아볼 수 있습니다.'}
        <br />
        {isFiltered
          ? 'Try a different tab or switch to All.'
          : 'Save jobs you are interested in to view them here.'}
      </p>
      {!isFiltered && (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* 알바채용관 바로가기 / Go to part-time job board */}
          <Link
            href="/worker/alba"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
          >
            알바채용관 바로가기
          </Link>
          {/* 정규채용관 바로가기 / Go to full-time job board */}
          <Link
            href="/worker/regular"
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-blue-400 hover:text-blue-600 transition"
          >
            정규채용관 바로가기
          </Link>
        </div>
      )}
    </div>
  );
}

// 페이지네이션 컴포넌트 / Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // 표시할 페이지 번호 목록 계산 / Calculate visible page numbers
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* 이전 페이지 / Previous page */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>

      {/* 첫 페이지 생략 표시 / First page with ellipsis */}
      {start > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            1
          </button>
          {start > 2 && (
            <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
              …
            </span>
          )}
        </>
      )}

      {/* 페이지 번호들 / Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
            p === currentPage
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}

      {/* 마지막 페이지 생략 표시 / Last page with ellipsis */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
              …
            </span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 페이지 / Next page */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}

// ── 스크랩 카드 / Scrap card ───────────────────────────────────────────────────
interface ScrapCardProps {
  item: ScrapItem;
  onRemove: (jobId: string) => void;
  removing: boolean;
}

function ScrapCard({ item, onRemove, removing }: ScrapCardProps) {
  const router = useRouter();
  const { job } = item;

  // 공고 상세 경로 계산 / Compute job detail route
  const jobHref =
    job.boardType === 'PART_TIME'
      ? `/worker/alba/${job.id}`
      : `/worker/regular/${job.id}`;

  // 마감 여부 / Whether job is closed/expired
  const isClosed = job.status === 'CLOSED' || job.status === 'EXPIRED';

  // D-Day 문자열 / D-Day string
  const dday = getDDay(job.closingDate);
  const isDday = dday === 'D-Day';
  const isMagam = dday === '마감';

  // D-Day 배지 색상 / D-Day badge color
  let ddayColor = 'bg-blue-50 text-blue-600';
  if (isMagam) ddayColor = 'bg-gray-100 text-gray-400';
  else if (isDday) ddayColor = 'bg-red-50 text-red-600';
  else if (dday.startsWith('D-')) {
    const num = parseInt(dday.slice(2), 10);
    if (num <= 3) ddayColor = 'bg-orange-50 text-orange-600';
  } else if (dday === '상시채용') ddayColor = 'bg-green-50 text-green-600';

  // 알바 급여 정보 / Part-time wage info
  const albaInfo = job.albaAttributes
    ? [
        `시급 ${job.albaAttributes.hourlyWage.toLocaleString()}원`,
        formatWorkDays(job.albaAttributes.workDaysMask),
        job.albaAttributes.workTimeStart && job.albaAttributes.workTimeEnd
          ? `${job.albaAttributes.workTimeStart}~${job.albaAttributes.workTimeEnd}`
          : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : null;

  // 정규직 급여 정보 / Full-time salary info
  const fulltimeInfo = job.fulltimeAttributes
    ? [
        job.fulltimeAttributes.salaryMin !== null || job.fulltimeAttributes.salaryMax !== null
          ? `연봉 ${formatSalary(job.fulltimeAttributes.salaryMin)}${
              job.fulltimeAttributes.salaryMax
                ? `~${formatSalary(job.fulltimeAttributes.salaryMax)}`
                : '~'
            }`
          : '연봉 협의',
        job.fulltimeAttributes.experienceLevel
          ? `경력 ${job.fulltimeAttributes.experienceLevel}`
          : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : null;

  return (
    <div
      className={`bg-white rounded-2xl border transition ${
        isClosed
          ? 'border-gray-100 opacity-60'
          : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* 회사 로고 / Company logo */}
          <button
            type="button"
            onClick={() => router.push(jobHref)}
            className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden hover:opacity-80 transition"
            aria-label={`${job.company?.companyName ?? '회사'} 공고 보기`}
          >
            {job.company?.logoImageUrl ? (
              <Image
                src={job.company.logoImageUrl}
                alt={job.company.companyName}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <Building2 className="w-6 h-6 text-gray-300" />
            )}
          </button>

          {/* 공고 정보 / Job info */}
          <div className="flex-1 min-w-0">
            {/* 헤더: 회사명 + 배지 / Header: company name + badges */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-gray-600 truncate">
                {job.company?.brandName ?? job.company?.companyName ?? '회사명 없음'}
              </p>
              {/* 배지들 / Badges */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* 마감 D-Day / D-Day badge */}
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ddayColor}`}
                >
                  {dday}
                </span>
                {/* 프리미엄 배지 / Premium badge */}
                {job.tierType === 'PREMIUM' && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                    PREMIUM
                  </span>
                )}
                {/* 마감된 공고 배지 / Closed job badge */}
                {isClosed && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                    마감된 공고
                  </span>
                )}
              </div>
            </div>

            {/* 공고 제목 (클릭 시 공고 상세 이동) / Job title link */}
            <Link
              href={jobHref}
              className="text-base font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2 block mb-2"
            >
              {job.title}
            </Link>

            {/* 주소 / Address */}
            {job.displayAddress && (
              <p className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
                <MapPin className="w-3 h-3 shrink-0" />
                {job.displayAddress}
              </p>
            )}

            {/* 알바 급여 정보 / Part-time wage */}
            {albaInfo && (
              <p className="text-xs text-gray-500">
                <span className="font-medium text-blue-600">알바</span>&nbsp;{albaInfo}
              </p>
            )}

            {/* 정규직 급여 정보 / Full-time salary */}
            {fulltimeInfo && (
              <p className="text-xs text-gray-500">
                <span className="font-medium text-indigo-600">정규직</span>&nbsp;{fulltimeInfo}
              </p>
            )}
          </div>
        </div>

        {/* 하단: 스크랩일 + 삭제 버튼 / Footer: scrap date + delete button */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            스크랩: {formatDate(item.createdAt)}
          </span>

          {/* 스크랩 삭제 버튼 / Remove scrap button */}
          <button
            type="button"
            onClick={() => onRemove(item.jobId)}
            disabled={removing}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            aria-label="스크랩 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 필터 탭 정의 / Filter tab definitions ─────────────────────────────────────
const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PART_TIME', label: '알바' },
  { key: 'FULL_TIME', label: '정규직' },
];

const PAGE_LIMIT = 20;

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function WorkerScrapsPage() {
  // 전체 스크랩 목록 (서버에서 받은 원본) / All scraps fetched from server
  const [allScraps, setAllScraps] = useState<ScrapItem[]>([]);
  // 서버 총 개수 / Total count from server
  const [total, setTotal] = useState(0);
  // 현재 페이지 / Current page
  const [page, setPage] = useState(1);
  // 로딩 상태 / Loading state
  const [loading, setLoading] = useState(true);
  // 에러 메시지 / Error message
  const [error, setError] = useState<string | null>(null);
  // 활성 필터 탭 / Active filter tab
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  // 현재 삭제 중인 jobId / jobId currently being removed
  const [removingJobId, setRemovingJobId] = useState<string | null>(null);
  // 삭제 취소용 백업 / Backup for optimistic delete rollback
  const [removedBackup, setRemovedBackup] = useState<ScrapItem | null>(null);
  // 로그인 여부 / Whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 스크랩 목록 로드 / Load scrap list
  const loadScraps = useCallback(async (targetPage: number) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      // 세션 없음 → 미로그인 / No session → not logged in
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/scraps/my?page=${targetPage}&limit=${PAGE_LIMIT}`,
        { headers: { Authorization: `Bearer ${sessionId}` } }
      );

      if (!res.ok) {
        if (res.status === 401) {
          // 인증 실패 / Auth failure
          setIsLoggedIn(false);
        } else {
          const body = await res.json().catch(() => ({})) as { message?: string };
          setError(body.message ?? '스크랩 목록을 불러오는 데 실패했습니다.');
        }
        return;
      }

      const data = await res.json() as ScrapListResponse | ScrapItem[];

      if (Array.isArray(data)) {
        // 배열 응답 처리 / Handle plain array response
        setAllScraps(data);
        setTotal(data.length);
      } else {
        // 페이지네이션 응답 처리 / Handle paginated response
        setAllScraps(data.items ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {
      // 네트워크 오류 / Network error
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 마운트 시 로드 / Load on mount
  useEffect(() => {
    loadScraps(page);
  }, [page, loadScraps]);

  // 스크랩 삭제 핸들러 (Optimistic UI) / Remove scrap with optimistic update
  const handleRemove = async (jobId: string) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    // 삭제할 항목 찾기 / Find item to remove
    const target = allScraps.find((s) => s.jobId === jobId);
    if (!target) return;

    // 낙관적 즉시 제거 / Optimistic immediate removal
    setRemovedBackup(target);
    setAllScraps((prev) => prev.filter((s) => s.jobId !== jobId));
    setTotal((prev) => Math.max(0, prev - 1));
    setRemovingJobId(jobId);

    try {
      // POST /api/scraps/:jobId → 토글 (스크랩 해제) / Toggle = remove
      const res = await fetch(`/api/scraps/${jobId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionId}` },
      });

      if (!res.ok) {
        // API 실패 → 항목 복원 / API failed → restore item
        setAllScraps((prev) => {
          const restored = [...prev];
          // 원래 위치에 삽입 (정렬 유지) / Insert back (maintain order by createdAt)
          restored.push(target);
          return restored.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setTotal((prev) => prev + 1);
        setError('스크랩 삭제에 실패했습니다. 다시 시도해주세요.');
      } else {
        setRemovedBackup(null);
      }
    } catch {
      // 네트워크 오류 → 복원 / Network error → restore
      if (removedBackup) {
        setAllScraps((prev) => {
          const restored = [...prev, target];
          return restored.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setTotal((prev) => prev + 1);
      }
      setError('네트워크 오류로 삭제에 실패했습니다.');
    } finally {
      setRemovingJobId(null);
    }
  };

  // 탭 변경 시 페이지 초기화 / Reset page when tab changes
  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
  };

  // 클라이언트 사이드 탭 필터링 / Client-side tab filtering
  const filteredScraps =
    activeTab === 'ALL'
      ? allScraps
      : allScraps.filter((s) => s.job.boardType === activeTab);

  // 탭별 카운트 / Count per tab
  const tabCounts: Record<FilterTab, number> = {
    ALL: allScraps.length,
    PART_TIME: allScraps.filter((s) => s.job.boardType === 'PART_TIME').length,
    FULL_TIME: allScraps.filter((s) => s.job.boardType === 'FULL_TIME').length,
  };

  // 총 페이지 수 / Total pages
  const totalPages = Math.ceil(total / PAGE_LIMIT);

  // ── 렌더링 / Render ──────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">스크랩한 공고</h1>
          <p className="text-sm text-gray-500 mt-0.5">Saved Jobs</p>
        </div>
        {/* 총 개수 / Total count */}
        {!loading && isLoggedIn && (
          <span className="text-sm text-gray-400">
            총 {total}개 / Total
          </span>
        )}
      </div>

      {/* 로딩 스켈레톤 / Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* 미로그인 / Not logged in */}
      {!loading && !isLoggedIn && <NotLoggedIn />}

      {/* 에러 / Error */}
      {!loading && isLoggedIn && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 text-sm text-red-700 mb-4 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => loadScraps(page)}
            className="text-xs font-semibold text-red-600 underline whitespace-nowrap"
          >
            재시도
          </button>
        </div>
      )}

      {/* 데이터 로드 완료 / Data loaded */}
      {!loading && isLoggedIn && !error && (
        <>
          {/* 필터 탭 / Filter tabs */}
          <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
            {FILTER_TABS.map((tab) => {
              const count = tabCounts[tab.key];
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {tab.label}
                  {/* 탭 카운트 뱃지 / Tab count badge */}
                  {count > 0 && (
                    <span
                      className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 공고 카드 목록 또는 빈 상태 / Job card list or empty state */}
          {filteredScraps.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <>
              <div className="space-y-4">
                {filteredScraps.map((item) => (
                  <ScrapCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                    removing={removingJobId === item.jobId}
                  />
                ))}
              </div>

              {/* 페이지네이션 / Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />

              {/* 전체 공고 탐색 링크 / Browse all jobs link */}
              <div className="mt-6 text-center">
                <Link
                  href="/worker/jobs"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition"
                >
                  <Search className="w-4 h-4" />
                  더 많은 공고 탐색하기 / Browse more jobs
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
