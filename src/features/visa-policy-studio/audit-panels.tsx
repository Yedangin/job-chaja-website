import { Activity, AlertCircle, Check, CheckCircle2, Clock3, ShieldAlert, ShieldCheck, UsersRound } from 'lucide-react';
import { formatDate, formatDateTime, parseStringArray } from './format';
import { EmptyState, Panel, SectionHeading, StatusPill } from './studio-ui';
import type { DecisionLog, PolicyStudioSnapshot, ReleaseGate } from './types';

export function DecisionLogs({ logs }: { logs: DecisionLog[] }) {
  return (
    <Panel>
      <SectionHeading title="최근 판정 로그" description="민감한 요청 원문은 표시하지 않고 결과·적용 규칙·판정 시점만 확인합니다." icon={Activity} />
      {logs.length === 0 ? <EmptyState icon={Activity} title="판정 로그가 없습니다" description="아직 기록된 판정이 없거나 감사 로그 API에서 데이터를 반환하지 않았습니다." /> : (
        <div className="divide-y divide-[#E5E8EB]">
          {logs.slice(0, 8).map((log) => {
            const eligible = parseStringArray(log.eligibleVisas);
            const blocked = parseStringArray(log.blockedVisas);
            const ruleIds = parseStringArray(log.appliedRuleIds);
            return (
              <div key={log.id} className="grid gap-3 px-4 py-4 sm:px-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-bold text-[#333D4B]">판정 #{log.id}</span>{log.outcome ? <StatusPill status={log.outcome}>{log.outcome}</StatusPill> : <StatusPill status="UNKNOWN">구형 결과</StatusPill>}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]"><span className="rounded bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">충족 후보 {eligible.length}</span><span className="rounded bg-red-50 px-2 py-1 font-semibold text-red-700">제외 {blocked.length}</span><span className="rounded bg-slate-100 px-2 py-1 font-semibold text-slate-600">적용 규칙 {ruleIds.length}</span></div>
                </div>
                <div className="text-left lg:text-right"><p className="text-xs font-semibold text-[#4E5968]">{formatDateTime(log.evaluatedAt)}</p><p className="mt-1 text-[10px] text-[#8B95A1]">{log.durationMs === null ? '처리시간 미기록' : `${log.durationMs}ms`} · Release {log.releaseVersion ?? '미기록'} · 기준일 {formatDate(log.policyAsOf)}</p></div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

export function AffectedJourneys({ snapshot }: { snapshot: PolicyStudioSnapshot }) {
  return (
    <Panel>
      <SectionHeading title="영향받는 진행 중 여정" description="정책 변경으로 결과·작업·서류·수속 단계가 달라지는 사용자를 재판정하고 통지합니다." icon={UsersRound} />
      {!snapshot.capabilities.affectedJourneys ? <EmptyState icon={UsersRound} title="영향도 계산 API 연결 대기" description="현재 사용자 수를 임의로 추정하지 않습니다. 정책 릴리스 간 비교와 여정 재판정 결과가 연결되면 실제 영향 건수만 표시합니다." /> : snapshot.affectedJourneys.length === 0 ? <EmptyState icon={Check} title="영향받는 여정이 없습니다" description="현재 비교 대상 릴리스에서 결과가 달라지는 진행 중 여정이 없습니다." /> : (
        <div className="divide-y divide-[#E5E8EB]">
          {snapshot.affectedJourneys.slice(0, 8).map((item) => (
            <div key={item.id} className="grid gap-2 px-4 py-4 sm:px-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><p className="text-sm font-bold text-[#333D4B]">{item.pathwayLabel}</p><p className="mt-1 text-xs leading-5 text-[#6B7684]">{item.reason}</p><p className="mt-1 text-[10px] text-[#8B95A1]">여정 {item.journeyId} · {formatDateTime(item.detectedAt)}</p></div>
              <div className="flex items-center gap-2 text-xs font-bold"><span className="rounded bg-slate-100 px-2 py-1 text-slate-600">{item.previousOutcome ?? '미기록'}</span><span className="text-[#B0B8C1]">→</span><span className="rounded bg-[#EAF2FF] px-2 py-1 text-[#0056D6]">{item.nextOutcome ?? '재검토'}</span></div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

export function ReleaseGates({ gates, connected }: { gates: ReleaseGate[]; connected: boolean }) {
  const activatable = connected ? gates.filter((gate) => gate.canActivate).length : 0;
  return (
    <Panel>
      <SectionHeading
        title="릴리스 게이트"
        description="출처·테스트·행정사 검토·영향 분석이 모두 통과해야 운영 배포를 허용합니다."
        icon={ShieldCheck}
        action={<StatusPill status={activatable > 0 ? 'PASS' : 'PENDING'}>활성화 가능 {activatable}건</StatusPill>}
      />
      {!connected ? (
        <div className="p-4 sm:p-5"><div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><div><p className="text-sm font-bold text-amber-900">검증 결과를 확인할 수 없어 배포가 잠겼습니다</p><p className="mt-1 text-xs leading-5 text-amber-800">릴리스 게이트 API가 출처 무결성, 충돌 검사, 회귀 테스트, 행정사 승인, 영향 분석 결과를 반환할 때까지 배포할 수 없습니다.</p></div></div></div>
      ) : gates.length === 0 ? <EmptyState icon={ShieldCheck} title="등록된 릴리스 게이트가 없습니다" description="빈 게이트 목록은 배포 가능 상태로 취급하지 않습니다." /> : (
        <div className="divide-y divide-[#E5E8EB]">
          {gates.map((gate) => (
            <div key={gate.id} className="flex items-start gap-3 px-4 py-4 sm:px-5">
              {gate.status === 'PASS' ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : gate.status === 'FAIL' ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /> : <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />}
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-[#333D4B]">{gate.label}</p>{gate.blocking && <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-700">차단 조건</span>}</div><p className="mt-1 text-xs leading-5 text-[#6B7684]">{gate.description}</p></div>
              <StatusPill status={gate.status}>{gate.status}</StatusPill>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
