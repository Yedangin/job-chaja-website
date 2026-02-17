'use client';

import { useState } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  Layers,
  Users,
  Eye,
  MapPin,
  Clock,
  Briefcase,
  Star,
  Zap,
  ChevronRight,
  Hash,
  Volume2,
  AtSign,
  Shield,
  Award,
  GripVertical,
  Circle,
  Sparkles,
  Component,
} from 'lucide-react';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-097',
  title: 'Figma×iOS×Discord',
  author: 'Gemini',
  description:
    'Design system + community fusion: Figma component frames, iOS frosted glass segments, Discord dark server cards',
};

// Figma 4색 팔레트 / Figma 4-color palette
const figmaColors = {
  red: { primary: '#F24E1E', light: '#FEE8E2', glow: 'rgba(242,78,30,0.3)' },
  purple: { primary: '#A259FF', light: '#F0E5FF', glow: 'rgba(162,89,255,0.3)' },
  green: { primary: '#0ACF83', light: '#E0FFF2', glow: 'rgba(10,207,131,0.3)' },
  blue: { primary: '#1ABCFE', light: '#E0F6FF', glow: 'rgba(26,188,254,0.3)' },
};

// 카드별 Figma 색상 할당 / Assign Figma color per card
function getFigmaAccent(index: number) {
  const keys = ['red', 'purple', 'green', 'blue'] as const;
  return figmaColors[keys[index % 4]];
}

// iOS 세그먼트 컨트롤 컴포넌트 / iOS segment control component
function SegmentControl({
  segments,
  active,
  onChange,
}: {
  segments: string[];
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="relative flex items-center rounded-[10px] bg-white/10 backdrop-blur-xl p-[3px] border border-white/20">
      {/* 활성 세그먼트 인디케이터(스프링 애니메이션) / Active segment indicator with spring animation */}
      <div
        className="absolute top-[3px] bottom-[3px] rounded-[8px] bg-white/20 backdrop-blur-md shadow-sm border border-white/30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          left: `calc(${(active / segments.length) * 100}% + 3px)`,
          width: `calc(${100 / segments.length}% - 6px)`,
        }}
      />
      {segments.map((seg, i) => (
        <button
          key={seg}
          onClick={() => onChange(i)}
          className={`relative z-10 flex-1 py-1.5 px-3 text-xs font-medium text-center rounded-[8px] transition-colors duration-300 ${
            active === i ? 'text-white' : 'text-white/50 hover:text-white/70'
          }`}
        >
          {seg}
        </button>
      ))}
    </div>
  );
}

// Figma 프레임 코너 노드 / Figma frame corner nodes
function FrameCornerNodes({ color }: { color: string }) {
  const nodeSize = 6;
  return (
    <>
      {/* 좌상단 / Top-left */}
      <div
        className="absolute -top-[3px] -left-[3px] rounded-full border-2 bg-white z-20"
        style={{ width: nodeSize, height: nodeSize, borderColor: color }}
      />
      {/* 우상단 / Top-right */}
      <div
        className="absolute -top-[3px] -right-[3px] rounded-full border-2 bg-white z-20"
        style={{ width: nodeSize, height: nodeSize, borderColor: color }}
      />
      {/* 좌하단 / Bottom-left */}
      <div
        className="absolute -bottom-[3px] -left-[3px] rounded-full border-2 bg-white z-20"
        style={{ width: nodeSize, height: nodeSize, borderColor: color }}
      />
      {/* 우하단 / Bottom-right */}
      <div
        className="absolute -bottom-[3px] -right-[3px] rounded-full border-2 bg-white z-20"
        style={{ width: nodeSize, height: nodeSize, borderColor: color }}
      />
    </>
  );
}

// Discord 서버 멤버 아바타 / Discord server member avatars
function MemberAvatars({ count, color }: { count: number; color: string }) {
  const displayCount = Math.min(count, 5);
  return (
    <div className="flex items-center -space-x-1.5">
      {Array.from({ length: displayCount }).map((_, i) => (
        <div
          key={i}
          className="w-5 h-5 rounded-full border-2 border-[#2B2D31] flex items-center justify-center text-[7px] font-bold text-white"
          style={{
            backgroundColor: `${color}${Math.floor(60 + i * 15).toString(16)}`,
          }}
        >
          {String.fromCharCode(65 + i)}
        </div>
      ))}
      {count > 5 && (
        <div className="w-5 h-5 rounded-full border-2 border-[#2B2D31] bg-[#383A40] flex items-center justify-center text-[7px] font-medium text-gray-400">
          +{count - 5}
        </div>
      )}
    </div>
  );
}

