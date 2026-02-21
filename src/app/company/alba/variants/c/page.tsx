'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Eye,
  Heart,
  Users,
  MoreHorizontal,
  Crown,
  Pause,
  XCircle,
  Play,
  Clock,
  MapPin,
  DollarSign,
  ChevronDown,
  Search,
  Filter,
  LayoutGrid,
  List,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_ALBA_JOBS } from '@/app/company/alba/create/variants/c/components/mock-data';
import { VisaBadgeInline } from '@/app/company/alba/create/variants/c/components/visa-match-badges';
import type { AlbaJobResponse, PostStatus } from '@/app/company/alba/create/variants/c/components/alba-types';
import { JOB_CATEGORIES, DAY_LABELS } from '@/app/company/alba/create/variants/c/components/alba-types';

/**
 * 기업 알바 공고 관리 페이지 — Variant C (카드 비주얼)
 * Company alba job management page — Variant C (card visual)
 *
 * 당근마켓 스타일 그리드 카드 레이아웃 + FAB 신규 등록
 * Daangn-style grid card layout + FAB for new posting
 */

// 상태 필터 옵션 / Status filter options
const STATUS_FILTERS: { value: PostStatus | 'ALL'; label: string; labelEn: string; count?: number }[] = [
  { value: 'ALL', label: '전체', labelEn: 'All' },
  { value: 'ACTIVE', label: '게시중', labelEn: 'Active' },
  { value: 'DRAFT', label: '임시저장', labelEn: 'Draft' },
  { value: 'PAUSED', label: '일시정지', labelEn: 'Paused' },
  { value: 'CLOSED', label: '마감', labelEn: 'Closed' },
  { value: 'EXPIRED', label: '만료', labelEn: 'Expired' },
];

// 상태 설정 맵 / Status config map
const STATUS_CONFIG: Record<PostStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  DRAFT: { label: '임시저장', color: 'text-gray-600', bg: 'bg-gray-100', icon: <Clock className="w-3 h-3" /> },
  ACTIVE: { label: '게시중', color: 'text-green-700', bg: 'bg-green-100', icon: <Play className="w-3 h-3" /> },
  CLOSED: { label: '마감', color: 'text-red-700', bg: 'bg-red-100', icon: <XCircle className="w-3 h-3" /> },
  EXPIRED: { label: '만료', color: 'text-gray-500', bg: 'bg-gray-100', icon: <Clock className="w-3 h-3" /> },
  SUSPENDED: { label: '정지', color: 'text-red-700', bg: 'bg-red-100', icon: <AlertCircle className="w-3 h-3" /> },
  PAUSED: { label: '일시정지', color: 'text-amber-700', bg: 'bg-amber-100', icon: <Pause className="w-3 h-3" /> },
};

