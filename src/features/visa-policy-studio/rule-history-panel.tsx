import { AlertCircle, ChevronRight, GitCompareArrows, History, Loader2 } from 'lucide-react';
import { REVIEW_LABELS } from './config';
import { formatDate, formatDateTime, prettyJson, reviewClass } from './format';
import { EmptyState, Panel, SectionHeading } from './studio-ui';
import type { RuleChangeAudit, RuleVersion, VisaRule } from './types';

export function RuleHistoryPanel({
  changes,
  selectedRuleId,
  onSelectRule,
  versions,
  details,
  loading,
  error,
}: {
  changes: RuleChangeAudit[];
  selectedRuleId: string;
  onSelectRule: (id: string) => void;
  versions: RuleVersion[];
  details: VisaRule[];
  loading: boolean;
  error: string;
}) {
  const current = details[0];
  const previous = details[1];
  const changesDetected = current
    ? [
        previous && previous.conditions !== current.conditions ? '판정 조건 변경' : null,
        previous && previous.actions !== current.actions ? '판정 결과 변경' : null,
        previous && previous.priority !== current.priority ? '우선순위 변경' : null,
        !previous ? '최초 버전' : null,
      ].filter((item): item is string => Boolean(item))
    : [];

  return (
    <Panel>
      <SectionHeading title="규칙 변경 이력·Diff" description="버전 시점과 작성자를 추적하고, 최신 두 버전의 조건과 결과를 나란히 비교합니다." icon={GitCompareArrows} />
      {changes.length === 0 ? <EmptyState icon={History} title="규칙 변경 이력이 없습니다" description="통합 감사 이력 또는 기존 규칙 버전 데이터가 없습니다." /> : (
        <div className="grid lg:grid-cols-[310px_minmax(0,1fr)]">
          <div className="max-h-[540px] overflow-y-auto border-b border-[#E5E8EB] lg:border-b-0 lg:border-r">
            {changes.slice(0, 20).map((change) => (
              <button type="button" key={change.id} onClick={() => onSelectRule(change.ruleId)} className={`w-full border-b border-[#E5E8EB] p-4 text-left last:border-b-0 ${selectedRuleId === change.ruleId ? 'bg-[#F5F9FF]' : 'hover:bg-[#F9FAFB]'}`}>
                <div className="flex items-center justify-between gap-2"><span className="text-xs font-black text-[#0066FF]">{change.visaTypeCode}</span><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${reviewClass(change.legalReviewStatus)}`}>{REVIEW_LABELS[change.legalReviewStatus]}</span></div>
                <p className="mt-2 truncate text-sm font-bold text-[#333D4B]">{change.ruleName}</p>
                <p className="mt-1 text-[11px] text-[#8B95A1]">v{change.fromVersion ?? '—'} → v{change.toVersion} · {formatDateTime(change.changedAt)}</p>
              </button>
            ))}
          </div>

          <div className="min-w-0 p-4 sm:p-5">
            {!selectedRuleId ? <EmptyState icon={GitCompareArrows} title="비교할 규칙을 선택해 주세요" description="왼쪽 이력에서 규칙을 선택하면 버전 목록과 변경 내용을 표시합니다." /> : loading ? (
              <div className="grid min-h-64 place-items-center text-sm text-[#6B7684]"><span><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-[#0066FF]" />버전 이력 조회 중</span></div>
            ) : error ? <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div> : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-black text-[#191F28]">{current?.ruleName ?? '규칙 상세'}</p><p className="mt-1 text-xs text-[#8B95A1]">{versions.length}개 버전 기록</p></div><div className="flex flex-wrap gap-1.5">{changesDetected.map((item) => <span key={item} className="rounded-full bg-[#EAF2FF] px-2 py-1 text-[10px] font-bold text-[#0056D6]">{item}</span>)}</div></div>
                <ol className="flex gap-2 overflow-x-auto pb-1" aria-label="규칙 버전 타임라인">
                  {versions.map((version, index) => <li key={version.id} className="flex shrink-0 items-center gap-2"><div className={`rounded-xl border px-3 py-2 ${index === 0 ? 'border-[#8DB8FF] bg-[#F5F9FF]' : 'border-[#E5E8EB]'}`}><p className="text-xs font-black text-[#333D4B]">v{version.version}</p><p className="mt-1 text-[10px] text-[#8B95A1]">{formatDate(version.createdAt)}</p></div>{index < versions.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-[#B0B8C1]" />}</li>)}
                </ol>
                <div className="grid gap-3 xl:grid-cols-2">
                  {[
                    { title: previous ? `이전 v${previous.version}` : '이전 버전', rule: previous, tone: 'bg-red-50/50' },
                    { title: current ? `현재 v${current.version}` : '현재 버전', rule: current, tone: 'bg-emerald-50/50' },
                  ].map((column) => (
                    <div key={column.title} className={`min-w-0 rounded-xl border border-[#E5E8EB] ${column.tone}`}>
                      <div className="border-b border-[#E5E8EB] px-3 py-2 text-xs font-black text-[#333D4B]">{column.title}</div>
                      {column.rule ? <div className="space-y-3 p-3">{[
                        ['conditions', column.rule.conditions], ['actions', column.rule.actions],
                      ].map(([label, value]) => <div key={label}><p className="text-[10px] font-bold uppercase tracking-wide text-[#8B95A1]">{label}</p><pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-[#0F172A] p-3 text-[10px] leading-5 text-slate-200">{prettyJson(value)}</pre></div>)}</div> : <p className="p-4 text-xs text-[#8B95A1]">비교할 이전 상세 데이터가 없습니다.</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}

