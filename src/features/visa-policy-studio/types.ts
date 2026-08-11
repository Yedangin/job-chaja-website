import type { VisaPathwayFiveStageDefinitionInput } from './command-types';

export type JourneyStageKey =
  | 'ELIGIBILITY'
  | 'CONDITION_ROADMAP'
  | 'EVIDENCE'
  | 'SELF_PROCEDURE'
  | 'EXPERT_HANDOFF';

export type FreshnessStatus =
  | 'CURRENT'
  | 'UPCOMING_CHANGE'
  | 'CHANGE_DETECTED'
  | 'STALE'
  | 'UNKNOWN';

export type ReviewStatus =
  | 'NOT_REQUESTED'
  | 'PENDING'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'EXPIRED'
  | 'UNKNOWN';

export interface ActivePolicyRelease {
  id: string;
  version: string;
  status: string;
  asOf: string | null;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  hash: string | null;
  freshnessStatus: FreshnessStatus;
}

export interface PolicyQueueSummary {
  changeDetected: number | null;
  stale: number | null;
  legalReview: number | null;
  releaseReady: number | null;
}

export interface StageCoverage {
  stage: JourneyStageKey;
  configured: number | null;
  total: number | null;
  reviewRequired: number | null;
  status: 'COMPLETE' | 'PARTIAL' | 'EMPTY' | 'UNKNOWN';
}

export interface PolicyStudioOverview {
  activeRelease: ActivePolicyRelease | null;
  queues: PolicyQueueSummary;
  coverage: StageCoverage[];
  generatedAt: string | null;
}

export interface PolicySummary {
  pendingChanges: number;
  totalChanges: number;
  activeRules: number;
  draftRules: number;
  totalVisaTypes: number;
}

export interface PolicyChange {
  id: string;
  sourceSite: string;
  sourceUrl: string | null;
  pageTitle: string | null;
  summary: string | null;
  previousContent: string | null;
  currentContent: string | null;
  changeType: string;
  affectedVisaTypes: string | null;
  effectiveDate: string | null;
  reviewStatus: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  draftRuleId: string | null;
  detectedAt: string;
}

export interface VisaRule {
  id: string;
  visaTypeCode: string;
  visaTypeNameKo: string;
  ruleName: string;
  ruleDescription: string | null;
  priority: number;
  ruleType: string;
  conditions: string;
  actions: string;
  version: number;
  parentRuleId?: string | null;
  status: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdBy: string | null;
  updatedBy?: string | null;
  createdAt: string;
}

export interface RuleVersion {
  id: string;
  version: number;
  status: string;
  priority: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
}

export interface DecisionLog {
  id: string;
  corporateId: string | null;
  eligibleVisas: string | string[];
  blockedVisas: string | string[];
  appliedRuleIds: string | string[];
  evaluatedAt: string;
  durationMs: number | null;
  outcome?: string | null;
  releaseId?: string | null;
  releaseVersion?: string | null;
  policyAsOf?: string | null;
  reviewStatus?: ReviewStatus;
}

export interface RuleChangeAudit {
  id: string;
  ruleId: string;
  ruleName: string;
  visaTypeCode: string;
  fromVersion: string | null;
  toVersion: string;
  changedAt: string;
  changedBy: string | null;
  changeType: string;
  legalReviewStatus: ReviewStatus;
}

export interface AffectedJourney {
  id: string;
  journeyId: string;
  pathwayLabel: string;
  previousOutcome: string | null;
  nextOutcome: string | null;
  reason: string;
  detectedAt: string;
  notifiedAt: string | null;
}

export interface ReleaseGate {
  id: string;
  label: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'PENDING' | 'UNKNOWN';
  blocking: boolean;
  checkedAt: string | null;
  releaseName?: string;
  releaseVersion?: string;
  releaseStatus?: string;
  blockers?: string[];
  canActivate?: boolean;
}

export interface PathwayStageSummary {
  stage: JourneyStageKey;
  configured: number | null;
  reviewStatus: ReviewStatus;
  updatedAt: string | null;
}

export interface ExpertAssignmentGate {
  administrativeAgentCredential: 'VERIFIED' | 'UNVERIFIED' | 'EXPIRED' | 'UNKNOWN';
  officeFiling: 'VERIFIED' | 'UNVERIFIED' | 'EXPIRED' | 'UNKNOWN';
  immigrationAgencyRegistration: 'VERIFIED' | 'UNVERIFIED' | 'EXPIRED' | 'NOT_REQUIRED' | 'UNKNOWN';
  verifiedAt: string | null;
  validUntil: string | null;
  assignmentAllowed: boolean;
}

export interface PolicyPathway {
  id: string;
  policyReleaseId?: string;
  code: string;
  name: string;
  currentVisa: string | null;
  targetVisa: string;
  status: string;
  releaseVersion: string | null;
  policyAsOf: string | null;
  effectiveFrom: string | null;
  reviewedAt: string | null;
  reviewStatus: ReviewStatus;
  stages: PathwayStageSummary[];
  sourceCount: number | null;
  expertAssignmentGate?: ExpertAssignmentGate | null;
  definition?: VisaPathwayFiveStageDefinitionInput;
  isLegacyRuleGroup?: boolean;
}

export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

export interface PolicyStudioSnapshot {
  overview: PolicyStudioOverview;
  summary: PolicySummary | null;
  policyChanges: PolicyChange[];
  rules: VisaRule[];
  decisionLogs: DecisionLog[];
  ruleChanges: RuleChangeAudit[];
  affectedJourneys: AffectedJourney[];
  releaseGates: ReleaseGate[];
  pathways: PolicyPathway[];
  capabilities: {
    overview: boolean;
    audit: boolean;
    affectedJourneys: boolean;
    releaseGates: boolean;
    pathways: boolean;
    mutations: boolean;
  };
  warnings: string[];
}
