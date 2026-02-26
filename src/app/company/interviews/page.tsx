'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Loader2, X, Send, Video, MapPin,
  Clock, RefreshCw, CheckCircle2, XCircle, Ban,
  Globe, Briefcase, ExternalLink, Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

type InterviewStatus =
  | 'INTERVIEW_REQUESTED'
  | 'COORDINATION_NEEDED'
  | 'CONFIRMED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

type InterviewMethod = 'ONLINE' | 'OFFLINE';

interface InterviewNote {
  method: InterviewMethod;
  slot1: string;
  slot2: string;
  meetingLink: string;
  address: string;
  directions: string;
  whatToBring: string;
  selectedSlot: null | 'slot1' | 'slot2';
  cancelledBy: null | 'EMPLOYER' | 'APPLICANT';
  cancelReason: null | string;
  resultMessage: string;
}

interface Applicant {
  realName: string;
  nationality?: string;
  visaType?: string;
  visaExpiryDate?: string;
  profileImageUrl?: string;
}

interface ApplicationItem {
  id: number;
  applicantId: number;
  status: string;
  applicationMethod?: string;
  coverLetter?: string;
  resumeSnapshot?: string;
  selfReportedAt?: string;
  interviewDate?: string;
  interviewNote?: string;
  rejectionReason?: string;
  createdAt: string;
  applicant: Applicant;
}

interface InterviewEntry extends ApplicationItem {
  jobTitle: string;
  jobId: number;
  parsedNote: InterviewNote | null;
}

interface JobItem {
  id: number;
  title: string;
}

/* ────────────────────────────────────────────
   Tab / Status configuration
   ──────────────────────────────────────────── */

type TabKey = 'ALL' | 'PROPOSED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

const TAB_CONFIG: Record<TabKey, { label: string; sub: string; statuses: InterviewStatus[] }> = {
  ALL: {
    label: '전체',
    sub: 'All',
    statuses: ['INTERVIEW_REQUESTED', 'COORDINATION_NEEDED', 'CONFIRMED', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
  },
  PROPOSED: {
    label: '제안중',
    sub: 'Proposed',
    statuses: ['INTERVIEW_REQUESTED', 'COORDINATION_NEEDED'],
  },
  CONFIRMED: {
    label: '확정',
    sub: 'Confirmed',
    statuses: ['CONFIRMED'],
  },
  COMPLETED: {
    label: '완료',
    sub: 'Completed',
    statuses: ['ACCEPTED', 'REJECTED'],
  },
  CANCELLED: {
    label: '취소',
    sub: 'Cancelled',
    statuses: ['CANCELLED'],
  },
};

const TABS: TabKey[] = ['ALL', 'PROPOSED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const STATUS_BADGE: Record<InterviewStatus, { label: string; className: string }> = {
  INTERVIEW_REQUESTED: { label: '대기 중', className: 'bg-amber-100 text-amber-700' },
  COORDINATION_NEEDED: { label: '조율 필요', className: 'bg-orange-100 text-orange-700' },
  CONFIRMED: { label: '면접 확정', className: 'bg-blue-100 text-blue-700' },
  ACCEPTED: { label: '합격', className: 'bg-green-100 text-green-700' },
  REJECTED: { label: '불합격', className: 'bg-red-100 text-red-700' },
  CANCELLED: { label: '취소됨', className: 'bg-gray-100 text-gray-500' },
};

const CANCEL_REASONS = [
  { value: '일정 변경', label: '일정 변경 / Schedule conflict' },
  { value: '개인 사유', label: '개인 사유 / Personal reasons' },
  { value: '채용 마감', label: '채용 마감 / Position closed' },
  { value: '기타', label: '기타 / Other' },
];

const INTERVIEW_STATUSES: InterviewStatus[] = [
  'INTERVIEW_REQUESTED', 'COORDINATION_NEEDED', 'CONFIRMED',
  'ACCEPTED', 'REJECTED', 'CANCELLED',
];

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

function parseInterviewNote(raw?: string): InterviewNote | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InterviewNote;
  } catch {
    return null;
  }
}

