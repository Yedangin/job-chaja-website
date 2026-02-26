'use client';

import { ArrowRight, MapPin, Crown } from 'lucide-react';
import Image from 'next/image';
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

function formatSalary(job: JobPosting): string {
  if (job.albaAttributes) return `시급 ${job.albaAttributes.hourlyWage.toLocaleString()}원`;
  if (job.fulltimeAttributes) {
    const lo = job.fulltimeAttributes.salaryMin;
    const hi = job.fulltimeAttributes.salaryMax;
    const fmt = (v: number | null) => (v ? Math.round(v / 10000).toLocaleString() : '');
    return `연봉 ${fmt(lo)}~${fmt(hi)}만원`;
  }
  return '급여 협의';
}

function getDDayLabel(d: string | null): { label: string; cls: string } {
  if (!d) return { label: '', cls: '' };
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: '마감', cls: 'text-slate-300' };
  if (diff === 0) return { label: 'D-Day', cls: 'text-red-300 font-bold' };
  if (diff <= 3) return { label: `D-${diff}`, cls: 'text-red-300 font-semibold' };
  if (diff <= 7) return { label: `D-${diff}`, cls: 'text-amber-200 font-medium' };
  return { label: `D-${diff}`, cls: 'text-amber-100/70' };
}

const AVATAR_COLORS = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}

function PremiumJobCard({ job, faded }: { job: JobPosting; faded: boolean }) {
  const companyName = job.company?.brandName || job.company?.companyName || '';
  const { label: ddayLabel, cls: ddayCls } = getDDayLabel(job.closingDate);
  const salary = formatSalary(job);
  const visas = job.allowedVisas.split(',').map((v) => v.trim()).slice(0, 4);
  const isClosed = ddayLabel === '마감';

  return (
    <div
      className={`group bg-white rounded-2xl border border-amber-100 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col ${faded ? 'opacity-40' : ''}`}
    >
      {/* Amber gradient header band */}
      <div className="bg-linear-to-r from-amber-400 to-amber-300 px-4 py-2.5 flex items-center justify-between shrink-0">
        <span className="text-[11px] font-bold text-amber-900 bg-white/40 px-2 py-0.5 rounded-md">
          ★ PREMIUM
        </span>
        {ddayLabel && (
          <span className={`text-[11px] font-semibold ${ddayCls}`}>{ddayLabel}</span>
        )}
      </div>

      {/* Card body */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Company row */}
        <div className="flex items-center gap-2.5 mb-2.5">
          {job.company?.logoImageUrl ? (
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-100 shadow-sm shrink-0">
              <Image src={job.company.logoImageUrl} alt={companyName} width={36} height={36} className="object-cover" />
            </div>
          ) : (
            <div className={`w-9 h-9 rounded-xl ${avatarColor(companyName)} flex items-center justify-center text-white font-bold text-base shadow-sm ring-2 ring-amber-100 shrink-0`}>
              {companyName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{companyName}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
              <MapPin size={9} className="shrink-0" />
              <span className="truncate">{job.displayAddress}</span>
            </p>
          </div>
        </div>

        {/* Job title */}
        <h3 className={`text-[13px] font-bold leading-snug mb-2.5 line-clamp-2 group-hover:text-amber-700 transition-colors ${isClosed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {job.title}
        </h3>

        {/* Visa + type badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {visas.map((visa) => (
            <span key={visa} className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
              {visa}
            </span>
          ))}
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
            job.boardType === 'FULL_TIME'
              ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
              : 'text-orange-700 bg-orange-50 border-orange-100'
          }`}>
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
        </div>

        {/* Footer: salary + apply button */}
        <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-slate-50">
          <span className="text-base font-bold text-amber-600">{salary}</span>
          <Link
            href={job.id !== '0' ? `/jobs/${job.id}` : '#'}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs font-bold px-4 py-1.5 rounded-full transition whitespace-nowrap ${
              isClosed
                ? 'bg-slate-100 text-slate-400 pointer-events-none'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
            }`}
          >
            {isClosed ? '마감' : '지원하기 →'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PremiumJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    fetch('/api/jobs/listing?tierType=PREMIUM&limit=6')
      .then((res) => res.json())
      .then((data) => { if (data.items) setJobs(data.items); })
      .catch(() => {});
  }, []);

  const showExample = jobs.length === 0;
  const exampleJobs: JobPosting[] = [
    { id: '0', title: '반도체 생산라인 오퍼레이터 (기숙사 제공)', company: { companyName: '삼성전자 평택', brandName: null, logoImageUrl: null }, displayAddress: '경기 평택시', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 14 * 86400000).toISOString(), albaAttributes: { hourlyWage: 14000 }, fulltimeAttributes: null },
    { id: '0', title: '건설 현장 안전관리자 (경험자 우대, 연봉 협의)', company: { companyName: '현대건설', brandName: null, logoImageUrl: null }, displayAddress: '서울 강남구', allowedVisas: 'E-7,F-2', boardType: 'FULL_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 3 * 86400000).toISOString(), albaAttributes: null, fulltimeAttributes: { salaryMin: 30000000, salaryMax: 40000000 } },
    { id: '0', title: '호텔 주방 스태프 (식사 제공, 주 5일)', company: { companyName: '신라 호텔 서울', brandName: null, logoImageUrl: null }, displayAddress: '서울 중구', allowedVisas: 'E-9,H-2,F-4', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 30 * 86400000).toISOString(), albaAttributes: { hourlyWage: 12000 }, fulltimeAttributes: null },
    { id: '0', title: '물류센터 포장/분류 직원 (통근버스 제공)', company: { companyName: 'CJ대한통운 인천', brandName: null, logoImageUrl: null }, displayAddress: '인천 남동구', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: null, albaAttributes: { hourlyWage: 13000 }, fulltimeAttributes: null },
  ];

  const displayJobs = showExample ? exampleJobs : jobs;

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm shrink-0">
            <Crown size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">주목할 만한 공고</h2>
            <p className="text-xs text-amber-600 mt-0.5 font-medium">프리미엄 파트너 공고</p>
          </div>
        </div>
        <Link href="/alba" className="text-sm text-slate-500 hover:text-amber-600 transition flex items-center gap-1 font-medium">
          전체보기 <ArrowRight size={14} />
        </Link>
      </div>

      {/* 4-column card grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {displayJobs.map((job, idx) => (
          <PremiumJobCard key={job.id + idx} job={job} faded={showExample} />
        ))}
      </div>

      {showExample && (
        <p className="text-center text-xs text-slate-400 mt-3">위 공고는 예시입니다.</p>
      )}
    </section>
  );
}
