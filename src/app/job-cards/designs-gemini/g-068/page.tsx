'use client'

import React from 'react'
import { Building2, MapPin, Clock, Users, DollarSign, Calendar, Globe, ChevronRight } from 'lucide-react'
import { sampleJobsV2 as jobs, formatSalary, getVisaColor, getDDay } from '../_mock/job-mock-data-v2'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-068',
  name: '리멤버×점핏',
  category: 'minimal',
  description: 'Business namecard shape with tech stack on the back. Card flip animation on hover reveals tech requirements and stack badges.',
  features: [
    'Business card form factor',
    '3D card flip animation on hover',
    'Front: Company info and job basics',
    'Back: Tech stack badges and requirements',
    'Clean minimal professional design',
    'Developer-focused presentation'
  ]
}

export default function G068Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {designInfo.id}: {designInfo.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {designInfo.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {designInfo.features.map((feature, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Design Info Footer */}
      <div className="max-w-4xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Design Specifications</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt className="font-semibold text-gray-700 mb-1">Category</dt>
            <dd className="text-gray-600">{designInfo.category}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-700 mb-1">Key Feature</dt>
            <dd className="text-gray-600">3D Card Flip Animation</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold text-gray-700 mb-1">Interaction</dt>
            <dd className="text-gray-600">Hover to flip card and reveal tech stack details</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function JobCard({ job }: { job: any }) {
  const visaColor = getVisaColor((job.allowedVisas ?? [])[0] ?? 'E-7')
  const dday = getDDay(job.deadline ?? job.closingDate)
  const salary = formatSalary(job)

  return (
    <div className="perspective-1000 h-[380px]">
      <div className="relative w-full h-full transition-transform duration-700 transform-style-3d hover:rotate-y-180 group">
        {/* Front Side - Company Info */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {job.company}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{job.industry}</p>
                </div>
              </div>
              {dday && (
                <div className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded">
                  {dday}
                </div>
              )}
            </div>

            {/* Job Title */}
            <h4 className="text-base font-bold text-gray-800 mb-3 line-clamp-2">
              {job.title}
            </h4>

            {/* Quick Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                <span>{salary}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>{job.experience ?? job.experienceRequired ?? ''}</span>
              </div>
            </div>

            {/* Visa Badge */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${visaColor.bg} ${visaColor.text}`}>
                  {(job.allowedVisas ?? [])[0] ?? ''}
                </span>
                <div className="text-xs text-gray-400 flex items-center">
                  <span className="mr-1">Flip card</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side - Tech Stack */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-md border border-slate-700 p-6 flex flex-col text-white">
            {/* Header */}
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-1">Tech Requirements</h3>
              <p className="text-sm text-slate-300">{job.company}</p>
            </div>

            {/* Required Skills */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {(job.skills ?? job.techStack ?? []).slice(0, 4).map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Tech Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-slate-400" />
                <span className="text-slate-300">{job.employmentType ?? job.boardType}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                <span className="text-slate-300">
                  {new Date(job.postedDate).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Globe className="w-4 h-4 mr-2 text-slate-400" />
                <span className="text-slate-300">{job.language}</span>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-auto pt-4 border-t border-slate-700">
              <button className="w-full py-2.5 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors text-sm">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .group:hover .rotate-y-180 {
          transform: rotateY(0deg);
        }
      `}</style>
    </div>
  )
}
