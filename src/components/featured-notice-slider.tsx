'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Megaphone } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { BOARD_LABELS, resolveBoardLocale } from '@/features/board/copy';
import type { InfoBoardBannerTheme, InfoBoardPost } from '@/features/board/types';
import { getLocalizedPost, listFeaturedInfoBoard } from '@/lib/info-board-client';

const THEME_CLASS: Record<InfoBoardBannerTheme, string> = {
  BRAND: 'bg-[#0066FF]',
  CHARCOAL: 'bg-[#191F28]',
  GREEN: 'bg-[#087A55]',
  AMBER: 'bg-[#9A5B00]',
  RED: 'bg-[#B4232A]',
};

const COPY = {
  ko: {
    cta: '자세히 보기',
    emptyTitle: '새 공지를 준비하고 있습니다',
    emptySummary: '잡차자의 최신 안내는 공지사항에서 확인할 수 있습니다.',
    emptyTag: '공지',
    previous: '이전 슬라이드',
    next: '다음 슬라이드',
    slide: '슬라이드 {index}로 이동',
  },
  en: {
    cta: 'View details',
    emptyTitle: 'New notices are coming soon',
    emptySummary: 'Check Notices for the latest updates from JobChaja.',
    emptyTag: 'Notice',
    previous: 'Previous slide',
    next: 'Next slide',
    slide: 'Go to slide {index}',
  },
  vi: {
    cta: 'Xem chi tiết',
    emptyTitle: 'Thông báo mới sẽ sớm được cập nhật',
    emptySummary: 'Xem mục Thông báo để biết cập nhật mới nhất từ JobChaja.',
    emptyTag: 'Thông báo',
    previous: 'Trang trước',
    next: 'Trang sau',
    slide: 'Chuyển đến trang {index}',
  },
  th: {
    cta: 'ดูรายละเอียด',
    emptyTitle: 'กำลังเตรียมประกาศใหม่',
    emptySummary: 'ดูข้อมูลล่าสุดจาก JobChaja ได้ที่หน้าประกาศ',
    emptyTag: 'ประกาศ',
    previous: 'สไลด์ก่อนหน้า',
    next: 'สไลด์ถัดไป',
    slide: 'ไปยังสไลด์ {index}',
  },
  fil: {
    cta: 'Tingnan ang detalye',
    emptyTitle: 'May paparating na mga bagong abiso',
    emptySummary: 'Tingnan ang Notices para sa pinakabagong update mula sa JobChaja.',
    emptyTag: 'Abiso',
    previous: 'Nakaraang slide',
    next: 'Susunod na slide',
    slide: 'Pumunta sa slide {index}',
  },
} as const;

function detailHref(post: InfoBoardPost) {
  return post.category === 'ANNOUNCEMENTS'
    ? `/notice/${post.id}`
    : `/guide/${post.id}`;
}

function bannerImage(post: InfoBoardPost) {
  if (post.bannerImage) return post.bannerImage;
  if (post.thumbnail) return post.thumbnail;
  return post.attachments.find((attachment) => attachment.mimeType?.startsWith('image/'))?.url;
}

function conciseSummary(summary: string, content: string) {
  const value = (summary || content).replace(/\s+/g, ' ').trim();
  return value.length > 110 ? `${value.slice(0, 107)}...` : value;
}

export default function FeaturedNoticeSlider() {
  const { lang } = useLanguage();
  const locale = resolveBoardLocale(lang);
  const copy = COPY[locale];
  const labels = BOARD_LABELS[locale];
  const [posts, setPosts] = useState<InfoBoardPost[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    listFeaturedInfoBoard(locale, 8, controller.signal)
      .then((result) => {
        setPosts(result.items);
        setCurrent(0);
      })
      .catch(() => {
        if (!controller.signal.aborted) setPosts([]);
      });
    return () => controller.abort();
  }, [locale]);

  const next = useCallback(() => {
    setCurrent((value) => (posts.length > 0 ? (value + 1) % posts.length : 0));
  }, [posts.length]);

  const previous = useCallback(() => {
    setCurrent((value) =>
      posts.length > 0 ? (value - 1 + posts.length) % posts.length : 0,
    );
  }, [posts.length]);

  useEffect(() => {
    if (paused || posts.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [next, paused, posts.length]);

  const post = posts[current];
  const translation = useMemo(
    () => (post ? getLocalizedPost(post, locale) : null),
    [locale, post],
  );
  const image = post ? bannerImage(post) : undefined;
  const theme = post ? THEME_CLASS[post.bannerTheme] : THEME_CLASS.BRAND;
  const href = post ? detailHref(post) : '/notice';
  const title = translation?.title || copy.emptyTitle;
  const summary = translation
    ? conciseSummary(translation.summary, translation.content)
    : copy.emptySummary;
  const tag = post ? labels.categories[post.category] : copy.emptyTag;
  const count = Math.max(posts.length, 1);

  return (
    <section
      className={`group/slider relative min-h-[248px] flex-1 overflow-hidden rounded-lg text-white ${theme}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-live="polite"
    >
      {image && (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${JSON.stringify(image)})` }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/25" aria-hidden="true" />
        </>
      )}

      <Link href={href} className="relative z-10 flex h-full min-h-[248px] flex-col justify-between p-5">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex max-w-[75%] items-center gap-1.5 rounded bg-black/20 px-2 py-1 text-[11px] font-bold">
              <Megaphone className="h-3 w-3 shrink-0" />
              <span className="truncate">{tag}</span>
            </span>
            <span className="text-[11px] font-semibold text-white/70">
              {Math.min(current + 1, count)}/{count}
            </span>
          </div>
          <h2 className="line-clamp-3 text-lg font-bold leading-snug">{title}</h2>
          {summary && <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/80">{summary}</p>}
        </div>

        <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded bg-white px-3 py-2 text-xs font-bold text-[#191F28]">
          {copy.cta} <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      {posts.length > 1 && (
        <>
          <button
            type="button"
            onClick={previous}
            className="absolute left-1.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 transition-opacity hover:bg-black/55 focus:opacity-100 group-hover/slider:opacity-100"
            aria-label={copy.previous}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-1.5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 transition-opacity hover:bg-black/55 focus:opacity-100 group-hover/slider:opacity-100"
            aria-label={copy.next}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1.5">
            {posts.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrent(index)}
                className={`h-1.5 rounded-full transition-[width,background-color] ${
                  index === current ? 'w-4 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'
                }`}
                aria-label={copy.slide.replace('{index}', String(index + 1))}
                aria-current={index === current ? 'true' : undefined}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
