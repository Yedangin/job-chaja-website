'use client';

/**
 * 완료 축하 화면 컴포넌트 / Completion celebration component
 * 위저드 완료 후 축하 메시지와 다음 단계 안내를 표시합니다.
 * Shows celebration message and next steps after wizard completion.
 */

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { WizardFormData } from '../types';

interface CompletionCelebrationProps {
  /** 폼 데이터 / Form data */
  formData: WizardFormData;
  /** 대시보드 이동 핸들러 / Navigate to dashboard handler */
  onGoToDashboard: () => void;
  /** 프로필 확인 핸들러 / View profile handler */
  onViewProfile: () => void;
}

export default function CompletionCelebration({
  formData,
  onGoToDashboard,
  onViewProfile,
}: CompletionCelebrationProps) {
  // 애니메이션 단계 / Animation phases
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 단계별 애니메이션 타이머 / Phased animation timers
    const timers = [
      setTimeout(() => setPhase(1), 300),   // 컨페티 등장 / Confetti appears
      setTimeout(() => setPhase(2), 800),   // 메시지 등장 / Message appears
      setTimeout(() => setPhase(3), 1500),  // 프로필 요약 / Profile summary
      setTimeout(() => setPhase(4), 2200),  // CTA 버튼 / CTA buttons
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // 프로필 완성도 계산 / Calculate profile completeness
  const completeness = calculateCompleteness(formData);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      {/* 컨페티 효과 / Confetti effect */}
      {phase >= 1 && (
        <div className="relative w-full max-w-md">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-2">
            {['🎉', '🎊', '✨', '🌟', '🎈'].map((emoji, i) => (
              <span
                key={i}
                className="text-3xl animate-bounce"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationDuration: '1s',
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 축하 메시지 / Celebration message */}
      {phase >= 2 && (
        <div
          className={cn(
            'text-center transition-all duration-700',
            'opacity-0 translate-y-4',
            phase >= 2 && 'opacity-100 translate-y-0'
          )}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            프로필 완성!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Profile Complete!
          </p>
          <p className="text-gray-500 max-w-sm mx-auto">
            {formData.firstName}님, 잡차자에서 맞춤 일자리를 찾아보세요.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {formData.firstName}, find your perfect job on JobChaJa!
          </p>
        </div>
      )}

      {/* 프로필 요약 카드 / Profile summary card */}
      {phase >= 3 && (
        <div
          className={cn(
            'mt-8 w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-lg p-6',
            'transition-all duration-700',
            'opacity-0 scale-95',
            phase >= 3 && 'opacity-100 scale-100'
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {formData.firstName} {formData.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {formData.visaType || '비자 미입력'}
              </p>
            </div>
          </div>

          {/* 완성도 바 / Completeness bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600">프로필 완성도 (Completeness)</span>
              <span className="font-semibold text-blue-600">{completeness}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-1000 ease-out',
                  completeness >= 80 ? 'bg-green-500' :
                  completeness >= 50 ? 'bg-amber-500' :
                  'bg-red-500'
                )}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          {/* 요약 항목 / Summary items */}
          <div className="space-y-2 text-sm">
            <SummaryItem
              label="국적 (Nationality)"
              value={formData.nationality || '-'}
              isSet={!!formData.nationality}
            />
            <SummaryItem
              label="비자 (Visa)"
              value={formData.visaType || '-'}
              isSet={!!formData.visaType}
            />
            <SummaryItem
              label="한국어 (Korean)"
              value={formData.koreanSelfAssessment ? `Level ${formData.koreanSelfAssessment}` : '-'}
              isSet={formData.koreanSelfAssessment > 0}
            />
            <SummaryItem
              label="희망 직종 (Preferred Job)"
              value={formData.desiredJobTypes.length > 0 ? `${formData.desiredJobTypes.length}개 선택` : '-'}
              isSet={formData.desiredJobTypes.length > 0}
            />
          </div>
        </div>
      )}

      {/* CTA 버튼 / CTA buttons */}
      {phase >= 4 && (
        <div
          className={cn(
            'mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm',
            'transition-all duration-700',
            'opacity-0 translate-y-4',
            phase >= 4 && 'opacity-100 translate-y-0'
          )}
        >
          <Button
            onClick={onGoToDashboard}
            size="lg"
            className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 h-12 text-base"
          >
            일자리 찾기 (Find Jobs)
          </Button>
          <Button
            onClick={onViewProfile}
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl h-12 text-base"
          >
            프로필 확인 (View Profile)
          </Button>
        </div>
      )}
    </div>
  );
}

// === 요약 항목 컴포넌트 / Summary item component ===
function SummaryItem({
  label,
  value,
  isSet,
}: {
  label: string;
  value: string;
  isSet: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-gray-500">{label}</span>
      <span className={cn(
        'font-medium',
        isSet ? 'text-gray-900' : 'text-gray-300'
      )}>
        {isSet && <span className="text-green-500 mr-1">✓</span>}
        {value}
      </span>
    </div>
  );
}

/**
 * 프로필 완성도 계산 / Calculate profile completeness percentage
 */
function calculateCompleteness(data: WizardFormData): number {
  let filled = 0;
  let total = 0;

  // 필수 필드 체크 / Check required fields
  const checks = [
    !!data.residenceStatus,
    !!data.firstName,
    !!data.lastName,
    !!data.nationality,
    !!data.birthDate,
    !!data.gender,
    !!data.phone,
    !!data.visaType,
    data.koreanSelfAssessment > 0,
    data.desiredJobTypes.length > 0,
    data.desiredLocations.length > 0,
    !!data.workSchedule,
    !!data.availableDate,
  ];

  total = checks.length;
  filled = checks.filter(Boolean).length;

  // 선택적 필드 보너스 / Optional fields bonus
  const optionalChecks = [
    !!data.profilePhoto,
    !!data.address,
    !!data.visaSubType,
    !!data.arcNumber,
    !!data.koreanTestType,
    data.educations.length > 0,
    data.careers.length > 0,
  ];

  const optionalFilled = optionalChecks.filter(Boolean).length;
  const optionalTotal = optionalChecks.length;

  // 가중 평균: 필수 70% + 선택 30% / Weighted: required 70% + optional 30%
  const requiredPercent = total > 0 ? (filled / total) * 70 : 0;
  const optionalPercent = optionalTotal > 0 ? (optionalFilled / optionalTotal) * 30 : 0;

  return Math.round(requiredPercent + optionalPercent);
}
