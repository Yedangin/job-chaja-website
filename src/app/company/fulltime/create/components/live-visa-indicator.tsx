'use client';

import { ChevronDown, ChevronUp, Loader2, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { matchFulltimeVisa } from '../api';
import { useFulltimeCopy } from '../copy';
import type { FulltimeJobFormData, FulltimeVisaMatchingResponse } from './fulltime-types';

type Track = 'IMMEDIATE' | 'TRANSITION' | 'TRANSFER' | 'SPONSOR';

const TRACK_VISAS: Record<Track, string[]> = {
  IMMEDIATE: ['F-2', 'F-4', 'F-5', 'F-6'],
  TRANSITION: ['D-2', 'D-10'],
  TRANSFER: ['E-7-1', 'E-7-2', 'E-7-3', 'E-7-4', 'E-7-S'],
  SPONSOR: ['E-7-1', 'E-7-2', 'E-7-3', 'E-7-4', 'E-7-S'],
};

function VisaSection({ id, title, detail, visas, collapsed, onToggle }: { id: string; title: string; detail?: string; visas: string[]; collapsed: boolean; onToggle: () => void }) {
  return <section className="border border-gray-200 rounded-lg overflow-hidden"><button type="button" onClick={onToggle} aria-expanded={!collapsed} aria-controls={`${id}-visas`} className="w-full min-h-11 px-3 py-2 flex items-center justify-between gap-2 text-left bg-white hover:bg-[#F9FAFB]"><span className="min-w-0"><span className="block text-xs font-semibold text-[#191F28] break-words">{title}</span>{detail && <span className="block text-xs text-gray-500 mt-0.5 break-words">{detail}</span>}</span><span className="shrink-0 flex items-center gap-1 text-xs text-gray-500">{visas.length}{collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}</span></button>{!collapsed && <div id={`${id}-visas`} className="p-2 bg-[#F9FAFB] grid grid-cols-2 gap-1">{visas.map((visa) => <span key={visa} className="min-w-0 px-2 py-1 text-xs font-medium text-[#191F28] bg-white border border-gray-200 rounded">{visa}</span>)}</div>}</section>;
}

export default function LiveVisaIndicatorLocalized({ form }: { form: FulltimeJobFormData }) {
  const copy = useFulltimeCopy();
  const [result, setResult] = useState<FulltimeVisaMatchingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const timerRef = useRef<number | null>(null);
  const isPartTime = form.employmentType === 'ALBA';
  const isFulltime = ['REGULAR', 'CONTRACT', 'INTERN'].includes(form.employmentType);
  const isReady = isFulltime && Boolean(form.jobCategoryCode) && form.salaryMin > 0;
  const tracks: Array<{ key: Track; label: string; detail: string }> = [{ key: 'IMMEDIATE', label: copy.immediate, detail: copy.now }, { key: 'TRANSITION', label: copy.transition, detail: copy.weeks34 }, { key: 'TRANSFER', label: copy.transfer, detail: copy.weeks12 }, { key: 'SPONSOR', label: copy.sponsor, detail: copy.weeks48 }];

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (!isReady) {
      const resetTimer = window.setTimeout(() => { setResult(null); setFailed(false); setLoading(false); }, 0);
      return () => window.clearTimeout(resetTimer);
    }
    timerRef.current = window.setTimeout(async () => {
      setLoading(true); setFailed(false);
      try { setResult(await matchFulltimeVisa(form)); } catch { setResult(null); setFailed(true); } finally { setLoading(false); }
    }, 450);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [form, isReady]);

  const toggle = (id: string) => setCollapsed((current) => ({ ...current, [id]: !current[id] }));
  const panelClass = 'bg-white border border-gray-200 rounded-lg overflow-hidden';
  if (loading) return <div className={`${panelClass} p-5 flex items-center justify-center gap-2 text-sm text-gray-600`}><Loader2 className="w-5 h-5 animate-spin text-[#0066FF]" />{copy.visaLoading}</div>;
  if (failed) return <div className={`${panelClass} p-5 text-center`}><XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" /><p className="text-sm text-red-700">{copy.visaError}</p></div>;
  if (!form.employmentType) {
    const all = Object.values(TRACK_VISAS).flat().filter((visa, index, list) => list.indexOf(visa) === index);
    return <div className={panelClass}><header className="p-4 border-b border-gray-100"><h2 className="text-sm font-bold text-[#191F28]">{copy.visaAll}</h2><p className="mt-1 text-xs text-gray-500">{copy.visaChooseType}</p></header><div className="p-3"><VisaSection id="all" title={copy.visaAll} visas={all} collapsed={Boolean(collapsed.all)} onToggle={() => toggle('all')} /></div></div>;
  }
  if (isPartTime) {
    const groups = [{ id: 'immediate', title: copy.immediate, detail: copy.now, visas: TRACK_VISAS.IMMEDIATE }, { id: 'study', title: copy.transition, detail: copy.weeks34, visas: ['D-2', 'D-4', 'D-10'] }, { id: 'holiday', title: copy.partTime, detail: copy.visaNeedDetails, visas: ['H-1', 'H-2'] }];
    return <div className={panelClass}><header className="p-4 border-b border-gray-100"><h2 className="text-sm font-bold text-[#191F28]">{copy.visaPartTime}</h2><p className="mt-1 text-xs text-gray-500">{copy.visaNeedDetails}</p></header><div className="p-3 space-y-2">{groups.map((group) => <VisaSection key={group.id} {...group} collapsed={Boolean(collapsed[group.id])} onToggle={() => toggle(group.id)} />)}</div></div>;
  }
  if (!isReady) return <div className={panelClass}><header className="p-4 border-b border-gray-100"><h2 className="text-sm font-bold text-[#191F28]">{copy.visaFulltime}</h2><p className="mt-1 text-xs text-gray-500">{copy.visaNeedDetails}</p></header><div className="p-3 space-y-2">{tracks.map((track) => <VisaSection key={track.key} id={track.key} title={track.label} detail={track.detail} visas={TRACK_VISAS[track.key]} collapsed={Boolean(collapsed[track.key])} onToggle={() => toggle(track.key)} />)}</div></div>;
  if (!result) return null;
  const resultKey = (key: Track) => key.toLowerCase() as 'immediate' | 'transition' | 'transfer' | 'sponsor';
  const eligibleCount = tracks.reduce((total, { key }) => total + (result[resultKey(key)]?.eligible.length || 0), 0);
  return <div className={panelClass}><header className="p-4 border-b border-gray-100"><h2 className="text-sm font-bold text-[#191F28]">{copy.visaLive}</h2><p className="mt-1 text-xs text-gray-500">{copy.visaUpdates}</p></header>{eligibleCount ? <div className="p-3 space-y-2">{tracks.map(({ key, label, detail }) => { const visas = result[resultKey(key)]?.eligible.map((visa) => visa.visaCode) || []; return visas.length ? <VisaSection key={key} id={key} title={label} detail={detail} visas={visas} collapsed={Boolean(collapsed[key])} onToggle={() => toggle(key)} /> : null; })}</div> : <div className="p-6 text-center"><XCircle className="w-7 h-7 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-700">{copy.visaNone}</p><p className="mt-1 text-xs text-gray-500">{copy.visaAdjust}</p></div>}</div>;
}
