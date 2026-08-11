import { apiClient } from '@/lib/api-client';
import type {
  AssessmentProfilePrefill, CreateExpertCaseInput, CreateVisaJourneyInput, EvidenceItem, ExpertCase,
  GapAction, ItemProgressStatus, JourneyFreshness, JourneyStage, PolicyCitation,
  ProcedureStep, RequirementEvaluation, VisaAssessmentInput, VisaJourney,
} from './types';

type JsonRecord = Record<string, unknown>;

const STAGE_MAP: Record<string, JourneyStage> = {
  ASSESSMENT: 1,
  CONDITION_ROADMAP: 2,
  EVIDENCE_PREPARATION: 3,
  SELF_PROCEDURE: 4,
  EXPERT_SUPPORT: 5,
};

const STATUS_TO_UI: Record<string, ItemProgressStatus> = {
  TODO: 'NOT_STARTED',
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  BLOCKED: 'BLOCKED',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};

const STATUS_TO_API: Record<ItemProgressStatus, string> = {
  NOT_STARTED: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  BLOCKED: 'BLOCKED',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};

function record(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : {};
}

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function records(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.map(record) : [];
}

function citations(value: unknown): PolicyCitation[] {
  return records(value).map((item, index) => ({
    id: text(item.id) ?? undefined,
    title: text(item.title) ?? text(item.name) ?? `Source ${index + 1}`,
    url: text(item.url),
    clause: text(item.clause),
    effectiveFrom: text(item.effectiveFrom),
  }));
}

function progress(value: unknown): ItemProgressStatus {
  return STATUS_TO_UI[String(value ?? '')] ?? 'NOT_STARTED';
}

function requirements(value: unknown): RequirementEvaluation[] {
  return records(value).map((item, index) => {
    const rawStatus = String(item.status ?? 'REVIEW_REQUIRED');
    const statusMap: Record<string, RequirementEvaluation['status']> = {
      SATISFIED: 'SATISFIED',
      CONDITIONAL: 'IMPROVABLE',
      NOT_SATISFIED: 'NOT_REMEDIABLE',
      REVIEW_REQUIRED: 'EXPERT_REVIEW_REQUIRED',
    };
    const metadata = record(item.metadata);
    return {
      id: text(item.id) ?? text(item.code) ?? `requirement-${index}`,
      title: text(item.title) ?? text(item.message) ?? text(item.code) ?? 'Requirement',
      description: text(item.description),
      status: statusMap[rawStatus] ?? rawStatus as RequirementEvaluation['status'],
      currentValue: text(item.currentValue) ?? text(metadata.currentValue),
      requiredValue: text(item.requiredValue) ?? text(metadata.requiredValue),
      reason: text(item.reason),
      reasonCode: text(item.reasonCode) ?? text(item.code),
      citations: citations(item.citations ?? metadata.citations),
    };
  });
}

function normalizeGapActions(value: unknown): GapAction[] {
  return records(value).map((item, index) => {
    const metadata = record(item.metadata);
    return {
      id: text(item.id) ?? `gap-${index}`,
      requirementId: text(item.requirementId) ?? text(metadata.requirementId),
      title: text(item.title) ?? 'Action',
      description: text(item.description),
      owner: text(item.owner) ?? text(item.assignee),
      currentState: text(item.currentState) ?? text(metadata.currentState),
      targetState: text(item.targetState) ?? text(metadata.targetState),
      recommendedAction: text(item.recommendedAction) ?? text(metadata.recommendedAction),
      dueAt: text(item.dueAt),
      expectedCompletionAt: text(item.expectedCompletionAt) ?? text(metadata.expectedCompletionAt),
      status: progress(item.status),
      citations: citations(item.citations ?? metadata.citations),
    };
  });
}

