import { Info, Layers3, ShieldCheck, type LucideIcon } from 'lucide-react';
import { STAGES } from './config';
import { displayCount, formatDate } from './format';
import { Panel, SectionHeading, StatusPill } from './studio-ui';
import type { PolicyStudioSnapshot, StageCoverage } from './types';

export function QueueCard({
  label,
  value,
  detail,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number | null;
  detail: string;
  tone: 'blue' | 'amber' | 'red' | 'slate';
  icon: LucideIcon;
}) {
  const toneClasses = {
    blue: 'bg-[#EAF2FF] text-[#0066FF]',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    slate: 'bg-slate-100 text-slate-600',
  }[tone];

  return (
    <div className="rounded-2xl border border-[#E5E8EB] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#6B7684]">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-[#191F28]">{displayCount(value)}</p>
        </div>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${toneClasses}`}><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-[#8B95A1]">{value === null ? '집계 API 연결 대기 · ' : ''}{detail}</p>
    </div>
  );
}

export function ReleaseSummary({ snapshot }: { snapshot: PolicyStudioSnapshot }) {
  const release = snapshot.overview.activeRelease;
  const summary = snapshot.summary;
  const details: Array<[string, string | null | undefined, boolean?]> = [
    ['판정 기준', release?.asOf],
    ['시행 시작', release?.effectiveFrom],
    ['전문가 검토', release?.reviewedAt],
    ['릴리스 해시', release?.hash ? `${release.hash.slice(0, 10)}…` : null, true],
  ];

  return (
    <Panel className="overflow-hidden">
      <div className="grid lg:grid-cols-[1.45fr_1fr]">
        <div className="bg-[#0F172A] p-5 text-white sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-200">운영 정책 릴리스</span>
            {release ? <StatusPill status={release.freshnessStatus}>{release.freshnessStatus}</StatusPill> : <StatusPill status="UNKNOWN">통합 원장 미연결</StatusPill>}
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{release?.version ? `Release ${release.version}` : '릴리스 버전 없음'}</h2>
            {release?.id && <span className="pb-1 text-xs text-slate-400">#{release.id}</span>}
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            {release
              ? '모든 판정·조건충족·서류·수속·행정사 전환 데이터는 이 불변 버전을 기준으로 추적합니다.'
              : '현재는 개별 활성 규칙만 존재합니다. 통합 릴리스가 연결되기 전에는 정책 전체가 같은 기준일과 검토 상태를 공유한다고 볼 수 없습니다.'}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {details.map(([label, value, raw]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] font-semibold text-slate-400">{label}</p>
                <p className="mt-1 truncate text-xs font-bold text-white">{raw ? (value ?? '미기록') : formatDate(value)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#0066FF]" /><h3 className="text-sm font-bold text-[#191F28]">현재 규칙 저장소</h3></div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
            {[
              ['활성 규칙', summary?.activeRules],
              ['규칙 초안', summary?.draftRules],
              ['비자 유형', summary?.totalVisaTypes],
              ['변경 감지', summary?.pendingChanges],
            ].map(([label, value]) => (
              <div key={String(label)}><dt className="text-xs text-[#8B95A1]">{label}</dt><dd className="mt-1 text-xl font-black text-[#191F28]">{displayCount(value as number | undefined)}</dd></div>
            ))}
          </dl>
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#F2F4F6] p-3 text-xs leading-5 text-[#4E5968]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0066FF]" />
            개별 규칙의 생성일은 행정사 검토일이 아닙니다. 검토 원장이 연결되기 전에는 사용자에게 전문가 승인으로 표시하면 안 됩니다.
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function CoverageBoard({ coverage }: { coverage: StageCoverage[] }) {
  const byStage = new Map(coverage.map((item) => [item.stage, item]));
  return (
    <Panel>
      <SectionHeading title="5단계 경로 커버리지" description="비자 경로별 판단부터 전문가 전환까지 관리 데이터가 빠짐없이 연결됐는지 확인합니다." icon={Layers3} />
      <div className="grid gap-0 md:grid-cols-5">
        {STAGES.map((stage, index) => {
          const item = byStage.get(stage.key);
          const configured = item?.configured ?? null;
          const total = item?.total ?? null;
          const rate = configured !== null && total ? Math.min(100, Math.round((configured / total) * 100)) : null;
          const Icon = stage.icon;
          return (
            <div key={stage.key} className={`relative p-4 sm:p-5 ${index < 4 ? 'border-b border-[#E5E8EB] md:border-b-0 md:border-r' : ''}`}>
              <div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#EAF2FF] text-[#0066FF]"><Icon className="h-4 w-4" /></span><span className="text-[10px] font-black text-[#B0B8C1]">0{stage.number}</span></div>
              <p className="mt-3 text-sm font-bold text-[#191F28]">{stage.label}</p>
              <p className="mt-1 text-xs text-[#8B95A1]">{configured === null || total === null ? '커버리지 미집계' : `${configured}/${total}개 경로`}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E5E8EB]" aria-hidden="true"><div className="h-full rounded-full bg-[#0066FF]" style={{ width: `${rate ?? 0}%` }} /></div>
              <p className="mt-2 text-[10px] text-[#8B95A1]">{rate === null ? '통합 경로 API 연결 대기' : `${rate}% 구성 · 검토 필요 ${displayCount(item?.reviewRequired)}`}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

