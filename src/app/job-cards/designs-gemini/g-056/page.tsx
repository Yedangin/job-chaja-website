'use client'

import { useState, useRef, MouseEvent } from 'react'
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Building2, MapPin, Calendar, CreditCard, TrendingUp, Sparkles } from 'lucide-react'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-056',
  name: '카카오뱅크×토스 (KakaoBank×Toss)',
  category: 'unique',
  reference: 'KakaoBank + Toss fintech UI',
  description: 'Credit card styled cards with 3D tilt effect and prominent salary numbers. KakaoBank yellow + Toss blue hybrid design with financial card aesthetic.',
  author: 'Gemini'
}

export default function KakaoBankTossDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FEE500] via-[#3182F6] to-[#FEE500] bg-clip-text text-transparent">
                {designInfo.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {designInfo.category} • {designInfo.reference}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#FEE500] rounded-full">
                <CreditCard className="w-4 h-4 text-gray-900" />
                <span className="text-sm font-bold text-gray-900">Financial Card Design</span>
              </div>
              <div className="px-4 py-2 bg-[#3182F6] text-white rounded-full text-sm font-bold">
                3D Tilt Effect
              </div>
            </div>
          </div>
          <p className="text-gray-700 mt-4 text-sm leading-relaxed max-w-3xl">
            {designInfo.description}
          </p>
        </div>
      </header>

      {/* Job Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-900">{designInfo.id}</span>
              <span className="mx-2">•</span>
              <span>{designInfo.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3182F6]" />
              <span>Fintech-inspired card design</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function JobCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [tiltStyle, setTiltStyle] = useState({})
  const [displaySalary, setDisplaySalary] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const dDay = getDDay(job.closingDate)
  const visaColors = job.visaTypes.slice(0, 3).map(visa => getVisaColor(visa))

  // Parse salary for animation / 연봉 애니메이션을 위한 파싱
  const salaryText = formatSalary(job)
  const salaryMatch = salaryText.match(/(\d+(?:,\d+)?)/)?.[1]
  const targetSalary = salaryMatch ? parseInt(salaryMatch.replace(/,/g, '')) : 0

  // 3D tilt effect on mouse move / 마우스 이동 시 3D 기울기 효과
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      transition: 'transform 0.1s ease-out'
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.3s ease-out'
    })
    setDisplaySalary(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    // Start salary count-up animation / 연봉 카운트업 애니메이션 시작
    const duration = 1000
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setDisplaySalary(Math.floor(targetSalary * easeOut))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className="relative group cursor-pointer"
    >
      {/* Card Container - Credit Card Shape / 카드 컨테이너 - 신용카드 모양 */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        {/* Card Chip Decoration / 카드 칩 장식 */}
        <div className="absolute top-6 right-6 w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded opacity-20" />

        {/* Top Section - Company & Visa / 상단 섹션 - 회사 & 비자 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FEE500] to-[#FFD700] flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{job.company}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </div>
              </div>
            </div>

            {dDay && (
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                dDay.includes('오늘') || dDay.includes('Today')
                  ? 'bg-red-500 text-white'
                  : dDay.includes('D-')
                  ? 'bg-[#3182F6] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {dDay}
              </div>
            )}
          </div>

          {/* Visa Chips / 비자 칩 */}
          <div className="flex flex-wrap gap-2">
            {job.visaTypes.slice(0, 4).map((visa, idx) => {
              const colors = getVisaColor(visa)
              return (
                <div
                  key={idx}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}
                >
                  {visa}
                </div>
              )
            })}
            {job.visaTypes.length > 4 && (
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-600">
                +{job.visaTypes.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Middle Section - Job Title / 중간 섹션 - 공고 제목 */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {job.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
              {job.employmentType ?? job.boardType}
            </span>
            <span>•</span>
            <span>{job.experience ?? job.experienceRequired ?? ''}</span>
          </div>
        </div>

        {/* Bottom Section - Salary Display (Toss-style) / 하단 섹션 - 연봉 표시 (토스 스타일) */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>연봉</span>
            </div>
            <TrendingUp className={`w-5 h-5 transition-colors duration-300 ${
              isHovered ? 'text-[#3182F6]' : 'text-gray-400'
            }`} />
          </div>

          {/* Big Salary Number / 큰 연봉 숫자 */}
          <div className="mt-3 relative">
            {isHovered ? (
              <div className="text-4xl font-black bg-gradient-to-r from-[#3182F6] to-[#1E6FDB] bg-clip-text text-transparent">
                {displaySalary.toLocaleString()}
                <span className="text-xl ml-1">만원</span>
              </div>
            ) : (
              <div className="text-3xl font-black text-gray-900">
                {salaryText}
              </div>
            )}
          </div>

          {/* Hover Effect Indicator / 호버 효과 인디케이터 */}
          <div className={`mt-4 h-1 rounded-full transition-all duration-500 ${
            isHovered
              ? 'bg-gradient-to-r from-[#FEE500] via-[#3182F6] to-[#FEE500] w-full'
              : 'bg-gray-200 w-0'
          }`} />
        </div>

        {/* 3D Effect Overlay / 3D 효과 오버레이 */}
        <div className={`absolute inset-0 bg-gradient-to-br from-[#FEE500]/10 via-transparent to-[#3182F6]/10 pointer-events-none transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Card Shadow Enhancement / 카드 그림자 강화 */}
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br from-[#FEE500] to-[#3182F6] rounded-2xl blur-xl transition-opacity duration-300 ${
        isHovered ? 'opacity-30' : 'opacity-0'
      }`} />
    </div>
  )
}
