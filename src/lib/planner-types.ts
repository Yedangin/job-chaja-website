export type PlannerLang = 'en' | 'ko' | 'vi' | 'th' | 'fil';

export function normalizePlannerLang(lang?: string): PlannerLang {
  if (lang === 'tl' || lang === 'fil') return 'fil';
  return ['en', 'ko', 'vi', 'th'].includes(lang || '')
    ? (lang as PlannerLang)
    : 'en';
}

export type PlannerDifficulty =
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'expert_review';

export type PlannerInput = {
  nationality: string;
  residenceCountry?: string;
  age: number;
  educationLevel: string;
  availableAnnualFund: number;
  finalGoal: string;
  priorityPreference: string;
  language?: PlannerLang;
  topikLevel?: number;
  kiipStage?: number;
  workExperienceYears?: number;
  major?: string;
  majorCategory?: string;
  targetOccupation?: string;
  isEthnicKorean?: boolean;
  currentVisa?: string;
  koreaStayMonths?: number;
  hasDegreeDocument?: boolean;
};

export type PlannerMilestone = {
  order: number;
  monthFromStart: number;
  type: string;
  nameKo: string;
  nameEn: string;
  visaStatus: string;
  canWorkPartTime: boolean;
  weeklyHours: number;
  estimatedMonthlyIncome: number;
  requirements: string;
  platformAction: string;
};

export type PlannerNextStep = {
  actionType: string;
  nameKo: string;
  nameEn: string;
  description: string;
  url?: string;
};

export type PlannerPolicyEvidence = {
  visaCode: string;
  sourceSite: string;
  sourceUrl: string;
  contentHash: string;
  effectiveDate: string | null;
  reviewedAt: string;
  ruleId: string;
  version: number;
};

export type PlannerRequirementCategory =
  | 'age'
  | 'nationality'
  | 'education'
  | 'language'
  | 'funds'
  | 'experience'
  | 'admission'
  | 'employment'
  | 'documents'
  | 'insurance'
  | 'quota'
  | 'status'
  | 'investment'
  | 'points'
  | 'residence'
  | 'other';

export type PlannerRequirementStatus =
  | 'met'
  | 'minimum_met'
  | 'unmet'
  | 'unknown'
  | 'not_applicable';

export type PlannerRequirementSeverity = 'required' | 'recommended' | 'variable';

export type PlannerRequirementAssessment = {
  id: string;
  stage: string;
  category: PlannerRequirementCategory;
  status: PlannerRequirementStatus;
  severity: PlannerRequirementSeverity;
  title: string;
  currentValue: string;
  requiredValue: string;
  explanation: string;
  action: string;
  sourceName: string;
  sourceUrl: string;
  sourceReviewedAt: string;
  shortfall?: string;
};

export type PlannerRequirementSummary = {
  met: number;
  minimumMet: number;
  unmet: number;
  unknown: number;
  notApplicable: number;
};

export type PlannerPathway = {
  pathwayId: string;
  nameKo: string;
  nameEn: string;
  finalScore: number;
  suitabilityScore: number;
  readinessScore: number;
  dataCompletenessScore?: number;
  requirementStatus?:
    | 'MINIMUMS_CONFIRMED'
    | 'EVIDENCE_REQUIRED'
    | 'PREPARATION_REQUIRED'
    | 'NO_APPLICABLE_RULES';
  difficultyLevel: PlannerDifficulty;
  feasibilityLabel: string;
  estimatedMonths: number;
  estimatedCostWon: number;
  visaChain: string;
  visaChainItems: string[];
  platformSupport: string;
  milestones: PlannerMilestone[];
  nextSteps: PlannerNextStep[];
  note: string;
  strengths: string[];
  gaps: string[];
  riskFlags: string[];
  requirementAssessments?: PlannerRequirementAssessment[];
  requirementSummary?: PlannerRequirementSummary;
  needsHumanReview: boolean;
  policyEvidence?: PlannerPolicyEvidence[];
  policyAsOf?: string;
  policyVersion?: string | null;
  policyStatus?: 'EVIDENCE_AVAILABLE' | 'REVIEW_REQUIRED';
  display: {
    language: PlannerLang;
    title: string;
    subtitle: string;
    difficultyLabel: string;
    primaryReason: string;
    trustBadge: string;
  };
};

export type PlannerResult = {
  sessionId?: number;
  pathways: PlannerPathway[];
  meta: {
    sessionId?: number;
    totalPathwaysEvaluated: number;
    hardFilteredOut: number;
    timestamp: string;
    language: PlannerLang;
    engineVersion: string;
    policyVersion: string;
    policyLastVerifiedAt: string;
    policyConfidence: {
      score: number | null;
      level: string;
      description: string;
    };
    policyStatus: 'REVIEW_REQUIRED';
    informationOnly: true;
    profileConfidence: {
      score: number;
      completedFields: number;
      totalFields: number;
      missingFields: string[];
    };
    legalNotice: string;
  };
};

export type PlannerClaimResult = {
  sessionId: number;
  saved: boolean;
  profileUpdated: boolean;
  reason?: 'CLAIMED' | 'ALREADY_OWNED';
};

export type PlannerHistoryItem = {
  sessionId: number;
  topPathwayId: string | null;
  pathwayCount: number;
  createdAt: string;
  convertedToSignup: boolean;
  inputSnapshot: PlannerInput;
  resultsSnapshot: PlannerResult;
};

export type PlannerHistoryResponse = {
  items: PlannerHistoryItem[];
  total: number;
  page: number;
  limit: number;
};
