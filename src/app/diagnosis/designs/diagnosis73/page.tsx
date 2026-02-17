'use client';

// 경매 입찰 스타일 비자 진단 페이지 / Auction Bidding style visa diagnosis page
// 참조: eBay, Sothebys, StockX, GOAT, Catawiki
// References: eBay, Sothebys, StockX, GOAT, Catawiki

import { useState, useEffect, useCallback } from 'react';
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
  Gavel,
  Timer,
  TrendingUp,
  TrendingDown,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Clock,
  DollarSign,
  Award,
  BarChart2,
  Flame,
  Bell,
  CheckCircle2,
  AlertCircle,
  Globe,
  BookOpen,
  Target,
  Zap,
  Shield,
  RefreshCw,
  Eye,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

interface BidEntry {
  bidder: string;
  amount: number;
  time: string;
  pathwayId: string;
}

interface AuctionItem {
  pathway: CompatPathway;
  currentBid: number;
  bidCount: number;
  isHot: boolean;
  watchers: number;
}

// ============================================================
// 경매 단계 / Auction steps
// ============================================================
type Step = 'input' | 'bidding' | 'result';

// ============================================================
// 헬퍼: 우선순위 → 입찰 가중치 / Helper: priority → bid weight
// ============================================================
function getPriorityBidAmount(priority: string): number {
  switch (priority) {
    case 'speed': return 95;
    case 'stability': return 80;
    case 'cost': return 65;
    case 'income': return 75;
    default: return 70;
  }
}

// ============================================================
// 헬퍼: 카운트다운 포맷 / Helper: countdown format
// ============================================================
function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ============================================================
// 헬퍼: 금액 포맷 / Helper: amount format (만원)
// ============================================================
function formatWon(amount: number): string {
  if (amount === 0) return '0원';
  if (amount >= 10000) return `${(amount / 10000).toFixed(1)}억원`;
  return `${amount.toLocaleString()}만원`;
}

// ============================================================
// 경매 데이터 생성 / Generate auction items from pathways
// ============================================================
function buildAuctionItems(pathways: CompatPathway[]): AuctionItem[] {
  return pathways.map((p, i) => ({
    pathway: p,
    currentBid: Math.max(10, p.finalScore) + i * 3,
    bidCount: Math.floor(Math.random() * 20) + 3,
    isHot: p.finalScore >= 50,
    watchers: Math.floor(Math.random() * 100) + 10,
  }));
}

