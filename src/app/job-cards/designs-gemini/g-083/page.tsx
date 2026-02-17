'use client';

import { useState } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  Hash,
  ChevronDown,
  MapPin,
  Clock,
  Users,
  Eye,
  Briefcase,
  Star,
  Zap,
  MessageCircle,
  Smile,
  ThumbsUp,
  Heart,
  Flame,
  CheckCircle2,
  Circle,
  Send,
  Plus,
  AtSign,
  Settings,
  Headphones,
  Crown,
  Shield,
} from 'lucide-react';

// 디자인 정보 / Design info
export const designInfo = {
  id: 'g-083',
  name: 'Slack\u00D7카카오톡\u00D7Discord',
  category: 'platform' as const,
  author: 'Gemini',
};

// 슬랙 스타일 이모지 리액션 / Slack-style emoji reactions
const slackReactions = [
  { emoji: '👍', count: 12, icon: ThumbsUp },
  { emoji: '❤️', count: 8, icon: Heart },
  { emoji: '🔥', count: 5, icon: Flame },
  { emoji: '⭐', count: 3, icon: Star },
];

// 디스코드 스타일 역할 색상 / Discord-style role colors
const discordRoleColors = [
  'text-red-400',
  'text-green-400',
  'text-blue-400',
  'text-yellow-400',
  'text-purple-400',
  'text-pink-400',
];

// 카카오 타이핑 애니메이션 컴포넌트 / KakaoTalk typing indicator component
function KakaoTypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.6s' }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 ml-1">입력 중...</span>
    </div>
  );
}

