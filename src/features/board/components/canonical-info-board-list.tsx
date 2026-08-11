'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Gavel,
  Megaphone,
  Pin,
  RefreshCw,
  Search,
  ClipboardCheck,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/i18n/LanguageProvider';
import {
  getLocalizedPost,
  listCompanyInfoBoard,
  listPublicInfoBoard,
  listWorkerInfoBoard,
} from '@/lib/info-board-client';
import { BOARD_COPY, BOARD_LABELS, getBoardErrorMessage, resolveBoardLocale } from '../copy';
import {
  INFO_BOARD_CATEGORIES,
  type InfoBoardCategory,
  type InfoBoardPost,
} from '../types';

export type InfoBoardAccess = 'public' | 'worker' | 'company' | 'auto';
export type InfoBoardKind = 'notice' | 'guide';

const PAGE_SIZE = 10;
const CATEGORY_ICONS = {
  VISA_INFO: FileText,
  EDUCATION: BookOpen,
  EXAM: ClipboardCheck,
  TRAINING: GraduationCap,
  EVENTS: CalendarDays,
  LIVING_TIPS: AlertCircle,
  POLICY_LAW: Gavel,
  ANNOUNCEMENTS: Megaphone,
} satisfies Record<InfoBoardCategory, typeof FileText>;

function localeTag(locale: string) {
  return locale === 'fil' ? 'fil-PH' : locale;
}

function allowedAudience(post: InfoBoardPost, access: Exclude<InfoBoardAccess, 'auto'>) {
  if (access === 'worker') return post.audience === 'ALL' || post.audience === 'WORKER';
  if (access === 'company') return post.audience === 'ALL' || post.audience === 'COMPANY';
  return post.audience === 'ALL';
}

