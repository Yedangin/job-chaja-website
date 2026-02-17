'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Heart,
  MessageCircle,
  Bell,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Eye,
  Briefcase,
  Star,
  Zap,
  ArrowLeft,
  Home,
  Send,
  DollarSign,
  TrendingUp,
  Shield,
  Gift,
  Check,
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';

// 디자인 정보 / Design metadata
const designInfo = {
  id: 'g-085',
  name: '네이버\u00D7카카오톡\u00D7토스',
  category: 'creative' as const,
  author: 'Gemini',
};

// 카운트업 애니메이션 훅 / Count-up animation hook
function useCountUp(target: number, duration: number = 1200, trigger: boolean = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo 커브 / easeOutExpo curve
      const eased = 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, trigger]);

  return count;
}

// 네이버 스타일 카테고리 탭 / Naver-style category tabs
const categoryTabs = ['전체', '제조', '건설', 'IT', '음식', '물류'];

// 카카오톡 말풍선 메시지 생성 / KakaoTalk chat bubble message generator
function getChatMessage(job: MockJobPostingV2): string {
  if (job.isUrgent) return `긴급! ${job.company}에서 인재를 급구합니다!`;
  if (job.isFeatured) return `${job.company} 추천 공고가 도착했어요!`;
  if (job.matchScore && job.matchScore >= 90) return `나와 ${job.matchScore}% 매칭! 확인해보세요`;
  return `${job.company}에서 ${job.title.slice(0, 12)}... 모집 중`;
}

// 토스 스타일 급여 숫자 파싱 / Toss-style salary number parsing
function getSalaryNumber(job: MockJobPostingV2): number {
  if (job.hourlyWage) return job.hourlyWage;
  if (job.salaryMin) return Math.round(job.salaryMin / 10000);
  return 0;
}

function getSalaryUnit(job: MockJobPostingV2): string {
  if (job.hourlyWage) return '원/시간';
  if (job.salaryMin) return '만원/연';
  return '';
}

