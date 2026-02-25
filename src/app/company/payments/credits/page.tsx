'use client';

/**
 * 열람권 현황 및 구매 페이지 / Viewing credits status & purchase page
 * - 잔여 열람권 현황 카드 표시 / Shows remaining credit balance card
 * - 패키지 구매 섹션 (6종) / Package purchase section (6 types)
 * - 쿠폰 코드 입력 / Coupon code input
 * - 결제 버튼 (Coming Soon — 포트원 연동 별도) / Pay button (Coming Soon — PortOne integration separate)
 * - 최근 사용 내역 / Recent usage history
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Eye,
  Tag,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  BadgePercent,
  Users,
  Ticket,
  ConstructionIcon,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── 타입 정의 / Type definitions ────────────────────────────────────────────

/** 잔여 열람권 잔고 응답 / Viewing credit balance response */
interface CreditBalance {
  balance: number;       // 잔여 열람권 수 / Remaining credits
  totalUsed: number;     // 총 사용량 / Total used
}

/** 쿠폰 검증 응답 / Coupon validation response */
interface CouponValidation {
  valid: boolean;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  couponName?: string;
}

/** 열람권 패키지 정의 / Viewing credit package definition */
interface CreditPackage {
  code: string;           // 패키지 코드 / Package code
  quantity: number;       // 열람권 수 / Credit count
  name: string;           // 패키지명 / Package name
  price: number;          // 정가 / Original price
  originalPrice: number;  // 단가 계산 기준 정가 / Original per-unit price base
  discountPct: number | null;  // 할인율 (null = 할인 없음) / Discount % (null = none)
  popular?: boolean;      // 인기 뱃지 여부 / Show popular badge
}

// ─── 상수 / Constants ─────────────────────────────────────────────────────────

/**
 * 열람권 패키지 목록 (DB 기반이나 UI 표시용 하드코딩)
 * Viewing credit packages (DB-based but hardcoded for UI display)
 */
const CREDIT_PACKAGES: CreditPackage[] = [
  { code: 'VIEW_1',   quantity: 1,   name: '1건',    price: 3000,   originalPrice: 3000, discountPct: null },
  { code: 'VIEW_5',   quantity: 5,   name: '5건',    price: 13000,  originalPrice: 15000, discountPct: 14 },
  { code: 'VIEW_10',  quantity: 10,  name: '10건',   price: 25000,  originalPrice: 30000, discountPct: 17 },
  { code: 'VIEW_30',  quantity: 30,  name: '30건',   price: 70000,  originalPrice: 90000, discountPct: 22 },
  { code: 'VIEW_50',  quantity: 50,  name: '50건',   price: 110000, originalPrice: 150000, discountPct: 27, popular: true },
  { code: 'VIEW_100', quantity: 100, name: '100건',  price: 150000, originalPrice: 300000, discountPct: 50 },
];

/** 최대 표시할 쿠폰 코드 길이 / Max coupon code display length */
const MAX_COUPON_LENGTH = 20;

// ─── 헬퍼 함수 / Helper functions ─────────────────────────────────────────────

