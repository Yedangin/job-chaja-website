'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { convertPostsToBanners, BannerItem, Post } from '@/utils/post-to-banner';

/**
 * 동적 배너 슬라이더 — Posts API에서 데이터 로드
 * Dynamic banner slider — Loads from Posts API
 */

export default function BannerSliderDynamic() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Posts API에서 데이터 로드
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/info-board?limit=100');
        const json = await res.json();
        const data = json.data || json;
        const posts = Array.isArray(data) ? data : data?.items || [];

        // Posts를 Banners로 변환
        const convertedBanners = convertPostsToBanners(posts);
        setBanners(convertedBanners);
      } catch (err) {
        console.error('Failed to load banners:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // 자동 회전
  const next = useCallback(() => {
    setBanners(prev => {
      if (prev.length === 0) return prev;
      setCurrent((c) => (c + 1) % prev.length);
      return prev;
    });
  }, []);

  useEffect(() => {
    if (isHovered || banners.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isHovered, banners.length]);

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 px-8 lg:px-12 py-10 lg:py-12 animate-pulse">
        <div className="text-center text-gray-400">배너 로딩 중...</div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const banner = banners[current];
  const Icon = banner.icon;

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 배너 콘텐츠 */}
      <div
        key={current}
        className={`${banner.bg} ${banner.textColor} px-8 lg:px-12 py-10 lg:py-12 transition-all duration-500`}
      >
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative z-10 flex items-center justify-between gap-8">
          <div className="flex-1 min-w-0">
            {/* 태그 */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className={`${banner.accentBg} ${banner.accentText} text-[11px] font-bold px-2.5 py-1 rounded-md`}>
                {banner.tag}
              </span>
            </div>

            {/* 제목 */}
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

          {/* 아이콘 */}
          <div className="hidden lg:flex shrink-0 w-24 h-24 rounded-2xl bg-white/10 items-center justify-center">
            <Icon size={40} className="opacity-60" />
          </div>
        </div>
      </div>

      {/* 인디케이터 */}
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
