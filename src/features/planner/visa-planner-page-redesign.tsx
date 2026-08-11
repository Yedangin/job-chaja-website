'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ClipboardCheck,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Target,
  UserRound,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import {
  countries,
  educationOptions,
  fundOptions,
  goalOptions,
  localizedOptionLabel,
  majorCategories,
  priorityOptions,
} from '@/lib/planner-data';
import { plannerUiCopy } from '@/lib/planner-content';
import {
  clearPlannerDraft,
  readPlannerDraft,
  runPlannerDiagnosis,
  savePlannerDraft,
  savePlannerInput,
  savePlannerResult,
} from '@/lib/planner-api';
import { normalizePlannerLang, type PlannerInput } from '@/lib/planner-types';
import { PlannerHeader } from './planner-shell';

const stepIcons = [UserRound, GraduationCap, Target, BriefcaseBusiness, ClipboardCheck];

const initialInput: PlannerInput = {
  nationality: '',
  residenceCountry: '',
  age: 0,
  educationLevel: '',
  availableAnnualFund: 0,
  finalGoal: '',
  priorityPreference: '',
  language: 'en',
  topikLevel: 0,
  kiipStage: 0,
  workExperienceYears: 0,
  major: '',
  majorCategory: '',
  targetOccupation: '',
  isEthnicKorean: false,
  currentVisa: '',
  koreaStayMonths: 0,
  hasDegreeDocument: false,
};

