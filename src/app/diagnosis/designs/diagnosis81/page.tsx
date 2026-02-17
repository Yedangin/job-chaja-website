'use client';

// 포토 에디터 스타일 비자 진단 페이지 / Photo Editor style visa diagnosis page
// Adobe Photoshop/Lightroom UI 컨셉 — 레이어 패널, 도구 팔레트, 캔버스
// Adobe dark UI concept — layer panels, tool palette, canvas area

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
  Layers,
  Square,
  Circle,
  Pen,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Sliders,
  Palette,
  Image,
  Download,
  Share2,
  History,
  Star,
  AlertCircle,
  Info,
  Maximize2,
  Grid,
  Move,
  Eraser,
  PenTool,
  Filter,
  Camera,
} from 'lucide-react';

// ============================================================
// 진단 단계 타입 / Diagnosis step type
// ============================================================
type DiagnosisStep =
  | 'nationality'
  | 'age'
  | 'educationLevel'
  | 'availableAnnualFund'
  | 'finalGoal'
  | 'priorityPreference'
  | 'result';

// 레이어 타입 / Layer type
interface Layer {
  id: string;
  name: string;
  nameEn: string;
  stepKey: DiagnosisStep;
  icon: React.ReactNode;
  visible: boolean;
  locked: boolean;
  filled: boolean;
  color: string;
}

// ============================================================
// 도구 팔레트 아이콘 목록 / Tool palette icons list
// ============================================================
const TOOL_PALETTE = [
  { icon: <Move size={14} />, label: '이동' },
  { icon: <Crop size={14} />, label: '자르기' },
  { icon: <PenTool size={14} />, label: '펜' },
  { icon: <Eraser size={14} />, label: '지우개' },
  { icon: <Square size={14} />, label: '사각형' },
  { icon: <Circle size={14} />, label: '원형' },
  { icon: <Filter size={14} />, label: '필터' },
  { icon: <ZoomIn size={14} />, label: '확대' },
];

// ============================================================
// 레이어 기본 정의 / Default layer definitions
// 각 입력 단계 = 하나의 레이어 / Each input step = one layer
// ============================================================
const DEFAULT_LAYERS: Layer[] = [
  {
    id: 'layer-priority',
    name: '우선순위',
    nameEn: 'Priority',
    stepKey: 'priorityPreference',
    icon: <Star size={12} />,
    visible: true,
    locked: false,
    filled: false,
    color: '#a855f7',
  },
  {
    id: 'layer-goal',
    name: '최종 목표',
    nameEn: 'Final Goal',
    stepKey: 'finalGoal',
    icon: <Camera size={12} />,
    visible: true,
    locked: false,
    filled: false,
    color: '#3b82f6',
  },
  {
    id: 'layer-fund',
    name: '자금',
    nameEn: 'Available Fund',
    stepKey: 'availableAnnualFund',
    icon: <Layers size={12} />,
    visible: true,
    locked: false,
    filled: false,
    color: '#10b981',
  },
  {
    id: 'layer-education',
    name: '학력',
    nameEn: 'Education',
    stepKey: 'educationLevel',
    icon: <Grid size={12} />,
    visible: true,
    locked: false,
    filled: false,
    color: '#f59e0b',
  },
  {
    id: 'layer-age',
    name: '나이',
    nameEn: 'Age',
    stepKey: 'age',
    icon: <Circle size={12} />,
    visible: true,
    locked: false,
    filled: false,
    color: '#ef4444',
  },
  {
    id: 'layer-nationality',
    name: '국적',
    nameEn: 'Nationality',
    stepKey: 'nationality',
    icon: <Image size={12} />,
    visible: true,
    locked: true,
    filled: false,
    color: '#06b6d4',
  },
];

