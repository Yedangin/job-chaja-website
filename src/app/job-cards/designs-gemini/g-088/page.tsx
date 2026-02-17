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
  Zap,
  Users,
  Eye,
  MapPin,
  Clock,
  Briefcase,
  Star,
  ChevronRight,
  Layers,
  TrendingUp,
  Shield,
  Package,
  Cpu,
  Code2,
  Rocket,
  Award,
} from 'lucide-react';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-088',
  title: '크몽×AngelList×점핏 (Kmong×AngelList×Jumpit)',
  description:
    '프리랜서+스타트업+개발자 기술 매칭 서비스 — 패키지 가격 티어, 네온 글로우, 기술 스택 배지 복합 / Freelancer+Startup+Dev tech matching — package pricing tiers, neon glow, tech stack badges',
  author: 'Gemini',
  category: 'unique',
  references: ['Kmong', 'AngelList', 'Jumpit'],
};

// 패키지 티어 매핑 (크몽 스타일) / Package tier mapping (Kmong style)
function getPackageTier(job: MockJobPostingV2): {
  label: string;
  labelEn: string;
  color: string;
  glowColor: string;
  borderColor: string;
  features: string[];
} {
  if (job.tierType === 'PREMIUM' && job.isFeatured) {
    return {
      label: 'Enterprise',
      labelEn: 'Enterprise',
      color: 'from-purple-500 to-pink-500',
      glowColor: 'shadow-purple-500/40',
      borderColor: 'border-purple-500/50',
      features: ['전담 매니저', '비자 풀서포트', '우선 매칭'],
    };
  }
  if (job.tierType === 'PREMIUM') {
    return {
      label: 'Standard',
      labelEn: 'Standard',
      color: 'from-cyan-400 to-blue-500',
      glowColor: 'shadow-cyan-400/30',
      borderColor: 'border-cyan-400/40',
      features: ['비자 가이드', '우선 노출'],
    };
  }
  return {
    label: 'Basic',
    labelEn: 'Basic',
    color: 'from-emerald-400 to-teal-500',
    glowColor: 'shadow-emerald-400/20',
    borderColor: 'border-emerald-400/30',
    features: ['기본 매칭'],
  };
}

// 기술 스택 추출 (점핏 스타일) / Tech stack extraction (Jumpit style)
function getTechStacks(job: MockJobPostingV2): string[] {
  const industryStacks: Record<string, string[]> = {
    'IT/소프트웨어': ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    '제조': ['PLC', 'AutoCAD', 'SAP', 'IoT', 'QC'],
    '건설': ['BIM', 'AutoCAD', 'Safety', 'PM', 'QA'],
    '숙박/음식': ['POS', 'HACCP', 'CRM', 'Delivery'],
    '물류/운송': ['WMS', 'TMS', 'RFID', 'ERP', 'SCM'],
  };
  return industryStacks[job.industry] || ['General', 'Skill'];
}

// 스택 색상 / Stack badge neon colors
function getStackColor(idx: number): string {
  const colors = [
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'bg-pink-500/20 text-pink-300 border-pink-500/40',
    'bg-amber-500/20 text-amber-300 border-amber-500/40',
  ];
  return colors[idx % colors.length];
}

// 매칭 레벨 (AngelList 스타일) / Match level (AngelList style)
function getMatchLevel(score?: number): {
  label: string;
  color: string;
  neonClass: string;
} {
  if (!score || score < 60)
    return {
      label: 'Exploring',
      color: 'text-gray-400',
      neonClass: '',
    };
  if (score < 80)
    return {
      label: 'Good Match',
      color: 'text-emerald-400',
      neonClass: 'shadow-[0_0_8px_rgba(52,211,153,0.3)]',
    };
  if (score < 90)
    return {
      label: 'Strong Match',
      color: 'text-cyan-400',
      neonClass: 'shadow-[0_0_8px_rgba(34,211,238,0.4)]',
    };
  return {
    label: 'Perfect Match',
    color: 'text-purple-400',
    neonClass: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
  };
}

// 펀딩 스테이지 (AngelList 스타일) / Funding stage indicator
function getFundingStage(job: MockJobPostingV2): string {
  if (job.tierType === 'PREMIUM' && job.isFeatured) return 'Series B+';
  if (job.tierType === 'PREMIUM') return 'Series A';
  if ((job.matchScore ?? 0) > 80) return 'Seed';
  return 'Pre-Seed';
}

