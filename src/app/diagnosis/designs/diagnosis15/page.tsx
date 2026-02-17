'use client';

// 디자인 #15: 모바일 퍼스트 스텝
// Design #15: Mobile-First Steps — 한 화면에 한 질문씩, 토스 스타일
// References: Toss, Revolut, Monzo, Cash App, Venmo

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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  Shield,
  Zap,
  MapPin,
  BookOpen,
  Briefcase,
  Award,
  RotateCcw,
  AlertCircle,
  Info,
  ExternalLink,
} from 'lucide-react';

// ============================================================
// 타입 정의 / Type definitions
// ============================================================

// 단계 ID 타입 / Step ID type
type StepId =
  | 'nationality'
  | 'age'
  | 'educationLevel'
  | 'availableAnnualFund'
  | 'finalGoal'
  | 'priorityPreference';

// 단계 설명 타입 / Step descriptor type
interface StepDescriptor {
  id: StepId;
  titleKo: string;
  titleEn: string;
  subtitleKo: string;
  progressLabel: string;
}

// ============================================================
// 단계 순서 정의 / Step order definition
// ============================================================
const STEPS: StepDescriptor[] = [
  {
    id: 'nationality',
    titleKo: '어느 나라에서 오셨나요?',
    titleEn: 'Where are you from?',
    subtitleKo: '국적을 선택해주세요',
    progressLabel: '국적',
  },
  {
    id: 'age',
    titleKo: '나이가 어떻게 되세요?',
    titleEn: 'How old are you?',
    subtitleKo: '현재 나이를 입력해주세요',
    progressLabel: '나이',
  },
  {
    id: 'educationLevel',
    titleKo: '최종 학력이 어떻게 되세요?',
    titleEn: 'What is your education level?',
    subtitleKo: '가장 최근에 졸업하거나 재학 중인 학교 수준을 선택해주세요',
    progressLabel: '학력',
  },
  {
    id: 'availableAnnualFund',
    titleKo: '1년간 사용 가능한\n예산은 얼마인가요?',
    titleEn: 'What is your available annual budget?',
    subtitleKo: '학비, 생활비, 비자 비용 등 총 예산 (환율 고려)',
    progressLabel: '예산',
  },
  {
    id: 'finalGoal',
    titleKo: '한국에서 이루고 싶은\n목표는 무엇인가요?',
    titleEn: 'What is your goal in Korea?',
    subtitleKo: '가장 원하는 최종 목표를 선택해주세요',
    progressLabel: '목표',
  },
  {
    id: 'priorityPreference',
    titleKo: '어떤 경로를\n선호하시나요?',
    titleEn: 'What type of pathway do you prefer?',
    subtitleKo: '가장 중요하게 생각하는 요소를 선택해주세요',
    progressLabel: '우선순위',
  },
];