function FieldLabel({ children, optional }: { children: ReactNode; optional?: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="text-sm font-semibold text-[#333D4B]">{children}</span>
      {optional ? <span className="text-xs text-[#8B95A1]">{optional}</span> : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  children,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  children: ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#191F28] outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  placeholder,
  optional,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  optional?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#191F28] outline-none transition placeholder:text-[#B0B8C1] focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
        active
          ? 'border-sky-500 bg-sky-50 text-sky-700 ring-1 ring-sky-500'
          : 'border-slate-200 bg-white text-[#4E5968] hover:border-slate-300 hover:bg-[#F9FAFB]'
      }`}
    >
      <span>{children}</span>
      {active ? <Check className="h-4 w-4 shrink-0" /> : null}
    </button>
  );
}

function ToggleRow({
  checked,
  title,
  body,
  yes,
  no,
  onChange,
}: {
  checked: boolean;
  title: string;
  body: string;
  yes: string;
  no: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-[#F2F4F6] pt-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-xl">
        <p className="text-sm font-semibold text-[#333D4B]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#6B7684]">{body}</p>
      </div>
      <div className="inline-flex shrink-0 rounded-xl bg-[#F2F4F6] p-1">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`h-9 min-w-16 rounded-lg px-3 text-sm font-semibold transition ${!checked ? 'bg-white text-[#191F28] shadow-sm' : 'text-[#8B95A1]'}`}
        >
          {no}
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`h-9 min-w-16 rounded-lg px-3 text-sm font-semibold transition ${checked ? 'bg-[#0066FF] text-white shadow-sm' : 'text-[#8B95A1]'}`}
        >
          {yes}
        </button>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  values,
  editLabel,
  onEdit,
}: {
  title: string;
  values: string[];
  editLabel: string;
  onEdit: () => void;
}) {
  return (
    <section className="border-b border-[#F2F4F6] py-5 first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-[#191F28]">{title}</h3>
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-[#0066FF] hover:text-[#0052CC]">
          {editLabel}
        </button>
      </div>
      <p className="mt-2 break-words text-sm leading-6 text-[#6B7684]">{values.filter(Boolean).join(' · ')}</p>
    </section>
  );
}

export default function VisaPlannerPageRedesign() {
  const router = useRouter();
  const { lang } = useLanguage();
  const uiLang = normalizePlannerLang(lang);
  const copy = plannerUiCopy[uiLang];
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState<PlannerInput>({ ...initialInput, language: uiLang });
  const [draftRestored, setDraftRestored] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateInput = <K extends keyof PlannerInput>(key: K, value: PlannerInput[K]) => {
    setInput((current) => ({ ...current, [key]: value, language: uiLang }));
  };

  useEffect(() => {
    const draft = readPlannerDraft();
    if (draft) {
      setStepIndex(draft.stepIndex);
      setInput({ ...initialInput, ...draft.input, language: uiLang });
    }
    setDraftRestored(true);
  }, [uiLang]);

  useEffect(() => {
    if (!draftRestored) return;
    savePlannerDraft(stepIndex, { ...input, language: uiLang });
  }, [draftRestored, input, stepIndex, uiLang]);

  const canContinue = useMemo(() => {
    if (stepIndex === 0) return Boolean(input.nationality && input.residenceCountry && input.age >= 15 && input.age <= 70);
    if (stepIndex === 1) return Boolean(input.educationLevel);
    if (stepIndex === 2) return Boolean(input.availableAnnualFund && input.finalGoal && input.priorityPreference);
    return true;
  }, [input, stepIndex]);

  const countryLabel = (code?: string) => {
    const country = countries.find((item) => item.code === code);
    return country ? `${country.flag} ${localizedOptionLabel(country, uiLang)}` : copy.review.missing;
  };

  const optionLabel = (options: Array<{ value: string | number; en: string; ko: string; vi: string; th: string; fil: string }>, value?: string | number) => {
    const option = options.find((item) => String(item.value) === String(value));
    return option ? localizedOptionLabel(option, uiLang) : copy.review.missing;
  };

  const goNext = async () => {
    if (!canContinue || isSubmitting) return;
    if (stepIndex < copy.steps.length - 1) {
      setStepIndex((current) => current + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const request: PlannerInput = { ...input, language: uiLang };
      savePlannerInput(request);
      const result = await runPlannerDiagnosis(request);
      savePlannerResult(result);
      clearPlannerDraft();
      const sessionId = result.sessionId ?? result.meta.sessionId;
      router.push(sessionId ? `/diagnosis/result?sessionId=${sessionId}` : '/diagnosis/result');
    } catch {
      setError(copy.actions.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (stepIndex === 0) {
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label={copy.fields.nationality} value={input.nationality} placeholder={copy.fields.select} onChange={(value) => updateInput('nationality', value)}>
            {countries.map((country) => <option key={country.code} value={country.code}>{country.flag} {localizedOptionLabel(country, uiLang)}</option>)}
          </SelectField>
          <SelectField label={copy.fields.residence} value={input.residenceCountry || ''} placeholder={copy.fields.select} onChange={(value) => updateInput('residenceCountry', value)}>
            {countries.map((country) => <option key={country.code} value={country.code}>{country.flag} {localizedOptionLabel(country, uiLang)}</option>)}
          </SelectField>
          <label className="block sm:max-w-xs">
            <FieldLabel>{copy.fields.age}</FieldLabel>
            <input
              type="number"
              min={15}
              max={70}
              value={input.age || ''}
              placeholder="25"
              onChange={(event) => updateInput('age', Number(event.target.value))}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#191F28] outline-none transition placeholder:text-[#B0B8C1] focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <div className="sm:col-span-2">
            <ToggleRow checked={Boolean(input.isEthnicKorean)} title={copy.fields.ethnicKorean} body={copy.fields.ethnicKoreanHelp} yes={copy.fields.yes} no={copy.fields.no} onChange={(value) => updateInput('isEthnicKorean', value)} />
          </div>
        </div>
      );
    }

    if (stepIndex === 1) {
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label={copy.fields.education} value={input.educationLevel} placeholder={copy.fields.select} onChange={(value) => updateInput('educationLevel', value)}>
            {educationOptions.map((option) => <option key={option.value} value={option.value}>{localizedOptionLabel(option, uiLang)}</option>)}
          </SelectField>
          <SelectField label={copy.fields.field} value={input.majorCategory || ''} placeholder={copy.fields.select} onChange={(value) => updateInput('majorCategory', value)}>
            {majorCategories.map((option) => <option key={option.value} value={option.value}>{localizedOptionLabel(option, uiLang)}</option>)}
          </SelectField>
          <div className="sm:col-span-2">
            <TextField label={copy.fields.major} value={input.major || ''} placeholder={copy.fields.majorPlaceholder} optional={copy.fields.optional} onChange={(value) => updateInput('major', value)} />
          </div>
          <div className="sm:col-span-2">
            <ToggleRow checked={Boolean(input.hasDegreeDocument)} title={copy.fields.degreeDocument} body={copy.fields.degreeDocumentHelp} yes={copy.fields.yes} no={copy.fields.no} onChange={(value) => updateInput('hasDegreeDocument', value)} />
          </div>
        </div>
      );
    }

    if (stepIndex === 2) {
      return (
        <div className="space-y-7">
          <div>
            <FieldLabel>{copy.fields.goal}</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {goalOptions.map((option) => <ChoiceButton key={option.value} active={input.finalGoal === option.value} onClick={() => updateInput('finalGoal', option.value)}>{localizedOptionLabel(option, uiLang)}</ChoiceButton>)}
            </div>
          </div>
          <div>
            <FieldLabel>{copy.fields.priority}</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {priorityOptions.map((option) => <ChoiceButton key={option.value} active={input.priorityPreference === option.value} onClick={() => updateInput('priorityPreference', option.value)}>{localizedOptionLabel(option, uiLang)}</ChoiceButton>)}
            </div>
          </div>
          <div className="max-w-md">
            <SelectField label={copy.fields.budget} value={input.availableAnnualFund ? String(input.availableAnnualFund) : ''} placeholder={copy.fields.select} onChange={(value) => updateInput('availableAnnualFund', Number(value))}>
              {fundOptions.map((option) => <option key={option.value} value={String(option.value)}>{localizedOptionLabel(option, uiLang)}</option>)}
            </SelectField>
            <p className="mt-2 text-sm leading-6 text-[#6B7684]">{copy.fields.budgetHelp}</p>
          </div>
        </div>
      );
    }

    if (stepIndex === 3) {
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label={copy.fields.topik} value={String(input.topikLevel || 0)} placeholder={copy.fields.select} onChange={(value) => updateInput('topikLevel', Number(value))}>
            <option value="0">{copy.fields.none}</option>
            {[1, 2, 3, 4, 5, 6].map((level) => <option key={level} value={String(level)}>TOPIK {level}</option>)}
          </SelectField>
          <SelectField label={copy.fields.kiip} value={String(input.kiipStage || 0)} placeholder={copy.fields.select} onChange={(value) => updateInput('kiipStage', Number(value))}>
            <option value="0">{copy.fields.none}</option>
            {[1, 2, 3, 4, 5].map((stage) => <option key={stage} value={String(stage)}>KIIP {stage}</option>)}
          </SelectField>
          <label className="block">
            <FieldLabel>{copy.fields.experience}</FieldLabel>
            <input
              type="number"
              min={0}
              max={50}
              value={input.workExperienceYears || 0}
              onChange={(event) => updateInput('workExperienceYears', Number(event.target.value))}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#191F28] outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
          <TextField label={copy.fields.occupation} value={input.targetOccupation || ''} placeholder={copy.fields.occupationPlaceholder} optional={copy.fields.optional} onChange={(value) => updateInput('targetOccupation', value)} />
          <div className="sm:col-span-2 sm:max-w-md">
            <TextField label={copy.fields.currentVisa} value={input.currentVisa || ''} placeholder={copy.fields.currentVisaPlaceholder} optional={copy.fields.optional} onChange={(value) => updateInput('currentVisa', value.toUpperCase())} />
          </div>
        </div>
      );
    }

    return (
      <div>
        <ReviewSection title={copy.review.about} values={[countryLabel(input.nationality), countryLabel(input.residenceCountry), input.age ? String(input.age) : copy.review.missing]} editLabel={copy.review.edit} onEdit={() => setStepIndex(0)} />
        <ReviewSection title={copy.review.education} values={[optionLabel(educationOptions, input.educationLevel), optionLabel(majorCategories, input.majorCategory), input.major || copy.review.missing]} editLabel={copy.review.edit} onEdit={() => setStepIndex(1)} />
        <ReviewSection title={copy.review.goal} values={[optionLabel(goalOptions, input.finalGoal), optionLabel(priorityOptions, input.priorityPreference), optionLabel(fundOptions, input.availableAnnualFund)]} editLabel={copy.review.edit} onEdit={() => setStepIndex(2)} />
        <ReviewSection title={copy.review.experience} values={[input.topikLevel ? `TOPIK ${input.topikLevel}` : copy.fields.none, input.workExperienceYears ? `${input.workExperienceYears}` : copy.fields.none, input.targetOccupation || copy.review.missing]} editLabel={copy.review.edit} onEdit={() => setStepIndex(3)} />
      </div>
    );
  };

  const CurrentIcon = stepIcons[stepIndex];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F9FAFB] text-[#191F28]">
      <PlannerHeader copy={copy} />

      <section className="border-b border-[#E5E8EB] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
          <p className="text-sm font-bold text-[#0066FF]">{copy.intro.eyebrow}</p>
          <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight text-[#191F28] sm:text-3xl">{copy.intro.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6B7684] sm:text-base">{copy.intro.body}</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-[#4E5968] sm:flex-row sm:items-center sm:gap-5">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#0066FF]" />{copy.intro.noAccount}</span>
            <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[#8B95A1]" />{copy.intro.privateAnswers}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <nav aria-label="Progress" className="mb-5">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#4E5968]">{copy.steps[stepIndex]}</span>
            <span className="font-bold text-[#0066FF]">{stepIndex + 1} / {copy.steps.length}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E8EB]">
            <div className="h-full rounded-full bg-[#0066FF] transition-all" style={{ width: `${((stepIndex + 1) / copy.steps.length) * 100}%` }} />
          </div>
          <ol className="mt-3 hidden grid-cols-5 gap-2 md:grid">
            {copy.steps.map((step, index) => {
              const Icon = stepIcons[index];
              const active = index === stepIndex;
              const complete = index < stepIndex;
              return (
                <li key={step} className={`flex items-center gap-2 text-xs font-semibold ${active ? 'text-[#0066FF]' : complete ? 'text-[#4E5968]' : 'text-[#B0B8C1]'}`}>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${active ? 'bg-[#0066FF] text-white' : complete ? 'bg-sky-50 text-[#0066FF]' : 'bg-[#F2F4F6] text-[#B0B8C1]'}`}>
                    {complete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span className="truncate">{step}</span>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="border-b border-[#F2F4F6] px-5 py-5 sm:px-8 sm:py-6">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-[#0066FF]">
                  <CurrentIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold leading-tight text-[#191F28] sm:text-2xl">{copy.stepTitles[stepIndex]}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6B7684]">{copy.stepBodies[stepIndex]}</p>
                </div>
              </div>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8">{renderStep()}</div>

            <div className="flex items-center justify-between gap-3 border-t border-[#F2F4F6] bg-[#FCFCFD] px-5 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                disabled={stepIndex === 0 || isSubmitting}
                className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#4E5968] transition hover:bg-[#F2F4F6] disabled:invisible"
              >
                <ArrowLeft className="h-4 w-4" />{copy.actions.back}
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!canContinue || isSubmitting}
                className="inline-flex h-11 min-w-32 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white transition hover:bg-[#0052CC] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? copy.actions.submitting : stepIndex === copy.steps.length - 1 ? copy.actions.submit : copy.actions.next}
                {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </div>
          </section>

          <aside className="border-t border-[#D1D6DB] pt-5 lg:sticky lg:top-20 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-1">
            <h2 className="text-sm font-bold text-[#191F28]">{copy.receiveTitle}</h2>
            <ul className="mt-4 space-y-4">
              {copy.receiveItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-[#4E5968]">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-sky-50 text-[#0066FF]"><Check className="h-3.5 w-3.5" /></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {error ? <p role="alert" className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-700">{error}</p> : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
