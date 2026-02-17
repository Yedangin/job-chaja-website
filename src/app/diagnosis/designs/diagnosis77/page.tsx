'use client';

// ============================================================
// 비자 진단 시안 #77 — 패션 코디 (Fashion Styling)
// Visa Diagnosis Design #77 — Fashion Styling
// 컨셉: ZARA/H&M/ASOS 스타일 럭셔리 패션 앱처럼
//       비자 조건을 코디 아이템으로 조합하여 최적 경로 완성
// Concept: Coordinate visa conditions like fashion items in a
//          luxury B&W fashion app (ZARA/H&M/ASOS aesthetic)
// ============================================================

import { useState } from 'react';
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
  Shirt,
  ShoppingBag,
  Scissors,
  Tag,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Clock,
  DollarSign,
  Globe,
  BookOpen,
  Target,
  Zap,
  ArrowRight,
  X,
  Plus,
  Grid,
  LayoutGrid,
  TrendingUp,
  Award,
  Package,
  Layers,
  RefreshCw,
  Heart,
  Eye,
} from 'lucide-react';

// ============================================================
// 상수: 단계 정의 / Constants: Step definitions
// ============================================================
const STEPS = [
  { id: 1, label: '국적', labelEn: 'Nationality', icon: Globe, item: '출신지' },
  { id: 2, label: '나이', labelEn: 'Age', icon: Tag, item: '나이태그' },
  { id: 3, label: '학력', labelEn: 'Education', icon: BookOpen, item: '학력아이템' },
  { id: 4, label: '자금', labelEn: 'Budget', icon: DollarSign, item: '예산태그' },
  { id: 5, label: '목표', labelEn: 'Goal', icon: Target, item: '목표아이템' },
  { id: 6, label: '우선순위', labelEn: 'Priority', icon: Zap, item: '스타일' },
];

// 패션 카테고리별 색상 / Fashion category colors (B&W luxury palette)
const FEASIBILITY_STYLE: Record<string, { badge: string; bar: string; label: string }> = {
  '높음':     { badge: 'bg-black text-white',             bar: 'bg-black',       label: 'HAUTE COUTURE' },
  '보통':     { badge: 'bg-zinc-700 text-white',          bar: 'bg-zinc-700',    label: 'PRÊT-À-PORTER' },
  '낮음':     { badge: 'bg-zinc-400 text-white',          bar: 'bg-zinc-400',    label: 'DIFFUSION' },
  '매우낮음': { badge: 'bg-zinc-200 text-zinc-600 border border-zinc-300', bar: 'bg-zinc-300', label: 'SAMPLE SALE' },
};

// 패션 아이템 아이콘 매핑 / Fashion item icon mapping per step
const STEP_FASHION_ITEMS = [
  { icon: Globe,      label: '원산지 태그',    labelEn: 'Origin Tag',      color: 'border-zinc-800' },
  { icon: Tag,        label: '사이즈 태그',    labelEn: 'Size Tag',        color: 'border-zinc-600' },
  { icon: BookOpen,   label: '소재 태그',      labelEn: 'Material Tag',    color: 'border-zinc-700' },
  { icon: DollarSign, label: '가격 태그',      labelEn: 'Price Tag',       color: 'border-zinc-500' },
  { icon: Target,     label: '스타일 아이템',  labelEn: 'Style Item',      color: 'border-zinc-800' },
  { icon: Zap,        label: '시즌 컬렉션',    labelEn: 'Season Collection', color: 'border-zinc-600' },
];

