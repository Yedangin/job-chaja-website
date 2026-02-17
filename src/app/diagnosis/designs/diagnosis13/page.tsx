'use client';

// 비자 진단 - 타임라인 폼 디자인 (#13)
// Visa Diagnosis - Timeline Form Design (#13)

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
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Target,
  Zap,
  Globe,
  GraduationCap,
  Wallet,
  Flag,
  User,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle2,
  Circle,
  MapPin,
  Award,
  BarChart2,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

interface StepConfig {
  id: string;
  stepNumber: number;
  titleKo: string;
  titleEn: string;
  field: keyof DiagnosisInput;
  icon: React.ReactNode;
}

// 각 입력 단계의 상태 / State for each input step
type StepStatus = 'pending' | 'active' | 'completed';

// ============================================================
// 상수: 타임라인 단계 구성 / Constants: Timeline step configuration
// ============================================================

const TIMELINE_STEPS: StepConfig[] = [
  {
    id: 'nationality',
    stepNumber: 1,
    titleKo: '국적',
    titleEn: 'Nationality',
    field: 'nationality',
    icon: <Globe size={18} />,
  },
  {
    id: 'age',
    stepNumber: 2,
    titleKo: '나이',
    titleEn: 'Age',
    field: 'age',
    icon: <User size={18} />,
  },
  {
    id: 'educationLevel',
    stepNumber: 3,
    titleKo: '학력',
    titleEn: 'Education',
    field: 'educationLevel',
    icon: <GraduationCap size={18} />,
  },
  {
    id: 'availableAnnualFund',
    stepNumber: 4,
    titleKo: '연간 가용 자금',
    titleEn: 'Annual Budget',
    field: 'availableAnnualFund',
    icon: <Wallet size={18} />,
  },
  {
    id: 'finalGoal',
    stepNumber: 5,
    titleKo: '최종 목표',
    titleEn: 'Final Goal',
    field: 'finalGoal',
    icon: <Target size={18} />,
  },
  {
    id: 'priorityPreference',
    stepNumber: 6,
    titleKo: '우선순위',
    titleEn: 'Priority',
    field: 'priorityPreference',
    icon: <Zap size={18} />,
  },
];

// ============================================================
// 유틸 함수 / Utility functions
// ============================================================

// 입력 값의 표시 레이블 반환 / Return display label for input value
function getDisplayLabel(field: keyof DiagnosisInput, value: DiagnosisInput[keyof DiagnosisInput]): string {
  if (field === 'nationality') {
    const country = popularCountries.find((c) => c.code === value);
    return country ? `${country.flag} ${country.nameKo}` : String(value);
  }
  if (field === 'age') {
    return `${value}세`;
  }
  if (field === 'educationLevel') {
    const edu = educationOptions.find((e) => e.value === value);
    return edu ? `${edu.emoji} ${edu.labelKo}` : String(value);
  }
  if (field === 'availableAnnualFund') {
    const fund = fundOptions.find((f) => f.value === value);
    return fund ? fund.labelKo : String(value);
  }
  if (field === 'finalGoal') {
    const goal = goalOptions.find((g) => g.value === value);
    return goal ? `${goal.emoji} ${goal.labelKo}` : String(value);
  }
  if (field === 'priorityPreference') {
    const priority = priorityOptions.find((p) => p.value === value);
    return priority ? `${priority.emoji} ${priority.labelKo}` : String(value);
  }
  return String(value);
}

// 점수에 따른 배지 배경 클래스 / Badge background class by score
function getScoreBadgeClass(score: number): string {
  if (score >= 51) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 31) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (score >= 11) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

// 비용 포맷 / Format cost
function formatCost(costWon: number): string {
  if (costWon === 0) return '무료';
  if (costWon >= 10000) return `${(costWon / 10000).toFixed(0)}억원 대`;
  if (costWon >= 1000) return `${(costWon / 1000).toFixed(1)}천만원 대`;
  return `${costWon}만원 대`;
}

// ============================================================
// 서브 컴포넌트: 타임라인 노드 / Sub-component: Timeline node
// ============================================================

