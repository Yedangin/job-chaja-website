'use client';

// KOR: 디자인 #58 — 코딩 튜토리얼 테마 비자 진단 페이지 (freeCodeCamp, Codecademy 스타일)
// ENG: Design #58 — Coding Tutorial themed visa diagnosis page (freeCodeCamp, Codecademy style)

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
  Terminal,
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  Lightbulb,
  Code2,
  BookOpen,
  Trophy,
  Lock,
  Unlock,
  GitBranch,
  Cpu,
  Star,
  RotateCcw,
  ArrowRight,
  Flag,
  AlertCircle,
  Info,
} from 'lucide-react';

// KOR: 스텝 정의 인터페이스 / ENG: Step definition interface
interface StepDef {
  id: number;
  label: string;
  labelEn: string;
  field: keyof DiagnosisInput;
  description: string;
  hint: string;
  module: string;
}

// KOR: 비자 체인 아이템 타입 (tsbuildinfo 캐시 독립) / ENG: Visa chain item type (tsbuildinfo cache independent)
interface VisaChainItem {
  visa: string;
  duration: string;
}

// KOR: 마일스톤 아이템 타입 / ENG: Milestone item type
interface MilestoneItem {
  title: string;
  description: string;
  emoji: string;
}

// KOR: 경로 타입 (tsbuildinfo와 무관하게 독립 정의) / ENG: Pathway type (defined independently of tsbuildinfo)
interface PathwayData {
  id: string;
  name: string;
  description: string;
  feasibilityScore: number;
  feasibilityLabel: '매우 높음' | '높음' | '보통' | '낮음' | '매우 낮음';
  totalDurationMonths: number;
  estimatedCostUSD: number;
  visaChain: VisaChainItem[];
  milestones: MilestoneItem[];
}

// KOR: 결과 타입 (tsbuildinfo와 무관하게 독립 정의) / ENG: Result type (defined independently of tsbuildinfo)
interface ResultData {
  id: string;
  userInput: {
    nationality: string;
    age: number;
    educationLevel: string;
    availableAnnualFund: string;
    finalGoal: string;
    priorityPreference: string;
  };
  pathways: PathwayData[];
}

// KOR: 코딩 튜토리얼 스타일 6단계 입력 스텝 / ENG: 6-step input in coding tutorial style
const STEPS: StepDef[] = [
  {
    id: 1,
    field: 'nationality',
    label: '국적 설정',
    labelEn: 'SET_NATIONALITY',
    description: '출신 국가를 선택하세요. 국적은 비자 경로 계산의 첫 번째 변수입니다.',
    hint: 'popularCountries 배열에서 값을 선택하거나 직접 문자열을 입력하세요.',
    module: 'Module 1: User Profile',
  },
  {
    id: 2,
    field: 'age',
    label: '나이 입력',
    labelEn: 'SET_AGE',
    description: '현재 나이를 입력하세요. 비자 유형마다 연령 제한이 다릅니다.',
    hint: '18-65 범위의 정수를 입력하세요. 나이는 Point 계산에 영향을 줍니다.',
    module: 'Module 1: User Profile',
  },
  {
    id: 3,
    field: 'educationLevel',
    label: '학력 설정',
    labelEn: 'SET_EDUCATION',
    description: '최종 학력을 선택하세요. 학력 수준은 E-7 등 전문인력 비자에 직접 영향을 줍니다.',
    hint: 'educationOptions 배열에서 선택하세요. "학사 (4년제 대학)"이 가장 많은 경로를 열어줍니다.',
    module: 'Module 2: Eligibility Check',
  },
  {
    id: 4,
    field: 'availableAnnualFund',
    label: '연간 자금 설정',
    labelEn: 'SET_ANNUAL_FUND',
    description: '비자 준비 및 생활에 사용 가능한 연간 예산을 선택하세요.',
    hint: 'fundOptions 배열에서 선택하세요. 자금이 클수록 D-2 유학 경로가 유리합니다.',
    module: 'Module 2: Eligibility Check',
  },
  {
    id: 5,
    field: 'finalGoal',
    label: '최종 목표 설정',
    labelEn: 'SET_FINAL_GOAL',
    description: '한국 체류의 최종 목표를 선택하세요. 목표에 따라 최적 경로가 달라집니다.',
    hint: 'goalOptions 배열에서 선택하세요. 영주권 목표 시 F-2, F-5 경로가 포함됩니다.',
    module: 'Module 3: Goal Mapping',
  },
  {
    id: 6,
    field: 'priorityPreference',
    label: '우선순위 설정',
    labelEn: 'SET_PRIORITY',
    description: '어떤 요소를 가장 중요하게 생각하나요? 우선순위에 따라 경로 정렬 방식이 바뀝니다.',
    hint: 'priorityOptions 배열에서 선택하세요. 이 값은 pathways 정렬 알고리즘에 사용됩니다.',
    module: 'Module 3: Goal Mapping',
  },
];

