'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Building2, MapPin, Clock, TrendingUp, Users, DollarSign, Zap, ArrowUpRight } from 'lucide-react'

// 디자인 정보 / Design Info
const designInfo = {
  id: 'g-052',
  name: 'KakaoTalk×Stripe',
  category: 'interactive',
  reference: 'KakaoTalk chat bubbles + Stripe dashboard analytics hybrid',
  description: 'Chat bubble layout with salary analytics inside speech bubbles. Yellow (#FEE500) KakaoTalk style meets purple (#635BFF) Stripe dashboard metrics. Company as chat sender with avatar, hover expands to show salary bar charts and payment-style data visualization.',
  author: 'Gemini Design System'
}

export default function G052Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-purple-50 to-indigo-50 py-12 px-4">
      {/* 디자인 정보 헤더 / Design Info Header */}
      <div className="max-w-7xl mx-auto mb-8 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-400">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 text-white w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">
            {designInfo.id.split('-')[1]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-purple-600 bg-clip-text text-transparent">
                {designInfo.name}
              </h1>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold border border-purple-200">
                {designInfo.category}
              </span>
            </div>
            <p className="text-gray-600 mb-2 leading-relaxed">{designInfo.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">
                <span className="font-semibold text-gray-700">Reference:</span> {designInfo.reference}
              </span>
              <span className="text-gray-500">
                <span className="font-semibold text-gray-700">By</span> {designInfo.author}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Dashboard Metrics (Top Bar) */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-600">
          <div className="grid grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Jobs</div>
                <div className="text-2xl font-bold text-gray-900">{sampleJobsV2.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Active Applications</div>
                <div className="text-2xl font-bold text-gray-900">1,234</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Avg Salary</div>
                <div className="text-2xl font-bold text-gray-900">₩3.2M</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">New Today</div>
                <div className="text-2xl font-bold text-gray-900">8</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Bubble Job Cards / 채팅 버블 공고 카드 */}
      <div className="max-w-5xl mx-auto space-y-6">
        {sampleJobsV2.slice(0, 6).map((job) => (
          <JobChatBubble key={job.id} job={job} />
        ))}
      </div>

      {/* Footer Note */}
      <div className="max-w-5xl mx-auto mt-12 text-center">
        <p className="text-sm text-gray-500">
          💬 Hover over chat bubbles to reveal salary analytics and detailed metrics
        </p>
      </div>
    </div>
  )
}

function JobChatBubble({ job }: { job: MockJobPostingV2 }) {
  const dday = getDDay(job.closingDate)
  const salaryInfo = formatSalary(job)

  // 급여 범위를 차트용 백분율로 변환 / Convert salary range to percentage for chart
  const salaryPercentage = job.salary?.negotiable ? 75 :
    Math.min(100, ((job.salary?.min ?? job.salaryMin ?? 30000000) / 100000000) * 100)

  return (
    <div className="group">
      {/* Company Info (Chat Sender) / 회사 정보 (채팅 발신자) */}
      <div className="flex items-center gap-3 mb-2 px-2">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=635BFF&color=fff&size=128`}
          alt={job.company}
          className="w-10 h-10 rounded-full border-2 border-purple-200 shadow-md"
        />
        <div>
          <div className="font-semibold text-gray-900">{job.company}</div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            {job.location.city} {job.location.district}
          </div>
        </div>
      </div>

      {/* Chat Bubble Card / 채팅 버블 카드 */}
      <div className="flex gap-3 px-2">
        <div className="flex-1 max-w-3xl">
          <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl rounded-tl-sm shadow-lg p-6 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02]">
            {/* Main Content / 메인 콘텐츠 */}
            <div className="relative z-10">
              {/* Job Title + D-Day Badge */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1 pr-4">
                  {job.title}
                </h3>
                {dday && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-md ${
                    dday === '마감' ? 'bg-gray-800 text-white' :
                    dday === '상시모집' ? 'bg-purple-600 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {dday}
                  </span>
                )}
              </div>

              {/* Job Type + Employment Type */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                  {job.jobType}
                </span>
                <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                  {job.employmentType ?? job.boardType}
                </span>
              </div>

              {/* Visa Tags / 비자 태그 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(job.eligibleVisas ?? job.allowedVisas ?? []).slice(0, 4).map((visa) => {
                  const colors = getVisaColor(visa)
                  return (
                    <span
                      key={visa}
                      className={`px-2.5 py-1 ${colors.bg} ${colors.text} rounded-lg text-xs font-semibold shadow-sm`}
                    >
                      {visa}
                    </span>
                  )
                })}
                {(job.eligibleVisas ?? job.allowedVisas ?? []).length > 4 && (
                  <span className="px-2.5 py-1 bg-white/80 text-gray-700 rounded-lg text-xs font-semibold shadow-sm">
                    +{(job.eligibleVisas ?? job.allowedVisas ?? []).length - 4}
                  </span>
                )}
              </div>

              {/* Salary Display (Default) */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md group-hover:opacity-0 transition-opacity duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-600">Salary Range</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{salaryInfo}</div>
              </div>

              {/* Salary Analytics (Hover) - Stripe Style */}
              <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-sm font-semibold text-white">Salary Analytics</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/70" />
                </div>

                {/* Salary Bar Chart */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs text-white/90">
                    <span>Minimum</span>
                    <span className="font-bold">{(job.salary?.min ?? job.salaryMin) ? `₩${((job.salary?.min ?? job.salaryMin) / 10000).toFixed(0)}만` : 'N/A'}</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-500"
                      style={{ width: `${salaryPercentage}%` }}
                    />
                  </div>
                  {(job.salary?.max ?? job.salaryMax) && (
                    <>
                      <div className="flex items-center justify-between text-xs text-white/90 mt-2">
                        <span>Maximum</span>
                        <span className="font-bold">₩{((job.salary?.max ?? job.salaryMax) / 10000).toFixed(0)}만</span>
                      </div>
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, ((job.salary?.max ?? job.salaryMax ?? 0) / 100000000) * 100)}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs text-white/90">
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" />
                      <span>Experience</span>
                    </div>
                    <div className="font-bold text-white">{job.experience ?? job.experienceRequired ?? ''}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Building2 className="w-3 h-3" />
                      <span>Education</span>
                    </div>
                    <div className="font-bold text-white">{job.education}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Bubble Tail */}
            <div className="absolute -left-2 top-0 w-4 h-4 bg-yellow-400 transform rotate-45 rounded-sm" />
          </div>

          {/* Timestamp (Chat Style) */}
          <div className="flex items-center gap-2 mt-2 px-4 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Posted 2 hours ago</span>
            <span className="text-gray-400">•</span>
            <span>{(job.eligibleVisas ?? job.allowedVisas ?? []).length} visa types eligible</span>
          </div>
        </div>
      </div>
    </div>
  )
}
