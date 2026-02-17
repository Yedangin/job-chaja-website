'use client';

import { useState, useCallback, useEffect } from 'react';
import { jobCreateApi, calculateOfferedSalary } from '../api/job-create.api';
import type {
  VisaMatchResult,
  CorpProfileForMatching,
  BoardType,
} from '../types/job-create.types';
import { toast } from '@/lib/toast';

/**
 * 비자 매칭 훅 / Visa matching hook
 * 기업 프로필 로드 + 비자 매칭 실행
 * Loads corp profile + runs visa matching
 */
export function useVisaMatching() {
  const [corpProfile, setCorpProfile] = useState<CorpProfileForMatching | null>(null);
  const [matchResult, setMatchResult] = useState<VisaMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // 기업 프로필 로드 / Load corporate profile
  useEffect(() => {
    const load = async () => {
      setIsProfileLoading(true);
      const profile = await jobCreateApi.getCorporateProfile();
      setCorpProfile(profile);
      setIsProfileLoading(false);
    };
    load();
  }, []);

  // 비자 매칭 실행 / Run visa matching
  const runMatching = useCallback(async (
    boardType: BoardType,
    salaryType: string,
    salaryAmount: string,
    address: string,
  ): Promise<VisaMatchResult | null> => {
    if (!corpProfile) {
      toast.error('기업 인증 정보를 불러올 수 없습니다.');
      return null;
    }

    const offeredSalary = calculateOfferedSalary(salaryType, salaryAmount);
    if (offeredSalary <= 0) {
      toast.error('급여 정보를 입력해주세요.');
      return null;
    }

    setIsLoading(true);
    try {
      const result = await jobCreateApi.evaluateVisas({
        ksicCode: corpProfile.ksicCode || 'G4711',
        companySizeType: corpProfile.companySizeType || 'SME',
        employeeCountKorean: corpProfile.employeeCountKorean || 5,
        employeeCountForeign: corpProfile.employeeCountForeign || 0,
        annualRevenue: corpProfile.annualRevenue || 10000,
        addressRoad: corpProfile.addressRoad || address || '서울',
        jobType: boardType,
        offeredSalary,
      });
      setMatchResult(result);
      return result;
    } catch {
      toast.error('비자 매칭 분석에 실패했습니다.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [corpProfile]);

  return {
    corpProfile,
    matchResult,
    setMatchResult,
    isLoading,
    isProfileLoading,
    runMatching,
  };
}
