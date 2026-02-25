'use client';

/**
 * 쿠폰함 페이지 / Coupon Wallet Page
 * - 쿠폰 코드 입력 및 유효성 검증 / Coupon code input and validation
 * - 등록된 쿠폰 목록 표시 (localStorage 기반) / Display registered coupons (localStorage-based)
 * - 쿠폰 사용 방법 안내 / Coupon usage guide
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Tag,
  LogIn,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Info,
  Ticket,
  Percent,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';

// ── 타입 정의 / Type definitions ─────────────────────────────────────────────

// 쿠폰 할인 유형 / Coupon discount type
type DiscountType = 'FIXED' | 'PERCENT';

// 쿠폰 상태 / Coupon status
type CouponStatus = 'AVAILABLE' | 'USED' | 'EXPIRED';

// 쿠폰 데이터 구조 / Coupon data structure
interface Coupon {
  /** 쿠폰 코드 (고유 식별자) / Coupon code (unique identifier) */
  code: string;
  /** 쿠폰명 / Coupon name */
  name: string;
  /** 할인 유형: 고정금액 또는 퍼센트 / Discount type: fixed amount or percent */
  discountType: DiscountType;
  /** 할인 값 / Discount value */
  discountValue: number;
  /** 최소 사용 금액 (원) / Minimum order amount (KRW) */
  minOrderAmount: number | null;
  /** 최대 할인 금액 (퍼센트 할인 시) / Max discount cap (for percent coupons) */
  maxDiscountAmount: number | null;
  /** 만료일 / Expiry date (ISO string) */
  expiresAt: string | null;
  /** 쿠폰 상태 / Coupon status */
  status: CouponStatus;
  /** 등록일 / Registered date */
  registeredAt: string;
}

// 백엔드 validate 응답 타입 / Backend validate response type
interface ValidateCouponResponse {
  valid: boolean;
  coupon?: {
    code: string;
    name?: string;
    discountType?: DiscountType;
    discountValue?: number;
    discountAmount?: number;
    discountPercent?: number;
    minOrderAmount?: number | null;
    maxDiscountAmount?: number | null;
    expiresAt?: string | null;
    description?: string;
  };
  message?: string;
}

// localStorage 키 / localStorage key
const COUPONS_STORAGE_KEY = 'jobchaja_registered_coupons';

// ── 유틸 함수 / Utility functions ────────────────────────────────────────────

/**
 * 날짜 포맷 / Format date to YYYY.MM.DD
 */
function formatDate(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

/**
 * 쿠폰 만료 여부 확인 / Check if coupon is expired
 */
function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

/**
 * 할인 금액/율 표시 문자열 / Display string for discount value
 */
function formatDiscount(coupon: Coupon): string {
  if (coupon.discountType === 'PERCENT') {
    return `${coupon.discountValue}% 할인`;
  }
  return `${coupon.discountValue.toLocaleString()}원 할인`;
}

/**
 * localStorage에서 쿠폰 목록 로드 / Load coupons from localStorage
 */
function loadCoupons(): Coupon[] {
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as Coupon[];
    return [];
  } catch {
    return [];
  }
}

/**
 * localStorage에 쿠폰 목록 저장 / Save coupons to localStorage
 */
function saveCoupons(coupons: Coupon[]): void {
  localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
}

// ── 서브 컴포넌트 / Sub-components ──────────────────────────────────────────

// ── 미로그인 상태 / Not logged in ─────────────────────────────────────────────
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
        쿠폰을 등록하고 관리하려면 로그인이 필요합니다.
        <br />
        Log in to register and manage your coupons.
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

// ── 쿠폰 상태 배지 / Coupon status badge ────────────────────────────────────
interface StatusBadgeProps {
  status: CouponStatus;
  expiresAt: string | null;
}

function StatusBadge({ status, expiresAt }: StatusBadgeProps) {
  // 만료 여부 우선 확인 / Check expiry first
  if (status === 'USED') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">
        <XCircle className="w-3 h-3" />
        사용완료
      </span>
    );
  }
  if (isExpired(expiresAt)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-400">
        <Clock className="w-3 h-3" />
        기간만료
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-600">
      <CheckCircle2 className="w-3 h-3" />
      사용가능
    </span>
  );
}

// ── 쿠폰 카드 / Coupon card ──────────────────────────────────────────────────
interface CouponCardProps {
  coupon: Coupon;
}

