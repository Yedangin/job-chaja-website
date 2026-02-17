'use client';

// 날씨 예보 스타일 비자 진단 페이지 (디자인 #40)
// Weather Forecast style visa diagnosis page (Design #40)

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
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Droplets,
  Eye,
  Gauge,
  Star,
  ArrowRight,
  RefreshCw,
  Navigation,
  Compass,
  Umbrella,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart2,
} from 'lucide-react';

// ============================================================
// 날씨 아이콘 매핑 유틸 / Weather icon mapping utility
// 점수에 따라 날씨 아이콘, 레이블, 색상 반환
// Returns weather icon, label, and color based on score
// ============================================================
function getWeatherData(score: number): {
  icon: React.ReactNode;
  labelKo: string;
  labelEn: string;
  bgFrom: string;
  bgTo: string;
  textColor: string;
  borderColor: string;
  tempDisplay: string;
} {
  if (score >= 60) {
    return {
      icon: <Sun className="w-8 h-8 text-yellow-300" />,
      labelKo: '맑음 — 최적 경로',
      labelEn: 'Sunny — Best Path',
      bgFrom: 'from-sky-400',
      bgTo: 'to-blue-600',
      textColor: 'text-yellow-300',
      borderColor: 'border-yellow-300/40',
      tempDisplay: `${score}°`,
    };
  }
  if (score >= 40) {
    return {
      icon: <Cloud className="w-8 h-8 text-white" />,
      labelKo: '구름 조금 — 양호',
      labelEn: 'Partly Cloudy — Good',
      bgFrom: 'from-sky-500',
      bgTo: 'to-blue-700',
      textColor: 'text-white',
      borderColor: 'border-white/30',
      tempDisplay: `${score}°`,
    };
  }
  if (score >= 20) {
    return {
      icon: <CloudRain className="w-8 h-8 text-blue-200" />,
      labelKo: '흐리고 비 — 도전적',
      labelEn: 'Rainy — Challenging',
      bgFrom: 'from-slate-500',
      bgTo: 'to-blue-800',
      textColor: 'text-blue-200',
      borderColor: 'border-blue-200/30',
      tempDisplay: `${score}°`,
    };
  }
  return {
    icon: <CloudSnow className="w-8 h-8 text-blue-100" />,
    labelKo: '눈/폭풍 — 매우 어려움',
    labelEn: 'Storm — Very Difficult',
    bgFrom: 'from-slate-600',
    bgTo: 'to-gray-900',
    textColor: 'text-blue-100',
    borderColor: 'border-blue-100/20',
    tempDisplay: `${score}°`,
  };
}

