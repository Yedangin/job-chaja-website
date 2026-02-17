'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Clock, MapPin, Users, TrendingUp, Sparkles, Heart, ThumbsUp, Flame, Zap } from 'lucide-react'
import { useState } from 'react'

export default function G041Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEE500] via-[#FFE500] to-[#FFED4E] p-8">
      {/* Header - Chat Style */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-gray-800">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-[#FEE500] rounded-2xl flex items-center justify-center text-2xl font-black border-2 border-gray-800">
              💼
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">잡차자 채용톡</h1>
              <p className="text-sm text-gray-600 font-bold">친구 {sampleJobsV2.length}명과 채팅 중</p>
            </div>
          </div>
          <p className="text-gray-700 font-semibold">💬 마음에 드는 채용 공고에 톡 보내보세요!</p>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => (
          <JobChatCard key={job.id} job={job} />
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border-4 border-gray-800 inline-block">
          <p className="text-gray-800 font-black text-lg">🎉 Design: g-041 | 카카오톡×배민 Chat Style</p>
        </div>
      </div>
    </div>
  )
}

function JobChatCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false)
  const dday = getDDay(job.closingDate)
  const salary = formatSalary(job)

  // Floating emojis for hover effect
  const emojis = ['😍', '👍', '🔥', '💪']

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Emoji Reactions on Hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {emojis.map((emoji, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-float-up"
              style={{
                left: `${20 + i * 20}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '2s'
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      {/* Chat Bubble Container */}
      <div className="relative">
        {/* Main Chat Bubble */}
        <div
          className={`bg-white rounded-3xl border-4 border-gray-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 overflow-hidden ${
            isHovered ? 'scale-105 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : ''
          }`}
        >
          {/* Chat Bubble Tail */}
          <div className="absolute -left-3 top-8 w-6 h-6 bg-white border-l-4 border-b-4 border-gray-800 transform rotate-45"></div>

          {/* Header with Avatar & Company */}
          <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b-4 border-gray-800">
            <div className="flex items-start gap-4">
              {/* Company Avatar (Circle) */}
              <div className="flex-shrink-0">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-14 h-14 rounded-full border-4 border-gray-800 bg-white object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border-4 border-gray-800 bg-gradient-to-br from-[#00C7AE] to-[#00A896] flex items-center justify-center text-white text-xl font-black">
                    {job.companyInitial}
                  </div>
                )}
              </div>

              {/* Company Name & Time */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-black text-gray-900 text-lg truncate">{job.company}</h3>
                  {job.isFeatured && (
                    <div className="flex-shrink-0 bg-[#FEE500] border-2 border-gray-800 rounded-full px-2 py-1 text-xs font-black">
                      ⭐
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                  <Clock className="w-3 h-3" />
                  <span>{job.postedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Title (Main Message) */}
          <div className="p-5">
            <div className="bg-[#FEE500] rounded-2xl border-3 border-gray-800 p-4 mb-4 relative">
              <h2 className="font-black text-gray-900 text-lg leading-tight mb-2">
                {job.title}
              </h2>

              {/* Location & Industry */}
              <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-700">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </div>
                <span>|</span>
                <span>{job.industry}</span>
              </div>

              {/* Urgent Badge */}
              {job.isUrgent && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-gray-800 animate-bounce">
                  🔥 급구
                </div>
              )}
            </div>

            {/* Salary Reply Bubble */}
            <div className="bg-white border-3 border-gray-800 rounded-2xl p-3 mb-3 inline-block">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span className="font-black text-lg text-[#00C7AE]">{salary}</span>
              </div>
            </div>

            {/* Visa Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.allowedVisas.slice(0, 3).map((visa) => {
                const colors = getVisaColor(visa)
                return (
                  <span
                    key={visa}
                    className={`${colors.bg} ${colors.text} text-xs font-black px-2.5 py-1 rounded-full border-2 border-gray-800`}
                  >
                    {visa}
                  </span>
                )
              })}
              {job.allowedVisas.length > 3 && (
                <span className="bg-gray-200 text-gray-700 text-xs font-black px-2.5 py-1 rounded-full border-2 border-gray-800">
                  +{job.allowedVisas.length - 3}
                </span>
              )}
            </div>

            {/* Expanded Details on Hover */}
            <div
              className={`transition-all duration-500 overflow-hidden ${
                isHovered ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t-3 border-dashed border-gray-300 pt-3 mt-3">
                {/* Benefits as Emoticon Badges */}
                {job.benefits.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {job.benefits.slice(0, 4).map((benefit, i) => (
                        <div
                          key={i}
                          className="bg-[#FFE5E5] border-2 border-gray-800 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-700"
                        >
                          {getBenefitEmoji(benefit)} {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-blue-50 border-2 border-gray-800 rounded-xl p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-gray-600">지원자</span>
                    </div>
                    <div className="font-black text-lg text-blue-600">{job.applicantCount}</div>
                  </div>
                  <div className="bg-purple-50 border-2 border-gray-800 rounded-xl p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-gray-600">조회</span>
                    </div>
                    <div className="font-black text-lg text-purple-600">{job.viewCount}</div>
                  </div>
                </div>

                {/* Match Score */}
                {job.matchScore && job.matchScore > 70 && (
                  <div className="bg-gradient-to-r from-[#00C7AE] to-[#00A896] text-white border-2 border-gray-800 rounded-xl p-2 text-center mb-3">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-black text-sm">매칭도 {job.matchScore}%</span>
                    </div>
                  </div>
                )}

                {/* Fun Korean CTA */}
                <div className="text-center text-sm font-black text-gray-600 mb-2">
                  💬 이 회사 궁금해? 지금 톡 보내!
                </div>
              </div>
            </div>
          </div>

          {/* Footer with D-Day and CTA */}
          <div className="border-t-4 border-gray-800 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              {/* D-Day */}
              <div className={`text-sm font-black px-3 py-1.5 rounded-full border-2 border-gray-800 ${
                dday === '마감' || dday === '상시모집'
                  ? 'bg-gray-300 text-gray-700'
                  : dday && parseInt(dday.replace('D-', '')) <= 3
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#00C7AE] text-white'
              }`}>
                {dday || 'D-day'}
              </div>

              {/* CTA Button */}
              <button className="flex-1 bg-[#FEE500] hover:bg-[#FFD000] border-3 border-gray-800 text-gray-900 font-black py-2.5 px-4 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                지원 ㄱㄱ 👉
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(0.5);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// Helper function for benefit emojis
function getBenefitEmoji(benefit: string): string {
  const lower = benefit.toLowerCase()
  if (lower.includes('식대') || lower.includes('식사')) return '🍱'
  if (lower.includes('교통') || lower.includes('차량')) return '🚗'
  if (lower.includes('4대보험') || lower.includes('보험')) return '🏥'
  if (lower.includes('연차') || lower.includes('휴가')) return '🏖️'
  if (lower.includes('숙소') || lower.includes('기숙사')) return '🏠'
  if (lower.includes('보너스') || lower.includes('인센티브')) return '💰'
  if (lower.includes('교육') || lower.includes('성장')) return '📚'
  if (lower.includes('복지')) return '🎁'
  return '✨'
}
