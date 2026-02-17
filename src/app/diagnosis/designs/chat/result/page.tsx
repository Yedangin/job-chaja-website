'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import { mockDiagnosisResult, getScoreColor } from '../../_mock/diagnosis-mock-data';

export default function ChatResultPage() {
  const router = useRouter();

  // Get feasibility badge color / 가능성 배지 색상
  const getFeasibilityColor = (label: string) => {
    if (label.includes('높음') || label.includes('High')) return 'bg-green-100 text-green-700';
    if (label.includes('보통') || label.includes('Medium')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 to-white">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Header / 헤더 */}
        <div className="py-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="text-3xl mb-3">🎉</div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                분석 완료!
                <br />
                당신에게 맞는 경로를 찾았어요
              </h1>
              <p className="text-sm text-gray-500">
                총 {mockDiagnosisResult.pathways.length}개의 가능한 경로를 찾았습니다
              </p>
            </div>
          </div>
        </div>

        {/* Pathway cards / 경로 카드 목록 */}
        <div className="space-y-4">
          {mockDiagnosisResult.pathways.map((pathway, index) => {
            const visaChain = pathway.visaChain.split(' → ');
            const scoreColor = getScoreColor(pathway.finalScore);

            return (
              <div
                key={pathway.pathwayId}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Rank badge / 순위 배지 */}
                {index === 0 && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full mb-3">
                    👑 추천
                  </div>
                )}

                {/* Pathway name / 경로 이름 */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{pathway.nameKo}</h3>

                {/* Visa chain badges / 비자 체인 배지 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {visaChain.map((visa, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-lg">
                        {visa.trim()}
                      </span>
                      {idx < visaChain.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Score indicator / 점수 표시 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Circular score / 원형 점수 */}
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#e5e7eb"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={scoreColor}
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - pathway.finalScore / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold" style={{ color: scoreColor }}>
                          {pathway.finalScore}
                        </span>
                      </div>
                    </div>

                    {/* Feasibility badge / 가능성 배지 */}
                    <div>
                      <div
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getFeasibilityColor(
                          pathway.feasibilityLabel
                        )}`}
                      >
                        {pathway.feasibilityLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration and cost / 기간 및 비용 */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{pathway.estimatedMonths}개월</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <span>💰</span>
                    <span>{pathway.estimatedCostWon}만원</span>
                  </div>
                </div>

                {/* View detail button / 상세보기 버튼 */}
                <button
                  onClick={() => router.push(`/diagnosis/designs/chat/result/${pathway.pathwayId}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-sky-50 text-sky-600 font-medium rounded-xl hover:bg-sky-100 transition-colors"
                >
                  <span>자세히 보기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Restart button / 다시 진단하기 버튼 */}
        <div className="mt-8">
          <button
            onClick={() => {
              sessionStorage.removeItem('diagnosis-answers');
              router.push('/diagnosis/designs/chat');
            }}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>다시 진단하기</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
