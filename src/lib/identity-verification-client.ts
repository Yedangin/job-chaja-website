import * as PortOne from '@portone/browser-sdk/v2';

export interface IdentitySummary {
  verified: boolean;
  name?: string;
  phoneMasked?: string | null;
  verifiedAt?: string;
  provider?: 'DANAL';
}

export interface IdentityAttempt {
  storeId: string;
  channelKey: string;
  identityVerificationId: string;
  state: string;
  redirectUrl: string;
  bypass: { danal: { CPTITLE: string } };
  expiresAt: string;
  appLaunchUrl: string;
}

export interface PendingIdentityAttempt {
  identityVerificationId: string;
  state: string;
  returnPath: string;
  clientPlatform: 'WEB' | 'APP';
}

export const IDENTITY_PENDING_KEY = 'jobchaja.identity.pending.v1';

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as {
    message?: string | string[];
  };
  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message;
    throw new Error(message || 'Identity verification request failed');
  }
  return data as T;
}

export async function getIdentityConfiguration(): Promise<{
  enabled: boolean;
  provider: 'DANAL';
  consentPolicyVersion: string;
}> {
  return readJson(
    await fetch('/api/identity-verifications/config', {
      credentials: 'include',
      cache: 'no-store',
    }),
  );
}

export async function getMyIdentity(): Promise<IdentitySummary> {
  return readJson(
    await fetch('/api/identity-verifications/me', {
      credentials: 'include',
      cache: 'no-store',
    }),
  );
}

export async function createIdentityAttempt(
  clientPlatform: 'WEB' | 'APP',
): Promise<IdentityAttempt> {
  return readJson(
    await fetch('/api/identity-verifications/attempts', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purpose: 'CORPORATE_MANAGER',
        clientPlatform,
        consented: true,
      }),
    }),
  );
}

export async function completeIdentityAttempt(
  identityVerificationId: string,
  state: string,
): Promise<IdentitySummary> {
  return readJson(
    await fetch('/api/identity-verifications/complete', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identityVerificationId, state }),
    }),
  );
}

export async function requestWebIdentityVerification(
  attempt: IdentityAttempt,
  returnPath: string,
): Promise<IdentitySummary | null> {
  const pending: PendingIdentityAttempt = {
    identityVerificationId: attempt.identityVerificationId,
    state: attempt.state,
    returnPath,
    clientPlatform: 'WEB',
  };
  sessionStorage.setItem(IDENTITY_PENDING_KEY, JSON.stringify(pending));

  const response = await PortOne.requestIdentityVerification({
    storeId: attempt.storeId,
    channelKey: attempt.channelKey,
    identityVerificationId: attempt.identityVerificationId,
    redirectUrl: attempt.redirectUrl,
    bypass: attempt.bypass,
  });
  if (!response) return null;
  if (response.code) {
    sessionStorage.removeItem(IDENTITY_PENDING_KEY);
    throw new Error(response.message || 'Identity verification was cancelled');
  }
  if (response.identityVerificationId !== attempt.identityVerificationId) {
    sessionStorage.removeItem(IDENTITY_PENDING_KEY);
    throw new Error('Identity verification response did not match the request');
  }

  const result = await completeIdentityAttempt(
    attempt.identityVerificationId,
    attempt.state,
  );
  sessionStorage.removeItem(IDENTITY_PENDING_KEY);
  return result;
}

export function readPendingIdentityAttempt(): PendingIdentityAttempt | null {
  const raw = sessionStorage.getItem(IDENTITY_PENDING_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PendingIdentityAttempt;
    if (
      !parsed.identityVerificationId ||
      !parsed.state ||
      !parsed.returnPath
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
