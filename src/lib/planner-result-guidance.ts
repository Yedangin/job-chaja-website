import type {
  PlannerLang,
  PlannerPathway,
  PlannerPolicyEvidence,
} from './planner-types';

export type MetricInsight = {
  label: string;
  value: string;
  level: string;
  benchmark: string;
  meaning: string;
  nextAction: string;
  tone: 'blue' | 'green' | 'amber' | 'rose' | 'slate';
};

export type SignalGuidance = {
  title: string;
  reason: string;
  action: string;
  owner: 'user' | 'platform' | 'review';
};

const copy = {
  en: {
    fitLabel: 'Route fit (comparison score)',
    fitHigh: 'Higher comparison fit',
    fitMedium: 'Conditional review',
    fitLow: 'Needs substantial review',
    fitBenchmark: 'Guide: 71–100 higher · 51–70 conditional · 1–50 needs review',
    fitMeaning: 'Compares the entered profile with this route in the JobChaja model. It is not an approval probability or an official eligibility decision.',
    fitHighAction: 'Confirm the detailed requirements and supporting evidence for every stage.',
    fitMediumAction: 'Review the missing conditions below before relying on this route.',
    fitLowAction: 'Treat this as an alternative and review other routes or request an individual consultation.',
    readinessLabel: 'Current preparation reference',
    readinessHigh: 'Most listed requirements confirmed',
    readinessMedium: 'Some requirements confirmed',
    readinessLow: 'Many requirements remain unconfirmed',
    readinessBenchmark: 'Rule comparison: confirmed requirements receive points; unmet and unknown requirements receive none',
    readinessMeaning: 'A weighted comparison against the listed route requirements. It is not an approval probability or an official eligibility decision.',
    readinessHighAction: 'Check originals, validity periods, translations, and stage-specific requirements.',
    readinessMediumAction: 'Complete the items marked “needs preparation” and update the profile.',
    readinessLowAction: 'Start with the first unmet condition and missing profile information shown below.',
    completenessLabel: 'Information confirmation',
    completenessHigh: 'Most items checked',
    completenessMedium: 'More evidence needed',
    completenessLow: 'Many items not entered',
    completenessBenchmark: 'Known values and verified yes/no answers increase this score; unknown items do not',
    completenessMeaning: 'Shows how much of the route can be compared from the current profile and evidence. It is separate from meeting the requirements.',
    completenessAction: 'Add the missing facts and supporting evidence shown in the requirement list.',
    durationLabel: 'Estimated preparation time',
    durationShortest: 'Shortest among these options',
    durationLonger: (months: number) => `${months} months longer than the shortest option`,
    durationSame: 'Similar to the shortest option',
    durationBenchmark: 'Shorter is not “more eligible”; compare it with cost, conditions, and review risk.',
    durationMeaning: 'A model estimate from now through route preparation. It is not an authority processing time, permitted period of stay, or promised completion date.',
    durationAction: 'Open the route to see the estimated timing and preparation for each stage.',
  },
  ko: {
    fitLabel: '경로 적합도(비교점수)',
    fitHigh: '비교상 적합도 높음',
    fitMedium: '조건부 검토 구간',
    fitLow: '상당한 보완·검토 필요',
    fitBenchmark: '잡차자 해석 기준: 71~100 높음 · 51~70 조건부 검토 · 1~50 보완 필요',
    fitMeaning: '입력한 프로필과 이 경로를 잡차자 모델 안에서 비교한 값입니다. 발급 확률이나 법적 자격 판정이 아닙니다.',
    fitHighAction: '각 단계의 최신 필요조건과 증빙을 별도로 확인하세요.',
    fitMediumAction: '아래 보완 항목을 확인한 뒤 이 경로를 검토하세요.',
    fitLowAction: '대안 경로와 함께 비교하고 개인별 상담을 우선 권장합니다.',
    readinessLabel: '현재 준비 참고도',
    readinessHigh: '기재된 요건 대부분 확인',
    readinessMedium: '일부 요건 확인',
    readinessLow: '미확인·미충족 요건이 많음',
    readinessBenchmark: '규칙 대조 방식: 충족·최소선 충족만 점수 반영 · 미충족·확인 필요는 0점',
    readinessMeaning: '해당 경로에 기재된 요건을 중요도에 따라 가중 대조한 값입니다. 발급 확률이나 공식 자격 판정이 아닙니다.',
    readinessHighAction: '원본·유효기간·번역 여부와 단계별 추가조건을 확인하세요.',
    readinessMediumAction: '아래 ‘내가 준비할 조건’을 완료하고 프로필을 갱신하세요.',
    readinessLowAction: '표시된 첫 미충족 조건과 누락 입력부터 준비하세요.',
    completenessLabel: '정보 확인도',
    completenessHigh: '대부분 확인됨',
    completenessMedium: '추가 증빙 필요',
    completenessLow: '미입력 항목이 많음',
    completenessBenchmark: '현재값 또는 검증 가능한 예·아니오가 있어야 반영되며, 확인 필요 항목은 점수에 포함하지 않음',
    completenessMeaning: '현재 프로필과 증빙으로 전체 규칙 중 얼마나 대조할 수 있는지를 나타냅니다. 요건 충족 점수와는 별개입니다.',
    completenessAction: '요건 목록에 표시된 미입력 정보와 증빙을 차례로 추가하세요.',
    durationLabel: '예상 준비기간',
    durationShortest: '후보 경로 중 가장 짧은 예상',
    durationLonger: (months: number) => `가장 짧은 후보보다 약 ${months}개월 더 필요`,
    durationSame: '가장 짧은 후보와 비슷한 기간',
    durationBenchmark: '짧을수록 자격이 좋은 것은 아닙니다. 비용·조건·심사 위험을 함께 비교하세요.',
    durationMeaning: '현재부터 경로의 각 단계를 준비하는 데 필요한 모델 예상치입니다. 행정기관 심사기간, 허가 체류기간, 완료 보장일이 아닙니다.',
    durationAction: '경로를 열어 단계별 예상 시점과 준비할 일을 확인하세요.',
  },
};

