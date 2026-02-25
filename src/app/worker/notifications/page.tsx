'use client';

/**
 * 알림 센터 페이지 / Notification Center page
 * - 전체 / 지원채용 / 결제 / 시스템 탭 필터
 * - Tabs: All / Application & Hiring / Payment / System
 * - 단일 읽음 처리 (카드 클릭) + 전체 읽음 처리 버튼
 * - Mark single as read on click; "Mark all as read" button
 * - 페이지네이션 / Pagination
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Bell,
  LogIn,
  CheckCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ── 알림 유형 / Notification type ────────────────────────────────────────────
type NotifType =
  | 'APPLICATION_ALERT'   // 지원자 알림 (기업용) / Applicant alert (for companies)
  | 'INTERVIEW_UPDATE'    // 면접 업데이트 / Interview update
  | 'STATUS_ALERT'        // 합격/불합격 / Accepted / Rejected
  | 'REMINDER'            // 리마인더 / Reminder
  | 'PROMOTION'           // 프로모션 / Promotion
  | 'EMAIL_VERIFICATION'  // 이메일 인증 / Email verification
  | 'FINANCIAL_ALERT'     // 결제 알림 / Financial alert
  | 'SYSTEM';             // 시스템 / System

// ── 단일 알림 인터페이스 / Single notification interface ──────────────────────
interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string; // 클릭 시 이동할 경로 / Optional navigation link
}

// ── 페이지네이션 응답 / Paginated response ────────────────────────────────────
interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
}

// ── 탭 필터 정의 / Tab filter definitions ────────────────────────────────────
type TabKey = 'all' | 'job' | 'payment' | 'system';

interface TabDef {
  key: TabKey;
  label: string;
  types: NotifType[] | null; // null = 전체 / null = show all
}

const TABS: TabDef[] = [
  { key: 'all',     label: '전체',     types: null },
  { key: 'job',     label: '지원/채용', types: ['APPLICATION_ALERT', 'INTERVIEW_UPDATE', 'STATUS_ALERT', 'REMINDER'] },
  { key: 'payment', label: '결제',     types: ['FINANCIAL_ALERT', 'PROMOTION'] },
  { key: 'system',  label: '시스템',   types: ['EMAIL_VERIFICATION', 'SYSTEM'] },
];

// ── 유형별 아이콘 이모지 / Type-to-icon emoji mapping ────────────────────────
const TYPE_ICON: Record<NotifType, string> = {
  APPLICATION_ALERT:  '📋',
  INTERVIEW_UPDATE:   '📅',
  STATUS_ALERT:       '🎯',
  REMINDER:           '⏰',
  PROMOTION:          '🎁',
  EMAIL_VERIFICATION: '✉️',
  FINANCIAL_ALERT:    '💳',
  SYSTEM:             '🔔',
};

// ── 상대 시간 헬퍼 / Relative time helper ────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

// ── 로딩 스켈레톤 / Loading skeleton item ─────────────────────────────────────
function SkeletonItem() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        {/* 아이콘 자리 / Icon placeholder */}
        <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded shrink-0" />
          </div>
          <div className="h-3 w-full bg-gray-100 rounded mb-1.5" />
          <div className="h-3 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
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
        로그인하여 알림을 확인하세요.
        <br />
        Log in to view your notifications.
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

// ── 빈 상태 / Empty state ──────────────────────────────────────────────────────
function EmptyState({ activeTab }: { activeTab: TabKey }) {
  const isFiltered = activeTab !== 'all';
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Bell className="w-8 h-8 text-blue-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        {isFiltered ? '해당 카테고리의 알림이 없습니다' : '알림이 없습니다'}
      </h3>
      <p className="text-sm text-gray-400">
        {isFiltered
          ? '다른 탭을 선택해보세요. / Try a different tab.'
          : '새로운 알림이 오면 여기서 확인할 수 있습니다. / New notifications will appear here.'}
      </p>
    </div>
  );
}

// ── 알림 카드 내부 내용 / Notification card inner content ─────────────────────
interface NotificationCardProps {
  notif: Notification;
  onRead: (id: string) => void;
  marking: boolean;
}

