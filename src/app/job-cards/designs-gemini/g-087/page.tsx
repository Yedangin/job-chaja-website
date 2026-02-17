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
  MapPin,
  Clock,
  Briefcase,
  Users,
  Eye,
  ChevronRight,
  Zap,
  Star,
  Building2,
  Globe,
  Send,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Link2,
} from 'lucide-react';

/* ────────────────────────────────────────────────
 * 디자인 정보 / Design info
 * ──────────────────────────────────────────────── */
const designInfo = {
  id: 'g-087',
  title: 'ZipRecruiter × Indeed × LinkedIn — Global Recruitment All-in-One',
  author: 'Gemini',
  category: 'premium',
  references: ['ZipRecruiter', 'Indeed', 'LinkedIn'],
  description:
    '글로벌 채용 올인원. 매칭게이지+원클릭지원+프로필카드 복합 호버. 블루+그린 전문 팔레트. / Global recruitment all-in-one. Match gauge + one-click apply + profile card compound hover. Blue+green professional palette.',
};

/* ────────────────────────────────────────────────
 * SVG 원형 매칭 게이지 / Circular SVG matching gauge (ZipRecruiter-style)
 * ──────────────────────────────────────────────── */
function MatchGauge({
  score,
  size = 72,
  strokeWidth = 5,
  animate = false,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  // 점수 기반 색상 / Color based on score
  const getColor = (s: number) => {
    if (s >= 85) return { stroke: '#059669', text: 'text-emerald-600', label: 'Excellent' };
    if (s >= 70) return { stroke: '#0284c7', text: 'text-sky-600', label: 'Good' };
    if (s >= 50) return { stroke: '#d97706', text: 'text-amber-600', label: 'Fair' };
    return { stroke: '#dc2626', text: 'text-red-600', label: 'Low' };
  };

  const color = getColor(score);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 배경 원 / Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* 게이지 원 / Gauge circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? offset : circumference}
          className="transition-all duration-1000 ease-out"
          style={animate ? { strokeDashoffset: offset } : undefined}
        />
      </svg>
      {/* 중앙 퍼센트 표시 / Center percentage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${color.text}`}>{score}%</span>
      </div>
      <span className={`text-[10px] font-medium mt-1 ${color.text}`}>{color.label}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────
 * LinkedIn 스타일 프로필 카드 / LinkedIn-style profile card
 * ──────────────────────────────────────────────── */
function CompanyProfileCard({ job }: { job: MockJobPostingV2 }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-lg w-72">
      {/* 헤더 배너 / Header banner */}
      <div className="h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-lg -mx-4 -mt-4 mb-3" />
      {/* 로고 + 기업명 / Logo + company name */}
      <div className="flex items-start gap-3 -mt-8">
        <div className="w-14 h-14 rounded-lg bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden text-lg font-bold text-blue-600">{job.companyInitial}</span>
        </div>
        <div className="pt-5">
          <h4 className="font-bold text-slate-800 text-sm leading-tight">{job.company}</h4>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Building2 size={11} />
            {job.industry}
          </p>
        </div>
      </div>
      {/* 통계 / Stats */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
        <div className="text-center flex-1">
          <p className="text-sm font-bold text-slate-800">{job.applicantCount}</p>
          <p className="text-[10px] text-slate-500">지원자 / Applicants</p>
        </div>
        <div className="w-px h-8 bg-slate-100" />
        <div className="text-center flex-1">
          <p className="text-sm font-bold text-slate-800">{job.viewCount.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500">조회 / Views</p>
        </div>
        <div className="w-px h-8 bg-slate-100" />
        <div className="text-center flex-1">
          <p className="text-sm font-bold text-slate-800">{job.allowedVisas.length}</p>
          <p className="text-[10px] text-slate-500">비자 / Visas</p>
        </div>
      </div>
      {/* 연결 버튼 / Connect button (LinkedIn-style) */}
      <button className="w-full mt-3 py-2 rounded-full border-2 border-blue-600 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5">
        <Link2 size={13} />
        기업 팔로우 / Follow Company
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────
 * 잡카드 컴포넌트 / Job card component
 * ──────────────────────────────────────────────── */
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [applied, setApplied] = useState(false);
  const [gaugeAnimated, setGaugeAnimated] = useState(false);

  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const score = job.matchScore ?? 0;

  // 호버 시 게이지 애니메이션 트리거 / Trigger gauge animation on hover
  const handleMouseEnter = () => {
    setHovered(true);
    // 약간의 딜레이 후 애니메이션 시작 / Start animation after slight delay
    setTimeout(() => setGaugeAnimated(true), 100);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    setGaugeAnimated(false);
  };

  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-visible
        ${isPremium ? 'border-blue-200 shadow-md shadow-blue-50' : 'border-slate-200 shadow-sm'}
        ${hovered ? 'shadow-xl shadow-blue-100/60 -translate-y-1 border-blue-300' : 'hover:shadow-md'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* 프리미엄 상단 바 / Premium top bar */}
      {isPremium && (
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-t-2xl" />
      )}

      <div className="p-5">
        {/* 상단 영역: 로고 + 매칭 게이지 / Top area: Logo + match gauge */}
        <div className="flex items-start justify-between gap-3">
          {/* 기업 로고 + 정보 / Company logo + info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border
              ${isPremium ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200 bg-slate-50'}`}>
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-9 h-9 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden text-base font-bold text-blue-600">{job.companyInitial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs text-slate-500 truncate">{job.company}</span>
                {isPremium && (
                  <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[9px] font-bold">
                    <Star size={8} fill="currentColor" />
                    PRO
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                {job.title}
              </h3>
            </div>
          </div>

          {/* ZipRecruiter 스타일 매칭 게이지 / ZipRecruiter-style match gauge */}
          <div className={`shrink-0 transition-all duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}>
            <MatchGauge score={score} size={68} strokeWidth={5} animate={gaugeAnimated} />
          </div>
        </div>

        {/* 메타 정보 행 / Meta info row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-blue-500" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={12} className="text-emerald-500" />
            {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
          </span>
          {job.workHours && (
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-amber-500" />
              {job.workHours}
            </span>
          )}
          {job.experienceRequired && (
            <span className="flex items-center gap-1">
              <TrendingUp size={12} className="text-violet-500" />
              {job.experienceRequired}
            </span>
          )}
        </div>

        {/* 급여 / Salary */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-base font-bold text-slate-800">{salary}</span>
          {job.isUrgent && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 animate-pulse">
              <Zap size={10} fill="currentColor" />
              긴급 / Urgent
            </span>
          )}
        </div>

        {/* 비자 태그 / Visa tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.allowedVisas.map((visa) => {
            const vc = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`${vc.bg} ${vc.text} px-2 py-0.5 rounded-md text-[11px] font-semibold`}
              >
                {visa}
              </span>
            );
          })}
        </div>

        {/* 복리후생 / Benefits */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {job.benefits.slice(0, 4).map((b) => (
            <span
              key={b}
              className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] border border-slate-100"
            >
              {b}
            </span>
          ))}
          {job.benefits.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px]">
              +{job.benefits.length - 4}
            </span>
          )}
        </div>

        {/* 하단 카운트 + 마감일 / Bottom counts + deadline */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Users size={12} />
              {job.applicantCount}명 지원
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {job.viewCount.toLocaleString()}
            </span>
          </div>
          {dDay && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg
                ${dDay === '마감' ? 'bg-slate-100 text-slate-400' :
                  dDay === 'D-Day' ? 'bg-red-50 text-red-600 animate-pulse' :
                  dDay === '상시모집' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-blue-50 text-blue-600'}`}
            >
              {dDay}
            </span>
          )}
        </div>
      </div>

      {/* ─── 호버 오버레이: 매칭+원클릭+프로필 복합 / Hover overlay: match+one-click+profile compound ─── */}
      <div
        className={`absolute inset-0 z-20 rounded-2xl transition-all duration-300
          ${hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* 반투명 배경 / Translucent background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90 rounded-2xl backdrop-blur-sm" />

        {/* 컨텐츠 / Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          {/* 상단: 매칭 게이지 확대 + 결과 / Top: enlarged match gauge + result */}
          <div className="flex items-start gap-4">
            <MatchGauge score={score} size={88} strokeWidth={6} animate={gaugeAnimated} />
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider mb-1">
                Match Analysis
              </p>
              <h4 className="text-white font-bold text-sm leading-snug line-clamp-2">{job.title}</h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  비자 {job.allowedVisas.length}개 적합
                </span>
                <span className="text-white/50 text-[10px]">|</span>
                <span className="text-cyan-400 text-xs">{salary}</span>
              </div>
            </div>
          </div>

          {/* 중앙: 비자 호환 목록 / Center: visa compatibility list */}
          <div className="my-3">
            <p className="text-white/50 text-[10px] uppercase tracking-wider mb-1.5">
              Compatible Visas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {job.allowedVisas.map((visa) => (
                <span
                  key={visa}
                  className="px-2 py-0.5 rounded-md bg-white/15 text-white/90 text-[11px] font-medium border border-white/10"
                >
                  {visa}
                </span>
              ))}
            </div>
          </div>

          {/* 하단: Indeed 원클릭 + LinkedIn 프로필 / Bottom: Indeed one-click + LinkedIn profile */}
          <div className="space-y-2">
            {/* Indeed 스타일 원클릭 지원 버튼 / Indeed-style one-click apply */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setApplied(true);
              }}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2
                ${applied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98]'
                }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 size={16} />
                  지원 완료 / Applied!
                </>
              ) : (
                <>
                  <Send size={16} />
                  간편 지원하기 / Easy Apply
                </>
              )}
            </button>

            {/* LinkedIn 스타일 기업 프로필 요약 행 / LinkedIn-style company profile summary row */}
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 border border-white/5">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-6 h-6 object-contain brightness-0 invert"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{job.company}</p>
                <p className="text-white/50 text-[10px]">{job.industry} · {job.location}</p>
              </div>
              <ChevronRight size={16} className="text-white/40 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn 스타일 프로필 카드 팝업 (호버 시 우측) / LinkedIn-style profile popup on hover */}
      {hovered && (
        <div
          className="absolute top-4 -right-[18.5rem] z-30 hidden xl:block animate-in fade-in slide-in-from-left-2 duration-300"
        >
          <CompanyProfileCard job={job} />
        </div>
      )}

      {/* isFeatured 배지 / Featured badge */}
      {job.isFeatured && (
        <div className="absolute -top-2.5 left-5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold shadow-md shadow-amber-200/50">
            <Sparkles size={10} fill="currentColor" />
            Featured
          </span>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────
 * 통계 요약 바 / Stats summary bar
 * ──────────────────────────────────────────────── */
function StatsSummaryBar() {
  const totalJobs = sampleJobsV2.length;
  const totalApplicants = sampleJobsV2.reduce((acc, j) => acc + j.applicantCount, 0);
  const avgMatch = Math.round(
    sampleJobsV2.reduce((acc, j) => acc + (j.matchScore ?? 0), 0) / totalJobs
  );
  const premiumCount = sampleJobsV2.filter((j) => j.tierType === 'PREMIUM').length;

  const stats = [
    { label: '전체 공고 / Total Jobs', value: totalJobs, icon: Briefcase, color: 'text-blue-600' },
    { label: '전체 지원자 / Applicants', value: totalApplicants, icon: Users, color: 'text-emerald-600' },
    { label: '평균 매칭 / Avg Match', value: `${avgMatch}%`, icon: TrendingUp, color: 'text-cyan-600' },
    { label: '프리미엄 / Premium', value: premiumCount, icon: Star, color: 'text-amber-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center ${s.color}`}>
            <s.icon size={20} />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{s.value}</p>
            <p className="text-[10px] text-slate-500">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────
 * 메인 페이지 / Main page
 * ──────────────────────────────────────────────── */
export default function G087Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* 헤더 / Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-200/50">
              <Globe size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">
                잡차자 / JobChaJa
              </h1>
              <p className="text-[10px] text-slate-400">Global Recruitment Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
              <Sparkles size={12} />
              {designInfo.id}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs">
              {designInfo.author}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* 디자인 설명 / Design description */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium mb-4">
            <Globe size={14} />
            ZipRecruiter × Indeed × LinkedIn — All-in-One Hybrid
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            글로벌 채용 올인원 카드
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            매칭 게이지로 적합도 시각화, 원클릭 지원, 기업 네트워크 카드를 하나의 인터랙션에 통합.
            <br />
            Visualize match score with gauge, one-click apply, and company network card in a single interaction.
          </p>
        </div>

        {/* 통계 요약 / Stats summary */}
        <StatsSummaryBar />

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
          {sampleJobsV2.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>

        {/* 더보기 CTA / Load more CTA */}
        <div className="mt-10 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-blue-200/50 hover:shadow-blue-300/60 hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 active:scale-[0.98]">
            <Globe size={18} />
            더 많은 공고 보기 / Browse All Jobs
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 하단 디자인 정보 / Bottom design info */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">
            Design {designInfo.id} — {designInfo.title}
          </p>
          <p className="text-[10px] text-slate-300 mt-1">
            {designInfo.references.join(' + ')} hybrid · {designInfo.category} · by {designInfo.author}
          </p>
        </div>
      </main>
    </div>
  );
}
