'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar, List, ChevronLeft, ChevronRight, Check, X,
  Clock, MapPin, User, Briefcase, Loader2, RefreshCw,
  AlertCircle, Globe,
} from 'lucide-react';
import { toast } from 'sonner';

// ─────────────────────────────────────────────
// 타입 정의 / Type definitions
// ─────────────────────────────────────────────

/** 공고 정보 (목록 조회용) / Job posting (for list fetch) */
interface JobPosting {
  id: number;
  title: string;
  status: string;
}

/** 지원서 API 응답 원시 타입 / Raw application API response */
interface RawApplication {
  id: string;
  status: string;
  interviewDate?: string;
  interviewNote?: string;
  appliedAt: string;
  applicant?: {
    name?: string;
    visaType?: string;
    nationality?: string;
  };
  user?: {
    name?: string;
  };
}

/** 면접 지원자 집계 타입 / Aggregated interview applicant type */
interface InterviewApplicant {
  id: string;
  status: 'INTERVIEW_SCHEDULED';
  interviewDate?: string;   // ISO 날짜 문자열 / ISO date string
  interviewNote?: string;   // 면접 장소/메모 / Interview note/location
  appliedAt: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantVisaType?: string;
  applicantNationality?: string;
}

/** 뷰 모드 / View mode toggle */
type ViewMode = 'list' | 'weekly';

/** 목록 보기 기간 필터 / List view period filter */
type PeriodFilter = 'thisWeek' | 'nextWeek' | 'all';

// ─────────────────────────────────────────────
// 헬퍼 함수 / Helper functions
// ─────────────────────────────────────────────

/**
 * 날짜별 면접 그룹핑 / Group interviews by date
 */
function groupByDate(interviews: InterviewApplicant[]): Record<string, InterviewApplicant[]> {
  return interviews.reduce((acc, iv) => {
    const date = iv.interviewDate
      ? new Date(iv.interviewDate).toDateString()
      : '날짜 미정';
    if (!acc[date]) acc[date] = [];
    acc[date].push(iv);
    return acc;
  }, {} as Record<string, InterviewApplicant[]>);
}

/**
 * 날짜 문자열을 한국어 형식으로 포맷 / Format date string to Korean format
 * e.g. "Fri Feb 28 2025" → "2025년 02월 28일 (금)"
 */
