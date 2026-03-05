'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Stripe 체크아웃 버튼 컴포넌트 / Stripe Checkout Button Component
 *
 * Stripe 체크아웃 세션을 생성하고 결제 페이지로 리다이렉트합니다.
 * Creates a Stripe Checkout Session and redirects to the payment page.
 *
 * Props:
 * - email: 사용자 이메일 (필수) / User email (required)
 * - userId: 사용자 ID (선택) / User ID (optional)
 * - diagnosisType: 진단 유형 (선택, 기본값: "PROFESSIONAL") / Diagnosis type (optional, default: "PROFESSIONAL")
 * - className: 추가 CSS 클래스 / Additional CSS classes
 * - children: 버튼 내용 / Button content
 * - disabled: 비활성화 여부 / Whether to disable the button
 */

interface StripeCheckoutButtonProps {
  email: string;
  userId?: string;
  diagnosisType?: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function StripeCheckoutButton({
  email,
  userId,
  diagnosisType = 'PROFESSIONAL',
  className,
  children,
  disabled = false,
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 체크아웃 세션 생성 및 리다이렉트 / Create checkout session and redirect
   */
  const handleCheckout = async () => {
    if (loading || !email) return;

    setLoading(true);
    setError(null);

    try {
      // 체크아웃 세션 생성 API 호출 / Call checkout session creation API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          userId,
          diagnosisType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || '결제 세션 생성에 실패했습니다. / Failed to create checkout session.',
        );
      }

      // Stripe 체크아웃 페이지로 리다이렉트 / Redirect to Stripe Checkout page
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(
          '결제 URL을 받지 못했습니다. / No checkout URL received.',
        );
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '결제 처리 중 오류가 발생했습니다. / Error during payment processing.';
      setError(message);
      console.error('[StripeCheckoutButton] 결제 오류 / Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleCheckout}
        disabled={disabled || loading || !email}
        className={cn(
          'w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all',
          className,
        )}
      >
        {loading
          ? '결제 페이지로 이동 중... / Redirecting to payment...'
          : children || '전문 상담 결제하기 / Pay for Professional Consultation'}
      </Button>

      {/* 에러 메시지 / Error message */}
      {error && (
        <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
