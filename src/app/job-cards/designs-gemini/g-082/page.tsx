'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Timer,
  Star,
  Heart,
  Share2,
  Briefcase,
  Zap,
  Crown,
  TrendingUp,
  Shield,
  ArrowRight,
  Route,
  CircleDot,
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
  id: 'g-082',
  name: '당근×Uber×Airbnb',
  category: 'interactive',
  author: 'Gemini',
};

// 카운트다운 타이머 훅 / Countdown timer hook
function useCountdown(closingDate: string | null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!closingDate) return;

    const calculate = () => {
      const diff = new Date(closingDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(interval);
  }, [closingDate]);

  return timeLeft;
}

// 거리 생성기 (실제로는 위치 기반이겠지만 mock) / Distance generator (mock for demo)
function getDistance(location: string): string {
  const distances: Record<string, string> = {
    '경기 평택시': '38.2km',
    '서울 중구': '2.1km',
    '서울 송파구': '5.7km',
    '서울 강남구': '4.3km',
    '인천 남동구': '22.8km',
    '경기 화성시': '42.5km',
  };
  return distances[location] || '10.0km';
}

// 예상 소요 시간 / Estimated travel time
function getETA(location: string): string {
  const etas: Record<string, string> = {
    '경기 평택시': '52분',
    '서울 중구': '8분',
    '서울 송파구': '18분',
    '서울 강남구': '15분',
    '인천 남동구': '35분',
    '경기 화성시': '58분',
  };
  return etas[location] || '20분';
}

// 캐러셀 이미지 생성 / Carousel image generation
function getCarouselImages(job: MockJobPostingV2): string[] {
  return [
    job.industryImage,
    job.industryImage.replace('w=800', 'w=801'),
    job.industryImage.replace('w=800', 'w=802'),
  ];
}

// 카운트다운 표시 컴포넌트 / Countdown display component
function CountdownDisplay({ closingDate }: { closingDate: string | null }) {
  const { days, hours, minutes, seconds } = useCountdown(closingDate);

  if (!closingDate) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-500">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold tracking-wide">상시모집</span>
      </div>
    );
  }

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    return (
      <span className="text-xs font-bold text-gray-400 tracking-wide">마감</span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[
        { value: days, label: '일' },
        { value: hours, label: '시' },
        { value: minutes, label: '분' },
        { value: seconds, label: '초' },
      ].map((unit, i) => (
        <div key={i} className="flex items-center">
          <div className="bg-gray-900 rounded px-1.5 py-0.5 min-w-[28px] text-center">
            <span className="text-xs font-mono font-bold text-orange-400">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 ml-0.5">{unit.label}</span>
          {i < 3 && <span className="text-gray-600 mx-0.5 text-[10px]">:</span>}
        </div>
      ))}
    </div>
  );
}

// 이미지 캐러셀 컴포넌트 / Image carousel component
function ImageCarousel({ images, isHovered }: { images: string[]; isHovered: boolean }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  // 호버 시 자동 슬라이드 / Auto-slide on hover
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(next, 3000);
    return () => clearInterval(interval);
  }, [isHovered, next]);

  return (
    <div className="relative w-full h-full overflow-hidden group/carousel">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* 캐러셀 네비게이션 / Carousel navigation */}
      {isHovered && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>
        </>
      )}

      {/* 인디케이터 닷 / Indicator dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// 루트 시각화 라인 / Route visualization line
function RouteVisualization({ distance, eta }: { distance: string; eta: string }) {
  return (
    <div className="flex items-center gap-2 py-2">
      {/* 출발 / Start */}
      <div className="flex flex-col items-center">
        <CircleDot className="w-3.5 h-3.5 text-orange-500" />
        <span className="text-[9px] text-gray-400 mt-0.5">현위치</span>
      </div>

      {/* 루트 라인 / Route line */}
      <div className="flex-1 relative h-5">
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-orange-400 via-orange-300 to-coral-400" />
        {/* 이동 중 점 / Moving dot */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-2 h-2 rounded-full bg-orange-500 shadow-md shadow-orange-500/50 animate-pulse" />
        {/* 거리 라벨 / Distance label */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-gray-900 rounded px-1.5 py-0.5">
          <span className="text-[9px] font-mono text-orange-300">{distance}</span>
        </div>
      </div>

      {/* 도착 / Destination */}
      <div className="flex flex-col items-center">
        <MapPin className="w-3.5 h-3.5 text-red-500" />
        <span className="text-[9px] text-gray-400 mt-0.5">{eta}</span>
      </div>
    </div>
  );
}