// ============================================================
// 숫자 키패드 컴포넌트 / Numeric keypad component
// ============================================================
function NumericKeypad({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // 키패드 버튼 목록 / Keypad button list
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  function handleKey(key: string) {
    if (key === '⌫') {
      // 마지막 문자 삭제 / Delete last character
      onChange(value.slice(0, -1));
    } else if (key === '') {
      // 빈 버튼 — 아무 동작 없음 / Empty button — no action
      return;
    } else {
      // 최대 3자리 / Max 3 digits
      if (value.length >= 3) return;
      onChange(value + key);
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3 px-4 pb-2">
      {keys.map((key, idx) => (
        <button
          key={idx}
          onClick={() => handleKey(key)}
          className={`
            h-16 rounded-2xl text-2xl font-semibold
            transition-all duration-100 active:scale-95
            ${key === '' ? 'invisible' : ''}
            ${key === '⌫'
              ? 'bg-gray-100 text-gray-500 text-xl'
              : 'bg-gray-50 text-gray-900 hover:bg-gray-100 active:bg-gray-200'
            }
          `}
        >
          {key}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// 경로 상세 패널 컴포넌트 / Pathway detail panel component
// ============================================================
function PathwayDetailPanel({
  pathway,
  onClose,
}: {
  pathway: CompatPathway;
  onClose: () => void;
}) {
  // 비자 체인 코드 배열 / Visa chain code array
  const visaCodes = (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v) => v.code);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end" onClick={onClose}>
      {/* 하단 슬라이드 패널 / Bottom slide panel */}
      <div
        className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 바 / Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* 헤더 / Header */}
        <div className="px-6 pt-3 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-blue-500 font-semibold mb-1">{pathway.pathwayId}</p>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{pathway.nameKo}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{pathway.nameEn}</p>
            </div>
            {/* 점수 배지 / Score badge */}
            <div
              className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center"
              style={{ backgroundColor: getScoreColor(pathway.finalScore) + '20' }}
            >
              <span
                className="text-2xl font-black"
                style={{ color: getScoreColor(pathway.finalScore) }}
              >
                {pathway.finalScore}
              </span>
              <span className="text-xs text-gray-500">점수</span>
            </div>
          </div>

          {/* 핵심 지표 / Key metrics */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{pathway.estimatedMonths}개월</p>
              <p className="text-xs text-gray-500">예상 기간</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <DollarSign className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">
                {pathway.estimatedCostWon === 0
                  ? '0원'
                  : `${pathway.estimatedCostWon.toLocaleString()}만원`}
              </p>
              <p className="text-xs text-gray-500">예상 비용</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-xl">{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{pathway.feasibilityLabel}</p>
              <p className="text-xs text-gray-500">가능성</p>
            </div>
          </div>
        </div>

        {/* 비자 체인 / Visa chain */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-500 mb-3">비자 경로</h4>
          <div className="flex items-center flex-wrap gap-2">
            {visaCodes.map((code, idx) => (
              <React.Fragment key={idx}>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                  {code}
                </span>
                {idx < visaCodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 마일스톤 / Milestones */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-500 mb-3">단계별 로드맵</h4>
          <div className="relative">
            {/* 세로 선 / Vertical line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />
            <div className="space-y-4">
              {pathway.milestones.map((milestone, idx) => (
                <div key={idx} className="flex gap-4">
                  {/* 원형 아이콘 / Circle icon */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center z-10">
                    <span className="text-white text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{milestone.nameKo}</p>
                      {milestone.visaStatus && milestone.visaStatus !== 'none' && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium">
                          {milestone.visaStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {milestone.monthFromStart === 0 ? '시작' : `${milestone.monthFromStart}개월 후`}
                    </p>
                    {milestone.canWorkPartTime && (
                      <p className="text-xs text-green-600 mt-0.5">
                        ✓ 아르바이트 가능 (월 ~{milestone.estimatedMonthlyIncome}만원)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 다음 단계 / Next steps */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-500 mb-3">지금 할 수 있는 것</h4>
          <div className="space-y-2">
            {pathway.nextSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.nameKo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 노트 / Note */}
        {pathway.note && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex gap-2 p-3 bg-amber-50 rounded-xl">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{pathway.note}</p>
            </div>
          </div>
        )}

        {/* CTA 버튼 / CTA button */}
        <div className="px-6 py-5">
          <button className="w-full h-14 bg-blue-500 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2">
            <span>잡차자에서 지원받기</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full mt-3 h-12 bg-gray-100 text-gray-600 rounded-2xl font-medium text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 결과 화면 컴포넌트 / Result screen component
// ============================================================
function ResultScreen({
  input,
  result,
  onRestart,
}: {
  input: DiagnosisInput;
  result: DiagnosisResult;
  onRestart: () => void;
}) {
  // 펼쳐진 카드 인덱스 / Expanded card index
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  // 상세 패널 열린 경로 / Opened pathway detail
  const [detailPathway, setDetailPathway] = useState<CompatPathway | null>(null);

  // mockPathways를 결과와 대응 / Map mockPathways with result
  const pathways = mockPathways;

  // 국적 찾기 / Find nationality
  const country = popularCountries.find((c) => c.code === input.nationality);
  // 학력 찾기 / Find education
  const edu = educationOptions.find((e) => e.value === input.educationLevel);
  // 목표 찾기 / Find goal
  const goal = goalOptions.find((g) => g.value === input.finalGoal);

  // 가장 높은 점수 경로 / Top-scoring pathway
  const topPathway = pathways[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 금융 리포트 헤더 / Financial report header */}
      <div className="bg-blue-500 pt-12 pb-8 px-5">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 text-white/80 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 진단</span>
          </button>
          <p className="text-white/60 text-xs">잡차자 비자 진단</p>
        </div>

        {/* 사용자 요약 / User summary */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{country?.flag ?? '🌏'}</div>
          <h1 className="text-2xl font-black text-white mb-1">
            {country?.nameKo ?? input.nationality}
          </h1>
          <p className="text-white/70 text-sm">
            {input.age}세 · {edu?.labelKo ?? input.educationLevel} · {goal?.labelKo ?? input.finalGoal}
          </p>
        </div>

        {/* 최적 경로 점수 카드 / Top pathway score card */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/70 text-xs mb-1">최적 추천 경로</p>
              <p className="text-white font-bold text-lg leading-tight">{topPathway.nameKo}</p>
            </div>
            {/* 원형 점수 / Circle score */}
            <div className="w-16 h-16 rounded-full bg-white/20 flex flex-col items-center justify-center">
              <span className="text-white text-2xl font-black">{topPathway.finalScore}</span>
              <span className="text-white/70 text-xs">점</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white text-xs">{topPathway.estimatedMonths}개월</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white text-xs">
                {topPathway.estimatedCostWon === 0
                  ? '비용 없음'
                  : `${topPathway.estimatedCostWon.toLocaleString()}만원`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{getFeasibilityEmoji(topPathway.feasibilityLabel)}</span>
              <span className="text-white text-xs">{topPathway.feasibilityLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 요약 바 / Stats summary bar */}
      <div className="bg-white px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between text-center">
          <div>
            <p className="text-2xl font-black text-blue-500">{result.pathways.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">추천 경로</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div>
            <p className="text-2xl font-black text-gray-900">{result.meta.totalPathwaysEvaluated}</p>
            <p className="text-xs text-gray-500 mt-0.5">검토한 경로</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div>
            <p className="text-2xl font-black text-red-400">{result.meta.hardFilteredOut}</p>
            <p className="text-xs text-gray-500 mt-0.5">부적합 경로</p>
          </div>
        </div>
      </div>

      {/* 경로 카드 목록 / Pathway card list */}
      <div className="px-4 pt-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-gray-900">추천 경로 순위</h2>
          <span className="text-xs text-gray-400">점수 높은 순</span>
        </div>

        {pathways.map((pathway, idx) => {
          const isExpanded = expandedIdx === idx;
          const rank = idx + 1;
          const visaCodes = (Array.isArray(pathway.visaChain) ? pathway.visaChain : []).map((v) => v.code);

          return (
            <div
              key={pathway.pathwayId}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              {/* 카드 헤더 / Card header */}
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left"
              >
                {/* 순위 뱃지 / Rank badge */}
                <div
                  className={`
                    shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm
                    ${rank === 1 ? 'bg-amber-400 text-white' : ''}
                    ${rank === 2 ? 'bg-gray-300 text-white' : ''}
                    ${rank === 3 ? 'bg-orange-300 text-white' : ''}
                    ${rank > 3 ? 'bg-gray-100 text-gray-500' : ''}
                  `}
                >
                  {rank === 1 ? <Star className="w-4 h-4" /> : rank}
                </div>

                {/* 제목 및 정보 / Title and info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">{pathway.nameKo}</p>
                    <span
                      className="shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-md"
                      style={{
                        color: getScoreColor(pathway.finalScore),
                        backgroundColor: getScoreColor(pathway.finalScore) + '20',
                      }}
                    >
                      {pathway.finalScore}점
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pathway.estimatedMonths}개월
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{getFeasibilityEmoji(pathway.feasibilityLabel)}</span>
                      {pathway.feasibilityLabel}
                    </span>
                  </div>
                </div>

                {/* 펼치기 아이콘 / Expand icon */}
                <div className="shrink-0 text-gray-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* 확장 내용 / Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  {/* 비자 체인 / Visa chain */}
                  <div className="px-5 py-3">
                    <p className="text-xs text-gray-400 mb-2">비자 경로</p>
                    <div className="flex items-center flex-wrap gap-1.5">
                      {visaCodes.map((code, cIdx) => (
                        <React.Fragment key={cIdx}>
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                            {code}
                          </span>
                          {cIdx < visaCodes.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-gray-300" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* 마일스톤 요약 / Milestone summary */}
                  <div className="px-5 pb-3">
                    <p className="text-xs text-gray-400 mb-2">주요 단계</p>
                    <div className="space-y-2">
                      {pathway.milestones.slice(0, 3).map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center gap-2">
                          <div className="shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 text-xs font-bold">{mIdx + 1}</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {m.nameKo}
                            {m.monthFromStart > 0 && (
                              <span className="text-gray-400"> ({m.monthFromStart}개월 후)</span>
                            )}
                          </p>
                        </div>
                      ))}
                      {pathway.milestones.length > 3 && (
                        <p className="text-xs text-gray-400 pl-7">
                          +{pathway.milestones.length - 3}개 단계 더 있음
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 노트 / Note */}
                  {pathway.note && (
                    <div className="px-5 pb-3">
                      <div className="flex gap-2 p-2.5 bg-amber-50 rounded-xl">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">{pathway.note}</p>
                      </div>
                    </div>
                  )}

                  {/* 상세 보기 버튼 / Detail view button */}
                  <div className="px-5 pb-4">
                    <button
                      onClick={() => setDetailPathway(pathway)}
                      className="w-full h-11 bg-blue-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5"
                    >
                      상세 로드맵 보기
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 CTA — 잡차자 앱 연결 / Bottom CTA — Link to Jobchaja app */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4 safe-area-bottom">
        <button className="w-full h-14 bg-blue-500 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
          <Briefcase className="w-5 h-5" />
          <span>잡차자에서 취업 시작하기</span>
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          외국인 채용 비자 통합 플랫폼 — 잡차자
        </p>
      </div>

      {/* 상세 패널 모달 / Detail panel modal */}
      {detailPathway && (
        <PathwayDetailPanel
          pathway={detailPathway}
          onClose={() => setDetailPathway(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트 / Main page component
// ============================================================
export default function Diagnosis15Page() {
  // 현재 단계 인덱스 / Current step index
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // 입력 상태 / Input state
  const [input, setInput] = useState<Partial<DiagnosisInput>>({});

  // 나이 문자열 (숫자 키패드용) / Age string (for numeric keypad)
  const [ageStr, setAgeStr] = useState('');

  // 결과 표시 여부 / Whether result is shown
  const [showResult, setShowResult] = useState(false);

  // 애니메이션 방향 / Animation direction
  const [slideDir, setSlideDir] = useState<'right' | 'left'>('right');

  const currentStep = STEPS[currentStepIdx];
  const progress = ((currentStepIdx) / STEPS.length) * 100;

  // 현재 단계에서 선택된 값이 있는지 / Whether current step has a selected value
  function hasValue(): boolean {
    switch (currentStep.id) {
      case 'nationality':
        return !!input.nationality;
      case 'age':
        return ageStr.length > 0 && parseInt(ageStr, 10) >= 15 && parseInt(ageStr, 10) <= 70;
      case 'educationLevel':
        return !!input.educationLevel;
      case 'availableAnnualFund':
        return input.availableAnnualFund !== undefined;
      case 'finalGoal':
        return !!input.finalGoal;
      case 'priorityPreference':
        return !!input.priorityPreference;
      default:
        return false;
    }
  }

  // 다음 단계로 이동 / Move to next step
  function handleNext() {
    if (!hasValue()) return;

    // 나이 단계에서 실제 숫자 저장 / Save actual number in age step
    if (currentStep.id === 'age') {
      setInput((prev) => ({ ...prev, age: parseInt(ageStr, 10) }));
    }

    if (currentStepIdx < STEPS.length - 1) {
      setSlideDir('right');
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      // 마지막 단계 — 결과 표시 / Last step — show result
      setShowResult(true);
    }
  }

  // 이전 단계로 이동 / Move to previous step
  function handleBack() {
    if (currentStepIdx > 0) {
      setSlideDir('left');
      setCurrentStepIdx((prev) => prev - 1);
    }
  }

  // 처음부터 다시 / Restart from beginning
  function handleRestart() {
    setInput({});
    setAgeStr('');
    setCurrentStepIdx(0);
    setShowResult(false);
  }

  // 결과 화면 표시 / Show result screen
  if (showResult) {
    const finalInput: DiagnosisInput = {
      nationality: input.nationality ?? mockInput.nationality,
      age: input.age ?? mockInput.age,
      educationLevel: input.educationLevel ?? mockInput.educationLevel,
      availableAnnualFund: input.availableAnnualFund ?? mockInput.availableAnnualFund,
      finalGoal: input.finalGoal ?? mockInput.finalGoal,
      priorityPreference: input.priorityPreference ?? mockInput.priorityPreference,
    };
    return (
      <ResultScreen
        input={finalInput}
        result={mockDiagnosisResult}
        onRestart={handleRestart}
      />
    );
  }

  // ============================================================
  // 입력 단계 렌더링 / Input step rendering
  // ============================================================
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* 상단 헤더 / Top header */}
      <div className="px-5 pt-12 pb-4">
        {/* 뒤로가기 버튼 / Back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all
              ${currentStepIdx === 0
                ? 'text-gray-200 pointer-events-none'
                : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              }
            `}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* 단계 카운터 / Step counter */}
          <span className="text-sm text-gray-400 font-medium">
            {currentStepIdx + 1} / {STEPS.length}
          </span>

          {/* 건너뛰기 (더미) / Skip (placeholder) */}
          <button className="text-sm text-gray-300 invisible">건너뛰기</button>
        </div>

        {/* 프로그레스 바 / Progress bar */}
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 단계 라벨 / Step labels */}
        <div className="flex gap-2 flex-wrap mb-8">
          {STEPS.map((step, idx) => (
            <span
              key={step.id}
              className={`
                text-xs px-2.5 py-1 rounded-full font-medium transition-all
                ${idx === currentStepIdx
                  ? 'bg-blue-500 text-white'
                  : idx < currentStepIdx
                  ? 'bg-blue-50 text-blue-400'
                  : 'bg-gray-100 text-gray-400'
                }
              `}
            >
              {step.progressLabel}
              {idx < currentStepIdx && <span className="ml-1">✓</span>}
            </span>
          ))}
        </div>

        {/* 질문 제목 / Question title */}
        <h1 className="text-3xl font-black text-gray-900 leading-tight whitespace-pre-line">
          {currentStep.titleKo}
        </h1>
        <p className="text-sm text-gray-400 mt-2">{currentStep.subtitleKo}</p>
      </div>

      {/* 입력 영역 / Input area */}
      <div className="flex-1 px-5 overflow-y-auto pb-4">
        {/* 국적 선택 / Nationality selection */}
        {currentStep.id === 'nationality' && (
          <div className="grid grid-cols-2 gap-2.5">
            {popularCountries.map((country) => {
              const isSelected = input.nationality === country.code;
              return (
                <button
                  key={country.code}
                  onClick={() => setInput((prev) => ({ ...prev, nationality: country.code }))}
                  className={`
                    flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-150
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200 active:scale-95'
                    }
                  `}
                >
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <p className={`text-sm font-bold ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>
                      {country.nameKo}
                    </p>
                    <p className="text-xs text-gray-400">{country.nameEn}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 나이 입력 (숫자 키패드) / Age input (numeric keypad) */}
        {currentStep.id === 'age' && (
          <div className="flex flex-col items-center">
            {/* 큰 숫자 디스플레이 / Large number display */}
            <div className="flex items-end justify-center gap-2 mb-3 h-28">
              <span className="text-7xl font-black text-gray-900 leading-none tracking-tight">
                {ageStr || '—'}
              </span>
              {ageStr && (
                <span className="text-2xl font-semibold text-gray-500 mb-3">세</span>
              )}
            </div>

            {/* 유효성 힌트 / Validation hint */}
            {ageStr && (parseInt(ageStr, 10) < 15 || parseInt(ageStr, 10) > 70) && (
              <div className="flex items-center gap-1.5 mb-4 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">15~70세 사이의 나이를 입력해주세요</span>
              </div>
            )}
            {ageStr && parseInt(ageStr, 10) >= 15 && parseInt(ageStr, 10) <= 70 && (
              <div className="flex items-center gap-1.5 mb-4 text-green-500">
                <Check className="w-4 h-4" />
                <span className="text-sm">확인됐습니다</span>
              </div>
            )}
            {!ageStr && <div className="mb-4 h-6" />}

            {/* 키패드 / Keypad */}
            <div className="w-full max-w-xs">
              <NumericKeypad value={ageStr} onChange={setAgeStr} />
            </div>
          </div>
        )}

        {/* 학력 선택 / Education selection */}
        {currentStep.id === 'educationLevel' && (
          <div className="space-y-2.5">
            {educationOptions.map((opt) => {
              const isSelected = input.educationLevel === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setInput((prev) => ({ ...prev, educationLevel: opt.value }))}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200 active:scale-[0.98]'
                    }
                  `}
                >
                  <span className="text-2xl">{opt.emoji || '📝'}</span>
                  <div className="flex-1">
                    <p className={`font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                      {opt.labelKo}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.labelEn}</p>
                  </div>
                  {isSelected && (
                    <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 예산 선택 / Fund selection */}
        {currentStep.id === 'availableAnnualFund' && (
          <div className="space-y-2.5">
            {fundOptions.map((opt) => {
              const isSelected = input.availableAnnualFund === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    setInput((prev) => ({ ...prev, availableAnnualFund: opt.value }))
                  }
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200 active:scale-[0.98]'
                    }
                  `}
                >
                  <div
                    className={`
                      shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                      ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}
                  >
                    ₩
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                      {opt.labelKo}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.labelEn}</p>
                  </div>
                  {isSelected && (
                    <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 목표 선택 / Goal selection */}
        {currentStep.id === 'finalGoal' && (
          <div className="space-y-3">
            {goalOptions.map((opt) => {
              const isSelected = input.finalGoal === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setInput((prev) => ({ ...prev, finalGoal: opt.value }))}
                  className={`
                    w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-150
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200 active:scale-[0.98]'
                    }
                  `}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <p className={`text-lg font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                      {opt.labelKo}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{opt.descKo}</p>
                  </div>
                  {isSelected && (
                    <div className="shrink-0 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 우선순위 선택 / Priority selection */}
        {currentStep.id === 'priorityPreference' && (
          <div className="grid grid-cols-2 gap-3">
            {priorityOptions.map((opt) => {
              const isSelected = input.priorityPreference === opt.value;

              // 각 우선순위별 아이콘 / Icon per priority
              const iconMap: Record<string, React.ReactNode> = {
                speed: <Zap className="w-6 h-6" />,
                stability: <Shield className="w-6 h-6" />,
                cost: <DollarSign className="w-6 h-6" />,
                income: <TrendingUp className="w-6 h-6" />,
              };

              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    setInput((prev) => ({ ...prev, priorityPreference: opt.value }))
                  }
                  className={`
                    flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all duration-150
                    ${isSelected
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200 active:scale-95'
                    }
                  `}
                >
                  <span className={`text-3xl ${isSelected ? '' : ''}`}>{opt.emoji}</span>
                  <div>
                    <p className={`text-base font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {opt.labelKo}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}
                    >
                      {opt.descKo}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 하단 CTA 버튼 / Bottom CTA button */}
      <div className="px-5 pb-10 pt-4 bg-white border-t border-gray-100">
        <button
          onClick={handleNext}
          disabled={!hasValue()}
          className={`
            w-full h-16 rounded-2xl text-lg font-bold flex items-center justify-center gap-2
            transition-all duration-200
            ${hasValue()
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 active:scale-[0.98]'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          {currentStepIdx === STEPS.length - 1 ? (
            <>
              <Target className="w-5 h-5" />
              <span>결과 보기</span>
            </>
          ) : (
            <>
              <span>다음</span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* 선택 힌트 / Selection hint */}
        {!hasValue() && (
          <p className="text-center text-xs text-gray-400 mt-3">
            위에서 선택하면 다음으로 진행할 수 있어요
          </p>
        )}
      </div>
    </div>
  );
}
