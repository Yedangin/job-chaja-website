'use client';

// g-090: 잡코리아x알바몬x당근 (JobKoreaxAlbamonxKarrot) 디자인
// Korean local recruitment hybrid: JobKorea gradient + Albamon D-day + Karrot distance

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
  Eye,
  Users,
  Briefcase,
  Star,
  ChevronRight,
  Timer,
  Navigation,
  Flame,
  Heart,
  Building2,
  TrendingUp,
  Zap,
  Shield,
} from 'lucide-react';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-090',
  title: '잡코리아×알바몬×당근',
  titleEn: 'JobKorea × Albamon × Karrot',
  description:
    '한국 채용+로컬, 그라데이션+카운트다운+동네 / Korean local recruitment: gradient wave + D-day countdown + distance indicator',
  author: 'Gemini',
  category: 'creative',
  references: ['JobKorea', 'Albamon', '당근마켓'],
};

// 가상 거리 데이터 생성 / Generate mock distance data
function getDistance(location: string): string {
  const distMap: Record<string, string> = {
    '경기 평택시': '32km',
    '서울 중구': '2.3km',
    '서울 송파구': '5.1km',
    '서울 강남구': '3.8km',
    '인천 남동구': '18km',
    '경기 화성시': '28km',
  };
  return distMap[location] || '10km';
}

// 거리 기반 뱃지 레이블 / Distance-based badge label
function getDistanceLabel(location: string): string {
  const dist = parseFloat(getDistance(location));
  if (dist <= 3) return '걸어서 갈 수 있어요';
  if (dist <= 10) return '우리 동네';
  if (dist <= 20) return '근처 지역';
  return '조금 먼 곳';
}

// 거리 기반 색상 / Distance-based color
function getDistanceColor(location: string): string {
  const dist = parseFloat(getDistance(location));
  if (dist <= 3) return 'text-orange-500';
  if (dist <= 10) return 'text-amber-500';
  if (dist <= 20) return 'text-yellow-600';
  return 'text-gray-500';
}

// D-day 색상 / D-day color for emphasis
function getDDayColor(dday: string | null): { bg: string; text: string; border: string; glow: string } {
  if (!dday || dday === '상시모집') return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', glow: '' };
  if (dday === '마감') return { bg: 'bg-gray-100', text: 'text-gray-400', border: 'border-gray-200', glow: '' };
  if (dday === 'D-Day') return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600', glow: 'shadow-red-300 shadow-lg' };
  const num = parseInt(dday.replace('D-', ''));
  if (num <= 3) return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-300', glow: 'shadow-red-100 shadow-md' };
  if (num <= 7) return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-300', glow: '' };
  return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', glow: '' };
}

// 그라데이션 매핑 (블루→레드→오렌지 전환) / Gradient mapping (blue→red→orange transition)
function getCardGradient(index: number): string {
  const gradients = [
    'from-blue-600 via-blue-500 to-indigo-500',    // 잡코리아 블루 / JobKorea blue
    'from-red-500 via-rose-500 to-pink-500',        // 알바몬 레드 / Albamon red
    'from-orange-400 via-amber-400 to-yellow-400',  // 당근 오렌지 / Karrot orange
    'from-blue-500 via-purple-500 to-red-500',      // 블루→레드 / Blue→Red
    'from-red-500 via-orange-500 to-amber-400',     // 레드→오렌지 / Red→Orange
    'from-indigo-500 via-blue-500 to-cyan-500',     // 인디고→블루 / Indigo→Blue
  ];
  return gradients[index % gradients.length];
}

