'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Building2, MapPin, Clock, TrendingUp, Sparkles, Plus, Share2, Bookmark, ChevronRight } from 'lucide-react'
import { useState } from 'react'

// Design Info: g-065 MD3×Stripe
// 디자인 정보: g-065 MD3×Stripe
const designInfo = {
  id: 'g-065',
  name: 'MD3×Stripe',
  category: 'platform',
  description: 'Google Material Design 3 + Stripe dashboard hybrid with tonal surfaces, FAB, and data tooltips',
  descriptionKo: 'Material Design 3와 Stripe 대시보드 하이브리드 - 토널 서피스, FAB, 데이터 툴팁',
  features: [
    'MD3 tonal surface elevation system',
    'Stripe-style data tooltips',
    'Expandable FAB (Floating Action Button)',
    'Clean data visualization cards',
    'Muted tonal colors with purple accent',
    'Professional platform-dashboard hybrid'
  ]
}

export default function G065Page() {
  const [expandedFab, setExpandedFab] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {designInfo.name}
              </h1>
              <p className="text-gray-600">{designInfo.descriptionKo}</p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {designInfo.category}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {designInfo.features.map((feature, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs border border-purple-100"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Job Cards Grid / 채용 카드 그리드 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => {
          const dDay = getDDay(job.deadline ?? job.closingDate)
          const salary = formatSalary(job)
          const visaColors = getVisaColor((job.allowedVisas ?? [])[0] ?? 'E-7')

          return (
            <div
              key={job.id}
              className="group relative"
              onMouseEnter={() => setActiveTooltip(job.id)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {/* Main Card - MD3 Surface / 메인 카드 - MD3 서피스 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                {/* Premium Badge / 프리미엄 배지 */}
                {job.isPremium && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Premium
                    </div>
                  </div>
                )}

                {/* Company Logo / 회사 로고 */}
                <div className="relative bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-8">
                  <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-md flex items-center justify-center border border-purple-100">
                    <Building2 className="w-10 h-10 text-purple-600" />
                  </div>

                  {/* D-Day Chip / 마감일 칩 */}
                  {dDay && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-700 rounded-full text-xs font-bold shadow-sm border border-purple-200">
                        {dDay}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content / 콘텐츠 */}
                <div className="p-6">
                  {/* Company Name / 회사명 */}
                  <div className="text-sm text-purple-600 font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {job.company}
                  </div>

                  {/* Job Title / 채용 제목 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* Visa Badge / 비자 배지 */}
                  <div className="mb-4">
                    <span className={`${visaColors.bg} ${visaColors.text} px-3 py-1.5 rounded-lg text-xs font-bold border ${visaColors.text.replace('text-', 'border-')}`}>
                      {(job.allowedVisas ?? [])[0] ?? ''}
                    </span>
                  </div>

                  {/* Info Grid - Stripe Style / 정보 그리드 - Stripe 스타일 */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{job.location}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{job.employmentType ?? job.boardType}</span>
                    </div>
                  </div>

                  {/* Salary - Data Viz Style / 급여 - 데이터 시각화 스타일 */}
                  <div className="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-purple-600 font-semibold mb-1">
                          연봉 정보
                        </div>
                        <div className="text-lg font-bold text-purple-900">
                          {salary}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* CTA Button - MD3 Filled Button / CTA 버튼 - MD3 filled 버튼 */}
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md group/btn">
                    <span>지원하기</span>
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Data Tooltip - Stripe Style / 데이터 툴팁 - Stripe 스타일 */}
              {activeTooltip === job.id && (
                <div className="absolute -top-2 -right-2 bg-white rounded-xl shadow-2xl border border-purple-200 p-4 w-64 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="text-xs text-gray-500 mb-2">통계 데이터</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">조회수</span>
                      <span className="text-sm font-bold text-gray-900">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">지원자</span>
                      <span className="text-sm font-bold text-purple-600">32명</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">경쟁률</span>
                      <span className="text-sm font-bold text-indigo-600">8:1</span>
                    </div>
                  </div>

                  {/* Mini Chart Placeholder / 미니 차트 플레이스홀더 */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-end gap-1 h-12">
                      {[40, 65, 45, 80, 60, 90, 70].map((height, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-2">
                      최근 7일 조회수 추이
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Floating Action Button (FAB) - MD3 / 플로팅 액션 버튼 - MD3 */}
      <div
        className="fixed bottom-8 right-8 z-30"
        onMouseEnter={() => setExpandedFab(true)}
        onMouseLeave={() => setExpandedFab(false)}
      >
        {expandedFab && (
          <div className="absolute bottom-16 right-0 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button className="flex items-center gap-3 bg-white text-gray-700 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:bg-gray-50">
              <Share2 className="w-5 h-5" />
              <span className="font-semibold text-sm">공유</span>
            </button>
            <button className="flex items-center gap-3 bg-white text-gray-700 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:bg-gray-50">
              <Bookmark className="w-5 h-5" />
              <span className="font-semibold text-sm">저장</span>
            </button>
          </div>
        )}

        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-purple-300 transition-all flex items-center justify-center hover:scale-110 active:scale-95">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Design Attribution / 디자인 출처 */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-sm text-gray-500">
        Design {designInfo.id}: {designInfo.name} - {designInfo.category} category
      </div>
    </div>
  )
}
