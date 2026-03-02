'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

/**
 * 프로필 완성도 체크 기준 (8단계, 각 12.5%)
 * Profile completion criteria (8 steps, 12.5% each)
 *
 * 1. 국적 입력 (nationality)
 * 2. 생년월일 입력 (birthDate)
 * 3. 학력 입력 (educations)
 * 4. 언어능력 입력 (topikLevel or kiipLevel)
 * 5. 희망 직종 입력 (preferredJobTypes)
 * 6. 희망 지역 입력 (preferredRegions)
 * 7. 경력 입력 (workExperiences) — 미입력이면 충족으로 간주
 * 8. 비자 인증 완료 (visa verification APPROVED)
 */

// 이력서 API 응답 필드 / Resume API response fields
interface ResumeData {
  id?: number;
  nationality?: string | null;
  birthDate?: string | null;
  educations?: unknown[] | null;
  workExperiences?: unknown[] | null;
  topikLevel?: number | null;
  kiipLevel?: number | null;
  preferredJobTypes?: string[] | null;
  preferredRegions?: string[] | null;
  preferredSalary?: number | null;
}

// 비자 인증 API 응답 필드 / Visa verification API response fields
interface VisaVerificationData {
  status?: string;
  verificationStatus?: string;
}

export interface ProfileCompletionData {
  completion: number;       // 0~100 (12.5% 단위, 반올림) / 0-100 (rounded)
  hasResume: boolean;       // 이력서 생성 여부 / Resume exists
  resumeCount: number;      // 0 or 1 (이력서 개수 / Resume count)
  isLoading: boolean;
  /** 각 체크포인트별 완성 여부 / Per-checkpoint completion status */
  checkpoints: {
    nationality: boolean;
    birthDate: boolean;
    education: boolean;
    language: boolean;
    preferredJobTypes: boolean;
    preferredRegions: boolean;
    experience: boolean;
    visaVerification: boolean;
  };
}

const defaultCheckpoints = {
  nationality: false,
  birthDate: false,
  education: false,
  language: false,
  preferredJobTypes: false,
  preferredRegions: false,
  experience: false,
  visaVerification: false,
};

const defaultData: ProfileCompletionData = {
  completion: 0,
  hasResume: false,
  resumeCount: 0,
  isLoading: true,
  checkpoints: { ...defaultCheckpoints },
};

const TOTAL_CHECKPOINTS = 8;

/**
 * 개인회원 프로필 완성도 훅 / Worker profile completion hook
 * - GET /api/resumes/me: 이력서 필드 확인
 * - GET /api/visa-verification/me: 비자 인증 상태 확인
 * 완성도는 8개 체크포인트로 계산 (각 12.5%)
 * Completion = 8 checkpoints (12.5% each)
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

    // 8개 체크포인트 계산 / Calculate 8 checkpoints
    const checkpoints = { ...defaultCheckpoints };

    // 1. 국적 입력 여부 / Nationality filled
    checkpoints.nationality = !!resume?.nationality;

    // 2. 생년월일 입력 여부 / Birth date filled
    checkpoints.birthDate = !!resume?.birthDate;

    // 3. 학력 입력 여부 / Education entries exist
    checkpoints.education = Array.isArray(resume?.educations) && (resume.educations?.length ?? 0) > 0;

    // 4. 언어능력 입력 여부 (TOPIK 또는 KIIP) / Language level (TOPIK or KIIP)
    const topik = resume?.topikLevel;
    const kiip = resume?.kiipLevel;
    checkpoints.language = (topik !== null && topik !== undefined && topik !== 0)
      || (kiip !== null && kiip !== undefined && kiip !== 0);

    // 5. 희망 직종 입력 여부 / Preferred job types filled
    checkpoints.preferredJobTypes = Array.isArray(resume?.preferredJobTypes)
      && (resume.preferredJobTypes?.length ?? 0) > 0;

    // 6. 희망 지역 입력 여부 / Preferred regions filled
    checkpoints.preferredRegions = Array.isArray(resume?.preferredRegions)
      && (resume.preferredRegions?.length ?? 0) > 0;

    // 7. 경력 입력 여부 (없어도 이력서 생성 시 충족으로 처리) / Experience (satisfied if resume exists)
    checkpoints.experience = resume !== null;

    // 8. 비자 인증 완료 여부 / Visa verification approved
    checkpoints.visaVerification = visaStatus === 'APPROVED';

    const points = Object.values(checkpoints).filter(Boolean).length;
    const completion = Math.round((points / TOTAL_CHECKPOINTS) * 100);

    setData({
      completion,
      hasResume: resume !== null,
      resumeCount: resume !== null ? 1 : 0,
      isLoading: false,
      checkpoints,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return data;
}
