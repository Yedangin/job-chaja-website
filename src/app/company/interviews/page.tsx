'use client';

/**
 * 기업 면접 관리 페이지 / Company Interview Management Page
 *
 * 기업 회원이 공고별 지원자의 면접 상태를 관리하는 페이지.
 * 면접 제안, 취소, 합격/불합격 결과 통보 기능을 포함.
 *
 * Company member page for managing interview statuses across job postings.
 * Includes interview proposal, cancellation, and pass/fail result notification.
 *
 * 전략: 전용 면접 엔드포인트 없음 → 내 공고 목록 조회 후 각 공고별 지원자를 조회하여
 * 면접 관련 상태(INTERVIEW_REQUESTED, COORDINATION_NEEDED, CONFIRMED, ACCEPTED,
 * REJECTED, CANCELLED + PENDING/REVIEWING 면접 제안 대상)를 집계하여 표시.
 *
 * Strategy: No dedicated interview endpoint → fetch company's job list, then fetch
 * applicants per job and aggregate all interview-related statuses for display.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RefreshCw,
  User,
  Globe,
  Briefcase,
  Clock,
  MapPin,
  Link2,
  Loader2,
  Calendar,
  AlertCircle,
  Video,
  Building2,
  X,
  Check,
  ChevronDown,
  Send,
  Ban,
  MessageSquare,
  FileText,
  Navigation,
  Package,
  StickyNote,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

// ═══════════════════════════════════════════════════════════════════
// 타입 정의 / Type definitions
// ═══════════════════════════════════════════════════════════════════

/** 지원 상태 타입 / Application status type */
type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'INTERVIEW_REQUESTED'
  | 'INTERVIEW_SCHEDULED'
  | 'COORDINATION_NEEDED'
  | 'CONFIRMED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

/** 면접 방식 / Interview method */
type InterviewMethod = 'ONLINE' | 'OFFLINE';

/** 기업 측 취소 사유 코드 / Employer cancellation reason codes */
type EmployerCancelReason =
  | 'RECRUITMENT_CANCELLED'
  | 'SCHEDULE_UNAVAILABLE'
  | 'OTHER_CANDIDATE_HIRED'
  | 'OTHER';

/** 결과 유형 / Result type */
type ResultType = 'ACCEPTED' | 'REJECTED';

/** 필터 탭 키 / Filter tab key */
type FilterTab =
  | 'all'
  | 'INTERVIEW_REQUESTED'
  | 'COORDINATION_NEEDED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

/** 공고 정보 (목록 조회용) / Job posting (for list fetch) */
interface JobPosting {
  id: number | string;
  title: string;
  status: string;
}

/** 지원자 프로필 / Applicant profile */
interface ApplicantProfile {
  realName?: string;
  nationality?: string;
  visaType?: string;
  visaExpiryDate?: string;
  profileImageUrl?: string | null;
}

/** 지원서 (API 응답) / Application from API response */
interface ApplicationItem {
  id: string;
  applicantId?: string;
  status: ApplicationStatus;
  applicationMethod?: string;
  coverLetter?: string;
  interviewDate?: string;
  interviewNote?: string;
  interviewMethod?: InterviewMethod;
  interviewFirstChoice?: string;
  interviewSecondChoice?: string;
  interviewLocation?: string;
  interviewLink?: string;
  interviewDirections?: string;
  interviewWhatToBring?: string;
  cancelReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  rejectionReason?: string;
  resultNotifiedAt?: string;
  createdAt: string;
  applicant?: ApplicantProfile | null;
  // 프론트에서 공고 정보 추가 / Added by frontend for display
  _jobId?: string;
  _jobTitle?: string;
}

/** 면접 제안 폼 상태 / Propose interview form state */
interface ProposeFormState {
  interviewMethod: InterviewMethod;
  firstChoice: string;
  secondChoice: string;
  location: string;
  link: string;
  directions: string;
  whatToBring: string;
  note: string;
}

/** 면접 취소 폼 상태 / Cancel interview form state */
interface CancelFormState {
  reason: EmployerCancelReason | '';
  reasonDetail: string;
}

/** 결과 통보 폼 상태 / Send result form state */
interface ResultFormState {
  result: ResultType;
  message: string;
  rejectionReason: string;
  additionalInfo: string;
}

// ═══════════════════════════════════════════════════════════════════
// 상수 / Constants
// ═══════════════════════════════════════════════════════════════════

/** 상태별 배지 설정 / Status badge configuration */
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
  INTERVIEW_REQUESTED: {
    label: 'Interview Requested',
    labelKo: '면접 제안됨',
    color: 'bg-yellow-100 text-yellow-700',
  },
  INTERVIEW_SCHEDULED: {
    label: 'Interview Scheduled',
    labelKo: '면접 예정',
    color: 'bg-purple-100 text-purple-700',
  },
  COORDINATION_NEEDED: {
    label: 'Coordination Needed',
    labelKo: '일정 조율 중',
    color: 'bg-orange-100 text-orange-700',
  },
  CONFIRMED: {
    label: 'Confirmed',
    labelKo: '면접 확정',
    color: 'bg-indigo-100 text-indigo-700',
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

/** 필터 탭 정의 / Filter tab definitions */
const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'INTERVIEW_REQUESTED', label: '제안중' },
  { key: 'COORDINATION_NEEDED', label: '조율중' },
  { key: 'CONFIRMED', label: '확정' },
  { key: 'COMPLETED', label: '완료' },
  { key: 'CANCELLED', label: '취소' },
];

