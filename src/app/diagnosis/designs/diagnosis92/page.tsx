'use client';

// KOR: 홀로그램 스타일 비자 진단 페이지 (#92)
// ENG: Hologram-style visa diagnosis page (#92)
// 컨셉: 홀로그램 프로젝터에서 비자 경로가 3D로 떠오르는 UI
// Concept: Visa pathways emerging as 3D projections from a holographic projector

import { useState, useEffect, useRef, useCallback } from 'react';
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
  Globe,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Layers,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Star,
  Eye,
  Activity,
  Cpu,
  Radio,
  Scan,
  Triangle,
  Circle,
  Square,
  Hexagon,
  Crosshair,
  Signal,
} from 'lucide-react';

// KOR: 단계별 입력 필드 정의
// ENG: Step-by-step input field definitions
const STEPS = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
] as const;

type StepKey = (typeof STEPS)[number];

// KOR: 홀로그램 파티클 데이터 타입
// ENG: Hologram particle data type
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  color: string;
}

// KOR: 홀로그램 색상 팔레트 — 다크 배경에 시안/틸 계열
// ENG: Hologram color palette — cyan/teal on dark background
const HOLO_COLORS = {
  primary: '#00f5ff',
  secondary: '#0ff',
  accent: '#00e5ff',
  dim: '#006688',
  glow: '#00ccff',
  grid: '#003344',
  bg: '#000a0f',
  panel: 'rgba(0,20,30,0.7)',
};

// KOR: 나이 선택 범위
// ENG: Age selection range
const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => i + 18);

