import { FileText, HelpCircle, Route } from 'lucide-react';
import type { VisaJourneyCopy } from '../copy';
import type { EvidenceItem, GapAction, ItemProgressStatus } from '../types';
import {
  CitationLinks, EmptyStage, formatJourneyDate, ItemFacts, ProgressSelect,
} from './ui-utils';

type UpdateProps = {
  copy: VisaJourneyCopy;
  locale: string;
  savingId: string | null;
  onUpdate: (id: string, status: ItemProgressStatus) => void;
};

export function RoadmapStage({ items, copy, locale, savingId, onUpdate }: UpdateProps & { items: GapAction[] }) {
  if (!items.length) return <EmptyStage copy={copy} />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-[#E5E8EB] bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1"><h3 className="text-base font-bold text-[#191F28]">{item.title}</h3>{item.description && <p className="mt-1 text-sm leading-6 text-[#6B7684]">{item.description}</p>}</div>
            <ProgressSelect value={item.status} copy={copy} disabled={savingId === item.id} onChange={(status) => onUpdate(item.id, status)} />
          </div>
          {item.recommendedAction && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-900"><Route className="mr-1.5 inline size-4" />{item.recommendedAction}</div>}
          <ItemFacts facts={[
            [copy.owner, item.owner], [copy.currentValue, item.currentState], [copy.targetValue, item.targetState],
            [copy.due, formatJourneyDate(item.dueAt, locale)], [copy.expected, formatJourneyDate(item.expectedCompletionAt, locale)],
          ]} />
          <CitationLinks citations={item.citations} copy={copy} />
        </article>
      ))}
    </div>
  );
}

export function EvidenceStage({ items, copy, locale, savingId, onUpdate }: UpdateProps & { items: EvidenceItem[] }) {
  if (!items.length) return <EmptyStage copy={copy} />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-[#E5E8EB] bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><FileText className="size-4 text-[#0066FF]" /><h3 className="text-base font-bold text-[#191F28]">{item.title}</h3></div>
              {item.description && <p className="mt-1 text-sm leading-6 text-[#6B7684]">{item.description}</p>}
            </div>
            <ProgressSelect value={item.status} copy={copy} disabled={savingId === item.id} onChange={(status) => onUpdate(item.id, status)} />
          </div>
          {item.requiresExpertReview && <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-800"><HelpCircle className="size-3.5" />{copy.requirementStatuses.EXPERT_REVIEW_REQUIRED}</p>}
          <ItemFacts facts={[
            [copy.owner, item.owner], [copy.issuer, item.issuer], [copy.format, item.format],
            [copy.due, formatJourneyDate(item.dueAt, locale)], [copy.validUntil, formatJourneyDate(item.validUntil, locale)],
          ]} />
          <CitationLinks citations={item.citations} copy={copy} />
        </article>
      ))}
    </div>
  );
}
