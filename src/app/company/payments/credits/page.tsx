'use client';

/**
 * 열람권 현황 및 구매 페이지 / Viewing credits status & purchase page
 * - 잔여 열람권 현황 카드 표시 / Shows remaining credit balance card
 * - 패키지 구매 섹션 (6종) / Package purchase section (6 types)
 * - 결제수단 선택 (카드/간편결제/계좌이체) / Payment method selection
 * - 쿠폰 코드 입력 / Coupon code input
 * - 포트원 V2 결제 연동 / PortOne V2 payment integration
 * - 최근 사용 내역 / Recent usage history
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as PortOne from '@portone/browser-sdk/v2';
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
  Smartphone,
  Building2,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── 타입 정의 / Type definitions ────────────────────────────────────────────

/** 잔여 열람권 잔고 응답 / Viewing credit balance response */
interface CreditBalance {
  totalRemaining: number;
  credits: {
    id: number;
    totalCredits: number;
    usedCredits: number;
    remainingCredits: number;
    source: string;
    expiresAt: string;
    isExpired: boolean;
    createdAt: string;
  }[];
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
  code: string;
  quantity: number;
  name: string;
  price: number;
  originalPrice: number;
  discountPct: number | null;
  popular?: boolean;
}

/** 결제수단 정의 / Payment method definition */
interface PaymentMethodOption {
  value: string;
  label: string;
  icon: typeof CreditCard;
  desc: string;
}

// ─── 상수 / Constants ─────────────────────────────────────────────────────────

const CREDIT_PACKAGES: CreditPackage[] = [
  { code: 'VIEW_1',   quantity: 1,   name: '1건',    price: 3000,   originalPrice: 3000,   discountPct: null },
  { code: 'VIEW_5',   quantity: 5,   name: '5건',    price: 13000,  originalPrice: 15000,  discountPct: 14 },
  { code: 'VIEW_10',  quantity: 10,  name: '10건',   price: 25000,  originalPrice: 30000,  discountPct: 17 },
  { code: 'VIEW_30',  quantity: 30,  name: '30건',   price: 70000,  originalPrice: 90000,  discountPct: 22 },
  { code: 'VIEW_50',  quantity: 50,  name: '50건',   price: 110000, originalPrice: 150000, discountPct: 27, popular: true },
  { code: 'VIEW_100', quantity: 100, name: '100건',  price: 150000, originalPrice: 300000, discountPct: 50 },
];

const PAYMENT_METHODS: PaymentMethodOption[] = [
  { value: 'CARD', label: '신용/체크카드', icon: CreditCard, desc: 'KG이니시스' },
  { value: 'EASY_PAY', label: '간편결제', icon: Smartphone, desc: '카카오페이, 네이버페이 등' },
  { value: 'TRANSFER', label: '계좌이체', icon: Building2, desc: '실시간 계좌이체' },
];

const MAX_COUPON_LENGTH = 20;

// ─── 헬퍼 함수 / Helper functions ─────────────────────────────────────────────

function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

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

function calcDiscount(price: number, coupon: CouponValidation | null): number {
  if (!coupon || !coupon.valid) return 0;
  if (coupon.discountType === 'PERCENTAGE') {
    return Math.floor(price * (coupon.discountValue / 100));
  }
  return Math.min(coupon.discountValue, price);
}

// ─── 서브컴포넌트 / Sub-components ────────────────────────────────────────────

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

function BalanceCard({ balance }: { balance: CreditBalance }) {
  const totalUsed = balance.credits.reduce((sum, c) => sum + c.usedCredits, 0);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white shadow-lg shadow-blue-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-blue-100">인재 열람권 현황</h2>
          <p className="text-xs text-blue-200">Talent viewing credit status</p>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-blue-200 mb-1">현재 보유 열람권</p>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold tracking-tight">{balance.totalRemaining}</span>
          <span className="text-xl font-semibold text-blue-200 mb-1">건</span>
        </div>
        <p className="text-xs text-blue-200 mt-1">
          이력서를 {balance.totalRemaining}명까지 열람할 수 있습니다
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Eye className="w-3.5 h-3.5 text-blue-200" />
            <span className="text-xs text-blue-200">잔여 열람권</span>
          </div>
          <p className="text-xl font-bold">{balance.totalRemaining}<span className="text-sm font-normal ml-0.5">건</span></p>
        </div>
        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-200" />
            <span className="text-xs text-blue-200">총 사용량</span>
          </div>
          <p className="text-xl font-bold">{totalUsed}<span className="text-sm font-normal ml-0.5">건</span></p>
        </div>
      </div>
    </div>
  );
}

