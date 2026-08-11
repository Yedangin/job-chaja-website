import { apiClient } from '@/lib/api-client';

export interface ExpertCaseRow {
  id: string;
  journeyId: string;
  serviceType: 'CONSULTATION' | 'DOCUMENT_REVIEW' | 'APPLICATION_AGENCY';
  status: string;
  question: string | null;
  assignedExpertId: string | null;
  createdAt: string;
  journey: {
    currentVisaCode: string | null;
    targetVisaCode: string;
    currentStage: string;
  };
}

export interface ExpertCredentialRow {
  id: string;
  expertId: string;
  qualificationType: string;
  qualificationNumberMasked: string;
  status: string;
  businessFilingVerifiedAt: string | null;
  immigrationAgencyRegistrationVerifiedAt: string | null;
  validUntil: string | null;
  updatedAt: string;
}

const BASE = '/visa-journeys/admin';

export async function loadExpertOperations() {
  const [cases, credentials] = await Promise.all([
    apiClient.get<ExpertCaseRow[]>(`${BASE}/expert-cases`),
    apiClient.get<ExpertCredentialRow[]>(`${BASE}/expert-credentials`),
  ]);
  return { cases: cases.data, credentials: credentials.data };
}

export function verifyExpertCredential(input: {
  expertId: string;
  qualificationType: string;
  qualificationNumberMasked: string;
  businessFilingVerifiedAt: string;
  immigrationAgencyRegistrationVerifiedAt?: string;
  validUntil?: string;
  reason: string;
}) {
  return apiClient.post(`${BASE}/expert-credentials/verify`, input);
}

export function assignExpertCase(
  caseId: string,
  expertId: string,
  reason: string,
) {
  return apiClient.post(`${BASE}/expert-cases/${caseId}/assign`, {
    expertId,
    reason,
  });
}