/** 취소 사유 옵션 / Cancellation reason options */
const CANCEL_REASONS: { value: EmployerCancelReason; label: string }[] = [
  { value: 'RECRUITMENT_CANCELLED', label: '채용취소' },
  { value: 'SCHEDULE_UNAVAILABLE', label: '일정변경불가' },
  { value: 'OTHER_CANDIDATE_HIRED', label: '다른후보채용' },
  { value: 'OTHER', label: '기타' },
];

/** 초기 면접 제안 폼 / Initial propose form values */
const INITIAL_PROPOSE_FORM: ProposeFormState = {
  interviewMethod: 'OFFLINE',
  firstChoice: '',
  secondChoice: '',
  location: '',
  link: '',
  directions: '',
  whatToBring: '',
  note: '',
};

/** 초기 취소 폼 / Initial cancel form values */
const INITIAL_CANCEL_FORM: CancelFormState = {
  reason: '',
  reasonDetail: '',
};

/** 초기 결과 통보 폼 / Initial result form values */
const INITIAL_RESULT_FORM: ResultFormState = {
  result: 'ACCEPTED',
  message: '',
  rejectionReason: '',
  additionalInfo: '',
};

// ═══════════════════════════════════════════════════════════════════
// 헬퍼 함수 / Helper functions
// ═══════════════════════════════════════════════════════════════════

/**
 * 날짜 포맷 (YYYY.MM.DD HH:mm) / Format date to Korean display
 */
function formatDateTime(iso?: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}.${m}.${day} ${h}:${min}`;
}

/**
 * 짧은 날짜 포맷 (MM/DD HH:mm) / Short date format
 */
function formatShortDateTime(iso?: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${m}/${day} ${h}:${min}`;
}

/**
 * 필터 탭에 따른 지원서 필터링 / Filter applications by tab
 */
function filterByTab(
  apps: ApplicationItem[],
  tab: FilterTab
): ApplicationItem[] {
  switch (tab) {
    case 'all':
      return apps;
    case 'INTERVIEW_REQUESTED':
      return apps.filter((a) => a.status === 'INTERVIEW_REQUESTED');
    case 'COORDINATION_NEEDED':
      return apps.filter((a) => a.status === 'COORDINATION_NEEDED');
    case 'CONFIRMED':
      return apps.filter((a) => a.status === 'CONFIRMED');
    case 'COMPLETED':
      return apps.filter(
        (a) => a.status === 'ACCEPTED' || a.status === 'REJECTED'
      );
    case 'CANCELLED':
      return apps.filter((a) => a.status === 'CANCELLED');
    default:
      return apps;
  }
}

/**
 * 탭별 건수 계산 / Count applications per tab
 */
function countByTab(
  apps: ApplicationItem[],
  tab: FilterTab
): number {
  return filterByTab(apps, tab).length;
}

