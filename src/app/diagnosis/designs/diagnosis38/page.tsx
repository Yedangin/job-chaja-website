'use client';

// 디자인 #38: 신용 점수 스타일 비자 적합도 진단 페이지
// Design #38: Credit Score style visa suitability diagnosis page
// 참조: Credit Karma, FICO, NerdWallet, Mint, Personal Capital
// References: Credit Karma, FICO, NerdWallet, Mint, Personal Capital

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
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
  RefreshCcw,
  Star,
  BarChart2,
  Zap,
} from 'lucide-react';

// ============================================================
// 점수 등급 레이블 / Score grade label
// ============================================================
function getScoreGrade(score: number): { label: string; labelEn: string; color: string; bgColor: string; borderColor: string } {
  if (score >= 71) return { label: '우수', labelEn: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-300' };
  if (score >= 51) return { label: '양호', labelEn: 'Good', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' };
  if (score >= 31) return { label: '보통', labelEn: 'Fair', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-300' };
  if (score >= 11) return { label: '낮음', labelEn: 'Poor', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-300' };
  return { label: '매우 낮음', labelEn: 'Very Poor', color: 'text-red-800', bgColor: 'bg-red-100', borderColor: 'border-red-400' };
}

// ============================================================
// 원형 게이지 SVG 컴포넌트 / Circular gauge SVG component
// ============================================================
interface CircularGaugeProps {
  score: number;
  maxScore: number;
  size: number;
  strokeWidth: number;
}

function CircularGauge({ score, maxScore, size, strokeWidth }: CircularGaugeProps) {
  // 반원 게이지 (180도) / Semi-circle gauge (180 degrees)
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // 게이지 각도 계산 (−180° ~ 0°) / Calculate gauge arc (-180° to 0°)
  const startAngle = -180;
  const endAngle = 0;
  const totalAngle = endAngle - startAngle; // 180도 / 180 degrees

  // 점수에 따른 채움 각도 / Fill angle based on score
  const fillAngle = (score / maxScore) * totalAngle;
  const currentAngle = startAngle + fillAngle;

  // 각도 → 좌표 변환 / Convert angle to coordinates
  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const startPoint = polarToCartesian(startAngle);
  const endPoint = polarToCartesian(currentAngle);
  const bgEndPoint = polarToCartesian(endAngle);

  // 배경 호 경로 / Background arc path
  const bgPath = `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${bgEndPoint.x} ${bgEndPoint.y}`;

  // 채움 호 경로 / Fill arc path
  const largeArc = fillAngle > 180 ? 1 : 0;
  const fillPath = score > 0
    ? `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`
    : '';

  const scoreColor = getScoreColor(score);

  return (
    <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`} className="overflow-visible">
      {/* 배경 그라데이션 정의 / Background gradient definition */}
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="65%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="fillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={scoreColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={scoreColor} />
        </linearGradient>
      </defs>

      {/* 배경 트랙 / Background track */}
      <path
        d={bgPath}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* 채움 호 / Fill arc */}
      {fillPath && (
        <path
          d={fillPath}
          fill="none"
          stroke="url(#fillGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}

      {/* 눈금 마커 / Tick markers */}
      {[0, 25, 50, 75, 100].map((pct) => {
        const angle = startAngle + (pct / 100) * totalAngle;
        const inner = polarToCartesian(angle);
        const innerR = radius - strokeWidth / 2 - 4;
        const outer = {
          x: cx + innerR * Math.cos((angle * Math.PI) / 180),
          y: cy + innerR * Math.sin((angle * Math.PI) / 180),
        };
        return (
          <line
            key={pct}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="#9ca3af"
            strokeWidth={1.5}
          />
        );
      })}

      {/* 현재 점수 포인터 / Current score pointer dot */}
      {score > 0 && (
        <circle
          cx={endPoint.x}
          cy={endPoint.y}
          r={strokeWidth / 2 + 2}
          fill={scoreColor}
          stroke="white"
          strokeWidth={2}
        />
      )}
    </svg>
  );
}

// ============================================================
// 팩터 바 컴포넌트 / Factor bar component
// ============================================================
interface FactorBarProps {
  label: string;
  labelEn: string;
  value: number;
  maxValue: number;
  color: string;
  icon: React.ReactNode;
}

function FactorBar({ label, labelEn, value, maxValue, color, icon }: FactorBarProps) {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <div className="flex items-center gap-3 py-2">
      {/* 아이콘 / Icon */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${color} bg-opacity-10`}>
        {icon}
      </div>
      {/* 레이블 / Label */}
      <div className="shrink-0 w-28">
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-xs text-gray-400">{labelEn}</div>
      </div>
      {/* 바 / Bar */}
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color.replace('text-', '#') }}
        />
      </div>
      {/* 수치 / Value */}
      <div className="shrink-0 w-10 text-right text-sm font-semibold text-gray-700">
        {Math.round(pct)}
      </div>
    </div>
  );
}

// ============================================================
// 경로 카드 컴포넌트 / Pathway card component
// ============================================================
interface PathwayCardProps {
  pathway: RecommendedPathway;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function PathwayCard({ pathway, rank, isExpanded, onToggle }: PathwayCardProps) {
  const grade = getScoreGrade(pathway.finalScore);
  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // 비용 포맷 / Format cost
  const formatCost = (won: number) => {
    if (won === 0) return '무료';
    if (won >= 10000) return `${(won / 10000).toFixed(0)}억원`;
    if (won >= 1000) return `${(won / 1000).toFixed(1)}천만원`;
    return `${won}만원`;
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${grade.borderColor} bg-white shadow-sm hover:shadow-md`}>
      {/* 카드 헤더 / Card header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer select-none"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        aria-expanded={isExpanded}
      >
        {/* 순위 배지 / Rank badge */}
        <div
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: scoreColor }}
        >
          {rank}
        </div>

        {/* 경로 정보 / Pathway info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 text-sm leading-tight">{pathway.nameKo}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${grade.bgColor} ${grade.color}`}>
              {emoji} {pathway.feasibilityLabel}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{pathway.nameEn}</div>
          {/* 비자 체인 / Visa chain */}
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {pathway.visaChain.split(' → ').map((v, i, arr) => (
              <React.Fragment key={i}>
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{v}</span>
                {i < arr.length - 1 && <ChevronRight size={10} className="text-gray-400 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 점수 + 펼치기 / Score + expand */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <div className="text-2xl font-bold" style={{ color: scoreColor }}>{pathway.finalScore}</div>
          <div className="text-xs text-gray-400">/ 100</div>
          {isExpanded ? <ChevronUp size={16} className="text-gray-400 mt-1" /> : <ChevronDown size={16} className="text-gray-400 mt-1" />}
        </div>
      </div>

      {/* 핵심 지표 요약 / Key metrics summary */}
      <div className="flex divide-x divide-gray-100 border-t border-gray-100 bg-gray-50">
        <div className="flex-1 py-2 px-3 text-center">
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Clock size={11} /> 기간
          </div>
          <div className="text-sm font-semibold text-gray-800">{pathway.estimatedMonths}개월</div>
        </div>
        <div className="flex-1 py-2 px-3 text-center">
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <DollarSign size={11} /> 비용
          </div>
          <div className="text-sm font-semibold text-gray-800">{formatCost(pathway.estimatedCostWon)}</div>
        </div>
        <div className="flex-1 py-2 px-3 text-center">
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <BarChart2 size={11} /> 점수
          </div>
          <div className="text-sm font-semibold" style={{ color: scoreColor }}>{grade.label}</div>
        </div>
      </div>

      {/* 확장 패널 / Expanded panel */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 space-y-4">
          {/* 점수 팩터 분석 / Score factor analysis */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              점수 분석 / Score Breakdown
            </div>
            <div className="space-y-1">
              <FactorBar
                label="기초 점수"
                labelEn="Base Score"
                value={pathway.scoreBreakdown.base}
                maxValue={100}
                color="text-green-500"
                icon={<Award size={14} className="text-green-500" />}
              />
              <FactorBar
                label="나이 적합도"
                labelEn="Age Factor"
                value={Math.round(pathway.scoreBreakdown.ageMultiplier * 100)}
                maxValue={100}
                color="text-blue-500"
                icon={<TrendingUp size={14} className="text-blue-500" />}
              />
              <FactorBar
                label="국적 가산"
                labelEn="Nationality"
                value={Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100)}
                maxValue={100}
                color="text-purple-500"
                icon={<Shield size={14} className="text-purple-500" />}
              />
              <FactorBar
                label="자금 여력"
                labelEn="Fund Capacity"
                value={Math.round(pathway.scoreBreakdown.fundMultiplier * 100)}
                maxValue={100}
                color="text-amber-500"
                icon={<DollarSign size={14} className="text-amber-500" />}
              />
              <FactorBar
                label="우선순위 일치"
                labelEn="Priority Match"
                value={Math.round(pathway.scoreBreakdown.priorityWeight * 100)}
                maxValue={100}
                color="text-rose-500"
                icon={<Star size={14} className="text-rose-500" />}
              />
            </div>
          </div>

          {/* 마일스톤 / Milestones */}
          {pathway.milestones.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                주요 단계 / Key Milestones
              </div>
              <div className="space-y-2">
                {pathway.milestones.map((m) => (
                  <div key={m.order} className="flex items-start gap-3">
                    {/* 타임라인 도트 / Timeline dot */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-800">{m.nameKo}</span>
                        {m.visaStatus && m.visaStatus !== 'none' && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-mono">{m.visaStatus}</span>
                        )}
                        <span className="text-xs text-gray-400">{m.monthFromStart}개월차</span>
                      </div>
                      {m.canWorkPartTime && (
                        <div className="text-xs text-blue-600 mt-0.5 flex items-center gap-1">
                          <CheckCircle size={11} />
                          아르바이트 가능{m.weeklyHours > 0 ? ` (주${m.weeklyHours}시간)` : ''}
                          {m.estimatedMonthlyIncome > 0 ? ` · 월 ${m.estimatedMonthlyIncome}만원` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 다음 단계 액션 / Next step actions */}
          {pathway.nextSteps.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                지금 할 일 / Next Steps
              </div>
              <div className="space-y-1.5">
                {pathway.nextSteps.map((ns, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg border border-green-100">
                    <Zap size={13} className="text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-green-800">{ns.nameKo}</div>
                      <div className="text-xs text-green-700">{ns.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 메모 / Note */}
          {pathway.note && (
            <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <Info size={13} className="text-gray-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600">{pathway.note}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 미니 트렌드 그래프 / Mini trend chart (sparkline)
// ============================================================
interface TrendChartProps {
  scores: number[];
  labels: string[];
  color: string;
}

function TrendChart({ scores, labels, color }: TrendChartProps) {
  const max = Math.max(...scores, 1);
  const width = 240;
  const height = 60;
  const padding = 8;

  const points = scores.map((s, i) => ({
    x: padding + (i / (scores.length - 1)) * (width - padding * 2),
    y: height - padding - (s / max) * (height - padding * 2),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div>
      <svg width={width} height={height} className="overflow-visible">
        {/* 배경 격자 / Background grid */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = height - padding - (pct / 100) * (height - padding * 2);
          return (
            <line key={pct} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f3f4f6" strokeWidth={1} />
          );
        })}
        {/* 라인 / Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* 포인트 / Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} stroke="white" strokeWidth={1.5} />
        ))}
      </svg>
      {/* X축 레이블 / X-axis labels */}
      <div className="flex justify-between px-2">
        {labels.map((l, i) => (
          <span key={i} className="text-xs text-gray-400">{l}</span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis38Page() {
  // 현재 단계: 'input' | 'result' / Current step: 'input' | 'result'
  const [step, setStep] = useState<'input' | 'result'>('input');

  // 입력 상태 / Input state
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });

  // 나이 입력 버퍼 / Age input buffer
  const [ageText, setAgeText] = useState<string>(String(mockInput.age));

  // 확장된 경로 ID / Expanded pathway ID
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 결과 데이터 / Result data
  const result: DiagnosisResult = mockDiagnosisResult;

  // 선택된 국가 / Selected country
  const selectedCountry = popularCountries.find((c) => c.code === input.nationality);

  // 톱 점수 경로 / Top score pathway (for main gauge)
  const topPathway = result.pathways[0];

  // 평균 점수 / Average score
  const avgScore = Math.round(
    result.pathways.reduce((sum, p) => sum + p.finalScore, 0) / result.pathways.length
  );

  // 트렌드 데이터 (5개 경로 점수) / Trend data (5 pathway scores)
  const trendScores = result.pathways.map((p) => p.finalScore);
  const trendLabels = result.pathways.map((_, i) => `P${i + 1}`);

  const handleReset = () => {
    setStep('input');
    setExpandedId(null);
  };

  // ============================================================
  // 입력 폼 렌더링 / Render input form
  // ============================================================
  if (step === 'input') {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50">
        {/* 헤더 / Header */}
        <div className="bg-white border-b border-green-100 shadow-sm">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <BarChart2 size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">잡차자 비자 스코어</div>
              <div className="text-xs text-gray-400">Jobchaja Visa Score · 신용점수 스타일</div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
          {/* 상단 설명 카드 / Intro card */}
          <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center shrink-0">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">나의 비자 적합도 점수는?</div>
                <div className="text-green-100 text-sm mt-1">
                  신용 점수처럼, 내 조건에 맞는 비자 경로 적합도를 0~100점으로 분석합니다.
                </div>
                <div className="text-xs text-green-200 mt-2">
                  What is my visa suitability score? Rated 0-100 like a credit score.
                </div>
              </div>
            </div>

            {/* 샘플 게이지 미리보기 / Sample gauge preview */}
            <div className="mt-4 flex items-center justify-center">
              <CircularGauge score={72} maxScore={100} size={160} strokeWidth={16} />
            </div>
            <div className="text-center -mt-2">
              <div className="text-4xl font-bold">72</div>
              <div className="text-green-200 text-sm">샘플 점수 · Sample Score</div>
            </div>
          </div>

          {/* 국적 선택 / Nationality selection */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              국적 선택 / Nationality
            </div>
            <div className="grid grid-cols-3 gap-2">
              {popularCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setInput((prev) => ({ ...prev, nationality: c.code }))}
                  className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border text-sm transition-all ${
                    input.nationality === c.code
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="truncate">{c.nameKo}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 나이 입력 / Age input */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              나이 / Age
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={18}
                max={60}
                value={ageText}
                onChange={(e) => {
                  setAgeText(e.target.value);
                  const n = parseInt(e.target.value, 10);
                  if (!isNaN(n) && n >= 18 && n <= 60) {
                    setInput((prev) => ({ ...prev, age: n }));
                  }
                }}
                className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-center text-lg font-semibold text-gray-900 focus:outline-none focus:border-green-400"
              />
              <span className="text-sm text-gray-500">세 (18~60)</span>
            </div>
          </div>

          {/* 학력 선택 / Education level */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              최종 학력 / Education Level
            </div>
            <div className="space-y-2">
              {educationOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInput((prev) => ({ ...prev, educationLevel: opt.value }))}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all text-left ${
                    input.educationLevel === opt.value
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.labelKo}</span>
                  <span className="text-xs text-gray-400 ml-1">· {opt.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 자금 선택 / Fund selection */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              연간 사용 가능 자금 / Available Annual Fund
            </div>
            <div className="space-y-2">
              {fundOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInput((prev) => ({ ...prev, availableAnnualFund: opt.value }))}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    input.availableAnnualFund === opt.value
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <span>{opt.labelKo}</span>
                  <span className="text-xs text-gray-400">{opt.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 최종 목표 / Final goal */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              최종 목표 / Final Goal
            </div>
            <div className="grid grid-cols-2 gap-2">
              {goalOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInput((prev) => ({ ...prev, finalGoal: opt.value }))}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-sm transition-all ${
                    input.finalGoal === opt.value
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-semibold">{opt.labelKo}</span>
                  <span className="text-xs text-gray-400">{opt.descKo}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 우선순위 / Priority */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              우선순위 / Priority Preference
            </div>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setInput((prev) => ({ ...prev, priorityPreference: opt.value }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    input.priorityPreference === opt.value
                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium">{opt.labelKo}</div>
                    <div className="text-xs text-gray-400">{opt.descKo}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 분석 시작 버튼 / Start analysis button */}
          <button
            onClick={() => setStep('result')}
            className="w-full py-4 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <div className="flex items-center justify-center gap-2">
              <BarChart2 size={18} />
              <span>내 비자 점수 분석하기</span>
              <ChevronRight size={18} />
            </div>
            <div className="text-xs text-green-100 mt-0.5">Analyze My Visa Score</div>
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // 결과 페이지 렌더링 / Render result page
  // ============================================================
  const topGrade = getScoreGrade(topPathway.finalScore);
  const topColor = getScoreColor(topPathway.finalScore);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50">
      {/* 결과 헤더 / Result header */}
      <div className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="뒤로 가기 / Go back"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-sm">비자 스코어 결과</div>
            <div className="text-xs text-gray-400">
              {selectedCountry?.flag} {selectedCountry?.nameKo} · {input.age}세 · {input.finalGoal}
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
          >
            <RefreshCcw size={12} />
            재진단
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* 메인 스코어 카드 / Main score card */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden">
          {/* 그라데이션 배너 / Gradient banner */}
          <div className="bg-linear-to-br from-green-500 to-emerald-600 p-5 pb-2 text-white text-center">
            <div className="text-sm font-medium text-green-100 mb-1">최고 적합도 경로 점수 / Top Pathway Score</div>
            <div className="font-semibold text-base">{topPathway.nameKo}</div>
          </div>

          {/* 원형 게이지 / Circular gauge */}
          <div className="bg-white px-5 pb-2 pt-4 flex flex-col items-center">
            <CircularGauge score={topPathway.finalScore} maxScore={100} size={220} strokeWidth={20} />
            <div className="-mt-8 text-center">
              <div className="text-6xl font-extrabold" style={{ color: topColor }}>
                {topPathway.finalScore}
              </div>
              <div className="text-gray-400 text-sm">/ 100점</div>
              <div className={`mt-2 inline-block px-4 py-1 rounded-full text-sm font-semibold ${topGrade.bgColor} ${topGrade.color} border ${topGrade.borderColor}`}>
                {getFeasibilityEmoji(topPathway.feasibilityLabel)} {topGrade.label} · {topGrade.labelEn}
              </div>
            </div>
          </div>

          {/* 등급 범례 / Grade legend */}
          <div className="flex divide-x divide-gray-100 border-t border-gray-100 bg-gray-50 text-center text-xs">
            {[
              { label: '매우낮음', range: '0-10', color: '#ef4444' },
              { label: '낮음', range: '11-30', color: '#f59e0b' },
              { label: '보통', range: '31-50', color: '#f59e0b' },
              { label: '양호', range: '51-70', color: '#3b82f6' },
              { label: '우수', range: '71+', color: '#22c55e' },
            ].map((g) => (
              <div key={g.label} className="flex-1 py-2">
                <div className="font-bold" style={{ color: g.color }}>{g.label}</div>
                <div className="text-gray-400 text-xs">{g.range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 트렌드 그래프 / Trend chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
          <div className="text-sm font-semibold text-gray-700 mb-1">
            경로별 점수 트렌드 / Score by Pathway
          </div>
          <div className="text-xs text-gray-400 mb-3">
            {result.meta.totalPathwaysEvaluated}개 경로 평가, {result.meta.hardFilteredOut}개 제외
            · {result.meta.totalPathwaysEvaluated} paths evaluated, {result.meta.hardFilteredOut} filtered
          </div>
          <TrendChart scores={trendScores} labels={trendLabels} color={topColor} />
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              평균 점수 / Avg Score: <span className="font-bold text-gray-800">{avgScore}</span>
            </div>
            <div className="text-xs text-gray-500">
              최고 / Best: <span className="font-bold" style={{ color: topColor }}>{topPathway.finalScore}</span>
            </div>
          </div>
        </div>

        {/* 주요 팩터 요약 / Key factor summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            내 조건 요약 / My Profile Summary
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '국적', value: `${selectedCountry?.flag} ${selectedCountry?.nameKo}`, icon: <Shield size={14} className="text-green-500" /> },
              { label: '나이', value: `${input.age}세`, icon: <TrendingUp size={14} className="text-blue-500" /> },
              { label: '학력', value: educationOptions.find((e) => e.value === input.educationLevel)?.labelKo ?? input.educationLevel, icon: <Award size={14} className="text-purple-500" /> },
              { label: '연간 자금', value: fundOptions.find((f) => f.value === input.availableAnnualFund)?.labelKo ?? '', icon: <DollarSign size={14} className="text-amber-500" /> },
              { label: '목표', value: goalOptions.find((g) => g.value === input.finalGoal)?.labelKo ?? input.finalGoal, icon: <Star size={14} className="text-rose-500" /> },
              { label: '우선순위', value: priorityOptions.find((p) => p.value === input.priorityPreference)?.labelKo ?? input.priorityPreference, icon: <Zap size={14} className="text-orange-500" /> },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="shrink-0">{item.icon}</div>
                <div>
                  <div className="text-xs text-gray-400">{item.label}</div>
                  <div className="text-sm font-semibold text-gray-800 truncate">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 경로 카드 목록 / Pathway card list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-gray-800">
                추천 비자 경로 / Recommended Pathways
              </div>
              <div className="text-xs text-gray-400">{result.pathways.length}개 경로 · {result.pathways.length} pathways</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Info size={11} />
              탭하여 상세보기
            </div>
          </div>

          <div className="space-y-3">
            {result.pathways.map((pathway, index) => (
              <PathwayCard
                key={pathway.pathwayId}
                pathway={pathway}
                rank={index + 1}
                isExpanded={expandedId === pathway.pathwayId}
                onToggle={() => setExpandedId((prev) => (prev === pathway.pathwayId ? null : pathway.pathwayId))}
              />
            ))}
          </div>
        </div>

        {/* 하단 CTA / Bottom CTA */}
        <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white text-center shadow-lg">
          <div className="text-lg font-bold mb-1">비자 경로가 확정됐나요?</div>
          <div className="text-green-100 text-sm mb-4">
            잡차자에서 비자 맞춤 채용공고를 찾아보세요.
            <br />
            <span className="text-xs">Find visa-matched jobs on Jobchaja.</span>
          </div>
          <button className="w-full py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors">
            채용공고 보러가기 / View Jobs →
          </button>
        </div>

        {/* 재진단 버튼 / Redo button */}
        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl border border-green-300 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCcw size={15} />
          조건 바꿔서 다시 분석하기 / Re-analyze with Different Conditions
        </button>

        {/* 하단 여백 / Bottom spacing */}
        <div className="h-6" />
      </div>
    </div>
  );
}
