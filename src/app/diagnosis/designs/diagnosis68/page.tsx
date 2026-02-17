'use client';

// ============================================================
// 비자 진단 시안 #68 — 클럽하우스 대화 (Clubhouse Room)
// Visa Diagnosis Design #68 — Clubhouse Room conversation style
// 오디오 룸에서 전문가와 대화하며 진단하는 느낌
// Feeling of diagnosing while talking with experts in an audio room
// colorTheme: 크림+브라운 엘레강스 / Cream + Brown elegance
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
  Mic,
  MicOff,
  Hand,
  Volume2,
  VolumeX,
  Users,
  Radio,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Award,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
  MessageSquare,
  UserCheck,
  Globe,
  GraduationCap,
  Target,
  Zap,
  Shield,
  TrendingUp,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'result';

interface SpeakerAvatar {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  emoji: string;
  isSpeaking: boolean;
  isHost: boolean;
}

// ============================================================
// 오디오 룸 전문가 아바타 / Audio room expert avatars
// ============================================================

const ROOM_SPEAKERS: SpeakerAvatar[] = [
  { id: 'host', name: '잡차자 AI', nameEn: 'JobChaja AI', role: '비자 전문 호스트', roleEn: 'Visa Expert Host', emoji: '🤖', isSpeaking: false, isHost: true },
  { id: 'visa1', name: '김변호사', nameEn: 'Attorney Kim', role: '이민법 전문가', roleEn: 'Immigration Law', emoji: '👨‍⚖️', isSpeaking: false, isHost: false },
  { id: 'visa2', name: '이행정사', nameEn: 'Admin. Lee', role: '비자 행정 전문', roleEn: 'Visa Administration', emoji: '👩‍💼', isSpeaking: false, isHost: false },
  { id: 'visa3', name: '박상담사', nameEn: 'Counselor Park', role: '외국인 취업 컨설팅', roleEn: 'Foreign Employment', emoji: '🧑‍💻', isSpeaking: false, isHost: false },
];

// ============================================================
// 단계별 질문 메시지 / Step question messages
// ============================================================

const STEP_MESSAGES: Record<Exclude<Step, 'result'>, { ko: string; en: string }> = {
  nationality: { ko: '안녕하세요! 잡차자 비자 진단 룸에 오신 것을 환영합니다. 어느 나라 출신이신가요?', en: 'Welcome to JobChaja Visa Diagnosis Room! Which country are you from?' },
  age: { ko: '반갑습니다! 현재 연령대를 알려주세요. 비자 조건에 영향을 미칩니다.', en: 'Nice to meet you! Please share your age. It affects visa eligibility.' },
  educationLevel: { ko: '최종 학력을 선택해 주세요. 비자 종류에 따라 학력 요건이 달라집니다.', en: 'Please select your highest education level. Requirements vary by visa type.' },
  availableAnnualFund: { ko: '연간 활용 가능한 자금 규모를 알려주세요. 유학이나 초기 정착 비용에 필요합니다.', en: 'Tell us your available annual fund. Needed for study abroad or initial settlement costs.' },
  finalGoal: { ko: '한국에서 이루고 싶은 최종 목표는 무엇인가요?', en: 'What is your ultimate goal in Korea?' },
  priorityPreference: { ko: '마지막으로, 어떤 방향을 가장 중요하게 생각하시나요?', en: 'Finally, which direction matters most to you?' },
};

// ============================================================
// 청취자 아바타 더미 데이터 / Listener avatar dummy data
// ============================================================

const LISTENER_EMOJIS = ['🇻🇳', '🇵🇭', '🇺🇿', '🇳🇵', '🇨🇳', '🇮🇩', '🇮🇳', '🇲🇾', '🇹🇭', '🇰🇭', '🇲🇲', '🇲🇳'];

// ============================================================
// 음파 인디케이터 컴포넌트 / Sound wave indicator component
// ============================================================

