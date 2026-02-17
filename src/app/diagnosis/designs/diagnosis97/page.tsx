'use client';

// ============================================================
// 비자 진단 시안 #97 — 로봇 팩토리 (Robot Factory)
// Visa Diagnosis Design #97 — Robot Factory
// 컨셉: 로봇 공장처럼 부품(조건)을 조립하여 비자 로봇을 완성
// Concept: Assemble parts (conditions) like a robot factory
//          to build a completed visa robot / pathway
// 레퍼런스: Boston Dynamics, Tesla Bot, NVIDIA Omniverse, ROS
// References: Boston Dynamics, Tesla Bot, NVIDIA Omniverse, ROS
// 색상: 메탈릭 그레이 + 로보 블루
// Colors: Metallic gray + robo blue
// ============================================================

import { useState, useEffect } from 'react';
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
  Cpu,
  Cog,
  Zap,
  Shield,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Clock,
  DollarSign,
  Globe,
  BookOpen,
  Target,
  ArrowRight,
  X,
  Play,
  Wrench,
  Database,
  Activity,
  Radio,
  Layers,
  Settings,
  Monitor,
  Terminal,
  BarChart2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

interface PartSlot {
  /* 부품 슬롯 ID / Part slot ID */
  id: string;
  /* 부품 슬롯 레이블 (한국어) / Part slot label (Korean) */
  labelKo: string;
  /* 부품 슬롯 레이블 (영어) / Part slot label (English) */
  labelEn: string;
  /* 장착 여부 / Whether installed */
  installed: boolean;
  /* 부품 아이콘 컴포넌트 이름 / Part icon key */
  iconKey: string;
}

interface RobotSpec {
  /* 스펙 항목 이름 / Spec item name */
  label: string;
  /* 스펙 값 / Spec value */
  value: string;
  /* 스펙 레벨 0–100 / Spec level */
  level: number;
}

// ============================================================
// 스텝 정의 / Step definitions
// ============================================================
const STEPS = [
  { id: 1, labelKo: '국적 칩', labelEn: 'NATIONALITY CHIP', iconKey: 'Globe' },
  { id: 2, labelKo: '연령 센서', labelEn: 'AGE SENSOR', iconKey: 'Radio' },
  { id: 3, labelKo: '학력 모듈', labelEn: 'EDU MODULE', iconKey: 'Database' },
  { id: 4, labelKo: '자금 배터리', labelEn: 'FUND BATTERY', iconKey: 'Zap' },
  { id: 5, labelKo: '목표 코어', labelEn: 'GOAL CORE', iconKey: 'Target' },
  { id: 6, labelKo: '우선순위 AI', labelEn: 'PRIORITY AI', iconKey: 'Cpu' },
];

