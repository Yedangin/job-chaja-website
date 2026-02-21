/**
 * 알바 채용관 Variant D 타입 정의
 * Alba recruitment system type definitions for Variant D
 *
 * API 명세(docs/alba-api-spec.yaml) 기반 프론트엔드 타입
 * Frontend types based on API spec (docs/alba-api-spec.yaml)
 */

// ─── 공통 타입 / Common Types ───

/** 요일별 근무 시간대 / Per-day work schedule item */
export interface ScheduleItem {
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm 형식 / HH:mm format
  endTime: string;   // HH:mm 형식 / HH:mm format
}

/** 요일 열거형 / Day of week enum */
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

/** 요일 라벨 매핑 / Day of week label mapping */
export const DAY_LABELS: Record<DayOfWeek, { ko: string; en: string; short: string }> = {
  MON: { ko: '월요일', en: 'Monday', short: '월' },
  TUE: { ko: '화요일', en: 'Tuesday', short: '화' },
  WED: { ko: '수요일', en: 'Wednesday', short: '수' },
  THU: { ko: '목요일', en: 'Thursday', short: '목' },
  FRI: { ko: '금요일', en: 'Friday', short: '금' },
  SAT: { ko: '토요일', en: 'Saturday', short: '토' },
  SUN: { ko: '일요일', en: 'Sunday', short: '일' },
};

/** 모든 요일 배열 / All days array */
export const ALL_DAYS: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/** 근무지 주소 정보 / Workplace address information */
export interface Address {
  sido: string;
  sigungu: string;
  detail: string;
  lat: number;
  lng: number;
}

/** 근무 기간 / Work period */
export interface WorkPeriod {
  startDate: string;
  endDate: string | null;
}

// ─── 비자 매칭 타입 / Visa Matching Types ───

/** 비자 매칭 상태 / Visa matching status */
export type VisaMatchStatus = 'eligible' | 'conditional' | 'blocked';

/** 비자별 매칭 평가 결과 / Per-visa matching evaluation result */
export interface VisaEvalResult {
  visaCode: string;
  visaName: string;
  visaNameEn: string;
  status: VisaMatchStatus;
  conditions?: string[];
  blockReasons?: string[];
  requiredPermit: string | null;
  maxWeeklyHours: number | null;
  maxWorkplaces: number | null;
  notes: string | null;
}

/** 비자 매칭 응답 / Visa matching response */
export interface VisaMatchingResponse {
  eligible: VisaEvalResult[];
  conditional: VisaEvalResult[];
  blocked: VisaEvalResult[];
  summary: {
    totalEligible: number;
    totalConditional: number;
    totalBlocked: number;
  };
  matchedAt: string;
  inputSummary: {
    jobCategoryCode: string;
    ksicCode: string;
    weeklyHours: number;
    isWeekendOnly: boolean;
    hasWeekdayShift: boolean;
    isDepopulationArea: boolean;
  };
}

// ─── 한국어 수준 / Korean Language Level ───

export type KoreanLevel = 'NONE' | 'BASIC' | 'DAILY' | 'BUSINESS';

export const KOREAN_LEVEL_LABELS: Record<KoreanLevel, { ko: string; en: string }> = {
  NONE: { ko: '무관', en: 'No requirement' },
  BASIC: { ko: '기초', en: 'Basic' },
  DAILY: { ko: '일상회화', en: 'Daily conversation' },
  BUSINESS: { ko: '비즈니스', en: 'Business level' },
};

// ─── 경력 수준 / Experience Level ───

export type ExperienceLevel = 'NONE' | 'UNDER_1Y' | 'ONE_TO_THREE_Y' | 'OVER_3Y';

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, { ko: string; en: string }> = {
  NONE: { ko: '무관', en: 'No requirement' },
  UNDER_1Y: { ko: '1년 미만', en: 'Under 1 year' },
  ONE_TO_THREE_Y: { ko: '1~3년', en: '1-3 years' },
  OVER_3Y: { ko: '3년 이상', en: 'Over 3 years' },
};

