"use client";

import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Clock, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDiagnosisResult, mockPathwayDetail } from "../../../_mock/diagnosis-mock-data";

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

// Get milestone emoji / 마일스톤 이모지
const getMilestoneEmoji = (milestone: string) => {
  if (milestone.includes("한국어") || milestone.includes("Korean")) return "🇰🇷";
  if (milestone.includes("대학") || milestone.includes("University")) return "🎓";
  if (milestone.includes("취업") || milestone.includes("Job")) return "💼";
  if (milestone.includes("영주") || milestone.includes("Permanent")) return "🏡";
  if (milestone.includes("시민") || milestone.includes("Citizenship")) return "🎖️";
  return "📍";
};

// Get visa status badge style / 비자 상태 배지 스타일
const getVisaStatusStyle = (status: string) => {
  if (status === "ACTIVE") return "bg-green-100 text-green-700 border-green-300";
  if (status === "EXPIRED") return "bg-red-100 text-red-700 border-red-300";
  if (status === "PENDING") return "bg-yellow-100 text-yellow-700 border-yellow-300";
  return "bg-gray-100 text-gray-700 border-gray-300";
};

export default function GamifiedDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathwayId = params.pathwayId as string;

  // Find pathway / 경로 찾기
  const pathway = mockDiagnosisResult.pathways.find((p) => p.pathwayId === pathwayId);

  // Helper to get pathway type from visaChain / 비자체인에서 경로 타입 추출
  const getPathwayTypeFromVisa = (visaChain: string): string => {
    if (visaChain.includes("D-2") || visaChain.includes("D-4")) return "student";
    if (visaChain.includes("E-7") || visaChain.includes("E-9")) return "worker";
    if (visaChain.includes("F-2")) return "family";
    return "worker";
  };

  if (!pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl text-gray-600 mb-4">경로를 찾을 수 없습니다</p>
          <Button onClick={() => router.push("/diagnosis/designs/gamified/result")}>
            결과로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header / 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/diagnosis/designs/gamified/result")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">결과로 돌아가기</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title section / 제목 섹션 */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-8xl mb-6">{getPathwayEmoji(getPathwayTypeFromVisa(pathway.visaChain))}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {pathway.nameKo}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{pathway.nameEn}</p>

          {/* Quick stats / 빠른 통계 */}
          <div className="flex items-center justify-center gap-6 text-lg">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span>{pathway.estimatedMonths}개월</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign className="w-5 h-5" />
              <span>{pathway.estimatedCostWon}만원</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl font-bold text-blue-600">{pathway.finalScore}</span>
              <span>점수</span>
            </div>
          </div>
        </div>

        {/* Journey timeline - chapters / 여정 타임라인 - 챕터 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            📖 당신의 여정 스토리
          </h2>

          <div className="space-y-6">
            {mockPathwayDetail.milestones.map((milestone, idx) => (
              <div key={idx} className="relative animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                {/* Chapter card / 챕터 카드 */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100">
                  {/* Chapter header / 챕터 헤더 */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-5xl flex-shrink-0">
                      {getMilestoneEmoji(milestone.nameKo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                          Chapter {idx + 1}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getVisaStatusStyle(
                            milestone.visaStatus
                          )}`}
                        >
                          {milestone.visaStatus}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {milestone.nameKo}
                      </h3>
                      <p className="text-gray-600">{milestone.nameEn}</p>
                    </div>
                  </div>

                  {/* Part-time work highlight / 아르바이트 가능 강조 */}
                  {milestone.canWorkPartTime && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">💰</div>
                        <div>
                          <h4 className="font-bold text-green-900 text-lg mb-2">
                            아르바이트 가능!
                          </h4>
                          <p className="text-green-700 mb-2">
                            주 {milestone.maxWorkHoursPerWeek}시간까지 근무 가능
                          </p>
                          <p className="text-sm text-green-600">
                            예상 월 수입: 약 {milestone.estimatedMonthlyIncome}만원
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Requirements / 요구사항 */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                      준비할 것
                    </h4>
                    {Array.isArray(milestone.requirements) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {milestone.requirements.map((req, i) => (
                          <li key={i} className="text-gray-700">{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {milestone.requirements}
                      </p>
                    )}
                  </div>

                  {/* Timeline / 소요 시간 */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>예상 소요 시간: {milestone.durationMonths}개월</span>
                  </div>
                </div>

                {/* Connector to next chapter / 다음 챕터 연결선 */}
                {idx < mockPathwayDetail.milestones.length - 1 && (
                  <div className="flex flex-col items-center py-6">
                    <div className="w-1 h-12 bg-gradient-to-b from-blue-300 to-purple-300 rounded-full animate-pulse" />
                    <div className="bg-white border-2 border-blue-300 px-4 py-2 rounded-full text-sm font-medium text-blue-600 shadow-md">
                      ↓ {mockPathwayDetail.milestones[idx + 1].durationMonths}개월 후
                    </div>
                    <div className="w-1 h-12 bg-gradient-to-b from-purple-300 to-pink-300 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            ))}

            {/* Final achievement card / 최종 목표 달성 카드 */}
            <div className="relative animate-slide-up" style={{ animationDelay: `${mockPathwayDetail.milestones.length * 100}ms` }}>
              <div className="bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-3xl p-12 shadow-2xl border-4 border-yellow-300 text-center">
                <div className="text-8xl mb-6 animate-bounce-slow">🎯</div>
                <h3 className="text-4xl font-bold text-gray-900 mb-3">
                  목표 달성!
                </h3>
                <p className="text-xl text-gray-700 mb-6">
                  축하합니다! 한국에서의 새로운 삶이 시작됩니다.
                </p>
                <div className="inline-block bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  총 {pathway.estimatedMonths}개월 소요
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score breakdown / 점수 분석 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📊 매칭 점수 분석
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(mockPathwayDetail.scoreBreakdown).map(([key, value]) => {
              const labels: Record<string, { ko: string; emoji: string }> = {
                speed: { ko: "빠른 시간", emoji: "⚡" },
                cost: { ko: "적은 비용", emoji: "💰" },
                stability: { ko: "안정성", emoji: "🛡️" },
                flexibility: { ko: "유연성", emoji: "🔄" },
              };

              return (
                <div
                  key={key}
                  className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-3">{labels[key].emoji}</div>
                  <p className="text-sm text-gray-600 mb-2">{labels[key].ko}</p>
                  <div className="text-3xl font-bold text-blue-600">{value}</div>
                  <div className="mt-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-1000"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next steps / 다음 단계 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 지금 시작하기
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {mockPathwayDetail.nextSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer border-2 border-transparent hover:border-blue-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-12 h-12 rounded-full flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">{step.nameKo}</h4>
                    <p className="text-sm text-gray-600 mb-3">{step.nameEn}</p>
                    <p className="text-sm text-gray-700">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA / 하단 액션 버튼 */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xl px-12 py-8 rounded-full hover:scale-105 transition-transform shadow-2xl font-bold"
            onClick={() => alert("여정 시작 기능은 추후 구현 예정입니다!")}
          >
            이 경로 시작하기 🚀
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            전문가 상담을 통해 구체적인 계획을 수립하세요
          </p>
        </div>
      </div>

      {/* CSS animations / CSS 애니메이션 */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
