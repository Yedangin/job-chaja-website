'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  MapPin,
  Clock,
  Users,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  Briefcase,
  Award,
  Zap,
  Music,
  Volume2,
} from 'lucide-react';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-091',
  title: 'Airbnb x Spotify x TikTok',
  author: 'Gemini',
  category: 'interactive',
  references: ['Airbnb', 'Spotify', 'TikTok'],
  description:
    '엔터테인먼트 통합 — 이미지 캐러셀 + 이퀄라이저 바 + 자동 스크롤 피드 / Entertainment fusion with carousel, equalizer bars, and auto-scroll feed',
};

// ─────────────────────────────────────────────────────
// 이퀄라이저 바 컴포넌트 / Equalizer bar animation component
// ─────────────────────────────────────────────────────
function EqualizerBars({ active, barCount = 5 }: { active: boolean; barCount?: number }) {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-all duration-300"
          style={{
            backgroundColor: '#1DB954',
            height: active ? `${Math.random() * 12 + 4}px` : '4px',
            animation: active ? `equalizerBounce ${0.3 + i * 0.1}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// 이미지 캐러셀 (Airbnb 스타일) / Image carousel (Airbnb style)
// ─────────────────────────────────────────────────────
function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev + 1) % images.length);
    },
    [images.length],
  );

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    },
    [images.length],
  );

  return (
    <div className="relative w-full h-full group/carousel overflow-hidden">
      {/* 이미지 슬라이드 / Image slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="min-w-full h-full flex-shrink-0 relative">
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {/* 그라데이션 오버레이 / Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* 화살표 네비게이션 / Arrow navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity shadow-lg hover:bg-white hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity shadow-lg hover:bg-white hover:scale-110"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>
        </>
      )}

      {/* 도트 인디케이터 (Airbnb 스타일) / Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-2 h-2 bg-white'
                : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// 스타 레이팅 (Airbnb 스타일) / Star rating (Airbnb style)
// ─────────────────────────────────────────────────────
function StarRating({ score }: { score: number }) {
  const fullStars = Math.floor(score / 20);
  const partial = (score % 20) / 20;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < fullStars
              ? 'text-[#FF385C] fill-[#FF385C]'
              : i === fullStars && partial > 0
              ? 'text-[#FF385C] fill-[#FF385C]/50'
              : 'text-gray-600'
          }`}
        />
      ))}
      <span className="text-xs text-gray-300 ml-1 font-medium">{(score / 20).toFixed(1)}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// TikTok 참여 사이드바 / TikTok engagement sidebar
// ─────────────────────────────────────────────────────
function EngagementSidebar({ job }: { job: MockJobPostingV2 }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 좋아요 / Like */}
      <button
        onClick={() => setLiked(!liked)}
        className="flex flex-col items-center gap-0.5 group/btn"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            liked
              ? 'bg-[#FF385C] scale-110'
              : 'bg-white/10 group-hover/btn:bg-white/20'
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              liked ? 'text-white fill-white' : 'text-white'
            }`}
          />
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          {liked ? job.applicantCount + 1 : job.applicantCount}
        </span>
      </button>

      {/* 댓글 / Comments */}
      <button className="flex flex-col items-center gap-0.5 group/btn">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-all">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] text-gray-400 font-medium">{job.viewCount}</span>
      </button>

      {/* 북마크 / Bookmark */}
      <button
        onClick={() => setSaved(!saved)}
        className="flex flex-col items-center gap-0.5 group/btn"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            saved
              ? 'bg-[#00F2EA] scale-110'
              : 'bg-white/10 group-hover/btn:bg-white/20'
          }`}
        >
          <Bookmark
            className={`w-5 h-5 transition-all ${
              saved ? 'text-gray-900 fill-gray-900' : 'text-white'
            }`}
          />
        </div>
        <span className="text-[10px] text-gray-400 font-medium">저장</span>
      </button>

      {/* 공유 / Share */}
      <button className="flex flex-col items-center gap-0.5 group/btn">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-all">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] text-gray-400 font-medium">공유</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// 메인 잡카드 (Airbnb x Spotify x TikTok) / Main job card
