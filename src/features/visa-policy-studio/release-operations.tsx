'use client';

import { AlertCircle, CheckCircle2, Loader2, LockKeyhole, RotateCcw, Save, Send } from 'lucide-react';
import { createPolicyRelease, rollbackPolicyRelease, transitionPolicyRelease, updatePolicyRelease } from './command-api';
import { Panel, SectionHeading, StatusPill } from './studio-ui';
import { ShieldCheck } from 'lucide-react';
import type { ReleaseGate } from './types';
import { useState } from 'react';

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

const inputClass = 'mt-1 h-10 w-full rounded-lg border border-[#D1D6DB] bg-white px-3 text-sm outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10';

export function ReleaseOperations({ gates, onCompleted }: { gates: ReleaseGate[]; onCompleted: () => void }) {
  const [selectedId, setSelectedId] = useState('');
  const [createForm, setCreateForm] = useState({ name: '', version: '', contentHash: '', effectiveFrom: isoToday(), effectiveTo: '', reason: '' });
  const [updateForm, setUpdateForm] = useState({ name: '', contentHash: '', effectiveFrom: '', effectiveTo: '', reason: '' });
  const [actionReason, setActionReason] = useState('');
  const [pending, setPending] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const selected = gates.find((gate) => gate.id === selectedId) ?? gates[0];

  const run = async (key: string, command: () => Promise<unknown>, message: string) => {
    setPending(key); setError(''); setSuccess('');
    try { await command(); setSuccess(message); onCompleted(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : '요청을 처리하지 못했습니다.'); }
    finally { setPending(''); }
  };

  const transition = selected?.releaseStatus === 'DRAFT' ? 'submit-review'
    : selected?.releaseStatus === 'UNDER_REVIEW' ? 'expert-review'
      : selected?.releaseStatus === 'APPROVED' ? 'schedule'
        : selected?.releaseStatus === 'SCHEDULED' ? 'activate' : null;
  const transitionLabel = { 'submit-review': '행정사 검토 요청', 'expert-review': '행정사 승인', schedule: '배포 예약 승인', activate: '운영 활성화' }[transition ?? 'submit-review'];
  const reasonValid = actionReason.trim().length >= 3;
  const activationBlocked = transition === 'activate' && !selected?.canActivate;

  return (
    <Panel>
      <SectionHeading title="릴리스 작업" description="초안 생성·수정과 역할 분리된 검토·승인·배포·롤백을 수행합니다. 모든 명령은 변경 사유를 감사 로그에 남깁니다." icon={ShieldCheck} />
      <div className="grid lg:grid-cols-2">
        <form className="space-y-4 border-b border-[#E5E8EB] p-4 sm:p-5 lg:border-b-0 lg:border-r" onSubmit={(event) => {
          event.preventDefault();
          void run('create', () => createPolicyRelease({ ...createForm, effectiveTo: createForm.effectiveTo || undefined }), '릴리스 초안을 생성했습니다.');
        }}>
          <div><h3 className="text-sm font-black text-[#333D4B]">새 릴리스 초안</h3><p className="mt-1 text-xs text-[#8B95A1]">버전과 원문 스냅숏 해시는 생성 후 변경할 수 있는 범위를 제한합니다.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-bold text-[#4E5968]">이름<input required value={createForm.name} onChange={(event) => setCreateForm((form) => ({ ...form, name: event.target.value }))} className={inputClass} /></label>
            <label className="text-xs font-bold text-[#4E5968]">버전<input required value={createForm.version} onChange={(event) => setCreateForm((form) => ({ ...form, version: event.target.value }))} placeholder="예: 2026.08.1" className={inputClass} /></label>
          </div>
          <label className="block text-xs font-bold text-[#4E5968]">콘텐츠 해시<input required minLength={32} value={createForm.contentHash} onChange={(event) => setCreateForm((form) => ({ ...form, contentHash: event.target.value }))} placeholder="원문 묶음 SHA-256" className={inputClass} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-bold text-[#4E5968]">시행 시작<input required type="date" value={createForm.effectiveFrom} onChange={(event) => setCreateForm((form) => ({ ...form, effectiveFrom: event.target.value }))} className={inputClass} /></label>
            <label className="text-xs font-bold text-[#4E5968]">시행 종료<input type="date" value={createForm.effectiveTo} onChange={(event) => setCreateForm((form) => ({ ...form, effectiveTo: event.target.value }))} className={inputClass} /></label>
          </div>
          <label className="block text-xs font-bold text-[#4E5968]">변경 사유<textarea required minLength={3} rows={3} value={createForm.reason} onChange={(event) => setCreateForm((form) => ({ ...form, reason: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#D1D6DB] p-3 text-sm outline-none focus:border-[#0066FF]" /></label>
          <button disabled={pending !== ''} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-bold text-white disabled:opacity-40">{pending === 'create' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 초안 생성</button>
        </form>

        <div className="space-y-4 p-4 sm:p-5">
          <div><h3 className="text-sm font-black text-[#333D4B]">선택 릴리스 운영</h3><p className="mt-1 text-xs text-[#8B95A1]">현재 상태에서 허용되는 다음 명령만 실행합니다.</p></div>
          {gates.length === 0 ? <p className="rounded-xl bg-[#F9FAFB] p-4 text-xs text-[#8B95A1]">관리할 릴리스가 없습니다.</p> : <>
            <select value={selected?.id ?? ''} onChange={(event) => setSelectedId(event.target.value)} className={inputClass} aria-label="운영할 릴리스 선택">{gates.map((gate) => <option key={gate.id} value={gate.id}>{gate.label} · {gate.releaseStatus}</option>)}</select>
            <div className="flex flex-wrap items-center gap-2"><StatusPill status={selected.releaseStatus ?? 'UNKNOWN'}>{selected.releaseStatus}</StatusPill><span className="text-xs text-[#6B7684]">규칙·경로 게이트: {selected.description}</span></div>
            {selected.releaseStatus === 'DRAFT' && <div className="rounded-xl border border-[#E5E8EB] p-3">
              <p className="text-xs font-black text-[#333D4B]">초안 메타데이터 수정</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2"><input value={updateForm.name} onChange={(event) => setUpdateForm((form) => ({ ...form, name: event.target.value }))} placeholder="새 이름(선택)" className={inputClass} /><input value={updateForm.contentHash} onChange={(event) => setUpdateForm((form) => ({ ...form, contentHash: event.target.value }))} placeholder="새 해시(선택)" className={inputClass} /></div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2"><label className="text-[11px] font-bold text-[#6B7684]">새 시행일(선택)<input type="date" value={updateForm.effectiveFrom} onChange={(event) => setUpdateForm((form) => ({ ...form, effectiveFrom: event.target.value }))} className={inputClass} /></label><label className="text-[11px] font-bold text-[#6B7684]">새 종료일(선택)<input type="date" value={updateForm.effectiveTo} onChange={(event) => setUpdateForm((form) => ({ ...form, effectiveTo: event.target.value }))} className={inputClass} /></label></div>
              <textarea value={updateForm.reason} minLength={3} onChange={(event) => setUpdateForm((form) => ({ ...form, reason: event.target.value }))} placeholder="수정 사유(필수)" className="mt-3 w-full rounded-lg border border-[#D1D6DB] p-3 text-sm" />
              <button type="button" disabled={pending !== '' || updateForm.reason.trim().length < 3} onClick={() => void run('update', () => updatePolicyRelease(selected.id, { name: updateForm.name || undefined, contentHash: updateForm.contentHash || undefined, effectiveFrom: updateForm.effectiveFrom || undefined, effectiveTo: updateForm.effectiveTo || undefined, reason: updateForm.reason }), '릴리스 초안을 수정했습니다.')} className="mt-2 inline-flex h-9 items-center gap-2 rounded-lg border border-[#0066FF] px-3 text-xs font-bold text-[#0066FF] disabled:opacity-40"><Save className="h-3.5 w-3.5" /> 수정 저장</button>
            </div>}
            <label className="block text-xs font-bold text-[#4E5968]">작업 사유<textarea rows={3} value={actionReason} onChange={(event) => setActionReason(event.target.value)} placeholder="검토·승인·배포·롤백 사유(필수)" className="mt-1 w-full rounded-lg border border-[#D1D6DB] p-3 text-sm" /></label>
            <div className="flex flex-wrap gap-2">
              {transition && <button type="button" disabled={pending !== '' || !reasonValid || activationBlocked} onClick={() => void run(transition, () => transitionPolicyRelease(selected.id, transition, actionReason), `${transitionLabel} 처리를 완료했습니다.`)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-bold text-white disabled:opacity-40">{pending === transition ? <Loader2 className="h-4 w-4 animate-spin" /> : activationBlocked ? <LockKeyhole className="h-4 w-4" /> : <Send className="h-4 w-4" />}{transitionLabel}</button>}
              {selected.releaseStatus === 'SUPERSEDED' && <button type="button" disabled={pending !== '' || !reasonValid} onClick={() => void run('rollback', () => rollbackPolicyRelease(selected.id, actionReason), '이전 릴리스로 롤백했습니다.')} className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-300 px-4 text-sm font-bold text-red-700 disabled:opacity-40"><RotateCcw className="h-4 w-4" /> 롤백</button>}
            </div>
            {activationBlocked && <p className="flex items-start gap-2 text-xs text-red-700"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" />게이트 실패 상태에서는 활성화할 수 없습니다: {selected.description}</p>}
          </>}
          {error && <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
          {success && <p className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</p>}
        </div>
      </div>
    </Panel>
  );
}
