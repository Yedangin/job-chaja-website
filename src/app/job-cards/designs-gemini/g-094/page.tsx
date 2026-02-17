'use client';

import { useState } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
} from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import {
  Pin,
  Heart,
  MessageCircle,
  MapPin,
  Clock,
  Users,
  Eye,
  Briefcase,
  Star,
  Zap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Gift,
  Award,
  ThumbsUp,
  Send,
} from 'lucide-react';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-094',
  title: 'Pinterest x 배민 x 카카오톡',
  description: '핀세이브+이모지폭발+채팅말풍선 복합 — 비주얼+유머+채팅 융합 디자인',
  author: 'Gemini',
  category: 'creative',
  references: ['Pinterest', 'Baemin', 'KakaoTalk'],
};

// 이모지 뱃지 매핑 (배민 스타일) / Emoji badge mapping (Baemin style)
const benefitEmojis: Record<string, string> = {
  기숙사: '🏠',
  통근버스: '🚌',
  중식제공: '🍱',
  식사제공: '🍽️',
  '4대보험': '🛡️',
  유니폼: '👕',
  재택근무: '🏡',
  유연근무: '⏰',
  스톡옵션: '📈',
  식대지원: '💳',
  안전장비: '🦺',
  숙소지원: '🏢',
  야간수당: '🌙',
  의료보험: '🏥',
  연차: '🌴',
};

// 채용담당자 말풍선 메시지 (카카오톡 스타일) / Recruiter chat bubble messages (KakaoTalk style)
function getRecruiterMessage(job: MockJobPostingV2): string {
  if (job.isUrgent) return '급구에요! 빨리 지원해주세요~ 🔥';
  if (job.isFeatured && job.matchScore && job.matchScore >= 90)
    return `매칭률 ${job.matchScore}%! 딱 맞는 포지션이에요 ✨`;
  if (job.applicantCount > 100) return `인기폭발! ${job.applicantCount}명이나 지원했어요 🎉`;
  if (job.boardType === 'PART_TIME') return '유연한 근무시간 보장해드려요~ 💪';
  if (job.isFeatured) return '추천 공고! 놓치지 마세요 😊';
  return '좋은 인재를 찾고 있어요~ 같이 일해요! 🤝';
}

// 핀 저장 카운트 랜덤 생성 / Random pin save count
function getPinCount(viewCount: number): number {
  return Math.floor(viewCount * 0.15);
}

