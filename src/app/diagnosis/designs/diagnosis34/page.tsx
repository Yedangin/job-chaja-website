'use client';

// KOR: Design #34 — 코드 에디터 컨셉 비자 진단 페이지
// ENG: Design #34 — Code Editor concept visa diagnosis page
// VS Code 스타일 다크 테마, JSON 에디터 입력, 빌드 터미널 결과 출력
// VS Code style dark theme, JSON editor input, build terminal result output

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
  Play,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Folder,
  FileCode,
  GitBranch,
  Search,
  Settings,
  Package,
  Loader,
  Copy,
  Maximize2,
  Minimize2,
  Circle,
} from 'lucide-react';

// KOR: 입력 단계 순서 — 6단계 플로우
// ENG: Input step order — 6-step flow
type StepKey = keyof Pick<
  DiagnosisInput,
  'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference'
>;

const STEPS: { key: StepKey; label: string; labelEn: string; jsonKey: string }[] = [
  { key: 'nationality', label: '국적', labelEn: 'nationality', jsonKey: 'nationality' },
  { key: 'age', label: '나이', labelEn: 'age', jsonKey: 'age' },
  { key: 'educationLevel', label: '학력', labelEn: 'educationLevel', jsonKey: 'educationLevel' },
  { key: 'availableAnnualFund', label: '연간 가용 자금', labelEn: 'availableAnnualFund', jsonKey: 'availableAnnualFund' },
  { key: 'finalGoal', label: '최종 목표', labelEn: 'finalGoal', jsonKey: 'finalGoal' },
  { key: 'priorityPreference', label: '우선순위', labelEn: 'priorityPreference', jsonKey: 'priorityPreference' },
];

// KOR: 타입 힌트 생성 함수 — JSON 에디터에 표시되는 자동 완성 힌트
// ENG: Type hint generator — autocomplete hints shown in JSON editor
function getTypeHint(key: StepKey): string {
  switch (key) {
    case 'nationality': return '// string — e.g. "Vietnam", "China"';
    case 'age': return '// number — 18 ~ 65';
    case 'educationLevel': return '// "고등학교 졸업" | "전문학사" | "학사" | "석사" | "박사"';
    case 'availableAnnualFund': return '// "~ $5,000" | "$5,000 - $10,000" | "$10,000 - $20,000" | ...';
    case 'finalGoal': return '// "단기 취업" | "장기 취업" | "유학" | "영주권" | ...';
    case 'priorityPreference': return '// "가장 빠른 경로" | "가장 저렴한 비용" | "가장 높은 성공률" | ...';
    default: return '// string';
  }
}

