'use client';

import React, { useState } from 'react';
import {
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MapPin,
  Briefcase,
  DollarSign,
  TrendingUp,
  Shield,
  Users
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2
} from '../_mock/job-mock-data-v2';

// 디자인 정보 / Design information
export const designInfo = {
  id: 'g-026',
  name: '블라인드 익명 (Blind Anonymous)',
  category: '유니크',
  reference: '블라인드 (Blind)',
  description: 'Blind-inspired anonymous job cards with blurred company names that reveal on hover. Features fake employee comments, upvote/downvote counts, and salary ranges. Dark, forum-style layout emphasizing anonymity.',
  author: 'Gemini'
};

// 익명 댓글 데이터 / Anonymous comment data
const anonymousComments = [
  { id: 1, company: '이 회사', text: '야근 적고 복지 괜찮음', votes: 42, isPositive: true },
  { id: 2, company: '여기', text: '면접 분위기 좋았어요', votes: 28, isPositive: true },
  { id: 3, company: '이곳', text: '연봉협상 여지 있음', votes: 35, isPositive: true },
  { id: 4, company: '저기', text: '업무량 많은 편', votes: 15, isPositive: false },
  { id: 5, company: '여기요', text: '성장 기회 많음', votes: 51, isPositive: true },
  { id: 6, company: '이 기업', text: '외국인 동료 많아서 좋음', votes: 38, isPositive: true }
];

// 익명 사용자 아바타 / Anonymous user avatar
const AnonymousAvatar: React.FC<{ seed: number }> = ({ seed }) => {
  const colors = ['bg-gray-600', 'bg-gray-500', 'bg-gray-700', 'bg-slate-600', 'bg-zinc-600'];
  const color = colors[seed % colors.length];

  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
      익
    </div>
  );
};

// 블러 처리된 회사명 컴포넌트 / Blurred company name component
const BlurredCompany: React.FC<{ company: string; isHovered: boolean }> = ({ company, isHovered }) => {
  const maskedName = company.slice(0, 1) + '•'.repeat(company.length - 1);

  return (
    <div className="relative inline-block">
      <span className={`transition-all duration-300 ${isHovered ? 'blur-none opacity-100' : 'blur-sm opacity-70'}`}>
        {isHovered ? company : maskedName}
      </span>
      {!isHovered && (
        <span className="ml-2 text-xs text-gray-500">(hover to reveal)</span>
      )}
    </div>
  );
};

