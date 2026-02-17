'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { MapPin, Clock, Users, Briefcase, Heart, Eye, Calendar, Navigation, TrendingUp, Home } from 'lucide-react';
import { useState } from 'react';

// 디자인 정보 / Design Info
const designInfo = {
  id: 'g-011',
  name: '당근마켓 동네 (Karrot Local)',
  category: 'creative',
  reference: '당근마켓',
  description: '동네 기반 따뜻한 오렌지 톤, 거리 정보 표시, 호버 시 지도 핀 애니메이션',
  author: 'Gemini'
};

// 거리 계산 시뮬레이션 (실제로는 위치 API 사용) / Distance calculation simulation
const getDistance = (jobId: string): string => {
  const distances = ['0.5km', '0.8km', '1.2km', '1.5km', '2.3km', '3.1km'];
  const index = parseInt(jobId.slice(-1), 10) % distances.length;
  return distances[index];
};

// 동네 이름 추출 / Extract neighborhood name
const getNeighborhood = (location: string): string => {
  const parts = location.split(' ');
  return parts[parts.length - 1] || location;
};

export default function G011KarrotLocalDesign() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedJobs, setLikedJobs] = useState<Set<string>>(new Set());

  // 좋아요 토글 / Toggle like
  const toggleLike = (jobId: string) => {
    setLikedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* 헤더 섹션 / Header Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 text-white py-16 px-8 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <Home className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight">{designInfo.name}</h1>
              <p className="text-orange-100 text-lg mt-1">Design ID: {designInfo.id}</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mt-6 border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-orange-100 font-medium">Category:</span>
                <span className="ml-2 font-semibold">{designInfo.category}</span>
              </div>
              <div>
                <span className="text-orange-100 font-medium">Reference:</span>
                <span className="ml-2 font-semibold">{designInfo.reference}</span>
              </div>
              <div>
                <span className="text-orange-100 font-medium">Author:</span>
                <span className="ml-2 font-semibold">{designInfo.author}</span>
              </div>
              <div>
                <span className="text-orange-100 font-medium">Jobs:</span>
                <span className="ml-2 font-semibold">{sampleJobsV2.length}</span>
              </div>
            </div>
            <p className="text-white/90 mt-4 leading-relaxed text-base">{designInfo.description}</p>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 / Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* 상단 필터 바 / Top Filter Bar */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
          <div className="flex items-center gap-6 text-sm">
            <button className="px-5 py-2 bg-orange-500 text-white rounded-full font-semibold shadow-md hover:bg-orange-600 transition-colors">
              우리 동네
            </button>
            <button className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
              근처 동네
            </button>
            <button className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
              전체 지역
            </button>
            <div className="ml-auto flex items-center gap-2 text-gray-600">
              <Navigation className="w-4 h-4 text-orange-500" />
              <span className="font-medium">가까운 순</span>
            </div>
          </div>
        </div>

        {/* 공고 그리드 / Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => {
            const dday = getDDay(job.closingDate);
            const isLiked = likedJobs.has(job.id);
            const isHovered = hoveredId === job.id;
            const distance = getDistance(job.id);
            const neighborhood = getNeighborhood(job.location);

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-orange-300 group cursor-pointer"
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* 이미지 섹션 / Image Section */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                  {job.industryImage ? (
                    <img
                      src={job.industryImage}
                      alt={job.industry}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase className="w-20 h-20 text-orange-300" />
                    </div>
                  )}

                  {/* 그라데이션 오버레이 / Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* 상단 배지들 / Top Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {job.isFeatured && (
                      <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        인기
                      </span>
                    )}
                    {job.isUrgent && (
                      <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                        급구
                      </span>
                    )}
                  </div>

                  {/* 좋아요 버튼 / Like Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(job.id);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    />
                  </button>

                  {/* 거리 표시 (호버 시 애니메이션) / Distance Display with Animation */}
                  <div
                    className={`absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg transition-all duration-300 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    <div className={`relative ${isHovered ? 'animate-bounce' : ''}`}>
                      <MapPin className="w-5 h-5 text-orange-500" />
                      {isHovered && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-800">{distance}</span>
                  </div>

                  {/* 회사 로고 / Company Logo */}
                  {job.companyLogo && (
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-200">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* 콘텐츠 섹션 / Content Section */}
                <div className="p-6">
                  {/* 동네 태그 / Neighborhood Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                      {neighborhood}
                    </span>
                    <span className="text-xs text-gray-500">{getTimeAgo(job.postedDate)}</span>
                  </div>

                  {/* 제목 / Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* 회사명 / Company Name */}
                  <p className="text-sm text-gray-600 mb-4 font-medium">{job.company}</p>

                  {/* 급여 정보 / Salary Info */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatSalary(job)}
                    </div>
                  </div>

                  {/* 근무 정보 / Work Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{job.workHours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-orange-500" />
                      <span>{job.experienceRequired}</span>
                    </div>
                  </div>

                  {/* 비자 태그들 / Visa Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.allowedVisas.slice(0, 3).map((visa) => (
                      <span
                        key={visa}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg"
                        style={{
                          backgroundColor: `${getVisaColor(visa)}20`,
                          color: getVisaColor(visa)
                        }}
                      >
                        {visa}
                      </span>
                    ))}
                    {job.allowedVisas.length > 3 && (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg">
                        +{job.allowedVisas.length - 3}
                      </span>
                    )}
                  </div>

                  {/* 하단 정보 / Bottom Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{job.viewCount}</span>
                      </div>
                    </div>
                    {dday && (
                      <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                        dday.includes('마감')
                          ? 'bg-red-100 text-red-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {dday}
                      </div>
                    )}
                  </div>
                </div>

                {/* 호버 시 지도 미리보기 오버레이 / Hover Map Preview Overlay */}
                {isHovered && (
                  <div className="absolute inset-0 bg-orange-500/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 shadow-2xl relative">
                      <MapPin className="w-16 h-16 text-orange-500 animate-bounce" />
                      <div className="absolute inset-0 border-4 border-white rounded-full animate-ping opacity-75" />
                    </div>
                    <h4 className="text-white text-2xl font-bold mb-2">우리 동네에서</h4>
                    <p className="text-orange-100 text-lg font-semibold mb-4">{distance} 거리</p>
                    <div className="flex gap-3">
                      <button className="px-6 py-3 bg-white text-orange-600 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                        지도 보기
                      </button>
                      <button className="px-6 py-3 bg-orange-600 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                        상세 보기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 여백 / Bottom Spacing */}
      <div className="h-20" />
    </div>
  );
}
