'use client';

/**
 * 구직자 공고 통합 검색 허브 / Worker unified job search hub
 * 알바채용관과 정규채용관으로 이동하는 게이트웨이
 * Gateway to alba (part-time) and fulltime job boards
 */

import Link from 'next/link';
import { Briefcase, Clock, ArrowRight, Search } from 'lucide-react';

export default function WorkerJobsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* 헤더 / Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4">
          <Search className="w-7 h-7 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">공고 검색</h1>
        <p className="text-sm text-gray-500 mt-1.5">Job Search — 내 비자로 지원 가능한 공고를 찾아보세요</p>
      </div>

      {/* 채용관 선택 카드 / Job board selection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 알바채용관 / Part-time job board */}
        <Link
          href="/worker/alba"
          className="group flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">알바채용관</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              단기·파트타임 아르바이트 공고<br />
              시간제 근무, 주말 근무 등
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-orange-500 group-hover:gap-2 transition-all">
            알바 공고 보기 <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* 정규채용관 / Full-time job board */}
        <Link
          href="/worker/regular"
          className="group flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition">
            <Briefcase className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">정규채용관</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              정규직·계약직 취업 공고<br />
              경력·신입, 다양한 직종
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-blue-500 group-hover:gap-2 transition-all">
            정규직 공고 보기 <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* 비자 매칭 안내 / Visa matching notice */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white text-[10px] font-bold">i</span>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-800">내 비자로 지원 가능한 공고만 보기</p>
          <p className="text-xs text-blue-600 mt-0.5">
            각 채용관에서 "나에게 맞는 공고만 보기" 토글을 켜면 내 비자 유형으로 지원 가능한 공고만 필터링됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
