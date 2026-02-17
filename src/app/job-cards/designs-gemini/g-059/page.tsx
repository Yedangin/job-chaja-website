'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Clock, MapPin, Calendar, Zap, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { useState } from 'react'

// Design metadata / 디자인 메타데이터
export const designInfo = {
  id: 'g-059',
  name: 'Albamon×Alba',
  category: 'unique',
  reference: 'Part-time job platforms (Albamon, Alba Heaven)',
  description: 'D-Day countdown as hero element, hourly wage emphasized, red urgency + bright colors, quick apply, calendar-like schedule display. Designed for part-time/hourly work with fast, direct UI.',
  author: 'Claude'
}

export default function G059AlbamonAlbaDesign() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-8 px-4">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{designInfo.name}</h1>
              <p className="text-sm text-gray-600">{designInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards Grid / 공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => {
          const dday = getDDay(job.closingDate)
          const isHovered = hoveredId === job.id
          const salary = formatSalary(job)
          const visaColors = (job.matchedVisaCodes ?? job.allowedVisas ?? []).slice(0, 3).map(v => getVisaColor(v))

          return (
            <div
              key={job.id}
              className="group relative"
              onMouseEnter={() => setHoveredId(job.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`
                bg-white rounded-2xl overflow-hidden shadow-md
                transition-all duration-300 border-2
                ${isHovered ? 'shadow-2xl -translate-y-2 border-red-500' : 'shadow-md border-gray-100'}
              `}>
                {/* D-DAY HERO SECTION - Prominent countdown / D-DAY 히어로 섹션 - 눈에 띄는 카운트다운 */}
                <div className={`
                  relative bg-gradient-to-br from-red-500 via-red-600 to-orange-600 p-6
                  ${isHovered ? 'from-red-600 via-red-700 to-orange-700' : ''}
                  transition-all duration-300
                `}>
                  {/* D-Day Badge - LARGE / D-Day 배지 - 대형 */}
                  {dday && (
                    <div className={`
                      absolute top-4 right-4 bg-yellow-400 text-red-900 px-4 py-2
                      rounded-xl font-black text-xl shadow-lg
                      ${isHovered ? 'animate-pulse scale-110' : ''}
                      transition-transform duration-300
                    `}>
                      {dday}
                    </div>
                  )}

                  {/* Company Logo / 회사 로고 */}
                  <div className="mb-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=fff&color=dc2626&size=80&bold=true`}
                      alt={job.company}
                      className="w-16 h-16 rounded-xl bg-white p-2 shadow-lg"
                    />
                  </div>

                  {/* Company Name / 회사명 */}
                  <div className="text-white/90 text-sm font-semibold mb-1">
                    {job.company}
                  </div>

                  {/* Job Title / 공고 제목 */}
                  <h3 className="text-white text-xl font-bold mb-3 line-clamp-2 leading-tight">
                    {job.title}
                  </h3>

                  {/* HOURLY WAGE - EMPHASIZED / 시급 강조 */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white/80 text-xs font-medium mb-1">시급 / Hourly Wage</div>
                        <div className="text-white text-2xl font-black tracking-tight">
                          {salary}
                        </div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-yellow-300" />
                    </div>
                  </div>
                </div>

                {/* Job Details / 공고 상세 */}
                <div className="p-5">
                  {/* Location & Schedule / 위치 및 스케줄 */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="line-clamp-1">{job.location.district} {job.location.addressDetail || ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span>{job.workSchedule.type === 'FIXED' ? '고정 근무' : '자유 근무'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <span>{job.workSchedule.workDays?.join(', ') || '협의'}</span>
                    </div>
                  </div>

                  {/* Visa Tags - Colorful / 비자 태그 - 컬러풀 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(job.matchedVisaCodes ?? job.allowedVisas ?? []).slice(0, 4).map((visa, idx) => {
                      const colors = getVisaColor(visa)
                      return (
                        <span
                          key={visa}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${colors.bg} ${colors.text}`}
                        >
                          {visa}
                        </span>
                      )
                    })}
                    {(job.matchedVisaCodes ?? job.allowedVisas ?? []).length > 4 && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600">
                        +{(job.matchedVisaCodes ?? job.allowedVisas ?? []).length - 4}
                      </span>
                    )}
                  </div>

                  {/* Quick Stats / 빠른 통계 */}
                  <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">경력</div>
                      <div className="text-sm font-bold text-gray-900">{job.requirements?.experienceLevel ?? job.experienceRequired ?? ''}</div>
                    </div>
                    <div className="text-center border-x border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">학력</div>
                      <div className="text-sm font-bold text-gray-900">{job.requirements?.educationLevel ?? ''}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">모집</div>
                      <div className="text-sm font-bold text-red-600">{job.recruitCount}명</div>
                    </div>
                  </div>

                  {/* Quick Apply Button - Prominent / 빠른 지원 버튼 - 눈에 띄게 */}
                  <button className={`
                    w-full py-3 rounded-xl font-bold text-base
                    transition-all duration-300 flex items-center justify-center gap-2
                    ${isHovered
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                    }
                  `}>
                    <Zap className="w-5 h-5" fill="currentColor" />
                    빠른 지원하기
                    <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                  </button>

                  {/* Hover: Hourly Wage Comparison / 호버: 시급 비교 차트 */}
                  {isHovered && (
                    <div className="mt-4 p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-bold text-orange-900">시급 비교</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">최저임금 (2026)</span>
                          <span className="font-semibold text-gray-900">₩10,030</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-700 font-bold">이 공고</span>
                          <span className="font-black text-orange-700">{salary}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">업계 평균</span>
                          <span className="font-semibold text-gray-900">₩12,000</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Urgency Indicator - Bottom / 긴급 표시 - 하단 */}
                {job.isUrgent && (
                  <div className="bg-gradient-to-r from-red-100 to-orange-100 px-4 py-2 flex items-center justify-center gap-2 border-t border-red-200">
                    <Users className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-900">급구! 즉시 근무 가능자 우대</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Design Info Footer / 디자인 정보 푸터 */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-sm text-gray-500">
        <p>Design: {designInfo.id} &quot;{designInfo.name}&quot; — {designInfo.category}</p>
        <p className="text-xs mt-1">{designInfo.reference}</p>
      </div>
    </div>
  )
}
