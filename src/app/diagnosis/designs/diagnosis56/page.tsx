'use client';
// KOR: 디자인 #56 — 독서 클럽 (Book Club) 테마 비자 진단 페이지
// ENG: Design #56 — Book Club themed visa diagnosis page
// 전자책 리더처럼 페이지를 넘기며 정보를 읽고 선택하는 방식
// Navigate and choose information by flipping pages like an e-book reader

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
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  StickyNote,
  List,
  Sun,
  Moon,
  Search,
  Clock,
  DollarSign,
  CheckCircle,
  Circle,
  ArrowRight,
  FileText,
  RotateCcw,
  Highlighter,
} from 'lucide-react';

// KOR: 단계별 챕터 정보 정의
// ENG: Define chapter information for each step
const CHAPTERS = [
  { id: 0, title: '국적', titleEn: 'Nationality', icon: '🌍' },
  { id: 1, title: '나이', titleEn: 'Age', icon: '🎂' },
  { id: 2, title: '학력', titleEn: 'Education', icon: '🎓' },
  { id: 3, title: '자금', titleEn: 'Budget', icon: '💰' },
  { id: 4, title: '목표', titleEn: 'Goal', icon: '🎯' },
  { id: 5, title: '우선순위', titleEn: 'Priority', icon: '⭐' },
  { id: 6, title: '진단 결과', titleEn: 'Results', icon: '📋' },
] as const;

// KOR: 하이라이트 색상 세트 (책 마커 스타일)
// ENG: Highlight color set (book marker style)
const HIGHLIGHT_COLORS = [
  'bg-yellow-200 border-yellow-500',
  'bg-green-200 border-green-500',
  'bg-blue-200 border-blue-500',
  'bg-pink-200 border-pink-500',
] as const;

// KOR: 입력 필드 키 순서 (단계별 매핑)
// ENG: Input field key order (per-step mapping)
const INPUT_KEYS = [
  'nationality',
  'age',
  'educationLevel',
  'availableAnnualFund',
  'finalGoal',
  'priorityPreference',
] as const;