// KOR: 점수에 따른 터미널 색상 클래스 반환
// ENG: Return terminal color class based on score
function getTerminalScoreClass(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

// KOR: JSON 문자열로 현재 입력 직렬화
// ENG: Serialize current input as JSON string
function serializeInput(input: Partial<DiagnosisInput>): string {
  const lines: string[] = ['{'];
  const keys = Object.keys(input) as (keyof DiagnosisInput)[];
  keys.forEach((k, i) => {
    const val = input[k];
    const comma = i < keys.length - 1 ? ',' : '';
    if (typeof val === 'string') {
      lines.push(`  "${k}": "${val}"${comma}`);
    } else {
      lines.push(`  "${k}": ${val}${comma}`);
    }
  });
  lines.push('}');
  return lines.join('\n');
}

// KOR: 사이드바 파일 트리 아이템
// ENG: Sidebar file tree item
function FileTreeItem({
  name,
  active,
  indent = 0,
  icon,
}: {
  name: string;
  active?: boolean;
  indent?: number;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-0.5 text-xs cursor-pointer select-none ${
        active ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
      }`}
      style={{ paddingLeft: `${8 + indent * 12}px` }}
    >
      {icon ?? <FileCode size={12} className="text-[#519aba] shrink-0" />}
      <span className="truncate">{name}</span>
    </div>
  );
}

// KOR: 라인 번호 컴포넌트
// ENG: Line number component
function LineNumbers({ count }: { count: number }) {
  return (
    <div className="select-none text-right pr-4 text-[#5a5a5a] text-xs font-mono leading-6 min-w-[2.5rem]">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}

// KOR: 구문 하이라이팅 — JSON 키/값 색상 구분
// ENG: Syntax highlighting — color-coded JSON keys and values
function HighlightedJson({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        // KOR: 중괄호 라인
        // ENG: Brace-only lines
        if (line.trim() === '{' || line.trim() === '}') {
          return (
            <div key={i} className="leading-6 text-xs font-mono">
              <span className="text-[#d4d4d4]">{line}</span>
            </div>
          );
        }
        // KOR: 키-값 파싱 (키: 노란색, 문자열값: 초록색, 숫자: 파란색)
        // ENG: Key-value parsing (key: yellow, string value: green, number: blue)
        const match = line.match(/^(\s*)("[\w]+")(\s*:\s*)(.+?)(,?)$/);
        if (match) {
          const [, indent2, key, colon, value, comma] = match;
          const isString = value.startsWith('"');
          const isNumber = !isNaN(Number(value.replace(',', '')));
          return (
            <div key={i} className="leading-6 text-xs font-mono">
              <span className="text-[#d4d4d4]">{indent2}</span>
              <span className="text-[#9cdcfe]">{key}</span>
              <span className="text-[#d4d4d4]">{colon}</span>
              {isString ? (
                <span className="text-[#ce9178]">{value}</span>
              ) : isNumber ? (
                <span className="text-[#b5cea8]">{value}</span>
              ) : (
                <span className="text-[#d4d4d4]">{value}</span>
              )}
              <span className="text-[#d4d4d4]">{comma}</span>
            </div>
          );
        }
        return (
          <div key={i} className="leading-6 text-xs font-mono">
            <span className="text-[#d4d4d4]">{line}</span>
          </div>
        );
      })}
    </>
  );
}

// KOR: 터미널 빌드 결과 — 단일 비자 경로 카드
// ENG: Terminal build result — single visa pathway card
function PathwayBuildCard({
  pathway,
  index,
  expanded,
  onToggle,
}: {
  pathway: RecommendedPathway;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const scoreClass = getTerminalScoreClass(pathway.feasibilityScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div className="border border-[#3c3c3c] rounded mb-2 overflow-hidden">
      {/* KOR: 카드 헤더 — 클릭으로 펼치기/접기 / ENG: Card header — click to expand/collapse */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 bg-[#252526] hover:bg-[#2a2d2e] text-left"
      >
        <span className="text-[#569cd6] font-mono text-xs">{`[${String(index + 1).padStart(2, '0')}]`}</span>
        {expanded ? (
          <ChevronDown size={12} className="text-[#808080] shrink-0" />
        ) : (
          <ChevronRight size={12} className="text-[#808080] shrink-0" />
        )}
        <span className="text-[#d4d4d4] font-mono text-xs flex-1 truncate">{pathway.name}</span>
        <span className={`font-mono text-xs font-bold ${scoreClass}`}>{pathway.feasibilityScore}%</span>
        <span className="text-sm">{emoji}</span>
        {/* KOR: 가능성 레이블 배지 / ENG: Feasibility label badge */}
        <span
          className={`text-xs px-1.5 py-0.5 rounded font-mono ${getScoreColor(pathway.feasibilityLabel)} text-white`}
        >
          {pathway.feasibilityLabel}
        </span>
      </button>

      {/* KOR: 카드 바디 — 상세 정보 / ENG: Card body — detailed info */}
      {expanded && (
        <div className="bg-[#1e1e1e] px-4 py-3 space-y-3 font-mono text-xs">
          {/* KOR: 설명 / ENG: Description */}
          <p className="text-[#6a9955] leading-5">{`// ${pathway.description}`}</p>

          {/* KOR: 비자 체인 / ENG: Visa chain */}
          <div>
            <span className="text-[#569cd6]">const </span>
            <span className="text-[#9cdcfe]">visaChain</span>
            <span className="text-[#d4d4d4]"> = [</span>
            <div className="ml-4 mt-1 space-y-0.5">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                <div key={i}>
                  <span className="text-[#d4d4d4]">{'  { '}</span>
                  <span className="text-[#9cdcfe]">visa</span>
                  <span className="text-[#d4d4d4]">: </span>
                  <span className="text-[#ce9178]">{`"${v.visa}"`}</span>
                  <span className="text-[#d4d4d4]">, </span>
                  <span className="text-[#9cdcfe]">duration</span>
                  <span className="text-[#d4d4d4]">: </span>
                  <span className="text-[#ce9178]">{`"${v.duration}"`}</span>
                  <span className="text-[#d4d4d4]">{' }' + (i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 ? ',' : '')}</span>
                </div>
              ))}
            </div>
            <span className="text-[#d4d4d4]">];</span>
          </div>

          {/* KOR: 소요 기간 및 비용 / ENG: Duration and cost */}
          <div className="flex gap-6">
            <div>
              <span className="text-[#569cd6]">const </span>
              <span className="text-[#9cdcfe]">estimatedMonths</span>
              <span className="text-[#d4d4d4]"> = </span>
              <span className="text-[#b5cea8]">{pathway.totalDurationMonths}</span>
              <span className="text-[#d4d4d4]">;</span>
              <span className="text-[#5a5a5a] ml-2">// months</span>
            </div>
            <div>
              <span className="text-[#569cd6]">const </span>
              <span className="text-[#9cdcfe]">estimatedCostUSD</span>
              <span className="text-[#d4d4d4]"> = </span>
              <span className="text-[#b5cea8]">{((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
              <span className="text-[#d4d4d4]">;</span>
              <span className="text-[#5a5a5a] ml-2">// USD</span>
            </div>
          </div>

          {/* KOR: 마일스톤 / ENG: Milestones */}
          <div>
            <span className="text-[#569cd6]">const </span>
            <span className="text-[#9cdcfe]">milestones</span>
            <span className="text-[#d4d4d4]"> = [</span>
            <div className="ml-4 mt-1 space-y-1">
              {pathway.milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#5a5a5a]">{i + 1}.</span>
                  <span className="text-sm">{m.emoji}</span>
                  <div>
                    <span className="text-[#dcdcaa]">{m.title}</span>
                    <span className="text-[#5a5a5a]"> — </span>
                    <span className="text-[#6a9955]">{m.description}</span>
                  </div>
                </div>
              ))}
            </div>
            <span className="text-[#d4d4d4]">];</span>
          </div>
        </div>
      )}
    </div>
  );
}

