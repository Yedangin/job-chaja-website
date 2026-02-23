/**
 * 알바 API 클라이언트 (백엔드 연동)
 * Alba API client (backend integration)
 */

import type { AlbaJobFormData, AlbaVisaMatchingResponse } from './components/alba-types';

const API_BASE = '/api';

/**
 * 비자 매칭 요청 / Request visa matching
 * POST /api/alba/visa-matching
 */
export async function matchAlbaVisa(form: AlbaJobFormData): Promise<AlbaVisaMatchingResponse> {
  const body = {
    jobCategoryCode: form.jobCategoryCode,
    weeklyHours: form.weeklyHours,
    schedule: form.schedule.map(s => ({
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
    address: {
      sido: form.address.sido,
      sigungu: form.address.sigungu,
      detail: form.address.detail || '-',
      lat: form.address.lat || 37.5665,
      lng: form.address.lng || 126.978,
    },
    hourlyWage: form.hourlyWage,
  };

  const res = await fetch(`${API_BASE}/alba/visa-matching`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(
      errData?.message ?? `알바 비자 매칭 실패 (${res.status}) / Alba visa matching failed`,
    );
  }

  return res.json();
}

/**
 * 알바 공고 등록 / Create alba job posting
 * POST /api/alba/jobs
 */
export async function createAlbaJob(form: AlbaJobFormData): Promise<{ jobId: string }> {
  try {
    const res = await fetch(`${API_BASE}/alba/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      return res.json();
    }
  } catch {
    console.warn('Alba job create API not reachable');
  }

  // 백엔드 미연결 시 목 응답 / Mock response when not connected
  return { jobId: 'mock-' + Date.now() };
}

