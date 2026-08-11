'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  FileText,
  LockKeyhole,
  ShieldAlert,
  WalletCards,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/i18n/LanguageProvider';
import { difficultyTone } from '@/lib/planner-data';
import { plannerUiCopy } from '@/lib/planner-content';
import { claimPlannerSession, PlannerApiError } from '@/lib/planner-api';
import { normalizePlannerLang, type PlannerLang, type PlannerPathway } from '@/lib/planner-types';
import { PlannerHeader, PlannerLoading } from './planner-shell';
import {
  PathwayMetricGuide,
  PathwayReviewWarning,
  PathwayStageCard,
  PlannerDecisionBoundary,
  PolicyEvidenceNotice,
  PreparationGuidanceList,
  RequirementAssessmentList,
  requirementSectionCopy,
} from './planner-result-explainer';
import { usePlannerResult } from './use-planner-result';

function formatMoney(value: number, lang: PlannerLang) {
  if (!value) return '-';
  const locale = lang === 'ko' ? 'ko-KR' : lang === 'vi' ? 'vi-VN' : lang === 'th' ? 'th-TH' : lang === 'fil' ? 'fil-PH' : 'en-US';
  if (lang === 'ko') return `${new Intl.NumberFormat(locale).format(value / 10_000)}만원`;
  return `KRW ${new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;
}

function pathwayName(pathway: PlannerPathway, lang: PlannerLang) {
  if (lang === 'ko') return pathway.nameKo;
  return pathway.display?.title || pathway.nameEn;
}

export default function VisaPlannerDetailPageRedesign() {
  const params = useParams<{ pathwayId: string }>();
  const { lang } = useLanguage();
  const { isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
  const uiLang = normalizePlannerLang(lang);
  const copy = plannerUiCopy[uiLang];
  const { result, sessionId, isLoading, error, cacheWarning, retry } = usePlannerResult();
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'already-owned' | 'role-error' | 'forbidden' | 'conflict' | 'network-error'
  >('idle');

  const pathway = useMemo(() => result?.pathways.find((item) => item.pathwayId === params.pathwayId), [params.pathwayId, result]);
  const shortestMonths = useMemo(() => Math.min(...(result?.pathways.map((item) => item.estimatedMonths) || [0])), [result]);

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

  if (isLoading && !result) return <PlannerLoading copy={copy} />;

  if (error || !result) {
    const message = error === 'forbidden' ? copy.status.forbidden : error === 'not-found' ? copy.status.notFound : copy.status.loadError;
    return (
      <main className="min-h-screen bg-[#F9FAFB] text-[#191F28]">
        <PlannerHeader copy={copy} />
        <section className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <AlertCircle className="mx-auto h-8 w-8 text-[#0066FF]" />
          <h1 className="mt-5 text-xl font-bold">{message}</h1>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {error !== 'not-found' ? <button type="button" onClick={() => void retry()} className="h-11 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white">{copy.status.retry}</button> : null}
            <Link href={`/diagnosis/result${sessionId ? `?sessionId=${sessionId}` : ''}`} className="inline-flex h-11 items-center rounded-xl border border-[#D1D6DB] bg-white px-5 text-sm font-bold text-[#333D4B]">{copy.result.backToResults}</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!pathway) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] text-[#191F28]">
        <PlannerHeader copy={copy} />
        <section className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <AlertCircle className="mx-auto h-8 w-8 text-[#0066FF]" />
          <h1 className="mt-5 text-xl font-bold">{copy.status.invalidPathway}</h1>
          <Link href={`/diagnosis/result?sessionId=${sessionId}`} className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white">{copy.result.backToResults}</Link>
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
  const returnTo = `/diagnosis/result/${encodeURIComponent(pathway.pathwayId)}?sessionId=${sessionId}`;
  const loginHref = `/login?redirect=${encodeURIComponent(returnTo)}&returnTo=${encodeURIComponent(returnTo)}`;

  const reviewItems = pathway.riskFlags.filter((item) => item !== 'policy_evidence_missing');

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F9FAFB] text-[#191F28]">
      <PlannerHeader copy={copy} />

      <section className="border-b border-[#E5E8EB] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
          <Link href={`/diagnosis/result?sessionId=${sessionId}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#4E5968] transition hover:text-[#0066FF]">
            <ArrowLeft className="h-4 w-4" />{copy.result.backToResults}
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${difficultyTone[pathway.difficultyLevel]}`}>{pathway.display.difficultyLabel}</span>
            {pathway.needsHumanReview && pathway.difficultyLevel !== 'expert_review' ? <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">{copy.result.expertReview}</span> : null}
          </div>
          <h1 className="mt-3 max-w-4xl break-words text-2xl font-bold leading-tight text-[#191F28] sm:text-3xl">{pathwayName(pathway, uiLang)}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6B7684] sm:text-base">{pathway.display?.primaryReason || pathway.note}</p>
          {cacheWarning ? <p className="mt-4 flex items-center gap-2 text-sm text-amber-700"><AlertCircle className="h-4 w-4" />{copy.status.loadError} {copy.status.retry}</p> : null}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <PlannerDecisionBoundary lang={uiLang} policyDate={result.meta.policyLastVerifiedAt} />

        <section aria-labelledby="route-overview" className="rounded-2xl border border-[#E5E8EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-7">
          <h2 id="route-overview" className="text-lg font-bold text-[#191F28]">{copy.result.overview}</h2>
          <div className="mt-5"><PathwayMetricGuide pathway={pathway} shortestMonths={shortestMonths} lang={uiLang} /></div>
          <div className="mt-5 grid gap-5 border-t border-[#F2F4F6] pt-5 sm:grid-cols-3 sm:divide-x sm:divide-[#F2F4F6]">
            <div className="flex gap-3 sm:pr-4"><CalendarClock className="mt-1 h-4 w-4 shrink-0 text-[#0066FF]" /><div><p className="text-xs font-medium text-[#8B95A1]">{copy.result.timeline}</p><p className="mt-1 text-sm font-semibold text-[#333D4B]">{pathway.estimatedMonths} {copy.result.monthUnit}</p></div></div>
            <div className="flex gap-3 sm:px-4"><WalletCards className="mt-1 h-4 w-4 shrink-0 text-[#0066FF]" /><div><p className="text-xs font-medium text-[#8B95A1]">{copy.result.cost}</p><p className="mt-1 text-sm font-semibold text-[#333D4B]">{formatMoney(pathway.estimatedCostWon, uiLang)}</p></div></div>
            <div className="flex gap-3 sm:pl-4"><FileText className="mt-1 h-4 w-4 shrink-0 text-[#0066FF]" /><div><p className="text-xs font-medium text-[#8B95A1]">{copy.result.visaRoute}</p><p className="mt-1 break-words text-sm font-semibold text-[#333D4B]">{pathway.visaChain}</p></div></div>
          </div>
          <div className="mt-5"><PathwayReviewWarning lang={uiLang} /></div>
        </section>

        <div className="mt-5"><PolicyEvidenceNotice pathway={pathway} policyDate={result.meta.policyLastVerifiedAt} lang={uiLang} /></div>

        <section aria-labelledby="all-requirements" className="mt-6 rounded-2xl border border-[#E5E8EB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-7">
          <h2 id="all-requirements" className="text-lg font-bold text-[#191F28]">{requirementSectionCopy[uiLang].all}</h2>
          <p className="mt-2 text-sm leading-6 text-[#6B7684]">{uiLang === 'ko' ? '각 항목의 현재값과 공식·최소 기준을 비교하고, 확인되지 않은 조건은 다음 행동으로 남겨두었습니다.' : 'Compare your current value with the official or minimum standard for every item. Unconfirmed conditions remain as explicit next actions.'}</p>
          <div className="mt-5"><RequirementAssessmentList assessments={pathway.requirementAssessments} lang={uiLang} /></div>
        </section>

        <div className="mt-6 grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section aria-labelledby="preparation-timeline" className="min-w-0">
            <h2 id="preparation-timeline" className="text-lg font-bold text-[#191F28]">{copy.result.preparationTimeline}</h2>
            <ol className="mt-4 border-l-2 border-sky-100 pl-6">
              {pathway.milestones.map((milestone, index) => (
                <PathwayStageCard key={`${milestone.order}-${milestone.visaStatus}`} milestone={milestone} pathway={pathway} index={index} lang={uiLang} />
              ))}
            </ol>
          </section>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-20">
           <section className="border-t border-[#D1D6DB] pt-5">
              <h2 className="text-sm font-bold text-[#191F28]">{requirementSectionCopy[uiLang].confirmed}</h2>
              <div className="mt-3"><RequirementAssessmentList assessments={pathway.requirementAssessments} statuses={['met', 'minimum_met']} limit={2} compact lang={uiLang} /></div>
            </section>

            <section className="border-t border-[#D1D6DB] pt-5">
              <h2 className="text-sm font-bold text-[#191F28]">{requirementSectionCopy[uiLang].preparation}</h2>
              <div className="mt-3">{pathway.requirementAssessments?.length ? <RequirementAssessmentList assessments={pathway.requirementAssessments} statuses={['unmet', 'unknown']} limit={3} compact lang={uiLang} /> : <PreparationGuidanceList codes={pathway.gaps} lang={uiLang} />}</div>
            </section>

            {reviewItems.length ? <section className="border-t border-[#D1D6DB] pt-5">
              <h2 className="text-sm font-bold text-[#191F28]">{uiLang === 'ko' ? '개별 확인이 필요한 항목' : 'Items requiring individual review'}</h2>
              <div className="mt-3"><PreparationGuidanceList codes={reviewItems} lang={uiLang} /></div>
            </section>
            : null}

            <section className="border-t border-[#D1D6DB] pt-5">
              <h2 className="text-sm font-bold text-[#191F28]">{copy.result.nextActions}</h2>
              <ol className="mt-3 space-y-4">
                {pathway.nextSteps.map((step, index) => (
                  <li key={`${step.actionType}-${step.nameEn}`} className="grid grid-cols-[24px_1fr] gap-2 text-sm">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-sky-50 text-xs font-bold text-[#0066FF]">{index + 1}</span>
                    <div><p className="font-semibold text-[#333D4B]">{uiLang === 'ko' ? step.nameKo : step.nameEn}</p><p className="mt-1 leading-6 text-[#6B7684]">{step.description}</p></div>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>

        <section className="mt-7 overflow-hidden rounded-2xl bg-slate-900 text-white">
          <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div><h2 className="text-xl font-bold">{copy.result.keepTitle}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{copy.result.keepBody}</p>{saveMessage ? <p className={`mt-3 text-sm ${saveState === 'already-owned' ? 'text-blue-200' : 'text-rose-300'}`}>{saveMessage}</p> : null}</div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {isLoggedIn && role === 'INDIVIDUAL' ? (
                <button onClick={savePlan} disabled={!sessionId || saveState === 'saving' || saveState === 'saved' || saveState === 'already-owned'} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white transition hover:bg-[#0057D9] disabled:bg-slate-600"><LockKeyhole className="h-4 w-4" />{saveState === 'saved' || saveState === 'already-owned' ? copy.result.saved : saveState === 'saving' ? copy.result.saving : saveState === 'network-error' || saveState === 'forbidden' || saveState === 'conflict' ? copy.status.retry : copy.result.save}</button>
              ) : isLoggedIn ? (
                <p className="max-w-xs text-sm font-semibold text-amber-200">{copy.status.saveRoleError}</p>
              ) : (
                <Link href={loginHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white transition hover:bg-[#0057D9]"><LockKeyhole className="h-4 w-4" />{copy.result.loginToSave}</Link>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 border-t border-[#D1D6DB] py-5 text-sm leading-6 text-[#6B7684]">
          <h2 className="flex items-center gap-2 font-semibold text-[#333D4B]"><ShieldAlert className="h-4 w-4 text-amber-600" />{copy.result.legalTitle}</h2>
          <p className="mt-1 max-w-4xl">{uiLang === 'ko' ? '잡차자는 입력 내용을 바탕으로 검토 가능한 경로와 준비 정보를 정리할 뿐, 비자·체류자격에 관한 공식 또는 법적 판단을 내리지 않습니다. 각 단계는 별도로 심사되고 불허될 수 있으므로 신청 전 최신 공식 기준과 개인별 적용 여부를 확인하세요.' : 'JobChaja only organizes possible routes and preparation information from the entered data; it does not make an official or legal visa or stay-status determination. Each stage is separately reviewed and may be refused, so confirm current official rules and their application to your case before filing.'}</p>
          <p className="mt-2 text-xs text-[#8B95A1]">{copy.result.policyChecked}: {result.meta.policyLastVerifiedAt}</p>
          <p className="mt-1 text-xs text-[#8B95A1]">{copy.result.policyVersion}: {result.meta.policyVersion}</p>
          <p className="mt-3 inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">{copy.result.policyReviewRequired} · {copy.result.informationOnly}</p>
        </section>
      </div>
    </main>
  );
}
