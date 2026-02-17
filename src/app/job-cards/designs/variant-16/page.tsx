'use client';

// 시안 16: 머터리얼 디자인 3 카드 (Material You 스타일) / Variant 16: Material Design 3 Card (Material You Style)
// Google MD3 디자인 시스템: 라운드 3xl 코너, 톤 서피스 색상, 필드 톤 버튼, 세그먼트 필터
// Google MD3 design system: rounded-3xl corners, tonal surface colors, filled tonal buttons, segmented filters

import { useState } from 'react';
import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Shield,
  Star,
  Zap,
  Plus,
  Briefcase,
  ChevronRight,
  Heart,
  Share2,
  BookmarkPlus,
  Sparkles,
  TrendingUp,
  Building2,
} from 'lucide-react';

// MD3 업종별 톤 컬러 매핑 / MD3 industry tonal color mapping
// MD3는 primary, secondary, tertiary 컨테이너 색상을 사용 / MD3 uses primary, secondary, tertiary container colors
const industryTones: Record<string, {
  surface: string;
  onSurface: string;
  container: string;
  onContainer: string;
  outline: string;
}> = {
  '제조': {
    surface: 'bg-blue-50',
    onSurface: 'text-blue-900',
    container: 'bg-blue-100',
    onContainer: 'text-blue-800',
    outline: 'border-blue-200',
  },
  '숙박/음식': {
    surface: 'bg-orange-50',
    onSurface: 'text-orange-900',
    container: 'bg-orange-100',
    onContainer: 'text-orange-800',
    outline: 'border-orange-200',
  },
  'IT/소프트웨어': {
    surface: 'bg-violet-50',
    onSurface: 'text-violet-900',
    container: 'bg-violet-100',
    onContainer: 'text-violet-800',
    outline: 'border-violet-200',
  },
  '건설': {
    surface: 'bg-amber-50',
    onSurface: 'text-amber-900',
    container: 'bg-amber-100',
    onContainer: 'text-amber-800',
    outline: 'border-amber-200',
  },
  '물류/운송': {
    surface: 'bg-teal-50',
    onSurface: 'text-teal-900',
    container: 'bg-teal-100',
    onContainer: 'text-teal-800',
    outline: 'border-teal-200',
  },
  '교육': {
    surface: 'bg-rose-50',
    onSurface: 'text-rose-900',
    container: 'bg-rose-100',
    onContainer: 'text-rose-800',
    outline: 'border-rose-200',
  },
};

// 기본 톤 컬러 / Default tonal color
const defaultTone = {
  surface: 'bg-gray-50',
  onSurface: 'text-gray-900',
  container: 'bg-gray-100',
  onContainer: 'text-gray-800',
  outline: 'border-gray-200',
};

// 업종 톤 컬러 가져오기 / Get industry tonal color
function getIndustryTone(industry: string) {
  return industryTones[industry] || defaultTone;
}

// 필터 타입 정의 / Filter type definition
type FilterType = 'ALL' | 'FULL_TIME' | 'PART_TIME' | 'PREMIUM';

