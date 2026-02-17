'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Eye, Users, Clock, Briefcase, MapPin, DollarSign, Award, Star } from 'lucide-react'

export default function G039Page() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] p-8">
      {/* Header - Figma Style / 헤더 - Figma 스타일 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-[#F24E1E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FF7262]"></div>
            <div className="w-3 h-3 rounded-full bg-[#A259FF]"></div>
            <div className="w-3 h-3 rounded-full bg-[#0ACF83]"></div>
          </div>
          <h1 className="text-2xl font-bold text-white">Job Board × Design System</h1>
        </div>
        <p className="text-gray-400 text-sm">Behance portfolio meets Figma component properties</p>
      </div>

      {/* Grid Layout - Behance Style / 그리드 레이아웃 - Behance 스타일 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleJobsV2.slice(0, 8).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: MockJobPostingV2 }) {
  const dDay = getDDay(job.closingDate)
  const salary = formatSalary(job)

  return (
    <div className="group relative">
      {/* Figma Selection Frame - appears on hover / Figma 선택 프레임 - 호버 시 나타남 */}
      <div className="absolute -inset-1 border-2 border-dashed border-[#0D99FF] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {/* Corner Handles - Figma style / 코너 핸들 - Figma 스타일 */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#0D99FF] rounded-sm"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#0D99FF] rounded-sm"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#0D99FF] rounded-sm"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#0D99FF] rounded-sm"></div>
      </div>

      {/* Card Container / 카드 컨테이너 */}
      <div className="relative bg-[#1E1E1E] rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-[1.02] cursor-pointer">
        {/* Industry Image - Behance Thumbnail / 산업 이미지 - Behance 썸네일 */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <img
            src={job.industryImage}
            alt={job.industry}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay Badges / 오버레이 배지 */}
          <div className="absolute top-4 left-4 flex gap-2">
            {job.isFeatured && (
              <div className="px-3 py-1 rounded-full bg-[#A259FF] text-white text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3" />
                Featured
              </div>
            )}
            {job.isUrgent && (
              <div className="px-3 py-1 rounded-full bg-[#F24E1E] text-white text-xs font-semibold">
                Urgent
              </div>
            )}
          </div>

          {/* D-Day Badge / D-Day 배지 */}
          {dDay && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm text-white text-xs font-bold">
              {dDay}
            </div>
          )}

          {/* Stats Overlay - Behance style / 통계 오버레이 - Behance 스타일 */}
          <div className="absolute bottom-4 right-4 flex gap-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs">
              <Eye className="w-3 h-3" />
              {job.viewCount}
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-xs">
              <Users className="w-3 h-3" />
              {job.applicantCount}
            </div>
          </div>
        </div>

        {/* Content Section / 콘텐츠 섹션 */}
        <div className="p-6">
          {/* Company Info with Figma-style Border / 회사 정보 - Figma 스타일 보더 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F24E1E] via-[#FF7262] to-[#A259FF] rounded-full blur-sm opacity-75"></div>
              <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-lg font-bold text-gray-800">{job.companyInitial}</span>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-400 truncate">{job.company}</h3>
              <p className="text-xs text-gray-500">{job.industry}</p>
            </div>
            {job.matchScore !== undefined && (
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#0ACF83]/20 text-[#0ACF83] text-xs font-semibold">
                <Award className="w-3 h-3" />
                {job.matchScore}%
              </div>
            )}
          </div>

          {/* Job Title / 채용 제목 */}
          <h2 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight">
            {job.title}
          </h2>

          {/* Property Panel - Figma Inspector Style / 속성 패널 - Figma 인스펙터 스타일 */}
          <div className="bg-[#2C2C2C] rounded-lg p-4 space-y-3 mb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Component Properties
            </div>

            {/* Salary Property / 급여 속성 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <DollarSign className="w-4 h-4 text-[#F24E1E]" />
                <span>Salary</span>
              </div>
              <div className="text-white text-sm font-semibold">{salary}</div>
            </div>

            {/* Location Property / 위치 속성 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-[#FF7262]" />
                <span>Location</span>
              </div>
              <div className="text-white text-sm font-semibold truncate max-w-[180px]">
                {job.location}
              </div>
            </div>

            {/* Experience Property / 경력 속성 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Briefcase className="w-4 h-4 text-[#A259FF]" />
                <span>Experience</span>
              </div>
              <div className="text-white text-sm font-semibold">{job.experienceRequired}</div>
            </div>

            {/* Work Hours Property / 근무시간 속성 */}
            {job.workHours && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4 text-[#0ACF83]" />
                  <span>Hours</span>
                </div>
                <div className="text-white text-sm font-semibold truncate max-w-[180px]">
                  {job.workHours}
                </div>
              </div>
            )}

            {/* Type Property / 유형 속성 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#0D99FF]"></div>
                </span>
                <span>Type</span>
              </div>
              <div className="text-white text-sm font-semibold">
                {job.boardType === 'FULL_TIME' ? 'Full Time' : 'Part Time'}
              </div>
            </div>

            {/* Tier Property / 등급 속성 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-sm bg-gradient-to-r from-[#F24E1E] to-[#A259FF]"></div>
                </span>
                <span>Tier</span>
              </div>
              <div className="text-white text-sm font-semibold">
                {job.tierType}
              </div>
            </div>
          </div>

          {/* Visa Tags with Color Coding / 비자 태그 - 색상 코딩 */}
          {job.allowedVisas && job.allowedVisas.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Allowed Visas
              </div>
              <div className="flex flex-wrap gap-2">
                {job.allowedVisas.slice(0, 6).map((visa) => {
                  const colors = getVisaColor(visa)
                  return (
                    <span
                      key={visa}
                      className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                    >
                      {visa}
                    </span>
                  )
                })}
                {job.allowedVisas.length > 6 && (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300">
                    +{job.allowedVisas.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Benefits / 혜택 */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="pt-4 border-t border-gray-700">
              <div className="flex flex-wrap gap-2">
                {job.benefits.slice(0, 3).map((benefit, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-xs bg-[#2C2C2C] text-gray-300"
                  >
                    {benefit}
                  </span>
                ))}
                {job.benefits.length > 3 && (
                  <span className="px-2 py-1 rounded text-xs bg-[#2C2C2C] text-gray-400">
                    +{job.benefits.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Figma-style Layer Indicator / Figma 스타일 레이어 인디케이터 */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-[#0D99FF] text-white text-xs font-medium">
            <div className="w-3 h-3 rounded border border-white/50"></div>
            <span>Frame {job.id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