function guidanceCopy(lang: PlannerLang) {
  return lang === 'ko' ? copy.ko : copy.en;
}

export function getFitInsight(score: number, lang: PlannerLang): MetricInsight {
  const c = guidanceCopy(lang);
  const high = score >= 71;
  const medium = score >= 51;
  return {
    label: c.fitLabel,
    value: `${score}/100`,
    level: high ? c.fitHigh : medium ? c.fitMedium : c.fitLow,
    benchmark: c.fitBenchmark,
    meaning: c.fitMeaning,
    nextAction: high ? c.fitHighAction : medium ? c.fitMediumAction : c.fitLowAction,
    tone: high ? 'green' : medium ? 'amber' : 'rose',
  };
}

export function getReadinessInsight(score: number, lang: PlannerLang): MetricInsight {
  const c = guidanceCopy(lang);
  const high = score >= 80;
  const medium = score >= 60;
  return {
    label: c.readinessLabel,
    value: `${score}/100`,
    level: high ? c.readinessHigh : medium ? c.readinessMedium : c.readinessLow,
    benchmark: c.readinessBenchmark,
    meaning: c.readinessMeaning,
    nextAction: high ? c.readinessHighAction : medium ? c.readinessMediumAction : c.readinessLowAction,
    tone: high ? 'green' : medium ? 'amber' : 'rose',
  };
}

export function getCompletenessInsight(score: number, lang: PlannerLang): MetricInsight {
  const c = guidanceCopy(lang);
  const high = score >= 80;
  const medium = score >= 50;
  return {
    label: c.completenessLabel,
    value: `${score}/100`,
    level: high ? c.completenessHigh : medium ? c.completenessMedium : c.completenessLow,
    benchmark: c.completenessBenchmark,
    meaning: c.completenessMeaning,
    nextAction: c.completenessAction,
    tone: high ? 'green' : medium ? 'amber' : 'rose',
  };
}

