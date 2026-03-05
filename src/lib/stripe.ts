import { loadStripe, type Stripe } from '@stripe/stripe-js';

/**
 * Stripe 클라이언트 초기화 / Stripe client initialization
 *
 * 클라이언트 사이드에서만 사용되는 Stripe 인스턴스를 싱글턴으로 관리합니다.
 * Manages a singleton Stripe instance used only on the client side.
 *
 * 환경변수 / Environment variables:
 * - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Stripe 퍼블리셔블 키 (클라이언트용)
 */

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Stripe 인스턴스를 반환합니다 (싱글턴 패턴).
 * Returns the Stripe instance (singleton pattern).
 *
 * 이 함수는 클라이언트 사이드에서만 호출해야 합니다.
 * This function should only be called on the client side.
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error(
        '[Stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 환경변수가 설정되지 않았습니다. / Environment variable not set.',
      );
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}
