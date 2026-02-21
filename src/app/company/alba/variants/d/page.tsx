'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus, Search, LayoutList, LayoutGrid, MoreHorizontal,
  Eye, Edit, Pause, Play, X as XIcon, Star, Trash2,
  FileText, Clock, CheckCircle,
  ChevronDown, ArrowUpDown,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import type { AlbaJobResponse, PostStatus } from '../../create/variants/d/alba-types';
import { POST_STATUS_LABELS, DAY_LABELS } from '../../create/variants/d/alba-types';
import { MOCK_COMPANY_JOBS } from '../../create/variants/d/mock-data';

/**
 * 기업용 알바 공고 관리 대시보드 — Variant D (Notion/Linear 스타일)
 * Company alba job management dashboard — Variant D (Notion/Linear style)
 *
 * 통계 행 + 리스트/칸반 토글 + 인라인 액션 + 벌크 선택
 * Stats row + List/Kanban toggle + inline actions + bulk select
 */

type ViewMode = 'list' | 'kanban';
type SortField = 'createdAt' | 'title' | 'hourlyWage' | 'viewCount';

export default function AlbaManageVariantD() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDesc, setSortDesc] = useState(true);

  // ─── 목업 데이터 / Mock data ───
  const jobs = MOCK_COMPANY_JOBS;

  // ─── 통계 계산 / Calculate stats ───
  const stats = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter((j) => j.status === 'ACTIVE').length;
    const closed = jobs.filter((j) => j.status === 'CLOSED' || j.status === 'EXPIRED').length;
    const paused = jobs.filter((j) => j.status === 'PAUSED').length;
    const draft = jobs.filter((j) => j.status === 'DRAFT').length;
    return { total, active, closed, paused, draft };
  }, [jobs]);

  // ─── 필터링 / Filtering ───
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // 상태 필터 / Status filter
    if (filterStatus !== 'ALL') {
      result = result.filter((j) => j.status === filterStatus);
    }

    // 검색 / Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.jobCategoryName.toLowerCase().includes(q),
      );
    }

    // 정렬 / Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt);
      else if (sortField === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortField === 'hourlyWage') cmp = a.hourlyWage - b.hourlyWage;
      else if (sortField === 'viewCount') cmp = a.viewCount - b.viewCount;
      return sortDesc ? -cmp : cmp;
    });

    return result;
  }, [jobs, filterStatus, searchQuery, sortField, sortDesc]);

  // ─── 칸반 컬럼별 분류 / Kanban column grouping ───
  const kanbanColumns: { status: PostStatus; label: string; jobs: AlbaJobResponse[] }[] = useMemo(() => {
    const statusOrder: PostStatus[] = ['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'EXPIRED'];
    return statusOrder.map((status) => ({
      status,
      label: POST_STATUS_LABELS[status].ko,
      jobs: filteredJobs.filter((j) => j.status === status),
    })).filter((col) => col.jobs.length > 0 || col.status === 'ACTIVE');
  }, [filteredJobs]);

  // ─── 선택 관리 / Selection management ───
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredJobs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredJobs.map((j) => j.jobId)));
    }
  }, [selectedIds.size, filteredJobs]);

  // ─── 정렬 토글 / Sort toggle ───
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  }, [sortField, sortDesc]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ─── 상단 헤더 / Top header ─── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="h-14 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-semibold text-gray-900">알바 공고 관리</h1>
              <p className="text-[11px] text-gray-400 font-mono">Alba Job Management</p>
            </div>

            <Link href="/company/alba/create/variants/d">
              <Button className="gap-1.5 bg-gray-900 hover:bg-gray-800 text-white min-h-11">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">새 알바 공고</span>
                <span className="sm:hidden">등록</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 통계 행 / Stats row ─── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <StatCard label="전체 / Total" value={stats.total} icon={<FileText className="w-4 h-4" />} active={filterStatus === 'ALL'} onClick={() => setFilterStatus('ALL')} />
          <StatCard label="게시중 / Active" value={stats.active} icon={<Play className="w-4 h-4" />} color="emerald" active={filterStatus === 'ACTIVE'} onClick={() => setFilterStatus('ACTIVE')} />
          <StatCard label="마감 / Closed" value={stats.closed} icon={<CheckCircle className="w-4 h-4" />} color="red" active={filterStatus === 'CLOSED'} onClick={() => setFilterStatus('CLOSED')} />
          <StatCard label="일시정지 / Paused" value={stats.paused} icon={<Pause className="w-4 h-4" />} color="blue" active={filterStatus === 'PAUSED'} onClick={() => setFilterStatus('PAUSED')} />
          <StatCard label="임시저장 / Draft" value={stats.draft} icon={<Clock className="w-4 h-4" />} color="gray" active={filterStatus === 'DRAFT'} onClick={() => setFilterStatus('DRAFT')} />
        </div>
      </div>

      {/* ─── 툴바 / Toolbar ─── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center gap-3 mb-4">
          {/* 검색 (커맨드 팔레트 스타일) / Search (command palette style) */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="공고 검색... / Search postings..."
              className="h-9 pl-9 text-sm bg-white border-gray-200 font-mono"
              aria-label="공고 검색 / Search postings"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline text-[10px] text-gray-400 border border-gray-200 rounded px-1 py-0.5 font-mono">
              /
            </kbd>
          </div>

          {/* 뷰 모드 토글 / View mode toggle */}
          <div className="flex border border-gray-200 rounded overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors min-w-11 min-h-9 flex items-center justify-center',
                viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50',
              )}
              aria-pressed={viewMode === 'list'}
              aria-label="리스트 보기 / List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={cn(
                'p-2 transition-colors min-w-11 min-h-9 flex items-center justify-center',
                viewMode === 'kanban' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50',
              )}
              aria-pressed={viewMode === 'kanban'}
              aria-label="칸반 보기 / Kanban view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 벌크 액션 툴바 / Bulk actions toolbar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded">
            <span className="text-sm text-indigo-700 font-medium">
              {selectedIds.size}개 선택됨 / {selectedIds.size} selected
            </span>
            <div className="flex gap-1.5 ml-auto">
              <Button variant="ghost" size="sm" className="text-xs text-gray-600" aria-label="일시정지 / Pause">
                <Pause className="w-3.5 h-3.5" />
                정지
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-gray-600" aria-label="마감 / Close">
                <XIcon className="w-3.5 h-3.5" />
                마감
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-red-500" aria-label="삭제 / Delete">
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ─── 콘텐츠 영역 / Content area ─── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-8">
        {/* 리스트 뷰 / List view */}
        {viewMode === 'list' && (
          <div className="border border-gray-200 rounded bg-white overflow-hidden">
            {/* 리스트 헤더 / List header */}
            <div className="hidden sm:grid grid-cols-[32px_1fr_100px_100px_80px_80px_80px_40px] gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-medium uppercase tracking-wide">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredJobs.length && filteredJobs.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300"
                  aria-label="전체 선택 / Select all"
                />
              </div>
              <SortableHeader label="공고 / Posting" field="title" current={sortField} desc={sortDesc} onSort={handleSort} />
              <SortableHeader label="시급 / Wage" field="hourlyWage" current={sortField} desc={sortDesc} onSort={handleSort} />
              <span>상태 / Status</span>
              <SortableHeader label="조회 / Views" field="viewCount" current={sortField} desc={sortDesc} onSort={handleSort} />
              <span>지원 / Apply</span>
              <span>비자 / Visa</span>
              <span />
            </div>

            {/* 리스트 행 / List rows */}
            {filteredJobs.length === 0 ? (
              <EmptyState />
            ) : (
              filteredJobs.map((job) => (
                <JobListRow
                  key={job.jobId}
                  job={job}
                  isSelected={selectedIds.has(job.jobId)}
                  onToggleSelect={() => toggleSelect(job.jobId)}
                />
              ))
            )}
          </div>
        )}

        {/* 칸반 뷰 / Kanban view */}
        {viewMode === 'kanban' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanColumns.map((col) => (
              <div key={col.status} className="flex-shrink-0 w-72">
                {/* 컬럼 헤더 / Column header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={cn(
                    'w-2 h-2 rounded-full',
                    col.status === 'ACTIVE' && 'bg-emerald-500',
                    col.status === 'DRAFT' && 'bg-gray-400',
                    col.status === 'PAUSED' && 'bg-blue-500',
                    col.status === 'CLOSED' && 'bg-red-400',
                    col.status === 'EXPIRED' && 'bg-amber-500',
                  )} />
                  <span className="text-sm font-medium text-gray-700">{col.label}</span>
                  <span className="text-xs text-gray-400 font-mono">{col.jobs.length}</span>
                </div>

                {/* 칸반 카드 목록 / Kanban card list */}
                <div className="space-y-2">
                  {col.jobs.length === 0 ? (
                    <div className="border border-dashed border-gray-200 rounded p-4 text-center">
                      <p className="text-xs text-gray-400">비어있음 / Empty</p>
                    </div>
                  ) : (
                    col.jobs.map((job) => (
                      <KanbanCard key={job.jobId} job={job} />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 통계 카드 / Stat card ───

function StatCard({
  label,
  value,
  icon,
  color,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded border transition-all text-left min-h-11',
        active
          ? 'border-gray-900 bg-white shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300',
      )}
      aria-pressed={active}
      aria-label={label}
    >
      <span className={cn(
        'p-1.5 rounded',
        color === 'emerald' && 'bg-emerald-50 text-emerald-600',
        color === 'red' && 'bg-red-50 text-red-500',
        color === 'blue' && 'bg-blue-50 text-blue-500',
        color === 'gray' && 'bg-gray-100 text-gray-500',
        !color && 'bg-gray-100 text-gray-600',
      )}>
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold font-mono text-gray-900">{value}</p>
        <p className="text-[11px] text-gray-500 whitespace-nowrap">{label}</p>
      </div>
    </button>
  );
}

// ─── 정렬 가능 헤더 / Sortable header ───

function SortableHeader({
  label,
  field,
  current,
  desc,
  onSort,
}: {
  label: string;
  field: SortField;
  current: SortField;
  desc: boolean;
  onSort: (f: SortField) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={cn(
        'flex items-center gap-0.5 text-xs uppercase tracking-wide',
        current === field ? 'text-gray-900 font-semibold' : 'text-gray-500',
      )}
      aria-label={`${label} 정렬 / Sort by ${label}`}
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );
}

// ─── 리스트 행 / List row ───

function JobListRow({
  job,
  isSelected,
  onToggleSelect,
}: {
  job: AlbaJobResponse;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const statusInfo = POST_STATUS_LABELS[job.status];
  const visaCount = job.matchedVisas.length;

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-[32px_1fr_100px_100px_80px_80px_80px_40px] gap-2 px-3 py-3 border-b border-gray-100 last:border-b-0',
        'hover:bg-gray-50 transition-colors group',
        isSelected && 'bg-indigo-50',
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 체크박스 / Checkbox */}
      <div className="hidden sm:flex items-center justify-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 rounded border-gray-300"
          aria-label={`${job.title} 선택 / Select ${job.title}`}
        />
      </div>

      {/* 공고 정보 / Posting info */}
      <div className="flex items-start gap-2 min-w-0">
        {job.isPremium && (
          <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        )}
        <div className="min-w-0">
          <Link
            href={`/worker/alba/${job.jobId}/variants/d`}
            className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors truncate block"
          >
            {job.title}
          </Link>
          <p className="text-[11px] text-gray-400 font-mono truncate">
            {job.jobCategoryName} / {job.displayAddress}
          </p>
        </div>
      </div>

      {/* 시급 / Wage */}
      <div className="text-sm font-mono text-gray-700">
        {job.hourlyWage.toLocaleString()}원
      </div>

      {/* 상태 / Status */}
      <div>
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium',
          statusInfo.color,
        )}>
          {statusInfo.ko}
        </span>
      </div>

      {/* 조회수 / Views */}
      <div className="text-sm font-mono text-gray-500">
        {job.viewCount}
      </div>

      {/* 지원수 / Applications */}
      <div className="text-sm font-mono text-gray-500">
        {job.applyCount}
      </div>

      {/* 비자 수 / Visa count */}
      <div className="text-sm font-mono text-gray-500">
        {visaCount > 0 ? `${visaCount}개` : '-'}
      </div>

      {/* 인라인 액션 (호버 시 표시) / Inline actions (shown on hover) */}
      <div className="flex items-center justify-center">
        {showActions ? (
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded transition-colors"
              aria-label="수정 / Edit"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded transition-colors"
              aria-label="더보기 / More"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-gray-300">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}

// ─── 칸반 카드 / Kanban card ───

function KanbanCard({ job }: { job: AlbaJobResponse }) {
  const scheduleText = job.schedule
    .map((s) => DAY_LABELS[s.dayOfWeek].short)
    .join('');

  return (
    <Link href={`/worker/alba/${job.jobId}/variants/d`}>
      <div className="border border-gray-200 rounded bg-white p-3 hover:border-gray-300 transition-colors cursor-pointer">
        {/* 프리미엄 뱃지 / Premium badge */}
        {job.isPremium && (
          <div className="flex items-center gap-1 mb-1.5">
            <Star className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] text-amber-600 font-medium uppercase tracking-wide">
              Premium
            </span>
          </div>
        )}

        {/* 제목 / Title */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
          {job.title}
        </h3>

        {/* 메타 정보 / Meta info */}
        <div className="space-y-1 text-xs font-mono text-gray-500">
          <div className="flex items-center justify-between">
            <span>{job.hourlyWage.toLocaleString()}원/h</span>
            <span>{scheduleText} {job.weeklyHours}h/w</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{job.displayAddress}</span>
            <span className="text-gray-400">
              {job.matchedVisas.length > 0 ? `V:${job.matchedVisas.length}` : ''}
            </span>
          </div>
        </div>

        {/* 하단 통계 / Bottom stats */}
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
          <span className="flex items-center gap-0.5">
            <Eye className="w-3 h-3" />
            {job.viewCount}
          </span>
          <span>{job.applyCount} apply</span>
          <span>{job.scrapCount} scrap</span>
        </div>
      </div>
    </Link>
  );
}

// ─── 빈 상태 / Empty state ───

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-gray-500 mb-1">
        등록된 공고가 없습니다
      </p>
      <p className="text-xs text-gray-400 mb-4">
        No postings found. Create your first alba posting.
      </p>
      <Link href="/company/alba/create/variants/d">
        <Button variant="outline" className="gap-1.5">
          <Plus className="w-4 h-4" />
          새 공고 등록
        </Button>
      </Link>
    </div>
  );
}
