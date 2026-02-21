/**
 * 채팅형 위저드 타입 정의 / Chat-style wizard type definitions
 * 시안 B: 대화형 UI 위저드의 모든 타입을 정의합니다.
 */

// === 거주 상태 / Residence status ===
export type ResidenceStatus = 'long_term' | 'short_term' | 'overseas';

// === 성별 / Gender ===
export type Gender = 'male' | 'female' | 'other';

// === 위저드 스텝 / Wizard steps ===
export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// === 채팅 메시지 타입 / Chat message types ===
export type ChatMessageRole = 'bot' | 'user';

// === 채팅 입력 타입 / Chat input types ===
export type ChatInputType =
  | 'choice'        // 선택 버튼 / Choice buttons
  | 'text'          // 텍스트 입력 / Text input
  | 'select'        // 드롭다운 선택 / Dropdown select
  | 'date'          // 날짜 입력 / Date input
  | 'file'          // 파일 업로드 / File upload
  | 'multi-select'  // 복수 선택 / Multiple select
  | 'number'        // 숫자 입력 / Number input
  | 'phone'         // 전화번호 / Phone number
  | 'address'       // 주소 입력 / Address input
  | 'salary-range'  // 급여 범위 / Salary range
  | 'multi-entry'   // 복수 항목 입력 / Multiple entry (학력, 경력 등)
  | 'rating';       // 자가 평가 / Self-rating

// === 선택 옵션 / Choice option ===
export interface ChoiceOption {
  /** 옵션 고유 키 / Unique option key */
  value: string;
  /** 표시 라벨 / Display label */
  label: string;
  /** 이모지 아이콘 / Emoji icon */
  icon?: string;
  /** 부가 설명 / Additional description */
  description?: string;
}

// === 채팅 질문 정의 / Chat question definition ===
export interface ChatQuestion {
  /** 질문 고유 ID / Unique question ID */
  id: string;
  /** 해당 스텝 / Corresponding step */
  step: WizardStep;
  /** 봇 메시지 / Bot message text */
  message: string;
  /** 부가 설명 / Additional sub-message */
  subMessage?: string;
  /** 입력 타입 / Input type */
  inputType: ChatInputType;
  /** 선택 옵션 (choice, select, multi-select일 때) / Options for choice inputs */
  options?: ChoiceOption[];
  /** 텍스트 입력 플레이스홀더 / Placeholder for text inputs */
  placeholder?: string;
  /** 필수 여부 / Required flag */
  required: boolean;
  /** 스킵 가능 여부 / Can skip flag */
  skippable: boolean;
  /** 스킵 버튼 라벨 / Skip button label */
  skipLabel?: string;
  /** 유효성 검사 패턴 / Validation regex pattern */
  validationPattern?: string;
  /** 유효성 검사 오류 메시지 / Validation error message */
  validationMessage?: string;
  /** 조건부 표시 함수 / Conditional display function */
  showIf?: (data: WizardFormData) => boolean;
  /** 데이터 필드 키 / Data field key */
  fieldKey: string;
}

// === 채팅 메시지 / Chat message ===
export interface ChatMessage {
  /** 메시지 고유 ID / Unique message ID */
  id: string;
  /** 발신자 역할 / Sender role */
  role: ChatMessageRole;
  /** 메시지 텍스트 / Message text */
  text: string;
  /** 부가 텍스트 / Sub text */
  subText?: string;
  /** 타임스탬프 / Timestamp */
  timestamp: Date;
  /** 입력 타입 (봇 메시지에서 사용) / Input type for bot messages */
  inputType?: ChatInputType;
  /** 선택 옵션 / Choice options */
  options?: ChoiceOption[];
  /** 플레이스홀더 / Placeholder */
  placeholder?: string;
  /** 필수 여부 / Required */
  required?: boolean;
  /** 스킵 가능 / Skippable */
  skippable?: boolean;
  /** 스킵 라벨 / Skip label */
  skipLabel?: string;
  /** 유효성 검사 패턴 / Validation pattern */
  validationPattern?: string;
  /** 유효성 검사 메시지 / Validation message */
  validationMessage?: string;
  /** 답변 완료 여부 / Answered flag */
  answered?: boolean;
  /** 데이터 필드 키 / Field key */
  fieldKey?: string;
  /** 사용자 답변 값 / User answer value */
  answerValue?: string | string[];
  /** 사용자 답변 표시 텍스트 / User answer display text */
  answerDisplay?: string;
}

