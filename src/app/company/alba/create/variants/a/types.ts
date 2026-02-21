/**
 * 알바 채용관 공통 타입 정의
 * Alba recruitment common type definitions
 */

/** 요일 열거형 / Day of week enum */
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

/** 요일별 근무 시간대 / Per-day work schedule item */
export interface ScheduleItem {
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

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
  startDate: string; // "YYYY-MM-DD"
  endDate: string | null; // null = 채용시까지 / until position filled
}

/** 한국어 수준 / Korean language level */
export type KoreanLevel = 'NONE' | 'BASIC' | 'DAILY' | 'BUSINESS';

/** 경력 수준 / Experience level */
export type ExperienceLevel = 'NONE' | 'UNDER_1Y' | 'ONE_TO_THREE_Y' | 'OVER_3Y';

/** 복리후생 / Benefits */
export type Benefit =
  | 'MEAL'
  | 'TRANSPORT'
  | 'INSURANCE'
  | 'HOUSING'
  | 'UNIFORM'
  | 'STAFF_DISCOUNT'
  | 'BONUS'
  | 'FLEXIBLE_HOURS';

/** 접수 방법 / Application method */
export type ApplicationMethod = 'PLATFORM' | 'PHONE' | 'EMAIL';

/** 공고 상태 / Posting status */
export type PostStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'SUSPENDED' | 'PAUSED';

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

/** 알바 공고 생성 폼 데이터 / Alba job creation form data */
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
  benefits: Benefit[];
  detailDescription: string;

  // Step 3: 접수 설정 / Application settings
  applicationDeadline: string | null;
  applicationMethod: ApplicationMethod;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

/** 비자 매칭 응답 / Visa matching response */
export interface AlbaVisaMatchingResponse {
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

/** 공고 생성 응답 / Job creation response */
export interface AlbaJobCreateResponse {
  jobId: string;
  status: PostStatus;
  matchedVisas: VisaEvalResult[];
  matchingSummary: {
    totalEligible: number;
    totalConditional: number;
    totalBlocked: number;
  };
}

/** 알바 공고 응답 DTO / Alba job response DTO */
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
  benefits: Benefit[];
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

/** 검색 결과 내 공고 (비자 매치 정보 포함) / Search result job (with visa match info) */
export interface AlbaJobSearchItem extends AlbaJobResponse {
  visaMatch: {
    status: 'eligible' | 'conditional';
    conditions: string[];
  };
  distanceFromSchool: string | null;
}

/** 페이지네이션 메타 / Pagination metadata */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** 검색 응답 / Search response */
export interface AlbaJobSearchResponse {
  jobs: AlbaJobSearchItem[];
  premiumJobs: AlbaJobResponse[];
  pagination: PaginationMeta;
  appliedFilters: {
    visaCode: string;
    maxWeeklyHoursForVisa: number | null;
    excludedIndustries: string[];
  };
}

/** 직종 카테고리 / Job category */
export interface JobCategory {
  code: string;
  name: string;
  nameEn: string;
  parentCode: string | null;
}

/** 위자드 스텝 번호 / Wizard step number */
export type WizardStep = 1 | 2 | 3;
