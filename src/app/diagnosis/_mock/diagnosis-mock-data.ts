// src/app/diagnosis/_mock/diagnosis-mock-data.ts
// KOR: 이 파일은 비자 진단 기능에 사용되는 모든 목업 데이터, 타입 및 헬퍼 함수를 정의합니다.
// ENG: This file defines all mock data, types, and helper functions used for the visa diagnosis feature.

// Types / 인터페이스 정의

/**
 * KOR: 사용자의 입력을 저장하는 인터페이스입니다.
 * ENG: Interface for storing the user's input.
 */
export interface DiagnosisInput {
  nationality: string;
  age: number;
  educationLevel: string;
  availableAnnualFund: string;
  finalGoal: string;
  priorityPreference: string;
  topikLevel?: number;
  workExperienceYears?: number;
  major?: string;
  isEthnicKorean?: boolean;
  currentVisa?: string;
}

/**
 * KOR: 추천된 단일 비자 경로를 정의하는 인터페이스입니다.
 * ENG: Interface defining a single recommended visa pathway.
 */
export interface RecommendedPathway {
  id: string;
  name: string;
  description: string;
  feasibilityScore: number; // 0-100
  feasibilityLabel: '매우 높음' | '높음' | '보통' | '낮음' | '매우 낮음';
  totalDurationMonths: number;
  estimatedCostUSD: number;
  visaChain: { visa: string; duration: string }[];
  milestones: { title: string; description: string; emoji: string }[];
}

/**
 * KOR: 최종 진단 결과 객체를 정의하는 인터페이스입니다.
 * ENG: Interface defining the final diagnosis result object.
 */
export interface DiagnosisResult {
  id: string;
  userInput: DiagnosisInput;
  pathways: RecommendedPathway[];
}

/**
 * KOR: 초기 호환성 확인을 위한 간소화된 경로 인터페이스입니다.
 * ENG: Simplified pathway interface for initial compatibility checks.
 */
export interface CompatPathway {
  id: string;
  name: string;
  requirements: Partial<DiagnosisInput>;
  tags: string[];
}

// Mock Data / 목업 데이터

/**
 * KOR: 샘플 사용자 입력 데이터입니다.
 * ENG: Sample user input data.
 */
export const mockInput: DiagnosisInput = {
  nationality: 'Vietnam',
  age: 25,
  educationLevel: '학사 (4년제 대학)',
  availableAnnualFund: '$10,000 - $20,000',
  finalGoal: '한국에서 장기 체류 또는 영주권 취득',
  priorityPreference: '빠른 취업',
};

/**
 * KOR: 인기 국가 목록 데이터입니다. (12개국)
 * ENG: List of popular countries. (12 countries)
 */
export const popularCountries: { code: string; name: string; flag: string }[] = [
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
];

/**
 * KOR: 학력 수준 옵션 목록입니다.
 * ENG: List of education level options.
 */
export const educationOptions: string[] = [
  '고등학교 졸업',
  '전문학사 (2-3년제 대학)',
  '학사 (4년제 대학)',
  '석사',
  '박사',
];

/**
 * KOR: 최종 목표 옵션 목록입니다.
 * ENG: List of final goal options.
 */
export const goalOptions: string[] = [
  '한국어 학습',
  '단기 취업 (1-3년)',
  '장기 취업 (3년 이상)',
  '유학 (학위 취득)',
  '영주권 또는 국적 취득',
];

/**
 * KOR: 우선순위 옵션 목록입니다.
 * ENG: List of priority options.
 */
export const priorityOptions: string[] = [
  '가장 빠른 경로',
  '가장 저렴한 비용',
  '가장 높은 성공률',
  '특정 직업 분야',
];

/**
 * KOR: 연간 가용 자금 범위 옵션 목록입니다.
 * ENG: List of annual available fund range options.
 */
export const fundOptions: string[] = [
  '~ $5,000',
  '$5,000 - $10,000',
  '$10,000 - $20,000',
  '$20,000 - $50,000',
  '$50,000 ~',
];

/**
 * KOR: 호환 가능한 비자 경로 목업 데이터입니다.
 * ENG: Mock data for compatible visa pathways.
 */
export const mockPathways: CompatPathway[] = [
    { id: 'p1', name: 'D-2 유학', requirements: { educationLevel: '고등학교 졸업' }, tags: ['유학', '어학연수'] },
    { id: 'p2', name: 'E-7 전문인력', requirements: { educationLevel: '학사 (4년제 대학)', workExperienceYears: 1 }, tags: ['취업', '전문직'] },
    { id: 'p3', name: 'F-2-7 점수제 거주', requirements: { age: 30, topikLevel: 4 }, tags: ['장기체류', '점수제'] },
];

/**
 * KOR: 샘플 비자 진단 결과 데이터입니다.
 * ENG: Sample visa diagnosis result data.
 */