// 슈퍼앱 카드 컴포넌트 / Super-app card component
function SuperAppCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWished, setIsWished] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleAnimating, setBubbleAnimating] = useState(false);

  const salaryTarget = getSalaryNumber(job);
  const salaryCount = useCountUp(salaryTarget, 1400, isHovered);
  const applicantCount = useCountUp(job.applicantCount, 1000, isHovered);
  const viewCountAnimated = useCountUp(job.viewCount, 1200, isHovered);

  const dDay = getDDay(job.closingDate);
  const isPremium = job.tierType === 'PREMIUM';

  // 말풍선 등장 애니메이션 / Chat bubble entrance animation
  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        setShowBubble(true);
        setBubbleAnimating(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowBubble(false);
      setBubbleAnimating(false);
    }
  }, [isHovered]);

  const handleWish = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWished((prev) => !prev);
  }, []);

  return (
    <div
      className="group relative w-full rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
      style={{
        boxShadow: isHovered
          ? '0 20px 60px rgba(0,0,0,0.18), 0 0 0 2px rgba(30,200,100,0.3)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ===== 네이버 영역: 그린 헤더 바 / Naver zone: Green header bar ===== */}
      <div className="relative bg-[#03C75A] px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 네이버 로고 + 검색 / Naver logo + search */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-white font-extrabold text-sm tracking-tight">N</span>
              <span className="text-white/80 text-[10px] font-medium">JobChaJa</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-full px-2.5 py-1 gap-1">
              <Search size={12} className="text-white/80" />
              <span className="text-white/70 text-[10px]">{job.industry}</span>
            </div>
          </div>

          {/* 프리미엄 AD 라벨 + 찜 / Premium AD label + wishlist */}
          <div className="flex items-center gap-2">
            {isPremium && (
              <span className="bg-white/25 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-wider">
                AD
              </span>
            )}
            {/* 찜 버튼 / Wishlist button */}
            <button
              onClick={handleWish}
              className="relative transition-all duration-300"
              style={{
                transform: isWished ? 'scale(1.3)' : isHovered ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Heart
                size={18}
                className={`transition-all duration-300 ${
                  isWished ? 'text-red-400 fill-red-400' : 'text-white/70'
                }`}
              />
              {isWished && (
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"
                />
              )}
            </button>
          </div>
        </div>

        {/* 네이버 스타일 카테고리 탭 라인 / Naver-style category tab line */}
        <div className="flex items-center gap-3 mt-2 overflow-x-auto scrollbar-hide">
          {categoryTabs.map((tab, i) => {
            const isActive = i === 0;
            return (
              <span
                key={tab}
                className={`text-[10px] whitespace-nowrap pb-1 border-b-2 transition-all ${
                  isActive
                    ? 'text-white font-bold border-white'
                    : 'text-white/60 font-normal border-transparent'
                }`}
              >
                {tab}
              </span>
            );
          })}
        </div>
      </div>

      {/* ===== 산업 이미지 배너 + 오버레이 / Industry image banner + overlay ===== */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={job.industryImage}
          alt={job.industry}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

        {/* D-Day + 긴급 배지 / D-Day + urgent badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {dDay && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                dDay === '마감'
                  ? 'bg-gray-800/80 text-gray-300'
                  : dDay === 'D-Day'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-white/90 text-gray-800'
              }`}
            >
              {dDay}
            </span>
          )}
          {job.isUrgent && (
            <span className="flex items-center gap-0.5 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Zap size={10} className="fill-white" /> 급구
            </span>
          )}
        </div>

        {/* 회사 로고 (네이버 검색결과 스타일) / Company logo (Naver search result style) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-white shadow-lg flex items-center justify-center overflow-hidden border-2 border-white">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-sm font-bold text-gray-600">${job.companyInitial}</span>`;
              }}
            />
          </div>
          <div>
            <p className="text-white text-xs font-bold drop-shadow-lg">{job.company}</p>
            <p className="text-white/80 text-[10px] flex items-center gap-1">
              <MapPin size={9} /> {job.location}
            </p>
          </div>
        </div>

        {/* 조회수 배지 / View count badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
          <Eye size={10} />
          <span>{isHovered ? viewCountAnimated.toLocaleString() : job.viewCount.toLocaleString()}</span>
        </div>
      </div>

      {/* ===== 메인 콘텐츠 영역 / Main content area ===== */}
      <div className="relative bg-white px-4 pt-3 pb-2">
        {/* 공고 제목 / Job title */}
        <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 mb-2">
          {job.title}
        </h3>

        {/* 비자 칩 / Visa chips */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          {job.allowedVisas.map((visa) => {
            const vc = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`${vc.bg} ${vc.text} text-[9px] font-semibold px-1.5 py-0.5 rounded-md`}
              >
                {visa}
              </span>
            );
          })}
        </div>

        {/* 메타 정보 행 / Meta info row */}
        <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
          {job.workHours && (
            <span className="flex items-center gap-0.5">
              <Clock size={10} /> {job.workHours}
            </span>
          )}
          {job.experienceRequired && (
            <span className="flex items-center gap-0.5">
              <Briefcase size={10} /> {job.experienceRequired}
            </span>
          )}
        </div>

        {/* 복리후생 / Benefits */}
        <div className="flex flex-wrap gap-1 mb-3">
          {job.benefits.slice(0, 3).map((b) => (
            <span
              key={b}
              className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded"
            >
              {b}
            </span>
          ))}
          {job.benefits.length > 3 && (
            <span className="text-gray-400 text-[9px]">+{job.benefits.length - 3}</span>
          )}
        </div>
      </div>

      {/* ===== 토스 영역: 블루 급여 디스플레이 / Toss zone: Blue salary display ===== */}
      <div
        className="relative px-4 py-3 transition-all duration-500"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, #1B64DA 0%, #3182F6 50%, #4B9CF7 100%)'
            : 'linear-gradient(135deg, #3182F6 0%, #4B9CF7 100%)',
        }}
      >
        <div className="flex items-end justify-between">
          {/* 토스 스타일 대형 숫자 / Toss-style large bold numbers */}
          <div>
            <p className="text-white/60 text-[10px] font-medium mb-0.5 flex items-center gap-1">
              <DollarSign size={10} />
              {job.hourlyWage ? '시급' : '연봉'}
            </p>
            <div className="flex items-baseline gap-1">
              <span
                className="text-white font-extrabold transition-all duration-300"
                style={{
                  fontSize: isHovered ? '28px' : '24px',
                  letterSpacing: '-0.5px',
                  textShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                {isHovered
                  ? salaryCount.toLocaleString()
                  : getSalaryNumber(job).toLocaleString()}
              </span>
              <span className="text-white/80 text-[11px] font-medium">
                {getSalaryUnit(job)}
              </span>
            </div>
          </div>

          {/* 토스 스타일 지원자/매칭 스탯 / Toss-style applicant/match stats */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white/50 text-[9px]">지원자</p>
              <p className="text-white font-bold text-sm">
                {isHovered ? applicantCount : job.applicantCount}
                <span className="text-white/60 text-[10px] font-normal">명</span>
              </p>
            </div>
            {job.matchScore && (
              <div className="text-right">
                <p className="text-white/50 text-[9px]">매칭</p>
                <div className="flex items-center gap-0.5">
                  <TrendingUp size={12} className="text-green-300" />
                  <p className="text-green-300 font-bold text-sm">{job.matchScore}%</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 토스 스타일 진행 바 / Toss-style progress bar */}
        {job.matchScore && (
          <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: isHovered ? `${job.matchScore}%` : '0%',
                background: 'linear-gradient(90deg, #34D399, #10B981)',
              }}
            />
          </div>
        )}
      </div>

      {/* ===== 카카오톡 영역: 노란 채팅 말풍선 / KakaoTalk zone: Yellow chat bubble ===== */}
      <div
        className="relative overflow-hidden transition-all duration-500 ease-out"
        style={{
          maxHeight: showBubble ? '80px' : '0px',
          opacity: showBubble ? 1 : 0,
          background: '#B2C7D9',
        }}
      >
        <div className="px-4 py-2.5 flex items-start gap-2">
          {/* 카카오 프로필 아이콘 / Kakao profile icon */}
          <div className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center flex-shrink-0 shadow-sm">
            <MessageCircle size={14} className="text-[#3C1E1E]" />
          </div>
          {/* 말풍선 / Chat bubble */}
          <div
            className="relative transition-all duration-500"
            style={{
              transform: bubbleAnimating ? 'translateX(0) scale(1)' : 'translateX(-20px) scale(0.8)',
              opacity: bubbleAnimating ? 1 : 0,
            }}
          >
            <div className="bg-[#FEE500] rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm max-w-[240px]">
              <p className="text-[11px] text-[#3C1E1E] font-medium leading-relaxed">
                {getChatMessage(job)}
              </p>
            </div>
            {/* 읽음 표시 / Read receipt */}
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <span className="text-[9px] text-gray-500">1</span>
              <span className="text-[9px] text-gray-400">
                {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 하단 액션 바 / Bottom action bar ===== */}
      <div className="bg-white border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 카카오톡 알림 카운트 / KakaoTalk notification count */}
          <div className="relative">
            <Bell size={16} className="text-gray-400" />
            {job.applicantCount > 50 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
                {job.applicantCount > 99 ? '99+' : job.applicantCount}
              </span>
            )}
          </div>
          {/* 채팅 카운트 / Chat count */}
          <div className="relative">
            <MessageCircle size={16} className="text-gray-400" />
            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-[#FEE500] text-[#3C1E1E] text-[8px] font-bold rounded-full flex items-center justify-center px-0.5">
              N
            </span>
          </div>
        </div>

        {/* 지원하기 버튼 / Apply button */}
        <button className="flex items-center gap-1.5 bg-[#03C75A] hover:bg-[#02B350] text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-200">
          <Send size={11} />
          지원하기
        </button>
      </div>

      {/* ===== 프리미엄 추천 배지 / Premium featured badge ===== */}
      {job.isFeatured && (
        <div className="absolute top-[52px] right-0">
          <div
            className="flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 text-white"
            style={{
              background: 'linear-gradient(90deg, #03C75A, #FEE500, #3182F6)',
              borderRadius: '0 0 0 8px',
            }}
          >
            <Star size={9} className="fill-white" /> 추천
          </div>
        </div>
      )}
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G085Page() {
  const [activeTab, setActiveTab] = useState<'naver' | 'kakao' | 'toss'>('naver');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* ===== 슈퍼앱 헤더 / Super-app header ===== */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        {/* 트리컬러 바 / Tricolor bar */}
        <div className="h-1 flex">
          <div className="flex-1 bg-[#03C75A]" />
          <div className="flex-1 bg-[#FEE500]" />
          <div className="flex-1 bg-[#3182F6]" />
        </div>

        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ArrowLeft size={20} className="text-gray-600" />
              <div className="flex items-center gap-1.5">
                {/* 삼색 로고 / Tricolor logo */}
                <div className="flex items-center">
                  <span className="text-[#03C75A] font-black text-lg">N</span>
                  <span className="text-[#3C1E1E] font-black text-lg" style={{ color: '#FEE500', WebkitTextStroke: '0.5px #3C1E1E' }}>K</span>
                  <span className="text-[#3182F6] font-black text-lg">T</span>
                </div>
                <span className="text-gray-800 font-bold text-sm">잡차자</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell size={20} className="text-gray-500" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#03C75A] via-[#FEE500] to-[#3182F6] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">MY</span>
              </div>
            </div>
          </div>

          {/* 네이버 스타일 검색바 / Naver-style search bar */}
          <div className="relative">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
              <Search size={16} className="text-[#03C75A]" />
              <span className="text-gray-400 text-sm">채용공고 검색...</span>
            </div>
          </div>

          {/* 앱 탭 전환 / App tab switch */}
          <div className="flex items-center gap-1 mt-3 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('naver')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === 'naver'
                  ? 'bg-[#03C75A] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Search size={11} /> 검색
            </button>
            <button
              onClick={() => setActiveTab('kakao')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === 'kakao'
                  ? 'bg-[#FEE500] text-[#3C1E1E] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageCircle size={11} /> 채팅
            </button>
            <button
              onClick={() => setActiveTab('toss')}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === 'toss'
                  ? 'bg-[#3182F6] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign size={11} /> 급여
            </button>
          </div>
        </div>
      </div>

      {/* ===== 디자인 정보 배너 / Design info banner ===== */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <div
          className="rounded-xl p-3 mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(3,199,90,0.1) 0%, rgba(254,229,0,0.1) 50%, rgba(49,130,246,0.1) 100%)',
            border: '1px solid rgba(3,199,90,0.15)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-[#03C75A] bg-[#03C75A]/10 px-1.5 py-0.5 rounded">
                  {designInfo.id}
                </span>
                <span className="text-[10px] font-bold text-[#3182F6] bg-[#3182F6]/10 px-1.5 py-0.5 rounded">
                  {designInfo.category}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-800">{designInfo.name}</p>
              <p className="text-[10px] text-gray-500">by {designInfo.author}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#03C75A] flex items-center justify-center -mr-1 z-[3]">
                  <span className="text-white text-[8px] font-bold">N</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#FEE500] flex items-center justify-center -mr-1 z-[2]">
                  <span className="text-[#3C1E1E] text-[8px] font-bold">K</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#3182F6] flex items-center justify-center z-[1]">
                  <span className="text-white text-[8px] font-bold">T</span>
                </div>
              </div>
              <span className="text-[8px] text-gray-400">3-App Fusion</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 퀵 스탯 (토스 스타일) / Quick stats (Toss-style) ===== */}
      <div className="max-w-md mx-auto px-4 mb-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Shield size={16} className="text-[#03C75A] mx-auto mb-1" />
            <p className="text-lg font-extrabold text-gray-900">{sampleJobsV2.length}</p>
            <p className="text-[9px] text-gray-500">전체 공고</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Gift size={16} className="text-[#FEE500] mx-auto mb-1" />
            <p className="text-lg font-extrabold text-gray-900">
              {sampleJobsV2.filter((j) => j.tierType === 'PREMIUM').length}
            </p>
            <p className="text-[9px] text-gray-500">프리미엄</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Check size={16} className="text-[#3182F6] mx-auto mb-1" />
            <p className="text-lg font-extrabold text-gray-900">
              {sampleJobsV2.filter((j) => j.isUrgent).length}
            </p>
            <p className="text-[9px] text-gray-500">긴급 채용</p>
          </div>
        </div>
      </div>

      {/* ===== 카드 그리드 / Card grid ===== */}
      <div className="max-w-md mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Briefcase size={14} className="text-[#03C75A]" />
            채용공고
            <span className="text-[#3182F6] text-xs font-normal ml-1">
              {sampleJobsV2.length}건
            </span>
          </h2>
          <span className="text-[10px] text-gray-400">호버하여 상세정보 확인</span>
        </div>

        <div className="flex flex-col gap-5">
          {sampleJobsV2.map((job, index) => (
            <SuperAppCard key={job.id} job={job} index={index} />
          ))}
        </div>
      </div>

      {/* ===== 하단 네비게이션 (슈퍼앱 스타일) / Bottom navigation (super-app style) ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          <div className="flex flex-col items-center gap-0.5">
            <Home size={18} className="text-[#03C75A]" />
            <span className="text-[9px] font-bold text-[#03C75A]">홈</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 relative">
            <MessageCircle size={18} className="text-gray-400" />
            <span className="text-[9px] text-gray-400">채팅</span>
            <span className="absolute -top-1 right-0 w-3.5 h-3.5 bg-[#FEE500] text-[#3C1E1E] text-[7px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-10 h-10 -mt-5 rounded-2xl bg-gradient-to-br from-[#03C75A] via-[#FEE500] to-[#3182F6] flex items-center justify-center shadow-lg">
              <Search size={18} className="text-white" />
            </div>
            <span className="text-[9px] font-bold text-gray-600">검색</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 relative">
            <Bell size={18} className="text-gray-400" />
            <span className="text-[9px] text-gray-400">알림</span>
            <span className="absolute -top-1 right-0 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
              5
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Users size={18} className="text-gray-400" />
            <span className="text-[9px] text-gray-400">MY</span>
          </div>
        </div>
        {/* 홈 인디케이터 / Home indicator */}
        <div className="flex justify-center pb-1">
          <div className="w-32 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
