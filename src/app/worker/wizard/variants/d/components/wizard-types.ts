/**
 * 위저드 공통 타입 정의 / Wizard shared type definitions
 *
 * 모든 위저드 컴포넌트에서 공유하는 타입
 * Types shared across all wizard components
 */

/** 위저드 스텝 정의 / Wizard step definition */
export interface WizardStep {
  /** 스텝 인덱스 / Step index */
  index: number;
  /** 스텝 라벨 (한글) / Step label (Korean) */
  label: string;
  /** 스텝 영문 라벨 / Step label (English) */
  labelEn: string;
  /** 아이콘 키 / Icon key */
  iconKey: string;
}

/** 위저드 8 스텝 목록 / Wizard 8-step list */
export const WIZARD_STEPS: WizardStep[] = [
  { index: 0, label: '거주 정보', labelEn: 'Residency', iconKey: 'home' },
  { index: 1, label: '신원 정보', labelEn: 'Identity', iconKey: 'user' },
  { index: 2, label: '비자/체류', labelEn: 'Visa', iconKey: 'id-card' },
  { index: 3, label: '한국어', labelEn: 'Korean', iconKey: 'languages' },
  { index: 4, label: '학력', labelEn: 'Education', iconKey: 'graduation-cap' },
  { index: 5, label: 'DELTA', labelEn: 'DELTA Eval', iconKey: 'bar-chart' },
  { index: 6, label: '경력', labelEn: 'Experience', iconKey: 'briefcase' },
  { index: 7, label: '희망 조건', labelEn: 'Preferences', iconKey: 'target' },
];

/** 뱃지 타입 / Badge type */
export interface WizardBadge {
  /** 뱃지 ID / Badge ID */
  id: string;
  /** 뱃지 라벨 / Badge label */
  label: string;
  /** 뱃지 색상 / Badge color: green=완료, amber=조건부, blue=활성, gray=미획득 */
  color: 'green' | 'amber' | 'blue' | 'gray';
}

/** 위저드 폼 전체 데이터 / Wizard form complete data */
export interface WizardFormData {
  // Step 0: 거주 정보 / Residency
  residencyType?: string;
  residenceSido?: string;
  residenceSigungu?: string;
  residenceDetail?: string;
  phoneNumber?: string;

  // Step 1: 신원 정보 / Identity
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDate?: string;
  nationality?: string;

  // Step 2: 비자/체류 / Visa
  visaType?: string;
  visaSubType?: string;
  foreignRegistrationNumber?: string;
  visaExpiryDate?: string;
  arcFile?: string;

  // Step 3: 한국어 / Korean
  topikLevel?: number;
  koreanAbility?: string;
  kiipLevel?: number;
  sejongLevel?: number;

  // Step 4: 학력 / Education
  educationLevel?: string;
  schoolName?: string;
  major?: string;
  graduationStatus?: string;
  graduationYear?: number;

  // Step 5: DELTA / DELTA evaluation
  deltaScore?: number;
  deltaCategory?: string;
  deltaCertFile?: string;

  // Step 6: 경력 / Experience
  totalExperienceYears?: number;
  experienceField?: string;
  experiences?: ExperienceEntry[];

  // Step 7: 희망 조건 / Preferences
  desiredJobType?: string;
  desiredSido?: string;
  desiredSalaryMin?: number;
  desiredSalaryMax?: number;
  desiredWorkDays?: string[];
  availableStartDate?: string;
}

/** 경력 항목 / Experience entry */
export interface ExperienceEntry {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

/** Mock 비자 목록 / Mock visa list */
export const VISA_TYPES = [
  { code: 'D-2', name: '유학', subTypes: [
    { code: 'D-2-1', name: '전문학사' },
    { code: 'D-2-2', name: '학사' },
    { code: 'D-2-3', name: '석사' },
    { code: 'D-2-4', name: '박사' },
    { code: 'D-2-6', name: '교환학생' },
    { code: 'D-2-8', name: '단기과정' },
  ]},
  { code: 'D-4', name: '일반연수', subTypes: [
    { code: 'D-4-1', name: '어학연수' },
    { code: 'D-4-7', name: '외국어연수' },
  ]},
  { code: 'D-10', name: '구직', subTypes: [
    { code: 'D-10-1', name: '구직(일반)' },
    { code: 'D-10-2', name: '구직(기술)' },
  ]},
  { code: 'E-7', name: '특정활동', subTypes: [
    { code: 'E-7-1', name: '전문인력' },
    { code: 'E-7-4', name: '준전문인력' },
  ]},
  { code: 'E-9', name: '비전문취업', subTypes: [
    { code: 'E-9-1', name: '제조업' },
    { code: 'E-9-2', name: '건설업' },
    { code: 'E-9-3', name: '농축산업' },
  ]},
  { code: 'F-2', name: '거주', subTypes: [
    { code: 'F-2-7', name: '점수제' },
    { code: 'F-2-99', name: '기타' },
  ]},
  { code: 'F-4', name: '재외동포', subTypes: [] },
  { code: 'F-5', name: '영주', subTypes: [] },
  { code: 'F-6', name: '결혼이민', subTypes: [] },
  { code: 'H-1', name: '관광취업', subTypes: [] },
  { code: 'H-2', name: '방문취업', subTypes: [] },
];

/** 시/도 목록 / Province list */
export const SIDO_LIST = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시',
  '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
  '경기도', '강원도', '충청북도', '충청남도',
  '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도',
];

/** 국적 목록 / Nationality list */
export const NATIONALITIES = [
  '베트남', '중국', '인도네시아', '태국', '필리핀',
  '미얀마', '캄보디아', '네팔', '방글라데시', '우즈베키스탄',
  '미국', '캐나다', '일본', '러시아', '기타',
];

/** 학력 수준 / Education levels */
export const EDUCATION_LEVELS = [
  '고등학교 졸업', '전문학사', '학사', '석사', '박사',
];
