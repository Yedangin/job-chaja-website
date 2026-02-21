'use client';

/**
 * Variant B — 알바 공고 검색 (구직자) — 좌측 사이드바 필터 + 우측 밀도 높은 목록
 * Variant B — Alba job search (worker) — left sidebar filters + right dense list
 *
 * 특징: 사이드바에 상세 필터 (지역 트리, 직종 트리, 시급 슬라이더, 요일 체크박스, 시간 범위),
 *       상단 배너에 프리미엄 공고 가로 스크롤, 정렬 옵션
 * Features: Sidebar with detailed filters (region tree, category tree, wage slider,
 *           day checkboxes, hour range), top premium banner (horizontal scroll), sort options
 */

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, Clock, Star, Filter,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Eye, Bookmark, Loader2, X,
  Shield, ShieldAlert, AlertCircle, Briefcase,
} from 'lucide-react';
import type {
  AlbaJobResponse,
  AlbaSearchJob,
  ScheduleItem,
  SortBy,
  VisaMatch,
} from '../../../../company/alba/create/variants/b/components/alba-types';
import {
  DAY_LABELS,
  BENEFIT_LABELS,
  JOB_CATEGORIES,
  SIDO_LIST,
} from '../../../../company/alba/create/variants/b/components/alba-types';

// ─── 정렬 옵션 / Sort options ───
const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: 'LATEST', label: '최신순' },
  { key: 'WAGE_HIGH', label: '시급높은순' },
  { key: 'DISTANCE', label: '거리순' },
  { key: 'DEADLINE', label: '마감임박순' },
];

