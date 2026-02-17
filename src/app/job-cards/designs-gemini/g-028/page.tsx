'use client';

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Eye,
  Users,
  Briefcase,
  Award,
  Zap,
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';

// 디자인 정보 / Design info
const designInfo = {
  id: 'g-028',
  name: 'ZipRecruiter 매칭 (ZipRecruiter Match)',
  category: '유니크',
  reference: 'ZipRecruiter',
  description:
    'ZipRecruiter 스타일의 매칭 스코어 중심 카드. 원형 게이지로 매칭률을 표시하고, 호버 시 0에서 목표 점수까지 애니메이션. 그린 악센트와 원클릭 지원 버튼으로 빠른 액션 유도.',
  author: 'Gemini',
};

// 원형 게이지 컴포넌트 / Circular gauge component
const CircularGauge: React.FC<{
  score: number;
  isHovered: boolean;
  size?: number;
}> = ({ score, isHovered, size = 120 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 배경 원 / Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        {/* 진행 원 / Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#50C878"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={isHovered ? strokeDashoffset : circumference}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* 중앙 텍스트 / Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-gray-900">
          {isHovered ? score : 0}%
        </div>
        <div className="text-xs text-gray-500 mt-1">Match</div>
      </div>
    </div>
  );
};

// 매칭 레벨 배지 / Match level badge
const MatchBadge: React.FC<{ score: number }> = ({ score }) => {
  let label = 'Good Match';
  let bgColor = 'bg-green-100';
  let textColor = 'text-green-700';

  if (score >= 90) {
    label = 'Great Match!';
    bgColor = 'bg-green-500';
    textColor = 'text-white';
  } else if (score >= 75) {
    label = 'Great Match!';
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
    >
      <Award className="w-3 h-3" />
      {label}
    </div>
  );
};

// 잡 카드 컴포넌트 / Job card component
const JobCard: React.FC<{ job: MockJobPostingV2 }> = ({ job }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dday = getDDay(job.closingDate);

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-green-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 상단: 매칭 게이지 영역 / Top: Matching gauge area */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 flex items-center justify-between border-b border-green-100">
        <div className="flex-1">
          <MatchBadge score={job.matchScore || 0} />
          <h3 className="text-xl font-bold text-gray-900 mt-3 mb-1 line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-600">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-5 h-5 rounded object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                {job.companyInitial}
              </div>
            )}
            <span className="font-medium">{job.company}</span>
          </div>
        </div>

        {/* 원형 게이지 / Circular gauge */}
        <CircularGauge score={job.matchScore || 0} isHovered={isHovered} />
      </div>

      {/* 본문: 주요 정보 / Body: Main info */}
      <div className="p-5 space-y-4">
        {/* 위치 및 급여 / Location and salary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm font-semibold">
              {formatSalary(
                job.boardType,
                job.hourlyWage,
                job.salaryMin,
                job.salaryMax
              )}
            </span>
          </div>
          {job.workHours && (
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{job.workHours}</span>
            </div>
          )}
          {job.experienceRequired && (
            <div className="flex items-center gap-2 text-gray-700">
              <Briefcase className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{job.experienceRequired}</span>
            </div>
          )}
        </div>

        {/* 비자 태그 / Visa tags */}
        <div className="flex flex-wrap gap-1.5">
          {job.allowedVisas.slice(0, 4).map((visa) => (
            <span
              key={visa}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: `${getVisaColor(visa)}20`,
                color: getVisaColor(visa),
              }}
            >
              {visa}
            </span>
          ))}
          {job.allowedVisas.length > 4 && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
              +{job.allowedVisas.length - 4}
            </span>
          )}
        </div>

        {/* 복리후생 / Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
            {job.benefits.slice(0, 3).map((benefit, idx) => (
              <span
                key={idx}
                className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
              >
                {benefit}
              </span>
            ))}
          </div>
        )}

        {/* 원클릭 지원 버튼 / One-click apply button */}
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
          <Zap className="w-5 h-5" />
          원클릭 지원 (One-Click Apply)
        </button>

        {/* 하단 메타 정보 / Bottom meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{job.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{job.applicantCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-medium text-green-600">{dday}</span>
          </div>
        </div>
      </div>

      {/* 뱃지 오버레이 / Badge overlay */}
      {(job.isUrgent || job.isFeatured || job.tierType === 'PREMIUM') && (
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {job.isFeatured && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Award className="w-3 h-3" />
              추천
            </div>
          )}
          {job.tierType === 'PREMIUM' && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              PREMIUM
            </div>
          )}
          {job.isUrgent && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              긴급
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 메인 페이지 / Main page
export default function G028Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 / Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {designInfo.category} · {designInfo.reference}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {designInfo.name}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-2">
            {designInfo.description}
          </p>
          <p className="text-sm text-gray-500">Design ID: {designInfo.id}</p>
        </div>

        {/* 카드 그리드 / Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* 푸터 설명 / Footer description */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            💡 Hover over cards to see the matching gauge animate from 0 to the
            target score
          </p>
          <p className="mt-1">
            Green accent (#50C878) highlights the matching score and call to
            action
          </p>
        </div>
      </div>
    </div>
  );
}
