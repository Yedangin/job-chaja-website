import { apiClient } from '@/lib/api-client';
import {
  normalizeAffected,
  normalizeDecisionLogs,
  normalizeOverview,
  normalizePathways,
  normalizeReleaseGates,
  normalizeRuleAudits,
  type RawAdminOverview,
  type RawAffectedResponse,
  type RawDecisionLog,
  type RawPathway,
  type RawReleaseGate,
  type RawRuleAudit,
} from './api-normalizers';
import type {
  DecisionLog,
  Paginated,
  PolicyChange,
  PolicyPathway,
  PolicyStudioSnapshot,
  PolicySummary,
  RuleChangeAudit,
  RuleVersion,
  VisaRule,
} from './types';

const JOURNEY_ADMIN = '/visa-journeys/admin';
const CURRENT_ENDPOINTS = {
  summary: '/policy/summary',
  policyChanges: '/policy/changes?limit=20',
  rules: '/visa-rules/rules?limit=100',
  decisionLogs: '/visa-rules/evaluation-logs?limit=20',
} as const;

async function get<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await apiClient.get<T>(url, { signal });
  return response.data;
}

function valueOf<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null;
}

function legacyPathways(rules: VisaRule[]): PolicyPathway[] {
  const grouped = new Map<string, VisaRule[]>();
  for (const rule of rules) grouped.set(rule.visaTypeCode, [...(grouped.get(rule.visaTypeCode) ?? []), rule]);
  return Array.from(grouped.entries()).sort(([left], [right]) => left.localeCompare(right)).map(([visaCode, group]) => {
    const active = group.filter((rule) => rule.status === 'ACTIVE');
    const latest = [...group].sort((a, b) => b.version - a.version)[0];
    const updatedAt = group.map((rule) => rule.createdAt).filter(Boolean).sort().at(-1) ?? null;
    return {
      id: `legacy:${visaCode}`, code: visaCode, name: `${visaCode} ${latest?.visaTypeNameKo ?? ''}`.trim(),
      currentVisa: null, targetVisa: visaCode, status: active.length ? 'LEGACY_ACTIVE' : 'LEGACY_INACTIVE',
      releaseVersion: null, policyAsOf: null, effectiveFrom: active.map((rule) => rule.effectiveFrom).sort().at(-1) ?? null,
      reviewedAt: null, reviewStatus: 'UNKNOWN', sourceCount: null, isLegacyRuleGroup: true,
      stages: [
        { stage: 'ELIGIBILITY' as const, configured: active.length, reviewStatus: 'UNKNOWN' as const, updatedAt },
        ...(['CONDITION_ROADMAP', 'EVIDENCE', 'SELF_PROCEDURE', 'EXPERT_HANDOFF'] as const).map((stage) => ({ stage, configured: null, reviewStatus: 'UNKNOWN' as const, updatedAt: null })),
      ],
    };
  });
}

function legacyRuleChanges(rules: VisaRule[]): RuleChangeAudit[] {
  return [...rules].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 20).map((rule) => ({
    id: `rule:${rule.id}`, ruleId: rule.id, ruleName: rule.ruleName, visaTypeCode: rule.visaTypeCode,
    fromVersion: rule.version > 1 ? String(rule.version - 1) : null, toVersion: String(rule.version), changedAt: rule.createdAt,
    changedBy: rule.updatedBy ?? rule.createdBy, changeType: rule.version > 1 ? 'VERSION_CREATED' : 'RULE_CREATED', legalReviewStatus: 'UNKNOWN',
  }));
}

