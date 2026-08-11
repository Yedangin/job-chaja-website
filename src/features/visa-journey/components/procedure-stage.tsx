import { Check, ExternalLink, LockKeyhole } from 'lucide-react';
import type { VisaJourneyCopy } from '../copy';
import type { ItemProgressStatus, ProcedureStep } from '../types';
import {
  CitationLinks, EmptyStage, formatJourneyDate, ItemFacts, ProgressSelect, safeExternalUrl,
} from './ui-utils';

export function ProcedureStage({ items, copy, locale, savingId, onUpdate }: {
  items: ProcedureStep[];
  copy: VisaJourneyCopy;
  locale: string;
  savingId: string | null;
  onUpdate: (id: string, status: ItemProgressStatus) => void;
}) {
  if (!items.length) return <EmptyStage copy={copy} />;
  const completed = new Set(items.filter((item) => item.status === 'COMPLETED').map((item) => item.id));
  return (
    <ol className="space-y-3">
      {[...items].sort((a, b) => a.order - b.order).map((item, index) => {
        const dependencyBlocked = item.dependencyIds?.some((id) => !completed.has(id)) ?? false;
        const officialUrl = safeExternalUrl(item.officialUrl);
        return (
          <li key={item.id} className={`rounded-2xl border bg-white p-4 sm:p-5 ${dependencyBlocked ? 'border-gray-200 opacity-70' : 'border-[#E5E8EB]'}`}>
            <div className="flex items-start gap-3">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-[#0066FF]'}`}>
                {item.status === 'COMPLETED' ? <Check className="size-4" /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="text-base font-bold text-[#191F28]">{item.title}</h3>{item.description && <p className="mt-1 text-sm leading-6 text-[#6B7684]">{item.description}</p>}</div>
                  <ProgressSelect value={item.status} copy={copy} disabled={dependencyBlocked || savingId === item.id} onChange={(status) => onUpdate(item.id, status)} />
                </div>
                {dependencyBlocked && <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-800"><LockKeyhole className="size-3.5" />{copy.blockedDependency}</p>}
                <ItemFacts facts={[[copy.owner, item.owner], [copy.channel, item.channel], [copy.due, formatJourneyDate(item.dueAt, locale)]]} />
                {officialUrl && <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100"><ExternalLink className="size-3.5" />{copy.officialSite}</a>}
                <CitationLinks citations={item.citations} copy={copy} />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