function NotificationCard({ notif, onRead, marking }: NotificationCardProps) {
  const icon = TYPE_ICON[notif.type];

  const handleClick = () => {
    if (!notif.isRead) {
      onRead(notif.id);
    }
  };

  const innerContent = (
    <div
      onClick={handleClick}
      className={[
        'rounded-2xl border p-5 transition cursor-pointer',
        notif.isRead
          ? 'bg-gray-50 border-gray-200 hover:border-gray-300'
          : 'bg-white border-l-4 border-l-blue-500 border-t-gray-200 border-r-gray-200 border-b-gray-200 hover:shadow-sm',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        {/* 유형 아이콘 + 미읽음 점 / Type icon + unread dot */}
        <div className="relative shrink-0">
          <div
            className={[
              'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
              notif.isRead ? 'bg-gray-100' : 'bg-blue-50',
            ].join(' ')}
          >
            {icon}
          </div>
          {/* 미읽음 파란 점 / Unread blue dot */}
          {!notif.isRead && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* 알림 내용 / Notification content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            {/* 제목 / Title */}
            <p
              className={[
                'text-sm font-semibold truncate',
                notif.isRead ? 'text-gray-600' : 'text-gray-900',
              ].join(' ')}
            >
              {notif.title}
            </p>
            {/* 시간 + 마킹 스피너 / Time + marking spinner */}
            <div className="flex items-center gap-1.5 shrink-0">
              {marking && !notif.isRead && (
                <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
              )}
              <span className="text-xs text-gray-400">{timeAgo(notif.createdAt)}</span>
            </div>
          </div>
          {/* 메시지 / Message */}
          <p
            className={[
              'text-sm line-clamp-2',
              notif.isRead ? 'text-gray-400' : 'text-gray-600',
            ].join(' ')}
          >
            {notif.message}
          </p>
        </div>
      </div>
    </div>
  );

  // 링크가 있을 경우 Next.js Link로 감싸기 / Wrap with Next.js Link if link is provided
  if (notif.link) {
    return (
      <Link href={notif.link} className="block">
        {innerContent}
      </Link>
    );
  }

  return innerContent;
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function WorkerNotificationsPage() {
  // 알림 목록 / Notification list
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // 로딩 상태 / Loading state
  const [loading, setLoading] = useState(true);
  // 에러 메시지 / Error message
  const [error, setError] = useState<string | null>(null);
  // 로그인 여부 / Whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // 활성 탭 / Active tab
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  // 읽지 않은 알림 수 / Unread notification count
  const [unreadCount, setUnreadCount] = useState(0);
  // 전체 읽음 처리 중 / Marking all as read in progress
  const [markingAll, setMarkingAll] = useState(false);
  // 개별 읽음 처리 중인 알림 ID / ID of notification currently being marked as read
  const [markingId, setMarkingId] = useState<string | null>(null);
  // 현재 페이지 / Current page number
  const [page, setPage] = useState(1);
  // 전체 알림 수 / Total notification count
  const [total, setTotal] = useState(0);

  const LIMIT = 20;

  // ── 알림 목록 로드 / Load notifications list ─────────────────────────────────
  const loadNotifications = useCallback(async (targetPage: number) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      // 세션 없음 → 미로그인 처리 / No session → treat as not logged in
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/notifications?page=${targetPage}&limit=${LIMIT}`,
        { headers: { Authorization: `Bearer ${sessionId}` } }
      );

      if (!res.ok) {
        if (res.status === 401) {
          // 인증 만료 → 미로그인 상태로 전환 / Auth expired → switch to not-logged-in
          setIsLoggedIn(false);
        } else {
          const data = await res.json().catch(() => ({}));
          setError(
            (data as { message?: string }).message ||
              '알림을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
        return;
      }

      const data = await res.json() as NotificationsResponse | Notification[];
      // 응답 형태 유연하게 처리 (배열 or 페이지네이션 객체)
      // Handle flexible response shape (array or paginated object)
      const list: Notification[] = Array.isArray(data)
        ? data
        : (data.notifications ?? []);
      setNotifications(list);
      setTotal(Array.isArray(data) ? list.length : (data.total ?? list.length));
    } catch {
      // 네트워크 오류 / Network error
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── 읽지 않은 알림 수 로드 / Load unread count ──────────────────────────────
  const loadUnreadCount = useCallback(async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    try {
      const res = await fetch('/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${sessionId}` },
      });
      if (res.ok) {
        const data = await res.json() as { count: number };
        setUnreadCount(data.count ?? 0);
      }
    } catch {
      // 읽지 않은 수 로드 실패는 무시 / Silently ignore unread count failure
    }
  }, []);

  // 마운트 시 데이터 로드 / Load data on mount
  useEffect(() => {
    loadNotifications(1);
    loadUnreadCount();
  }, [loadNotifications, loadUnreadCount]);

  // ── 단일 알림 읽음 처리 / Mark single notification as read ──────────────────
  const handleRead = async (id: string) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    setMarkingId(id);
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${sessionId}` },
      });

      if (res.ok) {
        // 로컬 상태 즉시 업데이트 / Update local state immediately
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } finally {
      setMarkingId(null);
    }
  };

  // ── 전체 알림 읽음 처리 / Mark all notifications as read ────────────────────
  const handleReadAll = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId || unreadCount === 0) return;

    setMarkingAll(true);
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${sessionId}` },
      });

      if (res.ok) {
        // 전체 읽음으로 로컬 업데이트 / Update all notifications to read locally
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } finally {
      setMarkingAll(false);
    }
  };

  // ── 페이지 이동 / Page navigation ───────────────────────────────────────────
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadNotifications(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── 탭 기준 필터링 / Filter notifications by active tab ─────────────────────
  const activeDef = TABS.find((t) => t.key === activeTab) ?? TABS[0];
  const filteredNotifications =
    activeDef.types === null
      ? notifications
      : notifications.filter((n) => activeDef.types!.includes(n.type));

  const totalPages = Math.ceil(total / LIMIT);

  // ── 렌더링 / Render ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">알림</h1>
          <p className="text-sm text-gray-500 mt-0.5">Notifications</p>
        </div>
        {/* 읽지 않은 알림 수 + 전체 읽음 버튼 / Unread count + mark-all button */}
        {!loading && isLoggedIn && (
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="text-sm text-blue-600 font-medium">
                읽지 않은 알림 {unreadCount}개
              </span>
            )}
            <button
              type="button"
              onClick={handleReadAll}
              disabled={markingAll || unreadCount === 0}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {markingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              모두 읽음
            </button>
          </div>
        )}
      </div>

      {/* 로딩 스켈레톤 / Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {/* 탭 스켈레톤 / Tab skeleton */}
          <div className="flex gap-1 mb-5 animate-pulse">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-20 bg-gray-100 rounded-full" />
            ))}
          </div>
          {/* 알림 카드 스켈레톤 5개 / 5 notification card skeletons */}
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonItem key={i} />
          ))}
        </div>
      )}

      {/* 미로그인 상태 / Not logged in */}
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
          {/* 탭 필터 / Tab filters */}
          <div className="flex gap-1 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map((tab) => {
              // 탭별 카운트 계산 / Count per tab
              const count =
                tab.types === null
                  ? notifications.length
                  : notifications.filter((n) => tab.types!.includes(n.type)).length;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition shrink-0',
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
                  ].join(' ')}
                >
                  {tab.label}
                  {/* 카운트 뱃지 / Count badge */}
                  {count > 0 && (
                    <span
                      className={[
                        'text-xs rounded-full px-1.5 py-0.5 font-semibold',
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500',
                      ].join(' ')}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 알림 목록 / Notification list */}
          {filteredNotifications.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notif={notif}
                  onRead={handleRead}
                  marking={markingId === notif.id}
                />
              ))}
            </div>
          )}

          {/* 페이지네이션 / Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {/* 이전 페이지 버튼 / Previous page button */}
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </button>

              {/* 페이지 번호 버튼 / Page number buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  // 현재 페이지 앞뒤 2페이지만 표시 / Show only 2 pages around current
                  .filter((p) => Math.abs(p - page) <= 2)
                  .map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={[
                        'w-9 h-9 text-sm font-medium rounded-lg transition',
                        p === page
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
                      ].join(' ')}
                    >
                      {p}
                    </button>
                  ))}
              </div>

              {/* 다음 페이지 버튼 / Next page button */}
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
