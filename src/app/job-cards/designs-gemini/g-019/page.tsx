'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Users, Hash, Wifi, ChevronRight, Clock, Briefcase } from 'lucide-react';

// 디자인 정보 / Design information
const designInfo = {
  id: 'g-019',
  name: 'Discord Server',
  category: 'platform',
  reference: 'Discord',
  description: 'Discord server discovery-style job cards with dark theme and blurple accent',
  features: [
    'Dark theme (#36393F background)',
    'Discord blurple (#5865F2) accent',
    'Server-style cards with member counts',
    'Online status indicators',
    'Hover join button',
    'Server tag-style visa badges'
  ],
  uses: {
    industryImage: false,
    companyLogo: true
  }
};

export default function G019DiscordServerDesign() {
  return (
    <div className="min-h-screen bg-[#36393F] text-white">
      {/* 헤더 섹션 / Header section */}
      <div className="bg-[#2F3136] border-b border-[#202225]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">채용 서버 찾기</h1>
              <p className="text-[#B9BBBE]">새로운 기회를 발견하고 참여하세요</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-[#4E5058] hover:bg-[#5865F2] rounded text-sm font-medium transition-colors">
                필터
              </button>
              <button className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] rounded text-sm font-medium transition-colors flex items-center gap-2">
                <Hash className="w-4 h-4" />
                카테고리
              </button>
            </div>
          </div>

          {/* 통계 바 / Stats bar */}
          <div className="flex items-center gap-6 text-sm text-[#B9BBBE]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5865F2]" />
              <span>{sampleJobsV2.reduce((sum, job) => sum + job.applicantCount, 0).toLocaleString()} 지원자</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#43B581]" />
              <span>{sampleJobsV2.reduce((sum, job) => sum + job.viewCount, 0).toLocaleString()} 온라인</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#FAA61A]" />
              <span>{sampleJobsV2.length}개 채용</span>
            </div>
          </div>
        </div>
      </div>

      {/* 공고 그리드 / Job grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleJobsV2.map((job) => (
            <DiscordServerCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* 디자인 정보 패널 / Design info panel */}
      <div className="fixed bottom-4 right-4 bg-[#2F3136] border border-[#202225] rounded-lg p-4 max-w-xs shadow-2xl">
        <h3 className="font-bold text-sm mb-2 text-[#5865F2]">{designInfo.id}: {designInfo.name}</h3>
        <p className="text-xs text-[#B9BBBE] mb-2">{designInfo.description}</p>
        <div className="text-xs text-[#72767D]">
          <div>Reference: {designInfo.reference}</div>
          <div>Category: {designInfo.category}</div>
        </div>
      </div>
    </div>
  );
}

// Discord 서버 카드 컴포넌트 / Discord server card component
function DiscordServerCard({ job }: { job: MockJobPostingV2 }) {
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedAt);

  // 회사 이니셜 생성 / Generate company initial
  const companyInitial = job.companyName.charAt(0).toUpperCase();

  // 온라인 멤버 수 (viewCount 기반) / Online member count
  const onlineCount = job.viewCount;
  const totalMembers = job.applicantCount + Math.floor(job.viewCount * 1.5);

  return (
    <div className="group bg-[#2F3136] rounded-lg overflow-hidden hover:bg-[#36393F] transition-all duration-200 border border-[#202225] hover:border-[#5865F2]">
      <div className="p-4">
        {/* 서버 헤더 (로고 + 이름) / Server header (logo + name) */}
        <div className="flex items-start gap-3 mb-3">
          {/* 서버 아이콘 / Server icon */}
          <div className="relative flex-shrink-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold text-lg">
                {companyInitial}
              </div>
            )}
            {/* 온라인 표시 / Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#43B581] rounded-full border-2 border-[#2F3136]"></div>
          </div>

          {/* 서버 정보 / Server info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white truncate">{job.companyName}</h3>
              {job.isVerified && (
                <div className="flex-shrink-0 w-4 h-4 bg-[#5865F2] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </div>
              )}
            </div>

            {/* 멤버 수 / Member count */}
            <div className="flex items-center gap-3 text-xs text-[#B9BBBE]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#43B581]"></div>
                <span>{onlineCount.toLocaleString()} 온라인</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#747F8D]"></div>
                <span>{totalMembers.toLocaleString()} 멤버</span>
              </div>
            </div>
          </div>
        </div>

        {/* 직무 설명 / Job description */}
        <div className="mb-3">
          <h4 className="text-white font-medium mb-1 line-clamp-1">{job.title}</h4>
          <p className="text-sm text-[#B9BBBE] line-clamp-2">{job.description ?? job.title}</p>
        </div>

        {/* 채널/정보 섹션 / Channel/info section */}
        <div className="space-y-2 mb-3 text-sm">
          <div className="flex items-center gap-2 text-[#B9BBBE]">
            <Hash className="w-4 h-4 text-[#72767D]" />
            <span className="text-xs">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[#B9BBBE]">
            <Briefcase className="w-4 h-4 text-[#72767D]" />
            <span className="text-xs">{salary}</span>
          </div>
          {dDay && (
            <div className="flex items-center gap-2 text-[#B9BBBE]">
              <Clock className="w-4 h-4 text-[#72767D]" />
              <span className="text-xs">{dDay}</span>
            </div>
          )}
        </div>

        {/* 비자 태그 (서버 태그 스타일) / Visa tags (server tag style) */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.visaTypes.slice(0, 4).map((visa, idx) => {
            const colors = getVisaColor(visa);
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#5865F2] bg-opacity-10 text-[#5865F2]"
              >
                <Hash className="w-3 h-3" />
                {visa}
              </span>
            );
          })}
          {job.visaTypes.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#4E5058] text-[#B9BBBE]">
              +{job.visaTypes.length - 4}
            </span>
          )}
        </div>

        {/* 마지막 활동 시간 / Last activity */}
        <div className="text-xs text-[#72767D] mb-3">
          마지막 활동: {timeAgo}
        </div>

        {/* 참여 버튼 (호버 시 표시) / Join button (shown on hover) */}
        <button className="w-full py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium rounded transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <span>참여하기</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 비호버 상태 정보 / Non-hover state info */}
        <div className="py-2 text-center text-sm text-[#B9BBBE] group-hover:hidden">
          {job.applicantCount.toLocaleString()}명 지원
        </div>
      </div>
    </div>
  );
}
