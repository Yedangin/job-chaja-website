'use client';

// 우주 탐사 테마 비자 진단 페이지 / Space Explorer theme visa diagnosis page
// 우주선을 조종하며 행성(단계)을 방문하는 SF 진단 / SF diagnosis navigating spaceship to visit planets (steps)

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
  Rocket,
  Globe,
  Star,
  Zap,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Map,
  Navigation,
  Satellite,
  Radio,
  Telescope,
  Target,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

// 별 파티클 데이터 타입 / Star particle data type
interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animDuration: number;
  animDelay: number;
}

// 단계 정보 타입 / Step info type
interface PlanetStep {
  id: number;
  nameKo: string;
  nameEn: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  orbitRadius: number;
}

// 진단 입력 단계 목록 / Diagnosis input step list
const PLANETS: PlanetStep[] = [
  {
    id: 1,
    nameKo: '출발 행성',
    nameEn: 'Origin Planet',
    icon: <Globe size={20} />,
    color: '#22d3ee',
    glowColor: 'rgba(34,211,238,0.4)',
    orbitRadius: 80,
  },
  {
    id: 2,
    nameKo: '나이 성운',
    nameEn: 'Age Nebula',
    icon: <Star size={20} />,
    color: '#818cf8',
    glowColor: 'rgba(129,140,248,0.4)',
    orbitRadius: 80,
  },
  {
    id: 3,
    nameKo: '학력 항성',
    nameEn: 'Education Star',
    icon: <Telescope size={20} />,
    color: '#34d399',
    glowColor: 'rgba(52,211,153,0.4)',
    orbitRadius: 80,
  },
  {
    id: 4,
    nameKo: '연료 행성',
    nameEn: 'Fuel Planet',
    icon: <Zap size={20} />,
    color: '#fbbf24',
    glowColor: 'rgba(251,191,36,0.4)',
    orbitRadius: 80,
  },
  {
    id: 5,
    nameKo: '목표 항성계',
    nameEn: 'Goal System',
    icon: <Target size={20} />,
    color: '#f87171',
    glowColor: 'rgba(248,113,113,0.4)',
    orbitRadius: 80,
  },
  {
    id: 6,
    nameKo: '우선순위 위성',
    nameEn: 'Priority Moon',
    icon: <Satellite size={20} />,
    color: '#e879f9',
    glowColor: 'rgba(232,121,249,0.4)',
    orbitRadius: 80,
  },
];

// 별 배경 생성 / Generate star background
function generateStars(count: number): StarParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.2,
    animDuration: Math.random() * 3 + 2,
    animDelay: Math.random() * 5,
  }));
}

// 탐사 보고서 점수 색상 / Exploration report score color (neon)
function getNeonScoreColor(score: number): string {
  if (score >= 51) return '#00ffd5';
  if (score >= 31) return '#818cf8';
  if (score >= 11) return '#fbbf24';
  return '#f87171';
}

// 비자 체인 색상 / Visa chain color
function getVisaChipColor(code: string): string {
  if (code.startsWith('E-7')) return '#22d3ee';
  if (code.startsWith('E-9')) return '#34d399';
  if (code.startsWith('D-4')) return '#818cf8';
  if (code.startsWith('D-2')) return '#a78bfa';
  if (code.startsWith('D-10')) return '#fbbf24';
  if (code.startsWith('F-')) return '#f87171';
  return '#94a3b8';
}

