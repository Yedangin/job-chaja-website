'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CalendarDays, History, Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/i18n/LanguageProvider';
import { fetchPlannerHistory } from '@/lib/planner-api';
import { plannerUiCopy } from '@/lib/planner-content';
import { normalizePlannerLang, type PlannerHistoryItem } from '@/lib/planner-types';
import { PlannerHeader } from './planner-shell';

function historyTitle(item: PlannerHistoryItem, lang: ReturnType<typeof normalizePlannerLang>) {
  const top = item.resultsSnapshot?.pathways?.find(
    (pathway) => pathway.pathwayId === item.topPathwayId,
  ) || item.resultsSnapshot?.pathways?.[0];
  if (!top) return `#${item.sessionId}`;
  if (lang === 'ko') return top.nameKo;
  return top.display?.title || top.nameEn;
}

export default function VisaPlannerHistoryPage() {
  const { lang } = useLanguage();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const uiLang = normalizePlannerLang(lang);
  const copy = plannerUiCopy[uiLang];
  const [items, setItems] = useState<PlannerHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await fetchPlannerHistory();
      setItems(Array.isArray(response.items) ? response.items : []);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading || !isLoggedIn) return;
    void loadHistory();
  }, [isAuthLoading, isLoggedIn, loadHistory]);

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] text-[#191F28]">
        <PlannerHeader copy={copy} />
        <div className="grid min-h-[50vh] place-items-center"><Loader2 className="h-7 w-7 animate-spin text-[#0066FF]" /></div>
      </main>
    );
  }

  if (!isLoggedIn) {
    const returnTo = '/diagnosis/history';
    const loginHref = `/login?redirect=${encodeURIComponent(returnTo)}&returnTo=${encodeURIComponent(returnTo)}`;
    return (
      <main className="min-h-screen bg-[#F9FAFB] text-[#191F28]">
        <PlannerHeader copy={copy} />
        <section className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
          <History className="mx-auto h-8 w-8 text-[#0066FF]" />
          <h1 className="mt-5 text-xl font-bold">{copy.history.loginTitle}</h1>
          <Link href={loginHref} className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white hover:bg-[#0057D9]">{copy.history.loginAction}</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#191F28]">
      <PlannerHeader copy={copy} />
      <section className="border-b border-[#E5E8EB] bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{copy.history.title}</h1>
            <p className="mt-2 text-sm text-[#6B7684]">{copy.history.subtitle}</p>
          </div>
          <Link href="/diagnosis" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white hover:bg-[#0057D9]"><Plus className="h-4 w-4" />{copy.history.newPlan}</Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-7 sm:px-6">
        {isLoading ? <div className="grid min-h-[240px] place-items-center"><Loader2 className="h-7 w-7 animate-spin text-[#0066FF]" /></div> : null}

        {!isLoading && hasError ? (
          <div className="border border-[#E5E8EB] bg-white p-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-[#0066FF]" />
            <p className="mt-4 font-bold">{copy.status.loadError}</p>
            <button type="button" onClick={() => void loadHistory()} className="mt-5 h-11 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white hover:bg-[#0057D9]">{copy.status.retry}</button>
          </div>
        ) : null}

        {!isLoading && !hasError && items.length === 0 ? (
          <div className="border border-[#E5E8EB] bg-white p-8 text-center">
            <History className="mx-auto h-8 w-8 text-[#8B95A1]" />
            <h2 className="mt-4 text-lg font-bold">{copy.history.emptyTitle}</h2>
            <p className="mt-2 text-sm text-[#6B7684]">{copy.history.emptyBody}</p>
          </div>
        ) : null}

        {!isLoading && !hasError && items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <Link key={item.sessionId} href={`/diagnosis/result?sessionId=${item.sessionId}`} className="group grid gap-4 border border-[#E5E8EB] bg-white p-5 transition hover:border-[#0066FF] sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                <div className="min-w-0">
                  <h2 className="break-words text-base font-bold text-[#191F28]">{historyTitle(item, uiLang)}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[#6B7684]">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{new Intl.DateTimeFormat(uiLang === 'ko' ? 'ko-KR' : uiLang === 'vi' ? 'vi-VN' : uiLang === 'th' ? 'th-TH' : uiLang === 'fil' ? 'fil-PH' : 'en-US', { dateStyle: 'medium' }).format(new Date(item.createdAt))}</span>
                    <span>{item.pathwayCount} {copy.history.routeCount}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-[#0066FF]">{copy.history.open}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
