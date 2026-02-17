'use client';

// KOR: 비자 진단 디자인 #8 — 이메일 스레드 (Gmail/Outlook 스타일)
// ENG: Visa diagnosis design #8 — Email Thread (Gmail/Outlook style)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mail,
  Send,
  Inbox,
  Star,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Clock,
  Archive,
  MoreHorizontal,
  Search,
  RefreshCw,
  Globe,
  Target,
  Zap,
  DollarSign,
  ArrowRight,
  FileText,
  Check,
  BookOpen,
  User,
  ChevronRight,
  CornerDownRight,
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

// ============================================================
// KOR: 로컬 타입 정의 / ENG: Local type definitions
// ============================================================

/** KOR: 질문 필드 단계 키 / ENG: Question field step key */
type QuestionField = 'nationality' | 'age' | 'education' | 'fund' | 'goal' | 'priority';

/** KOR: 전체 흐름 단계 / ENG: Overall flow step */
type FlowStep = QuestionField | 'analyzing' | 'result';

/** KOR: 이메일 메시지 타입 / ENG: Email message type */
type EmailType = 'question' | 'answer' | 'result_header';

/** KOR: 이메일 메시지 인터페이스 / ENG: Email message interface */
interface EmailMessage {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  body: string;
  timestamp: Date;
  isStarred: boolean;
  hasAttachment: boolean;
  field?: QuestionField;
  answerLabel?: string;
  type: EmailType;
}

/** KOR: 폴더 탭 키 / ENG: Folder tab key */
type FolderKey = 'inbox' | 'sent' | 'starred' | 'results' | 'archive';

// ============================================================
// KOR: 단계별 이메일 질문 데이터 / ENG: Step question email data
// ============================================================

interface StepData {
  field: QuestionField;
  subject: string;
  body: string;
}

const stepDataList: StepData[] = [
  {
    field: 'nationality',
    subject: '[Step 1/6] 국적 확인 요청 / Nationality Verification Required',
    body:
      '안녕하세요! 잡차자 비자 진단 서비스입니다.\n\n정확한 비자 경로를 분석하기 위해 6가지 정보가 필요합니다.\n' +
      '우선 고객님의 국적을 선택하거나 직접 입력해 주세요.\n\n' +
      'Hello! This is the JobChaJa Visa Diagnosis Service.\n' +
      'We need 6 pieces of information to analyze the best visa pathway.\n' +
      'Please select or type your nationality below.',
  },
  {
    field: 'age',
    subject: '[Step 2/6] 나이 정보 필요 / Age Information Needed',
    body:
      '국적 정보가 접수되었습니다.\n\n' +
      '비자 유형마다 연령 요건이 다르므로, 현재 나이를 선택해 주세요.\n\n' +
      'Your nationality has been received.\n' +
      'Different visa types have different age requirements. Please select your current age.',
  },
  {
    field: 'education',
    subject: '[Step 3/6] 학력 사항 / Education Level Required',
    body:
      '나이 정보가 접수되었습니다.\n\n' +
      '학위는 지원 가능한 비자 유형과 점수에 직접 영향을 미칩니다.\n최종 학력을 선택해 주세요.\n\n' +
      'Your age information has been received.\n' +
      'Your education level directly affects eligible visa types and scoring.',
  },
  {
    field: 'fund',
    subject: '[Step 4/6] 연간 가용 자금 / Available Annual Fund',
    body:
      '학력 정보가 접수되었습니다.\n\n' +
      '유학 경로는 학비+생활비, 취업 경로는 비자 수수료가 필요합니다.\n연간 사용 가능한 자금 범위를 선택해 주세요.\n\n' +
      'Education level received.\n' +
      'Study pathways require tuition + living costs; employment pathways need visa fees.\nPlease select your annual fund range.',
  },
  {
    field: 'goal',
    subject: '[Step 5/6] 최종 목표 확인 / Final Goal in Korea',
    body:
      '자금 정보가 접수되었습니다.\n\n' +
      '한국에서의 최종 목표에 따라 추천 경로가 크게 달라집니다.\n목표를 선택해 주세요.\n\n' +
      'Fund information received.\n' +
      'The recommended pathway varies greatly based on your final goal in Korea.',
  },
  {
    field: 'priority',
    subject: '[Step 6/6] 우선순위 설정 / Priority Preference (Last Step)',
    body:
      '거의 다 왔습니다! 마지막 질문입니다.\n\n' +
      '비자 경로를 선택할 때 가장 중요하게 생각하는 것을 선택해 주세요.\n' +
      '선택 후 분석이 시작됩니다.\n\n' +
      "Almost done! Last question.\nPlease select what matters most when choosing a visa pathway.\nAfter this, we'll start analysis.",
  },
];

// ============================================================
// KOR: 유틸리티 함수 / ENG: Utility functions
// ============================================================

