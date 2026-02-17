'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, MessageCircle, MapPin, Clock, Briefcase } from 'lucide-react'
import { useState } from 'react'

// 디자인 정보 / Design information
const designInfo = {
  id: 'g-064',
  name: 'Spotify×카카오톡 (Spotify×KakaoTalk)',
  category: 'Creative',
  description: 'Spotify music player + KakaoTalk chat bubble hybrid design with playback controls and chat aesthetics',
  inspiration: 'Music streaming meets messaging app',
  colors: {
    spotifyGreen: '#1DB954',
    kakaoYellow: '#FEE500',
    spotifyBlack: '#191414',
    chatBg: '#F5F5F5'
  }
}

export default function SpotifyKakaoJobCards() {
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set())

  const togglePlay = (jobId: number) => {
    setPlayingId(playingId === jobId ? null : jobId)
  }

  const toggleLike = (jobId: number) => {
    setLikedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  // Calculate progress percentage based on days remaining
  const getProgressPercentage = (job: MockJobPostingV2) => {
    const dday = getDDay(job)
    if (!dday) return 0
    const match = dday.match(/D-(\d+)/)
    if (!match) return 100
    const days = parseInt(match[1])
    return Math.max(0, Math.min(100, ((30 - days) / 30) * 100))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#191414] to-gray-900 py-12 px-4">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-[#1DB954] to-[#FEE500] p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Play className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white mb-2">{designInfo.name}</h1>
              <p className="text-white/90 text-lg">{designInfo.description}</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/60"></div>
              Category: {designInfo.category}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/60"></div>
              Design ID: {designInfo.id}
            </span>
          </div>
        </div>
      </div>

      {/* Job Cards Grid / 채용공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => {
          const isPlaying = playingId === job.id
          const isHovered = hoveredId === job.id
          const isLiked = likedJobs.has(job.id)
          const dday = getDDay(job)
          const progress = getProgressPercentage(job)
          const visaColors = getVisaColor((job.matchedVisaTypes ?? job.allowedVisas ?? [])[0])

          return (
            <div
              key={job.id}
              className="group relative"
              onMouseEnter={() => setHoveredId(job.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Chat Bubble Container / 채팅 버블 컨테이너 */}
              <div className={`
                relative bg-[#F5F5F5] rounded-3xl p-6 shadow-lg
                transition-all duration-500
                ${isHovered ? 'scale-105 shadow-2xl' : ''}
                ${isPlaying ? 'ring-4 ring-[#1DB954] ring-opacity-50' : ''}
              `}>
                {/* Now Playing Badge / 재생 중 배지 */}
                {isPlaying && (
                  <div className="absolute -top-3 -right-3 bg-[#1DB954] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-pulse">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    NOW PLAYING
                  </div>
                )}

                {/* Album Art / 앨범 아트 */}
                <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1DB954] to-[#FEE500] aspect-square shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Briefcase className="w-24 h-24 text-white/30" />
                  </div>

                  {/* Chat Bubble Overlay / 채팅 버블 오버레이 */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-lg">
                      <p className="text-xs text-gray-500 mb-1">새로운 채용공고가 도착했어요! 👋</p>
                      <p className="font-bold text-gray-900 text-sm line-clamp-2">{job.title}</p>
                    </div>
                  </div>

                  {/* D-Day Corner Badge / D-Day 코너 배지 */}
                  {dday && (
                    <div className="absolute top-3 right-3 bg-[#FEE500] text-gray-900 px-3 py-1.5 rounded-full text-xs font-black shadow-lg">
                      {dday}
                    </div>
                  )}
                </div>

                {/* Song Info (Company Info) / 노래 정보 (회사 정보) */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{job.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{job.company}</p>

                  {/* Meta Info / 메타 정보 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {job.workHours}
                    </span>
                  </div>
                </div>

                {/* Playback Progress Bar / 재생 진행 바 */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>마감까지</span>
                    <span>{dday || '마감'}</span>
                  </div>
                  <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        isPlaying ? 'bg-[#1DB954]' : 'bg-gray-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Player Controls / 플레이어 컨트롤 */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => toggleLike(job.id)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#1DB954] text-[#1DB954]' : 'text-gray-600'}`} />
                  </button>

                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <SkipBack className="w-4 h-4 text-gray-600" />
                    </button>

                    <button
                      onClick={() => togglePlay(job.id)}
                      className="p-3 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-full transition-all shadow-lg hover:scale-110"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </button>

                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <SkipForward className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <Volume2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Salary Chat Bubble / 급여 채팅 버블 */}
                <div className={`
                  bg-[#FEE500] rounded-2xl rounded-tr-none p-4 shadow-md
                  transition-all duration-500
                  ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}
                `}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-700 font-semibold">급여 정보</p>
                    <MessageCircle className="w-4 h-4 text-gray-700" />
                  </div>
                  <p className="text-xl font-black text-gray-900">{formatSalary(job)}</p>

                  {/* Visa Badge / 비자 배지 */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {(job.matchedVisaTypes ?? job.allowedVisas ?? []).slice(0, 3).map((visa, idx) => {
                      const colors = getVisaColor(visa)
                      return (
                        <span
                          key={idx}
                          className={`${colors.bg} ${colors.text} px-2 py-1 rounded-full text-xs font-bold`}
                        >
                          {visa}
                        </span>
                      )
                    })}
                    {(job.matchedVisaTypes ?? job.allowedVisas ?? []).length > 3 && (
                      <span className="bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-bold">
                        +{(job.matchedVisaTypes ?? job.allowedVisas ?? []).length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Expansion / 호버 확장 영역 */}
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/95 to-[#FEE500]/95 rounded-3xl p-6 flex flex-col justify-center items-center text-white backdrop-blur-sm transition-all duration-500">
                    <Play className="w-16 h-16 mb-4 opacity-80" />
                    <p className="text-center font-bold text-lg mb-2">지금 바로 지원하세요!</p>
                    <p className="text-center text-sm text-white/80 mb-4">
                      {(job.matchedVisaTypes ?? job.allowedVisas ?? []).length}개 비자 타입 가능
                    </p>
                    <div className="flex gap-3">
                      <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
                        지원하기
                      </button>
                      <button className="bg-gray-900/50 text-white px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
                        상세보기
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shadow Effect / 그림자 효과 */}
              {isPlaying && (
                <div className="absolute inset-0 bg-[#1DB954]/20 blur-xl rounded-3xl -z-10 animate-pulse"></div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer / 푸터 */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
          <p className="text-white/60 text-sm">
            🎵 음악처럼 즐기는 채용공고 | 💬 채팅처럼 편안한 지원 | ✨ Spotify × KakaoTalk Hybrid Design
          </p>
        </div>
      </div>
    </div>
  )
}
