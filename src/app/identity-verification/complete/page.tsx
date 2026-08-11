'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import {
  completeIdentityAttempt,
  IDENTITY_PENDING_KEY,
  readPendingIdentityAttempt,
} from '@/lib/identity-verification-client';
import { useIdentityTranslations } from '@/i18n/use-identity-translations';

export default function IdentityVerificationCompletePage() {
  const t = useIdentityTranslations();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    const complete = async () => {
      try {
        const pending = readPendingIdentityAttempt();
        if (!pending) throw new Error(t('expired'));
        const returnedId = new URLSearchParams(window.location.search).get(
          'identityVerificationId',
        );
        if (returnedId && returnedId !== pending.identityVerificationId) {
          sessionStorage.removeItem(IDENTITY_PENDING_KEY);
          throw new Error(t('mismatch'));
        }

        const result = await completeIdentityAttempt(
          pending.identityVerificationId,
          pending.state,
        );
        if (!result.verified) throw new Error(t('failed'));
        sessionStorage.removeItem(IDENTITY_PENDING_KEY);
        if (!active) return;
        setStatus('success');
        if (pending.clientPlatform === 'APP') {
          window.location.replace(
            'jobchaja://identity-verification/callback?status=verified',
          );
          return;
        }
        const separator = pending.returnPath.includes('?') ? '&' : '?';
        window.setTimeout(
          () => router.replace(`${pending.returnPath}${separator}identityVerified=1`),
          700,
        );
      } catch (error) {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : t('failed'));
        setStatus('error');
      }
    };
    void complete();
    return () => {
      active = false;
    };
  }, [router, t]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
      <section className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-blue-600" />
            <h1 className="mt-4 text-lg font-bold text-gray-900">{t('checking')}</h1>
            <p className="mt-2 text-sm text-gray-500">{t('serverCheck')}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
            <h1 className="mt-4 text-lg font-bold text-gray-900">{t('verified')}</h1>
            <p className="mt-2 text-sm text-gray-500">{t('returning')}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="mx-auto h-10 w-10 text-red-500" />
            <h1 className="mt-4 text-lg font-bold text-gray-900">{t('failed')}</h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">{message}</p>
            <Link
              href="/company/verification"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-5 text-sm font-semibold text-white"
            >
              {t('retry')}
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
