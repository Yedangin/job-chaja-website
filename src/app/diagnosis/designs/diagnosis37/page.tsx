'use client';

// 데이터 시각화 비자 진단 페이지 / Data visualization visa diagnosis page
// Design #37: 다크 대시보드 + 인터랙티브 차트 UI / Dark dashboard + interactive chart UI

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
  BarChart2,
  Filter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Globe,
  GraduationCap,
  DollarSign,
  Target,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Circle,
  ArrowRight,
  RefreshCw,
  Activity,
  PieChart,
  Layers,
  Map,
  Star,
} from 'lucide-react';

// ============================================================
// 헬퍼: 금액 포맷 / Helper: format KRW amount
// ============================================================
function formatKRW(manWon: number): string {
  if (manWon === 0) return '무료';
  if (manWon >= 10000) return `${(manWon / 10000).toFixed(1)}억원`;
  if (manWon >= 1000) return `${(manWon / 1000).toFixed(1)}천만원`;
  return `${manWon.toLocaleString()}만원`;
}

// ============================================================
// 헬퍼: 레이더 차트 SVG 좌표 계산 / Helper: radar chart SVG coords
// ============================================================
function radarCoords(
  cx: number,
  cy: number,
  r: number,
  angle: number
): { x: number; y: number } {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ============================================================
// 서브컴포넌트: 필터 패널 / Sub-component: Filter panel
// ============================================================
interface FilterPanelProps {
  input: DiagnosisInput;
  step: number;
  onNext: (field: keyof DiagnosisInput, value: string | number) => void;
  onReset: () => void;
}

function FilterPanel({ input, step, onNext, onReset }: FilterPanelProps) {
  const [localAge, setLocalAge] = useState<string>(String(input.age || ''));

  // 단계별 필터 렌더 / Render filter per step
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-widest">
              국적 선택 / Nationality
            </p>
            <div className="grid grid-cols-2 gap-2">
              {popularCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => onNext('nationality', c.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                    input.nationality === c.code
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-cyan-600'
                  }`}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span>{c.nameKo}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-widest">
              나이 입력 / Age
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={localAge}
                onChange={(e) => setLocalAge(e.target.value)}
                placeholder="예) 24"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl text-center focus:border-cyan-400 focus:outline-none"
                min={18}
                max={65}
              />
              <span className="text-gray-400 text-sm shrink-0">세</span>
            </div>
            <button
              onClick={() => {
                const age = parseInt(localAge, 10);
                if (!isNaN(age) && age >= 18 && age <= 65) onNext('age', age);
              }}
              className="mt-4 w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all"
            >
              다음 →
            </button>
          </div>
        );

      case 2:
        return (
          <div>
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-widest">
              학력 / Education
            </p>
            <div className="space-y-2">
              {educationOptions.map((e) => (
                <button
                  key={e.value}
                  onClick={() => onNext('educationLevel', e.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm transition-all ${
                    input.educationLevel === e.value
                      ? 'border-violet-400 bg-violet-400/10 text-violet-300'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-violet-600'
                  }`}
                >
                  <span className="text-base">{e.emoji}</span>
                  <span>{e.labelKo}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-widest">
              연간 가용 자금 / Annual Fund
            </p>
            <div className="space-y-2">
              {fundOptions.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onNext('availableAnnualFund', f.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition-all ${
                    input.availableAnnualFund === f.value
                      ? 'border-emerald-400 bg-emerald-400/10 text-emerald-300'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-emerald-600'
                  }`}
                >
                  <span>{f.labelKo}</span>
                  <span className="text-xs text-gray-500">{f.labelEn}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-widest">
              최종 목표 / Final Goal
            </p>
            <div className="grid grid-cols-2 gap-2">
              {goalOptions.map((g) => (
                <button
                  key={g.value}
                  onClick={() => onNext('finalGoal', g.value)}
                  className={`flex flex-col items-center gap-1 px-3 py-4 rounded-xl border text-center transition-all ${
                    input.finalGoal === g.value
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-amber-600'
                  }`}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <span className="font-semibold text-sm">{g.labelKo}</span>
                  <span className="text-xs text-gray-500 leading-tight">{g.descKo}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-widest">
              우선순위 / Priority
            </p>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((p) => (
                <button
                  key={p.value}
                  onClick={() => onNext('priorityPreference', p.value)}
                  className={`flex flex-col items-center gap-1 px-3 py-4 rounded-xl border text-center transition-all ${
                    input.priorityPreference === p.value
                      ? 'border-rose-400 bg-rose-400/10 text-rose-300'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-rose-600'
                  }`}
                >
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="font-semibold text-sm">{p.labelKo}</span>
                  <span className="text-xs text-gray-500 leading-tight">{p.descKo}</span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepLabels = ['국적', '나이', '학력', '자금', '목표', '우선순위'];
  const stepIcons = [Globe, Circle, GraduationCap, DollarSign, Target, Zap];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-full flex flex-col">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-cyan-400" />
          <span className="text-white font-semibold text-sm">필터 패널</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs transition-colors"
        >
          <RefreshCw size={12} />
          초기화
        </button>
      </div>

      {/* 단계 진행 표시 / Step progress indicators */}
      <div className="flex gap-1 mb-5">
        {stepLabels.map((label, idx) => {
          const Icon = stepIcons[idx];
          return (
            <div
              key={label}
              className={`flex-1 flex flex-col items-center gap-0.5 ${
                idx <= step ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  idx < step
                    ? 'bg-cyan-500 text-black'
                    : idx === step
                    ? 'bg-cyan-400/20 border border-cyan-400 text-cyan-400'
                    : 'bg-gray-800 text-gray-600'
                }`}
              >
                {idx < step ? (
                  <CheckCircle size={12} />
                ) : (
                  <Icon size={12} />
                )}
              </div>
              <span className="text-gray-600 text-xs">{label}</span>
            </div>
          );
        })}
      </div>

      {/* 단계별 콘텐츠 / Step content */}
      <div className="flex-1 overflow-y-auto">{renderStep()}</div>
    </div>
  );
}

// ============================================================
// 서브컴포넌트: 레이더 차트 / Sub-component: Radar chart SVG
// ============================================================
interface RadarChartProps {
  pathway: CompatPathway;
}

function RadarChart({ pathway }: RadarChartProps) {
  const cx = 100;
  const cy = 100;
  const maxR = 75;
  const sb = pathway.scoreBreakdown;

  // 6개 축 데이터 / 6-axis data
  const axes = [
    { label: '기본점수', value: sb.base / 100 },
    { label: '나이', value: sb.ageMultiplier },
    { label: '국적', value: sb.nationalityMultiplier },
    { label: '자금', value: sb.fundMultiplier },
    { label: '학력', value: sb.educationMultiplier },
    { label: '우선순위', value: sb.priorityWeight },
  ];

  const n = axes.length;

  // 배경 그리드 / Background grid
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    const pts = axes
      .map((_, i) => {
        const angle = (360 / n) * i;
        const { x, y } = radarCoords(cx, cy, maxR * level, angle);
        return `${x},${y}`;
      })
      .join(' ');
    return pts;
  });

  // 데이터 폴리곤 / Data polygon
  const dataPolygon = axes
    .map((axis, i) => {
      const angle = (360 / n) * i;
      const { x, y } = radarCoords(cx, cy, maxR * Math.min(axis.value, 1), angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* 배경 그리드 / Background grid polygons */}
      {gridPolygons.map((pts, gi) => (
        <polygon
          key={gi}
          points={pts}
          fill="none"
          stroke={gi === gridPolygons.length - 1 ? '#374151' : '#1f2937'}
          strokeWidth="1"
        />
      ))}
      {/* 축 선 / Axis lines */}
      {axes.map((_, i) => {
        const angle = (360 / n) * i;
        const { x, y } = radarCoords(cx, cy, maxR, angle);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#374151" strokeWidth="1" />
        );
      })}
      {/* 데이터 영역 / Data area */}
      <polygon
        points={dataPolygon}
        fill="rgba(6, 182, 212, 0.15)"
        stroke="#06b6d4"
        strokeWidth="2"
      />
      {/* 데이터 점 / Data points */}
      {axes.map((axis, i) => {
        const angle = (360 / n) * i;
        const { x, y } = radarCoords(cx, cy, maxR * Math.min(axis.value, 1), angle);
        return <circle key={i} cx={x} cy={y} r="3" fill="#06b6d4" />;
      })}
      {/* 축 라벨 / Axis labels */}
      {axes.map((axis, i) => {
        const angle = (360 / n) * i;
        const { x, y } = radarCoords(cx, cy, maxR + 16, angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill="#9ca3af"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

// ============================================================
// 서브컴포넌트: 히트맵 셀 / Sub-component: Heatmap cell
// ============================================================
interface HeatmapProps {
  pathways: CompatPathway[];
}

function ScoreHeatmap({ pathways }: HeatmapProps) {
  const metrics = ['기본점수', '나이', '국적', '자금', '우선순위'];
  const getVal = (p: CompatPathway, metric: string): number => {
    const sb = p.scoreBreakdown;
    switch (metric) {
      case '기본점수': return sb.base / 100;
      case '나이': return sb.ageMultiplier;
      case '국적': return sb.nationalityMultiplier;
      case '자금': return sb.fundMultiplier;
      case '우선순위': return sb.priorityWeight;
      default: return 0;
    }
  };

  // 값 → 색 / Value → color
  const heatColor = (val: number): string => {
    if (val >= 0.9) return 'bg-cyan-400';
    if (val >= 0.75) return 'bg-cyan-600';
    if (val >= 0.6) return 'bg-blue-700';
    if (val >= 0.4) return 'bg-indigo-800';
    return 'bg-gray-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left text-gray-500 font-normal pb-2 pr-3 w-24">경로</th>
            {metrics.map((m) => (
              <th key={m} className="text-center text-gray-500 font-normal pb-2 px-1">
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pathways.map((p) => (
            <tr key={p.id}>
              <td className="text-gray-400 pr-3 py-1 truncate max-w-[80px]">{p.nameKo}</td>
              {metrics.map((m) => {
                const val = getVal(p, m);
                return (
                  <td key={m} className="px-1 py-1 text-center">
                    <div
                      className={`${heatColor(val)} rounded w-full h-7 flex items-center justify-center text-white font-mono`}
                    >
                      {Math.round(val * 100)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// 서브컴포넌트: 버블 차트 / Sub-component: Bubble chart SVG
// ============================================================
interface BubbleChartProps {
  pathways: CompatPathway[];
  onSelect: (id: string) => void;
  selectedId: string;
}

function BubbleChart({ pathways, onSelect, selectedId }: BubbleChartProps) {
  const W = 340;
  const H = 200;
  const PAD = 30;

  const maxMonths = Math.max(...pathways.map((p) => p.estimatedMonths));
  const maxScore = Math.max(...pathways.map((p) => p.finalScore));
  const maxCost = Math.max(...pathways.map((p) => p.estimatedCostWon || 1));

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* 그리드 / Grid */}
        {[0.25, 0.5, 0.75, 1.0].map((v) => (
          <line
            key={v}
            x1={PAD + (W - PAD * 2) * v}
            y1={PAD}
            x2={PAD + (W - PAD * 2) * v}
            y2={H - PAD}
            stroke="#1f2937"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}
        {[0.25, 0.5, 0.75, 1.0].map((v) => (
          <line
            key={v}
            x1={PAD}
            y1={PAD + (H - PAD * 2) * (1 - v)}
            x2={W - PAD}
            y2={PAD + (H - PAD * 2) * (1 - v)}
            stroke="#1f2937"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}
        {/* 축 레이블 / Axis labels */}
        <text x={W / 2} y={H - 5} textAnchor="middle" fontSize="8" fill="#6b7280">
          소요 기간 (개월)
        </text>
        <text
          x={10}
          y={H / 2}
          textAnchor="middle"
          fontSize="8"
          fill="#6b7280"
          transform={`rotate(-90, 10, ${H / 2})`}
        >
          점수
        </text>
        {/* 버블 / Bubbles */}
        {pathways.map((p) => {
          const x = PAD + ((p.estimatedMonths / maxMonths) * (W - PAD * 2));
          const y = PAD + ((1 - p.finalScore / maxScore) * (H - PAD * 2));
          const r = 6 + ((p.estimatedCostWon || 0) / maxCost) * 18;
          const isSelected = p.id === selectedId;
          const color = getScoreColor(p.finalScore);

          return (
            <g key={p.id} onClick={() => onSelect(p.id)} className="cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={color}
                fillOpacity={isSelected ? 0.9 : 0.35}
                stroke={color}
                strokeWidth={isSelected ? 2 : 1}
              />
              <text x={x} y={y + 1} textAnchor="middle" fontSize="7" fill="white" dominantBaseline="middle">
                {p.estimatedMonths}m
              </text>
            </g>
          );
        })}
      </svg>
      {/* 범례 / Legend */}
      <div className="absolute bottom-6 right-2 text-xs text-gray-600 flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-600" />
          <span>버블 크기 = 비용</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 서브컴포넌트: 산키 다이어그램 시각화 / Sankey-style pathway flow
// ============================================================
interface SankeyProps {
  pathway: CompatPathway;
}

function SankeyFlow({ pathway }: SankeyProps) {
  const chain = pathway.visaChain;

  return (
    <div className="flex items-center gap-0 overflow-x-auto py-2">
      {chain.map((visa, idx) => (
        <React.Fragment key={visa.code}>
          <div
            className="shrink-0 flex flex-col items-center"
            style={{ minWidth: '70px' }}
          >
            <div
              className="px-3 py-2 rounded-lg text-xs font-bold text-center"
              style={{
                background: `linear-gradient(135deg, ${idx === 0 ? '#1e3a5f' : idx === chain.length - 1 ? '#1a3a2a' : '#2d1b4e'}, transparent)`,
                border: `1px solid ${idx === chain.length - 1 ? '#22c55e' : '#6366f1'}`,
                color: idx === chain.length - 1 ? '#4ade80' : '#a5b4fc',
              }}
            >
              {visa.code}
            </div>
            {idx === 0 && (
              <span className="text-gray-600 text-xs mt-1">입국</span>
            )}
            {idx === chain.length - 1 && (
              <span className="text-emerald-600 text-xs mt-1">목표</span>
            )}
          </div>
          {idx < chain.length - 1 && (
            <div className="shrink-0 mx-1">
              <ArrowRight size={14} className="text-gray-600" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ============================================================
// 서브컴포넌트: 경로 카드 / Sub-component: Pathway card
// ============================================================
interface PathwayCardProps {
  pathway: CompatPathway;
  rank: number;
  isSelected: boolean;
  onClick: () => void;
}

function PathwayCard({ pathway, rank, isSelected, onClick }: PathwayCardProps) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border-cyan-500 bg-gray-800/80'
          : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
      }`}
    >
      {/* 카드 헤더 / Card header */}
      <div className="p-4 cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* 순위 배지 / Rank badge */}
            <div
              className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                rank === 1 ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {rank === 1 ? <Star size={14} /> : `#${rank}`}
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{pathway.nameKo}</p>
              <p className="text-gray-500 text-xs mt-0.5">{pathway.nameEn}</p>
            </div>
          </div>
          {/* 점수 게이지 / Score gauge */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <div
              className="text-2xl font-black font-mono"
              style={{ color: scoreColor }}
            >
              {pathway.finalScore}
            </div>
            <div className="text-xs text-gray-500">
              {emoji} {pathway.feasibilityLabel}
            </div>
          </div>
        </div>

        {/* 스코어 바 / Score bar */}
        <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(pathway.finalScore, 100)}%`,
              background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`,
            }}
          />
        </div>

        {/* 주요 지표 / Key metrics */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center bg-gray-800/50 rounded-lg py-2">
            <Clock size={12} className="text-gray-500 mb-1" />
            <span className="text-white text-sm font-bold">{pathway.estimatedMonths}</span>
            <span className="text-gray-600 text-xs">개월</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800/50 rounded-lg py-2">
            <DollarSign size={12} className="text-gray-500 mb-1" />
            <span className="text-white text-sm font-bold">{formatKRW(pathway.estimatedCostWon)}</span>
            <span className="text-gray-600 text-xs">비용</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800/50 rounded-lg py-2">
            <Layers size={12} className="text-gray-500 mb-1" />
            <span className="text-white text-sm font-bold">{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length}</span>
            <span className="text-gray-600 text-xs">단계</span>
          </div>
        </div>

        {/* 비자 체인 / Visa chain */}
        <div className="mt-3">
          <SankeyFlow pathway={pathway} />
        </div>
      </div>

      {/* 드릴다운 / Drill-down toggle */}
      <div
        className="px-4 pb-2 flex items-center justify-between cursor-pointer text-gray-600 hover:text-gray-400 text-xs"
        onClick={() => setExpanded(!expanded)}
      >
        <span>마일스톤 {pathway.milestones.length}개</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>

      {/* 마일스톤 드릴다운 / Milestone drill-down */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-800 pt-3">
          {pathway.milestones.map((m, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center">
                  <span className="text-cyan-400 text-xs font-bold">{m.order}</span>
                </div>
                {idx < pathway.milestones.length - 1 && (
                  <div className="w-px h-4 bg-gray-800 mt-1" />
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-xs font-medium">{m.nameKo}</span>
                  <span className="text-gray-600 text-xs">{m.monthFromStart}개월차</span>
                </div>
                {m.visaStatus && m.visaStatus !== 'none' && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-indigo-900/50 text-indigo-300 border border-indigo-800">
                    {m.visaStatus}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* 다음 단계 / Next steps */}
          {pathway.nextSteps.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">
                다음 액션 / Next Actions
              </p>
              {pathway.nextSteps.map((ns, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-gray-400 mb-1">
                  <ChevronRight size={12} className="shrink-0 text-cyan-600 mt-0.5" />
                  <span>{ns.nameKo}: {ns.description}</span>
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
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis37Page() {
  // 입력 상태 / Input state
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });
  const [step, setStep] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [result] = useState<DiagnosisResult>(mockDiagnosisResult);
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>(
    mockPathways[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'radar' | 'heatmap' | 'bubble'>(
    'overview'
  );

  // 필터 단계 진행 / Advance filter step
  const handleNext = (field: keyof DiagnosisInput, value: string | number) => {
    setInput((prev) => ({ ...prev, [field]: value }));
    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      // 마지막 단계: 결과 표시 / Last step: show results
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setInput({ ...mockInput });
    setStep(0);
    setShowResults(false);
    setSelectedPathwayId(mockPathways[0]?.id || '');
  };

  const selectedPathway =
    mockPathways.find((p) => p.id === selectedPathwayId) || mockPathways[0];

  // 분석 실행 버튼 / Run analysis button
  const handleAnalyze = () => {
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 최상단 헤더 / Top header bar */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <BarChart2 size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm">잡차자 비자 진단</span>
              <span className="ml-2 text-gray-500 text-xs">/ Data Analytics Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Activity size={12} className="text-emerald-400" />
              {result.meta.totalPathwaysEvaluated}개 경로 분석
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle size={12} className="text-amber-400" />
              {result.meta.hardFilteredOut}개 필터링됨
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 메인 그리드: 사이드 패널 + 콘텐츠 / Main grid: side panel + content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* 좌측 필터 패널 / Left filter panel */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <FilterPanel
              input={input}
              step={step}
              onNext={handleNext}
              onReset={handleReset}
            />
            {step === 5 && !showResults && (
              <button
                onClick={handleAnalyze}
                className="mt-3 w-full py-3 rounded-xl bg-linear-to-br from-cyan-500 to-violet-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                <TrendingUp size={16} />
                분석 실행 / Run Analysis
              </button>
            )}
          </div>

          {/* 우측 대시보드 영역 / Right dashboard area */}
          <div>
            {!showResults ? (
              /* 분석 전 상태 / Pre-analysis state */
              <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-800 rounded-2xl text-gray-600">
                <BarChart2 size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-semibold mb-2">좌측 필터를 설정하세요</p>
                <p className="text-sm text-gray-700">
                  6개 항목 입력 후 분석 결과가 여기에 표시됩니다
                </p>
                <p className="text-xs mt-1 text-gray-700">
                  Complete the 6-step filter panel to run analysis
                </p>
              </div>
            ) : (
              /* 분석 결과 대시보드 / Analysis result dashboard */
              <div className="space-y-6">

                {/* KPI 카드 행 / KPI card row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: '추천 경로',
                      labelEn: 'Pathways',
                      value: result.pathways.length,
                      unit: '개',
                      icon: Map,
                      color: 'text-cyan-400',
                      bg: 'bg-cyan-500/10',
                      border: 'border-cyan-900',
                    },
                    {
                      label: '최고 점수',
                      labelEn: 'Top Score',
                      value: Math.max(...result.pathways.map((p) => p.finalScore)),
                      unit: '점',
                      icon: TrendingUp,
                      color: 'text-emerald-400',
                      bg: 'bg-emerald-500/10',
                      border: 'border-emerald-900',
                    },
                    {
                      label: '최단 기간',
                      labelEn: 'Shortest',
                      value: Math.min(...result.pathways.map((p) => p.estimatedMonths)),
                      unit: '개월',
                      icon: Zap,
                      color: 'text-amber-400',
                      bg: 'bg-amber-500/10',
                      border: 'border-amber-900',
                    },
                    {
                      label: '최저 비용',
                      labelEn: 'Min Cost',
                      value: formatKRW(Math.min(...result.pathways.map((p) => p.estimatedCostWon))),
                      unit: '',
                      icon: DollarSign,
                      color: 'text-violet-400',
                      bg: 'bg-violet-500/10',
                      border: 'border-violet-900',
                    },
                  ].map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                      <div
                        key={kpi.label}
                        className={`${kpi.bg} border ${kpi.border} rounded-xl p-4`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-500 text-xs">{kpi.label}</span>
                          <Icon size={14} className={kpi.color} />
                        </div>
                        <div className={`text-2xl font-black font-mono ${kpi.color}`}>
                          {kpi.value}
                          <span className="text-sm font-normal ml-0.5">{kpi.unit}</span>
                        </div>
                        <div className="text-gray-700 text-xs mt-0.5">{kpi.labelEn}</div>
                      </div>
                    );
                  })}
                </div>

                {/* 차트 탭 패널 / Chart tab panel */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="flex border-b border-gray-800">
                    {(
                      [
                        { id: 'overview', label: '경로 비교', icon: BarChart2 },
                        { id: 'radar', label: '레이더', icon: Activity },
                        { id: 'heatmap', label: '히트맵', icon: PieChart },
                        { id: 'bubble', label: '버블 차트', icon: Circle },
                      ] as const
                    ).map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium border-b-2 transition-all ${
                          activeTab === id
                            ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
                            : 'border-transparent text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        <Icon size={12} />
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {/* 탭: 경로 비교 (수평 바 차트) / Tab: Overview bar chart */}
                    {activeTab === 'overview' && (
                      <div className="space-y-3">
                        <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest">
                          점수 분포 / Score Distribution
                        </p>
                        {result.pathways.map((p, idx) => {
                          const color = getScoreColor(p.finalScore);
                          const isSelected = selectedPathwayId === (mockPathways[idx]?.id || '');
                          return (
                            <div
                              key={p.pathwayId}
                              className={`cursor-pointer p-3 rounded-lg transition-all ${
                                isSelected ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                              }`}
                              onClick={() => setSelectedPathwayId(mockPathways[idx]?.id || '')}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-gray-300 text-xs font-medium truncate max-w-[200px]">
                                  {p.nameKo}
                                </span>
                                <span
                                  className="text-sm font-black font-mono shrink-0 ml-2"
                                  style={{ color }}
                                >
                                  {p.finalScore}
                                </span>
                              </div>
                              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${Math.min(p.finalScore, 100)}%`,
                                    background: `linear-gradient(90deg, ${color}44, ${color})`,
                                  }}
                                />
                              </div>
                              <div className="flex gap-3 mt-1.5 text-gray-600 text-xs">
                                <span>{getFeasibilityEmoji(p.feasibilityLabel)} {p.feasibilityLabel}</span>
                                <span>⏱ {p.estimatedMonths}개월</span>
                                <span>💰 {formatKRW(p.estimatedCostWon)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 탭: 레이더 차트 / Tab: Radar chart */}
                    {activeTab === 'radar' && selectedPathway && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-gray-500 text-xs mb-3 uppercase tracking-widest">
                            {selectedPathway.nameKo} — 지표 레이더
                          </p>
                          <div className="w-full aspect-square max-w-[220px] mx-auto">
                            <RadarChart pathway={selectedPathway} />
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-3 uppercase tracking-widest">
                            Score Breakdown
                          </p>
                          <div className="space-y-2">
                            {[
                              { label: '기본점수', value: selectedPathway.scoreBreakdown.base, max: 100 },
                              { label: '나이 보정', value: Math.round(selectedPathway.scoreBreakdown.ageMultiplier * 100), max: 100 },
                              { label: '국적 보정', value: Math.round(selectedPathway.scoreBreakdown.nationalityMultiplier * 100), max: 100 },
                              { label: '자금 보정', value: Math.round(selectedPathway.scoreBreakdown.fundMultiplier * 100), max: 100 },
                              { label: '우선순위', value: Math.round(selectedPathway.scoreBreakdown.priorityWeight * 100), max: 100 },
                            ].map((item) => (
                              <div key={item.label}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">{item.label}</span>
                                  <span className="text-gray-300 font-mono">{item.value}</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full">
                                  <div
                                    className="h-full bg-cyan-500 rounded-full"
                                    style={{ width: `${item.value}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* 경로 선택 / Pathway selector */}
                          <p className="text-gray-500 text-xs mt-4 mb-2 uppercase tracking-widest">
                            경로 선택 / Select Pathway
                          </p>
                          <div className="space-y-1">
                            {mockPathways.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => setSelectedPathwayId(p.id)}
                                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${
                                  selectedPathwayId === p.id
                                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-800'
                                    : 'text-gray-500 hover:bg-gray-800'
                                }`}
                              >
                                {p.nameKo}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 탭: 히트맵 / Tab: Heatmap */}
                    {activeTab === 'heatmap' && (
                      <div>
                        <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest">
                          지표 히트맵 / Metric Heatmap (값이 클수록 밝음)
                        </p>
                        <ScoreHeatmap pathways={mockPathways} />
                        {/* 히트맵 범례 / Heatmap legend */}
                        <div className="flex items-center gap-1 mt-4">
                          <span className="text-gray-600 text-xs mr-2">낮음</span>
                          {['bg-gray-800', 'bg-indigo-800', 'bg-blue-700', 'bg-cyan-600', 'bg-cyan-400'].map(
                            (cls) => (
                              <div key={cls} className={`${cls} w-6 h-4 rounded`} />
                            )
                          )}
                          <span className="text-gray-600 text-xs ml-2">높음</span>
                        </div>
                      </div>
                    )}

                    {/* 탭: 버블 차트 / Tab: Bubble chart */}
                    {activeTab === 'bubble' && (
                      <div>
                        <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest">
                          기간 vs 점수 vs 비용 / Duration vs Score vs Cost
                        </p>
                        <BubbleChart
                          pathways={mockPathways}
                          onSelect={setSelectedPathwayId}
                          selectedId={selectedPathwayId}
                        />
                        <p className="text-gray-700 text-xs text-center mt-2">
                          버블 클릭으로 경로 선택 / Click bubble to select pathway
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 경로 카드 목록 / Pathway card list */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-bold flex items-center gap-2">
                      <Layers size={16} className="text-cyan-400" />
                      추천 경로 상세 / Recommended Pathways
                    </h2>
                    <span className="text-gray-600 text-xs">
                      {result.pathways.length}개 / {result.meta.totalPathwaysEvaluated}개 분석 완료
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPathways.map((p, idx) => (
                      <PathwayCard
                        key={p.id}
                        pathway={p}
                        rank={idx + 1}
                        isSelected={selectedPathwayId === p.id}
                        onClick={() => setSelectedPathwayId(p.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* 푸터 메타 정보 / Footer meta info */}
                <div className="border-t border-gray-800 pt-4 flex items-center justify-between text-xs text-gray-700">
                  <span>
                    분석 시각: {new Date(result.meta.timestamp).toLocaleString('ko-KR')}
                  </span>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 hover:text-gray-500 transition-colors"
                  >
                    <RefreshCw size={12} />
                    다시 진단하기 / Re-diagnose
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