export default function CompanyAlbaManageVariantCPage() {
  // 상태 필터 / Status filter
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'ALL'>('ALL');
  // 검색어 / Search keyword
  const [searchQuery, setSearchQuery] = useState('');
  // 로딩 상태 / Loading state
  const [isLoading, setIsLoading] = useState(false);
  // 메뉴 오픈 카드 / Open action menu card ID
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // 필터링된 공고 / Filtered jobs
  const filteredJobs = useMemo(() => {
    let result = MOCK_ALBA_JOBS;

    if (statusFilter !== 'ALL') {
      result = result.filter((j) => j.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.jobCategoryName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [statusFilter, searchQuery]);

  // 통계 수치 / Statistics
  const stats = useMemo(() => {
    const active = MOCK_ALBA_JOBS.filter((j) => j.status === 'ACTIVE').length;
    const totalApply = MOCK_ALBA_JOBS.reduce((s, j) => s + j.applyCount, 0);
    const totalView = MOCK_ALBA_JOBS.reduce((s, j) => s + j.viewCount, 0);
    return { active, totalApply, totalView, total: MOCK_ALBA_JOBS.length };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-gray-50">
      {/* 상단 헤더 / Top header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            {/* 알바 공고 관리 / Alba Job Management */}
            알바 공고 관리
          </h1>
          <Link
            href="/company/alba/create/variants/c"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition min-h-[44px]"
            aria-label="새 공고 등록 / Create new posting"
          >
            <Plus className="w-4 h-4" />
            {/* 새 공고 / New Posting */}
            새 공고
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        {/* 통계 요약 카드 / Stats summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<LayoutGrid className="w-5 h-5 text-orange-500" />}
            label="전체 공고"
            labelEn="Total"
            value={stats.total}
            bg="bg-orange-50"
          />
          <StatCard
            icon={<Play className="w-5 h-5 text-green-500" />}
            label="게시중"
            labelEn="Active"
            value={stats.active}
            bg="bg-green-50"
          />
          <StatCard
            icon={<Users className="w-5 h-5 text-blue-500" />}
            label="총 지원"
            labelEn="Applications"
            value={stats.totalApply}
            bg="bg-blue-50"
          />
          <StatCard
            icon={<Eye className="w-5 h-5 text-purple-500" />}
            label="총 조회"
            labelEn="Views"
            value={stats.totalView}
            bg="bg-purple-50"
          />
        </div>

        {/* 필터 & 검색 바 / Filter & search bar */}
        <div className="space-y-3 mb-6">
          {/* 상태 필터 탭 / Status filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            {STATUS_FILTERS.map((filter) => {
              const count =
                filter.value === 'ALL'
                  ? MOCK_ALBA_JOBS.length
                  : MOCK_ALBA_JOBS.filter((j) => j.status === filter.value).length;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px] whitespace-nowrap',
                    statusFilter === filter.value
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-200'
                  )}
                  aria-label={`${filter.label} ${count}건 / ${filter.labelEn} ${count}`}
                  aria-pressed={statusFilter === filter.value}
                >
                  {filter.label}
                  <span className={cn(
                    'ml-1.5 text-xs',
                    statusFilter === filter.value ? 'text-orange-100' : 'text-gray-400'
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 검색 바 / Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="공고 제목, 직종 검색... / Search by title, category..."
              className="pl-10 h-11 rounded-xl bg-white border-gray-200"
              aria-label="공고 검색 / Search postings"
            />
          </div>
        </div>

        {/* 공고 카드 그리드 / Job card grid */}
        {isLoading ? (
          <LoadingState />
        ) : filteredJobs.length === 0 ? (
          <EmptyState statusFilter={statusFilter} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <JobManagementCard
                key={job.jobId}
                job={job}
                isMenuOpen={openMenuId === job.jobId}
                onToggleMenu={() =>
                  setOpenMenuId(openMenuId === job.jobId ? null : job.jobId)
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB — 모바일 신규 공고 등록 / FAB — mobile new posting */}
      <Link
        href="/company/alba/create/variants/c"
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-orange-300/50 hover:scale-105 transition-transform active:scale-95"
        aria-label="새 공고 등록 / Create new posting"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}

/**
 * 통계 카드 컴포넌트 / Stats card component
 */
function StatCard({
  icon,
  label,
  labelEn,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  labelEn: string;
  value: number;
  bg: string;
}) {
  return (
    <div className={cn('p-4 rounded-2xl', bg)}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

/**
 * 공고 관리 카드 / Job management card
 * 당근마켓 스타일 — 카테고리 아이콘 + 상태 배지 + 통계 + 액션
 * Daangn style — category icon + status badge + stats + actions
 */
function JobManagementCard({
  job,
  isMenuOpen,
  onToggleMenu,
}: {
  job: AlbaJobResponse;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}) {
  const category = JOB_CATEGORIES.find((c) => c.code === job.jobCategoryCode);
  const statusConfig = STATUS_CONFIG[job.status];

  // 남은 일수 / Days remaining
  const daysLeft = job.expiresAt
    ? Math.max(0, Math.ceil((new Date(job.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <Card className="rounded-2xl border-0 shadow-sm hover:shadow-lg transition-shadow group overflow-hidden">
      {/* 프리미엄 표시 / Premium indicator */}
      {job.isPremium && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-1.5 flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-white" />
          <span className="text-[11px] font-bold text-white">
            {/* 프리미엄 노출 중 / Premium Active */}
            PREMIUM
          </span>
        </div>
      )}

      <CardContent className={cn('pt-4 pb-4', !job.isPremium && 'pt-5')}>
        {/* 상단: 아이콘 + 제목 + 메뉴 / Top: icon + title + menu */}
        <div className="flex items-start gap-3">
          {/* 직종 아이콘 / Category icon */}
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
            {category?.icon || '💼'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* 상태 배지 / Status badge */}
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
                statusConfig.bg,
                statusConfig.color
              )}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>

              {/* 남은 일수 / Days left */}
              {daysLeft !== null && job.status === 'ACTIVE' && (
                <span className={cn(
                  'text-[10px] font-medium',
                  daysLeft <= 3 ? 'text-red-500' : 'text-gray-400'
                )}>
                  {daysLeft > 0 ? `D-${daysLeft}` : '오늘 만료'}
                </span>
              )}
            </div>

            {/* 제목 / Title */}
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
              {job.title}
            </h3>
          </div>

          {/* 더보기 메뉴 / More menu */}
          <div className="relative">
            <button
              type="button"
              onClick={onToggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="더보기 메뉴 / More options"
              aria-expanded={isMenuOpen}
            >
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>

            {/* 드롭다운 메뉴 / Dropdown menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20">
                <button className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left min-h-[44px]">
                  {/* 수정 / Edit */}
                  수정하기
                </button>
                {job.status === 'ACTIVE' && (
                  <>
                    <button className="w-full px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 text-left min-h-[44px]">
                      {/* 일시정지 / Pause */}
                      일시정지
                    </button>
                    <button className="w-full px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 text-left min-h-[44px]">
                      {/* 프리미엄 구매 / Buy Premium */}
                      프리미엄 구매
                    </button>
                  </>
                )}
                {job.status === 'PAUSED' && (
                  <button className="w-full px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 text-left min-h-[44px]">
                    {/* 재게시 / Reactivate */}
                    재게시
                  </button>
                )}
                {(job.status === 'ACTIVE' || job.status === 'PAUSED') && (
                  <button className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left min-h-[44px]">
                    {/* 마감 / Close */}
                    마감하기
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 시급 + 스케줄 피ick / Wage + schedule pills */}
        <div className="flex items-center gap-2 mt-3">
          <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">
            {/* 시급 / Wage */}
            {job.hourlyWage.toLocaleString()}원
          </span>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
            {/* 주 Nh / N hrs/week */}
            주 {job.weeklyHours}h
          </span>
          {job.schedule.length > 0 && (
            <span className="text-xs text-gray-400 truncate">
              {job.schedule.map((s) => DAY_LABELS[s.dayOfWeek].short).join(' ')}
            </span>
          )}
        </div>

        {/* 비자 배지 줄 / Visa badge row */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          {job.matchedVisas.slice(0, 4).map((v) => (
            <VisaBadgeInline key={v.visaCode} status={v.status} visaCode={v.visaCode} />
          ))}
          {job.matchedVisas.length > 4 && (
            <span className="text-[10px] text-gray-400 self-center ml-0.5">
              +{job.matchedVisas.length - 4}
            </span>
          )}
        </div>

        {/* 통계 행 / Stats row */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Eye className="w-3.5 h-3.5" />
            {job.viewCount}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Heart className="w-3.5 h-3.5" />
            {job.scrapCount}
          </span>
          <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
            <Users className="w-3.5 h-3.5" />
            {/* 지원 N / N applications */}
            지원 {job.applyCount}
          </span>
          <span className="ml-auto text-[10px] text-gray-300">
            {new Date(job.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 로딩 상태 / Loading state
 */
function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <div className="h-6 bg-gray-100 rounded-lg w-20" />
            <div className="h-6 bg-gray-100 rounded-lg w-16" />
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
            <div className="h-3 bg-gray-100 rounded w-10" />
            <div className="h-3 bg-gray-100 rounded w-10" />
            <div className="h-3 bg-gray-100 rounded w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 빈 상태 / Empty state
 */
function EmptyState({ statusFilter }: { statusFilter: PostStatus | 'ALL' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
        <LayoutGrid className="w-10 h-10 text-orange-300" />
      </div>
      <h3 className="text-base font-bold text-gray-700 mb-1">
        {/* 공고가 없습니다 / No postings */}
        {statusFilter === 'ALL' ? '등록된 공고가 없습니다' : '해당 상태의 공고가 없습니다'}
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        {statusFilter === 'ALL'
          ? 'Create your first alba posting to start recruiting.'
          : 'No postings with the selected status.'}
      </p>
      {statusFilter === 'ALL' && (
        <Link href="/company/alba/create/variants/c">
          <Button className="h-11 rounded-xl bg-orange-500 hover:bg-orange-600 px-6">
            <Plus className="w-4 h-4 mr-1" />
            {/* 첫 공고 등록하기 / Create first posting */}
            첫 공고 등록하기
          </Button>
        </Link>
      )}
    </div>
  );
}
