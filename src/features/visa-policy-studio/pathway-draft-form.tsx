'use client';

import { AlertCircle, CheckCircle2, Loader2, Route, Save } from 'lucide-react';
import { useState } from 'react';
import { createPolicyPathway, updatePolicyPathway } from './command-api';
import { Panel, SectionHeading } from './studio-ui';
import type { PolicyPathway, ReleaseGate } from './types';
import type { VisaSourceCitationInput } from './command-types';

const inputClass = 'mt-1 h-10 w-full rounded-lg border border-[#D1D6DB] bg-white px-3 text-sm outline-none focus:border-[#0066FF]';
const stageFields = [
  ['eligibility', '1. 판정 조건', 'eligibilityRequirements'],
  ['remediation', '2. 조건충족 방법', 'remediationOptions'],
  ['evidence', '3. 증빙·서류', 'evidenceRequirements'],
  ['procedure', '4. 셀프 수속', 'procedureSteps'],
  ['escalation', '5. 전문가 전환', 'escalationRules'],
] as const;

const emptyTitles = { eligibility: '', remediation: '', evidence: '', procedure: '', escalation: '' };

export function PathwayDraftForm({
  gates,
  pathways,
  onCompleted,
}: {
  gates: ReleaseGate[];
  pathways: PolicyPathway[];
  onCompleted: () => void;
}) {
  const draftReleases = gates.filter((gate) => gate.releaseStatus === 'DRAFT');
  const editablePathways = pathways.filter((pathway) => !pathway.isLegacyRuleGroup && pathway.status === 'DRAFT');
  const [releaseId, setReleaseId] = useState('');
  const [editId, setEditId] = useState('');
  const [currentVisaCode, setCurrentVisaCode] = useState('');
  const [targetVisaCode, setTargetVisaCode] = useState('');
  const [name, setName] = useState('');
  const [titles, setTitles] = useState(emptyTitles);
  const [citation, setCitation] = useState<VisaSourceCitationInput>({ title: '', url: '', clause: '', effectiveFrom: '' });
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const chooseExisting = (id: string) => {
    setEditId(id);
    const pathway = editablePathways.find((item) => item.id === id);
    if (!pathway) return;
    setCurrentVisaCode(pathway.currentVisa ?? '');
    setTargetVisaCode(pathway.targetVisa);
    setName(pathway.name);
    const definition = pathway.definition;
    setTitles({
      eligibility: definition?.eligibilityRequirements?.[0]?.title ?? '',
      remediation: definition?.remediationOptions?.[0]?.title ?? '',
      evidence: definition?.evidenceRequirements?.[0]?.title ?? '',
      procedure: definition?.procedureSteps?.[0]?.title ?? '',
      escalation: definition?.escalationRules?.[0]?.title ?? '',
    });
    const source = definition?.eligibilityRequirements?.[0]?.sourceCitation;
    if (source) setCitation(source);
  };

  const submit = async () => {
    const selectedRelease = releaseId || draftReleases[0]?.id;
    if (!editId && !selectedRelease) { setMessage({ kind: 'error', text: '경로를 담을 DRAFT 릴리스를 먼저 선택해 주세요.' }); return; }
    if (reason.trim().length < 3) { setMessage({ kind: 'error', text: '변경 사유를 3자 이상 입력해 주세요.' }); return; }
    setPending(true); setMessage(null);
    const item = (code: string, title: string, order: number) => ({ code, title, sourceCitation: citation, sortOrder: order });
    const existing = editablePathways.find((pathway) => pathway.id === editId)?.definition;
    const preserveAfterFirst = <T,>(items: T[] | undefined, first: T) => [first, ...(items?.slice(1) ?? [])];
    const input = {
      currentVisaCode: currentVisaCode.trim() || undefined,
      targetVisaCode: targetVisaCode.trim().toUpperCase(),
      name: name.trim(), locale: 'ko', reason,
      definition: {
        eligibilityRequirements: preserveAfterFirst(existing?.eligibilityRequirements, item('ELIGIBILITY-1', titles.eligibility, 0)),
        remediationOptions: preserveAfterFirst(existing?.remediationOptions, item('REMEDIATION-1', titles.remediation, 0)),
        evidenceRequirements: preserveAfterFirst(existing?.evidenceRequirements, item('EVIDENCE-1', titles.evidence, 0)),
        procedureSteps: preserveAfterFirst(existing?.procedureSteps, item('PROCEDURE-1', titles.procedure, 0)),
        escalationRules: preserveAfterFirst(existing?.escalationRules, item('ESCALATION-1', titles.escalation, 0)),
      },
    };
    try {
      if (editId) await updatePolicyPathway(editId, input); else await createPolicyPathway(selectedRelease!, input);
      setMessage({ kind: 'success', text: editId ? '5단계 경로 초안을 수정했습니다.' : '5단계 경로 초안을 생성했습니다.' });
      onCompleted();
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : '경로를 저장하지 못했습니다.' });
    } finally { setPending(false); }
  };

  return (
    <Panel>
      <SectionHeading title="5단계 경로 초안 편집" description="조건·개선·증빙·수속·전문가 전환을 같은 출처와 릴리스 안에서 생성합니다." icon={Route} />
      <div className="space-y-4 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs font-bold text-[#4E5968]">편집할 기존 DRAFT 경로<select value={editId} onChange={(event) => chooseExisting(event.target.value)} className={inputClass}><option value="">새 경로 생성</option>{editablePathways.map((pathway) => <option key={pathway.id} value={pathway.id}>{pathway.name}</option>)}</select></label>
          <label className="text-xs font-bold text-[#4E5968]">대상 DRAFT 릴리스<select disabled={Boolean(editId)} value={releaseId || draftReleases[0]?.id || ''} onChange={(event) => setReleaseId(event.target.value)} className={inputClass}><option value="">선택</option>{draftReleases.map((gate) => <option key={gate.id} value={gate.id}>{gate.label}</option>)}</select></label>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-xs font-bold text-[#4E5968]">현재 비자<input value={currentVisaCode} onChange={(event) => setCurrentVisaCode(event.target.value.toUpperCase())} placeholder="선택 · 예: D-10" className={inputClass} /></label>
          <label className="text-xs font-bold text-[#4E5968]">목표 비자<input required value={targetVisaCode} onChange={(event) => setTargetVisaCode(event.target.value.toUpperCase())} placeholder="예: E-7-1" className={inputClass} /></label>
          <label className="text-xs font-bold text-[#4E5968]">경로명<input required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} /></label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {stageFields.map(([field, label]) => <label key={field} className="text-xs font-bold text-[#4E5968]">{label}<textarea required rows={3} value={titles[field]} onChange={(event) => setTitles((current) => ({ ...current, [field]: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#D1D6DB] p-3 text-sm outline-none focus:border-[#0066FF]" /></label>)}
        </div>
        <fieldset className="rounded-xl border border-[#E5E8EB] p-4"><legend className="px-1 text-xs font-black text-[#333D4B]">공식 출처</legend><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><label className="text-xs font-bold text-[#4E5968]">문서명<input required value={citation.title} onChange={(event) => setCitation((current) => ({ ...current, title: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-[#4E5968]">HTTPS URL<input required type="url" value={citation.url} onChange={(event) => setCitation((current) => ({ ...current, url: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-[#4E5968]">근거 조항<input required value={citation.clause} onChange={(event) => setCitation((current) => ({ ...current, clause: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-[#4E5968]">시행일<input required type="date" value={citation.effectiveFrom} onChange={(event) => setCitation((current) => ({ ...current, effectiveFrom: event.target.value }))} className={inputClass} /></label></div></fieldset>
        <label className="block text-xs font-bold text-[#4E5968]">변경 사유<textarea required minLength={3} rows={3} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 w-full rounded-lg border border-[#D1D6DB] p-3 text-sm" /></label>
        <div className="flex flex-wrap items-center gap-3"><button type="button" onClick={() => void submit()} disabled={pending || !targetVisaCode || !name || Object.values(titles).some((value) => !value.trim()) || !citation.title || !citation.url || !citation.clause || !citation.effectiveFrom || reason.trim().length < 3} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-bold text-white disabled:opacity-40">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{editId ? '경로 수정' : '경로 생성'}</button>{message && <p className={`flex items-center gap-2 text-xs ${message.kind === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>{message.kind === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{message.text}</p>}</div>
      </div>
    </Panel>
  );
}
