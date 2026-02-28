'use client';

import { ArrowRight, MapPin, Zap, Briefcase } from 'lucide-react';
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

/* ── 가로 1줄 공고 행 + 호버 확장 / Horizontal job row + hover expansion ── */
function JobRow({ job, faded }: { job: JobPosting; faded: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const companyName = job.company?.brandName || job.company?.companyName || '';
  const { label: ddayLabel, cls: ddayCls } = getDDayLabel(job.closingDate);
  const salary = formatSalary(job);
  const visas = job.allowedVisas.split(',').map(v => v.trim());
  const isClosed = ddayLabel === '마감';

  return (
    <div
      className={faded ? 'opacity-40' : ''}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* 메인 행 / Main row */}
      <div className={`flex items-center gap-3 px-4 py-3 transition-colors duration-150 ${expanded ? 'bg-sky-50/40' : ''}`}>
        {/* 로고 / Logo */}
        <div className="shrink-0">
          {job.company?.logoImageUrl ? (
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-100">
              <Image src={job.company.logoImageUrl} alt={companyName} width={36} height={36} className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className={`w-9 h-9 rounded-lg ${avatarColor(companyName)} flex items-center justify-center text-white font-bold text-xs`}>
              {companyName.charAt(0)}
            </div>
          )}
        </div>

        {/* 회사명 / Company */}
        <div className="w-28 shrink-0">
          <p className="text-[12px] font-semibold text-slate-700 truncate">{companyName}</p>
        </div>

        {/* 제목 / Title */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-[13px] font-semibold truncate ${isClosed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
            {job.title}
          </h3>
        </div>

        {/* 위치 / Location */}
        <div className="shrink-0 hidden sm:flex items-center gap-0.5 text-[11px] text-slate-400">
          <MapPin size={10} />{job.displayAddress}
        </div>

        {/* 급여 / Salary */}
        <div className="shrink-0 text-[13px] font-bold text-sky-600 min-w-[120px] text-right">{salary}</div>

        {/* D-day */}
        {ddayLabel && <span className={`shrink-0 text-[11px] min-w-9 text-right ${ddayCls}`}>{ddayLabel}</span>}
      </div>

      {/* 확장 영역 (호버 시 상세 정보) / Expansion on hover — detailed info */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: expanded ? 130 : 0, opacity: expanded ? 1 : 0 }}
      >
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
          {/* 1행: 비자 칩 + 고용형태 / Row 1: Visa chips + employment */}
          <div className="flex items-center gap-3 mb-2.5">
            <div className="flex items-center gap-1 flex-wrap">
              {visas.map(v => (
                <span key={v} className="text-[11px] text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded font-semibold">{v}</span>
              ))}
            </div>
            <span className="text-[11px] text-slate-600 flex items-center gap-1 shrink-0">
              <Briefcase size={11} />
              {job.boardType === 'FULL_TIME' ? '정규직 · 4대보험' : '파트타임 · 시급제'}
            </span>
          </div>

          {/* 2행: 상세 조건 / Row 2: Detailed conditions */}
          <div className="flex items-center gap-4 mb-2.5 text-[11px] text-slate-700">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-slate-500" />
              {job.displayAddress}
            </span>
            <span>
              {job.boardType === 'FULL_TIME' ? '주 5일' : '스케줄 협의'}
            </span>
            <span>
              {job.closingDate
                ? `마감일 ${new Date(job.closingDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}`
                : '상시 채용'}
            </span>
          </div>

          {/* 3행: 액션 / Row 3: Actions */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              채용 가능 비자 {visas.length}종
            </span>
            <Link
              href={job.id !== '0' ? `/jobs/${job.id}` : '#'}
              className={`text-[11px] font-semibold px-4 py-1.5 rounded-lg transition-colors ${
                isClosed
                  ? 'bg-slate-200 text-slate-400 pointer-events-none'
                  : 'bg-slate-900 hover:bg-slate-700 text-white'
              }`}
              onClick={e => e.stopPropagation()}
            >
              {isClosed ? '마감' : '상세보기 →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 예시 데이터 (8개) / Example data — SVG 로고 + 다양한 비자 ── */
const exampleJobs: JobPosting[] = [
  { id: '0', title: '반도체 검사원 (야간 수당 포함)', company: { companyName: 'SK하이닉스', brandName: null, logoImageUrl: '/images/logos/sk-hynix.svg' }, displayAddress: '경기 이천시', allowedVisas: 'E-9,H-2,F-2,F-4', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 5 * 86400000).toISOString(), albaAttributes: { hourlyWage: 12000 }, fulltimeAttributes: null },
  { id: '0', title: '용접사 — 경험자 우대 (주 5일)', company: { companyName: '현대자동차', brandName: null, logoImageUrl: '/images/logos/hyundai-motor.svg' }, displayAddress: '충남 아산시', allowedVisas: 'E-9,E-7,H-2', boardType: 'FULL_TIME', tierType: 'STANDARD', closingDate: null, albaAttributes: null, fulltimeAttributes: { salaryMin: 24000000, salaryMax: 30000000 } },
  { id: '0', title: '배송 기사 (지입차 / 4대 보험)', company: { companyName: '쿠팡로지스틱스', brandName: null, logoImageUrl: '/images/logos/coupang.svg' }, displayAddress: '서울 및 경기', allowedVisas: 'F-2,F-4,F-5,F-6', boardType: 'FULL_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 12 * 86400000).toISOString(), albaAttributes: null, fulltimeAttributes: { salaryMin: 30000000, salaryMax: 35000000 } },
  { id: '0', title: '건설 인력 — 철근공 (일당제)', company: { companyName: '대우건설', brandName: null, logoImageUrl: '/images/logos/daewoo.svg' }, displayAddress: '서울 강남구', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 2 * 86400000).toISOString(), albaAttributes: { hourlyWage: 15000 }, fulltimeAttributes: null },
  { id: '0', title: '호텔 객실 청소원 (주 5일, 고정 스케줄)', company: { companyName: '그랜드 하얏트', brandName: null, logoImageUrl: '/images/logos/hyatt.svg' }, displayAddress: '서울 중구', allowedVisas: 'E-9,H-2,F-4,D-10', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: null, albaAttributes: { hourlyWage: 11000 }, fulltimeAttributes: null },
  { id: '0', title: '식품 공장 라인 작업원 (일 2교대)', company: { companyName: 'CJ제일제당', brandName: null, logoImageUrl: '/images/logos/cj-cheiljedang.svg' }, displayAddress: '충북 진천군', allowedVisas: 'E-9,H-2,E-7', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 8 * 86400000).toISOString(), albaAttributes: { hourlyWage: 11500 }, fulltimeAttributes: null },
  { id: '0', title: '자동차 도장 보조원 (초보 가능)', company: { companyName: '기아자동차', brandName: null, logoImageUrl: '/images/logos/kia.svg' }, displayAddress: '광주 서구', allowedVisas: 'E-9,H-2,F-2', boardType: 'PART_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 10 * 86400000).toISOString(), albaAttributes: { hourlyWage: 12500 }, fulltimeAttributes: null },
  { id: '0', title: '물류 창고 관리자 (정규직 전환)', company: { companyName: '롯데글로벌로지스', brandName: null, logoImageUrl: '/images/logos/lotte.svg' }, displayAddress: '경기 용인시', allowedVisas: 'F-2,F-4,F-5,F-6,E-7', boardType: 'FULL_TIME', tierType: 'STANDARD', closingDate: new Date(Date.now() + 20 * 86400000).toISOString(), albaAttributes: null, fulltimeAttributes: { salaryMin: 26000000, salaryMax: 32000000 } },
];

/* ── 메인 / Main ── */
interface RealtimeJobsProps {
  boardFilter?: string; // '' = 전체, 'PART_TIME' = 알바, 'FULL_TIME' = 정규직 (페이지 레벨 토글)
}

export default function RealtimeJobs({ boardFilter = '' }: RealtimeJobsProps) {
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    const params = new URLSearchParams({ limit: '20' });
    if (boardFilter) params.set('boardType', boardFilter);
    fetchWithRetry(`/api/jobs/listing?${params}`)
      .then((res) => res.json())
      .then((data) => { if (data.items) setJobs(data.items); })
      .catch(() => {});
  }, [boardFilter]);

  /* API 데이터 있으면 표시, 없으면 예시 / Show real data if available, fallback to examples */
  const showExample = jobs.length === 0;
  let all = showExample ? exampleJobs : jobs;
  if (boardFilter && showExample) all = all.filter((j) => j.boardType === boardFilter);
  const displayJobs = all.slice(0, 8);

  return (
    <section>
      {/* 헤더 + 필터 / Header + Filter */}
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
        <Link href="/alba" className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
          전체보기 <ArrowRight size={13} />
        </Link>
      </div>

      {/* 리스트 카드 / List card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* 리스트 헤더 / List header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <span className="text-xs text-slate-500">
            공고 <span className="text-sky-600 font-bold">{displayJobs.length}</span>건
          </span>
          <div className="flex gap-1 text-[11px] text-slate-500">
            <span className="px-2 py-1 bg-sky-50 border border-sky-200 text-sky-600 rounded cursor-pointer">최신순</span>
            <span className="px-2 py-1 bg-white border border-slate-200 rounded cursor-pointer hover:bg-slate-50 transition">급여순</span>
          </div>
        </div>

        {/* 공고 행 / Job rows */}
        {displayJobs.map((job, idx) => (
          <div key={job.id + idx}>
            <JobRow job={job} faded={showExample} />
            {idx < displayJobs.length - 1 && <div className="border-b border-slate-100 mx-4" />}
          </div>
        ))}

        {/* 더보기 / See more */}
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