// ─────────────────────────────────────────────────────
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);

  // 이미지 캐러셀용 배열 생성 / Generate images for carousel
  const carouselImages = [
    job.industryImage,
    job.industryImage.replace('w=800', 'w=801'),
    job.industryImage.replace('w=800', 'w=802'),
  ];

  return (
    <div
      className="relative flex flex-row rounded-2xl overflow-hidden bg-[#181818] border border-gray-800/50 hover:border-gray-700 transition-all duration-500 group cursor-pointer"
      style={{ height: '420px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPlaying(false);
      }}
    >
      {/* ─── 좌측: Airbnb 이미지 캐러셀 영역 / Left: Airbnb image carousel ─── */}
      <div className="relative w-[280px] flex-shrink-0">
        <ImageCarousel images={carouselImages} alt={job.title} />

        {/* 좌상단 배지 영역 / Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {job.isFeatured && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#FF385C] rounded-full">
              <Award className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white tracking-wide">FEATURED</span>
            </div>
          )}
          {job.isUrgent && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#00F2EA] rounded-full">
              <Zap className="w-3 h-3 text-gray-900" />
              <span className="text-[10px] font-bold text-gray-900 tracking-wide">URGENT</span>
            </div>
          )}
          {job.tierType === 'PREMIUM' && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
              <Star className="w-3 h-3 text-white fill-white" />
              <span className="text-[10px] font-bold text-white tracking-wide">PREMIUM</span>
            </div>
          )}
        </div>

        {/* Airbnb 스타일 하단 오버레이 정보 / Airbnb-style bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/30">
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-xs font-bold text-white">${job.companyInitial}</span>`;
                }}
              />
            </div>
            <span className="text-sm font-medium text-white/90 truncate">{job.company}</span>
          </div>
          {job.matchScore && <StarRating score={job.matchScore} />}
        </div>
      </div>

      {/* ─── 중앙: 콘텐츠 영역 (TikTok 숏폼 스타일) / Center: Content area ─── */}
      <div className="flex-1 flex flex-col justify-between p-5 min-w-0 relative">
        {/* 상단 정보 / Top info */}
        <div className="space-y-3">
          {/* D-Day + 산업 / D-Day + Industry */}
          <div className="flex items-center gap-2 flex-wrap">
            {dDay && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  dDay === '마감'
                    ? 'bg-gray-700 text-gray-400'
                    : dDay === 'D-Day'
                    ? 'bg-[#FF385C]/20 text-[#FF385C]'
                    : 'bg-[#00F2EA]/10 text-[#00F2EA]'
                }`}
              >
                {dDay}
              </span>
            )}
            <span className="text-xs text-gray-500 font-medium">{job.industry}</span>
            <span className="text-xs text-gray-600">|</span>
            <span className="text-xs text-gray-500">
              {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
            </span>
          </div>

          {/* 제목 / Title */}
          <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-[#FF385C] transition-colors">
            {job.title}
          </h3>

          {/* 위치 + 시간 / Location + Hours */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-sm text-gray-400">{job.location}</span>
            </div>
            {job.workHours && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-sm text-gray-400">{job.workHours}</span>
              </div>
            )}
            {job.experienceRequired && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-sm text-gray-400">경력 {job.experienceRequired}</span>
              </div>
            )}
          </div>

          {/* 비자 태그 / Visa tags */}
          <div className="flex flex-wrap gap-1.5">
            {job.allowedVisas.map((visa) => {
              const color = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}
                >
                  {visa}
                </span>
              );
            })}
          </div>

          {/* 혜택 태그 / Benefit tags */}
          <div className="flex flex-wrap gap-1.5">
            {job.benefits.slice(0, 3).map((benefit) => (
              <span
                key={benefit}
                className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 3 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                +{job.benefits.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* ─── 하단: Spotify 플레이어 바 / Bottom: Spotify player bar ─── */}
        <div
          className={`mt-auto pt-3 border-t border-gray-800 transition-all duration-500 ${
            isHovered ? 'border-[#1DB954]/30' : ''
          }`}
        >
          {/* 급여 + 매칭 스코어 / Salary + Match score */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-bold text-[#1DB954]">{salary}</span>
            {job.matchScore && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-500">매칭</span>
                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1DB954] to-[#00F2EA] transition-all duration-700"
                    style={{ width: `${job.matchScore}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#1DB954]">{job.matchScore}%</span>
              </div>
            )}
          </div>

          {/* Spotify 스타일 플레이어 / Spotify-style player */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 재생 버튼 / Play button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isPlaying
                    ? 'bg-[#1DB954] scale-110 shadow-lg shadow-[#1DB954]/30'
                    : 'bg-white/10 hover:bg-[#1DB954] hover:scale-105'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white ml-0.5" />
                )}
              </button>

              <SkipForward className="w-4 h-4 text-gray-500 hover:text-white transition-colors cursor-pointer" />

              {/* 이퀄라이저 바 / Equalizer bars */}
              <EqualizerBars active={isPlaying || isHovered} />
            </div>

            {/* 통계 / Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[11px] text-gray-500">{job.applicantCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[11px] text-gray-500">{job.viewCount.toLocaleString()}</span>
              </div>
              <Volume2
                className={`w-3.5 h-3.5 transition-colors ${
                  isPlaying ? 'text-[#1DB954]' : 'text-gray-600'
                }`}
              />
            </div>
          </div>

          {/* 프로그레스 바 / Progress bar */}
          <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isHovered
                  ? 'bg-gradient-to-r from-[#1DB954] to-[#00F2EA]'
                  : 'bg-gray-700'
              }`}
              style={{ width: isHovered ? '65%' : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* ─── 우측: TikTok 참여 사이드바 / Right: TikTok engagement sidebar ─── */}
      <div
        className={`flex flex-col items-center justify-center px-3 transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
      >
        <EngagementSidebar job={job} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// 자동 스크롤 피드 (TikTok 스타일) / Auto-scroll feed (TikTok style)
