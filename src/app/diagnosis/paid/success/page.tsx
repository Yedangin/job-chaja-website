'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, ArrowRight, Plane, FileText, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * 결제 성공 페이지 / Payment Success Page
 *
 * Stripe 체크아웃 완료 후 리다이렉트되는 페이지입니다.
 * 결제 확인 정보와 다음 단계를 안내합니다.
 *
 * This page is where users are redirected after completing Stripe checkout.
 * It displays payment confirmation and next steps.
 *
 * URL 파라미터 / URL parameter:
 * - session_id: Stripe 체크아웃 세션 ID / Stripe Checkout Session ID
 */

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [showConfetti, setShowConfetti] = useState(true);

  // 축하 애니메이션 타이머 / Confetti animation timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-white py-12 px-4">
      {/* 축하 애니메이션 오버레이 / Confetti animation overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center animate-[scaleIn_0.5s_ease-out]">
            <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '1s' }}>
              &#x1F389;
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* 성공 카드 / Success card */}
        <Card className="overflow-hidden shadow-2xl border-0 mb-8">
          {/* 상단 그라데이션 / Top gradient */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">결제가 완료되었습니다!</h1>
            <p className="text-green-100 text-lg">Payment Completed Successfully!</p>
          </div>

          <div className="p-8">
            {/* 결제 확인 정보 / Payment confirmation info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">결제 정보 / Payment Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">상품 / Product</span>
                  <span className="font-medium">전문 비자 상담 / Professional Visa Consultation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">결제 금액 / Amount</span>
                  <span className="font-medium">49,900원 / 49,900 KRW</span>
                </div>
                {sessionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">세션 ID / Session ID</span>
                    <span className="font-mono text-xs text-gray-400 truncate max-w-[200px]">
                      {sessionId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 다음 단계 안내 / Next steps */}
            <h2 className="font-bold text-lg text-gray-900 mb-4">
              다음 단계 / Next Steps
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">이메일 확인 / Check Your Email</p>
                  <p className="text-sm text-gray-500">
                    결제 확인 이메일이 발송되었습니다. 스팸 폴더도 확인해주세요.
                    <br />
                    A payment confirmation email has been sent. Please check your spam folder too.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    상담 자료 준비 / Consultation Materials Preparation
                  </p>
                  <p className="text-sm text-gray-500">
                    전문가가 맞춤 상담 자료를 준비합니다 (1-2 영업일 소요).
                    <br />
                    Our experts will prepare customized consultation materials (1-2 business days).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    상담 결과 수신 / Receive Consultation Results
                  </p>
                  <p className="text-sm text-gray-500">
                    이메일로 상세한 비자 경로 분석, 서류 가이드, 타임라인을 보내드립니다.
                    <br />
                    Detailed visa pathway analysis, document guide, and timeline will be sent to your email.
                  </p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 / Action buttons */}
            <div className="space-y-3">
              <Link href="/diagnosis" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 py-6 text-lg">
                  <Plane className="w-5 h-5 mr-2" />
                  무료 진단도 받아보기 / Try Free Diagnosis Too
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full py-5">
                  홈으로 돌아가기 / Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* 문의 안내 / Contact info */}
        <div className="text-center text-sm text-gray-400">
          <p>
            결제 관련 문의사항이 있으시면 고객센터로 연락해주세요.
            <br />
            If you have any payment-related inquiries, please contact our support team.
          </p>
        </div>
      </div>

      {/* 애니메이션 스타일 / Animation styles */}
      <style jsx global>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
