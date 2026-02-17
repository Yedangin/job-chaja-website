'use client';

// 퀴즈쇼 형식 비자 진단 페이지 / Quiz Show format visa diagnosis page
// 디자인 #21: 카훗/퀴즈렛 스타일 UI / Design #21: Kahoot/Quizlet style UI
// 퍼플+옐로우 비비드 컬러, 카운트다운 타이머, 정답 애니메이션 / Purple+Yellow vivid colors, countdown timer, answer animation

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
  Trophy,
  Timer,
  Star,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  Zap,
  Crown,
  Target,
  Clock,
  DollarSign,
  Globe,
  BookOpen,
  Briefcase,
  Shield,
  TrendingUp,
  Award,
  MapPin,
  ArrowRight,
} from 'lucide-react';

// 퀴즈 단계 타입 / Quiz step types
type QuizStep = 'intro' | 'quiz' | 'result';

// 퀴즈 질문 인덱스 / Quiz question index
type QuestionIndex = 0 | 1 | 2 | 3 | 4 | 5;

// 선택 옵션 타입 / Choice option type
interface QuizChoice {
  value: string | number;
  labelKo: string;
  labelEn: string;
  emoji: string;
  color: string; // Tailwind bg color class
}

// 퀴즈 질문 타입 / Quiz question type
interface QuizQuestion {
  id: QuestionIndex;
  icon: React.ReactNode;
  questionKo: string;
  questionEn: string;
  field: keyof DiagnosisInput;
  choices: QuizChoice[];
  timerSeconds: number;
}

// 점수 레코드 타입 / Score record type
interface ScoreRecord {
  questionId: number;
  selectedValue: string | number;
  timeLeft: number;
  points: number;
}

// 배경 팔레트 — 4지선다 고정 색상 / Background palette for 4 choices
const CHOICE_COLORS = [
  'bg-red-500 hover:bg-red-400',
  'bg-blue-500 hover:bg-blue-400',
  'bg-yellow-500 hover:bg-yellow-400',
  'bg-green-500 hover:bg-green-400',
];

// 퀴즈 질문 목록 / Quiz questions list
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 0,
    icon: <Globe size={28} />,
    questionKo: '어느 나라에서 오셨나요?',
    questionEn: 'Where are you from?',
    field: 'nationality',
    timerSeconds: 20,
    choices: popularCountries.slice(0, 4).map((c, i) => ({
      value: c.code,
      labelKo: c.nameKo,
      labelEn: c.nameEn,
      emoji: c.flag,
      color: CHOICE_COLORS[i],
    })),
  },
  {
    id: 1,
    icon: <Target size={28} />,
    questionKo: '현재 나이가 어떻게 되세요?',
    questionEn: 'How old are you?',
    field: 'age',
    timerSeconds: 15,
    choices: [
      { value: 20, labelKo: '20대 초반', labelEn: 'Early 20s', emoji: '🌱', color: CHOICE_COLORS[0] },
      { value: 25, labelKo: '20대 후반', labelEn: 'Late 20s', emoji: '🚀', color: CHOICE_COLORS[1] },
      { value: 30, labelKo: '30대', labelEn: '30s', emoji: '💼', color: CHOICE_COLORS[2] },
      { value: 40, labelKo: '40대 이상', labelEn: '40s+', emoji: '🏆', color: CHOICE_COLORS[3] },
    ],
  },
  {
    id: 2,
    icon: <BookOpen size={28} />,
    questionKo: '최종 학력은?',
    questionEn: 'Highest education level?',
    field: 'educationLevel',
    timerSeconds: 15,
    choices: educationOptions.slice(2, 6).map((e, i) => ({
      value: e.value,
      labelKo: e.labelKo,
      labelEn: e.labelEn,
      emoji: e.emoji,
      color: CHOICE_COLORS[i],
    })),
  },
  {
    id: 3,
    icon: <DollarSign size={28} />,
    questionKo: '연간 준비 가능한 자금은?',
    questionEn: 'Annual available budget?',
    field: 'availableAnnualFund',
    timerSeconds: 20,
    choices: fundOptions.slice(0, 4).map((f, i) => ({
      value: f.value,
      labelKo: f.labelKo,
      labelEn: f.labelEn,
      emoji: ['💸', '💰', '🏦', '💎'][i],
      color: CHOICE_COLORS[i],
    })),
  },
  {
    id: 4,
    icon: <Briefcase size={28} />,
    questionKo: '한국에서 이루고 싶은 목표는?',
    questionEn: 'What is your goal in Korea?',
    field: 'finalGoal',
    timerSeconds: 15,
    choices: goalOptions.map((g, i) => ({
      value: g.value,
      labelKo: g.labelKo,
      labelEn: g.labelEn,
      emoji: g.emoji,
      color: CHOICE_COLORS[i],
    })),
  },
  {
    id: 5,
    icon: <Shield size={28} />,
    questionKo: '가장 중요하게 생각하는 것은?',
    questionEn: 'What matters most to you?',
    field: 'priorityPreference',
    timerSeconds: 15,
    choices: priorityOptions.map((p, i) => ({
      value: p.value,
      labelKo: p.labelKo,
      labelEn: p.labelEn,
      emoji: p.emoji,
      color: CHOICE_COLORS[i],
    })),
  },
];

