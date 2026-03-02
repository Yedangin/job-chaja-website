'use client';

/**
 * 프리미엄 진단 체크아웃 페이지 / Premium diagnosis checkout page
 * Stripe 결제 동의 → 결제 → 결과 페이지로 이동
 * Consent → Stripe checkout → redirect to result
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  BarChart3,
  RefreshCw,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PremiumCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [agreed, setAgreed] = useState({
    refundPolicy: false,
    digitalContent: false,
    privacy: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sessionId 없으면 진단 페이지로 / Redirect if no sessionId
  useEffect(() => {
    if (!sessionId) {
      router.replace('/diagnosis');
    }
  }, [sessionId, router]);

  const allAgreed = agreed.refundPolicy && agreed.digitalContent && agreed.privacy;

  // Stripe 체크아웃 시작 / Start Stripe checkout
  const handleCheckout = async () => {
    if (!allAgreed || !sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/visa-planner/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          diagnosisSessionId: sessionId,
          successUrl: `${window.location.origin}/diagnosis/premium/verify`,
          cancelUrl: `${window.location.origin}/diagnosis/premium?sessionId=${sessionId}`,
          refundPolicyAgreed: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `결제 세션 생성 실패 (${res.status})`);
      }

      const data = await res.json();
      if (data.checkoutUrl) {
        // sessionId 저장 후 Stripe로 이동 / Save sessionId then redirect to Stripe
        sessionStorage.setItem('premium-sessionId', sessionId);
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('체크아웃 URL을 받지 못했습니다');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '결제 처리 중 오류가 발생했습니다');
      setIsLoading(false);
    }
  };

  if (!sessionId) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* 뒤로가기 / Back */}
        <Link
          href="/diagnosis/result"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          무료 진단 결과로 돌아가기
        </Link>

        {/* 상품 설명 / Product description */}
        <Card className="p-6 mb-6 border-indigo-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">프리미엄 정밀 분석</h1>
            <p className="text-sm text-gray-500">Premium Visa Pathway Analysis</p>
          </div>

          {/* 포함 항목 / Included features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
              <BarChart3 className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">트랙별 세분화 점수 분석</p>
                <p className="text-xs text-gray-500">대학 순위, 경력, 자격증, 학력-경력 매칭 보정</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">What-If 시뮬레이션</p>
                <p className="text-xs text-gray-500">TOPIK 상승, 자격증 취득 시 점수 변화 예측</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">비자별 예상 연수입</p>
                <p className="text-xs text-gray-500">통계청 기반 비자 유형별 평균 연수입 참조</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
              <RefreshCw className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">6개월 후 무료 재진단</p>
                <p className="text-xs text-gray-500">상황 변경 후 무료로 다시 분석 가능</p>
              </div>
            </div>
          </div>

          {/* 가격 / Price */}
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <span className="text-3xl font-bold text-gray-900">$10</span>
            <span className="text-sm text-gray-500 ml-1">USD</span>
            <p className="text-xs text-gray-400 mt-1">일회성 결제 · 추가 요금 없음</p>
          </div>
        </Card>

        {/* 동의 항목 / Consent checkboxes */}
        <Card className="p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            결제 전 동의사항
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed.refundPolicy}
                onChange={(e) => setAgreed(prev => ({ ...prev, refundPolicy: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="text-sm text-gray-700 group-hover:text-gray-900">
                  <span className="text-red-500">[필수]</span> 환불 규정에 동의합니다
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  결과 미조회 시 전액 환불 · 결과 조회 후 환불 불가
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed.digitalContent}
                onChange={(e) => setAgreed(prev => ({ ...prev, digitalContent: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="text-sm text-gray-700 group-hover:text-gray-900">
                  <span className="text-red-500">[필수]</span> 디지털 콘텐츠 제공에 동의합니다
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  결제 후 즉시 결과 제공 (청약 철회 제한)
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed.privacy}
                onChange={(e) => setAgreed(prev => ({ ...prev, privacy: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="text-sm text-gray-700 group-hover:text-gray-900">
                  <span className="text-red-500">[필수]</span> 개인정보 처리 동의
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  진단 결과 생성을 위한 입력 정보 처리
                </p>
              </div>
            </label>
          </div>
        </Card>

        {/* 에러 메시지 / Error message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* 결제 버튼 / Payment button */}
        <Button
          size="lg"
          disabled={!allAgreed || isLoading}
          onClick={handleCheckout}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              결제 페이지로 이동 중...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              $10 결제하기 (Stripe)
            </>
          )}
        </Button>

        {/* 보안 안내 / Security notice */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <p className="text-xs text-gray-400">Stripe 보안 결제 · SSL 암호화</p>
        </div>
      </div>
    </div>
  );
}
