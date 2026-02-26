'use client';

/**
 * 지원 현황 / My Applications
 * Displays the worker's job application history with status filtering,
 * summary counts, and pagination via real API connection.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Calendar,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ApplicationJob {
  id: string;
  title: string;
  boardType: string;
  tierType: string;
  status: string;
  displayAddress: string;
  allowedVisas: string[];
  companyName: string;
  logoImageUrl?: string;
}

interface Application {
  id: string;
  status: string;
  applicationMethod: string;
  coverLetter?: string;
  selfReportedAt?: string;
  interviewDate?: string;
  interviewNote?: string;
  rejectionReason?: string;
  resultNotifiedAt?: string;
  createdAt: string;
  job: ApplicationJob;
}

interface ApplicationsResponse {
  items: Application[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: '검토 중', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  INTERVIEW_REQUESTED: { label: '면접 제안', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  COORDINATION_NEEDED: { label: '일정 조율', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  CONFIRMED: { label: '면접 확정', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  ACCEPTED: { label: '합격', color: 'bg-green-100 text-green-700 border-green-200' },
  REJECTED: { label: '불합격', color: 'bg-red-100 text-red-700 border-red-200' },
  CANCELLED: { label: '취소됨', color: 'bg-gray-100 text-gray-600 border-gray-200' },
};

type TabKey = 'ALL' | 'PENDING' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'PENDING', label: '검토중' },
  { key: 'INTERVIEW', label: '면접' },
  { key: 'ACCEPTED', label: '합격' },
  { key: 'REJECTED', label: '불합격' },
];

/** Map tab key to backend status query param(s) */
function getStatusParamForTab(tab: TabKey): string | undefined {
  switch (tab) {
    case 'ALL':
      return undefined;
    case 'PENDING':
      return 'PENDING';
    case 'INTERVIEW':
      return 'INTERVIEW_REQUESTED,COORDINATION_NEEDED,CONFIRMED';
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'REJECTED':
      return 'REJECTED';
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function getCompanyInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function WorkerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');
  const [loading, setLoading] = useState(true);

  // Summary counts (fetched from unfiltered full list or computed)
  const [pendingCount, setPendingCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);

  /* ----- Fetch summary counts (all statuses, once + on tab change reset) ----- */
  const fetchSummaryCounts = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/applications/my?limit=1000', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data: ApplicationsResponse = await res.json();
      const items = data.items || [];
      setPendingCount(items.filter((a) => a.status === 'PENDING').length);
      setInterviewCount(
        items.filter(
          (a) =>
            a.status === 'INTERVIEW_REQUESTED' ||
            a.status === 'COORDINATION_NEEDED' ||
            a.status === 'CONFIRMED',
        ).length,
      );
      setAcceptedCount(items.filter((a) => a.status === 'ACCEPTED').length);
    } catch {
      // silent — summary is supplementary
    }
  }, []);

  /* ----- Fetch paginated applications for the active tab ----- */
  const fetchApplications = useCallback(
    async (token: string, tab: TabKey, pageNum: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const statusParam = getStatusParamForTab(tab);
        if (statusParam) params.set('status', statusParam);
        params.set('page', String(pageNum));
        params.set('limit', String(ITEMS_PER_PAGE));

        const res = await fetch(`/api/applications/my?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${res.status}`);
        }

        const data: ApplicationsResponse = await res.json();
        setApplications(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('[Applications] fetch error:', err);
        toast.error('지원 현황을 불러오지 못했습니다 / Failed to load applications');
        setApplications([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /* ----- Effects ----- */
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchSummaryCounts(token);
  }, [fetchSummaryCounts]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchApplications(token, activeTab, page);
  }, [activeTab, page, fetchApplications]);

  /* ----- Tab change handler ----- */
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">지원 현황</h1>
          <p className="text-sm text-gray-500 mt-0.5">My Applications</p>
        </div>
        <span className="text-sm text-gray-400">
          총 {total}건 / Total
        </span>
      </div>

      {/* ---------- Summary Bar ---------- */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: '검토 중', sublabel: 'Pending', count: pendingCount, color: 'border-yellow-200 bg-yellow-50' },
          { label: '면접 예정', sublabel: 'Interview', count: interviewCount, color: 'border-purple-200 bg-purple-50' },
          { label: '합격', sublabel: 'Accepted', count: acceptedCount, color: 'border-green-200 bg-green-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border ${s.color} p-4 text-center`}>
            <p className="text-2xl font-bold text-gray-800">{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {s.label} <span className="text-gray-400">/ {s.sublabel}</span>
            </p>
          </div>
        ))}
      </div>

      {/* ---------- Tab Filters ---------- */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---------- Loading ---------- */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* ---------- Empty State ---------- */}
      {!loading && applications.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            지원 이력이 없습니다
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            공고에 지원하면 여기서 현황을 확인할 수 있습니다.
            <br />
            No applications yet. Browse jobs to get started.
          </p>
          <Link
            href="/worker/jobs"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
          >
            <Search className="w-4 h-4" />
            공고 탐색하기 / Browse Jobs
          </Link>
        </div>
      )}

      {/* ---------- Application Cards ---------- */}
      {!loading && applications.length > 0 && (
        <div className="space-y-4">
          {applications.map((app) => {
            const statusCfg = STATUS_CONFIG[app.status] || {
              label: app.status,
              color: 'bg-gray-100 text-gray-600 border-gray-200',
            };

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
              >
                {/* Top row: company info + status badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Logo or initial */}
                    {app.job.logoImageUrl ? (
                      <img
                        src={app.job.logoImageUrl}
                        alt={app.job.companyName}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-gray-500">
                          {getCompanyInitial(app.job.companyName)}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {app.job.companyName}
                      </p>
                      <Link
                        href={`/worker/jobs/${app.job.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {app.job.title}
                      </Link>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusCfg.color}`}
                  >
                    {statusCfg.label}
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    지원일 {formatDate(app.createdAt)}
                  </span>
                  {app.job.displayAddress && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {app.job.displayAddress}
                    </span>
                  )}
                </div>

                {/* Status-specific info */}
                {(app.status === 'INTERVIEW_REQUESTED' || app.status === 'CONFIRMED') && (
                  <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-700 font-medium">
                        {app.status === 'CONFIRMED' ? '면접이 확정되었습니다' : '면접 제안이 도착했습니다'}
                      </span>
                      <Link
                        href="/worker/interviews"
                        className="text-purple-600 hover:text-purple-800 font-medium text-xs underline underline-offset-2"
                      >
                        면접 일정 보기
                      </Link>
                    </div>
                    {app.interviewDate && (
                      <p className="text-xs text-purple-500 mt-1">
                        면접일: {formatDate(app.interviewDate)}
                      </p>
                    )}
                  </div>
                )}

                {app.status === 'COORDINATION_NEEDED' && (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-700 font-medium">
                        면접 일정 조율이 필요합니다
                      </span>
                      <Link
                        href="/worker/interviews"
                        className="text-orange-600 hover:text-orange-800 font-medium text-xs underline underline-offset-2"
                      >
                        일정 조율하기
                      </Link>
                    </div>
                  </div>
                )}

                {app.status === 'ACCEPTED' && app.resultNotifiedAt && (
                  <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm">
                    <span className="text-green-700 font-medium">
                      축하합니다! 합격하셨습니다.
                    </span>
                    <p className="text-xs text-green-500 mt-1">
                      통보일: {formatDate(app.resultNotifiedAt)}
                    </p>
                  </div>
                )}

                {app.status === 'REJECTED' && (
                  <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                    <span className="text-red-700 font-medium">불합격 안내</span>
                    {app.rejectionReason && (
                      <p className="text-xs text-red-500 mt-1">{app.rejectionReason}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- Pagination ---------- */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            이전
          </Button>
          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            다음
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
