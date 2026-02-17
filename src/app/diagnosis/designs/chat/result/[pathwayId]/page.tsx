'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { getPathwayById, getScoreColor } from '../../../_mock/diagnosis-mock-data';

interface PageProps {
  params: Promise<{ pathwayId: string }>;
}

export default function ChatDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const pathway = getPathwayById(resolvedParams.pathwayId);

  if (!pathway) {
    return (
      <div className="min-h-screen bg-linear-to-b from-sky-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">경로를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">요청하신 경로가 존재하지 않습니다.</p>
          <button
            onClick={() => router.push('/diagnosis/designs/chat/result')}
            className="px-6 py-3 bg-sky-500 text-white font-medium rounded-xl hover:bg-sky-600 transition-colors"
          >
            결과로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const visaChain = pathway.visaChain.split(' → ');
  const scoreColor = getScoreColor(pathway.finalScore);

  // Get milestone icon / 마일스톤 아이콘 가져오기
  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'entry':
        return '✈️';
      case 'part_time_unlock':
        return '💰';
      case 'study_upgrade':
        return '🎓';
      case 'graduation':
        return '🎓';
      case 'final_goal':
        return '🎯';
      case 'waiting':
        return '⏳';
      case 'application':
        return '📋';
      case 'expiry':
        return '⚠️';
      default:
        return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 to-white">
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Back button / 뒤로가기 버튼 */}
        <button
          onClick={() => router.push('/diagnosis/designs/chat/result')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 py-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>결과로 돌아가기</span>
        </button>

        {/* Header / 헤더 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{pathway.nameKo}</h1>
          <p className="text-sm text-gray-500 mb-4">{pathway.nameEn}</p>

          {/* Visa chain / 비자 체인 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {visaChain.map((visa, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm font-medium rounded-lg">
                  {visa.trim()}
                </span>
                {idx < visaChain.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400" />}
              </div>
            ))}
          </div>

          {/* Score and summary / 점수 및 요약 */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: scoreColor }}>
                {pathway.finalScore}
              </div>
              <div className="text-xs text-gray-500">추천 점수</div>
            </div>
            <div className="flex-1 text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <span>⏱️ {pathway.estimatedMonths}개월</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💰 {pathway.estimatedCostWon}만원</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline / 타임라인 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">경로 상세</h2>

          <div className="relative">
            {/* Timeline line / 타임라인 선 */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-6">
              {pathway.milestones.map((milestone, index) => (
                <div key={index} className="relative pl-16">
                  {/* Timeline dot / 타임라인 점 */}
                  <div className="absolute left-4 top-2 w-5 h-5 bg-white border-2 border-sky-500 rounded-full flex items-center justify-center text-xs z-10">
                    {getMilestoneIcon(milestone.type)}
                  </div>

                  {/* Milestone card / 마일스톤 카드 */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative">
                    {/* Speech bubble tail / 말풍선 꼬리 */}
                    <div className="absolute left-0 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white transform -translate-x-2" />

                    <h3 className="font-semibold text-gray-900 mb-2">{milestone.nameKo}</h3>

                    {/* Visa status badge / 비자 상태 배지 */}
                    <div className="inline-block px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded mb-3">
                      {milestone.visaStatus}
                    </div>

                    {/* Work info / 근무 정보 */}
                    {milestone.canWorkPartTime && (
                      <div className="text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <span>💼</span>
                          <span>
                            주 {milestone.weeklyHours}시간 근무 가능
                            {milestone.estimatedMonthlyIncome && (
                              <> • 월 {milestone.estimatedMonthlyIncome}만원 예상</>
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Requirements / 요건 */}
                    {milestone.requirements && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {milestone.requirements.split(/[,+]/).map((s) => s.trim()).filter(Boolean).map((req, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-sky-500">•</span>
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Duration to next / 다음까지 기간 */}
                  {index < pathway.milestones.length - 1 && (
                    <div className="flex items-center gap-2 mt-3 ml-2 text-sm text-gray-500">
                      <div className="w-px h-6 border-l-2 border-dashed border-gray-300" />
                      <span>
                        {pathway.milestones[index + 1].monthFromStart - milestone.monthFromStart}개월 후
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score breakdown / 점수 분석 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">점수 분석</h2>
          <div className="space-y-3">
            {[
              { label: '기본 점수', value: pathway.scoreBreakdown.base / 100, color: 'bg-green-500' },
              { label: '나이 가중치', value: pathway.scoreBreakdown.ageMultiplier, color: 'bg-blue-500' },
              { label: '국적 가중치', value: pathway.scoreBreakdown.nationalityMultiplier, color: 'bg-yellow-500' },
              { label: '자금 가중치', value: pathway.scoreBreakdown.fundMultiplier, color: 'bg-purple-500' },
              { label: '학력 가중치', value: pathway.scoreBreakdown.educationMultiplier, color: 'bg-pink-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold">{item.value.toFixed(1)}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${(item.value / 2) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps / 다음 단계 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">다음 단계</h2>
          <div className="space-y-3">
            {pathway.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-sky-50 rounded-lg">
                <div className="text-2xl">{index === 0 ? '📝' : index === 1 ? '📚' : '🤝'}</div>
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-gray-900 mb-1">{step.nameKo}</div>
                  <div className="text-gray-700">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA button / 행동 유도 버튼 */}
        <button className="w-full py-4 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors shadow-lg">
          이 경로 시작하기
        </button>
      </div>
    </div>
  );
}
