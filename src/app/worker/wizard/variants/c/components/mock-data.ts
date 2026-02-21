/**
 * 위저드 목 데이터 / Wizard mock data
 * API 연동 전 목업 데이터. 실제 연동 시 API 호출로 교체
 * Mock data before API integration. Replace with API calls when integrating.
 */

import type {
  WizardBlock,
  WizardBadge,
  WizardState,
  WizardCompletionResponse,
} from './wizard-types';

/** 7개 블록 초기 목업 / 7 blocks initial mock */
export const MOCK_BLOCKS: WizardBlock[] = [
  {
    step: 1,
    key: 'identity',
    name: '신원정보',
    nameEn: 'Identity',
    icon: 'UserCircle',
    status: 'completed',
    completionPercent: 100,
    description: '이름, 생년월일, 국적, 연락처',
    descriptionEn: 'Name, DOB, nationality, contact',
    isLocked: false,
  },
  {
    step: 2,
    key: 'visa',
    name: '비자정보',
    nameEn: 'Visa Info',
    icon: 'Shield',
    status: 'completed',
    completionPercent: 100,
    description: '비자 유형, 만료일, 취업 가능 여부',
    descriptionEn: 'Visa type, expiry, work eligibility',
    isLocked: false,
  },
  {
    step: 3,
    key: 'korean',
    name: '한국어능력',
    nameEn: 'Korean',
    icon: 'Languages',
    status: 'in_progress',
    completionPercent: 60,
    description: 'TOPIK, KIIP, 세종학당 점수',
    descriptionEn: 'TOPIK, KIIP, Sejong Institute scores',
    isLocked: false,
  },
  {
    step: 4,
    key: 'education',
    name: '학력',
    nameEn: 'Education',
    icon: 'GraduationCap',
    status: 'not_started',
    completionPercent: 0,
    description: '최종학력, 전공, 졸업연도',
    descriptionEn: 'Degree, major, graduation year',
    isLocked: false,
  },
  {
    step: 5,
    key: 'delta',
    name: 'DELTA',
    nameEn: 'DELTA Score',
    icon: 'Zap',
    status: 'not_started',
    completionPercent: 0,
    description: '기술, 자격증, 특기사항 평가',
    descriptionEn: 'Skills, certifications, special abilities',
    isLocked: false,  // Step 2 완료됨 / Step 2 completed
  },
  {
    step: 6,
    key: 'career',
    name: '경력',
    nameEn: 'Career',
    icon: 'Briefcase',
    status: 'not_started',
    completionPercent: 0,
    description: '이전 직장, 직무 경험',
    descriptionEn: 'Previous jobs, work experience',
    isLocked: false,
  },
  {
    step: 7,
    key: 'preferences',
    name: '희망조건',
    nameEn: 'Preferences',
    icon: 'Settings',
    status: 'not_started',
    completionPercent: 0,
    description: '희망 업종, 지역, 급여, 일정',
    descriptionEn: 'Desired industry, region, salary, schedule',
    isLocked: false,
  },
];

/** 5개 뱃지 목업 / 5 badges mock */
export const MOCK_BADGES: WizardBadge[] = [
  {
    type: 'identity_verified',
    label: '신원인증',
    labelEn: 'ID Verified',
    status: 'earned',
    color: 'green',
  },
  {
    type: 'visa_confirmed',
    label: '비자확인',
    labelEn: 'Visa OK',
    status: 'in_progress',
    color: 'blue',
  },
  {
    type: 'topik_certified',
    label: 'TOPIK',
    labelEn: 'TOPIK',
    status: 'locked',
    color: 'purple',
  },
  {
    type: 'experienced',
    label: '경력보유',
    labelEn: 'Experienced',
    status: 'locked',
    color: 'amber',
  },
  {
    type: 'premium_seeker',
    label: '프리미엄',
    labelEn: 'Premium',
    status: 'locked',
    color: 'rose',
  },
];

/** 전체 위저드 상태 목업 / Overall wizard state mock */
export const MOCK_WIZARD_STATE: WizardState = {
  residencyType: 'domestic',
  hasCompletedResidency: true,
  blocks: MOCK_BLOCKS,
  badges: MOCK_BADGES,
  overallCompletion: 42,
};

/** API 완성도 응답 목업 / API completion response mock */
export const MOCK_COMPLETION_RESPONSE: WizardCompletionResponse = {
  overallCompletion: 42,
  steps: MOCK_BLOCKS.map((b) => ({
    step: b.step,
    status: b.status,
    completionPercent: b.completionPercent,
  })),
  badges: MOCK_BADGES.map((b) => ({
    type: b.type,
    status: b.status,
  })),
  residencyType: 'domestic',
};

/** 비자 유형 목록 (Step 2 셀렉트용) / Visa type list (for Step 2 select) */
export const VISA_TYPES = [
  { code: 'E-9', label: '비전문취업 (E-9)', labelEn: 'Non-professional Employment' },
  { code: 'E-7', label: '특정활동 (E-7)', labelEn: 'Specially Designated Activities' },
  { code: 'H-2', label: '방문취업 (H-2)', labelEn: 'Working Visit' },
  { code: 'F-4', label: '재외동포 (F-4)', labelEn: 'Overseas Korean' },
  { code: 'F-2', label: '거주 (F-2)', labelEn: 'Residence' },
  { code: 'F-5', label: '영주 (F-5)', labelEn: 'Permanent Residence' },
  { code: 'F-6', label: '결혼이민 (F-6)', labelEn: 'Marriage Migration' },
  { code: 'D-10', label: '구직 (D-10)', labelEn: 'Job Seeking' },
  { code: 'D-2', label: '유학 (D-2)', labelEn: 'Study Abroad' },
  { code: 'D-4', label: '일반연수 (D-4)', labelEn: 'General Training' },
  { code: 'C-4', label: '단기취업 (C-4)', labelEn: 'Short-term Employment' },
  { code: 'E-1', label: '교수 (E-1)', labelEn: 'Professor' },
  { code: 'E-2', label: '회화지도 (E-2)', labelEn: 'Foreign Language Instructor' },
  { code: 'E-3', label: '연구 (E-3)', labelEn: 'Research' },
  { code: 'E-4', label: '기술지도 (E-4)', labelEn: 'Technology Transfer' },
  { code: 'E-5', label: '전문직업 (E-5)', labelEn: 'Professional Employment' },
  { code: 'E-6', label: '예술흥행 (E-6)', labelEn: 'Arts/Entertainment' },
  { code: 'E-10', label: '선원취업 (E-10)', labelEn: 'Crew Employment' },
] as const;

