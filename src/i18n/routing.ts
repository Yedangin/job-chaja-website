import { defineRouting } from 'next-intl/routing';
import { DEFAULT_LOCALE, LAUNCH_LOCALES } from './locales';

export const routing = defineRouting({
  locales: LAUNCH_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
});
