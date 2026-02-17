'use client'

import { useState } from 'react'
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Heart, MapPin, Clock, Eye, Users, Briefcase, Search, TrendingUp } from 'lucide-react'

export default function G042Page() {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  // Toggle wishlist / 찜 토글
  const toggleWishlist = (jobId: string) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(jobId)) {
      newWishlist.delete(jobId)
    } else {
      newWishlist.add(jobId)
    }
    setWishlist(newWishlist)
  }

  // Calculate time ago (Karrot style) / 시간 전 계산 (당근 스타일)
  const getTimeAgo = (dateString: string): string => {
    const posted = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - posted.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return '방금 전'
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays === 1) return '어제'
    if (diffDays < 7) return `${diffDays}일 전`
    return posted.toLocaleDateString('ko-KR')
  }

  // Generate random distance (Karrot style) / 랜덤 거리 생성 (당근 스타일)
  const getDistance = (jobId: string): string => {
    const hash = jobId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const km = (hash % 50) / 10 + 0.5
    return `${km.toFixed(1)}km`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-white">
      {/* Naver-style Header with Search / 네이버 스타일 헤더 및 검색 */}
      <header className="bg-white border-b-2 border-[#03C75A] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#03C75A] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                N
              </div>
              <div className="w-10 h-10 bg-[#FF6F0F] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                K
              </div>
              <h1 className="text-2xl font-bold text-gray-800 ml-2">일자리 마켓</h1>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="지역, 직종, 회사명으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 border-2 border-[#03C75A] rounded-full focus:outline-none focus:border-[#FF6F0F] transition-colors"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Filter Pills (Naver Shopping style) / 필터 칩 (네이버 쇼핑 스타일) */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {['전체', '신입환영', '경력직', '외국인환영', '급여높은순', '최신등록순'].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:border-[#03C75A] hover:text-[#03C75A] whitespace-nowrap transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleJobsV2.map((job) => {
            const dday = getDDay(job.closingDate)
            const salary = formatSalary(job)
            const timeAgo = getTimeAgo(job.postedDate)
            const distance = getDistance(job.id)
            const isWishlisted = wishlist.has(job.id)

            return (
              <div
                key={job.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 relative border border-gray-200 hover:border-[#FF6F0F]"
              >
                {/* AD Badge for Premium/Featured (Naver style) / 프리미엄/추천 광고 배지 */}
                {(job.isFeatured || job.tierType === 'PREMIUM') && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-[#03C75A] to-[#02A048] text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                    광고 AD
                  </div>
                )}

                {/* Wishlist Button (Naver 찜 style) / 찜 버튼 */}
                <button
                  onClick={() => toggleWishlist(job.id)}
                  className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      isWishlisted
                        ? 'fill-[#FF6F0F] text-[#FF6F0F] scale-110'
                        : 'text-gray-400 group-hover:text-[#FF6F0F]'
                    }`}
                  />
                </button>

                {/* Industry Image (Naver Shopping product image style) / 산업 이미지 */}
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-orange-100 overflow-hidden">
                  <img
                    src={job.industryImage}
                    alt={job.industry}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {job.isUrgent && (
                    <div className="absolute bottom-3 left-3 bg-[#FF6F0F] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      <TrendingUp className="w-3 h-3" />
                      급구
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                  {/* Company Info (Karrot seller style) / 회사 정보 */}
                  <div className="flex items-center gap-3 mb-3">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-10 h-10 rounded-full border-2 border-[#03C75A]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#03C75A] to-[#02A048] text-white font-bold flex items-center justify-center text-sm">
                        {job.companyInitial}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{job.company}</h3>
                      <p className="text-xs text-gray-500">{timeAgo}</p>
                    </div>
                  </div>

                  {/* Job Title */}
                  <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-[#FF6F0F] transition-colors">
                    {job.title}
                  </h4>

                  {/* Salary (Naver Shopping price style) / 급여 (네이버 쇼핑 가격 스타일) */}
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-[#FF6F0F]">
                      {salary}
                    </div>
                    {job.hourlyWage && (
                      <div className="text-sm text-gray-600">
                        시급 {job.hourlyWage.toLocaleString()}원
                      </div>
                    )}
                  </div>

                  {/* Location with Karrot distance / 위치 및 거리 정보 */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-[#FF6F0F]" />
                    <span className="truncate">{job.location}</span>
                    <span className="text-[#03C75A] font-medium ml-auto whitespace-nowrap">
                      {distance}
                    </span>
                  </div>

                  {/* Visa Tags (using getVisaColor) / 비자 태그 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.allowedVisas.slice(0, 3).map((visa) => {
                      const colors = getVisaColor(visa)
                      return (
                        <span
                          key={visa}
                          className={`${colors.bg} ${colors.text} text-xs px-2 py-1 rounded-full font-medium`}
                        >
                          {visa}
                        </span>
                      )
                    })}
                    {job.allowedVisas.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                        +{job.allowedVisas.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Footer Stats (Naver + Karrot hybrid) / 하단 통계 */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{job.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount}</span>
                      </div>
                    </div>
                    {dday && (
                      <div className={`font-bold ${
                        dday === '마감' ? 'text-red-500' :
                        dday === '상시모집' ? 'text-[#03C75A]' :
                        'text-[#FF6F0F]'
                      }`}>
                        {dday}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Overlay: Distance Info Popup (Karrot style) / 호버 오버레이: 거리 정보 팝업 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-gray-900 shadow-xl">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#FF6F0F] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-[#FF6F0F] mb-1">
                            {distance} 떨어져요
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{job.workHours}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{job.experienceRequired}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Score Badge (bottom-right) / 매칭 점수 배지 */}
                {job.matchScore && (
                  <div className="absolute bottom-5 right-5 bg-gradient-to-r from-[#03C75A] to-[#02A048] text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    매칭 {job.matchScore}%
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Load More Button (Naver style) / 더보기 버튼 */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-white border-2 border-[#03C75A] text-[#03C75A] font-bold rounded-full hover:bg-[#03C75A] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">
            더 많은 일자리 보기
          </button>
        </div>
      </main>

      {/* Floating Stats Panel (Naver Shopping style) / 플로팅 통계 패널 */}
      <div className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-2xl p-5 border-2 border-[#FF6F0F] hidden lg:block">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#FF6F0F]" />
          실시간 인기
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#03C75A]">1</span>
            <span className="text-gray-600">외국인 환영 레스토랑</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#03C75A]">2</span>
            <span className="text-gray-600">IT 개발자 정규직</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#03C75A]">3</span>
            <span className="text-gray-600">호텔 서빙 알바</span>
          </div>
        </div>
      </div>
    </div>
  )
}
