'use client';

import React from 'react';
import { sampleJobsV2, getDDay, formatSalary, getVisaColor } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Flame, Award, Star } from 'lucide-react';

// Design-specific information
// 디자인별 정보
const designInfo = {
  id: 'g-001',
  name: '사람인 라이트 (Saramin Light)',
  category: '미니멀',
  reference: '사람인',
  description: '초경량 디자인, 텍스트 위주, 그레이 팔레트, 로고 소형 표시. 이미지 사용 최소화로 정보 전달에 집중합니다.',
  author: 'Gemini',
};

// JobCard Component: Renders a single job posting card
// JobCard 컴포넌트: 개별 채용 공고 카드를 렌더링합니다
const JobCard: React.FC<{ job: MockJobPostingV2 }> = ({ job }) => {
  const dDay = getDDay(job.closingDate);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-5 transition-all duration-300 hover:border-blue-500 hover:shadow-lg flex flex-col space-y-4">
      {/* Header: Company Info & Badges */}
      {/* 헤더: 회사 정보 및 배지 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={job.companyLogo} 
            alt={`${job.company} logo`} 
            className="h-7 w-auto object-contain" // 로고 높이 28px / Logo height 28px
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">{job.company}</p>
            <div className="flex items-center space-x-1.5 mt-1">
              {job.tierType === 'PREMIUM' && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  프리미엄
                </span>
              )}
              {job.isUrgent && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                  <Flame className="w-3 h-3 mr-1" />
                  긴급
                </span>
              )}
               {job.isFeatured && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  추천
                </span>
              )}
            </div>
          </div>
        </div>
        {dDay && (
          <span className={`text-sm font-bold ${dDay === '마감' ? 'text-gray-500' : 'text-red-500'}`}>
            {dDay}
          </span>
        )}
      </div>

      {/* Body: Job Title and Core Info */}
      {/* 본문: 직무명 및 핵심 정보 */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate">{job.title}</h3>
        <div className="mt-2.5 space-y-1.5 text-sm text-gray-600">
           <div className="flex items-center">
            <span className="inline-block text-center w-20 text-xs font-semibold text-gray-500 border-r border-gray-200 mr-2">직종태그</span>
            <span className="text-gray-800 font-medium">{job.boardType === 'FULL_TIME' ? '정규직' : '파트타임'}</span>
          </div>
          <div className="flex items-center">
             <span className="inline-block text-center w-20 text-xs font-semibold text-gray-500 border-r border-gray-200 mr-2">급여</span>
            <span className="text-gray-800 font-medium">{formatSalary(job)}</span>
          </div>
          <div className="flex items-center">
             <span className="inline-block text-center w-20 text-xs font-semibold text-gray-500 border-r border-gray-200 mr-2">위치</span>
            <span className="text-gray-800 font-medium">{job.location}</span>
          </div>
        </div>
      </div>
      
      {/* Footer: Visas & Benefits */}
      {/* 푸터: 비자 및 복리후생 */}
      <div>
        {/* Visa Badges */}
        {/* 비자 배지 */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 mb-1.5">가능 비자</p>
          <div className="flex flex-wrap gap-1.5">
            {job.allowedVisas.map((visa) => {
              const { bg, text } = getVisaColor(visa);
              return (
                <span key={visa} className={`${bg} ${text} text-xs font-bold px-2 py-1 rounded-full`}>
                  {visa}
                </span>
              );
            })}
          </div>
        </div>

        {/* Benefits Tags */}
        {/* 복리후생 태그 */}
        {job.benefits.length > 0 && (
          <div>
             <p className="text-xs font-semibold text-gray-500 mb-1.5">복리후생</p>
            <div className="flex flex-wrap gap-1.5">
              {job.benefits.slice(0, 4).map((benefit) => (
                <span key={benefit} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Page Component: Displays the list of job cards
// 페이지 컴포넌트: 채용 공고 카드 목록을 표시합니다
const SaraminLightPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      {/* 페이지 헤더 */}
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">{designInfo.name}</h1>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-semibold">카테고리:</span> {designInfo.category} |{' '}
          <span className="font-semibold">레퍼런스:</span> {designInfo.reference} |{' '}
          <span className="font-semibold">ID:</span> {designInfo.id}
        </p>
        <p className="text-sm text-gray-700 mt-2 bg-gray-100 p-3 rounded-md">{designInfo.description}</p>
      </header>

      {/* Job Card Grid */}
      {/* 채용 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default SaraminLightPage;
