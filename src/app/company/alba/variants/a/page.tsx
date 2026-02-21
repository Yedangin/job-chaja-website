'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Plus,
  Eye,
  Users,
  Star,
  MoreHorizontal,
  Pause,
  Play,
  XCircle,
  Loader2,
  Briefcase,
  Clock,
  Banknote,
  Shield,
  Search,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type {
  AlbaJobResponse,
  PostStatus,
  PaginationMeta,
} from '@/app/company/alba/create/variants/a/types';
import {
  getMyAlbaJobs,
  updateAlbaJobStatus,
  purchaseAlbaPremium,
} from '@/app/company/alba/create/variants/a/api';
import {
  MOCK_ALBA_JOBS,
  DAY_LABELS,
  POST_STATUS_LABELS,
} from '@/app/company/alba/create/variants/a/mock-data';

/**
 * 알바 공고 관리 페이지 (Variant A: 미니멀/Toss 스타일)
 * Alba job management page (Variant A: Minimal/Toss style)
 *
 * 상태별 탭 필터 + 공고 카드 리스트 + 프리미엄 구매
 * Status tab filters + job card list + premium purchase
 */

/** 상태 탭 목록 / Status tab list */
const STATUS_TABS: { value: PostStatus | 'ALL'; label: string; labelEn: string }[] = [
  { value: 'ALL', label: '전체', labelEn: 'All' },
  { value: 'ACTIVE', label: '채용중', labelEn: 'Active' },
  { value: 'CLOSED', label: '마감', labelEn: 'Closed' },
  { value: 'PAUSED', label: '일시정지', labelEn: 'Paused' },
  { value: 'DRAFT', label: '임시저장', labelEn: 'Draft' },
];

/** 공고 카드 컴포넌트 / Job card component */
function AlbaJobCard({
  job,
  onStatusChange,
  onPremiumPurchase,
}: {
  job: AlbaJobResponse;
  onStatusChange: (jobId: string, status: 'ACTIVE' | 'CLOSED' | 'PAUSED') => void;
  onPremiumPurchase: (jobId: string) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  // 스케줄 요약 / Schedule summary
  const scheduleSummary = job.schedule
    .map((s) => DAY_LABELS[s.dayOfWeek]?.koShort || s.dayOfWeek)
    .join('/');

  const timeRange = job.schedule.length > 0
    ? `${job.schedule[0].startTime}~${job.schedule[0].endTime}`
    : '';

  // 매칭된 비자 수 / Matched visa count
  const matchedVisaCount = job.matchedVisas.filter(
    (v) => v.status === 'eligible' || v.status === 'conditional',
  ).length;

  // 상태 배지 색상 / Status badge colors
  const statusInfo = POST_STATUS_LABELS[job.status] || POST_STATUS_LABELS.DRAFT;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 transition-all hover:border-gray-200 hover:shadow-sm">
      {/* 상단: 상태 + 프리미엄 + 액션 / Top: status + premium + actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              statusInfo.color === 'green' && 'bg-green-50 text-green-700',
              statusInfo.color === 'red' && 'bg-red-50 text-red-700',
              statusInfo.color === 'amber' && 'bg-amber-50 text-amber-700',
              statusInfo.color === 'gray' && 'bg-gray-100 text-gray-600',
            )}
          >
            {statusInfo.ko}
          </span>
          {job.isPremium && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
              <Star className="w-3 h-3" />
              프리미엄
            </span>
          )}
        </div>

        {/* 액션 드롭다운 / Action dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="공고 메뉴 / Job menu"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showActions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
              <div className="absolute right-0 top-12 z-20 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 min-w-[180px]">
                {job.status === 'ACTIVE' && (
                  <>
                    <button
                      type="button"
                      onClick={() => { onStatusChange(job.jobId, 'PAUSED'); setShowActions(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      일시정지 <span className="text-gray-400">/ Pause</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { onStatusChange(job.jobId, 'CLOSED'); setShowActions(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      마감하기 <span className="text-red-400">/ Close</span>
                    </button>
                  </>
                )}
                {job.status === 'PAUSED' && (
                  <>
                    <button
                      type="button"
                      onClick={() => { onStatusChange(job.jobId, 'ACTIVE'); setShowActions(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      재게시 <span className="text-green-500">/ Reactivate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { onStatusChange(job.jobId, 'CLOSED'); setShowActions(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      마감하기 <span className="text-red-400">/ Close</span>
                    </button>
                  </>
                )}
                {job.status === 'DRAFT' && (
                  <Link
                    href={`/company/alba/create/variants/a?edit=${job.jobId}`}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    이어서 작성 <span className="text-gray-400">/ Continue editing</span>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 제목 / Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
        {job.title}
      </h3>

      {/* 주요 정보 / Key info */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Banknote className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-800">시급 {job.hourlyWage.toLocaleString()}원</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{scheduleSummary} {timeRange}</span>
          <span className="text-xs text-gray-400">주 {job.weeklyHours}시간</span>
        </div>
      </div>

      {/* 통계 / Statistics */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          조회 {job.viewCount}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          지원 {job.applyCount}
        </span>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5" />
          비자 {matchedVisaCount}개
        </span>
      </div>

      {/* 프리미엄 버튼 / Premium button */}
      {job.status === 'ACTIVE' && !job.isPremium && (
        <button
          type="button"
          onClick={() => onPremiumPurchase(job.jobId)}
          className="w-full min-h-[44px] bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:from-amber-100 hover:to-yellow-100 transition-all"
          aria-label="상위노출 구매 / Purchase premium exposure"
        >
          <Star className="w-4 h-4 text-amber-500" />
          상위노출 <span className="text-amber-600 font-normal">/ Premium</span>
        </button>
      )}
    </div>
  );
}

/** 빈 상태 컴포넌트 / Empty state component */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Briefcase className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        등록된 공고가 없습니다
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        첫 알바 공고를 등록해보세요!
        <br />
        <span className="text-gray-400">Create your first part-time job posting!</span>
      </p>
      <Link href="/company/alba/create/variants/a">
        <Button className="min-h-[48px] rounded-2xl px-8 bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          공고 등록하기
        </Button>
      </Link>
    </div>
  );
}

