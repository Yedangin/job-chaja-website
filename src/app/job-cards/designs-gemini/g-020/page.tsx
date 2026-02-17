'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { Layers, Box, Type, Circle, Square, Pen, Move, Eye, Lock, ChevronRight, Star, MapPin } from 'lucide-react';

// 디자인 정보 객체 / Design info object
const designInfo = {
  id: 'g-020',
  name: 'Figma Component Style',
  description: 'Figma design tool UI with component frames, selection borders, and properties panel',
  category: 'platform',
  features: [
    'Figma blue selection border (#0D99FF)',
    'Corner resize handles on hover',
    'Component name labels',
    'Properties panel key-value pairs',
    'Layer hierarchy indicators',
    '4-color Figma brand accents',
    'Dimension measurement lines',
    'Frame structure visualization'
  ],
  colors: {
    figmaRed: '#F24E1E',
    figmaOrange: '#FF7262',
    figmaPurple: '#A259FF',
    figmaBlue: '#1ABCFE',
    selectionBlue: '#0D99FF',
    canvasGray: '#F5F5F5'
  },
  uses: {
    industryImage: false,
    companyLogo: true
  }
};

export default function G020FigmaComponentDesign() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8">
      {/* 헤더 섹션 / Header section */}
      <header className="mb-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Box className="w-8 h-8 text-[#1ABCFE]" />
              <h1 className="text-4xl font-bold text-gray-900">
                {designInfo.name}
              </h1>
            </div>
            <p className="text-lg text-gray-600 mt-2">
              {designInfo.description}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <Layers className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Component Library</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#F24E1E]/10 to-[#F24E1E]/5 rounded-lg p-4 border border-[#F24E1E]/20">
            <div className="text-sm text-gray-600 mb-1">Design ID</div>
            <div className="text-xl font-bold text-gray-900">{designInfo.id}</div>
          </div>
          <div className="bg-gradient-to-br from-[#FF7262]/10 to-[#FF7262]/5 rounded-lg p-4 border border-[#FF7262]/20">
            <div className="text-sm text-gray-600 mb-1">Category</div>
            <div className="text-xl font-bold text-gray-900">{designInfo.category}</div>
          </div>
          <div className="bg-gradient-to-br from-[#A259FF]/10 to-[#A259FF]/5 rounded-lg p-4 border border-[#A259FF]/20">
            <div className="text-sm text-gray-600 mb-1">Components</div>
            <div className="text-xl font-bold text-gray-900">{sampleJobsV2.length}</div>
          </div>
          <div className="bg-gradient-to-br from-[#1ABCFE]/10 to-[#1ABCFE]/5 rounded-lg p-4 border border-[#1ABCFE]/20">
            <div className="text-sm text-gray-600 mb-1">Uses Logo</div>
            <div className="text-xl font-bold text-gray-900">{designInfo.uses.companyLogo ? 'YES' : 'NO'}</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-[#A259FF]" />
            Design Features
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {designInfo.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-[#1ABCFE] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 공고 카드 그리드 / Job cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {sampleJobsV2.map((job) => (
          <FigmaJobCard key={job.id} job={job} />
        ))}
      </div>

      {/* 푸터 정보 / Footer info */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Box className="w-4 h-4 text-[#1ABCFE]" />
          <span>Figma Component Design System</span>
        </div>
        <p>Hover over cards to see Figma-style selection and properties</p>
      </footer>
    </div>
  );
}

