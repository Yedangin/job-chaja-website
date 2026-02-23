/**
 * Step 4: 비자 매칭 결과 + 접수 설정
 * Step 4: Visa Matching Result + Application Settings
 * - 자동 비자 매칭 결과 표시
 * - 접수 방법 및 마감일 입력
 */

'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Calendar, Mail, Phone, MapPin, Loader } from 'lucide-react';
import type {
  FulltimeJobFormData,
  FulltimeVisaMatchingResponse,
  ApplicationMethod,
  HiringTrack,
} from './fulltime-types';
import { TRACK_INFO } from './fulltime-types';

interface StepVisaMatchingProps {
  form: FulltimeJobFormData;
  errors: Record<string, string>;
  updateForm: <K extends keyof FulltimeJobFormData>(
    key: K,
    value: FulltimeJobFormData[K]
  ) => void;
  matchResult: FulltimeVisaMatchingResponse | null;
  isMatchLoading: boolean;
  onRequestMatch: () => void;
}

export default function StepVisaMatching({
  form,
  errors,
  updateForm,
  matchResult,
  isMatchLoading,
  onRequestMatch,
}: StepVisaMatchingProps) {
  const [selectedTrack, setSelectedTrack] = useState<HiringTrack>('IMMEDIATE');

  // HiringTrack은 대문자, 응답 객체 키는 소문자 / HiringTrack is uppercase, response keys are lowercase
  const tracks: HiringTrack[] = ['IMMEDIATE', 'SPONSOR', 'TRANSITION', 'TRANSFER'];
  const trackKey = (t: HiringTrack) => t.toLowerCase() as 'immediate' | 'sponsor' | 'transition' | 'transfer';

  const trackInfo = TRACK_INFO;

  return (
    <div className="space-y-6">
      {/* 비자 매칭 결과 (자동) / Visa matching result (auto) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          📊 비자 매칭 결과 (자동 생성)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          입력한 공고 정보를 기반으로 자동 분석된 결과입니다
        </p>

        {!matchResult && !isMatchLoading && (
          <button
            type="button"
            onClick={onRequestMatch}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            비자 매칭 분석 시작
          </button>
        )}

        {isMatchLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">비자 매칭 분석 중...</span>
          </div>
        )}

        {matchResult && (
          <div>
            {/* 요약 통계 / Summary stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">적합</p>
                <p className="text-2xl font-bold text-green-600">
                  {matchResult.overallSummary.totalEligible}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">조건부</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {matchResult.overallSummary.totalConditional}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">불가</p>
                <p className="text-2xl font-bold text-gray-400">
                  {matchResult.overallSummary.totalBlocked}
                </p>
              </div>
            </div>

            {/* 트랙 탭 / Track tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {tracks.map((track) => {
                const info = trackInfo[track];
                const trackData = matchResult[trackKey(track)];
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setSelectedTrack(track)}
                    className={`shrink-0 px-4 py-3 rounded-lg font-semibold text-sm transition ${
                      selectedTrack === track
                        ? 'bg-white text-gray-900 shadow-md'
                        : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
                    }`}
                    style={{
                      borderLeft:
                        selectedTrack === track ? `4px solid ${info.color}` : 'none',
                    }}
                  >
                    <span className="mr-2">{info.emoji}</span>
                    {info.label}
                    <span className="ml-2 text-xs text-gray-500">
                      ({trackData.eligible.length})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 선택된 트랙 결과 / Selected track result */}
            <div className="bg-white rounded-lg p-6">
              {matchResult[trackKey(selectedTrack)].eligible.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-gray-900">
                      적합 ({matchResult[trackKey(selectedTrack)].eligible.length}개)
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {matchResult[trackKey(selectedTrack)].eligible.map((visa) => (
                      <div
                        key={visa.visaCode}
                        className="p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <p className="font-semibold text-green-900">
                          • {visa.visaCode} ({visa.visaName})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchResult[trackKey(selectedTrack)].conditional.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-bold text-gray-900">
                      조건부 ({matchResult[trackKey(selectedTrack)].conditional.length}개)
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {matchResult[trackKey(selectedTrack)].conditional.map((visa) => (
                      <div
                        key={visa.visaCode}
                        className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <p className="font-semibold text-yellow-900 mb-1">
                          • {visa.visaCode} ({visa.visaName})
                        </p>
                        {visa.conditions && visa.conditions.length > 0 && (
                          <ul className="text-xs text-yellow-800 ml-4">
                            {visa.conditions.map((condition, idx) => (
                              <li key={idx}>- {condition}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchResult[trackKey(selectedTrack)].blocked.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-gray-400" />
                    <h4 className="font-bold text-gray-900">
                      불가 ({matchResult[trackKey(selectedTrack)].blocked.length}개)
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {matchResult[trackKey(selectedTrack)].blocked.map((visa) => (
                      <div
                        key={visa.visaCode}
                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
                      >
                        <p className="font-semibold text-gray-700 mb-1">
                          • {visa.visaCode} ({visa.visaName})
                        </p>
                        {visa.blockReasons && visa.blockReasons.length > 0 && (
                          <ul className="text-xs text-gray-600 ml-4">
                            {visa.blockReasons.map((reason, idx) => (
                              <li key={idx}>- {reason}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 접수 설정 (수동) / Application settings (manual) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📝 접수 설정 (수동 입력)
        </h2>

        {/* 접수 방법 / Application method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            접수 방법 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'PLATFORM' as ApplicationMethod, label: '온라인 지원', icon: Mail },
              { value: 'EMAIL' as ApplicationMethod, label: '이메일', icon: Mail },
              { value: 'PHONE' as ApplicationMethod, label: '전화', icon: Phone },
              { value: 'VISIT' as ApplicationMethod, label: '방문', icon: MapPin },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateForm('applicationMethod', value)}
                className={`p-4 border-2 rounded-lg transition flex flex-col items-center gap-2 ${
                  form.applicationMethod === value
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
          {errors.applicationMethod && (
            <p className="mt-2 text-sm text-red-600">{errors.applicationMethod}</p>
          )}
        </div>

        {/* 접수 마감일 / Application deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            접수 마감일 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={form.applicationDeadline || ''}
                onChange={(e) => {
                  updateForm('applicationDeadline', e.target.value);
                  updateForm('isOpenEnded', false);
                }}
                disabled={form.isOpenEnded}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isOpenEnded}
                onChange={(e) => {
                  updateForm('isOpenEnded', e.target.checked);
                  if (e.target.checked) {
                    updateForm('applicationDeadline', null);
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">채용 시까지</span>
            </label>
          </div>
          {errors.applicationDeadline && (
            <p className="mt-2 text-sm text-red-600">{errors.applicationDeadline}</p>
          )}
        </div>
      </div>
    </div>
  );
}
