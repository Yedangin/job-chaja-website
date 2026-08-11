export type TalentSummary = {
  resumeId: number;
  nationality: string;
  topikLevel: number | null;
  kiipLevel: number | null;
  preferredJobTypes: string[];
  preferredRegions: string[];
  workExperienceCount: number;
  updatedAt: string;
  bookmarkedAt?: string;
  viewedAt?: string;
};

export type ResumeDetail = TalentSummary & {
  id: number;
  birthDate: string | null;
  educations: Array<Record<string, unknown>> | null;
  workExperiences: Array<Record<string, unknown>> | null;
  certificates: Array<Record<string, unknown>> | null;
  preferredSalary: number | null;
  preferredEmploymentTypes: string[];
  isComplete: boolean;
  remainingCredits: number;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AccessCheck = {
  resumeId: number;
  alreadyViewed: boolean;
  hasCredits: boolean;
  remainingCredits: number;
  canView: boolean;
};

export class TalentApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export async function talentRequest<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, { credentials: 'include', cache: 'no-store', ...init });
  const body = await response.json().catch(() => ({})) as T & { message?: string; error?: string };
  if (!response.ok) {
    throw new TalentApiError(response.status, body.message || body.error || `Request failed (${response.status})`);
  }
  return body;
}

export function errorLabel(error: unknown) {
  if (!(error instanceof TalentApiError)) return '네트워크 연결을 확인한 뒤 다시 시도해 주세요.';
  if (error.status === 401) return '로그인이 필요합니다.';
  if (error.status === 403) return '기업 인증이 승인된 계정만 인재채용관을 이용할 수 있습니다.';
  if (error.status === 404) return '구직자가 공개를 철회했거나 이력서가 더 이상 존재하지 않습니다.';
  return error.message || '인재채용관을 불러오지 못했습니다.';
}
