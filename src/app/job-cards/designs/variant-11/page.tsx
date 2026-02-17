'use client';

// 시안 11: 글래스모피즘 카드 / Variant 11: Glassmorphism Card
// 반투명 유리 효과, backdrop-blur, 그라데이션 메쉬 배경
// Frosted glass effect, backdrop-blur, gradient mesh background

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Crown,
  Zap,
  Star,
  Briefcase,
  DollarSign,
  CalendarDays,
  Gift,
  Shield,
} from 'lucide-react';

// D-day 텍스트 색상 결정 / Determine D-day text color
function getDDayColor(dday: string | null): string {
  if (!dday) return 'text-white/60';
  if (dday === '마감') return 'text-red-300';
  if (dday === 'D-Day' || dday === 'D-1' || dday === 'D-2' || dday === 'D-3')
    return 'text-red-300 font-bold';
  if (dday === '상시모집') return 'text-emerald-300';
  return 'text-white/80';
}

// 비자 배지 색상 / Visa badge color based on visa type prefix
function getVisaBadgeStyle(visa: string): string {
  if (visa.startsWith('E-7')) return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
  if (visa.startsWith('E-9')) return 'bg-orange-500/20 text-orange-200 border-orange-400/30';
  if (visa.startsWith('E-2')) return 'bg-purple-500/20 text-purple-200 border-purple-400/30';
  if (visa.startsWith('H-2')) return 'bg-teal-500/20 text-teal-200 border-teal-400/30';
  if (visa.startsWith('F-')) return 'bg-green-500/20 text-green-200 border-green-400/30';
  return 'bg-white/10 text-white/70 border-white/20';
}

// 매칭 점수 색상 / Match score color gradient
function getMatchScoreColor(score: number): string {
  if (score >= 90) return 'from-emerald-400 to-cyan-400';
  if (score >= 75) return 'from-blue-400 to-indigo-400';
  if (score >= 60) return 'from-amber-400 to-orange-400';
  return 'from-red-400 to-pink-400';
}