export async function loadPolicyStudioSnapshot(signal: AbortSignal): Promise<PolicyStudioSnapshot> {
  const results = await Promise.allSettled([
    get<RawAdminOverview>(`${JOURNEY_ADMIN}/overview`, signal),
    get<Paginated<RawDecisionLog>>(`${JOURNEY_ADMIN}/audit/decision-logs?limit=20`, signal),
    get<Paginated<RawRuleAudit>>(`${JOURNEY_ADMIN}/audit/rule-changes?limit=20`, signal),
    get<RawAffectedResponse>(`${JOURNEY_ADMIN}/affected-journeys`, signal),
    get<RawReleaseGate[]>(`${JOURNEY_ADMIN}/release-gates`, signal),
    get<RawPathway[]>(`${JOURNEY_ADMIN}/pathways`, signal),
    get<PolicySummary>(CURRENT_ENDPOINTS.summary, signal),
    get<Paginated<PolicyChange>>(CURRENT_ENDPOINTS.policyChanges, signal),
    get<Paginated<VisaRule>>(CURRENT_ENDPOINTS.rules, signal),
    get<Paginated<DecisionLog>>(CURRENT_ENDPOINTS.decisionLogs, signal),
  ]);
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

  const [overviewResult, decisionResult, auditResult, affectedResult, gatesResult, pathwaysResult, summaryResult, changesResult, rulesResult, legacyLogsResult] = results;
  const rawOverview = valueOf(overviewResult);
  const rawGates = valueOf(gatesResult);
  const rawPathways = valueOf(pathwaysResult);
  const summary = valueOf(summaryResult);
  const rules = valueOf(rulesResult)?.data ?? [];
  const gates = normalizeReleaseGates(rawGates ?? []);
  const pathways = rawPathways ? normalizePathways(rawPathways, rawOverview, rawGates ?? []) : legacyPathways(rules);
  const normalizedAudits = normalizeRuleAudits(valueOf(auditResult)?.data ?? []);
  const decisionLogs = valueOf(decisionResult) ? normalizeDecisionLogs(valueOf(decisionResult)!.data) : (valueOf(legacyLogsResult)?.data ?? []);
  const hasAnySource = Boolean(rawOverview || summary || rules.length || decisionLogs.length);
  if (!hasAnySource) throw new Error('정책 스튜디오 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');

  const warnings: string[] = [];
  if (!rawOverview) warnings.push('통합 정책 릴리스와 5단계 현황 API가 연결되지 않았습니다.');
  if (!rawPathways) warnings.push('비자 경로 원장이 없어 기존 비자 규칙을 읽기 전용으로 표시합니다.');
  if (!valueOf(affectedResult)) warnings.push('정책 변경 영향 여정 계산 결과를 아직 조회할 수 없습니다.');
  if (!rawGates) warnings.push('배포 게이트 검증 결과를 확인할 수 없어 배포를 잠갔습니다.');

  return {
    overview: normalizeOverview(rawOverview, summary, pathways, gates),
    summary,
    policyChanges: valueOf(changesResult)?.data ?? [],
    rules,
    decisionLogs,
    ruleChanges: normalizedAudits.length ? normalizedAudits : legacyRuleChanges(rules),
    affectedJourneys: normalizeAffected(valueOf(affectedResult)),
    releaseGates: gates,
    pathways,
    capabilities: {
      overview: Boolean(rawOverview), audit: Boolean(valueOf(decisionResult) && valueOf(auditResult)),
      affectedJourneys: Boolean(valueOf(affectedResult)), releaseGates: Boolean(rawGates), pathways: Boolean(rawPathways), mutations: true,
    },
    warnings,
  };
}

export async function loadRuleHistory(ruleId: string, signal: AbortSignal): Promise<{ versions: RuleVersion[]; details: VisaRule[] }> {
  const versions = await get<RuleVersion[]>(`/visa-rules/rules/${ruleId}/versions`, signal);
  const detailResults = await Promise.allSettled(versions.slice(0, 2).map((version) => get<VisaRule>(`/visa-rules/rules/${version.id}`, signal)));
  return {
    versions,
    details: detailResults.filter((result): result is PromiseFulfilledResult<VisaRule> => result.status === 'fulfilled').map((result) => result.value),
  };
}

