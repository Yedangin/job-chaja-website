/**
 * 알바 채용관 목업 데이터 (개발용 폴백)
 * Alba recruitment mock data (development fallback)
 */
import type {
  AlbaVisaMatchingResponse,
  AlbaJobResponse,
  AlbaJobSearchItem,
  JobCategory,
  VisaEvalResult,
} from './types';

/** 직종 카테고리 목록 / Job category list */
export const MOCK_JOB_CATEGORIES: JobCategory[] = [
  { code: 'REST_SERVING', name: '음식점 서빙', nameEn: 'Restaurant Serving', parentCode: 'FOOD' },
  { code: 'REST_KITCHEN', name: '주방 보조', nameEn: 'Kitchen Assistant', parentCode: 'FOOD' },
  { code: 'CAFE_BARISTA', name: '카페 바리스타', nameEn: 'Cafe Barista', parentCode: 'FOOD' },
  { code: 'CONV_STORE', name: '편의점', nameEn: 'Convenience Store', parentCode: 'RETAIL' },
  { code: 'MART_SALES', name: '마트/슈퍼', nameEn: 'Mart/Supermarket', parentCode: 'RETAIL' },
  { code: 'DELIVERY', name: '배달', nameEn: 'Delivery', parentCode: 'LOGISTICS' },
  { code: 'LOGISTICS_SORT', name: '물류/택배 분류', nameEn: 'Logistics Sorting', parentCode: 'LOGISTICS' },
  { code: 'FACTORY_SIMPLE', name: '공장/제조 단순작업', nameEn: 'Factory Simple Work', parentCode: 'MANUFACTURE' },
  { code: 'CONSTRUCTION', name: '건설 현장 보조', nameEn: 'Construction Helper', parentCode: 'CONSTRUCTION' },
  { code: 'OFFICE_ASSIST', name: '사무보조', nameEn: 'Office Assistant', parentCode: 'OFFICE' },
  { code: 'TRANSLATE', name: '번역/통역', nameEn: 'Translation', parentCode: 'OFFICE' },
  { code: 'TUTOR', name: '과외/학원강사', nameEn: 'Tutoring', parentCode: 'EDUCATION' },
  { code: 'IT_ASSIST', name: 'IT/개발 보조', nameEn: 'IT Assistant', parentCode: 'IT' },
  { code: 'CLEANING', name: '청소/관리', nameEn: 'Cleaning', parentCode: 'SERVICE' },
  { code: 'HOTEL_SERVICE', name: '호텔 서비스', nameEn: 'Hotel Service', parentCode: 'SERVICE' },
  { code: 'GAS_STATION', name: '주유원', nameEn: 'Gas Station', parentCode: 'SERVICE' },
  { code: 'PARKING', name: '주차장 관리', nameEn: 'Parking Management', parentCode: 'SERVICE' },
  { code: 'FARM_FISH', name: '농업/어업 보조', nameEn: 'Agriculture/Fishery', parentCode: 'PRIMARY' },
  { code: 'FAST_FOOD', name: '패스트푸드', nameEn: 'Fast Food', parentCode: 'FOOD' },
];

/** 복리후생 라벨 매핑 / Benefits label mapping */
export const BENEFIT_LABELS: Record<string, { ko: string; en: string }> = {
  MEAL: { ko: '식사제공', en: 'Meals' },
  TRANSPORT: { ko: '교통비', en: 'Transport' },
  INSURANCE: { ko: '4대보험', en: 'Insurance' },
  HOUSING: { ko: '숙소제공', en: 'Housing' },
  UNIFORM: { ko: '유니폼', en: 'Uniform' },
  STAFF_DISCOUNT: { ko: '직원할인', en: 'Staff Discount' },
  BONUS: { ko: '성과급', en: 'Bonus' },
  FLEXIBLE_HOURS: { ko: '유연근무', en: 'Flexible' },
};

/** 한국어 수준 라벨 / Korean level labels */
export const KOREAN_LEVEL_LABELS: Record<string, { ko: string; en: string }> = {
  NONE: { ko: '무관', en: 'No preference' },
  BASIC: { ko: '기초', en: 'Basic' },
  DAILY: { ko: '일상회화', en: 'Daily conversation' },
  BUSINESS: { ko: '비즈니스', en: 'Business level' },
};

