'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { BOARD_LABELS, resolveBoardLocale } from '@/features/board/copy';
import type { InfoBoardLocale, InfoBoardPost } from '@/features/board/types';
import { getLocalizedPost, listPublicInfoBoard } from '@/lib/info-board-client';

const HOME_BOARD_CATEGORIES = [
  'EDUCATION',
  'EXAM',
  'TRAINING',
  'EVENTS',
  'LIVING_TIPS',
] as const;
const HOME_BOARD_TABS = ['ALL', ...HOME_BOARD_CATEGORIES] as const;

type HomeBoardTab = (typeof HOME_BOARD_TABS)[number];
type HomeBoardCategory = (typeof HOME_BOARD_CATEGORIES)[number];
const HOME_BOARD_LIMIT = 7;

type HomeBoardCopy = {
  title: string;
  viewAll: string;
  loading: string;
  empty: string;
  error: string;
  retry: string;
  openPost: string;
  tabs: Record<HomeBoardTab, string>;
};

type HomeBoardLoadState = {
  requestKey: string;
  posts: InfoBoardPost[];
  error: boolean;
};

const HOME_BOARD_COPY: Record<InfoBoardLocale, HomeBoardCopy> = {
  ko: {
    title: '교육·생활 정보',
    viewAll: '전체보기',
    loading: '정보를 불러오는 중입니다.',
    empty: '등록된 정보가 없습니다.',
    error: '정보를 불러오지 못했습니다.',
    retry: '다시 시도',
    openPost: '게시글 열기',
    tabs: {
      ALL: '전체',
      EDUCATION: '교육',
      EXAM: '시험',
      TRAINING: '훈련',
      EVENTS: '행사',
      LIVING_TIPS: '생활',
    },
  },
  en: {
    title: 'Education & daily life',
    viewAll: 'View all',
    loading: 'Loading information.',
    empty: 'No information has been posted yet.',
    error: 'Unable to load information.',
    retry: 'Try again',
    openPost: 'Open post',
    tabs: {
      ALL: 'All',
      EDUCATION: 'Education',
      EXAM: 'Exams',
      TRAINING: 'Training',
      EVENTS: 'Events',
      LIVING_TIPS: 'Living',
    },
  },
  vi: {
    title: 'Giáo dục & đời sống',
    viewAll: 'Xem tất cả',
    loading: 'Đang tải thông tin.',
    empty: 'Chưa có thông tin nào được đăng.',
    error: 'Không thể tải thông tin.',
    retry: 'Thử lại',
    openPost: 'Mở bài viết',
    tabs: {
      ALL: 'Tất cả',
      EDUCATION: 'Giáo dục',
      EXAM: 'Kỳ thi',
      TRAINING: 'Đào tạo',
      EVENTS: 'Sự kiện',
      LIVING_TIPS: 'Đời sống',
    },
  },
  th: {
    title: 'การศึกษาและการใช้ชีวิต',
    viewAll: 'ดูทั้งหมด',
    loading: 'กำลังโหลดข้อมูล',
    empty: 'ยังไม่มีข้อมูลที่เผยแพร่',
    error: 'ไม่สามารถโหลดข้อมูลได้',
    retry: 'ลองอีกครั้ง',
    openPost: 'เปิดโพสต์',
    tabs: {
      ALL: 'ทั้งหมด',
      EDUCATION: 'การศึกษา',
      EXAM: 'การสอบ',
      TRAINING: 'ฝึกอบรม',
      EVENTS: 'กิจกรรม',
      LIVING_TIPS: 'การใช้ชีวิต',
    },
  },
  fil: {
    title: 'Edukasyon at pamumuhay',
    viewAll: 'Tingnan lahat',
    loading: 'Naglo-load ng impormasyon.',
    empty: 'Wala pang impormasyong nai-post.',
    error: 'Hindi ma-load ang impormasyon.',
    retry: 'Subukan muli',
    openPost: 'Buksan ang post',
    tabs: {
      ALL: 'Lahat',
      EDUCATION: 'Edukasyon',
      EXAM: 'Pagsusulit',
      TRAINING: 'Pagsasanay',
      EVENTS: 'Kaganapan',
      LIVING_TIPS: 'Pamumuhay',
    },
  },
};

const DATE_LOCALES: Record<InfoBoardLocale, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  vi: 'vi-VN',
  th: 'th-TH',
  fil: 'fil-PH',
};

function isHomeBoardCategory(category: string): category is HomeBoardCategory {
  return HOME_BOARD_CATEGORIES.includes(category as HomeBoardCategory);
}

function postHref(post: InfoBoardPost) {
  const category = post.category as string;
  return category === 'ANNOUNCEMENTS' || category === 'EVENTS'
    ? `/notice/${post.id}`
    : `/guide/${post.id}`;
}

