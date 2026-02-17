'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Zap,
  Star,
  Briefcase,
  TrendingUp,
  Navigation,
  CreditCard,
  BarChart3,
  ArrowUpRight,
  Shield,
  ChevronRight,
  Activity,
  DollarSign,
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  MockJobPostingV2,
} from '../_mock/job-mock-data-v2';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-093',
  name: 'Uber×Stripe×KakaoBank',
  description: 'Mobility + fintech fusion with dark map, purple dashboard, and yellow card tilt',
  author: 'Gemini',
  category: 'unique',
  references: ['Uber', 'Stripe', 'KakaoBank'],
};

// 미니 스파크라인 차트 데이터 생성 / Generate mini sparkline chart data
function generateSparkline(seed: number): number[] {
  const points: number[] = [];
  let val = 30 + (seed * 13) % 40;
  for (let i = 0; i < 12; i++) {
    val += Math.sin(i * 0.8 + seed) * 15 + (Math.cos(i * 1.2 + seed * 2) * 8);
    points.push(Math.max(5, Math.min(95, val)));
  }
  return points;
}

// SVG 스파크라인 경로 생성 / Generate SVG sparkline path
function sparklinePath(data: number[], width: number, height: number): string {
  const step = width / (data.length - 1);
  return data
    .map((v, i) => {
      const x = i * step;
      const y = height - (v / 100) * height;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

// 루트 점 위치 생성 (Uber 맵 스타일) / Generate route dot positions (Uber map style)
function generateRouteDots(count: number, seed: number): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = [];
  let x = 10 + (seed * 7) % 20;
  let y = 20 + (seed * 11) % 30;
  for (let i = 0; i < count; i++) {
    dots.push({ x, y });
    x += 15 + Math.sin(i + seed) * 10;
    y += (Math.cos(i * 1.5 + seed) * 15);
    x = Math.max(5, Math.min(95, x));
    y = Math.max(10, Math.min(90, y));
  }
  return dots;
}

// 개별 잡카드 컴포넌트 / Individual job card component
function UberStripeKakaoCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const sparkData = generateSparkline(index + 1);
  const routeDots = generateRouteDots(6, index + 1);

  // 마우스 추적 + 3D 틸트 (카카오뱅크 카드 효과) / Mouse tracking + 3D tilt (KakaoBank card effect)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * -20,
      y: (x - 0.5) * 20,
    });
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 0.5, y: 0.5 });
  }, []);

  // 메트릭 데이터 (Stripe 대시보드 스타일) / Metric data (Stripe dashboard style)
  const metrics = [
    { label: '지원자', value: job.applicantCount, icon: Users, change: '+12%' },
    { label: '조회수', value: job.viewCount.toLocaleString(), icon: Eye, change: '+8%' },
    { label: '매칭', value: job.matchScore ? `${job.matchScore}%` : 'N/A', icon: TrendingUp, change: '+5%' },
  ];

  return (
    <div
      ref={cardRef}
      className="relative group cursor-pointer"
      style={{
        perspective: '1200px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D 틸트 컨테이너 / 3D tilt container */}
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        }}
      >
        {/* 글래스 반사 효과 (카카오뱅크 카드) / Glass reflection effect (KakaoBank card) */}
        {isHovered && (
          <div
            className="absolute inset-0 z-30 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            }}
          />
        )}

        {/* 메인 카드 바디 / Main card body */}
        <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-2xl overflow-hidden">

          {/* 상단: Uber 다크 맵 섹션 / Top: Uber dark map section */}
          <div className="relative h-36 bg-gradient-to-br from-[#0a0a0f] via-[#111122] to-[#0d0d1a] overflow-hidden">

            {/* 맵 그리드 라인 / Map grid lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              {[20, 40, 60, 80].map((v) => (
                <React.Fragment key={v}>
                  <line x1={v} y1="0" x2={v} y2="100" stroke="#2a2a4a" strokeWidth="0.3" />
                  <line x1="0" y1={v} x2="100" y2={v} stroke="#2a2a4a" strokeWidth="0.3" />
                </React.Fragment>
              ))}
            </svg>

            {/* 루트 경로 (Uber 스타일 점선) / Route path (Uber style dotted line) */}
            <svg
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* 루트 라인 / Route line */}
              <path
                d={routeDots.map((d, i) => `${i === 0 ? 'M' : 'L'}${d.x},${d.y}`).join(' ')}
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="1.5"
                strokeDasharray={isHovered ? '0' : '3,3'}
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              {/* 루트 점들 / Route dots */}
              {routeDots.map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.x}
                  cy={dot.y}
                  r={i === 0 || i === routeDots.length - 1 ? 2.5 : 1.2}
                  fill={i === 0 ? '#7c3aed' : i === routeDots.length - 1 ? '#fbbf24' : '#a855f7'}
                  className={isHovered ? 'animate-pulse' : ''}
                />
              ))}
              {/* 시작점 링 / Start point ring */}
              <circle
                cx={routeDots[0].x}
                cy={routeDots[0].y}
                r="4"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="0.8"
                opacity={isHovered ? 0.6 : 0.3}
                className="transition-opacity duration-300"
              />
              {/* 도착점 링 / End point ring */}
              <circle
                cx={routeDots[routeDots.length - 1].x}
                cy={routeDots[routeDots.length - 1].y}
                r="4"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="0.8"
                opacity={isHovered ? 0.6 : 0.3}
                className="transition-opacity duration-300"
              />
            </svg>

            {/* ETA 배지 (Uber 스타일) / ETA badge (Uber style) */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#1a1a2e]/90 backdrop-blur-md rounded-lg px-2.5 py-1.5 border border-[#2a2a4a]">
              <Navigation className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] font-mono text-gray-300">{job.location}</span>
            </div>

            {/* 배지 그룹 / Badge group */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              {job.isUrgent && (
                <div className="flex items-center gap-1 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-md px-2 py-1">
                  <Zap className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] font-bold text-red-400">긴급</span>
                </div>
              )}
              {job.isFeatured && (
                <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-md px-2 py-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-[10px] font-bold text-yellow-400">추천</span>
                </div>
              )}
            </div>

            {/* D-day (Uber ETA 스타일) / D-day (Uber ETA style) */}
            {dDay && (
              <div className="absolute bottom-3 right-3 bg-[#1a1a2e]/90 backdrop-blur-md rounded-lg px-3 py-1.5 border border-[#2a2a4a]">
                <span className="text-[10px] text-gray-400 block leading-none">마감까지</span>
                <span className={`text-sm font-bold font-mono ${
                  dDay === 'D-Day' || dDay === '마감' ? 'text-red-400' :
                  dDay.startsWith('D-') && parseInt(dDay.split('-')[1]) <= 3 ? 'text-yellow-400' :
                  'text-purple-400'
                }`}>{dDay}</span>
              </div>
            )}

            {/* 하단 그라데이션 페이드 / Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
          </div>

          {/* 중단: 회사 정보 + 직무 (카카오뱅크 깔끔한 스타일) / Middle: Company + job info (KakaoBank clean style) */}
          <div className="px-4 pt-3 pb-2">
            {/* 회사 로고 + 이름 / Company logo + name */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-yellow-500 p-[1.5px] flex-shrink-0">
                <div className="w-full h-full rounded-[10px] bg-[#12121f] flex items-center justify-center overflow-hidden">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <span className="hidden text-sm font-bold text-yellow-400">{job.companyInitial}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 truncate">{job.company}</p>
                <div className="flex items-center gap-1.5">
                  {job.tierType === 'PREMIUM' && (
                    <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-purple-500/20 to-yellow-500/20 border border-purple-500/30 rounded px-1.5 py-0.5">
                      <CreditCard className="w-2.5 h-2.5 text-yellow-400" />
                      <span className="text-[9px] font-bold text-yellow-400">PRO</span>
                    </span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a2e] text-gray-400 border border-[#2a2a4a]">
                    {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
                  </span>
                </div>
              </div>
            </div>

            {/* 직무 제목 / Job title */}
            <h3 className="text-sm font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors duration-200">
              {job.title}
            </h3>

            {/* 급여 (Stripe 금액 스타일) / Salary (Stripe amount style) */}
            <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-[#12121f] to-[#15152a] rounded-lg px-3 py-2 border border-[#1e1e2e]">
              <DollarSign className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold font-mono text-white">{salary}</span>
            </div>

            {/* 비자 배지 / Visa badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              {job.allowedVisas.map((visa) => {
                const color = getVisaColor(visa);
                return (
                  <span
                    key={visa}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-[#2a2a4a] bg-[#1a1a2e]"
                  >
                    <Shield className="w-2.5 h-2.5 text-purple-400" />
                    <span className="text-purple-300">{visa}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* 하단: Stripe 대시보드 메트릭 / Bottom: Stripe dashboard metrics */}
          <div
            className={`border-t border-[#1e1e2e] transition-all duration-500 overflow-hidden ${
              isHovered ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {/* 스파크라인 차트 (Stripe 스타일) / Sparkline chart (Stripe style) */}
            <div className="px-4 pt-3 pb-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  지원 트렌드
                </span>
                <span className="text-[10px] text-green-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +24%
                </span>
              </div>
              <svg viewBox="0 0 200 40" className="w-full h-8">
                {/* 영역 채우기 / Area fill */}
                <path
                  d={`${sparklinePath(sparkData, 200, 40)} L200,40 L0,40 Z`}
                  fill="url(#sparkFill)"
                  opacity="0.3"
                />
                {/* 라인 / Line */}
                <path
                  d={sparklinePath(sparkData, 200, 40)}
                  fill="none"
                  stroke="url(#sparkStroke)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="sparkStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* 메트릭 위젯 그리드 (Stripe 스타일) / Metric widget grid (Stripe style) */}
            <div className="grid grid-cols-3 gap-px bg-[#1e1e2e] mx-4 mb-3 rounded-lg overflow-hidden">
              {metrics.map((m, i) => (
                <div key={i} className="bg-[#0e0e1a] px-2.5 py-2 text-center">
                  <m.icon className="w-3 h-3 text-gray-500 mx-auto mb-0.5" />
                  <p className="text-xs font-bold font-mono text-white">{m.value}</p>
                  <p className="text-[9px] text-gray-500">{m.label}</p>
                  <span className="text-[8px] text-green-400">{m.change}</span>
                </div>
              ))}
            </div>

            {/* 복리후생 (카카오뱅크 칩 스타일) / Benefits (KakaoBank chip style) */}
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-1">
                {job.benefits.slice(0, 3).map((b) => (
                  <span
                    key={b}
                    className="text-[9px] px-2 py-0.5 rounded-full bg-[#1a1a2e] text-gray-400 border border-[#2a2a4a]"
                  >
                    {b}
                  </span>
                ))}
                {job.benefits.length > 3 && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1a1a2e] text-purple-400 border border-purple-500/20">
                    +{job.benefits.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 하단 바 (비 호버 시 미니 메트릭) / Bottom bar (mini metrics when not hovered) */}
          <div
            className={`flex items-center justify-between px-4 py-2.5 border-t border-[#1e1e2e] transition-all duration-300 ${
              isHovered ? 'opacity-0 h-0 py-0 overflow-hidden' : 'opacity-100'
            }`}
          >
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
                <span className="flex items-center gap-1 text-purple-400">
                  <BarChart3 className="w-3 h-3" />
                  {job.matchScore}%
                </span>
              )}
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-yellow-400 transition-colors" />
          </div>

          {/* 호버 시 CTA 버튼 / CTA button on hover */}
          <div
            className={`px-4 pb-3 transition-all duration-500 ${
              isHovered ? 'opacity-100 max-h-16' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            <button className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200">
              <CreditCard className="w-3.5 h-3.5" />
              상세보기
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G093Page() {
  return (
    <div className="min-h-screen bg-[#060609] text-white">
      {/* 헤더 / Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        {/* 디자인 ID 배지 / Design ID badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-yellow-500/20 border border-purple-500/30">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-mono text-purple-300">{designInfo.id}</span>
          </span>
          <span className="text-xs text-gray-500">by {designInfo.author}</span>
        </div>

        {/* 타이틀 / Title */}
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-purple-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
          Uber x Stripe x KakaoBank
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl leading-relaxed mb-1">
          모빌리티 다크맵 + 핀테크 대시보드 + 금융카드 3D 틸트가 융합된 잡카드 디자인.
          블랙/보라/노란 팔레트로 이동+결제+금융 경험을 하나로 통합.
        </p>
        <p className="text-xs text-gray-500">
          Mobility dark map + Fintech dashboard + Financial card 3D tilt fusion job card design.
        </p>

        {/* 기능 하이라이트 / Feature highlights */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { icon: Navigation, label: '맵 루트 경로', color: 'text-purple-400' },
            { icon: BarChart3, label: '스파크라인 차트', color: 'text-yellow-400' },
            { icon: CreditCard, label: '3D 카드 틸트', color: 'text-purple-400' },
          ].map((feat, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e0e1a] border border-[#1e1e2e]"
            >
              <feat.icon className={`w-3.5 h-3.5 ${feat.color}`} />
              <span className="text-xs text-gray-300">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job, index) => (
            <UberStripeKakaoCard key={job.id} job={job} index={index} />
          ))}
        </div>
      </div>

      {/* 하단 인포 바 / Bottom info bar */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between py-4 border-t border-[#1e1e2e]">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>총 {sampleJobsV2.length}개 공고</span>
            <span className="w-px h-3 bg-[#2a2a4a]" />
            <span className="font-mono">{designInfo.id}</span>
            <span className="w-px h-3 bg-[#2a2a4a]" />
            <span>{designInfo.category}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>호버하여 대시보드 확인</span>
            <div className="w-4 h-4 rounded-full border border-[#2a2a4a] flex items-center justify-center">
              <ChevronRight className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
