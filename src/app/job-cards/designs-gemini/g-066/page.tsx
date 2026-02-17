'use client'

import {
  Briefcase,
  MapPin,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Zap,
  Play,
  Volume2
} from 'lucide-react'
import { formatSalary, getVisaColor, getDDay } from '../_mock/job-mock-data-v2'
import type { Job } from '../_mock/job-mock-data-v2'

// Design metadata / 디자인 메타데이터
export const designInfo = {
  id: 'g-066',
  name: 'Discord×TikTok',
  category: 'interactive',
  description: 'Discord server + TikTok short-form feed hybrid with dark theme and engagement metrics',
  theme: 'Discord server feed meets TikTok vertical cards',
  colors: ['#36393f', '#000000', '#5865F2', '#FF006B', '#00F2EA'],
  features: [
    'Discord dark theme (#36393f)',
    'TikTok short-form vertical card feel',
    'Purple (#5865F2) + vibrant pink/cyan accents',
    'Server-style feed with member indicators',
    'Engagement metrics (views, likes, comments)',
    'Hover: Online members + auto-play indicator',
    'Video thumbnail-style industry images'
  ]
}

// Mock server/engagement data / 서버/참여 데이터 모킹
const getEngagementData = (jobId: number) => {
  const seed = jobId * 137
  return {
    views: Math.floor((seed % 50) * 100 + 1200),
    likes: Math.floor((seed % 30) * 10 + 80),
    comments: Math.floor((seed % 15) * 5 + 12),
    shares: Math.floor((seed % 8) * 3 + 5),
    membersOnline: Math.floor((seed % 50) + 20),
    totalMembers: Math.floor((seed % 200) + 100),
    trending: seed % 3 === 0
  }
}

