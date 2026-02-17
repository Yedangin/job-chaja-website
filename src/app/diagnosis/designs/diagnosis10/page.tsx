'use client';

// KOR: 비자 진단 인터뷰 페이지 - 영상 면접 UI 컨셉 (Design #10)
// ENG: Visa diagnosis interview page - Video interview UI concept (Design #10)

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Circle,
  SkipForward,
  RotateCcw,
  Clock,
  DollarSign,
  Award,
  ChevronDown,
  ChevronUp,
  Share2,
  Download,
  Star,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  Users,
  FileText,
  ArrowRight,
  Send,
  Monitor,
  Settings,
  Maximize,
  Volume2,
  Pause,
  Play,
  Globe,
} from 'lucide-react';

// KOR: 목업 데이터 임포트 / ENG: Mock data import
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
// KOR: 타입 정의 / ENG: Type definitions
// ============================================================

// KOR: 인터뷰 단계 타입 / ENG: Interview step type
type InterviewStep =
  | 'lobby'
  | 'nationality'
  | 'age'
  | 'education'
  | 'fund'
  | 'goal'
  | 'priority'
  | 'analyzing'
  | 'result';

// KOR: 면접관 표정 상태 타입 / ENG: Interviewer mood state type
type InterviewerMood = 'neutral' | 'happy' | 'thinking' | 'excited';

// ============================================================
// KOR: 면접관 질문 데이터 / ENG: Interviewer question data
// ============================================================
const interviewQuestions: Record<
  string,
  { questionKo: string; questionEn: string; subtext: string }
> = {
  nationality: {
    questionKo: '어느 나라에서 오셨나요?',
    questionEn: 'Which country are you from?',
    subtext: '국적에 따라 비자 옵션이 달라집니다. / Visa options vary by nationality.',
  },
  age: {
    questionKo: '나이가 어떻게 되시나요?',
    questionEn: 'How old are you?',
    subtext: '연령대에 따른 최적 경로를 찾아드립니다. / We find the best path for your age group.',
  },
  education: {
    questionKo: '최종 학력을 알려주세요.',
    questionEn: 'What is your highest education level?',
    subtext: '학력은 비자 심사에서 중요한 요소입니다. / Education is a key factor in visa screening.',
  },
  fund: {
    questionKo: '연간 활용 가능한 자금은 얼마인가요?',
    questionEn: 'What is your available annual budget?',
    subtext: '재정 상태에 맞는 경로를 추천합니다. / We recommend a path that fits your finances.',
  },
  goal: {
    questionKo: '한국에서의 최종 목표는 무엇인가요?',
    questionEn: 'What is your ultimate goal in Korea?',
    subtext: '목표에 따라 최적의 비자 경로가 달라집니다. / Your goal determines the optimal visa path.',
  },
  priority: {
    questionKo: '가장 중요하게 생각하는 것은 무엇인가요?',
    questionEn: 'What matters most to you?',
    subtext: '우선순위에 맞춰 경로를 정렬합니다. / We sort pathways by your priorities.',
  },
};

// KOR: 총 질문 수 / ENG: Total question count
const TOTAL_QUESTIONS = 6;

// ============================================================
// KOR: 유틸리티 함수 / ENG: Utility functions
// ============================================================

// KOR: 경과 시간 포맷 MM:SS / ENG: Format elapsed time as MM:SS
const formatElapsed = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// KOR: 만원 단위 비용 포맷 / ENG: Format cost in 만원 (10K KRW)
const formatCostWon = (won: number): string => {
  if (won === 0) return '무료 / Free';
  if (won >= 10000) return `${Math.round(won / 10000)}억원`;
  return `${won.toLocaleString()}만원`;
};

// KOR: 현재 날짜 문자열 / ENG: Current date string
const getFormattedDate = (): string => {
  const now = new Date();
  return `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now
    .getDate()
    .toString()
    .padStart(2, '0')}`;
};

// KOR: 현재 시간 문자열 / ENG: Current time string
const getFormattedTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

// KOR: 현재 질문 번호 계산 / ENG: Calculate current question number
const getQuestionNumber = (step: InterviewStep): number => {
  const questionSteps: InterviewStep[] = [
    'nationality',
    'age',
    'education',
    'fund',
    'goal',
    'priority',
  ];
  const idx = questionSteps.indexOf(step);
  return idx === -1 ? 0 : idx + 1;
};

