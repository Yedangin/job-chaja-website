'use client';

import { useEffect, useState } from 'react';
import * as PortOne from '@portone/browser-sdk/v2';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  completeIdentityAttempt,
  IDENTITY_PENDING_KEY,
  PendingIdentityAttempt,
} from '@/lib/identity-verification-client';
import { useIdentityTranslations } from '@/i18n/use-identity-translations';

interface BridgeConfiguration {
  storeId: string;
  channelKey: string;
  identityVerificationId: string;
  state: string;
  redirectUrl: string;
  bypass: { danal: { CPTITLE: string } };
}

export default function MobileIdentityVerificationPage() {
  const t = useIdentityTranslations();
  const [configuration, setConfiguration] = useState<BridgeConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadConfiguration = async () => {
      try {
        const params = new URLSearchParams(window.location.hash.slice(1));
        const identityVerificationId = params.get('identityVerificationId') || '';
        const state = params.get('state') || '';
        if (
          !/^[A-Za-z0-9_-]{10,80}$/.test(identityVerificationId) ||
          !/^[A-Za-z0-9_-]{40,100}$/.test(state)
        ) {
          throw new Error(t('expired'));
        }

        const response = await fetch('/api/identity-verifications/bridge-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identityVerificationId, state }),
          cache: 'no-store',
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.message || t('failed'));
        if (active) setConfiguration(body as BridgeConfiguration);
      } catch (reason) {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : t('failed'));
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadConfiguration();
    return () => {
      active = false;
    };
  }, [t]);

  const openVerification = async () => {
    if (!configuration || opening) return;
    setOpening(true);
    setError('');
    const pending: PendingIdentityAttempt = {
      identityVerificationId: configuration.identityVerificationId,
      state: configuration.state,
      returnPath: 'jobchaja://identity-verification/callback',
      clientPlatform: 'APP',
    };
    sessionStorage.setItem(IDENTITY_PENDING_KEY, JSON.stringify(pending));
    try {
      const response = await PortOne.requestIdentityVerification({
        storeId: configuration.storeId,
        channelKey: configuration.channelKey,
        identityVerificationId: configuration.identityVerificationId,
        redirectUrl: configuration.redirectUrl,
        forceRedirect: true,
        bypass: configuration.bypass,
      });
      if (!response) return;
      if (response.code) throw new Error(response.message || t('failed'));
      const result = await completeIdentityAttempt(
        configuration.identityVerificationId,
        configuration.state,
      );
      if (!result.verified) throw new Error(t('failed'));
      sessionStorage.removeItem(IDENTITY_PENDING_KEY);
      window.location.replace(
        'jobchaja://identity-verification/callback?status=verified',
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('failed'));
      setOpening(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
      <section className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ShieldCheck className="h-9 w-9 text-blue-700" />
        <h1 className="mt-4 text-xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">{t('mobileDescription')}</p>
        {loading && (
          <div className="mt-6 flex items-center text-sm text-gray-600">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('checking')}
          </div>
        )}
        {error && (
          <p className="mt-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <Button
          type="button"
          disabled={!configuration || opening}
          onClick={openVerification}
          className="mt-6 h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {opening && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {opening ? t('opening') : t('action')}
        </Button>
      </section>
    </main>
  );
}
