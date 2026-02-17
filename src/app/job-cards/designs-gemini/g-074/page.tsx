'use client'

import React, { useState } from 'react'
import { Play, Users, TrendingUp, Clock, MapPin, Building2, BadgeCheck, Briefcase } from 'lucide-react'
import { sampleJobsV2 as jobs, formatSalary, getVisaColor, getDDay } from '../_mock/job-mock-data-v2'

// Design metadata / 디자인 메타데이터
const designInfo = {
  id: 'g-074',
  name: 'Spotify×Netflix×Discord Streaming',
  category: 'creative',
  references: ['Spotify', 'Netflix', 'Discord'],
  description: '3 streaming platforms combined in dark theme with tri-color accents',
  colors: {
    spotify: '#1DB954',
    netflix: '#E50914',
    discord: '#5865F2',
  },
  features: [
    'Equalizer bars (Spotify)',
    'Card expansion (Netflix)',
    'Member count (Discord)',
    'Dark background with tri-color accents',
    'Industry images as thumbnails',
    'Play + expand + member overlay effect',
  ],
}

export default function G074Page() {
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-[#1DB954] via-[#E50914] to-[#5865F2] p-[2px] rounded-2xl">
          <div className="bg-[#0a0a0a] rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" fill="white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {designInfo.name}
                </h1>
                <p className="text-gray-400">{designInfo.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {designInfo.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const visaColors = getVisaColor(job.visaTypes[0])
          const dday = getDDay(job.deadline ?? job.closingDate)
          const isPlaying = playingId === job.id
          const isExpanded = expandedId === job.id

          return (
            <div
              key={job.id}
              className="group relative"
              onMouseEnter={() => {
                setPlayingId(job.id)
                setExpandedId(job.id)
              }}
              onMouseLeave={() => {
                setPlayingId(null)
                setExpandedId(null)
              }}
            >
              {/* Card Container */}
              <div
                className={`
                  relative bg-[#121212] rounded-2xl overflow-hidden
                  border border-white/10
                  transition-all duration-500 ease-out
                  ${isExpanded ? 'scale-105 shadow-2xl shadow-[#1DB954]/20' : 'hover:border-white/20'}
                `}
              >
                {/* Thumbnail Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={job.image ?? job.industryImage}
                    alt={job.company}
                    className={`
                      w-full h-full object-cover
                      transition-transform duration-700
                      ${isExpanded ? 'scale-110' : 'scale-100'}
                    `}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />

                  {/* Play Button Overlay (Spotify) */}
                  <div
                    className={`
                      absolute inset-0 flex items-center justify-center
                      transition-opacity duration-300
                      ${isPlaying ? 'opacity-100' : 'opacity-0'}
                    `}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#1DB954] flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110">
                      <Play className="w-8 h-8 text-black ml-1" fill="black" />
                    </div>
                  </div>

                  {/* Equalizer Bars (Spotify) */}
                  {isPlaying && (
                    <div className="absolute top-4 right-4 flex items-end gap-1 h-8">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-[#1DB954] rounded-full animate-pulse"
                          style={{
                            height: `${20 + Math.random() * 80}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '0.8s',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Member Count Badge (Discord) */}
                  <div
                    className={`
                      absolute top-4 left-4 px-3 py-1.5 rounded-full
                      bg-[#5865F2] text-white text-xs font-semibold
                      flex items-center gap-1.5
                      transition-all duration-300
                      ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                    `}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{Math.floor(Math.random() * 500 + 100)}+</span>
                  </div>

                  {/* D-Day Badge */}
                  {dday && (
                    <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-[#E50914] text-white text-xs font-bold">
                      {dday}
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-5">
                  {/* Company & Premium Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">
                      {job.company}
                    </span>
                    {job.isPremium && (
                      <BadgeCheck className="w-4 h-4 text-[#1DB954]" fill="#1DB954" />
                    )}
                  </div>

                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-snug">
                    {job.title}
                  </h3>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4 text-[#5865F2]" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Briefcase className="w-4 h-4 text-[#E50914]" />
                      <span>{job.employmentType ?? job.boardType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-[#1DB954]" />
                      <span className="font-semibold text-[#1DB954]">
                        {formatSalary(job)}
                      </span>
                    </div>
                  </div>

                  {/* Visa Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.visaTypes.slice(0, 3).map((visa, index) => {
                      const colors = getVisaColor(visa)
                      return (
                        <span
                          key={index}
                          className={`
                            px-2.5 py-1 rounded-lg text-xs font-semibold
                            ${colors.bg} ${colors.text}
                            border border-white/20
                          `}
                        >
                          {visa}
                        </span>
                      )
                    })}
                    {job.visaTypes.length > 3 && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-gray-400 border border-white/10">
                        +{job.visaTypes.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Expanded Content (Netflix style) */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-500
                      ${isExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                        {job.description ?? job.title}
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 rounded-lg bg-[#1DB954] text-black font-semibold text-sm hover:bg-[#1ed760] transition-colors">
                          지원하기
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors">
                          저장
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tri-Color Progress Bar */}
                  <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`
                        h-full bg-gradient-to-r from-[#1DB954] via-[#E50914] to-[#5865F2]
                        transition-all duration-1000
                        ${isPlaying ? 'w-full' : 'w-0'}
                      `}
                    />
                  </div>
                </div>

                {/* Hover Border Glow */}
                <div
                  className={`
                    absolute inset-0 rounded-2xl pointer-events-none
                    transition-opacity duration-500
                    ${isExpanded ? 'opacity-100' : 'opacity-0'}
                  `}
                  style={{
                    background: 'linear-gradient(135deg, #1DB954 0%, #E50914 50%, #5865F2 100%)',
                    padding: '2px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Stats (Discord server stats style) */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#121212] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center">
              <Play className="w-5 h-5 text-black" fill="black" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{jobs.length}</div>
              <div className="text-sm text-gray-400">Active Listings</div>
            </div>
          </div>
        </div>
        <div className="bg-[#121212] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {jobs.filter((j) => j.isPremium).length}
              </div>
              <div className="text-sm text-gray-400">Premium Jobs</div>
            </div>
          </div>
        </div>
        <div className="bg-[#121212] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">12.5K+</div>
              <div className="text-sm text-gray-400">Active Seekers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
