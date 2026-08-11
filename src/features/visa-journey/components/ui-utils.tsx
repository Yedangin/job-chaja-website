import {
  AlertCircle, BookOpenCheck, CalendarClock, ChevronDown, Circle,
  ClipboardCheck, ExternalLink, FileCheck2, RefreshCw, Route, Scale,
  ShieldCheck, UserRoundCheck,
} from 'lucide-react';
import type { VisaJourneyCopy } from '../copy';
import type {
  ItemProgressStatus, JourneyFreshness, PolicyCitation, VisaJourney,
} from '../types';

export const STAGE_ICONS = [ShieldCheck, Route, FileCheck2, ClipboardCheck, UserRoundCheck] as const;
const PROGRESS_OPTIONS: ItemProgressStatus[] = [
  'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'NOT_APPLICABLE',
];

export function formatJourneyDate(
  value: string | null | undefined,
  locale: string,
  includeTime = false,
) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, includeTime
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function safeExternalUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export function LegalNotice({ copy, message }: { copy: VisaJourneyCopy; message?: string | null }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Scale className="mt-0.5 size-5 shrink-0 text-[#0066FF]" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-bold text-[#191F28]">{copy.legalTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-[#4E5968]">{message || copy.legalBody}</p>
        </div>
      </div>
    </section>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading visa journey">
      <div className="h-36 animate-pulse rounded-3xl bg-gray-100" />
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}

export function ErrorState({ copy, onRetry }: { copy: VisaJourneyCopy; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center" role="alert">
      <AlertCircle className="mx-auto size-9 text-red-500" aria-hidden="true" />
      <p className="mt-3 text-sm font-semibold text-[#191F28]">{copy.loadError}</p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#191F28] px-4 py-2 text-sm font-semibold text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
      >
        <RefreshCw className="size-4" /> {copy.retry}
      </button>
    </div>
  );
}

function FreshnessBadge({ freshness, copy }: { freshness?: JourneyFreshness | null; copy: VisaJourneyCopy }) {
  const details: Record<JourneyFreshness, { label: string; tone: string }> = {
    CURRENT: { label: copy.current, tone: 'bg-green-50 text-green-700 border-green-200' },
    UPCOMING_CHANGE: { label: copy.upcoming, tone: 'bg-amber-50 text-amber-800 border-amber-200' },
    UNDER_REVIEW: { label: copy.reviewing, tone: 'bg-blue-50 text-blue-800 border-blue-200' },
    REVIEW_OVERDUE: { label: copy.overdue, tone: 'bg-amber-50 text-amber-800 border-amber-200' },
    SOURCE_UNAVAILABLE: { label: copy.unavailable, tone: 'bg-red-50 text-red-700 border-red-200' },
    UNKNOWN: { label: copy.unknown, tone: 'bg-gray-50 text-gray-700 border-gray-200' },
  };
  const value = details[freshness ?? 'UNKNOWN'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${value.tone}`}>
      <Circle className="size-2 fill-current" />{value.label}
    </span>
  );
}

export function PolicyPanel({ journey, copy, locale }: { journey: VisaJourney; copy: VisaJourneyCopy; locale: string }) {
  const policy = journey.policy;
  if (!policy) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <AlertCircle className="mr-2 inline size-4" />{copy.noPolicy}
      </div>
    );
  }
  const facts = [
    [copy.asOf, formatJourneyDate(policy.policyAsOf, locale)],
    [copy.effective, formatJourneyDate(policy.effectiveFrom, locale)],
    [copy.reviewed, formatJourneyDate(policy.reviewedAt, locale)],
    [copy.evaluated, formatJourneyDate(policy.evaluatedAt, locale, true)],
  ];
  return (
    <section className="rounded-2xl border border-[#E5E8EB] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-5 text-[#0066FF]" />
          <h2 className="text-sm font-bold text-[#191F28]">{copy.policyTitle}</h2>
        </div>
        <FreshnessBadge freshness={policy.freshness} copy={copy} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-[#8B95A1]">{label}</dt>
            <dd className="mt-1 text-sm font-semibold text-[#333D4B]">{value}</dd>
          </div>
        ))}
      </dl>
      {(policy.version || policy.upcomingChangeSummary) && (
        <div className="mt-4 border-t border-[#F2F4F6] pt-4 text-xs leading-5 text-[#6B7684]">
          {policy.version && <span>{copy.version}: {policy.version}</span>}
          {policy.upcomingChangeSummary && <p className="mt-1 text-amber-800">{policy.upcomingChangeSummary}</p>}
        </div>
      )}
    </section>
  );
}

export function CitationLinks({ citations, copy }: { citations?: PolicyCitation[]; copy: VisaJourneyCopy }) {
  if (!citations?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {citations.map((citation, index) => {
        const url = safeExternalUrl(citation.url);
        const label = citation.clause ? `${citation.title} · ${citation.clause}` : citation.title;
        const key = citation.id ?? `${citation.title}-${index}`;
        return url ? (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1 rounded-lg bg-blue-50 px-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
            <ExternalLink className="size-3" />{label}
          </a>
        ) : (
          <span key={key} className="inline-flex min-h-8 items-center rounded-lg bg-gray-50 px-2.5 text-xs font-medium text-gray-600">
            {copy.source}: {label}
          </span>
        );
      })}
    </div>
  );
}

export function EmptyStage({ copy }: { copy: VisaJourneyCopy }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D1D6DB] bg-[#F9FAFB] px-5 py-12 text-center">
      <BookOpenCheck className="mx-auto size-8 text-[#B0B8C1]" />
      <p className="mt-3 text-sm text-[#6B7684]">{copy.emptyStage}</p>
    </div>
  );
}

export function ProgressSelect({ value, copy, disabled, onChange }: { value: ItemProgressStatus; copy: VisaJourneyCopy; disabled?: boolean; onChange: (status: ItemProgressStatus) => void }) {
  return (
    <label className="relative inline-flex min-h-11 items-center">
      <span className="sr-only">Status</span>
      <select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value as ItemProgressStatus)} className="min-h-11 appearance-none rounded-xl border border-[#D1D6DB] bg-white py-2 pl-3 pr-9 text-sm font-semibold text-[#333D4B] outline-none focus:border-[#0066FF] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400">
        {PROGRESS_OPTIONS.map((status) => <option key={status} value={status}>{copy.progressStatuses[status]}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-[#8B95A1]" />
    </label>
  );
}

export function ItemFacts({ facts }: { facts: Array<[string, string | null | undefined]> }) {
  const visible = facts.filter(([, value]) => Boolean(value) && value !== '—');
  if (!visible.length) return null;
  return (
    <dl className="mt-4 grid gap-3 rounded-xl bg-[#F9FAFB] p-3 sm:grid-cols-2">
      {visible.map(([label, value]) => <div key={label}><dt className="text-xs text-[#8B95A1]">{label}</dt><dd className="mt-1 text-sm font-semibold text-[#333D4B]">{value}</dd></div>)}
    </dl>
  );
}
