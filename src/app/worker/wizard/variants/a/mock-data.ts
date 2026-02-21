/**
 * 위저드 목업 데이터 / Wizard mock data
 * 실제 API 연동 전 프론트엔드 개발용 더미 데이터
 * Dummy data for frontend development before actual API integration
 */

import { BadgeStatus } from './types';
import type {
  WizardData,
  WizardCompletion,
  BadgeInfo,
  StepMeta,
  DeltaFieldConfig,
} from './types';

/** Step 메타 정보 목록 / Step meta information list */
export const STEP_META: StepMeta[] = [
  {
    step: 0,
    title: '거주 상태',
    titleEn: 'Residency',
    description: '현재 거주 상태를 선택해주세요',
    descriptionEn: 'Select your current residency status',
    icon: 'Globe',
  },
  {
    step: 1,
    title: '기본 신원',
    titleEn: 'Identity',
    description: '기본 인적사항을 입력해주세요',
    descriptionEn: 'Enter your basic personal information',
    icon: 'User',
  },
  {
    step: 2,
    title: '비자/체류',
    titleEn: 'Visa',
    description: '비자 및 체류 정보를 입력해주세요',
    descriptionEn: 'Enter your visa and stay information',
    icon: 'CreditCard',
  },
  {
    step: 3,
    title: '한국어',
    titleEn: 'Korean',
    description: '한국어 능력을 입력해주세요',
    descriptionEn: 'Enter your Korean language ability',
    icon: 'Languages',
  },
  {
    step: 4,
    title: '학력',
    titleEn: 'Education',
    description: '학력 정보를 입력해주세요',
    descriptionEn: 'Enter your education history',
    icon: 'GraduationCap',
  },
  {
    step: 5,
    title: '추가 정보',
    titleEn: 'Additional',
    description: '비자 유형에 따른 추가 정보를 입력해주세요',
    descriptionEn: 'Enter additional info based on your visa type',
    icon: 'FileText',
  },
  {
    step: 6,
    title: '경력',
    titleEn: 'Experience',
    description: '경력 정보를 입력해주세요',
    descriptionEn: 'Enter your work experience',
    icon: 'Briefcase',
  },
  {
    step: 7,
    title: '희망 조건',
    titleEn: 'Preferences',
    description: '희망하는 근무 조건을 입력해주세요',
    descriptionEn: 'Enter your preferred working conditions',
    icon: 'Heart',
  },
];

/** 위저드 초기 데이터 / Wizard initial data */
export const INITIAL_WIZARD_DATA: WizardData = {
  step0: {
    residencyStatus: null,
  },
  step1: {
    firstName: '',
    lastName: '',
    nationality: '',
    birthDate: '',
    gender: null,
    phone: '',
    email: '',
    profilePhoto: null,
    address: '',
    addressDetail: '',
  },
  step2: {
    visaType: '',
    visaSubType: '',
    arcNumber: '',
    expiryDate: '',
    arcFrontImage: null,
    arcBackImage: null,
    ocrStatus: 'IDLE',
  },
  step3: {
    testType: null,
    testLevel: '',
    certificateImage: null,
    conversationLevel: null,
  },
  step4: {
    entries: [],
  },
  step5: {
    fields: {},
  },
  step6: {
    hasExperience: false,
    entries: [],
    resumeFile: null,
    portfolioLink: '',
  },
  step7: {
    employmentTypes: [],
    industries: [],
    regions: [],
    salaryType: null,
    salaryMin: 0,
    salaryMax: 0,
    introduction: '',
  },
};

/** 목업 완성도 데이터 / Mock completion data */
export const MOCK_COMPLETION: WizardCompletion = {
  totalPercent: 0,
  steps: STEP_META.map((meta) => ({
    step: meta.step,
    label: meta.title,
    labelEn: meta.titleEn,
    percent: 0,
    isComplete: false,
  })),
};

