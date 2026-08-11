'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Edit3,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ChevronDown,
  ChevronUp,
  Zap,
  FileText,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type {
  AlbaJobFormData,
  AlbaVisaMatchingResponse,
  AlbaCategoriesResponse,
  VisaEvalResult,
  VisaMatchStatus,
} from './alba-types';
import { BENEFIT_OPTIONS } from './alba-types';
import { fetchAlbaCategories } from '../api';
import { useLanguage } from '@/i18n/LanguageProvider';
import { getAlbaCopy } from '../copy';

/**
 * Step 3: 미리보기 (A 스타일 프리뷰 + 비자 매칭 결과)
 * Step 3: Preview (A style preview + visa matching results)
 */

interface Props {
  form: AlbaJobFormData;
  matchResult: AlbaVisaMatchingResponse | null;
  isMatchLoading: boolean;
  matchError?: string | null;
  onRequestMatch: () => void;
  onGoToStep: (step: 1 | 2) => void;
}

/** 카테고리 캐시 / Category cache (loaded from backend) */
let _cachedCategories: AlbaCategoriesResponse | null = null;

// 백엔드에서 카테고리 로드 (한번만 실행) / Load categories from backend (once)
fetchAlbaCategories()
  .then((res) => { _cachedCategories = res; })
  .catch(() => { /* 실패 시 code만 표시 / Show code on failure */ });

/** 카테고리 코드 → 이름 변환 / Category code to name */
function getCategoryName(code: string, locale: string): string {
  if (_cachedCategories) {
    const found = _cachedCategories.categories.find(c => c.code === code);
    if (found) return locale === 'ko' ? found.nameKo : found.nameEn;
  }
  return code;
}

/** 복리후생 코드 → 라벨+이모지 / Benefit code to label */
function getBenefitLabel(code: string, labels: Record<string, string>): { label: string; emoji: string } {
  const option = BENEFIT_OPTIONS.find(b => b.value === code);
  return option ? { emoji: option.emoji, label: labels[option.value] || option.label } : { label: code, emoji: '' };
}

/** 한국어만 추출 (영어 괄호 제거) / Extract Korean only, strip English in parentheses */
function koreanOnly(text: string): string {
  return text
    .replace(/\s*\([A-Za-z][^)]*\)\s*/g, '')
    .replace(/\s*\([A-Z][^)]*\)\s*/g, '')
    .trim();
}

/** notes를 개별 항목으로 분리 / Split notes by | separator */
function parseNotes(notes: string): string[] {
  return notes.split(/\s*\|\s*/).filter(n => n.trim().length > 0);
}

/** [태그] 추출 / Extract [tag] prefix from condition */
function parseTag(text: string): { tag: string | null; content: string } {
  const match = text.match(/^\[([^\]]+)\]\s*(.*)/s);
  if (match) return { tag: match[1], content: match[2] };
  return { tag: null, content: text };
}

/** 상태별 설정 / Status config */
const STATUS_CONFIG: Record<VisaMatchStatus, {
  icon: typeof ShieldCheck;
  color: string;
  bg: string;
  border: string;
  label: VisaMatchStatus;
}> = {
  eligible: {
    icon: ShieldCheck,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'eligible',
  },
  conditional: {
    icon: ShieldAlert,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'conditional',
  },
  blocked: {
    icon: ShieldX,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'blocked',
  },
};

