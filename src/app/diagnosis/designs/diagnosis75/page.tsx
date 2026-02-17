'use client';

// 비자 진단 페이지 - 음식 배달 스타일 (디자인 #75)
// Visa Diagnosis Page - Food Delivery Style (Design #75)
// 컨셉: 배달 앱처럼 비자를 메뉴로 골라 주문하는 경험
// Concept: Order visas like food delivery — menu cards, customization, order tracking

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
  MapPin,
  Clock,
  Star,
  ChevronRight,
  ShoppingCart,
  CheckCircle,
  Bike,
  Utensils,
  Package,
  Flame,
  Tag,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Truck,
  Navigation,
  Home,
  Search,
  Heart,
  Bell,
  ChevronDown,
  ChevronUp,
  Circle,
  Zap,
  Shield,
  TrendingUp,
  DollarSign,
  BookOpen,
  Award,
} from 'lucide-react';

// ============================================================
// 단계 정의 / Step definitions
// ============================================================
type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const STEPS: { key: StepKey; label: string; labelEn: string; icon: string }[] = [
  { key: 'nationality', label: '국가 선택', labelEn: 'Select Country', icon: '🌍' },
  { key: 'age', label: '나이 입력', labelEn: 'Your Age', icon: '🎂' },
  { key: 'educationLevel', label: '학력 선택', labelEn: 'Education', icon: '🎓' },
  { key: 'availableAnnualFund', label: '예산 설정', labelEn: 'Budget', icon: '💰' },
  { key: 'finalGoal', label: '목표 선택', labelEn: 'Your Goal', icon: '🎯' },
  { key: 'priorityPreference', label: '우선순위', labelEn: 'Priority', icon: '⚡' },
];

// 우선순위 아이콘 매핑 / Priority icon mapping
const priorityIconMap: Record<string, React.ReactNode> = {
  speed: <Zap size={18} />,
  stability: <Shield size={18} />,
  cost: <DollarSign size={18} />,
  income: <TrendingUp size={18} />,
};

// ============================================================
// 카트 아이템 타입 / Cart item type
// ============================================================
interface CartItem {
  pathway: CompatPathway;
  quantity: number;
}

// ============================================================
// 배달 주소 카드 컴포넌트 / Delivery address card component
// ============================================================
function DeliveryAddressCard({ flag, country }: { flag: string; country: string }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-[#e8f5f3]">
      <MapPin size={14} className="text-[#00C4AC]" />
      <span className="text-xs text-gray-600">배달지:</span>
      <span className="text-xs font-bold text-gray-800">
        {flag} {country}
      </span>
    </div>
  );
}

