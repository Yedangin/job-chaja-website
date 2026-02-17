'use client';
// KOR: 디자인 #63 — 레딧 스레드 스타일 비자 진단 페이지
// ENG: Design #63 — Reddit Thread Style Visa Diagnosis Page

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
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share2,
  Bookmark,
  Award,
  ChevronDown,
  ChevronUp,
  User,
  MoreHorizontal,
  ExternalLink,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

// KOR: 진단 스텝 타입 정의
// ENG: Diagnosis step type definition
type Step = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference' | 'result';

// KOR: 업보트 상태를 위한 타입
// ENG: Type for upvote state
interface VoteState {
  [key: string]: 'up' | 'down' | null;
}

// KOR: 어워드 타입 정의
// ENG: Award type definition
interface Award {
  emoji: string;
  label: string;
  color: string;
}

// KOR: 사용 가능한 어워드 목록
// ENG: List of available awards
const AWARDS: Award[] = [
  { emoji: '🏆', label: 'Gold', color: 'text-yellow-400' },
  { emoji: '🥈', label: 'Silver', color: 'text-gray-400' },
  { emoji: '🥉', label: 'Bronze', color: 'text-orange-400' },
  { emoji: '⭐', label: 'Star', color: 'text-yellow-300' },
  { emoji: '💡', label: 'Helpful', color: 'text-blue-400' },
];

// KOR: 경로별 상위 댓글 (레딧 스타일)
// ENG: Top comment per pathway (Reddit style)
const PATHWAY_COMMENTS: Record<string, string[]> = {
  'path-1': [
    'D-2-7 후 E-7-R 전환은 제가 직접 해본 경로입니다. 취업률도 높고 강력히 추천합니다!',
    '석사 2년이 길게 느껴질 수 있지만 장기적으로 가장 안정적인 경로입니다.',
    'IT 분야라면 이 경로가 최고입니다. 저는 네이버에 입사했어요.',
  ],
  'path-2': [
    '어학연수부터 시작하는 게 한국 생활 적응에 훨씬 도움됩니다.',
    '시간이 오래 걸리지만 한국어 실력이 크게 향상되는 장점이 있어요.',
  ],
  'path-3': [
    'E-9 비자로 시작해서 F-2-6까지 전환한 선배들 많습니다. 꾸준함이 핵심!',
    '초기 비용이 적게 든다는 점에서 경제적으로 여유롭지 않은 분들에게 좋습니다.',
    '사회통합프로그램 미리 시작하세요. 나중에 엄청 도움됩니다.',
  ],
};

// KOR: 스텝별 질문 정보
// ENG: Question info per step
const STEP_QUESTIONS: Record<string, { question: string; subtext: string; user: string; karma: number }> = {
  nationality: {
    question: '국적이 어디이신가요? (What is your nationality?)',
    subtext: 'r/KoreaVisa 커뮤니티에서 도움을 요청하고 있습니다.',
    user: 'visa_seeker_2024',
    karma: 1234,
  },
  age: {
    question: '현재 연령을 알려주세요. (How old are you?)',
    subtext: '나이는 일부 비자 카테고리의 자격 요건에 영향을 줍니다.',
    user: 'visa_seeker_2024',
    karma: 1234,
  },
  educationLevel: {
    question: '최종 학력 수준이 어떻게 되시나요? (What is your education level?)',
    subtext: '학력은 E-7, F-2-7 등 전문비자 자격에 중요합니다.',
    user: 'visa_seeker_2024',
    karma: 1234,
  },
  availableAnnualFund: {
    question: '연간 가용 자금은 얼마인가요? (Annual available fund?)',
    subtext: '비자 준비, 생활비, 교육비 등을 포함한 총 예산입니다.',
    user: 'visa_seeker_2024',
    karma: 1234,
  },
  finalGoal: {
    question: '한국 체류의 최종 목표는 무엇인가요? (Final goal in Korea?)',
    subtext: '목표에 맞는 최적의 비자 경로를 추천해드립니다.',
    user: 'visa_seeker_2024',
    karma: 1234,
  },
  priorityPreference: {
    question: '가장 중요하게 생각하는 요소는? (What is your priority?)',
    subtext: '우선순위에 따라 추천 경로의 순서가 달라집니다.',
    user: 'visa_seeker_2024',
    karma: 1234,
  },
};

