'use client';

/**
 * 시안 D — "세로 타임라인" 인포그래픽 스타일 위저드
 * Variant D — "Vertical Timeline" infographic-style wizard
 *
 * 데스크탑: 좌측 세로 타임라인 + 우측 현재 Step 폼
 * Desktop: Left vertical timeline + Right current step form
 *
 * 모바일: 상단 접이식 타임라인 + 하단 폼
 * Mobile: Top collapsible timeline + Bottom form
 *
 * 타임라인 노드: 완료=체크+green, 현재=pulse+blue, 미래=gray dot
 * Timeline nodes: completed=check+green, current=pulse+blue, future=gray dot
 *
 * 완료 노드 아래 요약 미리보기 (이름:Nguyen, 비자:D-2...)
 * Summary preview below completed nodes (name:Nguyen, visa:D-2...)
 */

import { useState, useCallback, useMemo } from 'react';
import TimelineSidebar from './components/timeline-sidebar';
import MobileTimeline from './components/mobile-timeline';
import StepContent from './components/step-content';
import Step0Residency from './components/step-forms/step0-residency';
import Step1Identity from './components/step-forms/step1-identity';
import Step2Visa from './components/step-forms/step2-visa';
import Step3Korean from './components/step-forms/step3-korean';
import Step4Education from './components/step-forms/step4-education';
import Step5Delta from './components/step-forms/step5-delta';
import Step6Experience from './components/step-forms/step6-experience';
import Step7Preferences from './components/step-forms/step7-preferences';
import { WIZARD_STEPS } from './components/wizard-types';
import type { WizardFormData, WizardBadge, ExperienceEntry } from './components/wizard-types';

/** Mock 초기 데이터 (일부 완료된 상태 시뮬레이션) / Mock initial data */
const INITIAL_FORM_DATA: WizardFormData = {
  // Step 0 완료 / Step 0 completed
  residencyType: 'long_term',
  residenceSido: '서울특별시',
  residenceSigungu: '관악구',
  residenceDetail: '신림동 123-4',
  phoneNumber: '010-1234-5678',

  // Step 1 완료 / Step 1 completed
  firstName: 'VAN A',
  lastName: 'NGUYEN',
  gender: 'male',
  birthDate: '1998-03-15',
  nationality: '베트남',

  // Step 2 완료 / Step 2 completed
  visaType: 'D-2',
  visaSubType: 'D-2-2',
  foreignRegistrationNumber: '980315-5123456',
  visaExpiryDate: '2027-03-14',

  // Step 3 — 현재 스텝 (부분 입력) / Step 3 — current step (partial)
  topikLevel: 3,
  koreanAbility: '',

  // 나머지 비어있음 / Rest empty
};

/** Mock 초기 완료 스텝 / Mock initial completed steps */
const INITIAL_COMPLETED = new Set([0, 1, 2]);

