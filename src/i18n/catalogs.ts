import legacyEnglish from '../../messages/en.json';
import legacyKorean from '../../messages/kr.json';
import en from '../../messages/catalogs/en.json';
import ko from '../../messages/catalogs/ko.json';
import vi from '../../messages/catalogs/vi.json';
import th from '../../messages/catalogs/th.json';
import fil from '../../messages/catalogs/fil.json';
import {
  getContentFallbackChain,
  getUiFallbackChain,
  normalizeLocale,
  type LaunchLocale,
  type LocaleInput,
} from './locales';

export const canonicalCatalogs = { ko, en, vi, th, fil } as const;

type DotPath<T> = {
  [Key in keyof T & string]: T[Key] extends Record<string, unknown>
    ? `${Key}.${DotPath<T[Key]>}`
    : Key;
}[keyof T & string];

export type CatalogMessageKey = DotPath<typeof en>;

function getByPath(source: unknown, path: string): string | undefined {
  let current: unknown = source;

  for (const segment of path.split('.')) {
    if (!current || typeof current !== 'object' || !(segment in current)) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === 'string' ? current : undefined;
}

function resolveFromChain(
  chain: readonly LaunchLocale[],
  key: CatalogMessageKey,
): string | undefined {
  for (const locale of chain) {
    const value = getByPath(canonicalCatalogs[locale], key);
    if (value) return value;
  }
  return undefined;
}

export function resolveUiCatalogMessage(
  locale: LocaleInput,
  key: CatalogMessageKey,
): string | undefined {
  return resolveFromChain(getUiFallbackChain(locale), key);
}

export function resolveContentCatalogMessage(
  locale: LocaleInput,
  key: CatalogMessageKey,
): string | undefined {
  return resolveFromChain(getContentFallbackChain(locale), key);
}

type JsonObject = Record<string, unknown>;

function deepMerge(target: JsonObject, source: JsonObject): JsonObject {
  const result: JsonObject = { ...target };

  for (const [key, value] of Object.entries(source)) {
    const previous = result[key];
    if (
      value
      && typeof value === 'object'
      && !Array.isArray(value)
      && previous
      && typeof previous === 'object'
      && !Array.isArray(previous)
    ) {
      result[key] = deepMerge(previous as JsonObject, value as JsonObject);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Keeps the existing en/kr catalog available while canonical locale catalogs
 * are adopted route by route. Unreviewed long-form content falls back en -> ko.
 */
export function getIntlMessages(locale: LocaleInput): JsonObject {
  const canonical = normalizeLocale(locale);
  const englishFirstBase = deepMerge(legacyKorean as JsonObject, legacyEnglish as JsonObject);
  const localizedBase = canonical === 'ko'
    ? deepMerge(legacyEnglish as JsonObject, legacyKorean as JsonObject)
    : englishFirstBase;

  return deepMerge(localizedBase, canonicalCatalogs[canonical] as JsonObject);
}
