'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Building2, MapPin, Clock, TrendingUp, Users, Calendar, ArrowUpRight, DollarSign, ChevronRight, Zap } from 'lucide-react'

// Design information / 디자인 정보
const designInfo = {
  id: 'g-063',
  name: 'Figma×Stripe',
  category: 'premium',
  description: 'Figma design system + Stripe payment dashboard hybrid',
  features: [
    '4-color Figma accents (red, orange, purple, green) + Stripe purple',
    'Component frame with selection border on hover',
    'Data/metric widgets (revenue charts, conversion rates)',
    'Premium design system aesthetic',
    'Hover: Data chart animates + component frame highlights',
    'Dashboard widgets within design tool frame',
    'Professional, data-rich, design-focused'
  ]
}

export default function G063Page() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      {/* Design Header / 디자인 헤더 */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-br from-[#635BFF] via-[#5B4FE8] to-[#F24E1E] p-8 rounded-2xl shadow-2xl mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">{designInfo.name}</h1>
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wider">{designInfo.category}</p>
                </div>
              </div>
              <p className="text-white/90 text-lg mb-4 max-w-2xl">{designInfo.description}</p>
              <div className="flex flex-wrap gap-2">
                {designInfo.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-white mb-2">{designInfo.id}</div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <div className="w-3 h-3 rounded-full bg-[#F24E1E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FF7262]"></div>
                <div className="w-3 h-3 rounded-full bg-[#A259FF]"></div>
                <div className="w-3 h-3 rounded-full bg-[#1ABCFE]"></div>
                <div className="w-3 h-3 rounded-full bg-[#0ACF83]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Figma-style Toolbar / Figma 스타일 툴바 */}
        <div className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#635BFF] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <span className="text-white text-sm font-medium">JobChaja Dashboard</span>
            </div>
            <div className="h-6 w-px bg-[#333333]"></div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white text-xs rounded-md transition-colors">
                Frame
              </button>
              <button className="px-3 py-1.5 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white text-xs rounded-md transition-colors">
                Components
              </button>
              <button className="px-3 py-1.5 bg-[#635BFF] hover:bg-[#5B4FE8] text-white text-xs rounded-md transition-colors">
                Prototype
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#999999] text-xs">
            <span>100%</span>
            <span>•</span>
            <span>12 Jobs</span>
          </div>
        </div>
      </div>

      {/* Job Cards Grid / 채용공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleJobsV2.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: MockJobPostingV2 }) {
  const dday = getDDay(job.deadline ?? job.closingDate)
  const salary = formatSalary(job)
  const visaColors = (job.matchedVisaTypes ?? job.allowedVisas ?? []).map(v => getVisaColor(v))

  // Figma accent colors / Figma 악센트 색상
  const accentColors = ['#F24E1E', '#FF7262', '#A259FF', '#0ACF83']
  const randomAccent = accentColors[Math.floor(Math.random() * accentColors.length)]

  // Mock metrics / 모의 지표
  const mockMetrics = {
    applications: Math.floor(Math.random() * 150) + 10,
    growth: (Math.random() * 30 + 5).toFixed(1),
    conversion: (Math.random() * 15 + 5).toFixed(1),
    revenue: (Math.random() * 500 + 100).toFixed(0)
  }

  return (
    <div className="group relative">
      {/* Figma-style Frame Border / Figma 스타일 프레임 테두리 */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[#635BFF] via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>

      {/* Component Frame Label / 컴포넌트 프레임 레이블 */}
      <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 px-2 py-1 bg-[#635BFF] rounded-t-lg">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: randomAccent }}></div>
          <span className="text-white text-[10px] font-mono">JobCard_{job.id}</span>
        </div>
      </div>

      <div className="relative bg-[#1E1E1E] border border-[#2C2C2C] rounded-2xl overflow-hidden hover:border-[#635BFF] transition-all duration-300 hover:shadow-2xl hover:shadow-[#635BFF]/20">
        {/* Stripe Dashboard Header / Stripe 대시보드 헤더 */}
        <div className="bg-gradient-to-br from-[#635BFF] to-[#5B4FE8] p-6 relative overflow-hidden">
          {/* Animated Grid Background / 애니메이션 그리드 배경 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <div className="relative z-10">
            {/* Company Logo / 회사 로고 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                  {job.companyLogoUrl ? (
                    <img src={job.companyLogoUrl} alt={job.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-[#635BFF]" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{job.companyName}</h3>
                  <div className="flex items-center gap-1 text-white/70 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              {job.isPremium && (
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Job Title / 채용공고 제목 */}
            <h2 className="text-white text-xl font-bold mb-2 line-clamp-2 leading-tight">
              {job.title}
            </h2>

            {/* Metrics Bar / 지표 바 */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1 text-white text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                <Users className="w-3 h-3" />
                <span className="font-semibold">{mockMetrics.applications}</span>
              </div>
              <div className="flex items-center gap-1 text-white text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" />
                <span className="font-semibold">+{mockMetrics.growth}%</span>
              </div>
              <div className="flex items-center gap-1 text-white text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                <DollarSign className="w-3 h-3" />
                <span className="font-semibold">{mockMetrics.conversion}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Widgets / 대시보드 위젯 */}
        <div className="p-6 space-y-4">
          {/* Chart Widget / 차트 위젯 */}
          <div className="bg-[#141414] border border-[#2C2C2C] rounded-xl p-4 group-hover:border-[#635BFF]/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#999999] text-xs font-medium uppercase tracking-wide">Applications</span>
              <div className="flex items-center gap-1 text-[#0ACF83] text-xs font-semibold">
                <ArrowUpRight className="w-3 h-3" />
                <span>+{mockMetrics.growth}%</span>
              </div>
            </div>
            {/* Mini Bar Chart / 미니 막대 차트 */}
            <div className="flex items-end gap-1 h-12">
              {Array.from({ length: 12 }).map((_, i) => {
                const height = Math.random() * 100
                return (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#635BFF] to-[#A259FF] rounded-t transition-all duration-500 group-hover:from-[#F24E1E] group-hover:to-[#FF7262]"
                    style={{
                      height: `${height}%`,
                      transitionDelay: `${i * 30}ms`
                    }}
                  ></div>
                )
              })}
            </div>
          </div>

          {/* Salary Widget / 급여 위젯 */}
          <div className="bg-gradient-to-br from-[#635BFF]/10 to-transparent border border-[#635BFF]/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#999999] text-xs mb-1">Salary Range</div>
                <div className="text-white text-lg font-bold">{salary}</div>
              </div>
              <div className="w-12 h-12 bg-[#635BFF]/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#635BFF]" />
              </div>
            </div>
          </div>

          {/* Employment Type & Experience / 고용 형태 & 경력 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#141414] border border-[#2C2C2C] rounded-lg p-3">
              <div className="text-[#999999] text-[10px] uppercase tracking-wide mb-1">Type</div>
              <div className="text-white text-sm font-semibold">{job.employmentType ?? job.boardType}</div>
            </div>
            <div className="bg-[#141414] border border-[#2C2C2C] rounded-lg p-3">
              <div className="text-[#999999] text-[10px] uppercase tracking-wide mb-1">Experience</div>
              <div className="text-white text-sm font-semibold">{job.experienceLevel}</div>
            </div>
          </div>

          {/* Visa Types / 비자 유형 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: randomAccent }}></div>
              <span className="text-[#999999] text-xs font-medium uppercase tracking-wide">Visa Support</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(job.matchedVisaTypes ?? job.allowedVisas ?? []).slice(0, 4).map((visa, index) => {
                const colors = visaColors[index]
                return (
                  <span
                    key={visa}
                    className={`px-2.5 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-md border border-current/20`}
                  >
                    {visa}
                  </span>
                )
              })}
              {(job.matchedVisaTypes ?? job.allowedVisas ?? []).length > 4 && (
                <span className="px-2.5 py-1 bg-[#2C2C2C] text-[#999999] text-xs font-semibold rounded-md">
                  +{(job.matchedVisaTypes ?? job.allowedVisas ?? []).length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Deadline Bar / 마감일 바 */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2C2C2C]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#999999]" />
              {dday ? (
                <span className="text-[#F24E1E] text-sm font-bold">{dday}</span>
              ) : (
                <span className="text-[#0ACF83] text-sm font-semibold">상시채용</span>
              )}
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] hover:bg-[#5B4FE8] text-white text-sm font-semibold rounded-lg transition-colors group/btn">
              <span>View Details</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Component Info (Figma-style) / 컴포넌트 정보 (Figma 스타일) */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-[#666666] text-[10px] font-mono">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: randomAccent }}></div>
              <span>Component • {job.employmentType ?? job.boardType} • Updated recently</span>
            </div>
          </div>
        </div>

        {/* Selection Border Effect / 선택 테두리 효과 */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#635BFF]"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#635BFF]"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#635BFF]"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#635BFF]"></div>
        </div>
      </div>
    </div>
  )
}