export default function G088Page() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const filteredJobs =
    selectedTier === 'all'
      ? sampleJobsV2
      : sampleJobsV2.filter((job) => {
          const tier = getPackageTier(job);
          return tier.label.toLowerCase() === selectedTier;
        });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* 배경 그리드 패턴 / Background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* 배경 글로우 / Background glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* 헤더 / Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 mb-6">
            <Rocket className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 tracking-wide">
              TALENT MATCHING PLATFORM
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              JobChaJa
            </span>
            <span className="text-gray-500 ml-3 text-2xl font-light">
              Pro Matching
            </span>
          </h1>
          <p className="text-gray-500 text-lg mt-2">
            {designInfo.description}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Design: {designInfo.id} | Author: {designInfo.author}
          </p>
        </div>

        {/* 티어 필터 (크몽 스타일) / Tier filter (Kmong style) */}
        <div className="flex justify-center gap-3 mb-10">
          {['all', 'basic', 'standard', 'enterprise'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
                selectedTier === tier
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 border-purple-500/50 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
              }`}
            >
              {tier === 'all'
                ? 'All Plans'
                : tier.charAt(0).toUpperCase() + tier.slice(1)}
            </button>
          ))}
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const isHovered = hoveredId === job.id;
            const tier = getPackageTier(job);
            const stacks = getTechStacks(job);
            const match = getMatchLevel(job.matchScore);
            const dday = getDDay(job.closingDate);
            const salary = formatSalary(job);
            const funding = getFundingStage(job);

            return (
              <div
                key={job.id}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
                  isHovered
                    ? `shadow-2xl ${tier.glowColor} scale-[1.02]`
                    : 'shadow-lg shadow-black/20'
                }`}
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* 카드 외곽 네온 보더 / Card outer neon border */}
                <div
                  className={`absolute inset-0 rounded-2xl border ${
                    isHovered ? tier.borderColor : 'border-white/[0.06]'
                  } transition-all duration-500 z-10 pointer-events-none`}
                />

                {/* 카드 배경 / Card background */}
                <div className="relative bg-gradient-to-b from-[#12121a] to-[#0d0d14]">
                  {/* 상단 이미지 + 오버레이 (AngelList 스타일) / Top image + overlay */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={job.industryImage}
                      alt={job.industry}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isHovered
                          ? 'scale-110 brightness-[0.3]'
                          : 'scale-100 brightness-[0.2]'
                      }`}
                    />
                    {/* 네온 그라데이션 오버레이 / Neon gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/80 to-transparent transition-opacity duration-500 ${
                        isHovered ? 'opacity-90' : 'opacity-95'
                      }`}
                    />

                    {/* 상단 메타 / Top meta */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      {/* 펀딩 스테이지 (AngelList) / Funding stage */}
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] font-mono text-gray-300 backdrop-blur-sm">
                          {funding}
                        </span>
                        {job.isUrgent && (
                          <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/30 text-[10px] font-bold text-red-400 animate-pulse">
                            URGENT
                          </span>
                        )}
                      </div>

                      {/* 매칭 스코어 / Match score */}
                      {job.matchScore && (
                        <div
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 ${match.neonClass}`}
                        >
                          <TrendingUp className={`w-3 h-3 ${match.color}`} />
                          <span
                            className={`text-xs font-bold ${match.color}`}
                          >
                            {job.matchScore}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 패키지 티어 라벨 (크몽 스타일) / Package tier label */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} shadow-lg`}
                      >
                        {tier.label === 'Enterprise' ? (
                          <Award className="w-3 h-3 text-white" />
                        ) : tier.label === 'Standard' ? (
                          <Shield className="w-3 h-3 text-white" />
                        ) : (
                          <Package className="w-3 h-3 text-white" />
                        )}
                        <span className="text-[11px] font-bold text-white tracking-wider uppercase">
                          {tier.label}
                        </span>
                      </div>
                    </div>

                    {/* D-day / D-day badge */}
                    {dday && (
                      <div className="absolute bottom-3 right-3 z-10">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold backdrop-blur-sm ${
                            dday === '마감'
                              ? 'bg-gray-800/80 text-gray-500 line-through'
                              : dday === 'D-Day'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                                : 'bg-black/50 text-gray-300 border border-white/10'
                          }`}
                        >
                          {dday}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 카드 본문 / Card body */}
                  <div className="px-5 pb-5 pt-3">
                    {/* 회사 정보 + 산업 (AngelList 스타일) / Company + industry */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
                          {job.companyInitial}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 leading-none">
                            {job.company}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-0.5">
                            {job.industry}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px]">{job.location}</span>
                      </div>
                    </div>

                    {/* 직무 타이틀 / Job title */}
                    <h3
                      className={`text-[15px] font-semibold leading-snug mb-3 transition-colors duration-300 line-clamp-2 ${
                        isHovered ? 'text-white' : 'text-gray-200'
                      }`}
                    >
                      {job.title}
                    </h3>

                    {/* 기술 스택 배지 (점핏 스타일) / Tech stack badges (Jumpit style) */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {stacks
                        .slice(0, isHovered ? stacks.length : 3)
                        .map((stack, idx) => (
                          <span
                            key={stack}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all duration-300 ${getStackColor(idx)} ${
                              isHovered
                                ? 'shadow-sm'
                                : 'opacity-70'
                            }`}
                          >
                            {stack}
                          </span>
                        ))}
                      {!isHovered && stacks.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-gray-500 border border-white/5">
                          +{stacks.length - 3}
                        </span>
                      )}
                    </div>

                    {/* 급여 + 고용형태 / Salary + employment type */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-sm font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}
                      >
                        {salary}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          job.boardType === 'FULL_TIME'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {job.boardType === 'FULL_TIME'
                          ? 'Full-time'
                          : 'Part-time'}
                      </span>
                    </div>

                    {/* 비자 배지 / Visa badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.allowedVisas.map((visa) => {
                        const vc = getVisaColor(visa);
                        return (
                          <span
                            key={visa}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${vc.bg} ${vc.text} opacity-80`}
                          >
                            {visa}
                          </span>
                        );
                      })}
                    </div>

                    {/* 호버 시 패키지 상세 (크몽 스타일) / Hover: package details (Kmong style) */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isHovered
                          ? 'max-h-60 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      {/* 구분선 네온 / Neon divider */}
                      <div
                        className={`h-px bg-gradient-to-r ${tier.color} opacity-30 mb-3`}
                      />

                      {/* 패키지 포함사항 / Package includes */}
                      <div className="mb-3">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">
                          Package Includes
                        </p>
                        <div className="space-y-1">
                          {tier.features.map((feature) => (
                            <div
                              key={feature}
                              className="flex items-center gap-1.5"
                            >
                              <Zap className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span className="text-[11px] text-gray-400">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 근무 조건 / Work conditions */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {job.workHours && (
                          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] text-gray-400 truncate">
                              {job.workHours}
                            </span>
                          </div>
                        )}
                        {job.experienceRequired && (
                          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                            <Briefcase className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] text-gray-400 truncate">
                              {job.experienceRequired}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 혜택 (네온 칩) / Benefits (neon chips) */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.benefits.slice(0, 4).map((benefit) => (
                          <span
                            key={benefit}
                            className="px-2 py-0.5 rounded-full text-[9px] bg-white/[0.04] text-gray-400 border border-white/[0.06]"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>

                      {/* 매칭 레벨 / Match level indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star
                            className={`w-3.5 h-3.5 ${match.color}`}
                          />
                          <span
                            className={`text-[11px] font-medium ${match.color}`}
                          >
                            {match.label}
                          </span>
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600/80 to-cyan-600/80 text-[11px] font-medium text-white hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-purple-500/20">
                          <span>Apply Now</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* 기본 하단 (호버 아닐 때) / Default footer (not hovered) */}
                    <div
                      className={`flex items-center justify-between text-gray-600 transition-all duration-300 ${
                        isHovered ? 'opacity-0 h-0' : 'opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="text-[10px]">
                            {job.applicantCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span className="text-[10px]">
                            {job.viewCount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span className="text-[10px]">
                          {stacks.length} skills
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 통계 바 / Bottom stats bar */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#12121a] to-[#15151f] border border-white/[0.06]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {sampleJobsV2.length}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Active Positions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  31
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Visa Types Supported
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {Math.round(
                    sampleJobsV2.reduce(
                      (sum, j) => sum + (j.matchScore ?? 0),
                      0
                    ) / sampleJobsV2.length
                  )}
                  %
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Avg Match Score</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Rocket className="w-4 h-4 text-amber-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {sampleJobsV2
                    .reduce((sum, j) => sum + j.applicantCount, 0)
                    .toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">Total Applicants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
