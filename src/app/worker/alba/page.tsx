'use client';

/**
 * 알바채용관 목록 페이지 / Part-time job board listing page
 */

import Link from 'next/link';
import { Briefcase, Search } from 'lucide-react';

export default function AlbaJobsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">알바채용관</h1>
        <p className="text-sm text-gray-500 mt-1">Part-time Job Board</p>
      </div>

      {/* 검색바 / Search bar */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <span className="text-sm text-gray-400">비자, 업종, 지역으로 알바 공고 검색...</span>
      </div>

      {/* 빈 상태 / Empty state */}
      <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 mb-2">알바 공고 준비 중입니다</h3>
        <p className="text-sm text-gray-400 mb-6">
          내 비자로 지원 가능한 알바 공고를 곧 만나보실 수 있습니다.
        </p>
        <Link
          href="/worker/mypage"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    </div>
  );
}
