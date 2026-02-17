'use client';

import { useState, useCallback } from 'react';
import {
  Heart,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Users,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  BadgeCheck,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-078',
  name: 'Airbnb\u00d7Pinterest\u00d7Dribbble',
  category: 'creative',
  author: 'Gemini',
};

// 캐러셀 이미지 생성 (산업 이미지 변형) / Generate carousel images from industry image
function getCarouselImages(job: MockJobPostingV2): string[] {
  const base = job.industryImage;
  return [
    base,
    base.replace('w=800', 'w=801'),
    base.replace('w=800', 'w=802'),
  ];
}

// 별점 계산 (matchScore 기반, 5점 만점) / Star rating from matchScore (5-star scale)
function getStarRating(score?: number): number {
  if (!score) return 3.5;
  return Math.round((score / 100) * 5 * 2) / 2;
}

// 개별 카드 컴포넌트 / Individual card component
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 120) + 15);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);

  const images = getCarouselImages(job);
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const starRating = getStarRating(job.matchScore);

  // 하트 토글 + 애니메이션 / Heart toggle with animation
  const handleLike = useCallback(() => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    if (!isLiked) {
      setHeartAnimating(true);
      setTimeout(() => setHeartAnimating(false), 600);
    }
  }, [isLiked]);

  // 더블 클릭 하트 (Dribbble 스타일) / Double click heart (Dribbble style)
  const handleDoubleClick = useCallback(() => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    setShowBigHeart(true);
    setTimeout(() => setShowBigHeart(false), 800);
  }, [isLiked]);

  // 캐러셀 이동 / Carousel navigation
  const goToSlide = (direction: 'prev' | 'next') => {
    setCurrentSlide((prev) => {
      if (direction === 'next') return (prev + 1) % images.length;
      return (prev - 1 + images.length) % images.length;
    });
  };

  // 메이슨리 높이 변형 (Pinterest 스타일) / Masonry height variation (Pinterest style)
  const heightVariants = ['h-48', 'h-56', 'h-52', 'h-60', 'h-44', 'h-54'];
  const imageHeight = heightVariants[index % heightVariants.length];

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
        isHovered
          ? 'shadow-2xl shadow-pink-200/40 -translate-y-2 scale-[1.02]'
          : 'shadow-md shadow-gray-200/60 hover:shadow-lg'
      } ${job.tierType === 'PREMIUM' ? 'ring-2 ring-rose-200' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      {/* 히어로 이미지 캐러셀 (Airbnb 스타일) / Hero image carousel (Airbnb style) */}
      <div className={`relative ${imageHeight} overflow-hidden`}>
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="min-w-full h-full relative">
              <img
                src={img}
                alt={`${job.company} - ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {/* 이미지 오버레이 그라데이션 / Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {/* 더블 클릭 큰 하트 (Dribbble 스타일) / Big heart on double click (Dribbble style) */}
        {showBigHeart && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <Heart
              className="w-20 h-20 text-white fill-rose-500 drop-shadow-lg animate-ping"
              style={{ animationDuration: '0.6s', animationIterationCount: '1' }}
            />
          </div>
        )}

        {/* 캐러셀 컨트롤 (호버 시 표시) / Carousel controls (visible on hover) */}
        {isHovered && images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToSlide('prev');
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToSlide('next');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}

        {/* 캐러셀 도트 (Airbnb 스타일) / Carousel dots (Airbnb style) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(i);
              }}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === i
                  ? 'w-2 h-2 bg-white shadow-md'
                  : 'w-1.5 h-1.5 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* 상단 좌측 배지 / Top left badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {job.tierType === 'PREMIUM' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg">
              <Sparkles className="w-3 h-3" />
              Premium
            </span>
          )}
          {job.isUrgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
              <Zap className="w-3 h-3" />
              Urgent
            </span>
          )}
          {job.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-amber-600 text-xs font-medium rounded-full">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              Featured
            </span>
          )}
        </div>

        {/* 상단 우측: 핀/저장 + 하트 (Pinterest + Dribbble) / Top right: Pin + Heart */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
          {/* 핀 저장 버튼 (Pinterest 스타일) / Pin save button (Pinterest style) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPinned(!isPinned);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              isPinned
                ? 'bg-rose-600 text-white scale-110'
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-rose-500 hover:scale-110'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 transition-all duration-300 ${
                isPinned ? 'fill-white' : ''
              }`}
            />
          </button>

          {/* 하트 버튼 (Dribbble 스타일) / Heart button (Dribbble style) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              isLiked
                ? 'bg-pink-500 text-white'
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-pink-500'
            } ${heartAnimating ? 'scale-125' : 'hover:scale-110'}`}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                isLiked ? 'fill-white' : ''
              } ${heartAnimating ? 'animate-bounce' : ''}`}
            />
          </button>
        </div>

        {/* D-Day 표시 (이미지 하단 좌측) / D-Day display (bottom left of image) */}
        {dDay && (
          <div className="absolute bottom-3 left-3 z-20">
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-md ${
                dDay === '마감'
                  ? 'bg-gray-800/80 text-gray-300'
                  : dDay === 'D-Day' || (dDay.startsWith('D-') && parseInt(dDay.slice(2)) <= 3)
                  ? 'bg-red-500/90 text-white'
                  : 'bg-white/90 backdrop-blur-sm text-gray-700'
              }`}
            >
              {dDay}
            </span>
          </div>
        )}
      </div>

      {/* 카드 바디 / Card body */}
      <div className="p-4">
        {/* 회사 정보 + Airbnb 별점 / Company info + Airbnb star rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-gray-200">
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-contain p-0.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">${job.companyInitial}</span>`;
                }}
              />
            </div>
            <span className="text-sm text-gray-500 font-medium truncate max-w-[140px]">
              {job.company}
            </span>
            {job.tierType === 'PREMIUM' && (
              <BadgeCheck className="w-4 h-4 text-rose-500 flex-shrink-0" />
            )}
          </div>

          {/* Airbnb 별점 (matchScore 기반) / Airbnb stars from matchScore */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span className="text-sm font-semibold text-gray-800">
              {starRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors duration-300">
          {job.title}
        </h3>

        {/* 위치 + 근무시간 / Location + work hours */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.location}
          </span>
          {job.workHours && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {job.workHours.length > 15
                ? job.workHours.substring(0, 15) + '...'
                : job.workHours}
            </span>
          )}
        </div>

        {/* 급여 (큰 폰트, 핑크) / Salary (large font, pink accent) */}
        <div className="mb-3">
          <span className="text-lg font-bold text-rose-600">{salary}</span>
        </div>

        {/* 비자 태그 / Visa tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {job.allowedVisas.slice(0, 3).map((visa) => {
            const colors = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`${colors.bg} ${colors.text} px-2 py-0.5 text-xs font-medium rounded-full`}
              >
                {visa}
              </span>
            );
          })}
          {job.allowedVisas.length > 3 && (
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 text-xs font-medium rounded-full">
              +{job.allowedVisas.length - 3}
            </span>
          )}
        </div>

        {/* 혜택 칩 (Pinterest 태그 스타일) / Benefits chips (Pinterest tag style) */}
        <div className="flex flex-wrap gap-1 mb-3">
          {job.benefits.slice(0, 3).map((b) => (
            <span
              key={b}
              className="bg-gray-50 text-gray-600 px-2 py-0.5 text-xs rounded-full border border-gray-100"
            >
              {b}
            </span>
          ))}
        </div>

        {/* 매치 스코어 바 / Match score bar */}
        {job.matchScore && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Match
              </span>
              <span className="text-xs font-semibold text-rose-500">{job.matchScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-700 ease-out"
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Dribbble 스타일 하단 (좋아요 + 조회 + 공유) / Dribbble style footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {/* 하트 카운트 (Dribbble) / Heart count (Dribbble) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="flex items-center gap-1 group/heart"
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isLiked
                    ? 'fill-pink-500 text-pink-500 scale-110'
                    : 'text-gray-400 group-hover/heart:text-pink-400'
                }`}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isLiked ? 'text-pink-500' : 'text-gray-400'
                }`}
              >
                {likeCount}
              </span>
            </button>

            {/* 조회수 / View count */}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Eye className="w-3.5 h-3.5" />
              {job.viewCount.toLocaleString()}
            </span>

            {/* 지원자수 / Applicant count */}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Users className="w-3.5 h-3.5" />
              {job.applicantCount}
            </span>
          </div>

          {/* 공유 버튼 / Share button */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 호버 시 "지원하기" 오버레이 (Dribbble detail arrow 스타일) / Hover apply overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-500 via-rose-500/95 to-transparent pt-16 pb-4 px-4 transition-all duration-400 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } pointer-events-none`}
      >
        <div className="flex items-center justify-between pointer-events-auto">
          <div>
            <p className="text-white/80 text-xs font-medium">지원하기 / Apply Now</p>
            <p className="text-white text-sm font-bold">{salary}</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G078Page() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'premium' | 'fulltime' | 'parttime'>(
    'all'
  );

  const filteredJobs = sampleJobsV2.filter((job) => {
    if (activeFilter === 'premium') return job.tierType === 'PREMIUM';
    if (activeFilter === 'fulltime') return job.boardType === 'FULL_TIME';
    if (activeFilter === 'parttime') return job.boardType === 'PART_TIME';
    return true;
  });

  const filters: { key: typeof activeFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'premium', label: 'Premium' },
    { key: 'fulltime', label: 'Full-time' },
    { key: 'parttime', label: 'Part-time' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 (Dribbble + Airbnb 혼합) / Header (Dribbble + Airbnb blend) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고 / Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md shadow-rose-200">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">JobChaJa</h1>
                <p className="text-[10px] text-rose-400 font-medium -mt-0.5">
                  {designInfo.name}
                </p>
              </div>
            </div>

            {/* 필터 탭 (Dribbble 스타일) / Filter tabs (Dribbble style) */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                    activeFilter === f.key
                      ? 'bg-white text-rose-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* 우측 아이콘 / Right icons */}
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-rose-500 hover:bg-rose-50 transition-all">
                <Heart className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-rose-500 hover:bg-rose-50 transition-all">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 배너 (Airbnb 히어로 스타일) / Hero banner (Airbnb hero style) */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-white py-12 overflow-hidden">
        {/* 배경 장식 (Pinterest 핀 패턴) / Background decoration (Pinterest pin pattern) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-200/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-rose-300/40 rounded-full" />
          <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-pink-300/40 rounded-full" />
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-coral-300/30 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm mb-6 border border-rose-100">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-sm font-medium text-gray-700">
                <span className="text-rose-500 font-bold">{sampleJobsV2.length}</span>
                {' '}curated positions
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Discover & Save
              <span className="block bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text text-transparent">
                Your Dream Jobs
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Airbnb-style exploration meets Pinterest curation with Dribbble-level design.
              <br />
              Pin, like, and discover visa-compatible positions.
            </p>
          </div>
        </div>
      </section>

      {/* 카드 그리드 (Pinterest 메이슨리 + Dribbble 3열) / Card grid (Pinterest masonry + Dribbble columns) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 결과 수 + 정렬 / Results count + sort */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filteredJobs.length}</span> jobs found
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Sort by</span>
            <button className="px-3 py-1.5 bg-white rounded-full text-gray-600 font-medium shadow-sm border border-gray-100 hover:border-rose-200 transition-colors">
              Popular
            </button>
          </div>
        </div>

        {/* 메이슨리 그리드 (CSS columns, Pinterest 스타일) / Masonry grid (CSS columns, Pinterest style) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filteredJobs.map((job, index) => (
            <div key={job.id} className="break-inside-avoid">
              <JobCard job={job} index={index} />
            </div>
          ))}
        </div>

        {/* 하단 CTA (Dribbble 스타일) / Bottom CTA (Dribbble style) */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="flex -space-x-2">
              {sampleJobsV2.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-white flex items-center justify-center text-sm font-bold text-rose-600 shadow-sm"
                >
                  {job.companyInitial}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm">
                +{Math.max(0, sampleJobsV2.length - 4)}
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              Join <span className="font-semibold text-rose-500">2,400+</span> companies hiring
              globally
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 hover:-translate-y-0.5 transition-all duration-300">
              Explore All Positions
            </button>
          </div>
        </div>
      </main>

      {/* 디자인 정보 푸터 / Design info footer */}
      <footer className="py-6 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400">
            <span className="font-medium text-gray-500">{designInfo.id}</span>
            {' '}&middot;{' '}
            {designInfo.name}
            {' '}&middot;{' '}
            <span className="text-rose-400">{designInfo.category}</span>
            {' '}&middot;{' '}
            by {designInfo.author}
          </p>
        </div>
      </footer>
    </div>
  );
}
