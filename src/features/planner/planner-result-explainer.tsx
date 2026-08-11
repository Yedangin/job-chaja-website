import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  ExternalLink,
  Info,
  Scale,
} from 'lucide-react';
import type {
  PlannerLang,
  PlannerMilestone,
  PlannerPathway,
  PlannerRequirementAssessment,
  PlannerRequirementStatus,
} from '@/lib/planner-types';
import {
  extractVisaCodes,
  getCompletenessInsight,
  getDurationInsight,
  getFitInsight,
  getReadinessInsight,
  getSignalGuidance,
  hasMissingPolicyEvidence,
  policyEvidenceForVisa,
  type MetricInsight,
} from '@/lib/planner-result-guidance';

const toneStyles: Record<MetricInsight['tone'], string> = {
  blue: 'border-sky-200 bg-sky-50 text-sky-800',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  rose: 'border-rose-200 bg-rose-50 text-rose-800',
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
};

const requirementStatusCopy: Record<PlannerLang, Record<PlannerRequirementStatus, string>> = {
  ko: { met: '충족', minimum_met: '최소선 충족', unmet: '미충족', unknown: '확인 필요', not_applicable: '공통 기준 없음' },
  en: { met: 'Met', minimum_met: 'Minimum met', unmet: 'Not met', unknown: 'Needs confirmation', not_applicable: 'No common minimum' },
  vi: { met: 'Đã đáp ứng', minimum_met: 'Đạt mức tối thiểu', unmet: 'Chưa đáp ứng', unknown: 'Cần xác nhận', not_applicable: 'Không có mức tối thiểu chung' },
  th: { met: 'ผ่านเกณฑ์', minimum_met: 'ผ่านขั้นต่ำ', unmet: 'ยังไม่ผ่าน', unknown: 'ต้องตรวจสอบ', not_applicable: 'ไม่มีเกณฑ์ขั้นต่ำทั่วไป' },
  fil: { met: 'Natutugunan', minimum_met: 'Naabot ang minimum', unmet: 'Hindi natutugunan', unknown: 'Kailangang kumpirmahin', not_applicable: 'Walang karaniwang minimum' },
};

const requirementFieldCopy: Record<PlannerLang, { current: string; required: string; why: string; action: string; source: string; fallback: string }> = {
  ko: { current: '현재값', required: '공식·최소 기준', why: '설명', action: '다음 행동', source: '공식 출처', fallback: '세부 기준 데이터 확인 필요' },
  en: { current: 'Current value', required: 'Official / minimum standard', why: 'Why it matters', action: 'Next action', source: 'Official source', fallback: 'Detailed requirement data needs confirmation' },
  vi: { current: 'Giá trị hiện tại', required: 'Tiêu chuẩn chính thức / tối thiểu', why: 'Giải thích', action: 'Việc cần làm', source: 'Nguồn chính thức', fallback: 'Cần xác nhận dữ liệu điều kiện chi tiết' },
  th: { current: 'ค่าปัจจุบัน', required: 'เกณฑ์ทางการ / ขั้นต่ำ', why: 'คำอธิบาย', action: 'สิ่งที่ต้องทำต่อไป', source: 'แหล่งข้อมูลทางการ', fallback: 'ต้องยืนยันข้อมูลเงื่อนไขโดยละเอียด' },
  fil: { current: 'Kasalukuyang halaga', required: 'Opisyal / minimum na pamantayan', why: 'Paliwanag', action: 'Susunod na hakbang', source: 'Opisyal na source', fallback: 'Kailangang kumpirmahin ang detalyadong requirements' },
};

const requirementSeverityCopy: Record<PlannerLang, { required: string; variable: string }> = {
  ko: { required: '필수 확인 항목', variable: '조건별 확인 항목' },
  en: { required: 'Required check', variable: 'Variable by case' },
  vi: { required: 'Điều kiện bắt buộc', variable: 'Tùy từng trường hợp' },
  th: { required: 'เงื่อนไขบังคับ', variable: 'ขึ้นอยู่กับแต่ละกรณี' },
  fil: { required: 'Kailangang kondisyon', variable: 'Depende sa kaso' },
};

