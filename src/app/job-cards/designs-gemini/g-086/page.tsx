'use client';

import { useState } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
} from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import {
  Heart,
  Eye,
  Users,
  MapPin,
  Clock,
  Briefcase,
  Star,
  Zap,
  ThumbsUp,
  Layers,
  Sparkles,
  GripVertical,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-086',
  title: 'Behance x Figma x Dribbble',
  description:
    '3대 디자인 플랫폼 융합 — Behance 프로젝트 줌 + Figma 컴포넌트 프레임 + Dribbble 핑크 하트 / Triple design platform fusion with project zoom, component frames, and pink heart animations',
  author: 'Gemini',
  category: 'creative',
  tags: ['behance', 'figma', 'dribbble', 'zoom', 'frame', 'heart', 'portfolio'],
};

// Figma 노드 색상 배열 / Figma node colors (4-color system)
const FIGMA_NODE_COLORS = ['#F24E1E', '#A259FF', '#1ABCFE', '#0ACF83'];

// Behance 블루 배지 색상 / Behance blue appreciation badge color
const BEHANCE_BLUE = '#1769FF';

// Dribbble 핑크 / Dribbble pink
const DRIBBBLE_PINK = '#EA4C89';

// Figma 프레임 노드 컴포넌트 / Figma frame corner node component
function FigmaNode({ color, position }: { color: string; position: string }) {
  const positionClasses: Record<string, string> = {
    'top-left': '-top-1.5 -left-1.5',
    'top-right': '-top-1.5 -right-1.5',
    'bottom-left': '-bottom-1.5 -left-1.5',
    'bottom-right': '-bottom-1.5 -right-1.5',
  };
  return (
    <div
      className={`absolute ${positionClasses[position]} w-3 h-3 rounded-full border-2 border-white z-10 transition-transform duration-300 group-hover:scale-150`}
      style={{ backgroundColor: color }}
    />
  );
}

// Behance 감사 배지 컴포넌트 / Behance appreciation badge
function BehanceBadge({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold"
      style={{ backgroundColor: BEHANCE_BLUE }}
    >
      <ThumbsUp size={10} />
      <span>{count}</span>
    </div>
  );
}

// Dribbble 하트 버튼 컴포넌트 / Dribbble heart button with bounce
function DribbbleHeart({
  liked,
  onToggle,
}: {
  liked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`
        relative flex items-center justify-center w-10 h-10 rounded-full
        transition-all duration-300
        ${liked ? 'scale-110' : 'hover:scale-105'}
      `}
      style={{
        backgroundColor: liked ? DRIBBBLE_PINK : 'rgba(255,255,255,0.9)',
        boxShadow: liked
          ? `0 4px 16px ${DRIBBBLE_PINK}66`
          : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Heart
        size={18}
        className={`transition-all duration-300 ${liked ? 'fill-white text-white animate-bounce' : 'text-gray-400'}`}
      />
      {/* 핑크 리플 이펙트 / Pink ripple effect on like */}
      {liked && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: DRIBBBLE_PINK }}
        />
      )}
    </button>
  );
}

