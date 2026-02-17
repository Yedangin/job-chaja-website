'use client';

// 만화 스토리보드 스타일 비자 진단 페이지 / Comic Storyboard style visa diagnosis page
// 웹툰 칸 레이아웃으로 비자 여정을 만화처럼 표현 / Expresses visa journey as webtoon panel layout
// 참조: Webtoon, Clip Studio, Procreate, MediBang, Tappytoon
// References: Webtoon, Clip Studio, Procreate, MediBang, Tappytoon

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
  ChevronRight,
  ChevronLeft,
  Star,
  Zap,
  BookOpen,
  Home,
  Globe,
  Clock,
  DollarSign,
  Award,
  ArrowRight,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Map,
  Target,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'result';

interface StepConfig {
  id: Step;
  panelTitle: string;       // 만화 칸 제목 / Comic panel title
  sfxText: string;          // 효과음 텍스트 / Sound effect text
  bubbleText: string;       // 말풍선 텍스트 / Speech bubble text
  characterEmoji: string;   // 캐릭터 이모지 / Character emoji
  scene: string;            // 장면 설명 / Scene description
}

// ============================================================
// 스텝 구성 / Step configuration
// ============================================================

const STEPS: StepConfig[] = [
  {
    id: 'nationality',
    panelTitle: '제1화: 여행자의 등장',
    sfxText: 'WOOSH!!',
    bubbleText: '어디서 오셨나요? 당신의 이야기를 들려주세요!',
    characterEmoji: '🌏',
    scene: '낯선 나라에 도착한 여행자',
  },
  {
    id: 'age',
    panelTitle: '제2화: 주인공의 나이',
    sfxText: 'TICK TOCK~',
    bubbleText: '당신은 몇 살인가요? 나이가 비자 경로를 바꿔요!',
    characterEmoji: '⏰',
    scene: '시간의 마법사가 나이를 묻다',
  },
  {
    id: 'educationLevel',
    panelTitle: '제3화: 지식의 탑',
    sfxText: 'FLASH!!',
    bubbleText: '학력을 알려주세요. 지식은 힘이에요!',
    characterEmoji: '📚',
    scene: '지식의 탑 앞에 선 주인공',
  },
  {
    id: 'availableAnnualFund',
    panelTitle: '제4화: 보물 상자',
    sfxText: 'KA-CHING!!',
    bubbleText: '연간 사용 가능한 자금은 얼마인가요?',
    characterEmoji: '💰',
    scene: '보물 상자를 발견한 주인공',
  },
  {
    id: 'finalGoal',
    panelTitle: '제5화: 최종 목적지',
    sfxText: 'BANG!!',
    bubbleText: '한국에서 이루고 싶은 꿈은 무엇인가요?',
    characterEmoji: '🎯',
    scene: '꿈의 지도를 펼치다',
  },
  {
    id: 'priorityPreference',
    panelTitle: '제6화: 전략 선택!',
    sfxText: 'ZOOM!!',
    bubbleText: '어떤 방식으로 목표를 달성할까요?',
    characterEmoji: '⚡',
    scene: '최종 전략을 결정하는 순간',
  },
];

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================

