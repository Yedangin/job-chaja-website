'use client';

import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { Briefcase, FileText, Shield, ChevronRight, Search } from 'lucide-react';

/**
 * 개인회원 대시보드 / Worker dashboard
 * 추천 공고, 지원 현황, 비자 상태 표시
 */
export default function WorkerDashboardPage() {
  const { user } = useAuth();

  const summaryCards = [
    { icon: Briefcase, label: '지원 현황', value: '-', href: '/worker/mypage', color: 'blue' },
    { icon: FileText, label: '이력서', value: '-', href: '/worker/resume', color: 'green' },
    { icon: Shield, label: '비자 상태', value: '-', href: '/worker/visa', color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 환영 메시지 / Welcome */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          안녕하세요, {user?.fullName || '구직자'}님
        </h1>
        <p className="text-sm text-gray-500 mt-1">오늘의 추천 공고를 확인해보세요</p>
      </div>

      {/* 요약 카드 / Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {summaryCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              {card.label}
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
            </p>
          </Link>
        ))}
      </div>

      {/* 빠른 검색 / Quick search */}
      <Link
        href="/worker/jobs"
        className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 mb-6 hover:border-blue-300 transition"
      >
        <Search className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-400">내 비자로 지원 가능한 공고 검색...</span>
      </Link>

      {/* 추천 공고 / Recommended jobs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">추천 공고</h2>
          <Link href="/worker/jobs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            전체보기 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">
          이력서와 비자 정보를 등록하면 맞춤 공고를 추천해드립니다.
        </p>
      </div>
    </div>
  );
}
