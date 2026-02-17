'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Briefcase, MapPin, Clock, Globe2, Users, Building2, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-046',
  name: 'iOS×MD3 Hybrid',
  category: 'platform',
  reference: 'Apple iOS + Google Material Design 3',
  description: 'Apple iOS와 Google Material Design 3를 결합한 하이브리드 시스템 UI. iOS의 둥근 모서리와 MD3의 tonal surface를 조합하여 깔끔한 시스템 UI 느낌 제공.',
  author: 'JobChaJa Design System'
}

type TabType = 'active' | 'closed' | 'featured'

export default function G046Page() {
  const [activeTab, setActiveTab] = useState<TabType>('active')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Filter jobs by status / 상태별 공고 필터링
  const filterJobs = (tab: TabType) => {
    const now = new Date()
    switch (tab) {
      case 'active':
        return sampleJobsV2.filter(job => new Date(job.closingDate) > now)
      case 'closed':
        return sampleJobsV2.filter(job => new Date(job.closingDate) <= now)
      case 'featured':
        return sampleJobsV2.filter(job => job.isPremium)
      default:
        return sampleJobsV2
    }
  }

  const displayJobs = filterJobs(activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header with design info / 디자인 정보 헤더 */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 bg-gradient-to-r from-gray-900 to-blue-600 text-white text-xs font-semibold rounded-full">
                  {designInfo.id.toUpperCase()}
                </div>
                <div className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {designInfo.category}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {designInfo.name}
              </h1>
              <p className="text-sm text-gray-600 mb-1">
                {designInfo.description}
              </p>
              <p className="text-xs text-gray-500">
                Reference: {designInfo.reference}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* iOS-style Segment Control Tabs / iOS 스타일 세그먼트 컨트롤 탭 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-100/80 backdrop-blur-sm rounded-[13px] p-1 inline-flex gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-[11px] text-sm font-semibold transition-all duration-300 ${
              activeTab === 'active'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            채용중
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`px-6 py-2.5 rounded-[11px] text-sm font-semibold transition-all duration-300 ${
              activeTab === 'closed'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            마감
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-6 py-2.5 rounded-[11px] text-sm font-semibold transition-all duration-300 ${
              activeTab === 'featured'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            추천
          </button>
        </div>
      </div>

      {/* Job Cards Grid / 채용 공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayJobs.map((job, index) => {
            const dday = getDDay(job.closingDate)
            const salaryInfo = formatSalary(job)
            const isHovered = hoveredCard === index

            return (
              <div
                key={job.id}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative bg-white rounded-[20px] overflow-hidden transition-all duration-500 ${
                  isHovered
                    ? 'shadow-2xl shadow-blue-500/20 -translate-y-2 scale-[1.02]'
                    : 'shadow-md hover:shadow-xl'
                }`}
              >
                {/* MD3 Tonal Surface Overlay / MD3 톤 표면 오버레이 */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-transparent transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`} />

                {/* Premium Badge / 프리미엄 배지 */}
                {job.isPremium && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      PREMIUM
                    </div>
                  </div>
                )}

                {/* Company Logo / 기업 로고 */}
                <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`} />
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="w-20 h-20 object-contain relative z-10"
                  />
                </div>

                {/* Card Content / 카드 콘텐츠 */}
                <div className="p-5 relative">
                  {/* Company & D-Day / 기업명 & 마감일 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {job.companyName}
                      </span>
                    </div>
                    {dday && (
                      <div className={`px-2.5 py-1 rounded-[8px] text-xs font-bold ${
                        dday.includes('D-')
                          ? 'bg-red-100 text-red-700'
                          : dday === '마감'
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {dday}
                      </div>
                    )}
                  </div>

                  {/* Job Title / 공고 제목 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 leading-snug min-h-[3.5rem]">
                    {job.title}
                  </h3>

                  {/* Key Info Grid / 주요 정보 그리드 */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-[10px] bg-blue-50 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{job.employmentType ?? job.boardType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-[10px] bg-green-50 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-[10px] bg-purple-50 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700 font-semibold">{salaryInfo}</span>
                    </div>
                  </div>

                  {/* Visa Tags / 비자 태그 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Globe2 className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-500">지원 가능 비자</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.visaTypes.slice(0, 4).map((visa, idx) => {
                        const colors = getVisaColor(visa)
                        return (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-[8px]`}
                          >
                            {visa}
                          </span>
                        )
                      })}
                      {job.visaTypes.length > 4 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-[8px]">
                          +{job.visaTypes.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* iOS-style Action Button / iOS 스타일 액션 버튼 */}
                  <button
                    className={`w-full py-3 rounded-[12px] font-semibold text-sm transition-all duration-300 ${
                      isHovered
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isHovered ? '지원하기' : '자세히 보기'}
                  </button>
                </div>

                {/* MD3 State Layer / MD3 상태 레이어 */}
                <div className={`absolute inset-0 border-2 border-blue-500 rounded-[20px] transition-opacity duration-300 pointer-events-none ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>
            )
          })}
        </div>

        {/* Empty State / 빈 상태 */}
        {displayJobs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {activeTab === 'active' && '채용중인 공고가 없습니다'}
              {activeTab === 'closed' && '마감된 공고가 없습니다'}
              {activeTab === 'featured' && '추천 공고가 없습니다'}
            </p>
          </div>
        )}
      </div>

      {/* MD3 Floating Action Button (FAB) / MD3 플로팅 액션 버튼 */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group z-50">
        <Users className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
          5
        </div>
      </button>

      {/* Background Decoration / 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