// === 학력 항목 / Education entry ===
export interface EducationEntry {
  /** 학교명 / School name */
  schoolName: string;
  /** 전공 / Major */
  major: string;
  /** 학위 (고등학교/전문학사/학사/석사/박사) / Degree level */
  degree: string;
  /** 졸업년도 / Graduation year */
  graduationYear: string;
  /** 국가 / Country */
  country: string;
}

// === 경력 항목 / Career entry ===
export interface CareerEntry {
  /** 회사명 / Company name */
  companyName: string;
  /** 직무 / Position */
  position: string;
  /** 시작일 / Start date */
  startDate: string;
  /** 종료일 / End date */
  endDate: string;
  /** 재직중 여부 / Currently working flag */
  isCurrent: boolean;
  /** 업무 설명 / Job description */
  description: string;
}

// === 위저드 전체 폼 데이터 / Wizard full form data ===
export interface WizardFormData {
  // Step 0: 거주 상태 / Residence status
  residenceStatus: ResidenceStatus | null;

  // Step 1: 기본 신원 / Basic identity
  firstName: string;
  lastName: string;
  nationality: string;
  birthDate: string;
  gender: Gender | null;
  phone: string;
  profilePhoto: string | null;
  address: string;

  // Step 2: 비자/체류 정보 / Visa/residence info
  visaType: string;
  visaSubType: string;
  arcNumber: string;
  visaExpiry: string;
  ocrDocument: string | null;

  // Step 3: 한국어 능력 / Korean language ability
  koreanTestType: string;
  koreanTestLevel: string;
  koreanCertificate: string | null;
  koreanSelfAssessment: number;

  // Step 4: 학력 / Education
  educations: EducationEntry[];

  // Step 5: DELTA (비자별 추가 필드) / DELTA (additional fields by visa)
  deltaFields: Record<string, string>;

  // Step 6: 경력 / Career
  hasCareer: boolean;
  careers: CareerEntry[];

  // Step 7: 희망 근무조건 / Desired work conditions
  desiredJobTypes: string[];
  desiredLocations: string[];
  desiredSalaryMin: number;
  desiredSalaryMax: number;
  availableDate: string;
  workSchedule: string;
}

// === 위저드 상태 / Wizard state ===
export interface WizardState {
  /** 현재 스텝 / Current step */
  currentStep: WizardStep;
  /** 폼 데이터 / Form data */
  formData: WizardFormData;
  /** 채팅 메시지 목록 / Chat messages list */
  messages: ChatMessage[];
  /** 현재 질문 인덱스 / Current question index within step */
  currentQuestionIndex: number;
  /** 로딩 중 여부 / Loading state */
  isLoading: boolean;
  /** 타이핑 애니메이션 중 / Typing animation active */
  isTyping: boolean;
  /** 완료 여부 / Completion flag */
  isCompleted: boolean;
  /** 에러 메시지 / Error message */
  error: string | null;
}

// === 스텝 메타 정보 / Step meta info ===
export interface StepMeta {
  /** 스텝 번호 / Step number */
  step: WizardStep;
  /** 스텝 라벨 / Step label */
  label: string;
  /** 스텝 아이콘 / Step icon */
  icon: string;
  /** 스텝 설명 / Step description */
  description: string;
}

// === 스텝 메타 상수 / Step meta constants ===
export const STEP_METAS: StepMeta[] = [
  { step: 0, label: '거주 상태', icon: '🏠', description: 'Residence Status' },
  { step: 1, label: '기본 정보', icon: '👤', description: 'Basic Info' },
  { step: 2, label: '비자 정보', icon: '📄', description: 'Visa Info' },
  { step: 3, label: '한국어', icon: '🗣️', description: 'Korean Language' },
  { step: 4, label: '학력', icon: '🎓', description: 'Education' },
  { step: 5, label: '추가 정보', icon: '📋', description: 'Additional Info' },
  { step: 6, label: '경력', icon: '💼', description: 'Career' },
  { step: 7, label: '희망 조건', icon: '⭐', description: 'Preferences' },
];

