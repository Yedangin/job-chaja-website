/**
 * Step 2: 근무 조건
 * Step 2: Work Conditions
 * - 주소, 우대전공, 모집인원, 회사정보
 * - Address, preferred majors, recruit count, company info
 */

'use client';

import { useState } from 'react';
import { MapPin, GraduationCap, Users, Building2, Info, X } from 'lucide-react';
import type { FulltimeJobFormData, InstitutionType } from './fulltime-types';

interface StepWorkConditionsProps {
  form: FulltimeJobFormData;
  errors: Record<string, string>;
  updateForm: <K extends keyof FulltimeJobFormData>(
    key: K,
    value: FulltimeJobFormData[K]
  ) => void;
}

export default function StepWorkConditions({
  form,
  errors,
  updateForm,
}: StepWorkConditionsProps) {
  const [majorInput, setMajorInput] = useState('');

  // 시/도 목록 / Province list
  const sidoList = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '경기도',
    '강원도',
    '충청북도',
    '충청남도',
    '전라북도',
    '전라남도',
    '경상북도',
    '경상남도',
    '제주특별자치도',
  ];

  // 시/군/구 목록 (임시 데이터) / District list (mock data)
  const getSigunguList = (sido: string) => {
    // TODO: API 연동 또는 실제 데이터 사용
    // Mock data for now
    if (sido === '서울특별시') {
      return [
        '강남구',
        '강동구',
        '강북구',
        '강서구',
        '관악구',
        '광진구',
        '구로구',
        '금천구',
        '노원구',
        '도봉구',
        '동대문구',
        '동작구',
        '마포구',
        '서대문구',
        '서초구',
        '성동구',
        '성북구',
        '송파구',
        '양천구',
        '영등포구',
        '용산구',
        '은평구',
        '종로구',
        '중구',
        '중랑구',
      ];
    }
    return ['전체'];
  };

  // 전공 추가 / Add major
  const handleAddMajor = () => {
    if (!majorInput.trim()) return;
    if (form.preferredMajors.length >= 5) {
      alert('우대 전공은 최대 5개까지 입력 가능합니다');
      return;
    }
    if (form.preferredMajors.includes(majorInput.trim())) {
      alert('이미 추가된 전공입니다');
      return;
    }
    updateForm('preferredMajors', [...form.preferredMajors, majorInput.trim()]);
    setMajorInput('');
  };

  // 전공 삭제 / Remove major
  const handleRemoveMajor = (index: number) => {
    const newMajors = form.preferredMajors.filter((_, i) => i !== index);
    updateForm('preferredMajors', newMajors);
  };

  // 기관 유형 라벨 / Institution type labels
  const institutionLabels: Record<InstitutionType, string> = {
    GENERAL: '일반 기업',
    EDUCATION: '교육 기관',
    RESEARCH: '연구 기관',
    MEDICAL: '의료 기관',
  };

  return (
    <div className="space-y-6">
      {/* 근무지 주소 / Work address */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">근무지 주소</h3>
          <span className="text-red-500 text-sm">*</span>
        </div>

        <div className="space-y-4">
          {/* 시/도 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시/도
            </label>
            <select
              value={form.address.sido}
              onChange={(e) => {
                updateForm('address', {
                  ...form.address,
                  sido: e.target.value,
                  sigungu: '',
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">시/도 선택</option>
              {sidoList.map((sido) => (
                <option key={sido} value={sido}>
                  {sido}
                </option>
              ))}
            </select>
          </div>

          {/* 시/군/구 */}
          {form.address.sido && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시/군/구
              </label>
              <select
                value={form.address.sigungu}
                onChange={(e) => {
                  updateForm('address', {
                    ...form.address,
                    sigungu: e.target.value,
                  });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">시/군/구 선택</option>
                {getSigunguList(form.address.sido).map((sigungu) => (
                  <option key={sigungu} value={sigungu}>
                    {sigungu}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 상세 주소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 주소
            </label>
            <input
              type="text"
              value={form.address.detail}
              onChange={(e) => {
                updateForm('address', {
                  ...form.address,
                  detail: e.target.value,
                });
              }}
              placeholder="예: 테헤란로 123, 서초빌딩 5층"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 인구감소지역 안내 */}
          {form.address.isDepopulationArea && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-900">
                이 지역은 <strong>인구감소지역</strong>입니다. D-2에서 E-7
                전환 시 점수제 요건이 완화됩니다.
              </p>
            </div>
          )}
        </div>

        {errors.address && (
          <p className="mt-2 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* 우대 전공 / Preferred majors */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">우대 전공</h3>
          <span className="text-gray-400 text-sm">(선택, 최대 5개)</span>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={majorInput}
            onChange={(e) => setMajorInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMajor();
              }
            }}
            placeholder="전공명 입력 (예: 컴퓨터공학, 소프트웨어공학)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddMajor}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            추가
          </button>
        </div>

        {form.preferredMajors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.preferredMajors.map((major, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-900 rounded-lg font-semibold"
              >
                <span>{major}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMajor(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-3 text-xs text-gray-500">
          💡 전공 요건이 없는 경우 추가하지 않아도 됩니다
        </p>
      </div>

      {/* 모집 인원 / Recruit count */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">모집 인원</h3>
          <span className="text-red-500 text-sm">*</span>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="number"
            min="1"
            value={form.recruitCount}
            onChange={(e) => updateForm('recruitCount', parseInt(e.target.value) || 1)}
            className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700">명</span>
        </div>

        {errors.recruitCount && (
          <p className="mt-2 text-sm text-red-600">{errors.recruitCount}</p>
        )}
      </div>

      {/* 회사 정보 (선택) / Company info (optional) */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">회사 정보</h3>
          <span className="text-gray-400 text-sm">(선택)</span>
        </div>

        <div className="space-y-4">
          {/* 전체 직원 수 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전체 직원 수
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                value={form.companyInfo.totalEmployees || ''}
                onChange={(e) =>
                  updateForm('companyInfo', {
                    ...form.companyInfo,
                    totalEmployees: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="100"
                className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">명</span>
            </div>
          </div>

          {/* 외국인 직원 수 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              외국인 직원 수
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                value={form.companyInfo.foreignEmployeeCount || ''}
                onChange={(e) =>
                  updateForm('companyInfo', {
                    ...form.companyInfo,
                    foreignEmployeeCount: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="10"
                className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">명</span>
            </div>
          </div>

          {/* 기관 유형 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기관 유형
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(institutionLabels) as InstitutionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    updateForm('companyInfo', {
                      ...form.companyInfo,
                      institutionType: type,
                    })
                  }
                  className={`p-3 border-2 rounded-lg transition text-sm ${
                    form.companyInfo.institutionType === type
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {institutionLabels[type]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900">
            회사 정보는 <strong>E-7-2 외국인 고용비율 체크</strong> 및{' '}
            <strong>E-1/E-2/E-3 기관유형 판별</strong>에 사용됩니다. 정확한 정보를
            입력하면 더 정확한 비자 매칭 결과를 받을 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
