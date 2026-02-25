'use client';

/**
 * 내 지원현황 페이지 / My Applications page
 * - 지원한 공고 목록 조회 (상태 필터, 취소 기능 포함)
 * - Lists user's job applications with status filtering and cancel support
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ClipboardList,
  Loader2,
  Building2,
  Calendar,
  LogIn,
  Briefcase,
} from 'lucide-react';

// 지원 상태 타입 / Application status type
type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'INTERVIEW_SCHEDULED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

// 공고 보드 타입 / Job board type
type BoardType = 'PART_TIME' | 'FULL_TIME';

// 공고 정보 / Job info
interface ApplicationJob {
  id: string;
  title: string;
  boardType: BoardType;
  closingDate: string | null;
  company: {
    companyName: string;
    logoImageUrl: string | null;
  };
}

// 지원 항목 / Single application entry
interface Application {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  job: ApplicationJob;
}

// 상태별 배지 설정 / Status badge config
const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; labelKo: string; color: string }
> = {
  PENDING: {
    label: 'Pending',
    labelKo: '검토 대기',
    color: 'bg-gray-100 text-gray-600',
  },
  REVIEWING: {
    label: 'Reviewing',
    labelKo: '검토 중',
    color: 'bg-blue-100 text-blue-700',
  },
  INTERVIEW_SCHEDULED: {
    label: 'Interview',
    labelKo: '면접 예정',
    color: 'bg-purple-100 text-purple-700',
  },
  ACCEPTED: {
    label: 'Accepted',
    labelKo: '합격',
    color: 'bg-green-100 text-green-700',
  },
  REJECTED: {
    label: 'Rejected',
    labelKo: '불합격',
    color: 'bg-red-100 text-red-700',
  },
  CANCELLED: {
    label: 'Cancelled',
    labelKo: '취소됨',
    color: 'bg-gray-100 text-gray-400',
  },
};

// 필터 탭 목록 / Filter tab definitions
const FILTER_TABS: { key: ApplicationStatus | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'REVIEWING', label: '검토중' },
  { key: 'INTERVIEW_SCHEDULED', label: '면접 예정' },
  { key: 'ACCEPTED', label: '합격' },
  { key: 'REJECTED', label: '불합격' },
  { key: 'CANCELLED', label: '취소됨' },
];

// 날짜 포맷 헬퍼 / Date format helper → "YYYY.MM.DD"
function formatDate(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

// 공고 유형 레이블 / Board type label
function boardTypeLabel(boardType: BoardType): string {
  return boardType === 'PART_TIME' ? '알바' : '정규직';
}

// ── 로딩 스켈레톤 카드 / Loading skeleton card ──────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        {/* 로고 자리 / Logo placeholder */}
        <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-36 bg-gray-200 rounded" />
            </div>
            {/* 배지 자리 / Badge placeholder */}
            <div className="h-6 w-16 bg-gray-200 rounded-full shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 상태 요약 바 / Status summary bar ────────────────────────────────────────
interface SummaryBarProps {
  applications: Application[];
}

