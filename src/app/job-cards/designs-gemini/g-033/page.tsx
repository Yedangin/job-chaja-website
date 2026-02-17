'use client';

import React, { useState } from 'react';
import { Building2, MapPin, Clock, Briefcase, TrendingUp, Eye, Users } from 'lucide-react';
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2';

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-033',
  name: '토스×Indeed',
  category: '미니멀',
  reference: '토스 + Indeed',
  description: 'Toss의 큰 숫자 디스플레이 + Indeed의 간편 원클릭 지원. 급여가 히어로 요소(큰 폰트). 호버 시 하단에서 파란색 "원클릭 지원" 버튼이 슬라이드 인. 깔끔한 흰색 카드, 블루 CTA (#2557A7 Indeed 블루).',
  author: 'Gemini'
};

export default function G033Page() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header / 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {designInfo.name}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  {designInfo.category}
                </span>
                {designInfo.reference} • {designInfo.author}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-500">Design ID</div>
              <div className="text-2xl font-bold text-blue-600">{designInfo.id}</div>
            </div>
          </div>
          <p className="mt-4 text-gray-700 leading-relaxed max-w-3xl">
            {designInfo.description}
          </p>
        </div>
      </div>

      {/* Job Cards Grid / 채용공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isHovered={hoveredId === job.id}
              onHover={() => setHoveredId(job.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Job Card Component / 채용공고 카드 컴포넌트
function JobCard({
  job,
  isHovered,
  onHover,
  onLeave
}: {
  job: MockJobPostingV2;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Urgent & Featured Badges / 긴급채용 & 추천 배지 */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {job.isUrgent && (
          <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
            긴급채용
          </span>
        )}
        {job.isFeatured && (
          <span className="px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-xs font-bold rounded-full shadow-lg">
            ⭐ 추천
          </span>
        )}
      </div>

      {/* Match Score / 매칭 점수 */}
      {job.matchScore && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            매칭 {job.matchScore}%
          </div>
        </div>
      )}

      {/* Card Content / 카드 콘텐츠 */}
      <div className="p-6">
        {/* Company Logo & Name / 회사 로고 & 이름 */}
        <div className="flex items-center gap-3 mb-4">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {job.companyInitial}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-sm">
              {job.company}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
        </div>

        {/* Job Title / 채용 제목 */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 min-h-[3.5rem]">
          {job.title}
        </h2>

        {/* Salary Hero Display (Toss-style large number) / 급여 히어로 디스플레이 (토스 스타일 큰 숫자) */}
        <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="text-xs font-medium text-blue-700 mb-2">급여</div>
          <div className="text-4xl font-black text-blue-900 leading-tight">
            {salary}
          </div>
          {job.hourlyWage && (
            <div className="text-sm text-blue-600 mt-2 font-medium">
              시급 {job.hourlyWage.toLocaleString()}원
            </div>
          )}
        </div>

        {/* Work Info / 근무 정보 */}
        <div className="space-y-2.5 mb-5">
          {/* Board Type & Experience / 고용형태 & 경력 */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{job.boardType}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{job.experienceRequired}</span>
          </div>

          {/* Work Hours / 근무시간 */}
          {job.workHours && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{job.workHours}</span>
            </div>
          )}
        </div>

        {/* Visa Tags / 비자 태그 */}
        <div className="flex flex-wrap gap-2 mb-5">
          {job.allowedVisas.slice(0, 3).map((visa) => {
            const colors = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text} border`}
              >
                {visa}
              </span>
            );
          })}
          {job.allowedVisas.length > 3 && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
              +{job.allowedVisas.length - 3}
            </span>
          )}
        </div>

        {/* Benefits (if any) / 복리후생 */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.benefits.slice(0, 3).map((benefit, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-200 font-medium"
              >
                {benefit}
              </span>
            ))}
          </div>
        )}

        {/* Stats / 통계 */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5" />
            <span>{job.applicantCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Eye className="w-3.5 h-3.5" />
            <span>{job.viewCount}</span>
          </div>
          <div className="ml-auto">
            {dDay !== null && (
              <span
                className={`text-xs font-bold ${
                  dDay <= 3 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                D-{dDay}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* One-Click Apply Button (Slides in on hover, Indeed-style) / 원클릭 지원 버튼 (호버 시 슬라이드 인, Indeed 스타일) */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <button
          className="w-full bg-[#2557A7] hover:bg-[#1e4a8f] text-white font-bold py-4 px-6 transition-colors duration-200 flex items-center justify-center gap-2 shadow-2xl"
          onClick={(e) => {
            e.stopPropagation();
            alert(`${job.company} - ${job.title}에 원클릭 지원!`);
          }}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-lg">원클릭 지원</span>
        </button>
      </div>
    </div>
  );
}
