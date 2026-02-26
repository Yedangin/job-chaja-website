'use client';

/**
 * 면접 일정 / Interview Schedule
 * Worker interview dashboard — view proposals, confirmed interviews, and results.
 * View-only: all status changes are handled by the company side.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, MapPin, Video, Loader2, Copy,
  CheckCircle2, XCircle, Ban, ExternalLink, ClipboardList,
  Building2, ChevronRight, AlertTriangle, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/* ─── Types ────────────────────────────────────────────────────────── */

type ApplicationStatus =
  | 'PENDING'
  | 'INTERVIEW_REQUESTED'
  | 'COORDINATION_NEEDED'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'ACCEPTED';

interface InterviewNote {
  method: 'ONLINE' | 'OFFLINE';
  slot1: string;
  slot2: string;
  meetingLink?: string;
  address?: string;
  directions?: string;
  whatToBring?: string;
  selectedSlot?: 'slot1' | 'slot2' | null;
  cancelledBy?: 'EMPLOYER' | 'APPLICANT' | null;
  cancelReason?: string | null;
  resultMessage?: string;
}

interface JobSummary {
  id: number;
  title: string;
  boardType?: string;
  tierType?: string;
  status?: string;
  displayAddress?: string;
  allowedVisas?: string[];
  companyName?: string;
  logoImageUrl?: string;
}

interface Application {
  id: number;
  status: ApplicationStatus;
  applicationMethod?: string;
  coverLetter?: string;
  selfReportedAt?: string;
  interviewDate?: string;
  interviewNote?: string;
  rejectionReason?: string;
  resultNotifiedAt?: string;
  createdAt: string;
  job: JobSummary;
}

type TabKey = 'ALL' | 'PROPOSALS' | 'CONFIRMED' | 'DONE';

/* ─── Constants ────────────────────────────────────────────────────── */

const INTERVIEW_STATUSES: ApplicationStatus[] = [
  'INTERVIEW_REQUESTED',
  'COORDINATION_NEEDED',
  'CONFIRMED',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
];

const TAB_CONFIG: { key: TabKey; label: string; sub: string }[] = [
  { key: 'ALL', label: '전체', sub: 'All' },
  { key: 'PROPOSALS', label: '제안', sub: 'Proposals' },
  { key: 'CONFIRMED', label: '확정', sub: 'Confirmed' },
  { key: 'DONE', label: '완료', sub: 'Done' },
];

/* ─── Helpers ──────────────────────────────────────────────────────── */