// ─── 복리후생 / Benefits ───

export type BenefitType =
  | 'MEAL' | 'TRANSPORT' | 'INSURANCE' | 'HOUSING'
  | 'UNIFORM' | 'STAFF_DISCOUNT' | 'BONUS' | 'FLEXIBLE_HOURS';

export const BENEFIT_LABELS: Record<BenefitType, { ko: string; en: string }> = {
  MEAL: { ko: '식사제공', en: 'Meals provided' },
  TRANSPORT: { ko: '교통비', en: 'Transport allowance' },
  INSURANCE: { ko: '4대보험', en: 'Insurance' },
  HOUSING: { ko: '숙소제공', en: 'Housing provided' },
  UNIFORM: { ko: '유니폼', en: 'Uniform' },
  STAFF_DISCOUNT: { ko: '직원할인', en: 'Staff discount' },
  BONUS: { ko: '성과급', en: 'Performance bonus' },
  FLEXIBLE_HOURS: { ko: '유연근무', en: 'Flexible hours' },
};

// ─── 접수 방법 / Application Method ───

export type ApplicationMethod = 'PLATFORM' | 'PHONE' | 'EMAIL';

export const APPLICATION_METHOD_LABELS: Record<ApplicationMethod, { ko: string; en: string }> = {
  PLATFORM: { ko: '플랫폼 지원', en: 'Apply via platform' },
  PHONE: { ko: '전화', en: 'Phone call' },
  EMAIL: { ko: '이메일', en: 'Email' },
};

// ─── 공고 상태 / Job Posting Status ───

export type PostStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'SUSPENDED' | 'PAUSED';

export const POST_STATUS_LABELS: Record<PostStatus, { ko: string; en: string; color: string }> = {
  DRAFT: { ko: '임시저장', en: 'Draft', color: 'text-gray-500 bg-gray-100' },
  ACTIVE: { ko: '게시중', en: 'Active', color: 'text-emerald-700 bg-emerald-50' },
  CLOSED: { ko: '마감', en: 'Closed', color: 'text-red-600 bg-red-50' },
  EXPIRED: { ko: '만료', en: 'Expired', color: 'text-amber-600 bg-amber-50' },
  SUSPENDED: { ko: '정지', en: 'Suspended', color: 'text-red-700 bg-red-100' },
  PAUSED: { ko: '일시정지', en: 'Paused', color: 'text-blue-600 bg-blue-50' },
};

// ─── 직종 카테고리 / Job Categories ───

export interface JobCategory {
  code: string;
  name: string;
  nameEn: string;
  ksicCode: string;
}

export const JOB_CATEGORIES: JobCategory[] = [
  { code: 'REST_SERVING', name: '음식점 서빙', nameEn: 'Restaurant Serving', ksicCode: 'I' },
  { code: 'REST_KITCHEN', name: '주방보조', nameEn: 'Kitchen Assistant', ksicCode: 'I' },
  { code: 'CAFE_BARISTA', name: '카페 바리스타', nameEn: 'Cafe Barista', ksicCode: 'I' },
  { code: 'CONV_STORE', name: '편의점', nameEn: 'Convenience Store', ksicCode: 'G' },
  { code: 'MART_SALES', name: '마트 판매', nameEn: 'Mart Sales', ksicCode: 'G' },
  { code: 'LOGISTICS', name: '물류/택배', nameEn: 'Logistics/Delivery', ksicCode: 'H' },
  { code: 'DELIVERY', name: '배달', nameEn: 'Delivery', ksicCode: 'H' },
  { code: 'CONSTRUCTION', name: '건설 현장', nameEn: 'Construction Site', ksicCode: 'F' },
  { code: 'FACTORY', name: '공장/제조', nameEn: 'Factory/Manufacturing', ksicCode: 'C' },
  { code: 'AGRICULTURE', name: '농업/어업', nameEn: 'Agriculture/Fishery', ksicCode: 'A' },
  { code: 'OFFICE_ASSIST', name: '사무보조/번역', nameEn: 'Office/Translation', ksicCode: 'M' },
  { code: 'IT_ASSIST', name: 'IT/개발 보조', nameEn: 'IT/Dev Assistant', ksicCode: 'J' },
  { code: 'TUTORING', name: '과외/학원', nameEn: 'Tutoring/Academy', ksicCode: 'P' },
  { code: 'HOTEL_SERVICE', name: '호텔 서비스', nameEn: 'Hotel Service', ksicCode: 'I' },
  { code: 'CLEANING', name: '청소', nameEn: 'Cleaning', ksicCode: 'N' },
  { code: 'GAS_STATION', name: '주유원', nameEn: 'Gas Station', ksicCode: 'G' },
  { code: 'PARKING', name: '주차장 관리', nameEn: 'Parking Management', ksicCode: 'N' },
  { code: 'FAST_FOOD', name: '패스트푸드', nameEn: 'Fast Food', ksicCode: 'I' },
];

