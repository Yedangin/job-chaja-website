'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { MapPin, Navigation, Clock, Star, ChevronRight, Circle, Minus } from 'lucide-react';
import { useState } from 'react';

// 디자인 정보 객체 / Design info object
const designInfo = {
  id: 'g-017',
  name: 'Uber Ride',
  category: 'platform',
  reference: 'Uber',
  description: 'Uber ride-request style UI with departure-to-destination route visualization',
  features: [
    'Black and white clean design',
    'Route visualization with departure and destination',
    'ETA countdown showing D-day',
    'Price display showing salary',
    'Driver rating style match score',
    'Minimal dots and lines connecting locations'
  ],
  hover: 'ETA countdown animation',
  usesIndustryImage: false,
  usesCompanyLogo: true
};

export default function G017UberRide() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 섹션 / Header section */}
      <header className="bg-black text-white py-8 px-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{designInfo.name}</h1>
              <p className="text-gray-400">Design ID: {designInfo.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Category</p>
              <p className="text-lg font-semibold">{designInfo.category}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Reference</p>
              <p className="text-white">{designInfo.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Features</p>
              <ul className="text-sm text-white space-y-1">
                {designInfo.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* 작업 목록 섹션 / Job listings section */}
      <main className="max-w-6xl mx-auto py-12 px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-2">Available Rides</h2>
          <p className="text-gray-600">Select your destination job</p>
        </div>

        <div className="space-y-4">
          {sampleJobsV2.map((job) => {
            const dday = getDDay(job.closingDate);
            const matchScore = Math.floor(85 + Math.random() * 15); // 85-100 점수
            const estimatedTime = dday ? parseInt(dday.replace(/\D/g, '')) : 7;

            return (
              <div
                key={job.id}
                className="bg-white border-2 border-black rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer"
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="p-6">
                  {/* 상단: 회사 정보 및 매치 점수 / Top: Company info and match score */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-12 h-12 rounded-full object-cover border-2 border-black"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold">
                          {job.company.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg text-black">{job.company}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="w-4 h-4 fill-black text-black" />
                          <span className="font-semibold text-black">{(matchScore / 20).toFixed(1)}</span>
                          <span>({matchScore}% match)</span>
                        </div>
                      </div>
                    </div>

                    {/* 직무 타입 배지 / Job type badge */}
                    <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {job.employmentType ?? job.boardType}
                    </div>
                  </div>

                  {/* 중앙: 출발지-목적지 라우트 시각화 / Center: Departure-destination route */}
                  <div className="mb-6">
                    <div className="flex items-center gap-4">
                      {/* 출발지 (현재 위치) / Departure (current location) */}
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-black border-4 border-gray-300"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-500 mb-1">From</div>
                        <div className="font-medium text-black">Your Current Location</div>
                      </div>
                    </div>

                    {/* 연결선 / Connection line */}
                    <div className="flex items-center gap-4 my-2">
                      <div className="flex-shrink-0 w-3 flex justify-center">
                        <div className="w-0.5 h-8 bg-black"></div>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <Minus className="w-4 h-4 text-gray-400" />
                        <div className="flex-1 h-0.5 border-t-2 border-dashed border-gray-300"></div>
                        <Minus className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* 목적지 (근무지) / Destination (workplace) */}
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-black"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-500 mb-1">To</div>
                        <div className="font-bold text-lg text-black mb-1">{job.title}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 하단: ETA, 가격, 비자 정보 / Bottom: ETA, price, visa info */}
                  <div className="flex items-end justify-between pt-4 border-t-2 border-gray-100">
                    <div className="flex items-end gap-6">
                      {/* ETA (예상 도착 시간 = 마감일) / ETA (estimated time = deadline) */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">ETA</div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-black" />
                          {hoveredId === job.id ? (
                            <span className="font-bold text-lg text-black animate-pulse">
                              {estimatedTime} days
                            </span>
                          ) : (
                            <span className="font-bold text-lg text-black">
                              {dday || 'TBD'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 가격 (급여) / Price (salary) */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Fare</div>
                        <div className="font-bold text-xl text-black">
                          {formatSalary(job)}
                        </div>
                      </div>
                    </div>

                    {/* 비자 정보 및 요청 버튼 / Visa info and request button */}
                    <div className="flex items-center gap-3">
                      {/* 비자 배지 / Visa badges */}
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(job.eligibleVisas ?? job.allowedVisas ?? []).slice(0, 3).map((visa) => {
                          const colors = getVisaColor(visa);
                          return (
                            <span
                              key={visa}
                              className={`${colors.bg} ${colors.text} px-2 py-0.5 rounded text-xs font-medium border border-black`}
                            >
                              {visa}
                            </span>
                          );
                        })}
                        {(job.eligibleVisas ?? job.allowedVisas ?? []).length > 3 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium border border-gray-300">
                            +{(job.eligibleVisas ?? job.allowedVisas ?? []).length - 3}
                          </span>
                        )}
                      </div>

                      {/* 요청 버튼 / Request button */}
                      <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors">
                        <Navigation className="w-4 h-4" />
                        Request
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 하단 메타 정보 바 / Bottom meta info bar */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>Industry: {job.industry}</span>
                      <span>•</span>
                      <span>Posted {getTimeAgo(job.postedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                      <span className="font-medium text-green-700">Available Now</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 통계 / Bottom statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black text-white p-6 rounded-2xl">
            <div className="text-3xl font-bold mb-2">{sampleJobsV2.length}</div>
            <div className="text-gray-400">Available Rides</div>
          </div>
          <div className="bg-black text-white p-6 rounded-2xl">
            <div className="text-3xl font-bold mb-2">
              {sampleJobsV2.reduce((acc, job) => acc + (job.eligibleVisas ?? job.allowedVisas ?? []).length, 0)}
            </div>
            <div className="text-gray-400">Total Visa Routes</div>
          </div>
          <div className="bg-black text-white p-6 rounded-2xl">
            <div className="text-3xl font-bold mb-2">4.9★</div>
            <div className="text-gray-400">Average Match Score</div>
          </div>
        </div>
      </main>
    </div>
  );
}
