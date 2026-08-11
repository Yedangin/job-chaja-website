'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserRoundCheck } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { normalizeLocale, toIntlLocale } from '@/i18n/locales';
import { visaJourneyApi } from './api';
import { VISA_JOURNEY_COPY, type VisaJourneyCopy } from './copy';
import type {
  CreateVisaJourneyInput, ExpertServiceType, ItemProgressStatus,
  JourneyStage, VisaAssessmentInput, VisaJourney,
} from './types';
import { AssessmentStage } from './components/assessment-stage';
import { ExpertStage } from './components/expert-stage';
import { EvidenceStage, RoadmapStage } from './components/preparation-stages';
import { ProcedureStage } from './components/procedure-stage';
import { StartJourney } from './components/start-journey';
import {
  ErrorState, LegalNotice, LoadingState, PolicyPanel, STAGE_ICONS,
} from './components/ui-utils';

export default function VisaJourneyPage() {
  const { lang } = useLanguage();
  const localeKey = normalizeLocale(lang);
  const copy: VisaJourneyCopy = localeKey === 'ko' ? VISA_JOURNEY_COPY.ko : VISA_JOURNEY_COPY.en;
  const locale = toIntlLocale(localeKey);
  const [journey, setJourney] = useState<VisaJourney | null>(null);
  const [stage, setStage] = useState<JourneyStage>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [expertSuccess, setExpertSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await visaJourneyApi.getMine();
      setJourney(next);
      if (next?.currentStage) setStage(next.currentStage);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [copy.loadError]);

  useEffect(() => {
    let active = true;
    visaJourneyApi.getMine().then((next) => {
      if (!active) return;
      setJourney(next);
      if (next?.currentStage) setStage(next.currentStage);
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : 'LOAD_ERROR');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const stageCounts = useMemo(() => [
    journey?.requirements.length ?? 0,
    journey?.gapActions.length ?? 0,
    journey?.evidenceItems.length ?? 0,
    journey?.procedureSteps.length ?? 0,
    journey?.expertCases.length ?? 0,
  ], [journey]);
  const headings = [copy.requirementSummary, copy.roadmapSummary, copy.evidenceSummary, copy.procedureSummary, copy.expertSummary];

  const createJourney = async (input: CreateVisaJourneyInput) => {
    setBusy(true); setError(null);
    try { setJourney(await visaJourneyApi.create(input)); setStage(1); }
    catch (reason) { setError(reason instanceof Error ? reason.message : copy.loadError); }
    finally { setBusy(false); }
  };

  const assess = async (input: VisaAssessmentInput) => {
    if (!journey) return;
    setBusy(true); setError(null);
    try { setJourney(await visaJourneyApi.assess(journey.id, input)); setStage(1); }
    catch (reason) { setError(reason instanceof Error ? reason.message : copy.loadError); }
    finally { setBusy(false); }
  };

  const updateItem = async (itemId: string, status: ItemProgressStatus) => {
    if (!journey) return;
    setSavingId(itemId); setError(null);
    try { await visaJourneyApi.updateItem(journey.id, itemId, status); setJourney(await visaJourneyApi.getById(journey.id)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : copy.loadError); }
    finally { setSavingId(null); }
  };

  const createExpertCase = async (serviceType: ExpertServiceType, question: string) => {
    if (!journey) return;
    setBusy(true); setError(null); setExpertSuccess(false);
    try {
      await visaJourneyApi.createExpertCase(journey.id, { serviceType, question: question || undefined, consentToShare: true });
      setJourney(await visaJourneyApi.getById(journey.id));
      setExpertSuccess(true);
    } catch (reason) { setError(reason instanceof Error ? reason.message : copy.loadError); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-full bg-[#F9FAFB]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        <JourneyHeader copy={copy} />
        {error && !loading && journey && <InlineError message={error} onClose={() => setError(null)} />}
        {loading ? <LoadingState /> : error && !journey ? <ErrorState copy={copy} onRetry={() => void load()} /> : !journey ? (
          <StartJourney copy={copy} locale={localeKey} busy={busy} onSubmit={createJourney} />
        ) : (
          <>
            <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto]">
              <PolicyPanel journey={journey} copy={copy} locale={locale} />
              <div className="flex items-stretch lg:flex-col lg:justify-center">
                <button onClick={() => setStage(5)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-4 text-sm font-bold text-white hover:bg-[#0052CC]"><UserRoundCheck className="size-4" />{copy.expert}</button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
              <StageNavigation copy={copy} stage={stage} counts={stageCounts} onSelect={setStage} />
              <main className="min-w-0">
                <div className="mb-4"><p className="text-xs font-bold text-[#0066FF]">STEP {stage}</p><h2 className="mt-1 text-xl font-bold text-[#191F28]">{headings[stage - 1]}</h2><p className="mt-1 text-sm leading-6 text-[#6B7684]">{copy.stageDescriptions[stage - 1]}</p></div>
                {stage === 1 && <AssessmentStage items={journey.requirements} missingInputs={journey.missingInputs ?? []} currentVisaCode={journey.currentVisaCode} initialValues={journey.assessmentInputs} copy={copy} busy={busy} onAssess={assess} />}
                {stage === 2 && <RoadmapStage items={journey.gapActions} copy={copy} locale={locale} savingId={savingId} onUpdate={updateItem} />}
                {stage === 3 && <EvidenceStage items={journey.evidenceItems} copy={copy} locale={locale} savingId={savingId} onUpdate={updateItem} />}
                {stage === 4 && <ProcedureStage items={journey.procedureSteps} copy={copy} locale={locale} savingId={savingId} onUpdate={updateItem} />}
                {stage === 5 && <ExpertStage journey={journey} copy={copy} busy={busy} success={expertSuccess} onSubmit={createExpertCase} />}
              </main>
            </div>
            <div className="mt-6"><LegalNotice copy={copy} message={localeKey === 'ko' ? journey.legalNotice?.ko : journey.legalNotice?.en} /></div>
          </>
        )}
      </div>
    </div>
  );
}

function JourneyHeader({ copy }: { copy: VisaJourneyCopy }) {
  return <header className="mb-6 overflow-hidden rounded-3xl bg-[#191F28] px-5 py-7 text-white sm:px-8 sm:py-9"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">{copy.eyebrow}</p><h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{copy.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">{copy.intro}</p></div></header>;
}

function InlineError({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert"><span>{message}</span><button onClick={onClose} className="min-h-8 shrink-0 font-bold underline">OK</button></div>;
}

function StageNavigation({ copy, stage, counts, onSelect }: { copy: VisaJourneyCopy; stage: JourneyStage; counts: number[]; onSelect: (stage: JourneyStage) => void }) {
  return <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:px-0" aria-label="Visa journey stages">{copy.stages.map((label, index) => { const value = (index + 1) as JourneyStage; const Icon = STAGE_ICONS[index]; const active = stage === value; return <button key={label} onClick={() => onSelect(value)} aria-current={active ? 'step' : undefined} className={`flex min-h-14 min-w-[190px] items-center gap-3 rounded-2xl border px-4 text-left transition lg:w-full lg:min-w-0 ${active ? 'border-[#0066FF] bg-blue-50 text-blue-800 shadow-sm' : 'border-[#E5E8EB] bg-white text-[#4E5968] hover:border-blue-200'}`}><span className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-[#0066FF] text-white' : 'bg-[#F2F4F6] text-[#6B7684]'}`}><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-[11px] font-bold uppercase tracking-wide opacity-60">STEP {value}</span><span className="block text-sm font-bold leading-5">{label}</span></span><span className="text-xs font-bold opacity-60">{counts[index]}</span></button>; })}</nav>;
}
