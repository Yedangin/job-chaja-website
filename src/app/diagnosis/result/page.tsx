'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, ArrowLeft, Trophy, Clock, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { DiagnosisResult, RecommendedPathway } from '../designs/_mock/diagnosis-mock-data';
import { getScoreColor, getFeasibilityEmoji } from '../designs/_mock/diagnosis-mock-data';

// 한국 지도 SVG / Simplified Korea map outline SVG
const KoreaMapSVG = () => (
  <svg viewBox="0 0 200 300" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 100 20 Q 110 25 115 35 L 120 50 Q 125 60 125 70 L 130 90 Q 135 110 130 130 L 125 150 Q 120 170 115 185 L 110 200 Q 105 215 100 225 L 95 240 Q 90 255 85 265 L 80 280 Q 75 265 70 250 L 65 230 Q 60 210 60 190 L 55 170 Q 50 150 52 130 L 55 110 Q 58 90 62 75 L 68 60 Q 75 45 82 35 L 90 25 Q 95 20 100 20 Z"
      fill="#f0f9ff"
      stroke="#0ea5e9"
      strokeWidth="2"
    />
    <ellipse cx="80" cy="290" rx="12" ry="6" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="1.5" />
  </svg>
);

// 경로 색상 / Route colors
const routeColors = [
  { dot: 'bg-orange-500', text: 'text-orange-600' },
  { dot: 'bg-blue-500', text: 'text-blue-600' },
  { dot: 'bg-purple-500', text: 'text-purple-600' },
  { dot: 'bg-green-500', text: 'text-green-600' },
  { dot: 'bg-pink-500', text: 'text-pink-600' },
];

// 지도 핀 위치 / Map pin positions
const pinPositions = [
  { top: '15%', left: '52%' },
  { top: '35%', left: '68%' },
  { top: '55%', left: '45%' },
  { top: '40%', left: '35%' },
  { top: '65%', left: '60%' },
];

// 로딩 단계 / Loading phase
type LoadingPhase = 'analyzing' | 'celebrating' | 'results';