export default function Diagnosis85Page() {
  // 입력 상태 / Input state
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput });
  // 현재 스텝 / Current step
  const [currentStep, setCurrentStep] = useState<Step>('nationality');
  // 결과 표시 여부 / Whether to show results
  const [showResult, setShowResult] = useState(false);
  // 선택된 경로 인덱스 / Selected pathway index
  const [selectedPathway, setSelectedPathway] = useState<number>(0);
  // 펼쳐진 마일스톤 패널 / Expanded milestone panel
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  // 애니메이션 트리거 / Animation trigger
  const [panelFlash, setPanelFlash] = useState(false);

  const stepOrder: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference'];
  const currentIndex = stepOrder.indexOf(currentStep);
  const currentConfig = STEPS.find((s) => s.id === currentStep);

  // 다음 스텝으로 이동 / Move to next step
  function handleNext() {
    setPanelFlash(true);
    setTimeout(() => setPanelFlash(false), 300);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      setShowResult(true);
    }
  }

  // 이전 스텝으로 이동 / Move to previous step
  function handleBack() {
    if (showResult) {
      setShowResult(false);
      setCurrentStep('priorityPreference');
    } else if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  }

  // 입력값 업데이트 / Update input value
  function updateInput(key: keyof DiagnosisInput, value: string | number) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  // 국가 선택 / Select nationality
  const selectedCountry = popularCountries.find((c) => c.code === input.nationality);

  if (showResult) {
    return (
      <ResultComicView
        result={mockDiagnosisResult}
        pathways={mockPathways}
        input={input}
        selectedPathway={selectedPathway}
        setSelectedPathway={setSelectedPathway}
        expandedPanel={expandedPanel}
        setExpandedPanel={setExpandedPanel}
        onBack={handleBack}
      />
    );
  }

  return (
    // 만화 스타일 메인 컨테이너 / Comic style main container
    <div className="min-h-screen bg-white font-sans">
      {/* 만화 헤더 / Comic header */}
      <ComicHeader currentIndex={currentIndex} totalSteps={stepOrder.length} />

      {/* 메인 만화 패널 영역 / Main comic panel area */}
      <div className={`transition-all duration-200 ${panelFlash ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        {/* 상단 효과음 배너 / Top SFX banner */}
        {currentConfig && (
          <div className="bg-black text-white text-center py-2 border-b-4 border-black">
            <span className="text-xl font-black tracking-widest italic">{currentConfig.sfxText}</span>
          </div>
        )}

        {/* 만화 패널 그리드 / Comic panel grid */}
        <div className="max-w-2xl mx-auto p-4">
          {/* 패널 제목 칸 / Panel title box */}
          {currentConfig && (
            <div className="border-4 border-black bg-yellow-300 p-3 mb-0 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-xs font-bold text-black uppercase tracking-widest">{currentConfig.scene}</p>
              <h2 className="text-xl font-black text-black">{currentConfig.panelTitle}</h2>
            </div>
          )}

          {/* 메인 장면 패널 / Main scene panel */}
          <div className="border-4 border-black border-t-0 bg-white p-6 mb-4 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {/* 배경 해칭 효과 / Background hatching effect */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
                backgroundSize: '8px 8px',
              }}
            />

            {/* 캐릭터 + 말풍선 / Character + speech bubble */}
            {currentConfig && (
              <div className="flex items-start gap-4 mb-6 relative z-10">
                {/* 캐릭터 / Character */}
                <div className="shrink-0 w-16 h-16 rounded-full border-4 border-black bg-yellow-200 flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {currentConfig.characterEmoji}
                </div>

                {/* 말풍선 / Speech bubble */}
                <div className="relative bg-white border-4 border-black rounded-2xl rounded-tl-none p-4 flex-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {/* 말풍선 꼬리 / Speech bubble tail */}
                  <div className="absolute -left-5 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-[20px] border-r-black" />
                  <div className="absolute -left-3 top-5 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-[16px] border-r-white" />
                  <p className="text-sm font-bold text-black leading-relaxed">{currentConfig.bubbleText}</p>
                </div>
              </div>
            )}

            {/* 입력 패널 / Input panel */}
            <div className="relative z-10">
              <StepInputPanel
                step={currentStep}
                input={input}
                updateInput={updateInput}
                selectedCountry={selectedCountry}
              />
            </div>
          </div>

          {/* 진행 상황 만화 칸들 / Progress comic panels */}
          <ProgressPanels currentIndex={currentIndex} totalSteps={stepOrder.length} />

          {/* 네비게이션 버튼 / Navigation buttons */}
          <div className="flex gap-3 mt-4">
            {currentIndex > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 bg-white border-4 border-black py-3 font-black text-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <ChevronLeft size={20} />
                이전 칸
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 bg-black text-white border-4 border-black py-3 font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,0,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,0,0.8)] transition-all"
            >
              {currentIndex < stepOrder.length - 1 ? (
                <>다음 칸 <ChevronRight size={20} /></>
              ) : (
                <>결과 보기! <Sparkles size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 만화 헤더 / Comic header component
// ============================================================

function ComicHeader({ currentIndex, totalSteps }: { currentIndex: number; totalSteps: number }) {
  return (
    <header className="border-b-4 border-black bg-white sticky top-0 z-50">
      {/* 제목 바 / Title bar */}
      <div className="bg-black text-yellow-300 text-center py-1">
        <span className="text-xs font-black tracking-[0.3em] uppercase">잡차자 비자 진단 만화</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <BookOpen size={16} className="text-yellow-300" />
            </div>
            <div>
              <h1 className="text-lg font-black text-black leading-none">비자 여정 만화</h1>
              <p className="text-xs text-gray-500 font-bold">VISA JOURNEY WEBTOON</p>
            </div>
          </div>
        </div>

        {/* 칸 번호 표시 / Panel number indicator */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 border-2 border-black transition-all ${
                i < currentIndex
                  ? 'bg-black'
                  : i === currentIndex
                  ? 'bg-yellow-300'
                  : 'bg-white'
              }`}
            />
          ))}
          <span className="ml-2 text-xs font-black text-black">{currentIndex + 1}/{totalSteps}</span>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// 스텝 입력 패널 / Step input panel
