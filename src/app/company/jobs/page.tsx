'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BriefcaseBusiness, FilePenLine, Loader2, Plus, RefreshCw, Send } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { companyJobsCopy, getCompanyJobsLocale, type CompanyJobsCopy } from '@/features/jobs/company-jobs-copy';

type Status = 'DRAFT' | 'SUBMITTED_REVIEW' | 'REJECTED' | 'ACTIVE' | 'CLOSED' | 'EXPIRED' | 'SUSPENDED';

type Job = {
  id: string;
  title: string;
  status: Status;
  boardType: 'PART_TIME' | 'FULL_TIME';
  rejectionReason?: string | null;
  createdAt: string;
  applyCount?: number;
};

const statusClass: Record<Status, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED_REVIEW: 'bg-amber-50 text-amber-800',
  REJECTED: 'bg-rose-50 text-rose-700',
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  CLOSED: 'bg-slate-100 text-slate-600',
  EXPIRED: 'bg-slate-100 text-slate-600',
  SUSPENDED: 'bg-rose-50 text-rose-700',
};

function responseMessage(status: number, copy: CompanyJobsCopy) {
  if (status === 401) return copy.login;
  if (status === 403) return copy.forbidden;
  if (status === 409) return copy.conflict;
  return copy.server;
}

function formatMeta(job: Job, copy: CompanyJobsCopy) {
  const createdAt = new Intl.DateTimeFormat(copy.dateLocale, { dateStyle: 'medium' }).format(
    new Date(job.createdAt),
  );
  if (job.applyCount === undefined) return createdAt;
  return `${createdAt} · ${copy.applications.replace('{count}', String(job.applyCount))}`;
}

export default function CompanyJobsPage() {
  const { lang } = useLanguage();
  const locale = getCompanyJobsLocale(lang);
  const copy = companyJobsCopy[locale];
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<'ALL' | Status>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/jobs/my/list?page=1&limit=100', { credentials: 'include' });
      if (!response.ok) throw new Error(responseMessage(response.status, copy));
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : data.items || []);
    } catch (cause) {
      setJobs([]);
      setError(cause instanceof Error && cause.message !== 'Failed to fetch' ? cause.message : copy.server);
    } finally {
      setLoading(false);
    }
  }, [copy]);

  useEffect(() => {
    const requestId = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(requestId);
  }, [load]);

  const visibleJobs = useMemo(
    () => filter === 'ALL' ? jobs : jobs.filter((job) => job.status === filter),
    [filter, jobs],
  );

  const submit = async (jobId: string) => {
    setSubmittingId(jobId);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/jobs/${jobId}/submit`, { method: 'POST', credentials: 'include' });
      if (!response.ok) throw new Error(responseMessage(response.status, copy));
      setNotice(copy.submitted);
      await load();
    } catch (cause) {
      setError(cause instanceof Error && cause.message !== 'Failed to fetch' ? cause.message : copy.server);
    } finally {
      setSubmittingId(null);
    }
  };

  const tabs: Array<{ id: 'ALL' | Status; label: string }> = [
    { id: 'ALL', label: copy.all }, { id: 'DRAFT', label: copy.draft },
    { id: 'SUBMITTED_REVIEW', label: copy.review }, { id: 'REJECTED', label: copy.rejected },
    { id: 'ACTIVE', label: copy.active }, { id: 'CLOSED', label: copy.closed },
  ];
  const statusLabel: Record<Status, string> = {
    DRAFT: copy.draft, SUBMITTED_REVIEW: copy.review, REJECTED: copy.rejected,
    ACTIVE: copy.active, CLOSED: copy.closed, EXPIRED: copy.expired, SUSPENDED: copy.suspended,
  };

  return <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-semibold text-[#191F28]">{copy.title}</h1>
      <Link href="/company/jobs/create" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0066FF] px-3 py-2 text-sm font-medium text-white hover:bg-[#0057DB] sm:w-auto"><Plus className="h-4 w-4" />{copy.create}</Link>
    </div>

    <div className="mb-5 flex gap-1 overflow-x-auto border-b border-slate-200" role="tablist">
      {tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={filter === tab.id} onClick={() => setFilter(tab.id)} className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm ${filter === tab.id ? 'border-[#0066FF] text-[#0066FF]' : 'border-transparent text-slate-600'}`}>{tab.label}</button>)}
    </div>

    {error && <div role="alert" className="mb-4 flex flex-col gap-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"><span className="flex min-w-0 items-start gap-2 break-words"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{error}</span><button type="button" onClick={() => void load()} className="inline-flex shrink-0 items-center gap-1 self-start font-medium sm:self-auto"><RefreshCw className="h-4 w-4" />{copy.retry}</button></div>}
    {notice && <p role="status" className="mb-4 break-words rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{notice}</p>}

    {loading ? <div className="flex min-h-56 items-center justify-center text-slate-600"><Loader2 className="mr-2 h-5 w-5 animate-spin" />{copy.loading}</div> : visibleJobs.length === 0 ? <div className="flex min-h-56 flex-col items-center justify-center rounded-md border border-dashed border-slate-300 px-5 text-center"><BriefcaseBusiness className="mb-3 h-8 w-8 text-slate-400" /><p className="max-w-md break-words text-sm text-slate-600">{copy.empty}</p></div> : <div className="space-y-3">
      {visibleJobs.map((job) => <article key={job.id} className="rounded-md border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2"><span className={`break-words rounded px-2 py-0.5 text-xs font-medium ${statusClass[job.status]}`}>{statusLabel[job.status]}</span><span className="text-xs text-slate-500">{job.boardType === 'PART_TIME' ? copy.partTime : copy.fullTime}</span></div>
            <h2 className="break-words font-medium text-[#191F28] sm:truncate">{job.title}</h2>
            <p className="mt-1 break-words text-xs text-slate-500">{formatMeta(job, copy)}</p>
            {job.status === 'REJECTED' && job.rejectionReason && <p className="mt-3 break-words rounded-md bg-rose-50 p-2 text-sm text-rose-800"><span className="font-medium">{copy.rejection}: </span>{job.rejectionReason}</p>}
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2"><Link href={`/company/jobs/${job.id}`} className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"><FilePenLine className="h-4 w-4" />{copy.edit}</Link>{(job.status === 'DRAFT' || job.status === 'REJECTED') && <button type="button" disabled={submittingId === job.id} onClick={() => void submit(job.id)} className="inline-flex items-center justify-center gap-1 rounded-md bg-[#0066FF] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"><Send className="h-4 w-4" />{submittingId === job.id ? copy.submitting : job.status === 'REJECTED' ? copy.resubmit : copy.submit}</button>}</div>
        </div>
      </article>)}
    </div>}
  </main>;
}
