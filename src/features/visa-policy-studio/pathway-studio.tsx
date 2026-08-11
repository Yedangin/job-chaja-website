'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, BookOpenCheck, Info, LockKeyhole, Send, Sparkles } from 'lucide-react';
import { EDITOR_TABS, REVIEW_LABELS, type EditorTabKey } from './config';
import { ExpertHandoffEditor } from './expert-handoff-editor';
import { formatDate, reviewClass } from './format';
import { EmptyState, Panel, SectionHeading, StatusPill } from './studio-ui';
import type { PolicyStudioSnapshot } from './types';

function EditorEmpty({ tab }: { tab: EditorTabKey }) {
  const current = EDITOR_TABS.find((item) => item.key === tab)!;
  const Icon = current.icon;
  return (
    <div className="rounded-xl border border-dashed border-[#D1D6DB] bg-[#F9FAFB] p-6 text-center">
      <Icon className="mx-auto h-7 w-7 text-[#B0B8C1]" />
      <p className="mt-3 text-sm font-bold text-[#333D4B]">{current.label} 상세 원장 연결 대기</p>
      <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-[#8B95A1]">이 단계의 읽기·편집 API가 제공되기 전까지 임시 데이터를 생성하거나 저장 성공으로 표시하지 않습니다.</p>
      <button type="button" disabled className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[#0066FF] px-3 text-xs font-bold text-white opacity-40"><LockKeyhole className="h-3.5 w-3.5" /> 편집 잠김</button>
    </div>
  );
}

export function PathwayStudio({
  snapshot,
  selectedPathwayId,
  onSelectPathway,
  selectedRuleId,
  onSelectRule,
}: {
  snapshot: PolicyStudioSnapshot;
  selectedPathwayId: string;
  onSelectPathway: (id: string) => void;
  selectedRuleId: string;
  onSelectRule: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<EditorTabKey>('ELIGIBILITY');
  const pathway = snapshot.pathways.find((item) => item.id === selectedPathwayId) ?? snapshot.pathways[0];
  const pathwayRules = useMemo(() => snapshot.rules.filter((rule) => rule.visaTypeCode === pathway?.targetVisa), [pathway?.targetVisa, snapshot.rules]);
  const relatedChanges = useMemo(() => snapshot.policyChanges.filter((change) =>
    (change.affectedVisaTypes ?? '').split(',').map((code) => code.trim()).includes(pathway?.targetVisa ?? '')),
  [pathway?.targetVisa, snapshot.policyChanges]);

  return (
    <Panel className="overflow-hidden">
      <SectionHeading
        title="Pathway Studio"
        description="하나의 경로에서 5단계 운영 데이터와 출처·버전을 함께 점검합니다."
        icon={Sparkles}
        action={<div className="flex gap-2"><button type="button" disabled title="경로 편집 API 연결 후 사용할 수 있습니다" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D1D6DB] bg-white px-3 text-xs font-bold text-[#6B7684] opacity-50"><LockKeyhole className="h-3.5 w-3.5" /> 새 초안</button><button type="button" disabled title="검토 요청 API 연결 후 사용할 수 있습니다" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0066FF] px-3 text-xs font-bold text-white opacity-40"><Send className="h-3.5 w-3.5" /> 검토 요청</button></div>}
      />
      {snapshot.pathways.length === 0 ? (
        <EmptyState title="등록된 정책 경로가 없습니다" description="경로 원장이 연결되면 비자별 5단계 구성 상태와 편집 화면이 여기에 표시됩니다." />
      ) : (
        <div className="grid min-h-[560px] lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="border-b border-[#E5E8EB] bg-[#F9FAFB] p-3 lg:border-b-0 lg:border-r" aria-label="비자 경로 목록">
            <label className="block text-[11px] font-bold text-[#6B7684] lg:hidden" htmlFor="policy-pathway-select">경로 선택</label>
            <select id="policy-pathway-select" value={pathway?.id} onChange={(event) => onSelectPathway(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-[#D1D6DB] bg-white px-3 text-sm font-semibold outline-none focus:border-[#0066FF] lg:hidden">
              {snapshot.pathways.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <div className="hidden space-y-1 lg:block">
              {snapshot.pathways.map((item) => {
                const selected = item.id === pathway?.id;
                return (
                  <button type="button" key={item.id} onClick={() => onSelectPathway(item.id)} className={`w-full rounded-xl border px-3 py-3 text-left transition ${selected ? 'border-[#B8D4FF] bg-white shadow-sm' : 'border-transparent hover:bg-white'}`}>
                    <div className="flex items-center justify-between gap-2"><span className={`text-sm font-black ${selected ? 'text-[#0066FF]' : 'text-[#333D4B]'}`}>{item.code}</span><span className={selected ? 'text-[#0066FF]' : 'text-[#B0B8C1]'}>›</span></div>
                    <p className="mt-1 truncate text-xs text-[#6B7684]">{item.currentVisa ? `${item.currentVisa} → ${item.targetVisa}` : item.name}</p>
                    <p className="mt-2 text-[10px] font-semibold text-[#8B95A1]">{item.isLegacyRuleGroup ? '기존 규칙 묶음 · 읽기 전용' : `Release ${item.releaseVersion ?? '미배포'}`}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="border-b border-[#E5E8EB] p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-black text-[#191F28]">{pathway.name}</h3><StatusPill status={pathway.status}>{pathway.status}</StatusPill><span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-bold ${reviewClass(pathway.reviewStatus)}`}>{REVIEW_LABELS[pathway.reviewStatus]}</span></div>
                  <p className="mt-2 text-xs text-[#6B7684]">기준일 {formatDate(pathway.policyAsOf)} · 시행일 {formatDate(pathway.effectiveFrom)} · 전문가 검토 {formatDate(pathway.reviewedAt)}</p>
                </div>
                {pathway.isLegacyRuleGroup && <div className="flex max-w-md items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />경로 정의가 아니라 기존 활성 규칙을 비자별로 묶어 표시한 것입니다.</div>}
              </div>
            </div>

            <div className="overflow-x-auto border-b border-[#E5E8EB]" role="tablist" aria-label="정책 경로 편집 단계">
              <div className="flex min-w-max px-3">
                {EDITOR_TABS.map((tab) => { const Icon = tab.icon; const active = activeTab === tab.key; return <button key={tab.key} type="button" role="tab" aria-selected={active} onClick={() => setActiveTab(tab.key)} className={`flex h-12 items-center gap-1.5 border-b-2 px-3 text-xs font-bold ${active ? 'border-[#0066FF] text-[#0066FF]' : 'border-transparent text-[#6B7684] hover:text-[#333D4B]'}`}><Icon className="h-3.5 w-3.5" /> {tab.label}</button>; })}
              </div>
            </div>

            <div className="p-4 sm:p-5" role="tabpanel">
              {activeTab === 'ELIGIBILITY' && (pathwayRules.length === 0 ? <EditorEmpty tab={activeTab} /> : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-[#EAF2FF] p-3 text-xs leading-5 text-[#0056D6]"><Info className="mt-0.5 h-4 w-4 shrink-0" />기존 판정 규칙 {pathwayRules.length}건을 조회했습니다. 현재 편집 API는 승인 절차를 우회하므로 이 스튜디오에서는 읽기만 허용합니다.</div>
                  {pathwayRules.map((rule) => (
                    <button key={rule.id} type="button" onClick={() => onSelectRule(rule.id)} className={`w-full rounded-xl border p-4 text-left transition ${selectedRuleId === rule.id ? 'border-[#8DB8FF] bg-[#F5F9FF]' : 'border-[#E5E8EB] hover:border-[#B8D4FF]'}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="font-bold text-[#333D4B]">{rule.ruleName}</span><StatusPill status={rule.status}>{rule.status}</StatusPill></div><span className="text-xs font-bold text-[#0066FF]">v{rule.version}</span></div>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6B7684]">{rule.ruleDescription || '설명이 등록되지 않았습니다.'}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#8B95A1]"><span>시행 {formatDate(rule.effectiveFrom)}</span><span>종료 {formatDate(rule.effectiveTo)}</span><span>우선순위 {rule.priority}</span><span>유형 {rule.ruleType}</span></div>
                    </button>
                  ))}
                </div>
              ))}
              {activeTab !== 'ELIGIBILITY' && activeTab !== 'SOURCE_VERSION' && activeTab !== 'EXPERT_HANDOFF' && <EditorEmpty tab={activeTab} />}
              {activeTab === 'EXPERT_HANDOFF' && <ExpertHandoffEditor pathway={pathway} />}
              {activeTab === 'SOURCE_VERSION' && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      ['정책 릴리스', pathway.releaseVersion ? `Release ${pathway.releaseVersion}` : '미연결'], ['판정 기준일', formatDate(pathway.policyAsOf)], ['전문가 검토일', formatDate(pathway.reviewedAt)], ['연결 출처', pathway.sourceCount === null ? '미집계' : `${pathway.sourceCount}건`],
                    ].map(([label, value]) => <div key={label} className="rounded-xl border border-[#E5E8EB] p-3"><p className="text-[10px] font-bold text-[#8B95A1]">{label}</p><p className="mt-1 text-sm font-bold text-[#333D4B]">{value}</p></div>)}
                  </div>
                  {relatedChanges.length === 0 ? <EmptyState icon={BookOpenCheck} title="연결된 정책 변경 근거가 없습니다" description="이 경로의 규칙과 정책 변경 출처 간 연결을 등록해야 기준일과 법률 검토 상태를 증명할 수 있습니다." /> : (
                    <div className="space-y-2">{relatedChanges.map((change) => <div key={change.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E5E8EB] p-3"><BookOpenCheck className="h-4 w-4 text-[#0066FF]" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#333D4B]">{change.pageTitle || change.summary || `변경 #${change.id}`}</p><p className="mt-1 text-[11px] text-[#8B95A1]">{change.sourceSite} · 시행 {formatDate(change.effectiveDate)} · 검토 {formatDate(change.reviewedAt)}</p></div><StatusPill status={change.reviewStatus}>{change.reviewStatus}</StatusPill></div>)}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}