// ============================================================

function StepInputPanel({
  step,
  input,
  updateInput,
  selectedCountry,
}: {
  step: Step;
  input: DiagnosisInput;
  updateInput: (key: keyof DiagnosisInput, value: string | number) => void;
  selectedCountry: typeof popularCountries[0] | undefined;
}) {
  // 국적 선택 / Nationality selection
  if (step === 'nationality') {
    return (
      <div>
        <div className="grid grid-cols-3 gap-2">
          {popularCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => updateInput('nationality', country.code)}
              className={`border-3 border-black p-3 text-center transition-all font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                input.nationality === country.code
                  ? 'bg-yellow-300 scale-95'
                  : 'bg-white'
              }`}
            >
              <div className="text-2xl">{country.flag}</div>
              <div className="text-xs mt-1 text-black">{country.nameKo}</div>
              {input.nationality === country.code && (
                <div className="text-xs text-black font-black">✓ 선택!</div>
              )}
            </button>
          ))}
        </div>
        {selectedCountry && (
          <div className="mt-3 border-2 border-black bg-yellow-100 p-2 text-center">
            <span className="text-sm font-black text-black">
              {selectedCountry.flag} {selectedCountry.nameKo}에서 오셨군요!
            </span>
          </div>
        )}
      </div>
    );
  }

  // 나이 입력 / Age input
  if (step === 'age') {
    const ageRanges = [18, 20, 22, 24, 26, 28, 30, 32, 35, 40];
    return (
      <div>
        {/* 나이 슬라이더 / Age slider */}
        <div className="mb-4 border-4 border-black p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-black">현재 나이</span>
            <div className="border-4 border-black bg-yellow-300 px-4 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl font-black text-black">{input.age}</span>
              <span className="text-sm font-bold text-black">세</span>
            </div>
          </div>
          <input
            type="range"
            min={18}
            max={50}
            value={input.age}
            onChange={(e) => updateInput('age', parseInt(e.target.value))}
            className="w-full h-3 border-2 border-black bg-white cursor-pointer"
            style={{ accentColor: '#000' }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs font-bold text-gray-500">18세</span>
            <span className="text-xs font-bold text-gray-500">50세</span>
          </div>
        </div>

        {/* 빠른 선택 칩 / Quick select chips */}
        <div className="flex flex-wrap gap-2">
          {ageRanges.map((age) => (
            <button
              key={age}
              onClick={() => updateInput('age', age)}
              className={`border-3 border-black px-3 py-1 text-sm font-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${
                input.age === age ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 학력 선택 / Education selection
  if (step === 'educationLevel') {
    return (
      <div className="grid grid-cols-1 gap-2">
        {educationOptions.map((edu) => (
          <button
            key={edu.value}
            onClick={() => updateInput('educationLevel', edu.value)}
            className={`border-3 border-black p-3 text-left flex items-center gap-3 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
              input.educationLevel === edu.value
                ? 'bg-yellow-300'
                : 'bg-white'
            }`}
          >
            <span className="text-2xl shrink-0">{edu.emoji}</span>
            <div>
              <div className="font-black text-black text-sm">{edu.labelKo}</div>
              <div className="text-xs text-gray-500 font-bold">{edu.labelEn}</div>
            </div>
            {input.educationLevel === edu.value && (
              <Check size={20} className="ml-auto text-black shrink-0" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // 자금 선택 / Fund selection
  if (step === 'availableAnnualFund') {
    return (
      <div className="grid grid-cols-1 gap-2">
        {fundOptions.map((fund) => (
          <button
            key={fund.value}
            onClick={() => updateInput('availableAnnualFund', fund.value)}
            className={`border-3 border-black p-3 text-left flex items-center gap-3 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
              input.availableAnnualFund === fund.value
                ? 'bg-yellow-300'
                : 'bg-white'
            }`}
          >
            <DollarSign size={20} className="shrink-0 text-black" />
            <div>
              <div className="font-black text-black text-sm">{fund.labelKo}</div>
              <div className="text-xs text-gray-500 font-bold">{fund.labelEn}</div>
            </div>
            {input.availableAnnualFund === fund.value && (
              <div className="ml-auto border-2 border-black bg-black text-yellow-300 text-xs font-black px-2 py-0.5">
                선택!
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  // 목표 선택 / Goal selection
  if (step === 'finalGoal') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {goalOptions.map((goal) => (
          <button
            key={goal.value}
            onClick={() => updateInput('finalGoal', goal.value)}
            className={`border-4 border-black p-4 text-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              input.finalGoal === goal.value
                ? 'bg-yellow-300 scale-95'
                : 'bg-white'
            }`}
          >
            <div className="text-3xl mb-2">{goal.emoji}</div>
            <div className="font-black text-black text-sm">{goal.labelKo}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">{goal.descKo}</div>
            {input.finalGoal === goal.value && (
              <div className="mt-2 text-xs font-black text-black italic">★ 선택됨!</div>
            )}
          </button>
        ))}
      </div>
    );
  }

  // 우선순위 선택 / Priority selection
  if (step === 'priorityPreference') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {priorityOptions.map((priority) => (
          <button
            key={priority.value}
            onClick={() => updateInput('priorityPreference', priority.value)}
            className={`border-4 border-black p-4 text-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              input.priorityPreference === priority.value
                ? 'bg-black text-yellow-300'
                : 'bg-white text-black'
            }`}
          >
            <div className="text-3xl mb-2">{priority.emoji}</div>
            <div className="font-black text-sm">{priority.labelKo}</div>
            <div className={`text-xs font-bold mt-1 ${input.priorityPreference === priority.value ? 'text-yellow-200' : 'text-gray-500'}`}>
              {priority.descKo}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return null;
}

// ============================================================
// 진행 상황 만화 칸들 / Progress comic panels
// ============================================================

function ProgressPanels({ currentIndex, totalSteps }: { currentIndex: number; totalSteps: number }) {
  const panelLabels = ['국적', '나이', '학력', '자금', '목표', '전략'];
  const panelEmojis = ['🌏', '⏰', '📚', '💰', '🎯', '⚡'];

  return (
    <div className="border-4 border-black bg-gray-50 p-3">
      <p className="text-xs font-black text-gray-400 mb-2 uppercase tracking-widest text-center">스토리 진행 현황 / STORY PROGRESS</p>
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 border-2 border-black p-1.5 text-center transition-all ${
              i < currentIndex
                ? 'bg-black'
                : i === currentIndex
                ? 'bg-yellow-300'
                : 'bg-white'
            }`}
          >
            <div className={`text-xs ${i === currentIndex ? 'text-black' : i < currentIndex ? 'text-white' : 'text-gray-400'}`}>
              {panelEmojis[i] ?? ''}
            </div>
            <div className={`text-[9px] font-black leading-none mt-0.5 ${i === currentIndex ? 'text-black' : i < currentIndex ? 'text-yellow-300' : 'text-gray-400'}`}>
              {panelLabels[i] ?? ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 결과 만화 뷰 / Result comic view
// ============================================================

function ResultComicView({
  result,
  pathways,
  input,
  selectedPathway,
  setSelectedPathway,
  expandedPanel,
  setExpandedPanel,
  onBack,
}: {
  result: DiagnosisResult;
  pathways: CompatPathway[];
  input: DiagnosisInput;
  selectedPathway: number;
  setSelectedPathway: (i: number) => void;
  expandedPanel: string | null;
  setExpandedPanel: (id: string | null) => void;
  onBack: () => void;
}) {
  const selected = pathways[selectedPathway];
  const selectedCountry = popularCountries.find((c) => c.code === input.nationality);

  return (
    <div className="min-h-screen bg-white">
      {/* 결과 헤더 / Result header */}
      <div className="border-b-4 border-black bg-black text-yellow-300 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="border-2 border-yellow-300 text-yellow-300 px-3 py-1 text-xs font-black hover:bg-yellow-300 hover:text-black transition-all"
          >
            ← 뒤로
          </button>
          <div className="text-center">
            <div className="text-xs font-black tracking-widest opacity-70">완성 웹툰</div>
            <div className="text-sm font-black">비자 여정 결과!</div>
          </div>
          <div className="border-2 border-yellow-300 px-3 py-1">
            <span className="text-xs font-black">{result.pathways.length}개 경로</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 오프닝 큰 패널 / Opening large panel */}
        <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* 패널 상단 / Panel top */}
          <div className="bg-yellow-300 border-b-4 border-black px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-black text-black uppercase tracking-widest">최종화: 비자 여정 결과</span>
            <span className="text-xs font-black text-black italic">THE FINAL CHAPTER</span>
          </div>

          {/* 패널 내용 / Panel content */}
          <div
            className="p-5 relative"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,0,0,0.03) 30px, rgba(0,0,0,0.03) 31px)',
            }}
          >
            {/* 상단 캐릭터 말풍선 / Top character speech bubble */}
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-14 h-14 rounded-full border-4 border-black bg-yellow-200 flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {selectedCountry?.flag ?? '🌏'}
              </div>
              <div className="relative bg-white border-4 border-black rounded-2xl rounded-tl-none p-3 flex-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="absolute -left-5 top-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-[20px] border-r-black" />
                <p className="text-sm font-black text-black">
                  {selectedCountry?.nameKo ?? input.nationality}에서 온 {input.age}세 주인공!
                </p>
                <p className="text-xs text-gray-600 font-bold mt-1">
                  {result.meta.totalPathwaysEvaluated}개 경로 분석 완료! {result.meta.hardFilteredOut}개 제외, {result.pathways.length}개 추천!
                </p>
              </div>
            </div>

            {/* 효과음 / Sound effect */}
            <div className="text-center my-2">
              <span className="text-3xl font-black italic text-black" style={{ textShadow: '3px 3px 0 #fde047, -1px -1px 0 #000' }}>
                RESULT!!
              </span>
            </div>
          </div>
        </div>

        {/* 경로 선택 패널 그리드 / Pathway selection panel grid */}
        <div className="border-4 border-black">
          <div className="bg-black text-yellow-300 px-4 py-2 border-b-4 border-black">
            <span className="text-xs font-black uppercase tracking-widest">추천 경로 목록 / RECOMMENDED PATHWAYS</span>
          </div>
          <div className="p-3 grid grid-cols-1 gap-2">
            {pathways.map((pathway, idx) => (
              <PathwayCard
                key={pathway.pathwayId}
                pathway={pathway}
                index={idx}
                isSelected={selectedPathway === idx}
                onSelect={() => setSelectedPathway(idx)}
              />
            ))}
          </div>
        </div>

        {/* 선택된 경로 상세 / Selected pathway detail */}
        {selected && (
          <PathwayDetailComic
            pathway={selected}
            expandedPanel={expandedPanel}
            setExpandedPanel={setExpandedPanel}
          />
        )}

        {/* 엔딩 패널 / Ending panel */}
        <div className="border-4 border-black bg-black text-center p-6 shadow-[8px_8px_0px_0px_rgba(253,224,71,1)]">
          <div className="text-yellow-300 text-4xl mb-2">★</div>
          <h3 className="text-white font-black text-lg mb-1">계속되는 여정...</h3>
          <p className="text-gray-400 text-xs font-bold">TO BE CONTINUED...</p>
          <div className="mt-4 flex gap-3 justify-center">
            <button className="border-3 border-yellow-300 text-yellow-300 px-4 py-2 text-sm font-black hover:bg-yellow-300 hover:text-black transition-all shadow-[3px_3px_0px_0px_rgba(253,224,71,0.5)]">
              전문가 상담 →
            </button>
            <button
              onClick={onBack}
              className="border-3 border-white text-white px-4 py-2 text-sm font-black hover:bg-white hover:text-black transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]"
            >
              다시 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 경로 카드 / Pathway card
