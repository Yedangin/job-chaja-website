'use client';

// ============================================================
// 비자 진단 페이지 - 74번: 장바구니(Shopping Cart) 스타일
// Visa Diagnosis Page - Design #74: Shopping Cart Style
// 장바구니에 조건을 담고 결제(진단)하는 쇼핑 경험
// Shopping experience where user adds conditions to cart and "checks out" for diagnosis
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
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Package,
  Star,
  Clock,
  DollarSign,
  Globe,
  GraduationCap,
  Target,
  Zap,
  Wallet,
  ShoppingBag,
  X,
  ArrowRight,
  Gift,
  TrendingUp,
  Shield,
  BarChart3,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

// 장바구니 아이템 타입 / Cart item type
interface CartItem {
  id: string;
  category: string;
  categoryKo: string;
  label: string;
  labelEn: string;
  value: string | number;
  quantity: number; // 수량(강도) / quantity (intensity level)
  price: number; // 포인트 가격 / point price
  icon: React.ReactNode;
  color: string;
}

// 진단 단계 / Diagnosis steps
type DiagnosisStep = 'cart' | 'checkout' | 'result';

// ============================================================
// 상수 및 유틸 / Constants and utilities
// ============================================================

// Shopify 그린 팔레트 / Shopify green palette
const SHOPIFY_GREEN = '#008060';
const SHOPIFY_GREEN_DARK = '#004c3f';
const SHOPIFY_GREEN_LIGHT = '#e3f1ee';

// 장바구니 아이템 카테고리 설정 / Cart item category configuration
const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; maxQty: number; pricePerUnit: number }> = {
  nationality: { icon: <Globe size={16} />, color: 'text-blue-600', maxQty: 1, pricePerUnit: 20 },
  age: { icon: <Target size={16} />, color: 'text-purple-600', maxQty: 1, pricePerUnit: 15 },
  education: { icon: <GraduationCap size={16} />, color: 'text-green-600', maxQty: 1, pricePerUnit: 25 },
  fund: { icon: <Wallet size={16} />, color: 'text-yellow-600', maxQty: 1, pricePerUnit: 30 },
  goal: { icon: <Star size={16} />, color: 'text-red-500', maxQty: 1, pricePerUnit: 20 },
  priority: { icon: <Zap size={16} />, color: 'text-orange-500', maxQty: 1, pricePerUnit: 15 },
};

// 쿠폰 코드 목록 / Coupon code list
const VALID_COUPONS: Record<string, { labelKo: string; discount: string }> = {
  'VISA10': { labelKo: '비자 진단 10% 할인', discount: '10% OFF' },
  'FREE2024': { labelKo: '무료 진단권', discount: 'FREE' },
};

// ============================================================
// 하위 컴포넌트 / Sub-components
// ============================================================