function formatKoreanDate(dateStr: string): string {
  if (dateStr === '날짜 미정') return dateStr;
  const date = new Date(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const dow = days[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dow})`;
}

/**
 * 시간 포맷 (HH:MM AM/PM) / Format time from ISO string
 */
function formatTime(isoStr?: string): string {
  if (!isoStr) return '--:--';
  const date = new Date(isoStr);
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

/**
 * 이번 주 / 다음 주 날짜 범위 계산 / Calculate this week / next week date range
 */
function getWeekRange(offset: 0 | 1): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay(); // 0=일, 1=월 ... 6=토
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - day + (day === 0 ? -6 : 1)); // 월요일 기준
  startOfWeek.setHours(0, 0, 0, 0);

  const weekStart = new Date(startOfWeek);
  weekStart.setDate(weekStart.getDate() + offset * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { start: weekStart, end: weekEnd };
}

/**
 * 기간 필터에 따른 면접 목록 필터링 / Filter interviews by period
 */
function filterByPeriod(interviews: InterviewApplicant[], period: PeriodFilter): InterviewApplicant[] {
  if (period === 'all') return interviews;

  const offset = period === 'thisWeek' ? 0 : 1;
  const { start, end } = getWeekRange(offset);

  return interviews.filter((iv) => {
    if (!iv.interviewDate) return false;
    const d = new Date(iv.interviewDate);
    return d >= start && d <= end;
  });
}

// ─────────────────────────────────────────────
// 주간 보기 헬퍼 / Weekly view helpers
// ─────────────────────────────────────────────

/** 주간 날짜 배열(월~일) 생성 / Generate week day array (Mon~Sun) */
function getWeekDays(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() - day + (day === 0 ? -6 : 1));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// ─────────────────────────────────────────────
// 로딩 스켈레톤 / Loading skeleton
// ─────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
          {/* 날짜 헤더 스켈레톤 / Date header skeleton */}
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          {/* 아이템 스켈레톤 / Item skeleton */}
          <div className="space-y-3">
            {[1, 2].map((j) => (
              <div key={j} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-48 bg-gray-100 rounded animate-pulse mb-1" />
                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <div className="h-7 w-16 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-7 w-16 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트 / Main component
// ─────────────────────────────────────────────

/**
 * 면접 일정 관리 페이지 / Interview Schedule Management Page
 *
 * 전략: 전용 면접 엔드포인트 없음 → 공고 목록 조회 후 각 공고별 지원자 조회하여
 * INTERVIEW_SCHEDULED 상태만 집계
 *
 * Strategy: No dedicated interview endpoint → fetch jobs list, then fetch
 * applicants per job, and aggregate only INTERVIEW_SCHEDULED status ones.
 */
export default function InterviewsPage() {
  // ── 상태 / State ──────────────────────────────
  const [interviews, setInterviews] = useState<InterviewApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('thisWeek');

  // 주간 보기 상태 / Weekly view state
  const [weekBase, setWeekBase] = useState<Date>(new Date());
  const [selectedWeekDay, setSelectedWeekDay] = useState<string | null>(null);

  // 상태 업데이트 진행 중 ID 추적 / Track in-progress status update IDs
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  // ── 데이터 로드 / Data loading ─────────────────

  /**
   * 세션 ID 헤더 반환 / Return session ID header
   */
  const getAuthHeader = (): Record<string, string> => {
    const sessionId = localStorage.getItem('sessionId');
    return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
  };

  /**
   * 공고 목록 조회 / Fetch company job list
   */
  const fetchJobs = async (): Promise<JobPosting[]> => {
    const res = await fetch('/api/jobs/my/list?limit=100', {
      credentials: 'include',
      headers: getAuthHeader(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const raw: JobPosting[] = Array.isArray(data) ? data : data.jobs || data.data || [];
    // ACTIVE 공고만 최대 20개 / Only ACTIVE jobs, max 20
    return raw.filter((j) => j.status === 'ACTIVE').slice(0, 20);
  };

  /**
   * 특정 공고의 INTERVIEW_SCHEDULED 지원자 조회
   * Fetch INTERVIEW_SCHEDULED applicants for a specific job
   */
  const fetchJobInterviews = async (job: JobPosting): Promise<InterviewApplicant[]> => {
    try {
      const res = await fetch(`/api/applications/job/${job.id}?status=INTERVIEW_SCHEDULED&limit=100`, {
        credentials: 'include',
        headers: getAuthHeader(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      const applications: RawApplication[] = Array.isArray(data)
        ? data
        : data.applications || data.data || [];

      return applications
        .filter((app) => app.status === 'INTERVIEW_SCHEDULED')
        .map((app) => ({
          id: app.id,
          status: 'INTERVIEW_SCHEDULED' as const,
          interviewDate: app.interviewDate,
          interviewNote: app.interviewNote,
          appliedAt: app.appliedAt,
          jobId: String(job.id),
          jobTitle: job.title,
          applicantName:
            app.applicant?.name || app.user?.name || '이름 미제공',
          applicantVisaType: app.applicant?.visaType,
          applicantNationality: app.applicant?.nationality,
        }));
    } catch {
      // 특정 공고 조회 실패 시 빈 배열 반환 (전체 실패 방지)
      // Return empty array on individual job fetch failure (prevent full crash)
      return [];
    }
  };

  /**
   * 전체 면접 일정 로드 / Load all interview schedules
   */
  const loadInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const jobs = await fetchJobs();
      // 병렬 조회 / Parallel fetch
      const applicationSets = await Promise.all(
        jobs.map((job) => fetchJobInterviews(job))
      );
      const all = applicationSets.flat();
      // 면접 날짜 오름차순 정렬 / Sort by interview date ascending
      all.sort((a, b) => {
        if (!a.interviewDate) return 1;
        if (!b.interviewDate) return -1;
        return new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime();
      });
      setInterviews(all);
    } catch {
      toast.error('면접 일정을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  // ── 액션 / Actions ────────────────────────────

  /**
   * 지원자 상태 업데이트 (합격/불합격)
   * Update applicant status (accepted / rejected)
   */
  const updateStatus = async (
    applicantId: string,
    newStatus: 'ACCEPTED' | 'REJECTED'
  ) => {
    setUpdatingIds((prev) => new Set(prev).add(applicantId));
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch(`/api/applications/${applicantId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // 낙관적 로컬 상태 업데이트 / Optimistic local state update
        setInterviews((prev) => prev.filter((iv) => iv.id !== applicantId));
        toast.success(
          newStatus === 'ACCEPTED' ? '합격 처리되었습니다.' : '불합격 처리되었습니다.'
        );
      } else {
        toast.error('상태 업데이트에 실패했습니다.');
      }
    } catch {
      toast.error('네트워크 오류가 발생했습니다.');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(applicantId);
        return next;
      });
    }
  };

  // ── 렌더 / Render helpers ──────────────────────

  /**
   * 면접 카드 / Interview card
   */
  const InterviewCard = ({ iv }: { iv: InterviewApplicant }) => {
    const isUpdating = updatingIds.has(iv.id);
    return (
      <div className="border border-gray-100 rounded-lg p-4 hover:border-blue-100 hover:bg-blue-50/30 transition">
        <div className="flex items-start gap-3">
          {/* 아이콘 / Icon */}
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-blue-500" />
          </div>

          {/* 정보 / Info */}
          <div className="flex-1 min-w-0">
            {/* 이름 + 비자 / Name + visa */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">
                {iv.applicantName}
              </span>
              {iv.applicantVisaType && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
                  <Globe className="w-3 h-3" />
                  {iv.applicantVisaType}
                </span>
              )}
              {iv.applicantNationality && (
                <span className="text-xs text-gray-400">{iv.applicantNationality}</span>
              )}
            </div>

            {/* 공고명 / Job title */}
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <Briefcase className="w-3 h-3 shrink-0" />
              <span className="truncate">{iv.jobTitle}</span>
            </div>

            {/* 면접 시간 + 장소 / Interview time + location */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {iv.interviewDate && (
                <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <Clock className="w-3 h-3" />
                  {formatTime(iv.interviewDate)}
                </span>
              )}
              {iv.interviewNote && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate max-w-[200px]">{iv.interviewNote}</span>
                </span>
              )}
            </div>
          </div>

          {/* 액션 버튼 / Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isUpdating ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => updateStatus(iv.id, 'ACCEPTED')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition"
                  title="합격 처리 / Accept"
                >
                  <Check className="w-3 h-3" />
                  합격
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(iv.id, 'REJECTED')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-lg hover:bg-red-100 transition"
                  title="불합격 처리 / Reject"
                >
                  <X className="w-3 h-3" />
                  불합격
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── 목록 보기 / List view ──────────────────────
  const renderListView = () => {
    const filtered = filterByPeriod(interviews, periodFilter);
    const grouped = groupByDate(filtered);
    const dateKeys = Object.keys(grouped).sort((a, b) => {
      if (a === '날짜 미정') return 1;
      if (b === '날짜 미정') return -1;
      return new Date(a).getTime() - new Date(b).getTime();
    });

    const periodLabels: Record<PeriodFilter, string> = {
      thisWeek: '이번 주',
      nextWeek: '다음 주',
      all: '전체',
    };

    return (
      <>
        {/* 기간 필터 탭 / Period filter tabs */}
        <div className="flex gap-1 mb-6">
          {(Object.keys(periodLabels) as PeriodFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPeriodFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                periodFilter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {periodLabels[key]}
            </button>
          ))}
        </div>

        {/* 목록 / List */}
        {dateKeys.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {dateKeys.map((dateKey) => (
              <div key={dateKey} className="bg-white rounded-xl border border-gray-200 p-5">
                {/* 날짜 헤더 / Date header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {formatKoreanDate(dateKey)}
                  </h3>
                  <span className="ml-auto text-xs text-gray-400">
                    {grouped[dateKey].length}건
                  </span>
                </div>
                <div className="space-y-3">
                  {grouped[dateKey].map((iv) => (
                    <InterviewCard key={iv.id} iv={iv} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  // ── 주간 보기 / Weekly view ────────────────────
  const renderWeeklyView = () => {
    const weekDays = getWeekDays(weekBase);
    const korDays = ['월', '화', '수', '목', '금', '토', '일'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 요일별 면접 수 계산 / Count interviews per weekday
    const countByDay = weekDays.map((dayDate) => {
      const dayStr = dayDate.toDateString();
      return interviews.filter(
        (iv) => iv.interviewDate && new Date(iv.interviewDate).toDateString() === dayStr
      ).length;
    });

    // 선택된 날의 면접 / Interviews for selected day
    const selectedDayInterviews = selectedWeekDay
      ? interviews.filter(
          (iv) =>
            iv.interviewDate &&
            new Date(iv.interviewDate).toDateString() === selectedWeekDay
        )
      : [];

    // 주간 범위 레이블 / Week range label
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];
    const weekLabel = `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 ~ ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`;

    return (
      <>
        {/* 주 탐색 / Week navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => {
              const prev = new Date(weekBase);
              prev.setDate(prev.getDate() - 7);
              setWeekBase(prev);
              setSelectedWeekDay(null);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            title="이전 주 / Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-700">{weekLabel}</span>
          <button
            type="button"
            onClick={() => {
              const next = new Date(weekBase);
              next.setDate(next.getDate() + 7);
              setWeekBase(next);
              setSelectedWeekDay(null);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            title="다음 주 / Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 요일 격자 / Weekday grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {weekDays.map((dayDate, i) => {
            const dayStr = dayDate.toDateString();
            const isToday = dayDate.getTime() === today.getTime();
            const isSelected = selectedWeekDay === dayStr;
            const count = countByDay[i];

            return (
              <button
                key={dayStr}
                type="button"
                onClick={() => setSelectedWeekDay(isSelected ? null : dayStr)}
                className={`flex flex-col items-center py-3 px-1 rounded-xl border transition ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isToday
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <span className="text-xs font-medium">{korDays[i]}</span>
                <span className={`text-sm font-bold mt-0.5 ${isSelected ? 'text-white' : ''}`}>
                  {dayDate.getDate()}
                </span>
                {/* 면접 수 표시 / Interview count indicator */}
                {count > 0 ? (
                  <span
                    className={`mt-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                      isSelected
                        ? 'bg-white text-blue-600'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {count}
                  </span>
                ) : (
                  <span className="mt-1.5 w-5 h-5" />
                )}
              </button>
            );
          })}
        </div>

        {/* 선택된 날 면접 목록 / Selected day interview list */}
        {selectedWeekDay ? (
          selectedDayInterviews.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <Calendar className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-gray-900 text-sm">
                  {formatKoreanDate(selectedWeekDay)}
                </h3>
                <span className="ml-auto text-xs text-gray-400">
                  {selectedDayInterviews.length}건
                </span>
              </div>
              <div className="space-y-3">
                {selectedDayInterviews.map((iv) => (
                  <InterviewCard key={iv.id} iv={iv} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">해당 날짜에 면접 일정이 없습니다.</p>
              <p className="text-xs text-gray-300 mt-1">No interviews scheduled for this day.</p>
            </div>
          )
        ) : (
          <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-400">요일을 선택하면 면접 일정을 확인할 수 있습니다.</p>
            <p className="text-xs text-gray-300 mt-1">Click a day to view scheduled interviews.</p>
          </div>
        )}
      </>
    );
  };

  // ── 빈 상태 / Empty state ──────────────────────
  const EmptyState = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-7 h-7 text-blue-400" />
      </div>
      <h3 className="font-semibold text-gray-700 mb-2">예정된 면접이 없습니다</h3>
      <p className="text-xs text-gray-400 mb-5">No interviews scheduled.</p>
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>지원자 관리 페이지에서 면접 일정을 설정할 수 있습니다.</span>
      </div>
      <Link
        href="/company/applicants"
        className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        지원자 관리로 이동
      </Link>
    </div>
  );

  // ── 메인 렌더 / Main render ────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">면접 일정</h1>
          <p className="text-sm text-gray-400 mt-0.5">Interview Schedule</p>
        </div>
        <button
          type="button"
          onClick={loadInterviews}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          title="새로고침 / Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 뷰 전환 버튼 / View toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          <List className="w-4 h-4" />
          목록 보기
        </button>
        <button
          type="button"
          onClick={() => setViewMode('weekly')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            viewMode === 'weekly'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          주간 보기
        </button>
      </div>

      {/* 전체 면접 수 요약 / Total interview count summary */}
      {!loading && interviews.length > 0 && (
        <div className="flex items-center gap-2 mb-4 px-1">
          <span className="text-xs text-gray-500">
            총 <span className="font-semibold text-blue-600">{interviews.length}</span>건의 면접 일정
          </span>
        </div>
      )}

      {/* 컨텐츠 / Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : interviews.length === 0 && viewMode === 'list' ? (
        <EmptyState />
      ) : viewMode === 'list' ? (
        renderListView()
      ) : (
        renderWeeklyView()
      )}
    </div>
  );
}
