'use client';

// KOR: RPG 캐릭터 생성 스타일 비자 진단 페이지 (Design #22)
// ENG: RPG Character Creation style visa diagnosis page (Design #22)
// 참고 / References: Diablo, World of Warcraft, Lost Ark, Path of Exile, DnD Beyond

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
  Sword,
  Shield,
  Star,
  Zap,
  BookOpen,
  Globe,
  User,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  Target,
  Coins,
  Clock,
  Sparkles,
  SkipForward,
  RotateCcw,
  ArrowRight,
  Flame,
  Crown,
} from 'lucide-react';

// KOR: 스텝 타입 정의
// ENG: Step type definition
type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// KOR: 스탯 이름 매핑 (RPG 능력치)
// ENG: Stat name mapping (RPG attributes)
const STAT_LABELS: Record<StepKey, { statName: string; icon: React.ReactNode; color: string }> = {
  nationality: { statName: '출신 왕국', icon: <Globe className="w-5 h-5" />, color: 'text-amber-400' },
  age: { statName: '용사 나이', icon: <User className="w-5 h-5" />, color: 'text-green-400' },
  educationLevel: { statName: '지식 레벨', icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-400' },
  availableAnnualFund: { statName: '골드 보유량', icon: <Coins className="w-5 h-5" />, color: 'text-yellow-400' },
  finalGoal: { statName: '최종 퀘스트', icon: <Target className="w-5 h-5" />, color: 'text-purple-400' },
  priorityPreference: { statName: '전투 스타일', icon: <Sword className="w-5 h-5" />, color: 'text-red-400' },
};

// KOR: 교육 수준에 따른 스탯 점수 계산
// ENG: Calculate stat score based on education level
const getEducationScore = (edu: string): number => {
  const scores: Record<string, number> = {
    '고등학교 졸업': 20,
    '전문학사 (2-3년제 대학)': 40,
    '학사 (4년제 대학)': 60,
    '석사': 80,
    '박사': 100,
  };
  return scores[edu] ?? 0;
};

// KOR: 자금에 따른 골드 스탯 계산
// ENG: Calculate gold stat based on fund
const getFundScore = (fund: string): number => {
  const scores: Record<string, number> = {
    '~ $5,000': 15,
    '$5,000 - $10,000': 35,
    '$10,000 - $20,000': 55,
    '$20,000 - $50,000': 80,
    '$50,000 ~': 100,
  };
  return scores[fund] ?? 0;
};

// KOR: 목표에 따른 야망 스탯 계산
// ENG: Calculate ambition stat based on goal
const getGoalScore = (goal: string): number => {
  const scores: Record<string, number> = {
    '한국어 학습': 20,
    '단기 취업 (1-3년)': 45,
    '장기 취업 (3년 이상)': 65,
    '유학 (학위 취득)': 75,
    '영주권 또는 국적 취득': 100,
  };
  return scores[goal] ?? 0;
};

// KOR: 클래스 매핑 (우선순위 → RPG 클래스)
// ENG: Class mapping (priority → RPG class)
const CLASS_MAP: Record<string, { name: string; desc: string; icon: string; aura: string }> = {
  '가장 빠른 경로': { name: '어쌔신', desc: '속도를 중시하는 은밀한 자객', icon: '🗡️', aura: 'border-red-500 shadow-red-500/40' },
  '가장 저렴한 비용': { name: '상인', desc: '효율을 극대화하는 교역자', icon: '💰', aura: 'border-yellow-500 shadow-yellow-500/40' },
  '가장 높은 성공률': { name: '성기사', desc: '안전을 추구하는 빛의 전사', icon: '🛡️', aura: 'border-blue-400 shadow-blue-400/40' },
  '특정 직업 분야': { name: '마법사', desc: '전문성을 쌓는 지식의 탐구자', icon: '🔮', aura: 'border-purple-500 shadow-purple-500/40' },
};

// KOR: 경로 클래스 컴포넌트 (가독성 향상)
// ENG: Pathway card component (for readability)
interface PathwayCardProps {
  pathway: RecommendedPathway;
  rank: number;
}

function PathwayCard({ pathway, rank }: PathwayCardProps) {
  // KOR: 확장 여부 상태
  // ENG: Expansion state
  const [expanded, setExpanded] = useState<boolean>(false);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);
  const scoreColor = getScoreColor(pathway.feasibilityLabel);

  // KOR: 등급별 테두리 색상
  // ENG: Border color by rank
  const rankBorder = rank === 0
    ? 'border-amber-400 shadow-amber-400/30'
    : rank === 1
    ? 'border-slate-400 shadow-slate-400/20'
    : 'border-amber-700 shadow-amber-700/20';

  const rankLabel = rank === 0 ? '★ LEGENDARY' : rank === 1 ? '◆ EPIC' : '● RARE';
  const rankColor = rank === 0 ? 'text-amber-400' : rank === 1 ? 'text-slate-300' : 'text-amber-700';

  return (
    <div className={`bg-gray-900 border ${rankBorder} rounded-lg shadow-lg mb-4 overflow-hidden`}>
      {/* KOR: 카드 헤더 / ENG: Card header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold tracking-widest ${rankColor}`}>{rankLabel}</span>
          <span className="text-2xl">{emoji}</span>
        </div>

        <h3 className="text-orange-300 font-bold text-base mb-1">{pathway.name}</h3>
        <p className="text-gray-400 text-xs mb-3">{pathway.description}</p>

        {/* KOR: 가능성 바 / ENG: Feasibility bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">성공 가능성</span>
            <span className="text-orange-300 font-bold">{pathway.feasibilityScore}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full ${scoreColor} transition-all duration-1000`}
              style={{ width: `${pathway.feasibilityScore}%` }}
            />
          </div>
        </div>

        {/* KOR: 요약 스탯 / ENG: Summary stats */}
        <div className="flex gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{pathway.totalDurationMonths}개월</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="w-3 h-3 text-yellow-400" />
            <span>${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <SkipForward className="w-3 h-3 text-green-400" />
            <span>{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}단계</span>
          </div>
        </div>
      </div>

      {/* KOR: 확장 영역 (비자 체인 + 마일스톤) / ENG: Expanded area (visa chain + milestones) */}
      {expanded && (
        <div className="border-t border-gray-700 p-4 bg-gray-950">
          {/* KOR: 비자 체인 / ENG: Visa chain */}
          <div className="mb-4">
            <div className="text-xs text-orange-400 font-bold mb-2 tracking-wider">⚔ 비자 경로 체인</div>
            <div className="flex flex-wrap items-center gap-2">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="bg-gray-800 border border-orange-500/40 rounded px-3 py-1 text-center">
                    <div className="text-orange-300 font-bold text-sm">{step.visa}</div>
                    <div className="text-gray-400 text-xs">{step.duration}</div>
                  </div>
                  {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight className="w-4 h-4 text-orange-500 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* KOR: 마일스톤 스킬 트리 / ENG: Milestone skill tree */}
          <div>
            <div className="text-xs text-orange-400 font-bold mb-2 tracking-wider">🌟 스킬 트리 (마일스톤)</div>
            <div className="space-y-2">
              {pathway.milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-gray-800/50 rounded p-2">
                  <div className="w-8 h-8 bg-gray-700 border border-orange-500/30 rounded flex items-center justify-center text-lg shrink-0">
                    {milestone.emoji}
                  </div>
                  <div>
                    <div className="text-orange-200 text-sm font-semibold">{milestone.title}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{milestone.description}</div>
                  </div>
                  <div className="ml-auto text-orange-500 text-xs font-bold shrink-0">LV.{idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KOR: 접기/펼치기 버튼 / ENG: Collapse/expand button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2 text-center text-orange-500/70 hover:text-orange-400 text-xs flex items-center justify-center gap-1 bg-gray-900 hover:bg-gray-800 transition-colors border-t border-gray-800"
      >
        {expanded ? <><ChevronUp className="w-3 h-3" /> 접기</> : <><ChevronDown className="w-3 h-3" /> 자세히 보기</>}
      </button>
    </div>
  );
}

// KOR: 스탯 바 컴포넌트
// ENG: Stat bar component
interface StatBarProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

function StatBar({ label, value, color, icon }: StatBarProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className={`flex items-center gap-1 ${color} text-xs`}>
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-gray-400 text-xs">{value}/100</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5 border border-gray-700">
        <div
          className={`h-2.5 rounded-full bg-linear-to-r ${color.replace('text-', 'from-').replace('-400', '-600')} to-orange-400 transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// KOR: 메인 진단 페이지 컴포넌트
// ENG: Main diagnosis page component
export default function Diagnosis22Page() {
  // KOR: 현재 스텝 상태 (0~5: 입력 단계, 6: 결과)
  // ENG: Current step state (0~5: input steps, 6: results)
  const [step, setStep] = useState<number>(0);

  // KOR: 사용자 입력 데이터 상태
  // ENG: User input data state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 결과 표시 여부
  // ENG: Whether to show results
  const [showResult, setShowResult] = useState<boolean>(false);

  // KOR: 결과 데이터 (목업 사용)
  // ENG: Result data (using mock)
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);

  // KOR: 레벨업 이펙트 상태
  // ENG: Level-up effect state
  const [levelUpEffect, setLevelUpEffect] = useState<boolean>(false);

  // KOR: 스텝 순서 배열
  // ENG: Step order array
  const steps: StepKey[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];

  // KOR: 현재 스텝의 키
  // ENG: Current step key
  const currentKey = steps[step] as StepKey | undefined;

  // KOR: 다음 스텝으로 이동 (레벨업 이펙트 포함)
  // ENG: Move to next step (with level-up effect)
  const handleNext = (value: string | number) => {
    setInput((prev) => ({ ...prev, [steps[step]]: value }));
    setLevelUpEffect(true);
    setTimeout(() => setLevelUpEffect(false), 600);
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      setShowResult(true);
    }
  };

  // KOR: 처음으로 리셋
  // ENG: Reset to beginning
  const handleReset = () => {
    setStep(0);
    setInput({});
    setShowResult(false);
  };

  // KOR: 현재 캐릭터 클래스 결정
  // ENG: Determine current character class
  const currentClass = input.priorityPreference ? CLASS_MAP[input.priorityPreference] : null;

  // KOR: 교육 스탯 점수
  // ENG: Education stat score
  const eduScore = input.educationLevel ? getEducationScore(input.educationLevel) : 0;

  // KOR: 골드 스탯 점수
  // ENG: Gold stat score
  const goldScore = input.availableAnnualFund ? getFundScore(input.availableAnnualFund) : 0;

  // KOR: 야망 스탯 점수
  // ENG: Ambition stat score
  const ambitionScore = input.finalGoal ? getGoalScore(input.finalGoal) : 0;

  // KOR: 나이 스탯 (젊을수록 높음)
  // ENG: Age stat (higher when younger)
  const ageScore = input.age ? Math.max(0, Math.min(100, Math.round(100 - ((Number(input.age) - 18) / 42) * 100))) : 0;

  // KOR: 전체 진행률
  // ENG: Overall progress
  const overallProgress = Math.round((step / steps.length) * 100);

  // KOR: 결과 화면 렌더링
  // ENG: Result screen rendering
  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-950 text-white font-mono">
        {/* KOR: 배경 파티클 효과 (CSS 기반) / ENG: Background particle effect (CSS-based) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-gray-900 to-orange-950/20" />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/20 rounded-full animate-pulse"
              style={{
                left: `${(i * 13 + 7) % 100}%`,
                top: `${(i * 17 + 3) % 100}%`,
                animationDelay: `${(i * 0.3) % 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-2xl mx-auto px-4 py-8">
          {/* KOR: 결과 헤더 / ENG: Result header */}
          <div className="text-center mb-8">
            <div className="text-orange-400 text-xs tracking-widest mb-2">⚔ CHARACTER SHEET ⚔</div>
            <h1 className="text-2xl font-bold text-amber-300 mb-1">캐릭터 분석 완료!</h1>
            <p className="text-gray-400 text-sm">당신에게 맞는 비자 퀘스트가 발견되었습니다</p>
          </div>

          {/* KOR: 캐릭터 시트 / ENG: Character sheet */}
          <div className="bg-gray-900 border border-orange-700/50 rounded-xl p-5 mb-6 shadow-lg shadow-orange-900/20">
            <div className="flex items-start gap-4 mb-5">
              {/* KOR: 캐릭터 아이콘 / ENG: Character icon */}
              <div className={`w-20 h-20 bg-gray-800 border-2 rounded-xl flex items-center justify-center text-4xl shrink-0 shadow-lg ${currentClass?.aura ?? 'border-orange-500'}`}>
                {currentClass?.icon ?? '⚔️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-orange-400 text-xs tracking-wider mb-0.5">CLASS</div>
                <div className="text-amber-300 font-bold text-xl">{currentClass?.name ?? '모험가'}</div>
                <div className="text-gray-400 text-xs mb-2">{currentClass?.desc ?? '미지의 여행자'}</div>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-xs text-gray-300">
                    {input.nationality ?? '미설정'}
                  </div>
                  <div className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-xs text-gray-300">
                    {input.age ?? '?'}세
                  </div>
                </div>
              </div>
            </div>

            {/* KOR: 능력치 스탯 바 / ENG: Ability stat bars */}
            <div className="border-t border-gray-700 pt-4">
              <div className="text-orange-400 text-xs font-bold tracking-wider mb-3">📊 ABILITY SCORES</div>
              <StatBar label="지식 (INT)" value={eduScore} color="text-blue-400" icon={<BookOpen className="w-3 h-3" />} />
              <StatBar label="재력 (GOLD)" value={goldScore} color="text-yellow-400" icon={<Coins className="w-3 h-3" />} />
              <StatBar label="야망 (AMB)" value={ambitionScore} color="text-purple-400" icon={<Star className="w-3 h-3" />} />
              <StatBar label="활력 (VIT)" value={ageScore} color="text-green-400" icon={<Zap className="w-3 h-3" />} />
            </div>
          </div>

          {/* KOR: 퀘스트 목표 표시 / ENG: Quest goal display */}
          <div className="bg-gray-900 border border-orange-700/30 rounded-xl p-4 mb-6">
            <div className="text-orange-400 text-xs font-bold tracking-wider mb-2">🎯 MAIN QUEST</div>
            <div className="text-amber-200 text-sm font-semibold">{input.finalGoal ?? mockInput.finalGoal}</div>
          </div>

          {/* KOR: 비자 경로 결과 / ENG: Visa pathway results */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-amber-400" />
              <h2 className="text-amber-300 font-bold text-lg">추천 퀘스트 경로</h2>
              <div className="ml-auto text-xs text-gray-500">{result.pathways.length}개 발견</div>
            </div>
            {result.pathways.map((pathway, idx) => (
              <PathwayCard key={pathway.id} pathway={pathway} rank={idx} />
            ))}
          </div>

          {/* KOR: 다시 시작 버튼 / ENG: Restart button */}
          <button
            onClick={handleReset}
            className="w-full py-3 bg-gray-800 border border-orange-600/50 hover:bg-orange-900/30 hover:border-orange-500 rounded-xl text-orange-300 font-bold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            새 캐릭터 만들기
          </button>
        </div>
      </div>
    );
  }

  // KOR: 입력 화면 렌더링
  // ENG: Input screen rendering
  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono relative overflow-hidden">
      {/* KOR: 다크 판타지 배경 / ENG: Dark fantasy background */}
      <div className="fixed inset-0 bg-linear-to-br from-gray-950 via-gray-900 to-orange-950/10 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-pulse"
            style={{
              width: `${(i % 4 + 1) * 80}px`,
              height: `${(i % 4 + 1) * 80}px`,
              background: i % 2 === 0 ? 'radial-gradient(circle, #f97316, transparent)' : 'radial-gradient(circle, #7c3aed, transparent)',
              left: `${(i * 19 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              animationDelay: `${(i * 0.4) % 4}s`,
            }}
          />
        ))}
      </div>

      {/* KOR: 레벨업 이펙트 오버레이 / ENG: Level-up effect overlay */}
      {levelUpEffect && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-yellow-300 text-6xl font-black animate-bounce opacity-80 drop-shadow-lg">
            LEVEL UP!
          </div>
        </div>
      )}

      <div className="relative max-w-xl mx-auto px-4 py-8">
        {/* KOR: 게임 타이틀 / ENG: Game title */}
        <div className="text-center mb-6">
          <div className="text-orange-500 text-xs tracking-[0.3em] mb-1">⚔ VISA QUEST ⚔</div>
          <h1 className="text-3xl font-black text-amber-300 drop-shadow-md">캐릭터 생성</h1>
          <p className="text-gray-500 text-xs mt-1">CREATE YOUR VISA ADVENTURER</p>
        </div>

        {/* KOR: 전체 경험치 바 / ENG: Overall experience bar */}
        <div className="mb-6 bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-orange-400 font-bold">캐릭터 생성 진행도</span>
            <span className="text-gray-400">{step}/{steps.length} 스텝</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 border border-gray-700 overflow-hidden">
            <div
              className="h-4 rounded-full bg-linear-to-r from-orange-600 to-amber-400 transition-all duration-500 relative"
              style={{ width: `${overallProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
            </div>
          </div>
          <div className="flex justify-between mt-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full border transition-all duration-300 ${
                  idx < step
                    ? 'bg-amber-400 border-amber-300'
                    : idx === step
                    ? 'bg-orange-500 border-orange-300 animate-pulse'
                    : 'bg-gray-700 border-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* KOR: 왼쪽 캐릭터 스탯 미리보기 / ENG: Character stats preview */}
        {step > 0 && (
          <div className="bg-gray-900/80 border border-orange-800/40 rounded-xl p-4 mb-5">
            <div className="text-orange-400 text-xs font-bold tracking-wider mb-3">📋 현재 캐릭터 시트</div>
            <div className="space-y-2">
              {steps.slice(0, step).map((key) => {
                const stat = STAT_LABELS[key];
                const val = input[key];
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <div className={`flex items-center gap-1.5 ${stat.color}`}>
                      {stat.icon}
                      <span>{stat.statName}</span>
                    </div>
                    <span className="text-gray-300 truncate ml-2 max-w-[160px] text-right">
                      {typeof val === 'number' ? `${val}세` : String(val ?? '-')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* KOR: 현재 스텝 입력 패널 / ENG: Current step input panel */}
        <div className="bg-gray-900 border border-orange-600/50 rounded-xl p-5 shadow-xl shadow-orange-900/20">
          {currentKey && (
            <div className="flex items-center gap-2 mb-4">
              <div className={`${STAT_LABELS[currentKey].color} bg-gray-800 rounded-lg p-2 border border-gray-700`}>
                {STAT_LABELS[currentKey].icon}
              </div>
              <div>
                <div className="text-xs text-orange-400 tracking-wider">STEP {step + 1} / {steps.length}</div>
                <div className="text-amber-200 font-bold text-lg">{STAT_LABELS[currentKey].statName}</div>
              </div>
            </div>
          )}

          {/* ─── STEP 0: 국적 선택 / Nationality selection ─── */}
          {step === 0 && (
            <div>
              <p className="text-gray-400 text-xs mb-4">당신의 출신 왕국을 선택하세요. Your homeland kingdom.</p>
              <div className="grid grid-cols-3 gap-2">
                {popularCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleNext(country.name)}
                    className="bg-gray-800 hover:bg-orange-900/40 border border-gray-700 hover:border-orange-500 rounded-lg p-2.5 text-center transition-all duration-200 group"
                  >
                    <div className="text-2xl mb-1">{country.flag}</div>
                    <div className="text-gray-300 text-xs group-hover:text-orange-300 truncate">{country.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 1: 나이 입력 / Age input ─── */}
          {step === 1 && (
            <div>
              <p className="text-gray-400 text-xs mb-4">용사의 나이를 입력하세요. Enter your adventurer's age.</p>
              <div className="grid grid-cols-4 gap-2">
                {[18, 20, 22, 24, 26, 28, 30, 35, 40, 45, 50, 55].map((age) => (
                  <button
                    key={age}
                    onClick={() => handleNext(age)}
                    className="bg-gray-800 hover:bg-orange-900/40 border border-gray-700 hover:border-orange-500 rounded-lg py-3 text-center text-gray-300 hover:text-orange-300 font-bold transition-all duration-200"
                  >
                    {age}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min={18}
                  max={65}
                  placeholder="직접 입력..."
                  className="flex-1 bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-lg px-3 py-2 text-white text-sm outline-none placeholder-gray-600"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt((e.target as HTMLInputElement).value);
                      if (!isNaN(val) && val >= 18) handleNext(val);
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const inp = (e.currentTarget.previousSibling as HTMLInputElement);
                    const val = parseInt(inp.value);
                    if (!isNaN(val) && val >= 18) handleNext(val);
                  }}
                  className="bg-orange-700 hover:bg-orange-600 rounded-lg px-3 py-2 text-white text-sm transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: 학력 선택 / Education selection ─── */}
          {step === 2 && (
            <div>
              <p className="text-gray-400 text-xs mb-4">지식 레벨을 선택하세요. Select your knowledge level.</p>
              <div className="space-y-2">
                {educationOptions.map((edu, idx) => {
                  const score = getEducationScore(edu);
                  const stars = Math.round(score / 20);
                  return (
                    <button
                      key={edu}
                      onClick={() => handleNext(edu)}
                      className="w-full bg-gray-800 hover:bg-orange-900/40 border border-gray-700 hover:border-orange-500 rounded-lg px-4 py-3 text-left transition-all duration-200 group flex items-center justify-between"
                    >
                      <div>
                        <div className="text-gray-300 group-hover:text-orange-300 text-sm font-semibold">{edu}</div>
                        <div className="text-orange-500 text-xs mt-0.5">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
                      </div>
                      <div className="text-gray-500 text-xs">INT +{score}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── STEP 3: 자금 선택 / Fund selection ─── */}
          {step === 3 && (
            <div>
              <p className="text-gray-400 text-xs mb-4">보유 골드를 선택하세요. Select your available gold.</p>
              <div className="space-y-2">
                {fundOptions.map((fund) => {
                  const score = getFundScore(fund);
                  const goldBars = Math.round(score / 20);
                  return (
                    <button
                      key={fund}
                      onClick={() => handleNext(fund)}
                      className="w-full bg-gray-800 hover:bg-yellow-900/30 border border-gray-700 hover:border-yellow-500 rounded-lg px-4 py-3 text-left transition-all duration-200 group flex items-center justify-between"
                    >
                      <div>
                        <div className="text-gray-300 group-hover:text-yellow-300 text-sm font-semibold">{fund}</div>
                        <div className="text-yellow-500 text-xs mt-0.5">{'🪙'.repeat(Math.max(1, goldBars))}</div>
                      </div>
                      <div className="text-gray-500 text-xs">GOLD +{score}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── STEP 4: 최종 목표 선택 / Final goal selection ─── */}
          {step === 4 && (
            <div>
              <p className="text-gray-400 text-xs mb-4">메인 퀘스트를 선택하세요. Choose your main quest.</p>
              <div className="space-y-2">
                {goalOptions.map((goal, idx) => {
                  const questIcons = ['📚', '⚒️', '🏆', '🎓', '👑'];
                  return (
                    <button
                      key={goal}
                      onClick={() => handleNext(goal)}
                      className="w-full bg-gray-800 hover:bg-purple-900/30 border border-gray-700 hover:border-purple-500 rounded-lg px-4 py-3 text-left transition-all duration-200 group flex items-center gap-3"
                    >
                      <div className="text-2xl shrink-0">{questIcons[idx]}</div>
                      <div>
                        <div className="text-gray-300 group-hover:text-purple-300 text-sm font-semibold">{goal}</div>
                        <div className="text-gray-500 text-xs">퀘스트 레벨 {idx + 1}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 ml-auto shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── STEP 5: 우선순위 / 클래스 선택 / Priority / Class selection ─── */}
          {step === 5 && (
            <div>
              <p className="text-gray-400 text-xs mb-4">전투 클래스를 선택하세요. Choose your battle class.</p>
              <div className="grid grid-cols-2 gap-3">
                {priorityOptions.map((priority) => {
                  const cls = CLASS_MAP[priority];
                  return (
                    <button
                      key={priority}
                      onClick={() => handleNext(priority)}
                      className={`bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500 rounded-xl p-4 text-center transition-all duration-200 group hover:shadow-lg hover:shadow-orange-900/30`}
                    >
                      <div className="text-4xl mb-2">{cls?.icon ?? '⚔️'}</div>
                      <div className="text-amber-300 font-bold text-sm group-hover:text-amber-200">{cls?.name ?? priority}</div>
                      <div className="text-gray-500 text-xs mt-1 leading-tight">{priority}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* KOR: 하단 힌트 / ENG: Bottom hint */}
        <div className="text-center mt-4 text-gray-600 text-xs">
          <Flame className="w-3 h-3 inline mr-1 text-orange-700" />
          항목을 선택하면 자동으로 다음 스텝으로 이동합니다
        </div>
      </div>
    </div>
  );
}
