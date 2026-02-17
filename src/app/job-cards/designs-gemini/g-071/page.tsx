'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { MapPin, Clock, Users, ChevronRight, Zap } from 'lucide-react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-071',
  name: '사람인×토스×Indeed - Minimal Category 3-Reference Combo',
  category: 'Minimal Category',
  reference: 'Saramin clean list + Toss big numbers + Indeed one-click apply',
  description: 'Saramin clean list layout + Toss-style large salary numbers (blue #3182F6) + Indeed one-click apply button that slides in from bottom (blue #2557A7). Gray palette with blue accent, minimalist text-focused layout.',
  author: 'Gemini'
}

export default function G071Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{designInfo.name}</h1>
              <p className="mt-2 text-sm text-gray-600">{designInfo.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded">ID: {designInfo.id}</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{designInfo.category}</span>
                <span>Reference: {designInfo.reference}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards Container / 공고 카드 컨테이너 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-3">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Job Card Component / 공고 카드 컴포넌트
function JobCard({ job }: { job: MockJobPostingV2 }) {
  const dday = getDDay(job.closingDate)
  const salaryText = formatSalary(job)

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Company Logo / 왼쪽: 회사 로고 */}
          <div className="flex-shrink-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-14 h-14 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <span className="text-lg font-semibold text-gray-600">
                  {job.companyInitial}
                </span>
              </div>
            )}
          </div>

          {/* Center: Job Info / 중앙: 공고 정보 */}
          <div className="flex-1 min-w-0">
            {/* Title + Badges / 제목 + 배지 */}
            <div className="flex items-start gap-2 mb-2">
              {job.isUrgent && (
                <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded">
                  <Zap className="w-3 h-3" />
                  긴급
                </span>
              )}
              <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
            </div>

            {/* Company + Location / 회사명 + 지역 */}
            <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
              <span className="font-medium">{job.company}</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
            </div>

            {/* Toss-style Big Salary / Toss 스타일 큰 급여 */}
            <div className="mb-3">
              <div className="text-2xl font-bold text-[#3182F6]">
                {salaryText}
              </div>
            </div>

            {/* Meta Info Row / 메타 정보 행 */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {job.workHours}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                지원 {job.applicantCount}
              </span>
              {dday && (
                <span className="font-medium text-gray-700">
                  {dday}
                </span>
              )}
            </div>

            {/* Visa Badges / 비자 배지 */}
            {job.allowedVisas.length > 0 && (
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                {job.allowedVisas.slice(0, 4).map((visa) => {
                  const colors = getVisaColor(visa)
                  return (
                    <span
                      key={visa}
                      className={`px-2 py-0.5 text-xs font-medium rounded ${colors.bg} ${colors.text}`}
                    >
                      {visa}
                    </span>
                  )
                })}
                {job.allowedVisas.length > 4 && (
                  <span className="px-2 py-0.5 text-xs font-medium text-gray-500">
                    +{job.allowedVisas.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Tier Badge / 오른쪽: 등급 배지 */}
          {job.tierType === 'PREMIUM' && (
            <div className="flex-shrink-0">
              <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded">
                프리미엄
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Indeed-style One-click Apply Button (slides in on hover) / Indeed 스타일 원클릭 지원 버튼 (호버시 슬라이드) */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out">
        <button className="w-full bg-[#2557A7] hover:bg-[#1d4682] text-white py-3 px-6 flex items-center justify-center gap-2 font-medium text-sm transition-colors">
          <span>바로 지원하기</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
