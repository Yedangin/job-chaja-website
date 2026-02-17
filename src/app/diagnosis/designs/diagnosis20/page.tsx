'use client';

// 디자인 #20: 프로필 빌더 — LinkedIn 스타일 비자 진단
// Design #20: Profile Builder — LinkedIn-style visa diagnosis

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
  User,
  Globe,
  GraduationCap,
  Wallet,
  Target,
  Star,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  MapPin,
  Clock,
  TrendingUp,
  Briefcase,
  ArrowRight,
  Sparkles,
  Edit2,
  BarChart2,
  BookOpen,
  DollarSign,
  Layers,
  AlertCircle,
  CheckCheck,
} from 'lucide-react';

// 입력 단계 정의 / Input step definition
type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

interface StepConfig {
  key: StepKey;
  labelKo: string;
  labelEn: string;
  icon: React.ReactNode;
  placeholder: string;
}

// 프로필 완성도 계산 / Calculate profile completion
function calcCompletion(input: Partial<DiagnosisInput>): number {
  const fields: (keyof DiagnosisInput)[] = [
    'nationality',
    'age',
    'educationLevel',
    'availableAnnualFund',
    'finalGoal',
    'priorityPreference',
  ];
  const filled = fields.filter((f) => {
    const v = input[f];
    if (v === undefined || v === null || v === '') return false;
    if (typeof v === 'number' && isNaN(v)) return false;
    return true;
  });
  return Math.round((filled.length / fields.length) * 100);
}

// 점수 등급 레이블 / Score grade label
function getGradeLabel(score: number): { ko: string; en: string; color: string } {
  if (score >= 71) return { ko: '우수', en: 'Excellent', color: 'text-green-600' };
  if (score >= 51) return { ko: '양호', en: 'Good', color: 'text-blue-600' };
  if (score >= 31) return { ko: '보통', en: 'Fair', color: 'text-amber-600' };
  return { ko: '낮음', en: 'Low', color: 'text-red-500' };
}

// 비자 체인 파싱 / Parse visa chain string to array
function parseVisaChain(chain: string): string[] {
  return chain.split(' → ').map((s) => s.trim());
}

// 비용 포맷 / Format cost
function formatCost(won: number): string {
  if (won === 0) return '무료';
  if (won >= 10000) return `${(won / 10000).toFixed(1)}억원`;
  if (won >= 1000) return `${(won / 1000).toFixed(1)}천만원`;
  return `${won.toLocaleString()}만원`;
}

// 단계 설정 / Step configurations
const STEPS: StepConfig[] = [
  {
    key: 'nationality',
    labelKo: '국적',
    labelEn: 'Nationality',
    icon: <Globe size={18} />,
    placeholder: '국가를 선택하세요',
  },
  {
    key: 'age',
    labelKo: '나이',
    labelEn: 'Age',
    icon: <User size={18} />,
    placeholder: '나이를 입력하세요',
  },
  {
    key: 'educationLevel',
    labelKo: '최종 학력',
    labelEn: 'Education',
    icon: <GraduationCap size={18} />,
    placeholder: '학력을 선택하세요',
  },
  {
    key: 'availableAnnualFund',
    labelKo: '준비 자금',
    labelEn: 'Available Fund',
    icon: <Wallet size={18} />,
    placeholder: '자금 범위를 선택하세요',
  },
  {
    key: 'finalGoal',
    labelKo: '최종 목표',
    labelEn: 'Final Goal',
    icon: <Target size={18} />,
    placeholder: '목표를 선택하세요',
  },
  {
    key: 'priorityPreference',
    labelKo: '우선순위',
    labelEn: 'Priority',
    icon: <Star size={18} />,
    placeholder: '우선순위를 선택하세요',
  },
];

// 국적 표시 레이블 / Nationality display label
function getNationalityLabel(code: string): string {
  const found = popularCountries.find((c) => c.code === code);
  return found ? `${found.flag} ${found.nameKo}` : code;
}

// 학력 표시 레이블 / Education display label
function getEducationLabel(value: string): string {
  const found = educationOptions.find((e) => e.value === value);
  return found ? `${found.emoji} ${found.labelKo}` : value;
}

