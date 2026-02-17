'use client';

// 시안 17: iOS 네이티브 느낌 카드 / Variant 17: iOS Native Feel Card
// Apple iOS 설정/앱스토어 카드 스타일 — 그룹화된 둥근 섹션, 시스템 그레이 배경
// Apple iOS Settings/App Store card style — grouped rounded sections, system-gray bg

import { useState } from 'react';
import {
  ChevronRight,
  MapPin,
  Clock,
  Briefcase,
  Eye,
  Users,
  Star,
  Shield,
  Zap,
  Search,
} from 'lucide-react';
import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';

// iOS 시스템 색상 상수 / iOS system color constants
const IOS_COLORS = {
  systemBlue: '#007AFF',
  systemGray: '#8E8E93',
  systemGray2: '#AEAEB2',
  systemGray3: '#C7C7CC',
  systemGray4: '#D1D1D6',
  systemGray5: '#E5E5EA',
  systemGray6: '#F2F2F7',
  systemRed: '#FF3B30',
  systemOrange: '#FF9500',
  systemGreen: '#34C759',
  groupedBg: '#F2F2F7',
  cardBg: '#FFFFFF',
  separator: '#C6C6C8',
} as const;

// 세그먼트 컨트롤 타입 / Segment control type
type SegmentOption = '전체' | '정규직' | '알바';

// D-day 상태에 따른 iOS 스타일 텍스트 색상 / D-day status color in iOS style
function getDDayColor(dDay: string | null): string {
  if (!dDay) return IOS_COLORS.systemGray;
  if (dDay === '마감') return IOS_COLORS.systemGray3;
  if (dDay === '상시모집') return IOS_COLORS.systemGreen;
  if (dDay === 'D-Day') return IOS_COLORS.systemRed;
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 3) return IOS_COLORS.systemRed;
  if (!isNaN(num) && num <= 7) return IOS_COLORS.systemOrange;
  return IOS_COLORS.systemBlue;
}

