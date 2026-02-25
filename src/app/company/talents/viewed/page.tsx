'use client';

/**
 * 최근 열람한 인재 페이지 / Recently Viewed Talents page
 * - 열람권을 사용해 이력서를 열람한 인재 목록
 * - List of talents whose resumes were viewed using credits
 * - 전용 API 미구현 → Coming Soon + 안내 UI
 * - Dedicated API not yet implemented → Coming Soon + guidance UI
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Eye,
  CreditCard,
  LogIn,
  Clock,
  Users,
  ChevronRight,
  AlertCircle,
  ArrowRight,
  ShoppingCart,
  CheckCircle2,
  History,
} from 'lucide-react';

// ─── 타입 정의 / Type definitions ─────────────────────────────────────────────

/** 잔여 열람권 잔고 / Viewing credit balance */
interface CreditBalance {
  balance: number;    // 잔여 열람권 / Remaining credits
  totalUsed: number;  // 총 사용 수 / Total used
}

// ─── 서브컴포넌트 / Sub-components ────────────────────────────────────────────

/** 스켈레톤 카드 / Skeleton loading card */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        <div>
          <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-gray-100 rounded-xl" />
        <div className="h-16 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

/** 미로그인 상태 컴포넌트 / Not logged in component */
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
        열람한 인재 목록을 확인하려면 로그인하세요.
        <br />
        Log in to view your recently viewed talents.
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

/** 열람권 현황 카드 / Credit balance card */
interface CreditMiniCardProps {
  balance: CreditBalance;
}

