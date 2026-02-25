'use client';

/**
 * 결제 내역 페이지 / Payment history page
 * - 결제 주문 목록 조회, 상태별 필터, 취소 기능
 * - Lists payment orders with status filtering and cancellation support
 * - 결제 후 7일 이내만 취소 가능 / Only cancellable within 7 days of payment
 * - 취소 확인 시 인라인 환불 안내 표시 / Inline refund info shown on cancel confirm
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Loader2,
  LogIn,
  Receipt,
  XCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  Smartphone,
  Ban,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

// ── 타입 정의 / Type definitions ──────────────────────────────────────────────

// 결제 상태 타입 / Payment status type
type OrderStatus = 'PAID' | 'PENDING' | 'CANCELLED' | 'FAILED';

// 결제 주문 / Payment order
interface Order {
  id: string;
  orderName: string;       // 상품명 / Product name
  amount: number;          // 결제 금액 (원) / Amount in KRW
  status: OrderStatus;     // 결제 상태 / Payment status
  paymentMethod?: string;  // 결제 수단 / Payment method
  paidAt?: string;         // 결제 완료 시각 / Paid at
  cancelledAt?: string;    // 취소 시각 / Cancelled at
  createdAt: string;       // 생성 시각 / Created at
  jobId?: string;          // 관련 공고 ID / Related job ID
  jobTitle?: string;       // 관련 공고 제목 / Related job title
}

// 주문 목록 API 응답 / Order list API response
interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// ── 상수 정의 / Constants ──────────────────────────────────────────────────────

const PAGE_LIMIT = 10; // 페이지당 항목 수 / Items per page
const CANCEL_WINDOW_DAYS = 7; // 취소 가능 기간(일) / Cancellation window in days

// 상태별 배지/아이콘 설정 / Status badge and icon config
const STATUS_CONFIG: Record<
  OrderStatus,
  {
    labelKo: string;
    labelEn: string;
    color: string;
    bgColor: string;
    icon: React.FC<{ className?: string }>;
  }
> = {
  PAID: {
    labelKo: '결제완료',
    labelEn: 'Paid',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: CheckCircle2,
  },
  PENDING: {
    labelKo: '처리중',
    labelEn: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: Clock,
  },
  CANCELLED: {
    labelKo: '취소됨',
    labelEn: 'Cancelled',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    icon: XCircle,
  },
  FAILED: {
    labelKo: '실패',
    labelEn: 'Failed',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: AlertCircle,
  },
};

// 필터 탭 / Filter tabs
const FILTER_TABS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'PAID', label: '결제완료' },
  { key: 'CANCELLED', label: '취소됨' },
  { key: 'FAILED', label: '실패' },
];

// ── 유틸리티 함수 / Utility functions ──────────────────────────────────────────

/**
 * 금액을 원화 포맷으로 변환 / Format amount to Korean won format
 * ex) 50000 → "50,000원"
 */
function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/**
 * ISO 날짜를 "YYYY.MM.DD HH:mm" 형식으로 변환 / Format ISO date to "YYYY.MM.DD HH:mm"
 */
