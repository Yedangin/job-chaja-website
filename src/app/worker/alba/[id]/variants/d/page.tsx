'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Heart, Share2, MapPin, Clock, DollarSign,
  Calendar, Users, Building2,
  Check, AlertTriangle, Shield, Star, ChevronRight,
  Briefcase, Award, ChevronDown, ChevronUp,
  BookOpen, FileText,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import type { VisaEvalResult, VisaMatchStatus } from '../../../../../company/alba/create/variants/d/alba-types';
import {
  DAY_LABELS, BENEFIT_LABELS, KOREAN_LEVEL_LABELS,
  EXPERIENCE_LEVEL_LABELS, APPLICATION_METHOD_LABELS,
} from '../../../../../company/alba/create/variants/d/alba-types';
import { MOCK_SEARCH_RESULTS, MOCK_VISA_MATCHING_RESPONSE } from '../../../../../company/alba/create/variants/d/mock-data';

/**
 * 구직자용 알바 공고 상세 — Variant D (도큐먼트 레이아웃 스타일)
 * Worker alba job detail — Variant D (Document layout style)
 *
 * Notion 헤딩 스타일 섹션 + 키-값 쌍 + 비자 구조화 카드 + 브레드크럼
 * Notion heading-style sections + key-value pairs + structured visa card + breadcrumb
 */

