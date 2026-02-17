'use client';

// KOR: 디자인 #6 — 터미널 CLI 스타일 비자 진단 페이지
// ENG: Design #6 — Terminal CLI style visa diagnosis page
// Style: Dark + Green monochrome, monospace font, blinking cursor, autocomplete, syntax highlighting

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ChevronRight,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';

// ============================================================
// KOR: 타입 정의 / ENG: Type definitions
// ============================================================

// KOR: 터미널 히스토리 라인 타입 / ENG: Terminal history line type
interface TerminalLine {
  id: number;
  type:
    | 'prompt'
    | 'output'
    | 'system'
    | 'error'
    | 'success'
    | 'json'
    | 'table'
    | 'ascii'
    | 'blank';
  content: string;
  color?: string;
}

// KOR: 진단 입력 단계 타입 / ENG: Diagnosis input step type
type InputStep =
  | 'welcome'
  | 'nationality'
  | 'age'
  | 'education'
  | 'fund'
  | 'goal'
  | 'priority'
  | 'analyzing'
  | 'result';

// KOR: 자동완성 제안 타입 / ENG: Autocomplete suggestion type
interface Suggestion {
  value: string;
  display: string;
}

// ============================================================
// KOR: 유틸 함수 / ENG: Utility functions
// ============================================================

// KOR: 현재 타임스탬프 반환 / ENG: Return current timestamp string
const getTimestamp = (): string =>
  new Date().toISOString().slice(0, 19).replace('T', ' ');

// KOR: 숫자 천 단위 쉼표 포맷 / ENG: Format number with commas
const formatNumber = (n: number): string => n.toLocaleString('ko-KR');