// KOR: 국가 타입 (tsbuildinfo 캐시 독립) / ENG: Country type (tsbuildinfo cache independent)
interface CountryItem {
  code: string;
  name?: string;
  nameEn?: string;
  flag: string;
}

// KOR: 실현 가능성 점수에 따른 fCC 스타일 색상 반환
// ENG: Return fCC-style color based on feasibility score
const getScoreBarColor = (score: number): string => {
  if (score >= 80) return 'bg-emerald-400';
  if (score >= 60) return 'bg-yellow-400';
  return 'bg-red-400';
};

// KOR: 비자 체인 태그 색상 / ENG: Visa chain tag color
const getVisaTagColor = (visa: string): string => {
  if (visa.startsWith('D-')) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  if (visa.startsWith('E-')) return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
  if (visa.startsWith('F-')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
};

// KOR: 가능성 레이블 타입 가드 / ENG: Feasibility label type guard
type FeasibilityLabel = '매우 높음' | '높음' | '보통' | '낮음' | '매우 낮음';
const isFeasibilityLabel = (val: string): val is FeasibilityLabel =>
  ['매우 높음', '높음', '보통', '낮음', '매우 낮음'].includes(val);

export default function Diagnosis58Page() {
  // KOR: 현재 활성 스텝 (1-6) / ENG: Current active step (1-6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // KOR: 완료된 스텝 집합 / ENG: Set of completed steps
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // KOR: 사용자 입력 상태 / ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 힌트 패널 표시 여부 / ENG: Whether hint panel is visible
  const [showHint, setShowHint] = useState<boolean>(false);

  // KOR: 결과 화면 표시 여부 / ENG: Whether results screen is shown
  const [showResult, setShowResult] = useState<boolean>(false);

  // KOR: 각 경로 카드 펼침 상태 / ENG: Expanded state per pathway card
  const [expandedPath, setExpandedPath] = useState<string | null>('path-1');

  // KOR: 결과 데이터 (독립 타입 사용) / ENG: Result data (using independent type)
  const [result, setResult] = useState<ResultData | null>(null);

  // KOR: 코드 에디터 애니메이션 트리거 / ENG: Code editor animation trigger
  const [running, setRunning] = useState<boolean>(false);

  // KOR: 현재 스텝 데이터 가져오기 / ENG: Get current step data
  const step = STEPS[currentStep - 1];

  // KOR: 현재 스텝에서 선택된 값 / ENG: Selected value at current step
  const currentValue = input[step.field];

  // KOR: 입력 옵션 반환 — 모든 배열을 string[]으로 강제 변환
  // ENG: Return input options — force all arrays to string[]
  const getOptions = (field: keyof DiagnosisInput): string[] => {
    switch (field) {
      case 'nationality':
        // KOR: popularCountries를 CountryItem으로 캐스트하여 name/nameEn 접근
        // ENG: Cast popularCountries as CountryItem[] to access name/nameEn
        return (popularCountries as unknown as CountryItem[]).map(
          (c) => `${c.flag} ${c.name ?? c.nameEn ?? c.code}`
        );
      case 'educationLevel':
        return (educationOptions as unknown as string[]).map((o) =>
          typeof o === 'string' ? o : String((o as { value?: string }).value ?? o)
        );
      case 'availableAnnualFund':
        return (fundOptions as unknown as string[]).map((o) =>
          typeof o === 'string' ? o : String((o as { value?: string }).value ?? o)
        );
      case 'finalGoal':
        return (goalOptions as unknown as string[]).map((o) =>
          typeof o === 'string' ? o : String((o as { value?: string }).value ?? o)
        );
      case 'priorityPreference':
        return (priorityOptions as unknown as string[]).map((o) =>
          typeof o === 'string' ? o : String((o as { value?: string }).value ?? o)
        );
      default:
        return [];
    }
  };

  // KOR: 옵션 선택 처리 / ENG: Handle option selection
  const handleSelect = (value: string) => {
    setInput((prev) => ({ ...prev, [step.field]: value }));
  };

  // KOR: 나이 입력 처리 / ENG: Handle age input
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      setInput((prev) => ({ ...prev, age: val }));
    }
  };

  // KOR: Run 버튼 — 현재 스텝 완료 처리 / ENG: Run button — complete current step
  const handleRun = () => {
    if (!currentValue) return;
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
        setShowHint(false);
      } else {
        // KOR: 모든 스텝 완료 → mock 데이터를 독립 타입으로 캐스트하여 저장
        // ENG: All steps done → cast mock data to independent type and store
        const raw = mockDiagnosisResult as unknown as ResultData;
        setResult(raw);
        setShowResult(true);
      }
    }, 800);
  };

  // KOR: 스텝 직접 이동 (완료된 스텝만 허용) / ENG: Direct step navigation (completed only)
  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep || completedSteps.has(stepId)) {
      setCurrentStep(stepId);
      setShowHint(false);
    }
  };

  // KOR: 초기화 / ENG: Reset everything
  const handleReset = () => {
    setCurrentStep(1);
    setCompletedSteps(new Set());
    setInput({});
    setShowHint(false);
    setShowResult(false);
    setResult(null);
    setExpandedPath('path-1');
  };

  // KOR: 생성된 코드 스니펫 미리보기 / ENG: Generated code snippet preview
  const codePreview = `const userProfile = {
  nationality: ${currentValue ? JSON.stringify(currentValue) : '/* 선택하세요 */'},
  age:         ${input.age ?? '/* 입력하세요 */'},
  education:   ${input.educationLevel ? JSON.stringify(input.educationLevel) : '/* 선택하세요 */'},
  annualFund:  ${input.availableAnnualFund ? JSON.stringify(input.availableAnnualFund) : '/* 선택하세요 */'},
  finalGoal:   ${input.finalGoal ? JSON.stringify(input.finalGoal) : '/* 선택하세요 */'},
  priority:    ${input.priorityPreference ? JSON.stringify(input.priorityPreference) : '/* 선택하세요 */'},
};

// Running visa matching engine...
const result = await diagnoseVisaPathways(userProfile);`;

  // ──────────────────────────────────────────────────────────────
  // KOR: 결과 화면 렌더링 / ENG: Render result screen
  // ──────────────────────────────────────────────────────────────
  if (showResult && result) {
    const firstPathway = result.pathways[0];
    const firstLabel: FeasibilityLabel = isFeasibilityLabel(firstPathway.feasibilityLabel)
      ? firstPathway.feasibilityLabel
      : '보통';

    return (
      <div className="min-h-screen bg-[#0a0e1a] text-slate-100 font-mono">
        {/* KOR: 상단 헤더 / ENG: Top header */}
        <header className="bg-[#1b2333] border-b border-slate-700/50 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-slate-400 text-sm">visa-diagnosis.ts — Results</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400 shrink-0" size={16} />
            <span className="text-yellow-400 text-sm font-bold">DIAGNOSIS COMPLETE</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300 transition-colors"
          >
            <RotateCcw size={13} />
            재시작
          </button>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* KOR: 결과 헤더 배너 / ENG: Result header banner */}
          <div className="bg-linear-to-br from-emerald-900/40 to-blue-900/40 border border-emerald-500/30 rounded-xl p-6 mb-8 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={18} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs uppercase tracking-widest">Output</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">
                ✅ {result.pathways.length}개 비자 경로 발견
              </h1>
              <p className="text-slate-400 text-sm">
                Found {result.pathways.length} visa pathways · Analysis ID: {result.id}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-1">{getFeasibilityEmoji(firstLabel)}</div>
              <div className="text-xs text-slate-400">최고 경로 가능성</div>
              <div className="text-emerald-400 font-bold">{firstPathway.feasibilityScore}%</div>
            </div>
          </div>

          {/* KOR: 입력 요약 코드 블록 / ENG: Input summary code block */}
          <div className="bg-[#0d1117] border border-slate-700/60 rounded-lg mb-8 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-slate-700/60">
              <Code2 size={14} className="text-slate-400" />
              <span className="text-slate-400 text-xs">입력 프로필 요약 / User Profile Summary</span>
            </div>
            <pre className="px-5 py-4 text-sm text-slate-300 overflow-x-auto">
              <span className="text-blue-400">const</span>{' '}
              <span className="text-emerald-300">userProfile</span>{' '}
              <span className="text-slate-400">= </span>
              <span className="text-yellow-300">{'{'}</span>{'\n'}
              {(Object.entries({
                nationality: result.userInput.nationality,
                age: result.userInput.age,
                education: result.userInput.educationLevel,
                fund: result.userInput.availableAnnualFund,
                goal: result.userInput.finalGoal,
                priority: result.userInput.priorityPreference,
              }) as [string, string | number][]).map(([k, v]) => (
                <span key={k}>
                  {'  '}
                  <span className="text-red-300">{k}</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-amber-300">{JSON.stringify(v)}</span>
                  {',\n'}
                </span>
              ))}
              <span className="text-yellow-300">{'}'}</span>
            </pre>
          </div>

          {/* KOR: 경로 카드 목록 / ENG: Pathway card list */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch size={16} className="text-blue-400" />
              <h2 className="text-base font-bold text-slate-200">추천 경로 / Recommended Pathways</h2>
              <span className="ml-auto text-xs text-slate-500">정렬 기준: {result.userInput.priorityPreference}</span>
            </div>

            {result.pathways.map((pathway: PathwayData, idx: number) => {
              const pathLabel: FeasibilityLabel = isFeasibilityLabel(pathway.feasibilityLabel)
                ? pathway.feasibilityLabel
                : '보통';

              return (
                <div
                  key={pathway.id}
                  className="bg-[#111827] border border-slate-700/60 rounded-xl overflow-hidden"
                >
                  {/* KOR: 카드 헤더 / ENG: Card header */}
                  <button
                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-slate-800/40 transition-colors"
                    onClick={() => setExpandedPath(expandedPath === pathway.id ? null : pathway.id)}
                  >
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400 border border-slate-700">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm mb-0.5 truncate">{pathway.name}</div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>⏱ {pathway.totalDurationMonths}개월</span>
                        <span>💰 ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
                        <span className="flex items-center gap-1">
                          {getFeasibilityEmoji(pathLabel)}
                          {pathLabel}
                        </span>
                      </div>
                    </div>
                    {/* KOR: 점수 바 / ENG: Score bar */}
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(pathway.feasibilityScore)}`}
                          style={{ width: `${pathway.feasibilityScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-white w-8 text-right">
                        {pathway.feasibilityScore}
                      </span>
                      {expandedPath === pathway.id
                        ? <ChevronUp size={16} className="text-slate-400" />
                        : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </button>

                  {/* KOR: 카드 본문 (펼침) / ENG: Card body (expanded) */}
                  {expandedPath === pathway.id && (
                    <div className="px-5 pb-5 border-t border-slate-700/50 pt-4">
                      {/* KOR: 설명 / ENG: Description */}
                      <p className="text-slate-400 text-sm mb-4 leading-relaxed">{pathway.description}</p>

                      {/* KOR: 비자 체인 / ENG: Visa chain */}
                      <div className="mb-4">
                        <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                          <GitBranch size={11} />
                          비자 경로 체인 / Visa Chain
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc: VisaChainItem, i: number) => (
                            <React.Fragment key={i}>
                              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono ${getVisaTagColor(vc.visa)}`}>
                                <span className="font-bold">{vc.visa}</span>
                                <span className="opacity-60">({vc.duration})</span>
                              </div>
                              {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                                <ArrowRight size={13} className="text-slate-600" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* KOR: 마일스톤 스텝 / ENG: Milestone steps */}
                      <div>
                        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                          <Flag size={11} />
                          주요 마일스톤 / Key Milestones
                        </div>
                        <div className="space-y-2">
                          {pathway.milestones.map((m: MilestoneItem, i: number) => (
                            <div key={i} className="flex gap-3 items-start">
                              <div className="shrink-0 w-7 h-7 bg-slate-800 border border-slate-700 rounded flex items-center justify-center text-base">
                                {m.emoji}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-200">{m.title}</div>
                                <div className="text-xs text-slate-500 leading-relaxed">{m.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* KOR: 하단 액션 / ENG: Bottom action */}
          <div className="mt-8 flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <RotateCcw size={15} />
              다시 진단하기
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors">
              <BookOpen size={15} />
              상세 비자 가이드 보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // KOR: 진단 입력 화면 렌더링 / ENG: Render diagnosis input screen
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 font-mono flex flex-col">

      {/* KOR: 맥OS 스타일 타이틀바 / ENG: macOS-style title bar */}
      <header className="bg-[#1b2333] border-b border-slate-700/50 px-4 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <Terminal size={14} className="text-slate-500" />
          <span className="text-slate-400 text-xs">visa-diagnosis.ts — JobChaJa IDE</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Cpu size={12} />
            TypeScript 5.0
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400" />
            <span className="text-yellow-400">{completedSteps.size} / 6 완료</span>
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── 좌측: 진도 트리 사이드바 / Left: Progress tree sidebar ── */}
        <aside className="w-64 bg-[#111827] border-r border-slate-700/50 flex flex-col shrink-0 overflow-y-auto">
          {/* KOR: 사이드바 헤더 / ENG: Sidebar header */}
          <div className="px-4 py-3 border-b border-slate-700/50">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Curriculum</div>
            <div className="text-sm font-bold text-white">비자 진단 과정</div>
            <div className="text-xs text-slate-500">Visa Diagnosis Course</div>
          </div>

          {/* KOR: 모듈 그룹 / ENG: Module groups */}
          {['Module 1: User Profile', 'Module 2: Eligibility Check', 'Module 3: Goal Mapping'].map((module) => {
            const moduleSteps = STEPS.filter((s) => s.module === module);
            return (
              <div key={module} className="py-2">
                <div className="px-4 py-1.5">
                  <div className="text-xs text-slate-500 font-semibold truncate">{module}</div>
                </div>
                {moduleSteps.map((s) => {
                  const isCompleted = completedSteps.has(s.id);
                  const isCurrent = currentStep === s.id;
                  const isLocked = s.id > currentStep && !completedSteps.has(s.id);

                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      disabled={isLocked}
                      className={`w-full text-left flex items-center gap-2 px-4 py-2 text-xs transition-colors ${
                        isCurrent
                          ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500'
                          : isCompleted
                          ? 'text-emerald-400 hover:bg-slate-800/40'
                          : isLocked
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="shrink-0">
                        {isCompleted
                          ? <CheckCircle size={13} className="text-emerald-400" />
                          : isLocked
                          ? <Lock size={13} className="text-slate-600" />
                          : isCurrent
                          ? <Play size={13} className="text-blue-400" />
                          : <Circle size={13} className="text-slate-500" />}
                      </span>
                      <span className="truncate">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* KOR: 최종 실행 / ENG: Final run */}
          <div className="py-2 border-t border-slate-700/50">
            <div className="px-4 py-1.5">
              <div className="text-xs text-slate-500 font-semibold">Final Project</div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 text-xs ${
              completedSteps.size === 6 ? 'text-yellow-400' : 'text-slate-600'
            }`}>
              <Trophy size={13} className={completedSteps.size === 6 ? 'text-yellow-400' : 'text-slate-600'} />
              비자 경로 분석 실행
            </div>
          </div>

          {/* KOR: 하단 언어 배지 / ENG: Bottom language badges */}
          <div className="mt-auto px-4 py-4 border-t border-slate-700/50">
            <div className="text-xs text-slate-600 mb-2">Tech Stack</div>
            <div className="flex flex-wrap gap-1">
              {['TypeScript', 'NestJS', 'Prisma'].map((tech) => (
                <span key={tech} className="px-1.5 py-0.5 bg-slate-800 text-slate-500 rounded text-xs border border-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* ── 중앙: 메인 에디터 + 입력 패널 ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* KOR: 탭 바 / ENG: Tab bar */}
          <div className="bg-[#161b22] border-b border-slate-700/50 flex items-center px-2 shrink-0">
            <div className="flex items-center gap-1 px-3 py-2 bg-[#0a0e1a] rounded-t text-xs text-slate-300 border-t border-l border-r border-slate-700/50 -mb-px">
              <Code2 size={12} className="text-blue-400" />
              step{currentStep}-{step.field}.ts
            </div>
          </div>

          {/* KOR: 에디터 + 입력 영역 2분할 / ENG: Split editor + input area */}
          <div className="flex-1 flex overflow-hidden">

            {/* KOR: 코드 에디터 프리뷰 / ENG: Code editor preview */}
            <div className="flex-1 bg-[#0d1117] overflow-y-auto border-r border-slate-700/50 p-0">
              {/* KOR: 에디터 상단 설명 바 / ENG: Editor top description bar */}
              <div className="bg-[#161b22] px-4 py-2.5 border-b border-slate-700/40 flex items-start gap-3">
                <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-300 font-semibold mb-0.5">{step.label}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{step.description}</div>
                </div>
              </div>

              {/* KOR: 코드 미리보기 / ENG: Code preview */}
              <div className="relative">
                {/* KOR: 줄 번호 / ENG: Line numbers */}
                <div className="flex">
                  <div className="text-slate-700 text-xs text-right select-none py-4 pr-3 pl-4 leading-6 min-w-12 border-r border-slate-700/40 bg-[#0d1117]">
                    {codePreview.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <pre className="flex-1 text-xs text-slate-400 py-4 px-4 leading-6 overflow-x-auto whitespace-pre">
                    {codePreview.split('\n').map((line, i) => {
                      // KOR: 단순 구문 강조 / ENG: Simple syntax highlighting
                      if (line.includes('const ')) {
                        return (
                          <div key={i}>
                            <span className="text-blue-400">const </span>
                            <span className="text-emerald-300">{line.slice(6).split(' = ')[0].trim()}</span>
                            <span className="text-slate-400"> = </span>
                            <span className="text-yellow-300">{line.split(' = ').slice(1).join(' = ')}</span>
                          </div>
                        );
                      }
                      if (line.includes('//')) {
                        return <div key={i} className="text-slate-600">{line}</div>;
                      }
                      if (line.includes('await ')) {
                        return <div key={i} className="text-slate-300">{line}</div>;
                      }
                      const isFilledLine = !line.includes('/* ');
                      return (
                        <div key={i} className={isFilledLine && line.trim() ? 'text-amber-300' : 'text-slate-600'}>
                          {line}
                        </div>
                      );
                    })}
                  </pre>
                </div>

                {/* KOR: 실행 중 오버레이 / ENG: Running overlay */}
                {running && (
                  <div className="absolute inset-0 bg-[#0d1117]/80 flex items-center justify-center">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Running...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* KOR: 우측 입력 패널 / ENG: Right input panel */}
            <div className="w-80 flex flex-col bg-[#111827] overflow-y-auto shrink-0">

              {/* KOR: 스텝 헤더 / ENG: Step header */}
              <div className="px-4 py-3 border-b border-slate-700/50 bg-[#161b22]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">STEP {currentStep} / 6</span>
                  <span className="text-xs text-blue-400 font-mono">{step.module.split(':')[0]}</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                  <span className="text-blue-400">function </span>
                  <span className="text-yellow-300">{step.labelEn}</span>
                  <span className="text-slate-400">()</span>
                </div>
              </div>

              {/* KOR: 테스트 케이스 패널 / ENG: Test cases panel */}
              <div className="px-4 py-3 border-b border-slate-700/50">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle size={12} className="text-emerald-400" />
                  <span className="text-xs text-slate-500 font-semibold">Test Cases</span>
                </div>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${currentValue ? 'text-emerald-400 bg-emerald-900/20' : 'text-slate-600 bg-slate-800/40'}`}>
                    <span>{currentValue ? '✓' : '○'}</span>
                    <span>값이 입력되었는가</span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${currentValue ? 'text-emerald-400 bg-emerald-900/20' : 'text-slate-600 bg-slate-800/40'}`}>
                    <span>{currentValue ? '✓' : '○'}</span>
                    <span>올바른 타입인가</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs px-2 py-1 rounded text-slate-600 bg-slate-800/40">
                    <span>○</span>
                    <span>다음 스텝 잠금 해제</span>
                  </div>
                </div>
              </div>

              {/* KOR: 입력 옵션 또는 숫자 입력 / ENG: Input options or number input */}
              <div className="flex-1 px-4 py-3 overflow-y-auto">
                <div className="text-xs text-slate-500 mb-2 font-semibold">입력 / Input</div>

                {step.field === 'age' ? (
                  // KOR: 나이는 숫자 입력 / ENG: Age uses number input
                  <div className="space-y-2">
                    <input
                      type="number"
                      min={18}
                      max={65}
                      value={input.age ?? ''}
                      onChange={handleAgeChange}
                      placeholder="18 ~ 65"
                      className="w-full bg-[#0d1117] border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder-slate-600 font-mono focus:border-blue-500 focus:outline-none"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {[22, 25, 28, 30, 35].map((age) => (
                        <button
                          key={age}
                          onClick={() => setInput((prev) => ({ ...prev, age }))}
                          className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
                            input.age === age
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          {age}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // KOR: 나머지는 옵션 선택 / ENG: Others use option selection
                  <div className="space-y-1.5">
                    {getOptions(step.field).map((opt) => {
                      const isSelected = currentValue === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelect(opt)}
                          className={`w-full text-left px-3 py-2 rounded border text-xs transition-all ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full border ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-slate-600'}`} />
                            {opt}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* KOR: 힌트 패널 / ENG: Hint panel */}
              {showHint && (
                <div className="mx-4 mb-3 p-3 bg-yellow-900/20 border border-yellow-700/40 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={13} className="text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-yellow-400 font-semibold mb-1">힌트 / Hint</div>
                      <div className="text-xs text-yellow-200/70 leading-relaxed">{step.hint}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* KOR: 하단 실행 버튼 영역 / ENG: Bottom run button area */}
              <div className="px-4 py-3 border-t border-slate-700/50 bg-[#161b22] flex flex-col gap-2 shrink-0">
                <button
                  onClick={handleRun}
                  disabled={!currentValue || running}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold transition-all ${
                    !currentValue || running
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {running ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Running...
                    </>
                  ) : currentStep === 6 ? (
                    <>
                      <Play size={14} />
                      진단 실행 / Run Diagnosis
                    </>
                  ) : (
                    <>
                      <Play size={14} />
                      실행 / Run &amp; Next
                      <ChevronRight size={14} />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowHint((h) => !h)}
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded text-xs text-yellow-400 hover:bg-yellow-900/20 transition-colors"
                >
                  <Lightbulb size={12} />
                  {showHint ? '힌트 숨기기' : '힌트 보기'}
                </button>
              </div>
            </div>
          </div>

          {/* KOR: 하단 콘솔 출력 / ENG: Bottom console output */}
          <div className="h-28 bg-[#0a0e1a] border-t border-slate-700/50 shrink-0 overflow-y-auto">
            <div className="flex items-center gap-2 px-4 py-1.5 border-b border-slate-700/30">
              <Terminal size={12} className="text-slate-500" />
              <span className="text-xs text-slate-600">Console Output</span>
            </div>
            <div className="px-4 py-2 space-y-0.5 text-xs font-mono">
              {Array.from(completedSteps)
                .sort((a, b) => a - b)
                .map((sid) => {
                  const s = STEPS[sid - 1];
                  const val = input[s.field];
                  return (
                    <div key={sid} className="text-emerald-400">
                      <span className="text-slate-600">{'>'} </span>
                      <span className="text-slate-500">{s.labelEn}</span>
                      <span className="text-slate-600">(</span>
                      <span className="text-amber-300">{JSON.stringify(val)}</span>
                      <span className="text-slate-600">)</span>
                      <span className="text-slate-500"> → </span>
                      <span>✓ passed</span>
                    </div>
                  );
                })}
              {completedSteps.size === 0 && (
                <div className="text-slate-600 italic">
                  {'>'} 아직 실행된 스텝이 없습니다. / No steps executed yet.
                </div>
              )}
              {running && (
                <div className="text-yellow-400 animate-pulse">
                  {'>'} Running {step.labelEn}...
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* KOR: 하단 상태 바 / ENG: Bottom status bar */}
      <footer className="bg-blue-700 px-4 py-1 flex items-center gap-4 text-xs text-blue-100 shrink-0">
        <span className="flex items-center gap-1">
          <GitBranch size={11} />
          main
        </span>
        <span>TypeScript</span>
        <span className="flex items-center gap-1">
          {completedSteps.size < 6
            ? <AlertCircle size={11} className="text-yellow-300" />
            : <CheckCircle size={11} className="text-emerald-300" />}
          {completedSteps.size === 6 ? '모든 테스트 통과' : `${6 - completedSteps.size}개 스텝 남음`}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Unlock size={11} />
          JobChaJa IDE v1.0
        </span>
      </footer>
    </div>
  );
}
