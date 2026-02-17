'use client';

import { ArrowLeft, ArrowRight, Save, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WizardStep } from '../types/job-create.types';

interface FormBottomBarProps {
  step: WizardStep;
  submitting: boolean;
  matchLoading: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onSave: () => void;
}

/**
 * 하단 고정 네비게이션 바 / Bottom fixed navigation bar
 * 이전/다음/등록 버튼 + 임시저장
 * Previous/Next/Submit buttons + draft save
 */
export function FormBottomBar({
  step,
  submitting,
  matchLoading,
  onBack,
  onNext,
  onSubmit,
  onSave,
}: FormBottomBarProps) {
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
      {/* 이전 버튼 / Back button */}
      <Button
        type="button"
        onClick={onBack}
        variant="ghost"
        disabled={step === 1}
        className="text-gray-500 hover:text-gray-800 gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> 이전
      </Button>

      <div className="flex items-center gap-2">
        {/* 임시저장 / Save draft */}
        <Button
          type="button"
          onClick={onSave}
          variant="outline"
          className="text-sm gap-1"
        >
          <Save className="w-3.5 h-3.5" /> 임시저장
        </Button>

        {step < 5 ? (
          /* 다음 버튼 / Next button */
          <Button
            type="button"
            onClick={onNext}
            disabled={matchLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-sm"
          >
            {step === 3 && matchLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                매칭 분석 중...
              </>
            ) : (
              <>
                다음 <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          /* 등록 버튼 / Submit button */
          <Button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-sm px-6"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            공고 등록하기 (무료)
          </Button>
        )}
      </div>
    </div>
  );
}
