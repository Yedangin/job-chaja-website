'use client';

// 변형 22: 공장 / 산업 스타일 디자인
// Variant 22: Factory / Industrial Style Design
// 노란-검정 안전 줄무늬, 스텐실 타이포, 금속판 느낌
// Yellow-black safety stripes, stencil typography, metal plate feel

import {
  Wrench,
  Clock,
  Users,
  Briefcase,
  Star,
  AlertTriangle,
  Shield,
  ChevronRight,
  Eye,
  Cog,
  HardHat,
  Zap,
} from 'lucide-react';
import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';

// 지원자 쿼터 진행률 계산 / Calculate applicant quota progress
function getQuotaProgress(applicantCount: number): { current: number; max: number; percent: number } {
  // 모집 정원 시뮬레이션 (공고별 가상 정원) / Simulated quota per job
  const maxQuota = applicantCount < 30 ? 50 : applicantCount < 70 ? 100 : 200;
  const percent = Math.min(Math.round((applicantCount / maxQuota) * 100), 100);
  return { current: applicantCount, max: maxQuota, percent };
}

// 진행바 색상 / Progress bar color
function getProgressColor(percent: number): string {
  if (percent >= 80) return 'bg-red-500';
  if (percent >= 50) return 'bg-yellow-500';
  return 'bg-emerald-500';
}

// D-day 스탬프 스타일 / D-day stamp style
function getDDayStampColor(dday: string | null): string {
  if (!dday || dday === '상시모집') return 'text-emerald-700 border-emerald-700';
  if (dday === '마감') return 'text-gray-500 border-gray-500';
  if (dday === 'D-Day') return 'text-red-700 border-red-700';
  const num = parseInt(dday.replace('D-', ''));
  if (num <= 3) return 'text-red-700 border-red-700';
  if (num <= 7) return 'text-orange-700 border-orange-700';
  return 'text-blue-700 border-blue-700';
}

// 안전 줄무늬 패턴 (SVG 인라인) / Safety stripe pattern (inline SVG)
function SafetyStripe({ className }: { className?: string }) {
  return (
    <div className={`h-3 w-full overflow-hidden ${className || ''}`}>
      <div
        className="w-full h-full"
        style={{
          background: 'repeating-linear-gradient(45deg, #000 0px, #000 8px, #facc15 8px, #facc15 16px)',
        }}
      />
    </div>
  );
}

