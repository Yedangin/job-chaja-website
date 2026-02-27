'use client';

import Link from 'next/link';
import {
  ShieldCheck, BookOpen, CalendarDays, FileText,
  ArrowRight, ChevronLeft, ChevronRight, MapPin,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { fetchWithRetry } from '@/lib/fetch-utils';

/* ─── Types ─────────────────────────────────────────────────── */
interface SlimJob {
  id: string;
  title: string;
  boardType: string;
  displayAddress: string;
  closingDate: string | null;
  company: { companyName: string; brandName: string | null; logoImageUrl: string | null } | null;
}

/* ─── Quick actions ──────────────────────────────────────────── */
const quickActions = [
  { icon: ShieldCheck, label: '비자 진단',   href: '/diagnosis',      tile: 'bg-sky-500/15 hover:bg-sky-500/35 border-sky-500/30 hover:border-sky-400/60 hover:shadow-sky-500/25',    iconWrap: 'bg-sky-500/30',    iconCls: 'text-sky-300' },
  { icon: BookOpen,    label: '취업 가이드', href: '/company/guide',   tile: 'bg-emerald-500/15 hover:bg-emerald-500/35 border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-emerald-500/25', iconWrap: 'bg-emerald-500/30', iconCls: 'text-emerald-300' },
  { icon: CalendarDays,label: '채용 박람회', href: '/events',          tile: 'bg-violet-500/15 hover:bg-violet-500/35 border-violet-500/30 hover:border-violet-400/60 hover:shadow-violet-500/25', iconWrap: 'bg-violet-500/30',  iconCls: 'text-violet-300' },
  { icon: FileText,    label: '이력서 작성', href: '/resume',          tile: 'bg-amber-500/15 hover:bg-amber-500/35 border-amber-500/30 hover:border-amber-400/60 hover:shadow-amber-500/25',    iconWrap: 'bg-amber-500/30',   iconCls: 'text-amber-300' },
];

/* ─── Review carousel ────────────────────────────────────────── */
const reviews = [
  { text: '비자 E-9으로 취업이 어려웠는데, 잡차자 덕분에 원하는 공장에 취업했어요!', author: 'Kang M. (베트남)', initial: 'K', color: 'bg-green-500' },
  { text: '한국어를 잘 못해도 비자별로 공고를 쉽게 찾을 수 있어서 정말 편해요.',     author: 'Pham T. (베트남)', initial: 'P', color: 'bg-blue-500'  },
  { text: '프리미엄 공고에 지원해서 바로 면접 연락이 왔어요. 정말 추천합니다!',       author: 'Singh R. (인도)',  initial: 'S', color: 'bg-purple-500'},
];

/* ─── Stats ──────────────────────────────────────────────────── */
const stats = [
  { value: '1,200+', label: '등록 공고' },
  { value: '500+',   label: '파트너 기업' },
  { value: '30+',    label: '비자 유형' },
];

/* ─── Example slider jobs (fallback) ────────────────────────── */
const EXAMPLE_JOBS: SlimJob[] = [
  { id: '0', title: '반도체 생산라인 오퍼레이터 (기숙사 제공)',  company: { companyName: '삼성전자 평택',   brandName: null, logoImageUrl: null }, displayAddress: '경기 평택시', boardType: 'PART_TIME', closingDate: new Date(Date.now() + 5  * 86400000).toISOString() },
  { id: '0', title: '건설 현장 안전관리자 (경험자 우대)',        company: { companyName: '현대건설',        brandName: null, logoImageUrl: null }, displayAddress: '서울 강남구', boardType: 'FULL_TIME', closingDate: new Date(Date.now() + 3  * 86400000).toISOString() },
  { id: '0', title: '물류 창고 포장/분류 직원 (통근버스 제공)',  company: { companyName: 'CJ대한통운 인천', brandName: null, logoImageUrl: null }, displayAddress: '인천 남동구', boardType: 'PART_TIME', closingDate: null },
  { id: '0', title: '호텔 주방 스태프 (식사 제공, 주 5일)',      company: { companyName: '신라 호텔 서울',  brandName: null, logoImageUrl: null }, displayAddress: '서울 중구',   boardType: 'PART_TIME', closingDate: new Date(Date.now() + 12 * 86400000).toISOString() },
  { id: '0', title: '용접사 — 경험자 우대 (주 5일)',             company: { companyName: '현대자동차 아산', brandName: null, logoImageUrl: null }, displayAddress: '충남 아산시', boardType: 'FULL_TIME', closingDate: null },
  { id: '0', title: '배송 기사 (지입차 / 4대 보험)',             company: { companyName: '쿠팡로지스틱스',  brandName: null, logoImageUrl: null }, displayAddress: '서울 및 경기', boardType: 'FULL_TIME', closingDate: new Date(Date.now() + 8  * 86400000).toISOString() },
];

/* ─── Helpers ────────────────────────────────────────────────── */
const AVATAR_COLORS = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
function avatarColor(name: string) { return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]; }

