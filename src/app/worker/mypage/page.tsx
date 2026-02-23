'use client';

import { useAuth } from '@/contexts/auth-context';
import { useProfileCompletion } from '@/hooks/use-profile-completion';
import Link from 'next/link';
import { Briefcase, FileText, UserCircle2, ChevronRight, UserCircle, ArrowRight } from 'lucide-react';

/**
 * 개인회원 마이페이지 (= 대시보드) / Worker my page (= dashboard)
 * 레이아웃 사이드바에 네비게이션 메뉴가 있으므로 대시보드 내용만 표시
 * Navigation menu is in layout sidebar, so only show dashboard content here
 */
export default function WorkerMyPage() {
  const { user } = useAuth();
  const { completion, resumeCount, isLoading } = useProfileCompletion();

  const summaryCards = [
    { icon: Briefcase, label: '지원 현황', value: '0', href: '/worker/mypage/applications', color: 'blue', unit: '' },
    { icon: FileText, label: '이력서', value: String(resumeCount), href: '/worker/resume', color: 'green', unit: '' },
    { icon: UserCircle2, label: '프로필 완성', value: String(completion), href: '/worker/wizard/variants/a', color: 'purple', unit: '%' },
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

      {/* 프로필 작성 유도 배너 / Profile wizard banner */}
      <Link
        href="/worker/wizard/variants/a"
        className="block bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-6 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl group"
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">프로필을 등록하고 맞춤 공고를 받아보세요!</h3>
              <p className="text-sm text-blue-100 mb-2">
                8단계 간편 입력으로 나에게 딱 맞는 일자리를 추천받을 수 있습니다
              </p>
              <div className="flex items-center gap-2 text-xs font-medium flex-wrap">
                <span className="bg-white/20 px-2 py-1 rounded">🎯 비자 맞춤</span>
                <span className="bg-white/20 px-2 py-1 rounded">📝 이력서 자동</span>
                <span className="bg-white/20 px-2 py-1 rounded">✨ 기업 제안</span>
              </div>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

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
            {isLoading && card.unit === '%' ? (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{card.value}{card.unit}</p>
            )}
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              {card.label}
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
            </p>
          </Link>
        ))}
      </div>

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