// ─── 알바 공고 생성 폼 데이터 / Alba Job Create Form Data ───

export interface AlbaJobFormData {
  // Step 1: 어떤 일인가요? / What kind of work?
  jobCategoryCode: string;
  jobDescription: string;
  recruitCount: number;
  hourlyWage: number;
  weeklyHours: number;
  schedule: ScheduleItem[];
  workPeriod: WorkPeriod;

  // Step 2: 어디서, 어떻게? / Where and how?
  title: string;
  address: Address;
  koreanLevel: KoreanLevel;
  experienceLevel: ExperienceLevel;
  preferredQualifications: string;
  benefits: BenefitType[];
  detailDescription: string;

  // Step 3: 접수 설정 / Application settings
  applicationDeadline: string | null;
  applicationMethod: ApplicationMethod;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

// ─── 알바 공고 응답 / Alba Job Response ───

export interface AlbaJobResponse {
  jobId: string;
  corporateId: string;
  boardType: 'PART_TIME';
  tierType: 'STANDARD' | 'PREMIUM';
  title: string;
  status: PostStatus;
  jobCategoryCode: string;
  jobCategoryName: string;
  ksicCode: string;
  jobDescription: string;
  recruitCount: number;
  hourlyWage: number;
  weeklyHours: number;
  schedule: ScheduleItem[];
  isWeekendOnly: boolean;
  workPeriod: WorkPeriod;
  address: Address;
  displayAddress: string;
  koreanLevel: KoreanLevel;
  experienceLevel: ExperienceLevel;
  preferredQualifications: string | null;
  benefits: string[];
  detailDescription: string;
  workContentImg: string | null;
  applicationDeadline: string | null;
  applicationMethod: ApplicationMethod;
  contactName: string;
  contactPhone: string;
  contactEmail: string | null;
  isPremium: boolean;
  premiumStartAt: string | null;
  premiumEndAt: string | null;
  matchedVisas: VisaEvalResult[];
  allowedVisas: string;
  viewCount: number;
  scrapCount: number;
  applyCount: number;
  companyName: string;
  companyLogo: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

/** 구직자 검색 결과 내 비자 적합도 / Visa match in search results */
export interface VisaMatch {
  status: 'eligible' | 'conditional';
  conditions: string[];
}

/** 구직자 검색 결과 공고 항목 / Search result job item */
export interface AlbaJobSearchItem extends AlbaJobResponse {
  visaMatch: VisaMatch;
  distanceFromSchool: string | null;
}

/** 페이지네이션 메타 / Pagination meta */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** 최소 시급 상수 / Minimum wage constant */
export const MINIMUM_WAGE = 10030;

/** 공고 기본 노출 기간(일) / Default posting duration (days) */
export const ALBA_DEFAULT_DURATION_DAYS = 14;