/** 스켈레톤 로딩 / Skeleton loading */
function JobListSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-16 h-6 bg-gray-200 rounded-full" />
          </div>
          <div className="w-3/4 h-5 bg-gray-200 rounded-lg mb-3" />
          <div className="space-y-2">
            <div className="w-1/2 h-4 bg-gray-100 rounded-lg" />
            <div className="w-2/3 h-4 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 에러 상태 / Error state */
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <XCircle className="w-7 h-7 text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        불러오기 실패
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        데이터를 불러오는 중 오류가 발생했습니다
        <br />
        <span className="text-gray-400">Failed to load data</span>
      </p>
      <Button
        variant="outline"
        onClick={onRetry}
        className="rounded-2xl min-h-[44px]"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        다시 시도 / Retry
      </Button>
    </div>
  );
}

export default function AlbaManageVariantAPage() {
  const [activeTab, setActiveTab] = useState<PostStatus | 'ALL'>('ALL');
  const [jobs, setJobs] = useState<AlbaJobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 공고 목록 불러오기 / Fetch job list
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = activeTab === 'ALL' ? {} : { status: activeTab as PostStatus };
      const result = await getMyAlbaJobs(params);
      setJobs(result.jobs);
    } catch (err) {
      // 개발용 폴백 / Development fallback
      if (activeTab === 'ALL') {
        setJobs(MOCK_ALBA_JOBS);
      } else {
        setJobs(MOCK_ALBA_JOBS.filter((j) => j.status === activeTab));
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // 상태 변경 / Status change
  const handleStatusChange = useCallback(async (jobId: string, status: 'ACTIVE' | 'CLOSED' | 'PAUSED') => {
    try {
      await updateAlbaJobStatus(jobId, status);
    } catch (err) {
      // 개발용 폴백 / Development fallback
    }
    // UI 즉시 반영 / Immediate UI update
    setJobs((prev) =>
      prev.map((j) => (j.jobId === jobId ? { ...j, status } : j)),
    );
  }, []);

  // 프리미엄 구매 / Premium purchase
  const handlePremiumPurchase = useCallback(async (jobId: string) => {
    try {
      const result = await purchaseAlbaPremium(jobId);
      if (result.paymentUrl) {
        window.open(result.paymentUrl, '_blank');
      }
    } catch (err) {
      // 개발용: alert 대체 / Development: alert substitute
      alert('프리미엄 결제 페이지로 이동합니다 / Redirecting to premium payment');
    }
  }, []);

  // 탭별 카운트 / Per-tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: jobs.length };
    STATUS_TABS.slice(1).forEach((tab) => {
      counts[tab.value] = jobs.filter((j) => j.status === tab.value).length;
    });
    return counts;
  }, [jobs]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">알바 공고 관리</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Part-time Job Management
          </p>
        </div>
        <Link href="/company/alba/create/variants/a">
          <Button className="min-h-[44px] rounded-2xl bg-blue-500 hover:bg-blue-600 px-5">
            <Plus className="w-4 h-4 mr-1.5" />
            공고 등록
          </Button>
        </Link>
      </div>

      {/* 상태 탭 필터 / Status tab filter */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto scrollbar-hide">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-4 min-h-[40px] rounded-full text-sm font-medium whitespace-nowrap transition-all',
              'focus-visible:ring-2 focus-visible:ring-blue-400 outline-none',
              activeTab === tab.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            )}
            aria-label={`${tab.label} (${tab.labelEn})`}
            aria-pressed={activeTab === tab.value}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 / Content */}
      {loading ? (
        <JobListSkeleton />
      ) : error ? (
        <ErrorState onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <AlbaJobCard
              key={job.jobId}
              job={job}
              onStatusChange={handleStatusChange}
              onPremiumPurchase={handlePremiumPurchase}
            />
          ))}
        </div>
      )}
    </div>
  );
}