// Figma 스타일 공고 카드 컴포넌트 / Figma-style job card component
function FigmaJobCard({ job }: { job: MockJobPostingV2 }) {
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const timeAgo = getTimeAgo(job.postedAt);

  return (
    <div className="group relative">
      {/* Figma 선택 보더 + 리사이즈 핸들 / Figma selection border + resize handles */}
      <div className="absolute -inset-1 bg-transparent border-2 border-transparent group-hover:border-[#0D99FF] rounded-xl transition-all duration-200 pointer-events-none">
        {/* 코너 핸들 / Corner handles */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-[#0D99FF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-[#0D99FF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-[#0D99FF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-[#0D99FF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 컴포넌트 이름 라벨 / Component name label */}
      <div className="absolute -top-6 left-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Layers className="w-3 h-3 text-[#1ABCFE]" />
        <span className="text-xs font-medium text-gray-600">
          JobCard / {job.tier === 'PREMIUM' ? 'Premium' : 'Standard'}
        </span>
      </div>

      {/* 측정 라인 (상단) / Dimension line (top) */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-center">
          <div className="h-px bg-[#0D99FF] flex-1" />
          <span className="text-xs text-[#0D99FF] mx-2 font-mono">100%</span>
          <div className="h-px bg-[#0D99FF] flex-1" />
        </div>
      </div>

      {/* 메인 카드 / Main card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* 프레임 헤더 / Frame header */}
        <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-[#F24E1E]" />
              <span className="text-xs font-mono text-gray-500">Frame #{job.id}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-gray-400" />
              <Lock className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 카드 컨텐츠 / Card content */}
        <div className="p-6">
          {/* 회사 로고 + 정보 / Company logo + info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative group/logo">
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100"
              />
              <div className="absolute inset-0 border-2 border-[#A259FF] rounded-lg opacity-0 group-hover/logo:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{job.companyName}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          {/* 속성 패널 스타일 정보 / Properties panel style info */}
          <div className="space-y-3 mb-4">
            {/* 급여 / Salary */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#F24E1E] rounded" />
                <span className="text-xs text-gray-500 font-medium">Salary</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{salary}</span>
            </div>

            {/* 고용 형태 / Employment type */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#FF7262] rounded" />
                <span className="text-xs text-gray-500 font-medium">Type</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{job.employmentType ?? job.boardType}</span>
            </div>

            {/* 경력 / Experience */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#A259FF] rounded" />
                <span className="text-xs text-gray-500 font-medium">Experience</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{job.experience ?? job.experienceRequired ?? ''}</span>
            </div>

            {/* 학력 / Education */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#1ABCFE] rounded" />
                <span className="text-xs text-gray-500 font-medium">Education</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{job.education}</span>
            </div>
          </div>

          {/* 비자 타입 레이어 / Visa types layer */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-[#A259FF]" />
              <span className="text-xs text-gray-500 font-medium">Visa Types</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(job.matchedVisaTypes ?? job.allowedVisas ?? []).slice(0, 4).map((visa) => {
                const colors = getVisaColor(visa);
                return (
                  <span
                    key={visa}
                    className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text} border border-current/20`}
                  >
                    {visa}
                  </span>
                );
              })}
              {(job.matchedVisaTypes ?? job.allowedVisas ?? []).length > 4 && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  +{(job.matchedVisaTypes ?? job.allowedVisas ?? []).length - 4}
                </span>
              )}
            </div>
          </div>

          {/* 하단 메타 정보 / Bottom meta info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Circle className="w-3 h-3 fill-current text-green-500" />
                <span>{timeAgo}</span>
              </div>
              {dday && (
                <div className={`font-bold ${dday.includes('마감') ? 'text-red-500' : 'text-[#F24E1E]'}`}>
                  {dday}
                </div>
              )}
            </div>
            {job.tier === 'PREMIUM' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#A259FF] to-[#1ABCFE] rounded text-white">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-bold">Premium</span>
              </div>
            )}
          </div>
        </div>

        {/* 레이어 계층 인디케이터 / Layer hierarchy indicator */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Layers className="w-3 h-3" />
            <span>Frame</span>
            <ChevronRight className="w-3 h-3" />
            <span>Content</span>
            <ChevronRight className="w-3 h-3" />
            <span>Properties</span>
          </div>
        </div>
      </div>

      {/* 측정 라인 (우측) / Dimension line (right) */}
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 h-full opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-px bg-[#0D99FF] flex-1" />
          <span className="text-xs text-[#0D99FF] my-2 font-mono -rotate-90">Auto</span>
          <div className="w-px bg-[#0D99FF] flex-1" />
        </div>
      </div>
    </div>
  );
}
