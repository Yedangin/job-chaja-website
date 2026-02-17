// src/app/job-cards/_mock/job-mock-data-v2.ts

// 타입 정의 (Type Definition)
export interface MockJobPostingV2 {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyInitial: string;
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
  industryImage: string;
  matchScore?: number;
}

// 샘플 데이터 (Sample Data)
export const sampleJobsV2: MockJobPostingV2[] = [
    {
      id: 'job001',
      title: '반도체 생산 라인 오퍼레이터',
      company: '삼성전자',
      companyLogo: 'https://image.jobkorea.co.kr/User/Image/Company_Logo/2023/1/24/L_co_gyh2301242332_2c3a51.gif',
      companyInitial: 'S',
      location: '경기 평택',
      boardType: 'FULL_TIME',
      tierType: 'PREMIUM',
      salaryMin: 45000000,
      salaryMax: 55000000,
      allowedVisas: ['E-7-1', 'F-2-7'],
      closingDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
      postedDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      applicantCount: 120,
      viewCount: 3450,
      isUrgent: true,
      isFeatured: true,
      benefits: ['기숙사', '통근버스', '3식 제공'],
      experienceRequired: '신입/경력',
      industry: '제조',
      industryImage: '/images/industries/manufacturing.jpg',
      matchScore: 95,
    },
    {
      id: 'job002',
      title: '호텔 주방 보조 및 조리사',
      company: '롯데호텔',
      companyLogo: 'https://image.jobkorea.co.kr/User/Image/Company_Logo/2023/8/1/L_co_gyh2308011242_11f185.gif',
      companyInitial: 'L',
      location: '서울 중구',
      boardType: 'FULL_TIME',
      tierType: 'STANDARD',
      salaryMin: 38000000,
      salaryMax: 48000000,
      allowedVisas: ['H-1', 'F-4', 'E-7-2'],
      closingDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      postedDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      applicantCount: 75,
      viewCount: 2100,
      benefits: ['유니폼', '식사 제공'],
      experienceRequired: '2년 이상',
      industry: '숙박/음식',
      industryImage: '/images/industries/hospitality.jpg',
    },
    {
      id: 'job003',
      title: '프론트엔드 개발자 (React)',
      company: '쿠팡',
      companyLogo: 'https://image.jobkorea.co.kr/User/Image/Company_Logo/2023/4/19/L_coupang_2c41ea.gif',
      companyInitial: 'C',
      location: '서울 송파',
      boardType: 'FULL_TIME',
      tierType: 'PREMIUM',
      salaryMin: 60000000,
      salaryMax: 80000000,
      allowedVisas: ['E-7-1'],
      closingDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      postedDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      applicantCount: 250,
      viewCount: 5500,
      isFeatured: true,
      benefits: ['재택근무', '스톡옵션'],
      experienceRequired: '3년 이상',
      industry: 'IT/소프트웨어',
      industryImage: '/images/industries/it.jpg',
    },
    {
      id: 'job004',
      title: '건설 현장 관리자',
      company: '현대건설',
      companyLogo: 'https://image.jobkorea.co.kr/User/Image/Company_Logo/2022/10/24/L_co_gyh2210241042_c58f00.gif',
      companyInitial: 'H',
      location: '인천',
      boardType: 'FULL_TIME',
      tierType: 'STANDARD',
      salaryMin: 50000000,
      salaryMax: 65000000,
      allowedVisas: ['H-2', 'F-4'],
      closingDate: null, // 상시채용
      postedDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      applicantCount: 45,
      viewCount: 1800,
      benefits: ['숙소제공', '중식제공'],
      experienceRequired: '5년 이상',
      industry: '건설',
      industryImage: '/images/industries/construction.jpg',
    },
    {
      id: 'job005',
      title: '물류센터 지게차 운전원',
      company: 'CJ대한통운',
      companyLogo: 'https://image.jobkorea.co.kr/User/Image/Company_Logo/2023/6/5/L_co_gyh2306051515_8f5536.gif',
      companyInitial: 'C',
      location: '경기 이천',
      boardType: 'FULL_TIME',
      tierType: 'STANDARD',
      salaryMin: 42000000,
      salaryMax: 50000000,
      allowedVisas: ['F-2', 'F-5', 'F-6'],
      closingDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(),
      postedDate: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
      applicantCount: 60,
      viewCount: 1500,
      isUrgent: true,
      benefits: ['통근버스', '성과급'],
      experienceRequired: '1년 이상',
      industry: '물류/운송',
      industryImage: '/images/industries/logistics.jpg',
    },
    {
      id: 'job006',
      title: '용접 및 배관 보조원',
      company: '대우조선해양',
      companyLogo: 'https://image.jobkorea.co.kr/User/Image/Company_Logo/2023/5/23/L_hanwhaocean_e14578.gif',
      companyInitial: 'D',
      location: '경남 거제',
      boardType: 'FULL_TIME',
      tierType: 'STANDARD',
      salaryMin: 48000000,
      salaryMax: 60000000,
      allowedVisas: ['E-7-3', 'F-4'],
      closingDate: new Date(new Date().setDate(new Date().getDate() + 40)).toISOString(),
      postedDate: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(),
      applicantCount: 30,
      viewCount: 1200,
      benefits: ['기숙사', '3식 제공'],
      experienceRequired: '경력무관',
      industry: '제조',
      industryImage: '/images/industries/manufacturing.jpg',
    },
  ];