/** KOR: 시간 문자열 포맷 / ENG: Format time string */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

/** KOR: 날짜 문자열 포맷 / ENG: Format date string */
function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** KOR: 실현가능성 레이블에 따른 텍스트 색상 / ENG: Text color class by feasibility label */
function getFeasibilityTextColor(label: RecommendedPathway['feasibilityLabel']): string {
  switch (label) {
    case '매우 높음': return 'text-blue-600';
    case '높음': return 'text-green-600';
    case '보통': return 'text-yellow-600';
    case '낮음': return 'text-orange-600';
    case '매우 낮음': return 'text-red-600';
    default: return 'text-gray-500';
  }
}

/** KOR: 실현가능성 레이블에 따른 좌측 테두리 색상 / ENG: Left border color class by feasibility label */
function getPathwayBorderColor(label: RecommendedPathway['feasibilityLabel']): string {
  switch (label) {
    case '매우 높음': return 'border-l-blue-500';
    case '높음': return 'border-l-green-500';
    case '보통': return 'border-l-yellow-500';
    case '낮음': return 'border-l-orange-500';
    case '매우 낮음': return 'border-l-red-500';
    default: return 'border-l-gray-300';
  }
}

// ============================================================
// KOR: 메인 페이지 컴포넌트
// ENG: Main page component
// ============================================================