// 주의 테이프 배너 (긴급 공고용) / Caution tape banner (for urgent jobs)
function CautionTape() {
  return (
    <div className="absolute -top-1 -left-1 -right-1 h-6 overflow-hidden z-10">
      <div
        className="w-[200%] h-full"
        style={{
          background: 'repeating-linear-gradient(45deg, #facc15 0px, #facc15 10px, #000 10px, #000 20px)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[9px] font-black text-black bg-yellow-400 px-3 py-0.5 tracking-[0.2em] uppercase">
          ⚠ URGENT HIRING ⚠
        </span>
      </div>
    </div>
  );
}

// HIRING 스탬프 오버레이 / HIRING stamp overlay
function HiringStamp() {
  return (
    <div className="absolute top-6 right-3 z-10 pointer-events-none">
      <div className="transform rotate-[-15deg]">
        <div className="border-[3px] border-red-600 rounded-md px-3 py-1 bg-white/80">
          <span className="text-red-600 font-black text-lg tracking-[0.15em] uppercase" style={{ fontFamily: 'monospace' }}>
            HIRING
          </span>
        </div>
      </div>
    </div>
  );
}

// 금속판 볼트 장식 / Metal plate bolt decoration
function MetalBolt({ position }: { position: string }) {
  return (
    <div className={`absolute ${position} w-3.5 h-3.5 z-20`}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 border border-gray-500 shadow-inner flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-gray-600 rounded-full transform rotate-45" />
      </div>
    </div>
  );
}

// 산업 스타일 카드 컴포넌트 / Industrial style card component
function IndustrialCard({ job }: { job: MockJobPosting }) {
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const quota = getQuotaProgress(job.applicantCount);
  const progressColor = getProgressColor(quota.percent);

  return (
    <div className="relative group">
      {/* 긴급 공고: 주의 테이프 / Urgent jobs: caution tape */}
      {job.isUrgent && <CautionTape />}

      {/* 메인 카드 - 금속판 느낌 / Main card - metal plate feel */}
      <div className={`relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5 ${job.isUrgent ? 'mt-2' : ''}`}
        style={{
          border: '3px solid transparent',
          borderImage: 'linear-gradient(135deg, #9ca3af 0%, #d1d5db 30%, #6b7280 60%, #9ca3af 100%) 1',
        }}
      >
        {/* 볼트 장식 / Bolt decorations */}
        <MetalBolt position="top-1.5 left-1.5" />
        <MetalBolt position="top-1.5 right-1.5" />
        <MetalBolt position="bottom-1.5 left-1.5" />
        <MetalBolt position="bottom-1.5 right-1.5" />

        {/* HIRING 스탬프 (프리미엄 또는 추천 공고) / HIRING stamp (premium or featured) */}
        {(job.tierType === 'PREMIUM' || job.isFeatured) && <HiringStamp />}

        {/* 상단 안전 줄무늬 / Top safety stripe */}
        <SafetyStripe />

        {/* 카드 헤더 - 공장 게시판 스타일 / Card header - factory bulletin board style */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 산업 아이콘 / Industry icon */}
            <div className="w-8 h-8 rounded bg-yellow-400 flex items-center justify-center">
              {job.industry === '제조' && <Cog className="w-5 h-5 text-gray-900" />}
              {job.industry === '건설' && <HardHat className="w-5 h-5 text-gray-900" />}
              {job.industry === 'IT/소프트웨어' && <Zap className="w-5 h-5 text-gray-900" />}
              {job.industry === '숙박/음식' && <Briefcase className="w-5 h-5 text-gray-900" />}
              {job.industry === '물류/운송' && <Wrench className="w-5 h-5 text-gray-900" />}
              {job.industry === '교육' && <Shield className="w-5 h-5 text-gray-900" />}
            </div>
            <div>
              {/* 회사명 - 스텐실 폰트 느낌 / Company name - stencil font feel */}
              <p className="text-yellow-400 text-xs font-black tracking-wider uppercase" style={{ fontFamily: 'monospace' }}>
                {job.company}
              </p>
              <p className="text-gray-400 text-[10px]">{job.industry}</p>
            </div>
          </div>

          {/* 고용 형태 배지 / Employment type badge */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            job.boardType === 'FULL_TIME'
              ? 'bg-emerald-500 text-white'
              : 'bg-yellow-400 text-gray-900'
          }`} style={{ fontFamily: 'monospace' }}>
            {job.boardType === 'FULL_TIME' ? 'FULL-TIME' : 'PART-TIME'}
          </span>
        </div>

        {/* 메인 콘텐츠 영역 / Main content area */}
        <div className="px-4 py-4">
          {/* 공고 제목 - 스텐실 스타일 굵은 타이포 / Job title - stencil style bold typography */}
          <h3 className="text-base font-black text-gray-900 mb-3 leading-snug line-clamp-2 tracking-tight" style={{ fontFamily: 'monospace' }}>
            {job.title}
          </h3>

          {/* 급여 패널 / Salary panel */}
          <div className="bg-gray-900 rounded-md px-3 py-2.5 mb-3 flex items-center justify-between">
            <span className="text-yellow-400 text-sm font-black tracking-wide" style={{ fontFamily: 'monospace' }}>
              {salary}
            </span>
            {job.experienceRequired && (
              <span className="text-gray-400 text-[10px] font-medium">
                경력: {job.experienceRequired}
              </span>
            )}
          </div>

          {/* 근무 정보 / Work info */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white/60 rounded px-2 py-1.5 border border-gray-300">
              <MapPinIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="truncate">{job.location}</span>
            </div>
            {job.workHours && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white/60 rounded px-2 py-1.5 border border-gray-300">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="truncate">{job.workHours}</span>
              </div>
            )}
          </div>

          {/* 비자 배지 - 금속 태그 스타일 / Visa badges - metal tag style */}
          <div className="flex flex-wrap gap-1 mb-3">
            {job.allowedVisas.map((visa) => (
              <span
                key={visa}
                className="px-2 py-0.5 text-[10px] font-bold text-gray-700 bg-gradient-to-b from-gray-200 to-gray-300 rounded border border-gray-400 shadow-sm"
                style={{ fontFamily: 'monospace' }}
              >
                {visa}
              </span>
            ))}
          </div>

          {/* 복리후생 / Benefits */}
          <div className="flex flex-wrap gap-1 mb-3">
            {job.benefits.slice(0, 3).map((benefit) => (
              <span
                key={benefit}
                className="text-[10px] text-gray-500 bg-white rounded px-1.5 py-0.5 border border-dashed border-gray-300"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 3 && (
              <span className="text-[10px] text-gray-400">+{job.benefits.length - 3}</span>
            )}
          </div>

          {/* 지원자 쿼터 진행 바 / Applicant quota progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'monospace' }}>
                지원 현황 / APPLICANTS
              </span>
              <span className="text-[10px] font-bold text-gray-700" style={{ fontFamily: 'monospace' }}>
                {quota.current}/{quota.max}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden border border-gray-400">
              <div
                className={`h-full ${progressColor} rounded-full transition-all duration-500 relative`}
                style={{ width: `${quota.percent}%` }}
              >
                {/* 진행바 내부 줄무늬 / Progress bar inner stripes */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)',
                  }}
                />
              </div>
            </div>
            {quota.percent >= 80 && (
              <p className="text-[9px] text-red-600 font-bold mt-0.5 flex items-center gap-1" style={{ fontFamily: 'monospace' }}>
                <AlertTriangle className="w-3 h-3" />
                마감 임박 / ALMOST FULL
              </p>
            )}
          </div>

          {/* 하단 메타 + D-day 스탬프 / Bottom meta + D-day stamp */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-gray-300">
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {job.viewCount.toLocaleString()}
              </span>
              <span>{timeAgo}</span>
            </div>

            {/* D-day 스탬프 (도장 스타일) / D-day stamp (seal style) */}
            <div className={`border-2 ${getDDayStampColor(dday)} rounded-sm px-2 py-0.5 transform rotate-[-3deg]`}>
              <span className="text-[11px] font-black tracking-wider" style={{ fontFamily: 'monospace' }}>
                {dday}
              </span>
            </div>
          </div>

          {/* 상태 배지 / Status badges */}
          <div className="flex items-center gap-1.5 mt-2">
            {job.tierType === 'PREMIUM' && (
              <span className="flex items-center gap-0.5 text-[10px] font-black text-yellow-900 bg-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500" style={{ fontFamily: 'monospace' }}>
                <Star className="w-3 h-3 fill-yellow-900" />
                PREMIUM
              </span>
            )}
            {job.isUrgent && (
              <span className="flex items-center gap-0.5 text-[10px] font-black text-white bg-red-600 px-1.5 py-0.5 rounded" style={{ fontFamily: 'monospace' }}>
                <AlertTriangle className="w-3 h-3" />
                URGENT
              </span>
            )}
            {job.isFeatured && (
              <span className="flex items-center gap-0.5 text-[10px] font-black text-gray-900 bg-gray-300 px-1.5 py-0.5 rounded border border-gray-400" style={{ fontFamily: 'monospace' }}>
                <Shield className="w-3 h-3" />
                FEATURED
              </span>
            )}
          </div>
        </div>

        {/* 하단 안전 줄무늬 / Bottom safety stripe */}
        <SafetyStripe />

        {/* 상세보기 버튼 - 산업 스타일 / View details button - industrial style */}
        <button className="w-full py-2.5 bg-gray-900 text-yellow-400 text-xs font-black flex items-center justify-center gap-1 hover:bg-gray-800 transition-colors tracking-wider uppercase" style={{ fontFamily: 'monospace' }}>
          <Wrench className="w-3.5 h-3.5" />
          상세보기 / VIEW DETAILS
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// 위치 핀 아이콘 (lucide-react MapPin 대체 이름 충돌 방지)
// Location pin icon (avoid name conflict with lucide-react MapPin)
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function Variant22Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300">
      {/* 상단 안전 줄무늬 / Top safety stripe */}
      <div className="h-4 w-full" style={{
        background: 'repeating-linear-gradient(45deg, #000 0px, #000 10px, #facc15 10px, #facc15 20px)',
      }} />

      {/* 페이지 헤더 / Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 타이틀 - 산업 게시판 헤더 / Title - industrial bulletin board header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-gray-900 rounded-lg px-6 py-3 shadow-xl mb-4 border-2 border-gray-600">
            <Cog className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '8s' }} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-yellow-400 tracking-wider uppercase" style={{ fontFamily: 'monospace' }}>
                채용 게시판
              </h1>
              <p className="text-[10px] text-gray-400 tracking-widest" style={{ fontFamily: 'monospace' }}>
                JOB POSTING BULLETIN BOARD
              </p>
            </div>
            <Cog className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
          </div>

          {/* 통계 바 / Stats bar */}
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-white/60 rounded border border-gray-400 px-3 py-1.5">
              <Briefcase className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-bold text-gray-700" style={{ fontFamily: 'monospace' }}>
                전체 {sampleJobs.length}건
              </span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 rounded border border-red-300 px-3 py-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-700" style={{ fontFamily: 'monospace' }}>
                긴급 {sampleJobs.filter((j) => j.isUrgent).length}건
              </span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 rounded border border-yellow-400 px-3 py-1.5">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-bold text-yellow-700" style={{ fontFamily: 'monospace' }}>
                프리미엄 {sampleJobs.filter((j) => j.tierType === 'PREMIUM').length}건
              </span>
            </div>
          </div>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobs.map((job) => (
            <IndustrialCard key={job.id} job={job} />
          ))}
        </div>

        {/* 하단 안내 / Bottom notice */}
        <div className="text-center mt-10 pb-4">
          <div className="inline-flex items-center gap-2 bg-yellow-100 border-2 border-yellow-400 rounded px-4 py-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-800" style={{ fontFamily: 'monospace' }}>
              안전한 채용, 합법적인 고용 / SAFE HIRING, LEGAL EMPLOYMENT
            </span>
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* 하단 안전 줄무늬 / Bottom safety stripe */}
      <div className="h-4 w-full" style={{
        background: 'repeating-linear-gradient(45deg, #000 0px, #000 10px, #facc15 10px, #facc15 20px)',
      }} />
    </div>
  );
}