const requirementEmptyCopy: Record<PlannerLang, { confirmed: string; preparation: string }> = {
  ko: { confirmed: '현재 입력에서 확인된 충족 조건이 없습니다.', preparation: '표시할 미충족·확인 필요 항목이 없습니다. 전체 조건을 다시 확인하세요.' },
  en: { confirmed: 'No satisfied condition has been confirmed from the current input.', preparation: 'No unmet or unverified item is displayed. Review all requirements.' },
  vi: { confirmed: 'Chưa xác nhận được điều kiện nào đã đáp ứng từ thông tin hiện tại.', preparation: 'Không có mục chưa đạt hoặc cần xác nhận để hiển thị. Hãy xem toàn bộ điều kiện.' },
  th: { confirmed: 'ยังไม่พบเงื่อนไขที่ยืนยันว่าผ่านจากข้อมูลปัจจุบัน', preparation: 'ไม่มีรายการไม่ผ่านหรือต้องตรวจสอบให้แสดง โปรดดูเงื่อนไขทั้งหมด' },
  fil: { confirmed: 'Walang nakumpirmang natugunang kondisyon mula sa kasalukuyang input.', preparation: 'Walang unmet o unverified item na maipapakita. Suriin ang lahat ng requirement.' },
};

export const requirementSectionCopy: Record<PlannerLang, { confirmed: string; preparation: string; all: string }> = {
  ko: { confirmed: '현재 확인된 조건', preparation: '준비·확인할 조건', all: '전체 조건과 준비 단계' },
  en: { confirmed: 'Currently confirmed conditions', preparation: 'Conditions to prepare or confirm', all: 'All requirements and preparation steps' },
  vi: { confirmed: 'Điều kiện đã xác nhận', preparation: 'Điều kiện cần chuẩn bị hoặc xác nhận', all: 'Tất cả điều kiện và bước chuẩn bị' },
  th: { confirmed: 'เงื่อนไขที่ยืนยันแล้ว', preparation: 'เงื่อนไขที่ต้องเตรียมหรือตรวจสอบ', all: 'เงื่อนไขและขั้นตอนการเตรียมทั้งหมด' },
  fil: { confirmed: 'Mga kondisyong nakumpirma', preparation: 'Mga kondisyong dapat ihanda o kumpirmahin', all: 'Lahat ng requirement at paghahanda' },
};

const requirementStatusStyles: Record<PlannerRequirementStatus, string> = {
  met: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  minimum_met: 'border-sky-200 bg-sky-50 text-sky-800',
  unmet: 'border-rose-200 bg-rose-50 text-rose-800',
  unknown: 'border-amber-200 bg-amber-50 text-amber-800',
  not_applicable: 'border-slate-200 bg-slate-50 text-slate-700',
};

function RequirementStatusLabel({ status, lang }: { status: PlannerRequirementStatus; lang: PlannerLang }) {
  return (
    <span className={`shrink-0 rounded-md border px-2 py-1 text-[11px] font-bold ${requirementStatusStyles[status]}`}>
      {requirementStatusCopy[lang][status]}
    </span>
  );
}