/** 비자 카드 / Visa result card */
function VisaCard({ visa }: { visa: VisaEvalResult }) {
  const { lang } = useLanguage();
  const copy = getAlbaCopy(lang);
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[visa.status];
  const Icon = cfg.icon;

  const hasConditions = visa.conditions && visa.conditions.length > 0;
  const hasBlockReasons = visa.blockReasons && visa.blockReasons.length > 0;
  const hasNotes = visa.notes && visa.notes.trim().length > 0;
  const hasDetails = hasConditions || hasBlockReasons || visa.requiredPermit || hasNotes;

  /* notes를 파싱하여 고용주 관련과 일반으로 분리 / Parse notes into employer-specific and general */
  const noteItems = hasNotes ? parseNotes(visa.notes!) : [];
  const employerNotes = noteItems.filter(n =>
    n.includes('고용주') || n.includes('Employer') || n.includes('처벌') || n.includes('Penalties') || n.includes('서류') || n.includes('Docs')
  );
  const generalNotes = noteItems.filter(n =>
    !employerNotes.includes(n)
  );

  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      {/* 헤더 / Header */}
      <button
        type="button"
        onClick={() => hasDetails && setExpanded(!expanded)}
        aria-expanded={hasDetails ? expanded : undefined}
        aria-label={`${visa.visaCode} ${copy.preview.show}`}
        className="w-full text-left px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 shrink-0 ${cfg.color}`} />
          <span className="text-sm font-bold text-gray-900">{visa.visaCode}</span>
          <span className="text-xs text-gray-500">{visa.visaName}</span>

          <div className="ml-auto flex items-center gap-1 shrink-0">
            {visa.maxWeeklyHours && (
              <span className="text-[10px] bg-white border rounded px-1.5 py-0.5 text-gray-600 font-medium">
                {visa.maxWeeklyHours}h
              </span>
            )}
            {visa.maxWorkplaces && (
              <span className="text-[10px] bg-white border rounded px-1.5 py-0.5 text-gray-600 font-medium">
                {visa.maxWorkplaces}
              </span>
            )}
            {visa.requiredPermit && (
              <span className="text-[10px] bg-blue-100 border border-blue-200 rounded px-1.5 py-0.5 text-blue-700 font-medium">
                {copy.preview.permit}
              </span>
            )}
            {hasDetails && (
              expanded
                ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            )}
          </div>
        </div>

        {/* 요약 한 줄 (접힌 상태) / One-line summary when collapsed */}
        {!expanded && hasConditions && (
          <p className="text-[11px] text-gray-500 mt-1 truncate pl-6">
            {koreanOnly(visa.conditions![0])}
          </p>
        )}
      </button>

      {/* 펼침 상세 / Expanded details */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-200/50 pt-2">
          {/* 필요 허가 / Required permit */}
          {visa.requiredPermit && (
            <div className="flex items-start gap-1.5 bg-blue-50 rounded-md px-2.5 py-1.5 border border-blue-100">
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-blue-800">{copy.preview.permit}</p>
                <p className="text-xs text-blue-700">{koreanOnly(visa.requiredPermit)}</p>
              </div>
            </div>
          )}

          {/* 조건 / Conditions */}
          {hasConditions && (
            <div>
              <p className="text-[10px] font-semibold text-amber-800 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />{copy.preview.conditions}
              </p>
              <ul className="space-y-1">
                {visa.conditions!.map((c, i) => {
                  const { tag, content } = parseTag(koreanOnly(c));
                  return (
                    <li key={i} className="text-xs text-amber-800 leading-relaxed">
                      {tag ? (
                        <>
                          <span className="inline-block text-[10px] bg-amber-200/60 text-amber-900 rounded px-1 py-0.5 mr-1 font-medium">
                            {tag}
                          </span>
                          {content}
                        </>
                      ) : (
                        <>
                          <span className="text-amber-500 mr-1">{'>'}</span>
                          {content}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* 불가 사유 / Block reasons */}
          {hasBlockReasons && (
            <div>
              <p className="text-[10px] font-semibold text-red-700 mb-1">{copy.preview.blockReasons}</p>
              <ul className="space-y-0.5">
                {visa.blockReasons!.map((r, i) => (
                  <li key={i} className="text-xs text-red-600 leading-relaxed">
                    <span className="text-red-400 mr-1">{'>'}</span>
                    {koreanOnly(r)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 일반 참고사항 / General notes */}
          {generalNotes.length > 0 && (
            <div className="bg-white/60 rounded-md px-2.5 py-2 space-y-1">
              <p className="text-[10px] font-semibold text-gray-600 flex items-center gap-1">
                <Info className="w-3 h-3" />{copy.preview.notes}
              </p>
              {generalNotes.map((n, i) => (
                <p key={i} className="text-[11px] text-gray-600 leading-relaxed">
                  {koreanOnly(n)}
                </p>
              ))}
            </div>
          )}

          {/* 고용주 참고사항 / Employer notes */}
          {employerNotes.length > 0 && (
            <div className="bg-orange-50/60 rounded-md px-2.5 py-2 border border-orange-100 space-y-1">
              <p className="text-[10px] font-semibold text-orange-700 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />{copy.preview.employerNotes}
              </p>
              {employerNotes.map((n, i) => {
                const { tag, content } = parseTag(koreanOnly(n));
                return (
                  <p key={i} className="text-[11px] text-orange-800 leading-relaxed">
                    {tag && (
                      <span className="inline-block text-[10px] bg-orange-200/60 text-orange-900 rounded px-1 py-0.5 mr-1 font-medium">
                        {tag}
                      </span>
                    )}
                    {content || koreanOnly(n)}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StepPreview({ form, matchResult, isMatchLoading, matchError, onRequestMatch, onGoToStep }: Props) {
  const { lang } = useLanguage();
  const copy = getAlbaCopy(lang);
  const [showBlocked, setShowBlocked] = useState(false);

  /* 자동 비자 매칭 요청 / Auto-trigger visa matching */
  useEffect(() => {
    if (!matchResult && !isMatchLoading && form.jobCategoryCode && form.schedule.length > 0) {
      onRequestMatch();
    }
  }, [matchResult, isMatchLoading, form.jobCategoryCode, form.schedule.length, onRequestMatch]);

  const totalMatchable = matchResult
    ? matchResult.summary.totalEligible + matchResult.summary.totalConditional
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 좌측: 공고 미리보기 / Left: Job Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">{copy.preview.title}</h3>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />{copy.preview.edit}
          </button>
        </div>

        {/* 공고 카드 / Job card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 헤더 그라디언트 / Header gradient */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                {getCategoryName(form.jobCategoryCode, lang)}
              </span>
            </div>
            <h4 className="break-words text-lg font-bold text-gray-900">{form.title || copy.preview.emptyTitle}</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {form.hourlyWage > 0 ? `${form.hourlyWage.toLocaleString()} KRW` : '-'}{copy.preview.hourly}
            </p>
          </div>

          {/* 상세 정보 / Details */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{copy.preview.recruit(form.recruitCount || '-')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{copy.preview.weekly(form.weeklyHours, form.schedule.length)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{form.address.sido} {form.address.sigungu} {form.address.detail || ''}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{form.workPeriod.startDate} ~ {form.workPeriod.endDate || copy.preview.until}</span>
            </div>
          </div>

          {/* 설명 / Description */}
          {form.detailDescription && (
            <div className="px-5 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4">{form.detailDescription}</p>
            </div>
          )}

          {/* 복리후생 / Benefits */}
          {form.benefits.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap gap-1.5">
              {form.benefits.map(b => {
                const info = getBenefitLabel(b, copy.options.benefits);
                return (
                  <span key={b} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {info.emoji} {info.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 우측: 비자 매칭 결과 / Right: Visa Matching Results */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />{copy.preview.visaTitle}
        </h3>

        {/* 로딩 상태 / Loading state */}
        {isMatchLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">{copy.preview.loadingTitle}</p>
            <p className="text-xs text-gray-400 mt-1">{copy.preview.loadingBody}</p>
          </div>
        )}

        {/* 결과 표시 / Results display */}
        {matchResult && !isMatchLoading && (
          <div className="space-y-3">
            {/* 요약 배너 / Summary banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl px-5 py-4 text-white">
              <p className="text-sm opacity-80">{copy.preview.availableVisaTypes}</p>
              <p className="text-3xl font-bold mt-0.5">{copy.preview.count(totalMatchable)}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-300 rounded-full" />
                  {copy.preview.eligible(matchResult.summary.totalEligible)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  {copy.preview.conditional(matchResult.summary.totalConditional)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                  {copy.preview.blocked(matchResult.summary.totalBlocked)}
                </span>
              </div>
            </div>

            {/* 매칭 기준 정보 / Match input summary */}
            {matchResult.inputSummary && (
              <div className="text-[10px] text-gray-400 flex flex-wrap gap-x-3 gap-y-0.5 px-1">
                <span>{copy.preview.inputJob}: {matchResult.inputSummary.jobCategoryCode}</span>
                <span>{copy.preview.ksic}: {matchResult.inputSummary.ksicCode}</span>
                <span>{matchResult.inputSummary.weeklyHours}h</span>
                {matchResult.inputSummary.isWeekendOnly && <span>{copy.preview.weekendOnly}</span>}
                {matchResult.inputSummary.isDepopulationArea && <span>{copy.preview.depopulation}</span>}
              </div>
            )}

            {/* 채용 가능 / Eligible */}
            {matchResult.eligible.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />{copy.preview.eligible(matchResult.eligible.length)}
                </p>
                <div className="space-y-2">
                  {matchResult.eligible.map(v => <VisaCard key={v.visaCode} visa={v} />)}
                </div>
              </div>
            )}

            {/* 조건부 가능 / Conditional */}
            {matchResult.conditional.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />{copy.preview.conditional(matchResult.conditional.length)}
                </p>
                <div className="space-y-2">
                  {matchResult.conditional.map(v => <VisaCard key={v.visaCode} visa={v} />)}
                </div>
              </div>
            )}

            {/* 채용 불가 토글 / Blocked toggle */}
            {matchResult.blocked.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowBlocked(!showBlocked)}
                  aria-expanded={showBlocked}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  {showBlocked ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {copy.preview.blocked(matchResult.blocked.length)} {showBlocked ? copy.preview.hide : copy.preview.show}
                </button>
                {showBlocked && (
                  <div className="space-y-2 mt-2">
                    {matchResult.blocked.map(v => <VisaCard key={v.visaCode} visa={v} />)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 매칭 에러 상태 / Matching error state */}
        {matchError && !isMatchLoading && (
          <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-red-600 font-medium mb-1">{copy.preview.matchingError}</p>
            <p className="text-xs text-red-500 mb-3">{matchError}</p>
            <button
              type="button"
              onClick={onRequestMatch}
              className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition"
            >
              {copy.preview.retry}
            </button>
          </div>
        )}

        {/* 매칭 전 상태 / Before matching */}
        {!matchResult && !isMatchLoading && !matchError && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Zap className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{copy.preview.beforeMatch}</p>
            <button
              type="button"
              onClick={onRequestMatch}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {copy.preview.manualMatch}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
