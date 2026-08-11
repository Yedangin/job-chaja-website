export interface VisaSourceCitationInput {
  title: string;
  url: string;
  clause: string;
  effectiveFrom: string;
}

export interface VisaPathwayDefinitionItemInput {
  code: string;
  title: string;
  description?: string;
  sourceCitation: VisaSourceCitationInput;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
}

export interface VisaPathwayFiveStageDefinitionInput {
  eligibilityRequirements: VisaPathwayDefinitionItemInput[];
  remediationOptions: VisaPathwayDefinitionItemInput[];
  evidenceRequirements: VisaPathwayDefinitionItemInput[];
  procedureSteps: VisaPathwayDefinitionItemInput[];
  escalationRules: VisaPathwayDefinitionItemInput[];
}

export interface PolicyCommandResult {
  id?: string;
  version?: string;
  status?: string;
  [key: string]: unknown;
}

export interface CreatePolicyReleaseInput {
  name: string;
  version: string;
  contentHash: string;
  effectiveFrom: string;
  effectiveTo?: string;
  reason: string;
}

export interface UpdatePolicyReleaseInput {
  name?: string;
  contentHash?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  reason: string;
}

export interface UpsertPolicyPathwayInput {
  currentVisaCode?: string;
  targetVisaCode: string;
  name: string;
  locale?: string;
  definition: VisaPathwayFiveStageDefinitionInput;
  reason: string;
}

export interface VisaRuleClauseInput {
  field: string;
  op: string;
  value: string | number | boolean | string[] | number[];
}

export interface CreateReleaseRuleInput {
  visaTypeCode: string;
  ruleName: string;
  ruleDescription?: string;
  priority?: number;
  ruleType: 'ELIGIBILITY' | 'RESTRICTION' | 'DOCUMENT' | 'QUOTA';
  conditions: { operator: 'AND' | 'OR'; clauses: VisaRuleClauseInput[] };
  actions: {
    type: 'ELIGIBLE' | 'BLOCKED' | 'DOCUMENT' | 'RESTRICTION';
    documents?: string[];
    restrictions?: string[];
    notes?: string;
    reason?: string;
    suggestion?: string;
  };
  reason: string;
}

