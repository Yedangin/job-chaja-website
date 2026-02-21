'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Clock,
  Users,
  Banknote,
  Calendar,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VisaMatchBadges } from './visa-match-badges';
import { matchAlbaVisa } from '../api';
import type { AlbaJobFormData, AlbaVisaMatchingResponse, ApplicationMethod } from '../types';
import {
  DAY_LABELS,
  BENEFIT_LABELS,
  KOREAN_LEVEL_LABELS,
  EXPERIENCE_LEVEL_LABELS,
  APPLICATION_METHOD_LABELS,
  MOCK_JOB_CATEGORIES,
  MOCK_VISA_MATCHING,
} from '../mock-data';

/**
 * Step 3: 미리보기 & 등록 (미니멀 스타일)
 * Step 3: Preview & Submit (minimal style)
 *
 * 입력 내용 미리보기 + 비자 매칭 결과 + 접수 설정
 * Input preview + visa matching results + application settings
 */

interface StepPreviewProps {
  form: AlbaJobFormData;
  onUpdate: (updates: Partial<AlbaJobFormData>) => void;
  errors: Record<string, string>;
  onGoToStep: (step: number) => void;
}

const APPLICATION_METHODS: ApplicationMethod[] = ['PLATFORM', 'PHONE', 'EMAIL'];

