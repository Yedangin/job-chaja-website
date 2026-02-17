'use client';

import Link from 'next/link';
import { MapPin, ArrowRight, ArrowLeft, Trophy, Clock, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pathwayResults } from '../../_mock/diagnosis-mock-data';

// 한국 지도 SVG 간단한 윤곽 / Simplified Korea map outline SVG
const KoreaMapSVG = () => (
  <svg viewBox="0 0 200 300" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 간단한 한국 지도 윤곽 / Simplified Korea outline */}
    <path
      d="M 100 20 Q 110 25 115 35 L 120 50 Q 125 60 125 70 L 130 90 Q 135 110 130 130 L 125 150 Q 120 170 115 185 L 110 200 Q 105 215 100 225 L 95 240 Q 90 255 85 265 L 80 280 Q 75 265 70 250 L 65 230 Q 60 210 60 190 L 55 170 Q 50 150 52 130 L 55 110 Q 58 90 62 75 L 68 60 Q 75 45 82 35 L 90 25 Q 95 20 100 20 Z"
      fill="#f0f9ff"
      stroke="#0ea5e9"
      strokeWidth="2"
    />
    {/* 제주도 / Jeju Island */}
    <ellipse cx="80" cy="290" rx="12" ry="6" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="1.5" />
  </svg>
);

// 경로 색상 배열 / Route color array
const routeColors = [
  { dot: 'bg-orange-500', line: 'border-orange-400', text: 'text-orange-600' },
  { dot: 'bg-blue-500', line: 'border-blue-400', text: 'text-blue-600' },
  { dot: 'bg-purple-500', line: 'border-purple-400', text: 'text-purple-600' },
];

// 지도 위 핀 위치 (백분율) / Pin positions on map (percentage)
const pinPositions = [
  { top: '15%', left: '52%' }, // 상단
  { top: '35%', left: '68%' }, // 우측상단
  { top: '60%', left: '55%' }, // 중앙
];

// 여정 결과 페이지 (지도 스타일) / Journey result page (map style)
export default function JourneyResultPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">당신의 비자 여정 지도</h1>
          <p className="text-gray-600">추천 경로를 선택하여 상세 여정을 확인하세요</p>
        </div>

        {/* 한국 지도 + 경로 핀 / Korea map + route pins */}
        <Card className="p-8 mb-8 bg-white shadow-xl">
          <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: '2/3' }}>
            {/* 지도 / Map */}
            <KoreaMapSVG />

            {/* 경로 점선 (SVG 오버레이) / Route dotted lines (SVG overlay) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 300">
              {/* Route 1 */}
              <path
                d="M 100 30 Q 110 70 115 110 Q 118 140 110 170"
                stroke="#fb923c"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                opacity="0.6"
              />
              {/* Route 2 */}
              <path
                d="M 95 35 Q 80 80 75 120 Q 72 160 80 190"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                opacity="0.6"
              />
              {/* Route 3 */}
              <path
                d="M 105 32 Q 120 90 118 140 Q 115 180 100 210"
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                opacity="0.6"
              />
            </svg>

            {/* 핀 마커 / Pin markers */}
            {pathwayResults.map((pathway, idx) => {
              const position = pinPositions[idx % pinPositions.length];
              const colors = routeColors[idx % routeColors.length];

              return (
                <div
                  key={pathway.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
                  style={{
                    top: position.top,
                    left: position.left,
                    animationDelay: `${idx * 0.2}s`,
                    animationDuration: '2s'
                  }}
                >
                  <div className={`${colors.dot} rounded-full w-8 h-8 shadow-lg flex items-center justify-center border-2 border-white`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className={`text-xs font-semibold ${colors.text} bg-white px-2 py-1 rounded shadow`}>
                      경로 {idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* 시작점 / Starting point */}
            <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2">
              <div className="bg-green-500 rounded-full w-10 h-10 shadow-lg flex items-center justify-center border-4 border-white">
                <span className="text-white font-bold text-xl">🛫</span>
              </div>
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-semibold text-green-600 bg-white px-2 py-1 rounded shadow">
                  시작
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* 경로 카드 목록 / Pathway cards list */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-blue-900 mb-4">추천 경로</h2>
          {pathwayResults.map((pathway, idx) => {
            const colors = routeColors[idx % routeColors.length];

            return (
              <Card key={pathway.id} className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex gap-4">
                  {/* 색상 점 (지도 연결) / Color dot (map connection) */}
                  <div className="flex-shrink-0 pt-1">
                    <div className={`${colors.dot} w-6 h-6 rounded-full border-2 border-white shadow-md`} />
                  </div>

                  <div className="flex-1">
                    {/* 경로 헤더 / Pathway header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge className={`${colors.dot} text-white mb-2`}>경로 {idx + 1}</Badge>
                        <h3 className="text-xl font-bold text-gray-900">{pathway.pathwayName}</h3>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-orange-500 mb-1">
                          <Trophy className="w-4 h-4" />
                          <span className="font-bold text-lg">{pathway.totalScore}점</span>
                        </div>
                        <span className="text-xs text-gray-500">적합도</span>
                      </div>
                    </div>

                    {/* 비자 체인 / Visa chain */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {pathway.visaChain.map((visa, vIdx) => (
                        <div key={vIdx} className="flex items-center gap-1">
                          <Badge variant="outline" className="text-sm">
                            {visa.code}
                          </Badge>
                          {vIdx < pathway.visaChain.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 요약 정보 / Summary info */}
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>총 {pathway.totalMonths}개월</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wallet className="w-4 h-4" />
                        <span>약 {pathway.estimatedCost.toLocaleString()}만원</span>
                      </div>
                    </div>

                    {/* 특징 / Highlights */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {pathway.highlights.slice(0, 2).join(' · ')}
                      </p>
                    </div>

                    {/* 상세보기 버튼 / Detail link */}
                    <Link href={`/diagnosis/designs/journey/result/${pathway.id}`}>
                      <Button className={`w-full ${colors.dot} hover:opacity-90`}>
                        경로 따라가기
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 하단 액션 / Bottom actions */}
        <div className="mt-8 text-center">
          <Link href="/diagnosis/designs/journey">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              다시 진단하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