// 잡카드 컴포넌트 / Job card component
function JobCard({
  job,
  index,
}: {
  job: MockJobPostingV2;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [activeSegment, setActiveSegment] = useState(0);
  const accent = getFigmaAccent(index);
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);

  // 세그먼트별 콘텐츠 / Content per segment
  const segmentContent = [
    // 개요 탭 / Overview tab
    () => (
      <div className="space-y-3">
        {/* 급여 + 위치 / Salary + Location */}
        <div className="flex items-center gap-2">
          <div
            className="px-2.5 py-1 rounded-md text-xs font-semibold text-white"
            style={{ backgroundColor: accent.primary }}
          >
            {salary}
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin className="w-3 h-3" />
            {job.location}
          </div>
        </div>
        {/* 비자 배지 / Visa badges */}
        <div className="flex flex-wrap gap-1.5">
          {job.allowedVisas.map((visa) => {
            const vc = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`${vc.bg} ${vc.text} px-2 py-0.5 rounded-full text-[10px] font-semibold`}
              >
                {visa}
              </span>
            );
          })}
        </div>
        {/* 혜택 / Benefits */}
        <div className="flex flex-wrap gap-1">
          {job.benefits.slice(0, 3).map((b) => (
            <span
              key={b}
              className="px-2 py-0.5 rounded bg-[#2B2D31] text-gray-400 text-[10px] border border-[#3F4147]"
            >
              {b}
            </span>
          ))}
          {job.benefits.length > 3 && (
            <span className="px-2 py-0.5 rounded bg-[#2B2D31] text-gray-500 text-[10px]">
              +{job.benefits.length - 3}
            </span>
          )}
        </div>
      </div>
    ),
    // 상세 탭 / Detail tab
    () => (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Clock className="w-3.5 h-3.5 text-gray-500" />
          <span>{job.workHours || '협의'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Briefcase className="w-3.5 h-3.5 text-gray-500" />
          <span>경력: {job.experienceRequired || '무관'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Layers className="w-3.5 h-3.5 text-gray-500" />
          <span>산업: {job.industry}</span>
        </div>
        {job.matchScore && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-[#2B2D31] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${job.matchScore}%`,
                  backgroundColor: accent.primary,
                }}
              />
            </div>
            <span className="text-[10px] font-bold" style={{ color: accent.primary }}>
              {job.matchScore}% 매칭
            </span>
          </div>
        )}
      </div>
    ),
    // 커뮤니티 탭 / Community tab
    () => (
      <div className="space-y-3">
        {/* Discord 스타일 채널 목록 / Discord-style channel list */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
            <ChevronRight className="w-3 h-3" />
            채용 채널
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 text-gray-300 text-xs">
            <Hash className="w-3.5 h-3.5 text-gray-500" />
            공고-정보
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-gray-400 text-xs cursor-pointer">
            <Volume2 className="w-3.5 h-3.5 text-gray-500" />
            면접-안내
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 text-gray-400 text-xs cursor-pointer">
            <AtSign className="w-3.5 h-3.5 text-gray-500" />
            문의하기
          </div>
        </div>
        {/* 멤버 / Members */}
        <div className="flex items-center justify-between">
          <MemberAvatars count={job.applicantCount} color={accent.primary} />
          <span className="text-[10px] text-gray-500">
            {job.applicantCount}명 지원중
          </span>
        </div>
      </div>
    ),
  ];

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Figma 컴포넌트 프레임(선택 시 테두리) / Figma component frame (selection border) */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none z-10"
        style={{
          border: hovered ? `2px solid ${accent.primary}` : '2px solid transparent',
          boxShadow: hovered ? `0 0 20px ${accent.glow}` : 'none',
        }}
      >
        {hovered && <FrameCornerNodes color={accent.primary} />}
      </div>

      {/* Figma 레이어 이름 표시 / Figma layer name label */}
      <div
        className="absolute -top-5 left-2 text-[9px] font-mono font-medium tracking-wider z-30 transition-all duration-200 flex items-center gap-1"
        style={{
          color: hovered ? accent.primary : 'transparent',
        }}
      >
        <Component className="w-2.5 h-2.5" />
        JobCard/{job.boardType === 'FULL_TIME' ? 'FullTime' : 'PartTime'}
      </div>

      {/* 메인 카드 — Discord 다크 테마 베이스 / Main card — Discord dark theme base */}
      <div
        className="relative bg-[#313338] rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        }}
      >
        {/* 상단 배너 영역 — Figma 그라디언트 / Top banner area — Figma gradient */}
        <div
          className="relative h-16 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${accent.primary}22 0%, ${accent.primary}44 50%, ${accent.primary}11 100%)`,
          }}
        >
          {/* Figma 그리드 패턴 오버레이 / Figma grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(${accent.primary}33 1px, transparent 1px),
                linear-gradient(90deg, ${accent.primary}33 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* 상태 배지 / Status badges */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
            {job.isUrgent && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/90 text-white text-[10px] font-bold backdrop-blur-sm">
                <Zap className="w-3 h-3" />
                긴급
              </span>
            )}
            {job.isFeatured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold backdrop-blur-sm"
                style={{ backgroundColor: `${accent.primary}CC` }}
              >
                <Star className="w-3 h-3" />
                추천
              </span>
            )}
          </div>

          {/* 티어 + D-Day / Tier + D-Day */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {job.tierType === 'PREMIUM' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] font-bold shadow-sm">
                <Sparkles className="w-3 h-3" />
                PREMIUM
              </span>
            )}
            {dDay && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm ${
                  dDay === '마감'
                    ? 'bg-gray-600/80 text-gray-300'
                    : dDay === 'D-Day' || (dDay.startsWith('D-') && parseInt(dDay.slice(2)) <= 3)
                    ? 'bg-red-500/80 text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {dDay}
              </span>
            )}
          </div>

          {/* 드래그 핸들 — Figma 스타일 / Drag handle — Figma style */}
          <div className="absolute bottom-2 right-2.5 opacity-0 group-hover:opacity-40 transition-opacity">
            <GripVertical className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* 회사 정보 영역 — Discord 서버 헤더 스타일 / Company info — Discord server header style */}
        <div className="px-4 pt-3 pb-2.5">
          <div className="flex items-start gap-3">
            {/* 회사 로고 — Discord 서버 아이콘 / Company logo — Discord server icon */}
            <div
              className="relative w-10 h-10 rounded-[14px] flex-shrink-0 overflow-hidden border-[3px] -mt-6 z-10"
              style={{
                borderColor: accent.primary,
                boxShadow: `0 2px 8px ${accent.glow}`,
              }}
            >
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full object-contain bg-white p-0.5"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  const parent = el.parentElement;
                  if (parent) {
                    parent.style.backgroundColor = accent.primary;
                    parent.innerHTML = `<span class="text-white text-sm font-bold flex items-center justify-center w-full h-full">${job.companyInitial}</span>`;
                  }
                }}
              />
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              {/* 회사명 / Company name */}
              <div className="flex items-center gap-1.5">
                <span className="text-white text-sm font-semibold truncate">
                  {job.company}
                </span>
                {job.tierType === 'PREMIUM' && (
                  <Shield
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: accent.primary }}
                  />
                )}
              </div>
              {/* 고용 형태 + 산업 / Employment type + Industry */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${accent.primary}20`,
                    color: accent.primary,
                  }}
                >
                  {job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'}
                </span>
                <span className="text-[10px] text-gray-500">{job.industry}</span>
              </div>
            </div>
          </div>

          {/* 공고 제목 / Job title */}
          <h3 className="text-white text-[13px] font-bold leading-snug mt-2.5 line-clamp-2 group-hover:text-white/90 transition-colors">
            {job.title}
          </h3>
        </div>

        {/* iOS 프로스트 세그먼트 컨트롤 / iOS frosted segment control */}
        <div className="px-4 py-2">
          <SegmentControl
            segments={['개요', '상세', '커뮤니티']}
            active={activeSegment}
            onChange={setActiveSegment}
          />
        </div>

        {/* 세그먼트 콘텐츠 — 슬라이드 트랜지션 / Segment content — slide transition */}
        <div className="px-4 pb-3 min-h-[100px]">
          <div
            className="transition-all duration-300 ease-out"
            key={activeSegment}
            style={{
              animation: 'segmentSlide 300ms ease-out',
            }}
          >
            {segmentContent[activeSegment]()}
          </div>
        </div>

        {/* 하단 푸터 — Discord 채널 바 / Footer — Discord channel bar */}
        <div className="px-4 py-2.5 border-t border-[#3F4147] bg-[#2B2D31] flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {job.applicantCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {job.viewCount.toLocaleString()}
            </span>
            {job.matchScore && (
              <span className="flex items-center gap-1" style={{ color: accent.primary }}>
                <Award className="w-3 h-3" />
                {job.matchScore}%
              </span>
            )}
          </div>
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all duration-300 hover:brightness-110 active:scale-95"
            style={{
              backgroundColor: accent.primary,
              boxShadow: hovered ? `0 2px 12px ${accent.glow}` : 'none',
            }}
          >
            지원하기
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Figma 프레임 크기 표시 (호버 시) / Figma frame dimensions on hover */}
      {hovered && (
        <>
          <div
            className="absolute -right-12 top-1/2 -translate-y-1/2 text-[8px] font-mono transition-opacity duration-200"
            style={{ color: accent.primary }}
          >
            320px
          </div>
          <div
            className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 text-[8px] font-mono transition-opacity duration-200"
            style={{ color: accent.primary }}
          >
            auto
          </div>
        </>
      )}
    </div>
  );
}

// 메인 페이지 / Main page
export default function G097Page() {
  const [viewMode, setViewMode] = useState(0);

  return (
    <div className="min-h-screen bg-[#1E1F22] text-white">
      {/* 세그먼트 슬라이드 애니메이션 / Segment slide animation */}
      <style>{`
        @keyframes segmentSlide {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* 헤더 — Figma 툴바 스타일 / Header — Figma toolbar style */}
      <header className="sticky top-0 z-50 border-b border-[#3F4147] bg-[#2B2D31]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Figma 로고 스타일 / Figma logo style */}
            <div className="flex items-center gap-0.5">
              <div className="w-3 h-3 rounded-tl-full rounded-bl-full" style={{ backgroundColor: figmaColors.red.primary }} />
              <div className="w-3 h-3 rounded-tr-full rounded-br-full" style={{ backgroundColor: figmaColors.purple.primary }} />
              <div className="w-3 h-3 rounded-tl-full rounded-bl-full" style={{ backgroundColor: figmaColors.green.primary }} />
              <div className="w-3 h-3 rounded-tr-full rounded-br-full" style={{ backgroundColor: figmaColors.blue.primary }} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">
                {designInfo.id.toUpperCase()} {designInfo.title}
              </h1>
              <p className="text-[10px] text-gray-500 font-mono">
                Design by {designInfo.author} | Figma + iOS + Discord
              </p>
            </div>
          </div>

          {/* iOS 세그먼트 뷰 전환 / iOS segment view toggle */}
          <div className="hidden sm:block">
            <SegmentControl
              segments={['그리드', '리스트', '프레임']}
              active={viewMode}
              onChange={setViewMode}
            />
          </div>
        </div>
      </header>

      {/* Discord 사이드바 + 콘텐츠 레이아웃 / Discord sidebar + content layout */}
      <div className="flex">
        {/* Discord 서버 사이드바 / Discord server sidebar */}
        <aside className="hidden lg:flex flex-col items-center gap-2 w-[72px] bg-[#1E1F22] border-r border-[#3F4147] py-4 flex-shrink-0 sticky top-[52px] h-[calc(100vh-52px)]">
          {/* 잡차자 서버 아이콘 / JobChaJa server icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:rounded-xl transition-all duration-300 cursor-pointer">
            J
          </div>
          <div className="w-8 h-0.5 rounded-full bg-[#3F4147] my-1" />
          {/* 4색 서버 아이콘 / 4-color server icons */}
          {(['red', 'purple', 'green', 'blue'] as const).map((c, i) => (
            <div
              key={c}
              className="w-12 h-12 rounded-full hover:rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center relative group/icon"
              style={{ backgroundColor: `${figmaColors[c].primary}33` }}
            >
              <Circle
                className="w-5 h-5"
                style={{ color: figmaColors[c].primary }}
              />
              {/* 활성 인디케이터 / Active indicator */}
              {i === 0 && (
                <div
                  className="absolute left-0 w-1 h-5 rounded-r-full -translate-x-[14px]"
                  style={{ backgroundColor: figmaColors[c].primary }}
                />
              )}
            </div>
          ))}
        </aside>

        {/* 메인 콘텐츠 / Main content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Figma 캔버스 정보 바 / Figma canvas info bar */}
          <div className="flex items-center gap-3 mb-6 text-[10px] text-gray-500 font-mono">
            <span className="flex items-center gap-1">
              <Component className="w-3 h-3" />
              JobCards / {designInfo.title}
            </span>
            <span className="text-[#3F4147]">|</span>
            <span>{sampleJobsV2.length} components</span>
            <span className="text-[#3F4147]">|</span>
            <span>Auto Layout</span>
          </div>

          {/* 카드 그리드 / Card grid */}
          <div
            className={`${
              viewMode === 1
                ? 'flex flex-col gap-5 max-w-xl mx-auto'
                : viewMode === 2
                ? 'flex flex-col gap-5 max-w-md mx-auto'
                : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8'
            }`}
          >
            {sampleJobsV2.map((job, index) => (
              <div
                key={job.id}
                style={{
                  animation: `floatIn 400ms ease-out ${index * 80}ms both`,
                }}
              >
                <JobCard job={job} index={index} />
              </div>
            ))}
          </div>

          {/* 하단 Figma 페이지 인디케이터 / Bottom Figma page indicator */}
          <div className="mt-12 flex items-center justify-center gap-2">
            {(['red', 'purple', 'green', 'blue'] as const).map((c, i) => (
              <div
                key={c}
                className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-150"
                style={{
                  backgroundColor: i === 0 ? figmaColors[c].primary : `${figmaColors[c].primary}44`,
                }}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