/** 국적 목록 / Nationality list */
export const NATIONALITY_OPTIONS: { value: string; label: string; labelEn: string }[] = [
  { value: 'CN', label: '중국', labelEn: 'China' },
  { value: 'VN', label: '베트남', labelEn: 'Vietnam' },
  { value: 'TH', label: '태국', labelEn: 'Thailand' },
  { value: 'PH', label: '필리핀', labelEn: 'Philippines' },
  { value: 'ID', label: '인도네시아', labelEn: 'Indonesia' },
  { value: 'UZ', label: '우즈베키스탄', labelEn: 'Uzbekistan' },
  { value: 'KH', label: '캄보디아', labelEn: 'Cambodia' },
  { value: 'NP', label: '네팔', labelEn: 'Nepal' },
  { value: 'MM', label: '미얀마', labelEn: 'Myanmar' },
  { value: 'LK', label: '스리랑카', labelEn: 'Sri Lanka' },
  { value: 'BD', label: '방글라데시', labelEn: 'Bangladesh' },
  { value: 'MN', label: '몽골', labelEn: 'Mongolia' },
  { value: 'JP', label: '일본', labelEn: 'Japan' },
  { value: 'US', label: '미국', labelEn: 'USA' },
  { value: 'RU', label: '러시아', labelEn: 'Russia' },
  { value: 'OTHER', label: '기타', labelEn: 'Other' },
];

/** 비자 유형 목록 / Visa type list */
export const VISA_TYPE_OPTIONS: { value: string; label: string; labelEn: string; subTypes: { value: string; label: string; labelEn: string }[] }[] = [
  {
    value: 'E-9',
    label: 'E-9 비전문취업',
    labelEn: 'E-9 Non-professional Employment',
    subTypes: [
      { value: 'E-9-1', label: '제조업', labelEn: 'Manufacturing' },
      { value: 'E-9-2', label: '건설업', labelEn: 'Construction' },
      { value: 'E-9-3', label: '농축산업', labelEn: 'Agriculture' },
      { value: 'E-9-4', label: '어업', labelEn: 'Fisheries' },
      { value: 'E-9-5', label: '서비스업', labelEn: 'Service' },
    ],
  },
  {
    value: 'E-7',
    label: 'E-7 특정활동',
    labelEn: 'E-7 Specific Activities',
    subTypes: [
      { value: 'E-7-1', label: '전문인력', labelEn: 'Professional' },
      { value: 'E-7-4', label: '준전문인력', labelEn: 'Semi-professional' },
    ],
  },
  {
    value: 'H-2',
    label: 'H-2 방문취업',
    labelEn: 'H-2 Working Visit',
    subTypes: [
      { value: 'H-2-1', label: '연고지 방문', labelEn: 'Relative visit' },
      { value: 'H-2-7', label: '자유 방문', labelEn: 'Free visit' },
    ],
  },
  {
    value: 'F-2',
    label: 'F-2 거주',
    labelEn: 'F-2 Residence',
    subTypes: [
      { value: 'F-2-1', label: '가족동거', labelEn: 'Family cohabitation' },
      { value: 'F-2-7', label: '점수제', labelEn: 'Points-based' },
      { value: 'F-2-99', label: '기타', labelEn: 'Other' },
    ],
  },
  {
    value: 'F-4',
    label: 'F-4 재외동포',
    labelEn: 'F-4 Overseas Korean',
    subTypes: [
      { value: 'F-4-1', label: '대한민국 국적', labelEn: 'Korean nationality' },
      { value: 'F-4-2', label: '외국 국적', labelEn: 'Foreign nationality' },
    ],
  },
  {
    value: 'F-5',
    label: 'F-5 영주',
    labelEn: 'F-5 Permanent Residence',
    subTypes: [
      { value: 'F-5-1', label: '일반영주', labelEn: 'General' },
    ],
  },
  {
    value: 'F-6',
    label: 'F-6 결혼이민',
    labelEn: 'F-6 Marriage Migration',
    subTypes: [
      { value: 'F-6-1', label: '국민의 배우자', labelEn: 'Spouse of Korean national' },
    ],
  },
  {
    value: 'D-10',
    label: 'D-10 구직',
    labelEn: 'D-10 Job Seeking',
    subTypes: [
      { value: 'D-10-1', label: '구직활동', labelEn: 'Job seeking' },
    ],
  },
  {
    value: 'D-2',
    label: 'D-2 유학',
    labelEn: 'D-2 Student',
    subTypes: [
      { value: 'D-2-1', label: '전문학사', labelEn: 'Associate degree' },
      { value: 'D-2-2', label: '학사', labelEn: 'Bachelor degree' },
      { value: 'D-2-3', label: '석사', labelEn: 'Master degree' },
      { value: 'D-2-4', label: '박사', labelEn: 'Doctorate degree' },
    ],
  },
  {
    value: 'D-4',
    label: 'D-4 일반연수',
    labelEn: 'D-4 General Training',
    subTypes: [
      { value: 'D-4-1', label: '어학연수', labelEn: 'Language training' },
    ],
  },
];

