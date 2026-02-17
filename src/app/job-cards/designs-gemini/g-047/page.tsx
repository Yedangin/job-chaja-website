'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Briefcase, MapPin, Clock, Users, TrendingUp, Award, CheckCircle2, ArrowRight, Building2 } from 'lucide-react'

// 디자인 정보 / Design Information
const designInfo = {
  id: 'g-047',
  name: 'LinkedIn×Indeed',
  category: 'platform',
  reference: 'LinkedIn professional style + Indeed one-click apply',
  description: 'Professional blue tone with large Apply Now button, profile matching percentage, LinkedIn-style company card with connection count. Clean, corporate, professional feel.',
  author: 'Gemini'
}

export default function G047Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* 헤더 / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0A66C2]">{designInfo.name}</h1>
              <p className="text-sm text-slate-600 mt-1">{designInfo.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#0A66C2] text-white text-xs font-medium rounded-full">
                {designInfo.category}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                {designInfo.id}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 / Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </main>
    </div>
  )
}

function JobCard({ job }: { job: MockJobPostingV2 }) {
  const dday = getDDay(job.closingDate)
  const salary = formatSalary(job)
  const matchingScore = Math.floor(Math.random() * 30) + 70 // 70-100% 매칭 점수 / Matching score
  const connectionsCount = Math.floor(Math.random() * 15) + 3 // 3-18 connections

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200">
      {/* 상단 회사 카드 영역 (LinkedIn 스타일) / Company Card Section (LinkedIn style) */}
      <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
        <div className="flex items-start gap-4">
          {/* 회사 로고 / Company Logo */}
          <div className="flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=635BFF&color=fff&size=128`}
              alt={job.company}
              className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md"
            />
          </div>

          {/* 회사 정보 / Company Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">
              {job.company}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <Building2 className="w-4 h-4" />
              <span>{job.company.industry}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-[#0A66C2] font-medium">
                <Users className="w-3.5 h-3.5" />
                <span>{connectionsCount}명의 연결</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          {/* 매칭 점수 (프로필 일치도) / Matching Score */}
          <div className="flex-shrink-0 text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-bold text-green-700">{matchingScore}%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">프로필 일치</p>
          </div>
        </div>
      </div>

      {/* 공고 상세 정보 / Job Details */}
      <div className="p-6">
        {/* 직무 제목 / Job Title */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0A66C2] transition-colors line-clamp-2">
            {job.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Briefcase className="w-4 h-4" />
            <span>{job.employmentType ?? job.boardType}</span>
            <span className="text-slate-300">•</span>
            <span>{job.experienceLevel}</span>
          </div>
        </div>

        {/* 급여 및 마감일 / Salary and Deadline */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Award className="w-4 h-4 text-[#2557A7]" />
            </div>
            <div>
              <p className="text-xs text-slate-500">연봉</p>
              <p className="font-semibold text-slate-900">{salary}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">마감</p>
              <p className={`font-semibold ${
                dday === '마감' ? 'text-red-600' :
                dday?.startsWith('D-') ? 'text-orange-600' :
                'text-slate-900'
              }`}>
                {dday || '상시모집'}
              </p>
            </div>
          </div>
        </div>

        {/* 비자 정보 / Visa Information */}
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-600 mb-2">지원 가능 비자</p>
          <div className="flex flex-wrap gap-2">
            {job.visaTypes.slice(0, 4).map((visa, idx) => {
              const colors = getVisaColor(visa)
              return (
                <span
                  key={idx}
                  className={`px-2.5 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full border ${colors.bg.replace('bg-', 'border-').replace('-100', '-200')}`}
                >
                  {visa}
                </span>
              )
            })}
            {job.visaTypes.length > 4 && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                +{job.visaTypes.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* 호버 시 나타나는 즉시 지원 버튼 영역 / One-click Apply Button (appears on hover) */}
        <div className="relative">
          {/* 기본 버튼 / Default Button */}
          <button className="w-full py-3.5 bg-[#2557A7] text-white font-bold rounded-lg hover:bg-[#1d4682] transition-all duration-300 flex items-center justify-center gap-2 group-hover:transform group-hover:-translate-y-1 shadow-md hover:shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span>Apply Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 호버 시 슬라이드업 되는 매칭 정보 / Matching Info (slides up on hover) */}
          <div className="absolute inset-x-0 -bottom-2 opacity-0 group-hover:opacity-100 group-hover:-bottom-16 transition-all duration-500 pointer-events-none">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 shadow-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-slate-900">
                    프로필 매칭률 {matchingScore}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-slate-600">지원 자격 충족</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 LinkedIn 스타일 액션 바 / Bottom LinkedIn-style Action Bar */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {Math.floor(Math.random() * 50) + 10}명 지원
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {Math.floor(Math.random() * 7) + 1}일 전
          </span>
        </div>
        <button className="text-[#0A66C2] hover:text-[#004182] font-medium flex items-center gap-1 transition-colors">
          상세 보기
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
