import { useLanguage } from '@/i18n/LanguageProvider';
import type { MemberType } from '../types/auth.types';

interface MemberTypeTabsProps {
  value: MemberType;
  onChange: (type: MemberType) => void;
}

/**
 * 멤버 타입 탭 (구직자 / 회사)
 */
export function MemberTypeTabs({ value, onChange }: MemberTypeTabsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex gap-1 mb-6 p-1 bg-slate-200 rounded-xl">
      <button
        type="button"
        onClick={() => onChange('seeker')}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition ${
          value === 'seeker'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'bg-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        {t('tabSeeker')}
      </button>
      <button
        type="button"
        onClick={() => onChange('company')}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition ${
          value === 'company'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'bg-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        {t('tabCompany')}
      </button>
    </div>
  );
}
