'use client';

/**
 * 인재 북마크(즐겨찾기) 페이지 / Talent Bookmarks page
 * - 열람권으로 이력서를 열람한 후 북마크한 인재 목록
 * - Bookmarked talents after viewing resumes with credits
 * - 전용 API 미구현 → Coming Soon + 안내 UI
 * - Dedicated API not yet implemented → Coming Soon + guidance UI
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  CreditCard,
  Eye,
  LogIn,
  Users,
  ChevronRight,
  AlertCircle,
  ArrowRight,
  FileText,
  CheckCircle2,
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
        북마크한 인재를 확인하려면 로그인하세요.
        <br />
        Log in to view your bookmarked talents.
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

/** 열람권 현황 카드 / Credit balance mini card */
interface CreditMiniCardProps {
  balance: CreditBalance;
}

function CreditMiniCard({ balance }: CreditMiniCardProps) {
  return (
    <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-md shadow-blue-200 mb-6">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 아이콘 + 라벨 / Left: icon + label */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-blue-200">인재 열람권 현황</p>
            <p className="text-sm font-semibold text-white">
              Talent Viewing Credits
            </p>
          </div>
        </div>

        {/* 오른쪽: 잔고 숫자 / Right: balance number */}
        <div className="text-right">
          <p className="text-3xl font-bold tracking-tight">
            {balance.balance}
            <span className="text-lg font-semibold text-blue-200 ml-1">건</span>
          </p>
          <p className="text-xs text-blue-200 mt-0.5">총 {balance.totalUsed}건 사용</p>
        </div>
      </div>

      {/* 잔고 없을 때 안내 / Low balance notice */}
      {balance.balance === 0 && (
        <div className="mt-4 bg-white/15 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs text-blue-100">
            열람권이 없습니다. 구매 후 인재 이력서를 열람하세요.
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

/** 열람권 현황 카드 에러 / Credit card error state */
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

/** 사용 방법 안내 스텝 카드 / How-to guide steps card */
function HowToGuideCard() {
  // 인재 북마크 3단계 안내 / 3-step guide for talent bookmarking
  const steps: { icon: React.ReactNode; title: string; desc: string }[] = [
    {
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      title: '지원자 관리에서 이력서 열람',
      desc: '지원한 후보자의 이력서를 열람권 1건 사용으로 열람합니다.',
    },
    {
      icon: <Eye className="w-5 h-5 text-purple-500" />,
      title: '이력서 상세 확인',
      desc: '국적, 비자 종류, 경력, 학력, 자기소개 등 상세 정보를 확인합니다.',
    },
    {
      icon: <Bookmark className="w-5 h-5 text-amber-500" />,
      title: '북마크 등록',
      desc: '관심 인재를 북마크하면 이 페이지에서 빠르게 다시 확인할 수 있습니다.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
          <Bookmark className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">인재 북마크 사용 방법</h2>
          <p className="text-xs text-gray-400">How to bookmark talents</p>
        </div>
      </div>

      {/* 단계 목록 / Steps list */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {/* 단계 번호 + 아이콘 / Step number + icon */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-9 h-9 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                {step.icon}
              </div>
              {/* 연결선 (마지막 제외) / Connector line (except last) */}
              {idx < steps.length - 1 && (
                <div className="w-px h-4 bg-gray-200 mt-1" />
              )}
            </div>

            {/* 내용 / Content */}
            <div className="pt-1.5">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-gray-400">
                  STEP {idx + 1}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">
                {step.title}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 북마크 빈 상태 카드 / Empty bookmark state card */
function EmptyBookmarksCard() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center mb-6">
      {/* 아이콘 / Icon */}
      <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Bookmark className="w-8 h-8 text-amber-300" />
      </div>

      {/* 메시지 / Message */}
      <h3 className="text-base font-semibold text-gray-700 mb-2">
        북마크한 인재가 없습니다
      </h3>
      <p className="text-sm text-gray-400 mb-2 leading-relaxed">
        이력서를 열람한 후 관심 인재를 북마크하면 <br />
        이 페이지에서 모아볼 수 있습니다.
      </p>
      <p className="text-xs text-gray-300 mb-6">
        No bookmarked talents yet. View resumes and bookmark candidates you&apos;re interested in.
      </p>

      {/* Coming Soon 배지 / Coming Soon badge */}
      <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-xs font-semibold text-blue-600">
          북마크 기능 준비 중 / Feature coming soon
        </span>
      </div>

      {/* 지원자 관리 바로가기 / Go to applicant management */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href="/company/applicants"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          지원자 관리로 이동
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function TalentBookmarksPage() {
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
          <h1 className="text-xl font-bold text-gray-900">인재 북마크</h1>
          <p className="text-sm text-gray-500 mt-0.5">Bookmarked Talents</p>
        </div>
        {/* 관심 인재 수 (항상 0 — 기능 준비 중) / Bookmark count (always 0 — coming soon) */}
        <span className="text-sm text-gray-400">
          총 <span className="font-semibold text-gray-700">0</span>명
        </span>
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

          {/* 빈 상태: 북마크 없음 / Empty state: no bookmarks */}
          <EmptyBookmarksCard />

          {/* 사용 방법 안내 / How-to guide */}
          <HowToGuideCard />

          {/* 하단 안내: 열람권 구매 유도 / Bottom CTA: buy credits */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  열람권으로 인재를 확인해보세요
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  지원자 이력서를 열람하고 관심 인재를 북마크하세요.
                </p>
              </div>
            </div>
            <Link
              href="/company/payments/credits"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition whitespace-nowrap"
            >
              열람권 구매
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
