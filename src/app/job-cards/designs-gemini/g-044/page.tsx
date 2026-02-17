'use client';

import { useState } from 'react';
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Clock, Users, TrendingUp, Hash, Plus, Search, Settings, Bell, Pin, CheckCircle, Zap } from 'lucide-react';

export default function G044Page() {
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  // 산업별로 채널 그룹화 / Group by industry
  const channels = Array.from(new Set(sampleJobsV2.map(job => job.industry)));

  const filteredJobs = selectedChannel === 'all'
    ? sampleJobsV2
    : sampleJobsV2.filter(job => job.industry === selectedChannel);

  // 이모지 리액션 데이터 / Emoji reaction data
  const reactions = [
    { emoji: '👍', label: 'Like', count: 42 },
    { emoji: '❤️', label: 'Love', count: 28 },
    { emoji: '🔥', label: 'Hot', count: 35 },
    { emoji: '👀', label: 'Eyes', count: 19 },
    { emoji: '🎉', label: 'Party', count: 12 },
  ];

  const channelColors = [
    'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-red-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-teal-500'
  ];

  return (
    <div className="min-h-screen bg-[#1a1d21] flex">
      {/* 좌측 사이드바 (Slack 스타일) / Left Sidebar (Slack style) */}
      <div className="w-64 bg-[#4A154B] text-white flex-shrink-0 flex flex-col">
        {/* 서버 헤더 / Server header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">잡차자 채용</h1>
            <Settings className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
            <input
              type="text"
              placeholder="채용 공고 검색"
              className="w-full bg-[#350d36] rounded px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>

        {/* 채널 목록 / Channel list */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Channels</span>
              <Plus className="w-4 h-4 opacity-60 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>

            {/* 전체 채널 / All channel */}
            <button
              onClick={() => setSelectedChannel('all')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded mb-1 transition-colors ${
                selectedChannel === 'all'
                  ? 'bg-[#1264a3] text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Hash className="w-4 h-4" />
              <span className="text-sm font-medium">전체-채용</span>
              <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {sampleJobsV2.length}
              </span>
            </button>

            {/* 산업별 채널 / Industry channels */}
            {channels.map((channel, idx) => {
              const count = sampleJobsV2.filter(job => job.industry === channel).length;
              return (
                <button
                  key={channel}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded mb-1 transition-colors ${
                    selectedChannel === channel
                      ? 'bg-[#1264a3] text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${channelColors[idx % channelColors.length]}`} />
                  <span className="text-sm font-medium truncate">채용-{channel}</span>
                  <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 다이렉트 메시지 섹션 / Direct messages section */}
          <div className="p-3 border-t border-white/10 mt-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Direct Messages</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1.5 text-white/70 hover:bg-white/10 rounded cursor-pointer">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">인사담당자 봇</span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 사용자 영역 / Bottom user area */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded cursor-pointer">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center font-bold text-sm">
              구
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">구직자</div>
              <div className="text-xs opacity-60 truncate">온라인</div>
            </div>
            <Bell className="w-4 h-4 opacity-60" />
          </div>
        </div>
      </div>

      {/* 메인 채팅 영역 (Discord 스타일) / Main chat area (Discord style) */}
      <div className="flex-1 flex flex-col bg-[#36393f]">
        {/* 채널 헤더 / Channel header */}
        <div className="h-12 bg-[#2f3136] border-b border-black/20 flex items-center px-4 shadow-lg">
          <Hash className="w-5 h-5 text-gray-400 mr-2" />
          <span className="font-semibold text-white">
            {selectedChannel === 'all' ? '전체-채용' : `채용-${selectedChannel}`}
          </span>
          <div className="ml-4 h-6 w-px bg-white/10" />
          <span className="ml-4 text-sm text-gray-400">
            {filteredJobs.length}개의 채용 공고
          </span>
          <div className="ml-auto flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            <TrendingUp className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        {/* 메시지(공고) 목록 / Message (job) list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredJobs.map((job) => {
            const dday = getDDay(job.closingDate);
            const salary = formatSalary(job);
            const isHovered = hoveredCard === job.id;

            return (
              <div
                key={job.id}
                className="relative group"
                onMouseEnter={() => setHoveredCard(job.id)}
                onMouseLeave={() => {
                  setHoveredCard(null);
                  setHoveredEmoji(null);
                }}
              >
                {/* 메시지 컨테이너 / Message container */}
                <div className={`
                  bg-[#2f3136] rounded-lg p-4 transition-all duration-200
                  ${isHovered ? 'bg-[#32353b] shadow-xl transform -translate-y-1' : 'hover:bg-[#32353b]'}
                `}>
                  <div className="flex gap-4">
                    {/* 회사 로고 (아바타) / Company logo (avatar) */}
                    <div className="flex-shrink-0">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">
                          {job.companyInitial}
                        </div>
                      )}
                    </div>

                    {/* 메시지 본문 / Message body */}
                    <div className="flex-1 min-w-0">
                      {/* 헤더: 회사명 + 타임스탬프 / Header: company + timestamp */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-white hover:underline cursor-pointer">
                          {job.company}
                        </span>
                        {job.isFeatured && (
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                        )}
                        <span className="text-xs text-gray-500">
                          {job.postedDate}
                        </span>
                        {job.isUrgent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                            <Zap className="w-3 h-3" />
                            긴급채용
                          </span>
                        )}
                      </div>

                      {/* 공고 제목 / Job title */}
                      <h3 className="text-base font-bold text-white mb-2 hover:underline cursor-pointer">
                        {job.title}
                      </h3>

                      {/* 비자 태그 (Discord 역할 배지 스타일) / Visa tags (Discord role badge style) */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {job.allowedVisas.map(visa => {
                          const colors = getVisaColor(visa);
                          return (
                            <span
                              key={visa}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                            >
                              {visa}
                            </span>
                          );
                        })}
                      </div>

                      {/* 스레드 (답글 스타일로 상세 정보) / Thread (reply style details) */}
                      <div className="bg-[#202225] border-l-4 border-[#4A154B] rounded p-3 space-y-2">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="font-semibold">{salary}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{job.workHours}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>📍 {job.location}</span>
                          <span>💼 {job.experienceRequired}</span>
                        </div>

                        {job.benefits.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {job.benefits.slice(0, 3).map((benefit, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-[#2f3136] text-gray-300 rounded text-xs"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 하단 메타 정보 / Bottom meta info */}
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{job.applicantCount}명 지원</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👁️ {job.viewCount}</span>
                          </div>
                        </div>
                        <div className={`font-medium ${
                          dday === '마감' ? 'text-red-400' :
                          dday?.startsWith('D-') ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {dday || '상시모집'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 호버 시 이모지 리액션 바 / Emoji reaction bar on hover */}
                <div className={`
                  absolute -bottom-3 left-1/2 -translate-x-1/2 z-10
                  transition-all duration-300 ease-out
                  ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                `}>
                  <div className="bg-[#18191c] rounded-full shadow-2xl border border-white/10 px-2 py-1.5 flex items-center gap-1">
                    {reactions.map((reaction) => (
                      <button
                        key={reaction.emoji}
                        className={`
                          relative group/emoji px-2.5 py-1.5 rounded-full transition-all duration-200
                          hover:bg-white/10 hover:scale-110
                          ${hoveredEmoji === reaction.emoji ? 'bg-white/10 scale-110' : ''}
                        `}
                        onMouseEnter={() => setHoveredEmoji(reaction.emoji)}
                        onMouseLeave={() => setHoveredEmoji(null)}
                      >
                        <span className="text-lg">{reaction.emoji}</span>

                        {/* 이모지 호버 툴팁 / Emoji hover tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/emoji:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            :{reaction.label}: {reaction.count}
                          </div>
                        </div>
                      </button>
                    ))}

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* 호버 시 멤버 표시 / Member display on hover */}
                {isHovered && (
                  <div className="absolute top-2 right-2 z-10 animate-in fade-in slide-in-from-right-2 duration-200">
                    <div className="bg-[#18191c] rounded-lg shadow-xl border border-white/10 px-3 py-2 min-w-[140px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-semibold text-white">현재 보는 중</span>
                      </div>
                      <div className="flex -space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-[#18191c] flex items-center justify-center text-xs font-bold text-white"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-[#18191c] flex items-center justify-center text-xs font-bold text-white">
                          +3
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {job.viewCount}명이 관심 있어요
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 하단 입력창 (Discord 스타일) / Bottom input (Discord style) */}
        <div className="p-4 bg-[#2f3136]">
          <div className="bg-[#40444b] rounded-lg px-4 py-3 flex items-center gap-3">
            <Plus className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            <input
              type="text"
              placeholder={`#${selectedChannel === 'all' ? '전체-채용' : `채용-${selectedChannel}`}에 메시지 보내기`}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">😊</span>
            </div>
          </div>
        </div>
      </div>

      {/* 우측 사이드바 (멤버 리스트) / Right sidebar (member list) */}
      <div className="w-60 bg-[#2f3136] border-l border-black/20 p-4 hidden xl:block">
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            온라인 — {Math.floor(Math.random() * 50) + 20}
          </h3>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-1.5 hover:bg-[#36393f] rounded cursor-pointer transition-colors">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    ['bg-gradient-to-br from-blue-400 to-cyan-400',
                     'bg-gradient-to-br from-purple-400 to-pink-400',
                     'bg-gradient-to-br from-green-400 to-emerald-400',
                     'bg-gradient-to-br from-yellow-400 to-orange-400'][i % 4]
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2f3136]" />
                </div>
                <span className="text-sm text-gray-300">채용담당자 #{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