// 글래스모피즘 채용공고 카드 / Glassmorphism job card component
function GlassJobCard({ job }: { job: MockJobPosting }) {
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div className="group relative">
      {/* 프리미엄 무지개 테두리 / Premium iridescent glass border */}
      {isPremium && (
        <div
          className="absolute -inset-[2px] rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd, #ff6b6b)',
            backgroundSize: '400% 400%',
            animation: 'iridescent 6s ease infinite',
          }}
        />
      )}

      {/* 카드 본체 / Card body */}
      <div
        className={`relative rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl ${
          isPremium
            ? 'bg-white/[0.12] backdrop-blur-xl border border-white/20 shadow-lg shadow-purple-500/10'
            : 'bg-white/[0.08] backdrop-blur-lg border border-white/10 shadow-lg shadow-black/10 hover:bg-white/[0.12] hover:border-white/20'
        }`}
      >
        {/* 상단 배지 영역 / Top badge area */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* 프리미엄 배지 / Premium badge */}
            {isPremium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 text-xs font-semibold border border-amber-400/30 backdrop-blur-sm">
                <Crown className="w-3 h-3" />
                PREMIUM
              </span>
            )}

            {/* 긴급 배지 / Urgent badge */}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/20 text-red-200 text-xs font-semibold border border-red-400/30 animate-pulse">
                <Zap className="w-3 h-3" />
                긴급
              </span>
            )}

            {/* 추천 배지 / Featured badge */}
            {job.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
                <Star className="w-3 h-3" />
                추천
              </span>
            )}
          </div>

          {/* D-day 표시 / D-day display */}
          <span
            className={`text-sm font-mono font-semibold ${getDDayColor(dday)}`}
          >
            {dday}
          </span>
        </div>

        {/* 기업명 / Company name */}
        <p className="text-white/50 text-sm mb-1 truncate">{job.company}</p>

        {/* 공고 제목 / Job title */}
        <h3 className="text-white font-bold text-lg leading-snug mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
          {job.title}
        </h3>

        {/* 매칭 점수 바 / Match score bar */}
        {job.matchScore !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/40 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                비자 매칭
              </span>
              <span className="text-xs font-bold text-white/80">
                {job.matchScore}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getMatchScoreColor(job.matchScore)} transition-all duration-700`}
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
          </div>
        )}

        {/* 핵심 정보 영역 / Key info area */}
        <div className="space-y-2 mb-4">
          {/* 급여 / Salary */}
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-emerald-300/70 flex-shrink-0" />
            <span className="text-emerald-200 font-semibold">{salary}</span>
          </div>

          {/* 위치 / Location */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-white/40 flex-shrink-0" />
            <span className="text-white/60">{job.location}</span>
          </div>

          {/* 근무시간 / Work hours */}
          {job.workHours && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-white/40 flex-shrink-0" />
              <span className="text-white/60">{job.workHours}</span>
            </div>
          )}

          {/* 경력 / Experience */}
          {job.experienceRequired && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-white/40 flex-shrink-0" />
              <span className="text-white/60">
                경력 {job.experienceRequired}
              </span>
            </div>
          )}
        </div>

        {/* 비자 배지 / Visa badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.allowedVisas.map((visa) => (
            <span
              key={visa}
              className={`px-2 py-0.5 rounded-md text-xs font-medium border backdrop-blur-sm ${getVisaBadgeStyle(visa)}`}
            >
              {visa}
            </span>
          ))}
        </div>

        {/* 복리후생 / Benefits */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.benefits.slice(0, 4).map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-white/50 text-xs border border-white/5"
            >
              <Gift className="w-3 h-3" />
              {benefit}
            </span>
          ))}
          {job.benefits.length > 4 && (
            <span className="text-xs text-white/30 self-center">
              +{job.benefits.length - 4}
            </span>
          )}
        </div>

        {/* 하단 메타 정보 / Bottom meta info */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              지원 {job.applicantCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              조회 {job.viewCount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-white/30">
              <CalendarDays className="w-3 h-3" />
              {timeAgo}
            </span>
            {/* 고용형태 배지 / Employment type badge */}
            <span
              className={`text-xs px-2 py-0.5 rounded-md ${
                job.boardType === 'FULL_TIME'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/20'
                  : 'bg-violet-500/15 text-violet-300 border border-violet-400/20'
              }`}
            >
              {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 / Main page component
export default function Variant11Page() {
  return (
    <>
      {/* 무지개 키프레임 스타일 주입 / Inject iridescent keyframe animation */}
      <style jsx global>{`
        @keyframes iridescent {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      {/* 그라데이션 메쉬 배경 / Gradient mesh background */}
      <div className="min-h-screen relative overflow-hidden">
        {/* 메쉬 그라데이션 레이어 / Mesh gradient layers */}
        <div className="fixed inset-0 -z-10">
          {/* 기본 어두운 배경 / Base dark background */}
          <div className="absolute inset-0 bg-[#0a0a1a]" />

          {/* 메쉬 블롭 1: 보라색 / Mesh blob 1: Purple */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px]" />

          {/* 메쉬 블롭 2: 시안 / Mesh blob 2: Cyan */}
          <div className="absolute top-[30%] right-[-15%] w-[50%] h-[50%] rounded-full bg-cyan-500/15 blur-[120px]" />

          {/* 메쉬 블롭 3: 핑크 / Mesh blob 3: Pink */}
          <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-pink-500/15 blur-[120px]" />

          {/* 메쉬 블롭 4: 파란색 / Mesh blob 4: Blue */}
          <div className="absolute top-[60%] left-[-5%] w-[35%] h-[35%] rounded-full bg-blue-600/10 blur-[100px]" />

          {/* 노이즈 오버레이 / Noise overlay for texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* 페이지 컨텐츠 / Page content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 페이지 타이틀 / Page title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                시안 11 — 글래스모피즘 카드
              </span>
            </h1>
            <p className="text-white/40 text-lg">
              Variant 11 — Glassmorphism Card Design
            </p>
          </div>

          {/* 카드 그리드: 1열 모바일 / 2열 md / 3열 lg */}
          {/* Card grid: 1col mobile / 2col md / 3col lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleJobs.map((job) => (
              <GlassJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
