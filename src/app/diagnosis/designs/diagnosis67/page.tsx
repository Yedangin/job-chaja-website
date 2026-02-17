'use client';

// 유튜브 학습 스타일 비자 진단 페이지 / YouTube Academy Style Visa Diagnosis Page
// 디자인 #67 — YouTube Academy
// concept: 유튜브 강의처럼 비자 가이드 영상 시리즈를 시청하는 UX

import { useState, useEffect } from 'react';
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
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ThumbsUp,
  Bell,
  Share2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  DollarSign,
  BookOpen,
  Star,
  Award,
  List,
  Search,
  Volume2,
  Maximize2,
  Settings,
  MoreVertical,
  Eye,
  MessageSquare,
  Download,
  PlayCircle,
  Loader,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type InputStep = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

interface ChapterItem {
  id: string;
  title: string;
  titleEn: string;
  duration: string;
  completed: boolean;
  isInput: boolean;
  step: InputStep;
}

// ============================================================
// 상수 / Constants
// ============================================================

// 유튜브 스타일 색상 팔레트 / YouTube-style color palette
const YT_RED = '#FF0000';
const YT_DARK = '#0F0F0F';
const YT_GRAY = '#272727';
const YT_LIGHT_GRAY = '#3F3F3F';
const YT_TEXT = '#F1F1F1';
const YT_TEXT_DIM = '#AAAAAA';

// 챕터 목록 — 각 챕터가 하나의 "강의" / Chapter list — each chapter is one "lecture"
const chapters: ChapterItem[] = [
  { id: 'ch1', title: '내 국적 선택하기', titleEn: 'Select My Nationality', duration: '0:30', completed: false, isInput: true, step: 'nationality' },
  { id: 'ch2', title: '나이 정보 입력', titleEn: 'Enter Your Age', duration: '0:20', completed: false, isInput: true, step: 'age' },
  { id: 'ch3', title: '학력 수준 확인', titleEn: 'Confirm Education Level', duration: '0:25', completed: false, isInput: true, step: 'educationLevel' },
  { id: 'ch4', title: '보유 자금 설정', titleEn: 'Set Available Funds', duration: '0:20', completed: false, isInput: true, step: 'availableAnnualFund' },
  { id: 'ch5', title: '한국 체류 목표', titleEn: 'Your Goal in Korea', duration: '0:30', completed: false, isInput: true, step: 'finalGoal' },
  { id: 'ch6', title: '우선순위 선택', titleEn: 'Select Your Priority', duration: '0:25', completed: false, isInput: true, step: 'priorityPreference' },
];

// ============================================================
// 서브 컴포넌트: 가짜 프로그레스 바 / Sub component: Fake progress bar
// ============================================================
function VideoProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-1 bg-gray-700 cursor-pointer group">
      <div
        className="h-full bg-red-600 relative transition-all duration-300"
        style={{ width: `${progress}%` }}
      >
        {/* 빨간 원형 핸들 / Red circular handle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 챕터 마커 행 / Sub component: Chapter marker row
// ============================================================
function ChapterMarkers({ currentChapter, completedCount }: { currentChapter: number; completedCount: number }) {
  const totalChapters = chapters.length;
  return (
    <div className="flex gap-0.5 w-full h-1 bg-gray-700">
      {chapters.map((_, idx) => (
        <div
          key={idx}
          className={`flex-1 h-full transition-colors duration-300 ${
            idx < completedCount ? 'bg-red-600' :
            idx === currentChapter ? 'bg-red-400' : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 재생목록 아이템 / Sub component: Playlist item
// ============================================================
function PlaylistItem({
  chapter,
  index,
  isCurrent,
  isCompleted,
  onClick,
}: {
  chapter: ChapterItem;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
        isCurrent ? 'bg-gray-700' : 'hover:bg-gray-800'
      }`}
    >
      {/* 썸네일 / Thumbnail */}
      <div className="relative shrink-0 w-28 h-16 rounded overflow-hidden bg-gray-800 flex items-center justify-center">
        <div className="text-xs text-gray-500">Ch. {index + 1}</div>
        {isCompleted && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-red-500" />
          </div>
        )}
        {isCurrent && !isCompleted && (
          <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        )}
        {/* 재생 시간 배지 / Duration badge */}
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
          {chapter.duration}
        </div>
      </div>
      {/* 제목 + 정보 / Title + info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${isCurrent ? 'text-white' : 'text-gray-300'}`}>
          {chapter.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{chapter.titleEn}</p>
        <p className="text-xs text-gray-500 mt-1">잡차자 비자센터 · 조회수 4.2만회</p>
      </div>
      {/* 완료 표시 / Completion indicator */}
      {isCompleted && <CheckCircle className="shrink-0 w-4 h-4 text-red-500 mt-0.5" />}
    </button>
  );
}

