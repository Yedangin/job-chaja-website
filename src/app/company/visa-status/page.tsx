'use client';

/**
 * 기업 외국인 직원 비자 현황 페이지 / Company foreign employee visa status page
 *
 * 전용 API 없이 기존 API 조합으로 구현:
 * - GET /api/jobs/my/list  → 기업 공고 목록
 * - GET /api/applications/job/:jobId?page=1&limit=100  → 공고별 지원자 (합격자 필터)
 *
 * No dedicated visa-status API; combines existing endpoints:
 * - GET /api/jobs/my/list  → company's job postings
 * - GET /api/applications/job/:jobId?page=1&limit=100  → applicants per job (filter ACCEPTED)
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  Clock,
  Users,
  Briefcase,
  Globe,
  RefreshCw,
  Loader2,
  ChevronRight,
  ExternalLink,
  UserCircle,
  Info,
  BarChart2,
  LogIn,
} from 'lucide-react';

// ── 타입 정의 / Type definitions ─────────────────────────────────────────────

/** 지원자 원본 응답 (백엔드) / Raw applicant from backend */
interface RawApplicant {
  id: number | string;
  fullName?: string;
  applicantName?: string;
  nationality?: string;
  visaType?: string;
  appliedAt?: string;
  createdAt?: string;
  status?: string;
}

/** 합격 직원 / Accepted employee */
interface AcceptedEmployee {
  id: number | string;
  fullName: string;
  visaType: string;
  nationality: string;
  jobTitle: string;
  jobId: number | string;
  acceptedAt: string;
}

/** 공고 원본 응답 (백엔드) / Raw job posting from backend */
interface RawJob {
  id: number | string;
  title: string;
  status?: string;
  boardType?: string;
  closingDate?: string;
  createdAt?: string;
}

/** 비자별 집계 / Visa type aggregate */
interface VisaCount {
  visaType: string;
  count: number;
}

// ── 상수 / Constants ──────────────────────────────────────────────────────────

/**
 * 주요 비자 타입 레이블 / Major visa type labels
 * 표시 우선순위 순 / In display priority order
 */
const VISA_LABELS: Record<string, { name: string; color: string; bg: string }> = {
  'E-9':  { name: '비전문취업',  color: 'text-orange-700', bg: 'bg-orange-100' },
  'E-7':  { name: '특정활동',    color: 'text-blue-700',   bg: 'bg-blue-100'   },
  'H-2':  { name: '방문취업',    color: 'text-purple-700', bg: 'bg-purple-100' },
  'F-2':  { name: '거주',        color: 'text-green-700',  bg: 'bg-green-100'  },
  'F-4':  { name: '재외동포',    color: 'text-teal-700',   bg: 'bg-teal-100'   },
  'F-5':  { name: '영주',        color: 'text-emerald-700',bg: 'bg-emerald-100'},
  'F-6':  { name: '결혼이민',    color: 'text-pink-700',   bg: 'bg-pink-100'   },
  'D-10': { name: '구직',        color: 'text-yellow-700', bg: 'bg-yellow-100' },
  'E-6':  { name: '예술흥행',    color: 'text-red-700',    bg: 'bg-red-100'    },
};

/** 비자 갱신 기간 기준일(일) / Visa renewal lead time thresholds (days) */
const EXPIRY_THRESHOLD_30 = 30;
const EXPIRY_THRESHOLD_60 = 60;

/** 외부 출입국 정보 링크 / External immigration info links */
const EXTERNAL_LINKS = [
  {
    label: '출입국·외국인청 전자민원',
    labelEn: 'HiKorea (Immigration e-service)',
    href: 'https://www.hikorea.go.kr',
  },
  {
    label: '고용허가제(EPS) 공식 사이트',
    labelEn: 'EPS Official Site',
    href: 'https://www.eps.go.kr',
  },
  {
    label: '외국인종합안내센터 (1345)',
    labelEn: 'Korea Immigration Contact Center',
    href: 'https://www.immigration.go.kr',
  },
];

// ── 유틸 함수 / Utility functions ─────────────────────────────────────────────

/**
 * 날짜 포맷 / Date format → "YYYY.MM.DD"
 */
