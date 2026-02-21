'use client';

/**
 * Variant B — 알바 공고 관리 (기업 회원) — 테이블/리스트 뷰
 * Variant B — Alba job management (company) — table/list view
 *
 * 특징: 정렬 가능한 컬럼 (제목, 상태, 시급, 조회수, 지원자, 등록일),
 *       일괄 작업 (마감, 프리미엄), 상태 필터 탭, 컴팩트한 카드 행
 * Features: Sortable columns, batch actions (close, premium upgrade),
 *           status filter tabs, compact card rows
 */

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  MoreHorizontal, Eye, Users, Star, Pause, XCircle, Play,
  ArrowUpRight, Loader2, AlertCircle, FileText,
  CheckSquare, Square, Crown,
} from 'lucide-react';
import type {
  AlbaJobResponse,
  PostStatus,
  TierType,
  PaginationMeta,
} from '../../create/variants/b/components/alba-types';
import {
  POST_STATUS_LABELS,
  DAY_LABELS,
} from '../../create/variants/b/components/alba-types';

// ─── 정렬 방향 / Sort direction ───
type SortDir = 'asc' | 'desc';
type SortField = 'title' | 'status' | 'hourlyWage' | 'viewCount' | 'applyCount' | 'createdAt';

// ─── 상태별 탭 / Status tabs ───
const STATUS_TABS: { key: PostStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'ACTIVE', label: '게시중' },
  { key: 'DRAFT', label: '임시저장' },
  { key: 'PAUSED', label: '일시정지' },
  { key: 'CLOSED', label: '마감' },
  { key: 'EXPIRED', label: '만료' },
];