// ============================================================
// 입력 단계 타입 / Input step type
// ============================================================
type InputStep =
  | 'nationality'
  | 'age'
  | 'educationLevel'
  | 'availableAnnualFund'
  | 'finalGoal'
  | 'priorityPreference'
  | 'results';

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis40Page() {
  // 현재 입력 단계 / Current input step
  const [step, setStep] = useState<InputStep>('nationality');

  // 사용자 입력 상태 / User input state
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });

  // 선택된 경로 상세 / Selected pathway detail
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);

  // 펼쳐진 마일스톤 / Expanded milestone
  const [expandedMilestoneIdx, setExpandedMilestoneIdx] = useState<number | null>(null);

  // 결과 데이터 (실제 API 연동 전 목업 사용) / Result data (using mock before API integration)
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);

  // 선택된 경로 객체 / Selected pathway object
  const selectedPathway: RecommendedPathway | undefined =
    selectedPathwayId !== null
      ? result.pathways.find((p) => p.pathwayId === selectedPathwayId)
      : undefined;

  // ============================================================
  // 다음 단계로 이동 / Advance to next step
  // ============================================================
  function handleNext(field: keyof DiagnosisInput, value: string | number) {
    const updated = { ...input, [field]: value };
    setInput(updated);

    const stepOrder: InputStep[] = [
      'nationality',
      'age',
      'educationLevel',
      'availableAnnualFund',
      'finalGoal',
      'priorityPreference',
      'results',
    ];
    const currentIdx = stepOrder.indexOf(step);
    setStep(stepOrder[currentIdx + 1]);
  }

  // ============================================================
  // 처음으로 돌아가기 / Reset to start
  // ============================================================
  function handleReset() {
    setStep('nationality');
    setInput({ ...mockInput });
    setSelectedPathwayId(null);
    setExpandedMilestoneIdx(null);
  }

  // ============================================================
  // 상위 날씨 요약 (최고 점수 경로 기준) / Top weather summary based on highest score pathway
  // ============================================================
  const topPathway = result.pathways[0];
  const topWeather = getWeatherData(topPathway.finalScore);

  // ============================================================
  // 렌더: 진행 바 (입력 단계) / Render: progress bar (input steps)
  // ============================================================
  const stepLabels: Record<InputStep, string> = {
    nationality: '국적',
    age: '나이',
    educationLevel: '학력',
    availableAnnualFund: '자금',
    finalGoal: '목표',
    priorityPreference: '우선순위',
    results: '결과',
  };
  const stepOrder: InputStep[] = [
    'nationality',
    'age',
    'educationLevel',
    'availableAnnualFund',
    'finalGoal',
    'priorityPreference',
    'results',
  ];
  const currentStepIdx = stepOrder.indexOf(step);
  const progressPct = Math.round((currentStepIdx / (stepOrder.length - 1)) * 100);

  // ============================================================
  // 렌더: 입력 패널 / Render: input panel
  // ============================================================
  function renderInputPanel() {
    return (
      <div className="min-h-screen bg-linear-to-br from-sky-900 via-blue-900 to-indigo-950 flex flex-col items-center justify-start pt-8 px-4 pb-16">
        {/* 헤더 / Header */}
        <div className="w-full max-w-xl mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-5 h-5 text-sky-300" />
            <span className="text-sky-300 text-sm font-medium tracking-wider uppercase">JobChaja Visa Forecast</span>
          </div>
          <h1 className="text-white text-3xl font-bold leading-tight">
            나의 비자 날씨 예보
          </h1>
          <p className="text-sky-200 text-sm mt-1">
            Your Visa Weather Forecast — 조건을 설정하면 경로 전망을 알려드립니다
          </p>
        </div>

        {/* 진행 바 / Progress bar */}
        <div className="w-full max-w-xl mb-8">
          <div className="flex justify-between mb-1">
            {stepOrder.filter((s) => s !== 'results').map((s, idx) => (
              <span
                key={s}
                className={`text-xs ${idx <= currentStepIdx ? 'text-sky-300' : 'text-white/30'}`}
              >
                {stepLabels[s]}
              </span>
            ))}
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-sky-400 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* 입력 카드 / Input card */}
        <div className="w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
          {step === 'nationality' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-sky-300" />
                <h2 className="text-white text-lg font-semibold">국적을 선택하세요 / Select Nationality</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {popularCountries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleNext('nationality', c.code)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 text-left
                      ${input.nationality === c.code
                        ? 'bg-sky-500/40 border-sky-400 text-white'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-sky-400/50'
                      }`}
                  >
                    <span className="text-2xl">{c.flag}</span>
                    <div>
                      <div className="text-sm font-medium">{c.nameKo}</div>
                      <div className="text-xs text-white/50">{c.nameEn}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'age' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-sky-300" />
                <h2 className="text-white text-lg font-semibold">나이를 입력하세요 / Enter Your Age</h2>
              </div>
              {/* 나이 슬라이더 / Age slider */}
              <div className="mb-6">
                <div className="text-center mb-4">
                  <span className="text-6xl font-bold text-white">{input.age}</span>
                  <span className="text-white/60 text-xl ml-1">세</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={45}
                  value={input.age}
                  onChange={(e) => setInput({ ...input, age: parseInt(e.target.value, 10) })}
                  className="w-full accent-sky-400"
                />
                <div className="flex justify-between text-white/40 text-xs mt-1">
                  <span>18세</span>
                  <span>45세</span>
                </div>
              </div>
              <button
                onClick={() => handleNext('age', input.age)}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                다음 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'educationLevel' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-sky-300" />
                <h2 className="text-white text-lg font-semibold">최종 학력 / Education Level</h2>
              </div>
              <div className="flex flex-col gap-2">
                {educationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleNext('educationLevel', opt.value)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 text-left
                      ${input.educationLevel === opt.value
                        ? 'bg-sky-500/40 border-sky-400 text-white'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-sky-400/50'
                      }`}
                  >
                    <span className="text-xl w-7">{opt.emoji}</span>
                    <div>
                      <div className="text-sm font-medium">{opt.labelKo}</div>
                      <div className="text-xs text-white/50">{opt.labelEn}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'availableAnnualFund' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-sky-300" />
                <h2 className="text-white text-lg font-semibold">연간 가용 자금 / Annual Available Funds</h2>
              </div>
              <div className="flex flex-col gap-2">
                {fundOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleNext('availableAnnualFund', opt.value)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 text-left
                      ${input.availableAnnualFund === opt.value
                        ? 'bg-sky-500/40 border-sky-400 text-white'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-sky-400/50'
                      }`}
                  >
                    <span className="text-sm font-bold text-sky-300 w-16">{opt.bracket}</span>
                    <div>
                      <div className="text-sm font-medium">{opt.labelKo}</div>
                      <div className="text-xs text-white/50">{opt.labelEn}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'finalGoal' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-5 h-5 text-sky-300" />
                <h2 className="text-white text-lg font-semibold">최종 목표 / Final Goal</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleNext('finalGoal', opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200
                      ${input.finalGoal === opt.value
                        ? 'bg-sky-500/40 border-sky-400 text-white'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-sky-400/50'
                      }`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div className="text-sm font-medium text-center">{opt.labelKo}</div>
                    <div className="text-xs text-white/50 text-center">{opt.descKo}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'priorityPreference' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wind className="w-5 h-5 text-sky-300" />
                <h2 className="text-white text-lg font-semibold">우선순위 / Priority Preference</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleNext('priorityPreference', opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200
                      ${input.priorityPreference === opt.value
                        ? 'bg-sky-500/40 border-sky-400 text-white'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-sky-400/50'
                      }`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div className="text-sm font-medium text-center">{opt.labelKo}</div>
                    <div className="text-xs text-white/50 text-center">{opt.descKo}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // 렌더: 날씨 결과 페이지 / Render: weather results page
  // ============================================================
  function renderResults() {
    return (
      <div className="min-h-screen bg-linear-to-br from-sky-900 via-blue-900 to-indigo-950 pb-16">
        {/* 상단 날씨 메인 카드 / Top weather main card */}
        <div className={`bg-linear-to-br ${topWeather.bgFrom} ${topWeather.bgTo} px-6 pt-10 pb-8`}>
          <div className="max-w-xl mx-auto">
            {/* 위치/국적 / Location/nationality */}
            <div className="flex items-center gap-1 text-white/70 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              <span>
                {popularCountries.find((c) => c.code === input.nationality)?.nameKo ?? input.nationality}
                {' '}· {input.age}세 ·{' '}
                {educationOptions.find((e) => e.value === input.educationLevel)?.labelKo ?? input.educationLevel}
              </span>
            </div>

            {/* 날씨 메인 / Weather main */}
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {topWeather.icon}
                  <span className="text-7xl font-thin text-white">{topWeather.tempDisplay}</span>
                </div>
                <div className={`text-lg font-semibold ${topWeather.textColor}`}>
                  {topWeather.labelKo}
                </div>
                <div className="text-white/60 text-sm">{topWeather.labelEn}</div>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-xs mb-1">최적 경로 Best Path</div>
                <div className="text-white font-bold text-sm leading-tight">{topPathway.nameKo}</div>
                <div className="text-white/50 text-xs">{topPathway.nameEn}</div>
              </div>
            </div>

            {/* 날씨 세부 지표 / Weather detail indicators */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/20">
              <div className="flex flex-col items-center">
                <Droplets className="w-4 h-4 text-blue-200 mb-1" />
                <span className="text-white text-sm font-medium">{topPathway.estimatedMonths}개월</span>
                <span className="text-white/50 text-xs">소요기간</span>
              </div>
              <div className="flex flex-col items-center">
                <Thermometer className="w-4 h-4 text-orange-200 mb-1" />
                <span className="text-white text-sm font-medium">
                  {topPathway.estimatedCostWon > 0 ? `${(topPathway.estimatedCostWon / 100).toFixed(1)}백만` : '무료'}
                </span>
                <span className="text-white/50 text-xs">예상 비용</span>
              </div>
              <div className="flex flex-col items-center">
                <Eye className="w-4 h-4 text-green-200 mb-1" />
                <span className="text-white text-sm font-medium">{result.meta.totalPathwaysEvaluated}개</span>
                <span className="text-white/50 text-xs">분석 경로</span>
              </div>
            </div>
          </div>
        </div>

        {/* 주간 예보 스타일 경로 목록 / Weekly forecast style pathway list */}
        <div className="max-w-xl mx-auto px-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-sm flex items-center gap-1">
              <BarChart2 className="w-4 h-4 text-sky-300" />
              5일 비자 예보 / 5-Path Visa Forecast
            </h2>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-sky-300 text-xs hover:text-sky-200 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              다시 분석
            </button>
          </div>

          {/* 경로 카드 목록 / Pathway card list */}
          <div className="flex flex-col gap-2 mb-6">
            {result.pathways.map((pathway, idx) => {
              const weather = getWeatherData(pathway.finalScore);
              const isSelected = selectedPathwayId === pathway.pathwayId;
              return (
                <button
                  key={pathway.pathwayId}
                  onClick={() =>
                    setSelectedPathwayId(isSelected ? null : pathway.pathwayId)
                  }
                  className={`w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden
                    ${isSelected
                      ? `bg-linear-to-r ${weather.bgFrom} ${weather.bgTo} border-white/30`
                      : 'bg-white/8 border-white/10 hover:bg-white/12 hover:border-sky-400/30'
                    }`}
                >
                  {/* 요약 행 / Summary row */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* 날 번호 / Day number */}
                    <div className="text-white/40 text-xs w-5 text-center font-mono">
                      {idx + 1}일
                    </div>

                    {/* 날씨 아이콘 / Weather icon */}
                    <div className="shrink-0">
                      {idx === 0 && <Sun className="w-5 h-5 text-yellow-300" />}
                      {idx === 1 && <Cloud className="w-5 h-5 text-slate-300" />}
                      {idx === 2 && <CloudRain className="w-5 h-5 text-blue-300" />}
                      {idx === 3 && <CloudRain className="w-5 h-5 text-slate-400" />}
                      {idx === 4 && <CloudSnow className="w-5 h-5 text-blue-200" />}
                    </div>

                    {/* 경로 이름 / Pathway name */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{pathway.nameKo}</div>
                      <div className="text-white/50 text-xs truncate">{pathway.visaChain}</div>
                    </div>

                    {/* 점수 온도계 / Score thermometer */}
                    <div className="shrink-0 text-right">
                      <div
                        className="text-base font-bold"
                        style={{ color: getScoreColor(pathway.finalScore) }}
                      >
                        {pathway.finalScore}°
                      </div>
                      <div className="text-white/40 text-xs">{pathway.estimatedMonths}개월</div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-white/30 shrink-0 transition-transform duration-200 ${isSelected ? 'rotate-90' : ''}`}
                    />
                  </div>

                  {/* 온도 바 / Temperature bar */}
                  <div className="px-4 pb-2">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(pathway.finalScore, 100)}%`,
                          backgroundColor: getScoreColor(pathway.finalScore),
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 선택된 경로 상세 — 레이더맵 스타일 / Selected pathway detail — radar map style */}
          {selectedPathway && (
            <PathwayDetailCard
              pathway={selectedPathway}
              expandedMilestoneIdx={expandedMilestoneIdx}
              setExpandedMilestoneIdx={setExpandedMilestoneIdx}
            />
          )}

          {/* 재분석 버튼 / Re-diagnose button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white text-sm font-medium transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              조건 변경 후 재분석 / Re-diagnose with new conditions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return step === 'results' ? renderResults() : renderInputPanel();
}

// ============================================================
// 경로 상세 카드 컴포넌트 / Pathway detail card component
// 레이더맵 + 주간 상세 예보 스타일
// Radar map + weekly detail forecast style
// ============================================================
interface PathwayDetailCardProps {
  pathway: RecommendedPathway;
  expandedMilestoneIdx: number | null;
  setExpandedMilestoneIdx: (idx: number | null) => void;
}

function PathwayDetailCard({
  pathway,
  expandedMilestoneIdx,
  setExpandedMilestoneIdx,
}: PathwayDetailCardProps) {
  const weather = getWeatherData(pathway.finalScore);

  // 점수 분해 레이더 데이터 / Score breakdown radar data
  const radarItems: { label: string; value: number; max: number; icon: React.ReactNode; color: string }[] = [
    {
      label: '기본 점수',
      value: pathway.scoreBreakdown.base,
      max: 100,
      icon: <Gauge className="w-3 h-3" />,
      color: '#60a5fa',
    },
    {
      label: '나이 계수',
      value: Math.round(pathway.scoreBreakdown.ageMultiplier * 100),
      max: 100,
      icon: <Calendar className="w-3 h-3" />,
      color: '#34d399',
    },
    {
      label: '국적 계수',
      value: Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100),
      max: 100,
      icon: <MapPin className="w-3 h-3" />,
      color: '#f59e0b',
    },
    {
      label: '자금 계수',
      value: Math.round(pathway.scoreBreakdown.fundMultiplier * 100),
      max: 100,
      icon: <DollarSign className="w-3 h-3" />,
      color: '#a78bfa',
    },
    {
      label: '학력 계수',
      value: Math.round(pathway.scoreBreakdown.educationMultiplier * 100),
      max: 100,
      icon: <Star className="w-3 h-3" />,
      color: '#f472b6',
    },
    {
      label: '우선순위',
      value: Math.round(pathway.scoreBreakdown.priorityWeight * 100),
      max: 100,
      icon: <TrendingUp className="w-3 h-3" />,
      color: '#fb923c',
    },
  ];

  return (
    <div className={`rounded-3xl border ${weather.borderColor} bg-linear-to-br ${weather.bgFrom}/30 ${weather.bgTo}/20 backdrop-blur-sm overflow-hidden mb-4`}>
      {/* 상단 헤더 / Top header */}
      <div className={`bg-linear-to-r ${weather.bgFrom} ${weather.bgTo} px-5 py-4`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getFeasibilityEmoji(pathway.feasibilityLabel)}
              <span className="text-white/80 text-xs">{pathway.feasibilityLabel}</span>
            </div>
            <h3 className="text-white text-lg font-bold">{pathway.nameKo}</h3>
            <p className="text-white/70 text-sm">{pathway.nameEn}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-thin text-white">{pathway.finalScore}°</div>
            <div className="text-white/60 text-xs">적합도 점수</div>
          </div>
        </div>

        {/* 비자 체인 태그 / Visa chain tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {pathway.visaChain.split(' → ').map((visa, i, arr) => (
            <React.Fragment key={`${visa}-${i}`}>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-white text-xs font-mono">
                {visa}
              </span>
              {i < arr.length - 1 && (
                <ArrowRight className="w-3 h-3 text-white/50 self-center" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 기상 지표 / Weather indicators */}
      <div className="grid grid-cols-3 gap-0 border-b border-white/10">
        <div className="flex flex-col items-center py-3 border-r border-white/10">
          <Clock className="w-4 h-4 text-sky-300 mb-1" />
          <span className="text-white text-sm font-semibold">{pathway.estimatedMonths}개월</span>
          <span className="text-white/50 text-xs">소요기간</span>
        </div>
        <div className="flex flex-col items-center py-3 border-r border-white/10">
          <DollarSign className="w-4 h-4 text-green-300 mb-1" />
          <span className="text-white text-sm font-semibold">
            {pathway.estimatedCostWon > 0
              ? `${(pathway.estimatedCostWon / 100).toFixed(0)}백만원`
              : '무료'}
          </span>
          <span className="text-white/50 text-xs">예상 비용</span>
        </div>
        <div className="flex flex-col items-center py-3">
          <Zap className="w-4 h-4 text-yellow-300 mb-1" />
          <span className="text-white text-sm font-semibold">{pathway.finalScore}점</span>
          <span className="text-white/50 text-xs">최종 점수</span>
        </div>
      </div>

      {/* 레이더 맵 스타일 점수 분해 / Radar map style score breakdown */}
      <div className="px-5 py-4">
        <h4 className="text-white/70 text-xs font-medium mb-3 flex items-center gap-1">
          <BarChart2 className="w-3 h-3" />
          기상 지수 분석 / Weather Index Analysis
        </h4>
        <div className="flex flex-col gap-2">
          {radarItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-20 shrink-0" style={{ color: item.color }}>
                {item.icon}
                <span className="text-xs text-white/60 truncate">{item.label}</span>
              </div>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(item.value, 100)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className="text-xs text-white/60 w-8 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 마일스톤 — 주간 상세 예보 스타일 / Milestones — weekly detail forecast style */}
      <div className="px-5 pb-4">
        <h4 className="text-white/70 text-xs font-medium mb-3 flex items-center gap-1">
          <Navigation className="w-3 h-3" />
          경로 상세 예보 / Detailed Path Forecast
        </h4>
        <div className="flex flex-col gap-2">
          {pathway.milestones.map((m, idx) => {
            const isExpanded = expandedMilestoneIdx === idx;
            return (
              <div key={m.order} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedMilestoneIdx(isExpanded ? null : idx)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
                >
                  {/* 월 표시 / Month display */}
                  <div className="shrink-0 w-12 text-center">
                    <div className="text-sky-300 text-xs font-mono">{m.monthFromStart}M</div>
                  </div>

                  {/* 날씨 마일스톤 아이콘 / Weather milestone icon */}
                  <div className="shrink-0">
                    {m.type === 'entry' && <Navigation className="w-4 h-4 text-green-300" />}
                    {m.type === 'part_time_unlock' && <Zap className="w-4 h-4 text-yellow-300" />}
                    {m.type === 'study_upgrade' && <Star className="w-4 h-4 text-purple-300" />}
                    {m.type === 'part_time_expand' && <TrendingUp className="w-4 h-4 text-blue-300" />}
                    {m.type === 'graduation' && <CheckCircle className="w-4 h-4 text-emerald-300" />}
                    {m.type === 'final_goal' && <Sun className="w-4 h-4 text-yellow-300" />}
                    {m.type === 'waiting' && <Clock className="w-4 h-4 text-slate-300" />}
                    {m.type === 'application' && <Umbrella className="w-4 h-4 text-sky-300" />}
                    {!['entry','part_time_unlock','study_upgrade','part_time_expand','graduation','final_goal','waiting','application'].includes(m.type) && (
                      <AlertCircle className="w-4 h-4 text-orange-300" />
                    )}
                  </div>

                  {/* 이름 / Name */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{m.nameKo}</div>
                    {m.visaStatus && m.visaStatus !== 'none' && (
                      <span className="text-xs font-mono text-sky-300">{m.visaStatus}</span>
                    )}
                  </div>

                  {/* 소득 / Income */}
                  {m.estimatedMonthlyIncome > 0 && (
                    <div className="shrink-0 text-right">
                      <div className="text-green-300 text-xs font-medium">
                        +{m.estimatedMonthlyIncome}만
                      </div>
                      <div className="text-white/40 text-xs">월수입</div>
                    </div>
                  )}

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
                  )}
                </button>

                {/* 펼쳐진 상세 / Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-3 pt-1 border-t border-white/10">
                    {m.requirements && (
                      <div className="mb-2">
                        <div className="text-white/50 text-xs mb-1">필요 조건 / Requirements</div>
                        <div className="text-white/80 text-xs">{m.requirements}</div>
                      </div>
                    )}
                    {m.canWorkPartTime && (
                      <div className="flex items-center gap-1 text-green-300 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        주 {m.weeklyHours}시간 아르바이트 가능 / Part-time {m.weeklyHours}h/week allowed
                      </div>
                    )}
                    {m.platformAction && m.platformAction !== 'info_only' && (
                      <div className="mt-2 text-sky-300 text-xs flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        잡차자 지원: {m.platformAction.replace(/_/g, ' ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 다음 단계 / Next steps */}
      {pathway.nextSteps.length > 0 && (
        <div className="px-5 pb-5">
          <h4 className="text-white/70 text-xs font-medium mb-3 flex items-center gap-1">
            <Wind className="w-3 h-3" />
            지금 바로 할 일 / Action Items
          </h4>
          <div className="flex flex-col gap-2">
            {pathway.nextSteps.map((ns, i) => (
              <div
                key={`${ns.actionType}-${i}`}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3"
              >
                <div className="shrink-0 w-6 h-6 rounded-full bg-sky-500/30 border border-sky-400/40 flex items-center justify-center text-xs text-sky-300 font-bold">
                  {i + 1}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{ns.nameKo}</div>
                  <div className="text-white/50 text-xs mt-0.5">{ns.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 비고 / Note */}
          {pathway.note && (
            <div className="mt-3 flex items-start gap-2 bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
              <span className="text-yellow-200/80 text-xs">{pathway.note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
