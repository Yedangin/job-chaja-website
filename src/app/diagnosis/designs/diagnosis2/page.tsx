'use client';

import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Flag,
  GraduationCap,
  DollarSign,
  Target,
  Star,
  BrainCircuit,
  Calendar,
  Wallet,
  Link as LinkIcon,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
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
// 음파 애니메이션 컴포넌트 / Sound wave animation component
// ============================================================
const SoundWave = ({ active = true, barCount = 7 }: { active?: boolean; barCount?: number }) => (
  <div className="flex items-center justify-center space-x-1 h-10">
    {[...Array(barCount)].map((_, i) => (
      <div
        key={i}
        className={`w-1 rounded-full transition-all duration-300 ${
          active ? 'bg-purple-400' : 'bg-purple-400/30'
        }`}
        style={{
          height: active ? `${Math.random() * 24 + 8}px` : '4px',
          animation: active ? `wave 1.2s ease-in-out infinite ${i * 0.1}s` : 'none',
        }}
      />
    ))}
  </div>
);

// ============================================================
// 대형 음파 배경 컴포넌트 / Large soundwave background component
// ============================================================
const BackgroundWaves = () => (
  <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
    {[...Array(5)].map((_, row) => (
      <div
        key={row}
        className="absolute flex items-center justify-center space-x-1"
        style={{
          top: `${15 + row * 20}%`,
          left: `${10 + row * 15}%`,
          transform: `rotate(${row * 5 - 10}deg)`,
        }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-purple-500 rounded-full"
            style={{
              height: `${Math.sin(i * 0.5) * 30 + 10}px`,
              animation: `wave 2s ease-in-out infinite ${i * 0.15 + row * 0.3}s`,
            }}
          />
        ))}
      </div>
    ))}
  </div>
);

// ============================================================
// STT 인디케이터 컴포넌트 / STT indicator component
// ============================================================
const STTIndicator = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full"
            style={{ animation: `sttDot 0.8s ease-in-out infinite ${i * 0.2}s` }}
          />
        ))}
      </div>
      <span className="text-purple-400 text-sm font-medium">음성 인식 중... / Listening...</span>
    </div>
  );
};

// ============================================================
// 트랜스크립트 아이템 / Transcript item for Q&A display
// ============================================================
const TranscriptItem = ({
  speaker,
  text,
}: {
  speaker: 'bot' | 'user';
  text: string;
}) => (
  <div className={`flex items-start gap-3 ${speaker === 'user' ? 'flex-row-reverse' : ''}`}>
    <div
      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        speaker === 'bot' ? 'bg-purple-600' : 'bg-indigo-500'
      }`}
    >
      {speaker === 'bot' ? (
        <Bot className="w-4 h-4 text-white" />
      ) : (
        <User className="w-4 h-4 text-white" />
      )}
    </div>
    <div
      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        speaker === 'bot'
          ? 'bg-slate-700/80 text-slate-200 rounded-tl-none'
          : 'bg-purple-600/80 text-white rounded-tr-none'
      }`}
    >
      {text}
    </div>
  </div>
);

