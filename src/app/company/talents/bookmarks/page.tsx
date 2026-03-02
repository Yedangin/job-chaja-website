'use client';

/**
 * 인재 북마크(즐겨찾기) 페이지 / Talent Bookmarks page
 * - 열람권으로 이력서를 열람한 후 북마크한 인재 목록
 * - Bookmarked talents after viewing resumes with credits
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  BookmarkX,
  CreditCard,
  LogIn,
  Users,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Globe,
  Briefcase,
  MapPin,
} from 'lucide-react';

// ─── 타입 정의 / Type definitions ─────────────────────────────────────────────

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
  }[];
}

/** 북마크 인재 / Bookmarked talent */
interface BookmarkedTalent {
  bookmarkId: number;
  resumeId: number;
  nationality: string;
  topikLevel: number | null;
  kiipLevel: number | null;
  preferredJobTypes: string[];
  preferredRegions: string[];
  workExperienceCount: number;
  bookmarkedAt: string;
  updatedAt: string;
}

/** 국적 라벨 / Nationality labels */
const NATIONALITY_LABELS: Record<string, string> = {
  VN: '🇻🇳 베트남', PH: '🇵🇭 필리핀', TH: '🇹🇭 태국', ID: '🇮🇩 인도네시아',
  CN: '🇨🇳 중국', KH: '🇰🇭 캄보디아', MM: '🇲🇲 미얀마', NP: '🇳🇵 네팔',
  UZ: '🇺🇿 우즈베키스탄', MN: '🇲🇳 몽골', BD: '🇧🇩 방글라데시', LK: '🇱🇰 스리랑카',
};

// ─── 서브컴포넌트 / Sub-components ────────────────────────────────────────────

/** 열람권 현황 카드 / Credit balance mini card */
function CreditMiniCard({ balance }: { balance: CreditBalance }) {
  const totalUsed = balance.credits.reduce((sum, c) => sum + c.usedCredits, 0);

  return (
    <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-md shadow-blue-200 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-blue-200">인재 열람권 현황</p>
            <p className="text-sm font-semibold text-white">Talent Viewing Credits</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tracking-tight">
            {balance.totalRemaining}
            <span className="text-lg font-semibold text-blue-200 ml-1">건</span>
          </p>
          <p className="text-xs text-blue-200 mt-0.5">총 {totalUsed}건 사용</p>
        </div>
      </div>
    </div>
  );
}

