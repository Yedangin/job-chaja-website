'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, DollarSign, Clock, Sparkles, Filter, ShieldCheck, ShieldAlert,
  Search, ChevronDown, X, SlidersHorizontal, ArrowUpDown,
} from 'lucide-react';
import type { AlbaJobResponse, AlbaJobSearchItem } from '../../../../company/alba/create/variants/a/types';

/** 비자 유형 옵션 / Visa type options */
const VISA_OPTIONS = [
  { code: 'D-2', name: '유학 (Study Abroad)' },
  { code: 'D-4', name: '어학연수 (Language Training)' },
  { code: 'D-10', name: '구직 (Job Seeking)' },
  { code: 'F-2', name: '거주 (Residence)' },
  { code: 'F-4', name: '재외동포 (Overseas Korean)' },
  { code: 'F-5', name: '영주 (Permanent Residence)' },
  { code: 'F-6', name: '결혼이민 (Marriage Immigration)' },
  { code: 'H-1', name: '워킹홀리데이 (Working Holiday)' },
  { code: 'H-2', name: '방문취업 (Visit & Employment)' },
];

/** 정렬 옵션 / Sort options */
const SORT_OPTIONS = [
  { value: 'LATEST', label: '최신순' },
  { value: 'WAGE_HIGH', label: '시급 높은순' },
  { value: 'DISTANCE', label: '거리순' },
  { value: 'DEADLINE', label: '마감 임박순' },
];

/** 더미 프리미엄 공고 / Dummy premium jobs */
const PREMIUM_JOBS: AlbaJobResponse[] = [
  {
    jobId: 'p1', corporateId: '200', boardType: 'PART_TIME', tierType: 'PREMIUM',
    title: '명동 면세점 판매 알바', status: 'ACTIVE',
    jobCategoryCode: 'RETAIL_SALES', jobCategoryName: '판매', ksicCode: 'G',
    jobDescription: '면세점 판매', recruitCount: 3, hourlyWage: 13000, weeklyHours: 20,
    schedule: [{ dayOfWeek: 'SAT', startTime: '10:00', endTime: '20:00' }, { dayOfWeek: 'SUN', startTime: '10:00', endTime: '20:00' }],
    isWeekendOnly: true,
    workPeriod: { startDate: '2026-03-01', endDate: null },
    address: { sido: '서울특별시', sigungu: '중구', detail: '명동 2가', lat: 37.56, lng: 126.98 },
    displayAddress: '서울 중구 명동', koreanLevel: 'DAILY', experienceLevel: 'NONE',
    preferredQualifications: '영어/중국어 가능자 우대', benefits: ['MEAL', 'STAFF_DISCOUNT'],
    detailDescription: '면세점 판매 업무', workContentImg: null,
    applicationDeadline: null, applicationMethod: 'PLATFORM',
    contactName: '매니저', contactPhone: '010-0000-0000', contactEmail: null,
    isPremium: true, premiumStartAt: '2026-02-18T00:00:00Z', premiumEndAt: '2026-03-04T00:00:00Z',
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-1,H-2,F-4',
    viewCount: 450, scrapCount: 89, applyCount: 23,
    companyName: '신라면세점', companyLogo: null, createdAt: '2026-02-15T00:00:00Z', updatedAt: '2026-02-18T00:00:00Z', expiresAt: '2026-03-01T00:00:00Z',
  },
  {
    jobId: 'p2', corporateId: '201', boardType: 'PART_TIME', tierType: 'PREMIUM',
    title: '홍대 레스토랑 서빙 급구', status: 'ACTIVE',
    jobCategoryCode: 'REST_SERVING', jobCategoryName: '음식점 서빙', ksicCode: 'I',
    jobDescription: '서빙', recruitCount: 2, hourlyWage: 12000, weeklyHours: 15,
    schedule: [{ dayOfWeek: 'FRI', startTime: '17:00', endTime: '22:00' }, { dayOfWeek: 'SAT', startTime: '17:00', endTime: '22:00' }, { dayOfWeek: 'SUN', startTime: '17:00', endTime: '22:00' }],
    isWeekendOnly: false,
    workPeriod: { startDate: '2026-03-01', endDate: null },
    address: { sido: '서울특별시', sigungu: '마포구', detail: '서교동', lat: 37.55, lng: 126.92 },
    displayAddress: '서울 마포구 서교동', koreanLevel: 'BASIC', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL', 'TRANSPORT'],
    detailDescription: '레스토랑 서빙', workContentImg: null,
    applicationDeadline: '2026-03-10', applicationMethod: 'PLATFORM',
    contactName: '김셰프', contactPhone: '010-1111-2222', contactEmail: null,
    isPremium: true, premiumStartAt: '2026-02-17T00:00:00Z', premiumEndAt: '2026-03-03T00:00:00Z',
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2',
    viewCount: 312, scrapCount: 67, applyCount: 18,
    companyName: '트라토리아 홍대', companyLogo: null, createdAt: '2026-02-14T00:00:00Z', updatedAt: '2026-02-17T00:00:00Z', expiresAt: '2026-02-28T00:00:00Z',
  },
];

