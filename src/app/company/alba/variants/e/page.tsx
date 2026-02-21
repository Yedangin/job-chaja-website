'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Briefcase, CheckCircle, Clock, XCircle, Ban,
  Sparkles, ChevronRight, BarChart3, Eye, Users,
  RefreshCw, MoreHorizontal, ArrowUpRight,
} from 'lucide-react';
import type { AlbaJobResponse, PostStatus } from '../../create/variants/a/types';

/** 공고 상태별 설정 / Job status configuration */
const STATUS_CONFIG: Record<PostStatus, { label: string; color: string; bgColor: string; icon: typeof CheckCircle }> = {
  ACTIVE: { label: '채용중', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  PAUSED: { label: '일시정지', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
  DRAFT: { label: '임시저장', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Clock },
  CLOSED: { label: '마감', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle },
  EXPIRED: { label: '기간만료', color: 'text-red-600', bgColor: 'bg-red-100', icon: Ban },
  SUSPENDED: { label: '관리자중단', color: 'text-red-700', bgColor: 'bg-red-100', icon: Ban },
};

/** 더미 공고 데이터 / Dummy job data for demonstration */
const DUMMY_JOBS: AlbaJobResponse[] = [
  {
    jobId: '1', corporateId: '100', boardType: 'PART_TIME', tierType: 'PREMIUM',
    title: '강남역 카페 주말 바리스타 모집', status: 'ACTIVE',
    jobCategoryCode: 'CAFE_BARISTA', jobCategoryName: '카페 바리스타', ksicCode: 'I',
    jobDescription: '바리스타', recruitCount: 2, hourlyWage: 12000, weeklyHours: 16,
    schedule: [{ dayOfWeek: 'SAT', startTime: '10:00', endTime: '18:00' }, { dayOfWeek: 'SUN', startTime: '10:00', endTime: '18:00' }],
    isWeekendOnly: true,
    workPeriod: { startDate: '2026-03-01', endDate: null },
    address: { sido: '서울특별시', sigungu: '강남구', detail: '역삼동 123-45', lat: 37.4979, lng: 127.0276 },
    displayAddress: '서울 강남구 역삼동', koreanLevel: 'BASIC', experienceLevel: 'NONE',
    preferredQualifications: '바리스타 자격증 우대', benefits: ['MEAL', 'STAFF_DISCOUNT'],
    detailDescription: '주말 바리스타 모집합니다.', workContentImg: null,
    applicationDeadline: '2026-03-15', applicationMethod: 'PLATFORM',
    contactName: '김채용', contactPhone: '010-1234-5678', contactEmail: 'hire@cafe.com',
    isPremium: true, premiumStartAt: '2026-02-18T00:00:00Z', premiumEndAt: '2026-03-04T00:00:00Z',
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-1,D-2,H-2,F-4',
    viewCount: 234, scrapCount: 45, applyCount: 12,
    companyName: '카페 라떼', companyLogo: null, createdAt: '2026-02-15T00:00:00Z', updatedAt: '2026-02-18T00:00:00Z', expiresAt: '2026-03-01T00:00:00Z',
  },
  {
    jobId: '2', corporateId: '100', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '편의점 야간 알바 (주 3회)', status: 'ACTIVE',
    jobCategoryCode: 'CONV_STORE', jobCategoryName: '편의점', ksicCode: 'G',
    jobDescription: '편의점 근무', recruitCount: 1, hourlyWage: 11000, weeklyHours: 24,
    schedule: [{ dayOfWeek: 'MON', startTime: '22:00', endTime: '06:00' }, { dayOfWeek: 'WED', startTime: '22:00', endTime: '06:00' }, { dayOfWeek: 'FRI', startTime: '22:00', endTime: '06:00' }],
    isWeekendOnly: false,
    workPeriod: { startDate: '2026-03-01', endDate: '2026-06-30' },
    address: { sido: '서울특별시', sigungu: '마포구', detail: '합정동 456', lat: 37.55, lng: 126.91 },
    displayAddress: '서울 마포구 합정동', koreanLevel: 'DAILY', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL'],
    detailDescription: '야간 편의점 알바입니다.', workContentImg: null,
    applicationDeadline: null, applicationMethod: 'PHONE',
    contactName: '박점장', contactPhone: '010-9876-5432', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-2',
    viewCount: 87, scrapCount: 15, applyCount: 5,
    companyName: 'CU 합정점', companyLogo: null, createdAt: '2026-02-10T00:00:00Z', updatedAt: '2026-02-10T00:00:00Z', expiresAt: '2026-02-24T00:00:00Z',
  },
  {
    jobId: '3', corporateId: '100', boardType: 'PART_TIME', tierType: 'STANDARD',
    title: '물류센터 주간 분류 작업 (단기)', status: 'DRAFT',
    jobCategoryCode: 'WAREHOUSE', jobCategoryName: '물류/창고', ksicCode: 'H',
    jobDescription: '물류 분류', recruitCount: 5, hourlyWage: 13000, weeklyHours: 30,
    schedule: [{ dayOfWeek: 'MON', startTime: '09:00', endTime: '15:00' }, { dayOfWeek: 'TUE', startTime: '09:00', endTime: '15:00' }, { dayOfWeek: 'WED', startTime: '09:00', endTime: '15:00' }, { dayOfWeek: 'THU', startTime: '09:00', endTime: '15:00' }, { dayOfWeek: 'FRI', startTime: '09:00', endTime: '15:00' }],
    isWeekendOnly: false,
    workPeriod: { startDate: '2026-04-01', endDate: '2026-04-30' },
    address: { sido: '경기도', sigungu: '이천시', detail: '마장면 물류단지', lat: 37.27, lng: 127.44 },
    displayAddress: '경기 이천시', koreanLevel: 'NONE', experienceLevel: 'NONE',
    preferredQualifications: null, benefits: ['MEAL', 'TRANSPORT'],
    detailDescription: '단기 물류 분류 작업입니다.', workContentImg: null,
    applicationDeadline: '2026-03-25', applicationMethod: 'PLATFORM',
    contactName: '이대리', contactPhone: '010-5555-6666', contactEmail: null,
    isPremium: false, premiumStartAt: null, premiumEndAt: null,
    matchedVisas: [], allowedVisas: 'F-5,F-6,F-2,H-2',
    viewCount: 0, scrapCount: 0, applyCount: 0,
    companyName: '한진물류', companyLogo: null, createdAt: '2026-02-18T00:00:00Z', updatedAt: '2026-02-18T00:00:00Z', expiresAt: null,
  },
];

/**
 * 비자 커버리지 점수 원형 표시 컴포넌트
 * Visa coverage score circle component
 */
function VisaScoreCircle({ score }: { score: number }) {
  const strokeColor = score > 80 ? '#22c55e' : score > 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative w-10 h-10 shrink-0">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" fill="none" stroke="#f3f4f6" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="15" fill="none"
          stroke={strokeColor} strokeWidth="3"
          strokeDasharray={`${score} 100`}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">{score}</span>
      </div>
    </div>
  );
}

/**
 * 기업용 알바 공고 관리 페이지 (시안 E)
 * Alba Job Management Page for Companies (Variant E)
 *
 * 잡플래닛 스타일 데이터 인사이트 + 사람인 스타일 정보 밀도
 * JobPlanet-style data insights + Saramin-style information density
 *
 * 특징: 요약 카드 + 비자 커버리지 스코어 + 프리미엄 인라인 CTA + 빈 상태
 * Features: Summary cards + visa coverage score + premium inline CTA + empty state
 */
export default function AlbaManagementPageVariantE() {
  const [jobs] = useState<AlbaJobResponse[]>(DUMMY_JOBS);
  const [isLoading] = useState(false);

  /* 요약 통계 / Summary statistics */
  const activeCount = jobs.filter((j) => j.status === 'ACTIVE').length;
  const draftCount = jobs.filter((j) => j.status === 'DRAFT').length;
  const closedCount = jobs.filter((j) => ['CLOSED', 'EXPIRED'].includes(j.status)).length;

  /** 비자 커버리지 점수 계산 (허용 비자 수 기반) / Calculate visa coverage score */
  const getVisaScore = (allowedVisas: string): number => {
    const count = allowedVisas ? allowedVisas.split(',').length : 0;
    return Math.min(Math.round((count / 9) * 100), 100); // 9개 알바 비자 기준 / Based on 9 alba visa types
  };

  /* 요약 카드 데이터 / Summary card data */
  const summaryCards = [
    { label: '전체 공고', value: jobs.length, icon: Briefcase, color: 'blue' },
    { label: '채용중', value: activeCount, icon: CheckCircle, color: 'green' },
    { label: '임시저장', value: draftCount, icon: Clock, color: 'amber' },
    { label: '마감/종료', value: closedCount, icon: XCircle, color: 'gray' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    gray: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">알바 공고 관리</h1>
          <p className="text-sm text-gray-500 mt-1">등록한 알바 공고를 관리합니다. / Manage your alba job postings.</p>
        </div>
        <Link
          href="/company/alba/create/variants/e"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition min-h-11"
          aria-label="새 알바 공고 등록 / Create new alba posting"
        >
          <Plus className="w-4 h-4" />
          새 공고 등록
        </Link>
      </div>

      {/* 요약 카드 / Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-200 hover:shadow-sm transition"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
              <card.icon className="w-5 h-5" />
            </div>
            {isLoading ? (
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* 공고 리스트 / Job list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">공고 목록</h2>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            aria-label="새로고침 / Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* 로딩 상태 / Loading state */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* 빈 상태 / Empty state */}
        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <BarChart3 className="mx-auto w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">등록된 공고가 없습니다</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              첫 알바 공고를 등록하고 비자 매칭 결과를 확인해보세요.
            </p>
            <Link
              href="/company/alba/create/variants/e"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition min-h-11"
            >
              <Plus className="w-4 h-4" />
              첫 공고 등록하기
            </Link>
          </div>
        )}

        {/* 공고 카드 리스트 / Job card list */}
        {!isLoading && jobs.map((job) => {
          const status = STATUS_CONFIG[job.status];
          const visaScore = getVisaScore(job.allowedVisas);

          return (
            <div
              key={job.jobId}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-200 hover:shadow-sm transition group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* 좌측: 공고 정보 / Left: Job info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {/* 프리미엄 배지 / Premium badge */}
                    {job.isPremium && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        프리미엄
                      </span>
                    )}
                    {/* 상태 배지 / Status badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.bgColor} ${status.color}`}>
                      <status.icon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>

                  <Link
                    href={`/worker/alba/${job.jobId}/variants/e`}
                    className="text-base font-semibold text-gray-900 hover:text-blue-600 transition truncate block"
                  >
                    {job.title}
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {job.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> 지원 {job.applyCount}
                    </span>
                    <span>시급 {job.hourlyWage.toLocaleString()}원</span>
                    <span>주 {job.weeklyHours}시간</span>
                  </div>
                </div>

                {/* 우측: 비자 스코어 + 액션 / Right: Visa score + actions */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  {/* 비자 커버리지 스코어 / Visa coverage score */}
                  <div className="flex items-center gap-2">
                    <VisaScoreCircle score={visaScore} />
                    <div className="hidden sm:block">
                      <p className="text-xs font-semibold text-gray-700">비자 커버리지</p>
                      <p className="text-[10px] text-gray-400">{job.allowedVisas.split(',').length}개 비자 허용</p>
                    </div>
                  </div>

                  {/* 프리미엄 CTA 또는 관리 버튼 / Premium CTA or manage button */}
                  {!job.isPremium && job.status === 'ACTIVE' ? (
                    <button
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition min-h-11"
                      aria-label="프리미엄 업그레이드 / Upgrade to premium"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      프리미엄
                    </button>
                  ) : (
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition min-h-11"
                      aria-label="공고 관리 / Manage posting"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  )}

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition hidden sm:block" />
                </div>
              </div>

              {/* 비활성 상태 안내 / Inactive state notice */}
              {job.status === 'DRAFT' && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">기업인증 완료 후 게시할 수 있습니다 / Can be published after company verification</p>
                  <Link
                    href={`/company/alba/create/variants/e?edit=${job.jobId}`}
                    className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-0.5"
                  >
                    이어서 작성 <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
