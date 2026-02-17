'use client';

// 시안 15: 칸반 카드 (Trello/Notion 보드 스타일) / Variant 15: Kanban Card (Trello/Notion Board Style)
// 고용형태별 칸반 컬럼으로 구성, 컴팩트 카드에 드래그 핸들, 업종별 색상 보더, 지원자 아바타 서클
// Kanban columns by employment type, compact cards with drag handles, industry-colored borders, applicant avatar circles

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  GripVertical,
  CalendarDays,
  Briefcase,
  Plus,
  MoreHorizontal,
  Shield,
  Star,
  Zap,
  Filter,
  Search,
} from 'lucide-react';

// 업종별 색상 매핑 / Industry color mapping
const industryColors: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  '제조': { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  '숙박/음식': { border: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  'IT/소프트웨어': { border: 'border-l-violet-500', bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  '건설': { border: 'border-l-amber-600', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-600' },
  '물류/운송': { border: 'border-l-teal-500', bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
  '교육': { border: 'border-l-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
};

// 기본 색상 / Default colors
const defaultColor = { border: 'border-l-gray-400', bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' };

// 업종 색상 가져오기 / Get industry color
function getIndustryColor(industry: string) {
  return industryColors[industry] || defaultColor;
}

// 지원자 아바타 이니셜 생성 / Generate applicant avatar initials
const avatarInitials = ['K', 'P', 'N', 'T', 'V', 'M', 'J', 'L'];
const avatarColors = [
  'bg-sky-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400',
  'bg-violet-400', 'bg-indigo-400', 'bg-pink-400', 'bg-cyan-400',
];

// D-day 배지 스타일 / D-day badge style
function getDDayStyle(dDay: string | null): string {
  if (!dDay || dDay === '상시모집') return 'bg-gray-100 text-gray-500';
  if (dDay === '마감') return 'bg-gray-200 text-gray-400 line-through';
  if (dDay === 'D-Day') return 'bg-red-100 text-red-600 animate-pulse';
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 3) return 'bg-red-100 text-red-600';
  if (!isNaN(num) && num <= 7) return 'bg-orange-100 text-orange-600';
  return 'bg-slate-100 text-slate-600';
}

// 칸반 카드 컴포넌트 / Kanban card component
function KanbanCard({ job }: { job: MockJobPosting }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 업종 색상 / Industry color
  const color = getIndustryColor(job.industry);
  // 표시할 아바타 수 / Number of avatars to display
  const visibleAvatars = Math.min(job.applicantCount, 4);
  // 초과 지원자 수 / Excess applicant count
  const extraCount = job.applicantCount - visibleAvatars;

  return (
    <div
      className={`group relative bg-white rounded-lg border border-gray-200 border-l-4 ${color.border}
        shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
    >
      {/* 드래그 핸들 영역 / Drag handle area */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-gray-300" />
      </div>

      {/* 카드 본문 / Card body */}
      <div className="p-3 pl-5">
        {/* 상단: 프리미엄/긴급 배지 + 더보기 버튼 / Top: Premium/Urgent badges + more button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {/* 프리미엄 배지 / Premium badge */}
            {job.tierType === 'PREMIUM' && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                PRO
              </span>
            )}
            {/* 긴급 배지 / Urgent badge */}
            {job.isUrgent && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">
                <Zap className="w-3 h-3 fill-red-500 text-red-500" />
                긴급
              </span>
            )}
            {/* 추천 배지 / Featured badge */}
            {job.isFeatured && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-600">
                추천
              </span>
            )}
          </div>
          {/* 더보기 버튼 / More options button */}
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 공고 제목 / Job title */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
          {job.title}
        </h3>

        {/* 기업명 / Company name */}
        <p className="text-xs text-gray-500 mb-2 truncate">{job.company}</p>

        {/* 급여 정보 / Salary info */}
        <div className="text-xs font-semibold text-gray-800 mb-2.5">
          {salary}
        </div>

        {/* 비자 라벨 칩 / Visa label chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {job.allowedVisas.slice(0, 3).map((visa) => (
            <span
              key={visa}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <Shield className="w-2.5 h-2.5" />
              {visa}
            </span>
          ))}
          {/* 추가 비자 수 / Additional visa count */}
          {job.allowedVisas.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium text-gray-500 bg-gray-100">
              +{job.allowedVisas.length - 3}
            </span>
          )}
        </div>

        {/* 구분선 / Divider */}
        <div className="border-t border-gray-100 pt-2.5">
          {/* 하단: 위치 + 근무시간 / Bottom: Location + work hours */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2.5">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            {job.workHours && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.workHours.split(' ')[0]}
              </span>
            )}
          </div>

          {/* 지원자 아바타 + D-day 칩 / Applicant avatars + D-day chip */}
          <div className="flex items-center justify-between">
            {/* 지원자 아바타 그룹 / Applicant avatar group */}
            <div className="flex items-center">
              <div className="flex -space-x-1.5">
                {Array.from({ length: visibleAvatars }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full ${avatarColors[i % avatarColors.length]}
                      flex items-center justify-center text-[9px] font-bold text-white
                      border-2 border-white shadow-sm`}
                  >
                    {avatarInitials[i % avatarInitials.length]}
                  </div>
                ))}
                {/* 초과 지원자 카운트 / Excess applicant count */}
                {extraCount > 0 && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500 border-2 border-white">
                    +{extraCount > 99 ? '99' : extraCount}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-400 ml-2">
                {job.applicantCount}명 지원
              </span>
            </div>

            {/* D-day 칩 / D-day chip */}
            {dDay && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getDDayStyle(dDay)}`}>
                <CalendarDays className="w-3 h-3" />
                {dDay}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 업종 표시 인디케이터 / Industry indicator */}
      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${color.dot} opacity-60`} title={job.industry} />
    </div>
  );
}

// 칸반 컬럼 컴포넌트 / Kanban column component
function KanbanColumn({
  title,
  jobs,
  icon,
  headerColor,
}: {
  title: string;
  jobs: MockJobPosting[];
  icon: React.ReactNode;
  headerColor: string;
}) {
  return (
    <div className="flex-1 min-w-[340px] max-w-[480px]">
      {/* 컬럼 헤더 / Column header */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl ${headerColor}`}>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-bold text-gray-800">{title}</h2>
          {/* 공고 수 배지 / Job count badge */}
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/70 text-gray-600">
            {jobs.length}
          </span>
        </div>
        {/* 컬럼 더보기 / Column options */}
        <button className="p-1 rounded hover:bg-white/50 transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* 카드 목록 영역 / Card list area */}
      <div className="bg-gray-50/80 rounded-b-xl border border-t-0 border-gray-200 p-3 space-y-3 min-h-[400px]">
        {jobs.map((job) => (
          <KanbanCard key={job.id} job={job} />
        ))}

        {/* 카드 추가 버튼 / Add card button */}
        <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 hover:bg-white/50 transition-all text-sm">
          <Plus className="w-4 h-4" />
          공고 추가
        </button>
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트 / Main page component
export default function Variant15KanbanCard() {
  // 고용형태별 분류 / Group by employment type
  const fullTimeJobs = sampleJobs.filter((job) => job.boardType === 'FULL_TIME');
  const partTimeJobs = sampleJobs.filter((job) => job.boardType === 'PART_TIME');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 헤더 / Top header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* 좌측: 로고 + 타이틀 / Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">채용 보드</h1>
              <p className="text-xs text-gray-400">잡차자 칸반 관리</p>
            </div>
          </div>

          {/* 우측: 필터 + 검색 / Right: Filter + Search */}
          <div className="flex items-center gap-2">
            {/* 필터 버튼 / Filter button */}
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              필터
            </button>
            {/* 검색 인풋 / Search input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="공고 검색..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 보드 툴바 / Board toolbar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {/* 업종 범례 / Industry legend */}
          <span className="font-medium text-gray-700">업종 범례:</span>
          {Object.entries(industryColors).map(([industry, color]) => (
            <span key={industry} className="inline-flex items-center gap-1">
              <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
              {industry}
            </span>
          ))}
        </div>
      </div>

      {/* 칸반 보드 영역 / Kanban board area */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex gap-6 overflow-x-auto">
          {/* 정규직 컬럼 / Full-time column */}
          <KanbanColumn
            title="정규직"
            jobs={fullTimeJobs}
            icon={<Briefcase className="w-4 h-4 text-blue-600" />}
            headerColor="bg-blue-100/80"
          />

          {/* 파트타임/알바 컬럼 / Part-time column */}
          <KanbanColumn
            title="알바 / 파트타임"
            jobs={partTimeJobs}
            icon={<Clock className="w-4 h-4 text-emerald-600" />}
            headerColor="bg-emerald-100/80"
          />
        </div>
      </div>

      {/* 하단 요약 바 / Bottom summary bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2.5 px-6 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-500" />
              정규직 <strong className="text-gray-800">{fullTimeJobs.length}</strong>건
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              알바 <strong className="text-gray-800">{partTimeJobs.length}</strong>건
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              총 지원자 <strong className="text-gray-800">{sampleJobs.reduce((sum, j) => sum + j.applicantCount, 0)}</strong>명
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              총 조회 <strong className="text-gray-800">{sampleJobs.reduce((sum, j) => sum + j.viewCount, 0).toLocaleString()}</strong>
            </span>
          </div>
          {/* 새 공고 등록 / New job posting button */}
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            새 공고 등록
          </button>
        </div>
      </div>
    </div>
  );
}
