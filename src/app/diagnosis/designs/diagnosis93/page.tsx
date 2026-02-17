'use client';

// KOR: 블록체인 지갑 스타일 비자 진단 페이지 (Design #93)
// ENG: Blockchain wallet style visa diagnosis page (Design #93)
// KOR: 크립토 지갑 UI — 비자를 NFT/토큰으로 표현, MetaMask/Phantom 레퍼런스
// ENG: Crypto wallet UI — visas represented as NFT/tokens, MetaMask/Phantom references

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
  Wallet,
  Zap,
  Shield,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Star,
  Globe,
  GraduationCap,
  DollarSign,
  Target,
  Layers,
  Hash,
  Activity,
  TrendingUp,
  Lock,
  Unlock,
  RefreshCw,
  QrCode,
  Hexagon,
  Circle,
  BarChart3,
  Send,
  Download,
  Plus,
  AlertCircle,
} from 'lucide-react';

// KOR: 스텝 타입 정의 — 지갑 연결부터 결과까지
// ENG: Step type definition — from wallet connect to results
type Step = 'connect' | 'select-token' | 'form' | 'results';

// KOR: 입력 필드 순서: nationality → age → educationLevel → availableAnnualFund → finalGoal → priorityPreference
// ENG: Input field order: nationality → age → educationLevel → availableAnnualFund → finalGoal → priorityPreference
type FormField = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const FIELD_ORDER: FormField[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

// KOR: 진단 토큰 타입 — 지갑에서 선택할 비자 분석 유형
// ENG: Diagnosis token types — visa analysis types selectable in wallet
const DIAGNOSIS_TOKENS = [
  { id: 'full', name: 'VISA-FULL', symbol: 'VF', color: '#8B5CF6', glow: '#6D28D9', icon: '🔮', desc: '전체 비자 경로 분석' },
  { id: 'quick', name: 'VISA-QUICK', symbol: 'VQ', color: '#06B6D4', glow: '#0891B2', icon: '⚡', desc: '빠른 호환성 체크' },
  { id: 'premium', name: 'VISA-PRO', symbol: 'VP', color: '#F59E0B', glow: '#D97706', icon: '💎', desc: '프리미엄 심층 분석' },
];

// KOR: 트랜잭션 해시 생성 — 블록체인 스타일
// ENG: Generate transaction hash — blockchain style
function generateTxHash(): string {
  const chars = '0123456789abcdef';
  return '0x' + Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

// KOR: 지갑 주소 생성 — 사용자 대리 주소
// ENG: Generate wallet address — surrogate user address
function generateWalletAddress(): string {
  const chars = '0123456789abcdef';
  return '0x' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

// KOR: 점수에 따른 크립토 등급 색상
// ENG: Crypto grade color based on score
function getGradeColor(score: number): string {
  if (score >= 80) return 'text-purple-400';
  if (score >= 60) return 'text-cyan-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

// KOR: 점수에 따른 NFT 희귀도
// ENG: NFT rarity based on score
function getNftRarity(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'LEGENDARY', color: 'text-purple-300', bg: 'bg-purple-900/60' };
  if (score >= 65) return { label: 'EPIC', color: 'text-cyan-300', bg: 'bg-cyan-900/60' };
  if (score >= 50) return { label: 'RARE', color: 'text-blue-300', bg: 'bg-blue-900/60' };
  return { label: 'COMMON', color: 'text-gray-300', bg: 'bg-gray-800/60' };
}

// KOR: 트랜잭션 기록 타입
// ENG: Transaction record type
interface TxRecord {
  hash: string;
  type: string;
  status: 'confirmed' | 'pending';
  timestamp: string;
  gas: string;
}

// KOR: 더미 트랜잭션 기록 생성
// ENG: Generate dummy transaction records
const MOCK_TRANSACTIONS: TxRecord[] = [
  { hash: '0x3f2a...b91c', type: 'VISA_ANALYZE', status: 'confirmed', timestamp: '2분 전', gas: '0.0021 ETH' },
  { hash: '0x7e1d...a44f', type: 'NFT_MINT', status: 'confirmed', timestamp: '1시간 전', gas: '0.0045 ETH' },
  { hash: '0x9b3c...d72e', type: 'TOKEN_SWAP', status: 'pending', timestamp: '3시간 전', gas: '0.0018 ETH' },
  { hash: '0x1a5f...c83b', type: 'STAKE_VISA', status: 'confirmed', timestamp: '어제', gas: '0.0033 ETH' },
];

export default function Diagnosis93Page() {
  // KOR: 현재 스텝 상태
  // ENG: Current step state
  const [step, setStep] = useState<Step>('connect');

  // KOR: 지갑 연결 애니메이션 상태
  // ENG: Wallet connection animation state
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress] = useState(generateWalletAddress());

  // KOR: 선택된 진단 토큰
  // ENG: Selected diagnosis token
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // KOR: 입력 폼 상태
  // ENG: Input form state
  const [formData, setFormData] = useState<Partial<DiagnosisInput>>({});
  const [currentField, setCurrentField] = useState<number>(0);

  // KOR: 분석 실행 상태
  // ENG: Analysis execution state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [txHash] = useState(generateTxHash());

  // KOR: 결과 상태
  // ENG: Result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [expandedPathway, setExpandedPathway] = useState<string | null>('path-1');
  const [copiedHash, setCopiedHash] = useState(false);

  // KOR: 탭 상태 (결과 화면)
  // ENG: Tab state (results screen)
  const [activeTab, setActiveTab] = useState<'nft' | 'tx'>('nft');

  // KOR: 지갑 연결 핸들러 — 애니메이션 후 연결 상태로 전환
  // ENG: Wallet connect handler — transitions to connected state after animation
  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  // KOR: 토큰 선택 후 폼 진입
  // ENG: Enter form after token selection
  const handleTokenSelect = (tokenId: string) => {
    setSelectedToken(tokenId);
    setTimeout(() => setStep('form'), 400);
  };

  // KOR: 폼 필드 업데이트
  // ENG: Update form field
  const handleFieldSubmit = (value: string | number) => {
    const field = FIELD_ORDER[currentField];
    setFormData(prev => ({ ...prev, [field]: value }));

    if (currentField < FIELD_ORDER.length - 1) {
      setCurrentField(prev => prev + 1);
    } else {
      // KOR: 모든 필드 입력 완료 — 분석 트랜잭션 실행
      // ENG: All fields complete — execute analysis transaction
      handleAnalyze({ ...formData, [field]: value });
    }
  };

  // KOR: 분석 실행 — 블록체인 트랜잭션 시뮬레이션
  // ENG: Run analysis — simulate blockchain transaction
  const handleAnalyze = (data: Partial<DiagnosisInput>) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult(mockDiagnosisResult);
      setStep('results');
    }, 3000);
  };

  // KOR: 해시 복사 핸들러
  // ENG: Copy hash handler
  const handleCopyHash = () => {
    navigator.clipboard.writeText(txHash).catch(() => {});
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // KOR: 현재 입력 중인 필드 정보
  // ENG: Current input field info
  const currentFieldName = FIELD_ORDER[currentField];
  const completedFields = currentField;

  // =========================================================
  // KOR: 렌더링
  // ENG: Render
  // =========================================================

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-mono overflow-x-hidden">

      {/* KOR: 배경 — 크립토 그리드 + 퍼플 글로우 */}
      {/* ENG: Background — crypto grid + purple glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      {/* KOR: 상단 네비게이션 바 — 지갑 스타일 */}
      {/* ENG: Top navigation bar — wallet style */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-purple-900/40 bg-[#0D0D1A]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Hexagon size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm tracking-wider">JOBCHAJA WALLET</span>
          <span className="text-purple-500 text-xs">v2.0.1</span>
        </div>

        <div className="flex items-center gap-4">
          {isConnected && (
            <>
              {/* KOR: 네트워크 표시 */}
              {/* ENG: Network indicator */}
              <div className="flex items-center gap-2 bg-[#1A1A2E] border border-purple-800/40 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-300">Korea Mainnet</span>
              </div>
              {/* KOR: 지갑 주소 표시 */}
              {/* ENG: Wallet address display */}
              <div className="flex items-center gap-2 bg-[#1A1A2E] border border-purple-800/40 rounded-full px-3 py-1">
                <div className="w-5 h-5 rounded-full bg-linear-to-br from-purple-500 to-cyan-500" />
                <span className="text-xs text-gray-300">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            </>
          )}
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">

        {/* ================================================ */}
        {/* KOR: 스텝 1 — 지갑 연결 화면 */}
        {/* ENG: Step 1 — Wallet connect screen */}
        {/* ================================================ */}
        {step === 'connect' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">

            {/* KOR: 메인 지갑 아이콘 */}
            {/* ENG: Main wallet icon */}
            <div className="relative">
              <div
                className="w-32 h-32 rounded-3xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #4C1D95 0%, #1E1B4B 50%, #0E7490 100%)',
                  boxShadow: '0 0 60px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.1)',
                }}
              >
                <Wallet size={56} className="text-purple-200" />
              </div>
              {/* KOR: 글로우 링 */}
              {/* ENG: Glow ring */}
              <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/30 animate-ping" />
              <div className="absolute -inset-4 rounded-3xl border border-purple-700/20 animate-pulse" />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-linear-to-br from-purple-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                  Visa NFT Wallet
                </span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {/* KOR: 지갑을 연결하여 비자 NFT를 확인하고 최적 경로를 분석하세요 */}
                {/* ENG: Connect your wallet to check visa NFTs and analyze optimal pathways */}
                지갑을 연결하여 비자 토큰을 발급받고<br />
                최적 경로를 온체인에 기록하세요
              </p>
            </div>

            {/* KOR: 지갑 연결 버튼들 */}
            {/* ENG: Wallet connection buttons */}
            {!isConnected ? (
              <div className="w-full max-w-sm space-y-3">
                {/* KOR: MetaMask 스타일 버튼 */}
                {/* ENG: MetaMask style button */}
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full flex items-center gap-4 bg-[#1A1A2E] hover:bg-[#1E1E3A] border border-purple-700/40 hover:border-purple-500/60 rounded-2xl p-4 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    🦊
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold text-sm">JobChaja Wallet</div>
                    <div className="text-gray-500 text-xs">통합 비자 지갑 연결</div>
                  </div>
                  {isConnecting ? (
                    <RefreshCw size={16} className="text-purple-400 animate-spin shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500 group-hover:text-purple-400 shrink-0" />
                  )}
                </button>

                {/* KOR: Phantom 스타일 버튼 */}
                {/* ENG: Phantom style button */}
                <button
                  className="w-full flex items-center gap-4 bg-[#1A1A2E] hover:bg-[#1E1E3A] border border-purple-700/20 rounded-2xl p-4 transition-all duration-300 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    👻
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold text-sm">Phantom</div>
                    <div className="text-gray-500 text-xs">Coming soon</div>
                  </div>
                  <Lock size={14} className="text-gray-600 shrink-0" />
                </button>

                {isConnecting && (
                  <div className="text-center text-purple-400 text-xs animate-pulse mt-2">
                    🔗 블록체인 네트워크 연결 중...
                  </div>
                )}
              </div>
            ) : (
              /* KOR: 연결 완료 상태 */
              /* ENG: Connected state */
              <div className="w-full max-w-sm space-y-4">
                <div
                  className="bg-[#1A1A2E] border border-green-500/40 rounded-2xl p-4 text-center"
                  style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.1)' }}
                >
                  <CheckCircle className="text-green-400 mx-auto mb-2" size={24} />
                  <div className="text-green-400 font-semibold text-sm">지갑 연결 완료</div>
                  <div className="text-gray-500 text-xs mt-1 font-mono">
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                  </div>
                </div>

                <button
                  onClick={() => setStep('select-token')}
                  className="w-full py-4 rounded-2xl font-bold text-sm tracking-wider transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                    boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
                  }}
                >
                  비자 토큰 선택하기 →
                </button>
              </div>
            )}

            {/* KOR: 보안 배지 */}
            {/* ENG: Security badge */}
            <div className="flex items-center gap-2 text-gray-600 text-xs">
              <Shield size={12} />
              <span>Non-custodial · 개인키 보관 안함 · 영지식 증명</span>
            </div>
          </div>
        )}

        {/* ================================================ */}
        {/* KOR: 스텝 2 — 토큰 선택 그리드 */}
        {/* ENG: Step 2 — Token selection grid */}
        {/* ================================================ */}
        {step === 'select-token' && (
          <div className="space-y-8">

            <div className="text-center">
              <div className="text-purple-400 text-xs tracking-[0.3em] uppercase mb-2">Token Portfolio</div>
              <h2 className="text-2xl font-bold text-white">분석 토큰 선택</h2>
              <p className="text-gray-500 text-sm mt-2">사용할 비자 분석 토큰을 선택하세요</p>
            </div>

            {/* KOR: 잔고 표시 — 지갑 스타일 */}
            {/* ENG: Balance display — wallet style */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 50%, #0C1445 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)',
              }}
            >
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Total Portfolio Value</div>
              <div className="text-3xl font-bold text-white mb-1">3 VISA Tokens</div>
              <div className="text-green-400 text-sm">+∞% 미래 가치</div>

              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 rounded-xl px-4 py-2 text-xs text-purple-300 transition-all">
                  <Send size={12} /> 전송
                </button>
                <button className="flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/30 rounded-xl px-4 py-2 text-xs text-cyan-300 transition-all">
                  <Download size={12} /> 수신
                </button>
                <button className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-600/30 rounded-xl px-4 py-2 text-xs text-indigo-300 transition-all">
                  <RefreshCw size={12} /> 스왑
                </button>
              </div>
            </div>

            {/* KOR: 토큰 그리드 */}
            {/* ENG: Token grid */}
            <div className="space-y-3">
              <div className="text-gray-400 text-xs uppercase tracking-widest">Available Tokens</div>

              {DIAGNOSIS_TOKENS.map((token) => (
                <button
                  key={token.id}
                  onClick={() => handleTokenSelect(token.id)}
                  className={`w-full flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 border ${
                    selectedToken === token.id
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-purple-900/30 bg-[#0D0D1A] hover:bg-[#12122A] hover:border-purple-700/50'
                  }`}
                >
                  {/* KOR: 토큰 아이콘 */}
                  {/* ENG: Token icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${token.color}33 0%, ${token.glow}22 100%)`,
                      border: `1px solid ${token.color}44`,
                      boxShadow: `0 0 15px ${token.color}22`,
                    }}
                  >
                    {token.icon}
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{token.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-mono"
                        style={{ backgroundColor: `${token.color}22`, color: token.color }}
                      >
                        {token.symbol}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">{token.desc}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-white text-sm font-bold">1</div>
                    <div className="text-gray-600 text-xs">잔여</div>
                  </div>
                </button>
              ))}
            </div>

            {/* KOR: 호환 경로 미리보기 */}
            {/* ENG: Compatible pathways preview */}
            <div className="bg-[#0D0D1A] border border-purple-900/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} className="text-purple-400" />
                <span className="text-gray-400 text-xs uppercase tracking-widest">Compatible Pathways</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {mockPathways.map((p: CompatPathway) => (
                  <span
                    key={p.id}
                    className="bg-purple-900/30 border border-purple-800/40 text-purple-300 text-xs px-3 py-1 rounded-full"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================ */}
        {/* KOR: 스텝 3 — 폼 입력 (지갑 서명 스타일) */}
        {/* ENG: Step 3 — Form input (wallet signing style) */}
        {/* ================================================ */}
        {step === 'form' && !isAnalyzing && (
          <div className="space-y-6">

            {/* KOR: 트랜잭션 진행 헤더 */}
            {/* ENG: Transaction progress header */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'linear-gradient(135deg, #1E1B4B 0%, #0F0F23 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-purple-400 animate-pulse" />
                  <span className="text-purple-300 text-xs font-bold tracking-wider">TRANSACTION SIGNING</span>
                </div>
                <span className="text-gray-600 text-xs font-mono">
                  {completedFields}/{FIELD_ORDER.length}
                </span>
              </div>

              {/* KOR: 진행 바 */}
              {/* ENG: Progress bar */}
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedFields / FIELD_ORDER.length) * 100}%`,
                    background: 'linear-gradient(90deg, #7C3AED, #06B6D4)',
                    boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)',
                  }}
                />
              </div>
            </div>

            {/* KOR: 현재 입력 필드 — 서명 요청 카드 스타일 */}
            {/* ENG: Current input field — signing request card style */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: 'linear-gradient(145deg, #13131F 0%, #0D0D1A 100%)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-700/40 flex items-center justify-center">
                  <Hash size={18} className="text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">서명 요청</div>
                  <div className="text-gray-500 text-xs font-mono">
                    field_{currentField + 1}_of_{FIELD_ORDER.length}
                  </div>
                </div>
              </div>

              {/* KOR: 국적 입력 */}
              {/* ENG: Nationality input */}
              {currentFieldName === 'nationality' && (
                <div>
                  <div className="text-purple-300 text-xs uppercase tracking-widest mb-4">
                    <Globe size={12} className="inline mr-2" />
                    Origin Chain (국적)
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {popularCountries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => handleFieldSubmit(c.name)}
                        className="flex items-center gap-2 bg-[#1A1A2E] hover:bg-purple-900/30 border border-purple-900/30 hover:border-purple-600/50 rounded-xl p-3 transition-all duration-200 group"
                      >
                        <span className="text-xl">{c.flag}</span>
                        <span className="text-gray-300 text-xs group-hover:text-white">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 나이 입력 */}
              {/* ENG: Age input */}
              {currentFieldName === 'age' && (
                <div>
                  <div className="text-purple-300 text-xs uppercase tracking-widest mb-4">
                    <Clock size={12} className="inline mr-2" />
                    Block Number (나이)
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="range"
                      min="18"
                      max="65"
                      defaultValue="25"
                      className="flex-1 accent-purple-500"
                      id="age-range"
                      onChange={(e) => {
                        const label = document.getElementById('age-label');
                        if (label) label.textContent = e.target.value + '세';
                      }}
                    />
                    <span id="age-label" className="text-white font-bold w-12 text-center">25세</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[20, 25, 28, 30, 33, 35, 40, 45].map((a) => (
                      <button
                        key={a}
                        onClick={() => handleFieldSubmit(a)}
                        className="bg-[#1A1A2E] hover:bg-purple-900/30 border border-purple-900/30 hover:border-purple-600/50 rounded-xl py-2 text-sm text-gray-300 hover:text-white transition-all"
                      >
                        {a}세
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 학력 입력 */}
              {/* ENG: Education level input */}
              {currentFieldName === 'educationLevel' && (
                <div>
                  <div className="text-purple-300 text-xs uppercase tracking-widest mb-4">
                    <GraduationCap size={12} className="inline mr-2" />
                    Proof of Knowledge (학력)
                  </div>
                  <div className="space-y-2">
                    {educationOptions.map((edu, i) => (
                      <button
                        key={edu}
                        onClick={() => handleFieldSubmit(edu)}
                        className="w-full flex items-center gap-3 bg-[#1A1A2E] hover:bg-purple-900/30 border border-purple-900/30 hover:border-purple-600/50 rounded-xl p-3 text-left transition-all duration-200 group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-purple-900/50 flex items-center justify-center text-xs text-purple-400 font-mono shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-gray-300 text-sm group-hover:text-white">{edu}</span>
                        <ChevronRight size={14} className="text-gray-600 group-hover:text-purple-400 ml-auto shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 가용 자금 입력 */}
              {/* ENG: Available fund input */}
              {currentFieldName === 'availableAnnualFund' && (
                <div>
                  <div className="text-purple-300 text-xs uppercase tracking-widest mb-4">
                    <DollarSign size={12} className="inline mr-2" />
                    Gas Reserve (연간 가용 자금)
                  </div>
                  <div className="space-y-2">
                    {fundOptions.map((fund) => (
                      <button
                        key={fund}
                        onClick={() => handleFieldSubmit(fund)}
                        className="w-full flex items-center justify-between bg-[#1A1A2E] hover:bg-purple-900/30 border border-purple-900/30 hover:border-purple-600/50 rounded-xl p-4 transition-all duration-200 group"
                      >
                        <span className="text-gray-300 text-sm group-hover:text-white font-mono">{fund}</span>
                        <TrendingUp size={14} className="text-gray-600 group-hover:text-purple-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 최종 목표 입력 */}
              {/* ENG: Final goal input */}
              {currentFieldName === 'finalGoal' && (
                <div>
                  <div className="text-purple-300 text-xs uppercase tracking-widest mb-4">
                    <Target size={12} className="inline mr-2" />
                    Destination Address (최종 목표)
                  </div>
                  <div className="space-y-2">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => handleFieldSubmit(goal)}
                        className="w-full flex items-center gap-3 bg-[#1A1A2E] hover:bg-purple-900/30 border border-purple-900/30 hover:border-purple-600/50 rounded-xl p-3 text-left transition-all duration-200 group"
                      >
                        <Circle size={8} className="text-purple-600 group-hover:text-purple-400 shrink-0" />
                        <span className="text-gray-300 text-sm group-hover:text-white">{goal}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KOR: 우선순위 입력 */}
              {/* ENG: Priority preference input */}
              {currentFieldName === 'priorityPreference' && (
                <div>
                  <div className="text-purple-300 text-xs uppercase tracking-widest mb-4">
                    <BarChart3 size={12} className="inline mr-2" />
                    Optimization Algorithm (우선순위)
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {priorityOptions.map((priority) => (
                      <button
                        key={priority}
                        onClick={() => handleFieldSubmit(priority)}
                        className="bg-[#1A1A2E] hover:bg-purple-900/30 border border-purple-900/30 hover:border-purple-600/50 rounded-2xl p-4 text-center transition-all duration-200 group"
                      >
                        <Zap size={20} className="text-purple-600 group-hover:text-purple-400 mx-auto mb-2" />
                        <span className="text-gray-300 text-xs group-hover:text-white">{priority}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* KOR: 이미 입력한 필드 요약 */}
            {/* ENG: Summary of already submitted fields */}
            {Object.keys(formData).length > 0 && (
              <div className="bg-[#0D0D1A] border border-green-900/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={12} className="text-green-500" />
                  <span className="text-gray-500 text-xs uppercase tracking-widest">Confirmed Data</span>
                </div>
                <div className="space-y-1">
                  {(Object.entries(formData) as [FormField, string | number][]).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-mono">{key}</span>
                      <span className="text-green-400">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* KOR: 분석 중 — 트랜잭션 처리 화면 */}
        {/* ENG: Analyzing — transaction processing screen */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #4C1D95 0%, #1E1B4B 100%)',
                  boxShadow: '0 0 60px rgba(139, 92, 246, 0.5)',
                }}
              >
                <RefreshCw size={36} className="text-purple-300 animate-spin" />
              </div>
              <div className="absolute -inset-4 rounded-3xl border-2 border-purple-500/20 animate-ping" />
            </div>

            <div className="text-center space-y-2">
              <div className="text-purple-300 text-xs tracking-[0.3em] uppercase animate-pulse">Processing Transaction</div>
              <h3 className="text-xl font-bold text-white">비자 NFT 분석 중...</h3>
              <p className="text-gray-500 text-sm">블록체인 네트워크에서 검증 중입니다</p>
            </div>

            {/* KOR: 트랜잭션 해시 표시 */}
            {/* ENG: Transaction hash display */}
            <div className="bg-[#0D0D1A] border border-purple-900/30 rounded-2xl p-4 w-full max-w-sm">
              <div className="text-gray-600 text-xs mb-2">Tx Hash</div>
              <div className="text-purple-300 text-xs font-mono break-all">
                {txHash.slice(0, 42)}...
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-yellow-400 text-xs">Pending confirmation</span>
              </div>
            </div>

            {/* KOR: 분석 단계 표시 */}
            {/* ENG: Analysis step display */}
            <div className="space-y-2 w-full max-w-sm">
              {['비자 호환성 검증', 'NFT 메타데이터 생성', '경로 최적화 알고리즘', '온체인 결과 기록'].map((s, i) => (
                <div key={s} className="flex items-center gap-3 text-xs">
                  <div className="w-4 h-4 rounded-full bg-purple-700/30 border border-purple-600/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: `${i * 0.3}s` }} />
                  </div>
                  <span className="text-gray-500">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================ */}
        {/* KOR: 스텝 4 — 결과 화면 (NFT 카드 + 트랜잭션 기록) */}
        {/* ENG: Step 4 — Results screen (NFT cards + transaction records) */}
        {/* ================================================ */}
        {step === 'results' && result && (
          <div className="space-y-6">

            {/* KOR: 트랜잭션 성공 헤더 */}
            {/* ENG: Transaction success header */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'linear-gradient(135deg, #064E3B 0%, #0F2027 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.1)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-green-300 font-bold text-sm">Transaction Confirmed</span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-green-500 text-xs">3 confirmations</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs font-mono">{txHash.slice(0, 20)}...</span>
                <button
                  onClick={handleCopyHash}
                  className="text-gray-600 hover:text-green-400 transition-colors"
                >
                  {copiedHash ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
                <ExternalLink size={12} className="text-gray-600 hover:text-cyan-400 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* KOR: 탭 전환 — NFT 카드 / 트랜잭션 기록 */}
            {/* ENG: Tab switch — NFT Cards / Transaction Records */}
            <div className="flex gap-1 bg-[#0D0D1A] border border-purple-900/30 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('nft')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                  activeTab === 'nft'
                    ? 'bg-purple-700 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                NFT Cards
              </button>
              <button
                onClick={() => setActiveTab('tx')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                  activeTab === 'tx'
                    ? 'bg-purple-700 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Transactions
              </button>
            </div>

            {/* KOR: NFT 카드 탭 */}
            {/* ENG: NFT Cards tab */}
            {activeTab === 'nft' && (
              <div className="space-y-4">
                <div className="text-gray-500 text-xs uppercase tracking-widest">
                  {result.pathways.length} Visa NFTs Minted
                </div>

                {result.pathways.map((pathway: RecommendedPathway, index: number) => {
                  const rarity = getNftRarity(pathway.feasibilityScore);
                  const isExpanded = expandedPathway === pathway.id;

                  return (
                    <div
                      key={pathway.id}
                      className="rounded-3xl overflow-hidden transition-all duration-300"
                      style={{
                        background: 'linear-gradient(145deg, #13131F 0%, #0D0D1A 100%)',
                        border: `1px solid ${isExpanded ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.2)'}`,
                        boxShadow: isExpanded ? '0 0 30px rgba(139, 92, 246, 0.15)' : 'none',
                      }}
                    >
                      {/* KOR: NFT 카드 헤더 */}
                      {/* ENG: NFT card header */}
                      <div className="p-5">
                        <div className="flex items-start gap-4">

                          {/* KOR: NFT 썸네일 */}
                          {/* ENG: NFT thumbnail */}
                          <div
                            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 relative overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${
                                pathway.feasibilityScore >= 80 ? '#4C1D95' :
                                pathway.feasibilityScore >= 65 ? '#164E63' : '#1E3A5F'
                              } 0%, #0A0A15 100%)`,
                              border: `1px solid ${
                                pathway.feasibilityScore >= 80 ? 'rgba(167, 139, 250, 0.5)' :
                                pathway.feasibilityScore >= 65 ? 'rgba(34, 211, 238, 0.5)' : 'rgba(96, 165, 250, 0.5)'
                              }`,
                            }}
                          >
                            <span className="text-2xl">{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
                            <span className="text-xs font-bold text-white font-mono">#{String(index + 1).padStart(3, '0')}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${rarity.color} ${rarity.bg}`}
                                  >
                                    {rarity.label}
                                  </span>
                                </div>
                                <h3 className="text-white font-bold text-sm leading-tight">{pathway.name}</h3>
                              </div>
                              <div className="text-right shrink-0">
                                <div className={`text-2xl font-bold font-mono ${getGradeColor(pathway.feasibilityScore)}`}>
                                  {pathway.feasibilityScore}
                                </div>
                                <div className="text-gray-600 text-xs">Score</div>
                              </div>
                            </div>

                            {/* KOR: 비자 체인 표시 */}
                            {/* ENG: Visa chain display */}
                            <div className="flex items-center gap-1 mt-2 flex-wrap">
                              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                                <div key={v.visa} className="flex items-center gap-1">
                                  <span className="bg-purple-900/40 border border-purple-800/40 text-purple-300 text-xs px-2 py-0.5 rounded-lg font-mono">
                                    {v.visa}
                                  </span>
                                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                                    <ArrowRight size={10} className="text-gray-700" />
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* KOR: 메타데이터 — 비용, 기간 */}
                            {/* ENG: Metadata — cost, duration */}
                            <div className="flex gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Clock size={10} className="text-gray-600" />
                                <span className="text-gray-500 text-xs">{pathway.totalDurationMonths}개월</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign size={10} className="text-gray-600" />
                                <span className="text-gray-500 text-xs">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* KOR: 확장/축소 버튼 */}
                        {/* ENG: Expand/collapse button */}
                        <button
                          onClick={() => setExpandedPathway(isExpanded ? null : pathway.id)}
                          className="w-full mt-4 flex items-center justify-center gap-2 text-gray-500 hover:text-purple-400 text-xs transition-colors py-2 border-t border-purple-900/20"
                        >
                          {isExpanded ? (
                            <><ChevronUp size={14} /> 접기</>
                          ) : (
                            <><ChevronDown size={14} /> 상세 보기</>
                          )}
                        </button>
                      </div>

                      {/* KOR: 확장된 상세 정보 */}
                      {/* ENG: Expanded detail info */}
                      {isExpanded && (
                        <div className="px-5 pb-5 border-t border-purple-900/20 pt-4 space-y-4">
                          {/* KOR: 설명 */}
                          {/* ENG: Description */}
                          <p className="text-gray-400 text-xs leading-relaxed">{pathway.description}</p>

                          {/* KOR: 마일스톤 — 트랜잭션 이벤트 스타일 */}
                          {/* ENG: Milestones — transaction event style */}
                          <div>
                            <div className="text-gray-600 text-xs uppercase tracking-widest mb-3">
                              Events on Chain
                            </div>
                            <div className="space-y-3">
                              {pathway.milestones.map((m, i) => (
                                <div key={i} className="flex gap-3">
                                  <div className="flex flex-col items-center">
                                    <div className="w-7 h-7 rounded-xl bg-purple-900/40 border border-purple-800/40 flex items-center justify-center text-sm shrink-0">
                                      {m.emoji}
                                    </div>
                                    {i < pathway.milestones.length - 1 && (
                                      <div className="w-px flex-1 bg-purple-900/30 my-1" />
                                    )}
                                  </div>
                                  <div className="pb-3">
                                    <div className="text-white text-xs font-bold">{m.title}</div>
                                    <div className="text-gray-500 text-xs mt-0.5 leading-relaxed">{m.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* KOR: NFT 속성 — OpenSea 스타일 */}
                          {/* ENG: NFT attributes — OpenSea style */}
                          <div>
                            <div className="text-gray-600 text-xs uppercase tracking-widest mb-3">Properties</div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-purple-900/20 border border-purple-800/30 rounded-xl p-2 text-center">
                                <div className="text-purple-400 text-xs uppercase tracking-wider">Feasibility</div>
                                <div className="text-white text-xs font-bold mt-1">{pathway.feasibilityLabel}</div>
                              </div>
                              <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-xl p-2 text-center">
                                <div className="text-cyan-400 text-xs uppercase tracking-wider">Duration</div>
                                <div className="text-white text-xs font-bold mt-1">{pathway.totalDurationMonths}mo</div>
                              </div>
                              <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-xl p-2 text-center">
                                <div className="text-indigo-400 text-xs uppercase tracking-wider">Cost</div>
                                <div className="text-white text-xs font-bold mt-1">${(((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0) / 1000).toFixed(0)}K</div>
                              </div>
                            </div>
                          </div>

                          {/* KOR: 액션 버튼 */}
                          {/* ENG: Action buttons */}
                          <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-purple-700/30 hover:bg-purple-700/50 border border-purple-600/30 rounded-xl py-2.5 text-xs text-purple-300 transition-all">
                              <Send size={12} /> 전문가 상담
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-cyan-700/20 hover:bg-cyan-700/30 border border-cyan-600/30 rounded-xl py-2.5 text-xs text-cyan-300 transition-all">
                              <ArrowUpRight size={12} /> 상세 경로
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* KOR: 트랜잭션 기록 탭 */}
            {/* ENG: Transaction records tab */}
            {activeTab === 'tx' && (
              <div className="space-y-4">
                {/* KOR: 현재 트랜잭션 */}
                {/* ENG: Current transaction */}
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-widest mb-3">Current Transaction</div>
                  <div
                    className="rounded-2xl p-4"
                    style={{
                      background: 'linear-gradient(135deg, #064E3B 0%, #0F1D27 100%)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-green-300 text-xs font-bold">VISA_ANALYZE</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-green-400 text-xs">Confirmed</span>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs font-mono mb-2 break-all">{txHash.slice(0, 44)}...</div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <div className="text-gray-600 text-xs">From</div>
                        <div className="text-gray-300 text-xs font-mono">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">To</div>
                        <div className="text-gray-300 text-xs font-mono">0xJobChaja...V2</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Gas Used</div>
                        <div className="text-gray-300 text-xs">0.0021 ETH</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Block</div>
                        <div className="text-gray-300 text-xs font-mono">#18,924,531</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KOR: 과거 트랜잭션 기록 */}
                {/* ENG: Past transaction records */}
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-widest mb-3">Transaction History</div>
                  <div className="space-y-2">
                    {MOCK_TRANSACTIONS.map((tx) => (
                      <div
                        key={tx.hash}
                        className="flex items-center gap-3 bg-[#0D0D1A] border border-purple-900/20 rounded-xl p-3"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            tx.status === 'confirmed' ? 'bg-green-900/30' : 'bg-yellow-900/30'
                          }`}
                        >
                          {tx.status === 'confirmed' ? (
                            <CheckCircle size={14} className="text-green-400" />
                          ) : (
                            <Clock size={14} className="text-yellow-400 animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-xs font-bold">{tx.type}</span>
                            <span className="text-gray-600 text-xs">{tx.timestamp}</span>
                          </div>
                          <div className="text-gray-500 text-xs font-mono mt-0.5">{tx.hash}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-gray-400 text-xs">{tx.gas}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KOR: QR 코드 영역 */}
                {/* ENG: QR code area */}
                <div className="bg-[#0D0D1A] border border-purple-900/30 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <QrCode size={16} className="text-purple-400" />
                    <span className="text-gray-400 text-xs uppercase tracking-widest">Share Result NFT</span>
                  </div>
                  <div className="flex gap-4 items-start">
                    {/* KOR: QR 코드 시각 표현 */}
                    {/* ENG: QR code visual representation */}
                    <div className="w-24 h-24 bg-white rounded-xl p-2 shrink-0">
                      <div
                        className="w-full h-full rounded-sm"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect x='0' y='0' width='3' height='3' fill='black'/%3E%3Crect x='7' y='0' width='3' height='3' fill='black'/%3E%3Crect x='0' y='7' width='3' height='3' fill='black'/%3E%3Crect x='4' y='1' width='1' height='1' fill='black'/%3E%3Crect x='3' y='4' width='2' height='2' fill='black'/%3E%3Crect x='6' y='5' width='2' height='1' fill='black'/%3E%3Crect x='5' y='7' width='1' height='2' fill='black'/%3E%3Crect x='8' y='8' width='2' height='2' fill='black'/%3E%3C/svg%3E")`,
                          backgroundSize: 'cover',
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs leading-relaxed">
                        이 QR 코드로 비자 NFT 결과를 공유하세요
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button className="flex items-center gap-1.5 bg-purple-900/30 border border-purple-800/40 rounded-lg px-3 py-1.5 text-xs text-purple-300">
                          <Download size={11} /> 저장
                        </button>
                        <button className="flex items-center gap-1.5 bg-cyan-900/30 border border-cyan-800/40 rounded-lg px-3 py-1.5 text-xs text-cyan-300">
                          <Copy size={11} /> 링크 복사
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KOR: 하단 액션 */}
            {/* ENG: Bottom actions */}
            <div className="flex gap-3 pb-8">
              <button
                onClick={() => {
                  setStep('connect');
                  setFormData({});
                  setCurrentField(0);
                  setResult(null);
                  setIsConnected(false);
                  setSelectedToken(null);
                  setActiveTab('nft');
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0D0D1A] border border-purple-900/40 hover:border-purple-600/50 rounded-2xl py-3 text-sm text-gray-400 hover:text-white transition-all"
              >
                <RefreshCw size={14} /> 재진단
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                  boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
                }}
              >
                <Star size={14} /> 전문가 상담
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
