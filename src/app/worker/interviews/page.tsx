'use client';

/**
 * 면접 일정 / Interview schedule
 */

import { Calendar } from 'lucide-react';

export default function WorkerInterviewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">면접 일정</h1>
        <p className="text-sm text-gray-500 mt-0.5">Interview Schedule</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 mb-2">
          예정된 면접이 없습니다
        </h3>
        <p className="text-sm text-gray-400">
          면접 일정이 확정되면 이 곳에서 확인할 수 있습니다.<br />
          Your scheduled interviews will appear here.
        </p>
      </div>
    </div>
  );
}
