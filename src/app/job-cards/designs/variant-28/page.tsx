'use client';

// 시안 28: 모바일 스와이프 카드 (틴더/데이팅 앱 스타일) / Variant 28: Mobile Swipeable Card (Tinder/Dating App Style)
// 한 번에 카드 한 장씩 보여주고 좌/우/상 스와이프 인터랙션
// Shows one card at a time with left/right/up swipe interactions

import { useState, useCallback, useRef } from 'react';
import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Clock,
  Crown,
  Briefcase,
  Shield,
  Users,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Bookmark,
  Building2,
  DollarSign,
  Award,
  Zap,
  Heart,
  RotateCcw,
  GraduationCap,
} from 'lucide-react';

// 스와이프 방향 타입 / Swipe direction type
type SwipeDirection = 'left' | 'right' | 'up' | null;

// 비자 매칭 점수 색상 / Visa match score color
function getScoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-500';
  if (score >= 70) return 'text-amber-500';
  return 'text-red-500';
}

// 비자 매칭 점수 배경 / Visa match score background
function getScoreBg(score: number): string {
  if (score >= 85) return 'bg-emerald-50 border-emerald-200';
  if (score >= 70) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

// 메인 잡 카드 컴포넌트 (큰 카드) / Main job card component (large card)
function SwipeCard({
  job,
  swipeDirection,
  isAnimating,
}: {
  job: MockJobPosting;
  swipeDirection: SwipeDirection;
  isAnimating: boolean;
}) {
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const isPremium = job.tierType === 'PREMIUM';

  // 스와이프 애니메이션 클래스 / Swipe animation classes
  const getAnimationStyle = (): string => {
    if (!isAnimating || !swipeDirection) return 'translate-x-0 translate-y-0 rotate-0 opacity-100';
    switch (swipeDirection) {
      case 'left':
        return '-translate-x-[120%] -rotate-12 opacity-0';
      case 'right':
        return 'translate-x-[120%] rotate-12 opacity-0';
      case 'up':
        return '-translate-y-[120%] opacity-0';
      default:
        return 'translate-x-0 translate-y-0 rotate-0 opacity-100';
    }
  };

  return (
    <div
      className={`relative w-full max-w-sm mx-auto transition-all duration-500 ease-out ${getAnimationStyle()}`}
    >
      {/* 스와이프 인디케이터 오버레이 / Swipe indicator overlays */}
      {isAnimating && swipeDirection === 'left' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-red-500/20 border-4 border-red-400 pointer-events-none">
          <div className="bg-red-500 rounded-full p-4 shadow-xl">
            <X className="h-10 w-10 text-white" />
          </div>
        </div>
      )}
      {isAnimating && swipeDirection === 'right' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-emerald-500/20 border-4 border-emerald-400 pointer-events-none">
          <div className="bg-emerald-500 rounded-full p-4 shadow-xl">
            <Check className="h-10 w-10 text-white" />
          </div>
        </div>
      )}
      {isAnimating && swipeDirection === 'up' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-blue-500/20 border-4 border-blue-400 pointer-events-none">
          <div className="bg-blue-500 rounded-full p-4 shadow-xl">
            <Bookmark className="h-10 w-10 text-white" />
          </div>
        </div>
      )}

      {/* 메인 카드 / Main card */}
      <div
        className={`relative overflow-hidden rounded-3xl shadow-xl ${
          isPremium
            ? 'ring-2 ring-yellow-400/50 shadow-yellow-200/30'
            : 'ring-1 ring-gray-200'
        } bg-white`}
      >
        {/* 상단 컬러 영역 — 회사 정보 / Top color area — company info */}
        <div
          className={`relative px-6 pt-6 pb-8 ${
            isPremium
              ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-400'
              : 'bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400'
          }`}
        >
          {/* 상단 배지 행 / Top badge row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {isPremium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/25 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white">
                  <Crown className="h-3 w-3" />
                  PREMIUM
                </span>
              )}
              {job.isUrgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/80 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white animate-pulse">
                  <Zap className="h-3 w-3" />
                  긴급
                </span>
              )}
              {job.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/25 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white">
                  <Star className="h-3 w-3" />
                  추천
                </span>
              )}
            </div>
            {dDay && (
              <span className="inline-flex items-center rounded-full bg-white/25 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white">
                {dDay}
              </span>
            )}
          </div>

          {/* 회사 로고 + 정보 / Company logo + info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white/80 text-sm font-medium truncate">{job.company}</p>
              <p className="text-white/60 text-xs mt-0.5">{job.industry}</p>
            </div>
          </div>

          {/* 물결 구분선 / Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 400 30" className="w-full" preserveAspectRatio="none">
              <path
                d="M0,30 L0,15 C100,0 300,25 400,10 L400,30 Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        {/* 중간 영역 — 공고 상세 / Middle area — job details */}
        <div className="px-6 pb-6">
          {/* 공고 제목 / Job title */}
          <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3 line-clamp-2">
            {job.title}
          </h2>

          {/* 핵심 정보 그리드 / Key info grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* 급여 / Salary */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <DollarSign className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">급여</p>
                <p className="text-xs font-bold text-gray-800 truncate">{salary}</p>
              </div>
            </div>

            {/* 근무지 / Location */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">위치</p>
                <p className="text-xs font-bold text-gray-800 truncate">{job.location}</p>
              </div>
            </div>

            {/* 고용형태 / Employment type */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <Briefcase className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">형태</p>
                <p className="text-xs font-bold text-gray-800">
                  {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
                </p>
              </div>
            </div>

            {/* 경력 / Experience */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <GraduationCap className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">경력</p>
                <p className="text-xs font-bold text-gray-800">{job.experienceRequired ?? '무관'}</p>
              </div>
            </div>
          </div>

          {/* 근무시간 / Work hours */}
          {job.workHours && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Clock className="h-3.5 w-3.5" />
              <span>{job.workHours}</span>
            </div>
          )}

          {/* 비자 + 급여 하단 영역 / Visa + salary bottom area */}
          <div className="border-t border-gray-100 pt-4">
            {/* 비자 호환 목록 / Visa compatibility list */}
            <div className="mb-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1">
                <Shield className="h-3 w-3" />
                호환 비자 / Compatible Visas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {job.allowedVisas.map((visa) => (
                  <span
                    key={visa}
                    className="inline-flex items-center rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-600"
                  >
                    {visa}
                  </span>
                ))}
              </div>
            </div>

            {/* 복리후생 / Benefits */}
            <div className="mb-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">
                복리후생 / Benefits
              </p>
              <div className="flex flex-wrap gap-1.5">
                {job.benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                  >
                    <Heart className="h-3 w-3 text-pink-400" />
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* 매칭 점수 바 / Match score bar */}
            {job.matchScore !== undefined && (
              <div className={`rounded-xl border p-3 ${getScoreBg(job.matchScore)}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    비자 매칭 점수
                  </span>
                  <span className={`text-sm font-extrabold ${getScoreColor(job.matchScore)}`}>
                    {job.matchScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      job.matchScore >= 85
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                        : job.matchScore >= 70
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${job.matchScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 통계 행 / Stats row */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                지원자 {job.applicantCount}명
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                조회 {job.viewCount.toLocaleString()}
              </span>
            </div>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function Variant28Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  // 각 카드의 스와이프 결과 기록 / Record swipe results per card
  const [decisions, setDecisions] = useState<Record<number, SwipeDirection>>({});
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const totalJobs = sampleJobs.length;
  const currentJob = sampleJobs[currentIndex];

  // 카드 넘기기 / Navigate to next card with animation
  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (isAnimating || !direction) return;
      setSwipeDirection(direction);
      setIsAnimating(true);

      // 결정 기록 / Record decision
      setDecisions((prev) => ({ ...prev, [currentIndex]: direction }));

      // 애니메이션 후 다음 카드로 / After animation, go to next card
      setTimeout(() => {
        setIsAnimating(false);
        setSwipeDirection(null);
        if (currentIndex < totalJobs - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 400);
    },
    [isAnimating, currentIndex, totalJobs],
  );

  // 이전 카드로 / Go to previous card
  const handlePrevious = useCallback(() => {
    if (isAnimating || currentIndex <= 0) return;
    setCurrentIndex((prev) => prev - 1);
  }, [isAnimating, currentIndex]);

  // 다음 카드로 (스와이프 없이) / Go to next card (without swipe)
  const handleNext = useCallback(() => {
    if (isAnimating || currentIndex >= totalJobs - 1) return;
    setCurrentIndex((prev) => prev + 1);
  }, [isAnimating, currentIndex, totalJobs]);

  // 처음으로 되돌리기 / Reset to beginning
  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setDecisions({});
    setSwipeDirection(null);
    setIsAnimating(false);
  }, []);

  // 터치 시작 핸들러 / Touch start handler
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  // 터치 종료 핸들러 / Touch end handler
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const threshold = 80;

      // 상하 스와이프가 좌우보다 큰 경우 / Vertical swipe takes priority if larger
      if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -threshold) {
        handleSwipe('up');
      } else if (deltaX < -threshold) {
        handleSwipe('left');
      } else if (deltaX > threshold) {
        handleSwipe('right');
      }

      touchStartRef.current = null;
    },
    [handleSwipe],
  );

  // 모든 카드를 다 본 경우 / All cards have been viewed
  const isComplete = currentIndex >= totalJobs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
      {/* 페이지 헤더 / Page header */}
      <div className="px-4 pt-6 pb-2 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
            <Heart className="h-4.5 w-4.5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            시안 28 — Swipe Card
          </h1>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm ml-12">
          틴더 스타일 스와이프 카드 / Tinder-style swipeable job cards
        </p>
      </div>

      {/* 스와이프 가이드 / Swipe guide */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 py-3 px-4">
        <div className="flex items-center gap-1.5 text-xs text-red-400">
          <X className="h-4 w-4" />
          <span>좌: 건너뛰기</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-500">
          <Check className="h-4 w-4" />
          <span>우: 지원하기</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blue-500">
          <Bookmark className="h-4 w-4" />
          <span>위: 북마크</span>
        </div>
      </div>

      {/* 카운터 + 프로그레스 / Counter + progress */}
      <div className="max-w-sm mx-auto w-full px-4 mb-2">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span className="font-semibold">
            {Math.min(currentIndex + 1, totalJobs)}/{totalJobs}
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            처음으로
          </button>
        </div>
        {/* 프로그레스 바 / Progress bar */}
        <div className="w-full bg-gray-300/50 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalJobs) * 100}%` }}
          />
        </div>
      </div>

      {/* 카드 영역 / Card area */}
      <div
        className="flex-1 flex items-start justify-center px-4 py-4 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {!isComplete && currentJob ? (
          <SwipeCard
            job={currentJob}
            swipeDirection={swipeDirection}
            isAnimating={isAnimating}
          />
        ) : (
          /* 완료 화면 / Completion screen */
          <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              모든 공고를 확인했습니다!
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {Object.values(decisions).filter((d) => d === 'right').length}개 지원 /
              {' '}{Object.values(decisions).filter((d) => d === 'up').length}개 북마크 /
              {' '}{Object.values(decisions).filter((d) => d === 'left').length}개 건너뜀
            </p>

            {/* 결정 요약 카드 / Decision summary cards */}
            <div className="space-y-2 mb-6">
              {sampleJobs.map((job, idx) => {
                const decision = decisions[idx];
                return (
                  <div
                    key={job.id}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm ${
                      decision === 'right'
                        ? 'bg-emerald-50 border border-emerald-100'
                        : decision === 'up'
                          ? 'bg-blue-50 border border-blue-100'
                          : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        decision === 'right'
                          ? 'bg-emerald-500'
                          : decision === 'up'
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                      }`}
                    >
                      {decision === 'right' && <Check className="h-4 w-4 text-white" />}
                      {decision === 'up' && <Bookmark className="h-4 w-4 text-white" />}
                      {decision === 'left' && <X className="h-4 w-4 text-white" />}
                      {!decision && <span className="text-white text-xs">-</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate text-xs">{job.title}</p>
                      <p className="text-gray-400 text-[10px]">{job.company}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:from-indigo-400 hover:to-purple-400 transition-all active:scale-95 shadow-lg"
            >
              다시 보기
            </button>
          </div>
        )}
      </div>

      {/* 하단 액션 버튼 (카드가 있을 때만) / Bottom action buttons (only when card is active) */}
      {!isComplete && (
        <div className="pb-8 pt-2 px-4">
          {/* 메인 스와이프 버튼 / Main swipe buttons */}
          <div className="flex items-center justify-center gap-5 mb-4">
            {/* 건너뛰기 (X) / Skip (X) */}
            <button
              onClick={() => handleSwipe('left')}
              disabled={isAnimating}
              className="w-14 h-14 rounded-full bg-white border-2 border-red-200 flex items-center justify-center shadow-lg hover:border-red-400 hover:bg-red-50 transition-all active:scale-90 disabled:opacity-50"
            >
              <X className="h-7 w-7 text-red-500" />
            </button>

            {/* 북마크 (위) / Bookmark (up) */}
            <button
              onClick={() => handleSwipe('up')}
              disabled={isAnimating}
              className="w-11 h-11 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center shadow-md hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-90 disabled:opacity-50"
            >
              <Star className="h-5 w-5 text-blue-500" />
            </button>

            {/* 지원하기 (체크) / Apply (check) */}
            <button
              onClick={() => handleSwipe('right')}
              disabled={isAnimating}
              className="w-14 h-14 rounded-full bg-white border-2 border-emerald-200 flex items-center justify-center shadow-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all active:scale-90 disabled:opacity-50"
            >
              <Check className="h-7 w-7 text-emerald-500" />
            </button>
          </div>

          {/* 이전/다음 네비게이션 (데스크톱용) / Previous/Next navigation (desktop) */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentIndex <= 0 || isAnimating}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
              이전
            </button>

            {/* 네비게이션 도트 / Navigation dots */}
            <div className="flex items-center gap-1.5">
              {sampleJobs.map((_, idx) => {
                const decision = decisions[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isAnimating) setCurrentIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      idx === currentIndex
                        ? 'w-6 bg-indigo-500'
                        : decision === 'right'
                          ? 'bg-emerald-400'
                          : decision === 'up'
                            ? 'bg-blue-400'
                            : decision === 'left'
                              ? 'bg-red-300'
                              : 'bg-gray-300'
                    }`}
                  />
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex >= totalJobs - 1 || isAnimating}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              다음
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
