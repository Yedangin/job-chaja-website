'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Hash, MessageSquare, AtSign, Smile, ThumbsUp, Bookmark, MoreHorizontal, Users, Clock, MapPin, ChevronDown, Plus, Search } from 'lucide-react';
import { useState } from 'react';

// 디자인 정보 객체 / Design info object
const designInfo = {
  id: 'g-018',
  name: 'Slack Message',
  category: 'platform',
  reference: 'Slack',
  features: ['Channel Structure', 'Timestamp', 'Emoji Reactions', 'Thread Count'],
  hover: 'Emoji reaction bar appears',
  industryImage: false,
  companyLogo: true
};

export default function SlackMessageDesign() {
  const [hoveredJob, setHoveredJob] = useState<number | null>(null);
  const [selectedChannel, setSelectedChannel] = useState('#채용-전체');

  // 채널 목록 / Channel list
  const channels = [
    { name: '#채용-전체', count: 6 },
    { name: '#채용-제조', count: 2 },
    { name: '#채용-IT', count: 1 },
    { name: '#채용-서비스', count: 2 },
    { name: '#채용-물류', count: 1 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 디자인 정보 헤더 / Design info header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8" />
            <h1 className="text-3xl font-bold">{designInfo.name}</h1>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              {designInfo.category}
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-purple-200">Design ID:</span>
              <span className="ml-2 font-mono font-semibold">{designInfo.id}</span>
            </div>
            <div>
              <span className="text-purple-200">Reference:</span>
              <span className="ml-2 font-semibold">{designInfo.reference}</span>
            </div>
            <div>
              <span className="text-purple-200">Hover Effect:</span>
              <span className="ml-2 font-semibold">{designInfo.hover}</span>
            </div>
            <div>
              <span className="text-purple-200">Features:</span>
              <span className="ml-2 font-semibold">{designInfo.features.join(', ')}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${designInfo.industryImage ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>Industry Image: {designInfo.industryImage ? 'YES' : 'NO'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${designInfo.companyLogo ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>Company Logo: {designInfo.companyLogo ? 'YES' : 'NO'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slack 워크스페이스 레이아웃 / Slack workspace layout */}
      <div className="flex h-screen">
        {/* 좌측 사이드바 / Left sidebar */}
        <div className="w-64 bg-[#4A154B] text-white flex flex-col">
          {/* 워크스페이스 헤더 / Workspace header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">잡차자 채용</h2>
              <ChevronDown className="w-5 h-5" />
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="채널 검색..."
                className="w-full bg-white/10 border border-white/20 rounded px-9 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>

          {/* 채널 목록 / Channels list */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                <span className="font-semibold">채널</span>
                <Plus className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <button
                    key={channel.name}
                    onClick={() => setSelectedChannel(channel.name)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-sm transition-colors ${
                      selectedChannel === channel.name
                        ? 'bg-[#1164A3] text-white'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span>{channel.name.replace('#채용-', '')}</span>
                    </div>
                    {channel.count > 0 && (
                      <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                        {channel.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 다이렉트 메시지 섹션 / Direct messages section */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                <span className="font-semibold">다이렉트 메시지</span>
                <Plus className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-white/90 hover:bg-white/10 cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>HR 담당자</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 / Main content area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 채널 헤더 / Channel header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-bold">{selectedChannel.replace('#', '')}</h3>
              <div className="ml-auto flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Users className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <Bookmark className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* 메시지 영역 (채용공고) / Messages area (job postings) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {sampleJobsV2.map((job) => {
              const dDay = getDDay(job.closingDate);
              const salary = formatSalary(job);
              const timeAgo = getTimeAgo(job.postedAt);

              return (
                <div
                  key={job.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredJob(job.id)}
                  onMouseLeave={() => setHoveredJob(null)}
                >
                  {/* 메시지 컨테이너 / Message container */}
                  <div className="flex gap-3">
                    {/* 회사 로고 (프로필 사진) / Company logo (profile picture) */}
                    <div className="flex-shrink-0">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-10 h-10 rounded object-cover"
                      />
                    </div>

                    {/* 메시지 내용 / Message content */}
                    <div className="flex-1 min-w-0">
                      {/* 발신자 및 타임스탬프 / Sender and timestamp */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-gray-900">{job.companyName}</span>
                        <span className="text-xs text-gray-500">{timeAgo}</span>
                      </div>

                      {/* 공고 제목 (메시지 텍스트) / Job title (message text) */}
                      <div className="text-gray-900 mb-2 leading-relaxed">
                        <strong className="text-blue-600 hover:underline cursor-pointer">
                          {job.jobTitle}
                        </strong>
                      </div>

                      {/* 첨부파일 형식 상세 정보 / Attachment-style details */}
                      <div className="border-l-4 border-gray-300 bg-gray-50 p-3 rounded-r space-y-2 max-w-2xl">
                        {/* 급여 정보 / Salary info */}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-700">💰 급여:</span>
                          <span className="text-gray-900">{salary}</span>
                        </div>

                        {/* 근무지 / Location */}
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{job.location}</span>
                        </div>

                        {/* 비자 정보 / Visa info */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-700">비자:</span>
                          {(job.eligibleVisas ?? job.allowedVisas ?? []).slice(0, 3).map((visa) => {
                            const visaColor = getVisaColor(visa);
                            return (
                              <span
                                key={visa}
                                className={`${visaColor.bg} ${visaColor.text} px-2 py-0.5 rounded text-xs font-medium`}
                              >
                                {visa}
                              </span>
                            );
                          })}
                          {(job.eligibleVisas ?? job.allowedVisas ?? []).length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{(job.eligibleVisas ?? job.allowedVisas ?? []).length - 3}
                            </span>
                          )}
                        </div>

                        {/* 마감일 / Deadline */}
                        {dDay && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-700">{dDay}</span>
                          </div>
                        )}
                      </div>

                      {/* 이모지 리액션 / Emoji reactions */}
                      <div className="mt-2 flex items-center gap-2">
                        <button className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-full text-xs hover:border-blue-500 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{Math.floor(Math.random() * 20) + 5}</span>
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-full text-xs hover:border-blue-500 transition-colors">
                          <span>💼</span>
                          <span>{Math.floor(Math.random() * 15) + 3}</span>
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-full text-xs hover:border-blue-500 transition-colors">
                          <span>🔥</span>
                          <span>{Math.floor(Math.random() * 10) + 2}</span>
                        </button>
                        <button className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-full text-xs hover:border-blue-500 transition-colors">
                          <span>✅</span>
                          <span>{Math.floor(Math.random() * 8) + 1}</span>
                        </button>
                        {hoveredJob === job.id && (
                          <button className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded-full text-xs hover:border-blue-500 transition-colors">
                            <Smile className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* 스레드 답글 (지원자 수) / Thread replies (applicant count) */}
                      <div className="mt-2">
                        <button className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                          <MessageSquare className="w-4 h-4" />
                          <span>{job.applicants}명이 지원했습니다</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 호버 시 액션 버튼 / Hover action buttons */}
                  {hoveredJob === job.id && (
                    <div className="absolute top-0 right-0 flex gap-1 bg-white border border-gray-200 rounded shadow-lg p-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="이모지 추가">
                        <Smile className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="답글 달기">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="북마크">
                        <Bookmark className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="더보기">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 메시지 입력창 / Message input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2 border border-gray-300 rounded p-3 bg-white">
              <AtSign className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="채용 공고를 검색하거나 질문하세요..."
                className="flex-1 outline-none text-sm"
              />
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