// ============================================================
// 경매 히스토리 목업 / Mock bid history
// ============================================================
function generateBidHistory(pathwayId: string, baseScore: number): BidEntry[] {
  const bidders = ['익명A', '익명B', '익명C', '익명D', 'YOU'];
  const now = new Date();
  return Array.from({ length: 5 }, (_, i) => ({
    bidder: bidders[i % bidders.length],
    amount: Math.max(1, baseScore - i * 5),
    time: `${i * 2}분 전`,
    pathwayId,
  }));
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================
export default function Diagnosis73Page() {
  // 입력 상태 / Input state
  const [step, setStep] = useState<Step>('input');
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });
  const [inputStep, setInputStep] = useState<number>(0); // 0~5 순차 입력
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // 경매 상태 / Auction state
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [myBids, setMyBids] = useState<Record<string, number>>({}); // pathwayId → bid
  const [hammerFallen, setHammerFallen] = useState<string | null>(null); // 낙찰된 pathwayId
  const [countdown, setCountdown] = useState<number>(180); // 3분 경매 타이머
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [bidHistory, setBidHistory] = useState<BidEntry[]>([]);
  const [liveBidFlash, setLiveBidFlash] = useState<string | null>(null); // 실시간 입찰 플래시

  // ============================================================
  // 카운트다운 타이머 / Countdown timer
  // ============================================================
  useEffect(() => {
    if (!isCountingDown) return;
    if (countdown <= 0) {
      // 타이머 종료 → 자동 낙찰 / Timer ends → auto hammer
      handleAutoHammer();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  // ============================================================
  // 실시간 경쟁 입찰 시뮬레이션 / Simulate live competing bids
  // ============================================================
  useEffect(() => {
    if (!isCountingDown) return;
    const interval = setInterval(() => {
      setAuctionItems((prev) =>
        prev.map((item) => {
          // 30% 확률로 경쟁 입찰 발생 / 30% chance of competing bid
          if (Math.random() < 0.3) {
            const increment = Math.floor(Math.random() * 5) + 1;
            const newBid = item.currentBid + increment;
            setLiveBidFlash(item.pathway.pathwayId);
            setTimeout(() => setLiveBidFlash(null), 800);
            return { ...item, currentBid: newBid, bidCount: item.bidCount + 1 };
          }
          return item;
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [isCountingDown]);

  // ============================================================
  // 자동 낙찰 처리 / Auto hammer when time is up
  // ============================================================
  const handleAutoHammer = useCallback(() => {
    setIsCountingDown(false);
    // 최고 입찰가 경로 선택 / Select pathway with highest bid
    const highest = Object.entries(myBids).sort((a, b) => b[1] - a[1])[0];
    if (highest) {
      setHammerFallen(highest[0]);
    } else if (auctionItems.length > 0) {
      setHammerFallen(auctionItems[0].pathway.pathwayId);
    }
    setStep('result');
  }, [myBids, auctionItems]);

  // ============================================================
  // 진단 시작 → 경매 시작 / Start diagnosis → start auction
  // ============================================================
  function startAuction() {
    const diagResult = mockDiagnosisResult;
    setResult(diagResult);
    const items = buildAuctionItems(mockPathways);
    setAuctionItems(items);
    setStep('bidding');
    setCountdown(180);
    setIsCountingDown(true);
    showNotification('경매가 시작되었습니다! 원하는 비자 경로에 입찰하세요.');
  }

  // ============================================================
  // 입찰 / Place bid
  // ============================================================
  function placeBid(item: AuctionItem) {
    const currentMyBid = myBids[item.pathway.pathwayId] ?? 0;
    const minBid = item.currentBid + 1;
    const newBid = Math.max(minBid, currentMyBid + 10);

    setMyBids((prev) => ({ ...prev, [item.pathway.pathwayId]: newBid }));
    setAuctionItems((prev) =>
      prev.map((a) =>
        a.pathway.pathwayId === item.pathway.pathwayId
          ? { ...a, currentBid: newBid, bidCount: a.bidCount + 1 }
          : a
      )
    );
    setBidHistory(generateBidHistory(item.pathway.pathwayId, newBid));
    showNotification(`✅ ${item.pathway.nameKo}에 ${newBid}점 입찰 완료!`);

    // 입찰 플래시 / Bid flash
    setLiveBidFlash(item.pathway.pathwayId);
    setTimeout(() => setLiveBidFlash(null), 600);
  }

  // ============================================================
  // 즉시 낙찰 (Buy Now) / Instant win
  // ============================================================
  function buyNow(item: AuctionItem) {
    setIsCountingDown(false);
    setHammerFallen(item.pathway.pathwayId);
    setMyBids((prev) => ({ ...prev, [item.pathway.pathwayId]: item.pathway.finalScore + 30 }));
    showNotification(`🔨 ${item.pathway.nameKo} 즉시 낙찰!`);
    setTimeout(() => setStep('result'), 1200);
  }

  // ============================================================
  // 알림 표시 / Show notification
  // ============================================================
  function showNotification(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  // ============================================================
  // 낙찰된 경로 / Hammered pathway
  // ============================================================
  const hammeredPathway = hammerFallen
    ? mockPathways.find((p) => p.pathwayId === hammerFallen)
    : null;

  // ============================================================
  // 렌더: 입력 단계 / Render: Input steps
  // ============================================================
  const inputLabels = [
    { key: 'nationality', label: '국적', labelEn: 'Nationality', icon: <Globe size={18} /> },
    { key: 'age', label: '나이', labelEn: 'Age', icon: <Clock size={18} /> },
    { key: 'educationLevel', label: '학력', labelEn: 'Education', icon: <BookOpen size={18} /> },
    { key: 'availableAnnualFund', label: '연간 자금', labelEn: 'Annual Fund', icon: <DollarSign size={18} /> },
    { key: 'finalGoal', label: '목표', labelEn: 'Goal', icon: <Target size={18} /> },
    { key: 'priorityPreference', label: '우선순위', labelEn: 'Priority', icon: <Star size={18} /> },
  ];

  // ============================================================
  // 렌더: 단계별 입력 컨트롤 / Render: Step input control
  // ============================================================
  function renderInputControl(stepIdx: number) {
    switch (stepIdx) {
      case 0:
        // 국적 선택 / Nationality selection
        return (
          <div className="grid grid-cols-3 gap-2">
            {popularCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => { setInput((prev) => ({ ...prev, nationality: c.code })); setInputStep(1); }}
                className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-sm font-medium
                  ${input.nationality === c.code
                    ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
                    : 'border-gray-200 bg-white hover:border-yellow-300 text-gray-700'}`}
              >
                <span className="text-lg">{c.flag}</span>
                <span>{c.nameKo}</span>
              </button>
            ))}
          </div>
        );
      case 1:
        // 나이 입력 / Age input
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setInput((prev) => ({ ...prev, age: Math.max(18, (prev.age ?? 24) - 1) }))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-yellow-100 text-2xl font-bold text-gray-700 flex items-center justify-center"
              >−</button>
              <div className="text-6xl font-black text-yellow-600 w-24 text-center">{input.age}</div>
              <button
                onClick={() => setInput((prev) => ({ ...prev, age: Math.min(60, (prev.age ?? 24) + 1) }))}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-yellow-100 text-2xl font-bold text-gray-700 flex items-center justify-center"
              >+</button>
            </div>
            <button
              onClick={() => setInputStep(2)}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg"
            >
              확인 / Confirm
            </button>
          </div>
        );
      case 2:
        // 학력 선택 / Education selection
        return (
          <div className="space-y-2">
            {educationOptions.map((e) => (
              <button
                key={e.value}
                onClick={() => { setInput((prev) => ({ ...prev, educationLevel: e.value })); setInputStep(3); }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left
                  ${input.educationLevel === e.value
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-white hover:border-yellow-300'}`}
              >
                <span className="text-xl">{e.emoji}</span>
                <div>
                  <div className="font-semibold text-gray-800">{e.labelKo}</div>
                  <div className="text-xs text-gray-400">{e.labelEn}</div>
                </div>
              </button>
            ))}
          </div>
        );
      case 3:
        // 자금 선택 / Fund selection
        return (
          <div className="space-y-2">
            {fundOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => { setInput((prev) => ({ ...prev, availableAnnualFund: f.value })); setInputStep(4); }}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all
                  ${input.availableAnnualFund === f.value
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-white hover:border-yellow-300'}`}
              >
                <span className="font-semibold text-gray-800">{f.labelKo}</span>
                <span className="text-sm text-gray-400">{f.labelEn}</span>
              </button>
            ))}
          </div>
        );
      case 4:
        // 목표 선택 / Goal selection
        return (
          <div className="grid grid-cols-2 gap-3">
            {goalOptions.map((g) => (
              <button
                key={g.value}
                onClick={() => { setInput((prev) => ({ ...prev, finalGoal: g.value })); setInputStep(5); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${input.finalGoal === g.value
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-white hover:border-yellow-300'}`}
              >
                <span className="text-3xl">{g.emoji}</span>
                <span className="font-bold text-gray-800 text-sm">{g.labelKo}</span>
                <span className="text-xs text-gray-400 text-center">{g.descKo}</span>
              </button>
            ))}
          </div>
        );
      case 5:
        // 우선순위 선택 / Priority selection
        return (
          <div className="grid grid-cols-2 gap-3">
            {priorityOptions.map((p) => (
              <button
                key={p.value}
                onClick={() => { setInput((prev) => ({ ...prev, priorityPreference: p.value })); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${input.priorityPreference === p.value
                    ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-300'
                    : 'border-gray-200 bg-white hover:border-yellow-300'}`}
              >
                <span className="text-3xl">{p.emoji}</span>
                <span className="font-bold text-gray-800 text-sm">{p.labelKo}</span>
                <span className="text-xs text-gray-400">{p.descKo}</span>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  // ============================================================
  // 렌더: 입력 페이지 / Render: Input page
  // ============================================================
  if (step === 'input') {
    return (
      <div className="min-h-screen bg-linear-to-br from-yellow-50 via-white to-blue-50">
        {/* 헤더 / Header */}
        <div className="bg-white border-b-4 border-yellow-400 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-4">
            {/* eBay 스타일 멀티컬러 로고 / eBay-style multicolor logo */}
            <div className="flex items-center gap-1 mb-1">
              <span className="text-3xl font-black text-red-500">J</span>
              <span className="text-3xl font-black text-blue-600">o</span>
              <span className="text-3xl font-black text-yellow-500">b</span>
              <span className="text-3xl font-black text-green-500">C</span>
              <span className="text-3xl font-black text-red-500">h</span>
              <span className="text-3xl font-black text-blue-600">a</span>
              <span className="text-3xl font-black text-yellow-500">J</span>
              <span className="text-3xl font-black text-green-500">a</span>
              <span className="ml-3 text-lg font-bold text-gray-500">비자 경매</span>
            </div>
            <p className="text-xs text-gray-500">원하는 비자 경로에 입찰하세요 · Bid on your visa pathway</p>
          </div>
        </div>

        {/* 경매 배너 / Auction banner */}
        <div className="bg-linear-to-r from-yellow-400 to-orange-400 text-black py-3 px-4">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Gavel className="shrink-0" size={24} />
            <div>
              <p className="font-black text-lg">LIVE AUCTION · 비자 경로 경매</p>
              <p className="text-sm font-medium opacity-80">경매 낙찰 후 최적 비자 경로를 확인하세요</p>
            </div>
          </div>
        </div>

        {/* 입력 폼 / Input form */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* 진행 스텝 표시기 / Step indicator */}
          <div className="flex items-center gap-1 mb-6">
            {inputLabels.map((label, idx) => (
              <div key={label.key} className="flex items-center gap-1">
                <button
                  onClick={() => idx <= inputStep && setInputStep(idx)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all
                    ${idx === inputStep
                      ? 'bg-yellow-400 text-black'
                      : idx < inputStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400'}`}
                >
                  {idx < inputStep ? <CheckCircle2 size={12} /> : label.icon}
                  <span className="hidden sm:inline">{label.label}</span>
                </button>
                {idx < 5 && <ChevronRight size={12} className="text-gray-300 shrink-0" />}
              </div>
            ))}
          </div>

          {/* 현재 입력 카드 / Current input card */}
          <div className="bg-white rounded-2xl border-2 border-yellow-200 shadow-lg p-6 mb-6">
            {/* 입찰 항목 헤더 / Bid item header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-dashed border-yellow-100">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black">
                {inputLabels[inputStep].icon}
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">{inputLabels[inputStep].label}</h2>
                <p className="text-xs text-gray-500">{inputLabels[inputStep].labelEn} · 항목 {inputStep + 1}/6</p>
              </div>
              {/* 경매 번호 / Lot number */}
              <div className="ml-auto text-right">
                <div className="text-xs text-gray-400">LOT</div>
                <div className="text-lg font-black text-yellow-600">#{String(inputStep + 1).padStart(3, '0')}</div>
              </div>
            </div>
            {renderInputControl(inputStep)}
          </div>

          {/* 입력 완료 시 경매 시작 / Start auction when all inputs done */}
          {inputStep === 5 && input.priorityPreference && (
            <div className="space-y-4">
              {/* 입찰 요약 / Bid summary */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <BarChart2 size={16} />
                  입찰 정보 요약 / Bid Summary
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: '국적', value: popularCountries.find((c) => c.code === input.nationality)?.nameKo ?? input.nationality },
                    { label: '나이', value: `${input.age}세` },
                    { label: '학력', value: educationOptions.find((e) => e.value === input.educationLevel)?.labelKo ?? '' },
                    { label: '자금', value: fundOptions.find((f) => f.value === input.availableAnnualFund)?.labelKo ?? '' },
                    { label: '목표', value: goalOptions.find((g) => g.value === input.finalGoal)?.labelKo ?? '' },
                    { label: '우선순위', value: priorityOptions.find((p) => p.value === input.priorityPreference)?.labelKo ?? '' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-semibold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 경매 시작 버튼 / Start auction button */}
              <button
                onClick={startAuction}
                className="w-full py-4 bg-linear-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-black text-xl rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <Gavel size={24} />
                경매 시작! START AUCTION
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // 렌더: 경매 진행 페이지 / Render: Live auction page
  // ============================================================
  if (step === 'bidding') {
    const timerUrgent = countdown <= 30;
    const topBidPathway = Object.entries(myBids).sort((a, b) => b[1] - a[1])[0]?.[0];

    return (
      <div className="min-h-screen bg-gray-950 text-white">
        {/* 알림 토스트 / Notification toast */}
        {notification && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-black font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm">
            <Bell size={16} />
            {notification}
          </div>
        )}

        {/* 경매 헤더 / Auction header */}
        <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gavel size={20} className="text-yellow-400" />
              <span className="font-black text-yellow-400">LIVE AUCTION</span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>

            {/* 카운트다운 / Countdown */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-lg
              ${timerUrgent ? 'bg-red-600 animate-pulse' : 'bg-gray-800'}`}>
              <Timer size={18} className={timerUrgent ? 'text-white' : 'text-yellow-400'} />
              {formatCountdown(countdown)}
            </div>

            {/* 즉시 마감 / End now */}
            <button
              onClick={handleAutoHammer}
              className="text-xs text-gray-400 hover:text-white border border-gray-600
                hover:border-gray-400 px-3 py-1.5 rounded-lg transition-all"
            >
              경매 마감
            </button>
          </div>

          {/* 타이머 프로그레스 바 / Timer progress bar */}
          <div className="h-1 bg-gray-800">
            <div
              className={`h-full transition-all duration-1000 ${timerUrgent ? 'bg-red-500' : 'bg-yellow-400'}`}
              style={{ width: `${(countdown / 180) * 100}%` }}
            />
          </div>
        </div>

        {/* 경매 목록 / Auction list */}
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {/* 안내 / Guide */}
          <div className="bg-yellow-400 text-black rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-bold">
            <Gavel size={18} />
            <span>원하는 비자 경로에 입찰하세요! 시간이 끝나면 최고 입찰 경로가 낙찰됩니다.</span>
          </div>

          {auctionItems.map((item) => {
            const myBid = myBids[item.pathway.pathwayId];
            const isLeading = topBidPathway === item.pathway.pathwayId && myBid !== undefined;
            const isFlashing = liveBidFlash === item.pathway.pathwayId;
            const isExpanded = expandedId === item.pathway.pathwayId;

            return (
              <div
                key={item.pathway.pathwayId}
                className={`rounded-2xl border-2 transition-all overflow-hidden
                  ${isLeading
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/20'
                    : 'border-gray-700 hover:border-gray-500'}
                  ${isFlashing ? 'scale-[1.01] border-green-400' : ''}`}
              >
                {/* 입찰 카드 헤더 / Bid card header */}
                <div className={`p-4 ${isLeading ? 'bg-yellow-400/10' : 'bg-gray-900'}`}>
                  {/* 상단 행 / Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {/* 경매 번호 태그 / Lot tag */}
                      <div className="bg-gray-700 text-gray-300 text-xs font-mono px-2 py-0.5 rounded">
                        LOT {auctionItems.indexOf(item) + 1}
                      </div>
                      {item.isHot && (
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Flame size={10} />
                          HOT
                        </div>
                      )}
                      {isLeading && (
                        <div className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded animate-pulse">
                          최고 입찰 LEADING
                        </div>
                      )}
                    </div>
                    {/* 실시간 입찰 플래시 / Live flash */}
                    {isFlashing && (
                      <div className="text-green-400 text-xs font-bold flex items-center gap-1 animate-bounce">
                        <TrendingUp size={12} />
                        경쟁 입찰!
                      </div>
                    )}
                  </div>

                  {/* 경로 이름 / Pathway name */}
                  <h3 className="text-lg font-black text-white mb-1">{item.pathway.nameKo}</h3>
                  <p className="text-sm text-gray-400">{item.pathway.nameEn}</p>
                  <p className="text-xs text-yellow-400 mt-1 font-mono">{item.pathway.visaChainStr}</p>

                  {/* 경매 정보 행 / Auction info row */}
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      {/* 현재 입찰가 / Current bid */}
                      <div className="text-xs text-gray-500 mb-1">현재 입찰가 · Current Bid</div>
                      <div className={`text-3xl font-black transition-all ${isFlashing ? 'text-green-400 scale-110' : 'text-yellow-400'}`}>
                        {item.currentBid}<span className="text-lg ml-1">점</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        입찰 {item.bidCount}회 · {item.watchers}명 관심
                      </div>
                    </div>

                    {/* 비자 적합도 배지 / Feasibility badge */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">적합도</div>
                      <div className="flex items-center gap-1 justify-end">
                        <span>{getFeasibilityEmoji(item.pathway.feasibilityLabel)}</span>
                        <span className="text-sm font-bold" style={{ color: getScoreColor(item.pathway.finalScore) }}>
                          {item.pathway.feasibilityLabel}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{item.pathway.estimatedMonths}개월</div>
                    </div>
                  </div>

                  {/* 내 입찰 상태 / My bid status */}
                  {myBid !== undefined && (
                    <div className="mt-2 bg-blue-900/50 rounded-lg px-3 py-2 flex items-center justify-between">
                      <span className="text-xs text-blue-300">내 입찰가 · My Bid</span>
                      <span className="font-black text-blue-300">{myBid}점</span>
                    </div>
                  )}

                  {/* 액션 버튼 / Action buttons */}
                  <div className="flex gap-2 mt-3">
                    {/* 입찰하기 / Place bid */}
                    <button
                      onClick={() => placeBid(item)}
                      className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-sm"
                    >
                      <Gavel size={16} />
                      입찰 ({item.currentBid + 1}점+)
                    </button>
                    {/* 즉시 낙찰 / Buy Now */}
                    <button
                      onClick={() => buyNow(item)}
                      className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all active:scale-95 text-xs"
                    >
                      즉시 낙찰
                    </button>
                    {/* 상세 토글 / Detail toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.pathway.pathwayId)}
                      className="px-3 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all text-xs"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* 확장 상세 / Expanded detail */}
                {isExpanded && (
                  <div className="bg-gray-800 px-4 py-4 border-t border-gray-700">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <Clock size={14} className="text-blue-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-400">기간</div>
                        <div className="font-bold text-white">{item.pathway.estimatedMonths}개월</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <DollarSign size={14} className="text-green-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-400">비용</div>
                        <div className="font-bold text-white">{formatWon(item.pathway.estimatedCostWon)}</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <Award size={14} className="text-yellow-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-400">점수</div>
                        <div className="font-bold text-white">{item.pathway.finalScore}</div>
                      </div>
                    </div>

                    {/* 비자 체인 / Visa chain */}
                    <div className="flex items-center gap-1 flex-wrap mb-3">
                      {(Array.isArray(item.visaChain) ? item.visaChain : []).map((v, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span className="bg-blue-900 text-blue-300 text-xs font-mono px-2 py-0.5 rounded">{v.code}</span>
                          {idx < (Array.isArray(item.visaChain) ? item.visaChain : []).length - 1 && (
                            <ArrowRight size={10} className="text-gray-500" />
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-400">{item.pathway.note}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* 입찰 히스토리 / Bid history */}
          {bidHistory.length > 0 && (
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-4">
              <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                <Eye size={14} />
                최근 입찰 내역 · Recent Bids
              </h3>
              <div className="space-y-2">
                {bidHistory.map((bid, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${bid.bidder === 'YOU' ? 'bg-yellow-400' : 'bg-gray-500'}`} />
                      <span className={bid.bidder === 'YOU' ? 'text-yellow-400 font-bold' : 'text-gray-400'}>
                        {bid.bidder}
                      </span>
                    </div>
                    <span className="font-mono text-gray-300">{bid.amount}점</span>
                    <span className="text-gray-600">{bid.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // 렌더: 낙찰 결과 페이지 / Render: Hammer result page
  // ============================================================
  if (step === 'result') {
    const winner = hammeredPathway ?? mockPathways[0];
    const otherPathways = mockPathways.filter((p) => p.pathwayId !== winner.pathwayId);

    return (
      <div className="min-h-screen bg-gray-950 text-white pb-16">
        {/* 낙찰 축하 헤더 / Hammer result header */}
        <div className="bg-linear-to-br from-yellow-400 to-orange-400 text-black pb-8 pt-6 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* 해머 이모지 / Hammer emoji */}
            <div className="text-6xl mb-2 animate-bounce">🔨</div>
            <div className="text-3xl font-black mb-1">SOLD!</div>
            <div className="text-lg font-bold mb-1">낙찰되었습니다!</div>
            <div className="text-sm opacity-80">최적 비자 경로가 결정되었습니다</div>
          </div>
        </div>

        {/* 낙찰 결과 카드 / Hammer result card */}
        <div className="max-w-2xl mx-auto px-4 -mt-4">
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden mb-6">
            {/* 경매 영수증 헤더 / Auction receipt header */}
            <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="text-xs font-mono text-gray-400">AUCTION RECEIPT · 경매 영수증</div>
              <div className="text-xs font-mono text-yellow-400">LOT #{mockPathways.indexOf(winner) + 1}</div>
            </div>

            <div className="p-5">
              {/* 낙찰 경로 이름 / Winner pathway name */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {getFeasibilityEmoji(winner.feasibilityLabel)}
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">낙찰 경로 · Winning Pathway</div>
                  <h2 className="text-xl font-black">{winner.nameKo}</h2>
                  <p className="text-sm text-gray-500">{winner.nameEn}</p>
                </div>
              </div>

              {/* 비자 체인 / Visa chain */}
              <div className="flex items-center gap-1 flex-wrap mb-4 bg-gray-50 rounded-lg p-3">
                {(Array.isArray(winner.visaChain) ? winner.visaChain : []).map((v, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="bg-blue-100 text-blue-800 font-mono text-sm font-bold px-2 py-0.5 rounded">{v.code}</span>
                    {idx < (Array.isArray(winner.visaChain) ? winner.visaChain : []).length - 1 && <ArrowRight size={12} className="text-gray-400" />}
                  </div>
                ))}
              </div>

              {/* 핵심 지표 / Key metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Clock size={16} className="text-blue-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">소요 기간</div>
                  <div className="font-black text-blue-700">{winner.estimatedMonths}개월</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <DollarSign size={16} className="text-green-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">예상 비용</div>
                  <div className="font-black text-green-700">{formatWon(winner.estimatedCostWon)}</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-center">
                  <Award size={16} className="text-yellow-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">적합 점수</div>
                  <div className="font-black text-yellow-700">{winner.finalScore}점</div>
                </div>
              </div>

              {/* 점수 내역 / Score breakdown */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h3 className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-2">
                  <BarChart2 size={12} />
                  입찰 점수 내역 · Score Breakdown
                </h3>
                {[
                  { label: '기본 점수 Base', val: winner.scoreBreakdown.base, max: 100 },
                  { label: '나이 가중치 Age', val: Math.round(winner.scoreBreakdown.ageMultiplier * 100), max: 100 },
                  { label: '국적 가중치 Nationality', val: Math.round(winner.scoreBreakdown.nationalityMultiplier * 100), max: 100 },
                  { label: '자금 가중치 Fund', val: Math.round(winner.scoreBreakdown.fundMultiplier * 100), max: 100 },
                ].map((item) => (
                  <div key={item.label} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-mono font-bold">{item.val}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${Math.min(100, item.val)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 다음 단계 / Next steps */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-yellow-500" />
                  즉시 행동해야 할 것 · Next Steps
                </h3>
                <div className="space-y-2">
                  {winner.nextSteps.map((ns, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-black shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-800">{ns.nameKo}</div>
                        <div className="text-xs text-gray-500">{ns.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 플랫폼 지원 / Platform support */}
              <div className={`rounded-xl p-3 flex items-center gap-3 mb-4
                ${winner.platformSupport === 'full_support'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-blue-50 border border-blue-200'}`}
              >
                {winner.platformSupport === 'full_support'
                  ? <Shield size={16} className="text-green-600 shrink-0" />
                  : <AlertCircle size={16} className="text-blue-500 shrink-0" />}
                <div>
                  <div className="text-xs font-bold text-gray-700">
                    {winner.platformSupport === 'full_support' ? '잡차자 전체 지원' : '정보 안내 제공'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {winner.platformSupport === 'full_support'
                      ? '비자 신청부터 취업까지 전 과정을 지원합니다'
                      : '전문가 상담을 통해 추가 지원을 받으세요'}
                  </div>
                </div>
              </div>

              {/* CTA 버튼 / CTA button */}
              <button className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-xl flex items-center justify-center gap-2 text-lg transition-all active:scale-95">
                <CheckCircle2 size={20} />
                이 경로로 시작하기 · Start This Path
              </button>
            </div>

            {/* 점선 분리선 / Dotted divider (receipt style) */}
            <div className="border-t-2 border-dashed border-gray-200 mx-4" />

            {/* 영수증 하단 / Receipt footer */}
            <div className="px-4 py-3 text-center">
              <p className="text-xs text-gray-400 font-mono">JobChaJa Visa Auction · 잡차자 비자 경매</p>
              <p className="text-xs text-gray-300 font-mono mt-0.5">{new Date().toLocaleString('ko-KR')}</p>
            </div>
          </div>

          {/* 기타 경로 / Other pathways */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
              <TrendingDown size={14} />
              낙찰 미달 경로 · Unsuccessful Bids
            </h3>
            <div className="space-y-2">
              {otherPathways.map((p, idx) => (
                <div key={p.pathwayId} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-600 font-mono text-sm">#{idx + 2}</div>
                    <div>
                      <div className="font-bold text-gray-300 text-sm">{p.nameKo}</div>
                      <div className="text-xs text-gray-500 font-mono">{p.visaChainStr}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">점수</div>
                    <div className="font-black text-gray-400">{p.finalScore}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 재시도 버튼 / Retry button */}
          <button
            onClick={() => {
              setStep('input');
              setInputStep(0);
              setMyBids({});
              setHammerFallen(null);
              setAuctionItems([]);
              setBidHistory([]);
              setExpandedId(null);
            }}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-gray-700"
          >
            <RefreshCw size={16} />
            다시 입찰 · Bid Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