function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '-';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}.${m}.${day} ${hh}:${mm}`;
}

/**
 * "YYYY년 M월" 형식의 그룹 키 반환 / Return group key in "YYYY년 M월" format
 */
function getMonthGroupKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

/**
 * 주문 목록을 월별로 그룹핑 / Group orders by month
 */
function groupOrdersByMonth(orders: Order[]): { month: string; orders: Order[] }[] {
  const map = new Map<string, Order[]>();

  for (const order of orders) {
    const key = getMonthGroupKey(order.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(order);
  }

  return Array.from(map.entries()).map(([month, items]) => ({
    month,
    orders: items,
  }));
}

/**
 * 결제 수단 표시명 / Payment method display name
 */
function formatPaymentMethod(method: string | undefined): string {
  if (!method) return '-';
  const map: Record<string, string> = {
    card: '신용/체크카드',
    CARD: '신용/체크카드',
    kakao_pay: '카카오페이',
    KAKAO_PAY: '카카오페이',
    naver_pay: '네이버페이',
    NAVER_PAY: '네이버페이',
    toss_pay: '토스페이',
    TOSS_PAY: '토스페이',
    virtual_account: '가상계좌',
    VIRTUAL_ACCOUNT: '가상계좌',
    bank_transfer: '계좌이체',
    BANK_TRANSFER: '계좌이체',
    phone: '휴대폰결제',
    PHONE: '휴대폰결제',
  };
  return map[method] ?? method;
}

/**
 * 결제 취소 가능 여부 판단 / Determine if order is cancellable
 * - PAID 상태이면서 결제일로부터 7일 이내 / PAID status and within 7 days of payment
 */
function canCancel(order: Order): boolean {
  if (order.status !== 'PAID') return false;
  const paidAt = new Date(order.paidAt ?? order.createdAt);
  const daysSincePaid = (Date.now() - paidAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSincePaid <= CANCEL_WINDOW_DAYS;
}

/**
 * 결제일로부터 경과 일수 / Days elapsed since payment
 */
function daysSincePaid(order: Order): number {
  const paidAt = new Date(order.paidAt ?? order.createdAt);
  return Math.floor((Date.now() - paidAt.getTime()) / (1000 * 60 * 60 * 24));
}

// ── 스켈레톤 카드 / Skeleton card ─────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* 상품명 자리 / Product name placeholder */}
          <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
          <div className="flex gap-3">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="text-right shrink-0">
          {/* 금액 자리 / Amount placeholder */}
          <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
          {/* 뱃지 자리 / Badge placeholder */}
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── 요약 카드 / Summary cards ──────────────────────────────────────────────────

interface SummaryCardsProps {
  orders: Order[];
}

function SummaryCards({ orders }: SummaryCardsProps) {
  // 전체 결제완료 금액 / Total paid amount
  const totalPaid = orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + o.amount, 0);

  // 이번 달 결제완료 금액 / Current month paid amount
  const now = new Date();
  const thisMonthPaid = orders
    .filter((o) => {
      if (o.status !== 'PAID') return false;
      const d = new Date(o.paidAt ?? o.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, o) => sum + o.amount, 0);

  // 결제완료 건수 / Total paid count
  const paidCount = orders.filter((o) => o.status === 'PAID').length;
  // 취소 건수 / Cancelled count
  const cancelledCount = orders.filter((o) => o.status === 'CANCELLED').length;

  const cards = [
    {
      label: '총 결제금액',
      labelEn: 'Total Paid',
      value: formatAmount(totalPaid),
      icon: TrendingUp,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: '이번달 결제',
      labelEn: 'This Month',
      value: formatAmount(thisMonthPaid),
      icon: Calendar,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      label: '결제 완료',
      labelEn: 'Completed',
      value: `${paidCount}건`,
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: '취소됨',
      labelEn: 'Cancelled',
      value: `${cancelledCount}건`,
      icon: XCircle,
      iconColor: 'text-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border ${card.borderColor} ${card.bgColor} p-4`}
          >
            {/* 아이콘 / Icon */}
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${card.iconColor}`} />
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            </div>
            {/* 수치 / Value */}
            <p className="text-lg font-bold text-gray-800 leading-tight">
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{card.labelEn}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── 취소 확인 인라인 패널 / Inline cancel confirmation panel ──────────────────

interface CancelConfirmPanelProps {
  orderId: string;
  amount: number;
  onConfirm: (id: string) => void;
  onClose: () => void;
  isCancelling: boolean;
}

function CancelConfirmPanel({ orderId, amount, onConfirm, onClose, isCancelling }: CancelConfirmPanelProps) {
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      {/* 취소 확인 안내 / Cancellation confirmation notice */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-3">
        <div className="flex items-start gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-orange-800">
            정말 취소하시겠습니까? / Confirm cancellation?
          </p>
        </div>
        <ul className="space-y-1 text-xs text-orange-700 ml-6">
          <li>환불 예상: 3~5 영업일 소요 / Refund expected: 3–5 business days</li>
          <li>카드사에 따라 1~7일 차이 있음 / May vary 1–7 days by card issuer</li>
          <li>취소 후 재구매 시 동일 혜택 불보장 / Same benefits not guaranteed on repurchase</li>
        </ul>
        <p className="text-xs font-semibold text-orange-800 mt-2 ml-6">
          환불 예정액: {formatAmount(amount)}
        </p>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          돌아가기 / Back
        </button>
        <button
          type="button"
          onClick={() => onConfirm(orderId)}
          disabled={isCancelling}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCancelling ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> 취소 중...</>
          ) : (
            <>취소 진행 / Proceed</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── 결제 항목 카드 / Order card ────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  onCancelRequest: (id: string) => void;
  onCancelConfirm: (id: string) => void;
  cancelConfirmId: string | null;
  cancellingId: string | null;
  onCancelClose: () => void;
}

function OrderCard({
  order,
  onCancelRequest,
  onCancelConfirm,
  cancelConfirmId,
  cancellingId,
  onCancelClose,
}: OrderCardProps) {
  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;

  // 취소 가능 여부 / Can this order be cancelled
  const cancellable = canCancel(order);
  // 기간 만료로 취소 불가 (PAID이지만 7일 초과) / Expired cancellation window
  const expiredCancel = order.status === 'PAID' && !cancellable;
  // PENDING 상태 / Is pending
  const isPending = order.status === 'PENDING';
  // 현재 이 주문의 취소 확인 패널 표시 여부 / Show confirm panel for this order
  const showConfirm = cancelConfirmId === order.id;
  const isCancelling = cancellingId === order.id;

  // 결제 날짜 표시 (paidAt > createdAt 우선) / Show paid date (paidAt preferred)
  const displayDate = order.paidAt ?? order.cancelledAt ?? order.createdAt;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-4">
        {/* 왼쪽: 상품 정보 / Left: product info */}
        <div className="flex-1 min-w-0">
          {/* 상품명 / Product name */}
          <p className="text-base font-bold text-gray-900 mb-1 truncate">
            {order.orderName}
          </p>

          {/* 관련 공고 (있을 경우) / Related job (if any) */}
          {order.jobTitle && order.jobId && (
            <Link
              href={`/worker/jobs/${order.jobId}`}
              className="text-sm text-blue-600 hover:underline block truncate mb-2"
            >
              {order.jobTitle}
            </Link>
          )}

          {/* 메타 정보 행 / Meta info row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-2">
            {/* 결제 수단 / Payment method */}
            <span className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              {formatPaymentMethod(order.paymentMethod)}
            </span>
            {/* 결제일 / Payment date */}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDateTime(displayDate)}
            </span>
          </div>
        </div>

        {/* 오른쪽: 금액 + 상태 / Right: amount + status */}
        <div className="text-right shrink-0 flex flex-col items-end gap-2">
          {/* 금액 / Amount */}
          <p
            className={`text-lg font-bold ${
              order.status === 'CANCELLED' || order.status === 'FAILED'
                ? 'text-gray-400 line-through'
                : 'text-gray-900'
            }`}
          >
            {formatAmount(order.amount)}
          </p>

          {/* 상태 배지 / Status badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${config.bgColor} ${config.color}`}
          >
            <StatusIcon className="w-3 h-3" />
            {config.labelKo}
          </span>
        </div>
      </div>

      {/* ── 취소 버튼 영역 / Cancel button area ── */}
      {/* PAID + 7일 이내 → 취소 버튼 / PAID within 7 days → show cancel button */}
      {cancellable && !showConfirm && (
        <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => onCancelRequest(order.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
          >
            <XCircle className="w-3 h-3" />
            취소하기 / Cancel
          </button>
        </div>
      )}

      {/* PAID + 7일 이내 + 확인 패널 표시 중 / Show inline cancel confirm panel */}
      {cancellable && showConfirm && (
        <CancelConfirmPanel
          orderId={order.id}
          amount={order.amount}
          onConfirm={onCancelConfirm}
          onClose={onCancelClose}
          isCancelling={isCancelling}
        />
      )}

      {/* PAID이지만 7일 초과 → 취소 불가 표시 / PAID but past 7 days → expired notice */}
      {expiredCancel && (
        <div className="mt-4 flex justify-end items-center gap-1.5 border-t border-gray-100 pt-4">
          <Ban className="w-3 h-3 text-gray-300" />
          <span className="text-xs text-gray-300 font-medium">
            취소 불가 (기간 만료 {daysSincePaid(order)}일 경과) / Cancellation expired
          </span>
        </div>
      )}

      {/* PENDING → 취소 불가 표시 / PENDING → cannot cancel */}
      {isPending && (
        <div className="mt-4 flex justify-end items-center gap-1.5 border-t border-gray-100 pt-4">
          <Clock className="w-3 h-3 text-yellow-400" />
          <span className="text-xs text-yellow-600 font-medium">
            결제 처리 중 (취소 불가) / Payment processing (cannot cancel)
          </span>
        </div>
      )}
    </div>
  );
}