// 개별 잡카드 컴포넌트 / Individual job card component
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const dday = getDDay(job.closingDate);
  const ddayColor = getDDayColor(dday);
  const salary = formatSalary(job);
  const gradient = getCardGradient(index);
  const distance = getDistance(job.location);
  const distLabel = getDistanceLabel(job.location);
  const distColor = getDistanceColor(job.location);

  return (
    <div
      className={`
        relative group rounded-2xl overflow-hidden bg-white
        border border-gray-200 transition-all duration-500 ease-out cursor-pointer
        ${isHovered
          ? 'shadow-2xl scale-[1.02] border-transparent -translate-y-1'
          : 'shadow-sm hover:shadow-md'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 상단 그라데이션 헤더 + 산업 이미지 / Top gradient header with industry image */}
      <div className="relative h-36 overflow-hidden">
        {/* 배경 이미지 / Background image */}
        <img
          src={job.industryImage}
          alt={job.industry}
          className={`
            absolute inset-0 w-full h-full object-cover transition-transform duration-700
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}
        />

        {/* 그라데이션 오버레이 (잡코리아 스타일) / Gradient overlay (JobKorea style) */}
        <div
          className={`
            absolute inset-0 bg-gradient-to-r ${gradient}
            transition-opacity duration-500
            ${isHovered ? 'opacity-75' : 'opacity-85'}
          `}
        />

        {/* 웨이브 장식 하단 / Wave decoration bottom */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 400 30" className="w-full h-6" preserveAspectRatio="none">
            <path d="M0,15 C100,0 200,30 400,10 L400,30 L0,30 Z" fill="white" />
          </svg>
        </div>

        {/* 상단 좌측: 프리미엄/긴급 배지 / Top left: premium/urgent badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {job.tierType === 'PREMIUM' && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[11px] font-bold rounded-full shadow-lg">
              <Star className="w-3 h-3" fill="currentColor" />
              PREMIUM
            </span>
          )}
          {job.isUrgent && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-[11px] font-bold rounded-full shadow-lg animate-pulse">
              <Flame className="w-3 h-3" />
              긴급
            </span>
          )}
          {job.isFeatured && !job.isUrgent && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 text-blue-600 text-[11px] font-bold rounded-full shadow">
              <TrendingUp className="w-3 h-3" />
              추천
            </span>
          )}
        </div>

        {/* 상단 우측: 좋아요 / Top right: like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className={`
            absolute top-3 right-3 w-8 h-8 flex items-center justify-center
            rounded-full backdrop-blur-sm transition-all duration-300
            ${isLiked ? 'bg-red-500 text-white scale-110' : 'bg-white/30 text-white hover:bg-white/50'}
          `}
        >
          <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
        </button>

        {/* 헤더 내 회사 정보 / Company info in header */}
        <div className="absolute bottom-6 left-4 right-4 flex items-end gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden border-2 border-white/50 flex-shrink-0">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="hidden text-lg font-bold text-gray-600">{job.companyInitial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-xs font-medium truncate drop-shadow">{job.company}</p>
            <p className="text-white text-sm font-bold truncate drop-shadow-lg">{job.industry}</p>
          </div>
        </div>
      </div>

      {/* 본문 영역 / Body area */}
      <div className="px-4 pt-3 pb-4">
        {/* 제목 / Title */}
        <h3 className="text-[15px] font-bold text-gray-900 leading-tight line-clamp-2 mb-2.5 group-hover:text-blue-600 transition-colors">
          {job.title}
        </h3>

        {/* 급여 (알바몬 스타일 강조) / Salary (Albamon style emphasis) */}
        <div className={`
          flex items-center gap-2 mb-3 px-3 py-2 rounded-lg transition-all duration-300
          ${job.hourlyWage
            ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-100'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
          }
        `}>
          <span className={`text-lg font-extrabold ${job.hourlyWage ? 'text-red-600' : 'text-blue-600'}`}>
            {salary}
          </span>
          {job.hourlyWage && (
            <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-500 font-bold rounded">
              시급
            </span>
          )}
        </div>

        {/* 위치 + 거리 (당근 스타일) / Location + distance (Karrot style) */}
        <div className={`
          flex items-center gap-2 mb-3 transition-all duration-500
          ${isHovered ? 'translate-x-0 opacity-100' : ''}
        `}>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-[13px] text-gray-600 truncate">{job.location}</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 flex-shrink-0 transition-all duration-500 ${isHovered ? 'scale-105' : ''}`}>
            <Navigation className={`w-3 h-3 ${distColor}`} />
            <span className={`text-[11px] font-bold ${distColor}`}>{distance}</span>
          </div>
        </div>

        {/* 호버 시: 거리 라벨 + 근무시간 / On hover: distance label + work hours */}
        <div className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isHovered ? 'max-h-24 opacity-100 mb-2' : 'max-h-0 opacity-0'}
        `}>
          {/* 당근마켓 동네 라벨 / Karrot neighborhood label */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`text-[11px] font-medium ${distColor}`}>
              {distLabel}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {job.workHours || '시간 협의'}
            </span>
          </div>
          {/* 경력 + 조회수 + 지원자 / Experience + views + applicants */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {job.experienceRequired || '무관'}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {job.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {job.applicantCount}명 지원
            </span>
          </div>
        </div>

        {/* 비자 배지 / Visa badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {job.allowedVisas.slice(0, 3).map((visa) => {
            const vc = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`
                  inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-semibold
                  ${vc.bg} ${vc.text} transition-transform duration-300
                  ${isHovered ? 'scale-105' : ''}
                `}
              >
                <Shield className="w-2.5 h-2.5" />
                {visa}
              </span>
            );
          })}
          {job.allowedVisas.length > 3 && (
            <span className="text-[11px] text-gray-400 font-medium self-center">
              +{job.allowedVisas.length - 3}
            </span>
          )}
        </div>

        {/* 혜택 태그 / Benefit tags */}
        <div className={`
          flex flex-wrap gap-1 mb-3 transition-all duration-500
          ${isHovered ? 'max-h-20 opacity-100' : 'max-h-5 opacity-70 overflow-hidden'}
        `}>
          {job.benefits.slice(0, isHovered ? 6 : 3).map((b) => (
            <span
              key={b}
              className="px-1.5 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded border border-gray-100"
            >
              {b}
            </span>
          ))}
        </div>

        {/* 하단: D-day 카운트다운 (알바몬 강조 스타일) + 매칭점수 / Bottom: D-day (Albamon style) + match score */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {/* D-day 카운트다운 / D-day countdown */}
          <div className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-500
            ${ddayColor.bg} ${ddayColor.text} ${ddayColor.border} ${ddayColor.glow}
            ${isHovered && dday && dday !== '상시모집' && dday !== '마감' ? 'scale-110' : ''}
          `}>
            <Timer className="w-3.5 h-3.5" />
            <span className="text-xs font-extrabold tracking-wide">{dday}</span>
          </div>

          {/* 매칭 점수 / Match score */}
          {job.matchScore && (
            <div className={`
              flex items-center gap-1 transition-all duration-500
              ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-70'}
            `}>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-600">{job.matchScore}%</span>
              <span className="text-[10px] text-gray-400">매칭</span>
            </div>
          )}

          {/* 화살표 / Arrow */}
          <ChevronRight className={`
            w-4 h-4 text-gray-300 transition-all duration-300
            ${isHovered ? 'translate-x-1 text-blue-500' : ''}
          `} />
        </div>
      </div>

      {/* 호버 시 하단 그라데이션 라인 / Hover bottom gradient line */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}
        transition-all duration-500
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `} />
    </div>
  );
}

// 메인 페이지 / Main page
export default function G090Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* 디자인 정보 헤더 / Design info header */}
      <div className="relative overflow-hidden">
        {/* 배경 그라데이션 / Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-red-500 to-orange-400 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between">
            <div>
              {/* 레퍼런스 뱃지 / Reference badges */}
              <div className="flex gap-2 mb-4">
                {designInfo.references.map((ref) => (
                  <span
                    key={ref}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30"
                  >
                    {ref}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-black text-white mb-2 drop-shadow-lg">
                {designInfo.id.toUpperCase()}: {designInfo.title}
              </h1>
              <p className="text-white/80 text-sm mb-1">{designInfo.titleEn}</p>
              <p className="text-white/60 text-xs max-w-xl">{designInfo.description}</p>
            </div>

            {/* 작성자 / Author */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Building2 className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm font-medium">{designInfo.author}</span>
            </div>
          </div>

          {/* 특징 태그 / Feature tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              '그라데이션 웨이브 헤더',
              'D-day 카운트다운 강조',
              '동네 거리 표시',
              '산업 이미지 배경',
              '블루→레드→오렌지 전환',
              '비자 배지 시스템',
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 text-white/90 text-xs rounded-full border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 하단 웨이브 / Bottom wave */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-12" preserveAspectRatio="none">
            <path d="M0,30 C360,0 720,60 1440,20 L1440,60 L0,60 Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* 섹션 타이틀 / Section title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 via-red-500 to-orange-400 rounded-full" />
            <h2 className="text-xl font-bold text-gray-900">
              내 주변 채용공고
              <span className="text-sm font-normal text-gray-400 ml-2">Nearby Jobs</span>
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
          <span className="text-sm text-gray-400">{sampleJobsV2.length}개의 공고</span>
        </div>

        {/* 3열 그리드 / 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleJobsV2.map((job, idx) => (
            <JobCard key={job.id} job={job} index={idx} />
          ))}
        </div>

        {/* 하단 범례 / Bottom legend */}
        <div className="mt-10 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            호버 인터랙션 가이드
            <span className="text-xs font-normal text-gray-400 ml-2">Hover Interaction Guide</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500">
            <div className="flex items-start gap-2.5 p-3 bg-blue-50/50 rounded-lg">
              <div className="w-8 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-700 mb-0.5">잡코리아 스타일</p>
                <p>그라데이션 헤더 + 라인 보더 + 이미지 줌</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-red-50/50 rounded-lg">
              <div className="w-8 h-1.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-700 mb-0.5">알바몬 스타일</p>
                <p>D-day 카운트다운 강조 + 시급 빨간 배경</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-orange-50/50 rounded-lg">
              <div className="w-8 h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-orange-700 mb-0.5">당근마켓 스타일</p>
                <p>동네 거리 표시 + 따뜻한 오렌지 뱃지</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
