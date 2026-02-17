'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { MapPin, Users, Eye, Clock, Flame } from 'lucide-react'
import { useState } from 'react'

// 이모지 비 애니메이션 컴포넌트 / Emoji rain animation component
const EmojiRain = () => {
  const emojis = ['🍕', '🔥', '💼', '✨', '🎉', '🌟', '💰', '🎯']
  const randomEmojis = Array.from({ length: 12 }, () => emojis[Math.floor(Math.random() * emojis.length)])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {randomEmojis.map((emoji, i) => (
        <div
          key={i}
          className="absolute text-2xl animate-emoji-fall opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${1.5 + Math.random() * 1}s`
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  )
}

export default function G037Page() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-8">
      <style jsx global>{`
        @keyframes emoji-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(300px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-emoji-fall {
          animation: emoji-fall 2s ease-in forwards;
        }
      `}</style>

      {/* 헤더 / Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black text-gray-900 mb-2" style={{ fontFamily: 'system-ui, -apple-system' }}>
                우리 동네 일자리 🧡
              </h1>
              <p className="text-xl text-gray-600 font-bold">따뜻한 동네, 따끈한 채용!</p>
            </div>
            <div className="text-right">
              <div className="text-orange-600 text-3xl font-black mb-1">
                {sampleJobsV2.length}개
              </div>
              <div className="text-gray-600 font-bold">당신 근처의 기회</div>
            </div>
          </div>
        </div>
      </div>

      {/* 공고 카드 그리드 / Job cards grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => {
          const dday = getDDay(job.closingDate)
          const distance = (Math.random() * 5 + 0.5).toFixed(1) // 랜덤 거리 생성 / Random distance
          const isHovered = hoveredCard === job.id

          return (
            <div
              key={job.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-3 border-orange-200 hover:border-orange-500 hover:-translate-y-2"
              onMouseEnter={() => setHoveredCard(job.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* 이모지 비 효과 / Emoji rain effect */}
              {isHovered && <EmojiRain />}

              {/* 업종 이미지 / Industry image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500">
                {job.industryImage && (
                  <img
                    src={job.industryImage}
                    alt={job.industry}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* 상단 배지들 / Top badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {job.tierType === 'PREMIUM' && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black rounded-full shadow-lg border-2 border-white">
                      ⭐ 동네 맛집급
                    </span>
                  )}
                  {job.isUrgent && (
                    <span className="px-3 py-1.5 bg-red-600 text-white text-xs font-black rounded-full shadow-lg border-2 border-white animate-pulse flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      급구!
                    </span>
                  )}
                  {job.isFeatured && (
                    <span className="px-3 py-1.5 bg-yellow-400 text-gray-900 text-xs font-black rounded-full shadow-lg border-2 border-white">
                      ✨ 추천
                    </span>
                  )}
                </div>

                {/* 마감일 / Closing date */}
                {dday && (
                  <div className="absolute top-3 right-3">
                    <div className={`px-4 py-2 rounded-full font-black text-sm shadow-lg border-2 border-white ${
                      dday === '마감' ? 'bg-gray-800 text-white' :
                      dday === '상시모집' ? 'bg-green-500 text-white' :
                      'bg-white text-orange-600'
                    }`}>
                      {dday}
                    </div>
                  </div>
                )}

                {/* 업종 카테고리 / Industry category */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-gray-900 font-black text-sm rounded-full shadow-lg">
                    {job.industry}
                  </span>
                </div>
              </div>

              {/* 카드 콘텐츠 / Card content */}
              <div className="p-6">
                {/* 회사 정보 / Company info */}
                <div className="flex items-center gap-3 mb-4">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-black text-lg border-2 border-orange-200">
                      {job.companyInitial}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 text-sm truncate">
                      {job.company}
                    </h3>
                    <div className="flex items-center gap-1 text-orange-600 text-xs font-bold">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* 공고 제목 / Job title */}
                <h2 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                  {job.title}
                </h2>

                {/* 거리 표시 (호버 시) / Distance indicator (on hover) */}
                <div className={`mb-3 transition-all duration-300 ${
                  isHovered ? 'opacity-100 max-h-8' : 'opacity-0 max-h-0'
                }`}>
                  <div className="px-3 py-1.5 bg-orange-100 border-2 border-orange-300 rounded-full inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-black text-orange-600">
                      집에서 {distance}km
                    </span>
                  </div>
                </div>

                {/* 급여 정보 / Salary info */}
                <div className="mb-4 p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl">
                  <div className="text-white text-2xl font-black">
                    {formatSalary(job)}
                  </div>
                  {job.boardType === 'PART_TIME' && job.workHours && (
                    <div className="text-orange-100 text-xs font-bold mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.workHours}
                    </div>
                  )}
                </div>

                {/* 비자 태그 / Visa tags */}
                {job.allowedVisas.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {job.allowedVisas.slice(0, 3).map((visa) => {
                        const colors = getVisaColor(visa)
                        return (
                          <span
                            key={visa}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg border-2 ${colors.bg} ${colors.text} border-current`}
                          >
                            {visa}
                          </span>
                        )
                      })}
                      {job.allowedVisas.length > 3 && (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 border-2 border-gray-300">
                          +{job.allowedVisas.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 복리후생 / Benefits */}
                {job.benefits.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {job.benefits.slice(0, 3).map((benefit, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}

                {/* 하단 통계 / Bottom stats */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-orange-100">
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1 font-bold">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>{job.applicantCount}</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold">
                      <Eye className="w-4 h-4 text-orange-500" />
                      <span>{job.viewCount}</span>
                    </div>
                  </div>
                  {job.matchScore && (
                    <div className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-black rounded-full border border-orange-300">
                      매칭 {job.matchScore}%
                    </div>
                  )}
                </div>
              </div>

              {/* 호버 오버레이 / Hover overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent pointer-events-none transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`} />
            </div>
          )
        })}
      </div>

      {/* 푸터 / Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="inline-block bg-white rounded-2xl px-8 py-4 shadow-lg border-2 border-orange-200">
          <p className="text-gray-600 font-bold">
            🧡 따뜻한 우리 동네에서 시작하는 새로운 기회
          </p>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Design: g-037 (Baemin×Karrot)
          </p>
        </div>
      </div>
    </div>
  )
}