// === 초기 폼 데이터 / Initial form data ===
export const INITIAL_FORM_DATA: WizardFormData = {
  residenceStatus: null,
  firstName: '',
  lastName: '',
  nationality: '',
  birthDate: '',
  gender: null,
  phone: '',
  profilePhoto: null,
  address: '',
  visaType: '',
  visaSubType: '',
  arcNumber: '',
  visaExpiry: '',
  ocrDocument: null,
  koreanTestType: '',
  koreanTestLevel: '',
  koreanCertificate: null,
  koreanSelfAssessment: 0,
  educations: [],
  deltaFields: {},
  hasCareer: false,
  careers: [],
  desiredJobTypes: [],
  desiredLocations: [],
  desiredSalaryMin: 0,
  desiredSalaryMax: 0,
  availableDate: '',
  workSchedule: '',
};

// === 국적 목록 / Nationality list ===
export const NATIONALITIES: ChoiceOption[] = [
  { value: 'VN', label: '베트남 (Vietnam)', icon: '🇻🇳' },
  { value: 'CN', label: '중국 (China)', icon: '🇨🇳' },
  { value: 'PH', label: '필리핀 (Philippines)', icon: '🇵🇭' },
  { value: 'ID', label: '인도네시아 (Indonesia)', icon: '🇮🇩' },
  { value: 'TH', label: '태국 (Thailand)', icon: '🇹🇭' },
  { value: 'MM', label: '미얀마 (Myanmar)', icon: '🇲🇲' },
  { value: 'KH', label: '캄보디아 (Cambodia)', icon: '🇰🇭' },
  { value: 'NP', label: '네팔 (Nepal)', icon: '🇳🇵' },
  { value: 'BD', label: '방글라데시 (Bangladesh)', icon: '🇧🇩' },
  { value: 'LK', label: '스리랑카 (Sri Lanka)', icon: '🇱🇰' },
  { value: 'UZ', label: '우즈베키스탄 (Uzbekistan)', icon: '🇺🇿' },
  { value: 'MN', label: '몽골 (Mongolia)', icon: '🇲🇳' },
  { value: 'RU', label: '러시아 (Russia)', icon: '🇷🇺' },
  { value: 'JP', label: '일본 (Japan)', icon: '🇯🇵' },
  { value: 'US', label: '미국 (USA)', icon: '🇺🇸' },
  { value: 'IN', label: '인도 (India)', icon: '🇮🇳' },
  { value: 'PK', label: '파키스탄 (Pakistan)', icon: '🇵🇰' },
  { value: 'OTHER', label: '기타 (Other)', icon: '🌐' },
];

// === 비자 유형 목록 / Visa type list ===
export const VISA_TYPES: ChoiceOption[] = [
  { value: 'E-9', label: 'E-9 (비전문취업)', description: 'Non-Professional Employment' },
  { value: 'E-7', label: 'E-7 (특정활동)', description: 'Specific Activities' },
  { value: 'E-7-1', label: 'E-7-1 (포인트제)', description: 'Point System' },
  { value: 'H-2', label: 'H-2 (방문취업)', description: 'Working Visit' },
  { value: 'F-4', label: 'F-4 (재외동포)', description: 'Overseas Korean' },
  { value: 'F-2', label: 'F-2 (거주)', description: 'Residence' },
  { value: 'F-5', label: 'F-5 (영주)', description: 'Permanent Residence' },
  { value: 'F-6', label: 'F-6 (결혼이민)', description: 'Marriage Immigration' },
  { value: 'D-10', label: 'D-10 (구직)', description: 'Job Seeking' },
  { value: 'E-1', label: 'E-1 (교수)', description: 'Professor' },
  { value: 'E-2', label: 'E-2 (회화지도)', description: 'Foreign Language Instructor' },
  { value: 'E-3', label: 'E-3 (연구)', description: 'Research' },
  { value: 'E-4', label: 'E-4 (기술지도)', description: 'Technology Transfer' },
  { value: 'E-5', label: 'E-5 (전문직업)', description: 'Professional' },
  { value: 'E-6', label: 'E-6 (예술흥행)', description: 'Arts & Entertainment' },
  { value: 'C-4', label: 'C-4 (단기취업)', description: 'Short-term Employment' },
  { value: 'D-2', label: 'D-2 (유학)', description: 'Study' },
  { value: 'D-4', label: 'D-4 (일반연수)', description: 'General Training' },
  { value: 'OTHER', label: '기타 (Other)', description: 'Other Visa Types' },
];