// ============================================================
// KOR: 메인 페이지 컴포넌트 / ENG: Main page component
// ============================================================
export default function Diagnosis10Page() {
  // KOR: 상태 관리 / ENG: State management
  const [step, setStep] = useState<InterviewStep>('lobby');
  const [inputData, setInputData] = useState<Partial<DiagnosisInput>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewerMood, setInterviewerMood] = useState<InterviewerMood>('neutral');
  const [ageText, setAgeText] = useState('');
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // KOR: 인터벌 레퍼런스 / ENG: Interval reference
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // KOR: 날짜/시간 초기화 (hydration 오류 방지) / ENG: Initialize date/time on client only
  useEffect(() => {
    setCurrentDate(getFormattedDate());
    setCurrentTime(getFormattedTime());
    const clockInterval = setInterval(() => {
      setCurrentDate(getFormattedDate());
      setCurrentTime(getFormattedTime());
    }, 60000);
    return () => clearInterval(clockInterval);
  }, []);

  // KOR: 인터뷰 진행 중 타이머 동작 / ENG: Timer runs during active interview steps
  useEffect(() => {
    const activeSteps: InterviewStep[] = [
      'nationality',
      'age',
      'education',
      'fund',
      'goal',
      'priority',
    ];
    if (activeSteps.includes(step)) {
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [step]);

  // KOR: 분석 단계 진행 애니메이션 / ENG: Analysis progress bar animation
  useEffect(() => {
    if (step !== 'analyzing') return;
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // KOR: 분석 완료 후 결과 화면으로 이동 / ENG: Move to result screen after analysis
    const timer = setTimeout(() => {
      setResult(mockDiagnosisResult);
      setStep('result');
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [step]);

  // ============================================================
  // KOR: 단계 전환 핸들러 / ENG: Step transition handler with animation
  // ============================================================
  const transitionToStep = (
    nextStep: InterviewStep,
    mood: InterviewerMood = 'happy'
  ) => {
    setIsTransitioning(true);
    setInterviewerMood(mood);
    setTimeout(() => {
      setStep(nextStep);
      setInterviewerMood('neutral');
      setIsTransitioning(false);
    }, 500);
  };

  // ============================================================
  // KOR: 입력 핸들러들 / ENG: Input handlers
  // ============================================================

  // KOR: 인터뷰 시작 / ENG: Start interview
  const handleStartInterview = () => {
    setElapsedTime(0);
    setStep('nationality');
  };

  // KOR: 국적 선택 / ENG: Nationality selection
  const handleNationality = (countryNameKo: string) => {
    setInputData((prev) => ({ ...prev, nationality: countryNameKo }));
    transitionToStep('age');
  };

  // KOR: 나이 입력 제출 / ENG: Age form submit
  const handleAgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(ageText, 10);
    if (isNaN(age) || age < 15 || age > 65) return;
    setInputData((prev) => ({ ...prev, age }));
    setAgeText('');
    transitionToStep('education');
  };

  // KOR: 학력 선택 / ENG: Education selection
  const handleEducation = (value: string) => {
    setInputData((prev) => ({ ...prev, educationLevel: value }));
    transitionToStep('fund');
  };

  // KOR: 자금 선택 / ENG: Fund selection
  const handleFund = (value: number) => {
    setInputData((prev) => ({ ...prev, availableAnnualFund: value }));
    transitionToStep('goal');
  };

  // KOR: 목표 선택 / ENG: Goal selection
  const handleGoal = (value: string) => {
    setInputData((prev) => ({ ...prev, finalGoal: value }));
    transitionToStep('priority');
  };

  // KOR: 우선순위 선택 → 분석 단계 진입 / ENG: Priority → enter analysis phase
  const handlePriority = (value: string) => {
    setInputData((prev) => ({ ...prev, priorityPreference: value }));
    setInterviewerMood('excited');
    setTimeout(() => {
      setStep('analyzing');
      setInterviewerMood('neutral');
    }, 400);
  };

  // KOR: 전체 초기화 / ENG: Full reset
  const handleRestart = () => {
    setStep('lobby');
    setInputData({});
    setResult(null);
    setElapsedTime(0);
    setExpandedPathway(null);
    setAnalysisProgress(0);
    setInterviewerMood('neutral');
    setAgeText('');
    setIsRecording(false);
  };

  // KOR: 경로 카드 토글 / ENG: Toggle pathway card
  const togglePathway = (pathwayId: string) => {
    setExpandedPathway((prev) => (prev === pathwayId ? null : pathwayId));
  };

  // KOR: 건너뛰기 (mockInput 기본값 사용) / ENG: Skip using mockInput defaults
  const handleSkip = () => {
    if (step === 'nationality') {
      handleNationality(mockInput.nationality);
    } else if (step === 'education') {
      handleEducation(mockInput.educationLevel);
    } else if (step === 'fund') {
      handleFund(mockInput.availableAnnualFund);
    } else if (step === 'goal') {
      handleGoal(mockInput.finalGoal);
    } else if (step === 'priority') {
      handlePriority(mockInput.priorityPreference);
    }
  };

  // KOR: 현재 질문 번호 / ENG: Current question number
  const currentQuestionNum = getQuestionNumber(step);

  // ============================================================
  // KOR: 면접관 아바타 렌더링 / ENG: Render interviewer avatar
  // ============================================================
  const renderInterviewerAvatar = (size: 'sm' | 'lg' = 'lg') => {
    const sizeClass = size === 'lg' ? 'w-24 h-24' : 'w-14 h-14';
    const emojiClass = size === 'lg' ? 'text-4xl' : 'text-2xl';

    const moodEmoji: Record<InterviewerMood, string> = {
      neutral: '🧑‍💼',
      happy: '😊',
      thinking: '🤔',
      excited: '🎉',
    };

    return (
      <div
        className={`${sizeClass} rounded-full bg-linear-to-br from-blue-500 to-blue-800 flex items-center justify-center shadow-2xl shadow-blue-500/40 border-2 border-blue-400/40 transition-all duration-300`}
      >
        <span className={emojiClass} role="img" aria-label="interviewer">
          {moodEmoji[interviewerMood]}
        </span>
      </div>
    );
  };

  // ============================================================
  // KOR: 비디오 프레임 렌더링 / ENG: Render video frame
  // ============================================================
  const renderVideoFrame = () => {
    const currentQ =
      step !== 'lobby' && step !== 'analyzing' && step !== 'result'
        ? interviewQuestions[step]
        : null;

    return (
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl shadow-black/60">
        {/* KOR: 상단 컨트롤 바 / ENG: Top control bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/70 backdrop-blur-sm border-b border-gray-700/30">
          <div className="flex items-center gap-3">
            {/* KOR: REC 인디케이터 / ENG: Recording indicator */}
            {isRecording && (
              <div className="flex items-center gap-1.5">
                <Circle className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-mono font-bold tracking-widest">
                  REC
                </span>
              </div>
            )}
            {/* KOR: 타이머 / ENG: Timer display */}
            <span className="text-gray-400 text-xs font-mono">
              {formatElapsed(elapsedTime)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* KOR: 질문 번호 / ENG: Question number */}
            {step !== 'lobby' && step !== 'result' && step !== 'analyzing' && (
              <span className="text-gray-400 text-xs font-medium">
                Q{currentQuestionNum}/{TOTAL_QUESTIONS}
              </span>
            )}
            <span className="text-green-400 text-[10px] font-mono">HD 1080p</span>
            <Monitor className="w-3.5 h-3.5 text-gray-600" />
          </div>
        </div>

        {/* KOR: 비디오 콘텐츠 영역 / ENG: Video content area */}
        <div className="relative min-h-[260px] flex flex-col items-center justify-center px-6 py-8">
          {/* KOR: 배경 스캔라인 / ENG: Scanline background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
            }}
          />

          {/* KOR: HUD 코너 마커 / ENG: HUD corner markers */}
          <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-blue-500/40 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-blue-500/40 rounded-tr pointer-events-none" />
          <div className="absolute bottom-12 left-3 w-5 h-5 border-l-2 border-b-2 border-blue-500/40 rounded-bl pointer-events-none" />
          <div className="absolute bottom-12 right-3 w-5 h-5 border-r-2 border-b-2 border-blue-500/40 rounded-br pointer-events-none" />

          {/* KOR: 면접관 아바타 + 질문 / ENG: Interviewer avatar + question text */}
          <div
            className={`flex flex-col items-center gap-4 transition-all duration-500 ${
              isTransitioning
                ? 'opacity-0 scale-90 -translate-y-2'
                : 'opacity-100 scale-100 translate-y-0'
            }`}
          >
            {renderInterviewerAvatar('lg')}

            {/* KOR: 면접관 이름 태그 / ENG: Interviewer name tag */}
            <div className="bg-blue-600/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/50">
              <span className="text-white text-xs font-semibold tracking-wide">
                JobChaJa AI Interviewer
              </span>
            </div>

            {/* KOR: 로비 텍스트 / ENG: Lobby text */}
            {step === 'lobby' && (
              <div className="text-center space-y-2 mt-1">
                <p className="text-white text-xl font-bold tracking-tight">
                  비자 진단 인터뷰
                </p>
                <p className="text-blue-300 text-sm">Visa Diagnosis Interview</p>
                <p className="text-gray-500 text-xs max-w-[260px] mx-auto leading-relaxed">
                  AI 면접관이 6개 질문으로 최적 비자 경로를 분석합니다.
                </p>
              </div>
            )}

            {/* KOR: 인터뷰 질문 텍스트 / ENG: Interview question text */}
            {currentQ && (
              <div className="text-center max-w-sm space-y-1.5 mt-1">
                <p className="text-white text-lg font-bold leading-snug">
                  {currentQ.questionKo}
                </p>
                <p className="text-blue-300/80 text-sm">{currentQ.questionEn}</p>
              </div>
            )}

            {/* KOR: 분석 중 화면 / ENG: Analyzing screen */}
            {step === 'analyzing' && (
              <div className="text-center space-y-4 mt-1 w-full max-w-xs">
                <p className="text-white text-lg font-bold">
                  답변을 분석하고 있습니다...
                </p>
                <p className="text-blue-300 text-sm">Analyzing your responses...</p>
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs font-mono">
                  {analysisProgress}% complete
                </p>
              </div>
            )}
          </div>

          {/* KOR: 자막 바 / ENG: Subtitle bar */}
          {showSubtitles && currentQ && !isTransitioning && (
            <div className="absolute bottom-3 left-4 right-4">
              <div className="bg-black/75 backdrop-blur-sm rounded-lg px-4 py-2 text-center border border-gray-700/20">
                <p className="text-white/90 text-xs leading-relaxed">
                  {currentQ.subtext}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* KOR: 하단 플레이어 컨트롤 / ENG: Bottom player controls */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 backdrop-blur-sm border-t border-gray-700/30">
          <div className="flex items-center gap-2">
            {/* KOR: 재생/일시정지 / ENG: Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-gray-300" />
              ) : (
                <Play className="w-4 h-4 text-gray-300" />
              )}
            </button>
            {/* KOR: 볼륨 / ENG: Volume */}
            <button
              className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label="Volume"
            >
              <Volume2 className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          {/* KOR: 타임라인 바 / ENG: Timeline progress bar */}
          <div className="flex-1 mx-3 relative">
            <div className="w-full bg-gray-700/50 rounded-full h-1">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-700"
                style={{
                  width:
                    step === 'lobby'
                      ? '0%'
                      : step === 'result'
                      ? '100%'
                      : `${(currentQuestionNum / TOTAL_QUESTIONS) * 100}%`,
                }}
              />
            </div>
            {/* KOR: 타임라인 마커 / ENG: Timeline marker dots */}
            <div className="absolute inset-0 flex items-center pointer-events-none">
              {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${((i + 1) / TOTAL_QUESTIONS) * 100}%` }}
                >
                  <div
                    className={`w-2 h-2 rounded-full border transition-colors ${
                      i < currentQuestionNum
                        ? 'bg-blue-400 border-blue-300'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* KOR: 자막 토글 / ENG: Subtitle toggle */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider border transition-colors ${
                showSubtitles
                  ? 'text-white bg-blue-600 border-blue-500'
                  : 'text-gray-500 border-gray-600 hover:border-gray-400'
              }`}
              aria-label="Toggle subtitles"
            >
              CC
            </button>
            {/* KOR: 설정 / ENG: Settings */}
            <button
              className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {/* KOR: 전체화면 / ENG: Fullscreen */}
            <button
              className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label="Fullscreen"
            >
              <Maximize className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // KOR: 로비 화면 / ENG: Lobby screen
  // ============================================================
  const renderLobby = () => (
    <div className="space-y-4">
      {/* KOR: 인터뷰 안내 카드 / ENG: Interview info card */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/40 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">
              비자 진단 인터뷰 / Visa Interview
            </h3>
            <p className="text-gray-500 text-xs">6개 질문 · 약 2~3분 소요</p>
          </div>
        </div>

        {/* KOR: 카메라/마이크 상태 토글 / ENG: Camera/Mic status toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsCamOn(!isCamOn)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all border ${
              isCamOn
                ? 'bg-blue-600/15 text-blue-400 border-blue-500/30 hover:bg-blue-600/25'
                : 'bg-red-600/15 text-red-400 border-red-500/30 hover:bg-red-600/25'
            }`}
          >
            {isCamOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            {isCamOn ? '카메라 ON' : '카메라 OFF'}
          </button>
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all border ${
              isMicOn
                ? 'bg-blue-600/15 text-blue-400 border-blue-500/30 hover:bg-blue-600/25'
                : 'bg-red-600/15 text-red-400 border-red-500/30 hover:bg-red-600/25'
            }`}
          >
            {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            {isMicOn ? '마이크 ON' : '마이크 OFF'}
          </button>
        </div>

        {/* KOR: 이용 안내 / ENG: Usage instructions */}
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/20">
          <p className="text-gray-400 text-xs leading-relaxed">
            AI 면접관이 순서대로 질문합니다. 하단 선택지 버튼을 클릭해 답변하세요.
          </p>
          <p className="text-gray-600 text-[10px] mt-1">
            The AI interviewer asks questions in order. Click option buttons below to respond.
          </p>
        </div>
      </div>

      {/* KOR: 시작 버튼 / ENG: Start button */}
      <button
        onClick={handleStartInterview}
        className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-500 rounded-2xl text-white font-bold text-sm shadow-xl shadow-blue-500/30 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Video className="w-4 h-4" />
        인터뷰 시작하기 / Start Interview
      </button>
    </div>
  );

  // ============================================================
  // KOR: 답변 영역 렌더링 / ENG: Render answer area
  // ============================================================
  const renderAnswerArea = () => {
    if (step === 'lobby' || step === 'analyzing' || step === 'result') {
      return null;
    }

    return (
      <div className="space-y-3">
        {/* KOR: LIVE 답변 헤더 / ENG: LIVE answer header */}
        <div className="flex items-center gap-2 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">LIVE</span>
          </div>
          <span className="text-gray-600 text-xs">|</span>
          <span className="text-gray-400 text-xs">
            답변을 선택하세요 / Select your answer
          </span>
        </div>

        {/* KOR: 국적 선택 / ENG: Nationality selection */}
        {step === 'nationality' && (
          <div className="grid grid-cols-3 gap-2">
            {popularCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => handleNationality(c.nameKo)}
                className="flex items-center justify-center gap-1.5 px-2 py-3 bg-gray-800/70 border border-gray-700/40 rounded-xl text-xs font-medium text-gray-300 hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-blue-300 active:scale-95 transition-all"
              >
                <span className="text-base">{c.flag}</span>
                <span className="truncate">{c.nameKo}</span>
              </button>
            ))}
          </div>
        )}

        {/* KOR: 나이 입력 / ENG: Age input */}
        {step === 'age' && (
          <form onSubmit={handleAgeSubmit} className="flex items-center gap-2">
            <input
              type="number"
              value={ageText}
              onChange={(e) => setAgeText(e.target.value)}
              placeholder="나이 입력 (15~65) / Enter age"
              min={15}
              max={65}
              className="flex-1 px-4 py-3.5 bg-gray-800/70 border border-gray-700/40 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
            <button
              type="submit"
              className="p-3.5 bg-blue-600 rounded-xl hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
              aria-label="Submit age"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
        )}

        {/* KOR: 학력 선택 / ENG: Education selection */}
        {step === 'education' && (
          <div className="grid grid-cols-2 gap-2">
            {educationOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleEducation(opt.value)}
                className="flex items-center gap-2 px-3 py-3 bg-gray-800/70 border border-gray-700/40 rounded-xl text-left hover:bg-blue-600/20 hover:border-blue-500/50 active:scale-95 transition-all"
              >
                <span className="text-lg shrink-0">{opt.emoji || '🎓'}</span>
                <div className="min-w-0">
                  <span className="text-gray-200 text-xs font-medium leading-tight block truncate">
                    {opt.labelKo}
                  </span>
                  <span className="text-gray-600 text-[10px] block truncate">
                    {opt.labelEn}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* KOR: 자금 선택 / ENG: Fund selection */}
        {step === 'fund' && (
          <div className="grid grid-cols-2 gap-2">
            {fundOptions.map((opt) => (
              <button
                key={opt.bracket}
                onClick={() => handleFund(opt.value)}
                className="px-3 py-3.5 bg-gray-800/70 border border-gray-700/40 rounded-xl text-left hover:bg-blue-600/20 hover:border-blue-500/50 active:scale-95 transition-all"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <DollarSign className="w-3 h-3 text-blue-400 shrink-0" />
                  <span className="text-gray-200 text-xs font-semibold truncate">
                    {opt.labelKo}
                  </span>
                </div>
                <span className="text-gray-500 text-[10px]">{opt.labelEn}</span>
              </button>
            ))}
          </div>
        )}

        {/* KOR: 목표 선택 / ENG: Goal selection */}
        {step === 'goal' && (
          <div className="space-y-2">
            {goalOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleGoal(opt.value)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/70 border border-gray-700/40 rounded-xl hover:bg-blue-600/20 hover:border-blue-500/50 active:scale-[0.99] transition-all"
              >
                <span className="text-xl shrink-0">{opt.emoji}</span>
                <div className="flex-1 text-left min-w-0">
                  <span className="text-gray-200 text-sm font-medium block">{opt.labelKo}</span>
                  <span className="text-gray-500 text-xs block truncate">{opt.descKo}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* KOR: 우선순위 선택 / ENG: Priority selection */}
        {step === 'priority' && (
          <div className="grid grid-cols-2 gap-2">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handlePriority(opt.value)}
                className="px-3 py-3.5 bg-gray-800/70 border border-gray-700/40 rounded-xl text-left hover:bg-blue-600/20 hover:border-blue-500/50 active:scale-95 transition-all"
              >
                <span className="text-xl block mb-1.5">{opt.emoji}</span>
                <span className="text-gray-200 text-xs font-semibold block leading-tight">
                  {opt.labelKo}
                </span>
                <span className="text-gray-600 text-[10px] block mt-0.5 truncate">
                  {opt.descKo}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* KOR: 하단 컨트롤 / ENG: Bottom controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {/* KOR: 마이크 토글 / ENG: Mic toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-2.5 rounded-full transition-all ${
                isMicOn
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-red-600/20 text-red-400 border border-red-500/30'
              }`}
              aria-label={isMicOn ? 'Mute' : 'Unmute'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            {/* KOR: 카메라 토글 / ENG: Camera toggle */}
            <button
              onClick={() => setIsCamOn(!isCamOn)}
              className={`p-2.5 rounded-full transition-all ${
                isCamOn
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-red-600/20 text-red-400 border border-red-500/30'
              }`}
              aria-label={isCamOn ? 'Turn off cam' : 'Turn on cam'}
            >
              {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
          </div>

          {/* KOR: 건너뛰기 버튼 (나이 단계 제외) / ENG: Skip button (not shown on age step) */}
          {step !== 'age' && (
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-500 text-xs hover:text-gray-300 transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
              건너뛰기 / Skip
            </button>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // KOR: 결과 화면 렌더링 / ENG: Render result screen
  // ============================================================
  const renderResult = () => {
    if (!result) return null;

    // KOR: mockPathways를 결과로 사용 (5개 경로, CompatPathway 타입)
    // ENG: Use mockPathways as result display (5 pathways, CompatPathway type)
    const pathways: CompatPathway[] = mockPathways;

    return (
      <div className="space-y-5">
        {/* KOR: 인터뷰 완료 비디오 카드 / ENG: Interview complete video card */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-blue-700/30 shadow-xl">
          <div className="flex items-center justify-between px-4 py-2 bg-black/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 text-xs font-mono font-bold">
                INTERVIEW COMPLETE
              </span>
            </div>
            <span className="text-gray-500 text-xs font-mono">
              {formatElapsed(elapsedTime)}
            </span>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            {renderInterviewerAvatar('sm')}
            <div>
              <p className="text-white font-bold text-sm">인터뷰가 완료되었습니다!</p>
              <p className="text-blue-300 text-xs">Interview complete! Results are ready.</p>
              <p className="text-gray-500 text-[10px] mt-1">
                {pathways.length}개의 비자 경로가 분석되었습니다. / {pathways.length} pathways analyzed.
              </p>
            </div>
          </div>
        </div>

        {/* KOR: 요약 통계 / ENG: Summary stats */}
        <div className="bg-linear-to-br from-blue-600/15 to-cyan-600/10 rounded-2xl border border-blue-500/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-bold">
              분석 결과 요약 / Analysis Summary
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-900/50 rounded-xl p-3 text-center">
              <FileText className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg leading-none">{TOTAL_QUESTIONS}</p>
              <p className="text-gray-500 text-[10px] mt-1">질문 / Questions</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-white font-bold text-base leading-none">
                {formatElapsed(elapsedTime)}
              </p>
              <p className="text-gray-500 text-[10px] mt-1">소요 / Duration</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3 text-center">
              <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <p className="text-white font-bold text-lg leading-none">{pathways.length}</p>
              <p className="text-gray-500 text-[10px] mt-1">경로 / Pathways</p>
            </div>
          </div>
        </div>

        {/* KOR: 면접 피드백 카드 목록 / ENG: Interview feedback card list */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-bold">
              비자 경로 피드백 / Pathway Feedback
            </span>
          </div>

          {pathways.map((pathway, index) => {
            const isExpanded = expandedPathway === pathway.id;
            const scoreHex = getScoreColor(pathway.finalScore);
            const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

            return (
              <div
                key={pathway.id}
                className="bg-gray-800/60 rounded-2xl border border-gray-700/40 overflow-hidden"
              >
                {/* KOR: 카드 헤더 / ENG: Card header */}
                <button
                  onClick={() => togglePathway(pathway.id)}
                  className="w-full p-4 text-left hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* KOR: 순위 뱃지 / ENG: Rank badge */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{
                        backgroundColor: `${scoreHex}25`,
                        color: scoreHex,
                        border: `1px solid ${scoreHex}40`,
                      }}
                    >
                      #{index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-white font-bold text-sm leading-tight truncate">
                          {pathway.nameKo}
                        </h3>
                        <span className="text-base shrink-0">{emoji}</span>
                      </div>
                      <p className="text-gray-500 text-xs truncate mb-2">
                        {pathway.nameEn}
                      </p>

                      {/* KOR: 점수 바 / ENG: Score bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(pathway.finalScore, 100)}%`,
                              backgroundColor: scoreHex,
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-bold font-mono shrink-0"
                          style={{ color: scoreHex }}
                        >
                          {pathway.finalScore}
                        </span>
                      </div>
                    </div>

                    {/* KOR: 펼침 아이콘 / ENG: Expand icon */}
                    <div className="shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* KOR: 빠른 정보 칩 / ENG: Quick info chips */}
                  <div className="flex items-center gap-2 mt-3 pl-11">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-700/40 rounded-md text-gray-400 text-[10px]">
                      <Clock className="w-3 h-3" />
                      {pathway.estimatedMonths}개월
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-700/40 rounded-md text-gray-400 text-[10px]">
                      <DollarSign className="w-3 h-3" />
                      {formatCostWon(pathway.estimatedCostWon)}
                    </span>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${scoreHex}20`,
                        color: scoreHex,
                      }}
                    >
                      {pathway.feasibilityLabel}
                    </span>
                  </div>
                </button>

                {/* KOR: 확장 상세 영역 / ENG: Expanded detail area */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-gray-700/30 pt-4">
                    {/* KOR: 비자 체인 / ENG: Visa chain */}
                    <div>
                      <h4 className="text-gray-300 text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                        비자 체인 / Visa Chain
                      </h4>
                      <div className="flex items-start gap-1.5 flex-wrap">
                        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                          <React.Fragment key={i}>
                            <div className="flex flex-col items-center">
                              <span className="px-2.5 py-1 bg-blue-600/20 text-blue-300 text-xs font-mono font-semibold rounded-lg border border-blue-500/30">
                                {v.code}
                              </span>
                            </div>
                            {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                              <ArrowRight className="w-3 h-3 text-gray-600 shrink-0 mt-1.5" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* KOR: 마일스톤 / ENG: Key milestones */}
                    <div>
                      <h4 className="text-gray-300 text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        주요 단계 / Key Milestones
                      </h4>
                      <div className="space-y-2">
                        {pathway.milestones.slice(0, 4).map((milestone, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="flex flex-col items-center shrink-0">
                              <div className="w-6 h-6 rounded-full bg-gray-700/60 border border-gray-600/50 flex items-center justify-center">
                                <span className="text-gray-300 text-[10px] font-bold">
                                  {milestone.order}
                                </span>
                              </div>
                              {i < Math.min(pathway.milestones.length, 4) - 1 && (
                                <div className="w-px h-4 bg-gray-700/40 mt-1" />
                              )}
                            </div>
                            <div className="flex-1 pt-0.5 pb-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-white text-xs font-semibold leading-tight">
                                  {milestone.nameKo}
                                </p>
                                <span className="text-gray-600 text-[10px] font-mono shrink-0">
                                  +{milestone.monthFromStart}개월
                                </span>
                              </div>
                              {milestone.visaStatus !== 'none' && (
                                <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-blue-600/15 text-blue-400 text-[10px] rounded border border-blue-500/20">
                                  {milestone.visaStatus}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* KOR: 다음 단계 / ENG: Next steps */}
                    {pathway.nextSteps.length > 0 && (
                      <div>
                        <h4 className="text-gray-300 text-xs font-semibold mb-2 flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-yellow-400" />
                          다음 단계 / Next Steps
                        </h4>
                        <div className="space-y-1.5">
                          {pathway.nextSteps.map((ns, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 bg-blue-600/10 rounded-lg px-3 py-2 border border-blue-500/20"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-blue-300 text-xs font-medium block">
                                  {ns.nameKo}
                                </span>
                                <span className="text-gray-500 text-[10px]">
                                  {ns.description}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* KOR: 참고사항 / ENG: Note */}
                    {pathway.note && (
                      <div className="bg-gray-900/40 rounded-xl p-3 border border-gray-700/20 flex items-start gap-2.5">
                        <Shield className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-400 text-xs leading-relaxed">
                            {pathway.note}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* KOR: 하단 액션 버튼 / ENG: Bottom action buttons */}
        <div className="flex gap-2 pt-1 pb-6">
          <button
            onClick={handleRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 rounded-2xl text-white font-bold text-sm hover:bg-blue-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            다시 진단하기 / Retry
          </button>
          <button
            className="flex items-center justify-center px-4 py-3.5 bg-gray-800 rounded-2xl text-gray-300 border border-gray-700/50 hover:bg-gray-700 active:scale-[0.98] transition-all"
            aria-label="Share results"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            className="flex items-center justify-center px-4 py-3.5 bg-gray-800 rounded-2xl text-gray-300 border border-gray-700/50 hover:bg-gray-700 active:scale-[0.98] transition-all"
            aria-label="Download results"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ============================================================
  // KOR: 메인 렌더링 / ENG: Main render
  // ============================================================
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {/* KOR: 상단 헤더 / ENG: Top header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800/60 sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/30">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white text-sm font-bold leading-tight">
              잡차자 비자 인터뷰
            </h1>
            <p className="text-gray-500 text-[10px]">JobChaJa Visa Interview</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* KOR: 날짜/시간 (클라이언트 렌더링 후 표시) / ENG: Date/time (shown after client render) */}
          {currentDate && (
            <span className="text-gray-600 text-[10px] font-mono hidden sm:block">
              {currentDate} {currentTime}
            </span>
          )}
          {/* KOR: 연결 상태 / ENG: Connection status */}
          <div className="flex items-center gap-1 px-2 py-1 bg-green-600/10 rounded-full border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-[10px]">Connected</span>
          </div>
        </div>
      </header>

      {/* KOR: 메인 콘텐츠 / ENG: Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {/* KOR: 비디오 프레임 (결과 화면 제외) / ENG: Video frame (not on result screen) */}
          {step !== 'result' && renderVideoFrame()}

          {/* KOR: 로비 / ENG: Lobby */}
          {step === 'lobby' && renderLobby()}

          {/* KOR: 답변 입력 영역 / ENG: Answer input area */}
          {renderAnswerArea()}

          {/* KOR: 결과 화면 / ENG: Result screen */}
          {step === 'result' && renderResult()}
        </div>
      </main>

      {/* KOR: 하단 상태바 / ENG: Bottom status bar */}
      <footer className="px-4 py-2.5 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800/60">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* KOR: 장치 상태 / ENG: Device status */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1 ${
                isMicOn ? 'text-gray-500' : 'text-red-400'
              }`}
            >
              {isMicOn ? (
                <Mic className="w-3 h-3" />
              ) : (
                <MicOff className="w-3 h-3" />
              )}
              <span className="text-[10px]">{isMicOn ? 'Mic' : 'Muted'}</span>
            </div>
            <div
              className={`flex items-center gap-1 ${
                isCamOn ? 'text-gray-500' : 'text-red-400'
              }`}
            >
              {isCamOn ? (
                <Video className="w-3 h-3" />
              ) : (
                <VideoOff className="w-3 h-3" />
              )}
              <span className="text-[10px]">{isCamOn ? 'Cam' : 'Off'}</span>
            </div>
          </div>

          {/* KOR: 진행률 도트 / ENG: Progress dots */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i < currentQuestionNum
                      ? 'w-2 h-2 bg-blue-500'
                      : i === currentQuestionNum - 1 &&
                        step !== 'lobby' &&
                        step !== 'result' &&
                        step !== 'analyzing'
                      ? 'w-2 h-2 bg-blue-400 animate-pulse'
                      : 'w-1.5 h-1.5 bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 text-[10px] font-mono">
              {step === 'result'
                ? 'Complete'
                : step === 'lobby'
                ? 'Ready'
                : step === 'analyzing'
                ? 'Analyzing...'
                : `Q${currentQuestionNum}/${TOTAL_QUESTIONS}`}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
