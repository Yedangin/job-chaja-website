'use client';

// KOR: SSR 프리렌더링 비활성화 (디자인 쇼케이스 페이지) / ENG: Disable SSR prerendering (design showcase page)
export const dynamic = 'force-dynamic';

// KOR: 금융 대시보드 컨셉의 비자 진단 페이지 (Design #31) — Bloomberg / TradingView 레퍼런스
// ENG: Visa diagnosis page with finance dashboard concept (Design #31) — Bloomberg / TradingView reference

import React, { useState } from 'react';
import {
  popularCountries, educationOptions, goalOptions, priorityOptions, fundOptions,
  mockDiagnosisResult, mockInput, DiagnosisInput, DiagnosisResult, RecommendedPathway,
  getScoreColor, getFeasibilityEmoji, mockPathways, CompatPathway,
} from '../_mock/diagnosis-mock-data';
import {
  TrendingUp, BarChart2, PieChart, Activity, RefreshCw, ChevronRight, ChevronDown,
  ChevronUp, Star, Clock, DollarSign, Shield, Zap, Globe, BookOpen, Target,
  ArrowUpRight, ArrowDownRight, Bell, Settings, Filter, CheckCircle, Circle,
  Info, Award,
} from 'lucide-react';

// KOR: 비자 경로 티커 심볼 / ENG: Visa pathway ticker symbols
const VISA_TICKERS: Record<string, string> = { 'path-1': 'D2→E7R', 'path-2': 'D4→D2', 'path-3': 'E9→F2' };

// KOR: 점수를 기대 수익률(%)로 변환 / ENG: Convert score to expected return rate (%)
const scoreToReturn = (score: number) => Math.round(score * 0.85 - 5);

// KOR: 뉴스 피드 목업 / ENG: News feed mock data
const NEWS_ITEMS = [
  { tag: '정책', title: 'E-7 비자 쿼터 2025년 20% 확대 발표', time: '2h', up: true },
  { tag: '규정', title: 'F-2-7 점수제 기준 조정안 입법예고', time: '5h', up: false },
  { tag: '동향', title: '외국인 취업 허가 처리 기간 단축 (평균 14일→10일)', time: '1d', up: true },
  { tag: '알림', title: '한국어능력시험(TOPIK) 2025년 일정 공고', time: '2d', up: null as null },
];

// KOR: 입력 단계 정의 / ENG: Input step definitions
const STEPS = [
  { key: 'nationality',         label: '국적',      labelEn: 'Nationality', icon: Globe },
  { key: 'age',                 label: '나이',      labelEn: 'Age',         icon: Activity },
  { key: 'educationLevel',      label: '학력',      labelEn: 'Education',   icon: BookOpen },
  { key: 'availableAnnualFund', label: '가용 자금', labelEn: 'Annual Fund', icon: DollarSign },
  { key: 'finalGoal',           label: '최종 목표', labelEn: 'Final Goal',  icon: Target },
  { key: 'priorityPreference',  label: '우선순위',  labelEn: 'Priority',    icon: Star },
] as const;

// KOR: SVG 기반 미니 캔들스틱 차트 컴포넌트
// ENG: SVG-based mini candlestick chart component
function MiniCandles({ score }: { score: number }) {
  const candles = Array.from({ length: 12 }, (_, i) => {
    const base = score * 0.8 + Math.sin(i * 1.3) * 15;
    const o = base + Math.sin(i) * 5, c = base + Math.cos(i * 0.7) * 7;
    return { o, c, h: Math.max(o, c) + Math.abs(Math.sin(i * 2)) * 5, l: Math.min(o, c) - Math.abs(Math.cos(i * 1.5)) * 5, bull: c >= o };
  });
  const lo = Math.min(...candles.map((c) => c.l)), hi = Math.max(...candles.map((c) => c.h)), rng = hi - lo || 1;
  const H = 56, W = 180, bw = 10, gap = 5;
  const toY = (v: number) => H - ((v - lo) / rng) * H;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {candles.map((cd, i) => {
        const x = i * (bw + gap) + 3, bodyT = toY(Math.max(cd.o, cd.c)), bodyH = Math.max(toY(Math.min(cd.o, cd.c)) - bodyT, 1);
        const col = cd.bull ? '#22c55e' : '#ef4444';
        return (
          <g key={i}>
            <line x1={x + bw / 2} y1={toY(cd.h)} x2={x + bw / 2} y2={toY(cd.l)} stroke={col} strokeWidth={1} />
            <rect x={x} y={bodyT} width={bw} height={bodyH} fill={col} fillOpacity={0.85} />
          </g>
        );
      })}
    </svg>
  );
}

