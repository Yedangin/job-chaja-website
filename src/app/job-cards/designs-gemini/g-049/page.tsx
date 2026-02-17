'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { MapPin, Heart, Star, ChevronLeft, ChevronRight, Clock, Users, Briefcase } from 'lucide-react'
import { useState } from 'react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-049',
  name: 'Airbnb×당근',
  category: 'interactive',
  reference: 'Airbnb accommodation card + Karrot local marketplace hybrid',
  description: 'Image carousel with star ratings, distance display, warm color tones (#FF5A5F Airbnb + #FF6F0F Karrot orange), heart wishlist button, local neighborhood feel with distance indicators. Rounded, friendly, warm design with hover carousel slides.',
  author: 'Gemini Design System'
}

export default function G049Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12 px-4">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-orange-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{designInfo.name}</h1>
          <p className="text-gray-600 mb-4">{designInfo.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
              {designInfo.category}
            </span>
            <span className="text-gray-500">Design ID: {designInfo.id}</span>
            <span className="text-gray-500">Reference: {designInfo.reference}</span>
          </div>
        </div>
      </div>

      {/* Job Cards Grid / 채용공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleJobsV2.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: MockJobPostingV2 }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const dday = getDDay(job.closingDate)
  const salary = formatSalary(job)

  // Mock distance (simulate local neighborhood feel) / 거리 모의 데이터
  const distance = `${(Math.random() * 5 + 0.5).toFixed(1)}km`

  // Mock rating (simulate Airbnb-style ratings) / 평점 모의 데이터
  const rating = (4.2 + Math.random() * 0.7).toFixed(1)
  const reviewCount = Math.floor(Math.random() * 150 + 20)

  // Create image carousel (3 images: gradient, logo if available, gradient variant) / 이미지 캐러셀 생성
  const images = [
    job.industryImage || generateGradient(job.companyName, 0),
    job.logo || generateGradient(job.companyName, 1),
    generateGradient(job.companyName, 2)
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel Section / 이미지 캐러셀 섹션 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
        {/* Carousel Images / 캐러셀 이미지 */}
        <div className="relative w-full h-full">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-500 ${
                idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {img.startsWith('http') ? (
                <img
                  src={img}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
                  style={{ background: img }}
                >
                  {job.companyName.charAt(0)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Carousel Navigation (visible on hover) / 캐러셀 네비게이션 */}
        {isHovered && images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg transition-all z-10"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg transition-all z-10"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Indicators / 이미지 인디케이터 */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex
                    ? 'bg-white w-4'
                    : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Wishlist Heart Button (Airbnb style) / 위시리스트 하트 버튼 */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all z-10"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-gray-700'
            }`}
          />
        </button>

        {/* D-Day Badge / D-Day 배지 */}
        {dday && dday !== '상시모집' && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg z-10">
            {dday}
          </div>
        )}

        {/* Distance Overlay (appears on hover - Karrot style) / 거리 오버레이 */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-10">
            <div className="flex items-center gap-1.5 text-white text-sm font-medium">
              <MapPin className="w-4 h-4" />
              <span>{distance}</span>
              <span className="text-white/80">· {job.location}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section / 콘텐츠 섹션 */}
      <div className="p-4">
        {/* Rating & Location / 평점 & 위치 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            <span className="font-semibold text-gray-900 text-sm">{rating}</span>
            <span className="text-gray-500 text-xs">({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-medium">{distance}</span>
          </div>
        </div>

        {/* Job Title (Airbnb accommodation style) / 채용공고 제목 */}
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 leading-tight">
          {job.title}
        </h3>

        {/* Company Name (local trust indicator) / 회사명 */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {job.companyName}
        </p>

        {/* Job Details / 채용 상세 정보 */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Briefcase className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            <span className="truncate">{job.employmentType ?? job.boardType}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Users className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            <span className="truncate">{job.experienceRequired}</span>
          </div>
          {dday && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
              <span className="truncate">{job.closingDate}</span>
            </div>
          )}
        </div>

        {/* Visa Tags (Karrot neighborhood tags style) / 비자 태그 */}
        {(job.eligibleVisas ?? job.allowedVisas ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(job.eligibleVisas ?? job.allowedVisas ?? []).slice(0, 3).map((visa) => {
              const colors = getVisaColor(visa)
              return (
                <span
                  key={visa}
                  className={`px-2 py-0.5 ${colors.bg} ${colors.text} text-xs rounded-full font-medium`}
                >
                  {visa}
                </span>
              )
            })}
            {(job.eligibleVisas ?? job.allowedVisas ?? []).length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                +{(job.eligibleVisas ?? job.allowedVisas ?? []).length - 3}
              </span>
            )}
          </div>
        )}

        {/* Salary (prominent like Airbnb price) / 급여 정보 */}
        <div className="pt-3 border-t border-orange-100">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">{salary}</span>
            <span className="text-xs text-gray-500">/ {job.salaryType === 'ANNUAL' ? '년' : '월'}</span>
          </div>
        </div>
      </div>

      {/* Hover Bottom Action Bar / 호버 시 하단 액션 바 */}
      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-4 border-t border-orange-100">
          <button className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg">
            지원하기
          </button>
        </div>
      )}
    </div>
  )
}

// Generate gradient placeholder / 그라디언트 플레이스홀더 생성
function generateGradient(seed: string, variant: number): string {
  const colors = [
    ['#FF5A5F', '#FF385C'],  // Airbnb Red
    ['#FF6F0F', '#FF8A3D'],  // Karrot Orange
    ['#FFB400', '#FFCA28'],  // Warm Yellow
    ['#FF6B6B', '#FF8E8E'],  // Soft Red
    ['#FFA07A', '#FFB89E'],  // Light Salmon
  ]
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colorPair = colors[(hash + variant) % colors.length]
  return `linear-gradient(135deg, ${colorPair[0]} 0%, ${colorPair[1]} 100%)`
}
