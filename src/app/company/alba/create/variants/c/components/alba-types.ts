/**
 * 알바 채용관 Variant C 공통 타입 정의
 * Shared type definitions for Alba recruitment Variant C
 */

// 요일 코드 / Day of week codes
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

// 요일별 근무 스케줄 항목 / Per-day work schedule item
export interface ScheduleItem {
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
}

// 근무지 주소 / Workplace address
export interface Address {
  sido: string;
  sigungu: string;
  detail: string;
  lat: number;
  lng: number;
}

// 근무 기간 / Work period
export interface WorkPeriod {
  startDate: string;
  endDate: string | null; // null = 채용시까지 / until filled
}

// 비자 매칭 결과 / Visa evaluation result
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

// 매칭 요약 / Matching summary
export interface MatchingSummary {
  totalEligible: number;
  totalConditional: number;
  totalBlocked: number;
}

// 한국어 수준 / Korean language level
export type KoreanLevel = 'NONE' | 'BASIC' | 'DAILY' | 'BUSINESS';

// 경력 수준 / Experience level
export type ExperienceLevel = 'NONE' | 'UNDER_1Y' | 'ONE_TO_THREE_Y' | 'OVER_3Y';

// 복리후생 코드 / Benefits codes
export type BenefitCode =
  | 'MEAL'
  | 'TRANSPORT'
  | 'INSURANCE'
  | 'HOUSING'
  | 'UNIFORM'
  | 'STAFF_DISCOUNT'
  | 'BONUS'
  | 'FLEXIBLE_HOURS';

// 접수 방법 / Application method
export type ApplicationMethod = 'PLATFORM' | 'PHONE' | 'EMAIL';

// 공고 상태 / Post status
export type PostStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'SUSPENDED' | 'PAUSED';

// 공고 등급 / Tier type
export type TierType = 'STANDARD' | 'PREMIUM';

// 알바 공고 생성 폼 데이터 / Alba job creation form data
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
  benefits: BenefitCode[];
  detailDescription: string;
  workContentImg: string | null;

  // Step 3: 미리보기 & 등록 / Preview & submit
  applicationDeadline: string | null;
  applicationMethod: ApplicationMethod;
  contactName: string;
  contactPhone: string;
  contactEmail: string | null;
}

// 알바 공고 응답 DTO / Alba job response DTO
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

// 직종 카테고리 / Job category
export interface JobCategory {
  code: string;
  name: string;
  nameEn: string;
  icon: string; // 이모지 아이콘 / emoji icon
  group: string;
  groupName: string;
}

// 직종 카테고리 목록 (목업 데이터) / Job category list (mock data)
export const JOB_CATEGORIES: JobCategory[] = [
  { code: 'REST_SERVING', name: '음식점 서빙', nameEn: 'Restaurant Serving', icon: '🍽️', group: 'FOOD', groupName: '음식점/카페' },
  { code: 'REST_KITCHEN', name: '주방보조', nameEn: 'Kitchen Assistant', icon: '🧑‍🍳', group: 'FOOD', groupName: '음식점/카페' },
  { code: 'CAFE_BARISTA', name: '카페 바리스타', nameEn: 'Cafe Barista', icon: '☕', group: 'FOOD', groupName: '음식점/카페' },
  { code: 'FAST_FOOD', name: '패스트푸드', nameEn: 'Fast Food', icon: '🍔', group: 'FOOD', groupName: '음식점/카페' },
  { code: 'CONV_STORE', name: '편의점', nameEn: 'Convenience Store', icon: '🏪', group: 'RETAIL', groupName: '판매/매장' },
  { code: 'MART_STAFF', name: '마트/매장', nameEn: 'Mart/Store Staff', icon: '🛒', group: 'RETAIL', groupName: '판매/매장' },
  { code: 'LOGISTICS', name: '물류/택배 분류', nameEn: 'Logistics/Sorting', icon: '📦', group: 'LOGISTICS', groupName: '물류/배송' },
  { code: 'DELIVERY', name: '배달', nameEn: 'Delivery', icon: '🛵', group: 'LOGISTICS', groupName: '물류/배송' },
  { code: 'FACTORY', name: '공장/제조', nameEn: 'Factory/Manufacturing', icon: '🏭', group: 'MANUFACTURING', groupName: '제조/생산' },
  { code: 'CONSTRUCTION', name: '건설 현장 보조', nameEn: 'Construction Helper', icon: '🏗️', group: 'CONSTRUCTION', groupName: '건설' },
  { code: 'OFFICE_ASSIST', name: '사무보조', nameEn: 'Office Assistant', icon: '💼', group: 'OFFICE', groupName: '사무/전문직' },
  { code: 'TRANSLATION', name: '번역/통역', nameEn: 'Translation', icon: '🌐', group: 'OFFICE', groupName: '사무/전문직' },
  { code: 'HOTEL_SERVICE', name: '호텔 서비스', nameEn: 'Hotel Service', icon: '🏨', group: 'SERVICE', groupName: '서비스' },
  { code: 'CLEANING', name: '청소/관리', nameEn: 'Cleaning/Maintenance', icon: '🧹', group: 'SERVICE', groupName: '서비스' },
  { code: 'TUTORING', name: '과외/학원강사', nameEn: 'Tutoring', icon: '📚', group: 'EDUCATION', groupName: '교육' },
  { code: 'IT_ASSIST', name: 'IT/개발 보조', nameEn: 'IT/Dev Assistant', icon: '💻', group: 'IT', groupName: 'IT/개발' },
  { code: 'AGRICULTURE', name: '농업/어업 보조', nameEn: 'Agriculture/Fishing', icon: '🌾', group: 'PRIMARY', groupName: '농축수산' },
  { code: 'GAS_STATION', name: '주유원', nameEn: 'Gas Station', icon: '⛽', group: 'SERVICE', groupName: '서비스' },
  { code: 'PARKING', name: '주차장 관리', nameEn: 'Parking Management', icon: '🅿️', group: 'SERVICE', groupName: '서비스' },
];