function RequirementAssessmentRow({ assessment, lang, compact = false }: { assessment: PlannerRequirementAssessment; lang: PlannerLang; compact?: boolean }) {
  const fields = requirementFieldCopy[lang];
  return (
    <li className="border-b border-[#F2F4F6] py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#191F28]">{assessment.title}</p>
          {assessment.severity !== 'recommended' ? <p className="mt-1 text-[11px] font-semibold text-[#8B95A1]">{assessment.severity === 'required' ? requirementSeverityCopy[lang].required : requirementSeverityCopy[lang].variable}</p> : null}
        </div>
        <RequirementStatusLabel status={assessment.status} lang={lang} />
      </div>
      <dl className="mt-3 grid gap-x-5 gap-y-2 text-xs leading-5 sm:grid-cols-2">
        <div><dt className="font-semibold text-[#8B95A1]">{fields.current}</dt><dd className="mt-0.5 text-[#4E5968]">{assessment.currentValue || '-'}</dd></div>
        <div><dt className="font-semibold text-[#8B95A1]">{fields.required}</dt><dd className="mt-0.5 text-[#4E5968]">{assessment.requiredValue || '-'}</dd></div>
      </dl>
      {assessment.shortfall ? <p className="mt-2 text-xs font-semibold leading-5 text-rose-700">{assessment.shortfall}</p> : null}
      {compact ? <p className="mt-2 text-xs leading-5 text-[#333D4B]"><strong>{fields.action}: </strong>{assessment.action}</p> : null}
      {compact ? null : <>
      <p className="mt-3 text-xs leading-5 text-[#4E5968]"><strong className="text-[#333D4B]">{fields.why}: </strong>{assessment.explanation}</p>
      <p className="mt-2 text-xs leading-5 text-[#333D4B]"><strong>{fields.action}: </strong>{assessment.action}</p>
      {assessment.sourceUrl ? (
        <a href={assessment.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex max-w-full items-center gap-1 text-xs font-semibold text-[#0066FF] hover:underline">
          <span className="truncate">{fields.source}: {assessment.sourceName || assessment.sourceUrl}</span><ExternalLink className="h-3 w-3 shrink-0" />
          {assessment.sourceReviewedAt ? <span className="shrink-0 text-[#8B95A1]">({localizeDate(assessment.sourceReviewedAt, lang)})</span> : null}
        </a>
      ) : <p className="mt-3 text-xs text-amber-700">{fields.source}: {fields.fallback}</p>}
      </>}
    </li>
  );
}

export function RequirementAssessmentList({
  assessments,
  lang,
  statuses,
  limit,
  compact = false,
}: {
  assessments?: PlannerRequirementAssessment[];
  lang: PlannerLang;
  statuses?: PlannerRequirementStatus[];
  limit?: number;
  compact?: boolean;
}) {
  const fields = requirementFieldCopy[lang];
  if (!assessments?.length) {
    return <p className="text-sm leading-6 text-[#6B7684]">{fields.fallback}</p>;
  }
  const filtered = assessments.filter((item) => !statuses?.length || statuses.includes(item.status)).slice(0, limit);
  if (!filtered.length) {
    const isConfirmedFilter = statuses?.includes('met') || statuses?.includes('minimum_met');
    return <p className="text-sm leading-6 text-[#6B7684]">{isConfirmedFilter ? requirementEmptyCopy[lang].confirmed : requirementEmptyCopy[lang].preparation}</p>;
  }
  return <ul className="divide-y divide-[#F2F4F6]">{filtered.map((assessment) => <RequirementAssessmentRow key={assessment.id} assessment={assessment} lang={lang} compact={compact} />)}</ul>;
}

function localizeDate(value: string | undefined, lang: PlannerLang) {
  if (!value) return lang === 'ko' ? '확인일 미등록' : 'Review date unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsed);
}

function MetricCard({ insight }: { insight: MetricInsight }) {
  return (
    <div className="rounded-xl border border-[#E5E8EB] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-[#6B7684]">{insight.label}</p>
          <p className="mt-1 text-xl font-bold text-[#191F28]">{insight.value}</p>
        </div>
        <span className={`rounded-md border px-2 py-1 text-[11px] font-bold ${toneStyles[insight.tone]}`}>{insight.level}</span>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-[#4E5968]">{insight.benchmark}</p>
      <p className="mt-2 text-xs leading-5 text-[#6B7684]">{insight.meaning}</p>
      <p className="mt-3 flex gap-1.5 text-xs font-semibold leading-5 text-[#333D4B]"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0066FF]" />{insight.nextAction}</p>
    </div>
  );
}

export function PathwayMetricGuide({
  pathway,
  shortestMonths,
  lang,
}: {
  pathway: PlannerPathway;
  shortestMonths: number;
  lang: PlannerLang;
}) {
  return (
    <section aria-label={lang === 'ko' ? '경로 지표 해석' : 'Route metric explanation'} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard insight={getFitInsight(pathway.suitabilityScore, lang)} />
      <MetricCard insight={getReadinessInsight(pathway.readinessScore, lang)} />
      <MetricCard insight={getCompletenessInsight(pathway.dataCompletenessScore ?? 0, lang)} />
      <MetricCard insight={getDurationInsight(pathway.estimatedMonths, shortestMonths, lang)} />
    </section>
  );
}

export function PlannerDecisionBoundary({
  lang,
  policyDate,
}: {
  lang: PlannerLang;
  policyDate?: string;
}) {
  const isKo = lang === 'ko';
  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5 sm:p-6" aria-labelledby="jobchaja-result-boundary">
      <div className="flex gap-3">
        <Scale className="mt-0.5 h-5 w-5 shrink-0 text-[#0066FF]" />
        <div>
          <h2 id="jobchaja-result-boundary" className="text-sm font-bold text-[#191F28]">
            {isKo ? '잡차자는 비자 적합·부적합을 판정하지 않습니다' : 'JobChaja does not decide visa eligibility'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#4E5968]">
            {isKo
              ? '이 결과는 입력 정보와 연결된 정책 자료를 바탕으로 검토 가능한 경로와 준비 항목을 정리한 참고 정보입니다. 법률·행정 판단, 신청 대리, 발급 또는 체류 허가 보장이 아닙니다.'
              : 'This result organizes routes and preparation items from the entered information and linked policy records. It is not a legal or administrative decision, filing representation, or a guarantee of visa issuance or stay permission.'}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#333D4B]">
            {isKo
              ? '각 비자 취득·체류자격 변경 단계는 서로 별도로 심사되며 어느 단계에서도 불허될 수 있습니다. 이전 단계의 허가·체류 이력이 다음 단계의 승인을 보장하지 않습니다.'
              : 'Every visa issuance or status-change stage is reviewed separately and may be refused. Approval or stay history at one stage does not guarantee approval at the next stage.'}
          </p>
          <p className="mt-3 inline-flex rounded-md border border-sky-200 bg-white px-2.5 py-1.5 text-xs font-bold text-sky-800">
            {isKo ? `${localizeDate(policyDate, lang)} 기준 정보 · 신청 직전 최신 공식 기준 재확인 필요` : `Information as reviewed on ${localizeDate(policyDate, lang)} · Reconfirm current official rules before filing`}
          </p>
        </div>
      </div>
    </section>
  );
}

export function PathwayReviewWarning({ lang }: { lang: PlannerLang }) {
  return (
    <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{lang === 'ko' ? '개별심사 경로입니다. 각 단계에서 불허될 수 있으므로 아래 조건과 증빙을 단계마다 다시 확인하고 준비해야 합니다.' : 'This route requires individual review. Any stage may be refused, so reconfirm and prepare the requirements and evidence for every stage.'}</p>
    </div>
  );
}

export function PolicyEvidenceNotice({
  pathway,
  policyDate,
  lang,
  compact = false,
}: {
  pathway: PlannerPathway;
  policyDate?: string;
  lang: PlannerLang;
  compact?: boolean;
}) {
  if (!hasMissingPolicyEvidence(pathway)) return null;
  const isKo = lang === 'ko';
  const evidenceCodes = new Set((pathway.policyEvidence ?? []).map((item) => item.visaCode.toUpperCase()));
  const missingCodes = extractVisaCodes(pathway).filter((code) => !evidenceCodes.has(code));

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4" aria-label={isKo ? '정책 근거 검토 안내' : 'Policy evidence review'}>
      <div className="flex gap-3">
        <DatabaseZap className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-amber-950">{isKo ? '사용자가 아닌, 잡차자가 보완해야 할 정책 데이터가 있습니다' : 'JobChaja policy data—not your profile—needs review'}</h3>
          <p className="mt-1 text-xs leading-5 text-amber-900">
            {isKo
              ? `${missingCodes.length ? `${missingCodes.join(', ')} 단계에 ` : ''}공식 출처·시행일·검토 승인이 모두 연결된 정책 기록을 확인하지 못했습니다. 사용자 조건 미달을 뜻하지 않으며, 이 상태에서는 세부요건을 확정해 표시할 수 없습니다.`
              : `${missingCodes.length ? `${missingCodes.join(', ')} ` : ''}does not have a fully linked policy record with an official source, effective date, and review approval. This is not a failed user condition, and detailed requirements cannot be treated as confirmed.`}
          </p>
          {!compact ? (
            <div className="mt-3 grid gap-2 text-xs leading-5 text-amber-950 sm:grid-cols-2">
              <p><strong>{isKo ? '왜 표시되나요?' : 'Why is this shown?'}</strong><br />{isKo ? '비자코드별 승인된 정책 근거가 없거나, 기준일에 유효한 근거 조회가 실패하면 안전을 위해 표시합니다.' : 'It is shown when approved evidence is absent for a visa code or valid evidence could not be retrieved for the review date.'}</p>
              <p><strong>{isKo ? '어떻게 처리하나요?' : 'What happens next?'}</strong><br />{isKo ? '잡차자는 공식 출처·시행일·검토자를 정책 원장에 연결해야 합니다. 이용자는 그전까지 공식기관 또는 자격 있는 전문가에게 최신 기준을 확인해야 합니다.' : 'JobChaja must link the official source, effective date, and reviewer. Until then, confirm current rules with the authority or a qualified professional.'}</p>
            </div>
          ) : null}
          <p className="mt-2 text-[11px] text-amber-800">{isKo ? `정책 기준일: ${localizeDate(policyDate, lang)} · 시스템 참조코드: POLICY_EVIDENCE_MISSING` : `Policy as of: ${localizeDate(policyDate, lang)} · Reference code: POLICY_EVIDENCE_MISSING`}</p>
        </div>
      </div>
    </section>
  );
}

export function PreparationGuidanceList({
  codes,
  lang,
}: {
  codes: string[];
  lang: PlannerLang;
}) {
  if (!codes.length) {
    return <p className="text-sm leading-6 text-[#6B7684]">{requirementFieldCopy[lang].fallback}</p>;
  }
  return (
    <ul className="space-y-3">
      {codes.map((code) => {
        const item = getSignalGuidance(code, lang);
        return (
          <li key={code} className="rounded-xl border border-[#E5E8EB] bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-[#191F28]">{item.title}</p>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${item.owner === 'user' ? 'bg-blue-50 text-blue-700' : item.owner === 'platform' ? 'bg-amber-50 text-amber-800' : 'bg-violet-50 text-violet-700'}`}>
                {lang === 'ko' ? (item.owner === 'user' ? '내가 준비' : item.owner === 'platform' ? '잡차자 보완' : '개별 확인') : (item.owner === 'user' ? 'Your action' : item.owner === 'platform' ? 'JobChaja action' : 'Case review')}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#6B7684]"><strong className="text-[#4E5968]">{lang === 'ko' ? '왜 필요한가요? ' : 'Why? '}</strong>{item.reason}</p>
            <p className="mt-2 text-xs leading-5 text-[#333D4B]"><strong>{lang === 'ko' ? '다음 행동: ' : 'Next action: '}</strong>{item.action}</p>
          </li>
        );
      })}
    </ul>
  );
}

function RequirementStatus({
  pathway,
  hasEvidence,
  lang,
}: {
  pathway: PlannerPathway;
  hasEvidence: boolean;
  lang: PlannerLang;
}) {
  const isKo = lang === 'ko';
  const assessments = pathway.requirementAssessments ?? [];
  if (!hasEvidence) {
    return <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">{isKo ? '미확정 · 정책 근거 확인 필요' : 'Unconfirmed · policy evidence needed'}</span>;
  }
  if (assessments.some((item) => item.status === 'unmet')) {
    return <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">{isKo ? '보완항목 있음 · 개별심사 필요' : 'Preparation gaps · individual review'}</span>;
  }
  if (assessments.some((item) => item.status === 'unknown')) {
    return <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">{isKo ? '확인 필요 항목 있음 · 개별심사 필요' : 'Confirmation needed · individual review'}</span>;
  }
  if (assessments.some((item) => item.status === 'minimum_met')) {
    return <span className="rounded-md border border-sky-200 bg-sky-50 text-sky-800 px-2 py-1 text-xs font-bold">{isKo ? '최소선 확인 · 최종 확인 필요' : 'Minimum confirmed · final check needed'}</span>;
  }
  if (!assessments.length && pathway.gaps.length) {
    return <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">{isKo ? '보완항목 있음 · 개별심사 필요' : 'Preparation gaps · individual review'}</span>;
  }
  return <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">{isKo ? '세부 기준 데이터 확인 필요' : 'Detailed requirement data needs confirmation'}</span>;
}

export function PathwayStageCard({
  milestone,
  pathway,
  index,
  lang,
}: {
  milestone: PlannerMilestone;
  pathway: PlannerPathway;
  index: number;
  lang: PlannerLang;
}) {
  const isKo = lang === 'ko';
  const evidence = policyEvidenceForVisa(pathway, milestone.visaStatus);
  const hasEvidence = evidence.length > 0;
  const name = isKo ? milestone.nameKo : milestone.nameEn;
  const stageAssessments = (pathway.requirementAssessments ?? []).filter((item) => {
    const stage = item.stage.toUpperCase();
    const visa = milestone.visaStatus.toUpperCase();
    return stage === visa || stage.startsWith(visa) || visa.startsWith(stage) || item.stage === String(milestone.order);
  });

  return (
    <li className="relative pb-7 last:pb-0">
      <span className="absolute -left-[37px] grid h-6 w-6 place-items-center rounded-lg bg-[#0066FF] text-xs font-bold text-white">{index + 1}</span>
      <article className="overflow-hidden rounded-xl border border-[#E5E8EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="border-b border-[#F2F4F6] p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-[#191F28]">{name}</h3>
            <span className="rounded-md bg-[#191F28] px-2 py-1 text-xs font-bold text-white">{milestone.visaStatus}</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B7684]"><Clock3 className="h-3.5 w-3.5" />{isKo ? `진단 시점부터 약 ${milestone.monthFromStart}개월` : `About ${milestone.monthFromStart} months from diagnosis`}</span>
          </div>
          <div className="mt-3"><RequirementStatus pathway={pathway} hasEvidence={hasEvidence} lang={lang} /></div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <section>
            <h4 className="text-xs font-bold text-[#333D4B]">{isKo ? '이 단계의 필요조건' : 'Requirements for this stage'}</h4>
            <p className="mt-2 text-sm leading-6 text-[#6B7684]">{milestone.requirements}</p>
            <p className="mt-2 text-xs leading-5 text-amber-800">{isKo ? '현재 정책 데이터가 개별 필요조건 목록과 판정식을 모두 제공하지 않아 “충족”으로 확정 표시하지 않습니다.' : 'The current policy data does not provide a complete requirement list and decision rule, so this screen does not mark the stage as “satisfied.”'}</p>
          </section>
          <section>
            <h4 className="text-xs font-bold text-[#333D4B]">{isKo ? '현재 확인된 보완항목' : 'Currently identified preparation items'}</h4>
            <div className="mt-2">{stageAssessments.length ? <RequirementAssessmentList assessments={stageAssessments} lang={lang} /> : <PreparationGuidanceList codes={pathway.gaps} lang={lang} />}</div>
          </section>
        </div>

        <div className="border-t border-[#F2F4F6] bg-[#F9FAFB] p-5">
          <h4 className="flex items-center gap-2 text-xs font-bold text-[#333D4B]"><Info className="h-3.5 w-3.5 text-[#0066FF]" />{isKo ? '연결된 정책 근거' : 'Linked policy evidence'}</h4>
          {evidence.length ? (
            <ul className="mt-2 space-y-2">
              {evidence.map((item) => (
                <li key={`${item.ruleId}-${item.version}`} className="text-xs leading-5 text-[#6B7684]">
                  <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#0066FF] hover:underline">{item.sourceSite}<ExternalLink className="h-3 w-3" /></a>
                  <span> · {isKo ? '시행일' : 'effective'} {item.effectiveDate ? localizeDate(item.effectiveDate, lang) : (isKo ? '미등록' : 'not registered')} · {isKo ? '검토일' : 'reviewed'} {localizeDate(item.reviewedAt, lang)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs leading-5 text-amber-800">{isKo ? `${milestone.visaStatus} 단계에 승인된 정책 근거가 연결되지 않았습니다. 잡차자 정책 검토가 끝날 때까지 확정 요건으로 사용하지 마세요.` : `No approved policy evidence is linked to ${milestone.visaStatus}. Do not treat this as a confirmed requirement until policy review is complete.`}</p>
          )}
          <p className="mt-3 flex gap-2 text-xs font-semibold leading-5 text-[#4E5968]"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />{isKo ? '이 단계도 별도 심사되며 불허될 수 있습니다. 다음 단계의 승인도 보장하지 않습니다.' : 'This stage is separately reviewed and may be refused. It does not guarantee the next stage.'}</p>
        </div>
      </article>
    </li>
  );
}
