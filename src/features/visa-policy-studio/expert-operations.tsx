'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck, UserRoundCheck } from 'lucide-react';
import {
  assignExpertCase,
  ExpertCaseRow,
  ExpertCredentialRow,
  loadExpertOperations,
  verifyExpertCredential,
} from './expert-api';
import { formatDate } from './format';
import { Panel, SectionHeading, StatusPill } from './studio-ui';

const inputClass = 'mt-1 h-10 w-full rounded-lg border border-[#D1D6DB] bg-white px-3 text-sm outline-none focus:border-[#0066FF]';
const serviceLabel = {
  CONSULTATION: '질문 상담',
  DOCUMENT_REVIEW: '서류 검토',
  APPLICATION_AGENCY: '신청 대행',
};

function credentialCanReceive(
  credential: ExpertCredentialRow | undefined,
  expertCase: ExpertCaseRow | undefined,
) {
  if (!credential || !expertCase || credential.status !== 'VERIFIED') return false;
  if (!credential.businessFilingVerifiedAt) return false;
  if (
    credential.validUntil &&
    new Date(`${credential.validUntil.slice(0, 10)}T23:59:59`).getTime() < Date.now()
  ) return false;
  return expertCase.serviceType !== 'APPLICATION_AGENCY' || Boolean(credential.immigrationAgencyRegistrationVerifiedAt);
}

