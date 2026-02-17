'use client';

// GPS 내비게이션 스타일 비자 진단 페이지
// GPS Navigation-style visa diagnosis page

import React, { useState } from 'react';
import {
  popularCountries,
  educationOptions,
  goalOptions,
  priorityOptions,
  fundOptions,
  mockDiagnosisResult,
  mockInput,
  DiagnosisInput,
  DiagnosisResult,
  RecommendedPathway,
  getScoreColor,
  getFeasibilityEmoji,
  mockPathways,
  CompatPathway,
} from '../_mock/diagnosis-mock-data';
import {
  Navigation,
  MapPin,
  Flag,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Zap,
  Shield,
  TrendingUp,
  RotateCcw,
  Play,
  AlertTriangle,
  CheckCircle,
  Circle,
  ArrowRight,
  Crosshair,
  Radio,
  Route,
  Compass,
  Map,
  Signal,
  Car,
} from 'lucide-react';

// 입력 단계 타입 / Input step type
type InputStep = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// 화면 상태 타입 / Screen state type
type ScreenState = 'input' | 'calculating' | 'result';

// 선택된 경로 확장 상태 / Expanded pathway state
interface ExpandedState {
  [pathwayId: string]: boolean;
}

// 입력 순서 / Input step order
const INPUT_STEPS: InputStep[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

// 우선순위 아이콘 매핑 / Priority icon mapping
function getPriorityIcon(value: string) {
  switch (value) {
    case 'speed': return <Zap size={18} />;
    case 'stability': return <Shield size={18} />;
    case 'cost': return <DollarSign size={18} />;
    case 'income': return <TrendingUp size={18} />;
    default: return <Compass size={18} />;
  }
}

// 점수에 따른 경로 색상 / Route color based on score
function getRouteColor(score: number): string {
  if (score >= 51) return '#3b82f6'; // 파란색 / blue
  if (score >= 31) return '#f59e0b'; // 노란색 / amber
  return '#ef4444'; // 빨간색 / red
}

// 경로 등급 라벨 / Route grade label
function getRouteGrade(score: number): string {
  if (score >= 51) return '최적 경로';
  if (score >= 31) return '대안 경로';
  return '우회 경로';
}

// 비용 포맷 / Format cost
function formatCost(wonInManwon: number): string {
  if (wonInManwon === 0) return '무료';
  if (wonInManwon >= 10000) return `${(wonInManwon / 10000).toFixed(1)}억원`;
  if (wonInManwon >= 1000) return `${(wonInManwon / 1000).toFixed(1)}천만원`;
  return `${wonInManwon}만원`;
}

// ETA 포맷 / Format ETA in months
function formatETA(months: number): string {
  if (months < 12) return `${months}개월`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y}년 ${m}개월` : `${y}년`;
}

export default function Diagnosis45Page() {
  // 현재 화면 상태 / Current screen state
  const [screen, setScreen] = useState<ScreenState>('input');

  // 현재 입력 단계 / Current input step
  const [currentStep, setCurrentStep] = useState<InputStep>('nationality');

  // 진단 입력값 / Diagnosis input values
  const [input, setInput] = useState<DiagnosisInput>({
    nationality: '',
    age: 25,
    educationLevel: '',
    availableAnnualFund: 500,
    finalGoal: '',
    priorityPreference: '',
  });

  // 나이 입력 임시 값 / Age input temporary value
  const [ageInput, setAgeInput] = useState('25');

  // 결과 데이터 / Result data
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // 선택된 경로 / Selected pathway
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  // 경로 확장 상태 / Expanded pathway states
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // 현재 단계 인덱스 / Current step index
  const stepIndex = INPUT_STEPS.indexOf(currentStep);

  // 다음 단계로 이동 / Move to next step
  function goNext() {
    if (stepIndex < INPUT_STEPS.length - 1) {
      setCurrentStep(INPUT_STEPS[stepIndex + 1]);
    } else {
      startCalculating();
    }
  }

  // 이전 단계로 이동 / Move to previous step
  function goBack() {
    if (stepIndex > 0) {
      setCurrentStep(INPUT_STEPS[stepIndex - 1]);
    }
  }

  // 계산 시작 / Start calculating
  function startCalculating() {
    setScreen('calculating');
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setScreen('result');
      // 첫 번째 경로 자동 선택 / Auto-select first pathway
      if (mockDiagnosisResult.pathways.length > 0) {
        setSelectedPathway(mockDiagnosisResult.pathways[0].pathwayId);
      }
    }, 2200);
  }

  // 다시 시작 / Restart
  function restart() {
    setScreen('input');
    setCurrentStep('nationality');
    setInput({
      nationality: '',
      age: 25,
      educationLevel: '',
      availableAnnualFund: 500,
      finalGoal: '',
      priorityPreference: '',
    });
    setAgeInput('25');
    setResult(null);
    setSelectedPathway(null);
    setExpanded({});
  }

  // 경로 확장 토글 / Toggle pathway expansion
  function toggleExpanded(pathwayId: string) {
    setExpanded((prev) => ({ ...prev, [pathwayId]: !prev[pathwayId] }));
  }

  // 현재 단계 유효성 / Is current step valid
  function isStepValid(): boolean {
    switch (currentStep) {
      case 'nationality': return !!input.nationality;
      case 'age': return input.age >= 15 && input.age <= 70;
      case 'educationLevel': return !!input.educationLevel;
      case 'availableAnnualFund': return input.availableAnnualFund >= 0;
      case 'finalGoal': return !!input.finalGoal;
      case 'priorityPreference': return !!input.priorityPreference;
      default: return false;
    }
  }

  // 선택된 국가 정보 / Selected country info
  const selectedCountry = popularCountries.find((c) => c.code === input.nationality);

  // ============================
  // 계산 중 화면 렌더링
  // Calculating screen render
  // ============================
  if (screen === 'calculating') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
        {/* 격자 배경 / Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* 스캔 라인 애니메이션 / Scan line animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-full h-0.5 bg-linear-to-br from-transparent via-blue-400 to-transparent opacity-60"
            style={{ animation: 'scanLine 2s linear infinite', top: 0 }}
          />
        </div>

        <div className="text-center z-10 px-6">
          {/* GPS 아이콘 애니메이션 / GPS icon animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-blue-400 opacity-50 animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-blue-500 flex items-center justify-center">
              <Navigation size={36} className="text-blue-400" />
            </div>
          </div>

          <div className="text-blue-400 font-mono text-sm mb-2 uppercase tracking-widest">
            Route Calculating...
          </div>
          <div className="text-white text-xl font-bold mb-1">경로를 탐색하고 있습니다</div>
          <div className="text-gray-400 text-sm mb-8">31개 비자 유형 · 14개 평가 알고리즘 분석 중</div>

          {/* 진행 바 / Progress bar */}
          <div className="w-72 mx-auto">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ animation: 'progressBar 2.2s ease-out forwards' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
              <span>출발점 분석</span>
              <span>경로 최적화</span>
              <span>도착지 확인</span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes scanLine {
            0% { top: -2px; }
            100% { top: 100%; }
          }
          @keyframes progressBar {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  // ============================
  // 결과 화면 렌더링
  // Result screen render
  // ============================
  if (screen === 'result' && result) {
    const selectedP = result.pathways.find((p) => p.pathwayId === selectedPathway);

    return (
      <div className="min-h-screen bg-gray-950 text-white">
        {/* 헤더 / Header */}
        <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Navigation size={16} className="text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">JobChaJa Navigator</div>
                <div className="text-sm font-semibold text-white">경로 탐색 완료</div>
              </div>
            </div>
            <button
              onClick={restart}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
            >
              <RotateCcw size={14} />
              <span>다시 탐색</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

          {/* 출발/도착 요약 바 / Origin-destination summary bar */}
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              {/* 출발점 / Origin */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-green-900 border border-green-600 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-green-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">출발</div>
                  <div className="text-sm font-medium text-white truncate">
                    {selectedCountry?.flag} {selectedCountry?.nameKo || '해외'} · {input.age}세
                  </div>
                </div>
              </div>

              {/* 화살표 / Arrow */}
              <div className="flex items-center gap-1 text-blue-500 shrink-0">
                <div className="w-8 h-px bg-blue-600" />
                <ArrowRight size={16} />
              </div>

              {/* 도착점 / Destination */}
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                <div className="min-w-0 text-right">
                  <div className="text-xs text-gray-500">목적지</div>
                  <div className="text-sm font-medium text-white truncate">
                    {goalOptions.find((g) => g.value === input.finalGoal)?.emoji}{' '}
                    {goalOptions.find((g) => g.value === input.finalGoal)?.labelKo || '한국'}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-600 flex items-center justify-center shrink-0">
                  <Flag size={14} className="text-blue-400" />
                </div>
              </div>
            </div>

            {/* 통계 바 / Stats bar */}
            <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Route size={12} className="text-blue-400" />
                <span>{result.pathways.length}개 경로 발견</span>
              </div>
              <div className="flex items-center gap-1">
                <Signal size={12} className="text-green-400" />
                <span>{result.meta.totalPathwaysEvaluated}개 분석 완료</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-gray-600">우선순위:</span>
                <span className="text-white">
                  {priorityOptions.find((p) => p.value === input.priorityPreference)?.labelKo}
                </span>
              </div>
            </div>
          </div>

          {/* 지도 뷰 — 경로 선택 패널 / Map view — route selection panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* 왼쪽: 경로 목록 / Left: Route list */}
            <div className="lg:col-span-1 space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
                <Map size={12} />
                추천 경로
              </div>

              {result.pathways.map((pathway, idx) => {
                const isSelected = selectedPathway === pathway.pathwayId;
                const routeColor = getRouteColor(pathway.finalScore);
                const grade = getRouteGrade(pathway.finalScore);
                const isFirst = idx === 0;

                return (
                  <button
                    key={pathway.pathwayId}
                    onClick={() => setSelectedPathway(pathway.pathwayId)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-950 border-blue-600'
                        : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {/* 경로 번호 / Route number */}
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{ backgroundColor: routeColor, color: 'white' }}
                      >
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* 경로 이름 / Route name */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {isFirst && (
                            <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium shrink-0">
                              추천
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{grade}</span>
                        </div>
                        <div className="text-sm font-medium text-white mt-0.5 leading-tight">
                          {pathway.nameKo}
                        </div>

                        {/* ETA / 예상 시간 */}
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={10} />
                            <span>{formatETA(pathway.estimatedMonths)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <DollarSign size={10} />
                            <span>{formatCost(pathway.estimatedCostWon)}</span>
                          </div>
                        </div>
                      </div>

                      {/* 점수 / Score */}
                      <div
                        className="text-sm font-bold shrink-0"
                        style={{ color: routeColor }}
                      >
                        {pathway.finalScore}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 오른쪽: 선택된 경로 상세 / Right: Selected route detail */}
            <div className="lg:col-span-2">
              {selectedP ? (
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                  {/* 경로 헤더 / Route header */}
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs px-2 py-0.5 rounded font-mono"
                            style={{
                              backgroundColor: getRouteColor(selectedP.finalScore) + '22',
                              color: getRouteColor(selectedP.finalScore),
                              border: `1px solid ${getRouteColor(selectedP.finalScore)}44`,
                            }}
                          >
                            {selectedP.pathwayId}
                          </span>
                          <span className="text-xs text-gray-500">{selectedP.nameEn}</span>
                        </div>
                        <h2 className="text-lg font-bold text-white">{selectedP.nameKo}</h2>
                      </div>

                      {/* 점수 게이지 / Score gauge */}
                      <div className="text-center shrink-0">
                        <div
                          className="text-3xl font-black"
                          style={{ color: getScoreColor(selectedP.finalScore) }}
                        >
                          {selectedP.finalScore}
                        </div>
                        <div className="text-xs text-gray-500">점수</div>
                      </div>
                    </div>

                    {/* ETA 정보 / ETA info */}
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="bg-gray-800 rounded-lg p-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-1">
                          <Clock size={11} />
                          <span>예상 기간</span>
                        </div>
                        <div className="text-sm font-bold text-white">
                          {formatETA(selectedP.estimatedMonths)}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-1">
                          <DollarSign size={11} />
                          <span>예상 비용</span>
                        </div>
                        <div className="text-sm font-bold text-white">
                          {formatCost(selectedP.estimatedCostWon)}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-1">
                          <Signal size={11} />
                          <span>실현 가능성</span>
                        </div>
                        <div className="text-sm font-bold">
                          {getFeasibilityEmoji(selectedP.feasibilityLabel)}{' '}
                          <span className="text-white">{selectedP.feasibilityLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 비자 경로 (비자 체인) / Visa chain */}
                  <div className="p-4 border-b border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
                      <Route size={11} />
                      비자 경로
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedP.visaChain.split(' → ').map((visa, vIdx, arr) => (
                        <React.Fragment key={vIdx}>
                          <div
                            className="px-3 py-1.5 rounded-lg text-sm font-mono font-bold text-white"
                            style={{
                              backgroundColor: getRouteColor(selectedP.finalScore) + '33',
                              border: `1px solid ${getRouteColor(selectedP.finalScore)}66`,
                            }}
                          >
                            {visa}
                          </div>
                          {vIdx < arr.length - 1 && (
                            <ChevronRight size={14} className="text-gray-600 shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* 턴바이턴 마일스톤 / Turn-by-turn milestones */}
                  <div className="p-4 border-b border-gray-800">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
                      <Navigation size={11} />
                      경로 안내 (턴 바이 턴)
                    </div>

                    <div className="space-y-3">
                      {selectedP.milestones.map((milestone, mIdx) => {
                        const isFinal = mIdx === selectedP.milestones.length - 1;
                        return (
                          <div key={milestone.order} className="flex items-start gap-3">
                            {/* 타임라인 아이콘 / Timeline icon */}
                            <div className="flex flex-col items-center shrink-0">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                  isFinal
                                    ? 'bg-blue-600 border-2 border-blue-400'
                                    : mIdx === 0
                                    ? 'bg-green-800 border-2 border-green-500'
                                    : 'bg-gray-800 border border-gray-600'
                                }`}
                              >
                                {isFinal ? (
                                  <Flag size={13} className="text-white" />
                                ) : mIdx === 0 ? (
                                  <MapPin size={13} className="text-green-400" />
                                ) : (
                                  <Circle size={9} className="text-gray-400" />
                                )}
                              </div>
                              {!isFinal && (
                                <div className="w-px h-6 bg-gray-700 mt-1" />
                              )}
                            </div>

                            {/* 마일스톤 내용 / Milestone content */}
                            <div className="flex-1 pb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-500 font-mono">
                                  +{milestone.monthFromStart}개월
                                </span>
                                {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                                  <span className="text-xs px-1.5 py-0.5 bg-blue-900 text-blue-300 rounded font-mono">
                                    {milestone.visaStatus}
                                  </span>
                                )}
                                {milestone.canWorkPartTime && (
                                  <span className="text-xs px-1.5 py-0.5 bg-green-900 text-green-300 rounded">
                                    취업가능
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-medium text-white mt-0.5">
                                {milestone.nameKo}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">{milestone.requirements}</div>
                              {milestone.estimatedMonthlyIncome > 0 && (
                                <div className="text-xs text-green-400 mt-0.5">
                                  월 ~{milestone.estimatedMonthlyIncome}만원
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 다음 단계 / Next steps */}
                  <div className="p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
                      <Play size={11} />
                      지금 바로 시작
                    </div>
                    <div className="space-y-2">
                      {selectedP.nextSteps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-3 bg-gray-800 rounded-xl p-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-900 border border-blue-600 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0 mt-0.5">
                            {sIdx + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{step.nameKo}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{step.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 참고 메모 / Note */}
                    {selectedP.note && (
                      <div className="mt-3 flex items-start gap-2 bg-amber-950 rounded-lg p-3 border border-amber-800">
                        <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-xs text-amber-300">{selectedP.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center p-8">
                  <div className="text-center text-gray-500">
                    <Map size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">경로를 선택하세요</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 전체 경로 상세 비교 / Full route comparison */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <Compass size={12} />
              전체 경로 비교
            </div>

            <div className="space-y-3">
              {result.pathways.map((pathway, idx) => {
                const isExpanded = expanded[pathway.pathwayId];
                const routeColor = getRouteColor(pathway.finalScore);
                const barWidth = Math.max(4, pathway.finalScore);

                return (
                  <div key={pathway.pathwayId} className="border border-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleExpanded(pathway.pathwayId)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
                    >
                      {/* 번호 / Number */}
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: routeColor + '33', color: routeColor, border: `1px solid ${routeColor}55` }}
                      >
                        {idx + 1}
                      </div>

                      {/* 이름 / Name */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-medium text-white truncate">{pathway.nameKo}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {pathway.visaChain} · {formatETA(pathway.estimatedMonths)} · {formatCost(pathway.estimatedCostWon)}
                        </div>
                      </div>

                      {/* 점수 바 / Score bar */}
                      <div className="w-24 shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${barWidth}%`, backgroundColor: routeColor }}
                            />
                          </div>
                          <span className="text-xs font-bold w-6 text-right" style={{ color: routeColor }}>
                            {pathway.finalScore}
                          </span>
                        </div>
                      </div>

                      {/* 토글 아이콘 / Toggle icon */}
                      <div className="text-gray-500 shrink-0">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {/* 확장된 상세 / Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-gray-800 p-3 bg-gray-950">
                        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                          <div>
                            <span className="text-gray-500">실현 가능성: </span>
                            <span className="text-white">
                              {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">플랫폼 지원: </span>
                            <span className="text-white">
                              {pathway.platformSupport === 'full_support' ? '전체 지원' : '정보 제공'}
                            </span>
                          </div>
                        </div>

                        {/* 마일스톤 요약 / Milestone summary */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {pathway.milestones.map((m, mIdx) => (
                            <React.Fragment key={m.order}>
                              <div className="flex items-center gap-1">
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                  style={{
                                    backgroundColor: routeColor + '22',
                                    border: `1px solid ${routeColor}55`,
                                  }}
                                >
                                  <span style={{ color: routeColor }}>{m.order}</span>
                                </div>
                                <span className="text-gray-400 text-xs">{m.nameKo.slice(0, 10)}</span>
                              </div>
                              {mIdx < pathway.milestones.length - 1 && (
                                <ChevronRight size={10} className="text-gray-700 shrink-0" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 하단 CTA / Bottom CTA */}
          <div className="bg-linear-to-br from-blue-950 to-gray-900 rounded-2xl border border-blue-900 p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle size={20} className="text-blue-400" />
              <span className="text-white font-semibold">잡차자로 경로를 시작하세요</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              맞춤 비자 경로 · 채용 매칭 · 비자 신청 전문 지원
            </p>
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors">
              무료로 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // 입력 화면 렌더링
  // Input screen render
  // ============================
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* 헤더 / Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Navigation size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-blue-400 font-mono uppercase tracking-widest">
                JobChaJa Navigator
              </div>
              <div className="text-sm font-bold text-white">한국 비자 경로 탐색기</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-400">GPS 연결됨</span>
            </div>
          </div>
        </div>
      </div>

      {/* 진행 단계 / Progress steps */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3">
          {/* 진행 바 / Progress bar */}
          <div className="flex items-center gap-1 mb-2">
            {INPUT_STEPS.map((step, idx) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx < stepIndex
                    ? 'bg-blue-500'
                    : idx === stepIndex
                    ? 'bg-blue-400'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">
              출발지 설정 {stepIndex + 1}/{INPUT_STEPS.length}
            </span>
            <span className="text-blue-400 font-mono">
              {Math.round(((stepIndex + 1) / INPUT_STEPS.length) * 100)}% 완료
            </span>
          </div>
        </div>
      </div>

      {/* 메인 입력 영역 / Main input area */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">

        {/* 단계 안내 / Step guide */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair size={14} className="text-blue-400" />
            <span className="text-xs text-blue-400 font-mono uppercase tracking-wider">
              출발지 입력 중
            </span>
          </div>
          <h1 className="text-xl font-bold text-white">
            {currentStep === 'nationality' && '국적을 알려주세요'}
            {currentStep === 'age' && '나이를 알려주세요'}
            {currentStep === 'educationLevel' && '학력을 선택해 주세요'}
            {currentStep === 'availableAnnualFund' && '준비 가능한 자금은?'}
            {currentStep === 'finalGoal' && '최종 목표를 선택하세요'}
            {currentStep === 'priorityPreference' && '우선순위를 선택하세요'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {currentStep === 'nationality' && '현재 거주 중인 국가의 국적'}
            {currentStep === 'age' && '현재 만 나이 (15~70세)'}
            {currentStep === 'educationLevel' && '최종 학력 기준'}
            {currentStep === 'availableAnnualFund' && '비자 신청, 학비, 생활비 포함 연간 총 예산'}
            {currentStep === 'finalGoal' && '한국에서 이루고 싶은 최종 목표'}
            {currentStep === 'priorityPreference' && '가장 중요하게 생각하는 경로 조건'}
          </p>
        </div>

        {/* 입력 컴포넌트 / Input component */}
        <div className="flex-1">

          {/* 국적 선택 / Nationality selection */}
          {currentStep === 'nationality' && (
            <div className="grid grid-cols-2 gap-2">
              {popularCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    setInput((prev) => ({ ...prev, nationality: country.code }));
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    input.nationality === country.code
                      ? 'bg-blue-950 border-blue-500'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <span className="text-xl shrink-0">{country.flag}</span>
                  <div className="text-left min-w-0">
                    <div className="text-sm font-medium text-white truncate">{country.nameKo}</div>
                    <div className="text-xs text-gray-500 truncate">{country.nameEn}</div>
                  </div>
                  {input.nationality === country.code && (
                    <CheckCircle size={14} className="text-blue-400 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 나이 입력 / Age input */}
          {currentStep === 'age' && (
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 text-center">
                <div className="text-6xl font-black text-white mb-2">{input.age}</div>
                <div className="text-gray-400 text-sm">세 (만 나이)</div>
              </div>
              <input
                type="range"
                min={15}
                max={70}
                value={input.age}
                onChange={(e) => setInput((prev) => ({ ...prev, age: Number(e.target.value) }))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>15세</span>
                <span>70세</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={15}
                  max={70}
                  value={ageInput}
                  onChange={(e) => {
                    setAgeInput(e.target.value);
                    const parsed = parseInt(e.target.value, 10);
                    if (!isNaN(parsed) && parsed >= 15 && parsed <= 70) {
                      setInput((prev) => ({ ...prev, age: parsed }));
                    }
                  }}
                  placeholder="직접 입력"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* 학력 선택 / Education selection */}
          {currentStep === 'educationLevel' && (
            <div className="space-y-2">
              {educationOptions.map((edu) => (
                <button
                  key={edu.value}
                  onClick={() => setInput((prev) => ({ ...prev, educationLevel: edu.value }))}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    input.educationLevel === edu.value
                      ? 'bg-blue-950 border-blue-500'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <span className="text-xl shrink-0">{edu.emoji || '📚'}</span>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium text-white">{edu.labelKo}</div>
                    <div className="text-xs text-gray-500">{edu.labelEn}</div>
                  </div>
                  {input.educationLevel === edu.value && (
                    <CheckCircle size={16} className="text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 자금 선택 / Fund selection */}
          {currentStep === 'availableAnnualFund' && (
            <div className="space-y-2">
              {fundOptions.map((fund) => (
                <button
                  key={fund.value}
                  onClick={() => setInput((prev) => ({ ...prev, availableAnnualFund: fund.value }))}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                    input.availableAnnualFund === fund.value
                      ? 'bg-blue-950 border-blue-500'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: input.availableAnnualFund === fund.value ? '#1d4ed8' : '#1f2937',
                    }}
                  >
                    <DollarSign size={14} className={input.availableAnnualFund === fund.value ? 'text-blue-300' : 'text-gray-500'} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium text-white">{fund.labelKo}</div>
                    <div className="text-xs text-gray-500">{fund.labelEn}</div>
                  </div>
                  {input.availableAnnualFund === fund.value && (
                    <CheckCircle size={16} className="text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 목표 선택 / Goal selection */}
          {currentStep === 'finalGoal' && (
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setInput((prev) => ({ ...prev, finalGoal: goal.value }))}
                  className={`p-4 rounded-2xl border transition-all text-center ${
                    input.finalGoal === goal.value
                      ? 'bg-blue-950 border-blue-500'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">{goal.emoji}</div>
                  <div className="text-sm font-bold text-white">{goal.labelKo}</div>
                  <div className="text-xs text-gray-400 mt-1">{goal.descKo}</div>
                  {input.finalGoal === goal.value && (
                    <div className="mt-2 flex justify-center">
                      <CheckCircle size={14} className="text-blue-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 우선순위 선택 / Priority selection */}
          {currentStep === 'priorityPreference' && (
            <div className="space-y-2">
              {priorityOptions.map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => setInput((prev) => ({ ...prev, priorityPreference: priority.value }))}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    input.priorityPreference === priority.value
                      ? 'bg-blue-950 border-blue-500'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: input.priorityPreference === priority.value ? '#1d4ed8' : '#1f2937',
                    }}
                  >
                    <span className={input.priorityPreference === priority.value ? 'text-blue-300' : 'text-gray-400'}>
                      {getPriorityIcon(priority.value)}
                    </span>
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-base font-bold text-white">
                      {priority.emoji} {priority.labelKo}
                    </div>
                    <div className="text-sm text-gray-400">{priority.descKo}</div>
                  </div>
                  {input.priorityPreference === priority.value && (
                    <CheckCircle size={18} className="text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 네비게이션 버튼 / Navigation buttons */}
        <div className="mt-6 flex gap-3">
          {stepIndex > 0 && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-colors"
            >
              <Car size={16} />
              <span>이전</span>
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!isStepValid()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              isStepValid()
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {stepIndex === INPUT_STEPS.length - 1 ? (
              <>
                <Navigation size={16} />
                <span>경로 탐색 시작</span>
              </>
            ) : (
              <>
                <span>다음</span>
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
