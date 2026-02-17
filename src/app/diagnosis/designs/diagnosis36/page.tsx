'use client';

// CI/CD 파이프라인 테마 비자 진단 페이지 / CI/CD Pipeline themed visa diagnosis page
// 배포 파이프라인처럼 비자 단계를 빌드/테스트/배포로 표현 / Visa steps expressed as build/test/deploy pipeline

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
  Play,
  CheckCircle,
  XCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  GitBranch,
  GitCommit,
  Cpu,
  Server,
  Package,
  Shield,
  Zap,
  Clock,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Activity,
  RefreshCw,
  CheckSquare,
  Box,
  Settings,
  Globe,
  BookOpen,
  Target,
  TrendingUp,
  Layers,
  Code2,
  Database,
  Lock,
  Unlock,
} from 'lucide-react';

// 파이프라인 단계 타입 / Pipeline stage type
type PipelineStage = 'source' | 'build' | 'test' | 'deploy' | 'done';

// 입력 단계 인덱스 / Input step index
type InputStep = 0 | 1 | 2 | 3 | 4 | 5;

// 파이프라인 노드 상태 / Pipeline node status
type NodeStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

// 로그 엔트리 타입 / Log entry type
interface LogEntry {
  time: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

// 빌드 배지 색상 매핑 / Build badge color mapping
function getBadgeColor(score: number): string {
  if (score >= 75) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
  if (score >= 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
  if (score >= 30) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
  return 'text-red-400 bg-red-400/10 border-red-400/30';
}

// 실현 가능성 → 파이프라인 상태 / Feasibility → pipeline status
function feasibilityToStatus(label: string): NodeStatus {
  if (label.includes('매우높음') || label.includes('높음')) return 'success';
  if (label.includes('보통')) return 'success';
  if (label.includes('낮음') || label.includes('매우낮음')) return 'failed';
  return 'success';
}

// 비용 포맷 / Cost formatting
function formatCost(costWon: number): string {
  if (costWon >= 10000) return `${(costWon / 10000).toFixed(0)}억원`;
  if (costWon >= 1000) return `${(costWon / 1000).toFixed(1)}천만원`;
  return `${costWon}만원`;
}

// 가짜 로그 생성 / Mock log generation
function generateLogs(pathway: RecommendedPathway): LogEntry[] {
  const now = new Date();
  const fmt = (offset: number): string => {
    const d = new Date(now.getTime() + offset * 1000);
    return d.toTimeString().slice(0, 8);
  };

  return [
    { time: fmt(0), level: 'info', message: `[source] Initializing pipeline: ${pathway.pathwayId}` },
    { time: fmt(1), level: 'info', message: `[source] Branch: visa/${pathway.visaChain.replace(/\s/g, '-')}` },
    { time: fmt(2), level: 'info', message: `[build] Loading eligibility ruleset v2.3.1...` },
    { time: fmt(3), level: 'info', message: `[build] Compiling ${pathway.milestones.length} milestone steps...` },
    { time: fmt(4), level: 'success', message: `[build] Build succeeded ✓ (${pathway.estimatedMonths}mo timeline)` },
    { time: fmt(5), level: 'info', message: `[test] Running feasibility checks...` },
    { time: fmt(6), level: pathway.finalScore >= 50 ? 'success' : 'warn', message: `[test] Score: ${pathway.finalScore}/100 — ${pathway.feasibilityLabel}` },
    { time: fmt(7), level: 'info', message: `[test] Cost validation: ${formatCost(pathway.estimatedCostWon)}` },
    { time: fmt(8), level: pathway.finalScore >= 30 ? 'success' : 'error', message: pathway.finalScore >= 30 ? `[deploy] Ready to deploy visa plan` : `[deploy] FAILED: score below threshold` },
    { time: fmt(9), level: 'info', message: `[deploy] Platform support: ${pathway.platformSupport}` },
    { time: fmt(10), level: 'success', message: `[done] Pipeline complete: ${pathway.nameEn}` },
  ];
}

export default function Diagnosis36Page(): React.JSX.Element {
  // 현재 입력 단계 / Current input step
  const [currentStep, setCurrentStep] = useState<InputStep>(0);
  // 사용자 입력값 / User input values
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 진단 완료 여부 / Whether diagnosis is complete
  const [isDiagnosed, setIsDiagnosed] = useState<boolean>(false);
  // 파이프라인 실행 중 / Pipeline running
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // 선택된 패스웨이 인덱스 / Selected pathway index
  const [selectedPathway, setSelectedPathway] = useState<number>(0);
  // 로그 표시 여부 / Log visibility
  const [showLog, setShowLog] = useState<boolean>(false);
  // 확장된 마일스톤 / Expanded milestone
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  // 파이프라인 애니메이션 단계 / Pipeline animation stage
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('source');

  // 입력 단계 설정 / Input step configuration
  const steps = [
    { id: 0, key: 'nationality', label: '국적 / Nationality', icon: Globe, env: 'NATIONALITY' },
    { id: 1, key: 'age', label: '나이 / Age', icon: Code2, env: 'AGE' },
    { id: 2, key: 'educationLevel', label: '학력 / Education', icon: BookOpen, env: 'EDUCATION_LEVEL' },
    { id: 3, key: 'availableAnnualFund', label: '가용 자금 / Annual Fund', icon: DollarSign, env: 'AVAILABLE_FUND' },
    { id: 4, key: 'finalGoal', label: '최종 목표 / Final Goal', icon: Target, env: 'FINAL_GOAL' },
    { id: 5, key: 'priorityPreference', label: '우선순위 / Priority', icon: TrendingUp, env: 'PRIORITY_PREF' },
  ] as const;

  // 파이프라인 실행 / Run pipeline
  const runPipeline = async (): Promise<void> => {
    setIsRunning(true);
    setPipelineStage('source');
    await delay(500);
    setPipelineStage('build');
    await delay(600);
    setPipelineStage('test');
    await delay(500);
    setPipelineStage('deploy');
    await delay(500);
    setPipelineStage('done');
    setIsRunning(false);
    setIsDiagnosed(true);
    setShowLog(true);
  };

  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 파이프라인 노드 상태 / Pipeline node status
  function getStageStatus(stage: PipelineStage): NodeStatus {
    const order: PipelineStage[] = ['source', 'build', 'test', 'deploy', 'done'];
    const current = order.indexOf(pipelineStage);
    const target = order.indexOf(stage);
    if (current > target) return 'success';
    if (current === target && isRunning) return 'running';
    if (current === target && !isRunning && isDiagnosed) return 'success';
    return 'pending';
  }

  // 노드 상태 아이콘 / Node status icon
  function NodeIcon({ status }: { status: NodeStatus }): React.JSX.Element {
    if (status === 'success') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-400" />;
    if (status === 'running') return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
    return <Circle className="w-4 h-4 text-gray-600" />;
  }

  const pathways = mockDiagnosisResult.pathways;
  const activePathway = pathways[selectedPathway];
  const logs = isDiagnosed ? generateLogs(activePathway) : [];

  // 로그 레벨 색상 / Log level color
  function logColor(level: LogEntry['level']): string {
    if (level === 'success') return 'text-emerald-400';
    if (level === 'warn') return 'text-yellow-400';
    if (level === 'error') return 'text-red-400';
    return 'text-gray-400';
  }

  // ─── 입력 화면 / Input screen ───
  if (!isDiagnosed) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
        {/* 헤더 / Header */}
        <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="text-gray-500 text-sm ml-2">jobchaja-visa-pipeline — pipeline config</span>
          <div className="ml-auto flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 text-xs">main</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* 파이프라인 이름 / Pipeline name */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm">visa-diagnosis.yml</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">비자 파이프라인 설정</h1>
            <p className="text-gray-500 text-sm">Configure your visa pipeline environment variables</p>
          </div>

          {/* 파이프라인 단계 시각화 / Pipeline stage visualization */}
          <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
            {(['source', 'build', 'test', 'deploy', 'done'] as PipelineStage[]).map((stage, idx, arr) => (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className={`px-3 py-1.5 rounded text-xs border flex items-center gap-1.5 ${
                    stage === 'source' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' :
                    'border-gray-700 bg-gray-800/50 text-gray-500'
                  }`}>
                    {stage === 'source' && <GitCommit className="w-3 h-3" />}
                    {stage === 'build' && <Package className="w-3 h-3" />}
                    {stage === 'test' && <Shield className="w-3 h-3" />}
                    {stage === 'deploy' && <Server className="w-3 h-3" />}
                    {stage === 'done' && <CheckSquare className="w-3 h-3" />}
                    {stage}
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-gray-700 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 환경변수 설정 카드 / Environment variable config card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden mb-6">
            <div className="border-b border-gray-800 px-4 py-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400 text-sm">Environment Variables</span>
              <span className="ml-auto text-xs text-gray-600">{currentStep + 1} / {steps.length}</span>
            </div>

            {/* 완료된 변수들 / Completed variables */}
            {steps.slice(0, currentStep).map(step => (
              <div key={step.id} className="px-4 py-2 border-b border-gray-800/50 flex items-center gap-3">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-gray-500 text-xs w-40 shrink-0">{step.env}</span>
                <span className="text-emerald-400 text-xs truncate">
                  {step.key === 'nationality' && input.nationality
                    ? popularCountries.find(c => c.code === input.nationality)?.nameKo ?? input.nationality
                    : step.key === 'educationLevel'
                    ? educationOptions.find(e => e.value === input.educationLevel)?.labelKo
                    : step.key === 'finalGoal'
                    ? goalOptions.find(g => g.value === input.finalGoal)?.labelKo
                    : step.key === 'priorityPreference'
                    ? priorityOptions.find(p => p.value === input.priorityPreference)?.labelKo
                    : step.key === 'availableAnnualFund'
                    ? fundOptions.find(f => f.value === input.availableAnnualFund)?.labelKo
                    : String(input[step.key as keyof DiagnosisInput] ?? '')}
                </span>
              </div>
            ))}

            {/* 현재 입력 단계 / Current input step */}
            <div className="px-4 py-4">
              <div className="flex items-center gap-2 mb-4">
                <Circle className="w-3.5 h-3.5 text-blue-400 animate-pulse shrink-0" />
                <span className="text-blue-400 text-xs">{steps[currentStep].env}</span>
                <span className="text-gray-500 text-xs ml-auto"># required</span>
              </div>
              <div className="text-gray-300 text-sm mb-4">
                {steps[currentStep].label}
              </div>

              {/* 국적 입력 / Nationality input */}
              {currentStep === 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {popularCountries.map(country => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setInput(prev => ({ ...prev, nationality: country.code }));
                        setCurrentStep(1);
                      }}
                      className={`p-2 rounded border text-left transition-all ${
                        input.nationality === country.code
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-0.5">{country.flag}</div>
                      <div className="text-xs truncate">{country.nameKo}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* 나이 입력 / Age input */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded px-4 py-3">
                    <span className="text-gray-500 text-sm">age =</span>
                    <input
                      type="number"
                      min={18}
                      max={65}
                      placeholder="25"
                      className="flex-1 bg-transparent text-emerald-400 text-sm outline-none placeholder-gray-600"
                      onChange={e => setInput(prev => ({ ...prev, age: Number(e.target.value) }))}
                    />
                    <span className="text-gray-600 text-xs">// 18-65</span>
                  </div>
                  <button
                    onClick={() => { if (input.age && input.age >= 18 && input.age <= 65) setCurrentStep(2); }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded transition-colors"
                  >
                    Set Variable →
                  </button>
                </div>
              )}

              {/* 학력 입력 / Education input */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-2">
                  {educationOptions.map(edu => (
                    <button
                      key={edu.value}
                      onClick={() => {
                        setInput(prev => ({ ...prev, educationLevel: edu.value }));
                        setCurrentStep(3);
                      }}
                      className={`flex items-center gap-3 p-3 rounded border text-left transition-all ${
                        input.educationLevel === edu.value
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <span className="text-lg">{edu.emoji}</span>
                      <div>
                        <div className="text-sm text-gray-200">{edu.labelKo}</div>
                        <div className="text-xs text-gray-500">{edu.labelEn}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 자금 입력 / Fund input */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-2">
                  {fundOptions.map(fund => (
                    <button
                      key={fund.value}
                      onClick={() => {
                        setInput(prev => ({ ...prev, availableAnnualFund: fund.value }));
                        setCurrentStep(4);
                      }}
                      className={`flex items-center gap-3 p-3 rounded border text-left transition-all ${
                        input.availableAnnualFund === fund.value
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <DollarSign className="w-4 h-4 text-gray-500 shrink-0" />
                      <div>
                        <div className="text-sm text-gray-200">{fund.labelKo}</div>
                        <div className="text-xs text-gray-500">{fund.labelEn}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 목표 입력 / Goal input */}
              {currentStep === 4 && (
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map(goal => (
                    <button
                      key={goal.value}
                      onClick={() => {
                        setInput(prev => ({ ...prev, finalGoal: goal.value }));
                        setCurrentStep(5);
                      }}
                      className={`p-4 rounded border text-left transition-all ${
                        input.finalGoal === goal.value
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-2">{goal.emoji}</div>
                      <div className="text-sm font-medium text-gray-200">{goal.labelKo}</div>
                      <div className="text-xs text-gray-500 mt-1">{goal.descKo}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* 우선순위 입력 / Priority input */}
              {currentStep === 5 && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    {priorityOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setInput(prev => ({ ...prev, priorityPreference: opt.value }))}
                        className={`p-3 rounded border text-left transition-all ${
                          input.priorityPreference === opt.value
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-xl mb-1">{opt.emoji}</div>
                        <div className="text-sm text-gray-200">{opt.labelKo}</div>
                        <div className="text-xs text-gray-500">{opt.descKo}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => { if (input.priorityPreference) runPipeline(); }}
                    disabled={!input.priorityPreference || isRunning}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded transition-colors font-semibold"
                  >
                    <Play className="w-4 h-4" />
                    Run Pipeline
                  </button>
                </div>
              )}
            </div>

            {/* 미완성 변수들 / Remaining variables */}
            {steps.slice(currentStep + 1).map(step => (
              <div key={step.id} className="px-4 py-2 border-t border-gray-800/50 flex items-center gap-3">
                <Lock className="w-3.5 h-3.5 text-gray-700 shrink-0" />
                <span className="text-gray-700 text-xs">{step.env}</span>
                <span className="text-gray-700 text-xs ml-auto">not set</span>
              </div>
            ))}
          </div>

          {/* yml 미리보기 / yml preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="border-b border-gray-800 px-4 py-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 text-xs">visa-diagnosis.yml — preview</span>
            </div>
            <div className="p-4 text-xs text-gray-600 leading-relaxed">
              <div className="text-gray-500">name: Visa Eligibility Pipeline</div>
              <div className="mt-1 text-gray-500">on: [user_input]</div>
              <div className="mt-2">
                <span className="text-blue-400">env:</span>
              </div>
              {steps.map(step => (
                <div key={step.id} className="ml-4 flex gap-2">
                  <span className={input[step.key as keyof DiagnosisInput] ? 'text-yellow-400' : 'text-gray-700'}>
                    {step.env}:
                  </span>
                  <span className={input[step.key as keyof DiagnosisInput] ? 'text-emerald-400' : 'text-gray-700'}>
                    {input[step.key as keyof DiagnosisInput]
                      ? String(input[step.key as keyof DiagnosisInput])
                      : '~'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── 결과 화면 / Result screen ───
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* 헤더 / Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
        </div>
        <span className="text-gray-500 text-sm ml-2">jobchaja-visa-pipeline — run #{Math.floor(Math.random() * 9000 + 1000)}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 text-xs">
            <CheckCircle className="w-3.5 h-3.5" />
            passed
          </span>
          <button
            onClick={() => { setIsDiagnosed(false); setCurrentStep(0); setInput({}); setPipelineStage('source'); }}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-run
          </button>
        </div>
      </div>

      {/* 파이프라인 그래프 / Pipeline graph */}
      <div className="bg-gray-900/30 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto">
          {[
            { stage: 'source' as PipelineStage, label: 'source', icon: GitCommit },
            { stage: 'build' as PipelineStage, label: 'build', icon: Package },
            { stage: 'test' as PipelineStage, label: 'test', icon: Shield },
            { stage: 'deploy' as PipelineStage, label: 'deploy', icon: Server },
            { stage: 'done' as PipelineStage, label: 'done', icon: CheckSquare },
          ].map(({ stage, label, icon: Icon }, idx, arr) => (
            <React.Fragment key={stage}>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded border border-emerald-500/50 bg-emerald-500/10">
                  <NodeIcon status="success" />
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs">{label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400/60 text-xs">ok</span>
                </div>
              </div>
              {idx < arr.length - 1 && (
                <div className="flex-1 h-px bg-emerald-500/30 min-w-4 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* 요약 배너 / Summary banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-5 py-4 flex items-center gap-4">
          <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <div className="text-emerald-400 font-semibold">Pipeline Passed — {pathways.length} visa pathways found</div>
            <div className="text-gray-400 text-sm mt-0.5">
              총 {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로 분석,{' '}
              {mockDiagnosisResult.meta.hardFilteredOut}개 필터링 됨 / analyzed {mockDiagnosisResult.meta.totalPathwaysEvaluated}, filtered {mockDiagnosisResult.meta.hardFilteredOut}
            </div>
          </div>
          <div className="ml-auto text-xs text-gray-600">{mockDiagnosisResult.meta.timestamp}</div>
        </div>

        {/* 패스웨이 탭 / Pathway tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {pathways.map((pw, idx) => (
            <button
              key={pw.pathwayId}
              onClick={() => setSelectedPathway(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-xs whitespace-nowrap transition-all shrink-0 ${
                selectedPathway === idx
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-500 hover:border-gray-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${pw.finalScore >= 50 ? 'bg-emerald-400' : pw.finalScore >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`} />
              {pw.pathwayId}
            </button>
          ))}
        </div>

        {/* 선택된 패스웨이 상세 / Selected pathway detail */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {/* 패스웨이 헤더 / Pathway header */}
          <div className="border-b border-gray-800 px-5 py-4 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <GitBranch className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 text-xs">visa/{activePathway.visaChain.replace(/\s/g, '-')}</span>
                <span className={`ml-2 px-2 py-0.5 rounded border text-xs font-medium ${getBadgeColor(activePathway.finalScore)}`}>
                  {getFeasibilityEmoji(activePathway.finalScore)} {activePathway.feasibilityLabel}
                </span>
              </div>
              <h2 className="text-white font-semibold text-lg">{activePathway.nameKo}</h2>
              <p className="text-gray-500 text-sm">{activePathway.nameEn}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-white">{activePathway.finalScore}</div>
              <div className="text-gray-500 text-xs">score / 100</div>
            </div>
          </div>

          {/* 스코어 브레이크다운 / Score breakdown */}
          <div className="border-b border-gray-800 px-5 py-3">
            <div className="text-gray-500 text-xs mb-2">Score Breakdown</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { label: 'base', val: activePathway.scoreBreakdown.base },
                { label: 'age', val: activePathway.scoreBreakdown.ageMultiplier },
                { label: 'nation', val: activePathway.scoreBreakdown.nationalityMultiplier },
                { label: 'fund', val: activePathway.scoreBreakdown.fundMultiplier },
                { label: 'edu', val: activePathway.scoreBreakdown.educationMultiplier },
                { label: 'priority', val: activePathway.scoreBreakdown.priorityWeight },
              ].map(item => (
                <div key={item.label} className="bg-gray-800/50 rounded px-2 py-1.5 text-center">
                  <div className="text-gray-500 text-xs">{item.label}</div>
                  <div className="text-emerald-400 text-sm font-semibold">{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 핵심 메트릭 / Key metrics */}
          <div className="border-b border-gray-800 grid grid-cols-3 divide-x divide-gray-800">
            <div className="px-5 py-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Clock className="w-3.5 h-3.5" />
                기간 / Duration
              </div>
              <div className="text-white font-semibold">{activePathway.estimatedMonths}개월</div>
              <div className="text-gray-500 text-xs">{activePathway.estimatedMonths} months</div>
            </div>
            <div className="px-5 py-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <DollarSign className="w-3.5 h-3.5" />
                비용 / Cost
              </div>
              <div className="text-white font-semibold">{formatCost(activePathway.estimatedCostWon)}</div>
              <div className="text-gray-500 text-xs">estimated</div>
            </div>
            <div className="px-5 py-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Layers className="w-3.5 h-3.5" />
                비자 체인 / Visa Chain
              </div>
              <div className="text-white font-semibold text-sm">{activePathway.visaChain}</div>
              <div className="text-gray-500 text-xs">{activePathway.platformSupport}</div>
            </div>
          </div>

          {/* 마일스톤 파이프라인 / Milestone pipeline */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400 text-sm">Milestone Steps ({activePathway.milestones.length} stages)</span>
            </div>
            <div className="relative">
              {/* 수직선 / Vertical connector */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-800" />
              <div className="flex flex-col gap-3">
                {activePathway.milestones.map((ms, idx) => (
                  <div key={ms.order}>
                    <button
                      onClick={() => setExpandedMilestone(expandedMilestone === idx ? null : idx)}
                      className="relative w-full flex items-start gap-3 text-left group"
                    >
                      <div className="shrink-0 w-8 h-8 rounded border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center z-10">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm font-medium">{ms.nameKo}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs border ${
                            ms.visaStatus !== 'none'
                              ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                              : 'border-gray-700 bg-gray-800 text-gray-500'
                          }`}>
                            {ms.visaStatus !== 'none' ? ms.visaStatus : 'no visa'}
                          </span>
                          {ms.canWorkPartTime && (
                            <span className="px-1.5 py-0.5 rounded text-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                              work ✓
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600 text-xs mt-0.5">+{ms.monthFromStart}mo — {ms.type}</div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform ${expandedMilestone === idx ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedMilestone === idx && (
                      <div className="ml-11 mt-2 bg-gray-800/50 border border-gray-700/50 rounded p-3 text-xs text-gray-400 space-y-1.5">
                        <div><span className="text-gray-500">requirements: </span>{ms.requirements}</div>
                        <div><span className="text-gray-500">platform_action: </span><span className="text-blue-400">{ms.platformAction}</span></div>
                        {ms.canWorkPartTime && (
                          <div>
                            <span className="text-gray-500">weekly_hours: </span><span className="text-emerald-400">{ms.weeklyHours}h</span>
                            <span className="text-gray-500 ml-3">monthly_income: </span><span className="text-emerald-400">{ms.estimatedMonthlyIncome}만원</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 노트 / Note */}
          {activePathway.note && (
            <div className="border-t border-gray-800 px-5 py-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-yellow-400/80 text-xs">{activePathway.note}</p>
            </div>
          )}
        </div>

        {/* 빌드 로그 / Build log */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowLog(prev => !prev)}
            className="w-full border-b border-gray-800 px-5 py-3 flex items-center gap-2 hover:bg-gray-800/30 transition-colors"
          >
            <Terminal className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 text-sm">Build Log</span>
            <span className="ml-auto text-gray-600 text-xs">{logs.length} lines</span>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showLog ? 'rotate-180' : ''}`} />
          </button>
          {showLog && (
            <div className="p-4 bg-black/30 max-h-60 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                  <span className="text-gray-600 shrink-0 tabular-nums">{log.time}</span>
                  <span className={logColor(log.level)}>{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 다음 단계 / Next steps */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="border-b border-gray-800 px-5 py-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-400 text-sm">Next Steps ({activePathway.nextSteps.length} actions)</span>
          </div>
          <div className="divide-y divide-gray-800">
            {activePathway.nextSteps.map((step, idx) => (
              <div key={idx} className="px-5 py-3 flex items-start gap-3">
                <span className="text-gray-600 text-xs mt-0.5 w-5 shrink-0 tabular-nums">#{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-gray-200 text-sm font-medium">{step.nameKo}</span>
                    <span className="text-xs text-blue-400 border border-blue-400/20 bg-blue-400/5 px-1.5 py-0.5 rounded">
                      {step.actionType}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs">{step.description}</div>
                  {step.url && (
                    <div className="text-blue-400 text-xs mt-1 underline truncate">{step.url}</div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* 전체 패스웨이 요약 / All pathways summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="border-b border-gray-800 px-5 py-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 text-sm">All Pathways — Artifact Summary</span>
          </div>
          <div className="divide-y divide-gray-800">
            {pathways.map((pw, idx) => (
              <button
                key={pw.pathwayId}
                onClick={() => setSelectedPathway(idx)}
                className={`w-full px-5 py-3 flex items-center gap-4 text-left hover:bg-gray-800/30 transition-colors ${selectedPathway === idx ? 'bg-emerald-500/5' : ''}`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${pw.finalScore >= 50 ? 'bg-emerald-400' : pw.finalScore >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-gray-300 text-sm truncate">{pw.nameKo}</div>
                  <div className="text-gray-600 text-xs">{pw.visaChain}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-0.5 rounded border text-xs ${getBadgeColor(pw.finalScore)}`}>
                    {pw.finalScore}pts
                  </span>
                  <span className="text-gray-600 text-xs">{pw.estimatedMonths}mo</span>
                  <span className="text-gray-600 text-xs">{formatCost(pw.estimatedCostWon)}</span>
                </div>
                {selectedPathway === idx && <ChevronRight className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* CTA / Call to action */}
        <div className="bg-gray-900 border border-emerald-500/20 rounded-lg px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-emerald-400 font-semibold mb-1">잡차자에서 비자 경로 시작하기</div>
            <div className="text-gray-500 text-sm">Start your visa journey with JobChaja — full pipeline support</div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded text-sm hover:border-gray-400 transition-colors">
              공고 둘러보기
            </button>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm transition-colors font-semibold flex items-center gap-2">
              <Play className="w-3.5 h-3.5" />
              Deploy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