// ============================================================
// 경로 카드 컴포넌트 / Pathway card component
// ============================================================
const PathwayCard = ({ pathway }: { pathway: RecommendedPathway }) => {
  // 펼치기/접기 상태 / Expand/collapse state
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/50">
      {/* 헤더 / Header */}
      <div
        className="p-5 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-purple-300">{pathway.nameKo}</h3>
            <span className="text-xs text-slate-500">{pathway.nameEn}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{pathway.note}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* 점수 / Score */}
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: getScoreColor(pathway.finalScore) }}
            >
              {pathway.finalScore}
            </div>
            <div className="text-xs text-slate-500">
              {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </div>
      </div>

      {/* 상세 정보 / Detail info */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 border-t border-slate-700/50 pt-4">
          {/* 요약 정보 / Summary info */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-slate-500">소요 기간 / Duration</div>
                <div className="text-sm text-slate-200">{pathway.estimatedMonths}개월</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-slate-500">예상 비용 / Cost</div>
                <div className="text-sm text-slate-200">
                  {pathway.estimatedCostWon === 0
                    ? '무료'
                    : `${pathway.estimatedCostWon.toLocaleString()}만원`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-slate-500">플랫폼 지원 / Support</div>
                <div className="text-sm text-slate-200">
                  {pathway.platformSupport === 'full_support'
                    ? '풀 서포트'
                    : pathway.platformSupport === 'visa_processing'
                    ? '비자 처리'
                    : '정보 제공'}
                </div>
              </div>
            </div>
          </div>

          {/* 비자 체인 / Visa chain */}
          <div className="mb-4">
            <div className="text-xs text-slate-500 mb-2">비자 경로 / Visa Chain</div>
            <div className="flex items-center gap-2 flex-wrap">
              {pathway.visaChain.split(' \u2192 ').map((visa, index, arr) => (
                <React.Fragment key={index}>
                  <span className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-lg text-xs font-mono border border-purple-500/30">
                    {visa}
                  </span>
                  {index < arr.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-purple-500" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div>
              <div className="text-xs text-slate-500 mb-2">다음 단계 / Next Steps</div>
              <div className="space-y-2">
                {pathway.nextSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm bg-slate-700/30 rounded-lg p-3"
                  >
                    <Clock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-purple-300 font-medium">{step.nameKo}</span>
                      <span className="text-slate-400 ml-2">{step.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 호환 경로 카드 / Compatible pathway card
// ============================================================
const CompatPathwayCard = ({ pathway }: { pathway: CompatPathway }) => (
  <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all duration-300">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-bold text-slate-200 text-sm">{pathway.nameKo}</h4>
      <span
        className="text-sm font-bold"
        style={{ color: getScoreColor(pathway.finalScore) }}
      >
        {pathway.finalScore}점
      </span>
    </div>
    <p className="text-xs text-slate-400">{pathway.note}</p>
    <div className="mt-3 flex flex-wrap gap-1.5">
      {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v) => (
        <span
          key={v.code}
          className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20"
        >
          {v.code}
        </span>
      ))}
    </div>
    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
      <span>{pathway.estimatedMonths}개월</span>
      <span>
        {pathway.estimatedCostWon === 0
          ? '무료'
          : `${pathway.estimatedCostWon.toLocaleString()}만원`}
      </span>
    </div>
  </div>
);

// ============================================================
// 질문 정의 / Question definitions
// ============================================================
interface QuestionDef {
  key: keyof DiagnosisInput;
  labelKo: string;
  labelEn: string;
  icon: React.ReactNode;
  botQuestion: string;
}

const questions: QuestionDef[] = [
  {
    key: 'nationality',
    labelKo: '국적',
    labelEn: 'Nationality',
    icon: <Flag className="w-5 h-5" />,
    botQuestion: '어느 나라에서 오셨나요? / Which country are you from?',
  },
  {
    key: 'age',
    labelKo: '나이',
    labelEn: 'Age',
    icon: <User className="w-5 h-5" />,
    botQuestion: '나이가 어떻게 되시나요? / How old are you?',
  },
  {
    key: 'educationLevel',
    labelKo: '학력',
    labelEn: 'Education',
    icon: <GraduationCap className="w-5 h-5" />,
    botQuestion: '최종 학력은 무엇인가요? / What is your highest education?',
  },
  {
    key: 'availableAnnualFund',
    labelKo: '자금',
    labelEn: 'Fund',
    icon: <DollarSign className="w-5 h-5" />,
    botQuestion: '연간 가용 자금은 얼마인가요? / What is your available annual fund?',
  },
  {
    key: 'finalGoal',
    labelKo: '목표',
    labelEn: 'Goal',
    icon: <Target className="w-5 h-5" />,
    botQuestion: '한국에서의 최종 목표는 무엇인가요? / What is your final goal in Korea?',
  },
  {
    key: 'priorityPreference',
    labelKo: '우선순위',
    labelEn: 'Priority',
    icon: <Star className="w-5 h-5" />,
    botQuestion: '가장 중요한 것은 무엇인가요? / What matters most to you?',
  },
];

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function DiagnosisDesign2Page() {
  // 상태 관리 / State management
  // step: 0=시작, 1~6=질문, 7=분석중, 8=결과
  const [step, setStep] = useState(0);
  const [inputData, setInputData] = useState<DiagnosisInput>({
    nationality: mockInput.nationality,
    age: mockInput.age,
    educationLevel: mockInput.educationLevel,
    availableAnnualFund: mockInput.availableAnnualFund,
    finalGoal: mockInput.finalGoal,
    priorityPreference: mockInput.priorityPreference,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [showSTT, setShowSTT] = useState(false);
  const [transcript, setTranscript] = useState<{ q: string; a: string }[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  // 녹음 시뮬레이션 / Recording simulation
  useEffect(() => {
    if (isRecording) {
      setShowSTT(true);
      const timer = setTimeout(() => {
        setIsRecording(false);
        setShowSTT(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isRecording]);

  // 분석 시뮬레이션 / Analysis simulation
  useEffect(() => {
    if (analyzing) {
      const timer = setTimeout(() => {
        // 트랜스크립트 생성 / Generate transcript
        const newTranscript = questions.map((q) => {
          const key = q.key;
          const raw = inputData[key];
          let display = String(raw ?? '');

          if (key === 'nationality') {
            const found = popularCountries.find((c) => c.code === raw);
            display = found ? `${found.flag} ${found.nameKo} (${found.nameEn})` : display;
          } else if (key === 'age') {
            display = `${raw}세`;
          } else if (key === 'educationLevel') {
            const found = educationOptions.find((e) => e.value === raw);
            display = found ? `${found.emoji} ${found.labelKo}` : display;
          } else if (key === 'availableAnnualFund') {
            const found = fundOptions.find((f) => f.value === raw);
            display = found ? found.labelKo : display;
          } else if (key === 'finalGoal') {
            const found = goalOptions.find((g) => g.value === raw);
            display = found ? `${found.emoji} ${found.labelKo} - ${found.descKo}` : display;
          } else if (key === 'priorityPreference') {
            const found = priorityOptions.find((p) => p.value === raw);
            display = found ? `${found.emoji} ${found.labelKo} - ${found.descKo}` : display;
          }

          return { q: q.botQuestion, a: display };
        });
        setTranscript(newTranscript);
        setAnalyzing(false);
        setStep(8);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [analyzing, inputData]);

  // 마이크 클릭 핸들러 / Mic click handler
  const handleMicClick = () => {
    if (step === 0) {
      setStep(1);
    }
    setIsRecording(true);
  };

  // 다음 단계 핸들러 / Next step handler
  const handleNext = () => {
    if (step < questions.length) {
      setStep((prev) => prev + 1);
      setIsRecording(true);
    } else if (step === questions.length) {
      // 분석 시작 / Start analysis
      setStep(7);
      setAnalyzing(true);
    }
  };

  // 초기화 핸들러 / Reset handler
  const handleReset = () => {
    setStep(0);
    setInputData({
      nationality: mockInput.nationality,
      age: mockInput.age,
      educationLevel: mockInput.educationLevel,
      availableAnnualFund: mockInput.availableAnnualFund,
      finalGoal: mockInput.finalGoal,
      priorityPreference: mockInput.priorityPreference,
    });
    setTranscript([]);
    setIsRecording(false);
    setAnalyzing(false);
  };

  // 입력 변경 핸들러 / Input change handler
  const handleInputChange = (key: keyof DiagnosisInput, value: string | number | boolean) => {
    setInputData((prev) => ({ ...prev, [key]: value }));
  };

  // 현재 질문 입력 UI 렌더링 / Render current question input UI
  const renderQuestionInput = () => {
    if (step <= 0 || step > questions.length) return null;
    const currentQ = questions[step - 1];

    const inputUI: Record<string, React.ReactNode> = {
      nationality: (
        <div className="grid grid-cols-3 gap-2">
          {popularCountries.map((c) => (
            <button
              key={c.code}
              onClick={() => handleInputChange('nationality', c.code)}
              className={`p-2.5 rounded-xl text-sm text-center transition-all duration-200 ${
                inputData.nationality === c.code
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-105'
                  : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="text-lg">{c.flag}</div>
              <div className="text-xs mt-1">{c.nameKo}</div>
            </button>
          ))}
        </div>
      ),
      age: (
        <div className="flex flex-col items-center gap-4">
          <input
            type="range"
            min={18}
            max={60}
            value={inputData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="text-4xl font-bold text-purple-300">{inputData.age}세</div>
        </div>
      ),
      educationLevel: (
        <div className="space-y-2">
          {educationOptions.map((e) => (
            <button
              key={e.value}
              onClick={() => handleInputChange('educationLevel', e.value)}
              className={`w-full p-3 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
                inputData.educationLevel === e.value
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span className="text-lg">{e.emoji}</span>
              <span className="text-sm">{e.labelKo}</span>
              <span className="text-xs text-slate-400 ml-auto">{e.labelEn}</span>
            </button>
          ))}
        </div>
      ),
      availableAnnualFund: (
        <div className="space-y-2">
          {fundOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => handleInputChange('availableAnnualFund', f.value)}
              className={`w-full p-3 rounded-xl text-center transition-all duration-200 ${
                inputData.availableAnnualFund === f.value
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="text-sm">{f.labelKo}</div>
              <div className="text-xs text-slate-400">{f.labelEn}</div>
            </button>
          ))}
        </div>
      ),
      finalGoal: (
        <div className="grid grid-cols-2 gap-3">
          {goalOptions.map((g) => (
            <button
              key={g.value}
              onClick={() => handleInputChange('finalGoal', g.value)}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                inputData.finalGoal === g.value
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-105'
                  : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="text-2xl mb-1">{g.emoji}</div>
              <div className="text-sm font-medium">{g.labelKo}</div>
              <div className="text-xs text-slate-400 mt-1">{g.descKo}</div>
            </button>
          ))}
        </div>
      ),
      priorityPreference: (
        <div className="grid grid-cols-2 gap-3">
          {priorityOptions.map((p) => (
            <button
              key={p.value}
              onClick={() => handleInputChange('priorityPreference', p.value)}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                inputData.priorityPreference === p.value
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-105'
                  : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="text-2xl mb-1">{p.emoji}</div>
              <div className="text-sm font-medium">{p.labelKo}</div>
              <div className="text-xs text-slate-400 mt-1">{p.descKo}</div>
            </button>
          ))}
        </div>
      ),
    };

    return (
      <div className="w-full max-w-lg mx-auto">
        {/* 봇 질문 영역 / Bot question area */}
        <div className="flex items-start gap-3 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-purple-600 shadow-lg shadow-purple-500/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-slate-700/80 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%]">
            <p className="text-sm text-slate-200">{currentQ.botQuestion}</p>
          </div>
        </div>

        {/* 진행 바 / Progress bar */}
        <div className="flex items-center gap-2 mb-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i < step ? 'bg-purple-500' : i === step - 1 ? 'bg-purple-400' : 'bg-slate-700'
              }`}
            />
          ))}
          <span className="text-xs text-slate-500 ml-2">
            {step}/{questions.length}
          </span>
        </div>

        {/* 입력 영역 / Input area */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/10 max-h-[400px] overflow-y-auto">
          {inputUI[currentQ.key]}
        </div>
      </div>
    );
  };

  // ============================================================
  // 메인 렌더 / Main render
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* 글로벌 CSS 애니메이션 / Global CSS animations */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.8); }
        }
        @keyframes sttDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px 5px rgba(168, 85, 247, 0.2); }
          50% { box-shadow: 0 0 40px 20px rgba(168, 85, 247, 0.4); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .mic-glow { animation: pulseGlow 2s infinite ease-in-out; }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .spin { animation: spin 1.5s linear infinite; }
      `}</style>

      {/* 배경 음파 효과 / Background wave effect */}
      <BackgroundWaves />

      {/* 그래디언트 배경 / Gradient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 메인 콘텐츠 / Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* ========== 시작 화면 / Start screen ========== */}
          {step === 0 && (
            <div className="text-center flex flex-col items-center fade-in-up">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  음성 비자 진단
                </h1>
                <p className="text-sm text-slate-400 mt-1">Voice Visa Diagnosis</p>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed mb-12">
                마이크 버튼을 눌러 6가지 질문에 답하면,
                <br />
                당신에게 맞는 최적의 비자 경로를 찾아드립니다.
                <br />
                <span className="text-slate-500 text-sm">
                  Press the mic button to start your personalized visa pathway diagnosis.
                </span>
              </p>

              {/* 큰 마이크 버튼 / Large mic button */}
              <button
                onClick={handleMicClick}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mic-glow transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <Mic className="w-14 h-14 text-white" />
              </button>

              <p className="text-xs text-slate-600 mt-6">탭하여 시작 / Tap to start</p>

              {/* 작은 음파 / Small soundwave */}
              <div className="mt-8 opacity-40">
                <SoundWave active={false} barCount={15} />
              </div>
            </div>
          )}

          {/* ========== 질문 화면 / Question screen ========== */}
          {step >= 1 && step <= questions.length && (
            <div className="flex flex-col items-center gap-6 fade-in-up">
              {renderQuestionInput()}

              {/* 음파 + STT 인디케이터 / Soundwave + STT indicator */}
              <div className="flex flex-col items-center gap-3 h-20 justify-center">
                <SoundWave active={isRecording} barCount={12} />
                <STTIndicator visible={showSTT} />
              </div>

              {/* 마이크 + 다음 버튼 / Mic + Next button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleMicClick}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 mic-glow'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
                >
                  <span>
                    {step === questions.length ? '진단 시작 / Analyze' : '다음 / Next'}
                  </span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========== 분석 중 화면 / Analyzing screen ========== */}
          {step === 7 && (
            <div className="text-center flex flex-col items-center gap-8 fade-in-up">
              <div className="w-20 h-20 rounded-full border-4 border-purple-500 border-t-transparent spin" />
              <div>
                <h2 className="text-2xl font-bold text-purple-300">진단 분석 중...</h2>
                <p className="text-slate-400 mt-2">
                  AI가 최적의 비자 경로를 분석하고 있습니다
                </p>
                <p className="text-slate-500 text-sm">
                  Analyzing your optimal visa pathways...
                </p>
              </div>
              <SoundWave active barCount={20} />
            </div>
          )}

          {/* ========== 결과 화면 / Result screen ========== */}
          {step === 8 && (
            <div className="w-full fade-in-up">
              {/* 헤더 / Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-purple-400" />
                    진단 결과
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Diagnosis Results</p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  다시 시작
                </button>
              </div>

              {/* 트랜스크립트 섹션 / Transcript section */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl mb-8 border border-purple-500/15 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-slate-300">
                    인터뷰 기록 / Interview Transcript
                  </h3>
                </div>
                <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                  <TranscriptItem speaker="bot" text="안녕하세요! 비자 진단 인터뷰를 시작하겠습니다. Hello! Let's start the visa diagnosis interview." />
                  {transcript.map((item, index) => (
                    <React.Fragment key={index}>
                      <TranscriptItem speaker="bot" text={item.q} />
                      <TranscriptItem speaker="user" text={item.a} />
                    </React.Fragment>
                  ))}
                  <TranscriptItem speaker="bot" text="모든 정보를 확인했습니다. 최적의 경로를 분석합니다. All information received. Analyzing optimal pathways." />
                </div>
              </div>

              {/* 분석 요약 / Analysis summary */}
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl p-6 mb-8 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">총 평가 경로 / Total Evaluated</p>
                    <p className="text-2xl font-bold text-white">
                      {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">추천 경로 / Recommended</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {mockDiagnosisResult.pathways.length}개
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">필터 제외 / Filtered Out</p>
                    <p className="text-2xl font-bold text-slate-500">
                      {mockDiagnosisResult.meta.hardFilteredOut}개
                    </p>
                  </div>
                </div>
              </div>

              {/* 추천 경로 목록 / Recommended pathways */}
              <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                추천 비자 경로 / Recommended Visa Pathways
              </h3>
              <div className="space-y-4 mb-12">
                {mockDiagnosisResult.pathways.map((pathway) => (
                  <PathwayCard key={pathway.pathwayId} pathway={pathway} />
                ))}
              </div>

              {/* 호환 경로 / Compatible pathways */}
              <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-purple-400" />
                호환 가능 경로 / Compatible Pathways
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {mockPathways.map((pathway) => (
                  <CompatPathwayCard key={pathway.id} pathway={pathway} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
