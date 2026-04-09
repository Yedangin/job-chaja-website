'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Trophy,
  Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { DiagnosisResult } from '../designs/_mock/diagnosis-mock-data';
import { getFeasibilityEmoji, getScoreColor } from '../designs/_mock/diagnosis-mock-data';

type LoadingPhase = 'analyzing' | 'results';

export default function DiagnosisResultPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<LoadingPhase>('analyzing');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiDoneRef = useRef(false);
  const minAnimationDoneRef = useRef(false);

  useEffect(() => {
    const inputStr = sessionStorage.getItem('diagnosis-input');
    if (!inputStr) {
      router.replace('/visa-planner');
      return;
    }

    const input = JSON.parse(inputStr);

    let count = 0;
    const targetCount = 15;
    const interval = setInterval(() => {
      count += 1;
      setAnalysisCount(count);
      if (count >= targetCount) {
        clearInterval(interval);
        minAnimationDoneRef.current = true;
        if (apiDoneRef.current) setPhase('results');
      }
    }, 120);

    const callApi = async () => {
      try {
        const response = await fetch('/api/diagnosis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `서버 오류 (${response.status})`);
        }

        const data: DiagnosisResult = await response.json();
        setResult(data);
        sessionStorage.setItem('diagnosis-result', JSON.stringify(data));
        apiDoneRef.current = true;
        if (minAnimationDoneRef.current) setPhase('results');
      } catch (err) {
        setError(err instanceof Error ? err.message : '진단 서버에 연결할 수 없습니다');
        apiDoneRef.current = true;
        minAnimationDoneRef.current = true;
        setPhase('results');
      }
    };

    callApi();

    return () => clearInterval(interval);
  }, [router]);

  if (phase === 'analyzing') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-600 via-sky-500 to-emerald-500 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-full h-full animate-spin" style={{ animationDuration: '3s' }}>
              <circle cx="64" cy="64" r="56" stroke="white" strokeOpacity="0.2" strokeWidth="6" fill="none" />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="white"
                strokeWidth="6"
                fill="none"
                strokeDasharray="88 264"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{analysisCount}</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-2">{analysisCount}개 경로 분석 중...</p>
          <p className="text-cyan-50">무료 비자 플래너 결과를 정리하고 있어요</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto p-8 text-center">
          <div className="text-6xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">진단 실패</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setError(null);
                setPhase('analyzing');
                setAnalysisCount(0);
                apiDoneRef.current = false;
                minAnimationDoneRef.current = false;
                window.location.reload();
              }}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              다시 시도
            </Button>
            <Button variant="outline" onClick={() => router.push('/visa-planner')} className="w-full">
              처음부터 다시하기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!result || result.pathways.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-xl mx-auto p-8 text-center">
          <div className="text-6xl mb-4">?</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">추천 가능한 경로가 없습니다</h2>
          <p className="text-gray-600 mb-6">
            현재 입력 기준으로는 추천 경로를 찾지 못했습니다. 조건을 바꿔 다시 시도하거나
            채용공고를 먼저 둘러보실 수 있습니다.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={() => router.push('/visa-planner')} className="bg-cyan-600 hover:bg-cyan-700">
              다시 진단하기
            </Button>
            <Button asChild variant="outline">
              <Link href="/alba">채용공고 보기</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const pathways = result.pathways;
  const topPathway = pathways[0];
  const profileHeadline =
    topPathway.finalScore >= 70
      ? '지금 프로필을 완성하면 기업이 바로 검토할 수 있는 수준입니다.'
      : topPathway.finalScore >= 40
        ? '기본 가능성은 확인됐습니다. 프로필을 자세히 채우면 스카우트 제안 확률을 더 높일 수 있습니다.'
        : '비자 적합도는 더 보완이 필요하지만, 프로필을 등록해 경력 기반 제안을 먼저 받아볼 수 있습니다.';

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">비자 플래너 결과</h1>
          <p className="text-gray-600">
            {result.meta.totalPathwaysEvaluated}개 경로 중 {pathways.length}개의 추천 경로를 찾았습니다
          </p>
        </div>

        <Card className="p-6 mb-8 border-cyan-200 bg-white shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-700 mb-1">다음 목표</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">인재채용관에 노출될 프로필 완성</h2>
              <p className="text-gray-600">{profileHeadline}</p>
            </div>
            <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
              <Link href={`/visa-planner/profile?sessionId=${result.sessionId ?? ''}`}>
                상세 프로필 등록
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          {pathways.map((pathway, idx) => {
            const visaChain = pathway.visaChain.split(/\s*(?:->|→)\s*/).map((s) => s.trim()).filter(Boolean);
            const scoreColor = getScoreColor(pathway.finalScore);

            return (
              <Card key={pathway.pathwayId} className="p-6 bg-white shadow-sm border-gray-200">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge className="bg-cyan-600 text-white">Top {idx + 1}</Badge>
                      {idx === 0 && <Badge className="bg-amber-100 text-amber-700">가장 추천</Badge>}
                      <Badge variant="outline">
                        {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">{pathway.nameKo}</h3>
                    <p className="text-sm text-gray-500 mb-4">{pathway.nameEn}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {visaChain.map((visa, visaIdx) => (
                        <div key={`${pathway.pathwayId}-${visaIdx}`} className="flex items-center gap-2">
                          <Badge variant="outline">{visa}</Badge>
                          {visaIdx < visaChain.length - 1 && <ArrowRight className="w-3 h-3 text-gray-400" />}
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-gray-700 mb-4">{pathway.note}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        총 {pathway.estimatedMonths}개월 예상
                      </div>
                      <div className="flex items-center gap-1">
                        <Wallet className="w-4 h-4" />
                        약 {pathway.estimatedCostWon.toLocaleString()}만원
                      </div>
                    </div>
                  </div>

                  <div className="md:w-40">
                    <div className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-200">
                      <div className="inline-flex items-center gap-1 mb-1" style={{ color: scoreColor }}>
                        <Trophy className="w-4 h-4" />
                        <span className="text-2xl font-bold">{pathway.finalScore}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">적합도 점수</p>
                      <Button asChild className="w-full bg-gray-900 hover:bg-gray-800">
                        <Link href={`/visa-planner/result/${pathway.pathwayId}`}>상세 보기</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6 mt-8 bg-gray-900 text-white shadow-xl">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-sm text-cyan-200 mb-2">
                <Briefcase className="w-4 h-4" />
                기업 스카우트 연결
              </div>
              <h2 className="text-2xl font-bold mb-2">무료 결과 다음은 프로필 완성입니다</h2>
              <p className="text-white/75">
                학력, 경력, 한국어 수준, 희망 직무와 지역을 상세히 등록하면 인재채용관에서 검색 가능한 프로필이 됩니다.
              </p>
            </div>
            <div className="space-y-2 text-sm text-white/80">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300 shrink-0" />
                학력과 경력을 세부 입력하면 스카우트 제안을 받을 수 있습니다.
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300 shrink-0" />
                별도 결제 없이 무료로 계속 진행할 수 있습니다.
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300 shrink-0" />
                프로필이 완성되면 기업 검색 필터에서 노출 품질이 좋아집니다.
              </p>
              <Button asChild size="lg" className="w-full mt-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold">
                <Link href={`/visa-planner/profile?sessionId=${result.sessionId ?? ''}`}>
                  프로필 등록으로 이어가기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/visa-planner">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              다시 진단하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
