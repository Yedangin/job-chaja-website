/**
 * [시안]: g-010 'AngelList 스타트업 (AngelList Startup)'
 * [카테고리]: 프리미엄
 * [레퍼런스]: AngelList / Wellfound
 * [hover]: 네온 그린 보더 글로우 (box-shadow green glow) + 카드 살짝 리프트
 * [핵심]: 스타트업 감성, 투자 라운드 표시(Series A/B 목업), 팀 크기 표시,
 *         기술 스택 태그(React/Node.js 등 목업), 다크 카드 + 네온 그린 포인트
 * [이미지]: 없음
 * [로고]: companyLogo <img> h-8
 */

'use client'; // 클라이언트 컴포넌트 / Client component

import React from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getTimeAgo,
  getVisaColor,
} from '../_mock/job-mock-data-v2';
import {
  MapPin,
  Users,
  Clock,
  CircleDollarSign,
  Rocket,
  Eye,
  UserCheck,
  Zap,
  Star,
  Briefcase,
  Code,
  TrendingUp,
} from 'lucide-react';

// 투자 라운드 목업 데이터 / Mock investment round data
const startupFunding: Record<string, { round: string; amount: string }> = {
  'job-001': { round: 'Series B', amount: '$120M' },
  'job-002': { round: 'Seed', amount: '$2.5M' },
  'job-003': { round: 'Series C', amount: '$450M' },
  'job-004': { round: 'Pre-Seed', amount: '$800K' },
  'job-005': { round: 'Series A', amount: '$35M' },
  'job-006': { round: 'Series B', amount: '$85M' },
};

// 팀 크기 목업 데이터 / Mock team size data
const teamSizes: Record<string, string> = {
  'job-001': '51-200',
  'job-002': '1-10',
  'job-003': '201-500',
  'job-004': '11-50',
  'job-005': '501-1000',
  'job-006': '51-200',
};

// 기술 스택 목업 데이터 / Mock tech stack data
const techStacks: Record<string, string[]> = {
  'job-001': ['Python', 'TensorFlow', 'AWS'],
  'job-002': ['React', 'Node.js', 'MongoDB'],
  'job-003': ['React', 'TypeScript', 'Go', 'K8s'],
  'job-004': ['AutoCAD', 'BIM', 'SAP'],
  'job-005': ['Java', 'Spring', 'Redis'],
  'job-006': ['Revit', 'Primavera', 'Excel'],
};

export default function JobCardDesignG010() {
  const jobs = sampleJobsV2;

  return (
    // 전체 페이지 배경: 다크 테마 / Full page background: dark theme
    <div className="min-h-screen w-full bg-[#0d1117] px-4 py-8 font-sans md:px-8">
      {/* 상단 시안 정보 / Design info header */}
      <div className="mx-auto mb-10 max-w-7xl text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-medium text-green-400">
          <Rocket size={14} />
          g-010 &middot; AngelList Startup
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          AngelList 스타트업
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          다크 카드 + 네온 그린 포인트 &middot; 투자 라운드 &middot; 팀 크기
          &middot; 기술 스택 태그
        </p>
      </div>

      {/* 반응형 그리드: 1열 → 2열 → 3열 / Responsive grid: 1 → 2 → 3 columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => {
          const dday = getDDay(job.closingDate);
          const salary = formatSalary(job);
          const timeAgo = getTimeAgo(job.postedDate);
          const funding = startupFunding[job.id];
          const teamSize = teamSizes[job.id];
          const stack = techStacks[job.id] || [];

          return (
            <div
              key={job.id}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-700/60 bg-[#161b22] transition-all duration-300 hover:-translate-y-1.5 hover:border-green-400/60 hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]"
            >
              {/* 카드 상단 영역 / Card top area */}
              <div className="p-5">
                {/* 배지 행: 긴급, 추천, 프리미엄 / Badge row: urgent, featured, premium */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {job.isUrgent && (
                    <span className="inline-flex items-center gap-1 rounded bg-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-400">
                      <Zap size={11} />
                      긴급
                    </span>
                  )}
                  {job.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded bg-yellow-500/20 px-2 py-0.5 text-[11px] font-bold text-yellow-400">
                      <Star size={11} />
                      추천
                    </span>
                  )}
                  {job.tierType === 'PREMIUM' && (
                    <span className="inline-flex items-center gap-1 rounded bg-green-500/20 px-2 py-0.5 text-[11px] font-bold text-green-400">
                      PREMIUM
                    </span>
                  )}
                  {/* D-day 배지 / D-day badge */}
                  {dday && (
                    <span
                      className={`ml-auto rounded px-2 py-0.5 text-[11px] font-bold ${
                        dday === '마감'
                          ? 'bg-slate-600/40 text-slate-500'
                          : dday === 'D-Day' || dday === 'D-1' || dday === 'D-2'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-slate-600/30 text-slate-400'
                      }`}
                    >
                      {dday}
                    </span>
                  )}
                </div>

                {/* 로고 + 회사정보 / Logo + company info */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                    <img
                      src={job.companyLogo}
                      alt={`${job.company} logo`}
                      className="h-8 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-200">
                      {job.company}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={12} />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* 공고 제목 / Job title */}
                <h2 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-white transition-colors duration-200 group-hover:text-green-400">
                  {job.title}
                </h2>

                {/* 투자 라운드 + 팀 크기 / Investment round + team size */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {funding && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-400">
                      <TrendingUp size={12} />
                      {funding.round} &middot; {funding.amount}
                    </span>
                  )}
                  {teamSize && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/50 bg-slate-700/40 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                      <Users size={12} />
                      {teamSize}명
                    </span>
                  )}
                </div>

                {/* 기술 스택 태그 / Tech stack tags */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {stack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded border border-slate-600/40 bg-slate-800/60 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                    >
                      <Code size={10} className="text-green-500/60" />
                      {tech}
                    </span>
                  ))}
                </div>

                {/* 비자 태그 / Visa tags */}
                <div className="flex flex-wrap gap-1.5">
                  {job.allowedVisas.map((visa) => {
                    const vc = getVisaColor(visa);
                    return (
                      <span
                        key={visa}
                        className={`rounded px-2 py-0.5 text-[11px] font-semibold ${vc.bg} ${vc.text}`}
                      >
                        {visa}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* 카드 하단: 급여, 고용형태, 통계, 게시일 / Card bottom: salary, type, stats, date */}
              <div className="border-t border-slate-700/50 px-5 py-3.5">
                {/* 급여 + 고용형태 / Salary + employment type */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-green-400">
                    <CircleDollarSign size={14} />
                    {salary}
                  </span>
                  <span className="flex items-center gap-1 rounded bg-slate-700/50 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                    <Briefcase size={11} />
                    {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
                  </span>
                </div>

                {/* 통계: 지원자, 조회수, 게시일 / Stats: applicants, views, posted date */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <UserCheck size={11} />
                    지원 {job.applicantCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    조회 {job.viewCount.toLocaleString()}
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                    <Clock size={11} />
                    {timeAgo}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
