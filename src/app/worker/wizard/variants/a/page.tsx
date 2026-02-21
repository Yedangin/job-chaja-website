'use client';

/**
 * 시커 위저드 메인 페이지 — 시안 A: "카드 스택"
 * Seeker Wizard Main Page — Variant A: "Card Stack"
 *
 * 모바일 퍼스트 풀스크린 위저드. 한 화면에 하나의 Step만 표시.
 * Mobile-first fullscreen wizard. Shows one step at a time.
 *
 * 기능:
 * - Step 라우팅 + 슬라이드 트랜지션
 * - 상단 프로그레스 바 (0%~100%) + Step 번호
 * - 하단 이전/다음 고정 버튼바 + 자동저장 표시
 * - 각 Step 완성도 자동 계산
 *
 * Features:
 * - Step routing + slide transition
 * - Top progress bar (0%~100%) + step number
 * - Bottom fixed prev/next button bar + auto-save indicator
 * - Automatic per-step completion calculation
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

import { ResidencyStatus, BadgeStatus, KoreanTestType } from './types';
import type {
  WizardData,
  WizardCompletion,
  AutoSaveStatus,
  BadgeInfo,
} from './types';
import { INITIAL_WIZARD_DATA, MOCK_COMPLETION, STEP_META, BADGES } from './mock-data';

import WizardProgressBar from './components/wizard-progress-bar';
import Step0Residency from './components/step-0-residency';
import Step1Identity from './components/step-1-identity';
import Step2Visa from './components/step-2-visa';
import Step3Korean from './components/step-3-korean';
import Step4Education from './components/step-4-education';
import Step5Delta from './components/step-5-delta';
import Step6Experience from './components/step-6-experience';
import Step7Preferences from './components/step-7-preferences';
import CompletionSummary from './components/completion-summary';
import ProposalAcceptanceModal from './components/proposal-acceptance-modal';

const TOTAL_STEPS = STEP_META.length;

/** Step별 완성도 계산 / Calculate per-step completion */
function calculateStepCompletion(data: WizardData): WizardCompletion {
  const steps = STEP_META.map((meta) => {
    let percent = 0;

    switch (meta.step) {
      case 0: {
        // 거주 상태 선택 여부 / Residency selection
        percent = data.step0.residencyStatus ? 100 : 0;
        break;
      }
      case 1: {
        // 필수: 이름, 국적, 생년월일, 전화 / Required: name, nationality, birthdate, phone
        const fields = [
          data.step1.firstName,
          data.step1.lastName,
          data.step1.nationality,
          data.step1.birthDate,
          data.step1.phone,
        ];
        const filled = fields.filter(Boolean).length;
        percent = Math.round((filled / fields.length) * 100);
        break;
      }
      case 2: {
        // 필수: 비자유형 / Required: visa type
        const fields = [data.step2.visaType];
        // ARC 조건부 / ARC conditional
        if (data.step0.residencyStatus !== ResidencyStatus.OVERSEAS) {
          fields.push(data.step2.arcNumber, data.step2.expiryDate);
        }
        const filled = fields.filter(Boolean).length;
        percent = Math.round((filled / fields.length) * 100);
        break;
      }
      case 3: {
        // 회화 자가평가만 필수 / Only conversation level is required
        let score = 0;
        if (data.step3.conversationLevel) score += 50;
        if (data.step3.testType) score += 30;
        if (data.step3.testLevel || data.step3.testType === KoreanTestType.NONE) score += 20;
        percent = Math.min(score, 100);
        break;
      }
      case 4: {
        // 학력 1개 이상 입력 시 100% / 100% if at least 1 education entry
        if (data.step4.entries.length > 0) {
          const entry = data.step4.entries[0];
          const fields = [entry.schoolName, entry.degree];
          const filled = fields.filter(Boolean).length;
          percent = Math.round((filled / fields.length) * 100);
        }
        break;
      }
      case 5: {
        // DELTA: 비자코드 없으면 100% (N/A) / 100% if no visa code (N/A)
        if (!data.step2.visaType) {
          percent = 0;
        } else {
          // 간단 계산: 비자 있으면 자동 완성 취급
          // Simple calc: treat as auto-complete if visa exists
          percent = 100;
        }
        break;
      }
      case 6: {
        // 경력 없음 선택 또는 1개 이상 입력 / "No experience" or at least 1 entry
        if (!data.step6.hasExperience) {
          percent = 100;
        } else if (data.step6.entries.length > 0) {
          const entry = data.step6.entries[0];
          const fields = [entry.companyName, entry.position, entry.startDate];
          const filled = fields.filter(Boolean).length;
          percent = Math.round((filled / fields.length) * 100);
        }
        break;
      }
      case 7: {
        // 고용형태, 업종, 지역 중 1개 이상 선택 / At least 1 selection in each category
        let score = 0;
        if (data.step7.employmentTypes.length > 0) score += 30;
        if (data.step7.industries.length > 0) score += 30;
        if (data.step7.regions.length > 0) score += 25;
        if (data.step7.introduction.length >= 10) score += 15;
        percent = Math.min(score, 100);
        break;
      }
    }

    return {
      step: meta.step,
      label: meta.title,
      labelEn: meta.titleEn,
      percent,
      isComplete: percent >= 100,
    };
  });

  const totalPercent = Math.round(
    steps.reduce((sum, s) => sum + s.percent, 0) / steps.length
  );

  return { totalPercent, steps };
}