export const mockDiagnosisResult: DiagnosisResult = {
  id: 'diag-12345',
  userInput: mockInput,
  pathways: [
    {
      id: 'path-1',
      name: 'D-2-7 유학 후 E-7-R 취업',
      description: '기술 분야 석사 유학을 통해 전문성을 갖춘 후, 졸업과 함께 E-7-R 비자로 전환하여 취업하는 경로입니다.',
      feasibilityScore: 85,
      feasibilityLabel: '매우 높음',
      totalDurationMonths: 30,
      estimatedCostUSD: 25000,
      visaChain: [
        { visa: 'D-2-7', duration: '24개월' },
        { visa: 'D-10', duration: '6개월' },
        { visa: 'E-7-R', duration: '최대 5년' },
      ],
      milestones: [
        { title: '국내 대학원 입학', description: '관련 전공 석사 과정에 입학하여 D-2-7 비자를 받습니다.', emoji: '🎓' },
        { title: '석사 학위 취득', description: '2년간의 학업을 마치고 졸업합니다. TOPIK 4급 이상이 유리합니다.', emoji: '📜' },
        { title: '구직 활동', description: 'D-10 비자로 변경하여 6개월간 취업 준비를 합니다.', emoji: '💼' },
        { title: 'E-7-R 취업 성공', description: 'IT, 기술 분야 기업에 취업하여 안정적인 직장 생활을 시작합니다.', emoji: '🎉' },
      ],
    },
    {
      id: 'path-2',
      name: 'D-4-1 어학연수 후 D-2 유학',
      description: '한국어 능력을 먼저 갖춘 후, 국내 대학에 진학하는 가장 안정적인 유학 경로입니다.',
      feasibilityScore: 75,
      feasibilityLabel: '높음',
      totalDurationMonths: 60,
      estimatedCostUSD: 40000,
      visaChain: [
        { visa: 'D-4-1', duration: '12-24개월' },
        { visa: 'D-2', duration: '48개월' },
      ],
      milestones: [
        { title: '어학당 입학', description: '대학교 부설 어학당에서 한국어를 배웁니다.', emoji: '🗣️' },
        { title: 'TOPIK 3급 이상 취득', description: '대학 입학에 필요한 한국어 능력을 증명합니다.', emoji: '📝' },
        { title: '대학교 입학', description: '원하는 전공으로 4년제 대학에 입학합니다.', emoji: '🏫' },
        { title: '졸업 및 진로 결정', description: '졸업 후 취업(E-7) 또는 대학원 진학(D-2)을 선택합니다.', emoji: '🤔' },
      ],
    },
    {
      id: 'path-3',
      name: 'E-9 비전문취업 후 F-2-6 숙련기능인력',
      description: '비전문 취업으로 입국하여 경력을 쌓고, 요건을 충족하여 F-2-6 비자로 전환하는 경로입니다.',
      feasibilityScore: 60,
      feasibilityLabel: '보통',
      totalDurationMonths: 72,
      estimatedCostUSD: 8000,
      visaChain: [
        { visa: 'E-9', duration: '58개월' },
        { visa: 'F-2-6', duration: '영주권까지' },
      ],
       milestones: [
        { title: 'E-9 비자 취업', description: '고용허가제를 통해 한국 기업에 취업합니다.', emoji: '🏭' },
        { title: '4년 이상 근무 및 기술 습득', description: '한 사업장에서 꾸준히 근무하며 기술을 익힙니다.', emoji: '🔧' },
        { title: '사회통합프로그램 이수', description: '한국 사회 적응을 위한 사회통합프로그램 4단계 이상을 이수합니다.', emoji: '🤝' },
        { title: 'F-2-6 비자 전환', description: '소득, 경력, 한국어 능력 요건을 충족하여 거주 비자로 전환합니다.', emoji: '🌟' },
      ],
    },
  ],
};


// Helper Functions / 헬퍼 함수

/**
 * KOR: 실현 가능성 레이블에 따라 Tailwind CSS 배경색 클래스를 반환합니다.
 * ENG: Returns a Tailwind CSS background color class based on the feasibility label.
 */
export const getScoreColor = (label: '매우 높음' | '높음' | '보통' | '낮음' | '매우 낮음'): string => {
  switch (label) {
    case '매우 높음':
      return 'bg-blue-500';
    case '높음':
      return 'bg-green-500';
    case '보통':
      return 'bg-yellow-500';
    case '낮음':
      return 'bg-orange-500';
    case '매우 낮음':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

/**
 * KOR: 실현 가능성 레이블에 따라 이모지를 반환합니다.
 * ENG: Returns an emoji based on the feasibility label.
 */
export const getFeasibilityEmoji = (label: '매우 높음' | '높음' | '보통' | '낮음' | '매우 낮음'): string => {
    switch (label) {
      case '매우 높음':
        return '🚀';
      case '높음':
        return '👍';
      case '보통':
        return '🤔';
      case '낮음':
        return '😟';
      case '매우 낮음':
        return '😥';
      default:
        return '🤷';
    }
}