export function CanonicalInfoBoardList({
  access,
  kind,
  basePath,
}: {
  access: InfoBoardAccess;
  kind: InfoBoardKind;
  basePath: string;
}) {
  const { isLoading: authLoading, isLoggedIn, role } = useAuth();
  const { lang } = useLanguage();
  const locale = resolveBoardLocale(lang);
  const copy = BOARD_COPY[locale];
  const labels = BOARD_LABELS[locale];
  const resolvedAccess: Exclude<InfoBoardAccess, 'auto'> =
    access !== 'auto'
      ? access
      : isLoggedIn && role === 'INDIVIDUAL'
        ? 'worker'
        : isLoggedIn && role === 'CORPORATE'
          ? 'company'
          : 'public';
  const waitingForAuth = access === 'auto' && authLoading;
  const [queryInput, setQueryInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<InfoBoardCategory | ''>(
    kind === 'notice' ? 'ANNOUNCEMENTS' : '',
  );
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<InfoBoardPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedAccess, setLoadedAccess] = useState<Exclude<InfoBoardAccess, 'auto'> | null>(null);

  useEffect(() => {
    if (waitingForAuth) return;
    const controller = new AbortController();
    const query = { search, category, locale, page, limit: PAGE_SIZE };
    const request =
      resolvedAccess === 'worker'
        ? listWorkerInfoBoard(query, controller.signal)
        : resolvedAccess === 'company'
          ? listCompanyInfoBoard(query, controller.signal)
          : listPublicInfoBoard(query, controller.signal);

    request
      .then((result) => {
        const visible = result.items.filter(
          (post) =>
            post.status === 'PUBLISHED' &&
            allowedAudience(post, resolvedAccess) &&
            (kind !== 'notice' || post.category === 'ANNOUNCEMENTS'),
        );
        setPosts(visible);
        setTotal(result.total);
        setError('');
        setLoadedAccess(resolvedAccess);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setPosts([]);
        setTotal(0);
        setError(getBoardErrorMessage(reason, copy, copy.loadError));
        setLoadedAccess(resolvedAccess);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [category, copy, kind, locale, page, reloadKey, resolvedAccess, search, waitingForAuth]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const accessLoading = waitingForAuth || loadedAccess !== resolvedAccess;
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => Number(b.isPinned) - Number(a.isPinned)),
    [posts],
  );
  const title =
    kind === 'notice'
      ? resolvedAccess === 'company' ? copy.companyTitle : copy.noticeTitle
      : resolvedAccess === 'worker'
        ? copy.workerGuideTitle
        : resolvedAccess === 'company'
          ? copy.companyGuideTitle
          : copy.guideTitle;
  const description =
    kind === 'notice'
      ? resolvedAccess === 'company' ? copy.companyDescription : copy.noticeDescription
      : resolvedAccess === 'worker'
        ? copy.workerGuideDescription
        : resolvedAccess === 'company'
          ? copy.companyGuideDescription
          : copy.guideDescription;

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setPage(1);
    setSearch(queryInput.trim());
  };

  const changeCategory = (value: InfoBoardCategory | '') => {
    setLoading(true);
    setError('');
    setCategory(value);
    setPage(1);
  };

  return (
    <main className="min-h-[70vh] bg-[#F9FAFB] text-[#191F28]">
      <header className="border-b border-[#E5E8EB] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-sm font-semibold text-[#0066FF]">{copy.informationEyebrow}</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7684]">{description}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <form onSubmit={submitSearch} className="flex gap-2" role="search">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">{copy.searchPlaceholder}</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B95A1]" />
            <input
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="h-11 w-full rounded-lg border border-[#D1D6DB] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-semibold text-white hover:bg-[#0056D6]"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.search}</span>
          </button>
        </form>

        {kind === 'guide' && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label={copy.categories}>
            <button
              type="button"
              onClick={() => changeCategory('')}
              aria-pressed={category === ''}
              className={`h-9 shrink-0 rounded-lg border px-3 text-sm font-medium ${
                category === ''
                  ? 'border-[#0066FF] bg-[#0066FF] text-white'
                  : 'border-[#D1D6DB] bg-white text-[#4E5968] hover:border-[#0066FF]'
              }`}
            >
              {copy.allCategories}
            </button>
            {INFO_BOARD_CATEGORIES.map((item) => {
              const Icon = CATEGORY_ICONS[item];
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeCategory(item)}
                  aria-pressed={category === item}
                  className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium ${
                    category === item
                      ? 'border-[#0066FF] bg-[#0066FF] text-white'
                      : 'border-[#D1D6DB] bg-white text-[#4E5968] hover:border-[#0066FF]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {labels.categories[item]}
                </button>
              );
            })}
          </div>
        )}

        <section className="mt-5" aria-live="polite" aria-busy={accessLoading || loading}>
          {accessLoading || loading ? (
            <div className="space-y-2" aria-label={waitingForAuth ? copy.authChecking : copy.loadingAria}>
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-lg border border-[#E5E8EB] bg-white p-4" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-white px-5 py-10 text-center">
              <AlertCircle className="mx-auto h-7 w-7 text-red-500" />
              <p className="mt-3 text-sm font-semibold">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError('');
                  setReloadKey((value) => value + 1);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#0066FF] px-3 py-2 text-sm font-semibold text-[#0066FF]"
              >
                <RefreshCw className="h-4 w-4" /> {copy.retry}
              </button>
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="rounded-lg border border-[#E5E8EB] bg-white px-5 py-12 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-[#B0B8C1]" />
              <p className="mt-3 text-sm text-[#6B7684]">
                {search || (kind === 'guide' && category) ? copy.noSearchResults : copy.empty}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-[#E5E8EB] bg-white">
              {sortedPosts.map((post) => {
                const localized = getLocalizedPost(post, locale);
                const Icon = CATEGORY_ICONS[post.category];
                const titleText = localized.title || post.fallbackTitle;
                return (
                  <Link
                    key={post.id}
                    href={`${basePath}/${post.id}`}
                    aria-label={`${copy.openPost}: ${titleText}`}
                    className="group flex min-h-24 items-start gap-3 border-b border-[#E5E8EB] p-4 last:border-b-0 hover:bg-[#F9FAFB] sm:p-5"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF2FF] text-[#0066FF]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-xs text-[#8B95A1]">
                        <span>{labels.categories[post.category]}</span>
                        <span aria-hidden="true">·</span>
                        <time>{new Intl.DateTimeFormat(localeTag(locale), { dateStyle: 'medium' }).format(new Date(post.publishedAt || post.createdAt))}</time>
                        {post.isPinned && (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#0066FF]">
                            <Pin className="h-3 w-3" /> {copy.pinned}
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 line-clamp-2 block text-sm font-semibold group-hover:text-[#0066FF] sm:text-base">
                        {titleText}
                      </span>
                    </span>
                    <ChevronRight className="mt-3 h-4 w-4 shrink-0 text-[#B0B8C1] group-hover:text-[#0066FF]" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {!accessLoading && !loading && !error && totalPages > 1 && (
          <nav className="mt-6 flex items-center justify-center gap-3" aria-label={copy.pagination}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                setLoading(true);
                setError('');
                setPage((value) => Math.max(1, value - 1));
              }}
              aria-label={copy.previous}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D1D6DB] bg-white disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-16 text-center text-sm font-semibold">{page} / {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => {
                setLoading(true);
                setError('');
                setPage((value) => Math.min(totalPages, value + 1));
              }}
              aria-label={copy.next}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D1D6DB] bg-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </main>
  );
}