// KOR: ASCII 프로그레스 바 생성 (score 0-100) / ENG: Generate ASCII progress bar
const makeProgressBar = (score: number, width: number = 20): string => {
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${score}/100`;
};

// KOR: 점수에 따른 텍스트 색상 클래스 / ENG: Text color class by score
const scoreColorClass = (score: number): string => {
  if (score >= 60) return 'text-green-400';
  if (score >= 40) return 'text-cyan-400';
  if (score >= 20) return 'text-yellow-400';
  return 'text-red-400';
};

// KOR: 비용(만원) 포맷 / ENG: Format cost in 만원
const formatCostWon = (won: number): string =>
  won === 0 ? '무료' : `${formatNumber(won)}만원`;

// KOR: 현재 단계에서 자동완성 제안 생성 / ENG: Generate autocomplete suggestions for current step
const getSuggestions = (step: InputStep, query: string): Suggestion[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  switch (step) {
    case 'nationality':
      return popularCountries
        .filter(
          (c) =>
            c.nameKo.includes(q) ||
            c.nameEn.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((c, i) => ({
          value: String(i + 1),
          display: `${c.flag} ${c.nameKo} / ${c.nameEn} (${c.code})`,
        }));

    case 'education':
      return educationOptions
        .filter(
          (e) =>
            e.labelKo.includes(q) ||
            e.labelEn.toLowerCase().includes(q) ||
            e.value.toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((e, i) => ({
          value: String(i + 1),
          display: `${e.emoji} ${e.labelKo} / ${e.labelEn}`,
        }));

    case 'fund':
      return fundOptions
        .filter(
          (f) =>
            f.labelKo.includes(q) ||
            f.labelEn.toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((f, i) => ({
          value: String(i + 1),
          display: `${f.labelKo} / ${f.labelEn}`,
        }));

    case 'goal':
      return goalOptions
        .filter(
          (g) =>
            g.labelKo.includes(q) ||
            g.labelEn.toLowerCase().includes(q) ||
            g.value.toLowerCase().includes(q)
        )
        .slice(0, 4)
        .map((g, i) => ({
          value: String(i + 1),
          display: `${g.emoji} ${g.labelKo} / ${g.labelEn}`,
        }));

    case 'priority':
      return priorityOptions
        .filter(
          (p) =>
            p.labelKo.includes(q) ||
            p.labelEn.toLowerCase().includes(q) ||
            p.value.toLowerCase().includes(q)
        )
        .slice(0, 4)
        .map((p, i) => ({
          value: String(i + 1),
          display: `${p.emoji} ${p.labelKo} — ${p.descKo}`,
        }));

    default:
      return [];
  }
};

// ============================================================
// KOR: 메인 페이지 컴포넌트 / ENG: Main page component
// ============================================================

export default function Diagnosis6Page() {
  // KOR: 터미널 히스토리 라인 / ENG: Terminal history lines
  const [lines, setLines] = useState<TerminalLine[]>([]);

  // KOR: 현재 입력 단계 / ENG: Current input step
  const [currentStep, setCurrentStep] = useState<InputStep>('welcome');

  // KOR: 입력창 텍스트 값 / ENG: Input field text value
  const [inputValue, setInputValue] = useState<string>('');

  // KOR: 자동완성 제안 목록 / ENG: Autocomplete suggestions list
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // KOR: 선택된 자동완성 인덱스 / ENG: Selected autocomplete index
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState<number>(-1);

  // KOR: 자동완성 표시 여부 / ENG: Whether to show autocomplete
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // KOR: 타이핑(출력 중) 여부 / ENG: Whether terminal is outputting
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // KOR: 수집된 진단 입력 데이터 / ENG: Collected diagnosis input data
  const [diagnosisInput, setDiagnosisInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 전체화면 여부 / ENG: Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // KOR: 복사 완료 상태 / ENG: Copy success state
  const [copied, setCopied] = useState<boolean>(false);

  // KOR: 커서 깜빡임 상태 / ENG: Cursor blink state
  const [showCursor, setShowCursor] = useState<boolean>(true);

  // KOR: 명령어 히스토리 / ENG: Command history
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // KOR: 히스토리 탐색 인덱스 / ENG: History navigation index
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // KOR: 터미널 스크롤 영역 ref / ENG: Terminal scroll area ref
  const terminalRef = useRef<HTMLDivElement>(null);

  // KOR: 입력창 ref / ENG: Input field ref
  const inputRef = useRef<HTMLInputElement>(null);

  // KOR: 라인 ID 카운터 ref / ENG: Line ID counter ref
  const lineIdRef = useRef<number>(0);

  // KOR: 고유 라인 ID 생성 / ENG: Generate unique line ID
  const nextId = (): number => {
    lineIdRef.current += 1;
    return lineIdRef.current;
  };

  // KOR: 단일 라인 터미널에 추가 / ENG: Add single line to terminal
  const addLine = useCallback(
    (type: TerminalLine['type'], content: string, color?: string) => {
      setLines((prev) => [
        ...prev,
        { id: nextId(), type, content, color },
      ]);
    },
    []
  );

  // KOR: 여러 라인을 딜레이와 함께 순차 추가 / ENG: Add multiple lines sequentially with delay
  const addLinesSequentially = useCallback(
    async (
      newLines: Array<{ type: TerminalLine['type']; content: string; color?: string }>,
      delayMs: number = 30
    ): Promise<void> => {
      for (const line of newLines) {
        await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
        setLines((prev) => [
          ...prev,
          { id: nextId(), type: line.type, content: line.content, color: line.color },
        ]);
      }
    },
    []
  );

  // KOR: 터미널 스크롤 자동 하단 / ENG: Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // KOR: 커서 깜빡임 인터벌 / ENG: Cursor blink interval
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // KOR: 입력창 포커스 유지 / ENG: Keep input focused
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // KOR: 웰컴 메시지 초기 출력 / ENG: Output initial welcome message
  useEffect(() => {
    const showWelcome = async () => {
      setIsTyping(true);

      const welcomeLines: Array<{ type: TerminalLine['type']; content: string }> = [
        { type: 'ascii', content: '' },
        { type: 'ascii', content: '  ██╗ ██████╗ ██████╗      ██████╗██╗  ██╗ █████╗      ██╗ █████╗ ' },
        { type: 'ascii', content: '  ██║██╔═══██╗██╔══██╗    ██╔════╝██║  ██║██╔══██╗     ██║██╔══██╗' },
        { type: 'ascii', content: '  ██║██║   ██║██████╔╝    ██║     ███████║███████║     ██║███████║' },
        { type: 'ascii', content: '  ██║██║   ██║██╔══██╗    ██║     ██╔══██║██╔══██║██   ██║██╔══██║' },
        { type: 'ascii', content: '  ██║╚██████╔╝██████╔╝    ╚██████╗██║  ██║██║  ██║╚█████╔╝██║  ██║' },
        { type: 'ascii', content: '  ╚═╝ ╚═════╝ ╚═════╝      ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝ ╚═╝  ╚═╝' },
        { type: 'ascii', content: '' },
        { type: 'system', content: '─'.repeat(72) },
        { type: 'system', content: `  JOBCHAJA Visa Diagnosis CLI v2.1.0  |  ${getTimestamp()}` },
        { type: 'system', content: '  비자 진단 터미널 / Visa Diagnosis Terminal' },
        { type: 'system', content: '─'.repeat(72) },
        { type: 'blank', content: '' },
        { type: 'success', content: '  [OK] 비자 규칙 DB 로드 완료 (31개 비자 유형)' },
        { type: 'success', content: '  [OK] 매칭 엔진 준비 완료 (14개 Evaluator)' },
        { type: 'success', content: '  [OK] 2,629개 테스트 케이스 검증됨' },
        { type: 'blank', content: '' },
        { type: 'output', content: '  사용 가능한 명령어 / Available commands:' },
        { type: 'blank', content: '' },
        { type: 'output', content: '    diagnose, d    비자 진단 시작 / Start visa diagnosis' },
        { type: 'output', content: '    help, h        도움말 / Help' },
        { type: 'output', content: '    clear, cls     화면 지우기 / Clear terminal' },
        { type: 'output', content: '    reset          초기화 / Reset' },
        { type: 'output', content: '    export         결과 복사 / Copy results JSON' },
        { type: 'blank', content: '' },
        { type: 'success', content: '  → "diagnose" 또는 "d"를 입력하여 시작하세요.' },
        { type: 'success', content: '  → Type "diagnose" or "d" to begin.' },
        { type: 'blank', content: '' },
      ];

      await addLinesSequentially(welcomeLines, 22);
      setIsTyping(false);
      setCurrentStep('welcome');
    };

    showWelcome();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // KOR: 단계별 프롬프트 출력 / ENG: Output step-specific prompt
  const showStepPrompt = useCallback(
    async (step: InputStep) => {
      setIsTyping(true);

      switch (step) {
        case 'nationality': {
          const stepLines: Array<{ type: TerminalLine['type']; content: string }> = [
            { type: 'blank', content: '' },
            { type: 'system', content: '┌─ STEP 1/6: 국적 / Nationality ──────────────────────────────────────────┐' },
            { type: 'output', content: '│                                                                          │' },
            { type: 'output', content: '│  국가 목록 / Country list:                                               │' },
            { type: 'output', content: '│                                                                          │' },
          ];
          popularCountries.forEach((c, i) => {
            const num = String(i + 1).padStart(2, ' ');
            const label = `${c.flag} ${c.nameKo}`.padEnd(12, ' ');
            const en = c.nameEn.padEnd(16, ' ');
            stepLines.push({
              type: 'output',
              content: `│    [${num}] ${label}  ${en}  (${c.code})                         │`,
            });
          });
          stepLines.push(
            { type: 'output', content: '│                                                                          │' },
            { type: 'output', content: '│  번호(1~12) 또는 국가명을 입력하세요.                                    │' },
            { type: 'output', content: '│  Enter number (1~12) or country name.                                    │' },
            { type: 'system', content: '└──────────────────────────────────────────────────────────────────────────┘' },
          );
          await addLinesSequentially(stepLines, 12);
          break;
        }

        case 'age': {
          await addLinesSequentially(
            [
              { type: 'blank', content: '' },
              { type: 'system', content: '┌─ STEP 2/6: 나이 / Age ──────────────────────────────────────────────────┐' },
              { type: 'output', content: '│                                                                          │' },
              { type: 'output', content: '│  나이를 입력하세요 (18~60).                                              │' },
              { type: 'output', content: '│  Enter your age (18~60).                                                 │' },
              { type: 'output', content: '│                                                                          │' },
              { type: 'system', content: '└──────────────────────────────────────────────────────────────────────────┘' },
            ],
            15
          );
          break;
        }

        case 'education': {
          const stepLines: Array<{ type: TerminalLine['type']; content: string }> = [
            { type: 'blank', content: '' },
            { type: 'system', content: '┌─ STEP 3/6: 학력 / Education ────────────────────────────────────────────┐' },
            { type: 'output', content: '│                                                                          │' },
          ];
          educationOptions.forEach((e, i) => {
            const label = `${e.emoji} ${e.labelKo}`.padEnd(14, ' ');
            const en = e.labelEn.padEnd(26, ' ');
            stepLines.push({
              type: 'output',
              content: `│    [${i + 1}] ${label}  ${en}                  │`,
            });
          });
          stepLines.push(
            { type: 'output', content: '│                                                                          │' },
            { type: 'output', content: '│  번호를 입력하세요. / Enter number.                                      │' },
            { type: 'system', content: '└──────────────────────────────────────────────────────────────────────────┘' },
          );
          await addLinesSequentially(stepLines, 15);
          break;
        }

        case 'fund': {
          const stepLines: Array<{ type: TerminalLine['type']; content: string }> = [
            { type: 'blank', content: '' },
            { type: 'system', content: '┌─ STEP 4/6: 연간 가용 자금 / Annual Budget ──────────────────────────────┐' },
            { type: 'output', content: '│                                                                          │' },
          ];
          fundOptions.forEach((f, i) => {
            const ko = f.labelKo.padEnd(18, ' ');
            const en = f.labelEn.padEnd(20, ' ');
            stepLines.push({
              type: 'output',
              content: `│    [${i + 1}] ${ko}  ${en}                   │`,
            });
          });
          stepLines.push(
            { type: 'output', content: '│                                                                          │' },
            { type: 'output', content: '│  번호를 입력하세요. / Enter number.                                      │' },
            { type: 'system', content: '└──────────────────────────────────────────────────────────────────────────┘' },
          );
          await addLinesSequentially(stepLines, 15);
          break;
        }

        case 'goal': {
          const stepLines: Array<{ type: TerminalLine['type']; content: string }> = [
            { type: 'blank', content: '' },
            { type: 'system', content: '┌─ STEP 5/6: 최종 목표 / Final Goal ─────────────────────────────────────┐' },
            { type: 'output', content: '│                                                                          │' },
          ];
          goalOptions.forEach((g, i) => {
            const label = `${g.emoji} ${g.labelKo}`.padEnd(8, ' ');
            const en = g.labelEn.padEnd(22, ' ');
            const desc = g.descKo;
            stepLines.push({
              type: 'output',
              content: `│    [${i + 1}] ${label}  ${en}  ${desc.slice(0, 18)}        │`,
            });
          });
          stepLines.push(
            { type: 'output', content: '│                                                                          │' },
            { type: 'output', content: '│  번호를 입력하세요. / Enter number.                                      │' },
            { type: 'system', content: '└──────────────────────────────────────────────────────────────────────────┘' },
          );
          await addLinesSequentially(stepLines, 15);
          break;
        }

        case 'priority': {
          const stepLines: Array<{ type: TerminalLine['type']; content: string }> = [
            { type: 'blank', content: '' },
            { type: 'system', content: '┌─ STEP 6/6: 우선순위 / Priority ─────────────────────────────────────────┐' },
            { type: 'output', content: '│                                                                          │' },
          ];
          priorityOptions.forEach((p, i) => {
            const label = `${p.emoji} ${p.labelKo}`.padEnd(10, ' ');
            const en = p.labelEn.padEnd(12, ' ');
            const desc = p.descKo;
            stepLines.push({
              type: 'output',
              content: `│    [${i + 1}] ${label}  ${en}  ${desc.slice(0, 18)}          │`,
            });
          });
          stepLines.push(
            { type: 'output', content: '│                                                                          │' },
            { type: 'output', content: '│  번호를 입력하세요. / Enter number.                                      │' },
            { type: 'system', content: '└──────────────────────────────────────────────────────────────────────────┘' },
          );
          await addLinesSequentially(stepLines, 15);
          break;
        }

        default:
          break;
      }

      setIsTyping(false);
    },
    [addLinesSequentially]
  );

  // KOR: 분석 실행 및 결과 출력 / ENG: Run analysis and output results
  const runAnalysis = useCallback(async () => {
    setIsTyping(true);
    setCurrentStep('analyzing');

    // KOR: 입력 요약 JSON 출력 / ENG: Output input summary as JSON
    const country = popularCountries.find(
      (c) => c.code === diagnosisInput.nationality
    );
    const edu = educationOptions.find(
      (e) => e.value === diagnosisInput.educationLevel
    );
    const goal = goalOptions.find(
      (g) => g.value === diagnosisInput.finalGoal
    );
    const priority = priorityOptions.find(
      (p) => p.value === diagnosisInput.priorityPreference
    );
    const fund = fundOptions.find(
      (f) => f.value === diagnosisInput.availableAnnualFund
    );

    const inputSummary: Array<{ type: TerminalLine['type']; content: string; color?: string }> = [
      { type: 'blank', content: '' },
      { type: 'system', content: '══════ DIAGNOSIS INPUT ══════════════════════════════════════════════════' },
      { type: 'json', content: '{', color: 'text-gray-400' },
      {
        type: 'json',
        content: `  "nationality":          "${country ? `${country.flag} ${country.nameKo} (${country.nameEn})` : diagnosisInput.nationality}",`,
        color: 'text-green-300',
      },
      {
        type: 'json',
        content: `  "age":                 ${diagnosisInput.age},`,
        color: 'text-cyan-300',
      },
      {
        type: 'json',
        content: `  "educationLevel":      "${edu ? `${edu.emoji} ${edu.labelKo}` : diagnosisInput.educationLevel}",`,
        color: 'text-green-300',
      },
      {
        type: 'json',
        content: `  "availableAnnualFund": "${fund ? fund.labelKo : diagnosisInput.availableAnnualFund}",`,
        color: 'text-green-300',
      },
      {
        type: 'json',
        content: `  "finalGoal":           "${goal ? `${goal.emoji} ${goal.labelKo}` : diagnosisInput.finalGoal}",`,
        color: 'text-green-300',
      },
      {
        type: 'json',
        content: `  "priorityPreference":  "${priority ? `${priority.emoji} ${priority.labelKo}` : diagnosisInput.priorityPreference}"`,
        color: 'text-green-300',
      },
      { type: 'json', content: '}', color: 'text-gray-400' },
      { type: 'blank', content: '' },
    ];
    await addLinesSequentially(inputSummary, 40);

    // KOR: 분석 진행 상황 / ENG: Analysis progress steps
    const analysisSteps: string[] = [
      '[1/7] Connecting to JOBCHAJA Rule Engine...',
      '[2/7] Loading 31 visa types into memory...',
      '[3/7] Initializing 14 Evaluators (Strategy Pattern)...',
      '[4/7] Running nationality & age filters...',
      '[5/7] Evaluating education & financial requirements...',
      '[6/7] Scoring pathways (2,629 test cases validated)...',
      '[7/7] Ranking and generating recommendations...',
    ];

    for (const step of analysisSteps) {
      await new Promise<void>((resolve) => setTimeout(resolve, 160 + Math.random() * 180));
      addLine('success', `  ✓  ${step}`);
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 600));

    // KOR: 결과 출력 / ENG: Output results
    const result = mockDiagnosisResult;
    const pathways = result.pathways;

    // KOR: 결과 헤더 / ENG: Result header
    const headerLines: Array<{ type: TerminalLine['type']; content: string }> = [
      { type: 'blank', content: '' },
      { type: 'system', content: '════════════════════════════════════════════════════════════════════════' },
      { type: 'system', content: '  DIAGNOSIS RESULT / 진단 결과' },
      { type: 'system', content: '════════════════════════════════════════════════════════════════════════' },
      { type: 'blank', content: '' },
      {
        type: 'output',
        content: `  평가 경로  : ${result.meta.totalPathwaysEvaluated}개 (evaluated)`,
      },
      {
        type: 'output',
        content: `  필터 제외  : ${result.meta.hardFilteredOut}개 (filtered out)`,
      },
      {
        type: 'output',
        content: `  추천 경로  : ${pathways.length}개 (recommended)`,
      },
      { type: 'blank', content: '' },
    ];
    await addLinesSequentially(headerLines, 20);

    // KOR: 비교 테이블 / ENG: Comparison table
    const tableLines: Array<{ type: TerminalLine['type']; content: string }> = [
      { type: 'system', content: '┌─ PATHWAY COMPARISON TABLE ─────────────────────────────────────────────┐' },
      { type: 'table', content: '│  #  경로명                        점수  실현가능성  기간(월)  비용(만원)  │' },
      { type: 'table', content: '│  ──────────────────────────────────────────────────────────────────────  │' },
    ];
    pathways.forEach((p, i) => {
      const num = String(i + 1).padStart(2, ' ');
      const name = p.nameKo.slice(0, 26).padEnd(26, ' ');
      const score = String(p.finalScore).padStart(5, ' ');
      const feas = p.feasibilityLabel.padEnd(7, ' ');
      const months = String(p.estimatedMonths).padStart(8, ' ');
      const cost = formatCostWon(p.estimatedCostWon).padStart(10, ' ');
      tableLines.push({
        type: 'table',
        content: `│  ${num}  ${name}  ${score}  ${feas}  ${months}  ${cost}  │`,
      });
    });
    tableLines.push(
      { type: 'table', content: '│                                                                          │' },
      { type: 'system', content: '└──────────────────────────────────────────────────────────────────────────┘' },
      { type: 'blank', content: '' }
    );
    await addLinesSequentially(tableLines, 18);

    // KOR: 각 경로 상세 / ENG: Each pathway detail
    for (let i = 0; i < pathways.length; i++) {
      const p = pathways[i];
      await new Promise<void>((resolve) => setTimeout(resolve, 80));

      const emojiLabel = getFeasibilityEmoji(p.feasibilityLabel);
      const barLine = makeProgressBar(p.finalScore);

      const detailLines: Array<{ type: TerminalLine['type']; content: string; color?: string }> = [
        {
          type: 'system',
          content: `══ [${i + 1}/${pathways.length}] ${p.nameKo} ${'═'.repeat(Math.max(0, 58 - p.nameKo.length))}`,
        },
        { type: 'blank', content: '' },
        { type: 'output', content: `  SCORE  ${barLine}` },
        { type: 'blank', content: '' },
        { type: 'output', content: `  ID           : ${p.pathwayId}` },
        { type: 'output', content: `  영문명        : ${p.nameEn}` },
        { type: 'output', content: `  실현 가능성   : ${emojiLabel} ${p.feasibilityLabel}` },
        { type: 'output', content: `  소요 기간     : ${p.estimatedMonths}개월 (≈ ${(p.estimatedMonths / 12).toFixed(1)}년)` },
        { type: 'output', content: `  예상 비용     : ${formatCostWon(p.estimatedCostWon)}` },
        { type: 'output', content: `  플랫폼 지원   : ${p.platformSupport}` },
        { type: 'blank', content: '' },
      ];

      // KOR: 비자 체인 출력 / ENG: Output visa chain
      detailLines.push({ type: 'output', content: '  비자 체인 / Visa Chain:' });
      const visaCodes = p.visaChain.split(' → ').map((s) => s.trim());
      const chainDisplay = visaCodes
        .map((code, ci) => (ci < visaCodes.length - 1 ? `${code} →` : code))
        .join(' ');
      detailLines.push({ type: 'output', content: `    ${chainDisplay}` });
      detailLines.push({ type: 'blank', content: '' });

      // KOR: 점수 분석 / ENG: Score breakdown
      detailLines.push({ type: 'output', content: '  scoreBreakdown: {' });
      detailLines.push({ type: 'json', content: `    "base":                   ${p.scoreBreakdown.base}`, color: 'text-cyan-300' });
      detailLines.push({ type: 'json', content: `    "ageMultiplier":          ${p.scoreBreakdown.ageMultiplier}`, color: 'text-cyan-300' });
      detailLines.push({ type: 'json', content: `    "nationalityMultiplier":  ${p.scoreBreakdown.nationalityMultiplier}`, color: 'text-cyan-300' });
      detailLines.push({ type: 'json', content: `    "fundMultiplier":         ${p.scoreBreakdown.fundMultiplier}`, color: 'text-cyan-300' });
      detailLines.push({ type: 'json', content: `    "educationMultiplier":    ${p.scoreBreakdown.educationMultiplier}`, color: 'text-cyan-300' });
      detailLines.push({ type: 'json', content: `    "priorityWeight":         ${p.scoreBreakdown.priorityWeight}`, color: 'text-cyan-300' });
      detailLines.push({ type: 'output', content: '  }' });
      detailLines.push({ type: 'blank', content: '' });

      // KOR: 마일스톤 출력 / ENG: Output milestones
      detailLines.push({ type: 'output', content: '  마일스톤 / Milestones:' });
      p.milestones.forEach((m, mi) => {
        const isLast = mi === p.milestones.length - 1;
        const connector = isLast ? '└──' : '├──';
        const pipe = isLast ? '   ' : '│  ';
        const workInfo = m.canWorkPartTime
          ? `근무가능(${m.weeklyHours}h/w) | 수입: ${m.estimatedMonthlyIncome}만원/월`
          : '근무불가';
        detailLines.push({
          type: 'success',
          content: `    ${connector} [M+${String(m.monthFromStart).padStart(2, '0')}] ${m.nameKo}`,
        });
        detailLines.push({
          type: 'output',
          content: `    ${pipe}     비자: ${m.visaStatus || 'none'} | ${workInfo}`,
        });
      });
      detailLines.push({ type: 'blank', content: '' });

      // KOR: 다음 단계 / ENG: Next steps
      if (p.nextSteps.length > 0) {
        detailLines.push({ type: 'output', content: '  다음 단계 / Next Steps:' });
        p.nextSteps.forEach((ns, ni) => {
          detailLines.push({
            type: 'success',
            content: `    [${ni + 1}] ${ns.nameKo}`,
          });
          detailLines.push({
            type: 'output',
            content: `        ${ns.description}`,
          });
        });
        detailLines.push({ type: 'blank', content: '' });
      }

      // KOR: 참고사항 / ENG: Note
      detailLines.push({ type: 'output', content: `  NOTE: ${p.note}` });
      detailLines.push({ type: 'blank', content: '' });

      await addLinesSequentially(detailLines, 16);
    }

    // KOR: RAW JSON 결과 / ENG: Raw JSON output
    const jsonLines: Array<{ type: TerminalLine['type']; content: string; color?: string }> = [
      { type: 'system', content: '══════ RAW JSON OUTPUT ══════════════════════════════════════════════════' },
      { type: 'json', content: '{', color: 'text-gray-400' },
      { type: 'json', content: '  "meta": {', color: 'text-purple-300' },
      { type: 'json', content: `    "totalPathwaysEvaluated": ${result.meta.totalPathwaysEvaluated},`, color: 'text-cyan-300' },
      { type: 'json', content: `    "hardFilteredOut": ${result.meta.hardFilteredOut},`, color: 'text-cyan-300' },
      { type: 'json', content: `    "timestamp": "${result.meta.timestamp}"`, color: 'text-green-300' },
      { type: 'json', content: '  },', color: 'text-purple-300' },
      { type: 'json', content: `  "recommendedPathways": ${pathways.length},`, color: 'text-yellow-300' },
      { type: 'json', content: '  "topPathway": {', color: 'text-purple-300' },
      { type: 'json', content: `    "pathwayId": "${pathways[0].pathwayId}",`, color: 'text-green-300' },
      { type: 'json', content: `    "nameKo": "${pathways[0].nameKo}",`, color: 'text-green-300' },
      { type: 'json', content: `    "finalScore": ${pathways[0].finalScore},`, color: 'text-cyan-300' },
      { type: 'json', content: `    "feasibilityLabel": "${pathways[0].feasibilityLabel}",`, color: 'text-green-300' },
      { type: 'json', content: `    "estimatedMonths": ${pathways[0].estimatedMonths},`, color: 'text-cyan-300' },
      { type: 'json', content: `    "estimatedCostWon": ${pathways[0].estimatedCostWon}`, color: 'text-cyan-300' },
      { type: 'json', content: '  }', color: 'text-purple-300' },
      { type: 'json', content: '}', color: 'text-gray-400' },
      { type: 'blank', content: '' },
    ];
    await addLinesSequentially(jsonLines, 28);

    // KOR: 완료 메시지 / ENG: Completion message
    const completionLines: Array<{ type: TerminalLine['type']; content: string }> = [
      { type: 'system', content: '────────────────────────────────────────────────────────────────────────' },
      { type: 'success', content: '  ✓ 진단이 완료되었습니다. / Diagnosis complete.' },
      { type: 'blank', content: '' },
      { type: 'output', content: '  명령어 / Commands:' },
      { type: 'output', content: '    reset          다시 진단하기 / Run diagnosis again' },
      { type: 'output', content: '    export         결과 JSON 복사 / Copy result JSON' },
      { type: 'output', content: '    clear          화면 지우기 / Clear screen' },
      { type: 'blank', content: '' },
    ];
    await addLinesSequentially(completionLines, 25);

    setCurrentStep('result');
    setIsTyping(false);
  }, [diagnosisInput, addLine, addLinesSequentially]);

  // KOR: 입력 제출 처리 / ENG: Handle input submission
  const handleSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || isTyping) return;

      // KOR: 프롬프트 라인 추가 / ENG: Add prompt line
      addLine('prompt', trimmed);

      // KOR: 명령어 히스토리에 저장 / ENG: Save to command history
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
      setInputValue('');
      setShowSuggestions(false);
      setSelectedSuggestionIdx(-1);

      const cmd = trimmed.toLowerCase();

      // KOR: 전역 명령어 처리 / ENG: Handle global commands
      if (cmd === 'clear' || cmd === 'cls') {
        setLines([]);
        return;
      }
      if (cmd === 'reset' || cmd === 'restart') {
        setLines([]);
        setCurrentStep('welcome');
        setDiagnosisInput({});
        window.location.reload();
        return;
      }
      if (cmd === 'help' || cmd === 'h') {
        const helpLines: Array<{ type: TerminalLine['type']; content: string }> = [
          { type: 'blank', content: '' },
          { type: 'system', content: '──── HELP / 도움말 ──────────────────────────────────────────────────────' },
          { type: 'output', content: '  diagnose, d    비자 진단 시작 / Start visa diagnosis' },
          { type: 'output', content: '  reset          초기화 / Reset all' },
          { type: 'output', content: '  clear, cls     화면 지우기 / Clear terminal' },
          { type: 'output', content: '  export, copy   결과 JSON 복사 / Copy result JSON' },
          { type: 'output', content: '  help, h        도움말 / Show help' },
          { type: 'blank', content: '' },
          { type: 'output', content: '  진단 중 번호 또는 텍스트로 선택 가능합니다.' },
          { type: 'output', content: '  During diagnosis, select by number or matching text.' },
          { type: 'system', content: '────────────────────────────────────────────────────────────────────────' },
          { type: 'blank', content: '' },
        ];
        addLinesSequentially(helpLines, 18);
        return;
      }
      if (cmd === 'export' || cmd === 'copy') {
        const jsonStr = JSON.stringify(mockDiagnosisResult, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
          addLine('success', '  ✓ 결과가 클립보드에 복사되었습니다. / Results copied to clipboard.');
        }).catch(() => {
          addLine('error', '  ✗ 복사 실패 / Copy failed.');
        });
        return;
      }

      // KOR: 단계별 입력 처리 / ENG: Handle step-specific input
      switch (currentStep) {
        case 'welcome': {
          if (cmd === 'diagnose' || cmd === 'd' || cmd === 'start') {
            setCurrentStep('nationality');
            showStepPrompt('nationality');
          } else {
            addLine('error', `  ✗ 알 수 없는 명령어: "${trimmed}". "diagnose" 또는 "help"를 입력하세요.`);
            addLine('error', `    Unknown command: "${trimmed}". Type "diagnose" or "help".`);
          }
          break;
        }

        case 'nationality': {
          // KOR: 번호 또는 국가명으로 선택 / ENG: Select by number or name
          const numIdx = parseInt(trimmed, 10);
          let selectedCountry: (typeof popularCountries)[0] | undefined;

          if (!isNaN(numIdx) && numIdx >= 1 && numIdx <= popularCountries.length) {
            selectedCountry = popularCountries[numIdx - 1];
          } else {
            selectedCountry = popularCountries.find(
              (c) =>
                c.code.toLowerCase() === cmd ||
                c.nameEn.toLowerCase() === cmd ||
                c.nameKo === trimmed
            );
          }

          if (selectedCountry) {
            addLine('success', `  ✓ 국적: ${selectedCountry.flag} ${selectedCountry.nameKo} (${selectedCountry.nameEn})`);
            setDiagnosisInput((prev) => ({ ...prev, nationality: selectedCountry!.code }));
            setCurrentStep('age');
            showStepPrompt('age');
          } else {
            addLine('error', `  ✗ 잘못된 입력. 번호(1~${popularCountries.length}) 또는 국가명을 입력하세요.`);
          }
          break;
        }

        case 'age': {
          const age = parseInt(trimmed, 10);
          if (!isNaN(age) && age >= 18 && age <= 60) {
            addLine('success', `  ✓ 나이: ${age}세`);
            setDiagnosisInput((prev) => ({ ...prev, age }));
            setCurrentStep('education');
            showStepPrompt('education');
          } else {
            addLine('error', '  ✗ 18~60 사이의 숫자를 입력하세요. / Enter a number between 18-60.');
          }
          break;
        }

        case 'education': {
          const numIdx = parseInt(trimmed, 10);
          let selectedEdu: (typeof educationOptions)[0] | undefined;

          if (!isNaN(numIdx) && numIdx >= 1 && numIdx <= educationOptions.length) {
            selectedEdu = educationOptions[numIdx - 1];
          } else {
            selectedEdu = educationOptions.find(
              (e) =>
                e.value === cmd ||
                e.labelKo === trimmed ||
                e.labelEn.toLowerCase() === cmd
            );
          }

          if (selectedEdu) {
            addLine('success', `  ✓ 학력: ${selectedEdu.emoji} ${selectedEdu.labelKo} (${selectedEdu.labelEn})`);
            setDiagnosisInput((prev) => ({ ...prev, educationLevel: selectedEdu!.value }));
            setCurrentStep('fund');
            showStepPrompt('fund');
          } else {
            addLine('error', `  ✗ 번호(1~${educationOptions.length})를 입력하세요. / Enter number (1~${educationOptions.length}).`);
          }
          break;
        }

        case 'fund': {
          const numIdx = parseInt(trimmed, 10);
          let selectedFund: (typeof fundOptions)[0] | undefined;

          if (!isNaN(numIdx) && numIdx >= 1 && numIdx <= fundOptions.length) {
            selectedFund = fundOptions[numIdx - 1];
          } else {
            selectedFund = fundOptions.find(
              (f) =>
                f.labelKo.includes(trimmed) ||
                f.labelEn.toLowerCase().includes(cmd)
            );
          }

          if (selectedFund) {
            addLine('success', `  ✓ 연간 자금: ${selectedFund.labelKo} (${selectedFund.labelEn})`);
            setDiagnosisInput((prev) => ({ ...prev, availableAnnualFund: selectedFund!.value }));
            setCurrentStep('goal');
            showStepPrompt('goal');
          } else {
            addLine('error', `  ✗ 번호(1~${fundOptions.length})를 입력하세요. / Enter number (1~${fundOptions.length}).`);
          }
          break;
        }

        case 'goal': {
          const numIdx = parseInt(trimmed, 10);
          let selectedGoal: (typeof goalOptions)[0] | undefined;

          if (!isNaN(numIdx) && numIdx >= 1 && numIdx <= goalOptions.length) {
            selectedGoal = goalOptions[numIdx - 1];
          } else {
            selectedGoal = goalOptions.find(
              (g) =>
                g.value === cmd ||
                g.labelKo === trimmed ||
                g.labelEn.toLowerCase() === cmd
            );
          }

          if (selectedGoal) {
            addLine('success', `  ✓ 목표: ${selectedGoal.emoji} ${selectedGoal.labelKo} (${selectedGoal.labelEn})`);
            setDiagnosisInput((prev) => ({ ...prev, finalGoal: selectedGoal!.value }));
            setCurrentStep('priority');
            showStepPrompt('priority');
          } else {
            addLine('error', `  ✗ 번호(1~${goalOptions.length})를 입력하세요. / Enter number (1~${goalOptions.length}).`);
          }
          break;
        }

        case 'priority': {
          const numIdx = parseInt(trimmed, 10);
          let selectedPriority: (typeof priorityOptions)[0] | undefined;

          if (!isNaN(numIdx) && numIdx >= 1 && numIdx <= priorityOptions.length) {
            selectedPriority = priorityOptions[numIdx - 1];
          } else {
            selectedPriority = priorityOptions.find(
              (p) =>
                p.value === cmd ||
                p.labelKo === trimmed ||
                p.labelEn.toLowerCase() === cmd
            );
          }

          if (selectedPriority) {
            addLine('success', `  ✓ 우선순위: ${selectedPriority.emoji} ${selectedPriority.labelKo} (${selectedPriority.labelEn})`);
            setDiagnosisInput((prev) => ({ ...prev, priorityPreference: selectedPriority!.value }));
            runAnalysis();
          } else {
            addLine('error', `  ✗ 번호(1~${priorityOptions.length})를 입력하세요. / Enter number (1~${priorityOptions.length}).`);
          }
          break;
        }

        case 'result': {
          if (cmd === 'diagnose' || cmd === 'd' || cmd === 'start') {
            setDiagnosisInput({});
            setCurrentStep('nationality');
            showStepPrompt('nationality');
          } else {
            addLine('error', `  ✗ 알 수 없는 명령어: "${trimmed}". "reset", "export", "diagnose"를 입력하세요.`);
          }
          break;
        }

        default:
          break;
      }
    },
    [
      isTyping,
      currentStep,
      diagnosisInput,
      addLine,
      addLinesSequentially,
      showStepPrompt,
      runAnalysis,
    ]
  );

  // KOR: 입력 변경 시 자동완성 업데이트 / ENG: Update autocomplete on input change
  useEffect(() => {
    if (!inputValue.trim()) {
      setShowSuggestions(false);
      return;
    }
    const newSuggestions = getSuggestions(currentStep, inputValue);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
    setSelectedSuggestionIdx(-1);
  }, [inputValue, currentStep]);

  // KOR: 키보드 이벤트 처리 / ENG: Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (showSuggestions && selectedSuggestionIdx >= 0 && selectedSuggestionIdx < suggestions.length) {
          // KOR: 자동완성 항목 제출 / ENG: Submit autocomplete selection
          handleSubmit(suggestions[selectedSuggestionIdx].value);
        } else {
          handleSubmit(inputValue);
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (showSuggestions && suggestions.length > 0) {
          const idx = selectedSuggestionIdx < 0 ? 0 : selectedSuggestionIdx;
          setInputValue(suggestions[idx].value);
          setShowSuggestions(false);
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (showSuggestions) {
          setSelectedSuggestionIdx((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
        } else if (commandHistory.length > 0) {
          const newIdx =
            historyIndex < 0
              ? commandHistory.length - 1
              : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIdx);
          setInputValue(commandHistory[newIdx]);
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (showSuggestions) {
          setSelectedSuggestionIdx((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
        } else if (commandHistory.length > 0) {
          const newIdx =
            historyIndex < 0
              ? commandHistory.length - 1
              : Math.min(commandHistory.length - 1, historyIndex + 1);
          setHistoryIndex(newIdx);
          setInputValue(commandHistory[newIdx]);
        }
        return;
      }

      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedSuggestionIdx(-1);
        return;
      }
    },
    [
      inputValue,
      showSuggestions,
      suggestions,
      selectedSuggestionIdx,
      handleSubmit,
      commandHistory,
      historyIndex,
    ]
  );

  // KOR: 현재 프롬프트 텍스트 결정 / ENG: Determine current prompt text
  const getPromptSubdir = (): string => {
    switch (currentStep) {
      case 'nationality': return '/nationality';
      case 'age':         return '/age';
      case 'education':   return '/education';
      case 'fund':        return '/fund';
      case 'goal':        return '/goal';
      case 'priority':    return '/priority';
      case 'analyzing':   return '/analyzing';
      case 'result':      return '/result';
      default:            return '';
    }
  };

  // KOR: 진행 단계 숫자 / ENG: Progress step number
  const getStepNumber = (): number => {
    const map: Record<string, number> = {
      welcome: 0, nationality: 1, age: 2, education: 3,
      fund: 4, goal: 5, priority: 6, analyzing: 6, result: 6,
    };
    return map[currentStep] ?? 0;
  };

  // KOR: 라인 색상 클래스 결정 / ENG: Determine line color class
  const getLineClass = (line: TerminalLine): string => {
    if (line.color) return line.color;
    switch (line.type) {
      case 'prompt':  return 'text-green-400';
      case 'system':  return 'text-green-600';
      case 'error':   return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'json':    return 'text-emerald-300';
      case 'table':   return 'text-gray-300';
      case 'ascii':   return 'text-green-500';
      case 'blank':   return '';
      default:        return 'text-gray-300';
    }
  };

  const stepNumber = getStepNumber();
  const subdir = getPromptSubdir();

  // KOR: mockPathways에서 첫 번째 CompatPathway 활용 (하단 패널) / ENG: Use first CompatPathway from mockPathways (bottom panel)
  const topCompatPathway: CompatPathway | undefined = mockPathways[0];

  return (
    <div
      className={`min-h-screen bg-[#0a0e14] text-gray-300 font-mono flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* KOR: 터미널 타이틀바 / ENG: Terminal title bar */}
      <div className="bg-[#1a1e26] border-b border-green-900/40 flex items-center justify-between px-4 py-2 select-none shrink-0">
        {/* KOR: 좌측 — 트래픽 라이트 + 제목 / ENG: Left — traffic lights + title */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <button
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              onClick={() => window.location.reload()}
              aria-label="Close / 닫기"
            />
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
              onClick={() => setLines([])}
              aria-label="Clear / 지우기"
            />
            <button
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
              onClick={() => setIsFullscreen((v) => !v)}
              aria-label="Fullscreen / 전체화면"
            />
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500/80 font-bold tracking-wide">
              JOBCHAJA Visa Terminal
            </span>
          </div>
        </div>

        {/* KOR: 우측 — 진행률 + 액션 / ENG: Right — progress + actions */}
        <div className="flex items-center gap-4">
          {/* KOR: 단계 프로그레스 바 / ENG: Step progress bar */}
          {currentStep !== 'welcome' && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-gray-600">STEP</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-1.5 rounded-sm transition-all duration-300 ${
                      i < stepNumber ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">{stepNumber}/6</span>
            </div>
          )}

          {/* KOR: 현재 상태 배지 / ENG: Current status badge */}
          <div className="bg-green-950 border border-green-800/50 rounded px-2 py-0.5">
            <span className="text-xs text-green-400 font-bold">
              {currentStep === 'analyzing'
                ? '◉ ANALYZING'
                : currentStep === 'result'
                ? '● COMPLETE'
                : '○ READY'}
            </span>
          </div>

          {/* KOR: 복사 버튼 / ENG: Copy button */}
          <button
            onClick={() => {
              const jsonStr = JSON.stringify(mockDiagnosisResult, null, 2);
              navigator.clipboard.writeText(jsonStr).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }).catch(() => {});
            }}
            className="text-gray-500 hover:text-green-400 transition-colors"
            title="결과 복사 / Copy results"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* KOR: 리셋 버튼 / ENG: Reset button */}
          <button
            onClick={() => window.location.reload()}
            className="text-gray-500 hover:text-green-400 transition-colors"
            title="초기화 / Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* KOR: 전체화면 버튼 / ENG: Fullscreen button */}
          <button
            onClick={() => setIsFullscreen((v) => !v)}
            className="text-gray-500 hover:text-green-400 transition-colors"
            title="전체화면 / Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* KOR: 터미널 본문 / ENG: Terminal body */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-4 py-3 cursor-text"
        onClick={focusInput}
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#1a3a1a #0a0e14' }}
      >
        {/* KOR: 터미널 히스토리 라인 / ENG: Terminal history lines */}
        {lines.map((line) => (
          <div
            key={line.id}
            className={`${getLineClass(line)} leading-6 whitespace-pre-wrap break-all`}
          >
            {line.type === 'prompt' ? (
              <span>
                <span className="text-green-500">jobchaja</span>
                <span className="text-gray-500">@</span>
                <span className="text-cyan-500">visa</span>
                <span className="text-gray-500">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-500">$ </span>
                <span className="text-gray-200">{line.content}</span>
              </span>
            ) : line.type === 'blank' ? (
              <span>&nbsp;</span>
            ) : (
              line.content
            )}
          </div>
        ))}

        {/* KOR: 현재 입력 라인 / ENG: Current input line */}
        {!isTyping && (
          <div className="relative flex items-start leading-6">
            {/* KOR: 프롬프트 텍스트 / ENG: Prompt text */}
            <span className="whitespace-nowrap shrink-0">
              <span className="text-green-500">jobchaja</span>
              <span className="text-gray-500">@</span>
              <span className="text-cyan-500">visa</span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400">~{subdir}</span>
              <span className="text-gray-500">$ </span>
            </span>

            {/* KOR: 입력 영역 / ENG: Input area */}
            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-gray-200 w-full font-mono caret-transparent text-base"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                disabled={isTyping}
              />
              {/* KOR: 깜빡이는 블록 커서 / ENG: Blinking block cursor */}
              <span
                className="absolute top-0 pointer-events-none"
                style={{ left: `${inputValue.length}ch` }}
              >
                <span
                  className={`inline-block w-[0.55em] h-[1.1em] align-text-bottom transition-opacity duration-75 ${
                    showCursor ? 'bg-green-400 opacity-100' : 'opacity-0'
                  }`}
                />
              </span>

              {/* KOR: 자동완성 드롭다운 / ENG: Autocomplete dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 bottom-full mb-1 bg-[#1a2332] border border-green-900/50 rounded shadow-lg shadow-black/60 z-10 min-w-64 max-w-sm">
                  {suggestions.map((s, i) => (
                    <button
                      key={`${s.value}-${i}`}
                      className={`w-full text-left px-3 py-1.5 text-sm font-mono transition-colors ${
                        i === selectedSuggestionIdx
                          ? 'bg-green-900/50 text-green-300'
                          : 'text-gray-400 hover:bg-green-900/25 hover:text-green-300'
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSubmit(s.value);
                      }}
                      onMouseEnter={() => setSelectedSuggestionIdx(i)}
                    >
                      {s.display}
                    </button>
                  ))}
                  <div className="px-3 py-1 border-t border-green-900/25 text-xs text-gray-600">
                    Tab 자동완성 │ ↑↓ 탐색 │ Enter 선택
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KOR: 타이핑 인디케이터 / ENG: Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-green-500/60 leading-6">
            <span
              className={`inline-block transition-opacity ${
                showCursor ? 'opacity-100' : 'opacity-30'
              }`}
            >
              █
            </span>
            <span className="text-xs text-green-700 animate-pulse">processing...</span>
          </div>
        )}

        {/* KOR: 스크롤 앵커 / ENG: Scroll anchor */}
        <div />
      </div>

      {/* KOR: 하단 상태바 / ENG: Bottom status bar */}
      <div className="bg-[#1a1e26] border-t border-green-900/40 px-4 py-1.5 flex items-center justify-between text-xs select-none shrink-0">
        <div className="flex items-center gap-3 text-gray-600">
          {/* KOR: 연결 상태 표시 / ENG: Connection status display */}
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                currentStep === 'analyzing'
                  ? 'bg-yellow-500 animate-pulse'
                  : currentStep === 'result'
                  ? 'bg-green-500'
                  : 'bg-green-500 animate-pulse'
              }`}
            />
            <span>
              {currentStep === 'analyzing'
                ? 'RUNNING'
                : currentStep === 'result'
                ? 'DONE'
                : 'READY'}
            </span>
          </span>
          <span>│</span>
          <span>step: {currentStep}</span>
          {currentStep !== 'welcome' && (
            <>
              <span>│</span>
              <span>{stepNumber}/6</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <span>{lines.length} lines</span>
          <span>│</span>
          <span>31 visa types</span>
          <span>│</span>
          <span>UTF-8</span>
          <span>│</span>
          <span className="text-green-700">JOBCHAJA CLI v2.1</span>
        </div>
      </div>
    </div>
  );
}
