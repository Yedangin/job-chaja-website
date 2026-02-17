'use client';

/**
 * designInfo
 * id: g-076
 * name: iOS×MD3×토스 (iOS×MD3×Toss)
 * category: platform
 * references: ['Apple iOS', 'Google MD3', '토스']
 * author: Gemini
 *
 * iOS 세그먼트 컨트롤 + Material Design 3 토널 서피스 + 토스 스타일 숫자 애니메이션을 결합한 카드 디자인
 * Card design combining iOS segmented controls + MD3 tonal surfaces + Toss-style number animations
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Briefcase,
  Star,
  Zap,
  ChevronRight,
  Plus,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
  Building2,
  CalendarDays,
} from 'lucide-react';

// 세그먼트 유형 / Segment types
type SegmentTab = 'all' | 'fulltime' | 'parttime';

// 토스 스타일 숫자 카운트업 애니메이션 훅 / Toss-style counting animation hook
function useCountUp(target: number, duration: number = 1200, shouldStart: boolean = false) {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) {
      setCurrent(0);
      return;
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // 토스 스타일 이징: easeOutExpo / Toss-style easing
      const eased = 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.floor(target * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, shouldStart]);

  return current;
}

// 급여 숫자 추출 헬퍼 / Salary number extraction helper
function getSalaryNumber(job: MockJobPostingV2): number {
  if (job.hourlyWage) return job.hourlyWage;
  if (job.salaryMax) return Math.round(job.salaryMax / 10000);
  if (job.salaryMin) return Math.round(job.salaryMin / 10000);
  return 0;
}

function getSalaryUnit(job: MockJobPostingV2): string {
  if (job.hourlyWage) return '원/시';
  if (job.salaryMin || job.salaryMax) return '만원/연';
  return '';
}

// iOS 스타일 세그먼트 컨트롤 / iOS-style segmented control
function SegmentedControl({
  activeTab,
  onChange,
  counts,
}: {
  activeTab: SegmentTab;
  onChange: (tab: SegmentTab) => void;
  counts: { all: number; fulltime: number; parttime: number };
}) {
  const tabs: { key: SegmentTab; label: string; count: number }[] = [
    { key: 'all', label: '전체', count: counts.all },
    { key: 'fulltime', label: '정규직', count: counts.fulltime },
    { key: 'parttime', label: '아르바이트', count: counts.parttime },
  ];

  return (
    <div className="relative flex rounded-[10px] bg-gray-100/80 p-[2px] backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`
            relative z-10 flex-1 rounded-[8px] px-4 py-[7px] text-[13px] font-semibold
            transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]'
                : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          {tab.label}
          <span
            className={`ml-1 text-[11px] ${
              activeTab === tab.key ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}

// 토스 스타일 급여 카운트업 디스플레이 / Toss-style salary count-up display
function TossSalaryDisplay({
  job,
  isVisible,
}: {
  job: MockJobPostingV2;
  isVisible: boolean;
}) {
  const salaryNum = getSalaryNumber(job);
  const unit = getSalaryUnit(job);
  const countedValue = useCountUp(salaryNum, 1400, isVisible);

  if (!salaryNum) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-[15px] font-medium text-gray-500">면접 후 결정</span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-[3px]">
      {job.hourlyWage ? (
        <>
          <span className="text-[11px] font-medium text-gray-400 tracking-tight">시급</span>
          <span className="text-[22px] font-extrabold tracking-tight text-gray-900 tabular-nums leading-none">
            {countedValue.toLocaleString()}
          </span>
          <span className="text-[12px] font-semibold text-gray-400">원</span>
        </>
      ) : (
        <>
          <span className="text-[11px] font-medium text-gray-400 tracking-tight">연봉</span>
          <span className="text-[22px] font-extrabold tracking-tight text-gray-900 tabular-nums leading-none">
            {countedValue.toLocaleString()}
          </span>
          <span className="text-[12px] font-semibold text-gray-400">만원</span>
        </>
      )}
    </div>
  );
}

// MD3 토널 서피스 잡 카드 / MD3 tonal surface job card
function JobCard({
  job,
  index,
}: {
  job: MockJobPostingV2;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 인터섹션 옵저버로 뷰포트 진입 감지 / Detect viewport entry with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const dDay = getDDay(job.closingDate);
  const salaryText = formatSalary(job);
  const isPremium = job.tierType === 'PREMIUM';

  // MD3 토널 서피스 색상 결정 / MD3 tonal surface color determination
  const getTonalSurface = () => {
    if (isPremium) return 'bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/60';
    return 'bg-gradient-to-br from-gray-50/60 via-white to-slate-50/40';
  };

  // MD3 엘리베이션 / MD3 elevation
  const getElevation = () => {
    if (isHovered) {
      return isPremium
        ? 'shadow-[0_6px_30px_-4px_rgba(99,102,241,0.2),0_2px_10px_-2px_rgba(99,102,241,0.1)]'
        : 'shadow-[0_6px_24px_-4px_rgba(0,0,0,0.1),0_2px_8px_-2px_rgba(0,0,0,0.06)]';
    }
    return isPremium
      ? 'shadow-[0_2px_12px_-2px_rgba(99,102,241,0.12),0_1px_4px_-1px_rgba(99,102,241,0.08)]'
      : 'shadow-[0_1px_6px_-1px_rgba(0,0,0,0.06),0_1px_3px_-1px_rgba(0,0,0,0.04)]';
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative rounded-[20px] border border-gray-200/60 overflow-hidden
        transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] cursor-pointer
        ${getTonalSurface()} ${getElevation()}
        ${isHovered ? 'scale-[1.015] -translate-y-1' : ''}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{
        transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
      }}
    >
      {/* 프리미엄 MD3 상단 토널 바 / Premium MD3 top tonal bar */}
      {isPremium && (
        <div className="h-[3px] bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400" />
      )}

      <div className="p-5">
        {/* 상단: 배지 행 / Top: badge row */}
        <div className="flex items-center gap-[6px] mb-3">
          {isPremium && (
            <span className="inline-flex items-center gap-[3px] rounded-full bg-violet-100/80 px-[8px] py-[2px] text-[10px] font-bold text-violet-600 ring-1 ring-violet-200/50">
              <Sparkles className="w-[10px] h-[10px]" />
              PREMIUM
            </span>
          )}
          {job.isUrgent && (
            <span className="inline-flex items-center gap-[3px] rounded-full bg-red-50 px-[8px] py-[2px] text-[10px] font-bold text-red-500 ring-1 ring-red-100">
              <Zap className="w-[10px] h-[10px]" />
              긴급
            </span>
          )}
          {job.isFeatured && (
            <span className="inline-flex items-center gap-[3px] rounded-full bg-amber-50 px-[8px] py-[2px] text-[10px] font-bold text-amber-600 ring-1 ring-amber-100">
              <Star className="w-[10px] h-[10px]" />
              추천
            </span>
          )}
          {dDay && (
            <span
              className={`ml-auto rounded-full px-[8px] py-[2px] text-[10px] font-bold ${
                dDay === '마감'
                  ? 'bg-gray-100 text-gray-400'
                  : dDay === 'D-Day'
                  ? 'bg-red-500 text-white'
                  : dDay === '상시모집'
                  ? 'bg-emerald-50 text-emerald-500'
                  : 'bg-blue-50 text-blue-500'
              }`}
            >
              {dDay}
            </span>
          )}
        </div>

        {/* 회사 정보 + 로고 / Company info + logo */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <div
              className={`
                w-11 h-11 rounded-[12px] overflow-hidden flex items-center justify-center
                transition-all duration-300
                ${isPremium
                  ? 'bg-gradient-to-br from-violet-100 to-indigo-50 ring-2 ring-violet-200/50'
                  : 'bg-gray-100 ring-1 ring-gray-200/60'
                }
              `}
            >
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('span');
                    fallback.textContent = job.companyInitial;
                    fallback.className = 'text-[16px] font-bold text-gray-500';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            {/* 매치 스코어 MD3 배지 / Match score MD3 badge */}
            {job.matchScore && job.matchScore >= 80 && (
              <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full bg-emerald-500 flex items-center justify-center ring-2 ring-white">
                <span className="text-[8px] font-bold text-white">{job.matchScore}</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-[2px]">
              <Building2 className="w-[11px] h-[11px] text-gray-400 flex-shrink-0" />
              <span className="text-[12px] font-medium text-gray-500 truncate">{job.company}</span>
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {job.title}
            </h3>
          </div>
        </div>

        {/* 토스 스타일 급여 섹션 / Toss-style salary section */}
        <div
          className={`
            rounded-[14px] px-4 py-3 mb-3 transition-all duration-400
            ${isPremium
              ? 'bg-gradient-to-r from-violet-50/90 to-indigo-50/70'
              : 'bg-gray-50/80'
            }
            ${isHovered ? 'ring-1 ring-gray-200/80' : ''}
          `}
        >
          <TossSalaryDisplay job={job} isVisible={isVisible} />
          <p className="text-[11px] text-gray-400 mt-[3px]">{salaryText}</p>
        </div>

        {/* 메타 정보 iOS 스타일 / Meta info iOS style */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-[6px] mb-3">
          <span className="inline-flex items-center gap-[3px] text-[11px] text-gray-500">
            <MapPin className="w-[11px] h-[11px] text-gray-400" />
            {job.location}
          </span>
          {job.workHours && (
            <span className="inline-flex items-center gap-[3px] text-[11px] text-gray-500">
              <Clock className="w-[11px] h-[11px] text-gray-400" />
              {job.workHours}
            </span>
          )}
          <span className="inline-flex items-center gap-[3px] text-[11px] text-gray-500">
            <Briefcase className="w-[11px] h-[11px] text-gray-400" />
            {job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'}
          </span>
        </div>

        {/* 비자 칩 (MD3 톤 칩 스타일) / Visa chips (MD3 tonal chip style) */}
        <div className="flex items-center gap-[5px] flex-wrap mb-3">
          {job.allowedVisas.slice(0, 3).map((visa) => {
            const color = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`
                  inline-flex items-center rounded-full px-[8px] py-[2px]
                  text-[10px] font-semibold
                  ${color.bg} ${color.text}
                  ring-1 ring-black/[0.04]
                  transition-transform duration-200
                  group-hover:scale-105
                `}
              >
                {visa}
              </span>
            );
          })}
          {job.allowedVisas.length > 3 && (
            <span className="text-[10px] font-medium text-gray-400">
              +{job.allowedVisas.length - 3}
            </span>
          )}
        </div>

        {/* 복리후생 태그 / Benefits tags */}
        {isHovered && job.benefits.length > 0 && (
          <div className="flex items-center gap-[5px] flex-wrap mb-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
            {job.benefits.slice(0, 4).map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center rounded-[6px] bg-gray-100/70 px-[7px] py-[2px] text-[10px] font-medium text-gray-500"
              >
                {benefit}
              </span>
            ))}
          </div>
        )}

        {/* 하단 통계 + 호버 액션 / Bottom stats + hover action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100/80">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-[3px] text-[11px] text-gray-400">
              <Users className="w-[11px] h-[11px]" />
              {job.applicantCount}명
            </span>
            <span className="inline-flex items-center gap-[3px] text-[11px] text-gray-400">
              <Eye className="w-[11px] h-[11px]" />
              {job.viewCount.toLocaleString()}
            </span>
            {job.experienceRequired && (
              <span className="inline-flex items-center gap-[3px] text-[11px] text-gray-400">
                <Award className="w-[11px] h-[11px]" />
                {job.experienceRequired}
              </span>
            )}
          </div>

          {/* iOS 스타일 호버 시 화살표 / iOS-style hover arrow */}
          <div
            className={`
              flex items-center gap-1 transition-all duration-300
              ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
            `}
          >
            <span className="text-[11px] font-semibold text-blue-500">상세보기</span>
            <ChevronRight className="w-3 h-3 text-blue-500" />
          </div>
        </div>
      </div>

      {/* 호버 시 좌측 토널 악센트 라인 / Hover tonal accent line on left */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-400
          ${isHovered
            ? isPremium
              ? 'bg-gradient-to-b from-violet-400 to-indigo-400 opacity-100'
              : 'bg-gradient-to-b from-blue-400 to-cyan-400 opacity-100'
            : 'opacity-0'
          }
        `}
      />

      {/* 하트 즐겨찾기 버튼 (iOS 스타일) / Heart favorite button (iOS style) */}
      <button
        className={`
          absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
          transition-all duration-300
          ${isHovered
            ? 'bg-white/90 shadow-sm opacity-100 scale-100'
            : 'opacity-0 scale-75'
          }
          hover:bg-red-50 hover:scale-110 active:scale-95
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <Heart className="w-[14px] h-[14px] text-gray-400 hover:text-red-400 transition-colors" />
      </button>
    </div>
  );
}