// 개별 잡카드 컴포넌트 / Individual job card component
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [emojiPop, setEmojiPop] = useState(false);

  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const pinCount = getPinCount(job.viewCount);
  const recruiterMsg = getRecruiterMessage(job);

  // Pinterest 스타일 높이 변화 (메이슨리 느낌) / Pinterest-style varied heights
  const heightVariants = ['min-h-[420px]', 'min-h-[460px]', 'min-h-[440px]', 'min-h-[480px]', 'min-h-[430px]', 'min-h-[450px]'];
  const cardHeight = heightVariants[index % heightVariants.length];

  // 이모지 버스트 트리거 / Emoji burst trigger
  const handleEmojiPop = () => {
    setEmojiPop(true);
    setTimeout(() => setEmojiPop(false), 800);
  };

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden bg-white transition-all duration-300 ${cardHeight} ${
        isHovered
          ? 'shadow-2xl scale-[1.02] z-10'
          : 'shadow-md hover:shadow-lg'
      } ${job.tierType === 'PREMIUM' ? 'ring-2 ring-amber-300' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowChat(false);
      }}
    >
      {/* 산업 이미지 (Pinterest 스타일) / Industry image (Pinterest style) */}
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={job.industryImage}
          alt={job.industry}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />

        {/* 이미지 위 그라데이션 오버레이 / Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Pinterest 핀 버튼 / Pinterest pin button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPinned(!isPinned);
            handleEmojiPop();
          }}
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
            isPinned
              ? 'bg-black text-white scale-105'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Pin className="w-4 h-4" />
          {isPinned ? '저장됨' : '저장'}
        </button>

        {/* 좋아요 버튼 / Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
            if (!isLiked) handleEmojiPop();
          }}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-200 ${
            isLiked
              ? 'bg-pink-500 text-white scale-110'
              : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* 이모지 버스트 애니메이션 (배민 스타일) / Emoji burst animation (Baemin style) */}
        {emojiPop && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {['🎉', '✨', '💯', '🔥', '❤️'].map((emoji, i) => (
              <span
                key={i}
                className="absolute text-2xl animate-bounce"
                style={{
                  animationDelay: `${i * 80}ms`,
                  animationDuration: '600ms',
                  top: `${20 + Math.random() * 40}%`,
                  left: `${15 + Math.random() * 70}%`,
                  opacity: 0.9,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

        {/* 하단 배지 영역 / Bottom badge area */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {job.tierType === 'PREMIUM' && (
            <span className="flex items-center gap-1 px-2 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
              <Star className="w-3 h-3 fill-current" /> PREMIUM
            </span>
          )}
          {job.isUrgent && (
            <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
              <Zap className="w-3 h-3" /> 급구!!
            </span>
          )}
        </div>

        {/* 핀 카운트 / Pin count */}
        <div className="absolute bottom-3 right-3 text-white/90 text-xs font-medium flex items-center gap-1">
          <Pin className="w-3 h-3" /> {pinCount.toLocaleString()}
        </div>
      </div>

      {/* 카드 본문 / Card body */}
      <div className="p-4 flex flex-col gap-3">
        {/* 회사 정보 (로고 + 이름) / Company info (logo + name) */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<span class="text-sm font-bold text-gray-500">${job.companyInitial}</span>`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{job.company}</p>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">{job.location}</span>
            </div>
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2">
          {job.title}
        </h3>

        {/* 급여 (배민 스타일 강조) / Salary (Baemin style emphasis) */}
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold text-orange-500">{salary}</span>
          {job.boardType === 'PART_TIME' && (
            <span className="px-1.5 py-0.5 bg-mint-100 text-xs text-teal-600 font-semibold rounded bg-teal-50">
              파트
            </span>
          )}
        </div>

        {/* 이모지 뱃지 복리후생 (배민 스타일) / Emoji benefit badges (Baemin style) */}
        <div className="flex flex-wrap gap-1.5">
          {job.benefits.slice(0, showBenefits ? job.benefits.length : 3).map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-800 text-xs rounded-full border border-amber-100 font-medium"
            >
              <span>{benefitEmojis[benefit] || '✅'}</span>
              {benefit}
            </span>
          ))}
          {job.benefits.length > 3 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBenefits(!showBenefits);
              }}
              className="inline-flex items-center px-2 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showBenefits ? (
                <>접기 <ChevronUp className="w-3 h-3 ml-0.5" /></>
              ) : (
                <>+{job.benefits.length - 3} <ChevronDown className="w-3 h-3 ml-0.5" /></>
              )}
            </button>
          )}
        </div>

        {/* 비자 태그 / Visa tags */}
        <div className="flex flex-wrap gap-1">
          {job.allowedVisas.map((visa) => {
            const color = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${color.bg} ${color.text}`}
              >
                {visa}
              </span>
            );
          })}
        </div>

        {/* 매칭 스코어 바 / Match score bar */}
        {job.matchScore && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  job.matchScore >= 90
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : job.matchScore >= 70
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                    : 'bg-gradient-to-r from-orange-400 to-red-400'
                }`}
                style={{ width: isHovered ? `${job.matchScore}%` : '0%' }}
              />
            </div>
            <span className="text-xs font-bold text-gray-600">
              {job.matchScore}%
            </span>
          </div>
        )}

        {/* 하단 메타 정보 / Bottom meta info */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {job.applicantCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {job.viewCount.toLocaleString()}
            </span>
          </div>
          <span
            className={`font-semibold ${
              dday === '마감'
                ? 'text-gray-400'
                : dday === 'D-Day'
                ? 'text-red-500 animate-pulse'
                : 'text-red-500'
            }`}
          >
            {dday}
          </span>
        </div>
      </div>

      {/* 카카오톡 채팅 말풍선 (호버 시 등장) / KakaoTalk chat bubble (appears on hover) */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="bg-gradient-to-t from-white via-white to-transparent pt-6 px-4 pb-4">
          {/* 채팅 토글 버튼 / Chat toggle button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowChat(!showChat);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-yellow-300 hover:bg-yellow-400 text-yellow-900 rounded-xl font-bold text-sm transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            {showChat ? '닫기' : '채용담당자의 한마디 💬'}
          </button>

          {/* 말풍선 내용 / Chat bubble content */}
          {showChat && (
            <div className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* 카카오톡 스타일 말풍선 / KakaoTalk style bubble */}
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-yellow-200 flex-shrink-0 bg-yellow-50 flex items-center justify-center">
                  <img
                    src={job.companyLogo}
                    alt=""
                    className="w-full h-full object-contain p-0.5"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-xs font-bold text-yellow-600">${job.companyInitial}</span>`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 mb-1 ml-1">채용담당자</p>
                  <div className="relative bg-yellow-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-gray-800 leading-relaxed">
                    {recruiterMsg}
                    {/* 말풍선 꼬리 / Bubble tail */}
                    <div className="absolute -left-1.5 bottom-2 w-3 h-3 bg-yellow-100 transform rotate-45" />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 ml-1">방금 전</p>
                </div>
              </div>

              {/* 빠른 액션 버튼 (카카오톡 하단 메뉴) / Quick action buttons (KakaoTalk bottom menu) */}
              <div className="flex gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors">
                  <Send className="w-3 h-3" /> 지원하기
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  <ThumbsUp className="w-3 h-3" /> 관심
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* isFeatured 리본 / Featured ribbon */}
      {job.isFeatured && (
        <div className="absolute top-0 left-0">
          <div className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-[10px] font-bold px-6 py-1 transform -rotate-45 -translate-x-5 translate-y-3 shadow-md">
            <Sparkles className="w-3 h-3 inline mr-0.5 -mt-0.5" />
            추천
          </div>
        </div>
      )}
    </div>
  );
}

