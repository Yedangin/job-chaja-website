'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Flame,
  Crown,
  Star,
  TrendingUp,
  Award,
  DollarSign
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2
} from '../_mock/job-mock-data-v2';

// Design information / 디자인 정보
const designInfo = {
  id: 'g-035',
  name: '잡코리아×잡플래닛',
  category: '프리미엄',
  reference: '잡코리아 + 잡플래닛',
  description: 'JobKorea의 그라데이션 헤더와 JobPlanet의 기업 평점 시스템을 결합한 디자인. 블루-퍼플 그라데이션 헤더, 별점 바, 리뷰 미리보기 슬라이드 효과를 포함한 전문적인 한국 채용 사이트 스타일.',
  author: 'Gemini'
};

// Mock company review data / 모의 기업 리뷰 데이터
const getCompanyReview = (companyName: string) => {
  const reviews = [
    { rating: 4.2, snippet: "워라밸이 좋고 복지가 탄탄합니다", ratingCount: 1247 },
    { rating: 4.5, snippet: "글로벌 기업 문화와 성장 기회", ratingCount: 892 },
    { rating: 3.8, snippet: "안정적인 근무환경과 복지제도", ratingCount: 634 },
    { rating: 4.7, snippet: "혁신적이고 자유로운 업무 분위기", ratingCount: 2103 },
    { rating: 4.1, snippet: "체계적인 교육과 경력 개발 지원", ratingCount: 456 },
    { rating: 4.3, snippet: "수평적 문화와 좋은 동료들", ratingCount: 781 }
  ];

  const hash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return reviews[hash % reviews.length];
};