// 총 퀴즈 수 / Total quiz count
const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;

// 시간 보너스 점수 계산 / Calculate time bonus points
function calcPoints(timeLeft: number, maxTime: number): number {
  const base = 100;
  const bonus = Math.round((timeLeft / maxTime) * 900);
  return base + bonus;
}

// 점수 등급 계산 / Calculate grade from total score
function calcGrade(total: number): { grade: string; titleKo: string; titleEn: string; emoji: string } {
  if (total >= 5000) return { grade: 'S', titleKo: '비자 마스터', titleEn: 'Visa Master', emoji: '👑' };
  if (total >= 4000) return { grade: 'A', titleKo: '비자 전문가', titleEn: 'Visa Expert', emoji: '🏆' };
  if (total >= 3000) return { grade: 'B', titleKo: '비자 탐색가', titleEn: 'Visa Explorer', emoji: '🌟' };
  if (total >= 2000) return { grade: 'C', titleKo: '비자 입문자', titleEn: 'Visa Beginner', emoji: '📚' };
  return { grade: 'D', titleKo: '비자 신입생', titleEn: 'Visa Newcomer', emoji: '🌱' };
}

// ============================================================
// 인트로 화면 컴포넌트 / Intro screen component
// ============================================================
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-6">
      {/* 반짝이는 배경 별 / Twinkling background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-300 opacity-30 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}
      </div>

      {/* 메인 로고 영역 / Main logo area */}
      <div className="relative z-10 text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy size={52} className="text-yellow-400 drop-shadow-lg" />
          <span className="text-5xl font-black text-white drop-shadow-lg tracking-tight">JobQuiz!</span>
        </div>
        <p className="text-yellow-300 text-xl font-bold mb-2">비자 진단 퀴즈쇼</p>
        <p className="text-purple-200 text-sm">Visa Diagnosis Quiz Show</p>
      </div>

      {/* 퀴즈 정보 카드 / Quiz info card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 w-full max-w-md mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-black text-yellow-400">{TOTAL_QUESTIONS}</div>
            <div className="text-white text-xs mt-1">질문 / Questions</div>
          </div>
          <div>
            <div className="text-3xl font-black text-yellow-400">⏱️</div>
            <div className="text-white text-xs mt-1">타이머 / Timer</div>
          </div>
          <div>
            <div className="text-3xl font-black text-yellow-400">🏆</div>
            <div className="text-white text-xs mt-1">점수 / Score</div>
          </div>
        </div>
      </div>

      {/* 게임 규칙 / Game rules */}
      <div className="relative z-10 w-full max-w-md mb-8 space-y-2">
        {[
          { emoji: '⏰', textKo: '빠를수록 더 많은 점수!', textEn: 'Answer faster for more points!' },
          { emoji: '🎯', textKo: '4지선다 중 하나를 선택', textEn: 'Choose one of 4 options' },
          { emoji: '🗺️', textKo: '최적 비자 경로를 추천', textEn: 'Get your optimal visa path' },
        ].map((rule, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
            <span className="text-2xl shrink-0">{rule.emoji}</span>
            <div>
              <p className="text-white text-sm font-semibold">{rule.textKo}</p>
              <p className="text-purple-200 text-xs">{rule.textEn}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 시작 버튼 / Start button */}
      <button
        onClick={onStart}
        className="relative z-10 w-full max-w-md bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition-all duration-150 text-purple-900 font-black text-2xl py-5 rounded-3xl shadow-2xl shadow-yellow-500/40 flex items-center justify-center gap-3"
      >
        <Zap size={28} className="shrink-0" />
        퀴즈 시작! Start!
      </button>

      <p className="relative z-10 text-purple-300 text-xs mt-6 text-center">
        © 잡차자 JobChaja — 비자 매칭 엔진 기반 / Powered by Visa Matching Engine
      </p>
    </div>
  );
}

