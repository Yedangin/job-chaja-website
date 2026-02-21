'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Clock,
  Calendar,
  Users,
  DollarSign,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Crown,
  Bookmark,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_ALBA_JOBS } from '@/app/company/alba/create/variants/c/components/mock-data';
import { VisaMatchBadges, VisaBadgeInline } from '@/app/company/alba/create/variants/c/components/visa-match-badges';
import {
  MOCK_VISA_ELIGIBLE,
  MOCK_VISA_CONDITIONAL,
  MOCK_VISA_BLOCKED,
  MOCK_MATCHING_SUMMARY,
} from '@/app/company/alba/create/variants/c/components/mock-data';
import type { AlbaJobResponse } from '@/app/company/alba/create/variants/c/components/alba-types';
import {
  JOB_CATEGORIES,
  BENEFITS_MAP,
  DAY_LABELS,
  KOREAN_LEVEL_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  type BenefitCode,
} from '@/app/company/alba/create/variants/c/components/alba-types';

/**
 * 구직자 알바 공고 상세 페이지 — Variant C (카드 비주얼)
 * Worker alba job detail page — Variant C (card visual)
 *
 * 히어로 그라데이션 + 스택 카드 레이아웃 + 스티키 하단 지원 바
 * Hero gradient + stacked card layout + sticky bottom apply bar
 */