// 복리후생 라벨 맵 / Benefits label map
export const BENEFITS_MAP: Record<BenefitCode, { label: string; labelEn: string; icon: string }> = {
  MEAL: { label: '식사제공', labelEn: 'Meals', icon: '🍱' },
  TRANSPORT: { label: '교통비', labelEn: 'Transport', icon: '🚌' },
  INSURANCE: { label: '4대보험', labelEn: 'Insurance', icon: '🛡️' },
  HOUSING: { label: '숙소제공', labelEn: 'Housing', icon: '🏠' },
  UNIFORM: { label: '유니폼', labelEn: 'Uniform', icon: '👔' },
  STAFF_DISCOUNT: { label: '직원할인', labelEn: 'Staff Discount', icon: '🏷️' },
  BONUS: { label: '성과급', labelEn: 'Bonus', icon: '💰' },
  FLEXIBLE_HOURS: { label: '유연근무', labelEn: 'Flexible Hours', icon: '⏰' },
};

// 요일 라벨 맵 / Day label map
export const DAY_LABELS: Record<DayOfWeek, { short: string; shortEn: string; full: string }> = {
  MON: { short: '월', shortEn: 'Mon', full: '월요일' },
  TUE: { short: '화', shortEn: 'Tue', full: '화요일' },
  WED: { short: '수', shortEn: 'Wed', full: '수요일' },
  THU: { short: '목', shortEn: 'Thu', full: '목요일' },
  FRI: { short: '금', shortEn: 'Fri', full: '금요일' },
  SAT: { short: '토', shortEn: 'Sat', full: '토요일' },
  SUN: { short: '일', shortEn: 'Sun', full: '일요일' },
};

// 한국어 수준 라벨 / Korean level labels
export const KOREAN_LEVEL_LABELS: Record<KoreanLevel, { label: string; labelEn: string }> = {
  NONE: { label: '무관', labelEn: 'Not Required' },
  BASIC: { label: '기초', labelEn: 'Basic' },
  DAILY: { label: '일상회화', labelEn: 'Daily Conversation' },
  BUSINESS: { label: '비즈니스', labelEn: 'Business Level' },
};

// 경력 수준 라벨 / Experience level labels
export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, { label: string; labelEn: string }> = {
  NONE: { label: '무관', labelEn: 'Not Required' },
  UNDER_1Y: { label: '1년 미만', labelEn: 'Under 1 Year' },
  ONE_TO_THREE_Y: { label: '1~3년', labelEn: '1-3 Years' },
  OVER_3Y: { label: '3년 이상', labelEn: 'Over 3 Years' },
};
