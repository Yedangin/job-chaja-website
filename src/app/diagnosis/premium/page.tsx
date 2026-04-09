'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  GraduationCap,
  Languages,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useProfileCompletion } from '@/hooks/use-profile-completion';

export default function PremiumCheckoutPage() {
  const { isLoggedIn, role } = useAuth();
  const profileCompletion = useProfileCompletion();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const nextHref = useMemo(() => {
    const target = `/worker/resume${sessionId ? `?source=visa-planner&sessionId=${sessionId}` : '?source=visa-planner'}`;

    if (!isLoggedIn) {
      return `/login?redirect=${encodeURIComponent(target)}`;
    }

    if (role === 'INDIVIDUAL') {
      return target;
    }

    return '/worker/resume';
  }, [isLoggedIn, role, sessionId]);

  return (
    <div className="min-h-screen bg-linear-to-b from-cyan-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/visa-planner/result"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          비자 플래너 결과로 돌아가기
        </Link>

        <Card className="p-8 border-cyan-200 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">상세 프로필 완성</h1>
            <p className="text-gray-600">
              결제 없이 계속 진행할 수 있습니다. 학력, 경력, 언어, 희망 직무를 채우면
              기업이 인재채용관에서 프로필을 보고 스카우트 제안을 보낼 수 있습니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="w-5 h-5 text-cyan-700" />
                <h2 className="font-semibold text-gray-900">학력 상세 등록</h2>
              </div>
              <p className="text-sm text-gray-600">
                학교명, 전공, 학위, 재학/졸업 상태를 세부적으로 등록해 학력 기반 매칭 신뢰도를 높입니다.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="w-5 h-5 text-emerald-700" />
                <h2 className="font-semibold text-gray-900">경력 상세 등록</h2>
              </div>
              <p className="text-sm text-gray-600">
                회사명, 직무, 근무 기간, 주요 업무를 입력해 직접 채용과 스카우트 제안 가능성을 높입니다.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <Languages className="w-5 h-5 text-amber-700" />
                <h2 className="font-semibold text-gray-900">언어 및 자격</h2>
              </div>
              <p className="text-sm text-gray-600">
                TOPIK, KIIP, 자격증, 선호 지역을 함께 입력하면 기업이 바로 검색할 수 있는 프로필이 됩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-violet-700" />
                <h2 className="font-semibold text-gray-900">인재채용관 노출</h2>
              </div>
              <p className="text-sm text-gray-600">
                프로필이 완성되면 기업은 국적, 직무, 지역, 한국어 수준, 경력 수 기준으로 인재를 탐색할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-900 text-white p-6 mb-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h2 className="font-semibold">현재 프로필 완성도</h2>
              <span className="text-2xl font-bold">
                {profileCompletion.isLoading ? '...' : `${profileCompletion.completion}%`}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${profileCompletion.isLoading ? 0 : profileCompletion.completion}%` }}
              />
            </div>
            <p className="text-sm text-white/75 mt-3">
              프로필 완성도는 인재채용관 노출 품질과 스카우트 수신 가능성에 직접 연결됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 mb-8">
            <h2 className="font-semibold text-gray-900 mb-3">추천 다음 단계</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                무료 진단에서 본 경로를 참고하되, 기업이 먼저 볼 수 있는 프로필 정보를 우선 채웁니다.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                학력과 경력은 최소 1개 이상 구체적으로 입력하고, 직무 설명은 검색 가능한 키워드 중심으로 작성합니다.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                TOPIK, 희망 지역, 희망 직무를 추가하면 인재 검색 필터에서 더 잘 노출됩니다.
              </li>
            </ul>
          </div>

          <Button
            asChild
            size="lg"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-xl"
          >
            <Link href={nextHref}>
              상세 프로필 등록 시작
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
