'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { uiMessages, UILang, UIMessageKey } from '@/i18n/ui';

export type Lang = UILang;

type LanguageContextType = {
  lang: UILang;
  setLang: (lang: UILang) => void;
  t: (key: UIMessageKey) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const getBrowserLang = (): UILang => {
  if (typeof window === 'undefined') return 'en';

  const lang = navigator.language.slice(0, 2);

  if (lang === 'ko') return 'ko';
  if (lang === 'ja') return 'ja';
  if (lang === 'vi') return 'vi';
  if (lang === 'th') return 'th';
  if (lang === 'tl') return 'tl';

  return 'en';
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<UILang>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as UILang | null;
    setLangState(savedLang || getBrowserLang());
  }, []);

  const setLang = (newLang: UILang) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key: UIMessageKey): string => {
    return (
      uiMessages[lang]?.[key] ||
      uiMessages.en[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};
