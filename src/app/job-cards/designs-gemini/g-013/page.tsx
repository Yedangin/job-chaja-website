'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Heart, Eye, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { useState } from 'react';

// 디자인 정보 객체 / Design info object
const designInfo = {
  id: 'g-013',
  name: 'Dribbble 아트 (Dribbble Art)',
  category: 'creative',
  reference: 'Dribbble',
  description: 'Dribbble-inspired portfolio card design with rounded corners, pink accents, and like animation hover effect',
  author: 'Gemini'
};

export default function DribbbleArtJobCards() {
  // 각 카드의 좋아요 상태 관리 / Manage like state for each card
  const [likedCards, setLikedCards] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

  // 좋아요 토글 / Toggle like
  const toggleLike = (jobId: number, initialCount: number) => {
    setLikedCards(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));

    setLikeCounts(prev => ({
      ...prev,
      [jobId]: prev[jobId] !== undefined
        ? (likedCards[jobId] ? prev[jobId] - 1 : prev[jobId] + 1)
        : initialCount + 1
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* 디자인 정보 헤더 / Design info header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full">
                  {designInfo.id}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  {designInfo.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {designInfo.name}
              </h1>
              <p className="text-gray-600">{designInfo.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Reference</div>
              <div className="text-lg font-semibold text-gray-900">{designInfo.reference}</div>
              <div className="text-xs text-gray-400 mt-1">by {designInfo.author}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 / Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 포트폴리오 스타일 그리드 / Portfolio-style grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {sampleJobsV2.map((job) => {
            const dday = getDDay(job.closingDate);
            const isLiked = likedCards[job.id] || false;
            const displayLikeCount = likeCounts[job.id] !== undefined
              ? likeCounts[job.id]
              : job.applicantCount;

            return (
              <div
                key={job.id}
                className="break-inside-avoid group"
              >
                <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* 산업 이미지 (히어로 이미지) / Industry image (hero image) */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                    {job.industryImage ? (
                      <img
                        src={job.industryImage}
                        alt={job.industry}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-white opacity-20">
                          {job.companyInitial}
                        </span>
                      </div>
                    )}

                    {/* 오버레이 액션 버튼 / Overlay action buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                          <Bookmark size={18} className="text-gray-700" />
                        </button>
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                          <Share2 size={18} className="text-gray-700" />
                        </button>
                      </div>
                    </div>

                    {/* 긴급/추천 배지 / Urgent/Featured badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {job.isUrgent && (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                          긴급
                        </span>
                      )}
                      {job.isFeatured && (
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                          ★ 추천
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 카드 콘텐츠 / Card content */}
                  <div className="p-6">
                    {/* 회사 정보 (크리에이터 스타일) / Company info (creator style) */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                        style={{ backgroundColor: getIndustryColor(job.industry) }}
                      >
                        {job.companyInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {job.company}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getTimeAgo(job.postedDate)}
                        </div>
                      </div>
                    </div>

                    {/* 공고 제목 / Job title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-pink-600 transition-colors cursor-pointer">
                      {job.title}
                    </h3>

                    {/* 급여 정보 / Salary info */}
                    <div className="mb-4">
                      <div className="text-xl font-bold text-gray-900">
                        {formatSalary(job)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {job.location} · {job.boardType}
                      </div>
                    </div>

                    {/* 비자 태그 / Visa tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.allowedVisas.slice(0, 3).map((visa, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: `${getVisaColor(visa)}20`,
                            color: getVisaColor(visa)
                          }}
                        >
                          {visa}
                        </span>
                      ))}
                      {job.allowedVisas.length > 3 && (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          +{job.allowedVisas.length - 3}
                        </span>
                      )}
                    </div>

                    {/* 통계 및 좋아요 / Stats and likes */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        {/* 좋아요 버튼 (호버 애니메이션) / Like button (hover animation) */}
                        <button
                          onClick={() => toggleLike(job.id, job.applicantCount)}
                          className="flex items-center gap-1.5 group/like hover:scale-110 transition-transform"
                        >
                          <Heart
                            size={18}
                            className={`transition-all duration-300 ${
                              isLiked
                                ? 'fill-pink-500 text-pink-500 scale-110'
                                : 'text-gray-400 group-hover/like:text-pink-500'
                            }`}
                          />
                          <span className={`text-sm font-semibold ${
                            isLiked ? 'text-pink-600' : 'text-gray-600'
                          }`}>
                            {displayLikeCount}
                          </span>
                        </button>

                        {/* 조회수 / View count */}
                        <div className="flex items-center gap-1.5">
                          <Eye size={18} className="text-gray-400" />
                          <span className="text-sm font-semibold text-gray-600">
                            {job.viewCount}
                          </span>
                        </div>

                        {/* 댓글 (메시지) / Comments (messages) */}
                        <div className="flex items-center gap-1.5">
                          <MessageCircle size={18} className="text-gray-400" />
                          <span className="text-sm font-semibold text-gray-600">
                            {Math.floor(job.applicantCount * 0.3)}
                          </span>
                        </div>
                      </div>

                      {/* D-day / Closing date */}
                      {dday && (
                        <div className={`text-sm font-bold ${
                          dday.includes('-')
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}>
                          {dday}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dribbble 스타일 푸터 / Dribbble-style footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart size={16} className="fill-pink-500 text-pink-500" />
              <span className="font-semibold text-gray-900">JobChaja</span>
            </div>
            <p>Inspired by Dribbble's creative portfolio design</p>
          </div>
        </div>
      </div>
    </div>
  );
}
