/**
 * 알바 채용관 Variant B 공통 타입 정의
 * Alba recruitment Variant B shared type definitions
 */

// ─── 스케줄 아이템 / Schedule item ───
export interface ScheduleItem {
  dayOfWeek: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

// ─── 주소 / Address ───
export interface Address {
  sido: string;
  sigungu: string;
  detail: string;
  lat: number;
  lng: number;
}

// ─── 근무 기간 / Work period ───
export interface WorkPeriod {
  startDate: string;
  endDate: string | null;
}

// ─── 비자 매칭 결과 / Visa evaluation result ───
export interface VisaEvalResult {
  visaCode: string;
  visaName: string;
  visaNameEn: string;
  status: 'eligible' | 'conditional' | 'blocked';
  conditions?: string[];
  blockReasons?: string[];
  requiredPermit?: string | null;
  maxWeeklyHours?: number | null;
  maxWorkplaces?: number | null;
  notes?: string | null;
}

// ─── 비자 매칭 응답 / Visa matching response ───
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

// ─── 한국어 수준 / Korean level ───
export type KoreanLevel = 'NONE' | 'BASIC' | 'DAILY' | 'BUSINESS';

// ─── 경력 수준 / Experience level ───
export type ExperienceLevel = 'NONE' | 'UNDER_1Y' | 'ONE_TO_THREE_Y' | 'OVER_3Y';

// ─── 복리후생 / Benefits ───
export type Benefit =
  | 'MEAL'
  | 'TRANSPORT'
  | 'INSURANCE'
  | 'HOUSING'
  | 'UNIFORM'
  | 'STAFF_DISCOUNT'
  | 'BONUS'
  | 'FLEXIBLE_HOURS';

// ─── 접수 방법 / Application method ───
export type ApplicationMethod = 'PLATFORM' | 'PHONE' | 'EMAIL';

// ─── 공고 상태 / Posting status ───
export type PostStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'SUSPENDED' | 'PAUSED';

// ─── 공고 등급 / Posting tier ───
export type TierType = 'STANDARD' | 'PREMIUM';

// ─── 알바 공고 생성 폼 데이터 / Alba job create form data ───
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
  workContentImg: string | null;

  // Step 3: 접수 설정 / Application settings
  applicationDeadline: string | null;
  applicationMethod: ApplicationMethod;
  contactName: string;
  contactPhone: string;
  contactEmail: string | null;
}

// ─── 알바 공고 응답 / Alba job response ───
export interface AlbaJobResponse {
  jobId: string;
  corporateId: string;
  boardType: 'PART_TIME';
  tierType: TierType;
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

// ─── 페이지네이션 메타 / Pagination meta ───
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── 검색 결과의 비자 매치 / Search result visa match ───
export interface VisaMatch {
  status: 'eligible' | 'conditional';
  conditions: string[];
}

// ─── 검색 결과 공고 / Search result job ───
export interface AlbaSearchJob extends AlbaJobResponse {
  visaMatch?: VisaMatch;
  distanceFromSchool?: string | null;
}

// ─── 검색 응답 / Search response ───
export interface AlbaSearchResponse {
  jobs: AlbaSearchJob[];
  premiumJobs: AlbaJobResponse[];
  pagination: PaginationMeta;
  appliedFilters: {
    visaCode?: string;
    maxWeeklyHoursForVisa?: number | null;
    excludedIndustries?: string[];
  };
}

// ─── 직종 카테고리 / Job category ───
export interface JobCategory {
  code: string;
  name: string;
  group: string;
}

// ─── 정렬 기준 / Sort criteria ───
export type SortBy = 'LATEST' | 'WAGE_HIGH' | 'DISTANCE' | 'DEADLINE';

// ─── 요일 라벨 매핑 / Day of week label mapping ───
export const DAY_LABELS: Record<ScheduleItem['dayOfWeek'], string> = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};

// ─── 요일 영어 라벨 / Day of week English labels ───
export const DAY_LABELS_EN: Record<ScheduleItem['dayOfWeek'], string> = {
  MON: 'Mon',
  TUE: 'Tue',
  WED: 'Wed',
  THU: 'Thu',
  FRI: 'Fri',
  SAT: 'Sat',
  SUN: 'Sun',
};

// ─── 한국어 수준 라벨 / Korean level labels ───
export const KOREAN_LEVEL_LABELS: Record<KoreanLevel, string> = {
  NONE: '무관',
  BASIC: '기초',
  DAILY: '일상회화',
  BUSINESS: '비즈니스',
};

// ─── 경력 수준 라벨 / Experience level labels ───
export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  NONE: '무관',
  UNDER_1Y: '1년 미만',
  ONE_TO_THREE_Y: '1~3년',
  OVER_3Y: '3년 이상',
};

// ─── 복리후생 라벨 / Benefit labels ───
export const BENEFIT_LABELS: Record<Benefit, string> = {
  MEAL: '식사제공',
  TRANSPORT: '교통비',
  INSURANCE: '4대보험',
  HOUSING: '숙소제공',
  UNIFORM: '유니폼',
  STAFF_DISCOUNT: '직원할인',
  BONUS: '성과급',
  FLEXIBLE_HOURS: '유연근무',
};

// ─── 접수 방법 라벨 / Application method labels ───
export const APPLICATION_METHOD_LABELS: Record<ApplicationMethod, string> = {
  PLATFORM: '플랫폼 지원',
  PHONE: '전화 접수',
  EMAIL: '이메일 접수',
};

// ─── 공고 상태 라벨 / Post status labels ───
export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  DRAFT: '임시저장',
  ACTIVE: '게시중',
  CLOSED: '마감',
  EXPIRED: '만료',
  SUSPENDED: '정지',
  PAUSED: '일시정지',
};

// ─── 직종 카테고리 목록 (목업) / Job categories (mock) ───
export const JOB_CATEGORIES: JobCategory[] = [
  { code: 'REST_SERVING', name: '음식점 서빙', group: '외식/음료' },
  { code: 'REST_KITCHEN', name: '주방보조/설거지', group: '외식/음료' },
  { code: 'CAFE_BARISTA', name: '카페/바리스타', group: '외식/음료' },
  { code: 'CONVENIENCE', name: '편의점', group: '판매/매장' },
  { code: 'MART_SALES', name: '마트/판매', group: '판매/매장' },
  { code: 'DELIVERY', name: '배달/운송', group: '물류/배달' },
  { code: 'WAREHOUSE', name: '물류/택배 분류', group: '물류/배달' },
  { code: 'FACTORY', name: '공장/제조', group: '제조/생산' },
  { code: 'CONSTRUCTION', name: '건설/현장보조', group: '건설' },
  { code: 'CLEANING', name: '청소/건물관리', group: '서비스' },
  { code: 'OFFICE_ASSIST', name: '사무보조', group: '사무/IT' },
  { code: 'TRANSLATION', name: '번역/통역', group: '사무/IT' },
  { code: 'IT_ASSIST', name: 'IT/개발 보조', group: '사무/IT' },
  { code: 'TUTORING', name: '과외/학원강사', group: '교육' },
  { code: 'FARMING', name: '농업/어업 보조', group: '농축산어업' },
  { code: 'HOTEL_SERVICE', name: '호텔 객실 서비스', group: '숙박' },
  { code: 'GAS_STATION', name: '주유원', group: '서비스' },
  { code: 'PARKING', name: '주차장 관리', group: '서비스' },
];

// ─── 시도 목록 (목업) / Province list (mock) ───
export const SIDO_LIST = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시',
  '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
  '경기도', '강원특별자치도', '충청북도', '충청남도',
  '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도',
];