export default function Diagnosis8Page() {
  // KOR: 현재 흐름 단계 / ENG: Current flow step
  const [flowStep, setFlowStep] = useState<FlowStep>('nationality');

  // KOR: 누적된 이메일 스레드 / ENG: Accumulated email thread
  const [emails, setEmails] = useState<EmailMessage[]>([]);

  // KOR: 펼쳐진 이메일 ID 집합 / ENG: Set of expanded email IDs
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // KOR: 별표 이메일 ID 집합 / ENG: Set of starred email IDs
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  // KOR: 현재 선택된 폴더 / ENG: Currently selected folder
  const [folder, setFolder] = useState<FolderKey>('inbox');

  // KOR: 펼쳐진 결과 경로 ID / ENG: Expanded result pathway ID
  const [expandedPathwayId, setExpandedPathwayId] = useState<string | null>('path-1');

  // KOR: 국적 직접 입력 / ENG: Nationality custom input
  const [nationalityCustom, setNationalityCustom] = useState<string>('');

  // KOR: 나이 선택값 / ENG: Selected age value
  const [selectedAge, setSelectedAge] = useState<number | null>(null);

  // KOR: 스크롤 하단 ref / ENG: Scroll bottom ref
  const bottomRef = useRef<HTMLDivElement>(null);

  // KOR: 마운트 시 첫 질문 이메일 추가 / ENG: Add first question email on mount
  useEffect(() => {
    const firstEmail = buildQuestionEmail(0);
    setEmails([firstEmail]);
    setExpandedIds(new Set([firstEmail.id]));
  }, []);

  // KOR: 이메일 추가 시 하단으로 스크롤 / ENG: Scroll to bottom when emails update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [emails, flowStep]);

  // ============================================================
  // KOR: 이메일 빌더 함수 / ENG: Email builder functions
  // ============================================================

  /** KOR: 질문 이메일 생성 / ENG: Build question email */
  const buildQuestionEmail = useCallback((stepIndex: number): EmailMessage => {
    const step = stepDataList[stepIndex];
    const ts = new Date();
    ts.setMinutes(ts.getMinutes() + stepIndex * 3);
    return {
      id: `q-${step.field}`,
      from: '잡차자 비자봇 (JobChaJa Visa Bot)',
      fromEmail: 'visa-bot@jobchaja.com',
      to: '나 (You)',
      toEmail: 'applicant@email.com',
      subject: step.subject,
      body: step.body,
      timestamp: ts,
      isStarred: false,
      hasAttachment: stepIndex === 0,
      field: step.field,
      type: 'question',
    };
  }, []);

  /** KOR: 답변 이메일 생성 / ENG: Build answer email */
  const buildAnswerEmail = useCallback((stepIndex: number, label: string): EmailMessage => {
    const step = stepDataList[stepIndex];
    const ts = new Date();
    ts.setMinutes(ts.getMinutes() + stepIndex * 3 + 1);
    return {
      id: `a-${step.field}`,
      from: '나 (You)',
      fromEmail: 'applicant@email.com',
      to: '잡차자 비자봇 (JobChaJa Visa Bot)',
      toEmail: 'visa-bot@jobchaja.com',
      subject: `Re: ${step.subject}`,
      body: `선택한 답변 / Selected answer: ${label}`,
      timestamp: ts,
      isStarred: false,
      hasAttachment: false,
      field: step.field,
      answerLabel: label,
      type: 'answer',
    };
  }, []);

  // ============================================================
  // KOR: 답변 제출 핸들러 / ENG: Answer submission handler
  // ============================================================

  /** KOR: 공통 답변 제출 / ENG: Common answer submission */
  const submitAnswer = useCallback((label: string) => {
    const stepIndex = stepDataList.findIndex(s => s.field === flowStep);
    if (stepIndex < 0) return;

    const answerEmail = buildAnswerEmail(stepIndex, label);
    const nextStepIndex = stepIndex + 1;

    if (nextStepIndex < stepDataList.length) {
      // KOR: 다음 질문 이메일 추가 / ENG: Add next question email
      const nextQuestion = buildQuestionEmail(nextStepIndex);
      setEmails(prev => {
        const updated = [...prev, answerEmail, nextQuestion];
        return updated;
      });
      // KOR: 이전 질문 접고 다음 질문 펼치기 / ENG: Collapse previous, expand next
      setExpandedIds(prev => {
        const next = new Set(prev);
        next.delete(`q-${stepDataList[stepIndex].field}`);
        next.add(nextQuestion.id);
        return next;
      });
      setFlowStep(stepDataList[nextStepIndex].field);
    } else {
      // KOR: 마지막 답변 → 분석 시작 / ENG: Last answer → start analysis
      setEmails(prev => [...prev, answerEmail]);
      setExpandedIds(prev => {
        const next = new Set(prev);
        next.delete(`q-${stepDataList[stepIndex].field}`);
        return next;
      });
      setFlowStep('analyzing');

      // KOR: 분석 시뮬레이션 후 결과 표시 / ENG: Simulate analysis then show result
      setTimeout(() => {
        const resultHeaderEmail: EmailMessage = {
          id: 'result-header',
          from: '잡차자 비자봇 (JobChaJa Visa Bot)',
          fromEmail: 'visa-bot@jobchaja.com',
          to: '나 (You)',
          toEmail: 'applicant@email.com',
          subject: '[비자 진단 완료] 맞춤 비자 경로 리포트 / Visa Diagnosis Complete',
          body:
            '분석이 완료되었습니다!\n\n' +
            `총 ${mockDiagnosisResult.pathways.length}개의 비자 경로를 발견했습니다.\n` +
            '각 경로는 실현 가능성 점수와 예상 기간, 비용을 기준으로 정렬되어 있습니다.\n\n' +
            'Analysis complete!\n' +
            `We found ${mockDiagnosisResult.pathways.length} visa pathways for your profile.\n` +
            'Each pathway is sorted by feasibility score, estimated duration, and cost.',
          timestamp: new Date(),
          isStarred: true,
          hasAttachment: true,
          type: 'result_header',
        };
        setEmails(prev => [...prev, resultHeaderEmail]);
        setExpandedIds(prev => new Set([...prev, resultHeaderEmail.id]));
        setFlowStep('result');
        setFolder('results');
      }, 2400);
    }
  }, [flowStep, buildAnswerEmail, buildQuestionEmail]);

  // ============================================================
  // KOR: 핸들러 함수들 / ENG: Handler functions
  // ============================================================

  /** KOR: 이메일 펼침/접힘 토글 / ENG: Toggle email expand/collapse */
  const toggleEmail = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, []);

  /** KOR: 별표 토글 / ENG: Toggle star */
  const toggleStar = useCallback((id: string) => {
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, []);

  /** KOR: 경로 펼침 토글 / ENG: Toggle pathway expand */
  const togglePathway = useCallback((id: string) => {
    setExpandedPathwayId(prev => (prev === id ? null : id));
  }, []);

  /** KOR: 초기화 (처음부터 다시 시작) / ENG: Reset to start */
  const handleReset = useCallback(() => {
    const firstEmail = buildQuestionEmail(0);
    setEmails([firstEmail]);
    setExpandedIds(new Set([firstEmail.id]));
    setStarredIds(new Set());
    setFlowStep('nationality');
    setFolder('inbox');
    setExpandedPathwayId('path-1');
    setNationalityCustom('');
    setSelectedAge(null);
  }, [buildQuestionEmail]);

  // ============================================================
  // KOR: 인라인 답변 옵션 렌더링
  // ENG: Render inline answer options for each field
  // ============================================================

  const renderInlineOptions = (field: QuestionField): React.ReactNode => {
    // KOR: 이미 답변된 필드는 숨김 / ENG: Hide if already answered
    const alreadyAnswered = emails.some(e => e.type === 'answer' && e.field === field);
    if (alreadyAnswered || flowStep !== field) return null;

    switch (field) {
      case 'nationality':
        return (
          <div className="mt-4 border-t border-gray-100 pt-4">
            {/* KOR: 국적 선택 그리드 / ENG: Nationality grid */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              국적 선택 / Select Nationality
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {popularCountries.map(country => (
                <button
                  key={country.code}
                  onClick={() => submitAnswer(`${country.flag} ${country.name}`)}
                  className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all text-left group"
                >
                  <span className="text-xl shrink-0">{country.flag}</span>
                  <span className="text-sm text-gray-700 group-hover:text-red-700 truncate">{country.name}</span>
                </button>
              ))}
            </div>
            {/* KOR: 직접 입력 / ENG: Custom input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={nationalityCustom}
                onChange={e => setNationalityCustom(e.target.value)}
                placeholder="직접 입력 (예: Brazil) / Type directly"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                onKeyDown={e => {
                  if (e.key === 'Enter' && nationalityCustom.trim()) {
                    submitAnswer(nationalityCustom.trim());
                    setNationalityCustom('');
                  }
                }}
              />
              <button
                onClick={() => {
                  if (nationalityCustom.trim()) {
                    submitAnswer(nationalityCustom.trim());
                    setNationalityCustom('');
                  }
                }}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors font-medium"
              >
                <Send className="w-3.5 h-3.5" />
                답장
              </button>
            </div>
          </div>
        );

      case 'age':
        return (
          <div className="mt-4 border-t border-gray-100 pt-4">
            {/* KOR: 나이 버튼 그리드 / ENG: Age button grid */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              나이 선택 / Select Age
            </p>
            <div className="flex flex-wrap gap-2">
              {[18, 20, 22, 24, 25, 26, 28, 30, 32, 35, 38, 40, 45, 50, 55].map(age => (
                <button
                  key={age}
                  onClick={() => submitAnswer(`${age}세`)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-red-400 hover:bg-red-50 hover:text-red-700 transition-all min-w-[52px]"
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="mt-4 border-t border-gray-100 pt-4">
            {/* KOR: 학력 선택 목록 / ENG: Education option list */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              학력 선택 / Select Education Level
            </p>
            <div className="flex flex-col gap-2">
              {educationOptions.map(edu => (
                <button
                  key={edu}
                  onClick={() => submitAnswer(edu)}
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg text-left hover:border-red-400 hover:bg-red-50 transition-all group"
                >
                  <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-red-500 shrink-0" />
                  <span className="text-sm text-gray-700 group-hover:text-red-700">{edu}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'fund':
        return (
          <div className="mt-4 border-t border-gray-100 pt-4">
            {/* KOR: 자금 범위 선택 / ENG: Fund range selection */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              연간 자금 범위 / Annual Fund Range
            </p>
            <div className="flex flex-col gap-2">
              {fundOptions.map(fund => (
                <button
                  key={fund}
                  onClick={() => submitAnswer(fund)}
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg text-left hover:border-red-400 hover:bg-red-50 transition-all group"
                >
                  <DollarSign className="w-4 h-4 text-gray-400 group-hover:text-red-500 shrink-0" />
                  <span className="text-sm text-gray-700 group-hover:text-red-700">{fund}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'goal':
        return (
          <div className="mt-4 border-t border-gray-100 pt-4">
            {/* KOR: 최종 목표 선택 / ENG: Final goal selection */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              최종 목표 / Final Goal
            </p>
            <div className="flex flex-col gap-2">
              {goalOptions.map(goal => (
                <button
                  key={goal}
                  onClick={() => submitAnswer(goal)}
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg text-left hover:border-red-400 hover:bg-red-50 transition-all group"
                >
                  <Target className="w-4 h-4 text-gray-400 group-hover:text-red-500 shrink-0" />
                  <span className="text-sm text-gray-700 group-hover:text-red-700">{goal}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'priority':
        return (
          <div className="mt-4 border-t border-gray-100 pt-4">
            {/* KOR: 우선순위 선택 / ENG: Priority selection */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              우선순위 / Priority Preference
            </p>
            <div className="flex flex-col gap-2">
              {priorityOptions.map(priority => (
                <button
                  key={priority}
                  onClick={() => submitAnswer(priority)}
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg text-left hover:border-red-400 hover:bg-red-50 transition-all group"
                >
                  <Zap className="w-4 h-4 text-gray-400 group-hover:text-red-500 shrink-0" />
                  <span className="text-sm text-gray-700 group-hover:text-red-700">{priority}</span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // KOR: 단일 이메일 카드 렌더링
  // ENG: Render a single email card
  // ============================================================

  const renderEmailCard = (email: EmailMessage): React.ReactNode => {
    const isExpanded = expandedIds.has(email.id);
    const isStarred = starredIds.has(email.id);
    const isQuestion = email.type === 'question';
    const isAnswer = email.type === 'answer';
    const isResultHeader = email.type === 'result_header';

    return (
      <div
        key={email.id}
        className={`border-b border-gray-100 bg-white transition-colors ${!isExpanded ? 'hover:bg-gray-50' : ''}`}
      >
        {/* KOR: 이메일 헤더 행 (항상 표시) / ENG: Email header row (always visible) */}
        <div
          onClick={() => toggleEmail(email.id)}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        >
          {/* KOR: 별표 버튼 / ENG: Star button */}
          <button
            onClick={e => { e.stopPropagation(); toggleStar(email.id); }}
            className="shrink-0 p-0.5"
          >
            <Star
              className={`w-4 h-4 transition-colors ${(isStarred || email.isStarred) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-gray-400'}`}
            />
          </button>

          {/* KOR: 아바타 / ENG: Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
            ${isQuestion || isResultHeader ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {isQuestion || isResultHeader ? 'JC' : 'Me'}
          </div>

          {/* KOR: 발신자 + 제목 / ENG: Sender + subject */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-sm font-semibold truncate ${isAnswer ? 'text-blue-700' : 'text-gray-900'}`}>
                {email.from}
              </span>
              {email.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400 shrink-0" />}
              {isResultHeader && (
                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium shrink-0">
                  완료
                </span>
              )}
            </div>
            {!isExpanded && (
              <p className="text-xs text-gray-500 truncate">{email.subject}</p>
            )}
          </div>

          {/* KOR: 타임스탬프 + 아이콘 / ENG: Timestamp + icon */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-gray-400">{formatTime(email.timestamp)}</span>
            {isExpanded
              ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            }
          </div>
        </div>

        {/* KOR: 이메일 펼침 본문 / ENG: Expanded email body */}
        {isExpanded && (
          <div className="px-4 pb-4">
            {/* KOR: To/From/Date/Subject 헤더 / ENG: To/From/Date/Subject header */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs space-y-1 border border-gray-100">
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-14 shrink-0">From:</span>
                <span className="text-gray-700 break-all">{email.from} &lt;{email.fromEmail}&gt;</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-14 shrink-0">To:</span>
                <span className="text-gray-700 break-all">{email.to} &lt;{email.toEmail}&gt;</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-14 shrink-0">Date:</span>
                <span className="text-gray-700">{formatDate(email.timestamp)} {formatTime(email.timestamp)}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 font-medium w-14 shrink-0">Subject:</span>
                <span className="text-gray-800 font-semibold">{email.subject}</span>
              </div>
            </div>

            {/* KOR: 이메일 본문 텍스트 / ENG: Email body text */}
            {isAnswer ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-sm font-semibold text-blue-800">{email.answerLabel}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {email.body}
              </p>
            )}

            {/* KOR: 첨부파일 표시 / ENG: Attachment display */}
            {email.hasAttachment && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
                  <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                  <span>visa-diagnosis-guide.pdf</span>
                  <span className="text-gray-400">(3.1 MB)</span>
                </div>
              </div>
            )}

            {/* KOR: 인라인 답변 옵션 / ENG: Inline answer options */}
            {isQuestion && email.field && renderInlineOptions(email.field)}

            {/* KOR: 결과 뉴스레터 / ENG: Result newsletter (inline in email) */}
            {isResultHeader && flowStep === 'result' && renderResultNewsletter()}

            {/* KOR: 이메일 액션 버튼 / ENG: Email action buttons */}
            {!isResultHeader && (
              <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <CornerDownRight className="w-3.5 h-3.5" />
                  Reply
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // KOR: 결과 뉴스레터 렌더링 (이메일 본문 내 표시)
  // ENG: Render result newsletter (shown inside email body)
  // ============================================================

  const renderResultNewsletter = (): React.ReactNode => {
    const { pathways } = mockDiagnosisResult;

    return (
      <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden">
        {/* KOR: 뉴스레터 헤더 배너 / ENG: Newsletter header banner */}
        <div className="bg-red-600 px-6 py-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-red-200" />
            <span className="text-red-200 text-xs font-semibold uppercase tracking-widest">
              JOBCHAJA VISA REPORT
            </span>
          </div>
          <h2 className="text-white text-lg font-bold mb-1">비자 진단 리포트</h2>
          <p className="text-red-200 text-sm">Visa Diagnosis Analysis Report</p>
          <p className="text-red-300 text-xs mt-2">{formatDate(new Date())}</p>
        </div>

        {/* KOR: 첨부파일 스타일 요약 정보 / ENG: Attachment-style summary */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-600 font-medium">visa_diagnosis_result_{mockDiagnosisResult.id}.pdf</span>
            <span className="text-xs text-gray-400 ml-auto">{pathways.length}개 경로 첨부</span>
          </div>
        </div>

        {/* KOR: 뉴스레터 본문 / ENG: Newsletter body */}
        <div className="bg-white px-5 py-5">
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            입력하신 정보를 바탕으로 <strong className="text-gray-900">{pathways.length}개</strong>의 맞춤 비자 경로를 발견했습니다.
            실현 가능성이 높은 순서로 정렬되어 있으며, 각 경로를 클릭하면 상세 정보를 확인할 수 있습니다.
          </p>

          {/* KOR: 비자 경로 카드 목록 / ENG: Visa pathway card list */}
          <div className="space-y-3">
            {pathways.map((pathway, idx) => (
              <div
                key={pathway.id}
                className={`border-l-4 border border-gray-200 rounded-lg overflow-hidden transition-all ${getPathwayBorderColor(pathway.feasibilityLabel)}`}
              >
                {/* KOR: 경로 카드 헤더 / ENG: Pathway card header */}
                <button
                  onClick={() => togglePathway(pathway.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  {/* KOR: 순위 배지 / ENG: Rank badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white
                    ${getScoreColor(pathway.feasibilityLabel)}`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-bold text-gray-900 text-sm">{pathway.name}</span>
                      <span className={`text-xs font-semibold ${getFeasibilityTextColor(pathway.feasibilityLabel)}`}>
                        {getFeasibilityEmoji(pathway.feasibilityLabel)} {pathway.feasibilityLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {pathway.totalDurationMonths}개월
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${((pathway as any).estimatedCostUSD ?? pathway.estimatedCostWon ?? 0).toLocaleString()}
                      </span>
                      <span className="font-semibold text-gray-600">{pathway.feasibilityScore}점</span>
                    </div>
                  </div>

                  {expandedPathwayId === pathway.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  }
                </button>

                {/* KOR: 경로 상세 내용 / ENG: Pathway detail content */}
                {expandedPathwayId === pathway.id && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 pb-4 pt-3">
                    {/* KOR: 경로 설명 / ENG: Pathway description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{pathway.description}</p>

                    {/* KOR: 점수 바 / ENG: Score bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 font-medium">실현 가능성 점수</span>
                        <span className={`text-xs font-bold ${getFeasibilityTextColor(pathway.feasibilityLabel)}`}>
                          {pathway.feasibilityScore}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreColor(pathway.feasibilityLabel)}`}
                          style={{ width: `${pathway.feasibilityScore}%` }}
                        />
                      </div>
                    </div>

                    {/* KOR: 비자 체인 / ENG: Visa chain */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        비자 경로 / Visa Chain
                      </p>
                      <div className="flex items-start gap-1 flex-wrap">
                        {(Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((vc, vcIdx) => (
                          <React.Fragment key={vcIdx}>
                            <div className="flex flex-col items-center">
                              <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                                {vc.visa}
                              </span>
                              <span className="text-xs text-gray-400 mt-0.5">{vc.duration}</span>
                            </div>
                            {vcIdx < (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).length - 1 && (
                              <ArrowRight className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* KOR: 마일스톤 목록 / ENG: Milestone list */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        주요 단계 / Milestones
                      </p>
                      <div className="space-y-2">
                        {pathway.milestones.map((ms, msIdx) => (
                          <div key={msIdx} className="flex gap-3 bg-white border border-gray-100 rounded-lg p-3">
                            <span className="text-lg shrink-0">{ms.emoji}</span>
                            <div>
                              <p className="text-xs font-bold text-gray-800">{ms.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{ms.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* KOR: CTA 버튼 영역 / ENG: CTA button area */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm">
              <Globe className="w-4 h-4" />
              전문가 상담 요청
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-gray-300 transition-colors">
              <FileText className="w-4 h-4" />
              비자 가이드 보기
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:border-red-300 hover:text-red-600 transition-colors ml-auto"
            >
              <RefreshCw className="w-4 h-4" />
              다시 진단하기
            </button>
          </div>

          {/* KOR: 뉴스레터 푸터 / ENG: Newsletter footer */}
          <div className="mt-6 pt-5 border-t-2 border-red-500 text-center text-xs text-gray-400 space-y-1">
            <p>This report was generated by JobChaJa Visa Diagnosis Engine.</p>
            <p>본 리포트는 잡차자 비자 진단 엔진이 생성했습니다.</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <button className="hover:underline hover:text-gray-600">구독취소 / Unsubscribe</button>
              <span className="text-gray-200">|</span>
              <button className="hover:underline hover:text-gray-600">설정 / Preferences</button>
              <span className="text-gray-200">|</span>
              <button className="hover:underline hover:text-gray-600">브라우저에서 보기</button>
            </div>
            <p className="text-gray-300 mt-1">JobChaJa Inc. · Seoul, Korea · visa-bot@jobchaja.com</p>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // KOR: 분석 중 화면 렌더링 / ENG: Analyzing screen rendering
  // ============================================================

  const renderAnalyzing = (): React.ReactNode => (
    <div className="flex flex-col items-center justify-center py-14 px-6">
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-red-500" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />
        </div>
      </div>
      <h3 className="text-base font-bold text-gray-800 mb-2">비자 경로 분석 중...</h3>
      <p className="text-sm text-gray-500 text-center">
        입력하신 정보로 최적의 비자 경로를 분석하고 있습니다.
        <br />결과가 잠시 후 이메일로 전달됩니다.
      </p>
      <div className="w-56 h-1.5 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-red-500 rounded-full animate-pulse" style={{ width: '75%' }} />
      </div>
    </div>
  );

  // ============================================================
  // KOR: 사이드바 렌더링 / ENG: Sidebar rendering
  // ============================================================

  const renderSidebar = (): React.ReactNode => {
    const answeredCount = emails.filter(e => e.type === 'answer').length;
    const totalSteps = stepDataList.length;

    const folderItems: { key: FolderKey; label: string; labelEn: string; icon: React.ReactNode; badge?: number }[] = [
      {
        key: 'inbox',
        label: '받은편지함',
        labelEn: 'Inbox',
        icon: <Inbox className="w-4 h-4" />,
        badge: flowStep !== 'result' ? 1 : 0,
      },
      {
        key: 'sent',
        label: '보낸편지함',
        labelEn: 'Sent',
        icon: <Send className="w-4 h-4" />,
        badge: answeredCount,
      },
      {
        key: 'starred',
        label: '중요편지함',
        labelEn: 'Starred',
        icon: <Star className="w-4 h-4" />,
        badge: starredIds.size + (flowStep === 'result' ? 1 : 0),
      },
      ...(flowStep === 'result' ? [{
        key: 'results' as FolderKey,
        label: '진단 결과',
        labelEn: 'Results',
        icon: <FileText className="w-4 h-4" />,
        badge: mockDiagnosisResult.pathways.length,
      }] : []),
      {
        key: 'archive',
        label: '보관함',
        labelEn: 'Archive',
        icon: <Archive className="w-4 h-4" />,
        badge: 0,
      },
    ];

    return (
      <aside className="w-56 bg-gray-50 border-r border-gray-200 h-full shrink-0 hidden md:flex md:flex-col">
        {/* KOR: 로고 / ENG: Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm">JobChaJa</span>
          </div>
        </div>

        {/* KOR: 새 진단 버튼 / ENG: New diagnosis button */}
        <div className="p-3">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition-colors text-sm font-semibold"
          >
            <Send className="w-4 h-4" />
            새 진단 / New
          </button>
        </div>

        {/* KOR: 폴더 목록 / ENG: Folder list */}
        <nav className="flex-1 px-2 py-1 overflow-y-auto">
          {folderItems.map(item => (
            <button
              key={item.key}
              onClick={() => setFolder(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5
                ${folder === item.key ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold shrink-0
                  ${item.key === 'results' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* KOR: 진행률 표시 / ENG: Progress indicator */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 font-medium">진행률 / Progress</span>
            <span className="text-xs text-gray-400">
              {flowStep === 'result' ? '완료' : `${answeredCount}/${totalSteps}`}
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-700"
              style={{ width: `${flowStep === 'result' ? 100 : (answeredCount / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            {stepDataList.map((step, idx) => (
              <div
                key={step.field}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx < answeredCount ? 'bg-red-500' :
                  idx === answeredCount && flowStep !== 'result' ? 'bg-red-300 ring-2 ring-red-100' :
                  'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </aside>
    );
  };

  // ============================================================
  // KOR: 받은편지함 뷰 렌더링 / ENG: Inbox view rendering
  // ============================================================

  const renderInboxView = (): React.ReactNode => (
    <div>
      {/* KOR: 스레드 헤더 / ENG: Thread header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">비자 진단 스레드</h2>
              <p className="text-xs text-gray-400">{emails.length}개 메시지</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">
              Visa Diagnosis
            </span>
            {flowStep === 'result' && (
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full font-medium ml-1">
                Completed
              </span>
            )}
            <button className="ml-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* KOR: 이메일 카드 목록 / ENG: Email card list */}
      <div>
        {emails.map(email => renderEmailCard(email))}
        {flowStep === 'analyzing' && renderAnalyzing()}
      </div>

      <div ref={bottomRef} />
    </div>
  );

  // ============================================================
  // KOR: 보낸편지함 뷰 렌더링 / ENG: Sent view rendering
  // ============================================================

  const renderSentView = (): React.ReactNode => {
    const sentEmails = emails.filter(e => e.type === 'answer');
    return (
      <div>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-3">
          <h2 className="font-bold text-gray-900 text-sm">보낸편지함 / Sent</h2>
          <p className="text-xs text-gray-400">{sentEmails.length}개 메시지</p>
        </div>
        {sentEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Send className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">보낸 메시지가 없습니다</p>
          </div>
        ) : (
          <div>
            {sentEmails.map(email => (
              <div
                key={email.id}
                onClick={() => { setFolder('inbox'); setExpandedIds(prev => new Set([...prev, email.id])); }}
                className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{email.subject}</p>
                  <p className="text-xs text-gray-400">답변: {email.answerLabel}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{formatTime(email.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // KOR: 중요편지함 뷰 / ENG: Starred view
  // ============================================================

  const renderStarredView = (): React.ReactNode => {
    const starredEmails = emails.filter(e => starredIds.has(e.id) || e.isStarred);
    return (
      <div>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-3">
          <h2 className="font-bold text-gray-900 text-sm">중요편지함 / Starred</h2>
          <p className="text-xs text-gray-400">{starredEmails.length}개 메시지</p>
        </div>
        {starredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Star className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">중요 표시된 메시지가 없습니다</p>
          </div>
        ) : (
          <div>{starredEmails.map(email => renderEmailCard(email))}</div>
        )}
      </div>
    );
  };

  // ============================================================
  // KOR: 진단 결과 폴더 뷰 / ENG: Results folder view
  // ============================================================

  const renderResultsView = (): React.ReactNode => {
    if (flowStep !== 'result') {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FileText className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm">진단이 완료된 후 결과가 표시됩니다</p>
        </div>
      );
    }
    // KOR: 결과 이메일만 표시 / ENG: Show only result email
    const resultEmail = emails.find(e => e.type === 'result_header');
    if (!resultEmail) return null;
    return (
      <div>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" />
            <h2 className="font-bold text-gray-900 text-sm">진단 결과 / Diagnosis Results</h2>
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
              {mockDiagnosisResult.pathways.length}개 경로
            </span>
          </div>
        </div>
        <div>{renderEmailCard(resultEmail)}</div>
      </div>
    );
  };

  // ============================================================
  // KOR: 보관함 뷰 / ENG: Archive view
  // ============================================================

  const renderArchiveView = (): React.ReactNode => (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Archive className="w-12 h-12 mb-3 opacity-20" />
      <p className="text-sm">보관함이 비어있습니다 / Archive is empty</p>
    </div>
  );

  // ============================================================
  // KOR: 폴더에 따른 메인 콘텐츠 라우팅
  // ENG: Route main content by folder
  // ============================================================

  const renderMain = (): React.ReactNode => {
    switch (folder) {
      case 'inbox': return renderInboxView();
      case 'sent': return renderSentView();
      case 'starred': return renderStarredView();
      case 'results': return renderResultsView();
      case 'archive': return renderArchiveView();
      default: return renderInboxView();
    }
  };

  // ============================================================
  // KOR: 모바일 탭 바 렌더링 / ENG: Mobile tab bar rendering
  // ============================================================

  const renderMobileTabs = (): React.ReactNode => (
    <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 overflow-x-auto md:hidden">
      {([
        { key: 'inbox' as FolderKey, label: '받은함', icon: <Inbox className="w-3.5 h-3.5" /> },
        { key: 'sent' as FolderKey, label: '보낸함', icon: <Send className="w-3.5 h-3.5" /> },
        { key: 'starred' as FolderKey, label: '중요', icon: <Star className="w-3.5 h-3.5" /> },
        ...(flowStep === 'result' ? [{ key: 'results' as FolderKey, label: '결과', icon: <FileText className="w-3.5 h-3.5" /> }] : []),
      ] as { key: FolderKey; label: string; icon: React.ReactNode }[]).map(tab => (
        <button
          key={tab.key}
          onClick={() => setFolder(tab.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
            ${folder === tab.key ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );

  // ============================================================
  // KOR: 최종 레이아웃 / ENG: Final layout
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* KOR: 상단 앱 헤더 / ENG: Top app header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0 h-12">
        <div className="flex items-center gap-3">
          {/* KOR: 모바일 로고 / ENG: Mobile logo */}
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center md:hidden">
            <Mail className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-sm font-bold text-gray-800">
            비자 진단 <span className="font-normal text-gray-400 text-xs hidden sm:inline">/ Visa Diagnosis — Email Thread Style #8</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {/* KOR: 검색 바 (UI 장식) / ENG: Search bar (UI decoration) */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 cursor-text">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">이메일 검색...</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">초기화</span>
          </button>
        </div>
      </header>

      {/* KOR: 메인 레이아웃 / ENG: Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* KOR: 좌측 사이드바 (데스크탑) / ENG: Left sidebar (desktop) */}
        {renderSidebar()}

        {/* KOR: 이메일 콘텐츠 영역 / ENG: Email content area */}
        <main className="flex-1 overflow-y-auto bg-white">
          {renderMobileTabs()}
          {renderMain()}
        </main>
      </div>
    </div>
  );
}
