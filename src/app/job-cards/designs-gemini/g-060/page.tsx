'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Briefcase, MapPin, Users, TrendingUp, Award, Star, DollarSign, BarChart3, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-060',
  name: 'Glassdoor×LinkedIn',
  category: 'unique',
  reference: 'Glassdoor + LinkedIn professional networking + salary insights',
  description: 'Professional hybrid combining Glassdoor company insights with LinkedIn networking features. Includes salary benchmark comparison chart, profile matching percentage, company review snippets, and data-driven trust-building elements in corporate blue/green tones.',
  author: 'Claude'
}

export default function G060Page() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [showSalaryChart, setShowSalaryChart] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A66C2] to-[#0CAA41] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{designInfo.name}</h1>
                  <p className="text-sm text-slate-500">Design ID: {designInfo.id}</p>
                </div>
              </div>
              <p className="text-slate-600 max-w-3xl leading-relaxed">{designInfo.description}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#0A66C2] to-[#0CAA41] text-white text-sm font-semibold shadow-lg">
                {designInfo.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleJobsV2.map((job, index) => {
          const dday = getDDay(job.closingDate)
          const salary = formatSalary(job)
          const isHovered = hoveredCard === index
          const showChart = showSalaryChart === index

          // Mock data for Glassdoor/LinkedIn features
          const profileMatch = 75 + (index * 3)
          const connectionCount = 12 + (index * 4)
          const companyRating = 4.2 + (index * 0.1)
          const reviewCount = 234 + (index * 50)
          const salaryPercentile = 65 + (index * 5)
          const marketAvgSalary = job.salaryMin ? job.salaryMin * 1.15 : 0

          return (
            <div
              key={job.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-slate-200 hover:border-[#0A66C2]"
              onMouseEnter={() => {
                setHoveredCard(index)
                setShowSalaryChart(index)
              }}
              onMouseLeave={() => {
                setHoveredCard(null)
                setShowSalaryChart(null)
              }}
            >
              {/* LinkedIn Blue Accent Bar */}
              <div className={`h-1.5 bg-gradient-to-r from-[#0A66C2] to-[#0CAA41] transition-all duration-500 ${isHovered ? 'h-2' : ''}`} />

              <div className="p-6">
                {/* Header: Company + Profile Match */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Company Logo */}
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=635BFF&color=fff&size=128`}
                        alt={job.company}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0CAA41] rounded-full flex items-center justify-center border-2 border-white">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-1 truncate group-hover:text-[#0A66C2] transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-base font-semibold text-slate-700 mb-2">{job.company}</p>

                      {/* Company Rating (Glassdoor-style) */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#0CAA41] text-[#0CAA41]" />
                          <span className="text-sm font-bold text-slate-900">{companyRating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-slate-500">|</span>
                        <span className="text-xs text-slate-500">{reviewCount.toLocaleString()} reviews</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Match Badge (LinkedIn-style) */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-[#0A66C2] flex items-center justify-center bg-white shadow-lg">
                        <span className="text-lg font-bold text-[#0A66C2]">{profileMatch}%</span>
                      </div>
                      <div className={`absolute inset-0 rounded-full border-4 border-[#0CAA41] transition-all duration-700 ${isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-0'}`} style={{ clipPath: `polygon(0 0, 100% 0, 100% ${100 - profileMatch}%, 0 ${100 - profileMatch}%)` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">Profile Match</span>
                  </div>
                </div>

                {/* Location + Employment Type */}
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>{job.employmentType ?? job.boardType}</span>
                  </div>
                </div>

                {/* Salary Section with Benchmark */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 mb-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#0A66C2]" />
                      <span className="text-lg font-bold text-slate-900">{salary}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 mb-0.5">Your Salary Percentile</div>
                      <div className="text-sm font-bold text-[#0CAA41]">{salaryPercentile}th</div>
                    </div>
                  </div>

                  {/* Salary Comparison Chart (shows on hover) */}
                  <div className={`transition-all duration-500 overflow-hidden ${showChart ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600">Your Offer</span>
                          <span className="font-bold text-[#0A66C2]">{salary}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#0A66C2] to-[#0CAA41] rounded-full transition-all duration-700" style={{ width: `${salaryPercentile}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600">Market Average</span>
                          <span className="font-bold text-slate-500">₩{marketAvgSalary.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400 rounded-full" style={{ width: '70%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Review Snippet (Glassdoor-style) */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 mb-4 border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0CAA41] flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#0CAA41] mb-1">Top Review</div>
                      <p className="text-sm text-slate-700 italic line-clamp-2">
                        "Great work-life balance and supportive team culture. Management really cares about employee growth and development."
                      </p>
                      <div className="text-xs text-slate-500 mt-1">- Current Employee, 2 months ago</div>
                    </div>
                  </div>
                </div>

                {/* Visa Types */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.visaTypes.slice(0, 3).map((visa, idx) => {
                    const colors = getVisaColor(visa)
                    return (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all duration-300 ${colors.bg} ${colors.text} ${isHovered ? 'scale-105' : ''}`}
                      >
                        {visa}
                      </span>
                    )
                  })}
                  {job.visaTypes.length > 3 && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border-2 border-slate-200">
                      +{job.visaTypes.length - 3}
                    </span>
                  )}
                </div>

                {/* LinkedIn-style Connection Info */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0A66C2]" />
                    <span className="text-sm text-slate-600">
                      <span className="font-bold text-[#0A66C2]">{connectionCount}</span> connections work here
                    </span>
                  </div>

                  {dday && (
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                      dday.includes('오늘')
                        ? 'bg-red-100 text-red-700 border-2 border-red-300'
                        : dday.includes('D-')
                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                        : 'bg-slate-100 text-slate-600 border-2 border-slate-200'
                    } ${isHovered ? 'scale-110' : ''}`}>
                      {dday}
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#0A66C2] to-[#0CAA41] text-white font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Apply Now
                  </button>
                  <button className="px-4 py-3 rounded-xl bg-white border-2 border-[#0A66C2] text-[#0A66C2] font-semibold text-sm hover:bg-[#0A66C2] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                    <Award className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>

              {/* Hover Effect: Professional Shine */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none`} style={{ transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)', transition: 'transform 1s ease-in-out' }} />
            </div>
          )
        })}
      </div>

      {/* Design Info Footer */}
      <div className="max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 className="w-6 h-6 text-[#0A66C2]" />
          <h2 className="text-xl font-bold text-slate-900">Design Information</h2>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-700 mb-1">Reference</dt>
            <dd className="text-slate-600">{designInfo.reference}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700 mb-1">Author</dt>
            <dd className="text-slate-600">{designInfo.author}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