/** 경력 수준 라벨 / Experience level labels */
export const EXPERIENCE_LEVEL_LABELS: Record<string, { ko: string; en: string }> = {
  NONE: { ko: '무관', en: 'No preference' },
  UNDER_1Y: { ko: '1년 미만', en: 'Under 1 year' },
  ONE_TO_THREE_Y: { ko: '1~3년', en: '1-3 years' },
  OVER_3Y: { ko: '3년 이상', en: 'Over 3 years' },
};

/** 요일 라벨 / Day of week labels */
export const DAY_LABELS: Record<string, { ko: string; koShort: string; en: string }> = {
  MON: { ko: '월요일', koShort: '월', en: 'Mon' },
  TUE: { ko: '화요일', koShort: '화', en: 'Tue' },
  WED: { ko: '수요일', koShort: '수', en: 'Wed' },
  THU: { ko: '목요일', koShort: '목', en: 'Thu' },
  FRI: { ko: '금요일', koShort: '금', en: 'Fri' },
  SAT: { ko: '토요일', koShort: '토', en: 'Sat' },
  SUN: { ko: '일요일', koShort: '일', en: 'Sun' },
};

/** 접수 방법 라벨 / Application method labels */
export const APPLICATION_METHOD_LABELS: Record<string, { ko: string; en: string }> = {
  PLATFORM: { ko: '플랫폼 지원', en: 'Platform' },
  PHONE: { ko: '전화', en: 'Phone' },
  EMAIL: { ko: '이메일', en: 'Email' },
};

/** 공고 상태 라벨 / Post status labels */
export const POST_STATUS_LABELS: Record<string, { ko: string; en: string; color: string }> = {
  DRAFT: { ko: '임시저장', en: 'Draft', color: 'gray' },
  ACTIVE: { ko: '채용중', en: 'Active', color: 'green' },
  CLOSED: { ko: '마감', en: 'Closed', color: 'red' },
  EXPIRED: { ko: '만료', en: 'Expired', color: 'gray' },
  SUSPENDED: { ko: '정지', en: 'Suspended', color: 'red' },
  PAUSED: { ko: '일시정지', en: 'Paused', color: 'amber' },
};

/** 2025 최저시급 / 2025 minimum hourly wage */
export const MIN_HOURLY_WAGE = 10030;

/** 비자 매칭 목업 결과 / Mock visa matching result */
export const MOCK_VISA_MATCHING: AlbaVisaMatchingResponse = {
  eligible: [
    { visaCode: 'F-5', visaName: '영주', visaNameEn: 'Permanent Residence', status: 'eligible', notes: '내국인과 동일한 취업 권리', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null },
    { visaCode: 'F-6', visaName: '결혼이민', visaNameEn: 'Marriage Immigration', status: 'eligible', notes: '내국인과 동일한 취업 권리', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null },
    { visaCode: 'F-2', visaName: '거주', visaNameEn: 'Residence', status: 'eligible', notes: '취업 제한 없음', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null },
    { visaCode: 'H-1', visaName: '워킹홀리데이', visaNameEn: 'Working Holiday', status: 'eligible', notes: '체류기간 최대 1년, 18~30세 대상', requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null },
  ],
  conditional: [
    { visaCode: 'D-2', visaName: '유학', visaNameEn: 'Study Abroad', status: 'conditional', conditions: ['주말 근무만 가능 (평일 포함 시 TOPIK 3급+ 필요)', '체류자격외활동허가 필요'], maxWeeklyHours: 30, maxWorkplaces: 2, requiredPermit: '체류자격외활동허가', notes: null },
    { visaCode: 'H-2', visaName: '방문취업', visaNameEn: 'Visit & Employment', status: 'conditional', conditions: ['특례고용허가 필요 (일부 업종)'], requiredPermit: '특례고용허가', maxWeeklyHours: null, maxWorkplaces: null, notes: null },
    { visaCode: 'F-4', visaName: '재외동포', visaNameEn: 'Overseas Korean', status: 'conditional', conditions: ['단순노무 해당 시 예외 직종 확인 필요'], requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: null },
  ],
  blocked: [
    { visaCode: 'C-3', visaName: '단기방문', visaNameEn: 'Short-term Visit', status: 'blocked', blockReasons: ['취업 활동 불가 비자'], requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: null },
    { visaCode: 'B-1', visaName: '사증면제', visaNameEn: 'Visa Exemption', status: 'blocked', blockReasons: ['취업 활동 불가 비자'], requiredPermit: null, maxWeeklyHours: null, maxWorkplaces: null, notes: null },
  ],
  summary: { totalEligible: 4, totalConditional: 3, totalBlocked: 2 },
  matchedAt: '2026-02-18T12:00:00Z',
  inputSummary: { jobCategoryCode: 'REST_SERVING', ksicCode: 'I', weeklyHours: 20, isWeekendOnly: true, hasWeekdayShift: false, isDepopulationArea: false },
};

