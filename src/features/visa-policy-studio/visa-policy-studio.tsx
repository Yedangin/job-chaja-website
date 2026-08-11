'use client';

import {
  AlertCircle,
  AlertTriangle,
  CalendarClock,
  FileClock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import { AffectedJourneys, DecisionLogs, ReleaseGates } from './audit-panels';
import { formatDateTime } from './format';
import { CoverageBoard, QueueCard, ReleaseSummary } from './overview-panels';
import { PathwayStudio } from './pathway-studio';
import { PathwayDraftForm } from './pathway-draft-form';
import { PolicyChangeQueue } from './policy-change-queue';
import { ReleaseOperations } from './release-operations';
import { RuleDraftForm } from './rule-draft-form';
import { ExpertOperations } from './expert-operations';
import { RuleHistoryPanel } from './rule-history-panel';
import { usePolicyStudio } from './use-policy-studio';

function StudioSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8" aria-label="정책 스튜디오 불러오는 중" aria-busy="true">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200" />)}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
      <span className="sr-only">불러오는 중</span>
    </div>
  );
}

export function VisaPolicyStudio() {
  const studio = usePolicyStudio();
  const { snapshot, loading, error, reload } = studio;

  if (loading && !snapshot) return <StudioSkeleton />;
  if (error && !snapshot) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center p-6">
        <div className="w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-4 text-xl font-black text-[#191F28]">정책 스튜디오를 열 수 없습니다</h1>
          <p className="mt-2 text-sm leading-6 text-[#6B7684]">{error}</p>
          <button type="button" onClick={reload} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#0066FF] px-4 text-sm font-bold text-white hover:bg-[#0056D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2">
            <RefreshCw className="h-4 w-4" /> 다시 시도
          </button>
        </div>
      </div>
    );
  }
  if (!snapshot) return null;

  const queues = snapshot.overview.queues;
  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28]">
      <div className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#0066FF]"><ShieldCheck className="h-4 w-4" /> VISA POLICY OPERATIONS</div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#191F28] sm:text-3xl">비자 정책 스튜디오</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7684]">정책 변경 감지부터 5단계 경로 구성, 행정사 검토, 판정 감사, 사용자 영향과 릴리스 게이트까지 한 흐름으로 관리합니다.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-[#8B95A1] sm:inline">조회 {formatDateTime(snapshot.overview.generatedAt)}</span>
            <button type="button" onClick={reload} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D1D6DB] bg-white px-3 text-sm font-bold text-[#4E5968] hover:border-[#8DB8FF] hover:text-[#0066FF] disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 새로고침</button>
          </div>
        </header>

        {snapshot.warnings.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4" role="status">
            <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><div><p className="text-sm font-bold text-amber-900">단계적 전환 상태</p><ul className="mt-1 space-y-1 text-xs leading-5 text-amber-800">{snapshot.warnings.map((warning) => <li key={warning}>· {warning}</li>)}</ul></div></div>
          </div>
        )}

        <ReleaseSummary snapshot={snapshot} />
        <section aria-labelledby="queue-title">
          <h2 id="queue-title" className="sr-only">운영 검토 큐</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <QueueCard label="변경 감지" value={queues.changeDetected} detail="공식 출처 변경 후보" tone="amber" icon={FileClock} />
            <QueueCard label="오래된 정책" value={queues.stale} detail="기준일 또는 원문 재검토 필요" tone="red" icon={AlertTriangle} />
            <QueueCard label="행정사 검토" value={queues.legalReview} detail="전문가 의견·승인 대기" tone="blue" icon={UserRoundCheck} />
            <QueueCard label="릴리스 준비" value={queues.releaseReady} detail="배포 게이트 확인 대상" tone="slate" icon={CalendarClock} />
          </div>
        </section>

        <CoverageBoard coverage={snapshot.overview.coverage} />
        <PolicyChangeQueue changes={snapshot.policyChanges} />
        <ReleaseOperations gates={snapshot.releaseGates} onCompleted={reload} />
        <PathwayDraftForm gates={snapshot.releaseGates} pathways={snapshot.pathways} onCompleted={reload} />
        <RuleDraftForm gates={snapshot.releaseGates} onCompleted={reload} />
        <ExpertOperations />
        <PathwayStudio snapshot={snapshot} selectedPathwayId={studio.selectedPathwayId} onSelectPathway={studio.setSelectedPathwayId} selectedRuleId={studio.selectedRuleId} onSelectRule={studio.setSelectedRuleId} />
        <div className="grid gap-5 2xl:grid-cols-2"><DecisionLogs logs={snapshot.decisionLogs} /><AffectedJourneys snapshot={snapshot} /></div>
        <RuleHistoryPanel changes={snapshot.ruleChanges} selectedRuleId={studio.selectedRuleId} onSelectRule={studio.setSelectedRuleId} versions={studio.ruleVersions} details={studio.ruleDetails} loading={studio.historyLoading} error={studio.historyError} />
        <ReleaseGates gates={snapshot.releaseGates} connected={snapshot.capabilities.releaseGates} />

        <footer className="rounded-2xl border border-[#D1D6DB] bg-white p-4 sm:p-5">
          <div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#0066FF]" /><div><p className="text-sm font-bold text-[#333D4B]">운영 원칙</p><p className="mt-1 text-xs leading-5 text-[#6B7684]">잡차자는 정책 정보와 판단 보조를 제공하며 비자 발급을 보장하지 않습니다. 개별 사실관계의 정확한 판단은 사용자가 자격을 갖춘 행정사 또는 관할기관과 직접 상담하도록 안내해야 하며, 신청 대행은 등록 요건이 확인된 전문가 사건으로만 전환합니다.</p></div></div>
        </footer>
      </div>
    </div>
  );
}