export function getDurationInsight(
  months: number,
  shortestMonths: number,
  lang: PlannerLang,
): MetricInsight {
  const c = guidanceCopy(lang);
  const difference = Math.max(0, months - shortestMonths);
  return {
    label: c.durationLabel,
    value: lang === 'ko' ? `약 ${months}개월` : `About ${months} months`,
    level: difference === 0 ? c.durationShortest : difference <= 2 ? c.durationSame : c.durationLonger(difference),
    benchmark: c.durationBenchmark,
    meaning: c.durationMeaning,
    nextAction: c.durationAction,
    tone: difference === 0 ? 'blue' : 'slate',
  };
}

export function extractVisaCodes(pathway: PlannerPathway): string[] {
  const source = pathway.visaChainItems?.length
    ? pathway.visaChainItems.join(' ')
    : pathway.visaChain;
  return Array.from(new Set(source.toUpperCase().match(/\b[A-Z]-\d+(?:-[A-Z0-9]+)?\b/g) ?? []));
}

export function policyEvidenceForVisa(
  pathway: PlannerPathway,
  visaStatus: string,
): PlannerPolicyEvidence[] {
  const codes: string[] = visaStatus.toUpperCase().match(/\b[A-Z]-\d+(?:-[A-Z0-9]+)?\b/g) ?? [];
  return (pathway.policyEvidence ?? []).filter((item) => codes.includes(item.visaCode.toUpperCase()));
}

export function hasMissingPolicyEvidence(pathway: PlannerPathway): boolean {
  return pathway.policyStatus === 'REVIEW_REQUIRED' || pathway.riskFlags.includes('policy_evidence_missing');
}

