/**
 * 정규채용 공고 API 함수
 * Fulltime job posting API functions
 */

import type {
  FulltimeJobFormData,
  FulltimeVisaMatchingResponse,
  AlbaHiringVisaAnalysisResponse,
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
 * 폼 데이터 → 백엔드 비자 매칭 요청 DTO 변환
 * Transform form data to backend visa matching request DTO
 *
 * Frontend FulltimeJobFormData (flat) → Backend { jobInput: FulltimeJobInputDto }
 * 필드명 매핑: jobCategoryCode → occupationCode, address → workAddress
 * Field mapping: jobCategoryCode → occupationCode, address → workAddress
 */
function transformFormToVisaMatchingRequest(form: FulltimeJobFormData) {
  return {
    jobInput: {
      occupationCode: form.jobCategoryCode,
      salaryMin: form.salaryMin,
      salaryMax: form.salaryMax,
      experienceLevel: form.experienceLevel,
      educationLevel: form.educationLevel,
      weeklyWorkHours: form.weeklyWorkHours || 40,
      overseasHireWilling: form.overseasHireWilling,
      preferredMajors: form.preferredMajors?.length > 0 ? form.preferredMajors : undefined,
      workAddress: {
        sido: form.address.sido,
        sigungu: form.address.sigungu,
        isDepopulationArea: form.address.isDepopulationArea ?? false,
      },
      ...(form.companyInfo?.totalEmployees != null && form.companyInfo.totalEmployees > 0
        ? {
            companyInfo: {
              totalEmployees: form.companyInfo.totalEmployees,
              foreignEmployeeCount: form.companyInfo.foreignEmployeeCount ?? 0,
              institutionType: form.companyInfo.institutionType,
            },
          }
        : {}),
    },
  };
}

/**
 * 정규채용 비자 매칭 API 호출
 * Call fulltime visa matching API
 *
 * 백엔드 기대 구조: { jobInput: { occupationCode, workAddress, ... } }
 * Backend expected structure: { jobInput: { occupationCode, workAddress, ... } }
 */
export async function matchFulltimeVisa(
  form: FulltimeJobFormData
): Promise<FulltimeVisaMatchingResponse> {
  const body = transformFormToVisaMatchingRequest(form);

  const response = await fetch('/api/fulltime-visa/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || '비자 매칭 실패 / Visa matching failed');
  }

  return response.json();
}

/**
 * 알바 비자 분석 API 호출 (실시간 필터링용)
 * Call alba visa analysis API (for real-time filtering)
 *
 * POST /api/alba/hiring/visa-analysis → 백엔드 AlbaHiringVisaAnalysisService
 */
export async function analyzeAlbaHiringVisa(
  jobCategoryCode: string,
  weeklyHours: number,
  isDepopulationArea?: boolean,
): Promise<AlbaHiringVisaAnalysisResponse> {
  const response = await fetch('/api/alba/hiring/visa-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobCategoryCode, weeklyHours, isDepopulationArea }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || '알바 비자 분석 실패 / Alba visa analysis failed');
  }

  return response.json();
}

/**
 * 고용형태 → employmentSubType 매핑
 * Map frontend employment type to backend employmentSubType enum
 */
function mapEmploymentSubType(type: string): string {
  switch (type) {
    case 'REGULAR': return 'PERMANENT';
    case 'CONTRACT': return 'CONTRACT';
    case 'INTERN': return 'INTERNSHIP';
    case 'ALBA': return 'PART_TIME';
    default: return 'PERMANENT';
  }
}

/**
 * 접수방법 → 백엔드 applicationMethod 매핑
 * Map frontend application method to backend enum
 * 백엔드: PLATFORM | WEBSITE | EMAIL / Backend: PLATFORM | WEBSITE | EMAIL
 */
function mapApplicationMethod(method: string): string {
  switch (method) {
    case 'PLATFORM': return 'PLATFORM';
    case 'EMAIL': return 'EMAIL';
    default: return 'PLATFORM';
  }
}

/**
 * 비자 매칭 결과에서 허용 비자 코드 추출 (적합 + 조건부)
 * Extract allowed visa codes from matching result (eligible + conditional)
 */
function extractAllowedVisas(matchResult: FulltimeVisaMatchingResponse | null): string {
  if (!matchResult) return '';

  const visaCodes = new Set<string>();
  const tracks = ['immediate', 'sponsor', 'transition', 'transfer'] as const;

  for (const track of tracks) {
    const trackData = matchResult[track];
    if (!trackData) continue;
    for (const visa of trackData.eligible) {
      visaCodes.add(visa.visaCode);
    }
    for (const visa of trackData.conditional) {
      visaCodes.add(visa.visaCode);
    }
  }

  return Array.from(visaCodes).join(',');
}

/**
 * 정규채용 공고 등록 API 호출
 * Submit fulltime job posting
 *
 * POST /api/jobs/create → 백엔드 CreateJobPostingDto 형식
 * POST /api/jobs/create → Backend CreateJobPostingDto format
 */
export async function createFulltimeJob(
  form: FulltimeJobFormData,
  matchResult: FulltimeVisaMatchingResponse | null,
): Promise<void> {
  const sessionId = typeof window !== 'undefined'
    ? localStorage.getItem('sessionId')
    : null;

  if (!sessionId) throw new Error('로그인이 필요합니다 / Login required');

  const fullAddress = [form.address.sido, form.address.sigungu, form.address.detail]
    .filter(Boolean)
    .join(' ');

  const body = {
    boardType: 'FULL_TIME',
    title: form.title,
    description: form.detailDescription,
    allowedVisas: extractAllowedVisas(matchResult),
    displayAddress: fullAddress,
    actualAddress: fullAddress,
    contactName: form.contactName,
    contactPhone: form.contactPhone,
    contactEmail: form.contactEmail || undefined,
    applicationMethod: mapApplicationMethod(form.applicationMethod),
    interviewMethod: 'OFFLINE',
    employmentSubType: mapEmploymentSubType(form.employmentType),
    closingDate: form.applicationDeadline || undefined,
    benefits: form.benefits.length > 0 ? form.benefits : undefined,
    headcount: form.recruitCount,
    fulltimeAttributes: {
      salaryMin: form.salaryMin,
      salaryMax: form.salaryMax,
      experienceLevel: form.experienceLevel,
      educationLevel: form.educationLevel,
    },
    // 비자 매칭 결과 포함 (활성화 시 필수)
    // Include visa matching result (required for activation)
    fulltimeVisaResult: matchResult || undefined,
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionId}`,
  };

  // 1단계: 공고 생성 (DRAFT) / Step 1: Create job (DRAFT)
  const createRes = await fetch('/api/jobs/create', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => null);
    throw new Error(errorData?.message || '공고 등록 실패 / Job creation failed');
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
      errorData?.message || '공고 활성화 실패 / Job activation failed'
    );
  }
}
