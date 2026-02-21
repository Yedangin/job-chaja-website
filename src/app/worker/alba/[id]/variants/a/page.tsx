'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Banknote,
  Users,
  Calendar,
  Star,
  Heart,
  Share2,
  Shield,
  Check,
  AlertTriangle,
  Phone,
  Mail,
  Building2,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  XCircle,
  Briefcase,
  GraduationCap,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  AlbaJobResponse,
  VisaEvalResult,
} from '@/app/company/alba/create/variants/a/types';
import { getAlbaJobDetail } from '@/app/company/alba/create/variants/a/api';
import {
  MOCK_ALBA_JOBS,
  DAY_LABELS,
  BENEFIT_LABELS,
  KOREAN_LEVEL_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  APPLICATION_METHOD_LABELS,
} from '@/app/company/alba/create/variants/a/mock-data';

/**
 * 알바 공고 상세 페이지 - 구직자용 (Variant A: 미니멀/Toss 스타일)
 * Alba job detail page - for job seekers (Variant A: Minimal/Toss style)
 *
 * 공고 정보 + 비자 적격 상태 + 지원 버튼
 * Job info + visa eligibility status + apply button
 */

/** 비자 적격 섹션 / Visa eligibility section */
function VisaEligibilitySection({ matchedVisas }: { matchedVisas: VisaEvalResult[] }) {
  const [expanded, setExpanded] = useState(false);

  const eligible = matchedVisas.filter((v) => v.status === 'eligible');
  const conditional = matchedVisas.filter((v) => v.status === 'conditional');
  const totalMatchable = eligible.length + conditional.length;

  // 사용자의 비자에 대한 개인 매칭 결과 (현재는 D-2 시뮬레이션)
  // Personal match result for user's visa (currently D-2 simulation)
  const personalVisa = matchedVisas.find((v) => v.visaCode === 'D-2');
  const personalStatus = personalVisa?.status || 'eligible';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      {/* 개인 매칭 결과 / Personal match result */}
      <div className={cn(
        'px-5 py-4',
        personalStatus === 'eligible' ? 'bg-green-50' : 'bg-amber-50',
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
            personalStatus === 'eligible' ? 'bg-green-100' : 'bg-amber-100',
          )}>
            {personalStatus === 'eligible' ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div>
            <p className={cn(
              'text-sm font-bold',
              personalStatus === 'eligible' ? 'text-green-800' : 'text-amber-800',
            )}>
              {personalVisa
                ? `${personalVisa.visaCode} ${personalStatus === 'eligible' ? '지원 가능' : '조건부 가능'}`
                : '지원 가능'}
            </p>
            {personalVisa?.conditions && personalVisa.conditions.length > 0 && (
              <p className="text-xs text-amber-600 mt-0.5">
                {personalVisa.conditions[0]}
              </p>
            )}
            {personalVisa?.notes && (
              <p className={cn(
                'text-xs mt-0.5',
                personalStatus === 'eligible' ? 'text-green-600' : 'text-amber-600',
              )}>
                {personalVisa.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 전체 매칭 비자 목록 / All matched visa list */}
      <div className="px-5 py-4">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-sm min-h-[44px]"
          aria-expanded={expanded}
          aria-label="매칭된 비자 전체 보기 / View all matched visas"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-gray-800">
              {totalMatchable}개 비자 유형 지원 가능
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2">
            {/* 가능 비자 / Eligible visas */}
            {eligible.map((v) => (
              <div key={v.visaCode} className="flex items-center gap-2 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-sm font-medium text-gray-800">{v.visaCode}</span>
                <span className="text-sm text-gray-500">{v.visaName}</span>
                {v.notes && (
                  <span className="text-xs text-gray-400 ml-auto">{v.notes}</span>
                )}
              </div>
            ))}

            {/* 조건부 비자 / Conditional visas */}
            {conditional.map((v) => (
              <div key={v.visaCode} className="py-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-800">{v.visaCode}</span>
                  <span className="text-sm text-gray-500">{v.visaName}</span>
                  {v.maxWeeklyHours !== null && v.maxWeeklyHours !== undefined && (
                    <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full ml-auto">
                      주 {v.maxWeeklyHours}h
                    </span>
                  )}
                </div>
                {v.conditions && v.conditions.length > 0 && (
                  <div className="ml-5 mt-1 space-y-0.5">
                    {v.conditions.map((c, i) => (
                      <p key={i} className="text-xs text-amber-600">- {c}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** 정보 행 / Info row */
function InfoRow({
  icon,
  label,
  value,
  labelEn,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  labelEn?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 text-gray-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">
          {label} {labelEn && <span className="text-gray-300">/ {labelEn}</span>}
        </p>
        <div className="text-sm text-gray-800 font-medium">{value}</div>
      </div>
    </div>
  );
}

/** 스켈레톤 / Skeleton */
function DetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-pulse">
      <div className="h-6 w-20 bg-gray-200 rounded-full mb-4" />
      <div className="h-7 w-3/4 bg-gray-200 rounded-lg mb-2" />
      <div className="h-4 w-1/3 bg-gray-100 rounded-lg mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-xl" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 에러 상태 / Error state */
function DetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
        <XCircle className="w-7 h-7 text-red-400" />
      </div>
      <h2 className="text-base font-semibold text-gray-800 mb-1">
        공고를 불러올 수 없습니다
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        <span className="text-gray-400">Job posting not found or unavailable</span>
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/worker/alba/variants/a">
          <Button variant="outline" className="rounded-2xl min-h-[44px]">
            목록으로 / Back to list
          </Button>
        </Link>
        <Button onClick={onRetry} className="rounded-2xl min-h-[44px] bg-blue-500 hover:bg-blue-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          다시 시도
        </Button>
      </div>
    </div>
  );
}

export default function WorkerAlbaDetailVariantAPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<AlbaJobResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isScrapped, setIsScrapped] = useState(false);

  // 공고 상세 불러오기 / Fetch job detail
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await getAlbaJobDetail(jobId);
      setJob(result);
    } catch (err) {
      // 개발용 폴백 / Development fallback
      const mockJob = MOCK_ALBA_JOBS.find((j) => j.jobId === jobId);
      if (mockJob) {
        setJob(mockJob);
      } else {
        // 첫 번째 목업 사용 / Use first mock
        setJob(MOCK_ALBA_JOBS[0]);
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // 로딩 상태 / Loading state
  if (loading) return <DetailSkeleton />;

  // 에러 상태 / Error state
  if (error || !job) return <DetailError onRetry={fetchDetail} />;

  // 스케줄 요약 / Schedule summary
  const scheduleFull = job.schedule
    .map((s) => `${DAY_LABELS[s.dayOfWeek].ko} ${s.startTime}~${s.endTime}`)
    .join(', ');

  const scheduleShort = job.schedule
    .map((s) => DAY_LABELS[s.dayOfWeek].koShort)
    .join('/');

  return (
    <div className="max-w-2xl mx-auto pb-28">
      {/* 상단 네비게이션 / Top navigation */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/worker/alba/variants/a"
            className="p-2 -ml-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="뒤로가기 / Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsScrapped(!isScrapped)}
              className={cn(
                'p-2 rounded-xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center',
                isScrapped ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50',
              )}
              aria-label={isScrapped ? '스크랩 취소 / Unsave' : '스크랩 / Save'}
            >
              <Heart className={cn('w-5 h-5', isScrapped && 'fill-red-500')} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: job.title, url: window.location.href });
                }
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="공유 / Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 / Main content */}
      <div className="px-4 py-6 space-y-6">
        {/* 헤더 / Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {job.isPremium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                PREMIUM
              </span>
            )}
            {job.isWeekendOnly && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                주말근무
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900 leading-snug mb-2">
            {job.title}
          </h1>
          <p className="text-sm text-gray-500">{job.companyName}</p>
        </div>

        {/* 핵심 정보 카드 / Key info card */}
        <div className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-50">
          <InfoRow
            icon={<Banknote className="w-4 h-4" />}
            label="시급"
            labelEn="Hourly Wage"
            value={
              <span className="text-lg font-bold text-blue-600">
                {job.hourlyWage.toLocaleString()}원
              </span>
            }
          />
          <InfoRow
            icon={<Clock className="w-4 h-4" />}
            label="근무 스케줄"
            labelEn="Schedule"
            value={
              <div>
                <span>{scheduleFull}</span>
                <span className="text-xs text-gray-400 ml-2">
                  주 {job.weeklyHours}시간
                </span>
              </div>
            }
          />
          <InfoRow
            icon={<MapPin className="w-4 h-4" />}
            label="근무지"
            labelEn="Location"
            value={`${job.address.sido} ${job.address.sigungu} ${job.address.detail}`}
          />
          <InfoRow
            icon={<Calendar className="w-4 h-4" />}
            label="근무 기간"
            labelEn="Period"
            value={
              job.workPeriod.endDate
                ? `${job.workPeriod.startDate} ~ ${job.workPeriod.endDate}`
                : `${job.workPeriod.startDate} ~ 채용시까지`
            }
          />
          <InfoRow
            icon={<Users className="w-4 h-4" />}
            label="모집인원"
            labelEn="Positions"
            value={`${job.recruitCount}명`}
          />
        </div>

        {/* 비자 적격 섹션 / Visa eligibility section */}
        <VisaEligibilitySection matchedVisas={job.matchedVisas} />

        {/* 상세 설명 / Detail description */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            상세 설명
            <span className="text-gray-400 font-normal text-sm ml-2">/ Description</span>
          </h3>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {job.detailDescription}
          </div>
        </div>

        {/* 자격 요건 / Requirements */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            자격 요건
            <span className="text-gray-400 font-normal text-sm ml-2">/ Requirements</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400">한국어 / Korean</p>
                <p className="text-sm font-medium text-gray-800">
                  {KOREAN_LEVEL_LABELS[job.koreanLevel]?.ko || '무관'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400">경력 / Experience</p>
                <p className="text-sm font-medium text-gray-800">
                  {EXPERIENCE_LEVEL_LABELS[job.experienceLevel]?.ko || '무관'}
                </p>
              </div>
            </div>
            {job.preferredQualifications && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">우대사항 / Preferred</p>
                  <p className="text-sm text-gray-700">{job.preferredQualifications}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 복리후생 / Benefits */}
        {job.benefits.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              복리후생
              <span className="text-gray-400 font-normal text-sm ml-2">/ Benefits</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm bg-blue-50 text-blue-700"
                >
                  {BENEFIT_LABELS[b]?.ko || b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 기업 정보 / Company info */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            기업 정보
            <span className="text-gray-400 font-normal text-sm ml-2">/ Company</span>
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">{job.companyName}</p>
              <p className="text-sm text-gray-500">{job.displayAddress}</p>
            </div>
          </div>

          {/* 연락처 / Contact */}
          <div className="mt-4 space-y-2 border-t border-gray-50 pt-4">
            {job.contactName && (
              <p className="text-sm text-gray-600">
                담당자: {job.contactName}
              </p>
            )}
            {job.contactPhone && (
              <a
                href={`tel:${job.contactPhone}`}
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Phone className="w-4 h-4" />
                {job.contactPhone}
              </a>
            )}
            {job.contactEmail && (
              <a
                href={`mailto:${job.contactEmail}`}
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Mail className="w-4 h-4" />
                {job.contactEmail}
              </a>
            )}
          </div>
        </div>

        {/* 접수 정보 / Application info */}
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>
            접수방법: {APPLICATION_METHOD_LABELS[job.applicationMethod]?.ko || job.applicationMethod}
            {' / '}
            마감: {job.applicationDeadline || '채용시까지'}
          </p>
          <p>
            조회 {job.viewCount} / 스크랩 {job.scrapCount} / 지원 {job.applyCount}
          </p>
        </div>
      </div>

      {/* 하단 고정 지원 버튼 / Sticky bottom apply button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-4 z-30">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            type="button"
            onClick={() => setIsScrapped(!isScrapped)}
            className={cn(
              'min-w-[52px] min-h-[52px] flex items-center justify-center rounded-2xl border transition-all',
              isScrapped
                ? 'text-red-500 bg-red-50 border-red-200'
                : 'text-gray-400 bg-gray-50 border-gray-200 hover:bg-gray-100',
            )}
            aria-label={isScrapped ? '스크랩 취소 / Unsave' : '스크랩 / Save'}
          >
            <Heart className={cn('w-5 h-5', isScrapped && 'fill-red-500')} />
          </button>
          <Button
            className="flex-1 min-h-[52px] rounded-2xl text-base font-semibold bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              // 지원하기 동작 / Apply action
              alert('지원이 완료되었습니다! / Application submitted!');
            }}
            aria-label="지원하기 / Apply"
          >
            지원하기
          </Button>
        </div>
      </div>
    </div>
  );
}
