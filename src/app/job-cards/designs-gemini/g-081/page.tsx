'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Repeat2,
  Bookmark,
  Play,
  Music2,
  Eye,
  MapPin,
  Clock,
  Briefcase,
  ChevronRight,
  Flame,
  Star,
  Users,
  Send,
  MoreHorizontal,
  Plus,
  Home,
  Search,
  Sparkles,
  TrendingUp,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';

// 디자인 정보 / Design info
export const designInfo = {
  id: 'g-081',
  name: 'TikTok\u00d7\uc778\uc2a4\ud0c0\u00d7\ud2b8\uc704\ud130',
  category: 'interactive',
  author: 'Gemini',
};

// 인게이지먼트 데이터 생성 / Generate engagement data
function generateEngagement(job: MockJobPostingV2) {
  return {
    likes: Math.floor(job.viewCount * 0.4 + Math.random() * 500),
    comments: Math.floor(job.applicantCount * 2.5 + Math.random() * 100),
    retweets: Math.floor(job.viewCount * 0.12 + Math.random() * 200),
    shares: Math.floor(job.viewCount * 0.08 + Math.random() * 80),
    bookmarks: Math.floor(job.viewCount * 0.15 + Math.random() * 120),
  };
}

// ===== Instagram 스토리 서클 / Instagram Story Circle =====
function StoryCircle({
  job,
  isActive,
  onClick,
}: {
  job: MockJobPostingV2;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
    >
      {/* 그라디언트 보더 링 / Gradient border ring */}
      <div
        className={`rounded-full p-[2.5px] transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-br from-gray-600 to-gray-800'
            : 'bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-500'
        } group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-fuchsia-500/30`}
      >
        <div className="rounded-full p-[2px] bg-black">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-900 flex items-center justify-center">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-contain p-1.5 bg-white rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-lg font-bold text-white">${job.companyInitial}</span>`;
                }
              }}
            />
          </div>
        </div>
      </div>
      <span className="text-[10px] text-gray-400 max-w-[68px] truncate group-hover:text-white transition-colors">
        {job.company.split(' ')[0]}
      </span>
    </button>
  );
}

// ===== TikTok 릴스 카드 / TikTok Reels Card =====
function TikTokReelCard({
  job,
  engagement,
  isPlaying,
  onTogglePlay,
}: {
  job: MockJobPostingV2;
  engagement: ReturnType<typeof generateEngagement>;
  isPlaying: boolean;
  onTogglePlay: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(engagement.likes);
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="relative w-full aspect-[9/16] max-h-[580px] rounded-xl overflow-hidden group bg-black">
      {/* 배경 이미지 / Background image */}
      <img
        src={job.industryImage}
        alt={job.industry}
        className="absolute inset-0 w-full h-full object-cover brightness-50 scale-105 group-hover:scale-110 transition-transform duration-700"
      />

      {/* 그라디언트 오버레이 / Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />

      {/* 재생 버튼 중앙 / Center play button */}
      <button
        onClick={onTogglePlay}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        {!isPlaying && (
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        )}
      </button>

      {/* 상단 배지 / Top badges */}
      <div className="absolute top-3 left-3 right-12 z-20 flex items-center gap-2">
        {job.isUrgent && (
          <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1 animate-pulse">
            <Flame className="w-3 h-3" /> LIVE
          </span>
        )}
        {job.isFeatured && (
          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full">
            Featured
          </span>
        )}
        {dday && (
          <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] rounded-full">
            {dday}
          </span>
        )}
      </div>

      {/* 볼륨 토글 / Volume toggle */}
      <button
        onClick={onTogglePlay}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-white" />
        ) : (
          <VolumeX className="w-4 h-4 text-white" />
        )}
      </button>

      {/* 우측 인게이지먼트 버튼 (TikTok 스타일) / Right engagement buttons */}
      <div className="absolute right-3 bottom-36 z-20 flex flex-col items-center gap-5">
        {/* 프로필 / Profile */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-contain p-0.5"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* 좋아요 / Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              liked ? 'bg-rose-500/20' : 'bg-white/10 backdrop-blur-sm'
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-all ${
                liked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-white'
              }`}
            />
          </div>
          <span className="text-[11px] text-white font-medium">
            {likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
          </span>
        </button>

        {/* 댓글 / Comments */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] text-white font-medium">{engagement.comments}</span>
        </button>

        {/* 북마크 / Bookmark */}
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              bookmarked ? 'bg-amber-500/20' : 'bg-white/10 backdrop-blur-sm'
            }`}
          >
            <Bookmark
              className={`w-6 h-6 transition-all ${
                bookmarked ? 'text-amber-400 fill-amber-400' : 'text-white'
              }`}
            />
          </div>
          <span className="text-[11px] text-white font-medium">{engagement.bookmarks}</span>
        </button>

        {/* 공유 / Share */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] text-white font-medium">{engagement.shares}</span>
        </button>

        {/* 음악 디스크 / Music disc */}
        <div className="w-10 h-10 rounded-full border-2 border-gray-600 overflow-hidden animate-[spin_4s_linear_infinite]">
          <img
            src={job.companyLogo}
            alt=""
            className="w-full h-full object-contain p-1 bg-gray-900"
          />
        </div>
      </div>

      {/* 하단 정보 (TikTok 캡션 스타일) / Bottom info TikTok caption style */}
      <div className="absolute bottom-0 left-0 right-14 z-20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-white text-sm">@{job.company.replace(/\s/g, '_')}</span>
          {job.tierType === 'PREMIUM' && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-blue-500 text-[9px] text-white rounded font-bold">
              <Star className="w-2.5 h-2.5 fill-white" /> PRO
            </span>
          )}
        </div>
        <p className="text-white text-sm font-medium mb-2 line-clamp-2 leading-relaxed">
          {job.title}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {job.allowedVisas.slice(0, 3).map((visa) => {
            const vc = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${vc.bg} ${vc.text}`}
              >
                #{visa}
              </span>
            );
          })}
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
            #{salary}
          </span>
        </div>
        {/* 음악 라인 / Music ticker */}
        <div className="flex items-center gap-2 text-white/70">
          <Music2 className="w-3.5 h-3.5" />
          <div className="overflow-hidden flex-1">
            <p className="text-[11px] whitespace-nowrap animate-[marquee_8s_linear_infinite]">
              {job.location} &bull; {job.workHours || '협의'} &bull; {job.experienceRequired || '경험 무관'} &bull; {job.benefits.join(' &bull; ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Twitter/X 트윗 카드 / Twitter/X Tweet Card =====
function TweetCard({
  job,
  engagement,
}: {
  job: MockJobPostingV2;
  engagement: ReturnType<typeof generateEngagement>;
}) {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [likeCount, setLikeCount] = useState(engagement.likes);
  const [retweetCount, setRetweetCount] = useState(engagement.retweets);
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweetCount((prev) => (retweeted ? prev - 1 : prev + 1));
  };

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className="bg-[#16181c] border border-gray-800 rounded-xl p-4 hover:bg-[#1d1f23] transition-all duration-200 group cursor-pointer">
      {/* 리트윗 표시 / Retweet indicator */}
      {job.isFeatured && (
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 ml-10">
          <Repeat2 className="w-3.5 h-3.5" />
          <span>JobChaJa Trending</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* 아바타 / Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-sm font-bold text-gray-800 flex items-center justify-center w-full h-full">${job.companyInitial}</span>`;
                }
              }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* 헤더 / Header */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-white text-sm truncate">{job.company}</span>
            {job.tierType === 'PREMIUM' && (
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.29 4.71L7.7 13.45l1.41-1.41 1.85 1.85 5.93-5.93 1.41 1.41-7.34 7.34z" />
              </svg>
            )}
            <span className="text-gray-500 text-sm flex-shrink-0">@{job.company.replace(/\s/g, '_').toLowerCase()}</span>
            <span className="text-gray-600 text-sm flex-shrink-0">&middot;</span>
            <span className="text-gray-500 text-sm flex-shrink-0">
              {Math.floor((Date.now() - new Date(job.postedDate).getTime()) / 86400000)}d
            </span>
            <button className="ml-auto text-gray-600 hover:text-blue-400 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* 트윗 내용 / Tweet content */}
          <div className="mb-3">
            <p className="text-white text-[15px] leading-relaxed mb-2">
              {job.isUrgent && (
                <span className="text-red-400 font-bold">[URGENT] </span>
              )}
              {job.title}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              <span className="text-blue-400">#{job.industry.replace('/', '')}</span>{' '}
              <span className="text-blue-400">#{job.location.split(' ')[0]}</span>{' '}
              {job.allowedVisas.map((v) => (
                <span key={v} className="text-blue-400">#{v} </span>
              ))}
            </p>
          </div>

          {/* 카드 미디어 / Card media */}
          <div className="rounded-xl border border-gray-800 overflow-hidden mb-3">
            <div className="relative h-32 overflow-hidden">
              <img
                src={job.industryImage}
                alt={job.industry}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              {/* 오버레이 정보 / Overlay info */}
              <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                <div>
                  <p className="text-white font-bold text-sm">{salary}</p>
                  <div className="flex items-center gap-2 text-gray-300 text-xs mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
                    </span>
                  </div>
                </div>
                {dday && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      dday === '마감'
                        ? 'bg-gray-700 text-gray-400'
                        : dday === 'D-Day'
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-white/20 backdrop-blur-sm text-white'
                    }`}
                  >
                    {dday}
                  </span>
                )}
              </div>
            </div>
            {/* 비자 배지 줄 / Visa badge row */}
            <div className="px-3 py-2 bg-[#1e2028] flex items-center gap-1.5 overflow-x-auto">
              {job.allowedVisas.map((visa) => {
                const vc = getVisaColor(visa);
                return (
                  <span
                    key={visa}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${vc.bg} ${vc.text}`}
                  >
                    {visa}
                  </span>
                );
              })}
              {job.matchScore && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 flex-shrink-0">
                  {job.matchScore}% match
                </span>
              )}
            </div>
          </div>

          {/* 인게이지먼트 바 (Twitter 스타일) / Engagement bar */}
          <div className="flex items-center justify-between max-w-[380px] text-gray-500">
            {/* 댓글 / Reply */}
            <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group/btn">
              <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover/btn:bg-blue-400/10 transition-colors">
                <MessageCircle className="w-[18px] h-[18px]" />
              </div>
              <span className="text-xs">{formatCount(engagement.comments)}</span>
            </button>

            {/* 리트윗 / Retweet */}
            <button
              onClick={handleRetweet}
              className={`flex items-center gap-1.5 transition-colors group/btn ${
                retweeted ? 'text-green-400' : 'hover:text-green-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  retweeted ? 'bg-green-400/10' : 'group-hover/btn:bg-green-400/10'
                }`}
              >
                <Repeat2 className="w-[18px] h-[18px]" />
              </div>
              <span className="text-xs">{formatCount(retweetCount)}</span>
            </button>

            {/* 좋아요 / Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors group/btn ${
                liked ? 'text-rose-500' : 'hover:text-rose-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  liked ? 'bg-rose-500/10' : 'group-hover/btn:bg-rose-500/10'
                }`}
              >
                <Heart
                  className={`w-[18px] h-[18px] transition-all ${
                    liked ? 'fill-rose-500 scale-110' : ''
                  }`}
                />
              </div>
              <span className="text-xs">{formatCount(likeCount)}</span>
            </button>

            {/* 뷰 / Views */}
            <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group/btn">
              <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover/btn:bg-blue-400/10 transition-colors">
                <Eye className="w-[18px] h-[18px]" />
              </div>
              <span className="text-xs">{formatCount(job.viewCount)}</span>
            </button>

            {/* 북마크 + 공유 / Bookmark + Share */}
            <div className="flex items-center gap-0">
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-400/10 hover:text-blue-400 transition-colors">
                <Bookmark className="w-[18px] h-[18px]" />
              </button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-400/10 hover:text-blue-400 transition-colors">
                <Share2 className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== 메인 페이지 / Main Page =====
