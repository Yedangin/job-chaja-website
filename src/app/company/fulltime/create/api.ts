/**
 * 정규채용 공고 API 함수
 * Fulltime job posting API functions
 */

import type {
  FulltimeJobFormData,
  FulltimeVisaMatchingResponse,
} from './components/fulltime-types';

/**
 * 비자 필터링 규칙 타입
 * Visa filter rule type
 */
export interface VisaFilterRule {
  visaCode: string;
  visaName: string;
  visaNameEn: string;
  hiringTrack: string;
  minSalary: number | null;
  minEducation: string | null;
  requiresOverseasHire: boolean;
  allowedJobCategories: string[] | null;
  notes: string | null;
  requiresEntryLevel?: boolean; // 신입 채용만 가능 여부 (D-2만 true)
}

/**
 * 비자 필터링 규칙 응답 타입
 * Visa filter rules response type
 */
export interface VisaFilterRulesResponse {
  visas: VisaFilterRule[];
  totalCount: number;
  retrievedAt: string;
}

/**
 * 비자 필터링 규칙 조회 API 호출
 * Fetch visa filter rules API
 */
export async function fetchVisaFilterRules(): Promise<VisaFilterRulesResponse> {
  try {
    const response = await fetch('/api/fulltime-visa/filter-rules', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('비자 규칙 조회 실패');

    return await response.json();
  } catch (error) {
    console.error('비자 규칙 조회 API 오류:', error);
    throw error;
  }
}

/**
 * 정규채용 비자 매칭 API 호출
 * Call fulltime visa matching API
 */
export async function matchFulltimeVisa(
  form: FulltimeJobFormData
): Promise<FulltimeVisaMatchingResponse> {
  try {
    const response = await fetch('/api/fulltime-visa/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) throw new Error('비자 매칭 실패');

    return await response.json();
  } catch (error) {
    console.error('비자 매칭 API 오류:', error);
    throw error;
  }
}

/**
 * 정규채용 공고 등록 API 호출
 * Submit fulltime job posting
 */
export async function createFulltimeJob(
  form: FulltimeJobFormData
): Promise<void> {
  try {
    const response = await fetch('/api/fulltime/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) throw new Error('공고 등록 실패');
  } catch (error) {
    console.error('공고 등록 API 오류:', error);
    throw error;
  }
}
