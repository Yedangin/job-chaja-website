'use client';

// DJ 믹싱 스타일 비자 진단 페이지 / DJ Mixing style visa diagnosis page
// 턴테이블 UI + 크로스페이더로 비자 조건을 믹싱하는 컨셉
// Concept: mixing visa conditions like a DJ with turntable UI + crossfader

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
  Music,
  Disc,
  Sliders,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Activity,
  Zap,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Clock,
  DollarSign,
  Radio,
  Headphones,
  Star,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type DiagnosisStep = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'result';

// ============================================================
// 유틸 함수 / Utility functions
// ============================================================

// 네온 색상 팔레트 / Neon color palette
const NEON_PINK = '#ff2d78';
const NEON_CYAN = '#00e5ff';
const NEON_PURPLE = '#b700ff';
const NEON_GREEN = '#39ff14';
const NEON_YELLOW = '#fff200';

// BPM을 점수에 따라 계산 / Calculate BPM based on score
function scoreToBpm(score: number): number {
  // 점수 0~100을 BPM 80~180으로 매핑 / Map score 0-100 to BPM 80-180
  return Math.round(80 + (score / 100) * 100);
}

// 점수에 따른 네온 색상 반환 / Return neon color based on score
function scoreToNeonColor(score: number): string {
  if (score >= 51) return NEON_GREEN;
  if (score >= 31) return NEON_CYAN;
  if (score >= 11) return NEON_YELLOW;
  return NEON_PINK;
}

// 가능성 레이블을 영어로 변환 / Convert feasibility label to English
function feasibilityToEn(label: string): string {
  const map: Record<string, string> = {
    '높음': 'HIGH',
    '보통': 'MEDIUM',
    '낮음': 'LOW',
    '매우낮음': 'VERY LOW',
  };
  return map[label] || label;
}

// ============================================================
// 서브 컴포넌트: 회전하는 레코드판 / Sub-component: spinning vinyl record
// ============================================================

