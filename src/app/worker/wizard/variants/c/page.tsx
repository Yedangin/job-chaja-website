'use client';

import { useState, useCallback, useEffect } from 'react';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// 컴포넌트 임포트 / Component imports
import CompletionDonut from './components/completion-donut';
import BlockTile from './components/block-tile';
import BadgeRow from './components/badge-row';
import ResidencyModal from './components/residency-modal';
import BlockModal from './components/block-modal';

// 스텝 폼 임포트 / Step form imports
import Step1Identity from './components/step-forms/step-1-identity';
import Step2Visa from './components/step-forms/step-2-visa';
import Step3Korean from './components/step-forms/step-3-korean';
import Step4Education from './components/step-forms/step-4-education';
import Step5Delta from './components/step-forms/step-5-delta';
import Step6Career from './components/step-forms/step-6-career';
import Step7Preferences from './components/step-forms/step-7-preferences';

// 타입 & 목업 데이터 / Types & mock data
import type { WizardBlock, WizardState, ResidencyType } from './components/wizard-types';
import {
  MOCK_WIZARD_STATE,
  mockFetchWizardCompletion,
  mockSaveWizardStep,
} from './components/mock-data';

/**
 * 시안 C: "대시보드 블록" — 블록 타일 선택형 / Variant C: "Dashboard Block" — Block tile selector
 *
 * 7개 블록을 타일 카드로 메인 화면에 표시.
 * Displays 7 blocks as tile cards on the main screen.
 *
 * 비선형: 순서 무관하게 원하는 블록부터 클릭하여 진입.
 * Non-linear: Click any block to enter, regardless of order.
 *
 * 단, Step 5(DELTA)는 Step 2(비자) 완료 후에만 활성화.
 * However, Step 5 (DELTA) is only active after Step 2 (Visa) is completed.
 *
 * API:
 * - GET /individual-profile/wizard/completion
 * - PUT /individual-profile/wizard/:step
 * - GET /individual-profile/wizard
 */