/** 더미 검색 결과 / Dummy search results */
const DUMMY_SEARCH_RESULTS: AlbaJobSearchItem[] = [
  {
    ...PREMIUM_JOBS[0], isPremium: false, tierType: 'STANDARD',
    jobId: 's1', title: '이태원 카페 바리스타 모집', companyName: '블루보틀 이태원',
    hourlyWage: 11500, viewCount: 156, applyCount: 8,
    address: { sido: '서울특별시', sigungu: '용산구', detail: '이태원동', lat: 37.53, lng: 126.99 },
    displayAddress: '서울 용산구', allowedVisas: 'F-5,F-6,F-2,H-1,D-2',
    visaMatch: { status: 'eligible', conditions: [] }, distanceFromSchool: null,
  },
  {
    ...PREMIUM_JOBS[0], isPremium: false, tierType: 'STANDARD',
    jobId: 's2', title: '강남 편의점 주말 알바', companyName: 'GS25 강남역점',
    hourlyWage: 10500, weeklyHours: 16, viewCount: 98, applyCount: 4,
    jobCategoryCode: 'CONV_STORE', jobCategoryName: '편의점',
    address: { sido: '서울특별시', sigungu: '강남구', detail: '역삼동', lat: 37.49, lng: 127.03 },
    displayAddress: '서울 강남구', allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
    visaMatch: { status: 'eligible', conditions: [] }, distanceFromSchool: '15분',
  },
  {
    ...PREMIUM_JOBS[0], isPremium: false, tierType: 'STANDARD',
    jobId: 's3', title: '건대 치킨집 주방보조 (조건부)', companyName: 'BBQ 건대점',
    hourlyWage: 11000, weeklyHours: 20, viewCount: 67, applyCount: 3,
    jobCategoryCode: 'REST_KITCHEN', jobCategoryName: '주방 보조',
    address: { sido: '서울특별시', sigungu: '광진구', detail: '화양동', lat: 37.54, lng: 127.07 },
    displayAddress: '서울 광진구', allowedVisas: 'F-5,F-6,D-2,H-2',
    visaMatch: { status: 'conditional', conditions: ['체류자격외활동허가 필요', 'TOPIK 3급+ 필요'] }, distanceFromSchool: '20분',
  },
  {
    ...PREMIUM_JOBS[0], isPremium: false, tierType: 'STANDARD',
    jobId: 's4', title: '신촌 물류 분류 작업 (단기)', companyName: '쿠팡 로지스틱스',
    hourlyWage: 14000, weeklyHours: 25, viewCount: 234, applyCount: 15,
    jobCategoryCode: 'WAREHOUSE', jobCategoryName: '물류/창고',
    address: { sido: '서울특별시', sigungu: '서대문구', detail: '신촌동', lat: 37.55, lng: 126.93 },
    displayAddress: '서울 서대문구', allowedVisas: 'F-5,F-6,F-2,H-2',
    visaMatch: { status: 'eligible', conditions: [] }, distanceFromSchool: '10분',
  },
];

