'use client';

// Variant 04: Visa Badge Hero (잡차자 오리지널)
// 비자 배지가 히어로 요소인 잡차자만의 독창적 카드 디자인
// Visa badges as the HERO element - unique to JobChaja, visa-first design

import {
  Shield,
  MapPin,
  Clock,
  Crown,
  Flame,
  TrendingUp,
  Building2,
  ChevronRight,
} from 'lucide-react';
import {
  sampleJobs,
  getDDay,
  formatSalary,
  getTimeAgo,
  type MockJobPosting,
} from '../_mock/job-mock-data';

// 비자 유형별 컬러 맵 / Visa type color map (each visa gets a unique color)
const visaColorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'E-9':   { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  'H-2':   { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'F-2':   { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-500' },
  'F-4':   { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  'F-5':   { bg: 'bg-pink-100',   text: 'text-pink-800',   border: 'border-pink-200',   dot: 'bg-pink-500' },
  'E-7-1': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', dot: 'bg-orange-500' },
  'E-2':   { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-200',    dot: 'bg-red-500' },
};

// 기본 비자 컬러 / Default visa color fallback
const defaultVisaColor = { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', dot: 'bg-gray-500' };

// 비자 컬러 가져오기 / Get visa color
function getVisaColor(visa: string) {
  return visaColorMap[visa] || defaultVisaColor;
}

// 매칭 점수 컬러 / Match score color gradient
function getScoreColor(score: number): { bar: string; label: string; bg: string } {
  if (score >= 90) return { bar: 'bg-green-500', label: 'text-green-700', bg: 'bg-green-50' };
  if (score >= 70) return { bar: 'bg-blue-500', label: 'text-blue-700', bg: 'bg-blue-50' };
  if (score >= 50) return { bar: 'bg-yellow-500', label: 'text-yellow-700', bg: 'bg-yellow-50' };
  return { bar: 'bg-red-500', label: 'text-red-700', bg: 'bg-red-50' };
}

// 매칭 점수 텍스트 / Match score label text
function getScoreLabel(score: number): string {
  if (score >= 90) return '매우 적합';  // Very suitable
  if (score >= 70) return '적합';       // Suitable
  if (score >= 50) return '보통';       // Average
  return '낮음';                        // Low
}

// 개별 카드 컴포넌트 / Individual card component
function JobCard({ job }: { job: MockJobPosting }) {
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const matchScore = job.matchScore ?? 0;
  const scoreColor = getScoreColor(matchScore);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      {/* 비자 히어로 섹션 / Visa HERO section - the main differentiator */}
      <div className="px-5 pt-5 pb-3">
        {/* 라벨: 채용 가능 비자 / Label: eligible visas */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-indigo-600 tracking-tight">
              채용 가능 비자
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {job.allowedVisas.length}개
            </span>
          </div>

          {/* 프리미엄/긴급 배지 / Premium & urgent badges */}
          <div className="flex gap-1">
            {job.tierType === 'PREMIUM' && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded border border-yellow-200">
                <Crown className="w-2.5 h-2.5" />
                P
              </span>
            )}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-200">
                <Flame className="w-2.5 h-2.5" />
                긴급
              </span>
            )}
          </div>
        </div>

        {/* 대형 비자 배지 그리드 / Large visa badge grid - HERO element */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.allowedVisas.map((visa) => {
            const vc = getVisaColor(visa);
            return (
              <div
                key={visa}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl ${vc.bg} ${vc.text} border ${vc.border} font-bold text-sm transition-transform group-hover:scale-105`}
              >
                <div className={`w-2 h-2 rounded-full ${vc.dot}`} />
                {visa}
              </div>
            );
          })}
        </div>
      </div>

      {/* 구분선 / Divider */}
      <div className="mx-5 border-t border-gray-100" />

      {/* 본문 영역 / Body section */}
      <div className="px-5 py-4">
        {/* 공고 제목 / Job title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {job.title}
        </h3>

        {/* 기업명 / Company name */}
        <div className="flex items-center gap-1.5 mb-3">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm text-gray-500">{job.company}</span>
        </div>

        {/* 급여 정보 / Salary info */}
        <p className="text-sm font-bold text-gray-800 mb-4">{salary}</p>

        {/* 매칭 점수 프로그레스 바 / Match score progress bar */}
        {matchScore > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">비자 적합도</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${scoreColor.bg} ${scoreColor.label}`}>
                적합도 {matchScore}%
                <span className="text-[10px] font-medium opacity-70">
                  ({getScoreLabel(matchScore)})
                </span>
              </span>
            </div>
            {/* 프로그레스 바 / Progress bar with gradient */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${scoreColor.bar} transition-all duration-700 ease-out`}
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 하단 푸터 / Bottom footer */}
      <div className="px-5 py-3 bg-gray-50/70 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 위치 / Location */}
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            {/* 게시일 / Posted date */}
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>

          {/* D-day + 상세보기 / D-day + view detail */}
          <div className="flex items-center gap-2">
            {dDay && (
              <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                dDay === '마감' ? 'bg-gray-200 text-gray-500' :
                dDay === 'D-Day' ? 'bg-red-100 text-red-600 animate-pulse' :
                dDay === '상시모집' ? 'bg-gray-100 text-gray-600' :
                parseInt(dDay.replace('D-', '')) <= 7
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {dDay}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant04Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
              Variant 04
            </span>
            <span className="text-gray-400 text-sm">|</span>
            <span className="text-gray-500 text-sm">잡차자 오리지널 / JobChaja Original</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Visa Badge Hero
          </h1>
          <p className="text-gray-500 text-base max-w-2xl">
            비자 배지가 카드의 주인공. 각 비자 유형별 고유 컬러로 시각적 구분을 극대화하고,
            적합도 프로그레스 바로 매칭 품질을 직관적으로 전달합니다.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Visa badges are the HERO element. Each visa type gets its own color. Match score progress bar shows compatibility at a glance. No other job site has this design.
          </p>
        </div>

        {/* 비자 컬러 범례 / Visa color legend */}
        <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-xs font-bold text-gray-500 mb-2.5">비자 컬러 범례 / Visa Color Legend</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(visaColorMap).map(([visa, vc]) => (
              <div
                key={visa}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${vc.bg} ${vc.text} border ${vc.border} text-xs font-bold`}
              >
                <div className={`w-2 h-2 rounded-full ${vc.dot}`} />
                {visa}
              </div>
            ))}
          </div>
        </div>

        {/* 반응형 그리드 / Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* 디자인 노트 / Design notes */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-gray-200">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Design Notes</h2>
          <ul className="space-y-1.5 text-sm text-gray-500">
            <li>- 비자 배지가 카드 최상단에 히어로 요소로 배치 (E-9 파랑, H-2 초록, F-2 보라, E-7 주황, E-2 빨강)</li>
            <li>- Shield 아이콘 + "채용 가능 비자" 라벨로 잡차자의 핵심 가치 전달</li>
            <li>- 적합도 프로그레스 바 (0-100%)와 컬러 그라데이션으로 매칭 품질 시각화</li>
            <li>- 점수별 텍스트 라벨: 매우 적합(90+), 적합(70+), 보통(50+), 낮음</li>
            <li>- 하단 회색 푸터에 위치 + D-day 정보 분리</li>
            <li>- Visa badges as top HERO element with unique colors per visa type</li>
            <li>- Match score progress bar (0-100%) with color-coded gradient</li>
            <li>- This visa-first design is unique to JobChaja - no other job site has it</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