// iOS 스타일 세그먼트 컨트롤 / iOS-style segmented control
function SegmentedControl({
  options,
  selected,
  onSelect,
}: {
  options: SegmentOption[];
  selected: SegmentOption;
  onSelect: (option: SegmentOption) => void;
}) {
  return (
    <div
      className="inline-flex rounded-lg p-0.5"
      style={{ backgroundColor: 'rgba(142, 142, 147, 0.12)' }}
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`
            relative px-5 py-1.5 text-[13px] font-medium rounded-md
            transition-all duration-200 ease-in-out
            ${
              selected === option
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }
          `}
          style={
            selected === option
              ? { boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' }
              : undefined
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// iOS 그룹 헤더 / iOS group header
function GroupHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="px-5 pt-6 pb-2">
      <span
        className="text-[13px] font-normal uppercase tracking-wide"
        style={{ color: IOS_COLORS.systemGray }}
      >
        {title}
        <span className="ml-1.5 normal-case tracking-normal">({count})</span>
      </span>
    </div>
  );
}

// 개별 iOS 카드 행 / Individual iOS card row
function IOSJobRow({
  job,
  isFirst,
  isLast,
}: {
  job: MockJobPosting;
  isFirst: boolean;
  isLast: boolean;
}) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 표시 / Salary display
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posting
  const timeAgo = getTimeAgo(job.postedDate);
  // 프리미엄 여부 / Premium check
  const isPremium = job.tierType === 'PREMIUM';
  // 마감 여부 / Closed check
  const isClosed = dDay === '마감';
  // D-day 색상 / D-day color
  const dDayColor = getDDayColor(dDay);

  return (
    <div
      className={`
        relative bg-white
        ${isFirst ? 'rounded-t-[10px]' : ''}
        ${isLast ? 'rounded-b-[10px]' : ''}
        ${isClosed ? 'opacity-50' : ''}
        ${isPremium ? 'ring-1 ring-blue-100' : ''}
        transition-colors duration-150
        active:bg-gray-100
        cursor-pointer
      `}
      style={
        isPremium
          ? { boxShadow: '0 0 12px rgba(0, 122, 255, 0.08)' }
          : undefined
      }
    >
      {/* 프리미엄 블루 글로우 인디케이터 / Premium blue glow indicator */}
      {isPremium && (
        <div
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
          style={{ backgroundColor: IOS_COLORS.systemBlue }}
        />
      )}

      {/* 메인 콘텐츠 영역 / Main content area */}
      <div className="flex items-center pl-5 pr-4 py-3.5">
        {/* 왼쪽: 회사 아이콘 영역 / Left: company icon area */}
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 mr-3"
          style={{ backgroundColor: IOS_COLORS.systemGray6 }}
        >
          <Briefcase
            className="w-5 h-5"
            style={{ color: isPremium ? IOS_COLORS.systemBlue : IOS_COLORS.systemGray2 }}
          />
        </div>

        {/* 중앙: 공고 정보 / Center: job info */}
        <div className="flex-1 min-w-0">
          {/* 첫째 줄: 제목 + 배지 / First line: title + badges */}
          <div className="flex items-center gap-1.5 mb-0.5">
            {job.isUrgent && (
              <span
                className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: IOS_COLORS.systemRed }}
              >
                긴급
              </span>
            )}
            {isPremium && (
              <Star
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: IOS_COLORS.systemBlue }}
                fill={IOS_COLORS.systemBlue}
              />
            )}
            <span className="text-[15px] font-semibold text-gray-900 truncate leading-tight">
              {job.title}
            </span>
          </div>

          {/* 둘째 줄: 회사 + 위치 / Second line: company + location */}
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[13px] text-gray-500 truncate">{job.company}</span>
            <span className="text-gray-300 text-[13px]">&middot;</span>
            <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: IOS_COLORS.systemGray2 }} />
            <span className="text-[13px] text-gray-400 truncate">{job.location}</span>
          </div>

          {/* 셋째 줄: 급여 + 비자 배지 / Third line: salary + visa badges */}
          <div className="flex items-center gap-2">
            <span
              className="text-[13px] font-semibold flex-shrink-0"
              style={{ color: IOS_COLORS.systemBlue }}
            >
              {salary}
            </span>
            <div className="flex items-center gap-1 overflow-hidden">
              {job.allowedVisas.slice(0, 3).map((visa) => (
                <span
                  key={visa}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(0, 122, 255, 0.08)',
                    color: IOS_COLORS.systemBlue,
                  }}
                >
                  {visa}
                </span>
              ))}
              {job.allowedVisas.length > 3 && (
                <span
                  className="text-[10px] font-medium flex-shrink-0"
                  style={{ color: IOS_COLORS.systemGray }}
                >
                  +{job.allowedVisas.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽: D-day + chevron / Right: D-day + chevron */}
        <div className="flex flex-col items-end ml-3 flex-shrink-0">
          <span
            className="text-[13px] font-semibold mb-0.5"
            style={{ color: dDayColor }}
          >
            {dDay}
          </span>
          <span className="text-[11px]" style={{ color: IOS_COLORS.systemGray2 }}>
            {timeAgo}
          </span>
          <ChevronRight
            className="w-4 h-4 mt-1"
            style={{ color: IOS_COLORS.systemGray3 }}
          />
        </div>
      </div>

      {/* iOS 스타일 구분선 (마지막 행 제외, 왼쪽 인덴트) / iOS separator (not on last, left indent) */}
      {!isLast && (
        <div
          className="absolute bottom-0 right-0 h-px"
          style={{
            left: '68px',
            backgroundColor: IOS_COLORS.separator,
            opacity: 0.3,
          }}
        />
      )}

      {/* 스와이프 힌트 (호버 시 표시) / Swipe action hint (visible on hover) */}
      <div className="absolute right-0 top-0 bottom-0 w-1 opacity-0 hover:opacity-100 transition-opacity">
        <div
          className="h-full w-full rounded-l"
          style={{ backgroundColor: IOS_COLORS.systemBlue, opacity: 0.15 }}
        />
      </div>
    </div>
  );
}