export function ExpertOperations() {
  const [cases, setCases] = useState<ExpertCaseRow[]>([]);
  const [credentials, setCredentials] = useState<ExpertCredentialRow[]>([]);
  const [caseId, setCaseId] = useState('');
  const [expertId, setExpertId] = useState('');
  const [assignmentReason, setAssignmentReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState('');
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [credentialForm, setCredentialForm] = useState({
    expertId: '', qualificationType: 'ADMINISTRATIVE_AGENT',
    qualificationNumberMasked: '', businessFilingVerifiedAt: '',
    immigrationAgencyRegistrationVerifiedAt: '', validUntil: '', reason: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await loadExpertOperations();
      setCases(result.cases);
      setCredentials(result.credentials);
      setCaseId((current) => current || result.cases.find((item) => item.status === 'REQUESTED')?.id || '');
      setExpertId((current) => current || result.credentials[0]?.expertId || '');
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : '행정사 운영 현황을 불러오지 못했습니다.' });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    loadExpertOperations()
      .then((result) => {
        if (!active) return;
        setCases(result.cases);
        setCredentials(result.credentials);
        setCaseId(result.cases.find((item) => item.status === 'REQUESTED')?.id || '');
        setExpertId(result.credentials[0]?.expertId || '');
      })
      .catch((error: unknown) => {
        if (active) setMessage({ kind: 'error', text: error instanceof Error ? error.message : '행정사 운영 현황을 불러오지 못했습니다.' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const selectedCase = useMemo(() => cases.find((item) => item.id === caseId), [caseId, cases]);
  const selectedCredential = useMemo(() => credentials.find((item) => item.expertId === expertId), [credentials, expertId]);
  const canAssign = credentialCanReceive(selectedCredential, selectedCase) && assignmentReason.trim().length >= 3;

  const submitCredential = async (event: FormEvent) => {
    event.preventDefault(); setPending('credential'); setMessage(null);
    try {
      await verifyExpertCredential({
        ...credentialForm,
        immigrationAgencyRegistrationVerifiedAt: credentialForm.immigrationAgencyRegistrationVerifiedAt || undefined,
        validUntil: credentialForm.validUntil || undefined,
      });
      setMessage({ kind: 'success', text: '행정사 자격 확인 기록을 저장했습니다.' });
      await load();
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : '자격 확인 기록을 저장하지 못했습니다.' });
    } finally { setPending(''); }
  };

  const assign = async () => {
    if (!selectedCase || !canAssign) return;
    setPending('assign'); setMessage(null);
    try {
      await assignExpertCase(selectedCase.id, expertId, assignmentReason);
      setMessage({ kind: 'success', text: '검증된 행정사를 사건에 배정했습니다.' });
      setAssignmentReason('');
      await load();
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : '행정사를 배정하지 못했습니다.' });
    } finally { setPending(''); }
  };

  return (
    <Panel>
      <SectionHeading title="행정사 연결 운영" description="상담·서류검토·신청대행 요청과 자격 유효성을 함께 확인하고 사건을 배정합니다." icon={UserRoundCheck} />
      {loading ? <div className="flex items-center gap-2 p-5 text-sm text-[#6B7684]"><Loader2 className="h-4 w-4 animate-spin" /> 현황을 불러오는 중입니다.</div> : (
        <div className="grid lg:grid-cols-2">
          <div className="space-y-4 border-b border-[#E5E8EB] p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <div><h3 className="text-sm font-black text-[#333D4B]">요청 큐와 배정</h3><p className="mt-1 text-xs text-[#8B95A1]">미확인 자격에는 배정 버튼이 열리지 않으며 서버와 DB에서도 다시 차단합니다.</p></div>
            {cases.length === 0 ? <p className="rounded-xl bg-[#F9FAFB] p-4 text-xs text-[#8B95A1]">접수된 행정사 연결 요청이 없습니다.</p> : <>
              <label className="block text-xs font-bold text-[#4E5968]">요청 선택<select value={caseId} onChange={(event) => setCaseId(event.target.value)} className={inputClass}>{cases.map((item) => <option key={item.id} value={item.id}>{serviceLabel[item.serviceType]} · {item.journey.currentVisaCode || '신규'} → {item.journey.targetVisaCode} · {item.status}</option>)}</select></label>
              {selectedCase && <div className="rounded-xl border border-[#E5E8EB] p-3 text-xs leading-5 text-[#6B7684]"><div className="flex items-center justify-between gap-2"><strong className="text-[#333D4B]">{serviceLabel[selectedCase.serviceType]}</strong><StatusPill status={selectedCase.status}>{selectedCase.status}</StatusPill></div><p className="mt-2">{selectedCase.question || '별도 질문 없음'}</p><p className="mt-2 text-[11px] text-[#8B95A1]">접수 {formatDate(selectedCase.createdAt)} · 동의 완료 자료만 공유</p></div>}
              <label className="block text-xs font-bold text-[#4E5968]">행정사 선택<select value={expertId} onChange={(event) => setExpertId(event.target.value)} className={inputClass}><option value="">선택</option>{credentials.map((item) => <option key={item.id} value={item.expertId}>{item.expertId} · {item.status} · {item.qualificationNumberMasked}</option>)}</select></label>
              {selectedCredential && <CredentialFacts credential={selectedCredential} />}
              <label className="block text-xs font-bold text-[#4E5968]">배정 사유<textarea rows={3} minLength={3} value={assignmentReason} onChange={(event) => setAssignmentReason(event.target.value)} className="mt-1 w-full rounded-lg border border-[#D1D6DB] p-3 text-sm" /></label>
              <button type="button" disabled={!canAssign || pending !== '' || selectedCase?.status !== 'REQUESTED'} onClick={() => void assign()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-bold text-white disabled:opacity-40">{pending === 'assign' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} 검증 후 배정</button>
            </>}
          </div>
          <form onSubmit={submitCredential} className="space-y-4 p-4 sm:p-5">
            <div><h3 className="text-sm font-black text-[#333D4B]">행정사 자격 확인</h3><p className="mt-1 text-xs text-[#8B95A1]">원번호 대신 마스킹된 번호와 확인 시점만 운영 원장에 저장합니다.</p></div>
            <div className="grid gap-3 sm:grid-cols-2"><Field label="행정사 ID" value={credentialForm.expertId} onChange={(value) => setCredentialForm((form) => ({ ...form, expertId: value }))} /><Field label="자격 유형" value={credentialForm.qualificationType} onChange={(value) => setCredentialForm((form) => ({ ...form, qualificationType: value }))} /></div>
            <Field label="마스킹 자격번호" value={credentialForm.qualificationNumberMasked} placeholder="예: 12-****-89" onChange={(value) => setCredentialForm((form) => ({ ...form, qualificationNumberMasked: value }))} />
            <div className="grid gap-3 sm:grid-cols-3"><DateField label="업무신고 확인일" value={credentialForm.businessFilingVerifiedAt} onChange={(value) => setCredentialForm((form) => ({ ...form, businessFilingVerifiedAt: value }))} /><DateField label="출입국대행 등록 확인일" value={credentialForm.immigrationAgencyRegistrationVerifiedAt} optional onChange={(value) => setCredentialForm((form) => ({ ...form, immigrationAgencyRegistrationVerifiedAt: value }))} /><DateField label="유효기한" value={credentialForm.validUntil} optional onChange={(value) => setCredentialForm((form) => ({ ...form, validUntil: value }))} /></div>
            <label className="block text-xs font-bold text-[#4E5968]">확인 사유<textarea required minLength={3} rows={3} value={credentialForm.reason} onChange={(event) => setCredentialForm((form) => ({ ...form, reason: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#D1D6DB] p-3 text-sm" /></label>
            <button disabled={pending !== '' || !credentialForm.expertId || !credentialForm.qualificationNumberMasked.includes('*') || !credentialForm.businessFilingVerifiedAt || credentialForm.reason.trim().length < 3} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#0066FF] px-4 text-sm font-bold text-[#0066FF] disabled:opacity-40">{pending === 'credential' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} 자격 확인 저장</button>
          </form>
        </div>
      )}
      {message && <p className={`mx-4 mb-4 flex items-center gap-2 rounded-lg p-3 text-xs sm:mx-5 ${message.kind === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}><AlertCircle className="h-4 w-4" />{message.text}</p>}
    </Panel>
  );
}

function CredentialFacts({ credential }: { credential: ExpertCredentialRow }) {
  return <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F9FAFB] p-3 text-[11px] text-[#6B7684]"><span>자격 <strong>{credential.status}</strong></span><span>업무신고 <strong>{formatDate(credential.businessFilingVerifiedAt)}</strong></span><span>출입국대행 <strong>{formatDate(credential.immigrationAgencyRegistrationVerifiedAt)}</strong></span><span>유효기한 <strong>{formatDate(credential.validUntil)}</strong></span></div>;
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-bold text-[#4E5968]">{label}<input required value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={inputClass} /></label>;
}

function DateField({ label, value, optional, onChange }: { label: string; value: string; optional?: boolean; onChange: (value: string) => void }) {
  return <label className="block text-xs font-bold text-[#4E5968]">{label}<input required={!optional} type="date" value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} /></label>;
}
