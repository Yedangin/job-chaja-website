/**
 * Step 5: 미리보기 + 등록
 * Step 5: Preview + Submit
 */

'use client';

import { Edit2 } from 'lucide-react';
import type { FulltimeJobFormData, WizardStep } from './fulltime-types';

interface StepPreviewProps {
  form: FulltimeJobFormData;
  onGoToStep: (step: WizardStep) => void;
}

export default function StepPreview({ form, onGoToStep }: StepPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ✨ 공고 미리보기
        </h2>
        <p className="text-sm text-gray-600">
          등록 전 입력한 정보를 최종 확인하세요
        </p>
      </div>

      {/* Step 1 미리보기 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">기본 정보</h3>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            수정
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-32 text-gray-600">직종:</span>
            <span className="font-semibold">{form.jobCategoryCode || '-'}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">고용 형태:</span>
            <span className="font-semibold">{form.employmentType}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">연봉:</span>
            <span className="font-semibold">
              {form.salaryMin.toLocaleString()}원 ~ {form.salaryMax.toLocaleString()}원
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">경력:</span>
            <span className="font-semibold">{form.experienceLevel}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">학력:</span>
            <span className="font-semibold">{form.educationLevel}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">해외 채용:</span>
            <span className="font-semibold">
              {form.overseasHireWilling ? '가능' : '불가능'}
            </span>
          </div>
        </div>
      </div>

      {/* Step 2 미리보기 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">근무 조건</h3>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            수정
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-32 text-gray-600">주소:</span>
            <span className="font-semibold">
              {form.address.sido} {form.address.sigungu} {form.address.detail}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">우대 전공:</span>
            <span className="font-semibold">
              {form.preferredMajors.length > 0
                ? form.preferredMajors.join(', ')
                : '없음'}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">모집 인원:</span>
            <span className="font-semibold">{form.recruitCount}명</span>
          </div>
        </div>
      </div>

      {/* Step 3 미리보기 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">상세 내용</h3>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            수정
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-600">제목:</span>
            <p className="font-semibold mt-1">{form.title}</p>
          </div>
          <div>
            <span className="text-gray-600">설명:</span>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">
              {form.detailDescription}
            </p>
          </div>
          <div>
            <span className="text-gray-600">복리후생:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-xs font-semibold"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 미리보기 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">접수 설정</h3>
          <button
            type="button"
            onClick={() => onGoToStep(4)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            수정
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="w-32 text-gray-600">접수 방법:</span>
            <span className="font-semibold">{form.applicationMethod}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">마감일:</span>
            <span className="font-semibold">
              {form.isOpenEnded
                ? '채용 시까지'
                : form.applicationDeadline || '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <p className="text-sm text-blue-900">
          💡 모든 정보를 확인하셨나요? 하단의 <strong>&quot;최종 등록하기&quot;</strong> 버튼을
          눌러 공고를 게시하세요.
        </p>
      </div>
    </div>
  );
}
