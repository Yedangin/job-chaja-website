'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Heart, Star, Truck, ShieldCheck, MapPin, Eye, Users, Calendar } from 'lucide-react';
import { useState } from 'react';

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-025',
  name: 'Naver Shopping',
  description: 'Naver Shopping product listing style with green accent, price comparison, review count, and free shipping badge',
  reference: 'Naver Shopping',
  primaryColor: '#03C75A',
  features: [
    'Green accent color (#03C75A)',
    'Product listing grid with industry image',
    'Salary as price with strikethrough comparison',
    'Star ratings from matchScore',
    'Review count (applicantCount)',
    'Free support badge (무료지원)',
    'Company as store name',
    'AD label for featured items',
    'Heart wishlist with fill animation',
    'Price comparison popup on hover',
  ],
  interactionType: 'interactive-category',
  hover: 'Heart fills + price comparison popup',
  usesIndustryImage: true,
  usesCompanyLogo: true,
};

export default function NaverShoppingDesign() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set());

  // Toggle like / 좋아요 토글
  const toggleLike = (jobId: number) => {
    setLikedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  // Calculate discount percentage / 할인율 계산
  const getDiscountPercent = (job: MockJobPostingV2): number => {
    if (job.boardType === 'PART_TIME' && job.hourlyWage) {
      const original = 12000; // 가상의 원래 시급
      return Math.round(((original - job.hourlyWage) / original) * 100);
    }
    if (job.salaryMax) {
      const original = job.salaryMax * 1.2; // 가상의 원래 급여
      return Math.round(((original - job.salaryMax) / original) * 100);
    }
    return 0;
  };

  // Format price with comparison / 가격 비교 포맷
  const getPriceComparison = (job: MockJobPostingV2) => {
    const current = formatSalary(job);
    if (job.boardType === 'PART_TIME' && job.hourlyWage) {
      return {
        current,
        original: '12,000원',
        lowest: job.hourlyWage.toLocaleString() + '원',
      };
    }
    if (job.salaryMax) {
      return {
        current,
        original: Math.round(job.salaryMax * 1.2).toLocaleString() + '만원',
        lowest: job.salaryMax.toLocaleString() + '만원',
      };
    }
    return { current, original: current, lowest: current };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header / 헤더 */}
      <header className="bg-[#03C75A] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">잡차자 쇼핑</h1>
              <span className="text-sm opacity-90">JobChaJa Shopping</span>
            </div>
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
                <Heart className="w-5 h-5" />
                <span className="text-sm">찜한공고</span>
              </button>
              <div className="text-sm">
                <span className="font-medium">{designInfo.name}</span>
                <span className="opacity-75 ml-2">{designInfo.id}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content / 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Design info / 디자인 정보 */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-[#03C75A]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-2xl font-bold text-gray-900">{designInfo.name}</h2>
                <span className="px-3 py-1 bg-[#03C75A] text-white text-xs font-semibold rounded-full">
                  {designInfo.id}
                </span>
                <span className="px-3 py-1 bg-white text-[#03C75A] text-xs font-semibold rounded-full border border-[#03C75A]">
                  Interactive
                </span>
              </div>
              <p className="text-gray-600 mb-4 max-w-3xl">{designInfo.description}</p>
              <div className="flex flex-wrap gap-2">
                {designInfo.features.slice(0, 4).map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Reference</div>
              <div className="text-lg font-bold text-[#03C75A]">{designInfo.reference}</div>
            </div>
          </div>
        </div>

        {/* Job grid / 공고 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => {
            const isHovered = hoveredId === job.id;
            const isLiked = likedJobs.has(job.id);
            const discount = getDiscountPercent(job);
            const priceComparison = getPriceComparison(job);
            const stars = Math.round((job.matchScore || 0) / 20); // Convert 0-100 to 0-5
            const dDay = getDDay(job.closingDate);

            return (
              <div
                key={job.id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Product image (industry image) / 상품 이미지 (산업 이미지) */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {job.industryImage ? (
                    <img
                      src={job.industryImage}
                      alt={job.industry}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-6xl font-bold"
                      style={{ backgroundColor: getIndustryColor(job.industry) }}
                    >
                      {job.title.charAt(0)}
                    </div>
                  )}

                  {/* AD label for featured / 광고 라벨 */}
                  {job.isFeatured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#03C75A] text-white text-xs font-bold rounded">
                      AD
                    </div>
                  )}

                  {/* Urgent badge / 긴급 배지 */}
                  {job.isUrgent && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                      급구
                    </div>
                  )}

                  {/* Wishlist heart / 찜 하트 */}
                  <button
                    onClick={() => toggleLike(job.id)}
                    className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>

                  {/* Price comparison popup / 가격 비교 팝업 */}
                  {isHovered && (
                    <div className="absolute bottom-12 right-2 bg-white rounded-lg shadow-2xl p-3 w-48 animate-in fade-in slide-in-from-bottom-2 duration-200 border border-gray-200">
                      <div className="text-xs font-bold text-gray-900 mb-2 flex items-center">
                        <BarChart2 className="w-3 h-3 mr-1 text-[#03C75A]" />
                        급여 비교
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">최저가</span>
                          <span className="font-bold text-[#03C75A]">{priceComparison.lowest}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">평균가</span>
                          <span className="text-gray-500 line-through">{priceComparison.original}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-gray-100">
                          <span className="text-gray-600">이 회사</span>
                          <span className="font-bold text-red-500">{priceComparison.current}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product info / 상품 정보 */}
                <div className="p-4">
                  {/* Company store name / 회사명 (쇼핑몰명) */}
                  <div className="flex items-center space-x-2 mb-2">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-5 h-5 rounded object-cover" />
                    ) : (
                      <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {job.companyInitial}
                      </div>
                    )}
                    <span className="text-sm text-gray-600">{job.company}</span>
                    {job.tierType === 'PREMIUM' && (
                      <ShieldCheck className="w-4 h-4 text-[#03C75A]" />
                    )}
                  </div>

                  {/* Job title (product name) / 공고 제목 (상품명) */}
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-[#03C75A] transition-colors">
                    {job.title}
                  </h3>

                  {/* Price with discount / 가격 및 할인율 */}
                  <div className="mb-2">
                    {discount > 0 && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-gray-400 line-through">{priceComparison.original}</span>
                        <span className="text-xs font-bold text-red-500">{discount}%</span>
                      </div>
                    )}
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-bold text-gray-900">{formatSalary(job)}</span>
                      {job.boardType === 'PART_TIME' && (
                        <span className="text-xs text-gray-500">/시간</span>
                      )}
                    </div>
                  </div>

                  {/* Star rating and review count / 별점 및 리뷰 수 */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < stars ? 'fill-[#03C75A] text-[#03C75A]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      리뷰 {job.applicantCount.toLocaleString()}
                    </span>
                  </div>

                  {/* Free support badge (like free shipping) / 무료지원 배지 */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 text-[#03C75A] text-xs font-medium rounded">
                      <Truck className="w-3 h-3" />
                      <span>무료지원</span>
                    </div>
                    {job.benefits.includes('기숙사') && (
                      <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                        기숙사
                      </div>
                    )}
                  </div>

                  {/* Visa tags / 비자 태그 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.allowedVisas.slice(0, 3).map((visa, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs font-medium rounded border"
                        style={{
                          backgroundColor: `${getVisaColor(visa)}15`,
                          borderColor: getVisaColor(visa),
                          color: getVisaColor(visa),
                        }}
                      >
                        {visa}
                      </span>
                    ))}
                    {job.allowedVisas.length > 3 && (
                      <span className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded">
                        +{job.allowedVisas.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Additional info / 추가 정보 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{job.viewCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{job.applicantCount}</span>
                      </div>
                    </div>
                    {dDay && (
                      <div className="flex items-center space-x-1 text-red-500 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{dDay}</span>
                      </div>
                    )}
                  </div>

                  {/* Location / 위치 */}
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features list / 기능 목록 */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Design Features / 디자인 특징</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {designInfo.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#03C75A] mt-2" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
