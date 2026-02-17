'use client';

// KOR: 타임머신 비자 진단 페이지 — 미래 시뮬레이션 스타일
// ENG: Time Machine visa diagnosis page — Future simulation style
// Design #99: Time Machine | 타임머신

import { useState, useCallback } from 'react';
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  Play,
  RotateCcw,
  Zap,
  Target,
  Calendar,
  TrendingUp,
  Star,
  Globe,
  BookOpen,
  DollarSign,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  Rewind,
  FastForward,
} from 'lucide-react';
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

// KOR: 진단 단계 정의 타입
// ENG: Diagnosis step definition type
type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// KOR: 각 진단 단계의 메타데이터 정의
// ENG: Metadata for each diagnosis step
const STEPS: { key: StepKey; label: string; labelEn: string; icon: typeof Globe; era: string }[] = [
  { key: 'nationality', label: '출신 국가', labelEn: 'Nationality', icon: Globe, era: '2024' },
  { key: 'age', label: '나이', labelEn: 'Age', icon: Calendar, era: '2025' },
  { key: 'educationLevel', label: '학력', labelEn: 'Education', icon: BookOpen, era: '2026' },
  { key: 'availableAnnualFund', label: '연간 가용 자금', labelEn: 'Annual Fund', icon: DollarSign, era: '2027' },
  { key: 'finalGoal', label: '최종 목표', labelEn: 'Final Goal', icon: Target, era: '2028' },
  { key: 'priorityPreference', label: '우선순위', labelEn: 'Priority', icon: Star, era: '2029' },
];

// KOR: 시간 연도 마커 — 타임라인 표시용
// ENG: Time year markers — for timeline display
const TIMELINE_YEARS = ['현재', '+1년', '+2년', '+3년', '+4년', '+5년', '+6년'];

