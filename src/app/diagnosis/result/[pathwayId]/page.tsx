'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Clock, Wallet, Briefcase, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { DiagnosisResult, RecommendedPathway, Milestone } from '../../designs/_mock/diagnosis-mock-data';
import { getScoreColor } from '../../designs/_mock/diagnosis-mock-data';

// 여정 상세 페이지 / Journey detail page (scroll-driven timeline)
export default function DiagnosisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathwayId = params.pathwayId as string;

  const [pathway, setPathway] = useState<RecommendedPathway | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleMilestones, setVisibleMilestones] = useState<Set<number>>(new Set());
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // sessionStorage에서 진단 결과 로드 / Load diagnosis result from sessionStorage
    const resultStr = sessionStorage.getItem('diagnosis-result');
    if (resultStr) {
      try {
        const result: DiagnosisResult = JSON.parse(resultStr);
        const found = result.pathways.find((p) => p.pathwayId === pathwayId);
        if (found) {
          setPathway(found);
        }
      } catch {
        // 파싱 실패 / Parse failed
      }
    }
    setLoading(false);
  }, [pathwayId]);

  useEffect(() => {
    if (!pathway) return;

    // Intersection Observer로 마일스톤 표시 / Show milestones with Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleMilestones((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.3 },
    );

    milestoneRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [pathway]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">경로 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">&#x274C;</div>
          <p className="text-gray-600 mb-4">경로를 찾을 수 없습니다</p>
          <Button onClick={() => router.push('/diagnosis/result')}>결과로 돌아가기</Button>
        </div>
      </div>
    );
  }

  const scoreColor = getScoreColor(pathway.finalScore);

  // 마일스톤 요구사항 분리 / Split milestone requirements
  const splitRequirements = (req: string): string[] => {
    return req
      .split(/[,+]/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: 'linear-gradient(to bottom, #e0f2fe 0%, #bfdbfe 30%, #dbeafe 70%, #f0f9ff 100%)',
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* 헤더 / Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push('/diagnosis/result')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            지도로 돌아가기
          </Button>

          <div className="text-center">
            <Badge className="bg-orange-500 text-white mb-3">추천 경로</Badge>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">{pathway.nameKo}</h1>
            <p className="text-gray-600">{pathway.nameEn}</p>
          </div>
        </div>

        {/* 여정 통계 / Journey stats */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            여정 통계
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: scoreColor }}>
                {pathway.finalScore}
              </div>
              <div className="text-xs text-gray-600">적합도</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">{pathway.estimatedMonths}</div>
              <div className="text-xs text-gray-600">총 기간 (개월)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-1">
                {pathway.estimatedCostWon.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">예상 비용 (만원)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">{pathway.milestones.length}</div>
              <div className="text-xs text-gray-600">정류장 수</div>
            </div>
          </div>

          {/* 점수 세부 / Score breakdown */}
          <div className="mt-6 pt-6 border-t space-y-2">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">점수 세부사항</h3>
            {[
              { key: 'base', label: '기본 점수', value: pathway.scoreBreakdown.base, max: 100 },
              { key: 'ageMultiplier', label: '나이 가중치', value: pathway.scoreBreakdown.ageMultiplier, max: 1 },
              { key: 'nationalityMultiplier', label: '국적 가중치', value: pathway.scoreBreakdown.nationalityMultiplier, max: 1 },
              { key: 'fundMultiplier', label: '자금 가중치', value: pathway.scoreBreakdown.fundMultiplier, max: 1 },
              { key: 'educationMultiplier', label: '학력 가중치', value: pathway.scoreBreakdown.educationMultiplier, max: 1 },
              { key: 'priorityWeight', label: '우선순위 가중치', value: pathway.scoreBreakdown.priorityWeight, max: 1 },
            ].map((item) => (
              <div key={item.key} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-10 text-right">
                    {item.max === 1 ? item.value.toFixed(2) : item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 비자 체인 요약 / Visa chain summary */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur shadow-xl">
          <h2 className="text-lg font-semibold mb-4">비자 경로</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {pathway.visaChain.split(' \u2192 ').map((visa, idx, arr) => (
              <div key={idx} className="flex items-center gap-2">
                <Badge variant="outline" className="text-base px-4 py-2">
                  {visa.trim()}
                </Badge>
                {idx < arr.length - 1 && <span className="text-gray-400 text-xl">\u2192</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* 여정 경로 (세로 타임라인) / Journey path (vertical timeline) */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-blue-300" />

          <div className="space-y-12">
            {pathway.milestones.map((milestone, idx) => {
              const isVisible = visibleMilestones.has(idx);
              const isLast = idx === pathway.milestones.length - 1;
              const requirements = splitRequirements(milestone.requirements);
              const nextMilestone = pathway.milestones[idx + 1];
              const duration = nextMilestone
                ? nextMilestone.monthFromStart - milestone.monthFromStart
                : 0;

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    milestoneRefs.current[idx] = el;
                  }}
                  data-index={idx}
                  className={`relative transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  {/* 핀 아이콘 / Pin icon */}
                  <div className="absolute left-8 transform -translate-x-1/2 z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${
                        isLast ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                    >
                      {isLast ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <MapPin className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>

                  {/* 마일스톤 카드 / Milestone card */}
                  <div className="ml-20">
                    <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {milestone.visaStatus || '준비중'}
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-900">{milestone.nameKo}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            시작 후 {milestone.monthFromStart}개월
                          </p>
                        </div>
                        <Badge
                          className={
                            milestone.canWorkPartTime
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }
                        >
                          {milestone.canWorkPartTime ? '취업 가능' : '취업 불가'}
                        </Badge>
                      </div>

                      {/* 근로 정보 / Work info */}
                      {milestone.canWorkPartTime && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <Briefcase className="w-4 h-4" />
                            <span className="font-semibold text-sm">
                              {milestone.weeklyHours > 0
                                ? `주 ${milestone.weeklyHours}시간 근무 가능`
                                : '정규직 근무 가능'}
                            </span>
                          </div>
                          {milestone.estimatedMonthlyIncome > 0 && (
                            <div className="mt-2 text-sm text-gray-700">
                              예상 월 소득:{' '}
                              <span className="font-semibold">
                                {milestone.estimatedMonthlyIncome.toLocaleString()}만원
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 요구사항 / Requirements */}
                      {requirements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            필요 조건
                          </h4>
                          <ul className="space-y-1">
                            {requirements.map((req, rIdx) => (
                              <li key={rIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">&bull;</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 기간 / Duration */}
                      <div className="flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{milestone.monthFromStart}개월째</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* 다음 마일스톤까지 기간 / Duration to next */}
                  {!isLast && duration > 0 && (
                    <div className="absolute left-8 top-full transform -translate-x-1/2 mt-4">
                      <div className="bg-white px-3 py-1 rounded-full shadow text-xs font-semibold text-blue-600 border border-blue-200">
                        &darr; {duration}개월
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 다음 단계 / Next steps */}
        {pathway.nextSteps.length > 0 && (
          <Card className="p-6 mt-12 bg-white/90 backdrop-blur shadow-xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              다음 정류장
            </h2>
            <div className="space-y-3">
              {pathway.nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{step.nameKo}</p>
                    <p className="text-sm text-gray-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* CTA / Action buttons */}
        <div className="mt-8 text-center space-y-4">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500"
          >
            이 여정 시작하기
          </Button>
          <div>
            <Button variant="outline" onClick={() => router.push('/diagnosis/result')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              다른 경로 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
