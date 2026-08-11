import { AlertCircle, CheckCircle2, LockKeyhole, ShieldAlert } from 'lucide-react';
import { formatDate } from './format';
import { StatusPill } from './studio-ui';
import type { PolicyPathway } from './types';

export function ExpertHandoffEditor({ pathway }: { pathway: PolicyPathway }) {
  const gate = pathway.expertAssignmentGate;
  const checks = [
    { label: '행정사 자격', value: gate?.administrativeAgentCredential ?? 'UNKNOWN' },
    { label: '사무소 신고 확인', value: gate?.officeFiling ?? 'UNKNOWN' },
    { label: '출입국민원 대행등록', value: gate?.immigrationAgencyRegistration ?? 'UNKNOWN' },
  ];
  const assignmentAllowed = gate?.assignmentAllowed === true;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#E5E8EB] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-sm font-black text-[#333D4B]">행정사 배정 자격 게이트</p><p className="mt-1 text-xs leading-5 text-[#6B7684]">상담과 신청 대행의 범위를 분리하고, 대행 사건은 필수 자격이 모두 유효한 전문가에게만 배정합니다.</p></div>
          <StatusPill status={assignmentAllowed ? 'PASS' : 'FAIL'}>{assignmentAllowed ? '배정 가능' : '배정 차단'}</StatusPill>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {checks.map((check) => (
            <div key={check.label} className="rounded-xl bg-[#F9FAFB] p-3">
              <p className="text-[10px] font-bold text-[#8B95A1]">{check.label}</p>
              <div className="mt-2 flex items-center gap-2">
                {check.value === 'VERIFIED' || check.value === 'NOT_REQUIRED' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-amber-600" />}
                <span className="text-xs font-black text-[#333D4B]">{check.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#E5E8EB] pt-4 text-xs text-[#6B7684]">
          <span>최근 확인일 <strong className="text-[#333D4B]">{formatDate(gate?.verifiedAt)}</strong></span>
          <span>유효기한 <strong className="text-[#333D4B]">{formatDate(gate?.validUntil)}</strong></span>
        </div>
      </div>

      {!gate && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div><p className="text-sm font-bold text-amber-900">전문가 자격 확인 API가 연결되지 않았습니다</p><p className="mt-1 text-xs leading-5 text-amber-800">미확인 상태에서는 상담·서류 검토·신청 대행 사건을 자동 배정할 수 없습니다.</p></div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['질문 상담', '개별 조건 해석과 경로 검토'],
          ['서류 검토', '증빙 누락과 법률 서면 확인'],
          ['신청 대행', '대행기관 등록까지 확인 후 배정'],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-[#E5E8EB] p-4">
            <p className="text-sm font-bold text-[#333D4B]">{title}</p><p className="mt-1 text-xs leading-5 text-[#8B95A1]">{description}</p>
            <button type="button" disabled={!assignmentAllowed} className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#D1D6DB] text-xs font-bold text-[#6B7684] disabled:cursor-not-allowed disabled:opacity-40"><LockKeyhole className="h-3.5 w-3.5" /> 배정 규칙 편집</button>
          </div>
        ))}
      </div>
    </div>
  );
}

