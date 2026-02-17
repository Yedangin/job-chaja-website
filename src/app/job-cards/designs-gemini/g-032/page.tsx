'use client';

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Eye,
  Users,
  Clock,
  Briefcase,
  ChevronRight,
  Star,
  Zap
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2
} from '../_mock/job-mock-data-v2';

/**
 * 인크루트×리멤버 (Incruit×Remember) Design / 인크루트×리멤버 디자인
 *
 * Hybrid of Incruit table rows and Remember business card style.
 * 인크루트 테이블 로우와 리멤버 명함 스타일의 하이브리드.
 *
 * Key Features / 주요 특징:
 * - Compact namecard-sized cards in list / 목록형 명함 크기 카드
 * - Company logo on the left / 회사 로고 좌측 배치
 * - Hover slide/expand to reveal details / 호버 시 슬라이드 확장으로 상세 표시
 * - Clean business-like feel / 깔끔한 비즈니스 느낌
 * - Table + Business card hybrid layout / 테이블+명함 하이브리드 레이아웃
 */

export default function IncruitRememberDesignPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const designInfo = {
    id: 'g-032',
    name: '인크루트×리멤버',
    category: '미니멀',
    reference: '인크루트 + 리멤버',
    description: 'Hybrid of Incruit table rows and Remember business card style. Compact namecard-sized cards with company logo on left, expanding on hover to show details.',
    author: 'Gemini'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header / 헤더 */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {designInfo.name}
              </h1>
              <p className="text-gray-600 mb-4">{designInfo.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-500">
                  <strong>Category:</strong> {designInfo.category}
                </span>
                <span className="text-gray-500">
                  <strong>Reference:</strong> {designInfo.reference}
                </span>
                <span className="text-gray-500">
                  <strong>Author:</strong> {designInfo.author}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job List / 공고 목록 */}
      <div className="max-w-5xl mx-auto space-y-3">
        {sampleJobsV2.map((job) => {
          const isHovered = hoveredId === job.id;
          const dday = getDDay(job.closingDate);
          const salary = formatSalary(job);

          return (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredId(job.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Main Card Content / 기본 카드 콘텐츠 */}
              <div className="flex items-center p-4 gap-4">
                {/* Company Logo / 회사 로고 */}
                <div className="flex-shrink-0">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border border-gray-200">
                      <span className="text-white text-xl font-bold">
                        {job.companyInitial}
                      </span>
                    </div>
                  )}
                </div>

                {/* Main Info / 주요 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                      {job.title}
                    </h3>
                    {job.isFeatured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                    {job.isUrgent && (
                      <Zap className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.experienceRequired}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className={dday.isExpiringSoon ? 'text-red-600 font-semibold' : ''}>
                        {dday.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{job.viewCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{job.applicantCount}명 지원</span>
                    </div>
                  </div>
                </div>

                {/* Salary / 급여 */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {salary}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {job.boardType === 'PART_TIME' ? '시급' : '연봉'}
                  </div>
                </div>

                {/* Expand Icon / 확장 아이콘 */}
                <div className="flex-shrink-0">
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      isHovered ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expandable Details / 확장 상세 정보 */}
              <div
                className={`border-t border-gray-100 overflow-hidden transition-all duration-300 ${
                  isHovered ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 bg-gray-50">
                  {/* Allowed Visas / 허용 비자 */}
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-700 mb-2">
                      지원 가능 비자 / Allowed Visas
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.allowedVisas.map((visa) => {
                        const colors = getVisaColor(visa);
                        return (
                          <span
                            key={visa}
                            className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                          >
                            {visa}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Info Grid / 추가 정보 그리드 */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* Work Hours / 근무 시간 */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">근무시간</div>
                        <div className="font-medium text-gray-700">{job.workHours}</div>
                      </div>
                    </div>

                    {/* Industry / 업종 */}
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">업종</div>
                        <div className="font-medium text-gray-700">{job.industry}</div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits / 복리후생 */}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs font-semibold text-gray-700 mb-2">
                        복리후생 / Benefits
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match Score (if available) / 매칭 점수 */}
                  {job.matchScore && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">
                          매칭도 / Match Score
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                              style={{ width: `${job.matchScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            {job.matchScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Design Info Footer / 디자인 정보 푸터 */}
      <div className="max-w-5xl mx-auto mt-8 text-center text-sm text-gray-500">
        <p>Design ID: {designInfo.id} | Total Jobs: {sampleJobsV2.length}</p>
      </div>
    </div>
  );
}
