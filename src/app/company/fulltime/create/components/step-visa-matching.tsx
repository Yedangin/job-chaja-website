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
import { useFulltimeCopy } from '../copy';

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
  const copy = useFulltimeCopy();
  const [selectedTrack, setSelectedTrack] = useState<HiringTrack>('IMMEDIATE');

  // HiringTrack은 대문자, 응답 객체 키는 소문자 / HiringTrack is uppercase, response keys are lowercase
  const tracks: HiringTrack[] = ['IMMEDIATE', 'SPONSOR', 'TRANSITION', 'TRANSFER'];
  const trackKey = (t: HiringTrack) => t.toLowerCase() as 'immediate' | 'sponsor' | 'transition' | 'transfer';

  const trackLabels: Record<HiringTrack, string> = {
    IMMEDIATE: copy.immediate, SPONSOR: copy.sponsor, TRANSITION: copy.transition, TRANSFER: copy.transfer,
  };
  const applicationOptions = [
    { value: 'PLATFORM' as ApplicationMethod, label: copy.online, icon: Mail },
    { value: 'EMAIL' as ApplicationMethod, label: copy.email, icon: Mail },
    { value: 'PHONE' as ApplicationMethod, label: copy.phone, icon: Phone },
    { value: 'VISIT' as ApplicationMethod, label: copy.visit, icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* 비자 매칭 결과 (자동) / Visa matching result (auto) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {copy.visaResult}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {copy.visaResultHelp}
        </p>

        {!matchResult && !isMatchLoading && (
          <button
            type="button"
            onClick={onRequestMatch}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {copy.startAnalysis}
          </button>
        )}

        {isMatchLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">{copy.analyzing}</span>
          </div>
        )}

        {matchResult && (
          <div>
            {/* 요약 통계 / Summary stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">{copy.eligible}</p>
                <p className="text-2xl font-bold text-[#0066FF]">
                  {matchResult.overallSummary.totalEligible}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">{copy.conditional}</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {matchResult.overallSummary.totalConditional}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">{copy.blocked}</p>
                <p className="text-2xl font-bold text-gray-400">
                  {matchResult.overallSummary.totalBlocked}
                </p>
              </div>
            </div>

            {/* 트랙 탭 / Track tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {tracks.map((track) => {
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
                      borderLeft: selectedTrack === track ? '4px solid #0066FF' : 'none',
                    }}
                  >
                    {trackLabels[track]}
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
                    <CheckCircle className="w-5 h-5 text-[#0066FF]" />
                    <h4 className="font-bold text-gray-900">
                      {copy.eligible} ({matchResult[trackKey(selectedTrack)].eligible.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {matchResult[trackKey(selectedTrack)].eligible.map((visa) => (
                      <div
                        key={visa.visaCode}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <p className="font-semibold text-blue-950">
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
                      {copy.conditional} ({matchResult[trackKey(selectedTrack)].conditional.length})
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
                      {copy.blocked} ({matchResult[trackKey(selectedTrack)].blocked.length})
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
          {copy.applicationSettings}
        </h2>

        {/* 접수 방법 / Application method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {copy.applicationMethod} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {applicationOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => updateForm('applicationMethod', value)}
              className={`p-4 border-2 rounded-lg transition flex flex-col items-center gap-2 ${
                  form.applicationMethod === value
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
              aria-pressed={form.applicationMethod === value}
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
            {copy.deadline} <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
              <span className="text-sm text-gray-700">{copy.openEnded}</span>
            </label>
          </div>
          {errors.applicationDeadline && (
            <p className="mt-2 text-sm text-red-600">{errors.applicationDeadline}</p>
          )}
        </div>

        {/* 담당자 정보 / Contact information */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {copy.contact}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {copy.contactName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => updateForm('contactName', e.target.value)}
                placeholder={copy.contactNamePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.contactName && (
                <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {copy.phone} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => updateForm('contactPhone', e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.contactPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {copy.emailOptional}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => updateForm('contactEmail', e.target.value)}
                  placeholder="hr@company.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
