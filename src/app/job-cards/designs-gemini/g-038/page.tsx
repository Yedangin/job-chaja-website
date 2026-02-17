'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { MapPin, Heart, Bookmark, Eye, Users, Clock, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function G038Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-purple-50">
      {/* Header / 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">g-038</h1>
                  <p className="text-sm text-gray-500">Dribbble×Pinterest</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Image-centric creative layout with masonry grid</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                {sampleJobsV2.length}
              </div>
              <div className="text-sm text-gray-500">Creative Jobs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Masonry Grid / 메이슨리 그리드 */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}

function JobCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const dday = getDDay(job.closingDate)
  const salary = formatSalary(job)

  return (
    <div
      className="break-inside-avoid mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
        {/* Hero Image with Overlay / 히어로 이미지 */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={job.industryImage}
            alt={job.industry}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Gradient Overlay / 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges / 상단 배지 */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {job.isFeatured && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
                ⭐ FEATURED
              </span>
            )}
            {job.isUrgent && (
              <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                🔥 URGENT
              </span>
            )}
            {job.tierType === 'PREMIUM' && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                💎 PREMIUM
              </span>
            )}
          </div>

          {/* D-Day Badge / 디데이 배지 */}
          {dday && (
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                dday === '마감'
                  ? 'bg-gray-500 text-white'
                  : dday === '상시모집'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-pink-500'
              }`}>
                {dday}
              </span>
            </div>
          )}

          {/* Pinterest-style Action Buttons / 핀터레스트 스타일 액션 버튼 */}
          <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsSaved(!isSaved)
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isSaved
                  ? 'bg-pink-500 text-white scale-110'
                  : 'bg-white/90 text-gray-700 hover:bg-pink-500 hover:text-white'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isLiked
                  ? 'bg-pink-500 text-white scale-110'
                  : 'bg-white/90 text-gray-700 hover:bg-pink-500 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Match Score Floating Badge / 매치 점수 플로팅 배지 */}
          {job.matchScore && job.matchScore >= 80 && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border-2 border-pink-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-pink-500">{job.matchScore}% Match</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area / 콘텐츠 영역 */}
        <div className="p-5">
          {/* Company Info / 회사 정보 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {job.companyInitial}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-sm">{job.company}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>
          </div>

          {/* Job Title / 공고 제목 */}
          <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-snug hover:text-pink-500 transition-colors">
            {job.title}
          </h2>

          {/* Stats Row / 통계 행 */}
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{job.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{job.applicantCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{job.postedDate}</span>
            </div>
          </div>

          {/* Salary / 급여 */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-2 rounded-xl border border-pink-200">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                {salary}
              </span>
            </div>
          </div>

          {/* Visa Tags / 비자 태그 */}
          {job.allowedVisas.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job.allowedVisas.slice(0, 4).map((visa) => {
                  const colors = getVisaColor(visa)
                  return (
                    <span
                      key={visa}
                      className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full border ${colors.bg.replace('bg-', 'border-').replace('-50', '-200')}`}
                    >
                      {visa}
                    </span>
                  )
                })}
                {job.allowedVisas.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                    +{job.allowedVisas.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Benefits / 복리후생 */}
          {job.benefits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.benefits.slice(0, 3).map((benefit, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-medium rounded-full border border-pink-200"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dribbble-style Save Button / 드리블 스타일 저장 버튼 */}
        <div className={`border-t border-gray-100 p-4 transition-all duration-300 ${
          isHovered ? 'bg-gradient-to-r from-pink-50 to-purple-50' : 'bg-white'
        }`}>
          <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
            Save to Collection
          </button>
        </div>
      </div>
    </div>
  )
}