// ─── 목업 프리미엄 공고 / Mock premium jobs ───
const MOCK_PREMIUM: AlbaSearchJob[] = [
  {
    jobId: 'p1', corporateId: '200', boardType: 'PART_TIME', tierType: 'PREMIUM',
    title: '신촌 요거트 아이스크림 카페 알바', status: 'ACTIVE',
    jobCategoryCode: 'CAFE_BARISTA', jobCategoryName: '카페/바리스타', ksicCode: 'I',
    jobDescription: '아이스크림 제조 및 서빙', recruitCount: 2, hourlyWage: 12500, weeklyHours: 16,
    schedule: [{ dayOfWeek: 'SAT', startTime: '11:00', endTime: '19:00' }, { dayOfWeek: 'SUN', startTime: '11:00', endTime: '19:00' }],
    isWeekendOnly: true, workPeriod: { startDate: '2026-03-01', endDate: null },
    address: { sido: '서울특별시', sigungu: '서대문구', detail: '신촌동 100', lat: 37.556, lng: 126.937 },
    displayAddress: '서울 서대문구', koreanLevel: 'BASIC', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL', 'STAFF_DISCOUNT'],
    detailDescription: '', workContentImg: null,
    applicationDeadline: '2026-03-20', applicationMethod: 'PLATFORM',
    contactName: '', contactPhone: '', contactEmail: null,
    isPremium: true, premiumStartAt: '2026-02-15T00:00:00Z', premiumEndAt: '2026-03-01T00:00:00Z',
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
    viewCount: 512, scrapCount: 45, applyCount: 18,
    companyName: '요거프레소 신촌점', companyLogo: null,
    createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z', expiresAt: '2026-03-01T10:00:00Z',
    visaMatch: { status: 'eligible', conditions: [] },
  },
  {
    jobId: 'p2', corporateId: '201', boardType: 'PART_TIME', tierType: 'PREMIUM',
    title: '홍대 이자카야 주말 서빙', status: 'ACTIVE',
    jobCategoryCode: 'REST_SERVING', jobCategoryName: '음식점 서빙', ksicCode: 'I',
    jobDescription: '이자카야 서빙', recruitCount: 3, hourlyWage: 13000, weeklyHours: 16,
    schedule: [{ dayOfWeek: 'FRI', startTime: '18:00', endTime: '24:00' }, { dayOfWeek: 'SAT', startTime: '18:00', endTime: '24:00' }],
    isWeekendOnly: false, workPeriod: { startDate: '2026-03-01', endDate: null },
    address: { sido: '서울특별시', sigungu: '마포구', detail: '서교동 200', lat: 37.556, lng: 126.923 },
    displayAddress: '서울 마포구', koreanLevel: 'DAILY', experienceLevel: 'NONE',
    preferredQualifications: '일본어 가능자 우대', benefits: ['MEAL', 'TRANSPORT'],
    detailDescription: '', workContentImg: null,
    applicationDeadline: '2026-03-15', applicationMethod: 'PLATFORM',
    contactName: '', contactPhone: '', contactEmail: null,
    isPremium: true, premiumStartAt: '2026-02-14T00:00:00Z', premiumEndAt: '2026-02-28T00:00:00Z',
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2',
    viewCount: 389, scrapCount: 32, applyCount: 14,
    companyName: '이자카야 스키야키', companyLogo: null,
    createdAt: '2026-02-14T10:00:00Z', updatedAt: '2026-02-14T10:00:00Z', expiresAt: '2026-02-28T10:00:00Z',
    visaMatch: { status: 'conditional', conditions: ['평일 근무 포함 — TOPIK 3급+ 필요'] },
  },
  {
    jobId: 'p3', corporateId: '202', boardType: 'PART_TIME', tierType: 'PREMIUM',
    title: '건대입구 버블티 카페 바리스타', status: 'ACTIVE',
    jobCategoryCode: 'CAFE_BARISTA', jobCategoryName: '카페/바리스타', ksicCode: 'I',
    jobDescription: '버블티 제조', recruitCount: 1, hourlyWage: 11500, weeklyHours: 20,
    schedule: [{ dayOfWeek: 'MON', startTime: '14:00', endTime: '18:00' }, { dayOfWeek: 'WED', startTime: '14:00', endTime: '18:00' }, { dayOfWeek: 'FRI', startTime: '14:00', endTime: '18:00' }, { dayOfWeek: 'SAT', startTime: '10:00', endTime: '18:00' }],
    isWeekendOnly: false, workPeriod: { startDate: '2026-03-01', endDate: '2026-06-30' },
    address: { sido: '서울특별시', sigungu: '광진구', detail: '화양동 5', lat: 37.54, lng: 127.07 },
    displayAddress: '서울 광진구', koreanLevel: 'BASIC', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL', 'STAFF_DISCOUNT'],
    detailDescription: '', workContentImg: null,
    applicationDeadline: '2026-03-10', applicationMethod: 'PLATFORM',
    contactName: '', contactPhone: '', contactEmail: null,
    isPremium: true, premiumStartAt: '2026-02-16T00:00:00Z', premiumEndAt: '2026-03-02T00:00:00Z',
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-1,D-2,F-4',
    viewCount: 267, scrapCount: 22, applyCount: 9,
    companyName: '공차 건대점', companyLogo: null,
    createdAt: '2026-02-16T10:00:00Z', updatedAt: '2026-02-16T10:00:00Z', expiresAt: '2026-03-02T10:00:00Z',
    visaMatch: { status: 'eligible', conditions: [] },
  },
];