function getDDay(d: string | null): { label: string; badge: string } {
  if (!d) return { label: '', badge: '' };
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return { label: '마감',    badge: 'bg-slate-500/60 text-slate-300' };
  if (diff === 0) return { label: 'D-Day',  badge: 'bg-red-500 text-white' };
  if (diff <= 3)  return { label: `D-${diff}`, badge: 'bg-red-500 text-white' };
  if (diff <= 7)  return { label: `D-${diff}`, badge: 'bg-orange-400 text-white' };
  return { label: `D-${diff}`, badge: 'bg-white/20 text-white/80' };
}

/* ─── Slider job card ────────────────────────────────────────── */
function SliderCard({ job }: { job: SlimJob }) {
  const name = job.company?.brandName || job.company?.companyName || '';
  const { label: dday, badge } = getDDay(job.closingDate);
  const href = job.id !== '0' ? `/jobs/${job.id}` : '#';

  return (
    <Link
      href={href}
      className="group flex flex-col gap-2.5 bg-white/[0.07] hover:bg-white/[0.13] border border-white/10 hover:border-white/25 rounded-xl p-3.5 h-full transition-all duration-150 cursor-pointer"
    >
      {/* Top: avatar + D-day */}
      <div className="flex items-start justify-between gap-2">
        <div className={`w-10 h-10 rounded-xl ${avatarColor(name)} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm`}>
          {name.charAt(0)}
        </div>
        {dday && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badge}`}>{dday}</span>
        )}
      </div>

      {/* Title + company */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-[13px] font-semibold leading-snug line-clamp-2 group-hover:text-sky-300 transition-colors">
          {job.title}
        </p>
        <p className="text-slate-400 text-[11px] mt-1 truncate">{name}</p>
        <p className="text-slate-500 text-[10px] mt-0.5 flex items-center gap-0.5 truncate">
          <MapPin size={9} className="shrink-0" />{job.displayAddress}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
          job.boardType === 'FULL_TIME'
            ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
            : 'text-orange-400 border-orange-500/40 bg-orange-500/10'
        }`}>
          {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
        </span>
        <span className="text-[10px] text-sky-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">보기 →</span>
      </div>
    </Link>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function HeroSection() {
  /* Review */
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewPaused, setReviewPaused] = useState(false);

  useEffect(() => {
    if (reviewPaused) return;
    const t = setInterval(() => setReviewIdx((p) => (p + 1) % reviews.length), 4000);
    return () => clearInterval(t);
  }, [reviewPaused]);

  /* Slider */
  const [sliderJobs, setSliderJobs] = useState<SlimJob[]>([]);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
  const [sliderTab, setSliderTab] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ limit: '9' });
    if (sliderTab) params.set('boardType', sliderTab);
    fetchWithRetry(`/api/jobs/listing?${params}`)
      .then((r) => r.json())
      .then((d) => { if (d.items?.length) { setSliderJobs(d.items); setSliderIdx(0); } })
      .catch(() => {});
  }, [sliderTab]);

  const allJobs = sliderJobs.length >= 3 ? sliderJobs : EXAMPLE_JOBS;
  const n = allJobs.length;

  const advance = useCallback(() => setSliderIdx((p) => (p + 1) % n), [n]);
  const retreat = useCallback(() => setSliderIdx((p) => (p - 1 + n) % n), [n]);

  useEffect(() => {
    if (sliderPaused) return;
    const t = setInterval(advance, 2000);
    return () => clearInterval(t);
  }, [sliderPaused, advance]);

  /* 3 visible cards (looping with modulo) */
  const visible = [0, 1, 2].map((i) => allJobs[(sliderIdx + i) % n]);

  const review = reviews[reviewIdx];
  const tabs = [{ l: '전체', v: '' }, { l: '알바', v: 'PART_TIME' }, { l: '정규직', v: 'FULL_TIME' }];

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
      <div className="flex flex-col lg:flex-row">

        {/* ══ LEFT: brand + stats + CTAs ══ */}
        <div className="lg:w-64 shrink-0 p-7 lg:p-8 relative flex flex-col justify-center">
          <div className="absolute top-0 left-0 w-48 h-48 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">✈</div>
              <span className="text-white text-lg font-bold tracking-tight">잡차자</span>
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight mb-2">
              외국인 근로자를 위한<br />
              <span className="text-sky-400">대한민국 취업 플랫폼</span>
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              비자 유형별 맞춤 공고<br />프리미엄 파트너 기업 · 취업 가이드
            </p>
            <div className="flex items-center gap-4 mb-6">
              {stats.map((s, i) => (
                <div key={s.label} className={i > 0 ? 'pl-4 border-l border-white/10' : ''}>
                  <p className="text-base font-bold text-white leading-none">{s.value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/alba" className="inline-flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-sky-900/50">
                공고 둘러보기 <ArrowRight size={13} />
              </Link>
              <Link href="/diagnosis" className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-2 rounded-xl text-xs transition border border-white/20">
                비자 진단받기
              </Link>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="hidden lg:block w-px bg-white/10 my-6" />

        {/* ══ MIDDLE: sliding job cards ══ */}
        <div className="flex-1 min-w-0 flex flex-col p-4 lg:p-6 border-t lg:border-t-0 border-white/10">
          {/* Tab row */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/50 text-[11px] font-semibold uppercase tracking-widest">채용 공고</p>
            <div className="flex gap-1">
              {tabs.map((t) => (
                <button
                  key={t.v}
                  onClick={() => { setSliderTab(t.v); setSliderIdx(0); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    sliderTab === t.v ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {/* Slider area */}
          <div
            className="relative flex-1"
            onMouseEnter={() => setSliderPaused(true)}
            onMouseLeave={() => setSliderPaused(false)}
          >
            {/* Cards */}
            <div className="flex gap-3 h-full">
              {visible.map((job, i) => (
                <div key={`${sliderIdx}-${i}`} className="flex-1 min-w-0 animate-in fade-in duration-300">
                  <SliderCard job={job} />
                </div>
              ))}
            </div>

            {/* Prev arrow */}
            <button
              onClick={retreat}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition border border-white/20 shadow-md"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Next arrow */}
            <button
              onClick={advance}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition border border-white/20 shadow-md"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {allJobs.map((_, i) => (
              <button
                key={i}
                onClick={() => setSliderIdx(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === sliderIdx ? 'bg-white w-4 h-1.5' : 'bg-white/25 hover:bg-white/50 w-1.5 h-1.5'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="hidden lg:block w-px bg-white/10 my-6" />

        {/* ══ RIGHT: quick tiles + review ══ */}
        <div className="lg:w-[270px] shrink-0 flex flex-col gap-4 p-6 lg:p-7 bg-white/2 border-t lg:border-t-0 border-white/10">
          {/* 4 shortcut tiles */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2.5">빠른 메뉴</p>
            <div className="grid grid-cols-4 gap-1.5">
              {quickActions.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.08] hover:shadow-lg ${item.tile}`}
                >
                  <div className={`w-8 h-8 rounded-xl ${item.iconWrap} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                    <item.icon size={15} className={item.iconCls} />
                  </div>
                  <p className="text-white/75 group-hover:text-white text-[9px] font-semibold leading-tight text-center transition-colors">{item.label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Review carousel */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2.5">취업 후기</p>
            <div
              className={`p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-default ${
                reviewPaused ? 'bg-white/15 border-white/30' : 'bg-white/10 border-white/10'
              }`}
              onMouseEnter={() => setReviewPaused(true)}
              onMouseLeave={() => setReviewPaused(false)}
            >
              <div className={`w-8 h-8 rounded-full ${review.color} flex items-center justify-center font-bold text-white text-xs shrink-0`}>
                {review.initial}
              </div>
              <div className="min-w-0 flex-1">
                <p key={`t-${reviewIdx}`} className="text-white text-[11px] italic leading-relaxed line-clamp-3 animate-in fade-in duration-500">
                  &ldquo;{review.text}&rdquo;
                </p>
                <span key={`a-${reviewIdx}`} className="text-slate-400 text-[10px] mt-1 block animate-in fade-in duration-500">
                  – {review.author}
                </span>
                <div className="flex items-center gap-1.5 mt-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewIdx(i)}
                      className={`rounded-full transition-all duration-300 ${i === reviewIdx ? 'bg-white w-4 h-1.5' : 'bg-white/30 hover:bg-white/50 w-1.5 h-1.5'}`}
                    />
                  ))}
                  {reviewPaused && <span className="text-[9px] text-white/35 ml-1">일시정지</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