// 유틸리티 함수 (Utility Functions)

export const getDDay = (date: string | null): string | null => {
  if (!date) return '상시채용'; // 상시채용 (Always recruiting)
  const today = new Date();
  const closingDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  closingDate.setHours(0, 0, 0, 0);

  const diffTime = closingDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '마감'; // 마감 (Closed)
  if (diffDays === 0) return 'D-day';
  return `D-${diffDays}`;
};

export const formatSalary = (job: MockJobPostingV2): string => {
  if (job.boardType === 'PART_TIME' && job.hourlyWage) {
    return `시급 ${job.hourlyWage.toLocaleString()}원`; // Hourly wage
  }
  if (job.boardType === 'FULL_TIME' && job.salaryMin && job.salaryMax) {
    return `연봉 ${(job.salaryMin / 10000).toLocaleString()}만~${(job.salaryMax / 10000).toLocaleString()}만`; // Annual salary
  }
  if (job.boardType === 'FULL_TIME' && job.salaryMin) {
    return `연봉 ${(job.salaryMin / 10000).toLocaleString()}만원 이상`; // Annual salary (min only)
  }
  return '회사내규에 따름'; // As per company policy
};


export const getTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}년 전`; // years ago
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}달 전`; // months ago
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}일 전`; // days ago
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}시간 전`; // hours ago
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}분 전`; // minutes ago
  return `${Math.floor(seconds)}초 전`; // seconds ago
};

type ColorClasses = { bg: string; text: string; border: string };

export const getIndustryColor = (industry: string): ColorClasses => {
  switch (industry) {
    case '제조': // Manufacturing
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'before:bg-blue-500' };
    case '숙박/음식': // Hospitality/Food
      return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'before:bg-orange-500' };
    case 'IT/소프트웨어': // IT/Software
      return { bg: 'bg-violet-50', text: 'text-violet-800', border: 'before:bg-violet-500' };
    case '건설': // Construction
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'before:bg-amber-500' };
    case '물류/운송': // Logistics/Transport
      return { bg: 'bg-teal-50', text: 'text-teal-800', border: 'before:bg-teal-500' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-800', border: 'before:bg-gray-500' };
  }
};

type VisaColorClasses = { bg: string; text: string };

export const getVisaColor = (visa: string): VisaColorClasses => {
    if (visa.startsWith('E-')) return { bg: 'bg-sky-100', text: 'text-sky-800' };
    if (visa.startsWith('F-')) return { bg: 'bg-green-100', text: 'text-green-800' };
    if (visa.startsWith('H-')) return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    return { bg: 'bg-slate-100', text: 'text-slate-800' };
};
