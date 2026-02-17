'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Briefcase, MapPin, Clock, Calendar, Award, Zap, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { sampleJobsV2, formatSalary, getVisaColor, getDDay } from '../_mock/job-mock-data-v2'

// 디자인 정보 / Design Info
const designInfo = {
  id: 'g-070',
  name: '알바몬×토스',
  category: 'unique',
  description: 'Albamon D-Day countdown + Toss number animation hybrid - D-Day countdown as hero element with Toss-style count-up salary animation',
  characteristics: [
    'D-Day countdown hero element (large, red accent)',
    'Hourly wage count-up animation (Toss blue #3182F6)',
    'Part-time job specialist + fintech number emphasis',
    'Red for urgency + Blue for numbers',
    'Hover: D-Day pulses + salary animates from 0'
  ]
}

// 카운트업 애니메이션 훅 / Count-up animation hook
const useCountUp = (end: number, duration: number = 1000, isHovered: boolean = false) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isHovered) {
      setCount(end)
      return
    }

    setCount(0)
    const increment = end / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration, isHovered])

  return count
}

// 급여에서 숫자 추출 / Extract number from salary string
const extractSalaryNumber = (salaryStr: string): number => {
  const match = salaryStr.match(/[\d,]+/)
  if (match) {
    return parseInt(match[0].replace(/,/g, ''))
  }
  return 0
}

export default function G070Page() {
  const router = useRouter()
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 헤더 / Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/job-cards')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{designInfo.name}</h1>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {designInfo.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{designInfo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 디자인 특징 / Design Characteristics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Design Characteristics
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {designInfo.characteristics.map((char, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 잡 카드 그리드 / Job Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => {
            const dDay = getDDay(job)
            const visaColor = getVisaColor((job.matchedVisaTypes ?? job.allowedVisas ?? [])[0])
            const salaryStr = formatSalary(job)
            const salaryNumber = extractSalaryNumber(salaryStr)
            const isHovered = hoveredId === job.id

            return (
              <JobCard
                key={job.id}
                job={job}
                dDay={dDay}
                visaColor={visaColor}
                salaryStr={salaryStr}
                salaryNumber={salaryNumber}
                isHovered={isHovered}
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 잡 카드 컴포넌트 / Job Card Component
function JobCard({
  job,
  dDay,
  visaColor,
  salaryStr,
  salaryNumber,
  isHovered,
  onMouseEnter,
  onMouseLeave
}: {
  job: any
  dDay: string | null
  visaColor: { bg: string; text: string }
  salaryStr: string
  salaryNumber: number
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const animatedSalary = useCountUp(salaryNumber, 1200, isHovered)

  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-red-200 cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* D-Day Hero Section - 디데이 히어로 섹션 */}
      <div className="relative bg-gradient-to-br from-red-50 to-orange-50 p-6 border-b-4 border-red-500">
        {dDay && (
          <div className="text-center">
            <div className={`inline-block transition-all duration-300 ${isHovered ? 'scale-110 animate-pulse' : ''}`}>
              <div className="text-xs font-bold text-red-600 mb-1 tracking-wider">마감임박</div>
              <div className="text-5xl font-black text-red-600 mb-1">{dDay}</div>
              <div className="text-sm font-bold text-red-500">지원 마감까지</div>
            </div>
          </div>
        )}
        {!dDay && (
          <div className="text-center">
            <div className="text-xs font-bold text-gray-500 mb-1">상시채용</div>
            <div className="text-3xl font-black text-gray-600">상시모집</div>
          </div>
        )}

        {/* 긴급채용 배지 / Urgent badge */}
        {job.isUrgent && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
            🔥 긴급
          </div>
        )}
      </div>

      {/* 회사 정보 / Company Info */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={job.companyLogoUrl}
            alt={job.companyName}
            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-300"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">{job.companyName}</p>
          </div>
        </div>

        {/* Toss 스타일 급여 애니메이션 / Toss-style salary animation */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-4 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-900">시급</span>
            </div>
            <div className="text-right">
              {isHovered ? (
                <div className="text-3xl font-black text-blue-600 tabular-nums">
                  {animatedSalary.toLocaleString()}원
                </div>
              ) : (
                <div className="text-3xl font-black text-blue-600">
                  {salaryStr}
                </div>
              )}
              <div className="text-xs text-blue-500 font-medium mt-0.5">
                {job.salaryType === 'HOURLY' ? '시간당' : job.salaryType === 'MONTHLY' ? '월급' : '연봉'}
              </div>
            </div>
          </div>
        </div>

        {/* 근무 정보 / Work Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.employmentType ?? job.boardType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.workHours}</span>
          </div>
        </div>

        {/* 비자 태그 / Visa Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(job.matchedVisaTypes ?? job.allowedVisas ?? []).slice(0, 3).map((visa: string, index: number) => {
            const color = getVisaColor(visa)
            return (
              <span
                key={index}
                className={`${color.bg} ${color.text} px-3 py-1 rounded-full text-xs font-bold border-2 border-current transition-transform duration-300 group-hover:scale-110`}
              >
                {visa}
              </span>
            )
          })}
          {(job.matchedVisaTypes ?? job.allowedVisas ?? []).length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
              +{(job.matchedVisaTypes ?? job.allowedVisas ?? []).length - 3}
            </span>
          )}
        </div>

        {/* 혜택 / Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.benefits.slice(0, 3).map((benefit: string, index: number) => (
              <span
                key={index}
                className="bg-orange-50 text-orange-700 px-2 py-1 rounded-lg text-xs font-medium border border-orange-200"
              >
                {benefit}
              </span>
            ))}
          </div>
        )}

        {/* 프리미엄 배지 / Premium Badge */}
        {job.tier === 'PREMIUM' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-amber-600">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold">프리미엄 공고</span>
            </div>
          </div>
        )}
      </div>

      {/* 하단 날짜 정보 / Bottom Date Info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>등록 {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          {job.applicationDeadline && (
            <div className="font-medium text-red-600">
              마감 {new Date(job.applicationDeadline).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