// ─── 목업 일반 공고 / Mock regular jobs ───
const MOCK_JOBS: AlbaSearchJob[] = [
  {
    jobId: 'j1', corporateId: '300', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '역삼동 한식당 런치 서빙', status: 'ACTIVE',
    jobCategoryCode: 'REST_SERVING', jobCategoryName: '음식점 서빙', ksicCode: 'I',
    jobDescription: '런치 서빙', recruitCount: 1, hourlyWage: 10500, weeklyHours: 15,
    schedule: [{ dayOfWeek: 'MON', startTime: '11:00', endTime: '14:00' }, { dayOfWeek: 'TUE', startTime: '11:00', endTime: '14:00' }, { dayOfWeek: 'WED', startTime: '11:00', endTime: '14:00' }, { dayOfWeek: 'THU', startTime: '11:00', endTime: '14:00' }, { dayOfWeek: 'FRI', startTime: '11:00', endTime: '14:00' }],
    isWeekendOnly: false, workPeriod: { startDate: '2026-02-20', endDate: null },
    address: { sido: '서울특별시', sigungu: '강남구', detail: '역삼동 55', lat: 37.498, lng: 127.028 },
    displayAddress: '서울 강남구', koreanLevel: 'DAILY', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL'],
    detailDescription: '', workContentImg: null,
    applicationDeadline: '2026-03-05', applicationMethod: 'PLATFORM',
    contactName: '', contactPhone: '', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,D-2,H-2,F-4',
    viewCount: 156, scrapCount: 8, applyCount: 5,
    companyName: '한식당 미소', companyLogo: null,
    createdAt: '2026-02-13T10:00:00Z', updatedAt: '2026-02-13T10:00:00Z', expiresAt: '2026-02-27T10:00:00Z',
    visaMatch: { status: 'conditional', conditions: ['TOPIK 3급+ 필요 (주 15시간)'] },
    distanceFromSchool: '25분',
  },
  {
    jobId: 'j2', corporateId: '301', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '선릉역 GS25 편의점 야간', status: 'ACTIVE',
    jobCategoryCode: 'CONVENIENCE', jobCategoryName: '편의점', ksicCode: 'G',
    jobDescription: '편의점 야간', recruitCount: 1, hourlyWage: 11000, weeklyHours: 20,
    schedule: [{ dayOfWeek: 'FRI', startTime: '22:00', endTime: '24:00' }, { dayOfWeek: 'SAT', startTime: '22:00', endTime: '24:00' }],
    isWeekendOnly: false, workPeriod: { startDate: '2026-02-25', endDate: null },
    address: { sido: '서울특별시', sigungu: '강남구', detail: '선릉로 100', lat: 37.504, lng: 127.049 },
    displayAddress: '서울 강남구', koreanLevel: 'BASIC', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL', 'INSURANCE'],
    detailDescription: '', workContentImg: null,
    applicationDeadline: null, applicationMethod: 'PHONE',
    contactName: '', contactPhone: '', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-2,H-1',
    viewCount: 89, scrapCount: 3, applyCount: 2,
    companyName: 'GS25 선릉역점', companyLogo: null,
    createdAt: '2026-02-16T14:00:00Z', updatedAt: '2026-02-16T14:00:00Z', expiresAt: '2026-03-02T14:00:00Z',
    visaMatch: { status: 'eligible', conditions: [] },
    distanceFromSchool: '15분',
  },
  {
    jobId: 'j3', corporateId: '302', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '안산 반월공단 포장 알바 (단기)', status: 'ACTIVE',
    jobCategoryCode: 'WAREHOUSE', jobCategoryName: '물류/택배 분류', ksicCode: 'H',
    jobDescription: '물류 포장', recruitCount: 10, hourlyWage: 10500, weeklyHours: 40,
    schedule: [{ dayOfWeek: 'MON', startTime: '09:00', endTime: '18:00' }, { dayOfWeek: 'TUE', startTime: '09:00', endTime: '18:00' }, { dayOfWeek: 'WED', startTime: '09:00', endTime: '18:00' }, { dayOfWeek: 'THU', startTime: '09:00', endTime: '18:00' }, { dayOfWeek: 'FRI', startTime: '09:00', endTime: '18:00' }],
    isWeekendOnly: false, workPeriod: { startDate: '2026-03-10', endDate: '2026-04-10' },
    address: { sido: '경기도', sigungu: '안산시', detail: '반월공단', lat: 37.32, lng: 126.83 },
    displayAddress: '경기 안산시', koreanLevel: 'NONE', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL', 'TRANSPORT', 'INSURANCE'],
    detailDescription: '', workContentImg: null,
    applicationDeadline: '2026-03-05', applicationMethod: 'PLATFORM',
    contactName: '', contactPhone: '', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,H-2',
    viewCount: 234, scrapCount: 15, applyCount: 22,
    companyName: '물류센터 코리아', companyLogo: null,
    createdAt: '2026-02-17T09:00:00Z', updatedAt: '2026-02-17T09:00:00Z', expiresAt: '2026-03-03T09:00:00Z',
    visaMatch: { status: 'conditional', conditions: ['주 40시간 — D-2 최대 30시간 초과', '물류/운수업 TOPIK 4급+ 필요'] },
    distanceFromSchool: '1시간 20분',
  },
  {
    jobId: 'j4', corporateId: '303', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '잠실 롯데마트 토/일 진열', status: 'ACTIVE',
    jobCategoryCode: 'MART_SALES', jobCategoryName: '마트/판매', ksicCode: 'G',
    jobDescription: '마트 진열', recruitCount: 2, hourlyWage: 10300, weeklyHours: 16,
    schedule: [{ dayOfWeek: 'SAT', startTime: '08:00', endTime: '16:00' }, { dayOfWeek: 'SUN', startTime: '08:00', endTime: '16:00' }],
    isWeekendOnly: true, workPeriod: { startDate: '2026-03-01', endDate: null },
    address: { sido: '서울특별시', sigungu: '송파구', detail: '잠실동 100', lat: 37.51, lng: 127.08 },
    displayAddress: '서울 송파구', koreanLevel: 'NONE', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL', 'STAFF_DISCOUNT'],
    detailDescription: '', workContentImg: null,
    applicationDeadline: null, applicationMethod: 'PLATFORM',
    contactName: '', contactPhone: '', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
    viewCount: 178, scrapCount: 20, applyCount: 8,
    companyName: '롯데마트 잠실점', companyLogo: null,
    createdAt: '2026-02-15T08:00:00Z', updatedAt: '2026-02-15T08:00:00Z', expiresAt: '2026-03-01T08:00:00Z',
    visaMatch: { status: 'eligible', conditions: [] },
    distanceFromSchool: '40분',
  },
  {
    jobId: 'j5', corporateId: '304', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '사무보조 (데이터 입력, 번역)', status: 'ACTIVE',
    jobCategoryCode: 'OFFICE_ASSIST', jobCategoryName: '사무보조', ksicCode: 'N',
    jobDescription: '사무보조', recruitCount: 1, hourlyWage: 13000, weeklyHours: 20,
    schedule: [{ dayOfWeek: 'MON', startTime: '10:00', endTime: '14:00' }, { dayOfWeek: 'WED', startTime: '10:00', endTime: '14:00' }, { dayOfWeek: 'FRI', startTime: '10:00', endTime: '14:00' }],
    isWeekendOnly: false, workPeriod: { startDate: '2026-03-01', endDate: '2026-08-31' },
    address: { sido: '서울특별시', sigungu: '종로구', detail: '세종로 100', lat: 37.574, lng: 126.977 },
    displayAddress: '서울 종로구', koreanLevel: 'BUSINESS', experienceLevel: 'UNDER_1Y',
    preferredQualifications: '영어/중국어 가능자 우대', benefits: ['TRANSPORT', 'FLEXIBLE_HOURS'],
    detailDescription: '', workContentImg: null,
    applicationDeadline: '2026-03-10', applicationMethod: 'EMAIL',
    contactName: '', contactPhone: '', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,D-2,F-4',
    viewCount: 345, scrapCount: 42, applyCount: 15,
    companyName: '글로벌 코리아', companyLogo: null,
    createdAt: '2026-02-14T12:00:00Z', updatedAt: '2026-02-14T12:00:00Z', expiresAt: '2026-02-28T12:00:00Z',
    visaMatch: { status: 'conditional', conditions: ['TOPIK 3급+ 필요 (주 20시간)'] },
    distanceFromSchool: '35분',
  },
];

