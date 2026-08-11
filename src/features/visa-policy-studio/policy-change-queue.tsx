import { ExternalLink, FileSearch } from 'lucide-react';
import { formatDate, formatDateTime } from './format';
import { EmptyState, Panel, SectionHeading, StatusPill } from './studio-ui';
import type { PolicyChange } from './types';

export function PolicyChangeQueue({ changes }: { changes: PolicyChange[] }) {
  return (
    <Panel>
      <SectionHeading title="정책 변경 검토 큐" description="공식 출처에서 감지된 변경 후보입니다. 감지는 승인이나 운영 반영을 의미하지 않습니다." icon={FileSearch} />
      {changes.length === 0 ? (
        <EmptyState title="표시할 정책 변경이 없습니다" description="변경 수집 결과가 없거나 정책 수집 API에서 데이터를 반환하지 않았습니다." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#F9FAFB] text-[11px] text-[#6B7684]">
              <tr>
                <th className="px-5 py-3 font-bold">변경·출처</th><th className="px-3 py-3 font-bold">영향 비자</th><th className="px-3 py-3 font-bold">시행일</th><th className="px-3 py-3 font-bold">감지 시점</th><th className="px-5 py-3 text-right font-bold">상태</th>
              </tr>
            </thead>
            <tbody>
              {changes.slice(0, 8).map((change) => (
                <tr key={change.id} className="border-t border-[#E5E8EB] align-top hover:bg-[#F9FAFB]">
                  <td className="max-w-md px-5 py-3">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1"><p className="truncate font-bold text-[#333D4B]">{change.pageTitle || change.summary || `변경 #${change.id}`}</p><p className="mt-1 text-xs text-[#8B95A1]">{change.sourceSite} · {change.changeType}</p></div>
                      {change.sourceUrl && <a href={change.sourceUrl} target="_blank" rel="noreferrer" aria-label="공식 출처 새 창으로 열기" className="rounded-lg p-1.5 text-[#0066FF] hover:bg-[#EAF2FF]"><ExternalLink className="h-4 w-4" /></a>}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold text-[#4E5968]">{change.affectedVisaTypes || '분류 필요'}</td>
                  <td className="px-3 py-3 text-xs text-[#4E5968]">{formatDate(change.effectiveDate)}</td>
                  <td className="px-3 py-3 text-xs text-[#4E5968]">{formatDateTime(change.detectedAt)}</td>
                  <td className="px-5 py-3 text-right"><StatusPill status={change.reviewStatus}>{change.reviewStatus}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