// Job card component / 공고 카드 컴포넌트
function JobCard({ job, index }: { job: Job; index: number }) {
  const engagement = getEngagementData(job.id)
  const visaColor = getVisaColor(job.visa_types?.[0])
  const dday = getDDay(job.deadline ?? job.closingDate)

  return (
    <div className="group relative bg-[#2f3136] rounded-lg overflow-hidden border border-[#202225] hover:border-[#5865F2] transition-all duration-300 hover:shadow-[0_0_20px_rgba(88,101,242,0.3)]">
      {/* Video thumbnail header / 비디오 썸네일 헤더 */}
      <div className="relative h-80 overflow-hidden bg-black">
        <img
          src={job.company_image || `https://picsum.photos/seed/${job.id}/400/600`}
          alt={job.company_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* TikTok-style gradient overlay / TikTok 스타일 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Auto-play indicator / 자동재생 표시 */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Play className="w-3 h-3 text-[#00F2EA] fill-current" />
            <Volume2 className="w-3 h-3 text-[#00F2EA]" />
          </div>
        </div>

        {/* Trending badge / 트렌딩 배지 */}
        {engagement.trending && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#FF006B] to-[#FF8A00] px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-bold text-white">TRENDING</span>
            </div>
          </div>
        )}

        {/* D-day badge / 마감일 배지 */}
        {dday && (
          <div className="absolute top-4 right-4 mt-10">
            <div className="bg-[#5865F2] px-3 py-1.5 rounded-full shadow-lg">
              <span className="text-xs font-bold text-white">{dday}</span>
            </div>
          </div>
        )}

        {/* Bottom info overlay / 하단 정보 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Company info / 회사 정보 */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={job.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company_name)}&background=5865F2&color=fff`}
                alt={job.company_name}
                className="w-12 h-12 rounded-full border-2 border-[#5865F2]"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#3ba55d] rounded-full border-2 border-black" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base truncate">
                {job.company_name}
              </h3>
              <p className="text-xs text-gray-400 truncate">{job.industry}</p>
            </div>
          </div>

          {/* Job title / 공고 제목 */}
          <h4 className="text-white font-bold text-lg line-clamp-2 leading-tight">
            {job.title}
          </h4>

          {/* Visa & Location / 비자 & 위치 */}
          <div className="flex items-center gap-2 flex-wrap">
            {job.visa_types?.slice(0, 2).map((visa, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-bold rounded-full"
                style={{
                  backgroundColor: getVisaColor(visa).bg,
                  color: getVisaColor(visa).text
                }}
              >
                {visa}
              </span>
            ))}
            <div className="flex items-center gap-1 text-[#00F2EA]">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{job.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content section / 콘텐츠 섹션 */}
      <div className="p-4 space-y-3">
        {/* Salary & Type / 급여 & 고용형태 */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-white">
              {formatSalary(job)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{job.employment_type}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-[#5865F2]">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-bold">{job.experience_required}</span>
            </div>
          </div>
        </div>

        {/* Engagement metrics (TikTok-style) / 참여 지표 (TikTok 스타일) */}
        <div className="flex items-center justify-between pt-3 border-t border-[#40444b]">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#FF006B] transition-colors group/like">
              <Heart className="w-4 h-4 group-hover/like:fill-current" />
              <span className="text-sm font-bold">{engagement.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#00F2EA] transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-bold">{engagement.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-bold">{engagement.shares}</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-bold">{engagement.views.toLocaleString()}</span>
          </div>
        </div>

        {/* Server members (Discord-style) / 서버 멤버 (Discord 스타일) */}
        <div className="flex items-center justify-between pt-2 border-t border-[#40444b]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#3ba55d] rounded-full animate-pulse" />
              <span className="text-xs text-[#3ba55d] font-bold">
                {engagement.membersOnline} online
              </span>
            </div>
            <span className="text-xs text-gray-500">•</span>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {engagement.totalMembers} members
              </span>
            </div>
          </div>

          {/* Quick action / 빠른 액션 */}
          <button className="flex items-center gap-1.5 bg-[#5865F2] hover:bg-[#4752C4] text-white px-3 py-1.5 rounded-md transition-colors">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">Apply Now</span>
          </button>
        </div>
      </div>

      {/* Hover effect glow / 호버 효과 글로우 */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5865F2] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00F2EA] to-transparent" />
      </div>
    </div>
  )
}

// Main page component / 메인 페이지 컴포넌트
export default function G066Page() {
  // Mock jobs data / 공고 데이터 모킹
  const jobs: Job[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: [
      'Senior Full-Stack Developer',
      'UI/UX Designer (Remote)',
      'Data Scientist - AI Team',
      'Frontend React Engineer',
      'DevOps Engineer',
      'Backend Node.js Developer',
      'Mobile Flutter Developer',
      'Product Manager',
      'QA Automation Engineer',
      'Cloud Solutions Architect',
      'Marketing Manager',
      'Business Analyst'
    ][i],
    company_name: [
      'TechCorp',
      'DesignHub',
      'AI Innovations',
      'StartupXYZ',
      'CloudScale',
      'CodeBase',
      'MobileFirst',
      'ProductLab',
      'QualityWorks',
      'SkyTech',
      'BrandBoost',
      'DataDriven'
    ][i],
    company_logo: `https://ui-avatars.com/api/?name=${['TechCorp', 'DesignHub', 'AI+Innovations', 'StartupXYZ', 'CloudScale', 'CodeBase', 'MobileFirst', 'ProductLab', 'QualityWorks', 'SkyTech', 'BrandBoost', 'DataDriven'][i]}&background=${['5865F2', 'FF006B', '00F2EA', '7B68EE', 'FF8A00', '00D9FF', 'FF1744', '4CAF50', 'FFC107', '9C27B0', 'FF5722', '2196F3'][i]}&color=fff`,
    company_image: `https://picsum.photos/seed/${i + 1}/400/600`,
    location: ['Seoul', 'Remote', 'Busan', 'Seoul', 'Incheon', 'Seoul', 'Remote', 'Seoul', 'Daegu', 'Seoul', 'Remote', 'Seoul'][i],
    salary_min: [40, 35, 50, 38, 45, 42, 40, 55, 35, 60, 40, 45][i] * 1000000,
    salary_max: [70, 55, 90, 60, 75, 68, 65, 85, 55, 100, 65, 70][i] * 1000000,
    employment_type: ['Full-time', 'Full-time', 'Full-time', 'Full-time', 'Contract', 'Full-time', 'Full-time', 'Full-time', 'Full-time', 'Full-time', 'Full-time', 'Contract'][i],
    experience_required: ['3-5 years', '2-4 years', '5+ years', '2-3 years', '4-6 years', '3-5 years', '2-4 years', '5+ years', '2-3 years', '6+ years', '3-5 years', '4-6 years'][i],
    education_required: ['Bachelor', 'Bachelor', 'Master', 'Bachelor', 'Bachelor', 'Bachelor', 'Bachelor', 'Bachelor', 'Bachelor', 'Master', 'Bachelor', 'Bachelor'][i],
    industry: ['IT/Software', 'Design', 'AI/ML', 'Tech', 'Cloud', 'Software', 'Mobile', 'Product', 'QA', 'Cloud', 'Marketing', 'Analytics'][i],
    visa_types: [
      ['E-7', 'F-2'],
      ['E-7', 'F-5'],
      ['E-7', 'D-8'],
      ['E-7', 'F-2'],
      ['E-7', 'F-4'],
      ['E-7', 'F-2'],
      ['E-7', 'F-5'],
      ['E-7', 'D-8'],
      ['E-7', 'F-2'],
      ['E-7', 'F-4'],
      ['E-7', 'F-2'],
      ['E-7', 'D-8']
    ][i],
    deadline: new Date(Date.now() + [5, 12, 3, 20, 7, 15, 2, 25, 10, 8, 4, 18][i] * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
  }))

  return (
    <div className="min-h-screen bg-[#36393f] py-12 px-4">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-[#5865F2] to-[#7289DA] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                {designInfo.name}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {designInfo.description}
              </p>
            </div>
          </div>

          {/* Features / 특징 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {designInfo.features.map((feature, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Server header (Discord-style) / 서버 헤더 (Discord 스타일) */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-[#2f3136] rounded-lg p-4 border border-[#202225] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#5865F2] rounded-full flex items-center justify-center font-black text-white text-xl">
              J
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Job Server</h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#3ba55d] rounded-full" />
                  <span className="text-[#3ba55d] font-medium">234 online</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">1,247 members</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 bg-[#40444b] hover:bg-[#4f545c] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-[#40444b] hover:bg-[#4f545c] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Job cards grid / 공고 카드 그리드 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </div>
      </div>

      {/* Footer / 푸터 */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="bg-[#2f3136] rounded-lg p-6 border border-[#202225]">
          <p className="text-gray-400 text-sm">
            <span className="font-bold text-[#5865F2]">{designInfo.id}</span>
            {' • '}
            <span className="text-white">{designInfo.theme}</span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            {designInfo.colors.map((color, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full border-2 border-[#40444b]"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
