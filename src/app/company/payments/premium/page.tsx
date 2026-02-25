'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Star, Clock, Check, Tag,
  Loader2, AlertCircle, Crown, CreditCard,
  Smartphone, Building2, ChevronRight, Shield,
} from 'lucide-react';
import * as PortOne from '@portone/browser-sdk/v2';

/* ================================================================
 * 상위노출 기간 옵션 / Premium listing duration options
 * 채용관별 분리: 알바채용관(ALBA_) / 정규채용관(FULL_)
 * 약관 기준 런칭 특가 / Per terms of service (launch pricing)
 * ================================================================ */
interface PremiumPlan {
  days: number;
  price: number;
  originalPrice: number;
  discountPct: number;
  label: string;
  popular?: boolean;
}

/** 기간별 요금 (알바/정규 동일) / Duration pricing (same for both boards) */
const DURATION_OPTIONS: PremiumPlan[] = [
  { days: 7,  price: 19000,  originalPrice: 49000,  discountPct: 61, label: '7일' },
  { days: 14, price: 29000,  originalPrice: 79000,  discountPct: 63, label: '14일' },
  { days: 30, price: 50000,  originalPrice: 130000, discountPct: 62, label: '30일', popular: true },
  { days: 60, price: 79000,  originalPrice: 199000, discountPct: 60, label: '60일' },
];

/** boardType → 상품 코드 prefix 매핑 / Map boardType to product code prefix */
function getProductCode(boardType: string, days: number): string {
  const prefix = boardType === 'PART_TIME' ? 'ALBA_PREMIUM' : 'FULL_PREMIUM';
  return `${prefix}_${days}D`;
}

/** 채용관 한글 라벨 / Board type Korean label */
function getBoardLabel(boardType: string): string {
  return boardType === 'PART_TIME' ? '알바채용관' : '정규채용관';
}

/* 결제수단 옵션 / Payment method options */
type PayMethodType = 'CARD' | 'EASY_PAY' | 'TRANSFER';
interface PayMethodOption {
  value: PayMethodType;
  label: string;
  icon: typeof CreditCard;
  desc: string;
}
const PAY_METHODS: PayMethodOption[] = [
  { value: 'CARD',     label: '신용/체크카드', icon: CreditCard,  desc: 'KG이니시스' },
  { value: 'EASY_PAY', label: '간편결제',      icon: Smartphone,  desc: '카카오페이, 네이버페이 등' },
  { value: 'TRANSFER', label: '계좌이체',      icon: Building2,   desc: '실시간 계좌이체' },
];

/* 공고 정보 / Job posting info */
interface JobInfo {
  id: number;
  title: string;
  status: string;
  boardType: string;
  tierType?: string;
  premiumEndAt?: string;
  closingDate?: string;
  allowedVisas?: string[];
}

/**
 * 상위노출권 구매 페이지 / Premium listing purchase page
 *
 * URL params:
 * - jobId: 대상 공고 ID / Target job posting ID
 */
