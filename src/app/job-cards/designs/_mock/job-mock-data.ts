// 채용공고 카드 디자인 목데이터 / Job card design mock data

export interface MockJobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  boardType: 'PART_TIME' | 'FULL_TIME';
  tierType: 'STANDARD' | 'PREMIUM';
  hourlyWage?: number;
  salaryMin?: number;
  salaryMax?: number;
  allowedVisas: string[];
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
  matchScore?: number; // 비자 매칭 적합도 / Visa match score
}

// 6개 샘플 데이터 / 6 sample data entries
export const sampleJobs: MockJobPosting[] = [
  {
    id: 'job-001',
    title: '반도체 생산라인 오퍼레이터 (기숙사 제공)',
    company: '삼성전자 평택캠퍼스',
    location: '경기 평택시',
    boardType: 'FULL_TIME',
    tierType: 'PREMIUM',
    salaryMin: 28000000,
    salaryMax: 35000000,
    allowedVisas: ['E-9', 'H-2', 'F-4'],
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
    matchScore: 95,
  },
  {
    id: 'job-002',
    title: '일식 레스토랑 주방 스태프',
    company: '신라호텔 서울',
    location: '서울 중구',
    boardType: 'PART_TIME',
    tierType: 'STANDARD',
    hourlyWage: 12500,
    allowedVisas: ['E-9', 'H-2', 'F-2'],
    closingDate: '2026-03-05',
    postedDate: '2026-02-14',
    applicantCount: 58,
    viewCount: 1240,
    benefits: ['식사제공', '유니폼', '4대보험'],
    workHours: '10:00~19:00',
    experienceRequired: '1년 이상',
    industry: '숙박/음식',
    matchScore: 78,
  },
  {
    id: 'job-003',
    title: 'IT 소프트웨어 개발자 (React/Node.js)',
    company: '네이버 클라우드',
    location: '경기 성남시 분당구',
    boardType: 'FULL_TIME',
    tierType: 'PREMIUM',
    salaryMin: 50000000,
    salaryMax: 70000000,
    allowedVisas: ['E-7-1', 'F-2', 'F-5'],
    closingDate: '2026-04-01',
    postedDate: '2026-02-01',
    applicantCount: 89,
    viewCount: 5120,
    isFeatured: true,
    benefits: ['재택근무', '유연근무', '스톡옵션', '식대지원'],
    workHours: '자율출퇴근',
    experienceRequired: '3년 이상',
    industry: 'IT/소프트웨어',
    matchScore: 88,
  },
  {
    id: 'job-004',
    title: '건설현장 철근공 (경험자 우대)',
    company: '현대건설',
    location: '서울 강남구',
    boardType: 'PART_TIME',
    tierType: 'STANDARD',
    hourlyWage: 18000,
    allowedVisas: ['E-9', 'H-2'],
    closingDate: '2026-02-28',
    postedDate: '2026-02-15',
    applicantCount: 23,
    viewCount: 560,
    isUrgent: true,
    benefits: ['중식제공', '안전장비', '숙소지원'],
    workHours: '07:00~16:00',
    experienceRequired: '2년 이상',
    industry: '건설',
    matchScore: 62,
  },
  {
    id: 'job-005',
    title: '물류센터 상품 분류원 (야간)',
    company: 'CJ대한통운',
    location: '인천 남동구',
    boardType: 'PART_TIME',
    tierType: 'STANDARD',
    hourlyWage: 14000,
    allowedVisas: ['E-9', 'H-2', 'F-4', 'F-2'],
    closingDate: null,
    postedDate: '2026-02-16',
    applicantCount: 67,
    viewCount: 1890,
    benefits: ['통근버스', '야간수당', '4대보험'],
    workHours: '22:00~07:00 (야간)',
    experienceRequired: '무관',
    industry: '물류/운송',
    matchScore: 85,
  },
  {
    id: 'job-006',
    title: '영어회화 강사 (원어민)',
    company: 'YBM어학원 강남',
    location: '서울 강남구',
    boardType: 'FULL_TIME',
    tierType: 'PREMIUM',
    salaryMin: 30000000,
    salaryMax: 42000000,
    allowedVisas: ['E-2'],
    closingDate: '2026-03-20',
    postedDate: '2026-02-12',
    applicantCount: 34,
    viewCount: 2100,
    isFeatured: true,
    benefits: ['주거지원', '항공권', '의료보험', '연차'],
    workHours: '09:00~18:00 (주 5일)',
    experienceRequired: '2년 이상',
    industry: '교육',
    matchScore: 92,
  },
];

// D-day 계산 / Calculate D-day
export function getDDay(date: string | null): string | null {
  if (!date) return '상시모집';
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (diff < 0) return '마감';
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

// 급여 포맷 / Format salary
export function formatSalary(job: MockJobPosting): string {
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
