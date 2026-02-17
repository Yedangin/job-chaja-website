'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getPathwayById } from '@/app/diagnosis/designs/_mock/diagnosis-mock-data';

// 비자 진단 대시보드 상세 페이지 / Dashboard-style visa pathway detail page
export default function DashboardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathwayId = params.pathwayId as string;

  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);

  const pathway = getPathwayById(pathwayId);

  useEffect(() => {
    setMounted(true);
    if (!pathway) {
      router.push('/diagnosis/designs/dashboard/result');
    }
  }, [pathway, router]);

  if (!mounted || !pathway) {
    return null;
  }

  // 점수 분해 데이터 / Score breakdown data
  const scoreFactors = [
    {
      name: '기본 점수\nBase',
      value: pathway.scoreBreakdown.base,
      color: '#3b82f6',
    },
    {
      name: '나이 계수\nAge',
      value: pathway.scoreBreakdown.ageMultiplier * 10,
      color: '#10b981',
    },
    {
      name: '국적 계수\nNationality',
      value: pathway.scoreBreakdown.nationalityMultiplier * 10,
      color: '#f59e0b',
    },
    {
      name: '자금 계수\nFund',
      value: pathway.scoreBreakdown.fundMultiplier * 10,
      color: '#ef4444',
    },
    {
      name: '학력 계수\nEducation',
      value: pathway.scoreBreakdown.educationMultiplier * 10,
      color: '#8b5cf6',
    },
    {
      name: '우선순위\nPriority',
      value: pathway.scoreBreakdown.priorityWeight,
      color: '#ec4899',
    },
  ];

  // 비용 분해 데이터 / Cost breakdown data
  const costBreakdown = [
    { name: '신청비', value: 500000, color: '#3b82f6' },
    { name: '행정비', value: 1500000, color: '#10b981' },
    { name: '서류 준비', value: 800000, color: '#f59e0b' },
    { name: '번역/공증', value: 600000, color: '#ef4444' },
    { name: '기타', value: 100000, color: '#8b5cf6' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 / Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => router.push('/diagnosis/designs/dashboard/result')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            결과로 돌아가기 / Back to Results
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {pathway.nameKo}
              </h1>
              <p className="text-gray-600">{pathway.nameEn}</p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-5xl font-bold text-blue-600 mb-1">
                {pathway.finalScore}
              </div>
              <div className="text-sm text-gray-500">종합 점수 / Total Score</div>
            </div>
          </div>

          {/* 핵심 지표 카드 / Key metrics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      소요 기간 / Duration
                    </div>
                    <div className="text-2xl font-bold">
                      {pathway.estimatedMonths}개월
                    </div>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      예상 비용 / Cost
                    </div>
                    <div className="text-2xl font-bold">
                      ₩{(pathway.estimatedCostWon / 10000).toFixed(0)}만
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      현실성 / Feasibility
                    </div>
                    <div className="text-2xl font-bold">
                      {pathway.feasibilityLabel}
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 2컬럼 레이아웃 (데스크톱) / 2-column layout (desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 왼쪽: 타임라인 / Left: Timeline */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  진행 단계 타임라인 / Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 데스크톱: 수직 타임라인 / Desktop: Vertical timeline */}
                <div className="relative">
                  {pathway.milestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className="relative"
                      onClick={() =>
                        setExpandedMilestone(
                          expandedMilestone === idx ? null : idx
                        )
                      }
                    >
                      {/* 연결선 / Connecting line */}
                      {idx < pathway.milestones.length - 1 && (
                        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-blue-200" />
                      )}

                      {/* 마일스톤 노드 / Milestone node */}
                      <div className="relative flex items-start gap-4 pb-6 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -ml-2 transition-colors">
                        {/* 노드 아이콘 / Node icon */}
                        <div
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white z-10 flex-shrink-0',
                            expandedMilestone === idx
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-blue-300'
                          )}
                        >
                          {expandedMilestone === idx ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-xs font-bold text-blue-600">
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        {/* 마일스톤 내용 / Milestone content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {milestone.nameKo}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {milestone.monthFromStart}개월차
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            비자 상태: {milestone.visaStatus}
                          </p>

                          {/* 확장 내용 / Expanded content */}
                          {expandedMilestone === idx && (
                            <div className="mt-3 pt-3 border-t space-y-3 animate-in slide-in-from-top-2">
                              {/* 요구사항 / Requirements */}
                              <div>
                                <div className="text-xs font-semibold text-gray-700 mb-2">
                                  요구사항 / Requirements
                                </div>
                                <div className="text-sm text-gray-600">
                                  {milestone.requirements}
                                </div>
                              </div>

                              {/* 근무 정보 / Work information */}
                              {milestone.canWorkPartTime && (
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span className="font-semibold">
                                    아르바이트 가능: 주 {milestone.weeklyHours}시간
                                  </span>
                                </div>
                              )}

                              {/* 예상 수입 / Estimated income */}
                              {milestone.estimatedMonthlyIncome > 0 && (
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                  <span className="font-semibold">
                                    예상 월수입: ₩
                                    {(milestone.estimatedMonthlyIncome / 10000).toFixed(0)}만
                                  </span>
                                </div>
                              )}

                              {/* 플랫폼 액션 / Platform action */}
                              {milestone.platformAction && (
                                <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-blue-800">
                                    {milestone.platformAction}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 점수 분해 / Right: Score breakdown */}
          <div className="space-y-6">
            {/* 점수 계산 분해 / Score calculation breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  점수 산출 근거 / Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 공식 시각화 / Formula visualization */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-2">
                    최종 점수 계산 공식 / Final Score Formula
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-mono bg-white px-2 py-1 rounded border">
                      {pathway.scoreBreakdown.base}
                    </span>
                    <span className="text-gray-400">×</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border">
                      {pathway.scoreBreakdown.ageMultiplier}
                    </span>
                    <span className="text-gray-400">×</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border">
                      {pathway.scoreBreakdown.nationalityMultiplier}
                    </span>
                    <span className="text-gray-400">×</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border">
                      {pathway.scoreBreakdown.fundMultiplier}
                    </span>
                    <span className="text-gray-400">×</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border">
                      {pathway.scoreBreakdown.educationMultiplier}
                    </span>
                    <span className="text-gray-400">+</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border">
                      {pathway.scoreBreakdown.priorityWeight}
                    </span>
                    <span className="text-gray-400">=</span>
                    <span className="font-mono bg-blue-600 text-white px-3 py-1 rounded border-2 border-blue-700 font-bold">
                      {pathway.finalScore}
                    </span>
                  </div>
                </div>

                {/* 막대 차트 / Bar chart */}
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={scoreFactors} layout="horizontal">
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {scoreFactors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* 각 요소 설명 / Factor descriptions */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">기본 점수 / Base Score</span>
                    <span className="font-semibold">
                      {pathway.scoreBreakdown.base}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">나이 배수 / Age Multiplier</span>
                    <span className="font-semibold">
                      {pathway.scoreBreakdown.ageMultiplier}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">국적 배수 / Nationality Multiplier</span>
                    <span className="font-semibold">
                      {pathway.scoreBreakdown.nationalityMultiplier}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">자금 배수 / Fund Multiplier</span>
                    <span className="font-semibold">
                      {pathway.scoreBreakdown.fundMultiplier}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">학력 배수 / Education Multiplier</span>
                    <span className="font-semibold">
                      {pathway.scoreBreakdown.educationMultiplier}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">우선순위 가중치 / Priority Weight</span>
                    <span className="font-semibold">
                      {pathway.scoreBreakdown.priorityWeight}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 비용 분해 / Cost breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  예상 비용 분석 / Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {costBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-semibold">
                        ₩{(item.value / 10000).toFixed(0)}만
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-semibold">총 예상 비용 / Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₩{(pathway.estimatedCostWon / 10000).toFixed(0)}만
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 다음 단계 / Next steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">다음 단계 / Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm">
                    1
                  </span>
                  서류 준비
                </h3>
                <p className="text-sm text-gray-600">
                  필요한 서류를 미리 확인하고 준비하세요.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm">
                    2
                  </span>
                  전문가 상담
                </h3>
                <p className="text-sm text-gray-600">
                  비자 전문가와 상담하여 세부 계획을 수립하세요.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-600 text-white text-sm">
                    3
                  </span>
                  신청 진행
                </h3>
                <p className="text-sm text-gray-600">
                  준비가 완료되면 첫 단계를 시작하세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 액션 / Bottom actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.push('/diagnosis/designs/dashboard/result')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            다른 경로 보기 / View Other Pathways
          </Button>
          <Button size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700">
            이 경로 시작하기 / Start This Pathway
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
