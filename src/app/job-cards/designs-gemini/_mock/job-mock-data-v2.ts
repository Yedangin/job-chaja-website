// Gemini 디자인용 확장 목데이터 / Extended mock data for Gemini card designs
// 로고, 산업별 이미지, 마우스오버 기능 포함 / Includes logos, industry images, hover features

export interface MockJobPostingV2 {
  id: string;
  title: string;
  company: string;
  companyLogo: string; // 실제 회사 로고 URL / Real company logo URL
  companyInitial: string; // 로고 대체 이니셜 / Fallback initial
  location: string;
  boardType: 'PART_TIME' | 'FULL_TIME';
  tierType: 'STANDARD' | 'PREMIUM';
  hourlyWage?: number;
  salaryMin?: number;
  salaryMax?: number;
  allowedVisas: string[];
  visaTypes: string[]; // allowedVisas 별칭 / Alias for allowedVisas (used by some design pages)
  techStack?: string[]; // 기술 스택 / Tech stack (optional)
  isPremium?: boolean; // 프리미엄 여부 / Premium flag (optional)
  closingDate: string | null;
  postedDate: string;
  applicantCount: number;
  viewCount: number;
  isUrgent?: boolean;
  isFeatured?: boolean;
  benefits: string[];
  workHours?: string;
  experienceRequired?: string;
  industry: string;
  industryImage: string; // 산업별 무료 이미지 URL / Industry free image URL
  matchScore?: number;
  // 호환 별칭 — 일부 디자인 페이지에서 사용 / Compatibility aliases used by some design pages
  visaCompatibility: string[]; // allowedVisas 별칭 / Alias for allowedVisas
  matchedVisaCodes: string[]; // allowedVisas 별칭 / Alias for allowedVisas
  matchedVisaTypes: string[]; // allowedVisas 별칭 / Alias for allowedVisas
  matchedVisas: string[]; // allowedVisas 별칭 / Alias for allowedVisas
  eligibleVisas: string[]; // allowedVisas 별칭 / Alias for allowedVisas
  eligibleVisaTypes: string[]; // allowedVisas 별칭 / Alias for allowedVisas
  visa_types: string[]; // allowedVisas 별칭 / Alias for allowedVisas
  visaType: string[]; // allowedVisas 별칭 / Alias for allowedVisas
  employmentType: string; // boardType 한글 변환 / Korean label for boardType
  employment_type: string; // boardType 영문 변환 / English label for boardType
  jobType: string; // boardType 별칭 / Alias for boardType
  experience: string; // experienceRequired 별칭 / Alias for experienceRequired
  experience_required: string; // experienceRequired 별칭 / Alias for experienceRequired
  experienceLevel: string; // experienceRequired 별칭 / Alias for experienceRequired
  education: string; // 학력 요건 / Education requirement
  deadline: string | null; // closingDate 별칭 / Alias for closingDate
  applicationDeadline: string | null; // closingDate 별칭 / Alias for closingDate
  image: string; // industryImage 별칭 / Alias for industryImage
  imageUrl: string; // industryImage 별칭 / Alias for industryImage
  logo: string; // companyLogo 별칭 / Alias for companyLogo
  companyLogoUrl: string; // companyLogo 별칭 / Alias for companyLogo
  companyName: string; // company 별칭 / Alias for company
  company_name: string; // company 별칭 / Alias for company
  company_image: string; // industryImage 별칭 / Alias for industryImage
  company_logo: string; // companyLogo 별칭 / Alias for companyLogo
  description: string; // 간단 설명 / Short description
  skills: string[]; // techStack 별칭 / Alias for techStack
  tags: string[]; // 태그 목록 / Tag list
  salary: { min?: number; max?: number; negotiable?: boolean }; // 급여 객체 / Salary object
  salaryType: string; // 급여 유형 / Salary type
  requirements: { experienceLevel: string; educationLevel: string }; // 요구사항 / Requirements
  hiringCount: number; // 모집 인원 / Hiring count
  recruitCount: number; // 모집 인원 별칭 / Alias for hiringCount
  category: string; // industry 별칭 / Alias for industry
  jobTitle: string; // title 별칭 / Alias for title
  tier: string; // tierType 별칭 / Alias for tierType
  urgent: boolean; // isUrgent 별칭 / Alias for isUrgent
  featured: boolean; // isFeatured 별칭 / Alias for isFeatured
  isVerified: boolean; // 인증 여부 / Verified flag
  companySize: string; // 기업 규모 / Company size
  views: number; // viewCount 별칭 / Alias for viewCount
  applicants: number; // applicantCount 별칭 / Alias for applicantCount
  bookmarks: number; // 북마크 수 / Bookmark count
  createdAt: string; // postedDate 별칭 / Alias for postedDate
  postedAt: string; // postedDate 별칭 / Alias for postedDate
  workingHours: string; // workHours 별칭 / Alias for workHours
  workSchedule: string; // workHours 별칭 / Alias for workHours
  language: string; // 언어 요건 / Language requirement
}

