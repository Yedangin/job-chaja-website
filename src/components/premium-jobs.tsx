'use client';

import { ArrowRight, MapPin, Crown, Star, Clock, Shield, Gift } from 'lucide-react';
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
    const lo = job.fulltimeAttributes.salaryMin;
    const hi = job.fulltimeAttributes.salaryMax;
    const fmt = (v: number | null) => (v ? Math.round(v / 10000).toLocaleString() : '');
    if (lo && hi) return `연봉 ${fmt(lo)}~${fmt(hi)}만원`;
    if (lo) return `연봉 ${fmt(lo)}만원~`;
    return '연봉 협의';
  }
  return '급여 협의';
}

function getDDayLabel(d: string | null): { label: string; cls: string } {
  if (!d) return { label: '상시채용', cls: 'text-slate-400' };
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: '마감', cls: 'text-slate-300' };
  if (diff === 0) return { label: 'D-Day', cls: 'text-red-500 font-bold' };
  if (diff <= 3) return { label: `D-${diff}`, cls: 'text-red-500 font-semibold' };
  if (diff <= 7) return { label: `D-${diff}`, cls: 'text-amber-500 font-medium' };
  return { label: `D-${diff}`, cls: 'text-slate-400' };
}

const AVATAR_COLORS = ['bg-sky-600', 'bg-emerald-600', 'bg-violet-600', 'bg-rose-600', 'bg-indigo-600', 'bg-teal-600'];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}

/* ── 카드 높이 상수 / Card height constants ── */
const CARD_BASE_H = 290; // 기본 상태 높이 / default card height (px)

