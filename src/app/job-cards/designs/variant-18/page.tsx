'use client';

// 시안 18: 노션 스타일 데이터베이스 블록 / Variant 18: Notion-style Database Block
// 노션 데이터베이스/테이블 뷰 — 갤러리 뷰(카드)와 테이블 뷰(행) 토글
// Notion database/table view — toggle between Gallery view (cards) and Table view (rows)

import { useState } from 'react';
import {
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Check,
  Search,
  Plus,
  Eye,
  Users,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';

// 노션 스타일 프로퍼티 색상 매핑 / Notion-style property color mapping
const NOTION_PILL_COLORS: Record<string, { bg: string; text: string }> = {
  // 고용형태 / Employment type
  FULL_TIME: { bg: '#DBEDDB', text: '#1E5631' },
  PART_TIME: { bg: '#FADEC9', text: '#93491F' },
  // 공고 등급 / Job tier
  PREMIUM: { bg: '#D3E5EF', text: '#24548C' },
  STANDARD: { bg: '#E8E8E8', text: '#555555' },
  // D-day 상태 / D-day status
  urgent: { bg: '#FFE2DD', text: '#93291E' },
  closing_soon: { bg: '#FADEC9', text: '#93491F' },
  open: { bg: '#DBEDDB', text: '#1E5631' },
  closed: { bg: '#E8E8E8', text: '#999999' },
  always: { bg: '#D3E5EF', text: '#24548C' },
  // 비자 유형 배지 / Visa type badges
  visa_blue: { bg: '#D3E5EF', text: '#24548C' },
  visa_purple: { bg: '#E8DEEE', text: '#6840A5' },
  visa_green: { bg: '#DBEDDB', text: '#1E5631' },
  visa_red: { bg: '#FFE2DD', text: '#93291E' },
  visa_orange: { bg: '#FADEC9', text: '#93491F' },
} as const;

// 비자 코드 → 노션 색상 매핑 / Visa code to Notion color mapping
function getVisaColor(visa: string): { bg: string; text: string } {
  if (visa.startsWith('E-7')) return NOTION_PILL_COLORS.visa_purple;
  if (visa.startsWith('E-9') || visa.startsWith('E-2')) return NOTION_PILL_COLORS.visa_blue;
  if (visa.startsWith('H-')) return NOTION_PILL_COLORS.visa_orange;
  if (visa.startsWith('F-5')) return NOTION_PILL_COLORS.visa_green;
  if (visa.startsWith('F-')) return NOTION_PILL_COLORS.visa_red;
  return NOTION_PILL_COLORS.visa_blue;
}

// D-day 상태 분류 / D-day status classification
function getDDayStatus(dDay: string | null): { label: string; colorKey: string } {
  if (!dDay) return { label: '상시모집', colorKey: 'always' };
  if (dDay === '마감') return { label: '마감', colorKey: 'closed' };
  if (dDay === 'D-Day') return { label: 'D-Day', colorKey: 'urgent' };
  if (dDay === '상시모집') return { label: '상시모집', colorKey: 'always' };
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 7) return { label: dDay, colorKey: 'closing_soon' };
  return { label: dDay, colorKey: 'open' };
}

// 뷰 모드 타입 / View mode type
type ViewMode = 'gallery' | 'table';

// 정렬 옵션 타입 / Sort option type
type SortOption = 'newest' | 'deadline' | 'applicants' | 'views';

// 노션 스타일 프로퍼티 필 컴포넌트 / Notion-style property pill component
function NotionPill({
  label,
  colorKey,
}: {
  label: string;
  colorKey: string;
}) {
  const colors = NOTION_PILL_COLORS[colorKey] || NOTION_PILL_COLORS.visa_blue;
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[12px] font-normal leading-tight"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
}

// 노션 스타일 체크박스 / Notion-style checkbox
function NotionCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`
        w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0
        transition-all duration-100
        ${
          checked
            ? 'bg-blue-500 border-blue-500'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }
      `}
    >
      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </button>
  );
}