// ─── 상태 배지 스타일 / Status badge styles ───
function getStatusBadge(status: PostStatus) {
  switch (status) {
    case 'ACTIVE': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' };
    case 'DRAFT': return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' };
    case 'PAUSED': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    case 'CLOSED': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' };
    case 'EXPIRED': return { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400' };
    case 'SUSPENDED': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-600' };
    default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' };
  }
}

// ─── 목업 데이터 / Mock data ───
const MOCK_JOBS: AlbaJobResponse[] = [
  {
    jobId: '1', corporateId: '100', boardType: 'PART_TIME', tierType: 'PREMIUM',
    title: '강남역 카페 주말 바리스타 모집', status: 'ACTIVE',
    jobCategoryCode: 'CAFE_BARISTA', jobCategoryName: '카페/바리스타', ksicCode: 'I',
    jobDescription: '주말 바리스타', recruitCount: 2, hourlyWage: 12000, weeklyHours: 20,
    schedule: [{ dayOfWeek: 'SAT', startTime: '10:00', endTime: '20:00' }, { dayOfWeek: 'SUN', startTime: '10:00', endTime: '20:00' }],
    isWeekendOnly: true, workPeriod: { startDate: '2026-03-01', endDate: null },
    address: { sido: '서울특별시', sigungu: '강남구', detail: '역삼동 123-45', lat: 37.4979, lng: 127.0276 },
    displayAddress: '서울 강남구', koreanLevel: 'DAILY', experienceLevel: 'NONE',
    preferredQualifications: '바리스타 자격증 우대', benefits: ['MEAL', 'TRANSPORT'],
    detailDescription: '주말 바리스타 모집', workContentImg: null,
    applicationDeadline: '2026-03-15', applicationMethod: 'PLATFORM',
    contactName: '김채용', contactPhone: '010-1234-5678', contactEmail: 'hire@cafe.com',
    isPremium: true, premiumStartAt: '2026-02-10T00:00:00Z', premiumEndAt: '2026-02-24T00:00:00Z',
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
    viewCount: 345, scrapCount: 28, applyCount: 12,
    companyName: '카페라떼', companyLogo: null,
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-02-15T14:00:00Z', expiresAt: '2026-02-24T09:00:00Z',
  },
  {
    jobId: '2', corporateId: '100', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '편의점 야간 근무자 급구', status: 'ACTIVE',
    jobCategoryCode: 'CONVENIENCE', jobCategoryName: '편의점', ksicCode: 'G',
    jobDescription: '야간 편의점', recruitCount: 1, hourlyWage: 11000, weeklyHours: 30,
    schedule: [{ dayOfWeek: 'MON', startTime: '22:00', endTime: '24:00' }, { dayOfWeek: 'TUE', startTime: '22:00', endTime: '24:00' }, { dayOfWeek: 'WED', startTime: '22:00', endTime: '24:00' }, { dayOfWeek: 'THU', startTime: '22:00', endTime: '24:00' }, { dayOfWeek: 'FRI', startTime: '22:00', endTime: '24:00' }],
    isWeekendOnly: false, workPeriod: { startDate: '2026-02-20', endDate: '2026-05-31' },
    address: { sido: '서울특별시', sigungu: '서초구', detail: '서초동 100', lat: 37.49, lng: 127.02 },
    displayAddress: '서울 서초구', koreanLevel: 'BASIC', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL'],
    detailDescription: '야간 편의점 근무', workContentImg: null,
    applicationDeadline: '2026-03-01', applicationMethod: 'PHONE',
    contactName: '이매니저', contactPhone: '010-5678-1234', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-2',
    viewCount: 120, scrapCount: 5, applyCount: 3,
    companyName: '카페라떼', companyLogo: null,
    createdAt: '2026-02-14T10:00:00Z', updatedAt: '2026-02-14T10:00:00Z', expiresAt: '2026-02-28T10:00:00Z',
  },
  {
    jobId: '3', corporateId: '100', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '물류센터 포장 알바 (단기)', status: 'DRAFT',
    jobCategoryCode: 'WAREHOUSE', jobCategoryName: '물류/택배 분류', ksicCode: 'H',
    jobDescription: '포장 알바', recruitCount: 5, hourlyWage: 10500, weeklyHours: 40,
    schedule: [{ dayOfWeek: 'MON', startTime: '09:00', endTime: '18:00' }, { dayOfWeek: 'TUE', startTime: '09:00', endTime: '18:00' }, { dayOfWeek: 'WED', startTime: '09:00', endTime: '18:00' }, { dayOfWeek: 'THU', startTime: '09:00', endTime: '18:00' }, { dayOfWeek: 'FRI', startTime: '09:00', endTime: '18:00' }],
    isWeekendOnly: false, workPeriod: { startDate: '2026-03-10', endDate: '2026-04-10' },
    address: { sido: '경기도', sigungu: '안산시', detail: '반월공단 내', lat: 37.32, lng: 126.83 },
    displayAddress: '경기 안산시', koreanLevel: 'NONE', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL', 'TRANSPORT', 'INSURANCE'],
    detailDescription: '물류센터 포장', workContentImg: null,
    applicationDeadline: null, applicationMethod: 'PLATFORM',
    contactName: '박물류', contactPhone: '010-9999-0000', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-2,H-1',
    viewCount: 0, scrapCount: 0, applyCount: 0,
    companyName: '카페라떼', companyLogo: null,
    createdAt: '2026-02-17T15:00:00Z', updatedAt: '2026-02-17T15:00:00Z', expiresAt: null,
  },
  {
    jobId: '4', corporateId: '100', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '식당 홀서빙 주중 파트', status: 'CLOSED',
    jobCategoryCode: 'REST_SERVING', jobCategoryName: '음식점 서빙', ksicCode: 'I',
    jobDescription: '홀서빙', recruitCount: 1, hourlyWage: 10500, weeklyHours: 25,
    schedule: [{ dayOfWeek: 'MON', startTime: '11:00', endTime: '16:00' }, { dayOfWeek: 'WED', startTime: '11:00', endTime: '16:00' }, { dayOfWeek: 'FRI', startTime: '11:00', endTime: '16:00' }],
    isWeekendOnly: false, workPeriod: { startDate: '2026-01-15', endDate: '2026-02-15' },
    address: { sido: '서울특별시', sigungu: '강남구', detail: '선릉동 50', lat: 37.50, lng: 127.04 },
    displayAddress: '서울 강남구', koreanLevel: 'DAILY', experienceLevel: 'UNDER_1Y',
    preferredQualifications: null, benefits: ['MEAL'],
    detailDescription: '식당 서빙', workContentImg: null,
    applicationDeadline: '2026-02-10', applicationMethod: 'PLATFORM',
    contactName: '김식당', contactPhone: '010-1111-2222', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,D-2,F-4',
    viewCount: 89, scrapCount: 4, applyCount: 7,
    companyName: '카페라떼', companyLogo: null,
    createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-02-10T12:00:00Z', expiresAt: '2026-01-29T08:00:00Z',
  },
  {
    jobId: '5', corporateId: '100', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '마트 진열 알바 (토/일)', status: 'PAUSED',
    jobCategoryCode: 'MART_SALES', jobCategoryName: '마트/판매', ksicCode: 'G',
    jobDescription: '마트 진열', recruitCount: 3, hourlyWage: 10300, weeklyHours: 16,
    schedule: [{ dayOfWeek: 'SAT', startTime: '08:00', endTime: '16:00' }, { dayOfWeek: 'SUN', startTime: '08:00', endTime: '16:00' }],
    isWeekendOnly: true, workPeriod: { startDate: '2026-02-01', endDate: null },
    address: { sido: '서울특별시', sigungu: '송파구', detail: '잠실동 200', lat: 37.51, lng: 127.08 },
    displayAddress: '서울 송파구', koreanLevel: 'NONE', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL', 'STAFF_DISCOUNT'],
    detailDescription: '마트 진열', workContentImg: null,
    applicationDeadline: null, applicationMethod: 'PLATFORM',
    contactName: '최마트', contactPhone: '010-3333-4444', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
    viewCount: 67, scrapCount: 10, applyCount: 2,
    companyName: '카페라떼', companyLogo: null,
    createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-02-12T09:00:00Z', expiresAt: '2026-02-15T10:00:00Z',
  },
];

export default function AlbaManageVariantBPage() {
  // ─── 상태 / State ───
  const [jobs] = useState<AlbaJobResponse[]>(MOCK_JOBS);
  const [loading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'ALL'>('ALL');
  const [keyword, setKeyword] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const limit = 20;

  // ─── 필터 + 정렬 + 검색 적용 / Apply filter, sort, search ───
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // 상태 필터 / Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(j => j.status === statusFilter);
    }

    // 키워드 검색 / Keyword search
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(kw) ||
        j.jobCategoryName.toLowerCase().includes(kw) ||
        j.displayAddress.toLowerCase().includes(kw)
      );
    }

    // 정렬 / Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
        case 'hourlyWage': cmp = a.hourlyWage - b.hourlyWage; break;
        case 'viewCount': cmp = a.viewCount - b.viewCount; break;
        case 'applyCount': cmp = a.applyCount - b.applyCount; break;
        case 'createdAt': cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [jobs, statusFilter, keyword, sortField, sortDir]);

  // ─── 상태별 카운트 / Status counts ───
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: jobs.length };
    jobs.forEach(j => {
      counts[j.status] = (counts[j.status] || 0) + 1;
    });
    return counts;
  }, [jobs]);

  // ─── 정렬 토글 / Sort toggle ───
  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }, [sortField]);

  // ─── 전체 선택 토글 / Toggle all ───
  const toggleAll = useCallback(() => {
    if (selectedIds.size === filteredJobs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredJobs.map(j => j.jobId)));
    }
  }, [filteredJobs, selectedIds]);

  // ─── 개별 선택 토글 / Toggle one ───
  const toggleOne = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // ─── D-Day 계산 / D-Day calculation ───
  const getDDay = (deadline: string | null, expiresAt: string | null): string | null => {
    const target = deadline || expiresAt;
    if (!target) return null;
    const diff = Math.ceil((new Date(target).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '마감';
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  // ─── 날짜 포맷 / Date format ───
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  // ─── 정렬 아이콘 / Sort icon ───
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-600" />
      : <ChevronDown className="w-3 h-3 text-blue-600" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* ─── 헤더 / Header ─── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">알바 공고 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            총 {jobs.length}건의 공고 / {jobs.filter(j => j.status === 'ACTIVE').length}건 게시중
          </p>
        </div>
        <Link
          href="/company/alba/create/variants/b"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-800 transition-colors min-h-[44px]"
          aria-label="새 알바 공고 등록 / Create new alba posting"
        >
          <Plus className="w-4 h-4" />
          공고 등록
        </Link>
      </div>

      {/* ─── 상태 탭 / Status tabs ─── */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => { setStatusFilter(tab.key); setPage(1); setSelectedIds(new Set()); }}
            className={`
              px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[44px]
              ${statusFilter === tab.key
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'}
            `}
            aria-label={`${tab.label} 필터`}
          >
            {tab.label}
            <span className="ml-1 text-xs text-gray-400">
              ({statusCounts[tab.key] || 0})
            </span>
          </button>
        ))}
      </div>

      {/* ─── 검색 + 일괄 작업 바 / Search + batch actions bar ─── */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        {/* 검색 / Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="공고명, 직종, 지역으로 검색..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded text-sm focus:border-blue-400 outline-none"
            aria-label="공고 검색 / Search jobs"
          />
        </div>

        {/* 일괄 작업 / Batch actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{selectedIds.size}건 선택</span>
            <button
              type="button"
              className="px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors min-h-[36px]"
              aria-label="선택 공고 마감 / Close selected"
            >
              <XCircle className="w-3.5 h-3.5 inline mr-1" />
              마감
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs border border-amber-200 text-amber-600 rounded hover:bg-amber-50 transition-colors min-h-[36px]"
              aria-label="선택 공고 프리미엄 / Upgrade selected to premium"
            >
              <Crown className="w-3.5 h-3.5 inline mr-1" />
              프리미엄
            </button>
          </div>
        )}
      </div>

      {/* ─── 로딩 / Loading ─── */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      )}

      {/* ─── 빈 상태 / Empty state ─── */}
      {!loading && filteredJobs.length === 0 && (
        <div className="border border-gray-200 rounded-sm bg-white p-12 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-600 mb-1">
            {keyword ? '검색 결과가 없습니다' : '등록된 공고가 없습니다'}
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            {keyword ? '다른 검색어로 시도해보세요' : '새 알바 공고를 등록해보세요'}
          </p>
          {!keyword && (
            <Link
              href="/company/alba/create/variants/b"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              공고 등록
            </Link>
          )}
        </div>
      )}

      {/* ─── 테이블 / Table ─── */}
      {!loading && filteredJobs.length > 0 && (
        <div className="border border-gray-200 rounded-sm bg-white overflow-x-auto">
          <table className="w-full text-sm">
            {/* 테이블 헤더 / Table header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {/* 체크박스 / Checkbox */}
                <th className="w-10 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="flex items-center justify-center w-5 h-5"
                    aria-label="전체 선택 / Select all"
                  >
                    {selectedIds.size === filteredJobs.length && filteredJobs.length > 0
                      ? <CheckSquare className="w-4 h-4 text-blue-600" />
                      : <Square className="w-4 h-4 text-gray-400" />
                    }
                  </button>
                </th>
                {/* 공고명 / Title */}
                <th className="text-left px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => toggleSort('title')}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700"
                    aria-label="공고명 정렬 / Sort by title"
                  >
                    공고명 <SortIcon field="title" />
                  </button>
                </th>
                {/* 상태 / Status */}
                <th className="text-left px-3 py-2.5 hidden sm:table-cell">
                  <button
                    type="button"
                    onClick={() => toggleSort('status')}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700"
                    aria-label="상태 정렬 / Sort by status"
                  >
                    상태 <SortIcon field="status" />
                  </button>
                </th>
                {/* 시급 / Wage */}
                <th className="text-right px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => toggleSort('hourlyWage')}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 ml-auto"
                    aria-label="시급 정렬 / Sort by wage"
                  >
                    시급 <SortIcon field="hourlyWage" />
                  </button>
                </th>
                {/* 조회수 / Views */}
                <th className="text-right px-3 py-2.5 hidden md:table-cell">
                  <button
                    type="button"
                    onClick={() => toggleSort('viewCount')}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 ml-auto"
                    aria-label="조회수 정렬 / Sort by views"
                  >
                    조회 <SortIcon field="viewCount" />
                  </button>
                </th>
                {/* 지원자 / Applicants */}
                <th className="text-right px-3 py-2.5 hidden md:table-cell">
                  <button
                    type="button"
                    onClick={() => toggleSort('applyCount')}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 ml-auto"
                    aria-label="지원자 정렬 / Sort by applicants"
                  >
                    지원 <SortIcon field="applyCount" />
                  </button>
                </th>
                {/* 등록일 / Posted */}
                <th className="text-right px-3 py-2.5 hidden lg:table-cell">
                  <button
                    type="button"
                    onClick={() => toggleSort('createdAt')}
                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700 ml-auto"
                    aria-label="등록일 정렬 / Sort by date"
                  >
                    등록일 <SortIcon field="createdAt" />
                  </button>
                </th>
                {/* 액션 / Actions */}
                <th className="w-10 px-3 py-2.5" />
              </tr>
            </thead>

            {/* 테이블 바디 / Table body */}
            <tbody className="divide-y divide-gray-100">
              {filteredJobs.map(job => {
                const statusStyle = getStatusBadge(job.status);
                const dDay = getDDay(job.applicationDeadline, job.expiresAt);
                const isSelected = selectedIds.has(job.jobId);

                return (
                  <tr
                    key={job.jobId}
                    className={`hover:bg-gray-50/50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
                  >
                    {/* 체크박스 / Checkbox */}
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => toggleOne(job.jobId)}
                        className="flex items-center justify-center w-5 h-5"
                        aria-label={`${job.title} 선택`}
                      >
                        {isSelected
                          ? <CheckSquare className="w-4 h-4 text-blue-600" />
                          : <Square className="w-4 h-4 text-gray-300" />
                        }
                      </button>
                    </td>

                    {/* 공고명 / Title */}
                    <td className="px-3 py-2.5">
                      <Link href={`/company/alba/create/variants/b?edit=${job.jobId}`} className="group">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {job.isPremium && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              P
                            </span>
                          )}
                          <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {job.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{job.jobCategoryName}</span>
                          <span>|</span>
                          <span>{job.displayAddress}</span>
                          <span>|</span>
                          <span>{job.schedule.map(s => DAY_LABELS[s.dayOfWeek]).join('/')}</span>
                        </div>
                      </Link>
                    </td>

                    {/* 상태 / Status */}
                    <td className="px-3 py-2.5 hidden sm:table-cell">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {POST_STATUS_LABELS[job.status]}
                        </span>
                        {dDay && (
                          <span className={`text-[11px] font-semibold ${dDay === '마감' ? 'text-red-500' : 'text-blue-600'}`}>
                            {dDay}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 시급 / Wage */}
                    <td className="px-3 py-2.5 text-right">
                      <span className="font-semibold text-blue-700">
                        {job.hourlyWage.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-xs">원</span>
                    </td>

                    {/* 조회수 / Views */}
                    <td className="px-3 py-2.5 text-right hidden md:table-cell">
                      <span className="text-gray-600 flex items-center justify-end gap-1">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                        {job.viewCount}
                      </span>
                    </td>

                    {/* 지원자 / Applicants */}
                    <td className="px-3 py-2.5 text-right hidden md:table-cell">
                      <span className="text-gray-600 flex items-center justify-end gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        {job.applyCount}
                      </span>
                    </td>

                    {/* 등록일 / Posted date */}
                    <td className="px-3 py-2.5 text-right hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        {formatDate(job.createdAt)}
                      </span>
                    </td>

                    {/* 액션 / Actions */}
                    <td className="px-3 py-2.5">
                      <div className="relative group">
                        <button
                          type="button"
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label={`${job.title} 더보기 메뉴`}
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                        {/* 드롭다운 (CSS hover) / Dropdown */}
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 hidden group-focus-within:block group-hover:block min-w-[140px]">
                          {job.status === 'ACTIVE' && (
                            <>
                              <button type="button" className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 min-h-[36px]" aria-label="일시정지">
                                <Pause className="w-3.5 h-3.5 text-amber-500" />일시정지
                              </button>
                              <button type="button" className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 min-h-[36px]" aria-label="마감">
                                <XCircle className="w-3.5 h-3.5 text-red-500" />마감
                              </button>
                              {!job.isPremium && (
                                <button type="button" className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 min-h-[36px]" aria-label="프리미엄 업그레이드">
                                  <Star className="w-3.5 h-3.5 text-amber-500" />상위노출
                                </button>
                              )}
                            </>
                          )}
                          {job.status === 'PAUSED' && (
                            <>
                              <button type="button" className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 min-h-[36px]" aria-label="재게시">
                                <Play className="w-3.5 h-3.5 text-green-500" />재게시
                              </button>
                              <button type="button" className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 min-h-[36px]" aria-label="마감">
                                <XCircle className="w-3.5 h-3.5 text-red-500" />마감
                              </button>
                            </>
                          )}
                          {job.status === 'DRAFT' && (
                            <button type="button" className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 min-h-[36px]" aria-label="게시하기">
                              <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />게시하기
                            </button>
                          )}
                          <Link href={`/company/alba/create/variants/b?edit=${job.jobId}`} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 min-h-[36px] border-t border-gray-100">
                            <FileText className="w-3.5 h-3.5 text-gray-400" />수정
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── 페이지네이션 / Pagination ─── */}
      {filteredJobs.length > limit && (
        <div className="flex justify-center items-center gap-1.5 mt-4">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="이전 페이지 / Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 px-2">
            {page} / {Math.ceil(filteredJobs.length / limit)}
          </span>
          <button
            type="button"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(filteredJobs.length / limit)}
            className="p-2 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="다음 페이지 / Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
