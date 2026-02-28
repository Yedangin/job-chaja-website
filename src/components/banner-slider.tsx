'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Calendar, Megaphone, ShieldCheck, ArrowRight,
} from 'lucide-react';

/**
 * 포스터 배너 슬라이더 — 각 배너별 고유 컬러 배경
 * Poster banner slider — Unique color per banner
 *
 * Wanted-style: 풀폭 캐러셀, 배너마다 다른 브랜드 컬러
 * Wanted-style: Full-width carousel, different brand color per banner
 *
 * 자동 회전 5초 + 수동 인디케이터
 * Auto-rotate 5s + manual indicators
 */

/* ─── 배너 데이터 / Banner data ──────────────────────── */
interface Banner {
  bg: string;         // 배경색 / Background color
  textColor: string;  // 텍스트 색 / Text color
  accentBg: string;   // 태그 배경 / Tag background
  accentText: string; // 태그 텍스트 / Tag text color
  tag: string;
  icon: typeof GraduationCap;
  title: string;
  desc: string;
  cta: string;
  href: string;
}

const banners: Banner[] = [
  {
    bg: 'bg-gradient-to-r from-[#0052CC] to-[#0066FF]',
    textColor: 'text-white',
    accentBg: 'bg-white/20',
    accentText: 'text-white',
    tag: '교육 모집',
    icon: GraduationCap,
    title: '2026 상반기 무료 한국어교육',
    desc: '서울글로벌센터 주관 · 초급~중급반 모집중',
    cta: '신청하기',
    href: '#',
  },
  {
    bg: 'bg-gradient-to-r from-[#1A1A2E] to-[#16213E]',
    textColor: 'text-white',
    accentBg: 'bg-[#FE9800]/20',
    accentText: 'text-[#FE9800]',
    tag: '채용 박람회',
    icon: Calendar,
    title: '외국인 채용 박람회 개최',
    desc: '서울 COEX · 03.15 · 50개 기업 참가',
    cta: '참가 신청',
    href: '#',
  },
  {
    bg: 'bg-gradient-to-r from-[#0D4F3C] to-[#03B26C]',
    textColor: 'text-white',
    accentBg: 'bg-white/20',
    accentText: 'text-white',
    tag: 'TOPIK',
    icon: GraduationCap,
    title: '제89회 TOPIK 시험 접수',
    desc: '접수기간 04.12~04.13 · 전국 시험장',
    cta: '접수 안내',
    href: '#',
  },
  {
    bg: 'bg-gradient-to-r from-[#5B21B6] to-[#7C3AED]',
    textColor: 'text-white',
    accentBg: 'bg-white/20',
    accentText: 'text-white',
    tag: '정책 변경',
    icon: Megaphone,
    title: '2026년 E-9 쿼터 확대 안내',
    desc: '제조·건설·농업 분야 외국인 채용 쿼터 변경',
    cta: '상세보기',
    href: '#',
  },
  {
    bg: 'bg-gradient-to-r from-[#B91C1C] to-[#DC2626]',
    textColor: 'text-white',
    accentBg: 'bg-white/20',
    accentText: 'text-white',
    tag: '서비스 안내',
    icon: ShieldCheck,
    title: '비자 진단 서비스 출시',
    desc: '31개 비자 유형 · 30초 무료 진단 · 맞춤 일자리 연결',
    cta: '진단 시작',
    href: '/diagnosis',
  },
];

/* ─── 메인 컴포넌트 / Main component ─────────────────── */
export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 자동 회전 / Auto rotation
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  const banner = banners[current];
  const Icon = banner.icon;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 배너 콘텐츠 / Banner content */}
      <div
        key={current}
        className={`${banner.bg} ${banner.textColor} px-8 lg:px-12 py-10 lg:py-12 transition-all duration-500`}
      >
        {/* 배경 장식 / Background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative z-10 flex items-center justify-between gap-8">
          <div className="flex-1 min-w-0">
            {/* 태그 / Tag */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className={`${banner.accentBg} ${banner.accentText} text-[11px] font-bold px-2.5 py-1 rounded-md`}>
                {banner.tag}
              </span>
            </div>

            {/* 제목 / Title */}
            <h2 className="text-[22px] lg:text-[28px] font-bold leading-tight mb-2">
              {banner.title}
            </h2>
            <p className="text-[14px] opacity-70 mb-6">
              {banner.desc}
            </p>

            {/* CTA */}
            <Link
              href={banner.href}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
            >
              {banner.cta} <ArrowRight size={14} />
            </Link>
          </div>

          {/* 아이콘 / Icon */}
          <div className="hidden lg:flex shrink-0 w-24 h-24 rounded-2xl bg-white/10 items-center justify-center">
            <Icon size={40} className="opacity-60" />
          </div>
        </div>
      </div>

      {/* 인디케이터 / Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