// 산업별 무료 이미지 (Unsplash 직접 링크) / Industry free images (Unsplash direct links)
export const industryImages = {
  construction: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop&auto=format',
  food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop&auto=format',
  manufacturing: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&auto=format',
} as const;

// 회사 로고 URL (공개 접근 가능한 로고) / Company logo URLs (publicly accessible)
export const companyLogos = {
  samsung: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/200px-Samsung_Logo.svg.png',
  hyundai: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/200px-Hyundai_Motor_Company_logo.svg.png',
  coupang: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Coupang_logo.svg/200px-Coupang_logo.svg.png',
} as const;

// 호환 별칭 자동 생성 / Auto-generate compatibility aliases from base data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withCompat(job: any): MockJobPostingV2 {
  const exp = job.experienceRequired ?? '무관';
  const hc = Math.max(1, Math.floor(job.applicantCount / 10));
  return {
    ...job,
    // 비자 별칭 / Visa aliases
    visaCompatibility: job.allowedVisas,
    matchedVisaCodes: job.allowedVisas,
    matchedVisaTypes: job.allowedVisas,
    matchedVisas: job.allowedVisas,
    eligibleVisas: job.allowedVisas,
    eligibleVisaTypes: job.allowedVisas,
    visa_types: job.allowedVisas,
    visaType: job.allowedVisas,
    // 고용 유형 / Employment type aliases
    employmentType: job.boardType === 'FULL_TIME' ? '정규직' : '파트타임',
    employment_type: job.boardType === 'FULL_TIME' ? 'Full-time' : 'Part-time',
    jobType: job.boardType === 'FULL_TIME' ? '정규직' : '파트타임',
    // 경력/학력 / Experience/Education
    experience: exp,
    experience_required: exp,
    experienceLevel: exp,
    education: '무관',
    // 날짜 별칭 / Date aliases
    deadline: job.closingDate,
    applicationDeadline: job.closingDate,
    createdAt: job.postedDate,
    postedAt: job.postedDate,
    // 이미지/로고 별칭 / Image/Logo aliases
    image: job.industryImage,
    imageUrl: job.industryImage,
    logo: job.companyLogo,
    companyLogoUrl: job.companyLogo,
    company_image: job.industryImage,
    company_logo: job.companyLogo,
    // 회사명 별칭 / Company name aliases
    companyName: job.company,
    company_name: job.company,
    // 기타 별칭 / Other aliases
    description: `${job.company}에서 ${job.title} 포지션을 모집합니다.`,
    skills: job.techStack ?? [],
    tags: [job.industry, ...job.benefits.slice(0, 2)],
    salary: { ...(job.salaryMin ? { min: job.salaryMin } : {}), ...(job.salaryMax ? { max: job.salaryMax } : {}), negotiable: !job.salaryMin && !job.hourlyWage },
    salaryType: job.hourlyWage ? '시급' : '연봉',
    requirements: { experienceLevel: exp, educationLevel: '무관' },
    hiringCount: hc,
    recruitCount: hc,
    category: job.industry,
    jobTitle: job.title,
    tier: job.tierType,
    urgent: job.isUrgent ?? false,
    featured: job.isFeatured ?? false,
    isVerified: true,
    companySize: '50~100명',
    views: job.viewCount,
    applicants: job.applicantCount,
    bookmarks: Math.floor(job.viewCount / 5),
    workingHours: job.workHours ?? '',
    workSchedule: job.workHours ?? '',
    language: '한국어',
  };
}

