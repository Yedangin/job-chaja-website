'use client';

/**
 * Job Card Design: 사람인×토스 (Saramin×Toss)
 * Saramin×Toss Job Card Design
 *
 * Design ID: g-031
 * Category: 미니멀 (Minimal)
 * Reference: 사람인 (Saramin) + 토스 (Toss)
 * Author: Gemini
 *
 * Design Features:
 * - 토스 스타일 큰 급여 숫자 (Toss-style large salary numbers)
 * - 사람인 클린한 리스트 레이아웃 (Saramin clean list layout)
 * - 호버 시 금액 카운트업 애니메이션 (Count-up animation on hover)
 * - 회색 구분선, 텍스트 중심 (Gray dividers, text-focused)
 * - 토스 블루 액센트 #3182F6 (Toss blue accent)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2
} from '../_mock/job-mock-data-v2';
import {
  MapPin,
  Clock,
  Users,
  Eye,
  Calendar,
  Briefcase,
  Zap,
  TrendingUp
} from 'lucide-react';

/**
 * 디자인 정보 / Design Information
 */
const designInfo = {
  id: 'g-031',
  name: '사람인×토스',
  category: '미니멀',
  reference: '사람인 + 토스',
  description: 'Saramin의 깔끔한 목록 레이아웃과 Toss의 숫자 강조 디자인을 결합. 큰 급여 숫자가 호버 시 카운트업 애니메이션되며, 회색 구분선으로 정보를 명확히 구분. 텍스트 중심의 미니멀한 디자인에 토스 블루 포인트.',
  author: 'Gemini'
};

/**
 * 카운트업 애니메이션 훅 / Count-up animation hook
 */
const useCountUp = (end: number, duration: number = 1000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!shouldStart) {
      setCount(0);
      startTimeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    startTimeRef.current = null;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic for smooth ending
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, duration, shouldStart]);

  return count;
};

/**
 * 개별 채용 카드 컴포넌트 / Individual Job Card Component
 */
const SaraminTossCard: React.FC<{ job: MockJobPostingV2 }> = ({ job }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 급여 추출 / Extract salary
  const salary = job.salaryMin || job.hourlyWage || 3000000;
  const displayCount = useCountUp(salary, 1200, isHovered);

  // 급여 포맷 / Format salary
  const formatNumber = (num: number) => {
    return num.toLocaleString('ko-KR');
  };

  const salaryLabel = formatSalary(job);
  const dday = getDDay(job.closingDate);
  const visaColors = getVisaColor(job.allowedVisas[0] || 'E-7');

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg hover:border-[#3182F6] transition-all duration-300 hover:shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 상단: 회사 정보 + 긴급/추천 배지 / Top: Company info + badges */}
      <div className="p-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          {/* 회사 로고 + 이름 / Company logo + name */}
          <div className="flex items-center gap-3">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover border border-gray-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg border border-gray-100">
                {job.companyInitial}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {job.company}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {job.industry}
              </p>
            </div>
          </div>

          {/* 배지 / Badges */}
          <div className="flex gap-1.5">
            {job.isUrgent && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded">
                <Zap className="w-3 h-3" />
                긴급
              </span>
            )}
            {job.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#3182F6] text-white text-xs font-medium rounded">
                <TrendingUp className="w-3 h-3" />
                추천
              </span>
            )}
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h2 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">
          {job.title}
        </h2>
      </div>

      {/* 중간: 급여 강조 (토스 스타일) / Middle: Salary emphasis (Toss style) */}
      <div className="px-5 py-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2 font-medium">
            급여조건 (Salary)
          </div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-[#3182F6] tracking-tight">
              {isHovered ? formatNumber(displayCount) : formatNumber(salary)}
            </span>
            <span className="text-lg font-semibold text-gray-700">
              원{job.hourlyWage ? '/시' : ''}
            </span>
          </div>
          {!job.hourlyWage && job.salaryMax && (
            <p className="text-xs text-gray-500 mt-2">
              ~ {formatNumber(job.salaryMax)}원
            </p>
          )}
        </div>
      </div>

      {/* 하단: 상세 정보 (사람인 스타일) / Bottom: Details (Saramin style) */}
      <div className="p-5 space-y-3">
        {/* 위치 + 경력 / Location + Experience */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{job.location}</span>
          </div>
          <div className="w-px h-3 bg-gray-300"></div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span>{job.experienceRequired}</span>
          </div>
        </div>

        {/* 근무시간 / Work hours */}
        {job.workHours && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{job.workHours}</span>
          </div>
        )}

        {/* 비자 정보 / Visa info */}
        <div className="flex flex-wrap gap-1.5">
          {job.allowedVisas.slice(0, 3).map((visa) => {
            const colors = getVisaColor(visa);
            return (
              <span
                key={visa}
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${colors.bg} ${colors.text}`}
              >
                {visa}
              </span>
            );
          })}
          {job.allowedVisas.length > 3 && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
              +{job.allowedVisas.length - 3}
            </span>
          )}
        </div>

        {/* 복리후생 / Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-1.5">
              {job.benefits.slice(0, 3).map((benefit, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 하단 메타 정보 / Bottom meta info */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {job.applicantCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {job.viewCount}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className={dday <= 7 ? 'text-red-500 font-semibold' : ''}>
              D{dday > 0 ? '-' + dday : '-Day'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 메인 페이지 컴포넌트 / Main Page Component
 */
export default function G031Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 / Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-[#3182F6] text-white text-sm font-semibold rounded-full mb-4">
            {designInfo.category} · {designInfo.author}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {designInfo.name}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {designInfo.description}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-500">Reference:</span>
            <span className="text-sm font-semibold text-gray-900">{designInfo.reference}</span>
          </div>
        </div>

        {/* 카드 그리드 / Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <SaraminTossCard key={job.id} job={job} />
          ))}
        </div>

        {/* 푸터 정보 / Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-[#3182F6]">Design ID:</span> {designInfo.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
