/**
 * 알바 채용관 API 클라이언트
 * Alba recruitment API client
 */
import type {
  AlbaJobFormData,
  AlbaJobCreateResponse,
  AlbaVisaMatchingResponse,
  AlbaJobResponse,
  AlbaJobSearchResponse,
  PostStatus,
  ScheduleItem,
  Address,
} from './types';

/** API 기본 URL / API base URL */
const API_BASE = '/api/alba';

/**
 * 공통 fetch 래퍼 (세션 쿠키 포함)
 * Common fetch wrapper with session cookie
 */
async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorBody.message || `API Error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/**
 * 알바 공고 생성 / Create alba job posting
 */
export async function createAlbaJob(
  data: AlbaJobFormData
): Promise<AlbaJobCreateResponse> {
  return apiFetch<AlbaJobCreateResponse>(`${API_BASE}/jobs`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 알바 비자 매칭 (미리보기용 독립 호출)
 * Alba visa matching (independent call for preview)
 */
export async function matchAlbaVisa(params: {
  jobCategoryCode: string;
  weeklyHours: number;
  schedule: ScheduleItem[];
  address: Address;
  hourlyWage: number;
}): Promise<AlbaVisaMatchingResponse> {
  return apiFetch<AlbaVisaMatchingResponse>(`${API_BASE}/visa-matching`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 기업용 내 알바 공고 목록 / My alba job postings (company)
 */
export async function getMyAlbaJobs(params?: {
  status?: PostStatus;
  page?: number;
  limit?: number;
}): Promise<{ jobs: AlbaJobResponse[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return apiFetch(`${API_BASE}/jobs/my${qs ? `?${qs}` : ''}`);
}

/**
 * 알바 공고 상세 조회 / Get alba job detail
 */
export async function getAlbaJobDetail(id: string): Promise<AlbaJobResponse> {
  return apiFetch<AlbaJobResponse>(`${API_BASE}/jobs/${id}`);
}

/**
 * 구직자 알바 공고 검색 / Job seeker alba search
 */
export async function searchAlbaJobs(
  params: Record<string, string | number | string[] | undefined>
): Promise<AlbaJobSearchResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val === undefined || val === '') return;
    if (Array.isArray(val)) {
      val.forEach((v) => query.append(key, v));
    } else {
      query.set(key, String(val));
    }
  });
  return apiFetch<AlbaJobSearchResponse>(`${API_BASE}/jobs/search?${query.toString()}`);
}

/**
 * 프리미엄 공고 목록 (메인 영역용)
 * Premium job listings (for main area)
 */
export async function getPremiumAlbaJobs(params?: {
  sido?: string;
  sigungu?: string;
  visaCode?: string;
}): Promise<{ jobs: AlbaJobResponse[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.sido) query.set('sido', params.sido);
  if (params?.sigungu) query.set('sigungu', params.sigungu);
  if (params?.visaCode) query.set('visaCode', params.visaCode);
  const qs = query.toString();
  return apiFetch(`${API_BASE}/jobs/premium${qs ? `?${qs}` : ''}`);
}

/**
 * 알바 공고 상태 변경 / Change alba job status
 */
export async function updateAlbaJobStatus(
  id: string,
  status: 'ACTIVE' | 'CLOSED' | 'PAUSED'
): Promise<{ jobId: string; previousStatus: string; newStatus: string; updatedAt: string }> {
  return apiFetch(`${API_BASE}/jobs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * 프리미엄 노출 구매 / Purchase premium exposure
 */
export async function purchaseAlbaPremium(
  jobId: string
): Promise<{ orderNo: string; productCode: string; amount: number; paymentUrl: string; merchantUid: string }> {
  return apiFetch(`${API_BASE}/jobs/${jobId}/premium`, {
    method: 'POST',
    body: JSON.stringify({ durationDays: 14 }),
  });
}