export default function G081Page() {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'foryou' | 'following' | 'trending'>('foryou');
  const [viewMode, setViewMode] = useState<'reels' | 'tweets'>('tweets');
  const [currentReel, setCurrentReel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [engagements] = useState(() =>
    sampleJobsV2.reduce(
      (acc, job) => {
        acc[job.id] = generateEngagement(job);
        return acc;
      },
      {} as Record<string, ReturnType<typeof generateEngagement>>
    )
  );

  // 릴스 스와이프 핸들러 / Reels swipe handler
  const nextReel = useCallback(() => {
    setCurrentReel((prev) => (prev + 1) % sampleJobsV2.length);
    setIsPlaying(false);
  }, []);

  const prevReel = useCallback(() => {
    setCurrentReel((prev) => (prev - 1 + sampleJobsV2.length) % sampleJobsV2.length);
    setIsPlaying(false);
  }, []);

  // 키보드 네비게이션 / Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'reels') {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextReel();
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prevReel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, nextReel, prevReel]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 마키 애니메이션 스타일 / Marquee animation style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-lg mx-auto relative">
        {/* ===== 상단 헤더 / Top Header ===== */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-500 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-fuchsia-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                  JobChaJa
                </h1>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode(viewMode === 'reels' ? 'tweets' : 'reels')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    viewMode === 'reels'
                      ? 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {viewMode === 'reels' ? 'Reels' : 'Feed'}
                </button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors relative">
                  <Send className="w-5 h-5 text-gray-400 -rotate-12" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-black" />
                </button>
              </div>
            </div>

            {/* 탭 바 / Tab bar */}
            <div className="flex items-center gap-6">
              {(['foryou', 'following', 'trending'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-2 text-sm font-medium transition-colors ${
                    activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab === 'foryou' ? 'For You' : tab === 'following' ? 'Following' : 'Trending'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-fuchsia-500 to-rose-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Instagram 스토리 바 / Instagram Story Bar ===== */}
        <div className="px-4 py-3 border-b border-gray-800/30">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {/* 내 스토리 추가 버튼 / Add my story button */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-fuchsia-400 hover:bg-fuchsia-500/5 transition-all cursor-pointer group">
                <Plus className="w-6 h-6 text-gray-500 group-hover:text-fuchsia-400 transition-colors" />
              </div>
              <span className="text-[10px] text-gray-500">My Jobs</span>
            </div>
            {sampleJobsV2.map((job) => (
              <StoryCircle
                key={job.id}
                job={job}
                isActive={activeStory === job.id}
                onClick={() => setActiveStory(activeStory === job.id ? null : job.id)}
              />
            ))}
          </div>
        </div>

        {/* ===== 메인 콘텐츠 / Main Content ===== */}
        {viewMode === 'reels' ? (
          /* TikTok 릴스 뷰 / TikTok Reels View */
          <div className="relative">
            {/* 릴스 콘텐츠 / Reel content */}
            <div className="px-2 py-3">
              <div
                className="animate-slideUp"
                key={currentReel}
              >
                <TikTokReelCard
                  job={sampleJobsV2[currentReel]}
                  engagement={engagements[sampleJobsV2[currentReel].id]}
                  isPlaying={isPlaying}
                  onTogglePlay={() => setIsPlaying(!isPlaying)}
                />
              </div>
            </div>

            {/* 스와이프 힌트 / Swipe hints */}
            <div className="flex items-center justify-center gap-2 py-3">
              {sampleJobsV2.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentReel(idx);
                    setIsPlaying(false);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentReel
                      ? 'w-6 h-1.5 bg-gradient-to-r from-fuchsia-500 to-rose-500'
                      : 'w-1.5 h-1.5 bg-gray-700 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            {/* 스와이프 영역 / Swipe area buttons */}
            <button
              onClick={prevReel}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-6 h-6 text-white/50 rotate-180" />
            </button>
            <button
              onClick={nextReel}
              className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-6 h-6 text-white/50" />
            </button>
          </div>
        ) : (
          /* Twitter/X 피드 뷰 / Twitter/X Feed View */
          <div className="divide-y divide-gray-800/50">
            {/* 트렌딩 배너 / Trending banner */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-fuchsia-500/5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">Trending in Jobs</span>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {['#외국인채용', '#비자매칭', '#E9비자', '#H2비자', '#취업'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium whitespace-nowrap hover:bg-blue-500/20 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 트윗 카드 목록 / Tweet card list */}
            {sampleJobsV2.map((job, idx) => (
              <div
                key={job.id}
                className="animate-slideUp"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <TweetCard job={job} engagement={engagements[job.id]} />
              </div>
            ))}
          </div>
        )}

        {/* ===== 하단 네비게이션 (Twitter 스타일) / Bottom Nav ===== */}
        <div className="sticky bottom-0 z-50 bg-black/90 backdrop-blur-xl border-t border-gray-800/50">
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center gap-0.5 p-2 text-white">
              <Home className="w-6 h-6" />
            </button>
            <button className="flex flex-col items-center gap-0.5 p-2 text-gray-500 hover:text-white transition-colors">
              <Search className="w-6 h-6" />
            </button>
            {/* 중앙 FAB (TikTok 스타일 + 버튼) / Center FAB */}
            <button className="relative -mt-4">
              <div className="absolute inset-0 bg-blue-500 rounded-lg translate-x-0.5 translate-y-0" />
              <div className="absolute inset-0 bg-rose-500 rounded-lg -translate-x-0.5 translate-y-0" />
              <div className="relative w-12 h-8 bg-white rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-black" />
              </div>
            </button>
            <button className="flex flex-col items-center gap-0.5 p-2 text-gray-500 hover:text-white transition-colors relative">
              <Sparkles className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-fuchsia-500 rounded-full" />
            </button>
            <button className="flex flex-col items-center gap-0.5 p-2 text-gray-500 hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ===== 스토리 모달 / Story Modal ===== */}
        {activeStory && (() => {
          const storyJob = sampleJobsV2.find((j) => j.id === activeStory);
          if (!storyJob) return null;
          const storyDDay = getDDay(storyJob.closingDate);
          const storySalary = formatSalary(storyJob);
          return (
            <div
              className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
              onClick={() => setActiveStory(null)}
            >
              <div
                className="relative w-full max-w-sm mx-4 aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 스토리 배경 / Story background */}
                <img
                  src={storyJob.industryImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

                {/* 프로그레스 바 / Progress bars */}
                <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
                  {sampleJobsV2.map((j, idx) => (
                    <div
                      key={j.id}
                      className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/30"
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          j.id === activeStory
                            ? 'bg-white w-full animate-[grow_5s_linear]'
                            : sampleJobsV2.indexOf(storyJob) > idx
                            ? 'bg-white w-full'
                            : 'w-0'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* 스토리 헤더 / Story header */}
                <div className="absolute top-6 left-4 right-4 z-10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-white/20">
                    <img
                      src={storyJob.companyLogo}
                      alt=""
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{storyJob.company}</p>
                    <p className="text-white/60 text-[10px]">
                      {Math.floor((Date.now() - new Date(storyJob.postedDate).getTime()) / 3600000)}h ago
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveStory(null)}
                    className="text-white/70 hover:text-white text-xl font-light"
                  >
                    &times;
                  </button>
                </div>

                {/* 스토리 콘텐츠 / Story content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <div className="space-y-3">
                    {storyJob.isUrgent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        <Flame className="w-3 h-3" /> HIRING NOW
                      </span>
                    )}
                    <h3 className="text-white text-xl font-bold leading-tight">
                      {storyJob.title}
                    </h3>
                    <p className="text-white/90 text-base font-semibold">{storySalary}</p>
                    <div className="flex items-center gap-3 text-white/70 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {storyJob.location}
                      </span>
                      {storyDDay && (
                        <span className={`font-medium ${storyDDay === '마감' ? 'text-gray-400' : storyDDay.startsWith('D-') && parseInt(storyDDay.slice(2)) <= 5 ? 'text-red-400' : 'text-white/70'}`}>
                          {storyDDay}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {storyJob.allowedVisas.map((visa) => {
                        const vc = getVisaColor(visa);
                        return (
                          <span
                            key={visa}
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${vc.bg} ${vc.text}`}
                          >
                            {visa}
                          </span>
                        );
                      })}
                    </div>
                    {/* CTA / Call to action */}
                    <div className="flex items-center gap-3 pt-2">
                      <button className="flex-1 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-fuchsia-500/30 transition-all active:scale-95">
                        Apply Now
                      </button>
                      <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Share2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 좌/우 탭 네비게이션 / Left/right tap navigation */}
                <button
                  className="absolute top-0 left-0 w-1/3 h-full z-[5]"
                  onClick={() => {
                    const idx = sampleJobsV2.findIndex((j) => j.id === activeStory);
                    if (idx > 0) setActiveStory(sampleJobsV2[idx - 1].id);
                  }}
                />
                <button
                  className="absolute top-0 right-0 w-1/3 h-full z-[5]"
                  onClick={() => {
                    const idx = sampleJobsV2.findIndex((j) => j.id === activeStory);
                    if (idx < sampleJobsV2.length - 1) setActiveStory(sampleJobsV2[idx + 1].id);
                    else setActiveStory(null);
                  }}
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}