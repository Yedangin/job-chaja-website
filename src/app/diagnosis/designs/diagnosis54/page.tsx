'use client';

// 비자 진단 시험 답안지 디자인 / Visa Diagnosis Exam Sheet Design
// OMR 마킹 스타일의 시험지 UI / OMR marking style exam sheet UI

import React, { useState, useEffect, useCallback } from 'react';
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
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Award,
  BarChart2,
  FileText,
  RefreshCw,
  Star,
  TrendingUp,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type Phase = 'cover' | 'exam' | 'grading' | 'result';

interface Question {
  id: number;
  // 질문 텍스트 한국어/영어 / Question text Korean/English
  textKo: string;
  textEn: string;
  // 입력 필드 키 / Input field key
  field: keyof DiagnosisInput;
  // 선택지 / Options
  options: { value: string | number; labelKo: string; labelEn: string }[];
}

// ============================================================
// 시험 문제 정의 / Exam question definitions
// ============================================================

const examQuestions: Question[] = [
  {
    id: 1,
    textKo: '귀하의 국적은 무엇입니까?',
    textEn: 'What is your nationality?',
    field: 'nationality',
    options: popularCountries.slice(0, 4).map((c) => ({
      value: c.code,
      labelKo: `${c.flag} ${c.nameKo}`,
      labelEn: c.nameEn,
    })),
  },
  {
    id: 2,
    textKo: '귀하의 연령대는 어느 구간에 해당합니까?',
    textEn: 'Which age bracket applies to you?',
    field: 'age',
    options: [
      { value: 22, labelKo: '① 20~24세', labelEn: '20–24 yrs' },
      { value: 27, labelKo: '② 25~29세', labelEn: '25–29 yrs' },
      { value: 32, labelKo: '③ 30~34세', labelEn: '30–34 yrs' },
      { value: 38, labelKo: '④ 35세 이상', labelEn: '35+ yrs' },
    ],
  },
  {
    id: 3,
    textKo: '귀하의 최종 학력은 무엇입니까?',
    textEn: 'What is your highest education level?',
    field: 'educationLevel',
    options: educationOptions.slice(2, 6).map((e) => ({
      value: e.value,
      labelKo: `${e.emoji} ${e.labelKo}`,
      labelEn: e.labelEn,
    })),
  },
  {
    id: 4,
    textKo: '연간 가용 자금 규모를 선택하십시오.',
    textEn: 'Select your available annual budget.',
    field: 'availableAnnualFund',
    options: fundOptions.slice(0, 4).map((f) => ({
      value: f.value,
      labelKo: f.labelKo,
      labelEn: f.labelEn,
    })),
  },
  {
    id: 5,
    textKo: '한국 체류의 최종 목표는 무엇입니까?',
    textEn: 'What is your ultimate goal in Korea?',
    field: 'finalGoal',
    options: goalOptions.map((g) => ({
      value: g.value,
      labelKo: `${g.emoji} ${g.labelKo}`,
      labelEn: g.labelEn,
    })),
  },
  {
    id: 6,
    textKo: '비자 경로 선택 시 가장 중요하게 고려하는 요소는?',
    textEn: 'What is your top priority when choosing a visa path?',
    field: 'priorityPreference',
    options: priorityOptions.map((p) => ({
      value: p.value,
      labelKo: `${p.emoji} ${p.labelKo}`,
      labelEn: p.labelEn,
    })),
  },
];

// OMR 버블 라벨 / OMR bubble labels (A, B, C, D)
const BUBBLE_LABELS = ['A', 'B', 'C', 'D'];

// 시험 제한 시간(초) / Exam time limit in seconds
const EXAM_DURATION = 180;

// ============================================================
// 서브 컴포넌트: OMR 버블 / Sub-component: OMR Bubble
// ============================================================

interface OmrBubbleProps {
  label: string;
  optionText: string;
  isSelected: boolean;
  onSelect: () => void;
}

