/**
 * 알바 API 클라이언트 (백엔드 연동)
 * Alba API client (backend integration)
 */

import type {
  AlbaJobFormData,
  AlbaVisaMatchingResponse,
  AlbaCategoriesResponse,
} from './components/alba-types';

const API_BASE = '/api';

/**
 * 알바 직종 목록 조회 (백엔드 API) / Fetch alba job categories from backend
 * GET /api/alba/categories
 *
 * 정규직 fetchE7Categories()와 동일 패턴
 * Same pattern as fulltime fetchE7Categories()
 */
export async function fetchAlbaCategories(): Promise<AlbaCategoriesResponse> {
  const res = await fetch(`${API_BASE}/alba/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(
      `알바 직종 목록 조회 실패 (${res.status}) / Alba categories fetch failed`,
    );
  }

  return res.json();
}

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
 * 한국어 수준 → 숫자 변환 / Korean level to number mapping
 */
function koreanLevelToNumber(level: AlbaJobFormData['koreanLevel']): number {
  const map: Record<string, number> = {
    NONE: 0,
    BASIC: 1,
    DAILY: 2,
    BUSINESS: 3,
  };
  return map[level] ?? 0;
}

/**
 * 스케줄 배열 → 요일 마스크 변환 / Schedule array to day-of-week mask
 * 월~일 순서 "1111100" 형태 / MON-SUN order "1111100" format
 */
function scheduleToDaysMask(schedule: AlbaJobFormData['schedule']): string {
  const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const activeDays = new Set(schedule.map((s) => s.dayOfWeek));
  return dayOrder.map((d) => (activeDays.has(d as any) ? '1' : '0')).join('');
}

/**
 * 비자 매칭 결과에서 허용 비자 코드 추출 / Extract allowed visa codes from match result
 */
function extractAllowedVisas(
  matchResult: AlbaVisaMatchingResponse | null,
): string {
  if (!matchResult) return '';
  const eligible = matchResult.eligible?.map((v) => v.visaCode) || [];
  const conditional = matchResult.conditional?.map((v) => v.visaCode) || [];
  return [...new Set([...eligible, ...conditional])].join(',');
}

/**
 * 알바 공고 등록 (실제 백엔드 API 연동)
 * Create alba job posting via backend POST /api/jobs/create
 *
 * 정규직 createFulltimeJob()과 동일 패턴: 생성(DRAFT) → 활성화(ACTIVE)
 * Same pattern as fulltime createFulltimeJob(): create(DRAFT) → activate(ACTIVE)
 */
export async function createAlbaJob(
  form: AlbaJobFormData,
  matchResult?: AlbaVisaMatchingResponse | null,
): Promise<{ jobId: string }> {
  const sessionId =
    typeof window !== 'undefined'
      ? localStorage.getItem('sessionId')
      : null;

  if (!sessionId) throw new Error('로그인이 필요합니다 / Login required');

  const fullAddress = [
    form.address.sido,
    form.address.sigungu,
    form.address.detail,
  ]
    .filter(Boolean)
    .join(' ');

  // CreateJobPostingDto 형식으로 변환 / Convert to CreateJobPostingDto format
  const body = {
    boardType: 'PART_TIME',
    title: form.title,
    description: form.detailDescription,
    allowedVisas: extractAllowedVisas(matchResult || null),
    displayAddress: fullAddress,
    actualAddress: fullAddress,
    contactName: form.contactName,
    contactPhone: form.contactPhone,
    contactEmail: form.contactEmail || undefined,
    applicationMethod: form.applicationMethod || 'PLATFORM',
    minKoreanLevel: koreanLevelToNumber(form.koreanLevel),
    closingDate: form.applicationDeadline || undefined,
    headcount: form.recruitCount,
    benefits:
      form.benefits && form.benefits.length > 0 ? form.benefits : undefined,
    // 알바 전용 속성 / Part-time specific attributes
    albaAttributes: {
      hourlyWage: form.hourlyWage,
      workDaysMask: scheduleToDaysMask(form.schedule),
      workTimeStart: form.schedule[0]?.startTime || '09:00',
      workTimeEnd: form.schedule[0]?.endTime || '18:00',
      workPeriod: form.workPeriod?.endDate
        ? `${form.workPeriod.startDate}~${form.workPeriod.endDate}`
        : form.workPeriod?.startDate || undefined,
    },
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionId}`,
  };

  // 1단계: 공고 생성 (DRAFT) / Step 1: Create job (DRAFT)
  const createRes = await fetch('/api/jobs/create', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => null);
    throw new Error(
      errorData?.message || '알바 공고 등록 실패 / Alba job creation failed',
    );
  }

  const { jobId } = await createRes.json();

  // 2단계: 공고 활성화 (DRAFT → ACTIVE) / Step 2: Activate job (DRAFT → ACTIVE)
  const activateRes = await fetch(`/api/jobs/${jobId}/activate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });

  if (!activateRes.ok) {
    const errorData = await activateRes.json().catch(() => null);
    throw new Error(
      errorData?.message || '공고 활성화 실패 / Job activation failed',
    );
  }

  return { jobId: String(jobId) };
}

