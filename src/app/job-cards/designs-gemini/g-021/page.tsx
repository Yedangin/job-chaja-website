'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Heart, MessageCircle, Share2, Music, Bookmark, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import { useState } from 'react';

/**
 * g-021: TikTok Feed Design
 * TikTok 스타일 피드형 공고 카드 - 풀스크린 세로형 디자인
 *
 * Features / 특징:
 * - Fullscreen vertical layout / 풀스크린 세로형 레이아웃
 * - Industry image as background / 업종 이미지 배경
 * - Right sidebar actions (like, comment, share, bookmark) / 우측 액션 버튼
 * - Bottom overlay with job info / 하단 텍스트 오버레이
 * - Hashtag visa types / 비자 해시태그
 * - Music disc animation on hover / 음악 디스크 애니메이션
 * - Auto-scroll text overflow / 텍스트 자동 스크롤
 *
 * Reference: TikTok
 * Category: Interactive
 */

export default function G021Page() {
  const [likedJobs, setLikedJobs] = useState<Set<string>>(new Set());
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());

  const toggleLike = (jobId: string) => {
    setLikedJobs(prev => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const toggleBookmark = (jobId: string) => {
    setBookmarkedJobs(prev => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Design Info Header */}
      {/* 디자인 정보 헤더 */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white p-8 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Music className="w-8 h-8" />
            <h1 className="text-3xl font-bold">g-021: TikTok Feed</h1>
          </div>
          <p className="text-pink-100 mb-4">
            TikTok-style vertical fullscreen feed with industry backgrounds, sidebar actions, and hashtag visa tags
            <br />
            업종 배경 이미지, 사이드바 액션, 비자 해시태그가 있는 TikTok 스타일 세로형 풀스크린 피드
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">📱 Fullscreen Vertical</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">🎵 Music Animation</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">❤️ Interactive Actions</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">#️⃣ Hashtag Visas</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">🖼️ Industry Images</span>
          </div>
        </div>
      </div>

      {/* TikTok Feed Container */}
      {/* TikTok 피드 컨테이너 */}
      <div className="snap-y snap-mandatory overflow-y-scroll h-screen">
        {sampleJobsV2.map((job, index) => {
          const isLiked = likedJobs.has(job.id);
          const isBookmarked = bookmarkedJobs.has(job.id);
          const dDay = getDDay(job.closingDate);
          const timeAgo = getTimeAgo(job.postedDate);

          return (
            <div
              key={job.id}
              className="relative h-screen w-full snap-start group"
            >
              {/* Background Image with Overlay */}
              {/* 배경 이미지 및 오버레이 */}
              <div className="absolute inset-0">
                <img
                  src={job.industryImage}
                  alt={job.industry}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
              </div>

              {/* Top Bar */}
              {/* 상단 바 */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {job.companyInitial}
                      </div>
                    )}
                    {job.isFeatured && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs">✨</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {job.company}
                    </h3>
                    <p className="text-white/70 text-xs">{timeAgo}</p>
                  </div>
                </div>

                {/* Music Note Icon */}
                {/* 음악 노트 아이콘 */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:animate-spin">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Right Sidebar Actions */}
              {/* 우측 사이드바 액션 */}
              <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-10">
                {/* Like Button */}
                {/* 좋아요 버튼 */}
                <button
                  onClick={() => toggleLike(job.id)}
                  className="flex flex-col items-center gap-1 group/like"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isLiked
                      ? 'bg-red-500 scale-110'
                      : 'bg-white/20 backdrop-blur-md hover:bg-white/30'
                  }`}>
                    <Heart
                      className={`w-7 h-7 transition-all ${
                        isLiked
                          ? 'text-white fill-white'
                          : 'text-white group-hover/like:scale-110'
                      }`}
                    />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {(job.viewCount || 0) + (isLiked ? 1 : 0)}
                  </span>
                </button>

                {/* Comment Button */}
                {/* 댓글 버튼 */}
                <button className="flex flex-col items-center gap-1 group/comment">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all">
                    <MessageCircle className="w-7 h-7 text-white group-hover/comment:scale-110 transition-transform" />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {job.applicantCount || 0}
                  </span>
                </button>

                {/* Share Button */}
                {/* 공유 버튼 */}
                <button className="flex flex-col items-center gap-1 group/share">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all">
                    <Share2 className="w-7 h-7 text-white group-hover/share:scale-110 transition-transform" />
                  </div>
                  <span className="text-white text-xs font-semibold">Share</span>
                </button>

                {/* Bookmark Button */}
                {/* 북마크 버튼 */}
                <button
                  onClick={() => toggleBookmark(job.id)}
                  className="flex flex-col items-center gap-1 group/bookmark"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isBookmarked
                      ? 'bg-yellow-500 scale-110'
                      : 'bg-white/20 backdrop-blur-md hover:bg-white/30'
                  }`}>
                    <Bookmark
                      className={`w-7 h-7 transition-all ${
                        isBookmarked
                          ? 'text-white fill-white'
                          : 'text-white group-hover/bookmark:scale-110'
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Bottom Content Overlay */}
              {/* 하단 콘텐츠 오버레이 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-10">
                {/* Badges */}
                {/* 배지 */}
                <div className="flex gap-2 mb-3">
                  {job.isUrgent && (
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                      🔥 URGENT
                    </span>
                  )}
                  {job.isFeatured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      ⭐ FEATURED
                    </span>
                  )}
                  {job.tierType === 'PREMIUM' && (
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                      👑 PREMIUM
                    </span>
                  )}
                  {dDay && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full">
                      ⏰ {dDay}
                    </span>
                  )}
                </div>

                {/* Job Title with Auto-scroll */}
                {/* 공고 제목 (자동 스크롤) */}
                <div className="mb-3 overflow-hidden">
                  <h2 className="text-white text-2xl font-bold group-hover:animate-marquee whitespace-nowrap">
                    {job.title}
                  </h2>
                </div>

                {/* Company Info */}
                {/* 회사 정보 */}
                <div className="flex items-center gap-4 mb-3 text-white/90">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                </div>

                {/* Salary */}
                {/* 급여 */}
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-white text-xl font-bold">
                    {formatSalary(job)}
                  </span>
                </div>

                {/* Visa Hashtags */}
                {/* 비자 해시태그 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.allowedVisas.slice(0, 5).map((visa, idx) => (
                    <span
                      key={idx}
                      className="text-white text-sm font-semibold hover:underline cursor-pointer"
                    >
                      #{visa.replace(/-/g, '')}
                    </span>
                  ))}
                  {job.allowedVisas.length > 5 && (
                    <span className="text-white/70 text-sm">
                      +{job.allowedVisas.length - 5}
                    </span>
                  )}
                </div>

                {/* Benefits Pills */}
                {/* 복리후생 알약 */}
                {job.benefits && job.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.slice(0, 3).map((benefit, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                    {job.benefits.length > 3 && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full">
                        +{job.benefits.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Apply Button */}
                {/* 지원하기 버튼 */}
                <button className="w-full mt-4 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all shadow-2xl">
                  Apply Now / 지금 지원하기 🚀
                </button>
              </div>

              {/* Scroll Indicator */}
              {/* 스크롤 표시 */}
              {index < sampleJobsV2.length - 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 animate-bounce">
                  <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-end justify-center pb-2">
                    <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom CSS for Marquee Animation */}
      {/* 마퀴 애니메이션 커스텀 CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .group:hover .group-hover\\:animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