function formatDate(iso: string | null | undefined): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/**
 * 비자 만료까지 남은 일수 계산 / Days until visa expiry
 * 실제 만료일 데이터가 없어 샘플로 acceptedAt + 1년 적용
 * No actual expiry date field available; simulates acceptedAt + 1 year
 */
function daysUntilExpiry(acceptedAt: string): number {
  const accepted = new Date(acceptedAt);
  const expiry = new Date(accepted);
  expiry.setFullYear(expiry.getFullYear() + 1);
  return Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ── 서브 컴포넌트 / Sub-components ───────────────────────────────────────────

/** 로딩 스켈레톤 / Loading skeleton */
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className ?? ''}`} />;
}

/** 미로그인 상태 / Not logged in state */
function NotLoggedIn() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <LogIn className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">로그인이 필요합니다</h3>
      <p className="text-sm text-gray-400 mb-6">
        기업 계정으로 로그인하여 직원 비자 현황을 확인하세요.
        <br />
        Log in with your company account to view employee visa status.
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

// ── 메인 페이지 / Main page ───────────────────────────────────────────────────

export default function CompanyVisaStatusPage() {
  // 합격 직원 목록 / Accepted employees list
  const [employees, setEmployees] = useState<AcceptedEmployee[]>([]);
  // 로딩 상태 / Loading state
  const [loading, setLoading] = useState(true);
  // 에러 메시지 / Error message
  const [error, setError] = useState<string | null>(null);
  // 로그인 여부 / Logged-in state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // 개별 공고 지원자 로딩 진행률 / Per-job loading progress text
  const [loadingMsg, setLoadingMsg] = useState('공고 목록 불러오는 중...');

  /**
   * 합격 직원 데이터 로드 / Load accepted employee data
   * 1. GET /api/jobs/my/list → 공고 목록 / job list
   * 2. 각 공고 GET /api/applications/job/:id → 지원자 / applicants per job
   * 3. status=ACCEPTED 필터 / filter by ACCEPTED status
   */
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    const authHeader = { Authorization: `Bearer ${sessionId}` };

    try {
      // Step 1: 기업 공고 목록 / Fetch company job postings
      setLoadingMsg('공고 목록 불러오는 중...');
      const jobsRes = await fetch('/api/jobs/my/list?page=1&limit=100', {
        headers: authHeader,
      });

      if (!jobsRes.ok) {
        if (jobsRes.status === 401) {
          setIsLoggedIn(false);
          return;
        }
        throw new Error('공고 목록을 불러오지 못했습니다.');
      }

      const jobsData = await jobsRes.json();
      const jobs: RawJob[] = Array.isArray(jobsData)
        ? jobsData
        : (jobsData.jobs ?? jobsData.data ?? []);

      if (jobs.length === 0) {
        setEmployees([]);
        return;
      }

      // Step 2: 각 공고의 합격 지원자 병렬 로드 / Parallel load accepted applicants per job
      setLoadingMsg(`공고 ${jobs.length}개 지원자 분석 중...`);

      const allEmployees: AcceptedEmployee[] = [];

      await Promise.all(
        jobs.map(async (job) => {
          try {
            const appRes = await fetch(
              `/api/applications/job/${job.id}?page=1&limit=100`,
              { headers: authHeader },
            );
            if (!appRes.ok) return;

            const appData = await appRes.json();
            const applicants: RawApplicant[] = Array.isArray(appData)
              ? appData
              : (appData.applications ?? appData.data ?? []);

            // ACCEPTED 상태만 필터 / Filter ACCEPTED only
            const accepted = applicants.filter(
              (a) => (a.status ?? '').toUpperCase() === 'ACCEPTED',
            );

            accepted.forEach((a) => {
              allEmployees.push({
                id: a.id,
                fullName: (a.fullName ?? a.applicantName ?? `지원자 #${a.id}`) as string,
                visaType: (a.visaType ?? '비자 미확인') as string,
                nationality: (a.nationality ?? '미상') as string,
                jobTitle: job.title,
                jobId: job.id,
                acceptedAt: (a.appliedAt ?? a.createdAt ?? new Date().toISOString()) as string,
              });
            });
          } catch {
            // 개별 공고 실패는 조용히 무시 / Silently skip individual job fetch failure
          }
        }),
      );

      setEmployees(allEmployees);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : '데이터를 불러오는 중 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // ── 집계 계산 / Aggregation calculations ─────────────────────────────────

  /** 30일 이내 만료 예정 직원 / Employees expiring within 30 days */
  const expiring30 = employees.filter(
    (e) => daysUntilExpiry(e.acceptedAt) <= EXPIRY_THRESHOLD_30,
  );

  /** 60일 이내 만료 예정 직원 / Employees expiring within 60 days */
  const expiring60 = employees.filter(
    (e) => daysUntilExpiry(e.acceptedAt) <= EXPIRY_THRESHOLD_60,
  );

  /** 비자 유형별 직원 수 집계 / Count employees per visa type */
  const visaCounts: VisaCount[] = (() => {
    const map: Record<string, number> = {};
    employees.forEach((e) => {
      const key = e.visaType || '미확인';
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([visaType, count]) => ({ visaType, count }))
      .sort((a, b) => b.count - a.count);
  })();

  /** 최대 직원 수 (막대 그래프 비율용) / Max count for bar width ratio */
  const maxVisaCount = visaCounts.length > 0 ? visaCounts[0].count : 1;

  // ── 렌더링 / Render ───────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">비자 현황</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Visa Status — 합격 처리된 외국인 직원의 비자 현황을 확인합니다
          </p>
        </div>
        {!loading && isLoggedIn && (
          <button
            type="button"
            onClick={loadEmployees}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="새로고침 / Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── 미로그인 / Not logged in ── */}
      {!loading && !isLoggedIn && <NotLoggedIn />}

      {/* ── 에러 / Error ── */}
      {!loading && isLoggedIn && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 text-sm text-red-700 mb-6 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── 로딩 스켈레톤 / Loading skeleton ── */}
      {loading && (
        <div className="space-y-6">
          {/* 섹션 1 스켈레톤 / Section 1 skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          {/* 섹션 2 스켈레톤 / Section 2 skeleton */}
          <Skeleton className="h-40" />
          {/* 섹션 3 스켈레톤 / Section 3 skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          {/* 로딩 메시지 / Loading message */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            {loadingMsg}
          </div>
        </div>
      )}

      {/* ── 데이터 영역 / Data area ── */}
      {!loading && isLoggedIn && !error && (
        <div className="space-y-6">

          {/* ════════════════════════════════════════════════════════════════
              섹션 1: 비자 만료 알림 카드 / Section 1: Visa expiry alert cards
              ──────────────────────────────────────────────────────────────
              합격일 기준 +1년을 만료 예상 시점으로 사용 (실제 만료일 미제공).
              Uses acceptedAt + 1 year as estimated expiry (no actual expiry field).
          ══════════════════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-gray-800">비자 갱신 주의 현황</h2>
              <span className="text-xs text-gray-400">/ Visa Renewal Alerts</span>
            </div>

            {/* 데이터 없는 경우 안내 / No data notice */}
            {employees.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center text-sm text-gray-400">
                합격 처리된 직원 데이터가 없습니다.
                <br />
                <span className="text-xs">No accepted employees found.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 30일 이내 만료 / Expiring within 30 days */}
                <div
                  className={`rounded-xl border p-5 flex items-center gap-4 ${
                    expiring30.length > 0
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      expiring30.length > 0 ? 'bg-red-100' : 'bg-gray-100'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-6 h-6 ${
                        expiring30.length > 0 ? 'text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">30일 이내 만료 예정</p>
                    <p
                      className={`text-3xl font-bold ${
                        expiring30.length > 0 ? 'text-red-600' : 'text-gray-300'
                      }`}
                    >
                      {expiring30.length}
                      <span className="text-base font-normal ml-1">명</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Within 30 days</p>
                  </div>
                </div>

                {/* 60일 이내 만료 / Expiring within 60 days */}
                <div
                  className={`rounded-xl border p-5 flex items-center gap-4 ${
                    expiring60.length > 0
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      expiring60.length > 0 ? 'bg-amber-100' : 'bg-gray-100'
                    }`}
                  >
                    <Clock
                      className={`w-6 h-6 ${
                        expiring60.length > 0 ? 'text-amber-500' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">60일 이내 만료 예정</p>
                    <p
                      className={`text-3xl font-bold ${
                        expiring60.length > 0 ? 'text-amber-600' : 'text-gray-300'
                      }`}
                    >
                      {expiring60.length}
                      <span className="text-base font-normal ml-1">명</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Within 60 days</p>
                  </div>
                </div>
              </div>
            )}

            {/* 만료 데이터 안내 문구 / Expiry data note */}
            <div className="mt-2 flex items-start gap-1.5 text-xs text-gray-400">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                만료 예상일은 합격 처리일 기준 +1년으로 추정됩니다. 실제 비자 만료일은
                직원 개인의 체류기간 연장 이력에 따라 다를 수 있습니다.
                <br />
                Expiry is estimated as acceptedAt + 1 year. Actual dates may vary.
              </span>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              섹션 2: 비자별 직원 현황 / Section 2: Employees by visa type
          ══════════════════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              <h2 className="text-base font-bold text-gray-800">비자 유형별 현황</h2>
              <span className="text-xs text-gray-400">/ Employees by Visa Type</span>
              <span className="ml-auto text-xs text-gray-400">
                총 {employees.length}명
              </span>
            </div>

            {employees.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center text-sm text-gray-400">
                비자 유형 데이터가 없습니다.
                <br />
                <span className="text-xs">No visa type data available.</span>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                {visaCounts.map(({ visaType, count }) => {
                  const meta = VISA_LABELS[visaType];
                  const barWidth = Math.round((count / maxVisaCount) * 100);

                  return (
                    <div key={visaType} className="flex items-center gap-3">
                      {/* 비자 코드 배지 / Visa code badge */}
                      <div
                        className={`w-16 shrink-0 text-center text-xs font-bold px-1.5 py-1 rounded-md ${
                          meta ? `${meta.color} ${meta.bg}` : 'text-gray-600 bg-gray-100'
                        }`}
                      >
                        {visaType}
                      </div>

                      {/* 비자 이름 / Visa name */}
                      <div className="w-20 shrink-0 text-xs text-gray-500">
                        {meta?.name ?? '기타'}
                      </div>

                      {/* 막대 그래프 / Bar */}
                      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            meta ? meta.bg : 'bg-gray-300'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>

                      {/* 인원수 / Count */}
                      <div className="w-10 shrink-0 text-right text-sm font-bold text-gray-800">
                        {count}
                        <span className="text-xs font-normal text-gray-400 ml-0.5">명</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════════════════════
              섹션 3: 최근 합격 직원 목록 / Section 3: Recently accepted employees
          ══════════════════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-green-500" />
              <h2 className="text-base font-bold text-gray-800">합격 직원 목록</h2>
              <span className="text-xs text-gray-400">/ Accepted Employees</span>
            </div>

            {employees.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  합격 처리된 지원자가 없습니다
                </p>
                <p className="text-xs text-gray-400 mb-5">
                  공고의 지원자를 '합격' 상태로 변경하면 여기에 표시됩니다.
                  <br />
                  Mark applicants as Accepted to track them here.
                </p>
                <Link
                  href="/company/applicants"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition"
                >
                  지원자 관리로 이동
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {/* 테이블 헤더 / Table header */}
                <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 rounded-t-xl text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <div className="col-span-3">이름 / Name</div>
                  <div className="col-span-2">비자 / Visa</div>
                  <div className="col-span-2">국적 / Nationality</div>
                  <div className="col-span-3">공고명 / Job</div>
                  <div className="col-span-2 text-right">합격일 / Date</div>
                </div>

                {/* 직원 행 / Employee rows */}
                {employees.slice(0, 50).map((emp) => {
                  const meta = VISA_LABELS[emp.visaType];
                  const days = daysUntilExpiry(emp.acceptedAt);
                  const isUrgent = days <= EXPIRY_THRESHOLD_30;
                  const isWarning = days > EXPIRY_THRESHOLD_30 && days <= EXPIRY_THRESHOLD_60;

                  return (
                    <div
                      key={emp.id}
                      className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-gray-50 transition text-sm"
                    >
                      {/* 이름 / Name */}
                      <div className="col-span-3 flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <UserCircle className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-medium text-gray-800 truncate">{emp.fullName}</span>
                        {/* 만료 경고 아이콘 / Expiry warning icon */}
                        {isUrgent && (
                          <span title="30일 이내 만료 예정">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          </span>
                        )}
                        {isWarning && !isUrgent && (
                          <span title="60일 이내 만료 예정">
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          </span>
                        )}
                      </div>

                      {/* 비자 코드 / Visa code */}
                      <div className="col-span-2">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            meta
                              ? `${meta.color} ${meta.bg}`
                              : 'text-gray-600 bg-gray-100'
                          }`}
                        >
                          {emp.visaType}
                        </span>
                      </div>

                      {/* 국적 / Nationality */}
                      <div className="col-span-2 flex items-center gap-1 text-gray-600 text-xs truncate">
                        <Globe className="w-3 h-3 shrink-0 text-gray-400" />
                        {emp.nationality}
                      </div>

                      {/* 공고명 (클릭 시 지원자 관리로 이동) / Job title */}
                      <div className="col-span-3 min-w-0">
                        <Link
                          href={`/company/jobs/${emp.jobId}/applicants`}
                          className="text-xs text-gray-600 hover:text-blue-600 truncate block transition"
                          title={emp.jobTitle}
                        >
                          <Briefcase className="w-3 h-3 inline mr-1 text-gray-400" />
                          {emp.jobTitle}
                        </Link>
                      </div>

                      {/* 합격일 / Accepted date */}
                      <div className="col-span-2 text-right text-xs text-gray-400">
                        {formatDate(emp.acceptedAt)}
                      </div>
                    </div>
                  );
                })}

                {/* 50명 초과 시 안내 / Truncation notice */}
                {employees.length > 50 && (
                  <div className="px-5 py-3 text-center text-xs text-gray-400">
                    상위 50명 표시 중 (전체 {employees.length}명) / Showing top 50 of {employees.length}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════════════════════════════
              섹션 4: 비자 갱신 지원 안내 / Section 4: Visa renewal support info
          ══════════════════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base font-bold text-gray-800">비자 갱신·변경 안내</h2>
              <span className="text-xs text-gray-400">/ Renewal &amp; Change Info</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {/* 기업의 역할 안내 / Company role info */}
              <div className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  기업의 비자 갱신 지원 의무
                  <span className="text-xs font-normal text-gray-400 ml-1">/ Employer Obligations</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-gray-800">E-9 비전문취업 :</strong> 고용주가 근로계약 갱신 및 체류기간 연장 신청 서류를
                      함께 준비해야 합니다. 갱신 기한은 만료 4개월 전부터 가능합니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-gray-800">E-7 특정활동 :</strong> 기업이 재직증명서, 납세증명서, 고용계약서를 제출해야
                      하며, 소속 기관 변경 시 변경 허가를 받아야 합니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-gray-800">H-2 방문취업 :</strong> 취업활동 기간 내 갱신으로, 별도 고용주 보증 없이
                      개인 신청이 가능합니다. 다만 고용주가 근로계약 지속 확인서를 발급해드리면 도움됩니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0" />
                    <span>
                      <strong className="text-gray-800">F-2 / F-4 / F-5 / F-6 :</strong> 자유 취업 비자로, 갱신은 개인이 직접 신청합니다.
                      기업 측 서류 불필요합니다.
                    </span>
                  </li>
                </ul>
              </div>

              {/* 외부 링크 / External links */}
              <div className="p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  관련 기관 바로가기
                  <span className="text-xs font-normal text-gray-400 ml-1">/ Official Links</span>
                </h3>
                <div className="space-y-2">
                  {EXTERNAL_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition group"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition">
                          {link.label}
                        </p>
                        <p className="text-xs text-gray-400">{link.labelEn}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* 비자 가이드 내부 링크 / Internal visa guide link */}
              <div className="p-5 bg-blue-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">비자별 상세 가이드 보기</p>
                      <p className="text-xs text-gray-500">
                        E-7, E-9, H-2 등 비자 유형별 채용 조건 및 필요 서류 안내
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/company/visa-guide"
                    className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-700 transition shrink-0 ml-4"
                  >
                    가이드 보기
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* end sections */}
        </div>
      )}
    </div>
  );
}
