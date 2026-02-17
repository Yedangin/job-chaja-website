"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Share2, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDiagnosisResult } from "../../_mock/diagnosis-mock-data";

// Get emoji based on pathway type / 경로 유형에 따른 이모지
const getPathwayEmoji = (type: string) => {
  const emojiMap: Record<string, string> = {
    student: "🎓",
    worker: "💼",
    entrepreneur: "🚀",
    family: "👨‍👩‍👧",
    investment: "💎",
    cultural: "🎨",
  };
  return emojiMap[type] || "🌟";
};

// Get rank badge style / 순위 배지 스타일
const getRankBadgeStyle = (rank: number) => {
  if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-orange-500 text-white";
  if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-400 text-white";
  if (rank === 3) return "bg-gradient-to-br from-orange-300 to-orange-400 text-white";
  return "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900";
};

export default function GamifiedResultPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);

  const topPathway = mockDiagnosisResult.pathways[0];
  const otherPathways = mockDiagnosisResult.pathways.slice(1);

  // Helper to get pathway type from visaChain / 비자체인에서 경로 타입 추출
  const getPathwayType = (visaChain: string): string => {
    // visaChain is already a string like "D-4 → D-2-1"
    if (visaChain.includes("D-2") || visaChain.includes("D-4")) return "student";
    if (visaChain.includes("E-7") || visaChain.includes("E-9")) return "worker";
    if (visaChain.includes("F-2")) return "family";
    return "worker";
  };

  useEffect(() => {
    // Hide celebration overlay after animation / 애니메이션 후 축하 오버레이 숨기기
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle share actions / 공유 액션 처리
  const handleShare = (platform: string) => {
    // Mock share functionality / 공유 기능 목킹
    console.log(`Sharing to ${platform}`);
    alert(`${platform} 공유 기능은 추후 구현 예정입니다!`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Celebration overlay / 축하 오버레이 */}
      {showCelebration && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 z-50 flex items-center justify-center animate-fade-out">
          <div className="text-center">
            <div className="text-9xl mb-6 animate-bounce">🎉</div>
            <p className="text-4xl font-bold text-white animate-pulse">
              최적의 경로를 찾았어요!
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
        {/* Header / 헤더 */}
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              🎯 당신의 한국 여정
            </h1>
            <p className="text-lg text-gray-600">
              {mockDiagnosisResult.pathways.length}개 경로를 분석하여 최적의 여정을 찾았어요
            </p>
          </div>

          {/* Top pathway hero card / 최고 경로 히어로 카드 */}
          <div className="relative mb-8 animate-scale-in">
            {/* Trophy badge / 트로피 배지 */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white animate-bounce-slow">
                🏆
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl p-8 pt-12 shadow-2xl text-white relative overflow-hidden">
              {/* Background decoration / 배경 장식 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                {/* Title / 제목 */}
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">{getPathwayEmoji(getPathwayType(topPathway.visaChain))}</div>
                  <h2 className="text-3xl font-bold mb-2">{topPathway.nameKo}</h2>
                  <p className="text-blue-100">{topPathway.nameEn}</p>
                </div>

                {/* Score circle / 점수 원 */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="white"
                        strokeOpacity="0.2"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="white"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${topPathway.finalScore * 3.52} 352`}
                        className="animate-draw-circle"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{topPathway.finalScore}</span>
                      <span className="text-sm text-blue-100">매칭 점수</span>
                    </div>
                  </div>
                </div>

                {/* Key info / 주요 정보 */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <div className="text-3xl mb-2">⏱️</div>
                    <p className="text-sm text-blue-100 mb-1">예상 기간</p>
                    <p className="font-bold text-lg">{topPathway.estimatedMonths}개월</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <p className="text-sm text-blue-100 mb-1">예상 비용</p>
                    <p className="font-bold text-lg">{topPathway.estimatedCostWon}만원</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <div className="text-3xl mb-2">📋</div>
                    <p className="text-sm text-blue-100 mb-1">비자 경로</p>
                    <p className="font-bold text-lg">{topPathway.visaChain.split(' → ').length}단계</p>
                  </div>
                </div>

                {/* Visa chain / 비자 체인 */}
                <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                  {topPathway.visaChain.split(' → ').map((visa, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-medium">
                        {visa}
                      </span>
                      {idx < topPathway.visaChain.split(' → ').length - 1 && (
                        <span className="text-2xl">→</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA button / 액션 버튼 */}
                <Button
                  size="lg"
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 text-lg py-6 rounded-2xl font-bold hover:scale-105 transition-transform"
                  onClick={() => router.push(`/diagnosis/designs/gamified/result/${topPathway.pathwayId}`)}
                >
                  자세히 보기 →
                </Button>
              </div>
            </div>
          </div>

          {/* Other pathways / 기타 경로들 */}
          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">다른 추천 경로</h3>
            {otherPathways.map((pathway, idx) => (
              <button
                key={pathway.pathwayId}
                onClick={() => router.push(`/diagnosis/designs/gamified/result/${pathway.pathwayId}`)}
                className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  {/* Rank badge / 순위 배지 */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${getRankBadgeStyle(
                      idx + 2
                    )}`}
                  >
                    {idx + 2}
                  </div>

                  {/* Emoji / 이모지 */}
                  <div className="text-4xl flex-shrink-0">
                    {getPathwayEmoji(getPathwayType(pathway.visaChain))}
                  </div>

                  {/* Info / 정보 */}
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {pathway.nameKo}
                    </h4>
                    <p className="text-sm text-gray-500">{pathway.nameEn}</p>

                    {/* Progress bar / 진행률 바 */}
                    <div className="mt-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-1000"
                        style={{ width: `${pathway.finalScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Score / 점수 */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-bold text-gray-900">{pathway.finalScore}</div>
                    <p className="text-xs text-gray-500">점수</p>
                  </div>
                </div>

                {/* Summary / 요약 */}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <span>⏱️ {pathway.estimatedMonths}개월</span>
                  <span>•</span>
                  <span>💰 {pathway.estimatedCostWon}만원</span>
                </div>
              </button>
            ))}
          </div>

          {/* Share section / 공유 섹션 */}
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                결과 공유하기
              </h3>
              <p className="text-gray-600">
                친구들에게도 최적의 한국 여정을 찾아주세요
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="bg-yellow-400 hover:bg-yellow-500 border-0 text-gray-900 py-6 rounded-2xl font-bold hover:scale-105 transition-transform"
                onClick={() => handleShare("KakaoTalk")}
              >
                <span className="text-2xl mr-2">💬</span>
                카카오톡
              </Button>
              <Button
                variant="outline"
                className="bg-blue-400 hover:bg-blue-500 border-0 text-white py-6 rounded-2xl font-bold hover:scale-105 transition-transform"
                onClick={() => handleShare("Telegram")}
              >
                <span className="text-2xl mr-2">✈️</span>
                텔레그램
              </Button>
              <Button
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 border-0 text-gray-900 py-6 rounded-2xl font-bold hover:scale-105 transition-transform"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    링크 복사
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Restart link / 다시 진단하기 링크 */}
          <div className="text-center">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 underline"
              onClick={() => router.push("/diagnosis/designs/gamified")}
            >
              다시 진단하기
            </Button>
          </div>
        </div>
      </div>

      {/* CSS animations / CSS 애니메이션 */}
      <style jsx>{`
        @keyframes fade-out {
          0% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            pointer-events: none;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes draw-circle {
          from {
            stroke-dasharray: 0 352;
          }
        }

        .animate-fade-out {
          animation: fade-out 1.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-draw-circle {
          animation: draw-circle 1.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