// 자금 표시 레이블 / Fund display label
function getFundLabel(value: number): string {
  const found = fundOptions.find((f) => f.value === value);
  return found ? found.labelKo : `${value}만원`;
}

// 목표 표시 레이블 / Goal display label
function getGoalLabel(value: string): string {
  const found = goalOptions.find((g) => g.value === value);
  return found ? `${found.emoji} ${found.labelKo}` : value;
}

// 우선순위 표시 레이블 / Priority display label
function getPriorityLabel(value: string): string {
  const found = priorityOptions.find((p) => p.value === value);
  return found ? `${found.emoji} ${found.labelKo}` : value;
}

// 입력값을 사람이 읽을 수 있는 문자열로 / Convert input value to human-readable string
function getFieldDisplayValue(key: StepKey, input: Partial<DiagnosisInput>): string {
  switch (key) {
    case 'nationality':
      return input.nationality ? getNationalityLabel(input.nationality) : '';
    case 'age':
      return input.age !== undefined ? `${input.age}세` : '';
    case 'educationLevel':
      return input.educationLevel ? getEducationLabel(input.educationLevel) : '';
    case 'availableAnnualFund':
      return input.availableAnnualFund !== undefined ? getFundLabel(input.availableAnnualFund) : '';
    case 'finalGoal':
      return input.finalGoal ? getGoalLabel(input.finalGoal) : '';
    case 'priorityPreference':
      return input.priorityPreference ? getPriorityLabel(input.priorityPreference) : '';
    default:
      return '';
  }
}

// ============================================================
// 개별 스텝 입력 패널 / Individual step input panels
// ============================================================

interface StepPanelProps {
  stepKey: StepKey;
  input: Partial<DiagnosisInput>;
  onChange: (key: StepKey, value: string | number) => void;
  onNext: () => void;
}