export default function Diagnosis92Page() {
  // KOR: 현재 입력 단계 (0~5)
  // ENG: Current input step (0-5)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 결과 표시 여부
  // ENG: Whether to show results
  const [showResult, setShowResult] = useState<boolean>(false);

  // KOR: 진단 결과
  // ENG: Diagnosis result
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 선택된 경로 인덱스
  // ENG: Selected pathway index
  const [selectedPathwayIndex, setSelectedPathwayIndex] = useState<number>(0);

  // KOR: 분석 중 애니메이션 상태
  // ENG: Analyzing animation state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // KOR: 3D 회전 각도 (X, Y 축)
  // ENG: 3D rotation angle (X, Y axes)
  const [rotateX, setRotateX] = useState<number>(-10);
  const [rotateY, setRotateY] = useState<number>(0);

  // KOR: 파티클 상태
  // ENG: Particle state
  const [particles, setParticles] = useState<Particle[]>([]);

  // KOR: 스캔 라인 위치 (홀로그램 스캔 애니메이션)
  // ENG: Scan line position (hologram scan animation)
  const [scanY, setScanY] = useState<number>(0);

  // KOR: 마우스 드래그로 3D 회전 처리를 위한 ref
  // ENG: Ref for handling 3D rotation via mouse drag
  const isDragging = useRef<boolean>(false);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  // KOR: 파티클 초기화
  // ENG: Initialize particles
  useEffect(() => {
    const colors = [HOLO_COLORS.primary, HOLO_COLORS.secondary, HOLO_COLORS.glow, '#80ffff', '#40e0ff'];
    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.05,
      speedY: -Math.random() * 0.08 - 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  // KOR: 파티클 애니메이션 루프
  // ENG: Particle animation loop
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: ((p.x + p.speedX + 100) % 100),
          y: p.y + p.speedY < -2 ? 102 : p.y + p.speedY,
          opacity: Math.sin(Date.now() * 0.001 + p.id) * 0.3 + 0.5,
        }))
      );
      setScanY(prev => (prev + 0.3) % 100);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // KOR: 마우스 드래그로 3D 회전
  // ENG: 3D rotation via mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouseX.current;
    const dy = e.clientY - lastMouseY.current;
    setRotateY(prev => prev + dx * 0.3);
    setRotateX(prev => Math.max(-30, Math.min(10, prev + dy * 0.15)));
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // KOR: 자동 회전 (드래그 없을 때)
  // ENG: Auto-rotation (when not dragging)
  useEffect(() => {
    let frameId: number;
    const autoRotate = () => {
      if (!isDragging.current) {
        setRotateY(prev => prev + 0.15);
      }
      frameId = requestAnimationFrame(autoRotate);
    };
    frameId = requestAnimationFrame(autoRotate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // KOR: 현재 단계의 키
  // ENG: Key for current step
  const currentKey = STEPS[currentStep];

  // KOR: 입력값 설정 헬퍼
  // ENG: Helper to set input value
  const setField = (key: StepKey, value: string | number) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      runDiagnosis();
    }
  };

  // KOR: 이전 단계로 이동
  // ENG: Go back to previous step
  const goBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  // KOR: 진단 실행 (목업 데이터 사용)
  // ENG: Run diagnosis (using mock data)
  const runDiagnosis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2800);
  };

  // KOR: 처음으로 리셋
  // ENG: Reset to beginning
  const resetAll = () => {
    setCurrentStep(0);
    setInput({});
    setShowResult(false);
    setResult(null);
    setSelectedPathwayIndex(0);
    setIsAnalyzing(false);
  };

  // KOR: 현재 단계가 완료되었는지 확인
  // ENG: Check if current step is complete
  const isCurrentStepDone = (): boolean => {
    const val = input[currentKey];
    return val !== undefined && val !== '' && val !== null;
  };

  // KOR: 비자 체인 노드 색상 (순서에 따라)
  // ENG: Visa chain node color (by order)
  const getNodeColor = (index: number): string => {
    const colors = ['#00f5ff', '#80ffff', '#00ccaa', '#40e0ff', '#00aaff'];
    return colors[index % colors.length];
  };

  // KOR: 실현 가능성 점수에 따른 홀로그램 색상
  // ENG: Hologram color based on feasibility score
  const getHoloScoreColor = (score: number): string => {
    if (score >= 80) return '#00f5ff';
    if (score >= 60) return '#40e0a0';
    if (score >= 40) return '#e0c040';
    return '#e05040';
  };

  // ─────────────────────────────────────────────────────
  // KOR: 배경 — 홀로그램 그리드 + 파티클
  // ENG: Background — hologram grid + particles
  // ─────────────────────────────────────────────────────
  const HoloBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ background: '#000a0f', zIndex: 0 }}>
      {/* KOR: 그리드 라인 / ENG: Grid lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="holo-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#003344" strokeWidth="0.5" opacity="0.6" />
          </pattern>
          <pattern id="holo-grid-sm" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#002233" strokeWidth="0.3" opacity="0.4" />
          </pattern>
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#004466" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000a0f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#holo-grid-sm)" />
        <rect width="100%" height="100%" fill="url(#holo-grid)" />
        <rect width="100%" height="100%" fill="url(#center-glow)" />
      </svg>

      {/* KOR: 파티클 / ENG: Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}

      {/* KOR: 스캔 라인 / ENG: Scan line */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          top: `${scanY}%`,
          background: 'linear-gradient(90deg, transparent, #00f5ff55, #00f5ff, #00f5ff55, transparent)',
          boxShadow: '0 0 8px #00f5ff88',
        }}
      />

      {/* KOR: 원형 후광 / ENG: Circular halos */}
      <div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #00f5ff15',
          boxShadow: 'inset 0 0 80px #00f5ff08',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 900,
          height: 900,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #00f5ff0a',
        }}
      />
    </div>
  );

  // ─────────────────────────────────────────────────────
  // KOR: 헤더 컴포넌트
  // ENG: Header component
  // ─────────────────────────────────────────────────────
  const HoloHeader = () => (
    <div className="relative z-10 flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        {/* KOR: 홀로그램 로고 아이콘 / ENG: Hologram logo icon */}
        <div
          className="relative w-10 h-10 flex items-center justify-center rounded"
          style={{
            background: 'rgba(0,245,255,0.1)',
            border: '1px solid #00f5ff40',
            boxShadow: '0 0 20px #00f5ff30',
          }}
        >
          <Layers size={20} style={{ color: '#00f5ff' }} />
          <div
            className="absolute inset-0 rounded"
            style={{ boxShadow: 'inset 0 0 10px #00f5ff20' }}
          />
        </div>
        <div>
          <div className="text-xs font-mono" style={{ color: '#00f5ff80', letterSpacing: '0.2em' }}>
            JOBCHAJA HOLOGRAM
          </div>
          <div className="text-sm font-bold" style={{ color: '#00f5ff' }}>
            VISA PATH PROJECTOR
          </div>
        </div>
      </div>

      {/* KOR: 상태 표시기 / ENG: Status indicator */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00f5ff', boxShadow: '0 0 8px #00f5ff' }} />
        <span className="text-xs font-mono" style={{ color: '#00f5ff80' }}>
          SYS ONLINE
        </span>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // KOR: 진행 표시줄 (단계 인디케이터)
  // ENG: Progress bar (step indicator)
  // ─────────────────────────────────────────────────────
  const StepProgress = () => (
    <div className="relative z-10 flex items-center justify-center gap-2 py-3">
      {STEPS.map((step, idx) => {
        const done = idx < currentStep || (idx === currentStep && isCurrentStepDone());
        const active = idx === currentStep;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className="relative flex items-center justify-center"
              style={{
                width: active ? 32 : 24,
                height: active ? 32 : 24,
                borderRadius: '50%',
                border: `1px solid ${done || active ? '#00f5ff' : '#003344'}`,
                background: done ? '#00f5ff20' : active ? '#00f5ff10' : 'transparent',
                boxShadow: active ? '0 0 15px #00f5ff50' : done ? '0 0 8px #00f5ff30' : 'none',
                transition: 'all 0.3s',
              }}
            >
              <span
                className="text-xs font-mono font-bold"
                style={{ color: done || active ? '#00f5ff' : '#003366' }}
              >
                {idx + 1}
              </span>
              {active && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ background: '#00f5ff15' }}
                />
              )}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className="h-px w-6"
                style={{
                  background: idx < currentStep ? '#00f5ff60' : '#002233',
                  boxShadow: idx < currentStep ? '0 0 4px #00f5ff40' : 'none',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // ─────────────────────────────────────────────────────
  // KOR: 3D 홀로그램 선택 오브젝트 (회전하는 카드들)
  // ENG: 3D hologram selection objects (rotating cards)
  // ─────────────────────────────────────────────────────
  const HoloOrbit = ({ items, onSelect, selected }: {
    items: string[];
    onSelect: (val: string) => void;
    selected?: string;
  }) => {
    const count = items.length;
    const radius = Math.min(140, 30 + count * 18);

    return (
      <div
        ref={containerRef}
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{ height: 320, perspective: 800 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            width: radius * 2.5,
            height: radius * 2,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: isDragging.current ? 'none' : 'transform 0.05s linear',
            position: 'relative',
          }}
        >
          {items.map((item, idx) => {
            const angle = (idx / count) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = Math.sin(rad) * radius;
            const z = Math.cos(rad) * radius;
            const isSelected = selected === item;

            return (
              <div
                key={item}
                onClick={() => onSelect(item)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px)`,
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer',
                  width: 140,
                }}
              >
                <div
                  className="px-3 py-2 text-center text-xs font-mono rounded"
                  style={{
                    background: isSelected ? 'rgba(0,245,255,0.2)' : 'rgba(0,20,30,0.8)',
                    border: `1px solid ${isSelected ? '#00f5ff' : '#003344'}`,
                    color: isSelected ? '#00f5ff' : '#006688',
                    boxShadow: isSelected ? '0 0 20px #00f5ff50, inset 0 0 10px #00f5ff20' : '0 0 5px #001122',
                    backdropFilter: 'blur(4px)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.2s',
                  }}
                >
                  {item}
                </div>
              </div>
            );
          })}
        </div>

        {/* KOR: 중앙 홀로그램 원형 베이스 / ENG: Central hologram circular base */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: 20,
            width: radius * 2.2,
            height: 12,
            background: 'radial-gradient(ellipse, #00f5ff30, transparent)',
            border: '1px solid #00f5ff20',
            boxShadow: '0 0 20px #00f5ff20',
            filter: 'blur(2px)',
          }}
        />

        {/* KOR: 중앙 투영 포인트 / ENG: Central projection point */}
        <div
          className="absolute"
          style={{
            bottom: 26,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#00f5ff',
            boxShadow: '0 0 20px #00f5ff, 0 0 40px #00f5ff60',
          }}
        />
      </div>
    );
  };

  // ─────────────────────────────────────────────────────
  // KOR: 국적 선택 그리드 (3D 오브젝트 대신 플랫 그리드)
  // ENG: Nationality selection grid (flat grid)
  // ─────────────────────────────────────────────────────
  const NationalitySelector = () => (
    <div>
      <div
        className="grid grid-cols-3 gap-2 p-4 rounded-lg"
        style={{
          background: 'rgba(0,15,25,0.8)',
          border: '1px solid #003344',
          boxShadow: 'inset 0 0 30px #00f5ff08',
        }}
      >
        {popularCountries.map(country => {
          const sel = input.nationality === country.name;
          return (
            <button
              key={country.code}
              onClick={() => setField('nationality', country.name)}
              className="flex items-center gap-2 px-3 py-2 rounded text-left transition-all duration-200"
              style={{
                background: sel ? 'rgba(0,245,255,0.15)' : 'rgba(0,20,30,0.6)',
                border: `1px solid ${sel ? '#00f5ff' : '#002233'}`,
                boxShadow: sel ? '0 0 12px #00f5ff40, inset 0 0 8px #00f5ff10' : 'none',
                color: sel ? '#00f5ff' : '#004455',
              }}
            >
              <span className="text-lg shrink-0">{country.flag}</span>
              <span className="text-xs font-mono truncate">{country.name}</span>
            </button>
          );
        })}
      </div>
      {input.nationality && (
        <div className="mt-3 text-center text-xs font-mono" style={{ color: '#00f5ff80' }}>
          SELECTED: <span style={{ color: '#00f5ff' }}>{input.nationality}</span>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────
  // KOR: 나이 선택 슬라이더 (홀로그램 스타일)
  // ENG: Age selector slider (hologram style)
  // ─────────────────────────────────────────────────────
  const AgeSelector = () => {
    const age = (input.age as number) || 25;
    return (
      <div className="flex flex-col items-center gap-6">
        {/* KOR: 나이 디스플레이 / ENG: Age display */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 140,
            height: 140,
            border: '2px solid #00f5ff40',
            boxShadow: '0 0 40px #00f5ff30, inset 0 0 30px #00f5ff15',
            background: 'rgba(0,245,255,0.05)',
            position: 'relative',
          }}
        >
          <div className="text-center">
            <div
              className="text-5xl font-bold font-mono"
              style={{ color: '#00f5ff', textShadow: '0 0 20px #00f5ff' }}
            >
              {age}
            </div>
            <div className="text-xs font-mono mt-1" style={{ color: '#00f5ff60' }}>YEARS</div>
          </div>
          {/* KOR: 회전 장식 원 / ENG: Rotating decorative ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px dashed #00f5ff30',
              animation: 'spin 8s linear infinite',
            }}
          />
        </div>

        {/* KOR: 슬라이더 / ENG: Slider */}
        <div className="w-full px-4">
          <input
            type="range"
            min={18}
            max={60}
            value={age}
            onChange={e => setField('age', Number(e.target.value))}
            className="w-full"
            style={{
              appearance: 'none',
              height: 4,
              background: `linear-gradient(90deg, #00f5ff ${((age - 18) / 42) * 100}%, #002233 ${((age - 18) / 42) * 100}%)`,
              borderRadius: 2,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <div className="flex justify-between text-xs font-mono mt-2" style={{ color: '#003366' }}>
            <span>18</span>
            <span>60</span>
          </div>
        </div>

        {/* KOR: 빠른 선택 버튼 / ENG: Quick select buttons */}
        <div className="flex gap-3">
          {[20, 25, 30, 35, 40].map(a => (
            <button
              key={a}
              onClick={() => setField('age', a)}
              className="px-3 py-1 rounded text-xs font-mono transition-all duration-200"
              style={{
                background: age === a ? 'rgba(0,245,255,0.2)' : 'rgba(0,20,30,0.8)',
                border: `1px solid ${age === a ? '#00f5ff' : '#002233'}`,
                color: age === a ? '#00f5ff' : '#003355',
                boxShadow: age === a ? '0 0 10px #00f5ff40' : 'none',
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────
  // KOR: 분석 중 홀로그램 로딩 화면
  // ENG: Hologram loading screen during analysis
  // ─────────────────────────────────────────────────────
  const AnalyzingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 relative z-10">
      {/* KOR: 홀로그램 스캐너 애니메이션 / ENG: Hologram scanner animation */}
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
        {/* KOR: 외부 링들 / ENG: Outer rings */}
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 200 - i * 40,
              height: 200 - i * 40,
              border: `1px solid #00f5ff${30 + i * 20}`,
              animation: `spin ${3 + i}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
              boxShadow: `0 0 ${10 + i * 5}px #00f5ff${20 + i * 10}`,
            }}
          />
        ))}

        {/* KOR: 중앙 아이콘 / ENG: Center icon */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            background: 'rgba(0,245,255,0.1)',
            border: '2px solid #00f5ff',
            boxShadow: '0 0 30px #00f5ff, inset 0 0 20px #00f5ff20',
          }}
        >
          <Scan size={32} style={{ color: '#00f5ff' }} />
        </div>

        {/* KOR: 크로스헤어 라인 / ENG: Crosshair lines */}
        <div className="absolute w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #00f5ff50, transparent)' }} />
        <div className="absolute w-px h-full" style={{ background: 'linear-gradient(180deg, transparent, #00f5ff50, transparent)' }} />
      </div>

      <div className="text-center">
        <div
          className="text-2xl font-bold font-mono mb-2"
          style={{ color: '#00f5ff', textShadow: '0 0 20px #00f5ff' }}
        >
          ANALYZING VISA PATHS
        </div>
        <div className="text-sm font-mono" style={{ color: '#00f5ff60' }}>
          비자 경로를 홀로그램으로 투영하는 중...
        </div>
      </div>

      {/* KOR: 진행 바 / ENG: Progress bar */}
      <div
        className="w-64 h-1 rounded-full overflow-hidden"
        style={{ background: '#002233' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #00f5ff, #80ffff)',
            boxShadow: '0 0 8px #00f5ff',
            animation: 'progress 2.8s linear forwards',
            width: '0%',
          }}
        />
      </div>

      {/* KOR: 상태 메시지 / ENG: Status messages */}
      <div className="space-y-1 text-xs font-mono" style={{ color: '#00f5ff50' }}>
        <div>◈ 31개 비자 유형 스캔 중...</div>
        <div>◈ 14개 Evaluator 분석 중...</div>
        <div>◈ 경로 최적화 계산 중...</div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );

  // ─────────────────────────────────────────────────────
  // KOR: 결과 화면 — 홀로그램 경로 카드들
  // ENG: Result screen — hologram pathway cards
  // ─────────────────────────────────────────────────────
  const ResultScreen = () => {
    if (!result) return null;
    const pathway = result.pathways[selectedPathwayIndex];
    const scoreColor = getHoloScoreColor(pathway.feasibilityScore);

    return (
      <div className="relative z-10 px-4 pb-8 max-w-2xl mx-auto">
        {/* KOR: 결과 헤더 / ENG: Result header */}
        <div className="text-center mb-6">
          <div
            className="inline-block px-4 py-1 rounded-full text-xs font-mono mb-3"
            style={{
              background: 'rgba(0,245,255,0.1)',
              border: '1px solid #00f5ff40',
              color: '#00f5ff80',
            }}
          >
            HOLOGRAM PROJECTION COMPLETE
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: '#00f5ff', textShadow: '0 0 20px #00f5ff60' }}
          >
            {result.pathways.length}개 비자 경로 투영됨
          </div>
          <div className="text-sm mt-1" style={{ color: '#00aacc' }}>
            {result.userInput.nationality} • {result.userInput.educationLevel}
          </div>
        </div>

        {/* KOR: 경로 선택 탭 / ENG: Pathway selection tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {result.pathways.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setSelectedPathwayIndex(idx)}
              className="shrink-0 px-3 py-2 rounded text-xs font-mono transition-all duration-200"
              style={{
                background: idx === selectedPathwayIndex ? 'rgba(0,245,255,0.15)' : 'rgba(0,15,25,0.8)',
                border: `1px solid ${idx === selectedPathwayIndex ? '#00f5ff' : '#003344'}`,
                color: idx === selectedPathwayIndex ? '#00f5ff' : '#005566',
                boxShadow: idx === selectedPathwayIndex ? '0 0 15px #00f5ff40' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              PATH {idx + 1}
            </button>
          ))}
        </div>

        {/* KOR: 선택된 경로의 메인 카드 / ENG: Main card for selected pathway */}
        <div
          className="rounded-xl p-5 mb-4"
          style={{
            background: 'rgba(0,15,25,0.85)',
            border: `1px solid ${scoreColor}40`,
            boxShadow: `0 0 30px ${scoreColor}20, inset 0 0 20px ${scoreColor}08`,
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* KOR: 경로 이름 + 점수 / ENG: Pathway name + score */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div
                className="text-lg font-bold font-mono mb-1"
                style={{ color: scoreColor, textShadow: `0 0 10px ${scoreColor}` }}
              >
                {pathway.name}
              </div>
              <div className="text-xs" style={{ color: '#006688' }}>
                {pathway.description}
              </div>
            </div>
            <div className="text-right ml-4">
              <div
                className="text-3xl font-bold font-mono"
                style={{ color: scoreColor, textShadow: `0 0 15px ${scoreColor}` }}
              >
                {pathway.feasibilityScore}
              </div>
              <div className="text-xs font-mono" style={{ color: `${scoreColor}80` }}>
                {pathway.feasibilityLabel}
              </div>
            </div>
          </div>

          {/* KOR: 점수 바 / ENG: Score bar */}
          <div
            className="w-full h-1 rounded-full mb-4 overflow-hidden"
            style={{ background: '#002233' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${pathway.feasibilityScore}%`,
                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}80)`,
                boxShadow: `0 0 8px ${scoreColor}`,
              }}
            />
          </div>

          {/* KOR: 주요 지표 / ENG: Key metrics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { icon: Clock, label: '소요 기간', value: `${pathway.totalDurationMonths}개월` },
              { icon: DollarSign, label: '예상 비용', value: `$${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}` },
              { icon: Layers, label: '비자 단계', value: `${(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계` },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-lg p-3 text-center"
                style={{
                  background: 'rgba(0,245,255,0.05)',
                  border: '1px solid #003344',
                }}
              >
                <Icon size={14} style={{ color: '#00f5ff', margin: '0 auto 4px' }} />
                <div className="text-xs font-mono" style={{ color: '#004455' }}>{label}</div>
                <div className="text-sm font-bold font-mono" style={{ color: '#00ccff' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* KOR: 비자 체인 — 3D 노드 연결 / ENG: Visa chain — 3D node connection */}
          <div
            className="rounded-lg p-4 mb-4"
            style={{
              background: 'rgba(0,10,20,0.6)',
              border: '1px solid #002233',
            }}
          >
            <div className="text-xs font-mono mb-3" style={{ color: '#00f5ff60', letterSpacing: '0.15em' }}>
              VISA CHAIN
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, idx) => {
                const color = getNodeColor(idx);
                return (
                  <div key={idx} className="flex items-center gap-2 shrink-0">
                    <div
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="rounded px-3 py-2 text-center"
                        style={{
                          background: `rgba(0,245,255,0.08)`,
                          border: `1px solid ${color}60`,
                          boxShadow: `0 0 10px ${color}30`,
                          minWidth: 80,
                        }}
                      >
                        <div className="text-sm font-bold font-mono" style={{ color, textShadow: `0 0 8px ${color}` }}>
                          {vc.visa}
                        </div>
                        <div className="text-xs" style={{ color: `${color}80` }}>{vc.duration}</div>
                      </div>
                      {/* KOR: 수직 연결선 / ENG: Vertical connector */}
                      <div className="w-px h-4" style={{ background: `${color}40` }} />
                      <div
                        className="rounded-full"
                        style={{ width: 8, height: 8, background: color, boxShadow: `0 0 8px ${color}` }}
                      />
                    </div>
                    {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                      <ChevronRight size={14} style={{ color: '#004455' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* KOR: 마일스톤 / ENG: Milestones */}
          <div
            className="rounded-lg p-4"
            style={{
              background: 'rgba(0,10,20,0.6)',
              border: '1px solid #002233',
            }}
          >
            <div className="text-xs font-mono mb-3" style={{ color: '#00f5ff60', letterSpacing: '0.15em' }}>
              MILESTONES
            </div>
            <div className="space-y-3">
              {pathway.milestones.map((ms, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
                    style={{
                      background: 'rgba(0,245,255,0.08)',
                      border: '1px solid #003344',
                    }}
                  >
                    {ms.emoji}
                  </div>
                  <div>
                    <div className="text-sm font-mono font-bold" style={{ color: '#00ccff' }}>
                      {ms.title}
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#004455' }}>
                      {ms.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOR: 다시 진단하기 버튼 / ENG: Re-diagnose button */}
        <button
          onClick={resetAll}
          className="w-full py-3 rounded-lg font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
          style={{
            background: 'rgba(0,245,255,0.08)',
            border: '1px solid #00f5ff40',
            color: '#00f5ff',
            boxShadow: '0 0 15px #00f5ff20',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,245,255,0.15)';
            e.currentTarget.style.boxShadow = '0 0 25px #00f5ff40';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(0,245,255,0.08)';
            e.currentTarget.style.boxShadow = '0 0 15px #00f5ff20';
          }}
        >
          <RotateCcw size={14} />
          NEW PROJECTION
        </button>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────
  // KOR: 입력 단계 화면 렌더링
  // ENG: Input step screen rendering
  // ─────────────────────────────────────────────────────
  const renderInputStep = () => {
    const stepLabels: Record<StepKey, { ko: string; en: string }> = {
      nationality: { ko: '국적을 선택하세요', en: 'SELECT NATIONALITY' },
      age: { ko: '나이를 설정하세요', en: 'SET AGE' },
      educationLevel: { ko: '학력을 선택하세요', en: 'EDUCATION LEVEL' },
      availableAnnualFund: { ko: '연간 가용 자금을 선택하세요', en: 'ANNUAL FUND RANGE' },
      finalGoal: { ko: '최종 목표를 선택하세요', en: 'FINAL GOAL' },
      priorityPreference: { ko: '우선 조건을 선택하세요', en: 'PRIORITY PREFERENCE' },
    };

    const label = stepLabels[currentKey];

    return (
      <div className="relative z-10 flex flex-col items-center px-4 pb-8 max-w-xl mx-auto w-full">
        {/* KOR: 단계 타이틀 / ENG: Step title */}
        <div className="text-center mb-6">
          <div
            className="text-xs font-mono mb-1"
            style={{ color: '#00f5ff50', letterSpacing: '0.2em' }}
          >
            {label.en}
          </div>
          <div
            className="text-xl font-bold"
            style={{ color: '#00f5ff', textShadow: '0 0 15px #00f5ff50' }}
          >
            {label.ko}
          </div>
        </div>

        {/* KOR: 입력 컴포넌트 / ENG: Input component */}
        <div className="w-full mb-6">
          {currentKey === 'nationality' && <NationalitySelector />}
          {currentKey === 'age' && <AgeSelector />}

          {/* KOR: 리스트 선택 공통 (학력/자금/목표/우선순위) / ENG: Common list selection */}
          {(currentKey === 'educationLevel' || currentKey === 'availableAnnualFund' ||
            currentKey === 'finalGoal' || currentKey === 'priorityPreference') && (
            <div className="space-y-2">
              {(currentKey === 'educationLevel' ? educationOptions
                : currentKey === 'availableAnnualFund' ? fundOptions
                : currentKey === 'finalGoal' ? goalOptions
                : priorityOptions
              ).map(opt => {
                const sel = input[currentKey] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setField(currentKey, opt)}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between font-mono text-sm"
                    style={{
                      background: sel ? 'rgba(0,245,255,0.12)' : 'rgba(0,15,25,0.8)',
                      border: `1px solid ${sel ? '#00f5ff' : '#002233'}`,
                      color: sel ? '#00f5ff' : '#005566',
                      boxShadow: sel ? '0 0 15px #00f5ff30, inset 0 0 8px #00f5ff10' : 'none',
                    }}
                  >
                    <span>{opt}</span>
                    {sel && (
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: '#00f5ff', boxShadow: '0 0 8px #00f5ff' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* KOR: 내비게이션 버튼 / ENG: Navigation buttons */}
        <div className="flex gap-3 w-full">
          {currentStep > 0 && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-sm transition-all duration-200"
              style={{
                background: 'rgba(0,15,25,0.8)',
                border: '1px solid #003344',
                color: '#005566',
              }}
            >
              <ChevronLeft size={16} />
              BACK
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!isCurrentStepDone()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-mono font-bold text-sm transition-all duration-200"
            style={{
              background: isCurrentStepDone() ? 'rgba(0,245,255,0.12)' : 'rgba(0,15,25,0.5)',
              border: `1px solid ${isCurrentStepDone() ? '#00f5ff' : '#002233'}`,
              color: isCurrentStepDone() ? '#00f5ff' : '#003344',
              boxShadow: isCurrentStepDone() ? '0 0 20px #00f5ff30' : 'none',
              cursor: isCurrentStepDone() ? 'pointer' : 'not-allowed',
            }}
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                <Zap size={16} />
                LAUNCH DIAGNOSIS
              </>
            ) : (
              <>
                NEXT
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────
  // KOR: 메인 렌더
  // ENG: Main render
  // ─────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#000a0f', fontFamily: 'monospace' }}
    >
      {/* KOR: 홀로그램 배경 / ENG: Hologram background */}
      <HoloBackground />

      {/* KOR: 헤더 / ENG: Header */}
      <HoloHeader />

      {/* KOR: 디자인 배지 / ENG: Design badge */}
      <div className="relative z-10 flex justify-center mb-2">
        <div
          className="px-3 py-1 rounded-full text-xs font-mono"
          style={{
            background: 'rgba(0,245,255,0.08)',
            border: '1px solid #00f5ff30',
            color: '#00f5ff50',
          }}
        >
          #92 HOLOGRAM DESIGN
        </div>
      </div>

      {/* KOR: 메인 콘텐츠 분기 / ENG: Main content branching */}
      {isAnalyzing ? (
        <AnalyzingScreen />
      ) : showResult ? (
        <>
          <div className="relative z-10 flex justify-center mb-4">
            <button
              onClick={resetAll}
              className="flex items-center gap-2 px-3 py-1 rounded text-xs font-mono transition-all duration-200"
              style={{
                background: 'rgba(0,15,25,0.8)',
                border: '1px solid #003344',
                color: '#005566',
              }}
            >
              <RotateCcw size={12} />
              RESET
            </button>
          </div>
          <ResultScreen />
        </>
      ) : (
        <>
          <StepProgress />
          {renderInputStep()}
        </>
      )}

      {/* KOR: 슬라이더 스타일 커스터마이징 / ENG: Custom slider styles */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00f5ff;
          box-shadow: 0 0 12px #00f5ff, 0 0 24px #00f5ff60;
          cursor: pointer;
          border: 2px solid #000a0f;
        }
        input[type=range]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00f5ff;
          box-shadow: 0 0 12px #00f5ff;
          cursor: pointer;
          border: 2px solid #000a0f;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
