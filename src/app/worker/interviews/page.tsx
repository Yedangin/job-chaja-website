'use client';

/**
 * 면접 일정 페이지 / Interview Schedule page
 * - 면접 제안 수락/거절, 확정 면접 관리, 면접 결과 확인
 * - Accept/reject interview proposals, manage confirmed interviews, view results
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Loader2,
  Building2,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Copy,
  ExternalLink,
  AlertCircle,
  PartyPopper,
  Navigation,
  Package,
  LogIn,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

// ── 타입 정의 / Type definitions ──────────────────────────────────────────────

/** 면접 관련 지원 상태 / Interview-related application statuses */
type InterviewStatus =
  | 'INTERVIEW_REQUESTED'
  | 'COORDINATION_NEEDED'
  | 'CONFIRMED'
  | 'INTERVIEW_SCHEDULED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

/** 면접 방식 / Interview method */
type InterviewMethod = 'ONLINE' | 'OFFLINE';

/** 공고 보드 유형 / Job board type */
type BoardType = 'PART_TIME' | 'FULL_TIME';

/** 제안자 유형 / Who proposed the interview */
type ActorType = 'EMPLOYER' | 'APPLICANT';

/** 공고 정보 / Job info within application */
interface ApplicationJob {
  id: string;
  title: string;
  boardType: BoardType;
  tierType: string;
  status: string;
  displayAddress: string | null;
  allowedVisas: string[];
  companyName: string;
  logoImageUrl: string | null;
}

/** 지원 항목 (면접 필드 포함) / Single application entry with interview fields */
interface Application {
  id: string;
  status: InterviewStatus;
  applicationMethod: string;
  coverLetter: string | null;
  selfReportedAt: string | null;
  interviewDate: string | null;
  interviewNote: string | null;
  rejectionReason: string | null;
  resultNotifiedAt: string | null;
  createdAt: string;
  // 면접 제안 필드 / Interview proposal fields
  interviewMethod: InterviewMethod | null;
  interviewFirstChoice: string | null;
  interviewSecondChoice: string | null;
  interviewLocation: string | null;
  interviewLink: string | null;
  interviewDirections: string | null;
  interviewWhatToBring: string | null;
  proposedBy: ActorType | null;
  proposedTime: string | null;
  // 취소 정보 / Cancellation info
  cancelReason: string | null;
  cancelledBy: ActorType | null;
  cancelledAt: string | null;
  // 공고 정보 / Job info
  job: ApplicationJob;
}

/** 필터 탭 키 / Filter tab key */
type TabKey = 'all' | 'requested' | 'confirmed' | 'result' | 'cancelled';

/** 구직자 면접 취소 사유 / Applicant cancellation reasons */
const APPLICANT_CANCEL_REASONS = [
  { value: 'PERSONAL_REASON', label: '개인 사정 / Personal reason' },
  { value: 'OTHER_JOB_ACCEPTED', label: '다른 회사 취업 / Accepted another job' },
  { value: 'SCHEDULE_CONFLICT', label: '일정 불가 / Schedule conflict' },
  { value: 'OTHER', label: '기타 / Other' },
] as const;

// ── 필터 탭 정의 / Filter tab definitions ─────────────────────────────────────

const FILTER_TABS: { key: TabKey; label: string; labelEn: string }[] = [
  { key: 'all', label: '전체', labelEn: 'All' },
  { key: 'requested', label: '제안받음', labelEn: 'Proposed' },
  { key: 'confirmed', label: '확정', labelEn: 'Confirmed' },
  { key: 'result', label: '결과', labelEn: 'Result' },
  { key: 'cancelled', label: '취소', labelEn: 'Cancelled' },
];

// ── 유틸 함수 / Utility functions ─────────────────────────────────────────────

/**
 * 면접 관련 상태인지 판별 / Check if status is interview-related
 * PENDING, REVIEWING은 면접과 무관하므로 제외
 * Excludes PENDING, REVIEWING as they are pre-interview statuses
 */
function isInterviewRelated(status: string): boolean {
  return [
    'INTERVIEW_REQUESTED',
    'COORDINATION_NEEDED',
    'CONFIRMED',
    'INTERVIEW_SCHEDULED',
    'ACCEPTED',
    'REJECTED',
    'CANCELLED',
  ].includes(status);
}