// KOR: 원형 진행 게이지 / ENG: Circular progress gauge
function CircleGauge({ score, size = 72 }: { score: number; size?: number }) {
  const r = size / 2 - 7, circ = 2 * Math.PI * r;
  const col = score >= 75 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f2937" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={col} fontSize={size / 5} fontWeight="bold">{score}</text>
    </svg>
  );
}

// KOR: 포트폴리오 파이 차트 / ENG: Portfolio pie chart
function PortfolioPie({ pathways }: { pathways: RecommendedPathway[] }) {
  const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#a855f7'];
  const safePathways = pathways ?? [];
  const total = safePathways.reduce((s, p) => s + p.feasibilityScore, 0);
  const sz = 120, r = 50, cx = sz / 2, cy = sz / 2;
  let ang = -90;
  const slices = safePathways.map((p, i) => {
    const a = (p.feasibilityScore / total) * 360, ea = ang + a;
    const x1 = cx + r * Math.cos((Math.PI * ang) / 180), y1 = cy + r * Math.sin((Math.PI * ang) / 180);
    const x2 = cx + r * Math.cos((Math.PI * ea) / 180), y2 = cy + r * Math.sin((Math.PI * ea) / 180);
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${a > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
    ang = ea;
    return { d, color: COLORS[i % COLORS.length] };
  });
  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
      {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} fillOpacity={0.85} stroke="#111827" strokeWidth={1.5} />)}
      <circle cx={cx} cy={cy} r={26} fill="#111827" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#6b7280" fontSize={7.5}>PORTFOLIO</text>
    </svg>
  );
}

