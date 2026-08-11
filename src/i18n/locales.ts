export const LAUNCH_LOCALES = ['ko', 'en', 'vi', 'th', 'fil'] as const;

export type LaunchLocale = (typeof LAUNCH_LOCALES)[number];
export type LegacyLocale = 'kr' | 'tl' | 'ja';
export type LocaleInput = LaunchLocale | LegacyLocale | string | null | undefined;

export const DEFAULT_LOCALE: LaunchLocale = 'en';
export const UI_FALLBACK_LOCALE: LaunchLocale = 'en';

// Long-form content falls back to reviewed English first, then Korean source copy.
export const CONTENT_FALLBACK_ORDER = ['en', 'ko'] as const satisfies readonly LaunchLocale[];

export const INTL_LOCALE_MAP: Record<LaunchLocale, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  vi: 'vi-VN',
  th: 'th-TH',
  fil: 'fil-PH',
};

const LEGACY_ALIASES: Record<string, LaunchLocale> = {
  kr: 'ko',
  tl: 'fil',
};

export function isLaunchLocale(value: unknown): value is LaunchLocale {
  return typeof value === 'string' && LAUNCH_LOCALES.includes(value as LaunchLocale);
}

export function normalizeLocale(value: LocaleInput): LaunchLocale {
  if (!value) return DEFAULT_LOCALE;

  const normalized = String(value).trim().toLowerCase().replace('_', '-');
  const base = normalized.split('-')[0];
  const aliased = LEGACY_ALIASES[normalized] ?? LEGACY_ALIASES[base] ?? base;

  return isLaunchLocale(aliased) ? aliased : DEFAULT_LOCALE;
}

export function toIntlLocale(value: LocaleInput): string {
  return INTL_LOCALE_MAP[normalizeLocale(value)];
}

export function getUiFallbackChain(value: LocaleInput): LaunchLocale[] {
  return uniqueLocales([normalizeLocale(value), UI_FALLBACK_LOCALE]);
}

export function getContentFallbackChain(value: LocaleInput): LaunchLocale[] {
  return uniqueLocales([normalizeLocale(value), ...CONTENT_FALLBACK_ORDER]);
}

function uniqueLocales(locales: readonly LaunchLocale[]): LaunchLocale[] {
  return locales.filter((locale, index) => locales.indexOf(locale) === index);
}
