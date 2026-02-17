'use client';

// 네이버 카페 스타일 비자 진단 페이지 / Naver Cafe style visa diagnosis page
// 게시판 형태의 비자 정보 탐색 UI / Bulletin board style visa info browsing UI

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
  Search,
  ChevronRight,
  ChevronDown,
  ThumbsUp,
  MessageSquare,
  Eye,
  Star,
  Crown,
  Flame,
  Pin,
  Clock,
  User,
  BookOpen,
  Globe,
  Filter,
  Home,
  List,
  FileText,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  PenLine,
  RefreshCw,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

// 카페 등급 / Cafe member grade
interface CafeGrade {
  label: string;
  color: string;
  bg: string;
  border: string;
}

// 게시글 목업 댓글 / Bulletin post mock comment
interface PostComment {
  id: number;
  author: string;
  grade: string;
  content: string;
  likes: number;
  time: string;
  replies?: PostComment[];
}

// ============================================================
// 상수 / Constants
// ============================================================

// 카페 등급 시스템 / Cafe grade system
const CAFE_GRADES: Record<string, CafeGrade> = {
  일반회원: { label: '일반회원', color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' },
  정회원: { label: '정회원', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-300' },
  우수회원: { label: '우수회원', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-300' },
  스태프: { label: '스태프', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-300' },
  매니저: { label: '매니저', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-300' },
};

// 입력 단계 목록 / Input step list
const INPUT_STEPS: { key: StepKey; label: string; icon: string }[] = [
  { key: 'nationality', label: '국적', icon: '🌍' },
  { key: 'age', label: '나이', icon: '🎂' },
  { key: 'educationLevel', label: '학력', icon: '🎓' },
  { key: 'availableAnnualFund', label: '자금', icon: '💰' },
  { key: 'finalGoal', label: '목표', icon: '🎯' },
  { key: 'priorityPreference', label: '우선순위', icon: '⚡' },
];

// 카테고리 메뉴 / Category menu
const BOARD_CATEGORIES = [
  { id: 'all', label: '전체글', icon: List },
  { id: 'popular', label: '인기글', icon: Flame },
  { id: 'work', label: '취업비자', icon: FileText },
  { id: 'study', label: '유학비자', icon: BookOpen },
  { id: 'residence', label: '거주비자', icon: Home },
  { id: 'tips', label: '비자팁', icon: Star },
];

// 목업 댓글 / Mock comments
function getMockComments(pathway: CompatPathway): PostComment[] {
  return [
    {
      id: 1,
      author: '비자전문가김씨',
      grade: '매니저',
      content: `${pathway.nameKo} 경로는 실제로 많이 선택하는 루트입니다. 준비를 철저히 하시면 좋은 결과가 있을 거예요!`,
      likes: 42,
      time: '2시간 전',
      replies: [
        {
          id: 11,
          author: '베트남유학생',
          grade: '정회원',
          content: '정말 도움이 됐어요. 감사합니다 🙏',
          likes: 8,
          time: '1시간 전',
        },
        {
          id: 12,
          author: '취업준비생',
          grade: '일반회원',
          content: `비용은 ${pathway.estimatedCostWon > 0 ? pathway.estimatedCostWon.toLocaleString() + '만원' : '0원'}이면 얼마나 준비해야 할까요?`,
          likes: 3,
          time: '45분 전',
        },
      ],
    },
    {
      id: 2,
      author: '이민컨설턴트',
      grade: '스태프',
      content: `소요 기간 ${pathway.estimatedMonths}개월은 최소 기준입니다. 개인 상황에 따라 더 걸릴 수 있으니 여유 있게 계획하세요.`,
      likes: 27,
      time: '5시간 전',
      replies: [],
    },
    {
      id: 3,
      author: '성공후기남',
      grade: '우수회원',
      content: '저도 이 경로로 성공했어요! 포기하지 마세요 💪',
      likes: 15,
      time: '1일 전',
      replies: [],
    },
  ];
}

// ============================================================
// 서브 컴포넌트: 카페 헤더 / Sub-component: Cafe header
// ============================================================

function CafeHeader({ onSearch }: { onSearch: (q: string) => void }) {
  // 검색어 상태 / Search query state
  const [query, setQuery] = useState('');

  return (
    <div className="bg-[#03c75a] text-white">
      {/* 상단 네이버 스타일 바 / Top Naver-style bar */}
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight">NAVER</span>
          <span className="text-green-200">카페</span>
        </div>
        <div className="flex items-center gap-3 text-green-100">
          <span>로그인</span>
          <span>|</span>
          <span>회원가입</span>
        </div>
      </div>

      {/* 카페 타이틀 / Cafe title */}
      <div className="max-w-5xl mx-auto px-4 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl">🛂</span>
          </div>
          <div>
            <h1 className="font-bold text-xl">잡차자 비자정보 카페</h1>
            <p className="text-green-100 text-xs">외국인 비자·취업 정보 공유 커뮤니티 · 회원 12,847명</p>
          </div>
        </div>

        {/* 검색바 / Search bar */}
        <div className="flex gap-2">
          <div className="flex-1 bg-white rounded flex items-center px-3 gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
              placeholder="비자 종류, 국적, 직종으로 검색..."
              className="flex-1 py-2 text-sm text-gray-800 outline-none bg-transparent"
            />
          </div>
          <button
            onClick={() => onSearch(query)}
            className="bg-white text-[#03c75a] px-4 py-2 rounded text-sm font-bold hover:bg-green-50 transition-colors"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 사이드바 / Sub-component: Sidebar
// ============================================================

function CafeSidebar({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}) {
  return (
    <aside className="w-48 shrink-0">
      {/* 카테고리 메뉴 / Category menu */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="bg-gray-50 border-b border-gray-200 px-3 py-2">
          <span className="text-xs font-bold text-gray-700">게시판 목록</span>
        </div>
        {BOARD_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors border-b border-gray-100 last:border-0 ${
                activeCategory === cat.id
                  ? 'bg-green-50 text-[#03c75a] font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 카페 정보 / Cafe info */}
      <div className="mt-3 bg-white border border-gray-200 rounded p-3">
        <div className="text-xs font-bold text-gray-700 mb-2">카페 정보</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>전체글</span>
            <span className="font-medium">48,293</span>
          </div>
          <div className="flex justify-between">
            <span>오늘 방문자</span>
            <span className="font-medium">3,421</span>
          </div>
          <div className="flex justify-between">
            <span>개설일</span>
            <span className="font-medium">2020.03</span>
          </div>
        </div>
      </div>

      {/* 내 등급 / My grade */}
      <div className="mt-3 bg-white border border-gray-200 rounded p-3">
        <div className="text-xs font-bold text-gray-700 mb-2">내 등급</div>
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-gray-600">정회원</span>
        </div>
        <div className="mt-1 bg-gray-200 rounded-full h-1.5">
          <div className="bg-[#03c75a] rounded-full h-1.5 w-3/5" />
        </div>
        <p className="text-xs text-gray-400 mt-1">우수회원까지 120글 더</p>
      </div>
    </aside>
  );
}

// ============================================================
// 서브 컴포넌트: 게시글 작성 폼 (입력 플로우) / Input flow as post writing form
// ============================================================

function PostWriteForm({
  input,
  currentStep,
  onUpdate,
  onNext,
  onSubmit,
}: {
  input: Partial<DiagnosisInput>;
  currentStep: number;
  onUpdate: (key: StepKey, value: string | number) => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  // 현재 단계 정보 / Current step info
  const step = INPUT_STEPS[currentStep];
  const isLast = currentStep === INPUT_STEPS.length - 1;

  return (
    <div className="bg-white border border-gray-200 rounded mb-3">
      {/* 게시글 작성 헤더 / Post write header */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-[#03c75a]" />
          <span className="text-sm font-bold text-gray-800">비자 진단 신청서 작성</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          {INPUT_STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < currentStep
                    ? 'bg-[#03c75a] text-white'
                    : i === currentStep
                    ? 'bg-[#03c75a] text-white ring-2 ring-green-200'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </span>
              {i < INPUT_STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* 현재 단계 질문 / Current step question */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{step.icon}</span>
          <div>
            <p className="text-xs text-gray-500">질문 {currentStep + 1}/{INPUT_STEPS.length}</p>
            <h3 className="text-sm font-bold text-gray-800">
              {step.key === 'nationality' && '국적을 선택해주세요'}
              {step.key === 'age' && '나이를 입력해주세요'}
              {step.key === 'educationLevel' && '최종 학력을 선택해주세요'}
              {step.key === 'availableAnnualFund' && '연간 사용 가능한 자금 규모는?'}
              {step.key === 'finalGoal' && '한국 체류 최종 목표는?'}
              {step.key === 'priorityPreference' && '어떤 경로를 우선시하나요?'}
            </h3>
          </div>
        </div>

        {/* 국적 선택 / Nationality selection */}
        {step.key === 'nationality' && (
          <div className="grid grid-cols-4 gap-2">
            {popularCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => onUpdate('nationality', c.code)}
                className={`flex flex-col items-center gap-1 p-2 rounded border text-xs transition-all ${
                  input.nationality === c.code
                    ? 'border-[#03c75a] bg-green-50 text-[#03c75a] font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <span className="text-lg">{c.flag}</span>
                <span>{c.nameKo}</span>
              </button>
            ))}
          </div>
        )}

        {/* 나이 입력 / Age input */}
        {step.key === 'age' && (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={18}
              max={65}
              value={input.age ?? ''}
              onChange={(e) => onUpdate('age', parseInt(e.target.value) || 0)}
              placeholder="예: 24"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-32 focus:outline-none focus:border-[#03c75a]"
            />
            <span className="text-sm text-gray-500">세</span>
            <span className="text-xs text-gray-400">(18~65세)</span>
          </div>
        )}

        {/* 학력 선택 / Education selection */}
        {step.key === 'educationLevel' && (
          <div className="grid grid-cols-2 gap-2">
            {educationOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate('educationLevel', opt.value)}
                className={`flex items-center gap-2 p-2 rounded border text-sm transition-all text-left ${
                  input.educationLevel === opt.value
                    ? 'border-[#03c75a] bg-green-50 text-[#03c75a] font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.labelKo}</span>
              </button>
            ))}
          </div>
        )}

        {/* 자금 선택 / Fund selection */}
        {step.key === 'availableAnnualFund' && (
          <div className="grid grid-cols-2 gap-2">
            {fundOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate('availableAnnualFund', opt.value)}
                className={`p-2 rounded border text-sm transition-all text-left ${
                  input.availableAnnualFund === opt.value
                    ? 'border-[#03c75a] bg-green-50 text-[#03c75a] font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                💰 {opt.labelKo}
              </button>
            ))}
          </div>
        )}

        {/* 목표 선택 / Goal selection */}
        {step.key === 'finalGoal' && (
          <div className="grid grid-cols-2 gap-2">
            {goalOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate('finalGoal', opt.value)}
                className={`flex flex-col p-3 rounded border text-sm transition-all text-left ${
                  input.finalGoal === opt.value
                    ? 'border-[#03c75a] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-lg mb-1">{opt.emoji}</span>
                <span className={`font-bold ${input.finalGoal === opt.value ? 'text-[#03c75a]' : 'text-gray-800'}`}>
                  {opt.labelKo}
                </span>
                <span className="text-xs text-gray-500">{opt.descKo}</span>
              </button>
            ))}
          </div>
        )}

        {/* 우선순위 선택 / Priority selection */}
        {step.key === 'priorityPreference' && (
          <div className="grid grid-cols-2 gap-2">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate('priorityPreference', opt.value)}
                className={`flex flex-col p-3 rounded border text-sm transition-all text-left ${
                  input.priorityPreference === opt.value
                    ? 'border-[#03c75a] bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-lg mb-1">{opt.emoji}</span>
                <span className={`font-bold ${input.priorityPreference === opt.value ? 'text-[#03c75a]' : 'text-gray-800'}`}>
                  {opt.labelKo}
                </span>
                <span className="text-xs text-gray-500">{opt.descKo}</span>
              </button>
            ))}
          </div>
        )}

        {/* 하단 버튼 / Bottom buttons */}
        <div className="flex justify-end mt-4 gap-2">
          {isLast ? (
            <button
              onClick={onSubmit}
              className="bg-[#03c75a] text-white px-6 py-2 rounded text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              진단 결과 보기
            </button>
          ) : (
            <button
              onClick={onNext}
              className="bg-[#03c75a] text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              다음 <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 게시글 행 / Post row in board list
// ============================================================

function PostRow({
  rank,
  pathway,
  isHot,
  isPinned,
  onClick,
}: {
  rank: number;
  pathway: CompatPathway;
  isHot: boolean;
  isPinned: boolean;
  onClick: () => void;
}) {
  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  return (
    <tr
      onClick={onClick}
      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      {/* 번호/순위 / Number/rank */}
      <td className="py-2 px-3 text-center w-10">
        {isPinned ? (
          <Pin className="w-3.5 h-3.5 text-red-500 mx-auto" />
        ) : isHot ? (
          <span className="text-xs font-bold text-red-500">{rank}</span>
        ) : (
          <span className="text-xs text-gray-400">{rank}</span>
        )}
      </td>

      {/* 제목 / Title */}
      <td className="py-2 px-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isPinned && (
            <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">공지</span>
          )}
          {isHot && !isPinned && (
            <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
              <Flame className="w-3 h-3" />인기
            </span>
          )}
          <span className="text-sm text-gray-800 hover:text-[#03c75a]">
            {emoji} [{pathway.visaChainStr}] {pathway.nameKo}
          </span>
          <span className="text-xs text-[#03c75a] font-medium">[{pathway.estimatedMonths}개월]</span>
        </div>
      </td>

      {/* 작성자 / Author */}
      <td className="py-2 px-2 w-24 text-center">
        <span className="text-xs text-gray-500">잡차자봇</span>
      </td>

      {/* 날짜 / Date */}
      <td className="py-2 px-2 w-20 text-center">
        <span className="text-xs text-gray-400">2025.12.01</span>
      </td>

      {/* 조회수 / Views */}
      <td className="py-2 px-2 w-16 text-center">
        <div className="flex items-center justify-center gap-1">
          <Eye className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">{(pathway.finalScore * 47 + 312).toLocaleString()}</span>
        </div>
      </td>

      {/* 점수/추천 / Score/likes */}
      <td className="py-2 px-3 w-14 text-center">
        <span
          className="text-xs font-bold"
          style={{ color: scoreColor }}
        >
          {pathway.finalScore}점
        </span>
      </td>
    </tr>
  );
}

// ============================================================
// 서브 컴포넌트: 댓글 트리 / Comment tree
// ============================================================

function CommentTree({ comments }: { comments: PostComment[] }) {
  // 좋아요 상태 / Like state
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderComment = (comment: PostComment, isReply = false) => {
    const grade = CAFE_GRADES[comment.grade] ?? CAFE_GRADES['일반회원'];
    const liked = likedIds.has(comment.id);

    return (
      <div key={comment.id} className={isReply ? 'ml-6 border-l-2 border-gray-100 pl-3' : ''}>
        <div className="py-2 border-b border-gray-100">
          {/* 댓글 헤더 / Comment header */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <span className="text-xs font-bold text-gray-700">{comment.author}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded border ${grade.color} ${grade.bg} ${grade.border}`}
            >
              {grade.label}
            </span>
            <span className="text-xs text-gray-400">{comment.time}</span>
          </div>

          {/* 댓글 내용 / Comment content */}
          <p className="text-sm text-gray-700 ml-8 mb-1">{comment.content}</p>

          {/* 댓글 액션 / Comment actions */}
          <div className="flex items-center gap-3 ml-8">
            <button
              onClick={() => toggleLike(comment.id)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                liked ? 'text-[#03c75a]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>{comment.likes + (liked ? 1 : 0)}</span>
            </button>
            <button className="text-xs text-gray-400 hover:text-gray-600">답글</button>
          </div>

          {/* 대댓글 / Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-bold text-gray-700">댓글 {comments.length}</span>
      </div>
      <div className="border border-gray-200 rounded bg-white">
        {comments.map((c) => (
          <div key={c.id} className="px-4">
            {renderComment(c)}
          </div>
        ))}
        {/* 댓글 작성 / Comment write */}
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-[#03c75a] rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#03c75a]"
          />
          <button className="bg-[#03c75a] text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-green-600">
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 게시글 상세 / Post detail view
// ============================================================

function PostDetail({
  pathway,
  onBack,
}: {
  pathway: CompatPathway;
  onBack: () => void;
}) {
  const comments = getMockComments(pathway);
  const scoreColor = getScoreColor(pathway.finalScore);
  const emoji = getFeasibilityEmoji(pathway.feasibilityLabel);

  // 마일스톤 아이콘 / Milestone icon helper
  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'entry': return '✈️';
      case 'part_time_unlock': return '💼';
      case 'study_upgrade': return '📚';
      case 'waiting': return '⏳';
      case 'graduation': return '🎓';
      case 'final_goal': return '🏆';
      case 'application': return '📝';
      default: return '📌';
    }
  };

  return (
    <div>
      {/* 게시글 제목 영역 / Post title area */}
      <div className="bg-white border border-gray-200 rounded mb-3">
        {/* 게시판 위치 / Board breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-1 text-xs text-gray-500">
          <Home className="w-3 h-3" />
          <ChevronRight className="w-3 h-3" />
          <span>비자정보</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium">취업비자</span>
        </div>

        <div className="p-4">
          {/* 제목 / Title */}
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-base font-bold text-gray-900">
              {emoji} [{pathway.visaChainStr}] {pathway.nameKo}
            </h2>
            <span
              className="text-sm font-bold px-2 py-0.5 rounded ml-2 shrink-0"
              style={{ color: scoreColor, backgroundColor: scoreColor + '15' }}
            >
              {pathway.finalScore}점
            </span>
          </div>

          {/* 메타 정보 / Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="font-medium text-[#03c75a]">잡차자봇</span>
              <span className="bg-green-100 text-[#03c75a] px-1.5 py-0.5 rounded font-bold">매니저</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>2025.12.01</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{(pathway.finalScore * 47 + 312).toLocaleString()} 조회</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{pathway.finalScore + 12} 추천</span>
            </div>
          </div>

          {/* 요약 정보 카드 / Summary info cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
              <p className="text-xs text-gray-500 mb-0.5">소요 기간</p>
              <p className="text-sm font-bold text-gray-800">{pathway.estimatedMonths}개월</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
              <p className="text-xs text-gray-500 mb-0.5">예상 비용</p>
              <p className="text-sm font-bold text-gray-800">
                {pathway.estimatedCostWon === 0 ? '무료' : `${pathway.estimatedCostWon.toLocaleString()}만원`}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded p-2 text-center">
              <p className="text-xs text-gray-500 mb-0.5">가능성</p>
              <p className="text-sm font-bold text-gray-800">{pathway.feasibilityLabel}</p>
            </div>
          </div>

          {/* 비자 경로 / Visa chain */}
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-700 mb-2">📋 비자 경로</h3>
            <div className="flex flex-wrap items-center gap-1">
              {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v, i) => (
                <div key={v.code} className="flex items-center gap-1">
                  <span className="bg-[#03c75a] text-white text-xs px-2 py-0.5 rounded font-bold">
                    {v.code}
                  </span>
                  {i < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 마일스톤 타임라인 / Milestone timeline */}
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-700 mb-2">🗓️ 단계별 로드맵</h3>
            <div className="space-y-2">
              {pathway.milestones.map((m) => (
                <div key={m.order} className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-[#03c75a] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {m.order}
                    </div>
                    {m.order < pathway.milestones.length && (
                      <div className="w-0.5 h-4 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{getMilestoneIcon(m.type)}</span>
                      <span className="text-sm font-medium text-gray-800">{m.nameKo}</span>
                      <span className="text-xs text-gray-400">({m.monthFromStart}개월차)</span>
                      {m.visaStatus && m.visaStatus !== 'none' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                          {m.visaStatus}
                        </span>
                      )}
                    </div>
                    {m.canWork && (
                      <p className="text-xs text-green-600 mt-0.5">
                        ✅ 알바 가능 {m.weeklyHours > 0 ? `(주 ${m.weeklyHours}시간)` : ''}
                        {m.estimatedMonthlyIncome > 0 ? ` — 월 ~${m.estimatedMonthlyIncome}만원` : ''}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">
                      📌 {Array.isArray(m.requirements) ? m.requirements.join(', ') : m.requirements}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 참고사항 / Note */}
          <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
            <p className="text-xs font-bold text-amber-700 mb-1">⚠️ 참고사항</p>
            <p className="text-sm text-amber-700">{pathway.note}</p>
          </div>

          {/* 다음 단계 / Next steps */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 mb-2">✅ 지금 해야 할 것</h3>
            <div className="space-y-2">
              {pathway.nextSteps.map((ns) => (
                <div key={ns.actionType} className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <CheckCircle className="w-4 h-4 text-[#03c75a] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{ns.nameKo}</p>
                    <p className="text-xs text-gray-500">{ns.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 액션 / Bottom actions */}
        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            ← 목록으로
          </button>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-sm text-gray-500 border border-gray-200 rounded px-3 py-1 hover:bg-gray-50">
              <ThumbsUp className="w-4 h-4" />
              추천
            </button>
            <button className="bg-[#03c75a] text-white text-sm px-4 py-1 rounded font-bold hover:bg-green-600">
              상담 신청
            </button>
          </div>
        </div>
      </div>

      {/* 댓글 트리 / Comment tree */}
      <CommentTree comments={comments} />
    </div>
  );
}

// ============================================================
// 서브 컴포넌트: 인기글 랭킹 사이드 박스 / Hot posts ranking sidebar box
// ============================================================

function HotRankingBox({ pathways, onSelect }: { pathways: CompatPathway[]; onSelect: (p: CompatPathway) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-3 mb-3">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
        <TrendingUp className="w-4 h-4 text-[#03c75a]" />
        <span className="text-sm font-bold text-gray-800">실시간 인기 비자 경로</span>
      </div>
      <div className="space-y-2">
        {pathways.slice(0, 5).map((p, i) => {
          const scoreColor = getScoreColor(p.finalScore);
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="w-full flex items-center gap-2 text-left hover:bg-gray-50 rounded p-1 transition-colors"
            >
              <span
                className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center shrink-0 ${
                  i === 0 ? 'bg-red-500 text-white' :
                  i === 1 ? 'bg-orange-500 text-white' :
                  i === 2 ? 'bg-amber-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{p.nameKo}</p>
                <p className="text-xs text-gray-400">{p.estimatedMonths}개월</p>
              </div>
              <span className="text-xs font-bold shrink-0" style={{ color: scoreColor }}>
                {p.finalScore}점
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================

export default function Diagnosis69Page() {
  // 입력 상태 / Input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>(mockInput);
  // 현재 단계 / Current step
  const [currentStep, setCurrentStep] = useState(0);
  // 결과 표시 여부 / Whether to show results
  const [showResult, setShowResult] = useState(false);
  // 선택된 게시글 (비자 경로) / Selected post (visa pathway)
  const [selectedPathway, setSelectedPathway] = useState<CompatPathway | null>(null);
  // 활성 카테고리 / Active category
  const [activeCategory, setActiveCategory] = useState('all');
  // 검색어 / Search query
  const [searchQuery, setSearchQuery] = useState('');

  // 결과 데이터 / Result data
  const result: DiagnosisResult = mockDiagnosisResult;
  const pathways = mockPathways;

  // 입력 업데이트 핸들러 / Input update handler
  const handleUpdate = (key: StepKey, value: string | number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  // 다음 단계 핸들러 / Next step handler
  const handleNext = () => {
    const stepKey = INPUT_STEPS[currentStep].key;
    if (!input[stepKey] && input[stepKey] !== 0) return;
    setCurrentStep((prev) => Math.min(prev + 1, INPUT_STEPS.length - 1));
  };

  // 제출 핸들러 / Submit handler
  const handleSubmit = () => {
    setShowResult(true);
  };

  // 초기화 핸들러 / Reset handler
  const handleReset = () => {
    setShowResult(false);
    setCurrentStep(0);
    setSelectedPathway(null);
    setInput(mockInput);
  };

  // 검색 핸들러 / Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResult(true);
    setSelectedPathway(null);
  };

  // 필터된 경로 / Filtered pathways
  const filteredPathways = pathways.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.nameKo.includes(searchQuery) ||
      p.visaChainStr.includes(searchQuery) ||
      p.note.includes(searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans">
      {/* 카페 헤더 / Cafe header */}
      <CafeHeader onSearch={handleSearch} />

      {/* 카페 서브 GNB / Cafe sub navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {['카페홈', '전체글보기', '비자진단', '취업정보', '유학정보', '멤버', '카페채팅'].map((menu, i) => (
              <button
                key={menu}
                className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  i === 2
                    ? 'border-[#03c75a] text-[#03c75a] font-bold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {menu}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 / Main content */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* 사이드바 / Sidebar */}
          <CafeSidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          {/* 메인 영역 / Main area */}
          <div className="flex-1 min-w-0">
            {/* 게시판 헤더 / Board header */}
            <div className="bg-white border border-gray-200 rounded mb-3 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#03c75a]" />
                <span className="text-sm font-bold text-gray-800">비자 진단 게시판</span>
                <span className="text-xs text-gray-400">— AI 맞춤 비자 경로 분석</span>
              </div>
              <div className="flex items-center gap-2">
                {showResult && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
                  >
                    <RefreshCw className="w-3 h-3" />
                    다시 진단
                  </button>
                )}
                <button className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50">
                  <Filter className="w-3 h-3" />
                  필터
                </button>
              </div>
            </div>

            {/* 게시글 상세 보기 / Post detail view */}
            {selectedPathway ? (
              <PostDetail
                pathway={selectedPathway}
                onBack={() => setSelectedPathway(null)}
              />
            ) : !showResult ? (
              /* 입력 폼 (게시글 작성 스타일) / Input form (post writing style) */
              <PostWriteForm
                input={input}
                currentStep={currentStep}
                onUpdate={handleUpdate}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            ) : (
              /* 결과 목록 (게시판 스타일) / Result list (bulletin board style) */
              <div>
                {/* 결과 요약 배너 / Result summary banner */}
                <div className="bg-green-50 border border-green-200 rounded p-3 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#03c75a]" />
                    <div>
                      <span className="text-sm font-bold text-gray-800">
                        {result.meta.totalPathwaysEvaluated}개 경로 분석 완료
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({result.meta.hardFilteredOut}개 부적합 제외)
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(result.meta.timestamp).toLocaleString('ko-KR')}
                  </span>
                </div>

                {/* 게시글 목록 테이블 / Post list table */}
                <div className="bg-white border border-gray-200 rounded overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-2 px-3 text-xs text-gray-500 font-medium text-center w-10">번호</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium text-left">제목</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium text-center w-24">작성자</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium text-center w-20">날짜</th>
                        <th className="py-2 px-2 text-xs text-gray-500 font-medium text-center w-16">조회</th>
                        <th className="py-2 px-3 text-xs text-gray-500 font-medium text-center w-14">점수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPathways.map((pathway, idx) => (
                        <PostRow
                          key={pathway.id}
                          rank={idx + 1}
                          pathway={pathway}
                          isHot={idx < 2}
                          isPinned={idx === 0}
                          onClick={() => setSelectedPathway(pathway)}
                        />
                      ))}
                      {filteredPathways.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                            검색 결과가 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 페이징 / Pagination */}
                <div className="flex justify-center items-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-7 h-7 text-xs rounded ${
                        page === 1
                          ? 'bg-[#03c75a] text-white font-bold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 우측 위젯 / Right widgets */}
          <div className="w-44 shrink-0 hidden lg:block">
            {/* 인기글 랭킹 / Hot ranking */}
            {showResult && (
              <HotRankingBox pathways={pathways} onSelect={setSelectedPathway} />
            )}

            {/* 광고/안내 박스 / Ad/info box */}
            <div className="bg-white border border-gray-200 rounded p-3 mb-3">
              <div className="text-xs font-bold text-gray-700 mb-2">📢 공지사항</div>
              <div className="space-y-1.5 text-xs text-gray-600">
                <p className="hover:text-[#03c75a] cursor-pointer">• 비자 규정 개정 안내 (2026.01)</p>
                <p className="hover:text-[#03c75a] cursor-pointer">• EPS-TOPIK 시험 일정</p>
                <p className="hover:text-[#03c75a] cursor-pointer">• 무료 비자 상담 이벤트</p>
              </div>
            </div>

            {/* 빠른 링크 / Quick links */}
            <div className="bg-white border border-gray-200 rounded p-3">
              <div className="text-xs font-bold text-gray-700 mb-2">🔗 바로가기</div>
              <div className="space-y-1.5 text-xs text-gray-600">
                <p className="hover:text-[#03c75a] cursor-pointer">• 출입국외국인청</p>
                <p className="hover:text-[#03c75a] cursor-pointer">• EPS 고용허가제</p>
                <p className="hover:text-[#03c75a] cursor-pointer">• 한국어능력시험 TOPIK</p>
                <p className="hover:text-[#03c75a] cursor-pointer">• GKS 장학금</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 / Footer */}
      <footer className="mt-8 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-400">
          <span>잡차자 비자정보 카페 © 2026 Jobchaja. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <span>이용약관</span>
            <span>|</span>
            <span>개인정보처리방침</span>
            <span>|</span>
            <span>고객센터</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
