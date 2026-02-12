'use client';

import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface JobPosting {
  id: string;
  title: string;
  boardType: string;
  tierType: string;
  displayAddress: string;
  allowedVisas: string;
  closingDate: string | null;
  albaAttributes: { hourlyWage: number } | null;
  fulltimeAttributes: { salaryMin: number | null; salaryMax: number | null } | null;
  company: {
    companyName: string;
    brandName: string | null;
    logoImageUrl: string | null;
  } | null;
}

function formatSalaryWon(val: number | null): string {
  if (!val) return '';
  if (val >= 10000) return Math.round(val / 10000).toLocaleString();
  return val.toLocaleString();
}

export default function PremiumJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    fetch('/api/jobs/listing?tierType=PREMIUM&limit=8')
      .then((res) => res.json())
      .then((data) => { if (data.items) setJobs(data.items); })
      .catch(() => {});
  }, []);

  const getDDay = (d: string | null) => {
    if (!d) return null;
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
    if (diff < 0) return '마감';
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  const showExample = jobs.length === 0;
  const exampleJobs: JobPosting[] = [
    { id: '0', title: '반도체 생산라인 오퍼레이터 (기숙사 제공)', company: { companyName: '삼성전자 평택', brandName: null, logoImageUrl: null }, displayAddress: '경기 평택시', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: null, albaAttributes: { hourlyWage: 14000 }, fulltimeAttributes: null },
    { id: '0', title: '건설 현장 안전관리자 (경험자 우대)', company: { companyName: '현대건설 강남', brandName: null, logoImageUrl: null }, displayAddress: '서울 강남구', allowedVisas: 'E-7,F-2', boardType: 'FULL_TIME', tierType: 'PREMIUM', closingDate: null, albaAttributes: null, fulltimeAttributes: { salaryMin: 30000000, salaryMax: 40000000 } },
    { id: '0', title: '음식점 주방 스태프 (식사 제공)', company: { companyName: '신라 호텔 서울', brandName: null, logoImageUrl: null }, displayAddress: '서울 중구', allowedVisas: 'E-9,H-2,F-4', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: null, albaAttributes: { hourlyWage: 12000 }, fulltimeAttributes: null },
    { id: '0', title: '물류센터 포장 직원 (통근버스)', company: { companyName: 'CJ대한통운 인천', brandName: null, logoImageUrl: null }, displayAddress: '인천 남동구', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: null, albaAttributes: { hourlyWage: 13000 }, fulltimeAttributes: null },
  ];

  const displayJobs = showExample ? exampleJobs : jobs;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">주목할 만한 공고</h2>
          <p className="text-xs text-gray-500 mt-0.5">프리미엄 채용 공고를 확인하세요</p>
        </div>
        <Link href="/alba" className="text-sm text-gray-500 hover:text-blue-600 transition flex items-center gap-1">
          전체보기 <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayJobs.map((job, idx) => (
          <Link key={job.id + idx} href={job.id !== '0' ? `/jobs/${job.id}` : '#'}>
            <div className={`dashboard-card p-4 hover:border-blue-300 transition group cursor-pointer ${showExample ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">PREMIUM</span>
                {getDDay(job.closingDate) ? (
                  <span className={`text-[11px] font-semibold ${getDDay(job.closingDate) === '마감' ? 'text-red-500' : 'text-blue-600'}`}>
                    {getDDay(job.closingDate)}
                  </span>
                ) : null}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {job.title}
              </h3>
              <p className="text-xs text-gray-500 mb-2.5">{job.company?.brandName || job.company?.companyName}</p>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{job.displayAddress}
                </div>
                {job.albaAttributes && (
                  <div className="text-blue-600 font-semibold">
                    시급 {job.albaAttributes.hourlyWage.toLocaleString()}원
                  </div>
                )}
                {job.fulltimeAttributes && (
                  <div className="text-blue-600 font-semibold">
                    연봉 {formatSalaryWon(job.fulltimeAttributes.salaryMin)}~{formatSalaryWon(job.fulltimeAttributes.salaryMax)}만원
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-gray-100">
                {job.allowedVisas.split(',').slice(0, 3).map((visa) => (
                  <span key={visa} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
                    {visa.trim()}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {showExample && (
        <p className="text-center text-xs text-gray-400 mt-3">위 공고는 예시입니다. 실제 프리미엄 공고가 등록되면 표시됩니다.</p>
      )}
    </section>
  );
}