export default function WizardVariantDPage() {
  // ─── 상태 관리 / State management ───
  const [currentStep, setCurrentStep] = useState(3);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(INITIAL_COMPLETED);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // ─── 진행률 계산 / Calculate progress ───
  const progress = useMemo(() => {
    return Math.round((completedSteps.size / WIZARD_STEPS.length) * 100);
  }, [completedSteps]);

  // ─── 뱃지 계산 / Calculate badges ───
  const badges = useMemo<WizardBadge[]>(() => {
    const result: WizardBadge[] = [];

    // 프로필 완성 뱃지 / Profile complete badge
    if (completedSteps.size === WIZARD_STEPS.length) {
      result.push({ id: 'profile_complete', label: '프로필 완성', color: 'green' });
    } else if (completedSteps.size >= 4) {
      result.push({ id: 'profile_half', label: '프로필 50%+', color: 'blue' });
    }

    // 비자 인증 뱃지 / Visa verified badge
    if (completedSteps.has(2) && formData.arcFile) {
      result.push({ id: 'visa_verified', label: '비자 인증', color: 'green' });
    } else if (completedSteps.has(2)) {
      result.push({ id: 'visa_entered', label: '비자 입력', color: 'amber' });
    }

    // DELTA 뱃지 / DELTA badge
    if (completedSteps.has(5) && formData.deltaScore) {
      result.push({ id: 'delta_scored', label: `DELTA ${formData.deltaScore}점`, color: 'green' });
    }

    // 경력 뱃지 / Experience badge
    if (completedSteps.has(6) && (formData.totalExperienceYears ?? 0) > 0) {
      result.push({ id: 'experienced', label: '경력자', color: 'blue' });
    }

    return result;
  }, [completedSteps, formData]);

  // ─── 폼 필드 업데이트 / Update form field ───
  const handleFieldUpdate = useCallback((field: keyof WizardFormData, value: string) => {
    setFormData((prev) => {
      // 숫자 필드 처리 / Handle numeric fields
      const numericFields = [
        'topikLevel', 'kiipLevel', 'sejongLevel', 'graduationYear',
        'deltaScore', 'totalExperienceYears', 'desiredSalaryMin', 'desiredSalaryMax',
      ];

      if (numericFields.includes(field)) {
        const numVal = value === '' ? undefined : Number(value);
        return { ...prev, [field]: numVal };
      }

      return { ...prev, [field]: value || undefined };
    });
  }, []);

  // ─── 경력 목록 업데이트 / Update experience list ───
  const handleUpdateExperiences = useCallback((experiences: ExperienceEntry[]) => {
    setFormData((prev) => ({ ...prev, experiences }));
  }, []);

  // ─── 근무 요일 토글 / Toggle work day ───
  const handleToggleWorkDay = useCallback((day: string) => {
    setFormData((prev) => {
      const current = prev.desiredWorkDays ?? [];
      const updated = current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day];
      return { ...prev, desiredWorkDays: updated };
    });
  }, []);

  // ─── 스텝 클릭 (재편집) / Step click (re-edit) ───
  const handleStepClick = useCallback((step: number) => {
    if (completedSteps.has(step)) {
      setCurrentStep(step);
    }
  }, [completedSteps]);

  // ─── 다음 스텝 / Next step ───
  const handleNext = useCallback(() => {
    setIsLoading(true);

    // Mock API 호출 시뮬레이션 / Mock API call simulation
    setTimeout(() => {
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        next.add(currentStep);
        return next;
      });

      if (currentStep < WIZARD_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
      setIsLoading(false);
    }, 600);
  }, [currentStep]);

  // ─── 이전 스텝 / Previous step ───
  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // ─── 저장 / Save draft ───
  const handleSave = useCallback(() => {
    setIsLoading(true);
    // Mock 저장 / Mock save
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  }, []);

  // ─── 현재 스텝 폼 렌더링 / Render current step form ───
  const renderStepForm = () => {
    switch (currentStep) {
      case 0:
        return <Step0Residency formData={formData} onUpdate={handleFieldUpdate} />;
      case 1:
        return <Step1Identity formData={formData} onUpdate={handleFieldUpdate} />;
      case 2:
        return <Step2Visa formData={formData} onUpdate={handleFieldUpdate} />;
      case 3:
        return <Step3Korean formData={formData} onUpdate={handleFieldUpdate} />;
      case 4:
        return <Step4Education formData={formData} onUpdate={handleFieldUpdate} />;
      case 5:
        return <Step5Delta formData={formData} onUpdate={handleFieldUpdate} />;
      case 6:
        return (
          <Step6Experience
            formData={formData}
            onUpdate={handleFieldUpdate}
            onUpdateExperiences={handleUpdateExperiences}
          />
        );
      case 7:
        return (
          <Step7Preferences
            formData={formData}
            onUpdate={handleFieldUpdate}
            onToggleWorkDay={handleToggleWorkDay}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 모바일 타임라인 (lg 미만에서만 표시) / Mobile timeline (shown below lg) */}
      <MobileTimeline
        currentStep={currentStep}
        completedSteps={completedSteps}
        formData={formData}
        onStepClick={handleStepClick}
        badges={badges}
        progress={progress}
      />

      {/* 메인 레이아웃: 좌측 타임라인 + 우측 폼 / Main layout: left timeline + right form */}
      <div className="flex max-w-[1280px] mx-auto">
        {/* 좌측 세로 타임라인 (lg 이상에서만 표시) / Left vertical timeline (lg and above) */}
        <TimelineSidebar
          currentStep={currentStep}
          completedSteps={completedSteps}
          formData={formData}
          onStepClick={handleStepClick}
          badges={badges}
          progress={progress}
        />

        {/* 우측 폼 콘텐츠 / Right form content */}
        <StepContent
          currentStep={currentStep}
          onPrev={handlePrev}
          onNext={handleNext}
          onSave={handleSave}
          isLoading={isLoading}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === WIZARD_STEPS.length - 1}
        >
          {renderStepForm()}
        </StepContent>
      </div>
    </div>
  );
}
