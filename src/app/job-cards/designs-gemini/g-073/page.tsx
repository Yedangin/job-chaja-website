'use client'

import React from 'react'
import { MapPin, Clock, Users, MessageCircle, Heart, TrendingUp } from 'lucide-react'
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'

// 디자인 정보 / Design Info
const designInfo = {
  id: 'g-073',
  name: '배민×당근×카카오톡',
  category: 'creative',
  reference: 'Baemin + Karrot + KakaoTalk',
  description: 'Korea\'s 3 iconic apps fusion: Baemin playful emoji + Karrot distance + KakaoTalk chat bubbles',
  author: 'Gemini'
}

export default function G073Page() {
  const [favoriteIds, setFavoriteIds] = React.useState<Set<number>>(new Set())
  const [hoveredId, setHoveredId] = React.useState<number | null>(null)

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      {/* 헤더 / Header */}
      <div className="bg-white border-b border-orange-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <span className="text-4xl">🍱</span>
                {designInfo.name}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                  {designInfo.category.toUpperCase()}
                </span>
                <span className="text-sm">{designInfo.description}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Design ID</div>
              <div className="text-2xl font-black text-orange-600">{designInfo.id}</div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full">
              🍔 Baemin Playful
            </span>
            <span className="px-3 py-1.5 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full">
              🥕 Karrot Local
            </span>
            <span className="px-3 py-1.5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">
              💬 KakaoTalk Chat
            </span>
          </div>
        </div>
      </div>

      {/* 컨텐츠 / Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => {
            const dday = getDDay(job.closingDate)
            const salary = formatSalary(job)
            const isFavorite = favoriteIds.has(job.id)
            const isHovered = hoveredId === job.id
            const distance = `${(Math.random() * 5 + 0.5).toFixed(1)}km`

            return (
              <div
                key={job.id}
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300"
              >
                {/* 배민 스타일 배지들 / Baemin-style Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {job.isUrgent && (
                    <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                      🔥 긴급채용
                    </span>
                  )}
                  {job.isFeatured && (
                    <span className="px-3 py-1.5 bg-yellow-400 text-gray-900 text-xs font-black rounded-full shadow-lg flex items-center gap-1">
                      ⭐ 추천
                    </span>
                  )}
                  {job.matchScore && job.matchScore >= 85 && (
                    <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1">
                      ✨ {job.matchScore}%
                    </span>
                  )}
                </div>

                {/* 당근 스타일 거리 표시 / Karrot-style Distance */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold rounded-full shadow-md z-10 transition-all duration-300 ${
                    isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-90'
                  }`}
                >
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {distance}
                </div>

                {/* 회사 이미지 / Company Image */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-yellow-100 overflow-hidden">
                  {job.industryImage ? (
                    <img
                      src={job.industryImage}
                      alt={job.company}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl group-hover:scale-125 transition-transform duration-300">
                        {job.companyInitial || '🏢'}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* 메인 컨텐츠 / Main Content */}
                <div className="p-6">
                  {/* 회사명 / Company Name */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center font-black text-white shadow-md">
                      {job.companyInitial || '🏢'}
                    </div>
                    <div className="font-bold text-gray-900">{job.company}</div>
                  </div>

                  {/* 직무명 / Job Title */}
                  <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* 급여 정보 / Salary - Baemin Style */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200">
                    <div className="text-2xl font-black text-orange-600 flex items-center gap-2">
                      💰 {salary}
                    </div>
                  </div>

                  {/* 근무 조건 / Work Conditions */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span>{job.workHours || '주 5일 근무'}</span>
                    </div>
                  </div>

                  {/* 비자 정보 / Visa Info */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {job.allowedVisas.slice(0, 3).map((visa, idx) => {
                        const colors = getVisaColor(visa)
                        return (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 ${colors.bg} ${colors.text} text-xs font-bold rounded-full`}
                          >
                            {visa}
                          </span>
                        )
                      })}
                      {job.allowedVisas.length > 3 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                          +{job.allowedVisas.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 카카오톡 스타일 채팅 버블 / KakaoTalk-style Chat Bubble */}
                  <div
                    className={`mb-4 transition-all duration-300 ${
                      isHovered ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="bg-yellow-400 text-gray-900 p-3 rounded-2xl rounded-tl-none shadow-md">
                      <div className="text-xs font-bold mb-1 flex items-center gap-1">
                        💬 채용 담당자
                      </div>
                      <div className="text-sm font-medium">
                        {job.benefits?.[0] || '지금 바로 지원하세요!'} 빠른 답변 드리겠습니다! 😊
                      </div>
                    </div>
                  </div>

                  {/* 통계 / Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {job.applicantCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {job.viewCount}
                      </span>
                    </div>
                    {dday && (
                      <span className={`font-bold ${
                        dday.includes('오늘') ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {dday}
                      </span>
                    )}
                  </div>

                  {/* 액션 버튼 / Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(job.id)}
                      className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isFavorite
                          ? 'bg-orange-500 border-orange-500 text-white scale-110'
                          : 'bg-white border-orange-200 text-gray-400 hover:border-orange-400 hover:text-orange-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-black py-3 rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>1초 만에 지원하기</span>
                    </button>
                  </div>
                </div>

                {/* 배민 스타일 이모지 효과 / Baemin-style Emoji Effect */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce">🎉</div>
                  <div className="absolute top-1/3 right-1/4 text-3xl animate-pulse">✨</div>
                  <div className="absolute bottom-1/3 left-1/3 text-3xl animate-bounce delay-100">🚀</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 푸터 정보 / Footer Info */}
        <div className="mt-12 p-8 bg-white rounded-2xl border-2 border-orange-100 shadow-md">
          <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">🎨</span>
            Design Concept
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="font-black text-orange-600 mb-2 flex items-center gap-2">
                🍔 Baemin Elements
              </div>
              <ul className="space-y-1 text-gray-600">
                <li>• Playful emoji badges</li>
                <li>• Bouncing animations</li>
                <li>• Bold orange accent</li>
                <li>• Fun hover effects</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="font-black text-yellow-600 mb-2 flex items-center gap-2">
                🥕 Karrot Elements
              </div>
              <ul className="space-y-1 text-gray-600">
                <li>• Distance indicator</li>
                <li>• Local community feel</li>
                <li>• Warm yellow tones</li>
                <li>• Location-based info</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="font-black text-gray-700 mb-2 flex items-center gap-2">
                💬 KakaoTalk Elements
              </div>
              <ul className="space-y-1 text-gray-600">
                <li>• Chat bubble design</li>
                <li>• Message interaction</li>
                <li>• Friendly tone</li>
                <li>• Instant communication</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-black text-orange-600">🎯 Reference:</span> {designInfo.reference}
              <br />
              <span className="font-black text-yellow-600">💡 Key Innovation:</span> Combining Korea's most beloved app UX patterns - Baemin's playful energy, Karrot's local trust, and KakaoTalk's instant communication into a single cohesive job card experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
