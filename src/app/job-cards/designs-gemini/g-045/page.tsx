'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import {
  Table,
  LayoutGrid,
  List,
  GalleryHorizontal,
  ChevronDown,
  Filter,
  SortAsc,
  Plus,
  Eye,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Briefcase,
  Award,
  Star,
  Zap
} from 'lucide-react'
import { useState } from 'react'

export default function NotionFigmaDesignPage() {
  const [viewMode, setViewMode] = useState<'board' | 'table' | 'gallery' | 'list'>('board')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      {/* Notion Database Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {/* Database Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-lg font-bold">
              💼
            </div>
            <h1 className="text-2xl font-bold text-gray-900">채용 데이터베이스</h1>
            <span className="text-sm text-gray-500 ml-2">{sampleJobsV2.length}개 공고</span>
          </div>

          {/* View Controls & Filters */}
          <div className="flex items-center justify-between">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                  viewMode === 'table'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Table className="w-4 h-4" />
                <span className="text-sm font-medium">Table</span>
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                  viewMode === 'board'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-sm font-medium">Board</span>
              </button>
              <button
                onClick={() => setViewMode('gallery')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                  viewMode === 'gallery'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <GalleryHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Gallery</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">List</span>
              </button>
            </div>

            {/* Filter & Sort */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                <Filter className="w-4 h-4" />
                필터
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                <SortAsc className="w-4 h-4" />
                정렬
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                <Plus className="w-4 h-4" />
                새 공고
              </button>
            </div>
          </div>

          {/* Property Filter Chips */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded text-xs font-medium text-red-700">
              <div className="w-2 h-2 rounded-full bg-[#F24E1E]" />
              급여 유형
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded text-xs font-medium text-purple-700">
              <div className="w-2 h-2 rounded-full bg-[#A259FF]" />
              비자 유형
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded text-xs font-medium text-green-700">
              <div className="w-2 h-2 rounded-full bg-[#0ACF83]" />
              마감일
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200 rounded text-xs font-medium text-orange-700">
              <div className="w-2 h-2 rounded-full bg-[#FF7262]" />
              지역
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Board View Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <NotionFigmaCard
              key={job.id}
              job={job}
              isHovered={hoveredCard === job.id}
              onHover={() => setHoveredCard(job.id)}
              onLeave={() => setHoveredCard(null)}
              hoveredProperty={hoveredProperty}
              onPropertyHover={setHoveredProperty}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Notion×Figma Card Component
function NotionFigmaCard({
  job,
  isHovered,
  onHover,
  onLeave,
  hoveredProperty,
  onPropertyHover
}: {
  job: MockJobPostingV2
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  hoveredProperty: string | null
  onPropertyHover: (prop: string | null) => void
}) {
  const dday = getDDay(job.closingDate)

  return (
    <div
      className="relative group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Figma-style Selection Frame */}
      {isHovered && (
        <div className="absolute -inset-[2px] border-2 border-blue-500 rounded-xl pointer-events-none z-10">
          {/* Corner Handles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm" />
        </div>
      )}

      {/* Card Body */}
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
        {/* Cover Image Section */}
        {job.industryImage && (
          <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              src={job.industryImage}
              alt={job.industry}
              className="w-full h-full object-cover"
            />
            {/* Notion-style badges overlay */}
            <div className="absolute top-2 right-2 flex gap-1">
              {job.isFeatured && (
                <div className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  추천
                </div>
              )}
              {job.isUrgent && (
                <div className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  긴급
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="p-4 space-y-3">
          {/* Page Icon + Title */}
          <div className="flex items-start gap-3">
            {/* Company Icon (Notion-style page icon) */}
            <div className="flex-shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-10 h-10 rounded-md object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm border border-gray-200">
                  {job.companyInitial}
                </div>
              )}
            </div>

            {/* Title & Company */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
          </div>

          {/* Notion-style Properties */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {/* Property: Salary */}
            <PropertyRow
              label="급여"
              accentColor="#F24E1E"
              isHovered={isHovered && hoveredProperty === `${job.id}-salary`}
              onHover={() => onPropertyHover(`${job.id}-salary`)}
              onLeave={() => onPropertyHover(null)}
            >
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <DollarSign className="w-3.5 h-3.5 text-[#F24E1E]" />
                {formatSalary(job)}
              </div>
            </PropertyRow>

            {/* Property: Location */}
            <PropertyRow
              label="위치"
              accentColor="#FF7262"
              isHovered={isHovered && hoveredProperty === `${job.id}-location`}
              onHover={() => onPropertyHover(`${job.id}-location`)}
              onLeave={() => onPropertyHover(null)}
            >
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <MapPin className="w-3.5 h-3.5 text-[#FF7262]" />
                {job.location}
              </div>
            </PropertyRow>

            {/* Property: Visa Types */}
            <PropertyRow
              label="비자"
              accentColor="#A259FF"
              isHovered={isHovered && hoveredProperty === `${job.id}-visa`}
              onHover={() => onPropertyHover(`${job.id}-visa`)}
              onLeave={() => onPropertyHover(null)}
            >
              <div className="flex flex-wrap gap-1">
                {job.allowedVisas.slice(0, 3).map((visa) => {
                  const colors = getVisaColor(visa)
                  return (
                    <span
                      key={visa}
                      className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                    >
                      {visa}
                    </span>
                  )
                })}
                {job.allowedVisas.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    +{job.allowedVisas.length - 3}
                  </span>
                )}
              </div>
            </PropertyRow>

            {/* Property: Deadline */}
            <PropertyRow
              label="마감"
              accentColor="#0ACF83"
              isHovered={isHovered && hoveredProperty === `${job.id}-deadline`}
              onHover={() => onPropertyHover(`${job.id}-deadline`)}
              onLeave={() => onPropertyHover(null)}
            >
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Calendar className="w-3.5 h-3.5 text-[#0ACF83]" />
                {dday || '상시모집'}
              </div>
            </PropertyRow>

            {/* Property: Stats */}
            <PropertyRow
              label="통계"
              accentColor="#1E90FF"
              isHovered={isHovered && hoveredProperty === `${job.id}-stats`}
              onHover={() => onPropertyHover(`${job.id}-stats`)}
              onLeave={() => onPropertyHover(null)}
            >
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {job.viewCount}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {job.applicantCount}명 지원
                </div>
              </div>
            </PropertyRow>

            {/* Property: Experience */}
            <PropertyRow
              label="경력"
              accentColor="#FFA500"
              isHovered={isHovered && hoveredProperty === `${job.id}-exp`}
              onHover={() => onPropertyHover(`${job.id}-exp`)}
              onLeave={() => onPropertyHover(null)}
            >
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Briefcase className="w-3.5 h-3.5 text-[#FFA500]" />
                {job.experienceRequired}
              </div>
            </PropertyRow>
          </div>

          {/* Footer: Board Type Badge */}
          <div className="pt-2 border-t border-gray-100">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
              {job.boardType === '정규직' && <Briefcase className="w-3 h-3" />}
              {job.boardType === '알바' && <Clock className="w-3 h-3" />}
              {job.boardType}
              {job.tierType === 'PREMIUM' && (
                <span className="ml-1 text-yellow-600">★</span>
              )}
            </div>
            {job.matchScore && job.matchScore >= 80 && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-xs font-medium text-blue-700 ml-2">
                <Award className="w-3 h-3" />
                {job.matchScore}% 매칭
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Notion-style Property Row Component
function PropertyRow({
  label,
  accentColor,
  children,
  isHovered,
  onHover,
  onLeave
}: {
  label: string
  accentColor: string
  children: React.ReactNode
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <div
      className="flex items-center gap-3 group/property"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Property Label (Notion-style) */}
      <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
        <div
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
      </div>

      {/* Property Value (becomes "editable-looking" on hover) */}
      <div
        className={`flex-1 px-2 py-1 rounded transition-all ${
          isHovered
            ? 'bg-blue-50 ring-1 ring-blue-300 cursor-text'
            : 'bg-transparent'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
