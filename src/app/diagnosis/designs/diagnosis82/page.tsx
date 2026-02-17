'use client';

// ============================================================
// Design #82: Music Producer / 음악 프로듀서 스타일 비자 진단
// DAW(Digital Audio Workstation)처럼 트랙을 쌓아 비자 경로를 "작곡"
// Concept: Ableton Live dark + neon UI with timeline tracks, waveforms, mixer
// ============================================================

import { useState, useEffect, useRef } from 'react';
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
  Pause,
  Square,
  Volume2,
  VolumeX,
  Music,
  Sliders,
  Layers,
  AudioWaveform,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SkipForward,
  SkipBack,
  Headphones,
  Radio,
  Mic,
  Guitar,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  Check,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
} from 'lucide-react';

// ============================================================
// 입력 단계 타입 정의 / Input step type definition
// ============================================================
type InputStep = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';
type AppPhase = 'input' | 'analyzing' | 'result';

// DAW 트랙 색상 팔레트 (네온 컬러) / DAW track neon color palette
const TRACK_COLORS = [
  '#ff6b35', // 오렌지 / orange
  '#00e5ff', // 시안 / cyan
  '#b649ff', // 퍼플 / purple
  '#39ff14', // 네온 그린 / neon green
  '#ff0080', // 핫 핑크 / hot pink
];

// 트랙 이름 (믹서 채널) / Track names (mixer channels)
const TRACK_LABELS = ['LEAD', 'BASS', 'PAD', 'PERC', 'FX'];