function parseInterviewNote(raw?: string): InterviewNote | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InterviewNote;
  } catch {
    return null;
  }
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = weekdays[d.getDay()];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${month}/${date} (${day}) ${hours}:${minutes}`;
  } catch {
    return iso;
  }
}

function formatDateTimeLong(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }) + ' ' + d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function filterByTab(apps: Application[], tab: TabKey): Application[] {
  switch (tab) {
    case 'PROPOSALS':
      return apps.filter((a) => a.status === 'INTERVIEW_REQUESTED' || a.status === 'COORDINATION_NEEDED');
    case 'CONFIRMED':
      return apps.filter((a) => a.status === 'CONFIRMED');
    case 'DONE':
      return apps.filter((a) => ['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(a.status));
    default:
      return apps;
  }
}

/* ─── Main Component ───────────────────────────────────────────────── */

export default function WorkerInterviewsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');

  /* ─── Data Fetching ────────────────────────────────────────────── */

  const fetchApplications = useCallback(async () => {
    try {
      setError(null);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('로그인이 필요합니다. / Login required.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/applications/my', {
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch applications (${res.status})`);
      }

      const data = await res.json();
      const items: Application[] = Array.isArray(data)
        ? data
        : data.items || data.data || [];

      // Filter to interview-related items that have interviewNote
      const interviewApps = items.filter(
        (app) =>
          INTERVIEW_STATUSES.includes(app.status) && app.interviewNote,
      );

      setApplications(interviewApps);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`데이터를 불러올 수 없습니다. / ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /* ─── Helpers ───────────────────────────────────────────────────── */

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('링크가 복사되었습니다. / Link copied.');
    } catch {
      toast.error('복사에 실패했습니다. / Copy failed.');
    }
  };

  /* ─── Derived Data ─────────────────────────────────────────────── */

  const proposalCount = applications.filter(
    (a) => a.status === 'INTERVIEW_REQUESTED' || a.status === 'COORDINATION_NEEDED',
  ).length;
  const confirmedCount = applications.filter(
    (a) => a.status === 'CONFIRMED',
  ).length;
  const doneCount = applications.filter((a) =>
    ['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(a.status),
  ).length;

  const filtered = filterByTab(applications, activeTab);

  /* ─── Loading State ────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">면접 일정</h1>
          <p className="text-sm text-gray-500 mt-0.5">Interview Schedule</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  /* ─── Error State ──────────────────────────────────────────────── */

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">면접 일정</h1>
          <p className="text-sm text-gray-500 mt-0.5">Interview Schedule</p>
        </div>
        <div className="bg-white rounded-2xl border border-red-200 p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true);
              fetchApplications();
            }}
          >
            다시 시도 / Retry
          </Button>
        </div>
      </div>
    );
  }

  /* ─── Main Render ──────────────────────────────────────────────── */

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">면접 일정</h1>
        <p className="text-sm text-gray-500 mt-0.5">Interview Schedule</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{proposalCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">제안 받은 / Proposals</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{confirmedCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">확정 / Confirmed</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{doneCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">완료 / Completed</p>
        </div>
      </div>

      {/* Tab Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TAB_CONFIG.map((tab) => {
          const count =
            tab.key === 'ALL'
              ? applications.length
              : tab.key === 'PROPOSALS'
                ? proposalCount
                : tab.key === 'CONFIRMED'
                  ? confirmedCount
                  : doneCount;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${
                activeTab === tab.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            예정된 면접이 없습니다
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            면접 일정이 확정되면 이 곳에서 확인할 수 있습니다.
            <br />
            No scheduled interviews. Your interview schedule will appear here.
          </p>
          <Link
            href="/worker/applications"
            className="inline-flex items-center gap-2 bg-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-purple-700 transition"
          >
            <ClipboardList className="w-4 h-4" />
            지원 현황 보기 / View Applications
          </Link>
        </div>
      ) : (
        /* Interview Cards */
        <div className="space-y-4">
          {filtered.map((app) => {
            const note = parseInterviewNote(app.interviewNote);
            return (
              <InterviewCard
                key={app.id}
                application={app}
                note={note}
                onCopyLink={handleCopyLink}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Interview Card Component ─────────────────────────────────────── */

interface InterviewCardProps {
  application: Application;
  note: InterviewNote | null;
  onCopyLink: (link: string) => void;
}

function InterviewCard({
  application,
  note,
  onCopyLink,
}: InterviewCardProps) {
  const { status, job } = application;

  /* ─── INTERVIEW_REQUESTED — Proposal Card (View Only) ─────────── */
  if (status === 'INTERVIEW_REQUESTED' && note) {
    return (
      <div className="bg-white rounded-2xl border-2 border-purple-300 shadow-sm overflow-hidden">
        {/* Header band */}
        <div className="bg-purple-50 px-5 py-3 flex items-center gap-3 border-b border-purple-200">
          <CompanyAvatar job={job} bgColor="bg-purple-100" iconColor="text-purple-500" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-purple-700 bg-purple-200 px-2 py-0.5 rounded-full">
                면접 제안 / Interview Proposal
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
              {job.companyName || 'Company'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Job title */}
          <div>
            <p className="text-base font-semibold text-gray-900">{job.title}</p>
            {job.displayAddress && (
              <p className="text-xs text-gray-400 mt-0.5">{job.displayAddress}</p>
            )}
          </div>

          {/* Method */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            {note.method === 'ONLINE' ? (
              <Video className="w-4 h-4 text-blue-500" />
            ) : (
              <MapPin className="w-4 h-4 text-orange-500" />
            )}
            <span className="font-medium">
              {note.method === 'ONLINE' ? '온라인 면접 / Online' : '오프라인 면접 / Offline'}
            </span>
            {note.method === 'ONLINE' && note.meetingLink && (
              <span className="text-xs text-gray-400 truncate max-w-[200px]">
                ({note.meetingLink})
              </span>
            )}
          </div>

          {/* Offline address */}
          {note.method === 'OFFLINE' && note.address && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-700">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                {note.address}
              </p>
              {note.directions && (
                <p className="text-xs text-gray-500 mt-1 ml-5">{note.directions}</p>
              )}
            </div>
          )}

          {/* Time slots */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className="w-6 h-6 rounded-full border-2 border-purple-400 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-purple-600">1</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">1차 일정 / Option 1</p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatDateTime(note.slot1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className="w-6 h-6 rounded-full border-2 border-purple-400 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-purple-600">2</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">2차 일정 / Option 2</p>
                <p className="text-sm font-semibold text-gray-800">
                  {formatDateTime(note.slot2)}
                </p>
              </div>
            </div>
          </div>

          {/* What to bring */}
          {note.whatToBring && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-700 mb-0.5">
                준비물 / What to bring
              </p>
              <p className="text-sm text-amber-900">{note.whatToBring}</p>
            </div>
          )}

          {/* Info banner — worker must contact company externally */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                기업에 직접 연락하여 면접 일정을 확정해 주세요.
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                Please contact the company directly to confirm your interview schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── COORDINATION_NEEDED — Awaiting Coordination ──────────────── */
  if (status === 'COORDINATION_NEEDED' && note) {
    return (
      <div className="bg-white rounded-2xl border border-amber-300 shadow-sm overflow-hidden">
        <div className="bg-amber-50 px-5 py-3 flex items-center gap-3 border-b border-amber-200">
          <CompanyAvatar job={job} bgColor="bg-amber-100" iconColor="text-amber-500" />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
              일정 조율 중 / Coordinating
            </span>
            <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
              {job.companyName || 'Company'} - {job.title}
            </p>
          </div>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600">
            면접 일정을 조율하고 있습니다. 곧 확정 안내를 받으실 수 있습니다.
            <br />
            <span className="text-gray-400">
              The interview schedule is being coordinated. You will be notified once confirmed.
            </span>
          </p>
        </div>
      </div>
    );
  }

  /* ─── CONFIRMED — Confirmed Interview Card ─────────────────────── */
  if (status === 'CONFIRMED' && note) {
    const selectedSlotTime = note.selectedSlot === 'slot2' ? note.slot2 : note.slot1;

    return (
      <div className="bg-white rounded-2xl border-2 border-blue-300 shadow-sm overflow-hidden">
        {/* Header band */}
        <div className="bg-blue-50 px-5 py-3 flex items-center gap-3 border-b border-blue-200">
          <CompanyAvatar job={job} bgColor="bg-blue-100" iconColor="text-blue-500" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">
                면접 확정 / Interview Confirmed
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
              {job.companyName || 'Company'} - {job.title}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Confirmed date/time */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">확정 일시 / Confirmed Date</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {formatDateTimeLong(selectedSlotTime)}
            </p>
          </div>

          {/* Method + details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              {note.method === 'ONLINE' ? (
                <Video className="w-4 h-4 text-blue-500" />
              ) : (
                <MapPin className="w-4 h-4 text-orange-500" />
              )}
              <span className="font-medium">
                {note.method === 'ONLINE' ? '온라인 면접 / Online' : '오프라인 면접 / Offline'}
              </span>
            </div>

            {/* Online: meeting link */}
            {note.method === 'ONLINE' && note.meetingLink && (
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-500 shrink-0" />
                <a
                  href={note.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate flex-1"
                >
                  {note.meetingLink}
                </a>
                <button
                  onClick={() => onCopyLink(note.meetingLink!)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition shrink-0"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={note.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition shrink-0"
                  title="Open link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Offline: address + directions */}
            {note.method === 'OFFLINE' && note.address && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-gray-700">
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                  {note.address}
                </p>
                {note.directions && (
                  <p className="text-xs text-gray-500 mt-1.5 ml-5">
                    <ChevronRight className="w-3 h-3 inline mr-0.5" />
                    {note.directions}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* What to bring */}
          {note.whatToBring && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-700 mb-0.5">
                준비물 / What to bring
              </p>
              <p className="text-sm text-amber-900">{note.whatToBring}</p>
            </div>
          )}

          {/* Info: contact company to cancel */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500">
              면접 일정 변경이나 취소가 필요한 경우 기업에 직접 연락해 주세요.
              <br />
              If you need to reschedule or cancel, please contact the company directly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── ACCEPTED — Result Card (Pass) ────────────────────────────── */
  if (status === 'ACCEPTED') {
    return (
      <div className="bg-white rounded-2xl border border-green-300 shadow-sm overflow-hidden">
        <div className="bg-green-50 px-5 py-3 flex items-center gap-3 border-b border-green-200">
          <CompanyAvatar job={job} bgColor="bg-green-100" iconColor="text-green-500" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-700 bg-green-200 px-2.5 py-0.5 rounded-full">
                합격 / Accepted
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
              {job.companyName || 'Company'} - {job.title}
            </p>
          </div>
        </div>
        <div className="px-5 py-4">
          {note?.resultMessage && (
            <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800 mb-3">
              <p className="text-xs font-medium text-green-600 mb-1">기업 메시지 / Message</p>
              <p>{note.resultMessage}</p>
            </div>
          )}
          {application.resultNotifiedAt && (
            <p className="text-xs text-gray-400">
              <Clock className="w-3 h-3 inline mr-1" />
              통보일: {new Date(application.resultNotifiedAt).toLocaleDateString('ko-KR')}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ─── REJECTED — Result Card (Fail) ────────────────────────────── */
  if (status === 'REJECTED') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 flex items-center gap-3 border-b border-gray-200">
          <CompanyAvatar job={job} bgColor="bg-gray-100" iconColor="text-gray-400" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2.5 py-0.5 rounded-full">
                불합격 / Rejected
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
              {job.companyName || 'Company'} - {job.title}
            </p>
          </div>
        </div>
        <div className="px-5 py-4">
          {(application.rejectionReason || note?.resultMessage) && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1">사유 / Reason</p>
              <p>{application.rejectionReason || note?.resultMessage}</p>
            </div>
          )}
          {application.resultNotifiedAt && (
            <p className="text-xs text-gray-400">
              <Clock className="w-3 h-3 inline mr-1" />
              통보일: {new Date(application.resultNotifiedAt).toLocaleDateString('ko-KR')}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ─── CANCELLED — Cancelled Card ───────────────────────────────── */
  if (status === 'CANCELLED') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 flex items-center gap-3 border-b border-gray-200">
          <CompanyAvatar job={job} bgColor="bg-gray-100" iconColor="text-gray-400" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2.5 py-0.5 rounded-full">
                취소됨 / Cancelled
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">
              {job.companyName || 'Company'} - {job.title}
            </p>
          </div>
        </div>
        <div className="px-5 py-4 space-y-2">
          {note?.cancelledBy && (
            <p className="text-xs text-gray-500">
              취소자 / Cancelled by:{' '}
              <span className="font-medium text-gray-700">
                {note.cancelledBy === 'EMPLOYER'
                  ? '기업 / Employer'
                  : '지원자 / Applicant'}
              </span>
            </p>
          )}
          {note?.cancelReason && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
              <p className="text-xs font-medium text-gray-500 mb-1">취소 사유 / Reason</p>
              <p>{note.cancelReason}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── Fallback ─────────────────────────────────────────────────── */
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-3">
        <CompanyAvatar job={job} bgColor="bg-gray-100" iconColor="text-gray-400" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {job.companyName || 'Company'} - {job.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">상태: {status}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Company Avatar Helper ────────────────────────────────────────── */

function CompanyAvatar({
  job,
  bgColor,
  iconColor,
}: {
  job: JobSummary;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <div
      className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center shrink-0 overflow-hidden`}
    >
      {job.logoImageUrl ? (
        <img
          src={job.logoImageUrl}
          alt={job.companyName || ''}
          className="w-full h-full object-cover"
        />
      ) : (
        <Building2 className={`w-5 h-5 ${iconColor}`} />
      )}
    </div>
  );
}
