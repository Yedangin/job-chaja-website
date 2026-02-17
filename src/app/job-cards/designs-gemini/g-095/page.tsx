'use client';

// g-095: Discord×점핏×AngelList 융합 디자인
// g-095: Discord×Jumpit×AngelList fusion design
// 커뮤니티+개발자+스타트업 — 보라+그린+네온 팔레트
// Community+Developer+Startup — Purple+Green+Neon palette

import { useState } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  Hash,
  Users,
  Eye,
  Clock,
  MapPin,
  Briefcase,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
  Star,
  Shield,
  Code,
  DollarSign,
  Sparkles,
  Circle,
  Volume2,
} from 'lucide-react';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-095',
  title: 'Discord×점핏×AngelList',
  description: '커뮤니티+개발자+스타트업 — 보라+그린+네온 팔레트',
  author: 'Gemini',
  category: 'platform',
  references: ['Discord', 'Jumpit', 'AngelList'],
};

// 스타트업 펀딩 단계 매핑 (matchScore 기반) / Startup funding stage mapping (based on matchScore)
function getFundingStage(score?: number): { label: string; color: string; glow: string } {
  if (!score) return { label: 'Pre-Seed', color: 'text-gray-400', glow: 'shadow-gray-500/20' };
  if (score >= 90) return { label: 'Series C+', color: 'text-emerald-400', glow: 'shadow-emerald-500/40' };
  if (score >= 80) return { label: 'Series B', color: 'text-green-400', glow: 'shadow-green-500/30' };
  if (score >= 70) return { label: 'Series A', color: 'text-lime-400', glow: 'shadow-lime-500/30' };
  if (score >= 60) return { label: 'Seed', color: 'text-yellow-400', glow: 'shadow-yellow-500/30' };
  return { label: 'Pre-Seed', color: 'text-orange-400', glow: 'shadow-orange-500/20' };
}

// 산업 → 기술 스택 매핑 (점핏 스타일) / Industry to tech stack mapping (Jumpit-style)
function getTechStack(industry: string): string[] {
  const map: Record<string, string[]> = {
    '제조': ['PLC', 'SCADA', 'MES', 'QC', 'AutoCAD'],
    '숙박/음식': ['POS', 'HACCP', 'Inventory', 'CRM'],
    'IT/소프트웨어': ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    '건설': ['BIM', 'Revit', 'Safety-Mgmt', 'PMIS'],
    '물류/운송': ['WMS', 'TMS', 'RFID', 'SAP', 'Logistics'],
    '교육': ['LMS', 'EdTech', 'Curriculum', 'Assessment'],
  };
  return map[industry] || ['General', 'Operations'];
}

// 온라인 멤버 수 시뮬레이션 / Simulate online member count
function getOnlineCount(applicantCount: number): number {
  return Math.max(3, Math.floor(applicantCount * 0.3));
}