export default function DiagnosisResultPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<LoadingPhase>('analyzing');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiDoneRef = useRef(false);
  const minAnimationDoneRef = useRef(false);

  useEffect(() => {
    // sessionStorage에서 입력 데이터 읽기 / Read input data from sessionStorage
    const inputStr = sessionStorage.getItem('diagnosis-input');
    if (!inputStr) {
      router.replace('/diagnosis');
      return;
    }

    const input = JSON.parse(inputStr);

    // 분석 카운터 애니메이션 / Analysis counter animation
    let count = 0;
    const targetCount = 15;
    const interval = setInterval(() => {
      count++;
      setAnalysisCount(count);
      if (count >= targetCount) {
        clearInterval(interval);
        minAnimationDoneRef.current = true;
        tryTransitionToCelebration();
      }
    }, 120);

    // API 호출 / Call API
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
        // 상세 페이지에서 사용하기 위해 저장 / Save for detail page
        sessionStorage.setItem('diagnosis-result', JSON.stringify(data));
        apiDoneRef.current = true;
        tryTransitionToCelebration();
      } catch (err) {
        setError(err instanceof Error ? err.message : '진단 서버에 연결할 수 없습니다');
        apiDoneRef.current = true;
        minAnimationDoneRef.current = true;
        setPhase('results');
      }
    };

    callApi();

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 분석 → 축하 전환 시도 / Try transition from analyzing to celebrating
  const tryTransitionToCelebration = () => {
    if (apiDoneRef.current && minAnimationDoneRef.current) {
      setPhase('celebrating');
      setTimeout(() => {
        setPhase('results');
      }, 2000);
    }
  };

  // ============================================================
  // 분석 중 화면 / Analyzing screen
  // ============================================================
  if (phase === 'analyzing') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-sky-500 to-blue-600 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* 회전 원 / Spinning circle */}
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
          <p className="text-2xl font-bold text-white mb-2">
            {analysisCount}개 경로 분석 중...
          </p>
          <p className="text-blue-100">최적의 비자 경로를 찾고 있어요</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // 축하 화면 / Celebration screen
  // ============================================================
  if (phase === 'celebrating') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 z-50 flex items-center justify-center">
        <div className="text-center animate-[scaleIn_0.5s_ease-out]">
          <div className="text-9xl mb-6 animate-bounce" style={{ animationDuration: '1s' }}>
            &#x1F389;
          </div>
          <p className="text-4xl font-bold text-white mb-4 animate-pulse">
            최적의 경로를 찾았어요!
          </p>
          {result && (
            <p className="text-xl text-white/80">
              {result.pathways.length}개의 추천 경로를 발견했습니다
            </p>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // 에러 화면 / Error screen
  // ============================================================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto p-8 text-center">
          <div className="text-6xl mb-4">&#x26A0;&#xFE0F;</div>
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
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              다시 시도
            </Button>
            <Button variant="outline" onClick={() => router.push('/diagnosis')} className="w-full">
              처음부터 다시하기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ============================================================
  // 결과 없음 / No results
  // ============================================================
  if (!result || result.pathways.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto p-8 text-center">
          <div className="text-6xl mb-4">&#x1F50D;</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">매칭 경로 없음</h2>
          <p className="text-gray-600 mb-6">
            입력하신 조건에 맞는 비자 경로를 찾지 못했습니다.<br />
            조건을 변경하여 다시 시도해주세요.
          </p>
          <Button onClick={() => router.push('/diagnosis')} className="w-full bg-blue-500 hover:bg-blue-600">
            다시 진단하기
          </Button>
        </Card>
      </div>
    );
  }

  // ============================================================
  // 결과 화면 (Design E: 지도 스타일) / Results screen (map style)
  // ============================================================
  const pathways = result.pathways;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 py-8 px-4 animate-[fadeIn_0.6s_ease-out]">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">당신의 비자 여정 지도</h1>
          <p className="text-gray-600">
            {result.meta.totalPathwaysEvaluated}개 경로 중 {pathways.length}개의 추천 경로를 찾았습니다
          </p>
        </div>

        {/* 한국 지도 + 경로 핀 / Korea map + route pins */}
        <Card className="p-8 mb-8 bg-white shadow-xl">
          <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: '2/3' }}>
            <KoreaMapSVG />

            {/* 경로 점선 / Route dotted lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 300">
              <path d="M 100 30 Q 110 70 115 110 Q 118 140 110 170" stroke="#fb923c" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.6" />
              <path d="M 95 35 Q 80 80 75 120 Q 72 160 80 190" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.6" />
              <path d="M 105 32 Q 120 90 118 140 Q 115 180 100 210" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.6" />
            </svg>

            {/* 핀 마커 / Pin markers */}
            {pathways.map((pathway, idx) => {
              const position = pinPositions[idx % pinPositions.length];
              const colors = routeColors[idx % routeColors.length];

              return (
                <div
                  key={pathway.pathwayId}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce"
                  style={{
                    top: position.top,
                    left: position.left,
                    animationDelay: `${idx * 0.2}s`,
                    animationDuration: '2s',
                  }}
                >
                  <div className={`${colors.dot} rounded-full w-8 h-8 shadow-lg flex items-center justify-center border-2 border-white`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className={`text-xs font-semibold ${colors.text} bg-white px-2 py-1 rounded shadow`}>
                      경로 {idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* 시작점 / Starting point */}
            <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2">
              <div className="bg-green-500 rounded-full w-10 h-10 shadow-lg flex items-center justify-center border-4 border-white">
                <span className="text-white font-bold text-xl">&#x1F6EB;</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 경로 카드 목록 / Pathway cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-blue-900 mb-4">추천 경로</h2>
          {pathways.map((pathway, idx) => {
            const colors = routeColors[idx % routeColors.length];
            const visaChain = pathway.visaChain.split(' \u2192 ').map((s) => s.trim());
            const scoreColor = getScoreColor(pathway.finalScore);

            return (
              <Card
                key={pathway.pathwayId}
                className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow animate-[fadeSlideUp_0.5s_ease-out]"
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <div className={`${colors.dot} w-6 h-6 rounded-full border-2 border-white shadow-md`} />
                  </div>

                  <div className="flex-1">
                    {/* 경로 헤더 / Pathway header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${colors.dot} text-white`}>경로 {idx + 1}</Badge>
                          {idx === 0 && (
                            <Badge className="bg-yellow-100 text-yellow-700">추천</Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{pathway.nameKo}</h3>
                        <p className="text-sm text-gray-500">{pathway.nameEn}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1" style={{ color: scoreColor }}>
                          <Trophy className="w-4 h-4" />
                          <span className="font-bold text-lg">{pathway.finalScore}점</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                        </span>
                      </div>
                    </div>

                    {/* 비자 체인 / Visa chain */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {visaChain.map((visa, vIdx) => (
                        <div key={vIdx} className="flex items-center gap-1">
                          <Badge variant="outline" className="text-sm">
                            {visa}
                          </Badge>
                          {vIdx < visaChain.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 요약 정보 / Summary */}
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>총 {pathway.estimatedMonths}개월</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wallet className="w-4 h-4" />
                        <span>약 {pathway.estimatedCostWon.toLocaleString()}만원</span>
                      </div>
                    </div>

                    {/* 특징 / Note */}
                    <p className="text-sm text-gray-700 mb-4">{pathway.note}</p>

                    {/* 상세보기 / Detail link */}
                    <Link href={`/diagnosis/result/${pathway.pathwayId}`}>
                      <Button className={`w-full ${colors.dot} hover:opacity-90`}>
                        경로 따라가기
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 하단 액션 / Bottom actions */}
        <div className="mt-8 text-center">
          <Link href="/diagnosis">
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
