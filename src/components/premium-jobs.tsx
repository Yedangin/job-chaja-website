'use client';

import { ArrowRight } from 'lucide-react';
import JobCard from '@/components/job-card';
import { Card } from '@/components/ui/card';

const premiumJobs = [
  {
    id: 1,
    title: '반도체 생산라인 오퍼레이터 (기숙사 제공)',
    company: '삼성전자 평택',
    location: '경기 평택시',
    salary: '월 280만원 이상',
    workHours: '09:00 - 18:00 (주 5일)',
    jobType: '제조/생산',
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: '건설 현장 안전관리자 (경험자 우대)',
    company: '현대건설 강남',
    location: '서울 강남구',
    salary: '월 250만원 이상',
    workHours: '08:00 - 17:00 (주 6일)',
    jobType: '건설/현장',
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1581092162562-40038f88f36d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: '음식점 주방 스태프 (식사 제공)',
    company: '신라 호텔 서울',
    location: '서울 중구',
    salary: '월 180만원 이상',
    workHours: '변동근무',
    jobType: '서비스/식음료',
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1578992269411-3e7b0c2c7d43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    title: '물류센터 포장 직원 (통근버스)',
    company: 'CJ대한통운 인천',
    location: '인천 남동구',
    salary: '월 200만원 이상',
    workHours: '08:00 - 16:00 (주 5일)',
    jobType: '물류',
    isPremium: true,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-495afbf34672?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

export default function PremiumJobs() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          <span className="text-[#0ea5e9] mr-2">Premium</span>주목할 만한 공고
        </h2>
        <a href="#" className="text-sm font-medium text-slate-500 hover:text-[#0284c7] transition flex items-center gap-1">
          전체보기 <ArrowRight size={16} />
        </a>
      </div>

      <div className="flex gap-5 overflow-x-auto hide-scroll pb-4 -mx-4 px-4 scroll-smooth">
        {premiumJobs.map((job) => (
          <div key={job.id} className="flex-shrink-0 w-80">
            <JobCard {...job} />
          </div>
        ))}
      </div>
    </section>
  );
}
