'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Star, Eye, EyeOff, TrendingUp, Heart, DollarSign, Briefcase, MapPin, Clock, Users, Building2, Award, Shield } from 'lucide-react'
import { useState } from 'react'

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-054',
  name: 'Blind×JobPlanet',
  category: 'unique',
  reference: 'Blind anonymous forum + JobPlanet company review hybrid',
  description: 'Anonymous employee reviews with star ratings, company info partially blurred, dark theme with gold ratings, star fills animate on hover, trust/credibility focused design',
  author: 'Claude'
}

// 리뷰 카테고리 타입 / Review category type
type ReviewCategory = {
  label: string
  icon: React.ReactNode
  rating: number
}

// 익명 리뷰 생성 함수 / Generate anonymous review
function generateReview(job: MockJobPostingV2): {
  overallRating: number
  categories: ReviewCategory[]
  reviewCount: number
  employeeCount: string
  insiderTip: string
  pros: string
  cons: string
} {
  const seed = job.id.charCodeAt(0) + job.id.charCodeAt(job.id.length - 1)
  const random = (min: number, max: number) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min)

  const overallRating = Math.floor(random(3.2, 4.8) * 10) / 10

  return {
    overallRating,
    categories: [
      { label: '복지', icon: <Heart className="w-3 h-3" />, rating: Math.floor(random(3.0, 5.0) * 10) / 10 },
      { label: '경영진', icon: <Users className="w-3 h-3" />, rating: Math.floor(random(2.8, 4.5) * 10) / 10 },
      { label: '성장가능성', icon: <TrendingUp className="w-3 h-3" />, rating: Math.floor(random(3.5, 5.0) * 10) / 10 },
      { label: '워라밸', icon: <Clock className="w-3 h-3" />, rating: Math.floor(random(3.0, 4.8) * 10) / 10 }
    ],
    reviewCount: Math.floor(random(50, 500)),
    employeeCount: Math.floor(random(100, 2000)).toLocaleString(),
    insiderTip: [
      '복지는 좋지만 야근이 잦은 편입니다',
      '연봉 협상이 잘 되는 편이에요',
      '외국인 직원 비율이 높아 글로벌한 환경',
      '비자 스폰서십 적극적으로 지원해줍니다',
      '성장 기회는 많지만 경쟁도 치열함',
      '수평적 문화지만 의사결정은 느린 편'
    ][Math.floor(random(0, 6))],
    pros: [
      '복지 좋음, 비자 지원 적극적',
      '연봉 높음, 성장 기회 많음',
      '글로벌 환경, 영어 사용 자유로움',
      '수평적 문화, 자율성 높음'
    ][Math.floor(random(0, 4))],
    cons: [
      '야근 문화, 워라밸 아쉬움',
      '의사결정 느림, 관료적',
      '경쟁 치열, 스트레스 높음',
      '승진 기회 제한적'
    ][Math.floor(random(0, 4))]
  }
}

// 별점 컴포넌트 (애니메이션) / Star rating component with animation
function StarRating({ rating, isHovered }: { rating: number, isHovered: boolean }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        const isFilled = i < fullStars || (i === fullStars && hasHalfStar)
        return (
          <div key={i} className="relative w-3.5 h-3.5">
            <Star
              className={`w-3.5 h-3.5 transition-all duration-300 ${
                isHovered && isFilled
                  ? 'fill-yellow-400 text-yellow-400 scale-110'
                  : 'text-gray-600'
              }`}
              style={{
                transitionDelay: isHovered ? `${i * 50}ms` : '0ms'
              }}
            />
            {!isHovered && isFilled && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: i === fullStars && hasHalfStar ? '50%' : '100%' }}>
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              </div>
            )}
          </div>
        )
      })}
      <span className={`text-xs ml-1 font-semibold transition-colors ${isHovered ? 'text-yellow-400' : 'text-gray-400'}`}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