export default function PremiumPurchasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId') || '';

  /* State */
  const [job, setJob] = useState<JobInfo | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [payMethod, setPayMethod] = useState<PayMethodType>('CARD');
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);
  const [error, setError] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const plan = DURATION_OPTIONS.find(p => p.days === selectedDays)!;
  const productCode = job ? getProductCode(job.boardType, selectedDays) : '';
  const finalAmount = Math.max(0, plan.price - discount);

  /* 공고 정보 + 유저 프로필 조회 / Fetch job info + user profile */
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');

    // 유저 이메일 조회 / Fetch user email for PG
    if (sessionId) {
      fetch('/api/auth/profile', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${sessionId}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.user?.email) setUserEmail(data.user.email); })
        .catch(() => {});
    }

    // 공고 정보 조회 / Fetch job info
    if (!jobId) { setJobLoading(false); return; }
    fetch(`/api/jobs/${jobId}`, {
      credentials: 'include',
      headers: sessionId ? { 'Authorization': `Bearer ${sessionId}` } : {},
    })
      .then(r => r.json())
      .then(data => {
        if (data.id || data.jobId) {
          setJob({
            id: data.id || Number(data.jobId),
            title: data.title || '(제목 없음)',
            status: data.status,
            boardType: data.boardType,
            tierType: data.tierType,
            premiumEndAt: data.premiumEndAt,
            closingDate: data.closingDate,
            allowedVisas: data.allowedVisas ? (typeof data.allowedVisas === 'string' ? data.allowedVisas.split(',') : data.allowedVisas) : [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setJobLoading(false));
  }, [jobId]);

  /* 쿠폰 적용 / Apply coupon */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setError('');
    try {
      const res = await fetch(`/api/payments/coupons/validate?code=${couponCode}&product=JOB_POSTING`);
      const data = await res.json();
      if (!res.ok) {
        setCouponResult(null); setDiscount(0);
        setError(data.message || '유효하지 않은 쿠폰입니다.');
        return;
      }
      setCouponResult(data);
      let d = 0;
      if (data.type === 'FIXED_DISCOUNT') d = Math.min(data.value, plan.price);
      else if (data.type === 'PERCENT_DISCOUNT') d = Math.floor(plan.price * (data.value / 100));
      setDiscount(d);
    } catch { setError('쿠폰 검증에 실패했습니다.'); }
  };

  /* 쿠폰 제거 / Remove coupon */
  const handleRemoveCoupon = () => {
    setCouponResult(null); setCouponCode(''); setDiscount(0);
  };

  /* 플랜 변경 시 쿠폰 재계산 / Recalculate coupon on plan change */
  const handlePlanChange = (days: number) => {
    setSelectedDays(days);
    if (couponResult) {
      const p = DURATION_OPTIONS.find(pl => pl.days === days)!;
      let d = 0;
      if (couponResult.type === 'FIXED_DISCOUNT') d = Math.min(couponResult.value, p.price);
      else if (couponResult.type === 'PERCENT_DISCOUNT') d = Math.floor(p.price * (couponResult.value / 100));
      setDiscount(d);
    }
  };

  /* 결제 처리 / Process payment */
  const handlePayment = async () => {
    if (loading || !jobId || !agreedTerms) return;
    setLoading(true); setError('');

    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) { setError('로그인이 필요합니다. 다시 로그인 해주세요.'); setLoading(false); return; }

      // 1. 주문 생성 / Create order
      const orderRes = await fetch('/api/payments/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          productCode,
          targetJobId: parseInt(jobId),
          couponCode: couponResult ? couponCode : undefined,
        }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) { setError(order.message || '주문 생성에 실패했습니다.'); setLoading(false); return; }

      // 2. 포트원 결제 수단 매핑 / Map pay method for PortOne V2
      const portoneMethod = payMethod === 'CARD' ? 'CARD'
        : payMethod === 'EASY_PAY' ? 'EASY_PAY'
        : 'TRANSFER';

      // 3. 환경변수 확인 / Verify env vars
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
      if (!storeId || !channelKey) {
        setError('결제 설정 오류: 포트원 키가 설정되지 않았습니다.');
        setLoading(false);
        return;
      }

      // 4. 포트원 V2 결제창 호출 / Open PortOne V2 checkout (KG이니시스)
      const paymentResponse = await PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId: order.orderNo,
        orderName: order.productName,
        totalAmount: order.totalAmount,
        currency: 'CURRENCY_KRW',
        payMethod: portoneMethod,
        customer: {
          fullName: '잡차자',
          email: userEmail || 'customer@jobchaja.com',
          phoneNumber: '01000000000',
        },
      });

      if (!paymentResponse || paymentResponse.code) {
        const msg = paymentResponse?.code === 'USER_CANCEL'
          ? '결제가 취소되었습니다.'
          : `결제 실패: ${paymentResponse?.message || '알 수 없는 오류'}`;
        setError(msg); setLoading(false); return;
      }

      // 5. 결제 확인 / Confirm payment
      const confirmRes = await fetch(`/api/payments/orders/${order.orderId}/confirm`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`,
        },
        body: JSON.stringify({ portonePaymentId: paymentResponse.paymentId }),
      });
      if (!confirmRes.ok) {
        setError('결제 확인 중 문제가 발생했습니다. 고객센터에 문의해주세요.');
        setLoading(false); return;
      }

      // 6. 성공 / Success
      const params = new URLSearchParams({
        orderId: String(order.orderId),
        productCode,
        productName: order.productName || '',
        jobId,
      });
      router.push(`/company/payments/success?${params.toString()}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`결제 처리 중 오류: ${msg}`);
    } finally { setLoading(false); }
  };

  /* 프리미엄 잔여일 계산 / Remaining premium days */
  const remainingDays = (() => {
    if (!job?.premiumEndAt) return null;
    const diff = Math.ceil((new Date(job.premiumEndAt).getTime() - Date.now()) / 86400000);
    return diff > 0 ? diff : null;
  })();

  /* 공고 없음 / No job selected */
  if (!jobId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">공고를 선택해주세요.</p>
        <button onClick={() => router.push('/company/jobs')}
          className="text-blue-600 text-sm font-medium hover:text-blue-700">
          공고 관리로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-32">
      {/* ── 헤더 / Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push('/company/jobs')}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">상위노출 구매</h1>
          <p className="text-xs text-gray-500">공고를 상위에 노출하여 더 많은 지원자를 확보하세요</p>
        </div>
      </div>

      {/* ── STEP 1: 대상 공고 / Target job ── */}
      <section className="mb-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">대상 공고</h2>
        {jobLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            <span className="text-sm text-gray-400">불러오는 중...</span>
          </div>
        ) : job ? (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                    {job.boardType === 'PART_TIME' ? '아르바이트' : '정규직'}
                  </span>
                  {job.tierType === 'PREMIUM' && (
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-medium flex items-center gap-0.5">
                      <Star className="w-3 h-3" /> 프리미엄
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm truncate">{job.title}</h3>
                {job.allowedVisas && job.allowedVisas.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {job.allowedVisas.slice(0, 4).map(v => (
                      <span key={v} className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 rounded">{v}</span>
                    ))}
                    {job.allowedVisas.length > 4 && (
                      <span className="text-xs text-gray-400">+{job.allowedVisas.length - 4}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {remainingDays && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-amber-600">
                현재 상위노출 잔여 <b>{remainingDays}일</b> — 추가 구매 시 기간이 합산됩니다
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-sm text-yellow-700">
            공고 정보를 불러올 수 없습니다. 공고 관리에서 다시 시도해주세요.
          </div>
        )}
      </section>

      {/* ── STEP 2: 기간 선택 / Duration selection ── */}
      <section className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-800">
            {job ? `${getBoardLabel(job.boardType)} 상위노출` : '노출 기간 선택'}
          </h2>
          <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded">런칭특가 최대 63% 할인</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {DURATION_OPTIONS.map((p) => {
            const isSelected = selectedDays === p.days;
            return (
              <button key={p.days} onClick={() => handlePlanChange(p.days)}
                className={`relative rounded-xl border-2 p-3.5 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                {p.popular && (
                  <span className="absolute -top-2.5 left-3 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider">
                    BEST
                  </span>
                )}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex items-baseline gap-1 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-bold text-gray-900">{p.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-lg font-extrabold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                    {p.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">원</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-gray-400 line-through">{p.originalPrice.toLocaleString()}원</span>
                  <span className="text-[11px] font-bold text-red-500">-{p.discountPct}%</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  일 {Math.round(p.price / p.days).toLocaleString()}원
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── STEP 3: 결제수단 선택 / Payment method ── */}
      <section className="mb-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">결제수단</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {PAY_METHODS.map((m) => {
            const Icon = m.icon;
            const isSelected = payMethod === m.value;
            return (
              <button key={m.value} onClick={() => setPayMethod(m.value)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition ${
                  isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                  isSelected ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                </div>
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {m.label}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">{m.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── STEP 4: 쿠폰 / Coupon ── */}
      <section className="mb-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">할인 쿠폰</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {couponResult ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">{couponResult.name}</span>
                <span className="text-sm text-green-600">(-{discount.toLocaleString()}원)</span>
              </div>
              <button onClick={handleRemoveCoupon} className="text-xs text-gray-400 hover:text-red-500">제거</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                placeholder="쿠폰 코드를 입력하세요"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300" />
              <button onClick={handleApplyCoupon}
                className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition shrink-0">
                적용
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 결제 요약 / Payment summary ── */}
      <section className="mb-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">결제 정보</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">상품</span>
              <span className="text-gray-800">상위노출 {plan.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">정상가</span>
              <span className="text-gray-400 line-through">{plan.originalPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">런칭특가</span>
              <span className="text-gray-800">{plan.price.toLocaleString()}원</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>쿠폰 할인</span>
                <span>-{discount.toLocaleString()}원</span>
              </div>
            )}
            <hr className="my-3!" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">총 결제금액</span>
              <span className="text-xl font-extrabold text-blue-600">{finalAmount.toLocaleString()}원</span>
            </div>
            <p className="text-[11px] text-gray-400 text-right">VAT 포함</p>
          </div>
        </div>
      </section>

      {/* ── 약관 동의 / Terms agreement ── */}
      <section className="mb-5">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-xs text-gray-500 leading-relaxed">
            상품 정보 및 결제에 동의합니다. 상위노출은 결제 즉시 적용되며,
            <span className="text-gray-700 font-medium"> 시작 후 잔여 기간 비례 환불</span>이 가능합니다.
            <button type="button" className="text-blue-500 underline ml-0.5">이용약관</button>
          </span>
        </label>
      </section>

      {/* ── 에러 / Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── 결제 버튼 (고정) / Fixed payment button ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-3xl mx-auto">
          <button onClick={handlePayment}
            disabled={loading || !job || !agreedTerms}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> 결제 처리 중...</>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                {finalAmount.toLocaleString()}원 결제하기
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Shield className="w-3 h-3 text-gray-300" />
            <span className="text-[10px] text-gray-400">KG이니시스 안전결제 | 개인정보 보호</span>
          </div>
        </div>
      </div>
    </div>
  );
}