export default function AlbaJobDetailVariantD() {
  const [bookmarked, setBookmarked] = useState(false);
  const [showAllVisas, setShowAllVisas] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  // ─── 목업 데이터 (첫 번째 검색 결과 사용) / Mock data (use first search result) ───
  const job = MOCK_SEARCH_RESULTS[0];
  const matchingResponse = MOCK_VISA_MATCHING_RESPONSE;

  // ─── 스케줄 문자열 / Schedule string ───
  const scheduleText = useMemo(() => {
    return job.schedule
      .map((s) => `${DAY_LABELS[s.dayOfWeek].ko} ${s.startTime}~${s.endTime}`)
      .join(', ');
  }, [job.schedule]);

  // ─── 비자 적합도 / Visa compatibility for current user ───
  const userVisaMatch = job.visaMatch;

  // ─── 경과 시간 / Time ago ───
  const timeAgo = useMemo(() => {
    const now = new Date('2026-02-18T12:00:00Z');
    const created = new Date(job.createdAt);
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return '오늘 등록';
    return `${diffDays}일 전 등록`;
  }, [job.createdAt]);

  // ─── D-day 계산 / D-day calculation ───
  const dDay = useMemo(() => {
    if (!job.applicationDeadline) return null;
    const now = new Date('2026-02-18');
    const deadline = new Date(job.applicationDeadline);
    const diffDays = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return '마감됨';
    if (diffDays === 0) return 'D-Day';
    return `D-${diffDays}`;
  }, [job.applicationDeadline]);

  // ─── 지원하기 / Apply ───
  const handleApply = useCallback(() => {
    setApplyLoading(true);
    setTimeout(() => {
      setApplyLoading(false);
      alert('지원이 완료되었습니다! / Application submitted!');
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ─── 상단 고정 바 / Sticky top bar ─── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/worker/alba/variants/d"
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors rounded"
              aria-label="돌아가기 / Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* 스크롤 시 보이는 제목 / Title visible on scroll */}
            <span className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-none">
              {job.title}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setBookmarked(!bookmarked)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded"
              aria-label="스크랩 / Bookmark"
              aria-pressed={bookmarked}
            >
              <Heart className={cn('w-5 h-5', bookmarked && 'fill-red-500 text-red-500')} />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-700 transition-colors rounded"
              aria-label="공유 / Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── 메인 컨텐츠 / Main content ─── */}
      <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
        {/* 브레드크럼 / Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 font-mono" aria-label="Breadcrumb">
          <Link href="/worker/alba/variants/d" className="hover:text-gray-600 transition-colors">
            알바
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span>{job.jobCategoryName}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">{job.displayAddress}</span>
        </nav>

        {/* ─── 타이틀 영역 / Title area ─── */}
        <div className="mb-6">
          {/* 프리미엄 + 비자 배지 / Premium + visa badges */}
          <div className="flex items-center gap-2 mb-2">
            {job.isPremium && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-700 font-medium">
                <Star className="w-3 h-3" />
                Premium
              </span>
            )}
            <VisaStatusTag status={userVisaMatch.status} />
          </div>

          {/* 공고 제목 / Job title */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-1">
            {job.title}
          </h1>

          {/* 회사명 + 등록일 / Company name + posted date */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="font-medium">{job.companyName}</span>
            <span className="text-gray-300">|</span>
            <span className="font-mono text-xs">{timeAgo}</span>
            {dDay && (
              <>
                <span className="text-gray-300">|</span>
                <span className={cn(
                  'font-mono text-xs font-semibold',
                  dDay === '마감됨' ? 'text-red-500' : 'text-indigo-600',
                )}>
                  {dDay}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ─── 핵심 정보 카드 / Key info card ─── */}
        <div className="border border-gray-200 rounded bg-white mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            <KeyInfoCell icon={<DollarSign className="w-4 h-4" />} label="시급 / Wage" value={`${job.hourlyWage.toLocaleString()}원`} mono />
            <KeyInfoCell icon={<Clock className="w-4 h-4" />} label="주당 / Weekly" value={`${job.weeklyHours}시간`} mono />
            <KeyInfoCell icon={<Users className="w-4 h-4" />} label="모집 / Positions" value={`${job.recruitCount}명`} mono />
            <KeyInfoCell icon={<Calendar className="w-4 h-4" />} label="기간 / Period" value={job.workPeriod.endDate ? `~${job.workPeriod.endDate.slice(5)}` : '채용시까지'} />
          </div>
        </div>

        {/* ─── 비자 정보 카드 / Visa information card ─── */}
        <div className={cn(
          'border rounded mb-6',
          userVisaMatch.status === 'eligible'
            ? 'border-emerald-200 bg-emerald-50/50'
            : 'border-amber-200 bg-amber-50/50',
        )}>
          <div className="px-4 py-3 flex items-start gap-3">
            <Shield className={cn(
              'w-5 h-5 shrink-0 mt-0.5',
              userVisaMatch.status === 'eligible' ? 'text-emerald-600' : 'text-amber-600',
            )} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-900">
                  내 비자 적합도 / My Visa Compatibility
                </h2>
                <VisaStatusTag status={userVisaMatch.status} />
              </div>
              <p className="text-xs text-gray-600 mt-1 font-mono">
                D-2 (유학 / Study Abroad)
              </p>

              {/* 조건 목록 / Conditions */}
              {userVisaMatch.conditions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {userVisaMatch.conditions.map((cond, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                      <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 전체 비자 매칭 토글 / All visa matching toggle */}
          <button
            type="button"
            onClick={() => setShowAllVisas(!showAllVisas)}
            className="w-full flex items-center justify-center gap-1 px-4 py-2 text-xs text-gray-500 border-t border-gray-200/50 hover:bg-white/50 transition-colors"
            aria-expanded={showAllVisas}
            aria-label="전체 비자 매칭 결과 보기 / View all visa matching results"
          >
            전체 비자 매칭 결과 보기
            {showAllVisas ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showAllVisas && (
            <div className="border-t border-gray-200/50 bg-white rounded-b">
              {/* Eligible */}
              {matchingResponse.eligible.map((v) => (
                <VisaRow key={v.visaCode} visa={v} />
              ))}
              {/* Conditional */}
              {matchingResponse.conditional.map((v) => (
                <VisaRow key={v.visaCode} visa={v} />
              ))}
            </div>
          )}
        </div>

        {/* ─── 근무 정보 섹션 / Work information section ─── */}
        <DocSection title="근무 정보" titleEn="Work Information" icon={<Briefcase className="w-4 h-4" />}>
          <div className="space-y-0 divide-y divide-gray-100">
            <DocKV label="직종 / Category" value={`${job.jobCategoryName}`} />
            <DocKV label="시급 / Hourly Wage" value={`${job.hourlyWage.toLocaleString()}원`} mono />
            <DocKV
              label="스케줄 / Schedule"
              value={scheduleText}
              mono
              subtext={job.isWeekendOnly ? '주말만 근무 / Weekend only' : undefined}
            />
            <DocKV label="주당 시간 / Weekly Hours" value={`${job.weeklyHours}시간`} mono />
            <DocKV
              label="근무 기간 / Period"
              value={`${job.workPeriod.startDate} ~ ${job.workPeriod.endDate || '채용시까지'}`}
              mono
            />
            <DocKV label="모집 인원 / Positions" value={`${job.recruitCount}명`} mono />
          </div>
        </DocSection>

        {/* ─── 근무지 정보 / Workplace ─── */}
        <DocSection title="근무지" titleEn="Workplace" icon={<MapPin className="w-4 h-4" />}>
          <div className="space-y-0 divide-y divide-gray-100">
            <DocKV
              label="주소 / Address"
              value={`${job.address.sido} ${job.address.sigungu} ${job.address.detail}`}
            />
            {job.distanceFromSchool && (
              <DocKV label="학교 거리 / From School" value={job.distanceFromSchool} highlight />
            )}
          </div>

          {/* 지도 플레이스홀더 / Map placeholder */}
          <div className="mt-3 h-40 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
            <p className="text-xs text-gray-400 font-mono">
              Map: {job.address.lat.toFixed(4)}, {job.address.lng.toFixed(4)}
            </p>
          </div>
        </DocSection>

        {/* ─── 자격 요건 / Requirements ─── */}
        <DocSection title="자격 요건" titleEn="Requirements" icon={<Award className="w-4 h-4" />}>
          <div className="space-y-0 divide-y divide-gray-100">
            <DocKV
              label="한국어 / Korean"
              value={KOREAN_LEVEL_LABELS[job.koreanLevel].ko}
            />
            <DocKV
              label="경력 / Experience"
              value={EXPERIENCE_LEVEL_LABELS[job.experienceLevel].ko}
            />
            {job.preferredQualifications && (
              <DocKV label="우대사항 / Preferred" value={job.preferredQualifications} />
            )}
          </div>
        </DocSection>

        {/* ─── 복리후생 / Benefits ─── */}
        {job.benefits.length > 0 && (
          <DocSection title="복리후생" titleEn="Benefits" icon={<Star className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
                >
                  {BENEFIT_LABELS[b as keyof typeof BENEFIT_LABELS]?.ko || b}
                </span>
              ))}
            </div>
          </DocSection>
        )}

        {/* ─── 상세 설명 / Detailed Description ─── */}
        <DocSection title="상세 설명" titleEn="Description" icon={<FileText className="w-4 h-4" />}>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {job.detailDescription}
          </p>
        </DocSection>

        {/* ─── 접수 정보 / Application Info ─── */}
        <DocSection title="접수 정보" titleEn="How to Apply" icon={<BookOpen className="w-4 h-4" />}>
          <div className="space-y-0 divide-y divide-gray-100">
            <DocKV
              label="접수 방법 / Method"
              value={APPLICATION_METHOD_LABELS[job.applicationMethod].ko}
            />
            {job.applicationDeadline && (
              <DocKV label="마감일 / Deadline" value={job.applicationDeadline} mono />
            )}
            <DocKV label="담당자 / Contact" value={job.contactName} />
            <DocKV label="연락처 / Phone" value={job.contactPhone} mono />
            {job.contactEmail && (
              <DocKV label="이메일 / Email" value={job.contactEmail} mono />
            )}
          </div>
        </DocSection>

        {/* ─── 기업 정보 / Company Info ─── */}
        <DocSection title="기업 정보" titleEn="Company" icon={<Building2 className="w-4 h-4" />}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{job.companyName}</p>
              <p className="text-xs text-gray-500">{job.displayAddress}</p>
            </div>
          </div>
        </DocSection>
      </main>

      {/* ─── 하단 고정 지원 바 / Bottom fixed apply bar ─── */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* 시급 + 비자 상태 / Wage + visa status */}
          <div>
            <p className="text-lg font-bold font-mono text-gray-900">
              {job.hourlyWage.toLocaleString()}원<span className="text-xs text-gray-400 font-normal">/h</span>
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <VisaStatusTag status={userVisaMatch.status} />
              <span className="text-[10px] text-gray-400 font-mono">D-2</span>
            </div>
          </div>

          {/* 지원 버튼 / Apply button */}
          <Button
            onClick={handleApply}
            disabled={applyLoading}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white min-h-12 px-8 text-base"
            aria-label="지원하기 / Apply now"
          >
            {applyLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                지원 중...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                지원하기
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

// ─── 도큐먼트 섹션 / Document section ───

function DocSection({
  title,
  titleEn,
  icon,
  children,
}: {
  title: string;
  titleEn: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      {/* Notion 스타일 섹션 헤더 / Notion-style section header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        <span className="text-gray-400">{icon}</span>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <span className="text-[11px] text-gray-400 font-mono">{titleEn}</span>
      </div>
      {children}
    </section>
  );
}

// ─── 도큐먼트 키-값 / Document key-value ───

function DocKV({
  label,
  value,
  mono,
  highlight,
  subtext,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  subtext?: string;
}) {
  return (
    <div className="flex items-start gap-4 py-2.5">
      <span className="text-xs text-gray-400 w-32 shrink-0 pt-0.5">{label}</span>
      <div>
        <span className={cn(
          'text-sm',
          mono && 'font-mono',
          highlight ? 'text-indigo-600 font-medium' : 'text-gray-800',
        )}>
          {value}
        </span>
        {subtext && (
          <p className="text-[11px] text-indigo-500 mt-0.5">{subtext}</p>
        )}
      </div>
    </div>
  );
}

// ─── 비자 상태 태그 / Visa status tag ───

function VisaStatusTag({ status }: { status: VisaMatchStatus | 'eligible' | 'conditional' }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
      status === 'eligible' && 'bg-emerald-100 text-emerald-700',
      status === 'conditional' && 'bg-amber-100 text-amber-700',
      status === 'blocked' && 'bg-red-100 text-red-600',
    )}>
      {status === 'eligible' && <Check className="w-2.5 h-2.5" />}
      {status === 'conditional' && <AlertTriangle className="w-2.5 h-2.5" />}
      {status === 'eligible' ? '지원 가능' : status === 'conditional' ? '조건부' : '불가'}
    </span>
  );
}

// ─── 비자 결과 행 / Visa result row ───

function VisaRow({ visa }: { visa: VisaEvalResult }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 last:border-b-0">
      {/* 상태 도트 / Status dot */}
      <span className={cn(
        'w-2 h-2 rounded-full shrink-0',
        visa.status === 'eligible' && 'bg-emerald-500',
        visa.status === 'conditional' && 'bg-amber-500',
        visa.status === 'blocked' && 'bg-red-400',
      )} />

      {/* 비자 코드 / Visa code */}
      <span className={cn(
        'font-mono text-xs font-semibold w-8',
        visa.status === 'eligible' && 'text-emerald-700',
        visa.status === 'conditional' && 'text-amber-700',
        visa.status === 'blocked' && 'text-red-500',
      )}>
        {visa.visaCode}
      </span>

      {/* 비자명 / Visa name */}
      <span className="text-xs text-gray-700 flex-1">
        {visa.visaName}
        <span className="text-gray-400 ml-1">{visa.visaNameEn}</span>
      </span>

      {/* 시간 제한 / Hour limit */}
      {visa.maxWeeklyHours && (
        <span className="text-[10px] font-mono text-gray-400">
          max {visa.maxWeeklyHours}h
        </span>
      )}
    </div>
  );
}

// ─── 핵심 정보 셀 / Key info cell ───

function KeyInfoCell({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-4 py-3 text-center">
      <div className="flex items-center justify-center text-gray-400 mb-1">
        {icon}
      </div>
      <p className={cn('text-sm font-semibold text-gray-900', mono && 'font-mono')}>
        {value}
      </p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
