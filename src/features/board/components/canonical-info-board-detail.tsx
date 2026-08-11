'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Download, FileText, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/i18n/LanguageProvider';
import {
  getCompanyInfoBoardPost,
  getLocalizedPost,
  getPublicInfoBoardPost,
  getWorkerInfoBoardPost,
} from '@/lib/info-board-client';
import { BOARD_COPY, BOARD_LABELS, getBoardErrorMessage, resolveBoardLocale } from '../copy';
import type { InfoBoardCategory, InfoBoardPost } from '../types';
import type { InfoBoardAccess } from './canonical-info-board-list';

function isNotFound(reason: unknown) {
  return (
    typeof reason === 'object' &&
    reason !== null &&
    (('code' in reason && reason.code === 'NOT_FOUND') ||
      ('status' in reason && Number(reason.status) === 404))
  );
}

function allowedAudience(post: InfoBoardPost, access: Exclude<InfoBoardAccess, 'auto'>) {
  if (access === 'worker') return post.audience === 'ALL' || post.audience === 'WORKER';
  if (access === 'company') return post.audience === 'ALL' || post.audience === 'COMPANY';
  return post.audience === 'ALL';
}

export function CanonicalInfoBoardDetail({
  access,
  postId,
  basePath,
  requiredCategory,
}: {
  access: InfoBoardAccess;
  postId: number;
  basePath: string;
  requiredCategory?: InfoBoardCategory;
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
  const [post, setPost] = useState<InfoBoardPost | null>(null);
  const hasValidId = Number.isInteger(postId) && postId > 0;
  const [loading, setLoading] = useState(hasValidId);
  const [error, setError] = useState('');
  const [notFoundAccess, setNotFoundAccess] = useState<Exclude<InfoBoardAccess, 'auto'> | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedAccess, setLoadedAccess] = useState<Exclude<InfoBoardAccess, 'auto'> | null>(null);

  useEffect(() => {
    if (waitingForAuth || !hasValidId) return;
    const controller = new AbortController();
    const request =
      resolvedAccess === 'worker'
        ? getWorkerInfoBoardPost(postId, locale, controller.signal)
        : resolvedAccess === 'company'
          ? getCompanyInfoBoardPost(postId, locale, controller.signal)
          : getPublicInfoBoardPost(postId, locale, controller.signal);

    request
      .then((result) => {
        if (
          result.status !== 'PUBLISHED' ||
          !allowedAudience(result, resolvedAccess) ||
          (requiredCategory && result.category !== requiredCategory)
        ) {
          setPost(null);
          setNotFoundAccess(resolvedAccess);
          setLoadedAccess(resolvedAccess);
          return;
        }
        setPost(result);
        setError('');
        setNotFoundAccess(null);
        setLoadedAccess(resolvedAccess);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        if (isNotFound(reason)) {
          setNotFoundAccess(resolvedAccess);
          setLoadedAccess(resolvedAccess);
          return;
        }
        setError(getBoardErrorMessage(reason, copy, copy.loadError));
        setLoadedAccess(resolvedAccess);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [copy, hasValidId, locale, postId, reloadKey, requiredCategory, resolvedAccess, waitingForAuth]);

  const notFound = !hasValidId || notFoundAccess === resolvedAccess;

  if (!notFound && (waitingForAuth || loading || loadedAccess !== resolvedAccess)) {
    return (
      <main className="min-h-[70vh] bg-[#F9FAFB] px-4 py-12" aria-busy="true">
        <div className="mx-auto max-w-4xl animate-pulse rounded-lg border border-[#E5E8EB] bg-white p-6" aria-label={waitingForAuth ? copy.authChecking : copy.loadingAria}>
          <div className="h-4 w-28 rounded bg-[#E5E8EB]" />
          <div className="mt-5 h-7 w-3/4 rounded bg-[#E5E8EB]" />
          <div className="mt-8 h-56 rounded bg-[#F0F2F4]" />
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-[70vh] bg-[#F9FAFB] px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-lg border border-[#E5E8EB] bg-white p-8 text-center">
          <FileText className="mx-auto h-8 w-8 text-[#B0B8C1]" />
          <h1 className="mt-3 text-lg font-bold">{copy.notFound}</h1>
          <p className="mt-2 text-sm text-[#6B7684]">{copy.notFoundDescription}</p>
          <Link href={basePath} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#0066FF] px-4 py-2 text-sm font-semibold text-[#0066FF]">
            <ArrowLeft className="h-4 w-4" /> {copy.backToList}
          </Link>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-[70vh] bg-[#F9FAFB] px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <h1 className="mt-3 text-lg font-bold">{error || copy.loadError}</h1>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError('');
              setReloadKey((value) => value + 1);
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" /> {copy.retry}
          </button>
        </div>
      </main>
    );
  }

  const localized = getLocalizedPost(post, locale);
  return (
    <main className="min-h-[70vh] bg-[#F9FAFB] px-4 py-8 text-[#191F28] sm:px-6 sm:py-12">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-[#E5E8EB] bg-white">
        <header className="border-b border-[#E5E8EB] px-5 py-6 sm:px-8 sm:py-8">
          <Link href={basePath} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0066FF] hover:text-[#0056D6]">
            <ArrowLeft className="h-4 w-4" /> {copy.backToList}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[#6B7684]">
            <span className="rounded bg-[#EAF2FF] px-2 py-1 font-semibold text-[#0066FF]">
              {labels.categories[post.category]}
            </span>
            <span>
              {copy.published}{' '}
              {new Intl.DateTimeFormat(locale === 'fil' ? 'fil-PH' : locale, { dateStyle: 'long' }).format(new Date(post.publishedAt || post.createdAt))}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-bold leading-9 sm:text-3xl">
            {localized.title || post.fallbackTitle}
          </h1>
        </header>

        <div className="px-5 py-7 sm:px-8 sm:py-10">
          <div className="whitespace-pre-wrap break-words text-[15px] leading-8 text-[#333D4B]">
            {localized.content || post.fallbackContent}
          </div>

          {post.attachments.length > 0 && (
            <section className="mt-10 border-t border-[#E5E8EB] pt-6">
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <FileText className="h-4 w-4 text-[#0066FF]" /> {copy.attachment}
              </h2>
              <div className="mt-3 space-y-2">
                {post.attachments.map((attachment) =>
                  attachment.url ? (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${copy.downloadAttachment}: ${attachment.name}`}
                      className="flex items-center justify-between rounded-lg border border-[#E5E8EB] px-3 py-2.5 text-sm text-[#333D4B] hover:border-[#0066FF]"
                    >
                      <span className="truncate">{attachment.name}</span>
                      <Download className="h-4 w-4 shrink-0 text-[#0066FF]" />
                    </a>
                  ) : null,
                )}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
