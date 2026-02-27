/**
 * 정규채용 공고 등록 위자드 타입 정의
 * Fulltime job posting wizard type definitions
 */

/**
 * E-7 직종 항목 타입 (백엔드 API 응답과 동일)
 * E-7 job category type (matches backend API response)
 */
export interface E7JobCategory {
  code: string;
  nameKo: string;
  nameEn: string;
  e7Type: 'E-7-1' | 'E-7-2' | 'E-7-3';
  categoryGroup: string;
}

// 하위 호환성 alias / Backward compatibility alias
export type JobCategory = E7JobCategory;

// 위자드 단계 / Wizard steps
export type WizardStep = 1 | 2 | 3 | 4 | 5;

// 경력 수준 / Experience level
export type ExperienceLevel = 'ENTRY' | 'JUNIOR' | 'SENIOR' | 'EXPERT';

// 학력 수준 / Education level
export type EducationLevel =
  | 'HIGH_SCHOOL'
  | 'ASSOCIATE'
  | 'BACHELOR'
  | 'MASTER'
  | 'DOCTORATE';

// 고용 형태 / Employment type
export type EmploymentType = 'REGULAR' | 'CONTRACT' | 'INTERN' | 'ALBA';

// 계약 기간 / Contract period (계약직 전용)
export type ContractPeriod = '6' | '12' | '18' | '24' | 'NEGOTIABLE';

// 급여 입력 방식 / Salary input type
export type SalaryInputType = 'YEARLY' | 'MONTHLY' | 'HOURLY';

// 기관 유형 / Institution type
export type InstitutionType =
  | 'GENERAL'
  | 'EDUCATION'
  | 'RESEARCH'
  | 'MEDICAL';

// 접수 방법 / Application method
export type ApplicationMethod =
  | 'PLATFORM'  // 잡차자 플랫폼
  | 'EMAIL'     // 이메일
  | 'PHONE'     // 전화
  | 'VISIT';    // 방문

// 복리후생 / Benefits
export type BenefitType =
  | 'MEAL'            // 식대
  | 'TRANSPORTATION'  // 교통비
  | 'ACCOMMODATION'   // 숙소
  | 'INSURANCE'       // 4대보험
  | 'RETIREMENT'      // 퇴직금
  | 'EDUCATION'       // 교육 지원
  | 'CHILDCARE'       // 육아 지원
  | 'ANNUAL_LEAVE'    // 연차
  | 'HEALTH_CHECKUP'  // 건강검진
  | 'VACATION';       // 휴가비

// 주소 정보 / Address information
export interface AddressInfo {
  sido: string;                    // 시/도
  sigungu: string;                 // 시/군/구
  detail: string;                  // 상세 주소
  lat?: number;                    // 위도
  lng?: number;                    // 경도
  isDepopulationArea?: boolean;    // 인구감소지역 여부 (서버 판별)
}

// 회사 정보 / Company information
export interface CompanyInfo {
  totalEmployees?: number;          // 전체 직원 수
  foreignEmployeeCount?: number;    // 외국인 직원 수
  institutionType?: InstitutionType; // 기관 유형
}

// 정규채용 공고 폼 데이터 / Fulltime job form data
export interface FulltimeJobFormData {
  // Step 1: 기본 정보
  jobCategoryCode: string;             // 직종 코드
  employmentType: EmploymentType;      // 고용 형태
  contractPeriod?: ContractPeriod;     // 계약 기간 (계약직만 해당)

  // 급여 정보
  salaryInputType: SalaryInputType;    // 급여 입력 방식 (연봉/월급/시급)
  salaryMin: number;                   // 최소 연봉 (원) - 자동 환산됨
  salaryMax: number;                   // 최대 연봉 (원) - 자동 환산됨
  hourlyWage?: number;                 // 시급 (원/시간) - 시급 선택 시
  monthlySalary?: number;              // 월급 (원/월) - 월급 선택 시
  weeklyWorkHours: number;             // 주 근무시간 (기본값: 40)

  experienceLevel: ExperienceLevel;    // 경력 수준
  educationLevel: EducationLevel;      // 학력 수준
  overseasHireWilling: boolean;        // 해외 인재 스폰서 가능 여부