// MD3 세그먼트 버튼 필터 / MD3 Segmented button filter
function SegmentedFilter({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}) {
  // 필터 옵션 정의 / Filter option definitions
  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'ALL', label: '전체', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'FULL_TIME', label: '정규직', icon: <Briefcase className="w-4 h-4" /> },
    { key: 'PART_TIME', label: '알바', icon: <Clock className="w-4 h-4" /> },
    { key: 'PREMIUM', label: '프리미엄', icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <div className="inline-flex rounded-2xl border border-gray-300 overflow-hidden bg-white">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-all duration-200 relative
              ${isActive
                ? 'bg-violet-100 text-violet-900'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
              ${filter.key !== 'ALL' ? 'border-l border-gray-300' : ''}
            `}
          >
            {/* 활성 체크마크 / Active checkmark */}
            {isActive && (
              <span className="text-violet-700 font-bold text-xs">&#10003;</span>
            )}
            {filter.icon}
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

// MD3 Elevated 카드 (프리미엄용) / MD3 Elevated card (for premium)
function ElevatedCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 업종 톤 컬러 / Industry tonal color
  const tone = getIndustryTone(job.industry);

  return (
    <div className="group rounded-3xl bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* 톤 서피스 헤더 / Tonal surface header */}
      <div className={`${tone.surface} px-5 pt-5 pb-4`}>
        {/* 상단 배지 행 / Top badge row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* 프리미엄 톤 배지 / Premium tonal badge */}
            {job.tierType === 'PREMIUM' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Premium
              </span>
            )}
            {/* 긴급 톤 배지 / Urgent tonal badge */}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                <Zap className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                긴급
              </span>
            )}
            {/* 추천 배지 / Featured badge */}
            {job.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700">
                <TrendingUp className="w-3.5 h-3.5" />
                추천
              </span>
            )}
          </div>
          {/* D-day / D-day indicator */}
          {dDay && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full
              ${dDay === '마감' ? 'bg-gray-200 text-gray-400' :
                dDay === 'D-Day' ? 'bg-red-200 text-red-700' :
                dDay === '상시모집' ? 'bg-green-100 text-green-700' :
                'bg-white/80 text-gray-700'}`}>
              {dDay}
            </span>
          )}
        </div>

        {/* 기업 정보 / Company info */}
        <div className="flex items-center gap-3 mb-3">
          {/* 기업 로고 플레이스홀더 / Company logo placeholder */}
          <div className={`w-10 h-10 rounded-2xl ${tone.container} flex items-center justify-center`}>
            <Building2 className={`w-5 h-5 ${tone.onContainer}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{job.company}</p>
            <p className="text-xs text-gray-500 inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </p>
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className={`text-base font-bold ${tone.onSurface} leading-snug line-clamp-2`}>
          {job.title}
        </h3>
      </div>

      {/* 카드 하단 본문 / Card bottom body */}
      <div className="px-5 py-4 space-y-3">
        {/* 급여 / Salary */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{salary}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tone.container} ${tone.onContainer}`}>
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
          </span>
        </div>

        {/* 업종 + 경력 + 근무시간 / Industry + Experience + Work hours */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${tone.container} ${tone.onContainer}`}>
            {job.industry}
          </span>
          {job.experienceRequired && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {job.experienceRequired}
            </span>
          )}
          {job.workHours && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {job.workHours.split(' ')[0]}
            </span>
          )}
        </div>

        {/* 비자 칩 / Visa chips */}
        <div className="flex flex-wrap gap-1.5">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              <Shield className="w-3 h-3" />
              {visa}
            </span>
          ))}
        </div>

        {/* 혜택 칩 (최대 3개) / Benefits chips (max 3) */}
        <div className="flex flex-wrap gap-1.5">
          {job.benefits.slice(0, 3).map((benefit) => (
            <span
              key={benefit}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-150"
            >
              {benefit}
            </span>
          ))}
          {job.benefits.length > 3 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-400">
              +{job.benefits.length - 3}
            </span>
          )}
        </div>

        {/* 구분선 / Divider */}
        <div className="border-t border-gray-100" />

        {/* 하단 액션 행 / Bottom action row */}
        <div className="flex items-center justify-between pt-1">
          {/* 좌측: 통계 / Left: Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {job.applicantCount}명
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {job.viewCount.toLocaleString()}
            </span>
            <span>{timeAgo}</span>
          </div>

          {/* 우측: 아이콘 버튼 (리플 효과 hover) / Right: Icon buttons (ripple-like hover) */}
          <div className="flex items-center gap-1">
            {/* 좋아요 아이콘 버튼 / Favorite icon button */}
            <button className="p-2 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors duration-150">
              <Heart className="w-4.5 h-4.5 text-gray-400 hover:text-rose-500 transition-colors" />
            </button>
            {/* 북마크 아이콘 버튼 / Bookmark icon button */}
            <button className="p-2 rounded-full hover:bg-violet-50 active:bg-violet-100 transition-colors duration-150">
              <BookmarkPlus className="w-4.5 h-4.5 text-gray-400 hover:text-violet-600 transition-colors" />
            </button>
            {/* 공유 아이콘 버튼 / Share icon button */}
            <button className="p-2 rounded-full hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150">
              <Share2 className="w-4.5 h-4.5 text-gray-400 hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* MD3 필드 톤 버튼 / MD3 Filled tonal button */}
        <button className={`w-full py-3 rounded-2xl text-sm font-bold transition-all duration-200
          ${tone.container} ${tone.onContainer} hover:shadow-md active:shadow-sm
          flex items-center justify-center gap-2`}>
          상세보기
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// MD3 Filled 카드 (일반용) / MD3 Filled card (for standard)
function FilledCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 업종 톤 컬러 / Industry tonal color
  const tone = getIndustryTone(job.industry);

  return (
    <div className={`group rounded-3xl ${tone.surface} border ${tone.outline} hover:shadow-lg transition-all duration-300 overflow-hidden`}>
      {/* 카드 본문 / Card body */}
      <div className="p-5 space-y-3">
        {/* 상단: 배지 + D-day / Top: Badges + D-day */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 고용형태 칩 / Employment type chip */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tone.container} ${tone.onContainer}`}>
              {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
            </span>
            {/* 긴급 배지 / Urgent badge */}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                <Zap className="w-3 h-3 fill-red-500 text-red-500" />
                긴급
              </span>
            )}
          </div>
          {dDay && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/70
              ${dDay === '마감' ? 'text-gray-400' :
                dDay === 'D-Day' ? 'text-red-600' :
                dDay === '상시모집' ? 'text-green-700' : 'text-gray-700'}`}>
              {dDay}
            </span>
          )}
        </div>

        {/* 기업 + 위치 / Company + Location */}
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl ${tone.container} flex items-center justify-center`}>
            <Building2 className={`w-4.5 h-4.5 ${tone.onContainer}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{job.company}</p>
            <p className="text-xs text-gray-500 inline-flex items-center gap-0.5">
              <MapPin className="w-3 h-3" />
              {job.location}
            </p>
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className={`text-[15px] font-bold ${tone.onSurface} leading-snug line-clamp-2 group-hover:underline decoration-1 underline-offset-2`}>
          {job.title}
        </h3>

        {/* 급여 / Salary */}
        <p className="text-base font-bold text-gray-900">{salary}</p>

        {/* 비자 칩 / Visa chips */}
        <div className="flex flex-wrap gap-1.5">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/80 text-emerald-800 border border-emerald-200"
            >
              <Shield className="w-3 h-3" />
              {visa}
            </span>
          ))}
        </div>

        {/* 메타 정보 / Meta info */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {job.experienceRequired && (
            <span>{job.experienceRequired}</span>
          )}
          {job.workHours && (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {job.workHours.split(' ')[0]}
            </span>
          )}
        </div>

        {/* 구분선 / Divider */}
        <div className={`border-t ${tone.outline}`} />

        {/* 하단 행 / Bottom row */}
        <div className="flex items-center justify-between">
          {/* 통계 / Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {job.applicantCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {job.viewCount.toLocaleString()}
            </span>
            <span>{timeAgo}</span>
          </div>

          {/* 액션 버튼 / Action buttons */}
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-white/60 active:bg-white/80 transition-colors">
              <Heart className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/60 active:bg-white/80 transition-colors">
              <BookmarkPlus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* MD3 아웃라인 버튼 / MD3 Outlined button */}
        <button className={`w-full py-2.5 rounded-2xl text-sm font-bold transition-all duration-200
          bg-white/70 ${tone.onContainer} border ${tone.outline}
          hover:bg-white hover:shadow-sm active:shadow-none
          flex items-center justify-center gap-2`}>
          상세보기
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function Variant16MaterialDesign3() {
  // 필터 상태 / Filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  // 필터링된 공고 목록 / Filtered job list
  const filteredJobs = sampleJobs.filter((job) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'FULL_TIME') return job.boardType === 'FULL_TIME';
    if (activeFilter === 'PART_TIME') return job.boardType === 'PART_TIME';
    if (activeFilter === 'PREMIUM') return job.tierType === 'PREMIUM';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* MD3 상단 앱 바 / MD3 Top App Bar */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* 타이틀 행 / Title row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* MD3 앱 아이콘 / MD3 App icon */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-sm">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">채용 공고</h1>
                <p className="text-xs text-gray-500">총 {sampleJobs.length}개의 채용 공고</p>
              </div>
            </div>
          </div>

          {/* MD3 세그먼트 필터 버튼 / MD3 Segmented filter buttons */}
          <SegmentedFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </header>

      {/* 카드 그리드 / Card grid */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-24">
        {/* 결과 요약 / Result summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">{filteredJobs.length}</strong>개의 공고
          </p>
          {/* MD3 필터 칩 / MD3 Filter chip */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">정렬</span>
            <button className="px-3 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              최신순
            </button>
          </div>
        </div>

        {/* 카드 목록: 프리미엄은 Elevated, 일반은 Filled / Card list: Premium uses Elevated, Standard uses Filled */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) =>
            job.tierType === 'PREMIUM' ? (
              <ElevatedCard key={job.id} job={job} />
            ) : (
              <FilledCard key={job.id} job={job} />
            )
          )}
        </div>

        {/* 빈 상태 / Empty state */}
        {filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Briefcase className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500 mb-1">공고가 없습니다</p>
            <p className="text-sm">다른 필터를 선택해보세요</p>
          </div>
        )}
      </main>

      {/* MD3 FAB — 공고 등록 / MD3 FAB — Post a job */}
      <div className="fixed bottom-6 right-6 z-30">
        {/* 확장된 FAB / Extended FAB */}
        <button className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-violet-600 text-white font-bold text-sm
          shadow-lg hover:shadow-xl hover:bg-violet-700 active:shadow-md active:bg-violet-800
          transition-all duration-200 group">
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
          공고 등록
        </button>
      </div>

      {/* MD3 하단 네비게이션 바 / MD3 Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-20 md:hidden">
        <div className="flex items-center justify-around py-2">
          {/* 홈 / Home */}
          <button className="flex flex-col items-center gap-0.5 px-4 py-1">
            <div className="px-4 py-1 rounded-full bg-violet-100">
              <Sparkles className="w-5 h-5 text-violet-700" />
            </div>
            <span className="text-[10px] font-bold text-violet-700">홈</span>
          </button>
          {/* 공고 / Jobs */}
          <button className="flex flex-col items-center gap-0.5 px-4 py-1">
            <div className="px-4 py-1 rounded-full hover:bg-gray-100 transition-colors">
              <Briefcase className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-[10px] text-gray-500">공고</span>
          </button>
          {/* 인재 / Talents */}
          <button className="flex flex-col items-center gap-0.5 px-4 py-1">
            <div className="px-4 py-1 rounded-full hover:bg-gray-100 transition-colors">
              <Users className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-[10px] text-gray-500">인재</span>
          </button>
          {/* MY */}
          <button className="flex flex-col items-center gap-0.5 px-4 py-1">
            <div className="px-4 py-1 rounded-full hover:bg-gray-100 transition-colors">
              <Building2 className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-[10px] text-gray-500">MY</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
