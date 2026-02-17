import { apiClient } from '@/lib/api-client';
import type {
  JobCreateApiPayload,
  JobCreateResponse,
  JobActivateResponse,
  VisaEvaluateRequest,
  VisaMatchResult,
  CorpProfileForMatching,
  JobCreateFormData,
  BoardType,
} from '../types/job-create.types';

/**
 * 채용공고 등록 관련 API 호출 함수
 * Job posting creation API functions
 */
export const jobCreateApi = {
  /**
   * 공고 생성 (DRAFT) / Create job posting
   */
  create: async (payload: JobCreateApiPayload): Promise<JobCreateResponse> => {
    const response = await apiClient.post<JobCreateResponse>('/jobs/create', payload);
    return response.data;
  },

  /**
   * 공고 활성화 / Activate job posting (DRAFT → ACTIVE)
   */
  activate: async (jobId: number, orderId?: string): Promise<JobActivateResponse> => {
    const response = await apiClient.post<JobActivateResponse>(
      `/jobs/${jobId}/activate`,
      orderId ? { orderId } : {}
    );
    return response.data;
  },

  /**
   * 비자 매칭 평가 / Evaluate visa matching
   */
  evaluateVisas: async (data: VisaEvaluateRequest): Promise<VisaMatchResult> => {
    const response = await apiClient.post<VisaMatchResult>('/visa-rules/evaluate', data);
    return response.data;
  },

  /**
   * 기업 인증 정보 조회 / Get corporate verification profile
   */
  getCorporateProfile: async (): Promise<CorpProfileForMatching | null> => {
    try {
      const response = await apiClient.get('/auth/corporate-verify');
      const data = response.data;
      if (data.verificationStatus === 'APPROVED') {
        return {
          ksicCode: data.ksicCode || null,
          addressRoad: data.addressRoad || null,
          companySizeType: data.companySizeType || 'SME',
          employeeCountKorean: data.employeeCountKorean || 0,
          employeeCountForeign: data.employeeCountForeign || 0,
          annualRevenue: data.annualRevenue || 0,
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * 기존 공고 조회 (복사용) / Get existing job posting (for copy)
   */
  getJobForCopy: async (jobId: string) => {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  },
};

/**
 * 프론트엔드 폼 데이터 → 백엔드 API 페이로드 변환
 * Transform frontend form data to backend API payload
 */
export function transformToApiPayload(
  form: JobCreateFormData,
  userName: string,
  userEmail: string,
): JobCreateApiPayload {
  const isPartTime = form.boardType === 'PART_TIME';

  // 근무요일 배열 → "1111100" 마스크 문자열 / Work days to mask string
  const workDaysMask = form.workDays.map(d => d ? '1' : '0').join('');

  // allowedVisas 배열 → 쉼표 구분 문자열 / Array to comma-separated string
  const allowedVisas = form.allowedVisas.join(',');

  const payload: JobCreateApiPayload = {
    boardType: form.boardType,
    tierType: 'STANDARD',
    title: form.title,
    description: form.jobDescription,
    allowedVisas,
    displayAddress: form.address,
    actualAddress: `${form.address} ${form.addressDetail}`.trim(),
    workIntensity: 'MIDDLE',
    benefits: form.benefits.length > 0 ? JSON.stringify(form.benefits) : null,
    contactName: userName,
    contactPhone: '',
    contactEmail: userEmail,
    applicationMethod: form.applicationMethod,
    externalUrl: form.applicationMethod === 'WEBSITE' ? form.externalUrl : undefined,
    externalEmail: form.applicationMethod === 'EMAIL' ? form.externalEmail : undefined,
    interviewMethod: 'OFFLINE',
    employmentSubType: isPartTime ? undefined : (form.employmentSubType as 'CONTRACT' | 'PERMANENT' | 'INTERNSHIP') || 'PERMANENT',
    closingDate: form.applicationEndDate || null,
    headcount: form.headcount,
    requirements: form.requirements || undefined,
    preferredQualifications: form.preferredQualifications || undefined,
  };

  if (isPartTime) {
    payload.albaAttributes = {
      hourlyWage: parseInt(form.salaryAmount) || 0,
      workPeriod: '',
      workDaysMask,
      workTimeStart: form.workTimeStart,
      workTimeEnd: form.workTimeEnd,
    };
  } else {
    // 만원 → 원 변환 / Convert 만원 to 원
    const salaryMin = (parseInt(form.salaryAmount) || 0) * 10000;
    const salaryMax = form.salaryMax
      ? (parseInt(form.salaryMax) || 0) * 10000
      : salaryMin;

    payload.fulltimeAttributes = {
      salaryMin,
      salaryMax,
      experienceLevel: form.experienceLevel || 'ANY',
      educationLevel: form.educationLevel || 'ANY',
    };
  }

  return payload;
}

/**
 * 급여 → 비자 매칭용 월급(만원) 계산
 * Calculate monthly salary in 만원 for visa matching
 */
export function calculateOfferedSalary(salaryType: string, salaryAmount: string): number {
  const amount = parseInt(salaryAmount);
  if (!amount || amount <= 0) return 0;

  switch (salaryType) {
    case 'HOURLY':
      // 시급(원) × 160시간 ÷ 10000 = 월급(만원)
      return Math.round((amount * 160) / 10000);
    case 'ANNUAL':
      // 연봉(만원) ÷ 12 = 월급(만원)
      return Math.round(amount / 12);
    case 'MONTHLY':
    default:
      return amount;
  }
}
