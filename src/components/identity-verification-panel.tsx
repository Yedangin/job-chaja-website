'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  createIdentityAttempt,
  getIdentityConfiguration,
  getMyIdentity,
  IdentitySummary,
  requestWebIdentityVerification,
} from '@/lib/identity-verification-client';
import { useIdentityTranslations } from '@/i18n/use-identity-translations';

interface IdentityVerificationPanelProps {
  returnPath: string;
  onVerified?: (summary: IdentitySummary) => void;
}

export function IdentityVerificationPanel({
  returnPath,
  onVerified,
}: IdentityVerificationPanelProps) {
  const t = useIdentityTranslations();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [consented, setConsented] = useState(false);
  const [summary, setSummary] = useState<IdentitySummary>({ verified: false });
  const onVerifiedRef = useRef(onVerified);

  useEffect(() => {
    onVerifiedRef.current = onVerified;
  }, [onVerified]);

  useEffect(() => {
    let active = true;
    Promise.all([getIdentityConfiguration(), getMyIdentity()])
      .then(([configuration, identity]) => {
        if (!active) return;
        setEnabled(configuration.enabled);
        setSummary(identity);
        if (identity.verified) onVerifiedRef.current?.(identity);
      })
      .catch(() => {
        if (active) setEnabled(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const verify = async () => {
    if (!consented || submitting) return;
    setSubmitting(true);
    try {
      const attempt = await createIdentityAttempt('WEB');
      const result = await requestWebIdentityVerification(attempt, returnPath);
      if (!result) return;
      setSummary(result);
      onVerified?.(result);
      toast.success(t('success'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-gray-600">{t('checking')}</span>
      </div>
    );
  }

  if (summary.verified) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-emerald-900">{t('verified')}</p>
            <p className="mt-1 text-sm text-emerald-800">
              {summary.name}
              {summary.phoneMasked ? ` · ${summary.phoneMasked}` : ''}
            </p>
            <p className="mt-1 text-xs leading-5 text-emerald-700">
              {t('verifiedDescription')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900">{t('title')}</p>
          <p className="mt-1 text-xs leading-5 text-gray-600">{t('description')}</p>
          {!enabled && (
            <p className="mt-3 rounded-md bg-white px-3 py-2 text-xs text-amber-700">
              {t('notConfigured')}
            </p>
          )}
          {enabled && (
            <>
              <label className="mt-4 flex cursor-pointer items-start gap-2">
                <Checkbox
                  checked={consented}
                  onCheckedChange={(value) => setConsented(value === true)}
                  aria-label={t('consent')}
                  className="mt-0.5"
                />
                <span className="text-xs leading-5 text-gray-700">{t('consent')}</span>
              </label>
              <Button
                type="button"
                onClick={verify}
                disabled={!consented || submitting}
                className="mt-4 h-10 w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitting ? t('opening') : t('action')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
