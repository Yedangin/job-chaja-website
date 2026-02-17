'use client';

// 시안 08: 태그 클라우드 / 칩 스타일 (카카오워크 스타일) / Variant 08: Tag Cloud / Chip Style (KakaoWork Style)
// 모든 정보를 칩/태그로 표현. 카드별 파스텔 배경 번갈아 사용. 놀이감 있고 색감 풍부한 디자인.
// Everything is a chip/tag. Alternating pastel backgrounds per card. Playful, colorful, information-dense.

import { sampleJobs, getDDay, formatSalary, getTimeAgo } from '../_mock/job-mock-data';
import type { MockJobPosting } from '../_mock/job-mock-data';
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Briefcase,
  Shield,
  Timer,
  Heart,
  Sparkles,
  AlertCircle,
  Star,
  Eye,
  Building2,
  GraduationCap,
} from 'lucide-react';

// 카드별 파스텔 배경색 (번갈아 적용) / Alternating pastel background colors per card
const cardBgColors = [
  'bg-blue-50/70',
  'bg-rose-50/70',
  'bg-emerald-50/70',
  'bg-amber-50/70',
  'bg-violet-50/70',
  'bg-cyan-50/70',
];

// 카드별 보더 색상 / Border color per card
const cardBorderColors = [
  'border-blue-200/60',
  'border-rose-200/60',
  'border-emerald-200/60',
  'border-amber-200/60',
  'border-violet-200/60',
  'border-cyan-200/60',
];

// 비자 칩 색상 배열 (각 비자마다 다른 보라 계열) / Visa chip purple variants
const visaChipStyles = [
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-violet-100 text-violet-700 border-violet-200',
];

// D-day 칩 스타일 결정 / Determine D-day chip style
function getDDayChipStyle(dDay: string | null): string {
  if (!dDay) return 'bg-gray-100 text-gray-500 border-gray-200';
  if (dDay === '마감') return 'bg-gray-200 text-gray-500 border-gray-300 line-through';
  if (dDay === 'D-Day') return 'bg-red-100 text-red-700 border-red-300 animate-pulse';
  const num = parseInt(dDay.replace('D-', ''), 10);
  if (!isNaN(num) && num <= 3) return 'bg-red-100 text-red-600 border-red-200';
  if (!isNaN(num) && num <= 7) return 'bg-orange-100 text-orange-600 border-orange-200';
  return 'bg-red-50 text-red-500 border-red-200';
}