/** 기술 스킬 목록 (Step 5 DELTA용) / Technical skills list (for Step 5 DELTA) */
export const TECHNICAL_SKILLS = [
  { code: 'WELDING', label: '용접', labelEn: 'Welding' },
  { code: 'FORKLIFT', label: '지게차', labelEn: 'Forklift' },
  { code: 'CNC', label: 'CNC 가공', labelEn: 'CNC Machining' },
  { code: 'COOKING', label: '조리', labelEn: 'Cooking' },
  { code: 'DRIVING', label: '운전', labelEn: 'Driving' },
  { code: 'CONSTRUCTION', label: '건설', labelEn: 'Construction' },
  { code: 'FARMING', label: '농업', labelEn: 'Farming' },
  { code: 'FISHING', label: '어업', labelEn: 'Fishing' },
  { code: 'SEWING', label: '봉제', labelEn: 'Sewing' },
  { code: 'ELECTRONICS', label: '전자조립', labelEn: 'Electronics Assembly' },
  { code: 'PAINTING', label: '도장', labelEn: 'Painting' },
  { code: 'PLUMBING', label: '배관', labelEn: 'Plumbing' },
] as const;

/** 희망 업종 (Step 7용) / Desired job types (for Step 7) */
export const JOB_TYPE_OPTIONS = [
  { code: 'MANUFACTURING', label: '제조업', labelEn: 'Manufacturing' },
  { code: 'CONSTRUCTION', label: '건설업', labelEn: 'Construction' },
  { code: 'AGRICULTURE', label: '농축산업', labelEn: 'Agriculture' },
  { code: 'FISHING', label: '어업', labelEn: 'Fishing' },
  { code: 'SERVICE', label: '서비스업', labelEn: 'Service' },
  { code: 'FOOD', label: '음식점', labelEn: 'Restaurant' },
  { code: 'RETAIL', label: '판매/유통', labelEn: 'Retail' },
  { code: 'IT', label: 'IT/개발', labelEn: 'IT/Development' },
  { code: 'EDUCATION', label: '교육', labelEn: 'Education' },
  { code: 'LOGISTICS', label: '물류/배송', labelEn: 'Logistics' },
] as const;

/** 희망 지역 (Step 7용) / Desired regions (for Step 7) */
export const REGION_OPTIONS = [
  { code: 'SEOUL', label: '서울', labelEn: 'Seoul' },
  { code: 'GYEONGGI', label: '경기', labelEn: 'Gyeonggi' },
  { code: 'INCHEON', label: '인천', labelEn: 'Incheon' },
  { code: 'BUSAN', label: '부산', labelEn: 'Busan' },
  { code: 'DAEGU', label: '대구', labelEn: 'Daegu' },
  { code: 'DAEJEON', label: '대전', labelEn: 'Daejeon' },
  { code: 'GWANGJU', label: '광주', labelEn: 'Gwangju' },
  { code: 'ULSAN', label: '울산', labelEn: 'Ulsan' },
  { code: 'SEJONG', label: '세종', labelEn: 'Sejong' },
  { code: 'GANGWON', label: '강원', labelEn: 'Gangwon' },
  { code: 'CHUNGBUK', label: '충북', labelEn: 'Chungbuk' },
  { code: 'CHUNGNAM', label: '충남', labelEn: 'Chungnam' },
  { code: 'JEONBUK', label: '전북', labelEn: 'Jeonbuk' },
  { code: 'JEONNAM', label: '전남', labelEn: 'Jeonnam' },
  { code: 'GYEONGBUK', label: '경북', labelEn: 'Gyeongbuk' },
  { code: 'GYEONGNAM', label: '경남', labelEn: 'Gyeongnam' },
  { code: 'JEJU', label: '제주', labelEn: 'Jeju' },
] as const;

/**
 * 목 API 호출: 위저드 상태 조회 / Mock API call: get wizard state
 * GET /individual-profile/wizard/completion
 */
export async function mockFetchWizardCompletion(): Promise<WizardCompletionResponse> {
  // 실제 연동 시 fetch('/api/individual-profile/wizard/completion') 사용
  // Use fetch('/api/individual-profile/wizard/completion') when integrating
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_COMPLETION_RESPONSE), 500);
  });
}

/**
 * 목 API 호출: 스텝 데이터 저장 / Mock API call: save step data
 * PUT /individual-profile/wizard/:step
 */
export async function mockSaveWizardStep(
  step: number,
  data: Record<string, unknown>
): Promise<{ success: boolean; completionPercent: number }> {
  // 실제 연동 시 fetch(`/api/individual-profile/wizard/${step}`, { method: 'PUT', body }) 사용
  // Use fetch(`/api/individual-profile/wizard/${step}`, { method: 'PUT', body }) when integrating
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, completionPercent: 100 }), 800);
  });
}