// ============================================================
// 서브컴포넌트: 진행 표시 바 / Sub-component: Progress stepper
// ============================================================
function FashionStepper({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    // 패션 룩북 스타일 스텝퍼 / Fashion lookbook-style stepper
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`
                  w-8 h-8 rounded-none border flex items-center justify-center text-xs font-bold tracking-widest
                  transition-all duration-300
                  ${isCompleted ? 'bg-black border-black text-white' : ''}
                  ${isActive ? 'bg-white border-black text-black shadow-[2px_2px_0px_#000]' : ''}
                  ${!isCompleted && !isActive ? 'bg-white border-zinc-300 text-zinc-400' : ''}
                `}
              >
                {isCompleted ? <Check size={12} strokeWidth={3} /> : <span>{step.id}</span>}
              </div>
              <span className={`text-[9px] tracking-widest uppercase font-medium ${isActive ? 'text-black' : 'text-zinc-400'}`}>
                {step.labelEn}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-1 transition-all duration-500 ${isCompleted ? 'bg-black' : 'bg-zinc-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 서브컴포넌트: 코디 행거 미리보기 / Sub-component: Outfit hanger preview
// ============================================================
function OutfitHanger({ input, currentStep }: { input: Partial<DiagnosisInput>; currentStep: number }) {
  // 선택된 아이템들을 패션 태그처럼 시각화 / Visualize selected items as fashion tags
  const items = [
    { step: 1, label: input.nationality ? popularCountries.find(c => c.code === input.nationality)?.nameEn || input.nationality : null, icon: '🌍', tag: 'ORIGIN' },
    { step: 2, label: input.age ? `AGE ${input.age}` : null, icon: '📏', tag: 'SIZE' },
    { step: 3, label: input.educationLevel ? educationOptions.find(e => e.value === input.educationLevel)?.labelEn || null : null, icon: '📚', tag: 'MATERIAL' },
    { step: 4, label: input.availableAnnualFund !== undefined ? fundOptions.find(f => f.value === input.availableAnnualFund)?.labelEn || null : null, icon: '💰', tag: 'PRICE' },
    { step: 5, label: input.finalGoal ? goalOptions.find(g => g.value === input.finalGoal)?.labelEn || null : null, icon: '🎯', tag: 'STYLE' },
    { step: 6, label: input.priorityPreference ? priorityOptions.find(p => p.value === input.priorityPreference)?.labelEn || null : null, icon: '⚡', tag: 'SEASON' },
  ].filter(i => i.label !== null);

  if (items.length === 0) return null;

  return (
    // 미니 코디 패널 / Mini outfit panel
    <div className="border border-zinc-200 p-3 mb-4 bg-zinc-50">
      <div className="flex items-center gap-2 mb-2">
        <ShoppingBag size={12} className="text-zinc-500" />
        <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-medium">YOUR LOOK SO FAR</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-1 bg-black text-white text-[10px] tracking-wider font-medium"
          >
            <span>{item.tag}</span>
            <span className="opacity-60">·</span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 서브컴포넌트: 비자 패션 카드 / Sub-component: Visa fashion card
// ============================================================
function VisaFashionCard({
  pathway,
  rank,
  isSelected,
  onSelect,
}: {
  pathway: CompatPathway;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const style = FEASIBILITY_STYLE[pathway.feasibilityLabel] || FEASIBILITY_STYLE['매우낮음'];
  const scorePercent = Math.min(100, Math.max(0, pathway.finalScore));

  // 패션 컬렉션 라인 레이블 / Fashion collection line label
  const collectionLabel = style.label;

  return (
    // 패션 제품 카드 — ZARA/ASOS 스타일 / Fashion product card — ZARA/ASOS style
    <div
      className={`
        border-2 transition-all duration-300 cursor-pointer
        ${isSelected ? 'border-black shadow-[4px_4px_0px_#000]' : 'border-zinc-200 hover:border-zinc-600 hover:shadow-[2px_2px_0px_#999]'}
      `}
      onClick={onSelect}
    >
      {/* 제품 상단 — 컬렉션 라벨 / Product header — collection label */}
      <div className={`px-4 py-2 flex items-center justify-between ${rank === 1 ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-700'}`}>
        <div className="flex items-center gap-2">
          {rank === 1 && <Star size={12} fill="white" className="text-white" />}
          <span className="text-[9px] tracking-[0.25em] uppercase font-bold">{collectionLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] tracking-widest opacity-70 uppercase">{pathway.visaChainStr}</span>
          {isSelected && <Check size={10} strokeWidth={3} />}
        </div>
      </div>

      {/* 제품 메인 콘텐츠 / Product main content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            {/* 시즌 번호 / Season number */}
            <div className="text-[9px] tracking-[0.3em] text-zinc-400 uppercase mb-1">
              #{pathway.pathwayId} · VISA PATH
            </div>
            {/* 제품명 / Product name */}
            <h3 className="font-bold text-base tracking-tight text-black leading-tight mb-0.5">
              {pathway.nameKo}
            </h3>
            <p className="text-[11px] text-zinc-500 tracking-wider uppercase">{pathway.nameEn}</p>
          </div>

          {/* 스코어 — 가격 태그처럼 / Score — styled as price tag */}
          <div className="shrink-0 border-2 border-black px-3 py-2 text-center">
            <div className="text-2xl font-black tracking-tighter text-black">{pathway.finalScore}</div>
            <div className="text-[8px] tracking-[0.2em] text-zinc-500 uppercase">SCORE</div>
          </div>
        </div>

        {/* 스타일 바 — 패션 퀄리티 바 / Style bar — fashion quality bar */}
        <div className="mb-3">
          <div className="h-1 bg-zinc-100 w-full">
            <div
              className={`h-full transition-all duration-700 ${style.bar}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {/* 태그 정보 / Tag information */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-zinc-400 shrink-0" />
            <span className="text-[11px] text-zinc-600">
              <span className="font-semibold text-black">{pathway.estimatedMonths}</span>개월
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign size={11} className="text-zinc-400 shrink-0" />
            <span className="text-[11px] text-zinc-600">
              {pathway.estimatedCostWon === 0
                ? <span className="font-semibold text-black">무료</span>
                : <><span className="font-semibold text-black">{pathway.estimatedCostWon.toLocaleString()}</span>만원</>
              }
            </span>
          </div>
        </div>

        {/* 비자 체인 — 컬렉션 피스처럼 / Visa chain — as collection pieces */}
        <div className="flex items-center gap-1 flex-wrap mb-3">
          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 text-[10px] font-bold tracking-wider border border-zinc-300">
                {v.code}
              </span>
              {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                <ArrowRight size={10} className="text-zinc-400" />
              )}
            </div>
          ))}
        </div>

        {/* 노트 / Note */}
        <p className="text-[11px] text-zinc-500 leading-relaxed border-t border-zinc-100 pt-2">
          {pathway.note}
        </p>
      </div>

      {/* 확장 섹션 — 스타일 상세 / Expanded section — style details */}
      <div>
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="w-full flex items-center justify-center gap-2 py-2 border-t border-zinc-100 text-[10px] tracking-[0.2em] uppercase text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors"
        >
          {expanded ? (
            <><ChevronUp size={12} /> VIEW LESS</>
          ) : (
            <><ChevronDown size={12} /> VIEW COLLECTION DETAILS</>
          )}
        </button>

        {expanded && (
          // 상세 스코어 분해 / Detailed score breakdown
          <div className="border-t border-zinc-100 p-4 bg-zinc-50">
            <p className="text-[9px] tracking-[0.25em] uppercase text-zinc-400 mb-3 font-semibold">STYLE SCORE BREAKDOWN</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: 'BASE SCORE', value: pathway.scoreBreakdown.base, max: 100 },
                { label: 'AGE FIT', value: Math.round(pathway.scoreBreakdown.ageMultiplier * 100), max: 100 },
                { label: 'ORIGIN', value: Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100), max: 100 },
                { label: 'BUDGET', value: Math.round(pathway.scoreBreakdown.fundMultiplier * 100), max: 100 },
                { label: 'EDUCATION', value: Math.round(pathway.scoreBreakdown.educationMultiplier * 100), max: 100 },
                { label: 'PRIORITY', value: Math.round(pathway.scoreBreakdown.priorityWeight * 100), max: 100 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[9px] mb-0.5">
                    <span className="text-zinc-500 tracking-wider">{item.label}</span>
                    <span className="font-bold text-black">{item.value}</span>
                  </div>
                  <div className="h-0.5 bg-zinc-200">
                    <div className="h-full bg-black transition-all duration-500" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* 마일스톤 / Milestones */}
            <p className="text-[9px] tracking-[0.25em] uppercase text-zinc-400 mb-2 font-semibold mt-4">COLLECTION TIMELINE</p>
            <div className="space-y-1.5">
              {pathway.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-5 h-5 shrink-0 border border-black flex items-center justify-center text-[8px] font-bold text-black mt-0.5">
                    {m.order}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-black">{m.nameKo}</span>
                      {m.visaStatus && m.visaStatus !== 'none' && (
                        <span className="text-[9px] bg-black text-white px-1.5 py-0.5 tracking-wider">{m.visaStatus}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400">{m.monthFromStart}개월차</span>
                    {m.canWorkPartTime && (
                      <span className="ml-2 text-[9px] text-zinc-500">· 주{m.weeklyHours}시간 근무 가능</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 다음 단계 / Next steps */}
            {pathway.nextSteps.length > 0 && (
              <>
                <p className="text-[9px] tracking-[0.25em] uppercase text-zinc-400 mb-2 font-semibold mt-4">STYLING NEXT STEPS</p>
                <div className="space-y-1.5">
                  {pathway.nextSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-white border border-zinc-100">
                      <ChevronRight size={12} className="text-black shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-semibold text-black">{step.nameKo}</p>
                        <p className="text-[10px] text-zinc-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
export default function Diagnosis77Page() {
  // 상태 관리 / State management
  const [step, setStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);
  const [ageInput, setAgeInput] = useState('');
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // 결과 데이터 / Result data
  const result: DiagnosisResult = mockDiagnosisResult;
  const pathways: CompatPathway[] = mockPathways;

  // 단계 진행 / Step navigation
  const goNext = () => {
    if (step < STEPS.length) setStep(step + 1);
    else handleSubmit();
  };

  const goPrev = () => {
    if (step > 1) setStep(step - 1);
  };

  // 제출 처리 / Form submission
  const handleSubmit = () => {
    setShowResult(true);
  };

  // 재시작 / Restart
  const handleRestart = () => {
    setStep(1);
    setShowResult(false);
    setInput({});
    setAgeInput('');
    setSelectedPathwayId(null);
  };

  // 현재 단계 완료 여부 / Check if current step is complete
  const isStepComplete = (): boolean => {
    switch (step) {
      case 1: return !!input.nationality;
      case 2: return !!input.age && input.age > 0;
      case 3: return !!input.educationLevel;
      case 4: return input.availableAnnualFund !== undefined;
      case 5: return !!input.finalGoal;
      case 6: return !!input.priorityPreference;
      default: return false;
    }
  };

  // ============================================================
  // 결과 화면 / Result screen
  // ============================================================
  if (showResult) {
    const selectedPathway = selectedPathwayId
      ? pathways.find(p => p.pathwayId === selectedPathwayId)
      : null;

    return (
      <div className="min-h-screen bg-white">
        {/* 패션 헤더 / Fashion header */}
        <header className="border-b-2 border-black sticky top-0 bg-white z-30">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-[9px] tracking-[0.4em] uppercase text-zinc-400 mb-0.5">JOBCHAJA VISA</div>
              <h1 className="text-xl font-black tracking-tighter text-black uppercase">
                YOUR VISA COLLECTION
              </h1>
            </div>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 border-2 border-black text-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-black hover:text-white transition-all duration-200"
            >
              <RefreshCw size={12} />
              RESTYLE
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* 컬렉션 요약 배너 / Collection summary banner */}
          <div className="border-2 border-black p-6 mb-8 bg-black text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-[9px] tracking-[0.35em] uppercase text-zinc-400 mb-2">NEW SEASON COLLECTION</div>
                <h2 className="text-2xl font-black tracking-tighter mb-2">
                  {result.pathways.length}개의 비자 경로가<br />
                  <span className="text-zinc-300">당신의 스타일에 맞습니다</span>
                </h2>
                <p className="text-zinc-400 text-sm">
                  {result.meta.totalPathwaysEvaluated}개 경로 분석 중 {result.meta.hardFilteredOut}개 필터 아웃
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="inline-flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <Scissors size={16} className="text-zinc-400" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400">AI STYLED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-zinc-400" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400">PERSONALIZED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-zinc-400" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400">EXPERT CURATED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 선택한 입력 요약 태그 / Selected input summary tags */}
            {Object.keys(input).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-700">
                {input.nationality && (
                  <span className="px-2 py-1 border border-zinc-600 text-[10px] tracking-wider text-zinc-300 uppercase">
                    {popularCountries.find(c => c.code === input.nationality)?.nameEn || input.nationality}
                  </span>
                )}
                {input.age && (
                  <span className="px-2 py-1 border border-zinc-600 text-[10px] tracking-wider text-zinc-300 uppercase">
                    AGE {input.age}
                  </span>
                )}
                {input.educationLevel && (
                  <span className="px-2 py-1 border border-zinc-600 text-[10px] tracking-wider text-zinc-300 uppercase">
                    {educationOptions.find(e => e.value === input.educationLevel)?.labelEn}
                  </span>
                )}
                {input.availableAnnualFund !== undefined && (
                  <span className="px-2 py-1 border border-zinc-600 text-[10px] tracking-wider text-zinc-300 uppercase">
                    {fundOptions.find(f => f.value === input.availableAnnualFund)?.labelEn}
                  </span>
                )}
                {input.finalGoal && (
                  <span className="px-2 py-1 border border-zinc-600 text-[10px] tracking-wider text-zinc-300 uppercase">
                    {goalOptions.find(g => g.value === input.finalGoal)?.labelEn}
                  </span>
                )}
                {input.priorityPreference && (
                  <span className="px-2 py-1 border border-zinc-600 text-[10px] tracking-wider text-zinc-300 uppercase">
                    {priorityOptions.find(p => p.value === input.priorityPreference)?.labelEn}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 섹션 헤더 / Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-zinc-200" />
            <div className="flex items-center gap-2">
              <LayoutGrid size={14} className="text-zinc-400" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-semibold">
                VISA COLLECTION — {result.pathways.length} LOOKS
              </span>
            </div>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          {/* 비자 경로 카드 그리드 / Visa pathway card grid */}
          <div className="space-y-4">
            {pathways.map((pathway, idx) => (
              <VisaFashionCard
                key={pathway.pathwayId}
                pathway={pathway}
                rank={idx + 1}
                isSelected={selectedPathwayId === pathway.pathwayId}
                onSelect={() => setSelectedPathwayId(
                  selectedPathwayId === pathway.pathwayId ? null : pathway.pathwayId
                )}
              />
            ))}
          </div>

          {/* 선택된 경로 CTA / Selected pathway CTA */}
          {selectedPathway && (
            <div className="fixed bottom-0 left-0 right-0 bg-black border-t-2 border-black p-4 z-40">
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-[9px] tracking-[0.25em] uppercase text-zinc-400 mb-0.5">SELECTED LOOK</div>
                  <p className="text-white font-bold text-sm tracking-tight">{selectedPathway.nameKo}</p>
                  <p className="text-zinc-400 text-[11px] uppercase tracking-wider">{selectedPathway.visaChainStr}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedPathwayId(null)}
                    className="px-4 py-2 border border-zinc-600 text-zinc-400 text-xs tracking-[0.2em] uppercase hover:border-zinc-400 transition-colors"
                  >
                    REMOVE
                  </button>
                  <button className="px-6 py-2 bg-white text-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-zinc-100 transition-colors flex items-center gap-2">
                    WEAR THIS LOOK
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 하단 여백 / Bottom padding for sticky bar */}
          {selectedPathway && <div className="h-24" />}

          {/* 브랜드 푸터 / Brand footer */}
          <div className="mt-16 pt-8 border-t-2 border-black flex items-center justify-between">
            <div>
              <div className="text-[9px] tracking-[0.4em] uppercase text-zinc-400 mb-1">JOBCHAJA</div>
              <p className="text-xs text-zinc-500">비자 스타일링 서비스 · Visa Styling Service</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[9px] tracking-[0.25em] uppercase text-zinc-400">Fashion Styling</span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-zinc-400">2026 COLLECTION</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 입력 화면 — 패션 쇼핑 앱 스타일 / Input screen — fashion shopping app style
  // ============================================================
  return (
    <div className="min-h-screen bg-white">
      {/* 패션 브랜드 헤더 / Fashion brand header */}
      <header className="border-b-2 border-black sticky top-0 bg-white z-20">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="text-center mb-1">
            <span className="text-[8px] tracking-[0.5em] uppercase text-zinc-400">JOBCHAJA VISA</span>
          </div>
          <h1 className="text-center text-2xl font-black tracking-tighter text-black uppercase">
            VISA STYLING
          </h1>
          <div className="text-center text-[9px] tracking-[0.3em] uppercase text-zinc-400 mt-0.5">
            BUILD YOUR PERFECT VISA LOOK
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* 스텝퍼 / Stepper */}
        <div className="mb-8">
          <FashionStepper currentStep={step} totalSteps={STEPS.length} />
        </div>

        {/* 코디 미리보기 / Outfit preview */}
        <OutfitHanger input={input} currentStep={step} />

        {/* 현재 단계 패션 카테고리 헤더 / Current step fashion category header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 border-2 border-black flex items-center justify-center">
              {(() => {
                const Icon = STEP_FASHION_ITEMS[step - 1].icon;
                return <Icon size={14} className="text-black" />;
              })()}
            </div>
            <div>
              <div className="text-[8px] tracking-[0.35em] uppercase text-zinc-400">STEP {step} OF {STEPS.length}</div>
              <h2 className="text-lg font-black tracking-tighter text-black uppercase">
                {STEPS[step - 1].label}
                <span className="text-zinc-300 ml-2 font-light text-sm tracking-widest">
                  {STEPS[step - 1].labelEn}
                </span>
              </h2>
            </div>
          </div>
          <div className="ml-11">
            <span className="text-[10px] text-zinc-400 tracking-wider uppercase">
              {STEP_FASHION_ITEMS[step - 1].label} · {STEP_FASHION_ITEMS[step - 1].labelEn}
            </span>
          </div>
        </div>

        {/* ── STEP 1: 국적 / Nationality ── */}
        {step === 1 && (
          <div>
            <p className="text-xs text-zinc-500 tracking-wider uppercase mb-4">
              SELECT YOUR ORIGIN — 국적을 선택하세요
            </p>
            <div className="grid grid-cols-2 gap-2">
              {popularCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setInput(prev => ({ ...prev, nationality: country.code }))}
                  className={`
                    flex items-center gap-3 px-4 py-3 border-2 text-left transition-all duration-150
                    ${input.nationality === country.code
                      ? 'border-black bg-black text-white shadow-[3px_3px_0px_#555]'
                      : 'border-zinc-200 text-black hover:border-zinc-600 hover:shadow-[2px_2px_0px_#ccc]'
                    }
                  `}
                >
                  <span className="text-xl">{country.flag}</span>
                  <div>
                    <div className="font-bold text-sm tracking-tight">{country.nameKo}</div>
                    <div className={`text-[10px] tracking-widest uppercase ${input.nationality === country.code ? 'text-zinc-300' : 'text-zinc-400'}`}>
                      {country.nameEn}
                    </div>
                  </div>
                  {input.nationality === country.code && (
                    <Check size={14} strokeWidth={3} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: 나이 / Age ── */}
        {step === 2 && (
          <div>
            <p className="text-xs text-zinc-500 tracking-wider uppercase mb-4">
              ENTER YOUR SIZE — 나이를 입력하세요
            </p>
            {/* 나이 슬라이더 느낌의 입력 / Age input with fashion sizing feel */}
            <div className="border-2 border-zinc-200 p-6 mb-4 focus-within:border-black transition-colors">
              <label className="block text-[9px] tracking-[0.3em] uppercase text-zinc-400 mb-3">
                AGE / 나이
              </label>
              <input
                type="number"
                min="18"
                max="60"
                value={ageInput}
                onChange={(e) => {
                  setAgeInput(e.target.value);
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 18 && val <= 60) {
                    setInput(prev => ({ ...prev, age: val }));
                  }
                }}
                placeholder="18 — 60"
                className="w-full text-5xl font-black tracking-tighter text-black border-none outline-none bg-transparent placeholder:text-zinc-200"
              />
              <div className="h-0.5 bg-zinc-200 mt-3">
                {input.age && (
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${((input.age - 18) / (60 - 18)) * 100}%` }}
                  />
                )}
              </div>
            </div>
            {/* 퀵 선택 / Quick select */}
            <div className="flex flex-wrap gap-2">
              {[20, 25, 28, 30, 35, 40].map((age) => (
                <button
                  key={age}
                  onClick={() => { setAgeInput(String(age)); setInput(prev => ({ ...prev, age })); }}
                  className={`
                    px-4 py-2 border text-sm font-bold tracking-widest transition-all
                    ${input.age === age ? 'border-black bg-black text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-600'}
                  `}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: 학력 / Education ── */}
        {step === 3 && (
          <div>
            <p className="text-xs text-zinc-500 tracking-wider uppercase mb-4">
              CHOOSE YOUR MATERIAL — 학력을 선택하세요
            </p>
            <div className="space-y-2">
              {educationOptions.map((edu) => (
                <button
                  key={edu.value}
                  onClick={() => setInput(prev => ({ ...prev, educationLevel: edu.value }))}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 border-2 text-left transition-all duration-150
                    ${input.educationLevel === edu.value
                      ? 'border-black bg-black text-white shadow-[3px_3px_0px_#555]'
                      : 'border-zinc-200 text-black hover:border-zinc-600'
                    }
                  `}
                >
                  <span className="text-2xl">{edu.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm tracking-tight">{edu.labelKo}</div>
                    <div className={`text-[10px] tracking-widest uppercase ${input.educationLevel === edu.value ? 'text-zinc-300' : 'text-zinc-400'}`}>
                      {edu.labelEn}
                    </div>
                  </div>
                  {input.educationLevel === edu.value && <Check size={14} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 4: 자금 / Budget ── */}
        {step === 4 && (
          <div>
            <p className="text-xs text-zinc-500 tracking-wider uppercase mb-4">
              SET YOUR BUDGET — 연간 자금을 선택하세요
            </p>
            <div className="space-y-2">
              {fundOptions.map((fund, idx) => {
                // 가격 티어별 패션 라벨 / Fashion label per price tier
                const tierLabels = ['ENTRY', 'EMERGING', 'CONTEMPORARY', 'DESIGNER', 'LUXURY', 'ULTRA LUXURY'];
                return (
                  <button
                    key={fund.value}
                    onClick={() => setInput(prev => ({ ...prev, availableAnnualFund: fund.value }))}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 border-2 text-left transition-all duration-150
                      ${input.availableAnnualFund === fund.value
                        ? 'border-black bg-black text-white shadow-[3px_3px_0px_#555]'
                        : 'border-zinc-200 text-black hover:border-zinc-600'
                      }
                    `}
                  >
                    <div>
                      <div className="font-bold text-sm tracking-tight">{fund.labelKo}</div>
                      <div className={`text-[10px] tracking-widest uppercase ${input.availableAnnualFund === fund.value ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {fund.labelEn}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] tracking-[0.2em] px-2 py-0.5 border font-bold uppercase ${
                        input.availableAnnualFund === fund.value
                          ? 'border-zinc-600 text-zinc-300'
                          : 'border-zinc-300 text-zinc-500'
                      }`}>
                        {tierLabels[idx]}
                      </span>
                      {input.availableAnnualFund === fund.value && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 5: 목표 / Goal ── */}
        {step === 5 && (
          <div>
            <p className="text-xs text-zinc-500 tracking-wider uppercase mb-4">
              CHOOSE YOUR STYLE — 목표를 선택하세요
            </p>
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setInput(prev => ({ ...prev, finalGoal: goal.value }))}
                  className={`
                    flex flex-col items-center gap-3 px-4 py-6 border-2 text-center transition-all duration-150
                    ${input.finalGoal === goal.value
                      ? 'border-black bg-black text-white shadow-[4px_4px_0px_#555]'
                      : 'border-zinc-200 text-black hover:border-zinc-600 hover:shadow-[2px_2px_0px_#ccc]'
                    }
                  `}
                >
                  <span className="text-3xl">{goal.emoji}</span>
                  <div>
                    <div className="font-black text-base tracking-tight">{goal.labelKo}</div>
                    <div className={`text-[10px] tracking-widest uppercase mt-0.5 ${input.finalGoal === goal.value ? 'text-zinc-300' : 'text-zinc-400'}`}>
                      {goal.labelEn}
                    </div>
                  </div>
                  <p className={`text-[11px] leading-tight ${input.finalGoal === goal.value ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {goal.descKo}
                  </p>
                  {input.finalGoal === goal.value && (
                    <div className="w-6 h-6 border border-white flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 6: 우선순위 / Priority ── */}
        {step === 6 && (
          <div>
            <p className="text-xs text-zinc-500 tracking-wider uppercase mb-4">
              DEFINE YOUR SEASON — 우선순위를 선택하세요
            </p>
            <div className="space-y-3">
              {priorityOptions.map((priority) => {
                // 패션 시즌 맵핑 / Fashion season mapping
                const seasonMap: Record<string, string> = {
                  speed: 'SS — SPRING/SUMMER',
                  stability: 'AW — AUTUMN/WINTER',
                  cost: 'RESORT — CRUISE',
                  income: 'COUTURE — SPECIAL EDITION',
                };
                return (
                  <button
                    key={priority.value}
                    onClick={() => setInput(prev => ({ ...prev, priorityPreference: priority.value }))}
                    className={`
                      w-full flex items-center gap-4 px-5 py-4 border-2 text-left transition-all duration-150
                      ${input.priorityPreference === priority.value
                        ? 'border-black bg-black text-white shadow-[4px_4px_0px_#555]'
                        : 'border-zinc-200 text-black hover:border-zinc-600 hover:shadow-[2px_2px_0px_#ccc]'
                      }
                    `}
                  >
                    <span className="text-2xl">{priority.emoji}</span>
                    <div className="flex-1">
                      <div className="font-black text-sm tracking-tight">{priority.labelKo}</div>
                      <div className={`text-[9px] tracking-[0.2em] uppercase mt-0.5 ${input.priorityPreference === priority.value ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {seasonMap[priority.value] || priority.labelEn}
                      </div>
                      <div className={`text-[11px] mt-1 ${input.priorityPreference === priority.value ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {priority.descKo}
                      </div>
                    </div>
                    {input.priorityPreference === priority.value && (
                      <Check size={16} strokeWidth={3} className="shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 네비게이션 버튼 / Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-100">
          {step > 1 ? (
            <button
              onClick={goPrev}
              className="flex items-center gap-2 px-5 py-3 border-2 border-zinc-300 text-zinc-600 text-xs tracking-[0.2em] uppercase font-bold hover:border-black hover:text-black transition-all"
            >
              <ChevronLeft size={14} />
              PREV
            </button>
          ) : (
            <div />
          )}

          <div className="text-center">
            <div className="text-[9px] tracking-[0.3em] uppercase text-zinc-400">
              {step} / {STEPS.length} ITEMS
            </div>
          </div>

          <button
            onClick={goNext}
            disabled={!isStepComplete()}
            className={`
              flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase font-black transition-all duration-150
              ${isStepComplete()
                ? 'bg-black text-white hover:shadow-[4px_4px_0px_#555] border-2 border-black'
                : 'bg-zinc-100 text-zinc-300 border-2 border-zinc-100 cursor-not-allowed'
              }
            `}
          >
            {step === STEPS.length ? (
              <>
                <Sparkles size={14} />
                STYLE ME
              </>
            ) : (
              <>
                NEXT
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>

        {/* 데모 빠른 채우기 / Demo quick fill */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setInput({
                nationality: mockInput.nationality,
                age: mockInput.age,
                educationLevel: mockInput.educationLevel,
                availableAnnualFund: mockInput.availableAnnualFund,
                finalGoal: mockInput.finalGoal,
                priorityPreference: mockInput.priorityPreference,
              });
              setAgeInput(String(mockInput.age));
              handleSubmit();
            }}
            className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 hover:text-black underline underline-offset-4 transition-colors"
          >
            USE SAMPLE LOOK (데모)
          </button>
        </div>

        {/* 패션 브랜드 워터마크 / Fashion brand watermark */}
        <div className="mt-12 pt-6 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[9px] tracking-[0.4em] uppercase text-zinc-300">JOBCHAJA</span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-300">VISA FASHION STYLING</span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-300">2026</span>
        </div>
      </div>
    </div>
  );
}