function SummaryBar({ applications }: SummaryBarProps) {
  // 요약 항목 정의 / Summary item definitions
  const summaryItems = [
    {
      key: 'all',
      label: '전체',
      count: applications.length,
      color: 'border-gray-200 bg-gray-50',
      textColor: 'text-gray-800',
    },
    {
      key: 'REVIEWING',
      label: '검토중',
      count: applications.filter((a) => a.status === 'REVIEWING').length,
      color: 'border-blue-200 bg-blue-50',
      textColor: 'text-blue-800',
    },
    {
      key: 'INTERVIEW_SCHEDULED',
      label: '면접예정',
      count: applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length,
      color: 'border-purple-200 bg-purple-50',
      textColor: 'text-purple-800',
    },
    {
      key: 'ACCEPTED',
      label: '결과대기',
      count: applications.filter(
        (a) => a.status === 'PENDING' || a.status === 'ACCEPTED'
      ).length,
      color: 'border-green-200 bg-green-50',
      textColor: 'text-green-800',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {summaryItems.map((item) => (
        <div
          key={item.key}
          className={`rounded-xl border ${item.color} p-3 text-center`}
        >
          <p className={`text-2xl font-bold ${item.textColor}`}>{item.count}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

// ── 지원 카드 / Application card ──────────────────────────────────────────────
interface ApplicationCardProps {
  application: Application;
  onCancel: (id: string) => void;
  cancelling: boolean;
}

function ApplicationCard({ application, onCancel, cancelling }: ApplicationCardProps) {
  const { job, status, appliedAt } = application;
  const config = STATUS_CONFIG[status];
  const canCancel = status === 'PENDING' || status === 'REVIEWING';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition">
      <div className="flex items-start gap-4">
        {/* 회사 로고 / Company logo */}
        <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          {job.company.logoImageUrl ? (
            <Image
              src={job.company.logoImageUrl}
              alt={job.company.companyName}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <Building2 className="w-6 h-6 text-gray-300" />
          )}
        </div>

        {/* 공고 정보 / Job info */}
        <div className="flex-1 min-w-0">
          {/* 헤더: 회사명 + 상태 배지 / Header: company name + status badge */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-700 truncate">
              {job.company.companyName}
            </p>
            {/* 상태 배지 / Status badge */}
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${config.color}`}
            >
              {status === 'ACCEPTED' && '🎉 '}
              {config.labelKo}
            </span>
          </div>

          {/* 공고 제목 (클릭 시 공고 이동) / Job title link */}
          <Link
            href={`/worker/jobs/${job.id}`}
            className="text-base font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2 block mb-2"
          >
            {job.title}
          </Link>

          {/* 메타 정보 / Meta info */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
            {/* 알바/정규직 유형 / Board type */}
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {boardTypeLabel(job.boardType)}
            </span>
            {/* 지원일 / Applied date */}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              지원일: {formatDate(appliedAt)}
            </span>
            {/* 마감일 / Closing date */}
            {job.closingDate && (
              <span>
                마감: {formatDate(job.closingDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 취소 버튼 (PENDING / REVIEWING 상태만 표시) / Cancel button (PENDING/REVIEWING only) */}
      {canCancel && (
        <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => onCancel(application.id)}
            disabled={cancelling}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {cancelling ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : null}
            취소하기
          </button>
        </div>
      )}
    </div>
  );
}

// ── 빈 상태 / Empty state ──────────────────────────────────────────────────────
function EmptyState({ activeTab }: { activeTab: string }) {
  // 탭 필터 기준 메시지 / Message depends on active filter tab
  const isFiltered = activeTab !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <ClipboardList className="w-8 h-8 text-blue-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        {isFiltered
          ? '해당 상태의 지원 내역이 없습니다'
          : '아직 지원한 공고가 없습니다'}
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        {isFiltered
          ? '다른 필터를 선택하거나 전체 보기로 전환해보세요.'
          : '공고에 지원하면 여기서 현황을 한눈에 확인할 수 있습니다.'}
        <br />
        {isFiltered
          ? 'Try a different filter or switch to All.'
          : 'Apply to jobs to track your status here.'}
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

// ── 미로그인 상태 / Not logged in state ──────────────────────────────────────
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
        로그인하여 지원 현황을 확인하세요.
        <br />
        Log in to view your application status.
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

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function WorkerApplicationsPage() {
  // 지원 목록 / Application list
  const [applications, setApplications] = useState<Application[]>([]);
  // 로딩 상태 / Loading state
  const [loading, setLoading] = useState(true);
  // 에러 메시지 / Error message
  const [error, setError] = useState<string | null>(null);
  // 활성 필터 탭 / Active filter tab
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'all'>('all');
  // 현재 취소 중인 지원 ID / Currently cancelling application id
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  // 로그인 여부 / Whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 지원 목록 로드 / Load applications on mount
  useEffect(() => {
    const load = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        // 세션 없음 → 미로그인 상태로 전환 / No session → treat as not logged in
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/applications/my', {
          headers: { Authorization: `Bearer ${sessionId}` },
        });

        if (!res.ok) {
          // 인증 실패 등 오류 처리 / Handle auth failure or server error
          if (res.status === 401) {
            setIsLoggedIn(false);
          } else {
            const data = await res.json().catch(() => ({}));
            setError(
              (data as { message?: string }).message ||
                '지원 현황을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.'
            );
          }
          return;
        }

        const data = await res.json();
        // 응답 형태: { applications: [...] } 또는 배열 자체 / Response: { applications: [...] } or array
        const list: Application[] = Array.isArray(data)
          ? data
          : (data.applications ?? data.data ?? []);
        setApplications(list);
      } catch {
        // 네트워크 오류 / Network error
        setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 지원 취소 핸들러 / Cancel application handler
  const handleCancel = async (applicationId: string) => {
    if (
      !confirm(
        '지원을 취소하시겠습니까?\nCancel this application?'
      )
    )
      return;

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    setCancellingId(applicationId);
    try {
      // POST 먼저 시도, 백엔드가 DELETE 사용 시 DELETE 로 재시도 / Try POST first; fallback to DELETE
      const res = await fetch(`/api/applications/${applicationId}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionId}` },
      });

      if (res.ok) {
        // 로컬 상태 업데이트 (리로드 없이) / Update local state without reload
        setApplications((prev) =>
          prev.map((a) =>
            a.id === applicationId
              ? { ...a, status: 'CANCELLED' as const }
              : a
          )
        );
      } else if (res.status === 405) {
        // POST 미지원 → DELETE 재시도 / POST not allowed → retry with DELETE
        const delRes = await fetch(`/api/applications/${applicationId}/cancel`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${sessionId}` },
        });
        if (delRes.ok) {
          setApplications((prev) =>
            prev.map((a) =>
              a.id === applicationId
                ? { ...a, status: 'CANCELLED' as const }
                : a
            )
          );
        }
      }
    } finally {
      setCancellingId(null);
    }
  };

  // 탭 기준 필터링 / Filter by active tab
  const filteredApplications =
    activeTab === 'all'
      ? applications
      : applications.filter((a) => a.status === activeTab);

  // ── 렌더링 / Render ──────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">내 지원현황</h1>
          <p className="text-sm text-gray-500 mt-0.5">My Applications</p>
        </div>
        {!loading && isLoggedIn && (
          <span className="text-sm text-gray-400">
            총 {applications.length}건 / Total
          </span>
        )}
      </div>

      {/* 로딩 상태 / Loading state */}
      {loading && (
        <div className="space-y-4">
          {/* 요약 바 스켈레톤 / Summary bar skeleton */}
          <div className="grid grid-cols-4 gap-3 mb-6 animate-pulse">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl" />
            ))}
          </div>
          {/* 카드 스켈레톤 3개 / 3 skeleton cards */}
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* 미로그인 / Not logged in */}
      {!loading && !isLoggedIn && <NotLoggedIn />}

      {/* 에러 / Error */}
      {!loading && isLoggedIn && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {/* 데이터 로드 완료 + 로그인 상태 / Data loaded + logged in */}
      {!loading && isLoggedIn && !error && (
        <>
          {/* 상태 요약 바 / Status summary bar */}
          <SummaryBar applications={applications} />

          {/* 필터 탭 / Filter tabs */}
          <div className="flex gap-1 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_TABS.map((tab) => {
              // 탭별 카운트 / Count per tab
              const count =
                tab.key === 'all'
                  ? applications.length
                  : applications.filter((a) => a.status === tab.key).length;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {tab.label}
                  {/* 카운트 뱃지 / Count badge */}
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

          {/* 지원 카드 목록 / Application cards */}
          {filteredApplications.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onCancel={handleCancel}
                  cancelling={cancellingId === application.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
