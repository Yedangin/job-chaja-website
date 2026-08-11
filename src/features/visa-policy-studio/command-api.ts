import { apiClient } from '@/lib/api-client';
import type {
  CreatePolicyReleaseInput,
  CreateReleaseRuleInput,
  PolicyCommandResult,
  UpdatePolicyReleaseInput,
  UpsertPolicyPathwayInput,
} from './command-types';

const BASE = '/visa-journeys/admin';

function requireReason(reason: string) {
  const normalized = reason.trim();
  if (normalized.length < 3) throw new Error('변경 사유를 3자 이상 입력해 주세요.');
  return normalized;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const response = await apiClient.post<T>(url, body);
  return response.data;
}

async function put<T>(url: string, body: unknown): Promise<T> {
  const response = await apiClient.put<T>(url, body);
  return response.data;
}

export function createPolicyRelease(input: CreatePolicyReleaseInput) {
  return post<PolicyCommandResult>(`${BASE}/releases`, { ...input, reason: requireReason(input.reason) });
}

export function updatePolicyRelease(releaseId: string, input: UpdatePolicyReleaseInput) {
  return put<PolicyCommandResult>(`${BASE}/releases/${releaseId}`, { ...input, reason: requireReason(input.reason) });
}

export function createPolicyPathway(releaseId: string, input: UpsertPolicyPathwayInput) {
  return post<PolicyCommandResult>(`${BASE}/releases/${releaseId}/pathways`, { ...input, reason: requireReason(input.reason) });
}

export function updatePolicyPathway(pathwayId: string, input: UpsertPolicyPathwayInput) {
  return put<PolicyCommandResult>(`${BASE}/pathways/${pathwayId}`, { ...input, reason: requireReason(input.reason) });
}

export function createReleaseRule(releaseId: string, input: CreateReleaseRuleInput) {
  return post<PolicyCommandResult>(`${BASE}/releases/${releaseId}/rules`, { ...input, reason: requireReason(input.reason) });
}

export function transitionPolicyRelease(
  releaseId: string,
  action: 'submit-review' | 'expert-review' | 'schedule' | 'activate',
  reason: string,
) {
  return post<PolicyCommandResult>(`${BASE}/releases/${releaseId}/${action}`, { reason: requireReason(reason) });
}

export function rollbackPolicyRelease(targetReleaseId: string, reason: string) {
  return post<PolicyCommandResult>(`${BASE}/releases/rollback`, { targetReleaseId, reason: requireReason(reason) });
}