// 개별 잡 카드 / Individual job card
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const carouselImages = getCarouselImages(job);
  const distance = getDistance(job.location);
  const eta = getETA(job.location);
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/10"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 상단 이미지 캐러셀 영역 (Airbnb 스타일) / Top image carousel area (Airbnb style) */}
      <div className="relative h-44 overflow-hidden">
        <ImageCarousel images={carouselImages} isHovered={isHovered} />

        {/* 이미지 오버레이 그라디언트 / Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* 상단 좌측 배지 / Top left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {job.tierType === 'PREMIUM' && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-1 rounded-full shadow-lg">
              <Crown className="w-3 h-3" />
              <span className="text-[10px] font-bold tracking-wide">PREMIUM</span>
            </div>
          )}
          {job.isUrgent && (
            <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full shadow-lg animate-pulse">
              <Zap className="w-3 h-3" />
              <span className="text-[10px] font-bold">긴급</span>
            </div>
          )}
          {job.isFeatured && (
            <div className="flex items-center gap-1 bg-gray-900/80 backdrop-blur-sm text-orange-400 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-orange-400" />
              <span className="text-[10px] font-bold">추천</span>
            </div>
          )}
        </div>

        {/* 상단 우측 액션 / Top right actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
              liked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* 하단 거리 표시 (당근 스타일) / Bottom distance display (Karrot style) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur-sm rounded-full px-2.5 py-1">
          <Navigation className="w-3 h-3 text-orange-400" />
          <span className="text-[11px] font-semibold text-white">{distance}</span>
          <span className="text-[10px] text-gray-400">|</span>
          <Timer className="w-3 h-3 text-orange-300" />
          <span className="text-[11px] text-gray-300">{eta}</span>
        </div>

        {/* 매치 스코어 (우하단) / Match score (bottom right) */}
        {job.matchScore && (
          <div className="absolute bottom-3 right-3 bg-orange-500 text-white rounded-full w-10 h-10 flex flex-col items-center justify-center shadow-lg">
            <span className="text-[10px] font-bold leading-none">{job.matchScore}%</span>
            <span className="text-[7px] leading-none opacity-80">매칭</span>
          </div>
        )}
      </div>

      {/* 카드 본문 / Card body */}
      <div className="p-4">
        {/* 회사 정보 + 업종 / Company info + industry */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-100 flex-shrink-0">
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-contain bg-white p-0.5"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">${job.companyInitial}</div>`;
                  }
                }}
              />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 leading-tight">{job.company}</p>
              <p className="text-[10px] text-gray-400">{job.industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Eye className="w-3 h-3" />
            <span className="text-[10px]">{job.viewCount.toLocaleString()}</span>
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
          {job.title}
        </h3>

        {/* 루트 시각화 (Uber 스타일, 호버 시) / Route visualization (Uber style, on hover) */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isHovered ? 'max-h-16 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <RouteVisualization distance={distance} eta={eta} />
        </div>

        {/* 위치 + 근무형태 / Location + work type */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs">{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-gray-400" />
            <span className={`text-[11px] font-medium ${
              job.boardType === 'FULL_TIME' ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'}
            </span>
          </div>
        </div>

        {/* 급여 / Salary */}
        <div className="flex items-center gap-1.5 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-sm font-bold text-gray-900">{salary}</span>
        </div>

        {/* 비자 배지 / Visa badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {job.allowedVisas.slice(0, 4).map((visa) => {
            const colors = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors.bg} ${colors.text}`}
              >
                <Shield className="w-2.5 h-2.5" />
                {visa}
              </span>
            );
          })}
          {job.allowedVisas.length > 4 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
              +{job.allowedVisas.length - 4}
            </span>
          )}
        </div>

        {/* 복리후생 칩 (호버 시 확장) / Benefits chips (expand on hover) */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isHovered ? 'max-h-20 opacity-100 mb-3' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
          <div className="flex flex-wrap gap-1">
            {job.benefits.map((benefit) => (
              <span
                key={benefit}
                className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* 하단: 카운트다운 + 지원자수 + 지원하기 / Bottom: countdown + applicants + apply */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <CountdownDisplay closingDate={job.closingDate} />
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-3 h-3" />
              <span className="text-[10px]">{job.applicantCount}명</span>
            </div>
          </div>

          {/* 지원하기 버튼 (호버 시 나타남) / Apply button (appears on hover) */}
          <div
            className={`transition-all duration-300 ${
              isHovered
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4'
            }`}
          >
            <button className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-md shadow-orange-500/25">
              지원하기
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 호버 시 좌측 오렌지 액센트 / Orange accent on hover */}
      <div
        className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-orange-400 to-coral-500 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G082Page() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'nearby' | 'urgent' | 'premium'>('all');

  const filteredJobs = sampleJobsV2.filter((job) => {
    if (activeFilter === 'nearby') {
      const dist = parseFloat(getDistance(job.location));
      return dist <= 10;
    }
    if (activeFilter === 'urgent') return job.isUrgent;
    if (activeFilter === 'premium') return job.tierType === 'PREMIUM';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 / Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* 디자인 정보 / Design info */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-mono">
              {designInfo.id}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 font-mono">
              {designInfo.category}
            </span>
            <span className="text-[10px] text-gray-500">by {designInfo.author}</span>
          </div>

          {/* 타이틀 + 설명 / Title + description */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <span className="text-orange-400">{designInfo.name}</span>
              </h1>
              <p className="text-sm text-gray-400">
                로컬+이동+숙박 통합 | 맵 기반 거리 표시 | 카운트다운 | 이미지 캐러셀
              </p>
            </div>

            {/* 현재 위치 / Current location */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-sm">서울 중구</span>
              <Route className="w-3.5 h-3.5 text-gray-500 ml-1" />
            </div>
          </div>

          {/* 필터 탭 / Filter tabs */}
          <div className="flex gap-2 mt-5">
            {[
              { key: 'all' as const, label: '전체', icon: Briefcase },
              { key: 'nearby' as const, label: '근처 10km', icon: MapPin },
              { key: 'urgent' as const, label: '긴급', icon: Zap },
              { key: 'premium' as const, label: '프리미엄', icon: Crown },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.key
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                <filter.icon className="w-3.5 h-3.5" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 통계 바 / Stats bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <strong className="text-orange-600">{filteredJobs.length}개</strong> 공고
            </span>
            <span className="text-xs text-gray-400">|</span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>실시간 업데이트</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Navigation className="w-3 h-3" />
            <span>거리순 정렬</span>
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MapPin className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-lg font-medium text-gray-500 mb-1">조건에 맞는 공고가 없습니다</p>
            <p className="text-sm">필터를 변경하거나 검색 범위를 넓혀보세요</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              전체 공고 보기
            </button>
          </div>
        )}
      </div>

      {/* 푸터 / Footer */}
      <div className="bg-gray-900 text-gray-500 text-center py-4 mt-8">
        <p className="text-xs">
          {designInfo.id} | {designInfo.name} | {designInfo.category} | {designInfo.author}
        </p>
      </div>
    </div>
  );
}
