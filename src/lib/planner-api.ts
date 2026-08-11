import type {
  PlannerClaimResult,
  PlannerHistoryResponse,
  PlannerInput,
  PlannerResult,
} from './planner-types';

export const PLANNER_INPUT_KEY = 'jobchaja.planner.input.v2';
export const PLANNER_RESULT_KEY = 'jobchaja.planner.result.v2';
export const PLANNER_ANON_KEY = 'jobchaja.planner.anonymousId';
export const PLANNER_DRAFT_KEY = 'jobchaja.planner.draft.v2';
export const PLANNER_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

export class PlannerApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = 'PLANNER_API_ERROR',
  ) {
    super(message);
    this.name = 'PlannerApiError';
  }
}

export type PlannerDraft = {
  version: 2;
  savedAt: number;
  stepIndex: number;
  input: PlannerInput;
};

export function getPlannerAnonymousId() {
  if (typeof window === 'undefined') return '';

  const existing = localStorage.getItem(PLANNER_ANON_KEY);
  if (existing) return existing;

  const next =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(PLANNER_ANON_KEY, next);
  return next;
}

export function savePlannerInput(input: PlannerInput) {
  sessionStorage.setItem(PLANNER_INPUT_KEY, JSON.stringify(input));
}

function safePlannerInput(input: PlannerInput): PlannerInput {
  return {
    nationality: input.nationality,
    residenceCountry: input.residenceCountry,
    age: input.age,
    educationLevel: input.educationLevel,
    availableAnnualFund: input.availableAnnualFund,
    finalGoal: input.finalGoal,
    priorityPreference: input.priorityPreference,
    language: input.language,
    topikLevel: input.topikLevel,
    kiipStage: input.kiipStage,
    workExperienceYears: input.workExperienceYears,
    major: input.major,
    majorCategory: input.majorCategory,
    targetOccupation: input.targetOccupation,
    isEthnicKorean: input.isEthnicKorean,
    currentVisa: input.currentVisa,
    koreaStayMonths: input.koreaStayMonths,
    hasDegreeDocument: input.hasDegreeDocument,
  };
}

export function savePlannerDraft(stepIndex: number, input: PlannerInput) {
  if (typeof window === 'undefined') return;
  const draft: PlannerDraft = {
    version: 2,
    savedAt: Date.now(),
    stepIndex,
    input: safePlannerInput(input),
  };
  try {
    localStorage.setItem(PLANNER_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage can be unavailable in private browsing. The active form remains usable.
  }
}

export function readPlannerDraft(): PlannerDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PLANNER_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as PlannerDraft;
    if (
      draft.version !== 2 ||
      !draft.input ||
      !Number.isFinite(draft.savedAt) ||
      Date.now() - draft.savedAt > PLANNER_DRAFT_TTL_MS
    ) {
      clearPlannerDraft();
      return null;
    }
    return {
      ...draft,
      stepIndex: Math.max(0, Math.min(4, Number(draft.stepIndex) || 0)),
      input: safePlannerInput(draft.input),
    };
  } catch {
    clearPlannerDraft();
    return null;
  }
}

export function clearPlannerDraft() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PLANNER_DRAFT_KEY);
  } catch {
    // No action is needed when storage is unavailable.
  }
}

export function savePlannerResult(result: PlannerResult) {
  sessionStorage.setItem(PLANNER_RESULT_KEY, JSON.stringify(result));
}

export function readPlannerResult(): PlannerResult | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(PLANNER_RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlannerResult;
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const sessionId = localStorage.getItem('sessionId');
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

async function toPlannerApiError(response: Response, fallback: string) {
  const body = await response.json().catch(() => ({}));
  const nested = body?.message && typeof body.message === 'object' ? body.message : body;
  const message =
    nested?.message ||
    (typeof body?.message === 'string' ? body.message : undefined) ||
    body?.error ||
    fallback;
  const code = nested?.code || body?.code || `HTTP_${response.status}`;
  return new PlannerApiError(message, response.status, code);
}

export async function runPlannerDiagnosis(
  input: PlannerInput,
): Promise<PlannerResult> {
  const anonymousId = getPlannerAnonymousId();

  const response = await fetch('/api/diagnosis', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Anonymous-Id': anonymousId,
      ...authHeaders(),
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await toPlannerApiError(response, `Planner failed (${response.status})`);
  }

  return response.json();
}

export async function claimPlannerSession(
  sessionId: number,
): Promise<PlannerClaimResult> {
  const anonymousId = getPlannerAnonymousId();
  const response = await fetch(`/api/diagnosis/${sessionId}/claim`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Anonymous-Id': anonymousId,
      ...authHeaders(),
    },
    body: JSON.stringify({ anonymousId }),
  });

  if (!response.ok) {
    throw await toPlannerApiError(response, `Save failed (${response.status})`);
  }

  const result = (await response.json()) as PlannerClaimResult;
  if (!result.saved) {
    throw new PlannerApiError(
      'The server did not save this planner result.',
      409,
      'SAVE_NOT_CONFIRMED',
    );
  }
  return result;
}

export async function fetchPlannerResult(sessionId: number): Promise<PlannerResult> {
  const response = await fetch(`/api/diagnosis/${sessionId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Anonymous-Id': getPlannerAnonymousId(),
      ...authHeaders(),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw await toPlannerApiError(
      response,
      `Could not load planner result (${response.status})`,
    );
  }

  const session = await response.json();
  const result = session?.resultsSnapshot as PlannerResult | undefined;
  if (!result || !Array.isArray(result.pathways) || !result.meta) {
    throw new PlannerApiError(
      'The saved planner result is incomplete.',
      409,
      'RESULT_SNAPSHOT_INVALID',
    );
  }
  return {
    ...result,
    sessionId,
    meta: { ...result.meta, sessionId },
  };
}

export async function fetchPlannerHistory(
  page = 1,
  limit = 20,
): Promise<PlannerHistoryResponse> {
  const response = await fetch(`/api/diagnosis/history?page=${page}&limit=${limit}`, {
    credentials: 'include',
    headers: authHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw await toPlannerApiError(
      response,
      `Could not load planner history (${response.status})`,
    );
  }
  return response.json();
}