// 하단 메타 정보 카드 / Bottom metadata card
function MetadataCard({ jobs }: { jobs: MockJobPosting[] }) {
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantCount, 0);
  const totalViews = jobs.reduce((sum, j) => sum + j.viewCount, 0);
  const premiumCount = jobs.filter((j) => j.tierType === 'PREMIUM').length;

  return (
    <div className="mx-4 mt-2 mb-6">
      <div className="bg-white rounded-[10px] overflow-hidden">
        {/* 지원자 수 / Applicant count */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4" style={{ color: IOS_COLORS.systemBlue }} />
            <span className="text-[15px] text-gray-900">총 지원자 / Total Applicants</span>
          </div>
          <span className="text-[15px]" style={{ color: IOS_COLORS.systemGray }}>
            {totalApplicants.toLocaleString()}명
          </span>
        </div>

        {/* 구분선 / Separator */}
        <div className="h-px" style={{ marginLeft: '52px', backgroundColor: IOS_COLORS.separator, opacity: 0.3 }} />

        {/* 조회수 / View count */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4" style={{ color: IOS_COLORS.systemGreen }} />
            <span className="text-[15px] text-gray-900">총 조회수 / Total Views</span>
          </div>
          <span className="text-[15px]" style={{ color: IOS_COLORS.systemGray }}>
            {totalViews.toLocaleString()}회
          </span>
        </div>

        {/* 구분선 / Separator */}
        <div className="h-px" style={{ marginLeft: '52px', backgroundColor: IOS_COLORS.separator, opacity: 0.3 }} />

        {/* 프리미엄 공고 / Premium jobs */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <Star className="w-4 h-4" style={{ color: IOS_COLORS.systemOrange }} />
            <span className="text-[15px] text-gray-900">프리미엄 공고 / Premium</span>
          </div>
          <span className="text-[15px]" style={{ color: IOS_COLORS.systemGray }}>
            {premiumCount}건
          </span>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant17Page() {
  // 선택된 세그먼트 / Selected segment
  const [selectedSegment, setSelectedSegment] = useState<SegmentOption>('전체');

  // 세그먼트에 따른 필터링 / Filter by segment
  const filteredJobs = sampleJobs.filter((job) => {
    if (selectedSegment === '전체') return true;
    if (selectedSegment === '정규직') return job.boardType === 'FULL_TIME';
    if (selectedSegment === '알바') return job.boardType === 'PART_TIME';
    return true;
  });

  // 프리미엄 공고 먼저, 그 다음 일반 / Premium first, then standard
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (a.tierType === 'PREMIUM' && b.tierType !== 'PREMIUM') return -1;
    if (a.tierType !== 'PREMIUM' && b.tierType === 'PREMIUM') return 1;
    return 0;
  });

  // 프리미엄/일반 그룹 분리 / Separate premium and standard groups
  const premiumJobs = sortedJobs.filter((j) => j.tierType === 'PREMIUM');
  const standardJobs = sortedJobs.filter((j) => j.tierType === 'STANDARD');

  return (
    <div className="min-h-screen" style={{ backgroundColor: IOS_COLORS.groupedBg }}>
      {/* iOS 스타일 네비게이션 바 / iOS-style navigation bar */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
        <div className="max-w-lg mx-auto px-4">
          {/* 타이틀 영역 / Title area */}
          <div className="pt-3 pb-2">
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
              채용공고
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: IOS_COLORS.systemGray }}>
              Job Listings
            </p>
          </div>

          {/* 검색 바 (iOS 스타일) / Search bar (iOS style) */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] mb-3"
            style={{ backgroundColor: 'rgba(142, 142, 147, 0.12)' }}
          >
            <Search className="w-4 h-4" style={{ color: IOS_COLORS.systemGray }} />
            <span className="text-[15px]" style={{ color: IOS_COLORS.systemGray2 }}>
              공고 검색 / Search jobs...
            </span>
          </div>

          {/* 세그먼트 컨트롤 / Segmented control */}
          <div className="flex justify-center pb-3">
            <SegmentedControl
              options={['전체', '정규직', '알바']}
              selected={selectedSegment}
              onSelect={setSelectedSegment}
            />
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 / Main content area */}
      <div className="max-w-lg mx-auto">
        {/* 결과 카운트 / Result count */}
        <div className="px-5 pt-4 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-[13px]" style={{ color: IOS_COLORS.systemGray }}>
              {filteredJobs.length}개의 공고 / {filteredJobs.length} jobs found
            </span>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" style={{ color: IOS_COLORS.systemGreen }} />
              <span className="text-[11px]" style={{ color: IOS_COLORS.systemGreen }}>
                비자 인증됨 / Visa verified
              </span>
            </div>
          </div>
        </div>

        {/* 추천 공고 그룹 (프리미엄) / Featured group (premium) */}
        {premiumJobs.length > 0 && (
          <>
            <GroupHeader title="추천 공고 / Featured" count={premiumJobs.length} />
            <div className="mx-4">
              <div className="rounded-[10px] overflow-hidden" style={{ boxShadow: '0 0 0 0.5px rgba(0,0,0,0.04)' }}>
                {premiumJobs.map((job, index) => (
                  <IOSJobRow
                    key={job.id}
                    job={job}
                    isFirst={index === 0}
                    isLast={index === premiumJobs.length - 1}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* 전체 공고 그룹 (일반) / All jobs group (standard) */}
        {standardJobs.length > 0 && (
          <>
            <GroupHeader title="전체 공고 / All Jobs" count={standardJobs.length} />
            <div className="mx-4">
              <div className="rounded-[10px] overflow-hidden" style={{ boxShadow: '0 0 0 0.5px rgba(0,0,0,0.04)' }}>
                {standardJobs.map((job, index) => (
                  <IOSJobRow
                    key={job.id}
                    job={job}
                    isFirst={index === 0}
                    isLast={index === standardJobs.length - 1}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* 필터 결과 없음 / No filter results */}
        {filteredJobs.length === 0 && (
          <div className="mx-4 mt-6">
            <div className="bg-white rounded-[10px] py-12 flex flex-col items-center">
              <Briefcase className="w-10 h-10 mb-3" style={{ color: IOS_COLORS.systemGray3 }} />
              <p className="text-[15px] font-medium text-gray-500">
                해당하는 공고가 없습니다
              </p>
              <p className="text-[13px] mt-1" style={{ color: IOS_COLORS.systemGray }}>
                No matching jobs found
              </p>
            </div>
          </div>
        )}

        {/* 통계 메타 카드 / Statistics metadata card */}
        <GroupHeader title="통계 / Statistics" count={0} />
        <MetadataCard jobs={filteredJobs} />

        {/* iOS 스타일 스와이프 힌트 / iOS-style swipe hint */}
        <div className="mx-4 mb-4">
          <div className="bg-white rounded-[10px] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4" style={{ color: IOS_COLORS.systemBlue }} />
                <div>
                  <span className="text-[13px] text-gray-900 block">스와이프하여 빠른 작업</span>
                  <span className="text-[11px]" style={{ color: IOS_COLORS.systemGray }}>
                    Swipe for quick actions
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: IOS_COLORS.systemGray3 }} />
            </div>
          </div>
        </div>

        {/* 페이지 설명 (하단) / Page description (bottom) */}
        <div className="px-5 pb-8">
          <p className="text-[11px] text-center" style={{ color: IOS_COLORS.systemGray }}>
            시안 17: iOS Native Feel Card{'\n'}
            Apple iOS 설정/앱스토어 카드 스타일
          </p>
          <p className="text-[11px] text-center mt-0.5" style={{ color: IOS_COLORS.systemGray2 }}>
            iOS Settings / App Store card style with grouped sections
          </p>
        </div>
      </div>
    </div>
  );
}
