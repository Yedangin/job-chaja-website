import { useLanguage } from '@/i18n/LanguageProvider';
import Link from 'next/link';
import type { TermsAgreement } from '../types/auth.types';

interface TermsAgreementProps {
  terms: TermsAgreement;
  onTermChange: (key: keyof TermsAgreement) => void;
  onAllTermsChange: (checked: boolean) => void;
  isAllChecked: boolean;
}

/**
 * 약관 동의 체크박스 UI
 */
export function TermsAgreementComponent({
  terms,
  onTermChange,
  onAllTermsChange,
  isAllChecked,
}: TermsAgreementProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Required agreements only; optional marketing remains a free choice. */}
      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
        <input
          type="checkbox"
          checked={isAllChecked}
          onChange={(e) => onAllTermsChange(e.target.checked)}
          className="w-5 h-5 rounded border-slate-300 accent-sky-600"
        />
        <span className="text-sm font-bold text-slate-800">필수 약관 모두 동의</span>
      </label>

      {/* 개별 약관 */}
      <div className="space-y-2 pl-2">
        {[
          { key: 'term1', label: t('term1'), href: '/terms-and-conditions' },
          { key: 'term2', label: t('term2'), href: '/privacy-policy' },
          { key: 'term3', label: t('term3'), href: '/privacy-policy#privacy-section-5' },
          { key: 'term4', label: t('term4'), href: '/privacy-policy' },
          { key: 'term5', label: '[필수] 만 18세 이상입니다', hideView: true },
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
            {!term.hideView && (
              <Link
                href={term.href || '/privacy-policy'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 underline hover:text-slate-600 cursor-pointer p-1"
              >
                {t('view')}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
