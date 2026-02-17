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
  Users,
  Eye,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Building2,
  Star,
  Zap,
  ArrowUpDown,
  Search,
  Filter,
} from 'lucide-react';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-084',
  name: '알바몬×사람인×인크루트',
  category: 'minimal',
  author: 'Gemini',
};

// D-day 색상 계산 / Calculate D-day color
function getDDayStyle(dday: string | null): {
  bg: string;
  text: string;
  border: string;
} {
  if (!dday || dday === '상시모집')
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-500',
      border: 'border-gray-200',
    };
  if (dday === '마감')
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-400',
      border: 'border-gray-200',
    };
  if (dday === 'D-Day')
    return {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-300',
    };

  const num = parseInt(dday.replace('D-', ''));
  if (num <= 3)
    return {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-300',
    };
  if (num <= 7)
    return {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
    };
  return {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  };
}

// 정렬 타입 / Sort type
type SortKey = 'dday' | 'salary' | 'applicants' | 'latest';

export default function G084Page() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 필터링 / Search filtering
  const filteredJobs = sampleJobsV2.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 정렬 / Sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortKey) {
      case 'dday': {
        const aDDay = getDDay(a.closingDate);
        const bDDay = getDDay(b.closingDate);
        if (aDDay === '상시모집') return 1;
        if (bDDay === '상시모집') return -1;
        if (aDDay === '마감') return 1;
        if (bDDay === '마감') return -1;
        const aNum = parseInt((aDDay || '999').replace('D-', '').replace('D-Day', '0'));
        const bNum = parseInt((bDDay || '999').replace('D-', '').replace('D-Day', '0'));
        return aNum - bNum;
      }
      case 'salary': {
        const aSalary = a.hourlyWage || a.salaryMin || 0;
        const bSalary = b.hourlyWage || b.salaryMin || 0;
        return bSalary - aSalary;
      }
      case 'applicants':
        return b.applicantCount - a.applicantCount;
      case 'latest':
      default:
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    }
  });

  // 행 토글 / Toggle row expansion
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 영역 / Header area */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-5">
          {/* 디자인 정보 / Design info badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
              {designInfo.id}
            </span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">{designInfo.name}</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-400">{designInfo.category}</span>
          </div>

          {/* 검색 바 / Search bar - 사람인 스타일 */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="공고명, 회사명, 지역으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
              />
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
              <Search className="w-4 h-4" />
              검색
            </button>
          </div>

          {/* 정렬 + 결과 수 / Sort + result count */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              전체{' '}
              <span className="font-semibold text-gray-800">
                {sortedJobs.length}
              </span>
              건
            </p>
            <div className="flex items-center gap-1">
              {(
                [
                  { key: 'latest', label: '최신순' },
                  { key: 'dday', label: '마감임박순' },
                  { key: 'salary', label: '급여순' },
                  { key: 'applicants', label: '인기순' },
                ] as { key: SortKey; label: string }[]
              ).map((sort, idx) => (
                <button
                  key={sort.key}
                  onClick={() => setSortKey(sort.key)}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    sortKey === sort.key
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 테이블 헤더 / Table header - 인크루트 스타일 */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-100 border-x border-t border-gray-200 mt-4 rounded-t-lg">
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr_80px] items-center px-4 py-2.5 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1">
              공고 정보
            </div>
            <div className="text-center flex items-center justify-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              급여
            </div>
            <div className="text-center flex items-center justify-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              지원/조회
            </div>
            <div className="text-center">비자 유형</div>
            <div className="text-center">마감일</div>
          </div>
        </div>

        {/* 공고 리스트 / Job list */}
        <div className="border-x border-b border-gray-200 rounded-b-lg bg-white divide-y divide-gray-100 overflow-hidden">
          {sortedJobs.map((job) => {
            const dday = getDDay(job.closingDate);
            const ddayStyle = getDDayStyle(dday);
            const isHovered = hoveredId === job.id;
            const isExpanded = expandedId === job.id;
            const isClosed = dday === '마감';

            return (
              <div key={job.id}>
                {/* 메인 행 / Main row */}
                <div
                  className={`grid grid-cols-[3fr_1fr_1fr_1fr_80px] items-center px-4 py-3.5 cursor-pointer transition-all duration-200 ${
                    isClosed
                      ? 'opacity-50 bg-gray-50'
                      : isHovered
                      ? 'bg-red-50/40 border-l-[3px] border-l-red-400 pl-[13px]'
                      : 'border-l-[3px] border-l-transparent'
                  }`}
                  onMouseEnter={() => setHoveredId(job.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => toggleExpand(job.id)}
                >
                  {/* 공고 정보 / Job info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* 회사 로고 / Company logo - 사람인 스타일 */}
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('span');
                            fallback.className =
                              'text-sm font-bold text-gray-400';
                            fallback.textContent = job.companyInitial;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* 배지 행 / Badge row */}
                      <div className="flex items-center gap-1.5 mb-1">
                        {job.isFeatured && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            추천
                          </span>
                        )}
                        {job.isUrgent && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                            <Zap className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                            급구
                          </span>
                        )}
                        {job.tierType === 'PREMIUM' && (
                          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded">
                            PREMIUM
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {job.boardType === 'PART_TIME' ? '알바' : '정규직'}
                        </span>
                      </div>

                      {/* 공고 제목 / Job title */}
                      <p
                        className={`text-sm font-medium truncate transition-colors ${
                          isHovered && !isClosed
                            ? 'text-red-600'
                            : 'text-gray-800'
                        }`}
                      >
                        {job.title}
                      </p>

                      {/* 회사명 + 위치 / Company + location */}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500 truncate">
                          {job.company}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-0.5 text-xs text-gray-400">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 급여 / Salary */}
                  <div className="text-center">
                    <p
                      className={`text-sm font-semibold ${
                        job.hourlyWage ? 'text-red-600' : 'text-gray-800'
                      }`}
                    >
                      {job.hourlyWage
                        ? `${job.hourlyWage.toLocaleString()}원`
                        : job.salaryMin
                        ? `${Math.round(job.salaryMin / 10000).toLocaleString()}만`
                        : '-'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {job.hourlyWage ? '시급' : job.salaryMin ? '연봉' : ''}
                    </p>
                  </div>

                  {/* 지원/조회 / Applicants/Views */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <Users className="w-3 h-3 text-gray-400" />
                        {job.applicantCount}
                      </span>
                      <span className="text-gray-300">/</span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3 text-gray-400" />
                        {job.viewCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* 비자 유형 / Visa types */}
                  <div className="flex flex-wrap justify-center gap-1">
                    {job.allowedVisas.slice(0, 2).map((visa) => {
                      const color = getVisaColor(visa);
                      return (
                        <span
                          key={visa}
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${color.bg} ${color.text}`}
                        >
                          {visa}
                        </span>
                      );
                    })}
                    {job.allowedVisas.length > 2 && (
                      <span className="text-[10px] text-gray-400 font-medium">
                        +{job.allowedVisas.length - 2}
                      </span>
                    )}
                  </div>

                  {/* D-day / Closing date */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded border ${ddayStyle.bg} ${ddayStyle.text} ${ddayStyle.border}`}
                    >
                      {dday}
                    </span>
                    {/* 확장 화살표 / Expand arrow */}
                    <div className="mt-1">
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 확장 상세 / Expanded detail */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t border-gray-100 px-4 py-4">
                    <div className="ml-[52px] grid grid-cols-3 gap-6">
                      {/* 상세 정보 / Details */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          상세 정보
                        </h4>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400 w-14">급여</span>
                            <span className="text-gray-700 font-medium">
                              {formatSalary(job)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400 w-14">근무시간</span>
                            <span className="text-gray-700">
                              {job.workHours || '-'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400 w-14">경력</span>
                            <span className="text-gray-700">
                              {job.experienceRequired || '무관'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400 w-14">업종</span>
                            <span className="text-gray-700">{job.industry}</span>
                          </div>
                        </div>
                      </div>

                      {/* 비자 / Visa types */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">
                          지원 가능 비자
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {job.allowedVisas.map((visa) => {
                            const color = getVisaColor(visa);
                            return (
                              <span
                                key={visa}
                                className={`text-xs font-medium px-2 py-1 rounded-md ${color.bg} ${color.text}`}
                              >
                                {visa}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* 복리후생 / Benefits */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">
                          복리후생
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {job.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="text-xs text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-md"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 하단 버튼 / Bottom actions */}
                    <div className="ml-[52px] mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>등록일: {job.postedDate}</span>
                        {job.closingDate && (
                          <span>마감일: {job.closingDate}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-xs px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                          스크랩
                        </button>
                        <button
                          className={`text-xs px-4 py-2 rounded-md font-medium transition-colors ${
                            isClosed
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                          disabled={isClosed}
                        >
                          {isClosed ? '마감된 공고' : '지원하기'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* 결과 없음 / No results */}
          {sortedJobs.length === 0 && (
            <div className="py-16 text-center">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                검색 결과가 없습니다.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                다른 키워드로 검색해 보세요.
              </p>
            </div>
          )}
        </div>

        {/* 하단 요약 / Footer summary - 알바몬 스타일 */}
        <div className="mt-4 mb-8 bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              급구{' '}
              {sampleJobsV2.filter((j) => j.isUrgent).length}건
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              추천{' '}
              {sampleJobsV2.filter((j) => j.isFeatured).length}건
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              프리미엄{' '}
              {sampleJobsV2.filter((j) => j.tierType === 'PREMIUM').length}건
            </span>
          </div>
          <p className="text-[10px] text-gray-400">
            {designInfo.name} &middot; {designInfo.author}
          </p>
        </div>
      </div>
    </div>
  );
}