interface TimelineNodeProps {
  step: StepConfig;
  status: StepStatus;
  displayValue: string;
  isLast: boolean;
  onClick: () => void;
}

function TimelineNode({ step, status, displayValue, isLast, onClick }: TimelineNodeProps): React.ReactElement {
  // 상태별 스타일 / Styles by status
  const nodeStyles: Record<StepStatus, string> = {
    pending: 'bg-gray-100 border-gray-200 text-gray-400',
    active: 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200',
    completed: 'bg-green-500 border-green-500 text-white',
  };

  const lineStyles: Record<StepStatus, string> = {
    pending: 'bg-gray-200',
    active: 'bg-linear-to-b from-green-400 to-gray-200',
    completed: 'bg-green-400',
  };

  return (
    <div className="flex gap-4">
      {/* 노드 + 라인 열 / Node + line column */}
      <div className="flex flex-col items-center shrink-0">
        {/* 노드 원 / Node circle */}
        <button
          onClick={status === 'completed' ? onClick : undefined}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${nodeStyles[status]} ${status === 'completed' ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          {status === 'completed' ? (
            <Check size={16} strokeWidth={3} />
          ) : status === 'active' ? (
            <span className="text-sm font-bold">{step.stepNumber}</span>
          ) : (
            <span className="text-sm font-medium text-gray-400">{step.stepNumber}</span>
          )}
        </button>

        {/* 연결 라인 / Connector line */}
        {!isLast && (
          <div className={`w-0.5 flex-1 min-h-6 mt-1 transition-all duration-500 ${lineStyles[status]}`} />
        )}
      </div>

      {/* 콘텐츠 열 / Content column */}
      <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
        {/* 단계 헤더 / Step header */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium transition-colors duration-200 ${status === 'active' ? 'text-green-600' : status === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
            STEP {step.stepNumber}
          </span>
          {status === 'completed' && (
            <span className="text-xs text-green-500 font-medium">완료</span>
          )}
        </div>

        {/* 단계 제목 / Step title */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`transition-colors duration-200 ${status === 'active' ? 'text-green-600' : status === 'completed' ? 'text-gray-600' : 'text-gray-300'}`}>
            {step.icon}
          </span>
          <h3 className={`text-base font-semibold transition-colors duration-200 ${status === 'active' ? 'text-gray-900' : status === 'completed' ? 'text-gray-700' : 'text-gray-300'}`}>
            {step.titleKo}
          </h3>
        </div>

        {/* 완료된 경우 선택 값 표시 / Show selected value if completed */}
        {status === 'completed' && displayValue && (
          <div
            onClick={onClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium cursor-pointer hover:bg-green-100 transition-colors duration-150"
          >
            <span>{displayValue}</span>
            <CheckCircle2 size={14} className="text-green-500" />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 입력 패널 / Sub-component: Input panel
// ============================================================

interface InputPanelProps {
  currentStep: number;
  formData: Partial<DiagnosisInput>;
  ageInput: string;
  onAgeInputChange: (val: string) => void;
  onSelect: (field: keyof DiagnosisInput, value: DiagnosisInput[keyof DiagnosisInput]) => void;
}

function InputPanel({
  currentStep,
  formData,
  ageInput,
  onAgeInputChange,
  onSelect,
}: InputPanelProps): React.ReactElement | null {
  const step = TIMELINE_STEPS[currentStep - 1];
  if (!step) return null;

  // 국적 선택 패널 / Nationality selection panel
  if (step.field === 'nationality') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 animate-fadeIn">
        <p className="text-sm text-gray-500 mb-4">어느 나라에서 오셨나요? / Where are you from?</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {popularCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => onSelect('nationality', country.code)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-150 hover:border-green-300 hover:bg-green-50 ${
                formData.nationality === country.code
                  ? 'border-green-500 bg-green-50 shadow-sm'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <span className="text-2xl">{country.flag}</span>
              <span className="text-xs font-medium text-gray-700">{country.nameKo}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 나이 입력 패널 / Age input panel
  if (step.field === 'age') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 animate-fadeIn">
        <p className="text-sm text-gray-500 mb-4">나이를 입력해주세요 / Please enter your age</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={ageInput}
            onChange={(e) => onAgeInputChange(e.target.value)}
            placeholder="예: 25"
            min={16}
            max={65}
            className="w-32 px-4 py-3 text-2xl font-bold text-center border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors duration-150"
          />
          <span className="text-gray-500 font-medium">세 (세)</span>
          <button
            onClick={() => {
              const parsed = parseInt(ageInput, 10);
              if (!isNaN(parsed) && parsed >= 16 && parsed <= 65) {
                onSelect('age', parsed);
              }
            }}
            className="ml-auto px-5 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors duration-150 flex items-center gap-2"
          >
            다음
            <ChevronRight size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">16세 ~ 65세 사이로 입력해주세요 / Please enter between 16-65</p>
      </div>
    );
  }

  // 학력 선택 패널 / Education selection panel
  if (step.field === 'educationLevel') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 animate-fadeIn">
        <p className="text-sm text-gray-500 mb-4">최종 학력을 선택해주세요 / Select your highest education level</p>
        <div className="flex flex-col gap-2">
          {educationOptions.map((edu) => (
            <button
              key={edu.value}
              onClick={() => onSelect('educationLevel', edu.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 hover:border-green-300 hover:bg-green-50 text-left ${
                formData.educationLevel === edu.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <span className="text-xl w-8 text-center">{edu.emoji || '📋'}</span>
              <div>
                <span className="font-medium text-gray-800">{edu.labelKo}</span>
                <span className="ml-2 text-xs text-gray-400">{edu.labelEn}</span>
              </div>
              {formData.educationLevel === edu.value && (
                <CheckCircle2 size={16} className="ml-auto text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 자금 선택 패널 / Fund selection panel
  if (step.field === 'availableAnnualFund') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 animate-fadeIn">
        <p className="text-sm text-gray-500 mb-4">한국에서 생활/공부에 쓸 수 있는 연간 자금 / Annual budget available for living/studying in Korea</p>
        <div className="flex flex-col gap-2">
          {fundOptions.map((fund) => (
            <button
              key={fund.value}
              onClick={() => onSelect('availableAnnualFund', fund.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 hover:border-green-300 hover:bg-green-50 text-left ${
                formData.availableAnnualFund === fund.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <DollarSign size={16} className="text-green-500 shrink-0" />
              <div>
                <span className="font-medium text-gray-800">{fund.labelKo}</span>
                <span className="ml-2 text-xs text-gray-400">{fund.labelEn}</span>
              </div>
              {formData.availableAnnualFund === fund.value && (
                <CheckCircle2 size={16} className="ml-auto text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 목표 선택 패널 / Goal selection panel
  if (step.field === 'finalGoal') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 animate-fadeIn">
        <p className="text-sm text-gray-500 mb-4">한국에서 이루고 싶은 목표는? / What is your goal in Korea?</p>
        <div className="grid grid-cols-2 gap-3">
          {goalOptions.map((goal) => (
            <button
              key={goal.value}
              onClick={() => onSelect('finalGoal', goal.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 hover:border-green-300 hover:bg-green-50 ${
                formData.finalGoal === goal.value
                  ? 'border-green-500 bg-green-50 shadow-sm'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <span className="text-3xl">{goal.emoji}</span>
              <span className="font-semibold text-gray-800 text-sm">{goal.labelKo}</span>
              <span className="text-xs text-gray-400 text-center leading-tight">{goal.descKo}</span>
              {formData.finalGoal === goal.value && (
                <CheckCircle2 size={14} className="text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 우선순위 선택 패널 / Priority selection panel
  if (step.field === 'priorityPreference') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 animate-fadeIn">
        <p className="text-sm text-gray-500 mb-4">어떤 방향을 가장 중요하게 생각하나요? / What direction matters most to you?</p>
        <div className="flex flex-col gap-3">
          {priorityOptions.map((priority) => (
            <button
              key={priority.value}
              onClick={() => onSelect('priorityPreference', priority.value)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-150 hover:border-green-300 hover:bg-green-50 text-left ${
                formData.priorityPreference === priority.value
                  ? 'border-green-500 bg-green-50 shadow-sm'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <span className="text-2xl">{priority.emoji}</span>
              <div className="flex-1">
                <span className="font-semibold text-gray-800">{priority.labelKo}</span>
                <p className="text-xs text-gray-400 mt-0.5">{priority.descKo}</p>
              </div>
              {formData.priorityPreference === priority.value && (
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================
// 서브 컴포넌트: 결과 카드 / Sub-component: Result card
// ============================================================

interface ResultCardProps {
  pathway: RecommendedPathway;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function ResultCard({ pathway, rank, isExpanded, onToggle }: ResultCardProps): React.ReactElement {
  const scoreColor = getScoreColor(pathway.finalScore);
  const feasEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);
  const badgeClass = getScoreBadgeClass(pathway.finalScore);

  return (
    <div className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${rank === 1 ? 'border-green-300 shadow-md' : 'border-gray-100 shadow-sm'}`}>
      {/* 카드 헤더 / Card header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          {/* 순위 배지 / Rank badge */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${rank === 1 ? 'bg-green-500 text-white' : rank === 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
            {rank}
          </div>

          {/* 제목 및 메타 / Title and meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 text-sm leading-snug">{pathway.nameKo}</h3>
              {rank === 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  <Star size={10} fill="currentColor" />
                  추천
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{pathway.nameEn}</p>

            {/* 비자 체인 / Visa chain */}
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {pathway.visaChain.split(' → ').map((visa, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                    {visa}
                  </span>
                  {idx < arr.length - 1 && (
                    <ArrowRight size={10} className="text-gray-300 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 점수 + 펼치기 / Score + expand */}
          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-2.5 py-1 rounded-lg border text-sm font-bold ${badgeClass}`}>
              {feasEmoji} {pathway.finalScore}점
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* 요약 지표 / Summary metrics */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-gray-400" />
            <span className="text-xs text-gray-500">{pathway.estimatedMonths}개월</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign size={13} className="text-gray-400" />
            <span className="text-xs text-gray-500">{formatCost(pathway.estimatedCostWon)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-gray-400" />
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
              pathway.feasibilityLabel === '보통' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'
            }`}>
              {pathway.feasibilityLabel}
            </span>
          </div>
        </div>
      </div>

      {/* 펼쳐진 내용 / Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          {/* 마일스톤 타임라인 / Milestone timeline */}
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">진행 단계 / Milestones</h4>
          <div className="relative">
            {pathway.milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    milestone.type === 'final_goal'
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-green-300 text-green-600'
                  }`}>
                    {milestone.type === 'final_goal' ? <Check size={12} /> : idx + 1}
                  </div>
                  {idx < pathway.milestones.length - 1 && (
                    <div className="w-px flex-1 bg-green-200 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">{milestone.nameKo}</span>
                    {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                        {milestone.visaStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {milestone.monthFromStart === 0 ? '시작' : `${milestone.monthFromStart}개월 후`}
                    {milestone.canWorkPartTime && milestone.weeklyHours > 0 && (
                      <span className="ml-2 text-blue-500">알바 {milestone.weeklyHours}시간/주</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">지금 해야 할 일 / Next Steps</h4>
              <div className="flex flex-col gap-2">
                {pathway.nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-white rounded-xl border border-gray-100">
                    <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{step.nameKo}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 노트 / Note */}
          {pathway.note && (
            <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">{pathway.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 결과 화면 / Sub-component: Results screen
// ============================================================

interface ResultsScreenProps {
  formData: Partial<DiagnosisInput>;
  result: DiagnosisResult;
  onReset: () => void;
}

function ResultsScreen({ formData, result, onReset }: ResultsScreenProps): React.ReactElement {
  const [expandedId, setExpandedId] = useState<string | null>(result.pathways[0]?.pathwayId ?? null);

  // 국적 정보 / Nationality info
  const nationality = popularCountries.find((c) => c.code === formData.nationality);

  return (
    <div className="animate-fadeIn">
      {/* 결과 헤더 / Result header */}
      <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Award size={18} />
          <span className="text-sm font-semibold opacity-90">분석 완료 / Analysis Complete</span>
        </div>
        <h2 className="text-xl font-bold mb-1">
          {nationality ? `${nationality.flag} ${nationality.nameKo}` : ''}
          &nbsp;{formData.age}세 — 맞춤 경로
        </h2>
        <p className="text-green-100 text-sm">
          {result.meta.totalPathwaysEvaluated}개 경로 평가 중&nbsp;
          <strong className="text-white">{result.pathways.length}개</strong> 추천 경로 발견
        </p>

        {/* 완성된 타임라인 요약 / Completed timeline summary */}
        <div className="mt-4 pt-4 border-t border-green-400 border-opacity-40 grid grid-cols-3 gap-3">
          {[
            {
              label: '학력',
              value: educationOptions.find((e) => e.value === formData.educationLevel)?.labelKo ?? '-',
            },
            {
              label: '목표',
              value: goalOptions.find((g) => g.value === formData.finalGoal)?.labelKo ?? '-',
            },
            {
              label: '우선순위',
              value: priorityOptions.find((p) => p.value === formData.priorityPreference)?.labelKo ?? '-',
            },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xs text-green-200 mb-0.5">{item.label}</p>
              <p className="text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 경로 통계 요약 / Pathway statistics summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{result.pathways.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">추천 경로</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-600">
            {Math.min(...result.pathways.map((p) => p.estimatedMonths))}개월
          </p>
          <p className="text-xs text-gray-400 mt-0.5">최단 경로</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
          <p className="text-2xl font-bold text-amber-600">{result.pathways[0]?.finalScore ?? 0}점</p>
          <p className="text-xs text-gray-400 mt-0.5">최고 점수</p>
        </div>
      </div>

      {/* 경로 카드 목록 / Pathway card list */}
      <div className="flex flex-col gap-3 mb-6">
        {result.pathways.map((pathway, idx) => (
          <ResultCard
            key={pathway.pathwayId}
            pathway={pathway}
            rank={idx + 1}
            isExpanded={expandedId === pathway.pathwayId}
            onToggle={() => setExpandedId(expandedId === pathway.pathwayId ? null : pathway.pathwayId)}
          />
        ))}
      </div>

      {/* 다시 진단 버튼 / Restart diagnosis button */}
      <button
        onClick={onReset}
        className="w-full py-3.5 border-2 border-gray-200 rounded-2xl text-gray-600 font-semibold hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
      >
        다시 진단하기 / Start Over
      </button>
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis13Page(): React.ReactElement {
  // 폼 데이터 상태 / Form data state
  const [formData, setFormData] = useState<Partial<DiagnosisInput>>({});

  // 나이 문자열 입력 상태 (입력 중에는 문자열로 관리) / Age string input state
  const [ageInput, setAgeInput] = useState<string>('');

  // 현재 활성 단계 (1-6) / Current active step (1-6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 결과 표시 여부 / Whether results are shown
  const [showResult, setShowResult] = useState<boolean>(false);

  // 결과 데이터 / Result data
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);

  // 전체 진행도 (%) / Overall progress (%)
  const progressPercent = showResult ? 100 : Math.round(((currentStep - 1) / TIMELINE_STEPS.length) * 100);

  // 단계 상태 계산 / Calculate step status
  function getStepStatus(stepNumber: number): StepStatus {
    if (showResult) return 'completed';
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  }

  // 완료된 단계의 표시 값 / Display value for completed step
  function getCompletedValue(step: StepConfig): string {
    const value = formData[step.field];
    if (value === undefined || value === null) return '';
    return getDisplayLabel(step.field, value);
  }

  // 선택 처리 / Handle selection
  function handleSelect(field: keyof DiagnosisInput, value: DiagnosisInput[keyof DiagnosisInput]): void {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // 나이인 경우 유효성 검사 / Validate if age
    if (field === 'age') {
      const parsed = typeof value === 'number' ? value : parseInt(String(value), 10);
      if (isNaN(parsed) || parsed < 16 || parsed > 65) return;
    }

    // 다음 단계로 이동 / Move to next step
    const nextStep = currentStep + 1;
    if (nextStep > TIMELINE_STEPS.length) {
      // 모든 단계 완료 → 결과 표시 / All steps complete → show result
      setShowResult(true);
    } else {
      setCurrentStep(nextStep);
    }
  }

  // 단계 클릭 (수정) / Step click (edit)
  function handleStepEdit(stepNumber: number): void {
    if (showResult) {
      setShowResult(false);
      setCurrentStep(stepNumber);
    } else if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  }

  // 초기화 / Reset
  function handleReset(): void {
    setFormData({});
    setAgeInput('');
    setCurrentStep(1);
    setShowResult(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 최상단 진행 바 / Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
        <div
          className="h-full bg-linear-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-lg mx-auto px-4 py-12 pb-20">
        {/* 페이지 헤더 / Page header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-4">
            <BarChart2 size={14} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700">비자 경로 자동 분석</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">나에게 맞는 비자 경로</h1>
          <p className="text-gray-500 text-sm">6가지 정보를 입력하면 최적 경로를 알려드립니다</p>
          <p className="text-gray-400 text-xs mt-1">Enter 6 details to get your best visa pathway</p>
        </div>

        {/* 진행도 텍스트 / Progress text */}
        {!showResult && (
          <div className="flex items-center justify-between mb-6 px-1">
            <span className="text-xs text-gray-400">
              {currentStep - 1} / {TIMELINE_STEPS.length} 완료
            </span>
            <span className="text-xs font-semibold text-green-600">{progressPercent}%</span>
          </div>
        )}

        {/* 결과 화면 또는 타임라인 폼 / Result screen or timeline form */}
        {showResult ? (
          <ResultsScreen formData={formData} result={result} onReset={handleReset} />
        ) : (
          <div className="relative">
            {/* 타임라인 목록 / Timeline list */}
            <div className="mb-0">
              {TIMELINE_STEPS.map((step, idx) => {
                const status = getStepStatus(step.stepNumber);
                const isLast = idx === TIMELINE_STEPS.length - 1;

                return (
                  <div key={step.id}>
                    {/* 타임라인 노드 / Timeline node */}
                    <TimelineNode
                      step={step}
                      status={status}
                      displayValue={getCompletedValue(step)}
                      isLast={isLast && status !== 'active'}
                      onClick={() => handleStepEdit(step.stepNumber)}
                    />

                    {/* 활성 단계의 입력 패널 (노드 아래에 인라인으로 표시) */}
                    {/* Input panel for active step (shown inline below node) */}
                    {status === 'active' && (
                      <div className="ml-14 -mt-4 mb-6">
                        <InputPanel
                          currentStep={currentStep}
                          formData={formData}
                          ageInput={ageInput}
                          onAgeInputChange={setAgeInput}
                          onSelect={handleSelect}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 완료 버튼 (모든 단계 완료 시) / Complete button (when all steps done) */}
            {currentStep > TIMELINE_STEPS.length && !showResult && (
              <div className="mt-4">
                <button
                  onClick={() => setShowResult(true)}
                  className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                >
                  <TrendingUp size={20} />
                  비자 경로 분석하기
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* 데모 스킵 버튼 / Demo skip button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setFormData(mockInput);
                  setAgeInput(String(mockInput.age));
                  setShowResult(true);
                }}
                className="text-xs text-gray-400 hover:text-green-500 underline transition-colors duration-150"
              >
                데모: 결과 바로 보기 / Demo: Skip to results
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 하단 정보 / Footer info */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-gray-400" />
            <span className="text-xs text-gray-400">개인정보 비저장 / No data saved</span>
          </div>
          {!showResult && (
            <div className="flex items-center gap-1">
              {TIMELINE_STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    getStepStatus(step.stepNumber) === 'completed'
                      ? 'w-4 bg-green-500'
                      : getStepStatus(step.stepNumber) === 'active'
                      ? 'w-6 bg-green-400'
                      : 'w-1.5 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
          {showResult && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 size={13} />
              <span className="text-xs font-medium">분석 완료</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
