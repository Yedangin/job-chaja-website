'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor } from '../_mock/job-mock-data-v2';
import { Star, MessageCircle, Clock, Award, TrendingUp } from 'lucide-react';

// 디자인 정보 / Design information
export const designInfo = {
  id: 'g-027',
  name: '크몽 프리랜서 (Kmong Freelancer)',
  category: '유니크',
  reference: '크몽',
  description: 'Kmong-style freelance service marketplace with hero images, star ratings, 3-tier pricing packages, and delivery time. Clean white cards with coral accent colors.',
  author: 'Gemini'
};

export default function G027Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 헤더 / Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{designInfo.name}</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>카테고리: {designInfo.category}</span>
          <span>•</span>
          <span>참고: {designInfo.reference}</span>
          <span>•</span>
          <span>작성자: {designInfo.author}</span>
        </div>
        <p className="mt-2 text-gray-700">{designInfo.description}</p>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => {
          const dDay = getDDay(job.closingDate);
          const deliveryDays = Math.abs(dDay) > 0 ? Math.abs(dDay) : 7; // 배달 일수 매핑 / Map to delivery days
          const rating = (job.matchScore ?? 80) / 20; // 5점 만점 평점 / Rating out of 5

          // 3단계 가격 패키지 생성 / Create 3-tier pricing packages
          const basePrice = job.hourlyWage ? job.hourlyWage * 40 : (job.salaryMin ?? 300000);
          const packages = [
            { name: 'Basic', price: Math.floor(basePrice * 0.7), features: ['기본 업무', '2회 수정'] },
            { name: 'Standard', price: basePrice, features: ['표준 업무', '5회 수정', '빠른 배송'] },
            { name: 'Premium', price: Math.floor(basePrice * 1.5), features: ['프리미엄 업무', '무제한 수정', '빠른 배송', '24시간 지원'] }
          ];

          return (
            <div
              key={job.id}
              className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* 서비스 이미지 / Service image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={job.industryImage}
                  alt={job.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* 배지 / Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {job.isFeatured && (
                    <span className="px-2 py-1 bg-coral-500 text-white text-xs font-semibold rounded">
                      추천
                    </span>
                  )}
                  {job.tierType === 'PREMIUM' && (
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded flex items-center gap-1">
                      <Award size={12} />
                      프로
                    </span>
                  )}
                </div>
                {/* 인기도 표시 / Popularity indicator */}
                {(job.viewCount ?? 0) > 100 && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded flex items-center gap-1">
                    <TrendingUp size={12} />
                    인기
                  </div>
                )}
              </div>

              {/* 카드 내용 / Card content */}
              <div className="p-5">
                {/* 판매자 프로필 / Seller profile */}
                <div className="flex items-center gap-3 mb-3">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-coral-600 font-semibold text-sm">
                      {job.companyInitial}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{job.company}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-gray-500">({job.applicantCount ?? 0})</span>
                    </div>
                  </div>
                </div>

                {/* 서비스 제목 / Service title */}
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-coral-600 transition-colors">
                  {job.title}
                </h3>

                {/* 비자 태그 / Visa tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {job.allowedVisas.slice(0, 3).map((visa) => (
                    <span
                      key={visa}
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${getVisaColor(visa)}15`,
                        color: getVisaColor(visa)
                      }}
                    >
                      {visa}
                    </span>
                  ))}
                  {job.allowedVisas.length > 3 && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      +{job.allowedVisas.length - 3}
                    </span>
                  )}
                </div>

                {/* 가격 표시 (기본값) / Price display (default) */}
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatSalary(packages[1].price, job.boardType === 'PART_TIME' ? 'hourly' : 'monthly')}
                    </span>
                    <span className="text-sm text-gray-500">~</span>
                  </div>
                </div>

                {/* 배달 일수 & 문의 수 / Delivery days & inquiries */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{deliveryDays}일 배송</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>문의 {job.viewCount ?? 0}</span>
                  </div>
                </div>

                {/* 호버 시 패키지 옵션 / Package options on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2 -mx-5 -mb-5 mt-4 bg-gray-50 p-4 rounded-b-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-2">가격 패키지 선택</p>
                  {packages.map((pkg, idx) => (
                    <button
                      key={pkg.name}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        idx === 1
                          ? 'border-coral-500 bg-white shadow-sm'
                          : 'border-gray-200 bg-white hover:border-coral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-gray-900">{pkg.name}</span>
                        <span className="text-sm font-bold text-coral-600">
                          {formatSalary(pkg.price, job.boardType === 'PART_TIME' ? 'hourly' : 'monthly')}
                        </span>
                      </div>
                      <ul className="space-y-0.5">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="text-xs text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </button>
                  ))}

                  {/* 문의하기 버튼 / Inquiry button */}
                  <button className="w-full mt-2 py-2.5 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <MessageCircle size={16} />
                    문의하기
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
