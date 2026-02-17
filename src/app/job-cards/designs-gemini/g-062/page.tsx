'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Heart, Star, MapPin, Briefcase, Clock, ChevronLeft, ChevronRight, Bookmark, Users, TrendingUp } from 'lucide-react'
import { useState } from 'react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-062',
  name: 'Pinterest×Airbnb',
  description: 'Pinterest masonry grid + Airbnb accommodation card hybrid with image-centric design',
  category: 'creative',
  features: [
    'Masonry grid layout with varying card heights',
    'Image carousel with dots navigation',
    'Heart/save button with animation',
    'Star rating system',
    'Warm tones (Pinterest red + Airbnb coral)',
    'Save to collection/board feature',
    'Visual-first friendly design'
  ],
  colors: {
    primary: '#E60023', // Pinterest red
    secondary: '#FF5A5F', // Airbnb coral
    background: '#FFF8F5',
    card: '#FFFFFF'
  }
}

export default function G062Page() {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({})
  const [showSaveAnimation, setShowSaveAnimation] = useState<string | null>(null)

  // Toggle save job / 저장 토글
  const toggleSave = (jobId: string) => {
    const newSaved = new Set(savedJobs)
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId)
    } else {
      newSaved.add(jobId)
      setShowSaveAnimation(jobId)
      setTimeout(() => setShowSaveAnimation(null), 600)
    }
    setSavedJobs(newSaved)
  }

  // Navigate carousel / 캐러셀 탐색
  const nextImage = (jobId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [jobId]: ((prev[jobId] || 0) + 1) % totalImages
    }))
  }

  const prevImage = (jobId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [jobId]: ((prev[jobId] || 0) - 1 + totalImages) % totalImages
    }))
  }

  // Mock images (3 per job) / 목 이미지
  const getJobImages = (jobId: string) => [
    `https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&auto=format`,
    `https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop&auto=format`,
    `https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=300&fit=crop&auto=format`
  ]

  // Calculate rating / 평점 계산 (mock)
  const getRating = (jobId: string) => {
    const hash = jobId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return (4.0 + (hash % 10) / 10).toFixed(1)
  }

  const getReviewCount = (jobId: string) => {
    const hash = jobId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return 12 + (hash % 88)
  }

  return (
    <div style={{ backgroundColor: designInfo.colors.background }} className="min-h-screen">
      {/* Header / 헤더 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold" style={{ color: designInfo.colors.primary }}>
                잡차자
              </h1>
              <span className="text-sm text-gray-500">| {designInfo.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bookmark className="w-5 h-5" />
                <span className="text-sm font-medium">저장한 공고</span>
              </button>
              <button
                className="px-6 py-2 rounded-full text-white font-medium shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: designInfo.colors.secondary }}
              >
                공고 등록
              </button>
            </div>
          </div>

          {/* Filter Pills / 필터 필 */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {['전체', '인기', '신규', '추천', '마감임박', '프리미엄'].map(filter => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === '전체'
                    ? 'text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                style={filter === '전체' ? { backgroundColor: designInfo.colors.primary } : {}}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Masonry Grid / 메이슨리 그리드 */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {sampleJobsV2.map((job, index) => {
            const images = getJobImages(job.id)
            const currentIndex = currentImageIndex[job.id] || 0
            const isSaved = savedJobs.has(job.id)
            const rating = getRating(job.id)
            const reviewCount = getReviewCount(job.id)
            const dday = getDDay(job.deadline ?? job.closingDate)
            const visaColors = getVisaColor((job.matchedVisaTypes ?? job.allowedVisas ?? [])[0] || 'E-7')

            // Varying heights for masonry effect / 다양한 높이
            const heightClass = index % 3 === 0 ? 'h-[420px]' : index % 3 === 1 ? 'h-[380px]' : 'h-[400px]'

            return (
              <div
                key={job.id}
                className="break-inside-avoid mb-6 group"
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Image Carousel / 이미지 캐러셀 */}
                  <div className={`relative ${heightClass} overflow-hidden`}>
                    <img
                      src={images[currentIndex]}
                      alt={job.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay / 그라디언트 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Save Button with Animation / 저장 버튼 + 애니메이션 */}
                    <button
                      onClick={() => toggleSave(job.id)}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isSaved ? 'bg-white' : 'bg-white/90 hover:bg-white'
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-300 ${
                          isSaved ? 'fill-current' : ''
                        }`}
                        style={{ color: isSaved ? designInfo.colors.primary : '#666' }}
                      />
                      {showSaveAnimation === job.id && (
                        <div className="absolute inset-0 rounded-full animate-ping"
                             style={{ backgroundColor: designInfo.colors.primary, opacity: 0.3 }} />
                      )}
                    </button>

                    {/* Carousel Navigation / 캐러셀 내비게이션 */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(job.id, images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => nextImage(job.id, images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Carousel Dots / 캐러셀 점 */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(prev => ({ ...prev, [job.id]: idx }))}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                idx === currentIndex
                                  ? 'bg-white w-4'
                                  : 'bg-white/60 hover:bg-white/80'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Badge Overlay / 배지 오버레이 */}
                    {job.tier === 'premium' && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                           style={{ backgroundColor: designInfo.colors.secondary }}>
                        PREMIUM
                      </div>
                    )}

                    {dday && dday.includes('D-') && (
                      <div className="absolute top-4 left-4 mt-10 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg">
                        {dday}
                      </div>
                    )}
                  </div>

                  {/* Card Content / 카드 콘텐츠 */}
                  <div className="p-5">
                    {/* Rating / 평점 */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        <span className="text-sm font-bold text-gray-900">{rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({reviewCount})</span>
                      {parseFloat(rating) >= 4.5 && (
                        <div className="flex items-center gap-1 ml-auto">
                          <TrendingUp className="w-3.5 h-3.5" style={{ color: designInfo.colors.secondary }} />
                          <span className="text-xs font-medium" style={{ color: designInfo.colors.secondary }}>인기</span>
                        </div>
                      )}
                    </div>

                    {/* Title / 제목 */}
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-snug">
                      {job.title}
                    </h3>

                    {/* Company / 회사명 */}
                    <p className="text-sm text-gray-600 mb-3">{job.companyName}</p>

                    {/* Location / 위치 */}
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="line-clamp-1">{job.location.city}</span>
                    </div>

                    {/* Info Grid / 정보 그리드 */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{job.employmentType ?? job.boardType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{job.workingHours}</span>
                      </div>
                    </div>

                    {/* Salary / 급여 */}
                    <div className="mb-4">
                      <div className="text-lg font-bold" style={{ color: designInfo.colors.primary }}>
                        {formatSalary(job)}
                      </div>
                    </div>

                    {/* Visa Tags / 비자 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(job.matchedVisaTypes ?? job.allowedVisas ?? []).slice(0, 3).map(visa => {
                        const colors = getVisaColor(visa)
                        return (
                          <span
                            key={visa}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                          >
                            {visa}
                          </span>
                        )
                      })}
                      {(job.matchedVisaTypes ?? job.allowedVisas ?? []).length > 3 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{(job.matchedVisaTypes ?? job.allowedVisas ?? []).length - 3}
                        </span>
                      )}
                    </div>

                    {/* Applicants / 지원자 수 */}
                    {job.applicantCount > 0 && (
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.applicantCount}명 지원</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Save Collection CTA / 컬렉션 저장 CTA */}
        {savedJobs.size > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <button
              className="flex items-center gap-3 px-6 py-4 rounded-full text-white font-bold shadow-2xl hover:shadow-3xl transition-all"
              style={{ backgroundColor: designInfo.colors.primary }}
            >
              <Bookmark className="w-5 h-5" />
              <span>저장한 공고 {savedJobs.size}개 보기</span>
            </button>
          </div>
        )}
      </main>

      {/* Design Info Footer / 디자인 정보 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-[1600px] mx-auto px-6">
          <h3 className="font-bold text-lg mb-4" style={{ color: designInfo.colors.primary }}>
            Design: {designInfo.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{designInfo.description}</p>
          <div className="flex flex-wrap gap-2">
            {designInfo.features.map(feature => (
              <span key={feature} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