export default function WorkerAlbaDetailVariantCPage() {
  const params = useParams();
  const jobId = params?.id as string;

  // 공고 데이터 (목업) / Job data (mock)
  const job = useMemo(
    () => MOCK_ALBA_JOBS.find((j) => j.jobId === jobId) || MOCK_ALBA_JOBS[0],
    [jobId]
  );

  // 스크랩 상태 / Saved state
  const [isSaved, setIsSaved] = useState(false);
  // 비자 상세 펼침 / Visa details expanded
  const [visaExpanded, setVisaExpanded] = useState(false);
  // 지원 중 / Applying
  const [isApplying, setIsApplying] = useState(false);
  // 지원 완료 / Applied
  const [hasApplied, setHasApplied] = useState(false);
  // 상세설명 펼침 / Description expanded
  const [descExpanded, setDescExpanded] = useState(false);
  // 로딩 상태 / Loading
  const [isLoading] = useState(false);

  // 카테고리 정보 / Category info
  const category = useMemo(
    () => JOB_CATEGORIES.find((c) => c.code === job.jobCategoryCode),
    [job.jobCategoryCode]
  );

  // 주말만 근무 여부 / Weekend-only flag
  const isWeekendOnly = useMemo(
    () => job.schedule.every((s) => s.dayOfWeek === 'SAT' || s.dayOfWeek === 'SUN'),
    [job.schedule]
  );

  // 마감까지 남은 일 / Days until deadline
  const daysLeft = job.applicationDeadline
    ? Math.max(0, Math.ceil((new Date(job.applicationDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  // 지원하기 / Apply
  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setHasApplied(true);
    }, 1200);
  };

  if (isLoading) {
    return <DetailLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 히어로 섹션 — 그라데이션 + 직종 아이콘 + 타이틀 / Hero section */}
      <div className="relative">
        {/* 그라데이션 배경 / Gradient background */}
        <div className={cn(
          'h-56 relative overflow-hidden',
          job.isPremium
            ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-400'
            : 'bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400'
        )}>
          {/* 장식 원 / Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute bottom-0 -left-5 w-24 h-24 bg-white/10 rounded-full" />

          {/* 상단 네비게이션 / Top navigation */}
          <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-4 flex items-center justify-between">
            <Link
              href="/worker/alba/variants/c"
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition min-h-[44px] min-w-[44px]"
              aria-label="뒤로가기 / Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition min-h-[44px] min-w-[44px]',
                  isSaved ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                )}
                aria-label={isSaved ? '스크랩 해제 / Unsave' : '스크랩 / Save'}
              >
                <Heart className={cn('w-5 h-5', isSaved && 'fill-current')} />
              </button>
              <button
                type="button"
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition min-h-[44px] min-w-[44px]"
                aria-label="공유 / Share"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 프리미엄 배지 / Premium badge */}
          {job.isPremium && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <span className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                <Crown className="w-3.5 h-3.5" />
                PREMIUM
              </span>
            </div>
          )}
        </div>

        {/* 오버레이 카드 (제목 영역) / Overlay card (title area) */}
        <div className="max-w-2xl mx-auto px-4 -mt-20 relative z-10">
          <Card className="rounded-2xl border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-5 pb-4">
              {/* 카테고리 아이콘 + 회사명 / Category icon + company name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-orange-100">
                  {category?.icon || '💼'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 truncate">{job.companyName}</p>
                  <p className="text-xs text-orange-600 font-medium">{category?.name || job.jobCategoryName}</p>
                </div>
                {/* 조회수 / View count */}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye className="w-3.5 h-3.5" />
                  {job.viewCount}
                </div>
              </div>

              {/* 공고 제목 / Job title */}
              <h1 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {job.title}
              </h1>

              {/* 주요 정보 행 / Key info row */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-xl text-sm font-bold">
                  {job.hourlyWage.toLocaleString()}원/h
                </span>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  주 {job.weeklyHours}h
                </span>
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {job.recruitCount}명
                </span>
                {isWeekendOnly && (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-sm font-semibold">
                    주말만
                  </span>
                )}
                {daysLeft !== null && daysLeft <= 3 && (
                  <span className="px-3 py-1.5 bg-red-100 text-red-600 rounded-xl text-sm font-semibold">
                    D-{daysLeft}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 본문 컨텐츠 (스택 카드) / Body content (stacked cards) */}
      <div className="max-w-2xl mx-auto px-4 space-y-3 mt-3">

        {/* 비자 적합도 카드 (가장 중요!) / Visa eligibility card (most important!) */}
        <Card className="rounded-2xl border-2 border-green-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <h2 className="text-sm font-bold text-gray-900">
                  {/* 비자 적합도 / Visa Eligibility */}
                  비자 적합도
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setVisaExpanded(!visaExpanded)}
                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 min-h-[44px] px-2"
                aria-label={visaExpanded ? '접기 / Collapse' : '전체보기 / View all'}
                aria-expanded={visaExpanded}
              >
                {visaExpanded ? '접기' : '전체보기'}
                {visaExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* 요약 배지 / Summary badges */}
            <div className="flex gap-2 mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-semibold text-green-700">
                  가능 {MOCK_MATCHING_SUMMARY.totalEligible}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 rounded-full">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">
                  조건부 {MOCK_MATCHING_SUMMARY.totalConditional}
                </span>
              </div>
            </div>

            {/* 빠른 비자 배지 목록 / Quick visa badge list */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[...MOCK_VISA_ELIGIBLE, ...MOCK_VISA_CONDITIONAL].map((v) => (
                <VisaBadgeInline key={v.visaCode} status={v.status} visaCode={v.visaCode} />
              ))}
            </div>
          </div>

          {/* 상세 비자 매칭 (펼침) / Detailed visa matching (expanded) */}
          {visaExpanded && (
            <CardContent className="pt-4">
              <VisaMatchBadges
                eligible={MOCK_VISA_ELIGIBLE}
                conditional={MOCK_VISA_CONDITIONAL}
                blocked={MOCK_VISA_BLOCKED}
                summary={MOCK_MATCHING_SUMMARY}
                showBlocked={true}
              />
            </CardContent>
          )}
        </Card>

        {/* 근무 조건 카드 / Work conditions card */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="pt-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              {/* 근무 조건 / Work Conditions */}
              근무 조건
            </h2>

            {/* 스케줄 그리드 / Schedule grid */}
            <div className="space-y-2">
              {job.schedule.map((s) => (
                <div
                  key={s.dayOfWeek}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <span className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                    s.dayOfWeek === 'SAT' || s.dayOfWeek === 'SUN'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-200 text-gray-600'
                  )}>
                    {DAY_LABELS[s.dayOfWeek].short}
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    {s.startTime} ~ {s.endTime}
                  </span>
                </div>
              ))}
            </div>

            {/* 추가 조건 / Additional info */}
            <div className="grid grid-cols-2 gap-3">
              <InfoItem
                icon={<Calendar className="w-4 h-4 text-blue-500" />}
                label="근무 기간"
                value={`${job.workPeriod.startDate} ~ ${job.workPeriod.endDate || '채용시까지'}`}
              />
              <InfoItem
                icon={<Globe className="w-4 h-4 text-purple-500" />}
                label="한국어"
                value={KOREAN_LEVEL_LABELS[job.koreanLevel].label}
              />
              <InfoItem
                icon={<Users className="w-4 h-4 text-green-500" />}
                label="경력"
                value={EXPERIENCE_LEVEL_LABELS[job.experienceLevel].label}
              />
              <InfoItem
                icon={<DollarSign className="w-4 h-4 text-orange-500" />}
                label="예상 월급"
                value={`~${(job.hourlyWage * job.weeklyHours * 4.33).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원`}
              />
            </div>
          </CardContent>
        </Card>

        {/* 근무지 주소 카드 / Workplace address card */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="pt-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              {/* 근무지 / Workplace */}
              근무지
            </h2>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-800">
                {job.address.sido} {job.address.sigungu}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{job.address.detail}</p>
            </div>
            {/* 지도 플레이스홀더 / Map placeholder */}
            <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-400 mt-1">
                  {/* 지도 영역 / Map area */}
                  지도 영역 (Map)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 복리후생 카드 / Benefits card */}
        {job.benefits.length > 0 && (
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardContent className="pt-5 space-y-3">
              <h2 className="text-sm font-bold text-gray-900">
                {/* 복리후생 / Benefits */}
                복리후생
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((code) => {
                  const benefit = BENEFITS_MAP[code as BenefitCode];
                  if (!benefit) return null;
                  return (
                    <span
                      key={code}
                      className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 rounded-xl text-sm text-amber-800 font-medium"
                    >
                      <span role="img" aria-hidden="true">{benefit.icon}</span>
                      {benefit.label}
                    </span>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 상세 설명 카드 / Detailed description card */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="pt-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-900">
              {/* 상세 설명 / Description */}
              상세 설명
            </h2>
            <div className={cn(
              'text-sm text-gray-600 leading-relaxed whitespace-pre-wrap',
              !descExpanded && 'line-clamp-6'
            )}>
              {job.detailDescription}
              {'\n\n'}
              {job.preferredQualifications && (
                <>
                  {/* 우대사항 / Preferred */}
                  <span className="font-semibold text-gray-700">우대사항: </span>
                  {job.preferredQualifications}
                </>
              )}
            </div>
            {job.detailDescription.length > 200 && (
              <button
                type="button"
                onClick={() => setDescExpanded(!descExpanded)}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium min-h-[44px] flex items-center"
                aria-label={descExpanded ? '접기 / Collapse' : '더보기 / Read more'}
              >
                {descExpanded ? '접기' : '더보기'}
                {descExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            )}
          </CardContent>
        </Card>

        {/* 접수 정보 카드 / Application info card */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="pt-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-900">
              {/* 접수 정보 / Application Info */}
              접수 정보
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {/* 마감일 / Deadline */}
                  마감일
                </span>
                <span className="text-gray-700 font-medium">
                  {job.applicationDeadline || '채용시까지'}
                  {daysLeft !== null && (
                    <span className={cn(
                      'ml-2 text-xs',
                      daysLeft <= 3 ? 'text-red-500' : 'text-gray-400'
                    )}>
                      (D-{daysLeft})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  {/* 접수 방법 / Method */}
                  접수 방법
                </span>
                <span className="text-gray-700 font-medium">
                  {job.applicationMethod === 'PLATFORM'
                    ? '플랫폼 지원'
                    : job.applicationMethod === 'PHONE'
                      ? '전화'
                      : '이메일'}
                </span>
              </div>
              {job.contactName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {/* 담당자 / Contact */}
                    담당자
                  </span>
                  <span className="text-gray-700 font-medium">{job.contactName}</span>
                </div>
              )}
              {job.contactPhone && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {/* 연락처 / Phone */}
                    연락처
                  </span>
                  <a
                    href={`tel:${job.contactPhone}`}
                    className="text-blue-600 font-medium flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {job.contactPhone}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 기업 정보 간략 카드 / Company info brief card */}
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-gray-400">
                {job.companyName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{job.companyName}</p>
                <p className="text-xs text-gray-400">
                  {job.address.sido} {job.address.sigungu}
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg text-xs">
                {/* 기업 정보 / Company Info */}
                기업 정보
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 스티키 하단 지원 바 / Sticky bottom apply bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-xl">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* 시급 표시 / Wage display */}
          <div className="flex-shrink-0">
            <p className="text-xs text-gray-400">시급 / Hourly</p>
            <p className="text-lg font-extrabold text-orange-600">{job.hourlyWage.toLocaleString()}원</p>
          </div>

          <div className="flex-1" />

          {/* 스크랩 버튼 / Save button */}
          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
            className={cn(
              'w-12 h-12 rounded-xl border flex items-center justify-center transition min-h-[44px] min-w-[44px]',
              isSaved
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-red-200'
            )}
            aria-label={isSaved ? '스크랩 해제 / Unsave' : '스크랩 / Save'}
          >
            <Heart className={cn('w-5 h-5', isSaved && 'fill-current')} />
          </button>

          {/* 지원하기 버튼 / Apply button */}
          {hasApplied ? (
            <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              {/* 지원 완료 / Applied */}
              지원 완료
            </div>
          ) : (
            <Button
              onClick={handleApply}
              disabled={isApplying}
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-200 text-base"
              aria-label="지원하기 / Apply"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  {/* 지원 중... / Applying... */}
                  지원 중...
                </>
              ) : (
                <>
                  {/* 지원하기 / Apply */}
                  지원하기
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 정보 항목 컴포넌트 / Info item component
 */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] text-gray-400">{label}</span>
      </div>
      <p className="text-xs font-semibold text-gray-700 truncate">{value}</p>
    </div>
  );
}

/**
 * 로딩 상태 / Loading state
 */
function DetailLoadingState() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 스켈레톤 / Hero skeleton */}
      <div className="h-56 bg-gray-200 animate-pulse" />
      <div className="max-w-2xl mx-auto px-4 -mt-20 space-y-3">
        <div className="bg-white rounded-2xl p-5 shadow-lg animate-pulse">
          <div className="flex gap-3 mb-4">
            <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-28" />
            </div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-full mb-2" />
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded-xl w-24" />
            <div className="h-8 bg-gray-200 rounded-xl w-20" />
            <div className="h-8 bg-gray-200 rounded-xl w-16" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
            <div className="space-y-2">
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
