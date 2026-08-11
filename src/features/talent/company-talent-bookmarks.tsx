'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, BookmarkX, ChevronLeft, ChevronRight, Eye, Loader2, MapPin, RefreshCw } from 'lucide-react';
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
import { AccessCheck, Pagination, ResumeDetail, TalentApiError, talentRequest, TalentSummary } from './talent-api';

type Response = { talents: TalentSummary[]; pagination: Pagination };

export default function CompanyTalentBookmarks() {
  const { lang } = useLanguage();
  const locale = normalizeLocale(lang);
  const copy = TALENT_COPY[locale];
  const [talents, setTalents] = useState<TalentSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ResumeDetail | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const data = await talentRequest<Response>(`/api/resumes/bookmarks?page=${page}`); setTalents(data.talents); setPagination(data.pagination); }
    catch (caught) { setError(caught); }
    finally { setLoading(false); }
  }, [page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const removeLocal = (resumeId: number) => { setTalents((current) => current.filter((item) => item.resumeId !== resumeId)); setPagination((current) => ({ ...current, total: Math.max(0, current.total - 1) })); };
  const remove = async (resumeId: number) => {
    setWorkingId(resumeId); setActionError(null);
    try { await talentRequest(`/api/resumes/${resumeId}/bookmark`, { method: 'DELETE' }); removeLocal(resumeId); }
    catch (caught) { if (caught instanceof TalentApiError && caught.status === 404) removeLocal(resumeId); else setActionError(talentErrorMessage(caught, copy)); }
    finally { setWorkingId(null); }
  };

  const openDetail = async (resumeId: number) => {
    setWorkingId(resumeId); setActionError(null);
    try { const loaded = await talentRequest<ResumeDetail>(`/api/resumes/${resumeId}/detail`); setDetail(loaded); setConfirmId(null); }
    catch (caught) { if (caught instanceof TalentApiError && caught.status === 404) removeLocal(resumeId); setActionError(talentErrorMessage(caught, copy)); }
    finally { setWorkingId(null); }
  };

  const requestView = async (resumeId: number) => {
    setWorkingId(resumeId); setActionError(null);
    try {
      const access = await talentRequest<AccessCheck>(`/api/resumes/${resumeId}/check-access`);
      if (!access.canView) setActionError(copy.errors[402]);
      else if (access.alreadyViewed) await openDetail(resumeId);
      else setConfirmId(resumeId);
    } catch (caught) { if (caught instanceof TalentApiError && caught.status === 404) removeLocal(resumeId); setActionError(talentErrorMessage(caught, copy)); }
    finally { setWorkingId(null); }
  };

  return <CompanyAuthGuard requiredAccess="talent"><main className="min-h-screen bg-[#F9FAFB] px-4 py-7 text-[#191F28]"><div className="mx-auto max-w-4xl">
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4"><div className="min-w-0"><h1 className="text-2xl font-bold">{copy.bookmarks.title}</h1><p className="mt-1 text-sm text-[#6B7684]">{copy.bookmarks.subtitle}</p></div><Link href="/company/talents" className="break-words text-sm font-semibold text-[#0066FF]">{copy.common.searchTalents}</Link></header>
    {actionError && <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#FFD1D3] bg-[#FFF5F5] px-4 py-3 text-sm text-[#B4232B]"><AlertCircle className="mt-0.5 size-4 shrink-0" /><span className="min-w-0 break-words">{actionError}</span></div>}
    {loading ? <div className="flex min-h-80 items-center justify-center"><Loader2 className="size-7 animate-spin text-[#0066FF]" /></div> : error ? <div className="border-y border-[#FFD1D3] bg-[#FFF5F5] px-5 py-12 text-center"><AlertCircle className="mx-auto size-8 text-[#E5484D]" /><p className="mt-3 break-words font-bold">{talentErrorMessage(error, copy)}</p>{error instanceof TalentApiError && error.status === 401 ? <Link href="/auth/login" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0066FF] px-4 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{copy.common.login}</Link> : <button onClick={() => void load()} className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#DDE2E8] bg-white px-4 py-2 text-center text-sm font-semibold leading-5 whitespace-normal"><RefreshCw className="size-4 shrink-0" />{copy.common.retry}</button>}</div> : talents.length === 0 ? <div className="border-y border-[#E5E8EB] bg-white px-5 py-14 text-center"><p className="break-words font-semibold">{copy.bookmarks.empty}</p><Link href="/company/talents" className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0066FF] px-4 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{copy.common.searchTalents}</Link></div> : <div className="space-y-3">{talents.map((talent) => <article key={talent.resumeId} className="min-w-0 rounded-lg border border-[#E5E8EB] bg-white p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-words font-semibold">{optionLabel(NATIONALITY_OPTIONS, talent.nationality, locale)} · TOPIK {talent.topikLevel ?? '-'}</p><p className="mt-2 break-words text-sm text-[#4E5968]">{localizedList(JOB_OPTIONS, talent.preferredJobTypes, locale) || copy.common.noJob}</p><p className="mt-2 flex min-w-0 items-start gap-1.5 text-xs text-[#8B95A1]"><MapPin className="mt-0.5 size-3.5 shrink-0" /><span className="min-w-0 break-words">{localizedList(REGION_OPTIONS, talent.preferredRegions, locale) || copy.common.noRegion} · {copy.common.experience(talent.workExperienceCount)}</span></p></div><button onClick={() => void remove(talent.resumeId)} disabled={workingId === talent.resumeId} aria-label={copy.common.removeBookmark} title={copy.common.removeBookmark} className="grid size-9 shrink-0 place-items-center rounded-lg text-[#E5484D] hover:bg-[#FFF5F5]"><BookmarkX className="size-4" /></button></div><button onClick={() => void requestView(talent.resumeId)} disabled={workingId === talent.resumeId} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#B7D2FF] px-3 py-2 text-center text-sm font-semibold leading-5 text-[#0066FF] whitespace-normal disabled:opacity-50">{workingId === talent.resumeId ? <Loader2 className="size-4 shrink-0 animate-spin" /> : <Eye className="size-4 shrink-0" />}{copy.common.checkBeforeView}</button></article>)}</div>}
    {!loading && !error && pagination.totalPages > 1 && <nav aria-label={copy.common.page(page, pagination.totalPages)} className="mt-6 flex items-center justify-center gap-3"><button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} aria-label={copy.common.previousPage} className="grid size-9 place-items-center rounded-lg border border-[#DDE2E8] bg-white disabled:opacity-30"><ChevronLeft className="size-4" /></button><span className="text-sm">{copy.common.page(page, pagination.totalPages)}</span><button onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))} disabled={page >= pagination.totalPages} aria-label={copy.common.nextPage} className="grid size-9 place-items-center rounded-lg border border-[#DDE2E8] bg-white disabled:opacity-30"><ChevronRight className="size-4" /></button></nav>}
    {confirmId != null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"><div className="w-full max-w-sm rounded-lg bg-white p-5"><h2 className="break-words text-lg font-bold">{copy.bookmarks.confirmTitle}</h2><p className="mt-2 break-words text-sm leading-6 text-[#6B7684]">{copy.bookmarks.confirmBody}</p><div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2"><button onClick={() => setConfirmId(null)} className="min-h-10 rounded-lg border border-[#DDE2E8] px-3 py-2 text-center text-sm font-semibold leading-5 whitespace-normal">{copy.common.cancel}</button><button onClick={() => void openDetail(confirmId)} className="min-h-10 rounded-lg bg-[#0066FF] px-3 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{copy.common.view}</button></div></div></div>}
    {detail && <TalentDetailModal detail={detail} onClose={() => setDetail(null)} />}
  </div></main></CompanyAuthGuard>;
}
