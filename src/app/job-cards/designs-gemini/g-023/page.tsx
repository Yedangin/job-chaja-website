'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { TrendingUp, DollarSign, BarChart3, ArrowUpRight, Users, FileText, Calendar, MapPin, Briefcase, Clock } from 'lucide-react';
import { useState } from 'react';

/**
 * g-023: Stripe 대시보드 디자인 / Stripe Dashboard Design
 *
 * 디자인 특징 / Design Features:
 * - Stripe의 클린한 대시보드 레이아웃 / Stripe's clean dashboard layout
 * - 보라색 그라데이션 (#635BFF) / Purple gradient accents
 * - 통계 카드 + 거래 내역 스타일 / Stats cards + transaction-style rows
 * - 차트 툴팁 + 데이터 하이라이트 / Chart tooltips + data highlights
 * - CSS-only 막대 차트 / CSS-only bar charts
 *
 * 인터랙션 / Interactions:
 * - 행 hover 시 배경 하이라이트 / Row highlight on hover
 * - 차트 hover 시 상세 정보 툴팁 / Detailed tooltip on chart hover
 * - 통계 카드 애니메이션 / Stats card animations
 */

// 디자인 정보 / Design Information
const designInfo = {
  id: 'g-023',
  name: 'Stripe Dashboard',
  category: 'interactive',
  reference: 'Stripe',
  description: '클린한 대시보드 레이아웃, 보라색 그라데이션, 거래 내역 스타일',
  descriptionEn: 'Clean dashboard layout, purple gradient, transaction-style rows',
  features: [
    '보라색 그라데이션 (#635BFF) / Purple gradient accents',
    '통계 카드 + 차트 / Stats cards + charts',
    '거래 내역 스타일 행 / Transaction-style rows',
    'CSS 막대 차트 / CSS bar charts',
    '호버 툴팁 / Hover tooltips'
  ],
  colors: {
    primary: '#635BFF',
    secondary: '#0A2540',
    accent: '#00D4FF',
    background: '#FFFFFF',
    text: '#425466'
  }
};

