/**
 * 채용공고 등록 관련 타입 정의
 * Types for job posting creation
 */

// ─── 고용 형태 / Employment type ───
export type BoardType = 'PART_TIME' | 'FULL_TIME';
export type EmploymentSubType = 'CONTRACT' | 'PERMANENT' | 'INTERNSHIP';

// ─── 공고 상태 / Job status ───
export type PostStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'SUSPENDED';

// ─── 급여 유형 / Salary type (프론트 전용) ───
export type SalaryType = 'HOURLY' | 'MONTHLY' | 'ANNUAL';

// ─── 지원 방법 / Application method ───
export type ApplicationMethod = 'PLATFORM' | 'EMAIL' | 'WEBSITE';

// ─── 경력 수준 / Experience level ───
export type ExperienceLevel = 'ANY' | 'ENTRY' | 'EXPERIENCED';

// ─── 학력 수준 / Education level ───
export type EducationLevel = 'ANY' | 'HIGH_SCHOOL' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER';

// ─── 위자드 스텝 / Wizard step ───
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

// ─── 프론트엔드 폼 데이터 / Frontend form data ───
export interface JobCreateFormData {
  // Step 1: 기본정보 / Basic info
  title: string;
  jobCategory: string[];
  boardType: BoardType;
  employmentSubType: EmploymentSubType | '';
  headcount: number;

  // Step 2: 근무조건 / Work conditions
  address: string;
  addressDetail: string;
  workDays: boolean[];
  workTimeStart: string;
  workTimeEnd: string;
  salaryType: SalaryType;
  salaryAmount: string;
  salaryMax: string;
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;

  // Step 3: 상세내용 / Details
  jobDescription: string;
  requirements: string;
  preferredQualifications: string;
  benefits: string[];
  customBenefit: string;

  // Step 4: 접수설정 / Application settings
  applicationStartDate: string;
  applicationEndDate: string;
  applicationMethod: ApplicationMethod;
  externalEmail: string;
  externalUrl: string;

  // 비자 매칭 결과 (자동) / Visa match result (auto)
  allowedVisas: string[];
}

// ─── 비자 매칭 결과 / Visa match result ───
export interface VisaMatchResult {
  eligibleVisas: EligibleVisa[];
  blockedVisas: BlockedVisa[];
  summary: string;
  appliedRuleCount: number;
  evaluatedAt: string;
}

export interface EligibleVisa {
  code: string;
  nameKo: string;
  documents: string[];
  restrictions: string[];
  notes: string[];
}

export interface BlockedVisa {
  code: string;
  nameKo: string;
  reasons: string[];
  suggestions: string[];
}

// ─── 기업 프로필 (비자 매칭용) / Corporate profile ───
export interface CorpProfileForMatching {
  ksicCode: string | null;
  addressRoad: string | null;
  companySizeType: string;
  employeeCountKorean: number;
  employeeCountForeign: number;
  annualRevenue: number;
}

// ─── 비자 매칭 요청 / Visa matching request ───
export interface VisaEvaluateRequest {
  ksicCode: string;
  companySizeType: string;
  employeeCountKorean: number;
  employeeCountForeign: number;
  annualRevenue: number;
  addressRoad: string;
  jobType: BoardType;
  offeredSalary: number;
}

// ─── 백엔드 API 페이로드 / Backend API payload ───
export interface JobCreateApiPayload {
  boardType: BoardType;
  tierType: 'STANDARD';
  title: string;
  description: string;
  allowedVisas: string; // 쉼표 구분 문자열 / Comma-separated string
  displayAddress: string;
  actualAddress: string;
  workIntensity: 'MIDDLE';
  benefits: string | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  applicationMethod: ApplicationMethod;
  externalUrl?: string;
  externalEmail?: string;
  interviewMethod: 'OFFLINE';
  employmentSubType?: EmploymentSubType;
  closingDate?: string | null;
  headcount?: number;
  requirements?: string;
  preferredQualifications?: string;
  albaAttributes?: {
    hourlyWage: number;
    workPeriod: string;
    workDaysMask: string;
    workTimeStart: string;
    workTimeEnd: string;
  };
  fulltimeAttributes?: {
    salaryMin: number;
    salaryMax: number;
    experienceLevel: string;
    educationLevel: string;
  };
}

// ─── API 응답 / API responses ───
export interface JobCreateResponse {
  id: number;
  jobId: number;
  status: PostStatus;
}

export interface JobActivateResponse {
  id: number;
  status: 'ACTIVE';
}

// ─── 주소 검색 결과 (다음 API) / Address search result ───
export interface DaumAddressData {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  sido: string;
  sigungu: string;
}

// ─── 카테고리/복리후생 옵션 / Category & benefit options ───
export const CATEGORY_OPTIONS = [
  '제조/생산', '건설/토목', '음식/서비스', '농업/축산', '어업/수산',
  'IT/소프트웨어', '사무/행정', '판매/유통', '교육/강사', '의료/간호',
  '운송/물류', '숙박/관광', '번역/통역', '디자인/예술', '기타',
] as const;

export const BENEFIT_OPTIONS = [
  '4대보험', '퇴직금', '연차', '식사 제공', '교통비 지원',
  '기숙사', '성과급', '야근수당', '의료보험', '교육/연수',
] as const;

export const STEP_LABELS = ['기본정보', '근무조건', '상세내용', '비자매칭', '미리보기'] as const;

export const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;
