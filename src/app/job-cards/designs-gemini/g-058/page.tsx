'use client'

import React, { useState } from 'react'
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { MapPin, Clock, Star, ChevronLeft, ChevronRight, Navigation, Calendar, Briefcase, Users, Heart } from 'lucide-react'

// Design information / 디자인 정보
const designInfo = {
  id: 'g-058',
  name: 'Uber×Airbnb',
  category: 'unique',
  reference: 'Uber ride-booking + Airbnb stay card',
  description: 'Hybrid card design combining Uber\'s black ride-booking interface with Airbnb\'s coral stay cards. Features mini map background, image carousel, route visualization (departure → workplace), ETA/D-Day countdown, star rating system, and travel/journey metaphor for job search.',
  author: 'Gemini Design System'
}

export default function G058Page() {
  // Sample jobs / 샘플 공고 데이터
  const jobs = sampleJobsV2.slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-black via-gray-900 to-[#FF5A5F] p-8 rounded-2xl shadow-2xl text-white">
          <h1 className="text-4xl font-bold mb-2">{designInfo.name}</h1>
          <p className="text-lg opacity-90 mb-4">{designInfo.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">ID: {designInfo.id}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Category: {designInfo.category}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Reference: {designInfo.reference}</span>
          </div>
        </div>
      </div>

      {/* Job Cards Grid / 공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <UberAirbnbJobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Design Info Footer / 디자인 정보 푸터 */}
      <div className="max-w-7xl mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg border-2 border-gray-200">
        <h3 className="font-bold text-xl mb-3 text-gray-800">Design Specifications</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Core Features:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Mini map gradient background (topographic style)</li>
              <li>Image carousel with workplace photos</li>
              <li>Route visualization (departure → destination)</li>
              <li>Dual color scheme: Uber Black + Airbnb Coral</li>
            </ul>
          </div>
          <div>
            <strong>Interactions:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Hover: Map zooms in + image auto-slides</li>
              <li>ETA countdown = D-Day to application deadline</li>
              <li>Star rating system (Airbnb-style)</li>
              <li>Travel/journey metaphor for job search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Uber×Airbnb Job Card Component / Uber×Airbnb 공고 카드 컴포넌트
function UberAirbnbJobCard({ job }: { job: MockJobPostingV2 }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock workplace images / 목업 사업장 이미지
  const workplaceImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', // Office
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop', // Meeting room
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop', // Workspace
  ]

  const dDay = getDDay(job.closingDate)
  const visaColors = (job.visaCompatibility ?? job.allowedVisas ?? []).map(visa => getVisaColor(visa))

  // Generate random rating / 랜덤 평점 생성
  const rating = (4.5 + Math.random() * 0.4).toFixed(1)
  const reviewCount = Math.floor(Math.random() * 200) + 50

  // Auto-slide images on hover / 호버 시 이미지 자동 슬라이드
  React.useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % workplaceImages.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isHovered, workplaceImages.length])

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + workplaceImages.length) % workplaceImages.length)
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % workplaceImages.length)
  }

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mini Map Background / 미니 맵 배경 */}
      <div className={`absolute inset-0 opacity-10 transition-all duration-700 ${isHovered ? 'scale-110 opacity-20' : 'scale-100'}`}>
        <div className="w-full h-full bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200 relative">
          {/* Topographic lines / 등고선 효과 */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`topo-${job.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#333" strokeWidth="0.5" opacity="0.3" />
                <circle cx="20" cy="20" r="12" fill="none" stroke="#333" strokeWidth="0.5" opacity="0.3" />
                <circle cx="20" cy="20" r="6" fill="none" stroke="#333" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#topo-${job.id})`} />
          </svg>
        </div>
      </div>

      {/* Image Carousel / 이미지 캐러셀 */}
      <div className="relative h-56 overflow-hidden bg-gray-900">
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {workplaceImages.map((image, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={image}
                alt={`Workplace ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {/* Carousel Controls / 캐러셀 컨트롤 */}
        <button
          onClick={handlePrevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Image Indicators / 이미지 인디케이터 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {workplaceImages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'w-6 bg-white'
                  : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Favorite Button / 즐겨찾기 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-300 shadow-lg"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-[#FF5A5F] text-[#FF5A5F]' : 'text-gray-600'}`} />
        </button>

        {/* Uber-style black badge / Uber 스타일 블랙 뱃지 */}
        {job.isPremium && (
          <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            PREMIUM
          </div>
        )}
      </div>

      {/* Card Content / 카드 콘텐츠 */}
      <div className="relative p-5">
        {/* Rating (Airbnb-style) / 평점 (Airbnb 스타일) */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-[#FF5A5F] text-white px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-white" />
            <span className="font-bold text-sm">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
        </div>

        {/* Company Name / 회사명 */}
        <h3 className="font-bold text-lg mb-1 text-gray-900 line-clamp-1">{job.company}</h3>

        {/* Job Title / 직무명 */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.title}</p>

        {/* Route Visualization (Departure → Workplace) / 경로 시각화 */}
        <div className="bg-gradient-to-r from-black to-[#FF5A5F] p-3 rounded-xl mb-3 text-white">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs font-medium">Your Location</span>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-white/40" />
            <Navigation className="w-4 h-4" />
            <div className="flex-1 border-t-2 border-dashed border-white/40" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-medium">{job.location}</span>
            </div>
          </div>
        </div>

        {/* Job Details / 상세 정보 */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span>{job.employmentType ?? job.boardType}</span>
            <span className="text-gray-400">•</span>
            <span>{job.experience ?? job.experienceRequired ?? ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            <span>Hiring: {job.hiringCount ?? 1} positions</span>
          </div>
        </div>

        {/* Salary / 급여 */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl mb-3">
          <div className="text-xs text-gray-500 mb-1">Estimated Compensation</div>
          <div className="font-bold text-lg text-gray-900">{formatSalary(job)}</div>
        </div>

        {/* Visa Compatibility / 비자 호환성 */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            Visa Routes Available
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(job.visaCompatibility ?? job.allowedVisas ?? []).slice(0, 3).map((visa, index) => {
              const colors = visaColors[index]
              return (
                <span
                  key={visa}
                  className={`${colors.bg} ${colors.text} px-2 py-1 rounded-lg text-xs font-medium`}
                >
                  {visa}
                </span>
              )
            })}
            {(job.visaCompatibility ?? job.allowedVisas ?? []).length > 3 && (
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                +{(job.visaCompatibility ?? job.allowedVisas ?? []).length - 3}
              </span>
            )}
          </div>
        </div>

        {/* ETA / D-Day Countdown / 마감일 카운트다운 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF5A5F]" />
            <div>
              <div className="text-xs text-gray-500">ETA to Deadline</div>
              <div className={`font-bold text-sm ${
                dDay && parseInt(dDay.replace(/\D/g, '')) <= 3
                  ? 'text-red-600'
                  : 'text-[#FF5A5F]'
              }`}>
                {dDay || 'Ongoing'}
              </div>
            </div>
          </div>
          <button className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl">
            Start Journey
          </button>
        </div>
      </div>

      {/* Hover Effect: Route Line Animation / 호버 효과: 경로 라인 애니메이션 */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-[#FF5A5F] to-black transform origin-left transition-transform duration-700 ${
        isHovered ? 'scale-x-100' : 'scale-x-0'
      }`} />
    </div>
  )
}
