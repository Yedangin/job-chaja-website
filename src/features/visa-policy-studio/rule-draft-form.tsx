'use client';

import { AlertCircle, CheckCircle2, Code2, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { createReleaseRule } from './command-api';
import { Panel, SectionHeading } from './studio-ui';
import type { ReleaseGate } from './types';
import type { CreateReleaseRuleInput } from './command-types';

const fields = [
  'nationality', 'age', 'educationLevel', 'koreanLevel', 'workExperienceYears', 'currentVisaCode',
  'targetOccupationCode', 'ksicCode', 'companySizeType', 'employeeCountKorean', 'employeeCountForeign',
  'annualRevenue', 'jobType', 'offeredSalary', 'hasRecommendation', 'hasCriminalRecord', 'annualIncome',
  'incomeGniPercent', 'socialIntegrationLevel', 'isEthnicKorean', 'koreanAncestryCountry', 'volunteerHours',
  'hasKoreanChild', 'hasProperty', 'taxYearsInKorea', 'hasImmigrationViolation',
];
const numericFields = new Set(['age', 'workExperienceYears', 'employeeCountKorean', 'employeeCountForeign', 'annualRevenue', 'offeredSalary', 'annualIncome', 'incomeGniPercent', 'socialIntegrationLevel', 'volunteerHours', 'taxYearsInKorea']);
const booleanFields = new Set(['hasRecommendation', 'hasCriminalRecord', 'isEthnicKorean', 'hasKoreanChild', 'hasProperty', 'hasImmigrationViolation']);
const inputClass = 'mt-1 h-10 w-full rounded-lg border border-[#D1D6DB] bg-white px-3 text-sm outline-none focus:border-[#0066FF]';

function parseValue(field: string, op: string, value: string) {
  if (booleanFields.has(field)) return value === 'true';
  if (['in', 'notIn'].includes(op)) {
    const values = value.split(',').map((item) => item.trim()).filter(Boolean);
    return numericFields.has(field) ? values.map(Number) : values;
  }
  return numericFields.has(field) ? Number(value) : value;
}

export function RuleDraftForm({ gates, onCompleted }: { gates: ReleaseGate[]; onCompleted: () => void }) {
  const drafts = gates.filter((gate) => gate.releaseStatus === 'DRAFT');
  const [releaseId, setReleaseId] = useState('');
  const [form, setForm] = useState({
    visaTypeCode: '', ruleName: '', ruleDescription: '', priority: '100', ruleType: 'ELIGIBILITY',
    field: 'nationality', op: 'eq', value: '', actionType: 'ELIGIBLE', notes: '', documents: '', restrictions: '', reason: '',
  });
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    const targetRelease = releaseId || drafts[0]?.id;
    if (!targetRelease) { setMessage({ kind: 'error', text: '규칙을 담을 DRAFT 릴리스를 선택해 주세요.' }); return; }
    if (form.reason.trim().length < 3) { setMessage({ kind: 'error', text: '변경 사유를 3자 이상 입력해 주세요.' }); return; }
    const input: CreateReleaseRuleInput = {
      visaTypeCode: form.visaTypeCode.trim().toUpperCase(), ruleName: form.ruleName.trim(),
      ruleDescription: form.ruleDescription.trim() || undefined, priority: Number(form.priority),
      ruleType: form.ruleType as CreateReleaseRuleInput['ruleType'],
      conditions: { operator: 'AND', clauses: [{ field: form.field, op: form.op, value: parseValue(form.field, form.op, form.value) }] },
      actions: {
        type: form.actionType as CreateReleaseRuleInput['actions']['type'], notes: form.notes.trim() || undefined,
        documents: form.documents.split(',').map((item) => item.trim()).filter(Boolean),
        restrictions: form.restrictions.split(',').map((item) => item.trim()).filter(Boolean),
      },
      reason: form.reason,
    };
    setPending(true); setMessage(null);
    try { await createReleaseRule(targetRelease, input); setMessage({ kind: 'success', text: '릴리스 규칙 초안을 생성했습니다.' }); onCompleted(); }
    catch (error) { setMessage({ kind: 'error', text: error instanceof Error ? error.message : '규칙을 저장하지 못했습니다.' }); }
    finally { setPending(false); }
  };

  const allowedOps = booleanFields.has(form.field) ? ['eq', 'neq'] : numericFields.has(form.field) ? ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'notIn'] : ['eq', 'neq', 'in', 'notIn', 'contains'];
  return (
    <Panel>
      <SectionHeading title="판정 규칙 초안" description="허용된 필드·연산자·자료형만 조합해 DRAFT 릴리스에 규칙을 추가합니다." icon={Code2} />
      <div className="space-y-4 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs font-bold text-[#4E5968]">DRAFT 릴리스<select value={releaseId || drafts[0]?.id || ''} onChange={(event) => setReleaseId(event.target.value)} className={inputClass}><option value="">선택</option>{drafts.map((gate) => <option key={gate.id} value={gate.id}>{gate.label}</option>)}</select></label>
          <label className="text-xs font-bold text-[#4E5968]">비자 코드<input required value={form.visaTypeCode} onChange={(event) => set('visaTypeCode', event.target.value.toUpperCase())} placeholder="예: E-7-1" className={inputClass} /></label>
          <label className="text-xs font-bold text-[#4E5968]">규칙명<input required value={form.ruleName} onChange={(event) => set('ruleName', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-bold text-[#4E5968]">규칙 유형<select value={form.ruleType} onChange={(event) => set('ruleType', event.target.value)} className={inputClass}>{['ELIGIBILITY', 'RESTRICTION', 'DOCUMENT', 'QUOTA'].map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        <label className="block text-xs font-bold text-[#4E5968]">설명<input value={form.ruleDescription} onChange={(event) => set('ruleDescription', event.target.value)} className={inputClass} /></label>
        <fieldset className="rounded-xl border border-[#E5E8EB] p-4"><legend className="px-1 text-xs font-black text-[#333D4B]">조건 1개</legend><div className="grid gap-3 md:grid-cols-3"><label className="text-xs font-bold text-[#4E5968]">필드<select value={form.field} onChange={(event) => { set('field', event.target.value); set('op', 'eq'); set('value', ''); }} className={inputClass}>{fields.map((field) => <option key={field}>{field}</option>)}</select></label><label className="text-xs font-bold text-[#4E5968]">연산자<select value={form.op} onChange={(event) => set('op', event.target.value)} className={inputClass}>{allowedOps.map((op) => <option key={op}>{op}</option>)}</select></label><label className="text-xs font-bold text-[#4E5968]">기준값{booleanFields.has(form.field) ? <select value={form.value} onChange={(event) => set('value', event.target.value)} className={inputClass}><option value="">선택</option><option value="true">true</option><option value="false">false</option></select> : <input required value={form.value} onChange={(event) => set('value', event.target.value)} placeholder={['in', 'notIn'].includes(form.op) ? '쉼표로 구분' : ''} className={inputClass} />}</label></div></fieldset>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><label className="text-xs font-bold text-[#4E5968]">결과 유형<select value={form.actionType} onChange={(event) => set('actionType', event.target.value)} className={inputClass}>{['ELIGIBLE', 'BLOCKED', 'DOCUMENT', 'RESTRICTION'].map((value) => <option key={value}>{value}</option>)}</select></label><label className="text-xs font-bold text-[#4E5968]">필요서류<input value={form.documents} onChange={(event) => set('documents', event.target.value)} placeholder="쉼표로 구분" className={inputClass} /></label><label className="text-xs font-bold text-[#4E5968]">제한사항<input value={form.restrictions} onChange={(event) => set('restrictions', event.target.value)} placeholder="쉼표로 구분" className={inputClass} /></label><label className="text-xs font-bold text-[#4E5968]">우선순위<input type="number" min="0" value={form.priority} onChange={(event) => set('priority', event.target.value)} className={inputClass} /></label></div>
        <label className="block text-xs font-bold text-[#4E5968]">관리자 메모<input value={form.notes} onChange={(event) => set('notes', event.target.value)} className={inputClass} /></label>
        <label className="block text-xs font-bold text-[#4E5968]">변경 사유<textarea required minLength={3} rows={3} value={form.reason} onChange={(event) => set('reason', event.target.value)} className="mt-1 w-full rounded-lg border border-[#D1D6DB] p-3 text-sm" /></label>
        <div className="flex flex-wrap items-center gap-3"><button type="button" onClick={() => void submit()} disabled={pending || !form.visaTypeCode || !form.ruleName || !form.value || form.reason.trim().length < 3} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-bold text-white disabled:opacity-40">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}규칙 생성</button>{message && <p className={`flex items-center gap-2 text-xs ${message.kind === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>{message.kind === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{message.text}</p>}</div>
      </div>
    </Panel>
  );
}
