'use client'

import { useState } from 'react'
import { Building2, MapPin, Clock, TrendingUp, ChevronDown, Search, Star, Briefcase, DollarSign } from 'lucide-react'
import { sampleJobsV2 as jobs, formatSalary, getVisaColor, getDDay } from '../_mock/job-mock-data-v2'

// 디자인 정보 / Design Info
const designInfo = {
  id: 'g-067',
  name: '네이버×잡코리아',
  category: 'platform',
  description: 'Naver search portal + JobKorea job board hybrid with integrated search and clean list layout',
  features: [
    'Naver green gradient header with search bar',
    'AD label for premium/featured posts',
    'Integrated autocomplete search feel',
    'Clean list/card hybrid layout',
    'Search context highlighting',
    'Hover: Autocomplete dropdown + gradient header expansion'
  ],
  colors: {
    primary: '#03C75A', // Naver green
    secondary: '#00C73C',
    accent: '#1EC800',
    background: '#F5F7FA'
  }
}

export default function G067Page() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 검색 자동완성 추천어 / Search autocomplete suggestions
  const suggestions = [
    '외국인 가능 일자리',
    'E-7 비자 채용',
    '서울 IT 개발자',
    '호텔 조리사 구인',
    '영어 강사 채용'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20">
      {/* 네이버 스타일 헤더 / Naver-style Header */}
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          searchFocused ? 'shadow-2xl' : 'shadow-md'
        }`}
        style={{
          background: searchFocused
            ? 'linear-gradient(135deg, #03C75A 0%, #00B050 50%, #1EC800 100%)'
            : 'linear-gradient(90deg, #03C75A 0%, #00C73C 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* 로고 + 검색 / Logo + Search */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <Search className="w-5 h-5 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                잡차자<span className="text-green-100 text-sm ml-2">외국인 채용</span>
              </h1>
            </div>

            {/* 통합 검색창 / Integrated Search Bar */}
            <div className="flex-1 relative">
              <div className={`relative transition-all duration-300 ${
                searchFocused ? 'scale-105' : 'scale-100'
              }`}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="직무, 회사, 비자 종류로 검색하세요"
                  className="w-full h-14 pl-6 pr-32 rounded-full text-gray-800 text-lg border-2 border-white/50 focus:border-white focus:outline-none shadow-lg placeholder:text-gray-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all shadow-md">
                  검색
                </button>
              </div>

              {/* 자동완성 드롭다운 / Autocomplete Dropdown */}
              {searchFocused && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm text-gray-600 font-medium">추천 검색어</p>
                  </div>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="w-full px-6 py-3 text-left hover:bg-green-50 transition-colors flex items-center gap-3 group"
                    >
                      <Search className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                      <span className="text-gray-700 group-hover:text-green-700 group-hover:font-medium">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 헤더 액션 / Header Actions */}
            <div className="flex items-center gap-3">
              <button className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-colors backdrop-blur-sm">
                로그인
              </button>
              <button className="px-5 py-2 bg-white text-green-600 hover:bg-green-50 rounded-full font-bold transition-colors shadow-md">
                회원가입
              </button>
            </div>
          </div>

          {/* 필터 태그 / Filter Tags */}
          <div className="flex items-center gap-3 mt-4">
            <button className="px-4 py-1.5 bg-white/90 hover:bg-white text-green-600 rounded-full text-sm font-medium transition-colors shadow-sm">
              전체
            </button>
            <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-colors backdrop-blur-sm">
              E-7 비자
            </button>
            <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-colors backdrop-blur-sm">
              서울
            </button>
            <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-colors backdrop-blur-sm">
              IT·개발
            </button>
            <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-colors backdrop-blur-sm flex items-center gap-1">
              필터
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 디자인 정보 패널 / Design Info Panel */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 shadow-lg border-2 border-green-400">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                  {designInfo.category.toUpperCase()}
                </span>
                <h2 className="text-2xl font-bold text-white">{designInfo.name}</h2>
                <span className="text-green-100 font-mono text-sm">({designInfo.id})</span>
              </div>
              <p className="text-green-50 leading-relaxed max-w-3xl">
                {designInfo.description}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#03C75A] shadow-md"></div>
              <div className="w-8 h-8 rounded-lg bg-[#00C73C] shadow-md"></div>
              <div className="w-8 h-8 rounded-lg bg-[#1EC800] shadow-md"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 헤더 / Results Header */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-gray-700">
              총 <span className="text-green-600 font-bold text-lg">{jobs.length}</span>건의 채용공고
            </p>
            <div className="h-4 w-px bg-gray-300"></div>
            <p className="text-sm text-gray-500">외국인 채용 가능</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all">
              <option>최신순</option>
              <option>인기순</option>
              <option>마감임박순</option>
              <option>연봉순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 공고 리스트 / Job List */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="space-y-4">
          {jobs.map((job) => {
            const isHovered = hoveredId === job.id
            const visaColor = getVisaColor((job.allowedVisas ?? [])[0] ?? 'E-7')
            const dday = getDDay(job.deadline ?? job.closingDate)
            const isPremium = job.id % 3 === 0 // 프리미엄 공고 시뮬레이션

            return (
              <div
                key={job.id}
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                  isHovered
                    ? 'border-green-400 shadow-2xl -translate-y-1 scale-[1.01]'
                    : 'border-gray-100 shadow-md hover:shadow-lg'
                }`}
              >
                {/* AD 라벨 / AD Label */}
                {isPremium && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      AD
                    </div>
                  </div>
                )}

                {/* 호버 그라데이션 오버레이 / Hover Gradient Overlay */}
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 pointer-events-none"></div>
                )}

                <div className="p-6">
                  <div className="flex gap-6">
                    {/* 회사 로고 / Company Logo */}
                    <div className={`relative shrink-0 transition-transform duration-300 ${
                      isHovered ? 'scale-110 rotate-3' : 'scale-100'
                    }`}>
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-gray-200 shadow-md">
                        <Building2 className="w-10 h-10 text-gray-400" />
                      </div>
                      {isPremium && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                          <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                    </div>

                    {/* 공고 정보 / Job Info */}
                    <div className="flex-1 min-w-0">
                      {/* 타이틀 / Title */}
                      <div className="mb-3">
                        <h3 className={`text-xl font-bold text-gray-900 mb-1 transition-colors ${
                          isHovered ? 'text-green-600' : ''
                        }`}>
                          {job.title}
                        </h3>
                        <p className="text-base text-gray-600 font-medium">{job.company}</p>
                      </div>

                      {/* 메타 정보 그리드 / Meta Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-600 truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-900 font-semibold">{formatSalary(job)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-600">{job.experience ?? job.experienceRequired ?? ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-600">{job.employmentType ?? job.boardType}</span>
                        </div>
                      </div>

                      {/* 비자 + 태그 / Visa + Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                          style={{
                            backgroundColor: visaColor.bg,
                            color: visaColor.text
                          }}
                        >
                          {(job.allowedVisas ?? [])[0] ?? ''}
                        </span>
                        {(job.tags ?? job.techStack ?? []).slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-green-50 hover:text-green-700 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 우측 액션 영역 / Right Action Area */}
                    <div className="flex flex-col items-end justify-between shrink-0">
                      {/* D-day + 조회수 / D-day + Views */}
                      <div className="text-right space-y-2">
                        {dday && (
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            dday.includes('오늘')
                              ? 'bg-red-100 text-red-700'
                              : dday.includes('마감')
                              ? 'bg-gray-100 text-gray-500'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {dday}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <TrendingUp className="w-4 h-4" />
                          <span>{(job.id * 47) % 500 + 50}</span>
                        </div>
                      </div>

                      {/* 지원 버튼 / Apply Button */}
                      <button
                        className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-md ${
                          isHovered
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-105 shadow-xl'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isHovered ? '지원하기' : '상세보기'}
                      </button>
                    </div>
                  </div>

                  {/* 호버 시 추가 정보 / Additional Info on Hover */}
                  {isHovered && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {job.description ?? job.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button className="p-2 hover:bg-green-50 rounded-lg transition-colors group">
                            <Star className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:fill-current transition-colors" />
                          </button>
                          <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                            <TrendingUp className="w-5 h-5 text-gray-400 hover:text-green-600 transition-colors" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 프리미엄 하단 그라데이션 / Premium Bottom Gradient */}
                {isPremium && (
                  <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
                )}
              </div>
            )
          })}
        </div>

        {/* 더보기 버튼 / Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
            더 많은 공고 보기
          </button>
        </div>
      </div>

      {/* 네이버 스타일 푸터 / Naver-style Footer */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 잡차자. 외국인 채용의 새로운 기준.
          </p>
        </div>
      </div>
    </div>
  )
}
