'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  CreditCard,
  TrendingUp,
  Eye,
  Users,
  MapPin,
  Clock,
  Briefcase,
  Star,
  Zap,
  ChevronRight,
  BarChart3,
  Wallet,
  ArrowUpRight,
  Shield,
  Sparkles,
} from 'lucide-react';

// 디자인 메타 정보 / Design metadata
const designInfo = {
  id: 'g-080',
  name: '카카오뱅크\u00D7토스\u00D7Stripe',
  category: 'unique',
  author: 'Gemini',
};

// 카운트업 애니메이션 훅 / Count-up animation hook
function useCountUp(target: number, duration: number = 1200, trigger: boolean = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // 이징 함수 / Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, trigger]);

  return count;
}

// 미니 차트 컴포넌트 / Mini sparkline chart component
function MiniChart({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const stepX = width / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPath = `M0,${height} L${data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' L')} L${width},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`chartGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#chartGrad-${color})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 마지막 점 강조 / Highlight last point */}
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 8) - 4}
        r="3"
        fill={color}
      />
    </svg>
  );
}

// 핀테크 카드 컴포넌트 / Fintech card component
function FintechJobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // 카운트업 값 / Count-up values
  const salaryNumber = job.salaryMax
    ? Math.round(job.salaryMax / 10000)
    : job.hourlyWage || 0;
  const animatedSalary = useCountUp(salaryNumber, 1000, isHovered);
  const animatedViews = useCountUp(job.viewCount, 800, isHovered);
  const animatedApplicants = useCountUp(job.applicantCount, 800, isHovered);

  // 차트용 가짜 트렌드 데이터 / Fake trend data for charts
  const viewTrend = [12, 18, 15, 28, 35, 42, job.viewCount / 100];
  const applicantTrend = [3, 7, 5, 12, 15, 18, job.applicantCount / 3];

  // 그라데이션 테마 배열 (카카오 노랑, 토스 블루, 스트라이프 보라) / Gradient theme (KakaoBank yellow, Toss blue, Stripe purple)
  const gradients = [
    'from-yellow-400 via-amber-400 to-orange-400', // 카카오뱅크 / KakaoBank
    'from-blue-400 via-blue-500 to-indigo-500',     // 토스 / Toss
    'from-violet-500 via-purple-500 to-indigo-600', // 스트라이프 / Stripe
    'from-yellow-400 via-blue-400 to-purple-500',   // 합체 / Combined
    'from-emerald-400 via-teal-500 to-cyan-500',    // 민트 / Mint
    'from-rose-400 via-pink-500 to-purple-500',     // 로즈 / Rose
  ];
  const gradient = gradients[index % gradients.length];

  // 카드 배경색 / Card background colors
  const bgColors = [
    'bg-gradient-to-br from-yellow-50 to-amber-50',
    'bg-gradient-to-br from-blue-50 to-indigo-50',
    'bg-gradient-to-br from-violet-50 to-purple-50',
    'bg-gradient-to-br from-yellow-50 via-blue-50 to-purple-50',
    'bg-gradient-to-br from-emerald-50 to-teal-50',
    'bg-gradient-to-br from-rose-50 to-pink-50',
  ];
  const bgColor = bgColors[index % bgColors.length];

  // 강조색 / Accent colors
  const accents = [
    { primary: '#F5A623', secondary: '#FEE500', chartColor: '#F5A623' },
    { primary: '#3182F6', secondary: '#5B9DF9', chartColor: '#3182F6' },
    { primary: '#635BFF', secondary: '#8B85FF', chartColor: '#635BFF' },
    { primary: '#7C3AED', secondary: '#A78BFA', chartColor: '#7C3AED' },
    { primary: '#10B981', secondary: '#34D399', chartColor: '#10B981' },
    { primary: '#F43F5E', secondary: '#FB7185', chartColor: '#F43F5E' },
  ];
  const accent = accents[index % accents.length];

  // 3D 틸트 마우스 이벤트 / 3D tilt mouse event handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const isPremium = job.tierType === 'PREMIUM';
  const isPartTime = job.boardType === 'PART_TIME';

  // 3D 변환 스타일 / 3D transform style
  const cardStyle: React.CSSProperties = {
    transform: isHovered
      ? `perspective(800px) rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg) scale(1.02)`
      : 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)',
    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
    transformStyle: 'preserve-3d' as const,
  };

  // 빛 반사 효과 스타일 / Light reflection effect style
  const shineStyle: React.CSSProperties = isHovered
    ? {
        background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
        opacity: 1,
      }
    : { opacity: 0 };

  return (
    <div
      ref={cardRef}
      className="relative cursor-pointer"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      {/* 메인 카드 / Main card */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/60 shadow-lg ${bgColor} backdrop-blur-sm`}
        style={{
          boxShadow: isHovered
            ? `0 20px 60px -12px ${accent.primary}40, 0 8px 24px -4px rgba(0,0,0,0.1)`
            : '0 4px 20px -2px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* 빛 반사 오버레이 / Shine overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
          style={shineStyle}
        />

        {/* 상단 크레딧카드 영역 / Top credit card area */}
        <div className={`relative bg-gradient-to-r ${gradient} p-5 pb-6`}>
          {/* 카드 칩 + 네트워크 로고 / Card chip + network logo */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* 칩 아이콘 / Chip icon */}
              <div className="w-10 h-7 rounded-md bg-yellow-200/80 border border-yellow-300/50 flex items-center justify-center backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-px">
                  <div className="w-2.5 h-2 rounded-sm bg-yellow-400/60" />
                  <div className="w-2.5 h-2 rounded-sm bg-yellow-500/60" />
                  <div className="w-2.5 h-2 rounded-sm bg-yellow-500/60" />
                  <div className="w-2.5 h-2 rounded-sm bg-yellow-400/60" />
                </div>
              </div>
              {/* 회사 로고 / Company logo */}
              <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/40">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <span className="hidden text-xs font-bold text-white">{job.companyInitial}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPremium && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold">
                  <Star className="w-3 h-3" />
                  PREMIUM
                </div>
              )}
              {job.isUrgent && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/30 backdrop-blur-sm text-white text-[10px] font-semibold">
                  <Zap className="w-3 h-3" />
                  URGENT
                </div>
              )}
            </div>
          </div>

          {/* 카드 번호 스타일 제목 / Card number style title */}
          <div className="text-white">
            <p className="text-sm font-medium opacity-80 mb-1 tracking-wide">
              {job.company}
            </p>
            <h3 className="text-lg font-bold leading-tight tracking-tight line-clamp-2 drop-shadow-sm">
              {job.title}
            </h3>
          </div>

          {/* 카드 하단 정보 / Card bottom info */}
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-wider mb-0.5">
                {isPartTime ? 'HOURLY RATE' : 'ANNUAL SALARY'}
              </p>
              {/* 대형 카운트업 숫자 (토스 스타일) / Large count-up number (Toss style) */}
              <div className="flex items-baseline gap-1">
                <span
                  className="text-3xl font-extrabold text-white tabular-nums drop-shadow-md"
                  style={{
                    fontFeatureSettings: '"tnum"',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {isHovered
                    ? animatedSalary.toLocaleString()
                    : salaryNumber.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-white/80">
                  {isPartTime ? '원' : '만원'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60 uppercase tracking-wider mb-0.5">
                VALID THRU
              </p>
              <p className="text-sm font-semibold text-white">
                {dDay || '상시'}
              </p>
            </div>
          </div>

          {/* 배경 장식 원 / Background decorative circles */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-12 w-24 h-24 rounded-full bg-white/5" />
        </div>

        {/* 하단 대시보드 영역 (스트라이프 스타일) / Bottom dashboard area (Stripe style) */}
        <div className="p-4 space-y-3">
          {/* 위치 + 근무시간 / Location + work hours */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            {job.workHours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.workHours}
              </span>
            )}
          </div>

          {/* 미니 차트 + 통계 대시보드 / Mini chart + stats dashboard */}
          <div className="grid grid-cols-2 gap-3">
            {/* 조회수 차트 / Views chart */}
            <div
              className="rounded-xl p-3 transition-all duration-300"
              style={{
                backgroundColor: isHovered ? `${accent.primary}08` : '#f9fafb',
                border: `1px solid ${isHovered ? `${accent.primary}20` : '#f3f4f6'}`,
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Views
                </span>
                <Eye className="w-3 h-3 text-gray-300" />
              </div>
              <p
                className="text-lg font-bold tabular-nums"
                style={{
                  color: isHovered ? accent.primary : '#1f2937',
                  fontFeatureSettings: '"tnum"',
                  transition: 'color 0.3s',
                }}
              >
                {isHovered
                  ? animatedViews.toLocaleString()
                  : job.viewCount.toLocaleString()}
              </p>
              <div className="mt-1.5">
                <MiniChart data={viewTrend} color={accent.chartColor} height={28} />
              </div>
            </div>

            {/* 지원자 차트 / Applicants chart */}
            <div
              className="rounded-xl p-3 transition-all duration-300"
              style={{
                backgroundColor: isHovered ? `${accent.primary}08` : '#f9fafb',
                border: `1px solid ${isHovered ? `${accent.primary}20` : '#f3f4f6'}`,
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Applicants
                </span>
                <Users className="w-3 h-3 text-gray-300" />
              </div>
              <p
                className="text-lg font-bold tabular-nums"
                style={{
                  color: isHovered ? accent.primary : '#1f2937',
                  fontFeatureSettings: '"tnum"',
                  transition: 'color 0.3s',
                }}
              >
                {isHovered
                  ? animatedApplicants.toLocaleString()
                  : job.applicantCount.toLocaleString()}
              </p>
              <div className="mt-1.5">
                <MiniChart data={applicantTrend} color={accent.chartColor} height={28} />
              </div>
            </div>
          </div>

          {/* 비자 배지 / Visa badges */}
          <div className="flex flex-wrap gap-1.5">
            {job.allowedVisas.map((visa) => {
              const visaStyle = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${visaStyle.bg} ${visaStyle.text} transition-transform duration-200`}
                  style={{
                    transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                  }}
                >
                  <Shield className="w-2.5 h-2.5 mr-0.5" />
                  {visa}
                </span>
              );
            })}
          </div>

          {/* 매치 스코어 + 복리후생 바 / Match score + benefits bar */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {job.matchScore && (
                <div className="flex items-center gap-1.5">
                  <div className="relative w-8 h-8">
                    <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke={accent.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${(job.matchScore / 100) * 88} 88`}
                        className="transition-all duration-700"
                        style={{
                          opacity: isHovered ? 1 : 0.6,
                        }}
                      />
                    </svg>
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[8px] font-bold"
                      style={{ color: accent.primary }}
                    >
                      {job.matchScore}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Match</span>
                </div>
              )}
              <div className="flex items-center gap-1 ml-1">
                {job.benefits.slice(0, 3).map((benefit, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded text-[9px] text-gray-500 bg-gray-50 border border-gray-100"
                  >
                    {benefit}
                  </span>
                ))}
                {job.benefits.length > 3 && (
                  <span className="text-[9px] text-gray-400">
                    +{job.benefits.length - 3}
                  </span>
                )}
              </div>
            </div>
            <button
              className="flex items-center gap-0.5 text-xs font-semibold transition-all duration-300"
              style={{
                color: isHovered ? accent.primary : '#9ca3af',
                transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 프리미엄 반짝이 효과 / Premium sparkle effect */}
        {isPremium && isHovered && (
          <div className="absolute top-3 right-3 z-20 animate-pulse">
            <Sparkles className="w-4 h-4 text-yellow-300 drop-shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function G080Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* 헤더 / Header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="text-center">
          {/* 핀테크 로고 배지 / Fintech logo badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 via-blue-100 to-purple-100 border border-white/60 mb-6">
            <CreditCard className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-semibold bg-gradient-to-r from-yellow-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {designInfo.name}
            </span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-yellow-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Fintech
            </span>
            {' '}Job Cards
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            카카오뱅크의 카드 디자인, 토스의 대형 숫자 카운트업, Stripe의 데이터 대시보드를 결합한 핀테크 스타일 채용 카드입니다.
            카드에 마우스를 올려 3D 틸트, 카운트업 애니메이션, 차트 효과를 확인하세요.
          </p>

          {/* 기능 태그 / Feature tags */}
          <div className="flex items-center justify-center gap-3 mt-5">
            {['3D Card Tilt', 'Count-up', 'Sparkline Charts', 'Credit Card UI'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleJobsV2.map((job, index) => (
            <FintechJobCard key={job.id} job={job} index={index} />
          ))}
        </div>

        {/* 하단 요약 바 / Bottom summary bar */}
        <div className="mt-12 flex items-center justify-center gap-8 py-6 px-8 rounded-2xl bg-gradient-to-r from-yellow-50 via-blue-50 to-purple-50 border border-white/60">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Listings</p>
              <p className="text-lg font-bold text-gray-800">{sampleJobsV2.length}</p>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Premium</p>
              <p className="text-lg font-bold text-gray-800">
                {sampleJobsV2.filter((j) => j.tierType === 'PREMIUM').length}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Views</p>
              <p className="text-lg font-bold text-gray-800">
                {sampleJobsV2.reduce((s, j) => s + j.viewCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Visa Types</p>
              <p className="text-lg font-bold text-gray-800">
                {new Set(sampleJobsV2.flatMap((j) => j.allowedVisas)).size}
              </p>
            </div>
          </div>
        </div>

        {/* 디자인 정보 푸터 / Design info footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            {designInfo.id} | {designInfo.name} | {designInfo.category} | by {designInfo.author}
          </p>
        </div>
      </div>
    </div>
  );
}
