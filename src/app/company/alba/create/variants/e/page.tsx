'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

import type { AlbaJobFormData } from '../a/types';
import { WizardProgress } from './components/wizard-progress';
import { StepJobInfo } from './components/step-job-info';
import { StepDetails } from './components/step-details';
import { StepPreview } from './components/step-preview';

/**
 * 알바 공고 등록 위자드 (시안 E) - 비자 인사이트 대시보드 스타일
 * Alba Job Creation Wizard (Variant E) - Visa Insight Dashboard Style
 *
 * 3단계 위자드: 기본정보 -> 상세조건 -> 미리보기+비자매칭+등록
 * 3-step wizard: Job Info -> Details -> Preview+VisaMatching+Submit
 *
 * 차별점: 잡플래닛(데이터 시각화) + 사람인(정보 밀도) 조합
 * Differentiation: JobPlanet(data visualization) + Saramin(information density) blend
 */
export default function AlbaCreatePageVariantE() {
  const [step, setStep] = useState(1);
  /* 더미 폼 데이터 / Dummy form data for demonstration */
  const [form, setForm] = useState<Partial<AlbaJobFormData>>({
    jobCategoryCode: 'REST_SERVING',
    hourlyWage: 12000,
    recruitCount: 2,
    weeklyHours: 15,
    schedule: [
      { dayOfWeek: 'MON', startTime: '18:00', endTime: '23:00' },
      { dayOfWeek: 'TUE', startTime: '18:00', endTime: '23:00' },
      { dayOfWeek: 'WED', startTime: '18:00', endTime: '23:00' },
    ],
    workPeriod: {
      startDate: '2026-03-01',
      endDate: null,
    },
    title: '강남역 카페 주말 바리스타 모집',
    address: {
      sido: '서울특별시',
      sigungu: '강남구',
      detail: '역삼동 123-45 2층',
      lat: 37.4979,
      lng: 127.0276,
    },
    koreanLevel: 'BASIC',
    experienceLevel: 'NONE',
    preferredQualifications: '바리스타 자격증 우대, 인근 거주자 환영',
    benefits: ['MEAL', 'TRANSPORT'],
    detailDescription:
      '저희 카페에서 함께할 주말 바리스타를 모집합니다.\n주요 업무는 음료 제조와 고객 응대입니다.\n밝고 친절한 분들의 많은 지원 바랍니다.',
    applicationMethod: 'PLATFORM',
    contactName: '김채용',
    contactPhone: '010-1234-5678',
    contactEmail: 'hire@cafe.com',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  /* 폼 업데이트 / Update form fields */
  const updateForm = (data: Partial<AlbaJobFormData>) => {
    setForm((prev) => ({ ...prev, ...data }));
  };

  /* 스텝 네비게이션 / Step navigation */
  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  const goToStep = (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  /* 임시저장 / Manual draft save */
  const manualSave = async () => {
    setIsSaving(true);
    await new Promise((res) => setTimeout(res, 1000));
    setIsSaving(false);
    setLastSaved(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
  };

  /* 최종 등록 / Final submission */
  const handleSubmit = async () => {
    // TODO: POST /api/alba/jobs 호출 / Call POST /api/alba/jobs
    await manualSave();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* 상단 헤더 / Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Link
              href="/company/alba"
              className="p-1.5 text-gray-400 hover:text-gray-700 transition"
              aria-label="알바 공고 목록으로 돌아가기 / Back to alba job list"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">알바 공고 등록</h1>
          </div>
          <button
            onClick={manualSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            aria-label="임시저장 / Save draft"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? '저장 중...' : lastSaved ? `저장됨 ${lastSaved}` : '임시저장'}
          </button>
        </div>

        {/* 진행 표시기 / Progress bar */}
        <WizardProgress currentStep={step} onStepClick={goToStep} />

        {/* 스텝별 컨텐츠 카드 / Step content card */}
        <div className="mt-6 bg-white p-6 sm:p-8 rounded-xl border border-gray-200">
          {step === 1 && <StepJobInfo form={form} onUpdate={updateForm} />}
          {step === 2 && <StepDetails form={form} onUpdate={updateForm} />}
          {step === 3 && <StepPreview form={form} onSubmit={handleSubmit} />}
        </div>

        {/* 하단 네비게이션 바 / Bottom navigation bar */}
        <div className="mt-6 flex justify-between items-center sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 -mx-4 px-4 py-3 md:relative md:bg-transparent md:border-0 md:mx-0 md:px-0 md:py-0 md:backdrop-blur-none">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
            aria-label="이전 단계 / Previous step"
          >
            이전
          </button>
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition min-h-[44px]"
              aria-label="다음 단계 / Next step"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition min-h-[44px]"
              aria-label="최종 등록하기 / Submit final posting"
            >
              최종 등록하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
