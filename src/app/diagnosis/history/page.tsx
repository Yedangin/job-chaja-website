'use client';

/**
 * 진단 이력 페이지 / Diagnosis history page
 * 무료/프리미엄 진단 이력 조회 + 재진단 쿠폰 상태
 * Free/premium diagnosis history + rediagnosis coupon status
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  History,
  Sparkles,
  Clock,
  ArrowRight,
  LogIn,
  RefreshCw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/** 진단 세션 이력 / Diagnosis session history entry */
interface HistoryEntry {
  sessionId: number;
  topPathwayId: string | null;
  pathwayCount: number;
  isPremium: boolean;
  isPremiumViewed: boolean;
  createdAt: string;
  nationality: string | null;
  finalGoal: string | null;
}

/** 쿠폰 상태 / Coupon status */
interface CouponStatus {
  hasCoupon: boolean;
  coupon?: {
    couponCode: string;
    status: string;
    issuedAt: string;
    availableAt: string;
    expiresAt: string;
    usedAt: string | null;
  };
}

/** 국적 라벨 / Nationality labels */
const NATIONALITY_LABELS: Record<string, string> = {
  VN: 'Vietnam', PH: 'Philippines', TH: 'Thailand', ID: 'Indonesia',
  CN: 'China', KH: 'Cambodia', MM: 'Myanmar', NP: 'Nepal',
  UZ: 'Uzbekistan', MN: 'Mongolia', BD: 'Bangladesh', LK: 'Sri Lanka',
  JP: 'Japan', US: 'USA', GB: 'UK', IN: 'India',
};

/** 목표 라벨 / Goal labels */
const GOAL_LABELS: Record<string, string> = {
  employment: '취업',
  study: '유학',
  permanent_residency: '영주권',
  study_then_work: '유학→취업',
};

/** 쿠폰 상태 라벨 / Coupon status labels */
const COUPON_STATUS: Record<string, { label: string; color: string }> = {
  ISSUED: { label: '발급됨 (사용 대기)', color: 'bg-gray-100 text-gray-600' },
  AVAILABLE: { label: '사용 가능', color: 'bg-green-100 text-green-700' },
  USED: { label: '사용 완료', color: 'bg-blue-100 text-blue-700' },
  EXPIRED: { label: '만료', color: 'bg-red-100 text-red-600' },
  CANCELLED: { label: '취소됨', color: 'bg-gray-100 text-gray-400' },
};

export default function DiagnosisHistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [coupon, setCoupon] = useState<CouponStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const [historyRes, couponRes] = await Promise.all([
        fetch('/api/visa-planner/history', { credentials: 'include' }),
        fetch('/api/visa-planner/coupon/status', { credentials: 'include' }),
      ]);

      if (historyRes.status === 401 || historyRes.status === 403) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      if (historyRes.ok) {
        const data = await historyRes.json();
        setEntries(data.sessions || []);
      }

      if (couponRes.ok) {
        const data = await couponRes.json();
        setCoupon(data);
      }
    } catch {
      /* 무시 / Ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ── 렌더링 / Render ────

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            진단 이력
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Diagnosis History</p>
        </div>
        <Link href="/diagnosis">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            새 진단
          </Button>
        </Link>
      </div>

      {/* 미로그인 / Not logged in */}
      {!isLoggedIn && (
        <Card className="p-12 text-center">
          <LogIn className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-gray-700 mb-2">로그인이 필요합니다</h3>
          <Link href="/auth/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <LogIn className="w-4 h-4 mr-2" />
              로그인하기
            </Button>
          </Link>
        </Card>
      )}

      {isLoggedIn && (
        <>
          {/* 재진단 쿠폰 / Rediagnosis coupon */}
          {coupon?.hasCoupon && coupon.coupon && (
            <Card className="p-5 mb-6 border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">재진단 쿠폰</p>
                  <p className="text-xs font-mono text-indigo-600">{coupon.coupon.couponCode}</p>
                </div>
                <Badge className={COUPON_STATUS[coupon.coupon.status]?.color || 'bg-gray-100'}>
                  {COUPON_STATUS[coupon.coupon.status]?.label || coupon.coupon.status}
                </Badge>
              </div>
              {coupon.coupon.status === 'ISSUED' && (
                <p className="text-xs text-gray-400 mt-2 ml-13">
                  사용 가능일: {new Date(coupon.coupon.availableAt).toLocaleDateString('ko-KR')}
                </p>
              )}
              {coupon.coupon.status === 'AVAILABLE' && (
                <p className="text-xs text-gray-400 mt-2 ml-13">
                  만료일: {new Date(coupon.coupon.expiresAt).toLocaleDateString('ko-KR')}
                </p>
              )}
            </Card>
          )}

          {/* 로딩 / Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          )}

          {/* 빈 상태 / Empty */}
          {!loading && entries.length === 0 && (
            <Card className="p-12 text-center border-dashed">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-gray-700 mb-2">진단 이력이 없습니다</h3>
              <p className="text-sm text-gray-400 mb-6">
                비자 진단을 시작하여 맞춤 경로를 확인해보세요.
              </p>
              <Link href="/diagnosis">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  진단 시작하기
                </Button>
              </Link>
            </Card>
          )}

          {/* 이력 목록 / History list */}
          {!loading && entries.length > 0 && (
            <div className="space-y-3">
              {entries.map((entry) => (
                <Card
                  key={entry.sessionId}
                  className="p-4 hover:border-indigo-200 transition group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        entry.isPremium ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}>
                        {entry.isPremium ? (
                          <Sparkles className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          {entry.isPremium && (
                            <Badge className="bg-indigo-100 text-indigo-700 text-xs">Premium</Badge>
                          )}
                          <span className="text-sm font-semibold text-gray-800">
                            {entry.pathwayCount}개 경로
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {entry.nationality && (
                            <span>{NATIONALITY_LABELS[entry.nationality] || entry.nationality}</span>
                          )}
                          {entry.finalGoal && (
                            <span>
                              {GOAL_LABELS[entry.finalGoal] || entry.finalGoal}
                            </span>
                          )}
                          <span>
                            {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
