'use client';

// 시안 29: 보딩패스 / 티켓 카드 / Variant 29: Boarding Pass / Ticket Card
// 항공 탑승권 스타일 — 수평 레이아웃, 출발-도착 구조, 점선 절취선, 바코드 스텁
// Airline boarding pass style — horizontal layout, departure-arrival structure, perforated tear line, barcode stub

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  Plane,
  MapPin,
  Clock,
  Calendar,
  Users,
  Eye,
  Crown,
  AlertTriangle,
  Star,
  Briefcase,
  Shield,
  ArrowRight,
} from 'lucide-react';

// 산업별 항공사 코드 매핑 / Industry to airline-style code mapping
function getAirlineCode(industry: string): string {
  const codeMap: Record<string, string> = {
    '제조': 'MFG',
    '숙박/음식': 'HSP',
    'IT/소프트웨어': 'TEC',
    '건설': 'CON',
    '물류/운송': 'LOG',
    '교육': 'EDU',
  };
  return codeMap[industry] || 'JCJ';
}

// 산업별 테마 색상 / Industry theme colors
function getIndustryColors(industry: string): { bg: string; text: string; accent: string; light: string } {
  const colorMap: Record<string, { bg: string; text: string; accent: string; light: string }> = {
    '제조': { bg: 'bg-blue-600', text: 'text-blue-600', accent: 'border-blue-600', light: 'bg-blue-50' },
    '숙박/음식': { bg: 'bg-orange-600', text: 'text-orange-600', accent: 'border-orange-600', light: 'bg-orange-50' },
    'IT/소프트웨어': { bg: 'bg-violet-600', text: 'text-violet-600', accent: 'border-violet-600', light: 'bg-violet-50' },
    '건설': { bg: 'bg-amber-600', text: 'text-amber-600', accent: 'border-amber-600', light: 'bg-amber-50' },
    '물류/운송': { bg: 'bg-teal-600', text: 'text-teal-600', accent: 'border-teal-600', light: 'bg-teal-50' },
    '교육': { bg: 'bg-emerald-600', text: 'text-emerald-600', accent: 'border-emerald-600', light: 'bg-emerald-50' },
  };
  return colorMap[industry] || { bg: 'bg-gray-600', text: 'text-gray-600', accent: 'border-gray-600', light: 'bg-gray-50' };
}

// 편명(Flight number) 생성 / Generate flight number from job ID
function getFlightNumber(job: MockJobPosting): string {
  const code = getAirlineCode(job.industry);
  const num = job.id.replace(/\D/g, '').padStart(3, '0');
  return `${code}-${num}`;
}

// 게이트 번호 (비자 유형 기반) / Gate number based on visa type
function getGateNumber(job: MockJobPosting): string {
  const primaryVisa = job.allowedVisas[0] || 'N/A';
  return primaryVisa;
}

// 좌석 번호 생성 / Generate seat number
function getSeatNumber(job: MockJobPosting): string {
  const row = (parseInt(job.id.replace(/\D/g, ''), 10) * 7) % 30 + 1;
  const col = String.fromCharCode(65 + (parseInt(job.id.replace(/\D/g, ''), 10) % 6));
  return `${row}${col}`;
}

// 날짜 포맷 (보딩패스 스타일) / Date format boarding-pass style
function formatBoardingDate(dateStr: string): { day: string; monthYear: string; time: string } {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
  const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  return { day, monthYear, time };
}

// 바코드 패턴 생성 / Generate barcode pattern
function generateBarcode(jobId: string): number[] {
  const seed = jobId.charCodeAt(jobId.length - 1);
  return Array.from({ length: 32 }, (_, i) => {
    const val = ((seed * (i + 1) * 17) % 100);
    return val > 40 ? (val > 70 ? 3 : 2) : 1;
  });
}