// ═══════════════════════════════════════════════════════════════════
// 로딩 스켈레톤 / Loading skeleton
// ═══════════════════════════════════════════════════════════════════

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* 요약 바 스켈레톤 / Summary bar skeleton */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6 animate-pulse">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl" />
        ))}
      </div>
      {/* 카드 스켈레톤 / Card skeletons */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded-full shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 모달 오버레이 / Modal overlay
// ═══════════════════════════════════════════════════════════════════

function ModalOverlay({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 딤 / Background dim */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* 모달 컨텐츠 / Modal content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* 모달 헤더 / Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* 모달 본문 / Modal body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 상태 요약 바 / Status summary bar
// ═══════════════════════════════════════════════════════════════════

function SummaryBar({
  applications,
  activeTab,
  onTabChange,
}: {
  applications: ApplicationItem[];
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
}) {
  // 요약 항목 정의 / Summary item definitions
  const summaryItems: {
    key: FilterTab;
    label: string;
    count: number;
    borderColor: string;
    bgColor: string;
    textColor: string;
  }[] = [
    {
      key: 'all',
      label: '전체',
      count: applications.length,
      borderColor: 'border-gray-200',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
    },
    {
      key: 'INTERVIEW_REQUESTED',
      label: '제안중',
      count: countByTab(applications, 'INTERVIEW_REQUESTED'),
      borderColor: 'border-yellow-200',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
    },
    {
      key: 'COORDINATION_NEEDED',
      label: '조율중',
      count: countByTab(applications, 'COORDINATION_NEEDED'),
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-800',
    },
    {
      key: 'CONFIRMED',
      label: '확정',
      count: countByTab(applications, 'CONFIRMED'),
      borderColor: 'border-indigo-200',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-800',
    },
    {
      key: 'COMPLETED',
      label: '완료',
      count: countByTab(applications, 'COMPLETED'),
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
    },
    {
      key: 'CANCELLED',
      label: '취소',
      count: countByTab(applications, 'CANCELLED'),
      borderColor: 'border-gray-200',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-500',
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
      {summaryItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onTabChange(item.key)}
            className={`rounded-xl border p-3 text-center transition cursor-pointer ${
              isActive
                ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50'
                : `${item.borderColor} ${item.bgColor} hover:ring-1 hover:ring-blue-300`
            }`}
          >
            <p className={`text-2xl font-bold ${isActive ? 'text-blue-700' : item.textColor}`}>
              {item.count}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 빈 상태 / Empty state
// ═══════════════════════════════════════════════════════════════════

function EmptyState({ activeTab }: { activeTab: FilterTab }) {
  const isFiltered = activeTab !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8 text-blue-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        {isFiltered
          ? '해당 상태의 면접 내역이 없습니다'
          : '면접 관련 지원자가 없습니다'}
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        {isFiltered
          ? '다른 필터를 선택하거나 전체 보기로 전환해보세요.'
          : '지원자에게 면접을 제안하면 여기에서 관리할 수 있습니다.'}
        <br />
        {isFiltered
          ? 'Try a different filter or switch to All.'
          : 'Propose interviews to applicants and manage them here.'}
      </p>
      {!isFiltered && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>
            공고별 지원자 목록에서 면접을 제안할 수 있습니다.
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 메인 컴포넌트 / Main component
// ═══════════════════════════════════════════════════════════════════

export default function CompanyInterviewsPage() {
  // ── 상태 / State ───────────────────────────────────────────────
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // 모달 상태 / Modal state
  const [proposeTarget, setProposeTarget] = useState<ApplicationItem | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ApplicationItem | null>(null);
  const [resultTarget, setResultTarget] = useState<ApplicationItem | null>(null);

  // 폼 상태 / Form state
  const [proposeForm, setProposeForm] = useState<ProposeFormState>(INITIAL_PROPOSE_FORM);
  const [cancelForm, setCancelForm] = useState<CancelFormState>(INITIAL_CANCEL_FORM);
  const [resultForm, setResultForm] = useState<ResultFormState>(INITIAL_RESULT_FORM);

  // 제출 중 상태 / Submitting state
  const [submitting, setSubmitting] = useState(false);

  // ── 데이터 로드 / Data loading ─────────────────────────────────

  /**
   * 공고 목록 조회 (raw fetch) / Fetch company job list (raw fetch)
   * 프록시: /api/jobs/my/list → 백엔드 /jobs/my/list
   * Proxy: /api/jobs/my/list → backend /jobs/my/list
   */
  const fetchJobs = async (): Promise<JobPosting[]> => {
    const res = await fetch('/api/jobs/my/list?limit=100', {
      credentials: 'include',
    });
    if (!res.ok) return [];
    const data = await res.json();
    // 응답 형태: { items: [...] } 또는 { jobs: [...] } 또는 배열
    // Response shape: { items: [...] } or { jobs: [...] } or array
    const rawList: JobPosting[] = Array.isArray(data)
      ? data
      : data.items || data.jobs || data.data || [];
    // ACTIVE 공고만 / Only ACTIVE postings
    return rawList.filter((j) => j.status === 'ACTIVE');
  };

  /**
   * 특정 공고의 지원자 목록 조회 / Fetch applicants for a specific job
   * 프록시: /api/applications/jobs/:jobId/applicants → 백엔드 /applications/jobs/:jobId/applicants
   * Proxy: /api/applications/jobs/:jobId/applicants → backend /applications/jobs/:jobId/applicants
   */
  const fetchJobApplicants = async (
    job: JobPosting
  ): Promise<ApplicationItem[]> => {
    try {
      const res = await fetch(
        `/api/applications/jobs/${job.id}/applicants?limit=100`,
        { credentials: 'include' }
      );
      if (!res.ok) return [];
      const data = await res.json();
      // 응답 형태: { items: [...] } 또는 배열
      // Response shape: { items: [...] } or array
      const items: ApplicationItem[] = Array.isArray(data)
        ? data
        : data.items || data.applications || data.data || [];
      // 공고 정보 첨부 / Attach job info
      return items.map((item) => ({
        ...item,
        _jobId: String(job.id),
        _jobTitle: job.title,
      }));
    } catch {
      // 개별 공고 실패 시 빈 배열 (전체 실패 방지)
      // Return empty on individual failure (prevent full crash)
      return [];
    }
  };

  /**
   * 전체 면접 관련 지원서 로드 / Load all interview-relevant applications
   */
  const loadInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const jobs = await fetchJobs();
      // 병렬 조회 / Parallel fetch
      const allResults = await Promise.all(
        jobs.map((job) => fetchJobApplicants(job))
      );
      const all = allResults.flat();
      // 면접 관련 상태만 필터링 (PENDING/REVIEWING도 면접 제안 대상으로 포함)
      // Filter interview-related statuses (include PENDING/REVIEWING as proposal targets)
      const interviewRelevant = all.filter((a) =>
        [
          'PENDING',
          'REVIEWING',
          'INTERVIEW_REQUESTED',
          'INTERVIEW_SCHEDULED',
          'COORDINATION_NEEDED',
          'CONFIRMED',
          'ACCEPTED',
          'REJECTED',
          'CANCELLED',
        ].includes(a.status)
      );
      // 상태 우선순위 정렬: 확정 > 조율중 > 제안중 > 대기 > 완료 > 취소
      // Sort by status priority: confirmed > coordinating > requested > pending > completed > cancelled
      const statusOrder: Record<string, number> = {
        CONFIRMED: 0,
        COORDINATION_NEEDED: 1,
        INTERVIEW_REQUESTED: 2,
        INTERVIEW_SCHEDULED: 3,
        REVIEWING: 4,
        PENDING: 5,
        ACCEPTED: 6,
        REJECTED: 7,
        CANCELLED: 8,
      };
      interviewRelevant.sort((a, b) => {
        const oa = statusOrder[a.status] ?? 9;
        const ob = statusOrder[b.status] ?? 9;
        if (oa !== ob) return oa - ob;
        // 같은 상태면 최신 순 / Same status → newest first
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setApplications(interviewRelevant);
    } catch {
      toast.error('면접 데이터를 불러오는 데 실패했습니다. / Failed to load interview data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  // ── 필터링된 지원서 / Filtered applications ────────────────────

  const filteredApplications = useMemo(
    () => filterByTab(applications, activeTab),
    [applications, activeTab]
  );

  // ── 액션 핸들러 / Action handlers ──────────────────────────────

  /**
   * 면접 제안 제출 / Submit interview proposal
   * POST /api/applications/:id/propose-interview
   */
  const handleProposeSubmit = async () => {
    if (!proposeTarget) return;
    if (!proposeForm.firstChoice) {
      toast.error('1순위 면접 일시를 선택해주세요. / Please select the first choice datetime.');
      return;
    }
    if (
      proposeForm.interviewMethod === 'OFFLINE' &&
      !proposeForm.location.trim()
    ) {
      toast.error('오프라인 면접 장소를 입력해주세요. / Please enter the offline interview location.');
      return;
    }
    if (
      proposeForm.interviewMethod === 'ONLINE' &&
      !proposeForm.link.trim()
    ) {
      toast.error('온라인 면접 링크를 입력해주세요. / Please enter the online meeting link.');
      return;
    }

    setSubmitting(true);
    try {
      // ISO 변환: datetime-local → ISO 8601 / Convert datetime-local to ISO 8601
      const body: Record<string, unknown> = {
        interviewMethod: proposeForm.interviewMethod,
        firstChoice: new Date(proposeForm.firstChoice).toISOString(),
      };
      if (proposeForm.secondChoice) {
        body.secondChoice = new Date(proposeForm.secondChoice).toISOString();
      }
      if (proposeForm.interviewMethod === 'OFFLINE') {
        body.location = proposeForm.location.trim();
      } else {
        body.link = proposeForm.link.trim();
      }
      if (proposeForm.directions.trim()) {
        body.directions = proposeForm.directions.trim();
      }
      if (proposeForm.whatToBring.trim()) {
        body.whatToBring = proposeForm.whatToBring.trim();
      }
      if (proposeForm.note.trim()) {
        body.note = proposeForm.note.trim();
      }

      await apiClient.post(
        `/applications/${proposeTarget.id}/propose-interview`,
        body
      );

      toast.success('면접이 제안되었습니다. / Interview proposed successfully.');
      setProposeTarget(null);
      setProposeForm(INITIAL_PROPOSE_FORM);
      // 낙관적 업데이트 / Optimistic update
      setApplications((prev) =>
        prev.map((a) =>
          a.id === proposeTarget.id
            ? { ...a, status: 'INTERVIEW_REQUESTED' as const }
            : a
        )
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '면접 제안에 실패했습니다.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 면접 취소 제출 / Submit interview cancellation
   * POST /api/applications/:id/cancel-interview
   */
  const handleCancelSubmit = async () => {
    if (!cancelTarget) return;
    if (!cancelForm.reason) {
      toast.error('취소 사유를 선택해주세요. / Please select a cancellation reason.');
      return;
    }
    if (cancelForm.reason === 'OTHER' && !cancelForm.reasonDetail.trim()) {
      toast.error('기타 사유를 입력해주세요. / Please enter the detail for "Other" reason.');
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        reason: cancelForm.reason,
      };
      if (cancelForm.reasonDetail.trim()) {
        body.reasonDetail = cancelForm.reasonDetail.trim();
      }

      await apiClient.post(
        `/applications/${cancelTarget.id}/cancel-interview`,
        body
      );

      toast.success('면접이 취소되었습니다. / Interview cancelled successfully.');
      setCancelTarget(null);
      setCancelForm(INITIAL_CANCEL_FORM);
      // 낙관적 업데이트 / Optimistic update
      setApplications((prev) =>
        prev.map((a) =>
          a.id === cancelTarget.id
            ? { ...a, status: 'CANCELLED' as const, cancelReason: cancelForm.reason }
            : a
        )
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '면접 취소에 실패했습니다.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 결과 통보 제출 / Submit result notification
   * POST /api/applications/:id/send-result
   */
  const handleResultSubmit = async () => {
    if (!resultTarget) return;

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        result: resultForm.result,
      };
      if (resultForm.message.trim()) {
        body.message = resultForm.message.trim();
      }
      if (resultForm.result === 'REJECTED' && resultForm.rejectionReason.trim()) {
        body.rejectionReason = resultForm.rejectionReason.trim();
      }
      if (resultForm.result === 'ACCEPTED' && resultForm.additionalInfo.trim()) {
        body.additionalInfo = resultForm.additionalInfo.trim();
      }

      await apiClient.post(
        `/applications/${resultTarget.id}/send-result`,
        body
      );

      toast.success(
        resultForm.result === 'ACCEPTED'
          ? '합격 통보가 전송되었습니다. / Acceptance notification sent.'
          : '불합격 통보가 전송되었습니다. / Rejection notification sent.'
      );
      setResultTarget(null);
      setResultForm(INITIAL_RESULT_FORM);
      // 낙관적 업데이트 / Optimistic update
      setApplications((prev) =>
        prev.map((a) =>
          a.id === resultTarget.id
            ? { ...a, status: resultForm.result as ApplicationStatus }
            : a
        )
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '결과 통보에 실패했습니다.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── 카드 렌더링 / Card rendering ───────────────────────────────

  /**
   * 지원서 카드 / Application card
   */
  const ApplicationCard = ({ app }: { app: ApplicationItem }) => {
    const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING;
    const applicantName =
      app.applicant?.realName || '이름 미제공 / Name not provided';
    const visaType = app.applicant?.visaType;
    const nationality = app.applicant?.nationality;
    const isOnline = app.interviewMethod === 'ONLINE';

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition">
        {/* 상단: 지원자 정보 + 상태 배지 / Top: Applicant info + status badge */}
        <div className="flex items-start gap-3">
          {/* 아이콘 / Icon */}
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-blue-500" />
          </div>

          {/* 정보 영역 / Info area */}
          <div className="flex-1 min-w-0">
            {/* 이름 + 비자 + 국적 / Name + Visa + Nationality */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-gray-900 text-sm">
                {applicantName}
              </span>
              {visaType && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
                  <Globe className="w-3 h-3" />
                  {visaType}
                </span>
              )}
              {nationality && (
                <span className="text-xs text-gray-400">{nationality}</span>
              )}
            </div>

            {/* 공고명 / Job title */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
              <Briefcase className="w-3 h-3 shrink-0" />
              <span className="truncate">{app._jobTitle || '-'}</span>
            </div>

            {/* 면접 상세 정보 (면접 관련 상태만 표시) / Interview details (only for interview statuses) */}
            {(app.status === 'INTERVIEW_REQUESTED' ||
              app.status === 'COORDINATION_NEEDED' ||
              app.status === 'CONFIRMED' ||
              app.status === 'INTERVIEW_SCHEDULED') && (
              <div className="mt-2 bg-gray-50 rounded-xl p-3 space-y-1.5">
                {/* 면접 방식 / Interview method */}
                {app.interviewMethod && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    {isOnline ? (
                      <Video className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-orange-500" />
                    )}
                    <span className="font-medium">
                      {isOnline ? '온라인 면접 / Online' : '오프라인 면접 / Offline'}
                    </span>
                  </div>
                )}

                {/* 1순위 일시 / First choice datetime */}
                {app.interviewFirstChoice && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      1순위: {formatDateTime(app.interviewFirstChoice)}
                    </span>
                  </div>
                )}

                {/* 2순위 일시 / Second choice datetime */}
                {app.interviewSecondChoice && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      2순위: {formatDateTime(app.interviewSecondChoice)}
                    </span>
                  </div>
                )}

                {/* 기존 interviewDate (레거시 호환) / Legacy interviewDate */}
                {!app.interviewFirstChoice && app.interviewDate && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>면접일: {formatDateTime(app.interviewDate)}</span>
                  </div>
                )}

                {/* 장소 (오프라인) / Location (offline) */}
                {app.interviewLocation && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span className="truncate">{app.interviewLocation}</span>
                  </div>
                )}

                {/* 링크 (온라인) / Link (online) */}
                {app.interviewLink && (
                  <div className="flex items-center gap-1.5 text-xs text-blue-600">
                    <Link2 className="w-3.5 h-3.5" />
                    <a
                      href={app.interviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:underline"
                    >
                      {app.interviewLink}
                    </a>
                  </div>
                )}

                {/* 면접 메모 (레거시) / Interview note (legacy) */}
                {app.interviewNote && !app.interviewLocation && !app.interviewLink && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{app.interviewNote}</span>
                  </div>
                )}
              </div>
            )}

            {/* 취소 사유 표시 (CANCELLED 상태) / Display cancel reason (CANCELLED status) */}
            {app.status === 'CANCELLED' && app.cancelReason && (
              <div className="mt-2 bg-red-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-red-600">
                  <Ban className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    취소 사유: {
                      CANCEL_REASONS.find((r) => r.value === app.cancelReason)
                        ?.label || app.cancelReason
                    }
                  </span>
                </div>
                {app.cancelledAt && (
                  <p className="text-xs text-red-400 mt-1 ml-5">
                    {formatDateTime(app.cancelledAt)}
                  </p>
                )}
              </div>
            )}

            {/* 결과 표시 (ACCEPTED/REJECTED 상태) / Display result (ACCEPTED/REJECTED status) */}
            {(app.status === 'ACCEPTED' || app.status === 'REJECTED') && (
              <div
                className={`mt-2 rounded-xl p-3 ${
                  app.status === 'ACCEPTED' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium ${
                    app.status === 'ACCEPTED'
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
                >
                  {app.status === 'ACCEPTED' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {app.status === 'ACCEPTED'
                      ? '합격 통보 완료 / Accepted'
                      : '불합격 통보 완료 / Rejected'}
                  </span>
                </div>
                {app.rejectionReason && (
                  <p className="text-xs text-red-500 mt-1 ml-5">
                    사유: {app.rejectionReason}
                  </p>
                )}
                {app.resultNotifiedAt && (
                  <p className="text-xs text-gray-400 mt-1 ml-5">
                    통보일: {formatDateTime(app.resultNotifiedAt)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 상태 배지 / Status badge */}
          <span
            className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${config.color}`}
          >
            {config.labelKo}
          </span>
        </div>

        {/* 하단: 액션 버튼 / Bottom: Action buttons */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          {/* 지원일 / Applied date */}
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            지원일: {formatShortDateTime(app.createdAt)}
          </span>

          {/* 액션 버튼 영역 / Action button area */}
          <div className="flex items-center gap-2">
            {/* PENDING / REVIEWING: 면접 제안 버튼 / Propose interview button */}
            {(app.status === 'PENDING' || app.status === 'REVIEWING') && (
              <button
                type="button"
                onClick={() => {
                  setProposeTarget(app);
                  setProposeForm(INITIAL_PROPOSE_FORM);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <Send className="w-3 h-3" />
                면접 제안
              </button>
            )}

            {/* INTERVIEW_REQUESTED: 대기 배지 + 취소 / Waiting badge + cancel */}
            {app.status === 'INTERVIEW_REQUESTED' && (
              <>
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-lg border border-yellow-200">
                  <Clock className="w-3 h-3" />
                  대기 중...
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCancelTarget(app);
                    setCancelForm(INITIAL_CANCEL_FORM);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-lg hover:bg-red-100 transition"
                >
                  <X className="w-3 h-3" />
                  취소
                </button>
              </>
            )}

            {/* COORDINATION_NEEDED: 조율 확인 안내 + 취소 / Coordination info + cancel */}
            {app.status === 'COORDINATION_NEEDED' && (
              <>
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg border border-orange-200">
                  <MessageSquare className="w-3 h-3" />
                  조율 확인
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCancelTarget(app);
                    setCancelForm(INITIAL_CANCEL_FORM);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-lg hover:bg-red-100 transition"
                >
                  <X className="w-3 h-3" />
                  취소
                </button>
              </>
            )}

            {/* CONFIRMED: 결과 통보 + 취소 / Result notification + cancel */}
            {app.status === 'CONFIRMED' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setResultTarget(app);
                    setResultForm(INITIAL_RESULT_FORM);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  <FileText className="w-3 h-3" />
                  결과 통보
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCancelTarget(app);
                    setCancelForm(INITIAL_CANCEL_FORM);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-lg hover:bg-red-100 transition"
                >
                  <X className="w-3 h-3" />
                  취소
                </button>
              </>
            )}

            {/* ACCEPTED: 합격 결과 배지 / Accepted result badge */}
            {app.status === 'ACCEPTED' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                <Check className="w-3 h-3" />
                합격
              </span>
            )}

            {/* REJECTED: 불합격 결과 배지 / Rejected result badge */}
            {app.status === 'REJECTED' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                <X className="w-3 h-3" />
                불합격
              </span>
            )}

            {/* CANCELLED: 취소 배지 / Cancelled badge */}
            {app.status === 'CANCELLED' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-400 text-xs font-semibold rounded-full">
                <Ban className="w-3 h-3" />
                취소됨
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── 메인 렌더 / Main render ────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ── 헤더 / Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">면접 관리</h1>
          <p className="text-sm text-gray-400 mt-0.5">Interview Management</p>
        </div>
        <button
          type="button"
          onClick={loadInterviews}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          title="새로고침 / Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ── 로딩 / Loading ────────────────────────────────────────── */}
      {loading && <LoadingSkeleton />}

      {/* ── 데이터 로드 완료 / Data loaded ────────────────────────── */}
      {!loading && (
        <>
          {/* 상태 요약 바 (클릭 시 탭 변경) / Status summary bar (clickable tabs) */}
          <SummaryBar
            applications={applications}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* 필터 탭 / Filter tabs */}
          <div className="flex gap-1 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_TABS.map((tab) => {
              const count = countByTab(applications, tab.key);
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

          {/* 지원서 카드 목록 / Application card list */}
          {filteredApplications.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 면접 제안 모달 / Propose Interview Modal                    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <ModalOverlay
        open={!!proposeTarget}
        onClose={() => {
          if (!submitting) {
            setProposeTarget(null);
            setProposeForm(INITIAL_PROPOSE_FORM);
          }
        }}
        title="면접 제안 / Propose Interview"
      >
        {proposeTarget && (
          <div className="space-y-5">
            {/* 대상 지원자 정보 / Target applicant info */}
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {proposeTarget.applicant?.realName || '이름 미제공'}
                </p>
                <p className="text-xs text-gray-500">{proposeTarget._jobTitle}</p>
              </div>
            </div>

            {/* 면접 방식 토글 / Interview method toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                면접 방식 / Interview Method
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setProposeForm((f) => ({
                      ...f,
                      interviewMethod: 'OFFLINE',
                      link: '',
                    }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition ${
                    proposeForm.interviewMethod === 'OFFLINE'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  오프라인
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setProposeForm((f) => ({
                      ...f,
                      interviewMethod: 'ONLINE',
                      location: '',
                      directions: '',
                    }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition ${
                    proposeForm.interviewMethod === 'ONLINE'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  온라인
                </button>
              </div>
            </div>

            {/* 1순위 면접 일시 (필수) / First choice datetime (required) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="text-red-500">*</span> 1순위 면접 일시 / First Choice
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={proposeForm.firstChoice}
                  onChange={(e) =>
                    setProposeForm((f) => ({ ...f, firstChoice: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* 2순위 면접 일시 (선택) / Second choice datetime (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                2순위 면접 일시 / Second Choice
                <span className="text-xs text-gray-400 ml-1">(선택)</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="datetime-local"
                  value={proposeForm.secondChoice}
                  onChange={(e) =>
                    setProposeForm((f) => ({
                      ...f,
                      secondChoice: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 장소 (오프라인 면접 시) / Location (for offline interview) */}
            {proposeForm.interviewMethod === 'OFFLINE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="text-red-500">*</span> 면접 장소 / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={proposeForm.location}
                    onChange={(e) =>
                      setProposeForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="서울시 강남구 테헤란로 123, 4층"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* 링크 (온라인 면접 시) / Link (for online interview) */}
            {proposeForm.interviewMethod === 'ONLINE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="text-red-500">*</span> 미팅 링크 / Meeting Link
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={proposeForm.link}
                    onChange={(e) =>
                      setProposeForm((f) => ({ ...f, link: e.target.value }))
                    }
                    placeholder="https://meet.google.com/..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* 오시는 길 (오프라인, 선택) / Directions (offline, optional) */}
            {proposeForm.interviewMethod === 'OFFLINE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Navigation className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                  오시는 길 / Directions
                  <span className="text-xs text-gray-400 ml-1">(선택)</span>
                </label>
                <textarea
                  value={proposeForm.directions}
                  onChange={(e) =>
                    setProposeForm((f) => ({ ...f, directions: e.target.value }))
                  }
                  placeholder="2호선 강남역 3번 출구에서 도보 5분"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            )}

            {/* 준비물 (선택) / What to bring (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Package className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                준비물 안내 / What to Bring
                <span className="text-xs text-gray-400 ml-1">(선택)</span>
              </label>
              <textarea
                value={proposeForm.whatToBring}
                onChange={(e) =>
                  setProposeForm((f) => ({ ...f, whatToBring: e.target.value }))
                }
                placeholder="신분증, 포트폴리오 등"
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 메모 (선택) / Note (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <StickyNote className="inline w-3.5 h-3.5 mr-1 text-gray-400" />
                기업 메모 / Note
                <span className="text-xs text-gray-400 ml-1">(선택)</span>
              </label>
              <textarea
                value={proposeForm.note}
                onChange={(e) =>
                  setProposeForm((f) => ({ ...f, note: e.target.value }))
                }
                placeholder="면접 관련 추가 안내 사항"
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 제출 버튼 / Submit button */}
            <button
              type="button"
              onClick={handleProposeSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              면접 제안하기 / Propose Interview
            </button>
          </div>
        )}
      </ModalOverlay>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 면접 취소 모달 / Cancel Interview Modal                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <ModalOverlay
        open={!!cancelTarget}
        onClose={() => {
          if (!submitting) {
            setCancelTarget(null);
            setCancelForm(INITIAL_CANCEL_FORM);
          }
        }}
        title="면접 취소 / Cancel Interview"
      >
        {cancelTarget && (
          <div className="space-y-5">
            {/* 대상 정보 / Target info */}
            <div className="bg-red-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Ban className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {cancelTarget.applicant?.realName || '이름 미제공'}
                </p>
                <p className="text-xs text-gray-500">{cancelTarget._jobTitle}</p>
              </div>
            </div>

            {/* 경고 메시지 / Warning message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-xs text-yellow-800">
                면접을 취소하면 지원자에게 취소 알림이 발송됩니다.
                <br />
                Cancelling will send a notification to the applicant.
              </p>
            </div>

            {/* 취소 사유 선택 / Cancel reason selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <span className="text-red-500">*</span> 취소 사유 / Reason
              </label>
              <div className="relative">
                <select
                  value={cancelForm.reason}
                  onChange={(e) =>
                    setCancelForm((f) => ({
                      ...f,
                      reason: e.target.value as EmployerCancelReason,
                      reasonDetail:
                        e.target.value !== 'OTHER' ? '' : f.reasonDetail,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                >
                  <option value="">사유를 선택하세요 / Select reason</option>
                  {CANCEL_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 기타 사유 상세 (OTHER 선택 시) / Detail for OTHER reason */}
            {cancelForm.reason === 'OTHER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="text-red-500">*</span> 상세 사유 / Detail
                </label>
                <textarea
                  value={cancelForm.reasonDetail}
                  onChange={(e) =>
                    setCancelForm((f) => ({
                      ...f,
                      reasonDetail: e.target.value,
                    }))
                  }
                  placeholder="구체적인 취소 사유를 입력해주세요."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>
            )}

            {/* 제출 버튼 / Submit button */}
            <button
              type="button"
              onClick={handleCancelSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Ban className="w-4 h-4" />
              )}
              면접 취소하기 / Cancel Interview
            </button>
          </div>
        )}
      </ModalOverlay>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 결과 통보 모달 / Send Result Modal                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <ModalOverlay
        open={!!resultTarget}
        onClose={() => {
          if (!submitting) {
            setResultTarget(null);
            setResultForm(INITIAL_RESULT_FORM);
          }
        }}
        title="결과 통보 / Send Result"
      >
        {resultTarget && (
          <div className="space-y-5">
            {/* 대상 정보 / Target info */}
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {resultTarget.applicant?.realName || '이름 미제공'}
                </p>
                <p className="text-xs text-gray-500">{resultTarget._jobTitle}</p>
              </div>
            </div>

            {/* 결과 토글: 합격/불합격 / Result toggle: Accept/Reject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                결과 선택 / Result
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setResultForm((f) => ({ ...f, result: 'ACCEPTED' }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition ${
                    resultForm.result === 'ACCEPTED'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  합격
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setResultForm((f) => ({ ...f, result: 'REJECTED' }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition ${
                    resultForm.result === 'REJECTED'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                  }`}
                >
                  <X className="w-4 h-4" />
                  불합격
                </button>
              </div>
            </div>

            {/* 합격 시: 추가 안내 (출근일, 준비서류 등) / When accepted: additional info */}
            {resultForm.result === 'ACCEPTED' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  추가 안내 사항 / Additional Info
                  <span className="text-xs text-gray-400 ml-1">(출근일, 준비서류 등)</span>
                </label>
                <textarea
                  value={resultForm.additionalInfo}
                  onChange={(e) =>
                    setResultForm((f) => ({
                      ...f,
                      additionalInfo: e.target.value,
                    }))
                  }
                  placeholder="3월 10일 오전 9시 출근, 여권/외국인등록증 사본 지참"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            )}

            {/* 불합격 시: 불합격 사유 / When rejected: rejection reason */}
            {resultForm.result === 'REJECTED' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  불합격 사유 / Rejection Reason
                </label>
                <textarea
                  value={resultForm.rejectionReason}
                  onChange={(e) =>
                    setResultForm((f) => ({
                      ...f,
                      rejectionReason: e.target.value,
                    }))
                  }
                  placeholder="아쉽게도 이번 채용에서는 다른 후보자를 선발하게 되었습니다."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            )}

            {/* 추가 메시지 (합격/불합격 공통) / Additional message (both) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                추가 메시지 / Message
                <span className="text-xs text-gray-400 ml-1">(선택)</span>
              </label>
              <textarea
                value={resultForm.message}
                onChange={(e) =>
                  setResultForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="지원자에게 전달할 추가 메시지를 입력하세요."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 제출 버튼 / Submit button */}
            <button
              type="button"
              onClick={handleResultSubmit}
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 py-3 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed ${
                resultForm.result === 'ACCEPTED'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : resultForm.result === 'ACCEPTED' ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              {resultForm.result === 'ACCEPTED'
                ? '합격 통보 전송 / Send Acceptance'
                : '불합격 통보 전송 / Send Rejection'}
            </button>
          </div>
        )}
      </ModalOverlay>
    </div>
  );
}
