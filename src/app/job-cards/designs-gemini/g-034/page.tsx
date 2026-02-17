'use client';

import React from 'react';
import {
  Star,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  Eye,
  Award,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2
} from '../_mock/job-mock-data-v2';

// Design info for reference / 디자인 정보
const designInfo = {
  id: 'g-034',
  name: '원티드×Glassdoor',
  category: '프리미엄',
  reference: '원티드 + Glassdoor',
  description: 'Wanted의 프리미엄 브랜딩과 Glassdoor의 기업 인사이트를 결합. 히어로 이미지, 큰 로고, 평점 시스템. 호버 시 연봉 차트와 기업 평점 상세 노출. 골드 프리미엄 배지와 신뢰도 스코어 표시.',
  author: 'Gemini'
};

export default function G034Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full mb-4 shadow-lg">
          <Award className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wide">PREMIUM DESIGN</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
          {designInfo.name}
        </h1>
        <p className="text-lg text-slate-600 mb-2">
          {designInfo.description}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span className="px-3 py-1 bg-white rounded-full shadow">
            🎨 {designInfo.category}
          </span>
          <span className="px-3 py-1 bg-white rounded-full shadow">
            📚 {designInfo.reference}
          </span>
          <span className="px-3 py-1 bg-white rounded-full shadow">
            ✨ {designInfo.author}
          </span>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Design Info Footer */}
      <div className="max-w-7xl mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg border-2 border-amber-200">
        <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          Design Features / 디자인 특징
        </h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">•</span>
            <span><strong>Hero Image:</strong> Industry image at top for visual impact / 상단 산업 히어로 이미지</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">•</span>
            <span><strong>Company Rating:</strong> Star rating system with matchScore / 별점 평가 시스템</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">•</span>
            <span><strong>Hover Effect:</strong> Reveals salary chart + company insights / 호버 시 연봉 차트 및 기업 인사이트 노출</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">•</span>
            <span><strong>Premium Badges:</strong> Gold tier indicators / 골드 프리미엄 배지</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">•</span>
            <span><strong>Trust Score:</strong> Verification shield icon / 신뢰도 스코어 표시</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

interface JobCardProps {
  job: MockJobPostingV2;
}

function JobCard({ job }: JobCardProps) {
  const dDay = getDDay(job.closingDate);
  const isPremium = job.tierType === 'PREMIUM';
  const rating = (job.matchScore / 20).toFixed(1); // Convert 0-100 to 0-5 stars / 0-100을 0-5 별점으로 변환
  const ratingNumber = parseFloat(rating);

  // Fake salary data for chart / 차트용 가짜 연봉 데이터
  const salaryData = [
    { label: 'Min', value: job.salaryMin || 30000000, height: 40 },
    { label: 'Avg', value: ((job.salaryMin || 30000000) + (job.salaryMax || 50000000)) / 2, height: 70 },
    { label: 'Max', value: job.salaryMax || 50000000, height: 100 }
  ];

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-amber-300 hover:-translate-y-2">
      {/* Hero Image / 히어로 이미지 */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
        {job.industryImage ? (
          <img
            src={job.industryImage}
            alt={job.industry}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
            <span className="text-4xl font-bold text-slate-400">{job.industry}</span>
          </div>
        )}

        {/* Overlay badges / 오버레이 배지 */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {isPremium && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
              <Award className="w-3 h-3" />
              PREMIUM
            </span>
          )}
          {job.isUrgent && (
            <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
              🔥 URGENT
            </span>
          )}
          {job.isFeatured && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
              ⭐ FEATURED
            </span>
          )}
        </div>

        {/* D-Day badge / 마감 배지 */}
        {dDay <= 7 && (
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
            D-{dDay}
          </div>
        )}
      </div>

      {/* Company Logo - Large / 기업 로고 - 큰 사이즈 */}
      <div className="absolute top-36 left-6 w-24 h-24 rounded-2xl shadow-xl border-4 border-white bg-white overflow-hidden">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
            {job.companyInitial}
          </div>
        )}
      </div>

      {/* Content / 콘텐츠 */}
      <div className="pt-16 px-6 pb-6">
        {/* Company name + Rating / 기업명 + 평점 */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-800 truncate flex-1">
            {job.company}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-slate-700">{rating}</span>
          </div>
        </div>

        {/* Job title / 채용 제목 */}
        <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {job.title}
        </h2>

        {/* Salary / 급여 */}
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-lg font-bold text-green-700">
            {formatSalary(job)}
          </span>
        </div>

        {/* Trust Score / 신뢰도 스코어 */}
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">
            Trust Score: {job.matchScore}%
          </span>
        </div>

        {/* Location + Experience / 위치 + 경력 */}
        <div className="space-y-2 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              {job.experienceRequired ? `경력 ${job.experienceRequired}` : '경력 무관'} · {job.workHours}
            </span>
          </div>
        </div>

        {/* Visa badges / 비자 배지 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {job.allowedVisas.slice(0, 4).map((visa) => {
              const colors = getVisaColor(visa);
              return (
                <span
                  key={visa}
                  className={`px-2.5 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full border-2 ${colors.text.replace('text-', 'border-')}`}
                >
                  {visa}
                </span>
              );
            })}
            {job.allowedVisas.length > 4 && (
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border-2 border-slate-300">
                +{job.allowedVisas.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Stats / 통계 */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{job.applicantCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{job.viewCount}</span>
          </div>
          <div className="ml-auto text-slate-400">
            {job.postedDate}
          </div>
        </div>
      </div>

      {/* Hover Overlay - Salary Chart + Company Insights / 호버 오버레이 - 연봉 차트 + 기업 인사이트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-indigo-900/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-full max-w-sm">
          {/* Company Rating Details / 기업 평점 상세 */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              <span className="text-3xl font-bold">{rating}</span>
              <span className="text-lg text-slate-300">/5.0</span>
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(ratingNumber)
                      ? 'text-amber-400 fill-amber-400'
                      : i < ratingNumber
                      ? 'text-amber-400 fill-amber-400 opacity-50'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-300">
              Based on {job.applicantCount + 50} reviews
            </p>
          </div>

          {/* Salary Bar Chart / 연봉 바 차트 */}
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-sm">Salary Range / 급여 범위</h4>
            </div>
            <div className="flex items-end justify-around gap-3 h-32">
              {salaryData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className="w-full relative" style={{ height: `${data.height}%` }}>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg animate-[slideUp_0.6s_ease-out] hover:from-amber-400 hover:to-orange-300 transition-colors"
                         style={{ height: '100%' }}>
                    </div>
                  </div>
                  <span className="text-xs font-semibold mt-2 text-amber-300">
                    {data.label}
                  </span>
                  <span className="text-xs text-slate-300 mt-1">
                    {(data.value / 10000).toFixed(0)}만
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats / 간단한 통계 */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-md">
              <div className="text-2xl font-bold text-amber-400">{job.applicantCount}</div>
              <div className="text-xs text-slate-300">Applicants / 지원자</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-md">
              <div className="text-2xl font-bold text-green-400">{job.matchScore}%</div>
              <div className="text-xs text-slate-300">Match / 매칭도</div>
            </div>
          </div>

          {/* CTA Button / 액션 버튼 */}
          <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
            View Details / 상세보기
          </button>
        </div>
      </div>
    </div>
  );
}
