'use client';
// KOR: 비자 진단 디자인 #18 — 마인드맵 입력 방식
// ENG: Visa diagnosis design #18 — Mind map input style

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
  MapPin,
  User,
  GraduationCap,
  DollarSign,
  Target,
  Star,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronRight,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Layers,
  Circle,
} from 'lucide-react';

// KOR: 진단 단계 타입 정의 (입력 순서) / ENG: Type definition for diagnosis steps (input order)
type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// KOR: 각 단계의 메타데이터 인터페이스 / ENG: Metadata interface for each step
interface StepMeta {
  key: StepKey;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  angle: number; // 마인드맵 캔버스에서의 각도 / Angle on mind map canvas
  radius: number; // 중심에서의 거리 / Distance from center
}

// KOR: 노드 확장 상태 타입 / ENG: Node expansion state type
type NodeState = 'idle' | 'active' | 'completed';

// KOR: 단계 메타데이터 배열 (6개 노드) / ENG: Step metadata array (6 nodes)
const STEPS: StepMeta[] = [
  {
    key: 'nationality',
    label: '국적',
    labelEn: 'Nationality',
    icon: <MapPin size={16} />,
    color: '#6366F1',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-400',
    textColor: 'text-indigo-700',
    angle: -90,
    radius: 200,
  },
  {
    key: 'age',
    label: '나이',
    labelEn: 'Age',
    icon: <User size={16} />,
    color: '#EC4899',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-400',
    textColor: 'text-pink-700',
    angle: -30,
    radius: 200,
  },
  {
    key: 'educationLevel',
    label: '학력',
    labelEn: 'Education',
    icon: <GraduationCap size={16} />,
    color: '#10B981',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-700',
    angle: 30,
    radius: 200,
  },
  {
    key: 'availableAnnualFund',
    label: '연간 자금',
    labelEn: 'Annual Fund',
    icon: <DollarSign size={16} />,
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-700',
    angle: 90,
    radius: 200,
  },
  {
    key: 'finalGoal',
    label: '최종 목표',
    labelEn: 'Final Goal',
    icon: <Target size={16} />,
    color: '#8B5CF6',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-400',
    textColor: 'text-violet-700',
    angle: 150,
    radius: 200,
  },
  {
    key: 'priorityPreference',
    label: '우선순위',
    labelEn: 'Priority',
    icon: <Star size={16} />,
    color: '#EF4444',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    textColor: 'text-red-700',
    angle: 210,
    radius: 200,
  },
];

// KOR: 각도를 라디안으로 변환 / ENG: Convert degrees to radians
function degToRad(deg: number): number { return (deg * Math.PI) / 180; }