// === 한국어 시험 종류 / Korean test types ===
export const KOREAN_TEST_TYPES: ChoiceOption[] = [
  { value: 'TOPIK', label: 'TOPIK (한국어능력시험)' },
  { value: 'KIIP', label: 'KIIP (사회통합프로그램)' },
  { value: 'EPS-TOPIK', label: 'EPS-TOPIK (고용허가제 한국어시험)' },
  { value: 'NONE', label: '없음 (None)' },
];

// === 학위 종류 / Degree types ===
export const DEGREE_TYPES: ChoiceOption[] = [
  { value: 'high_school', label: '고등학교 졸업 (High School)' },
  { value: 'associate', label: '전문학사 (Associate)' },
  { value: 'bachelor', label: '학사 (Bachelor)' },
  { value: 'master', label: '석사 (Master)' },
  { value: 'doctor', label: '박사 (Doctorate)' },
];

// === 직종 유형 / Job type list ===
export const JOB_TYPES: ChoiceOption[] = [
  { value: 'manufacturing', label: '제조업 (Manufacturing)', icon: '🏭' },
  { value: 'construction', label: '건설업 (Construction)', icon: '🏗️' },
  { value: 'agriculture', label: '농업 (Agriculture)', icon: '🌾' },
  { value: 'fishery', label: '어업 (Fishery)', icon: '🐟' },
  { value: 'service', label: '서비스업 (Service)', icon: '🏨' },
  { value: 'restaurant', label: '음식점업 (Restaurant)', icon: '🍳' },
  { value: 'it', label: 'IT/소프트웨어 (IT/Software)', icon: '💻' },
  { value: 'education', label: '교육 (Education)', icon: '📚' },
  { value: 'healthcare', label: '의료 (Healthcare)', icon: '🏥' },
  { value: 'logistics', label: '물류 (Logistics)', icon: '🚚' },
  { value: 'retail', label: '소매 (Retail)', icon: '🛒' },
  { value: 'other', label: '기타 (Other)', icon: '📦' },
];

// === 근무 지역 / Work locations ===
export const WORK_LOCATIONS: ChoiceOption[] = [
  { value: 'seoul', label: '서울 (Seoul)' },
  { value: 'gyeonggi', label: '경기 (Gyeonggi)' },
  { value: 'incheon', label: '인천 (Incheon)' },
  { value: 'busan', label: '부산 (Busan)' },
  { value: 'daegu', label: '대구 (Daegu)' },
  { value: 'daejeon', label: '대전 (Daejeon)' },
  { value: 'gwangju', label: '광주 (Gwangju)' },
  { value: 'ulsan', label: '울산 (Ulsan)' },
  { value: 'sejong', label: '세종 (Sejong)' },
  { value: 'gangwon', label: '강원 (Gangwon)' },
  { value: 'chungbuk', label: '충북 (Chungbuk)' },
  { value: 'chungnam', label: '충남 (Chungnam)' },
  { value: 'jeonbuk', label: '전북 (Jeonbuk)' },
  { value: 'jeonnam', label: '전남 (Jeonnam)' },
  { value: 'gyeongbuk', label: '경북 (Gyeongbuk)' },
  { value: 'gyeongnam', label: '경남 (Gyeongnam)' },
  { value: 'jeju', label: '제주 (Jeju)' },
  { value: 'anywhere', label: '어디든 가능 (Anywhere)', icon: '🗺️' },
];

// === 근무 형태 / Work schedule types ===
export const WORK_SCHEDULES: ChoiceOption[] = [
  { value: 'full_time', label: '풀타임 (Full-time)', icon: '⏰' },
  { value: 'part_time', label: '파트타임 (Part-time)', icon: '🕐' },
  { value: 'shift', label: '교대근무 (Shift)', icon: '🔄' },
  { value: 'flexible', label: '유연근무 (Flexible)', icon: '📅' },
  { value: 'any', label: '상관없음 (Any)', icon: '✅' },
];
