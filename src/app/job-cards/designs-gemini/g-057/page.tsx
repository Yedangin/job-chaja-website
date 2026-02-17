'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Briefcase, MapPin, Clock, Calendar, ChevronRight, Zap } from 'lucide-react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-057',
  name: 'Jumpit×ZipRecruiter',
  category: 'unique',
  reference: 'Jumpit developer platform + ZipRecruiter matching system',
  description: 'Developer-focused card with tech stack matching gauge and interactive skill badges',
  author: 'Claude',
  features: [
    'Circular SVG matching gauge animation',
    'Tech stack badges scale on hover',
    'Green accent hybrid (#00C471 + #50C878)',
    'Matching score fills on hover',
    'Developer-centric layout',
    'One-click apply focus'
  ]
}

export default function G057Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-emerald-500">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{designInfo.name}</h1>
              <p className="text-lg text-slate-600 mb-4">{designInfo.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {designInfo.features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="px-3 py-1 bg-slate-100 rounded-full font-medium">{designInfo.category}</span>
                <span>ID: {designInfo.id}</span>
                <span>Reference: {designInfo.reference}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold">
              <Zap className="w-5 h-5" />
              <span>Matching System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: MockJobPostingV2 }) {
  const dday = getDDay(job.closingDate)
  const salaryText = formatSalary(job)

  // Calculate mock matching score based on tech stack / 기술 스택 기반 매칭 점수 계산
  const matchingScore = job.techStack && job.techStack.length > 0
    ? Math.min(95, 65 + job.techStack.length * 5)
    : 70

  // Get primary visa color / 주요 비자 색상
  const primaryVisa = (job.visaCompatibility ?? job.allowedVisas ?? [])[0]
  const visaColor = getVisaColor(primaryVisa)

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-emerald-400">
      {/* Top accent bar / 상단 강조 바 */}
      <div className="h-1.5 bg-gradient-to-r from-[#00C471] via-[#50C878] to-[#00C471] group-hover:h-2 transition-all duration-300" />

      <div className="p-6">
        {/* Header with company logo and matching gauge / 회사 로고와 매칭 게이지 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 group-hover:scale-110 transition-transform duration-300"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">
                {job.title}
              </h3>
              <p className="text-sm text-slate-600 font-medium">{job.companyName}</p>
            </div>
          </div>

          {/* Circular matching gauge (SVG) / 원형 매칭 게이지 */}
          <div className="relative flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              {/* Background circle / 배경 원 */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="6"
              />
              {/* Progress circle / 진행 원 */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0)}`}
                className="transition-all duration-1000 ease-out group-hover:stroke-dashoffset-0"
                style={{
                  strokeDashoffset: `${2 * Math.PI * 28 * (1 - matchingScore / 100)}`
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C471" />
                  <stop offset="100%" stopColor="#50C878" />
                </linearGradient>
              </defs>
            </svg>
            {/* Score text / 점수 텍스트 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {matchingScore}%
              </span>
              <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                MATCH
              </span>
            </div>
          </div>
        </div>

        {/* Tech Stack Badges (Interactive) / 기술 스택 배지 (인터랙티브) */}
        {job.techStack && job.techStack.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {job.techStack.slice(0, 5).map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 hover:scale-110 hover:bg-emerald-100 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                {tech}
              </span>
            ))}
            {job.techStack.length > 5 && (
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                +{job.techStack.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Job Info Grid / 채용 정보 그리드 */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Briefcase className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>{job.employmentType ?? job.boardType} · {job.experience ?? job.experienceRequired ?? ''}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="font-semibold text-slate-900">{salaryText}</span>
          </div>

          {dday && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className={`font-semibold ${
                dday.includes('오늘') || dday.includes('Today')
                  ? 'text-red-600'
                  : dday.includes('D-') && parseInt(dday.split('-')[1]) <= 7
                  ? 'text-orange-600'
                  : 'text-slate-600'
              }`}>
                {dday}
              </span>
            </div>
          )}
        </div>

        {/* Visa Compatibility / 비자 호환성 */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-700">비자 호환</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(job.visaCompatibility ?? job.allowedVisas ?? []).slice(0, 4).map((visa, idx) => {
              const color = getVisaColor(visa)
              return (
                <span
                  key={idx}
                  className={`px-2 py-1 ${color.bg} ${color.text} rounded text-xs font-medium border ${color.bg.replace('bg-', 'border-').replace('-100', '-300')}`}
                >
                  {visa}
                </span>
              )
            })}
            {(job.visaCompatibility ?? job.allowedVisas ?? []).length > 4 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                +{(job.visaCompatibility ?? job.allowedVisas ?? []).length - 4}
              </span>
            )}
          </div>
        </div>

        {/* One-Click Apply Button / 원클릭 지원 버튼 */}
        <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl group/btn">
          <span>빠른 지원</span>
          <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>

        {/* Hover indicator / 호버 표시 */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </div>
  )
}
