'use client';

import { X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { normalizeLocale } from '@/i18n/locales';
import type { ResumeDetail } from './talent-api';
import {
  formatTalentDate,
  formatTalentMonth,
  JOB_OPTIONS,
  localizedList,
  NATIONALITY_OPTIONS,
  optionLabel,
  REGION_OPTIONS,
  TALENT_COPY,
} from './copy';

function value(record: Record<string, unknown>, key: string) {
  const item = record[key];
  return typeof item === 'string' || typeof item === 'number' ? String(item) : '-';
}

export default function TalentDetailModal({ detail, onClose }: { detail: ResumeDetail; onClose: () => void }) {
  const { lang } = useLanguage();
  const locale = normalizeLocale(lang);
  const copy = TALENT_COPY[locale];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="talent-detail-title">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <header className="sticky top-0 flex items-start justify-between gap-3 border-b border-[#E5E8EB] bg-white px-4 py-4 sm:px-5">
          <div className="min-w-0"><h2 id="talent-detail-title" className="text-lg font-bold text-[#191F28]">{copy.detail.title}</h2><p className="mt-1 text-sm leading-5 text-[#6B7684]">{copy.detail.subtitle}</p></div>
          <button onClick={onClose} aria-label={copy.common.close} title={copy.common.close} className="grid size-9 shrink-0 place-items-center rounded-lg text-[#6B7684] hover:bg-[#F2F4F6]"><X className="size-5" /></button>
        </header>
        <div className="space-y-7 p-4 text-sm text-[#333D4B] sm:p-5">
          <section className="grid gap-4 sm:grid-cols-3"><div><p className="text-xs text-[#8B95A1]">{copy.detail.nationality}</p><p className="mt-1 font-semibold">{optionLabel(NATIONALITY_OPTIONS, detail.nationality, locale)}</p></div><div><p className="text-xs text-[#8B95A1]">{copy.detail.birthDate}</p><p className="mt-1 font-semibold">{detail.birthDate ? formatTalentDate(detail.birthDate, locale) : '-'}</p></div><div><p className="text-xs text-[#8B95A1]">{copy.detail.korean}</p><p className="mt-1 font-semibold">{copy.common.koreanLevel(detail.topikLevel, detail.kiipLevel)}</p></div></section>
          <section><h3 className="mb-3 font-bold text-[#191F28]">{copy.detail.education}</h3><div className="divide-y divide-[#E5E8EB] border-y border-[#E5E8EB]">{detail.educations?.length ? detail.educations.map((education, index) => <div key={index} className="py-3"><p className="font-semibold">{value(education, 'school')}</p><p className="mt-1 break-words text-[#6B7684]">{value(education, 'major')} · {value(education, 'degree')} · {value(education, 'graduationYear')}</p></div>) : <p className="py-3 text-[#8B95A1]">{copy.detail.noEducation}</p>}</div></section>
          <section><h3 className="mb-3 font-bold text-[#191F28]">{copy.detail.work}</h3><div className="divide-y divide-[#E5E8EB] border-y border-[#E5E8EB]">{detail.workExperiences?.length ? detail.workExperiences.map((work, index) => <div key={index} className="py-3"><p className="break-words font-semibold">{value(work, 'company')} · {value(work, 'role')}</p><p className="mt-1 text-[#6B7684]">{formatTalentMonth(value(work, 'startDate'), locale)} - {formatTalentMonth(value(work, 'endDate'), locale)}</p><p className="mt-2 break-words leading-6">{value(work, 'description')}</p></div>) : <p className="py-3 text-[#8B95A1]">{copy.detail.noWork}</p>}</div></section>
          <section className="grid gap-4 sm:grid-cols-2"><div><h3 className="font-bold text-[#191F28]">{copy.detail.jobs}</h3><p className="mt-2 break-words">{localizedList(JOB_OPTIONS, detail.preferredJobTypes, locale) || '-'}</p></div><div><h3 className="font-bold text-[#191F28]">{copy.detail.regions}</h3><p className="mt-2 break-words">{localizedList(REGION_OPTIONS, detail.preferredRegions, locale) || '-'}</p></div></section>
        </div>
      </div>
    </div>
  );
}