// 보딩패스 카드 컴포넌트 / Boarding Pass Card component
function BoardingPassCard({ job }: { job: MockJobPosting }) {
  const colors = getIndustryColors(job.industry);
  const flightNo = getFlightNumber(job);
  const gate = getGateNumber(job);
  const seat = getSeatNumber(job);
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);
  const postedFormatted = formatBoardingDate(job.postedDate);
  const closingFormatted = job.closingDate ? formatBoardingDate(job.closingDate) : null;
  const barcode = generateBarcode(job.id);
  const isPremium = job.tierType === 'PREMIUM';
  const isUrgent = job.isUrgent;

  return (
    <div className="relative group">
      {/* 카드 그림자 배경 / Card shadow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl translate-y-1 translate-x-1 opacity-50" />

      {/* 메인 카드 / Main card */}
      <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
        {/* 상단 헤더 바 / Top header bar — "BOARDING PASS" */}
        <div className={`${colors.bg} px-4 sm:px-6 py-2 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-xs tracking-[0.3em] uppercase">
              Boarding Pass
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* 프리미엄 배지 / Premium badge */}
            {isPremium && (
              <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PREMIUM
              </span>
            )}
            {/* 긴급 배지 / Urgent badge */}
            {isUrgent && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                URGENT
              </span>
            )}
            <span className="text-white/80 text-xs font-mono">{flightNo}</span>
          </div>
        </div>

        {/* 카드 본체 — 수평 레이아웃 / Card body — horizontal layout */}
        <div className="flex flex-col sm:flex-row">
          {/* 왼쪽: 메인 정보 섹션 / Left: Main info section */}
          <div className="flex-1 p-4 sm:p-5">
            {/* 출발 → 도착 구조 / Departure → Arrival structure */}
            <div className="flex items-start justify-between gap-3 mb-4">
              {/* 출발 (현재 상태) / Departure (current status) */}
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  {/* 출발 / Departure */}
                  From
                </p>
                <p className={`text-2xl sm:text-3xl font-black ${colors.text} leading-tight`}>
                  {getAirlineCode(job.industry)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{job.industry}</p>
              </div>

              {/* 화살표 + 비행기 아이콘 / Arrow + plane icon */}
              <div className="flex flex-col items-center pt-3">
                <div className="flex items-center gap-1">
                  <div className="w-8 sm:w-12 h-px bg-gray-300" />
                  <Plane className={`w-5 h-5 ${colors.text} rotate-0`} />
                  <div className="w-8 sm:w-12 h-px bg-gray-300" />
                </div>
                <p className="text-[9px] text-gray-400 mt-1">
                  {job.boardType === 'FULL_TIME' ? 'DIRECT' : 'PART-TIME'}
                </p>
              </div>

              {/* 도착 (목적지 = 회사) / Arrival (destination = company) */}
              <div className="flex-1 text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                  {/* 도착 / Arrival */}
                  To
                </p>
                <p className={`text-2xl sm:text-3xl font-black ${colors.text} leading-tight`}>
                  JOB
                </p>
                <p className="text-xs text-gray-500 mt-1">{job.location}</p>
              </div>
            </div>

            {/* 공고 제목 / Job title */}
            <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
              {job.title}
            </h3>

            {/* 회사명 / Company name */}
            <div className="flex items-center gap-1.5 mb-3">
              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-600 font-medium">{job.company}</span>
            </div>

            {/* 편명 정보 그리드 / Flight info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-dashed border-gray-200">
              {/* 편명 / Flight */}
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">Flight</p>
                <p className="text-sm font-bold font-mono text-gray-800">{flightNo}</p>
              </div>
              {/* 게이트 (비자) / Gate (visa) */}
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">Gate</p>
                <p className={`text-sm font-bold font-mono ${colors.text}`}>{gate}</p>
              </div>
              {/* 좌석 / Seat */}
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">Seat</p>
                <p className="text-sm font-bold font-mono text-gray-800">{seat}</p>
              </div>
              {/* 클래스 / Class */}
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">Class</p>
                <p className="text-sm font-bold font-mono text-gray-800">
                  {isPremium ? 'FIRST' : 'ECONOMY'}
                </p>
              </div>
            </div>

            {/* 출발/도착 시간 / Departure/Arrival times */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                  {/* 탑승(등록일) / Boarding (posted date) */}
                  Boarding
                </p>
                <p className="text-xs font-mono text-gray-700">
                  {postedFormatted.day} {postedFormatted.monthYear}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
              <div className="text-right">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                  {/* 마감일 / Closing date */}
                  Landing
                </p>
                <p className="text-xs font-mono text-gray-700">
                  {closingFormatted
                    ? `${closingFormatted.day} ${closingFormatted.monthYear}`
                    : 'OPEN'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">Status</p>
                <p className={`text-xs font-bold ${
                  dDay === '마감' ? 'text-red-500' :
                  dDay === 'D-Day' ? 'text-red-500' :
                  'text-green-600'
                }`}>
                  {dDay}
                </p>
              </div>
            </div>

            {/* 비자 유형 목록 / Visa type list */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.allowedVisas.map((visa) => (
                <span
                  key={visa}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${colors.light} ${colors.text}`}
                >
                  {visa}
                </span>
              ))}
            </div>
          </div>

          {/* 절취선 (점선 + 원형 커팅) / Perforated tear line (dashed + circle cutouts) */}
          <div className="relative hidden sm:flex flex-col items-center justify-center w-0">
            {/* 상단 반원 커팅 / Top semicircle cutout */}
            <div className="absolute -top-3 w-6 h-6 bg-gray-100 rounded-full z-10" />
            {/* 점선 / Dashed line */}
            <div className="w-px h-full border-l-2 border-dashed border-gray-300" />
            {/* 하단 반원 커팅 / Bottom semicircle cutout */}
            <div className="absolute -bottom-3 w-6 h-6 bg-gray-100 rounded-full z-10" />
          </div>

          {/* 모바일 가로 절취선 / Mobile horizontal tear line */}
          <div className="relative flex sm:hidden items-center justify-center h-0">
            {/* 좌측 반원 커팅 / Left semicircle cutout */}
            <div className="absolute -left-3 w-6 h-6 bg-gray-100 rounded-full z-10" />
            {/* 점선 / Dashed line */}
            <div className="w-full h-px border-t-2 border-dashed border-gray-300" />
            {/* 우측 반원 커팅 / Right semicircle cutout */}
            <div className="absolute -right-3 w-6 h-6 bg-gray-100 rounded-full z-10" />
          </div>

          {/* 오른쪽 스텁: 바코드 + 요약 / Right stub: barcode + summary */}
          <div className="sm:w-36 p-4 sm:p-3 flex sm:flex-col items-center sm:items-stretch justify-between sm:justify-start gap-3 bg-gray-50/50">
            {/* 급여 / Salary */}
            <div className="text-center sm:mb-2">
              <p className="text-[9px] text-gray-400 uppercase tracking-wider">Fare</p>
              <p className={`text-xs font-bold ${colors.text} mt-0.5`}>{salary}</p>
            </div>

            {/* 통계 / Stats */}
            <div className="flex sm:flex-col gap-3 sm:gap-2 text-center sm:mb-3">
              <div className="flex items-center gap-1 justify-center">
                <Users className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-500">{job.applicantCount}</span>
              </div>
              <div className="flex items-center gap-1 justify-center">
                <Eye className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-500">{job.viewCount.toLocaleString()}</span>
              </div>
            </div>

            {/* 매칭 점수 / Match score */}
            {job.matchScore && (
              <div className="text-center sm:mb-3">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">Match</p>
                <p className={`text-lg font-black ${
                  job.matchScore >= 80 ? 'text-green-600' :
                  job.matchScore >= 60 ? 'text-yellow-600' :
                  'text-red-500'
                }`}>
                  {job.matchScore}%
                </p>
              </div>
            )}

            {/* 바코드 / Barcode */}
            <div className="flex items-end gap-px h-10 sm:mt-auto">
              {barcode.map((width, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-sm"
                  style={{
                    width: `${width}px`,
                    height: `${14 + ((i * 3) % 16)}px`,
                  }}
                />
              ))}
            </div>

            {/* 공고 ID / Job ID */}
            <p className="text-[8px] font-mono text-gray-400 text-center mt-1 hidden sm:block">
              {job.id.toUpperCase()}
            </p>
          </div>
        </div>

        {/* 하단 정보 바 / Bottom info bar */}
        <div className={`${colors.light} px-4 sm:px-6 py-2 flex items-center justify-between border-t border-gray-100`}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-400">
              <Clock className="w-3 h-3 inline mr-1" />
              {timeAgo}
            </span>
            <span className="text-[10px] text-gray-400">
              <MapPin className="w-3 h-3 inline mr-1" />
              {job.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {job.isFeatured && (
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            )}
            {job.experienceRequired && (
              <span className="text-[10px] text-gray-400">
                <Shield className="w-3 h-3 inline mr-1" />
                {job.experienceRequired}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant29Page() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {/* 시안 29: 보딩패스 카드 / Variant 29: Boarding Pass Card */}
              Variant 29 -- Boarding Pass Card
            </h1>
            <p className="text-sm text-gray-500">
              {/* 항공 탑승권 스타일 채용공고 카드 / Airline boarding pass style job cards */}
              Airline boarding pass style job listing cards
            </p>
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-5xl mx-auto space-y-6">
        {sampleJobs.map((job) => (
          <BoardingPassCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