// ============================================================

function PathwayCard({
  pathway,
  index,
  isSelected,
  onSelect,
}: {
  pathway: CompatPathway;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const scoreColor = getScoreColor(pathway.finalScore);
  const feasEmoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <button
      onClick={onSelect}
      className={`w-full border-3 border-black p-3 text-left transition-all ${
        isSelected
          ? 'bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-0 translate-y-0'
          : 'bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* 패널 번호 / Panel number */}
        <div className={`shrink-0 w-8 h-8 border-3 border-black flex items-center justify-center font-black text-sm ${isSelected ? 'bg-black text-yellow-300' : 'bg-white text-black'}`}>
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-black text-sm">{pathway.nameKo}</span>
            <span className="text-xs font-bold text-gray-500">{feasEmoji}</span>
          </div>
          {/* 비자 체인 / Visa chain */}
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="border-2 border-black text-[10px] font-black px-1 bg-white">{v.code}</span>
                {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && <span className="text-[10px] font-black">→</span>}
              </span>
            ))}
          </div>
        </div>

        {/* 점수 / Score */}
        <div className="shrink-0 text-right">
          <div
            className="border-3 border-black text-white text-xs font-black px-2 py-1"
            style={{ backgroundColor: scoreColor }}
          >
            {pathway.finalScore}점
          </div>
          <div className="text-[10px] font-bold text-gray-500 mt-1">{pathway.estimatedMonths}개월</div>
        </div>
      </div>
    </button>
  );
}

// ============================================================
// 경로 상세 만화 / Pathway detail comic
// ============================================================

function PathwayDetailComic({
  pathway,
  expandedPanel,
  setExpandedPanel,
}: {
  pathway: CompatPathway;
  expandedPanel: string | null;
  setExpandedPanel: (id: string | null) => void;
}) {
  return (
    <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* 제목 / Title */}
      <div className="bg-yellow-300 border-b-4 border-black px-4 py-3">
        <div className="text-xs font-black text-black uppercase tracking-widest mb-1">상세 스토리 / DETAILED STORY</div>
        <h3 className="text-lg font-black text-black">{pathway.nameKo}</h3>
        <p className="text-xs text-gray-700 font-bold mt-1">{pathway.nameEn}</p>
      </div>

      {/* 요약 정보 칸 그리드 / Summary info panel grid */}
      <div className="grid grid-cols-3 border-b-4 border-black">
        <div className="border-r-4 border-black p-3 text-center bg-white">
          <Clock size={16} className="mx-auto mb-1 text-black" />
          <div className="text-xl font-black text-black">{pathway.estimatedMonths}</div>
          <div className="text-[10px] font-bold text-gray-500">개월 소요</div>
        </div>
        <div className="border-r-4 border-black p-3 text-center bg-white">
          <DollarSign size={16} className="mx-auto mb-1 text-black" />
          <div className="text-xl font-black text-black">{pathway.estimatedCostWon === 0 ? '0' : pathway.estimatedCostWon.toLocaleString()}</div>
          <div className="text-[10px] font-bold text-gray-500">만원 필요</div>
        </div>
        <div className="p-3 text-center bg-white">
          <Star size={16} className="mx-auto mb-1 text-black" />
          <div className="text-xl font-black text-black">{pathway.finalScore}</div>
          <div className="text-[10px] font-bold text-gray-500">적합도 점수</div>
        </div>
      </div>

      {/* 마일스톤 만화 칸들 / Milestone comic panels */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Map size={16} className="text-black" />
          <span className="text-sm font-black text-black">여정 스토리보드</span>
          <span className="text-xs text-gray-500 font-bold">JOURNEY STORYBOARD</span>
        </div>

        <div className="space-y-0">
          {pathway.milestones.map((milestone, idx) => {
            const panelId = `${pathway.pathwayId}-${idx}`;
            const isExpanded = expandedPanel === panelId;

            return (
              <div key={idx} className="relative">
                {/* 연결선 / Connection line */}
                {idx < pathway.milestones.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-4 bg-black z-10" />
                )}

                {/* 마일스톤 패널 / Milestone panel */}
                <div
                  className={`border-4 border-black mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${
                    milestone.type === 'final_goal' ? 'bg-yellow-100' : 'bg-white'
                  }`}
                >
                  {/* 패널 헤더 / Panel header */}
                  <button
                    onClick={() => setExpandedPanel(isExpanded ? null : panelId)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    {/* 씬 번호 / Scene number */}
                    <div className={`shrink-0 w-10 h-10 border-3 border-black flex items-center justify-center font-black text-sm ${
                      milestone.type === 'final_goal' ? 'bg-black text-yellow-300' : 'bg-white text-black'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-black">{milestone.nameKo}</span>
                        {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                          <span className="border-2 border-black text-[10px] font-black px-1 bg-yellow-200">
                            {milestone.visaStatus}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 font-bold">{milestone.monthFromStart}개월째</div>
                    </div>

                    {/* 확장 아이콘 / Expand icon */}
                    <div className={`shrink-0 w-6 h-6 border-2 border-black flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                      <ChevronRight size={14} className="text-black" />
                    </div>
                  </button>

                  {/* 확장 내용 / Expanded content */}
                  {isExpanded && (
                    <div className="border-t-4 border-black p-3 bg-gray-50">
                      {/* 말풍선 스타일 내용 / Speech bubble style content */}
                      <div className="relative bg-white border-3 border-black rounded-xl p-3 mb-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <div className="absolute -top-4 left-4 text-xl">💬</div>
                        <p className="text-xs font-bold text-black mt-1">
                          이 단계에서 필요한 것: {Array.isArray(milestone.requirements) ? milestone.requirements.join(', ') : milestone.requirements}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {milestone.canWorkPartTime && (
                          <div className="flex items-center gap-1">
                            <Check size={14} className="text-green-600" />
                            <span className="text-xs font-bold text-green-600">아르바이트 가능 ({milestone.weeklyHours}h/주)</span>
                          </div>
                        )}
                        {milestone.estimatedMonthlyIncome > 0 && (
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-black" />
                            <span className="text-xs font-bold text-black">월 ~{milestone.estimatedMonthlyIncome}만원</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 다음 단계 행동 칸 / Next steps action panel */}
      {pathway.nextSteps.length > 0 && (
        <div className="border-t-4 border-black p-4 bg-black">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-yellow-300" />
            <span className="text-sm font-black text-yellow-300 uppercase tracking-wider">지금 바로 할 일!</span>
          </div>
          <div className="space-y-2">
            {pathway.nextSteps.map((step, idx) => (
              <div key={idx} className="border-2 border-yellow-300 p-3 flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 bg-yellow-300 border-2 border-yellow-300 flex items-center justify-center font-black text-black text-xs">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-black text-yellow-300 text-sm">{step.nameKo}</div>
                  <div className="text-xs text-gray-400 font-bold mt-0.5">{step.description}</div>
                </div>
                <ArrowRight size={16} className="ml-auto text-yellow-300 shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 노트 / Note */}
      {pathway.note && (
        <div className="border-t-4 border-black p-3 bg-gray-100 flex items-start gap-2">
          <AlertCircle size={16} className="text-black shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-gray-700">{pathway.note}</p>
        </div>
      )}
    </div>
  );
}
