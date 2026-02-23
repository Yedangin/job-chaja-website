'use client';

/**
 * 스크랩한 공고 목록 / Saved (scrapped) job listings
 */

import { Bookmark, Search } from 'lucide-react';
import Link from 'next/link';

export default function WorkerScrapsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">스크랩한 공고</h1>
          <p className="text-sm text-gray-500 mt-0.5">Saved Jobs</p>
        </div>
      </div>

      {/* 빈 상태 / Empty state */}
      <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 mb-2">
          스크랩한 공고가 없습니다
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          관심 있는 공고를 스크랩하면 여기서 모아볼 수 있습니다.<br />
          Save jobs you are interested in to view them here.
        </p>
        <Link
          href="/worker/jobs"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          <Search className="w-4 h-4" />
          공고 탐색하기 / Browse Jobs
        </Link>
      </div>
    </div>
  );
}
