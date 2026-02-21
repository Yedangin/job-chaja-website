/**
 * 위저드 타입 정의 / Wizard type definitions
 * 시커 프로필 위저드의 블록(스텝), 상태, 뱃지 등 타입
 * Block (step), status, badge types for seeker profile wizard
 */

/** 블록 완료 상태 / Block completion status */
export type BlockStatus = 'not_started' | 'in_progress' | 'completed';

/** 뱃지 종류 / Badge types */
export type BadgeType =
  | 'identity_verified'    // 신원 인증 완료 / Identity verified
  | 'visa_confirmed'       // 비자 확인 완료 / Visa confirmed
  | 'topik_certified'      // TOPIK 인증 / TOPIK certified
  | 'experienced'          // 경력 보유 / Has experience
  | 'premium_seeker';      // 프리미엄 구직자 / Premium seeker

/** 뱃지 상태 / Badge status */
export type BadgeStatus = 'earned' | 'in_progress' | 'locked';

/** 뱃지 데이터 / Badge data */
export interface WizardBadge {
  type: BadgeType;
  label: string;         // 한글 라벨 / Korean label
  labelEn: string;       // 영문 라벨 / English label
  status: BadgeStatus;
  color: string;         // 테마 색상 / Theme color (tailwind class prefix)
}

/** 개별 블록(스텝) 정보 / Individual block (step) info */
export interface WizardBlock {
  step: number;          // 스텝 번호 (1~7) / Step number
  key: string;           // 고유 키 / Unique key
  name: string;          // 한글 이름 / Korean name
  nameEn: string;        // 영문 이름 / English name
  icon: string;          // 아이콘 이름 (lucide) / Icon name (lucide)
  status: BlockStatus;
  completionPercent: number; // 0~100 완성도 / Completion percentage
  description: string;   // 한글 설명 / Korean description
  descriptionEn: string; // 영문 설명 / English description
  isLocked: boolean;     // 잠김 여부 (의존성 미충족) / Locked (dependency not met)
  lockReason?: string;   // 잠김 사유 / Lock reason
}

/** 거주 유형 (Step 0) / Residency type (Step 0) */
export type ResidencyType = 'domestic' | 'overseas';

/** 위저드 전체 상태 / Wizard overall state */
export interface WizardState {
  residencyType: ResidencyType | null; // Step 0 선택 / Step 0 selection
  hasCompletedResidency: boolean;      // Step 0 완료 여부 / Step 0 completed
  blocks: WizardBlock[];               // 7개 블록 / 7 blocks
  badges: WizardBadge[];               // 5개 뱃지 / 5 badges
  overallCompletion: number;           // 전체 완성도 0~100 / Overall completion
}

/** API 응답: 위저드 상태 / API response: wizard state */
export interface WizardCompletionResponse {
  overallCompletion: number;
  steps: {
    step: number;
    status: BlockStatus;
    completionPercent: number;
  }[];
  badges: {
    type: BadgeType;
    status: BadgeStatus;
  }[];
  residencyType: ResidencyType | null;
}

/** API 요청: 스텝 데이터 저장 / API request: step data save */
export interface WizardStepSaveRequest {
  step: number;
  data: Record<string, unknown>;
}

/** Step 2 비자 폼 데이터 / Step 2 visa form data */
export interface VisaFormData {
  visaType: string;           // 비자 유형 코드 / Visa type code
  visaStatus: string;         // 체류 상태 / Residency status
  visaExpiry: string;         // 만료일 / Expiry date
  canWorkLegally: boolean;    // 합법 취업 가능 여부 / Legally allowed to work
  workRestrictions: string;   // 취업 제한 사항 / Work restrictions
  reentryPermit: boolean;     // 재입국 허가 / Re-entry permit
}

/** Step 5 DELTA 폼 데이터 / Step 5 DELTA form data */
export interface DeltaFormData {
  technicalSkills: string[];  // 기술 스킬 목록 / Technical skills
  languageScores: {
    topik: number;            // TOPIK 등급 (0~6) / TOPIK level
    kiip: number;             // KIIP 단계 (0~5) / KIIP stage
    sejong: number;           // 세종학당 레벨 / Sejong Institute level
  };
  certifications: string[];   // 자격증 목록 / Certification list
  specialAbilities: string;   // 특기 사항 / Special abilities
}

/** Step 7 희망조건 폼 데이터 / Step 7 preferences form data */
export interface PreferencesFormData {
  desiredJobTypes: string[];      // 희망 업종 / Desired job types
  desiredRegions: string[];       // 희망 지역 / Desired regions
  minSalary: number;              // 최소 희망 급여 / Minimum desired salary
  maxSalary: number;              // 최대 희망 급여 / Maximum desired salary
  salaryType: 'hourly' | 'monthly' | 'annual'; // 급여 유형 / Salary type
  availableFrom: string;          // 근무 가능 시작일 / Available from date
  workSchedulePreference: string; // 근무 일정 선호 / Work schedule preference
  commutePossible: boolean;       // 출퇴근 가능 여부 / Commutable
  relocationPossible: boolean;    // 이주 가능 여부 / Relocation possible
}