// 6개 샘플 데이터 (로고 + 이미지 포함) / 6 sample data entries with logos and images
const _rawJobs = [
  {
    id: 'job-001',
    title: '반도체 생산라인 오퍼레이터 (기숙사 제공)',
    company: '삼성전자 평택캠퍼스',
    companyLogo: companyLogos.samsung,
    companyInitial: 'S',
    location: '경기 평택시',
    boardType: 'FULL_TIME',
    tierType: 'PREMIUM',
    salaryMin: 28000000,
    salaryMax: 35000000,
    allowedVisas: ['E-9', 'H-2', 'F-4'],
    visaTypes: ['E-9', 'H-2', 'F-4'],
    isPremium: true,
    closingDate: '2026-03-10',
    postedDate: '2026-02-10',
    applicantCount: 142,
    viewCount: 3820,
    isUrgent: true,
    isFeatured: true,
    benefits: ['기숙사', '통근버스', '중식제공', '4대보험'],
    workHours: '08:00~17:00 (주 5일)',
    experienceRequired: '무관',
    industry: '제조',
    industryImage: industryImages.manufacturing,
    matchScore: 95,
  },
  {
    id: 'job-002',
    title: '일식 레스토랑 주방 스태프',
    company: '현대그린푸드',
    companyLogo: companyLogos.hyundai,
    companyInitial: 'H',
    location: '서울 중구',
    boardType: 'PART_TIME',
    tierType: 'STANDARD',
    hourlyWage: 12500,
    allowedVisas: ['E-9', 'H-2', 'F-2'],
    visaTypes: ['E-9', 'H-2', 'F-2'],
    isPremium: false,
    closingDate: '2026-03-05',
    postedDate: '2026-02-14',
    applicantCount: 58,
    viewCount: 1240,
    benefits: ['식사제공', '유니폼', '4대보험'],
    workHours: '10:00~19:00',
    experienceRequired: '1년 이상',
    industry: '숙박/음식',
    industryImage: industryImages.food,
    matchScore: 78,
  },
  {
    id: 'job-003',
    title: 'IT 소프트웨어 개발자 (React/Node.js)',
    company: '쿠팡',
    companyLogo: companyLogos.coupang,
    companyInitial: 'C',
    location: '서울 송파구',
    boardType: 'FULL_TIME',
    tierType: 'PREMIUM',
    salaryMin: 50000000,
    salaryMax: 70000000,
    allowedVisas: ['E-7-1', 'F-2', 'F-5'],
    visaTypes: ['E-7-1', 'F-2', 'F-5'],
    techStack: ['React', 'Node.js', 'TypeScript'],
    isPremium: true,
    closingDate: '2026-04-01',
    postedDate: '2026-02-01',
    applicantCount: 89,
    viewCount: 5120,
    isFeatured: true,
    benefits: ['재택근무', '유연근무', '스톡옵션', '식대지원'],
    workHours: '자율출퇴근',
    experienceRequired: '3년 이상',
    industry: 'IT/소프트웨어',
    industryImage: industryImages.manufacturing,
    matchScore: 88,
  },
  {
    id: 'job-004',
    title: '건설현장 철근공 (경험자 우대)',
    company: '현대건설',
    companyLogo: companyLogos.hyundai,
    companyInitial: 'H',
    location: '서울 강남구',
    boardType: 'PART_TIME',
    tierType: 'STANDARD',
    hourlyWage: 18000,
    allowedVisas: ['E-9', 'H-2'],
    visaTypes: ['E-9', 'H-2'],
    isPremium: false,
    closingDate: '2026-02-28',
    postedDate: '2026-02-15',
    applicantCount: 23,
    viewCount: 560,
    isUrgent: true,
    benefits: ['중식제공', '안전장비', '숙소지원'],
    workHours: '07:00~16:00',
    experienceRequired: '2년 이상',
    industry: '건설',
    industryImage: industryImages.construction,
    matchScore: 62,
  },
  {
    id: 'job-005',
    title: '물류센터 상품 분류원 (야간)',
    company: '쿠팡 로지스틱스',
    companyLogo: companyLogos.coupang,
    companyInitial: 'C',
    location: '인천 남동구',
    boardType: 'PART_TIME',
    tierType: 'STANDARD',
    hourlyWage: 14000,
    allowedVisas: ['E-9', 'H-2', 'F-4', 'F-2'],
    visaTypes: ['E-9', 'H-2', 'F-4', 'F-2'],
    isPremium: false,
    closingDate: null,
    postedDate: '2026-02-16',
    applicantCount: 67,
    viewCount: 1890,
    benefits: ['통근버스', '야간수당', '4대보험'],
    workHours: '22:00~07:00 (야간)',
    experienceRequired: '무관',
    industry: '물류/운송',
    industryImage: industryImages.manufacturing,
    matchScore: 85,
  },
  {
    id: 'job-006',
    title: '삼성물산 건설현장 관리보조',
    company: '삼성물산',
    companyLogo: companyLogos.samsung,
    companyInitial: 'S',
    location: '경기 화성시',
    boardType: 'FULL_TIME',
    tierType: 'PREMIUM',
    salaryMin: 30000000,
    salaryMax: 42000000,
    allowedVisas: ['E-9', 'H-2', 'E-7-1'],
    visaTypes: ['E-9', 'H-2', 'E-7-1'],
    isPremium: true,
    closingDate: '2026-03-20',
    postedDate: '2026-02-12',
    applicantCount: 34,
    viewCount: 2100,
    isFeatured: true,
    benefits: ['기숙사', '통근버스', '의료보험', '연차'],
    workHours: '08:00~17:00 (주 5일)',
    experienceRequired: '2년 이상',
    industry: '건설',
    industryImage: industryImages.construction,
    matchScore: 92,
  },
];
export const sampleJobsV2: MockJobPostingV2[] = _rawJobs.map(withCompat);

