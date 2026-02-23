'use client';

/**
 * 지원 현황 / Job application status
 */

import { ClipboardList, Search } from 'lucide-react';
import Link from 'next/link';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:              { label: '검토 중 / Pending',        color: 'bg-yellow-100 text-yellow-700' },
  REVIEWING:            { label: '검토 중 / Reviewing',      color: 'bg-blue-100 text-blue-700' },
  INTERVIEW_SCHEDULED:  { label: '면접 예정 / Interview',    color: 'bg-purple-100 text-purple-700' },
  ACCEPTED:             { label: '합격 / Accepted',          color: 'bg-green-100 text-green-700' },
  REJECTED:             { label: '불합격 / Rejected',        color: 'bg-red-100 text-red-700' },
  CANCELLED:            { label: '취소됨 / Cancelled',       color: 'bg-gray-100 text-gray-600' },
};

export default function WorkerApplicationsPage() {
  // TODO: API 연결 후 실제 데이터로 교체
  // TODO: Replace with real API data
  const applications: unknown[] = [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">지원 현황</h1>
          <p className="text-sm text-gray-500 mt-0.5">My Applications</p>
        </div>
        <span className="text-sm text-gray-400">총 {applications.length}건 / Total</span>
      </div>

      {/* 상태 요약 바 / Status summary bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { key: 'PENDING',             label: '검토 중', count: 0, color: 'border-yellow-200 bg-yellow-50' },
          { key: 'INTERVIEW_SCHEDULED', label: '면접 예정', count: 0, color: 'border-purple-200 bg-purple-50' },
          { key: 'ACCEPTED',            label: '합격',    count: 0, color: 'border-green-200 bg-green-50' },
        ].map((s) => (
          <div key={s.key} className={`rounded-xl border ${s.color} p-4 text-center`}>
            <p className="text-2xl font-bold text-gray-800">{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 빈 상태 / Empty state */}
      {applications.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            지원 이력이 없습니다
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            공고에 지원하면 여기서 현황을 확인할 수 있습니다.<br />
            Apply to jobs to track your application status here.
          </p>
          <Link
            href="/worker/jobs"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
          >
            <Search className="w-4 h-4" />
            공고 탐색하기 / Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}
