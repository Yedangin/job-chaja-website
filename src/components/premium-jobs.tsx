'use client';

import { ArrowRight, MapPin, Building2, Clock, Crown } from 'lucide-react';
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
  if (diff < 0) return { label: '마감', cls: 'text-slate-400 line-through' };
  if (diff === 0) return { label: 'D-Day', cls: 'text-red-600 font-bold' };
  if (diff <= 3) return { label: `D-${diff}`, cls: 'text-red-600 font-semibold' };
  if (diff <= 7) return { label: `D-${diff}`, cls: 'text-orange-500 font-medium' };
  return { label: `D-${diff}`, cls: 'text-slate-500' };
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
      className={`group relative flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-150 hover:bg-amber-50/60 border-l-[3px] border-l-amber-400 ${faded ? 'opacity-40' : ''}`}
    >
      {/* Company logo / avatar */}
      <div className="shrink-0">
        {job.company?.logoImageUrl ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-100 shadow-sm">
            <Image src={job.company.logoImageUrl} alt={companyName} width={48} height={48} className="object-cover" />
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-xl ${avatarColor(companyName)} flex items-center justify-center text-white font-bold text-lg shadow-sm ring-2 ring-amber-200/70`}>
            {companyName.charAt(0)}
          </div>
        )}
      </div>

      {/* Center: title + meta + badges */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">
            ★ PREMIUM
          </span>
          <h3 className={`text-[15px] font-semibold text-slate-900 truncate group-hover:text-amber-700 transition-colors ${isClosed ? 'line-through text-slate-400' : ''}`}>
            {job.title}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-1.5 flex-wrap">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />{companyName}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />{job.displayAddress}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {visas.map((visa) => (
            <span key={visa} className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              {visa}
            </span>
          ))}
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
            job.boardType === 'FULL_TIME'
              ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
              : 'text-orange-700 bg-orange-50 border-orange-100'
          }`}>
            {job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'}
          </span>
        </div>
      </div>

      {/* Right: salary + D-day + action */}
      <div className="shrink-0 flex flex-col items-end gap-2 min-w-[140px]">
        <span className="text-base font-bold text-amber-600 whitespace-nowrap">{salary}</span>
        {ddayLabel && <span className={`text-xs ${ddayCls}`}>{ddayLabel}</span>}
        <Link
          href={job.id !== '0' ? `/jobs/${job.id}` : '#'}
          onClick={(e) => e.stopPropagation()}
          className={`text-xs font-semibold px-4 py-1.5 rounded-full transition whitespace-nowrap ${
            isClosed
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
          }`}
        >
          {isClosed ? '마감' : '지원하기 →'}
        </Link>
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
      <div className="flex items-center justify-between mb-3">
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

      <div className="bg-white rounded-2xl shadow-md border border-amber-200/80 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-amber-50/70 border-b border-amber-100">
          <span className="text-xs font-medium text-slate-600">
            프리미엄 공고 <span className="text-amber-600 font-bold">{displayJobs.length}</span>건
          </span>
          <div className="flex gap-1 text-xs text-slate-500">
            <span className="px-2 py-1 bg-white border border-slate-200 rounded cursor-pointer hover:bg-slate-50 transition">최신순</span>
            <span className="px-2 py-1 bg-amber-100 border border-amber-200 text-amber-700 rounded cursor-pointer">급여순</span>
          </div>
        </div>

        {displayJobs.map((job, idx) => (
          <div key={job.id + idx}>
            <PremiumJobCard job={job} faded={showExample} />
            {idx < displayJobs.length - 1 && <div className="border-b border-amber-50 mx-5" />}
          </div>
        ))}

        <div className="border-t border-amber-100 py-3.5 text-center bg-amber-50/40">
          <Link href="/alba" className="inline-flex items-center gap-1.5 text-sm text-amber-600 font-medium hover:text-amber-700 hover:underline transition-colors">
            더 많은 프리미엄 공고 보기 <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {showExample && (
        <p className="text-center text-xs text-slate-400 mt-2">위 공고는 예시입니다.</p>
      )}
    </section>
  );
}
