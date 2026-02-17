'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Pin, ExternalLink, MapPin, Clock, Users, Award, TrendingUp } from 'lucide-react';
import { useState } from 'react';

// 디자인 정보 / Design Information
const designInfo = {
  id: 'g-015',
  name: 'Pinterest 핀 (Pinterest Pin)',
  category: 'creative',
  reference: 'Pinterest',
  description: '메이슨리 레이아웃의 이미지 중심 카드. 다양한 비율로 표시되며, 호버 시 어두워지며 저장 버튼과 링크가 나타남. 산업 이미지가 주요 시각 요소.',
  author: 'Gemini'
};

export default function G015Page() {
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // 저장 토글 / Toggle save
  const toggleSave = (jobId: number) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  // 카드 높이 다양성을 위한 클래스 배열 / Height variation classes for masonry effect
  const heightClasses = [
    'h-[480px]', // 긴 카드 / Tall card
    'h-[420px]', // 중간 카드 / Medium card
    'h-[360px]', // 짧은 카드 / Short card
    'h-[500px]', // 매우 긴 카드 / Extra tall card
    'h-[400px]', // 중간 카드 / Medium card
    'h-[440px]'  // 중간-긴 카드 / Medium-tall card
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 디자인 정보 헤더 / Design Info Header */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100 py-8 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#e60023] flex items-center justify-center shadow-lg">
              <Pin className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{designInfo.name}</h1>
              <p className="text-sm text-gray-600">Design ID: {designInfo.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-red-100">
              <div className="text-xs text-gray-500 mb-1">Category</div>
              <div className="font-semibold text-gray-900 capitalize">{designInfo.category}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-red-100">
              <div className="text-xs text-gray-500 mb-1">Reference</div>
              <div className="font-semibold text-gray-900">{designInfo.reference}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-red-100">
              <div className="text-xs text-gray-500 mb-1">Author</div>
              <div className="font-semibold text-gray-900">{designInfo.author}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-red-100">
              <div className="text-xs text-gray-500 mb-1">Features</div>
              <div className="font-semibold text-gray-900">메이슨리, 이미지 중심</div>
            </div>
          </div>
          <p className="text-gray-700 mt-4 leading-relaxed">{designInfo.description}</p>
        </div>
      </div>

      {/* 메이슨리 그리드 / Masonry Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {sampleJobsV2.map((job, index) => {
            const dday = getDDay(job.closingDate);
            const isHovered = hoveredCard === job.id;
            const isSaved = savedJobs.has(job.id);

            return (
              <div
                key={job.id}
                className="break-inside-avoid mb-6"
                onMouseEnter={() => setHoveredCard(job.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`${heightClasses[index]} rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 relative group`}>
                  {/* 산업 이미지 배경 / Industry Image Background */}
                  <div className="absolute inset-0">
                    <img
                      src={job.industryImage}
                      alt={job.industry}
                      className="w-full h-full object-cover"
                    />
                    {/* 그라데이션 오버레이 (항상 표시) / Gradient Overlay (Always visible) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* 호버 시 어두운 오버레이 / Dark Overlay on Hover */}
                    <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                  </div>

                  {/* 상단 배지 영역 / Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                    <div className="flex flex-col gap-2">
                      {job.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-lg">
                          <Award className="w-3 h-3" />
                          추천
                        </span>
                      )}
                      {job.isUrgent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg animate-pulse">
                          <Clock className="w-3 h-3" />
                          급구
                        </span>
                      )}
                      {job.tierType === 'PREMIUM' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-lg">
                          ✨ 프리미엄
                        </span>
                      )}
                    </div>

                    {/* 회사 이니셜 아바타 / Company Initial Avatar */}
                    <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="text-sm font-bold text-gray-700">{job.companyInitial}</span>
                    </div>
                  </div>

                  {/* 저장 버튼 (호버 시 표시) / Save Button (Shown on Hover) */}
                  <div className={`absolute top-4 right-16 z-20 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(job.id);
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isSaved
                          ? 'bg-[#e60023] text-white'
                          : 'bg-white/95 text-gray-700 hover:bg-[#e60023] hover:text-white'
                      }`}
                    >
                      <Pin className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* 외부 링크 버튼 (호버 시 표시) / External Link Button (Shown on Hover) */}
                  <div className={`absolute top-4 right-4 z-20 transition-all duration-300 ${isHovered && !isSaved ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  {/* 중앙 매칭 점수 (선택 카드에만) / Center Match Score (Selected cards only) */}
                  {job.matchScore !== undefined && index % 2 === 0 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl border-2 border-white">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="text-2xl font-bold text-gray-900">{job.matchScore}%</span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">비자 매칭률</p>
                      </div>
                    </div>
                  )}

                  {/* 하단 정보 영역 / Bottom Info Section */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    {/* 회사명 / Company Name */}
                    <div className="mb-2">
                      <span className="text-white/90 text-sm font-medium">{job.company}</span>
                    </div>

                    {/* 공고 제목 / Job Title */}
                    <h3 className="text-white text-xl font-bold mb-3 leading-tight line-clamp-2">
                      {job.title}
                    </h3>

                    {/* 급여 정보 / Salary Info */}
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-white">
                        {formatSalary(job)}
                      </span>
                    </div>

                    {/* 메타 정보 / Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{job.applicantCount}명 지원</span>
                      </div>
                    </div>

                    {/* 비자 태그 / Visa Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {job.allowedVisas.slice(0, 4).map((visa) => (
                        <span
                          key={visa}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm"
                        >
                          {visa}
                        </span>
                      ))}
                      {job.allowedVisas.length > 4 && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm">
                          +{job.allowedVisas.length - 4}
                        </span>
                      )}
                    </div>

                    {/* 마감일 / Closing Date */}
                    {dday && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm">
                        <Clock className="w-3.5 h-3.5 text-red-600" />
                        <span className="text-xs font-bold text-red-600">{dday}</span>
                      </div>
                    )}
                  </div>

                  {/* 호버 시 추가 정보 표시 (선택 카드) / Additional Info on Hover (Selected cards) */}
                  {isHovered && job.benefits && job.benefits.length > 0 && index % 3 === 0 && (
                    <div className="absolute bottom-32 left-5 right-5 z-10 transition-all duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                        <p className="text-xs text-gray-500 mb-1.5">복리후생</p>
                        <div className="flex flex-wrap gap-1.5">
                          {job.benefits.slice(0, 3).map((benefit, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
