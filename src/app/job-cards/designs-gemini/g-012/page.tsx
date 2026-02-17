'use client';

import { sampleJobsV2, getDDay, formatSalary, getVisaColor, getIndustryColor, getTimeAgo } from '../_mock/job-mock-data-v2';
import type { MockJobPostingV2 } from '../_mock/job-mock-data-v2';
import { MapPin, Users, Eye, Clock, Flame, Star, Briefcase, Calendar } from 'lucide-react';
import { useState } from 'react';

// 디자인 정보 / Design Information
const designInfo = {
  id: 'g-012',
  name: '배민 플레이풀 (Baemin Playful)',
  category: 'creative',
  reference: '배달의민족',
  description: '배민 폰트 감성의 유머러스하고 재미있는 카드 디자인. 큰 이모지와 민트+블랙 컬러, 흔들리는 호버 효과가 특징.',
  author: 'Gemini',
  features: [
    '카드 흔들림 + 이모지 팝업 호버 효과',
    '배민 폰트 감성 타이포그래피',
    '업종별 큰 이모지 사용',
    '민트+블랙 컬러 스킴',
    '유머러스한 CTA 문구',
  ],
};

// 업종별 이모지 매핑 / Industry Emoji Mapping
const industryEmojis: Record<string, string> = {
  '제조': '🏭',
  '식품': '🍳',
  'IT': '💻',
  '건설': '🏗️',
  '물류': '📦',
  '서비스': '🛎️',
  '유통': '🛒',
  '교육': '📚',
};

// 유머러스한 문구 리스트 / Humorous Copy List
const playfulCopies = [
  '이 일자리, 찜해도 되나요?',
  '어서오세요, 좋은 일자리예요!',
  '이 회사 괜찮은 것 같아요',
  '취업의 민족이 되어보세요',
  '오늘도 구해줘서 고마워요',
  '이런 조건 어때요?',
];

