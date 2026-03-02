'use client';

import { useState, useEffect } from 'react';

/**
 * 최저임금 데이터 인터페이스 / Minimum wage data interface
 */
export interface MinimumWageData {
  year: number;
  hourlyWage: number;
  dailyWage: number;
  monthlyWage: number;
  effectiveFrom: string;
  effectiveTo: string;
  legalBasis: string;
}

/**
 * 기본 폴백 값 (API 실패 시 사용) / Default fallback (used when API fails)
 * 주의: 이 값은 API가 실패할 때만 사용되며, 정상 시 항상 서버 값을 사용
 * Note: Only used when API fails; always use server value when available
 */
const FALLBACK_MINIMUM_WAGE: MinimumWageData = {
  year: 2025,
  hourlyWage: 10_030,
  dailyWage: 80_240,
  monthlyWage: 2_096_270,
  effectiveFrom: '2025-01-01',
  effectiveTo: '2025-12-31',
  legalBasis: 'fallback',
};

// 모듈 레벨 캐시 (SPA 내 재요청 방지) / Module-level cache (prevent re-fetch in SPA)
let cachedData: MinimumWageData | null = null;
let fetchPromise: Promise<MinimumWageData> | null = null;

async function fetchMinimumWage(): Promise<MinimumWageData> {
  if (cachedData) return cachedData;

  // 이미 진행 중인 요청이 있으면 재사용 / Reuse in-flight request
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('/api/platform-config/minimum-wage', {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: MinimumWageData = await res.json();
      cachedData = data;
      return data;
    } catch {
      // API 실패 시 폴백 사용 / Use fallback on API failure
      return FALLBACK_MINIMUM_WAGE;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

/**
 * 현재 최저임금 데이터를 가져오는 훅 / Hook to fetch current minimum wage
 *
 * - 서버에서 최저임금 데이터를 가져옴 (GET /platform-config/minimum-wage)
 *   Fetches from server (GET /platform-config/minimum-wage)
 * - 모듈 레벨 캐시로 SPA 내 중복 요청 방지
 *   Module-level cache prevents duplicate requests within SPA
 * - API 실패 시 안전한 폴백 값 사용
 *   Uses safe fallback value on API failure
 */
export function useMinimumWage(): MinimumWageData {
  const [data, setData] = useState<MinimumWageData>(
    cachedData ?? FALLBACK_MINIMUM_WAGE,
  );

  useEffect(() => {
    fetchMinimumWage().then(setData);
  }, []);

  return data;
}

/**
 * 최저임금 시급만 가져오는 편의 훅 / Convenience hook for hourly wage only
 */
export function useMinimumHourlyWage(): number {
  return useMinimumWage().hourlyWage;
}