function PackageCard({ pkg, isSelected, onSelect }: { pkg: CreditPackage; isSelected: boolean; onSelect: () => void }) {
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
      {pkg.popular && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
          <Sparkles className="w-3 h-3" />
          인기 패키지
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
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
            {pkg.discountPct !== null && (
              <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                <BadgePercent className="w-3 h-3" />
                {pkg.discountPct}% 할인
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 ml-6">
            건당 {formatWon(perUnit)}
            {pkg.discountPct !== null && (
              <span className="ml-1.5 line-through text-gray-300">
                {formatWon(Math.round(pkg.originalPrice / pkg.quantity))}
              </span>
            )}
          </p>
        </div>

        <div className="text-right shrink-0">
          {pkg.discountPct !== null && (
            <p className="text-xs text-gray-400 line-through mb-0.5">{formatWon(pkg.originalPrice)}</p>
          )}
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
  const router = useRouter();

  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [selectedCode, setSelectedCode] = useState<string>('VIEW_50');
  const [payMethod, setPayMethod] = useState<string>('CARD');

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  // 동의 체크 / Agreement checkbox
  const [agreed, setAgreed] = useState(false);

  const selectedPkg = CREDIT_PACKAGES.find((p) => p.code === selectedCode) ?? CREDIT_PACKAGES[4];
  const discountAmount = calcDiscount(selectedPkg.price, appliedCoupon);
  const finalPrice = selectedPkg.price - discountAmount;

  // ── 잔여 열람권 로드 / Load credit balance ──
  const loadBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/payments/viewing-credits/balance', {
        credentials: 'include',
      });

      if (res.status === 401) {
        setIsLoggedIn(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setBalanceError((data as { message?: string }).message ?? '열람권 정보를 불러오는 데 실패했습니다.');
        return;
      }

      const data = await res.json() as CreditBalance;
      setBalance(data);
    } catch {
      setBalanceError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  // ── 쿠폰 처리 / Coupon handling ──
  const handleApplyCoupon = async () => {
    const trimmed = couponInput.trim();
    if (!trimmed) {
      setCouponError('쿠폰 코드를 입력해주세요.');
      return;
    }

    setCouponLoading(true);
    setCouponError(null);
    setAppliedCoupon(null);

    try {
      const res = await fetch(
        `/api/payments/coupons/validate?code=${encodeURIComponent(trimmed)}&product=TALENT_VIEW`,
        { credentials: 'include' },
      );

      const data = await res.json();

      if (!res.ok || !data.valid) {
        setCouponError(data.message ?? '유효하지 않은 쿠폰입니다.');
        return;
      }

      setAppliedCoupon(data);
      toast.success(`쿠폰 적용 완료! ${
        data.discountType === 'PERCENTAGE'
          ? `${data.discountValue}% 할인`
          : `${formatWon(data.discountValue)} 할인`
      }`);
    } catch {
      setCouponError('쿠폰 확인 중 오류가 발생했습니다.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  // ── 결제 처리 / Payment handling ──
  const handlePayment = async () => {
    if (paying || !agreed) return;

    setPaying(true);
    setPayError('');

    try {
      // 1. 주문 생성 / Create order
      const orderRes = await fetch('/api/payments/orders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: selectedPkg.code,
          couponCode: appliedCoupon ? couponInput.trim() : undefined,
        }),
      });

      const order = await orderRes.json();
      if (!orderRes.ok) {
        setPayError(order.message || '주문 생성에 실패했습니다.');
        setPaying(false);
        return;
      }

      // 2. 포트원 결제창 호출 / Open PortOne checkout
      const payResponse = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || 'store-a2a5e6a1-a425-4720-9c30-6340aca9964d',
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || 'channel-key-5d1a5927-000f-4dd0-a3e0-a8468182cab6',
        paymentId: order.orderNo,
        orderName: order.productName,
        totalAmount: order.totalAmount,
        currency: 'CURRENCY_KRW',
        payMethod: payMethod as 'CARD' | 'EASY_PAY' | 'TRANSFER',
        customer: {
          fullName: '잡차자',
          email: 'customer@jobchaja.com',
          phoneNumber: '01000000000',
        },
      });

      if (!payResponse || payResponse.code) {
        const msg = payResponse?.code === 'USER_CANCEL'
          ? '결제가 취소되었습니다.'
          : `결제 실패: ${payResponse?.message || '알 수 없는 오류'}`;
        setPayError(msg);
        setPaying(false);
        return;
      }

      // 3. 결제 확인 / Confirm payment
      const confirmRes = await fetch(`/api/payments/orders/${order.orderId}/confirm`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portonePaymentId: payResponse.paymentId }),
      });

      if (!confirmRes.ok) {
        setPayError('결제 확인 중 문제가 발생했습니다. 고객센터에 문의해주세요.');
        setPaying(false);
        return;
      }

      // 4. 성공 → 리다이렉트 / Success → redirect
      const params = new URLSearchParams({
        orderId: String(order.orderId),
        productCode: selectedPkg.code,
        productName: order.productName || '',
      });
      router.push(`/company/payments/success?${params.toString()}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setPayError(`결제 처리 중 오류: ${msg}`);
    } finally {
      setPaying(false);
    }
  };

  // ── 렌더링 / Render ──
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-32">

      {/* 헤더 / Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/company/payments"
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">열람권 구매</h1>
          <p className="text-sm text-gray-500">Talent Viewing Credits</p>
        </div>
      </div>

      {loadingBalance && <SkeletonBalanceCard />}

      {!loadingBalance && !isLoggedIn && <NotLoggedIn />}

      {!loadingBalance && isLoggedIn && (
        <>
          {balanceError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {balanceError}
            </div>
          )}

          {balance && <BalanceCard balance={balance} />}

          {/* ── 패키지 선택 / Package selection ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">열람권 패키지</h2>
                <p className="text-xs text-gray-500 mt-0.5">많이 구매할수록 단가가 낮아집니다</p>
              </div>
            </div>

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

            {/* ── 결제수단 선택 / Payment method selection ── */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">결제수단</h3>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  const active = payMethod === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setPayMethod(m.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition ${
                        active ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                        active ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {active && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      </div>
                      <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium ${active ? 'text-blue-700' : 'text-gray-700'}`}>{m.label}</span>
                        <span className="text-xs text-gray-400 ml-2">{m.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 쿠폰 / Coupon ── */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Ticket className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">할인 쿠폰</h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">{appliedCoupon.couponName ?? '쿠폰 적용됨'}</p>
                      <p className="text-xs text-green-600">
                        {appliedCoupon.discountType === 'PERCENTAGE'
                          ? `${appliedCoupon.discountValue}% 할인 적용`
                          : `${formatWon(appliedCoupon.discountValue)} 할인 적용`}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    제거
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.slice(0, MAX_COUPON_LENGTH).toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="쿠폰 코드 입력"
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
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '적용'}
                    </button>
                  </div>
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
              <h3 className="text-sm font-semibold text-gray-700 mb-3">결제 정보</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{selectedPkg.name} 열람권</span>
                  <span className="text-gray-900 font-medium">{formatWon(selectedPkg.price)}</span>
                </div>
                {selectedPkg.discountPct !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">패키지 할인 ({selectedPkg.discountPct}%)</span>
                    <span className="text-red-500 font-medium">-{formatWon(selectedPkg.originalPrice - selectedPkg.price)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">쿠폰 할인</span>
                    <span className="text-red-500 font-medium">-{formatWon(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">총 결제금액</span>
                    <span className="text-xl font-extrabold text-blue-600">{formatWon(finalPrice)}</span>
                  </div>
                  <p className="text-xs text-gray-400 text-right mt-0.5">
                    열람권 {selectedPkg.quantity}건 지급 · VAT 포함
                  </p>
                </div>
              </div>
            </div>

            {/* ── 동의 / Agreement ── */}
            <label className="flex items-start gap-2.5 cursor-pointer mb-5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500 leading-relaxed">
                상품 정보 및 결제에 동의합니다. 열람권은 구매 즉시 지급되며,
                <span className="text-gray-700 font-medium"> 미사용분에 한해 환불</span>이 가능합니다.
              </span>
            </label>

            {/* 결제 에러 / Payment error */}
            {payError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {payError}
              </div>
            )}
          </section>

          {/* ── 하단 고정 결제 버튼 / Fixed bottom pay button ── */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
            <div className="max-w-2xl mx-auto">
              <button
                type="button"
                onClick={handlePayment}
                disabled={paying || !agreed}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {paying ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> 결제 처리 중...</>
                ) : (
                  <><Shield className="w-4 h-4" /> {formatWon(finalPrice)} 결제하기</>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Shield className="w-3 h-3 text-gray-300" />
                <span className="text-[10px] text-gray-400">KG이니시스 안전결제 | 개인정보 보호</span>
              </div>
            </div>
          </div>

          {/* ── 사용 내역 / Usage history ── */}
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">최근 사용 내역</h2>
                <p className="text-xs text-gray-500 mt-0.5">Recent usage history</p>
              </div>
              <Link
                href="/company/talents"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition"
              >
                인재 목록 보기
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <UsageHistorySection />
          </section>
        </>
      )}
    </div>
  );
}

// ─── 사용 내역 서브컴포넌트 / Usage history sub-component ─────────────────────

interface UsageHistoryItem {
  id: string;
  jobSeekerId: string;
  usedAt: string;
  jobSeekerName?: string;
}

function UsageHistorySection() {
  const [history, setHistory] = useState<UsageHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/payments/viewing-credits/history', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.items ?? []);
          setHistory(items);
        }
      } catch {
        // 조용히 실패 — 빈 상태 표시 / Silent fail — show empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <h3 className="text-sm font-semibold text-gray-600 mb-1.5">아직 사용 내역이 없습니다</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          열람권을 사용하여 인재의 이력서와 연락처를 확인해보세요.
        </p>
        <Link
          href="/company/talents"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition"
        >
          <Eye className="w-3.5 h-3.5" />
          인재 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((item) => (
        <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.jobSeekerName ?? `구직자 #${item.jobSeekerId.slice(0, 8)}`}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{formatDateKo(item.usedAt)}</p>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full shrink-0">-1건</span>
        </div>
      ))}
    </div>
  );
}