export default function BaeminPlayfulDesign() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      {/* 디자인 정보 헤더 / Design Info Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white rounded-3xl shadow-lg p-8 border-4 border-black">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-block bg-[#2AC1BC] text-black px-4 py-2 rounded-full font-black text-sm mb-3">
                {designInfo.category.toUpperCase()}
              </div>
              <h1 className="text-4xl font-black text-black mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
                {designInfo.name}
              </h1>
              <p className="text-gray-600 text-lg font-bold">
                Reference: {designInfo.reference} | Author: {designInfo.author}
              </p>
            </div>
            <div className="text-6xl animate-bounce">
              🎉
            </div>
          </div>
          <p className="text-gray-700 mb-4 font-semibold text-lg">
            {designInfo.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {designInfo.features.map((feature, index) => (
              <span
                key={index}
                className="bg-[#2AC1BC] text-black px-4 py-2 rounded-full text-sm font-black border-2 border-black"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 재미있는 헤더 / Playful Header */}
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <h2 className="text-5xl font-black text-black mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
          오늘의 찐 일자리 🔥
        </h2>
        <p className="text-2xl text-gray-700 font-bold">
          이런 조건 어때요? 맘에 드는 거 골라보세요!
        </p>
      </div>

      {/* 공고 카드 그리드 / Job Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleJobsV2.map((job, index) => {
          const dday = getDDay(job.closingDate);
          const salary = formatSalary(job);
          const industryEmoji = industryEmojis[job.industry] || '💼';
          const playfulCopy = playfulCopies[index % playfulCopies.length];
          const isHovered = hoveredCard === job.id;

          return (
            <div
              key={job.id}
              className="relative group"
              onMouseEnter={() => setHoveredCard(job.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* 카드 본체 / Card Body */}
              <div
                className={`
                  bg-white rounded-3xl overflow-hidden border-4 border-black
                  shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                  transition-all duration-300
                  ${isHovered ? 'animate-[wiggle_0.3s_ease-in-out]' : ''}
                  hover:shadow-[12px_12px_0px_0px_rgba(42,193,188,1)]
                  hover:-translate-y-1
                  cursor-pointer
                `}
              >
                {/* 상단 이미지 영역 / Top Image Area */}
                <div className="relative h-40 bg-gradient-to-br from-[#2AC1BC] to-[#1FA39E] overflow-hidden">
                  {/* 산업 배경 이미지 / Industry Background */}
                  {job.industryImage && (
                    <img
                      src={job.industryImage}
                      alt={job.industry}
                      className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                  )}

                  {/* 큰 이모지 / Big Emoji */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`text-8xl transition-all duration-300 ${isHovered ? 'scale-125 rotate-12' : ''}`}>
                      {industryEmoji}
                    </div>
                  </div>

                  {/* 호버 시 팝업 이모지 / Hover Popup Emojis */}
                  {isHovered && (
                    <>
                      <div className="absolute top-4 left-4 text-4xl animate-[bounce_0.5s_ease-in-out_infinite]">
                        ⭐
                      </div>
                      <div className="absolute top-4 right-4 text-4xl animate-[bounce_0.6s_ease-in-out_infinite]">
                        💫
                      </div>
                      <div className="absolute bottom-4 left-8 text-4xl animate-[bounce_0.7s_ease-in-out_infinite]">
                        ✨
                      </div>
                      <div className="absolute bottom-4 right-8 text-4xl animate-[bounce_0.8s_ease-in-out_infinite]">
                        🎯
                      </div>
                    </>
                  )}

                  {/* 배지들 / Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {job.isFeatured && (
                      <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black border-2 border-black flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        추천
                      </div>
                    )}
                    {job.isUrgent && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black border-2 border-black flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3" />
                        급구
                      </div>
                    )}
                  </div>

                  {/* D-day 배지 / D-day Badge */}
                  {dday && (
                    <div className="absolute top-4 right-4 bg-black text-[#2AC1BC] px-4 py-2 rounded-full font-black text-sm border-2 border-[#2AC1BC]">
                      {dday}
                    </div>
                  )}

                  {/* 프리미엄 배지 / Premium Badge */}
                  {job.tierType === 'PREMIUM' && (
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-black border-2 border-black">
                      ⭐ PREMIUM
                    </div>
                  )}
                </div>

                {/* 카드 내용 / Card Content */}
                <div className="p-6">
                  {/* 회사 정보 / Company Info */}
                  <div className="flex items-center gap-3 mb-3">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-12 h-12 rounded-full border-3 border-black object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-3 border-black bg-[#2AC1BC] flex items-center justify-center font-black text-black text-lg">
                        {job.companyInitial}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-black text-black text-lg leading-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {job.company}
                      </div>
                      <div className="text-sm text-gray-600 font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                    </div>
                  </div>

                  {/* 공고 제목 / Job Title */}
                  <h3 className="font-black text-black text-xl mb-3 line-clamp-2 leading-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.01em' }}>
                    {job.title}
                  </h3>

                  {/* 급여 정보 / Salary Info */}
                  <div className="bg-[#2AC1BC] border-3 border-black rounded-2xl px-4 py-3 mb-4">
                    <div className="text-xs font-black text-black mb-1">
                      💰 이만큼 드려요!
                    </div>
                    <div className="font-black text-black text-2xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {salary}
                    </div>
                  </div>

                  {/* 비자 정보 / Visa Info */}
                  <div className="mb-4">
                    <div className="text-xs font-black text-gray-600 mb-2">
                      🛂 이 비자로 지원 가능해요
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.allowedVisas.slice(0, 3).map((visa) => (
                        <span
                          key={visa}
                          className="bg-white border-2 border-black text-black px-3 py-1 rounded-full text-xs font-black"
                        >
                          {visa}
                        </span>
                      ))}
                      {job.allowedVisas.length > 3 && (
                        <span className="bg-white border-2 border-black text-black px-3 py-1 rounded-full text-xs font-black">
                          +{job.allowedVisas.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 추가 정보 / Additional Info */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-gray-600" />
                      <span className="font-bold text-gray-700">{job.experienceRequired}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="font-bold text-gray-700">{job.workHours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="font-bold text-gray-700">{job.applicantCount}명 지원</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4 text-gray-600" />
                      <span className="font-bold text-gray-700">{job.viewCount} 조회</span>
                    </div>
                  </div>

                  {/* 복리후생 / Benefits */}
                  {job.benefits.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-black text-gray-600 mb-2">
                        🎁 이런 혜택도 있어요
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.slice(0, 3).map((benefit, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 border-2 border-gray-300 text-gray-700 px-2 py-1 rounded-lg text-xs font-bold"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 매칭 점수 (있는 경우) / Match Score */}
                  {job.matchScore && (
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-2xl px-4 py-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-yellow-900">
                          나와의 궁합도
                        </span>
                        <span className="text-2xl font-black text-yellow-900">
                          {job.matchScore}%
                        </span>
                      </div>
                      <div className="w-full bg-yellow-300 rounded-full h-2 mt-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${job.matchScore}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA 버튼 / CTA Button */}
                  <button
                    className={`
                      w-full bg-black text-[#2AC1BC] py-4 rounded-2xl font-black text-lg
                      border-3 border-[#2AC1BC]
                      transition-all duration-300
                      ${isHovered ? 'bg-[#2AC1BC] text-black border-black scale-105' : ''}
                    `}
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {playfulCopy}
                  </button>

                  {/* 게시 시간 / Posted Time */}
                  <div className="mt-3 text-center text-xs text-gray-500 font-bold flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {getTimeAgo(job.postedDate)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 CTA / Bottom CTA */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-black text-black mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            더 많은 일자리가 궁금하다면?
          </h3>
          <p className="text-lg text-gray-700 font-bold mb-6">
            지금 바로 잡차자에서 딱 맞는 일자리를 찾아보세요!
          </p>
          <button className="bg-[#2AC1BC] text-black px-8 py-4 rounded-2xl font-black text-xl border-3 border-black hover:bg-black hover:text-[#2AC1BC] hover:border-[#2AC1BC] transition-all duration-300 hover:scale-105">
            전체 공고 보러가기 →
          </button>
        </div>
      </div>

      {/* 흔들림 애니메이션 정의 / Wiggle Animation Definition */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