export default function SpaceExplorerDiagnosis() {
  // 현재 단계 / Current step (0 = intro, 1-6 = input, 7 = result)
  const [step, setStep] = useState(0);

  // 진단 입력 상태 / Diagnosis input state
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });

  // 나이 입력 텍스트 / Age input text
  const [ageText, setAgeText] = useState('24');

  // 결과 보기 상태 / Result display state
  const [showResult, setShowResult] = useState(false);

  // 선택된 경로 인덱스 / Selected pathway index
  const [selectedPathway, setSelectedPathway] = useState<number>(0);

  // 우주선 이동 애니메이션 / Spaceship movement animation
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 별 파티클 / Star particles
  const [stars] = useState<StarParticle[]>(() => generateStars(180));

  // 네비게이션 별 (더 큰 반짝이 별) / Navigation stars (larger twinkling)
  const [navStars] = useState<StarParticle[]>(() => generateStars(30));

  // 결과 데이터 / Result data
  const result: DiagnosisResult = mockDiagnosisResult;

  // 단계 이동 핸들러 / Step navigation handler
  function goToStep(nextStep: number) {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
    }, 400);
  }

  // 다음 단계 / Next step
  function handleNext() {
    if (step < 6) {
      goToStep(step + 1);
    } else {
      // 마지막 단계 후 결과 표시 / Show result after last step
      setIsTransitioning(true);
      setTimeout(() => {
        setShowResult(true);
        setIsTransitioning(false);
      }, 600);
    }
  }

  // 이전 단계 / Previous step
  function handleBack() {
    if (step > 1) {
      goToStep(step - 1);
    } else {
      goToStep(0);
    }
  }

  // 진단 시작 / Start diagnosis
  function handleStart() {
    goToStep(1);
  }

  // 재진단 / Re-diagnose
  function handleReset() {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowResult(false);
      setStep(0);
      setInput({ ...mockInput });
      setAgeText('24');
      setSelectedPathway(0);
      setIsTransitioning(false);
    }, 400);
  }

  // 현재 단계가 유효한지 / Check if current step is valid
  function isStepValid(): boolean {
    switch (step) {
      case 1: return !!input.nationality;
      case 2: return input.age >= 18 && input.age <= 60;
      case 3: return !!input.educationLevel;
      case 4: return input.availableAnnualFund >= 0;
      case 5: return !!input.finalGoal;
      case 6: return !!input.priorityPreference;
      default: return true;
    }
  }

  const currentPlanet = step >= 1 && step <= 6 ? PLANETS[step - 1] : null;

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, #0a0e1a 0%, #050810 40%, #000308 100%)' }}
    >
      {/* ── 별 배경 파티클 / Star background particles ── */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: '#ffffff',
              opacity: star.opacity,
              animation: `twinkle ${star.animDuration}s ${star.animDelay}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── 네온 성운 글로우 / Neon nebula glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: '600px',
            height: '600px',
            top: '-200px',
            right: '-100px',
            background: 'radial-gradient(circle, rgba(0,255,213,0.04) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '500px',
            height: '500px',
            bottom: '-150px',
            left: '-50px',
            background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* ── CSS 애니메이션 / CSS animations ── */}
      <style>{`
        @keyframes twinkle {
          from { opacity: 0.1; transform: scale(0.8); }
          to { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(70px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(70px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(120deg) translateX(90px) rotate(-120deg); }
          to { transform: rotate(480deg) translateX(90px) rotate(-480deg); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.15; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 8px 2px rgba(0,255,213,0.3); }
          50% { box-shadow: 0 0 20px 6px rgba(0,255,213,0.6); }
        }
        @keyframes rocketTrail {
          0% { opacity: 0.8; scaleX: 1; }
          100% { opacity: 0; scaleX: 0; }
        }
        .step-card {
          animation: fadeSlideIn 0.5s ease-out forwards;
        }
        .transitioning { opacity: 0; transform: translateY(-15px); transition: all 0.4s ease; }
        .planet-glow {
          animation: pulseGlow 2.5s ease-in-out infinite;
        }
        .spaceship-float {
          animation: float 3s ease-in-out infinite;
        }
        .orbit-dot-1 { animation: orbit 6s linear infinite; }
        .orbit-dot-2 { animation: orbit2 10s linear infinite; }
        .orbit-dot-3 { animation: orbit3 8s linear infinite; }
      `}</style>

      {/* ── 메인 컨텐츠 / Main content ── */}
      <div
        className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10 ${isTransitioning ? 'transitioning' : ''}`}
      >

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* 인트로 화면 / Intro screen */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {step === 0 && !showResult && (
          <div className="step-card w-full max-w-lg text-center">
            {/* 우주선 아이콘 / Spaceship icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* 궤도 링 / Orbit rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="rounded-full border"
                    style={{ width: '180px', height: '180px', borderColor: 'rgba(0,255,213,0.15)' }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="rounded-full border"
                    style={{ width: '240px', height: '240px', borderColor: 'rgba(129,140,248,0.1)' }}
                  />
                </div>
                {/* 궤도 점들 / Orbit dots */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-0 h-0">
                    <div
                      className="orbit-dot-1 absolute rounded-full"
                      style={{ width: '8px', height: '8px', background: '#22d3ee', marginTop: '-4px', marginLeft: '-4px' }}
                    />
                    <div
                      className="orbit-dot-2 absolute rounded-full"
                      style={{ width: '6px', height: '6px', background: '#818cf8', marginTop: '-3px', marginLeft: '-3px' }}
                    />
                    <div
                      className="orbit-dot-3 absolute rounded-full"
                      style={{ width: '7px', height: '7px', background: '#fbbf24', marginTop: '-3.5px', marginLeft: '-3.5px' }}
                    />
                  </div>
                </div>
                {/* 중앙 우주선 / Center spaceship */}
                <div
                  className="spaceship-float relative z-10 flex items-center justify-center rounded-full"
                  style={{
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, #0d1f3a 0%, #060e1c 100%)',
                    border: '2px solid rgba(0,255,213,0.4)',
                    boxShadow: '0 0 30px rgba(0,255,213,0.25), inset 0 0 20px rgba(0,255,213,0.05)',
                  }}
                >
                  <Rocket size={52} color="#00ffd5" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* 타이틀 / Title */}
            <h1
              className="text-4xl font-black tracking-widest mb-2"
              style={{
                background: 'linear-gradient(135deg, #00ffd5 0%, #818cf8 50%, #e879f9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
              }}
            >
              SPACE EXPLORER
            </h1>
            <p className="text-cyan-400 text-sm tracking-widest mb-1 font-mono">한국 비자 탐사 항법 시스템</p>
            <p className="text-slate-500 text-xs tracking-wider mb-8 font-mono">KOREA VISA NAVIGATION SYSTEM v2.0</p>

            {/* 설명 / Description */}
            <div
              className="rounded-xl p-5 mb-8 text-left"
              style={{ background: 'rgba(0,255,213,0.04)', border: '1px solid rgba(0,255,213,0.12)' }}
            >
              <div className="flex items-start gap-3">
                <Radio size={18} color="#00ffd5" className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-cyan-300 text-sm font-semibold mb-1">탐사 브리핑 / Mission Briefing</p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    우주선을 조종하여 6개 행성을 탐사하세요. 각 행성에서 수집한 정보를 토대로 <span className="text-cyan-400">최적의 한국 비자 경로</span>를 계산합니다.
                    AI 항법 시스템이 31개 비자를 분석하여 당신만의 탐사 보고서를 생성합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 행성 미리보기 / Planet preview */}
            <div className="grid grid-cols-6 gap-2 mb-8">
              {PLANETS.map((planet) => (
                <div key={planet.id} className="flex flex-col items-center gap-1">
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: '36px',
                      height: '36px',
                      background: `radial-gradient(circle, ${planet.color}22 0%, transparent 70%)`,
                      border: `1px solid ${planet.color}44`,
                    }}
                  >
                    <div style={{ color: planet.color, transform: 'scale(0.75)' }}>{planet.icon}</div>
                  </div>
                  <span className="text-slate-600 text-xs font-mono">{`P${planet.id}`}</span>
                </div>
              ))}
            </div>

            {/* 발사 버튼 / Launch button */}
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-xl font-bold text-base tracking-widest transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #00ffd5 0%, #22d3ee 100%)',
                color: '#050810',
                boxShadow: '0 0 30px rgba(0,255,213,0.4)',
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <Rocket size={18} />
                탐사 시작 LAUNCH MISSION
              </span>
            </button>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* 입력 단계 화면 / Input step screens */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {step >= 1 && step <= 6 && !showResult && currentPlanet && (
          <div className="step-card w-full max-w-lg">
            {/* 상단 진행바 / Top progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs font-mono">MISSION PROGRESS</span>
                <span style={{ color: currentPlanet.color }} className="text-xs font-mono font-bold">
                  {`PLANET ${step} / 6`}
                </span>
              </div>
              <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: '4px', background: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(step / 6) * 100}%`,
                    background: `linear-gradient(90deg, ${currentPlanet.color} 0%, #e879f9 100%)`,
                    boxShadow: `0 0 8px ${currentPlanet.glowColor}`,
                  }}
                />
              </div>
              {/* 행성 표시기 / Planet indicators */}
              <div className="flex justify-between mt-2">
                {PLANETS.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: '10px',
                      height: '10px',
                      background: step >= p.id ? p.color : 'rgba(255,255,255,0.08)',
                      boxShadow: step === p.id ? `0 0 8px ${p.glowColor}` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 행성 헤더 / Planet header */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                background: `radial-gradient(ellipse at top left, ${currentPlanet.color}10 0%, rgba(5,8,16,0.9) 60%)`,
                border: `1px solid ${currentPlanet.color}30`,
              }}
            >
              <div className="flex items-center gap-4">
                {/* 행성 아이콘 / Planet icon */}
                <div
                  className="planet-glow rounded-full flex items-center justify-center shrink-0"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: `radial-gradient(circle, ${currentPlanet.color}20 0%, transparent 70%)`,
                    border: `2px solid ${currentPlanet.color}50`,
                    boxShadow: `0 0 20px ${currentPlanet.glowColor}`,
                    color: currentPlanet.color,
                  }}
                >
                  <div style={{ transform: 'scale(1.3)' }}>{currentPlanet.icon}</div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-mono tracking-widest">{`PLANET-0${step}`}</p>
                  <h2
                    className="text-xl font-black tracking-wide"
                    style={{ color: currentPlanet.color }}
                  >
                    {currentPlanet.nameKo}
                  </h2>
                  <p className="text-slate-500 text-xs font-mono">{currentPlanet.nameEn}</p>
                </div>
              </div>
            </div>

            {/* 단계별 입력 / Per-step input */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Step 1: 국적 / Nationality */}
              {step === 1 && (
                <div>
                  <p className="text-slate-300 text-sm font-semibold mb-1">출발 행성 선택</p>
                  <p className="text-slate-500 text-xs mb-4 font-mono">SELECT YOUR HOME PLANET (NATIONALITY)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {popularCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => setInput((prev) => ({ ...prev, nationality: country.code }))}
                        className="rounded-xl py-3 px-2 flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background:
                            input.nationality === country.code
                              ? `${currentPlanet.color}20`
                              : 'rgba(255,255,255,0.04)',
                          border:
                            input.nationality === country.code
                              ? `2px solid ${currentPlanet.color}`
                              : '2px solid rgba(255,255,255,0.08)',
                          boxShadow:
                            input.nationality === country.code
                              ? `0 0 12px ${currentPlanet.glowColor}`
                              : 'none',
                        }}
                      >
                        <span className="text-2xl">{country.flag}</span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: input.nationality === country.code ? currentPlanet.color : '#94a3b8' }}
                        >
                          {country.nameKo}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: 나이 / Age */}
              {step === 2 && (
                <div>
                  <p className="text-slate-300 text-sm font-semibold mb-1">우주인 나이 입력</p>
                  <p className="text-slate-500 text-xs mb-6 font-mono">ENTER ASTRONAUT AGE (18-60)</p>
                  <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: '130px',
                          height: '130px',
                          background: `radial-gradient(circle, ${currentPlanet.color}15 0%, transparent 70%)`,
                          border: `2px solid ${currentPlanet.color}40`,
                          boxShadow: `0 0 25px ${currentPlanet.glowColor}`,
                        }}
                      >
                        <span
                          className="text-5xl font-black font-mono"
                          style={{ color: currentPlanet.color }}
                        >
                          {ageText || '--'}
                        </span>
                      </div>
                      <span
                        className="absolute bottom-2 right-2 text-xs font-mono"
                        style={{ color: `${currentPlanet.color}80` }}
                      >
                        세
                      </span>
                    </div>
                    {/* 나이 슬라이더 / Age slider */}
                    <div className="w-full">
                      <input
                        type="range"
                        min="18"
                        max="60"
                        value={input.age}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setInput((prev) => ({ ...prev, age: val }));
                          setAgeText(String(val));
                        }}
                        className="w-full"
                        style={{ accentColor: currentPlanet.color, cursor: 'pointer' }}
                      />
                      <div className="flex justify-between text-slate-600 text-xs font-mono mt-1">
                        <span>18</span>
                        <span>39</span>
                        <span>60</span>
                      </div>
                    </div>
                    {/* 직접 입력 / Direct input */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-mono">DIRECT INPUT:</span>
                      <input
                        type="number"
                        min="18"
                        max="60"
                        value={ageText}
                        onChange={(e) => {
                          setAgeText(e.target.value);
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 18 && val <= 60) {
                            setInput((prev) => ({ ...prev, age: val }));
                          }
                        }}
                        className="rounded-lg px-3 py-1 text-center font-mono font-bold text-sm w-20"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: `1px solid ${currentPlanet.color}40`,
                          color: currentPlanet.color,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: 학력 / Education */}
              {step === 3 && (
                <div>
                  <p className="text-slate-300 text-sm font-semibold mb-1">항성 등급 (학력)</p>
                  <p className="text-slate-500 text-xs mb-4 font-mono">STELLAR CLASS (EDUCATION LEVEL)</p>
                  <div className="flex flex-col gap-2">
                    {educationOptions.map((edu) => (
                      <button
                        key={edu.value}
                        onClick={() => setInput((prev) => ({ ...prev, educationLevel: edu.value }))}
                        className="rounded-xl py-3 px-4 flex items-center justify-between transition-all duration-200 hover:scale-[1.01] active:scale-95"
                        style={{
                          background:
                            input.educationLevel === edu.value
                              ? `${currentPlanet.color}15`
                              : 'rgba(255,255,255,0.04)',
                          border:
                            input.educationLevel === edu.value
                              ? `2px solid ${currentPlanet.color}`
                              : '2px solid rgba(255,255,255,0.08)',
                          boxShadow:
                            input.educationLevel === edu.value
                              ? `0 0 10px ${currentPlanet.glowColor}`
                              : 'none',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{edu.emoji}</span>
                          <div className="text-left">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: input.educationLevel === edu.value ? currentPlanet.color : '#e2e8f0' }}
                            >
                              {edu.labelKo}
                            </p>
                            <p className="text-slate-600 text-xs font-mono">{edu.labelEn}</p>
                          </div>
                        </div>
                        {input.educationLevel === edu.value && (
                          <CheckCircle size={16} style={{ color: currentPlanet.color }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: 자금 / Fund */}
              {step === 4 && (
                <div>
                  <p className="text-slate-300 text-sm font-semibold mb-1">연료 탑재량 (연간 예산)</p>
                  <p className="text-slate-500 text-xs mb-4 font-mono">FUEL CAPACITY (ANNUAL BUDGET)</p>
                  <div className="flex flex-col gap-2">
                    {fundOptions.map((fund) => (
                      <button
                        key={fund.value}
                        onClick={() => setInput((prev) => ({ ...prev, availableAnnualFund: fund.value }))}
                        className="rounded-xl py-3 px-4 flex items-center justify-between transition-all duration-200 hover:scale-[1.01] active:scale-95"
                        style={{
                          background:
                            input.availableAnnualFund === fund.value
                              ? `${currentPlanet.color}15`
                              : 'rgba(255,255,255,0.04)',
                          border:
                            input.availableAnnualFund === fund.value
                              ? `2px solid ${currentPlanet.color}`
                              : '2px solid rgba(255,255,255,0.08)',
                          boxShadow:
                            input.availableAnnualFund === fund.value
                              ? `0 0 10px ${currentPlanet.glowColor}`
                              : 'none',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <DollarSign
                            size={16}
                            style={{ color: input.availableAnnualFund === fund.value ? currentPlanet.color : '#64748b' }}
                          />
                          <div className="text-left">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: input.availableAnnualFund === fund.value ? currentPlanet.color : '#e2e8f0' }}
                            >
                              {fund.labelKo}
                            </p>
                            <p className="text-slate-600 text-xs font-mono">{fund.labelEn}</p>
                          </div>
                        </div>
                        {input.availableAnnualFund === fund.value && (
                          <CheckCircle size={16} style={{ color: currentPlanet.color }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: 목표 / Goal */}
              {step === 5 && (
                <div>
                  <p className="text-slate-300 text-sm font-semibold mb-1">목표 항성계 설정</p>
                  <p className="text-slate-500 text-xs mb-4 font-mono">SET TARGET STAR SYSTEM (FINAL GOAL)</p>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal.value}
                        onClick={() => setInput((prev) => ({ ...prev, finalGoal: goal.value }))}
                        className="rounded-xl py-4 px-3 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background:
                            input.finalGoal === goal.value
                              ? `${currentPlanet.color}18`
                              : 'rgba(255,255,255,0.04)',
                          border:
                            input.finalGoal === goal.value
                              ? `2px solid ${currentPlanet.color}`
                              : '2px solid rgba(255,255,255,0.08)',
                          boxShadow:
                            input.finalGoal === goal.value
                              ? `0 0 14px ${currentPlanet.glowColor}`
                              : 'none',
                        }}
                      >
                        <span className="text-3xl">{goal.emoji}</span>
                        <p
                          className="text-sm font-bold"
                          style={{ color: input.finalGoal === goal.value ? currentPlanet.color : '#e2e8f0' }}
                        >
                          {goal.labelKo}
                        </p>
                        <p className="text-slate-600 text-xs text-center">{goal.descKo}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: 우선순위 / Priority */}
              {step === 6 && (
                <div>
                  <p className="text-slate-300 text-sm font-semibold mb-1">항법 우선순위 위성 선택</p>
                  <p className="text-slate-500 text-xs mb-4 font-mono">SELECT NAVIGATION PRIORITY SATELLITE</p>
                  <div className="grid grid-cols-2 gap-3">
                    {priorityOptions.map((priority) => (
                      <button
                        key={priority.value}
                        onClick={() => setInput((prev) => ({ ...prev, priorityPreference: priority.value }))}
                        className="rounded-xl py-4 px-3 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background:
                            input.priorityPreference === priority.value
                              ? `${currentPlanet.color}18`
                              : 'rgba(255,255,255,0.04)',
                          border:
                            input.priorityPreference === priority.value
                              ? `2px solid ${currentPlanet.color}`
                              : '2px solid rgba(255,255,255,0.08)',
                          boxShadow:
                            input.priorityPreference === priority.value
                              ? `0 0 14px ${currentPlanet.glowColor}`
                              : 'none',
                        }}
                      >
                        <span className="text-3xl">{priority.emoji}</span>
                        <p
                          className="text-sm font-bold"
                          style={{ color: input.priorityPreference === priority.value ? currentPlanet.color : '#e2e8f0' }}
                        >
                          {priority.labelKo}
                        </p>
                        <p className="text-slate-600 text-xs text-center">{priority.descKo}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 네비게이션 버튼 / Navigation buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                }}
              >
                <ChevronLeft size={16} />
                이전 행성
              </button>
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-[2] py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                style={{
                  background: isStepValid()
                    ? `linear-gradient(135deg, ${currentPlanet.color} 0%, #e879f9 100%)`
                    : 'rgba(255,255,255,0.08)',
                  color: isStepValid() ? '#050810' : '#64748b',
                  boxShadow: isStepValid() ? `0 0 20px ${currentPlanet.glowColor}` : 'none',
                }}
              >
                {step < 6 ? (
                  <>
                    다음 행성 탐사
                    <ChevronRight size={16} />
                  </>
                ) : (
                  <>
                    <Rocket size={16} />
                    탐사 보고서 생성
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* 결과 화면 / Result screen */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {showResult && (
          <div className="step-card w-full max-w-2xl">
            {/* 탐사 보고서 헤더 / Exploration report header */}
            <div
              className="rounded-2xl p-5 mb-5 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,213,0.08) 0%, rgba(129,140,248,0.06) 100%)',
                border: '1px solid rgba(0,255,213,0.2)',
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Map size={18} color="#00ffd5" />
                <span className="text-cyan-400 text-xs font-mono tracking-widest">EXPLORATION REPORT</span>
              </div>
              <h2
                className="text-2xl font-black tracking-wider mb-1"
                style={{
                  background: 'linear-gradient(135deg, #00ffd5 0%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                탐사 완료 보고서
              </h2>
              <p className="text-slate-500 text-xs font-mono">
                {result.meta.totalPathwaysEvaluated}개 경로 분석 완료 •{' '}
                {result.meta.hardFilteredOut}개 부적합 제외 •{' '}
                {result.pathways.length}개 추천 경로
              </p>
            </div>

            {/* 경로 탭 / Pathway tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {mockPathways.map((pathway, idx) => (
                <button
                  key={pathway.pathwayId}
                  onClick={() => setSelectedPathway(idx)}
                  className="shrink-0 rounded-xl px-4 py-2 text-xs font-semibold font-mono transition-all duration-200"
                  style={{
                    background:
                      selectedPathway === idx
                        ? 'rgba(0,255,213,0.15)'
                        : 'rgba(255,255,255,0.04)',
                    border:
                      selectedPathway === idx
                        ? '2px solid #00ffd5'
                        : '2px solid rgba(255,255,255,0.08)',
                    color: selectedPathway === idx ? '#00ffd5' : '#64748b',
                    boxShadow: selectedPathway === idx ? '0 0 10px rgba(0,255,213,0.25)' : 'none',
                  }}
                >
                  {`ROUTE-${idx + 1}`}
                </button>
              ))}
            </div>

            {/* 선택된 경로 상세 / Selected pathway detail */}
            {mockPathways[selectedPathway] && (() => {
              const pw = mockPathways[selectedPathway];
              const rawPw = result.pathways[selectedPathway];
              const scoreCol = getNeonScoreColor(pw.finalScore);

              return (
                <div
                  className="rounded-2xl overflow-hidden mb-5"
                  style={{ border: '1px solid rgba(0,255,213,0.12)' }}
                >
                  {/* 경로 헤더 / Pathway header */}
                  <div
                    className="p-5"
                    style={{ background: 'rgba(0,255,213,0.05)' }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-slate-500 text-xs font-mono mb-1">{pw.pathwayId}</p>
                        <h3 className="text-white font-black text-lg leading-tight">{pw.nameKo}</h3>
                        <p className="text-slate-500 text-xs font-mono">{pw.nameEn}</p>
                      </div>
                      {/* 점수 원 / Score circle */}
                      <div
                        className="shrink-0 rounded-full flex flex-col items-center justify-center"
                        style={{
                          width: '70px',
                          height: '70px',
                          background: `radial-gradient(circle, ${scoreCol}15 0%, transparent 70%)`,
                          border: `2px solid ${scoreCol}60`,
                          boxShadow: `0 0 16px ${scoreCol}30`,
                        }}
                      >
                        <span className="font-black text-xl leading-none" style={{ color: scoreCol }}>
                          {pw.finalScore}
                        </span>
                        <span className="text-slate-500 text-xs font-mono">점</span>
                      </div>
                    </div>

                    {/* 가능성 + 주요 지표 / Feasibility + key metrics */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className="rounded-lg px-3 py-1 text-xs font-bold font-mono"
                        style={{ background: `${scoreCol}20`, color: scoreCol, border: `1px solid ${scoreCol}40` }}
                      >
                        {getFeasibilityEmoji(pw.feasibilityLabel)} {pw.feasibilityLabel}
                      </span>
                      <span
                        className="rounded-lg px-3 py-1 text-xs font-mono flex items-center gap-1"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <Clock size={11} />
                        {pw.estimatedMonths}개월
                      </span>
                      <span
                        className="rounded-lg px-3 py-1 text-xs font-mono flex items-center gap-1"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <DollarSign size={11} />
                        {pw.estimatedCostWon === 0 ? '무료' : `${pw.estimatedCostWon.toLocaleString()}만원`}
                      </span>
                    </div>

                    {/* 비자 체인 / Visa chain (항성 경로) */}
                    <div>
                      <p className="text-slate-600 text-xs font-mono mb-2">STELLAR PATH (VISA CHAIN)</p>
                      <div className="flex flex-wrap items-center gap-1">
                        {(Array.isArray(pw.visaChain) ? pw.visaChain : []).map((visa, i) => (
                          <React.Fragment key={i}>
                            <span
                              className="rounded-lg px-3 py-1 text-xs font-bold font-mono"
                              style={{
                                background: `${getVisaChipColor(visa.code)}15`,
                                color: getVisaChipColor(visa.code),
                                border: `1px solid ${getVisaChipColor(visa.code)}40`,
                              }}
                            >
                              {visa.code}
                            </span>
                            {i < (Array.isArray(pw.visaChain) ? pw.visaChain : []).length - 1 && (
                              <ArrowRight size={12} color="#334155" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 마일스톤 / Milestones */}
                  <div className="p-5" style={{ background: 'rgba(5,8,16,0.6)' }}>
                    <p className="text-slate-500 text-xs font-mono mb-3 flex items-center gap-2">
                      <Navigation size={12} />
                      MISSION WAYPOINTS (MILESTONES)
                    </p>
                    <div className="relative">
                      {/* 세로 궤도선 / Vertical orbit line */}
                      <div
                        className="absolute left-3 top-3 bottom-3 w-px"
                        style={{ background: 'linear-gradient(180deg, rgba(0,255,213,0.3) 0%, rgba(129,140,248,0.1) 100%)' }}
                      />
                      <div className="flex flex-col gap-3">
                        {rawPw.milestones.map((ms, idx) => (
                          <div key={ms.order} className="flex items-start gap-4 pl-8 relative">
                            {/* 웨이포인트 점 / Waypoint dot */}
                            <div
                              className="absolute left-1.5 top-1.5 rounded-full"
                              style={{
                                width: '12px',
                                height: '12px',
                                background: ms.type === 'final_goal' ? '#00ffd5' : '#1e3a5f',
                                border: `2px solid ${ms.type === 'final_goal' ? '#00ffd5' : 'rgba(0,255,213,0.3)'}`,
                                boxShadow: ms.type === 'final_goal' ? '0 0 8px rgba(0,255,213,0.5)' : 'none',
                              }}
                            />
                            <div
                              className="flex-1 rounded-xl p-3"
                              style={{
                                background:
                                  ms.type === 'final_goal'
                                    ? 'rgba(0,255,213,0.06)'
                                    : 'rgba(255,255,255,0.03)',
                                border:
                                  ms.type === 'final_goal'
                                    ? '1px solid rgba(0,255,213,0.2)'
                                    : '1px solid rgba(255,255,255,0.06)',
                              }}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: ms.type === 'final_goal' ? '#00ffd5' : '#e2e8f0' }}
                                >
                                  {ms.nameKo}
                                </p>
                                <span className="text-slate-600 text-xs font-mono shrink-0">
                                  {ms.monthFromStart === 0 ? 'M+0' : `M+${ms.monthFromStart}`}
                                </span>
                              </div>
                              {ms.visaStatus && ms.visaStatus !== 'none' && (
                                <span
                                  className="inline-block rounded px-2 py-0.5 text-xs font-mono mb-1"
                                  style={{
                                    background: `${getVisaChipColor(ms.visaStatus)}15`,
                                    color: getVisaChipColor(ms.visaStatus),
                                    border: `1px solid ${getVisaChipColor(ms.visaStatus)}30`,
                                  }}
                                >
                                  {ms.visaStatus}
                                </span>
                              )}
                              {ms.canWorkPartTime && (
                                <p className="text-slate-500 text-xs font-mono">
                                  ⚡ 주 {ms.weeklyHours}h 근무 가능 • 월 {ms.estimatedMonthlyIncome}만원
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 다음 스텝 / Next steps */}
                  {rawPw.nextSteps.length > 0 && (
                    <div className="p-5 border-t" style={{ borderColor: 'rgba(0,255,213,0.08)' }}>
                      <p className="text-slate-500 text-xs font-mono mb-3 flex items-center gap-2">
                        <Radio size={12} />
                        IMMEDIATE ACTIONS (NEXT STEPS)
                      </p>
                      <div className="flex flex-col gap-2">
                        {rawPw.nextSteps.map((ns, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl p-3 flex items-start gap-3"
                            style={{
                              background: 'rgba(129,140,248,0.06)',
                              border: '1px solid rgba(129,140,248,0.15)',
                            }}
                          >
                            <ArrowRight size={14} color="#818cf8" className="shrink-0 mt-0.5" />
                            <div>
                              <p className="text-slate-200 text-sm font-semibold">{ns.nameKo}</p>
                              <p className="text-slate-500 text-xs mt-0.5">{ns.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 주의사항 / Note */}
                  {rawPw.note && (
                    <div
                      className="px-5 py-3 flex items-center gap-2 border-t"
                      style={{ borderColor: 'rgba(0,255,213,0.08)', background: 'rgba(255,255,255,0.02)' }}
                    >
                      <AlertCircle size={13} color="#fbbf24" className="shrink-0" />
                      <p className="text-slate-500 text-xs">{rawPw.note}</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 전체 경로 스코어보드 / Full pathway scoreboard */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-slate-500 text-xs font-mono mb-4 flex items-center gap-2">
                <Award size={12} />
                FULL MISSION SCOREBOARD
              </p>
              <div className="flex flex-col gap-2">
                {mockPathways.map((pw, idx) => {
                  const scoreCol = getNeonScoreColor(pw.finalScore);
                  return (
                    <button
                      key={pw.pathwayId}
                      onClick={() => setSelectedPathway(idx)}
                      className="rounded-xl p-3 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-95 text-left"
                      style={{
                        background:
                          selectedPathway === idx ? 'rgba(0,255,213,0.06)' : 'rgba(255,255,255,0.03)',
                        border:
                          selectedPathway === idx
                            ? '1px solid rgba(0,255,213,0.2)'
                            : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {/* 랭크 / Rank */}
                      <div
                        className="shrink-0 rounded-full flex items-center justify-center font-black text-xs font-mono"
                        style={{
                          width: '28px',
                          height: '28px',
                          background: `${scoreCol}20`,
                          color: scoreCol,
                          border: `1px solid ${scoreCol}40`,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-sm font-semibold truncate">{pw.nameKo}</p>
                        <p className="text-slate-600 text-xs font-mono truncate">{pw.visaChainStr}</p>
                      </div>
                      {/* 스코어 바 / Score bar */}
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span className="font-black text-sm font-mono" style={{ color: scoreCol }}>
                          {pw.finalScore}점
                        </span>
                        <div
                          className="rounded-full overflow-hidden"
                          style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.06)' }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((pw.finalScore / 100) * 100, 100)}%`,
                              background: scoreCol,
                            }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 재탐사 버튼 / Re-explore button */}
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(0,255,213,0.2)',
                color: '#00ffd5',
              }}
            >
              <Rocket size={15} />
              새 탐사 시작 RESTART MISSION
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
