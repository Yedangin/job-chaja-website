'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plane,
  CheckCircle,
  ArrowLeft,
  Shield,
  FileText,
  MessageSquare,
  Clock,
  Star,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StripeCheckoutButton from '@/components/stripe/StripeCheckoutButton';

/**
 * 유료 진단 페이지 / Paid Diagnosis Page
 *
 * 무료 진단 대비 유료 전문 상담 서비스의 혜택을 설명하고,
 * Stripe 결제를 통해 전문 상담을 구매할 수 있는 페이지입니다.
 *
 * Explains the benefits of the paid professional consultation service
 * compared to the free diagnosis, and allows purchasing via Stripe.
 */

// 무료 vs 유료 비교 항목 / Free vs Paid comparison items
const comparisonItems = [
  {
    feature: 'AI 비자 경로 추천 / AI Visa Pathway Recommendation',
    free: true,
    paid: true,
  },
  {
    feature: '기본 경로 분석 (최대 3개) / Basic Pathway Analysis (up to 3)',
    free: true,
    paid: true,
  },
  {
    feature: '상세 경로 분석 (모든 경로) / Detailed Pathway Analysis (all pathways)',
    free: false,
    paid: true,
  },
  {
    feature: '비자 서류 준비 가이드 / Visa Document Preparation Guide',
    free: false,
    paid: true,
  },
  {
    feature: '1:1 전문가 Q&A (이메일) / 1:1 Expert Q&A (email)',
    free: false,
    paid: true,
  },
  {
    feature: '맞춤 타임라인 / Customized Timeline',
    free: false,
    paid: true,
  },
  {
    feature: '비용 산출 상세표 / Detailed Cost Breakdown',
    free: false,
    paid: true,
  },
  {
    feature: '우선 처리 / Priority Processing',
    free: false,
    paid: true,
  },
];

export default function PaidDiagnosisPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // 이메일 유효성 검사 / Email validation
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('이메일을 입력해주세요. / Please enter your email.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('올바른 이메일 형식이 아닙니다. / Invalid email format.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) validateEmail(value);
    else setEmailError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 뒤로가기 / Back button */}
        <Link href="/diagnosis">
          <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            무료 진단으로 돌아가기 / Back to Free Diagnosis
          </Button>
        </Link>

        {/* 히어로 섹션 / Hero section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4" />
            Professional Consultation
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            전문 비자 상담 서비스
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI 진단을 넘어, 전문가의 1:1 맞춤 비자 상담을 받아보세요.
            <br />
            성공적인 한국 비자 여정의 시작입니다.
          </p>
          <p className="text-lg text-gray-500 mt-2 max-w-2xl mx-auto">
            Go beyond AI diagnosis with personalized 1:1 expert visa consultation.
            <br />
            The beginning of your successful Korea visa journey.
          </p>
        </div>

        {/* 가격 카드 / Pricing card */}
        <Card className="max-w-lg mx-auto mb-12 overflow-hidden shadow-2xl border-0">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white text-center">
            <Plane className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <p className="text-sm opacity-80 mb-2">Professional Visa Consultation</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold">49,900</span>
              <span className="text-xl">원</span>
            </div>
            <p className="text-sm opacity-70 mt-2">1회 결제 / One-time payment</p>
          </div>

          <div className="p-8">
            {/* 주요 혜택 / Key benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">상세 서류 준비 가이드</p>
                  <p className="text-sm text-gray-500">
                    Detailed document preparation guide
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">1:1 전문가 Q&A</p>
                  <p className="text-sm text-gray-500">
                    1:1 expert Q&A via email
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">맞춤 타임라인 제공</p>
                  <p className="text-sm text-gray-500">
                    Customized timeline for your visa pathway
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">우선 처리</p>
                  <p className="text-sm text-gray-500">
                    Priority processing for faster results
                  </p>
                </div>
              </div>
            </div>

            {/* 이메일 입력 / Email input */}
            <div className="mb-6">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                결제 이메일 / Payment Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => validateEmail(email)}
                placeholder="your@email.com"
                className="h-12 text-base"
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                결제 확인 및 상담 결과가 이 이메일로 전송됩니다.
                <br />
                Payment confirmation and consultation results will be sent to this email.
              </p>
            </div>

            {/* Stripe 결제 버튼 / Stripe checkout button */}
            <StripeCheckoutButton
              email={email}
              diagnosisType="PROFESSIONAL"
              disabled={!email || !!emailError}
            >
              49,900원 결제하기 / Pay 49,900 KRW
            </StripeCheckoutButton>

            {/* 보안 안내 / Security notice */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <Shield className="w-4 h-4" />
              <span>
                Stripe 보안 결제 / Secure payment powered by Stripe
              </span>
            </div>
          </div>
        </Card>

        {/* 무료 vs 유료 비교표 / Free vs Paid comparison table */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            무료 진단 vs 전문 상담
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Free Diagnosis vs Professional Consultation
          </p>

          <Card className="overflow-hidden shadow-lg">
            {/* 테이블 헤더 / Table header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b">
              <div className="p-4 font-semibold text-gray-700">기능 / Feature</div>
              <div className="p-4 text-center font-semibold text-gray-700">
                무료 / Free
              </div>
              <div className="p-4 text-center font-semibold text-purple-700 bg-purple-50">
                전문 상담 / Professional
              </div>
            </div>

            {/* 테이블 행 / Table rows */}
            {comparisonItems.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 border-b last:border-b-0 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <div className="p-4 text-sm text-gray-700">{item.feature}</div>
                <div className="p-4 text-center">
                  {item.free ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </div>
                <div className="p-4 text-center bg-purple-50/30">
                  {item.paid ? (
                    <CheckCircle className="w-5 h-5 text-purple-600 mx-auto" />
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* 하단 CTA / Bottom CTA */}
        <div className="text-center pb-8">
          <p className="text-gray-500 mb-4">
            궁금한 점이 있으신가요? / Have questions?
          </p>
          <Link href="/diagnosis">
            <Button variant="outline" size="lg">
              먼저 무료 진단 받아보기 / Try Free Diagnosis First
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
