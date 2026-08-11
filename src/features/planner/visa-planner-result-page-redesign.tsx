'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  FileText,
  LockKeyhole,
  RefreshCcw,
  ShieldAlert,
  WalletCards,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/i18n/LanguageProvider';
import { difficultyTone } from '@/lib/planner-data';
import { plannerUiCopy, type PlannerUiCopy } from '@/lib/planner-content';
import { claimPlannerSession, PlannerApiError } from '@/lib/planner-api';
import { normalizePlannerLang, type PlannerLang, type PlannerPathway } from '@/lib/planner-types';
import { PlannerHeader, PlannerLoading } from './planner-shell';
import {
  PathwayMetricGuide,
  PathwayReviewWarning,
  PlannerDecisionBoundary,
  PolicyEvidenceNotice,
  PreparationGuidanceList,
  RequirementAssessmentList,
  requirementSectionCopy,
} from './planner-result-explainer';
import { usePlannerResult, type PlannerResultLoadError } from './use-planner-result';

function formatMoney(value: number, lang: PlannerLang) {
  if (!value) return '-';
  const locale = lang === 'ko' ? 'ko-KR' : lang === 'vi' ? 'vi-VN' : lang === 'th' ? 'th-TH' : lang === 'fil' ? 'fil-PH' : 'en-US';
  if (lang === 'ko') return `${new Intl.NumberFormat(locale).format(value / 10_000)}만원`;
  return `KRW ${new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;
}

function resultErrorText(
  error: PlannerResultLoadError,
  copy: PlannerUiCopy,
) {
  if (error === 'not-found') return copy.status.notFound;
  if (error === 'forbidden') return copy.status.forbidden;
  return copy.status.loadError;
}

function pathwayName(pathway: PlannerPathway, lang: PlannerLang) {
  if (lang === 'ko') return pathway.nameKo;
  return pathway.display?.title || pathway.nameEn;
}

function pathwayReason(pathway: PlannerPathway) {
  return pathway.display?.primaryReason || pathway.note;
}

function PathwayCard({
  pathway,
  index,
  lang,
  shortestMonths,
  policyDate,
  sessionId,
}: {
  pathway: PlannerPathway;
  index: number;
  lang: PlannerLang;
  shortestMonths: number;
  policyDate?: string;
  sessionId: number | null;
}) {
  const copy = plannerUiCopy[lang].result;
  const legacyPreparationItems = [
    ...pathway.gaps,
    ...pathway.riskFlags.filter((item) => item !== 'policy_evidence_missing'),
  ].slice(0, 3);

  return (
    <article className={`overflow-hidden rounded-2xl border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${index === 0 ? 'border-sky-300 ring-1 ring-sky-100' : 'border-[#E5E8EB]'}`}>
      {index === 0 ? <div className="bg-[#0066FF] px-5 py-2 text-xs font-bold text-white sm:px-7">{copy.bestMatch}</div> : null}
      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#191F28] px-2 py-1 text-xs font-bold text-white">{index + 1}</span>
              <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${difficultyTone[pathway.difficultyLevel]}`}>{pathway.display.difficultyLabel}</span>
              {pathway.needsHumanReview && pathway.difficultyLevel !== 'expert_review' ? <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">{copy.expertReview}</span> : null}
            </div>
            <h2 className="mt-3 break-words text-xl font-bold leading-tight text-[#191F28] sm:text-2xl">{pathwayName(pathway, lang)}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7684]">{pathwayReason(pathway)}</p>
          </div>
        </div>

        <div className="mt-6">
          <PathwayMetricGuide pathway={pathway} shortestMonths={shortestMonths} lang={lang} />
        </div>

        <div className="mt-4"><PathwayReviewWarning lang={lang} /></div>

        <div className="mt-6 grid gap-4 border-y border-[#F2F4F6] py-5 md:grid-cols-3 md:divide-x md:divide-[#F2F4F6]">
          <div className="flex gap-3 md:pr-4">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#0066FF]" />
            <div><p className="text-xs font-medium text-[#8B95A1]">{copy.timeline}</p><p className="mt-1 text-sm font-semibold text-[#333D4B]">{pathway.estimatedMonths} {copy.monthUnit}</p></div>
          </div>
          <div className="flex gap-3 md:px-4">
            <WalletCards className="mt-0.5 h-4 w-4 shrink-0 text-[#0066FF]" />
            <div><p className="text-xs font-medium text-[#8B95A1]">{copy.cost}</p><p className="mt-1 text-sm font-semibold text-[#333D4B]">{formatMoney(pathway.estimatedCostWon, lang)}</p></div>
          </div>
          <div className="flex gap-3 md:pl-4">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#0066FF]" />
            <div><p className="text-xs font-medium text-[#8B95A1]">{copy.visaRoute}</p><p className="mt-1 break-words text-sm font-semibold text-[#333D4B]">{pathway.visaChain}</p></div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <section>
            <h3 className="text-sm font-bold text-[#191F28]">{requirementSectionCopy[lang].confirmed}</h3>
            <div className="mt-3"><RequirementAssessmentList assessments={pathway.requirementAssessments} statuses={['met', 'minimum_met']} limit={2} compact lang={lang} /></div>
          </section>
          <section>
            <h3 className="text-sm font-bold text-[#191F28]">{requirementSectionCopy[lang].preparation}</h3>
            <div className="mt-3">{pathway.requirementAssessments?.length ? <RequirementAssessmentList assessments={pathway.requirementAssessments} statuses={['unmet', 'unknown']} limit={3} compact lang={lang} /> : <PreparationGuidanceList codes={legacyPreparationItems} lang={lang} />}</div>
          </section>
        </div>

        <div className="mt-5"><PolicyEvidenceNotice pathway={pathway} policyDate={policyDate} lang={lang} compact /></div>

        <div className="mt-6 flex justify-end">
          <Link href={`/diagnosis/result/${encodeURIComponent(pathway.pathwayId)}${sessionId ? `?sessionId=${sessionId}` : ''}`} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#191F28] px-5 text-sm font-bold text-white transition hover:bg-[#333D4B]">
            {copy.detail}<ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function VisaPlannerResultPageRedesign() {
  const { lang } = useLanguage();
  const { isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
  const uiLang = normalizePlannerLang(lang);
  const copy = plannerUiCopy[uiLang];
  const { result, sessionId, isLoading, error, cacheWarning, retry } = usePlannerResult();
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'already-owned' | 'role-error' | 'forbidden' | 'conflict' | 'network-error'
  >('idle');

  const savePlan = useCallback(async () => {
    if (!sessionId || saveState === 'saving' || saveState === 'saved' || saveState === 'already-owned') return;
    if (role !== 'INDIVIDUAL') {
      setSaveState('role-error');
      return;
    }
    setSaveState('saving');
    try {
      const response = await claimPlannerSession(sessionId);
      setSaveState(response.reason === 'ALREADY_OWNED' ? 'already-owned' : 'saved');
    } catch (claimError) {
      if (claimError instanceof PlannerApiError) {
        if (claimError.code === 'INDIVIDUAL_ACCOUNT_REQUIRED') setSaveState('role-error');
        else if (claimError.status === 403) setSaveState('forbidden');
        else if (claimError.status === 409) setSaveState('conflict');
        else setSaveState('network-error');
      } else {
        setSaveState('network-error');
      }
    }
  }, [role, saveState, sessionId]);

  useEffect(() => {
    if (isAuthLoading || !result || !isLoggedIn || role !== 'INDIVIDUAL' || !sessionId || saveState !== 'idle') return;
    void savePlan();
  }, [isAuthLoading, isLoggedIn, result, role, savePlan, sessionId, saveState]);

  const shortestMonths = useMemo(() => Math.min(...(result?.pathways.map((pathway) => pathway.estimatedMonths) || [0])), [result]);

  if (isLoading && !result) return <PlannerLoading copy={copy} />;

  if (error || !result) {
    const message = resultErrorText(error || 'not-found', copy);
    return (
      <main className="min-h-screen bg-[#F9FAFB] text-[#191F28]">
        <PlannerHeader copy={copy} />
        <section className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <AlertCircle className="mx-auto h-8 w-8 text-[#0066FF]" />
          <h1 className="mt-5 text-xl font-bold">{message}</h1>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {error !== 'not-found' ? <button type="button" onClick={() => void retry()} className="h-11 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white">{copy.status.retry}</button> : null}
            <Link href="/diagnosis" className="inline-flex h-11 items-center rounded-xl border border-[#D1D6DB] bg-white px-5 text-sm font-bold text-[#333D4B]">{copy.result.restart}</Link>
          </div>
        </section>
      </main>
    );
  }

  const saveMessage = saveState === 'already-owned'
    ? copy.status.saveAlreadyOwned
    : saveState === 'role-error'
      ? copy.status.saveRoleError
      : saveState === 'forbidden'
        ? copy.status.saveForbidden
        : saveState === 'conflict'
          ? copy.status.saveConflict
          : saveState === 'network-error'
            ? copy.status.saveNetwork
            : '';
  const returnTo = `/diagnosis/result?sessionId=${sessionId}`;
  const loginHref = `/login?redirect=${encodeURIComponent(returnTo)}&returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F9FAFB] text-[#191F28]">
      <PlannerHeader copy={copy} />

      <section className="border-b border-[#E5E8EB] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <p className="text-sm font-bold text-[#0066FF]">{copy.result.eyebrow}</p>
          <h1 className="mt-2 max-w-3xl text-2xl font-bold leading-tight text-[#191F28] sm:text-3xl">{copy.result.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7684] sm:text-base">{copy.result.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/diagnosis" className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D1D6DB] bg-white px-4 text-sm font-semibold text-[#4E5968] transition hover:bg-[#F9FAFB]"><RefreshCcw className="h-4 w-4" />{copy.result.restart}</Link>
          </div>
          {cacheWarning ? <p className="mt-4 flex items-center gap-2 text-sm text-amber-700"><AlertCircle className="h-4 w-4" />{copy.status.loadError} {copy.status.retry}</p> : null}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <PlannerDecisionBoundary lang={uiLang} policyDate={result.meta.policyLastVerifiedAt} />

        {result.pathways.length ? (
          <div className="mt-6 space-y-5">
            {result.pathways.map((pathway, index) => (
              <PathwayCard key={pathway.pathwayId} pathway={pathway} index={index} lang={uiLang} shortestMonths={shortestMonths} policyDate={result.meta.policyLastVerifiedAt} sessionId={sessionId} />
            ))}
          </div>
        ) : (
          <section className="rounded-2xl border border-[#E5E8EB] bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-[#191F28]">{copy.result.emptyTitle}</h2>
            <p className="mt-2 text-sm text-[#6B7684]">{copy.result.emptyBody}</p>
          </section>
        )}

        <section className="mt-7 overflow-hidden rounded-2xl bg-slate-900 text-white">
          <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-bold">{copy.result.keepTitle}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{copy.result.keepBody}</p>
              {saveMessage ? <p className={`mt-3 text-sm ${saveState === 'already-owned' ? 'text-blue-200' : 'text-rose-300'}`}>{saveMessage}</p> : null}
            </div>
            {isLoggedIn && role === 'INDIVIDUAL' ? (
              <button onClick={savePlan} disabled={!sessionId || saveState === 'saving' || saveState === 'saved' || saveState === 'already-owned'} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white transition hover:bg-[#0057D9] disabled:bg-slate-600">
                <LockKeyhole className="h-4 w-4" />{saveState === 'saved' || saveState === 'already-owned' ? copy.result.saved : saveState === 'saving' ? copy.result.saving : saveState === 'network-error' || saveState === 'forbidden' || saveState === 'conflict' ? copy.status.retry : copy.result.save}
              </button>
            ) : isLoggedIn ? (
              <p className="max-w-xs text-sm font-semibold text-amber-200">{copy.status.saveRoleError}</p>
            ) : (
              <Link href={loginHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white transition hover:bg-[#0057D9]"><LockKeyhole className="h-4 w-4" />{copy.result.loginToSave}</Link>
            )}
          </div>
        </section>

        <details className="group mt-6 border-t border-[#D1D6DB] py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#333D4B]">
            {copy.result.informationBasis}<ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="mt-4 grid gap-5 text-sm leading-6 text-[#6B7684] md:grid-cols-2">
            <div>
              <p className="font-semibold text-[#333D4B]">{copy.result.policyChecked}</p>
              <p className="mt-1">{result.meta.policyLastVerifiedAt}</p>
              <p className="mt-4 font-semibold text-[#333D4B]">{copy.result.policyVersion}</p>
              <p className="mt-1">{result.meta.policyVersion}</p>
              <p className="mt-2 inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">{copy.result.policyReviewRequired}</p>
              <p className="mt-4 font-semibold text-[#333D4B]">{copy.result.scoreGuide}</p>
              <p className="mt-1">{copy.result.scoreGuideBody}</p>
            </div>
            <div className="border-l-0 border-[#E5E8EB] md:border-l md:pl-5">
              <p className="flex items-center gap-2 font-semibold text-[#333D4B]"><ShieldAlert className="h-4 w-4 text-amber-600" />{copy.result.legalTitle}</p>
              <p className="mt-1">{uiLang === 'ko' ? '잡차자는 입력 내용을 바탕으로 검토 가능한 경로와 준비 정보를 정리할 뿐, 비자·체류자격에 관한 공식 또는 법적 판단을 내리지 않습니다. 신청 전 최신 공식 기준과 개인별 적용 여부를 확인하세요.' : 'JobChaja only organizes possible routes and preparation information from the entered data; it does not make an official or legal visa or stay-status determination. Confirm current official rules and their application to your case before filing.'}</p>
              <p className="mt-3 font-semibold text-[#333D4B]">{copy.result.informationOnly}</p>
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}
