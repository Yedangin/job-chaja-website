'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Eye, Loader2, RefreshCw } from 'lucide-react';
import CompanyAuthGuard from '@/components/guards/company-auth-guard';
import { useLanguage } from '@/i18n/LanguageProvider';
import { normalizeLocale } from '@/i18n/locales';
import {
  formatTalentDate,
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

export default function CompanyTalentViewed() {
  const { lang } = useLanguage();
  const locale = normalizeLocale(lang);
  const copy = TALENT_COPY[locale];
  const [talents, setTalents] = useState<TalentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [detail, setDetail] = useState<ResumeDetail | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const data = await talentRequest<Response>('/api/resumes/viewed?page=1'); setTalents(data.talents); }
    catch (caught) { setError(caught); }
    finally { setLoading(false); }
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const open = async (resumeId: number) => {
    setWorkingId(resumeId); setError(null);
    try {
      const access = await talentRequest<AccessCheck>(`/api/resumes/${resumeId}/check-access`);
      if (!access.alreadyViewed) throw new TalentApiError(409, copy.viewed.historyConflict);
      setDetail(await talentRequest<ResumeDetail>(`/api/resumes/${resumeId}/detail`));
    } catch (caught) {
      if (caught instanceof TalentApiError && caught.status === 404) setTalents((current) => current.filter((item) => item.resumeId !== resumeId));
      setError(caught);
    } finally { setWorkingId(null); }
  };

  return <CompanyAuthGuard requiredAccess="talent"><main className="min-h-screen bg-[#F9FAFB] px-4 py-7 text-[#191F28]"><div className="mx-auto max-w-4xl"><header className="mb-6"><h1 className="text-2xl font-bold">{copy.viewed.title}</h1><p className="mt-1 text-sm text-[#6B7684]">{copy.viewed.subtitle}</p></header>
    {loading ? <div className="flex min-h-80 items-center justify-center"><Loader2 className="size-7 animate-spin text-[#0066FF]" /></div> : error ? <div className="border-y border-[#FFD1D3] bg-[#FFF5F5] px-5 py-12 text-center"><AlertCircle className="mx-auto size-8 text-[#E5484D]" /><p className="mt-3 break-words font-bold">{talentErrorMessage(error, copy)}</p>{error instanceof TalentApiError && error.status === 401 ? <Link href="/auth/login" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0066FF] px-4 py-2 text-center text-sm font-semibold leading-5 text-white whitespace-normal">{copy.common.login}</Link> : <button onClick={() => void load()} className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#DDE2E8] bg-white px-4 py-2 text-center text-sm font-semibold leading-5 whitespace-normal"><RefreshCw className="size-4 shrink-0" />{copy.common.retry}</button>}</div> : talents.length === 0 ? <section className="border-y border-[#E5E8EB] bg-white px-5 py-14 text-center"><Eye className="mx-auto size-8 text-[#8B95A1]" /><h2 className="mt-3 break-words font-bold">{copy.viewed.emptyTitle}</h2><p className="mt-2 break-words text-sm text-[#6B7684]">{copy.viewed.emptyBody}</p></section> : <div className="divide-y divide-[#E5E8EB] border-y border-[#E5E8EB] bg-white">{talents.map((talent) => <article key={talent.resumeId} className="flex min-w-0 flex-col items-stretch gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="break-words font-semibold">{optionLabel(NATIONALITY_OPTIONS, talent.nationality, locale)} · TOPIK {talent.topikLevel ?? '-'}</p><p className="mt-1 break-words text-sm text-[#6B7684]">{localizedList(JOB_OPTIONS, talent.preferredJobTypes, locale) || copy.common.noJob} · {localizedList(REGION_OPTIONS, talent.preferredRegions, locale) || copy.common.noRegion}</p><p className="mt-1 text-xs text-[#8B95A1]">{talent.viewedAt ? copy.common.viewedOn(formatTalentDate(talent.viewedAt, locale)) : '-'}</p></div><button onClick={() => void open(talent.resumeId)} disabled={workingId === talent.resumeId} className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-[#B7D2FF] px-4 py-2 text-center text-sm font-semibold leading-5 text-[#0066FF] whitespace-normal disabled:opacity-50 sm:w-auto">{workingId === talent.resumeId ? <Loader2 className="size-4 shrink-0 animate-spin" /> : <Eye className="size-4 shrink-0" />}{copy.common.details}</button></article>)}</div>}
    {detail && <TalentDetailModal detail={detail} onClose={() => setDetail(null)} />}
  </div></main></CompanyAuthGuard>;
}