/** 숫자 → 원화 포맷 / Format number to Korean won */
function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/** ISO 날짜 → 한국어 포맷 / Format ISO date to Korean */
function formatDateKo(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** 쿠폰 할인 계산 / Calculate coupon discount */
function calcDiscount(price: number, coupon: CouponValidation | null): number {
  if (!coupon || !coupon.valid) return 0;
  if (coupon.discountType === 'PERCENTAGE') {
    return Math.floor(price * (coupon.discountValue / 100));
  }
  return Math.min(coupon.discountValue, price);
}

// ─── 서브컴포넌트 / Sub-components ────────────────────────────────────────────

/** 스켈레톤 카드 / Skeleton card for loading state */
function SkeletonBalanceCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        <div>
          <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 bg-gray-100 rounded-xl" />
        <div className="h-16 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

/** 미로그인 상태 컴포넌트 / Not logged in state component */
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
        열람권 현황을 확인하려면 로그인하세요.
        <br />
        Log in to view your credit balance.
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

/** 잔고 현황 카드 / Balance status card */
interface BalanceCardProps {
  balance: CreditBalance;
}

function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white shadow-lg shadow-blue-200">
      {/* 헤더 / Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-blue-100">
            인재 열람권 현황
          </h2>
          <p className="text-xs text-blue-200">
            Talent viewing credit status
          </p>
        </div>
      </div>

      {/* 잔여 열람권 크게 표시 / Large remaining credit count */}
      <div className="mb-5">
        <p className="text-xs text-blue-200 mb-1">현재 보유 열람권 / Current balance</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold tracking-tight">
            {balance.balance}
          </span>
          <span className="text-xl font-semibold text-blue-200 mb-1">건</span>
        </div>
        <p className="text-xs text-blue-200 mt-1">
          이력서를 {balance.balance}명까지 열람할 수 있습니다
          <br />
          Can view up to {balance.balance} resumes
        </p>
      </div>

      {/* 요약 통계 그리드 / Summary stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* 잔여 열람권 / Remaining */}
        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Eye className="w-3.5 h-3.5 text-blue-200" />
            <span className="text-xs text-blue-200">잔여 열람권</span>
          </div>
          <p className="text-xl font-bold">{balance.balance}<span className="text-sm font-normal ml-0.5">건</span></p>
        </div>
        {/* 총 사용량 / Total used */}
        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-200" />
            <span className="text-xs text-blue-200">총 사용량</span>
          </div>
          <p className="text-xl font-bold">{balance.totalUsed}<span className="text-sm font-normal ml-0.5">건</span></p>
        </div>
      </div>
    </div>
  );
}

/** 열람권 패키지 카드 / Credit package card */
interface PackageCardProps {
  pkg: CreditPackage;
  isSelected: boolean;
  onSelect: () => void;
}