// 개별 칩 스타일 카드 컴포넌트 / Individual chip-style card component
function ChipJobCard({ job, index }: { job: MockJobPosting; index: number }) {
  // D-day 계산 / Calculate D-day
  const dDay = getDDay(job.closingDate);
  // 급여 포맷 / Format salary
  const salary = formatSalary(job);
  // 게시 경과 시간 / Time since posted
  const timeAgo = getTimeAgo(job.postedDate);
  // 프리미엄 여부 / Is premium
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div
      className={`
        relative rounded-2xl p-5
        ${cardBgColors[index % cardBgColors.length]}
        border ${cardBorderColors[index % cardBorderColors.length]}
        transition-all duration-300 ease-out
        hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5
        cursor-pointer
      `}
    >
      {/* 상단: 뱃지 행 (긴급, 추천, 프리미엄) / Top: badge row */}
      {(job.isUrgent || job.isFeatured || isPremium) && (
        <div className="flex items-center gap-1.5 mb-3">
          {job.isUrgent && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-red-500 px-2.5 py-1 rounded-full shadow-sm">
              <AlertCircle className="w-3 h-3" />
              긴급채용
            </span>
          )}
          {job.isFeatured && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-amber-500 px-2.5 py-1 rounded-full shadow-sm">
              <Star className="w-3 h-3" />
              추천
            </span>
          )}
          {isPremium && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-violet-500 px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" />
              PREMIUM
            </span>
          )}
        </div>
      )}

      {/* 제목 (메인 텍스트 요소) / Title (main text element) */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
        {job.title}
      </h3>

      {/* 회사명 (서브 텍스트) / Company name (sub text) */}
      <p className="text-sm font-medium text-gray-600 mb-4">
        {job.company}
      </p>

      {/* 칩 클라우드 - 모든 정보를 칩으로 / Chip cloud - everything as chips */}
      <div className="flex flex-wrap gap-2">
        {/* 급여 칩 (파란색) / Salary chip (blue) */}
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full">
          <DollarSign className="w-3.5 h-3.5" />
          {salary}
        </span>

        {/* 위치 칩 (초록색) / Location chip (green) */}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full">
          <MapPin className="w-3.5 h-3.5" />
          {job.location}
        </span>

        {/* 비자 칩들 (보라색 계열) / Visa chips (purple variants) */}
        {job.allowedVisas.map((visa, i) => (
          <span
            key={visa}
            className={`inline-flex items-center gap-1 text-sm font-medium border px-3 py-1.5 rounded-full ${visaChipStyles[i % visaChipStyles.length]}`}
          >
            <Shield className="w-3.5 h-3.5" />
            {visa}
          </span>
        ))}

        {/* 업종 칩 (주황색) / Industry chip (orange) */}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full">
          <Building2 className="w-3.5 h-3.5" />
          {job.industry}
        </span>

        {/* 근무시간 칩 (회색) / Work hours chip (gray) */}
        {job.workHours && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            {job.workHours}
          </span>
        )}

        {/* D-day 칩 (빨간색 계열) / D-day chip (red variants) */}
        <span
          className={`inline-flex items-center gap-1 text-sm font-semibold border px-3 py-1.5 rounded-full ${getDDayChipStyle(dDay)}`}
        >
          <Timer className="w-3.5 h-3.5" />
          {dDay || '상시모집'}
        </span>

        {/* 고용형태 칩 / Employment type chip */}
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium border px-3 py-1.5 rounded-full ${
            job.boardType === 'FULL_TIME'
              ? 'text-teal-700 bg-teal-100 border-teal-200'
              : 'text-pink-700 bg-pink-100 border-pink-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          {job.boardType === 'FULL_TIME' ? '정규직' : '아르바이트'}
        </span>

        {/* 경력 칩 / Experience chip */}
        {job.experienceRequired && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            <GraduationCap className="w-3.5 h-3.5" />
            {job.experienceRequired}
          </span>
        )}

        {/* 복리후생 칩들 (틸 색상) / Benefits chips (teal) */}
        {job.benefits.map((benefit) => (
          <span
            key={benefit}
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full"
          >
            <Heart className="w-3 h-3" />
            {benefit}
          </span>
        ))}
      </div>

      {/* 하단: 조회수 + 지원자 수 / Bottom: view count + applicant count */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3 h-3" />
            조회 {job.viewCount.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="w-3 h-3" />
            지원 {job.applicantCount}명
          </span>
          <span>{timeAgo}</span>
        </div>

        {/* 매칭 점수 (있을 때만) / Match score (if available) */}
        {job.matchScore && (
          <div className="flex items-center gap-1">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  job.matchScore >= 80
                    ? 'bg-green-500'
                    : job.matchScore >= 60
                      ? 'bg-amber-500'
                      : 'bg-red-400'
                }`}
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-500">{job.matchScore}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 페이지 컴포넌트 / Page component
export default function Variant08Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10 px-4">
      {/* 페이지 헤더 / Page header */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          시안 08: 태그 클라우드 / 칩 스타일
        </h1>
        <p className="text-sm text-gray-500">
          Variant 08: Tag Cloud / Chip Style (KakaoWork Style) — 모든 정보를 칩으로, 놀이감 있는 버블 UI
        </p>
      </div>

      {/* 카드 리스트 (세로 스택) / Card list (vertical stack) */}
      <div className="max-w-3xl mx-auto space-y-4">
        {sampleJobs.map((job, index) => (
          <ChipJobCard key={job.id} job={job} index={index} />
        ))}
      </div>

      {/* 디자인 설명 / Design notes */}
      <div className="max-w-3xl mx-auto mt-8 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">디자인 특징 / Design Notes</h2>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>- 모든 정보를 색상별 칩/태그로 표현 / All info rendered as colored chips/tags</li>
          <li>- 급여(파랑), 위치(초록), 비자(보라), 업종(주황), 근무시간(회색), D-day(빨강), 복리후생(틸)</li>
          <li>- Salary(blue), Location(green), Visa(purple), Industry(orange), Hours(gray), D-day(red), Benefits(teal)</li>
          <li>- 카드별 파스텔 배경 교차 적용 / Alternating pastel backgrounds per card</li>
          <li>- rounded-2xl 카드 모서리 / Large rounded card corners</li>
          <li>- 호버 시 그림자 + 살짝 위로 이동 / Hover shadow + slight lift</li>
          <li>- 메시징 앱 버블 UI 영감 / Inspired by messaging app bubble UI</li>
        </ul>
      </div>
    </div>
  );
}