// ============================================================
// 서브 컴포넌트: 결과 경로 카드 (영상 카드 스타일)
// Sub component: Result pathway card (video card style)
// ============================================================
function PathwayVideoCard({
  pathway,
  index,
  isSelected,
  onClick,
}: {
  pathway: CompatPathway;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all duration-300 ${
        isSelected ? 'border-red-500 shadow-lg shadow-red-900/30' : 'border-gray-700 hover:border-gray-500'
      }`}
    >
      {/* 썸네일 영역 / Thumbnail area */}
      <div className="relative bg-linear-to-br from-gray-800 to-gray-900 h-36 flex items-center justify-center">
        {/* 비자 체인 배지 / Visa chain badge */}
        <div className="text-center px-4">
          <div className="flex flex-wrap justify-center gap-1 mb-2">
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).slice(0, 3).map((v, i) => (
              <span key={i} className="bg-red-900/60 text-red-300 text-xs px-2 py-0.5 rounded-full border border-red-700/40">
                {v.code}
              </span>
            ))}
            {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length > 3 && (
              <span className="text-gray-500 text-xs self-center">+{(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 3}</span>
            )}
          </div>
          <div className="text-2xl font-bold" style={{ color: scoreColor }}>
            {pathway.finalScore}점
          </div>
        </div>
        {/* 재생 버튼 오버레이 / Play button overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-red-500 opacity-60" />
          </div>
        )}
        {/* 시간 배지 / Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {pathway.estimatedMonths}개월
        </div>
        {/* 에피소드 번호 / Episode number */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold">
          EP {index + 1}
        </div>
        {/* 적합도 배지 / Feasibility badge */}
        <div className="absolute top-2 right-2">
          <span className="text-base">{emoji}</span>
        </div>
      </div>
      {/* 카드 정보 / Card info */}
      <div className="p-3 bg-gray-900">
        <h3 className="text-sm font-semibold text-white leading-snug">{pathway.nameKo}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{pathway.nameEn}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {pathway.estimatedMonths}개월
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <DollarSign className="w-3 h-3" />
            {pathway.estimatedCostWon.toLocaleString()}만원
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{pathway.note}</p>
      </div>
    </button>
  );
}

// ============================================================
// 서브 컴포넌트: 수료증 / Sub component: Certificate
// ============================================================
function CourseCertificate({ input, pathways }: { input: DiagnosisInput; selectedPathways: CompatPathway[]; pathways: CompatPathway[] }) {
  const countryObj = popularCountries.find((c) => c.code === input.nationality);
  const eduObj = educationOptions.find((e) => e.value === input.educationLevel);
  const goalObj = goalOptions.find((g) => g.value === input.finalGoal);
  const topPathway = pathways[0];
  const today = new Date().toLocaleDateString('ko-KR');

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-yellow-500/60 bg-linear-to-br from-gray-900 via-yellow-950/20 to-gray-900 p-6">
      {/* 배경 워터마크 / Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Award className="w-64 h-64 text-yellow-500" />
      </div>
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-red-500 font-bold text-sm">잡차자 비자 아카데미</span>
        </div>
        <Award className="w-8 h-8 text-yellow-500" />
      </div>
      {/* 수료증 제목 / Certificate title */}
      <div className="text-center mb-6">
        <p className="text-yellow-400 text-xs tracking-widest mb-1">CERTIFICATE OF COMPLETION</p>
        <h2 className="text-2xl font-bold text-white">비자 진단 과정 수료</h2>
        <p className="text-gray-400 text-sm mt-1">한국 취업/유학 비자 경로 분석 완료</p>
      </div>
      {/* 수강생 정보 / Student info */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">국적 / Nationality</p>
            <p className="text-sm text-white font-medium">
              {countryObj?.flag} {countryObj?.nameKo}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">학력 / Education</p>
            <p className="text-sm text-white font-medium">{eduObj?.labelKo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">목표 / Goal</p>
            <p className="text-sm text-white font-medium">{goalObj?.emoji} {goalObj?.labelKo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">수료일 / Completed</p>
            <p className="text-sm text-white font-medium">{today}</p>
          </div>
        </div>
      </div>
      {/* 추천 경로 1위 / Top recommended pathway */}
      {topPathway && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-4">
          <p className="text-xs text-red-400 mb-1">최우선 추천 경로 / Top Recommended Pathway</p>
          <p className="text-base font-bold text-white">{topPathway.nameKo}</p>
          <p className="text-xs text-gray-400">{topPathway.visaChainStr}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-yellow-400 font-bold text-lg">{topPathway.finalScore}점</span>
            <span className="text-gray-400 text-sm">{topPathway.feasibilityLabel}</span>
          </div>
        </div>
      )}
      {/* 챕터 완료 배지 / Chapter completion badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {chapters.map((ch, idx) => (
          <div key={idx} className="flex items-center gap-1 bg-gray-800 rounded-full px-2 py-0.5">
            <CheckCircle className="w-3 h-3 text-red-500" />
            <span className="text-xs text-gray-400">Ch.{idx + 1}</span>
          </div>
        ))}
      </div>
      {/* 서명 라인 / Signature line */}
      <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">잡차자 비자 아카데미</p>
          <p className="text-xs text-gray-500">JobChaja Visa Academy</p>
        </div>
        <div className="text-right">
          <p className="text-yellow-400 font-semibold text-sm">★★★★★</p>
          <p className="text-xs text-gray-500">총 6챕터 수료</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 메인 컴포넌트 / Main component
// ============================================================
export default function Diagnosis67Page() {
  // 입력 상태 / Input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});
  // 현재 챕터 인덱스 / Current chapter index (0-5 = input steps, 6 = results)
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  // 완료된 챕터 수 / Number of completed chapters
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set());
  // 재생 상태 / Playing state
  const [isPlaying, setIsPlaying] = useState(false);
  // 가짜 프로그레스 / Fake progress
  const [videoProgress, setVideoProgress] = useState(0);
  // 결과 표시 여부 / Show results
  const [showResults, setShowResults] = useState(false);
  // 분석 중 / Analyzing
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // 선택된 결과 경로 / Selected result pathway
  const [selectedPathwayIdx, setSelectedPathwayIdx] = useState(0);
  // 좋아요 상태 / Like state
  const [isLiked, setIsLiked] = useState(false);
  // 구독 상태 / Subscribe state
  const [isSubscribed, setIsSubscribed] = useState(false);
  // 설명 펼침 / Expand description
  const [showDescription, setShowDescription] = useState(false);
  // 나이 입력 / Age input
  const [ageInput, setAgeInput] = useState('');

  // 결과 경로 리스트 / Result pathway list
  const resultPathways = mockPathways;
  const selectedPathway = resultPathways[selectedPathwayIdx];

  // 현재 스텝 / Current step
  const currentStep: InputStep | 'results' = showResults
    ? 'results'
    : chapters[currentChapterIdx]?.step ?? 'nationality';

  // 프로그레스 애니메이션 / Progress animation
  useEffect(() => {
    if (!isPlaying || showResults) return;
    const interval = setInterval(() => {
      setVideoProgress((prev) => Math.min(prev + 0.5, 100));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, showResults]);

  // 챕터 변경 시 프로그레스 리셋 / Reset progress on chapter change
  useEffect(() => {
    setVideoProgress(0);
    setIsPlaying(true);
  }, [currentChapterIdx]);

  // 선택값 핸들러 / Selection handler
  function handleSelect(field: keyof DiagnosisInput, value: string | number) {
    setInput((prev) => ({ ...prev, [field]: value }));
  }

  // 다음 챕터 / Go to next chapter
  function handleNextChapter() {
    // 현재 챕터 완료 처리 / Mark current chapter as completed
    setCompletedChapters((prev) => new Set(prev).add(currentChapterIdx));

    if (currentChapterIdx < chapters.length - 1) {
      setCurrentChapterIdx((prev) => prev + 1);
    } else {
      // 마지막 챕터 → 분석 시작 / Last chapter → start analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
        setVideoProgress(100);
      }, 2500);
    }
  }

  // 이전 챕터 / Go to previous chapter
  function handlePrevChapter() {
    if (currentChapterIdx > 0) {
      setCurrentChapterIdx((prev) => prev - 1);
    }
  }

  // 현재 챕터 입력 완료 여부 / Is current chapter input complete
  function isCurrentStepComplete(): boolean {
    switch (currentStep) {
      case 'nationality': return Boolean(input.nationality);
      case 'age': return Boolean(input.age && input.age > 0);
      case 'educationLevel': return Boolean(input.educationLevel);
      case 'availableAnnualFund': return input.availableAnnualFund !== undefined;
      case 'finalGoal': return Boolean(input.finalGoal);
      case 'priorityPreference': return Boolean(input.priorityPreference);
      default: return true;
    }
  }

  // 총 진행률 / Total progress
  const totalProgress = showResults
    ? 100
    : Math.round(((completedChapters.size) / chapters.length) * 100);

  // ============================================================
  // 챕터별 콘텐츠 렌더러 / Chapter content renderer
  // ============================================================
  function renderChapterContent() {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader className="w-12 h-12 text-red-500 animate-spin" />
          <p className="text-white text-lg font-semibold">비자 경로 분석 중...</p>
          <p className="text-gray-400 text-sm">14개 Evaluator가 31개 비자 유형을 검토하고 있습니다</p>
          <div className="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 animate-pulse rounded-full" style={{ width: '70%' }} />
          </div>
        </div>
      );
    }

    if (showResults) {
      return (
        <div className="space-y-4">
          {/* 수료증 / Certificate */}
          <CourseCertificate
            input={{ ...mockInput, ...input } as DiagnosisInput}
            selectedPathways={[selectedPathway]}
            pathways={resultPathways}
          />
          {/* 영상 카드 그리드 / Video card grid */}
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-red-500" />
              추천 비자 경로 시리즈 ({resultPathways.length}개)
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {resultPathways.map((pathway, idx) => (
                <PathwayVideoCard
                  key={pathway.pathwayId}
                  pathway={pathway}
                  index={idx}
                  isSelected={selectedPathwayIdx === idx}
                  onClick={() => setSelectedPathwayIdx(idx)}
                />
              ))}
            </div>
          </div>
          {/* 선택된 경로 상세 / Selected pathway detail */}
          {selectedPathway && (
            <div className="bg-gray-800 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-500" />
                {selectedPathway.nameKo} — 마일스톤
              </h4>
              <div className="space-y-2">
                {selectedPathway.milestones.map((ms, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center">
                      <span className="text-xs text-red-400 font-bold">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{ms.nameKo}</p>
                      <p className="text-xs text-gray-500">+{ms.monthFromStart}개월 · {ms.visaStatus || '비자 없음'}</p>
                    </div>
                    {ms.canWorkPartTime && (
                      <span className="shrink-0 text-xs text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded">
                        알바가능
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    switch (currentStep) {
      case 'nationality':
        return (
          <div>
            <h3 className="text-white text-lg font-bold mb-1">📍 출신 국가를 선택하세요</h3>
            <p className="text-gray-400 text-sm mb-4">Your nationality — 비자 자격 판단의 첫 번째 조건입니다</p>
            <div className="grid grid-cols-3 gap-2">
              {popularCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelect('nationality', country.code)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                    input.nationality === country.code
                      ? 'border-red-500 bg-red-900/20 text-white'
                      : 'border-gray-700 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-xs font-medium">{country.nameKo}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'age':
        return (
          <div>
            <h3 className="text-white text-lg font-bold mb-1">🎂 현재 나이를 입력하세요</h3>
            <p className="text-gray-400 text-sm mb-4">Your age — 일부 비자는 연령 제한이 있습니다</p>
            <div className="flex flex-col items-center gap-4">
              <input
                type="number"
                min={18}
                max={60}
                value={ageInput}
                onChange={(e) => {
                  setAgeInput(e.target.value);
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) handleSelect('age', val);
                }}
                placeholder="예: 24"
                className="w-40 text-center text-3xl font-bold bg-gray-800 border-2 border-gray-700 focus:border-red-500 text-white rounded-xl px-4 py-3 outline-none transition-colors"
              />
              <p className="text-gray-500 text-sm">18~60세 사이로 입력해주세요</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[20, 22, 24, 26, 28, 30, 35, 40].map((age) => (
                  <button
                    key={age}
                    onClick={() => { setAgeInput(String(age)); handleSelect('age', age); }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      input.age === age
                        ? 'border-red-500 bg-red-900/30 text-red-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {age}세
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'educationLevel':
        return (
          <div>
            <h3 className="text-white text-lg font-bold mb-1">🎓 최종 학력을 선택하세요</h3>
            <p className="text-gray-400 text-sm mb-4">Education level — 비자 종류와 점수에 영향을 미칩니다</p>
            <div className="space-y-2">
              {educationOptions.map((edu) => (
                <button
                  key={edu.value}
                  onClick={() => handleSelect('educationLevel', edu.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    input.educationLevel === edu.value
                      ? 'border-red-500 bg-red-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-xl">{edu.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{edu.labelKo}</p>
                    <p className="text-xs text-gray-500">{edu.labelEn}</p>
                  </div>
                  {input.educationLevel === edu.value && (
                    <CheckCircle className="ml-auto w-5 h-5 text-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'availableAnnualFund':
        return (
          <div>
            <h3 className="text-white text-lg font-bold mb-1">💰 보유 자금 범위를 선택하세요</h3>
            <p className="text-gray-400 text-sm mb-4">Available funds — 어학당·대학·생활비 등 연간 사용 가능 금액</p>
            <div className="space-y-2">
              {fundOptions.map((fund) => (
                <button
                  key={fund.value}
                  onClick={() => handleSelect('availableAnnualFund', fund.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    input.availableAnnualFund === fund.value
                      ? 'border-red-500 bg-red-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{fund.labelKo}</p>
                    <p className="text-xs text-gray-500">{fund.labelEn}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 rounded-full bg-red-600 transition-all"
                      style={{ width: `${Math.min((fundOptions.indexOf(fund) + 1) * 14, 80)}px` }}
                    />
                    {input.availableAnnualFund === fund.value && (
                      <CheckCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'finalGoal':
        return (
          <div>
            <h3 className="text-white text-lg font-bold mb-1">🎯 한국 체류 목표를 선택하세요</h3>
            <p className="text-gray-400 text-sm mb-4">Final goal — 목표에 따라 최적 비자 경로가 달라집니다</p>
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => handleSelect('finalGoal', goal.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    input.finalGoal === goal.value
                      ? 'border-red-500 bg-red-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-3xl">{goal.emoji}</span>
                  <p className="text-sm font-bold text-white">{goal.labelKo}</p>
                  <p className="text-xs text-gray-400 text-center">{goal.descKo}</p>
                  {input.finalGoal === goal.value && (
                    <CheckCircle className="w-5 h-5 text-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'priorityPreference':
        return (
          <div>
            <h3 className="text-white text-lg font-bold mb-1">⚡ 비자 경로 우선순위를 선택하세요</h3>
            <p className="text-gray-400 text-sm mb-4">Priority — 어떤 부분을 가장 중요하게 생각하나요?</p>
            <div className="space-y-2">
              {priorityOptions.map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => handleSelect('priorityPreference', priority.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    input.priorityPreference === priority.value
                      ? 'border-red-500 bg-red-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-2xl">{priority.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-white">{priority.labelKo}</p>
                    <p className="text-xs text-gray-400">{priority.descKo}</p>
                  </div>
                  {input.priorityPreference === priority.value && (
                    <CheckCircle className="w-5 h-5 text-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  // ============================================================
  // 렌더 / Render
  // ============================================================
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 유튜브 스타일 헤더 / YouTube-style header */}
      <header className="sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-7 h-5 bg-red-600 rounded-sm flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">잡차자</span>
            <span className="text-red-500 font-bold text-base">아카데미</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">
            ME
          </div>
        </div>
      </header>

      {/* 진행률 바 (전체) / Overall progress bar */}
      <div className="bg-gray-900 px-4 py-2 flex items-center gap-3">
        <span className="text-xs text-gray-400 shrink-0">전체 진행</span>
        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        <span className="text-xs text-red-400 font-bold shrink-0">{totalProgress}%</span>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* 메인 영상 플레이어 영역 / Main video player area */}
        <div className="bg-gray-900">
          {/* 가짜 비디오 화면 / Fake video screen */}
          <div className="relative bg-black aspect-video flex items-center justify-center">
            {/* 영상 배경 그라디언트 / Video background gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-black to-red-950/20" />
            {/* 챕터 정보 표시 / Chapter info display */}
            {!showResults && !isAnalyzing && (
              <div className="relative z-10 text-center px-6">
                <div className="text-red-500 text-xs font-bold tracking-widest mb-2">
                  CHAPTER {currentChapterIdx + 1} / {chapters.length}
                </div>
                <h2 className="text-white text-xl font-bold mb-1">
                  {chapters[currentChapterIdx]?.title}
                </h2>
                <p className="text-gray-400 text-sm">
                  {chapters[currentChapterIdx]?.titleEn}
                </p>
              </div>
            )}
            {showResults && (
              <div className="relative z-10 text-center px-6">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <div className="text-yellow-400 text-sm font-bold tracking-widest mb-1">
                  COURSE COMPLETE
                </div>
                <h2 className="text-white text-xl font-bold">비자 진단 완료!</h2>
                <p className="text-gray-400 text-sm mt-1">{resultPathways.length}개 경로 분석 완료</p>
              </div>
            )}
            {isAnalyzing && (
              <div className="relative z-10 text-center">
                <Loader className="w-10 h-10 text-red-500 animate-spin mx-auto mb-2" />
                <p className="text-gray-300 text-sm">분석 중...</p>
              </div>
            )}
            {/* 중앙 재생 버튼 / Center play button */}
            {!isPlaying && !isAnalyzing && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 z-20 flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </button>
            )}
          </div>

          {/* 컨트롤 바 / Control bar */}
          <div className="bg-black px-3 pb-2">
            {/* 챕터 마커 / Chapter markers */}
            <ChapterMarkers
              currentChapter={currentChapterIdx}
              completedCount={completedChapters.size}
            />
            {/* 프로그레스 바 / Progress bar */}
            <VideoProgressBar progress={videoProgress} />
            {/* 컨트롤 버튼들 / Control buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPlaying((p) => !p)} className="text-white">
                  {isPlaying
                    ? <Pause className="w-5 h-5" />
                    : <Play className="w-5 h-5 fill-white" />
                  }
                </button>
                <button onClick={handlePrevChapter} className="text-gray-400 hover:text-white" disabled={currentChapterIdx === 0}>
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextChapter}
                  className="text-gray-400 hover:text-white"
                  disabled={!isCurrentStepComplete() && !showResults}
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                <Volume2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-xs">
                  {showResults ? '완료' : `${completedChapters.size}/${chapters.length} 챕터`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-gray-400" />
                <Maximize2 className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* 영상 제목 + 메타 / Video title + meta */}
        <div className="px-4 py-3 border-b border-gray-800">
          <h1 className="text-white text-lg font-bold leading-snug">
            {showResults
              ? '🎓 한국 비자 진단 완료 — 나의 최적 경로'
              : `[비자 가이드] Ch.${currentChapterIdx + 1} ${chapters[currentChapterIdx]?.title}`
            }
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-gray-400 text-xs">조회수 42,819회</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-400 text-xs">2024. 2.</span>
            <span className="text-gray-600">·</span>
            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full">#비자진단</span>
            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full">#한국취업</span>
          </div>
        </div>

        {/* 좋아요/구독 바 / Like & subscribe bar */}
        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full bg-gray-800 overflow-hidden">
              <button
                onClick={() => setIsLiked((p) => !p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${isLiked ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : ''}`} />
                <span className="text-xs font-medium">{isLiked ? '3,429' : '3,428'}</span>
              </button>
              <div className="w-px h-4 bg-gray-600" />
              <button className="px-3 py-1.5 text-gray-400 hover:text-white">
                <span className="text-xs">👎</span>
              </button>
            </div>
            <button className="flex items-center gap-1.5 bg-gray-800 rounded-full px-3 py-1.5 text-gray-400 hover:text-white">
              <Share2 className="w-4 h-4" />
              <span className="text-xs">공유</span>
            </button>
            <button className="flex items-center gap-1.5 bg-gray-800 rounded-full px-3 py-1.5 text-gray-400 hover:text-white">
              <Download className="w-4 h-4" />
              <span className="text-xs">저장</span>
            </button>
          </div>
          <button>
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 채널 정보 + 구독 버튼 / Channel info + subscribe button */}
        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">잡차자 비자 아카데미</p>
              <p className="text-xs text-gray-400">구독자 12.5만명</p>
            </div>
          </div>
          <button
            onClick={() => setIsSubscribed((p) => !p)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              isSubscribed
                ? 'bg-gray-700 text-gray-300'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {isSubscribed ? '✅ 구독중' : '구독'}
          </button>
        </div>

        {/* 설명 + 알림 / Description + notification */}
        <div className="px-4 py-3 border-b border-gray-800">
          <button
            onClick={() => setShowDescription((p) => !p)}
            className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white"
          >
            <span>강의 소개 및 챕터 안내</span>
            {showDescription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showDescription && (
            <div className="mt-3 text-sm text-gray-400 space-y-2">
              <p>이 과정을 통해 본인의 상황에 맞는 최적의 한국 비자 경로를 진단받을 수 있습니다.</p>
              <p className="text-xs text-gray-500">잡차자 비자 매칭 엔진 v3.0 · 14개 Evaluator · 31개 비자 유형 · 2,629개 테스트 케이스</p>
              <div className="mt-2 space-y-1">
                {chapters.map((ch, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-red-400 text-xs">▶</span>
                    <span className="text-xs">{ch.duration} Ch.{idx + 1} — {ch.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 메인 콘텐츠 영역 / Main content area */}
        <div className="px-4 py-4">
          {/* 알림 배너 / Notification banner */}
          {!showResults && (
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 mb-4">
              <Bell className="w-4 h-4 text-yellow-400 shrink-0" />
              <p className="text-xs text-gray-300">
                <span className="text-white font-semibold">Ch.{currentChapterIdx + 1}</span>을 완료하면 다음 챕터로 이동합니다
              </p>
            </div>
          )}

          {/* 챕터 콘텐츠 / Chapter content */}
          <div className="mb-4">
            {renderChapterContent()}
          </div>

          {/* 다음/완료 버튼 / Next/Complete button */}
          {!showResults && !isAnalyzing && (
            <button
              onClick={handleNextChapter}
              disabled={!isCurrentStepComplete()}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isCurrentStepComplete()
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentChapterIdx < chapters.length - 1 ? (
                <>
                  <SkipForward className="w-4 h-4" />
                  다음 챕터로 이동 (Ch.{currentChapterIdx + 2})
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  비자 경로 분석 시작
                </>
              )}
            </button>
          )}

          {/* 알림 + 구독 CTA (결과 화면) / Notification + subscribe CTA (results) */}
          {showResults && (
            <div className="mt-4 bg-gray-800 rounded-xl p-4 flex items-center gap-3">
              <Bell className="w-6 h-6 text-red-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-white font-semibold">비자 정책 업데이트 알림 받기</p>
                <p className="text-xs text-gray-400">법령 개정 시 즉시 알림을 보내드립니다</p>
              </div>
              <button className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors">
                알림 설정
              </button>
            </div>
          )}
        </div>

        {/* 재생목록 / Playlist sidebar */}
        <div className="border-t border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold flex items-center gap-2">
              <List className="w-4 h-4 text-red-500" />
              강의 목록
            </h3>
            <span className="text-gray-400 text-xs">
              {completedChapters.size}/{chapters.length} 완료
            </span>
          </div>
          <div className="space-y-1">
            {chapters.map((chapter, idx) => (
              <PlaylistItem
                key={chapter.id}
                chapter={chapter}
                index={idx}
                isCurrent={!showResults && currentChapterIdx === idx}
                isCompleted={completedChapters.has(idx)}
                onClick={() => {
                  if (!showResults) {
                    setCurrentChapterIdx(idx);
                  }
                }}
              />
            ))}
            {/* 결과 챕터 / Results chapter */}
            <button
              disabled={!showResults}
              onClick={() => showResults && setSelectedPathwayIdx(0)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                showResults ? 'bg-yellow-900/20 hover:bg-yellow-900/30' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="relative shrink-0 w-28 h-16 rounded overflow-hidden bg-yellow-900/30 flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-500" />
                {showResults && (
                  <div className="absolute inset-0 bg-yellow-500/10" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-400">🎓 진단 결과 + 수료증</p>
                <p className="text-xs text-gray-500">Results & Certificate</p>
                <p className="text-xs text-gray-500 mt-0.5">잡차자 비자센터</p>
              </div>
              {showResults && <CheckCircle className="ml-auto shrink-0 w-4 h-4 text-yellow-500 mt-0.5" />}
            </button>
          </div>
        </div>

        {/* 댓글 섹션 / Comments section */}
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <h3 className="text-white font-bold text-sm">댓글 127개</h3>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0 flex items-center justify-center text-xs text-gray-400">U</div>
            <input
              type="text"
              placeholder="댓글 추가..."
              className="flex-1 bg-transparent border-b border-gray-700 text-sm text-white placeholder-gray-600 outline-none pb-1 focus:border-gray-400 transition-colors"
            />
          </div>
          {/* 샘플 댓글 / Sample comments */}
          <div className="space-y-3">
            {[
              { user: 'nguyen_h', comment: '정말 도움이 됐어요! E-9 비자 준비 중인데 이 영상 덕분에 정리됐습니다 👍', likes: 42 },
              { user: 'kim_visa', comment: '수료증 기능이 너무 귀엽네요 ㅋㅋ 실제로 유용한 정보가 많아서 좋았습니다', likes: 28 },
            ].map((comment, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0 flex items-center justify-center text-xs font-bold text-gray-400">
                  {comment.user[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">@{comment.user}</p>
                  <p className="text-sm text-gray-200">{comment.comment}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <button className="flex items-center gap-1 text-xs text-gray-500">
                      <ThumbsUp className="w-3 h-3" />
                      {comment.likes}
                    </button>
                    <button className="text-xs text-gray-500">답글</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 관련 영상 (다른 진단 디자인들) / Related videos */}
        <div className="border-t border-gray-800 px-4 py-4">
          <h3 className="text-white font-bold text-sm mb-3">관련 강의</h3>
          <div className="space-y-3">
            {[
              { title: 'E-7 특정활동 비자 완전 가이드', views: '8.2만', duration: '18:42' },
              { title: 'D-2 유학 → 취업 전환 로드맵', views: '5.7만', duration: '24:15' },
              { title: 'EPS 고용허가제 A to Z', views: '12.4만', duration: '31:07' },
            ].map((video, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="relative shrink-0 w-32 h-20 rounded-xl bg-gray-800 flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-gray-600" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white leading-snug">{video.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">잡차자 비자 아카데미</p>
                  <p className="text-xs text-gray-500 mt-0.5">조회수 {video.views}회</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 여백 / Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}
