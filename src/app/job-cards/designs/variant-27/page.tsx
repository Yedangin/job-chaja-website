'use client';

// 시안 27: 오버레이 액션 카드 (호버 공개) / Variant 27: Overlay Action Card (Hover Reveal)
// 넷플릭스/스트리밍 서비스 스타일 — 기본 정보 표시 후 호버 시 다크 오버레이 슬라이드 업
// Netflix/streaming service style — basic info shown, dark overlay slides up on hover

import { useState } from 'react';
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
  ChevronRight,
  Zap,
  Building2,
  DollarSign,
  Award,
  Heart,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

// 비자 매칭 점수 색상 반환 / Return visa match score color
function getScoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
}

// 비자 매칭 점수 배경 색상 반환 / Return visa match score background color
function getScoreBgColor(score: number): string {
  if (score >= 85) return 'bg-emerald-500/20';
  if (score >= 70) return 'bg-amber-500/20';
  return 'bg-red-500/20';
}

// 비자 매칭 점수 등급 텍스트 / Visa match score grade text
function getScoreGrade(score: number): string {
  if (score >= 90) return '최적 매칭';
  if (score >= 80) return '높은 적합도';
  if (score >= 70) return '보통';
  return '낮은 적합도';
}

// 개별 잡 카드 컴포넌트 / Individual job card component
function JobCard({ job }: { job: MockJobPosting }) {
  const [isHovered, setIsHovered] = useState(false);
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
      style={{ aspectRatio: '3 / 4' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 프리미엄 글로우 효과 / Premium glow effect on hover */}
      {isPremium && (
        <div
          className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            boxShadow: '0 0 30px rgba(234, 179, 8, 0.4), 0 0 60px rgba(234, 179, 8, 0.2)',
          }}
        />
      )}

      {/* === 기본 카드 콘텐츠 (항상 보임) / Normal card content (always visible) === */}
      <div className="relative h-full flex flex-col p-5">
        {/* 상단 배지 영역 / Top badge area */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* 프리미엄 배지 / Premium badge */}
            {isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                <Crown className="h-3 w-3" />
                PREMIUM
              </span>
            )}
            {/* 긴급 채용 배지 / Urgent hiring badge */}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white animate-pulse">
                <Zap className="h-3 w-3" />
                긴급
              </span>
            )}
          </div>
          {/* D-Day 표시 / D-Day display */}
          {dDay && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                dDay === '마감'
                  ? 'bg-gray-100 text-gray-400'
                  : dDay === 'D-Day'
                    ? 'bg-red-100 text-red-600'
                    : dDay === '상시모집'
                      ? 'bg-blue-50 text-blue-500'
                      : 'bg-orange-50 text-orange-600'
              }`}
            >
              {dDay}
            </span>
          )}
        </div>

        {/* 회사 아이콘 영역 / Company icon area */}
        <div className="mb-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md ${
              isPremium
                ? 'bg-gradient-to-br from-amber-400 to-yellow-600'
                : 'bg-gradient-to-br from-blue-400 to-indigo-600'
            }`}
          >
            <Building2 className="h-7 w-7" />
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2">
          {job.title}
        </h3>

        {/* 회사명 / Company name */}
        <p className="text-sm text-gray-500 mb-3">{job.company}</p>

        {/* 급여 정보 / Salary info */}
        <div className="flex items-center gap-1.5 mb-3">
          <DollarSign className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-semibold text-emerald-600">{salary}</span>
        </div>

        {/* 하단 고정 영역 / Bottom fixed area */}
        <div className="mt-auto">
          {/* 위치, 시간 / Location, time */}
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo}
            </span>
          </div>

          {/* 비자 개수 배지 / Visa count badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-indigo-50 rounded-full px-3 py-1.5">
              <Shield className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600">
                비자 {job.allowedVisas.length}개 호환
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Users className="h-3.5 w-3.5" />
              {job.applicantCount}
            </div>
          </div>
        </div>
      </div>

      {/* === 호버 오버레이 (아래에서 슬라이드 업) / Hover overlay (slides up from bottom) === */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/85 flex flex-col justify-end p-5 transition-all duration-300 ease-out ${
          isHovered
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        }`}
      >
        {/* 매칭 점수 (상단) / Match score (top) */}
        {job.matchScore !== undefined && (
          <div className="absolute top-4 right-4">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${getScoreBgColor(job.matchScore)}`}
            >
              <Award className={`h-4 w-4 ${getScoreColor(job.matchScore)}`} />
              <span className={`text-sm font-bold ${getScoreColor(job.matchScore)}`}>
                {job.matchScore}%
              </span>
            </div>
            <p className={`text-[10px] text-center mt-1 ${getScoreColor(job.matchScore)}`}>
              {getScoreGrade(job.matchScore)}
            </p>
          </div>
        )}

        {/* 프리미엄 글로우 배지 / Premium glow badge on overlay */}
        {isPremium && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-yellow-500/30">
              <Crown className="h-3.5 w-3.5" />
              PREMIUM
            </span>
          </div>
        )}

        {/* 오버레이 콘텐츠 / Overlay content */}
        <div className="space-y-4">
          {/* 공고 제목 + 회사명 / Job title + company name */}
          <div>
            <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-1">
              {job.title}
            </h3>
            <p className="text-gray-400 text-sm">{job.company}</p>
          </div>

          {/* 비자 상세 목록 / Visa detail list */}
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">
              호환 비자 / Compatible Visas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {job.allowedVisas.map((visa) => (
                <span
                  key={visa}
                  className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm border border-white/10"
                >
                  <Shield className="h-3 w-3 mr-1 text-indigo-400" />
                  {visa}
                </span>
              ))}
            </div>
          </div>

          {/* 복리후생 목록 / Benefits list */}
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1.5 font-semibold">
              복리후생 / Benefits
            </p>
            <div className="flex flex-wrap gap-1.5">
              {job.benefits.slice(0, 4).map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center gap-1 text-xs text-gray-300"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* 상세 정보 행 / Detail info rows */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Briefcase className="h-3.5 w-3.5 text-gray-500" />
              <span>{job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="h-3.5 w-3.5 text-gray-500" />
              <span>{job.location}</span>
            </div>
            {job.workHours && (
              <div className="flex items-center gap-1.5 text-gray-400">
                <Clock className="h-3.5 w-3.5 text-gray-500" />
                <span className="truncate">{job.workHours}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-gray-400">
              <Eye className="h-3.5 w-3.5 text-gray-500" />
              <span>{job.viewCount.toLocaleString()}회</span>
            </div>
          </div>

          {/* 급여 (오버레이) / Salary on overlay */}
          <div className="flex items-center gap-1.5 bg-emerald-500/15 rounded-lg px-3 py-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{salary}</span>
          </div>

          {/* 액션 버튼 영역 / Action buttons area */}
          <div className="flex items-center gap-2 pt-1">
            {/* 지원하기 버튼 / Apply button */}
            <button
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 active:scale-95 ${
                isPremium
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 shadow-lg shadow-yellow-500/25'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 shadow-lg shadow-indigo-500/25'
              }`}
            >
              <ExternalLink className="h-4 w-4" />
              지원하기
            </button>
            {/* 북마크 버튼 / Bookmark button */}
            <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200 active:scale-95">
              <Heart className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* 상세보기 링크 / View details link */}
          <button className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors w-full">
            상세보기
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 추천 배지 / Featured badge */}
      {job.isFeatured && (
        <div className="absolute top-0 left-0 z-20">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg rounded-tl-2xl shadow-md">
            <Star className="h-3 w-3 inline mr-0.5 -mt-0.5" />
            추천
          </div>
        </div>
      )}
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function Variant27Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            시안 27 — Overlay Action Card
          </h1>
        </div>
        <p className="text-gray-500 text-sm sm:text-base ml-[52px]">
          카드에 호버 시 다크 오버레이가 아래에서 슬라이드 업되며 상세 정보와 액션 버튼 노출 /
          Dark overlay slides up from bottom on hover revealing actions and details
        </p>
        <p className="text-gray-400 text-xs ml-[52px] mt-1">
          * 데스크톱에서 카드 위에 마우스를 올려보세요 / Hover over cards on desktop to see the effect
        </p>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