// KOR: 노드 캔버스 위치 계산 / ENG: Calculate node canvas position
function getNodePosition(angle: number, radius: number): { x: number; y: number } {
  const rad = degToRad(angle);
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

// KOR: 입력값 표시 텍스트 반환 / ENG: Return display text for input value
function getDisplayValue(key: StepKey, input: Partial<DiagnosisInput>): string {
  const value = input[key];
  if (value === undefined || value === null || value === '') return '';
  if (key === 'nationality') {
    const country = popularCountries.find((c) => c.name === value || c.code === value);
    return country ? `${country.flag} ${country.name}` : String(value);
  }
  if (key === 'age') return `${value}세`;
  return String(value);
}

// KOR: 점수에 따른 텍스트 색상 클래스 반환 / ENG: Return text color class based on score
function getScoreTextColor(score: number): string {
  if (score >= 80) return 'text-blue-600';
  if (score >= 65) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

// KOR: 레이블에 따른 배지 배경색 클래스 반환 / ENG: Return badge background class based on label
function getBadgeBg(label: RecommendedPathway['feasibilityLabel']): string {
  switch (label) {
    case '매우 높음': return 'bg-blue-100 text-blue-700';
    case '높음': return 'bg-green-100 text-green-700';
    case '보통': return 'bg-yellow-100 text-yellow-700';
    case '낮음': return 'bg-orange-100 text-orange-700';
    case '매우 낮음': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

// KOR: 비자 진단 마인드맵 페이지 메인 컴포넌트 / ENG: Main component for visa diagnosis mind map page
export default function Diagnosis18Page() {
  const [activeNode, setActiveNode] = useState<StepKey | null>(null); // 활성 노드 / active node
  const [inputData, setInputData] = useState<Partial<DiagnosisInput>>({}); // 입력 데이터 / input data
  const [showResult, setShowResult] = useState(false); // 결과 표시 / show result
  const [result, setResult] = useState<DiagnosisResult | null>(null); // 결과 / result
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null); // 확장 경로 / expanded pathway
  const [zoom, setZoom] = useState<number>(1); // 줌 / zoom
  const [ageInput, setAgeInput] = useState<string>(''); // 나이 입력 / age input

  // KOR: 완료 노드 수 / ENG: Count of completed nodes
  const completedCount = STEPS.filter((s) => {
    const val = inputData[s.key];
    return val !== undefined && val !== null && val !== '';
  }).length;
  const allCompleted = completedCount === STEPS.length; // 모두 완료 / all completed

  // KOR: 노드 상태 반환 / ENG: Return node state
  function getNodeState(key: StepKey): NodeState {
    if (activeNode === key) return 'active';
    const val = inputData[key];
    if (val !== undefined && val !== null && val !== '') return 'completed';
    return 'idle';
  }

  // KOR: 노드 클릭 핸들러 / ENG: Node click handler
  function handleNodeClick(key: StepKey) {
    if (showResult) return;
    setActiveNode(activeNode === key ? null : key);
    if (key === 'age') {
      const currentAge = inputData.age;
      setAgeInput(currentAge !== undefined ? String(currentAge) : '');
    }
  }

  // KOR: 옵션 선택 핸들러 / ENG: Option selection handler
  function handleSelect(key: StepKey, value: string) {
    setInputData((prev) => ({ ...prev, [key]: value }));
    // KOR: 선택 후 다음 미완성 노드로 이동 / ENG: Move to next incomplete node after selection
    const currentIdx = STEPS.findIndex((s) => s.key === key);
    const nextIncomplete = STEPS.slice(currentIdx + 1).find((s) => {
      const val = inputData[s.key];
      return val === undefined || val === null || val === '';
    });
    if (nextIncomplete) {
      setTimeout(() => {
        setActiveNode(nextIncomplete.key);
        if (nextIncomplete.key === 'age') setAgeInput('');
      }, 200);
    } else {
      setActiveNode(null);
    }
  }

  // KOR: 나이 확인 핸들러 / ENG: Age confirm handler
  function handleAgeConfirm() {
    const parsed = parseInt(ageInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed < 100) {
      setInputData((prev) => ({ ...prev, age: parsed }));
      const nextIncomplete = STEPS.find((s) => {
        if (s.key === 'age') return false;
        const val = inputData[s.key];
        return val === undefined || val === null || val === '';
      });
      if (nextIncomplete) {
        setTimeout(() => {
          setActiveNode(nextIncomplete.key);
          if (nextIncomplete.key === 'age') setAgeInput('');
        }, 200);
      } else {
        setActiveNode(null);
      }
    }
  }

  // KOR: 진단 시작 핸들러 / ENG: Diagnosis start handler
  function handleDiagnose() {
    setResult(mockDiagnosisResult);
    setShowResult(true);
    setActiveNode(null);
  }

  // KOR: 초기화 핸들러 / ENG: Reset handler
  function handleReset() {
    setInputData({});
    setActiveNode(null);
    setShowResult(false);
    setResult(null);
    setExpandedPathway(null);
    setZoom(1);
    setAgeInput('');
  }

  // KOR: 줌 핸들러 (최소 0.5 / 최대 1.5) / ENG: Zoom handler (min 0.5 / max 1.5)
  function handleZoomIn() { setZoom((z) => Math.min(1.5, parseFloat((z + 0.1).toFixed(1)))); }
  function handleZoomOut() { setZoom((z) => Math.max(0.5, parseFloat((z - 0.1).toFixed(1)))); }

  // KOR: SVG 캔버스 중심점 / ENG: SVG canvas center point
  const cx = 450;
  const cy = 300;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* KOR: 상단 헤더 (Top header) */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">비자 경로 진단</h1>
            <p className="text-xs text-gray-500">Visa Pathway Diagnosis · Mind Map</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* KOR: 진행률 표시 / ENG: Progress indicator */}
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5">
            <div className="flex gap-1">
              {STEPS.map((s) => {
                const state = getNodeState(s.key);
                return (
                  <div
                    key={s.key}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      state === 'completed'
                        ? 'bg-indigo-500'
                        : state === 'active'
                        ? 'bg-indigo-300 scale-125'
                        : 'bg-gray-300'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-xs font-medium text-gray-600">{completedCount}/{STEPS.length}</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
            <span>초기화</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* KOR: 메인 캔버스 영역 / ENG: Main canvas area */}
        <div className="flex-1 relative overflow-hidden bg-white">
          {/* KOR: 도트 그리드 배경 (Dot grid background) */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* KOR: 줌 컨트롤 (Zoom controls) */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
              title="확대"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
              title="축소"
            >
              <ZoomOut size={16} />
            </button>
            <div className="w-9 h-6 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-[10px] font-medium text-gray-500">{Math.round(zoom * 100)}%</span>
            </div>
          </div>

          {/* KOR: 마인드맵 SVG 캔버스 (Mind map SVG canvas) */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}>
            <svg width="900" height="600" viewBox="0 0 900 600" className="overflow-visible">
              {/* KOR: 노드 연결선 (Node connection lines) */}
              {STEPS.map((step) => {
                const pos = getNodePosition(step.angle, step.radius);
                const state = getNodeState(step.key);
                const isActive = state === 'active';
                const isCompleted = state === 'completed';
                return (
                  <line
                    key={`line-${step.key}`}
                    x1={cx}
                    y1={cy}
                    x2={cx + pos.x}
                    y2={cy + pos.y}
                    stroke={isCompleted ? step.color : isActive ? step.color : '#e5e7eb'}
                    strokeWidth={isActive ? 2.5 : isCompleted ? 2 : 1.5}
                    strokeDasharray={isActive ? '0' : isCompleted ? '0' : '5,4'}
                    opacity={isActive ? 1 : isCompleted ? 0.8 : 0.6}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* KOR: 중앙 핵심 노드 (Central core node) */}
              <g>
                <circle
                  cx={cx}
                  cy={cy}
                  r={54}
                  fill={showResult ? '#4F46E5' : allCompleted ? '#4F46E5' : '#6366F1'}
                  opacity={0.08}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={44}
                  fill={showResult ? '#4F46E5' : allCompleted ? '#4F46E5' : '#6366F1'}
                  opacity={0.9}
                />
                {showResult ? (
                  <>
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize={11} fill="white" fontWeight="600">진단 완료</text>
                    <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.8)">Diagnosis Done</text>
                    <text x={cx} y={cy + 24} textAnchor="middle" fontSize={18}>✅</text>
                  </>
                ) : allCompleted ? (
                  <>
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize={10} fill="white" fontWeight="600">분석 준비완료</text>
                    <text x={cx} y={cy + 8} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.8)">Ready to Analyze</text>
                    <text x={cx} y={cy + 24} textAnchor="middle" fontSize={18}>🚀</text>
                  </>
                ) : (
                  <>
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize={10} fill="white" fontWeight="600">비자 진단</text>
                    <text x={cx} y={cy + 8} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.8)">Visa Diagnosis</text>
                    <text x={cx} y={cy + 22} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.7)">{completedCount}/{STEPS.length} 완료</text>
                  </>
                )}
              </g>

              {/* KOR: 각 입력 노드 (Each input node) */}
              {STEPS.map((step) => {
                const pos = getNodePosition(step.angle, step.radius);
                const nx = cx + pos.x;
                const ny = cy + pos.y;
                const state = getNodeState(step.key);
                const isActive = state === 'active';
                const isCompleted = state === 'completed';
                const displayVal = getDisplayValue(step.key, inputData);

                return (
                  <g
                    key={step.key}
                    onClick={() => handleNodeClick(step.key)}
                    style={{ cursor: showResult ? 'default' : 'pointer' }}
                    className="transition-all duration-200"
                  >
                    {/* KOR: 글로우 링 (Glow ring) */}
                    {(isActive || isCompleted) && (
                      <circle
                        cx={nx}
                        cy={ny}
                        r={isActive ? 42 : 38}
                        fill={step.color}
                        opacity={isActive ? 0.12 : 0.08}
                        className="transition-all duration-300"
                      />
                    )}

                    {/* KOR: 노드 원 (Node circle) */}
                    <circle
                      cx={nx}
                      cy={ny}
                      r={34}
                      fill={isCompleted ? step.color : isActive ? 'white' : 'white'}
                      stroke={isActive || isCompleted ? step.color : '#e5e7eb'}
                      strokeWidth={isActive ? 2.5 : isCompleted ? 0 : 1.5}
                      className="transition-all duration-300"
                    />

                    {/* KOR: 완료 아이콘 (Completion icon) */}
                    {isCompleted && (
                      <circle cx={nx + 26} cy={ny - 26} r={9} fill="white" stroke={step.color} strokeWidth={1.5} />
                    )}
                    {isCompleted && (
                      <text x={nx + 26} y={ny - 22} textAnchor="middle" fontSize={10} fill={step.color} fontWeight="700">✓</text>
                    )}

                    {/* KOR: 노드 레이블 (Node label) */}
                    <text
                      x={nx}
                      y={ny - 6}
                      textAnchor="middle"
                      fontSize={isCompleted ? 9 : 11}
                      fill={isCompleted ? 'white' : isActive ? step.color : '#6b7280'}
                      fontWeight="600"
                      className="transition-all duration-200 select-none"
                    >
                      {step.label}
                    </text>

                    {/* KOR: 입력값 또는 영문 라벨 (Value or English label) */}
                    {isCompleted && displayVal ? (
                      <text
                        x={nx}
                        y={ny + 8}
                        textAnchor="middle"
                        fontSize={8}
                        fill="rgba(255,255,255,0.85)"
                        className="select-none"
                      >
                        {displayVal.length > 10 ? displayVal.slice(0, 10) + '…' : displayVal}
                      </text>
                    ) : (
                      <text
                        x={nx}
                        y={ny + 8}
                        textAnchor="middle"
                        fontSize={9}
                        fill={isActive ? step.color : '#9ca3af'}
                        opacity={0.8}
                        className="select-none"
                      >
                        {step.labelEn}
                      </text>
                    )}

                    {/* KOR: 클릭 힌트 (Click hint) */}
                    {state === 'idle' && !showResult && (
                      <text
                        x={nx}
                        y={ny + 22}
                        textAnchor="middle"
                        fontSize={8}
                        fill="#9ca3af"
                        className="select-none"
                      >
                        탭하여 입력
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* KOR: 활성 노드 입력 패널 (Active node input panel) */}
          {activeNode && !showResult && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20 max-h-64 overflow-y-auto">
              {(() => {
                const step = STEPS.find((s) => s.key === activeNode);
                if (!step) return null;

                return (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">{step.label}</span>
                        <span className="text-gray-400 text-xs ml-1.5">({step.labelEn})</span>
                      </div>
                    </div>

                    {/* KOR: 국적 선택 (Nationality selection) */}
                    {activeNode === 'nationality' && (
                      <div className="grid grid-cols-3 gap-2">
                        {popularCountries.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => handleSelect('nationality', c.name)}
                            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                              inputData.nationality === c.name
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700'
                            }`}
                          >
                            <span className="text-base">{c.flag}</span>
                            <span className="text-xs">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* KOR: 나이 입력 (Age input) */}
                    {activeNode === 'age' && (
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={15}
                          max={80}
                          value={ageInput}
                          onChange={(e) => setAgeInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAgeConfirm(); }}
                          placeholder="나이를 입력하세요 (e.g. 25)"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={handleAgeConfirm}
                          className="px-4 py-2.5 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                        >
                          확인
                        </button>
                      </div>
                    )}

                    {/* KOR: 학력 선택 (Education selection) */}
                    {activeNode === 'educationLevel' && (
                      <div className="flex flex-wrap gap-2">
                        {educationOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSelect('educationLevel', opt)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                              inputData.educationLevel === opt
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* KOR: 연간 자금 선택 (Annual fund selection) */}
                    {activeNode === 'availableAnnualFund' && (
                      <div className="flex flex-wrap gap-2">
                        {fundOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSelect('availableAnnualFund', opt)}
                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                              inputData.availableAnnualFund === opt
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* KOR: 최종 목표 선택 (Final goal selection) */}
                    {activeNode === 'finalGoal' && (
                      <div className="flex flex-col gap-2">
                        {goalOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSelect('finalGoal', opt)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 text-left ${
                              inputData.finalGoal === opt
                                ? 'border-violet-500 bg-violet-50 text-violet-700'
                                : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-700'
                            }`}
                          >
                            <ChevronRight size={14} className={inputData.finalGoal === opt ? 'text-violet-500' : 'text-gray-400'} />
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* KOR: 우선순위 선택 (Priority selection) */}
                    {activeNode === 'priorityPreference' && (
                      <div className="grid grid-cols-2 gap-2">
                        {priorityOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSelect('priorityPreference', opt)}
                            className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 text-center ${
                              inputData.priorityPreference === opt
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* KOR: 진단 버튼 (모든 노드 완료 시) / ENG: Diagnose button (all nodes complete) */}
          {allCompleted && !showResult && !activeNode && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={handleDiagnose}
                className="flex items-center gap-2.5 px-8 py-3.5 bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <TrendingUp size={20} />
                비자 경로 진단하기
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* KOR: 우측 결과 패널 (Right result panel) */}
        {showResult && result && (
          <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
            {/* KOR: 결과 헤더 (Result header) */}
            <div className="bg-linear-to-br from-indigo-600 to-purple-700 px-5 py-4 shrink-0">
              <h2 className="text-white font-bold text-base">진단 결과</h2>
              <p className="text-indigo-200 text-xs mt-0.5">Visa Pathway Analysis Results</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
                  <div className="text-white font-bold text-lg">{result.pathways.length}</div>
                  <div className="text-indigo-200 text-xs">추천 경로</div>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
                  <div className="text-white font-bold text-lg">{result.pathways[0]?.feasibilityScore ?? 0}점</div>
                  <div className="text-indigo-200 text-xs">최고 적합도</div>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-300" />
                  <div className="text-white text-xs font-medium">분석 완료</div>
                </div>
              </div>
            </div>

            {/* KOR: 경로 목록 (Pathway list) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {result.pathways.map((pathway, idx) => {
                const isExpanded = expandedPathway === pathway.id;
                // KOR: 비용을 USD에서 원으로 근사 변환 (1 USD ≈ 1,350원)
                // ENG: Approximate conversion from USD to KRW (1 USD ≈ 1,350 KRW)
                const costKRW = Math.round(((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0) * 1350);
                const costDisplay = costKRW >= 10000000
                  ? `${(costKRW / 10000000).toFixed(1)}천만원`
                  : costKRW >= 10000
                  ? `${Math.round(costKRW / 10000)}만원`
                  : `${costKRW.toLocaleString()}원`;

                return (
                  <div
                    key={pathway.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* KOR: 경로 카드 헤더 (Pathway card header) */}
                    <button
                      onClick={() => setExpandedPathway(isExpanded ? null : pathway.id)}
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getBadgeBg(pathway.feasibilityLabel)}`}>
                              {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">{pathway.name}</h3>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-2xl font-black ${getScoreTextColor(pathway.feasibilityScore)}`}>
                            {pathway.feasibilityScore}
                          </div>
                          <div className="text-xs text-gray-400">/ 100</div>
                        </div>
                      </div>

                      {/* KOR: 적합도 바 (Feasibility bar) */}
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getScoreColor(pathway.feasibilityLabel)}`}
                          style={{ width: `${pathway.feasibilityScore}%` }}
                        />
                      </div>

                      {/* KOR: 간단 통계 (Quick stats) */}
                      <div className="mt-2.5 flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {pathway.totalDurationMonths}개월
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={11} />
                          ~{costDisplay}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="flex items-center gap-1">
                          <Layers size={11} />
                          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계
                        </span>
                      </div>
                    </button>

                    {/* KOR: 경로 상세 내용 (펼침) / ENG: Pathway detail content (expanded) */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 pb-4 space-y-3">
                        {/* KOR: 설명 (Description) */}
                        <p className="text-xs text-gray-600 pt-3 leading-relaxed">{pathway.description}</p>

                        {/* KOR: 비자 체인 (Visa chain) */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1.5">비자 경로 체인 (Visa Chain)</p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, vIdx) => (
                              <React.Fragment key={vIdx}>
                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1.5 text-center">
                                  <div className="text-xs font-bold text-indigo-700">{v.visa}</div>
                                  <div className="text-[10px] text-indigo-400">{v.duration}</div>
                                </div>
                                {vIdx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                                  <ArrowRight size={12} className="text-gray-400 shrink-0" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* KOR: 마일스톤 (Milestones) */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1.5">주요 마일스톤 (Milestones)</p>
                          <div className="space-y-2">
                            {pathway.milestones.map((m, mIdx) => (
                              <div key={mIdx} className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm">
                                  {m.emoji}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-800">{m.title}</p>
                                  <p className="text-[11px] text-gray-500 leading-relaxed">{m.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* KOR: 다음 단계 (Next steps) */}
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-indigo-700 mb-1">다음 단계 (Next Steps)</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-1.5 text-[11px] text-indigo-600">
                              <Circle size={5} className="shrink-0 fill-indigo-400 text-indigo-400" />
                              전문 상담사와 상세 계획 수립
                            </li>
                            <li className="flex items-center gap-1.5 text-[11px] text-indigo-600">
                              <Circle size={5} className="shrink-0 fill-indigo-400 text-indigo-400" />
                              필요 서류 목록 확인 및 준비
                            </li>
                            <li className="flex items-center gap-1.5 text-[11px] text-indigo-600">
                              <Circle size={5} className="shrink-0 fill-indigo-400 text-indigo-400" />
                              잡차자에서 관련 채용공고 탐색
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* KOR: 하단 액션 (Bottom actions) */}
            <div className="p-4 border-t border-gray-200 bg-white shrink-0 space-y-2">
              <button className="w-full py-3 bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                전문 상담 신청하기
              </button>
              <button
                onClick={handleReset}
                className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
              >
                다시 진단하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* KOR: 하단 입력 가이드 바 (Bottom input guide bar) */}
      {!showResult && (
        <div className="bg-white border-t border-gray-100 px-6 py-2.5 flex items-center gap-4 shrink-0">
          <span className="text-xs text-gray-400 font-medium">노드를 클릭하여 정보를 입력하세요 · Click a node to enter information</span>
          <div className="flex items-center gap-2 ml-auto">
            {STEPS.map((s) => {
              const state = getNodeState(s.key);
              return (
                <button
                  key={s.key}
                  onClick={() => handleNodeClick(s.key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 border ${
                    state === 'completed'
                      ? 'border-transparent text-white'
                      : state === 'active'
                      ? 'border-current bg-white'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                  }`}
                  style={{
                    backgroundColor: state === 'completed' ? s.color : undefined,
                    color: state === 'active' ? s.color : undefined,
                    borderColor: state === 'active' ? s.color : undefined,
                  }}
                >
                  {state === 'completed' ? <CheckCircle size={11} /> : null}
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
