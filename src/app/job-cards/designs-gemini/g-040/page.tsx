'use client'

import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2
} from '../_mock/job-mock-data-v2'
import {
  Play,
  Users,
  Eye,
  Calendar,
  Zap,
  Star,
  Clock,
  MapPin,
  TrendingUp
} from 'lucide-react'

export default function SpotifyDiscordCards() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      {/* Header Section / 헤더 섹션 */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1DB954] to-[#5865F2] rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">
              g-040: Spotify×Discord
            </h1>
            <p className="text-gray-400">
              Dark theme with green+purple accents, dual-button hover interaction
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-4 py-2 bg-[#1DB954]/10 text-[#1DB954] rounded-full border border-[#1DB954]/30">
            Dark Theme
          </span>
          <span className="px-4 py-2 bg-[#5865F2]/10 text-[#5865F2] rounded-full border border-[#5865F2]/30">
            Music Player UI
          </span>
          <span className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/30">
            Member List
          </span>
          <span className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full border border-gray-700">
            Play + Join Buttons
          </span>
        </div>
      </div>

      {/* Job Cards Grid / 공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => (
          <SpotifyDiscordCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

function SpotifyDiscordCard({ job }: { job: MockJobPostingV2 }) {
  const dday = getDDay(job.closingDate)
  const salary = formatSalary(job)
  const matchProgress = job.matchScore || 75

  return (
    <div className="group relative bg-[#121212] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#1DB954]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#1DB954]/20">
      {/* Album Art / Server Banner (Industry Image) / 산업 이미지 배너 */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <img
          src={job.industryImage}
          alt={job.industry}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
        />

        {/* Overlay Gradient / 오버레이 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />

        {/* Status Indicators (Spotify Online Dot + Discord Badge) / 상태 표시 */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {job.isUrgent && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1DB954] rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-xs font-bold text-white">URGENT</span>
            </div>
          )}
          {job.isFeatured && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5865F2] rounded-full">
              <Star className="w-3 h-3 text-white fill-white" />
              <span className="text-xs font-bold text-white">BOOSTED</span>
            </div>
          )}
        </div>

        {/* D-Day Badge (Track Duration Style) / 마감일 표시 */}
        {dday && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-gray-700">
            <span className={`text-sm font-bold ${
              dday === '마감' ? 'text-red-400' :
              dday === '상시모집' ? 'text-[#5865F2]' :
              'text-[#1DB954]'
            }`}>
              {dday}
            </span>
          </div>
        )}

        {/* Company Logo (Album/Server Icon) / 회사 로고 */}
        <div className="absolute -bottom-6 left-6 w-20 h-20 rounded-xl overflow-hidden border-4 border-[#121212] shadow-2xl group-hover:border-[#1DB954] transition-colors duration-300">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1DB954] to-[#5865F2] flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {job.companyInitial}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content / 카드 콘텐츠 */}
      <div className="p-6 pt-10">
        {/* Job Title (Track/Server Name) / 공고 제목 */}
        <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-[#1DB954] transition-colors duration-300">
          {job.title}
        </h3>

        {/* Company Name (Artist/Server Name) / 회사명 */}
        <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
          {job.company}
          {job.tierType === 'PREMIUM' && (
            <span className="w-4 h-4 bg-[#5865F2] rounded-full flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-white fill-white" />
            </span>
          )}
        </p>

        {/* Location & Board Type / 위치 및 공고 유형 */}
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
          <span className="w-1 h-1 bg-gray-700 rounded-full" />
          <span className={`px-2 py-1 rounded ${
            job.boardType === 'FULL_TIME'
              ? 'bg-[#5865F2]/20 text-[#5865F2]'
              : 'bg-[#1DB954]/20 text-[#1DB954]'
          }`}>
            {job.boardType === 'FULL_TIME' ? 'Full-Time' : 'Part-Time'}
          </span>
        </div>

        {/* Salary (Track Duration / Boost Level) / 급여 정보 */}
        <div className="mb-4 p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Salary Range</span>
            <span className="text-[#1DB954] font-bold">{salary}</span>
          </div>
        </div>

        {/* Visa Tags (Genre Tags) / 비자 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.allowedVisas.slice(0, 3).map((visa) => {
            const colors = getVisaColor(visa)
            return (
              <span
                key={visa}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text} border border-current/30`}
              >
                {visa}
              </span>
            )
          })}
          {job.allowedVisas.length > 3 && (
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-400">
              +{job.allowedVisas.length - 3}
            </span>
          )}
        </div>

        {/* Match Score Progress Bar (Spotify Player) / 매칭 점수 프로그레스 바 */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#1DB954]" />
              Match Score
            </span>
            <span className="text-[#1DB954] font-bold">{matchProgress}%</span>
          </div>
          <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1DB954] to-[#5865F2] rounded-full transition-all duration-700 group-hover:shadow-lg group-hover:shadow-[#1DB954]/50"
              style={{ width: `${matchProgress}%` }}
            />
          </div>
        </div>

        {/* Stats (Discord Member Count + Views) / 통계 정보 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#5865F2]" />
              <span className="text-white font-medium">{job.applicantCount}</span>
              <span className="text-xs">members</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {job.viewCount}
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {new Date(job.postedDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Hover Overlay with Dual Buttons (Play + Join) / 듀얼 버튼 호버 오버레이 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 p-6">
        {/* Spotify Play Button / 스포티파이 재생 버튼 */}
        <button className="flex items-center gap-3 px-8 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:shadow-[#1DB954]/50 hover:scale-105">
          <Play className="w-5 h-5 fill-white" />
          <span>Apply Now</span>
        </button>

        {/* Discord Join Button / 디스코드 참여 버튼 */}
        <button className="flex items-center gap-3 px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-2xl hover:shadow-[#5865F2]/50 hover:scale-105">
          <Users className="w-5 h-5" />
          <span>Join Team</span>
        </button>
      </div>

      {/* Glow Effect on Hover / 호버 시 글로우 효과 */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 via-transparent to-[#5865F2]/10 blur-xl" />
      </div>
    </div>
  )
}