// 메인 페이지 / Main page component
export default function G094Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* 헤더 / Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Pinterest 레드 + 배민 민트 그라데이션 로고 / Pinterest red + Baemin mint gradient logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300 rounded-2xl flex items-center justify-center shadow-lg">
                <Pin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                  잡차자
                  <span className="text-xs ml-1.5 font-bold text-orange-400">
                    x Pinterest x 배민 x 카톡
                  </span>
                </h1>
                <p className="text-[11px] text-gray-400">
                  핀하고 💬 톡하고 🎉 이모지 터지는 채용공고
                </p>
              </div>
            </div>

            {/* 디자인 정보 뱃지 / Design info badge */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
                {designInfo.id}
              </span>
              <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100">
                {designInfo.author}
              </span>
              <span className="px-3 py-1.5 bg-teal-50 text-teal-600 text-xs font-bold rounded-full border border-teal-100">
                {designInfo.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 (Pinterest 스타일) / Category filter (Pinterest style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['전체', '🏭 제조', '🍽️ 음식', '💻 IT', '🏗️ 건설', '📦 물류', '⭐ 추천', '🔥 급구'].map(
            (cat, i) => (
              <button
                key={cat}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  i === 0
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Pinterest 스타일 메이슨리 그리드 / Pinterest-style masonry grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {sampleJobsV2.map((job, index) => (
            <div key={job.id} className="break-inside-avoid">
              <JobCard job={job} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* 하단 카카오톡 스타일 플로팅 바 / Bottom KakaoTalk-style floating bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center gap-3 px-6 py-3 bg-yellow-300 rounded-full shadow-2xl shadow-yellow-300/30">
          <MessageCircle className="w-5 h-5 text-yellow-900" />
          <span className="text-sm font-bold text-yellow-900">
            카드를 호버하면 채용담당자의 한마디를 볼 수 있어요!
          </span>
          <span className="text-lg">💬</span>
        </div>
      </div>

      {/* 푸터 / Footer */}
      <div className="bg-white border-t border-gray-100 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-gray-400">
            Design {designInfo.id} — {designInfo.title}
          </p>
          <p className="text-xs text-gray-300 mt-1">
            핀 저장 + 이모지 뱃지 + 말풍선 채팅 | by {designInfo.author}
          </p>
        </div>
      </div>
    </div>
  );
}