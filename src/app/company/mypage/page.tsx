'use client';

import { useAuth } from '@/contexts/auth-context';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import Link from 'next/link';
import {
  Briefcase, Users, CreditCard, Ticket, ChevronRight, Plus,
  Shield, Clock, AlertCircle, ArrowRight,
  RefreshCw, Sparkles, Zap,
} from 'lucide-react';

/**
 * 기업 마이페이지 (= 대시보드) / Company my page (= dashboard)
 * 레이아웃 사이드바에 네비게이션 메뉴가 있으므로 대시보드 내용 표시
 * Navigation menu is in layout sidebar, so show dashboard content here
 */
export default function CompanyMyPage() {
  const { user, verificationStatus } = useAuth();
  const { data, isLoading, refetch } = useDashboardData();

  // 요약 카드 데이터 / Summary card data
  const summaryCards = [
    { icon: Briefcase, label: '진행 중 공고', value: String(data.activeJobCount), href: '/company/jobs', color: 'blue' },
    { icon: Users, label: '신규 지원자', value: String(data.newApplicantCount), href: '/company/applicants', color: 'green' },
    { icon: CreditCard, label: '인재열람권', value: String(data.viewingCredits), href: '/company/payments/credits', color: 'purple' },
    { icon: Ticket, label: '쿠폰', value: String(data.couponCount), href: '/company/mypage/coupons', color: 'orange' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  // 인증 상태 CTA 카드 / Verification CTA card
  const VerificationCTA = () => {
    if (verificationStatus === 'APPROVED') return null;

    if (verificationStatus === 'SUBMITTED') {
      return (
        <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm">기업인증 심사 중</h3>
              <p className="text-xs text-gray-500 mt-1">
                제출하신 서류를 관리자가 검토 중입니다. 영업일 기준 1~2일 내 결과를 안내드립니다.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                  <span className="text-xs text-gray-500">제출</span>
                </div>
                <div className="flex-1 h-0.5 bg-yellow-300" />
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-yellow-400 text-white flex items-center justify-center text-xs font-bold animate-pulse">2</div>
                  <span className="text-xs text-gray-500">심사중</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200" />
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-xs text-gray-400">승인</span>
                </div>
              </div>
            </div>
            <Link href="/company/verification" className="text-xs text-yellow-700 font-medium underline shrink-0 mt-1">
              상세보기
            </Link>
          </div>
        </div>
      );
    }

    if (verificationStatus === 'REJECTED') {
      return (
        <div className="bg-linear-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm">기업인증이 반려되었습니다</h3>
              <p className="text-xs text-gray-500 mt-1">
                서류를 수정하여 다시 제출해주세요. 반려 사유를 확인하고 재제출할 수 있습니다.
              </p>
            </div>
            <Link
              href="/company/verification"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition shrink-0"
            >
              재제출 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      );
    }

    // NONE or PENDING
    return (
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-sm">기업인증을 완료해주세요</h3>
            <p className="text-xs text-gray-500 mt-1">
              기업인증을 완료하면 공고 게시, 인재 검색, 결제 등 모든 서비스를 이용할 수 있습니다.
            </p>
          </div>
          <Link
            href="/company/verification"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition shrink-0"
          >
            인증 시작 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  };

  // 공고 상태 배지 색상 / Job status badge colors
  const statusConfig: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: '채용중', color: 'bg-green-100 text-green-700' },
    CLOSED: { label: '마감', color: 'bg-gray-100 text-gray-600' },
    DRAFT: { label: '임시저장', color: 'bg-yellow-100 text-yellow-700' },
    EXPIRED: { label: '만료', color: 'bg-red-100 text-red-600' },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* 환영 메시지 / Welcome message */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            안녕하세요, {user?.companyName || '기업'}님
          </h1>
          <p className="text-sm text-gray-500 mt-1">오늘도 좋은 인재를 만나보세요.</p>
        </div>
        <button
          onClick={refetch}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          title="새로고침"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 인증 상태 CTA / Verification CTA */}
      <VerificationCTA />

      {/* 요약 카드 / Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
              <card.icon className="w-5 h-5" />
            </div>
            {isLoading ? (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            )}
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              {card.label}
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
            </p>
          </Link>
        ))}
      </div>

      {/* 빠른 액션 / Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {/* 정규 채용관 공고 등록 (실시간 비자 분석) / Full-time job create with live visa analysis */}
        <Link
          href="/company/fulltime/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          공고 등록하기
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500 rounded text-[10px] font-semibold">
            <Zap className="w-2.5 h-2.5" />
            비자분석
          </span>
        </Link>
        {/* 알바 채용관 공고 등록 / Part-time job create */}
        <Link
          href="/company/alba/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          <Plus className="w-4 h-4" />
          알바 공고 등록
        </Link>
        <Link
          href="/company/talents"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          <Users className="w-4 h-4" />
          인재 검색
        </Link>
      </div>

      {/* 최근 공고 / Recent jobs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">최근 공고</h2>
          <Link href="/company/jobs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            전체보기 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : data.recentJobs.length > 0 ? (
          <div className="space-y-3">
            {data.recentJobs.map(job => {
              const status = statusConfig[job.status] ?? statusConfig.ACTIVE;
              return (
                <Link
                  key={job.id}
                  href={`/company/jobs/${job.id}`}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{job.title}</h3>
                      {job.tier === 'PREMIUM' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                          <Sparkles className="w-3 h-3" />
                          프리미엄
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">지원자 {job.applicantCount}명</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            등록된 공고가 없습니다. 첫 공고를 등록해보세요!
          </p>
        )}
      </div>

      {/* 추천 인재 / Recommended talents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">추천 인재</h2>
          <Link href="/company/talents" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            더보기 <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="text-sm text-gray-400 text-center py-8">
          공고를 등록하면 조건에 맞는 인재를 추천해 드립니다.
        </p>
      </div>
    </div>
  );
}
