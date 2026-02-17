'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { mockDiagnosisResult } from '@/app/diagnosis/designs/_mock/diagnosis-mock-data';

// 비자 진단 대시보드 결과 페이지 / Dashboard-style visa diagnosis result page
export default function DashboardResultPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 실제로는 sessionStorage에서 입력 데이터 가져와서 API 호출
    // In reality, would fetch input from sessionStorage and call API
    const savedInput = sessionStorage.getItem('diagnosisInput');
    if (!savedInput) {
      // 입력 데이터 없으면 입력 페이지로 리다이렉트
      // If no input data, redirect to input page
      router.push('/diagnosis/designs/dashboard');
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  const { pathways, inputSummary } = mockDiagnosisResult;

  // 레이더 차트 데이터 준비 / Prepare radar chart data
  const radarData = [
    {
      subject: '속도\nSpeed',
      ...pathways.reduce((acc, pathway) => {
        acc[pathway.pathwayId] = pathway.scoreBreakdown.speed || 0;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      subject: '안정성\nStability',
      ...pathways.reduce((acc, pathway) => {
        acc[pathway.pathwayId] = pathway.scoreBreakdown.stability || 0;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      subject: '비용효율\nCost Efficiency',
      ...pathways.reduce((acc, pathway) => {
        acc[pathway.pathwayId] = pathway.scoreBreakdown.cost || 0;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      subject: '수입잠재력\nIncome Potential',
      ...pathways.reduce((acc, pathway) => {
        acc[pathway.pathwayId] = pathway.scoreBreakdown.feasibility || 0;
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  // 경로별 색상 / Pathway colors
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 / Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => router.push('/diagnosis/designs/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            다시 진단하기 / Restart
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            비자 경로 분석 결과 / Analysis Result
          </h1>
          <p className="text-gray-600">
            입력하신 정보를 바탕으로 {pathways.length}개의 최적 경로를 찾았습니다.
          </p>
        </div>

        {/* 입력 정보 요약 / Input summary */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">국적 / Nationality</div>
                <div className="font-semibold">{inputSummary.nationality}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">나이 / Age</div>
                <div className="font-semibold">{inputSummary.age}세</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">학력 / Education</div>
                <div className="font-semibold">{inputSummary.education}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">자금 / Fund</div>
                <div className="font-semibold">
                  ₩{(inputSummary.annualFund / 10000).toFixed(0)}만
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">목표 / Goal</div>
                <div className="font-semibold">{inputSummary.goal}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">우선순위 / Priority</div>
                <div className="font-semibold">{inputSummary.priority}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비교 테이블 / Comparison table */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">경로 비교 / Pathway Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32 sticky left-0 bg-white z-10">
                      항목 / Metric
                    </TableHead>
                    {pathways.map((pathway, idx) => (
                      <TableHead key={pathway.pathwayId} className="min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[idx] }}
                          />
                          <span className="font-semibold">{pathway.nameKo}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* 기간 / Duration */}
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-white z-10">
                      기간 / Duration
                    </TableCell>
                    {pathways.map((pathway) => (
                      <TableCell key={pathway.pathwayId}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">
                            {pathway.estimatedMonths}개월
                          </span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* 비용 / Cost */}
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-white z-10">
                      비용 / Cost
                    </TableCell>
                    {pathways.map((pathway) => (
                      <TableCell key={pathway.pathwayId}>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">
                            ₩{(pathway.estimatedCostKRW / 10000).toFixed(0)}만
                          </span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* 점수 / Score */}
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-white z-10">
                      점수 / Score
                    </TableCell>
                    {pathways.map((pathway) => (
                      <TableCell key={pathway.pathwayId}>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-bold text-blue-600">
                            {pathway.finalScore}
                          </span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* 비자 체인 / Visa chain */}
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-white z-10">
                      비자 체인 / Visa Chain
                    </TableCell>
                    {pathways.map((pathway) => (
                      <TableCell key={pathway.pathwayId}>
                        <div className="flex flex-col gap-1">
                          {pathway.visaChain.map((visa, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-gray-100 rounded inline-block"
                            >
                              {typeof visa === 'string' ? visa : visa.code}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* 현실성 / Feasibility */}
                  <TableRow>
                    <TableCell className="font-medium sticky left-0 bg-white z-10">
                      현실성 / Feasibility
                    </TableCell>
                    {pathways.map((pathway) => (
                      <TableCell key={pathway.pathwayId}>
                        <div className="flex items-center gap-2">
                          {pathway.feasibilityLabel.includes('높음') || pathway.feasibilityLabel.includes('High') ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : pathway.feasibilityLabel.includes('중간') || pathway.feasibilityLabel.includes('Medium') ? (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={cn(
                              'font-semibold',
                              (pathway.feasibilityLabel.includes('높음') || pathway.feasibilityLabel.includes('High')) && 'text-green-600',
                              (pathway.feasibilityLabel.includes('중간') || pathway.feasibilityLabel.includes('Medium')) && 'text-yellow-600',
                              (pathway.feasibilityLabel.includes('낮음') || pathway.feasibilityLabel.includes('Low')) && 'text-red-600'
                            )}
                          >
                            {pathway.feasibilityLabel}
                          </span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 레이더 차트 / Radar chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">
              경로별 강점 비교 / Pathway Strengths Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                {pathways.map((pathway, idx) => (
                  <Radar
                    key={pathway.pathwayId}
                    name={pathway.nameKo}
                    dataKey={pathway.pathwayId}
                    stroke={colors[idx]}
                    fill={colors[idx]}
                    fillOpacity={0.3}
                  />
                ))}
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 상세 카드 그리드 / Detailed card grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            경로 상세 정보 / Detailed Pathways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pathways.map((pathway, idx) => (
              <Card
                key={pathway.pathwayId}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: colors[idx] }}
                        />
                        {pathway.nameKo}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{pathway.nameEn}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {pathway.finalScore}
                      </div>
                      <div className="text-xs text-gray-500">점수 / Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 비자 체인 플로우 / Visa chain flow */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">
                      비자 경로 / Visa Chain
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {pathway.visaChain.map((visa, vIdx) => (
                        <React.Fragment key={vIdx}>
                          <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium">
                            {typeof visa === 'string' ? visa : visa.code}
                          </span>
                          {vIdx < pathway.visaChain.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* 핵심 지표 / Key metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        소요 기간 / Duration
                      </div>
                      <div className="text-lg font-semibold">
                        {pathway.estimatedMonths}개월
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        예상 비용 / Cost
                      </div>
                      <div className="text-lg font-semibold">
                        ₩{(pathway.estimatedCostKRW / 10000).toFixed(0)}만
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        현실성 / Feasibility
                      </div>
                      <div className="text-lg font-semibold">
                        {pathway.feasibilityLabel}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        단계 수 / Steps
                      </div>
                      <div className="text-lg font-semibold">
                        {pathway.milestones.length}단계
                      </div>
                    </div>
                  </div>

                  {/* 상세 보기 링크 / Detail link */}
                  <Link
                    href={`/diagnosis/designs/dashboard/result/${pathway.pathwayId}`}
                    className="block"
                  >
                    <Button variant="outline" className="w-full" size="sm">
                      상세 보기 / View Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 하단 액션 / Bottom actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.push('/diagnosis/designs/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            다시 진단하기 / Restart
          </Button>
          <Button size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700">
            전문가 상담 신청 / Contact Expert
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