/** 인재 카드 / Talent card */
function TalentCard({
  talent,
  onRemove,
  removing,
}: {
  talent: BookmarkedTalent;
  onRemove: (resumeId: number) => void;
  removing: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-200 transition group">
      {/* 헤더: 국적 + 북마크 해제 / Header: nationality + unbookmark */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-800">
            {NATIONALITY_LABELS[talent.nationality] || talent.nationality}
          </span>
          {talent.topikLevel && talent.topikLevel > 0 && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              TOPIK {talent.topikLevel}급
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onRemove(talent.resumeId)}
          disabled={removing}
          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
          title="북마크 해제 / Remove bookmark"
        >
          <BookmarkX className="w-4 h-4" />
        </button>
      </div>

      {/* 희망 직종 / Preferred job types */}
      {talent.preferredJobTypes.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {talent.preferredJobTypes.slice(0, 3).map((jt) => (
            <span key={jt} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {jt}
            </span>
          ))}
          {talent.preferredJobTypes.length > 3 && (
            <span className="text-xs text-gray-400">+{talent.preferredJobTypes.length - 3}</span>
          )}
        </div>
      )}

      {/* 희망 지역 / Preferred regions */}
      {talent.preferredRegions.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {talent.preferredRegions.slice(0, 3).map((r) => (
            <span key={r} className="text-xs text-gray-500">{r}</span>
          ))}
        </div>
      )}

      {/* 하단: 경력 + 북마크 날짜 / Bottom: experience + date */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          경력 {talent.workExperienceCount}건
        </span>
        <span className="text-xs text-gray-400">
          {new Date(talent.bookmarkedAt).toLocaleDateString('ko-KR')} 북마크
        </span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════
export default function TalentBookmarksPage() {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [talents, setTalents] = useState<BookmarkedTalent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // 잔여 열람권 조회 / Fetch credit balance
  const loadBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/payments/viewing-credits/balance', {
        credentials: 'include',
      });
      if (res.status === 401) { setIsLoggedIn(false); return; }
      if (res.ok) {
        const data = await res.json() as CreditBalance;
        setBalance(data);
      }
    } catch { /* 무시 / Ignore */ }
  }, []);

  // 북마크 목록 조회 / Fetch bookmarks
  const loadBookmarks = useCallback(async (p: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/bookmarks?page=${p}`, {
        credentials: 'include',
      });
      if (res.status === 401) { setIsLoggedIn(false); return; }
      if (res.ok) {
        const data = await res.json();
        setTalents(data.talents || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
        setPage(p);
      }
    } catch { /* 무시 / Ignore */ }
    setLoading(false);
  }, []);

  // 북마크 해제 / Remove bookmark
  const handleRemove = useCallback(async (resumeId: number) => {
    setRemovingId(resumeId);
    try {
      await fetch(`/api/resumes/${resumeId}/bookmark`, {
        method: 'DELETE',
        credentials: 'include',
      });
      // 목록에서 즉시 제거 / Remove from list immediately
      setTalents((prev) => prev.filter((t) => t.resumeId !== resumeId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch { /* 무시 / Ignore */ }
    setRemovingId(null);
  }, []);

  useEffect(() => {
    loadBalance();
    loadBookmarks(1);
  }, [loadBalance, loadBookmarks]);

  // ── 렌더링 / Render ───────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">인재 북마크</h1>
          <p className="text-sm text-gray-500 mt-0.5">Bookmarked Talents</p>
        </div>
        <span className="text-sm text-gray-400">
          총 <span className="font-semibold text-gray-700">{total}</span>명
        </span>
      </div>

      {/* 미로그인 / Not logged in */}
      {!isLoggedIn && (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <LogIn className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-700 mb-2">로그인이 필요합니다</h3>
          <Link href="/auth/login" className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition">
            <LogIn className="w-4 h-4" />로그인하기
          </Link>
        </div>
      )}

      {/* 로그인 상태 / Logged in */}
      {isLoggedIn && (
        <>
          {/* 열람권 현황 / Credit balance */}
          {balance && <CreditMiniCard balance={balance} />}

          {/* 로딩 / Loading */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                  <div className="h-3 w-48 bg-gray-100 rounded mb-2" />
                  <div className="h-3 w-40 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* 빈 상태 / Empty */}
          {!loading && talents.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center mb-6">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-amber-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                북마크한 인재가 없습니다
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                인재 검색에서 관심 인재를 북마크해보세요.
                <br />
                <span className="text-gray-300">No bookmarked talents yet. Search and bookmark candidates.</span>
              </p>
              <Link
                href="/company/talents"
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
              >
                <Users className="w-4 h-4" />
                인재 검색하기
              </Link>
            </div>
          )}

          {/* 인재 목록 / Talent list */}
          {!loading && talents.length > 0 && (
            <div className="space-y-4 mb-6">
              {talents.map((t) => (
                <TalentCard
                  key={t.resumeId}
                  talent={t}
                  onRemove={handleRemove}
                  removing={removingId === t.resumeId}
                />
              ))}
            </div>
          )}

          {/* 페이지네이션 / Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => loadBookmarks(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => loadBookmarks(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 하단 열람권 안내 / Bottom CTA */}
          {!loading && (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">인재 검색에서 북마크하세요</p>
                  <p className="text-xs text-gray-400 mt-0.5">이력서를 열람하고 관심 인재를 저장하세요.</p>
                </div>
              </div>
              <Link
                href="/company/talents"
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition whitespace-nowrap"
              >
                인재 검색
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
