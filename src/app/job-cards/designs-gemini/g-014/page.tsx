'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Heart, Eye, ThumbsUp, Share2, Bookmark, Award, MapPin, Clock, Calendar, Briefcase } from 'lucide-react';

// 디자인 정보 / Design Information
const designInfo = {
  id: 'g-014',
  name: 'Behance 포트폴리오 (Behance Portfolio)',
  category: 'creative',
  reference: 'Behance',
  description: 'Behance 스타일의 프로젝트 카드 디자인. 대형 히어로 이미지, 블루 악센트, 소유자 아바타, 호버 시 이미지 줌과 상세 정보 오버레이.',
  author: 'Gemini'
};

export default function BehancePortfolioDesign() {
  return (
    <div className="min-h-screen bg-white">
      {/* 디자인 정보 헤더 / Design Info Header */}
      <div className="bg-gradient-to-r from-[#1769ff] to-[#0057e7] text-white py-8 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-8 h-8" />
            <h1 className="text-3xl font-bold">{designInfo.name}</h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">ID: {designInfo.id}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Category: {designInfo.category}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Reference: {designInfo.reference}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Author: {designInfo.author}</span>
          </div>
          <p className="mt-3 text-white/90 max-w-3xl">{designInfo.description}</p>
        </div>
      </div>

      {/* 공고 카드 그리드 / Job Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleJobsV2.map((job) => (
            <BehanceJobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Behance 스타일 공고 카드 컴포넌트 / Behance-style Job Card Component
function BehanceJobCard({ job }: { job: MockJobPostingV2 }) {
  const dDay = getDDay(job.closingDate);
  const timeAgo = getTimeAgo(job.postedDate);

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300">
      {/* 히어로 이미지 영역 (60% 높이) / Hero Image Section (60% height) */}
      <div className="relative h-80 overflow-hidden bg-gray-100">
        {/* 산업 이미지 / Industry Image */}
        <img
          src={job.industryImage}
          alt={job.industry}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* 오버레이 (호버 시 나타남) / Overlay (appears on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {/* 급여 정보 / Salary Info */}
            <div className="mb-3">
              <div className="text-xs text-white/70 mb-1">급여 / Salary</div>
              <div className="text-xl font-bold">{formatSalary(job)}</div>
            </div>

            {/* 비자 정보 / Visa Info */}
            <div className="mb-3">
              <div className="text-xs text-white/70 mb-2">지원 가능 비자 / Eligible Visas</div>
              <div className="flex flex-wrap gap-1">
                {job.allowedVisas.slice(0, 4).map((visa) => (
                  <span
                    key={visa}
                    className="px-2 py-1 text-xs rounded bg-white/20 backdrop-blur-sm border border-white/30"
                  >
                    {visa}
                  </span>
                ))}
                {job.allowedVisas.length > 4 && (
                  <span className="px-2 py-1 text-xs rounded bg-white/20 backdrop-blur-sm border border-white/30">
                    +{job.allowedVisas.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* 복리후생 / Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div>
                <div className="text-xs text-white/70 mb-2">복리후생 / Benefits</div>
                <div className="flex flex-wrap gap-1">
                  {job.benefits.slice(0, 3).map((benefit, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded bg-[#1769ff]/30 backdrop-blur-sm border border-[#1769ff]/50"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 상단 배지들 / Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {job.isUrgent && (
            <span className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-full shadow-lg">
              🔥 급구
            </span>
          )}
          {job.isFeatured && (
            <span className="px-3 py-1 text-xs font-bold bg-[#1769ff] text-white rounded-full shadow-lg">
              ⭐ 추천
            </span>
          )}
          {job.tierType === 'PREMIUM' && (
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg">
              👑 프리미엄
            </span>
          )}
        </div>

        {/* D-Day 표시 / D-Day Display */}
        {dDay && (
          <div className="absolute top-4 right-4 px-3 py-1 text-xs font-bold bg-black/70 text-white rounded-full backdrop-blur-sm">
            {dDay}
          </div>
        )}

        {/* 북마크 버튼 / Bookmark Button */}
        <button className="absolute top-4 right-16 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100">
          <Bookmark className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* 카드 하단 정보 영역 (40% 높이) / Card Bottom Info Section (40% height) */}
      <div className="p-6">
        {/* 공고 제목 / Job Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1769ff] transition-colors">
          {job.title}
        </h3>

        {/* 회사 정보 + 위치 / Company Info + Location */}
        <div className="flex items-center gap-3 mb-4">
          {/* 회사 로고 또는 이니셜 / Company Logo or Initial */}
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1769ff] flex items-center justify-center text-white font-bold border-2 border-gray-200">
              {job.companyInitial}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{job.company}</div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
        </div>

        {/* 산업 분야 / Industry */}
        <div className="mb-4">
          <span
            className="inline-block px-3 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: `${getIndustryColor(job.industry)}20`,
              color: getIndustryColor(job.industry)
            }}
          >
            {job.industry}
          </span>
        </div>

        {/* 근무 조건 / Work Conditions */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            <span>{job.boardType}</span>
          </div>
          {job.workHours && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{job.workHours}</span>
            </div>
          )}
          {job.experienceRequired && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{job.experienceRequired}</span>
            </div>
          )}
        </div>

        {/* 하단 메타 정보 / Bottom Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* 좋아요 & 조회수 / Likes & Views */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="flex items-center gap-1 hover:text-[#1769ff] transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>{job.applicantCount}</span>
            </button>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{job.viewCount}</span>
            </div>
          </div>

          {/* 게시 시간 / Posted Time */}
          <div className="text-xs text-gray-400">
            {timeAgo}
          </div>
        </div>

        {/* 매칭 점수 (있는 경우) / Match Score (if available) */}
        {job.matchScore !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">매칭 점수 / Match Score</span>
              <span className="text-sm font-bold text-[#1769ff]">{job.matchScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1769ff] to-[#0057e7] rounded-full transition-all duration-500"
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