function formatPostDate(post: InfoBoardPost, locale: InfoBoardLocale) {
  const date = new Date(post.publishedAt || post.createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export default function HomeInfoBoard() {
  const { lang } = useLanguage();
  const locale = resolveBoardLocale(lang);
  const copy = HOME_BOARD_COPY[locale];
  const boardLabels = BOARD_LABELS[locale];
  const [activeTab, setActiveTab] = useState<HomeBoardTab>('ALL');
  const [reloadKey, setReloadKey] = useState(0);
  const [loadState, setLoadState] = useState<HomeBoardLoadState>({
    requestKey: '',
    posts: [],
    error: false,
  });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const requestKey = `${locale}:${activeTab}:${reloadKey}`;
  const loading = loadState.requestKey !== requestKey;
  const error = !loading && loadState.error;
  const posts = loading ? [] : loadState.posts;

  useEffect(() => {
    const controller = new AbortController();

    const category = activeTab === 'ALL' ? '' : activeTab;
    type PublicQuery = Parameters<typeof listPublicInfoBoard>[0];

    void listPublicInfoBoard(
      {
        locale,
        page: 1,
        limit: activeTab === 'ALL' ? 30 : HOME_BOARD_LIMIT,
        // EXAM, TRAINING and EVENTS are accepted by the current API contract.
        category: category as unknown as PublicQuery['category'],
      },
      controller.signal,
    )
      .then((result) => {
        const visiblePosts = result.items.filter((post) => {
          const postCategory = post.category as string;
          return (
            post.status === 'PUBLISHED' &&
            post.audience === 'ALL' &&
            (activeTab === 'ALL' || postCategory === activeTab)
          );
        });
        setLoadState({
          requestKey,
          posts: visiblePosts.slice(0, HOME_BOARD_LIMIT),
          error: false,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoadState({ requestKey, posts: [], error: true });
        }
      });

    return () => controller.abort();
  }, [activeTab, locale, reloadKey, requestKey]);

  const selectTab = (tab: HomeBoardTab, index: number) => {
    setActiveTab(tab);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % HOME_BOARD_TABS.length;
    else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + HOME_BOARD_TABS.length) % HOME_BOARD_TABS.length;
    } else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = HOME_BOARD_TABS.length - 1;
    else return;

    event.preventDefault();
    selectTab(HOME_BOARD_TABS[nextIndex], nextIndex);
  };

  const viewAllHref = activeTab === 'EVENTS' ? '/notice' : '/guide';

  return (
    <section
      className="flex min-h-[340px] min-w-0 flex-col overflow-hidden rounded-lg border border-[#E5E8EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      aria-labelledby="home-info-board-title"
      aria-busy={loading}
    >
      <div className="border-b border-[#F2F4F6] px-3 pt-3">
        <div className="flex min-w-0 items-center justify-between gap-2 pb-2">
          <h2 id="home-info-board-title" className="truncate text-[13px] font-bold text-[#191F28]">
            {copy.title}
          </h2>
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-[#8B95A1] transition-colors hover:text-[#0066FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
          >
            {copy.viewAll} <ArrowRight aria-hidden="true" size={10} />
          </Link>
        </div>

        <div
          role="tablist"
          aria-label={copy.title}
          className="flex max-w-full gap-0.5 overflow-x-auto pb-2"
        >
          {HOME_BOARD_TABS.map((tab, index) => (
            <button
              key={tab}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`home-info-tab-${tab.toLowerCase()}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls="home-info-tabpanel"
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] ${
                activeTab === tab
                  ? 'bg-[#191F28] text-white'
                  : 'text-[#8B95A1] hover:bg-[#F2F4F6] hover:text-[#333D4B]'
              }`}
            >
              {copy.tabs[tab]}
            </button>
          ))}
        </div>
      </div>

      <div
        id="home-info-tabpanel"
        role="tabpanel"
        aria-labelledby={`home-info-tab-${activeTab.toLowerCase()}`}
        className="min-h-0 flex-1 divide-y divide-[#F2F4F6]"
      >
        {loading ? (
          <div className="flex h-full min-h-56 items-center justify-center px-4 text-center text-[12px] text-[#8B95A1]">
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#D1D6DB] border-t-[#0066FF]" aria-hidden="true" />
              {copy.loading}
            </span>
          </div>
        ) : error ? (
          <div className="flex h-full min-h-56 flex-col items-center justify-center px-4 text-center">
            <p className="text-[12px] text-[#6B7684]">{copy.error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[#0066FF] px-2.5 py-1.5 text-[11px] font-semibold text-[#0066FF] transition-colors hover:bg-[#EAF2FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
            >
              <RefreshCw aria-hidden="true" size={12} /> {copy.retry}
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex h-full min-h-56 items-center justify-center px-4 text-center text-[12px] text-[#8B95A1]">
            {copy.empty}
          </div>
        ) : (
          posts.map((post) => {
            const localized = getLocalizedPost(post, locale);
            const category = post.category as string;
            const date = formatPostDate(post, locale);
            const title = localized.title || post.fallbackTitle;
            const categoryLabel = isHomeBoardCategory(category)
              ? copy.tabs[category]
              : boardLabels.categories[post.category];

            return (
              <Link
                key={post.id}
                href={postHref(post)}
                aria-label={`${copy.openPost}: ${title}`}
                className="group grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 transition-colors hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0066FF]"
              >
                <span className="max-w-[68px] truncate rounded bg-[#EAF2FF] px-1.5 py-0.5 text-[9px] font-bold text-[#0066FF]">
                  {categoryLabel}
                </span>
                <span className="min-w-0 truncate text-[12px] font-medium text-[#333D4B] transition-colors group-hover:text-[#0066FF]">
                  {title}
                </span>
                {date && (
                  <time
                    dateTime={post.publishedAt || post.createdAt}
                    className="shrink-0 whitespace-nowrap text-[9px] text-[#B0B8C1]"
                  >
                    {date}
                  </time>
                )}
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