// ── 페이지네이션 / Pagination ──────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  // 페이지 번호 배열 생성 (최대 5개) / Generate page number array (max 5)
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* 이전 버튼 / Prev button */}
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* 페이지 번호 버튼 / Page number buttons */}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
            p === page
              ? 'bg-blue-600 text-white shadow-sm'
              : 'border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          {p}
        </button>
      ))}

      {/* 다음 버튼 / Next button */}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── 빈 상태 / Empty state ──────────────────────────────────────────────────────

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Receipt className="w-8 h-8 text-blue-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        {isFiltered
          ? '해당 상태의 결제 내역이 없습니다'
          : '결제 내역이 없습니다'}
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        {isFiltered
          ? '다른 필터를 선택하거나 전체 보기로 전환해보세요.'
          : '공고 프리미엄 등록 또는 이력서 열람권 구매 내역이 여기에 표시됩니다.'}
        <br />
        {isFiltered
          ? 'Try a different filter or switch to All.'
          : 'Your purchase history will appear here.'}
      </p>
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
        로그인하여 결제 내역을 확인하세요.
        <br />
        Log in to view your payment history.
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

export default function WorkerPaymentsPage() {
  // 전체 주문 목록 (전체 페이지 합산 — 요약 카드용) / All orders for summary cards
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  // 현재 페이지 주문 목록 / Current page orders
  const [orders, setOrders] = useState<Order[]>([]);
  // 전체 주문 수 / Total order count
  const [total, setTotal] = useState(0);
  // 로딩 상태 / Loading state
  const [loading, setLoading] = useState(true);
  // 에러 메시지 / Error message
  const [error, setError] = useState<string | null>(null);
  // 활성 필터 탭 / Active filter tab
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');
  // 현재 페이지 / Current page
  const [page, setPage] = useState(1);
  // 로그인 여부 / Whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // 현재 취소 중인 주문 ID / Currently cancelling order id
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  // 취소 확인 패널 표시 중인 주문 ID / Order id showing inline cancel confirm panel
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  /**
   * 결제 주문 목록 로드 / Load payment orders
   * 탭·페이지 변경 시 재호출 / Re-called on tab or page change
   */
  const loadOrders = useCallback(async (
    tab: OrderStatus | 'all',
    currentPage: number,
  ) => {
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
      // 쿼리 파라미터 구성 / Build query parameters
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(PAGE_LIMIT),
      });
      if (tab !== 'all') params.set('status', tab);

      const res = await fetch(`/api/payments/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${sessionId}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          // 인증 만료 / Auth expired
          setIsLoggedIn(false);
          return;
        }
        const data = await res.json().catch(() => ({}));
        setError(
          (data as { message?: string }).message ??
            '결제 내역을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
        );
        return;
      }

      const data: OrdersResponse = await res.json();
      const list = Array.isArray(data) ? data : (data.orders ?? []);
      const totalCount = Array.isArray(data) ? list.length : (data.total ?? list.length);

      setOrders(list);
      setTotal(totalCount);

      // 요약 카드용: 첫 페이지 + 전체 탭일 때만 전체 주문 저장
      // For summary: save all orders only on first page + all tab
      if (tab === 'all' && currentPage === 1) {
        setAllOrders(list);
      }
    } catch {
      // 네트워크 오류 / Network error
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 마운트 시 초기 로드 / Initial load on mount
  useEffect(() => {
    loadOrders('all', 1);
  }, [loadOrders]);

  // 탭 변경 시 페이지 리셋 + 재로드 / Reset page and reload on tab change
  const handleTabChange = (tab: OrderStatus | 'all') => {
    setActiveTab(tab);
    setPage(1);
    setCancelConfirmId(null);
    loadOrders(tab, 1);
  };

  // 페이지 변경 핸들러 / Page change handler
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setCancelConfirmId(null);
    loadOrders(activeTab, newPage);
    // 페이지 상단으로 스크롤 / Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 취소 버튼 클릭 → 인라인 확인 패널 표시 / Show inline confirm panel on cancel click
   */
  const handleCancelRequest = (orderId: string) => {
    setCancelConfirmId(orderId);
  };

  /**
   * 인라인 패널 닫기 / Close inline confirm panel
   */
  const handleCancelClose = () => {
    setCancelConfirmId(null);
  };

  /**
   * 결제 취소 실행 / Execute payment cancellation
   */
  const handleCancelConfirm = async (orderId: string) => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    setCancellingId(orderId);
    try {
      const res = await fetch(`/api/payments/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionId}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        // 로컬 상태 즉시 업데이트 / Update local state immediately
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: 'CANCELLED' as const, cancelledAt: new Date().toISOString() }
              : o,
          ),
        );
        setAllOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: 'CANCELLED' as const, cancelledAt: new Date().toISOString() }
              : o,
          ),
        );
        setCancelConfirmId(null);
        toast.success('결제가 취소되었습니다. 환불은 3~5 영업일 내 처리됩니다.');
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(
          (data as { message?: string }).message ??
            '취소 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
      }
    } catch {
      // 네트워크 오류 / Network error
      toast.error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    } finally {
      setCancellingId(null);
    }
  };

  // 월별 그룹핑 / Group by month
  const grouped = groupOrdersByMonth(orders);

  // ── 렌더링 / Render ──────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">결제 내역</h1>
          <p className="text-sm text-gray-500 mt-0.5">Payment History</p>
        </div>
        {/* 로그인 상태 + 로드 완료 시 총 건수 표시 / Show total when logged in & loaded */}
        {!loading && isLoggedIn && total > 0 && (
          <span className="text-sm text-gray-400 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4" />
            총 {total}건
          </span>
        )}
      </div>

      {/* ── 로딩 상태 / Loading state ── */}
      {loading && (
        <div className="space-y-4">
          {/* 요약 카드 스켈레톤 / Summary cards skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-pulse">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl" />
            ))}
          </div>
          {/* 탭 스켈레톤 / Tab skeleton */}
          <div className="flex gap-2 mb-5 animate-pulse">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-20 bg-gray-100 rounded-full" />
            ))}
          </div>
          {/* 카드 스켈레톤 / Card skeletons */}
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* ── 미로그인 / Not logged in ── */}
      {!loading && !isLoggedIn && <NotLoggedIn />}

      {/* ── 에러 / Error ── */}
      {!loading && isLoggedIn && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 text-sm text-red-700 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── 정상 상태 / Normal state ── */}
      {!loading && isLoggedIn && !error && (
        <>
          {/* 요약 카드 / Summary cards */}
          <SummaryCards orders={allOrders} />

          {/* 필터 탭 / Filter tabs */}
          <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 결제 내역 목록 (빈 상태 or 그룹 목록) / Order list or empty state */}
          {orders.length === 0 ? (
            <EmptyState isFiltered={activeTab !== 'all'} />
          ) : (
            <div className="space-y-8">
              {/* 월별 그룹 / Monthly groups */}
              {grouped.map(({ month, orders: monthOrders }) => (
                <div key={month}>
                  {/* 월 헤더 / Month header */}
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <h2 className="text-sm font-semibold text-gray-500">{month}</h2>
                    <div className="flex-1 h-px bg-gray-100" />
                    {/* 해당 월 합계 / Month total */}
                    <span className="text-xs text-gray-400 font-medium">
                      {formatAmount(
                        monthOrders
                          .filter((o) => o.status === 'PAID')
                          .reduce((sum, o) => sum + o.amount, 0),
                      )}
                    </span>
                  </div>

                  {/* 해당 월 주문 카드 목록 / Order cards for this month */}
                  <div className="space-y-3">
                    {monthOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onCancelRequest={handleCancelRequest}
                        onCancelConfirm={handleCancelConfirm}
                        cancelConfirmId={cancelConfirmId}
                        cancellingId={cancellingId}
                        onCancelClose={handleCancelClose}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* 페이지네이션 / Pagination */}
              <Pagination
                page={page}
                total={total}
                limit={PAGE_LIMIT}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