// ─────────────────────────────────────────────────────
export default function G091Page() {
  const [autoScroll, setAutoScroll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 스크롤 기능 / Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      return;
    }

    autoScrollIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % sampleJobsV2.length;
        cardRefs.current[next]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        return next;
      });
    }, 3500);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [autoScroll]);

  // 스크롤 관찰 / Scroll observation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.findIndex((ref) => ref === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.6 },
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* 이퀄라이저 키프레임 애니메이션 / Equalizer keyframe animation */}
      <style>{`
        @keyframes equalizerBounce {
          0% { height: 4px; }
          100% { height: 16px; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(29, 185, 84, 0); }
          50% { box-shadow: 0 0 20px 4px rgba(29, 185, 84, 0.2); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ─── 헤더 / Header ─── */}
      <header className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 좌측: 타이틀 / Left: Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF385C] via-[#1DB954] to-[#00F2EA] flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">JobChaJa</h1>
                <p className="text-[11px] text-gray-500">
                  {designInfo.id} &mdash; {designInfo.references.join(' x ')}
                </p>
              </div>
            </div>

            {/* 우측: 자동 스크롤 토글 / Right: Auto-scroll toggle */}
            <div className="flex items-center gap-4">
              {/* 피드 인디케이터 / Feed indicator */}
              <div className="hidden sm:flex items-center gap-1">
                {sampleJobsV2.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-6 bg-[#FF385C]'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* 자동 스크롤 버튼 / Auto-scroll button */}
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  autoScroll
                    ? 'bg-[#1DB954] text-white shadow-lg shadow-[#1DB954]/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
                style={autoScroll ? { animation: 'pulseGlow 2s infinite' } : {}}
              >
                {autoScroll ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>자동 재생 중</span>
                    <EqualizerBars active barCount={3} />
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>자동 스크롤</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── 피드 콘텐츠 / Feed content ─── */}
      <main
        ref={feedRef}
        className="max-w-5xl mx-auto px-4 py-6 space-y-4 scrollbar-hide"
      >
        {/* 피드 상단 텍스트 / Feed top text */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">For You</span>
            <span className="text-sm text-gray-500">|</span>
            <span className="text-sm text-gray-500 hover:text-white cursor-pointer transition-colors">
              Following
            </span>
            <span className="text-sm text-gray-500">|</span>
            <span className="text-sm text-gray-500 hover:text-white cursor-pointer transition-colors">
              Trending
            </span>
          </div>
          <span className="text-xs text-gray-600">
            {sampleJobsV2.length}개 공고 / {sampleJobsV2.length} jobs
          </span>
        </div>

        {/* 잡카드 피드 / Job card feed */}
        {sampleJobsV2.map((job, index) => (
          <div
            key={job.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={`transition-all duration-500 ${
              index === activeIndex
                ? 'scale-100 opacity-100'
                : 'scale-[0.98] opacity-80'
            }`}
          >
            <JobCard job={job} index={index} />
          </div>
        ))}

        {/* 피드 끝 / End of feed */}
        <div className="flex flex-col items-center py-10 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-gray-700" />
            <span className="text-sm text-gray-600 font-medium">End of Feed</span>
            <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-gray-700" />
          </div>
          <p className="text-xs text-gray-700">
            Designed by {designInfo.author} &mdash; {designInfo.id}
          </p>
        </div>
      </main>

      {/* ─── 하단 Spotify 스타일 나우 플레잉 바 / Bottom Spotify-style Now Playing bar ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#181818] border-t border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 좌측: 현재 공고 미니 정보 / Left: Current job mini info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={sampleJobsV2[activeIndex]?.industryImage}
                  alt="current"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {sampleJobsV2[activeIndex]?.title}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {sampleJobsV2[activeIndex]?.company}
                </p>
              </div>
              <Heart className="w-4 h-4 text-gray-400 hover:text-[#FF385C] transition-colors cursor-pointer flex-shrink-0" />
            </div>

            {/* 중앙: 컨트롤 / Center: Controls */}
            <div className="flex items-center gap-4 px-6">
              <SkipForward className="w-4 h-4 text-gray-400 rotate-180 cursor-pointer hover:text-white transition-colors" />
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  autoScroll ? 'bg-[#1DB954]' : 'bg-white hover:scale-105'
                }`}
              >
                {autoScroll ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-black ml-0.5" />
                )}
              </button>
              <SkipForward className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            </div>

            {/* 우측: 볼륨 + 이퀄라이저 / Right: Volume + Equalizer */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <EqualizerBars active={autoScroll} barCount={4} />
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-gray-400 rounded-full hover:bg-[#1DB954] transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