// D-day 계산 / Calculate D-day
export function getDDay(date: string | null): string | null {
  if (!date) return '상시모집';
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (diff < 0) return '마감';
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

// 급여 포맷 / Format salary
export function formatSalary(job: MockJobPostingV2): string {
  if (job.hourlyWage) return `시급 ${job.hourlyWage.toLocaleString()}원`;
  if (job.salaryMin && job.salaryMax) {
    const min = Math.round(job.salaryMin / 10000);
    const max = Math.round(job.salaryMax / 10000);
    return `연봉 ${min.toLocaleString()}~${max.toLocaleString()}만원`;
  }
  return '면접 후 결정';
}

// 시간 경과 표시 / Time ago display
export function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

// 산업별 색상 매핑 / Industry color mapping
export function getIndustryColor(industry: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    '제조': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    '숙박/음식': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'IT/소프트웨어': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    '건설': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    '물류/운송': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    '교육': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  };
  return map[industry] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
}

// 비자 색상 매핑 / Visa color mapping
export function getVisaColor(visa: string): { bg: string; text: string } {
  if (visa.startsWith('E-7')) return { bg: 'bg-cyan-100', text: 'text-cyan-700' };
  if (visa.startsWith('E-9')) return { bg: 'bg-blue-100', text: 'text-blue-700' };
  if (visa.startsWith('E-2')) return { bg: 'bg-purple-100', text: 'text-purple-700' };
  if (visa.startsWith('H-2')) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
  if (visa.startsWith('F-2')) return { bg: 'bg-amber-100', text: 'text-amber-700' };
  if (visa.startsWith('F-4')) return { bg: 'bg-indigo-100', text: 'text-indigo-700' };
  if (visa.startsWith('F-5')) return { bg: 'bg-pink-100', text: 'text-pink-700' };
  return { bg: 'bg-gray-100', text: 'text-gray-700' };
}