function SoundWave({ active, color = 'bg-amber-600' }: { active: boolean; color?: string }) {
  // 음파 막대 4개로 구성 / 4 bars for sound wave
  return (
    <div className="flex items-center gap-0.5 h-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-0.5 rounded-full transition-all duration-150 ${color} ${
            active
              ? i === 1 ? 'h-1' : i === 2 ? 'h-4' : i === 3 ? 'h-2.5' : 'h-3.5'
              : 'h-1'
          }`}
          style={active ? { animation: `soundWave ${0.4 + i * 0.1}s ease-in-out infinite alternate` } : {}}
        />
      ))}
    </div>
  );
}

// ============================================================
// 아바타 서클 컴포넌트 / Avatar circle component
// ============================================================

function AvatarCircle({
  speaker,
  size = 'md',
  isSpeakingNow = false,
}: {
  speaker: SpeakerAvatar;
  size?: 'sm' | 'md' | 'lg';
  isSpeakingNow?: boolean;
}) {
  // 크기별 스타일 / Size-based styles
  const sizeMap = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  };
  const ringMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {/* 말하는 중일 때 음파 링 / Sound ring when speaking */}
      <div className="relative flex items-center justify-center">
        {isSpeakingNow && (
          <div
            className={`absolute ${ringMap[size]} rounded-full border-2 border-amber-500 opacity-60`}
            style={{ animation: 'pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite' }}
          />
        )}
        {isSpeakingNow && (
          <div
            className={`absolute ${ringMap[size]} rounded-full border-2 border-amber-400 opacity-30 scale-110`}
            style={{ animation: 'pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite 0.3s' }}
          />
        )}
        <div
          className={`${sizeMap[size]} rounded-full flex items-center justify-center ${
            speaker.isHost ? 'bg-amber-800' : 'bg-stone-200'
          } ${isSpeakingNow ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-amber-50' : ''} shadow-md`}
        >
          <span>{speaker.emoji}</span>
        </div>
        {/* 호스트 왕관 / Host crown */}
        {speaker.isHost && (
          <div className="absolute -top-1.5 -right-1 bg-amber-500 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
            <Star className="w-3 h-3 text-white" fill="white" />
          </div>
        )}
      </div>
      {/* 이름 + 음파 / Name + sound wave */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs font-semibold text-stone-700 whitespace-nowrap">{speaker.name}</span>
        {isSpeakingNow && (
          <SoundWave active={true} color="bg-amber-600" />
        )}
      </div>
    </div>
  );
}

// ============================================================
// 룸 토픽 배너 / Room topic banner
// ============================================================

function RoomTopicBanner({ step, totalSteps }: { step: number; totalSteps: number }) {
  const topics = [
    '🌏 국적 확인 중', '🎂 나이 확인 중', '🎓 학력 확인 중',
    '💰 자금 규모 확인 중', '🎯 목표 파악 중', '⚡ 우선순위 파악 중', '📋 분석 완료',
  ];
  const topic = topics[step - 1] ?? topics[0];

  return (
    <div className="bg-amber-900/90 text-amber-50 px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        {/* 라이브 인디케이터 / Live indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" style={{ animation: 'pulse 1s ease-in-out infinite' }} />
          <span className="text-xs font-bold tracking-wider text-red-300">LIVE</span>
        </div>
        <span className="text-sm font-semibold">{topic}</span>
      </div>
      <div className="flex items-center gap-1 text-amber-300 text-xs">
        <Radio className="w-3.5 h-3.5" />
        <span>{step}/{totalSteps}</span>
      </div>
    </div>
  );
}

// ============================================================
// 결과 경로 카드 / Result pathway card
// ============================================================

function PathwayResultCard({
  pathway,
  rank,
  isExpanded,
  onToggle,
}: {
  pathway: CompatPathway;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // 순위별 배지 스타일 / Rank-based badge styles
  const rankStyle =
    rank === 1 ? 'bg-amber-500 text-white' :
    rank === 2 ? 'bg-stone-400 text-white' :
    rank === 3 ? 'bg-amber-700 text-white' :
    'bg-stone-200 text-stone-600';

  const scoreColor = getScoreColor(pathway.finalScore);
  const feasEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
      isExpanded ? 'border-amber-400 shadow-lg shadow-amber-100' : 'border-stone-200 shadow-sm'
    } bg-white`}>
      {/* 카드 헤더 / Card header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left hover:bg-amber-50/50 transition-colors"
      >
        {/* 순위 배지 / Rank badge */}
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rankStyle}`}>
          {rank}
        </div>

        {/* 경로 정보 / Pathway info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-stone-800 text-sm leading-tight">{pathway.nameKo}</span>
            <span className="text-xs text-stone-400">{pathway.nameEn}</span>
          </div>
          {/* 비자 체인 / Visa chain */}
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded font-mono font-semibold">
                  {v.code}
                </span>
                {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                  <ChevronRight className="w-3 h-3 text-stone-400" />
                )}
              </span>
            ))}
          </div>
          {/* 핵심 지표 / Key metrics */}
          <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pathway.estimatedMonths}개월
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {pathway.estimatedCostWon === 0 ? '무료' : `${pathway.estimatedCostWon.toLocaleString()}만원`}
            </span>
            <span>{feasEmoji} {pathway.feasibilityLabel}</span>
          </div>
        </div>

        {/* 점수 + 토글 / Score + toggle */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <div
            className="text-xl font-black"
            style={{ color: scoreColor }}
          >
            {pathway.finalScore}
          </div>
          <div className="text-xs text-stone-400">점수</div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-stone-400 mt-1" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400 mt-1" />
          )}
        </div>
      </button>

      {/* 확장 상세 / Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-amber-100 bg-amber-50/30">
          {/* 대화 요약 형태로 표시 / Display as conversation summary */}
          <div className="mt-3 space-y-3">
            {/* 전문가 코멘트 섹션 / Expert comment section */}
            <div className="bg-white rounded-xl p-3 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">👨‍⚖️</span>
                <span className="text-xs font-semibold text-stone-600">김변호사의 코멘트</span>
                <SoundWave active={false} color="bg-amber-600" />
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                &quot;{pathway.note}&quot;
              </p>
            </div>

            {/* 마일스톤 / Milestones */}
            {pathway.milestones.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                  단계별 로드맵 / Roadmap
                </h4>
                <div className="space-y-2">
                  {pathway.milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                        {m.order}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-700">{m.nameKo}</span>
                          {m.visaStatus && m.visaStatus !== 'none' && (
                            <span className="bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded font-mono">
                              {m.visaStatus}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          {m.monthFromStart === 0 ? '시작' : `${m.monthFromStart}개월 후`}
                          {m.estimatedMonthlyIncome > 0 && ` · 월 ${m.estimatedMonthlyIncome}만원 수입`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 다음 단계 / Next steps */}
            {pathway.nextSteps.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                  지금 바로 할 일 / Action Items
                </h4>
                <div className="space-y-2">
                  {pathway.nextSteps.map((ns, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-stone-700">{ns.nameKo}</div>
                        <div className="text-xs text-stone-500">{ns.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================

export default function Diagnosis68Page() {
  // 상태 관리 / State management
  const [step, setStep] = useState<Step>('nationality');
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('host');
  const [handRaised, setHandRaised] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [listenerCount] = useState(247);
  const [stepNum, setStepNum] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ageInput, setAgeInput] = useState('24');

  const TOTAL_STEPS = 6;

  // 음파 애니메이션 CSS / Sound wave animation CSS
  const waveStyle = `
    @keyframes soundWave {
      0% { transform: scaleY(1); }
      100% { transform: scaleY(0.3); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(1.1); }
    }
  `;

  // 스피커 순환 타이머 / Speaker rotation timer
  useEffect(() => {
    const speakers = ROOM_SPEAKERS.map((s) => s.id);
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % speakers.length;
      setActiveSpeakerId(speakers[idx]);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 단계 순서 / Step order
  const stepOrder: Exclude<Step, 'result'>[] = [
    'nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference',
  ];

  // 다음 단계로 이동 / Move to next step
  const handleNext = () => {
    const currentIdx = stepOrder.indexOf(step as Exclude<Step, 'result'>);
    if (currentIdx < stepOrder.length - 1) {
      setStep(stepOrder[currentIdx + 1]);
      setStepNum(currentIdx + 2);
      setActiveSpeakerId('host');
    } else {
      // 분석 시작 / Start analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep('result');
        setStepNum(7);
      }, 2500);
    }
  };

  // 이전 단계로 이동 / Move to previous step
  const handleBack = () => {
    const currentIdx = stepOrder.indexOf(step as Exclude<Step, 'result'>);
    if (currentIdx > 0) {
      setStep(stepOrder[currentIdx - 1]);
      setStepNum(currentIdx);
    }
  };

  // 결과 페이지 다시 시작 / Restart from result page
  const handleRestart = () => {
    setStep('nationality');
    setStepNum(1);
    setExpandedPathway(null);
    setHandRaised(false);
    setInput({ ...mockInput });
    setAgeInput('24');
  };

  // 현재 질문 메시지 / Current question message
  const currentMessage = step !== 'result' ? STEP_MESSAGES[step] : null;

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      <style>{waveStyle}</style>

      {/* 헤더 — 룸 이름 + 참여자 수 / Header — room name + participants */}
      <header className="bg-amber-900 text-amber-50 px-4 pt-safe-top pb-3 sticky top-0 z-30 shadow-xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-bold">잡차자 비자 진단 룸</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-amber-300">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{listenerCount.toLocaleString()}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-amber-500" />
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" style={{ animation: 'pulse 1s ease-in-out infinite' }} />
                <span className="font-bold text-red-300">LIVE</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-amber-400 mt-0.5">비자 전문가들과 함께하는 실시간 진단 · Live visa diagnosis with experts</p>
        </div>
      </header>

      {/* 메인 콘텐츠 / Main content */}
      <main className="max-w-lg mx-auto px-4 pb-32">

        {/* 분석 중 오버레이 / Analyzing overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-amber-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-amber-800 flex items-center justify-center text-5xl shadow-2xl">
                🤖
              </div>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-amber-400"
                  style={{ animation: `pulse 1.5s ease-in-out infinite ${i * 0.5}s`, opacity: 0.6 - i * 0.2 }}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="text-amber-100 font-bold text-lg">비자 경로 분석 중...</p>
              <p className="text-amber-300 text-sm mt-1">Analyzing your visa pathways...</p>
            </div>
            <div className="flex items-center gap-2">
              {ROOM_SPEAKERS.map((s) => (
                <div key={s.id} className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-xl shadow-md">
                  {s.emoji}
                </div>
              ))}
            </div>
            <p className="text-amber-400 text-xs">전문가 패널이 검토 중입니다 · Expert panel is reviewing</p>
          </div>
        )}

        {/* ─── 입력 플로우 / Input flow ─── */}
        {step !== 'result' && (
          <div className="pt-4 space-y-4">
            {/* 룸 토픽 배너 / Room topic banner */}
            <RoomTopicBanner step={stepNum} totalSteps={TOTAL_STEPS} />

            {/* 스피커 섹션 / Speaker section */}
            <div className="bg-stone-100 rounded-2xl p-4 shadow-inner">
              <div className="text-xs text-stone-500 font-semibold mb-3 uppercase tracking-wide">
                스피커 · Speakers
              </div>
              <div className="grid grid-cols-4 gap-3">
                {ROOM_SPEAKERS.map((speaker) => (
                  <AvatarCircle
                    key={speaker.id}
                    speaker={speaker}
                    size="md"
                    isSpeakingNow={activeSpeakerId === speaker.id}
                  />
                ))}
              </div>
            </div>

            {/* 현재 호스트 발언 / Current host speech */}
            <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-md">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center text-xl shadow-md">
                  🤖
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-800">잡차자 AI</span>
                    <SoundWave active={activeSpeakerId === 'host'} color="bg-amber-600" />
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {currentMessage?.ko}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 italic">
                    {currentMessage?.en}
                  </p>
                </div>
              </div>
            </div>

            {/* ─── 국적 선택 / Nationality selection ─── */}
            {step === 'nationality' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-700" />
                  국적 선택 · Select Nationality
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setInput((prev) => ({ ...prev, nationality: country.code }));
                        setActiveSpeakerId('visa1');
                      }}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                        input.nationality === country.code
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="text-xs font-medium text-stone-700">{country.nameKo}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 나이 입력 / Age input ─── */}
            {step === 'age' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-700" />
                  나이 입력 · Enter Your Age
                </h3>
                <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        const v = Math.max(18, parseInt(ageInput) - 1);
                        setAgeInput(String(v));
                        setInput((prev) => ({ ...prev, age: v }));
                      }}
                      className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-bold text-xl hover:bg-amber-200 transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <div className="text-center">
                      <input
                        type="number"
                        value={ageInput}
                        onChange={(e) => {
                          setAgeInput(e.target.value);
                          const v = parseInt(e.target.value);
                          if (!isNaN(v) && v >= 18 && v <= 60) {
                            setInput((prev) => ({ ...prev, age: v }));
                          }
                        }}
                        className="text-4xl font-black text-amber-800 w-24 text-center bg-transparent border-none outline-none"
                      />
                      <div className="text-sm text-stone-500">세 · years old</div>
                    </div>
                    <button
                      onClick={() => {
                        const v = Math.min(60, parseInt(ageInput) + 1);
                        setAgeInput(String(v));
                        setInput((prev) => ({ ...prev, age: v }));
                      }}
                      className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-bold text-xl hover:bg-amber-200 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── 학력 선택 / Education selection ─── */}
            {step === 'educationLevel' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                  최종 학력 · Highest Education
                </h3>
                <div className="space-y-2">
                  {educationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setInput((prev) => ({ ...prev, educationLevel: opt.value }));
                        setActiveSpeakerId('visa2');
                      }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                        input.educationLevel === opt.value
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <span className="text-xl">{opt.emoji || '📝'}</span>
                      <div>
                        <div className="text-sm font-semibold text-stone-700">{opt.labelKo}</div>
                        <div className="text-xs text-stone-400">{opt.labelEn}</div>
                      </div>
                      {input.educationLevel === opt.value && (
                        <CheckCircle className="w-5 h-5 text-amber-500 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 자금 선택 / Fund selection ─── */}
            {step === 'availableAnnualFund' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-700" />
                  연간 자금 규모 · Annual Available Fund
                </h3>
                <div className="space-y-2">
                  {fundOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setInput((prev) => ({ ...prev, availableAnnualFund: opt.value }));
                        setActiveSpeakerId('visa3');
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${
                        input.availableAnnualFund === opt.value
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="text-sm font-semibold text-stone-700">{opt.labelKo}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">{opt.labelEn}</span>
                        {input.availableAnnualFund === opt.value && (
                          <CheckCircle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 목표 선택 / Goal selection ─── */}
            {step === 'finalGoal' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-700" />
                  최종 목표 · Final Goal
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setInput((prev) => ({ ...prev, finalGoal: opt.value }));
                        setActiveSpeakerId('host');
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        input.finalGoal === opt.value
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <span className="text-sm font-bold text-stone-700">{opt.labelKo}</span>
                      <span className="text-xs text-stone-400 text-center leading-tight">{opt.descKo}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── 우선순위 선택 / Priority selection ─── */}
            {step === 'priorityPreference' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-700" />
                  우선순위 · Priority Preference
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setInput((prev) => ({ ...prev, priorityPreference: opt.value }));
                        setActiveSpeakerId('visa1');
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        input.priorityPreference === opt.value
                          ? 'border-amber-500 bg-amber-50 shadow-md'
                          : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <span className="text-sm font-bold text-stone-700">{opt.labelKo}</span>
                      <span className="text-xs text-stone-400 text-center leading-tight">{opt.descKo}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 청취자 섹션 / Listener section */}
            <div className="bg-stone-100 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone-500 font-semibold">청취자 · Listeners ({listenerCount})</span>
                <span className="text-xs text-stone-400">함께 듣고 있어요</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {LISTENER_EMOJIS.map((emoji, i) => (
                  <span key={i} className="text-base">{emoji}</span>
                ))}
                <span className="text-xs text-stone-400 ml-1">+{listenerCount - LISTENER_EMOJIS.length}명</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── 결과 화면 / Result screen ─── */}
        {step === 'result' && (
          <div className="pt-4 space-y-4">
            {/* 결과 룸 배너 / Result room banner */}
            <div className="bg-amber-900 rounded-2xl p-4 text-amber-50 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="font-bold">진단 완료 · Diagnosis Complete</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-green-300 font-semibold">분석 완료</span>
                </div>
              </div>

              {/* 대화 요약 / Conversation summary */}
              <div className="bg-amber-800/50 rounded-xl p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">🌏</span>
                  <span className="text-amber-200">국적:</span>
                  <span className="font-semibold">
                    {popularCountries.find((c) => c.code === input.nationality)?.flag}{' '}
                    {popularCountries.find((c) => c.code === input.nationality)?.nameKo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">🎂</span>
                  <span className="text-amber-200">나이:</span>
                  <span className="font-semibold">{input.age}세</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">🎓</span>
                  <span className="text-amber-200">학력:</span>
                  <span className="font-semibold">
                    {educationOptions.find((e) => e.value === input.educationLevel)?.labelKo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">🎯</span>
                  <span className="text-amber-200">목표:</span>
                  <span className="font-semibold">
                    {goalOptions.find((g) => g.value === input.finalGoal)?.labelKo}
                  </span>
                </div>
              </div>

              {/* 전체 결과 요약 / Overall result summary */}
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-amber-300 text-xs">분석된 비자 경로 수</div>
                  <div className="text-2xl font-black">
                    {result.meta.totalPathwaysEvaluated}개
                    <span className="text-sm font-normal text-amber-400 ml-1">평가 · {result.pathways.length}개 추천</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-300 text-xs">전문가 패널</div>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    {ROOM_SPEAKERS.map((s) => (
                      <span key={s.id} className="text-xl">{s.emoji}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 전문가 결론 코멘트 / Expert conclusion comment */}
            <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-md">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center text-xl shadow-md">
                  🤖
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-800">잡차자 AI · 호스트</span>
                    <div className="ml-auto bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                      결론
                    </div>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    분석 결과, <strong>총 {result.pathways.length}개의 비자 경로</strong>를 추천드립니다.
                    {result.pathways[0] && (
                      <> 가장 가능성 높은 경로는 <strong>{result.pathways[0].nameKo}</strong> ({result.pathways[0].feasibilityLabel})입니다.</>
                    )}
                  </p>
                  <p className="text-xs text-stone-400 mt-1 italic">
                    We recommend {result.pathways.length} visa pathways based on your profile.
                  </p>
                </div>
              </div>
            </div>

            {/* 추천 경로 카드 목록 / Recommended pathway cards */}
            <div>
              <h3 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-700" />
                추천 비자 경로 · Recommended Visa Pathways
              </h3>
              <div className="space-y-3">
                {mockPathways.map((pathway, i) => (
                  <PathwayResultCard
                    key={pathway.id}
                    pathway={pathway}
                    rank={i + 1}
                    isExpanded={expandedPathway === pathway.id}
                    onToggle={() =>
                      setExpandedPathway(expandedPathway === pathway.id ? null : pathway.id)
                    }
                  />
                ))}
              </div>
            </div>

            {/* 다시 진단 버튼 / Restart diagnosis button */}
            <button
              onClick={handleRestart}
              className="w-full py-4 rounded-2xl bg-amber-900 text-amber-50 font-bold text-sm hover:bg-amber-800 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4" />
              다시 진단하기 · Restart Diagnosis
            </button>
          </div>
        )}
      </main>

      {/* ─── 하단 컨트롤 바 / Bottom control bar ─── */}
      {step !== 'result' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-2xl">
          <div className="max-w-lg mx-auto px-4 py-3">
            {/* 오디오 룸 컨트롤 / Audio room controls */}
            <div className="flex items-center justify-between mb-3">
              {/* 마이크 토글 / Mic toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isMuted
                    ? 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isMuted ? '음소거 · Muted' : '발화 중 · Speaking'}
              </button>

              {/* 손들기 / Raise hand */}
              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  handRaised
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                <Hand className="w-4 h-4" />
                {handRaised ? '손 내리기 · Lower' : '손들기 · Raise Hand'}
              </button>

              {/* 스피커 토글 / Speaker toggle */}
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 text-xs font-semibold transition-all">
                <Volume2 className="w-4 h-4" />
                스피커
              </button>
            </div>

            {/* 네비게이션 버튼 / Navigation buttons */}
            <div className="flex gap-3">
              {stepNum > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-stone-100 text-stone-600 font-semibold text-sm hover:bg-stone-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  이전
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-800 text-amber-50 font-bold text-sm hover:bg-amber-700 transition-colors shadow-lg"
              >
                {stepNum === TOTAL_STEPS ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    비자 경로 분석하기 · Analyze
                  </>
                ) : (
                  <>
                    다음 질문 · Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