function OmrBubble({ label, optionText, isSelected, onSelect }: OmrBubbleProps) {
  return (
    // 단일 선택지 행 / Single option row
    <button
      onClick={onSelect}
      className="flex items-center gap-3 w-full text-left group hover:bg-gray-50 rounded px-2 py-1.5 transition-colors"
    >
      {/* OMR 마킹 원 / OMR marking circle */}
      <div
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-sm transition-all
          ${isSelected
            ? 'bg-gray-900 border-gray-900 text-white scale-110'
            : 'border-gray-400 text-gray-500 group-hover:border-gray-700 group-hover:text-gray-700'
          }`}
      >
        {isSelected ? (
          // 채워진 버블 (마킹됨) / Filled bubble (marked)
          <span className="text-xs font-black">{label}</span>
        ) : (
          <span className="text-xs">{label}</span>
        )}
      </div>
      {/* 선택지 텍스트 / Option text */}
      <span
        className={`text-sm leading-snug ${
          isSelected ? 'font-semibold text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
        }`}
      >
        {optionText}
      </span>
    </button>
  );
}

// ============================================================
// 서브 컴포넌트: 문제 번호 네비게이터 / Sub-component: Question Navigator
// ============================================================

interface QuestionNavProps {
  total: number;
  current: number;
  answers: (string | number | undefined)[];
  onJump: (idx: number) => void;
}

function QuestionNav({ total, current, answers, onJump }: QuestionNavProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const answered = answers[i] !== undefined;
        const isCurrent = i === current;
        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            className={`w-8 h-8 rounded-sm text-xs font-bold border transition-all
              ${isCurrent
                ? 'bg-gray-900 border-gray-900 text-white ring-2 ring-gray-400 ring-offset-1'
                : answered
                  ? 'bg-gray-800 border-gray-800 text-white'
                  : 'bg-white border-gray-300 text-gray-400 hover:border-gray-600 hover:text-gray-700'
              }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 타이머 / Sub-component: Timer
// ============================================================

interface TimerProps {
  seconds: number;
}

function Timer({ seconds }: TimerProps) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isWarning = seconds <= 30;
  const isCritical = seconds <= 10;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-mono text-sm font-bold
        ${isCritical
          ? 'border-red-500 text-red-600 bg-red-50 animate-pulse'
          : isWarning
            ? 'border-amber-500 text-amber-700 bg-amber-50'
            : 'border-gray-400 text-gray-700 bg-gray-50'
        }`}
    >
      <Clock size={14} className={isCritical ? 'text-red-500' : 'text-gray-500'} />
      <span>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 채점 결과 카드 / Sub-component: Score Card
// ============================================================

interface ScoreCardProps {
  pathway: CompatPathway;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function ScoreCard({ pathway, rank, isExpanded, onToggle }: ScoreCardProps) {
  const score = pathway.finalScore;
  const color = getScoreColor(score);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // 등급 라벨 / Grade label
  const getGrade = (s: number) => {
    if (s >= 70) return { letter: 'A', label: '우수' };
    if (s >= 50) return { letter: 'B', label: '양호' };
    if (s >= 30) return { letter: 'C', label: '보통' };
    return { letter: 'D', label: '미흡' };
  };
  const grade = getGrade(score);

  return (
    <div className="border border-gray-200 rounded-none bg-white">
      {/* 카드 헤더 (항상 표시) / Card header (always visible) */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
      >
        {/* 순위 번호 / Rank number */}
        <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center shrink-0">
          <span className="text-xs font-black text-gray-600">{rank}</span>
        </div>

        {/* 경로명 / Pathway name */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{pathway.nameKo}</p>
          <p className="text-xs text-gray-500 truncate">{pathway.nameEn}</p>
        </div>

        {/* 등급 + 점수 / Grade + score */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-lg font-black"
            style={{ color }}
          >
            {grade.letter}
          </span>
          <div className="text-right">
            <div className="text-sm font-black text-gray-900">{score}점</div>
            <div className="text-xs text-gray-400">{emoji} {pathway.feasibilityLabel}</div>
          </div>
        </div>

        {/* 펼치기 화살표 / Expand arrow */}
        <ChevronRight
          size={14}
          className={`text-gray-400 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* 확장된 상세 내용 / Expanded detail content */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          {/* 항목별 점수 분포 / Score breakdown by category */}
          <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">세부 채점 / Score Breakdown</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
            {[
              { label: '기본 적합도', val: pathway.scoreBreakdown.base },
              { label: '연령 가산', val: Math.round(pathway.scoreBreakdown.ageMultiplier * 10) },
              { label: '국적 가산', val: Math.round(pathway.scoreBreakdown.nationalityMultiplier * 10) },
              { label: '자금 적합도', val: Math.round(pathway.scoreBreakdown.fundMultiplier * 10) },
              { label: '학력 가산', val: Math.round(pathway.scoreBreakdown.educationMultiplier * 10) },
              { label: '우선순위 가중', val: Math.round(pathway.scoreBreakdown.priorityWeight * 10) },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-0.5">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="text-xs font-bold text-gray-700 font-mono">{item.val}</span>
              </div>
            ))}
          </div>

          {/* 비자 체인 / Visa chain */}
          <p className="text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">비자 경로 / Visa Path</p>
          <div className="flex items-center flex-wrap gap-1 mb-3">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
              <React.Fragment key={i}>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-gray-900 text-white rounded-sm">
                  {v.code}
                </span>
                {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                  <span className="text-gray-400 text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 비용/기간 / Cost & duration */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border border-gray-200 rounded p-2">
              <p className="text-xs text-gray-500 mb-0.5">예상 기간</p>
              <p className="text-sm font-black text-gray-900">{pathway.estimatedMonths}개월</p>
            </div>
            <div className="bg-white border border-gray-200 rounded p-2">
              <p className="text-xs text-gray-500 mb-0.5">예상 비용</p>
              <p className="text-sm font-black text-gray-900">
                {pathway.estimatedCostWon === 0 ? '무료' : `${pathway.estimatedCostWon.toLocaleString()}만원`}
              </p>
            </div>
          </div>

          {/* 비고 / Note */}
          {pathway.note && (
            <p className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-2">
              {pathway.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis54Page() {
  // 페이즈 상태 / Phase state
  const [phase, setPhase] = useState<Phase>('cover');

  // 현재 문제 인덱스 / Current question index
  const [currentQ, setCurrentQ] = useState(0);

  // 사용자 답변 (인덱스별) / User answers (by index)
  const [answers, setAnswers] = useState<(string | number | undefined)[]>(
    Array(examQuestions.length).fill(undefined)
  );

  // 타이머 / Timer
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);

  // 채점 애니메이션 진행 / Grading animation progress
  const [gradingStep, setGradingStep] = useState(0);

  // 결과 데이터 / Result data
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // 확장된 결과 카드 / Expanded result card
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // ============================================================
  // 타이머 로직 / Timer logic
  // ============================================================

  useEffect(() => {
    if (phase !== 'exam') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 시간 초과 → 채점 시작 / Time up → start grading
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // ============================================================
  // 답안 선택 / Answer selection
  // ============================================================

  const handleSelect = (questionIdx: number, value: string | number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIdx] = value;
      return next;
    });
  };

  // ============================================================
  // 제출 + 채점 / Submit + grading
  // ============================================================

  const handleSubmit = useCallback(() => {
    setPhase('grading');
    setGradingStep(0);

    // 채점 단계별 애니메이션 / Step-by-step grading animation
    const steps = [1, 2, 3, 4, 5];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setGradingStep(step);
        if (step === 5) {
          // 결과 표시 / Show result
          setTimeout(() => {
            setResult(mockDiagnosisResult);
            setPhase('result');
          }, 800);
        }
      }, (i + 1) * 600);
    });
  }, []);

  // ============================================================
  // 재시험 / Retake exam
  // ============================================================

  const handleRetake = () => {
    setPhase('cover');
    setCurrentQ(0);
    setAnswers(Array(examQuestions.length).fill(undefined));
    setTimeLeft(EXAM_DURATION);
    setGradingStep(0);
    setResult(null);
    setExpandedCard(null);
  };

  // ============================================================
  // 답변 완료 수 / Answered count
  // ============================================================

  const answeredCount = answers.filter((a) => a !== undefined).length;
  const allAnswered = answeredCount === examQuestions.length;

  // ============================================================
  // 현재 문제 / Current question
  // ============================================================

  const question = examQuestions[currentQ];

  // ============================================================
  // 렌더: 표지 / Render: Cover page
  // ============================================================

  if (phase === 'cover') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        {/* 시험지 표지 / Exam cover sheet */}
        <div className="w-full max-w-md border-4 border-gray-900">
          {/* 상단 헤더 / Top header */}
          <div className="bg-gray-900 text-white px-6 py-4 text-center">
            <p className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-1">
              JOBCHAJA VISA DIAGNOSTIC TEST
            </p>
            <h1 className="text-xl font-black tracking-tight">비자 자격 진단 시험</h1>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">Form JCJ-54 / 잡차자 비자 진단</p>
          </div>

          {/* 시험 정보 표 / Exam info table */}
          <div className="border-b-2 border-gray-900 divide-y divide-gray-200">
            {[
              { label: '시험 구분', value: '비자 경로 적합성 진단' },
              { label: 'Test Type', value: 'Visa Pathway Eligibility' },
              { label: '문제 수', value: `${examQuestions.length}문항 / ${examQuestions.length} Questions` },
              { label: '제한 시간', value: `${Math.floor(EXAM_DURATION / 60)}분 / ${Math.floor(EXAM_DURATION / 60)} Minutes` },
              { label: '채점 방식', value: 'AI 자동 채점 / Auto-Graded' },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-5 text-sm">
                <div className="col-span-2 bg-gray-50 px-3 py-2 font-bold text-gray-700 text-xs border-r border-gray-200">
                  {row.label}
                </div>
                <div className="col-span-3 px-3 py-2 text-gray-800 text-xs">
                  {row.value}
                </div>
              </div>
            ))}
          </div>

          {/* 수험자 정보 입력란 / Examinee info area */}
          <div className="px-6 py-4">
            <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
              수험자 정보 / Examinee Information
            </p>
            <div className="space-y-2">
              {['이름 / Name', '국적 / Nationality', '수험 번호 / ID No.'].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-32 shrink-0">{label}</span>
                  <div className="flex-1 border-b border-gray-400 h-5" />
                </div>
              ))}
            </div>
          </div>

          {/* 주의사항 / Instructions */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-800 mb-1">응시 전 주의사항 / Instructions</p>
            <p>1. 각 문항에 하나의 답만 선택하십시오. / Select ONE answer per question.</p>
            <p>2. 제한 시간 내에 모든 문항에 응답하십시오. / Answer all within the time limit.</p>
            <p>3. 답안은 변경 가능합니다. / You may change answers anytime.</p>
          </div>

          {/* 시작 버튼 / Start button */}
          <div className="px-6 py-4 border-t-2 border-gray-900">
            <button
              onClick={() => setPhase('exam')}
              className="w-full bg-gray-900 text-white py-3 font-black text-sm tracking-wider hover:bg-gray-700 transition-colors uppercase"
            >
              시험 시작 / Start Exam →
            </button>
          </div>

          {/* 하단 식별 코드 / Bottom identification code */}
          <div className="bg-gray-100 px-6 py-2 flex justify-between items-center">
            <span className="font-mono text-xs text-gray-400">JCJ-VISA-2026-054</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-800"
                  style={{ width: i % 3 === 0 ? 4 : 2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 렌더: 시험 진행 / Render: Exam in progress
  // ============================================================

  if (phase === 'exam') {
    const progressPct = ((currentQ + 1) / examQuestions.length) * 100;
    const timePct = (timeLeft / EXAM_DURATION) * 100;

    return (
      <div className="min-h-screen bg-white">
        {/* 시험 헤더 / Exam header */}
        <div className="border-b-2 border-gray-900 bg-white sticky top-0 z-10">
          {/* 상단 바 / Top bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-gray-600" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                비자 진단 시험 / Visa Diagnostic Test
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* 진행률 / Progress */}
              <span className="text-xs text-gray-500 font-mono">
                {answeredCount}/{examQuestions.length} 완료
              </span>
              {/* 타이머 / Timer */}
              <Timer seconds={timeLeft} />
            </div>
          </div>

          {/* 타이머 프로그레스 바 / Timer progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className={`h-full transition-all duration-1000 ${
                timePct <= 20 ? 'bg-red-500' : timePct <= 40 ? 'bg-amber-500' : 'bg-gray-800'
              }`}
              style={{ width: `${timePct}%` }}
            />
          </div>
        </div>

        <div className="max-w-xl mx-auto px-4 py-6">
          {/* 문제 번호 네비게이터 / Question number navigator */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              문제 번호 / Question No.
            </p>
            <QuestionNav
              total={examQuestions.length}
              current={currentQ}
              answers={answers}
              onJump={setCurrentQ}
            />
          </div>

          {/* 시험지 본체 / Exam sheet body */}
          <div className="border-2 border-gray-900">
            {/* 문제 번호 헤더 / Question number header */}
            <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
              <span className="font-black text-sm font-mono">문 {question.id}.</span>
              <span className="text-xs text-gray-400 font-mono">
                ({currentQ + 1} of {examQuestions.length})
              </span>
            </div>

            {/* 문제 텍스트 / Question text */}
            <div className="px-4 py-4 border-b border-gray-200">
              <p className="font-bold text-gray-900 text-sm leading-relaxed mb-1">
                {question.textKo}
              </p>
              <p className="text-xs text-gray-400 italic">{question.textEn}</p>
            </div>

            {/* OMR 선택지 / OMR options */}
            <div className="px-4 py-3 space-y-1">
              {question.options.map((opt, optIdx) => (
                <OmrBubble
                  key={String(opt.value)}
                  label={BUBBLE_LABELS[optIdx]}
                  optionText={opt.labelKo}
                  isSelected={answers[currentQ] === opt.value}
                  onSelect={() => handleSelect(currentQ, opt.value)}
                />
              ))}
            </div>

            {/* 하단 답안 확인 표시줄 / Bottom answer confirmation bar */}
            <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {answers[currentQ] !== undefined ? (
                  <span className="text-green-700 font-bold flex items-center gap-1">
                    <CheckCircle size={12} />
                    답안 마킹됨 / Marked
                  </span>
                ) : (
                  <span className="text-gray-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    미응답 / Unanswered
                  </span>
                )}
              </span>
              {/* OMR 답안지 미니 미리보기 / OMR mini preview */}
              <div className="flex gap-1 items-center">
                {question.options.map((opt, optIdx) => (
                  <div
                    key={String(opt.value)}
                    className={`w-5 h-5 rounded-full border text-xs flex items-center justify-center font-bold
                      ${answers[currentQ] === opt.value
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'border-gray-300 text-gray-300'
                      }`}
                  >
                    {BUBBLE_LABELS[optIdx]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 이전/다음 네비게이션 / Prev/Next navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
              disabled={currentQ === 0}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-sm font-bold text-gray-600 hover:border-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
              이전
            </button>

            {currentQ < examQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQ((p) => p + 1)}
                className="flex items-center gap-1 px-4 py-2 border border-gray-800 bg-gray-800 text-white text-sm font-bold hover:bg-gray-700 transition-colors"
              >
                다음
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-black transition-colors
                  ${allAnswered
                    ? 'bg-gray-900 text-white hover:bg-gray-700 border border-gray-900'
                    : 'bg-gray-200 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
              >
                제출 / Submit
                <CheckCircle size={14} />
              </button>
            )}
          </div>

          {/* 미응답 경고 / Unanswered warning */}
          {!allAnswered && (
            <p className="text-center text-xs text-amber-600 mt-2 font-mono">
              미응답: {examQuestions.length - answeredCount}문항 /
              Unanswered: {examQuestions.length - answeredCount} questions
            </p>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // 렌더: 채점 중 / Render: Grading in progress
  // ============================================================

  if (phase === 'grading') {
    const gradingSteps = [
      '답안 수신 중... / Receiving answers...',
      '항목별 적합성 분석 중... / Analyzing eligibility...',
      '비자 경로 매칭 중... / Matching visa pathways...',
      '점수 산출 중... / Calculating scores...',
      '성적표 생성 중... / Generating report...',
    ];

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm border-2 border-gray-900 text-center">
          {/* 채점 헤더 / Grading header */}
          <div className="bg-gray-900 text-white px-6 py-4">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center animate-spin">
                <RefreshCw size={18} className="text-white" />
              </div>
            </div>
            <h2 className="font-black text-lg">채점 중...</h2>
            <p className="text-xs text-gray-400 font-mono">Grading in progress</p>
          </div>

          {/* 채점 단계 / Grading steps */}
          <div className="px-6 py-5 space-y-2">
            {gradingSteps.map((stepText, i) => {
              const stepNum = i + 1;
              const done = gradingStep >= stepNum;
              const current = gradingStep === stepNum - 1;

              return (
                <div key={i} className="flex items-center gap-3 text-left">
                  {/* 단계 아이콘 / Step icon */}
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all
                      ${done
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : current
                          ? 'border-gray-400 text-gray-400 animate-pulse'
                          : 'border-gray-200 text-gray-200'
                      }`}
                  >
                    {done ? (
                      <CheckCircle size={12} />
                    ) : (
                      <span className="text-xs font-mono">{stepNum}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs ${
                      done ? 'text-gray-900 font-bold' : current ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  >
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 진행 바 / Progress bar */}
          <div className="px-6 pb-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div
                className="h-full bg-gray-900 transition-all duration-500 rounded-full"
                style={{ width: `${(gradingStep / gradingSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {Math.round((gradingStep / gradingSteps.length) * 100)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 렌더: 결과 성적표 / Render: Result score report
  // ============================================================

  if (phase === 'result' && result) {
    const pathways = mockPathways;
    const topPathway = pathways[0];
    const topScore = topPathway.finalScore;
    const topGradeLabel = topScore >= 70 ? '우수' : topScore >= 50 ? '양호' : topScore >= 30 ? '보통' : '미흡';
    const topGradeLetter = topScore >= 70 ? 'A' : topScore >= 50 ? 'B' : topScore >= 30 ? 'C' : 'D';
    const passStatus = topScore >= 30; // 30점 이상 통과 / Pass if 30+

    return (
      <div className="min-h-screen bg-white">
        {/* 성적표 헤더 / Score report header */}
        <div className="border-b-4 border-gray-900 bg-gray-900 text-white text-center px-4 py-5">
          <p className="text-xs font-mono tracking-widest text-gray-400 mb-1 uppercase">
            Official Score Report · Jobchaja Visa Test
          </p>
          <h1 className="text-2xl font-black">비자 자격 성적표</h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Visa Eligibility Score Report</p>
        </div>

        <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
          {/* 최고 점수 + 합격/불합격 / Top score + pass/fail */}
          <div className="border-2 border-gray-900">
            <div className="grid grid-cols-3 divide-x-2 divide-gray-900">
              {/* 총점 / Total score */}
              <div className="px-4 py-4 text-center">
                <p className="text-xs text-gray-500 font-mono mb-1">최고 점수</p>
                <p
                  className="text-4xl font-black"
                  style={{ color: getScoreColor(topScore) }}
                >
                  {topScore}
                </p>
                <p className="text-xs text-gray-400 font-mono">/ 100점</p>
              </div>

              {/* 등급 / Grade */}
              <div className="px-4 py-4 text-center">
                <p className="text-xs text-gray-500 font-mono mb-1">등급 / Grade</p>
                <p
                  className="text-4xl font-black"
                  style={{ color: getScoreColor(topScore) }}
                >
                  {topGradeLetter}
                </p>
                <p className="text-xs text-gray-400">{topGradeLabel}</p>
              </div>

              {/* 합격 여부 / Pass/fail */}
              <div className="px-4 py-4 text-center flex flex-col items-center justify-center">
                {passStatus ? (
                  <>
                    <CheckCircle size={28} className="text-green-600 mb-1" />
                    <p className="text-sm font-black text-green-700">통과</p>
                    <p className="text-xs text-gray-400 font-mono">PASS</p>
                  </>
                ) : (
                  <>
                    <XCircle size={28} className="text-red-500 mb-1" />
                    <p className="text-sm font-black text-red-600">미달</p>
                    <p className="text-xs text-gray-400 font-mono">FAIL</p>
                  </>
                )}
              </div>
            </div>

            {/* 최적 경로명 / Best pathway name */}
            <div className="border-t-2 border-gray-900 px-4 py-3 bg-gray-50">
              <p className="text-xs text-gray-500 mb-0.5">최적 비자 경로 / Best Visa Pathway</p>
              <p className="font-black text-gray-900">{topPathway.nameKo}</p>
              <p className="text-xs text-gray-500 italic">{topPathway.nameEn}</p>
            </div>
          </div>

          {/* 총평 / Summary comment */}
          <div className="border border-gray-200 px-4 py-3 bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <Award size={14} className="text-gray-700" />
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                총평 / Overall Assessment
              </p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {passStatus
                ? `귀하의 프로필은 ${topPathway.nameKo} 경로에 대해 적합 판정을 받았습니다. 총 ${result.meta.totalPathwaysEvaluated}개 경로 중 ${result.pathways.length}개 경로가 매칭되었습니다.`
                : `현재 조건으로는 높은 적합성을 보이는 경로가 제한적입니다. 자금 수준이나 학력을 보완하면 더 많은 경로가 열릴 수 있습니다.`
              }
            </p>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              {result.meta.totalPathwaysEvaluated} pathways evaluated ·{' '}
              {result.meta.hardFilteredOut} filtered out · {result.pathways.length} matched
            </p>
          </div>

          {/* 항목별 결과 / Results by pathway */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 size={14} className="text-gray-700" />
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                경로별 채점 결과 / Pathway Score Results
              </p>
            </div>

            {/* 결과 카드 목록 / Result card list */}
            <div className="border-2 border-gray-900 divide-y-2 divide-gray-900">
              {pathways.map((pathway, idx) => (
                <ScoreCard
                  key={pathway.id}
                  pathway={pathway}
                  rank={idx + 1}
                  isExpanded={expandedCard === pathway.id}
                  onToggle={() =>
                    setExpandedCard((prev) => (prev === pathway.id ? null : pathway.id))
                  }
                />
              ))}
            </div>
          </div>

          {/* 점수 범례 / Score legend */}
          <div className="border border-gray-200 px-4 py-3">
            <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
              점수 등급표 / Score Grade Scale
            </p>
            <div className="grid grid-cols-4 gap-1 text-center">
              {[
                { range: '71~100', grade: 'A', label: '우수', color: '#22c55e' },
                { range: '51~70', grade: 'B', label: '양호', color: '#3b82f6' },
                { range: '31~50', grade: 'C', label: '보통', color: '#f59e0b' },
                { range: '0~30', grade: 'D', label: '미흡', color: '#ef4444' },
              ].map((g) => (
                <div key={g.grade} className="border border-gray-100 rounded py-2">
                  <p className="text-lg font-black" style={{ color: g.color }}>{g.grade}</p>
                  <p className="text-xs text-gray-500">{g.label}</p>
                  <p className="text-xs text-gray-400 font-mono">{g.range}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 다음 단계 / Next steps */}
          {topPathway.nextSteps.length > 0 && (
            <div className="border border-gray-900">
              <div className="bg-gray-900 text-white px-4 py-2 flex items-center gap-2">
                <TrendingUp size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  다음 단계 / Next Steps
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {topPathway.nextSteps.map((step, i) => (
                  <div key={i} className="px-4 py-3 flex gap-3">
                    <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-black">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{step.nameKo}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 재응시 + 공유 / Retake + share */}
          <div className="flex gap-2">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-900 text-gray-900 font-black text-sm hover:bg-gray-100 transition-colors"
            >
              <RefreshCw size={14} />
              재응시 / Retake
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white font-black text-sm hover:bg-gray-700 transition-colors"
            >
              <Star size={14} />
              전문가 상담 / Consult
            </button>
          </div>

          {/* 하단 발급 정보 / Bottom issuance info */}
          <div className="text-center text-xs text-gray-400 font-mono pb-2">
            <p>발급일 / Issued: {new Date().toLocaleDateString('ko-KR')}</p>
            <p>잡차자 비자 진단 시스템 / Jobchaja Visa Diagnostic System v2.0</p>
          </div>
        </div>
      </div>
    );
  }

  // 폴백 / Fallback
  return null;
}