/** 뱃지 목록 / Badge list */
export const BADGES: BadgeInfo[] = [
  {
    id: 'profile',
    label: '프로필 완성',
    labelEn: 'Profile Complete',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    status: BadgeStatus.LOCKED,
    description: '모든 필수 항목 입력 시 자동 부여',
    descriptionEn: 'Automatically granted when all required fields are filled',
  },
  {
    id: 'identity',
    label: '신원 확인',
    labelEn: 'Identity Verified',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    status: BadgeStatus.LOCKED,
    description: '관리자 확인 후 부여',
    descriptionEn: 'Granted after admin verification',
  },
  {
    id: 'education',
    label: '학력 인증',
    labelEn: 'Education Verified',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    status: BadgeStatus.LOCKED,
    description: '관리자 확인 후 부여',
    descriptionEn: 'Granted after admin verification',
  },
  {
    id: 'korean',
    label: '한국어 인증',
    labelEn: 'Korean Verified',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    status: BadgeStatus.LOCKED,
    description: '관리자 확인 후 부여',
    descriptionEn: 'Granted after admin verification',
  },
  {
    id: 'employable',
    label: '취업 가능',
    labelEn: 'Employable',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    status: BadgeStatus.LOCKED,
    description: '시스템+관리자 확인 후 부여',
    descriptionEn: 'Granted after system + admin verification',
  },
];

/** 비자별 DELTA 필드 설정 / Visa-specific DELTA field configurations */
export const DELTA_FIELD_CONFIGS: Record<string, DeltaFieldConfig[]> = {
  'E-9': [
    {
      key: 'eps_training',
      label: 'EPS-TOPIK 이수 여부',
      labelEn: 'EPS-TOPIK Completion',
      type: 'checkbox',
      required: true,
    },
    {
      key: 'eps_score',
      label: 'EPS-TOPIK 점수',
      labelEn: 'EPS-TOPIK Score',
      type: 'number',
      required: false,
      placeholder: '0 ~ 200',
    },
    {
      key: 'assigned_industry',
      label: '배정 업종',
      labelEn: 'Assigned Industry',
      type: 'select',
      required: true,
      options: [
        { value: 'MANUFACTURING', label: '제조업', labelEn: 'Manufacturing' },
        { value: 'CONSTRUCTION', label: '건설업', labelEn: 'Construction' },
        { value: 'AGRICULTURE', label: '농축산업', labelEn: 'Agriculture' },
        { value: 'FISHERY', label: '어업', labelEn: 'Fisheries' },
        { value: 'SERVICE', label: '서비스업', labelEn: 'Service' },
      ],
    },
    {
      key: 'workplace_change_count',
      label: '사업장 변경 횟수',
      labelEn: 'Workplace Change Count',
      type: 'number',
      required: true,
      placeholder: '0',
    },
  ],
  'E-7': [
    {
      key: 'occupation_code',
      label: '직종코드',
      labelEn: 'Occupation Code',
      type: 'text',
      required: true,
      placeholder: '예: 1311',
    },
    {
      key: 'qualification_name',
      label: '보유 자격증',
      labelEn: 'Qualification Name',
      type: 'text',
      required: false,
      placeholder: '자격증명 입력',
    },
    {
      key: 'work_experience_years',
      label: '관련 경력(년)',
      labelEn: 'Related Experience (years)',
      type: 'number',
      required: true,
      placeholder: '0',
    },
    {
      key: 'annual_salary',
      label: '연봉(만원)',
      labelEn: 'Annual Salary (10K KRW)',
      type: 'number',
      required: false,
      placeholder: '0',
    },
  ],
  'H-2': [
    {
      key: 'employment_training',
      label: '취업교육 이수 여부',
      labelEn: 'Employment Training Completion',
      type: 'checkbox',
      required: true,
    },
    {
      key: 'special_employment_permit',
      label: '특례고용허가서 보유',
      labelEn: 'Special Employment Permit',
      type: 'checkbox',
      required: false,
    },
  ],
  'F-2': [
    {
      key: 'points_score',
      label: '점수제 총점',
      labelEn: 'Points Total Score',
      type: 'number',
      required: false,
      placeholder: '0 ~ 120',
    },
    {
      key: 'residence_years',
      label: '국내 체류 기간(년)',
      labelEn: 'Domestic Stay Period (years)',
      type: 'number',
      required: true,
      placeholder: '0',
    },
  ],
  'D-2': [
    {
      key: 'university_name',
      label: '재학 대학명',
      labelEn: 'University Name',
      type: 'text',
      required: true,
      placeholder: '대학명 입력',
    },
    {
      key: 'weekly_work_hours',
      label: '주당 근로 가능 시간',
      labelEn: 'Weekly Available Work Hours',
      type: 'select',
      required: true,
      options: [
        { value: '20', label: '학기 중 20시간', labelEn: '20h during semester' },
        { value: 'UNLIMITED', label: '방학 중 무제한', labelEn: 'Unlimited during vacation' },
      ],
    },
    {
      key: 'part_time_permit',
      label: '시간제 취업허가 보유',
      labelEn: 'Part-time Work Permit',
      type: 'checkbox',
      required: true,
    },
  ],
};