// 개별 채용 카드 / Individual job card component
function JobCard({ job }: { job: MockJobPostingV2 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showStack, setShowStack] = useState(false);

  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const funding = getFundingStage(job.matchScore);
  const techStack = getTechStack(job.industry);
  const onlineCount = getOnlineCount(job.applicantCount);
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowStack(false);
      }}
    >
      {/* 네온 글로우 효과 / Neon glow effect */}
      <div
        className={`absolute -inset-0.5 rounded-xl transition-all duration-500 ${
          isHovered
            ? 'bg-gradient-to-r from-purple-600 via-green-500 to-purple-600 opacity-60 blur-sm'
            : 'bg-gradient-to-r from-purple-800/30 to-green-800/30 opacity-0'
        }`}
      />

      <div
        className={`relative rounded-xl overflow-hidden transition-all duration-400 ${
          isHovered ? 'scale-[1.02]' : ''
        }`}
        style={{ backgroundColor: '#2b2d31' }}
      >
        {/* Discord 상단 배너 / Discord top banner */}
        <div
          className="relative h-16 overflow-hidden"
          style={{
            background: isPremium
              ? 'linear-gradient(135deg, #5865F2 0%, #3ba55c 50%, #5865F2 100%)'
              : 'linear-gradient(135deg, #5865F2 0%, #4752c4 100%)',
          }}
        >
          {/* 네온 파티클 (호버 시) / Neon particles on hover */}
          {isHovered && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full animate-ping"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    backgroundColor: i % 2 === 0 ? '#57F287' : '#a855f7',
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.5s',
                  }}
                />
              ))}
            </div>
          )}

          {/* 프리미엄 / 긴급 배지 / Premium / Urgent badges */}
          <div className="absolute top-2 right-2 flex gap-1.5">
            {isPremium && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/90 text-black">
                <Star className="w-3 h-3" />
                BOOST
              </span>
            )}
            {job.isUrgent && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/90 text-white animate-pulse">
                <Zap className="w-3 h-3" />
                URGENT
              </span>
            )}
          </div>

          {/* 채널 해시태그 / Channel hashtag */}
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-white/60" />
            <span className="text-white/80 text-xs font-medium truncate max-w-[180px]">
              {job.industry.toLowerCase().replace(/[/]/g, '-')}
            </span>
            {job.isFeatured && (
              <span className="ml-1 px-1.5 py-0.5 bg-green-500/30 rounded text-[9px] text-green-300 font-semibold">
                FEATURED
              </span>
            )}
          </div>
        </div>

        {/* 서버 아이콘 (로고) / Server icon (logo) */}
        <div className="relative px-4 -mt-6">
          <div
            className={`w-12 h-12 rounded-2xl border-4 flex items-center justify-center overflow-hidden transition-all duration-300 ${
              isHovered ? 'rounded-xl border-green-500/50' : 'border-[#2b2d31]'
            }`}
            style={{ backgroundColor: '#36393f' }}
          >
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.className = 'text-lg font-bold text-purple-400';
                  fallback.textContent = job.companyInitial;
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          {/* 온라인 상태 도트 / Online status dot */}
          <div className="absolute bottom-0 left-[52px] w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#2b2d31]" />
        </div>

        {/* 카드 본문 / Card body */}
        <div className="px-4 pt-2 pb-3">
          {/* 서버(회사) 이름 / Server (company) name */}
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-white font-bold text-sm truncate">
              {job.company}
            </h3>
            <Shield className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          </div>

          {/* 채용 타이틀 / Job title */}
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-2.5">
            {job.title}
          </p>

          {/* 위치 + 경력 / Location + Experience */}
          <div className="flex items-center gap-3 mb-2.5 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-green-400" />
              {job.experienceRequired || '무관'}
            </span>
          </div>

          {/* 급여 — 네온 스타일 / Salary — Neon style */}
          <div
            className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg"
            style={{ backgroundColor: '#1e1f22' }}
          >
            <DollarSign className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400 text-xs font-semibold">{salary}</span>
          </div>

          {/* 비자 배지 + 멤버 카운트 / Visa badges + member count */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex flex-wrap gap-1">
              {job.allowedVisas.slice(0, 3).map((visa) => {
                const vc = getVisaColor(visa);
                return (
                  <span
                    key={visa}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${vc.bg} ${vc.text}`}
                  >
                    {visa}
                  </span>
                );
              })}
              {job.allowedVisas.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-700 text-gray-300">
                  +{job.allowedVisas.length - 3}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
              <span>{onlineCount} online</span>
            </div>
          </div>

          {/* === 호버 시 나타나는 확장 영역 === */}
          {/* === Expanded area on hover === */}
          <div
            className={`overflow-hidden transition-all duration-400 ${
              isHovered ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {/* 구분선 / Divider */}
            <div className="h-px bg-gray-700/50 my-2" />

            {/* 1. 스택 배지 그리드 (점핏) / Tech stack badge grid (Jumpit) */}
            <div className="mb-2.5">
              <button
                onClick={() => setShowStack(!showStack)}
                className="flex items-center gap-1.5 text-[11px] text-green-400 font-medium mb-1.5 hover:text-green-300 transition-colors"
              >
                <Code className="w-3 h-3" />
                기술 스택 / Tech Stack
                {showStack ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              <div
                className={`flex flex-wrap gap-1 overflow-hidden transition-all duration-300 ${
                  showStack ? 'max-h-20' : 'max-h-7'
                }`}
              >
                {techStack.map((tech, i) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border"
                    style={{
                      backgroundColor: i % 2 === 0 ? 'rgba(88, 101, 242, 0.15)' : 'rgba(59, 165, 92, 0.15)',
                      borderColor: i % 2 === 0 ? 'rgba(88, 101, 242, 0.3)' : 'rgba(59, 165, 92, 0.3)',
                      color: i % 2 === 0 ? '#8b9eff' : '#57F287',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. 매칭 스코어 (점핏 스타일 매칭률) / Match score (Jumpit-style match %) */}
            {job.matchScore && (
              <div className="mb-2.5 px-2.5 py-2 rounded-lg" style={{ backgroundColor: '#1e1f22' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400 font-medium">매칭률 / Match</span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: job.matchScore >= 80 ? '#57F287' : job.matchScore >= 60 ? '#FEE75C' : '#ED4245',
                    }}
                  >
                    {job.matchScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${job.matchScore}%`,
                      background:
                        job.matchScore >= 80
                          ? 'linear-gradient(90deg, #3ba55c, #57F287)'
                          : job.matchScore >= 60
                            ? 'linear-gradient(90deg, #f0b232, #FEE75C)'
                            : 'linear-gradient(90deg, #d83c3e, #ED4245)',
                    }}
                  />
                </div>
              </div>
            )}

            {/* 3. 펀딩 단계 (AngelList) / Funding stage (AngelList) */}
            <div
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg mb-2.5 ${funding.glow}`}
              style={{ backgroundColor: '#1e1f22' }}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-3.5 h-3.5 ${funding.color}`} />
                <div>
                  <span className="text-[9px] text-gray-500 block">FUNDING STAGE</span>
                  <span className={`text-xs font-bold ${funding.color}`}>{funding.label}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-gray-500 block">VALUATION</span>
                <span className="text-xs font-semibold text-purple-300">
                  {job.matchScore ? `${Math.floor(job.matchScore * 1.2)}M` : 'N/A'}
                </span>
              </div>
            </div>

            {/* 4. 복리후생 / Benefits */}
            <div className="flex flex-wrap gap-1 mb-2.5">
              {job.benefits.slice(0, 4).map((benefit) => (
                <span
                  key={benefit}
                  className="px-1.5 py-0.5 rounded text-[9px] text-gray-300 font-medium"
                  style={{ backgroundColor: 'rgba(88, 101, 242, 0.12)' }}
                >
                  {benefit}
                </span>
              ))}
            </div>

            {/* 5. 통계 행 / Stats row */}
            <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" />
                {job.applicantCount}명 지원
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-green-400" />
                {job.viewCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-500" />
                {dday || '상시모집'}
              </span>
            </div>

            {/* 6. Join Server 버튼 / Join Server button */}
            <button
              className="w-full py-2 rounded-md text-xs font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #5865F2 0%, #3ba55c 100%)',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #6d78f7 0%, #4ac066 100%)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  'linear-gradient(135deg, #5865F2 0%, #3ba55c 100%)';
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              지원하기 / Join Server
            </button>
          </div>

          {/* 비호버 상태 하단 / Non-hover bottom */}
          <div
            className={`transition-all duration-300 ${
              isHovered ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-10 opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {job.applicantCount}
                </span>
                <span>·</span>
                <span>{dday || '상시'}</span>
              </div>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium"
                style={{
                  color: '#57F287',
                  backgroundColor: 'rgba(59, 165, 92, 0.1)',
                }}
              >
                <Volume2 className="w-2.5 h-2.5" />
                채용중
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 / Main page
export default function G095Page() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e1f22' }}>
      {/* 헤더 / Header */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Discord 스타일 서버 검색 헤더 / Discord-style server discovery header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #5865F2 0%, #3ba55c 50%, #a855f7 100%)',
              }}
            >
              <Hash className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                채용 서버 탐색
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: '#5865F2', color: '#fff' }}
                >
                  {designInfo.id}
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                {designInfo.description} — {designInfo.references.join(' × ')}
              </p>
            </div>
          </div>

          {/* 통계 바 / Stats bar */}
          <div
            className="flex items-center gap-6 px-4 py-2.5 rounded-lg mt-4"
            style={{ backgroundColor: '#2b2d31' }}
          >
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-400 font-semibold">
                {sampleJobsV2.reduce((acc, j) => acc + getOnlineCount(j.applicantCount), 0)}
              </span>
              <span className="text-gray-500">online</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <Users className="w-3 h-3 text-purple-400" />
              <span className="text-white font-semibold">
                {sampleJobsV2.reduce((acc, j) => acc + j.applicantCount, 0).toLocaleString()}
              </span>
              <span className="text-gray-500">members</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-300">
              <Hash className="w-3 h-3 text-gray-500" />
              <span className="text-white font-semibold">{sampleJobsV2.length}</span>
              <span className="text-gray-500">servers</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-300 ml-auto">
              <span className="text-gray-500">Author:</span>
              <span className="text-purple-400 font-medium">{designInfo.author}</span>
            </div>
          </div>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* 하단 정보 / Bottom info */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 text-[11px]">
            {designInfo.id} · {designInfo.title} · {designInfo.category} ·{' '}
            {designInfo.references.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
