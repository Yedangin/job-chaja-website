import type { MemberType } from '../types/auth.types';

type AuthRole = number | 'INDIVIDUAL' | 'CORPORATE' | 'ADMIN' | null | undefined;

/**
 * 내부 경로만 허용하여 인증 후 오픈 리다이렉트를 방지합니다.
 * Allows internal paths only to prevent open redirects after authentication.
 */
export function getSafeInternalPath(candidate: string | null | undefined): string | null {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\')) {
    return null;
  }

  try {
    const origin = typeof window === 'undefined' ? 'https://jobchaja.local' : window.location.origin;
    const target = new URL(candidate, origin);
    if (target.origin !== origin) return null;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return null;
  }
}

/**
 * 역할과 가입 여부에 맞는 다음 작업으로 연결합니다.
 * Routes each role to the next meaningful onboarding action.
 */
export function getPostAuthRoute(options: {
  explicitPath?: string | null;
  role?: AuthRole;
  memberType?: MemberType;
  isNewAccount?: boolean;
}): string {
  const explicitPath = getSafeInternalPath(options.explicitPath);
  if (explicitPath && explicitPath !== '/') return explicitPath;

  const isAdmin = options.role === 5 || options.role === 'ADMIN';
  const isCorporate = options.role === 4 || options.role === 'CORPORATE' || options.memberType === 'company';
  const isIndividual = options.role === 3 || options.role === 'INDIVIDUAL' || options.memberType === 'seeker';

  if (isAdmin) return '/admin';
  if (isCorporate) return options.isNewAccount ? '/company/verification' : '/company/dashboard';
  if (isIndividual) {
    return options.isNewAccount ? '/worker/profile/setup' : '/worker/visa-journey';
  }
  return '/';
}
