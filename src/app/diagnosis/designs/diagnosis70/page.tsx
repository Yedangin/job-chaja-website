'use client';

// KOR: 위키백과 스타일의 비자 진단 페이지 (Design #70)
// ENG: Wikipedia-style visa diagnosis page (Design #70)

import { useState } from 'react';
import {
  Search,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Clock,
  DollarSign,
  Globe,
  FileText,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink,
  ArrowRight,
  List,
  Hash,
  Edit3,
  History,
  Share2,
  Bookmark,
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

// KOR: 진단 단계 타입 정의
// ENG: Diagnosis step type definition
type DiagnosisStep = 'search' | 'input' | 'result';

// KOR: 목차 항목 타입
// ENG: Table of contents item type
interface TocItem {
  id: string;
  label: string;
  sublabel?: string;
}

// KOR: 위키 스타일 색상 팔레트 상수
// ENG: Wiki-style color palette constants
const WIKI_BLUE = 'text-blue-700';
const WIKI_BLUE_BG = 'bg-blue-50';
const WIKI_BORDER = 'border-gray-300';
const WIKI_LINK = 'text-blue-600 hover:text-blue-800 cursor-pointer underline';

// KOR: 목차 항목 정의
// ENG: Table of contents item definitions
const tocItems: TocItem[] = [
  { id: 'overview', label: '1 개요', sublabel: 'Overview' },
  { id: 'input', label: '2 진단 입력', sublabel: 'Diagnosis Input' },
  { id: 'pathways', label: '3 비자 경로', sublabel: 'Visa Pathways' },
  { id: 'comparison', label: '4 경로 비교표', sublabel: 'Comparison Table' },
  { id: 'related', label: '5 관련 항목', sublabel: 'Related Articles' },
  { id: 'references', label: '6 참고 문헌', sublabel: 'References' },
];

// KOR: 점수에 따른 텍스트 색상 반환 (인포박스용)
// ENG: Returns text color based on score (for infobox)
function getScoreTextColor(label: RecommendedPathway['feasibilityLabel']): string {
  switch (label) {
    case '매우 높음': return 'text-blue-700';
    case '높음': return 'text-green-700';
    case '보통': return 'text-yellow-700';
    case '낮음': return 'text-orange-700';
    case '매우 낮음': return 'text-red-700';
    default: return 'text-gray-700';
  }
}

// KOR: 경로 상태 배지 배경색
// ENG: Pathway status badge background color
function getStatusBadgeBg(label: RecommendedPathway['feasibilityLabel']): string {
  switch (label) {
    case '매우 높음': return 'bg-blue-100 text-blue-800 border-blue-300';
    case '높음': return 'bg-green-100 text-green-800 border-green-300';
    case '보통': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case '낮음': return 'bg-orange-100 text-orange-800 border-orange-300';
    case '매우 낮음': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export default function WikipediaDiagnosisPage() {
  // KOR: 현재 진단 단계 상태
  // ENG: Current diagnosis step state
  const [step, setStep] = useState<DiagnosisStep>('search');

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<DiagnosisInput>({
    nationality: '',
    age: 25,
    educationLevel: '',
    availableAnnualFund: '',
    finalGoal: '',
    priorityPreference: '',
  });

  // KOR: 진단 결과 상태
  // ENG: Diagnosis result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 선택된 경로 상태 (결과 화면에서 선택한 경로)
  // ENG: Selected pathway state (pathway selected on results screen)
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>('path-1');

  // KOR: 목차 펼침 상태
  // ENG: Table of contents expanded state
  const [tocExpanded, setTocExpanded] = useState(true);

  // KOR: 경로 섹션 펼침 상태
  // ENG: Pathway section expanded state
  const [expandedPathways, setExpandedPathways] = useState<Record<string, boolean>>({
    'path-1': true,
    'path-2': false,
    'path-3': false,
  });

  // KOR: 검색 쿼리 상태
  // ENG: Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // KOR: 현재 입력 단계 (0~5)
  // ENG: Current input step (0~5)
  const [inputStep, setInputStep] = useState(0);

  // KOR: 진단 실행 핸들러
  // ENG: Diagnosis execution handler
  function handleDiagnose() {
    setResult(mockDiagnosisResult);
    setStep('result');
  }

  // KOR: 다음 입력 단계 이동
  // ENG: Move to next input step
  function handleNextInputStep() {
    if (inputStep < 5) {
      setInputStep(inputStep + 1);
    } else {
      handleDiagnose();
    }
  }

  // KOR: 경로 섹션 토글
  // ENG: Toggle pathway section
  function togglePathway(id: string) {
    setExpandedPathways(prev => ({ ...prev, [id]: !prev[id] }));
  }

  // KOR: 현재 입력 단계 필드 레이블 반환
  // ENG: Returns current input step field label
  const inputStepLabels = [
    '국적 (Nationality)',
    '나이 (Age)',
    '최종 학력 (Education Level)',
    '연간 가용 자금 (Annual Fund)',
    '최종 목표 (Final Goal)',
    '우선순위 (Priority)',
  ];

  // KOR: 검색창 화면 렌더링
  // ENG: Render search screen
  if (step === 'search') {
    return (
      <div className="min-h-screen bg-white font-serif">
        {/* KOR: 위키 상단 헤더 바 / ENG: Wiki top header bar */}
        <header className="border-b border-gray-300 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-800 text-base">잡차자 비자 백과</span>
              <span className="text-gray-400">|</span>
              <span className={WIKI_LINK}>한국어</span>
              <span className="text-gray-400">|</span>
              <span className={WIKI_LINK}>English</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={WIKI_LINK}>로그인</span>
              <span className={WIKI_LINK}>계정 만들기</span>
            </div>
          </div>
        </header>

        {/* KOR: 위키 로고 + 검색 영역 / ENG: Wiki logo + search area */}
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          {/* KOR: 위키 로고 스타일 / ENG: Wiki logo style */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-32 h-32 mb-4 relative">
              {/* KOR: 위키피디아 퍼즐볼 스타일 로고 / ENG: Wikipedia puzzle ball style logo */}
              <div className="w-32 h-32 rounded-full border-4 border-gray-700 flex items-center justify-center bg-white shadow-lg">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-gray-700 mx-auto mb-1" />
                  <div className="text-xs text-gray-600 font-bold">비자</div>
                  <div className="text-xs text-gray-600">百科</div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-1 tracking-tight">
              잡차자 비자 백과
            </h1>
            <p className="text-gray-500 text-lg">
              한국 비자 경로 무료 백과사전
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Free Korean Visa Pathway Encyclopedia
            </p>
          </div>

          {/* KOR: 위키 스타일 검색창 / ENG: Wiki-style search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative flex mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="비자 경로 검색 · Search visa pathways"
                className="flex-1 border border-gray-400 rounded-l px-4 py-3 text-base focus:outline-none focus:border-blue-500 bg-white"
              />
              <button
                onClick={() => setStep('input')}
                className="bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-400 rounded-r px-5 py-3 text-sm font-medium text-gray-700"
              >
                검색
              </button>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setStep('input')}
                className="bg-gray-100 hover:bg-gray-200 border border-gray-400 rounded px-5 py-2 text-sm text-gray-700"
              >
                비자 진단 시작
              </button>
              <button
                onClick={() => { setResult(mockDiagnosisResult); setStep('result'); }}
                className="bg-gray-100 hover:bg-gray-200 border border-gray-400 rounded px-5 py-2 text-sm text-gray-700"
              >
                샘플 결과 보기
              </button>
            </div>
          </div>

          {/* KOR: 카테고리 탐색 섹션 / ENG: Category browsing section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-left border-b border-gray-300 pb-2">
              비자 카테고리 탐색
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
              {[
                { icon: '🎓', title: '유학 비자', desc: 'D-2, D-4 계열', sub: 'Study Visas' },
                { icon: '💼', title: '취업 비자', desc: 'E-7, E-9, H-2 계열', sub: 'Work Visas' },
                { icon: '🏡', title: '거주 비자', desc: 'F-2, F-5 영주권', sub: 'Residence Visas' },
                { icon: '🌐', title: '단기 비자', desc: 'C-3, B-1 관광', sub: 'Short-term Visas' },
                { icon: '👨‍👩‍👧', title: '가족 비자', desc: 'F-3, F-6 동반/결혼', sub: 'Family Visas' },
                { icon: '⭐', title: '점수제 비자', desc: 'F-2-7 거주(점수제)', sub: 'Points-based' },
              ].map((cat) => (
                <button
                  key={cat.title}
                  onClick={() => setStep('input')}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="text-2xl shrink-0">{cat.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{cat.title}</div>
                    <div className="text-xs text-gray-500">{cat.desc}</div>
                    <div className="text-xs text-gray-400 italic mt-0.5">{cat.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* KOR: 통계 바 / ENG: Statistics bar */}
          <div className="mt-12 flex justify-center gap-10 text-sm text-gray-500">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">31개</div>
              <div>비자 유형</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">14개</div>
              <div>평가 엔진</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">2,629개</div>
              <div>테스트 케이스</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KOR: 입력 단계 화면 렌더링 (위키 문서 편집 스타일)
  // ENG: Render input step screen (wiki document editing style)
  if (step === 'input') {
    const inputFields = [
      {
        key: 'nationality',
        label: '국적 (Nationality)',
        desc: '귀하의 국적을 선택하십시오.',
        render: () => (
          <div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
              {popularCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setInput(prev => ({ ...prev, nationality: c.name }))}
                  className={`flex items-center gap-2 px-3 py-2 border rounded text-sm transition-colors ${
                    input.nationality === c.name
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-300 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="직접 입력 / Type manually"
              value={popularCountries.find(c => c.name === input.nationality) ? '' : input.nationality}
              onChange={e => setInput(prev => ({ ...prev, nationality: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        ),
      },
      {
        key: 'age',
        label: '나이 (Age)',
        desc: '귀하의 현재 나이를 입력하십시오.',
        render: () => (
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={18}
              max={60}
              value={input.age}
              onChange={e => setInput(prev => ({ ...prev, age: Number(e.target.value) }))}
              className="flex-1 accent-blue-600"
            />
            <div className="w-20 border border-gray-300 rounded px-3 py-2 text-center font-bold text-blue-700 text-lg">
              {input.age}세
            </div>
          </div>
        ),
      },
      {
        key: 'educationLevel',
        label: '최종 학력 (Education Level)',
        desc: '귀하의 최종 학력을 선택하십시오.',
        render: () => (
          <div className="space-y-2">
            {educationOptions.map((edu) => (
              <label key={edu} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="education"
                  value={edu}
                  checked={input.educationLevel === edu}
                  onChange={() => setInput(prev => ({ ...prev, educationLevel: edu }))}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className={`text-sm ${input.educationLevel === edu ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>
                  {edu}
                </span>
              </label>
            ))}
          </div>
        ),
      },
      {
        key: 'availableAnnualFund',
        label: '연간 가용 자금 (Annual Fund)',
        desc: '비자 신청 및 체류에 사용 가능한 연간 자금 범위를 선택하십시오.',
        render: () => (
          <div className="space-y-2">
            {fundOptions.map((fund) => (
              <label key={fund} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="fund"
                  value={fund}
                  checked={input.availableAnnualFund === fund}
                  onChange={() => setInput(prev => ({ ...prev, availableAnnualFund: fund }))}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className={`text-sm ${input.availableAnnualFund === fund ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>
                  {fund}
                </span>
              </label>
            ))}
          </div>
        ),
      },
      {
        key: 'finalGoal',
        label: '최종 목표 (Final Goal)',
        desc: '귀하의 한국 체류 최종 목표를 선택하십시오.',
        render: () => (
          <div className="space-y-2">
            {goalOptions.map((goal) => (
              <label key={goal} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="goal"
                  value={goal}
                  checked={input.finalGoal === goal}
                  onChange={() => setInput(prev => ({ ...prev, finalGoal: goal }))}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className={`text-sm ${input.finalGoal === goal ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>
                  {goal}
                </span>
              </label>
            ))}
          </div>
        ),
      },
      {
        key: 'priorityPreference',
        label: '우선순위 (Priority Preference)',
        desc: '경로 추천 시 가장 중요하게 여기는 기준을 선택하십시오.',
        render: () => (
          <div className="space-y-2">
            {priorityOptions.map((prio) => (
              <label key={prio} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="priority"
                  value={prio}
                  checked={input.priorityPreference === prio}
                  onChange={() => setInput(prev => ({ ...prev, priorityPreference: prio }))}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className={`text-sm ${input.priorityPreference === prio ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>
                  {prio}
                </span>
              </label>
            ))}
          </div>
        ),
      },
    ];

    const current = inputFields[inputStep];

    return (
      <div className="min-h-screen bg-white font-serif">
        {/* KOR: 헤더 / ENG: Header */}
        <header className="border-b border-gray-300 bg-white sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
            <button onClick={() => setStep('search')} className="font-bold text-gray-800 text-base hover:text-blue-600">
              ← 잡차자 비자 백과
            </button>
            <div className="flex items-center gap-3 text-gray-500">
              <Edit3 className="w-4 h-4" />
              <span>비자 진단 문서 편집 중</span>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* KOR: 위키 문서 제목 / ENG: Wiki document title */}
          <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-300 pb-4 mb-6">
            비자 경로 자가 진단
            <span className="text-base font-normal text-gray-500 ml-3">Visa Pathway Self-Diagnosis</span>
          </h1>

          {/* KOR: 편집 안내 배너 / ENG: Edit notice banner */}
          <div className="border border-blue-300 bg-blue-50 rounded p-3 mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>진단 입력 안내</strong>: 아래 각 항목에 정보를 입력하면 자동으로 비자 경로를 분석합니다.
              <br />
              <span className="text-blue-600 text-xs">Enter your information below. Visa pathways will be automatically analyzed.</span>
            </div>
          </div>

          {/* KOR: 진행 단계 바 / ENG: Progress steps bar */}
          <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
            {inputFields.map((field, idx) => (
              <div key={idx} className="flex items-center">
                <button
                  onClick={() => setInputStep(idx)}
                  className={`px-3 py-1.5 rounded text-xs whitespace-nowrap border transition-colors ${
                    idx === inputStep
                      ? 'bg-blue-600 text-white border-blue-600'
                      : idx < inputStep
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-gray-50 text-gray-500 border-gray-300'
                  }`}
                >
                  {idx + 1}. {field.label.split(' ')[0]}
                </button>
                {idx < inputFields.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-gray-400 mx-0.5 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* KOR: 현재 입력 필드 카드 (위키 섹션 스타일) / ENG: Current input field card (wiki section style) */}
          <div className="border border-gray-300 rounded-sm">
            {/* KOR: 섹션 제목 / ENG: Section title */}
            <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                {inputStep + 1}. {current.label}
              </h2>
              <span className="text-xs text-gray-500">{inputStep + 1} / {inputFields.length}</span>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-5 italic">{current.desc}</p>
              {current.render()}
            </div>
          </div>

          {/* KOR: 이전/다음 버튼 / ENG: Previous/next buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => inputStep > 0 ? setInputStep(inputStep - 1) : setStep('search')}
              className="px-4 py-2 border border-gray-400 rounded text-sm text-gray-700 hover:bg-gray-100"
            >
              ← 이전
            </button>
            <button
              onClick={handleNextInputStep}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
            >
              {inputStep < 5 ? '다음 →' : '비자 경로 분석 실행'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // KOR: 결과 화면 렌더링 (위키 문서 스타일)
  // ENG: Render results screen (wiki document style)
  const pathways = result?.pathways ?? mockDiagnosisResult.pathways;
  const topPathway = pathways.find(p => p.id === selectedPathwayId) ?? pathways[0];

  return (
    <div className="min-h-screen bg-white font-serif">
      {/* KOR: 위키 상단 내비게이션 바 / ENG: Wiki top navigation bar */}
      <header className="border-b border-gray-300 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('search')} className="font-bold text-gray-800 hover:text-blue-600 text-sm">
              잡차자 비자 백과
            </button>
            <span className="text-gray-300">|</span>
            <div className="relative hidden md:block">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                className="pl-7 pr-3 py-1 border border-gray-300 rounded text-xs w-48 focus:outline-none focus:border-blue-400"
                placeholder="비자 검색..."
              />
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-blue-600">
              <History className="w-3.5 h-3.5" /> 기록
            </button>
            <button className="flex items-center gap-1 hover:text-blue-600">
              <Share2 className="w-3.5 h-3.5" /> 공유
            </button>
            <button className="flex items-center gap-1 hover:text-blue-600">
              <Bookmark className="w-3.5 h-3.5" /> 저장
            </button>
          </div>
        </div>
      </header>

      {/* KOR: 탭 메뉴 (문서 / 토론 / 편집) / ENG: Tab menu (Article / Talk / Edit) */}
      <div className="border-b border-gray-300 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-0 text-sm">
          {['문서', '토론', '원본 편집', '역사'].map((tab, idx) => (
            <button
              key={tab}
              className={`px-4 py-2 border-b-2 text-sm ${
                idx === 0
                  ? 'border-b-2 border-blue-600 text-blue-700 font-medium -mb-px'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* KOR: 메인 콘텐츠 영역 / ENG: Main content area */}
        <main className="flex-1 min-w-0">
          {/* KOR: 문서 제목 / ENG: Article title */}
          <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-300 pb-3 mb-4">
            비자 경로 진단 결과
            <span className="text-sm font-normal text-gray-500 ml-3">Visa Pathway Diagnosis Result</span>
          </h1>

          {/* KOR: 주의 배너 / ENG: Notice banner */}
          <div className="border border-orange-300 bg-orange-50 rounded p-3 mb-5 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <span className="text-orange-800">
              이 문서는 자동 분석 결과이며 법적 효력이 없습니다. 정확한 비자 요건은 출입국관리소에서 확인하세요.
            </span>
          </div>

          {/* ── Section 1: 개요 ── */}
          <section id="overview" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1.5 mb-4 flex items-center gap-2">
              <span className="text-gray-500 font-normal text-base">1</span> 개요
              <span className="text-sm font-normal text-gray-400 italic ml-1">Overview</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              본 진단 결과는 <strong>{result?.userInput.nationality ?? mockInput.nationality}</strong> 국적,
              <strong> {result?.userInput.age ?? mockInput.age}세</strong>,
              최종 학력 <strong>{result?.userInput.educationLevel ?? mockInput.educationLevel}</strong> 기준으로
              분석되었습니다. 총 <strong className="text-blue-700">{pathways.length}개</strong>의 비자 경로가 추천됩니다.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This result is based on nationality: <em>{result?.userInput.nationality ?? mockInput.nationality}</em>,
              age: <em>{result?.userInput.age ?? mockInput.age}</em>,
              education: <em>{result?.userInput.educationLevel ?? mockInput.educationLevel}</em>.
              A total of <strong>{pathways.length}</strong> visa pathways are recommended.
            </p>
          </section>

          {/* ── Section 2: 진단 입력 ── */}
          <section id="input" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1.5 mb-4">
              <span className="text-gray-500 font-normal text-base mr-1">2</span> 진단 입력
              <span className="text-sm font-normal text-gray-400 italic ml-2">Diagnosis Input</span>
            </h2>
            {/* KOR: 위키 인포박스 스타일 / ENG: Wiki infobox style */}
            <div className="float-right ml-6 mb-4 border border-gray-400 rounded-sm w-64 text-sm shadow-sm">
              <div className="bg-blue-700 text-white px-3 py-2 text-center font-bold text-sm">
                진단 프로필
                <div className="text-xs font-normal opacity-80">Diagnosis Profile</div>
              </div>
              <table className="w-full border-collapse">
                <tbody>
                  {[
                    { label: '국적', value: result?.userInput.nationality ?? mockInput.nationality },
                    { label: '나이', value: `${result?.userInput.age ?? mockInput.age}세` },
                    { label: '학력', value: result?.userInput.educationLevel ?? mockInput.educationLevel },
                    { label: '자금', value: result?.userInput.availableAnnualFund ?? mockInput.availableAnnualFund },
                    { label: '목표', value: result?.userInput.finalGoal ?? mockInput.finalGoal },
                    { label: '우선순위', value: result?.userInput.priorityPreference ?? mockInput.priorityPreference },
                  ].map((row, idx) => (
                    <tr key={row.label} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-2 py-1.5 text-gray-600 font-medium border-b border-gray-200 w-20">{row.label}</td>
                      <td className="px-2 py-1.5 text-gray-800 border-b border-gray-200">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-3 py-2 bg-gray-50 text-center">
                <button
                  onClick={() => { setInputStep(0); setStep('input'); }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  입력 수정하기
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              우측의 인포박스는 진단에 사용된 입력 데이터를 요약합니다. 각 항목은 비자 적합성 평가에 사용된 기준입니다.
              연간 가용 자금은 비자 신청 수수료, 체류 비용, 교육비 등 전반적인 비용 부담을 나타냅니다.
            </p>
            <div className="clear-both"></div>
          </section>

          {/* ── Section 3: 비자 경로 ── */}
          <section id="pathways" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1.5 mb-4">
              <span className="text-gray-500 font-normal text-base mr-1">3</span> 비자 경로
              <span className="text-sm font-normal text-gray-400 italic ml-2">Visa Pathways</span>
            </h2>

            {pathways.map((pathway, idx) => (
              <div key={pathway.id} className="mb-6">
                {/* KOR: 하위 섹션 제목 / ENG: Subsection title */}
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400 font-normal text-sm">3.{idx + 1}</span>
                    <span>{getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded border font-normal ${getStatusBadgeBg(pathway.feasibilityLabel)}`}>
                      {pathway.feasibilityLabel} ({pathway.feasibilityScore}점)
                    </span>
                    <button
                      onClick={() => togglePathway(pathway.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                    >
                      {expandedPathways[pathway.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      {expandedPathways[pathway.id] ? '접기' : '펼치기'}
                    </button>
                  </div>
                </h3>

                {expandedPathways[pathway.id] && (
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      {pathway.description}
                    </p>

                    {/* KOR: 비자 체인 (위키 스타일 플로우차트) / ENG: Visa chain (wiki-style flowchart) */}
                    <div className="mb-4">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">비자 체인 Visa Chain</div>
                      <div className="flex items-center gap-1 flex-wrap">
                        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, vcIdx) => (
                          <div key={vcIdx} className="flex items-center gap-1">
                            <div className="border border-blue-400 bg-blue-50 rounded px-3 py-2 text-center">
                              <div className="font-bold text-blue-800 text-sm">{vc.visa}</div>
                              <div className="text-xs text-blue-600">{vc.duration}</div>
                            </div>
                            {vcIdx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                              <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* KOR: 마일스톤 목록 / ENG: Milestones list */}
                    <div className="mb-4">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">주요 단계 Milestones</div>
                      <ol className="space-y-2">
                        {pathway.milestones.map((ms, msIdx) => (
                          <li key={msIdx} className="flex items-start gap-3 text-sm">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-bold mt-0.5">
                              {msIdx + 1}
                            </span>
                            <div>
                              <span className="font-medium text-gray-800">{ms.emoji} {ms.title}</span>
                              <span className="text-gray-500"> — </span>
                              <span className="text-gray-600">{ms.description}</span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* KOR: 경로 요약 수치 / ENG: Pathway summary figures */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        총 기간: <strong>{pathway.totalDurationMonths}개월</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        예상 비용: <strong>${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Star className="w-4 h-4 text-gray-400" />
                        실현 가능성: <strong className={getScoreTextColor(pathway.feasibilityLabel)}>{pathway.feasibilityLabel}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* ── Section 4: 경로 비교표 ── */}
          <section id="comparison" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1.5 mb-4">
              <span className="text-gray-500 font-normal text-base mr-1">4</span> 경로 비교표
              <span className="text-sm font-normal text-gray-400 italic ml-2">Comparison Table</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-3 py-2 text-left font-medium border border-blue-600">경로 Pathway</th>
                    <th className="px-3 py-2 text-center font-medium border border-blue-600">기간 Duration</th>
                    <th className="px-3 py-2 text-center font-medium border border-blue-600">비용 Cost</th>
                    <th className="px-3 py-2 text-center font-medium border border-blue-600">실현 가능성</th>
                    <th className="px-3 py-2 text-center font-medium border border-blue-600">점수</th>
                  </tr>
                </thead>
                <tbody>
                  {pathways.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`cursor-pointer transition-colors ${
                        selectedPathwayId === p.id ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50`}
                      onClick={() => setSelectedPathwayId(p.id)}
                    >
                      <td className="px-3 py-2 border border-gray-300">
                        <span className={WIKI_LINK}>{getFeasibilityEmoji(p.feasibilityLabel)} {p.name}</span>
                      </td>
                      <td className="px-3 py-2 border border-gray-300 text-center">{p.totalDurationMonths}개월</td>
                      <td className="px-3 py-2 border border-gray-300 text-center">${((p as any).estimatedCostUSD ?? p.estimatedCostWon ?? 0).toLocaleString()}</td>
                      <td className="px-3 py-2 border border-gray-300 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs border ${getStatusBadgeBg(p.feasibilityLabel)}`}>
                          {p.feasibilityLabel}
                        </span>
                      </td>
                      <td className="px-3 py-2 border border-gray-300 text-center font-bold text-blue-700">
                        {p.feasibilityScore}점
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              ※ 표의 행을 클릭하면 해당 경로가 선택됩니다. Click a row to select the pathway.
            </p>
          </section>

          {/* ── Section 5: 관련 항목 ── */}
          <section id="related" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1.5 mb-4">
              <span className="text-gray-500 font-normal text-base mr-1">5</span> 관련 항목
              <span className="text-sm font-normal text-gray-400 italic ml-2">Related Articles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockPathways.map((mp: CompatPathway) => (
                <div key={mp.id} className="border border-gray-200 rounded p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className={WIKI_LINK + ' font-medium text-sm'}>{mp.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 ml-6">
                    {((mp as any).tags ?? mp.highlights ?? []).map((tag: string) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {[
                { name: '고용허가제 (EPS)', desc: '비전문취업(E-9) 신청 절차' },
                { name: '사회통합프로그램 (KIIP)', desc: '이민자 한국어·사회 교육' },
                { name: '점수제 영주권 (F-5)', desc: 'F-2-7 거주자 영주권 전환' },
              ].map(item => (
                <div key={item.name} className="border border-gray-200 rounded p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className={WIKI_LINK + ' font-medium text-sm'}>{item.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 6: 참고 문헌 ── */}
          <section id="references" className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-1.5 mb-4">
              <span className="text-gray-500 font-normal text-base mr-1">6</span> 참고 문헌
              <span className="text-sm font-normal text-gray-400 italic ml-2">References</span>
            </h2>
            <ol className="space-y-2 text-sm text-gray-700">
              {[
                '출입국관리법 시행령 (법무부, 2024)',
                '외국인력 고용 등에 관한 법률 (고용노동부)',
                '재외동포 출입국과 법적 지위에 관한 법률',
                '한국 법무부 출입국·외국인 정책본부 공식 사이트 (immigration.go.kr)',
                'Hi Korea (하이코리아) 외국인종합안내센터',
              ].map((ref, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="shrink-0 text-gray-400">[{idx + 1}]</span>
                  <span>{ref}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* KOR: 하단 액션 버튼 / ENG: Bottom action buttons */}
          <div className="border-t border-gray-300 pt-6 flex flex-wrap gap-3">
            <button
              onClick={() => { setInputStep(0); setStep('input'); }}
              className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-sm"
            >
              <Edit3 className="w-4 h-4" /> 다시 진단하기
            </button>
            <button
              onClick={() => setStep('search')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-600 hover:bg-gray-50 rounded text-sm"
            >
              <BookOpen className="w-4 h-4" /> 백과 홈으로
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-600 hover:bg-gray-50 rounded text-sm ml-auto">
              <Share2 className="w-4 h-4" /> 결과 공유
            </button>
          </div>
        </main>

        {/* KOR: 우측 사이드바 (목차 + 선택 경로 인포박스) / ENG: Right sidebar (TOC + selected pathway infobox) */}
        <aside className="hidden lg:block w-64 shrink-0">
          {/* KOR: 목차 / ENG: Table of contents */}
          <div className="border border-gray-300 rounded-sm bg-gray-50 mb-4 sticky top-20">
            <div
              className="bg-gray-100 border-b border-gray-300 px-3 py-2 flex items-center justify-between cursor-pointer"
              onClick={() => setTocExpanded(!tocExpanded)}
            >
              <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <List className="w-4 h-4 text-gray-600" />
                목차
                <span className="text-xs font-normal text-gray-500 italic">Contents</span>
              </div>
              {tocExpanded
                ? <ChevronDown className="w-4 h-4 text-gray-500" />
                : <ChevronRight className="w-4 h-4 text-gray-500" />
              }
            </div>
            {tocExpanded && (
              <nav className="p-3">
                <ol className="space-y-1">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 underline block py-0.5"
                      >
                        {item.label}
                        {item.sublabel && (
                          <span className="text-gray-400 italic ml-1 text-xs no-underline">
                            · {item.sublabel}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>

          {/* KOR: 선택된 경로 요약 인포박스 / ENG: Selected pathway summary infobox */}
          {topPathway && (
            <div className="border border-gray-400 rounded-sm text-xs">
              <div className="bg-blue-700 text-white px-3 py-2 text-center font-bold text-sm">
                선택된 경로
                <div className="text-xs font-normal opacity-80">Selected Pathway</div>
              </div>
              <div className="p-0">
                <div className="bg-blue-50 px-3 py-2 text-center border-b border-gray-200">
                  <div className="font-bold text-blue-800 text-sm leading-tight">{topPathway.name}</div>
                </div>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="px-2 py-1.5 text-gray-500 border-b border-gray-200">실현 가능성</td>
                      <td className="px-2 py-1.5 border-b border-gray-200">
                        <span className={`font-bold ${getScoreTextColor(topPathway.feasibilityLabel)}`}>
                          {getFeasibilityEmoji(topPathway.feasibilityLabel)} {topPathway.feasibilityLabel}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1.5 text-gray-500 border-b border-gray-200">점수</td>
                      <td className="px-2 py-1.5 border-b border-gray-200 font-bold text-blue-700">{topPathway.feasibilityScore} / 100</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-2 py-1.5 text-gray-500 border-b border-gray-200">총 기간</td>
                      <td className="px-2 py-1.5 border-b border-gray-200">{topPathway.totalDurationMonths}개월</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1.5 text-gray-500 border-b border-gray-200">예상 비용</td>
                      <td className="px-2 py-1.5 border-b border-gray-200">${((topPathway as any).estimatedCostUSD ?? topPathway.estimatedCostWon ?? 0).toLocaleString()}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-2 py-1.5 text-gray-500" colSpan={2}>
                        <div className="text-gray-500 mb-1">비자 체인</div>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(topPathway.visaChain) ? topPathway.visaChain : []).map((vc, i) => (
                            <span key={i} className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs border border-blue-200">
                              {vc.visa}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* KOR: 사이드바 관련 카테고리 / ENG: Sidebar related categories */}
          <div className="mt-4 border border-gray-300 rounded-sm text-xs bg-gray-50">
            <div className="bg-blue-100 border-b border-gray-300 px-3 py-1.5 text-xs font-bold text-blue-800 text-center">
              비자 카테고리
            </div>
            <div className="p-3 space-y-1">
              {['취업 비자 계열', '유학 비자 계열', '거주 비자 계열', '동포 비자 계열', '기타 비자'].map(cat => (
                <div key={cat} className={WIKI_LINK + ' text-xs'}>{cat}</div>
              ))}
            </div>
          </div>

          {/* KOR: 편집 이력 / ENG: Edit history */}
          <div className="mt-4 border border-gray-300 rounded-sm text-xs bg-gray-50 p-3">
            <div className="flex items-center gap-1.5 text-gray-600 font-medium mb-2">
              <History className="w-3.5 h-3.5" /> 문서 정보
            </div>
            <div className="space-y-1 text-gray-500">
              <div>마지막 업데이트: 2026-02-17</div>
              <div>비자 DB 버전: v3.1</div>
              <div>평가 엔진: 14개 Evaluator</div>
              <div>테스트 케이스: 2,629건</div>
            </div>
          </div>
        </aside>
      </div>

      {/* KOR: 위키 푸터 / ENG: Wiki footer */}
      <footer className="border-t border-gray-300 bg-gray-50 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              {['개인정보처리방침', '면책 조항', '쿠키 설정', '잡차자 소개'].map(link => (
                <span key={link} className={WIKI_LINK + ' text-xs'}>{link}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>대한민국 출입국 정보 기반</span>
            </div>
          </div>
          <div className="text-gray-400 text-center">
            © 2026 잡차자(JobChaJa) · 이 콘텐츠는 참고용이며 법적 효력이 없습니다. For reference only, not legal advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
