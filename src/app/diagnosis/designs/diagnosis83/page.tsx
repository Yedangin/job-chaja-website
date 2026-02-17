'use client';

// 비자 진단 - 건축 설계 테마 / Visa Diagnosis - Architecture Blueprint Theme
// 건축 도면처럼 비자 경로를 설계하고 구조화하는 UI
// UI that designs and structures visa pathways like architectural drawings
// Design #83: Architecture Blueprint — inspired by AutoCAD, SketchUp, Archicad, Revit, Matterport

import React, { useState, useCallback } from 'react';
import {
  Layers,
  Ruler,
  Grid,
  Square,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Download,
  Share2,
  Info,
  CheckCircle2,
  Circle,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react';

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

// ============================================================
// 스텝 정의 / Step definitions
// ============================================================
type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

interface StepConfig {
  key: StepKey;
  labelKo: string;
  labelEn: string;
  dimensionCode: string; // AutoCAD 치수 코드 / AutoCAD dimension code
}

const STEPS: StepConfig[] = [
  { key: 'nationality', labelKo: '국적', labelEn: 'Nationality', dimensionCode: 'NATL-01' },
  { key: 'age', labelKo: '나이', labelEn: 'Age', dimensionCode: 'AGE-02' },
  { key: 'educationLevel', labelKo: '학력', labelEn: 'Education', dimensionCode: 'EDU-03' },
  { key: 'availableAnnualFund', labelKo: '연간 자금', labelEn: 'Annual Fund', dimensionCode: 'FUND-04' },
  { key: 'finalGoal', labelKo: '최종 목표', labelEn: 'Final Goal', dimensionCode: 'GOAL-05' },
  { key: 'priorityPreference', labelKo: '우선순위', labelEn: 'Priority', dimensionCode: 'PRIO-06' },
];

// ============================================================
// 타입 / Types
// ============================================================
type DiagnosisInputState = {
  nationality: string;
  age: number | '';
  educationLevel: string;
  availableAnnualFund: number | '';
  finalGoal: string;
  priorityPreference: string;
};

// ============================================================
// 유틸리티 함수 / Utility functions
// ============================================================
function getLayerColor(index: number): { border: string; bg: string; text: string; dot: string } {
  const palette = [
    { border: 'border-blue-400', bg: 'bg-blue-900/20', text: 'text-blue-300', dot: 'bg-blue-400' },
    { border: 'border-cyan-400', bg: 'bg-cyan-900/20', text: 'text-cyan-300', dot: 'bg-cyan-400' },
    { border: 'border-indigo-400', bg: 'bg-indigo-900/20', text: 'text-indigo-300', dot: 'bg-indigo-400' },
    { border: 'border-sky-400', bg: 'bg-sky-900/20', text: 'text-sky-300', dot: 'bg-sky-400' },
    { border: 'border-violet-400', bg: 'bg-violet-900/20', text: 'text-violet-300', dot: 'bg-violet-400' },
  ];
  return palette[index % palette.length];
}

function getFeasibilityStyle(label: string): { color: string; icon: React.ReactNode } {
  switch (label) {
    case '높음':
      return { color: 'text-green-400', icon: <CheckCircle2 className="w-4 h-4" /> };
    case '보통':
      return { color: 'text-blue-400', icon: <Circle className="w-4 h-4" /> };
    case '낮음':
      return { color: 'text-yellow-400', icon: <AlertTriangle className="w-4 h-4" /> };
    default:
      return { color: 'text-red-400', icon: <XCircle className="w-4 h-4" /> };
  }
}

// ============================================================
// 하위 컴포넌트: 그리드 배경 캔버스 / Sub-component: Grid background canvas
// ============================================================
function BlueprintGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* 대형 그리드 / Large grid */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" />
          </pattern>
          <pattern id="largeGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(59,130,246,0.22)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#largeGrid)" />
        {/* 원점 마커 / Origin marker */}
        <circle cx="60" cy="60" r="4" fill="none" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
        <line x1="40" y1="60" x2="80" y2="60" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
        <line x1="60" y1="40" x2="60" y2="80" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 치수선 / Sub-component: Dimension line
// ============================================================
function DimensionLine({ code, value }: { code: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-blue-400/60 font-mono text-xs">
      {/* 왼쪽 화살표 / Left arrow */}
      <div className="flex items-center gap-0.5">
        <div className="w-2 h-px bg-blue-400/40" />
        <div className="w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-blue-400/40" />
      </div>
      <span className="text-blue-300/70 shrink-0">{code}</span>
      <div className="flex-1 border-t border-dashed border-blue-400/30" />
      <span className="text-blue-200/80 shrink-0">{value}</span>
      {/* 오른쪽 화살표 / Right arrow */}
      <div className="flex items-center gap-0.5">
        <div className="w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-blue-400/40" />
        <div className="w-2 h-px bg-blue-400/40" />
      </div>
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 도면 타이틀 블록 / Sub-component: Drawing title block
// ============================================================
function TitleBlock({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="border border-blue-400/50 bg-slate-900/80 font-mono text-xs">
      {/* 헤더 / Header */}
      <div className="bg-blue-900/40 border-b border-blue-400/50 px-3 py-1.5 flex items-center justify-between">
        <span className="text-blue-200 font-bold tracking-widest text-xs">JOBCHAJA VISA DESIGN STUDIO</span>
        <span className="text-blue-400/60">DWG #83</span>
      </div>
      {/* 메타 그리드 / Meta grid */}
      <div className="grid grid-cols-4 divide-x divide-blue-400/30">
        <div className="p-2">
          <div className="text-blue-400/60 text-[10px] uppercase tracking-wider">Project</div>
          <div className="text-blue-200 text-[11px] mt-0.5">Visa Pathway</div>
        </div>
        <div className="p-2">
          <div className="text-blue-400/60 text-[10px] uppercase tracking-wider">Scale</div>
          <div className="text-blue-200 text-[11px] mt-0.5">1:1</div>
        </div>
        <div className="p-2">
          <div className="text-blue-400/60 text-[10px] uppercase tracking-wider">Step</div>
          <div className="text-blue-200 text-[11px] mt-0.5">{currentStep}/{totalSteps}</div>
        </div>
        <div className="p-2">
          <div className="text-blue-400/60 text-[10px] uppercase tracking-wider">Date</div>
          <div className="text-blue-200 text-[11px] mt-0.5">{dateStr}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 레이어 패널 / Sub-component: Layer panel
// ============================================================
function LayerPanel({
  steps,
  currentStep,
  completedValues,
  onLayerClick,
}: {
  steps: StepConfig[];
  currentStep: number;
  completedValues: Record<string, string>;
  onLayerClick: (idx: number) => void;
}) {
  return (
    <div className="border border-blue-400/40 bg-slate-900/90 font-mono text-xs overflow-hidden">
      {/* 레이어 헤더 / Layer header */}
      <div className="bg-blue-950/60 border-b border-blue-400/40 px-3 py-2 flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-blue-300 tracking-wider uppercase text-[10px]">Layers</span>
        <span className="ml-auto text-blue-400/50 text-[10px]">{steps.length} layers</span>
      </div>
      {/* 레이어 목록 / Layer list */}
      <div>
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
          const val = completedValues[step.key] || '';
          const colors = getLayerColor(idx);

          return (
            <button
              key={step.key}
              onClick={() => onLayerClick(idx)}
              className={`w-full flex items-center gap-2 px-3 py-2 border-b border-blue-400/20 transition-all text-left
                ${isActive ? 'bg-blue-800/30' : isDone ? 'bg-slate-800/40 opacity-70 hover:opacity-90' : 'opacity-40 cursor-default'}`}
            >
              {/* 레이어 색상 도트 / Layer color dot */}
              <div className={`w-2 h-2 rounded-full shrink-0 ${isDone || isActive ? colors.dot : 'bg-slate-600'}`} />
              {/* 가시성 아이콘 / Visibility icon */}
              {isDone || isActive ? (
                <Eye className="w-3 h-3 text-blue-400/60 shrink-0" />
              ) : (
                <EyeOff className="w-3 h-3 text-slate-600 shrink-0" />
              )}
              {/* 레이어 이름 / Layer name */}
              <span className={`flex-1 text-[10px] tracking-wide uppercase ${isActive ? 'text-blue-200 font-bold' : isDone ? 'text-blue-300' : 'text-slate-600'}`}>
                {step.dimensionCode}
              </span>
              {/* 완료 값 / Done value */}
              {isDone && val && (
                <span className="text-blue-400/70 text-[10px] max-w-16 truncate">{val}</span>
              )}
              {/* 현재 활성 표시 / Current active indicator */}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 하위 컴포넌트: 경로 도면 카드 / Sub-component: Pathway blueprint card
// ============================================================
function PathwayBlueprintCard({
  pathway,
  index,
  isExpanded,
  onToggle,
}: {
  pathway: CompatPathway;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const colors = getLayerColor(index);
  const feasStyle = getFeasibilityStyle(pathway.feasibilityLabel);
  const scoreColor = getScoreColor(pathway.finalScore);

  return (
    <div className={`border ${colors.border} ${colors.bg} font-mono overflow-hidden transition-all`}>
      {/* 카드 헤더 (치수 블록 스타일) / Card header (dimension block style) */}
      <button
        onClick={onToggle}
        className="w-full flex items-stretch border-b border-blue-400/20 hover:bg-blue-900/20 transition-colors"
      >
        {/* 인덱스 열 / Index column */}
        <div className={`w-10 shrink-0 ${colors.bg} border-r border-blue-400/20 flex items-center justify-center`}>
          <span className="text-blue-400/70 text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
        </div>

        {/* 주요 정보 / Main info */}
        <div className="flex-1 px-3 py-2.5 text-left">
          {/* 치수 코드 / Dimension code */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400/50 text-[10px] tracking-widest uppercase">{pathway.pathwayId}</span>
            <div className="flex-1 border-t border-dashed border-blue-400/20" />
            <span className={`text-[10px] flex items-center gap-1 ${feasStyle.color}`}>
              {feasStyle.icon}
              {pathway.feasibilityLabel}
            </span>
          </div>
          {/* 경로명 / Pathway name */}
          <div className={`text-sm font-bold ${colors.text}`}>{pathway.nameKo}</div>
          <div className="text-blue-400/50 text-[10px] mt-0.5">{pathway.nameEn}</div>
        </div>

        {/* 점수 + 토글 / Score + toggle */}
        <div className="flex items-center gap-2 pr-3 shrink-0">
          {/* 점수 게이지 / Score gauge */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] text-blue-400/50">SCORE</span>
            <div
              className="text-lg font-bold tabular-nums"
              style={{ color: scoreColor }}
            >
              {pathway.finalScore}
            </div>
          </div>
          {/* 토글 아이콘 / Toggle icon */}
          <div className="text-blue-400/50">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* 퀵 스펙 바 / Quick spec bar */}
      <div className="flex divide-x divide-blue-400/20 text-[10px] text-blue-300/60 border-b border-blue-400/20">
        <div className="flex items-center gap-1.5 px-3 py-1.5">
          <Clock className="w-3 h-3" />
          <span>{pathway.estimatedMonths}mo</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5">
          <DollarSign className="w-3 h-3" />
          <span>{pathway.estimatedCostWon > 0 ? `${(pathway.estimatedCostWon / 100).toFixed(0)}백만` : '무료'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5">
          <Layers className="w-3 h-3" />
          <span>{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length} visa{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 ml-auto">
          <span className="text-blue-400/40">PLAT:</span>
          <span className="text-blue-300/70">{pathway.platformSupport === 'full_support' ? 'FULL' : 'INFO'}</span>
        </div>
      </div>

      {/* 비자 체인 (도면 흐름) / Visa chain (blueprint flow) */}
      <div className="px-3 py-2 flex items-center gap-1 flex-wrap">
        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, vi) => (
          <React.Fragment key={vi}>
            <span className={`px-2 py-0.5 border ${colors.border} ${colors.text} text-[11px] font-bold tracking-wider bg-slate-900/60`}>
              {v.code}
            </span>
            {vi < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
              <ArrowRight className="w-3 h-3 text-blue-400/40 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 확장 상세 / Expanded detail */}
      {isExpanded && (
        <div className="border-t border-blue-400/20">
          {/* 마일스톤 타임라인 / Milestone timeline */}
          <div className="px-3 py-2 border-b border-blue-400/10">
            <div className="text-[10px] text-blue-400/50 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              <span>Milestone Timeline — {pathway.milestones.length} nodes</span>
            </div>
            <div className="relative pl-4">
              {/* 타임라인 세로선 / Timeline vertical line */}
              <div className="absolute left-1 top-0 bottom-0 w-px bg-blue-400/20" />
              <div className="space-y-2">
                {pathway.milestones.map((ms, mi) => (
                  <div key={mi} className="flex items-start gap-2 relative">
                    {/* 노드 마커 / Node marker */}
                    <div className={`absolute -left-3 top-1 w-2 h-2 rounded-full border shrink-0 ${mi === pathway.milestones.length - 1 ? 'bg-blue-400 border-blue-400' : 'bg-slate-900 border-blue-400/50'}`} />
                    {/* 월 표시 / Month indicator */}
                    <span className="text-blue-400/50 text-[10px] tabular-nums shrink-0 w-8">M{ms.monthFromStart}</span>
                    {/* 마일스톤 내용 / Milestone content */}
                    <div className="flex-1">
                      <div className="text-blue-200/80 text-[11px]">{ms.nameKo}</div>
                      {ms.visaStatus && ms.visaStatus !== 'none' && (
                        <span className="text-[10px] text-blue-400/60">[{ms.visaStatus}]</span>
                      )}
                    </div>
                    {/* 소득 / Income */}
                    {ms.estimatedMonthlyIncome > 0 && (
                      <span className="text-[10px] text-cyan-400/70 shrink-0">
                        +{ms.estimatedMonthlyIncome}만
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 점수 분해 / Score breakdown */}
          <div className="px-3 py-2 border-b border-blue-400/10">
            <div className="text-[10px] text-blue-400/50 uppercase tracking-wider mb-2">Score Breakdown</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[
                { label: 'BASE', val: pathway.scoreBreakdown.base },
                { label: 'AGE ×', val: pathway.scoreBreakdown.ageMultiplier },
                { label: 'NATL ×', val: pathway.scoreBreakdown.nationalityMultiplier },
                { label: 'FUND ×', val: pathway.scoreBreakdown.fundMultiplier },
                { label: 'EDU ×', val: pathway.scoreBreakdown.educationMultiplier },
                { label: 'PRIO ×', val: pathway.scoreBreakdown.priorityWeight },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-blue-400/50 text-[10px]">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400/60 rounded-full"
                        style={{ width: `${Math.min(item.val * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-blue-200/70 text-[10px] tabular-nums w-8 text-right">{item.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div className="px-3 py-2">
              <div className="text-[10px] text-blue-400/50 uppercase tracking-wider mb-2">Next Actions</div>
              <div className="space-y-1">
                {pathway.nextSteps.map((ns, ni) => (
                  <div key={ni} className="flex items-start gap-2">
                    <ChevronRight className="w-3 h-3 text-blue-400/50 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-blue-200/80 text-[11px]">{ns.nameKo}</div>
                      <div className="text-blue-400/50 text-[10px]">{ns.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 참고사항 / Note */}
          {pathway.note && (
            <div className="flex items-start gap-2 mx-3 mb-2 px-2 py-1.5 border border-blue-400/20 bg-slate-900/40">
              <Info className="w-3 h-3 text-blue-400/50 shrink-0 mt-0.5" />
              <span className="text-blue-300/60 text-[10px]">{pathway.note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function DiagnosisBlueprint83Page() {
  // 현재 스텝 / Current step
  const [currentStep, setCurrentStep] = useState(0);

  // 입력 상태 / Input state
  const [inputState, setInputState] = useState<DiagnosisInputState>({
    nationality: '',
    age: '',
    educationLevel: '',
    availableAnnualFund: '',
    finalGoal: '',
    priorityPreference: '',
  });

  // 결과 표시 여부 / Whether to show results
  const [showResults, setShowResults] = useState(false);

  // 확장된 카드 ID / Expanded card IDs
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(['PW-006']));

  // 레이어 패널 표시 여부 / Whether to show layer panel
  const [showLayerPanel, setShowLayerPanel] = useState(true);

  // ============================================================
  // 완료된 값 레이블 맵핑 / Completed value label mapping
  // ============================================================
  const getValueLabel = useCallback((key: StepKey, val: string | number | ''): string => {
    if (val === '' || val === undefined) return '';
    switch (key) {
      case 'nationality': {
        const c = popularCountries.find((x) => x.code === val);
        return c ? `${c.flag} ${c.nameKo}` : String(val);
      }
      case 'age':
        return `${val}세`;
      case 'educationLevel': {
        const e = educationOptions.find((x) => x.value === val);
        return e ? e.labelKo : String(val);
      }
      case 'availableAnnualFund': {
        const f = fundOptions.find((x) => x.value === Number(val));
        return f ? f.labelKo : String(val);
      }
      case 'finalGoal': {
        const g = goalOptions.find((x) => x.value === val);
        return g ? `${g.emoji} ${g.labelKo}` : String(val);
      }
      case 'priorityPreference': {
        const p = priorityOptions.find((x) => x.value === val);
        return p ? `${p.emoji} ${p.labelKo}` : String(val);
      }
      default:
        return String(val);
    }
  }, []);

  // 완료된 레이블 맵 / Completed label map
  const completedValues: Record<string, string> = {};
  STEPS.forEach((s) => {
    const v = inputState[s.key];
    if (v !== '' && v !== undefined) {
      completedValues[s.key] = getValueLabel(s.key, v);
    }
  });

  // ============================================================
  // 다음 스텝으로 / Go to next step
  // ============================================================
  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      setShowResults(true);
    }
  }, [currentStep]);

  // ============================================================
  // 스텝 값 설정 / Set step value
  // ============================================================
  const setStepValue = useCallback((key: StepKey, value: string | number) => {
    setInputState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ============================================================
  // 현재 스텝에서 다음 가능한지 / Can go next from current step
  // ============================================================
  const canGoNext = useCallback((): boolean => {
    const key = STEPS[currentStep].key;
    const val = inputState[key];
    return val !== '' && val !== undefined;
  }, [currentStep, inputState]);

  // ============================================================
  // 카드 토글 / Toggle card
  // ============================================================
  const toggleCard = useCallback((id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // ============================================================
  // 리셋 / Reset
  // ============================================================
  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setShowResults(false);
    setInputState({
      nationality: '',
      age: '',
      educationLevel: '',
      availableAnnualFund: '',
      finalGoal: '',
      priorityPreference: '',
    });
    setExpandedCards(new Set(['PW-006']));
  }, []);

  // ============================================================
  // 현재 스텝 입력 렌더링 / Render current step input
  // ============================================================
  const renderStepInput = () => {
    const step = STEPS[currentStep];

    switch (step.key) {
      // ── 국적 / Nationality ──────────────────────────
      case 'nationality':
        return (
          <div className="space-y-2">
            <div className="text-blue-400/50 text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1">
              <Grid className="w-3 h-3" />
              <span>Select nationality — {popularCountries.length} options</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {popularCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setStepValue('nationality', c.code)}
                  className={`flex items-center gap-2 p-2.5 border transition-all text-left font-mono
                    ${inputState.nationality === c.code
                      ? 'border-blue-400 bg-blue-900/40 text-blue-200'
                      : 'border-blue-400/25 bg-slate-900/50 text-blue-300/60 hover:border-blue-400/50 hover:text-blue-300'
                    }`}
                >
                  <span className="text-lg shrink-0">{c.flag}</span>
                  <div>
                    <div className="text-xs font-bold">{c.nameKo}</div>
                    <div className="text-[10px] text-blue-400/50">{c.code}</div>
                  </div>
                  {inputState.nationality === c.code && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      // ── 나이 / Age ───────────────────────────────────
      case 'age':
        return (
          <div className="space-y-4">
            <div className="text-blue-400/50 text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              <span>Enter age — valid range: 18–65</span>
            </div>
            {/* 슬라이더 스타일 나이 입력 / Slider-style age input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-blue-400/50 text-xs">18</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-blue-200 tabular-nums">
                    {inputState.age !== '' ? inputState.age : '--'}
                  </span>
                  <span className="text-blue-400/60 text-sm">세</span>
                </div>
                <span className="text-blue-400/50 text-xs">65</span>
              </div>
              <input
                type="range"
                min={18}
                max={65}
                value={inputState.age !== '' ? Number(inputState.age) : 25}
                onChange={(e) => setStepValue('age', Number(e.target.value))}
                className="w-full h-1.5 bg-blue-900/40 rounded-full appearance-none cursor-pointer accent-blue-400"
              />
              {/* 치수 마커 / Dimension markers */}
              <div className="flex justify-between">
                {[20, 25, 30, 35, 40, 45, 50, 55, 60].map((v) => (
                  <button
                    key={v}
                    onClick={() => setStepValue('age', v)}
                    className={`text-[10px] font-mono transition-colors
                      ${Number(inputState.age) === v ? 'text-blue-300 font-bold' : 'text-blue-400/30 hover:text-blue-400/60'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            {/* 직접 입력 / Direct input */}
            <div className="flex items-center gap-2 border border-blue-400/25 bg-slate-900/50 px-3 py-2">
              <span className="text-blue-400/50 text-xs font-mono">AGE =</span>
              <input
                type="number"
                min={18}
                max={65}
                value={inputState.age !== '' ? String(inputState.age) : ''}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!isNaN(n) && n >= 18 && n <= 65) setStepValue('age', n);
                  else if (e.target.value === '') setStepValue('age', '');
                }}
                placeholder="25"
                className="flex-1 bg-transparent text-blue-200 font-mono text-sm outline-none placeholder:text-blue-400/30"
              />
              <span className="text-blue-400/50 text-xs font-mono">yrs</span>
            </div>
          </div>
        );

      // ── 학력 / Education ─────────────────────────────
      case 'educationLevel':
        return (
          <div className="space-y-2">
            <div className="text-blue-400/50 text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1">
              <Square className="w-3 h-3" />
              <span>Select education level — {educationOptions.length} options</span>
            </div>
            <div className="space-y-1.5">
              {educationOptions.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => setStepValue('educationLevel', opt.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 border transition-all font-mono text-left
                    ${inputState.educationLevel === opt.value
                      ? 'border-blue-400 bg-blue-900/40'
                      : 'border-blue-400/20 bg-slate-900/50 hover:border-blue-400/40'
                    }`}
                >
                  {/* 레벨 인덱스 / Level index */}
                  <span className="text-[10px] text-blue-400/40 w-4 shrink-0">{String(i).padStart(2, '0')}</span>
                  {/* 이모지 / Emoji */}
                  <span className="text-base shrink-0">{opt.emoji}</span>
                  {/* 레이블 / Label */}
                  <div className="flex-1">
                    <div className={`text-sm ${inputState.educationLevel === opt.value ? 'text-blue-200' : 'text-blue-300/60'}`}>
                      {opt.labelKo}
                    </div>
                    <div className="text-[10px] text-blue-400/40">{opt.labelEn}</div>
                  </div>
                  {/* 레벨 바 / Level bar */}
                  <div className="w-20 h-1 bg-slate-700 rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-full bg-blue-400/60 rounded-full"
                      style={{ width: `${((i + 1) / educationOptions.length) * 100}%` }}
                    />
                  </div>
                  {inputState.educationLevel === opt.value && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      // ── 자금 / Fund ──────────────────────────────────
      case 'availableAnnualFund':
        return (
          <div className="space-y-2">
            <div className="text-blue-400/50 text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Annual budget — select range</span>
            </div>
            <div className="space-y-1.5">
              {fundOptions.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => setStepValue('availableAnnualFund', opt.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 border transition-all font-mono text-left
                    ${inputState.availableAnnualFund === opt.value
                      ? 'border-blue-400 bg-blue-900/40'
                      : 'border-blue-400/20 bg-slate-900/50 hover:border-blue-400/40'
                    }`}
                >
                  <span className="text-[10px] text-blue-400/40 w-4 shrink-0">{String(i).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <div className={`text-sm ${inputState.availableAnnualFund === opt.value ? 'text-blue-200' : 'text-blue-300/60'}`}>
                      {opt.labelKo}
                    </div>
                    <div className="text-[10px] text-blue-400/40">{opt.labelEn}</div>
                  </div>
                  {/* 예산 바 / Budget bar */}
                  <div className="w-20 h-1 bg-slate-700 rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-full bg-cyan-400/60 rounded-full"
                      style={{ width: `${((i + 1) / fundOptions.length) * 100}%` }}
                    />
                  </div>
                  {inputState.availableAnnualFund === opt.value && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      // ── 목표 / Goal ──────────────────────────────────
      case 'finalGoal':
        return (
          <div className="space-y-2">
            <div className="text-blue-400/50 text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>Final objective — select one</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {goalOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStepValue('finalGoal', opt.value)}
                  className={`flex flex-col items-start gap-1.5 p-3 border transition-all font-mono text-left
                    ${inputState.finalGoal === opt.value
                      ? 'border-blue-400 bg-blue-900/40'
                      : 'border-blue-400/20 bg-slate-900/50 hover:border-blue-400/40'
                    }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div>
                    <div className={`text-sm font-bold ${inputState.finalGoal === opt.value ? 'text-blue-200' : 'text-blue-300/60'}`}>
                      {opt.labelKo}
                    </div>
                    <div className="text-[10px] text-blue-400/40">{opt.labelEn}</div>
                  </div>
                  <div className="text-[10px] text-blue-300/50 mt-1">{opt.descKo}</div>
                  {inputState.finalGoal === opt.value && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 self-end" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      // ── 우선순위 / Priority ──────────────────────────
      case 'priorityPreference':
        return (
          <div className="space-y-2">
            <div className="text-blue-400/50 text-[10px] uppercase tracking-wider mb-3 flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>Optimization priority — select one</span>
            </div>
            <div className="space-y-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStepValue('priorityPreference', opt.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border transition-all font-mono text-left
                    ${inputState.priorityPreference === opt.value
                      ? 'border-blue-400 bg-blue-900/40'
                      : 'border-blue-400/20 bg-slate-900/50 hover:border-blue-400/40'
                    }`}
                >
                  <span className="text-xl shrink-0">{opt.emoji}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${inputState.priorityPreference === opt.value ? 'text-blue-200' : 'text-blue-300/60'}`}>
                      {opt.labelKo}
                    </div>
                    <div className="text-[10px] text-blue-400/40">{opt.descKo}</div>
                  </div>
                  {inputState.priorityPreference === opt.value && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // 결과 페이지 렌더링 / Render results page
  // ============================================================
  if (showResults) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
        {/* 배경 그리드 / Background grid */}
        <BlueprintGrid />

        {/* 결과 헤더 / Result header */}
        <div className="relative z-10 border-b border-blue-400/30 bg-slate-900/90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* 로고 / Logo */}
            <div className="font-mono flex items-center gap-3">
              <div className="border border-blue-400/50 px-2 py-1 bg-blue-900/30">
                <span className="text-blue-300 text-xs tracking-widest font-bold">DWG</span>
                <span className="text-blue-400/50 text-xs">·83</span>
              </div>
              <div>
                <div className="text-sm text-blue-200 font-bold">VISA BLUEPRINT</div>
                <div className="text-[10px] text-blue-400/50">Architecture Design Mode</div>
              </div>
            </div>

            {/* 툴바 / Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 border border-blue-400/30 px-3 py-1.5 text-blue-400 hover:border-blue-400 hover:text-blue-300 transition-colors font-mono text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>
              <button className="flex items-center gap-1.5 border border-blue-400/30 px-3 py-1.5 text-blue-400 hover:border-blue-400 hover:text-blue-300 transition-colors font-mono text-xs">
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT</span>
              </button>
              <button className="flex items-center gap-1.5 border border-blue-400/30 px-3 py-1.5 text-blue-400 hover:border-blue-400 hover:text-blue-300 transition-colors font-mono text-xs">
                <Share2 className="w-3.5 h-3.5" />
                <span>SHARE</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 space-y-4">
          {/* 도면 타이틀 블록 / Drawing title block */}
          <TitleBlock currentStep={STEPS.length} totalSteps={STEPS.length} />

          {/* 치수 요약 (입력값) / Dimension summary (input values) */}
          <div className="border border-blue-400/30 bg-slate-900/70 font-mono">
            <div className="bg-blue-950/50 border-b border-blue-400/30 px-3 py-1.5 flex items-center gap-2">
              <Ruler className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] text-blue-300 uppercase tracking-wider">Design Specifications</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-blue-400/10 m-px">
              {STEPS.map((step) => (
                <div key={step.key} className="bg-slate-900/90 p-2.5">
                  <DimensionLine
                    code={step.dimensionCode}
                    value={completedValues[step.key] || '—'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 결과 요약 / Result summary */}
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="border border-blue-400/30 bg-slate-900/70 p-3 text-center">
              <div className="text-blue-400/50 text-[10px] uppercase tracking-wider">Evaluated</div>
              <div className="text-3xl font-bold text-blue-200 tabular-nums mt-1">
                {mockDiagnosisResult.meta.totalPathwaysEvaluated}
              </div>
              <div className="text-[10px] text-blue-400/40 mt-0.5">pathways</div>
            </div>
            <div className="border border-blue-400/30 bg-slate-900/70 p-3 text-center">
              <div className="text-blue-400/50 text-[10px] uppercase tracking-wider">Matched</div>
              <div className="text-3xl font-bold text-blue-300 tabular-nums mt-1">
                {mockDiagnosisResult.pathways.length}
              </div>
              <div className="text-[10px] text-blue-400/40 mt-0.5">recommended</div>
            </div>
            <div className="border border-blue-400/30 bg-slate-900/70 p-3 text-center">
              <div className="text-blue-400/50 text-[10px] uppercase tracking-wider">Filtered</div>
              <div className="text-3xl font-bold text-red-400/70 tabular-nums mt-1">
                {mockDiagnosisResult.meta.hardFilteredOut}
              </div>
              <div className="text-[10px] text-blue-400/40 mt-0.5">excluded</div>
            </div>
          </div>

          {/* 결과 카드 목록 / Result card list */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400/50 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Recommended Pathways — {mockPathways.length} designs</span>
              <div className="flex-1 border-t border-dashed border-blue-400/20" />
              <button
                onClick={() => setExpandedCards(new Set(mockPathways.map((p) => p.pathwayId)))}
                className="hover:text-blue-300 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setExpandedCards(new Set())}
                className="hover:text-blue-300 transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {mockPathways.map((pathway, index) => (
              <PathwayBlueprintCard
                key={pathway.pathwayId}
                pathway={pathway}
                index={index}
                isExpanded={expandedCards.has(pathway.pathwayId)}
                onToggle={() => toggleCard(pathway.pathwayId)}
              />
            ))}
          </div>

          {/* 하단 도면 스탬프 / Bottom drawing stamp */}
          <div className="border border-blue-400/20 bg-slate-900/50 p-3 font-mono text-[10px] text-blue-400/40 flex items-center justify-between">
            <span>© 2026 JOBCHAJA VISA DESIGN STUDIO — DWG #83 ARCHITECTURE BLUEPRINT</span>
            <span className="text-blue-400/30">v1.0.0 · AUTO-GENERATED</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 입력 페이지 렌더링 / Render input page
  // ============================================================
  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* 배경 그리드 / Background grid */}
      <BlueprintGrid />

      {/* 상단 툴바 / Top toolbar */}
      <div className="relative z-10 border-b border-blue-400/30 bg-slate-900/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* 앱 이름 / App name */}
          <div className="font-mono flex items-center gap-2 shrink-0">
            <div className="border border-blue-400/50 px-2 py-1 bg-blue-900/30">
              <span className="text-blue-300 text-xs tracking-widest font-bold">DWG</span>
              <span className="text-blue-400/50 text-xs">·83</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xs text-blue-200 font-bold font-mono leading-tight">VISA BLUEPRINT</div>
              <div className="text-[10px] text-blue-400/50 font-mono leading-tight">Architecture Design Mode</div>
            </div>
          </div>

          {/* 스텝 진행 바 / Step progress bar */}
          <div className="flex-1 flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i < currentStep
                    ? 'bg-blue-400'
                    : i === currentStep
                    ? 'bg-blue-400/60 animate-pulse'
                    : 'bg-blue-900/40'
                }`}
              />
            ))}
          </div>

          {/* 레이어 토글 / Layer toggle */}
          <button
            onClick={() => setShowLayerPanel((p) => !p)}
            className="flex items-center gap-1.5 border border-blue-400/30 px-2.5 py-1.5 text-blue-400 hover:border-blue-400 hover:text-blue-300 transition-colors font-mono text-xs shrink-0"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LAYERS</span>
          </button>

          {/* 리셋 / Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 border border-blue-400/20 px-2.5 py-1.5 text-blue-400/60 hover:border-blue-400/50 hover:text-blue-400 transition-colors font-mono text-xs shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 메인 레이아웃 / Main layout */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-4">
          {/* 레이어 패널 / Layer panel */}
          {showLayerPanel && (
            <div className="w-48 shrink-0 hidden md:block">
              <LayerPanel
                steps={STEPS}
                currentStep={currentStep}
                completedValues={completedValues}
                onLayerClick={(idx) => {
                  if (idx < currentStep) setCurrentStep(idx);
                }}
              />
            </div>
          )}

          {/* 메인 캔버스 / Main canvas */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* 도면 타이틀 블록 / Drawing title block */}
            <TitleBlock currentStep={currentStep + 1} totalSteps={STEPS.length} />

            {/* 현재 스텝 패널 / Current step panel */}
            <div className="border border-blue-400/40 bg-slate-900/80 overflow-hidden">
              {/* 패널 헤더 / Panel header */}
              <div className="bg-blue-950/60 border-b border-blue-400/40 px-4 py-2.5 flex items-center justify-between">
                <div className="font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400/50 text-[10px] tracking-widest">{step.dimensionCode}</span>
                    <div className="w-1 h-1 rounded-full bg-blue-400/30" />
                    <span className="text-[10px] text-blue-400/50">LAYER {String(currentStep + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="text-blue-200 text-base font-bold mt-0.5">
                    {step.labelKo}
                    <span className="text-blue-400/50 font-normal ml-2 text-sm">/ {step.labelEn}</span>
                  </div>
                </div>
                {/* 완료 수 / Done count */}
                <div className="text-blue-400/40 font-mono text-xs">
                  {currentStep}/{STEPS.length - 1}
                </div>
              </div>

              {/* 스텝 입력 영역 / Step input area */}
              <div className="p-4">
                {renderStepInput()}
              </div>

              {/* 액션 버튼 / Action buttons */}
              <div className="border-t border-blue-400/20 px-4 py-3 flex items-center justify-between bg-slate-900/50">
                {/* 뒤로 / Back */}
                <button
                  onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1.5 px-4 py-2 border border-blue-400/20 text-blue-400/60 font-mono text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:border-blue-400/50 hover:not-disabled:text-blue-400"
                >
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  <span>PREV</span>
                </button>

                {/* 현재 선택값 / Current selection */}
                <div className="font-mono text-xs text-blue-400/50 hidden sm:block">
                  {completedValues[step.key] ? (
                    <span className="text-blue-300">{completedValues[step.key]}</span>
                  ) : (
                    <span className="animate-pulse">선택해주세요...</span>
                  )}
                </div>

                {/* 다음 / Next */}
                <button
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="flex items-center gap-1.5 px-4 py-2 border font-mono text-xs transition-all border-blue-400 bg-blue-900/40 text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-blue-900/60 hover:not-disabled:text-blue-200"
                >
                  <span>{currentStep === STEPS.length - 1 ? 'GENERATE' : 'NEXT'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 완료된 치수 목록 / Completed dimension list */}
            {Object.keys(completedValues).length > 0 && (
              <div className="border border-blue-400/20 bg-slate-900/60 font-mono">
                <div className="border-b border-blue-400/20 px-3 py-1.5 flex items-center gap-1 text-[10px] text-blue-400/50 uppercase tracking-wider">
                  <Maximize2 className="w-3 h-3" />
                  <span>Dimension Log</span>
                </div>
                <div className="px-3 py-2 space-y-1.5">
                  {STEPS.filter((s) => completedValues[s.key]).map((s) => (
                    <DimensionLine
                      key={s.key}
                      code={s.dimensionCode}
                      value={completedValues[s.key]}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 하단 좌표 상태바 / Bottom coordinate status bar */}
            <div className="border border-blue-400/15 bg-slate-900/50 px-3 py-1.5 flex items-center justify-between font-mono text-[10px] text-blue-400/40">
              <div className="flex items-center gap-3">
                <span>X: 0.000</span>
                <span>Y: 0.000</span>
                <span>Z: 0.000</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Grid className="w-3 h-3" />
                  GRID ON
                </span>
                <span className="flex items-center gap-1">
                  <Ruler className="w-3 h-3" />
                  SNAP ON
                </span>
                <span>ORTHO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
