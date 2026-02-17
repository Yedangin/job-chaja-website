'use client'

import React, { useState } from 'react'
import { formatSalary, getVisaColor, getDDay } from '../_mock/job-mock-data-v2'
import type { Job } from '../_mock/job-mock-data-v2'
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  TrendingUp,
  Filter,
  Eye,
  Heart,
  Share2,
  Calendar,
  Users,
  DollarSign,
  Star,
  ChevronRight
} from 'lucide-react'

// Design metadata for showcase / 전시용 디자인 메타데이터
const designInfo = {
  id: 'g-075',
  name: 'Notion×Figma×Stripe',
  description: '3 SaaS tools combined: Notion DB + Figma design + Stripe dashboard',
  category: 'platform',
  features: [
    'Notion property rows with chips',
    'Figma 4-color accent system',
    'Stripe purple brand (#635BFF)',
    'DB view with filter chips',
    'Component frame selection',
    'Metric widgets + data charts',
    'Triple-platform hover interaction',
    'Professional SaaS aesthetic'
  ],
  references: ['Notion', 'Figma', 'Stripe']
}

// Mock job data / 목 데이터
const MOCK_JOB: Job = {
  id: 1,
  title: 'Senior Product Designer',
  company: 'TechFlow Inc.',
  companyLogo: null,
  location: '서울 강남구',
  salary: '연봉 5,000만원 - 7,000만원',
  tags: ['정규직', '경력 3년 이상', '학사 이상'],
  postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  dday: 14,
  visaTypes: ['E-7', 'F-2', 'F-5'],
  isUrgent: false,
  isPremium: true,
  employmentType: '정규직',
  experience: '경력 3년 이상',
  education: '학사 이상',
  companySize: '중견기업',
  industry: 'IT·정보통신',
  views: 1248,
  applicants: 34,
  bookmarks: 89
}

// Figma accent colors / Figma 4색 액센트
const FIGMA_COLORS = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' },
  green: { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' }
}

// Stripe purple / Stripe 브랜드 컬러
const STRIPE_PURPLE = '#635BFF'

interface JobCardProps {
  job: Job
}

