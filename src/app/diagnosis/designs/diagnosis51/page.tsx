'use client';

// KOR: 온라인 강의(Online Course) 컨셉의 비자 진단 페이지 — Udemy 스타일
// ENG: Visa diagnosis page with Online Course concept — Udemy-style design

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
  PlayCircle,
  CheckCircle,
  Lock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  Users,
  Award,
  BookOpen,
  Globe,
  DollarSign,
  Target,
  BarChart2,
  RefreshCw,
  Download,
  Share2,
  Zap,
} from 'lucide-react';

// KOR: 진단 단계(모듈) 정의
// ENG: Diagnosis step (module) definitions
const MODULES = [
  { id: 1, key: 'nationality', title: '국적 선택', titleEn: 'Select Nationality', icon: Globe, duration: '1분' },
  { id: 2, key: 'age', title: '나이 입력', titleEn: 'Enter Age', icon: Users, duration: '30초' },
  { id: 3, key: 'educationLevel', title: '학력 수준', titleEn: 'Education Level', icon: BookOpen, duration: '1분' },
  { id: 4, key: 'availableAnnualFund', title: '연간 가용 자금', titleEn: 'Annual Budget', icon: DollarSign, duration: '1분' },
  { id: 5, key: 'finalGoal', title: '최종 목표', titleEn: 'Final Goal', icon: Target, duration: '1분' },
  { id: 6, key: 'priorityPreference', title: '우선순위 설정', titleEn: 'Priority Setting', icon: BarChart2, duration: '30초' },
];

// KOR: 초기 입력 상태
// ENG: Initial input state
const INITIAL_INPUT: DiagnosisInput = {
  nationality: '',
  age: 0,
  educationLevel: '',
  availableAnnualFund: '',
  finalGoal: '',
  priorityPreference: '',
};

