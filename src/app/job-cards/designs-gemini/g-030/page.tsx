'use client';

// 점핏 개발자 (Jumpit Dev) - 유니크 카테고리
// Jumpit Dev - Unique Category

import React from 'react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2,
} from '../_mock/job-mock-data-v2';
import {
  MapPin,
  Calendar,
  Users,
  Eye,
  Briefcase,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

// 디자인 정보 / Design information
export const designInfo = {
  id: 'g-030',
  name: '점핏 개발자 (Jumpit Dev)',
  category: '유니크',
  reference: '점핏 (Jumpit)',
  description:
    '개발자 타겟 점핏 스타일 디자인. 기술 스택 중심, 그린 포인트, 경력 요구 강조, 호버 시 기술 스택 배지 확대',
  author: 'Gemini',
};

// 산업별 기술 스택 매핑 (가상) / Industry-based tech stack mapping (mock)
const getTechStackByIndustry = (industry?: string): string[] => {
  const industryLower = industry?.toLowerCase() || '';

  if (industryLower.includes('it') || industryLower.includes('소프트웨어')) {
    return ['React', 'Node.js', 'TypeScript', 'AWS'];
  }
  if (industryLower.includes('제조')) {
    return ['PLC', 'CAD', 'MES', 'IoT'];
  }
  if (industryLower.includes('건설')) {
    return ['AutoCAD', 'BIM', 'Revit'];
  }
  if (industryLower.includes('물류')) {
    return ['WMS', 'TMS', 'RFID', 'SAP'];
  }
  if (industryLower.includes('교육')) {
    return ['LMS', 'Moodle', 'Zoom', 'Canvas'];
  }
  if (industryLower.includes('의료')) {
    return ['EMR', 'PACS', 'HL7', 'FHIR'];
  }

  // 기본값: 일반 비즈니스 스킬
  // Default: General business skills
  return ['Excel', 'SQL', 'Tableau', 'Python'];
};

// 경력 레벨 컬러 / Experience level color
const getExperienceColor = (exp?: string): string => {
  if (!exp) return 'bg-gray-100 text-gray-700';
  const expLower = exp.toLowerCase();
  if (expLower.includes('신입') || expLower.includes('entry'))
    return 'bg-green-100 text-green-700';
  if (expLower.includes('경력') || expLower.includes('experienced'))
    return 'bg-blue-100 text-blue-700';
  return 'bg-purple-100 text-purple-700';
};

// 점핏 스타일 잡 카드 컴포넌트 / Jumpit-style Job Card Component
const JumpitDevJobCard: React.FC<{ job: MockJobPostingV2 }> = ({ job }) => {
  const dday = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const techStack = getTechStackByIndustry(job.industry);

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 hover:border-[#00C471] hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* 프리미엄/긴급 배지 / Premium/Urgent badge */}
      <div className="absolute top-3 right-3 z-10 flex gap-1">
        {job.isFeatured && (
          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded">
            ⭐ 추천
          </span>
        )}
        {job.isUrgent && (
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded animate-pulse">
            🔥 긴급
          </span>
        )}
      </div>

      {/* 메인 컨텐츠 / Main content */}
      <div className="p-5">
        {/* 회사 로고 + 이름 / Company logo + name */}
        <div className="flex items-center gap-3 mb-3">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg border border-gray-200">
              {job.companyInitial}
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {job.company}
            </h3>
            <p className="text-xs text-gray-500">{job.industry || '기타'}</p>
          </div>
        </div>

        {/* 공고 제목 / Job title */}
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#00C471] transition-colors">
          {job.title}
        </h2>

        {/* 기술 스택 배지 (호버 시 확대) / Tech stack badges (scale on hover) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full group-hover:scale-110 group-hover:bg-[#00C471] group-hover:text-white transition-all duration-300"
              style={{
                transitionDelay: `${idx * 50}ms`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* 경력 요구사항 강조 / Experience requirement highlight */}
        {job.experienceRequired && (
          <div className="mb-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold ${getExperienceColor(job.experienceRequired)}`}
            >
              <Briefcase className="w-4 h-4" />
              {job.experienceRequired}
            </span>
          </div>
        )}

        {/* 급여 정보 / Salary info */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-[#00C471]">{salary}</span>
          <span className="text-xs text-gray-500">
            {job.boardType === 'PART_TIME' ? '/시간' : '/연'}
          </span>
        </div>

        {/* 위치 / Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{job.location}</span>
        </div>

        {/* 매칭 점수 바 / Match score bar */}
        {job.matchScore !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600 font-medium">매칭도</span>
              <span className="text-[#00C471] font-bold">
                {job.matchScore}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00C471] to-[#00E87F] transition-all duration-500 ease-out"
                style={{ width: `${job.matchScore}%` }}
              />
            </div>
          </div>
        )}

        {/* 복리후생 칩 / Benefits chips */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.benefits.slice(0, 3).map((benefit, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded border border-green-200"
              >
                {benefit}
              </span>
            ))}
            {job.benefits.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                +{job.benefits.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 비자 정보 / Visa info */}
        {job.allowedVisas && job.allowedVisas.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.allowedVisas.slice(0, 4).map((visa, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 text-xs font-medium rounded ${getVisaColor(visa)}`}
              >
                {visa}
              </span>
            ))}
            {job.allowedVisas.length > 4 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                +{job.allowedVisas.length - 4}
              </span>
            )}
          </div>
        )}

        {/* 하단 메타 정보 / Bottom meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {job.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {job.applicantCount}명 지원
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {dday}
          </span>
        </div>

        {/* 지원하기 버튼 / Apply button */}
        <button className="w-full py-3 bg-[#00C471] hover:bg-[#00E87F] text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn">
          지원하기
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// 메인 페이지 컴포넌트 / Main Page Component
export default function G030Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 / Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00C471]/10 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-[#00C471]" />
            <span className="text-sm font-semibold text-[#00C471]">
              {designInfo.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {designInfo.name}
          </h1>
          <p className="text-gray-600 mb-2">{designInfo.description}</p>
          <p className="text-sm text-gray-500">
            Reference: {designInfo.reference} | Design ID: {designInfo.id} |
            Author: {designInfo.author}
          </p>
        </div>

        {/* 디자인 특징 안내 / Design features guide */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00C471] rounded-full" />
            디자인 특징 (Design Features)
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-3">
              <span className="text-[#00C471] font-bold">✓</span>
              <div>
                <strong>그린 포인트:</strong> 점핏 특유의 그린 컬러 (#00C471)
                사용
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-[#00C471] font-bold">✓</span>
              <div>
                <strong>기술 스택 중심:</strong> 상단에 기술 스택 배지 강조
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-[#00C471] font-bold">✓</span>
              <div>
                <strong>호버 효과:</strong> 기술 스택 배지가 순차적으로 확대
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-[#00C471] font-bold">✓</span>
              <div>
                <strong>경력 요구 강조:</strong> 경력 레벨을 별도 배지로 표시
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-[#00C471] font-bold">✓</span>
              <div>
                <strong>매칭도 시각화:</strong> 퍼센트 바로 적합도 표시
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-[#00C471] font-bold">✓</span>
              <div>
                <strong>개발자 타겟:</strong> 정보 밀도 높은 컴팩트한 레이아웃
              </div>
            </div>
          </div>
        </div>

        {/* 공고 카드 그리드 (6개 전체 표시) / Job cards grid (all 6 displayed) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleJobsV2.map((job) => (
            <JumpitDevJobCard key={job.id} job={job} />
          ))}
        </div>

        {/* 푸터 안내 / Footer guide */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            ✨ 호버하여 기술 스택 배지 확대 효과를 확인하세요 (Hover to see
            tech stack badge animation)
          </p>
          <p className="mt-2">
            💚 개발자 채용에 최적화된 점핏 스타일 디자인 (Jumpit-style design
            optimized for developer recruitment)
          </p>
        </div>
      </div>
    </div>
  );
}
