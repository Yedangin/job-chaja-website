'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Clock, Wallet, Briefcase, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { pathwayResults } from '../../../_mock/diagnosis-mock-data';

// 여정 상세 페이지 (스크롤 기반) / Journey detail page (scroll-driven)
export default function JourneyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathwayId = params.pathwayId as string;
  const pathway = pathwayResults.find((p) => p.id === pathwayId);

  const [visibleMilestones, setVisibleMilestones] = useState<Set<number>>(new Set());
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
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
      { threshold: 0.3 }
    );

    milestoneRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [pathway]);

  if (!pathway) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">경로를 찾을 수 없습니다</p>
          <Button onClick={() => router.back()}>돌아가기</Button>
        </div>
      </div>
    );
  }

  // 배경 그라디언트 (스크롤에 따라 색상 변화 느낌) / Background gradient (subtle color shift on scroll)
  const backgroundStyle = {
    background: 'linear-gradient(to bottom, #e0f2fe 0%, #bfdbfe 30%, #dbeafe 70%, #f0f9ff 100%)',
  };

  return (
    <div className="min-h-screen py-8 px-4" style={backgroundStyle}>
      <div className="max-w-3xl mx-auto">
        {/* 헤더 / Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            지도로 돌아가기
          </Button>

          <div className="text-center">
            <Badge className="bg-orange-500 text-white mb-3">
              추천 경로
            </Badge>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">{pathway.pathwayName}</h1>
            <p className="text-gray-600">{pathway.description}</p>
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
              <div className="text-3xl font-bold text-orange-500 mb-1">{pathway.totalScore}</div>
              <div className="text-xs text-gray-600">적합도</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">{pathway.totalMonths}</div>
              <div className="text-xs text-gray-600">총 기간 (개월)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-1">{pathway.estimatedCost}</div>
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
            {Object.entries(pathway.scoreBreakdown).map(([key, value]) => {
              const labels: Record<string, string> = {
                feasibility: '실현 가능성',
                speed: '속도',
                cost: '비용 효율',
                stability: '안정성',
              };
              return (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{labels[key]}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="font-semibold text-gray-900 w-8 text-right">{value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 여정 경로 (세로 타임라인) / Journey path (vertical timeline) */}
        <div className="relative">
          {/* 중앙 점선 / Center dotted line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-blue-300" />

          {/* 마일스톤 목록 / Milestones list */}
          <div className="space-y-12">
            {pathway.milestones.map((milestone, idx) => {
              const isVisible = visibleMilestones.has(idx);
              const isLast = idx === pathway.milestones.length - 1;

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
                      {/* 상단: 이름 + 비자 배지 / Top: name + visa badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {milestone.visaType}
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-900">{milestone.nameKo}</h3>
                          <p className="text-sm text-gray-600 mt-1">{milestone.nameEn}</p>
                        </div>
                        <Badge className={milestone.canWork ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                          {milestone.canWork ? '취업 가능' : '취업 불가'}
                        </Badge>
                      </div>

                      {/* 근로 + 소득 정보 / Work + income info */}
                      {milestone.canWorkPartTime && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <Briefcase className="w-4 h-4" />
                            <span className="font-semibold text-sm">
                              💼 일할 수 있어요! 주 {milestone.weeklyHours}시간
                            </span>
                          </div>
                          {milestone.estimatedMonthlyIncome && (
                            <div className="mt-2 text-sm text-gray-700">
                              예상 월 소득: <span className="font-semibold">{milestone.estimatedMonthlyIncome.toLocaleString()}원</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 요구사항 / Requirements */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          필요 조건
                        </h4>
                        <ul className="space-y-1">
                          {milestone.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 기간 + 비용 / Duration + cost */}
                      <div className="flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{milestone.durationMonths}개월</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wallet className="w-4 h-4" />
                          <span>약 {milestone.estimatedCost.toLocaleString()}만원</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* 다음 마일스톤까지 기간 표시 / Duration to next milestone */}
                  {!isLast && (
                    <div className="absolute left-8 top-full transform -translate-x-1/2 mt-4">
                      <div className="bg-white px-3 py-1 rounded-full shadow text-xs font-semibold text-blue-600 border border-blue-200">
                        ↓ {milestone.durationMonths}개월
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 다음 단계 / Next steps */}
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

        {/* CTA 버튼 / CTA button */}
        <div className="mt-8 text-center space-y-4">
          <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500">
            이 여정 시작하기
          </Button>
          <div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              다른 경로 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