  // Step 2: 근무 조건
  address: AddressInfo;                // 근무지 주소
  preferredMajors: string[];           // 우대 전공 (최대 5개)
  recruitCount: number;                // 모집 인원
  companyInfo: CompanyInfo;            // 회사 정보 (선택)

  // Step 3: 상세 내용
  title: string;                       // 공고 제목
  detailDescription: string;           // 상세 설명
  benefits: BenefitType[];             // 복리후생

  // Step 4: 접수 설정 (비자 매칭 결과는 자동 생성)
  applicationMethod: ApplicationMethod; // 접수 방법
  applicationDeadline: string | null;  // 접수 마감일 (YYYY-MM-DD)
  isOpenEnded: boolean;                // 채용 시까지 여부

  // Step 4: 담당자 정보 / Contact info
  contactName: string;                 // 담당자 이름
  contactPhone: string;                // 담당자 전화번호
  contactEmail: string;                // 담당자 이메일
}

// 비자 평가 결과 (백엔드 VisaEvalResultDto와 동일)
// Visa evaluation result (matches backend VisaEvalResultDto)
export interface VisaEvalResult {
  visaCode: string;                    // 비자 코드 (예: E-7-1)
  visaName: string;                    // 비자 이름 (한글)
  visaNameEn: string;                  // 비자 이름 (영문)
  hiringTrack: string;                 // 채용 트랙
  status: 'eligible' | 'conditional' | 'blocked';
  conditions: string[];
  blockReasons: string[];
  requiredPermit: string | null;
  notes: string | null;
  estimatedDays: number | null;
  requiredDocuments: string[];
}

// 채용 트랙 / Hiring track
export type HiringTrack = 'IMMEDIATE' | 'SPONSOR' | 'TRANSITION' | 'TRANSFER';

// 트랙별 비자 매칭 결과 (백엔드 HiringTrackGroupDto와 동일)
// Track-specific result (matches backend HiringTrackGroupDto)
export interface TrackVisaMatchingResult {
  track: HiringTrack;
  trackName: string;
  trackNameEn: string;
  eligible: VisaEvalResult[];
  conditional: VisaEvalResult[];
  blocked: VisaEvalResult[];
  summary: {
    totalEligible: number;
    totalConditional: number;
    totalBlocked: number;
  };
}

// 정규채용 비자 매칭 응답 (백엔드 FulltimeVisaMatchingResponseDto와 동일)
// Fulltime visa matching response (matches backend FulltimeVisaMatchingResponseDto)
export interface FulltimeVisaMatchingResponse {
  immediate: TrackVisaMatchingResult;
  sponsor: TrackVisaMatchingResult;
  transition: TrackVisaMatchingResult;
  transfer: TrackVisaMatchingResult;
  overallSummary: {
    totalEligible: number;
    totalConditional: number;
    totalBlocked: number;
    totalVisasEvaluated: number;
  };
  matchedAt: string;
  inputSummary: Record<string, unknown>;
}

// 트랙 메타데이터 / Track metadata
export interface TrackMetadata {
  key: HiringTrack;
  label: string;
  description: string;
  color: string;
  emoji: string;
}

// 트랙 정보 상수 / Track info constants
export const TRACK_INFO: Record<HiringTrack, TrackMetadata> = {
  IMMEDIATE: {
    key: 'IMMEDIATE',
    label: '즉시 채용',
    description: 'F비자 보유자',
    color: '#22c55e',
    emoji: '🟢',
  },
  SPONSOR: {
    key: 'SPONSOR',
    label: '해외 스폰서',
    description: 'E비자 발급 지원',
    color: '#3b82f6',
    emoji: '🔵',
  },
  TRANSITION: {
    key: 'TRANSITION',
    label: '전환 채용',
    description: 'D-2/D-10 → E-7',
    color: '#eab308',
    emoji: '🟡',
  },
  TRANSFER: {
    key: 'TRANSFER',
    label: '이직 채용',
    description: 'E비자 직장 변경',
    color: '#f97316',
    emoji: '🟠',
  },
};

// 학력 레이블 / Education level labels
export const EDUCATION_LABELS: Record<EducationLevel, string> = {
  HIGH_SCHOOL: '고등학교 졸업',
  ASSOCIATE: '전문학사',
  BACHELOR: '학사',
  MASTER: '석사',
  DOCTORATE: '박사',
};