/** 슬라이드 방향 / Slide direction */
type SlideDirection = 'left' | 'right' | 'none';

export default function SeekerWizardVariantAPage() {
  const router = useRouter();

  /** 현재 Step / Current step */
  const [currentStep, setCurrentStep] = useState(0);

  /** 위저드 데이터 / Wizard data */
  const [wizardData, setWizardData] = useState<WizardData>(INITIAL_WIZARD_DATA);

  /** 자동저장 상태 / Auto-save status */
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('IDLE');

  /** 슬라이드 방향 / Slide direction */
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('none');

  /** 트랜지션 진행 중 / Transition in progress */
  const [isTransitioning, setIsTransitioning] = useState(false);

  /** 완성도 보기 모드 / View completion mode */
  const [showCompletion, setShowCompletion] = useState(false);

  /** 자동저장 타이머 / Auto-save timer */
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 뱃지 상태 / Badge states */
  const [badges, setBadges] = useState<BadgeInfo[]>(BADGES);

  /** 제안 수락 모달 표시 여부 / Proposal acceptance modal visibility */
  const [showProposalModal, setShowProposalModal] = useState(false);

  /** 제안 수락 여부 (100% 완성 시 한 번만 표시) / Proposal acceptance flag */
  const hasShownProposalModalRef = useRef(false);

  /** 완성도 계산 / Calculate completion */
  const completion = calculateStepCompletion(wizardData);
  const stepCompleted = completion.steps.map((s) => s.isComplete);

  /** 첫 방문 여부 추적 / Track first visit */
  const isFirstLoadRef = useRef(true);

  /** 자동저장 시뮬레이션 / Auto-save simulation */
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setAutoSaveStatus('SAVING');

    autoSaveTimerRef.current = setTimeout(() => {
      // 실제로는 PUT /individual-profile/wizard/:step 호출
      // In production: call PUT /individual-profile/wizard/:step
      setAutoSaveStatus('SAVED');

      // 2초 후 IDLE로 복귀 / Reset to IDLE after 2s
      setTimeout(() => setAutoSaveStatus('IDLE'), 2000);
    }, 800);
  }, []);

  /** 데이터 변경 시 자동저장 트리거 / Trigger auto-save on data change */
  const handleDataChange = useCallback(
    <K extends keyof WizardData>(stepKey: K, data: WizardData[K]) => {
      setWizardData((prev) => ({
        ...prev,
        [stepKey]: data,
      }));
      triggerAutoSave();
    },
    [triggerAutoSave],
  );

  /** Step 전환 / Step transition */
  const goToStep = useCallback(
    (targetStep: number) => {
      if (targetStep < 0 || targetStep >= TOTAL_STEPS || isTransitioning) return;

      const direction: SlideDirection = targetStep > currentStep ? 'left' : 'right';
      setSlideDirection(direction);
      setIsTransitioning(true);

      // 트랜지션 시작 (아웃) / Transition start (out)
      setTimeout(() => {
        setCurrentStep(targetStep);
        setShowCompletion(false);

        // 트랜지션 완료 (인) / Transition complete (in)
        setTimeout(() => {
          setSlideDirection('none');
          setIsTransitioning(false);
        }, 50);
      }, 200);
    },
    [currentStep, isTransitioning],
  );

  /** 다음 Step / Next step */
  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      goToStep(currentStep + 1);
    } else {
      // 마지막 Step에서 완성도 보기 / Show completion at last step
      setShowCompletion(true);
    }
  }, [currentStep, goToStep]);

  /** 이전 Step / Previous step */
  const goPrev = useCallback(() => {
    if (showCompletion) {
      setShowCompletion(false);
      return;
    }
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep, showCompletion]);

  /** 다음 버튼 활성화 여부 / Next button enabled check */
  const isNextEnabled = (() => {
    switch (currentStep) {
      case 0:
        return wizardData.step0.residencyStatus !== null;
      default:
        return true;
    }
  })();

  /** 뱃지 상태 업데이트 (완성도 기반) / Update badge status based on completion */
  useEffect(() => {
    if (completion.totalPercent >= 100) {
      setBadges((prev) =>
        prev.map((b) =>
          b.id === 'profile' ? { ...b, status: BadgeStatus.VERIFIED } : b,
        ),
      );
    }
  }, [completion.totalPercent]);

  /** 첫 로드 시 미완성 스텝으로 이동 / Jump to first incomplete step on first load */
  useEffect(() => {
    if (isFirstLoadRef.current && completion.totalPercent > 0 && completion.totalPercent < 100) {
      // 첫 미완성 스텝 찾기 / Find first incomplete step
      const firstIncompleteStep = completion.steps.findIndex((s) => !s.isComplete);
      if (firstIncompleteStep > 0) {
        // Step 0 이후부터만 자동 이동 / Only auto-jump after Step 0
        setCurrentStep(firstIncompleteStep);
      }
      isFirstLoadRef.current = false;
    }
  }, [completion]);

  /** 100% 완성 시 제안 수락 모달 표시 / Show proposal modal at 100% completion */
  useEffect(() => {
    if (completion.totalPercent >= 100 && !hasShownProposalModalRef.current && !showCompletion) {
      // 100% 달성 시 한 번만 표시 / Show only once when reaching 100%
      setShowProposalModal(true);
      hasShownProposalModalRef.current = true;
    }
  }, [completion.totalPercent, showCompletion]);

  /** 제안 수락 핸들러 / Accept proposal handler */
  const handleAcceptProposal = () => {
    // 실제로는 PUT /individual-profile/settings { acceptProposals: true }
    // In production: call PUT /individual-profile/settings { acceptProposals: true }
    setShowProposalModal(false);
    // 완성도 화면으로 이동 / Go to completion summary
    setShowCompletion(true);
  };

  /** 제안 나중에 핸들러 / Decline/later handler */
  const handleDeclineProposal = () => {
    setShowProposalModal(false);
    // 완성도 화면으로 이동 / Go to completion summary
    setShowCompletion(true);
  };

  /** 현재 Step 컴포넌트 렌더링 / Render current step component */
  const renderStep = () => {
    if (showCompletion) {
      return (
        <CompletionSummary
          completion={completion}
          badges={badges}
          onGoToStep={(step) => {
            setShowCompletion(false);
            goToStep(step);
          }}
          onGoToDashboard={() => router.push('/worker/dashboard')}
        />
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <Step0Residency
            data={wizardData.step0}
            onChange={(data) => handleDataChange('step0', data)}
          />
        );
      case 1:
        return (
          <Step1Identity
            data={wizardData.step1}
            residencyData={wizardData.step0}
            onChange={(data) => handleDataChange('step1', data)}
          />
        );
      case 2:
        return (
          <Step2Visa
            data={wizardData.step2}
            onChange={(data) => handleDataChange('step2', data)}
            residencyData={wizardData.step0}
          />
        );
      case 3:
        return (
          <Step3Korean
            data={wizardData.step3}
            onChange={(data) => handleDataChange('step3', data)}
          />
        );
      case 4:
        return (
          <Step4Education
            data={wizardData.step4}
            onChange={(data) => handleDataChange('step4', data)}
          />
        );
      case 5:
        return (
          <Step5Delta
            data={wizardData.step5}
            onChange={(data) => handleDataChange('step5', data)}
            visaCode={wizardData.step2.visaType}
          />
        );
      case 6:
        return (
          <Step6Experience
            data={wizardData.step6}
            onChange={(data) => handleDataChange('step6', data)}
          />
        );
      case 7:
        return (
          <Step7Preferences
            data={wizardData.step7}
            onChange={(data) => handleDataChange('step7', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto relative">
      {/* 프로그레스 바 / Progress bar */}
      <WizardProgressBar
        currentStep={currentStep}
        totalPercent={completion.totalPercent}
        autoSaveStatus={autoSaveStatus}
        onStepClick={goToStep}
        stepCompleted={stepCompleted}
      />

      {/* 메인 카드 영역 / Main card area */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div
          className={cn(
            'px-4 py-6 transition-all duration-200',
            // 슬라이드 아웃 / Slide out
            slideDirection === 'left' && isTransitioning && 'opacity-0 -translate-x-8',
            slideDirection === 'right' && isTransitioning && 'opacity-0 translate-x-8',
            // 기본 상태 / Default state
            slideDirection === 'none' && 'opacity-100 translate-x-0',
          )}
        >
          {/* Step 설명 (완성도 화면 제외) / Step description (except completion) */}
          {!showCompletion && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {STEP_META[currentStep]?.description}
              </p>
              <p className="text-xs text-gray-400">
                {STEP_META[currentStep]?.descriptionEn}
              </p>
            </div>
          )}

          {/* Step 컴포넌트 / Step component */}
          {renderStep()}
        </div>
      </div>

      {/* 하단 고정 버튼바 / Fixed bottom button bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          {/* 이전 버튼 / Previous button */}
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={currentStep === 0 && !showCompletion}
            className="min-h-[48px] min-w-[48px] rounded-xl"
            aria-label="이전 / Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* 완성도 확인 버튼 / Completion check button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowCompletion(!showCompletion)}
            className={cn(
              'min-h-[48px] min-w-[48px] rounded-xl',
              showCompletion && 'bg-blue-50 text-blue-600',
            )}
            aria-label="완성도 확인 / Check completion"
            aria-pressed={showCompletion}
          >
            <Eye className="w-5 h-5" />
          </Button>

          {/* 다음 버튼 / Next button */}
          <Button
            type="button"
            onClick={goNext}
            disabled={!isNextEnabled || isTransitioning}
            className={cn(
              'flex-1 min-h-[48px] rounded-xl font-semibold transition-all',
              currentStep === TOTAL_STEPS - 1 && !showCompletion
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600',
              'text-white',
            )}
          >
            {showCompletion ? (
              '닫기 / Close'
            ) : currentStep === TOTAL_STEPS - 1 ? (
              <>
                완성도 확인 / Review
                <Eye className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                다음 / Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 제안 수락 모달 / Proposal acceptance modal */}
      <ProposalAcceptanceModal
        isOpen={showProposalModal}
        onAccept={handleAcceptProposal}
        onClose={handleDeclineProposal}
      />
    </div>
  );
}