// ============================================================
// 타이머 링 컴포넌트 / Timer ring component
// ============================================================
function TimerRing({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / maxTime;
  const dashOffset = circumference * (1 - progress);

  // 시간에 따른 색상 / Color based on time
  const strokeColor = timeLeft > maxTime * 0.6 ? '#22c55e' : timeLeft > maxTime * 0.3 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg width="80" height="80" className="-rotate-90">
        {/* 배경 원 / Background circle */}
        <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
        {/* 진행 원 / Progress circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
        />
      </svg>
      {/* 숫자 표시 / Number display */}
      <span
        className="absolute text-white font-black text-xl"
        style={{ color: strokeColor, transition: 'color 0.3s ease' }}
      >
        {timeLeft}
      </span>
    </div>
  );
}

// ============================================================
// 퀴즈 화면 컴포넌트 / Quiz screen component
// ============================================================
function QuizScreen({
  question,
  questionNumber,
  totalScore,
  timeLeft,
  selected,
  answered,
  onSelect,
}: {
  question: QuizQuestion;
  questionNumber: number;
  totalScore: number;
  timeLeft: number;
  selected: string | number | null;
  answered: boolean;
  onSelect: (value: string | number) => void;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
      {/* 헤더 / Header */}
      <div className="bg-purple-950/60 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center justify-between shrink-0">
        {/* 점수 / Score */}
        <div className="flex items-center gap-2">
          <Star size={18} className="text-yellow-400" />
          <span className="text-white font-black text-lg">{totalScore.toLocaleString()}</span>
        </div>
        {/* 진행 바 / Progress bar */}
        <div className="flex-1 mx-4">
          <div className="flex justify-center gap-2 mb-1">
            {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                  i < questionNumber - 1
                    ? 'bg-yellow-400'
                    : i === questionNumber - 1
                    ? 'bg-yellow-300 animate-pulse'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <p className="text-purple-200 text-xs text-center">
            {questionNumber} / {TOTAL_QUESTIONS}
          </p>
        </div>
        {/* 타이머 / Timer */}
        <TimerRing timeLeft={timeLeft} maxTime={question.timerSeconds} />
      </div>

      {/* 질문 영역 / Question area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 px-4 pb-4">
        {/* 질문 카드 / Question card */}
        <div className="w-full max-w-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-8 text-center shadow-2xl">
          <div className="flex items-center justify-center text-yellow-400 mb-4">
            {question.icon}
          </div>
          <h2 className="text-white font-black text-2xl leading-tight mb-2">{question.questionKo}</h2>
          <p className="text-purple-200 text-sm">{question.questionEn}</p>
        </div>

        {/* 선택지 그리드 / Choice grid */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-4">
          {question.choices.map((choice, i) => {
            // 선택 상태에 따른 스타일 / Style based on selection state
            const isSelected = selected === choice.value;
            const baseColors = CHOICE_COLORS[i];
            let style = baseColors;
            if (answered) {
              style = isSelected
                ? 'bg-green-500 ring-4 ring-white scale-105'
                : 'bg-gray-600 opacity-50';
            }

            return (
              <button
                key={choice.value}
                onClick={() => !answered && onSelect(choice.value)}
                disabled={answered}
                className={`${style} transition-all duration-200 active:scale-95 rounded-2xl p-4 flex flex-col items-start gap-2 shadow-lg text-left`}
              >
                <span className="text-3xl">{choice.emoji}</span>
                <div>
                  <p className="text-white font-black text-base leading-tight">{choice.labelKo}</p>
                  <p className="text-white/70 text-xs">{choice.labelEn}</p>
                </div>
                {/* 선택 표시 / Selection indicator */}
                {answered && isSelected && (
                  <CheckCircle size={20} className="text-white absolute top-3 right-3" />
                )}
              </button>
            );
          })}
        </div>

        {/* 선택 완료 메시지 / Selection complete message */}
        {answered && (
          <div className="mt-6 flex items-center gap-3 bg-yellow-400/20 border border-yellow-400/40 rounded-2xl px-5 py-3 animate-bounce">
            <CheckCircle size={20} className="text-yellow-400 shrink-0" />
            <p className="text-yellow-300 font-bold text-sm">
              선택 완료! 다음 질문으로 넘어갑니다... / Selected! Moving to next...
            </p>
          </div>
        )}

        {/* 시간 초과 메시지 / Time over message */}
        {!answered && timeLeft === 0 && (
          <div className="mt-6 flex items-center gap-3 bg-red-500/20 border border-red-400/40 rounded-2xl px-5 py-3">
            <Timer size={20} className="text-red-400 shrink-0" />
            <p className="text-red-300 font-bold text-sm">
              시간 초과! / Time's up!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 경로 결과 카드 컴포넌트 / Pathway result card component
// ============================================================
function PathwayCard({ pathway, rank }: { pathway: CompatPathway; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  // 순위별 메달 / Rank medal
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  const medal = medals[rank] || `${rank + 1}.`;

  // 점수 색상 / Score color
  const scoreColor = getScoreColor(pathway.finalScore);
  // 실현가능성 이모지 / Feasibility emoji
  const feasEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm border rounded-3xl overflow-hidden transition-all duration-300 ${
        rank === 0 ? 'border-yellow-400/60 shadow-xl shadow-yellow-500/20' : 'border-white/15'
      }`}
    >
      {/* 카드 헤더 / Card header */}
      <div
        className="p-4 flex items-center gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* 순위 / Rank */}
        <span className="text-2xl shrink-0">{medal}</span>
        {/* 이름 / Name */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-sm leading-tight truncate">{pathway.nameKo}</p>
          <p className="text-purple-200 text-xs truncate">{pathway.nameEn}</p>
        </div>
        {/* 점수 / Score */}
        <div className="text-right shrink-0">
          <div className="font-black text-xl" style={{ color: scoreColor }}>
            {pathway.finalScore}
          </div>
          <div className="text-purple-200 text-xs">점 / pts</div>
        </div>
        {/* 실현 가능성 / Feasibility */}
        <div className="text-center shrink-0">
          <div className="text-lg">{feasEmoji}</div>
          <div className="text-purple-200 text-xs">{pathway.feasibilityLabel}</div>
        </div>
        {/* 화살표 / Arrow */}
        <ChevronRight
          size={18}
          className={`text-purple-300 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />
      </div>

      {/* 확장 영역 / Expanded area */}
      {expanded && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 space-y-4">
          {/* 핵심 통계 / Key stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <Clock size={14} className="text-purple-300 mx-auto mb-1" />
              <p className="text-white font-bold text-sm">{pathway.estimatedMonths}개월</p>
              <p className="text-purple-300 text-xs">기간 / Period</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <DollarSign size={14} className="text-purple-300 mx-auto mb-1" />
              <p className="text-white font-bold text-sm">
                {pathway.estimatedCostWon === 0 ? '0원' : `${pathway.estimatedCostWon.toLocaleString()}만원`}
              </p>
              <p className="text-purple-300 text-xs">비용 / Cost</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <TrendingUp size={14} className="text-purple-300 mx-auto mb-1" />
              <p className="text-white font-bold text-sm">{pathway.platformSupport}</p>
              <p className="text-purple-300 text-xs">지원 / Support</p>
            </div>
          </div>

          {/* 비자 체인 / Visa chain */}
          <div>
            <p className="text-purple-300 text-xs mb-2 font-semibold">비자 경로 / Visa Path</p>
            <div className="flex flex-wrap items-center gap-1">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                <React.Fragment key={i}>
                  <span className="bg-purple-600/60 text-yellow-300 text-xs font-bold px-2 py-1 rounded-lg">
                    {v.code}
                  </span>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight size={12} className="text-purple-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 마일스톤 / Milestones */}
          {pathway.milestones.length > 0 && (
            <div>
              <p className="text-purple-300 text-xs mb-2 font-semibold">주요 단계 / Key Milestones</p>
              <div className="space-y-2">
                {pathway.milestones.slice(0, 3).map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center shrink-0">
                      <span className="text-yellow-300 text-xs font-bold">{m.order}</span>
                    </div>
                    <span className="text-white/80">{m.nameKo}</span>
                    <span className="text-purple-400 ml-auto">{m.monthFromStart}개월</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div>
              <p className="text-purple-300 text-xs mb-2 font-semibold">지금 할 일 / Next Actions</p>
              {pathway.nextSteps.slice(0, 2).map((step, i) => (
                <div key={i} className="flex items-start gap-2 bg-yellow-400/10 rounded-xl px-3 py-2 mb-1">
                  <Target size={12} className="text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 font-bold text-xs">{step.nameKo}</p>
                    <p className="text-purple-200 text-xs">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 노트 / Note */}
          {pathway.note && (
            <p className="text-purple-300 text-xs italic border-t border-white/10 pt-3">
              💡 {pathway.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 결과 화면 컴포넌트 / Result screen component
// ============================================================
function ResultScreen({
  totalScore,
  scoreRecords,
  onRestart,
}: {
  totalScore: number;
  scoreRecords: ScoreRecord[];
  onRestart: () => void;
}) {
  const grade = calcGrade(totalScore);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
      {/* 스크롤 영역 / Scroll area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-lg mx-auto">
          {/* 트로피 헤더 / Trophy header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-3 animate-bounce">{grade.emoji}</div>
            <div className="text-white font-black text-4xl mb-1">
              {totalScore.toLocaleString()}점
            </div>
            <p className="text-yellow-400 font-bold text-lg mb-1">{grade.titleKo}</p>
            <p className="text-purple-300 text-sm">{grade.titleEn}</p>
            {/* 등급 배지 / Grade badge */}
            <div className="inline-flex items-center gap-2 mt-3 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1">
              <Award size={16} className="text-yellow-400" />
              <span className="text-yellow-300 font-black text-xl">등급 {grade.grade}</span>
            </div>
          </div>

          {/* 문항별 점수 리더보드 / Question-by-question score leaderboard */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown size={18} className="text-yellow-400" />
              <h3 className="text-white font-black text-base">문항별 점수 / Question Scores</h3>
            </div>
            <div className="space-y-2">
              {scoreRecords.map((record, i) => {
                const q = QUIZ_QUESTIONS[record.questionId];
                const isMax = record.points >= 900;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-purple-200 text-xs w-4 shrink-0">Q{i + 1}</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-1000"
                        style={{ width: `${(record.points / 1000) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${isMax ? 'text-yellow-400' : 'text-white'}`}>
                      {record.points}
                    </span>
                    {isMax && <Zap size={12} className="text-yellow-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 메타 정보 / Meta info */}
          <div className="bg-white/5 rounded-2xl p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-purple-300" />
              <span className="text-purple-200 text-xs">
                총 {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로 평가됨 / {mockDiagnosisResult.meta.totalPathwaysEvaluated} pathways evaluated
              </span>
            </div>
            <span className="text-purple-400 text-xs">
              {mockDiagnosisResult.meta.hardFilteredOut}개 제외 / {mockDiagnosisResult.meta.hardFilteredOut} filtered
            </span>
          </div>

          {/* 추천 경로 목록 / Recommended pathways list */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-yellow-400" />
              <h3 className="text-white font-black text-lg">추천 비자 경로 / Recommended Pathways</h3>
            </div>
            <div className="space-y-3">
              {mockPathways.map((pathway, i) => (
                <PathwayCard key={pathway.pathwayId} pathway={pathway} rank={i} />
              ))}
            </div>
          </div>

          {/* 다시 하기 버튼 / Restart button */}
          <button
            onClick={onRestart}
            className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition-all duration-150 text-purple-900 font-black text-xl py-5 rounded-3xl shadow-2xl shadow-yellow-500/40 flex items-center justify-center gap-3"
          >
            <RotateCcw size={24} className="shrink-0" />
            다시 하기 / Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================
export default function Diagnosis21Page() {
  // 현재 단계 / Current step
  const [step, setStep] = useState<QuizStep>('intro');
  // 현재 질문 인덱스 / Current question index
  const [questionIndex, setQuestionIndex] = useState(0);
  // 남은 시간 / Remaining time
  const [timeLeft, setTimeLeft] = useState(QUIZ_QUESTIONS[0].timerSeconds);
  // 선택된 값 / Selected value
  const [selected, setSelected] = useState<string | number | null>(null);
  // 답변 완료 여부 / Whether answered
  const [answered, setAnswered] = useState(false);
  // 총 점수 / Total score
  const [totalScore, setTotalScore] = useState(0);
  // 점수 기록 / Score records
  const [scoreRecords, setScoreRecords] = useState<ScoreRecord[]>([]);

  // 현재 질문 / Current question
  const currentQuestion = QUIZ_QUESTIONS[questionIndex];

  // 다음 질문으로 이동 / Move to next question
  const goToNext = useCallback(() => {
    if (questionIndex >= TOTAL_QUESTIONS - 1) {
      // 모든 질문 완료 / All questions done
      setStep('result');
    } else {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setTimeLeft(QUIZ_QUESTIONS[nextIndex].timerSeconds);
      setSelected(null);
      setAnswered(false);
    }
  }, [questionIndex]);

  // 타이머 효과 / Timer effect
  useEffect(() => {
    if (step !== 'quiz' || answered) return;

    if (timeLeft <= 0) {
      // 시간 초과 — 0점으로 기록 / Time's up — record 0 points
      setAnswered(true);
      setScoreRecords((prev) => [
        ...prev,
        {
          questionId: questionIndex,
          selectedValue: 'timeout',
          timeLeft: 0,
          points: 0,
        },
      ]);
      // 1.5초 후 다음으로 / Next after 1.5 seconds
      const timeout = setTimeout(goToNext, 1500);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, answered, timeLeft, questionIndex, goToNext]);

  // 선택 처리 / Handle selection
  const handleSelect = useCallback(
    (value: string | number) => {
      if (answered) return;
      setSelected(value);
      setAnswered(true);

      // 점수 계산 / Calculate points
      const pts = calcPoints(timeLeft, currentQuestion.timerSeconds);
      setTotalScore((prev) => prev + pts);
      setScoreRecords((prev) => [
        ...prev,
        {
          questionId: questionIndex,
          selectedValue: value,
          timeLeft,
          points: pts,
        },
      ]);

      // 1.5초 후 다음으로 / Next after 1.5 seconds
      setTimeout(goToNext, 1500);
    },
    [answered, timeLeft, currentQuestion.timerSeconds, questionIndex, goToNext]
  );

  // 퀴즈 시작 / Start quiz
  const handleStart = useCallback(() => {
    setStep('quiz');
    setQuestionIndex(0);
    setTimeLeft(QUIZ_QUESTIONS[0].timerSeconds);
    setSelected(null);
    setAnswered(false);
    setTotalScore(0);
    setScoreRecords([]);
  }, []);

  // 재시작 / Restart
  const handleRestart = useCallback(() => {
    setStep('intro');
    setQuestionIndex(0);
    setTimeLeft(QUIZ_QUESTIONS[0].timerSeconds);
    setSelected(null);
    setAnswered(false);
    setTotalScore(0);
    setScoreRecords([]);
  }, []);

  // 단계별 렌더링 / Render by step
  if (step === 'intro') {
    return <IntroScreen onStart={handleStart} />;
  }

  if (step === 'quiz') {
    return (
      <QuizScreen
        question={currentQuestion}
        questionNumber={questionIndex + 1}
        totalScore={totalScore}
        timeLeft={timeLeft}
        selected={selected}
        answered={answered}
        onSelect={handleSelect}
      />
    );
  }

  // 결과 화면 / Result screen
  return (
    <ResultScreen
      totalScore={totalScore}
      scoreRecords={scoreRecords}
      onRestart={handleRestart}
    />
  );
}
