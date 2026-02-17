'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import {
  MapPin,
  Clock,
  Briefcase,
  Target,
  Calendar,
  Eye,
  Users,
  TrendingUp
} from 'lucide-react';
import {
  sampleJobsV2,
  getDDay,
  formatSalary,
  getVisaColor,
  type MockJobPostingV2
} from '../_mock/job-mock-data-v2';

// 디자인 메타데이터 / Design metadata
const designInfo = {
  id: 'g-029',
  name: '카카오뱅크 카드 (KakaoBank Card)',
  category: '유니크',
  reference: '카카오뱅크',
  description: '신용카드 형태의 잡 카드 디자인. 카카오뱅크 스타일의 노란색 그라디언트 배경, 라운드 모서리, 3D 틸트 호버 효과, 핵심 수치 3개 표시. Credit card-shaped job card design with KakaoBank yellow gradient, rounded corners, 3D tilt hover effect, and three key metrics display.',
  author: 'Gemini'
};

// 3D 틸트 효과를 위한 타입 / Type for 3D tilt effect
interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
}

export default function G029KakaoBankCardDesign() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 헤더 / Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                💳 {designInfo.name}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {designInfo.description}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                {designInfo.category}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Reference: {designInfo.reference} | {designInfo.author}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 카드 그리드 / Card grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleJobsV2.map((job) => (
            <KakaoBankCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* 디자인 정보 푸터 / Design info footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            🎨 Design Concept
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• <strong>신용카드 형태:</strong> 실제 카드와 유사한 비율과 라운드 모서리</li>
            <li>• <strong>KakaoBank 컬러:</strong> 프리미엄은 노란색 그라디언트, 일반은 회색</li>
            <li>• <strong>3D 틸트 호버:</strong> 마우스 위치에 따라 perspective 효과로 입체감 부여</li>
            <li>• <strong>핵심 수치 3개:</strong> 급여/D-day/매칭률을 카드 번호처럼 배치</li>
            <li>• <strong>미니멀 UI:</strong> 깔끔한 카카오뱅크 스타일</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 카카오뱅크 스타일 카드 컴포넌트 / KakaoBank-style card component
function KakaoBankCard({ job }: { job: MockJobPostingV2 }) {
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, scale: 1 });
  const cardRef = useRef<HTMLDivElement>(null);

  // 마우스 이동에 따른 3D 틸트 계산 / Calculate 3D tilt based on mouse movement
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // 마우스 X 상대 위치 / Mouse X relative position
    const y = e.clientY - rect.top;  // 마우스 Y 상대 위치 / Mouse Y relative position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // -1 ~ 1 범위로 정규화 / Normalize to -1 ~ 1 range
    const rotateY = ((x - centerX) / centerX) * 15; // 최대 15도 / Max 15 degrees
    const rotateX = ((centerY - y) / centerY) * 15;

    setTilt({ rotateX, rotateY, scale: 1.05 });
  };

  // 마우스 나갈 때 원래대로 / Reset on mouse leave
  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  const dDay = getDDay(job.closingDate);
  const salary = formatSalary(job);
  const isPremium = job.tierType === 'PREMIUM';

  return (
    <div className="perspective-1000">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 카드 본체 / Card body */}
        <div
          className={`
            relative overflow-hidden rounded-2xl shadow-xl
            aspect-[1.586/1] w-full
            ${isPremium
              ? 'bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500'
              : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200'
            }
          `}
          style={{
            boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 1px 8px rgba(0,0,0,0.1)',
          }}
        >
          {/* 배경 패턴 / Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          {/* 상단: 로고 영역 (카드 네트워크 로고 위치) / Top: Logo area (card network logo position) */}
          <div className="absolute top-5 right-5 z-10">
            {job.companyLogo ? (
              <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={`
                w-12 h-12 rounded-xl shadow-md flex items-center justify-center text-lg font-bold
                ${isPremium ? 'bg-white text-yellow-600' : 'bg-gray-800 text-white'}
              `}>
                {job.companyInitial}
              </div>
            )}
          </div>

          {/* 좌측 상단: 티어 + 긴급/추천 배지 / Top-left: Tier + urgent/featured badges */}
          <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
            <div className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold
              ${isPremium
                ? 'bg-white/90 text-yellow-700 shadow-md'
                : 'bg-gray-800/80 text-white'
              }
            `}>
              {isPremium ? '⭐ PREMIUM' : 'STANDARD'}
            </div>
            {job.isUrgent && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-red-500 text-white shadow-md">
                🔥 긴급
              </div>
            )}
            {job.isFeatured && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-purple-500 text-white shadow-md">
                👑 추천
              </div>
            )}
          </div>

          {/* 중앙: 핵심 수치 3개 (카드 번호 스타일) / Center: Three key metrics (card number style) */}
          <div className="absolute top-1/2 left-5 right-5 transform -translate-y-1/2 z-10">
            <div className="space-y-3">
              {/* 급여 / Salary */}
              <div className={`
                text-2xl font-bold tracking-wider
                ${isPremium ? 'text-gray-900' : 'text-gray-800'}
              `}>
                {salary}
              </div>

              {/* D-day + 매칭률 / D-day + Match score */}
              <div className="flex items-center gap-4">
                <div className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold
                  ${isPremium
                    ? 'bg-white/80 text-red-600'
                    : 'bg-gray-800/80 text-white'
                  }
                `}>
                  <Clock className="w-4 h-4" />
                  {dDay}
                </div>

                {job.matchScore && (
                  <div className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold
                    ${isPremium
                      ? 'bg-white/80 text-green-600'
                      : 'bg-gray-800/80 text-white'
                    }
                  `}>
                    <Target className="w-4 h-4" />
                    {job.matchScore}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 하단: 회사명 + 직무 (카드 홀더명 위치) / Bottom: Company + Job title (cardholder name position) */}
          <div className="absolute bottom-5 left-5 right-5 z-10">
            <div className={`
              text-xs font-medium mb-1 opacity-70
              ${isPremium ? 'text-gray-700' : 'text-gray-600'}
            `}>
              {job.company}
            </div>
            <div className={`
              text-base font-bold line-clamp-1
              ${isPremium ? 'text-gray-900' : 'text-gray-800'}
            `}>
              {job.title}
            </div>

            {/* 위치 / Location */}
            <div className={`
              flex items-center gap-1 mt-2 text-xs
              ${isPremium ? 'text-gray-700' : 'text-gray-600'}
            `}>
              <MapPin className="w-3 h-3" />
              {job.location}
            </div>
          </div>

          {/* 카드 칩 스타일 장식 / Card chip decoration */}
          <div className={`
            absolute top-16 left-5 w-10 h-8 rounded-md
            ${isPremium
              ? 'bg-gradient-to-br from-yellow-600 to-yellow-700'
              : 'bg-gradient-to-br from-gray-400 to-gray-500'
            }
            opacity-20
          `} />
        </div>

        {/* 하단: 비자 배지 (카드 뒷면 느낌) / Bottom: Visa badges (back of card style) */}
        <div className="mt-4 flex flex-wrap gap-2">
          {job.allowedVisas.slice(0, 5).map((visa, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border"
              style={{
                backgroundColor: `${getVisaColor(visa)}20`,
                borderColor: getVisaColor(visa),
                color: getVisaColor(visa),
              }}
            >
              {visa}
            </span>
          ))}
          {job.allowedVisas.length > 5 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-300">
              +{job.allowedVisas.length - 5}
            </span>
          )}
        </div>

        {/* 추가 정보 (호버 시 보이는 효과는 제거, 항상 표시) / Additional info (always visible) */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {job.applicantCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {job.viewCount}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {job.postedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