// 단계 순서 / Step order
const STEP_ORDER: DiagnosisStep[] = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
];

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis81Page() {
  // 현재 활성 단계 / Current active step
  const [currentStep, setCurrentStep] = useState<DiagnosisStep>('nationality');
  // 입력 데이터 / Input data
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 결과 표시 여부 / Show result
  const [showResult, setShowResult] = useState(false);
  // 레이어 상태 / Layer states
  const [layers, setLayers] = useState<Layer[]>(DEFAULT_LAYERS);
  // 활성 레이어 / Active layer
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-nationality');
  // 선택된 경로 / Selected pathway
  const [selectedPathway, setSelectedPathway] = useState<CompatPathway | null>(null);
  // 히스토리 패널 열림 / History panel open
  const [historyOpen, setHistoryOpen] = useState(false);
  // 조정 패널 열림 / Adjustments panel open
  const [adjustmentsOpen, setAdjustmentsOpen] = useState(true);
  // 레이어 패널 열림 / Layers panel open
  const [layerPanelOpen, setLayerPanelOpen] = useState(true);
  // 확대율 / Zoom level
  const [zoom, setZoom] = useState(100);
  // 선택된 도구 / Selected tool
  const [activeTool, setActiveTool] = useState(0);
  // 히스토리 동작 목록 / History action list
  const [historyActions, setHistoryActions] = useState<string[]>(['새 문서 열기 / Open new document']);

  // ============================================================
  // 레이어 filled 업데이트 / Update layer filled state
  // ============================================================
  function markLayerFilled(stepKey: DiagnosisStep) {
    setLayers((prev) =>
      prev.map((l) => (l.stepKey === stepKey ? { ...l, filled: true } : l))
    );
  }

  // ============================================================
  // 값 선택 처리 / Handle value selection
  // ============================================================
  function handleSelect(field: keyof DiagnosisInput, value: string | number) {
    setInput((prev) => ({ ...prev, [field]: value }));
    markLayerFilled(field as DiagnosisStep);
    setHistoryActions((prev) => [
      ...prev,
      `레이어 수정: ${field} / Layer edit: ${field}`,
    ]);

    // 다음 단계로 이동 / Move to next step
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      setCurrentStep(nextStep);
      // 다음 레이어 활성화 / Activate next layer
      const nextLayer = DEFAULT_LAYERS.find((l) => l.stepKey === nextStep);
      if (nextLayer) setActiveLayerId(nextLayer.id);
    }
  }

  // ============================================================
  // 진단 실행 / Run diagnosis
  // ============================================================
  function handleRender() {
    setHistoryActions((prev) => [...prev, '이미지 렌더링 / Render image']);
    setShowResult(true);
    setCurrentStep('result');
    // 모든 레이어 잠금 해제 / Unlock all layers
    setLayers((prev) => prev.map((l) => ({ ...l, locked: false, visible: true })));
  }

  // ============================================================
  // 레이어 토글 / Toggle layer visibility
  // ============================================================
  function toggleLayerVisibility(id: string) {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }

  // ============================================================
  // 레이어 잠금 토글 / Toggle layer lock
  // ============================================================
  function toggleLayerLock(id: string) {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l))
    );
  }

  // ============================================================
  // 현재 단계 데이터 표시 명칭 / Display name for current step value
  // ============================================================
  function getDisplayValue(field: keyof DiagnosisInput): string {
    const val = input[field];
    if (val === undefined) return '—';
    if (field === 'nationality') {
      return popularCountries.find((c) => c.code === val)?.nameKo ?? String(val);
    }
    if (field === 'educationLevel') {
      return educationOptions.find((e) => e.value === val)?.labelKo ?? String(val);
    }
    if (field === 'finalGoal') {
      return goalOptions.find((g) => g.value === val)?.labelKo ?? String(val);
    }
    if (field === 'priorityPreference') {
      return priorityOptions.find((p) => p.value === val)?.labelKo ?? String(val);
    }
    if (field === 'availableAnnualFund') {
      return fundOptions.find((f) => f.value === val)?.labelKo ?? String(val);
    }
    return String(val);
  }

  // ============================================================
  // 입력 완료 여부 / Check if all inputs done
  // ============================================================
  const allInputsDone = STEP_ORDER.every((step) => {
    if (step === 'age') return input.age !== undefined;
    return input[step as keyof DiagnosisInput] !== undefined;
  });

  // 완성된 레이어 수 / Number of filled layers
  const filledCount = layers.filter((l) => l.filled).length;

  // ============================================================
  // 렌더링 / Render
  // ============================================================
  return (
    // Adobe 다크 테마 최상위 컨테이너 / Adobe dark theme root container
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs overflow-hidden select-none">

      {/* ===== 메뉴바 / Menu bar ===== */}
      <header className="flex items-center h-8 bg-[#323232] border-b border-[#464646] px-3 shrink-0 z-50">
        <div className="flex items-center gap-1 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e] cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#28c840] cursor-pointer" />
        </div>
        <span className="text-[#a0a0a0] mr-6 text-[10px]">JobChaJa Visa Editor</span>
        {['파일', '편집', '이미지', '레이어', '선택', '필터', '보기', '도움말'].map((menu) => (
          <button
            key={menu}
            className="px-2 py-0.5 text-[10px] text-[#b0b0b0] hover:bg-[#4a4a4a] rounded"
          >
            {menu}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-[#888]">비자 경로도.psd @ {zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 25))}
            className="p-0.5 hover:bg-[#4a4a4a] rounded text-[#888]"
          >
            <ZoomIn size={11} />
          </button>
          <span className="text-[10px] text-[#666]">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.max(25, z - 25))}
            className="p-0.5 hover:bg-[#4a4a4a] rounded text-[#888]"
          >
            <ZoomOut size={11} />
          </button>
        </div>
      </header>

      {/* ===== 옵션 바 / Options bar ===== */}
      <div className="flex items-center h-7 bg-[#2c2c2c] border-b border-[#404040] px-3 gap-4 shrink-0">
        <span className="text-[10px] text-[#0073c4] font-bold">
          {TOOL_PALETTE[activeTool]?.label} 도구 활성
        </span>
        <div className="w-px h-4 bg-[#464646]" />
        <span className="text-[10px] text-[#888]">
          레이어: {layers.find((l) => l.id === activeLayerId)?.name ?? '—'}
        </span>
        <div className="w-px h-4 bg-[#464646]" />
        <span className="text-[10px] text-[#888]">
          완성도: {filledCount}/{layers.length} 레이어
        </span>
        <div className="ml-auto flex items-center gap-2">
          {allInputsDone && !showResult && (
            <button
              onClick={handleRender}
              className="flex items-center gap-1.5 px-3 py-0.5 bg-[#0073c4] hover:bg-[#0082d8] text-white text-[10px] rounded font-bold transition-colors"
            >
              <Camera size={11} />
              렌더링 / Render
            </button>
          )}
          {showResult && (
            <button
              onClick={() => {
                setShowResult(false);
                setCurrentStep('nationality');
                setInput({});
                setLayers(DEFAULT_LAYERS);
                setHistoryActions(['새 문서 열기 / Open new document']);
              }}
              className="flex items-center gap-1 px-2 py-0.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-[#ccc] text-[10px] rounded"
            >
              <RotateCcw size={10} />
              재시작
            </button>
          )}
        </div>
      </div>

      {/* ===== 메인 작업 영역 / Main workspace ===== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===== 도구 팔레트 (좌측) / Tool palette (left) ===== */}
        <aside className="w-10 bg-[#252525] border-r border-[#3a3a3a] flex flex-col items-center py-2 gap-1 shrink-0">
          {TOOL_PALETTE.map((tool, i) => (
            <button
              key={i}
              onClick={() => setActiveTool(i)}
              title={tool.label}
              className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                activeTool === i
                  ? 'bg-[#0073c4] text-white'
                  : 'text-[#888] hover:bg-[#3a3a3a] hover:text-[#ccc]'
              }`}
            >
              {tool.icon}
            </button>
          ))}
          <div className="w-6 h-px bg-[#464646] my-1" />
          {/* 전경/배경 색상 / Foreground/background color */}
          <div className="relative w-7 h-7">
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#1e1e1e] border border-[#666] rounded-sm" />
            <div className="absolute top-0 left-0 w-4 h-4 bg-[#0073c4] border border-[#888] rounded-sm" />
          </div>
        </aside>

        {/* ===== 캔버스 영역 / Canvas area ===== */}
        <main className="flex-1 bg-[#404040] overflow-auto relative">
          {/* 격자 배경 / Grid background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(#555 1px, transparent 1px), linear-gradient(90deg, #555 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* 캔버스 내용 / Canvas content */}
          <div className="relative min-h-full p-6 flex items-start justify-center">
            <div
              className="relative bg-[#1a1a2e] rounded border border-[#3a3a5c] shadow-2xl overflow-hidden"
              style={{
                width: `${Math.min(100, zoom)}%`,
                minWidth: 480,
                maxWidth: 720,
                minHeight: 520,
              }}
            >
              {/* 캔버스 상단 탭 / Canvas top tab */}
              <div className="flex items-center h-7 bg-[#252540] border-b border-[#3a3a6a] px-3 gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0073c4]" />
                <span className="text-[10px] text-[#6a8bc4]">비자 경로도.psd</span>
                <span className="text-[10px] text-[#555]">RGB/8</span>
                <div className="ml-auto text-[10px] text-[#444]">
                  {filledCount}/{layers.length} 레이어 완성
                </div>
              </div>

              {/* ===== 입력 캔버스 콘텐츠 / Input canvas content ===== */}
              {!showResult ? (
                <div className="p-6">
                  {/* 진행 시각화 — 레이어 스택 미리보기 / Progress visualization — layer stack preview */}
                  <div className="flex items-center gap-2 mb-6">
                    <Maximize2 size={12} className="text-[#0073c4]" />
                    <span className="text-[10px] text-[#6a8bc4] uppercase tracking-widest">
                      레이어 구성 중 / Building layers
                    </span>
                  </div>

                  {/* 현재 단계 입력 패널 / Current step input panel */}
                  <div className="bg-[#0d1020] border border-[#2a2a50] rounded-lg p-5">
                    {/* 단계 제목 / Step title */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            layers.find((l) => l.stepKey === currentStep)?.color ?? '#0073c4',
                        }}
                      />
                      <span className="text-[11px] text-[#8888cc] uppercase tracking-widest">
                        {layers.find((l) => l.stepKey === currentStep)?.nameEn ?? currentStep}
                        {' / '}
                        {layers.find((l) => l.stepKey === currentStep)?.name ?? currentStep}
                      </span>
                      <span className="ml-auto text-[10px] text-[#555]">
                        {STEP_ORDER.indexOf(currentStep) + 1} / {STEP_ORDER.length}
                      </span>
                    </div>

                    {/* ===== 국적 선택 / Nationality selection ===== */}
                    {currentStep === 'nationality' && (
                      <div>
                        <p className="text-[11px] text-[#aaa] mb-3">
                          출신 국가를 선택하세요 / Select your nationality
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {popularCountries.map((c) => (
                            <button
                              key={c.code}
                              onClick={() => handleSelect('nationality', c.code)}
                              className={`flex items-center gap-2 p-2 rounded border transition-all text-left ${
                                input.nationality === c.code
                                  ? 'border-[#0073c4] bg-[#001830] text-white'
                                  : 'border-[#2a2a50] hover:border-[#4a4a80] text-[#aaa] hover:text-[#ccc]'
                              }`}
                            >
                              <span className="text-base">{c.flag}</span>
                              <span className="text-[10px]">{c.nameKo}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ===== 나이 입력 / Age input ===== */}
                    {currentStep === 'age' && (
                      <div>
                        <p className="text-[11px] text-[#aaa] mb-3">
                          현재 나이 / Your current age
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <button
                            onClick={() =>
                              setInput((prev) => ({
                                ...prev,
                                age: Math.max(15, (prev.age ?? 24) - 1),
                              }))
                            }
                            className="w-8 h-8 flex items-center justify-center rounded bg-[#1a1a3a] border border-[#3a3a6a] hover:bg-[#2a2a5a] text-[#888]"
                          >
                            <Minus size={12} />
                          </button>
                          <div className="flex-1 text-center">
                            <span className="text-3xl font-bold text-[#0073c4]">
                              {input.age ?? 24}
                            </span>
                            <span className="text-[#666] ml-2 text-sm">세</span>
                          </div>
                          <button
                            onClick={() =>
                              setInput((prev) => ({
                                ...prev,
                                age: Math.min(65, (prev.age ?? 24) + 1),
                              }))
                            }
                            className="w-8 h-8 flex items-center justify-center rounded bg-[#1a1a3a] border border-[#3a3a6a] hover:bg-[#2a2a5a] text-[#888]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        {/* 나이 슬라이더 / Age slider */}
                        <input
                          type="range"
                          min={15}
                          max={65}
                          value={input.age ?? 24}
                          onChange={(e) =>
                            setInput((prev) => ({ ...prev, age: Number(e.target.value) }))
                          }
                          className="w-full accent-[#0073c4] cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-[#555] mt-1">
                          <span>15세</span>
                          <span>40세</span>
                          <span>65세</span>
                        </div>
                        <button
                          onClick={() => handleSelect('age', input.age ?? 24)}
                          className="mt-4 w-full py-2 bg-[#0073c4] hover:bg-[#0082d8] text-white text-[11px] rounded font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <Check size={12} />
                          레이어 적용 / Apply Layer
                        </button>
                      </div>
                    )}

                    {/* ===== 학력 선택 / Education selection ===== */}
                    {currentStep === 'educationLevel' && (
                      <div>
                        <p className="text-[11px] text-[#aaa] mb-3">
                          최종 학력 / Education level
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {educationOptions.map((e) => (
                            <button
                              key={e.value}
                              onClick={() => handleSelect('educationLevel', e.value)}
                              className={`flex items-center gap-2 p-2.5 rounded border transition-all text-left ${
                                input.educationLevel === e.value
                                  ? 'border-[#f59e0b] bg-[#1a1000] text-white'
                                  : 'border-[#2a2a50] hover:border-[#4a4a20] text-[#aaa] hover:text-[#ccc]'
                              }`}
                            >
                              <span className="text-sm">{e.emoji}</span>
                              <span className="text-[10px]">{e.labelKo}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ===== 자금 선택 / Fund selection ===== */}
                    {currentStep === 'availableAnnualFund' && (
                      <div>
                        <p className="text-[11px] text-[#aaa] mb-3">
                          연간 가용 자금 / Annual available fund
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {fundOptions.map((f) => (
                            <button
                              key={f.value}
                              onClick={() => handleSelect('availableAnnualFund', f.value)}
                              className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                                input.availableAnnualFund === f.value
                                  ? 'border-[#10b981] bg-[#001a10] text-white'
                                  : 'border-[#2a2a50] hover:border-[#1a4a30] text-[#aaa] hover:text-[#ccc]'
                              }`}
                            >
                              <span className="text-[10px]">{f.labelKo}</span>
                              <span className="text-[9px] text-[#555]">{f.labelEn}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ===== 목표 선택 / Goal selection ===== */}
                    {currentStep === 'finalGoal' && (
                      <div>
                        <p className="text-[11px] text-[#aaa] mb-3">
                          최종 목표 / Final goal
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {goalOptions.map((g) => (
                            <button
                              key={g.value}
                              onClick={() => handleSelect('finalGoal', g.value)}
                              className={`p-3 rounded border transition-all text-center ${
                                input.finalGoal === g.value
                                  ? 'border-[#3b82f6] bg-[#001030] text-white'
                                  : 'border-[#2a2a50] hover:border-[#3a3a80] text-[#aaa] hover:text-[#ccc]'
                              }`}
                            >
                              <div className="text-xl mb-1">{g.emoji}</div>
                              <div className="text-[10px] font-bold">{g.labelKo}</div>
                              <div className="text-[9px] text-[#666] mt-0.5">{g.descKo}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ===== 우선순위 선택 / Priority selection ===== */}
                    {currentStep === 'priorityPreference' && (
                      <div>
                        <p className="text-[11px] text-[#aaa] mb-3">
                          우선순위 / Priority preference
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {priorityOptions.map((p) => (
                            <button
                              key={p.value}
                              onClick={() => handleSelect('priorityPreference', p.value)}
                              className={`p-3 rounded border transition-all text-center ${
                                input.priorityPreference === p.value
                                  ? 'border-[#a855f7] bg-[#100020] text-white'
                                  : 'border-[#2a2a50] hover:border-[#5a2a8a] text-[#aaa] hover:text-[#ccc]'
                              }`}
                            >
                              <div className="text-xl mb-1">{p.emoji}</div>
                              <div className="text-[10px] font-bold">{p.labelKo}</div>
                              <div className="text-[9px] text-[#666] mt-0.5">{p.descKo}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 레이어 스택 미리보기 / Layer stack preview */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers size={11} className="text-[#555]" />
                      <span className="text-[9px] text-[#555] uppercase tracking-widest">
                        레이어 스택 / Layer stack
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...DEFAULT_LAYERS].reverse().map((layer) => (
                        <div
                          key={layer.id}
                          title={layer.nameEn}
                          className={`flex-1 h-2 rounded-sm transition-all ${
                            layer.filled ? 'opacity-100' : 'opacity-20'
                          }`}
                          style={{ backgroundColor: layer.color }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[8px] text-[#444] mt-0.5">
                      <span>국적</span>
                      <span>렌더링</span>
                    </div>
                  </div>
                </div>
              ) : (
                // ===== 결과 캔버스 / Result canvas =====
                <div className="p-5">
                  {/* 완성 이미지 헤더 / Completed image header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    <span className="text-[11px] text-[#4ade80] uppercase tracking-widest">
                      렌더링 완료 / Render complete
                    </span>
                    <span className="ml-auto text-[9px] text-[#555]">
                      {mockDiagnosisResult.meta.totalPathwaysEvaluated}개 경로 분석됨
                    </span>
                  </div>

                  {/* 경로 카드 그리드 / Pathway cards grid */}
                  <div className="flex flex-col gap-2">
                    {mockPathways.map((pathway, idx) => (
                      <button
                        key={pathway.id}
                        onClick={() =>
                          setSelectedPathway(selectedPathway?.id === pathway.id ? null : pathway)
                        }
                        className={`w-full text-left p-3 rounded border transition-all ${
                          selectedPathway?.id === pathway.id
                            ? 'border-[#0073c4] bg-[#001830]'
                            : 'border-[#2a2a50] hover:border-[#4a4a80] bg-[#0d1020]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {/* 레이어 썸네일 / Layer thumbnail */}
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center shrink-0 text-white font-bold text-[11px]"
                            style={{
                              backgroundColor: getScoreColor(pathway.finalScore),
                              opacity: 0.9,
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#ccc] font-bold truncate">
                                {pathway.nameKo}
                              </span>
                              <span className="shrink-0 text-[9px] text-[#666]">
                                {getFeasibilityEmoji(pathway.feasibilityLabel)}{' '}
                                {pathway.feasibilityLabel}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {/* 비자 체인 칩 / Visa chain chips */}
                              <div className="flex gap-1 flex-wrap">
                                {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).slice(0, 3).map((v) => (
                                  <span
                                    key={v.code}
                                    className="px-1 py-0.5 rounded text-[8px] bg-[#1a2a4a] text-[#6a9fd4] border border-[#2a3a6a]"
                                  >
                                    {v.code}
                                  </span>
                                ))}
                                {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length > 3 && (
                                  <span className="text-[8px] text-[#555]">
                                    +{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* 점수 바 / Score bar */}
                          <div className="shrink-0 text-right">
                            <div
                              className="text-sm font-bold"
                              style={{ color: getScoreColor(pathway.finalScore) }}
                            >
                              {pathway.finalScore}
                            </div>
                            <div className="text-[8px] text-[#555]">
                              {pathway.estimatedMonths}개월
                            </div>
                          </div>
                          <ChevronRight
                            size={12}
                            className={`text-[#555] transition-transform ${
                              selectedPathway?.id === pathway.id ? 'rotate-90' : ''
                            }`}
                          />
                        </div>

                        {/* 확장 상세 / Expanded details */}
                        {selectedPathway?.id === pathway.id && (
                          <div
                            className="mt-3 pt-3 border-t border-[#2a2a50]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* 점수 분해 막대 / Score breakdown bars */}
                            <div className="mb-3">
                              <p className="text-[9px] text-[#666] mb-1.5 uppercase tracking-wider">
                                레이어 기여도 / Layer contribution
                              </p>
                              {[
                                { label: '기본 점수', key: 'base', value: pathway.scoreBreakdown.base, max: 100 },
                                { label: '나이 배율', key: 'age', value: Math.round(pathway.scoreBreakdown.ageMultiplier * 100), max: 100 },
                                { label: '국적 배율', key: 'nat', value: Math.round(pathway.scoreBreakdown.nationalityMultiplier * 100), max: 100 },
                                { label: '자금 배율', key: 'fund', value: Math.round(pathway.scoreBreakdown.fundMultiplier * 100), max: 100 },
                                { label: '학력 배율', key: 'edu', value: Math.round(pathway.scoreBreakdown.educationMultiplier * 100), max: 100 },
                              ].map((bar) => (
                                <div key={bar.key} className="flex items-center gap-2 mb-1">
                                  <span className="text-[8px] text-[#666] w-16 shrink-0">{bar.label}</span>
                                  <div className="flex-1 h-1.5 bg-[#1a1a3a] rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-linear-to-r from-[#0073c4] to-[#00b4ff] transition-all"
                                      style={{ width: `${bar.value}%` }}
                                    />
                                  </div>
                                  <span className="text-[8px] text-[#888] w-6 text-right shrink-0">
                                    {bar.value}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* 마일스톤 타임라인 / Milestone timeline */}
                            <p className="text-[9px] text-[#666] mb-1.5 uppercase tracking-wider">
                              타임라인 / Timeline
                            </p>
                            <div className="relative pl-3">
                              <div className="absolute left-1 top-0 bottom-0 w-px bg-[#2a2a50]" />
                              {pathway.milestones.map((ms) => (
                                <div key={ms.order} className="relative mb-2 flex gap-2">
                                  <div className="absolute -left-2 top-1 w-1.5 h-1.5 rounded-full bg-[#0073c4] shrink-0" />
                                  <div>
                                    <div className="text-[9px] text-[#0073c4] font-bold">
                                      M+{ms.monthFromStart}
                                    </div>
                                    <div className="text-[9px] text-[#bbb]">{ms.nameKo}</div>
                                    {ms.visaStatus && ms.visaStatus !== 'none' && (
                                      <span className="text-[8px] px-1 py-0.5 bg-[#001830] border border-[#0073c4] text-[#0073c4] rounded">
                                        {ms.visaStatus}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* 비용 + 플랫폼 지원 / Cost + platform support */}
                            <div className="flex gap-3 mt-3 pt-2 border-t border-[#2a2a50]">
                              <div>
                                <p className="text-[8px] text-[#555]">예상 비용</p>
                                <p className="text-[10px] text-[#f59e0b] font-bold">
                                  {pathway.estimatedCostWon > 0
                                    ? `${pathway.estimatedCostWon.toLocaleString()}만원`
                                    : '무료'}
                                </p>
                              </div>
                              <div>
                                <p className="text-[8px] text-[#555]">플랫폼 지원</p>
                                <p className="text-[10px] text-[#10b981] font-bold">
                                  {pathway.platformSupport === 'full_support'
                                    ? '완전 지원'
                                    : pathway.platformSupport === 'info_only'
                                    ? '정보 제공'
                                    : '비자 처리'}
                                </p>
                              </div>
                              <div className="ml-auto">
                                <p className="text-[8px] text-[#555]">기간</p>
                                <p className="text-[10px] text-[#6a9fd4] font-bold">
                                  {pathway.estimatedMonths}개월
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* 입력 요약 / Input summary */}
                  <div className="mt-4 pt-3 border-t border-[#2a2a50]">
                    <p className="text-[9px] text-[#555] mb-2 uppercase tracking-wider">
                      레이어 속성 / Layer properties
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          ['국적', getDisplayValue('nationality')],
                          ['나이', getDisplayValue('age') + '세'],
                          ['학력', getDisplayValue('educationLevel')],
                          ['자금', getDisplayValue('availableAnnualFund')],
                          ['목표', getDisplayValue('finalGoal')],
                          ['우선', getDisplayValue('priorityPreference')],
                        ] as [string, string][]
                      ).map(([label, val]) => (
                        <div key={label} className="bg-[#0a0a1a] rounded p-1.5 border border-[#1a1a3a]">
                          <p className="text-[8px] text-[#555]">{label}</p>
                          <p className="text-[9px] text-[#aaa] truncate">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ===== 우측 패널 영역 / Right panel area ===== */}
        <aside className="w-56 bg-[#252525] border-l border-[#3a3a3a] flex flex-col shrink-0 overflow-hidden">

          {/* ===== 조정 패널 / Adjustments panel ===== */}
          <div className="border-b border-[#3a3a3a]">
            <button
              onClick={() => setAdjustmentsOpen(!adjustmentsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#2e2e2e] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sliders size={11} className="text-[#0073c4]" />
                <span className="text-[10px] text-[#ccc]">속성 / Properties</span>
              </div>
              {adjustmentsOpen ? (
                <ChevronUp size={10} className="text-[#666]" />
              ) : (
                <ChevronDown size={10} className="text-[#666]" />
              )}
            </button>

            {adjustmentsOpen && (
              <div className="px-3 pb-3">
                {/* 입력 요약 칩 / Input summary chips */}
                <div className="flex flex-col gap-1">
                  {[
                    { label: '국적', field: 'nationality' as keyof DiagnosisInput, color: '#06b6d4' },
                    { label: '나이', field: 'age' as keyof DiagnosisInput, color: '#ef4444' },
                    { label: '학력', field: 'educationLevel' as keyof DiagnosisInput, color: '#f59e0b' },
                    { label: '자금', field: 'availableAnnualFund' as keyof DiagnosisInput, color: '#10b981' },
                    { label: '목표', field: 'finalGoal' as keyof DiagnosisInput, color: '#3b82f6' },
                    { label: '우선순위', field: 'priorityPreference' as keyof DiagnosisInput, color: '#a855f7' },
                  ].map((item) => {
                    const val = getDisplayValue(item.field);
                    const filled = val !== '—';
                    return (
                      <div
                        key={item.field}
                        className="flex items-center gap-2 py-1 px-2 rounded bg-[#1e1e1e]"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: filled ? item.color : '#444' }}
                        />
                        <span className="text-[9px] text-[#666] w-12 shrink-0">{item.label}</span>
                        <span
                          className="text-[9px] truncate"
                          style={{ color: filled ? '#ccc' : '#444' }}
                        >
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 렌더링 버튼 / Render button */}
                {allInputsDone && !showResult && (
                  <button
                    onClick={handleRender}
                    className="mt-2 w-full py-1.5 bg-[#0073c4] hover:bg-[#0082d8] text-white text-[10px] rounded font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Camera size={10} />
                    렌더링
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ===== 레이어 패널 / Layers panel ===== */}
          <div className="border-b border-[#3a3a3a] flex-1 overflow-hidden flex flex-col">
            <button
              onClick={() => setLayerPanelOpen(!layerPanelOpen)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#2e2e2e] transition-colors shrink-0"
            >
              <div className="flex items-center gap-2">
                <Layers size={11} className="text-[#0073c4]" />
                <span className="text-[10px] text-[#ccc]">레이어 / Layers</span>
              </div>
              {layerPanelOpen ? (
                <ChevronUp size={10} className="text-[#666]" />
              ) : (
                <ChevronDown size={10} className="text-[#666]" />
              )}
            </button>

            {layerPanelOpen && (
              <div className="flex-1 overflow-y-auto">
                {/* 레이어 목록 (Photoshop 레이어 패널처럼) / Layer list (like Photoshop layers panel) */}
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() => {
                      setActiveLayerId(layer.id);
                      if (!showResult && !layer.locked) {
                        setCurrentStep(layer.stepKey);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 cursor-pointer transition-colors border-b border-[#2a2a2a] ${
                      activeLayerId === layer.id
                        ? 'bg-[#2a3a5a] border-l-2 border-l-[#0073c4]'
                        : 'hover:bg-[#2e2e2e]'
                    }`}
                  >
                    {/* 레이어 썸네일 / Layer thumbnail */}
                    <div
                      className="w-6 h-6 rounded-sm border border-[#3a3a3a] flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: layer.filled
                          ? `${layer.color}33`
                          : '#1a1a1a',
                        borderColor: layer.filled ? layer.color : '#3a3a3a',
                      }}
                    >
                      <div style={{ color: layer.filled ? layer.color : '#444' }}>
                        {layer.icon}
                      </div>
                    </div>

                    {/* 레이어 이름 / Layer name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-[#ccc] truncate">{layer.name}</p>
                      <p className="text-[8px] text-[#555] truncate">{layer.nameEn}</p>
                    </div>

                    {/* 레이어 컨트롤 / Layer controls */}
                    <div className="flex gap-0.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(layer.id);
                        }}
                        className="p-0.5 rounded hover:bg-[#3a3a3a] text-[#555] hover:text-[#aaa]"
                      >
                        {layer.visible ? <Eye size={9} /> : <EyeOff size={9} />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerLock(layer.id);
                        }}
                        className="p-0.5 rounded hover:bg-[#3a3a3a] text-[#555] hover:text-[#aaa]"
                      >
                        {layer.locked ? <Lock size={9} /> : <Unlock size={9} />}
                      </button>
                    </div>

                    {/* 채워짐 표시 / Filled indicator */}
                    {layer.filled && (
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== 히스토리 패널 / History panel ===== */}
          <div className="border-t border-[#3a3a3a]">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#2e2e2e] transition-colors"
            >
              <div className="flex items-center gap-2">
                <History size={11} className="text-[#0073c4]" />
                <span className="text-[10px] text-[#ccc]">히스토리 / History</span>
              </div>
              {historyOpen ? (
                <ChevronUp size={10} className="text-[#666]" />
              ) : (
                <ChevronDown size={10} className="text-[#666]" />
              )}
            </button>

            {historyOpen && (
              <div className="max-h-28 overflow-y-auto px-2 pb-2">
                {historyActions.map((action, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 py-0.5 px-1 rounded ${
                      i === historyActions.length - 1
                        ? 'bg-[#2a3a5a]'
                        : 'hover:bg-[#2e2e2e]'
                    }`}
                  >
                    <RotateCcw size={8} className="text-[#555] shrink-0" />
                    <span className="text-[8px] text-[#888] truncate">{action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ===== 상태 바 / Status bar ===== */}
      <footer className="flex items-center h-6 bg-[#1e1e1e] border-t border-[#3a3a3a] px-3 gap-4 shrink-0">
        <span className="text-[9px] text-[#555]">
          문서: 1200 × 800px
        </span>
        <div className="w-px h-3 bg-[#3a3a3a]" />
        <span className="text-[9px] text-[#555]">
          색상: RGB
        </span>
        <div className="w-px h-3 bg-[#3a3a3a]" />
        <span className="text-[9px] text-[#555]">
          {filledCount}/{layers.length} 레이어 완성
        </span>
        <div className="ml-auto flex items-center gap-3">
          {showResult && (
            <>
              <button className="flex items-center gap-1 text-[9px] text-[#888] hover:text-[#ccc]">
                <Share2 size={9} />
                공유
              </button>
              <button className="flex items-center gap-1 text-[9px] text-[#888] hover:text-[#ccc]">
                <Download size={9} />
                내보내기
              </button>
            </>
          )}
          <span className="text-[9px] text-[#0073c4]">JobChaJa Visa Editor v81</span>
        </div>
      </footer>
    </div>
  );
}