export default function Diagnosis56Page() {
  // KOR: 현재 챕터(단계) 상태
  // ENG: Current chapter (step) state
  const [currentChapter, setCurrentChapter] = useState(0);

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 진단 결과 상태 (mockPathways 기반)
  // ENG: Diagnosis result state (based on mockPathways)
  const [resultPathways, setResultPathways] = useState<CompatPathway[]>([]);

  // KOR: 다크 모드 상태 (야간 독서 모드)
  // ENG: Dark mode state (night reading mode)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // KOR: 목차 사이드바 표시 상태
  // ENG: Table of contents sidebar visibility state
  const [showToc, setShowToc] = useState(false);

  // KOR: 메모 사이드바 표시 상태
  // ENG: Memo sidebar visibility state
  const [showMemo, setShowMemo] = useState(false);

  // KOR: 사용자 메모 텍스트
  // ENG: User memo text
  const [memoText, setMemoText] = useState('');

  // KOR: 북마크된 챕터 목록
  // ENG: List of bookmarked chapters
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // KOR: 페이지 넘김 애니메이션 활성화 여부
  // ENG: Whether page turn animation is active
  const [isTurning, setIsTurning] = useState(false);

  // KOR: 선택된 결과 경로 인덱스
  // ENG: Selected result pathway index
  const [selectedPathwayIndex, setSelectedPathwayIndex] = useState(0);

  // KOR: 국적 검색어 상태
  // ENG: Nationality search term state
  const [nationalitySearch, setNationalitySearch] = useState('');

  // KOR: 다크/라이트 모드 색상 테마 / ENG: Dark/light mode color theme
  const d = isDarkMode;
  const theme = {
    bg: d ? 'bg-stone-900' : 'bg-amber-50',
    text: d ? 'text-stone-100' : 'text-stone-800',
    subText: d ? 'text-stone-400' : 'text-stone-500',
    border: d ? 'border-stone-600' : 'border-stone-300',
    highlight: d ? 'bg-amber-900/40 border-amber-600' : 'bg-amber-100 border-amber-400',
    button: d ? 'bg-stone-700 hover:bg-stone-600 text-stone-100 border-stone-500' : 'bg-white hover:bg-amber-50 text-stone-700 border-stone-300',
    activeButton: d ? 'bg-amber-700 text-white border-amber-600' : 'bg-amber-800 text-amber-50 border-amber-800',
    sidebar: d ? 'bg-stone-900 border-stone-700' : 'bg-amber-50 border-stone-200',
    headerBg: d ? 'bg-stone-800 border-stone-700' : 'bg-amber-900 border-amber-800',
    pageBg: d ? 'bg-stone-800' : 'bg-[#fdf8f0]',
    divider: d ? 'divide-stone-700' : 'divide-stone-200',
    altRow: d ? 'bg-stone-700/30' : 'bg-amber-50/50',
    statBg: d ? 'bg-stone-600' : 'bg-amber-50',
    accentText: d ? 'text-amber-400' : 'text-amber-900',
    progressBg: d ? 'bg-stone-600' : 'bg-stone-200',
    dotInactive: d ? 'bg-stone-600 hover:bg-stone-500' : 'bg-stone-300 hover:bg-stone-400',
    dotActive: d ? 'bg-amber-500' : 'bg-amber-800',
    notesBg: d ? 'bg-stone-800/50 border-stone-700' : 'bg-amber-50 border-amber-200',
    notesAccent: d ? 'text-amber-400' : 'text-amber-800',
    pageNumber: d ? 'border-stone-700' : 'border-stone-200',
    chapterHeader: d ? 'bg-stone-700 border-stone-600' : 'bg-amber-900',
    tocActive: d ? 'bg-amber-800 text-amber-100' : 'bg-amber-800 text-amber-50',
    tocHover: d ? 'hover:bg-stone-700' : 'hover:bg-amber-100',
    memoBg: d ? 'bg-stone-800 border-stone-600 text-stone-100 placeholder-stone-500' : 'bg-white border-stone-300 text-stone-800 placeholder-stone-400',
  };

  // KOR: 북마크 토글 / ENG: Toggle bookmark
  const toggleBookmark = (chapter: number) => {
    setBookmarks(prev =>
      prev.includes(chapter) ? prev.filter(b => b !== chapter) : [...prev, chapter]
    );
  };

  // KOR: 페이지 이동 (넘김 애니메이션 포함) / ENG: Navigate (with turn animation)
  const navigateToChapter = (targetChapter: number) => {
    if (isTurning) return;
    setIsTurning(true);
    setTimeout(() => { setCurrentChapter(targetChapter); setIsTurning(false); }, 250);
  };

  const goToNextChapter = () => { if (currentChapter < CHAPTERS.length - 1) navigateToChapter(currentChapter + 1); };
  const goToPrevChapter = () => { if (currentChapter > 0) navigateToChapter(currentChapter - 1); };
  const goToChapter = (id: number) => { navigateToChapter(id); setShowToc(false); };

  // KOR: 진단 실행 / ENG: Run diagnosis
  const runDiagnosis = () => { setResultPathways(mockPathways); setSelectedPathwayIndex(0); navigateToChapter(6); };

  // KOR: 초기화 / ENG: Reset
  const resetDiagnosis = () => { setInput({}); setResultPathways([]); setSelectedPathwayIndex(0); navigateToChapter(0); };

  // KOR: 입력 완료 여부 / ENG: Input completion check
  const isInputComplete = (): boolean =>
    !!(input.nationality && input.age && input.educationLevel &&
      input.availableAnnualFund !== undefined && input.finalGoal && input.priorityPreference);

  // KOR: 국적 검색 필터 / ENG: Nationality search filter
  const filteredCountries = popularCountries.filter(c =>
    c.nameKo.includes(nationalitySearch) || c.nameEn.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  // KOR: 선택 옵션 버튼 (책 하이라이트 효과) / ENG: Option button (book highlight effect)
  const OptionButton = ({ isSelected, onClick, colorIndex = 0, children }: {
    isSelected: boolean; onClick: () => void; colorIndex?: number; children: React.ReactNode;
  }) => (
    <button onClick={onClick} className={`w-full text-left px-4 py-3 border-b transition-all duration-200 font-serif text-base leading-relaxed ${isSelected ? `${HIGHLIGHT_COLORS[colorIndex % HIGHLIGHT_COLORS.length]} border-l-4 font-semibold` : `${theme.button} border-l-4 border-l-transparent`}`}>
      {isSelected && <span className="mr-2 text-amber-600">✍</span>}
      {children}
    </button>
  );

  // KOR: 점수 → Tailwind 배경색 / ENG: Score → Tailwind bg class
  const getScoreBgClass = (score: number): string => {
    if (score >= 71) return 'bg-green-500';
    if (score >= 51) return 'bg-blue-500';
    if (score >= 31) return 'bg-amber-500';
    if (score >= 1) return 'bg-red-400';
    return 'bg-gray-400';
  };

  // KOR: 챕터 콘텐츠 렌더링 / ENG: Render chapter content
  const renderChapterContent = () => {
    switch (currentChapter) {
      // KOR: 챕터 1 — 국적 선택
      // ENG: Chapter 1 — Select Nationality
      case 0:
        return (
          <div className="space-y-5">
            <div className={`border-l-4 border-amber-700 pl-4 ${theme.highlight} py-2 rounded-r`}>
              <p className={`font-serif italic text-sm ${theme.subText}`}>
                "어느 나라에서 오셨나요? / Where are you from?"
              </p>
            </div>
            <div className={`relative border ${theme.border} rounded`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="국가 검색... / Search country..."
                value={nationalitySearch}
                onChange={e => setNationalitySearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 font-serif text-sm bg-transparent focus:outline-none ${theme.text}`}
              />
            </div>
            <div className={`border ${theme.border} rounded divide-y ${theme.divider} max-h-60 overflow-y-auto`}>
              {filteredCountries.map((country, idx) => (
                <OptionButton
                  key={country.code}
                  isSelected={input.nationality === country.nameEn}
                  onClick={() => setInput(prev => ({ ...prev, nationality: country.nameEn }))}
                  colorIndex={idx % 4}
                >
                  <span className="mr-2">{country.flag}</span>
                  <span className="mr-1">{country.nameKo}</span>
                  <span className={`text-xs ${theme.subText}`}>({country.nameEn})</span>
                </OptionButton>
              ))}
            </div>
          </div>
        );

      // KOR: 챕터 2 — 나이 입력
      // ENG: Chapter 2 — Age Input
      case 1:
        return (
          <div className="space-y-6">
            <div className={`border-l-4 border-amber-700 pl-4 ${theme.highlight} py-2 rounded-r`}>
              <p className={`font-serif italic text-sm ${theme.subText}`}>
                "나이는 비자 자격 요건에 영향을 줍니다. / Age affects visa eligibility."
              </p>
            </div>
            <div className="flex flex-col items-center space-y-5">
              <div className={`w-44 h-44 rounded-full border-8 flex flex-col items-center justify-center ${isDarkMode ? 'border-amber-700 bg-stone-700' : 'border-amber-800 bg-amber-50'}`}>
                <span className={`text-6xl font-bold font-serif ${theme.accentText}`}>
                  {input.age ?? '--'}
                </span>
                <span className={`text-sm font-serif ${theme.subText}`}>세 / yrs old</span>
              </div>
              <input
                type="range"
                min={18}
                max={65}
                value={input.age ?? 25}
                onChange={e => setInput(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                className="w-full accent-amber-800"
              />
              <div className={`flex justify-between w-full text-xs font-serif ${theme.subText}`}>
                <span>18세</span>
                <span>65세</span>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {[20, 25, 30, 35, 40, 45].map(age => (
                  <button
                    key={age}
                    onClick={() => setInput(prev => ({ ...prev, age }))}
                    className={`py-2 text-sm font-serif border rounded transition-all ${input.age === age ? theme.activeButton : theme.button}`}
                  >
                    {age}세
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // KOR: 챕터 3 — 학력 선택
      // ENG: Chapter 3 — Education Level Selection
      case 2:
        return (
          <div className="space-y-5">
            <div className={`border-l-4 border-amber-700 pl-4 ${theme.highlight} py-2 rounded-r`}>
              <p className={`font-serif italic text-sm ${theme.subText}`}>
                "최종 학력을 선택해주세요. / Please select your education level."
              </p>
            </div>
            <div className={`border ${theme.border} rounded divide-y ${theme.divider}`}>
              {educationOptions.map((edu, idx) => (
                <OptionButton
                  key={edu.value}
                  isSelected={input.educationLevel === edu.value}
                  onClick={() => setInput(prev => ({ ...prev, educationLevel: edu.value }))}
                  colorIndex={idx % 4}
                >
                  <span className="mr-2">{edu.emoji}</span>
                  <span className="mr-1">{edu.labelKo}</span>
                  <span className={`text-xs ${theme.subText}`}>/ {edu.labelEn}</span>
                </OptionButton>
              ))}
            </div>
          </div>
        );

      // KOR: 챕터 4 — 연간 가용 자금 선택
      // ENG: Chapter 4 — Annual Available Fund Selection
      case 3:
        return (
          <div className="space-y-5">
            <div className={`border-l-4 border-amber-700 pl-4 ${theme.highlight} py-2 rounded-r`}>
              <p className={`font-serif italic text-sm ${theme.subText}`}>
                "연간 가용 자금이 비자 경로를 결정합니다. / Annual budget determines your pathway."
              </p>
            </div>
            <div className="space-y-2">
              {fundOptions.map((fund, idx) => (
                <button
                  key={fund.bracket}
                  onClick={() => setInput(prev => ({ ...prev, availableAnnualFund: fund.value }))}
                  className={`w-full flex items-center justify-between px-5 py-3 border rounded-lg font-serif transition-all ${input.availableAnnualFund === fund.value ? theme.activeButton : theme.button}`}
                >
                  <span className="flex items-center gap-3">
                    <DollarSign className={`w-4 h-4 shrink-0 ${input.availableAnnualFund === fund.value ? 'text-amber-200' : 'text-amber-700'}`} />
                    <span className="text-sm">
                      {fund.labelKo}
                      <span className={`ml-1 text-xs opacity-70`}>/ {fund.labelEn}</span>
                    </span>
                  </span>
                  {input.availableAnnualFund === fund.value && (
                    <CheckCircle className="w-5 h-5 text-amber-200 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      // KOR: 챕터 5 — 최종 목표 선택
      // ENG: Chapter 5 — Final Goal Selection
      case 4:
        return (
          <div className="space-y-5">
            <div className={`border-l-4 border-amber-700 pl-4 ${theme.highlight} py-2 rounded-r`}>
              <p className={`font-serif italic text-sm ${theme.subText}`}>
                "한국에서의 꿈은 무엇인가요? / What is your dream in Korea?"
              </p>
            </div>
            <div className={`border ${theme.border} rounded divide-y ${theme.divider}`}>
              {goalOptions.map((goal, idx) => (
                <OptionButton
                  key={goal.value}
                  isSelected={input.finalGoal === goal.value}
                  onClick={() => setInput(prev => ({ ...prev, finalGoal: goal.value }))}
                  colorIndex={idx % 4}
                >
                  <span className="text-lg mr-3">{goal.emoji}</span>
                  <span className="mr-1">{goal.labelKo}</span>
                  <span className={`text-xs ${theme.subText}`}>/ {goal.labelEn}</span>
                  {goal.descKo && (
                    <p className={`text-xs mt-1 ${theme.subText} font-normal`}>{goal.descKo}</p>
                  )}
                </OptionButton>
              ))}
            </div>
          </div>
        );

      // KOR: 챕터 6 — 우선순위 선택
      // ENG: Chapter 6 — Priority Selection
      case 5:
        return (
          <div className="space-y-5">
            <div className={`border-l-4 border-amber-700 pl-4 ${theme.highlight} py-2 rounded-r`}>
              <p className={`font-serif italic text-sm ${theme.subText}`}>
                "가장 중요한 것은 무엇인가요? / What matters most to you?"
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {priorityOptions.map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => setInput(prev => ({ ...prev, priorityPreference: priority.value }))}
                  className={`p-4 border rounded-lg font-serif text-sm text-center transition-all ${input.priorityPreference === priority.value ? theme.activeButton : theme.button}`}
                >
                  <div className="text-2xl mb-2">{priority.emoji}</div>
                  <p className="font-semibold">{priority.labelKo}</p>
                  <p className={`text-xs mt-1 ${input.priorityPreference === priority.value ? 'opacity-70' : theme.subText}`}>
                    {priority.labelEn}
                  </p>
                </button>
              ))}
            </div>
            {isInputComplete() && (
              <button
                onClick={runDiagnosis}
                className="w-full py-4 bg-amber-800 hover:bg-amber-900 text-amber-50 font-serif text-base rounded-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                <BookOpen className="w-5 h-5" />
                진단 결과 읽기 / Read My Results
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        );

      // KOR: 챕터 7 — 진단 결과 표시
      // ENG: Chapter 7 — Display Diagnosis Results
      case 6: {
        if (resultPathways.length === 0) return null;
        const pathway = resultPathways[selectedPathwayIndex];

        return (
          <div className="space-y-5">
            {/* KOR: 경로 탭 선택 / ENG: Pathway tab selector */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {resultPathways.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPathwayIndex(idx)}
                  className={`shrink-0 px-3 py-2 text-xs font-serif border rounded-t-lg transition-all ${selectedPathwayIndex === idx ? theme.activeButton : theme.button}`}
                >
                  경로 {idx + 1}
                </button>
              ))}
            </div>

            {/* KOR: 경로 요약 카드 / ENG: Pathway summary card */}
            <div className={`border ${theme.border} rounded-lg p-5 space-y-4`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className={`font-bold font-serif text-base leading-snug ${theme.text}`}>
                    {pathway.nameKo}
                  </h3>
                  <p className={`text-xs font-serif mt-0.5 ${theme.subText}`}>
                    {pathway.nameEn}
                  </p>
                </div>
                <span className="text-2xl shrink-0">{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
              </div>

              {/* KOR: 실현 가능성 점수 바 / ENG: Feasibility score bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-serif">
                  <span className={theme.subText}>실현 가능성 / Feasibility</span>
                  <span className={`font-bold ${theme.accentText}`}>
                    {pathway.finalScore}점 — {pathway.feasibilityLabel}
                  </span>
                </div>
                <div className={`h-2 ${theme.progressBg} rounded-full overflow-hidden`}>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getScoreBgClass(pathway.finalScore)}`}
                    style={{ width: `${Math.min(pathway.finalScore, 100)}%` }}
                  />
                </div>
              </div>

              {/* KOR: 핵심 통계 2열 그리드 / ENG: Key stats 2-column grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`flex items-center gap-2 p-3 rounded-lg ${theme.statBg}`}>
                  <Clock className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`} />
                  <div>
                    <p className={`text-xs ${theme.subText} font-serif`}>소요 기간</p>
                    <p className={`text-sm font-bold font-serif ${theme.text}`}>{pathway.estimatedMonths}개월</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${theme.statBg}`}>
                  <DollarSign className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`} />
                  <div>
                    <p className={`text-xs ${theme.subText} font-serif`}>예상 비용</p>
                    <p className={`text-sm font-bold font-serif ${theme.text}`}>
                      {pathway.estimatedCostWon > 0 ? `${pathway.estimatedCostWon.toLocaleString()}만원` : '0원'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KOR: 비자 체인 — 책등(spine) 형태 표시 / ENG: Visa chain — displayed like book spines */}
            <div>
              <h4 className={`text-xs font-semibold font-serif uppercase tracking-wider mb-2 ${theme.subText}`}>
                비자 경로 / Visa Chain
              </h4>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((step, idx) => (
                  <React.Fragment key={step.code}>
                    <div className={`shrink-0 px-3 py-2 rounded text-center ${isDarkMode ? 'bg-amber-800 text-amber-100' : 'bg-amber-800 text-amber-50'}`}>
                      <p className="text-sm font-bold font-serif">{step.code}</p>
                    </div>
                    {idx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                      <ArrowRight className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-amber-500' : 'text-amber-700'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* KOR: 마일스톤 목록 — 밑줄 하이라이트 스타일 / ENG: Milestone list — underline highlight style */}
            {pathway.milestones.length > 0 && (
              <div>
                <h4 className={`text-xs font-semibold font-serif uppercase tracking-wider mb-2 ${theme.subText}`}>
                  마일스톤 / Milestones
                </h4>
                <div className={`border ${theme.border} rounded divide-y ${theme.divider}`}>
                  {pathway.milestones.map((milestone, idx) => (
                    <div
                      key={milestone.order}
                      className={`p-3 flex gap-3 ${idx % 2 === 0 ? theme.altRow : ''}`}
                    >
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-serif ${isDarkMode ? 'bg-amber-800 text-amber-100' : 'bg-amber-800 text-amber-50'}`}>
                        {milestone.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-semibold text-sm font-serif ${theme.text}`}>
                            {milestone.nameKo}
                          </p>
                          {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-serif ${isDarkMode ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-800'}`}>
                              {milestone.visaStatus}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-serif mt-0.5 ${theme.subText}`}>
                          {milestone.monthFromStart}개월 시점
                          {milestone.canWorkPartTime && ` · 파트타임 가능(${milestone.weeklyHours}h/주)`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 다음 단계 / ENG: Next steps */}
            {pathway.nextSteps.length > 0 && (
              <div>
                <h4 className={`text-xs font-semibold font-serif uppercase tracking-wider mb-2 ${theme.subText}`}>
                  다음 단계 / Next Steps
                </h4>
                <div className="space-y-2">
                  {pathway.nextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 p-3 border rounded-lg ${theme.border} ${theme.altRow}`}
                    >
                      <ArrowRight className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`} />
                      <div>
                        <p className={`text-sm font-semibold font-serif ${theme.text}`}>{step.nameKo}</p>
                        <p className={`text-xs font-serif ${theme.subText}`}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KOR: 비고 / ENG: Note */}
            {pathway.note && (
              <div className={`p-3 rounded-lg border-l-4 border-amber-600 ${theme.highlight}`}>
                <p className={`text-xs font-serif italic ${theme.subText}`}>
                  📝 {pathway.note}
                </p>
              </div>
            )}

            {/* KOR: 다시 시작 버튼 / ENG: Restart button */}
            <button
              onClick={resetDiagnosis}
              className={`w-full py-3 border rounded-lg font-serif text-sm flex items-center justify-center gap-2 transition-all ${theme.button}`}
            >
              <RotateCcw className="w-4 h-4" />
              처음부터 다시 / Start Over
            </button>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      {/* KOR: 책 상단 헤더 / ENG: Book top header */}
      <div className={`${theme.headerBg} text-amber-50 px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b`}>
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-amber-300" />
          <div>
            <p className="text-xs text-amber-300 font-serif">잡차자 비자 진단</p>
            <p className="text-sm font-bold font-serif">비자 경로 가이드북</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* KOR: 야간 독서 모드 토글 / ENG: Night reading mode toggle */}
          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            className="p-2 rounded-full hover:bg-amber-700 transition-colors"
            aria-label={isDarkMode ? '낮 모드로 전환' : '야간 모드로 전환'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {/* KOR: 목차 사이드바 토글 / ENG: TOC sidebar toggle */}
          <button
            onClick={() => { setShowToc(prev => !prev); setShowMemo(false); }}
            className="p-2 rounded-full hover:bg-amber-700 transition-colors"
            aria-label="목차 열기"
          >
            <List className="w-4 h-4" />
          </button>
          {/* KOR: 메모 패널 토글 / ENG: Memo panel toggle */}
          <button
            onClick={() => { setShowMemo(prev => !prev); setShowToc(false); }}
            className="p-2 rounded-full hover:bg-amber-700 transition-colors"
            aria-label="메모 열기"
          >
            <StickyNote className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex relative">
        {/* KOR: 목차 사이드바 (Table of Contents) / ENG: Table of contents sidebar */}
        {showToc && (
          <aside className={`fixed left-0 top-[57px] h-[calc(100vh-57px)] w-60 z-30 border-r shadow-xl overflow-y-auto ${theme.sidebar}`}>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <List className={`w-4 h-4 ${theme.subText}`} />
                <p className={`text-xs font-semibold uppercase tracking-widest font-serif ${theme.subText}`}>
                  목차 / Contents
                </p>
              </div>
              <nav className="space-y-0.5">
                {CHAPTERS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => goToChapter(ch.id)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded transition-all font-serif text-sm ${
                      currentChapter === ch.id
                        ? theme.tocActive
                        : `${theme.text} ${theme.tocHover}`
                    }`}
                  >
                    <span className="text-base">{ch.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{ch.title}</p>
                      <p className={`text-xs truncate ${currentChapter === ch.id ? 'text-amber-300' : theme.subText}`}>
                        {ch.titleEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {bookmarks.includes(ch.id) && (
                        <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" />
                      )}
                      {ch.id < 6 && (() => {
                        // KOR: 튜플 범위를 벗어나지 않도록 인덱스를 명시적으로 제한
                        // ENG: Explicitly constrain index to stay within tuple bounds
                        const key = INPUT_KEYS[ch.id as 0 | 1 | 2 | 3 | 4 | 5];
                        return key && input[key as keyof DiagnosisInput] !== undefined ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : null;
                      })()}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* KOR: 메모 사이드바 / ENG: Memo sidebar */}
        {showMemo && (
          <aside className={`fixed right-0 top-[57px] h-[calc(100vh-57px)] w-60 z-30 border-l shadow-xl ${theme.sidebar}`}>
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Highlighter className={`w-4 h-4 ${theme.subText}`} />
                <p className={`text-xs font-semibold uppercase tracking-widest font-serif ${theme.subText}`}>
                  메모 / Notes
                </p>
              </div>
              <p className={`text-xs font-serif mb-2 ${theme.subText}`}>
                현재: {CHAPTERS[currentChapter]?.title}
              </p>
              <textarea
                value={memoText}
                onChange={e => setMemoText(e.target.value)}
                placeholder={`메모를 남기세요...\nLeave a note...`}
                className={`flex-1 w-full p-3 text-sm font-serif resize-none rounded border focus:outline-none focus:border-amber-500 ${theme.memoBg}`}
              />
              <div className="mt-3">
                <p className={`text-xs font-semibold font-serif mb-2 ${theme.subText}`}>
                  입력 현황 / Progress
                </p>
                <div className="space-y-1.5">
                  {CHAPTERS.slice(0, 6).map((ch, idx) => {
                    const key = INPUT_KEYS[idx] as keyof DiagnosisInput;
                    const isDone = input[key] !== undefined;
                    return (
                      <div key={ch.id} className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 text-stone-400 shrink-0" />
                        )}
                        <span className={`text-xs font-serif ${theme.subText}`}>{ch.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* KOR: 메인 책 영역 / ENG: Main book area */}
        <main className="flex-1 min-h-[calc(100vh-57px)] flex flex-col items-center py-8 px-4">
          <div className="w-full max-w-lg">
            {/* KOR: 챕터 탭 헤더 (책 상단 색인 탭) / ENG: Chapter tab header (book top index tab) */}
            <div className={`flex items-center justify-between px-5 py-2.5 rounded-t-lg ${theme.chapterHeader} text-amber-200 border-b border-amber-700`}>
              <span className="text-xs font-serif tracking-widest uppercase">
                Ch.{currentChapter + 1} / {CHAPTERS.length}
              </span>
              <span className="text-sm font-bold font-serif text-amber-100">
                {CHAPTERS[currentChapter]?.icon} {CHAPTERS[currentChapter]?.title}
              </span>
              {/* KOR: 북마크 토글 버튼 / ENG: Bookmark toggle button */}
              <button
                onClick={() => toggleBookmark(currentChapter)}
                className="hover:text-amber-100 transition-colors"
                aria-label={bookmarks.includes(currentChapter) ? '북마크 해제' : '북마크 추가'}
              >
                <Bookmark
                  className={`w-4 h-4 ${bookmarks.includes(currentChapter) ? 'fill-amber-400 text-amber-400' : 'text-amber-400'}`}
                />
              </button>
            </div>

            {/* KOR: 책 페이지 본문 (넘김 애니메이션 포함) / ENG: Book page body (with turn animation) */}
            <div
              className={`
                relative shadow-2xl transition-all duration-250
                ${theme.pageBg} border-x border-b ${theme.border} rounded-b-lg
                ${isTurning ? 'opacity-0 scale-x-95' : 'opacity-100 scale-x-100'}
              `}
              style={{
                boxShadow: isDarkMode
                  ? '4px 6px 24px rgba(0,0,0,0.5), inset -3px 0 8px rgba(0,0,0,0.3)'
                  : '4px 6px 24px rgba(0,0,0,0.12), inset -3px 0 8px rgba(0,0,0,0.04)',
                transformOrigin: 'left center',
              }}
            >
              {/* KOR: 책등 수직 선 장식 / ENG: Book spine vertical line decoration */}
              <div
                className="absolute left-8 top-0 bottom-0 w-px opacity-10 pointer-events-none"
                style={{ background: isDarkMode ? '#78716c' : '#92400e' }}
              />

              {/* KOR: 챕터 이름 내부 헤더 / ENG: Chapter name inner header */}
              <div className="px-10 pt-7 pb-3">
                <p className={`text-xs uppercase tracking-widest font-serif ${theme.subText}`}>
                  {CHAPTERS[currentChapter]?.titleEn}
                </p>
                <h2 className={`text-xl font-bold font-serif mt-0.5 ${theme.accentText}`}>
                  {CHAPTERS[currentChapter]?.title}
                </h2>
                <div className={`h-px mt-3 ${isDarkMode ? 'bg-stone-600' : 'bg-amber-200'}`} />
              </div>

              {/* KOR: 챕터 콘텐츠 영역 / ENG: Chapter content area */}
              <div className="px-10 pb-6">
                {renderChapterContent()}
              </div>

              {/* KOR: 페이지 하단 번호 / ENG: Page number at bottom */}
              <div className={`flex items-center justify-between px-10 py-2.5 border-t text-xs font-serif ${theme.subText} ${theme.pageNumber}`}>
                <span className="italic">잡차자 비자 가이드</span>
                <span>{currentChapter + 1}</span>
                <span className="italic">Visa Pathway Guide</span>
              </div>
            </div>

            {/* KOR: 페이지 이동 하단 컨트롤 / ENG: Bottom page navigation controls */}
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={goToPrevChapter}
                disabled={currentChapter === 0 || isTurning}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-serif text-sm transition-all ${
                  currentChapter === 0
                    ? `opacity-30 cursor-not-allowed ${theme.button}`
                    : `${theme.button} hover:shadow-md`
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </button>

              {/* KOR: 진행률 점 인디케이터 / ENG: Progress dot indicator */}
              <div className="flex gap-1.5 items-center">
                {CHAPTERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToChapter(idx)}
                    disabled={isTurning}
                    className={`rounded-full transition-all ${
                      idx === currentChapter
                        ? `w-5 h-2.5 ${theme.dotActive}`
                        : `w-2.5 h-2.5 ${theme.dotInactive}`
                    }`}
                    aria-label={`챕터 ${idx + 1}로 이동`}
                  />
                ))}
              </div>

              <button
                onClick={
                  currentChapter === 5 && isInputComplete()
                    ? runDiagnosis
                    : goToNextChapter
                }
                disabled={currentChapter === 6 || isTurning}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-serif text-sm transition-all border ${
                  currentChapter === 6
                    ? `opacity-30 cursor-not-allowed ${theme.button}`
                    : currentChapter === 5 && isInputComplete()
                      ? 'bg-amber-800 hover:bg-amber-900 text-amber-50 border-amber-800 hover:shadow-md'
                      : `${theme.button} hover:shadow-md`
                }`}
              >
                {currentChapter === 5 && isInputComplete() ? '진단하기' : '다음'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* KOR: 입력 요약 독서 노트 (결과 페이지 제외) / ENG: Input summary reading notes (except results page) */}
            {Object.keys(input).length > 0 && currentChapter < 6 && (
              <div className={`mt-5 p-4 rounded-lg border ${theme.notesBg}`}>
                <p className={`text-xs font-semibold font-serif mb-2 flex items-center gap-1.5 ${theme.notesAccent}`}>
                  <FileText className="w-3 h-3" />
                  내 독서 노트 / My Reading Notes
                </p>
                <div className="space-y-1">
                  {input.nationality && (
                    <p className={`text-xs font-serif ${theme.subText}`}>
                      {CHAPTERS[0].icon} 국적: {input.nationality}
                    </p>
                  )}
                  {input.age !== undefined && (
                    <p className={`text-xs font-serif ${theme.subText}`}>
                      {CHAPTERS[1].icon} 나이: {input.age}세
                    </p>
                  )}
                  {input.educationLevel && (
                    <p className={`text-xs font-serif ${theme.subText}`}>
                      {CHAPTERS[2].icon} 학력: {educationOptions.find(e => e.value === input.educationLevel)?.labelKo ?? input.educationLevel}
                    </p>
                  )}
                  {input.availableAnnualFund !== undefined && (
                    <p className={`text-xs font-serif ${theme.subText}`}>
                      {CHAPTERS[3].icon} 자금: {fundOptions.find(f => f.value === input.availableAnnualFund)?.labelKo ?? `${input.availableAnnualFund}`}
                    </p>
                  )}
                  {input.finalGoal && (
                    <p className={`text-xs font-serif ${theme.subText}`}>
                      {CHAPTERS[4].icon} 목표: {goalOptions.find(g => g.value === input.finalGoal)?.labelKo ?? input.finalGoal}
                    </p>
                  )}
                  {input.priorityPreference && (
                    <p className={`text-xs font-serif ${theme.subText}`}>
                      {CHAPTERS[5].icon} 우선순위: {priorityOptions.find(p => p.value === input.priorityPreference)?.labelKo ?? input.priorityPreference}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
