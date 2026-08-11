'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  Filter,
  Globe,
  Loader2,
  MapPin,
  RefreshCw,
  X,
} from 'lucide-react';
import CompanyAuthGuard from '@/components/guards/company-auth-guard';
import { useLanguage } from '@/i18n/LanguageProvider';
import { normalizeLocale } from '@/i18n/locales';
import {
  JOB_OPTIONS,
  localizedList,
  NATIONALITY_OPTIONS,
  optionLabel,
  REGION_OPTIONS,
  TALENT_COPY,
  talentErrorMessage,
} from './copy';
import TalentDetailModal from './talent-detail-modal';
import {
  AccessCheck,
  Pagination,
  ResumeDetail,
  TalentApiError,
  talentRequest,
  TalentSummary,
} from './talent-api';

type SearchResponse = { talents: TalentSummary[]; pagination: Pagination };
type ConfirmState = { talent: TalentSummary; access: AccessCheck };

export default function CompanyTalentSearch() {
  const { lang } = useLanguage();
  const locale = normalizeLocale(lang);
  const copy = TALENT_COPY[locale];
  const [talents, setTalents] = useState<TalentSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ nationality: '', topikLevel: '', jobType: '', region: '' });
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [detail, setDetail] = useState<ResumeDetail | null>(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const loadSearch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
      const data = await talentRequest<SearchResponse>(`/api/resumes/search?${params}`);
      setTalents(data.talents); setPagination(data.pagination);
    } catch (caught) { setError(caught); }
    finally { setLoading(false); }
  }, [filters, page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadSearch(); }, [loadSearch]);
  useEffect(() => {
    void Promise.all([
      talentRequest<{ ids: number[] }>('/api/resumes/bookmarks/ids').then((data) => setBookmarkedIds(new Set(data.ids))),
      talentRequest<{ totalRemaining: number }>('/api/payments/viewing-credits/balance').then((data) => setCredits(data.totalRemaining)),
    ]).catch(() => undefined);
  }, []);

  const removeWithdrawn = (resumeId: number) => {
    setTalents((current) => current.filter((talent) => talent.resumeId !== resumeId));
    setPagination((current) => ({ ...current, total: Math.max(0, current.total - 1) }));
  };

  const fetchDetail = async (resumeId: number) => {
    setWorkingId(resumeId); setActionError(null);
    try {
      const loaded = await talentRequest<ResumeDetail>(`/api/resumes/${resumeId}/detail`);
      setCredits(loaded.remainingCredits); setDetail(loaded); setConfirmState(null);
    } catch (caught) {
      if (caught instanceof TalentApiError && caught.status === 404) removeWithdrawn(resumeId);
      setActionError(talentErrorMessage(caught, copy)); setConfirmState(null);
    } finally { setWorkingId(null); }
  };

  const requestView = async (talent: TalentSummary) => {
    setWorkingId(talent.resumeId); setActionError(null);
    try {
      const access = await talentRequest<AccessCheck>(`/api/resumes/${talent.resumeId}/check-access`);
      setCredits(access.remainingCredits);
      if (access.alreadyViewed) await fetchDetail(talent.resumeId);
      else setConfirmState({ talent, access });
    } catch (caught) {
      if (caught instanceof TalentApiError && caught.status === 404) removeWithdrawn(talent.resumeId);
      setActionError(talentErrorMessage(caught, copy));
    } finally { setWorkingId(null); }
  };

  const toggleBookmark = async (talent: TalentSummary) => {
    const bookmarked = bookmarkedIds.has(talent.resumeId);
    setWorkingId(talent.resumeId); setActionError(null);
    try {
      await talentRequest(`/api/resumes/${talent.resumeId}/bookmark`, { method: bookmarked ? 'DELETE' : 'POST' });
      setBookmarkedIds((current) => {
        const next = new Set(current);
        if (bookmarked) next.delete(talent.resumeId);
        else next.add(talent.resumeId);
        return next;
      });
    } catch (caught) {
      if (caught instanceof TalentApiError && caught.status === 404) removeWithdrawn(talent.resumeId);
      setActionError(talentErrorMessage(caught, copy));
    } finally { setWorkingId(null); }
  };

  const renderFilterFields = () => (
    <div className="space-y-4">
      <label className="block min-w-0 text-sm font-medium">
        {copy.search.nationality}
        <select
          value={filters.nationality}
          onChange={(event) => {
            setFilters({ ...filters, nationality: event.target.value });
            setPage(1);
          }}
          className="mt-1.5 h-10 w-full min-w-0 rounded-lg border border-[#DDE2E8] bg-white px-3"
        >
          <option value="">{copy.search.all}</option>
          {NATIONALITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.labels[locale]}</option>
          ))}
        </select>
      </label>
      <label className="block min-w-0 text-sm font-medium">
        {copy.search.korean}
        <select
          value={filters.topikLevel}
          onChange={(event) => {
            setFilters({ ...filters, topikLevel: event.target.value });
            setPage(1);
          }}
          className="mt-1.5 h-10 w-full min-w-0 rounded-lg border border-[#DDE2E8] bg-white px-3"
        >
          <option value="">{copy.search.all}</option>
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <option key={level} value={level}>{copy.common.topikAtLeast(level)}</option>
          ))}
        </select>
      </label>
      <label className="block min-w-0 text-sm font-medium">
        {copy.search.job}
        <select
          value={filters.jobType}
          onChange={(event) => {
            setFilters({ ...filters, jobType: event.target.value });
            setPage(1);
          }}
          className="mt-1.5 h-10 w-full min-w-0 rounded-lg border border-[#DDE2E8] bg-white px-3"
        >
          <option value="">{copy.search.all}</option>
          {JOB_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.labels[locale]}</option>
          ))}
        </select>
      </label>
      <label className="block min-w-0 text-sm font-medium">
        {copy.search.region}
        <select
          value={filters.region}
          onChange={(event) => {
            setFilters({ ...filters, region: event.target.value });
            setPage(1);
          }}
          className="mt-1.5 h-10 w-full min-w-0 rounded-lg border border-[#DDE2E8] bg-white px-3"
        >
          <option value="">{copy.search.all}</option>
          {REGION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.labels[locale]}</option>
          ))}
        </select>
      </label>
    </div>
  );

  return <CompanyAuthGuard requiredAccess="talent"><main className="min-h-screen bg-[#F9FAFB] px-4 py-7 text-[#191F28]"><div className="mx-auto max-w-6xl">
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h1 className="text-2xl font-bold">{copy.search.title}</h1><p className="mt-1 text-sm text-[#6B7684]">{copy.search.subtitle}</p></div><div className="flex min-w-0 flex-wrap items-center gap-3 text-sm"><span className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[#4E5968]"><CreditCard className="size-4 shrink-0" />{copy.common.creditBalance(credits)}</span><Link href="/company/talents/bookmarks" className="font-semibold text-[#0066FF]">{copy.search.bookmarks}</Link></div></header>
    {actionError && <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#FFD1D3] bg-[#FFF5F5] px-4 py-3 text-sm text-[#B4232B]"><AlertCircle className="mt-0.5 size-4 shrink-0" /><span className="min-w-0 flex-1 break-words">{actionError}</span><button onClick={() => setActionError(null)} aria-label={copy.common.close} className="ml-auto shrink-0"><X className="size-4" /></button></div>}
    <div className="flex gap-6"><aside className="hidden w-56 shrink-0 md:block"><div className="sticky top-20 border-r border-[#E5E8EB] pr-5"><h2 className="mb-4 flex items-center gap-2 font-bold"><Filter className="size-4" />{copy.search.filters}</h2>{renderFilterFields()}</div></aside>
      <section className="min-w-0 flex-1"><div className="mb-4 flex items-center justify-between gap-3"><p className="min-w-0 text-sm text-[#6B7684]">{copy.search.resultCount(pagination.total)}</p><button onClick={() => setShowMobileFilter(true)} className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg border border-[#DDE2E8] bg-white px-3 py-2 text-sm md:hidden"><Filter className="size-4" />{copy.search.filters}</button></div>
        {loading ? <div className="flex min-h-80 items-center justify-center"><Loader2 className="size-7 animate-spin text-[#0066FF]" /></div> : error ? <div className="border-y border-[#FFD1D3] bg-[#FFF5F5] px-5 py-12 text-center"><AlertCircle className="mx-auto size-8 text-[#E5484D]" /><h2 className="mt-3 break-words font-bold">{talentErrorMessage(error, copy)}</h2>{error instanceof TalentApiError && error.status === 401 ? <Link href="/auth/login" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0066FF] px-4 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{copy.common.login}</Link> : <button onClick={() => void loadSearch()} className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#DDE2E8] bg-white px-4 py-2 text-center text-sm font-semibold leading-5 whitespace-normal"><RefreshCw className="size-4 shrink-0" />{copy.common.retry}</button>}</div> : talents.length === 0 ? <div className="border-y border-[#E5E8EB] bg-white px-5 py-14 text-center text-sm text-[#6B7684]">{copy.search.empty}</div> : <div className="grid gap-3 sm:grid-cols-2">{talents.map((talent) => <article key={talent.resumeId} className="min-w-0 rounded-lg border border-[#E5E8EB] bg-white p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="flex min-w-0 items-center gap-2 break-words font-semibold"><Globe className="size-4 shrink-0 text-[#8B95A1]" />{optionLabel(NATIONALITY_OPTIONS, talent.nationality, locale)}</p><p className="mt-2 text-xs text-[#6B7684]">{copy.common.koreanLevel(talent.topikLevel, talent.kiipLevel)}</p></div><button onClick={() => void toggleBookmark(talent)} disabled={workingId === talent.resumeId} aria-label={bookmarkedIds.has(talent.resumeId) ? copy.common.removeBookmark : copy.common.bookmark} title={bookmarkedIds.has(talent.resumeId) ? copy.common.removeBookmark : copy.common.bookmark} className={`grid size-9 shrink-0 place-items-center rounded-lg ${bookmarkedIds.has(talent.resumeId) ? 'bg-[#EAF2FF] text-[#0066FF]' : 'text-[#8B95A1] hover:bg-[#F2F4F6]'}`}><Bookmark className="size-4" fill={bookmarkedIds.has(talent.resumeId) ? 'currentColor' : 'none'} /></button></div><p className="mt-4 break-words text-sm text-[#333D4B]">{localizedList(JOB_OPTIONS, talent.preferredJobTypes, locale) || copy.common.noJob}</p><p className="mt-2 flex min-w-0 items-start gap-1.5 text-xs text-[#6B7684]"><MapPin className="mt-0.5 size-3.5 shrink-0" /><span className="min-w-0 break-words">{localizedList(REGION_OPTIONS, talent.preferredRegions, locale) || copy.common.noRegion} · {copy.common.experience(talent.workExperienceCount)}</span></p><button onClick={() => void requestView(talent)} disabled={workingId === talent.resumeId} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#B7D2FF] px-3 py-2 text-center text-sm font-semibold leading-5 text-[#0066FF] whitespace-normal hover:bg-[#F2F7FF] disabled:opacity-50">{workingId === talent.resumeId ? <Loader2 className="size-4 shrink-0 animate-spin" /> : <Eye className="size-4 shrink-0" />}{copy.common.checkBeforeView}</button></article>)}</div>}
        {!loading && !error && pagination.totalPages > 1 && <nav aria-label={copy.common.page(page, pagination.totalPages)} className="mt-6 flex items-center justify-center gap-3"><button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} aria-label={copy.common.previousPage} className="grid size-9 place-items-center rounded-lg border border-[#DDE2E8] bg-white disabled:opacity-30"><ChevronLeft className="size-4" /></button><span className="text-sm">{copy.common.page(page, pagination.totalPages)}</span><button onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))} disabled={page >= pagination.totalPages} aria-label={copy.common.nextPage} className="grid size-9 place-items-center rounded-lg border border-[#DDE2E8] bg-white disabled:opacity-30"><ChevronRight className="size-4" /></button></nav>}
      </section></div>
    {showMobileFilter && <div className="fixed inset-0 z-50 bg-black/45"><div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-lg bg-white p-5"><div className="mb-5 flex items-center justify-between gap-3"><h2 className="min-w-0 break-words font-bold">{copy.search.filters}</h2><button onClick={() => setShowMobileFilter(false)} aria-label={copy.common.close} className="shrink-0"><X className="size-5" /></button></div>{renderFilterFields()}<button onClick={() => setShowMobileFilter(false)} className="mt-5 min-h-10 w-full rounded-lg bg-[#0066FF] px-3 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{copy.search.apply}</button></div></div>}
    {confirmState && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"><div className="w-full max-w-sm rounded-lg bg-white p-5"><h2 className="break-words text-lg font-bold">{copy.search.confirmTitle}</h2><p className="mt-2 break-words text-sm leading-6 text-[#6B7684]">{confirmState.access.canView ? copy.search.confirmBody : copy.search.noCredits}</p><p className="mt-2 break-words text-xs text-[#8B95A1]">{copy.common.remainingCredits(confirmState.access.remainingCredits)}</p><div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2"><button onClick={() => setConfirmState(null)} className="min-h-10 rounded-lg border border-[#DDE2E8] px-3 py-2 text-center text-sm font-semibold leading-5 whitespace-normal">{copy.common.cancel}</button>{confirmState.access.canView ? <button onClick={() => void fetchDetail(confirmState.talent.resumeId)} className="min-h-10 rounded-lg bg-[#0066FF] px-3 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{copy.common.view}</button> : <Link href="/company/payments/credits" className="flex min-h-10 items-center justify-center rounded-lg bg-[#0066FF] px-3 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{copy.search.checkCredits}</Link>}</div></div></div>}
    {detail && <TalentDetailModal detail={detail} onClose={() => setDetail(null)} />}
  </div></main></CompanyAuthGuard>;
}
