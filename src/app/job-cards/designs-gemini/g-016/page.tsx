'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Play, Pause, Heart, MoreHorizontal, Music, MapPin, Clock, DollarSign, Briefcase, Users } from 'lucide-react';
import { useState } from 'react';

// 디자인 정보 / Design information
const designInfo = {
  id: 'g-016',
  name: 'Spotify 뮤직 (Spotify Music)',
  category: 'platform',
  reference: 'Spotify',
  description: 'Spotify-inspired dark theme with music player UI, album art style job cards, green accent colors, and play button hover interactions',
  author: 'Gemini',
  features: [
    'Dark background (#121212)',
    'Spotify Green (#1DB954) accent',
    'Album art = industryImage',
    'Music player progress bar for D-day',
    'Play button on hover',
    'Track list style layout'
  ]
};

export default function G016SpotifyMusic() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // 재생 토글 핸들러 / Play toggle handler
  const togglePlay = (jobId: number) => {
    setPlayingId(playingId === jobId ? null : jobId);
  };

  // 좋아요 토글 핸들러 / Like toggle handler
  const toggleLike = (jobId: number) => {
    const newLiked = new Set(likedJobs);
    if (newLiked.has(jobId)) {
      newLiked.delete(jobId);
    } else {
      newLiked.add(jobId);
    }
    setLikedJobs(newLiked);
  };

  // D-day를 진행률로 변환 (0-100%) / Convert D-day to progress percentage
  const getDDayProgress = (closingDate: string): number => {
    const now = new Date();
    const closing = new Date(closingDate);
    const total = 30; // 30일 기준
    const remaining = Math.ceil((closing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const progress = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
    return progress;
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* 헤더 - 디자인 정보 / Header - Design Info */}
      <div className="bg-gradient-to-b from-[#1DB954] to-[#121212] border-b border-[#282828]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-8 h-8 text-[#1DB954]" />
            <h1 className="text-4xl font-bold">{designInfo.name}</h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span>Category: {designInfo.category}</span>
            <span>•</span>
            <span>Reference: {designInfo.reference}</span>
            <span>•</span>
            <span>Author: {designInfo.author}</span>
          </div>
          <p className="mt-4 text-gray-300 max-w-3xl">{designInfo.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {designInfo.features.map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#282828] rounded-full text-xs text-gray-300"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Spotify 플레이어 스타일 헤더 / Spotify player style header */}
      <div className="sticky top-0 z-10 bg-[#181818] border-b border-[#282828]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1DB954] to-[#1ed760] rounded flex items-center justify-center">
                <Music className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">채용 플레이리스트</h2>
                <p className="text-sm text-gray-400">{sampleJobsV2.length}개의 채용공고</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Your job opportunities
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 / Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 큰 앨범 스타일 카드 (첫 번째 공고) / Large album style card (first job) */}
        <div className="mb-12">
          {sampleJobsV2.slice(0, 1).map((job) => {
            const dday = getDDay(job.closingDate);
            const progress = getDDayProgress(job.closingDate);
            const isPlaying = playingId === job.id;
            const isLiked = likedJobs.has(job.id);
            const isHovered = hoveredCard === job.id;

            return (
              <div
                key={job.id}
                className="relative group"
                onMouseEnter={() => setHoveredCard(job.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-[#181818] rounded-lg p-6 hover:bg-[#282828] transition-all duration-300">
                  <div className="flex gap-6">
                    {/* 앨범 아트 (industryImage) / Album art */}
                    <div className="relative w-64 h-64 flex-shrink-0">
                      <img
                        src={job.industryImage}
                        alt={job.industry}
                        className="w-full h-full object-cover rounded-lg shadow-2xl"
                      />
                      {/* 재생 버튼 오버레이 / Play button overlay */}
                      <div
                        className={`absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center transition-opacity duration-300 ${
                          isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <button
                          onClick={() => togglePlay(job.id)}
                          className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-110 hover:bg-[#1ed760] transition-all duration-200 shadow-xl"
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-black fill-black" />
                          ) : (
                            <Play className="w-8 h-8 text-black fill-black ml-1" />
                          )}
                        </button>
                      </div>
                      {/* 업종 배지 / Industry badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                          {job.industry}
                        </span>
                      </div>
                    </div>

                    {/* 트랙 정보 / Track info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-4xl font-bold mb-2 group-hover:text-[#1DB954] transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-3 mb-4">
                              {job.companyLogo && (
                                <img
                                  src={job.companyLogo}
                                  alt={job.companyName}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              )}
                              <span className="text-xl text-gray-300">{job.companyName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleLike(job.id)}
                              className={`p-2 rounded-full hover:bg-[#282828] transition-colors ${
                                isLiked ? 'text-[#1DB954]' : 'text-gray-400'
                              }`}
                            >
                              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 rounded-full hover:bg-[#282828] transition-colors text-gray-400">
                              <MoreHorizontal className="w-6 h-6" />
                            </button>
                          </div>
                        </div>

                        {/* 메타 정보 / Meta info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign className="w-5 h-5 text-[#1DB954]" />
                            <span>{formatSalary(job)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="w-5 h-5 text-[#1DB954]" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Briefcase className="w-5 h-5 text-[#1DB954]" />
                            <span>{job.employmentType ?? job.boardType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Users className="w-5 h-5 text-[#1DB954]" />
                            <span>{job.experienceLevel}</span>
                          </div>
                        </div>

                        {/* 비자 태그 / Visa tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.visaTypes.slice(0, 4).map((visa, index) => {
                            const colors = getVisaColor(visa);
                            return (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                              >
                                {visa}
                              </span>
                            );
                          })}
                          {job.visaTypes.length > 4 && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#282828] text-gray-300">
                              +{job.visaTypes.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 진행률 바 (D-day) / Progress bar (D-day) */}
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {dday || '마감'}
                          </span>
                          <span>{getTimeAgo(job.postedDate)}</span>
                        </div>
                        <div className="w-full h-1 bg-[#282828] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1DB954] rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 트랙 리스트 (나머지 공고들) / Track list (remaining jobs) */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold mb-6 px-4">더 많은 기회</h2>
          {sampleJobsV2.slice(1).map((job, index) => {
            const dday = getDDay(job.closingDate);
            const progress = getDDayProgress(job.closingDate);
            const isPlaying = playingId === job.id;
            const isLiked = likedJobs.has(job.id);
            const isHovered = hoveredCard === job.id;

            return (
              <div
                key={job.id}
                className="group bg-transparent hover:bg-[#282828] rounded-lg transition-all duration-200"
                onMouseEnter={() => setHoveredCard(job.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* 트랙 번호 / Track number */}
                  <div className="w-8 text-center text-gray-400 text-sm">
                    {isPlaying ? (
                      <div className="flex gap-0.5 justify-center">
                        <span className="w-0.5 h-3 bg-[#1DB954] animate-pulse" style={{ animationDelay: '0ms' }} />
                        <span className="w-0.5 h-3 bg-[#1DB954] animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-0.5 h-3 bg-[#1DB954] animate-pulse" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <span>{index + 2}</span>
                    )}
                  </div>

                  {/* 앨범 아트 썸네일 / Album art thumbnail */}
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <img
                      src={job.industryImage}
                      alt={job.industry}
                      className="w-full h-full object-cover rounded"
                    />
                    {isHovered && (
                      <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
                        <button
                          onClick={() => togglePlay(job.id)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 text-black fill-black" />
                          ) : (
                            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 트랙 정보 / Track info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate group-hover:text-[#1DB954] transition-colors">
                      {job.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      {job.companyLogo && (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span className="truncate">{job.companyName}</span>
                    </div>
                  </div>

                  {/* 업종 / Industry */}
                  <div className="hidden md:block w-32 text-sm text-gray-400 truncate">
                    {job.industry}
                  </div>

                  {/* 급여 / Salary */}
                  <div className="hidden lg:block w-40 text-sm text-gray-400">
                    {formatSalary(job)}
                  </div>

                  {/* 비자 수 / Visa count */}
                  <div className="hidden xl:block w-24 text-sm text-gray-400">
                    {job.visaTypes.length}개 비자
                  </div>

                  {/* D-day 진행률 / D-day progress */}
                  <div className="hidden xl:flex items-center gap-2 w-32">
                    <div className="flex-1 h-1 bg-[#282828] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1DB954] rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* D-day 텍스트 / D-day text */}
                  <div className="w-24 text-sm text-gray-400 text-right">
                    {dday || '마감'}
                  </div>

                  {/* 액션 버튼 / Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLike(job.id)}
                      className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                        isLiked ? 'text-[#1DB954] opacity-100' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 플레이어 바 스타일 정보 / Bottom player bar style info */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#1DB954] to-[#1ed760] rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                더 많은 채용 기회를 찾고 계신가요?
              </h3>
              <p className="text-white/90">
                프리미엄으로 업그레이드하고 무제한 공고에 지원하세요
              </p>
            </div>
            <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
              프리미엄 시작하기
            </button>
          </div>
        </div>
      </div>

      {/* 고정 하단 플레이어 (데모용) / Fixed bottom player (demo) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] z-20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center">
                <Music className="w-6 h-6 text-gray-400" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  JobChaja Player
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {sampleJobsV2.length}개의 기회
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">Powered by Spotify UI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
