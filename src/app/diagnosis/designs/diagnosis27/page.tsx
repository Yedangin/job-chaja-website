'use client';

// 퍼즐 맞추기 비자 진단 디자인 (Design #27)
// Puzzle Piece Visa Diagnosis Design - click-to-place puzzle UI

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
  Puzzle,
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  GraduationCap,
  DollarSign,
  Target,
  Zap,
  Star,
  Clock,
  TrendingUp,
  Globe,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  User,
} from 'lucide-react';

// 퍼즐 조각 색상 팔레트 / Puzzle piece color palette
const PIECE_COLORS: Record<string, { bg: string; border: string; text: string; light: string }> = {
  nationality: { bg: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-600', light: 'bg-rose-50' },
  age: { bg: 'bg-violet-500', border: 'border-violet-400', text: 'text-violet-600', light: 'bg-violet-50' },
  education: { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-600', light: 'bg-blue-50' },
  fund: { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-600', light: 'bg-emerald-50' },
  goal: { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-600', light: 'bg-amber-50' },
  priority: { bg: 'bg-cyan-500', border: 'border-cyan-400', text: 'text-cyan-600', light: 'bg-cyan-50' },
};

// 퍼즐 단계 정의 / Puzzle step definitions
const STEPS = [
  { key: 'nationality', label: '국적', labelEn: 'Nationality', icon: Globe, color: 'nationality' },
  { key: 'age', label: '나이', labelEn: 'Age', icon: User, color: 'age' },
  { key: 'educationLevel', label: '학력', labelEn: 'Education', icon: GraduationCap, color: 'education' },
  { key: 'availableAnnualFund', label: '자금', labelEn: 'Funds', icon: DollarSign, color: 'fund' },
  { key: 'finalGoal', label: '목표', labelEn: 'Goal', icon: Target, color: 'goal' },
  { key: 'priorityPreference', label: '우선순위', labelEn: 'Priority', icon: Zap, color: 'priority' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

// SVG 퍼즐 조각 경로 생성 함수 / Generate SVG puzzle piece path
function PuzzlePieceShape({
  color,
  filled,
  index,
  total,
  size = 80,
}: {
  color: string;
  filled: boolean;
  index: number;
  total: number;
  size?: number;
}) {
  // 각 조각마다 약간 다른 탭 위치를 가짐 / Each piece has slightly different tab positions
  const tabVariants = [
    'M10,10 Q40,0 70,10 L70,35 Q80,50 70,65 L70,90 Q40,100 10,90 L10,65 Q0,50 10,35 Z',
    'M10,10 Q40,0 70,10 L70,35 Q80,50 70,65 L70,90 Q40,100 10,90 L10,65 Q20,50 10,35 Z',
    'M10,10 Q40,20 70,10 L70,35 Q80,50 70,65 L70,90 Q40,100 10,90 L10,65 Q0,50 10,35 Z',
    'M10,10 Q40,0 70,10 L70,35 Q60,50 70,65 L70,90 Q40,100 10,90 L10,65 Q0,50 10,35 Z',
    'M10,10 Q40,0 70,10 L70,35 Q80,50 70,65 L70,90 Q40,80 10,90 L10,65 Q0,50 10,35 Z',
    'M10,10 Q40,0 70,10 L70,35 Q80,50 70,65 L70,90 Q40,100 10,90 L10,65 Q0,60 10,35 Z',
  ];

  const path = tabVariants[index % tabVariants.length];
  const scale = size / 100;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 100"
      className="drop-shadow-md"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      {/* 조각 배경 / Piece background */}
      <path
        d={path}
        className={filled ? color : 'fill-gray-200'}
        style={{ transition: 'fill 0.3s ease' }}
      />
      {/* 광택 효과 / Gloss effect */}
      {filled && (
        <path
          d="M15,15 Q40,8 65,15 L65,35 Q72,45 65,55 L55,55 Q45,48 35,55 L15,55 Z"
          fill="white"
          opacity="0.2"
        />
      )}
    </svg>
  );
}

// 완성 애니메이션 퍼즐 / Completed puzzle animation
function CompletedPuzzle() {
  return (
    <div className="relative flex items-center justify-center w-48 h-48 mx-auto">
      {/* 6개 조각을 3x2 그리드로 배치 / 6 pieces in 3x2 grid */}
      {STEPS.map((step, i) => {
        const colors = PIECE_COLORS[step.color];
        const row = Math.floor(i / 3);
        const col = i % 3;
        return (
          <div
            key={step.key}
            className={`absolute w-14 h-14 ${colors.bg} rounded-lg border-2 border-white shadow-md
              flex items-center justify-center`}
            style={{
              left: `${col * 52 + 8}px`,
              top: `${row * 52 + 8}px`,
              animation: `puzzleSnap 0.4s ease ${i * 0.1}s both`,
            }}
          >
            <step.icon className="w-6 h-6 text-white" />
          </div>
        );
      })}
      {/* 완성 오버레이 / Completion overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
      >
        <Sparkles className="w-10 h-10 text-yellow-400" />
      </div>
    </div>
  );
}

// 퍼즐 보드 (6칸 슬롯) / Puzzle board (6 slots)
function PuzzleBoard({
  filledSteps,
  currentStep,
  onSlotClick,
}: {
  filledSteps: Set<string>;
  currentStep: number;
  onSlotClick: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
      {STEPS.map((step, index) => {
        const isFilled = filledSteps.has(step.key);
        const isCurrent = index === currentStep;
        const colors = PIECE_COLORS[step.color];

        return (
          <button
            key={step.key}
            onClick={() => onSlotClick(index)}
            className={`
              relative aspect-square rounded-2xl border-2 transition-all duration-300
              flex flex-col items-center justify-center gap-1 p-2
              ${isFilled
                ? `${colors.light} ${colors.border} shadow-md`
                : isCurrent
                  ? 'border-dashed border-gray-400 bg-gray-50 animate-pulse'
                  : 'border-dashed border-gray-200 bg-white opacity-60'
              }
              ${isCurrent && !isFilled ? 'scale-105 shadow-lg' : ''}
            `}
          >
            {/* 잠금 / 해제 아이콘 / Lock/unlock icon */}
            {!isFilled && index > currentStep && (
              <Lock className="absolute top-1.5 right-1.5 w-3 h-3 text-gray-300" />
            )}
            {isFilled && (
              <Check className={`absolute top-1.5 right-1.5 w-3 h-3 ${colors.text}`} />
            )}

            {/* 단계 아이콘 / Step icon */}
            <step.icon
              className={`w-6 h-6 ${isFilled ? colors.text : isCurrent ? 'text-gray-500' : 'text-gray-300'}`}
            />

            {/* 단계 레이블 / Step label */}
            <span
              className={`text-xs font-medium ${
                isFilled ? colors.text : isCurrent ? 'text-gray-600' : 'text-gray-300'
              }`}
            >
              {step.label}
            </span>

            {/* 현재 단계 표시 점 / Current step dot */}
            {isCurrent && !isFilled && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// 국적 선택 패널 / Nationality selection panel
function NationalityPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {popularCountries.map((country) => (
        <button
          key={country.code}
          onClick={() => onChange(country.code)}
          className={`
            flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
            ${value === country.code
              ? 'border-rose-400 bg-rose-50 shadow-md scale-105'
              : 'border-gray-100 bg-white hover:border-rose-200 hover:bg-rose-50'
            }
          `}
        >
          <span className="text-xl">{country.flag}</span>
          <div className="text-left">
            <div className="text-xs font-semibold text-gray-700">{country.nameKo}</div>
            <div className="text-xs text-gray-400">{country.nameEn}</div>
          </div>
          {value === country.code && (
            <Check className="w-4 h-4 text-rose-500 ml-auto shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}

// 나이 선택 패널 / Age selection panel
function AgePanel({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [inputVal, setInputVal] = useState(String(value || ''));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputVal(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 15 && num <= 60) onChange(num);
  };

  const quickAges = [18, 20, 22, 24, 26, 28, 30, 35];

  return (
    <div className="space-y-4">
      {/* 직접 입력 / Direct input */}
      <div className="relative">
        <input
          type="number"
          min={15}
          max={60}
          value={inputVal}
          onChange={handleChange}
          placeholder="나이를 입력하세요 / Enter age"
          className="w-full px-4 py-3 text-2xl font-bold text-center text-violet-600 border-2 border-violet-200 rounded-2xl focus:outline-none focus:border-violet-400 bg-violet-50"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 text-lg font-medium">세</span>
      </div>

      {/* 빠른 선택 / Quick selection */}
      <div className="grid grid-cols-4 gap-2">
        {quickAges.map((age) => (
          <button
            key={age}
            onClick={() => { setInputVal(String(age)); onChange(age); }}
            className={`
              py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${value === age
                ? 'bg-violet-500 text-white shadow-md'
                : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
              }
            `}
          >
            {age}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">15~60세 입력 가능 / Ages 15-60</p>
    </div>
  );
}

// 학력 선택 패널 / Education selection panel
function EducationPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {educationOptions.map((edu) => (
        <button
          key={edu.value}
          onClick={() => onChange(edu.value)}
          className={`
            w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
            ${value === edu.value
              ? 'border-blue-400 bg-blue-50 shadow-md'
              : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50'
            }
          `}
        >
          <span className="text-xl w-8">{edu.emoji}</span>
          <div className="text-left flex-1">
            <div className="text-sm font-semibold text-gray-700">{edu.labelKo}</div>
            <div className="text-xs text-gray-400">{edu.labelEn}</div>
          </div>
          {value === edu.value && (
            <Check className="w-4 h-4 text-blue-500 shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}

// 자금 선택 패널 / Fund selection panel
function FundPanel({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      {fundOptions.map((fund) => (
        <button
          key={fund.value}
          onClick={() => onChange(fund.value)}
          className={`
            w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
            ${value === fund.value
              ? 'border-emerald-400 bg-emerald-50 shadow-md'
              : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50'
            }
          `}
        >
          <span className={`text-lg font-bold ${value === fund.value ? 'text-emerald-600' : 'text-gray-400'}`}>
            ₩
          </span>
          <div className="text-left flex-1">
            <div className="text-sm font-semibold text-gray-700">{fund.labelKo}</div>
            <div className="text-xs text-gray-400">{fund.labelEn}</div>
          </div>
          {value === fund.value && (
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
}

// 목표 선택 패널 / Goal selection panel
function GoalPanel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {goalOptions.map((goal) => (
        <button
          key={goal.value}
          onClick={() => onChange(goal.value)}
          className={`
            flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200
            ${value === goal.value
              ? 'border-amber-400 bg-amber-50 shadow-md scale-105'
              : 'border-gray-100 bg-white hover:border-amber-200 hover:bg-amber-50'
            }
          `}
        >
          <span className="text-3xl">{goal.emoji}</span>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-700">{goal.labelKo}</div>
            <div className="text-xs text-gray-400 mt-0.5">{goal.descKo}</div>
          </div>
          {value === goal.value && (
            <Check className="w-4 h-4 text-amber-500" />
          )}
        </button>
      ))}
    </div>
  );
}

// 우선순위 선택 패널 / Priority selection panel
function PriorityPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {priorityOptions.map((prio) => (
        <button
          key={prio.value}
          onClick={() => onChange(prio.value)}
          className={`
            flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200
            ${value === prio.value
              ? 'border-cyan-400 bg-cyan-50 shadow-md scale-105'
              : 'border-gray-100 bg-white hover:border-cyan-200 hover:bg-cyan-50'
            }
          `}
        >
          <span className="text-3xl">{prio.emoji}</span>
          <div className="text-center">
            <div className="text-sm font-bold text-gray-700">{prio.labelKo}</div>
            <div className="text-xs text-gray-400 mt-0.5">{prio.descKo}</div>
          </div>
          {value === prio.value && (
            <Check className="w-4 h-4 text-cyan-500" />
          )}
        </button>
      ))}
    </div>
  );
}

// 퍼즐 조각 카드 (입력 패널) / Puzzle piece card (input panel)
function PuzzlePieceCard({
  step,
  input,
  onUpdate,
}: {
  step: (typeof STEPS)[number];
  input: Partial<DiagnosisInput>;
  onUpdate: (key: StepKey, value: string | number) => void;
}) {
  const colors = PIECE_COLORS[step.color];

  return (
    <div className={`rounded-3xl border-2 ${colors.border} bg-white shadow-xl overflow-hidden`}>
      {/* 카드 헤더 / Card header */}
      <div className={`${colors.bg} px-5 py-4 flex items-center gap-3`}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <step.icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-base">{step.label}</h3>
          <p className="text-white/70 text-xs">{step.labelEn}</p>
        </div>
        {/* 퍼즐 조각 장식 / Puzzle piece decoration */}
        <div className="ml-auto">
          <Puzzle className="w-6 h-6 text-white/40" />
        </div>
      </div>

      {/* 선택 패널 / Selection panel */}
      <div className="p-4 max-h-72 overflow-y-auto">
        {step.key === 'nationality' && (
          <NationalityPanel
            value={input.nationality ?? ''}
            onChange={(v) => onUpdate('nationality', v)}
          />
        )}
        {step.key === 'age' && (
          <AgePanel
            value={input.age ?? 0}
            onChange={(v) => onUpdate('age', v)}
          />
        )}
        {step.key === 'educationLevel' && (
          <EducationPanel
            value={input.educationLevel ?? ''}
            onChange={(v) => onUpdate('educationLevel', v)}
          />
        )}
        {step.key === 'availableAnnualFund' && (
          <FundPanel
            value={input.availableAnnualFund ?? 0}
            onChange={(v) => onUpdate('availableAnnualFund', v)}
          />
        )}
        {step.key === 'finalGoal' && (
          <GoalPanel
            value={input.finalGoal ?? ''}
            onChange={(v) => onUpdate('finalGoal', v)}
          />
        )}
        {step.key === 'priorityPreference' && (
          <PriorityPanel
            value={input.priorityPreference ?? ''}
            onChange={(v) => onUpdate('priorityPreference', v)}
          />
        )}
      </div>
    </div>
  );
}

// 비자 경로 카드 / Visa pathway card
function PathwayCard({
  pathway,
  index,
  isExpanded,
  onToggle,
}: {
  pathway: CompatPathway;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const scoreColor = getScoreColor(pathway.finalScore);
  const feasEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // 경로별 색상 / Pathway colors
  const cardColors = [
    'from-rose-500 to-pink-500',
    'from-violet-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
  ];

  const gradient = cardColors[index % cardColors.length];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-md overflow-hidden">
      {/* 카드 상단 그라디언트 바 / Card top gradient bar */}
      <div className={`h-1.5 bg-linear-to-br ${gradient}`} />

      <div className="p-4">
        {/* 헤더 행 / Header row */}
        <div className="flex items-start gap-3">
          {/* 순위 배지 / Rank badge */}
          <div
            className={`shrink-0 w-8 h-8 rounded-full bg-linear-to-br ${gradient}
              flex items-center justify-center text-white font-bold text-sm`}
          >
            {index + 1}
          </div>

          {/* 이름 / Name */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-sm leading-tight">{pathway.nameKo}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{pathway.nameEn}</p>

            {/* 비자 체인 / Visa chain */}
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                <React.Fragment key={i}>
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">
                    {v.code}
                  </span>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 점수 / Score */}
          <div className="text-right shrink-0">
            <div className="text-xl font-black" style={{ color: scoreColor }}>
              {pathway.finalScore}
            </div>
            <div className="text-xs text-gray-400">점수</div>
            <div className="text-sm mt-0.5">{feasEmoji} {pathway.feasibilityLabel}</div>
          </div>
        </div>

        {/* 메타 정보 / Meta info */}
        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{pathway.estimatedMonths}개월</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <DollarSign className="w-3 h-3" />
            <span>
              {pathway.estimatedCostWon === 0
                ? '무료'
                : `${pathway.estimatedCostWon.toLocaleString()}만원`}
            </span>
          </div>
        </div>

        {/* 확장 버튼 / Expand button */}
        <button
          onClick={onToggle}
          className="w-full mt-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isExpanded ? '접기' : '자세히 보기'}
          <ChevronRight
            className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>

        {/* 확장 상세 / Expanded details */}
        {isExpanded && (
          <div className="mt-4 space-y-3 border-t border-gray-50 pt-3">
            {/* 마일스톤 / Milestones */}
            <div>
              <p className="text-xs font-bold text-gray-600 mb-2">
                단계별 로드맵 / Step-by-step Roadmap
              </p>
              <div className="space-y-2">
                {pathway.milestones.map((m, mi) => (
                  <div key={mi} className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                          ${mi === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                      >
                        {mi + 1}
                      </div>
                      {mi < pathway.milestones.length - 1 && (
                        <div className="w-0.5 h-4 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="text-xs font-semibold text-gray-700">{m.nameKo}</div>
                      <div className="text-xs text-gray-400">
                        {m.monthFromStart}개월째 · {m.visaStatus || '비자없음'}
                        {m.canWorkPartTime && ` · 주${m.weeklyHours}시간 근무가능`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 다음 단계 / Next steps */}
            {pathway.nextSteps.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-600 mb-2">
                  즉시 할 일 / Immediate Actions
                </p>
                {pathway.nextSteps.map((ns, ni) => (
                  <div key={ni} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                    <Zap className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-blue-700">{ns.nameKo}</div>
                      <div className="text-xs text-blue-500 mt-0.5">{ns.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 참고 / Note */}
            {pathway.note && (
              <div className="p-2 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">참고 / Note: </span>
                  {pathway.note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 결과 화면 / Result screen
function ResultScreen({
  input,
  onReset,
}: {
  input: Partial<DiagnosisInput>;
  onReset: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 선택된 국가 찾기 / Find selected country
  const country = popularCountries.find((c) => c.code === input.nationality);
  const education = educationOptions.find((e) => e.value === input.educationLevel);
  const goal = goalOptions.find((g) => g.value === input.finalGoal);

  return (
    <div className="space-y-5">
      {/* 완성 퍼즐 헤더 / Completed puzzle header */}
      <div className="rounded-3xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 text-center">
        <CompletedPuzzle />
        <div className="mt-4 text-white">
          <h2 className="text-xl font-black">퍼즐 완성!</h2>
          <p className="text-white/80 text-sm mt-1">Puzzle Complete!</p>
          <p className="text-white/90 text-sm mt-2">
            {country?.flag} {country?.nameKo} · {input.age}세 · {education?.labelKo}
          </p>
          <p className="text-white/90 text-xs mt-1">
            목표: {goal?.labelKo} · {goal?.descKo}
          </p>
        </div>
      </div>

      {/* 통계 요약 / Stats summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white border border-gray-100 p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-indigo-600">
            {mockDiagnosisResult.meta.totalPathwaysEvaluated}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">평가 경로</div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-emerald-600">
            {mockDiagnosisResult.pathways.length}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">추천 경로</div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-rose-600">
            {mockDiagnosisResult.meta.hardFilteredOut}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">필터 제거</div>
        </div>
      </div>

      {/* 경로 카드 목록 / Pathway card list */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          맞춤 비자 로드맵 / Personalized Visa Roadmaps
        </h3>
        <div className="space-y-3">
          {mockPathways.map((pathway, index) => (
            <PathwayCard
              key={pathway.id}
              pathway={pathway}
              index={index}
              isExpanded={expandedId === pathway.id}
              onToggle={() =>
                setExpandedId(expandedId === pathway.id ? null : pathway.id)
              }
            />
          ))}
        </div>
      </div>

      {/* 다시 시작 버튼 / Restart button */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-600 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        퍼즐 다시 맞추기 / Restart Puzzle
      </button>
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis27Page() {
  // 입력 상태 / Input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({
    nationality: mockInput.nationality,
    age: mockInput.age,
    educationLevel: mockInput.educationLevel,
    availableAnnualFund: mockInput.availableAnnualFund,
    finalGoal: mockInput.finalGoal,
    priorityPreference: mockInput.priorityPreference,
  });

  // 현재 활성 퍼즐 조각 / Currently active puzzle piece
  const [currentStep, setCurrentStep] = useState(0);

  // 완료된 단계 추적 / Track completed steps
  const [filledSteps, setFilledSteps] = useState<Set<string>>(new Set());

  // 결과 표시 여부 / Whether to show results
  const [showResult, setShowResult] = useState(false);

  // 힌트 표시 여부 / Hint visibility
  const [showHint, setShowHint] = useState(false);

  // 조각 배치 애니메이션 상태 / Piece placement animation
  const [placingStep, setPlacingStep] = useState<string | null>(null);

  // 현재 단계 정보 / Current step info
  const currentStepInfo = STEPS[currentStep];

  // 현재 단계가 값이 있는지 확인 / Check if current step has a value
  const getCurrentValue = () => {
    if (!currentStepInfo) return null;
    return input[currentStepInfo.key as keyof DiagnosisInput];
  };

  // 값 업데이트 핸들러 / Value update handler
  const handleUpdate = (key: StepKey, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // 조각 확정 (다음으로) / Confirm piece (go to next)
  const handleConfirmPiece = () => {
    if (!currentStepInfo) return;
    const val = getCurrentValue();
    if (val === undefined || val === null || val === '' || val === 0) return;

    // 배치 애니메이션 트리거 / Trigger placement animation
    setPlacingStep(currentStepInfo.key);
    setTimeout(() => setPlacingStep(null), 400);

    setFilledSteps((prev) => {
      const next = new Set(prev);
      next.add(currentStepInfo.key);
      return next;
    });

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // 슬롯 클릭 핸들러 / Slot click handler
  const handleSlotClick = (index: number) => {
    if (index <= currentStep || filledSteps.has(STEPS[index].key)) {
      setCurrentStep(index);
    }
  };

  // 퍼즐 완성 조건 / Puzzle completion condition
  const allFilled = STEPS.every((s) => filledSteps.has(s.key));

  // 현재 단계에 값이 있는지 / Current step has value
  const hasCurrentValue = () => {
    const val = getCurrentValue();
    if (val === undefined || val === null || val === '') return false;
    if (typeof val === 'number' && val === 0 && currentStepInfo?.key !== 'availableAnnualFund') return false;
    return true;
  };

  // 진행률 / Progress
  const progress = Math.round((filledSteps.size / STEPS.length) * 100);

  // 진단 시작 / Start diagnosis
  const handleDiagnose = () => {
    setShowResult(true);
  };

  // 리셋 / Reset
  const handleReset = () => {
    setInput({
      nationality: '',
      age: 0,
      educationLevel: '',
      availableAnnualFund: 0,
      finalGoal: '',
      priorityPreference: '',
    });
    setCurrentStep(0);
    setFilledSteps(new Set());
    setShowResult(false);
    setShowHint(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-indigo-50">
      {/* 상단 헤더 / Top header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center">
              <Puzzle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-gray-800">잡차자 비자 퍼즐</h1>
              <p className="text-xs text-gray-400">Visa Puzzle Diagnosis</p>
            </div>
          </div>

          {/* 진행률 바 / Progress bar */}
          {!showResult && (
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-br from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-indigo-600">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 / Main content */}
      <div className="max-w-md mx-auto px-4 py-5 pb-24">
        {showResult ? (
          /* 결과 화면 / Result screen */
          <ResultScreen input={input} onReset={handleReset} />
        ) : (
          /* 입력 화면 / Input screen */
          <div className="space-y-5">
            {/* 퍼즐 보드 / Puzzle board */}
            <div className="bg-white rounded-3xl shadow-md p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700">
                  나의 비자 퍼즐 / My Visa Puzzle
                </h2>
                {/* 힌트 버튼 / Hint button */}
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-xs font-medium hover:bg-amber-100"
                >
                  <Star className="w-3 h-3" />
                  힌트
                </button>
              </div>

              {/* 힌트 박스 / Hint box */}
              {showHint && (
                <div className="mb-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-700">
                    <span className="font-bold">힌트 / Hint:</span>{' '}
                    각 퍼즐 조각을 선택하여 나의 조건을 입력하세요.
                    모든 조각이 채워지면 비자 로드맵이 완성됩니다!
                  </p>
                  <p className="text-xs text-amber-500 mt-1">
                    Select each puzzle piece to enter your conditions.
                    When all pieces are filled, your visa roadmap will be complete!
                  </p>
                </div>
              )}

              <PuzzleBoard
                filledSteps={filledSteps}
                currentStep={currentStep}
                onSlotClick={handleSlotClick}
              />
            </div>

            {/* 현재 단계 입력 카드 / Current step input card */}
            {currentStepInfo && (
              <div
                className={`transition-all duration-300 ${
                  placingStep === currentStepInfo.key ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
                }`}
              >
                <PuzzlePieceCard
                  step={currentStepInfo}
                  input={input}
                  onUpdate={handleUpdate}
                />
              </div>
            )}

            {/* 네비게이션 버튼 / Navigation buttons */}
            <div className="flex gap-3">
              {/* 이전 버튼 / Previous button */}
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </button>
              )}

              {/* 조각 배치 / 다음 버튼 / Place piece / Next button */}
              {!allFilled ? (
                <button
                  onClick={handleConfirmPiece}
                  disabled={!hasCurrentValue()}
                  className={`
                    flex-1 py-3 rounded-2xl font-bold text-sm
                    flex items-center justify-center gap-2 transition-all duration-200
                    ${hasCurrentValue()
                      ? `bg-linear-to-br ${PIECE_COLORS[currentStepInfo?.color ?? 'nationality'].bg}
                         text-white shadow-lg hover:shadow-xl hover:scale-105`
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  <Puzzle className="w-4 h-4" />
                  {filledSteps.has(currentStepInfo?.key ?? '') ? '수정 완료' : '조각 배치!'}
                  {hasCurrentValue() && <span className="text-white/70">→</span>}
                </button>
              ) : (
                /* 완성 → 진단 버튼 / Complete → Diagnose button */
                <button
                  onClick={handleDiagnose}
                  className="flex-1 py-4 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 text-white font-black text-sm shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5" />
                  비자 로드맵 완성!
                  <TrendingUp className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 입력 요약 (완료된 조각들) / Input summary (completed pieces) */}
            {filledSteps.size > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  배치된 조각 / Placed Pieces
                </h3>
                <div className="space-y-1.5">
                  {STEPS.filter((s) => filledSteps.has(s.key)).map((step) => {
                    const colors = PIECE_COLORS[step.color];
                    let displayValue = '';

                    if (step.key === 'nationality') {
                      const c = popularCountries.find((x) => x.code === input.nationality);
                      displayValue = c ? `${c.flag} ${c.nameKo}` : '';
                    } else if (step.key === 'age') {
                      displayValue = `${input.age}세`;
                    } else if (step.key === 'educationLevel') {
                      const e = educationOptions.find((x) => x.value === input.educationLevel);
                      displayValue = e ? e.labelKo : '';
                    } else if (step.key === 'availableAnnualFund') {
                      const f = fundOptions.find((x) => x.value === input.availableAnnualFund);
                      displayValue = f ? f.labelKo : '';
                    } else if (step.key === 'finalGoal') {
                      const g = goalOptions.find((x) => x.value === input.finalGoal);
                      displayValue = g ? `${g.emoji} ${g.labelKo}` : '';
                    } else if (step.key === 'priorityPreference') {
                      const p = priorityOptions.find((x) => x.value === input.priorityPreference);
                      displayValue = p ? `${p.emoji} ${p.labelKo}` : '';
                    }

                    return (
                      <div key={step.key} className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-md ${colors.bg}
                            flex items-center justify-center shrink-0`}
                        >
                          <step.icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-gray-500">{step.label}</span>
                        <span className={`text-xs font-semibold ${colors.text} ml-auto`}>
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 남은 조각 수 / Remaining pieces count */}
                {filledSteps.size < STEPS.length && (
                  <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-gray-300" />
                    <span className="text-xs text-gray-400">
                      {STEPS.length - filledSteps.size}개 조각 남음 / {STEPS.length - filledSteps.size} pieces remaining
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSS 애니메이션 / CSS animations */}
      <style jsx global>{`
        @keyframes puzzleSnap {
          0% { transform: scale(0) rotate(45deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(-5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
