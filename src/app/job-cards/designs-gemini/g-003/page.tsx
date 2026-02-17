'use client';

// g-003 인크루트 테이블 (Incruit Table) — 채용공고 테이블 형태 리스트
// g-003 Incruit Table — Job postings in table format with sortable columns

import React, { useState, useMemo, useCallback } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getTimeAgo,
  getIndustryColor,
  getVisaColor,
} from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Eye,
  Flame,
  Award,
  Star,
  Briefcase,
  Wallet,
  ChevronDown,
} from 'lucide-react';

// 시안 정보 / Design information
const designInfo = {
  id: 'g-003',
  name: '인크루트 테이블 (Incruit Table)',
  category: '미니멀',
  reference: '인크루트',
  description:
    '표(테이블) 형태 레이아웃으로 채용공고를 한눈에 비교. 컬럼별 정렬, 페이지네이션, 행 호버 하이라이트 지원. 모바일에서는 카드로 자동 전환.',
  author: 'Gemini + Claude',
};

// 정렬 키 타입 / Sort key type
type SortKey = 'company' | 'title' | 'location' | 'salary' | 'dday' | 'applicants' | 'industry';

// 정렬 방향 타입 / Sort direction type
type SortDirection = 'asc' | 'desc';

// 정렬 상태 타입 / Sort state type
interface SortState {
  key: SortKey;
  direction: SortDirection;
}

// 급여를 숫자로 변환 (정렬용) / Convert salary to number for sorting
function getSalaryValue(job: MockJobPostingV2): number {
  if (job.hourlyWage) return job.hourlyWage;
  if (job.salaryMin) return job.salaryMin;
  return 0;
}

// D-day를 숫자로 변환 (정렬용) / Convert D-day to number for sorting
function getDDayValue(closingDate: string | null): number {
  if (!closingDate) return 9999; // 상시모집은 마지막으로 / Open positions go last
  const diff = Math.ceil(
    (new Date(closingDate).getTime() - Date.now()) / 86400000
  );
  return diff;
}

// 정렬 가능한 테이블 헤더 컴포넌트 / Sortable table header component
const SortableHeader: React.FC<{
  label: string;
  sortKey: SortKey;
  currentSort: SortState | null;
  onSort: (key: SortKey) => void;
  className?: string;
}> = ({ label, sortKey, currentSort, onSort, className = '' }) => {
  const isActive = currentSort?.key === sortKey;

  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {isActive ? (
          currentSort.direction === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />
        )}
      </div>
    </th>
  );
};

// 비자 배지 렌더링 / Render visa badges
const VisaBadges: React.FC<{ visas: string[]; maxShow?: number }> = ({
  visas,
  maxShow = 3,
}) => {
  const shown = visas.slice(0, maxShow);
  const remaining = visas.length - maxShow;

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((visa) => {
        const { bg, text } = getVisaColor(visa);
        return (
          <span
            key={visa}
            className={`${bg} ${text} text-[10px] font-bold px-1.5 py-0.5 rounded`}
          >
            {visa}
          </span>
        );
      })}
      {remaining > 0 && (
        <span className="bg-gray-100 text-gray-500 text-[10px] font-medium px-1.5 py-0.5 rounded">
          +{remaining}
        </span>
      )}
    </div>
  );
};