// 장바구니 상품 행 / Cart product row
function CartRow({
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, delta: number) => void;
}) {
  const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.nationality;
  return (
    <div className="flex items-center gap-3 py-4 border-b border-gray-100 group">
      {/* 아이콘 + 카테고리 / Icon + category */}
      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 ${config.color}`}>
        {config.icon}
      </div>

      {/* 아이템 정보 / Item info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{item.categoryKo}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{item.label}</p>
        <p className="text-xs text-gray-400">{item.labelEn}</p>
      </div>

      {/* 수량 조절 / Quantity control */}
      <div className="shrink-0 flex items-center gap-1.5">
        <button
          onClick={() => onQtyChange(item.id, -1)}
          className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="수량 감소"
        >
          <Minus size={10} />
        </button>
        <span className="w-5 text-center text-sm font-semibold text-gray-700">{item.quantity}</span>
        <button
          onClick={() => onQtyChange(item.id, 1)}
          className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="수량 증가"
        >
          <Plus size={10} />
        </button>
      </div>

      {/* 포인트 / Point */}
      <div className="shrink-0 w-16 text-right">
        <span className="text-sm font-bold text-gray-800">{item.price * item.quantity}P</span>
      </div>

      {/* 삭제 버튼 / Remove button */}
      <button
        onClick={() => onRemove(item.id)}
        className="shrink-0 w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors rounded"
        aria-label="삭제"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// 진단 결과 카드 / Diagnosis result card
function PathwayOrderItem({
  pathway,
  index,
}: {
  pathway: CompatPathway;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);
  const scoreColor = getScoreColor(pathway.finalScore);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      {/* 헤더 / Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* 순서 배지 / Order badge */}
        <div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: index === 0 ? SHOPIFY_GREEN : '#6b7280' }}
        >
          {index + 1}
        </div>

        {/* 경로 정보 / Pathway info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{emoji}</span>
            <p className="text-sm font-bold text-gray-800 truncate">{pathway.nameKo}</p>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{pathway.nameEn}</p>
        </div>

        {/* 점수 / Score */}
        <div className="shrink-0 text-right mr-2">
          <div className="text-lg font-black" style={{ color: scoreColor }}>{pathway.finalScore}</div>
          <div className="text-xs text-gray-400">점수</div>
        </div>

        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* 상세 내용 / Details */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
          {/* 핵심 지표 / Key metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100">
              <Clock size={14} className="mx-auto mb-1 text-blue-500" />
              <div className="text-sm font-bold text-gray-800">{pathway.estimatedMonths}개월</div>
              <div className="text-xs text-gray-400">소요기간</div>
            </div>
            <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100">
              <DollarSign size={14} className="mx-auto mb-1 text-green-500" />
              <div className="text-sm font-bold text-gray-800">
                {pathway.estimatedCostWon === 0 ? '무료' : `${pathway.estimatedCostWon.toLocaleString()}만원`}
              </div>
              <div className="text-xs text-gray-400">예상비용</div>
            </div>
            <div className="bg-white rounded-lg p-2.5 text-center border border-gray-100">
              <Shield size={14} className="mx-auto mb-1 text-purple-500" />
              <div className="text-sm font-bold text-gray-800">{pathway.feasibilityLabel}</div>
              <div className="text-xs text-gray-400">가능성</div>
            </div>
          </div>

          {/* 비자 체인 / Visa chain */}
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-2">비자 경로</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">{v.code}</span>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight size={10} className="text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 메모 / Note */}
          <p className="text-xs text-gray-500 leading-relaxed">{pathway.note}</p>

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-600">즉시 실행 가능</p>
              {pathway.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-gray-100">
                  <CheckCircle2 size={13} className="text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{step.nameKo}</p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================
export default function Diagnosis74Page() {
  // 현재 단계 / Current step
  const [step, setStep] = useState<DiagnosisStep>('cart');

  // 입력값 상태 / Input value state
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });

  // 장바구니 아이템 / Cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 쿠폰 입력 / Coupon input
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; labelKo: string; discount: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  // 진단 결과 / Diagnosis result
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);

  // 선택된 탭 / Selected tab (상품 추가 패널)
  const [activeAddPanel, setActiveAddPanel] = useState<string | null>('nationality');

  // ============================================================
  // 장바구니 로직 / Cart logic
  // ============================================================

  // 장바구니 총 포인트 / Cart total points
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 아이템 추가 / Add item to cart
  const addToCart = (
    category: string,
    categoryKo: string,
    label: string,
    labelEn: string,
    value: string | number
  ) => {
    const config = CATEGORY_CONFIG[category];
    const existingIndex = cartItems.findIndex((item) => item.category === category);

    if (existingIndex >= 0) {
      // 이미 있으면 교체 / Replace if already exists
      setCartItems((prev) =>
        prev.map((item, i) =>
          i === existingIndex
            ? { ...item, label, labelEn, value, quantity: 1 }
            : item
        )
      );
    } else {
      // 새로 추가 / Add new
      const newItem: CartItem = {
        id: `${category}-${Date.now()}`,
        category,
        categoryKo,
        label,
        labelEn,
        value,
        quantity: 1,
        price: config?.pricePerUnit ?? 15,
        icon: config?.icon ?? <Package size={16} />,
        color: config?.color ?? 'text-gray-600',
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    // 입력값 업데이트 / Update input value
    if (category === 'nationality') setInput((prev) => ({ ...prev, nationality: value as string }));
    else if (category === 'age') setInput((prev) => ({ ...prev, age: value as number }));
    else if (category === 'education') setInput((prev) => ({ ...prev, educationLevel: value as string }));
    else if (category === 'fund') setInput((prev) => ({ ...prev, availableAnnualFund: value as number }));
    else if (category === 'goal') setInput((prev) => ({ ...prev, finalGoal: value as string }));
    else if (category === 'priority') setInput((prev) => ({ ...prev, priorityPreference: value as string }));

    // 다음 패널로 이동 / Move to next panel
    const panels = ['nationality', 'age', 'education', 'fund', 'goal', 'priority'];
    const currentIdx = panels.indexOf(category);
    if (currentIdx < panels.length - 1) {
      setActiveAddPanel(panels[currentIdx + 1]);
    } else {
      setActiveAddPanel(null);
    }
  };

  // 아이템 제거 / Remove item
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 수량 변경 / Change quantity
  const changeQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const config = CATEGORY_CONFIG[item.category];
        const maxQty = config?.maxQty ?? 3;
        const newQty = Math.max(1, Math.min(maxQty, item.quantity + delta));
        return { ...item, quantity: newQty };
      })
    );
  };

  // ============================================================
  // 쿠폰 로직 / Coupon logic
  // ============================================================

  const applyCoupon = () => {
    setCouponError('');
    const coupon = VALID_COUPONS[couponCode.trim().toUpperCase()];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      setCouponCode('');
    } else {
      setCouponError('유효하지 않은 쿠폰 코드입니다.');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // ============================================================
  // 진단 실행 / Run diagnosis
  // ============================================================

  const runDiagnosis = () => {
    setDiagnosisLoading(true);
    setTimeout(() => {
      setResult(mockDiagnosisResult);
      setStep('result');
      setDiagnosisLoading(false);
    }, 1800);
  };

  // 장바구니 완성도 / Cart completeness
  const requiredCategories = ['nationality', 'age', 'education', 'fund', 'goal', 'priority'];
  const filledCategories = requiredCategories.filter((cat) =>
    cartItems.some((item) => item.category === cat)
  );
  const completionPct = Math.round((filledCategories.length / requiredCategories.length) * 100);
  const isCartComplete = filledCategories.length === requiredCategories.length;

  // ============================================================
  // 렌더링 / Rendering
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ======================================================
          헤더 / Header - Shopify 스타일
      ====================================================== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: SHOPIFY_GREEN }}>
              <ShoppingBag size={16} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800">비자 진단샵</span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-1">Visa Diagnosis Store</span>
            </div>
          </div>

          {/* 장바구니 아이콘 / Cart icon */}
          <button
            onClick={() => { if (step !== 'result') setStep('cart'); }}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ color: SHOPIFY_GREEN }}
          >
            <ShoppingCart size={18} />
            <span>{cartItems.length}</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ backgroundColor: SHOPIFY_GREEN }}>
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        {/* 단계 진행 바 / Step progress bar */}
        <div className="max-w-2xl mx-auto px-4 pb-2">
          <div className="flex items-center gap-2 text-xs">
            {(['cart', 'checkout', 'result'] as DiagnosisStep[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px bg-gray-200" />}
                <div className={`flex items-center gap-1 ${step === s ? 'text-green-700 font-semibold' : step > s ? 'text-gray-400' : 'text-gray-300'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs
                    ${step === s ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                    style={step === s ? { backgroundColor: SHOPIFY_GREEN } : {}}
                  >
                    {i + 1}
                  </div>
                  <span className="hidden sm:inline">
                    {s === 'cart' ? '조건 담기' : s === 'checkout' ? '주문 확인' : '진단 결과'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ====================================================
            STEP 1: 장바구니 / Cart step
        ==================================================== */}
        {step === 'cart' && (
          <div className="space-y-4">

            {/* 안내 배너 / Guide banner */}
            <div className="rounded-xl p-4 text-white" style={{ backgroundColor: SHOPIFY_GREEN }}>
              <div className="flex items-start gap-3">
                <ShoppingCart size={24} className="shrink-0 mt-0.5" />
                <div>
                  <h1 className="text-base font-bold">내 조건을 장바구니에 담으세요</h1>
                  <p className="text-sm opacity-90 mt-0.5">
                    국적, 나이, 학력 등을 선택하면 비자 경로를 자동으로 진단해드립니다.
                  </p>
                </div>
              </div>
              {/* 완성도 바 / Completion bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs opacity-80 mb-1">
                  <span>진단 준비 완료도</span>
                  <span>{completionPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/20">
                  <div
                    className="h-2 rounded-full bg-white transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 상품 추가 패널 / Add items panel */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Package size={15} className="text-green-600" />
                  조건 선택하기
                  <span className="text-xs text-gray-400 font-normal">— 클릭해서 장바구니에 담기</span>
                </h2>
              </div>

              {/* 카테고리 탭 / Category tabs */}
              <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
                {[
                  { key: 'nationality', label: '국적', emoji: '🌍' },
                  { key: 'age', label: '나이', emoji: '🎂' },
                  { key: 'education', label: '학력', emoji: '🎓' },
                  { key: 'fund', label: '자금', emoji: '💰' },
                  { key: 'goal', label: '목표', emoji: '🎯' },
                  { key: 'priority', label: '우선순위', emoji: '⚡' },
                ].map((tab) => {
                  const isFilled = cartItems.some((item) => item.category === tab.key);
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveAddPanel(activeAddPanel === tab.key ? null : tab.key)}
                      className={`shrink-0 px-3 py-2.5 text-xs font-semibold flex items-center gap-1 border-b-2 transition-colors
                        ${activeAddPanel === tab.key
                          ? 'border-green-600 text-green-700'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                      {isFilled && <CheckCircle2 size={10} className="text-green-500" />}
                    </button>
                  );
                })}
              </div>

              {/* 선택 옵션 목록 / Selection option list */}
              <div className="p-4">
                {/* 국적 선택 / Nationality selection */}
                {activeAddPanel === 'nationality' && (
                  <div className="grid grid-cols-2 gap-2">
                    {popularCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => addToCart('nationality', '국적', `${country.flag} ${country.nameKo}`, country.nameEn, country.code)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all hover:border-green-400
                          ${input.nationality === country.code ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <span className="text-xl">{country.flag}</span>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{country.nameKo}</p>
                          <p className="text-xs text-gray-400">{country.nameEn}</p>
                        </div>
                        {input.nationality === country.code && (
                          <CheckCircle2 size={12} className="ml-auto text-green-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* 나이 선택 / Age selection */}
                {activeAddPanel === 'age' && (
                  <div className="grid grid-cols-3 gap-2">
                    {[18, 20, 22, 24, 26, 28, 30, 32, 35, 38, 40, 45].map((age) => (
                      <button
                        key={age}
                        onClick={() => addToCart('age', '나이', `${age}세`, `${age} years old`, age)}
                        className={`p-3 rounded-lg border text-sm font-bold transition-all hover:border-green-400
                          ${input.age === age ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {age}세
                      </button>
                    ))}
                  </div>
                )}

                {/* 학력 선택 / Education selection */}
                {activeAddPanel === 'education' && (
                  <div className="space-y-2">
                    {educationOptions.map((edu) => (
                      <button
                        key={edu.value}
                        onClick={() => addToCart('education', '학력', `${edu.emoji} ${edu.labelKo}`, edu.labelEn, edu.value)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:border-green-400
                          ${input.educationLevel === edu.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <span className="text-lg">{edu.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{edu.labelKo}</p>
                          <p className="text-xs text-gray-400">{edu.labelEn}</p>
                        </div>
                        {input.educationLevel === edu.value && (
                          <CheckCircle2 size={14} className="ml-auto text-green-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* 자금 선택 / Fund selection */}
                {activeAddPanel === 'fund' && (
                  <div className="space-y-2">
                    {fundOptions.map((fund) => (
                      <button
                        key={fund.value}
                        onClick={() => addToCart('fund', '연간 자금', fund.labelKo, fund.labelEn, fund.value)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all hover:border-green-400
                          ${input.availableAnnualFund === fund.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{fund.labelKo}</p>
                          <p className="text-xs text-gray-400">{fund.labelEn}</p>
                        </div>
                        {input.availableAnnualFund === fund.value && (
                          <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* 목표 선택 / Goal selection */}
                {activeAddPanel === 'goal' && (
                  <div className="grid grid-cols-2 gap-2">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal.value}
                        onClick={() => addToCart('goal', '최종 목표', `${goal.emoji} ${goal.labelKo}`, goal.labelEn, goal.value)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border text-center transition-all hover:border-green-400
                          ${input.finalGoal === goal.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <span className="text-2xl">{goal.emoji}</span>
                        <p className="text-sm font-bold text-gray-800">{goal.labelKo}</p>
                        <p className="text-xs text-gray-400">{goal.descKo}</p>
                        {input.finalGoal === goal.value && (
                          <CheckCircle2 size={12} className="text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* 우선순위 선택 / Priority selection */}
                {activeAddPanel === 'priority' && (
                  <div className="grid grid-cols-2 gap-2">
                    {priorityOptions.map((priority) => (
                      <button
                        key={priority.value}
                        onClick={() => addToCart('priority', '우선순위', `${priority.emoji} ${priority.labelKo}`, priority.labelEn, priority.value)}
                        className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border text-center transition-all hover:border-green-400
                          ${input.priorityPreference === priority.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <span className="text-2xl">{priority.emoji}</span>
                        <p className="text-sm font-bold text-gray-800">{priority.labelKo}</p>
                        <p className="text-xs text-gray-400">{priority.descKo}</p>
                        {input.priorityPreference === priority.value && (
                          <CheckCircle2 size={12} className="text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {activeAddPanel === null && (
                  <p className="text-sm text-gray-400 text-center py-4">위 탭을 클릭해서 조건을 추가하세요</p>
                )}
              </div>
            </div>

            {/* 장바구니 목록 / Cart list */}
            {cartItems.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingCart size={15} className="text-green-600" />
                    내 장바구니
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: SHOPIFY_GREEN }}>
                      {cartItems.length}
                    </span>
                  </h2>
                  <button
                    onClick={() => setCartItems([])}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={11} />
                    전체 삭제
                  </button>
                </div>
                <div className="px-4">
                  {cartItems.map((item) => (
                    <CartRow
                      key={item.id}
                      item={item}
                      onRemove={removeFromCart}
                      onQtyChange={changeQty}
                    />
                  ))}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">소계</span>
                  <span className="text-sm font-bold text-gray-800">{cartTotal}P</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <ShoppingCart size={32} className="mx-auto mb-3 text-gray-200" />
                <p className="text-sm text-gray-400">장바구니가 비어있습니다</p>
                <p className="text-xs text-gray-300 mt-1">위에서 조건을 선택해 담아보세요</p>
              </div>
            )}

            {/* 결제(진단) 버튼 / Checkout button */}
            <button
              onClick={() => {
                if (cartItems.length > 0) setStep('checkout');
              }}
              disabled={cartItems.length === 0}
              className="w-full py-4 rounded-xl text-base font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: cartItems.length > 0 ? SHOPIFY_GREEN : '#9ca3af' }}
            >
              주문서 확인하기 ({cartItems.length}개 조건)
            </button>

            {!isCartComplete && cartItems.length > 0 && (
              <p className="text-xs text-center text-amber-500">
                {requiredCategories.length - filledCategories.length}개 조건이 더 있으면 더 정확한 진단이 가능합니다.
              </p>
            )}
          </div>
        )}

        {/* ====================================================
            STEP 2: 주문 확인 (체크아웃) / Checkout step
        ==================================================== */}
        {step === 'checkout' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setStep('cart')} className="text-sm text-gray-400 hover:text-gray-600">
                ← 장바구니로
              </button>
            </div>

            <h2 className="text-lg font-black text-gray-800">주문서 확인</h2>
            <p className="text-sm text-gray-500 -mt-2">선택하신 조건으로 비자 경로를 진단합니다</p>

            {/* 주문 아이템 목록 / Order item list */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-700">주문 상품 ({cartItems.length}개)</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {cartItems.map((item) => {
                  const config = CATEGORY_CONFIG[item.category];
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 ${config?.color ?? ''}`}>
                        {config?.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">{item.categoryKo}</p>
                        <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{item.price * item.quantity}P</p>
                        <p className="text-xs text-gray-400">×{item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 쿠폰 입력 / Coupon input */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                <Tag size={14} className="text-green-600" />
                쿠폰 코드
              </h3>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <Gift size={14} className="text-green-600" />
                    <div>
                      <p className="text-xs font-bold text-green-700">{appliedCoupon.labelKo}</p>
                      <p className="text-xs text-green-500">{appliedCoupon.discount}</p>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-green-400 hover:text-green-600">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                    placeholder="쿠폰 코드 입력 (예: VISA10)"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-400"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors"
                    style={{ backgroundColor: SHOPIFY_GREEN }}
                  >
                    적용
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
            </div>

            {/* 결제 요약 / Payment summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                <BarChart3 size={14} className="text-green-600" />
                진단 요약
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">조건 소계</span>
                  <span className="text-gray-800">{cartTotal}P</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">쿠폰 할인</span>
                    <span className="text-green-600">-{appliedCoupon.discount}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-bold">
                  <span className="text-gray-800">진단 포인트 합계</span>
                  <span style={{ color: SHOPIFY_GREEN }}>{cartTotal}P</span>
                </div>
                <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-600 shrink-0" />
                    <p className="text-xs text-green-700">
                      {cartItems.length}개 조건 분석으로
                      <strong className="font-bold"> {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 비자 경로</strong>를
                      평가합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 진단 시작 버튼 / Start diagnosis button */}
            <button
              onClick={runDiagnosis}
              disabled={diagnosisLoading}
              className="w-full py-4 rounded-xl text-base font-bold text-white flex items-center justify-center gap-2 transition-opacity"
              style={{ backgroundColor: SHOPIFY_GREEN }}
            >
              {diagnosisLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  지금 진단하기 (무료)
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              실제 결제는 없습니다. 비자 경로 진단은 무료입니다.
            </p>
          </div>
        )}

        {/* ====================================================
            STEP 3: 진단 결과 (주문 확인서) / Result step
        ==================================================== */}
        {step === 'result' && result && (
          <div className="space-y-4">

            {/* 주문 완료 배너 / Order complete banner */}
            <div className="rounded-xl p-5 text-white text-center" style={{ backgroundColor: SHOPIFY_GREEN }}>
              <CheckCircle2 size={36} className="mx-auto mb-2" />
              <h2 className="text-lg font-black">진단 완료!</h2>
              <p className="text-sm opacity-90 mt-1">
                {result.meta.totalPathwaysEvaluated}개 경로를 분석했습니다
              </p>
              <p className="text-xs opacity-70 mt-1">
                주문 번호: DIAG-{Date.now().toString().slice(-8)}
              </p>
            </div>

            {/* 주문 요약 / Order summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">내 진단 조건 요약</h3>
              <div className="flex flex-wrap gap-2">
                {cartItems.map((item) => (
                  <span
                    key={item.id}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="font-bold text-gray-800">{result.pathways.length}개</div>
                  <div className="text-gray-400">추천 경로</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="font-bold text-gray-800">{result.meta.totalPathwaysEvaluated}개</div>
                  <div className="text-gray-400">평가 완료</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="font-bold text-gray-800">{result.meta.hardFilteredOut}개</div>
                  <div className="text-gray-400">부적합 제외</div>
                </div>
              </div>
            </div>

            {/* 추천 경로 목록 (주문서) / Recommended pathways (order invoice) */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Star size={14} className="text-yellow-400" />
                추천 비자 경로 (점수 높은 순)
              </h3>
              {mockPathways.map((pathway, index) => (
                <PathwayOrderItem key={pathway.pathwayId} pathway={pathway} index={index} />
              ))}
            </div>

            {/* 다시 진단하기 / Restart button */}
            <div className="flex gap-3 pb-6">
              <button
                onClick={() => {
                  setStep('cart');
                  setResult(null);
                }}
                className="flex-1 py-3 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
              >
                다시 진단하기
              </button>
              <button
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity"
                style={{ backgroundColor: SHOPIFY_GREEN }}
              >
                상담 신청하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