// 직무 카드 컴포넌트 / Job card component
const BlindJobCard: React.FC<{ job: MockJobPostingV2; commentIndex: number }> = ({ job, commentIndex }) => {
  const [isHovered, setIsHovered] = useState(false);
  const comment = anonymousComments[commentIndex % anonymousComments.length];
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job.boardType, job.hourlyWage, job.salaryMin, job.salaryMax);

  return (
    <div
      className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition-all border border-gray-700 hover:border-gray-600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 헤더: 익명 사용자 정보 / Header: Anonymous user info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AnonymousAvatar seed={commentIndex} />
          <div>
            <div className="text-gray-400 text-xs">익명 {commentIndex + 1}번</div>
            <div className="text-gray-500 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {job.postedDate}
            </div>
          </div>
        </div>

        {/* 투표 버튼 / Vote buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors">
            <ThumbsUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-300">{comment.votes}</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors">
            <ThumbsDown className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-300">3</span>
          </button>
        </div>
      </div>

      {/* 회사명 (블러 처리) / Company name (blurred) */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <h3 className="text-lg font-bold text-white">
            <BlurredCompany company={job.company} isHovered={isHovered} />
          </h3>
        </div>

        {/* 직무 제목 / Job title */}
        <h4 className="text-base text-gray-200 mb-2">{job.title}</h4>

        {/* 업종 배지 / Industry badge */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Briefcase className="w-3 h-3" />
          <span>{job.industry}</span>
          {job.tierType === 'PREMIUM' && (
            <span className="px-2 py-0.5 bg-yellow-900/30 text-yellow-400 rounded-full text-xs">
              프리미엄
            </span>
          )}
        </div>
      </div>

      {/* 연봉 정보 (강조) / Salary info (emphasized) */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700/30 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-400">예상 연봉 범위</span>
        </div>
        <div className="text-xl font-bold text-green-400">{salary}</div>
        {job.matchScore && (
          <div className="flex items-center gap-1 mt-1 text-xs text-blue-400">
            <TrendingUp className="w-3 h-3" />
            <span>시장 평균 대비 +{job.matchScore}%</span>
          </div>
        )}
      </div>

      {/* 근무 조건 / Work conditions */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{job.workHours}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Users className="w-4 h-4 text-gray-500" />
          <span>{job.experienceRequired}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span className={`${job.boardType === 'FULL_TIME' ? 'text-blue-400' : 'text-purple-400'}`}>
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
        </div>
      </div>

      {/* 비자 정보 / Visa information */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-2">채용 가능 비자</div>
        <div className="flex flex-wrap gap-1">
          {job.allowedVisas.slice(0, 4).map((visa, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 rounded text-xs font-medium ${getVisaColor(visa)}`}
            >
              {visa}
            </span>
          ))}
          {job.allowedVisas.length > 4 && (
            <span className="px-2 py-1 rounded text-xs text-gray-400 bg-gray-700">
              +{job.allowedVisas.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* 현직자 댓글 섹션 / Employee comment section */}
      <div className="border-t border-gray-700 pt-3 mb-3">
        <div className="flex items-start gap-2 bg-gray-900/50 rounded p-3">
          <MessageSquare className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">
              {comment.company} 현직자 ({isHovered ? job.company : '익명'})
            </div>
            <div className={`text-sm ${comment.isPositive ? 'text-green-400' : 'text-yellow-400'}`}>
              "{comment.text}"
            </div>
          </div>
        </div>
      </div>

      {/* 하단 메타 정보 / Bottom meta info */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{job.viewCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{Math.floor(job.viewCount / 10)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{job.applicantCount}명 지원</span>
          </div>
        </div>

        <div className={`font-medium ${
          dday.includes('마감') ? 'text-red-400' :
          parseInt(dday.replace(/\D/g, '')) <= 7 ? 'text-yellow-400' :
          'text-gray-400'
        }`}>
          {dday}
        </div>
      </div>

      {/* 호버 시 상세 보기 프롬프트 / Hover detail prompt */}
      {isHovered && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            상세 정보 보기
          </button>
        </div>
      )}
    </div>
  );
};

// 메인 페이지 컴포넌트 / Main page component
export default function BlindAnonymousDesignPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* 디자인 헤더 / Design header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-850 rounded-lg p-6 border border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{designInfo.name}</h1>
                <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-sm">
                  {designInfo.category}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{designInfo.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Reference:</span>
                  <span className="text-blue-400">{designInfo.reference}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Author:</span>
                  <span className="text-gray-300">{designInfo.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-mono text-gray-300">{designInfo.id}</span>
                </div>
              </div>
            </div>
            <Shield className="w-12 h-12 text-blue-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* 안내 메시지 / Guide message */}
      <div className="max-w-7xl mx-auto mb-6 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm text-blue-300 font-medium mb-1">
              익명 채용 정보 게시판
            </div>
            <div className="text-xs text-gray-400">
              회사명은 기본적으로 일부만 공개됩니다. 카드에 마우스를 올리면 전체 정보가 표시됩니다.
              현직자 댓글과 투표 기능을 통해 실제 근무 환경을 파악할 수 있습니다.
            </div>
          </div>
        </div>
      </div>

      {/* 직무 카드 그리드 / Job cards grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobsV2.map((job, index) => (
          <BlindJobCard key={job.id} job={job} commentIndex={index} />
        ))}
      </div>

      {/* 푸터 노트 / Footer note */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-sm text-gray-500">
        <p>💡 이 디자인은 블라인드(Blind)의 익명 포럼 스타일에서 영감을 받았습니다</p>
        <p className="mt-1">호버 효과로 블러가 해제되며, 현직자 댓글과 투표 시스템이 특징입니다</p>
      </div>
    </div>
  );
}
