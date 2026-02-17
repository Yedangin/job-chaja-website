'use client';

import { Shield, Clock } from 'lucide-react';
import Link from 'next/link';

/**
 * 비자 현황 플레이스홀더 / Visa status placeholder
 * U-6에서 완전 구현 예정 / To be fully implemented in U-6
 */
export default function VisaStatusPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">비자 현황</h1>
      <p className="text-gray-500 text-sm mb-8">Visa Status Overview</p>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">준비 중입니다</h2>
        <p className="text-gray-500 text-sm mb-6">
          채용 중인 외국인 직원의 비자 현황을 한눈에 확인할 수 있습니다.
          <br />
          Track visa status of your foreign employees at a glance.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>예상 출시: Phase 7 U-6</span>
        </div>
        <div className="mt-6">
          <Link
            href="/company/visa-guide"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            비자 가이드 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
