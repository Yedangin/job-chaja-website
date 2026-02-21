'use client';

/**
 * StepSummary — 완료된 Step의 요약 정보를 반환하는 유틸리티
 * StepSummary — Utility that returns summary info for completed steps
 *
 * 각 Step 완료 시 타임라인 노드 아래에 표시할 간결한 요약 텍스트 생성
 * Generates concise summary text to display below timeline nodes when step is completed
 */

import type { WizardFormData } from './wizard-types';

/**
 * 스텝별 요약 텍스트 생성 / Generate summary text per step
 * @param step - 스텝 인덱스 / Step index
 * @param data - 위저드 폼 데이터 / Wizard form data
 * @returns 요약 문자열 또는 undefined / Summary string or undefined
 */
export function getStepSummary(step: number, data: WizardFormData): string | undefined {
  switch (step) {
    case 0: {
      // 거주 정보 요약 / Residency summary
      const parts: string[] = [];
      if (data.residencyType) parts.push(data.residencyType === 'long_term' ? '장기체류' : '단기체류');
      if (data.residenceSido) parts.push(data.residenceSido);
      return parts.length > 0 ? parts.join(' · ') : undefined;
    }
    case 1: {
      // 신원 정보 요약 / Identity summary
      const parts: string[] = [];
      if (data.lastName) parts.push(data.lastName);
      if (data.nationality) parts.push(data.nationality);
      return parts.length > 0 ? parts.join(' · ') : undefined;
    }
    case 2: {
      // 비자 정보 요약 / Visa summary
      const parts: string[] = [];
      if (data.visaType) parts.push(data.visaType);
      if (data.visaSubType) parts.push(data.visaSubType);
      return parts.length > 0 ? parts.join(' ') : undefined;
    }
    case 3: {
      // 한국어 요약 / Korean language summary
      const parts: string[] = [];
      if (data.topikLevel) parts.push(`TOPIK ${data.topikLevel}급`);
      if (data.koreanAbility) parts.push(data.koreanAbility);
      return parts.length > 0 ? parts.join(' · ') : undefined;
    }
    case 4: {
      // 학력 요약 / Education summary
      const parts: string[] = [];
      if (data.educationLevel) parts.push(data.educationLevel);
      if (data.major) parts.push(data.major);
      return parts.length > 0 ? parts.join(' · ') : undefined;
    }
    case 5: {
      // DELTA 요약 / DELTA summary
      if (data.deltaScore !== undefined) {
        return `DELTA ${data.deltaScore}점`;
      }
      return undefined;
    }
    case 6: {
      // 경력 요약 / Experience summary
      const parts: string[] = [];
      if (data.totalExperienceYears !== undefined) parts.push(`${data.totalExperienceYears}년`);
      if (data.experienceField) parts.push(data.experienceField);
      return parts.length > 0 ? parts.join(' · ') : undefined;
    }
    case 7: {
      // 희망 조건 요약 / Preferences summary
      const parts: string[] = [];
      if (data.desiredJobType) parts.push(data.desiredJobType);
      if (data.desiredSido) parts.push(data.desiredSido);
      return parts.length > 0 ? parts.join(' · ') : undefined;
    }
    default:
      return undefined;
  }
}
