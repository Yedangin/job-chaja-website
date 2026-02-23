/**
 * 정규채용 공고 API 함수
 * Fulltime job posting API functions
 */

import type {
  FulltimeJobFormData,
  FulltimeVisaMatchingResponse,
  E7JobCategory,
} from './components/fulltime-types';

/**
 * E-7 직종 목록 응답 타입 / E-7 categories response type
 */
export interface E7CategoriesResponse {
  categories: E7JobCategory[];
  e71Count: number;
  e72Count: number;
  e73Count: number;
  totalCount: number;
  basedOn: string;
}

/**
 * E-7 직종 목록 조회 (백엔드 API)
 * Fetch E-7 job categories from backend API
 * 웹/앱 공통 드롭다운 데이터 / Shared dropdown data for web and app
 */
export async function fetchE7Categories(): Promise<E7CategoriesResponse> {
  const response = await fetch('/api/fulltime-visa/e7-categories', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('E-7 직종 목록 조회 실패');

  return response.json();
}

/**
 * 정규채용 비자 매칭 API 호출
 * Call fulltime visa matching API
 */
export async function matchFulltimeVisa(
  form: FulltimeJobFormData
): Promise<FulltimeVisaMatchingResponse> {
  const response = await fetch('/api/fulltime-visa/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) throw new Error('비자 매칭 실패');

  return response.json();
}

/**
 * 정규채용 공고 등록 API 호출
 * Submit fulltime job posting
 */
export async function createFulltimeJob(
  form: FulltimeJobFormData
): Promise<void> {
  const response = await fetch('/api/fulltime/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!response.ok) throw new Error('공고 등록 실패');
}
