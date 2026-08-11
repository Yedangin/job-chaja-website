import type {
  AffectedJourney,
  DecisionLog,
  JourneyStageKey,
  PolicyPathway,
  PolicyStudioOverview,
  PolicySummary,
  ReleaseGate,
  ReviewStatus,
  RuleChangeAudit,
} from './types';
import type { VisaPathwayFiveStageDefinitionInput } from './command-types';

export interface RawAdminOverview {
  generatedAt: string;
  activeRelease: { id: string; version: string; hash: string; effectiveFrom: string; reviewedAt: string | null } | null;
  journeyStages: Record<string, number>;
  assessmentOutcomes: Record<string, number>;
  assessmentsLast24Hours: number;
  openExpertCases: number;
  policyFreshness: Record<string, number>;
}

export interface RawReleaseGate {
  id: string;
  name: string;
  version: string;
  status: string;
  effectiveFrom: string;
  ruleCount: number;
  pathwayCount: number;
  blockers: string[];
  canActivate: boolean;
}

export interface RawPathway {
  id: string;
  policyReleaseId: string;
  currentVisaCode: string | null;
  targetVisaCode: string;
  name: string;
  locale: string;
  version: number;
  status: string;
  definition: unknown;
  updatedAt: string;
}

export interface RawDecisionLog {
  id: string;
  journeyId: string;
  outcome: string;
  engineVersion: string;
  policyReleaseId: string | null;
  policyVersion: string | null;
  policyAsOf: string;
  policyReviewedAt: string | null;
  appliedRuleIds: unknown;
  createdAt: string;
}

export interface RawRuleAudit {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  beforeSnapshot: unknown;
  afterSnapshot: unknown;
  changeReason: string;
  actorId: string;
  policyReleaseId: string | null;
  ruleId: string | null;
  createdAt: string;
}

export interface RawAffectedResponse {
  activeReleaseId: string | null;
  data: Array<{
    id: string;
    targetVisaCode: string;
    currentStage: string;
    policyReleaseId: string | null;
    policyFreshness: string;
    updatedAt: string;
  }>;
}

const STAGE_DEFINITION_KEYS: Record<JourneyStageKey, keyof VisaPathwayFiveStageDefinitionInput> = {
  ELIGIBILITY: 'eligibilityRequirements',
  CONDITION_ROADMAP: 'remediationOptions',
  EVIDENCE: 'evidenceRequirements',
  SELF_PROCEDURE: 'procedureSteps',
  EXPERT_HANDOFF: 'escalationRules',
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value !== 'string') return [];
  try { return stringArray(JSON.parse(value)); } catch { return []; }
}

function snapshotVersion(value: unknown): string | null {
  const version = record(value).version;
  return typeof version === 'string' || typeof version === 'number' ? String(version) : null;
}

function reviewStatus(status: string): ReviewStatus {
  if (status === 'ACTIVE' || status === 'APPROVED') return 'APPROVED';
  if (status === 'UNDER_REVIEW') return 'PENDING';
  return status === 'DRAFT' ? 'NOT_REQUESTED' : 'UNKNOWN';
}

export function normalizeReleaseGates(rows: RawReleaseGate[]): ReleaseGate[] {
  const blockerLabels: Record<string, string> = {
    NO_RULES: '판정 규칙 없음',
    NO_PATHWAYS: '5단계 경로 없음',
    EXPERT_REVIEW_MISSING: '행정사 검토 없음',
    RELEASE_APPROVAL_MISSING: '배포 승인 없음',
  };
  return rows.map((row) => ({
    id: row.id,
    label: `${row.name} · v${row.version}`,
    description: row.blockers.length ? row.blockers.map((item) => blockerLabels[item] ?? item).join(', ') : '배포 차단 조건 없음',
    status: row.canActivate ? 'PASS' : row.blockers.length ? 'FAIL' : 'PENDING',
    blocking: row.blockers.length > 0,
    checkedAt: null,
    releaseName: row.name,
    releaseVersion: row.version,
    releaseStatus: row.status,
    blockers: row.blockers,
    canActivate: row.canActivate,
  }));
}