/** 알바 공고 목업 데이터 / Mock alba job postings */
export const MOCK_ALBA_JOBS: AlbaJobResponse[] = [
  {
    jobId: '1001',
    corporateId: '5001',
    boardType: 'PART_TIME',
    tierType: 'PREMIUM',
    title: '강남역 근처 카페 주말 바리스타 모집',
    status: 'ACTIVE',
    jobCategoryCode: 'CAFE_BARISTA',
    jobCategoryName: '카페 바리스타',
    ksicCode: 'I',
    jobDescription: '주말 런치 타임 바리스타 및 매장 정리',
    recruitCount: 2,
    hourlyWage: 12000,
    weeklyHours: 20,
    schedule: [
      { dayOfWeek: 'SAT', startTime: '12:00', endTime: '22:00' },
      { dayOfWeek: 'SUN', startTime: '12:00', endTime: '22:00' },
    ],
    isWeekendOnly: true,
    workPeriod: { startDate: '2026-03-01', endDate: '2026-06-30' },
    address: { sido: '서울특별시', sigungu: '강남구', detail: '역삼동 123-45 2층', lat: 37.4979, lng: 127.0276 },
    displayAddress: '서울 강남구 역삼동',
    koreanLevel: 'BASIC',
    experienceLevel: 'NONE',
    preferredQualifications: '바리스타 자격증 우대',
    benefits: ['MEAL', 'TRANSPORT'],
    detailDescription: '주말 런치 타임(11시~15시) 바리스타 업무를 담당합니다. 커피 제조, 음료 서빙, 매장 정리 등의 업무를 수행합니다. 밝고 친절한 분 환영합니다!',
    workContentImg: null,
    applicationDeadline: '2026-03-15',
    applicationMethod: 'PLATFORM',
    contactName: '김매니저',
    contactPhone: '010-1234-5678',
    contactEmail: 'hire@cafe.com',
    isPremium: true,
    premiumStartAt: '2026-02-15T00:00:00Z',
    premiumEndAt: '2026-03-01T00:00:00Z',
    matchedVisas: [...MOCK_VISA_MATCHING.eligible, ...MOCK_VISA_MATCHING.conditional],
    allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
    viewCount: 342,
    scrapCount: 45,
    applyCount: 12,
    companyName: '카페 라떼',
    companyLogo: null,
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-02-15T09:00:00Z',
    expiresAt: '2026-03-01T09:00:00Z',
  },
  {
    jobId: '1002',
    corporateId: '5002',
    boardType: 'PART_TIME',
    tierType: 'STANDARD',
    title: '홍대 편의점 평일 오후 알바',
    status: 'ACTIVE',
    jobCategoryCode: 'CONV_STORE',
    jobCategoryName: '편의점',
    ksicCode: 'G',
    jobDescription: '편의점 카운터 및 진열 업무',
    recruitCount: 1,
    hourlyWage: 10500,
    weeklyHours: 25,
    schedule: [
      { dayOfWeek: 'MON', startTime: '14:00', endTime: '19:00' },
      { dayOfWeek: 'WED', startTime: '14:00', endTime: '19:00' },
      { dayOfWeek: 'FRI', startTime: '14:00', endTime: '19:00' },
      { dayOfWeek: 'SAT', startTime: '10:00', endTime: '20:00' },
    ],
    isWeekendOnly: false,
    workPeriod: { startDate: '2026-03-01', endDate: null },
    address: { sido: '서울특별시', sigungu: '마포구', detail: '서교동 456-78', lat: 37.5563, lng: 126.9236 },
    displayAddress: '서울 마포구 서교동',
    koreanLevel: 'DAILY',
    experienceLevel: 'NONE',
    preferredQualifications: null,
    benefits: ['MEAL', 'INSURANCE'],
    detailDescription: '평일 오후 편의점 근무입니다. 카운터, 상품 진열, 청소 등 전반적인 매장 관리 업무를 수행합니다.',
    workContentImg: null,
    applicationDeadline: null,
    applicationMethod: 'PLATFORM',
    contactName: '이사장',
    contactPhone: '010-9876-5432',
    contactEmail: null,
    isPremium: false,
    premiumStartAt: null,
    premiumEndAt: null,
    matchedVisas: [...MOCK_VISA_MATCHING.eligible, ...MOCK_VISA_MATCHING.conditional],
    allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
    viewCount: 128,
    scrapCount: 23,
    applyCount: 5,
    companyName: 'CU 홍대점',
    companyLogo: null,
    createdAt: '2026-02-16T10:00:00Z',
    updatedAt: '2026-02-16T10:00:00Z',
    expiresAt: '2026-03-02T10:00:00Z',
  },
  {
    jobId: '1003',
    corporateId: '5003',
    boardType: 'PART_TIME',
    tierType: 'STANDARD',
    title: '이태원 레스토랑 주말 홀서빙',
    status: 'ACTIVE',
    jobCategoryCode: 'REST_SERVING',
    jobCategoryName: '음식점 서빙',
    ksicCode: 'I',
    jobDescription: '이태원 이탈리안 레스토랑에서 주말 홀서빙',
    recruitCount: 3,
    hourlyWage: 13000,
    weeklyHours: 16,
    schedule: [
      { dayOfWeek: 'SAT', startTime: '11:00', endTime: '19:00' },
      { dayOfWeek: 'SUN', startTime: '11:00', endTime: '19:00' },
    ],
    isWeekendOnly: true,
    workPeriod: { startDate: '2026-03-01', endDate: '2026-08-31' },
    address: { sido: '서울특별시', sigungu: '용산구', detail: '이태원동 234-56', lat: 37.5345, lng: 126.9945 },
    displayAddress: '서울 용산구 이태원동',
    koreanLevel: 'NONE',
    experienceLevel: 'NONE',
    preferredQualifications: '영어 가능자 우대',
    benefits: ['MEAL', 'TRANSPORT', 'STAFF_DISCOUNT'],
    detailDescription: '이태원에 위치한 이탈리안 레스토랑입니다. 주말 런치/디너 타임 홀서빙을 담당합니다. 영어 가능자 우대합니다.',
    workContentImg: null,
    applicationDeadline: '2026-02-28',
    applicationMethod: 'PLATFORM',
    contactName: '박주방장',
    contactPhone: '010-5555-6666',
    contactEmail: 'info@restaurant.com',
    isPremium: false,
    premiumStartAt: null,
    premiumEndAt: null,
    matchedVisas: [...MOCK_VISA_MATCHING.eligible, ...MOCK_VISA_MATCHING.conditional],
    allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
    viewCount: 89,
    scrapCount: 15,
    applyCount: 8,
    companyName: '트라토리아 벨라',
    companyLogo: null,
    createdAt: '2026-02-17T14:00:00Z',
    updatedAt: '2026-02-17T14:00:00Z',
    expiresAt: '2026-03-03T14:00:00Z',
  },
];

/** 검색 결과 목업 (구직자용) / Mock search results (for workers) */
export const MOCK_SEARCH_ITEMS: AlbaJobSearchItem[] = MOCK_ALBA_JOBS.map((job) => ({
  ...job,
  visaMatch: {
    status: job.isWeekendOnly ? 'eligible' as const : 'conditional' as const,
    conditions: job.isWeekendOnly ? [] : ['주말 근무만 가능 (평일 포함 시 TOPIK 3급+ 필요)'],
  },
  distanceFromSchool: '30분',
}));