// ============================================================
// 웨이브폼 컴포넌트 / Waveform component
// SVG로 랜덤 파형 렌더링 / Renders random waveform via SVG
// ============================================================
function WaveformBar({ color, active, score }: { color: string; active: boolean; score: number }) {
  // 점수 기반으로 파형 막대 높이 생성 / Generate bar heights based on score
  const bars = Array.from({ length: 32 }, (_, i) => {
    const base = (score / 100) * 0.7 + 0.1;
    const wave = Math.sin((i / 32) * Math.PI * 3 + i * 0.5) * 0.3 * base;
    const rand = Math.abs(Math.sin(i * 2.618)) * 0.4 * base;
    return Math.min(1, Math.max(0.05, base + wave + rand));
  });

  return (
    <div className="flex items-center gap-px h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-sm transition-all duration-300"
          style={{
            height: `${h * 100}%`,
            backgroundColor: active ? color : '#374151',
            opacity: active ? 0.8 + (h * 0.2) : 0.4,
            boxShadow: active ? `0 0 4px ${color}80` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// VU 미터 컴포넌트 / VU meter component
// 믹서 채널 레벨 표시 / Shows mixer channel level
// ============================================================
function VUMeter({ level, color }: { level: number; color: string }) {
  const segments = 12;
  return (
    <div className="flex flex-col-reverse gap-0.5">
      {Array.from({ length: segments }, (_, i) => {
        const threshold = (i / segments) * 100;
        const lit = threshold < level;
        const isHot = i >= 10; // 붉은 구간 / red zone
        const isWarm = i >= 7; // 노란 구간 / yellow zone
        return (
          <div
            key={i}
            className="w-3 h-1.5 rounded-sm transition-all duration-150"
            style={{
              backgroundColor: lit
                ? isHot
                  ? '#ff4444'
                  : isWarm
                  ? '#ffaa00'
                  : color
                : '#1f2937',
              boxShadow: lit && !isHot ? `0 0 4px ${color}60` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

// ============================================================
// 패더 슬라이더 컴포넌트 / Fader slider component
// 믹서 채널 볼륨 패더 / Mixer channel volume fader
// ============================================================
function MixerFader({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* 채널 레이블 / Channel label */}
      <span className="text-xs font-bold tracking-wider" style={{ color }}>{label}</span>

      {/* VU 미터 / VU meter */}
      <VUMeter level={value} color={color} />

      {/* 패더 트랙 / Fader track */}
      <div
        className="relative h-24 w-1.5 rounded-full cursor-pointer"
        style={{ backgroundColor: '#1f2937' }}
      >
        {/* 패더 위치 / Fader position */}
        <div
          className="absolute w-5 h-3 rounded-sm -left-1.5 cursor-pointer transition-all duration-300"
          style={{
            bottom: `${value}%`,
            backgroundColor: '#374151',
            border: `1px solid ${color}`,
            boxShadow: `0 0 6px ${color}60`,
          }}
        />
        {/* 레벨 채우기 / Level fill */}
        <div
          className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-300"
          style={{
            height: `${value}%`,
            backgroundColor: color,
            opacity: 0.3,
          }}
        />
      </div>

      {/* 값 표시 / Value display */}
      <span className="text-xs" style={{ color: '#6b7280' }}>{Math.round(value)}</span>
    </div>
  );
}

// ============================================================
// 트랜스포트 컨트롤 / Transport controls
// 재생/정지/스킵 버튼 바 / Play/stop/skip button bar
// ============================================================
function TransportBar({
  isPlaying,
  onPlay,
  onStop,
  bpm,
  currentBeat,
}: {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  bpm: number;
  currentBeat: number;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-lg" style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}>
      {/* 타임코드 디스플레이 / Timecode display */}
      <div
        className="font-mono text-sm px-3 py-1 rounded"
        style={{ backgroundColor: '#000', color: '#39ff14', fontFamily: 'monospace', minWidth: '90px' }}
      >
        {String(Math.floor(currentBeat / 4) + 1).padStart(3, '0')}.{String((currentBeat % 4) + 1)}.00
      </div>

      {/* BPM 디스플레이 / BPM display */}
      <div className="flex items-center gap-1">
        <span className="text-xs" style={{ color: '#6b7280' }}>BPM</span>
        <div
          className="font-mono text-sm px-2 py-1 rounded"
          style={{ backgroundColor: '#000', color: '#ff6b35' }}
        >
          {bpm}
        </div>
      </div>

      {/* 재생 컨트롤 / Playback controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onStop}
          className="p-1.5 rounded transition-colors"
          style={{ color: '#6b7280' }}
        >
          <SkipBack size={14} />
        </button>
        <button
          onClick={onPlay}
          className="p-2 rounded-full transition-all"
          style={{
            backgroundColor: isPlaying ? '#ff6b35' : '#39ff14',
            color: '#000',
            boxShadow: isPlaying ? '0 0 12px #ff6b3580' : '0 0 12px #39ff1480',
          }}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={onStop}
          className="p-1.5 rounded transition-colors"
          style={{ backgroundColor: '#374151', color: '#9ca3af' }}
        >
          <Square size={12} />
        </button>
        <button className="p-1.5 rounded transition-colors" style={{ color: '#6b7280' }}>
          <SkipForward size={14} />
        </button>
      </div>

      {/* 루프 표시 / Loop indicator */}
      <div className="flex items-center gap-2 ml-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isPlaying ? '#39ff14' : '#374151', boxShadow: isPlaying ? '0 0 8px #39ff14' : 'none' }} />
        <span className="text-xs" style={{ color: '#6b7280' }}>LOOP</span>
      </div>
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis82Page() {
  // 앱 상태 / App state
  const [phase, setPhase] = useState<AppPhase>('input');
  const [currentStep, setCurrentStep] = useState<InputStep>('nationality');
  const [input, setInput] = useState<Partial<DiagnosisInput>>(mockInput);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);

  // DAW UI 상태 / DAW UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);

  // 비트 카운터 / Beat counter
  const beatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const BPM = 128;

  // 재생 토글 / Toggle playback
  const handlePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
  };

  // 비트 카운터 효과 / Beat counter effect
  useEffect(() => {
    if (isPlaying) {
      beatRef.current = setInterval(() => {
        setCurrentBeat((b) => (b + 1) % 64);
      }, (60 / BPM) * 1000);
    } else {
      if (beatRef.current) clearInterval(beatRef.current);
    }
    return () => {
      if (beatRef.current) clearInterval(beatRef.current);
    };
  }, [isPlaying]);

  // 입력 순서 / Input order
  const steps: InputStep[] = [
    'nationality',
    'age',
    'educationLevel',
    'availableAnnualFund',
    'finalGoal',
    'priorityPreference',
  ];

  const stepIndex = steps.indexOf(currentStep);

  // 다음 단계 / Next step
  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1]);
    } else {
      handleAnalyze();
    }
  };

  // 이전 단계 / Previous step
  const handleBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1]);
    }
  };

  // 분석 실행 / Run analysis
  const handleAnalyze = () => {
    setPhase('analyzing');
    setAnalyzingProgress(0);

    // 분석 진행 애니메이션 / Analysis progress animation
    const interval = setInterval(() => {
      setAnalyzingProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setResult(mockDiagnosisResult);
          setPhase('result');
          setIsPlaying(true);
          return 100;
        }
        return p + 2;
      });
    }, 60);
  };

  // 결과 페이지 패더 값 (점수 기반) / Result mixer fader values (score-based)
  const faderValues = mockPathways.map((p) => Math.min(95, Math.max(10, p.finalScore)));

  // ============================================================
  // 입력 화면 렌더링 / Input screen render
  // ============================================================
  if (phase === 'input') {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: '#0a0a0f', color: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}
      >
        {/* DAW 상단 헤더 / DAW top header */}
        <header
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ backgroundColor: '#111218', borderColor: '#1f2937' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ff6b35, #b649ff)' }}
            >
              <Headphones size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-widest" style={{ color: '#ff6b35' }}>
              JOBCHAJA STUDIO
            </span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#1f2937', color: '#6b7280' }}>
              v82.0 Music Producer
            </span>
          </div>

          {/* 트랜스포트 / Transport */}
          <TransportBar
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onStop={handleStop}
            bpm={BPM}
            currentBeat={currentBeat}
          />

          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted((m) => !m)}>
              {isMuted ? <VolumeX size={16} style={{ color: '#6b7280' }} /> : <Volume2 size={16} style={{ color: '#9ca3af' }} />}
            </button>
            <Sliders size={16} style={{ color: '#6b7280' }} />
          </div>
        </header>

        <div className="flex flex-1">
          {/* 왼쪽 사이드바 (트랙 레이블) / Left sidebar (track labels) */}
          <div
            className="w-48 shrink-0 border-r flex flex-col"
            style={{ backgroundColor: '#0d0d14', borderColor: '#1f2937' }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: '#1f2937' }}>
              <span className="text-xs font-bold tracking-widest" style={{ color: '#6b7280' }}>ARRANGEMENT</span>
            </div>

            {/* 진행 단계들을 트랙으로 표시 / Show input steps as tracks */}
            {steps.map((step, i) => {
              const isCompleted = i < stepIndex;
              const isCurrent = i === stepIndex;
              const stepColor = TRACK_COLORS[i % TRACK_COLORS.length];
              const stepLabel = {
                nationality: '국적 / NATION',
                age: '나이 / AGE',
                educationLevel: '학력 / EDU',
                availableAnnualFund: '자금 / FUND',
                finalGoal: '목표 / GOAL',
                priorityPreference: '우선순위 / PRIO',
              }[step];

              return (
                <div
                  key={step}
                  className="flex items-center gap-2 px-3 py-2.5 border-b cursor-pointer transition-all"
                  style={{
                    borderColor: '#1f2937',
                    backgroundColor: isCurrent ? '#1a1a2e' : 'transparent',
                    borderLeft: isCurrent ? `3px solid ${stepColor}` : '3px solid transparent',
                  }}
                >
                  {/* 트랙 상태 표시 / Track status indicator */}
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: isCompleted ? stepColor : isCurrent ? stepColor : '#374151',
                      boxShadow: isCurrent ? `0 0 8px ${stepColor}` : 'none',
                      opacity: isCompleted ? 1 : isCurrent ? 1 : 0.3,
                    }}
                  />
                  <span
                    className="text-xs font-medium truncate"
                    style={{ color: isCurrent ? '#e5e7eb' : isCompleted ? '#9ca3af' : '#4b5563' }}
                  >
                    {stepLabel}
                  </span>
                  {isCompleted && <Check size={10} style={{ color: stepColor, marginLeft: 'auto' }} />}
                </div>
              );
            })}
          </div>

          {/* 메인 편집 영역 / Main editing area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 현재 단계 타임라인 클립 뷰 / Current step timeline clip view */}
            <div
              className="h-24 border-b flex items-center gap-0 overflow-hidden relative"
              style={{ backgroundColor: '#0d0d14', borderColor: '#1f2937' }}
            >
              {/* 타임라인 눈금 / Timeline ruler */}
              <div className="absolute top-0 left-0 right-0 h-5 flex" style={{ backgroundColor: '#111218' }}>
                {Array.from({ length: 16 }, (_, i) => (
                  <div key={i} className="flex-1 border-l text-xs flex items-center pl-1" style={{ borderColor: '#1f2937', color: '#374151', fontSize: '10px' }}>
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* 재생 헤드 / Playhead */}
              {isPlaying && (
                <div
                  className="absolute top-0 bottom-0 w-px z-10 transition-all"
                  style={{
                    left: `${(currentBeat / 64) * 100}%`,
                    backgroundColor: '#39ff14',
                    boxShadow: '0 0 6px #39ff14',
                  }}
                />
              )}

              {/* 단계별 클립들 / Step clips */}
              {steps.map((step, i) => {
                const isCompleted = i < stepIndex;
                const isCurrent = i === stepIndex;
                const clr = TRACK_COLORS[i % TRACK_COLORS.length];
                const width = `${(1 / steps.length) * 100}%`;
                return (
                  <div
                    key={step}
                    className="h-12 mt-6 mx-0.5 rounded flex items-center justify-center relative overflow-hidden"
                    style={{
                      width,
                      backgroundColor: isCurrent ? `${clr}30` : isCompleted ? `${clr}15` : '#111218',
                      border: `1px solid ${isCurrent ? clr : isCompleted ? `${clr}50` : '#1f2937'}`,
                      boxShadow: isCurrent ? `0 0 12px ${clr}40` : 'none',
                    }}
                  >
                    {/* 클립 내부 웨이브폼 패턴 / Clip internal waveform pattern */}
                    {isCompleted && (
                      <div className="absolute inset-0 flex items-center px-1">
                        {Array.from({ length: 8 }, (_, j) => (
                          <div
                            key={j}
                            className="flex-1 mx-px rounded-sm"
                            style={{
                              height: `${30 + Math.abs(Math.sin(j * 1.5)) * 60}%`,
                              backgroundColor: clr,
                              opacity: 0.4,
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {isCurrent && (
                      <Mic size={12} style={{ color: clr, position: 'relative', zIndex: 1 }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* 입력 폼 영역 / Input form area */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-2xl">
                {/* 단계 헤더 / Step header */}
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${TRACK_COLORS[stepIndex % TRACK_COLORS.length]}20`,
                      border: `1px solid ${TRACK_COLORS[stepIndex % TRACK_COLORS.length]}`,
                      boxShadow: `0 0 20px ${TRACK_COLORS[stepIndex % TRACK_COLORS.length]}40`,
                    }}
                  >
                    <Music size={20} style={{ color: TRACK_COLORS[stepIndex % TRACK_COLORS.length] }} />
                  </div>
                  <div>
                    <div className="text-xs tracking-widest mb-1" style={{ color: TRACK_COLORS[stepIndex % TRACK_COLORS.length] }}>
                      TRACK {stepIndex + 1} / {steps.length} — {TRACK_LABELS[stepIndex % TRACK_LABELS.length]}
                    </div>
                    <h2 className="text-xl font-bold">
                      {currentStep === 'nationality' && '국적을 선택하세요 / Select Your Nationality'}
                      {currentStep === 'age' && '나이를 입력하세요 / Enter Your Age'}
                      {currentStep === 'educationLevel' && '학력을 선택하세요 / Select Education Level'}
                      {currentStep === 'availableAnnualFund' && '연간 자금을 선택하세요 / Select Annual Fund'}
                      {currentStep === 'finalGoal' && '최종 목표를 선택하세요 / Select Final Goal'}
                      {currentStep === 'priorityPreference' && '우선순위를 선택하세요 / Select Priority'}
                    </h2>
                  </div>
                </div>

                {/* 국적 선택 / Nationality selection */}
                {currentStep === 'nationality' && (
                  <div className="grid grid-cols-3 gap-3">
                    {popularCountries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setInput((prev) => ({ ...prev, nationality: c.code }))}
                        className="flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                        style={{
                          backgroundColor: input.nationality === c.code ? '#ff6b3520' : '#111218',
                          border: `1px solid ${input.nationality === c.code ? '#ff6b35' : '#1f2937'}`,
                          boxShadow: input.nationality === c.code ? '0 0 12px #ff6b3540' : 'none',
                        }}
                      >
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className="text-sm font-medium">{c.nameKo}</div>
                          <div className="text-xs" style={{ color: '#6b7280' }}>{c.nameEn}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 나이 입력 / Age input */}
                {currentStep === 'age' && (
                  <div className="flex flex-col items-center gap-6">
                    <div
                      className="relative w-48 h-48 rounded-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(#00e5ff ${((input.age ?? 24) / 60) * 360}deg, #1f2937 0deg)`,
                        boxShadow: '0 0 40px #00e5ff30',
                      }}
                    >
                      <div
                        className="w-36 h-36 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#0a0a0f' }}
                      >
                        <span className="text-5xl font-bold" style={{ color: '#00e5ff' }}>{input.age ?? 24}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={16}
                      max={60}
                      value={input.age ?? 24}
                      onChange={(e) => setInput((prev) => ({ ...prev, age: Number(e.target.value) }))}
                      className="w-full"
                      style={{ accentColor: '#00e5ff' }}
                    />
                    <div className="flex justify-between w-full text-xs" style={{ color: '#6b7280' }}>
                      <span>16세</span>
                      <span>60세</span>
                    </div>
                  </div>
                )}

                {/* 학력 선택 / Education level selection */}
                {currentStep === 'educationLevel' && (
                  <div className="grid grid-cols-2 gap-3">
                    {educationOptions.map((e) => (
                      <button
                        key={e.value}
                        onClick={() => setInput((prev) => ({ ...prev, educationLevel: e.value }))}
                        className="flex items-center gap-3 p-4 rounded-lg text-left transition-all"
                        style={{
                          backgroundColor: input.educationLevel === e.value ? '#b649ff20' : '#111218',
                          border: `1px solid ${input.educationLevel === e.value ? '#b649ff' : '#1f2937'}`,
                          boxShadow: input.educationLevel === e.value ? '0 0 12px #b649ff40' : 'none',
                        }}
                      >
                        <span className="text-2xl">{e.emoji}</span>
                        <div>
                          <div className="text-sm font-medium">{e.labelKo}</div>
                          <div className="text-xs" style={{ color: '#6b7280' }}>{e.labelEn}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 자금 선택 / Fund selection */}
                {currentStep === 'availableAnnualFund' && (
                  <div className="space-y-3">
                    {fundOptions.map((f) => {
                      const isSelected = input.availableAnnualFund === f.value;
                      const pct = (fundOptions.indexOf(f) / (fundOptions.length - 1)) * 100;
                      return (
                        <button
                          key={f.value}
                          onClick={() => setInput((prev) => ({ ...prev, availableAnnualFund: f.value }))}
                          className="w-full flex items-center gap-4 p-3 rounded-lg transition-all"
                          style={{
                            backgroundColor: isSelected ? '#39ff1420' : '#111218',
                            border: `1px solid ${isSelected ? '#39ff14' : '#1f2937'}`,
                            boxShadow: isSelected ? '0 0 12px #39ff1440' : 'none',
                          }}
                        >
                          {/* 패더 시각화 / Fader visualization */}
                          <div className="relative flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: '#1f2937' }}>
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${pct}%`,
                                background: `linear-gradient(to right, #39ff14, #00e5ff)`,
                                opacity: isSelected ? 1 : 0.4,
                              }}
                            />
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-bold" style={{ color: isSelected ? '#39ff14' : '#9ca3af' }}>
                              {f.labelKo}
                            </div>
                            <div className="text-xs" style={{ color: '#6b7280' }}>{f.labelEn}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 목표 선택 / Goal selection */}
                {currentStep === 'finalGoal' && (
                  <div className="grid grid-cols-2 gap-4">
                    {goalOptions.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setInput((prev) => ({ ...prev, finalGoal: g.value }))}
                        className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all"
                        style={{
                          backgroundColor: input.finalGoal === g.value ? '#ff008020' : '#111218',
                          border: `2px solid ${input.finalGoal === g.value ? '#ff0080' : '#1f2937'}`,
                          boxShadow: input.finalGoal === g.value ? '0 0 20px #ff008040' : 'none',
                        }}
                      >
                        <span className="text-4xl">{g.emoji}</span>
                        <div className="text-center">
                          <div className="font-bold">{g.labelKo}</div>
                          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>{g.descKo}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 우선순위 선택 / Priority selection */}
                {currentStep === 'priorityPreference' && (
                  <div className="grid grid-cols-2 gap-4">
                    {priorityOptions.map((p, i) => {
                      const clr = TRACK_COLORS[i % TRACK_COLORS.length];
                      return (
                        <button
                          key={p.value}
                          onClick={() => setInput((prev) => ({ ...prev, priorityPreference: p.value }))}
                          className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all"
                          style={{
                            backgroundColor: input.priorityPreference === p.value ? `${clr}20` : '#111218',
                            border: `2px solid ${input.priorityPreference === p.value ? clr : '#1f2937'}`,
                            boxShadow: input.priorityPreference === p.value ? `0 0 20px ${clr}40` : 'none',
                          }}
                        >
                          <span className="text-4xl">{p.emoji}</span>
                          <div className="text-center">
                            <div className="font-bold">{p.labelKo}</div>
                            <div className="text-xs mt-1" style={{ color: '#6b7280' }}>{p.descKo}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 네비게이션 버튼 / Navigation buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleBack}
                    disabled={stepIndex === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-30"
                    style={{ backgroundColor: '#1f2937', color: '#9ca3af' }}
                  >
                    <SkipBack size={14} />
                    이전 트랙 / Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background: `linear-gradient(to right, ${TRACK_COLORS[stepIndex % TRACK_COLORS.length]}, ${TRACK_COLORS[(stepIndex + 1) % TRACK_COLORS.length]})`,
                      color: '#000',
                      boxShadow: `0 0 20px ${TRACK_COLORS[stepIndex % TRACK_COLORS.length]}60`,
                    }}
                  >
                    {stepIndex === steps.length - 1 ? '믹스다운 / Analyze' : '다음 트랙 / Next'}
                    <SkipForward size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 믹서 패널 (진행도 시각화) / Right mixer panel (progress visualization) */}
          <div
            className="w-32 shrink-0 border-l flex flex-col items-center py-4 gap-4"
            style={{ backgroundColor: '#0d0d14', borderColor: '#1f2937' }}
          >
            <span className="text-xs font-bold tracking-widest" style={{ color: '#6b7280' }}>MIX</span>
            {steps.map((step, i) => {
              const isCompleted = i < stepIndex;
              const isCurrent = i === stepIndex;
              const clr = TRACK_COLORS[i % TRACK_COLORS.length];
              const level = isCompleted ? 75 + Math.random() * 20 : isCurrent ? 50 : 0;
              return (
                <MixerFader
                  key={step}
                  value={isCompleted ? 78 : isCurrent ? 45 : 5}
                  color={isCompleted || isCurrent ? clr : '#374151'}
                  label={TRACK_LABELS[i % TRACK_LABELS.length]}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 분석 화면 / Analyzing screen
  // ============================================================
  if (phase === 'analyzing') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-8"
        style={{ backgroundColor: '#0a0a0f', color: '#e5e7eb' }}
      >
        {/* 분석 중 애니메이션 / Analysis animation */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Headphones size={32} style={{ color: '#ff6b35' }} />
            <span className="text-2xl font-bold tracking-widest" style={{ color: '#ff6b35' }}>
              RENDERING MIX
            </span>
          </div>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            비자 경로를 작곡 중입니다... / Composing visa pathways...
          </p>
        </div>

        {/* 진행 바 / Progress bar */}
        <div className="w-80">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: '#1f2937' }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${analyzingProgress}%`,
                background: 'linear-gradient(to right, #ff6b35, #b649ff, #00e5ff, #39ff14)',
                boxShadow: '0 0 10px #ff6b3560',
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: '#6b7280' }}>
            <span>RENDERING</span>
            <span style={{ color: '#39ff14' }}>{analyzingProgress}%</span>
          </div>
        </div>

        {/* 분석 트랙 애니메이션 / Analysis track animation */}
        <div className="w-80 space-y-2">
          {['비자 규칙 분석 / Visa Rules', '점수 계산 / Scoring', '경로 생성 / Path Gen', '믹스다운 / Mixdown'].map(
            (label, i) => {
              const activated = analyzingProgress > i * 25;
              const clr = TRACK_COLORS[i % TRACK_COLORS.length];
              return (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: activated ? clr : '#374151',
                      boxShadow: activated ? `0 0 8px ${clr}` : 'none',
                    }}
                  />
                  <div className="flex-1 h-6 rounded overflow-hidden" style={{ backgroundColor: '#111218' }}>
                    <div
                      className="h-full transition-all duration-300 rounded"
                      style={{
                        width: activated ? '100%' : '0%',
                        backgroundColor: `${clr}30`,
                        borderRight: activated ? `2px solid ${clr}` : 'none',
                      }}
                    />
                  </div>
                  <span className="text-xs w-24 text-right" style={{ color: activated ? clr : '#374151' }}>
                    {label}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // 결과 화면 / Result screen
  // ============================================================
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0a0a0f', color: '#e5e7eb' }}
    >
      {/* 결과 헤더 / Result header */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ backgroundColor: '#111218', borderColor: '#1f2937' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ff6b35, #b649ff)' }}
          >
            <Headphones size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm tracking-widest" style={{ color: '#ff6b35' }}>
            JOBCHAJA STUDIO
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#39ff1420', color: '#39ff14', border: '1px solid #39ff1440' }}>
            MIX COMPLETE
          </span>
        </div>
        <TransportBar
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onStop={handleStop}
          bpm={BPM}
          currentBeat={currentBeat}
        />
        <button
          onClick={() => { setPhase('input'); setCurrentStep('nationality'); setIsPlaying(false); }}
          className="text-xs px-3 py-1.5 rounded-lg transition-all"
          style={{ backgroundColor: '#1f2937', color: '#9ca3af' }}
        >
          새 프로젝트 / New Project
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 사이드바 — 트랙 레이블 / Left sidebar — track labels */}
        <div
          className="w-52 shrink-0 border-r flex flex-col"
          style={{ backgroundColor: '#0d0d14', borderColor: '#1f2937' }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: '#1f2937' }}>
            <span className="text-xs font-bold tracking-widest" style={{ color: '#6b7280' }}>PATHWAYS</span>
          </div>

          {/* 5개 비자 경로를 믹서 트랙으로 / 5 visa pathways as mixer tracks */}
          {mockPathways.map((pathway, i) => {
            const clr = TRACK_COLORS[i % TRACK_COLORS.length];
            const isSelected = selectedPathwayId === pathway.pathwayId;
            return (
              <button
                key={pathway.pathwayId}
                onClick={() => setSelectedPathwayId(isSelected ? null : pathway.pathwayId)}
                className="flex items-center gap-2 px-3 py-3 border-b text-left transition-all"
                style={{
                  borderColor: '#1f2937',
                  backgroundColor: isSelected ? '#1a1a2e' : 'transparent',
                  borderLeft: `3px solid ${isSelected ? clr : 'transparent'}`,
                }}
              >
                {/* 활성화 LED / Active LED */}
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: clr,
                    boxShadow: isSelected ? `0 0 8px ${clr}` : 'none',
                    opacity: isSelected ? 1 : 0.3,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate" style={{ color: isSelected ? '#e5e7eb' : '#9ca3af' }}>
                    {pathway.nameEn}
                  </div>
                  <div className="text-xs" style={{ color: clr, opacity: 0.8 }}>
                    {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                  </div>
                </div>
                <div className="text-xs font-bold shrink-0" style={{ color: clr }}>
                  {pathway.finalScore}
                </div>
              </button>
            );
          })}
        </div>

        {/* 메인 DAW 타임라인 영역 / Main DAW timeline area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 타임라인 눈금 / Timeline ruler */}
          <div
            className="h-7 border-b flex items-end relative"
            style={{ backgroundColor: '#111218', borderColor: '#1f2937' }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className="flex-1 border-l flex items-center pl-1"
                style={{ borderColor: '#1f2937', color: '#374151', fontSize: '9px' }}
              >
                {i % 4 === 0 && `M${i + 1}`}
              </div>
            ))}
            {/* 재생 헤드 / Playhead */}
            {isPlaying && (
              <div
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${(currentBeat / 64) * 100}%`,
                  backgroundColor: '#39ff14',
                  boxShadow: '0 0 8px #39ff14',
                }}
              />
            )}
          </div>

          {/* 비자 경로 트랙들 / Visa pathway tracks */}
          <div className="flex-1 overflow-y-auto">
            {mockPathways.map((pathway, trackIdx) => {
              const clr = TRACK_COLORS[trackIdx % TRACK_COLORS.length];
              const isSelected = selectedPathwayId === pathway.pathwayId;
              const isExpanded = expandedPathway === pathway.pathwayId;
              const totalMonths = pathway.estimatedMonths || 60;
              const maxMonths = 66; // 최대 기준 / max reference

              return (
                <div
                  key={pathway.pathwayId}
                  className="border-b transition-all"
                  style={{ borderColor: '#1f2937' }}
                >
                  {/* 트랙 행 / Track row */}
                  <div
                    className="relative flex items-center"
                    style={{
                      height: isExpanded ? 'auto' : '60px',
                      minHeight: '60px',
                      backgroundColor: isSelected ? `${clr}08` : 'transparent',
                    }}
                  >
                    {/* 재생 헤드 오버레이 / Playhead overlay */}
                    {isPlaying && (
                      <div
                        className="absolute top-0 bottom-0 w-px pointer-events-none z-10"
                        style={{
                          left: `${(currentBeat / 64) * 100}%`,
                          backgroundColor: '#39ff14',
                          opacity: 0.5,
                        }}
                      />
                    )}

                    {/* 트랙 클립들 (마일스톤 시각화) / Track clips (milestone visualization) */}
                    <div className="flex-1 relative h-full">
                      {/* 배경 격자 / Background grid */}
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: 24 }, (_, i) => (
                          <div key={i} className="flex-1 border-l" style={{ borderColor: '#1f293720' }} />
                        ))}
                      </div>

                      {/* 비자 타임라인 클립 / Visa timeline clip */}
                      <div
                        className="absolute top-2 bottom-2 rounded-lg overflow-hidden cursor-pointer transition-all"
                        style={{
                          left: '1%',
                          width: `${(totalMonths / maxMonths) * 97}%`,
                          backgroundColor: `${clr}15`,
                          border: `1px solid ${isSelected ? clr : `${clr}40`}`,
                          boxShadow: isSelected ? `0 0 16px ${clr}40` : 'none',
                        }}
                        onClick={() => setSelectedPathwayId(isSelected ? null : pathway.pathwayId)}
                      >
                        {/* 클립 상단 레이블 / Clip header label */}
                        <div
                          className="flex items-center gap-2 px-3 py-1"
                          style={{ backgroundColor: `${clr}25` }}
                        >
                          <span className="text-xs font-bold truncate" style={{ color: clr }}>
                            {pathway.visaChainStr}
                          </span>
                          <span className="text-xs ml-auto shrink-0" style={{ color: `${clr}80` }}>
                            {totalMonths}mo
                          </span>
                        </div>

                        {/* 웨이브폼 / Waveform */}
                        <div className="px-2 py-1">
                          <WaveformBar color={clr} active={isSelected} score={pathway.finalScore} />
                        </div>

                        {/* 마일스톤 점들 / Milestone dots */}
                        {pathway.milestones.map((m) => {
                          const pct = (m.monthFromStart / maxMonths) * 100;
                          return (
                            <div
                              key={m.order}
                              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                              style={{
                                left: `${pct}%`,
                                backgroundColor: clr,
                                boxShadow: `0 0 6px ${clr}`,
                              }}
                              title={m.nameKo}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 선택된 트랙 상세 정보 / Selected track detail info */}
                  {isSelected && (
                    <div className="px-4 pb-4" style={{ backgroundColor: `${clr}05` }}>
                      {/* 마일스톤 타임라인 / Milestone timeline */}
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers size={12} style={{ color: clr }} />
                          <span className="text-xs font-bold tracking-wider" style={{ color: clr }}>
                            TIMELINE / 타임라인
                          </span>
                          <button
                            onClick={() => setExpandedPathway(isExpanded ? null : pathway.pathwayId)}
                            className="ml-auto"
                          >
                            {isExpanded
                              ? <ChevronUp size={12} style={{ color: '#6b7280' }} />
                              : <ChevronDown size={12} style={{ color: '#6b7280' }} />
                            }
                          </button>
                        </div>

                        {/* 마일스톤 클립들 / Milestone clips */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {pathway.milestones.map((m, mi) => (
                            <div
                              key={m.order}
                              className="shrink-0 p-3 rounded-lg"
                              style={{
                                backgroundColor: '#111218',
                                border: `1px solid ${clr}30`,
                                minWidth: '140px',
                              }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                                  style={{ backgroundColor: `${clr}30`, color: clr }}
                                >
                                  {mi + 1}
                                </div>
                                <span className="text-xs" style={{ color: '#6b7280' }}>
                                  M{m.monthFromStart}
                                </span>
                                {m.visaStatus !== 'none' && (
                                  <span
                                    className="text-xs px-1.5 py-0.5 rounded-full font-bold ml-auto"
                                    style={{ backgroundColor: `${clr}20`, color: clr }}
                                  >
                                    {m.visaStatus}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-medium" style={{ color: '#e5e7eb' }}>{m.nameKo}</div>
                              {m.canWorkPartTime && (
                                <div className="mt-1 text-xs" style={{ color: '#39ff14' }}>
                                  ₩{m.estimatedMonthlyIncome}만/월
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 다음 단계 / Next steps */}
                      {pathway.nextSteps.length > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {pathway.nextSteps.map((ns) => (
                            <div
                              key={ns.actionType}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg"
                              style={{
                                backgroundColor: '#111218',
                                border: `1px solid ${clr}20`,
                              }}
                            >
                              <ArrowRight size={10} style={{ color: clr }} />
                              <span className="text-xs" style={{ color: '#9ca3af' }}>{ns.nameKo}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 하단 마스터 섹션 / Bottom master section */}
          <div
            className="border-t p-4"
            style={{ backgroundColor: '#0d0d14', borderColor: '#1f2937' }}
          >
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} style={{ color: '#6b7280' }} />
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로 분석
                  / {mockDiagnosisResult.meta.totalPathwaysEvaluated} paths evaluated
                </span>
              </div>
              <div className="h-4 w-px" style={{ backgroundColor: '#1f2937' }} />
              <div className="flex items-center gap-2">
                <Zap size={14} style={{ color: '#39ff14' }} />
                <span className="text-xs" style={{ color: '#39ff14' }}>
                  {mockDiagnosisResult.pathways.length}개 유효 경로
                  / {mockDiagnosisResult.pathways.length} valid pathways
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs" style={{ color: '#6b7280' }}>Design #82 — Music Producer</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 믹서 패널 / Right mixer panel */}
        <div
          className="w-44 shrink-0 border-l flex flex-col"
          style={{ backgroundColor: '#0d0d14', borderColor: '#1f2937' }}
        >
          <div className="px-3 py-3 border-b" style={{ borderColor: '#1f2937' }}>
            <span className="text-xs font-bold tracking-widest" style={{ color: '#6b7280' }}>MIXER</span>
          </div>

          {/* 채널 패더들 / Channel faders */}
          <div className="flex-1 flex items-center justify-around px-2 py-4">
            {mockPathways.map((pathway, i) => {
              const clr = TRACK_COLORS[i % TRACK_COLORS.length];
              const level = Math.min(95, Math.max(10, pathway.finalScore));
              return (
                <MixerFader
                  key={pathway.pathwayId}
                  value={level}
                  color={clr}
                  label={TRACK_LABELS[i % TRACK_LABELS.length]}
                />
              );
            })}
          </div>

          {/* 마스터 패더 / Master fader */}
          <div
            className="border-t p-3 flex flex-col items-center gap-2"
            style={{ borderColor: '#1f2937' }}
          >
            <span className="text-xs font-bold tracking-widest" style={{ color: '#ff6b35' }}>MASTER</span>
            <MixerFader value={80} color="#ff6b35" label="MST" />
          </div>
        </div>
      </div>

      {/* 선택된 경로 상세 패널 (하단 드로어) / Selected pathway detail panel (bottom drawer) */}
      {selectedPathwayId && (() => {
        const pathway = mockPathways.find((p) => p.pathwayId === selectedPathwayId);
        if (!pathway) return null;
        const clr = TRACK_COLORS[mockPathways.indexOf(pathway) % TRACK_COLORS.length];
        return (
          <div
            className="border-t"
            style={{ backgroundColor: '#0d0d14', borderColor: clr, boxShadow: `0 -4px 20px ${clr}30` }}
          >
            <div className="flex items-start gap-6 p-5">
              {/* 경로 정보 / Pathway info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${clr}20`, border: `1px solid ${clr}` }}
                  >
                    <Guitar size={18} style={{ color: clr }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#e5e7eb' }}>{pathway.nameKo}</h3>
                    <p className="text-sm" style={{ color: '#6b7280' }}>{pathway.nameEn}</p>
                  </div>
                  <div
                    className="ml-auto text-2xl font-bold px-4 py-2 rounded-xl"
                    style={{
                      color: clr,
                      backgroundColor: `${clr}15`,
                      border: `1px solid ${clr}`,
                      boxShadow: `0 0 16px ${clr}30`,
                    }}
                  >
                    {pathway.finalScore}
                  </div>
                </div>
                <p className="text-sm" style={{ color: '#9ca3af' }}>{pathway.note}</p>
              </div>

              {/* 통계 칩들 / Stats chips */}
              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#111218', border: '1px solid #1f2937' }}>
                  <Clock size={12} style={{ color: '#00e5ff' }} />
                  <span className="text-sm font-bold" style={{ color: '#00e5ff' }}>{pathway.estimatedMonths}개월</span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>소요</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#111218', border: '1px solid #1f2937' }}>
                  <DollarSign size={12} style={{ color: '#39ff14' }} />
                  <span className="text-sm font-bold" style={{ color: '#39ff14' }}>
                    {pathway.estimatedCostWon === 0 ? '무료' : `${pathway.estimatedCostWon}만원`}
                  </span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>예상</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#111218', border: '1px solid #1f2937' }}>
                  <Radio size={12} style={{ color: '#b649ff' }} />
                  <span className="text-sm font-bold" style={{ color: '#b649ff' }}>{pathway.platformSupport}</span>
                </div>
              </div>

              {/* 비자 체인 / Visa chain */}
              <div className="flex flex-col gap-2 shrink-0">
                <span className="text-xs font-bold tracking-wider" style={{ color: '#6b7280' }}>VISA CHAIN</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, vi) => (
                    <div key={vi} className="flex items-center gap-1">
                      <span
                        className="text-xs font-bold px-2 py-1 rounded"
                        style={{ backgroundColor: `${clr}20`, color: clr, border: `1px solid ${clr}40` }}
                      >
                        {v.code}
                      </span>
                      {vi < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                        <ChevronRight size={10} style={{ color: '#374151' }} />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  className="mt-1 text-xs font-bold py-2 px-4 rounded-lg transition-all text-center"
                  style={{
                    background: `linear-gradient(to right, ${clr}, ${TRACK_COLORS[(mockPathways.indexOf(pathway) + 1) % TRACK_COLORS.length]})`,
                    color: '#000',
                    boxShadow: `0 0 16px ${clr}60`,
                  }}
                >
                  이 경로 선택 / Select This Path
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
