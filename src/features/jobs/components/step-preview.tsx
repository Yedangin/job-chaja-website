'use client';

import { MapPin, Clock, Briefcase, Star } from 'lucide-react';
import type { JobCreateFormData, VisaMatchResult, WizardStep } from '../types/job-create.types';

interface StepPreviewProps {
  form: JobCreateFormData;
  matchResult: VisaMatchResult | null;
  companyName: string;
  onGoToStep: (step: WizardStep) => void;
}

/**
 * Step 5: 미리보기 / Preview
 * 등록 전 최종 확인
 * Final review before submission
 */
export function StepPreview({ form, matchResult, companyName, onGoToStep }: StepPreviewProps) {
  // 급여 표시 문자열 / Salary display string
  const salaryDisplay = () => {
    if (form.salaryType === 'HOURLY') return `시급 ${parseInt(form.salaryAmount).toLocaleString()}원`;
    if (form.salaryType === 'ANNUAL') return `연봉 ${form.salaryAmount}만원`;
    return `월 ${form.salaryAmount}${form.salaryMax ? `~${form.salaryMax}` : ''}만원`;
  };

  // 편집 가능한 섹션 목록 / Editable section list
  const textSections = [
    { title: '업무 내용', content: form.jobDescription, targetStep: 3 as WizardStep },
    { title: '자격 요건', content: form.requirements, targetStep: 3 as WizardStep },
    { title: '우대 사항', content: form.preferredQualifications, targetStep: 3 as WizardStep },
  ].filter(s => s.content);

  return (
    <div className="space-y-6">
      {/* 공고 헤더 카드 / Job header card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-100">{companyName || '기업명'}</p>
              <h2 className="text-lg font-bold">{form.title || '공고 제목'}</h2>
            </div>
          </div>
          {matchResult && matchResult.eligibleVisas.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {matchResult.eligibleVisas.slice(0, 5).map(v => (
                <span key={v.code} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {v.code}
                </span>
              ))}
              {matchResult.eligibleVisas.length > 5 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  +{matchResult.eligibleVisas.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {form.address || '근무지 미입력'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {form.workTimeStart}~{form.workTimeEnd}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> {salaryDisplay()}
            </span>
          </div>
        </div>
      </div>

      {/* 텍스트 섹션 / Text sections */}
      {textSections.map(section => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm">{section.title}</h3>
            <button
              type="button"
              onClick={() => onGoToStep(section.targetStep)}
              className="text-xs text-blue-600 hover:underline"
            >
              수정
            </button>
          </div>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{section.content}</p>
        </div>
      ))}

      {/* 복리후생 / Benefits */}
      {form.benefits.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm">복리후생</h3>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-xs text-blue-600 hover:underline"
            >
              수정
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.benefits.map(b => (
              <span key={b} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 지원 가능 비자 / Eligible visas */}
      {matchResult && matchResult.eligibleVisas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm">지원 가능 비자 유형</h3>
            <button
              type="button"
              onClick={() => onGoToStep(4)}
              className="text-xs text-blue-600 hover:underline"
            >
              수정
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchResult.eligibleVisas.map(v => (
              <span
                key={v.code}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full font-medium"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                {v.code} {v.nameKo}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 비자 없음 경고 / No visa warning */}
      {matchResult && matchResult.eligibleVisas.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
          <p className="text-xs text-amber-700">
            매칭된 비자가 없습니다. 등록은 가능하지만 외국인 구직자가 지원할 수 없을 수 있습니다.
          </p>
        </div>
      )}

      {/* 프리미엄 안내 / Premium notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
        <p className="text-xs text-amber-700">
          <Star className="w-3.5 h-3.5 inline mr-1" />
          프리미엄으로 등록하면 상단 노출 + 추천 배지가 부여됩니다.
        </p>
      </div>
    </div>
  );
}
