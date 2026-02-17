'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Heart,
  Eye,
  Users,
  MapPin,
  Clock,
  Briefcase,
  Star,
  Zap,
  Share2,
  MessageCircle,
  Bookmark,
  ChevronUp,
  Sparkles,
  Play,
  TrendingUp,
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';

// 디자인 메타정보 / Design metadata
const designInfo = {
  id: 'g-098',
  title: 'Dribbble x TikTok x Baemin',
  author: 'Gemini',
  description:
    'Creative fun fusion: Dribbble pink hearts, TikTok dark scroll, Baemin emoji humor. Pink+Black+Mint palette.',
};

// 이모지 버스트용 이모지 목록 / Emoji list for burst animation
const BURST_EMOJIS = ['🔥', '💼', '✨', '🎯', '💰', '🚀', '🎉', '⭐', '💎', '🏆', '👏', '💪'];

// 플로팅 이모지 인터페이스 / Floating emoji interface
interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

// 하트 애니메이션 인터페이스 / Heart animation interface
interface FloatingHeart {
  id: number;
  x: number;
  startY: number;
  scale: number;
  delay: number;
}

export default function G098Page() {
  // 좋아요 상태 / Like state
  const [likedJobs, setLikedJobs] = useState<Set<string>>(new Set());
  // 하트 카운트 / Heart count state
  const [heartCounts, setHeartCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    sampleJobsV2.forEach((job) => {
      counts[job.id] = Math.floor(Math.random() * 200) + 50;
    });
    return counts;
  });
  // 북마크 상태 / Bookmark state
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  // 플로팅 하트 애니메이션 / Floating hearts animation
  const [floatingHearts, setFloatingHearts] = useState<Record<string, FloatingHeart[]>>({});
  // 이모지 버스트 / Emoji burst animation
  const [emojiExplosions, setEmojiExplosions] = useState<Record<string, FloatingEmoji[]>>({});
  // 자동 스크롤 / Auto-scroll state
  const [autoScrollCard, setAutoScrollCard] = useState<string | null>(null);
  // 호버 상태 / Hover state
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  // 스크롤 ref / Scroll content ref
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const emojiIdRef = useRef(0);
  const heartIdRef = useRef(0);

  // 하트 바운스 핸들러 / Heart bounce handler
  const handleLike = useCallback(
    (jobId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const isLiked = likedJobs.has(jobId);

      setLikedJobs((prev) => {
        const next = new Set(prev);
        if (isLiked) {
          next.delete(jobId);
        } else {
          next.add(jobId);
        }
        return next;
      });

      setHeartCounts((prev) => ({
        ...prev,
        [jobId]: isLiked ? prev[jobId] - 1 : prev[jobId] + 1,
      }));

      // 좋아요 시 플로팅 하트 + 이모지 버스트 / On like: floating hearts + emoji burst
      if (!isLiked) {
        // 플로팅 하트 생성 / Create floating hearts
        const newHearts: FloatingHeart[] = Array.from({ length: 5 }, (_, i) => ({
          id: heartIdRef.current++,
          x: Math.random() * 40 - 20,
          startY: 0,
          scale: 0.6 + Math.random() * 0.6,
          delay: i * 80,
        }));
        setFloatingHearts((prev) => ({
          ...prev,
          [jobId]: [...(prev[jobId] || []), ...newHearts],
        }));
        setTimeout(() => {
          setFloatingHearts((prev) => ({
            ...prev,
            [jobId]: (prev[jobId] || []).filter(
              (h) => !newHearts.find((nh) => nh.id === h.id)
            ),
          }));
        }, 1200);

        // 이모지 버스트 / Emoji burst
        triggerEmojiBurst(jobId);
      }
    },
    [likedJobs]
  );

  // 이모지 버스트 트리거 / Trigger emoji burst
  const triggerEmojiBurst = useCallback((jobId: string) => {
    const newEmojis: FloatingEmoji[] = Array.from({ length: 8 }, () => ({
      id: emojiIdRef.current++,
      emoji: BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)],
      x: Math.random() * 160 - 80,
      y: -(Math.random() * 120 + 40),
      scale: 0.5 + Math.random() * 0.8,
      rotation: Math.random() * 60 - 30,
      opacity: 1,
    }));

    setEmojiExplosions((prev) => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), ...newEmojis],
    }));

    setTimeout(() => {
      setEmojiExplosions((prev) => ({
        ...prev,
        [jobId]: (prev[jobId] || []).filter(
          (em) => !newEmojis.find((ne) => ne.id === em.id)
        ),
      }));
    }, 1000);
  }, []);

  // 북마크 토글 / Toggle bookmark
  const toggleBookmark = useCallback((jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  }, []);

  // 호버 시 자동 스크롤 시작 / Start auto-scroll on hover
  const handleMouseEnter = useCallback((jobId: string) => {
    setHoveredCard(jobId);
    setAutoScrollCard(jobId);
  }, []);

  // 호버 해제 시 자동 스크롤 중지 / Stop auto-scroll on leave
  const handleMouseLeave = useCallback((jobId: string) => {
    setHoveredCard(null);
    setAutoScrollCard(null);
    const el = scrollRefs.current[jobId];
    if (el) {
      el.scrollTop = 0;
    }
  }, []);

  // 자동 스크롤 애니메이션 / Auto-scroll animation
  useEffect(() => {
    if (!autoScrollCard) return;
    const el = scrollRefs.current[autoScrollCard];
    if (!el) return;

    let animFrame: number;
    let speed = 0.5;

    const scroll = () => {
      if (!el) return;
      el.scrollTop += speed;
      if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
        el.scrollTop = 0;
      }
      animFrame = requestAnimationFrame(scroll);
    };

    const timeout = setTimeout(() => {
      animFrame = requestAnimationFrame(scroll);
    }, 400);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animFrame);
    };
  }, [autoScrollCard]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* CSS 애니메이션 / CSS animations */}
      <style>{`
        @keyframes heartBounce {
          0% { transform: scale(1); }
          15% { transform: scale(1.35); }
          30% { transform: scale(0.9); }
          45% { transform: scale(1.15); }
          60% { transform: scale(0.95); }
          75% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(var(--float-scale, 1)); opacity: 1; }
          100% { transform: translateY(-80px) scale(var(--float-scale, 1)); opacity: 0; }
        }
        @keyframes emojiBurst {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translate(var(--burst-x), var(--burst-y)) scale(var(--burst-scale)) rotate(var(--burst-rot)); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); }
          50% { box-shadow: 0 0 20px 8px rgba(236, 72, 153, 0.15); }
        }
        @keyframes slideInFromBottom {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes badgePop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes scrollIndicator {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(4px); }
        }
        .card-enter {
          animation: slideInFromBottom 0.5s ease-out both;
        }
        .heart-bounce {
          animation: heartBounce 0.6s ease-in-out;
        }
        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .badge-pop {
          animation: badgePop 0.3s ease-out;
        }
        .scroll-indicator {
          animation: scrollIndicator 1.5s ease-in-out infinite;
        }
        .shimmer-bg {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        .tiktok-scrollbar::-webkit-scrollbar { width: 3px; }
        .tiktok-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .tiktok-scrollbar::-webkit-scrollbar-thumb { background: rgba(236, 72, 153, 0.3); border-radius: 99px; }
      `}</style>

      {/* 헤더 / Header */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-pink-400 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 bg-clip-text text-transparent">
                JobChaJa
              </h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">
                Creative Shots
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold">
              {sampleJobsV2.length} shots
            </div>
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 / Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 타이틀 섹션 / Title section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 via-gray-800 to-emerald-500/10 border border-pink-500/10 mb-4">
            <Play className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span className="text-sm text-gray-300">
              For You &mdash; Trending Jobs
            </span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            <span className="bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent">
              Hot
            </span>{' '}
            Job Shots{' '}
            <span className="text-emerald-400">Today</span>
          </h2>
          <p className="text-gray-500 text-sm">
            Swipe through the freshest opportunities
          </p>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job, index) => (
            <JobCard
              key={job.id}
              job={job}
              index={index}
              isLiked={likedJobs.has(job.id)}
              heartCount={heartCounts[job.id] || 0}
              isBookmarked={bookmarked.has(job.id)}
              isHovered={hoveredCard === job.id}
              floatingHearts={floatingHearts[job.id] || []}
              emojiExplosions={emojiExplosions[job.id] || []}
              onLike={handleLike}
              onBookmark={toggleBookmark}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              scrollRef={(el) => {
                scrollRefs.current[job.id] = el;
              }}
            />
          ))}
        </div>

        {/* 디자인 정보 / Design info footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-900/80 border border-gray-800">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-xs text-gray-500">
              {designInfo.id} &middot; {designInfo.title} &middot; by{' '}
              {designInfo.author}
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}

// 잡 카드 컴포넌트 / Job card component
interface JobCardProps {
  job: MockJobPostingV2;
  index: number;
  isLiked: boolean;
  heartCount: number;
  isBookmarked: boolean;
  isHovered: boolean;
  floatingHearts: FloatingHeart[];
  emojiExplosions: FloatingEmoji[];
  onLike: (jobId: string, e: React.MouseEvent) => void;
  onBookmark: (jobId: string, e: React.MouseEvent) => void;
  onMouseEnter: (jobId: string) => void;
  onMouseLeave: (jobId: string) => void;
  scrollRef: (el: HTMLDivElement | null) => void;
}

function JobCard({
  job,
  index,
  isLiked,
  heartCount,
  isBookmarked,
  isHovered,
  floatingHearts,
  emojiExplosions,
  onLike,
  onBookmark,
  onMouseEnter,
  onMouseLeave,
  scrollRef,
}: JobCardProps) {
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const heartRef = useRef<HTMLButtonElement>(null);
  const [justLiked, setJustLiked] = useState(false);

  // 하트 바운스 클래스 리셋 / Reset heart bounce class
  const handleHeartClick = (e: React.MouseEvent) => {
    setJustLiked(true);
    onLike(job.id, e);
    setTimeout(() => setJustLiked(false), 600);
  };

  return (
    <div
      className="card-enter group relative"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => onMouseEnter(job.id)}
      onMouseLeave={() => onMouseLeave(job.id)}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl bg-gray-900 border transition-all duration-500
          ${isHovered
            ? 'border-pink-500/50 shadow-2xl shadow-pink-500/10 scale-[1.02]'
            : 'border-gray-800 shadow-lg shadow-black/30'
          }
          ${job.tierType === 'PREMIUM' ? 'pulse-glow' : ''}
        `}
      >
        {/* 이미지 헤더 (Dribbble shot 스타일) / Image header (Dribbble shot style) */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={job.industryImage}
            alt={job.industry}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          {/* 다크 그라데이션 오버레이 (TikTok 스타일) / Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-emerald-500/5" />

          {/* 상단 배지 / Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {job.tierType === 'PREMIUM' && (
              <div className="badge-pop flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold shadow-lg shadow-pink-500/30">
                <Star className="w-3 h-3 fill-white" />
                PREMIUM
              </div>
            )}
            {job.isUrgent && (
              <div className="badge-pop flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold animate-pulse">
                <Zap className="w-3 h-3 fill-white" />
                URGENT
              </div>
            )}
            {job.isFeatured && (
              <div className="badge-pop px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold">
                Featured
              </div>
            )}
          </div>

          {/* 우측 TikTok 스타일 인터랙션 버튼 / Right side TikTok-style interaction buttons */}
          <div
            className={`absolute right-3 top-3 flex flex-col items-center gap-3 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
          >
            {/* 하트 버튼 / Heart button */}
            <div className="relative">
              <button
                ref={heartRef}
                onClick={handleHeartClick}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all
                  ${isLiked
                    ? 'bg-pink-500 shadow-lg shadow-pink-500/40'
                    : 'bg-black/40 hover:bg-pink-500/30'
                  }
                  ${justLiked ? 'heart-bounce' : ''}
                `}
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    isLiked ? 'text-white fill-white' : 'text-white'
                  }`}
                />
              </button>
              <span className="text-[10px] text-white font-bold text-center block mt-0.5">
                {heartCount}
              </span>

              {/* 플로팅 하트 / Floating hearts */}
              {floatingHearts.map((heart) => (
                <div
                  key={heart.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `calc(50% + ${heart.x}px)`,
                    bottom: '100%',
                    ['--float-scale' as string]: heart.scale,
                    animation: `floatUp 1s ease-out ${heart.delay}ms both`,
                  }}
                >
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                </div>
              ))}

              {/* 이모지 버스트 / Emoji burst */}
              {emojiExplosions.map((em) => (
                <div
                  key={em.id}
                  className="absolute pointer-events-none text-lg"
                  style={{
                    left: '50%',
                    top: '50%',
                    ['--burst-x' as string]: `${em.x}px`,
                    ['--burst-y' as string]: `${em.y}px`,
                    ['--burst-scale' as string]: em.scale,
                    ['--burst-rot' as string]: `${em.rotation}deg`,
                    animation: 'emojiBurst 0.8s ease-out both',
                  }}
                >
                  {em.emoji}
                </div>
              ))}
            </div>

            {/* 댓글 버튼 / Comment button */}
            <div>
              <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-emerald-500/30 transition-all">
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
              <span className="text-[10px] text-white font-bold text-center block mt-0.5">
                {job.applicantCount}
              </span>
            </div>

            {/* 북마크 버튼 / Bookmark button */}
            <button
              onClick={(e) => onBookmark(job.id, e)}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                isBookmarked
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                  : 'bg-black/40 hover:bg-emerald-500/30'
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isBookmarked ? 'text-white fill-white' : 'text-white'
                }`}
              />
            </button>

            {/* 공유 버튼 / Share button */}
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white/10 transition-all">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* 하단 매칭 점수 / Bottom match score */}
          {job.matchScore && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
                style={{
                  background: `conic-gradient(#10b981 ${job.matchScore}%, transparent 0%)`,
                }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-gray-900 flex items-center justify-center" />
              </div>
              <span className="text-emerald-400 text-xs font-bold">
                {job.matchScore}%
              </span>
            </div>
          )}

          {/* D-Day 배지 / D-Day badge */}
          {dday && (
            <div
              className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                dday === '마감'
                  ? 'bg-gray-600/80 text-gray-300'
                  : dday === 'D-Day'
                  ? 'bg-red-500/90 text-white animate-pulse'
                  : dday === '상시모집'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
              }`}
            >
              {dday}
            </div>
          )}
        </div>

        {/* 카드 바디 (자동 스크롤 영역) / Card body (auto-scroll area) */}
        <div className="relative">
          {/* 스크롤 가능 영역 / Scrollable area */}
          <div
            ref={scrollRef}
            className="tiktok-scrollbar overflow-hidden p-5 pt-4 max-h-[220px]"
            style={{ overflowY: isHovered ? 'auto' : 'hidden' }}
          >
            {/* 회사 정보 + 제목 / Company info + title */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-emerald-500/20 border border-gray-700 flex items-center justify-center text-lg font-black text-pink-400 flex-shrink-0">
                {job.companyInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 truncate">{job.company}</p>
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mt-0.5">
                  {job.title}
                </h3>
              </div>
            </div>

            {/* 급여 (배민 스타일 강조) / Salary (Baemin-style emphasis) */}
            <div className="mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500/10 to-emerald-500/10 border border-pink-500/10">
              <span className="text-base font-black bg-gradient-to-r from-pink-400 to-emerald-400 bg-clip-text text-transparent">
                {salary}
              </span>
            </div>

            {/* 메타 정보 / Meta info */}
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-pink-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                {job.workHours || '협의'}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-pink-400" />
                {job.experienceRequired || '무관'}
              </span>
            </div>

            {/* 비자 태그 / Visa tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.allowedVisas.map((visa) => {
                const vc = getVisaColor(visa);
                return (
                  <span
                    key={visa}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${vc.bg} ${vc.text} border border-current/10`}
                  >
                    {visa}
                  </span>
                );
              })}
            </div>

            {/* 복리후생 / Benefits */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-[10px] border border-gray-700/50"
                >
                  {benefit}
                </span>
              ))}
            </div>

            {/* 조회수 + 지원자 (TikTok 스타일) / Views + applicants (TikTok style) */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 border-t border-gray-800/50">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {job.viewCount.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {job.applicantCount} applied
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400" />
                {heartCount}
              </span>
            </div>

            {/* 추가 스크롤 컨텐츠 (호버 시 보이는 영역) / Extra scroll content visible on hover */}
            <div className="mt-4 pt-3 border-t border-gray-800/30">
              <div className="text-[11px] text-gray-500 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-400" />
                고용 형태 / Employment Type
              </div>
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  job.boardType === 'FULL_TIME'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                }`}
              >
                {job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'}
              </span>

              <div className="text-[11px] text-gray-500 mt-3 mb-1.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                산업 / Industry
              </div>
              <span className="inline-block px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 text-[11px] border border-gray-700">
                {job.industry}
              </span>
            </div>
          </div>

          {/* 호버 시 스크롤 인디케이터 / Scroll indicator on hover */}
          {isHovered && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent flex items-end justify-center pb-1 pointer-events-none">
              <ChevronUp className="w-4 h-4 text-pink-400 scroll-indicator rotate-180" />
            </div>
          )}
        </div>

        {/* 시머 효과 (호버 시) / Shimmer effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none rounded-2xl shimmer-bg" />
        )}
      </div>
    </div>
  );
}
