'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { MapPin, Clock, Users, TrendingUp, Flame } from 'lucide-react';
import { useState } from 'react';

/**
 * Design g-022: KakaoTalk Chat (카카오톡 채팅)
 *
 * 카카오톡 채팅방 스타일의 채용공고 카드
 * KakaoTalk chat room style job posting cards
 *
 * Category: Interactive
 * Reference: KakaoTalk
 * Hover: Read receipt + Typing indicator (읽음 표시 + 타이핑 인디케이터)
 * Features: Speech bubble layout, Yellow header (#FEE500), Chat background, Emoticons, Timestamps, Kakao Brown (#3C1E1E)
 * Uses: companyLogo YES, industryImage NO
 */

const designInfo = {
  id: 'g-022',
  name: 'KakaoTalk Chat',
  nameKo: '카카오톡 채팅',
  category: 'interactive',
  difficulty: 'medium',
  reference: 'KakaoTalk',
  hoverEffect: 'Read receipt + Typing indicator',
  features: [
    'Speech bubble layout',
    'Kakao yellow header (#FEE500)',
    'Chat room background (#B2C7D9)',
    'Company avatar with logo',
    'Timestamp next to bubbles',
    'Read receipt on hover',
    'Typing indicator animation',
    'Visa type tags',
    'Chat-style info display'
  ],
  uses: {
    industryImage: false,
    companyLogo: true
  }
};

export default function G022Page() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header / 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#FEE500]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEE500] flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#3C1E1E]">
                {designInfo.name}
                <span className="text-slate-400 ml-3 text-xl">({designInfo.nameKo})</span>
              </h1>
              <p className="text-slate-600 mt-1">Design ID: {designInfo.id} • Category: {designInfo.category}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-[#3C1E1E] mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Features / 특징
              </h3>
              <ul className="text-sm text-slate-600 space-y-1">
                {designInfo.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#3C1E1E] mb-2">Reference / 참고</h3>
              <p className="text-sm text-slate-600 mb-3">{designInfo.reference}</p>
              <h3 className="font-semibold text-[#3C1E1E] mb-2">Hover Effect / 호버 효과</h3>
              <p className="text-sm text-slate-600">{designInfo.hoverEffect}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KakaoTalk Chat Room / 카카오톡 채팅방 */}
      <div className="max-w-4xl mx-auto">
        {/* Chat Header / 채팅방 헤더 */}
        <div className="bg-[#FEE500] rounded-t-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3C1E1E] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#FEE500]" />
              </div>
              <div>
                <h2 className="text-[#3C1E1E] font-bold text-lg">채용공고 채팅방</h2>
                <p className="text-[#3C1E1E] text-xs opacity-70">{sampleJobsV2.length}개의 새로운 채용정보</p>
              </div>
            </div>
            <div className="text-[#3C1E1E] text-sm font-medium">
              {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Chat Messages / 채팅 메시지 */}
        <div className="bg-[#B2C7D9] rounded-b-2xl p-6 shadow-lg space-y-6 min-h-[800px]">
          {sampleJobsV2.map((job, index) => (
            <div
              key={job.id}
              className="flex gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredId(job.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Company Avatar / 회사 아바타 */}
              <div className="flex-shrink-0">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-12 h-12 rounded-full object-cover bg-white border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FEE500] to-[#FFD700] flex items-center justify-center border-2 border-white shadow-md">
                    <span className="text-[#3C1E1E] font-bold text-lg">{job.companyInitial}</span>
                  </div>
                )}
              </div>

              {/* Message Bubble / 말풍선 */}
              <div className="flex-1 max-w-2xl">
                {/* Company Name / 회사명 */}
                <div className="text-[#3C1E1E] text-sm font-medium mb-1">{job.company}</div>

                {/* Bubble Content / 말풍선 내용 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-md hover:shadow-xl transition-all duration-300">
                    {/* Badges / 뱃지 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.isUrgent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-sm">
                          <Flame className="w-3 h-3" />
                          긴급
                        </span>
                      )}
                      {job.isFeatured && (
                        <span className="px-2.5 py-1 bg-gradient-to-r from-[#FEE500] to-[#FFD700] text-[#3C1E1E] text-xs font-bold rounded-full shadow-sm">
                          ⭐ 추천
                        </span>
                      )}
                      {job.tierType === 'PREMIUM' && (
                        <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm">
                          ✨ 프리미엄
                        </span>
                      )}
                    </div>

                    {/* Job Title / 채용 제목 */}
                    <h3 className="text-[#3C1E1E] font-bold text-lg mb-2 hover:text-[#FEE500] transition-colors cursor-pointer">
                      {job.title}
                    </h3>

                    {/* Salary / 급여 */}
                    <div className="text-[#FEE500] font-bold text-xl mb-3 bg-[#3C1E1E] inline-block px-3 py-1 rounded-lg">
                      {formatSalary(job)}
                    </div>

                    {/* Job Info / 채용 정보 */}
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FEE500]" />
                        <span>{job.location}</span>
                      </div>
                      {job.workHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#FEE500]" />
                          <span>{job.workHours}</span>
                        </div>
                      )}
                    </div>

                    {/* Visa Types / 비자 유형 */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200">
                      {job.allowedVisas.slice(0, 4).map((visa, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: getVisaColor(visa) + '20',
                            color: getVisaColor(visa),
                            border: `1px solid ${getVisaColor(visa)}40`
                          }}
                        >
                          {visa}
                        </span>
                      ))}
                      {job.allowedVisas.length > 4 && (
                        <span className="px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-full">
                          +{job.allowedVisas.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Stats / 통계 */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        지원자 {job.applicantCount}
                      </span>
                      <span>조회 {job.viewCount}</span>
                      {getDDay(job.closingDate) && (
                        <span className="ml-auto font-medium text-[#3C1E1E]">
                          {getDDay(job.closingDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timestamp / 시간 */}
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-xs text-[#3C1E1E] opacity-60">
                      {getTimeAgo(job.postedDate)}
                    </span>
                    {/* Read Receipt / 읽음 표시 */}
                    {hoveredId === job.id && (
                      <span className="text-xs text-[#FEE500] font-medium animate-fade-in">
                        읽음 1
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator / 타이핑 인디케이터 */}
          {hoveredId && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-white font-bold text-lg">잡</span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input (Decorative) / 채팅 입력창 (장식용) */}
        <div className="bg-white border-t-2 border-slate-200 p-4 rounded-b-2xl shadow-lg mt-0">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#FEE500] transition-colors">
              <span className="text-xl">➕</span>
            </button>
            <div className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm text-slate-400">
              메시지를 입력하세요...
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#FEE500] transition-colors">
              <span className="text-xl">😊</span>
            </button>
          </div>
        </div>
      </div>

      {/* Design Info Footer / 디자인 정보 푸터 */}
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-[#3C1E1E] mb-3">Design Information / 디자인 정보</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-600">Difficulty:</span>
            <span className="ml-2 text-slate-800">{designInfo.difficulty}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">Category:</span>
            <span className="ml-2 text-slate-800">{designInfo.category}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">Uses Company Logo:</span>
            <span className="ml-2 text-slate-800">{designInfo.uses.companyLogo ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <span className="font-medium text-slate-600">Uses Industry Image:</span>
            <span className="ml-2 text-slate-800">{designInfo.uses.industryImage ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