// 잡 카드 컴포넌트 / Job card component
function JobCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false)
  const review = generateReview(job)
  const dday = getDDay(job.closingDate)
  const salary = formatSalary(job)

  return (
    <div
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 border-gray-700 transition-all duration-500 hover:border-yellow-500 hover:shadow-2xl hover:shadow-yellow-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 배경 패턴 / Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        }} />
      </div>

      {/* 신뢰 배지 / Trust badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/90 backdrop-blur-sm border border-yellow-500/30 rounded-full">
          <Shield className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs font-semibold text-yellow-400">검증된 기업</span>
        </div>
      </div>

      <div className="relative p-6">
        {/* 헤더 - 블러 효과 / Header with blur */}
        <div className="mb-4">
          <div className={`relative transition-all duration-500 ${isHovered ? 'blur-none' : 'blur-sm'}`}>
            <div className="flex items-start gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-700 border-2 border-gray-600 flex-shrink-0">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
                {!isHovered && (
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center">
                    <EyeOff className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-lg truncate">
                    {isHovered ? job.company : '■■■■ 주식회사'}
                  </h3>
                  {isHovered && (
                    <Eye className="w-4 h-4 text-yellow-400 animate-pulse" />
                  )}
                </div>
                <p className="text-gray-300 font-medium text-sm truncate mb-2">
                  {job.title}
                </p>

                {/* 전체 별점 / Overall rating */}
                <div className="flex items-center gap-2">
                  <StarRating rating={review.overallRating} isHovered={isHovered} />
                  <span className="text-xs text-gray-500">({review.reviewCount}개 리뷰)</span>
                </div>
              </div>
            </div>
          </div>

          {!isHovered && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-600">
                <p className="text-xs text-gray-400 font-medium">마우스를 올려 정보 확인</p>
              </div>
            </div>
          )}
        </div>

        {/* 카테고리별 평점 / Category ratings */}
        <div className={`grid grid-cols-2 gap-2 mb-4 transition-all duration-500 ${
          isHovered ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          {review.categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 border border-gray-700"
              style={{ transitionDelay: isHovered ? `${idx * 100}ms` : '0ms' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className="text-yellow-400">{cat.icon}</div>
                <span className="text-xs font-medium text-gray-300">{cat.label}</span>
              </div>
              <StarRating rating={cat.rating} isHovered={isHovered} />
            </div>
          ))}
        </div>

        {/* 인사이더 팁 / Insider tip */}
        <div className={`mb-4 transition-all duration-500 ${
          isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg p-3 border border-yellow-600/30">
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-yellow-400 mb-1">현직자 인사이트</p>
                <p className="text-xs text-gray-300 leading-relaxed">{review.insiderTip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 장단점 / Pros & Cons */}
        <div className={`grid grid-cols-2 gap-2 mb-4 transition-all duration-500 ${
          isHovered ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="bg-green-900/20 rounded-lg p-2 border border-green-600/30">
            <p className="text-xs font-semibold text-green-400 mb-1">장점</p>
            <p className="text-xs text-gray-300 leading-relaxed">{review.pros}</p>
          </div>
          <div className="bg-red-900/20 rounded-lg p-2 border border-red-600/30">
            <p className="text-xs font-semibold text-red-400 mb-1">단점</p>
            <p className="text-xs text-gray-300 leading-relaxed">{review.cons}</p>
          </div>
        </div>

        {/* 근무 정보 / Work info */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs truncate">{job.employmentType ?? job.boardType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs truncate font-semibold text-yellow-400">{salary}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs truncate">{review.employeeCount}명</span>
          </div>
        </div>

        {/* 비자 정보 / Visa info */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">지원 가능 비자</p>
          <div className="flex flex-wrap gap-1.5">
            {(job.visaTypes ?? []).slice(0, 4).map((visa, idx) => {
              const colors = getVisaColor(visa)
              return (
                <span
                  key={idx}
                  className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-md border border-current/20 transition-transform ${
                    isHovered ? 'scale-105' : ''
                  }`}
                  style={{ transitionDelay: isHovered ? `${idx * 50}ms` : '0ms' }}
                >
                  {visa}
                </span>
              )
            })}
            {(job.visaTypes ?? []).length > 4 && (
              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-semibold rounded-md">
                +{(job.visaTypes ?? []).length - 4}
              </span>
            )}
          </div>
        </div>

        {/* 푸터 / Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center gap-2">
            {dday && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                dday === '마감'
                  ? 'bg-gray-700 text-gray-400'
                  : dday === '상시모집'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {dday}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {new Date(job.postedDate).toLocaleDateString('ko-KR')}
            </span>
          </div>

          <button className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            isHovered
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30 scale-105'
              : 'bg-gray-700 text-gray-300'
          }`}>
            {isHovered ? '지원하기' : '상세보기'}
          </button>
        </div>
      </div>

      {/* 호버 글로우 효과 / Hover glow effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-orange-500/10 animate-pulse" />
        </div>
      )}
    </div>
  )
}

// 메인 페이지 / Main page
export default function G054Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black py-12 px-4">
      {/* 헤더 / Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{designInfo.name}</h1>
              <p className="text-gray-400">Design ID: {designInfo.id} • Category: {designInfo.category}</p>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed mb-4">{designInfo.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-800 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30">
              Anonymous Reviews
            </span>
            <span className="px-3 py-1 bg-gray-800 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30">
              Star Animations
            </span>
            <span className="px-3 py-1 bg-gray-800 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30">
              Blur Effect
            </span>
            <span className="px-3 py-1 bg-gray-800 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30">
              Dark Theme
            </span>
            <span className="px-3 py-1 bg-gray-800 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-500/30">
              Trust Focused
            </span>
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.slice(0, 9).map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* 디자인 설명 / Design notes */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Design Notes
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold">•</span>
              <span><strong className="text-yellow-400">Anonymous + Trust:</strong> Blind-style dark theme with JobPlanet review system, trust badges for credibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold">•</span>
              <span><strong className="text-yellow-400">Blur Effect:</strong> Company info blurred by default, reveals on hover with eye icon animation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold">•</span>
              <span><strong className="text-yellow-400">Animated Stars:</strong> Star ratings fill sequentially on hover with scale effect and delay timing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold">•</span>
              <span><strong className="text-yellow-400">Category Ratings:</strong> 4 key metrics (복지, 경영진, 성장가능성, 워라밸) with icons and individual ratings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold">•</span>
              <span><strong className="text-yellow-400">Insider Tips:</strong> Anonymous employee insights in highlighted box with award icon</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold">•</span>
              <span><strong className="text-yellow-400">Pros/Cons:</strong> Side-by-side review summary in green/red themed boxes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold">•</span>
              <span><strong className="text-yellow-400">Hover Transform:</strong> Full card transitions from blurred mystery to detailed review on hover</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