function formatDateTime(iso?: string): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function toLocalDatetimeValue(iso?: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

/* ────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */

export default function CompanyInterviewsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');
  const [interviews, setInterviews] = useState<InterviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [proposalModal, setProposalModal] = useState<InterviewEntry | null>(null);
  const [resultModal, setResultModal] = useState<InterviewEntry | null>(null);
  const [cancelModal, setCancelModal] = useState<InterviewEntry | null>(null);

  // Proposal form state
  const [proposalMethod, setProposalMethod] = useState<InterviewMethod>('ONLINE');
  const [proposalSlot1, setProposalSlot1] = useState('');
  const [proposalSlot2, setProposalSlot2] = useState('');
  const [proposalMeetingLink, setProposalMeetingLink] = useState('');
  const [proposalAddress, setProposalAddress] = useState('');
  const [proposalDirections, setProposalDirections] = useState('');
  const [proposalWhatToBring, setProposalWhatToBring] = useState('');
  const [proposalSubmitting, setProposalSubmitting] = useState(false);

  // Result form state
  const [resultType, setResultType] = useState<'pass' | 'fail'>('pass');
  const [resultMessage, setResultMessage] = useState('');
  const [resultSubmitting, setResultSubmitting] = useState(false);

  // Confirm form state
  const [confirmModal, setConfirmModal] = useState<InterviewEntry | null>(null);
  const [confirmSlot, setConfirmSlot] = useState<'slot1' | 'slot2'>('slot1');
  const [confirmSubmitting, setConfirmSubmitting] = useState(false);

  // Cancel form state
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  /* ── Data fetching ── */

  const fetchInterviews = useCallback(async (showRefresh = false) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    if (showRefresh) setRefreshing(true);

    try {
      // 1. Fetch company's job postings
      const jobsRes = await fetch('/api/jobs/my/list', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (!jobsRes.ok) throw new Error('Failed to fetch jobs');

      const jobsData = await jobsRes.json();
      const jobs: JobItem[] = Array.isArray(jobsData)
        ? jobsData
        : (jobsData.items || jobsData.data || []);

      if (jobs.length === 0) {
        setInterviews([]);
        return;
      }

      // 2. For each job, fetch applicants
      const allEntries: InterviewEntry[] = [];

      const applicationPromises = jobs.map(async (job) => {
        try {
          const appRes = await fetch(`/api/applications/job/${job.id}`, {
            credentials: 'include',
            headers: { 'Authorization': `Bearer ${accessToken}` },
          });
          if (!appRes.ok) return [];

          const appData = await appRes.json();
          const items: ApplicationItem[] = Array.isArray(appData)
            ? appData
            : (appData.items || appData.data || appData.applications || []);

          return items
            .filter((item) => INTERVIEW_STATUSES.includes(item.status as InterviewStatus))
            .map((item): InterviewEntry => ({
              ...item,
              jobTitle: job.title,
              jobId: job.id,
              parsedNote: parseInterviewNote(item.interviewNote),
            }));
        } catch {
          return [];
        }
      });

      const results = await Promise.all(applicationPromises);
      results.forEach((entries) => allEntries.push(...entries));

      // Sort: most recent first (by interviewDate or createdAt)
      allEntries.sort((a, b) => {
        const dateA = a.interviewDate || a.createdAt;
        const dateB = b.interviewDate || b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

      setInterviews(allEntries);
    } catch {
      toast.error('데이터를 불러올 수 없습니다. / Failed to load data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  /* ── Filtered list ── */

  const filtered = interviews.filter((entry) =>
    TAB_CONFIG[activeTab].statuses.includes(entry.status as InterviewStatus)
  );

  const countByTab = (tab: TabKey) =>
    interviews.filter((e) => TAB_CONFIG[tab].statuses.includes(e.status as InterviewStatus)).length;

  /* ── API actions ── */

  const updateApplicationStatus = async (
    id: number,
    body: Record<string, unknown>,
  ): Promise<boolean> => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('로그인이 필요합니다.');
      return false;
    }

    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { message?: string }).message || 'Request failed');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '요청 실패';
      toast.error(message);
      return false;
    }
  };

  /* ── Proposal submit ── */

  const openProposalModal = (entry: InterviewEntry) => {
    const note = entry.parsedNote;
    setProposalMethod(note?.method || 'ONLINE');
    setProposalSlot1(toLocalDatetimeValue(note?.slot1));
    setProposalSlot2(toLocalDatetimeValue(note?.slot2));
    setProposalMeetingLink(note?.meetingLink || '');
    setProposalAddress(note?.address || '');
    setProposalDirections(note?.directions || '');
    setProposalWhatToBring(note?.whatToBring || '');
    setProposalModal(entry);
  };

  const submitProposal = async () => {
    if (!proposalModal) return;

    // Validation
    if (!proposalSlot1) {
      toast.error('1순위 일시를 선택해주세요.');
      return;
    }
    if (!proposalSlot2) {
      toast.error('2순위 일시를 선택해주세요.');
      return;
    }
    if (proposalMethod === 'ONLINE' && !proposalMeetingLink.trim()) {
      toast.error('미팅 링크를 입력해주세요.');
      return;
    }
    if (proposalMethod === 'OFFLINE' && !proposalAddress.trim()) {
      toast.error('면접 장소 주소를 입력해주세요.');
      return;
    }

    setProposalSubmitting(true);

    const existingNote = proposalModal.parsedNote;
    const newNote: InterviewNote = {
      method: proposalMethod,
      slot1: new Date(proposalSlot1).toISOString(),
      slot2: new Date(proposalSlot2).toISOString(),
      meetingLink: proposalMethod === 'ONLINE' ? proposalMeetingLink.trim() : (existingNote?.meetingLink || ''),
      address: proposalMethod === 'OFFLINE' ? proposalAddress.trim() : (existingNote?.address || ''),
      directions: proposalDirections.trim(),
      whatToBring: proposalWhatToBring.trim(),
      selectedSlot: null,
      cancelledBy: null,
      cancelReason: null,
      resultMessage: existingNote?.resultMessage || '',
    };

    const ok = await updateApplicationStatus(proposalModal.id, {
      status: 'INTERVIEW_REQUESTED',
      interviewDate: newNote.slot1,
      interviewNote: JSON.stringify(newNote),
    });

    setProposalSubmitting(false);

    if (ok) {
      toast.success(`${proposalModal.applicant.realName}님에게 면접 제안을 보냈습니다.`);
      setProposalModal(null);
      fetchInterviews();
    }
  };

  /* ── Result submit ── */

  const openResultModal = (entry: InterviewEntry) => {
    setResultType('pass');
    setResultMessage('');
    setResultModal(entry);
  };

  const submitResult = async () => {
    if (!resultModal) return;

    if (resultType === 'fail' && !resultMessage.trim()) {
      toast.error('불합격 사유를 입력해주세요.');
      return;
    }

    setResultSubmitting(true);

    const existingNote = resultModal.parsedNote;
    const updatedNote: InterviewNote = {
      ...(existingNote || {
        method: 'ONLINE',
        slot1: '',
        slot2: '',
        meetingLink: '',
        address: '',
        directions: '',
        whatToBring: '',
        selectedSlot: null,
        cancelledBy: null,
        cancelReason: null,
        resultMessage: '',
      }),
      resultMessage: resultMessage.trim(),
    };

    let ok: boolean;

    if (resultType === 'pass') {
      ok = await updateApplicationStatus(resultModal.id, {
        status: 'ACCEPTED',
        interviewNote: JSON.stringify(updatedNote),
      });
    } else {
      ok = await updateApplicationStatus(resultModal.id, {
        status: 'REJECTED',
        rejectionReason: resultMessage.trim(),
        interviewNote: JSON.stringify(updatedNote),
      });
    }

    setResultSubmitting(false);

    if (ok) {
      toast.success(
        resultType === 'pass'
          ? `${resultModal.applicant.realName}님에게 합격 통보를 보냈습니다.`
          : `${resultModal.applicant.realName}님에게 불합격 통보를 보냈습니다.`
      );
      setResultModal(null);
      fetchInterviews();
    }
  };

  /* ── Cancel submit ── */

  const openCancelModal = (entry: InterviewEntry) => {
    setCancelReason('');
    setCancelModal(entry);
  };

  const submitCancel = async () => {
    if (!cancelModal) return;

    if (!cancelReason) {
      toast.error('취소 사유를 선택해주세요.');
      return;
    }

    setCancelSubmitting(true);

    const existingNote = cancelModal.parsedNote;
    const updatedNote: InterviewNote = {
      ...(existingNote || {
        method: 'ONLINE',
        slot1: '',
        slot2: '',
        meetingLink: '',
        address: '',
        directions: '',
        whatToBring: '',
        selectedSlot: null,
        cancelledBy: null,
        cancelReason: null,
        resultMessage: '',
      }),
      cancelledBy: 'EMPLOYER',
      cancelReason: cancelReason,
    };

    const ok = await updateApplicationStatus(cancelModal.id, {
      status: 'CANCELLED',
      interviewNote: JSON.stringify(updatedNote),
    });

    setCancelSubmitting(false);

    if (ok) {
      toast.success('면접이 취소되었습니다.');
      setCancelModal(null);
      fetchInterviews();
    }
  };

  /* ── Confirm submit ── */

  const openConfirmModal = (entry: InterviewEntry) => {
    setConfirmSlot('slot1');
    setConfirmModal(entry);
  };

  const submitConfirm = async () => {
    if (!confirmModal) return;

    setConfirmSubmitting(true);

    const existingNote = confirmModal.parsedNote;
    const updatedNote: InterviewNote = {
      ...(existingNote || {
        method: 'ONLINE',
        slot1: '',
        slot2: '',
        meetingLink: '',
        address: '',
        directions: '',
        whatToBring: '',
        selectedSlot: null,
        cancelledBy: null,
        cancelReason: null,
        resultMessage: '',
      }),
      selectedSlot: confirmSlot,
    };

    const confirmedDate = confirmSlot === 'slot1'
      ? (existingNote?.slot1 || '')
      : (existingNote?.slot2 || '');

    const ok = await updateApplicationStatus(confirmModal.id, {
      status: 'CONFIRMED',
      interviewDate: confirmedDate,
      interviewNote: JSON.stringify(updatedNote),
    });

    setConfirmSubmitting(false);

    if (ok) {
      toast.success(`${confirmModal.applicant.realName}님의 면접이 확정되었습니다.`);
      setConfirmModal(null);
      fetchInterviews();
    }
  };

  /* ── Copy to clipboard helper ── */

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('클립보드에 복사되었습니다.');
    }).catch(() => {
      toast.error('복사에 실패했습니다.');
    });
  };

  /* ────────────────────────────────────────────
     Render
     ──────────────────────────────────────────── */

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">면접 일정 관리</h1>
          <p className="text-sm text-gray-500 mt-0.5">Interview Schedule Management</p>
        </div>
        <button
          onClick={() => fetchInterviews(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {/* Tab filters */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const config = TAB_CONFIG[tab];
          const count = countByTab(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
          <p className="text-sm text-gray-500">면접 일정을 불러오는 중...</p>
        </div>
      ) : interviews.length === 0 ? (
        /* Empty state - no interview data at all */
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">면접 일정이 없습니다</h2>
          <p className="text-sm text-gray-500">
            No interview schedules yet
          </p>
          <p className="text-xs text-gray-400 mt-2">
            지원자 관리 페이지에서 면접을 제안하면 여기에 표시됩니다.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state for current tab filter */
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
            <Calendar className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">
            {TAB_CONFIG[activeTab].label} 상태의 면접 일정이 없습니다.
          </p>
        </div>
      ) : (
        /* Interview cards */
        <div className="space-y-3">
          {filtered.map((entry) => {
            const status = entry.status as InterviewStatus;
            const badge = STATUS_BADGE[status];
            const note = entry.parsedNote;
            const selectedDatetime = note?.selectedSlot
              ? note[note.selectedSlot]
              : null;

            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition"
              >
                {/* Card header */}
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                    {entry.applicant.profileImageUrl ? (
                      <img
                        src={entry.applicant.profileImageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-gray-500">
                        {entry.applicant.realName?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {entry.applicant.realName || `지원자 #${entry.applicantId}`}
                      </h3>
                      {entry.applicant.nationality && (
                        <span className="text-xs text-gray-500">
                          {entry.applicant.nationality}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {entry.jobTitle}
                      </span>
                      {entry.applicant.visaType && (
                        <span className="inline-flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {entry.applicant.visaType}
                        </span>
                      )}
                    </div>

                    {/* Interview details */}
                    {note && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2">
                        {/* Method */}
                        <div className="flex items-center gap-1.5 text-xs">
                          {note.method === 'ONLINE' ? (
                            <Video className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          )}
                          <span className="font-medium text-gray-700">
                            {note.method === 'ONLINE' ? '온라인 면접' : '오프라인 면접'}
                          </span>
                        </div>

                        {/* Datetime slots */}
                        {selectedDatetime ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-green-500" />
                            <span className="font-medium">확정 일시:</span>
                            <span>{formatDateTime(selectedDatetime)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {note.slot1 && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-gray-500">1순위:</span>
                                <span>{formatDateTime(note.slot1)}</span>
                              </div>
                            )}
                            {note.slot2 && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-gray-500">2순위:</span>
                                <span>{formatDateTime(note.slot2)}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Meeting link - only show when CONFIRMED and ONLINE */}
                        {status === 'CONFIRMED' && note.method === 'ONLINE' && note.meetingLink && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                            <a
                              href={note.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate max-w-xs"
                            >
                              {note.meetingLink}
                            </a>
                            <button
                              onClick={() => copyToClipboard(note.meetingLink)}
                              className="p-0.5 text-gray-400 hover:text-gray-600"
                              title="링크 복사"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Address - for offline */}
                        {note.method === 'OFFLINE' && note.address && (
                          <div className="flex items-start gap-1.5 text-xs text-gray-600">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <div>
                              <span>{note.address}</span>
                              {note.directions && (
                                <span className="text-gray-400 ml-1">({note.directions})</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* What to bring */}
                        {note.whatToBring && (
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">준비물:</span> {note.whatToBring}
                          </p>
                        )}

                        {/* Result message (for completed) */}
                        {(status === 'ACCEPTED' || status === 'REJECTED') && note.resultMessage && (
                          <p className="text-xs text-gray-600 bg-white rounded px-2 py-1.5 border border-gray-100">
                            <span className="font-medium">결과 메시지:</span> {note.resultMessage}
                          </p>
                        )}

                        {/* Cancel info */}
                        {status === 'CANCELLED' && note.cancelledBy && (
                          <div className="text-xs text-gray-500 bg-white rounded px-2 py-1.5 border border-gray-100">
                            <span className="font-medium">취소:</span>{' '}
                            {note.cancelledBy === 'EMPLOYER' ? '기업 측' : '지원자 측'}
                            {note.cancelReason && ` - ${note.cancelReason}`}
                          </div>
                        )}

                        {/* Rejection reason */}
                        {status === 'REJECTED' && entry.rejectionReason && !note.resultMessage && (
                          <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1.5">
                            <span className="font-medium">불합격 사유:</span> {entry.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {status === 'INTERVIEW_REQUESTED' && (
                      <>
                        <button
                          onClick={() => openConfirmModal(entry)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          확정
                        </button>
                        <button
                          onClick={() => openCancelModal(entry)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Ban className="w-3 h-3" />
                          취소
                        </button>
                      </>
                    )}

                    {status === 'COORDINATION_NEEDED' && (
                      <button
                        onClick={() => openProposalModal(entry)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition"
                      >
                        <RefreshCw className="w-3 h-3" />
                        재제안
                      </button>
                    )}

                    {status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => openResultModal(entry)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                        >
                          <Send className="w-3 h-3" />
                          결과 통보
                        </button>
                        <button
                          onClick={() => openCancelModal(entry)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Ban className="w-3 h-3" />
                          취소
                        </button>
                      </>
                    )}

                    {status === 'ACCEPTED' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="w-3 h-3" />
                        합격
                      </span>
                    )}

                    {status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle className="w-3 h-3" />
                        불합격
                      </span>
                    )}

                    {status === 'CANCELLED' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
                        <Ban className="w-3 h-3" />
                        취소됨
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════
         Proposal Modal (Re-propose)
         ═══════════════════════════════════════ */}
      {proposalModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">면접 재제안</h3>
                <p className="text-xs text-gray-500 mt-0.5">Re-propose Interview</p>
              </div>
              <button
                onClick={() => setProposalModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">{proposalModal.applicant.realName}</span>님에게 새로운 면접 일정을 제안합니다.
            </p>

            <div className="space-y-4">
              {/* Interview method toggle */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  면접 방식 <span className="text-gray-400">/ Interview Method</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProposalMethod('ONLINE')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border transition ${
                      proposalMethod === 'ONLINE'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    온라인
                  </button>
                  <button
                    type="button"
                    onClick={() => setProposalMethod('OFFLINE')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border transition ${
                      proposalMethod === 'OFFLINE'
                        ? 'bg-orange-50 border-orange-300 text-orange-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    오프라인
                  </button>
                </div>
              </div>

              {/* Slot 1 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  1순위 일시 <span className="text-red-500">*</span>
                  <span className="text-gray-400 ml-1">/ 1st Priority</span>
                </label>
                <Input
                  type="datetime-local"
                  value={proposalSlot1}
                  onChange={(e) => setProposalSlot1(e.target.value)}
                />
              </div>

              {/* Slot 2 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  2순위 일시 <span className="text-red-500">*</span>
                  <span className="text-gray-400 ml-1">/ 2nd Priority</span>
                </label>
                <Input
                  type="datetime-local"
                  value={proposalSlot2}
                  onChange={(e) => setProposalSlot2(e.target.value)}
                />
              </div>

              {/* Meeting link (Online) */}
              {proposalMethod === 'ONLINE' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    미팅 링크 <span className="text-red-500">*</span>
                    <span className="text-gray-400 ml-1">/ Meeting Link</span>
                  </label>
                  <Input
                    type="url"
                    placeholder="https://zoom.us/j/..."
                    value={proposalMeetingLink}
                    onChange={(e) => setProposalMeetingLink(e.target.value)}
                  />
                </div>
              )}

              {/* Address (Offline) */}
              {proposalMethod === 'OFFLINE' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    면접 장소 주소 <span className="text-red-500">*</span>
                    <span className="text-gray-400 ml-1">/ Address</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="서울시 강남구 ..."
                    value={proposalAddress}
                    onChange={(e) => setProposalAddress(e.target.value)}
                  />
                </div>
              )}

              {/* Directions */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  층/호수/오시는 길
                  <span className="text-gray-400 ml-1">/ Floor, Room, Directions (optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="3층 301호, 엘리베이터 옆"
                  value={proposalDirections}
                  onChange={(e) => setProposalDirections(e.target.value)}
                />
              </div>

              {/* What to bring */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  준비물
                  <span className="text-gray-400 ml-1">/ What to bring (optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="신분증, 포트폴리오"
                  value={proposalWhatToBring}
                  onChange={(e) => setProposalWhatToBring(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setProposalModal(null)}
                disabled={proposalSubmitting}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-1"
                onClick={submitProposal}
                disabled={proposalSubmitting}
              >
                {proposalSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                제안 보내기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
         Confirm Modal (Select Slot)
         ═══════════════════════════════════════ */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">면접 확정</h3>
                <p className="text-xs text-gray-500 mt-0.5">Confirm Interview</p>
              </div>
              <button
                onClick={() => setConfirmModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">{confirmModal.applicant.realName}</span>님의 면접 일정을 확정합니다.
              <br />
              <span className="text-xs text-gray-400">Select the confirmed interview slot.</span>
            </p>

            {confirmModal.parsedNote && (
              <div className="space-y-2 mb-6">
                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    confirmSlot === 'slot1'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setConfirmSlot('slot1')}
                >
                  <input
                    type="radio"
                    name="confirmSlot"
                    checked={confirmSlot === 'slot1'}
                    onChange={() => setConfirmSlot('slot1')}
                    className="accent-green-600"
                  />
                  <div>
                    <p className="text-xs text-gray-500">1순위 일시 / Option 1</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDateTime(confirmModal.parsedNote.slot1)}
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    confirmSlot === 'slot2'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setConfirmSlot('slot2')}
                >
                  <input
                    type="radio"
                    name="confirmSlot"
                    checked={confirmSlot === 'slot2'}
                    onChange={() => setConfirmSlot('slot2')}
                    className="accent-green-600"
                  />
                  <div>
                    <p className="text-xs text-gray-500">2순위 일시 / Option 2</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDateTime(confirmModal.parsedNote.slot2)}
                    </p>
                  </div>
                </label>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmModal(null)}
                disabled={confirmSubmitting}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1"
                onClick={submitConfirm}
                disabled={confirmSubmitting}
              >
                {confirmSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                면접 확정
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
         Result Modal (Pass / Fail)
         ═══════════════════════════════════════ */}
      {resultModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">결과 통보</h3>
                <p className="text-xs text-gray-500 mt-0.5">Send Interview Result</p>
              </div>
              <button
                onClick={() => setResultModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">{resultModal.applicant.realName}</span>님의 면접 결과를 통보합니다.
            </p>

            <div className="space-y-4">
              {/* Pass / Fail toggle */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  결과 <span className="text-gray-400">/ Result</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResultType('pass')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border transition ${
                      resultType === 'pass'
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    합격 / Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultType('fail')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border transition ${
                      resultType === 'fail'
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    불합격 / Fail
                  </button>
                </div>
              </div>

              {/* Message field */}
              {resultType === 'pass' ? (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    안내 사항
                    <span className="text-gray-400 ml-1">/ Additional Info (optional)</span>
                  </label>
                  <textarea
                    value={resultMessage}
                    onChange={(e) => setResultMessage(e.target.value)}
                    rows={4}
                    placeholder="근무 시작일, 필요 서류, 오리엔테이션 일정 등을 안내해주세요."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    불합격 사유 <span className="text-red-500">*</span>
                    <span className="text-gray-400 ml-1">/ Rejection Reason</span>
                  </label>
                  <textarea
                    value={resultMessage}
                    onChange={(e) => setResultMessage(e.target.value)}
                    rows={4}
                    placeholder="불합격 사유를 입력해주세요."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              )}

              {resultType === 'pass' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  합격 통보 후 지원자에게 알림이 발송됩니다.
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setResultModal(null)}
                disabled={resultSubmitting}
              >
                취소
              </Button>
              <Button
                className={`flex-1 gap-1 text-white ${
                  resultType === 'pass'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={submitResult}
                disabled={resultSubmitting}
              >
                {resultSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                결과 통보
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
         Cancel Modal
         ═══════════════════════════════════════ */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">면접 취소</h3>
                <p className="text-xs text-gray-500 mt-0.5">Cancel Interview</p>
              </div>
              <button
                onClick={() => setCancelModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">{cancelModal.applicant.realName}</span>님과의 면접을 취소합니다.
            </p>
            <p className="text-xs text-red-500 mb-4">
              취소 후에는 되돌릴 수 없습니다. / This action cannot be undone.
            </p>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                취소 사유 <span className="text-red-500">*</span>
                <span className="text-gray-400 ml-1">/ Cancellation Reason</span>
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">사유를 선택해주세요</option>
                {CANCEL_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCancelModal(null)}
                disabled={cancelSubmitting}
              >
                돌아가기
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-1"
                onClick={submitCancel}
                disabled={cancelSubmitting}
              >
                {cancelSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Ban className="w-3.5 h-3.5" />
                )}
                면접 취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