export default function Diagnosis63Page() {
  // KOR: 현재 스텝 상태
  // ENG: Current step state
  const [currentStep, setCurrentStep] = useState<Step>('nationality');

  // KOR: 사용자 입력 상태
  // ENG: User input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // KOR: 결과 상태
  // ENG: Result state
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // KOR: 업보트/다운보트 상태
  // ENG: Upvote/downvote state
  const [votes, setVotes] = useState<VoteState>({});

  // KOR: 어워드 부여 상태
  // ENG: Award given state
  const [awardedItems, setAwardedItems] = useState<Record<string, Award[]>>({});

  // KOR: 확장된 경로 ID (경로 상세 토글)
  // ENG: Expanded pathway ID (pathway detail toggle)
  const [expandedPath, setExpandedPath] = useState<string | null>('path-1');

  // KOR: 어워드 선택 팝업 상태
  // ENG: Award selection popup state
  const [showAwardFor, setShowAwardFor] = useState<string | null>(null);

  // KOR: 나이 입력 상태
  // ENG: Age input state
  const [ageInput, setAgeInput] = useState<string>('');

  // KOR: 스텝 순서 정의
  // ENG: Step order definition
  const STEPS: Step[] = ['nationality', 'age', 'educationLevel', 'availableAnnualFund', 'finalGoal', 'priorityPreference', 'result'];

  // KOR: 업보트/다운보트 토글 핸들러
  // ENG: Toggle upvote/downvote handler
  const handleVote = (id: string, direction: 'up' | 'down') => {
    setVotes((prev) => ({
      ...prev,
      [id]: prev[id] === direction ? null : direction,
    }));
  };

  // KOR: 어워드 부여 핸들러
  // ENG: Award granting handler
  const handleAward = (id: string, award: Award) => {
    setAwardedItems((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), award],
    }));
    setShowAwardFor(null);
  };

  // KOR: 다음 스텝으로 이동
  // ENG: Move to next step
  const goNext = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      const nextStep = STEPS[currentIndex + 1];
      if (nextStep === 'result') {
        setResult(mockDiagnosisResult);
      }
      setCurrentStep(nextStep);
    }
  };

  // KOR: 투표 수 계산 헬퍼
  // ENG: Vote count calculation helper
  const getVoteCount = (id: string, base: number): number => {
    const vote = votes[id];
    if (vote === 'up') return base + 1;
    if (vote === 'down') return base - 1;
    return base;
  };

  // KOR: 현재 입력값이 유효한지 확인
  // ENG: Check if current input is valid
  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 'nationality': return !!input.nationality;
      case 'age': return !!input.age && input.age > 0;
      case 'educationLevel': return !!input.educationLevel;
      case 'availableAnnualFund': return !!input.availableAnnualFund;
      case 'finalGoal': return !!input.finalGoal;
      case 'priorityPreference': return !!input.priorityPreference;
      default: return true;
    }
  };

  // KOR: Reddit 스타일 헤더 컴포넌트
  // ENG: Reddit style header component
  const RedditHeader = () => (
    <div className="bg-[#1a1a1b] border-b border-[#343536] sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* KOR: 레딧 로고 스타일 아이콘 / ENG: Reddit-style logo icon */}
          <div className="w-8 h-8 bg-[#ff4500] rounded-full flex items-center justify-center text-white font-bold text-sm">
            J
          </div>
          <span className="text-white font-bold text-lg">잡차자</span>
          <span className="text-[#818384] text-sm">/ r/KoreaVisa</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#ff4500] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#e03d00] transition-colors">
            가입하기
          </button>
          <button className="border border-[#ff4500] text-[#ff4500] px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#ff4500]/10 transition-colors">
            로그인
          </button>
        </div>
      </div>
    </div>
  );

  // KOR: 서브레딧 배너 컴포넌트
  // ENG: Subreddit banner component
  const SubredditBanner = () => (
    <div className="bg-linear-to-br from-[#ff4500] to-[#ff6534] h-20 w-full" />
  );

  // KOR: 서브레딧 사이드바 컴포넌트
  // ENG: Subreddit sidebar component
  const Sidebar = () => (
    <div className="w-72 shrink-0 space-y-3">
      {/* KOR: 커뮤니티 정보 카드 / ENG: Community info card */}
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-md overflow-hidden">
        <div className="bg-linear-to-br from-[#ff4500] to-[#ff6534] h-12" />
        <div className="p-3">
          <h2 className="text-white font-bold text-base mb-1">r/KoreaVisa</h2>
          <p className="text-[#d7dadc] text-xs mb-3">한국 비자 취득을 위한 모든 정보와 커뮤니티. 잡차자 AI가 최적의 비자 경로를 찾아드립니다.</p>
          <div className="flex justify-between mb-3">
            <div className="text-center">
              <p className="text-white font-bold text-sm">42.1k</p>
              <p className="text-[#818384] text-xs">멤버</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-sm">312</p>
              <p className="text-[#818384] text-xs">온라인</p>
            </div>
          </div>
          <button className="w-full bg-[#ff4500] text-white py-2 rounded-full text-sm font-semibold hover:bg-[#e03d00] transition-colors">
            커뮤니티 가입
          </button>
        </div>
      </div>

      {/* KOR: 커뮤니티 규칙 / ENG: Community rules */}
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-md p-3">
        <h3 className="text-[#d7dadc] font-bold text-sm mb-2">커뮤니티 규칙</h3>
        {['1. 진실된 정보만 공유', '2. 비자 전문가 검증 필요', '3. 개인정보 보호', '4. 친절한 답변 문화'].map((rule) => (
          <p key={rule} className="text-[#818384] text-xs py-1 border-b border-[#343536] last:border-0">{rule}</p>
        ))}
      </div>

      {/* KOR: 비자 분류 / ENG: Visa categories */}
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-md p-3">
        <h3 className="text-[#d7dadc] font-bold text-sm mb-2">비자 카테고리</h3>
        {['E-7 전문인력', 'D-2 유학', 'F-2 거주', 'E-9 비전문', 'F-5 영주권'].map((tag) => (
          <span key={tag} className="inline-block bg-[#343536] text-[#d7dadc] text-xs px-2 py-0.5 rounded-full mr-1 mb-1 cursor-pointer hover:bg-[#ff4500]/20 hover:text-[#ff4500] transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  // KOR: 투표 버튼 컴포넌트
  // ENG: Vote button component
  const VoteButtons = ({ id, baseCount }: { id: string; baseCount: number }) => (
    <div className="flex flex-col items-center gap-1 w-8">
      <button
        onClick={() => handleVote(id, 'up')}
        className={`p-0.5 rounded hover:text-[#ff4500] transition-colors ${votes[id] === 'up' ? 'text-[#ff4500]' : 'text-[#818384]'}`}
      >
        <ArrowUp size={16} />
      </button>
      <span className={`text-xs font-bold ${votes[id] === 'up' ? 'text-[#ff4500]' : votes[id] === 'down' ? 'text-[#9494ff]' : 'text-[#d7dadc]'}`}>
        {getVoteCount(id, baseCount)}
      </span>
      <button
        onClick={() => handleVote(id, 'down')}
        className={`p-0.5 rounded hover:text-[#9494ff] transition-colors ${votes[id] === 'down' ? 'text-[#9494ff]' : 'text-[#818384]'}`}
      >
        <ArrowDown size={16} />
      </button>
    </div>
  );

  // KOR: 어워드 배지 표시 컴포넌트
  // ENG: Award badge display component
  const AwardBadges = ({ id }: { id: string }) => {
    const awards = awardedItems[id] || [];
    if (awards.length === 0) return null;
    return (
      <div className="flex items-center gap-1 ml-1">
        {awards.slice(0, 3).map((a, i) => (
          <span key={i} className={`text-xs ${a.color}`} title={a.label}>{a.emoji}</span>
        ))}
        {awards.length > 3 && <span className="text-[#818384] text-xs">+{awards.length - 3}</span>}
      </div>
    );
  };

  // KOR: 어워드 팝업 컴포넌트
  // ENG: Award popup component
  const AwardPopup = ({ id }: { id: string }) => (
    <div className="absolute z-20 bg-[#1a1a1b] border border-[#343536] rounded-md shadow-xl p-3 -top-2 left-full ml-2 w-48">
      <p className="text-[#d7dadc] text-xs font-bold mb-2">어워드 부여</p>
      <div className="grid grid-cols-3 gap-1">
        {AWARDS.map((award) => (
          <button
            key={award.label}
            onClick={() => handleAward(id, award)}
            className="flex flex-col items-center p-1.5 rounded hover:bg-[#343536] transition-colors"
          >
            <span className="text-lg">{award.emoji}</span>
            <span className={`text-xs ${award.color}`}>{award.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // KOR: 포스트 액션 바 컴포넌트
  // ENG: Post action bar component
  const PostActionBar = ({ id, commentCount }: { id: string; commentCount: number }) => (
    <div className="flex items-center gap-1 mt-2">
      <button className="flex items-center gap-1.5 text-[#818384] hover:text-[#d7dadc] hover:bg-[#343536] px-2 py-1 rounded text-xs transition-colors">
        <MessageSquare size={13} />
        <span>{commentCount} 댓글</span>
      </button>
      <button className="flex items-center gap-1.5 text-[#818384] hover:text-[#d7dadc] hover:bg-[#343536] px-2 py-1 rounded text-xs transition-colors">
        <Share2 size={13} />
        <span>공유</span>
      </button>
      <div className="relative">
        <button
          onClick={() => setShowAwardFor(showAwardFor === id ? null : id)}
          className="flex items-center gap-1.5 text-[#818384] hover:text-[#d7dadc] hover:bg-[#343536] px-2 py-1 rounded text-xs transition-colors"
        >
          <Award size={13} />
          <span>어워드</span>
        </button>
        {showAwardFor === id && <AwardPopup id={id} />}
      </div>
      <button className="flex items-center gap-1.5 text-[#818384] hover:text-[#d7dadc] hover:bg-[#343536] px-2 py-1 rounded text-xs transition-colors">
        <Bookmark size={13} />
        <span>저장</span>
      </button>
      <button className="flex items-center gap-1.5 text-[#818384] hover:text-[#d7dadc] hover:bg-[#343536] px-2 py-1 rounded text-xs transition-colors">
        <MoreHorizontal size={13} />
      </button>
    </div>
  );

  // KOR: Q&A 질문 포스트 컴포넌트 (진단 스텝용)
  // ENG: Q&A question post component (for diagnosis steps)
  const QuestionPost = () => {
    const info = STEP_QUESTIONS[currentStep];
    if (!info) return null;
    const stepIndex = STEPS.indexOf(currentStep) + 1;

    return (
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-md overflow-hidden hover:border-[#818384] transition-colors">
        <div className="flex">
          {/* KOR: 투표 영역 / ENG: Vote area */}
          <div className="bg-[#161617] w-10 flex flex-col items-center py-3 gap-1">
            <VoteButtons id={`q-${currentStep}`} baseCount={42} />
          </div>

          {/* KOR: 콘텐츠 영역 / ENG: Content area */}
          <div className="flex-1 p-3">
            {/* KOR: 메타 정보 / ENG: Meta info */}
            <div className="flex items-center gap-2 text-xs text-[#818384] mb-2">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-[#ff4500] rounded-full flex items-center justify-center">
                  <User size={10} className="text-white" />
                </div>
                <span className="text-[#d7dadc] font-semibold">{info.user}</span>
                <span className="bg-[#ff4500] text-white text-xs px-1 rounded font-bold">OP</span>
              </div>
              <span>•</span>
              <span>카르마 {info.karma.toLocaleString()}</span>
              <span>•</span>
              <span>방금 전</span>
              <AwardBadges id={`q-${currentStep}`} />
            </div>

            {/* KOR: 포스트 제목 / ENG: Post title */}
            <h2 className="text-[#d7dadc] font-bold text-base mb-1">
              [질문 {stepIndex}/6] {info.question}
            </h2>
            <p className="text-[#818384] text-sm mb-3">{info.subtext}</p>

            {/* KOR: 스텝별 입력 UI / ENG: Step-specific input UI */}
            <div className="bg-[#272729] rounded-md p-3 border border-[#343536]">
              {currentStep === 'nationality' && (
                <div>
                  <p className="text-[#d7dadc] text-sm mb-3 font-medium">국적을 선택해주세요:</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {popularCountries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setInput((p) => ({ ...p, nationality: c.name }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors ${input.nationality === c.name ? 'border-[#ff4500] bg-[#ff4500]/10 text-[#ff4500]' : 'border-[#343536] text-[#d7dadc] hover:border-[#818384]'}`}
                      >
                        <span>{c.flag}</span>
                        <span className="truncate text-xs">{c.name}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="직접 입력 (Other nationality)..."
                    value={!popularCountries.find(c => c.name === input.nationality) ? (input.nationality || '') : ''}
                    onChange={(e) => setInput((p) => ({ ...p, nationality: e.target.value }))}
                    className="w-full bg-[#1a1a1b] border border-[#343536] rounded px-3 py-2 text-[#d7dadc] text-sm placeholder-[#818384] focus:outline-none focus:border-[#ff4500]"
                  />
                </div>
              )}

              {currentStep === 'age' && (
                <div>
                  <p className="text-[#d7dadc] text-sm mb-3 font-medium">만 나이를 입력해주세요 (Age in years):</p>
                  <input
                    type="number"
                    min={15}
                    max={80}
                    placeholder="예: 25"
                    value={ageInput}
                    onChange={(e) => {
                      setAgeInput(e.target.value);
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) setInput((p) => ({ ...p, age: val }));
                    }}
                    className="w-full bg-[#1a1a1b] border border-[#343536] rounded px-3 py-2 text-[#d7dadc] text-sm placeholder-[#818384] focus:outline-none focus:border-[#ff4500] mb-3"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[20, 25, 28, 30, 35, 40].map((age) => (
                      <button
                        key={age}
                        onClick={() => { setAgeInput(String(age)); setInput((p) => ({ ...p, age })); }}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${input.age === age ? 'border-[#ff4500] bg-[#ff4500]/10 text-[#ff4500]' : 'border-[#343536] text-[#818384] hover:border-[#818384] hover:text-[#d7dadc]'}`}
                      >
                        {age}세
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'educationLevel' && (
                <div>
                  <p className="text-[#d7dadc] text-sm mb-3 font-medium">최종 학력 (Education level):</p>
                  <div className="space-y-2">
                    {educationOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setInput((p) => ({ ...p, educationLevel: opt }))}
                        className={`w-full text-left px-3 py-2.5 rounded-md border text-sm transition-colors flex items-center gap-2 ${input.educationLevel === opt ? 'border-[#ff4500] bg-[#ff4500]/10 text-[#ff4500]' : 'border-[#343536] text-[#d7dadc] hover:border-[#818384]'}`}
                      >
                        {input.educationLevel === opt ? (
                          <CheckCircle size={14} className="text-[#ff4500] shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-[#818384] shrink-0" />
                        )}
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'availableAnnualFund' && (
                <div>
                  <p className="text-[#d7dadc] text-sm mb-3 font-medium">연간 가용 자금 범위 (Annual budget):</p>
                  <div className="space-y-2">
                    {fundOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setInput((p) => ({ ...p, availableAnnualFund: opt }))}
                        className={`w-full text-left px-3 py-2.5 rounded-md border text-sm transition-colors flex items-center justify-between ${input.availableAnnualFund === opt ? 'border-[#ff4500] bg-[#ff4500]/10 text-[#ff4500]' : 'border-[#343536] text-[#d7dadc] hover:border-[#818384]'}`}
                      >
                        <span>{opt}</span>
                        {input.availableAnnualFund === opt && <CheckCircle size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'finalGoal' && (
                <div>
                  <p className="text-[#d7dadc] text-sm mb-3 font-medium">최종 목표 (Final goal):</p>
                  <div className="space-y-2">
                    {goalOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setInput((p) => ({ ...p, finalGoal: opt }))}
                        className={`w-full text-left px-3 py-2.5 rounded-md border text-sm transition-colors flex items-center gap-2 ${input.finalGoal === opt ? 'border-[#ff4500] bg-[#ff4500]/10 text-[#ff4500]' : 'border-[#343536] text-[#d7dadc] hover:border-[#818384]'}`}
                      >
                        {input.finalGoal === opt ? (
                          <CheckCircle size={14} className="text-[#ff4500] shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-[#818384] shrink-0" />
                        )}
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'priorityPreference' && (
                <div>
                  <p className="text-[#d7dadc] text-sm mb-3 font-medium">우선순위 (Priority preference):</p>
                  <div className="grid grid-cols-2 gap-2">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setInput((p) => ({ ...p, priorityPreference: opt }))}
                        className={`px-3 py-2.5 rounded-md border text-sm transition-colors text-center ${input.priorityPreference === opt ? 'border-[#ff4500] bg-[#ff4500]/10 text-[#ff4500]' : 'border-[#343536] text-[#d7dadc] hover:border-[#818384]'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* KOR: 진행 상태 표시 / ENG: Progress indicator */}
            <div className="flex items-center gap-2 mt-3">
              {STEPS.slice(0, -1).map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${i < STEPS.indexOf(currentStep) ? 'bg-[#ff4500]' : i === STEPS.indexOf(currentStep) ? 'bg-[#ff4500]/60' : 'bg-[#343536]'}`}
                />
              ))}
            </div>

            <PostActionBar id={`q-${currentStep}`} commentCount={37} />
          </div>
        </div>

        {/* KOR: 답변 버튼 (다음 스텝) / ENG: Reply button (next step) */}
        <div className="border-t border-[#343536] px-3 py-2 flex justify-end">
          <button
            onClick={goNext}
            disabled={!isCurrentStepValid()}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${isCurrentStepValid() ? 'bg-[#ff4500] text-white hover:bg-[#e03d00] shadow-lg shadow-[#ff4500]/20' : 'bg-[#343536] text-[#818384] cursor-not-allowed'}`}
          >
            {currentStep === 'priorityPreference' ? '진단 결과 확인 🚀' : '다음 질문으로 →'}
          </button>
        </div>
      </div>
    );
  };

  // KOR: 경로 카드 컴포넌트 (레딧 댓글 스타일)
  // ENG: Pathway card component (Reddit comment style)
  const PathwayComment = ({ pathway, rank }: { pathway: RecommendedPathway; rank: number }) => {
    const isExpanded = expandedPath === pathway.id;
    const comments = PATHWAY_COMMENTS[pathway.id] || [];
    const scoreColor = getScoreColor(pathway.feasibilityLabel);
    const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

    return (
      <div className="pl-4 border-l-2 border-[#343536] hover:border-[#ff4500]/50 transition-colors">
        <div className="bg-[#1a1a1b] rounded-md border border-[#343536] overflow-hidden mb-2">
          <div className="flex">
            {/* KOR: 투표 영역 / ENG: Vote area */}
            <div className="bg-[#161617] w-10 flex flex-col items-center py-3">
              <VoteButtons id={pathway.id} baseCount={rank === 1 ? 892 : rank === 2 ? 654 : 234} />
            </div>

            <div className="flex-1 p-3">
              {/* KOR: 댓글 메타 / ENG: Comment meta */}
              <div className="flex items-center gap-2 text-xs text-[#818384] mb-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${rank === 1 ? 'bg-[#ff4500]' : rank === 2 ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    AI
                  </div>
                  <span className="text-[#d7dadc] font-semibold">JobChaJa_Bot</span>
                  {rank === 1 && <span className="bg-[#ff4500] text-white text-xs px-1 rounded font-bold">TOP 1</span>}
                </div>
                <span>•</span>
                <span>잡차자 AI</span>
                <span>•</span>
                <span>방금 분석됨</span>
                <AwardBadges id={pathway.id} />
              </div>

              {/* KOR: 경로 제목 / ENG: Pathway title */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-white text-sm font-bold px-2 py-0.5 rounded ${scoreColor}`}>
                  {emoji} {pathway.feasibilityLabel} ({pathway.feasibilityScore}%)
                </span>
                <h3 className="text-[#d7dadc] font-bold text-base">{pathway.name}</h3>
              </div>

              <p className="text-[#818384] text-sm mb-3">{pathway.description}</p>

              {/* KOR: 핵심 통계 (인라인) / ENG: Key stats (inline) */}
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-[#d7dadc] text-sm">
                  <Clock size={14} className="text-[#818384]" />
                  <span className="font-semibold">{pathway.totalDurationMonths}개월</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#d7dadc] text-sm">
                  <DollarSign size={14} className="text-[#818384]" />
                  <span className="font-semibold">${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#d7dadc] text-sm">
                  <TrendingUp size={14} className="text-[#818384]" />
                  <span>비자 체인: </span>
                  {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                    <span key={v.visa} className="text-[#ff4500] font-semibold">{v.visa}{i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 ? ' → ' : ''}</span>
                  ))}
                </div>
              </div>

              {/* KOR: 확장/축소 버튼 / ENG: Expand/collapse button */}
              <button
                onClick={() => setExpandedPath(isExpanded ? null : pathway.id)}
                className="flex items-center gap-1.5 text-[#ff4500] hover:text-[#e03d00] text-sm font-medium transition-colors"
              >
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {isExpanded ? '간략히 보기' : '상세 경로 펼치기'}
              </button>

              {/* KOR: 상세 경로 (확장 시) / ENG: Detailed pathway (when expanded) */}
              {isExpanded && (
                <div className="mt-3 bg-[#272729] rounded-md p-3 border border-[#343536]">
                  <p className="text-[#818384] text-xs font-semibold mb-2 uppercase tracking-wide">마일스톤 / Milestones</p>
                  <div className="space-y-2">
                    {pathway.milestones.map((m, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 bg-[#343536] rounded-full flex items-center justify-center text-base shrink-0">
                            {m.emoji}
                          </div>
                          {i < pathway.milestones.length - 1 && (
                            <div className="w-0.5 h-6 bg-[#343536] mt-1" />
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="text-[#d7dadc] text-sm font-semibold">{m.title}</p>
                          <p className="text-[#818384] text-xs mt-0.5">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* KOR: 비자 체인 상세 / ENG: Visa chain detail */}
                  <div className="mt-3 pt-3 border-t border-[#343536]">
                    <p className="text-[#818384] text-xs font-semibold mb-2 uppercase tracking-wide">비자 체인 / Visa Chain</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                        <React.Fragment key={v.visa}>
                          <div className="bg-[#343536] rounded px-2 py-1 text-center">
                            <p className="text-[#ff4500] font-bold text-sm">{v.visa}</p>
                            <p className="text-[#818384] text-xs">{v.duration}</p>
                          </div>
                          {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                            <span className="text-[#818384]">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <PostActionBar id={pathway.id} commentCount={comments.length * 7} />
            </div>
          </div>
        </div>

        {/* KOR: 중첩 댓글 (실제 사용자 후기) / ENG: Nested comments (real user reviews) */}
        {isExpanded && comments.map((comment, i) => (
          <div key={i} className="pl-4 border-l-2 border-[#343536] ml-4 mb-1">
            <div className="bg-[#1a1a1b] rounded-md border border-[#343536] p-3">
              <div className="flex gap-3">
                <VoteButtons id={`${pathway.id}-c${i}`} baseCount={12 + i * 8} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-[#818384] mb-1">
                    <div className="w-4 h-4 bg-[#343536] rounded-full flex items-center justify-center">
                      <User size={8} className="text-[#818384]" />
                    </div>
                    <span className="text-[#d7dadc] font-semibold">
                      {['korea_success_2023', 'visa_approved_vn', 'e7_converted'][i % 3]}
                    </span>
                    <span>•</span>
                    <span>{2 + i}시간 전</span>
                    <AwardBadges id={`${pathway.id}-c${i}`} />
                  </div>
                  <p className="text-[#d7dadc] text-sm">{comment}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="text-[#818384] hover:text-[#d7dadc] text-xs">답글</button>
                    <button className="text-[#818384] hover:text-[#d7dadc] text-xs">신고</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // KOR: 결과 페이지 컴포넌트
  // ENG: Result page component
  const ResultPage = () => (
    <div className="space-y-4">
      {/* KOR: OP 원본 포스트 (진단 요청) / ENG: OP original post (diagnosis request) */}
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-md overflow-hidden">
        <div className="flex">
          <div className="bg-[#161617] w-10 flex flex-col items-center py-3">
            <VoteButtons id="op-post" baseCount={156} />
          </div>
          <div className="flex-1 p-3">
            <div className="flex items-center gap-2 text-xs text-[#818384] mb-2">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-[#ff4500] rounded-full flex items-center justify-center">
                  <User size={10} className="text-white" />
                </div>
                <span className="text-[#d7dadc] font-semibold">visa_seeker_2024</span>
                <span className="bg-[#ff4500] text-white text-xs px-1 rounded font-bold">OP</span>
              </div>
              <span>•</span>
              <span>카르마 1,234</span>
              <AwardBadges id="op-post" />
            </div>
            <h1 className="text-[#d7dadc] font-bold text-lg mb-2">
              [진단 완료] 한국 비자 최적 경로를 찾고 있어요 — AI 분석 결과
            </h1>
            <div className="bg-[#272729] rounded-md p-3 border border-[#343536] text-sm text-[#818384] space-y-1">
              <p><span className="text-[#d7dadc] font-medium">국적:</span> {input.nationality || mockInput.nationality}</p>
              <p><span className="text-[#d7dadc] font-medium">나이:</span> {input.age || mockInput.age}세</p>
              <p><span className="text-[#d7dadc] font-medium">학력:</span> {input.educationLevel || mockInput.educationLevel}</p>
              <p><span className="text-[#d7dadc] font-medium">예산:</span> {input.availableAnnualFund || mockInput.availableAnnualFund}</p>
              <p><span className="text-[#d7dadc] font-medium">목표:</span> {input.finalGoal || mockInput.finalGoal}</p>
              <p><span className="text-[#d7dadc] font-medium">우선순위:</span> {input.priorityPreference || mockInput.priorityPreference}</p>
            </div>
            <PostActionBar id="op-post" commentCount={3} />
          </div>
        </div>
      </div>

      {/* KOR: 정렬 및 통계 바 / ENG: Sort and stats bar */}
      <div className="flex items-center justify-between text-xs text-[#818384]">
        <div className="flex items-center gap-3">
          <span>{result?.pathways.length}개 경로 분석됨</span>
          <span className="text-[#ff4500] font-semibold">• AI 최신 분석</span>
        </div>
        <div className="flex items-center gap-2">
          <span>정렬:</span>
          <button className="text-[#d7dadc] font-semibold bg-[#343536] px-2 py-0.5 rounded">적합도순</button>
          <button className="hover:text-[#d7dadc] px-2 py-0.5 rounded">기간순</button>
          <button className="hover:text-[#d7dadc] px-2 py-0.5 rounded">비용순</button>
        </div>
      </div>

      {/* KOR: 비자 경로 목록 (댓글 스타일) / ENG: Visa pathway list (comment style) */}
      {result?.pathways.map((pathway, i) => (
        <PathwayComment key={pathway.id} pathway={pathway} rank={i + 1} />
      ))}

      {/* KOR: 전문 상담 CTA / ENG: Professional consultation CTA */}
      <div className="bg-[#1a1a1b] border border-[#343536] rounded-md p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-[#ff4500]/10 rounded-full flex items-center justify-center shrink-0">
          <ExternalLink size={18} className="text-[#ff4500]" />
        </div>
        <div>
          <h3 className="text-[#d7dadc] font-bold text-sm mb-1">전문 비자 상담이 필요하신가요?</h3>
          <p className="text-[#818384] text-xs mb-2">잡차자 파트너 행정사와 1:1 무료 상담을 연결해드립니다. AI 분석 결과를 바탕으로 맞춤형 전략을 수립해드려요.</p>
          <button className="bg-[#ff4500] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#e03d00] transition-colors">
            무료 상담 신청하기 →
          </button>
        </div>
      </div>

      {/* KOR: 다시 진단하기 / ENG: Restart diagnosis */}
      <div className="text-center pt-2">
        <button
          onClick={() => { setCurrentStep('nationality'); setInput({}); setResult(null); setAgeInput(''); }}
          className="text-[#818384] hover:text-[#d7dadc] text-sm underline transition-colors"
        >
          처음부터 다시 진단하기
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#dae0e6]">
      <RedditHeader />

      {/* KOR: 서브레딧 배너 및 정보 / ENG: Subreddit banner and info */}
      <SubredditBanner />
      <div className="bg-white border-b border-[#edeff1]">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-[#ff4500] rounded-full border-4 border-white -mt-6 flex items-center justify-center text-white font-black text-xl">
            J
          </div>
          <div>
            <h1 className="font-black text-xl text-[#1c1c1c]">r/KoreaVisa</h1>
            <p className="text-[#878a8c] text-sm">잡차자 AI 비자 진단 서비스</p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="bg-[#ff4500] text-white px-4 py-1.5 rounded-full text-sm font-bold">
              가입
            </button>
          </div>
        </div>
      </div>

      {/* KOR: 메인 콘텐츠 레이아웃 / ENG: Main content layout */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* KOR: 좌측 콘텐츠 영역 / ENG: Left content area */}
          <div className="flex-1 min-w-0">
            {currentStep !== 'result' ? <QuestionPost /> : <ResultPage />}
          </div>

          {/* KOR: 우측 사이드바 / ENG: Right sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