// 갤러리 카드 컴포넌트 / Gallery card component
function GalleryCard({
  job,
  isSelected,
  onToggleSelect,
}: {
  job: MockJobPosting;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // D-day 상태 / D-day status
  const dDayStatus = getDDayStatus(dDay);
  // 급여 포맷 / Salary format
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posting
  const timeAgo = getTimeAgo(job.postedDate);
  // 마감 여부 / Closed check
  const isClosed = dDay === '마감';

  return (
    <div
      className={`
        bg-white rounded-sm border transition-shadow duration-150
        hover:shadow-md cursor-pointer group
        ${isSelected ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'}
        ${isClosed ? 'opacity-60' : ''}
      `}
    >
      {/* 카드 상단: 체크박스 + 메뉴 / Card top: checkbox + menu */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <NotionCheckbox checked={isSelected} onChange={onToggleSelect} />
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* 카드 제목 / Card title */}
      <div className="px-3 pb-2">
        <h3 className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
          {job.title}
        </h3>

        {/* 프로퍼티 레이블들 / Property labels */}
        <div className="space-y-1.5">
          {/* 회사명 프로퍼티 / Company property */}
          <div className="flex items-start gap-2">
            <span className="text-[12px] text-gray-400 w-[52px] flex-shrink-0 pt-0.5">회사</span>
            <span className="text-[13px] text-gray-700 truncate">{job.company}</span>
          </div>

          {/* 위치 프로퍼티 / Location property */}
          <div className="flex items-start gap-2">
            <span className="text-[12px] text-gray-400 w-[52px] flex-shrink-0 pt-0.5">위치</span>
            <span className="text-[13px] text-gray-500">{job.location}</span>
          </div>

          {/* 급여 프로퍼티 / Salary property */}
          <div className="flex items-start gap-2">
            <span className="text-[12px] text-gray-400 w-[52px] flex-shrink-0 pt-0.5">급여</span>
            <span className="text-[13px] text-gray-900 font-medium">{salary}</span>
          </div>

          {/* 고용형태 + 등급 / Employment type + tier */}
          <div className="flex items-start gap-2">
            <span className="text-[12px] text-gray-400 w-[52px] flex-shrink-0 pt-0.5">유형</span>
            <div className="flex items-center gap-1 flex-wrap">
              <NotionPill
                label={job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
                colorKey={job.boardType}
              />
              <NotionPill
                label={job.tierType === 'PREMIUM' ? 'Premium' : 'Standard'}
                colorKey={job.tierType}
              />
            </div>
          </div>

          {/* 비자 프로퍼티 / Visa property */}
          <div className="flex items-start gap-2">
            <span className="text-[12px] text-gray-400 w-[52px] flex-shrink-0 pt-0.5">비자</span>
            <div className="flex items-center gap-1 flex-wrap">
              {job.allowedVisas.slice(0, 3).map((visa) => {
                const visaColor = getVisaColor(visa);
                return (
                  <span
                    key={visa}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-normal"
                    style={{ backgroundColor: visaColor.bg, color: visaColor.text }}
                  >
                    {visa}
                  </span>
                );
              })}
              {job.allowedVisas.length > 3 && (
                <span className="text-[11px] text-gray-400">
                  +{job.allowedVisas.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* 마감 상태 프로퍼티 / Deadline status property */}
          <div className="flex items-start gap-2">
            <span className="text-[12px] text-gray-400 w-[52px] flex-shrink-0 pt-0.5">상태</span>
            <NotionPill label={dDayStatus.label} colorKey={dDayStatus.colorKey} />
          </div>
        </div>
      </div>

      {/* 카드 하단: 부가 정보 / Card bottom: additional info */}
      <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {job.applicantCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {job.viewCount.toLocaleString()}
          </span>
        </div>
        <span className="text-[11px] text-gray-300">{timeAgo}</span>
      </div>
    </div>
  );
}

// 테이블 행 컴포넌트 / Table row component
function TableRow({
  job,
  isSelected,
  onToggleSelect,
}: {
  job: MockJobPosting;
  isSelected: boolean;
  onToggleSelect: () => void;
}) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // D-day 상태 / D-day status
  const dDayStatus = getDDayStatus(dDay);
  // 급여 포맷 / Salary format
  const salary = formatSalary(job);
  // 마감 여부 / Closed check
  const isClosed = dDay === '마감';

  return (
    <div
      className={`
        flex items-center border-b border-gray-100 hover:bg-gray-50/80
        transition-colors duration-100 cursor-pointer group
        ${isSelected ? 'bg-blue-50/50' : ''}
        ${isClosed ? 'opacity-50' : ''}
      `}
    >
      {/* 체크박스 열 / Checkbox column */}
      <div className="w-10 flex-shrink-0 flex justify-center py-2.5">
        <NotionCheckbox checked={isSelected} onChange={onToggleSelect} />
      </div>

      {/* 제목 열 (가변 너비) / Title column (flexible width) */}
      <div className="flex-1 min-w-0 py-2.5 pr-3">
        <span className="text-[13px] text-gray-900 truncate block hover:underline">
          {job.title}
        </span>
      </div>

      {/* 회사 열 / Company column */}
      <div className="w-[120px] flex-shrink-0 py-2.5 pr-2 hidden md:block">
        <span className="text-[13px] text-gray-500 truncate block">{job.company}</span>
      </div>

      {/* 위치 열 / Location column */}
      <div className="w-[100px] flex-shrink-0 py-2.5 pr-2 hidden lg:block">
        <span className="text-[12px] text-gray-400 truncate block">{job.location}</span>
      </div>

      {/* 급여 열 / Salary column */}
      <div className="w-[140px] flex-shrink-0 py-2.5 pr-2 hidden sm:block">
        <span className="text-[12px] text-gray-700 font-medium truncate block">{salary}</span>
      </div>

      {/* 비자 열 / Visa column */}
      <div className="w-[140px] flex-shrink-0 py-2.5 pr-2 hidden md:block">
        <div className="flex items-center gap-1 flex-wrap">
          {job.allowedVisas.slice(0, 2).map((visa) => {
            const visaColor = getVisaColor(visa);
            return (
              <span
                key={visa}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px]"
                style={{ backgroundColor: visaColor.bg, color: visaColor.text }}
              >
                {visa}
              </span>
            );
          })}
          {job.allowedVisas.length > 2 && (
            <span className="text-[11px] text-gray-400">+{job.allowedVisas.length - 2}</span>
          )}
        </div>
      </div>

      {/* D-day / 상태 열 / D-day / Status column */}
      <div className="w-[80px] flex-shrink-0 py-2.5 pr-2">
        <NotionPill label={dDayStatus.label} colorKey={dDayStatus.colorKey} />
      </div>

      {/* 유형 열 / Type column */}
      <div className="w-[70px] flex-shrink-0 py-2.5 pr-3 hidden lg:block">
        <NotionPill
          label={job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          colorKey={job.boardType}
        />
      </div>
    </div>
  );
}

// 정렬 함수 / Sort function
function sortJobs(jobs: MockJobPosting[], sortBy: SortOption): MockJobPosting[] {
  return [...jobs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case 'deadline': {
        const aDate = a.closingDate ? new Date(a.closingDate).getTime() : Infinity;
        const bDate = b.closingDate ? new Date(b.closingDate).getTime() : Infinity;
        return aDate - bDate;
      }
      case 'applicants':
        return b.applicantCount - a.applicantCount;
      case 'views':
        return b.viewCount - a.viewCount;
      default:
        return 0;
    }
  });
}

// 정렬 라벨 맵 / Sort label map
const SORT_LABELS: Record<SortOption, string> = {
  newest: '최신순',
  deadline: '마감임박순',
  applicants: '지원자순',
  views: '조회순',
};

// 페이지 컴포넌트 / Page component
export default function Variant18Page() {
  // 뷰 모드 / View mode
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  // 정렬 / Sort
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  // 정렬 드롭다운 열림 여부 / Sort dropdown open state
  const [isSortOpen, setIsSortOpen] = useState(false);
  // 선택된 항목 / Selected items
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // 검색어 / Search query
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 필터링 / Search filtering
  const searchedJobs = sampleJobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.allowedVisas.some((v) => v.toLowerCase().includes(query))
    );
  });

  // 정렬된 목록 / Sorted list
  const sortedJobs = sortJobs(searchedJobs, sortBy);

  // 선택 토글 / Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 전체 선택/해제 / Select/deselect all
  const toggleSelectAll = () => {
    if (selectedIds.size === sortedJobs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedJobs.map((j) => j.id)));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 노션 스타일 페이지 헤더 / Notion-style page header */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-12 pb-2">
        {/* 아이콘 + 제목 / Icon + title */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">📋</span>
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight">
            채용공고
          </h1>
        </div>
        <p className="text-[14px] text-gray-400 pl-10">
          Job Listings Database &mdash; Notion-style view
        </p>
      </div>

      {/* 데이터베이스 컨트롤 바 / Database control bar */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* 왼쪽: 뷰 전환 + 필터 + 정렬 / Left: view toggle + filter + sort */}
          <div className="flex items-center gap-2">
            {/* 뷰 전환 버튼들 / View toggle buttons */}
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('gallery')}
                className={`
                  flex items-center gap-1 px-2.5 py-1.5 text-[13px]
                  transition-colors duration-100
                  ${viewMode === 'gallery' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}
                `}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gallery</span>
              </button>
              <div className="w-px h-5 bg-gray-200" />
              <button
                onClick={() => setViewMode('table')}
                className={`
                  flex items-center gap-1 px-2.5 py-1.5 text-[13px]
                  transition-colors duration-100
                  ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}
                `}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            {/* 필터 버튼 / Filter button */}
            <button className="flex items-center gap-1 px-2.5 py-1.5 text-[13px] text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>필터 추가</span>
            </button>

            {/* 정렬 드롭다운 / Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[13px] text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{SORT_LABELS[sortBy]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* 정렬 옵션 드롭다운 / Sort option dropdown */}
              {isSortOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20 min-w-[140px]">
                  {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortBy(key);
                        setIsSortOpen(false);
                      }}
                      className={`
                        w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50
                        flex items-center justify-between
                        ${sortBy === key ? 'text-blue-600 font-medium' : 'text-gray-700'}
                      `}
                    >
                      {label}
                      {sortBy === key && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 검색 + 새 항목 / Right: search + new item */}
          <div className="flex items-center gap-2">
            {/* 검색 인풋 / Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="검색 / Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-[13px] border border-gray-200 rounded-md w-44 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 placeholder-gray-300"
              />
            </div>

            {/* 새 항목 버튼 / New item button */}
            <button className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors font-medium">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 공고</span>
            </button>
          </div>
        </div>

        {/* 선택 정보 바 / Selection info bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 mt-2 px-2 py-1.5 bg-blue-50 rounded-md text-[12px]">
            <span className="text-blue-700 font-medium">
              {selectedIds.size}개 선택됨 / {selectedIds.size} selected
            </span>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-blue-500 hover:text-blue-700 underline"
            >
              선택 해제 / Deselect
            </button>
          </div>
        )}
      </div>

      {/* 결과 카운트 / Result count */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-2">
        <div className="flex items-center gap-2 text-[12px] text-gray-400">
          <span>{sortedJobs.length}개 결과 / {sortedJobs.length} results</span>
          {searchQuery && (
            <span className="text-gray-300">&middot; &ldquo;{searchQuery}&rdquo;</span>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 / Main content area */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-12">
        {/* 갤러리 뷰 / Gallery view */}
        {viewMode === 'gallery' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedJobs.map((job) => (
              <GalleryCard
                key={job.id}
                job={job}
                isSelected={selectedIds.has(job.id)}
                onToggleSelect={() => toggleSelect(job.id)}
              />
            ))}
          </div>
        )}

        {/* 테이블 뷰 / Table view */}
        {viewMode === 'table' && (
          <div className="border border-gray-200 rounded-md overflow-hidden">
            {/* 테이블 헤더 / Table header */}
            <div className="flex items-center bg-gray-50 border-b border-gray-200 text-[12px] text-gray-500 font-medium">
              {/* 전체 선택 체크박스 / Select all checkbox */}
              <div className="w-10 flex-shrink-0 flex justify-center py-2">
                <NotionCheckbox
                  checked={selectedIds.size === sortedJobs.length && sortedJobs.length > 0}
                  onChange={toggleSelectAll}
                />
              </div>

              {/* 제목 헤더 / Title header */}
              <div className="flex-1 min-w-0 py-2 pr-3">
                <span>제목 / Title</span>
              </div>

              {/* 회사 헤더 / Company header */}
              <div className="w-[120px] flex-shrink-0 py-2 pr-2 hidden md:block">
                <span>회사 / Company</span>
              </div>

              {/* 위치 헤더 / Location header */}
              <div className="w-[100px] flex-shrink-0 py-2 pr-2 hidden lg:block">
                <span>위치 / Location</span>
              </div>

              {/* 급여 헤더 / Salary header */}
              <div className="w-[140px] flex-shrink-0 py-2 pr-2 hidden sm:block">
                <span>급여 / Salary</span>
              </div>

              {/* 비자 헤더 / Visa header */}
              <div className="w-[140px] flex-shrink-0 py-2 pr-2 hidden md:block">
                <span>비자 / Visa</span>
              </div>

              {/* 상태 헤더 / Status header */}
              <div className="w-[80px] flex-shrink-0 py-2 pr-2">
                <span>상태 / Status</span>
              </div>

              {/* 유형 헤더 / Type header */}
              <div className="w-[70px] flex-shrink-0 py-2 pr-3 hidden lg:block">
                <span>유형 / Type</span>
              </div>
            </div>

            {/* 테이블 행들 / Table rows */}
            {sortedJobs.map((job) => (
              <TableRow
                key={job.id}
                job={job}
                isSelected={selectedIds.has(job.id)}
                onToggleSelect={() => toggleSelect(job.id)}
              />
            ))}

            {/* 새 행 추가 버튼 / Add new row button */}
            <div className="flex items-center border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <div className="w-10 flex-shrink-0" />
              <button className="flex items-center gap-1.5 py-2 text-[13px] text-gray-400 hover:text-gray-600">
                <Plus className="w-3.5 h-3.5" />
                <span>새 공고 추가 / Add new job</span>
              </button>
            </div>
          </div>
        )}

        {/* 검색 결과 없음 / No search results */}
        {sortedJobs.length === 0 && (
          <div className="py-16 flex flex-col items-center text-center">
            <Search className="w-8 h-8 text-gray-300 mb-3" />
            <p className="text-[14px] text-gray-500 font-medium">
              결과가 없습니다 / No results found
            </p>
            <p className="text-[13px] text-gray-400 mt-1">
              검색어를 변경하거나 필터를 수정해주세요
            </p>
            <p className="text-[12px] text-gray-300 mt-0.5">
              Try a different search term or adjust filters
            </p>
          </div>
        )}

        {/* 하단 요약 바 / Bottom summary bar */}
        {sortedJobs.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-[12px] text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {sortedJobs.length}개 공고
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                총 {sortedJobs.reduce((sum, j) => sum + j.applicantCount, 0)}명 지원
              </span>
              <span className="flex items-center gap-1 hidden sm:flex">
                <Eye className="w-3 h-3" />
                총 {sortedJobs.reduce((sum, j) => sum + j.viewCount, 0).toLocaleString()} 조회
              </span>
            </div>
            <span className="text-gray-300">
              시안 18 / Variant 18 &mdash; Notion Database Block
            </span>
          </div>
        )}
      </div>

      {/* 정렬 드롭다운 닫기 오버레이 / Sort dropdown close overlay */}
      {isSortOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsSortOpen(false)}
        />
      )}
    </div>
  );
}
