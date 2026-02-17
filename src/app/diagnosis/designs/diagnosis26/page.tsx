'use client';

// KOR: 슬롯머신 컨셉 비자 진단 페이지 (디자인 #26) — 골드+레드 럭키 테마
// ENG: Slot machine concept visa diagnosis page (Design #26) — Gold+Red lucky theme
// References: Coinbase, Robinhood, eToro, Binance, Crypto.com inspired design

import React, { useState, useEffect, useRef } from 'react';
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
  Star,
  Zap,
  Trophy,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Play,
  CheckCircle,
  Clock,
  ArrowRight,
  Gift,
  Flame,
  Lock,
} from 'lucide-react';

// ============================================================
// KOR: 슬롯 단계 타입 및 설정 / ENG: Slot step types and config
// ============================================================

type SlotStep = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const STEPS: SlotStep[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

// KOR: 나이 범위 옵션 / ENG: Age range options
const AGE_OPTIONS = [
  { label: '18–24세', value: 22 },
  { label: '25–29세', value: 27 },
  { label: '30–34세', value: 32 },
  { label: '35–39세', value: 37 },
  { label: '40세 이상', value: 42 },
];

// KOR: 각 단계 메타데이터 / ENG: Metadata for each step
interface StepMeta {
  label: string;
  labelEn: string;
  icon: string;
}

const STEP_META: Record<SlotStep, StepMeta> = {
  nationality:         { label: '국적',      labelEn: 'Nationality',  icon: '🌍' },
  age:                 { label: '나이',      labelEn: 'Age',           icon: '🎂' },
  educationLevel:      { label: '학력',      labelEn: 'Education',     icon: '🎓' },
  availableAnnualFund: { label: '연간 자금', labelEn: 'Annual Fund',   icon: '💰' },
  finalGoal:           { label: '목표',      labelEn: 'Final Goal',    icon: '🎯' },
  priorityPreference:  { label: '우선순위',  labelEn: 'Priority',      icon: '⭐' },
};

// ============================================================
// KOR: 코인 파티클 타입 / ENG: Coin particle type
// ============================================================
interface CoinParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  opacity: number;
  emoji: string;
}

// ============================================================
// KOR: 슬롯 릴 컴포넌트 — 개별 릴의 스핀 + 정지 / ENG: Slot reel — spin + stop
// ============================================================
interface SlotReelProps {
  items: string[];
  selectedIndex: number;
  isSpinning: boolean;
  isLocked: boolean;
}

function SlotReel({ items, selectedIndex, isSpinning, isLocked }: SlotReelProps) {
  const [displayIdx, setDisplayIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isSpinning && !isLocked) {
      // KOR: 릴 회전 — 빠르게 옵션 순환 / ENG: Reel spinning — cycle options fast
      timerRef.current = setInterval(() => {
        setDisplayIdx((prev) => (prev + 1) % items.length);
      }, 70);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setDisplayIdx(selectedIndex);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSpinning, isLocked, selectedIndex, items.length]);

  const prev = (displayIdx - 1 + items.length) % items.length;
  const next = (displayIdx + 1) % items.length;

  return (
    <div className={`relative h-28 overflow-hidden rounded-2xl border-2 ${isLocked ? 'border-green-400' : 'border-yellow-400'} bg-gray-900 shadow-lg`}>
      {/* KOR: 상단/하단 페이드 마스크 / ENG: Top/bottom fade masks */}
      <div className="absolute inset-x-0 top-0 h-8 bg-linear-to-br from-gray-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-br from-transparent to-gray-900 z-10 pointer-events-none" />

      {/* KOR: 선택 중심 하이라이트 / ENG: Center selection highlight */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 bg-yellow-400/10 border-y border-yellow-400/40 pointer-events-none z-5" />

      {/* KOR: 릴 텍스트 3줄 / ENG: 3-row reel text */}
      <div className="flex flex-col items-center justify-center h-full gap-0.5 px-3">
        <span className={`text-xs text-yellow-200/30 text-center w-full truncate ${isSpinning && !isLocked ? 'blur-sm' : ''}`}>
          {items[prev]}
        </span>
        <span className={`text-sm font-bold text-center w-full truncate ${isLocked ? 'text-green-400' : 'text-yellow-300'} ${isSpinning && !isLocked ? 'blur-sm' : ''}`}>
          {items[displayIdx]}
        </span>
        <span className={`text-xs text-yellow-200/30 text-center w-full truncate ${isSpinning && !isLocked ? 'blur-sm' : ''}`}>
          {items[next]}
        </span>
      </div>

      {/* KOR: 잠금 아이콘 / ENG: Lock icon */}
      {isLocked && (
        <div className="absolute top-1.5 right-1.5 z-20 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
          <Lock className="w-3 h-3 text-gray-900" />
        </div>
      )}
    </div>
  );
}