function CouponCard({ coupon }: CouponCardProps) {
  // 코드 복사 상태 / Copy state
  const [copied, setCopied] = useState(false);

  // 쿠폰이 사용 불가 상태인지 / Whether coupon is unavailable
  const unavailable = coupon.status === 'USED' || isExpired(coupon.expiresAt);

  // 쿠폰 코드 복사 / Copy coupon code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success('쿠폰 코드가 복사되었습니다.');
      // 2초 후 복사 상태 초기화 / Reset copy state after 2s
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('복사에 실패했습니다. 직접 코드를 선택하여 복사해주세요.');
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition ${
        unavailable
          ? 'border-gray-100 opacity-60'
          : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
      }`}
    >
      {/* 상단: 쿠폰명 + 상태 배지 / Top: coupon name + status badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {/* 쿠폰 아이콘 / Coupon icon */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              unavailable ? 'bg-gray-100' : 'bg-blue-50'
            }`}
          >
            {coupon.discountType === 'PERCENT' ? (
              <Percent className={`w-4 h-4 ${unavailable ? 'text-gray-300' : 'text-blue-500'}`} />
            ) : (
              <Wallet className={`w-4 h-4 ${unavailable ? 'text-gray-300' : 'text-blue-500'}`} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{coupon.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">등록일: {formatDate(coupon.registeredAt)}</p>
          </div>
        </div>
        {/* 상태 배지 / Status badge */}
        <StatusBadge status={coupon.status} expiresAt={coupon.expiresAt} />
      </div>

      {/* 할인 금액 표시 / Discount display */}
      <div
        className={`text-2xl font-black mb-3 ${
          unavailable ? 'text-gray-300' : 'text-blue-600'
        }`}
      >
        {formatDiscount(coupon)}
      </div>

      {/* 쿠폰 조건 / Coupon conditions */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
        {coupon.minOrderAmount && (
          <span className="text-xs text-gray-400">
            최소 {coupon.minOrderAmount.toLocaleString()}원 이상 사용 시
          </span>
        )}
        {coupon.maxDiscountAmount && coupon.discountType === 'PERCENT' && (
          <span className="text-xs text-gray-400">
            최대 {coupon.maxDiscountAmount.toLocaleString()}원 할인
          </span>
        )}
        {coupon.expiresAt && (
          <span className={`text-xs ${isExpired(coupon.expiresAt) ? 'text-red-400' : 'text-gray-400'}`}>
            {isExpired(coupon.expiresAt) ? '만료됨: ' : '만료일: '}
            {formatDate(coupon.expiresAt)}
          </span>
        )}
        {!coupon.expiresAt && (
          <span className="text-xs text-gray-400">만료일 없음</span>
        )}
      </div>

      {/* 하단: 쿠폰 코드 + 복사 버튼 / Bottom: coupon code + copy button */}
      <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
        {/* 쿠폰 코드 표시 / Coupon code display */}
        <code className="flex-1 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 tracking-widest select-all truncate">
          {coupon.code}
        </code>
        {/* 복사 버튼 / Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          disabled={unavailable}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition shrink-0 disabled:opacity-40 disabled:cursor-not-allowed border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              복사
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── 빈 쿠폰 목록 / Empty coupon list ────────────────────────────────────────
function EmptyCouponList() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Ticket className="w-7 h-7 text-gray-300" />
      </div>
      <h3 className="text-sm font-semibold text-gray-500 mb-1">
        등록된 쿠폰이 없습니다
      </h3>
      <p className="text-xs text-gray-400">
        위 입력창에 쿠폰 코드를 입력하여 쿠폰을 등록해보세요.
        <br />
        Enter a coupon code above to add your first coupon.
      </p>
    </div>
  );
}

// ── 쿠폰 필터 탭 / Coupon filter tabs ───────────────────────────────────────
type FilterType = 'all' | 'available' | 'unavailable';

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'available', label: '사용가능' },
  { key: 'unavailable', label: '만료/사용완료' },
];

// ── 쿠폰 사용 안내 / Coupon usage guide ─────────────────────────────────────
function CouponGuide() {
  // 안내 단계 목록 / Guide step list
  const steps = [
    {
      icon: <Tag className="w-4 h-4 text-blue-500" />,
      title: '쿠폰 코드 등록',
      desc: '위 입력창에 쿠폰 코드를 입력하고 등록하기 버튼을 클릭하세요.',
    },
    {
      icon: <ChevronRight className="w-4 h-4 text-blue-500" />,
      title: '공고 등록 시 적용',
      desc: '채용공고 등록 결제 단계에서 보유 쿠폰을 선택하거나 코드를 직접 입력하세요.',
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />,
      title: '할인 혜택 적용',
      desc: '결제 금액에서 쿠폰 할인이 자동으로 차감됩니다.',
    },
  ];

  return (
    <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
      {/* 안내 헤더 / Guide header */}
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-4 h-4 text-blue-500 shrink-0" />
        <h3 className="text-sm font-bold text-blue-700">쿠폰 사용 방법</h3>
      </div>
      {/* 단계별 안내 / Step-by-step guide */}
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {/* 단계 번호 / Step number */}
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-blue-800">{step.title}</p>
              <p className="text-xs text-blue-600 mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {/* 유의사항 / Notes */}
      <div className="mt-4 pt-4 border-t border-blue-100">
        <p className="text-xs text-blue-500">
          * 쿠폰은 1회 결제에 1개만 사용 가능합니다.
          <br />
          * 만료된 쿠폰은 사용이 불가하며, 환불되지 않습니다.
          <br />
          * 쿠폰 코드는 대소문자를 구분하지 않습니다.
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function WorkerCouponsPage() {
  // 로그인 여부 / Whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // 쿠폰 목록 (localStorage 기반) / Coupon list (localStorage-based)
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  // 쿠폰 코드 입력값 / Coupon code input value
  const [inputCode, setInputCode] = useState('');
  // 유효성 검사 로딩 중 / Validating state
  const [validating, setValidating] = useState(false);
  // 입력 에러 메시지 / Input error message
  const [inputError, setInputError] = useState<string | null>(null);
  // 활성 필터 탭 / Active filter tab
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // 초기 로드: 세션 확인 + localStorage 쿠폰 로드 / Initial load: check session + load coupons
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      // 세션 없음 → 미로그인 처리 / No session → not logged in
      setIsLoggedIn(false);
      return;
    }
    // localStorage에서 쿠폰 목록 로드 / Load coupons from localStorage
    const stored = loadCoupons();
    setCoupons(stored);
  }, []);

  // 필터링된 쿠폰 목록 / Filtered coupon list
  const filteredCoupons = coupons.filter((c) => {
    if (activeFilter === 'available') {
      return c.status !== 'USED' && !isExpired(c.expiresAt);
    }
    if (activeFilter === 'unavailable') {
      return c.status === 'USED' || isExpired(c.expiresAt);
    }
    return true;
  });

  // 사용가능 쿠폰 수 / Available coupon count
  const availableCount = coupons.filter(
    (c) => c.status !== 'USED' && !isExpired(c.expiresAt)
  ).length;

  /**
   * 쿠폰 코드 등록 처리 / Handle coupon code registration
   * GET /api/payments/coupons/validate?code=XXX 호출 후 로컬 저장
   */
  const handleRegister = useCallback(async () => {
    // 입력값 정제 (앞뒤 공백 제거, 대문자 변환) / Trim and uppercase
    const code = inputCode.trim().toUpperCase();

    // 빈 값 검사 / Empty check
    if (!code) {
      setInputError('쿠폰 코드를 입력해주세요.');
      return;
    }

    // 세션 확인 / Check session
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setIsLoggedIn(false);
      return;
    }

    // 중복 등록 검사 / Duplicate check
    const alreadyExists = coupons.some((c) => c.code === code);
    if (alreadyExists) {
      setInputError('이미 등록된 쿠폰 코드입니다.');
      return;
    }

    setInputError(null);
    setValidating(true);

    try {
      // 백엔드 쿠폰 유효성 검사 API 호출 / Call backend coupon validate API
      const res = await fetch(
        `/api/payments/coupons/validate?code=${encodeURIComponent(code)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        }
      );

      const data = (await res.json()) as ValidateCouponResponse;

      if (!res.ok || !data.valid) {
        // 유효하지 않은 쿠폰 / Invalid coupon
        const errMsg =
          data.message ||
          (res.status === 404
            ? '존재하지 않는 쿠폰 코드입니다.'
            : res.status === 401
            ? '로그인이 필요합니다.'
            : '유효하지 않은 쿠폰 코드입니다.');
        setInputError(errMsg);
        return;
      }

      // 쿠폰 정보 구성 / Build coupon object
      const couponInfo = data.coupon;
      const newCoupon: Coupon = {
        code,
        name: couponInfo?.name ?? `${code} 쿠폰`,
        discountType:
          couponInfo?.discountType ??
          (couponInfo?.discountPercent !== undefined ? 'PERCENT' : 'FIXED'),
        discountValue:
          couponInfo?.discountValue ??
          couponInfo?.discountAmount ??
          couponInfo?.discountPercent ??
          0,
        minOrderAmount: couponInfo?.minOrderAmount ?? null,
        maxDiscountAmount: couponInfo?.maxDiscountAmount ?? null,
        expiresAt: couponInfo?.expiresAt ?? null,
        status: 'AVAILABLE',
        registeredAt: new Date().toISOString(),
      };

      // localStorage에 저장 / Save to localStorage
      const updated = [...coupons, newCoupon];
      setCoupons(updated);
      saveCoupons(updated);

      // 성공 처리 / Success
      setInputCode('');
      toast.success(`쿠폰이 등록되었습니다! "${newCoupon.name}"`);
    } catch {
      // 네트워크 오류 / Network error
      setInputError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setValidating(false);
    }
  }, [inputCode, coupons]);

  // Enter 키 핸들러 / Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleRegister();
    }
  };

  // 입력값 변경 시 에러 초기화 / Clear error on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(e.target.value);
    if (inputError) setInputError(null);
  };

  // ── 렌더링 / Render ──────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">내 쿠폰함</h1>
          <p className="text-sm text-gray-500 mt-0.5">My Coupon Wallet</p>
        </div>
        {isLoggedIn && (
          <div className="text-right">
            <p className="text-2xl font-black text-blue-600">{availableCount}</p>
            <p className="text-xs text-gray-400">사용가능 쿠폰</p>
          </div>
        )}
      </div>

      {/* 미로그인 상태 / Not logged in */}
      {!isLoggedIn && <NotLoggedIn />}

      {/* 로그인 상태 / Logged in */}
      {isLoggedIn && (
        <div className="space-y-6">

          {/* ── 쿠폰 등록 섹션 / Coupon registration section ─────────────────── */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-1">쿠폰 코드 등록</h2>
            <p className="text-xs text-gray-400 mb-4">
              보유하신 쿠폰 코드를 입력하여 쿠폰함에 등록하세요.
              <br />
              Enter your coupon code to add it to your wallet.
            </p>

            {/* 입력 필드 영역 / Input area */}
            <div className="flex gap-2">
              {/* 쿠폰 코드 입력 / Coupon code input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Tag className="w-4 h-4 text-gray-300" />
                </div>
                <input
                  type="text"
                  value={inputCode}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="쿠폰 코드 입력 (예: JOBCHAJA2026)"
                  maxLength={50}
                  className={`w-full pl-9 pr-4 py-3 text-sm rounded-xl border transition outline-none font-mono tracking-wider ${
                    inputError
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
              </div>

              {/* 등록 버튼 / Register button */}
              <button
                type="button"
                onClick={() => void handleRegister()}
                disabled={validating || !inputCode.trim()}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {validating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    확인 중
                  </>
                ) : (
                  '등록하기'
                )}
              </button>
            </div>

            {/* 에러 메시지 / Error message */}
            {inputError && (
              <div className="flex items-center gap-2 mt-2.5 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{inputError}</span>
              </div>
            )}
          </section>

          {/* ── 내 쿠폰 목록 섹션 / My coupons list section ────────────────── */}
          <section>
            {/* 섹션 헤더 / Section header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">
                내 쿠폰 목록
                {coupons.length > 0 && (
                  <span className="ml-2 text-xs font-semibold text-gray-400">
                    총 {coupons.length}개
                  </span>
                )}
              </h2>
            </div>

            {/* 필터 탭 / Filter tabs */}
            {coupons.length > 0 && (
              <div className="flex gap-1.5 mb-4">
                {FILTER_TABS.map((tab) => {
                  // 탭별 카운트 / Count per tab
                  const count =
                    tab.key === 'all'
                      ? coupons.length
                      : tab.key === 'available'
                      ? coupons.filter((c) => c.status !== 'USED' && !isExpired(c.expiresAt)).length
                      : coupons.filter((c) => c.status === 'USED' || isExpired(c.expiresAt)).length;

                  const isActive = activeFilter === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveFilter(tab.key)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {tab.label}
                      {/* 카운트 배지 / Count badge */}
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
            )}

            {/* 쿠폰 카드 그리드 / Coupon card grid */}
            {filteredCoupons.length === 0 ? (
              <EmptyCouponList />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCoupons.map((coupon) => (
                  <CouponCard key={coupon.code} coupon={coupon} />
                ))}
              </div>
            )}
          </section>

          {/* ── 쿠폰 사용 안내 섹션 / Usage guide section ──────────────────── */}
          <CouponGuide />

        </div>
      )}
    </div>
  );
}
