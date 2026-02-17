'use client'

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import { Building2, MapPin, Briefcase, TrendingUp, Star, ChevronRight, Package, Zap, Users } from 'lucide-react'

/**
 * Design Information / 디자인 정보
 */
const designInfo = {
  id: 'g-055',
  name: '크몽×AngelList (Kmong×AngelList)',
  category: 'unique',
  reference: 'Kmong freelancer marketplace + AngelList startup job board',
  description: 'Service package pricing tiers with tech stack badges. Combines freelancer marketplace feel with startup hiring aesthetic. Features funding stage indicators and portfolio showcase style with hover-activated pricing comparison.',
  author: 'Claude'
}

/**
 * Funding stage mock data / 펀딩 단계 목데이터
 */
const fundingStages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth']

/**
 * Package tier mock data / 패키지 티어 목데이터
 */
interface PricingTier {
  name: string
  price: string
  features: string[]
  highlight?: boolean
}

const generatePricingTiers = (job: MockJobPostingV2): PricingTier[] => {
  const baseSalary = job.salary && typeof job.salary === 'object' && 'min' in job.salary
    ? job.salary.min
    : (job.salaryMin ?? 3500)

  return [
    {
      name: 'Basic',
      price: `${(baseSalary * 0.8).toLocaleString()}만원`,
      features: ['주 3일 근무', '원격 근무', '기본 복리후생']
    },
    {
      name: 'Standard',
      price: `${baseSalary.toLocaleString()}만원`,
      features: ['주 5일 근무', '하이브리드', '표준 복리후생', '교육 지원'],
      highlight: true
    },
    {
      name: 'Premium',
      price: `${(baseSalary * 1.3).toLocaleString()}만원`,
      features: ['풀타임', '프리미엄 복리후생', '스톡옵션', 'VP 트랙']
    }
  ]
}

/**
 * Job Card Component / 잡 카드 컴포넌트
 */
function JobCard({ job, index }: { job: MockJobPostingV2; index: number }) {
  const dday = getDDay(job.closingDate)
  const salary = formatSalary(job)
  const fundingStage = fundingStages[index % fundingStages.length]
  const pricingTiers = generatePricingTiers(job)

  return (
    <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700">
      {/* Header with company branding / 회사 브랜딩 헤더 */}
      <div className="relative bg-gradient-to-r from-[#FF6B5A] via-[#FF8A7A] to-[#FFA89A] p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center flex-shrink-0 border-2 border-white/50">
              <Building2 className="w-8 h-8 text-[#FF6B5A]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white truncate">
                  {job.company}
                </h3>
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="font-medium">{fundingStage}</span>
                </div>
              </div>
            </div>
          </div>

          {dday && (
            <div className={`px-3 py-1.5 rounded-lg font-bold text-sm flex-shrink-0 ${
              dday === '마감'
                ? 'bg-gray-600 text-gray-300'
                : dday === '상시모집'
                ? 'bg-white/20 text-white backdrop-blur-sm'
                : 'bg-white text-[#FF6B5A] shadow-lg'
            }`}>
              {dday}
            </div>
          )}
        </div>
      </div>

      {/* Main content / 메인 콘텐츠 */}
      <div className="p-6 space-y-4">
        {/* Job title with package icon / 패키지 아이콘이 있는 직무 타이틀 */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B5A] to-[#FF8A7A] flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white leading-tight flex-1 group-hover:text-[#FF6B5A] transition-colors">
            {job.title}
          </h2>
        </div>

        {/* Tech stack badges / 기술 스택 배지 */}
        <div className="flex flex-wrap gap-2">
          {job.techStack?.slice(0, 5).map((tech, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm font-medium hover:border-[#FF6B5A] hover:text-[#FF6B5A] transition-all"
            >
              {tech}
            </div>
          ))}
          {job.techStack && job.techStack.length > 5 && (
            <div className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-sm">
              +{job.techStack.length - 5}
            </div>
          )}
        </div>

        {/* Employment type and experience / 고용 형태 및 경력 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
            <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-300 truncate">{job.employmentType ?? job.boardType}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-300 truncate">{job.experience ?? job.experienceRequired ?? ''}</span>
          </div>
        </div>

        {/* Salary highlight / 급여 하이라이트 */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1">Standard Package</div>
              <div className="text-2xl font-bold text-white">
                {salary}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B5A] to-[#FF8A7A] flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Visa types / 비자 종류 */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Eligible Visa Types
          </div>
          <div className="flex flex-wrap gap-2">
            {(job.visaTypes ?? []).slice(0, 4).map((visa, idx) => {
              const colors = getVisaColor(visa)
              return (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${colors.bg} ${colors.text} border border-current/20`}
                >
                  {visa}
                </div>
              )
            })}
            {job.visaTypes.length > 4 && (
              <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-700 text-gray-300">
                +{job.visaTypes.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* View details button / 상세보기 버튼 */}
        <button className="w-full mt-4 bg-gradient-to-r from-[#FF6B5A] to-[#FF8A7A] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B5A]/30 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
          <span>View All Packages</span>
          <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Hover overlay - Pricing comparison / 호버 오버레이 - 가격 비교 */}
      <div className="absolute inset-0 bg-gray-900/98 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Choose Your Package</h3>
            <p className="text-gray-400 text-sm">Select the engagement level that fits your needs</p>
          </div>

          {/* Pricing tiers / 가격 티어 */}
          <div className="space-y-3">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] cursor-pointer ${
                  tier.highlight
                    ? 'bg-gradient-to-br from-[#FF6B5A] to-[#FF8A7A] border-[#FF6B5A] shadow-lg shadow-[#FF6B5A]/30'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={`text-lg font-bold ${tier.highlight ? 'text-white' : 'text-gray-300'}`}>
                      {tier.name}
                    </div>
                    {tier.highlight && (
                      <div className="text-xs text-white/80 font-medium">Most Popular</div>
                    )}
                  </div>
                  <div className={`text-2xl font-bold ${tier.highlight ? 'text-white' : 'text-gray-200'}`}>
                    {tier.price}
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {tier.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className={`text-sm flex items-center gap-2 ${
                        tier.highlight ? 'text-white/90' : 'text-gray-400'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        tier.highlight ? 'bg-white' : 'bg-gray-500'
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Tech stack in overlay / 오버레이의 기술 스택 */}
          <div className="pt-4 border-t border-gray-700">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Full Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {job.techStack?.map((tech, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-gray-800 border border-gray-700 text-gray-300 text-xs"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Close hint / 닫기 힌트 */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">Hover away to return</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Main Page Component / 메인 페이지 컴포넌트
 */
export default function KmongAngelListDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header / 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#FF6B5A] to-[#FF8A7A] rounded-full text-white text-sm font-semibold mb-4">
            {designInfo.id.toUpperCase()}
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {designInfo.name}
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-2">
            {designInfo.description}
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
              Category: {designInfo.category}
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
              Reference: {designInfo.reference}
            </span>
          </div>
        </div>

        {/* Job Cards Grid / 잡 카드 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {sampleJobsV2.slice(0, 6).map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>

        {/* Design Info Footer / 디자인 정보 푸터 */}
        <div className="mt-16 p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Design Features</h2>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF6B5A] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <strong className="text-white">Service Package Tiers:</strong> Basic/Standard/Premium pricing options within each card
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF6B5A] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <strong className="text-white">Tech Stack Focus:</strong> Prominent tech badges with hover expansion
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF6B5A] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <strong className="text-white">Startup Branding:</strong> Funding stage indicators and portfolio showcase style
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF6B5A] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <strong className="text-white">Hover Interaction:</strong> Full pricing comparison table slides in on hover
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
