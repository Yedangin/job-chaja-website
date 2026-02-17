'use client'

import { useState } from 'react'
import { sampleJobsV2, getDDay, formatSalary, getVisaColor, type MockJobPostingV2 } from '../_mock/job-mock-data-v2'
import {
  Filter,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Calendar,
  Globe,
  Building2,
  X
} from 'lucide-react'

export const designInfo = {
  id: 'g-061',
  name: 'Notion×블라인드 (Notion×Blind)',
  category: 'platform' as const,
  description: 'Notion database view + Blind anonymous blur hybrid with filter chips',
  features: [
    'DB table/board view with property rows',
    'Company name blur toggle (anonymous mode)',
    'Notion-style filter chips at top',
    'Clean white/gray data-focused theme',
    'Multi-filter combination UI',
    'Hover: blur toggle + filter expansion'
  ]
}

type FilterType = {
  id: string
  label: string
  value: string
  category: 'jobType' | 'salary' | 'visa' | 'location'
}

export default function G061Page() {
  const [jobs] = useState<MockJobPostingV2[]>(sampleJobsV2.slice(0, 8))
  const [blurCompanies, setBlurCompanies] = useState(true)
  const [expandedFilters, setExpandedFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([])

  // Filter options / 필터 옵션
  const filterOptions = {
    jobType: ['정규직', '계약직', '인턴', '알바'],
    salary: ['3000만원 이상', '4000만원 이상', '5000만원 이상', '협의'],
    visa: ['E-7', 'E-9', 'F-2', 'F-4', 'F-5', 'H-2'],
    location: ['서울', '경기', '인천', '부산', '대구']
  }

  const addFilter = (category: FilterType['category'], value: string) => {
    const newFilter: FilterType = {
      id: `${category}-${value}-${Date.now()}`,
      label: value,
      value,
      category
    }
    setActiveFilters([...activeFilters, newFilter])
  }

  const removeFilter = (id: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== id))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      {/* Header / 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">채용 공고 데이터베이스</h1>
                <p className="text-sm text-gray-500">Job Posting Database</p>
              </div>
            </div>
            <button
              onClick={() => setBlurCompanies(!blurCompanies)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {blurCompanies ? (
                <>
                  <EyeOff className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">익명 모드</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">공개 모드</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section / 필터 섹션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Filter Toggle / 필터 토글 */}
          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
          >
            <Filter className="w-4 h-4" />
            <span>필터</span>
            {expandedFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {activeFilters.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Active Filters / 활성 필터 */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {activeFilters.map(filter => (
                <div
                  key={filter.id}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="hover:bg-blue-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm underline"
              >
                모두 지우기
              </button>
            </div>
          )}

          {/* Expanded Filter Options / 확장 필터 옵션 */}
          {expandedFilters && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              {/* Job Type / 고용 형태 */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  고용 형태
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.jobType.map(type => (
                    <button
                      key={type}
                      onClick={() => addFilter('jobType', type)}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary / 급여 */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5" />
                  급여 조건
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.salary.map(salary => (
                    <button
                      key={salary}
                      onClick={() => addFilter('salary', salary)}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {salary}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visa / 비자 */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  비자 유형
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.visa.map(visa => (
                    <button
                      key={visa}
                      onClick={() => addFilter('visa', visa)}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {visa}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location / 지역 */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  근무 지역
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.location.map(location => (
                    <button
                      key={location}
                      onClick={() => addFilter('location', location)}
                      className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Database View / 데이터베이스 뷰 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header / 테이블 헤더 */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
            <div className="col-span-3">회사명 / Company</div>
            <div className="col-span-3">포지션 / Position</div>
            <div className="col-span-2">급여 / Salary</div>
            <div className="col-span-2">비자 / Visa</div>
            <div className="col-span-2">마감 / Deadline</div>
          </div>

          {/* Job Rows / 공고 행 */}
          <div className="divide-y divide-gray-100">
            {jobs.map((job) => {
              const dday = getDDay(job.deadline ?? job.closingDate)
              const visaColors = getVisaColor((job.visaType ?? job.allowedVisas ?? [])[0])

              return (
                <div
                  key={job.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  {/* Company / 회사명 */}
                  <div className="col-span-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={job.companyLogo}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className={`font-semibold text-gray-900 text-sm mb-1 transition-all duration-300 ${
                          blurCompanies ? 'blur-sm group-hover:blur-none' : ''
                        }`}>
                          {job.company}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Position / 포지션 */}
                  <div className="col-span-3">
                    <div className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {job.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        <Briefcase className="w-3 h-3" />
                        {job.jobType}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        <Users className="w-3 h-3" />
                        {job.experience ?? job.experienceRequired ?? ''}
                      </span>
                    </div>
                  </div>

                  {/* Salary / 급여 */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {formatSalary(job)}
                    </div>
                  </div>

                  {/* Visa / 비자 */}
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {(job.visaType ?? job.allowedVisas ?? []).slice(0, 2).map((visa, idx) => {
                        const colors = getVisaColor(visa)
                        return (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1 px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded font-medium`}
                          >
                            <Globe className="w-3 h-3" />
                            {visa}
                          </span>
                        )
                      })}
                      {(job.visaType ?? job.allowedVisas ?? []).length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{(job.visaType ?? job.allowedVisas ?? []).length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Deadline / 마감 */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(job.deadline ?? job.closingDate ?? new Date()).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        {dday && (
                          <div className={`text-xs font-semibold ${
                            dday.includes('마감')
                              ? 'text-red-600'
                              : dday.includes('D-')
                              ? 'text-orange-600'
                              : 'text-gray-500'
                          }`}>
                            {dday}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer / 푸터 */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              총 {jobs.length}개 공고
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* Info Footer / 정보 푸터 */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Filter className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">데이터베이스 뷰 안내</h3>
              <p className="text-sm text-gray-600">
                Notion 스타일의 데이터베이스 뷰와 Blind의 익명 모드를 결합한 디자인입니다.
                상단 필터로 조건을 조합하고, 우측 상단 버튼으로 회사명 공개/익명을 전환할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
