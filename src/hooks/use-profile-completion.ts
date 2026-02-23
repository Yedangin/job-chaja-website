'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

// 프로필 완성도 체크 기준 (5단계 × 20%) / Profile completion criteria (5 steps × 20%)
// 1. 국적 입력 (nationality)
// 2. 학력 입력 (educations)
// 3. 언어능력 입력 (topikLevel or kiipLevel)
// 4. 희망조건 입력 (preferredJobTypes)
// 5. 비자 인증 완료 (visa verification APPROVED)

// 이력서 API 응답 필드 / Resume API response fields
interface ResumeData {
  id?: number;
  nationality?: string | null;
  educations?: unknown[] | null;
  topikLevel?: number | null;
  kiipLevel?: number | null;
  preferredJobTypes?: string[] | null;
}

// 비자 인증 API 응답 필드 / Visa verification API response fields
interface VisaVerificationData {
  status?: string;
  verificationStatus?: string;
}

export interface ProfileCompletionData {
  completion: number;       // 0~100 (20% 단위)
  hasResume: boolean;       // 이력서 생성 여부 / Resume exists
  resumeCount: number;      // 0 or 1 (이력서 개수 / Resume count)
  isLoading: boolean;
}

const defaultData: ProfileCompletionData = {
  completion: 0,
  hasResume: false,
  resumeCount: 0,
  isLoading: true,
};

/**
 * 개인회원 프로필 완성도 훅 / Worker profile completion hook
 * - GET /api/resumes/me: 이력서 필드 확인
 * - GET /api/visa-verification/me: 비자 인증 상태 확인
 * 완성도는 5개 체크포인트 × 20% 로 계산
 * Completion = 5 checkpoints × 20% each
 */
export function useProfileCompletion(): ProfileCompletionData {
  const [data, setData] = useState<ProfileCompletionData>(defaultData);

  const fetchData = useCallback(async () => {
    setData(prev => ({ ...prev, isLoading: true }));

    // 병렬 조회, 각 API 독립 실패 허용 / Parallel fetch, each can fail independently
    const [resumeResult, visaResult] = await Promise.allSettled([
      apiClient.get<ResumeData>('/resumes/me'),
      apiClient.get<VisaVerificationData>('/visa-verification/me'),
    ]);

    // 이력서 데이터 추출 / Extract resume data
    const resume: ResumeData | null =
      resumeResult.status === 'fulfilled' && resumeResult.value.data?.id
        ? resumeResult.value.data
        : null;

    // 비자 인증 상태 추출 / Extract visa verification status
    const visaStatus: string | null =
      visaResult.status === 'fulfilled' && visaResult.value.data
        ? (visaResult.value.data.status ?? visaResult.value.data.verificationStatus ?? null)
        : null;

    // 완성도 체크포인트 계산 / Calculate completion checkpoints
    let points = 0;

    // 1. 국적 입력 여부 / Nationality filled
    if (resume?.nationality) points += 1;

    // 2. 학력 입력 여부 / Education entries exist
    if (Array.isArray(resume?.educations) && (resume.educations?.length ?? 0) > 0) points += 1;

    // 3. 언어능력 입력 여부 (TOPIK 또는 KIIP) / Language level (TOPIK or KIIP)
    const topik = resume?.topikLevel;
    const kiip = resume?.kiipLevel;
    if (topik !== null && topik !== undefined && topik !== 0) points += 1;
    else if (kiip !== null && kiip !== undefined && kiip !== 0) points += 1;

    // 4. 희망 직종 입력 여부 / Preferred job types filled
    if (Array.isArray(resume?.preferredJobTypes) && (resume.preferredJobTypes?.length ?? 0) > 0) points += 1;

    // 5. 비자 인증 완료 여부 / Visa verification approved
    if (visaStatus === 'APPROVED') points += 1;

    const completion = points * 20; // 5단계 × 20% / 5 steps × 20%

    setData({
      completion,
      hasResume: resume !== null,
      resumeCount: resume !== null ? 1 : 0,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return data;
}
