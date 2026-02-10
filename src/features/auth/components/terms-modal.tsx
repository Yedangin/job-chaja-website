import { useLanguage } from '@/i18n/LanguageProvider';
import { termContents } from '../constants/auth.constants';

interface TermsModalProps {
  activeTerm: string | null;
  onClose: () => void;
}

/**
 * 약관 상세 내용 모달
 */
export function TermsModal({ activeTerm, onClose }: TermsModalProps) {
  const { t } = useLanguage();

  if (!activeTerm) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm">
            {t(activeTerm as any)}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="p-6 overflow-y-auto text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
          {termContents[activeTerm] || '약관 내용이 없습니다.'}
        </div>
      </div>
    </div>
  );
}
