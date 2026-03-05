'use client';

/**
 * 해외 사용자 랜딩 페이지 / International user landing page
 *
 * 한국 외 IP로 접속한 사용자에게 표시되는 페이지.
 * 비자 진단(Visa Diagnosis) 기능을 안내하고, 한국 사이트로 이동할 수 있는 옵션 제공.
 *
 * Displayed to users accessing from non-Korean IPs.
 * Guides users to the Visa Diagnosis feature and provides an option to continue to the Korean site.
 */

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Globe,
  FileSearch,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

/**
 * 바이패스 쿠키 설정 함수 / Set bypass cookie function
 *
 * 사용자가 "한국 사이트로 이동"을 선택했을 때 쿠키를 설정하여
 * 이후 지역 리다이렉트를 건너뛰도록 함 (30일 유효)
 *
 * Sets a cookie when user chooses "Continue to Korean Site"
 * so geo redirect is skipped on subsequent visits (valid for 30 days)
 */
function setBypassCookie() {
  const maxAge = 30 * 24 * 60 * 60; // 30일 / 30 days
  document.cookie = `bypass_geo_redirect=true; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * 서비스 특징 카드 데이터 / Feature card data
 */
const FEATURES = [
  {
    icon: FileSearch,
    title: 'Visa Diagnosis',
    description:
      'Answer a few simple questions and instantly find out which Korean work visas you may be eligible for.',
  },
  {
    icon: Briefcase,
    title: 'Job Matching',
    description:
      'Browse job listings from Korean employers who are actively hiring foreign workers with valid visas.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Guidance',
    description:
      'Understand Korean immigration rules and employment regulations so you can work legally and confidently.',
  },
] as const;

export default function InternationalPage() {
  const router = useRouter();

  /**
   * "한국 사이트로 이동" 핸들러 / "Continue to Korean Site" handler
   * 쿠키 설정 후 루트 페이지로 이동 / Set cookie then navigate to root
   */
  const handleContinueToKoreanSite = () => {
    setBypassCookie();
    router.push('/');
  };

  return (
    <div className="grow w-full">
      {/* ── 히어로 섹션 / Hero section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        {/* 배경 장식 / Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20" />
          <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-white/10" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          {/* 로고 / Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Globe className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">JobChaja</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Find Your Path to<br className="hidden sm:block" /> Working in South Korea
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-blue-100 mb-10 leading-relaxed">
            JobChaja is Korea&apos;s dedicated platform for foreign job seekers.
            Start with our free <strong>Visa Diagnosis</strong> to discover which
            work visas you qualify for, then browse jobs matched to your eligibility.
          </p>

          {/* CTA 버튼 그룹 / CTA button group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold text-base px-8 py-3 h-auto rounded-xl shadow-lg shadow-blue-900/30"
            >
              <Link href="/diagnosis">
                Start Visa Diagnosis
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={handleContinueToKoreanSite}
              className="text-blue-100 hover:text-white hover:bg-white/10 font-medium text-base px-6 py-3 h-auto rounded-xl"
            >
              Continue to Korean Site
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── 서비스 소개 섹션 / Features section ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            How JobChaja Helps You
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Whether you&apos;re planning to work in Korea or already here, we provide
            the tools you need to navigate the process with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 비자 진단 유도 섹션 / Visa diagnosis CTA section ── */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <FileSearch className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Not Sure Which Visa You Need?
            </h3>
            <p className="text-gray-500 max-w-lg mx-auto mb-8 leading-relaxed">
              Our Visa Diagnosis tool asks a few quick questions about your background,
              education, and work experience, then shows you exactly which Korean
              work visas you may qualify for &mdash; completely free.
            </p>

            <Button
              asChild
              size="lg"
              className="font-bold text-base px-8 py-3 h-auto rounded-xl"
            >
              <Link href="/diagnosis">
                Start Free Visa Diagnosis
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 하단 안내 / Footer note ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-sm text-gray-400">
          JobChaja (잡차자) &mdash; Korea&apos;s employment platform for foreign workers.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Looking for the Korean site?{' '}
          <button
            onClick={handleContinueToKoreanSite}
            className="text-blue-500 hover:text-blue-600 underline underline-offset-2 font-medium"
          >
            Go to Korean version
          </button>
        </p>
      </section>
    </div>
  );
}