// 통계 카운터 카드 / Stats counter card
function StatsCounter({
  icon: Icon,
  label,
  value,
  unit,
  color,
  isVisible,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  unit: string;
  color: string;
  isVisible: boolean;
}) {
  const counted = useCountUp(value, 1800, isVisible);

  const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', text: 'text-blue-600' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-500', text: 'text-violet-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-500', text: 'text-amber-600' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`flex items-center gap-3 rounded-[14px] ${c.bg} px-4 py-3`}>
      <div className={`w-9 h-9 rounded-[10px] bg-white/80 flex items-center justify-center shadow-sm`}>
        <Icon className={`w-[18px] h-[18px] ${c.icon}`} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-400 mb-[1px]">{label}</p>
        <div className="flex items-baseline gap-[2px]">
          <span className={`text-[20px] font-extrabold tabular-nums leading-none ${c.text}`}>
            {counted.toLocaleString()}
          </span>
          <span className="text-[11px] font-medium text-gray-400">{unit}</span>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G076Page() {
  const [activeTab, setActiveTab] = useState<SegmentTab>('all');
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // 통계 영역 뷰포트 진입 감지 / Detect stats area viewport entry
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // 세그먼트 필터링 / Segment filtering
  const filteredJobs = sampleJobsV2.filter((job) => {
    if (activeTab === 'fulltime') return job.boardType === 'FULL_TIME';
    if (activeTab === 'parttime') return job.boardType === 'PART_TIME';
    return true;
  });

  const counts = {
    all: sampleJobsV2.length,
    fulltime: sampleJobsV2.filter((j) => j.boardType === 'FULL_TIME').length,
    parttime: sampleJobsV2.filter((j) => j.boardType === 'PART_TIME').length,
  };

  // 전체 통계 / Overall stats
  const totalApplicants = sampleJobsV2.reduce((s, j) => s + j.applicantCount, 0);
  const totalViews = sampleJobsV2.reduce((s, j) => s + j.viewCount, 0);
  const premiumCount = sampleJobsV2.filter((j) => j.tierType === 'PREMIUM').length;
  const avgMatch = Math.round(
    sampleJobsV2.reduce((s, j) => s + (j.matchScore || 0), 0) / sampleJobsV2.length
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* iOS 스타일 상단 바 / iOS-style top bar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/40">
        <div className="max-w-3xl mx-auto px-5 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">채용공고</h1>
              <p className="text-[12px] text-gray-400 mt-[1px]">
                {filteredJobs.length}개의 공고 | 비자 자동 매칭
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full bg-gray-100/80 flex items-center justify-center hover:bg-gray-200/80 transition-colors">
                <TrendingUp className="w-[16px] h-[16px] text-gray-500" />
              </button>
              <button className="w-9 h-9 rounded-full bg-gray-100/80 flex items-center justify-center hover:bg-gray-200/80 transition-colors">
                <CalendarDays className="w-[16px] h-[16px] text-gray-500" />
              </button>
            </div>
          </div>

          {/* iOS 세그먼트 컨트롤 / iOS segmented control */}
          <SegmentedControl
            activeTab={activeTab}
            onChange={setActiveTab}
            counts={counts}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-5">
        {/* 토스 스타일 통계 카운터 / Toss-style stats counters */}
        <div ref={statsRef} className="grid grid-cols-2 gap-[10px] mb-6">
          <StatsCounter
            icon={Users}
            label="전체 지원자"
            value={totalApplicants}
            unit="명"
            color="blue"
            isVisible={statsVisible}
          />
          <StatsCounter
            icon={Eye}
            label="전체 조회"
            value={totalViews}
            unit="회"
            color="violet"
            isVisible={statsVisible}
          />
          <StatsCounter
            icon={Sparkles}
            label="프리미엄 공고"
            value={premiumCount}
            unit="건"
            color="amber"
            isVisible={statsVisible}
          />
          <StatsCounter
            icon={TrendingUp}
            label="평균 매치"
            value={avgMatch}
            unit="%"
            color="emerald"
            isVisible={statsVisible}
          />
        </div>

        {/* 세그먼트 전환 안내 / Segment switch info */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-gray-800">
            {activeTab === 'all'
              ? '전체 공고'
              : activeTab === 'fulltime'
              ? '정규직 공고'
              : '아르바이트 공고'}
          </h2>
          <span className="text-[12px] font-medium text-gray-400">
            최신순
          </span>
        </div>

        {/* 잡 카드 리스트 / Job card list */}
        <div className="flex flex-col gap-[14px]">
          {filteredJobs.map((job, idx) => (
            <JobCard key={job.id} job={job} index={idx} />
          ))}
        </div>

        {/* 필터된 결과 없을 때 / No results */}
        {filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-[15px] font-semibold text-gray-500 mb-1">공고가 없습니다</p>
            <p className="text-[13px] text-gray-400">다른 카테고리를 확인해 보세요</p>
          </div>
        )}

        {/* 하단 여백 / Bottom spacing */}
        <div className="h-24" />
      </div>

      {/* MD3 FAB (Floating Action Button) / MD3 FAB */}
      <button
        className="
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-[16px]
          bg-gradient-to-br from-blue-500 to-indigo-600
          shadow-[0_6px_20px_-4px_rgba(79,70,229,0.5),0_3px_8px_-2px_rgba(79,70,229,0.3)]
          flex items-center justify-center
          hover:scale-105 hover:shadow-[0_8px_28px_-4px_rgba(79,70,229,0.6)]
          active:scale-95
          transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        "
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* 디자인 정보 워터마크 / Design info watermark */}
      <div className="fixed bottom-3 left-3 z-40">
        <span className="text-[9px] font-medium text-gray-300/60 tracking-wider">
          g-076 iOS x MD3 x Toss
        </span>
      </div>
    </div>
  );
}