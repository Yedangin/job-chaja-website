'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  uiMessages,
  type LegacyUILang,
  type UILang,
  type UIMessageKey,
} from '@/i18n/ui';
import {
  resolveContentCatalogMessage,
  resolveUiCatalogMessage,
  type CatalogMessageKey,
} from '@/i18n/catalogs';
import {
  getUiFallbackChain,
  normalizeLocale,
  type LocaleInput,
} from '@/i18n/locales';

export type Lang = UILang | LegacyUILang;

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: UIMessageKey) => string;
  tContent: (key: CatalogMessageKey) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);
const LANGUAGE_STORAGE_KEY = 'lang';

const getBrowserLang = (): UILang => {
  if (typeof window === 'undefined') return 'en';
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  return normalizeLocale(candidates[0]);
};

function getFlatUiMessage(locale: UILang, key: UIMessageKey): string | undefined {
  const messages = uiMessages[locale] as Record<string, string>;
  return messages[key] || undefined;
}

function resolveFlatUiMessage(locale: LocaleInput, key: UIMessageKey): string | undefined {
  for (const candidate of getUiFallbackChain(locale)) {
    const value = getFlatUiMessage(candidate, key);
    if (value) return value;
  }

  return undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<UILang>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const canonical = savedLang ? normalizeLocale(savedLang) : getBrowserLang();
    setLangState(canonical);

    // Migrate kr -> ko and tl -> fil. Unsupported ja is retained only as an import.
    if (savedLang !== canonical) localStorage.setItem(LANGUAGE_STORAGE_KEY, canonical);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang: Lang) => {
    const canonical = normalizeLocale(newLang);
    setLangState(canonical);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, canonical);
  };

  const t = (key: UIMessageKey): string => {
    const flat = resolveFlatUiMessage(lang, key);
    if (flat) return flat;

    return resolveUiCatalogMessage(lang, key as CatalogMessageKey) || key;
  };

  const tContent = (key: CatalogMessageKey): string => {
    return resolveContentCatalogMessage(lang, key) || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tContent }}>
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