// ============================================================
// 헬퍼: 아이콘 렌더링 / Helper: render icon by key
// ============================================================
function PartIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  const props = { className: className ?? 'w-5 h-5' };
  switch (iconKey) {
    case 'Globe': return <Globe {...props} />;
    case 'Radio': return <Radio {...props} />;
    case 'Database': return <Database {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'Target': return <Target {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    default: return <Cog {...props} />;
  }
}

// ============================================================
// 헬퍼: 점수 → 퍼센트바 색상 / Helper: score to bar color
// ============================================================
function scoreToBarColor(score: number): string {
  if (score >= 60) return 'bg-cyan-400';
  if (score >= 40) return 'bg-blue-400';
  if (score >= 20) return 'bg-amber-400';
  return 'bg-red-400';
}

// ============================================================
// 헬퍼: 지속 시간 포매팅 / Helper: format duration
// ============================================================
function fmtMonths(m: number): string {
  if (m < 12) return `${m}개월`;
  const y = Math.floor(m / 12);
  const rem = m % 12;
  return rem > 0 ? `${y}년 ${rem}개월` : `${y}년`;
}

// ============================================================
// 헬퍼: 비용 포매팅 / Helper: format cost
// ============================================================
function fmtCost(won: number): string {
  if (won === 0) return '무료';
  if (won < 100) return `${won}만원`;
  return `${(won / 100).toFixed(1)}백만원`;
}

// ============================================================
// 서브컴포넌트: 로봇 SVG 도식 / Sub-component: Robot SVG schematic
// ============================================================
function RobotSchematic({ installedCount, isAssembling }: { installedCount: number; isAssembling: boolean }) {
  /* 설치된 부품 수에 따라 로봇 파트 점진적 표시 */
  /* Progressively show robot parts based on installed count */
  const pct = installedCount / STEPS.length;
  const headOn = installedCount >= 1;
  const torsoOn = installedCount >= 2;
  const leftArmOn = installedCount >= 3;
  const rightArmOn = installedCount >= 4;
  const leftLegOn = installedCount >= 5;
  const rightLegOn = installedCount >= 6;

  const partCls = (active: boolean) =>
    `transition-all duration-500 ${active ? 'opacity-100' : 'opacity-15'}`;

  return (
    <div className="relative flex items-center justify-center">
      {/* 조립 애니메이션 링 / Assembly animation ring */}
      {isAssembling && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-40 rounded-full border-2 border-cyan-400 border-dashed animate-spin opacity-60" />
        </div>
      )}
      <svg viewBox="0 0 120 200" className="w-32 h-52" aria-label="로봇 도식 / Robot schematic">
        {/* 배경 그리드 / Background grid */}
        <defs>
          <pattern id="grid97" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <filter id="glow97">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 머리 / Head */}
        <g className={partCls(headOn)}>
          <rect x="35" y="10" width="50" height="38" rx="6" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />
          {/* 눈 / Eyes */}
          <rect x="44" y="22" width="12" height="8" rx="2" fill={headOn ? '#38bdf8' : '#334155'} filter={headOn ? 'url(#glow97)' : ''} />
          <rect x="64" y="22" width="12" height="8" rx="2" fill={headOn ? '#38bdf8' : '#334155'} filter={headOn ? 'url(#glow97)' : ''} />
          {/* 입 / Mouth */}
          <rect x="44" y="36" width="32" height="4" rx="2" fill={headOn ? '#0ea5e9' : '#334155'} />
          {/* 안테나 / Antenna */}
          <line x1="60" y1="10" x2="60" y2="3" stroke="#64748b" strokeWidth="2" />
          <circle cx="60" cy="2" r="2.5" fill={headOn ? '#f59e0b' : '#334155'} filter={headOn ? 'url(#glow97)' : ''} />
        </g>

        {/* 몸통 / Torso */}
        <g className={partCls(torsoOn)}>
          <rect x="30" y="52" width="60" height="60" rx="4" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />
          {/* 가슴 패널 / Chest panel */}
          <rect x="40" y="62" width="40" height="30" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
          {/* 코어 표시기 / Core indicator */}
          <circle cx="60" cy="77" r="8" fill={torsoOn ? '#0ea5e9' : '#334155'} filter={torsoOn ? 'url(#glow97)' : ''} />
          <circle cx="60" cy="77" r="4" fill="#e0f2fe" />
          {/* 진행 바 / Progress bars */}
          <rect x="40" y="96" width={`${pct * 40}`} height="4" rx="2" fill="#38bdf8" />
          <rect x="40" y="96" width="40" height="4" rx="2" fill="none" stroke="#475569" strokeWidth="1" />
          {/* 볼트 / Bolts */}
          <circle cx="34" cy="56" r="3" fill="#64748b" />
          <circle cx="86" cy="56" r="3" fill="#64748b" />
          <circle cx="34" cy="108" r="3" fill="#64748b" />
          <circle cx="86" cy="108" r="3" fill="#64748b" />
        </g>

        {/* 왼팔 / Left arm */}
        <g className={partCls(leftArmOn)}>
          <rect x="10" y="54" width="18" height="50" rx="5" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />
          <rect x="8" y="100" width="22" height="12" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1" />
          {/* 관절 / Joint */}
          <circle cx="19" cy="58" r="5" fill="#475569" />
        </g>

        {/* 오른팔 / Right arm */}
        <g className={partCls(rightArmOn)}>
          <rect x="92" y="54" width="18" height="50" rx="5" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />
          <rect x="90" y="100" width="22" height="12" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1" />
          {/* 관절 / Joint */}
          <circle cx="101" cy="58" r="5" fill="#475569" />
        </g>

        {/* 왼다리 / Left leg */}
        <g className={partCls(leftLegOn)}>
          <rect x="33" y="116" width="22" height="54" rx="5" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />
          <rect x="28" y="166" width="30" height="12" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1" />
          {/* 무릎 / Knee */}
          <circle cx="44" cy="142" r="5" fill="#475569" />
        </g>

        {/* 오른다리 / Right leg */}
        <g className={partCls(rightLegOn)}>
          <rect x="65" y="116" width="22" height="54" rx="5" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />
          <rect x="62" y="166" width="30" height="12" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1" />
          {/* 무릎 / Knee */}
          <circle cx="76" cy="142" r="5" fill="#475569" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================
// 서브컴포넌트: 부품 카드 / Sub-component: Part card
// ============================================================
function PartCard({
  step,
  current,
  installed,
  onClick,
}: {
  step: typeof STEPS[number];
  current: boolean;
  installed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center gap-1 p-3 rounded-lg border transition-all duration-300 text-xs font-mono
        ${current
          ? 'border-cyan-400 bg-cyan-950 shadow-[0_0_12px_rgba(34,211,238,0.4)] scale-105'
          : installed
          ? 'border-slate-500 bg-slate-800 opacity-80'
          : 'border-slate-700 bg-slate-900 opacity-50'}
      `}
    >
      {/* 설치 완료 배지 / Installed badge */}
      {installed && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-slate-900" />
        </span>
      )}
      <PartIcon iconKey={step.iconKey} className={`w-5 h-5 ${current ? 'text-cyan-400' : installed ? 'text-slate-400' : 'text-slate-600'}`} />
      <span className={`text-[10px] leading-tight text-center ${current ? 'text-cyan-300' : installed ? 'text-slate-400' : 'text-slate-600'}`}>
        {step.labelEn}
      </span>
    </button>
  );
}

// ============================================================
// 서브컴포넌트: 스펙 게이지 / Sub-component: Spec gauge
// ============================================================
function SpecGauge({ label, value, level }: RobotSpec) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{label}</span>
        <span className="text-[10px] text-cyan-400 font-mono">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(level, 100)}%`,
            background: level >= 60
              ? 'linear-gradient(90deg, #0ea5e9, #38bdf8)'
              : level >= 30
              ? 'linear-gradient(90deg, #d97706, #f59e0b)'
              : 'linear-gradient(90deg, #dc2626, #f87171)',
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// 서브컴포넌트: 결과 로봇 카드 / Sub-component: Result robot card
// ============================================================
function ResultRobotCard({
  pathway,
  rank,
  expanded,
  onToggle,
}: {
  pathway: CompatPathway;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  /* 점수에 따른 로봇 등급 / Robot grade based on score */
  const grade = pathway.finalScore >= 50 ? 'MARK-I' : pathway.finalScore >= 30 ? 'MARK-II' : pathway.finalScore >= 15 ? 'MARK-III' : 'MARK-IV';
  const gradeColor = pathway.finalScore >= 50 ? 'text-cyan-400' : pathway.finalScore >= 30 ? 'text-blue-400' : pathway.finalScore >= 15 ? 'text-amber-400' : 'text-red-400';
  const borderColor = pathway.finalScore >= 50 ? 'border-cyan-500' : pathway.finalScore >= 30 ? 'border-blue-500' : pathway.finalScore >= 15 ? 'border-amber-500' : 'border-red-500';

  const specs: RobotSpec[] = [
    { label: 'SCORE', value: `${pathway.finalScore}pt`, level: pathway.finalScore },
    { label: 'DURATION', value: fmtMonths(pathway.estimatedMonths), level: Math.max(0, 100 - pathway.estimatedMonths) },
    { label: 'COST', value: fmtCost(pathway.estimatedCostWon), level: Math.max(0, 100 - (pathway.estimatedCostWon / 50)) },
  ];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${borderColor} bg-slate-900`}>
      {/* 카드 헤더 / Card header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 hover:bg-slate-800 transition-colors"
      >
        {/* 순위 배지 / Rank badge */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
          {rank}
        </div>

        {/* 로봇 등급 아이콘 / Robot grade icon */}
        <div className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border ${borderColor} bg-slate-800`}>
          <Cpu className={`w-5 h-5 ${gradeColor}`} />
        </div>

        {/* 이름 + 등급 / Name + grade */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-100 font-mono">{pathway.nameKo}</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${borderColor} ${gradeColor}`}>
              {grade}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{pathway.visaChainStr}</div>
        </div>

        {/* 점수 + 펼치기 / Score + expand */}
        <div className="shrink-0 flex items-center gap-2">
          <span className={`text-lg font-bold font-mono ${gradeColor}`}>{pathway.finalScore}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {/* 스펙 시트 + 마일스톤 / Spec sheet + milestones */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-800">
          {/* 스펙 시트 / Spec sheet */}
          <div className="mt-3 p-3 bg-slate-800 rounded-lg border border-slate-700 font-mono">
            <div className="flex items-center gap-1.5 mb-3">
              <Monitor className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest">SPEC SHEET</span>
            </div>
            <div className="flex flex-col gap-2">
              {specs.map((s) => (
                <SpecGauge key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* 비자 체인 / Visa chain */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Layers className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">ASSEMBLY CHAIN</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="text-[11px] px-2 py-0.5 bg-slate-800 border border-slate-600 rounded font-mono text-slate-300">
                    {v.code}
                  </span>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* 마일스톤 / Milestones */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Activity className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">ASSEMBLY LOG</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {pathway.milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] font-mono">
                  <span className="shrink-0 w-12 text-right text-slate-600">+{m.monthFromStart}M</span>
                  <div className="w-px self-stretch bg-slate-700" />
                  <span className="text-slate-300">{m.nameKo}</span>
                  {m.visaStatus && m.visaStatus !== 'none' && (
                    <span className="ml-auto shrink-0 text-[10px] px-1.5 py-0.5 bg-cyan-950 border border-cyan-800 rounded text-cyan-400">
                      {m.visaStatus}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 노트 / Note */}
          {pathway.note && (
            <div className="mt-3 flex items-start gap-2 p-2 bg-slate-800 rounded-lg border border-slate-700">
              <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 font-mono">{pathway.note}</p>
            </div>
          )}

          {/* 다음 단계 버튼 / Next step button */}
          {pathway.nextSteps.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              {pathway.nextSteps.map((ns, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer group">
                  <Play className="w-3 h-3 text-cyan-400 group-hover:text-cyan-300" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-200 font-mono">{ns.nameKo}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{ns.description}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 ml-auto group-hover:text-slate-400" />
                </div>
              ))}
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
export default function Diagnosis97Page() {
  /* 현재 스텝 / Current step (1–6, 7 = 결과) */
  const [step, setStep] = useState(1);
  /* 입력 상태 / Input state */
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });
  /* 결과 표시 여부 / Whether results are shown */
  const [showResult, setShowResult] = useState(false);
  /* 조립 중 여부 / Whether assembling */
  const [isAssembling, setIsAssembling] = useState(false);
  /* 펼쳐진 경로 ID / Expanded pathway ID */
  const [expandedId, setExpandedId] = useState<string | null>(null);
  /* 결과 데이터 / Result data */
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  /* 조립 로그 메시지 / Assembly log messages */
  const [logMessages, setLogMessages] = useState<string[]>([]);
  /* 테스트 버튼 활성화 / Test button active */
  const [testMode, setTestMode] = useState(false);

  /* 설치된 부품 수 / Number of installed parts */
  const installedCount = step - 1;

  /* 조립 완료 여부 / Whether assembly is complete */
  const isComplete = step > STEPS.length;

  /* 로그 메시지 추가 / Add log message */
  function addLog(msg: string) {
    setLogMessages((prev) => [...prev.slice(-4), msg]);
  }

  /* 다음 스텝 / Next step */
  function handleNext() {
    if (step < STEPS.length) {
      addLog(`[OK] ${STEPS[step - 1].labelEn} INSTALLED`);
      setStep((s) => s + 1);
    } else {
      /* 최종 조립 + 결과 생성 / Final assembly + generate results */
      addLog('[OK] ALL PARTS INSTALLED — ASSEMBLING...');
      setIsAssembling(true);
      setTimeout(() => {
        setIsAssembling(false);
        setResult(mockDiagnosisResult);
        setShowResult(true);
        addLog('[OK] ROBOT ASSEMBLY COMPLETE');
      }, 1600);
      setStep((s) => s + 1);
    }
  }

  /* 이전 스텝 / Previous step */
  function handleBack() {
    if (step > 1) {
      addLog(`[--] ${STEPS[step - 2].labelEn} REMOVED`);
      setStep((s) => s - 1);
      setShowResult(false);
    }
  }

  /* 재시작 / Reset */
  function handleReset() {
    setStep(1);
    setShowResult(false);
    setResult(null);
    setInput({ ...mockInput });
    setLogMessages(['[INIT] ROBOT FACTORY READY']);
    setIsAssembling(false);
    setExpandedId(null);
    setTestMode(false);
  }

  /* 국적 선택 / Select nationality */
  function selectNationality(code: string) {
    setInput((p) => ({ ...p, nationality: code }));
    addLog(`[INPUT] NATIONALITY_CHIP = ${code}`);
  }

  /* 교육 선택 / Select education */
  function selectEducation(val: string) {
    setInput((p) => ({ ...p, educationLevel: val }));
    addLog(`[INPUT] EDU_MODULE = ${val.toUpperCase()}`);
  }

  /* 자금 선택 / Select fund */
  function selectFund(val: number) {
    setInput((p) => ({ ...p, availableAnnualFund: val }));
    addLog(`[INPUT] FUND_BATTERY = ${val}만원`);
  }

  /* 목표 선택 / Select goal */
  function selectGoal(val: string) {
    setInput((p) => ({ ...p, finalGoal: val }));
    addLog(`[INPUT] GOAL_CORE = ${val.toUpperCase()}`);
  }

  /* 우선순위 선택 / Select priority */
  function selectPriority(val: string) {
    setInput((p) => ({ ...p, priorityPreference: val }));
    addLog(`[INPUT] PRIORITY_AI = ${val.toUpperCase()}`);
  }

  /* 현재 스텝 완료 여부 / Whether current step is complete */
  function isStepComplete(s: number): boolean {
    switch (s) {
      case 1: return !!input.nationality;
      case 2: return !!input.age;
      case 3: return !!input.educationLevel;
      case 4: return input.availableAnnualFund !== undefined;
      case 5: return !!input.finalGoal;
      case 6: return !!input.priorityPreference;
      default: return false;
    }
  }

  /* 초기 로그 / Initial log */
  useEffect(() => {
    setLogMessages(['[INIT] ROBOT FACTORY v2.4.1 READY', '[SYS] AWAITING PARTS INPUT...']);
  }, []);

  /* 테스트 버튼 클릭 시 자동 입력 / Auto-fill on test button click */
  function handleTestMode() {
    setTestMode(true);
    setInput({ ...mockInput });
    addLog('[TEST] AUTO-FILL: ALL PARTS LOADED');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
      {/* ── 최상단 헤더 / Top header ── */}
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 로고 / Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100 tracking-widest uppercase leading-none">ROBOT FACTORY</p>
              <p className="text-[9px] text-slate-500 tracking-wider">VISA ASSEMBLY SYSTEM v2.4</p>
            </div>
          </div>

          {/* 헤더 오른쪽: 테스트 + 리셋 / Header right: test + reset */}
          <div className="flex items-center gap-2">
            {!showResult && (
              <button
                onClick={handleTestMode}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-600 hover:border-amber-500 text-[10px] text-slate-400 hover:text-amber-400 transition-all"
              >
                <Play className="w-3 h-3" />
                TEST
              </button>
            )}
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-600 hover:border-cyan-500 text-[10px] text-slate-400 hover:text-cyan-400 transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              RESET
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── 공장 상태 패널 / Factory status panel ── */}
        <div className="flex gap-3">
          {/* 로봇 도식 / Robot schematic */}
          <div className="shrink-0 w-44 bg-slate-900 border border-slate-700 rounded-xl p-3 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 w-full">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] text-slate-400 uppercase tracking-widest">ASSEMBLY</span>
            </div>
            <RobotSchematic installedCount={installedCount} isAssembling={isAssembling} />
            <div className="w-full">
              <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                <span>PARTS</span>
                <span>{installedCount}/{STEPS.length}</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${(installedCount / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 오른쪽 패널: 부품 카탈로그 + 로그 / Right panel: parts catalog + log */}
          <div className="flex-1 flex flex-col gap-2">
            {/* 부품 카탈로그 그리드 / Parts catalog grid */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Settings className="w-3 h-3 text-slate-400" />
                <span className="text-[9px] text-slate-400 uppercase tracking-widest">PARTS CATALOG</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {STEPS.map((s) => (
                  <PartCard
                    key={s.id}
                    step={s}
                    current={step === s.id}
                    installed={s.id < step}
                    onClick={() => {
                      if (s.id <= step) {
                        setStep(s.id);
                        setShowResult(false);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 조립 로그 / Assembly log */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Terminal className="w-3 h-3 text-green-400" />
                <span className="text-[9px] text-green-400 uppercase tracking-widest">ASSEMBLY LOG</span>
              </div>
              <div className="flex flex-col gap-0.5 min-h-12">
                {logMessages.map((msg, i) => (
                  <p key={i} className={`text-[9px] ${i === logMessages.length - 1 ? 'text-green-400' : 'text-slate-600'}`}>
                    {msg}
                  </p>
                ))}
                <span className="text-[9px] text-green-500 animate-pulse">█</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 입력 패널 / Input panel ── */}
        {!showResult && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            {/* 패널 헤더 / Panel header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-800">
              <PartIcon
                iconKey={STEPS[Math.min(step - 1, STEPS.length - 1)].iconKey}
                className="w-4 h-4 text-cyan-400"
              />
              <div>
                <p className="text-xs font-bold text-slate-100 tracking-wider uppercase">
                  {step <= STEPS.length ? STEPS[step - 1].labelEn : 'COMPLETE'}
                </p>
                <p className="text-[10px] text-slate-500">
                  STEP {Math.min(step, STEPS.length)} / {STEPS.length}
                  {' — '}
                  {step <= STEPS.length ? STEPS[step - 1].labelKo : '완료'}
                </p>
              </div>
              <div className="ml-auto text-[10px] text-slate-500">
                {isStepComplete(step) && <CheckCircle className="w-4 h-4 text-cyan-400" />}
              </div>
            </div>

            <div className="p-4">
              {/* STEP 1: 국적 / Nationality */}
              {step === 1 && (
                <div>
                  <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-wider">SELECT NATIONALITY CHIP</p>
                  <div className="grid grid-cols-4 gap-2">
                    {popularCountries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => selectNationality(c.code)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border transition-all text-center
                          ${input.nationality === c.code
                            ? 'border-cyan-400 bg-cyan-950 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                            : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}
                      >
                        <span className="text-xl">{c.flag}</span>
                        <span className="text-[9px] text-slate-300 leading-tight">{c.nameKo}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: 연령 / Age */}
              {step === 2 && (
                <div>
                  <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-wider">CALIBRATE AGE SENSOR</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full relative">
                      <div
                        className="h-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${((input.age - 18) / (60 - 18)) * 100}%` }}
                      />
                    </div>
                    <div className="shrink-0 px-3 py-1.5 bg-slate-800 border border-cyan-500 rounded-lg text-cyan-400 font-bold text-sm w-14 text-center">
                      {input.age}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={60}
                    value={input.age}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setInput((p) => ({ ...p, age: v }));
                      addLog(`[INPUT] AGE_SENSOR = ${v}`);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                    <span>18</span><span>60</span>
                  </div>
                  {/* 연령 경고 / Age warning */}
                  {input.age > 45 && (
                    <div className="mt-3 flex items-start gap-2 p-2 bg-amber-950 border border-amber-800 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-400">AGE &gt; 45: 일부 비자 경로 제한 / Some pathways may be restricted</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: 학력 / Education */}
              {step === 3 && (
                <div>
                  <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-wider">INSTALL EDU MODULE</p>
                  <div className="flex flex-col gap-2">
                    {educationOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => selectEducation(opt.value)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left
                          ${input.educationLevel === opt.value
                            ? 'border-cyan-400 bg-cyan-950 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                            : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}
                      >
                        <span className="text-base">{opt.emoji}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{opt.labelKo}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{opt.labelEn}</p>
                        </div>
                        {input.educationLevel === opt.value && (
                          <Check className="w-4 h-4 text-cyan-400 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: 자금 / Fund */}
              {step === 4 && (
                <div>
                  <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-wider">CHARGE FUND BATTERY</p>
                  <div className="flex flex-col gap-2">
                    {fundOptions.map((opt) => {
                      const pct = opt.value === 0 ? 5 : opt.value === 300 ? 20 : opt.value === 500 ? 35 : opt.value === 1000 ? 55 : opt.value === 2000 ? 75 : 95;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => selectFund(opt.value)}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all
                            ${input.availableAnnualFund === opt.value
                              ? 'border-cyan-400 bg-cyan-950 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                              : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}
                        >
                          <div className="flex-1">
                            <p className="text-xs text-slate-200">{opt.labelKo}</p>
                            <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${pct}%`,
                                  background: pct > 60 ? 'linear-gradient(90deg,#0ea5e9,#38bdf8)' : pct > 30 ? 'linear-gradient(90deg,#d97706,#f59e0b)' : 'linear-gradient(90deg,#dc2626,#f87171)',
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">{pct}%</span>
                          {input.availableAnnualFund === opt.value && (
                            <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: 목표 / Goal */}
              {step === 5 && (
                <div>
                  <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-wider">SET GOAL CORE</p>
                  <div className="grid grid-cols-2 gap-2">
                    {goalOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => selectGoal(opt.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all
                          ${input.finalGoal === opt.value
                            ? 'border-cyan-400 bg-cyan-950 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                            : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <p className="text-xs font-bold text-slate-200">{opt.labelKo}</p>
                        <p className="text-[10px] text-slate-500 text-center">{opt.descKo}</p>
                        {input.finalGoal === opt.value && (
                          <span className="text-[9px] px-2 py-0.5 bg-cyan-400 text-slate-900 rounded-full font-bold">ACTIVE</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: 우선순위 / Priority */}
              {step === 6 && (
                <div>
                  <p className="text-[11px] text-slate-400 mb-3 uppercase tracking-wider">CONFIGURE PRIORITY AI</p>
                  <div className="grid grid-cols-2 gap-2">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => selectPriority(opt.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all
                          ${input.priorityPreference === opt.value
                            ? 'border-cyan-400 bg-cyan-950 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                            : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <p className="text-xs font-bold text-slate-200">{opt.labelKo}</p>
                        <p className="text-[10px] text-slate-500 text-center">{opt.descKo}</p>
                        {input.priorityPreference === opt.value && (
                          <span className="text-[9px] px-2 py-0.5 bg-cyan-400 text-slate-900 rounded-full font-bold">ACTIVE</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 조립 중 / Assembling */}
              {step > STEPS.length && !showResult && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <Cog className="w-10 h-10 text-cyan-400 animate-spin" />
                  <p className="text-sm text-cyan-300 font-bold tracking-widest animate-pulse">ASSEMBLING ROBOT...</p>
                  <p className="text-[10px] text-slate-500">비자 매칭 엔진 실행 중 / Running visa matching engine</p>
                </div>
              )}
            </div>

            {/* 네비게이션 버튼 / Navigation buttons */}
            {step <= STEPS.length && (
              <div className="flex items-center gap-2 px-4 pb-4">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-all text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    BACK
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!isStepComplete(step)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all
                    ${isStepComplete(step)
                      ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_16px_rgba(34,211,238,0.4)] hover:shadow-[0_0_24px_rgba(34,211,238,0.6)]'
                      : 'bg-slate-800 border border-slate-700 text-slate-600 cursor-not-allowed'}`}
                >
                  {step === STEPS.length ? (
                    <>
                      <Wrench className="w-3.5 h-3.5" />
                      ASSEMBLE ROBOT
                    </>
                  ) : (
                    <>
                      INSTALL PART
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 결과 패널 / Result panel ── */}
        {showResult && result && (
          <div className="flex flex-col gap-4">
            {/* 결과 헤더 / Result header */}
            <div className="bg-slate-900 border border-cyan-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.5)]">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-cyan-400 tracking-wider uppercase">ASSEMBLY COMPLETE</p>
                  <p className="text-[10px] text-slate-400">조립 완료 — 비자 로봇 {result.pathways.length}기 생성됨</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-slate-500 font-mono">{result.meta.totalPathwaysEvaluated} evaluated</p>
                  <p className="text-[10px] text-slate-600 font-mono">{result.meta.hardFilteredOut} filtered</p>
                </div>
              </div>

              {/* 요약 스펙 / Summary specs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'ROBOTS', value: `${result.pathways.length}기` },
                  { label: 'TOP SCORE', value: `${Math.max(...result.pathways.map((p) => p.finalScore))}pt` },
                  { label: 'BEST ROUTE', value: fmtMonths(result.pathways.reduce((a, b) => a.estimatedMonths < b.estimatedMonths ? a : b).estimatedMonths) },
                ].map((s) => (
                  <div key={s.label} className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-center">
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                    <p className="text-sm font-bold text-cyan-400 font-mono">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 경로 목록 / Pathway list */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">VISA ROBOTS — RANKED BY SCORE</span>
              </div>
              {mockPathways.map((pw, idx) => (
                <ResultRobotCard
                  key={pw.id}
                  pathway={pw}
                  rank={idx + 1}
                  expanded={expandedId === pw.id}
                  onToggle={() => setExpandedId(expandedId === pw.id ? null : pw.id)}
                />
              ))}
            </div>

            {/* 하단 액션 / Bottom actions */}
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:border-slate-500 text-xs text-slate-400 hover:text-slate-200 transition-all font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                NEW ASSEMBLY
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold tracking-wider shadow-[0_0_16px_rgba(34,211,238,0.4)] hover:shadow-[0_0_24px_rgba(34,211,238,0.6)] transition-all font-mono">
                <Zap className="w-3.5 h-3.5" />
                DEPLOY ROBOT
              </button>
            </div>
          </div>
        )}

        {/* ── 하단 정보 / Footer info ── */}
        <div className="flex items-center justify-center gap-2 py-2">
          <Shield className="w-3 h-3 text-slate-600" />
          <p className="text-[9px] text-slate-600 font-mono">JOBCHAJA ROBOT FACTORY · VISA ENGINE v2.4 · {result?.meta.timestamp ? new Date(result.meta.timestamp).toLocaleDateString('ko-KR') : '2026'}</p>
        </div>
      </main>
    </div>
  );
}