const signalCopy: Record<string, { en: SignalGuidance; ko: SignalGuidance }> = {
  fund_gap: {
    en: { title: 'Strengthen financial preparation', reason: 'The entered available funds are below the comparison value configured for this route.', action: 'Confirm the latest amount and accepted evidence with the school, mission, or immigration office, then prepare traceable account and funding records.', owner: 'user' },
    ko: { title: '재정 준비 보완', reason: '입력한 준비 가능 자금이 이 경로의 현재 비교 기준보다 낮습니다.', action: '신청 시점의 학교·공관·출입국 기준 금액과 인정 서류를 확인한 뒤, 자금 출처와 잔액을 설명할 수 있는 증빙을 준비하세요.', owner: 'user' },
  },
  topik_gap: {
    en: { title: 'Improve or verify Korean ability', reason: 'The entered TOPIK level does not reach the comparison value for this route.', action: 'Check the exact language condition for the target institution and stage, then set the next test or program goal.', owner: 'user' },
    ko: { title: '한국어 조건 보완', reason: '입력한 TOPIK 수준이 이 경로의 현재 비교 기준에 미치지 않습니다.', action: '목표 학교·직종·단계의 정확한 언어 조건을 확인하고 다음 시험 또는 교육과정 목표를 정하세요.', owner: 'user' },
  },
  degree_document_check: {
    en: { title: 'Verify education documents', reason: 'The profile does not confirm that degree or graduation evidence is ready.', action: 'Check originals, apostille or consular confirmation, translation, and issuance validity for the actual filing destination.', owner: 'user' },
    ko: { title: '학력 서류 확인', reason: '프로필에서 학위·졸업 증빙을 준비할 수 있는지 확인되지 않았습니다.', action: '제출 기관 기준에 따라 원본, 아포스티유·영사확인, 번역, 발급 유효기간을 확인하세요.', owner: 'user' },
  },
  career_evidence_needed: {
    en: { title: 'Build career evidence', reason: 'Relevant work experience or its evidence is not confirmed in the profile.', action: 'Organize employer-issued certificates, duties, dates, pay records, portfolio, and their consistency with the target occupation.', owner: 'user' },
    ko: { title: '경력 증빙 보완', reason: '관련 경력 또는 이를 입증할 정보가 프로필에서 확인되지 않았습니다.', action: '회사 발급 경력증명, 담당업무, 근무기간, 급여 자료, 포트폴리오를 목표 직종과 일치하도록 정리하세요.', owner: 'user' },
  },
  policy_evidence_missing: {
    en: { title: 'JobChaja policy evidence review required', reason: 'One or more visa stages lack a linked, approved record containing an official source, effective date, and policy review.', action: 'This is not a user failure. Do not rely on the route as a confirmed requirement list until JobChaja links reviewed evidence; reconfirm with the official authority or a qualified professional.', owner: 'platform' },
    ko: { title: '잡차자 정책 근거 검토 필요', reason: '경로의 비자 단계 중 하나 이상에 공식 출처·시행일·검토 승인이 포함된 정책 원장 기록이 연결되지 않았습니다.', action: '사용자 조건 미달이 아닙니다. 잡차자가 검토 근거를 연결하기 전에는 확정 요건으로 의존하지 말고, 공식기관 또는 자격 있는 전문가에게 최신 기준을 재확인하세요.', owner: 'platform' },
  },
  official_process_only: {
    en: { title: 'Use the official process only', reason: 'This route is administered through a government process with country- and schedule-specific steps.', action: 'Use only the current official notice and authorized application channel; independently verify fees and schedules.', owner: 'review' },
    ko: { title: '공식 절차만 이용', reason: '정부가 운영하며 국가·시기별 절차와 일정이 달라지는 경로입니다.', action: '최신 공식 공고와 지정 접수창구만 이용하고 비용·일정을 별도로 확인하세요.', owner: 'review' },
  },
  points_must_be_verified: {
    en: { title: 'Individual points review required', reason: 'A summary profile cannot confirm the official point calculation and evidence acceptance.', action: 'Calculate each category with current tables and have the supporting records reviewed before filing.', owner: 'review' },
    ko: { title: '개인별 점수 검토 필요', reason: '요약 프로필만으로는 공식 점수 계산과 증빙 인정 여부를 확정할 수 없습니다.', action: '신청 시점의 점수표로 항목별 점수를 다시 계산하고 증빙 인정 여부를 검토받으세요.', owner: 'review' },
  },
  regional_quota_changes: {
    en: { title: 'Regional quota and notice check', reason: 'Eligible regions, quotas, occupations, and schedules may change by notice.', action: 'Check the target local authority’s current notice and remaining quota before preparing the application.', owner: 'review' },
    ko: { title: '지역 공고·인원 확인', reason: '대상 지역, 인원, 직종, 접수 일정이 공고마다 바뀔 수 있습니다.', action: '목표 지자체의 최신 공고와 잔여 인원을 확인한 뒤 신청을 준비하세요.', owner: 'review' },
  },
  investment_document_review: {
    en: { title: 'Investment and business review required', reason: 'Capital source, remittance, business substance, and corporate records require case-specific review.', action: 'Have the full capital flow and business documents checked before taking an irreversible step.', owner: 'review' },
    ko: { title: '투자·사업 자료 검토 필요', reason: '투자금 출처·송금·사업 실체·법인 자료는 개인별 확인이 필요합니다.', action: '되돌리기 어려운 투자 전에 전체 자금 흐름과 사업 서류를 전문가에게 검토받으세요.', owner: 'review' },
  },
  status_change_rules_must_be_checked: {
    en: { title: 'Status-change eligibility check', reason: 'Whether a domestic status change is allowed depends on the current status, stay history, timing, and exceptions.', action: 'Confirm whether domestic change is permitted before a school, employer, or contract commitment.', owner: 'review' },
    ko: { title: '국내 체류자격 변경 확인', reason: '국내 변경 가능 여부는 현재 체류자격, 체류 이력, 신청 시점과 예외 규정에 따라 달라집니다.', action: '학교·고용주·계약을 확정하기 전에 국내 변경 가능 여부를 개별 확인하세요.', owner: 'review' },
  },
};

export function getSignalGuidance(key: string, lang: PlannerLang): SignalGuidance {
  const item = signalCopy[key];
  if (item) return lang === 'ko' ? item.ko : item.en;
  const readable = key.replaceAll('_', ' ');
  return lang === 'ko'
    ? { title: readable, reason: '이 항목의 상세 설명이 아직 정책 원장에 연결되지 않았습니다.', action: '신청 전에 공식 기준과 개인별 적용 여부를 확인하세요.', owner: 'review' }
    : { title: readable, reason: 'Detailed guidance for this item is not yet linked to the policy register.', action: 'Confirm the official rule and how it applies to your case before filing.', owner: 'review' };
}
