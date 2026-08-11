import ko from './ko';
import en from './en';
import ja from './ja';
import vi from './vi';
import th from './th';
import tl from './tl';
import fil from './fil';
import type { LaunchLocale } from '../locales';
import type { CatalogMessageKey } from '../catalogs';

export const uiMessages = {
  ko,
  en,
  vi,
  th,
  fil,
} satisfies Record<LaunchLocale, typeof en>;

// Compatibility exports only. They are not release locales.
export const legacyUiMessages = { kr: ko, tl, ja };
export { ja, tl };

export type UILang = LaunchLocale;
export type LegacyUILang = keyof typeof legacyUiMessages;
export type UIMessageKey = keyof typeof en | CatalogMessageKey;