function CreditMiniCard({ balance }: CreditMiniCardProps) {
  return (
    <div className="bg-linear-to-r from-indigo-600 to-blue-600 rounded-2xl p-5 text-white shadow-md shadow-indigo-200 mb-6">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 아이콘 + 라벨 / Left: icon + label */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-indigo-200">인재 열람권 현황</p>
            <p className="text-sm font-semibold text-white">
              Talent Viewing Credits
            </p>
          </div>
        </div>

        {/* 오른쪽: 잔고 숫자 / Right: balance number */}
        <div className="text-right">
          <p className="text-3xl font-bold tracking-tight">
            {balance.balance}
            <span className="text-lg font-semibold text-indigo-200 ml-1">건</span>
          </p>
          <p className="text-xs text-indigo-200 mt-0.5">총 {balance.totalUsed}건 사용</p>
        </div>
      </div>

      {/* 하단 사용 현황 바 / Bottom usage bar */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* 잔여 / Remaining */}
        <div className="bg-white/15 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Eye className="w-3.5 h-3.5 text-indigo-200" />
            <span className="text-xs text-indigo-200">잔여 열람권</span>
          </div>
          <p className="text-lg font-bold">
            {balance.balance}
            <span className="text-xs font-normal ml-0.5">건</span>
          </p>
        </div>
        {/* 사용 완료 / Used */}
        <div className="bg-white/15 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <History className="w-3.5 h-3.5 text-indigo-200" />
            <span className="text-xs text-indigo-200">총 열람</span>
          </div>
          <p className="text-lg font-bold">
            {balance.totalUsed}
            <span className="text-xs font-normal ml-0.5">건</span>
          </p>
        </div>
      </div>

      {/* 잔고 없을 때 구매 안내 / Low balance CTA */}
      {balance.balance === 0 && (
        <div className="mt-3 bg-white/15 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs text-indigo-100">
            열람권이 없습니다. 구매 후 이력서를 열람해보세요.
          </p>
          <Link
            href="/company/payments/credits"
            className="flex items-center gap-1 text-xs font-semibold text-white bg-white/25 hover:bg-white/35 px-3 py-1.5 rounded-lg transition whitespace-nowrap"
          >
            구매하기
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

/** 열람권 현황 에러 / Credit card error */
function CreditCardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        열람권 정보를 불러오지 못했습니다.
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition whitespace-nowrap"
      >
        재시도
      </button>
    </div>
  );
}

/** 최근 열람 빈 상태 카드 / Empty viewed state card */
function EmptyViewedCard() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center mb-6">
      {/* 아이콘 / Icon */}
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Eye className="w-8 h-8 text-indigo-300" />
      </div>

      {/* 메시지 / Message */}
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        최근 열람한 인재가 없습니다
      </h3>
      <p className="text-sm text-gray-400 mb-2 leading-relaxed">
        열람권을 사용해 이력서를 확인한 인재가 <br />
        이 페이지에 자동으로 기록됩니다.
      </p>
      <p className="text-xs text-gray-300 mb-6">
        Resumes you&apos;ve viewed using credits will appear here automatically.
      </p>

      {/* Coming Soon 배지 / Coming Soon badge */}
      <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-6">
        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
        <span className="text-xs font-semibold text-indigo-600">
          열람 내역 기능 준비 중 / Feature coming soon
        </span>
      </div>

      {/* 액션 버튼 2개 / Two action buttons */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {/* 열람권 구매 / Buy credits */}
        <Link
          href="/company/payments/credits"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
        >
          <ShoppingCart className="w-4 h-4" />
          열람권 구매
        </Link>
        {/* 지원자 관리 / Applicant management */}
        <Link
          href="/company/applicants"
          className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition"
        >
          지원자 관리로 이동
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/** 열람권 사용 안내 카드 / Credit usage guide card */
function CreditUsageGuideCard() {
  // 열람권 관련 핵심 정보 / Key credit info items
  const infoItems: { label: string; value: string; highlight?: boolean }[] = [
    { label: '이력서 1건 열람 시', value: '열람권 1건 차감', highlight: true },
    { label: '열람 후 재열람', value: '추가 차감 없음' },
    { label: '열람 유효기간', value: '구매일로부터 1년' },
    { label: '미사용 열람권', value: '환불 불가 (이용약관)' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">열람권 사용 안내</h2>
          <p className="text-xs text-gray-400">Viewing credit usage guide</p>
        </div>
      </div>

      {/* 안내 항목 목록 / Info item list */}
      <div className="space-y-2.5">
        {infoItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0"
          >
            <span className="text-sm text-gray-600">{item.label}</span>
            <span
              className={`text-sm font-semibold ${
                item.highlight ? 'text-indigo-600' : 'text-gray-700'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* 열람권 구매 링크 / Buy credits link */}
      <Link
        href="/company/payments/credits"
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-indigo-200 bg-indigo-50 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition"
      >
        <CreditCard className="w-4 h-4" />
        열람권 패키지 보기
        <ChevronRight className="w-4 h-4 ml-auto" />
      </Link>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function TalentViewedPage() {
  /** 잔여 열람권 잔고 / Credit balance */
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  /** 잔고 로딩 / Loading balance */
  const [loadingBalance, setLoadingBalance] = useState(true);
  /** 로그인 여부 / Logged in */
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  /** 잔고 에러 / Balance error */
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // ── 잔여 열람권 잔고 조회 / Fetch credit balance ──────────────────────────
  const loadBalance = useCallback(async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      // 세션 없음 → 미로그인 / No session → not logged in
      setIsLoggedIn(false);
      setLoadingBalance(false);
      return;
    }

    setLoadingBalance(true);
    setBalanceError(null);

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
        const data = await res.json().catch(() => ({})) as { message?: string };
        setBalanceError(data.message ?? '열람권 정보를 불러오는 데 실패했습니다.');
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

  // 마운트 시 잔고 조회 / Load balance on mount
  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  // ── 렌더링 / Render ───────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">최근 열람한 인재</h1>
          <p className="text-sm text-gray-500 mt-0.5">Recently Viewed Talents</p>
        </div>
        {/* 총 열람 수 / Total viewed count */}
        {!loadingBalance && isLoggedIn && balance && (
          <span className="text-sm text-gray-400">
            총 <span className="font-semibold text-gray-700">{balance.totalUsed}</span>건 열람
          </span>
        )}
      </div>

      {/* ── 로딩 / Loading ── */}
      {loadingBalance && <SkeletonCard />}

      {/* ── 미로그인 / Not logged in ── */}
      {!loadingBalance && !isLoggedIn && <NotLoggedIn />}

      {/* ── 로그인 상태 콘텐츠 / Logged-in content ── */}
      {!loadingBalance && isLoggedIn && (
        <>
          {/* 잔고 에러 / Balance error */}
          {balanceError && (
            <CreditCardError onRetry={loadBalance} />
          )}

          {/* 열람권 현황 카드 / Credit balance card */}
          {balance && <CreditMiniCard balance={balance} />}

          {/* 빈 상태: 열람 내역 없음 / Empty state: no viewed history */}
          <EmptyViewedCard />

          {/* 열람권 사용 안내 / Credit usage guide */}
          <CreditUsageGuideCard />

          {/* 하단 퀵 링크 / Bottom quick links */}
          <div className="grid grid-cols-2 gap-3">
            {/* 지원자 관리 바로가기 / Go to applicant management */}
            <Link
              href="/company/applicants"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                  지원자 관리
                </span>
              </div>
              <p className="text-xs text-gray-400">
                공고별 지원자를 확인하고 이력서를 열람하세요.
              </p>
            </Link>

            {/* 열람권 구매 바로가기 / Go to credits purchase */}
            <Link
              href="/company/payments/credits"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-indigo-500" />
                </div>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                  열람권 구매
                </span>
              </div>
              <p className="text-xs text-gray-400">
                다양한 패키지로 열람권을 구매하세요.
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