function PackageCard({ pkg, isSelected, onSelect }: PackageCardProps) {
  const perUnit = Math.round(pkg.price / pkg.quantity);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full text-left rounded-2xl border-2 p-5 transition-all focus:outline-none ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      {/* 인기 뱃지 / Popular badge */}
      {pkg.popular && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
          <Sparkles className="w-3 h-3" />
          인기 패키지
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        {/* 왼쪽: 수량 + 할인 정보 / Left: quantity + discount info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {/* 선택 표시기 / Selection indicator */}
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}
            >
              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <h3 className={`text-base font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
              {pkg.name}
            </h3>
            {/* 할인율 뱃지 / Discount badge */}
            {pkg.discountPct !== null && (
              <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                <BadgePercent className="w-3 h-3" />
                {pkg.discountPct}% 할인
              </span>
            )}
          </div>
          {/* 단가 / Per unit price */}
          <p className="text-xs text-gray-400 ml-6">
            건당 {formatWon(perUnit)}
            {pkg.discountPct !== null && (
              <span className="ml-1.5 line-through text-gray-300">
                {formatWon(Math.round(pkg.originalPrice / pkg.quantity))}
              </span>
            )}
          </p>
        </div>

        {/* 오른쪽: 가격 / Right: price */}
        <div className="text-right shrink-0">
          {/* 정가 (할인 있을 때 취소선) / Original price (strikethrough when discounted) */}
          {pkg.discountPct !== null && (
            <p className="text-xs text-gray-400 line-through mb-0.5">
              {formatWon(pkg.originalPrice)}
            </p>
          )}
          {/* 실제 가격 / Actual price */}
          <p className={`text-lg font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
            {formatWon(pkg.price)}
          </p>
        </div>
      </div>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function CreditsPage() {
  // ── 상태 / State ──────────────────────────────────────────────────────────

  /** 잔여 열람권 잔고 / Credit balance */
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  /** 초기 로딩 상태 / Initial loading */
  const [loadingBalance, setLoadingBalance] = useState(true);
  /** 로그인 여부 / Logged in */
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  /** 잔고 로드 에러 / Balance load error */
  const [balanceError, setBalanceError] = useState<string | null>(null);

  /** 선택된 패키지 코드 / Selected package code */
  const [selectedCode, setSelectedCode] = useState<string>('VIEW_50');

  /** 쿠폰 코드 입력값 / Coupon code input */
  const [couponInput, setCouponInput] = useState('');
  /** 쿠폰 검증 중 / Validating coupon */
  const [couponLoading, setCouponLoading] = useState(false);
  /** 검증된 쿠폰 / Validated coupon */
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  /** 쿠폰 에러 / Coupon error */
  const [couponError, setCouponError] = useState<string | null>(null);

  // ── 파생 값 / Derived values ──────────────────────────────────────────────

  /** 선택된 패키지 / Selected package object */
  const selectedPkg = CREDIT_PACKAGES.find((p) => p.code === selectedCode) ?? CREDIT_PACKAGES[4];

  /** 쿠폰 할인액 / Coupon discount amount */
  const discountAmount = calcDiscount(selectedPkg.price, appliedCoupon);
  /** 최종 결제 금액 / Final payment amount */
  const finalPrice = selectedPkg.price - discountAmount;

  // ── 데이터 로드 / Data loading ────────────────────────────────────────────

  /** 잔여 열람권 잔고 조회 / Load credit balance */
  const loadBalance = useCallback(async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setIsLoggedIn(false);
      setLoadingBalance(false);
      return;
    }

    try {
      const res = await fetch('/api/payments/viewing-credits/balance', {
        headers: { Authorization: `Bearer ${sessionId}` },
      });

      if (res.status === 401) {
        // 인증 만료 / Auth expired
        setIsLoggedIn(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setBalanceError(
          (data as { message?: string }).message ??
            '열람권 정보를 불러오는 데 실패했습니다.'
        );
        return;
      }

      const data = await res.json() as CreditBalance;
      setBalance(data);
    } catch {
      // 네트워크 오류 / Network error
      setBalanceError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  // ── 쿠폰 처리 / Coupon handling ───────────────────────────────────────────

  /** 쿠폰 코드 적용 / Apply coupon code */
  const handleApplyCoupon = async () => {
    const trimmed = couponInput.trim();
    if (!trimmed) {
      setCouponError('쿠폰 코드를 입력해주세요. / Please enter a coupon code.');
      return;
    }

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    setCouponLoading(true);
    setCouponError(null);
    setAppliedCoupon(null);

    try {
      const res = await fetch(
        `/api/payments/coupons/validate?code=${encodeURIComponent(trimmed)}`,
        { headers: { Authorization: `Bearer ${sessionId}` } }
      );

      const data = await res.json() as CouponValidation & { message?: string };

      if (!res.ok || !data.valid) {
        setCouponError(
          (data as { message?: string }).message ??
            '유효하지 않은 쿠폰입니다. / Invalid coupon code.'
        );
        return;
      }

      setAppliedCoupon(data);
      toast.success(
        `쿠폰 적용 완료! ${
          data.discountType === 'PERCENTAGE'
            ? `${data.discountValue}% 할인`
            : `${formatWon(data.discountValue)} 할인`
        }`
      );
    } catch {
      setCouponError('쿠폰 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setCouponLoading(false);
    }
  };

  /** 쿠폰 제거 / Remove applied coupon */
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
    toast.info('쿠폰이 제거되었습니다. / Coupon removed.');
  };

  /** Enter 키 쿠폰 적용 / Apply coupon on Enter key */
  const handleCouponKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyCoupon();
    }
  };

  // ── 결제 버튼 핸들러 (Coming Soon) / Payment button handler (Coming Soon) ──

  const handlePayment = () => {
    toast.info('결제 기능은 준비 중입니다. / Payment integration coming soon.');
  };

  // ── 렌더링 / Render ───────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* 헤더 / Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/company/payments"
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition shrink-0"
          aria-label="결제 관리로 돌아가기 / Back to payment management"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">열람권 구매</h1>
          <p className="text-sm text-gray-500">Talent Viewing Credits</p>
        </div>
      </div>

      {/* ── 로딩 상태 / Loading state ── */}
      {loadingBalance && <SkeletonBalanceCard />}

      {/* ── 미로그인 / Not logged in ── */}
      {!loadingBalance && !isLoggedIn && <NotLoggedIn />}

      {/* ── 로그인 상태 콘텐츠 / Logged-in content ── */}
      {!loadingBalance && isLoggedIn && (
        <>
          {/* 잔고 에러 / Balance error */}
          {balanceError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {balanceError}
            </div>
          )}

          {/* 잔여 열람권 현황 카드 / Credit balance card */}
          {balance && <BalanceCard balance={balance} />}

          {/* ── 구매 섹션 / Purchase section ── */}
          <section aria-labelledby="purchase-heading">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 id="purchase-heading" className="text-base font-bold text-gray-900">
                  열람권 패키지
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Credit packages — 많이 구매할수록 단가가 낮아집니다
                </p>
              </div>
            </div>

            {/* 패키지 카드 그리드 / Package card grid */}
            <div className="space-y-3 mb-6">
              {CREDIT_PACKAGES.map((pkg) => (
                <PackageCard
                  key={pkg.code}
                  pkg={pkg}
                  isSelected={selectedCode === pkg.code}
                  onSelect={() => setSelectedCode(pkg.code)}
                />
              ))}
            </div>

            {/* ── 쿠폰 섹션 / Coupon section ── */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Ticket className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">
                  쿠폰 코드 / Coupon Code
                </h3>
              </div>

              {/* 적용된 쿠폰 표시 / Applied coupon display */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        {appliedCoupon.couponName ?? '쿠폰 적용됨'}
                      </p>
                      <p className="text-xs text-green-600">
                        {appliedCoupon.discountType === 'PERCENTAGE'
                          ? `${appliedCoupon.discountValue}% 할인 적용`
                          : `${formatWon(appliedCoupon.discountValue)} 할인 적용`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-red-500 hover:text-red-700 font-medium transition"
                  >
                    제거
                  </button>
                </div>
              ) : (
                <>
                  {/* 쿠폰 입력 폼 / Coupon input form */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value.slice(0, MAX_COUPON_LENGTH).toUpperCase())
                        }
                        onKeyDown={handleCouponKeyDown}
                        placeholder="쿠폰 코드 입력 / Enter coupon code"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        maxLength={MAX_COUPON_LENGTH}
                        autoComplete="off"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 shrink-0"
                    >
                      {couponLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        '적용'
                      )}
                    </button>
                  </div>

                  {/* 쿠폰 에러 메시지 / Coupon error message */}
                  {couponError && (
                    <p className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {couponError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* ── 결제 요약 / Payment summary ── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                결제 금액 / Payment Summary
              </h3>
              <div className="space-y-2">
                {/* 선택 패키지 / Selected package */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {selectedPkg.name} 열람권
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatWon(selectedPkg.price)}
                  </span>
                </div>
                {/* 패키지 자체 할인 / Package discount */}
                {selectedPkg.discountPct !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">패키지 할인 ({selectedPkg.discountPct}%)</span>
                    <span className="text-red-500 font-medium">
                      -{formatWon(selectedPkg.originalPrice - selectedPkg.price)}
                    </span>
                  </div>
                )}
                {/* 쿠폰 할인 / Coupon discount */}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">쿠폰 할인</span>
                    <span className="text-red-500 font-medium">
                      -{formatWon(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  {/* 최종 결제 금액 / Final amount */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">최종 결제 금액</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatWon(finalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 text-right mt-0.5">
                    열람권 {selectedPkg.quantity}건 지급
                  </p>
                </div>
              </div>
            </div>

            {/* ── 결제 버튼 (Coming Soon) / Payment button (Coming Soon) ── */}
            <div className="space-y-3">
              {/* Coming Soon 안내 배너 / Coming Soon notice banner */}
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <ConstructionIcon className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">
                    결제 기능 준비 중 / Payment integration coming soon
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    포트원 결제 연동 작업이 진행 중입니다. 곧 이용 가능합니다.
                  </p>
                </div>
              </div>

              {/* 결제하기 버튼 (비활성) / Pay button (disabled) */}
              <button
                type="button"
                onClick={handlePayment}
                className="w-full py-4 bg-blue-500 text-white font-bold text-base rounded-2xl hover:bg-blue-600 transition flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
                aria-disabled="true"
              >
                <CreditCard className="w-5 h-5" />
                {formatWon(finalPrice)} 결제하기
                <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full ml-1">
                  준비중
                </span>
              </button>
            </div>
          </section>

          {/* ── 사용 내역 섹션 / Usage history section ── */}
          <section aria-labelledby="history-heading" className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 id="history-heading" className="text-base font-bold text-gray-900">
                  최근 사용 내역
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Recent usage history
                </p>
              </div>
              {/* 전체 내역 보기 링크 / View all history link */}
              <Link
                href="/company/talents"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition"
              >
                인재 목록 보기
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 사용 내역 빈 상태 / Empty usage history state */}
            <UsageHistorySection sessionId={typeof window !== 'undefined' ? (localStorage.getItem('sessionId') ?? '') : ''} />
          </section>
        </>
      )}
    </div>
  );
}

// ─── 사용 내역 서브컴포넌트 / Usage history sub-component ─────────────────────

/** 열람 기록 항목 / Single usage history item */
interface UsageHistoryItem {
  id: string;
  jobSeekerId: string;
  usedAt: string;
  jobSeekerName?: string;
}

interface UsageHistorySectionProps {
  sessionId: string;
}

/**
 * 최근 사용 내역 섹션 / Recent usage history section
 * GET /payments/viewing-credits/balance 응답으로 대체 (실제 내역 API 없을 시 빈 상태)
 * Fallback to empty state if no dedicated history API exists
 */
function UsageHistorySection({ sessionId }: UsageHistorySectionProps) {
  const [history, setHistory] = useState<UsageHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    /**
     * 열람 사용 내역 조회 시도
     * Try fetching usage history — falls back to empty state gracefully
     */
    const load = async () => {
      try {
        const res = await fetch('/api/payments/viewing-credits/history', {
          headers: { Authorization: `Bearer ${sessionId}` },
        });
        if (res.ok) {
          const data = await res.json() as { items?: UsageHistoryItem[] } | UsageHistoryItem[];
          const items = Array.isArray(data) ? data : (data.items ?? []);
          setHistory(items);
        }
        // 404 또는 미구현 엔드포인트 → 빈 상태로 표시 / 404 or unimplemented → show empty state
      } catch {
        // 조용히 실패 처리 — 빈 상태로 표시 / Silent fail — show empty state
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-3.5 w-32 bg-gray-200 rounded mb-1.5" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Clock className="w-7 h-7 text-gray-300" />
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-1.5">
          아직 사용 내역이 없습니다
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          열람권을 사용하여 인재의 이력서와 연락처를 확인해보세요.
          <br />
          Use credits to view resumes and contact talented candidates.
        </p>
        <Link
          href="/company/talents"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition"
        >
          <Eye className="w-3.5 h-3.5" />
          인재 둘러보기 / Browse Talents
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3"
        >
          {/* 아이콘 / Icon */}
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          {/* 내역 정보 / History info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.jobSeekerName ?? `구직자 #${item.jobSeekerId.slice(0, 8)}`}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDateKo(item.usedAt)}
            </p>
          </div>
          {/* 사용 배지 / Used badge */}
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full shrink-0">
            -1건
          </span>
        </div>
      ))}
    </div>
  );
}
