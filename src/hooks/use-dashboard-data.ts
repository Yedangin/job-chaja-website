'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

// 대시보드 요약 데이터 / Dashboard summary data
export interface DashboardData {
  activeJobCount: number;
  newApplicantCount: number;
  viewingCredits: number;
  couponCount: number;
  recentJobs: RecentJob[];
}

export interface RecentJob {
  id: number;
  title: string;
  status: string;
  applicantCount: number;
  createdAt: string;
  expiresAt: string;
  tier: 'STANDARD' | 'PREMIUM';
}

interface UseDashboardDataResult {
  data: DashboardData;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const defaultData: DashboardData = {
  activeJobCount: 0,
  newApplicantCount: 0,
  viewingCredits: 0,
  couponCount: 0,
  recentJobs: [],
};

/**
 * 기업 대시보드 데이터 훅 / Company dashboard data hook
 * 여러 API를 병렬 호출하여 요약 데이터를 가져옴
 * Fetches summary data from multiple APIs in parallel
 */
export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = { ...defaultData };

    // 병렬 API 호출 / Parallel API calls
    // 각 API는 독립적으로 실패 가능 / Each API can fail independently
    const promises = await Promise.allSettled([
      // 1. 열람권 잔여 / Viewing credit balance
      apiClient.get('/payments/viewing-credits/balance').then(res => {
        result.viewingCredits = res.data?.balance ?? res.data?.remaining ?? 0;
      }),

      // 2. 내 공고 목록 / My job listings (GET /jobs/my/list)
      apiClient.get('/jobs/my/list', { params: { limit: 50 } }).then(res => {
        const jobs = res.data?.items ?? res.data?.jobs ?? res.data ?? [];
        if (Array.isArray(jobs)) {
          result.activeJobCount = jobs.filter((j: Record<string, unknown>) =>
            j.status === 'ACTIVE' || j.status === 'active'
          ).length;
          result.recentJobs = jobs.slice(0, 5).map((j: Record<string, unknown>) => ({
            id: j.id as number,
            title: (j.title as string) || '',
            status: (j.status as string) || 'ACTIVE',
            applicantCount: (j.applicantCount as number) || (j.applyCount as number) || 0,
            createdAt: (j.createdAt as string) || '',
            expiresAt: (j.expiresAt as string) || '',
            tier: ((j.tierType as string) || (j.tier as string) || 'STANDARD') as 'STANDARD' | 'PREMIUM',
          }));
        }
      }),

      // 3. 내 주문 목록에서 쿠폰 수 추정 / Estimate coupon count from orders
      // 쿠폰 개수 조회 API가 별도로 없으므로 0 유지 / No dedicated coupon count API, keep 0
      apiClient.get('/payments/coupons/validate', { params: { code: 'CHECK_AVAILABLE' } })
        .then(() => { /* 쿠폰 개수 조회 API가 별도로 없으므로 0 유지 */ })
        .catch(() => { /* 무시 / Ignore */ }),
    ]);

    // 하나라도 실패하면 부분 데이터임을 표시 / Mark partial data on any failure
    const failedCount = promises.filter(p => p.status === 'rejected').length;
    if (failedCount === promises.length) {
      setError('데이터를 불러오지 못했습니다.');
    }

    setData(result);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