/* ── 프리미엄 카드 컴포넌트 / Premium card component ── */
function PremiumJobCard({ job, faded }: { job: JobPosting; faded: boolean }) {
  const companyName = job.company?.brandName || job.company?.companyName || '';
  const { label: ddayLabel, cls: ddayCls } = getDDayLabel(job.closingDate);
  const salary = formatSalary(job);
  const visas = job.allowedVisas.split(',').map((v) => v.trim()).slice(0, 3);
  const extraVisaCount = job.allowedVisas.split(',').length - 3;
  const isClosed = ddayLabel === '마감';
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" style={{ height: CARD_BASE_H }}>
      {/* 카드 본체 - absolute로 그리드 셀 밖으로 확장 가능 */}
      {/* Card body - absolute positioning allows expansion beyond grid cell */}
      <div
        className={`
          group absolute inset-x-0 top-0
          bg-white rounded-xl
          border border-gray-200
          overflow-hidden
          transition-all duration-300 ease-out
          ${hovered ? 'z-20 shadow-2xl border-sky-400' : 'z-0 shadow-sm'}
          ${faded ? 'opacity-40' : ''}
        `}
        style={{ borderTop: '3px solid #0ea5e9' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* 다크 그래디언트 오버레이 - 호버 시 등장 (사람인 플래티넘 스타일) */}
        {/* Dark gradient overlay - appears on hover (Saramin platinum style) */}
        <div
          className={`absolute inset-0 bg-linear-to-b from-slate-900 via-[#0c2d4a] to-slate-900 transition-opacity duration-300 pointer-events-none rounded-xl ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* ─── 기본 콘텐츠 영역 (항상 표시) / Base content (always visible) ─── */}
        <div className="relative z-10 p-4">

          {/* 1행: PREMIUM 뱃지 + D-day + 스크랩 */}
          {/* Row 1: PREMIUM badge + D-day + bookmark */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded tracking-wide transition-colors duration-300 ${
              hovered
                ? 'text-sky-300 bg-sky-400/15 border border-sky-400/30'
                : 'text-sky-600 bg-sky-50 border border-sky-100'
            }`}>
              PREMIUM
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold transition-colors duration-300 ${
                hovered ? 'text-white/80' : ddayCls
              }`}>
                {ddayLabel}
              </span>
              <button className="group/star">
                <Star
                  size={15}
                  className={`transition-colors duration-200 ${
                    hovered
                      ? 'text-white/40 hover:text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2행: 기업 로고 + 이름 + 지역 */}
          {/* Row 2: Company logo + name + location */}
          <div className="flex items-center gap-3 mb-3">
            {job.company?.logoImageUrl ? (
              <div className={`w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-white transition-all duration-300 ${
                hovered ? 'ring-2 ring-white/30' : 'border border-gray-100'
              }`}>
                <Image src={job.company.logoImageUrl} alt={companyName} width={44} height={44} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className={`w-11 h-11 rounded-lg ${avatarColor(companyName)} flex items-center justify-center text-white font-bold text-base shrink-0 transition-all duration-300 ${
                hovered ? 'ring-2 ring-white/30' : 'ring-1 ring-black/5'
              }`}>
                {companyName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate transition-colors duration-300 ${
                hovered ? 'text-white' : 'text-slate-800'
              }`}>
                {companyName}
              </p>
              <p className={`text-xs flex items-center gap-1 mt-0.5 transition-colors duration-300 ${
                hovered ? 'text-white/50' : 'text-slate-400'
              }`}>
                <MapPin size={11} className="shrink-0" />
                <span className="truncate">{job.displayAddress}</span>
              </p>
            </div>
          </div>

          {/* 3행: 공고 제목 */}
          {/* Row 3: Job title */}
          <h3 className={`text-[14px] font-bold leading-snug mb-3 line-clamp-2 transition-colors duration-300 ${
            isClosed
              ? 'line-through text-slate-300'
              : hovered ? 'text-white' : 'text-slate-900'
          }`}>
            {job.title}
          </h3>

          {/* 4행: 비자 뱃지 + 고용형태 */}
          {/* Row 4: Visa badges + employment type */}
          <div className="flex flex-wrap gap-1 mb-3">
            {visas.map((visa) => (
              <span
                key={visa}
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors duration-300 ${
                  hovered
                    ? 'text-sky-200 bg-sky-400/15 border border-sky-400/25'
                    : 'text-sky-700 bg-sky-50 border border-sky-100'
                }`}
              >
                {visa}
              </span>
            ))}
            {extraVisaCount > 0 && (
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors duration-300 ${
                hovered ? 'text-white/50' : 'text-slate-400'
              }`}>
                +{extraVisaCount}
              </span>
            )}
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border transition-colors duration-300 ${
              job.boardType === 'FULL_TIME'
                ? hovered
                  ? 'text-emerald-300 bg-emerald-400/15 border-emerald-400/25'
                  : 'text-emerald-700 bg-emerald-50 border-emerald-100'
                : hovered
                  ? 'text-orange-300 bg-orange-400/15 border-orange-400/25'
                  : 'text-orange-700 bg-orange-50 border-orange-100'
            }`}>
              {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
            </span>
          </div>

          {/* 5행: 급여 */}
          {/* Row 5: Salary */}
          <p className={`text-[15px] font-bold transition-colors duration-300 ${
            hovered ? 'text-sky-300' : 'text-sky-600'
          }`}>
            {salary}
          </p>
        </div>

        {/* ─── 확장 영역 (호버 시 overlay로 아래 카드 위에 표시) ─── */}
        {/* ─── Expansion area (overlays cards below on hover) ─── */}
        <div
          className="relative z-10 transition-all duration-300 ease-out overflow-hidden"
          style={{
            maxHeight: hovered ? 180 : 0,
            opacity: hovered ? 1 : 0,
          }}
        >
          <div className="px-4 pb-4">
            <div className="border-t border-white/15 pt-3 space-y-2.5">

              {/* 추가 정보: 근무조건 / Additional info: work conditions */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <Clock size={12} className="shrink-0 text-sky-400/70" />
                  <span>{job.boardType === 'FULL_TIME' ? '주 5일 · 09:00~18:00' : '근무시간 협의'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <Shield size={12} className="shrink-0 text-sky-400/70" />
                  <span>비자 {job.allowedVisas.split(',').length}종 지원 가능</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <Gift size={12} className="shrink-0 text-sky-400/70" />
                  <span>{job.boardType === 'FULL_TIME' ? '4대보험 · 연차' : '교통비 · 식대 지원'}</span>
                </div>
              </div>

              {/* 액션 버튼 / Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  className="flex-1 text-xs text-white/60 border border-white/15 rounded-lg py-2.5 hover:bg-white/10 hover:text-white/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  ☆ 스크랩
                </button>
                <Link
                  href={job.id !== '0' ? `/jobs/${job.id}` : '#'}
                  onClick={(e) => e.stopPropagation()}
                  className={`flex-1 text-xs text-center rounded-lg py-2.5 font-semibold transition-colors ${
                    isClosed
                      ? 'bg-white/10 text-white/30 pointer-events-none'
                      : 'bg-sky-500 hover:bg-sky-400 text-white'
                  }`}
                >
                  {isClosed ? '마감됨' : '지원하기 →'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 메인 섹션 / Main section ── */
export default function PremiumJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    fetchWithRetry('/api/jobs/listing?tierType=PREMIUM&limit=8')
      .then((res) => res.json())
      .then((data) => { if (data.items) setJobs(data.items); })
      .catch(() => {});
  }, []);

  const showExample = jobs.length === 0;
  const exampleJobs: JobPosting[] = [
    { id: '0', title: '반도체 생산라인 오퍼레이터 (기숙사 제공)', company: { companyName: '삼성전자 평택', brandName: null, logoImageUrl: null }, displayAddress: '경기 평택시', allowedVisas: 'E-9,H-2,F-4', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 14 * 86400000).toISOString(), albaAttributes: { hourlyWage: 14000 }, fulltimeAttributes: null },
    { id: '0', title: '건설 현장 안전관리자 (경험자 우대)', company: { companyName: '현대건설', brandName: null, logoImageUrl: null }, displayAddress: '서울 강남구', allowedVisas: 'E-7,F-2,F-5,F-6', boardType: 'FULL_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 3 * 86400000).toISOString(), albaAttributes: null, fulltimeAttributes: { salaryMin: 30000000, salaryMax: 40000000 } },
    { id: '0', title: '호텔 주방 스태프 (식사 제공, 주 5일)', company: { companyName: '신라호텔', brandName: null, logoImageUrl: null }, displayAddress: '서울 중구', allowedVisas: 'E-9,H-2,F-4', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: new Date(Date.now() + 30 * 86400000).toISOString(), albaAttributes: { hourlyWage: 12000 }, fulltimeAttributes: null },
    { id: '0', title: '물류센터 포장/분류 직원 (통근버스)', company: { companyName: 'CJ대한통운', brandName: null, logoImageUrl: null }, displayAddress: '인천 남동구', allowedVisas: 'E-9,H-2', boardType: 'PART_TIME', tierType: 'PREMIUM', closingDate: null, albaAttributes: { hourlyWage: 13000 }, fulltimeAttributes: null },
  ];

  const displayJobs = showExample ? exampleJobs : jobs;

  return (
    <section>
      {/* 섹션 헤더 / Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
            <Crown size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">프리미엄 공고</h2>
            <p className="text-xs text-slate-400 mt-0.5">주목할 만한 채용 정보</p>
          </div>
        </div>
        <Link href="/alba" className="text-sm text-slate-400 hover:text-sky-600 transition-colors flex items-center gap-1 font-medium">
          전체보기 <ArrowRight size={14} />
        </Link>
      </div>

      {/* 4열 카드 그리드 / 4-column card grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {displayJobs.map((job, idx) => (
          <PremiumJobCard key={job.id + idx} job={job} faded={showExample} />
        ))}
      </div>

      {showExample && (
        <p className="text-center text-xs text-slate-400 mt-4">위 공고는 예시입니다. 실제 프리미엄 공고 등록 시 표시됩니다.</p>
      )}
    </section>
  );
}
