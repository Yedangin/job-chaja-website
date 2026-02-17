'use client'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Calendar, Star, Users, Bookmark, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { sampleJobsV2 as mockJobs, formatSalary, getVisaColor, getDDay } from '../_mock/job-mock-data-v2'

// Design Information / 디자인 정보
const designInfo = {
  id: 'g-069',
  name: 'Airbnb×Dribbble',
  category: 'Creative Hybrid',
  description: 'Airbnb stay card + Dribbble shot card hybrid with image carousel and heart animation',
  inspirations: ['Airbnb', 'Dribbble'],
  colors: {
    primary: '#EA4C89', // Dribbble pink
    secondary: '#FF5A5F', // Airbnb coral
    accent: '#FC642D', // Orange
    warm: '#FFB400' // Gold
  },
  features: [
    'Image carousel with navigation',
    'Double-click heart animation',
    'Star rating + like count',
    'Image-forward creative layout',
    'Auto-slide on hover',
    'Warm gradient overlays'
  ],
  typography: {
    heading: 'font-bold',
    body: 'font-normal',
    scale: 'Comfortable reading sizes'
  }
}

export default function G069Page() {
  const [selectedJob, setSelectedJob] = useState(mockJobs[0])
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set())
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoSlide, setAutoSlide] = useState(false)

  // Mock images for carousel / 캐러셀용 모킹 이미지
  const mockImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop'
  ]

  // Auto-slide on hover / 호버 시 자동 슬라이드
  useEffect(() => {
    if (!autoSlide) return
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % mockImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [autoSlide, mockImages.length])

  // Toggle like with animation / 좋아요 토글 + 애니메이션
  const toggleLike = (jobId: number) => {
    setLikedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 600)
      }
      return newSet
    })
  }

  // Toggle save / 저장 토글
  const toggleSave = (jobId: number) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      newSet.has(jobId) ? newSet.delete(jobId) : newSet.add(jobId)
      return newSet
    })
  }

  // Navigate carousel / 캐러셀 이동
  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % mockImages.length)
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + mockImages.length) % mockImages.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 p-8">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{designInfo.name}</h1>
              <p className="text-gray-600 mb-4">{designInfo.description}</p>
              <div className="flex gap-2 mb-4">
                {designInfo.inspirations.map((insp) => (
                  <span key={insp} className="px-3 py-1 bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 rounded-full text-sm font-medium">
                    {insp}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-orange-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
              {designInfo.id}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Primary</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg shadow-md" style={{ backgroundColor: designInfo.colors.primary }} />
                <span className="text-xs font-mono text-gray-600">{designInfo.colors.primary}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Secondary</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg shadow-md" style={{ backgroundColor: designInfo.colors.secondary }} />
                <span className="text-xs font-mono text-gray-600">{designInfo.colors.secondary}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Accent</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg shadow-md" style={{ backgroundColor: designInfo.colors.accent }} />
                <span className="text-xs font-mono text-gray-600">{designInfo.colors.accent}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Warm</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg shadow-md" style={{ backgroundColor: designInfo.colors.warm }} />
                <span className="text-xs font-mono text-gray-600">{designInfo.colors.warm}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Key Features:</div>
            <div className="flex flex-wrap gap-2">
              {designInfo.features.map((feature, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Job Selector / 작업 선택 */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Job to Preview:</label>
          <select
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            value={selectedJob.id}
            onChange={(e) => {
              const job = mockJobs.find(j => j.id === Number(e.target.value))
              if (job) {
                setSelectedJob(job)
                setCurrentImageIndex(0)
              }
            }}
          >
            {mockJobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Card - Airbnb×Dribbble Design / 작업 카드 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map((job) => {
            const isLiked = likedJobs.has(job.id)
            const isSaved = savedJobs.has(job.id)
            const dday = getDDay(job.deadline ?? job.closingDate)
            const visaColors = getVisaColor((job.allowedVisas ?? [])[0] ?? 'E-7')
            const rating = 4.5 + Math.random() * 0.5 // Mock rating
            const likes = Math.floor(Math.random() * 500) + 50 // Mock likes

            return (
              <div
                key={job.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                onMouseEnter={() => job.id === selectedJob.id && setAutoSlide(true)}
                onMouseLeave={() => setAutoSlide(false)}
              >
                {/* Image Carousel / 이미지 캐러셀 */}
                <div className="relative h-64 overflow-hidden">
                  {/* Images / 이미지들 */}
                  <div className="relative w-full h-full">
                    {mockImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${job.title} ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                          job.id === selectedJob.id && idx === currentImageIndex
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-110'
                        }`}
                      />
                    ))}
                    {/* Gradient Overlay / 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Carousel Controls (only for selected job) / 캐러셀 컨트롤 */}
                  {job.id === selectedJob.id && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-800" />
                      </button>

                      {/* Image Dots / 이미지 도트 */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {mockImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'w-6 bg-white'
                                : 'w-1.5 bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Top Actions / 상단 액션 */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => toggleSave(job.id)}
                      className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
                    >
                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500 text-amber-500' : 'text-gray-700'}`} />
                    </button>
                    <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110">
                      <Share2 className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {/* D-Day Badge / 디데이 배지 */}
                  {dday && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {dday}
                    </div>
                  )}

                  {/* Heart Animation Overlay / 하트 애니메이션 오버레이 */}
                  {isAnimating && job.id === selectedJob.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Heart className="w-24 h-24 fill-pink-500 text-pink-500 animate-ping" />
                    </div>
                  )}
                </div>

                {/* Content / 콘텐츠 */}
                <div className="p-5">
                  {/* Company / 회사 */}
                  <div className="text-gray-500 text-sm font-medium mb-2">{job.company}</div>

                  {/* Title / 제목 */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* Location & Type / 위치 & 유형 */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-pink-500" />
                      <span>{job.employmentType ?? job.boardType}</span>
                    </div>
                  </div>

                  {/* Salary / 급여 */}
                  <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-3 mb-3">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600">
                      {formatSalary(job)}
                    </div>
                  </div>

                  {/* Rating & Likes (Dribbble style) / 별점 & 좋아요 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="text-gray-900 font-semibold">{rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm ml-1">({Math.floor(rating * 20)} reviews)</span>
                    </div>
                    <button
                      onClick={() => toggleLike(job.id)}
                      onDoubleClick={() => {
                        toggleLike(job.id)
                        setIsAnimating(true)
                        setTimeout(() => setIsAnimating(false), 600)
                      }}
                      className="flex items-center gap-1.5 group/like"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isLiked
                            ? 'fill-pink-500 text-pink-500 scale-110'
                            : 'text-gray-400 group-hover/like:text-pink-500 group-hover/like:scale-110'
                        }`}
                      />
                      <span className={`font-semibold text-sm ${isLiked ? 'text-pink-500' : 'text-gray-500'}`}>
                        {likes + (isLiked ? 1 : 0)}
                      </span>
                    </button>
                  </div>

                  {/* Visa Badge / 비자 배지 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${visaColors.bg} ${visaColors.text} px-3 py-1.5 rounded-lg text-sm font-semibold`}>
                      {(job.allowedVisas ?? [])[0] ?? ''}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(job.postedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* CTA Button / 지원 버튼 */}
                  <button className="w-full bg-gradient-to-r from-pink-500 via-orange-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white py-3 rounded-xl font-bold transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Apply Now
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Design Notes / 디자인 노트 */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Design Notes</h2>
          <div className="prose prose-pink max-w-none">
            <p className="text-gray-600 mb-3">
              <strong>Airbnb×Dribbble Hybrid:</strong> Combines Airbnb's image-forward stay cards with Dribbble's creative shot cards.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li><strong>Image Carousel:</strong> Auto-slides on hover, manual navigation with arrows, dot indicators</li>
              <li><strong>Heart Animation:</strong> Double-click triggers large heart animation overlay (Dribbble style)</li>
              <li><strong>Star Rating + Likes:</strong> Dual social proof combining Airbnb ratings and Dribbble likes</li>
              <li><strong>Warm Gradient:</strong> Pink (#EA4C89) + Coral (#FF5A5F) creates inviting, creative atmosphere</li>
              <li><strong>Hover Effects:</strong> Card lift, carousel auto-play, action button reveals</li>
              <li><strong>Creative Focus:</strong> Large images, smooth transitions, playful interactions</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 0.6s cubic-bezier(0, 0, 0.2, 1);
        }
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 50%;
        }
        .bg-pos-100 {
          background-position: 100% 50%;
        }
      `}</style>
    </div>
  )
}
