'use client';

// 과학 실험실 테마 비자 진단 페이지 / Science Lab theme visa diagnosis page
// Design #39: 변수 조절 패널 + 실시간 시뮬레이션 / Variable control panel + real-time simulation

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
  FlaskConical,
  Atom,
  Microscope,
  BarChart3,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  Beaker,
  Activity,
  Zap,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Play,
  FileText,
  Globe,
  GraduationCap,
  Target,
  Gauge,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

interface ExperimentLog {
  time: string;
  variable: string;
  value: string;
}

// ============================================================
// 상수 / Constants
// ============================================================

const STEPS: { key: StepKey; labelKo: string; labelEn: string; icon: React.ReactNode }[] = [
  { key: 'nationality', labelKo: '국적 변수', labelEn: 'Nationality Variable', icon: <Globe size={14} /> },
  { key: 'age', labelKo: '연령 변수', labelEn: 'Age Variable', icon: <Atom size={14} /> },
  { key: 'educationLevel', labelKo: '학력 변수', labelEn: 'Education Variable', icon: <GraduationCap size={14} /> },
  { key: 'availableAnnualFund', labelKo: '자금 변수', labelEn: 'Fund Variable', icon: <DollarSign size={14} /> },
  { key: 'finalGoal', labelKo: '목표 변수', labelEn: 'Goal Variable', icon: <Target size={14} /> },
  { key: 'priorityPreference', labelKo: '우선순위 변수', labelEn: 'Priority Variable', icon: <Gauge size={14} /> },
];

// ============================================================
// 점수 바 컴포넌트 / Score bar component
// ============================================================

