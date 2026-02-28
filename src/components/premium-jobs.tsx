'use client';

import { ArrowRight, MapPin, Star, Briefcase, Crown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchWithRetry } from '@/lib/fetch-utils';

/* ── 타입 / Types ── */
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

/* ── 유틸 / Utilities ── */
function fmtSalary(j: JobPosting): string {
  if (j.albaAttributes) return `시급 ${j.albaAttributes.hourlyWage.toLocaleString()}원`;
  if (j.fulltimeAttributes) {
    const lo = j.fulltimeAttributes.salaryMin;
    const hi = j.fulltimeAttributes.salaryMax;
    const f = (v: number | null) => (v ? Math.round(v / 10000).toLocaleString() : '');
    if (lo && hi) return `${f(lo)}~${f(hi)}만원`;
    if (lo) return `${f(lo)}만원~`;
    return '협의';
  }
  return '협의';
}

function dday(d: string | null): { t: string; cls: string } {
  if (!d) return { t: '상시', cls: 'bg-white/15 text-white/70' };
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { t: '마감', cls: 'bg-white/10 text-white/40' };
  if (diff === 0) return { t: 'D-Day', cls: 'bg-red-500/80 text-white font-bold' };
  if (diff <= 3) return { t: `D-${diff}`, cls: 'bg-red-500/70 text-white' };
  if (diff <= 7) return { t: `D-${diff}`, cls: 'bg-amber-500/60 text-white' };
  return { t: `D-${diff}`, cls: 'bg-white/15 text-white/70' };
}

/* 업종별 배경 이미지 / Industry background images */
const INDUSTRY_IMAGES = [
  '/images/premium/factory.jpg',
  '/images/premium/construction.jpg',
  '/images/premium/hotel.jpg',
  '/images/premium/warehouse.jpg',
  '/images/premium/automotive.jpg',
];

/* 파란색 미세 바리에이션 (1~3번 유지, 4~5 조정) / Blue micro-variations */
interface CardTheme { r: number; g: number; b: number; dark: string; mid: string }
const CARD_THEMES: CardTheme[] = [
  { r: 15, g: 23, b: 42, dark: '#0f172a', mid: '#162033' },
  { r: 12, g: 35, b: 60, dark: '#0c233c', mid: '#132d4a' },
  { r: 18, g: 30, b: 52, dark: '#121e34', mid: '#1a2840' },
  { r: 22, g: 22, b: 48, dark: '#161630', mid: '#1e1e3e' },
  { r: 10, g: 40, b: 58, dark: '#0a283a', mid: '#103348' },
];

