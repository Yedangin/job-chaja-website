'use client';

// KOR: 비자 진단 페이지 - 영화 시나리오(Movie Script) 테마 디자인 (#84)
// ENG: Visa diagnosis page - Movie Script theme design (#84)
// 참조 / References: Final Draft, WriterSolo, Arc Studio, StudioBinder, Celtx

import { useState } from 'react';
import {
  Film,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Clapperboard,
  ScrollText,
  User,
  Globe,
  BookOpen,
  DollarSign,
  Target,
  Star,
  Clock,
  TrendingUp,
  FileText,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Minus,
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

// KOR: 스크린 단계를 정의하는 타입 (씬 번호에 해당)
// ENG: Type defining the screen step (corresponds to scene number)
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'result';

// KOR: 각 씬(단계)에 대한 시나리오 메타데이터
// ENG: Screenplay metadata for each scene (step)
const SCENE_META: Record<Step, { sceneNumber: string; slug: string; location: string; timeOfDay: string; moodLine: string }> = {
  nationality: {
    sceneNumber: 'INT.',
    slug: 'SCENE 1 - 출발지',
    location: 'CHARACTER\'S HOME COUNTRY - DAY',
    timeOfDay: 'EXT.',
    moodLine: '당신의 이야기가 시작되는 곳 / Where your story begins',
  },
  age: {
    sceneNumber: 'INT.',
    slug: 'SCENE 2 - 캐릭터 설정',
    location: 'CHARACTER DEVELOPMENT ROOM - DAY',
    timeOfDay: 'INT.',
    moodLine: '주인공의 나이와 시간 / The protagonist\'s age and time',
  },
  educationLevel: {
    sceneNumber: 'INT.',
    slug: 'SCENE 3 - 백스토리',
    location: 'FLASHBACK - UNIVERSITY CAMPUS - PAST',
    timeOfDay: 'INT.',
    moodLine: '캐릭터의 배경과 학력 / Character background and education',
  },
  availableAnnualFund: {
    sceneNumber: 'INT.',
    slug: 'SCENE 4 - 자원',
    location: 'PRODUCTION OFFICE - BUDGET MEETING - DAY',
    timeOfDay: 'INT.',
    moodLine: '이야기를 만들 예산 / Budget to make the story happen',
  },
  finalGoal: {
    sceneNumber: 'INT.',
    slug: 'SCENE 5 - 목표',
    location: 'DREAM SEQUENCE - KOREA - FUTURE',
    timeOfDay: 'EXT.',
    moodLine: '주인공이 원하는 결말 / The ending the protagonist desires',
  },
  priorityPreference: {
    sceneNumber: 'INT.',
    slug: 'SCENE 6 - 전략',
    location: 'WAR ROOM - NIGHT',
    timeOfDay: 'INT.',
    moodLine: '최선의 경로를 선택하라 / Choose the best path forward',
  },
  result: {
    sceneNumber: 'INT.',
    slug: 'ACT III - 클라이맥스',
    location: 'KOREA - THE FINAL SCRIPT - FADE IN',
    timeOfDay: 'EXT.',
    moodLine: '당신의 비자 여정 시나리오 / Your visa journey screenplay',
  },
};

// KOR: 단계 순서 정의
// ENG: Define step order
const STEP_ORDER: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference', 'result'];

// KOR: 씬 전환 효과 텍스트
// ENG: Scene transition text
const TRANSITIONS = ['CUT TO:', 'FADE TO:', 'DISSOLVE TO:', 'SMASH CUT TO:', 'MATCH CUT TO:'];

export default function Diagnosis84Page() {
  // KOR: 현재 단계 상태
  // ENG: Current step state
  const [currentStep, setCurrentStep] = useState<Step>('nationality');

  // KOR: 사용자 입력 데이터 상태
  // ENG: User input data state
  const [inputData, setInputData] = useState<Partial<DiagnosisInput>>({});

  // KOR: 나이 입력 상태 (텍스트 입력)
  // ENG: Age input state (text input)
  const [ageInput, setAgeInput] = useState<string>('');

  // KOR: 결과 데이터 상태
  // ENG: Result data state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 결과 페이지에서 확장된 경로 ID
  // ENG: Expanded pathway ID on result page
  const [expandedPathway, setExpandedPathway] = useState<string | null>('path-1');

  // KOR: 전환 효과 인덱스
  // ENG: Transition effect index
  const [transitionIdx, setTransitionIdx] = useState<number>(0);

  // KOR: 입력값 저장 및 다음 단계로 이동
  // ENG: Save input value and move to next step
  const handleSelect = (field: keyof DiagnosisInput, value: string | number) => {
    const updated = { ...inputData, [field]: value };
    setInputData(updated);

    const currentIdx = STEP_ORDER.indexOf(currentStep);
    const nextStep = STEP_ORDER[currentIdx + 1];
    setTransitionIdx((prev) => (prev + 1) % TRANSITIONS.length);

    if (nextStep === 'result') {
      // KOR: 마지막 입력 후 결과 생성
      // ENG: Generate result after last input
      setResult(mockDiagnosisResult);
    }
    setCurrentStep(nextStep);
  };

  // KOR: 나이 제출 처리
  // ENG: Handle age submission
  const handleAgeSubmit = () => {
    const age = parseInt(ageInput, 10);
    if (!isNaN(age) && age > 15 && age < 80) {
      handleSelect('age', age);
    }
  };

  // KOR: 처음으로 리셋
  // ENG: Reset to beginning
  const handleReset = () => {
    setCurrentStep('nationality');
    setInputData({});
    setAgeInput('');
    setResult(null);
    setExpandedPathway('path-1');
    setTransitionIdx(0);
  };

  // KOR: 씬 메타데이터 가져오기
  // ENG: Get scene metadata
  const sceneMeta = SCENE_META[currentStep];

  // KOR: 현재 씬 번호 (1부터)
  // ENG: Current scene number (starting from 1)
  const currentSceneNum = STEP_ORDER.indexOf(currentStep) + 1;
  const totalInputScenes = 6;

  return (
    // KOR: 전체 페이지 - 타이프라이터 느낌의 흰색 배경
    // ENG: Full page - white background with typewriter feel
    <div className="min-h-screen bg-white font-mono">

      {/* KOR: 스크린 상단 헤더 - 영화 제목 블록 / ENG: Screen top header - movie title block */}
      <header className="bg-black text-white py-4 px-6 flex items-center justify-between border-b-4 border-black">
        <div className="flex items-center gap-3">
          <Clapperboard className="w-6 h-6 text-white shrink-0" />
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gray-400">JobChaJa Studios Presents</p>
            <h1 className="text-lg font-bold tracking-wider uppercase">VISA JOURNEY</h1>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400 tracking-widest">WRITTEN BY</p>
          <p className="text-sm tracking-wider">YOU & JOBCHAJA</p>
        </div>
        {currentStep !== 'result' && (
          <div className="flex items-center gap-2 ml-4">
            <Film className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-300">
              {currentSceneNum < 7 ? `${currentSceneNum} / ${totalInputScenes}` : 'ACT III'}
            </span>
          </div>
        )}
      </header>

      {/* KOR: 씬 헤더 슬러그라인 - 시나리오 형식 / ENG: Scene header slugline - screenplay format */}
      <div className="bg-gray-100 border-b-2 border-black px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">{TRANSITIONS[transitionIdx]}</p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-bold text-black text-sm tracking-widest uppercase">{sceneMeta.slug}</span>
            <span className="text-gray-600 text-sm tracking-wider uppercase">{sceneMeta.location}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 italic">{sceneMeta.moodLine}</p>
        </div>
      </div>

      {/* KOR: 메인 콘텐츠 영역 - 시나리오 종이 느낌 / ENG: Main content area - screenplay paper feel */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* KOR: 입력 단계 씬들 / ENG: Input step scenes */}
        {currentStep !== 'result' && (
          <div className="space-y-6">

            {/* KOR: 씬 번호 타이틀 블록 / ENG: Scene number title block */}
            <div className="text-center border-y-2 border-black py-4 my-6">
              <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-1">SCENE</p>
              <p className="text-5xl font-bold text-black">{String(currentSceneNum).padStart(2, '0')}</p>
            </div>

            {/* KOR: 씬 설명 / ENG: Scene description (action line) */}
            <div className="mb-6">
              <p className="text-sm text-gray-700 leading-relaxed tracking-wide uppercase">
                {/* KOR: 시나리오 ACTION LINE 스타일 / ENG: Screenplay ACTION LINE style */}
                {currentStep === 'nationality' && 'WE OPEN ON: A character standing at a crossroads. Their home country behind them. Korea ahead. They pull out a form. The journey begins with a single question.'}
                {currentStep === 'age' && 'THE CAMERA PUSHES IN. The character opens a worn leather notebook. A timeline stretches across the pages. Age is everything in this story — timing is destiny.'}
                {currentStep === 'educationLevel' && 'FLASHBACK. A montage of classrooms, graduation ceremonies, late-night study sessions. The character looks at their diploma. This is their foundation.'}
                {currentStep === 'availableAnnualFund' && 'INT. OFFICE. The character spreads documents on a desk — bank statements, savings records. The producer (their future self) asks: what\'s the budget for this production?'}
                {currentStep === 'finalGoal' && 'DREAM SEQUENCE. The character imagines their life in Korea — a montage of possibilities. An office in Seoul. A university campus. A permanent home. Which ending do they choose?'}
                {currentStep === 'priorityPreference' && 'WAR ROOM. Maps cover the walls. Possible routes to Korea highlighted in different colors. The strategist looks up: "What matters most on this journey?"'}
              </p>
            </div>

            {/* KOR: 캐릭터 큐 - 대사 형식의 질문 / ENG: Character cue - question in dialogue format */}
            <div className="mb-8">
              {/* KOR: 캐릭터 이름 큐 (대문자, 중앙 정렬) / ENG: Character name cue (uppercase, centered) */}
              <p className="text-center text-xs tracking-[0.4em] uppercase font-bold text-gray-500 mb-1">IMMIGRATION OFFICER (V.O.)</p>
              {/* KOR: 대사 블록 / ENG: Dialogue block */}
              <div className="mx-auto max-w-xl text-center px-12 border-l-0 border-r-0">
                <p className="text-lg font-bold text-black leading-snug tracking-wide">
                  {currentStep === 'nationality' && '"어느 나라에서 오셨나요?\nWhich country are you from?"'}
                  {currentStep === 'age' && '"현재 나이를 알려주세요.\nHow old are you currently?"'}
                  {currentStep === 'educationLevel' && '"최종 학력이 어떻게 되시나요?\nWhat is your highest level of education?"'}
                  {currentStep === 'availableAnnualFund' && '"연간 사용 가능한 자금은 얼마인가요?\nWhat is your annual available budget?"'}
                  {currentStep === 'finalGoal' && '"한국에서 이루고 싶은 최종 목표는?\nWhat is your ultimate goal in Korea?"'}
                  {currentStep === 'priorityPreference' && '"가장 중요하게 생각하는 것은?\nWhat matters most to you on this path?"'}
                </p>
              </div>
            </div>

            {/* KOR: 국적 선택 / ENG: Nationality selection */}
            {currentStep === 'nationality' && (
              <div className="space-y-4">
                <p className="text-xs tracking-widest uppercase text-gray-400 text-center mb-4">— CAST YOUR CHARACTER —</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {popularCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleSelect('nationality', country.name)}
                      className="group flex items-center gap-3 p-3 border-2 border-black hover:bg-black hover:text-white transition-all duration-150 text-left"
                    >
                      <span className="text-xl shrink-0">{country.flag}</span>
                      <span className="text-sm font-bold tracking-wider uppercase">{country.name}</span>
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 mt-4 tracking-wider">— OR TYPE YOUR COUNTRY BELOW —</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER COUNTRY NAME..."
                    className="flex-1 border-b-2 border-black bg-transparent px-0 py-2 text-sm tracking-widest uppercase placeholder:text-gray-300 focus:outline-none focus:border-gray-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleSelect('nationality', e.currentTarget.value.trim());
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input?.value.trim()) handleSelect('nationality', input.value.trim());
                    }}
                    className="px-4 py-2 bg-black text-white text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors"
                  >
                    CAST
                  </button>
                </div>
              </div>
            )}

            {/* KOR: 나이 입력 / ENG: Age input */}
            {currentStep === 'age' && (
              <div className="space-y-6">
                <p className="text-xs tracking-widest uppercase text-gray-400 text-center mb-4">— ENTER CHARACTER AGE —</p>
                {/* KOR: 타이프라이터 스타일 나이 입력 / ENG: Typewriter style age input */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative border-b-4 border-black w-40">
                    <input
                      type="number"
                      value={ageInput}
                      onChange={(e) => setAgeInput(e.target.value)}
                      placeholder="__"
                      min={16}
                      max={79}
                      className="w-full bg-transparent text-center text-6xl font-bold text-black py-4 focus:outline-none tracking-widest placeholder:text-gray-200"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAgeSubmit(); }}
                    />
                    <p className="text-center text-xs tracking-widest uppercase text-gray-400 pb-2">YEARS OLD</p>
                  </div>
                  <button
                    onClick={handleAgeSubmit}
                    disabled={!ageInput || isNaN(parseInt(ageInput, 10))}
                    className="flex items-center gap-2 px-8 py-3 bg-black text-white text-sm tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span>CONFIRM AGE</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
                {/* KOR: 빠른 선택 나이 그룹 / ENG: Quick select age groups */}
                <div className="mt-6">
                  <p className="text-xs tracking-widest uppercase text-gray-400 text-center mb-3">— OR SELECT A RANGE —</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[18, 22, 25, 28, 30, 35, 40].map((age) => (
                      <button
                        key={age}
                        onClick={() => { setAgeInput(String(age)); handleSelect('age', age); }}
                        className="px-4 py-2 border-2 border-black text-sm font-bold hover:bg-black hover:text-white transition-colors tracking-wider"
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* KOR: 학력 선택 / ENG: Education level selection */}
            {currentStep === 'educationLevel' && (
              <div className="space-y-3">
                <p className="text-xs tracking-widest uppercase text-gray-400 text-center mb-4">— SELECT BACKSTORY —</p>
                {educationOptions.map((option, idx) => (
                  <button
                    key={String(option.value)}
                    onClick={() => handleSelect('educationLevel', option.value)}
                    className="w-full flex items-center gap-4 p-4 border-2 border-black hover:bg-black hover:text-white transition-all text-left group"
                  >
                    {/* KOR: 씬 번호 스타일 번호 / ENG: Scene-number style numbering */}
                    <span className="text-xs tracking-widest text-gray-400 group-hover:text-gray-300 shrink-0 w-6">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-bold text-sm tracking-wide uppercase">{option.labelKo}</span>
                    <ChevronRight className="w-4 h-4 ml-auto shrink-0 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}

            {/* KOR: 연간 자금 선택 / ENG: Annual fund selection */}
            {currentStep === 'availableAnnualFund' && (
              <div className="space-y-3">
                <p className="text-xs tracking-widest uppercase text-gray-400 text-center mb-4">— PRODUCTION BUDGET —</p>
                {fundOptions.map((option, idx) => (
                  <button
                    key={String(option.value)}
                    onClick={() => handleSelect('availableAnnualFund', option.value)}
                    className="w-full flex items-center gap-4 p-4 border-2 border-black hover:bg-black hover:text-white transition-all text-left group"
                  >
                    <span className="text-xs tracking-widest text-gray-400 group-hover:text-gray-300 shrink-0 w-6">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <DollarSign className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-gray-300" />
                    <span className="font-bold text-sm tracking-wider">{option.labelKo}</span>
                    <ChevronRight className="w-4 h-4 ml-auto shrink-0 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}

            {/* KOR: 최종 목표 선택 / ENG: Final goal selection */}
            {currentStep === 'finalGoal' && (
              <div className="space-y-3">
                <p className="text-xs tracking-widest uppercase text-gray-400 text-center mb-4">— CHOOSE YOUR ENDING —</p>
                {goalOptions.map((option, idx) => (
                  <button
                    key={String(option.value)}
                    onClick={() => handleSelect('finalGoal', option.value)}
                    className="w-full flex items-center gap-4 p-4 border-2 border-black hover:bg-black hover:text-white transition-all text-left group"
                  >
                    <span className="text-xs tracking-widest text-gray-400 group-hover:text-gray-300 shrink-0 w-6">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <Target className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-gray-300" />
                    <span className="font-bold text-sm tracking-wide uppercase">{option.labelKo}</span>
                    <ChevronRight className="w-4 h-4 ml-auto shrink-0 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}

            {/* KOR: 우선순위 선택 / ENG: Priority preference selection */}
            {currentStep === 'priorityPreference' && (
              <div className="space-y-3">
                <p className="text-xs tracking-widest uppercase text-gray-400 text-center mb-4">— SELECT YOUR STRATEGY —</p>
                {priorityOptions.map((option, idx) => (
                  <button
                    key={String(option.value)}
                    onClick={() => handleSelect('priorityPreference', option.value)}
                    className="w-full flex items-center gap-4 p-4 border-2 border-black hover:bg-black hover:text-white transition-all text-left group"
                  >
                    <span className="text-xs tracking-widest text-gray-400 group-hover:text-gray-300 shrink-0 w-6">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <Star className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-gray-300" />
                    <span className="font-bold text-sm tracking-wide uppercase">{option.labelKo}</span>
                    <ChevronRight className="w-4 h-4 ml-auto shrink-0 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}

            {/* KOR: 씬 하단 - 전환 예고 / ENG: Scene bottom - next transition preview */}
            {currentStep !== 'priorityPreference' && (
              <div className="mt-10 text-center border-t-2 border-dashed border-gray-300 pt-4">
                <p className="text-xs tracking-widest uppercase text-gray-300">
                  {TRANSITIONS[(transitionIdx + 1) % TRANSITIONS.length]} SCENE {Math.min(currentSceneNum + 1, 6)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* KOR: 결과 페이지 - ACT III 시나리오 / ENG: Result page - ACT III screenplay */}
        {currentStep === 'result' && result && (
          <div className="space-y-8">

            {/* KOR: 타이틀 페이지 블록 / ENG: Title page block */}
            <div className="text-center py-8 border-y-4 border-black">
              <p className="text-xs tracking-[0.5em] uppercase text-gray-400 mb-2">FADE IN:</p>
              <p className="text-xs tracking-[0.4em] uppercase text-gray-500 mb-6">A JOBCHAJA ORIGINAL SCREENPLAY</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-widest uppercase leading-tight mb-2">
                YOUR VISA<br />JOURNEY
              </h2>
              <p className="text-sm text-gray-500 tracking-wider mb-6">Written Based on True Character Data</p>
              {/* KOR: 캐릭터 요약 / ENG: Character summary */}
              <div className="inline-block text-left border-2 border-black px-6 py-4 bg-gray-50">
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-2 text-center">CHARACTER PROFILE</p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-400 uppercase tracking-wider text-xs">FROM: </span><span className="font-bold">{result.userInput.nationality}</span></p>
                  <p><span className="text-gray-400 uppercase tracking-wider text-xs">AGE: </span><span className="font-bold">{result.userInput.age}</span></p>
                  <p><span className="text-gray-400 uppercase tracking-wider text-xs">EDUCATION: </span><span className="font-bold">{result.userInput.educationLevel}</span></p>
                  <p><span className="text-gray-400 uppercase tracking-wider text-xs">GOAL: </span><span className="font-bold">{result.userInput.finalGoal}</span></p>
                </div>
              </div>
            </div>

            {/* KOR: 서문 / ENG: Opening narration */}
            <div className="py-4">
              <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3 text-center">NARRATOR (V.O.)</p>
              <p className="text-center text-sm text-gray-700 leading-relaxed italic tracking-wide max-w-xl mx-auto px-8">
                &ldquo;The journey to Korea is not a single road — it is a choice between several scripts.
                Each pathway below is a different story your life could tell.
                Read carefully. Choose wisely. Your future is the final cut.&rdquo;
              </p>
              <p className="text-center text-xs text-gray-400 mt-3 tracking-widest">— {result.pathways.length} PATHWAYS IDENTIFIED —</p>
            </div>

            {/* KOR: 각 비자 경로 씬 / ENG: Each visa pathway scene */}
            {result.pathways.map((pathway: RecommendedPathway, sceneIdx: number) => (
              <div key={pathway.id} className="border-2 border-black">

                {/* KOR: 씬 헤더 슬러그라인 / ENG: Scene header slugline */}
                <div
                  className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors ${expandedPathway === pathway.id ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  onClick={() => setExpandedPathway(expandedPathway === pathway.id ? null : pathway.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`text-xs tracking-widest shrink-0 ${expandedPathway === pathway.id ? 'text-gray-400' : 'text-gray-500'}`}>
                      INT. SCENE {sceneIdx + 1}
                    </span>
                    <span className="font-bold text-sm tracking-wider uppercase truncate">{pathway.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {/* KOR: 실현 가능성 배지 / ENG: Feasibility badge */}
                    <span className={`text-xs px-2 py-1 font-bold tracking-wider ${
                      pathway.feasibilityLabel === '매우 높음' ? 'bg-white text-black border border-black' :
                      pathway.feasibilityLabel === '높음' ? 'bg-white text-black border border-black' :
                      'bg-white text-black border border-black'
                    } ${expandedPathway === pathway.id ? '' : ''}`}>
                      {pathway.feasibilityScore}%
                    </span>
                    <span className="text-xs tracking-wider">{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
                    {expandedPathway === pathway.id
                      ? <ChevronUp className="w-4 h-4 shrink-0" />
                      : <ChevronDown className="w-4 h-4 shrink-0" />
                    }
                  </div>
                </div>

                {/* KOR: 씬 내용 (펼침) / ENG: Scene content (expanded) */}
                {expandedPathway === pathway.id && (
                  <div className="px-5 py-6 space-y-6">

                    {/* KOR: ACTION LINE - 경로 설명 / ENG: ACTION LINE - pathway description */}
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">ACTION</p>
                      <p className="text-sm text-gray-800 leading-relaxed tracking-wide uppercase">
                        {pathway.description}
                      </p>
                    </div>

                    {/* KOR: 통계 블록 / ENG: Stats block */}
                    <div className="grid grid-cols-3 gap-3 border-y-2 border-dashed border-gray-300 py-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">RUNTIME</p>
                        <p className="font-bold text-lg">{pathway.totalDurationMonths}mo</p>
                      </div>
                      <div className="text-center border-x-2 border-dashed border-gray-300">
                        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">BUDGET</p>
                        <p className="font-bold text-lg">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">RATING</p>
                        <p className="font-bold text-lg">{pathway.feasibilityLabel}</p>
                      </div>
                    </div>

                    {/* KOR: 비자 체인 - 씬 진행 / ENG: Visa chain - scene progression */}
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">VISA CHAIN — SCENE PROGRESSION</p>
                      <div className="flex items-center flex-wrap gap-0">
                        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, vcIdx) => (
                          <div key={vcIdx} className="flex items-center">
                            <div className="border-2 border-black px-3 py-2 text-center min-w-[80px]">
                              <p className="font-bold text-sm tracking-wider">{vc.visa}</p>
                              <p className="text-xs text-gray-500 tracking-wide">{vc.duration}</p>
                            </div>
                            {vcIdx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                              <ArrowRight className="w-5 h-5 text-gray-400 mx-1 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* KOR: 마일스톤 - 씬 비트 / ENG: Milestones - scene beats */}
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">SCENE BEATS — KEY MILESTONES</p>
                      <div className="space-y-0">
                        {pathway.milestones.map((milestone, mIdx) => (
                          <div key={mIdx} className="flex gap-4 border-b border-dashed border-gray-200 last:border-0 py-3">
                            {/* KOR: 비트 번호 / ENG: Beat number */}
                            <div className="shrink-0 w-6 text-center">
                              <span className="text-xs font-bold text-gray-400">{String(mIdx + 1).padStart(2, '0')}</span>
                            </div>
                            <div className="shrink-0 text-lg">{milestone.emoji}</div>
                            <div className="flex-1 min-w-0">
                              {/* KOR: 대문자 타이틀 / ENG: Uppercase title */}
                              <p className="font-bold text-xs tracking-[0.2em] uppercase text-black mb-1">{milestone.title}</p>
                              {/* KOR: 액션 라인 스타일 설명 / ENG: Action line style description */}
                              <p className="text-xs text-gray-600 leading-relaxed tracking-wide uppercase">{milestone.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* KOR: 캐릭터 노트 / ENG: Character notes */}
                    <div className="bg-gray-50 border border-gray-300 p-4">
                      <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">DIRECTOR&apos;S NOTE / 감독 노트</p>
                      <p className="text-xs text-gray-600 leading-relaxed italic">
                        &ldquo;This pathway is rated {pathway.feasibilityLabel} ({pathway.feasibilityScore}%) based on your character profile.
                        Expected screen time: {pathway.totalDurationMonths} months. Production cost: approximately ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()} USD.
                        Consult an immigration expert before final casting decisions.&rdquo;
                      </p>
                    </div>

                  </div>
                )}

                {/* KOR: 씬 전환 표시 (접힌 상태) / ENG: Scene transition indicator (collapsed) */}
                {expandedPathway !== pathway.id && (
                  <div className="px-5 py-2 bg-white">
                    <p className="text-xs text-gray-400 tracking-wider">{((pathway as any).description ?? pathway.note ?? '').slice(0, 80)}...</p>
                  </div>
                )}
              </div>
            ))}

            {/* KOR: 엔딩 크레딧 / ENG: End credits */}
            <div className="text-center border-y-4 border-black py-8 space-y-3">
              <p className="text-xs tracking-[0.5em] uppercase text-gray-400">FADE OUT.</p>
              <div className="py-4">
                <p className="text-2xl font-bold tracking-widest text-black uppercase">THE END</p>
                <p className="text-xs text-gray-400 tracking-widest mt-2">— BUT YOUR STORY IS JUST BEGINNING —</p>
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-gray-400">
                A JOBCHAJA PRODUCTION · ALL RIGHTS RESERVED
              </p>
            </div>

            {/* KOR: 리셋 버튼 / ENG: Reset button */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-black text-black text-sm tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>REWRITE SCRIPT</span>
              </button>
              <button
                className="flex items-center justify-center gap-2 px-8 py-3 bg-black text-white text-sm tracking-[0.3em] uppercase hover:bg-gray-800 transition-colors"
              >
                <ScrollText className="w-4 h-4 shrink-0" />
                <span>SAVE SCREENPLAY</span>
              </button>
            </div>

            {/* KOR: 법적 면책 조항 / ENG: Legal disclaimer */}
            <p className="text-center text-xs text-gray-300 tracking-wide pb-4">
              This screenplay is based on general information only and does not constitute legal immigration advice.
              Consult a certified immigration attorney for your actual case.
            </p>
          </div>
        )}
      </main>

      {/* KOR: 하단 페이지 번호 - 시나리오 형식 / ENG: Bottom page number - screenplay format */}
      <footer className="sticky bottom-0 bg-white border-t-2 border-black px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="text-xs text-gray-400 tracking-widest uppercase">
            {currentStep !== 'result' ? `PAGE ${currentSceneNum} OF 6` : 'FINAL DRAFT'}
          </span>
        </div>
        <p className="text-xs text-gray-300 tracking-widest uppercase hidden sm:block">JOBCHAJA STUDIOS © 2026</p>
        <div className="flex items-center gap-1">
          {STEP_ORDER.slice(0, 6).map((step, idx) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full border border-black transition-colors ${
                STEP_ORDER.indexOf(currentStep) > idx || currentStep === 'result'
                  ? 'bg-black'
                  : STEP_ORDER.indexOf(currentStep) === idx
                  ? 'bg-gray-500'
                  : 'bg-white'
              }`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
