'use client';

import { useRouter } from 'next/navigation';
import { mockPathways } from '../../_mock/diagnosis-mock-data';
import { ArrowDown, Clock, Coins, ChevronRight } from 'lucide-react';

// 점수에 따른 배경 그라디언트 / Background gradient by rank
const rankGradients = [
  'from-blue-50 to-blue-100',
  'from-green-50 to-green-100',
  'from-purple-50 to-purple-100',
  'from-orange-50 to-orange-100',
  'from-pink-50 to-pink-100',
];

// 실현 가능성 라벨 색상 / Feasibility label colors
const feasibilityColors: Record<string, string> = {
  HIGH: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-orange-100 text-orange-700',
};

const feasibilityLabels: Record<string, string> = {
  HIGH: '높음',
  MEDIUM: '보통',
  LOW: '낮음',
};

export default function SwipeResultPage() {
  const router = useRouter();

  // 점수 순으로 정렬 / Sort by score
  const sortedPathways = [...mockPathways].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* 모바일 프레임 컨테이너 / Mobile frame container */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden relative" style={{ height: '844px' }}>
        {/* 스크롤 스냅 컨테이너 / Scroll snap container */}
        <div className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
          {sortedPathways.map((pathway, index) => (
            <div
              key={pathway.id}
              className="h-full snap-start flex flex-col relative"
            >
              {/* 카드 배경 그라디언트 / Card background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${rankGradients[index] || rankGradients[4]}`} />

              {/* 카드 내용 / Card content */}
              <div className="relative flex-1 flex flex-col justify-between p-8">
                {/* 상단: 순위 배지 / Top: Rank badge */}
                <div className="flex justify-between items-start">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <span className="text-2xl font-bold text-gray-900">
                      #{index + 1}
                    </span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${feasibilityColors[pathway.feasibility]}`}>
                    실현가능성 {feasibilityLabels[pathway.feasibility]}
                  </div>
                </div>

                {/* 중앙: 경로 정보 / Center: Pathway info */}
                <div className="space-y-6">
                  {/* 경로 이름 / Pathway name */}
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                      {pathway.nameKo}
                    </h2>
                    <p className="text-lg text-gray-600">{pathway.nameEn}</p>
                  </div>

                  {/* 비자 체인 플로우 / Visa chain flow */}
                  <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                    {pathway.visaChain.map((visa, idx) => (
                      <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg border border-gray-200">
                          <div className="font-bold text-gray-900">{visa.code}</div>
                        </div>
                        {idx < pathway.visaChain.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 점수 원형 인디케이터 / Circular score indicator */}
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      {/* SVG 원형 게이지 / SVG circular gauge */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="white"
                          strokeWidth="8"
                          opacity="0.3"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray={`${(pathway.score / 100) * 351.86} 351.86`}
                          className="text-blue-600"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">
                            {pathway.score}
                          </div>
                          <div className="text-xs text-gray-600">점</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 정보 행 / Info row */}
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        {pathway.durationMonths}개월
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                      <Coins className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        {(pathway.estimatedCostKRW / 10000).toFixed(0)}만원
                      </span>
                    </div>
                  </div>
                </div>

                {/* 하단: 액션 버튼 / Bottom: Action button */}
                <div className="space-y-4">
                  <button
                    onClick={() => router.push(`/diagnosis/designs/swipe/result/${pathway.id}`)}
                    className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    자세히 보기
                    <ArrowDown className="w-5 h-5" />
                  </button>

                  {/* 다음 카드 힌트 / Next card hint */}
                  {index < sortedPathways.length - 1 && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <ArrowDown className="w-3 h-3 animate-bounce" />
                        <span>아래로 스크롤</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 다음 카드 프리뷰 (5% 보이기) / Next card preview (5% visible) */}
              {index < sortedPathways.length - 1 && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-br ${rankGradients[index + 1] || rankGradients[4]} opacity-60 rounded-t-3xl`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 하단 고정 버튼 / Bottom fixed button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <button
              onClick={() => router.push('/diagnosis/designs/swipe')}
              className="w-full py-3 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              다시 진단하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
