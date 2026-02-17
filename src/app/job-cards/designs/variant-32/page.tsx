'use client';

// 시안 32: 메가 카드 (전체 정보 확장) / Variant 32: Mega Card (Full Detail Expanded)
// 최대 정보 밀도, 모든 필드 표시, 내부 탭 네비게이션
// Maximum information density, shows every field, internal tab navigation

import { useState } from 'react';
import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Briefcase,
  Star,
  Zap,
  Heart,
  Share2,
  Shield,
  Bus,
  UtensilsCrossed,
  Home,
  GraduationCap,
  Laptop,
  Plane,
  DollarSign,
  Timer,
  BadgeCheck,
  ChevronRight,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  Bookmark,
  Building2,
  Factory,
} from 'lucide-react';

// 탭 타입 / Tab type
type CardTab = 'overview' | 'details' | 'visa';

// 복리후생 아이콘 매핑 / Benefits icon mapping
const BENEFIT_ICON_MAP: Record<string, { icon: React.ReactNode; color: string }> = {
  '기숙사': { icon: <Home className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600' },
  '통근버스': { icon: <Bus className="w-4 h-4" />, color: 'bg-green-50 text-green-600' },
  '중식제공': { icon: <UtensilsCrossed className="w-4 h-4" />, color: 'bg-orange-50 text-orange-600' },
  '식사제공': { icon: <UtensilsCrossed className="w-4 h-4" />, color: 'bg-orange-50 text-orange-600' },
  '4대보험': { icon: <Shield className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-600' },
  '유니폼': { icon: <Briefcase className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600' },
  '재택근무': { icon: <Laptop className="w-4 h-4" />, color: 'bg-cyan-50 text-cyan-600' },
  '유연근무': { icon: <Clock className="w-4 h-4" />, color: 'bg-teal-50 text-teal-600' },
  '스톡옵션': { icon: <DollarSign className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600' },
  '식대지원': { icon: <UtensilsCrossed className="w-4 h-4" />, color: 'bg-orange-50 text-orange-600' },
  '안전장비': { icon: <Shield className="w-4 h-4" />, color: 'bg-red-50 text-red-600' },
  '숙소지원': { icon: <Home className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600' },
  '야간수당': { icon: <Timer className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600' },
  '주거지원': { icon: <Home className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600' },
  '항공권': { icon: <Plane className="w-4 h-4" />, color: 'bg-sky-50 text-sky-600' },
  '의료보험': { icon: <Shield className="w-4 h-4" />, color: 'bg-rose-50 text-rose-600' },
  '연차': { icon: <Calendar className="w-4 h-4" />, color: 'bg-violet-50 text-violet-600' },
};

// 비자 유형별 상세 정보 / Visa type detail info
const VISA_DETAILS: Record<string, { name: string; description: string; color: string }> = {
  'E-2': { name: '회화지도', description: '외국어 회화 지도', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  'E-7-1': { name: '특정활동', description: '전문 인력 취업', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  'E-9': { name: '비전문취업', description: '단순 노무 분야 취업', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  'F-2': { name: '거주', description: '장기 거주 허가', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  'F-4': { name: '재외동포', description: '재외동포 체류 자격', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  'F-5': { name: '영주', description: '영주 자격 보유자', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  'H-2': { name: '방문취업', description: '동포 단기 취업', color: 'bg-teal-100 text-teal-800 border-teal-200' },
};

// 미니 바 차트 컴포넌트 / Mini bar chart component
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// D-day 색상 스타일 / D-day color style
function getDDayStyle(dDay: string | null): string {
  if (!dDay) return 'bg-gray-100 text-gray-500';
  if (dDay === '마감') return 'bg-gray-200 text-gray-500';
  if (dDay === 'D-Day') return 'bg-red-500 text-white';
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 3) return 'bg-red-500 text-white';
  if (!isNaN(num) && num <= 7) return 'bg-orange-500 text-white';
  return 'bg-gray-600 text-white';
}

// 매칭 점수 색상 / Match score color
function getMatchScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function getMatchScoreBarColor(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function getMatchScoreLabel(score: number): string {
  if (score >= 90) return '매우 적합';
  if (score >= 70) return '적합';
  if (score >= 50) return '보통';
  return '부족';
}

// 개별 메가 카드 컴포넌트 / Individual mega card component
function MegaJobCard({ job }: { job: MockJobPosting }) {
  // 활성 탭 상태 / Active tab state
  const [activeTab, setActiveTab] = useState<CardTab>('overview');
  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedDate);

  // 회사 로고 이니셜 / Company logo initial
  const logoInitial = job.company.charAt(0);

  // 탭 목록 / Tab list
  const tabs: { key: CardTab; label: string }[] = [
    { key: 'overview', label: '개요' },
    { key: 'details', label: '상세정보' },
    { key: 'visa', label: '비자정보' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* === 헤더 섹션 / Header section === */}
      <div className="p-5 pb-4 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {/* 회사 로고 / Company logo */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-gray-600">{logoInitial}</span>
          </div>

          {/* 제목 + 회사 정보 / Title + company info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600 font-medium">{job.company}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Factory className="w-3.5 h-3.5" />
                    {job.industry}
                  </span>
                </div>
              </div>

              {/* D-day 배지 / D-day badge */}
              {dDay && (
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex-shrink-0 ${getDDayStyle(dDay)}`}>
                  {dDay}
                </span>
              )}
            </div>

            {/* 상태 배지 행 / Status badge row */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {/* 고용형태 배지 / Employment type badge */}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                job.boardType === 'FULL_TIME'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-green-50 text-green-700'
              }`}>
                {job.boardType === 'FULL_TIME' ? '정규직' : '알바'}
              </span>
              {/* 등급 배지 / Tier badge */}
              {job.tierType === 'PREMIUM' && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-medium">
                  <Star className="w-3 h-3" />
                  프리미엄
                </span>
              )}
              {/* 긴급 배지 / Urgent badge */}
              {job.isUrgent && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-red-50 text-red-600 text-xs font-medium">
                  <Zap className="w-3 h-3" />
                  긴급
                </span>
              )}
              {/* 추천 배지 / Featured badge */}
              {job.isFeatured && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-violet-50 text-violet-600 text-xs font-medium">
                  <BadgeCheck className="w-3 h-3" />
                  추천
                </span>
              )}
              {/* 경력 / Experience */}
              {job.experienceRequired && (
                <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-xs">
                  경력 {job.experienceRequired}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === 탭 네비게이션 / Tab navigation === */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === 탭 콘텐츠 / Tab content === */}
      <div className="p-5">
        {/* 개요 탭 / Overview tab */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* 핵심 정보 그리드 / Key info grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* 급여 / Salary */}
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">급여</span>
                </div>
                <p className="text-sm font-bold text-blue-900">{salary}</p>
              </div>
              {/* 위치 / Location */}
              <div className="bg-green-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">근무지</span>
                </div>
                <p className="text-sm font-bold text-green-900">{job.location}</p>
              </div>
              {/* 근무시간 / Work hours */}
              <div className="bg-amber-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-600 font-medium">근무시간</span>
                </div>
                <p className="text-sm font-bold text-amber-900">{job.workHours || '협의'}</p>
              </div>
              {/* 경력 / Experience */}
              <div className="bg-purple-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <GraduationCap className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">요구경력</span>
                </div>
                <p className="text-sm font-bold text-purple-900">{job.experienceRequired || '무관'}</p>
              </div>
            </div>

            {/* 비자 호환 요약 / Visa compatibility summary */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                호환 비자 / Compatible Visas
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {job.allowedVisas.map((visa) => {
                  const detail = VISA_DETAILS[visa];
                  return (
                    <span
                      key={visa}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        detail ? detail.color : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {visa}
                      {detail && (
                        <span className="opacity-70">({detail.name})</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 통계 행 (미니 차트 포함) / Stats row with mini charts */}
            <div className="grid grid-cols-3 gap-3">
              {/* 지원자 수 / Applicant count */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">지원자</span>
                </div>
                <p className="text-lg font-bold text-gray-800">{job.applicantCount}</p>
                <MiniBar value={job.applicantCount} max={200} color="bg-blue-400" />
              </div>
              {/* 조회수 / View count */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">조회수</span>
                </div>
                <p className="text-lg font-bold text-gray-800">{job.viewCount.toLocaleString()}</p>
                <MiniBar value={job.viewCount} max={6000} color="bg-green-400" />
              </div>
              {/* 매칭 점수 / Match score */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">매칭</span>
                </div>
                <p className={`text-lg font-bold ${job.matchScore !== undefined ? getMatchScoreColor(job.matchScore) : 'text-gray-400'}`}>
                  {job.matchScore !== undefined ? `${job.matchScore}%` : '-'}
                </p>
                {job.matchScore !== undefined && (
                  <MiniBar value={job.matchScore} max={100} color={getMatchScoreBarColor(job.matchScore)} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* 상세정보 탭 / Details tab */}
        {activeTab === 'details' && (
          <div className="space-y-5">
            {/* 기본 정보 테이블 / Basic info table */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                기본 정보 / Basic Information
              </h4>
              <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
                {/* 고용형태 / Employment type */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    고용형태
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임/알바'}
                  </span>
                </div>
                {/* 업종 / Industry */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Factory className="w-4 h-4" />
                    업종
                  </span>
                  <span className="text-sm font-medium text-gray-800">{job.industry}</span>
                </div>
                {/* 근무지 / Location */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    근무지
                  </span>
                  <span className="text-sm font-medium text-gray-800">{job.location}</span>
                </div>
                {/* 급여 / Salary */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    급여
                  </span>
                  <span className="text-sm font-medium text-gray-800">{salary}</span>
                </div>
                {/* 근무시간 / Work hours */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    근무시간
                  </span>
                  <span className="text-sm font-medium text-gray-800">{job.workHours || '협의'}</span>
                </div>
                {/* 요구경력 / Experience */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    요구경력
                  </span>
                  <span className="text-sm font-medium text-gray-800">{job.experienceRequired || '무관'}</span>
                </div>
                {/* 등급 / Tier */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    공고 등급
                  </span>
                  <span className={`text-sm font-medium ${job.tierType === 'PREMIUM' ? 'text-amber-600' : 'text-gray-600'}`}>
                    {job.tierType === 'PREMIUM' ? 'PREMIUM' : 'STANDARD'}
                  </span>
                </div>
                {/* 게시일 / Posted date */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    게시일
                  </span>
                  <span className="text-sm font-medium text-gray-800">{job.postedDate} ({timeAgo})</span>
                </div>
                {/* 마감일 / Closing date */}
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    마감일
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {job.closingDate || '상시모집'}
                    {dDay && dDay !== '상시모집' && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${getDDayStyle(dDay)}`}>{dDay}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* 복리후생 그리드 / Benefits grid */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                복리후생 / Benefits
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {job.benefits.map((benefit) => {
                  const mapped = BENEFIT_ICON_MAP[benefit];
                  return (
                    <div
                      key={benefit}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${
                        mapped ? mapped.color : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {mapped ? mapped.icon : <Star className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 공고 상태 플래그 / Posting status flags */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                공고 상태 / Posting Status
              </h4>
              <div className="flex flex-wrap gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  job.isUrgent ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  <Zap className="w-3.5 h-3.5" />
                  긴급채용 {job.isUrgent ? 'ON' : 'OFF'}
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  job.isFeatured ? 'bg-violet-50 text-violet-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  <BadgeCheck className="w-3.5 h-3.5" />
                  추천공고 {job.isFeatured ? 'ON' : 'OFF'}
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  job.tierType === 'PREMIUM' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  <Star className="w-3.5 h-3.5" />
                  {job.tierType === 'PREMIUM' ? '프리미엄' : '일반'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 비자정보 탭 / Visa info tab */}
        {activeTab === 'visa' && (
          <div className="space-y-4">
            {/* 매칭 점수 헤더 / Match score header */}
            {job.matchScore !== undefined && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-gray-800">비자 매칭 적합도</h4>
                  <span className={`text-2xl font-bold ${getMatchScoreColor(job.matchScore)}`}>
                    {job.matchScore}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getMatchScoreBarColor(job.matchScore)}`}
                    style={{ width: `${job.matchScore}%` }}
                  />
                </div>
                <p className={`text-xs mt-1.5 font-medium ${getMatchScoreColor(job.matchScore)}`}>
                  {getMatchScoreLabel(job.matchScore)}
                </p>
              </div>
            )}

            {/* 호환 비자 상세 목록 / Compatible visa detail list */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                호환 비자 유형 ({job.allowedVisas.length}개) / Compatible Visa Types
              </h4>
              <div className="space-y-2">
                {job.allowedVisas.map((visa) => {
                  const detail = VISA_DETAILS[visa];
                  return (
                    <div
                      key={visa}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        detail ? detail.color : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold">{visa}</span>
                        {detail && (
                          <div>
                            <p className="text-sm font-medium">{detail.name}</p>
                            <p className="text-xs opacity-70">{detail.description}</p>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 비자 관련 안내 / Visa guidance note */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    위 비자 유형은 잡차자 매칭 엔진이 공고 조건을 기반으로 자동 분석한 결과입니다.
                    실제 채용 가능 여부는 개별 지원자의 체류자격 상태에 따라 달라질 수 있습니다.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    The above visa types are automatically analyzed by the JobChaja matching engine based on job posting conditions.
                    Actual eligibility may vary depending on individual applicant&apos;s residency status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* === 액션 바 / Action bar === */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
        {/* 좌측: 게시 정보 / Left: posting info */}
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {timeAgo} 등록
        </div>

        {/* 우측: 액션 버튼들 / Right: action buttons */}
        <div className="flex items-center gap-2">
          {/* 공유 버튼 / Share button */}
          <button
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="공유 / Share"
          >
            <Share2 className="w-4 h-4 text-gray-500" />
          </button>
          {/* 스크랩 버튼 / Bookmark button */}
          <button
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="스크랩 / Bookmark"
          >
            <Bookmark className="w-4 h-4 text-gray-500" />
          </button>
          {/* 지원하기 버튼 / Apply button */}
          <button className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
            지원하기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 메인 페이지 / Main page
export default function Variant32Page() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          채용공고 상세 목록
        </h1>
        <p className="text-sm text-gray-500">
          전체 정보가 표시된 메가 카드 뷰 / Mega card view with full details
        </p>
      </div>

      {/* 2열 그리드 레이아웃 (모바일 1열) / 2-column grid layout (1 col on mobile) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleJobs.map((job) => (
          <MegaJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