export function StepPreview({ form, onUpdate, errors, onGoToStep }: StepPreviewProps) {
  const [matchResult, setMatchResult] = useState<AlbaVisaMatchingResponse | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  // 비자 매칭 자동 호출 / Auto-call visa matching
  useEffect(() => {
    let cancelled = false;

    async function fetchMatching() {
      if (!form.jobCategoryCode || !form.schedule.length || !form.address.sido) return;

      setMatchLoading(true);
      setMatchError(null);

      try {
        const result = await matchAlbaVisa({
          jobCategoryCode: form.jobCategoryCode,
          weeklyHours: form.weeklyHours,
          schedule: form.schedule,
          address: form.address,
          hourlyWage: form.hourlyWage,
        });
        if (!cancelled) {
          setMatchResult(result);
        }
      } catch (err) {
        if (!cancelled) {
          // 개발용 폴백: 목업 데이터 사용
          // Development fallback: use mock data
          setMatchResult(MOCK_VISA_MATCHING);
          setMatchError(null);
        }
      } finally {
        if (!cancelled) {
          setMatchLoading(false);
        }
      }
    }

    fetchMatching();
    return () => { cancelled = true; };
  }, [form.jobCategoryCode, form.weeklyHours, form.schedule, form.address, form.hourlyWage]);

  // 선택된 카테고리명 / Selected category name
  const categoryName =
    MOCK_JOB_CATEGORIES.find((c) => c.code === form.jobCategoryCode)?.name || form.jobCategoryCode;

  // 스케줄 요약 텍스트 / Schedule summary text
  const scheduleSummary = form.schedule
    .map((s) => `${DAY_LABELS[s.dayOfWeek].koShort} ${s.startTime}~${s.endTime}`)
    .join(' / ');

  // 복리후생 텍스트 / Benefits text
  const benefitsText = form.benefits
    .map((b) => BENEFIT_LABELS[b]?.ko || b)
    .join(', ');

  return (
    <div className="space-y-8">
      {/* 섹션 헤더 / Section header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          미리보기 & 등록
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          입력 내용을 확인하고 등록해주세요 <span className="text-gray-400">/ Review and submit</span>
        </p>
      </div>

      {/* 공고 미리보기 카드 / Job preview card */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        {/* 카드 헤더 / Card header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
                {categoryName}
              </span>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {form.title || '(제목 미입력)'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-xl hover:bg-gray-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="수정하기 / Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 주요 정보 / Key info */}
        <div className="px-6 space-y-3 pb-5">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Banknote className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="font-semibold text-gray-900">
              시급 {form.hourlyWage ? form.hourlyWage.toLocaleString() : 0}원
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{scheduleSummary || '(스케줄 미설정)'}</span>
            <span className="text-xs text-gray-400 ml-1">
              주 {form.weeklyHours}시간
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              {form.address.sido
                ? `${form.address.sido} ${form.address.sigungu} ${form.address.detail}`
                : '(주소 미입력)'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400 shrink-0" />
            <span>모집 {form.recruitCount}명</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              {form.workPeriod.startDate}
              {form.workPeriod.endDate ? ` ~ ${form.workPeriod.endDate}` : ' ~ 채용시까지'}
            </span>
          </div>
        </div>

        {/* 구분선 / Divider */}
        <div className="h-px bg-gray-100 mx-6" />

        {/* 상세 정보 / Details */}
        <div className="px-6 py-5 space-y-4">
          {/* 한국어/경력 / Korean level & experience */}
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-400">한국어</span>
              <span className="ml-2 text-gray-800 font-medium">
                {KOREAN_LEVEL_LABELS[form.koreanLevel]?.ko || '무관'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">경력</span>
              <span className="ml-2 text-gray-800 font-medium">
                {EXPERIENCE_LEVEL_LABELS[form.experienceLevel]?.ko || '무관'}
              </span>
            </div>
          </div>

          {/* 우대사항 / Preferred qualifications */}
          {form.preferredQualifications && (
            <div className="text-sm">
              <span className="text-gray-400">우대</span>
              <span className="ml-2 text-gray-700">{form.preferredQualifications}</span>
            </div>
          )}

          {/* 복리후생 / Benefits */}
          {form.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.benefits.map((b) => (
                <span
                  key={b}
                  className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                >
                  {BENEFIT_LABELS[b]?.ko || b}
                </span>
              ))}
            </div>
          )}

          {/* 직무 설명 / Job description */}
          {form.detailDescription && (
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-2xl p-4">
              {form.detailDescription}
            </div>
          )}
        </div>
      </div>

      {/* 비자 매칭 결과 / Visa matching results */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">
            비자 매칭 결과
            <span className="text-gray-400 font-normal text-sm ml-2">/ Visa Matching Results</span>
          </h3>
          {matchLoading && (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>

        {matchError && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{matchError}</span>
          </div>
        )}

        <VisaMatchBadges
          matchResult={matchResult}
          isLoading={matchLoading}
        />
      </div>

      {/* 접수 설정 / Application settings */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm p-6 space-y-5">
        <h3 className="text-base font-bold text-gray-900">
          접수 설정
          <span className="text-gray-400 font-normal text-sm ml-2">/ Application Settings</span>
        </h3>

        {/* 접수 마감일 / Application deadline */}
        <div className="space-y-2">
          <Label htmlFor="applicationDeadline" className="text-sm font-medium text-gray-700">
            접수 마감일
            <span className="text-gray-400 font-normal ml-1">/ Deadline</span>
          </Label>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="applicationDeadline"
                type="date"
                value={form.applicationDeadline || ''}
                onChange={(e) =>
                  onUpdate({ applicationDeadline: e.target.value || null })
                }
                disabled={form.applicationDeadline === null}
                className={cn(
                  'w-full min-h-[48px] pl-10 pr-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none transition-all',
                  'focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
                  'disabled:bg-gray-50 disabled:text-gray-400',
                )}
                aria-label="접수 마감일 / Application deadline"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={form.applicationDeadline === null}
                onChange={(e) =>
                  onUpdate({ applicationDeadline: e.target.checked ? null : '' })
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
              />
              <span className="text-sm text-gray-600">채용시까지</span>
            </label>
          </div>
        </div>

        {/* 접수 방법 / Application method */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            접수 방법
            <span className="text-gray-400 font-normal ml-1">/ Application Method</span>
          </Label>
          <div className="flex gap-2">
            {APPLICATION_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => onUpdate({ applicationMethod: method })}
                className={cn(
                  'flex-1 min-h-[44px] rounded-xl text-sm font-medium transition-all',
                  'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 outline-none',
                  form.applicationMethod === method
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
                )}
                aria-label={`${APPLICATION_METHOD_LABELS[method].ko} (${APPLICATION_METHOD_LABELS[method].en})`}
                aria-pressed={form.applicationMethod === method}
              >
                {APPLICATION_METHOD_LABELS[method].ko}
              </button>
            ))}
          </div>
        </div>

        {/* 담당자 연락처 / Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactName" className="text-sm font-medium text-gray-700">
              담당자명 <span className="text-gray-400 font-normal">/ Contact</span>
            </Label>
            <Input
              id="contactName"
              value={form.contactName}
              onChange={(e) => onUpdate({ contactName: e.target.value })}
              placeholder="김채용"
              className="min-h-[44px] rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
              연락처 <span className="text-gray-400 font-normal">/ Phone</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="contactPhone"
                value={form.contactPhone}
                onChange={(e) => onUpdate({ contactPhone: e.target.value })}
                placeholder="010-1234-5678"
                className="min-h-[44px] rounded-2xl pl-10"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
            이메일 <span className="text-gray-400 font-normal">/ Email (선택)</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={(e) => onUpdate({ contactEmail: e.target.value })}
              placeholder="hire@company.com"
              className="min-h-[44px] rounded-2xl pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
