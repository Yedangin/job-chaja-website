import { normalizeLocale, toIntlLocale, type LocaleInput } from './locales';

export type DateValue = Date | string | number;

function asDate(value: DateValue): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(
  value: DateValue,
  locale: LocaleInput = 'en',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
): string {
  const date = asDate(value);
  return date ? new Intl.DateTimeFormat(toIntlLocale(locale), options).format(date) : '';
}

export function formatDateTime(
  value: DateValue,
  locale: LocaleInput = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
): string {
  return formatDate(value, locale, options);
}

export function formatNumber(
  value: number,
  locale: LocaleInput = 'en',
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(toIntlLocale(locale), options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string,
  locale: LocaleInput = 'en',
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>,
): string {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    ...options,
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(value);
}

export function createI18nFormatter(locale: LocaleInput) {
  const canonicalLocale = normalizeLocale(locale);

  return {
    locale: canonicalLocale,
    intlLocale: toIntlLocale(canonicalLocale),
    date: (value: DateValue, options?: Intl.DateTimeFormatOptions) =>
      formatDate(value, canonicalLocale, options),
    dateTime: (value: DateValue, options?: Intl.DateTimeFormatOptions) =>
      formatDateTime(value, canonicalLocale, options),
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, canonicalLocale, options),
    currency: (
      value: number,
      currency: string,
      options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>,
    ) => formatCurrency(value, currency, canonicalLocale, options),
  };
}