export function normalizePathways(rows: RawPathway[], overview: RawAdminOverview | null, gates: RawReleaseGate[]): PolicyPathway[] {
  return rows.map((row) => {
    const definition = record(row.definition) as Partial<VisaPathwayFiveStageDefinitionInput>;
    const matchingRelease = gates.find((gate) => gate.id === row.policyReleaseId);
    const stages = Object.entries(STAGE_DEFINITION_KEYS).map(([stage, key]) => ({
      stage: stage as JourneyStageKey,
      configured: Array.isArray(definition[key]) ? definition[key]!.length : 0,
      reviewStatus: reviewStatus(row.status),
      updatedAt: row.updatedAt,
    }));
    const sourceUrls = new Set<string>();
    for (const key of Object.values(STAGE_DEFINITION_KEYS)) {
      const items = definition[key];
      if (!Array.isArray(items)) continue;
      for (const item of items) if (item?.sourceCitation?.url) sourceUrls.add(item.sourceCitation.url);
    }
    return {
      id: row.id,
      policyReleaseId: row.policyReleaseId,
      code: `${row.currentVisaCode ?? '신규'}→${row.targetVisaCode}`,
      name: row.name,
      currentVisa: row.currentVisaCode,
      targetVisa: row.targetVisaCode,
      status: row.status,
      releaseVersion: matchingRelease?.version ?? null,
      policyAsOf: overview?.activeRelease?.id === row.policyReleaseId ? overview.generatedAt : null,
      effectiveFrom: matchingRelease?.effectiveFrom ?? null,
      reviewedAt: overview?.activeRelease?.id === row.policyReleaseId ? overview.activeRelease.reviewedAt : null,
      reviewStatus: reviewStatus(row.status),
      stages,
      sourceCount: sourceUrls.size,
      definition: definition as VisaPathwayFiveStageDefinitionInput,
      expertAssignmentGate: null,
    };
  });
}

export function normalizeOverview(raw: RawAdminOverview | null, summary: PolicySummary | null, pathways: PolicyPathway[], gates: ReleaseGate[]): PolicyStudioOverview {
  const total = pathways.length;
  return {
    activeRelease: raw?.activeRelease ? {
      id: raw.activeRelease.id, version: raw.activeRelease.version, status: 'ACTIVE', asOf: raw.generatedAt,
      effectiveFrom: raw.activeRelease.effectiveFrom, effectiveTo: null, reviewedAt: raw.activeRelease.reviewedAt,
      reviewedBy: null, hash: raw.activeRelease.hash, freshnessStatus: 'CURRENT',
    } : null,
    queues: {
      changeDetected: summary?.pendingChanges ?? null,
      stale: raw ? (raw.policyFreshness.STALE ?? 0) + (raw.policyFreshness.CONFLICT ?? 0) : null,
      legalReview: gates.filter((gate) => gate.blockers?.includes('EXPERT_REVIEW_MISSING')).length,
      releaseReady: gates.filter((gate) => gate.canActivate).length,
    },
    coverage: Object.keys(STAGE_DEFINITION_KEYS).map((stage) => {
      const configured = pathways.filter((pathway) => (pathway.stages.find((item) => item.stage === stage)?.configured ?? 0) > 0).length;
      return { stage: stage as JourneyStageKey, configured, total, reviewRequired: pathways.filter((pathway) => pathway.reviewStatus !== 'APPROVED').length, status: total === 0 ? 'EMPTY' : configured === total ? 'COMPLETE' : 'PARTIAL' };
    }),
    generatedAt: raw?.generatedAt ?? null,
  };
}

export function normalizeDecisionLogs(rows: RawDecisionLog[]): DecisionLog[] {
  return rows.map((row) => ({
    id: row.id, corporateId: null, eligibleVisas: [], blockedVisas: [], appliedRuleIds: stringArray(row.appliedRuleIds),
    evaluatedAt: row.createdAt, durationMs: null, outcome: row.outcome, releaseId: row.policyReleaseId,
    releaseVersion: row.policyVersion, policyAsOf: row.policyAsOf, reviewStatus: row.policyReviewedAt ? 'APPROVED' : 'UNKNOWN',
  }));
}

export function normalizeRuleAudits(rows: RawRuleAudit[]): RuleChangeAudit[] {
  return rows.filter((row) => row.ruleId).map((row) => {
    const after = record(row.afterSnapshot);
    return {
      id: row.id, ruleId: row.ruleId!, ruleName: typeof after.ruleName === 'string' ? after.ruleName : `VisaRule #${row.ruleId}`,
      visaTypeCode: typeof after.visaTypeCode === 'string' ? after.visaTypeCode : '—',
      fromVersion: snapshotVersion(row.beforeSnapshot), toVersion: snapshotVersion(row.afterSnapshot) ?? '1',
      changedAt: row.createdAt, changedBy: row.actorId, changeType: row.action, legalReviewStatus: 'UNKNOWN',
    };
  });
}

export function normalizeAffected(raw: RawAffectedResponse | null): AffectedJourney[] {
  return (raw?.data ?? []).map((row) => ({
    id: row.id, journeyId: row.id, pathwayLabel: row.targetVisaCode, previousOutcome: null, nextOutcome: null,
    reason: `정책 최신성 ${row.policyFreshness} · 현재 단계 ${row.currentStage}`, detectedAt: row.updatedAt, notifiedAt: null,
  }));
}
