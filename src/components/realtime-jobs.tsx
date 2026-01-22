'use client';

import { Button } from '@/components/ui/button';
import JobCard from '@/components/job-card';

const realtimeJobs = [
  {
    title: '반도체 검사원 (9급)',
    company: 'SK하이닉스 이천',
    location: '경기 이천시',
    salary: '월 260만원',
    jobType: '제조/생산',
  },
  {
    title: '용접사 (경험자 우대)',
    company: '현대자동차 아산',
    location: '충남 아산시',
    salary: '월 240만원',
    jobType: '제조/생산',
  },
  {
    title: '배송 기사 (지입차)',
    company: '쿠팡로지스틱스',
    location: '서울 및 경기',
    salary: '월 350만원 예상',
    jobType: '배송/물류',
  },
  {
    title: '건설 인력 (철근공)',
    company: '대우건설',
    location: '서울 강남구',
    salary: '일급 18만원',
    jobType: '건설/현장',
  },
  {
    title: '호텔 청소원',
    company: '그랜드 하얏트 서울',
    location: '서울 중구',
    salary: '월 190만원',
    jobType: '서비스/숙박',
  }
  // {
  //   title: '식당 주방 보조',
  //   company: '라면당 강남점',
  //   location: '서울 강남구',
  //   salary: '월 170만원 + 식사',
  //   jobType: '음식점',
  // },
  // {
  //   title: '편의점 아르바이트',
  //   company: 'CU 편의점',
  //   location: '서울 전역',
  //   salary: '시급 10,900원',
  //   jobType: '서비스',
  // },
  // {
  //   title: '택배 분류 직원',
  //   company: 'GS로젠',
  //   location: '인천 남동구',
  //   salary: '월 220만원',
  //   jobType: '물류',
  // },
];

export default function RealtimeJobs() {
  const categories = ['전체', '제조업', '서비스업'];

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">실시간 채용 정보</h2>
        <div className="flex gap-2 text-sm">
          {categories.map((cat, idx) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded-full font-medium transition ${idx === 0
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-500 border border-gray-200 hover:border-slate-400'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {realtimeJobs.map((job, idx) => (
          <JobCard key={idx} {...job} />
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          className="px-8 py-3 rounded-full border-gray-200 text-slate-600 font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 bg-transparent"
        >
          더 많은 공고 보기 (24+)
        </Button>
      </div>
    </section>
  );
}
