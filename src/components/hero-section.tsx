'use client';

import Link from 'next/link';
import { ShieldCheck, BookOpen, CalendarDays, FileText, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const quickActions = [
  {
    icon: ShieldCheck,
    label: '비자 진단',
    sub: '취업 가능 비자 확인',
    href: '/visa-check',
    bg: 'bg-sky-500/20 hover:bg-sky-500/30',
    iconCls: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  {
    icon: BookOpen,
    label: '취업 가이드',
    sub: '한국 취업 완벽 가이드',
    href: '/company/guide',
    bg: 'bg-emerald-500/20 hover:bg-emerald-500/30',
    iconCls: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  {
    icon: CalendarDays,
    label: '채용 박람회',
    sub: '현장 면접 사전 접수',
    href: '/events',
    bg: 'bg-violet-500/20 hover:bg-violet-500/30',
    iconCls: 'text-violet-400',
    border: 'border-violet-500/30',
  },
  {
    icon: FileText,
    label: '이력서 작성',
    sub: '나만의 이력서 만들기',
    href: '/resume',
    bg: 'bg-amber-500/20 hover:bg-amber-500/30',
    iconCls: 'text-amber-400',
    border: 'border-amber-500/30',
  },
];

const reviews = [
  {
    text: '비자 E-9으로 취업이 어려웠는데, 잡차자 덕분에 원하는 공장에 취업했어요!',
    author: 'Kang M. (베트남)',
    initial: 'K',
    color: 'bg-green-500',
  },
  {
    text: '한국어를 잘 못해도 비자별로 공고를 쉽게 찾을 수 있어서 정말 편해요.',
    author: 'Pham T. (베트남)',
    initial: 'P',
    color: 'bg-blue-500',
  },
  {
    text: '프리미엄 공고에 지원해서 바로 면접 연락이 왔어요. 정말 추천합니다!',
    author: 'Singh R. (인도)',
    initial: 'S',
    color: 'bg-purple-500',
  },
];

const stats = [
  { value: '1,200+', label: '등록 공고' },
  { value: '500+', label: '파트너 기업' },
  { value: '30+', label: '비자 유형' },
];

export default function HeroSection() {
  const [reviewIdx, setReviewIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setReviewIdx((p) => (p + 1) % reviews.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const review = reviews[reviewIdx];

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
      <div className="flex flex-col md:flex-row">

        {/* ── Left: brand copy + stats + CTAs ── */}
        <div className="flex-1 flex flex-col justify-between p-8 md:p-10 relative">
          {/* subtle sky glow top-left */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Brand mark */}
            <div className="flex items-center gap-2 mb-7">
              <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg text-base">
                ✈
              </div>
              <span className="text-white text-lg font-bold tracking-tight">잡차자</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-[2.25rem] font-bold text-white leading-tight mb-3">
              외국인 근로자를 위한
              <br />
              <span className="text-sky-400">대한민국 취업 플랫폼</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-7">
              비자 유형별 맞춤 공고 · 프리미엄 파트너 기업 · 취업 가이드까지
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 mb-8">
              {stats.map((s, i) => (
                <div key={s.label} className={`${i > 0 ? 'pl-6 border-l border-white/10' : ''}`}>
                  <p className="text-xl font-bold text-white leading-none">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/alba"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-lg shadow-sky-900/50"
              >
                공고 둘러보기 <ArrowRight size={15} />
              </Link>
              <Link
                href="/visa-check"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition border border-white/20"
              >
                비자 진단받기
              </Link>
            </div>
          </div>
        </div>

        {/* ── Right: quick actions + review carousel ── */}
        <div className="md:w-[320px] shrink-0 flex flex-col gap-3 p-6 md:p-8 border-t md:border-t-0 md:border-l border-white/10">
          {/* 2×2 quick action grid */}
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2.5 p-3 rounded-xl ${item.bg} border ${item.border} transition group`}
              >
                <item.icon size={16} className={`${item.iconCls} shrink-0`} />
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold leading-tight truncate">{item.label}</p>
                  <p className="text-slate-400 text-[10px] leading-tight mt-0.5 truncate">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Review carousel — identical treatment to auth-layout */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-start gap-3">
            <div
              key={reviewIdx}
              className={`w-9 h-9 rounded-full ${review.color} flex items-center justify-center font-bold text-white text-sm shrink-0`}
            >
              {review.initial}
            </div>
            <div className="min-w-0">
              <p
                key={`t-${reviewIdx}`}
                className="text-white text-xs italic leading-relaxed line-clamp-3 animate-in fade-in duration-500"
              >
                &ldquo;{review.text}&rdquo;
              </p>
              <span
                key={`a-${reviewIdx}`}
                className="text-slate-400 text-[11px] mt-1.5 block animate-in fade-in duration-500"
              >
                – {review.author}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
