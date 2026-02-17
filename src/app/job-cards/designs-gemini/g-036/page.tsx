'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { MapPin, Clock, TrendingUp, Users, Eye, Target, Zap, Briefcase, DollarSign, Calendar, BarChart3, PieChart, Activity } from 'lucide-react'

export default function G036Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            g-036: AngelList×Stripe
          </h1>
          <p className="text-gray-600 text-lg">Startup Dashboard with Data Visualization Expansion</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">Purple Gradient</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">Metric Cards</span>
            <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full">Data Dashboard</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sampleJobsV2.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}

function JobCard({ job }: { job: MockJobPostingV2 }) {
  const dday = getDDay(job.closingDate)
  const salary = formatSalary(job)

  return (
    <div className="group relative">
      {/* Main Card */}
      <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
        {/* Purple Gradient Header */}
        <div className="relative h-32 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/3 translate-y-1/3 group-hover:scale-150 transition-transform duration-700 delay-75"></div>
          </div>

          {/* Badges Row */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
            <div className="flex gap-2">
              {job.tierType === 'PREMIUM' && (
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                  <Zap size={12} fill="white" />
                  PREMIUM
                </div>
              )}
              {job.isUrgent && (
                <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs font-bold text-white shadow-lg animate-pulse">
                  긴급채용
                </div>
              )}
              {job.isFeatured && (
                <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-xs font-bold text-white shadow-lg">
                  추천
                </div>
              )}
            </div>
            {dday && (
              <div className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-purple-600 shadow-lg">
                {dday}
              </div>
            )}
          </div>

          {/* Company Logo Circle */}
          <div className="absolute bottom-0 left-6 translate-y-1/2">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-0.5 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <span className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {job.companyInitial}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-12 px-6 pb-6 space-y-4">
          {/* Title & Company */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium">{job.company}</p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-purple-500 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase size={16} className="text-indigo-500 flex-shrink-0" />
              <span className="truncate">{job.boardType === 'FULL_TIME' ? '정규직' : '알바'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign size={16} className="text-purple-500 flex-shrink-0" />
              <span className="truncate font-semibold text-gray-900">{salary}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} className="text-indigo-500 flex-shrink-0" />
              <span className="truncate">{job.workHours}</span>
            </div>
          </div>

          {/* Mini Metrics - Always Visible */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <MetricCard icon={Users} value={job.applicantCount} label="지원" color="purple" />
            <MetricCard icon={Eye} value={job.viewCount} label="조회" color="indigo" />
            <MetricCard icon={Target} value={job.matchScore} label="매칭" color="violet" suffix="%" />
          </div>

          {/* Visa Tags */}
          <div className="flex flex-wrap gap-2">
            {job.allowedVisas.slice(0, 4).map((visa) => {
              const colors = getVisaColor(visa)
              return (
                <span
                  key={visa}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text}`}
                >
                  {visa}
                </span>
              )
            })}
            {job.allowedVisas.length > 4 && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">
                +{job.allowedVisas.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Hover Expansion: Data Visualization Dashboard */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/98 via-indigo-600/98 to-purple-700/98 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto overflow-hidden">
          <div className="h-full p-6 flex flex-col justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {/* Dashboard Title */}
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold text-white mb-1">채용 데이터 대시보드</h4>
              <p className="text-purple-200 text-sm">Hiring Analytics Overview</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <KPICard
                icon={Users}
                title="지원자"
                value={job.applicantCount}
                subtitle="Total Applicants"
                trend="+12%"
                delay="delay-0"
              />
              <KPICard
                icon={Eye}
                title="조회수"
                value={job.viewCount}
                subtitle="Total Views"
                trend="+28%"
                delay="delay-75"
              />
              <KPICard
                icon={Target}
                title="매칭률"
                value={job.matchScore}
                subtitle="Match Score"
                suffix="%"
                trend="+5%"
                delay="delay-150"
              />
              <KPICard
                icon={Activity}
                title="전환율"
                value={Math.round((job.applicantCount / job.viewCount) * 100)}
                subtitle="Conversion Rate"
                suffix="%"
                trend="+3%"
                delay="delay-[225ms]"
              />
            </div>

            {/* Visualization Bars */}
            <div className="space-y-3 mb-4">
              <DataBar label="지원 진행률" percentage={(job.applicantCount / 50) * 100} icon={TrendingUp} delay="delay-300" />
              <DataBar label="관심도" percentage={job.matchScore} icon={BarChart3} delay="delay-[350ms]" />
              <DataBar label="경쟁률" percentage={Math.min((job.applicantCount / 10) * 100, 100)} icon={PieChart} delay="delay-[400ms]" />
            </div>

            {/* Bottom Info */}
            <div className="flex items-center justify-between text-white/90 text-sm border-t border-white/20 pt-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>등록: {job.postedDate}</span>
              </div>
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-sm">
                상세보기 →
              </button>
            </div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-1000 delay-100"></div>
        </div>
      </div>
    </div>
  )
}

// Mini Metric Card Component
function MetricCard({ icon: Icon, value, label, color, suffix = '' }: {
  icon: any
  value: number
  label: string
  color: 'purple' | 'indigo' | 'violet'
  suffix?: string
}) {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    violet: 'bg-violet-50 text-violet-600'
  }

  return (
    <div className={`p-2.5 rounded-lg ${colorClasses[color]} transition-transform group-hover:scale-105`}>
      <Icon size={14} className="mb-1" />
      <div className="text-lg font-bold">{value}{suffix}</div>
      <div className="text-[10px] opacity-75">{label}</div>
    </div>
  )
}

// KPI Card Component (Hover State)
function KPICard({ icon: Icon, title, value, subtitle, suffix = '', trend, delay }: {
  icon: any
  title: string
  value: number
  subtitle: string
  suffix?: string
  trend: string
  delay: string
}) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-3 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ${delay} border border-white/20`}>
      <div className="flex items-start justify-between mb-2">
        <Icon size={20} className="text-white" />
        <span className="text-xs text-green-300 font-semibold">{trend}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}{suffix}</div>
      <div className="text-white/80 text-xs font-medium mb-0.5">{title}</div>
      <div className="text-white/60 text-[10px]">{subtitle}</div>
    </div>
  )
}

// Data Bar Component (Visualization)
function DataBar({ label, percentage, icon: Icon, delay }: {
  label: string
  percentage: number
  icon: any
  delay: string
}) {
  return (
    <div className={`transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ${delay}`}>
      <div className="flex items-center justify-between text-white/90 text-xs mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon size={12} />
          <span className="font-medium">{label}</span>
        </div>
        <span className="font-bold">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-300 to-white rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}