// ============================================================
// 점수 별 표시 / Score star display
// ============================================================
function ScoreStars({ score }: { score: number }) {
  // 100점 만점 기준 5개 별 / 5 stars based on 100 points max
  const filled = Math.round((score / 100) * 5);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

// ============================================================
// 배달 시간 표시 / Delivery time display
// ============================================================
function DeliveryTime({ months }: { months: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <Clock size={11} />
      <span>{months}개월</span>
    </div>
  );
}

// ============================================================
// 메뉴 카드 (비자 경로) / Menu card (visa pathway)
// ============================================================
function MenuCard({
  pathway,
  onAddToCart,
  inCart,
}: {
  pathway: CompatPathway;
  onAddToCart: (p: CompatPathway) => void;
  inCart: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // 카테고리 배지 색상 / Category badge color
  const categoryColor =
    pathway.platformSupport === 'full_support'
      ? 'bg-[#00C4AC] text-white'
      : pathway.platformSupport === 'visa_processing'
      ? 'bg-blue-500 text-white'
      : 'bg-gray-200 text-gray-600';

  const categoryLabel =
    pathway.platformSupport === 'full_support'
      ? '완전지원'
      : pathway.platformSupport === 'visa_processing'
      ? '비자처리'
      : '정보제공';

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 overflow-hidden ${
        inCart ? 'border-[#00C4AC]' : 'border-gray-100 hover:border-[#b2ede8]'
      }`}
    >
      {/* 메뉴 이미지 영역 (비자 코드 비주얼) / Menu image area */}
      <div className="relative h-28 bg-linear-to-br from-[#e8faf8] to-[#d1f5f0] flex items-center justify-center">
        {/* 비자 체인 태그 / Visa chain tags */}
        <div className="flex flex-wrap gap-1 justify-center px-4">
          {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
            <span key={i} className="bg-white text-[#00C4AC] text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
              {v.code}
            </span>
          ))}
        </div>

        {/* 점수 배지 / Score badge */}
        <div
          className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md"
          style={{ backgroundColor: scoreColor }}
        >
          {pathway.finalScore}
        </div>

        {/* 카테고리 라벨 / Category label */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${categoryColor}`}>
          {categoryLabel}
        </span>

        {/* 인기 배지 / Popular badge */}
        {pathway.finalScore >= 50 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            <Flame size={10} />
            인기
          </div>
        )}
      </div>

      {/* 메뉴 정보 / Menu info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{pathway.nameKo}</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{pathway.nameEn}</p>
          </div>
          <span className="text-lg ml-2 shrink-0">{emoji}</span>
        </div>

        {/* 별점 + 배달시간 / Stars + delivery time */}
        <div className="flex items-center justify-between mb-3">
          <ScoreStars score={pathway.finalScore} />
          <DeliveryTime months={pathway.estimatedMonths} />
        </div>

        {/* 가격 (비용) / Price (cost) */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-base font-black text-gray-900">
              {pathway.estimatedCostWon === 0
                ? '무료'
                : `${pathway.estimatedCostWon.toLocaleString()}만원`}
            </span>
            <span className="text-xs text-gray-400 ml-1">예상 비용</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
            {pathway.feasibilityLabel}
          </span>
        </div>

        {/* 설명 / Description */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{pathway.note}</p>

        {/* 상세 펼치기 / Expand details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-[#00C4AC] font-semibold mb-3 hover:opacity-80 transition-opacity"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? '접기' : '상세보기'}
        </button>

        {/* 확장 영역: 마일스톤 / Expanded: milestones */}
        {expanded && (
          <div className="mb-3 border-t border-gray-100 pt-3">
            <p className="text-xs font-bold text-gray-700 mb-2">진행 단계 (레시피)</p>
            <div className="space-y-2">
              {pathway.milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#e8faf8] text-[#00C4AC] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {m.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{m.nameKo}</p>
                    <p className="text-xs text-gray-400">
                      {m.monthFromStart}개월차
                      {m.visaStatus && m.visaStatus !== 'none' && (
                        <span className="ml-1 text-[#00C4AC] font-bold">{m.visaStatus}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 장바구니 담기 버튼 / Add to cart button */}
        <button
          onClick={() => onAddToCart(pathway)}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            inCart
              ? 'bg-[#00C4AC] text-white shadow-md'
              : 'bg-[#e8faf8] text-[#00C4AC] hover:bg-[#00C4AC] hover:text-white'
          }`}
        >
          <ShoppingCart size={14} />
          {inCart ? '담겼어요 ✓' : '담기'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 주문 추적 (결과 뷰) / Order tracking (result view)
// ============================================================
function OrderTracking({ pathway, onBack }: { pathway: CompatPathway; onBack: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // 주문 상태 단계 / Order status stages
  const orderStages = [
    { label: '주문 접수', labelEn: 'Order Received', icon: CheckCircle, color: 'text-green-500' },
    { label: '준비 중', labelEn: 'Preparing', icon: Utensils, color: 'text-yellow-500' },
    { label: '배달 중', labelEn: 'On the Way', icon: Bike, color: 'text-blue-500' },
    { label: '도착 완료', labelEn: 'Delivered', icon: Home, color: 'text-[#00C4AC]' },
  ];

  return (
    <div className="min-h-screen bg-[#f0faf9]">
      {/* 주문 추적 헤더 / Order tracking header */}
      <div className="bg-[#00C4AC] text-white px-4 pt-12 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 text-sm mb-4 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          메뉴로 돌아가기
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Truck size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs">주문번호 #{pathway.pathwayId}</p>
            <h2 className="text-xl font-black">{pathway.nameKo}</h2>
            <p className="text-white/70 text-xs">{pathway.nameEn}</p>
          </div>
          <span className="ml-auto text-2xl">{emoji}</span>
        </div>

        {/* 예상 배달 시간 / Estimated delivery time */}
        <div className="bg-white/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs">예상 완료 시간</p>
            <p className="text-2xl font-black">{pathway.estimatedMonths}개월</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs">예상 비용</p>
            <p className="text-xl font-black">
              {pathway.estimatedCostWon === 0 ? '무료' : `${pathway.estimatedCostWon.toLocaleString()}만원`}
            </p>
          </div>
        </div>
      </div>

      {/* 주문 단계 추적 (배달 앱 UI) / Order stage tracking (delivery app UI) */}
      <div className="px-4 -mt-2 mb-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-sm font-bold text-gray-700 mb-4">배달 현황 (비자 진행 단계)</p>

          {/* 진행 바 / Progress bar */}
          <div className="relative flex items-center justify-between mb-6">
            <div className="absolute left-0 right-0 h-1 bg-gray-100 top-4 z-0" />
            <div
              className="absolute left-0 h-1 bg-[#00C4AC] top-4 z-0 transition-all duration-500"
              style={{ width: `${(activeStep / (orderStages.length - 1)) * 100}%` }}
            />
            {orderStages.map((stage, i) => {
              const Icon = stage.icon;
              const isActive = i <= activeStep;
              return (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="relative z-10 flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive ? 'bg-[#00C4AC]' : 'bg-gray-100'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <span className={`text-xs font-semibold ${isActive ? 'text-[#00C4AC]' : 'text-gray-400'}`}>
                    {stage.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 현재 단계 설명 / Current stage description */}
          <div className="bg-[#e8faf8] rounded-xl p-3 text-center">
            <p className="text-xs text-[#00C4AC] font-bold">{orderStages[activeStep].label}</p>
            <p className="text-xs text-gray-500 mt-1">{orderStages[activeStep].labelEn}</p>
          </div>
        </div>
      </div>

      {/* 비자 체인 지도 / Visa chain map */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Navigation size={16} className="text-[#00C4AC]" />
            <p className="text-sm font-bold text-gray-700">비자 경로 지도</p>
          </div>

          {/* 배달 경로 시각화 / Route visualization */}
          <div className="relative">
            {pathway.milestones.map((milestone, i) => (
              <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                {/* 타임라인 점/선 / Timeline dot/line */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      milestone.type === 'final_goal'
                        ? 'bg-[#00C4AC] text-white'
                        : 'bg-[#e8faf8] text-[#00C4AC]'
                    }`}
                  >
                    {milestone.type === 'final_goal' ? '🏁' : milestone.order}
                  </div>
                  {i < pathway.milestones.length - 1 && (
                    <div className="w-0.5 h-6 bg-gray-100 mt-1" />
                  )}
                </div>

                {/* 마일스톤 정보 / Milestone info */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">{milestone.nameKo}</p>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {milestone.monthFromStart}개월차
                    </span>
                  </div>
                  {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                    <span className="inline-block bg-[#e8faf8] text-[#00C4AC] text-xs font-bold px-2 py-0.5 rounded-lg mt-1">
                      {milestone.visaStatus}
                    </span>
                  )}
                  {milestone.canWorkPartTime && (
                    <span className="inline-block bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-lg mt-1 ml-1">
                      주{milestone.weeklyHours}시간 근무 가능
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 다음 단계 (주문 후 할 일) / Next steps (post-order actions) */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-[#00C4AC]" />
            <p className="text-sm font-bold text-gray-700">지금 당장 할 일</p>
          </div>
          <div className="space-y-2">
            {pathway.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#f8fffe] rounded-xl border border-[#e8faf8]">
                <div className="w-6 h-6 bg-[#00C4AC] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800">{step.nameKo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 점수 분석 (영양 정보 스타일) / Score analysis (nutrition label style) */}
      <div className="px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-sm font-bold text-gray-700 mb-3">비자 영양 정보</p>
          <div className="border-t-4 border-b-4 border-gray-900 py-2 mb-2">
            <p className="text-xs text-gray-500">총 적합도 점수 / Total Feasibility Score</p>
            <p className="text-3xl font-black text-gray-900" style={{ color: getScoreColor(pathway.finalScore) }}>
              {pathway.finalScore} <span className="text-base font-normal text-gray-400">/ 100</span>
            </p>
          </div>
          <div className="space-y-2">
            {[
              { label: '기본 점수', value: pathway.scoreBreakdown.base },
              {
                label: '나이 배수',
                value: Math.round(pathway.scoreBreakdown.ageMultiplier * 100),
                suffix: '%',
              },
              {
                label: '국적 배수',
                value: Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100),
                suffix: '%',
              },
              {
                label: '자금 배수',
                value: Math.round(pathway.scoreBreakdown.fundMultiplier * 100),
                suffix: '%',
              },
              {
                label: '학력 배수',
                value: Math.round(pathway.scoreBreakdown.educationMultiplier * 100),
                suffix: '%',
              },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-1">
                <span className="text-xs text-gray-600">{row.label}</span>
                <span className="text-xs font-bold text-gray-900">
                  {row.value}
                  {row.suffix ?? '점'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 장바구니 패널 / Cart panel
// ============================================================
function CartPanel({
  cart,
  onCheckout,
  onRemove,
  onClose,
}: {
  cart: CartItem[];
  onCheckout: (pathway: CompatPathway) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 배경 오버레이 / Background overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 장바구니 시트 / Cart sheet */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-[#00C4AC]" />
            <h3 className="font-black text-gray-900 text-lg">내 비자 장바구니</h3>
          </div>
          <span className="text-sm text-gray-400">{cart.length}개 담음</span>
        </div>

        {cart.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-semibold">아직 담은 경로가 없어요</p>
            <p className="text-gray-300 text-xs mt-1">메뉴에서 비자 경로를 선택해보세요</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {cart.map((item) => (
              <div
                key={item.pathway.pathwayId}
                className="flex items-center gap-3 bg-[#f8fffe] rounded-xl p-3 border border-[#e8faf8]"
              >
                <div className="w-10 h-10 bg-[#e8faf8] rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-lg">{getFeasibilityEmoji(item.pathway.feasibilityLabel)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{item.pathway.nameKo}</p>
                  <p className="text-xs text-gray-500">{item.pathway.estimatedMonths}개월</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onCheckout(item.pathway)}
                    className="bg-[#00C4AC] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#00b09b] transition-colors"
                  >
                    주문하기
                  </button>
                  <button
                    onClick={() => onRemove(item.pathway.pathwayId)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================
export default function Diagnosis75Page() {
  // 단계별 상태 / Step state
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  const [ageInput, setAgeInput] = useState('');

  // 결과 및 장바구니 상태 / Result and cart state
  const [showResults, setShowResults] = useState(false);
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderTracking, setOrderTracking] = useState<CompatPathway | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const pathways = mockPathways;
  const totalSteps = STEPS.length;

  // 현재 단계 정보 / Current step info
  const step = STEPS[currentStep];

  // 다음 단계로 / Go to next step
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // 마지막 단계 → 결과 표시 / Last step → show results
      setShowResults(true);
    }
  };

  // 이전 단계로 / Go to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  // 입력 업데이트 / Update input
  const updateInput = (key: StepKey, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // 장바구니 추가 / Add to cart
  const addToCart = (pathway: CompatPathway) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.pathway.pathwayId === pathway.pathwayId);
      if (existing) {
        return prev.filter((c) => c.pathway.pathwayId !== pathway.pathwayId);
      }
      return [...prev, { pathway, quantity: 1 }];
    });
  };

  // 장바구니에서 제거 / Remove from cart
  const removeFromCart = (pathwayId: string) => {
    setCart((prev) => prev.filter((c) => c.pathway.pathwayId !== pathwayId));
  };

  // 주문하기 (추적 뷰로) / Checkout (to tracking view)
  const handleCheckout = (pathway: CompatPathway) => {
    setOrderTracking(pathway);
    setShowCart(false);
  };

  // 검색 필터 / Search filter
  const filteredPathways = searchQuery
    ? pathways.filter(
        (p) =>
          p.nameKo.includes(searchQuery) ||
          p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.visaChainStr.includes(searchQuery),
      )
    : pathways;

  const isInCart = (pathwayId: string) => cart.some((c) => c.pathway.pathwayId === pathwayId);

  // ── 주문 추적 뷰 / Order tracking view ──
  if (orderTracking) {
    return <OrderTracking pathway={orderTracking} onBack={() => setOrderTracking(null)} />;
  }

  // ── 결과 뷰 (메뉴판) / Results view (menu board) ──
  if (showResults) {
    const selectedCountry = popularCountries.find((c) => c.code === input.nationality);
    return (
      <div className="min-h-screen bg-[#f0faf9]">
        {/* 배달 앱 헤더 / Delivery app header */}
        <div className="bg-white sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 px-4 pt-3 pb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} className="text-[#00C4AC]" />
                <span>배달지</span>
              </div>
              <p className="font-black text-gray-900 text-base truncate">
                {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.nameKo}` : '전체'}
              </p>
            </div>
            {/* 장바구니 버튼 / Cart button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative w-10 h-10 bg-[#e8faf8] rounded-xl flex items-center justify-center"
            >
              <ShoppingCart size={18} className="text-[#00C4AC]" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* 검색 바 / Search bar */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 bg-[#f0faf9] rounded-xl px-3 py-2">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="비자 경로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* 카테고리 탭 / Category tabs */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
            {['전체', '빠른경로', '저비용', '안정적'].map((tab) => (
              <button
                key={tab}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-[#00C4AC] text-white first:bg-[#00C4AC] bg-gray-100 text-gray-600"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 프로모션 배너 / Promo banner */}
        <div className="mx-4 mt-4 mb-4 bg-linear-to-br from-[#00C4AC] to-[#00a896] rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-20">🛵</div>
          <p className="text-xs font-semibold text-white/80 mb-1">잡차자 비자 배달 서비스</p>
          <p className="text-xl font-black">
            {result.meta.totalPathwaysEvaluated}개 경로 분석완료!
          </p>
          <p className="text-xs text-white/70 mt-1">
            {result.meta.hardFilteredOut}개 제외 →{' '}
            <span className="font-bold text-white">
              {result.pathways.length}개 경로 추천
            </span>
          </p>
        </div>

        {/* 메뉴판 그리드 / Menu grid */}
        <div className="px-4 pb-24">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">
              추천 메뉴{' '}
              <span className="text-[#00C4AC]">{filteredPathways.length}개</span>
            </p>
            <p className="text-xs text-gray-400">점수 높은 순</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredPathways.map((pathway) => (
              <MenuCard
                key={pathway.pathwayId}
                pathway={pathway}
                onAddToCart={addToCart}
                inCart={isInCart(pathway.pathwayId)}
              />
            ))}
          </div>
        </div>

        {/* 하단 네비게이션 바 / Bottom navigation bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-around z-20">
          <button className="flex flex-col items-center gap-1">
            <Home size={20} className="text-[#00C4AC]" />
            <span className="text-xs text-[#00C4AC] font-bold">메뉴</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Search size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400">검색</span>
          </button>
          <button
            onClick={() => setShowCart(true)}
            className="relative flex flex-col items-center gap-1"
          >
            <ShoppingCart size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400">장바구니</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button className="flex flex-col items-center gap-1">
            <Bell size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400">알림</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Heart size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400">찜</span>
          </button>
        </div>

        {/* 장바구니 패널 / Cart panel */}
        {showCart && (
          <CartPanel
            cart={cart}
            onCheckout={handleCheckout}
            onRemove={removeFromCart}
            onClose={() => setShowCart(false)}
          />
        )}
      </div>
    );
  }

  // ── 입력 플로우 뷰 / Input flow view ──
  return (
    <div className="min-h-screen bg-[#f0faf9] flex flex-col">
      {/* 배달 앱 상단 헤더 / Delivery app top header */}
      <div className="bg-[#00C4AC] text-white px-4 pt-10 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bike size={20} className="text-white" />
          <span className="text-xs font-bold text-white/80">잡차자 비자 배달</span>
        </div>
        <h1 className="text-2xl font-black">비자 주문하기 🛵</h1>
        <p className="text-white/70 text-xs mt-1">원하는 비자를 메뉴판에서 골라보세요</p>
      </div>

      {/* 주문 진행 스텝 바 / Order progress step bar */}
      <div className="bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1 mb-2">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? 'bg-[#00C4AC]' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{step.icon}</span>
            <div>
              <p className="text-sm font-black text-gray-900">{step.label}</p>
              <p className="text-xs text-gray-400">{step.labelEn}</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 font-bold">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>
      </div>

      {/* 단계별 입력 콘텐츠 / Step-specific input content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        {/* STEP 1: 국가 선택 / Nationality */}
        {step.key === 'nationality' && (
          <div>
            <div className="text-center mb-6">
              <p className="text-lg font-black text-gray-900">어느 나라에서 오셨나요?</p>
              <p className="text-xs text-gray-400 mt-1">Where are you from?</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {popularCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => updateInput('nationality', country.code)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                    input.nationality === country.code
                      ? 'border-[#00C4AC] bg-[#e8faf8] shadow-md'
                      : 'border-gray-100 bg-white hover:border-[#b2ede8]'
                  }`}
                >
                  <span className="text-3xl">{country.flag}</span>
                  <span className="text-xs font-bold text-gray-700">{country.nameKo}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: 나이 / Age */}
        {step.key === 'age' && (
          <div>
            <div className="text-center mb-6">
              <p className="text-lg font-black text-gray-900">나이가 어떻게 되세요?</p>
              <p className="text-xs text-gray-400 mt-1">How old are you?</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 bg-white rounded-full shadow-lg flex flex-col items-center justify-center border-4 border-[#00C4AC]">
                <span className="text-6xl font-black text-[#00C4AC]">
                  {ageInput || '--'}
                </span>
                <span className="text-gray-400 text-sm font-semibold">세</span>
              </div>

              {/* 숫자 패드 / Number pad */}
              <div className="w-full max-w-xs">
                <input
                  type="number"
                  min={15}
                  max={70}
                  value={ageInput}
                  onChange={(e) => {
                    setAgeInput(e.target.value);
                    updateInput('age', Number(e.target.value));
                  }}
                  placeholder="나이를 입력하세요"
                  className="w-full text-center text-2xl font-black bg-white border-2 border-[#e8faf8] rounded-2xl px-4 py-4 text-gray-900 outline-none focus:border-[#00C4AC] transition-colors"
                />
                <p className="text-center text-xs text-gray-400 mt-2">15 ~ 70세 입력 가능</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: 학력 / Education */}
        {step.key === 'educationLevel' && (
          <div>
            <div className="text-center mb-6">
              <p className="text-lg font-black text-gray-900">최종 학력을 선택해주세요</p>
              <p className="text-xs text-gray-400 mt-1">Select your education level</p>
            </div>
            <div className="space-y-2">
              {educationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateInput('educationLevel', opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    input.educationLevel === opt.value
                      ? 'border-[#00C4AC] bg-[#e8faf8] shadow-sm'
                      : 'border-gray-100 bg-white hover:border-[#b2ede8]'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{opt.labelKo}</p>
                    <p className="text-xs text-gray-400">{opt.labelEn}</p>
                  </div>
                  {input.educationLevel === opt.value && (
                    <CheckCircle size={20} className="text-[#00C4AC] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: 예산 / Fund */}
        {step.key === 'availableAnnualFund' && (
          <div>
            <div className="text-center mb-6">
              <p className="text-lg font-black text-gray-900">연간 사용 가능 예산은?</p>
              <p className="text-xs text-gray-400 mt-1">Available annual budget</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fundOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateInput('availableAnnualFund', opt.value)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                    input.availableAnnualFund === opt.value
                      ? 'border-[#00C4AC] bg-[#e8faf8] shadow-sm'
                      : 'border-gray-100 bg-white hover:border-[#b2ede8]'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    <Tag size={14} className="text-[#00C4AC]" />
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{opt.labelKo}</p>
                  <p className="text-xs text-gray-400">{opt.labelEn}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: 목표 / Goal */}
        {step.key === 'finalGoal' && (
          <div>
            <div className="text-center mb-6">
              <p className="text-lg font-black text-gray-900">한국에서 어떤 목표인가요?</p>
              <p className="text-xs text-gray-400 mt-1">What's your goal in Korea?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateInput('finalGoal', opt.value)}
                  className={`p-5 rounded-2xl border-2 text-center transition-all duration-200 ${
                    input.finalGoal === opt.value
                      ? 'border-[#00C4AC] bg-[#e8faf8] shadow-sm'
                      : 'border-gray-100 bg-white hover:border-[#b2ede8]'
                  }`}
                >
                  <span className="text-4xl block mb-2">{opt.emoji}</span>
                  <p className="font-bold text-gray-900">{opt.labelKo}</p>
                  <p className="text-xs text-gray-400 mt-1">{opt.descKo}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: 우선순위 / Priority */}
        {step.key === 'priorityPreference' && (
          <div>
            <div className="text-center mb-6">
              <p className="text-lg font-black text-gray-900">가장 중요한 것은 무엇인가요?</p>
              <p className="text-xs text-gray-400 mt-1">What's your top priority?</p>
            </div>
            <div className="space-y-3">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateInput('priorityPreference', opt.value)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                    input.priorityPreference === opt.value
                      ? 'border-[#00C4AC] bg-[#e8faf8] shadow-sm'
                      : 'border-gray-100 bg-white hover:border-[#b2ede8]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      input.priorityPreference === opt.value
                        ? 'bg-[#00C4AC] text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {priorityIconMap[opt.value] ?? <span>{opt.emoji}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{opt.labelKo}</p>
                    <p className="text-xs text-gray-400">{opt.descKo}</p>
                  </div>
                  {input.priorityPreference === opt.value && (
                    <CheckCircle size={20} className="text-[#00C4AC] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 버튼 / Bottom navigation buttons */}
      <div className="bg-white px-4 py-4 border-t border-gray-100">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:border-[#00C4AC] hover:text-[#00C4AC] transition-all"
            >
              <ArrowLeft size={16} />
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              (step.key === 'nationality' && !input.nationality) ||
              (step.key === 'age' && (!input.age || Number(input.age) < 15)) ||
              (step.key === 'educationLevel' && !input.educationLevel) ||
              (step.key === 'availableAnnualFund' && input.availableAnnualFund === undefined) ||
              (step.key === 'finalGoal' && !input.finalGoal) ||
              (step.key === 'priorityPreference' && !input.priorityPreference)
            }
            className="flex-1 flex items-center justify-center gap-2 bg-[#00C4AC] text-white font-black py-3.5 rounded-2xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00b09b] transition-all active:scale-95"
          >
            {currentStep === totalSteps - 1 ? (
              <>
                <Truck size={18} />
                비자 메뉴 보기
              </>
            ) : (
              <>
                다음
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* 건너뛰기 (목업 데이터로) / Skip with mock data */}
        <button
          onClick={() => {
            setInput(mockInput as Partial<DiagnosisInput>);
            setShowResults(true);
          }}
          className="w-full text-center text-xs text-gray-400 mt-3 hover:text-[#00C4AC] transition-colors"
        >
          건너뛰고 예시 메뉴 보기 (데모)
        </button>
      </div>
    </div>
  );
}
