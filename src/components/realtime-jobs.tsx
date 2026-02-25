'use client';

import { ArrowRight, MapPin, Building2, Clock, Zap } from 'lucide-react';
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
    const fmt = (v: number | null) => (v ? Math.round(v / 10000).toLocaleString() : '');
    return `연봉 ${fmt(job.fulltimeAttributes.salaryMin)}~${fmt(job.fulltimeAttributes.salaryMax)}만원`;
  }
  return '급여 협의';
}

function getDDayLabel(d: string | null): { label: string; cls: string } {
  if (!d) return { label: '', cls: '' };
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: '마감', cls: 'text-slate-400' };
  if (diff === 0) return { label: 'D-Day', cls: 'text-red-500 font-bold' };
  if (diff <= 3) return { label: `D-${diff}`, cls: 'text-red-500 font-semibold' };
  if (diff <= 7) return { label: `D-${diff}`, cls: 'text-orange-500 font-medium' };
  return { label: `D-${diff}`, cls: 'text-slate-400' };
}

const AVATAR_COLORS = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}

function StandardJobRow({ job, faded }: { job: JobPosting; faded: boolean }) {
  const companyName = job.company?.brandName || job.company?.companyName || '';
  const { label: ddayLabel, cls: ddayCls } = getDDayLabel(job.closingDate);
  const salary = formatSalary(job);
  const visas = job.allowedVisas.split(',').map((v) => v.trim()).slice(0, 3);
  const isClosed = ddayLabel === '마감';

  return (
    <div className={`group flex items-center gap-3 px-4 py-3.5 transition-all duration-150 hover:bg-sky-50/50 border-l-[3px] border-l-transparent hover:border-l-sky-400 ${faded ? 'opacity-40' : ''}`}>
      {/* Avatar */}
      <div className="shrink-0">
        {job.company?.logoImageUrl ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100">
            <Image src={job.company.logoImageUrl} alt={companyName} width={40} height={40} className="object-cover" />
          </div>
        ) : (
          <div className={`w-10 h-10 rounded-lg ${avatarColor(companyName)} flex items-center justify-center text-white font-bold text-sm`}>
            {companyName.charAt(0)}
          </div>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 min-w-0">
        <h3 className={`text-[13px] font-semibold truncate group-hover:text-sky-600 transition-colors ${isClosed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {job.title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 flex-wrap">
          <span className="flex items-center gap-0.5">
            <Building2 size={10} />{companyName}
          </span>
          <span className="flex items-center gap-0.5">
            <MapPin size={10} />{job.displayAddress}
          </span>
          <span className="flex items-center gap-0.5">
            <Clock size={10} />{job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
          <div className="flex items-center gap-1">
            {visas.map((v) => (
              <span key={v} className="text-sky-600 bg-sky-50 border border-sky-100 px-1 py-px rounded text-[10px] font-medium">{v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="shrink-0 flex flex-col items-end gap-1 min-w-[120px]">
        <span className="text-sm font-bold text-sky-600 whitespace-nowrap">{salary}</span>
        {ddayLabel && <span className={`text-[11px] ${ddayCls}`}>{ddayLabel}</span>}
        <Link
          href={job.id !== '0' ? `/jobs/${job.id}` : '#'}
          onClick={(e) => e.stopPropagation()}
          className={`text-[11px] font-semibold px-3 py-1 rounded-full transition whitespace-nowrap ${
            isClosed
              ? 'bg-slate-100 text-slate-400 pointer-events-none'
              : 'bg-slate-900 hover:bg-slate-700 text-white'
          }`}
        >
          {isClosed ? '마감' : '지원하기 →'}
        </Link>
      </div>
    </div>
  );
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
    { id: '0', title: '반도체 검사원 (야간 수당 포함)', company: { companyName: 'SK하이닉스', brandName: null, logoImageUrl: null }, displayAddress: '경기 이천시', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 5 * 86400000).toISOString(), albaAttributes: { hourlyWage: 12000 }, fulltimeAttributes: null },
    { id: '0', title: '용접사 — 경험자 우대 (주 5일)', company: { companyName: '현대자동차 아산', brandName: null, logoImageUrl: null }, displayAddress: '충남 아산시', allowedVisas: 'E-9', boardType: 'FULL_TIME', tierType: 'STANDARD', closingDate: null, albaAttributes: null, fulltimeAttributes: { salaryMin: 24000000, salaryMax: 30000000 } },
    { id: '0', title: '배송 기사 (지입차 / 4대 보험)', company: { companyName: '쿠팡로지스틱스', brandName: null, logoImageUrl: null }, displayAddress: '서울 및 경기', allowedVisas: 'F-2,F-4,F-5', boardType: 'FULL_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 12 * 86400000).toISOString(), albaAttributes: null, fulltimeAttributes: { salaryMin: 30000000, salaryMax: 35000000 } },
    { id: '0', title: '건설 인력 — 철근공 (일당제)', company: { companyName: '대우건설', brandName: null, logoImageUrl: null }, displayAddress: '서울 강남구', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 2 * 86400000).toISOString(), albaAttributes: { hourlyWage: 15000 }, fulltimeAttributes: null },
    { id: '0', title: '호텔 객실 청소원 (주 5일, 고정 스케줄)', company: { companyName: '그랜드 하얏트 서울', brandName: null, logoImageUrl: null }, displayAddress: '서울 중구', allowedVisas: 'E-9,H-2,F-4', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: null, albaAttributes: { hourlyWage: 11000 }, fulltimeAttributes: null },
    { id: '0', title: '식품 공장 라인 작업원 (일 2교대)', company: { companyName: 'CJ제일제당 진천', brandName: null, logoImageUrl: null }, displayAddress: '충북 진천군', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 8 * 86400000).toISOString(), albaAttributes: { hourlyWage: 11500 }, fulltimeAttributes: null },
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
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center shadow-sm shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">실시간 채용 정보</h2>
            <p className="text-xs text-sky-600 mt-0.5 font-medium">지금 막 올라온 최신 공고</p>
          </div>
        </div>
        <div className="flex gap-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setBoardFilter(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                boardFilter === cat.value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* List header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <span className="text-xs text-slate-500">
            공고 <span className="text-sky-600 font-bold">{displayJobs.length}</span>건
          </span>
          <div className="flex gap-1 text-[11px] text-slate-500">
            <span className="px-2 py-1 bg-sky-50 border border-sky-200 text-sky-600 rounded cursor-pointer">최신순</span>
            <span className="px-2 py-1 bg-white border border-slate-200 rounded cursor-pointer hover:bg-slate-50 transition">급여순</span>
          </div>
        </div>

        {displayJobs.map((job, idx) => (
          <div key={job.id + idx}>
            <StandardJobRow job={job} faded={showExample} />
            {idx < displayJobs.length - 1 && <div className="border-b border-slate-100 mx-4" />}
          </div>
        ))}

        <div className="border-t border-slate-100 py-3 text-center bg-slate-50/50">
          <Link href="/alba" className="inline-flex items-center gap-1.5 text-sm text-sky-600 font-medium hover:text-sky-700 hover:underline transition-colors">
            더 많은 공고 보기 <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {showExample && (
        <p className="text-center text-xs text-slate-400 mt-2">위 공고는 예시입니다. 실제 공고가 등록되면 표시됩니다.</p>
      )}
    </section>
  );
}
