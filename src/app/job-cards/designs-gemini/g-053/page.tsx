'use client'

import { useState, useRef, useEffect } from 'react'
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-053',
  name: 'TikTok×Instagram',
  category: 'interactive',
  reference: 'TikTok reels vertical feed + Instagram stories',
  description: 'Fullscreen vertical cards with snap scroll, Instagram story circles, TikTok-style interaction buttons, double-tap to like animation',
  author: 'Gemini'
}

export default function G053Page() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set())
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)
  const [heartAnimationPosition, setHeartAnimationPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const lastTapRef = useRef<number>(0)

  // Featured companies for story circles / 스토리 서클용 추천 기업
  const featuredCompanies = Array.from(new Set(sampleJobsV2.slice(0, 8).map(job => job.company)))

  // Handle vertical scroll snap / 세로 스크롤 스냅 처리
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop
        const cardHeight = window.innerHeight
        const index = Math.round(scrollTop / cardHeight)
        setCurrentIndex(index)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Double tap to like / 더블 탭으로 좋아요
  const handleDoubleTap = (e: React.MouseEvent, jobId: number) => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected / 더블 탭 감지
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setHeartAnimationPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setShowHeartAnimation(true)
      setLikedJobs(prev => new Set(prev).add(jobId))
      setTimeout(() => setShowHeartAnimation(false), 1000)
    }

    lastTapRef.current = now
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

  const toggleSave = (jobId: number) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header with design info / 디자인 정보 헤더 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-xl font-bold">{designInfo.name}</h1>
              <p className="text-xs text-gray-300">{designInfo.category} • {designInfo.id}</p>
            </div>
            <div className="text-xs text-right">
              <p className="text-gray-400">Job Cards</p>
              <p className="text-gray-500">{sampleJobsV2.length} posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instagram-style story circles / 인스타그램 스타일 스토리 서클 */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
          {featuredCompanies.map((company, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 min-w-fit">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-0.5">
                <div className="w-full h-full rounded-full bg-black p-0.5">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {company.substring(0, 2)}
                  </div>
                </div>
              </div>
              <span className="text-white text-xs max-w-[64px] truncate">{company}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical snap scroll container / 세로 스냅 스크롤 컨테이너 */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sampleJobsV2.map((job, index) => {
          const dday = getDDay(job.closingDate)
          const salary = formatSalary(job)
          const isLiked = likedJobs.has(job.id)
          const isSaved = savedJobs.has(job.id)

          return (
            <div
              key={job.id}
              className="relative h-screen w-full snap-start flex items-center justify-center overflow-hidden"
              onClick={(e) => handleDoubleTap(e, job.id)}
            >
              {/* Background image with gradient overlay / 그라디언트 오버레이가 있는 배경 이미지 */}
              <div className="absolute inset-0">
                <img
                  src={job.imageUrl}
                  alt={job.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20" />
              </div>

              {/* Double tap heart animation / 더블 탭 하트 애니메이션 */}
              {showHeartAnimation && index === currentIndex && (
                <div
                  className="absolute z-30 pointer-events-none animate-ping"
                  style={{
                    left: heartAnimationPosition.x,
                    top: heartAnimationPosition.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Heart className="w-24 h-24 text-pink-500 fill-pink-500 opacity-80" />
                </div>
              )}

              {/* TikTok-style side buttons / 틱톡 스타일 사이드 버튼 */}
              <div className="absolute right-4 bottom-32 z-20 flex flex-col gap-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(job.id)
                  }}
                  className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isLiked ? 'bg-pink-500' : 'bg-white/20 backdrop-blur-sm'
                  }`}>
                    <Heart className={`w-6 h-6 ${isLiked ? 'text-white fill-white' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {Math.floor(Math.random() * 500) + 100}
                  </span>
                </button>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {Math.floor(Math.random() * 50) + 10}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSave(job.id)
                  }}
                  className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isSaved ? 'bg-yellow-500' : 'bg-white/20 backdrop-blur-sm'
                  }`}>
                    <Bookmark className={`w-6 h-6 ${isSaved ? 'text-white fill-white' : 'text-white'}`} />
                  </div>
                  <span className="text-white text-xs font-semibold">Save</span>
                </button>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">Share</span>
                </button>
              </div>

              {/* Content / 콘텐츠 */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-8">
                <div className="max-w-2xl mx-auto space-y-4">
                  {/* Company info / 기업 정보 */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {job.company.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-sm">{job.company}</h3>
                      <p className="text-gray-300 text-xs">{job.location}</p>
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity">
                      Follow
                    </button>
                  </div>

                  {/* Job title / 공고 제목 */}
                  <div>
                    <h2 className="text-white text-2xl font-bold leading-tight mb-2">
                      {job.title}
                    </h2>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {job.description ?? job.title}
                    </p>
                  </div>

                  {/* Quick info / 빠른 정보 */}
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-white text-xs font-semibold">{dday || '상시'}</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <span className="text-white text-xs font-semibold">{salary}</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-white text-xs font-semibold">{job.employmentType ?? job.boardType}</span>
                    </div>
                  </div>

                  {/* Visa tags / 비자 태그 */}
                  <div className="flex flex-wrap gap-2">
                    {job.visaTypes.slice(0, 4).map((visa, idx) => {
                      const colors = getVisaColor(visa)
                      return (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30"
                        >
                          {visa}
                        </span>
                      )
                    })}
                    {job.visaTypes.length > 4 && (
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                        +{job.visaTypes.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Apply button / 지원하기 버튼 */}
                  <button className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-[1.02]">
                    Apply Now • 지원하기
                  </button>
                </div>
              </div>

              {/* Scroll indicator / 스크롤 인디케이터 */}
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20">
                <div className="flex flex-col gap-1">
                  {sampleJobsV2.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation()
                        scrollToIndex(idx)
                      }}
                      className={`w-1 h-1 rounded-full transition-all ${
                        idx === currentIndex
                          ? 'bg-white h-6'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation arrows / 네비게이션 화살표 */}
      {currentIndex > 0 && (
        <button
          onClick={() => scrollToIndex(currentIndex - 1)}
          className="fixed top-1/2 left-4 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {currentIndex < sampleJobsV2.length - 1 && (
        <button
          onClick={() => scrollToIndex(currentIndex + 1)}
          className="fixed top-1/2 right-4 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