// ─── 요일 목록 / All days ───
const ALL_DAYS: ScheduleItem['dayOfWeek'][] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function AlbaSearchVariantBPage() {
  // ─── 상태 / State ───
  const [loading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('LATEST');
  const [page, setPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // ─── 필터 상태 / Filter state ───
  const [filterSido, setFilterSido] = useState('');
  const [filterSigungu, setFilterSigungu] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMinWage, setFilterMinWage] = useState(10030);
  const [filterDays, setFilterDays] = useState<Set<ScheduleItem['dayOfWeek']>>(new Set());
  const [filterMaxHours, setFilterMaxHours] = useState<number>(80);

  // ─── 사이드바 섹션 토글 / Sidebar section toggles ───
  const [showRegion, setShowRegion] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [showWage, setShowWage] = useState(true);
  const [showDays, setShowDays] = useState(true);
  const [showHours, setShowHours] = useState(false);

  // ─── 직종 그룹 / Category groups ───
  const categoryGroups = useMemo(() => {
    const groups: Record<string, typeof JOB_CATEGORIES> = {};
    JOB_CATEGORIES.forEach(cat => {
      if (!groups[cat.group]) groups[cat.group] = [];
      groups[cat.group].push(cat);
    });
    return groups;
  }, []);

  // ─── D-Day / D-Day ───
  const getDDay = (deadline: string | null) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return '마감';
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  // ─── 요일 필터 토글 / Toggle day filter ───
  const toggleDayFilter = useCallback((day: ScheduleItem['dayOfWeek']) => {
    setFilterDays(prev => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day); else next.add(day);
      return next;
    });
  }, []);

  // ─── 필터 초기화 / Reset filters ───
  const resetFilters = useCallback(() => {
    setFilterSido('');
    setFilterSigungu('');
    setFilterCategory('');
    setFilterMinWage(10030);
    setFilterDays(new Set());
    setFilterMaxHours(80);
    setKeyword('');
  }, []);

  // ─── 활성 필터 수 / Active filter count ───
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterSido) count++;
    if (filterCategory) count++;
    if (filterMinWage > 10030) count++;
    if (filterDays.size > 0) count++;
    if (filterMaxHours < 80) count++;
    return count;
  }, [filterSido, filterCategory, filterMinWage, filterDays, filterMaxHours]);

  // ─── 비자 매칭 배지 / Visa match badge ───
  const renderVisaBadge = (visaMatch?: VisaMatch) => {
    if (!visaMatch) return null;
    if (visaMatch.status === 'eligible') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[11px] font-semibold rounded border border-green-200">
          <Shield className="w-3 h-3" />지원 가능
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded border border-amber-200"
        title={visaMatch.conditions?.join(', ') || ''}
      >
        <ShieldAlert className="w-3 h-3" />조건부
      </span>
    );
  };

  // ─── 사이드바 필터 콘텐츠 / Sidebar filter content ───
  const filterContent = (
    <div className="space-y-0">
      {/* 지역 필터 / Region filter */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => setShowRegion(!showRegion)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          aria-label="지역 필터 토글 / Toggle region filter"
        >
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600" />지역</span>
          {showRegion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showRegion && (
          <div className="px-4 pb-3 space-y-2">
            <select
              value={filterSido}
              onChange={e => { setFilterSido(e.target.value); setFilterSigungu(''); }}
              className="w-full border border-gray-200 rounded px-2.5 py-2 text-sm bg-white"
              aria-label="시/도 선택 / Select province"
            >
              <option value="">전체 지역</option>
              {SIDO_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {filterSido && (
              <input
                type="text"
                value={filterSigungu}
                onChange={e => setFilterSigungu(e.target.value)}
                placeholder="시/군/구 입력"
                className="w-full border border-gray-200 rounded px-2.5 py-2 text-sm"
                aria-label="시/군/구 입력 / Enter district"
              />
            )}
          </div>
        )}
      </div>

      {/* 직종 필터 / Category filter */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => setShowCategory(!showCategory)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          aria-label="직종 필터 토글 / Toggle category filter"
        >
          <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-blue-600" />직종</span>
          {showCategory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showCategory && (
          <div className="px-4 pb-3">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full border border-gray-200 rounded px-2.5 py-2 text-sm bg-white"
              aria-label="직종 선택 / Select category"
            >
              <option value="">전체 직종</option>
              {Object.entries(categoryGroups).map(([group, cats]) => (
                <optgroup key={group} label={group}>
                  {cats.map(cat => (
                    <option key={cat.code} value={cat.code}>{cat.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 시급 필터 / Wage filter */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => setShowWage(!showWage)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          aria-label="시급 필터 토글 / Toggle wage filter"
        >
          <span>시급</span>
          {showWage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showWage && (
          <div className="px-4 pb-3 space-y-2">
            <input
              type="range"
              min={10030}
              max={30000}
              step={500}
              value={filterMinWage}
              onChange={e => setFilterMinWage(parseInt(e.target.value))}
              className="w-full accent-blue-600"
              aria-label="최소 시급 / Minimum wage slider"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{filterMinWage.toLocaleString()}원 이상</span>
              <span>30,000원</span>
            </div>
          </div>
        )}
      </div>

      {/* 근무 요일 / Work days */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => setShowDays(!showDays)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          aria-label="요일 필터 토글 / Toggle day filter"
        >
          <span>근무 요일</span>
          {showDays ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showDays && (
          <div className="px-4 pb-3">
            <div className="flex flex-wrap gap-1.5">
              {ALL_DAYS.map(day => {
                const isActive = filterDays.has(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDayFilter(day)}
                    className={`
                      min-w-[40px] h-[36px] px-2 rounded-sm text-xs font-medium border transition-colors
                      ${isActive
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
                    `}
                    aria-label={`${DAY_LABELS[day]}요일 필터 ${isActive ? '해제' : '추가'}`}
                  >
                    {DAY_LABELS[day]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 주당 근무시간 / Weekly hours */}
      <div className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => setShowHours(!showHours)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          aria-label="시간 필터 토글 / Toggle hours filter"
        >
          <span>주당 근무시간</span>
          {showHours ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showHours && (
          <div className="px-4 pb-3 space-y-2">
            <input
              type="range"
              min={1}
              max={80}
              value={filterMaxHours}
              onChange={e => setFilterMaxHours(parseInt(e.target.value))}
              className="w-full accent-blue-600"
              aria-label="최대 주당 시간 / Max weekly hours slider"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>1시간</span>
              <span>최대 {filterMaxHours}시간/주</span>
            </div>
          </div>
        )}
      </div>

      {/* 필터 초기화 / Reset */}
      {activeFilterCount > 0 && (
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={resetFilters}
            className="w-full py-2 text-xs text-gray-500 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            aria-label="필터 초기화 / Reset all filters"
          >
            필터 초기화 ({activeFilterCount}개 적용중)
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* ─── 검색 바 / Search bar ─── */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="공고명, 직종, 지역으로 검색..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded text-sm focus:border-blue-400 outline-none"
              aria-label="알바 공고 검색 / Search alba jobs"
            />
          </div>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-700 text-white rounded text-sm font-semibold hover:bg-blue-800 transition-colors min-h-[44px]"
            aria-label="검색 / Search"
          >
            검색
          </button>
          {/* 모바일 필터 토글 / Mobile filter toggle */}
          <button
            type="button"
            onClick={() => setShowMobileFilter(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]"
            aria-label="필터 열기 / Open filters"
          >
            <Filter className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── 프리미엄 배너 / Premium banner ─── */}
      {MOCK_PREMIUM.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500" />
              주목할만한 채용공고
            </h2>
            <span className="text-xs text-gray-400">{MOCK_PREMIUM.length}건</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {MOCK_PREMIUM.map(job => (
              <Link
                key={job.jobId}
                href={`/worker/alba/${job.jobId}/variants/b`}
                className="flex-shrink-0 w-[280px] border border-amber-200 bg-amber-50/30 rounded-sm p-3 hover:border-amber-300 transition-colors group"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">PREMIUM</span>
                  {renderVisaBadge(job.visaMatch)}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                  {job.title}
                </h3>
                <p className="text-xs text-gray-500 mb-1">{job.companyName}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-700 font-bold">{job.hourlyWage.toLocaleString()}원</span>
                  <span className="text-gray-400">{job.displayAddress}</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
                  <span>{job.schedule.map(s => DAY_LABELS[s.dayOfWeek]).join('/')}</span>
                  <span>|</span>
                  <span>{job.schedule[0]?.startTime}~{job.schedule[0]?.endTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ─── 메인 2-패널 레이아웃 / Main two-panel layout ─── */}
      <div className="flex gap-4">
        {/* 좌측 사이드바 (데스크톱) / Left sidebar (desktop) */}
        <aside className="hidden lg:block w-[260px] shrink-0">
          <div className="border border-gray-200 rounded-sm bg-white sticky top-4">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-blue-600" />
                필터 / Filters
              </h3>
            </div>
            {filterContent}
          </div>
        </aside>

        {/* 모바일 필터 오버레이 / Mobile filter overlay */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-white overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-700">필터</h3>
                <button
                  type="button"
                  onClick={() => setShowMobileFilter(false)}
                  className="p-2 hover:bg-gray-100 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="필터 닫기 / Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => setShowMobileFilter(false)}
                  className="w-full py-2.5 bg-blue-700 text-white text-sm font-semibold rounded hover:bg-blue-800 transition-colors"
                  aria-label="필터 적용 / Apply filters"
                >
                  적용하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 우측 콘텐츠 영역 / Right content area */}
        <div className="flex-1 min-w-0">
          {/* 정렬 + 결과 수 / Sort + result count */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">
              총 <span className="font-semibold text-gray-700">{MOCK_JOBS.length}</span>건
            </span>
            <div className="flex items-center gap-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSortBy(opt.key)}
                  className={`
                    px-2.5 py-1.5 text-xs rounded transition-colors min-h-[32px]
                    ${sortBy === opt.key
                      ? 'bg-blue-700 text-white font-semibold'
                      : 'text-gray-500 hover:bg-gray-100'}
                  `}
                  aria-label={`${opt.label}으로 정렬`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 로딩 / Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}

          {/* 빈 상태 / Empty state */}
          {!loading && MOCK_JOBS.length === 0 && (
            <div className="border border-gray-200 rounded-sm bg-white p-12 text-center">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-600 mb-1">검색 결과가 없습니다</h3>
              <p className="text-xs text-gray-400 mb-3">필터 조건을 변경하거나 검색어를 수정해보세요</p>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:underline"
              >
                필터 초기화
              </button>
            </div>
          )}

          {/* 공고 목록 — 밀도 높은 행 / Job list — dense rows */}
          {!loading && MOCK_JOBS.length > 0 && (
            <div className="border border-gray-200 rounded-sm bg-white divide-y divide-gray-100">
              {MOCK_JOBS.map(job => {
                const dDay = getDDay(job.applicationDeadline);
                return (
                  <Link
                    key={job.jobId}
                    href={`/worker/alba/${job.jobId}/variants/b`}
                    className="block px-4 py-3 hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* 상단 행: 제목 + 배지 / Top row: title + badges */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        {renderVisaBadge(job.visaMatch)}
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {job.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {dDay && (
                          <span className={`text-[11px] font-semibold ${dDay === '마감' ? 'text-red-500' : 'text-blue-600'}`}>
                            {dDay}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                          aria-label={`${job.title} 스크랩`}
                        >
                          <Bookmark className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* 중간 행: 회사명 + 핵심 정보 / Middle row: company + key info */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5 flex-wrap">
                      <span className="font-medium text-gray-600">{job.companyName}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-blue-700 font-bold">{job.hourlyWage.toLocaleString()}원</span>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />{job.displayAddress}
                      </span>
                      {job.distanceFromSchool && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-blue-600">학교에서 {job.distanceFromSchool}</span>
                        </>
                      )}
                    </div>

                    {/* 하단 행: 스케줄 + 복리후생 + 통계 / Bottom row: schedule + benefits + stats */}
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {job.schedule.map(s => DAY_LABELS[s.dayOfWeek]).join('/')}
                          {' '}
                          {job.schedule[0]?.startTime}~{job.schedule[0]?.endTime}
                        </span>
                        <span>({job.weeklyHours}h/주)</span>
                        {job.isWeekendOnly && (
                          <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            주말만
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        {job.benefits.slice(0, 3).map(b => (
                          <span key={b} className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">
                            {BENEFIT_LABELS[b as keyof typeof BENEFIT_LABELS] || b}
                          </span>
                        ))}
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3 h-3" />{job.viewCount}
                        </span>
                      </div>
                    </div>

                    {/* 조건부 경고 / Conditional warning */}
                    {job.visaMatch?.status === 'conditional' && job.visaMatch.conditions.length > 0 && (
                      <div className="mt-1.5 flex items-start gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{job.visaMatch.conditions[0]}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* 페이지네이션 / Pagination */}
          <div className="flex justify-center items-center gap-1.5 mt-4">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="이전 페이지 / Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded text-sm font-medium ${n === page ? 'bg-blue-700 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                aria-label={`${n}페이지`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded border border-gray-200 hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="다음 페이지 / Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