function normalizeEvidence(value: unknown): EvidenceItem[] {
  return records(value).map((item, index) => {
    const metadata = record(item.metadata);
    return {
      id: text(item.id) ?? `evidence-${index}`,
      requirementId: text(item.requirementId) ?? text(metadata.requirementId),
      title: text(item.title) ?? 'Evidence',
      description: text(item.description),
      owner: text(item.owner) ?? text(item.assignee),
      issuer: text(item.issuer) ?? text(metadata.issuer),
      format: text(item.format) ?? text(metadata.format),
      validUntil: text(item.validUntil) ?? text(metadata.validUntil),
      dueAt: text(item.dueAt),
      status: progress(item.status),
      requiresExpertReview: item.requiresExpertReview === true || metadata.requiresExpertReview === true,
      citations: citations(item.citations ?? metadata.citations),
    };
  });
}

function normalizeProcedures(value: unknown): ProcedureStep[] {
  return records(value).map((item, index) => {
    const metadata = record(item.metadata);
    const rawDependencies = item.dependencyIds ?? metadata.dependencyIds;
    return {
      id: text(item.id) ?? `procedure-${index}`,
      order: typeof item.order === 'number' ? item.order : index + 1,
      title: text(item.title) ?? 'Procedure',
      description: text(item.description),
      owner: text(item.owner) ?? text(item.assignee),
      channel: text(item.channel) ?? text(metadata.channel),
      officialUrl: text(item.officialUrl) ?? text(metadata.officialUrl),
      dueAt: text(item.dueAt),
      status: progress(item.status),
      dependencyIds: Array.isArray(rawDependencies)
        ? rawDependencies.filter((entry): entry is string => typeof entry === 'string')
        : [],
      citations: citations(item.citations ?? metadata.citations),
    };
  });
}

function normalizeExpertCases(value: unknown): ExpertCase[] {
  return records(value).map((item, index) => ({
    id: text(item.id) ?? `expert-${index}`,
    serviceType: String(item.serviceType ?? 'CONSULTATION') as ExpertCase['serviceType'],
    status: text(item.status) ?? 'REQUESTED',
    question: text(item.question),
    createdAt: text(item.createdAt) ?? new Date(0).toISOString(),
    assignedExpertName: text(item.assignedExpertName),
  }));
}

function normalizeAssessmentInputs(value: unknown): VisaAssessmentInput {
  const source = record(value);
  const fields = [
    'policyAsOf', 'ksicCode', 'companySizeType', 'employeeCountKorean',
    'employeeCountForeign', 'annualRevenue', 'addressRoad', 'jobType',
    'offeredSalary', 'nationality', 'age', 'educationLevel', 'koreanLevel',
    'workExperienceYears', 'currentVisaCode', 'targetOccupationCode',
  ] as const;
  return Object.fromEntries(fields.flatMap((field) => {
    const valueForField = source[field];
    return typeof valueForField === 'string' || typeof valueForField === 'number'
      ? [[field, valueForField]]
      : [];
  })) as VisaAssessmentInput;
}

function pickJourney(payload: unknown): JsonRecord | null {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload.length ? record(payload[0]) : null;
  const outer = record(payload);
  if (outer.journey) return record(outer.journey);
  if (Array.isArray(outer.items)) return outer.items.length ? record(outer.items[0]) : null;
  return outer;
}

