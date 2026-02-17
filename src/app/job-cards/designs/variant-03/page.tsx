'use client';

// Variant 03: Company Logo Focus (원티드 스타일)
// 기업 브랜드 중심 카드 디자인 - 원티드 스타일의 비주얼 중심 레이아웃
// Company brand-focused card design - visual layout inspired by Wanted.co.kr

import { useState } from 'react';
import {
  Building2,
  Heart,
  MapPin,
  Clock,
  Briefcase,
  Crown,
  Flame,
  Shield,
} from 'lucide-react';
import {
  sampleJobs,
  getDDay,
  formatSalary,
  getTimeAgo,
  type MockJobPosting,
} from '../_mock/job-mock-data';

// 업종별 브랜드 컬러 맵 / Industry-based brand color map
const industryColors: Record<string, { bg: string; accent: string; text: string }> = {
  '제조': { bg: 'bg-blue-500', accent: 'bg-blue-600', text: 'text-blue-700' },
  '숙박/음식': { bg: 'bg-orange-400', accent: 'bg-orange-500', text: 'text-orange-700' },
  'IT/소프트웨어': { bg: 'bg-violet-500', accent: 'bg-violet-600', text: 'text-violet-700' },
  '건설': { bg: 'bg-amber-500', accent: 'bg-amber-600', text: 'text-amber-700' },
  '물류/운송': { bg: 'bg-teal-500', accent: 'bg-teal-600', text: 'text-teal-700' },
  '교육': { bg: 'bg-rose-400', accent: 'bg-rose-500', text: 'text-rose-700' },
};

// 기본 컬러 / Default fallback color
const defaultColor = { bg: 'bg-gray-500', accent: 'bg-gray-600', text: 'text-gray-700' };

// 업종 컬러 가져오기 / Get industry color
function getIndustryColor(industry: string) {
  return industryColors[industry] || defaultColor;
}

// 개별 카드 컴포넌트 / Individual card component
function JobCard({ job }: { job: MockJobPosting }) {
  // 북마크(하트) 상태 / Bookmark (heart) toggle state
  const [isLiked, setIsLiked] = useState(false);
  const color = getIndustryColor(job.industry);
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* 컬러 헤더 배경 / Colored header background (brand simulation) */}
      <div className={`relative h-28 ${color.bg} overflow-hidden`}>
        {/* 추상적 패턴 오버레이 / Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full opacity-40" />
        </div>

        {/* 프리미엄/긴급 배지 / Premium & urgent badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {job.tierType === 'PREMIUM' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-sm">
              <Crown className="w-3 h-3" />
              Premium
            </span>
          )}
          {job.isUrgent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">
              <Flame className="w-3 h-3" />
              긴급
            </span>
          )}
        </div>

        {/* D-day 배지 / D-day badge */}
        {dDay && (
          <span className={`absolute top-3 right-3 px-2.5 py-0.5 text-xs font-bold rounded-full shadow-sm ${
            dDay === '마감' ? 'bg-gray-800 text-gray-300' :
            dDay === 'D-Day' ? 'bg-red-600 text-white animate-pulse' :
            dDay === '상시모집' ? 'bg-white/90 text-gray-700' :
            'bg-white/90 text-gray-800'
          }`}>
            {dDay}
          </span>
        )}
      </div>

      {/* 로고 + 본문 영역 / Logo + body area */}
      <div className="relative px-5 pb-5">
        {/* 대형 원형 로고 플레이스홀더 / Large rounded logo placeholder (64x64) */}
        <div className="relative -mt-8 mb-4">
          <div className="w-16 h-16 bg-gray-100 border-4 border-white rounded-2xl shadow-md flex items-center justify-center">
            <Building2 className="w-7 h-7 text-gray-400" />
          </div>
        </div>

        {/* 기업명 / Company name */}
        <p className="text-sm text-gray-500 font-medium mb-1">{job.company}</p>

        {/* 공고 제목 / Job title - generous spacing */}
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {job.title}
        </h3>

        {/* 업종 + 고용형태 태그 / Industry + employment type tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 ${color.text} border border-gray-100`}>
            <Briefcase className="w-3 h-3" />
            {job.industry}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            job.boardType === 'FULL_TIME'
              ? 'bg-blue-50 text-blue-700 border border-blue-100'
              : 'bg-green-50 text-green-700 border border-green-100'
          }`}>
            {job.boardType === 'FULL_TIME' ? '정규직' : '알바/파트타임'}
          </span>
        </div>

        {/* 비자 배지 / Visa badges */}
        <div className="flex items-center gap-1.5 mb-4">
          <Shield className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {job.allowedVisas.map((visa) => (
              <span
                key={visa}
                className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200 font-mono"
              >
                {visa}
              </span>
            ))}
          </div>
        </div>

        {/* 하단 바: 급여 + 위치 + 북마크 / Bottom bar: salary + location + bookmark */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex-1 min-w-0">
            {/* 급여 정보 / Salary info */}
            <p className="text-sm font-bold text-gray-900 truncate">{salary}</p>
            {/* 위치 + 게시일 / Location + posted date */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
            </div>
          </div>

          {/* 북마크 하트 버튼 / Bookmark heart button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex-shrink-0 ml-3 p-2 rounded-full hover:bg-gray-50 transition-colors"
            aria-label={isLiked ? '북마크 해제' : '북마크 추가'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-gray-300 group-hover:text-gray-400'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant03Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
              Variant 03
            </span>
            <span className="text-gray-400 text-sm">|</span>
            <span className="text-gray-500 text-sm">원티드 스타일 / Wanted.co.kr Style</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Company Logo Focus
          </h1>
          <p className="text-gray-500 text-base max-w-2xl">
            기업 브랜드 컬러 헤더 + 대형 로고 + 여백 중심의 비주얼 카드 디자인.
            업종별 자동 컬러 매핑으로 시각적 구분감을 높입니다.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Large colored header with brand color simulation. Big company logo, generous white space, and tag-based information hierarchy.
          </p>
        </div>

        {/* 반응형 그리드 / Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* 디자인 노트 / Design notes */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Design Notes</h2>
          <ul className="space-y-1.5 text-sm text-gray-500">
            <li>- 업종별 자동 브랜드 컬러 헤더 (제조=파랑, IT=보라, 교육=로즈 등)</li>
            <li>- 64x64 대형 라운드 로고 (회색 플레이스홀더 + Building2 아이콘)</li>
            <li>- 제목 아래 넉넉한 여백, 업종/고용형태 태그</li>
            <li>- 하단 급여 + 하트(북마크) 아이콘 인터랙션</li>
            <li>- 호버 시 카드 부상 + 그림자 확대 + 제목 파란색 변경</li>
            <li>- Industry auto-color header, 64x64 logo placeholder</li>
            <li>- Tag-based info hierarchy, heart bookmark interaction</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
