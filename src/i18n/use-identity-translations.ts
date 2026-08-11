'use client';

import { useCallback } from 'react';
import type { CatalogMessageKey } from '@/i18n/catalogs';
import { useLanguage } from '@/i18n/LanguageProvider';

export type IdentityTranslationKey =
  | 'action'
  | 'checking'
  | 'consent'
  | 'description'
  | 'expired'
  | 'failed'
  | 'mismatch'
  | 'mobileDescription'
  | 'notConfigured'
  | 'opening'
  | 'retry'
  | 'returning'
  | 'serverCheck'
  | 'success'
  | 'title'
  | 'verified'
  | 'verifiedDescription';

export function useIdentityTranslations() {
  const { tContent } = useLanguage();
  return useCallback(
    (key: IdentityTranslationKey) =>
      tContent(`IdentityVerification.${key}` as CatalogMessageKey),
    [tContent],
  );
}
