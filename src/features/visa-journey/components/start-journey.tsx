'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, Loader2, Route } from 'lucide-react';
import type { VisaJourneyCopy } from '../copy';
import type { CreateVisaJourneyInput } from '../types';
import { LegalNotice, STAGE_ICONS } from './ui-utils';

export function StartJourney({ copy, locale, busy, onSubmit }: {
  copy: VisaJourneyCopy;
  locale: string;
  busy: boolean;
  onSubmit: (input: CreateVisaJourneyInput) => Promise<void>;
}) {
  const [targetVisaCode, setTargetVisaCode] = useState('');
  const [targetPathwayName, setTargetPathwayName] = useState('');
  const [currentVisaCode, setCurrentVisaCode] = useState('');
  const [targetApplicationDate, setTargetApplicationDate] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!targetVisaCode.trim()) return;
    void onSubmit({
      targetVisaCode: targetVisaCode.trim(),
      targetPathwayName: targetPathwayName.trim() || undefined,
      currentVisaCode: currentVisaCode.trim() || undefined,
      targetApplicationDate: targetApplicationDate || undefined,
      locale,
    });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
      <form onSubmit={submit} className="rounded-3xl border border-[#E5E8EB] bg-white p-5 shadow-sm sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-[#0066FF]"><Route className="size-5" /></div>
        <h2 className="mt-5 text-xl font-bold text-[#191F28]">{copy.startTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-[#6B7684]">{copy.startBody}</p>
        <div className="mt-7 space-y-5">
          <TextInput required label={copy.targetVisa} value={targetVisaCode} onChange={setTargetVisaCode} placeholder={copy.targetPlaceholder} />
          <TextInput label={`${copy.pathwayName} (${copy.optional})`} value={targetPathwayName} onChange={setTargetPathwayName} placeholder={copy.pathwayPlaceholder} />
          <TextInput label={`${copy.currentVisa} (${copy.optional})`} value={currentVisaCode} onChange={setCurrentVisaCode} placeholder={copy.currentPlaceholder} />
          <label className="block text-sm font-semibold text-[#333D4B]">
            {copy.targetDate} <span className="font-normal text-[#8B95A1]">({copy.optional})</span>
            <input type="date" value={targetApplicationDate} onChange={(event) => setTargetApplicationDate(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#D1D6DB] bg-white px-4 text-base font-normal text-[#191F28] outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100" />
          </label>
        </div>
        <button disabled={busy || !targetVisaCode.trim()} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-bold text-white hover:bg-[#0052CC] disabled:cursor-not-allowed disabled:bg-[#B0B8C1]">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
          {busy ? copy.starting : copy.start}
        </button>
      </form>
      <div className="space-y-4">
        <div className="rounded-3xl bg-[#191F28] p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">1 — 5</p>
          <ol className="mt-5 space-y-4">
            {copy.stages.map((stage, index) => {
              const Icon = STAGE_ICONS[index];
              return (
                <li key={stage} className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10"><Icon className="size-4" /></span>
                  <div><p className="text-sm font-bold">{stage}</p><p className="mt-0.5 text-xs leading-5 text-gray-300">{copy.stageDescriptions[index]}</p></div>
                </li>
              );
            })}
          </ol>
        </div>
        <LegalNotice copy={copy} />
      </div>
    </div>
  );
}

function TextInput({ label, value, placeholder, required, onChange }: {
  label: string; value: string; placeholder: string; required?: boolean; onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold text-[#333D4B]">
      {label}
      <input required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 min-h-12 w-full rounded-xl border border-[#D1D6DB] bg-white px-4 text-base font-normal text-[#191F28] outline-none placeholder:text-[#8B95A1] focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100" />
    </label>
  );
}