// 메신저 융합 채용공고 카드 / Messenger fusion job card
function MessengerJobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeReactions, setActiveReactions] = useState<Set<number>>(new Set());
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);

  const toggleReaction = (reactionIndex: number) => {
    setActiveReactions((prev) => {
      const next = new Set(prev);
      if (next.has(reactionIndex)) {
        next.delete(reactionIndex);
      } else {
        next.add(reactionIndex);
      }
      return next;
    });
  };

  // 디스코드 스타일 온라인 멤버 수 (지원자 기반) / Discord-style online member count
  const onlineCount = Math.max(1, Math.floor(job.applicantCount * 0.3));

  return (
    <div
      className="relative group overflow-hidden rounded-xl transition-all duration-500 ease-out"
      style={{
        background: isHovered
          ? 'linear-gradient(135deg, #2C2F33 0%, #36393F 40%, #3B2E4A 70%, #2C2F33 100%)'
          : 'linear-gradient(135deg, #2C2F33 0%, #36393F 100%)',
        boxShadow: isHovered
          ? '0 20px 60px rgba(88, 101, 242, 0.25), 0 0 0 1px rgba(88, 101, 242, 0.3)'
          : '0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 슬랙 채널 헤더 / Slack channel header */}
      <div className="relative">
        {/* 슬랙 스타일 상단바 / Slack-style top bar */}
        <div
          className="px-4 py-2.5 flex items-center gap-2 border-b transition-colors duration-300"
          style={{
            borderColor: isHovered ? 'rgba(88, 101, 242, 0.3)' : 'rgba(255,255,255,0.08)',
            background: isHovered
              ? 'linear-gradient(90deg, rgba(74,21,75,0.3), rgba(88,101,242,0.15), rgba(254,229,0,0.08))'
              : 'rgba(47, 49, 54, 0.8)',
          }}
        >
          {/* 슬랙 사이드바 미니 인디케이터 / Slack sidebar mini indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-white font-bold text-[9px] transition-all duration-300"
              style={{
                background: isHovered
                  ? 'linear-gradient(135deg, #611f69, #E01E5A, #ECB22E)'
                  : '#611f69',
              }}
            >
              {job.companyInitial}
            </div>
            <Hash className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm font-medium text-gray-200 truncate max-w-[140px]">
              {job.company.toLowerCase().replace(/\s+/g, '-')}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* 프리미엄/긴급 배지 / Premium/urgent badges */}
            {job.isFeatured && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                <Crown className="w-2.5 h-2.5" />
                추천
              </span>
            )}
            {job.isUrgent && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
                <Zap className="w-2.5 h-2.5" />
                긴급
              </span>
            )}

            {/* 디스코드 온라인 멤버 카운트 / Discord online member count */}
            <div
              className="flex items-center gap-1 transition-all duration-500"
              style={{
                opacity: isHovered ? 1 : 0.6,
                transform: isHovered ? 'translateX(0)' : 'translateX(4px)',
              }}
            >
              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
              <span className="text-[10px] text-green-400">{onlineCount}</span>
              <Users className="w-3 h-3 text-gray-500 ml-0.5" />
              <span className="text-[10px] text-gray-500">{job.applicantCount}</span>
            </div>
          </div>
        </div>

        {/* 카카오톡 스타일 채팅 영역 / KakaoTalk-style chat area */}
        <div className="px-4 pt-3 pb-2">
          {/* 봇 메시지 — 공고 정보 (카카오 말풍선) / Bot message — job info (Kakao bubble) */}
          <div className="flex items-start gap-2.5 mb-2">
            {/* 카카오 프로필 (회사 로고) / Kakao profile (company logo) */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-md">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-contain p-1 bg-white rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-sm font-bold text-white">${job.companyInitial}</span>`;
                  }}
                />
              </div>
              {/* 디스코드 온라인 상태 / Discord online status */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#36393F]" />
            </div>

            <div className="flex-1 min-w-0">
              {/* 회사명 + 디스코드 역할 / Company name + Discord role */}
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-semibold text-gray-200">{job.company}</span>
                <span
                  className={`text-[9px] px-1 py-0.5 rounded-sm font-medium ${
                    job.tierType === 'PREMIUM'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-gray-600/50 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {job.tierType === 'PREMIUM' ? 'PREMIUM' : 'STANDARD'}
                </span>
                {job.tierType === 'PREMIUM' && (
                  <Shield className="w-3 h-3 text-purple-400" />
                )}
              </div>

              {/* 카카오 스타일 말풍선 / KakaoTalk-style chat bubble */}
              <div className="relative">
                {/* 카카오 꼬리 / Kakao tail */}
                <div
                  className="absolute -left-1.5 top-2 w-3 h-3 rotate-45 transition-colors duration-300"
                  style={{
                    backgroundColor: isHovered ? '#FEE500' : '#40444B',
                  }}
                />
                <div
                  className="relative rounded-xl rounded-tl-sm p-3 transition-all duration-300"
                  style={{
                    backgroundColor: isHovered ? '#FEE500' : '#40444B',
                    color: isHovered ? '#1A1A1A' : '#DCDDDE',
                  }}
                >
                  {/* 공고 제목 / Job title */}
                  <h3 className="text-sm font-bold leading-snug mb-2 line-clamp-2">
                    {job.title}
                  </h3>

                  {/* 공고 정보 그리드 / Job info grid */}
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0 opacity-60" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 flex-shrink-0 opacity-60" />
                      <span>{job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0 opacity-60" />
                      <span className="truncate">{job.workHours || '협의'}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                      <span className="opacity-60">$</span>
                      <span className="truncate">{salary}</span>
                    </div>
                  </div>

                  {/* 비자 태그 (디스코드 역할 스타일) / Visa tags (Discord role style) */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.allowedVisas.map((visa, vi) => {
                      const vc = getVisaColor(visa);
                      return (
                        <span
                          key={visa}
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-200 ${
                            isHovered
                              ? 'bg-gray-800/60 text-white border border-gray-600/50'
                              : `${vc.bg} ${vc.text}`
                          }`}
                        >
                          <Circle
                            className={`w-1.5 h-1.5 fill-current ${
                              discordRoleColors[vi % discordRoleColors.length]
                            }`}
                            style={{ opacity: isHovered ? 1 : 0 }}
                          />
                          {visa}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단: 리액션 + 타이핑 + 인풋 / Bottom: reactions + typing + input */}
      <div
        className="border-t transition-colors duration-300"
        style={{ borderColor: isHovered ? 'rgba(88, 101, 242, 0.2)' : 'rgba(255,255,255,0.06)' }}
      >
        {/* 슬랙 이모지 리액션 / Slack emoji reactions */}
        <div
          className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0.5,
            transform: isHovered ? 'translateY(0)' : 'translateY(2px)',
          }}
        >
          {slackReactions.map((reaction, ri) => {
            const isActive = activeReactions.has(ri);
            return (
              <button
                key={ri}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReaction(ri);
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all duration-200 border ${
                  isActive
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-gray-700/40 border-gray-600/30 text-gray-400 hover:bg-gray-600/50 hover:border-gray-500/40'
                }`}
              >
                <span className="text-sm">{reaction.emoji}</span>
                <span className="font-medium">{reaction.count + (isActive ? 1 : 0)}</span>
              </button>
            );
          })}
          <button className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/30 border border-gray-600/20 text-gray-500 hover:text-gray-300 hover:bg-gray-600/40 transition-colors">
            <Smile className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 카카오 타이핑 인디케이터 (호버 시 표시) / Kakao typing indicator (on hover) */}
        <div
          className="overflow-hidden transition-all duration-500 ease-out"
          style={{
            maxHeight: isHovered ? '40px' : '0px',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <div className="px-4 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-yellow-400" />
            </div>
            <KakaoTypingDots />
          </div>
        </div>

        {/* 디스코드 스타일 하단바 / Discord-style bottom bar */}
        <div className="px-3 py-2 flex items-center justify-between">
          {/* 디스코드 인풋 스타일 / Discord input style */}
          <div
            className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: isHovered ? 'rgba(88, 101, 242, 0.1)' : 'rgba(64, 68, 75, 0.6)',
              border: isHovered
                ? '1px solid rgba(88, 101, 242, 0.3)'
                : '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <Plus className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 flex-1">지원하기...</span>
            <div className="flex items-center gap-1.5">
              <Smile className="w-3 h-3 text-gray-500" />
              <Send
                className="w-3 h-3 transition-colors duration-300"
                style={{ color: isHovered ? '#5865F2' : '#72767D' }}
              />
            </div>
          </div>

          {/* 마감/D-Day / Deadline/D-Day */}
          <div className="ml-2 flex items-center gap-1.5 text-[10px] flex-shrink-0">
            {dDay && (
              <span
                className={`px-2 py-1 rounded-md font-bold transition-all duration-300 ${
                  dDay === '마감'
                    ? 'bg-gray-700 text-gray-400 line-through'
                    : dDay === 'D-Day'
                    ? 'bg-red-500/20 text-red-300 animate-pulse'
                    : dDay === '상시모집'
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-indigo-500/15 text-indigo-300'
                }`}
              >
                {dDay}
              </span>
            )}
          </div>
        </div>

        {/* 디스코드 멤버 리스트 (호버 시 슬라이드) / Discord member list (slide on hover) */}
        <div
          className="overflow-hidden transition-all duration-500 ease-out border-t"
          style={{
            maxHeight: isHovered ? '52px' : '0px',
            opacity: isHovered ? 1 : 0,
            borderColor: 'rgba(255,255,255,0.04)',
          }}
        >
          <div className="px-4 py-2 flex items-center justify-between">
            {/* 멤버 아바타 그리드 / Member avatar grid */}
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-gray-500 uppercase font-semibold mr-1.5 tracking-wider">
                지원자
              </span>
              <div className="flex -space-x-1.5">
                {Array.from({ length: Math.min(5, job.applicantCount) }).map((_, ai) => (
                  <div
                    key={ai}
                    className="w-5 h-5 rounded-full border border-[#36393F] flex items-center justify-center text-[8px] font-bold text-white"
                    style={{
                      background: `hsl(${(ai * 72 + index * 40) % 360}, 60%, 50%)`,
                    }}
                  >
                    {String.fromCharCode(65 + ai)}
                  </div>
                ))}
                {job.applicantCount > 5 && (
                  <div className="w-5 h-5 rounded-full bg-gray-700 border border-[#36393F] flex items-center justify-center text-[8px] text-gray-400">
                    +{job.applicantCount - 5}
                  </div>
                )}
              </div>
            </div>

            {/* 조회수 + 매치스코어 / Views + match score */}
            <div className="flex items-center gap-2 text-[10px]">
              <div className="flex items-center gap-0.5 text-gray-500">
                <Eye className="w-3 h-3" />
                <span>{job.viewCount.toLocaleString()}</span>
              </div>
              {job.matchScore && (
                <div className="flex items-center gap-0.5 text-green-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="font-semibold">{job.matchScore}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G083Page() {
  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background:
          'linear-gradient(160deg, #1A1D21 0%, #2C2F33 30%, #1E1F2B 60%, #1A1D21 100%)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* 헤더 / Header */}
        <div className="text-center mb-10">
          {/* 슬랙+카카오+디스코드 통합 로고 / Unified logo */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#611f69] via-[#E01E5A] to-[#ECB22E] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Hash className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl text-gray-500 font-light">&times;</span>
            <div className="w-10 h-10 rounded-xl bg-[#FEE500] flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <MessageCircle className="w-5 h-5 text-[#3C1E1E]" />
            </div>
            <span className="text-2xl text-gray-500 font-light">&times;</span>
            <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Headphones className="w-5 h-5 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {designInfo.name}
          </h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Slack의 채널 사이드바 + KakaoTalk의 노란 말풍선 + Discord의 다크 서버 UI를 결합한 메신저 융합 채용 카드
          </p>

          {/* 슬랙 워크스페이스 네비 / Slack workspace nav */}
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
              <Hash className="w-3.5 h-3.5 text-gray-400" />
              <span>채용공고</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              <AtSign className="w-3.5 h-3.5" />
              <span>전체 {sampleJobsV2.length}개</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
              <Settings className="w-3.5 h-3.5 text-gray-400" />
              <span>설정</span>
            </div>
          </div>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sampleJobsV2.map((job, index) => (
            <MessengerJobCard key={job.id} job={job} index={index} />
          ))}
        </div>

        {/* 하단 디스코드 상태바 / Bottom Discord status bar */}
        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
            <span className="text-green-500 font-medium">온라인</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="w-2 h-2 fill-yellow-500 text-yellow-500" />
            <span>자리비움 3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="w-2 h-2 fill-gray-500 text-gray-500" />
            <span>오프라인 12</span>
          </div>
          <span className="text-gray-700">|</span>
          <span className="text-gray-600">
            {designInfo.id} &middot; {designInfo.author}
          </span>
        </div>
      </div>
    </div>
  );
}
