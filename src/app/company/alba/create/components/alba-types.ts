/**
 * 알바 채용관 공통 타입 정의 (최종 버전)
 * Alba recruitment common type definitions (final version)
 */

/** 요일 열거형 / Day of week enum */
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

/** 요일별 근무 시간대 / Per-day work schedule item */
export interface ScheduleItem {
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

/** 근무지 주소 정보 / Workplace address */
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

/** 비자 매칭 상태 / Visa match status */
export type VisaMatchStatus = 'eligible' | 'conditional' | 'blocked';

/** 비자별 매칭 결과 / Per-visa evaluation result */
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

/** 알바 공고 폼 데이터 / Alba job form data */
export interface AlbaJobFormData {
  // Step 1: 기본정보 / Basic Info
  jobCategoryCode: string;
  recruitCount: number;
  hourlyWage: number;
  weeklyHours: number;
  schedule: ScheduleItem[];
  workPeriod: WorkPeriod;

  // Step 2: 상세조건 / Detailed Conditions
  title: string;
  address: Address;
  koreanLevel: KoreanLevel;
  experienceLevel: ExperienceLevel;
  preferredQualifications: string;
  benefits: Benefit[];
  detailDescription: string;

  // 접수 설정 / Application settings
  applicationDeadline: string | null;
  applicationMethod: ApplicationMethod;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

/** 직종 카테고리 / Job category */
export interface JobCategory {
  code: string;
  name: string;
  nameEn: string;
}

/** 직종 카테고리 그룹 / Job category groups */
export const CATEGORY_GROUPS: Record<string, JobCategory[]> = {
  '외식/음료': [
    { code: 'REST_SERVING', name: '홀서빙', nameEn: 'Restaurant Serving' },
    { code: 'REST_KITCHEN', name: '주방보조', nameEn: 'Kitchen Assistant' },
    { code: 'CAFE_BARISTA', name: '카페/바리스타', nameEn: 'Cafe/Barista' },
  ],
  '판매/매장': [
    { code: 'CONVENIENCE', name: '편의점', nameEn: 'Convenience Store' },
    { code: 'MART_SALES', name: '마트/판매', nameEn: 'Mart/Sales' },
  ],
  '물류/배달': [
    { code: 'DELIVERY', name: '배달/배송', nameEn: 'Delivery' },
    { code: 'WAREHOUSE', name: '물류/창고', nameEn: 'Warehouse' },
  ],
  '제조/생산': [
    { code: 'FACTORY', name: '공장/제조', nameEn: 'Factory/Manufacturing' },
  ],
  '건설': [
    { code: 'CONSTRUCTION', name: '건설/현장', nameEn: 'Construction' },
  ],
  '서비스': [
    { code: 'CLEANING', name: '청소/미화', nameEn: 'Cleaning' },
    { code: 'GAS_STATION', name: '주유소', nameEn: 'Gas Station' },
    { code: 'PARKING', name: '주차관리', nameEn: 'Parking Management' },
  ],
  '사무/IT': [
    { code: 'OFFICE_ASSIST', name: '사무보조', nameEn: 'Office Assistant' },
    { code: 'TRANSLATION', name: '번역/통역', nameEn: 'Translation' },
    { code: 'IT_ASSIST', name: 'IT보조', nameEn: 'IT Assistant' },
  ],
  '교육': [
    { code: 'TUTORING', name: '과외/학원', nameEn: 'Tutoring' },
  ],
  '농축산어업': [
    { code: 'FARMING', name: '농업/축산', nameEn: 'Farming' },
  ],
  '숙박': [
    { code: 'HOTEL_SERVICE', name: '호텔/숙박', nameEn: 'Hotel Service' },
  ],
};

/** 최저시급 (2025년 기준) / Minimum wage 2025 */
export const MINIMUM_WAGE = 10_030;

/** 복리후생 옵션 / Benefit options */
export const BENEFIT_OPTIONS: { value: Benefit; label: string; emoji: string }[] = [
  { value: 'MEAL', label: '식사 제공', emoji: '🍚' },
  { value: 'TRANSPORT', label: '교통비 지원', emoji: '🚌' },
  { value: 'INSURANCE', label: '4대보험', emoji: '🏥' },
  { value: 'HOUSING', label: '숙소 제공', emoji: '🏠' },
  { value: 'UNIFORM', label: '유니폼 제공', emoji: '👔' },
  { value: 'STAFF_DISCOUNT', label: '직원 할인', emoji: '🏷' },
  { value: 'BONUS', label: '상여금', emoji: '💰' },
  { value: 'FLEXIBLE_HOURS', label: '유연근무', emoji: '⏰' },
];

/** 위자드 스텝 / Wizard step */
export type WizardStep = 1 | 2 | 3;