export default function WizardVariantCPage() {
  // === 상태 관리 / State management ===
  const [wizardState, setWizardState] = useState<WizardState>(MOCK_WIZARD_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBlock, setActiveBlock] = useState<WizardBlock | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [showResidencyModal, setShowResidencyModal] = useState(false);

  // 초기 로딩: 위저드 상태 조회 / Initial load: fetch wizard state
  useEffect(() => {
    const fetchState = async () => {
      setIsLoading(true);
      try {
        const response = await mockFetchWizardCompletion();
        // 목업: 상태를 바탕으로 위저드 상태 갱신 / Mock: update wizard state from response
        setWizardState((prev) => ({
          ...prev,
          overallCompletion: response.overallCompletion,
          hasCompletedResidency: response.residencyType !== null,
          residencyType: response.residencyType,
        }));

        // Step 0 미완료 시 거주 모달 표시 / Show residency modal if Step 0 not completed
        if (!response.residencyType) {
          setShowResidencyModal(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchState();
  }, []);

  // DELTA(Step 5) 잠김 로직: Step 2(비자) 미완료 시 잠김 / Lock DELTA if Step 2 not completed
  const blocksWithLock = wizardState.blocks.map((block) => {
    if (block.step === 5) {
      const visaBlock = wizardState.blocks.find((b) => b.step === 2);
      const isVisaComplete = visaBlock?.status === 'completed';
      return {
        ...block,
        isLocked: !isVisaComplete,
        lockReason: !isVisaComplete ? '비자 완료 필요' : undefined,
      };
    }
    return block;
  });

  // 블록 타일 클릭 핸들러 / Block tile click handler
  const handleBlockClick = useCallback((block: WizardBlock) => {
    setActiveBlock(block);
    setIsBlockModalOpen(true);
  }, []);

  // 블록 모달 닫기 핸들러 / Block modal close handler
  const handleBlockModalClose = useCallback(() => {
    setIsBlockModalOpen(false);
    setTimeout(() => setActiveBlock(null), 300); // 애니메이션 후 초기화 / Reset after animation
  }, []);

  // 스텝 데이터 저장 핸들러 / Step data save handler
  const handleStepSave = useCallback(
    async (step: number, data: Record<string, unknown>) => {
      const result = await mockSaveWizardStep(step, data);
      if (result.success) {
        // 블록 상태 업데이트 / Update block status
        setWizardState((prev) => {
          const updatedBlocks = prev.blocks.map((b) =>
            b.step === step
              ? { ...b, status: 'completed' as const, completionPercent: result.completionPercent }
              : b
          );
          // 전체 완성도 재계산 / Recalculate overall completion
          const totalPercent = updatedBlocks.reduce((sum, b) => sum + b.completionPercent, 0);
          const overallCompletion = Math.round(totalPercent / updatedBlocks.length);
          return {
            ...prev,
            blocks: updatedBlocks,
            overallCompletion,
          };
        });
      }
    },
    []
  );

  // 거주 유형 선택 핸들러 / Residency type select handler
  const handleResidencySelect = useCallback((type: ResidencyType) => {
    setWizardState((prev) => ({
      ...prev,
      residencyType: type,
      hasCompletedResidency: true,
    }));
    setShowResidencyModal(false);
  }, []);

  // 새로고침 / Refresh
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await mockFetchWizardCompletion();
      setWizardState((prev) => ({
        ...prev,
        overallCompletion: response.overallCompletion,
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 스텝 폼 렌더링 / Render step form
  const renderStepForm = (block: WizardBlock) => {
    const commonProps = {
      onClose: handleBlockModalClose,
    };

    switch (block.step) {
      case 1:
        return (
          <Step1Identity
            {...commonProps}
            onSave={(data) => handleStepSave(1, data)}
          />
        );
      case 2:
        return (
          <Step2Visa
            {...commonProps}
            onSave={(data) => handleStepSave(2, data)}
          />
        );
      case 3:
        return (
          <Step3Korean
            {...commonProps}
            onSave={(data) => handleStepSave(3, data)}
          />
        );
      case 4:
        return (
          <Step4Education
            {...commonProps}
            onSave={(data) => handleStepSave(4, data)}
          />
        );
      case 5:
        return (
          <Step5Delta
            {...commonProps}
            onSave={(data) => handleStepSave(5, data)}
          />
        );
      case 6:
        return (
          <Step6Career
            {...commonProps}
            onSave={(data) => handleStepSave(6, data)}
          />
        );
      case 7:
        return (
          <Step7Preferences
            {...commonProps}
            onSave={(data) => handleStepSave(7, data)}
          />
        );
      default:
        return null;
    }
  };

  // === 로딩 상태 / Loading state ===
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-500">
          {/* 프로필 불러오는 중... / Loading profile... */}
          프로필 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-6 md:max-w-2xl">
        {/* === 페이지 헤더 / Page header === */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {/* 내 프로필 완성하기 / Complete My Profile */}
              내 프로필 완성하기
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {/* 프로필을 완성하면 더 정확한 채용 매칭을 받을 수 있습니다 */}
              프로필을 완성하면 더 정확한 채용 매칭을 받을 수 있습니다
            </p>
            <p className="text-[10px] text-gray-400">
              Complete your profile for better job matching
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2.5 rounded-xl hover:bg-gray-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="새로고침 / Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </header>

        {/* === 완성도 도넛 차트 / Completion donut chart === */}
        <section className="flex flex-col items-center mb-6" aria-label="프로필 완성도 / Profile completion">
          <CompletionDonut
            percent={wizardState.overallCompletion}
            size={160}
            strokeWidth={12}
          />

          {/* 완성도 안내 메시지 / Completion guide message */}
          <div className="mt-3 text-center">
            {wizardState.overallCompletion === 100 ? (
              <div className="flex items-center gap-1.5 text-green-600">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">
                  {/* 프로필 완성! 채용 매칭 준비 완료 / Profile complete! Ready for matching */}
                  프로필 완성! 채용 매칭 준비 완료
                </span>
              </div>
            ) : wizardState.overallCompletion >= 60 ? (
              <p className="text-xs text-blue-600 font-medium">
                {/* 거의 다 왔습니다! 나머지 블록도 완성해보세요 / Almost there! Complete the rest */}
                거의 다 왔습니다! 나머지 블록도 완성해보세요
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                {/* 아래 블록을 클릭하여 프로필을 채워보세요 / Click blocks below to fill your profile */}
                아래 블록을 클릭하여 프로필을 채워보세요
              </p>
            )}
          </div>
        </section>

        {/* === 뱃지 행 / Badge row === */}
        <section
          className="mb-6 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
          aria-label="프로필 뱃지 / Profile badges"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              {/* 달성 뱃지 / Achievement Badges */}
              달성 뱃지
            </h2>
            <span className="text-[10px] text-gray-400">
              {wizardState.badges.filter((b) => b.status === 'earned').length}/{wizardState.badges.length}
            </span>
          </div>
          <BadgeRow badges={wizardState.badges} />
        </section>

        {/* === 블록 타일 그리드 / Block tile grid === */}
        <section aria-label="프로필 블록 / Profile blocks">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700">
              {/* 프로필 항목 / Profile Items */}
              프로필 항목
            </h2>
            <span className="text-xs text-gray-400">
              {/* N/7 완료 / N/7 completed */}
              {blocksWithLock.filter((b) => b.status === 'completed').length}/7 완료
            </span>
          </div>

          {/* 그리드: 모바일 2열, 태블릿 3열, 데스크톱 4열 / Grid layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {blocksWithLock.map((block) => (
              <BlockTile
                key={block.key}
                block={block}
                onClick={handleBlockClick}
              />
            ))}
          </div>
        </section>

        {/* === 거주 유형 정보 (완료된 경우) / Residency info (if completed) === */}
        {wizardState.hasCompletedResidency && wizardState.residencyType && (
          <section className="mt-6" aria-label="거주 상태 / Residency status">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">
                    {/* 거주 유형 / Residency Type */}
                    거주 유형
                  </p>
                  <p className="text-sm font-bold text-gray-700 mt-0.5">
                    {wizardState.residencyType === 'domestic'
                      ? '한국 국내 거주 / Living in Korea'
                      : '해외 거주 (입국 예정) / Overseas'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResidencyModal(true)}
                  className="rounded-xl text-xs"
                  aria-label="거주 유형 변경 / Change residency type"
                >
                  변경
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* === 하단 CTA / Bottom CTA === */}
        {wizardState.overallCompletion < 100 && (
          <section className="mt-8 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
              <p className="text-sm font-bold text-blue-800 mb-1">
                {/* 매칭 정확도를 높이세요 / Improve matching accuracy */}
                매칭 정확도를 높이세요
              </p>
              <p className="text-xs text-blue-600 mb-3">
                {/* 미완성 블록을 채우면 더 정확한 공고 추천을 받을 수 있습니다 */}
                미완성 블록을 채우면 더 정확한 공고 추천을 받을 수 있습니다
              </p>
              <p className="text-[10px] text-blue-500 mb-3">
                Fill incomplete blocks for more accurate job recommendations
              </p>
              {/* 미완성 블록 중 첫 번째로 이동 / Navigate to first incomplete block */}
              {(() => {
                const nextBlock = blocksWithLock.find(
                  (b) => b.status !== 'completed' && !b.isLocked
                );
                if (!nextBlock) return null;
                return (
                  <Button
                    onClick={() => handleBlockClick(nextBlock)}
                    className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200"
                    aria-label={`${nextBlock.name} 시작하기 / Start ${nextBlock.nameEn}`}
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    {nextBlock.name} 시작하기 / Start {nextBlock.nameEn}
                  </Button>
                );
              })()}
            </div>
          </section>
        )}
      </div>

      {/* === 거주 분기 모달 (Step 0) / Residency modal (Step 0) === */}
      <ResidencyModal
        isOpen={showResidencyModal}
        onSelect={handleResidencySelect}
        onClose={() => setShowResidencyModal(false)}
      />

      {/* === 블록 폼 모달/패널 / Block form modal/panel === */}
      <BlockModal
        block={activeBlock}
        isOpen={isBlockModalOpen}
        onClose={handleBlockModalClose}
      >
        {activeBlock && renderStepForm(activeBlock)}
      </BlockModal>
    </div>
  );
}