// 모바일 카드 컴포넌트 / Mobile card component
const MobileJobCard: React.FC<{ job: MockJobPostingV2 }> = ({ job }) => {
  const dDay = getDDay(job.closingDate);
  const industryColor = getIndustryColor(job.industry);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 active:bg-blue-50">
      {/* 상단: 회사 + 마감일 / Top: Company + Deadline */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src={job.companyLogo}
            alt={`${job.company} 로고`}
            className="h-5 w-auto object-contain"
          />
          <span className="text-sm font-medium text-gray-600">
            {job.company}
          </span>
        </div>
        {dDay && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              dDay === '마감'
                ? 'bg-gray-100 text-gray-400'
                : dDay === 'D-Day'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-50 text-blue-600'
            }`}
          >
            {dDay}
          </span>
        )}
      </div>

      {/* 제목 + 배지 / Title + Badges */}
      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
        {job.title}
      </h3>

      <div className="flex flex-wrap gap-1 mb-3">
        {job.tierType === 'PREMIUM' && (
          <span className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Award className="w-2.5 h-2.5" />
            프리미엄
          </span>
        )}
        {job.isUrgent && (
          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Flame className="w-2.5 h-2.5" />
            긴급
          </span>
        )}
        {job.isFeatured && (
          <span className="bg-green-50 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5" />
            추천
          </span>
        )}
      </div>

      {/* 상세 정보 / Details */}
      <div className="space-y-1.5 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wallet className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="font-medium text-gray-800">
            {formatSalary(job)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${industryColor.bg} ${industryColor.text}`}
          >
            {job.industry}
          </span>
        </div>
      </div>

      {/* 비자 + 메타 / Visas + Meta */}
      <div className="flex items-end justify-between">
        <VisaBadges visas={job.allowedVisas} maxShow={3} />
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-0.5">
            <Users className="w-3 h-3" />
            {job.applicantCount}
          </span>
          <span className="flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {getTimeAgo(job.postedDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

// 페이지 메인 컴포넌트 / Page main component
export default function IncruitTablePage() {
  // 정렬 상태 / Sort state
  const [sortState, setSortState] = useState<SortState | null>(null);

  // 페이지네이션 상태 (데스크톱용) / Pagination state (for desktop)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 정렬 드롭다운 상태 / Sort dropdown state
  const [dropdownSort, setDropdownSort] = useState<string>('');

  // 정렬 토글 핸들러 / Sort toggle handler
  const handleSort = useCallback(
    (key: SortKey) => {
      setSortState((prev) => {
        if (prev?.key === key) {
          // 같은 키: 방향 전환 / Same key: toggle direction
          return prev.direction === 'asc'
            ? { key, direction: 'desc' }
            : null; // 세 번째 클릭: 정렬 해제 / Third click: clear sort
        }
        return { key, direction: 'asc' };
      });
      setCurrentPage(1); // 정렬 변경 시 첫 페이지로 / Reset to page 1 on sort change
    },
    []
  );

  // 드롭다운 정렬 핸들러 (모바일) / Dropdown sort handler (mobile)
  const handleDropdownSort = useCallback(
    (value: string) => {
      setDropdownSort(value);
      if (!value) {
        setSortState(null);
      } else {
        setSortState({ key: value as SortKey, direction: 'asc' });
      }
      setCurrentPage(1);
    },
    []
  );

  // 정렬된 데이터 / Sorted data
  const sortedJobs = useMemo(() => {
    const jobs = [...sampleJobsV2];
    if (!sortState) return jobs;

    return jobs.sort((a, b) => {
      let comparison = 0;

      switch (sortState.key) {
        case 'company':
          comparison = a.company.localeCompare(b.company, 'ko');
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ko');
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location, 'ko');
          break;
        case 'salary':
          comparison = getSalaryValue(a) - getSalaryValue(b);
          break;
        case 'dday':
          comparison = getDDayValue(a.closingDate) - getDDayValue(b.closingDate);
          break;
        case 'applicants':
          comparison = a.applicantCount - b.applicantCount;
          break;
        case 'industry':
          comparison = a.industry.localeCompare(b.industry, 'ko');
          break;
      }

      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [sortState]);

  // 페이지네이션 계산 / Pagination calculation
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedJobs.slice(start, start + itemsPerPage);
  }, [sortedJobs, currentPage]);

  // 페이지 변경 핸들러 / Page change handler
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* 페이지 헤더 / Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {designInfo.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold">ID:</span> {designInfo.id} |{' '}
            <span className="font-semibold">카테고리:</span>{' '}
            {designInfo.category} |{' '}
            <span className="font-semibold">레퍼런스:</span>{' '}
            {designInfo.reference}
          </p>
          <p className="text-sm text-gray-600 mt-2 bg-gray-50 border border-gray-100 rounded-md p-3">
            {designInfo.description}
          </p>
        </div>
      </div>

      {/* 메인 콘텐츠 / Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 상단 툴바: 총 건수 + 정렬 드롭다운 / Toolbar: Total count + sort dropdown */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            전체{' '}
            <span className="font-bold text-blue-600">
              {sampleJobsV2.length}
            </span>
            건
          </p>

          {/* 모바일 정렬 드롭다운 / Mobile sort dropdown */}
          <div className="relative md:hidden">
            <select
              value={dropdownSort}
              onChange={(e) => handleDropdownSort(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">기본 정렬</option>
              <option value="company">회사명</option>
              <option value="title">공고명</option>
              <option value="salary">급여순</option>
              <option value="dday">마감임박순</option>
              <option value="applicants">지원자순</option>
              <option value="industry">산업별</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* 데스크톱 정렬 드롭다운 / Desktop sort dropdown */}
          <div className="relative hidden md:block">
            <select
              value={dropdownSort}
              onChange={(e) => handleDropdownSort(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">정렬 선택</option>
              <option value="company">회사명</option>
              <option value="title">공고명</option>
              <option value="salary">급여순</option>
              <option value="dday">마감임박순</option>
              <option value="applicants">지원자순</option>
              <option value="industry">산업별</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* ========== 데스크톱: 테이블 뷰 / Desktop: Table view ========== */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            {/* 테이블 헤더 / Table header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortableHeader
                  label="회사"
                  sortKey="company"
                  currentSort={sortState}
                  onSort={handleSort}
                  className="w-[160px]"
                />
                <SortableHeader
                  label="공고명"
                  sortKey="title"
                  currentSort={sortState}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="근무지"
                  sortKey="location"
                  currentSort={sortState}
                  onSort={handleSort}
                  className="w-[120px]"
                />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[140px]">
                  비자
                </th>
                <SortableHeader
                  label="급여"
                  sortKey="salary"
                  currentSort={sortState}
                  onSort={handleSort}
                  className="w-[160px]"
                />
                <SortableHeader
                  label="산업"
                  sortKey="industry"
                  currentSort={sortState}
                  onSort={handleSort}
                  className="w-[100px]"
                />
                <SortableHeader
                  label="지원"
                  sortKey="applicants"
                  currentSort={sortState}
                  onSort={handleSort}
                  className="w-[70px]"
                />
                <SortableHeader
                  label="마감"
                  sortKey="dday"
                  currentSort={sortState}
                  onSort={handleSort}
                  className="w-[80px]"
                />
              </tr>
            </thead>

            {/* 테이블 바디 / Table body */}
            <tbody className="divide-y divide-gray-100">
              {paginatedJobs.map((job) => {
                const dDay = getDDay(job.closingDate);
                const industryColor = getIndustryColor(job.industry);

                return (
                  <tr
                    key={job.id}
                    className="border-l-4 border-l-transparent hover:bg-blue-50 hover:border-l-blue-500 transition-all duration-150 cursor-pointer group"
                  >
                    {/* 회사 / Company */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={job.companyLogo}
                          alt={`${job.company} 로고`}
                          className="h-5 w-auto object-contain shrink-0"
                        />
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {job.company}
                        </span>
                      </div>
                    </td>

                    {/* 공고명 / Title */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                          {job.title}
                        </span>
                        {/* 배지들 / Badges */}
                        <div className="flex items-center gap-1 shrink-0">
                          {job.tierType === 'PREMIUM' && (
                            <Award className="w-3.5 h-3.5 text-yellow-500" />
                          )}
                          {job.isUrgent && (
                            <Flame className="w-3.5 h-3.5 text-red-500" />
                          )}
                          {job.isFeatured && (
                            <Star className="w-3.5 h-3.5 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-400">
                          {job.boardType === 'FULL_TIME'
                            ? '정규직'
                            : '파트타임'}
                        </span>
                        {job.experienceRequired && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="text-[11px] text-gray-400">
                              {job.experienceRequired}
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* 근무지 / Location */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {job.location}
                      </span>
                    </td>

                    {/* 비자 / Visas */}
                    <td className="px-4 py-3">
                      <VisaBadges visas={job.allowedVisas} maxShow={2} />
                    </td>

                    {/* 급여 / Salary */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-800">
                        {formatSalary(job)}
                      </span>
                    </td>

                    {/* 산업 / Industry */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-medium px-2 py-1 rounded ${industryColor.bg} ${industryColor.text}`}
                      >
                        {job.industry}
                      </span>
                    </td>

                    {/* 지원자 수 / Applicant count */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>{job.applicantCount}</span>
                      </div>
                    </td>

                    {/* 마감일 / Deadline */}
                    <td className="px-4 py-3">
                      {dDay && (
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            dDay === '마감'
                              ? 'bg-gray-100 text-gray-400'
                              : dDay === 'D-Day'
                                ? 'bg-red-100 text-red-600 animate-pulse'
                                : dDay === '상시모집'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : parseInt(dDay.replace('D-', '')) <= 7
                                    ? 'bg-red-50 text-red-500'
                                    : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {dDay}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 테이블 푸터: 페이지네이션 / Table footer: Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {(currentPage - 1) * itemsPerPage + 1}~
              {Math.min(currentPage * itemsPerPage, sortedJobs.length)} /{' '}
              {sortedJobs.length}건
            </p>
            <div className="flex items-center gap-1">
              {/* 이전 페이지 / Previous page */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-white hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="이전 페이지"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* 페이지 번호 / Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-white hover:text-blue-600 border border-transparent hover:border-blue-400'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* 다음 페이지 / Next page */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-white hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="다음 페이지"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========== 모바일: 카드 뷰 / Mobile: Card view ========== */}
        <div className="md:hidden space-y-3">
          {sortedJobs.map((job) => (
            <MobileJobCard key={job.id} job={job} />
          ))}
        </div>

        {/* 모바일 페이지네이션 (전체 표시이므로 불필요, 대신 결과 건수 표시) */}
        {/* Mobile shows all items, so display count instead of pagination */}
        <div className="md:hidden mt-4 text-center">
          <p className="text-xs text-gray-400">
            총 {sampleJobsV2.length}건의 공고
          </p>
        </div>
      </div>
    </div>
  );
}
