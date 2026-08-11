'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, LockKeyhole, UserRoundCheck } from 'lucide-react';
import type { VisaJourneyCopy } from '../copy';
import type { ExpertServiceType, VisaJourney } from '../types';

export function ExpertStage({ journey, copy, busy, success, onSubmit }: {
  journey: VisaJourney;
  copy: VisaJourneyCopy;
  busy: boolean;
  success: boolean;
  onSubmit: (serviceType: ExpertServiceType, question: string) => Promise<void>;
}) {
  const [serviceType, setServiceType] = useState<ExpertServiceType>('CONSULTATION');
  const [question, setQuestion] = useState('');
  const [consent, setConsent] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (consent) void onSubmit(serviceType, question.trim());
  };
  const options = [
    ['CONSULTATION', copy.consult],
    ['DOCUMENT_REVIEW', copy.review],
    ['APPLICATION_AGENCY', copy.agency],
  ] as const;

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="rounded-2xl border border-[#E5E8EB] bg-white p-5 sm:p-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066FF]"><UserRoundCheck className="size-5" /></div>
        <h3 className="mt-4 text-lg font-bold text-[#191F28]">{copy.expertSummary}</h3>
        <p className="mt-2 text-sm leading-6 text-[#6B7684]">{copy.noGuarantee}</p>
        <fieldset className="mt-6">
          <legend className="text-sm font-bold text-[#333D4B]">{copy.serviceType}</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {options.map(([value, label]) => (
              <label key={value} className={`flex min-h-12 cursor-pointer items-center rounded-xl border px-3 text-sm font-semibold ${serviceType === value ? 'border-[#0066FF] bg-blue-50 text-blue-700' : 'border-[#D1D6DB] text-[#4E5968]'}`}>
                <input type="radio" name="serviceType" value={value} checked={serviceType === value} onChange={() => setServiceType(value)} className="mr-2 accent-[#0066FF]" />{label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="mt-5 block text-sm font-bold text-[#333D4B]">
          {copy.question}
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows={4} placeholder={copy.questionPlaceholder} className="mt-2 w-full rounded-xl border border-[#D1D6DB] p-3 text-base font-normal leading-6 outline-none placeholder:text-[#8B95A1] focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100" />
        </label>
        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-[#F9FAFB] p-4">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 size-4 accent-[#0066FF]" />
          <span><span className="block text-sm font-semibold leading-6 text-[#333D4B]">{copy.consent}</span><span className="mt-1 block text-xs leading-5 text-[#8B95A1]">{copy.consentHint}</span></span>
        </label>
        {success && <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-700" role="status"><CheckCircle2 className="size-4" />{copy.expertSuccess}</p>}
        <button disabled={!consent || busy} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#191F28] px-5 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-[#B0B8C1]">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}{busy ? copy.requesting : copy.requestExpert}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#8B95A1]"><LockKeyhole className="size-3" />{copy.privacy}</p>
      </form>
      {journey.expertCases.length > 0 && (
        <section className="rounded-2xl border border-[#E5E8EB] bg-white p-5">
          <h3 className="text-sm font-bold text-[#191F28]">{copy.existingCases}</h3>
          <ul className="mt-3 divide-y divide-[#F2F4F6]">
            {journey.expertCases.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="font-semibold text-[#333D4B]">{item.serviceType === 'CONSULTATION' ? copy.consult : item.serviceType === 'DOCUMENT_REVIEW' ? copy.review : copy.agency}</span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{item.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