// 잡 카드 컴포넌트 / Job card component
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Figma 컴포넌트 프레임 / Figma component frame with 4-color nodes */}
      <div
        className={`
          relative rounded-2xl overflow-visible
          border-2 transition-all duration-500 ease-out
          ${hovered ? 'border-purple-300 shadow-2xl -translate-y-2' : 'border-gray-200 shadow-md'}
        `}
        style={{
          background: 'white',
          boxShadow: hovered
            ? `0 20px 60px -12px rgba(162, 89, 255, 0.25), 0 0 0 1px rgba(162, 89, 255, 0.1)`
            : '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        {/* Figma 프레임 노드 (4코너) / Figma frame corner nodes */}
        <FigmaNode color={FIGMA_NODE_COLORS[0]} position="top-left" />
        <FigmaNode color={FIGMA_NODE_COLORS[1]} position="top-right" />
        <FigmaNode color={FIGMA_NODE_COLORS[2]} position="bottom-left" />
        <FigmaNode color={FIGMA_NODE_COLORS[3]} position="bottom-right" />

        {/* Figma 프레임 라벨 (호버 시 표시) / Figma frame label on hover */}
        <div
          className={`
            absolute -top-7 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-t-md text-xs font-mono
            transition-all duration-300 z-20
            ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          `}
          style={{ backgroundColor: '#A259FF', color: 'white' }}
        >
          <Layers size={10} />
          <span>JobCard/{job.id}</span>
        </div>

        {/* 포트폴리오 이미지 (Behance 줌 효과) / Portfolio image with Behance zoom */}
        <div className="relative overflow-hidden rounded-t-xl h-44">
          <img
            src={job.industryImage}
            alt={job.industry}
            className={`
              w-full h-full object-cover transition-transform duration-700 ease-out
              ${hovered ? 'scale-110' : 'scale-100'}
            `}
          />

          {/* 이미지 오버레이 그래디언트 / Image overlay gradient */}
          <div
            className={`
              absolute inset-0 transition-opacity duration-500
              ${hovered ? 'opacity-60' : 'opacity-40'}
            `}
            style={{
              background:
                'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)',
            }}
          />

          {/* 상단 배지 행 / Top badge row */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              {job.tierType === 'PREMIUM' && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #A259FF, #F24E1E)',
                  }}
                >
                  <Star size={10} className="fill-white" />
                  PREMIUM
                </span>
              )}
              {job.isUrgent && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                  <Zap size={10} className="fill-white" />
                  URGENT
                </span>
              )}
            </div>

            {/* Dribbble 하트 / Dribbble heart button */}
            <DribbbleHeart liked={liked} onToggle={() => setLiked(!liked)} />
          </div>

          {/* 이미지 하단 Behance 스타일 정보 / Bottom Behance-style project info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
            <div>
              <p className="text-white/80 text-xs font-medium">{job.industry}</p>
              <p className="text-white text-sm font-bold truncate max-w-[200px]">
                {job.company}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BehanceBadge count={job.applicantCount} />
              <div className="flex items-center gap-1 text-white/90 text-xs">
                <Eye size={11} />
                <span>{job.viewCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Behance 줌 아이콘 (호버 시) / Behance zoom icon on hover */}
          <div
            className={`
              absolute inset-0 flex items-center justify-center z-10
              transition-opacity duration-300
              ${hovered ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <ExternalLink size={22} className="text-white" />
            </div>
          </div>
        </div>

        {/* 카드 본문 / Card body */}
        <div className="p-4 space-y-3">
          {/* 직종 + D-Day 행 / Industry + D-Day row */}
          <div className="flex items-center justify-between">
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: '#F0F0FF',
                color: '#6E6EDE',
              }}
            >
              {job.industry}
            </span>
            {dDay && (
              <span
                className={`
                  text-xs font-bold px-2 py-0.5 rounded-full
                  ${dDay === '마감' ? 'bg-gray-100 text-gray-400' : dDay === 'D-Day' ? 'bg-red-50 text-red-600' : dDay === '상시모집' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}
                `}
              >
                {dDay}
              </span>
            )}
          </div>

          {/* 공고 제목 / Job title */}
          <h3
            className={`
              text-[15px] font-bold leading-snug line-clamp-2
              transition-colors duration-300
              ${hovered ? 'text-purple-700' : 'text-gray-900'}
            `}
          >
            {job.title}
          </h3>

          {/* 회사 + 위치 / Company + Location */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Briefcase size={12} className="text-gray-400" />
              <span className="truncate max-w-[120px]">{job.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-gray-400" />
              <span>{job.location}</span>
            </div>
          </div>

          {/* 급여 / Salary */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: '#FAFAFE' }}
          >
            <span className="text-sm font-bold text-gray-900">{salary}</span>
            {job.boardType === 'PART_TIME' && (
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                파트타임
              </span>
            )}
            {job.boardType === 'FULL_TIME' && (
              <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                정규직
              </span>
            )}
          </div>

          {/* 비자 칩 (Figma 스타일 프레임 라인) / Visa chips with Figma style */}
          <div className="flex flex-wrap gap-1.5">
            {job.allowedVisas.map((visa) => {
              const vc = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`
                    inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold
                    border transition-all duration-200
                    ${vc.bg} ${vc.text}
                    ${hovered ? 'border-purple-200 shadow-sm' : 'border-transparent'}
                  `}
                >
                  {visa}
                </span>
              );
            })}
          </div>

          {/* 근무조건 + 경력 / Work hours + Experience */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {job.workHours && (
              <div className="flex items-center gap-1">
                <Clock size={11} />
                <span className="truncate max-w-[140px]">{job.workHours}</span>
              </div>
            )}
            {job.experienceRequired && (
              <div className="flex items-center gap-1">
                <Users size={11} />
                <span>{job.experienceRequired}</span>
              </div>
            )}
          </div>

          {/* 혜택 칩 / Benefits chips */}
          <div className="flex flex-wrap gap-1">
            {job.benefits.slice(0, 3).map((b) => (
              <span
                key={b}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100"
              >
                {b}
              </span>
            ))}
            {job.benefits.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-400">
                +{job.benefits.length - 3}
              </span>
            )}
          </div>

          {/* 하단 액션 바 / Bottom action bar */}
          <div
            className={`
              flex items-center justify-between pt-3 border-t transition-all duration-300
              ${hovered ? 'border-purple-100' : 'border-gray-100'}
            `}
          >
            {/* 매치 스코어 (Behance 스타일) / Match score Behance-style */}
            {job.matchScore && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-8 h-1.5 rounded-full bg-gray-100 overflow-hidden"
                  title={`매치 스코어 ${job.matchScore}%`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${job.matchScore}%`,
                      background: `linear-gradient(90deg, ${BEHANCE_BLUE}, #A259FF)`,
                    }}
                  />
                </div>
                <span className="text-xs font-bold" style={{ color: BEHANCE_BLUE }}>
                  {job.matchScore}%
                </span>
              </div>
            )}

            {/* Dribbble 스타일 상세보기 / Dribbble-style view detail */}
            <div
              className={`
                flex items-center gap-1 text-xs font-medium
                transition-all duration-300
                ${hovered ? 'translate-x-1' : ''}
              `}
              style={{ color: hovered ? DRIBBBLE_PINK : '#9CA3AF' }}
            >
              <span>상세보기</span>
              <ChevronRight
                size={14}
                className={`transition-transform duration-300 ${hovered ? 'translate-x-0.5' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* isFeatured 하단 그래디언트 바 / Featured bottom gradient bar */}
        {job.isFeatured && (
          <div
            className="h-1 rounded-b-2xl"
            style={{
              background: `linear-gradient(90deg, ${FIGMA_NODE_COLORS[0]}, ${FIGMA_NODE_COLORS[1]}, ${FIGMA_NODE_COLORS[2]}, ${FIGMA_NODE_COLORS[3]})`,
            }}
          />
        )}
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G086Page() {
  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background:
          'linear-gradient(160deg, #FAFAFA 0%, #F5F0FF 30%, #FFF0F6 60%, #F0F7FF 100%)',
      }}
    >
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-6xl mx-auto mb-10">
        {/* Figma 스타일 브레드크럼 / Figma-style breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 font-mono">
          <Layers size={12} />
          <span>Designs</span>
          <span>/</span>
          <span className="text-purple-500">{designInfo.id}</span>
          <span>/</span>
          <span className="text-gray-600">JobCards</span>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {designInfo.title}
            </h1>
            <p className="mt-2 text-sm text-gray-500 max-w-xl leading-relaxed">
              {designInfo.description}
            </p>
          </div>

          {/* 3개 플랫폼 뱃지 / Three platform badges */}
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1.5 rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: BEHANCE_BLUE }}
            >
              Behance
            </span>
            <span
              className="px-3 py-1.5 rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: '#A259FF' }}
            >
              Figma
            </span>
            <span
              className="px-3 py-1.5 rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: DRIBBBLE_PINK }}
            >
              Dribbble
            </span>
          </div>
        </div>

        {/* Figma 도구 바 스타일 헤더 바 / Figma toolbar-style header bar */}
        <div
          className="mt-6 flex items-center gap-4 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm"
          style={{ maxWidth: 'fit-content' }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <GripVertical size={14} className="text-gray-300" />
            <span className="font-mono">
              <span className="text-purple-500">Frame</span>{' '}
              <span className="text-gray-400">1920 x auto</span>
            </span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Sparkles size={12} style={{ color: DRIBBBLE_PINK }} />
            <span>{sampleJobsV2.length} components</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Star size={12} style={{ color: '#F5A623' }} className="fill-current" />
            <span>Auto Layout</span>
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleJobsV2.map((job, idx) => (
            <JobCard key={job.id} job={job} index={idx} />
          ))}
        </div>
      </div>

      {/* 푸터 / Footer */}
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <p className="text-xs text-gray-400 font-mono">
          {designInfo.id} / {designInfo.author} / {designInfo.category}
        </p>
      </div>
    </div>
  );
}