function JobCard({ job }: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const dday = getDDay(job)
  const visaColors = job.visaTypes.map(getVisaColor)

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        boxShadow: isHovered
          ? `0 8px 30px rgba(99, 91, 255, 0.15), 0 0 0 2px ${STRIPE_PURPLE}`
          : '0 2px 8px rgba(0,0,0,0.08)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Figma-style selection border / Figma 스타일 선택 테두리 */}
      {isHovered && (
        <>
          <div
            className="absolute top-0 left-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: STRIPE_PURPLE }}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: STRIPE_PURPLE }}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: STRIPE_PURPLE }}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: STRIPE_PURPLE }}
          />
        </>
      )}

      {/* Notion-style header with filters / Notion 스타일 헤더 + 필터 */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Company logo (Notion property) / 회사 로고 (Notion 속성) */}
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: STRIPE_PURPLE }}
            >
              {job.company.charAt(0)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {job.title}
                </h3>
                {job.isPremium && (
                  <div
                    className="px-2 py-0.5 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: STRIPE_PURPLE }}
                  >
                    Premium
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{job.company}</span>
                <span className="text-gray-400">·</span>
                <span>{job.companySize}</span>
              </div>
            </div>
          </div>

          {/* Action buttons / 액션 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Notion-style property rows / Notion 스타일 속성 행 */}
        <div className="space-y-2">
          {/* Location row / 위치 행 */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-24 text-gray-500 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </div>
            <div className="flex-1">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                {job.location}
              </span>
            </div>
          </div>

          {/* Salary row / 급여 행 */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-24 text-gray-500 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Salary</span>
            </div>
            <div className="flex-1">
              <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md font-medium">
                {formatSalary(job)}
              </span>
            </div>
          </div>

          {/* Type row / 고용형태 행 */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-24 text-gray-500 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Type</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md font-medium">
                {job.employmentType ?? job.boardType}
              </span>
              <span className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-md font-medium">
                {job.experience ?? job.experienceRequired ?? ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Figma-style filter chips / Figma 스타일 필터 칩 */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">Visa Types</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {job.visaTypes.map((visa, idx) => {
            const colors = visaColors[idx]
            const figmaColor = Object.values(FIGMA_COLORS)[idx % 4]
            return (
              <button
                key={visa}
                onClick={() => setActiveFilter(visa)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold
                  transition-all duration-200
                  ${activeFilter === visa
                    ? `${colors.bg} ${colors.text} shadow-md scale-105`
                    : `${colors.bg.replace('500', '50')} ${colors.text} hover:shadow-sm`
                  }
                `}
                style={{
                  borderLeft: activeFilter === visa
                    ? `3px solid ${STRIPE_PURPLE}`
                    : 'none'
                }}
              >
                {visa}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stripe-style metric widgets / Stripe 스타일 지표 위젯 */}
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Views widget / 조회수 위젯 */}
          <div
            className="p-3 rounded-xl border transition-all duration-300"
            style={{
              borderColor: isHovered ? STRIPE_PURPLE : '#e5e7eb',
              backgroundColor: isHovered ? 'rgba(99, 91, 255, 0.03)' : '#fff'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4" style={{ color: STRIPE_PURPLE }} />
              <span className="text-xs font-medium text-gray-600">Views</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {job.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">+12%</span>
            </div>
          </div>

          {/* Applicants widget / 지원자 위젯 */}
          <div
            className="p-3 rounded-xl border transition-all duration-300"
            style={{
              borderColor: isHovered ? STRIPE_PURPLE : '#e5e7eb',
              backgroundColor: isHovered ? 'rgba(99, 91, 255, 0.03)' : '#fff'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" style={{ color: STRIPE_PURPLE }} />
              <span className="text-xs font-medium text-gray-600">Applicants</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {job.applicants}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">+8</span>
            </div>
          </div>

          {/* Bookmarks widget / 북마크 위젯 */}
          <div
            className="p-3 rounded-xl border transition-all duration-300"
            style={{
              borderColor: isHovered ? STRIPE_PURPLE : '#e5e7eb',
              backgroundColor: isHovered ? 'rgba(99, 91, 255, 0.03)' : '#fff'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4" style={{ color: STRIPE_PURPLE }} />
              <span className="text-xs font-medium text-gray-600">Saved</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {job.bookmarks}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">+5</span>
            </div>
          </div>
        </div>

        {/* Stripe-style progress chart / Stripe 스타일 진행 차트 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Application Rate</span>
            <span className="text-sm font-semibold" style={{ color: STRIPE_PURPLE }}>
              2.7%
            </span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
              style={{
                width: isHovered ? '67%' : '0%',
                backgroundColor: STRIPE_PURPLE
              }}
            />
          </div>
        </div>

        {/* Footer with deadline / 마감일 포함 푸터 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{new Date(job.postedAt).toLocaleDateString('ko-KR')}</span>
            </div>
            {dday && (
              <div
                className="px-2 py-1 rounded-md text-xs font-bold"
                style={{
                  backgroundColor: 'rgba(99, 91, 255, 0.1)',
                  color: STRIPE_PURPLE
                }}
              >
                {dday}
              </div>
            )}
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: STRIPE_PURPLE,
              transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
            }}
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Figma-style frame label (on hover) / Figma 스타일 프레임 라벨 (호버시) */}
      {isHovered && (
        <div
          className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white shadow-lg"
          style={{ backgroundColor: STRIPE_PURPLE }}
        >
          Job Card / {job.id}
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Design header / 디자인 헤더 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: STRIPE_PURPLE }}
            />
            <span className="text-sm font-semibold text-gray-600">
              Design System
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {designInfo.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {designInfo.description}
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {designInfo.references.map((ref) => (
              <span
                key={ref}
                className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm"
                style={{ color: STRIPE_PURPLE }}
              >
                {ref}
              </span>
            ))}
          </div>
        </div>

        {/* Job card showcase / 잡카드 전시 */}
        <JobCard job={MOCK_JOB} />

        {/* Features list / 기능 목록 */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Design Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {designInfo.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: STRIPE_PURPLE }}
                >
                  {idx + 1}
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Design principles / 디자인 원칙 */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-gray-900">
            <h3 className="font-bold text-lg mb-2">Notion DB</h3>
            <p className="text-sm text-gray-600">
              Property rows with typed values, filter chips, and database view structure
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4" style={{ borderColor: FIGMA_COLORS.purple.text.replace('text-', '') }}>
            <h3 className="font-bold text-lg mb-2">Figma Design</h3>
            <p className="text-sm text-gray-600">
              4-color accent system, selection borders, and component frame labels
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4" style={{ borderColor: STRIPE_PURPLE }}>
            <h3 className="font-bold text-lg mb-2">Stripe Dashboard</h3>
            <p className="text-sm text-gray-600">
              Metric widgets, data charts, purple brand color, and animated progress bars
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