/** 업종 목록 / Industry list */
export const INDUSTRY_OPTIONS: { value: string; label: string; labelEn: string }[] = [
  { value: 'MANUFACTURING', label: '제조업', labelEn: 'Manufacturing' },
  { value: 'CONSTRUCTION', label: '건설업', labelEn: 'Construction' },
  { value: 'AGRICULTURE', label: '농축산업', labelEn: 'Agriculture' },
  { value: 'FISHERY', label: '어업', labelEn: 'Fisheries' },
  { value: 'RESTAURANT', label: '음식점업', labelEn: 'Restaurant' },
  { value: 'ACCOMMODATION', label: '숙박업', labelEn: 'Accommodation' },
  { value: 'RETAIL', label: '소매업', labelEn: 'Retail' },
  { value: 'LOGISTICS', label: '물류/운송', labelEn: 'Logistics' },
  { value: 'CLEANING', label: '청소/미화', labelEn: 'Cleaning' },
  { value: 'CARE', label: '돌봄/간병', labelEn: 'Care' },
  { value: 'IT', label: 'IT/소프트웨어', labelEn: 'IT/Software' },
  { value: 'EDUCATION', label: '교육', labelEn: 'Education' },
  { value: 'OTHER', label: '기타', labelEn: 'Other' },
];

/** 지역 목록 / Region list */
export const REGION_OPTIONS: { value: string; label: string; labelEn: string }[] = [
  { value: 'SEOUL', label: '서울', labelEn: 'Seoul' },
  { value: 'GYEONGGI', label: '경기', labelEn: 'Gyeonggi' },
  { value: 'INCHEON', label: '인천', labelEn: 'Incheon' },
  { value: 'BUSAN', label: '부산', labelEn: 'Busan' },
  { value: 'DAEGU', label: '대구', labelEn: 'Daegu' },
  { value: 'DAEJEON', label: '대전', labelEn: 'Daejeon' },
  { value: 'GWANGJU', label: '광주', labelEn: 'Gwangju' },
  { value: 'ULSAN', label: '울산', labelEn: 'Ulsan' },
  { value: 'SEJONG', label: '세종', labelEn: 'Sejong' },
  { value: 'GANGWON', label: '강원', labelEn: 'Gangwon' },
  { value: 'CHUNGBUK', label: '충북', labelEn: 'Chungbuk' },
  { value: 'CHUNGNAM', label: '충남', labelEn: 'Chungnam' },
  { value: 'JEONBUK', label: '전북', labelEn: 'Jeonbuk' },
  { value: 'JEONNAM', label: '전남', labelEn: 'Jeonnam' },
  { value: 'GYEONGBUK', label: '경북', labelEn: 'Gyeongbuk' },
  { value: 'GYEONGNAM', label: '경남', labelEn: 'Gyeongnam' },
  { value: 'JEJU', label: '제주', labelEn: 'Jeju' },
  { value: 'ANYWHERE', label: '전국 어디든', labelEn: 'Anywhere' },
];
