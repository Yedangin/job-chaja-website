'use client'

import React, { useState } from 'react'
import { Star, TrendingUp, Users, Award, Clock, MapPin, Briefcase, Building2, DollarSign, ThumbsUp, BarChart3 } from 'lucide-react'
import { sampleJobsV2, type MockMockJobPostingV2V2, formatSalary, getVisaColor, getDDay } from '../_mock/job-mock-data-v2'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-072',
  name: '원티드×Glassdoor×잡플래닛 Premium Combo',
  category: 'premium',
  references: ['Wanted', 'Glassdoor', 'JobPlanet'],
  description: 'Premium branding with comprehensive trust signals - star ratings, salary insights, and review snippets',
  features: [
    'Large company logo with gold premium badge',
    'Star rating with category breakdown (복지/경영/성장/워라밸)',
    'Salary chart visualization on hover',
    'Company review snippet',
    'Trust/credibility focused design',
    'Hover: Logo enlarges + rating chart fills + review slides in'
  ]
}

// Mock company rating data / 회사 평점 데이터
const companyRatings = {
  overall: 4.3,
  categories: [
    { name: '복지', nameEn: 'Benefits', score: 4.5 },
    { name: '경영', nameEn: 'Management', score: 4.2 },
    { name: '성장', nameEn: 'Growth', score: 4.4 },
    { name: '워라밸', nameEn: 'Work-Life', score: 4.1 }
  ],
  reviewCount: 347,
  reviewSnippet: '복지가 탄탄하고 업무 분위기가 좋습니다. 외국인 직원도 많아서 글로벌 환경이 잘 조성되어 있어요.'
}

// Salary insight data / 연봉 정보
const salaryInsight = {
  median: 45000000,
  range: { min: 38000000, max: 58000000 },
  percentile25: 40000000,
  percentile75: 52000000,
  dataPoints: 89
}

// Star rating component / 별점 컴포넌트
function StarRating({ score, size = 16 }: { score: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(score) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
        />
      ))}
    </div>
  )
}

