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

export default function RealtimeJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [boardFilter, setBoardFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ limit: '8' });
    if (boardFilter) params.set('boardType', boardFilter);
    fetch(`/api/jobs/listing?${params}`)
      .then((res) => res.json())
      .then((data) => { if (data.items) setJobs(data.items); })
      .catch(() => {});
  }, [boardFilter]);

  const showExample = jobs.length === 0;
  const exampleJobs: JobPosting[] = [
    { id: '0', title: '반도체 검사원 (9급)', company: { companyName: 'SK하이닉스 이천', brandName: null, logoImageUrl: null }, displayAddress: '경기 이천시', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: null, albaAttributes: { hourlyWage: 12000 }, fulltimeAttributes: null },
    { id: '0', title: '용접사 (경험자 우대)', company: { companyName: '현대자동차 아산', brandName: null, logoImageUrl: null }, displayAddress: '충남 아산시', allowedVisas: 'E-9', boardType: 'FULL_TIME', tierType: 'STANDARD', closingDate: null, albaAttributes: null, fulltimeAttributes: { salaryMin: 24000000, salaryMax: 30000000 } },
    { id: '0', title: '배송 기사 (지입차)', company: { companyName: '쿠팡로지스틱스', brandName: null, logoImageUrl: null }, displayAddress: '서울 및 경기', allowedVisas: 'F-2,F-4,F-5', boardType: 'FULL_TIME', tierType: 'STANDARD', closingDate: null, albaAttributes: null, fulltimeAttributes: { salaryMin: 30000000, salaryMax: 35000000 } },
    { id: '0', title: '건설 인력 (철근공)', company: { companyName: '대우건설', brandName: null, logoImageUrl: null }, displayAddress: '서울 강남구', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: null, albaAttributes: { hourlyWage: 15000 }, fulltimeAttributes: null },
    { id: '0', title: '호텔 청소원', company: { companyName: '그랜드 하얏트 서울', brandName: null, logoImageUrl: null }, displayAddress: '서울 중구', allowedVisas: 'E-9,H-2,F-4', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: null, albaAttributes: { hourlyWage: 11000 }, fulltimeAttributes: null },
  ];

  const displayJobs = showExample ? exampleJobs : jobs;
  const categories = [
    { label: '전체', value: '' },
    { label: '알바', value: 'PART_TIME' },
    { label: '정규직', value: 'FULL_TIME' },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">실시간 채용 정보</h2>
        <div className="flex gap-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setBoardFilter(cat.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                boardFilter === cat.value
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">공고명</th>
              <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden sm:table-cell">기업</th>
              <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell">지역</th>
              <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">급여</th>
              <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell">비자</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayJobs.map((job, idx) => (
              <tr key={job.id + idx} className={`hover:bg-gray-50 transition cursor-pointer group ${showExample ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3">
                  <Link href={job.id !== '0' ? `/jobs/${job.id}` : '#'} className="block">
                    <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{job.title}</p>
                    <p className="text-xs text-gray-400 sm:hidden mt-0.5">{job.company?.brandName || job.company?.companyName}</p>
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{job.company?.brandName || job.company?.companyName}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-gray-400 text-xs">{job.displayAddress}</span>
                </td>
                <td className="px-4 py-3">
                  {job.albaAttributes && (
                    <span className="font-semibold text-blue-600 text-xs">시급 {job.albaAttributes.hourlyWage.toLocaleString()}원</span>
                  )}
                  {job.fulltimeAttributes && (
                    <span className="font-semibold text-blue-600 text-xs">
                      {formatSalaryWon(job.fulltimeAttributes.salaryMin)}~{formatSalaryWon(job.fulltimeAttributes.salaryMax)}만원
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {job.allowedVisas.split(',').slice(0, 2).map((visa) => (
                      <span key={visa} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
                        {visa.trim()}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showExample && (
        <p className="text-center text-xs text-gray-400 mt-3">위 공고는 예시입니다. 실제 공고가 등록되면 표시됩니다.</p>
      )}

      <div className="text-center mt-5">
        <Link
          href="/alba"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-white border border-gray-200 rounded-md text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition"
        >
          더 많은 공고 보기 <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