export default function G023StripeDashboard() {
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  // 통계 계산 / Calculate statistics
  const totalJobs = sampleJobsV2.length;
  const totalApplicants = sampleJobsV2.reduce((sum, job) => sum + job.applicantCount, 0);
  const avgSalary = Math.round(
    sampleJobsV2.reduce((sum, job) => {
      const avg = job.hourlyWage || ((job.salaryMin + job.salaryMax) / 2);
      return sum + avg;
    }, 0) / sampleJobsV2.length
  );
  const uniqueVisas = [...new Set(sampleJobsV2.flatMap(job => job.allowedVisas))].length;

  // 최대 급여 (차트 스케일용) / Max salary for chart scaling
  const maxSalary = Math.max(...sampleJobsV2.map(job =>
    job.hourlyWage || job.salaryMax || 0
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 헤더 / Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#635BFF] to-[#0A2540] bg-clip-text text-transparent">
                {designInfo.name}
              </h1>
              <p className="text-slate-600 mt-1">{designInfo.description}</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[#635BFF] to-[#7A73FF] text-white rounded-lg">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 통계 카드 그리드 / Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 총 공고 수 / Total Jobs */}
          <div
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setHoveredStat('jobs')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-[#635BFF]/5 to-transparent transition-opacity duration-300 ${hoveredStat === 'jobs' ? 'opacity-100' : 'opacity-0'}`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#635BFF] to-[#7A73FF] rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{totalJobs}</div>
              <div className="text-slate-600 text-sm">총 공고 / Total Jobs</div>
            </div>
          </div>

          {/* 평균 급여 / Avg Salary */}
          <div
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setHoveredStat('salary')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent transition-opacity duration-300 ${hoveredStat === 'salary' ? 'opacity-100' : 'opacity-0'}`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+8%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">₩{(avgSalary / 10000).toFixed(0)}만</div>
              <div className="text-slate-600 text-sm">평균 급여 / Avg Salary</div>
            </div>
          </div>

          {/* 총 지원자 / Total Applicants */}
          <div
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setHoveredStat('applicants')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent transition-opacity duration-300 ${hoveredStat === 'applicants' ? 'opacity-100' : 'opacity-0'}`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+24%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{totalApplicants}</div>
              <div className="text-slate-600 text-sm">총 지원자 / Total Applicants</div>
            </div>
          </div>

          {/* 비자 유형 / Visa Types */}
          <div
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setHoveredStat('visas')}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent transition-opacity duration-300 ${hoveredStat === 'visas' ? 'opacity-100' : 'opacity-0'}`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+5%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{uniqueVisas}</div>
              <div className="text-slate-600 text-sm">비자 유형 / Visa Types</div>
            </div>
          </div>
        </div>

        {/* 거래 내역 스타일 테이블 / Transaction-Style Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          {/* 테이블 헤더 / Table Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">채용 공고 목록 / Job Listings</h2>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <BarChart3 className="w-4 h-4" />
                <span>실시간 업데이트 / Live Updates</span>
              </div>
            </div>
          </div>

          {/* 테이블 컬럼 헤더 / Column Headers */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <div className="col-span-4">회사 / Company</div>
            <div className="col-span-2">급여 / Salary</div>
            <div className="col-span-2">지원자 / Applicants</div>
            <div className="col-span-2">비자 / Visa</div>
            <div className="col-span-2 text-right">차트 / Chart</div>
          </div>

          {/* 공고 행 / Job Rows */}
          <div className="divide-y divide-slate-100">
            {sampleJobsV2.map((job) => {
              const salary = job.hourlyWage || job.salaryMax || 0;
              const salaryPercent = (salary / maxSalary) * 100;
              const isHovered = hoveredJob === job.id;

              return (
                <div
                  key={job.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredJob(job.id)}
                  onMouseLeave={() => setHoveredJob(null)}
                >
                  {/* 호버 배경 / Hover Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#635BFF]/5 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                  <div className="relative grid grid-cols-12 gap-4 px-6 py-5 items-center cursor-pointer transition-all duration-200">
                    {/* 회사 정보 / Company Info */}
                    <div className="col-span-4 flex items-center gap-4">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#635BFF] to-[#7A73FF] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {job.companyInitial}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 truncate group-hover:text-[#635BFF] transition-colors">
                            {job.title}
                          </h3>
                          {job.isFeatured && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-[#635BFF] to-[#7A73FF] text-white text-xs rounded-full font-medium">
                              추천
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span className="font-medium">{job.company}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 급여 / Salary */}
                    <div className="col-span-2">
                      <div className="text-lg font-bold text-slate-900 mb-1">
                        {formatSalary(job)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {job.boardType === 'PART_TIME' ? '시급 / Hourly' : '월급 / Monthly'}
                      </div>
                    </div>

                    {/* 지원자 / Applicants */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-lg font-bold text-slate-900">{job.applicantCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(job.postedDate)}
                      </div>
                    </div>

                    {/* 비자 / Visa */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {job.allowedVisas.slice(0, 2).map((visa) => (
                          <span
                            key={visa}
                            className="px-2 py-1 text-xs font-medium rounded-md"
                            style={{
                              backgroundColor: `${getVisaColor(visa)}20`,
                              color: getVisaColor(visa)
                            }}
                          >
                            {visa}
                          </span>
                        ))}
                        {job.allowedVisas.length > 2 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                            +{job.allowedVisas.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 급여 차트 / Salary Chart */}
                    <div className="col-span-2 relative group/chart">
                      <div className="h-8 bg-slate-100 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-[#635BFF] to-[#7A73FF] rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${salaryPercent}%` }}
                        />
                      </div>

                      {/* 차트 툴팁 / Chart Tooltip */}
                      <div className={`absolute right-0 bottom-full mb-2 w-48 bg-slate-900 text-white rounded-lg shadow-xl p-3 transition-all duration-200 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                        <div className="text-xs font-semibold mb-2 text-slate-300">급여 상세 / Salary Details</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">급여:</span>
                            <span className="font-semibold">{formatSalary(job)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">백분위:</span>
                            <span className="font-semibold">{salaryPercent.toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">지원자:</span>
                            <span className="font-semibold">{job.applicantCount}명</span>
                          </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                      </div>
                    </div>
                  </div>

                  {/* 확장 정보 (호버 시) / Expanded Info on Hover */}
                  <div className={`overflow-hidden transition-all duration-300 ${isHovered ? 'max-h-32' : 'max-h-0'}`}>
                    <div className="px-6 pb-5 pt-2 bg-slate-50/50">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">경력: {job.experienceRequired}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{job.workHours}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">마감: {getDDay(job.closingDate) || '상시'}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.benefits.map((benefit, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white text-slate-600 text-xs rounded-full border border-slate-200">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 푸터 / Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div>총 {totalJobs}개 공고 / Total {totalJobs} jobs</div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#635BFF] to-[#7A73FF]" />
                  <span>급여 비율 / Salary Ratio</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 디자인 정보 카드 / Design Info Card */}
        <div className="mt-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-2xl border border-slate-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{designInfo.name}</h3>
              <p className="text-slate-300 text-sm">{designInfo.descriptionEn}</p>
            </div>
            <span className="px-3 py-1 bg-[#635BFF] rounded-lg text-xs font-semibold uppercase tracking-wider">
              {designInfo.category}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(designInfo.colors).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg shadow-lg border-2 border-white/20"
                  style={{ backgroundColor: color }}
                />
                <div className="text-xs">
                  <div className="font-semibold capitalize">{name}</div>
                  <div className="text-slate-400">{color}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