// ============================================================
// KOR: 코인 폭발 오버레이 / ENG: Coin explosion overlay
// ============================================================
function CoinBurst({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<CoinParticle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) { setParticles([]); return; }

    const emojis = ['🪙', '💰', '⭐', '✨', '💫', '🌟', '🎉'];
    const initial: CoinParticle[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: 50,
      y: 60,
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 12 + 4),
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1.5,
      opacity: 1,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setParticles(initial);

    let frame = 0;
    const animate = () => {
      frame++;
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.45,
            rotation: p.rotation + 9,
            opacity: Math.max(0, p.opacity - 0.018),
          }))
          .filter((p) => p.opacity > 0)
      );
      if (frame < 90) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active]);

  if (!active && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute select-none text-2xl"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            opacity: p.opacity,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// KOR: 결과 카드 — 잭팟 순위 스타일 / ENG: Result card — jackpot rank style
// ============================================================
interface ResultCardProps {
  pathway: CompatPathway;
  rank: number;
}

const RANK_CONFIG = [
  { badge: '🎰 JACKPOT',  from: 'from-yellow-500', to: 'to-amber-600',  border: 'border-yellow-400',  glow: 'shadow-yellow-400/40' },
  { badge: '🥈 2nd PRIZE', from: 'from-slate-400',  to: 'to-slate-600',  border: 'border-slate-300',   glow: 'shadow-slate-400/30'  },
  { badge: '🥉 3rd PRIZE', from: 'from-amber-600',  to: 'to-amber-800',  border: 'border-amber-500',   glow: 'shadow-amber-500/30'  },
  { badge: '🎫 4th',       from: 'from-gray-700',   to: 'to-gray-800',   border: 'border-gray-600',    glow: 'shadow-gray-500/20'   },
  { badge: '🎫 5th',       from: 'from-gray-700',   to: 'to-gray-800',   border: 'border-gray-600',    glow: 'shadow-gray-500/20'   },
];

function ResultCard({ pathway, rank }: ResultCardProps) {
  const [expanded, setExpanded] = useState(rank === 0);
  const cfg = RANK_CONFIG[rank] ?? RANK_CONFIG[3];
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);
  const scoreHex = getScoreColor(pathway.finalScore);

  // KOR: visaChain이 배열이므로 코드 문자열로 변환 / ENG: visaChain is array, convert to code string
  const visaChainCodes = (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v) => v.code);

  return (
    <div className={`rounded-2xl border-2 ${cfg.border} shadow-xl ${cfg.glow} bg-gray-900 overflow-hidden`}>
      {/* KOR: 순위 헤더 / ENG: Rank header */}
      <div className={`bg-linear-to-br ${cfg.from} ${cfg.to} px-4 py-3 flex items-center gap-3`}>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-black text-white/60 tracking-widest">{cfg.badge}</div>
          <div className="text-white font-bold text-sm leading-snug truncate">{pathway.nameKo}</div>
          <div className="text-white/60 text-xs truncate">{pathway.nameEn}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="px-2 py-1 rounded-full text-white text-xs font-bold"
            style={{ backgroundColor: scoreHex }}
          >
            {emoji} {pathway.finalScore}점
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* KOR: 핵심 통계 3개 / ENG: 3 key stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-700 border-b border-gray-700">
        <div className="flex flex-col items-center py-3 gap-1">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-bold text-sm">{pathway.estimatedMonths}개월</span>
          <span className="text-gray-500 text-xs">소요 기간</span>
        </div>
        <div className="flex flex-col items-center py-3 gap-1">
          <Zap className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-bold text-sm">{pathway.estimatedCostWon}만원</span>
          <span className="text-gray-500 text-xs">예상 비용</span>
        </div>
        <div className="flex flex-col items-center py-3 gap-1">
          <Star className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-bold text-xs">{pathway.feasibilityLabel}</span>
          <span className="text-gray-500 text-xs">실현 가능성</span>
        </div>
      </div>

      {/* KOR: 비자 체인 — 항상 표시 / ENG: Visa chain — always visible */}
      <div className="px-4 py-3 flex items-center gap-1.5 flex-wrap border-b border-gray-700">
        {visaChainCodes.map((code, i) => (
          <React.Fragment key={i}>
            <span className="px-2 py-1 bg-yellow-400/10 border border-yellow-400/30 rounded-lg text-yellow-300 text-xs font-bold">
              {code}
            </span>
            {i < visaChainCodes.length - 1 && (
              <ArrowRight className="w-3 h-3 text-yellow-600 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* KOR: 확장 내용 — 마일스톤 + 다음 단계 / ENG: Expanded — milestones + next steps */}
      {expanded && (
        <div className="px-4 py-4 space-y-4">
          {/* KOR: 메모 / ENG: Note */}
          {pathway.note && (
            <p className="text-gray-400 text-xs leading-relaxed">{pathway.note}</p>
          )}

          {/* KOR: 마일스톤 / ENG: Milestones */}
          {pathway.milestones.length > 0 && (
            <div>
              <div className="text-yellow-400 text-xs font-bold mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 경로 단계 (Milestones)
              </div>
              <div className="space-y-2">
                {pathway.milestones.map((ms) => (
                  <div key={ms.order} className="flex gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-xs text-yellow-400 font-bold">
                      {ms.order}
                    </div>
                    <div>
                      <div className="text-yellow-200 text-sm font-semibold">{ms.nameKo}</div>
                      <div className="text-gray-500 text-xs">
                        {ms.monthFromStart}개월 시점 | 비자: {ms.visaStatus || '—'}
                        {ms.canWorkPartTime && ` | 아르바이트 ${ms.weeklyHours}시간/주`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KOR: 다음 액션 / ENG: Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div>
              <div className="text-green-400 text-xs font-bold mb-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> 지금 할 일 (Next Steps)
              </div>
              <div className="space-y-1.5">
                {pathway.nextSteps.map((ns, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <ArrowRight className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-green-300 text-xs font-semibold">{ns.nameKo}</span>
                      <span className="text-gray-500 text-xs"> — {ns.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// KOR: 메인 페이지 / ENG: Main page
// ============================================================
export default function Diagnosis26Page() {
  // KOR: 현재 진행 단계 인덱스 / ENG: Current step index
  const [currentStep, setCurrentStep] = useState<number>(0);

  // KOR: 각 단계의 선택 인덱스 / ENG: Selected index for each step
  const [selIdx, setSelIdx] = useState<Record<SlotStep, number>>({
    nationality:         0,
    age:                 0,
    educationLevel:      0,
    availableAnnualFund: 0,
    finalGoal:           0,
    priorityPreference:  0,
  });

  // KOR: 잠금된 단계 목록 / ENG: Set of locked steps
  const [locked, setLocked] = useState<Set<SlotStep>>(new Set());

  // KOR: 릴 스핀 중 여부 / ENG: Whether reel is spinning
  const [spinning, setSpinning] = useState<boolean>(false);

  // KOR: 화면 상태: input | bonus | jackpot | results
  // ENG: Screen state: input | bonus | jackpot | results
  const [screen, setScreen] = useState<'input' | 'bonus' | 'jackpot' | 'results'>('input');

  // KOR: 코인 버스트 활성화 / ENG: Coin burst active
  const [coinBurst, setCoinBurst] = useState<boolean>(false);

  const currentKey = STEPS[currentStep];
  const meta = STEP_META[currentKey];

  // KOR: 현재 단계의 옵션 문자열 배열 생성
  // ENG: Build string option array for current step
  const getOptionsForStep = (step: SlotStep): string[] => {
    switch (step) {
      case 'nationality':
        return popularCountries.map((c) => `${c.flag} ${c.nameKo}`);
      case 'age':
        return AGE_OPTIONS.map((a) => a.label);
      case 'educationLevel':
        return educationOptions.map((e) => `${e.emoji} ${e.labelKo}`);
      case 'availableAnnualFund':
        return fundOptions.map((f) => f.labelKo);
      case 'finalGoal':
        return goalOptions.map((g) => `${g.emoji} ${g.labelKo}`);
      case 'priorityPreference':
        return priorityOptions.map((p) => `${p.emoji} ${p.labelKo}`);
    }
  };

  const options = getOptionsForStep(currentKey);

  // KOR: 릴 스핀 시작 / ENG: Start reel spin
  const handleSpin = () => {
    if (spinning || locked.has(currentKey)) return;
    setSpinning(true);
    setTimeout(() => setSpinning(false), 1500);
  };

  // KOR: 직접 옵션 선택 / ENG: Select option directly
  const handleSelect = (idx: number) => {
    if (spinning || locked.has(currentKey)) return;
    setSelIdx((prev) => ({ ...prev, [currentKey]: idx }));
  };

  // KOR: 현재 릴 잠금 후 다음 단계 / ENG: Lock current reel and advance
  const handleLock = () => {
    if (spinning || locked.has(currentKey)) return;
    const newLocked = new Set(locked);
    newLocked.add(currentKey);
    setLocked(newLocked);

    if (currentStep < STEPS.length - 1) {
      // KOR: 다음 단계로 이동 + 자동 스핀 / ENG: Go to next step + auto-spin
      setTimeout(() => {
        setCurrentStep((p) => p + 1);
        setSpinning(true);
        setTimeout(() => setSpinning(false), 1000);
      }, 200);
    } else {
      // KOR: 마지막 단계 → 보너스 라운드 / ENG: Last step → bonus round
      setTimeout(() => setScreen('bonus'), 200);
    }
  };

  // KOR: 보너스 스핀 — 잭팟으로 전환 / ENG: Bonus spin — transition to jackpot
  const handleBonusSpin = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setCoinBurst(true);
      setTimeout(() => {
        setScreen('jackpot');
      }, 800);
      setTimeout(() => {
        setCoinBurst(false);
        setScreen('results');
      }, 2400);
    }, 2000);
  };

  // KOR: 재시작 / ENG: Restart
  const handleRestart = () => {
    setCurrentStep(0);
    setSelIdx({ nationality: 0, age: 0, educationLevel: 0, availableAnnualFund: 0, finalGoal: 0, priorityPreference: 0 });
    setLocked(new Set());
    setSpinning(false);
    setScreen('input');
    setCoinBurst(false);
  };

  const progressPct = Math.round((locked.size / STEPS.length) * 100);

  // ============================================================
  // KOR: 잭팟 전환 화면 / ENG: Jackpot transition screen
  // ============================================================
  if (screen === 'jackpot') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
        <CoinBurst active={true} />
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce">🎰</div>
          <div className="text-5xl font-black text-yellow-400 tracking-widest mb-2">JACKPOT!</div>
          <div className="text-yellow-200 text-lg">비자 경로 분석 완료!</div>
          <div className="text-gray-400 text-sm mt-1">Visa Pathways Analyzed</div>
          <div className="flex justify-center gap-3 mt-5 text-3xl">
            {['⭐', '💰', '⭐'].map((s, i) => (
              <span
                key={i}
                style={{ animation: `spin ${0.5 + i * 0.2}s linear infinite` }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // KOR: 결과 화면 / ENG: Results screen
  // ============================================================
  if (screen === 'results') {
    const pathways = mockPathways;

    // KOR: 선택 요약 레이블 생성 / ENG: Build selection summary labels
    const summaryLabels: { icon: string; text: string }[] = STEPS.map((step) => {
      const idx = selIdx[step];
      const m = STEP_META[step];
      const opts = getOptionsForStep(step);
      return { icon: m.icon, text: opts[idx] };
    });

    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <CoinBurst active={coinBurst} />

        {/* KOR: 결과 헤더 / ENG: Results header */}
        <div className="bg-linear-to-br from-red-900 via-gray-900 to-yellow-900 px-4 pt-10 pb-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-4xl mb-2">🎰</div>
            <h1 className="text-2xl font-black text-yellow-400 mb-1">잭팟 분석 결과</h1>
            <p className="text-gray-400 text-sm">JACKPOT VISA PATHWAY ANALYSIS</p>

            {/* KOR: 선택 요약 칩 / ENG: Selection summary chips */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {summaryLabels.map((sl, i) => (
                <div key={i} className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1">
                  <span>{sl.icon}</span>
                  <span className="text-yellow-300 text-xs font-medium truncate max-w-28">{sl.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5">
          {/* KOR: 잭팟 배너 / ENG: Jackpot result banner */}
          <div className="bg-linear-to-br from-yellow-600 to-amber-700 rounded-2xl p-4 flex items-center gap-3 mb-5">
            <Trophy className="w-8 h-8 text-white shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-white font-black text-sm">🎉 {pathways.length}개 비자 경로를 찾았습니다!</div>
              <div className="text-yellow-100 text-xs mt-0.5">최적 경로를 확인하세요 — Check your best pathways</div>
            </div>
            <Sparkles className="w-6 h-6 text-yellow-200 shrink-0" />
          </div>

          {/* KOR: 경로 카드 목록 / ENG: Pathway card list */}
          <div className="space-y-4 mb-7">
            {pathways.map((pathway, i) => (
              <ResultCard key={pathway.pathwayId} pathway={pathway} rank={i} />
            ))}
          </div>

          {/* KOR: 다음 액션 / ENG: Next action CTA */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm">다음 단계 (Next Steps)</span>
            </div>
            <div className="space-y-3">
              <button className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                <Flame className="w-4 h-4" />
                전문 상담 신청하기 (Get Expert Advice)
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-yellow-300 font-semibold rounded-xl transition-colors text-sm border border-gray-600">
                채용 공고 둘러보기 (Browse Jobs)
              </button>
            </div>
          </div>

          {/* KOR: 재진단 버튼 / ENG: Restart button */}
          <button
            onClick={handleRestart}
            className="w-full py-3 flex items-center justify-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm mb-8"
          >
            <RotateCcw className="w-4 h-4" />
            다시 진단하기 (Re-diagnose)
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // KOR: 보너스 라운드 화면 / ENG: Bonus round screen
  // ============================================================
  if (screen === 'bonus') {
    const summaryItems: { icon: string; label: string; value: string }[] = STEPS.map((step) => {
      const idx = selIdx[step];
      const m = STEP_META[step];
      const opts = getOptionsForStep(step);
      return { icon: m.icon, label: m.labelEn, value: opts[idx] };
    });

    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <CoinBurst active={spinning} />

        {/* KOR: 보너스 타이틀 / ENG: Bonus title */}
        <div className="text-center mb-8">
          <div className={`text-5xl mb-3 ${spinning ? 'animate-spin' : 'animate-bounce'}`}>🎰</div>
          <div className="text-3xl font-black text-yellow-400 mb-1">BONUS ROUND!</div>
          <div className="text-gray-300 text-sm">모든 릴 잠금 완료 — All Reels Locked!</div>
        </div>

        {/* KOR: 선택값 요약 카드 / ENG: Selection summary card */}
        <div className="w-full max-w-sm bg-gray-900 border-2 border-yellow-400 rounded-2xl p-4 mb-8 shadow-xl shadow-yellow-400/20">
          <div className="text-center text-yellow-400 text-xs font-bold mb-3 tracking-widest">
            확정된 선택 (FINAL SELECTIONS)
          </div>
          <div className="grid grid-cols-2 gap-2">
            {summaryItems.map((item) => (
              <div key={item.label} className="bg-gray-800 rounded-xl p-2.5 flex items-center gap-2">
                <span className="text-lg shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-gray-400 text-xs">{item.label}</div>
                  <div className="text-yellow-300 text-xs font-semibold truncate">{item.value}</div>
                </div>
                <CheckCircle className="w-3 h-3 text-green-400 shrink-0 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* KOR: 보너스 스핀 버튼 / ENG: Bonus spin button */}
        <button
          onClick={handleBonusSpin}
          disabled={spinning}
          className={`px-10 py-5 rounded-2xl font-black text-xl transition-all ${
            spinning
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-linear-to-br from-yellow-400 to-amber-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 shadow-lg shadow-yellow-400/40 active:scale-95'
          }`}
        >
          {spinning ? (
            <span className="flex items-center gap-2">
              <span style={{ animation: 'spin 0.5s linear infinite' }}>🎰</span>
              분석 중... Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="w-6 h-6" />
              SPIN &amp; WIN!
            </span>
          )}
        </button>

        {spinning && (
          <p className="mt-4 text-yellow-400 text-sm animate-pulse">
            최적 비자 경로를 계산하는 중... Computing best visa pathways...
          </p>
        )}
      </div>
    );
  }

  // ============================================================
  // KOR: 메인 슬롯머신 입력 화면 / ENG: Main slot machine input screen
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <CoinBurst active={coinBurst} />

      {/* KOR: 헤더 / ENG: Header */}
      <div className="bg-linear-to-br from-red-950 to-gray-900 px-4 py-5 text-center border-b border-yellow-400/20">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">🎰</span>
          <h1 className="text-xl font-black text-yellow-400 tracking-wider">VISA SLOT MACHINE</h1>
          <span className="text-2xl">🎰</span>
        </div>
        <p className="text-gray-400 text-xs">릴을 돌려 나의 비자 경로를 찾아라! / Spin to find your visa path!</p>

        {/* KOR: 진행률 바 / ENG: Progress bar */}
        <div className="mt-3 max-w-xs mx-auto">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-yellow-400/10">
            <div
              className="h-full bg-linear-to-br from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{locked.size}/{STEPS.length} 잠금</span>
            <span className="text-xs text-yellow-400 font-semibold">{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* KOR: 단계 탭 네비게이션 / ENG: Step tab navigation */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto border-b border-gray-800">
        {STEPS.map((step, i) => {
          const isLocked = locked.has(step);
          const isCurrent = i === currentStep;
          return (
            <div
              key={step}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isLocked
                  ? 'bg-green-400/15 border border-green-400/40 text-green-400'
                  : isCurrent
                  ? 'bg-yellow-400/15 border border-yellow-400 text-yellow-300'
                  : 'bg-gray-800 border border-gray-700 text-gray-500'
              }`}
            >
              <span>{STEP_META[step].icon}</span>
              <span>{STEP_META[step].label}</span>
              {isLocked && <CheckCircle className="w-3 h-3" />}
            </div>
          );
        })}
      </div>

      {/* KOR: 슬롯머신 본체 / ENG: Slot machine body */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">

        {/* KOR: 현재 단계 타이틀 / ENG: Current step title */}
        <div className="text-center mb-5">
          <div className="text-4xl mb-1">{meta.icon}</div>
          <h2 className="text-lg font-black text-yellow-300">{meta.label}</h2>
          <p className="text-gray-500 text-xs">{meta.labelEn} — Step {currentStep + 1} / {STEPS.length}</p>
        </div>

        {/* KOR: 슬롯 릴 + 버튼 / ENG: Slot reel + buttons */}
        <div className="bg-gray-900 border-2 border-yellow-400 rounded-3xl p-5 shadow-2xl shadow-yellow-400/10 mb-5">
          {/* KOR: 상단 장식 불빛 / ENG: Decorative lights */}
          <div className="flex justify-center gap-2 mb-4">
            {['bg-red-500', 'bg-yellow-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-500'].map((c, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${c} transition-opacity`}
                style={{ opacity: spinning ? 1 : 0.4 }}
              />
            ))}
          </div>

          {/* KOR: 릴 / ENG: Reel */}
          <div className="mb-4">
            <SlotReel
              items={options}
              selectedIndex={selIdx[currentKey]}
              isSpinning={spinning}
              isLocked={locked.has(currentKey)}
            />
          </div>

          {/* KOR: SPIN 버튼 / ENG: SPIN button */}
          <button
            onClick={handleSpin}
            disabled={spinning || locked.has(currentKey)}
            className={`w-full py-3 rounded-xl font-bold text-sm mb-3 flex items-center justify-center gap-2 transition-all ${
              spinning || locked.has(currentKey)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-linear-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white active:scale-95'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
            {spinning ? 'SPINNING...' : '🎰 SPIN'}
          </button>

          {/* KOR: LOCK & NEXT 버튼 / ENG: LOCK & NEXT button */}
          <button
            onClick={handleLock}
            disabled={spinning || locked.has(currentKey)}
            className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
              spinning || locked.has(currentKey)
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-linear-to-br from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-900 active:scale-95 shadow-lg shadow-yellow-400/30'
            }`}
          >
            <Star className="w-4 h-4" />
            {currentStep === STEPS.length - 1 ? '🎰 BONUS ROUND!' : 'LOCK & NEXT →'}
          </button>
        </div>

        {/* KOR: 직접 선택 옵션 그리드 / ENG: Direct selection option grid */}
        <div className="mb-5">
          <p className="text-center text-gray-500 text-xs mb-2.5">또는 직접 선택 (Or pick directly)</p>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt, i) => {
              const isSelected = selIdx[currentKey] === i;
              const isDisabled = spinning || locked.has(currentKey);
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isDisabled}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-all truncate ${
                    isSelected
                      ? 'bg-yellow-400/20 border border-yellow-400 text-yellow-300'
                      : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-yellow-400/50 hover:text-gray-200'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSelected && '✓ '}{opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* KOR: 잠긴 단계 요약 / ENG: Locked steps summary */}
        {locked.size > 0 && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs font-bold">잠금 완료 (LOCKED)</span>
            </div>
            <div className="space-y-1.5">
              {STEPS.filter((s) => locked.has(s)).map((step) => {
                const m = STEP_META[step];
                const opts = getOptionsForStep(step);
                const val = opts[selIdx[step]];
                return (
                  <div key={step} className="flex items-center gap-2">
                    <span className="text-base">{m.icon}</span>
                    <span className="text-gray-400 text-xs">{m.label}:</span>
                    <span className="text-yellow-300 text-xs font-semibold truncate">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* KOR: 하단 푸터 / ENG: Bottom footer */}
      <div className="bg-gray-900 border-t border-yellow-400/10 py-3 text-center">
        <span className="text-gray-600 text-xs">🪙 잡차자 비자 진단 슬롯 | Jobchaja Visa Slot Machine 🪙</span>
      </div>
    </div>
  );
}