export default function Diagnosis99Page() {
  // KOR: 현재 활성 입력 단계 인덱스
  // ENG: Current active input step index
  const [currentStep, setCurrentStep] = useState<number>(0);

  // KOR: 사용자 진단 입력값 상태
  // ENG: User diagnosis input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 진단 결과 표시 여부
  // ENG: Whether to show diagnosis results
  const [showResult, setShowResult] = useState<boolean>(false);

  // KOR: 결과 로딩 애니메이션 상태
  // ENG: Result loading animation state
  const [isWarping, setIsWarping] = useState<boolean>(false);

  // KOR: 펼쳐진 경로 카드 ID
  // ENG: Expanded pathway card ID
  const [expandedPath, setExpandedPath] = useState<string | null>('path-1');

  // KOR: 선택된 타임라인 경로 인덱스
  // ENG: Selected timeline pathway index
  const [selectedPathIndex, setSelectedPathIndex] = useState<number>(0);

  // KOR: 나이 슬라이더 로컬 값
  // ENG: Age slider local value
  const [ageValue, setAgeValue] = useState<number>(25);

  // KOR: 현재 단계 업데이트 핸들러
  // ENG: Current step update handler
  const handleSelect = useCallback((key: StepKey, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  }, []);

  // KOR: 다음 단계로 이동
  // ENG: Move to next step
  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // KOR: 마지막 단계 — 타임 워프 효과 후 결과 표시
      // ENG: Last step — show result after time warp effect
      setIsWarping(true);
      setTimeout(() => {
        setIsWarping(false);
        setShowResult(true);
      }, 2000);
    }
  }, [currentStep]);

  // KOR: 이전 단계로 이동
  // ENG: Move to previous step
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // KOR: 진단 초기화
  // ENG: Reset diagnosis
  const handleReset = useCallback(() => {
    setInput({});
    setCurrentStep(0);
    setShowResult(false);
    setIsWarping(false);
    setExpandedPath('path-1');
    setSelectedPathIndex(0);
    setAgeValue(25);
  }, []);

  // KOR: 현재 단계의 값이 선택되었는지 확인
  // ENG: Check if current step has a value selected
  const currentStepKey = STEPS[currentStep]?.key;
  const hasCurrentValue = currentStepKey
    ? input[currentStepKey] !== undefined && input[currentStepKey] !== ''
    : false;

  // KOR: 목업 결과 데이터 사용 (실제 구현 시 API 호출로 대체)
  // ENG: Use mock result data (replace with API call in real implementation)
  const result: DiagnosisResult = mockDiagnosisResult;
  const pathways = result.pathways;
  const selectedPathway: RecommendedPathway = pathways[selectedPathIndex] ?? pathways[0];

  // KOR: 타임워프 화면 렌더링
  // ENG: Render time warp screen
  if (isWarping) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center overflow-hidden relative">
        {/* KOR: 타임 워프 배경 효과 — 동심원 애니메이션 */}
        {/* ENG: Time warp background effect — concentric circle animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-yellow-400/20 animate-ping"
              style={{
                width: `${i * 12}%`,
                height: `${i * 12}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
        {/* KOR: 방사형 광선 효과 */}
        {/* ENG: Radial ray effects */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-px origin-bottom bg-linear-to-t from-cyan-400/60 to-transparent"
              style={{
                height: '50%',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="text-6xl font-black text-yellow-400 mb-4 animate-pulse tracking-tight">
            TIME WARP
          </div>
          <div className="text-cyan-400 text-xl font-light tracking-widest">
            미래로 이동 중...
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // KOR: 결과 화면 렌더링
  // ENG: Render result screen
  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        {/* KOR: 결과 헤더 — 미래 도착 느낌 */}
        {/* ENG: Result header — future arrival feel */}
        <div className="relative bg-linear-to-br from-gray-900 via-gray-950 to-black border-b border-yellow-400/20 overflow-hidden">
          {/* KOR: 배경 그리드 패턴 */}
          {/* ENG: Background grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-yellow-400 text-sm font-mono tracking-widest">FUTURE SIMULATION COMPLETE</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-1">
              미래 비자 경로 <span className="text-yellow-400">시뮬레이션</span> 완료
            </h1>
            <p className="text-gray-400 text-sm">
              Future Visa Pathway Simulation Complete — {pathways.length}개 경로 분석됨
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* KOR: 타임라인 경로 선택 탭 */}
          {/* ENG: Timeline pathway selection tabs */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-mono text-sm tracking-wider">SELECT TIMELINE</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {pathways.map((pathway, idx) => (
                <button
                  key={pathway.id}
                  onClick={() => { setSelectedPathIndex(idx); setExpandedPath(pathway.id); }}
                  className={`shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedPathIndex === idx
                      ? 'bg-yellow-400 border-yellow-400 text-gray-950 font-bold'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-yellow-400/50 hover:text-yellow-300'
                  }`}
                >
                  경로 {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* KOR: 선택된 경로의 타임라인 시각화 */}
          {/* ENG: Timeline visualization for selected pathway */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 overflow-hidden relative">
            {/* KOR: 배경 시간 눈금 장식 */}
            {/* ENG: Background time tick decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-yellow-400 via-cyan-400 to-yellow-400 opacity-60" />

            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{getFeasibilityEmoji(selectedPathway.feasibilityLabel)}</span>
                  <h2 className="text-xl font-bold text-white">{selectedPathway.name}</h2>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xl">{selectedPathway.description}</p>
              </div>
              <div className="shrink-0 ml-4 text-right">
                <div className="text-3xl font-black text-yellow-400">{selectedPathway.feasibilityScore}</div>
                <div className="text-xs text-gray-500">가능성 점수</div>
              </div>
            </div>

            {/* KOR: 타임라인 다이얼 — 월 기반 진행 바 */}
            {/* ENG: Timeline dial — month-based progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-mono">현재</span>
                <span className="text-xs text-cyan-400 font-mono">+{selectedPathway.totalDurationMonths}개월</span>
              </div>
              <div className="relative h-12 bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                {/* KOR: 타임라인 배경 격자 */}
                {/* ENG: Timeline background grid */}
                <div className="absolute inset-0 flex">
                  {TIMELINE_YEARS.map((yr, i) => (
                    <div key={i} className="flex-1 border-r border-gray-700/50 relative">
                      <span className="absolute top-1 left-1 text-xs text-gray-600 font-mono">{yr}</span>
                    </div>
                  ))}
                </div>
                {/* KOR: 비자 체인 구간 표시 */}
                {/* ENG: Visa chain segment display */}
                {(Array.isArray(selectedPathway.visaChain) ? selectedPathway.visaChain : []).map((vc, i) => {
                  const total = (Array.isArray(selectedPathway.visaChain) ? selectedPathway.visaChain : []).length;
                  const segWidth = 100 / total;
                  const colors = ['bg-yellow-400', 'bg-cyan-400', 'bg-purple-400', 'bg-green-400'];
                  return (
                    <div
                      key={i}
                      className={`absolute top-0 bottom-0 ${colors[i % colors.length]} opacity-80 flex items-center justify-center`}
                      style={{
                        left: `${i * segWidth}%`,
                        width: `${segWidth}%`,
                      }}
                    >
                      <span className="text-xs font-bold text-gray-950 truncate px-1">{vc.visa}</span>
                    </div>
                  );
                })}
              </div>
              {/* KOR: 비자 체인 레전드 */}
              {/* ENG: Visa chain legend */}
              <div className="flex gap-4 mt-3 flex-wrap">
                {(Array.isArray(selectedPathway.visaChain) ? selectedPathway.visaChain : []).map((vc, i) => {
                  const colors = ['text-yellow-400', 'text-cyan-400', 'text-purple-400', 'text-green-400'];
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${['bg-yellow-400', 'bg-cyan-400', 'bg-purple-400', 'bg-green-400'][i % 4]}`} />
                      <span className={`text-xs font-mono ${colors[i % colors.length]}`}>{vc.visa}</span>
                      <span className="text-xs text-gray-500">{vc.duration}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KOR: 핵심 지표 카드 행 */}
            {/* ENG: Key metric card row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
                <Clock className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{selectedPathway.totalDurationMonths}개월</div>
                <div className="text-xs text-gray-500">총 소요 기간</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
                <DollarSign className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">${((selectedPathway as any).estimatedCostUSD ?? selectedPathway.estimatedCostWon ?? 0).toLocaleString()}</div>
                <div className="text-xs text-gray-500">예상 비용</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
                <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{selectedPathway.feasibilityLabel}</div>
                <div className="text-xs text-gray-500">실현 가능성</div>
              </div>
            </div>
          </div>

          {/* KOR: 마일스톤 타임라인 수직 표시 */}
          {/* ENG: Vertical milestone timeline */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FastForward className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-mono text-sm tracking-wider">FUTURE MILESTONES</span>
            </div>
            <div className="relative pl-6">
              {/* KOR: 수직 연결선 */}
              {/* ENG: Vertical connector line */}
              <div className="absolute left-2 top-0 bottom-0 w-px bg-linear-to-b from-yellow-400 via-cyan-400 to-purple-400" />
              <div className="space-y-4">
                {selectedPathway.milestones.map((milestone, i) => (
                  <div key={i} className="relative">
                    {/* KOR: 타임라인 노드 */}
                    {/* ENG: Timeline node */}
                    <div className="absolute -left-4 top-3 w-3 h-3 rounded-full bg-yellow-400 border-2 border-gray-950" />
                    <div className="bg-gray-900 border border-gray-800 hover:border-yellow-400/30 transition-colors rounded-xl p-4 ml-2">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">{milestone.emoji}</span>
                        <div>
                          <div className="font-semibold text-white text-sm mb-1">{milestone.title}</div>
                          <div className="text-gray-400 text-xs leading-relaxed">{milestone.description}</div>
                        </div>
                        <div className="shrink-0 text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                          +{Math.round((i + 1) * (selectedPathway.totalDurationMonths / selectedPathway.milestones.length))}개월
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* KOR: 최종 목적지 노드 */}
                {/* ENG: Final destination node */}
                <div className="relative">
                  <div className="absolute -left-4 top-3 w-3 h-3 rounded-full bg-cyan-400 border-2 border-gray-950 animate-pulse" />
                  <div className="bg-linear-to-r from-cyan-400/10 to-yellow-400/10 border border-cyan-400/30 rounded-xl p-4 ml-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌟</span>
                      <div>
                        <div className="font-bold text-cyan-400 text-sm">목표 달성!</div>
                        <div className="text-gray-400 text-xs">한국 장기 체류 비자 확보 완료</div>
                      </div>
                      <div className="ml-auto text-xs font-mono text-yellow-400">
                        +{selectedPathway.totalDurationMonths}개월
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOR: 전체 경로 비교 요약 */}
          {/* ENG: All pathway comparison summary */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Rewind className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-mono text-sm tracking-wider">ALL TIMELINES</span>
            </div>
            <div className="space-y-3">
              {pathways.map((pw, idx) => (
                <button
                  key={pw.id}
                  onClick={() => { setSelectedPathIndex(idx); setExpandedPath(pw.id); }}
                  className={`w-full text-left bg-gray-900 border rounded-xl p-4 transition-all ${
                    selectedPathIndex === idx
                      ? 'border-yellow-400/60 bg-yellow-400/5'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getFeasibilityEmoji(pw.feasibilityLabel)}</span>
                      <div>
                        <div className="font-semibold text-white text-sm">{pw.name}</div>
                        <div className="text-xs text-gray-500">{pw.totalDurationMonths}개월 · ${((pw as any).estimatedCostUSD ?? pw.estimatedCostWon ?? 0).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(pw.feasibilityLabel)} text-white`}>
                        {pw.feasibilityScore}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* KOR: 재진단 버튼 */}
          {/* ENG: Restart diagnosis button */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-gray-700 text-gray-400 hover:border-yellow-400/50 hover:text-yellow-300 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            타임머신 다시 탑승하기
          </button>
        </div>
      </div>
    );
  }

  // KOR: 입력 단계 화면
  // ENG: Input step screen
  const step = STEPS[currentStep];
  const StepIcon = step.icon;
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* KOR: 배경 — 우주/시간 느낌의 별 패턴 */}
      {/* ENG: Background — space/time star pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-30"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
        {/* KOR: 시간 빛줄기 장식 */}
        {/* ENG: Time light beam decoration */}
        <div className="absolute top-0 right-1/4 w-px h-full bg-linear-to-b from-yellow-400/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/3 w-px h-full bg-linear-to-b from-cyan-400/10 via-transparent to-transparent" />
      </div>

      {/* KOR: 상단 헤더 — 타임머신 대시보드 */}
      {/* ENG: Top header — time machine dashboard */}
      <div className="relative z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-xs text-yellow-400 font-mono tracking-widest">TIME MACHINE</div>
                <div className="text-sm font-bold text-white">비자 미래 시뮬레이터</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 font-mono">TARGET ERA</div>
              <div className="text-lg font-black text-cyan-400 font-mono">{step.era}</div>
            </div>
          </div>

          {/* KOR: 타임라인 진행 바 */}
          {/* ENG: Timeline progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-mono">TIMELINE PROGRESS</span>
              <span className="text-xs text-yellow-400 font-mono">{progressPercent}%</span>
            </div>
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-linear-to-r from-yellow-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
              {/* KOR: 타임라인 눈금 마커 */}
              {/* ENG: Timeline tick markers */}
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`absolute top-0 bottom-0 w-0.5 ${i < currentStep ? 'bg-yellow-400' : 'bg-gray-700'}`}
                  style={{ left: `${((i + 1) / STEPS.length) * 100}%` }}
                />
              ))}
            </div>
            {/* KOR: 단계 라벨 */}
            {/* ENG: Step labels */}
            <div className="flex justify-between mt-1">
              {STEPS.map((s, i) => (
                <div
                  key={s.key}
                  className={`text-xs font-mono ${i === currentStep ? 'text-yellow-400' : i < currentStep ? 'text-gray-500' : 'text-gray-700'}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KOR: 메인 콘텐츠 영역 */}
      {/* ENG: Main content area */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        {/* KOR: 단계 헤더 */}
        {/* ENG: Step header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
              <StepIcon className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-mono tracking-widest">
                STEP {currentStep + 1} / {STEPS.length} — {step.labelEn.toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-white">{step.label}를 알려주세요</h2>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed ml-15">
            타임머신이 최적의 비자 경로를 계산하기 위해 필요한 정보입니다.
          </p>
        </div>

        {/* KOR: 단계별 입력 UI */}
        {/* ENG: Per-step input UI */}

        {/* KOR: Step 1 — 국적 선택 */}
        {/* ENG: Step 1 — Nationality selection */}
        {step.key === 'nationality' && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {popularCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelect('nationality', country.name)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    input.nationality === country.name
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                      : 'border-gray-800 bg-gray-900 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{country.flag}</div>
                  <div className="text-xs font-medium">{country.name}</div>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="다른 국가 직접 입력..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
                value={typeof input.nationality === 'string' && !popularCountries.find(c => c.name === input.nationality) ? input.nationality : ''}
                onChange={(e) => handleSelect('nationality', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* KOR: Step 2 — 나이 슬라이더 */}
        {/* ENG: Step 2 — Age slider */}
        {step.key === 'age' && (
          <div>
            {/* KOR: 타임 다이얼 스타일 나이 표시 */}
            {/* ENG: Time dial style age display */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                {/* KOR: 외부 링 */}
                {/* ENG: Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent"
                  style={{
                    background: `conic-gradient(#FBBF24 ${((ageValue - 16) / (60 - 16)) * 360}deg, transparent 0deg)`,
                    WebkitMask: 'radial-gradient(transparent 55%, black 56%)',
                    mask: 'radial-gradient(transparent 55%, black 56%)',
                  }}
                />
                {/* KOR: 중앙 나이 표시 */}
                {/* ENG: Center age display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-black text-yellow-400">{ageValue}</div>
                  <div className="text-xs text-gray-500 font-mono">세</div>
                </div>
              </div>
            </div>
            <input
              type="range"
              min={16}
              max={60}
              value={ageValue}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAgeValue(val);
                handleSelect('age', val);
              }}
              className="w-full accent-yellow-400 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
              <span>16세</span>
              <span>60세</span>
            </div>
            {/* KOR: 빠른 선택 버튼 */}
            {/* ENG: Quick select buttons */}
            <div className="flex gap-2 mt-4 justify-center">
              {[20, 25, 30, 35, 40].map((age) => (
                <button
                  key={age}
                  onClick={() => { setAgeValue(age); handleSelect('age', age); }}
                  className={`px-3 py-1.5 rounded-lg text-xs border font-mono transition-all ${
                    ageValue === age
                      ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                      : 'border-gray-700 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* KOR: Step 3 — 학력 선택 */}
        {/* ENG: Step 3 — Education selection */}
        {step.key === 'educationLevel' && (
          <div className="space-y-2">
            {educationOptions.map((edu, i) => (
              <button
                key={edu}
                onClick={() => handleSelect('educationLevel', edu)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  input.educationLevel === edu
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold ${
                  input.educationLevel === edu ? 'bg-yellow-400 text-gray-950' : 'bg-gray-800 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                <span className={`font-medium text-sm ${input.educationLevel === edu ? 'text-yellow-300' : 'text-gray-300'}`}>
                  {edu}
                </span>
                {input.educationLevel === edu && (
                  <Award className="w-4 h-4 text-yellow-400 ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* KOR: Step 4 — 연간 가용 자금 선택 */}
        {/* ENG: Step 4 — Annual fund selection */}
        {step.key === 'availableAnnualFund' && (
          <div className="space-y-2">
            {fundOptions.map((fund) => (
              <button
                key={fund}
                onClick={() => handleSelect('availableAnnualFund', fund)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  input.availableAnnualFund === fund
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className={`w-5 h-5 ${input.availableAnnualFund === fund ? 'text-cyan-400' : 'text-gray-500'}`} />
                  <span className={`font-medium text-sm ${input.availableAnnualFund === fund ? 'text-cyan-300' : 'text-gray-300'}`}>
                    {fund}
                  </span>
                </div>
                {input.availableAnnualFund === fund && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* KOR: Step 5 — 최종 목표 선택 */}
        {/* ENG: Step 5 — Final goal selection */}
        {step.key === 'finalGoal' && (
          <div className="space-y-2">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                onClick={() => handleSelect('finalGoal', goal)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  input.finalGoal === goal
                    ? 'border-purple-400 bg-purple-400/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Target className={`w-5 h-5 shrink-0 ${input.finalGoal === goal ? 'text-purple-400' : 'text-gray-500'}`} />
                  <span className={`font-medium text-sm ${input.finalGoal === goal ? 'text-purple-300' : 'text-gray-300'}`}>
                    {goal}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* KOR: Step 6 — 우선순위 선택 (마지막) */}
        {/* ENG: Step 6 — Priority selection (last step) */}
        {step.key === 'priorityPreference' && (
          <div className="space-y-2">
            {priorityOptions.map((priority) => (
              <button
                key={priority}
                onClick={() => handleSelect('priorityPreference', priority)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  input.priorityPreference === priority
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 shrink-0 ${input.priorityPreference === priority ? 'text-yellow-400' : 'text-gray-500'}`} />
                  <span className={`font-medium text-sm ${input.priorityPreference === priority ? 'text-yellow-300' : 'text-gray-300'}`}>
                    {priority}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* KOR: 네비게이션 버튼 영역 */}
        {/* ENG: Navigation button area */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
              currentStep === 0
                ? 'border-gray-800 text-gray-700 cursor-not-allowed'
                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            이전 시대
          </button>

          <button
            onClick={handleNext}
            disabled={!hasCurrentValue && step.key !== 'age'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              hasCurrentValue || step.key === 'age'
                ? currentStep === STEPS.length - 1
                  ? 'bg-linear-to-r from-yellow-400 to-cyan-400 text-gray-950 hover:opacity-90'
                  : 'bg-yellow-400 text-gray-950 hover:bg-yellow-300'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                <Play className="w-4 h-4" />
                타임 워프 시작
              </>
            ) : (
              <>
                다음 시대로
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* KOR: 하단 — 현재 입력 요약 파노라마 */}
        {/* ENG: Bottom — current input summary panorama */}
        {Object.keys(input).length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="text-xs text-gray-600 font-mono mb-3 tracking-wider">RECORDED DATA</div>
            <div className="flex flex-wrap gap-2">
              {STEPS.slice(0, currentStep).map((s) => {
                const val = input[s.key];
                if (!val) return null;
                return (
                  <div
                    key={s.key}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-full text-xs"
                  >
                    <s.icon className="w-3 h-3 text-yellow-400" />
                    <span className="text-gray-400">{s.label}:</span>
                    <span className="text-white font-medium">{String(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* KOR: 하단 패딩 스페이서 */}
      {/* ENG: Bottom padding spacer */}
      <div className="h-16" />
    </div>
  );
}
