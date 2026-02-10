import { useLanguage } from '@/i18n/LanguageProvider';
import type { TermsAgreement } from '../types/auth.types';

interface TermsAgreementProps {
  terms: TermsAgreement;
  onTermChange: (key: keyof TermsAgreement) => void;
  onAllTermsChange: (checked: boolean) => void;
  onViewTerm: (termKey: string) => void;
  isAllChecked: boolean;
}

/**
 * 약관 동의 체크박스 UI
 */
export function TermsAgreementComponent({
  terms,
  onTermChange,
  onAllTermsChange,
  onViewTerm,
  isAllChecked,
}: TermsAgreementProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {/* 전체 동의 */}
      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
        <input
          type="checkbox"
          checked={isAllChecked}
          onChange={(e) => onAllTermsChange(e.target.checked)}
          className="w-5 h-5 rounded border-slate-300 accent-sky-600"
        />
        <span className="text-sm font-bold text-slate-800">{t('agreeAll')}</span>
      </label>

      {/* 개별 약관 */}
      <div className="space-y-2 pl-2">
        {[
          { key: 'term1', label: t('term1') },
          { key: 'term2', label: t('term2') },
          { key: 'term3', label: t('term3') },
          { key: 'term4', label: t('term4') },
        ].map((term) => (
          <div key={term.key} className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={terms[term.key as keyof TermsAgreement]}
                onChange={() => onTermChange(term.key as keyof TermsAgreement)}
                className="w-4 h-4 rounded border-slate-300 accent-sky-600"
              />
              <span className="text-xs text-slate-600">{term.label}</span>
            </label>
            <button
              type="button"
              onClick={() => onViewTerm(term.key)}
              className="text-xs text-slate-400 underline hover:text-slate-600 cursor-pointer p-1"
            >
              {t('view')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