function normalizeJourney(payload: unknown): VisaJourney | null {
  const journey = pickJourney(payload);
  if (!journey || !text(journey.id)) return null;
  const latest = record(journey.latestAssessment);
  const rawPolicy = record(journey.policy);
  const rawLegalNotice = record(journey.legalNotice);
  const rawAgencyNotice = record(rawLegalNotice.agency);
  const rawStage = journey.currentStage;
  return {
    id: text(journey.id) as string,
    status: text(journey.status) ?? 'ACTIVE',
    targetVisaCode: text(journey.targetVisaCode) ?? text(journey.targetVisaType),
    currentVisaCode: text(journey.currentVisaCode) ?? text(journey.currentVisaType),
    targetPathwayName: text(journey.targetPathwayName) ?? text(journey.targetPathway),
    targetApplicationDate: text(journey.targetApplicationDate),
    currentStage: typeof rawStage === 'number' ? rawStage as JourneyStage : STAGE_MAP[String(rawStage)] ?? 1,
    outcome: text(journey.outcome) ?? text(latest.outcome),
    missingInputs: Array.isArray(latest.missingInputs)
      ? latest.missingInputs.filter((entry): entry is string => typeof entry === 'string')
      : [],
    assessmentInputs: normalizeAssessmentInputs(latest.inputs ?? latest.inputSnapshot),
    policy: {
      releaseId: text(rawPolicy.releaseId),
      version: text(rawPolicy.version),
      hash: text(rawPolicy.hash),
      policyAsOf: text(rawPolicy.policyAsOf) ?? text(rawPolicy.asOf),
      effectiveFrom: text(rawPolicy.effectiveFrom),
      effectiveTo: text(rawPolicy.effectiveTo),
      reviewedAt: text(rawPolicy.reviewedAt),
      evaluatedAt: text(rawPolicy.evaluatedAt) ?? text(latest.evaluatedAt),
      freshness: (text(rawPolicy.freshness) ?? 'UNKNOWN') as JourneyFreshness,
      upcomingChangeSummary: text(rawPolicy.upcomingChangeSummary),
    },
    legalNotice: {
      code: text(rawLegalNotice.code),
      ko: text(rawLegalNotice.ko),
      en: text(rawLegalNotice.en),
      agencyKo: text(rawAgencyNotice.ko),
      agencyEn: text(rawAgencyNotice.en),
    },
    requirements: requirements(journey.requirements ?? latest.requirements),
    gapActions: normalizeGapActions(journey.gapActions),
    evidenceItems: normalizeEvidence(journey.evidenceItems),
    procedureSteps: normalizeProcedures(journey.procedureSteps),
    expertCases: normalizeExpertCases(journey.expertCases),
  };
}

function requiredJourney(payload: unknown): VisaJourney {
  const journey = normalizeJourney(payload);
  if (!journey) throw new Error('Visa journey response was empty.');
  return journey;
}

export const visaJourneyApi = {
  async getAssessmentProfilePrefill(): Promise<AssessmentProfilePrefill> {
    const response = await apiClient.get<unknown>('/resumes/me');
    const resume = record(response.data);
    const topikLevel = typeof resume.topikLevel === 'number' ? `TOPIK${resume.topikLevel}` : null;
    const kiipLevel = typeof resume.kiipLevel === 'number' ? `KIIP${resume.kiipLevel}` : null;
    return {
      nationality: text(resume.nationality) ?? undefined,
      age: typeof resume.age === 'number' ? resume.age : undefined,
      educationLevel: text(resume.educationLevel) ?? undefined,
      koreanLevel: text(resume.koreanLevel) ?? topikLevel ?? kiipLevel ?? undefined,
      workExperienceYears: typeof resume.workExperienceYears === 'number' ? resume.workExperienceYears : undefined,
      currentVisaCode: text(resume.currentVisaCode) ?? text(resume.visaType) ?? undefined,
    };
  },
  async getMine() {
    const response = await apiClient.get<unknown>('/visa-journeys');
    return normalizeJourney(response.data);
  },
  async getById(id: string) {
    const response = await apiClient.get<unknown>(`/visa-journeys/${id}`);
    return requiredJourney(response.data);
  },
  async create(input: CreateVisaJourneyInput) {
    const response = await apiClient.post<unknown>('/visa-journeys', input);
    return requiredJourney(response.data);
  },
  async assess(id: string, input: VisaAssessmentInput) {
    const response = await apiClient.post<unknown>(`/visa-journeys/${id}/assessments`, input);
    return requiredJourney(response.data);
  },
  async updateItem(id: string, itemId: string, status: ItemProgressStatus) {
    await apiClient.patch(`/visa-journeys/${id}/items/${itemId}`, { status: STATUS_TO_API[status] });
  },
  async createExpertCase(id: string, input: CreateExpertCaseInput) {
    await apiClient.post(`/visa-journeys/${id}/expert-cases`, input);
  },
};
