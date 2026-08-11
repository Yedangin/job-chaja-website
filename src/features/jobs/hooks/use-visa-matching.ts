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
      try {
        const profile = await jobCreateApi.getCorporateProfile();
        setCorpProfile(profile);
      } catch {
        setCorpProfile(null);
      } finally {
        setIsProfileLoading(false);
      }
    };
    void load();
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

    if (!corpProfile.ksicCode || !corpProfile.addressRoad || !corpProfile.companySizeType) {
      toast.error('정확한 판단을 위해 기업 인증 정보의 업종·주소·규모를 먼저 입력해주세요.');
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
        ksicCode: corpProfile.ksicCode,
        companySizeType: corpProfile.companySizeType,
        employeeCountKorean: corpProfile.employeeCountKorean,
        employeeCountForeign: corpProfile.employeeCountForeign,
        annualRevenue: corpProfile.annualRevenue,
        addressRoad: corpProfile.addressRoad || address,
        jobType: boardType,
        offeredSalary,
      });
      setMatchResult(result);
      if (result.outcome === 'REVIEW_REQUIRED') {
        toast.error('검토 완료된 최신 정책이 준비되지 않아 비자 판단을 진행할 수 없습니다.');
        return null;
      }
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