// KOR: 파일 트리 사이드바에 표시할 호환 경로 목록 (mockPathways 활용)
// ENG: Compatible pathway list shown in file tree sidebar (uses mockPathways)
const COMPAT_ITEMS: CompatPathway[] = mockPathways;

// KOR: 미리 채워진 예시 입력 (mockInput 기반 — 샘플 안내용)
// ENG: Pre-filled example input (based on mockInput — for sample guidance)
const EXAMPLE_INPUT: DiagnosisInput = mockInput;

// KOR: 메인 진단 페이지 컴포넌트
// ENG: Main diagnosis page component
export default function Diagnosis34Page() {
  // KOR: 현재 입력 단계 인덱스 (0~5)
  // ENG: Current input step index (0~5)
  const [stepIndex, setStepIndex] = useState<number>(0);

  // KOR: 사용자가 입력한 진단 데이터
  // ENG: Diagnosis data entered by the user
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 현재 필드에 타이핑 중인 값
  // ENG: Value currently being typed in the current field
  const [currentValue, setCurrentValue] = useState<string>('');

  // KOR: 에러 메시지 (입력 검증 실패 시)
  // ENG: Error message (on input validation failure)
  const [error, setError] = useState<string | null>(null);

  // KOR: 진단 실행 상태 (빌드 로딩)
  // ENG: Diagnosis running state (build loading)
  const [isBuilding, setIsBuilding] = useState<boolean>(false);

  // KOR: 빌드 완료 — 결과 표시 여부
  // ENG: Build complete — whether to show results
  const [showResult, setShowResult] = useState<boolean>(false);

  // KOR: 결과 데이터 (mockDiagnosisResult로 고정)
  // ENG: Result data (fixed to mockDiagnosisResult)
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 펼쳐진 경로 카드 인덱스
  // ENG: Index of expanded pathway card
  const [expandedPath, setExpandedPath] = useState<number | null>(0);

  // KOR: 터미널 패널 최대화 여부
  // ENG: Whether terminal panel is maximized
  const [terminalMax, setTerminalMax] = useState<boolean>(false);

  // KOR: 빌드 로그 줄 목록 (터미널 출력)
  // ENG: Build log lines (terminal output)
  const [buildLog, setBuildLog] = useState<{ text: string; type: 'info' | 'success' | 'error' | 'warn' }[]>([]);

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const allStepsComplete = stepIndex >= STEPS.length;

  // KOR: JSON 직렬화된 현재 입력 (에디터에 표시)
  // ENG: JSON-serialized current input (shown in editor)
  const displayInput: Partial<DiagnosisInput> = {
    ...input,
    ...(currentStep && !allStepsComplete && currentValue
      ? { [currentStep.key]: currentStep.key === 'age' ? Number(currentValue) || currentValue : currentValue }
      : {}),
  };
  const jsonText = serializeInput(displayInput);
  const jsonLineCount = jsonText.split('\n').length;

  // KOR: 현재 단계의 옵션 목록 반환
  // ENG: Return option list for current step
  function getOptions(): string[] {
    if (!currentStep) return [];
    switch (currentStep.key) {
      case 'nationality': return popularCountries.map((c) => `${c.flag} ${c.name}`);
      case 'educationLevel': return educationOptions;
      case 'availableAnnualFund': return fundOptions;
      case 'finalGoal': return goalOptions;
      case 'priorityPreference': return priorityOptions;
      default: return [];
    }
  }

  // KOR: 옵션 선택 핸들러
  // ENG: Option selection handler
  function handleOptionSelect(option: string) {
    const clean = option.replace(/^[^\w$가-힣]+\s/, '').trim();
    if (currentStep.key === 'nationality') {
      // KOR: 이모지 제거 후 국가명만 저장
      // ENG: Remove emoji and store only country name
      const countryName = option.split(' ').slice(1).join(' ').trim();
      setCurrentValue(countryName);
    } else {
      setCurrentValue(clean);
    }
    setError(null);
  }

  // KOR: 단계 진행 — 현재 값 검증 후 다음 단계로
  // ENG: Step advance — validate current value then move to next step
  function handleNext() {
    setError(null);
    if (currentStep.key === 'age') {
      const num = Number(currentValue);
      if (!currentValue || isNaN(num) || num < 18 || num > 65) {
        setError('ERR: age must be a number between 18 and 65');
        return;
      }
      setInput((prev) => ({ ...prev, age: num }));
    } else {
      if (!currentValue.trim()) {
        setError(`ERR: "${currentStep.key}" is required — value cannot be empty`);
        return;
      }
      setInput((prev) => ({ ...prev, [currentStep.key]: currentValue.trim() }));
    }
    setCurrentValue('');
    setStepIndex((prev) => prev + 1);
  }

  // KOR: 빌드(진단) 실행 함수 — 로딩 후 결과 표시
  // ENG: Build (diagnosis) execution — show results after loading
  function handleBuild() {
    setIsBuilding(true);
    setBuildLog([]);
    const logs: { text: string; type: 'info' | 'success' | 'error' | 'warn' }[] = [
      { text: '> visa-engine@3.1.0 evaluate', type: 'info' },
      { text: '> Initializing RuleEngineService...', type: 'info' },
      { text: '> Loading 31 visa types from DB...', type: 'info' },
      { text: '> Running 14 Evaluators...', type: 'info' },
      { text: '  ✔ E7Evaluator        passed', type: 'success' },
      { text: '  ✔ D2Evaluator        passed', type: 'success' },
      { text: '  ✔ F2Evaluator        passed', type: 'success' },
      { text: '  ✔ E9Evaluator        passed', type: 'success' },
      { text: '  ✔ H2Evaluator        passed', type: 'success' },
      { text: '  ✔ PointsEvaluator    passed', type: 'success' },
      { text: '  ⚠ E1Evaluator        WARN: low feasibility', type: 'warn' },
      { text: '  ✘ E3Evaluator        FAIL: education mismatch', type: 'error' },
      { text: '> Scoring & ranking pathways...', type: 'info' },
      { text: `> Found ${mockDiagnosisResult.pathways.length} viable pathways`, type: 'success' },
      { text: '> Build complete. Elapsed: 1.24s', type: 'success' },
    ];

    // KOR: 로그를 300ms 간격으로 순차 출력 (터미널 효과)
    // ENG: Output logs sequentially at 300ms intervals (terminal effect)
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setBuildLog((prev) => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsBuilding(false);
        setResult(mockDiagnosisResult);
        setShowResult(true);
      }
    }, 280);
  }

  // KOR: 진단 초기화
  // ENG: Reset diagnosis
  function handleReset() {
    setStepIndex(0);
    setInput({});
    setCurrentValue('');
    setError(null);
    setIsBuilding(false);
    setShowResult(false);
    setResult(null);
    setBuildLog([]);
    setExpandedPath(0);
  }

  // KOR: VS Code 탭 타이틀 생성
  // ENG: Generate VS Code tab title
  const tabTitle = allStepsComplete ? 'diagnosis-result.json' : 'visa-diagnosis.json';

  return (
    // KOR: 전체 레이아웃 — VS Code 다크 테마 배경
    // ENG: Full layout — VS Code dark theme background
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#d4d4d4] font-mono overflow-hidden select-none">

      {/* ── 최상단 메뉴바 / Top menu bar ── */}
      <div className="flex items-center h-8 bg-[#3c3c3c] px-3 gap-4 shrink-0 z-10">
        <div className="flex gap-1.5">
          <Circle size={12} className="text-[#ff5f57] fill-[#ff5f57]" />
          <Circle size={12} className="text-[#febc2e] fill-[#febc2e]" />
          <Circle size={12} className="text-[#28c840] fill-[#28c840]" />
        </div>
        <span className="text-[#cccccc] text-xs">잡차자 — 비자 진단 엔진 v3.1.0</span>
        <span className="text-[#808080] text-xs ml-auto">JobChaja Visa Diagnosis Engine</span>
      </div>

      {/* ── VS Code 메인 레이아웃 / VS Code main layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── 좌측 액티비티 바 / Left activity bar ── */}
        <div className="flex flex-col items-center gap-4 w-10 bg-[#333333] py-3 shrink-0">
          <Folder size={20} className="text-[#cccccc] hover:text-white cursor-pointer" />
          <Search size={20} className="text-[#858585] hover:text-white cursor-pointer" />
          <GitBranch size={20} className="text-[#858585] hover:text-white cursor-pointer" />
          <Package size={20} className="text-[#858585] hover:text-white cursor-pointer" />
          <Settings size={20} className="text-[#858585] hover:text-white cursor-pointer mt-auto" />
        </div>

        {/* ── 좌측 파일 탐색기 / Left file explorer ── */}
        <div className="w-44 bg-[#252526] border-r border-[#3c3c3c] shrink-0 overflow-y-auto">
          <div className="px-2 py-1.5 text-[10px] text-[#bbbbbb] uppercase tracking-widest font-sans">
            Explorer
          </div>
          <div className="text-[10px] text-[#cccccc] px-2 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e]">
            <ChevronDown size={10} />
            <span>JOBCHAJA</span>
          </div>
          <FileTreeItem name="visa-rules/" indent={1} icon={<Folder size={12} className="text-[#dcb67a] shrink-0" />} />
          <FileTreeItem name="evaluators/" indent={2} icon={<Folder size={12} className="text-[#dcb67a] shrink-0" />} />
          <FileTreeItem name="E7Evaluator.ts" indent={3} />
          <FileTreeItem name="D2Evaluator.ts" indent={3} />
          <FileTreeItem name="F2Evaluator.ts" indent={3} />
          <FileTreeItem name="diagnosis/" indent={1} icon={<Folder size={12} className="text-[#dcb67a] shrink-0" />} />
          <FileTreeItem name="visa-diagnosis.json" indent={2} active={!showResult} />
          <FileTreeItem name="diagnosis-result.json" indent={2} active={showResult} />
          <FileTreeItem name="engine.service.ts" indent={2} />
          {/* KOR: 호환 경로 파일 목록 (COMPAT_ITEMS 기반) / ENG: Compat pathway files (based on COMPAT_ITEMS) */}
          {COMPAT_ITEMS.map((cp) => (
            <FileTreeItem key={cp.id} name={`${cp.name}.json`} indent={2} />
          ))}
        </div>

        {/* ── 메인 에디터 + 터미널 영역 / Main editor + terminal area ── */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* ── 상단 탭 바 / Top tab bar ── */}
          <div className="flex items-center h-9 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
            <div className="flex items-center gap-2 px-4 h-full bg-[#1e1e1e] border-r border-[#3c3c3c] border-t-2 border-t-[#007acc]">
              <FileCode size={13} className="text-[#519aba]" />
              <span className="text-xs text-[#cccccc]">{tabTitle}</span>
            </div>
          </div>

          {/* ── 에디터 + 결과 분할 / Editor + result split ── */}
          <div className={`flex flex-1 overflow-hidden ${terminalMax ? 'flex-col' : 'flex-col'}`}>

            {/* ── JSON 에디터 영역 / JSON editor area ── */}
            {!terminalMax && (
              <div className="flex flex-1 overflow-auto bg-[#1e1e1e] relative">

                {/* KOR: 줄 번호 / ENG: Line numbers */}
                <LineNumbers count={jsonLineCount} />

                {/* KOR: 코드 뷰 / ENG: Code view */}
                <div className="flex-1 pr-4 py-1 overflow-x-auto">
                  <HighlightedJson text={jsonText} />

                  {/* KOR: 현재 입력 단계 표시 — 커서 블록 / ENG: Current input step — cursor block */}
                  {!allStepsComplete && (
                    <div className="mt-1 ml-0">
                      <div className="text-xs text-[#6a9955] leading-6">{`  ${getTypeHint(currentStep.key)}`}</div>
                      <div className="flex items-center gap-1 leading-6 text-xs">
                        <span className="text-[#d4d4d4]">{`  "`}</span>
                        <span className="text-[#9cdcfe]">{currentStep.jsonKey}</span>
                        <span className="text-[#d4d4d4]">{`":`}</span>

                        {/* KOR: 나이 입력은 텍스트 필드 / ENG: Age input uses text field */}
                        {currentStep.key === 'age' ? (
                          <input
                            type="number"
                            value={currentValue}
                            onChange={(e) => { setCurrentValue(e.target.value); setError(null); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleNext(); }}
                            placeholder={String(EXAMPLE_INPUT.age)}
                            className="bg-transparent text-[#b5cea8] text-xs outline-none border-b border-[#007acc] w-16 ml-1"
                            autoFocus
                          />
                        ) : (
                          <span className="text-[#ce9178] ml-1 animate-pulse">|</span>
                        )}
                        <span className="text-[#d4d4d4]">,</span>
                      </div>

                      {/* KOR: 자동 완성 드롭다운 (옵션 있을 때) / ENG: Autocomplete dropdown (when options exist) */}
                      {currentStep.key !== 'age' && getOptions().length > 0 && (
                        <div className="ml-4 mt-1 border border-[#454545] rounded bg-[#252526] shadow-lg max-h-48 overflow-y-auto w-80">
                          <div className="px-2 py-1 text-[10px] text-[#808080] border-b border-[#3c3c3c]">
                            자동 완성 — Autocomplete
                          </div>
                          {getOptions().map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleOptionSelect(opt)}
                              className={`w-full text-left px-3 py-1 text-xs hover:bg-[#094771] ${
                                currentValue === opt.split(' ').slice(1).join(' ').trim() ||
                                currentValue === opt
                                  ? 'bg-[#094771] text-white'
                                  : 'text-[#cccccc]'
                              }`}
                            >
                              <span className="text-[#ce9178]">&quot;</span>
                              <span>{opt}</span>
                              <span className="text-[#ce9178]">&quot;</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* KOR: 에러 밑줄 표시 / ENG: Error underline indicator */}
                      {error && (
                        <div className="mt-2 flex items-start gap-2 text-xs">
                          <XCircle size={13} className="text-red-500 shrink-0 mt-0.5" />
                          <span className="text-red-400 font-mono">{error}</span>
                        </div>
                      )}

                      {/* KOR: 단계 진행 버튼 / ENG: Step advance button */}
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={handleNext}
                          className="flex items-center gap-1.5 px-3 py-1 bg-[#007acc] hover:bg-[#1f8ad2] text-white text-xs rounded transition-colors"
                        >
                          <ChevronRight size={12} />
                          {isLastStep ? 'Complete Input' : 'Next Field (Enter)'}
                        </button>
                        <span className="text-[#808080] text-xs">
                          Step {stepIndex + 1} / {STEPS.length}
                        </span>
                        {/* KOR: 진행 미니맵 / ENG: Progress minimap */}
                        <div className="flex gap-1">
                          {STEPS.map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-5 rounded-sm ${
                                i < stepIndex
                                  ? 'bg-[#007acc]'
                                  : i === stepIndex
                                  ? 'bg-[#569cd6]'
                                  : 'bg-[#3c3c3c]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KOR: 모든 입력 완료 — 빌드 실행 버튼 / ENG: All input complete — run build button */}
                  {allStepsComplete && !showResult && !isBuilding && (
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={handleBuild}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4caf50] hover:bg-[#43a047] text-white text-xs rounded font-sans font-semibold transition-colors"
                      >
                        <Play size={13} className="fill-white" />
                        Run Diagnosis Build
                      </button>
                      <span className="text-[#6a9955] text-xs">// 입력 완료 — 진단을 실행하세요</span>
                    </div>
                  )}

                  {/* KOR: 빌드 중 스피너 / ENG: Building spinner */}
                  {isBuilding && (
                    <div className="mt-4 flex items-center gap-2 text-[#dcdcaa] text-xs">
                      <Loader size={13} className="animate-spin" />
                      <span>Building visa diagnosis... please wait</span>
                    </div>
                  )}
                </div>

                {/* KOR: 우측 미니맵 / ENG: Right minimap */}
                <div className="w-16 bg-[#1e1e1e] border-l border-[#3c3c3c] shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 40 }, (_, i) => (
                      <div
                        key={i}
                        className="h-1 mx-1 my-px rounded-sm"
                        style={{
                          backgroundColor: i % 7 === 0 ? '#9cdcfe' : i % 5 === 0 ? '#ce9178' : '#6a9955',
                          width: `${30 + Math.random() * 50}%`,
                        }}
                      />
                    ))}
                  </div>
                  {/* KOR: 현재 뷰포트 위치 표시 / ENG: Current viewport position indicator */}
                  <div className="absolute top-0 left-0 right-0 h-16 bg-white opacity-5 border border-white border-opacity-10" />
                </div>
              </div>
            )}

            {/* ── 터미널 패널 / Terminal panel ── */}
            <div
              className={`bg-[#1e1e1e] border-t border-[#3c3c3c] flex flex-col ${
                terminalMax ? 'flex-1' : 'h-64'
              } shrink-0`}
            >
              {/* KOR: 터미널 탭 바 / ENG: Terminal tab bar */}
              <div className="flex items-center h-8 bg-[#252526] border-b border-[#3c3c3c] px-3 gap-3 shrink-0">
                <Terminal size={13} className="text-[#cccccc]" />
                <span className="text-xs text-[#cccccc]">TERMINAL</span>
                <span className="text-[#3c3c3c]">|</span>
                <span className="text-xs text-[#4ec9b0]">bash</span>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setTerminalMax((v) => !v)}
                    className="text-[#808080] hover:text-white"
                  >
                    {terminalMax ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  </button>
                </div>
              </div>

              {/* KOR: 터미널 출력 / ENG: Terminal output */}
              <div className="flex-1 overflow-y-auto px-4 py-2 text-xs leading-6 space-y-0">
                {/* KOR: 초기 프롬프트 / ENG: Initial prompt */}
                <div className="text-[#4ec9b0]">
                  jobchaja@visa-engine:~$ <span className="text-[#cccccc]">npm run evaluate --silent</span>
                </div>

                {/* KOR: 빌드 로그 출력 / ENG: Build log output */}
                {buildLog.map((log, i) => (
                  <div
                    key={i}
                    className={`${
                      log.type === 'success'
                        ? 'text-green-400'
                        : log.type === 'error'
                        ? 'text-red-400'
                        : log.type === 'warn'
                        ? 'text-yellow-400'
                        : 'text-[#cccccc]'
                    }`}
                  >
                    {log.text}
                  </div>
                ))}

                {/* KOR: 빌드 완료 후 결과 요약 / ENG: Result summary after build complete */}
                {showResult && result && (
                  <div className="mt-2">
                    <div className="text-green-400 font-bold">
                      ✔ Build succeeded — {result.pathways.length} pathways evaluated
                    </div>
                    <div className="text-[#4ec9b0] mt-1">
                      jobchaja@visa-engine:~$ <span className="text-[#cccccc]">cat diagnosis-result.json | less</span>
                    </div>
                    <div className="mt-1 text-[#808080]">
                      // 아래 결과 패널에서 상세 경로를 확인하세요 / See pathway details in result panel below
                    </div>
                  </div>
                )}

                {/* KOR: 빌드 대기 상태 / ENG: Awaiting build state */}
                {!isBuilding && !showResult && buildLog.length === 0 && (
                  <div className="text-[#808080]">
                    // 모든 필드를 입력한 후 &apos;Run Diagnosis Build&apos; 를 클릭하세요
                    <br />
                    // After filling all fields, click &apos;Run Diagnosis Build&apos;
                  </div>
                )}

                {isBuilding && (
                  <div className="flex items-center gap-2 text-[#dcdcaa] mt-1">
                    <Loader size={11} className="animate-spin" />
                    <span>evaluating...</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── 결과 패널 — 경로 목록 / Result panel — pathway list ── */}
            {showResult && result && (
              <div className="border-t border-[#3c3c3c] bg-[#1e1e1e] overflow-y-auto" style={{ maxHeight: '40vh' }}>
                {/* KOR: 결과 헤더 / ENG: Result header */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] sticky top-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-[#cccccc] font-sans">
                      diagnosis-result.json — {result.pathways.length} pathways
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs text-[#cccccc] hover:text-white border border-[#3c3c3c] hover:border-[#808080] rounded transition-colors"
                    >
                      <Copy size={10} />
                      Reset
                    </button>
                  </div>
                </div>

                {/* KOR: 결과 통계 바 / ENG: Result stats bar */}
                <div className="flex gap-6 px-4 py-2 bg-[#252526] border-b border-[#3c3c3c] text-xs font-mono">
                  <div>
                    <span className="text-[#569cd6]">const </span>
                    <span className="text-[#9cdcfe]">diagnosisId</span>
                    <span className="text-[#d4d4d4]"> = </span>
                    <span className="text-[#ce9178]">&quot;{result.id}&quot;</span>
                    <span className="text-[#d4d4d4]">;</span>
                  </div>
                  <div>
                    <span className="text-[#569cd6]">const </span>
                    <span className="text-[#9cdcfe]">nationality</span>
                    <span className="text-[#d4d4d4]"> = </span>
                    <span className="text-[#ce9178]">&quot;{result.userInput.nationality}&quot;</span>
                    <span className="text-[#d4d4d4]">;</span>
                  </div>
                  <div>
                    <span className="text-[#569cd6]">const </span>
                    <span className="text-[#9cdcfe]">pathwayCount</span>
                    <span className="text-[#d4d4d4]"> = </span>
                    <span className="text-[#b5cea8]">{result.pathways.length}</span>
                    <span className="text-[#d4d4d4]">;</span>
                  </div>
                </div>

                {/* KOR: 경로 카드 목록 / ENG: Pathway card list */}
                <div className="px-4 py-3">
                  {result.pathways.map((pathway, i) => (
                    <PathwayBuildCard
                      key={pathway.id}
                      pathway={pathway}
                      index={i}
                      expanded={expandedPath === i}
                      onToggle={() => setExpandedPath(expandedPath === i ? null : i)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 하단 상태바 / Bottom status bar ── */}
      <div className="flex items-center h-6 bg-[#007acc] px-3 gap-4 shrink-0 text-white text-[10px]">
        <div className="flex items-center gap-1">
          <GitBranch size={11} />
          <span>main</span>
        </div>
        <span>|</span>
        <div className="flex items-center gap-1">
          {showResult ? (
            <CheckCircle size={11} className="text-green-300" />
          ) : isBuilding ? (
            <Loader size={11} className="animate-spin" />
          ) : (
            <AlertCircle size={11} className="text-yellow-300" />
          )}
          <span>
            {showResult
              ? `Build: OK — ${result?.pathways.length} pathways`
              : isBuilding
              ? 'Building...'
              : `Step ${Math.min(stepIndex + 1, STEPS.length)} / ${STEPS.length}`}
          </span>
        </div>
        <span className="ml-auto">JSON</span>
        <span>UTF-8</span>
        <span>Ln {jsonLineCount}</span>
      </div>
    </div>
  );
}
