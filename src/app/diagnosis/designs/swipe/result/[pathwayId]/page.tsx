'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Drawer } from 'vaul';
import {
  ChevronLeft,
  Clock,
  Coins,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  GraduationCap,
  Briefcase,
  Home,
  Target,
} from 'lucide-react';
import { mockPathways } from '../../../_mock/diagnosis-mock-data';

// 마일스톤 타입별 아이콘 / Icon by milestone type
const milestoneIcons: Record<string, any> = {
  DOCUMENT: FileText,
  EDUCATION: GraduationCap,
  WORK: Briefcase,
  RESIDENCE: Home,
  GOAL: Target,
};

// 실현 가능성 색상 / Feasibility colors
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

export default function SwipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathwayId = params.pathwayId as string;

  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

  // 경로 데이터 찾기 / Find pathway data
  const pathway = mockPathways.find((p) => p.id === pathwayId);

  if (!pathway) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">경로를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push('/diagnosis/designs/swipe/result')}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 마일스톤 토글 / Toggle milestone expansion
  const toggleMilestone = (index: number) => {
    setExpandedMilestone(expandedMilestone === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* 모바일 프레임 컨테이너 / Mobile frame container */}
      <div className="w-full max-w-sm bg-gray-100 rounded-3xl shadow-2xl overflow-hidden relative" style={{ height: '844px' }}>
        {/* 배경: 결과 카드 요약 (위쪽에 살짝 보임) / Background: Result card summary (peek at top) */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${feasibilityColors[pathway.feasibility]}`}>
              실현가능성 {feasibilityLabels[pathway.feasibility]}
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {pathway.nameKo}
            </h1>
            <p className="text-sm text-gray-600">{pathway.nameEn}</p>
          </div>
        </div>

        {/* Drawer (Bottom Sheet) */}
        <Drawer.Root open={true} dismissible={false}>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto rounded-t-3xl bg-white shadow-2xl outline-none" style={{ height: '90%', maxHeight: '756px' }}>
              {/* Drawer 핸들 / Drawer handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Drawer 내용 / Drawer content */}
              <div className="h-full overflow-y-auto px-6 pb-24">
                {/* 비자 체인 / Visa chain */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">비자 경로</h3>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {pathway.visaChain.map((visa, idx) => (
                      <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                          <div className="font-bold text-blue-900 text-sm">{visa.code}</div>
                          <div className="text-xs text-blue-600">{visa.name}</div>
                        </div>
                        {idx < pathway.visaChain.length - 1 && (
                          <div className="text-gray-400">→</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 타임라인 / Timeline */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-4">단계별 일정</h3>
                  <div className="space-y-3">
                    {pathway.milestones.map((milestone, idx) => {
                      const Icon = milestoneIcons[milestone.type] || Target;
                      const isExpanded = expandedMilestone === idx;

                      return (
                        <div key={idx} className="relative">
                          {/* 타임라인 연결선 / Timeline connector */}
                          {idx < pathway.milestones.length - 1 && (
                            <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                          )}

                          {/* 마일스톤 카드 / Milestone card */}
                          <button
                            onClick={() => toggleMilestone(idx)}
                            className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900 truncate">
                                    {milestone.nameKo}
                                  </h4>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mb-2">{milestone.nameEn}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {milestone.durationMonths}개월
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Coins className="w-3 h-3" />
                                    {(milestone.estimatedCost / 10000).toFixed(0)}만원
                                  </span>
                                </div>

                                {/* 확장된 상세 정보 / Expanded details */}
                                {isExpanded && (
                                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                    {milestone.requirements.length > 0 && (
                                      <div>
                                        <div className="text-xs font-semibold text-gray-700 mb-2">
                                          필요 조건
                                        </div>
                                        <ul className="space-y-1">
                                          {milestone.requirements.map((req, reqIdx) => (
                                            <li
                                              key={reqIdx}
                                              className="text-xs text-gray-600 flex items-start gap-2"
                                            >
                                              <span className="text-blue-500 mt-0.5">•</span>
                                              <span>{req}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 평가 점수 / Score section */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-4">종합 평가</h3>
                  <div className="space-y-3">
                    {Object.entries(pathway.scoreBreakdown).map(([key, value]) => {
                      const labels: Record<string, string> = {
                        timeScore: '소요 시간',
                        costScore: '비용',
                        feasibilityScore: '실현 가능성',
                        stabilityScore: '안정성',
                      };
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{labels[key]}</span>
                            <span className="font-semibold text-gray-900">{value}점</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 다음 단계 / Next steps */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">시작하기</h3>
                  <div className="space-y-2">
                    {pathway.nextSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-xl"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{step.nameKo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 하단 고정 CTA / Bottom fixed CTA */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
                <button
                  onClick={() => {
                    // TODO: 실제 시작 액션
                    alert('이 경로를 시작합니다!');
                  }}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow-lg transition-colors"
                >
                  이 경로 시작하기
                </button>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  );
}