// Job card component / 공고 카드 컴포넌트
function JobCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false);
  const dDay = getDDay(job.closingDate);
  const review = getCompanyReview(job.company);

  // Calculate rating distribution / 평점 분포 계산
  const ratingDistribution = [
    { stars: 5, percentage: 45 },
    { stars: 4, percentage: 30 },
    { stars: 3, percentage: 15 },
    { stars: 2, percentage: 7 },
    { stars: 1, percentage: 3 }
  ];

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient header with company info / 그라데이션 헤더 with 기업 정보 */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-4 relative overflow-hidden">
        {/* Background pattern / 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
          }} />
        </div>

        <div className="relative flex items-start justify-between">
          {/* Company logo and name / 기업 로고 및 이름 */}
          <div className="flex items-center gap-3 flex-1">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-14 h-14 rounded-lg object-cover bg-white p-1 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-white shadow-md flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-600">
                  {job.companyInitial}
                </span>
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">
                {job.company}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                  <span className="text-white text-sm font-semibold">
                    {review.rating}
                  </span>
                </div>
                <span className="text-white/80 text-xs">
                  리뷰 {review.ratingCount.toLocaleString()}개
                </span>
              </div>
            </div>
          </div>

          {/* Badges / 뱃지 */}
          <div className="flex flex-col gap-1.5 ml-2">
            {job.isFeatured && (
              <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
                <Crown className="w-3 h-3" />
                <span>추천</span>
              </div>
            )}
            {job.isUrgent && (
              <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
                <Flame className="w-3 h-3" />
                <span>급구</span>
              </div>
            )}
            {job.tierType === 'PREMIUM' && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
                프리미엄
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review snippet bar / 리뷰 스니펫 바 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2.5 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <p className="text-sm text-gray-700 italic line-clamp-1">
            "{review.snippet}"
          </p>
        </div>
      </div>

      {/* Main content / 메인 콘텐츠 */}
      <div className="p-5">
        {/* Job title / 공고 제목 */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[56px]">
          {job.title}
        </h2>

        {/* Location and experience / 위치 및 경력 */}
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          {job.experienceRequired && (
            <>
              <span className="text-gray-300">|</span>
              <span>경력 {job.experienceRequired}</span>
            </>
          )}
        </div>

        {/* Salary / 급여 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-3 py-2.5">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-lg font-bold text-green-700">
              {formatSalary(job)}
            </span>
          </div>
        </div>

        {/* Star rating bar / 별점 바 */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">기업 평가</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(review.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : i < review.rating
                      ? 'fill-yellow-200 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            {ratingDistribution.slice(0, 3).map((dist) => (
              <div key={dist.stars} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-8">{dist.stars}점</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{dist.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Allowed visas / 허용 비자 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {job.allowedVisas.slice(0, 4).map((visa) => {
              const colors = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`${colors.bg} ${colors.text} px-2.5 py-1 rounded-full text-xs font-medium`}
                >
                  {visa}
                </span>
              );
            })}
            {job.allowedVisas.length > 4 && (
              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                +{job.allowedVisas.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Stats footer / 통계 푸터 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{job.applicantCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{job.viewCount}</span>
            </div>
            {job.matchScore && (
              <div className="flex items-center gap-1 text-indigo-600 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{job.matchScore}% 매칭</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className={dDay <= 3 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
              D-{dDay}
            </span>
          </div>
        </div>
      </div>

      {/* Review preview slide-up panel / 리뷰 미리보기 슬라이드 패널 */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-white border-t-2 border-indigo-500 shadow-2xl transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '60%' }}
      >
        <div className="p-4 overflow-y-auto h-full">
          {/* Panel header / 패널 헤더 */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              직원 리뷰
            </h4>
            <div className="flex items-center gap-1 text-indigo-600 font-semibold">
              <Star className="w-4 h-4 fill-indigo-600" />
              <span>{review.rating}</span>
            </div>
          </div>

          {/* Sample reviews / 샘플 리뷰 */}
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">현직원 · 1개월 전</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {review.snippet} 팀워크가 좋고 성장할 수 있는 환경입니다.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-3 h-3 fill-gray-200 text-gray-200" />
                </div>
                <span className="text-xs text-gray-500">전직원 · 2개월 전</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                복지 제도가 잘 되어있고 외국인 직원들도 많아서 좋습니다.
              </p>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">현직원 · 3주 전</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                글로벌 환경에서 다양한 프로젝트를 경험할 수 있어 좋습니다.
              </p>
            </div>
          </div>

          {/* View all reviews button / 전체 리뷰 보기 버튼 */}
          <button className="w-full mt-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all text-sm">
            전체 리뷰 {review.ratingCount.toLocaleString()}개 보기
          </button>
        </div>
      </div>
    </div>
  );
}

// Main page component / 메인 페이지 컴포넌트
export default function G035Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header / 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{designInfo.name}</h1>
              <div className="flex items-center gap-3 text-blue-100">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {designInfo.category}
                </span>
                <span className="text-sm">Reference: {designInfo.reference}</span>
              </div>
            </div>
          </div>
          <p className="text-blue-100 max-w-3xl leading-relaxed">
            {designInfo.description}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-200">
            <span>Design ID: {designInfo.id}</span>
            <span>•</span>
            <span>Created by {designInfo.author}</span>
          </div>
        </div>
      </div>

      {/* Job cards grid / 공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Design info footer / 디자인 정보 푸터 */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-indigo-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-indigo-600" />
            Design Features / 디자인 특징
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Key Features / 주요 기능
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Blue-to-purple gradient headers with company branding / 블루-퍼플 그라데이션 헤더</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Star rating bar with distribution percentages / 별점 바와 분포 퍼센티지</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Review snippet section for quick insights / 리뷰 스니펫 섹션</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Slide-up review preview panel on hover / 호버 시 슬라이드 리뷰 패널</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Professional Korean job site aesthetic / 전문적인 한국 채용 사이트 디자인</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span>Company rating integration with job postings / 기업 평가 통합</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Design Reference / 디자인 레퍼런스
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span><strong>잡코리아 (JobKorea):</strong> Gradient headers, professional layout / 그라데이션 헤더, 전문적 레이아웃</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span><strong>잡플래닛 (JobPlanet):</strong> Company ratings, review system, star bars / 기업 평점, 리뷰 시스템, 별점 바</span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-gray-700">
                  <strong>Hover Interaction:</strong> Slide-up panel reveals detailed company reviews with star ratings and employee feedback snippets.
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>호버 인터랙션:</strong> 슬라이드 패널이 올라오며 상세 기업 리뷰와 별점, 직원 피드백이 표시됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
