/**
 * 위저드 타입 정의 / Wizard type definitions
 * 시커(구직자) 프로필 위저드 전체에서 사용하는 공통 타입
 * Common types used throughout the seeker profile wizard
 *
 * 주의: enum으로 정의하여 Variant E에서도 ResidencyStatus.LONG_TERM 접근 가능
 * Note: Defined as enums so Variant E can access e.g. ResidencyStatus.LONG_TERM
 */

/** 거주 상태 분기 타입 / Residency status type */
export enum ResidencyStatus {
  LONG_TERM = 'LONG_TERM',
  SHORT_TERM = 'SHORT_TERM',
  OVERSEAS = 'OVERSEAS',
}

/** 성별 / Gender */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

/** 학위 / Degree type */
export enum DegreeType {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  ASSOCIATE = 'ASSOCIATE',
  BACHELOR = 'BACHELOR',
  BACHELORS = 'BACHELOR',
  MASTER = 'MASTER',
  DOCTORATE = 'DOCTORATE',
}

/** 재학 상태 / Enrollment status */
export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  ON_LEAVE = 'ON_LEAVE',
  GRADUATED = 'GRADUATED',
  DROPPED_OUT = 'DROPPED_OUT',
}

/** 한국어 시험 종류 / Korean language test type */
export enum KoreanTestType {
  TOPIK = 'TOPIK',
  KIIP = 'KIIP',
  SEJONG = 'SEJONG',
  NONE = 'NONE',
}

/** 회화 자가평가 레벨 / Self-assessed conversation level */
export enum ConversationLevel {
  BASIC = 'BASIC',
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  NATIVE = 'NATIVE',
}

/** 고용 형태 / Employment type */
export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
}

/** 급여 유형 / Salary type */
export enum SalaryType {
  HOURLY = 'HOURLY',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

/** 뱃지 상태 / Badge status */
export enum BadgeStatus {
  LOCKED = 'LOCKED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
}

/** Step 0: 거주 상태 데이터 / Residency data */
export interface ResidencyData {
  residencyStatus: ResidencyStatus | null;
}

/** Step 1: 기본 신원 데이터 / Identity data */
export interface IdentityData {
  firstName: string;
  lastName: string;
  nationality: string;
  birthDate: string;
  gender: Gender | null;
  phone: string;
  email: string;
  profilePhoto: string | null;
  address: string;
  addressDetail: string;
}

/** Step 2: 비자/체류 정보 데이터 / Visa data */
export interface VisaData {
  visaType: string;
  visaSubType: string;
  arcNumber: string;
  expiryDate: string;
  arcFrontImage: string | null;
  arcBackImage: string | null;
  ocrStatus: 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR';
}

/** Step 3: 한국어 능력 데이터 / Korean language data */
export interface KoreanLanguageData {
  testType: KoreanTestType | null;
  testLevel: string;
  certificateImage: string | null;
  conversationLevel: ConversationLevel | null;
}

/** Step 4: 학력 항목 / Education entry */
/** 교육기관 유형 / Institution type */
export enum InstitutionType {
  UNIVERSITY = 'UNIVERSITY',
  COLLEGE = 'COLLEGE',
  GRADUATE_SCHOOL = 'GRADUATE_SCHOOL',
  LANGUAGE_INSTITUTE = 'LANGUAGE_INSTITUTE',
  VOCATIONAL_SCHOOL = 'VOCATIONAL_SCHOOL',
}

export interface EducationEntry {
  id: string;
  schoolName: string;
  major: string;
  degree: DegreeType | null;
  enrollmentStatus: EnrollmentStatus | null;
  startDate: string;
  endDate: string;
  country: string;
  /** 졸업/재학 증명서 이미지 URL / Certificate image URL (graduation or enrollment) */
  certificateImage: string | null;
  /** 교육기관 유형 / Institution type */
  institutionType: InstitutionType | null;
  /** 교육기관 ID (국내 대학/어학당만) / Institution ID (Korean institutions only) */
  institutionId: number | null;
  /** 학교 주소 (자동 조회) / School address (auto-retrieved) */
  schoolAddress?: string;
}

/** Step 4: 학력 데이터 / Education data */
export interface EducationData {
  entries: EducationEntry[];
}

/** Step 5: DELTA 추가 필드 데이터 / DELTA additional field data */
export interface DeltaFieldConfig {
  key: string;
  label: string;
  labelEn: string;
  type: 'text' | 'select' | 'number' | 'date' | 'checkbox';
  options?: { value: string; label: string; labelEn: string }[];
  required: boolean;
  placeholder?: string;
}

/** Step 5: DELTA 데이터 / DELTA data */
export interface DeltaData {
  fields: Record<string, string | boolean | number>;
}

/** Step 6: 경력 항목 / Experience entry */
export interface ExperienceEntry {
  id: string;
  companyName: string;
  position: string;
  department: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

/** Step 6: 경력 데이터 / Experience data */
export interface ExperienceData {
  hasExperience: boolean;
  entries: ExperienceEntry[];
  /** 이력서 파일 URL / Resume file URL */
  resumeFile: string | null;
  /** 외부 포트폴리오 링크 / External portfolio link */
  portfolioLink: string;
}

/** Step 7: 희망 근무조건 데이터 / Work preference data */
export interface PreferencesData {
  employmentTypes: EmploymentType[];
  industries: string[];
  regions: string[];
  salaryType: SalaryType | null;
  salaryMin: number;
  salaryMax: number;
  introduction: string;
}

/** 위저드 전체 데이터 / Complete wizard data */
export interface WizardData {
  step0: ResidencyData;
  step1: IdentityData;
  step2: VisaData;
  step3: KoreanLanguageData;
  step4: EducationData;
  step5: DeltaData;
  step6: ExperienceData;
  step7: PreferencesData;
}

/** 위저드 완성도 / Wizard completion status */
export interface WizardCompletion {
  totalPercent: number;
  steps: {
    step: number;
    label: string;
    labelEn: string;
    percent: number;
    isComplete: boolean;
  }[];
}

/** 뱃지 정보 / Badge information */
export interface BadgeInfo {
  id: string;
  label: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  status: BadgeStatus;
  description: string;
  descriptionEn: string;
}

/** 자동저장 상태 / Auto-save status */
export type AutoSaveStatus = 'IDLE' | 'SAVING' | 'SAVED' | 'ERROR';

/** Step 메타 정보 / Step meta information */
export interface StepMeta {
  step: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
}