/* 로고: 컨테이너 없이 이미지 직접 표시 — 계단현상 원천 차단 / Logo: no container, direct render */
const INITIAL_BG = ['bg-slate-700', 'bg-sky-800', 'bg-indigo-800', 'bg-emerald-800', 'bg-violet-800'];
function Logo({ job, size }: { job: JobPosting; size: number }) {
  const n = job.company?.brandName || job.company?.companyName || '';
  if (job.company?.logoImageUrl) {
    return (
      <Image
        src={job.company.logoImageUrl}
        alt={n}
        width={size}
        height={size}
        className="shrink-0 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
      />
    );
  }
  const bg = INITIAL_BG[(n.charCodeAt(0) || 0) % INITIAL_BG.length];
  return (
    <div
      className={`rounded-xl ${bg} flex items-center justify-center text-white font-bold shrink-0 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {n.charAt(0)}
    </div>
  );
}

/* ── 프리미엄 카드 / Premium card ── */
const CELL_H = 290;

function PremiumCard({ job, imageIndex }: { job: JobPosting; imageIndex: number }) {
  const [h, setH] = useState(false);
  const n = job.company?.brandName || job.company?.companyName || '';
  const dd = dday(job.closingDate);
  const visas = job.allowedVisas.split(',').map(v => v.trim());
  const bgImage = INDUSTRY_IMAGES[imageIndex % INDUSTRY_IMAGES.length];
  const theme = CARD_THEMES[imageIndex % CARD_THEMES.length];
  const tint = (a: number) => `rgba(${theme.r},${theme.g},${theme.b},${a})`;

  return (
    <div className="relative" style={{ height: CELL_H }}>
      <div
        className={`absolute inset-x-0 top-0 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
          h ? 'z-20 shadow-[0_12px_40px_rgba(0,0,0,0.2)]' : 'z-0 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
        }`}
        style={{ border: h ? '1px solid rgba(14,165,233,0.3)' : '1px solid #e2e8f0' }}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
      >
        {/* 상단 이미지 영역 / Top image area */}
        <div className="h-[100px] relative overflow-hidden">
          <Image
            src={bgImage}
            alt=""
            fill
            className={`object-cover transition-all duration-500 ${h ? 'scale-110 blur-[2px]' : 'scale-100'}`}
            sizes="250px"
          />
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${h ? 'opacity-80' : 'opacity-30'}`}
            style={{ background: `linear-gradient(to bottom, ${tint(0.4)}, ${tint(0.85)})` }}
          />
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm ${dd.cls}`}>{dd.t}</span>
          </div>
          <div className="absolute top-2.5 left-2.5 z-10">
            <Star size={14} className="text-white/50 cursor-pointer hover:text-yellow-400 transition-colors" onClick={e => e.stopPropagation()} />
          </div>
        </div>

        {/* 하단 다크 오버레이 (호버) / Info dark overlay on hover */}
        <div
          className={`absolute inset-x-0 top-[100px] bottom-0 transition-opacity duration-300 pointer-events-none ${h ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: `linear-gradient(to bottom, ${theme.dark}, ${theme.mid})` }}
        />

        {/* 콘텐츠 / Content */}
        <div className="relative z-10 -mt-6 flex flex-col items-center text-center px-3.5">
          <Logo job={job} size={48} />

          <p className={`text-[12px] font-semibold truncate w-full mt-2 transition-colors duration-300 ${h ? 'text-white' : 'text-slate-800'}`}>
            {n}
          </p>
          <p className={`text-[10px] flex items-center gap-0.5 mt-0.5 mb-3 transition-colors duration-300 ${h ? 'text-white/35' : 'text-slate-400'}`}>
            <MapPin size={9} />{job.displayAddress}
          </p>
          <h3 className={`text-[12px] font-bold leading-snug line-clamp-2 mb-2.5 transition-colors duration-300 ${h ? 'text-white' : 'text-slate-900'}`}>
            {job.title}
          </h3>
          <p className={`text-[14px] font-bold mb-1.5 transition-colors duration-300 ${h ? 'text-sky-300' : 'text-sky-600'}`}>
            {fmtSalary(job)}
          </p>
          <p className={`text-[10px] mb-4 transition-colors duration-300 ${h ? 'text-white/40' : 'text-slate-400'}`}>
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </p>
        </div>

        {/* 확장 영역 / Expansion */}
        <div className="relative z-10 overflow-hidden transition-all duration-300 ease-out" style={{ maxHeight: h ? 130 : 0, opacity: h ? 1 : 0 }}>
          <div className="px-3.5 pb-3.5">
            <div className="border-t border-white/10 pt-2.5 space-y-2">
              {/* 비자 칩 / Visa type chips */}
              <div className="flex flex-wrap gap-1">
                {visas.map(v => (
                  <span key={v} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-medium">{v}</span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
                <Briefcase size={10} /> {job.boardType === 'FULL_TIME' ? '정규직 · 4대보험' : '파트타임 · 시급제'}
              </div>
              <Link href={job.id !== '0' ? `/jobs/${job.id}` : '#'} className="block text-[10px] text-center bg-sky-500 hover:bg-sky-400 text-white rounded-md py-1.5 font-semibold transition-colors" onClick={e => e.stopPropagation()}>상세보기</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 예시 데이터 — SVG 로고 / Example data with SVG logos ── */
const EXAMPLES: JobPosting[] = [
  { id: '0', title: '반도체 생산라인 오퍼레이터 (기숙사 제공)', company: { companyName: '삼성전자', brandName: null, logoImageUrl: '/images/logos/samsung.svg' }, displayAddress: '경기 평택시', allowedVisas: 'E-9,H-2,F-4', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 14 * 86400000).toISOString(), albaAttributes: { hourlyWage: 14000 }, fulltimeAttributes: null },
  { id: '0', title: '건설 현장 안전관리자 (경험자 우대)', company: { companyName: '현대건설', brandName: null, logoImageUrl: '/images/logos/hyundai-enc.svg' }, displayAddress: '서울 강남구', allowedVisas: 'E-7,F-2,F-5,F-6', boardType: 'FULL_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 3 * 86400000).toISOString(), albaAttributes: null, fulltimeAttributes: { salaryMin: 30000000, salaryMax: 40000000 } },
  { id: '0', title: '호텔 주방 스태프 (식사 제공)', company: { companyName: '신라호텔', brandName: null, logoImageUrl: '/images/logos/shilla.svg' }, displayAddress: '서울 중구', allowedVisas: 'E-9,H-2,F-4', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 30 * 86400000).toISOString(), albaAttributes: { hourlyWage: 12000 }, fulltimeAttributes: null },
  { id: '0', title: '물류센터 포장/분류 직원', company: { companyName: 'CJ대한통운', brandName: null, logoImageUrl: '/images/logos/cj-logistics.svg' }, displayAddress: '인천 남동구', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: null, albaAttributes: { hourlyWage: 13000 }, fulltimeAttributes: null },
  { id: '0', title: '자동차 부품 품질검사원', company: { companyName: '현대모비스', brandName: null, logoImageUrl: '/images/logos/mobis.svg' }, displayAddress: '울산 북구', allowedVisas: 'E-9,H-2,F-2', boardType: 'FULL_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 7 * 86400000).toISOString(), albaAttributes: null, fulltimeAttributes: { salaryMin: 28000000, salaryMax: 35000000 } },
];

/* ── 메인 / Main ── */
interface PremiumJobsProps {
  boardFilter?: string; // '' = 전체, 'PART_TIME' = 알바, 'FULL_TIME' = 정규직
}

export default function PremiumJobs({ boardFilter = '' }: PremiumJobsProps) {
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    fetchWithRetry('/api/jobs/listing?tierType=PREMIUM&limit=10')
      .then((res) => res.json())
      .then((data) => { if (data.items?.length) setJobs(data.items); })
      .catch(() => {});
  }, []);

  /* API 데이터 있으면 표시, 없으면 예시 / Show real data if available, fallback to examples */
  const showExample = jobs.length === 0;
  let all = showExample ? EXAMPLES : jobs;
  if (boardFilter) all = all.filter((j) => j.boardType === boardFilter);
  const display = all.slice(0, 5);

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
            <Crown size={14} className="text-white" />
          </div>
          <h2 className="text-[17px] font-bold text-slate-900">프리미엄 채용</h2>
        </div>
        <Link href="/alba" className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
          전체보기 <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {display.map((job, i) => (
          <PremiumCard key={i} job={job} imageIndex={i} />
        ))}
      </div>

      {showExample && (
        <p className="text-center text-[11px] text-slate-400 mt-4">위 공고는 예시입니다. 실제 프리미엄 공고가 등록되면 표시됩니다.</p>
      )}
    </section>
  );
}
