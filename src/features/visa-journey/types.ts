export type JourneyStage = 1 | 2 | 3 | 4 | 5;

export type RequirementStatus =
  | 'SATISFIED'
  | 'IMPROVABLE'
  | 'TIME_DEPENDENT'
  | 'COMPANY_ACTION_REQUIRED'
  | 'NOT_REMEDIABLE'
  | 'INSUFFICIENT_DATA'
  | 'EXPERT_REVIEW_REQUIRED';

export type ItemProgressStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'NOT_APPLICABLE';

export type JourneyFreshness =
  | 'CURRENT'
  | 'UPCOMING_CHANGE'
  | 'UNDER_REVIEW'
  | 'REVIEW_OVERDUE'
  | 'SOURCE_UNAVAILABLE'
  | 'UNKNOWN';

export type ExpertServiceType = 'CONSULTATION' | 'DOCUMENT_REVIEW' | 'APPLICATION_AGENCY';

export interface PolicyCitation {
  id?: string;
  title: string;
  url?: string | null;
  clause?: string | null;
  effectiveFrom?: string | null;
}

export interface PolicyContext {
  releaseId?: string | null;
  version?: string | null;
  hash?: string | null;
  policyAsOf?: string | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  reviewedAt?: string | null;
  evaluatedAt?: string | null;
  freshness?: JourneyFreshness | null;
  upcomingChangeSummary?: string | null;
}

export interface RequirementEvaluation {
  id: string;
  title: string;
  description?: string | null;
  status: RequirementStatus;
  currentValue?: string | null;
  requiredValue?: string | null;
  reason?: string | null;
  reasonCode?: string | null;
  citations?: PolicyCitation[];
}

export interface GapAction {
  id: string;
  requirementId?: string | null;
  title: string;
  description?: string | null;
  owner?: string | null;
  currentState?: string | null;
  targetState?: string | null;
  recommendedAction?: string | null;
  dueAt?: string | null;
  expectedCompletionAt?: string | null;
  status: ItemProgressStatus;
  citations?: PolicyCitation[];
}

export interface EvidenceItem {
  id: string;
  requirementId?: string | null;
  title: string;
  description?: string | null;
  owner?: string | null;
  issuer?: string | null;
  format?: string | null;
  validUntil?: string | null;
  dueAt?: string | null;
  status: ItemProgressStatus;
  requiresExpertReview?: boolean;
  citations?: PolicyCitation[];
}

export interface ProcedureStep {
  id: string;
  order: number;
  title: string;
  description?: string | null;
  owner?: string | null;
  channel?: string | null;
  officialUrl?: string | null;
  dueAt?: string | null;
  status: ItemProgressStatus;
  dependencyIds?: string[];
  citations?: PolicyCitation[];
}

export interface ExpertCase {
  id: string;
  serviceType: ExpertServiceType;
  status: string;
  question?: string | null;
  createdAt: string;
  assignedExpertName?: string | null;
}

export interface JourneyLegalNotice {
  code?: string | null;
  ko?: string | null;
  en?: string | null;
  agencyKo?: string | null;
  agencyEn?: string | null;
}

export interface VisaJourney {
  id: string;
  status: string;
  targetVisaCode?: string | null;
  currentVisaCode?: string | null;
  targetVisaType?: string | null;
  currentVisaType?: string | null;
  targetPathway?: string | null;
  targetPathwayName?: string | null;
  targetApplicationDate?: string | null;
  currentStage?: JourneyStage | null;
  outcome?: string | null;
  missingInputs?: string[];
  assessmentInputs?: VisaAssessmentInput;
  policy?: PolicyContext | null;
  legalNotice?: JourneyLegalNotice | null;
  requirements: RequirementEvaluation[];
  gapActions: GapAction[];
  evidenceItems: EvidenceItem[];
  procedureSteps: ProcedureStep[];
  expertCases: ExpertCase[];
}

export interface CreateVisaJourneyInput {
  targetVisaCode: string;
  targetPathwayName?: string;
  currentVisaCode?: string;
  targetApplicationDate?: string;
  locale?: string;
}

export interface CreateExpertCaseInput {
  serviceType: ExpertServiceType;
  question?: string;
  consentToShare: true;
}

export interface VisaAssessmentInput {
  policyAsOf?: string;
  ksicCode?: string;
  companySizeType?: string;
  employeeCountKorean?: number;
  employeeCountForeign?: number;
  annualRevenue?: number;
  addressRoad?: string;
  jobType?: string;
  offeredSalary?: number;
  nationality?: string;
  age?: number;
  educationLevel?: string;
  koreanLevel?: string;
  workExperienceYears?: number;
  currentVisaCode?: string;
  targetOccupationCode?: string;
}

export type AssessmentProfilePrefill = Pick<
  VisaAssessmentInput,
  'nationality' | 'age' | 'educationLevel' | 'koreanLevel' | 'workExperienceYears' | 'currentVisaCode'
>;