function ScoreBar({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  // 점수 비율 계산 / Calculate score ratio
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const color = getScoreColor(score);

  return (
    <div className="w-full bg-blue-50 rounded-full h-2 overflow-hidden border border-blue-100">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ============================================================
// 실험 로그 항목 / Experiment log item
// ============================================================

function LogEntry({ entry }: { entry: ExperimentLog }) {
  return (
    <div className="flex items-start gap-2 py-1 border-b border-blue-50 last:border-0">
      {/* 타임스탬프 / Timestamp */}
      <span className="text-blue-400 font-mono text-xs shrink-0 mt-0.5">[{entry.time}]</span>
      {/* 변수명 / Variable name */}
      <span className="text-cyan-600 font-mono text-xs shrink-0">{entry.variable}:</span>
      {/* 값 / Value */}
      <span className="text-gray-700 font-mono text-xs">{entry.value}</span>
    </div>
  );
}

// ============================================================
// 비자 체인 표시 / Visa chain display
// ============================================================

function VisaChainDisplay({ chain }: { chain: string }) {
  // 화살표로 분리된 비자 코드 파싱 / Parse visa codes separated by arrows
  const parts = chain.split(' → ').map((s) => s.trim());

  return (
    <div className="flex items-center flex-wrap gap-1">
      {parts.map((visa, idx) => (
        <React.Fragment key={idx}>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono text-xs font-semibold border border-blue-200">
            {visa}
          </span>
          {idx < parts.length - 1 && (
            <ArrowRight size={10} className="text-blue-400 shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ============================================================
// 경로 카드 (결과 보고서) / Pathway card (result report)
// ============================================================

function PathwayResultCard({ pathway, rank }: { pathway: RecommendedPathway; rank: number }) {
  const [expanded, setExpanded] = useState(rank === 0);

  // 실현 가능성 색상 매핑 / Feasibility color mapping
  const feasibilityColors: Record<string, string> = {
    '높음': 'text-green-600 bg-green-50 border-green-200',
    '보통': 'text-blue-600 bg-blue-50 border-blue-200',
    '낮음': 'text-amber-600 bg-amber-50 border-amber-200',
    '매우낮음': 'text-red-500 bg-red-50 border-red-200',
  };
  const feasClass = feasibilityColors[pathway.feasibilityLabel] ?? 'text-gray-600 bg-gray-50 border-gray-200';
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);
  const scoreColor = getScoreColor(pathway.finalScore);

  // 만원 단위를 읽기 쉽게 변환 / Convert 만원 unit to readable format
  const costLabel = pathway.estimatedCostWon === 0
    ? '무료'
    : pathway.estimatedCostWon >= 1000
      ? `${(pathway.estimatedCostWon / 100).toFixed(0)}백만원`
      : `${pathway.estimatedCostWon}만원`;

  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* 카드 헤더 / Card header */}
      <div
        className="px-4 py-3 cursor-pointer flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)' }}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {/* 순위 배지 / Rank badge */}
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 font-mono">
          {rank + 1}
        </div>

        <div className="flex-1 min-w-0">
          {/* 경로 이름 / Pathway name */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-800 text-sm">{pathway.nameKo}</span>
            <span className="text-gray-400 text-xs">{pathway.nameEn}</span>
          </div>
          {/* 비자 체인 미리보기 / Visa chain preview */}
          <div className="mt-1">
            <VisaChainDisplay chain={pathway.visaChain} />
          </div>
        </div>

        {/* 점수 + 실현가능성 / Score + feasibility */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className="font-mono text-xl font-bold"
            style={{ color: scoreColor }}
          >
            {pathway.finalScore}
            <span className="text-xs text-gray-400 font-normal ml-0.5">pt</span>
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${feasClass}`}>
            {emoji} {pathway.feasibilityLabel}
          </span>
        </div>

        {/* 펼치기/접기 / Expand/collapse */}
        <div className="text-blue-400 shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* 카드 바디 / Card body */}
      {expanded && (
        <div className="px-4 py-4 space-y-4">
          {/* 점수 분해 차트 / Score breakdown chart */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={14} className="text-blue-500" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                점수 분해 / Score Breakdown
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: '기본 점수 Base', value: pathway.scoreBreakdown.base, max: 100 },
                { label: '연령 계수 Age', value: Math.round(pathway.scoreBreakdown.ageMultiplier * 100), max: 100 },
                { label: '국적 계수 Nationality', value: Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100), max: 100 },
                { label: '자금 계수 Fund', value: Math.round(pathway.scoreBreakdown.fundMultiplier * 100), max: 100 },
                { label: '학력 계수 Education', value: Math.round(pathway.scoreBreakdown.educationMultiplier * 100), max: 100 },
                { label: '우선순위 Priority', value: Math.round(pathway.scoreBreakdown.priorityWeight * 100), max: 100 },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">{item.label}</span>
                    <span className="text-gray-700 text-xs font-mono font-semibold">{item.value}</span>
                  </div>
                  <ScoreBar score={item.value} maxScore={item.max} />
                </div>
              ))}
            </div>
          </div>

          {/* 주요 지표 / Key metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
              <Clock size={14} className="text-blue-500 mx-auto mb-1" />
              <div className="font-mono font-bold text-blue-700 text-sm">{pathway.estimatedMonths}</div>
              <div className="text-blue-500 text-xs">개월 / months</div>
            </div>
            <div className="bg-cyan-50 rounded-lg p-2 text-center border border-cyan-100">
              <DollarSign size={14} className="text-cyan-500 mx-auto mb-1" />
              <div className="font-mono font-bold text-cyan-700 text-sm">{costLabel}</div>
              <div className="text-cyan-500 text-xs">예상 비용 / cost</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-2 text-center border border-indigo-100">
              <Activity size={14} className="text-indigo-500 mx-auto mb-1" />
              <div className="font-mono font-bold text-indigo-700 text-sm">{pathway.milestones.length}</div>
              <div className="text-indigo-500 text-xs">단계 / stages</div>
            </div>
          </div>

          {/* 마일스톤 타임라인 / Milestone timeline */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-blue-500" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                실험 단계 / Experiment Stages
              </span>
            </div>
            <div className="relative space-y-2">
              {pathway.milestones.map((ms, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {/* 타임라인 선 / Timeline line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xs">{ms.order}</span>
                    </div>
                    {idx < pathway.milestones.length - 1 && (
                      <div className="w-0.5 h-4 bg-blue-200 mt-1" />
                    )}
                  </div>
                  {/* 마일스톤 내용 / Milestone content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-800 text-xs">{ms.nameKo}</span>
                      {ms.visaStatus && ms.visaStatus !== 'none' && (
                        <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-mono text-xs border border-blue-200">
                          {ms.visaStatus}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-gray-400 text-xs">{ms.monthFromStart}M~</span>
                      {ms.canWorkPartTime && (
                        <span className="text-green-500 text-xs flex items-center gap-0.5">
                          <CheckCircle2 size={10} />
                          주{ms.weeklyHours}h 근무 가능
                        </span>
                      )}
                      {ms.estimatedMonthlyIncome > 0 && (
                        <span className="text-cyan-600 text-xs font-mono">
                          ~{ms.estimatedMonthlyIncome}만원/월
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-amber-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  즉시 실험 가능 / Immediate Actions
                </span>
              </div>
              <div className="space-y-1.5">
                {pathway.nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-amber-50 rounded-lg p-2 border border-amber-100">
                    <ArrowRight size={12} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-gray-800 text-xs font-medium">{step.nameKo}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 참고 사항 / Note */}
          {pathway.note && (
            <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
              <FileText size={12} className="text-gray-400 shrink-0 mt-0.5" />
              <span className="text-gray-500 text-xs">{pathway.note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 레이더 차트 (SVG) / Radar chart (SVG)
// ============================================================

function SimpleRadarChart({ pathway }: { pathway: RecommendedPathway }) {
  // 점수 데이터 준비 / Prepare score data
  const values = [
    { label: '가능성', val: pathway.finalScore },
    { label: '속도', val: Math.round(Math.max(0, 100 - pathway.estimatedMonths * 1.2)) },
    { label: '저비용', val: Math.round(Math.max(0, 100 - (pathway.estimatedCostWon / 50))) },
    { label: '학력', val: Math.round(pathway.scoreBreakdown.educationMultiplier * 100) },
    { label: '자금', val: Math.round(pathway.scoreBreakdown.fundMultiplier * 100) },
    { label: '국적', val: Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100) },
  ];

  const cx = 70;
  const cy = 70;
  const r = 50;
  const n = values.length;

  // 폴리곤 꼭짓점 계산 / Calculate polygon vertices
  const points = values.map((item, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const dist = (item.val / 100) * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
      lx: cx + (r + 14) * Math.cos(angle),
      ly: cy + (r + 14) * Math.sin(angle),
      label: item.label,
    };
  });

  // 배경 그리드 꼭짓점 / Background grid vertices
  const gridPoints = (ratio: number) =>
    values
      .map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        return `${cx + ratio * r * Math.cos(angle)},${cy + ratio * r * Math.sin(angle)}`;
      })
      .join(' ');

  const polyStr = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 140 140" className="w-full max-w-[140px] mx-auto">
      {/* 그리드 레이어 / Grid layers */}
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon
          key={ratio}
          points={gridPoints(ratio)}
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="0.8"
        />
      ))}
      {/* 방사선 / Radial lines */}
      {values.map((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="#bfdbfe"
            strokeWidth="0.8"
          />
        );
      })}
      {/* 데이터 영역 / Data area */}
      <polygon points={polyStr} fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="1.5" />
      {/* 꼭짓점 점 / Vertex dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#3b82f6" />
      ))}
      {/* 레이블 / Labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.lx}
          y={p.ly}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7"
          fill="#6b7280"
          fontFamily="monospace"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis39Page() {
  // 입력 상태 / Input state
  const [step, setStep] = useState<number>(0);
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);
  const [logs, setLogs] = useState<ExperimentLog[]>([]);

  // 현재 단계 정보 / Current step info
  const currentStep = STEPS[step];

  // 실험 로그 추가 / Add experiment log
  function addLog(variable: string, value: string) {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs((prev) => [{ time, variable, value }, ...prev].slice(0, 20));
  }

  // 국적 선택 / Select nationality
  function selectNationality(code: string) {
    const country = popularCountries.find((c) => c.code === code);
    setInput((prev) => ({ ...prev, nationality: code }));
    if (country) addLog('nationality', `${country.flag} ${country.nameKo}`);
  }

  // 나이 변경 / Change age
  function changeAge(val: number) {
    setInput((prev) => ({ ...prev, age: val }));
    addLog('age', `${val}세`);
  }

  // 학력 선택 / Select education
  function selectEducation(val: string) {
    const opt = educationOptions.find((e) => e.value === val);
    setInput((prev) => ({ ...prev, educationLevel: val }));
    if (opt) addLog('educationLevel', `${opt.labelKo}`);
  }

  // 자금 선택 / Select fund
  function selectFund(val: number) {
    const opt = fundOptions.find((f) => f.value === val);
    setInput((prev) => ({ ...prev, availableAnnualFund: val }));
    if (opt) addLog('availableAnnualFund', opt.labelKo);
  }

  // 목표 선택 / Select goal
  function selectGoal(val: string) {
    const opt = goalOptions.find((g) => g.value === val);
    setInput((prev) => ({ ...prev, finalGoal: val }));
    if (opt) addLog('finalGoal', `${opt.emoji} ${opt.labelKo}`);
  }

  // 우선순위 선택 / Select priority
  function selectPriority(val: string) {
    const opt = priorityOptions.find((p) => p.value === val);
    setInput((prev) => ({ ...prev, priorityPreference: val }));
    if (opt) addLog('priorityPreference', `${opt.emoji} ${opt.labelKo}`);
  }

  // 다음 단계 / Next step
  function goNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      runAnalysis();
    }
  }

  // 이전 단계 / Previous step
  function goPrev() {
    if (step > 0) setStep((s) => s - 1);
  }

  // 분석 실행 / Run analysis
  function runAnalysis() {
    setIsAnalyzing(true);
    addLog('SYSTEM', '실험 시작 — 비자 매칭 엔진 구동 중...');
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
      addLog('SYSTEM', `분석 완료 — ${mockDiagnosisResult.pathways.length}개 경로 발견`);
    }, 1800);
  }

  // 초기화 / Reset
  function reset() {
    setStep(0);
    setShowResult(false);
    setIsAnalyzing(false);
    setSelectedPathwayId(null);
    setInput({ ...mockInput });
    setLogs([]);
  }

  // 현재 선택된 경로 / Currently selected pathway
  const selectedPathway = selectedPathwayId
    ? mockDiagnosisResult.pathways.find((p) => p.pathwayId === selectedPathwayId)
    : mockDiagnosisResult.pathways[0];

  // 단계 완료 여부 / Step completion check
  function isStepComplete(idx: number): boolean {
    switch (STEPS[idx].key) {
      case 'nationality': return !!input.nationality;
      case 'age': return input.age > 0;
      case 'educationLevel': return !!input.educationLevel;
      case 'availableAnnualFund': return input.availableAnnualFund >= 0;
      case 'finalGoal': return !!input.finalGoal;
      case 'priorityPreference': return !!input.priorityPreference;
      default: return false;
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ===== 상단 헤더 / Top header ===== */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FlaskConical size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">비자 실험실</div>
              <div className="text-blue-400 text-xs font-mono">JobChaja Visa Lab v1.0</div>
            </div>
          </div>

          {/* 진행도 표시기 / Progress indicator */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step && !showResult
                    ? 'bg-blue-500 scale-125'
                    : isStepComplete(i) || showResult
                      ? 'bg-blue-300'
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {showResult && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-blue-600 text-xs bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              <RefreshCw size={12} />
              재실험
            </button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ===== 분석 중 화면 / Analyzing screen ===== */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-blue-200 animate-ping absolute inset-0" />
              <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-400 flex items-center justify-center relative">
                <Microscope size={32} className="text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-blue-700 text-lg font-bold">실험 진행 중...</div>
              <div className="text-gray-400 text-sm mt-1 font-mono">
                14개 Evaluator × 31개 비자 분석 중
              </div>
            </div>
            {/* 로딩 바 / Loading bar */}
            <div className="w-64 bg-blue-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '75%' }} />
            </div>
          </div>
        )}

        {/* ===== 결과 화면 / Result screen ===== */}
        {!isAnalyzing && showResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 왼쪽: 입력 요약 + 레이더 / Left: input summary + radar */}
            <div className="lg:col-span-1 space-y-4">
              {/* 실험 변수 요약 / Experiment variables summary */}
              <div className="bg-white border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Beaker size={16} className="text-blue-500" />
                  <span className="font-bold text-gray-700 text-sm">실험 변수 요약</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Nationality', value: popularCountries.find((c) => c.code === input.nationality)?.nameKo ?? input.nationality },
                    { label: 'Age', value: `${input.age}세` },
                    { label: 'Education', value: educationOptions.find((e) => e.value === input.educationLevel)?.labelKo ?? input.educationLevel },
                    { label: 'Fund', value: fundOptions.find((f) => f.value === input.availableAnnualFund)?.labelKo ?? `${input.availableAnnualFund}만원` },
                    { label: 'Goal', value: goalOptions.find((g) => g.value === input.finalGoal)?.labelKo ?? input.finalGoal },
                    { label: 'Priority', value: priorityOptions.find((p) => p.value === input.priorityPreference)?.labelKo ?? input.priorityPreference },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-blue-400 font-mono text-xs">{row.label}</span>
                      <span className="text-gray-700 text-xs font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 레이더 차트 / Radar chart */}
              {selectedPathway && (
                <div className="bg-white border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={16} className="text-blue-500" />
                    <span className="font-bold text-gray-700 text-sm">적합도 레이더</span>
                  </div>
                  <SimpleRadarChart pathway={selectedPathway} />
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-400 font-mono">{selectedPathway.nameEn}</span>
                  </div>
                </div>
              )}

              {/* 경로 선택 목록 / Pathway select list */}
              <div className="bg-white border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 size={16} className="text-blue-500" />
                  <span className="font-bold text-gray-700 text-sm">경로 선택</span>
                </div>
                <div className="space-y-1.5">
                  {mockDiagnosisResult.pathways.map((p, i) => (
                    <button
                      key={p.pathwayId}
                      onClick={() => setSelectedPathwayId(p.pathwayId)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                        (selectedPathwayId === p.pathwayId) || (!selectedPathwayId && i === 0)
                          ? 'bg-blue-100 border border-blue-300'
                          : 'hover:bg-blue-50 border border-transparent'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 font-mono">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 text-xs truncate">{p.nameKo}</span>
                      <span
                        className="ml-auto font-mono text-xs font-bold shrink-0"
                        style={{ color: getScoreColor(p.finalScore) }}
                      >
                        {p.finalScore}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 메타 정보 / Meta info */}
              <div className="bg-blue-900 rounded-xl p-4 text-white font-mono">
                <div className="text-blue-300 text-xs mb-2">실험 메타데이터</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-300">평가된 경로:</span>
                    <span>{mockDiagnosisResult.meta.totalPathwaysEvaluated}개</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-300">필터 제외:</span>
                    <span>{mockDiagnosisResult.meta.hardFilteredOut}개</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-300">최종 추천:</span>
                    <span className="text-green-400">{mockDiagnosisResult.pathways.length}개</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 결과 보고서 / Right: result report */}
            <div className="lg:col-span-2 space-y-4">
              {/* 보고서 헤더 / Report header */}
              <div className="bg-blue-600 text-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={16} />
                  <span className="font-bold text-sm">실험 결과 보고서</span>
                  <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded font-mono">
                    Report #{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-blue-100 text-xs">
                  입력된 {STEPS.length}개 변수를 기반으로 {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로를 분석하여
                  최적 {mockDiagnosisResult.pathways.length}개 비자 경로를 도출했습니다.
                </p>
              </div>

              {/* 경로 카드 목록 / Pathway card list */}
              {mockDiagnosisResult.pathways.map((pathway, rank) => (
                <PathwayResultCard key={pathway.pathwayId} pathway={pathway} rank={rank} />
              ))}
            </div>
          </div>
        )}

        {/* ===== 입력 화면 / Input screen ===== */}
        {!isAnalyzing && !showResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 왼쪽: 변수 패널 + 실험 로그 / Left: variable panel + experiment log */}
            <div className="space-y-4">
              {/* 변수 패널 / Variable panel */}
              <div className="bg-blue-900 text-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Atom size={16} className="text-blue-300" />
                  <span className="font-bold text-sm font-mono">변수 패널 / Variables</span>
                </div>
                <div className="space-y-2">
                  {STEPS.map((s, i) => (
                    <button
                      key={s.key}
                      onClick={() => setStep(i)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                        i === step
                          ? 'bg-blue-500 text-white'
                          : isStepComplete(i)
                            ? 'bg-blue-800 text-blue-200'
                            : 'bg-blue-800/60 text-blue-300/60'
                      }`}
                    >
                      <span className="shrink-0">{s.icon}</span>
                      <span className="font-mono text-xs">{s.labelEn}</span>
                      {isStepComplete(i) && (
                        <CheckCircle2 size={12} className="ml-auto text-green-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 실험 로그 / Experiment log */}
              <div className="bg-gray-900 text-white rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} className="text-green-400" />
                  <span className="font-mono text-xs text-green-400">실험 로그 / Experiment Log</span>
                </div>
                <div className="space-y-0.5 max-h-40 overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 font-mono text-xs">대기 중... / Waiting...</div>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="font-mono text-xs">
                        <span className="text-gray-400">[{log.time}] </span>
                        <span className="text-cyan-400">{log.variable}: </span>
                        <span className="text-white">{log.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 중앙 + 오른쪽: 입력 패널 / Center + right: input panel */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm">
                {/* 입력 패널 헤더 / Input panel header */}
                <div className="px-5 py-4 bg-linear-to-br from-blue-50 to-cyan-50 border-b border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {currentStep.icon}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-base">{currentStep.labelKo}</div>
                      <div className="text-blue-400 text-xs font-mono">{currentStep.labelEn}</div>
                    </div>
                    <div className="ml-auto text-blue-400 font-mono text-sm">
                      {step + 1} / {STEPS.length}
                    </div>
                  </div>
                </div>

                {/* 입력 콘텐츠 영역 / Input content area */}
                <div className="p-5 min-h-[320px]">
                  {/* 국적 선택 / Nationality selection */}
                  {currentStep.key === 'nationality' && (
                    <div>
                      <p className="text-gray-500 text-sm mb-4 font-mono">
                        # 국적 변수를 설정하세요 / Set nationality variable
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {popularCountries.map((country) => (
                          <button
                            key={country.code}
                            onClick={() => selectNationality(country.code)}
                            className={`flex flex-col items-center p-2.5 rounded-xl border-2 transition-all ${
                              input.nationality === country.code
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <span className="text-2xl mb-1">{country.flag}</span>
                            <span className="text-xs font-medium text-gray-700">{country.nameKo}</span>
                            <span className="text-xs text-gray-400 font-mono">{country.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 나이 슬라이더 / Age slider */}
                  {currentStep.key === 'age' && (
                    <div>
                      <p className="text-gray-500 text-sm mb-4 font-mono">
                        # 연령 변수를 조절하세요 / Adjust age variable
                      </p>
                      <div className="text-center mb-6">
                        <span className="font-mono text-5xl font-bold text-blue-600">{input.age}</span>
                        <span className="text-gray-400 text-lg ml-2 font-mono">세</span>
                      </div>
                      <div className="px-4">
                        <input
                          type="range"
                          min={18}
                          max={60}
                          value={input.age}
                          onChange={(e) => changeAge(Number(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-mono mt-1">
                          <span>18세</span>
                          <span>39세</span>
                          <span>60세</span>
                        </div>
                      </div>
                      {/* 나이대별 힌트 / Age range hint */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[
                          { range: '18-25', label: '청년', hint: '학업 경로 유리' },
                          { range: '26-35', label: '청장년', hint: '취업 경로 유리' },
                          { range: '36+', label: '장년', hint: '전문직 경로 유리' },
                        ].map((ag) => (
                          <div
                            key={ag.range}
                            className={`text-center p-2 rounded-lg border text-xs ${
                              (ag.range === '18-25' && input.age <= 25)
                                ? 'border-blue-400 bg-blue-50 text-blue-700'
                                : (ag.range === '26-35' && input.age >= 26 && input.age <= 35)
                                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                                  : (ag.range === '36+' && input.age >= 36)
                                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 text-gray-500'
                            }`}
                          >
                            <div className="font-bold">{ag.label}</div>
                            <div className="text-gray-400">{ag.hint}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 학력 선택 / Education selection */}
                  {currentStep.key === 'educationLevel' && (
                    <div>
                      <p className="text-gray-500 text-sm mb-4 font-mono">
                        # 학력 변수를 설정하세요 / Set education variable
                      </p>
                      <div className="space-y-2">
                        {educationOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => selectEducation(opt.value)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                              input.educationLevel === opt.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <span className="text-xl shrink-0">{opt.emoji}</span>
                            <div>
                              <div className="font-medium text-gray-800 text-sm">{opt.labelKo}</div>
                              <div className="text-gray-400 text-xs font-mono">{opt.labelEn}</div>
                            </div>
                            {input.educationLevel === opt.value && (
                              <CheckCircle2 size={16} className="ml-auto text-blue-500 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 자금 선택 / Fund selection */}
                  {currentStep.key === 'availableAnnualFund' && (
                    <div>
                      <p className="text-gray-500 text-sm mb-4 font-mono">
                        # 연간 가용 자금 변수를 설정하세요 / Set annual fund variable
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {fundOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => selectFund(opt.value)}
                            className={`px-3 py-3 rounded-xl border-2 text-left transition-all ${
                              input.availableAnnualFund === opt.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="font-bold text-gray-800 text-sm">{opt.labelKo}</div>
                            <div className="text-gray-400 text-xs font-mono">{opt.labelEn}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 목표 선택 / Goal selection */}
                  {currentStep.key === 'finalGoal' && (
                    <div>
                      <p className="text-gray-500 text-sm mb-4 font-mono">
                        # 최종 목표 변수를 설정하세요 / Set final goal variable
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {goalOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => selectGoal(opt.value)}
                            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                              input.finalGoal === opt.value
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <span className="text-3xl mb-2">{opt.emoji}</span>
                            <span className="font-bold text-gray-800 text-sm">{opt.labelKo}</span>
                            <span className="text-gray-400 text-xs font-mono mt-0.5">{opt.labelEn}</span>
                            <span className="text-gray-500 text-xs mt-1 text-center">{opt.descKo}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 우선순위 선택 / Priority selection */}
                  {currentStep.key === 'priorityPreference' && (
                    <div>
                      <p className="text-gray-500 text-sm mb-4 font-mono">
                        # 우선순위 변수를 설정하세요 / Set priority variable
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {priorityOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => selectPriority(opt.value)}
                            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                              input.priorityPreference === opt.value
                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <span className="text-3xl mb-2">{opt.emoji}</span>
                            <span className="font-bold text-gray-800 text-sm">{opt.labelKo}</span>
                            <span className="text-gray-400 text-xs font-mono mt-0.5">{opt.labelEn}</span>
                            <span className="text-gray-500 text-xs mt-1 text-center">{opt.descKo}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 하단 네비게이션 / Bottom navigation */}
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={goPrev}
                    disabled={step === 0}
                    className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
                  >
                    ← 이전
                  </button>

                  <div className="flex items-center gap-2">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === step ? 'w-6 bg-blue-500' : 'w-1.5 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {step === STEPS.length - 1 ? (
                    <button
                      onClick={runAnalysis}
                      disabled={!isStepComplete(step)}
                      className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Play size={14} />
                      실험 실행
                    </button>
                  ) : (
                    <button
                      onClick={goNext}
                      disabled={!isStepComplete(step)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-mono"
                    >
                      다음 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
