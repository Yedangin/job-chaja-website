'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Play, Clock, MapPin, Briefcase, TrendingUp, DollarSign } from 'lucide-react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-050',
  name: 'Netflix×Spotify',
  category: 'interactive',
  reference: 'Netflix streaming cards + Spotify music player UI',
  description: 'Dark streaming platform hybrid with animated equalizer bars, hover expansion, and "Now Hiring" concept. Features Netflix red + Spotify green accents with progress bar showing deadline.',
  author: 'Claude'
}

export default function NetflixSpotifyJobCards() {
  return (
    <div className="min-h-screen bg-[#141414] py-16 px-4">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Now Hiring</h1>
          <p className="text-gray-400">Your next career move is playing</p>
        </div>

        {/* Design Info / 디자인 정보 */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{designInfo.name}</h2>
              <p className="text-[#1DB954] font-medium mb-1">Design ID: {designInfo.id}</p>
              <p className="text-gray-400 mb-2">{designInfo.description}</p>
              <p className="text-sm text-gray-500">Reference: {designInfo.reference}</p>
            </div>
            <span className="px-3 py-1 bg-[#E50914] text-white text-sm font-medium rounded">
              {designInfo.category}
            </span>
          </div>
        </div>

        {/* Genre Categories / 장르 카테고리 */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['Hot Jobs', 'Tech', 'Remote', 'Featured', 'New Releases'].map((genre) => (
            <button
              key={genre}
              className="px-4 py-2 bg-[#1a1a1a] text-gray-300 rounded hover:bg-[#2a2a2a] whitespace-nowrap transition-colors"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards Grid / 채용 카드 그리드 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.slice(0, 6).map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>
      </div>

      {/* Footer / 푸터 */}
      <div className="max-w-7xl mx-auto mt-16 text-center text-gray-500 text-sm">
        <p>Design inspired by Netflix + Spotify • {designInfo.id}</p>
      </div>
    </div>
  )
}

function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const dDay = getDDay(job.closingDate)
  const salary = formatSalary(job)
  const isUrgent = dDay && dDay.startsWith('D-') && parseInt(dDay.slice(2)) <= 3

  // Calculate deadline progress (0-100) / 마감 진행률 계산
  const getProgress = () => {
    if (!dDay || dDay === '상시모집') return 100
    if (dDay === '마감') return 0
    const daysLeft = parseInt(dDay.slice(2))
    return Math.min(100, Math.max(0, (daysLeft / 30) * 100))
  }
  const progress = getProgress()

  return (
    <div className="group relative">
      {/* Main Card / 메인 카드 */}
      <div className="relative bg-[#1a1a1a] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl">
        {/* Poster/Thumbnail / 포스터/썸네일 */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={job.industry?.image || `https://source.unsplash.com/800x450/?${job.industry?.name || 'office'}`}
            alt={job.companyName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay / 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent" />

          {/* Play Button (appears on hover) / 재생 버튼 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Urgent Badge / 긴급 배지 */}
          {isUrgent && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-[#E50914] text-white text-xs font-bold rounded animate-pulse">
              URGENT
            </div>
          )}

          {/* Featured Badge / 추천 배지 */}
          {job.isPremium && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-[#1DB954] text-white text-xs font-bold rounded">
              FEATURED
            </div>
          )}
        </div>

        {/* Content / 콘텐츠 */}
        <div className="p-4">
          {/* Progress Bar / 진행률 바 */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Application Status</span>
              <span className="text-xs text-[#1DB954] font-medium">{dDay || '상시모집'}</span>
            </div>
            <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E50914] via-[#ff6b6b] to-[#1DB954] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Title / 제목 */}
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#1DB954] transition-colors">
            {job.title}
          </h3>

          {/* Company / 회사명 */}
          <p className="text-gray-400 text-sm mb-3">{job.companyName}</p>

          {/* Info Grid / 정보 그리드 */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-[#E50914]" />
              <span>{job.location.city}, {job.location.district}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Briefcase className="w-4 h-4 text-[#1DB954]" />
              <span>{job.employmentType ?? job.boardType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DollarSign className="w-4 h-4 text-[#E50914]" />
              <span>{salary}</span>
            </div>
          </div>

          {/* Equalizer Animation / 이퀄라이저 애니메이션 */}
          <div className="flex items-center gap-1 mb-4 h-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-[#1DB954] rounded-t opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  animation: `bounce ${0.5 + (i * 0.1)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>

          {/* Visa Tags / 비자 태그 */}
          <div className="flex flex-wrap gap-1 mb-4">
            {(job.eligibleVisaTypes ?? job.allowedVisas ?? []).slice(0, 3).map((visa) => {
              const colors = getVisaColor(visa)
              return (
                <span
                  key={visa}
                  className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded`}
                >
                  {visa}
                </span>
              )
            })}
            {(job.eligibleVisaTypes ?? job.allowedVisas ?? []).length > 3 && (
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs font-medium rounded">
                +{(job.eligibleVisaTypes ?? job.allowedVisas ?? []).length - 3}
              </span>
            )}
          </div>

          {/* Action Buttons / 액션 버튼 */}
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-[#E50914] text-white font-bold rounded hover:bg-[#ff0a16] transition-colors group/btn">
              <span className="group-hover/btn:hidden">Now Playing</span>
              <span className="hidden group-hover/btn:inline">Apply Now</span>
            </button>
            <button className="px-4 py-2 bg-[#2a2a2a] text-white rounded hover:bg-[#3a3a3a] transition-colors">
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hover Expansion Content / 호버 확장 콘텐츠 */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121212] to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
          <div className="space-y-2 text-sm text-gray-300">
            <p className="line-clamp-2">{job.description ?? job.title}</p>
            <div className="flex items-center gap-2 text-[#1DB954]">
              <Clock className="w-4 h-4" />
              <span>Posted {Math.floor(Math.random() * 7) + 1} days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation / CSS 애니메이션 */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
      `}</style>
    </div>
  )
}