// 경력 레이블 / Experience level labels
export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  ENTRY: '신입',
  JUNIOR: '경력 1~3년',
  SENIOR: '경력 3~7년',
  EXPERT: '경력 7년 이상',
};

// 고용 형태 레이블 / Employment type labels
export const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  REGULAR: '정규직',
  CONTRACT: '계약직',
  INTERN: '인턴',
  ALBA: '알바',
};

// 계약 기간 레이블 / Contract period labels
export const CONTRACT_PERIOD_LABELS: Record<ContractPeriod, string> = {
  '6': '6개월',
  '12': '12개월 (1년)',
  '18': '18개월',
  '24': '24개월 (2년)',
  NEGOTIABLE: '추후 협의',
};

// 급여 입력 방식 레이블 / Salary input type labels
export const SALARY_INPUT_TYPE_LABELS: Record<SalaryInputType, string> = {
  YEARLY: '연봉',
  MONTHLY: '월급',
  HOURLY: '시급',
};

// 복리후생 레이블 / Benefit labels
export const BENEFIT_LABELS: Record<BenefitType, string> = {
  MEAL: '식대 지원',
  TRANSPORTATION: '교통비 지원',
  ACCOMMODATION: '숙소 제공',
  INSURANCE: '4대보험',
  RETIREMENT: '퇴직금',
  EDUCATION: '교육 지원',
  CHILDCARE: '육아 지원',
  ANNUAL_LEAVE: '연차',
  HEALTH_CHECKUP: '건강검진',
  VACATION: '휴가비',
};

/**
 * 급여 환산 헬퍼 함수
 * Salary conversion helper functions
 */

// 시급 → 연봉 환산 (한국 근로기준법 기준, 유급주휴 포함)
// Hourly → Yearly conversion (Korean Labor Standards Act, includes paid weekly rest)
// 주 40시간 기준: (40 + 8) × 365/7/12 = 209시간/월 → 연봉 = 시급 × 209 × 12
export function convertHourlyToYearly(hourlyWage: number, weeklyHours: number = 40): number {
  // 월 소정근로시간 = (주 소정근로시간 + 유급주휴시간) × (365 / 7) / 12
  // 유급주휴시간 = 주 15시간 이상 → 주근로시간 / 5
  const paidWeeklyRestHours = weeklyHours >= 15 ? weeklyHours / 5 : 0;
  const monthlyHours = Math.round((weeklyHours + paidWeeklyRestHours) * 365 / 7 / 12);
  return monthlyHours * 12 * hourlyWage;
}

// 월급 → 연봉 환산
export function convertMonthlyToYearly(monthlySalary: number): number {
  return monthlySalary * 12;
}

// 연봉 → 시급 환산 (한국 근로기준법 기준, 유급주휴 포함)
export function convertYearlyToHourly(yearlySalary: number, weeklyHours: number = 40): number {
  const paidWeeklyRestHours = weeklyHours >= 15 ? weeklyHours / 5 : 0;
  const monthlyHours = Math.round((weeklyHours + paidWeeklyRestHours) * 365 / 7 / 12);
  return Math.round(yearlySalary / 12 / monthlyHours);
}

// ─── 알바 비자 분석 응답 타입 (백엔드 AlbaHiringVisaAnalysisResponseDto) ───
// Alba visa analysis response types (matches backend DTO)

export interface AlbaVisaStatus {
  visaCode: string;
  visaName: string;
  visaNameEn: string;
  status: 'eligible' | 'restricted' | 'blocked';
  requiresPermit: boolean;
  maxWeeklyHours: number | null;
  reason: string | null;
}

export interface AlbaHiringVisaAnalysisResponse {
  freeEmployment: AlbaVisaStatus[];
  permitRequired: AlbaVisaStatus[];
  blocked: AlbaVisaStatus[];
  appliedRules: string[];
  inputSummary: {
    jobCategoryCode: string;
    ksicCode: string;
    weeklyHours: number;
    isSimpleLabor: boolean;
    isEntertainment: boolean;
    isBlockedForH2: boolean;
    isDepopulationArea: boolean;
  };
  summary: {
    totalEligible: number;
    totalRestricted: number;
    totalBlocked: number;
  };
  analyzedAt: string;
}