function StepPanel({ stepKey, input, onChange, onNext }: StepPanelProps) {
  const [localAge, setLocalAge] = useState<string>(input.age !== undefined ? String(input.age) : '');

  // 국적 선택 패널 / Nationality selection panel
  if (stepKey === 'nationality') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {popularCountries.map((c) => (
          <button
            key={c.code}
            onClick={() => { onChange('nationality', c.code); onNext(); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium shrink-0
              ${input.nationality === c.code
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
          >
            <span className="text-lg">{c.flag}</span>
            <span>{c.nameKo}</span>
          </button>
        ))}
      </div>
    );
  }

  // 나이 입력 패널 / Age input panel
  if (stepKey === 'age') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={18}
            max={65}
            value={localAge}
            onChange={(e) => setLocalAge(e.target.value)}
            placeholder="예: 24"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-semibold text-gray-800 focus:border-blue-500 focus:outline-none transition-colors"
          />
          <span className="text-gray-500 font-medium">세</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[20, 24, 28, 32, 36, 40].map((age) => (
            <button
              key={age}
              onClick={() => { setLocalAge(String(age)); onChange('age', age); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all shrink-0
                ${Number(localAge) === age
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-blue-400'
                }`}
            >
              {age}세
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            const parsed = parseInt(localAge, 10);
            if (!isNaN(parsed) && parsed >= 18 && parsed <= 65) {
              onChange('age', parsed);
              onNext();
            }
          }}
          disabled={!localAge || isNaN(parseInt(localAge, 10))}
          className="mt-1 w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-40 hover:bg-blue-700 transition-colors"
        >
          다음 / Next →
        </button>
      </div>
    );
  }

  // 학력 선택 패널 / Education selection panel
  if (stepKey === 'educationLevel') {
    return (
      <div className="flex flex-col gap-2">
        {educationOptions.map((e) => (
          <button
            key={e.value}
            onClick={() => { onChange('educationLevel', e.value); onNext(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left
              ${input.educationLevel === e.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
          >
            <span className="text-xl shrink-0">{e.emoji || '📄'}</span>
            <div>
              <div className="font-semibold text-gray-800">{e.labelKo}</div>
              <div className="text-xs text-gray-500">{e.labelEn}</div>
            </div>
            {input.educationLevel === e.value && (
              <CheckCircle2 size={18} className="ml-auto text-blue-600 shrink-0" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // 자금 선택 패널 / Fund selection panel
  if (stepKey === 'availableAnnualFund') {
    return (
      <div className="flex flex-col gap-2">
        {fundOptions.map((f) => (
          <button
            key={f.value}
            onClick={() => { onChange('availableAnnualFund', f.value); onNext(); }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all
              ${input.availableAnnualFund === f.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign size={16} className={input.availableAnnualFund === f.value ? 'text-blue-600' : 'text-gray-400'} />
              <span className="font-medium text-gray-800">{f.labelKo}</span>
            </div>
            <span className="text-xs text-gray-400">{f.labelEn}</span>
          </button>
        ))}
      </div>
    );
  }

  // 목표 선택 패널 / Goal selection panel
  if (stepKey === 'finalGoal') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map((g) => (
          <button
            key={g.value}
            onClick={() => { onChange('finalGoal', g.value); onNext(); }}
            className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all
              ${input.finalGoal === g.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
          >
            <span className="text-2xl">{g.emoji}</span>
            <span className="font-semibold text-gray-800 text-sm">{g.labelKo}</span>
            <span className="text-xs text-gray-500 text-center leading-tight">{g.descKo}</span>
          </button>
        ))}
      </div>
    );
  }

  // 우선순위 선택 패널 / Priority selection panel
  if (stepKey === 'priorityPreference') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {priorityOptions.map((p) => (
          <button
            key={p.value}
            onClick={() => { onChange('priorityPreference', p.value); onNext(); }}
            className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all
              ${input.priorityPreference === p.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
          >
            <span className="text-2xl">{p.emoji}</span>
            <span className="font-semibold text-gray-800 text-sm">{p.labelKo}</span>
            <span className="text-xs text-gray-500 text-center">{p.descKo}</span>
          </button>
        ))}
      </div>
    );
  }

  return null;
}

// ============================================================
// 결과 경로 카드 / Result pathway card
// ============================================================

interface PathwayCardProps {
  pathway: RecommendedPathway;
  rank: number;
}

function PathwayCard({ pathway, rank }: PathwayCardProps) {
  const [expanded, setExpanded] = useState(rank === 0);
  const grade = getGradeLabel(pathway.finalScore);
  const visaCodes = parseVisaChain(pathway.visaChain);
  const scoreColor = getScoreColor(pathway.finalScore);

  return (
    <div className={`rounded-2xl border-2 overflow-hidden shadow-sm transition-all ${rank === 0 ? 'border-blue-500' : 'border-gray-200'}`}>
      {/* 카드 헤더 / Card header */}
      <div
        className={`px-5 py-4 cursor-pointer flex items-center gap-4 ${rank === 0 ? 'bg-linear-to-br from-blue-600 to-blue-700' : 'bg-white'}`}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* 순위 배지 / Rank badge */}
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
          ${rank === 0 ? 'bg-white text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
          {rank + 1}
        </div>

        {/* 경로 정보 / Pathway info */}
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-base leading-snug ${rank === 0 ? 'text-white' : 'text-gray-900'}`}>
            {pathway.nameKo}
          </div>
          <div className={`text-sm mt-0.5 ${rank === 0 ? 'text-blue-200' : 'text-gray-400'}`}>
            {pathway.nameEn}
          </div>
          {/* 비자 체인 뱃지 / Visa chain badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {visaCodes.map((code, idx) => (
              <React.Fragment key={code}>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0
                  ${rank === 0 ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  {code}
                </span>
                {idx < visaCodes.length - 1 && (
                  <ArrowRight size={10} className={`self-center shrink-0 ${rank === 0 ? 'text-blue-300' : 'text-gray-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 점수 + 토글 / Score + toggle */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: scoreColor }}
          >
            {pathway.finalScore}
          </div>
          <span className={`text-xs font-medium ${grade.color}`}>{grade.ko}</span>
          <div className={rank === 0 ? 'text-blue-200' : 'text-gray-400'}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* 상세 정보 / Detail section */}
      {expanded && (
        <div className="bg-gray-50 px-5 py-4 border-t border-gray-100">
          {/* 주요 지표 / Key metrics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <Clock size={16} className="mx-auto text-blue-500 mb-1" />
              <div className="font-bold text-gray-800 text-sm">{pathway.estimatedMonths}개월</div>
              <div className="text-xs text-gray-500">예상 기간</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <Wallet size={16} className="mx-auto text-green-500 mb-1" />
              <div className="font-bold text-gray-800 text-sm">{formatCost(pathway.estimatedCostWon)}</div>
              <div className="text-xs text-gray-500">예상 비용</div>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm">
              <TrendingUp size={16} className="mx-auto text-purple-500 mb-1" />
              <div className={`font-bold text-sm ${grade.color}`}>{pathway.feasibilityLabel}</div>
              <div className="text-xs text-gray-500">실현 가능성</div>
            </div>
          </div>

          {/* 마일스톤 타임라인 / Milestone timeline */}
          {pathway.milestones.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">경로 타임라인 / Pathway Timeline</div>
              <div className="relative">
                {/* 타임라인 선 / Timeline line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />
                <div className="flex flex-col gap-3">
                  {pathway.milestones.map((m) => (
                    <div key={m.order} className="flex items-start gap-3 relative">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 text-xs font-bold
                        ${m.type === 'final_goal' ? 'bg-blue-600 text-white' : 'bg-white border-2 border-gray-300 text-gray-500'}`}>
                        {m.monthFromStart === 0 ? '시작' : `${m.monthFromStart}M`}
                      </div>
                      <div className="flex-1 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800">{m.nameKo}</span>
                          {m.visaStatus && m.visaStatus !== 'none' && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium shrink-0">
                              {m.visaStatus}
                            </span>
                          )}
                        </div>
                        {m.canWorkPartTime && (
                          <div className="text-xs text-green-600 mt-0.5">
                            ✓ 파트타임 가능 {m.weeklyHours > 0 ? `(주 ${m.weeklyHours}시간)` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">지금 시작하기 / Get Started</div>
              <div className="flex flex-col gap-2">
                {pathway.nextSteps.map((ns, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100">
                    <CheckCheck size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{ns.nameKo}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{ns.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 참고사항 / Note */}
          {pathway.note && (
            <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
              <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <span className="text-xs text-amber-700">{pathway.note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 완성된 프로필 미리보기 카드 / Completed profile preview card
// ============================================================

interface ProfileCardProps {
  input: Partial<DiagnosisInput>;
  completion: number;
  onEdit: (key: StepKey) => void;
}

function ProfileCard({ input, completion, onEdit }: ProfileCardProps) {
  const nationalityInfo = popularCountries.find((c) => c.code === input.nationality);
  const educationInfo = educationOptions.find((e) => e.value === input.educationLevel);
  const goalInfo = goalOptions.find((g) => g.value === input.finalGoal);
  const priorityInfo = priorityOptions.find((p) => p.value === input.priorityPreference);
  const fundInfo = fundOptions.find((f) => f.value === input.availableAnnualFund);

  const progressColor = completion >= 80 ? 'bg-green-500' : completion >= 50 ? 'bg-blue-500' : 'bg-amber-500';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 헤더 배너 / Header banner */}
      <div className="h-20 bg-linear-to-br from-blue-600 to-blue-800" />

      {/* 아바타 + 이름 / Avatar + name */}
      <div className="px-5 pb-4">
        <div className="-mt-10 mb-3">
          <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl">
            {nationalityInfo?.flag || '🌍'}
          </div>
        </div>

        {/* 이름/국적 / Name/nationality */}
        <div className="mb-1">
          <div className="font-bold text-gray-900 text-lg leading-tight">
            {nationalityInfo ? `${nationalityInfo.nameKo} 출신` : '국적 미입력'}
          </div>
          <div className="text-sm text-gray-500">
            {input.age !== undefined ? `${input.age}세` : '나이 미입력'}
            {educationInfo ? ` · ${educationInfo.labelKo}` : ''}
          </div>
        </div>

        {/* 완성도 게이지 / Completion gauge */}
        <div className="mt-3 mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 font-medium">프로필 완성도 / Profile Completion</span>
            <span className={`font-bold ${completion >= 80 ? 'text-green-600' : completion >= 50 ? 'text-blue-600' : 'text-amber-600'}`}>
              {completion}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${completion}%` }}
            />
          </div>
          {completion < 100 && (
            <div className="text-xs text-gray-400 mt-1">
              {6 - Math.round(completion / (100 / 6))}개 항목을 더 채우면 진단이 완성됩니다.
            </div>
          )}
        </div>

        {/* 프로필 필드 목록 / Profile fields list */}
        <div className="flex flex-col gap-1.5">
          {STEPS.map((step) => {
            const value = getFieldDisplayValue(step.key, input);
            const filled = !!value;
            return (
              <button
                key={step.key}
                onClick={() => onEdit(step.key)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left group
                  ${filled ? 'border-gray-200 bg-gray-50' : 'border-dashed border-blue-300 bg-blue-50'}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={filled ? 'text-gray-500' : 'text-blue-500'}>
                    {step.icon}
                  </span>
                  <div>
                    <div className="text-xs text-gray-400">{step.labelKo} / {step.labelEn}</div>
                    {filled ? (
                      <div className="text-sm font-semibold text-gray-800">{value}</div>
                    ) : (
                      <div className="text-sm text-blue-500 font-medium">{step.placeholder}</div>
                    )}
                  </div>
                </div>
                <div className={`shrink-0 ${filled ? 'text-gray-300 group-hover:text-blue-400' : 'text-blue-400'}`}>
                  {filled ? <Edit2 size={14} /> : <ChevronRight size={16} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* 추천 배지 / Recommendation badges */}
        {completion >= 80 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {goalInfo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold shrink-0">
                <Target size={11} />
                {goalInfo.emoji} {goalInfo.labelKo}
              </span>
            )}
            {priorityInfo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold shrink-0">
                <Star size={11} />
                {priorityInfo.emoji} {priorityInfo.labelKo}
              </span>
            )}
            {fundInfo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold shrink-0">
                <Wallet size={11} />
                {fundInfo.labelKo}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis20Page() {
  // 입력 상태 / Input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 현재 활성 스텝 / Currently active step
  const [activeStep, setActiveStep] = useState<StepKey>('nationality');
  // 결과 표시 여부 / Show result flag
  const [showResult, setShowResult] = useState(false);
  // 결과 데이터 / Result data
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const completion = calcCompletion(input);

  // 필드 변경 핸들러 / Field change handler
  const handleChange = (key: StepKey, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // 다음 스텝으로 이동 / Move to next step
  const handleNext = () => {
    const currentIdx = STEPS.findIndex((s) => s.key === activeStep);
    if (currentIdx < STEPS.length - 1) {
      setActiveStep(STEPS[currentIdx + 1].key);
    }
  };

  // 특정 스텝 편집 / Edit specific step
  const handleEdit = (key: StepKey) => {
    setActiveStep(key);
    if (showResult) setShowResult(false);
  };

  // 진단 실행 / Run diagnosis
  const handleDiagnose = () => {
    setResult(mockDiagnosisResult);
    setShowResult(true);
  };

  // 초기화 / Reset
  const handleReset = () => {
    setInput({});
    setActiveStep('nationality');
    setShowResult(false);
    setResult(null);
  };

  const allFilled = completion === 100;
  const currentStepConfig = STEPS.find((s) => s.key === activeStep);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 GNB / Top navigation bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-blue-600" />
            <span className="font-bold text-blue-600 text-lg">잡차자</span>
            <span className="text-gray-300 text-sm mx-1">/</span>
            <span className="text-gray-600 text-sm">비자 진단</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">Design #20 — Profile Builder</span>
            {(completion > 0 || showResult) && (
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-blue-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                초기화
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 메인 레이아웃 / Main layout */}
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* 좌측: 프로필 카드 / Left: Profile card */}
        <div className="w-full lg:w-72 shrink-0">
          <ProfileCard
            input={input}
            completion={completion}
            onEdit={handleEdit}
          />

          {/* 진단 버튼 / Diagnosis button */}
          <button
            onClick={handleDiagnose}
            disabled={!allFilled}
            className={`mt-4 w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-sm
              ${allFilled
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <Sparkles size={18} />
            {allFilled ? '비자 경로 진단하기' : `${6 - Math.round(completion / (100 / 6))}개 항목 남음`}
          </button>

          {/* 진단 통계 배지 / Stats badge */}
          <div className="mt-3 bg-white rounded-xl border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 size={14} className="text-blue-500" />
              <span className="text-xs font-semibold text-gray-600">분석 정보 / Analysis Info</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">평가 경로 수</span>
                <span className="font-semibold text-gray-800">15개</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">비자 유형</span>
                <span className="font-semibold text-gray-800">31개</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">테스트 케이스</span>
                <span className="font-semibold text-gray-800">2,629개</span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 입력 패널 / 결과 / Right: Input panel / Results */}
        <div className="flex-1 min-w-0">
          {!showResult ? (
            /* 입력 영역 / Input area */
            <div>
              {/* 진행 상황 스텝 바 / Step progress bar */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-blue-500" />
                    <span className="font-semibold text-gray-700 text-sm">프로필 입력 / Build Profile</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {STEPS.findIndex((s) => s.key === activeStep) + 1} / {STEPS.length}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {STEPS.map((s, i) => {
                    const filled = !!getFieldDisplayValue(s.key, input);
                    const isActive = s.key === activeStep;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setActiveStep(s.key)}
                        className={`flex-1 h-1.5 rounded-full transition-all shrink-0
                          ${isActive ? 'bg-blue-600' : filled ? 'bg-blue-200' : 'bg-gray-200'}`}
                        title={s.labelKo}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 현재 스텝 입력 카드 / Current step input card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* 스텝 헤더 / Step header */}
                <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      {currentStepConfig?.icon}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-base">
                        {currentStepConfig?.labelKo}
                      </div>
                      <div className="text-xs text-gray-400">
                        {currentStepConfig?.labelEn}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 스텝 입력 내용 / Step input content */}
                <div className="p-5">
                  <StepPanel
                    stepKey={activeStep}
                    input={input}
                    onChange={handleChange}
                    onNext={handleNext}
                  />
                </div>
              </div>

              {/* 완성된 필드 요약 / Completed fields summary */}
              {completion > 0 && (
                <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={15} className="text-green-500" />
                    <span className="text-sm font-semibold text-gray-700">입력 완료 / Filled</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {STEPS.filter((s) => !!getFieldDisplayValue(s.key, input)).map((s) => (
                      <div key={s.key} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <span className="text-gray-400">{s.icon}</span>
                          {s.labelKo}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">
                            {getFieldDisplayValue(s.key, input)}
                          </span>
                          <button
                            onClick={() => setActiveStep(s.key)}
                            className="text-gray-300 hover:text-blue-500 transition-colors"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 결과 영역 / Results area */
            <div>
              {/* 결과 헤더 / Results header */}
              <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl p-5 mb-4 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={20} />
                  <span className="font-bold text-lg">비자 경로 진단 결과</span>
                </div>
                <div className="text-blue-100 text-sm mb-3">
                  {result?.meta.totalPathwaysEvaluated}개 경로 분석 중{' '}
                  <span className="font-bold text-white">{result?.pathways.length}개</span> 추천 경로를 찾았습니다.
                </div>
                {/* 입력값 요약 칩 / Input summary chips */}
                <div className="flex flex-wrap gap-1.5">
                  {STEPS.map((s) => {
                    const val = getFieldDisplayValue(s.key, input);
                    return val ? (
                      <span key={s.key} className="px-2.5 py-0.5 bg-white/20 rounded-full text-xs text-white shrink-0">
                        {val}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              {/* 경로 카드 목록 / Pathway cards list */}
              <div className="flex flex-col gap-4">
                {result?.pathways.map((pathway, idx) => (
                  <PathwayCard key={pathway.pathwayId} pathway={pathway} rank={idx} />
                ))}
              </div>

              {/* 하단 안내 / Bottom info */}
              <div className="mt-4 bg-blue-50 rounded-2xl border border-blue-100 p-4 flex items-start gap-3">
                <BookOpen size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-blue-800 mb-0.5">
                    더 정확한 진단이 필요하신가요? / Need a more accurate diagnosis?
                  </div>
                  <div className="text-xs text-blue-600">
                    전문 행정사와 1:1 상담을 통해 개인 상황에 맞는 비자 경로를 상담받으세요.
                  </div>
                </div>
              </div>

              {/* 다시 진단 버튼 / Re-diagnose button */}
              <button
                onClick={handleReset}
                className="mt-4 w-full py-3 border-2 border-blue-600 text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 transition-colors"
              >
                다시 진단하기 / Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