// KOR: 실시간 티커 아이템 / ENG: Live ticker item
function TickerItem({ p }: { p: RecommendedPathway }) {
  const ret = scoreToReturn(p.feasibilityScore), pos = ret >= 0;
  return (
    <span className="inline-flex items-center gap-2 px-4 whitespace-nowrap">
      <span className="text-gray-400 text-xs font-mono">{VISA_TICKERS[p.id] ?? p.id}</span>
      <span className="text-white text-xs font-bold font-mono">{p.feasibilityScore}</span>
      <span className={`text-xs font-mono flex items-center gap-0.5 ${pos ? 'text-green-400' : 'text-red-400'}`}>
        {pos ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{pos ? '+' : ''}{ret}%
      </span>
    </span>
  );
}

// KOR: 비자 경로 카드 컴포넌트 / ENG: Visa pathway card component
function PathwayCard({ p, rank, open, onToggle }: { p: RecommendedPathway; rank: number; open: boolean; onToggle: () => void }) {
  const ret = scoreToReturn(p.feasibilityScore), pos = ret >= 0;
  const RANK_COLORS = ['#22c55e', '#3b82f6', '#eab308'];
  const rc = RANK_COLORS[rank] ?? '#6b7280';
  return (
    <div className="border rounded-lg overflow-hidden cursor-pointer transition-all duration-200"
      style={{ borderColor: open ? rc : '#1f2937', backgroundColor: '#111827' }} onClick={onToggle}>
      {/* KOR: 헤더 행 / ENG: Header row */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-black shrink-0"
              style={{ backgroundColor: rc }}>#{rank + 1}</div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-green-400 font-mono text-sm font-bold">{VISA_TICKERS[p.id] ?? p.id}</span>
                <span className="text-white text-sm font-medium truncate">{p.name}</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-gray-500 text-xs flex items-center gap-1"><Clock size={10} />{p.totalDurationMonths}개월</span>
                <span className="text-gray-500 text-xs flex items-center gap-1"><DollarSign size={10} />${p.estimatedCostUSD.toLocaleString()}</span>
                <span className="text-gray-500 text-xs">{getFeasibilityEmoji(p.feasibilityLabel)} {p.feasibilityLabel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <div className={`text-lg font-bold font-mono ${pos ? 'text-green-400' : 'text-red-400'}`}>{pos ? '+' : ''}{ret}%</div>
              <div className="text-gray-600 text-xs">기대 성공률</div>
            </div>
            <CircleGauge score={p.feasibilityScore} size={54} />
            <div className="text-gray-600">{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</div>
          </div>
        </div>
        {/* KOR: 캔들 차트 + 비자 체인 / ENG: Candle chart + visa chain */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <MiniCandles score={p.feasibilityScore} />
          <div className="flex flex-wrap gap-1.5">
            {(p.visaChain ?? []).map((v, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-xs font-mono font-bold border"
                style={{ borderColor: rc, color: rc }}>
                {v.visa}<span className="text-gray-500 font-normal ml-1">{v.duration}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* KOR: 확장 상세 패널 / ENG: Expanded detail panel */}
      {open && (
        <div className="border-t border-gray-800 p-4 bg-gray-950">
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">{p.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: '실현 가능성', val: `${p.feasibilityScore}`, sub: '/ 100점' },
              { label: '예상 기간', val: `${p.totalDurationMonths}`, sub: '개월' },
              { label: '예상 비용', val: `$${(p.estimatedCostUSD / 1000).toFixed(0)}K`, sub: 'USD' },
              { label: '비자 단계', val: `${(p.visaChain ?? []).length}`, sub: 'STEP' },
            ].map((m) => (
              <div key={m.label} className="bg-gray-900 rounded p-3 border border-gray-800">
                <div className="text-gray-500 text-xs mb-1">{m.label}</div>
                <div className="text-white font-bold text-lg font-mono">{m.val}</div>
                <div className="text-gray-600 text-xs">{m.sub}</div>
              </div>
            ))}
          </div>
          {/* KOR: 마일스톤 타임라인 / ENG: Milestone timeline */}
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-800" />
            <div className="space-y-3">
              {(p.milestones ?? []).map((m, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-5 top-1 w-4 h-4 rounded-full border-2 bg-gray-950 flex items-center justify-center text-[10px] text-gray-400"
                    style={{ borderColor: rc }}>{i + 1}</div>
                  <div className="text-white text-sm font-medium">{m.emoji} {m.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{m.description}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2 rounded text-sm font-bold transition-colors"
              style={{ backgroundColor: rc, color: '#000' }}
              onClick={(e) => e.stopPropagation()}>이 경로 선택하기</button>
            <button className="px-4 py-2 rounded text-sm border border-gray-700 text-gray-400 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
}

// KOR: 메인 페이지 컴포넌트 / ENG: Main page component
export default function Diagnosis31Page() {
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [expanded, setExpanded] = useState<string | null>('path-1');
  const [analyzing, setAnalyzing] = useState(false);
  const [ageStr, setAgeStr] = useState('');

  // KOR: 필드 업데이트 헬퍼 / ENG: Field update helper
  const setField = <K extends keyof DiagnosisInput>(key: K, val: DiagnosisInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: val }));

  const completedCount = STEPS.filter((s) => {
    const v = input[s.key as keyof DiagnosisInput];
    return v !== undefined && v !== '';
  }).length;

  // KOR: 진단 실행 (목업 딜레이) / ENG: Run diagnosis (mock delay)
  function handleAnalyze() {
    setAnalyzing(true);
    setTimeout(() => { setResult(mockDiagnosisResult); setAnalyzing(false); }, 1600);
  }

  // KOR: 현재 단계 입력 렌더 / ENG: Render current step input
  function renderInput() {
    const s = STEPS[step];
    if (!s) return null;

    if (s.key === 'nationality') {
      return (
        <div className="grid grid-cols-2 gap-2">
          {popularCountries.map((c) => {
            const sel = input.nationality === c.name;
            return (
              <button key={c.code} onClick={() => setField('nationality', c.name)}
                className={`flex items-center gap-2 p-2.5 rounded border text-xs transition-all ${sel ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}>
                <span className="text-lg">{c.flag}</span><span>{c.name}</span>
                {sel && <CheckCircle size={11} className="ml-auto text-green-400" />}
              </button>
            );
          })}
        </div>
      );
    }

    if (s.key === 'age') {
      return (
        <div className="space-y-3">
          <input type="number" min={18} max={65} placeholder="나이 입력 (18–65)" value={ageStr}
            onChange={(e) => { setAgeStr(e.target.value); const n = parseInt(e.target.value, 10); if (!isNaN(n) && n >= 18 && n <= 65) setField('age', n); }}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2.5 text-white font-mono text-lg focus:outline-none focus:border-green-500 placeholder-gray-600" />
          <div className="flex gap-2 flex-wrap">
            {[22, 25, 28, 30, 35, 40].map((a) => (
              <button key={a} onClick={() => { setField('age', a); setAgeStr(String(a)); }}
                className={`px-3 py-1.5 rounded border text-sm font-mono transition-all ${input.age === a ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-white'}`}>{a}세</button>
            ))}
          </div>
        </div>
      );
    }

    // KOR: 나머지 단계는 선택형 목록 / ENG: Remaining steps are selection lists
    const opts: string[] = s.key === 'educationLevel' ? educationOptions
      : s.key === 'availableAnnualFund' ? fundOptions
      : s.key === 'finalGoal' ? goalOptions
      : priorityOptions;

    return (
      <div className="space-y-2">
        {opts.map((opt) => {
          const sel = input[s.key as keyof DiagnosisInput] === opt;
          return (
            <button key={opt} onClick={() => setField(s.key as keyof DiagnosisInput, opt as DiagnosisInput[typeof s.key])}
              className={`w-full flex items-center justify-between p-3 rounded border text-sm transition-all ${sel ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}>
              <span>{opt}</span>
              {sel ? <CheckCircle size={13} className="text-green-400" /> : <Circle size={13} className="text-gray-700" />}
            </button>
          );
        })}
      </div>
    );
  }

  const curStep = STEPS[step];
  const curVal = curStep ? input[curStep.key as keyof DiagnosisInput] : undefined;
  const canNext = curVal !== undefined && curVal !== '';
  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono">
      {/* KOR: 실시간 티커 바 / ENG: Live ticker bar */}
      <div className="bg-black border-b border-gray-800 py-1.5 overflow-hidden">
        <div className="flex items-center">
          {[...(mockDiagnosisResult.pathways ?? []), ...(mockDiagnosisResult.pathways ?? [])].map((p, i) => (
            <TickerItem key={`${p.id}-${i}`} p={p} />
          ))}
          <span className="text-gray-500 text-xs px-4 flex items-center gap-1.5">
            <Activity size={10} className="text-green-400" />VISA INDEX LIVE
          </span>
        </div>
      </div>

      {/* KOR: GNB 헤더 / ENG: GNB header */}
      <header className="bg-gray-950 border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-green-400" />
            <span className="text-white font-bold text-sm">JOBCHAJA</span>
            <span className="text-gray-600 text-xs">VISA TERMINAL</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-500 text-xs flex items-center gap-1"><Activity size={10} />LIVE</span>
            <span className="text-gray-500 text-xs hidden sm:inline">비자 진단 포트폴리오 분석기</span>
            <Bell size={15} className="text-gray-600 hover:text-white cursor-pointer" />
            <Settings size={15} className="text-gray-600 hover:text-white cursor-pointer" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!result ? (
          /* KOR: 입력 화면 / ENG: Input screen */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* KOR: 좌측 사이드바 / ENG: Left sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Filter size={11} />필터 패널
                </div>
                {/* KOR: 완성도 바 / ENG: Completion bar */}
                <div className="mb-4 p-3 bg-gray-950 rounded border border-gray-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-500 text-xs">데이터 완성도</span>
                    <span className="text-green-400 text-xs font-bold">{Math.round((completedCount / STEPS.length) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${(completedCount / STEPS.length) * 100}%` }} />
                  </div>
                  <div className="text-gray-600 text-xs mt-1">{completedCount}/{STEPS.length} 항목 완료</div>
                </div>
                {/* KOR: 단계 목록 / ENG: Step list */}
                <div className="space-y-1">
                  {STEPS.map((s, i) => {
                    const Icon = s.icon, done = !!input[s.key as keyof DiagnosisInput], active = i === step;
                    return (
                      <button key={s.key} onClick={() => setStep(i)}
                        className={`w-full flex items-center gap-2 p-2.5 rounded text-left text-xs transition-all ${active ? 'bg-green-500/10 border border-green-500/40 text-green-400' : done ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-800'}`}>
                        <Icon size={12} className={active ? 'text-green-400' : done ? 'text-blue-400' : 'text-gray-700'} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{s.label}</div>
                          <div className="text-gray-600 text-[10px]">{s.labelEn}</div>
                        </div>
                        {done && <CheckCircle size={10} className="text-blue-400 shrink-0" />}
                        {active && !done && <ChevronRight size={10} className="text-green-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => { setInput(mockInput); setAgeStr(String(mockInput.age)); setStep(STEPS.length - 1); }}
                  className="w-full mt-4 py-2 rounded border border-gray-700 text-gray-500 hover:text-white hover:border-gray-500 text-xs flex items-center justify-center gap-1.5 transition-all">
                  <RefreshCw size={11} />샘플 데이터 로드
                </button>
              </div>

              {/* KOR: 예비 경로 미리보기 / ENG: Preliminary pathway preview */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BarChart2 size={11} />예비 경로
                </div>
                <div className="space-y-2">
                  {mockPathways.map((p: CompatPathway) => (
                    <div key={p.id} className="p-2 bg-gray-950 rounded border border-gray-800">
                      <div className="text-green-400 text-xs font-bold">{p.nameKo}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {(p.highlights ?? []).map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-500 rounded">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KOR: 중앙 입력 패널 / ENG: Center input panel */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 border border-gray-800 rounded-lg">
                <div className="border-b border-gray-800 px-5 py-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {curStep && React.createElement(curStep.icon, { size: 15, className: 'text-green-400' })}
                      <span className="text-white font-bold">{curStep?.label}</span>
                      <span className="text-gray-600 text-sm">({curStep?.labelEn})</span>
                    </div>
                    <div className="text-gray-600 text-xs mt-0.5">STEP {step + 1} / {STEPS.length}</div>
                  </div>
                  {canNext
                    ? <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle size={11} />입력 완료</span>
                    : <span className="text-gray-600 text-xs flex items-center gap-1"><Circle size={11} />미입력</span>}
                </div>
                <div className="p-5">{renderInput()}</div>
                <div className="border-t border-gray-800 px-5 py-4 flex items-center justify-between">
                  <button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="px-4 py-2 rounded border border-gray-700 text-gray-500 hover:text-white hover:border-gray-500 text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    ← 이전
                  </button>
                  {isLast ? (
                    <button disabled={!canNext || analyzing} onClick={handleAnalyze}
                      className="px-6 py-2 rounded font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                      style={{ backgroundColor: canNext ? '#22c55e' : '#374151', color: canNext ? '#000' : '#6b7280' }}>
                      {analyzing ? <><RefreshCw size={13} className="animate-spin" />분석 중...</> : <><TrendingUp size={13} />포트폴리오 분석 실행</>}
                    </button>
                  ) : (
                    <button disabled={!canNext} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                      className="px-6 py-2 rounded font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: canNext ? '#22c55e' : '#374151', color: canNext ? '#000' : '#6b7280' }}>
                      다음 →
                    </button>
                  )}
                </div>
              </div>
              {/* KOR: 분석 로딩 상태 / ENG: Analysis loading state */}
              {analyzing && (
                <div className="mt-4 bg-gray-900 border border-green-500/30 rounded-lg p-6 text-center">
                  <RefreshCw size={28} className="text-green-400 animate-spin mx-auto mb-3" />
                  <div className="text-green-400 font-bold mb-1">비자 포트폴리오 분석 중...</div>
                  <div className="text-gray-500 text-sm">31개 비자 유형 × 14개 평가 엔진 실행 중</div>
                  <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '70%' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* KOR: 결과 대시보드 / ENG: Result dashboard */
          <div className="space-y-6">
            {/* KOR: 요약 지표 카드 4개 / ENG: 4 summary metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: BarChart2, label: '분석 경로', val: `${(result?.pathways ?? []).length}`, sub: '개 경로', col: 'text-white' },
                { icon: TrendingUp, label: '최고 점수', val: `${Math.max(...(result?.pathways ?? []).map((p) => p.feasibilityScore))}`, sub: '/ 100점', col: 'text-green-400' },
                { icon: Clock, label: '최단 기간', val: `${Math.min(...(result?.pathways ?? []).map((p) => p.totalDurationMonths))}`, sub: '개월', col: 'text-blue-400' },
                { icon: DollarSign, label: '최저 비용', val: `$${(Math.min(...(result?.pathways ?? []).map((p) => p.estimatedCostUSD)) / 1000).toFixed(0)}K`, sub: 'USD', col: 'text-yellow-400' },
              ].map((m) => (
                <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                    {React.createElement(m.icon, { size: 11 })} {m.label}
                  </div>
                  <div className={`text-2xl font-bold font-mono ${m.col}`}>{m.val}</div>
                  <div className="text-gray-600 text-xs mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* KOR: 2컬럼 메인 레이아웃 / ENG: 2-column main layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* KOR: 경로 목록 / ENG: Pathway list */}
              <div className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold flex items-center gap-2">
                    <TrendingUp size={15} className="text-green-400" />비자 포트폴리오 분석 결과
                  </h2>
                  <button onClick={() => { setResult(null); setStep(0); setInput({}); setAgeStr(''); }}
                    className="text-gray-500 hover:text-white text-xs flex items-center gap-1.5 transition-colors">
                    <RefreshCw size={11} />재분석
                  </button>
                </div>
                {(result?.pathways ?? []).map((p, i) => (
                  <PathwayCard key={p.id} p={p} rank={i}
                    open={expanded === p.id} onToggle={() => setExpanded(expanded === p.id ? null : p.id)} />
                ))}
                {/* KOR: 입력 요약 / ENG: Input summary */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Info size={11} />분석 기반 입력 데이터
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STEPS.map((s) => {
                      const v = result.userInput[s.key as keyof DiagnosisInput];
                      if (!v) return null;
                      return (
                        <span key={s.key} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 rounded border border-gray-700 text-xs">
                          <span className="text-gray-500">{s.label}:</span>
                          <span className="text-white">{String(v)}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* KOR: 우측 사이드 패널 / ENG: Right side panel */}
              <div className="space-y-4">
                {/* KOR: 포트폴리오 파이 / ENG: Portfolio pie */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <PieChart size={11} />경로 배분 (성공 점수 기준)
                  </div>
                  <div className="flex items-center justify-center mb-3">
                    <PortfolioPie pathways={result?.pathways ?? []} />
                  </div>
                  <div className="space-y-1.5">
                    {(result?.pathways ?? []).map((p, i) => {
                      const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#f97316', '#a855f7'];
                      const total = (result?.pathways ?? []).reduce((s, x) => s + x.feasibilityScore, 0);
                      return (
                        <div key={p.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-gray-400 truncate max-w-[130px]">{p.name}</span>
                          </div>
                          <span className="text-gray-500 shrink-0 ml-1">{Math.round((p.feasibilityScore / total) * 100)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* KOR: 최우선 추천 게이지 / ENG: Top recommendation gauge */}
                {(result?.pathways ?? [])[0] && (
                  <div className="bg-gray-900 border border-green-500/30 rounded-lg p-4">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Award size={11} className="text-green-400" /><span className="text-green-400">최우선 추천</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CircleGauge score={(result?.pathways ?? [])[0].feasibilityScore} size={70} />
                      <div>
                        <div className="text-white font-bold text-sm">{(result?.pathways ?? [])[0].name}</div>
                        <div className="text-green-400 text-xs mt-0.5">{getFeasibilityEmoji((result?.pathways ?? [])[0].feasibilityLabel)} {(result?.pathways ?? [])[0].feasibilityLabel}</div>
                        <div className="text-gray-500 text-xs mt-1">{(result?.pathways ?? [])[0].totalDurationMonths}개월 · ${(result?.pathways ?? [])[0].estimatedCostUSD.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* KOR: 뉴스 피드 / ENG: News feed */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Bell size={11} />비자 정책 뉴스
                  </div>
                  <div className="space-y-3">
                    {NEWS_ITEMS.map((item, i) => (
                      <div key={i} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.up === true ? 'bg-green-500/20 text-green-400' : item.up === false ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                            {item.tag}
                          </span>
                          <span className="text-gray-600 text-[10px] shrink-0">{item.time}</span>
                        </div>
                        <div className="text-gray-300 text-xs leading-relaxed">{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KOR: 상담 CTA / ENG: Consultation CTA */}
                <div className="bg-linear-to-br from-green-950 to-gray-900 border border-green-800 rounded-lg p-4">
                  <div className="text-green-400 font-bold text-sm mb-1">전문가 상담 신청</div>
                  <div className="text-gray-400 text-xs mb-3">비자 행정사와 1:1 맞춤 전략 수립</div>
                  <button className="w-full py-2 bg-green-500 text-black font-bold text-sm rounded hover:bg-green-400 transition-colors">
                    무료 상담 예약 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KOR: 터미널 하단 상태바 / ENG: Terminal bottom status bar */}
      <footer className="mt-8 border-t border-gray-800 bg-black px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-green-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />SYSTEM ONLINE
            </span>
            <span>VISA ENGINE v2.629 · 31 TYPES · 14 EVALUATORS</span>
          </div>
          <div className="flex items-center gap-4">
            <span>KST {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            <span>JOBCHAJA TERMINAL © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
