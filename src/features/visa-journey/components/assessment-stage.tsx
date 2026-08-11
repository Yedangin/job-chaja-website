'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Info, Loader2, SlidersHorizontal } from 'lucide-react';
import { visaJourneyApi } from '../api';
import type { VisaJourneyCopy } from '../copy';
import type {
  RequirementEvaluation, RequirementStatus, VisaAssessmentInput,
} from '../types';
import { CitationLinks, EmptyStage, ItemFacts } from './ui-utils';

const requirementTone: Record<RequirementStatus, string> = {
  SATISFIED: 'border-green-200 bg-green-50 text-green-800',
  IMPROVABLE: 'border-amber-200 bg-amber-50 text-amber-800',
  TIME_DEPENDENT: 'border-amber-200 bg-amber-50 text-amber-800',
  COMPANY_ACTION_REQUIRED: 'border-amber-200 bg-amber-50 text-amber-800',
  NOT_REMEDIABLE: 'border-red-200 bg-red-50 text-red-700',
  INSUFFICIENT_DATA: 'border-gray-200 bg-gray-50 text-gray-700',
  EXPERT_REVIEW_REQUIRED: 'border-blue-200 bg-blue-50 text-blue-800',
};

const FIELD_KEYS = [
  'ksicCode', 'companySizeType', 'employeeCountKorean', 'employeeCountForeign',
  'annualRevenue', 'addressRoad', 'jobType', 'offeredSalary', 'nationality', 'age',
  'educationLevel', 'koreanLevel', 'workExperienceYears', 'currentVisaCode',
  'targetOccupationCode',
] as const;

type FieldKey = (typeof FIELD_KEYS)[number];
type AssessmentForm = Record<FieldKey, string>;

const NUMBER_FIELDS = new Set<FieldKey>([
  'employeeCountKorean', 'employeeCountForeign', 'annualRevenue', 'offeredSalary',
  'age', 'workExperienceYears',
]);

function initialForm(currentVisaCode?: string | null, initialValues?: VisaAssessmentInput): AssessmentForm {
  return Object.fromEntries(FIELD_KEYS.map((key) => {
    const value = initialValues?.[key] ?? (key === 'currentVisaCode' ? currentVisaCode : '');
    return [key, value === undefined || value === null ? '' : String(value)];
  })) as AssessmentForm;
}

export function AssessmentStage({
  items, missingInputs, currentVisaCode, initialValues, copy, busy, onAssess,
}: {
  items: RequirementEvaluation[];
  missingInputs: string[];
  currentVisaCode?: string | null;
  initialValues?: VisaAssessmentInput;
  copy: VisaJourneyCopy;
  busy: boolean;
  onAssess: (input: VisaAssessmentInput) => Promise<void>;
}) {
  const [form, setForm] = useState<AssessmentForm>(() => initialForm(currentVisaCode, initialValues));

  useEffect(() => {
    let active = true;
    visaJourneyApi.getAssessmentProfilePrefill().then((profile) => {
      if (!active) return;
      setForm((current) => {
        const next = { ...current };
        for (const key of FIELD_KEYS) {
          const value = profile[key as keyof typeof profile];
          if (!next[key] && value !== undefined) next[key] = String(value);
        }
        return next;
      });
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const input: VisaAssessmentInput = {};
    for (const key of FIELD_KEYS) {
      const value = form[key].trim();
      if (!value) continue;
      if (NUMBER_FIELDS.has(key)) {
        const numeric = Number(value);
        if (!Number.isNaN(numeric)) Object.assign(input, { [key]: numeric });
      } else {
        Object.assign(input, { [key]: value });
      }
    }
    void onAssess(input);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="rounded-2xl border border-[#E5E8EB] bg-white p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066FF]"><SlidersHorizontal className="size-4" /></span>
          <div><h3 className="text-base font-bold text-[#191F28]">{copy.inputTitle}</h3><p className="mt-1 text-sm leading-6 text-[#6B7684]">{copy.inputBody}</p></div>
        </div>
        {missingInputs.length > 0 && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3">
            <p className="text-xs font-bold text-amber-900">{copy.inputMissing}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{missingInputs.map((key) => <span key={key} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-amber-800">{copy.fields[key as keyof typeof copy.fields] ?? key}</span>)}</div>
          </div>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {FIELD_KEYS.map((key) => (
            <label key={key} className="block text-sm font-semibold text-[#333D4B]">
              {copy.fields[key]}
              <input
                type={NUMBER_FIELDS.has(key) ? 'number' : 'text'}
                min={NUMBER_FIELDS.has(key) ? 0 : undefined}
                value={form[key]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[#D1D6DB] bg-white px-3 text-base font-normal outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100"
              />
            </label>
          ))}
        </div>
        <button disabled={busy} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white hover:bg-[#0052CC] disabled:bg-[#B0B8C1]">
          {busy && <Loader2 className="size-4 animate-spin" />}{busy ? copy.assessing : copy.saveAssessment}
        </button>
      </form>
      <RequirementList items={items} copy={copy} />
    </div>
  );
}

function RequirementList({ items, copy }: { items: RequirementEvaluation[]; copy: VisaJourneyCopy }) {
  if (!items.length) return <EmptyStage copy={copy} />;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-2xl border border-[#E5E8EB] bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1"><h3 className="text-base font-bold text-[#191F28]">{item.title}</h3>{item.description && <p className="mt-1 text-sm leading-6 text-[#6B7684]">{item.description}</p>}</div>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${requirementTone[item.status]}`}>{copy.requirementStatuses[item.status]}</span>
          </div>
          {(item.currentValue || item.requiredValue) && <ItemFacts facts={[[copy.currentValue, item.currentValue], [copy.targetValue, item.requiredValue]]} />}
          {item.reason && <p className="mt-3 text-sm leading-6 text-[#4E5968]"><Info className="mr-1.5 inline size-4 text-[#8B95A1]" />{item.reason}</p>}
          <CitationLinks citations={item.citations} copy={copy} />
        </article>
      ))}
    </div>
  );
}