interface VinylRecordProps {
  isSpinning: boolean;
  color: string;
  label: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

function VinylRecord({ isSpinning, color, label, sublabel, size = 'md' }: VinylRecordProps) {
  // 크기별 클래스 / Size-based classes
  const sizeMap = {
    sm: { outer: 'w-28 h-28', inner: 'w-14 h-14', center: 'w-5 h-5', label: 'text-xs' },
    md: { outer: 'w-40 h-40', inner: 'w-20 h-20', center: 'w-7 h-7', label: 'text-sm' },
    lg: { outer: 'w-52 h-52', inner: 'w-24 h-24', center: 'w-9 h-9', label: 'text-base' },
  };
  const s = sizeMap[size];

  return (
    // 레코드판 컨테이너 / Vinyl record container
    <div className={`relative ${s.outer} flex items-center justify-center`}>
      {/* 외부 레코드 홈 링 / Outer groove rings */}
      <div
        className={`absolute inset-0 rounded-full border-2 ${isSpinning ? 'animate-spin' : ''}`}
        style={{
          borderColor: color,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}40`,
          animationDuration: '3s',
          background: `conic-gradient(from 0deg, #0a0a0f, #111118, #0a0a0f, #111118, #0a0a0f)`,
        }}
      >
        {/* 내부 홈 패턴 / Inner groove pattern */}
        {[0.85, 0.75, 0.65, 0.55].map((scale) => (
          <div
            key={scale}
            className="absolute inset-0 rounded-full border"
            style={{
              transform: `scale(${scale})`,
              borderColor: `${color}30`,
            }}
          />
        ))}
      </div>
      {/* 중앙 레이블 원 / Center label circle */}
      <div
        className={`relative ${s.inner} rounded-full flex flex-col items-center justify-center z-10`}
        style={{
          background: `radial-gradient(circle, #1a0030 0%, #0d001a 100%)`,
          border: `2px solid ${color}`,
          boxShadow: `0 0 10px ${color}80`,
        }}
      >
        {/* 스핀들 홀 / Spindle hole */}
        <div
          className={`${s.center} rounded-full mb-1`}
          style={{ background: '#000', border: `1px solid ${color}60` }}
        />
        <p className={`text-white font-bold ${s.label} text-center leading-tight px-1`}>{label}</p>
        {sublabel && (
          <p className="text-gray-400 text-xs text-center leading-tight">{sublabel}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: EQ 노브 / Sub-component: EQ knob
// ============================================================

interface KnobProps {
  label: string;
  value: number; // 0-100
  color: string;
  onChange?: (v: number) => void;
}

function Knob({ label, value, color }: KnobProps) {
  // 노브 회전 각도 계산 (최소 -135°, 최대 +135°) / Calculate knob rotation angle
  const rotation = -135 + (value / 100) * 270;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* 노브 원형 / Knob circle */}
      <div
        className="relative w-12 h-12 rounded-full cursor-pointer"
        style={{
          background: `radial-gradient(circle at 35% 35%, #2a2a3a, #111118)`,
          border: `2px solid ${color}60`,
          boxShadow: `0 0 8px ${color}40, inset 0 2px 4px rgba(0,0,0,0.5)`,
        }}
      >
        {/* 노브 포인터 / Knob pointer */}
        <div
          className="absolute w-1 h-4 rounded-full"
          style={{
            background: color,
            top: '50%',
            left: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) translateY(-100%) rotate(${rotation}deg)`,
            boxShadow: `0 0 4px ${color}`,
          }}
        />
        {/* 외부 링 / Outer ring */}
        <div
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: `${color}30` }}
        />
      </div>
      {/* 레이블 / Label */}
      <span className="text-xs text-gray-400 font-mono">{label}</span>
      {/* 값 / Value */}
      <span className="text-xs font-bold font-mono" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 웨이브폼 / Sub-component: waveform
// ============================================================

interface WaveformProps {
  bars: number[];
  color: string;
  isActive?: boolean;
}

function Waveform({ bars, color, isActive = false }: WaveformProps) {
  return (
    <div className="flex items-end gap-0.5 h-10">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 rounded-t transition-all duration-300"
          style={{
            height: `${height}%`,
            background: isActive
              ? `linear-gradient(to top, ${color}, ${color}80)`
              : `${color}40`,
            boxShadow: isActive ? `0 0 3px ${color}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: LED 레벨 미터 / Sub-component: LED level meter
// ============================================================

interface LevelMeterProps {
  level: number; // 0-100
  vertical?: boolean;
}

function LevelMeter({ level, vertical = false }: LevelMeterProps) {
  const segments = 12;
  const activeBars = Math.round((level / 100) * segments);

  const getSegmentColor = (index: number) => {
    const normalized = index / segments;
    if (normalized > 0.85) return '#ff2d78'; // 피크 / Peak - neon pink
    if (normalized > 0.7) return '#fff200';  // 경고 / Warning - neon yellow
    return '#39ff14'; // 정상 / Normal - neon green
  };

  return (
    <div className={`flex ${vertical ? 'flex-col-reverse' : 'flex-row'} gap-0.5`}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`${vertical ? 'w-3 h-1.5' : 'h-3 w-1.5'} rounded-sm transition-all duration-100`}
          style={{
            background: i < activeBars ? getSegmentColor(i) : '#1a1a2a',
            boxShadow: i < activeBars ? `0 0 4px ${getSegmentColor(i)}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: BPM 카운터 / Sub-component: BPM counter
// ============================================================

interface BpmCounterProps {
  bpm: number;
  isActive: boolean;
}

function BpmCounter({ bpm, isActive }: BpmCounterProps) {
  return (
    <div
      className="flex flex-col items-center px-3 py-2 rounded"
      style={{
        background: '#0a0a14',
        border: `1px solid ${isActive ? NEON_CYAN : '#333344'}`,
        boxShadow: isActive ? `0 0 10px ${NEON_CYAN}40` : 'none',
      }}
    >
      <span className="text-xs text-gray-500 font-mono tracking-widest">BPM</span>
      <span
        className="text-2xl font-bold font-mono"
        style={{ color: isActive ? NEON_CYAN : '#666680' }}
      >
        {bpm}
      </span>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 크로스페이더 / Sub-component: crossfader
// ============================================================

interface CrossfaderProps {
  value: number; // 0-100 (0=left, 50=center, 100=right)
  leftLabel: string;
  rightLabel: string;
  onChange?: (v: number) => void;
}

function Crossfader({ value, leftLabel, rightLabel }: CrossfaderProps) {
  const leftPct = Math.max(0, 100 - value * 2); // 왼쪽 채널 레벨 / Left channel level
  const rightPct = Math.max(0, value * 2 - 100); // 오른쪽 채널 레벨 / Right channel level
  const centerPct = value <= 50 ? value * 2 : (100 - value) * 2; // 센터 레벨 / Center level

  return (
    <div className="w-full space-y-2">
      {/* 레이블 행 / Label row */}
      <div className="flex justify-between text-xs font-mono">
        <span style={{ color: NEON_PINK }}>{leftLabel}</span>
        <span className="text-gray-500">CROSSFADER</span>
        <span style={{ color: NEON_CYAN }}>{rightLabel}</span>
      </div>
      {/* 슬라이더 트랙 / Slider track */}
      <div
        className="relative h-6 rounded-full"
        style={{ background: '#0d0d1a', border: `1px solid #333344` }}
      >
        {/* 채워진 영역 / Filled area */}
        <div
          className="absolute top-0 bottom-0 rounded-full transition-all duration-300"
          style={{
            left: `${Math.min(value, 50)}%`,
            right: `${Math.max(0, 100 - Math.max(value, 50))}%`,
            background: `linear-gradient(to right, ${NEON_PINK}60, ${NEON_CYAN}60)`,
          }}
        />
        {/* 페이더 핸들 / Fader handle */}
        <div
          className="absolute top-0 bottom-0 w-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            left: `calc(${value}% - 1rem)`,
            background: `linear-gradient(180deg, #3a3a4a, #1a1a2a)`,
            border: `2px solid ${NEON_CYAN}80`,
            boxShadow: `0 0 8px ${NEON_CYAN}40`,
          }}
        >
          <div className="w-0.5 h-3 rounded-full" style={{ background: NEON_CYAN }} />
        </div>
      </div>
      {/* 레벨 표시 / Level display */}
      <div className="flex justify-between text-xs font-mono">
        <span style={{ color: NEON_PINK }}>{Math.round(leftPct)}%</span>
        <span style={{ color: '#666680' }}>{Math.round(centerPct)}% MIX</span>
        <span style={{ color: NEON_CYAN }}>{Math.round(rightPct)}%</span>
      </div>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 이펙트 버튼 / Sub-component: effect button
// ============================================================

interface FxButtonProps {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}

function FxButton({ label, active, color, onClick }: FxButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded text-xs font-bold font-mono tracking-wider transition-all duration-200"
      style={{
        background: active ? color : '#111118',
        color: active ? '#000' : color,
        border: `1px solid ${color}`,
        boxShadow: active ? `0 0 12px ${color}` : 'none',
      }}
    >
      {label}
    </button>
  );
}

// ============================================================
// 서브 컴포넌트: 진단 결과 트랙 카드 / Sub-component: result track card
// ============================================================

interface TrackCardProps {
  pathway: CompatPathway;
  index: number;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onPlay: () => void;
}

function TrackCard({ pathway, index, isSelected, isPlaying, onSelect, onPlay }: TrackCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const neonColor = scoreToNeonColor(pathway.finalScore);
  const bpm = scoreToBpm(pathway.finalScore);

  // 웨이브폼 바 생성 (점수 기반) / Generate waveform bars based on score
  const waveformBars = Array.from({ length: 32 }, (_, i) => {
    const base = (pathway.finalScore / 100) * 60 + 20;
    const variation = Math.sin(i * 0.8 + pathway.finalScore * 0.1) * 20;
    return Math.max(10, Math.min(100, base + variation));
  });

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        background: isSelected ? '#12122a' : '#0d0d1a',
        border: `1px solid ${isSelected ? neonColor : '#222233'}`,
        boxShadow: isSelected ? `0 0 20px ${neonColor}20` : 'none',
      }}
      onClick={onSelect}
    >
      {/* 트랙 헤더 / Track header */}
      <div className="flex items-center gap-3 p-4">
        {/* 트랙 번호 / Track number */}
        <div
          className="w-8 h-8 rounded shrink-0 flex items-center justify-center text-sm font-bold font-mono"
          style={{
            background: `${neonColor}20`,
            border: `1px solid ${neonColor}`,
            color: neonColor,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* 웨이브폼 영역 / Waveform area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-bold text-sm truncate">{pathway.nameKo}</h3>
            {isSelected && isPlaying && (
              <Activity size={12} style={{ color: neonColor }} className="animate-pulse shrink-0" />
            )}
          </div>
          <p className="text-gray-500 text-xs font-mono truncate">{pathway.visaChainStr}</p>
          {/* 웨이브폼 / Waveform */}
          <div className="mt-2">
            <Waveform bars={waveformBars} color={neonColor} isActive={isSelected && isPlaying} />
          </div>
        </div>

        {/* BPM + 재생 버튼 / BPM + play button */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <BpmCounter bpm={bpm} isActive={isSelected && isPlaying} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: isPlaying && isSelected ? neonColor : `${neonColor}20`,
              color: isPlaying && isSelected ? '#000' : neonColor,
              border: `1px solid ${neonColor}`,
              boxShadow: isPlaying && isSelected ? `0 0 10px ${neonColor}` : 'none',
            }}
          >
            {isPlaying && isSelected ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>

        {/* 점수 / Score */}
        <div className="flex flex-col items-center shrink-0">
          <span
            className="text-xl font-bold font-mono"
            style={{ color: neonColor }}
          >
            {pathway.finalScore}
          </span>
          <span className="text-xs text-gray-500 font-mono">SCORE</span>
          <span className="text-xs mt-0.5" style={{ color: neonColor }}>
            {getFeasibilityEmoji(pathway.feasibilityLabel)}
          </span>
        </div>

        {/* 확장 버튼 / Expand button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="shrink-0 p-1 rounded transition-colors"
          style={{ color: '#666680' }}
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* 확장 상세 정보 / Expanded details */}
      {isExpanded && (
        <div
          className="border-t px-4 pb-4 pt-3 space-y-3"
          style={{ borderColor: `${neonColor}30` }}
        >
          {/* 메타 정보 그리드 / Meta info grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-2 rounded" style={{ background: '#0a0a14' }}>
              <Clock size={14} style={{ color: NEON_CYAN }} className="mb-1" />
              <span className="text-xs text-gray-400">소요기간 / Duration</span>
              <span className="text-sm font-bold text-white">{pathway.estimatedMonths}개월</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded" style={{ background: '#0a0a14' }}>
              <DollarSign size={14} style={{ color: NEON_GREEN }} className="mb-1" />
              <span className="text-xs text-gray-400">비용 / Cost</span>
              <span className="text-sm font-bold text-white">
                {pathway.estimatedCostWon === 0 ? '0원' : `${pathway.estimatedCostWon}만원`}
              </span>
            </div>
            <div className="flex flex-col items-center p-2 rounded" style={{ background: '#0a0a14' }}>
              <Star size={14} style={{ color: NEON_YELLOW }} className="mb-1" />
              <span className="text-xs text-gray-400">가능성 / Feasibility</span>
              <span className="text-sm font-bold" style={{ color: neonColor }}>
                {feasibilityToEn(pathway.feasibilityLabel)}
              </span>
            </div>
          </div>

          {/* 스코어 이퀄라이저 / Score equalizer */}
          <div>
            <p className="text-xs text-gray-500 font-mono mb-2">EQ BREAKDOWN</p>
            <div className="space-y-1.5">
              {[
                { label: 'BASE', value: pathway.scoreBreakdown.base },
                { label: 'AGE', value: Math.round(pathway.scoreBreakdown.ageMultiplier * 100) },
                { label: 'NATION', value: Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100) },
                { label: 'FUND', value: Math.round(pathway.scoreBreakdown.fundMultiplier * 100) },
                { label: 'EDU', value: Math.round(pathway.scoreBreakdown.educationMultiplier * 100) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono w-16 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1a1a2a' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(value, 100)}%`,
                        background: `linear-gradient(to right, ${NEON_CYAN}, ${neonColor})`,
                        boxShadow: `0 0 4px ${neonColor}`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono w-8 shrink-0 text-right" style={{ color: neonColor }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 마일스톤 큐 포인트 / Milestone cue points */}
          {pathway.milestones.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-mono mb-2">CUE POINTS</p>
              <div className="space-y-1">
                {pathway.milestones.map((m, mi) => (
                  <div key={mi} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: neonColor, boxShadow: `0 0 4px ${neonColor}` }}
                    />
                    <span className="text-xs text-gray-400 font-mono">
                      +{m.monthFromStart}mo
                    </span>
                    <span className="text-xs text-gray-300">{m.nameKo}</span>
                    {m.visaStatus && m.visaStatus !== 'none' && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-bold"
                        style={{ background: `${neonColor}20`, color: neonColor }}
                      >
                        {m.visaStatus}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 참고 노트 / Note */}
          {pathway.note && (
            <div
              className="p-2 rounded text-xs text-gray-400 font-mono"
              style={{ background: `${neonColor}10`, borderLeft: `2px solid ${neonColor}` }}
            >
              {pathway.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis88DjMixingPage() {
  // 입력 상태 / Input state
  const [step, setStep] = useState<DiagnosisStep>('nationality');
  const [input, setInput] = useState<DiagnosisInput>(mockInput);

  // DJ UI 상태 / DJ UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingPathwayId, setPlayingPathwayId] = useState<string | null>(null);
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);
  const [crossfaderValue, setCrossfaderValue] = useState(50);
  const [activeFx, setActiveFx] = useState<Record<string, boolean>>({
    FLANGER: false,
    ECHO: false,
    FILTER: false,
    REVERB: false,
  });

  // 결과 상태 / Result state
  const [showResult, setShowResult] = useState(false);
  const [animateTurntable, setAnimateTurntable] = useState(false);

  // 단계 순서 / Step order
  const steps: DiagnosisStep[] = [
    'nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference',
  ];
  const currentStepIndex = steps.indexOf(step);
  const totalInputSteps = steps.length;

  // 선택된 국가 / Selected country
  const selectedCountry = popularCountries.find((c) => c.code === input.nationality);

  // 분석 실행 / Run analysis
  const handleAnalyze = () => {
    setAnimateTurntable(true);
    setIsPlaying(true);
    setTimeout(() => {
      setShowResult(true);
      setStep('result');
      setSelectedPathwayId(mockPathways[0].id);
      setPlayingPathwayId(mockPathways[0].id);
    }, 2000);
  };

  // 다시 시작 / Restart
  const handleRestart = () => {
    setStep('nationality');
    setShowResult(false);
    setIsPlaying(false);
    setAnimateTurntable(false);
    setPlayingPathwayId(null);
    setSelectedPathwayId(null);
    setInput(mockInput);
  };

  // 다음 단계 / Next step
  const handleNext = () => {
    if (currentStepIndex < totalInputSteps - 1) {
      setStep(steps[currentStepIndex + 1]);
    } else {
      handleAnalyze();
    }
  };

  // 이전 단계 / Previous step
  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  // FX 토글 / Toggle FX
  const toggleFx = (fx: string) => {
    setActiveFx((prev) => ({ ...prev, [fx]: !prev[fx] }));
  };

  // 웨이브폼 데이터 (랜덤한 모양) / Waveform data for deck A and B
  const deckAWave = Array.from({ length: 40 }, (_, i) =>
    20 + Math.abs(Math.sin(i * 0.5) * 60) + Math.random() * 10
  );
  const deckBWave = Array.from({ length: 40 }, (_, i) =>
    15 + Math.abs(Math.cos(i * 0.4) * 55) + Math.random() * 10
  );

  // 전체 레이아웃 / Overall layout
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'linear-gradient(135deg, #050510 0%, #0a0a1a 50%, #050510 100%)',
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* 배경 그리드 패턴 / Background grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${NEON_CYAN}20 1px, transparent 1px),
            linear-gradient(90deg, ${NEON_CYAN}20 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 상단 헤더 / Top header */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: `${NEON_PINK}30` }}
      >
        <div className="flex items-center gap-3">
          <Headphones size={24} style={{ color: NEON_PINK }} />
          <div>
            <h1
              className="text-lg font-bold tracking-widest"
              style={{
                color: NEON_PINK,
                textShadow: `0 0 10px ${NEON_PINK}, 0 0 20px ${NEON_PINK}40`,
              }}
            >
              JOBCHAJA DJ
            </h1>
            <p className="text-xs text-gray-500 tracking-wider">비자 믹싱 진단 시스템 / VISA MIX ANALYZER v2.0</p>
          </div>
        </div>

        {/* 마스터 BPM + 레벨 미터 / Master BPM + level meter */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-xs text-gray-500 font-mono tracking-widest">MASTER</span>
            <LevelMeter level={isPlaying ? 75 : 0} />
          </div>
          <BpmCounter bpm={128} isActive={isPlaying} />
          {/* 재생/정지 메인 버튼 / Main play/stop button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: isPlaying ? NEON_PINK : `${NEON_PINK}20`,
              color: isPlaying ? '#000' : NEON_PINK,
              border: `2px solid ${NEON_PINK}`,
              boxShadow: isPlaying ? `0 0 20px ${NEON_PINK}` : 'none',
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* ================================================ */}
        {/* 입력 단계: 덱 A/B 턴테이블 섹션 / Input steps: Deck A/B turntable section */}
        {/* ================================================ */}
        {!showResult ? (
          <>
            {/* 진행 표시줄 / Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-mono">
                <span>TRACK {currentStepIndex + 1}/{totalInputSteps}</span>
                <span>LOADING MIX...</span>
                <span>{Math.round(((currentStepIndex + 1) / totalInputSteps) * 100)}% LOADED</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: '#1a1a2a' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentStepIndex + 1) / totalInputSteps) * 100}%`,
                    background: `linear-gradient(to right, ${NEON_PINK}, ${NEON_CYAN})`,
                    boxShadow: `0 0 8px ${NEON_CYAN}`,
                  }}
                />
              </div>
            </div>

            {/* 메인 믹서 패널 / Main mixer panel */}
            <div
              className="rounded-2xl p-6 space-y-6"
              style={{
                background: 'linear-gradient(180deg, #111120 0%, #0a0a18 100%)',
                border: `1px solid ${NEON_PINK}30`,
                boxShadow: `0 0 40px ${NEON_PINK}10, inset 0 1px 0 ${NEON_PINK}20`,
              }}
            >
              {/* 덱 A와 덱 B 턴테이블 / Deck A and B turntables */}
              <div className="flex items-center justify-around gap-4">
                {/* 덱 A — 현재 조건 / Deck A - current conditions */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="text-xs font-bold tracking-widest px-2 py-0.5 rounded"
                    style={{
                      background: `${NEON_PINK}20`,
                      border: `1px solid ${NEON_PINK}60`,
                      color: NEON_PINK,
                    }}
                  >
                    DECK A
                  </div>
                  <VinylRecord
                    isSpinning={isPlaying}
                    color={NEON_PINK}
                    label={selectedCountry?.nameKo ?? '국적'}
                    sublabel={selectedCountry?.flag}
                    size="lg"
                  />
                  {/* 덱 A 웨이브폼 / Deck A waveform */}
                  <div className="flex gap-1 items-center">
                    <LevelMeter level={isPlaying ? 68 : 0} vertical />
                    <Waveform bars={deckAWave} color={NEON_PINK} isActive={isPlaying} />
                    <LevelMeter level={isPlaying ? 72 : 0} vertical />
                  </div>
                </div>

                {/* 센터 믹서 섹션 / Center mixer section */}
                <div className="flex flex-col items-center gap-4 min-w-0">
                  {/* FX 버튼 / FX buttons */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.keys(activeFx).map((fx) => (
                      <FxButton
                        key={fx}
                        label={fx}
                        active={activeFx[fx]}
                        color={NEON_PURPLE}
                        onClick={() => toggleFx(fx)}
                      />
                    ))}
                  </div>

                  {/* EQ 노브 / EQ knobs */}
                  <div className="flex gap-3">
                    <Knob label="HI" value={70} color={NEON_CYAN} />
                    <Knob label="MID" value={55} color={NEON_CYAN} />
                    <Knob label="LOW" value={80} color={NEON_CYAN} />
                  </div>

                  {/* 크로스페이더 / Crossfader */}
                  <div className="w-full min-w-36">
                    <Crossfader
                      value={crossfaderValue}
                      leftLabel="현재조건"
                      rightLabel="목표비자"
                      onChange={setCrossfaderValue}
                    />
                  </div>

                  {/* 마스터 볼륨 / Master volume */}
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} style={{ color: NEON_CYAN }} />
                    <div
                      className="relative h-2 rounded-full w-20"
                      style={{ background: '#1a1a2a' }}
                    >
                      <div
                        className="absolute top-0 bottom-0 left-0 w-4/5 rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${NEON_GREEN}, ${NEON_CYAN})`,
                          boxShadow: `0 0 6px ${NEON_CYAN}`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">100%</span>
                  </div>
                </div>

                {/* 덱 B — 목표 비자 / Deck B - target visa */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="text-xs font-bold tracking-widest px-2 py-0.5 rounded"
                    style={{
                      background: `${NEON_CYAN}20`,
                      border: `1px solid ${NEON_CYAN}60`,
                      color: NEON_CYAN,
                    }}
                  >
                    DECK B
                  </div>
                  <VinylRecord
                    isSpinning={isPlaying && animateTurntable}
                    color={NEON_CYAN}
                    label={
                      input.finalGoal
                        ? goalOptions.find((g) => g.value === input.finalGoal)?.emoji ?? '🎯'
                        : '목표'
                    }
                    sublabel={goalOptions.find((g) => g.value === input.finalGoal)?.labelKo ?? ''}
                    size="lg"
                  />
                  {/* 덱 B 웨이브폼 / Deck B waveform */}
                  <div className="flex gap-1 items-center">
                    <LevelMeter level={isPlaying && animateTurntable ? 55 : 0} vertical />
                    <Waveform bars={deckBWave} color={NEON_CYAN} isActive={isPlaying && animateTurntable} />
                    <LevelMeter level={isPlaying && animateTurntable ? 60 : 0} vertical />
                  </div>
                </div>
              </div>

              {/* 구분선 / Divider */}
              <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${NEON_PINK}40, ${NEON_CYAN}40, transparent)` }} />

              {/* ========== 입력 영역: 현재 단계 / Input area: current step ========== */}
              <div className="space-y-4">

                {/* 단계 헤더 / Step header */}
                <div className="flex items-center gap-2">
                  <Radio size={16} style={{ color: NEON_PINK }} className="animate-pulse" />
                  <h2 className="text-sm font-bold tracking-wider" style={{ color: NEON_PINK }}>
                    {step === 'nationality' && 'CUE 01 — 국적 선택 / SELECT NATIONALITY'}
                    {step === 'age' && 'CUE 02 — 나이 입력 / ENTER AGE'}
                    {step === 'educationLevel' && 'CUE 03 — 학력 선택 / SELECT EDUCATION'}
                    {step === 'availableAnnualFund' && 'CUE 04 — 자금 선택 / SELECT FUNDS'}
                    {step === 'finalGoal' && 'CUE 05 — 목표 선택 / SELECT GOAL'}
                    {step === 'priorityPreference' && 'CUE 06 — 우선순위 / SELECT PRIORITY'}
                  </h2>
                </div>

                {/* === 국적 선택 / Nationality selection === */}
                {step === 'nationality' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {popularCountries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setInput((prev) => ({ ...prev, nationality: c.code }))}
                        className="flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 text-center"
                        style={{
                          background: input.nationality === c.code ? `${NEON_PINK}20` : '#111118',
                          border: `1px solid ${input.nationality === c.code ? NEON_PINK : '#222233'}`,
                          boxShadow: input.nationality === c.code ? `0 0 12px ${NEON_PINK}30` : 'none',
                        }}
                      >
                        <span className="text-2xl">{c.flag}</span>
                        <span
                          className="text-xs font-bold"
                          style={{ color: input.nationality === c.code ? NEON_PINK : '#888' }}
                        >
                          {c.nameKo}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* === 나이 입력 / Age input === */}
                {step === 'age' && (
                  <div className="space-y-4">
                    {/* 디스플레이 / Display */}
                    <div
                      className="flex items-center justify-center gap-4 p-6 rounded-xl"
                      style={{ background: '#0a0a14', border: `1px solid ${NEON_CYAN}30` }}
                    >
                      <button
                        onClick={() => setInput((prev) => ({ ...prev, age: Math.max(18, prev.age - 1) }))}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all"
                        style={{ background: `${NEON_PINK}20`, color: NEON_PINK, border: `1px solid ${NEON_PINK}` }}
                      >
                        −
                      </button>
                      <div className="flex flex-col items-center">
                        <span
                          className="text-5xl font-bold font-mono"
                          style={{ color: NEON_CYAN, textShadow: `0 0 20px ${NEON_CYAN}` }}
                        >
                          {input.age}
                        </span>
                        <span className="text-xs text-gray-500 font-mono mt-1">세 / YEARS OLD</span>
                      </div>
                      <button
                        onClick={() => setInput((prev) => ({ ...prev, age: Math.min(60, prev.age + 1) }))}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all"
                        style={{ background: `${NEON_CYAN}20`, color: NEON_CYAN, border: `1px solid ${NEON_CYAN}` }}
                      >
                        +
                      </button>
                    </div>
                    {/* 범위 슬라이더 / Range slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600 font-mono">
                        <span>18세</span>
                        <span>60세</span>
                      </div>
                      <div className="relative h-2 rounded-full" style={{ background: '#1a1a2a' }}>
                        <div
                          className="absolute top-0 bottom-0 left-0 rounded-full"
                          style={{
                            width: `${((input.age - 18) / 42) * 100}%`,
                            background: `linear-gradient(to right, ${NEON_PINK}, ${NEON_CYAN})`,
                            boxShadow: `0 0 8px ${NEON_CYAN}`,
                          }}
                        />
                        <input
                          type="range"
                          min={18}
                          max={60}
                          value={input.age}
                          onChange={(e) => setInput((prev) => ({ ...prev, age: Number(e.target.value) }))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* === 학력 선택 / Education selection === */}
                {step === 'educationLevel' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {educationOptions.map((e) => (
                      <button
                        key={e.value}
                        onClick={() => setInput((prev) => ({ ...prev, educationLevel: e.value }))}
                        className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
                        style={{
                          background: input.educationLevel === e.value ? `${NEON_CYAN}20` : '#111118',
                          border: `1px solid ${input.educationLevel === e.value ? NEON_CYAN : '#222233'}`,
                          boxShadow: input.educationLevel === e.value ? `0 0 12px ${NEON_CYAN}30` : 'none',
                        }}
                      >
                        <span className="text-xl">{e.emoji}</span>
                        <div className="text-left">
                          <p
                            className="text-xs font-bold"
                            style={{ color: input.educationLevel === e.value ? NEON_CYAN : '#888' }}
                          >
                            {e.labelKo}
                          </p>
                          <p className="text-xs text-gray-600">{e.labelEn}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* === 자금 선택 / Fund selection === */}
                {step === 'availableAnnualFund' && (
                  <div className="space-y-2">
                    {fundOptions.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setInput((prev) => ({ ...prev, availableAnnualFund: f.value }))}
                        className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                        style={{
                          background: input.availableAnnualFund === f.value ? `${NEON_GREEN}20` : '#111118',
                          border: `1px solid ${input.availableAnnualFund === f.value ? NEON_GREEN : '#222233'}`,
                          boxShadow: input.availableAnnualFund === f.value ? `0 0 12px ${NEON_GREEN}30` : 'none',
                        }}
                      >
                        <span
                          className="text-sm font-bold"
                          style={{ color: input.availableAnnualFund === f.value ? NEON_GREEN : '#888' }}
                        >
                          {f.labelKo}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 font-mono">{f.labelEn}</span>
                          {/* 레벨 표시바 / Level bar */}
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (f.value / 3000) * 100 + 20)}px`,
                              background: input.availableAnnualFund === f.value
                                ? `linear-gradient(to right, ${NEON_GREEN}, ${NEON_CYAN})`
                                : '#2a2a3a',
                            }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* === 목표 선택 / Goal selection === */}
                {step === 'finalGoal' && (
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setInput((prev) => ({ ...prev, finalGoal: g.value }))}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200"
                        style={{
                          background: input.finalGoal === g.value ? `${NEON_PURPLE}20` : '#111118',
                          border: `1px solid ${input.finalGoal === g.value ? NEON_PURPLE : '#222233'}`,
                          boxShadow: input.finalGoal === g.value ? `0 0 15px ${NEON_PURPLE}30` : 'none',
                        }}
                      >
                        <span className="text-3xl">{g.emoji}</span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: input.finalGoal === g.value ? NEON_PURPLE : '#888' }}
                        >
                          {g.labelKo}
                        </span>
                        <span className="text-xs text-gray-600 text-center">{g.descKo}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* === 우선순위 선택 / Priority selection === */}
                {step === 'priorityPreference' && (
                  <div className="grid grid-cols-2 gap-3">
                    {priorityOptions.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setInput((prev) => ({ ...prev, priorityPreference: p.value }))}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200"
                        style={{
                          background: input.priorityPreference === p.value ? `${NEON_YELLOW}20` : '#111118',
                          border: `1px solid ${input.priorityPreference === p.value ? NEON_YELLOW : '#222233'}`,
                          boxShadow: input.priorityPreference === p.value ? `0 0 15px ${NEON_YELLOW}30` : 'none',
                        }}
                      >
                        <span className="text-3xl">{p.emoji}</span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: input.priorityPreference === p.value ? NEON_YELLOW : '#888' }}
                        >
                          {p.labelKo}
                        </span>
                        <span className="text-xs text-gray-600 text-center">{p.descKo}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 네비게이션 버튼 / Navigation buttons */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 disabled:opacity-30"
                    style={{
                      background: '#111118',
                      color: '#888',
                      border: '1px solid #222233',
                    }}
                  >
                    ← PREV
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300"
                    style={{
                      background: currentStepIndex === totalInputSteps - 1
                        ? `linear-gradient(135deg, ${NEON_PINK}, ${NEON_PURPLE})`
                        : `linear-gradient(135deg, ${NEON_CYAN}, ${NEON_PURPLE})`,
                      color: '#000',
                      boxShadow: `0 0 20px ${NEON_CYAN}40`,
                    }}
                  >
                    {currentStepIndex === totalInputSteps - 1 ? (
                      <>
                        <Zap size={16} />
                        MIX NOW → 분석 시작
                      </>
                    ) : (
                      <>
                        NEXT →
                        <SkipForward size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ================================================ */
          /* 결과 화면: DJ 믹스 결과 / Result screen: DJ mix result */
          /* ================================================ */
          <>
            {/* 결과 헤더 / Result header */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, #1a0030 0%, #0d001a 50%, #00101a 100%)',
                border: `1px solid ${NEON_PINK}40`,
                boxShadow: `0 0 40px ${NEON_PINK}10`,
              }}
            >
              {/* 믹스 완료 배너 / Mix complete banner */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: NEON_GREEN, boxShadow: `0 0 15px ${NEON_GREEN}` }}
                  >
                    <CheckCircle size={20} className="text-black" />
                  </div>
                  <div>
                    <h2
                      className="text-lg font-bold tracking-wider"
                      style={{ color: NEON_GREEN, textShadow: `0 0 10px ${NEON_GREEN}` }}
                    >
                      MIX COMPLETE — 분석 완료
                    </h2>
                    <p className="text-xs text-gray-500 font-mono">
                      {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로 평가 완료 / {mockDiagnosisResult.meta.totalPathwaysEvaluated} pathways evaluated
                    </p>
                  </div>
                </div>
                {/* 다시 믹싱 버튼 / Remix button */}
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                  style={{
                    background: '#111118',
                    color: NEON_CYAN,
                    border: `1px solid ${NEON_CYAN}40`,
                  }}
                >
                  <RotateCcw size={12} />
                  REMIX
                </button>
              </div>

              {/* 입력 요약 디스크 / Input summary discs */}
              <div className="flex items-center justify-center gap-6 flex-wrap mb-6">
                <VinylRecord
                  isSpinning={isPlaying}
                  color={NEON_PINK}
                  label={selectedCountry?.nameKo ?? ''}
                  sublabel={`${input.age}세`}
                  size="md"
                />
                {/* 믹스 화살표 / Mix arrow */}
                <div className="flex flex-col items-center gap-1">
                  <Music size={20} style={{ color: NEON_PURPLE }} />
                  <span className="text-xs text-gray-500 font-mono">MIXED</span>
                  {/* 마스터 믹스 웨이브폼 / Master mix waveform */}
                  <Waveform
                    bars={Array.from({ length: 24 }, (_, i) =>
                      30 + Math.abs(Math.sin(i * 0.7) * 50)
                    )}
                    color={NEON_PURPLE}
                    isActive={isPlaying}
                  />
                </div>
                <VinylRecord
                  isSpinning={isPlaying}
                  color={NEON_CYAN}
                  label={goalOptions.find((g) => g.value === input.finalGoal)?.labelKo ?? ''}
                  sublabel={priorityOptions.find((p) => p.value === input.priorityPreference)?.labelKo ?? ''}
                  size="md"
                />
              </div>

              {/* 통계 바 / Stats bar */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '분석 경로 / Paths', value: mockDiagnosisResult.meta.totalPathwaysEvaluated, color: NEON_CYAN },
                  { label: '추천 경로 / Recommended', value: mockDiagnosisResult.pathways.length, color: NEON_GREEN },
                  { label: '필터 아웃 / Filtered Out', value: mockDiagnosisResult.meta.hardFilteredOut, color: NEON_PINK },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center p-3 rounded-xl"
                    style={{ background: `${color}10`, border: `1px solid ${color}30` }}
                  >
                    <span className="text-2xl font-bold font-mono" style={{ color }}>{value}</span>
                    <span className="text-xs text-gray-500 text-center leading-tight mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 트랙 리스트 — 추천 비자 경로 / Track list - recommended visa pathways */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <TrendingUp size={16} style={{ color: NEON_CYAN }} />
                <h3
                  className="text-sm font-bold tracking-wider"
                  style={{ color: NEON_CYAN }}
                >
                  RECOMMENDED TRACKS — 추천 비자 경로 ({mockPathways.length}개)
                </h3>
              </div>

              {mockPathways.map((pathway, index) => (
                <TrackCard
                  key={pathway.id}
                  pathway={pathway}
                  index={index}
                  isSelected={selectedPathwayId === pathway.id}
                  isPlaying={playingPathwayId === pathway.id}
                  onSelect={() => setSelectedPathwayId(pathway.id)}
                  onPlay={() => {
                    if (playingPathwayId === pathway.id) {
                      setPlayingPathwayId(null);
                      setIsPlaying(false);
                    } else {
                      setPlayingPathwayId(pathway.id);
                      setSelectedPathwayId(pathway.id);
                      setIsPlaying(true);
                    }
                  }}
                />
              ))}
            </div>

            {/* 푸터 CTA / Footer CTA */}
            <div
              className="rounded-2xl p-6 text-center space-y-4"
              style={{
                background: `linear-gradient(135deg, ${NEON_PINK}10, ${NEON_CYAN}10)`,
                border: `1px solid ${NEON_PINK}30`,
              }}
            >
              <Headphones size={32} style={{ color: NEON_PINK }} className="mx-auto" />
              <h3 className="text-lg font-bold" style={{ color: NEON_PINK }}>
                지금 바로 잡차자와 함께 비자 여정을 시작하세요
              </h3>
              <p className="text-sm text-gray-400">
                Start your visa journey with Jobchaja DJ Mix Analysis
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${NEON_PINK}, ${NEON_PURPLE})`,
                    color: '#fff',
                    boxShadow: `0 0 20px ${NEON_PINK}40`,
                  }}
                >
                  🎵 상세 플랜 보기 / View Full Plan
                </button>
                <button
                  className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                  style={{
                    background: '#111118',
                    color: NEON_CYAN,
                    border: `1px solid ${NEON_CYAN}40`,
                  }}
                >
                  📋 공고 보기 / View Jobs
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 하단 DJ 콘솔 바 (항상 표시) / Bottom DJ console bar (always visible) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 px-4 py-3"
        style={{
          background: 'linear-gradient(180deg, transparent, #050510 30%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          className="max-w-4xl mx-auto flex items-center justify-between px-4 py-2 rounded-xl"
          style={{
            background: '#0a0a14',
            border: `1px solid ${NEON_PINK}20`,
          }}
        >
          <div className="flex items-center gap-2">
            <Disc size={14} style={{ color: NEON_PINK }} className={isPlaying ? 'animate-spin' : ''} />
            <span className="text-xs text-gray-500 font-mono">JOBCHAJA DJ SYSTEM v2.0</span>
          </div>
          <div className="flex items-center gap-3">
            <LevelMeter level={isPlaying ? 65 : 0} />
            <span className="text-xs font-mono" style={{ color: NEON_CYAN }}>
              {isPlaying ? '▶ NOW MIXING...' : '⏸ READY'}
            </span>
          </div>
        </div>
      </div>

      {/* 하단 패딩 (콘솔 바 때문에) / Bottom padding for console bar */}
      <div className="h-16" />
    </div>
  );
}
