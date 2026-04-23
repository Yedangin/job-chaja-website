export interface DiagnosisInput {
  nationality: string;
  age: number;
  educationLevel: string;
  availableAnnualFund: number;
  finalGoal: string;
  priorityPreference: string;
  topikLevel?: number;
  workExperienceYears?: number;
  major?: string;
  isEthnicKorean?: boolean;
  currentVisa?: string;
  koreaStayMonths?: number;
}

export interface Milestone {
  order: number;
  monthFromStart: number;
  type: string;
  nameKo: string;
  visaStatus: string;
  canWorkPartTime: boolean;
  weeklyHours: number;
  estimatedMonthlyIncome: number;
  requirements: string;
  platformAction: string;
}

export interface NextStep {
  actionType: string;
  nameKo: string;
  description: string;
  url?: string;
}

export interface RecommendedPathway {
  pathwayId: string;
  nameKo: string;
  nameEn: string;
  finalScore: number;
  scoreBreakdown: {
    base: number;
    ageMultiplier: number;
    nationalityMultiplier: number;
    fundMultiplier: number;
    educationMultiplier: number;
    priorityWeight: number;
  };
  feasibilityLabel: string;
  estimatedMonths: number;
  estimatedCostWon: number;
  visaChain: string;
  platformSupport: string;
  milestones: Milestone[];
  nextSteps: NextStep[];
  note: string;
  lastUpdatedAt?: string | null;
  lastUpdatedReason?: string | null;
}

export interface DiagnosisResult {
  sessionId?: string;
  pathways: RecommendedPathway[];
  meta: {
    totalPathwaysEvaluated: number;
    hardFilteredOut: number;
    timestamp: string;
  };
}

export function getFeasibilityEmoji(label: string) {
  switch (label) {
    case '높음':
      return '🔥';
    case '보통':
      return '👍';
    case '낮음':
      return '⚠️';
    case '매우낮음':
      return '🧭';
    default:
      return '📌';
  }
}

export function getScoreColor(score: number) {
  if (score >= 70) return '#0f9f6e';
  if (score >= 50) return '#2563eb';
  if (score >= 30) return '#d97706';
  return '#dc2626';
}