// KOR: 수료증 컴포넌트 — 진단 완료 후 발급
// ENG: Certificate component — issued after diagnosis completion
function Certificate({ result }: { result: DiagnosisResult }) {
  const topPath = result.pathways[0];
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="relative border-4 border-purple-600 rounded-2xl p-8 bg-white shadow-2xl overflow-hidden">
      {/* KOR: 배경 장식 / ENG: Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-purple-600 rounded-full -translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-600 rounded-full translate-x-20 translate-y-20" />
      </div>

      {/* KOR: 헤더 / ENG: Header */}
      <div className="text-center mb-6 relative">
        <div className="flex justify-center mb-3">
          <div className="bg-purple-600 text-white rounded-full p-3">
            <Award className="w-10 h-10" />
          </div>
        </div>
        <p className="text-purple-500 text-sm font-semibold tracking-widest uppercase">JobChaja Visa Academy</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-1">수료증</h2>
        <p className="text-gray-500 text-sm">Certificate of Completion</p>
      </div>

      {/* KOR: 구분선 / ENG: Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-purple-200" />
        <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
        <div className="flex-1 h-px bg-purple-200" />
      </div>

      {/* KOR: 수강자 정보 / ENG: Learner info */}
      <div className="text-center mb-6">
        <p className="text-gray-500 text-sm">이 수료증은 다음 분께 수여됩니다</p>
        <p className="text-gray-400 text-xs mb-3">This certificate is awarded to</p>
        <div className="inline-block bg-purple-50 border border-purple-200 rounded-xl px-8 py-3">
          <p className="text-2xl font-bold text-purple-700">
            {result.userInput.nationality} 출신 • {result.userInput.age}세
          </p>
          <p className="text-gray-500 text-sm mt-1">{result.userInput.educationLevel}</p>
        </div>
      </div>

      {/* KOR: 과정명 / ENG: Course name */}
      <div className="bg-linear-to-br from-purple-600 to-purple-800 rounded-xl p-5 text-white text-center mb-6">
        <p className="text-purple-200 text-xs mb-1">수료 과정 | Completed Course</p>
        <h3 className="text-xl font-bold">한국 비자 경로 진단 전문 과정</h3>
        <p className="text-purple-300 text-sm mt-1">Korea Visa Pathway Diagnosis Program</p>
      </div>

      {/* KOR: 최우선 추천 경로 / ENG: Top recommended pathway */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 text-center mb-2">최우선 추천 비자 경로 | Top Recommended Pathway</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-gray-800">{topPath.name}</p>
          <div className="flex justify-center gap-6 mt-2 text-sm text-gray-600">
            <span>적합도 {topPath.feasibilityScore}%</span>
            <span>•</span>
            <span>{topPath.totalDurationMonths}개월</span>
            <span>•</span>
            <span>${((topPath as any).estimatedCostUSD ?? topPath.estimatedCostWon ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* KOR: 발급일 / ENG: Issue date */}
      <div className="flex justify-between items-end text-sm text-gray-500">
        <div>
          <p className="font-semibold text-gray-700">JobChaja Academy</p>
          <p className="text-xs">잡차자 비자 교육원</p>
        </div>
        <div className="text-right">
          <p>발급일 | Issue Date</p>
          <p className="font-semibold text-gray-700">{today}</p>
        </div>
      </div>
    </div>
  );
}

// KOR: 성적표(경로 카드) 컴포넌트
// ENG: Grade report (pathway card) component
function PathwayGradeCard({ pathway, rank }: { pathway: RecommendedPathway; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColorClass = getScoreColor(pathway.feasibilityLabel);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // KOR: 등급 라벨 계산 / ENG: Grade label calculation
  const getGrade = (score: number): { letter: string; color: string } => {
    if (score >= 90) return { letter: 'A+', color: 'text-emerald-600' };
    if (score >= 80) return { letter: 'A', color: 'text-blue-600' };
    if (score >= 70) return { letter: 'B+', color: 'text-purple-600' };
    if (score >= 60) return { letter: 'B', color: 'text-yellow-600' };
    return { letter: 'C', color: 'text-orange-600' };
  };

  const grade = getGrade(pathway.feasibilityScore);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* KOR: 카드 헤더 / ENG: Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left"
      >
        {/* KOR: 순위 배지 / ENG: Rank badge */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-700 font-bold text-sm">#{rank}</span>
        </div>

        {/* KOR: 경로 정보 / ENG: Pathway info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-sm truncate">{pathway.name}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">{pathway.totalDurationMonths}개월</span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-500">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs">{emoji} {pathway.feasibilityLabel}</span>
          </div>
        </div>

        {/* KOR: 점수 + 등급 / ENG: Score + grade */}
        <div className="shrink-0 text-right">
          <span className={`text-2xl font-black ${grade.color}`}>{grade.letter}</span>
          <p className="text-xs text-gray-500">{pathway.feasibilityScore}점</p>
        </div>

        <div className="shrink-0">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* KOR: 적합도 바 / ENG: Feasibility bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className={`h-full ${scoreColorClass} transition-all duration-700`}
          style={{ width: `${pathway.feasibilityScore}%` }}
        />
      </div>

      {/* KOR: 확장 영역 — 마일스톤 + 비자 체인 / ENG: Expanded area — milestones + visa chain */}
      {expanded && (
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          {/* KOR: 비자 체인 / ENG: Visa chain */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">비자 경로 | Visa Chain</p>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">{item.visa}</span>
                  <span className="text-xs text-gray-400">{item.duration}</span>
                  {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 마일스톤 목록 / ENG: Milestone list */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">학습 마일스톤 | Milestones</p>
            <div className="space-y-2">
              {pathway.milestones.map((m, idx) => (
                <div key={idx} className="flex gap-3 bg-white rounded-lg p-3 border border-gray-100">
                  <span className="text-lg shrink-0">{m.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{m.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KOR: 경로 설명 / ENG: Pathway description */}
          <p className="text-xs text-gray-500 mt-3 italic">{pathway.description}</p>
        </div>
      )}
    </div>
  );
}

// KOR: 퀴즈 카드 컴포넌트 — 각 모듈의 입력 UI
// ENG: Quiz card component — input UI for each module
function QuizCard({
  step,
  input,
  onUpdate,
}: {
  step: number;
  input: DiagnosisInput;
  onUpdate: (key: keyof DiagnosisInput, value: string | number) => void;
}) {
  const module = MODULES[step - 1];

  // KOR: 단계별 퀴즈 렌더링 / ENG: Render quiz by step
  const renderQuiz = () => {
    switch (module.key) {
      // KOR: 국적 선택 / ENG: Nationality selection
      case 'nationality':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              어느 나라에서 오셨나요? | Which country are you from?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {popularCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => onUpdate('nationality', c.name)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    input.nationality === c.name
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="text-xs truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // KOR: 나이 입력 / ENG: Age input
      case 'age':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              현재 나이를 입력해 주세요 | Please enter your current age
            </p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => onUpdate('age', Math.max(0, (input.age || 0) - 1))}
                className="w-14 h-14 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 text-2xl font-bold flex items-center justify-center transition-colors"
              >
                −
              </button>
              <div className="text-center">
                <span className="text-6xl font-black text-purple-700">{input.age || 0}</span>
                <p className="text-gray-500 text-sm mt-1">세 | years old</p>
              </div>
              <button
                onClick={() => onUpdate('age', (input.age || 0) + 1)}
                className="w-14 h-14 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 text-2xl font-bold flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
            <div className="mt-4">
              <input
                type="range"
                min={18}
                max={65}
                value={input.age || 25}
                onChange={(e) => onUpdate('age', parseInt(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>18세</span>
                <span>65세</span>
              </div>
            </div>
          </div>
        );

      // KOR: 학력 수준 / ENG: Education level
      case 'educationLevel':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              최종 학력을 선택해 주세요 | Select your highest education level
            </p>
            {educationOptions.map((opt, idx) => (
              <button
                key={opt}
                onClick={() => onUpdate('educationLevel', opt)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  input.educationLevel === opt
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  input.educationLevel === opt ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {idx + 1}
                </div>
                <span className={`font-medium text-sm ${input.educationLevel === opt ? 'text-purple-700' : 'text-gray-700'}`}>
                  {opt}
                </span>
                {input.educationLevel === opt && (
                  <CheckCircle className="w-5 h-5 text-purple-600 ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
        );

      // KOR: 연간 가용 자금 / ENG: Annual budget
      case 'availableAnnualFund':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              연간 사용 가능한 예산은 얼마인가요? | What is your available annual budget?
            </p>
            {fundOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onUpdate('availableAnnualFund', opt)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  input.availableAnnualFund === opt
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <DollarSign className={`w-5 h-5 shrink-0 ${input.availableAnnualFund === opt ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className={`font-medium text-sm ${input.availableAnnualFund === opt ? 'text-purple-700' : 'text-gray-700'}`}>
                  {opt}
                </span>
                {input.availableAnnualFund === opt && (
                  <CheckCircle className="w-5 h-5 text-purple-600 ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
        );

      // KOR: 최종 목표 / ENG: Final goal
      case 'finalGoal':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              한국에서의 최종 목표는 무엇인가요? | What is your final goal in Korea?
            </p>
            {goalOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onUpdate('finalGoal', opt)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  input.finalGoal === opt
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Target className={`w-5 h-5 shrink-0 ${input.finalGoal === opt ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className={`font-medium text-sm ${input.finalGoal === opt ? 'text-purple-700' : 'text-gray-700'}`}>
                  {opt}
                </span>
                {input.finalGoal === opt && (
                  <CheckCircle className="w-5 h-5 text-purple-600 ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
        );

      // KOR: 우선순위 / ENG: Priority preference
      case 'priorityPreference':
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              가장 중요하게 생각하는 것은? | What is most important to you?
            </p>
            {priorityOptions.map((opt, idx) => {
              const icons = ['⚡', '💰', '🏆', '🎯'];
              return (
                <button
                  key={opt}
                  onClick={() => onUpdate('priorityPreference', opt)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    input.priorityPreference === opt
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className="text-xl shrink-0">{icons[idx]}</span>
                  <span className={`font-medium text-sm ${input.priorityPreference === opt ? 'text-purple-700' : 'text-gray-700'}`}>
                    {opt}
                  </span>
                  {input.priorityPreference === opt && (
                    <CheckCircle className="w-5 h-5 text-purple-600 ml-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* KOR: 퀴즈 카드 헤더 / ENG: Quiz card header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-purple-100 rounded-xl p-2.5">
          <PlayCircle className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <p className="text-xs text-purple-500 font-semibold uppercase tracking-wide">
            Module {step} Quiz
          </p>
          <h3 className="text-base font-bold text-gray-800">{module.title}</h3>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{module.duration}</span>
        </div>
      </div>

      {/* KOR: 퀴즈 내용 / ENG: Quiz content */}
      {renderQuiz()}
    </div>
  );
}

// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
export default function Diagnosis51Page() {
  // KOR: 현재 단계 (1~6 = 입력, 7 = 결과)
  // ENG: Current step (1-6 = input, 7 = result)
  const [currentStep, setCurrentStep] = useState(1);
  const [input, setInput] = useState<DiagnosisInput>(INITIAL_INPUT);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([1]));

  // KOR: 총 단계 수 / ENG: Total number of steps
  const TOTAL_STEPS = MODULES.length;

  // KOR: 진도율 계산 / ENG: Progress calculation
  const progressPercent = Math.round((currentStep - 1) / TOTAL_STEPS * 100);

  // KOR: 현재 단계 유효성 검사 / ENG: Validate current step
  const isCurrentStepValid = (): boolean => {
    const module = MODULES[currentStep - 1];
    switch (module.key) {
      case 'nationality': return !!input.nationality;
      case 'age': return (input.age || 0) >= 18;
      case 'educationLevel': return !!input.educationLevel;
      case 'availableAnnualFund': return !!input.availableAnnualFund;
      case 'finalGoal': return !!input.finalGoal;
      case 'priorityPreference': return !!input.priorityPreference;
      default: return false;
    }
  };

  // KOR: 입력값 업데이트 핸들러 / ENG: Input update handler
  const handleUpdate = (key: keyof DiagnosisInput, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // KOR: 다음 단계로 이동 / ENG: Move to next step
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setExpandedModules((prev) => new Set([...prev, next]));
    } else {
      handleSubmit();
    }
  };

  // KOR: 진단 제출 및 결과 로드 / ENG: Submit diagnosis and load result
  const handleSubmit = () => {
    setIsLoading(true);
    // KOR: 목업 딜레이 — 실제 API 호출 시 대체 / ENG: Mock delay — replace with real API call
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setCurrentStep(TOTAL_STEPS + 1);
      setIsLoading(false);
    }, 2000);
  };

  // KOR: 처음부터 다시 시작 / ENG: Restart from the beginning
  const handleRestart = () => {
    setCurrentStep(1);
    setInput(INITIAL_INPUT);
    setResult(null);
    setExpandedModules(new Set([1]));
  };

  // KOR: 모듈 펼치기/접기 토글 (완료된 모듈만) / ENG: Toggle module expand/collapse (completed only)
  const toggleModule = (moduleId: number) => {
    if (moduleId >= currentStep) return;
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* KOR: 상단 강의 헤더 바 / ENG: Top course header bar */}
      <header className="bg-gray-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 rounded-lg p-1.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">JobChaja Academy</p>
              <p className="text-sm font-bold leading-tight">한국 비자 경로 진단 과정</p>
            </div>
          </div>

          {/* KOR: 진도율 바 (헤더) / ENG: Progress bar (header) */}
          <div className="hidden md:flex items-center gap-3 flex-1 mx-8">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${result ? 100 : progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 shrink-0">
              {result ? '100' : progressPercent}% 완료
            </span>
          </div>

          <div className="flex items-center gap-2">
            {result && (
              <>
                <button className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-700">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">수료증 저장</span>
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-700">
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">공유</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* KOR: 좌측 사이드바 — 강의 목차 / ENG: Left sidebar — course curriculum */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-20">
            {/* KOR: 사이드바 헤더 / ENG: Sidebar header */}
            <div className="bg-linear-to-br from-purple-700 to-purple-900 p-4 text-white">
              <p className="text-xs text-purple-300 mb-1">강의 목차 | Course Content</p>
              <h3 className="font-bold">비자 진단 모듈</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-purple-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-300 rounded-full transition-all duration-500"
                    style={{ width: `${result ? 100 : progressPercent}%` }}
                  />
                </div>
                <span className="text-xs text-purple-300">{result ? 6 : currentStep - 1}/{TOTAL_STEPS}</span>
              </div>
            </div>

            {/* KOR: 모듈 목록 / ENG: Module list */}
            <div className="divide-y divide-gray-100">
              {MODULES.map((mod) => {
                const isCompleted = result ? true : mod.id < currentStep;
                const isCurrent = mod.id === currentStep && !result;
                const isLocked = mod.id > currentStep && !result;
                const ModIcon = mod.icon;

                return (
                  <button
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    disabled={isLocked}
                    className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                      isCurrent
                        ? 'bg-purple-50'
                        : isCompleted
                        ? 'hover:bg-gray-50'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isCompleted ? 'bg-green-100' : isCurrent ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ModIcon className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isCurrent ? 'text-purple-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {mod.title}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {mod.duration}
                      </p>
                    </div>
                    {isCurrent && (
                      <PlayCircle className="w-4 h-4 text-purple-500 shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* KOR: 결과 모듈 / ENG: Result module */}
              <div className={`flex items-center gap-3 p-4 ${result ? 'bg-yellow-50' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${result ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <Award className={`w-4 h-4 ${result ? 'text-yellow-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${result ? 'text-yellow-700' : 'text-gray-400'}`}>
                    수료증 발급
                  </p>
                  <p className="text-xs text-gray-400">결과 확인</p>
                </div>
                {result && <CheckCircle className="w-4 h-4 text-yellow-500 ml-auto shrink-0" />}
              </div>
            </div>

            {/* KOR: 강의 통계 / ENG: Course stats */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
              <div className="flex justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>12,483명 수강</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span>4.9</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* KOR: 메인 콘텐츠 영역 / ENG: Main content area */}
        <main className="flex-1 min-w-0">
          {/* KOR: 모바일 진도 바 / ENG: Mobile progress bar */}
          <div className="lg:hidden mb-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-gray-600">
                  {result ? '완료' : `모듈 ${currentStep} / ${TOTAL_STEPS}`}
                </p>
                <p className="text-xs text-purple-600 font-bold">{result ? 100 : progressPercent}%</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${result ? 100 : progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* KOR: 로딩 상태 / ENG: Loading state */}
          {isLoading && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
                  <Zap className="absolute inset-0 m-auto w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">AI 비자 분석 중...</h3>
              <p className="text-gray-500 text-sm">입력하신 정보를 바탕으로 최적의 비자 경로를 분석하고 있습니다.</p>
              <p className="text-gray-400 text-xs mt-1">Analyzing optimal visa pathways based on your input...</p>
            </div>
          )}

          {/* KOR: 결과 화면 / ENG: Result screen */}
          {!isLoading && result && (
            <div className="space-y-6">
              {/* KOR: 수료 완료 배너 / ENG: Completion banner */}
              <div className="bg-linear-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-6 h-6 text-yellow-300" />
                      <span className="text-yellow-300 font-semibold text-sm">과정 수료 완료!</span>
                    </div>
                    <h2 className="text-2xl font-black mb-1">진단 완료</h2>
                    <p className="text-purple-200 text-sm">
                      {result.pathways.length}개의 비자 경로가 분석되었습니다.
                    </p>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    다시 진단
                  </button>
                </div>

                {/* KOR: 입력 요약 칩 / ENG: Input summary chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    result.userInput.nationality,
                    `${result.userInput.age}세`,
                    result.userInput.educationLevel,
                    result.userInput.availableAnnualFund,
                  ].map((v, i) => (
                    <span key={i} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* KOR: 수료증 / ENG: Certificate */}
              <Certificate result={result} />

              {/* KOR: 성적표 헤더 / ENG: Grade report header */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-800">성적표 — 비자 경로 분석</h3>
                  <span className="text-sm text-gray-500">| Grade Report</span>
                </div>
                <div className="space-y-3">
                  {result.pathways.map((pathway, idx) => (
                    <PathwayGradeCard key={pathway.id} pathway={pathway} rank={idx + 1} />
                  ))}
                </div>
              </div>

              {/* KOR: 다음 단계 CTA / ENG: Next step CTA */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h4 className="font-bold text-gray-800 mb-1">다음 단계는?</h4>
                <p className="text-sm text-gray-500 mb-4">전문 컨설턴트와 함께 비자 경로를 구체화하세요. | Work with an expert to refine your pathway.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm">
                    전문가 상담 신청
                  </button>
                  <button className="flex-1 border border-gray-300 hover:border-purple-400 text-gray-700 hover:text-purple-700 font-semibold py-3 px-6 rounded-xl transition-colors text-sm">
                    채용 공고 보기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* KOR: 입력 단계 화면 / ENG: Input step screen */}
          {!isLoading && !result && (
            <div className="space-y-4">
              {/* KOR: 현재 모듈 소개 카드 / ENG: Current module intro card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    {currentStep}
                  </div>
                  <div>
                    <p className="text-xs text-purple-500 font-semibold uppercase tracking-wide">현재 모듈 | Current Module</p>
                    <h2 className="text-lg font-bold text-gray-800">{MODULES[currentStep - 1].title}</h2>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{MODULES[currentStep - 1].duration}</span>
                  </div>
                </div>
              </div>

              {/* KOR: 퀴즈 카드 / ENG: Quiz card */}
              <QuizCard step={currentStep} input={input} onUpdate={handleUpdate} />

              {/* KOR: 이전/다음 네비게이션 / ENG: Previous/Next navigation */}
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:border-purple-400 hover:text-purple-700 transition-colors font-medium text-sm"
                  >
                    이전으로
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                    isCurrentStepValid()
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {currentStep === TOTAL_STEPS ? (
                    <>
                      <Zap className="w-4 h-4" />
                      분석 시작
                    </>
                  ) : (
                    <>
                      다음 모듈
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* KOR: 단계 도트 인디케이터 / ENG: Step dot indicator */}
              <div className="flex justify-center gap-2 pt-2">
                {MODULES.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx + 1 < currentStep
                        ? 'bg-purple-600 w-4'
                        : idx + 1 === currentStep
                        ? 'bg-purple-600 w-6'
                        : 'bg-gray-200 w-4'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
