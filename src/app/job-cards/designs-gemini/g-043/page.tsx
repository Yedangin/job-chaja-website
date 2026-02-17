'use client'

import { useState, useEffect } from 'react'
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2
} from '../_mock/job-mock-data-v2'
import { Clock, MapPin, Users, Eye, Briefcase, Zap } from 'lucide-react'

export default function UberTossJobCards() {
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Uber/Toss 스타일 / Uber/Toss style header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            당신의 다음 목적지
          </h1>
          <p className="text-xl text-gray-400">
            Your next destination
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-1 w-16 bg-white rounded-full" />
            <div className="h-2 w-2 bg-[#3182F6] rounded-full animate-pulse" />
            <div className="h-1 w-16 bg-[#3182F6] rounded-full" />
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <UberTossJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}

function UberTossJobCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [animatedSalary, setAnimatedSalary] = useState(0)
  const dday = getDDay(job.closingDate)
  const salary = formatSalary(job)

  // 급여 숫자 추출 (애니메이션용) / Extract salary number for animation
  const targetSalary = job.salaryMax || job.salaryMin || job.hourlyWage || 0

  // 급여 카운트업 애니메이션 / Salary count-up animation
  useEffect(() => {
    if (isHovered) {
      let current = 0
      const increment = targetSalary / 20
      const timer = setInterval(() => {
        current += increment
        if (current >= targetSalary) {
          setAnimatedSalary(targetSalary)
          clearInterval(timer)
        } else {
          setAnimatedSalary(Math.floor(current))
        }
      }, 30)
      return () => clearInterval(timer)
    } else {
      setAnimatedSalary(targetSalary)
    }
  }, [isHovered, targetSalary])

  return (
    <div
      className="relative bg-gradient-to-br from-zinc-900 to-black rounded-3xl overflow-hidden border border-zinc-800 hover:border-[#3182F6] transition-all duration-500 hover:shadow-2xl hover:shadow-[#3182F6]/20 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Uber 라우트 라인 배경 / Uber route line background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`gradient-${job.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3182F6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M 0,50 Q 150,20 300,100"
            stroke={`url(#gradient-${job.id})`}
            strokeWidth="3"
            fill="none"
            strokeDasharray="10,5"
            className={isHovered ? 'animate-pulse' : ''}
          />
        </svg>
      </div>

      <div className="relative p-6">
        {/* 상단: 회사 아바타 + 위치 (Uber 픽업 스타일) / Top: Company avatar + location (Uber pickup style) */}
        <div className="flex items-start gap-4 mb-4">
          {/* Company Logo as Driver Avatar */}
          <div className="relative">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3182F6] to-blue-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-white/10">
                {job.companyInitial}
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#3182F6] rounded-full border-2 border-black flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-white font-bold text-lg leading-tight mb-1">
              {job.company}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{job.location}</span>
            </div>
          </div>

          {/* 긴급/추천 배지 / Urgent/Featured badge */}
          {(job.isUrgent || job.isFeatured) && (
            <div className="bg-[#3182F6] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {job.isUrgent ? 'URGENT' : 'HOT'}
            </div>
          )}
        </div>

        {/* Uber 경로 점선 / Uber route dotted line */}
        <div className="flex items-center gap-2 mb-4 pl-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-0.5 h-8 bg-gradient-to-b from-white via-[#3182F6] to-transparent" />
            <div className="w-3 h-3 rounded-full bg-[#3182F6] animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="text-gray-500 text-xs mb-1">목적지 / Destination</div>
            <div className="text-white font-semibold text-base line-clamp-2">
              {job.title}
            </div>
          </div>
        </div>

        {/* 도착(마감)까지 시간 카운트다운 - Uber 스타일 / Time until arrival(deadline) countdown - Uber style */}
        <div className="mb-5 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-xs mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>도착(마감)까지 / Time to arrival(deadline)</span>
              </div>
              <div className={`text-2xl font-bold ${
                dday === '마감'
                  ? 'text-red-500'
                  : dday === '상시모집'
                    ? 'text-[#3182F6]'
                    : 'text-white'
              } ${isHovered ? 'animate-pulse' : ''}`}>
                {dday || '상시모집'}
              </div>
            </div>
            {/* 진행 중 인디케이터 / Progress indicator */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-12 h-12 rounded-full border-4 ${
                isHovered ? 'border-[#3182F6] border-t-white' : 'border-zinc-700 border-t-zinc-600'
              } transition-all duration-500 ${isHovered ? 'animate-spin' : ''}`} />
              <span className="text-[10px] text-gray-500">진행중</span>
            </div>
          </div>
        </div>

        {/* 토스 스타일 큰 금액 표시 (애니메이션) / Toss-style large amount display (animated) */}
        <div className="mb-5 p-5 bg-gradient-to-br from-[#3182F6]/20 to-blue-600/10 rounded-2xl border border-[#3182F6]/30">
          <div className="text-[#3182F6] text-xs font-semibold mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>급여 / Salary</span>
          </div>
          <div className="text-white font-bold text-3xl tracking-tight">
            {isHovered ? (
              <span className="inline-block transition-all duration-300">
                {animatedSalary.toLocaleString()}원
              </span>
            ) : (
              salary
            )}
          </div>
          <div className="text-gray-400 text-xs mt-1">{job.workHours}</div>
        </div>

        {/* 비자 태그 (getVisaColor 사용) / Visa tags (using getVisaColor) */}
        <div className="mb-4 flex flex-wrap gap-2">
          {job.allowedVisas.slice(0, 3).map((visa) => {
            const colors = getVisaColor(visa)
            return (
              <span
                key={visa}
                className={`${colors.bg} ${colors.text} text-xs font-semibold px-3 py-1 rounded-full`}
              >
                {visa}
              </span>
            )
          })}
          {job.allowedVisas.length > 3 && (
            <span className="bg-zinc-800 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full">
              +{job.allowedVisas.length - 3}
            </span>
          )}
        </div>

        {/* 통계 정보 / Statistics */}
        <div className="flex items-center gap-4 mb-5 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{job.applicantCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{job.viewCount}</span>
          </div>
          {job.matchScore && (
            <div className="ml-auto">
              <span className="text-[#3182F6] font-bold">{job.matchScore}% 매칭</span>
            </div>
          )}
        </div>

        {/* Uber 확정하기 스타일 CTA 버튼 / Uber "Confirm ride" style CTA button */}
        <button className={`w-full py-4 rounded-full font-bold text-base transition-all duration-300 ${
          isHovered
            ? 'bg-[#3182F6] text-white shadow-lg shadow-[#3182F6]/50 scale-[1.02]'
            : 'bg-white text-black'
        }`}>
          {isHovered ? '지금 지원하기 →' : '지원하기'}
        </button>

        {/* Hover 시 추가 정보 오버레이 / Additional info overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
            <div className="absolute bottom-20 left-6 right-6">
              <div className="text-white text-xs space-y-1">
                {job.benefits.slice(0, 2).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 animate-fade-in">
                    <div className="w-1.5 h-1.5 bg-[#3182F6] rounded-full" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 Uber 스타일 진행 바 / Bottom Uber-style progress bar */}
      <div className="h-1 bg-zinc-800">
        <div
          className={`h-full bg-gradient-to-r from-[#3182F6] to-blue-400 transition-all duration-700 ${
            isHovered ? 'w-full' : 'w-0'
          }`}
        />
      </div>
    </div>
  )
}
