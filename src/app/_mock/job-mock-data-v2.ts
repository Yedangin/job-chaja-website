
// Korean: 이 파일은 채용 공고 UI에 사용될 목업 데이터와 유틸리티 함수를 정의합니다.
// English: This file defines mock data and utility functions for the job posting UI.
'use client';

// Korean: 채용 공고 데이터의 타입을 정의합니다.
// English: Defines the type for the job posting data.
export interface Company {
  name: string;
  logo: string;
}

export interface Salary {
  min: number;
  max: number;
  currency: 'KRW' | 'USD';
}

export interface JobV2 {
  id: string;
  title: string;
  company: Company;
  industry: string;
  location: string;
  visas: string[];
  salary: Salary;
  createdAt: string; // ISO 8601 date string
  closingDate: string; // ISO 8601 date string
}

// Korean: 샘플 채용 공고 데이터입니다. 6개의 공고를 포함합니다.
// English: Sample job posting data. Contains 6 postings.
export const sampleJobsV2: JobV2[] = [
  {
    id: '1',
    title: 'Frontend Engineer (React)',
    company: { name: 'TechNova Inc.', logo: 'https://via.placeholder.com/150/0000FF/808080?Text=T' },
    industry: 'IT',
    location: 'Seoul, South Korea',
    visas: ['E-7', 'F-2'],
    salary: { min: 60000000, max: 80000000, currency: 'KRW' },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    closingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
  },
  {
    id: '2',
    title: 'Backend Developer (Node.js)',
    company: { name: 'DevSolutions', logo: 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=D' },
    industry: 'Software',
    location: 'Busan, South Korea',
    visas: ['E-7'],
    salary: { min: 70000000, max: 90000000, currency: 'KRW' },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: { name: 'CreativeMinds', logo: 'https://via.placeholder.com/150/00FF00/000000?Text=C' },
    industry: 'Design',
    location: 'Remote',
    visas: ['F-5', 'F-6'],
    salary: { min: 55000000, max: 75000000, currency: 'KRW' },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    closingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: { name: 'AnalyticsPlus', logo: 'https://via.placeholder.com/150/FFFF00/000000?Text=A' },
    industry: 'Data',
    location: 'Pangyo, South Korea',
    visas: ['E-7'],
    salary: { min: 80000000, max: 120000000, currency: 'KRW' },
    createdAt: new Date().toISOString(), // Just now
    closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
  },
  {
    id: '5',
    title: 'Project Manager',
    company: { name: 'GlobalConnect', logo: 'https://via.placeholder.com/150/FF00FF/FFFFFF?Text=G' },
    industry: 'Consulting',
    location: 'Seoul, South Korea',
    visas: ['F-2', 'F-5', 'F-6'],
    salary: { min: 90000000, max: 110000000, currency: 'KRW' },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    closingDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: { name: 'InfraCloud', logo: 'https://via.placeholder.com/150/00FFFF/000000?Text=I' },
    industry: 'IT',
    location: 'Remote',
    visas: ['E-7'],
    salary: { min: 75000000, max: 95000000, currency: 'KRW' },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    closingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
  }
];

// Korean: 마감일까지 남은 날짜(D-Day)를 계산합니다.
// English: Calculates the remaining days until the closing date (D-Day).
export const getDDay = (closingDate: string): string => {
  const today = new Date();
  const closing = new Date(closingDate);
  today.setHours(0, 0, 0, 0);
  closing.setHours(0, 0, 0, 0);
  const diffTime = closing.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'D-Day';
  return `D-${diffDays}`;
};

// Korean: 급여 범위를 포맷팅하여 문자열로 반환합니다.
// English: Formats the salary range and returns it as a string.
export const formatSalary = (salary: Salary): string => {
    const format = (value: number) => (value / 10000).toLocaleString('en-US');
    return `${format(salary.min)}만 ~ ${format(salary.max)}만 ${salary.currency}`;
};

// Korean: 주어진 시간으로부터 얼마나 지났는지 계산합니다.
// English: Calculates how much time has passed since the given time.
export const getTimeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        'year': 31536000,
        'month': 2592000,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
    };

    for (const key in intervals) {
        const interval = intervals[key];
        const count = Math.floor(diffInSeconds / interval);
        if (count > 0) {
            return `${count} ${key}${count > 1 ? 's' : ''} ago`;
        }
    }
    return 'Just now';
};


// Korean: 산업군에 따라 색상 클래스를 반환합니다.
// English: Returns a color class based on the industry.
export const getIndustryColor = (industry: string): string => {
  switch (industry.toLowerCase()) {
    case 'it': return 'bg-blue-100 text-blue-800';
    case 'software': return 'bg-sky-100 text-sky-800';
    case 'design': return 'bg-purple-100 text-purple-800';
    case 'data': return 'bg-green-100 text-green-800';
    case 'consulting': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Korean: 비자 종류에 따라 색상 클래스를 반환합니다.
// English: Returns a color class based on the visa type.
export const getVisaColor = (visa: string): string => {
  switch (visa.toUpperCase()) {
    case 'E-7': return 'border-green-500 text-green-600';
    case 'F-2': return 'border-blue-500 text-blue-600';
    case 'F-5': return 'border-purple-500 text-purple-600';
    case 'F-6': return 'border-red-500 text-red-600';
    default: return 'border-gray-400 text-gray-500';
  }
};