/**
 * 탭에 해당하는 상태들 / Statuses belonging to each tab
 */
function getStatusesForTab(tab: TabKey): string[] {
  switch (tab) {
    case 'requested':
      return ['INTERVIEW_REQUESTED', 'COORDINATION_NEEDED'];
    case 'confirmed':
      return ['CONFIRMED', 'INTERVIEW_SCHEDULED'];
    case 'result':
      return ['ACCEPTED', 'REJECTED'];
    case 'cancelled':
      return ['CANCELLED'];
    default:
      return [];
  }
}

/**
 * 날짜/시간 한국어 포맷 / Format date+time in Korean locale
 */
function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

/**
 * 날짜만 포맷 / Format date only
 */
function formatDate(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '-';
  }
}

// ── 로딩 스켈레톤 카드 / Loading skeleton card ───────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
          <div className="h-5 w-52 bg-gray-200 rounded mb-3" />
          <div className="h-20 w-full bg-gray-100 rounded-xl mb-3" />
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-gray-200 rounded-lg" />
            <div className="h-9 w-24 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 상태 요약 바 / Status summary bar ─────────────────────────────────────────

interface SummaryBarProps {
  applications: Application[];
}

function SummaryBar({ applications }: SummaryBarProps) {
  const summaryItems = [
    {
      label: '전체',
      labelEn: 'Total',
      count: applications.length,
      color: 'border-gray-200 bg-gray-50',
      textColor: 'text-gray-800',
    },
    {
      label: '제안받음',
      labelEn: 'Proposed',
      count: applications.filter(
        (a) => a.status === 'INTERVIEW_REQUESTED' || a.status === 'COORDINATION_NEEDED'
      ).length,
      color: 'border-orange-200 bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      label: '면접확정',
      labelEn: 'Confirmed',
      count: applications.filter(
        (a) => a.status === 'CONFIRMED' || a.status === 'INTERVIEW_SCHEDULED'
      ).length,
      color: 'border-blue-200 bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: '결과',
      labelEn: 'Result',
      count: applications.filter(
        (a) => a.status === 'ACCEPTED' || a.status === 'REJECTED'
      ).length,
      color: 'border-green-200 bg-green-50',
      textColor: 'text-green-700',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {summaryItems.map((item) => (
        <div
          key={item.label}
          className={`rounded-xl border ${item.color} p-3 text-center`}
        >
          <p className={`text-2xl font-bold ${item.textColor}`}>{item.count}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

// ── 면접 방식 배지 / Interview method badge ───────────────────────────────────

function InterviewMethodBadge({ method }: { method: InterviewMethod | null }) {
  if (!method) return null;

  if (method === 'ONLINE') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
        <Video className="w-3 h-3" />
        온라인
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
      <MapPin className="w-3 h-3" />
      오프라인
    </span>
  );
}

// ── 면접 장소/링크 정보 / Interview location/link info ─────────────────────────

function InterviewVenueInfo({ app }: { app: Application }) {
  const { interviewMethod, interviewLocation, interviewLink, interviewDirections, interviewWhatToBring } = app;

  return (
    <div className="space-y-2 text-sm">
      {/* 온라인 미팅 링크 / Online meeting link */}
      {interviewMethod === 'ONLINE' && interviewLink && (
        <div className="flex items-start gap-2 text-gray-600">
          <Video className="w-4 h-4 mt-0.5 shrink-0 text-indigo-500" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">미팅 링크 / Meeting Link</p>
            <a
              href={interviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all flex items-center gap-1"
            >
              {interviewLink}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>
      )}

      {/* 오프라인 장소 / Offline location */}
      {interviewMethod === 'OFFLINE' && interviewLocation && (
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="text-xs text-gray-400 mb-0.5">면접 장소 / Interview Location</p>
            <p className="text-gray-700">{interviewLocation}</p>
          </div>
        </div>
      )}

      {/* 오시는 길 / Directions */}
      {interviewDirections && (
        <div className="flex items-start gap-2 text-gray-600">
          <Navigation className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400 mb-0.5">오시는 길 / Directions</p>
            <p className="text-gray-600 whitespace-pre-line">{interviewDirections}</p>
          </div>
        </div>
      )}

      {/* 준비물 / What to bring */}
      {interviewWhatToBring && (
        <div className="flex items-start gap-2 text-gray-600">
          <Package className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400 mb-0.5">준비물 / What to Bring</p>
            <p className="text-gray-600 whitespace-pre-line">{interviewWhatToBring}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 면접 제안 카드 (INTERVIEW_REQUESTED) / Interview proposal card ────────────

interface ProposalCardProps {
  app: Application;
  onAccept: (id: string, choice: 'FIRST' | 'SECOND') => void;
  onReject: (id: string) => void;
  isProcessing: boolean;
}

function InterviewProposalCard({ app, onAccept, onReject, isProcessing }: ProposalCardProps) {
  const { job, interviewMethod, interviewFirstChoice, interviewSecondChoice } = app;

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-sm">
      {/* 카드 헤더 / Card header */}
      <div className="flex items-start gap-4 mb-4">
        {/* 회사 로고 / Company logo */}
        <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          {job.logoImageUrl ? (
            <Image
              src={job.logoImageUrl}
              alt={job.companyName}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <Building2 className="w-6 h-6 text-gray-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-700 truncate">{job.companyName}</p>
            <div className="flex items-center gap-2 shrink-0">
              <InterviewMethodBadge method={interviewMethod} />
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                <AlertCircle className="w-3 h-3" />
                응답 대기
              </span>
            </div>
          </div>
          <Link
            href={`/worker/jobs/${job.id}`}
            className="text-base font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2 block"
          >
            {job.title}
          </Link>
        </div>
      </div>

      {/* 제안된 면접 일시 / Proposed interview times */}
      <div className="bg-orange-50 rounded-xl p-4 mb-4 space-y-3">
        <p className="text-xs font-semibold text-orange-600 mb-2">
          제안된 면접 일시 / Proposed Interview Times
        </p>

        {/* 1순위 / First choice */}
        {interviewFirstChoice && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-200 text-orange-700 text-xs font-bold shrink-0">
              1
            </span>
            <Clock className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-sm font-medium text-gray-800">
              {formatDateTime(interviewFirstChoice)}
            </span>
          </div>
        )}

        {/* 2순위 / Second choice */}
        {interviewSecondChoice && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-200 text-orange-700 text-xs font-bold shrink-0">
              2
            </span>
            <Clock className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="text-sm font-medium text-gray-700">
              {formatDateTime(interviewSecondChoice)}
            </span>
          </div>
        )}
      </div>

      {/* 면접 장소/링크 정보 / Venue info */}
      <div className="mb-4">
        <InterviewVenueInfo app={app} />
      </div>

      {/* 액션 버튼 / Action buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-orange-100">
        {/* 1순위 수락 / Accept first choice */}
        <button
          type="button"
          onClick={() => onAccept(app.id, 'FIRST')}
          disabled={isProcessing || !interviewFirstChoice}
          className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          1순위 수락
        </button>

        {/* 2순위 수락 (2순위가 있을 때만) / Accept second choice (only if exists) */}
        {interviewSecondChoice && (
          <button
            type="button"
            onClick={() => onAccept(app.id, 'SECOND')}
            disabled={isProcessing}
            className="flex items-center gap-1.5 border border-blue-300 text-blue-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            2순위 수락
          </button>
        )}

        {/* 거절 / Reject */}
        <button
          type="button"
          onClick={() => onReject(app.id)}
          disabled={isProcessing}
          className="flex items-center gap-1.5 text-red-500 text-sm font-medium px-3 py-2.5 rounded-xl hover:bg-red-50 transition disabled:opacity-50 ml-auto"
        >
          <XCircle className="w-4 h-4" />
          거절
        </button>
      </div>
    </div>
  );
}

// ── 확정 면접 카드 (CONFIRMED / INTERVIEW_SCHEDULED) / Confirmed interview card ─

interface ConfirmedCardProps {
  app: Application;
  onCancelClick: (id: string) => void;
}

function ConfirmedInterviewCard({ app, onCancelClick }: ConfirmedCardProps) {
  const { job, interviewMethod, proposedTime, interviewDate, interviewLink } = app;

  // 확정 시간 = proposedTime (수락 시 선택된 시간) 또는 interviewDate
  // Confirmed time = proposedTime (selected at accept) or interviewDate
  const confirmedTime = proposedTime || interviewDate;

  /** 미팅 링크 복사 / Copy meeting link to clipboard */
  const handleCopyLink = async () => {
    if (!interviewLink) return;
    try {
      await navigator.clipboard.writeText(interviewLink);
      toast.success('미팅 링크가 복사되었습니다. / Meeting link copied.');
    } catch {
      toast.error('복사에 실패했습니다. / Copy failed.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-sm">
      {/* 카드 헤더 / Card header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          {job.logoImageUrl ? (
            <Image
              src={job.logoImageUrl}
              alt={job.companyName}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <Building2 className="w-6 h-6 text-gray-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-700 truncate">{job.companyName}</p>
            <div className="flex items-center gap-2 shrink-0">
              <InterviewMethodBadge method={interviewMethod} />
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                <CheckCircle2 className="w-3 h-3" />
                면접 확정
              </span>
            </div>
          </div>
          <Link
            href={`/worker/jobs/${job.id}`}
            className="text-base font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2 block"
          >
            {job.title}
          </Link>
        </div>
      </div>

      {/* 확정된 면접 일시 (눈에 띄게) / Confirmed interview time (prominent) */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <p className="text-xs font-semibold text-blue-600 mb-2">
          확정된 면접 일시 / Confirmed Interview Time
        </p>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-bold text-blue-800">
            {formatDateTime(confirmedTime)}
          </span>
        </div>
      </div>

      {/* 면접 장소/링크 정보 / Venue info */}
      <div className="mb-4">
        <InterviewVenueInfo app={app} />
      </div>

      {/* 액션 버튼 / Action buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-blue-100">
        {/* 온라인: 미팅 링크 복사 / Online: Copy meeting link */}
        {interviewMethod === 'ONLINE' && interviewLink && (
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition"
          >
            <Copy className="w-4 h-4" />
            미팅 링크 복사
          </button>
        )}

        {/* 면접 취소 / Cancel interview */}
        <button
          type="button"
          onClick={() => onCancelClick(app.id)}
          className="flex items-center gap-1.5 text-red-500 text-sm font-medium px-3 py-2.5 rounded-xl hover:bg-red-50 transition ml-auto"
        >
          <XCircle className="w-4 h-4" />
          면접 취소
        </button>
      </div>
    </div>
  );
}

// ── 결과 카드 (ACCEPTED / REJECTED) / Result card ─────────────────────────────

function ResultCard({ app }: { app: Application }) {
  const { job, status, interviewNote, rejectionReason, resultNotifiedAt } = app;
  const isAccepted = status === 'ACCEPTED';

  return (
    <div
      className={`rounded-2xl border-2 p-5 ${
        isAccepted
          ? 'bg-green-50 border-green-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      {/* 카드 헤더 / Card header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden">
          {job.logoImageUrl ? (
            <Image
              src={job.logoImageUrl}
              alt={job.companyName}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <Building2 className="w-6 h-6 text-gray-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-700 truncate">{job.companyName}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                isAccepted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isAccepted ? (
                <>
                  <PartyPopper className="w-3 h-3" />
                  합격
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  불합격
                </>
              )}
            </span>
          </div>
          <Link
            href={`/worker/jobs/${job.id}`}
            className="text-base font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2 block"
          >
            {job.title}
          </Link>
        </div>
      </div>

      {/* 결과 메시지 / Result message */}
      <div
        className={`rounded-xl p-4 ${
          isAccepted ? 'bg-green-100/50' : 'bg-gray-100'
        }`}
      >
        {isAccepted ? (
          <div>
            <p className="text-sm font-semibold text-green-800 mb-1">
              축하합니다! 면접에 합격하셨습니다.
            </p>
            <p className="text-xs text-green-600">
              Congratulations! You have passed the interview.
            </p>
            {/* 추가 안내 (interviewNote 활용) / Additional info from interviewNote */}
            {interviewNote && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <p className="text-xs text-green-600 mb-1">추가 안내 / Additional Info</p>
                <p className="text-sm text-green-800 whitespace-pre-line">{interviewNote}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              안타깝지만 이번에는 함께하지 못하게 되었습니다.
            </p>
            <p className="text-xs text-gray-500">
              Thank you for your interest. We wish you the best in your job search.
            </p>
            {/* 불합격 사유 / Rejection reason */}
            {rejectionReason && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-400 mb-1">사유 / Reason</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{rejectionReason}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 통보 일시 / Notification date */}
      {resultNotifiedAt && (
        <p className="text-xs text-gray-400 mt-3">
          통보일: {formatDate(resultNotifiedAt)}
        </p>
      )}
    </div>
  );
}

// ── 취소 카드 (CANCELLED) / Cancelled card ────────────────────────────────────

function CancelledCard({ app }: { app: Application }) {
  const { job, cancelReason, cancelledBy, cancelledAt } = app;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 opacity-75">
      {/* 카드 헤더 / Card header */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          {job.logoImageUrl ? (
            <Image
              src={job.logoImageUrl}
              alt={job.companyName}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <Building2 className="w-6 h-6 text-gray-300" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-500 truncate">{job.companyName}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 shrink-0">
              취소됨
            </span>
          </div>
          <Link
            href={`/worker/jobs/${job.id}`}
            className="text-base font-bold text-gray-500 hover:text-blue-600 transition line-clamp-2 block"
          >
            {job.title}
          </Link>
        </div>
      </div>

      {/* 취소 사유 / Cancel reason */}
      {(cancelReason || cancelledBy) && (
        <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-500">
          {cancelledBy && (
            <p className="text-xs text-gray-400 mb-1">
              {cancelledBy === 'EMPLOYER'
                ? '기업에 의해 취소됨 / Cancelled by employer'
                : '본인 취소 / Cancelled by you'}
            </p>
          )}
          {cancelReason && <p className="whitespace-pre-line">{cancelReason}</p>}
          {cancelledAt && (
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(cancelledAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── 면접 취소 모달 / Cancel interview modal ───────────────────────────────────

interface CancelModalProps {
  applicationId: string;
  onClose: () => void;
  onConfirm: (id: string, reason: string, reasonDetail?: string) => void;
  isProcessing: boolean;
}

function CancelInterviewModal({ applicationId, onClose, onConfirm, isProcessing }: CancelModalProps) {
  const [reason, setReason] = useState('');
  const [reasonDetail, setReasonDetail] = useState('');

  const handleSubmit = () => {
    if (!reason) {
      toast.error('취소 사유를 선택해주세요. / Please select a reason.');
      return;
    }
    if (reason === 'OTHER' && !reasonDetail.trim()) {
      toast.error('기타 사유를 입력해주세요. / Please enter a reason.');
      return;
    }
    onConfirm(applicationId, reason, reason === 'OTHER' ? reasonDetail.trim() : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">면접 취소</h3>
        <p className="text-sm text-gray-500 mb-5">Cancel Interview</p>

        {/* 취소 사유 드롭다운 / Reason dropdown */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          취소 사유 / Reason <span className="text-red-500">*</span>
        </label>
        <div className="relative mb-4">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">사유를 선택하세요 / Select reason</option>
            {APPLICANT_CANCEL_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* 기타 상세 입력 / Detail for OTHER reason */}
        {reason === 'OTHER' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 사유 / Detail <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              placeholder="취소 사유를 입력해주세요... / Please describe your reason..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* 버튼 / Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            닫기 / Close
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing || !reason}
            className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            면접 취소 확인
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 면접 거절 확인 모달 / Reject interview confirmation modal ──────────────────

interface RejectModalProps {
  applicationId: string;
  onClose: () => void;
  onConfirm: (id: string, reason: string, reasonDetail?: string) => void;
  isProcessing: boolean;
}

function RejectInterviewModal({ applicationId, onClose, onConfirm, isProcessing }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [reasonDetail, setReasonDetail] = useState('');

  const handleSubmit = () => {
    if (!reason) {
      toast.error('거절 사유를 선택해주세요. / Please select a reason.');
      return;
    }
    if (reason === 'OTHER' && !reasonDetail.trim()) {
      toast.error('기타 사유를 입력해주세요. / Please enter a reason.');
      return;
    }
    onConfirm(applicationId, reason, reason === 'OTHER' ? reasonDetail.trim() : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">면접 거절</h3>
        <p className="text-sm text-gray-500 mb-5">Decline Interview</p>

        {/* 거절 사유 드롭다운 / Reason dropdown */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          거절 사유 / Reason <span className="text-red-500">*</span>
        </label>
        <div className="relative mb-4">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">사유를 선택하세요 / Select reason</option>
            {APPLICANT_CANCEL_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* 기타 상세 입력 / Detail for OTHER reason */}
        {reason === 'OTHER' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 사유 / Detail <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              placeholder="거절 사유를 입력해주세요... / Please describe your reason..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* 버튼 / Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            닫기 / Close
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing || !reason}
            className="flex-1 bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            거절 확인
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 빈 상태 / Empty state ─────────────────────────────────────────────────────

function EmptyState({ activeTab }: { activeTab: TabKey }) {
  const isFiltered = activeTab !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8 text-purple-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        {isFiltered
          ? '해당 상태의 면접 일정이 없습니다'
          : '예정된 면접이 없습니다'}
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        {isFiltered
          ? '다른 필터를 선택하거나 전체 보기로 전환해보세요.'
          : '면접 일정이 확정되면 이 곳에서 확인할 수 있습니다.'}
        <br />
        {isFiltered
          ? 'Try a different filter or switch to All.'
          : 'Your scheduled interviews will appear here.'}
      </p>
      {!isFiltered && (
        <Link
          href="/worker/applications"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          내 지원현황 보기
        </Link>
      )}
    </div>
  );
}

// ── 미로그인 상태 / Not logged in state ───────────────────────────────────────

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
        로그인하여 면접 일정을 확인하세요.
        <br />
        Log in to view your interview schedule.
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
export default function WorkerInterviewsPage() {
  // 전체 면접 관련 지원 목록 / All interview-related applications
  const [applications, setApplications] = useState<Application[]>([]);
  // 로딩 상태 / Loading state
  const [loading, setLoading] = useState(true);
  // 에러 메시지 / Error message
  const [error, setError] = useState<string | null>(null);
  // 로그인 여부 / Whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // 활성 필터 탭 / Active filter tab
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  // 처리 중인 지원 ID / Currently processing application ID
  const [processingId, setProcessingId] = useState<string | null>(null);
  // 취소 모달 대상 ID / Cancel modal target application ID
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  // 거절 모달 대상 ID / Reject modal target application ID
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);

  // 면접 관련 지원 목록 로드 / Load interview-related applications
  const loadApplications = useCallback(async () => {
    try {
      // apiClient 사용, 프록시 경로 /api/applications/my 호출
      // Use apiClient, calls proxy route /api/applications/my
      const response = await apiClient.get('/applications/my', {
        params: { limit: 100 },
      });

      // apiClient 인터셉터가 자동 언래핑 → response.data가 실제 데이터
      // apiClient interceptor auto-unwraps → response.data is actual data
      const data = response.data;
      const items: Application[] = data?.items ?? data ?? [];

      // 면접 관련 상태만 필터링 / Filter to interview-related statuses only
      const interviewApps = items.filter((app) => isInterviewRelated(app.status));
      setApplications(interviewApps);
    } catch (err) {
      // 401: 미로그인 / 401: Not logged in
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        setIsLoggedIn(false);
        return;
      }
      setError(
        '면접 일정을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요. / Failed to load interview schedule.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // 면접 수락 핸들러 / Accept interview handler
  const handleAcceptInterview = async (applicationId: string, choice: 'FIRST' | 'SECOND') => {
    setProcessingId(applicationId);
    try {
      await apiClient.post(`/applications/${applicationId}/accept-interview`, {
        selectedChoice: choice,
      });

      toast.success(
        `면접이 확정되었습니다! (${choice === 'FIRST' ? '1순위' : '2순위'} 선택) / Interview confirmed!`
      );

      // 목록 다시 로드 / Reload the list
      await loadApplications();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '면접 수락에 실패했습니다.';
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  // 면접 거절(거절 모달 열기) / Open reject modal
  const handleOpenRejectModal = (applicationId: string) => {
    setRejectModalId(applicationId);
  };

  // 면접 거절 확인 / Confirm reject interview
  const handleRejectInterview = async (applicationId: string, reason: string, reasonDetail?: string) => {
    setProcessingId(applicationId);
    try {
      await apiClient.post(`/applications/${applicationId}/cancel-interview-applicant`, {
        reason,
        reasonDetail,
      });

      toast.success('면접을 거절했습니다. / Interview declined.');
      setRejectModalId(null);

      // 목록 다시 로드 / Reload the list
      await loadApplications();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '면접 거절에 실패했습니다.';
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  // 면접 취소 확인 / Confirm cancel interview
  const handleCancelInterview = async (applicationId: string, reason: string, reasonDetail?: string) => {
    setProcessingId(applicationId);
    try {
      await apiClient.post(`/applications/${applicationId}/cancel-interview-applicant`, {
        reason,
        reasonDetail,
      });

      toast.success('면접이 취소되었습니다. / Interview cancelled.');
      setCancelModalId(null);

      // 목록 다시 로드 / Reload the list
      await loadApplications();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '면접 취소에 실패했습니다.';
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  // 탭 기준 필터링 / Filter by active tab
  const filteredApplications = useMemo(() => {
    if (activeTab === 'all') return applications;
    const statuses = getStatusesForTab(activeTab);
    return applications.filter((a) => statuses.includes(a.status));
  }, [applications, activeTab]);

  // 탭별 카운트 / Count per tab
  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = {
      all: applications.length,
      requested: 0,
      confirmed: 0,
      result: 0,
      cancelled: 0,
    };
    for (const app of applications) {
      if (app.status === 'INTERVIEW_REQUESTED' || app.status === 'COORDINATION_NEEDED') {
        counts.requested++;
      } else if (app.status === 'CONFIRMED' || app.status === 'INTERVIEW_SCHEDULED') {
        counts.confirmed++;
      } else if (app.status === 'ACCEPTED' || app.status === 'REJECTED') {
        counts.result++;
      } else if (app.status === 'CANCELLED') {
        counts.cancelled++;
      }
    }
    return counts;
  }, [applications]);

  // ── 카드 렌더러 / Card renderer ─────────────────────────────────────────────
  const renderCard = (app: Application) => {
    switch (app.status) {
      case 'INTERVIEW_REQUESTED':
      case 'COORDINATION_NEEDED':
        return (
          <InterviewProposalCard
            key={app.id}
            app={app}
            onAccept={handleAcceptInterview}
            onReject={handleOpenRejectModal}
            isProcessing={processingId === app.id}
          />
        );
      case 'CONFIRMED':
      case 'INTERVIEW_SCHEDULED':
        return (
          <ConfirmedInterviewCard
            key={app.id}
            app={app}
            onCancelClick={(id) => setCancelModalId(id)}
          />
        );
      case 'ACCEPTED':
      case 'REJECTED':
        return <ResultCard key={app.id} app={app} />;
      case 'CANCELLED':
        return <CancelledCard key={app.id} app={app} />;
      default:
        return null;
    }
  };

  // ── 렌더링 / Render ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">면접 일정</h1>
          <p className="text-sm text-gray-500 mt-0.5">Interview Schedule</p>
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
              const count = tabCounts[tab.key];
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

          {/* 면접 카드 목록 / Interview cards */}
          {filteredApplications.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <div className="space-y-4">
              {filteredApplications.map(renderCard)}
            </div>
          )}
        </>
      )}

      {/* 면접 취소 모달 / Cancel interview modal */}
      {cancelModalId && (
        <CancelInterviewModal
          applicationId={cancelModalId}
          onClose={() => setCancelModalId(null)}
          onConfirm={handleCancelInterview}
          isProcessing={processingId === cancelModalId}
        />
      )}

      {/* 면접 거절 모달 / Reject interview modal */}
      {rejectModalId && (
        <RejectInterviewModal
          applicationId={rejectModalId}
          onClose={() => setRejectModalId(null)}
          onConfirm={handleRejectInterview}
          isProcessing={processingId === rejectModalId}
        />
      )}
    </div>
  );
}
