// [시안 ID]: g-004
// [시안 이름]: 리멤버 명함 (Remember Namecard)
// [카테고리]: 미니멀
// [레퍼런스]: 리멤버 앱
// [마우스오버 효과]: 카드 뒤집기 효과 (CSS 3D transform - rotateY(180deg)). 앞면은 회사+직무 간단 정보, 뒷면은 상세 정보 (급여, 비자, 복리후생 등)

'use client';

import { useState } from 'react';
import { sampleJobsV2, getDDay, formatSalary, getIndustryColor, getVisaColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Briefcase, CalendarDays, CheckCircle, Eye, Hourglass, Star, Ticket, Users, Zap } from 'lucide-react';

// Card Front Component: 앞면 - 회사 로고, 이름, 직무 등 핵심 정보
// Displays key company and job title information.
const CardFront = ({ job, industryColor }: { job: MockJobPostingV2; industryColor: { bg: string; text: string; border: string } }) => (
  <div className={`absolute w-full h-full [backface-visibility:hidden] rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-4 border-2 ${job.tierType === 'PREMIUM' ? 'border-yellow-400' : 'border-transparent'}`}>
    {job.isUrgent && (
      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center z-10">
        <Zap size={12} className="mr-1" /> 긴급
      </div>
    )}
    <img src={job.companyLogo} alt={`${job.company} logo`} className="h-12 w-auto mb-4" style={{ height: '48px' }} />
    <h2 className="text-xl font-bold text-gray-800 text-center">{job.company}</h2>
    <p className="text-gray-600 text-center mt-1">{job.title}</p>
    <div className="flex items-center gap-2 mt-4">
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${industryColor.bg} ${industryColor.text}`}>
        {job.industry}
      </span>
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
        {job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}
      </span>
    </div>
  </div>
);

// Card Back Component: 뒷면 - 급여, 비자, 복리후생 등 상세 정보
// Displays detailed job information like salary, visa requirements, and benefits.
const CardBack = ({ job }: { job: MockJobPostingV2 }) => {
  const dDay = getDDay(job.closingDate);
  const timeAgo = getTimeAgo(job.postedDate);

  return (
    <div className={`absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg shadow-lg bg-gray-800 text-white p-4 flex flex-col justify-between border-2 ${job.tierType === 'PREMIUM' ? 'border-yellow-400' : 'border-transparent'}`}>
      {/* 상단 정보: 직무명, 급여, 비자, 복리후생 등 */}
      {/* Top Section: Title, Salary, Visas, Benefits etc. */}
      <div>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold leading-tight pr-2">{job.title}</h3>
            {job.tierType === 'PREMIUM' && <Star size={18} className="text-yellow-400 flex-shrink-0" />}
        </div>
        <p className="text-sm text-yellow-300 font-semibold mb-3">{formatSalary(job)}</p>

        <div className="text-xs space-y-2">
          <div className="flex items-start gap-2">
            <Ticket size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {job.allowedVisas.slice(0, 4).map(visa => {
                const visaColor = getVisaColor(visa);
                return (
                  <span key={visa} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${visaColor.bg} ${visaColor.text}`}>
                    {visa}
                  </span>
                );
              })}
              {job.allowedVisas.length > 4 && <span className="text-gray-400 text-[10px]">+...</span>}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="truncate">{job.benefits.slice(0, 2).join(', ')}</p>
          </div>
          <div className="flex items-center gap-2">
              <Hourglass size={14} className="text-gray-400 flex-shrink-0" />
              <p>{job.workHours || '협의'}</p>
          </div>
           <div className="flex items-center gap-2">
              <Briefcase size={14} className="text-gray-400 flex-shrink-0" />
              <p>{job.experienceRequired || '경력 무관'}</p>
          </div>
        </div>
      </div>

      {/* 하단 정보: 마감일, 지원자/조회수 */}
      {/* Bottom Section: Deadline, Applicant/View Count */}
      <div className="border-t border-gray-700 pt-2 mt-2 text-xs flex justify-between items-center">
        <div className="flex items-center gap-2">
            {/* 마감일 표시: D-Day 값에 따라 색상 변경 / Deadline display: color changes by D-Day value */}
            {dDay === '상시모집' ? (
               <div className="flex items-center gap-1.5 text-gray-300">
                 <CalendarDays size={14} />
                 <span>상시채용</span>
               </div>
            ) : dDay === '마감' ? (
              <div className="flex items-center gap-1.5 text-gray-500">
                <CalendarDays size={14} />
                <span className="font-semibold line-through">마감</span>
              </div>
            ) : (
              <div className={`flex items-center gap-1.5 ${dDay === 'D-Day' || (dDay?.startsWith('D-') && parseInt(dDay.replace('D-', '')) <= 3) ? 'text-red-400' : 'text-gray-300'}`}>
                <CalendarDays size={14} />
                <span className="font-semibold">{dDay} 마감</span>
              </div>
            )}
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <div className="flex items-center gap-1" title="지원자 수">
            <Users size={14} /> {job.applicantCount}
          </div>
          <div className="flex items-center gap-1" title="조회수">
            <Eye size={14} /> {job.viewCount}
          </div>
          <span className="text-gray-500" title={`게시일: ${job.postedDate}`}>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

// Main Job Card Component with Flip Logic
const JobCard = ({ job }: { job: MockJobPostingV2 }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const industryColor = getIndustryColor(job.industry);

  return (
    // 3D 공간을 만드는 perspective 컨테이너
    // Perspective container to create 3D space
    <div
      className="group w-full aspect-[9/5] [perspective:1000px] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* 3D 변환을 위한 실제 뒤집히는 요소 */}
      {/* The actual flipping element for 3D transform */}
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <CardFront job={job} industryColor={industryColor} />
        <CardBack job={job} />
      </div>
    </div>
  );
};


// Page Component to display the grid of job cards
export default function DesignG004Page() {
  return (
    <div className="w-full bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 p-4 border-l-4 border-blue-500 bg-blue-50">
          <h1 className="text-xl font-bold text-gray-800">[시안 ID] g-004: 리멤버 명함</h1>
          <p className="text-gray-600 mt-1">미니멀한 명함 디자인 컨셉. 마우스를 올리면 카드가 뒤집히며 상세 정보가 나타납니다.</p>
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-semibold">[Mouseover Effect]</span> CSS 3D transform - rotateY(180deg)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