// Category rating bar / 카테고리 평점 바
function CategoryRating({ category, score, isHovered }: { category: string; score: number; isHovered: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 w-12 flex-shrink-0">{category}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700 ease-out"
          style={{
            width: isHovered ? `${(score / 5) * 100}%` : '0%'
          }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-7 text-right">{score.toFixed(1)}</span>
    </div>
  )
}

// Salary chart component / 연봉 차트 컴포넌트
function SalaryChart({ isHovered }: { isHovered: boolean }) {
  const formatKRW = (amount: number) => `${Math.round(amount / 10000)}백만`

  return (
    <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <BarChart3 size={14} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-900">연봉 분포</span>
          </div>
          <span className="text-xs text-blue-700">{salaryInsight.dataPoints}명 데이터</span>
        </div>

        {/* Salary range bar / 연봉 범위 바 */}
        <div className="relative h-8 bg-white rounded-md border border-blue-200 overflow-hidden mb-2">
          <div className="absolute inset-0 flex items-center px-2">
            {/* 25th percentile marker */}
            <div
              className="absolute w-0.5 h-full bg-blue-300"
              style={{ left: '25%' }}
            />
            {/* Median marker */}
            <div
              className="absolute w-1 h-full bg-blue-600"
              style={{ left: '50%' }}
            />
            {/* 75th percentile marker */}
            <div
              className="absolute w-0.5 h-full bg-blue-300"
              style={{ left: '75%' }}
            />

            {/* Gradient fill */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 opacity-40" />
          </div>
        </div>

        {/* Labels / 레이블 */}
        <div className="flex justify-between text-xs">
          <div className="text-gray-600">
            <div className="text-blue-600 font-medium">{formatKRW(salaryInsight.range.min)}</div>
            <div className="text-[10px]">최소</div>
          </div>
          <div className="text-center">
            <div className="text-blue-700 font-bold text-sm">{formatKRW(salaryInsight.median)}</div>
            <div className="text-[10px]">중간값</div>
          </div>
          <div className="text-gray-600 text-right">
            <div className="text-blue-600 font-medium">{formatKRW(salaryInsight.range.max)}</div>
            <div className="text-[10px]">최대</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Job card component / 채용공고 카드 컴포넌트
function JobCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false)
  const visaColors = getVisaColor((job.matchedVisaTypes ?? job.allowedVisas ?? [])[0])
  const dDay = getDDay(job.deadline ?? job.closingDate)

  return (
    <div
      className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-amber-300 transition-all duration-300 overflow-hidden hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium badge ribbon / 프리미엄 리본 배지 */}
      <div className="absolute top-0 right-0 z-10">
        <div className="bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-amber-900 px-4 py-1 rounded-bl-xl flex items-center gap-1 shadow-lg">
          <Award size={14} className="fill-amber-900" />
          <span className="text-xs font-bold">PREMIUM</span>
        </div>
      </div>

      {/* Header section with large logo / 대형 로고 헤더 */}
      <div className="p-6 pb-4 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {/* Large company logo / 대형 회사 로고 */}
          <div className={`relative flex-shrink-0 transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-md">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=635BFF&color=fff&size=128`}
                alt={job.company}
                className="w-16 h-16 object-contain"
              />
            </div>
            {/* Gold badge / 골드 배지 */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-white flex items-center justify-center shadow-md">
              <Award size={14} className="text-amber-900 fill-amber-900" />
            </div>
          </div>

          {/* Company info and ratings / 회사 정보 및 평점 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-gray-900 text-lg truncate">{job.company}</h3>
              {job.company.isVerified && (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>

            {/* Overall star rating / 종합 별점 */}
            <div className="flex items-center gap-2 mb-2">
              <StarRating score={companyRatings.overall} size={16} />
              <span className="font-bold text-gray-900">{companyRatings.overall}</span>
              <span className="text-sm text-gray-500">({companyRatings.reviewCount.toLocaleString()})</span>
            </div>

            {/* Category ratings / 카테고리 평점 */}
            <div className="space-y-1.5">
              {companyRatings.categories.map((cat) => (
                <CategoryRating
                  key={cat.name}
                  category={cat.name}
                  score={cat.score}
                  isHovered={isHovered}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job title and salary / 제목 및 연봉 */}
      <div className="p-6 pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {job.title}
        </h2>

        {/* Salary insight badge / 연봉 정보 뱃지 */}
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 mb-4">
          <DollarSign size={16} className="text-green-600" />
          <span className="font-bold">{formatSalary(job)}</span>
          <span className="text-xs text-green-600 ml-1">(평균 {Math.round(salaryInsight.median / 10000)}백만)</span>
        </div>

        {/* Salary chart (visible on hover) / 연봉 차트 (호버시 표시) */}
        <div className="mb-4">
          <SalaryChart isHovered={isHovered} />
        </div>

        {/* Job details grid / 채용 정보 그리드 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.employmentType ?? job.boardType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.experienceLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.industry}</span>
          </div>
        </div>

        {/* Visa badges / 비자 뱃지 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(job.matchedVisaTypes ?? job.allowedVisas ?? []).slice(0, 3).map((visa) => {
            const colors = getVisaColor(visa)
            return (
              <span
                key={visa}
                className={`${colors.bg} ${colors.text} px-2.5 py-1 rounded-md text-xs font-semibold border ${colors.bg.replace('bg-', 'border-').replace('-50', '-200')}`}
              >
                {visa}
              </span>
            )
          })}
          {(job.matchedVisaTypes ?? job.allowedVisas ?? []).length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-gray-200">
              +{(job.matchedVisaTypes ?? job.allowedVisas ?? []).length - 3}
            </span>
          )}
        </div>

        {/* Review snippet (slides in on hover) / 리뷰 발췌 (호버시 슬라이드) */}
        <div
          className={`bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-200 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0 max-h-24' : 'opacity-0 translate-y-2 max-h-0 overflow-hidden p-0 border-0'
          }`}
        >
          <div className="flex items-start gap-2">
            <ThumbsUp size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
              "{companyRatings.reviewSnippet}"
            </p>
          </div>
        </div>
      </div>

      {/* Footer with deadline / 마감일 푸터 */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={16} className={dDay === 'D-Day' ? 'text-red-500' : 'text-gray-400'} />
          <span className={`text-sm font-semibold ${dDay === 'D-Day' ? 'text-red-600' : 'text-gray-600'}`}>
            {dDay || (job.deadline ?? job.closingDate)}
          </span>
        </div>

        {/* View count / 조회수 */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <TrendingUp size={14} />
          <span>{job.viewCount?.toLocaleString() || '0'} views</span>
        </div>
      </div>

      {/* Hover border glow effect / 호버 테두리 글로우 효과 */}
      <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} style={{
        boxShadow: '0 0 30px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.1)'
      }} />
    </div>
  )
}

// Main page component / 메인 페이지 컴포넌트
export default function Design072Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-8">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="inline-block bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-bold mb-3 border border-amber-300">
                PREMIUM CATEGORY
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{designInfo.name}</h1>
              <p className="text-gray-600 text-lg">{designInfo.description}</p>
            </div>
            <div className="flex gap-2">
              {designInfo.references.map((ref) => (
                <span
                  key={ref}
                  className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md"
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="text-amber-500" size={20} />
                Design Features
              </h3>
              <ul className="space-y-2">
                {designInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-amber-500 mt-0.5">●</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="text-blue-500" size={20} />
                Trust Signals Integrated
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Star className="text-amber-400 fill-amber-400" size={18} />
                  <span className="text-gray-600">⭐ <strong>{companyRatings.overall}/5.0</strong> overall rating from {companyRatings.reviewCount} reviews</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="text-green-500" size={18} />
                  <span className="text-gray-600">💰 Salary insights from <strong>{salaryInsight.dataPoints}</strong> data points</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ThumbsUp className="text-blue-500" size={18} />
                  <span className="text-gray-600">📝 Real employee review snippets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job cards grid / 채용공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Footer note / 푸터 노트 */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Award className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">Premium Design Philosophy</h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                This design combines the <strong>premium branding of Wanted</strong>, the <strong>salary transparency of Glassdoor</strong>,
                and the <strong>trust ratings of JobPlanet</strong>. Large logo presentation with gold accents establishes premium positioning.
                Multi-dimensional rating breakdowns (benefits, management, growth, work-life balance) provide comprehensive company insights.
                Salary distribution charts offer data-driven transparency. Employee review snippets add authenticity.
                Progressive disclosure via hover interactions prevents information overload while maximizing trust signal visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
