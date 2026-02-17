'use client';

import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

/**
 * 면접 일정 관리 플레이스홀더 / Interview schedule placeholder
 * U-5에서 완전 구현 예정 / To be fully implemented in U-5
 */
export default function InterviewsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">면접 일정</h1>
      <p className="text-gray-500 text-sm mb-8">Interview Schedule</p>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">준비 중입니다</h2>
        <p className="text-gray-500 text-sm mb-6">
          면접 일정 관리 기능이 곧 출시됩니다.
          <br />
          Interview scheduling feature coming soon.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>예상 출시: Phase 7 U-5</span>
        </div>
        <div className="mt-6">
          <Link
            href="/company/applicants"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            지원자 관리로 이동 →
          </Link>
        </div>
      </div>
    </div>
  );
}