/**
 * 비자 적합도 점수 바 / Visa compatibility score bar
 * eligible = 100점/green, conditional = 70점/amber
 */
function VisaScoreBar({ status, conditions }: { status: 'eligible' | 'conditional'; conditions: string[] }) {
  const score = status === 'eligible' ? 100 : 70;
  const barColor = status === 'eligible' ? 'bg-green-500' : 'bg-amber-400';
  const textColor = status === 'eligible' ? 'text-green-600' : 'text-amber-600';
  const Icon = status === 'eligible' ? ShieldCheck : ShieldAlert;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${textColor}`} />
        <span className={`text-xs font-semibold ${textColor}`}>
          {status === 'eligible' ? '적합' : '조건부'} {score}점
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className={`${barColor} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      {conditions.length > 0 && (
        <p className="text-[10px] text-amber-500 truncate">{conditions[0]}</p>
      )}
    </div>
  );
}

/**
 * 구직자용 알바 검색 페이지 (시안 E)
 * Alba Job Search Page for Workers (Variant E)
 *
 * 상단 프리미엄 캐러셀 + 비자 필터 + 적합도 스코어 카드 + 사이드/바텀시트 필터
 * Top premium carousel + visa filter + compatibility score cards + side/bottom-sheet filter
 */
export default function AlbaSearchPageVariantE() {
  const [selectedVisa, setSelectedVisa] = useState('D-2');
  const [sortBy, setSortBy] = useState('LATEST');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [keyword, setKeyword] = useState('');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 프리미엄 공고 캐러셀 / Premium job carousel */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-gray-900">프리미엄 공고</h2>
          <span className="text-xs text-gray-400">Premium Jobs</span>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 snap-x snap-mandatory">
          {PREMIUM_JOBS.map((job) => (
            <Link
              key={job.jobId}
              href={`/worker/alba/${job.jobId}/variants/e`}
              className="flex-shrink-0 w-[280px] snap-start"
            >
              <div className="bg-white rounded-xl border-2 border-yellow-200 p-4 hover:shadow-lg hover:border-yellow-300 transition h-full">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs bg-yellow-100 text-yellow-800 font-semibold px-2 py-0.5 rounded-full">
                    {job.companyName}
                  </span>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                    {job.companyName.charAt(0)}
                  </div>
                </div>
                <p className="font-semibold text-gray-900 truncate">{job.title}</p>
                <p className="text-base font-bold text-blue-600 mt-1">
                  시급 {job.hourlyWage.toLocaleString()}원
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.displayAddress}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 주 {job.weeklyHours}h
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="md:grid md:grid-cols-4 md:gap-6">
        {/* 데스크톱 사이드 필터 / Desktop side filter */}
        <aside className="hidden md:block col-span-1">
          <div className="sticky top-20 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">필터 / Filters</h3>
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              {/* 비자 선택 / Visa selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">내 비자 / My Visa</label>
                <select
                  value={selectedVisa}
                  onChange={(e) => setSelectedVisa(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  aria-label="비자 유형 선택 / Select visa type"
                >
                  {VISA_OPTIONS.map((v) => (
                    <option key={v.code} value={v.code}>{v.code} - {v.name}</option>
                  ))}
                </select>
              </div>

              {/* 지역 / Region */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">지역 / Region</label>
                <input
                  type="text"
                  placeholder="시/구 검색"
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  aria-label="지역 검색 / Search region"
                />
              </div>

              {/* 직종 / Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">직종 / Category</label>
                <input
                  type="text"
                  placeholder="직종 검색"
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  aria-label="직종 검색 / Search category"
                />
              </div>

              {/* 최소 시급 / Min wage */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">최소 시급 / Min Wage</label>
                <input
                  type="number"
                  placeholder="10,030"
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  aria-label="최소 시급 / Minimum hourly wage"
                />
              </div>

              <button
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition min-h-11"
                aria-label="필터 적용 / Apply filters"
              >
                필터 적용
              </button>
            </div>

            {/* 적용된 필터 표시 / Applied filters display */}
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-700 mb-1">적용된 비자 필터</p>
              <p className="text-xs text-blue-600">{selectedVisa} 기준 자동 필터링 중</p>
              <p className="text-[10px] text-blue-400 mt-1">업종/시간 제한이 자동 적용됩니다</p>
            </div>
          </div>
        </aside>

        {/* 메인 검색 결과 / Main search results */}
        <main className="col-span-4 md:col-span-3">
          {/* 검색 바 + 정렬 / Search bar + sort */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색어를 입력하세요 (직종, 지역, 키워드)"
                className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                aria-label="공고 검색 / Search jobs"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:border-blue-500 hidden sm:block"
              aria-label="정렬 / Sort"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* 모바일 필터 버튼 / Mobile filter button */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className="md:hidden h-11 px-3 border border-gray-300 rounded-lg flex items-center gap-1 text-sm text-gray-600"
              aria-label="필터 열기 / Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              필터
            </button>
          </div>

          {/* 비자 적용 알림 / Visa filter applied notice */}
          <div className="flex items-center gap-2 mb-4 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-blue-600 font-medium">{selectedVisa}</span>
            <span className="text-gray-400">비자 기준 필터링 적용 중 | blocked 공고는 자동 제외됩니다</span>
          </div>

          {/* 검색 결과 카드 그리드 / Search result card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DUMMY_SEARCH_RESULTS.map((job) => (
              <Link
                key={job.jobId}
                href={`/worker/alba/${job.jobId}/variants/e`}
                className="block"
              >
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition h-full flex flex-col">
                  {/* 기업명 / Company name */}
                  <p className="text-xs text-gray-500 mb-1">{job.companyName}</p>

                  {/* 제목 / Title */}
                  <p className="font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow">{job.title}</p>

                  {/* 시급 / Wage */}
                  <div className="flex items-center gap-1.5 text-sm mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-bold text-blue-600">시급 {job.hourlyWage.toLocaleString()}원</span>
                  </div>

                  {/* 위치 + 시간 / Location + hours */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.displayAddress}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 주 {job.weeklyHours}h
                    </span>
                  </div>

                  {/* 비자 적합도 스코어 / Visa compatibility score */}
                  <div className="pt-2 border-t border-gray-100">
                    <VisaScoreBar status={job.visaMatch.status} conditions={job.visaMatch.conditions} />
                  </div>

                  {/* 학교 거리 (D-2/D-4) / Distance from school */}
                  {job.distanceFromSchool && (
                    <p className="text-[10px] text-gray-400 mt-1">학교에서 약 {job.distanceFromSchool}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* 더 보기 / Load more */}
          <div className="text-center mt-8">
            <button
              className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition min-h-11"
              aria-label="더 보기 / Load more"
            >
              더 보기
            </button>
          </div>
        </main>
      </div>

      {/* 모바일 필터 바텀시트 / Mobile filter bottom sheet */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* 오버레이 / Overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowMobileFilter(false)}
          />
          {/* 바텀시트 / Bottom sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto safe-area-bottom">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">필터</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="필터 닫기 / Close filter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">내 비자</label>
              <select
                value={selectedVisa}
                onChange={(e) => setSelectedVisa(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-sm"
                aria-label="비자 유형 선택 / Select visa type"
              >
                {VISA_OPTIONS.map((v) => (
                  <option key={v.code} value={v.code}>{v.code} - {v.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">정렬</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-sm"
                aria-label="정렬 / Sort"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">지역</label>
              <input
                type="text"
                placeholder="시/구 검색"
                className="w-full h-11 px-3 rounded-lg border border-gray-300 text-sm"
                aria-label="지역 검색 / Search region"
              />
            </div>

            <button
              onClick={() => setShowMobileFilter(false)}
              className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition min-h-11"
              aria-label="필터 적용 / Apply filters"
            >
              필터 적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
