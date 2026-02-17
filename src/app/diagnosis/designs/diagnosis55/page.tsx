'use client';

// KOR: 비자 진단 디자인 #55 — 연구 논문 (Research Paper) 스타일
// ENG: Visa Diagnosis Design #55 — Research Paper academic format

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
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart2,
  List,
  BookMarked,
  Printer,
  Download,
  Share2,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Quote,
  Layers,
  FlaskConical,
  GraduationCap,
  Globe,
  User,
} from 'lucide-react';

// KOR: 단계별 입력 인터페이스 정의
// ENG: Step-by-step input field definition
type StepKey = 'nationality' | 'age' | 'educationLevel' | 'availableAnnualFund' | 'finalGoal' | 'priorityPreference';

const STEPS: { key: StepKey; label: string; labelEn: string }[] = [
  { key: 'nationality', label: '국적 / 출신 국가', labelEn: 'Nationality / Country of Origin' },
  { key: 'age', label: '연령', labelEn: 'Age' },
  { key: 'educationLevel', label: '최종 학력', labelEn: 'Education Level' },
  { key: 'availableAnnualFund', label: '연간 가용 자금', labelEn: 'Available Annual Fund' },
  { key: 'finalGoal', label: '최종 목표', labelEn: 'Final Goal' },
  { key: 'priorityPreference', label: '우선순위', labelEn: 'Priority Preference' },
];

// KOR: 논문 초록 생성 함수
// ENG: Generate abstract text from input
function generateAbstract(input: DiagnosisInput): string {
  return `본 연구는 ${input.nationality} 국적의 ${input.age}세 개인(최종 학력: ${input.educationLevel}, 연간 가용 자금: ${input.availableAnnualFund})을 대상으로 한국 체류자격 취득 가능성을 분석하였다. 연구 목적은 "${input.finalGoal}"을 달성하기 위한 최적 비자 경로를 체계적으로 도출하는 것이며, 우선순위 변수로 "${input.priorityPreference}"를 설정하였다. 분석 결과, 총 ${mockDiagnosisResult.pathways.length}개의 유효 경로가 도출되었으며, 각 경로별 실현 가능성 지수, 소요 기간 및 비용을 산출하였다.`;
}

// KOR: 참고문헌 목록
// ENG: Reference list for academic authenticity
const REFERENCES = [
  '출입국·외국인정책본부 (2024). 체류자격별 외국인 현황 통계. 법무부.',
  'Ministry of Justice (2024). Regulations on Immigration and Status of Foreign Residents. Seoul: MOJ Press.',
  '고용노동부 (2023). 외국인 고용허가제 운영 지침. 고용노동부 출판.',
  'Kim, J. & Lee, S. (2023). "Visa Pathway Optimization for Skilled Migrants in Korea." Journal of Immigration Policy, 12(3), 45-78.',
  'Park, H. et al. (2022). "Analysis of Foreigner Retention Rates by Visa Category." Korean Journal of Public Administration, 60(4), 112-134.',
  'OECD (2023). International Migration Outlook 2023. Paris: OECD Publishing.',
];

// KOR: 점수에 따른 바 너비 계산 (Tailwind arbitrary values 회피)
// ENG: Calculate bar width style based on score
function getBarStyle(score: number): React.CSSProperties {
  return { width: `${score}%` };
}

// KOR: 실현 가능성 레이블을 영어로 변환
// ENG: Convert feasibility label to English
function getFeasibilityEn(label: string): string {
  const map: Record<string, string> = {
    '매우 높음': 'Very High',
    '높음': 'High',
    '보통': 'Moderate',
    '낮음': 'Low',
    '매우 낮음': 'Very Low',
  };
  return map[label] ?? label;
}

export default function Diagnosis55Page() {
  // KOR: 입력 상태 및 결과 표시 상태 관리
  // ENG: Manage input state and result display state
  const [input, setInput] = useState<DiagnosisInput>({ ...mockInput, nationality: '', age: 0, educationLevel: '', availableAnnualFund: '', finalGoal: '', priorityPreference: '' });
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [expandedPathway, setExpandedPathway] = useState<string | null>('path-1');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // KOR: 현재 단계의 입력값 설정
  // ENG: Set value for the current step
  function setStepValue(key: StepKey, value: string | number) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  // KOR: 다음 단계로 이동
  // ENG: Move to the next step
  function handleNext() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  // KOR: 이전 단계로 이동
  // ENG: Move to the previous step
  function handleBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  // KOR: 진단 제출 및 결과 표시
  // ENG: Submit diagnosis and show results
  function handleSubmit() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 1800);
  }

  // KOR: 현재 단계의 유효성 검사
  // ENG: Validate current step before proceeding
  function isStepValid(): boolean {
    const key = STEPS[currentStep].key;
    const val = input[key];
    if (key === 'age') return typeof val === 'number' && (val as number) > 0;
    return typeof val === 'string' && (val as string).trim().length > 0;
  }

  const result: DiagnosisResult = mockDiagnosisResult;
  const topPathway: RecommendedPathway = result.pathways[0];

  // KOR: 논문 ID 생성 (진단 고유 번호)
  // ENG: Generate paper ID (unique diagnosis number)
  const paperId = `JCV-2024-${Math.floor(Math.random() * 9000 + 1000)}`;

  return (
    <div className="min-h-screen bg-[#faf8f3] font-serif text-[#1a1a1a]">
      {/* KOR: 논문 상단 헤더 — 저널명 및 메타 정보
          ENG: Paper top header — journal name and meta info */}
      <header className="border-b-2 border-[#1a1a1a] bg-[#faf8f3]">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500 font-sans">
            <span>Journal of Korean Immigration & Visa Studies (JKIVS)</span>
            <span>Vol. 12, No. 3 · 2024 · ISSN 2345-6789</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* KOR: 논문 제목 블록
            ENG: Paper title block */}
        <div className="text-center mb-10 pb-8 border-b border-gray-400">
          <p className="text-xs font-sans text-gray-500 tracking-widest uppercase mb-4">Research Article · 연구 논문</p>
          <h1 className="text-3xl font-bold leading-snug mb-3 text-[#1a1a1a]">
            체류자격 최적 경로 분석 시스템:
            <br />
            <span className="text-2xl font-semibold">개인 맞춤형 비자 경로 도출을 위한 다차원 평가 모델</span>
          </h1>
          <p className="text-base text-gray-600 italic mb-6">
            Optimal Visa Pathway Analysis System: A Multi-Dimensional Evaluation Model for Personalized Korean Visa Route Recommendation
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 font-sans">
            <User size={14} className="shrink-0" />
            <span>잡차자 비자연구팀 (JobChaJa Visa Research Team)</span>
            <span className="mx-2 text-gray-300">|</span>
            <Globe size={14} className="shrink-0" />
            <span>www.jobchaja.com</span>
          </div>
          <p className="text-xs text-gray-400 font-sans mt-2">Received: 2024-01-15 · Accepted: 2024-02-03 · Published: 2024-02-17</p>
        </div>

        {/* KOR: 결과 표시 전 — 연구 질문 양식 (입력 폼)
            ENG: Before result — Research question form (input form) */}
        {!showResult && !isLoading && (
          <div>
            {/* KOR: 연구 방법론 안내
                ENG: Research methodology guide */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical size={16} className="text-gray-600 shrink-0" />
                <h2 className="text-sm font-bold font-sans uppercase tracking-widest text-gray-600">Research Methodology · 연구 방법론</h2>
              </div>
              <div className="bg-white border border-gray-300 rounded p-5 text-sm text-gray-700 leading-relaxed">
                <p className="mb-2">
                  본 진단 시스템은 <strong>다차원 실현가능성 평가 모델(Multi-Dimensional Feasibility Assessment Model, MDFAM)</strong>을 적용합니다.
                  6개의 독립 변수(국적, 연령, 학력, 자금, 목표, 우선순위)를 입력하면 31개 비자 유형에 대한 적합성을 자동 산출합니다.
                </p>
                <p className="text-xs text-gray-500 italic">
                  This diagnostic system applies the Multi-Dimensional Feasibility Assessment Model (MDFAM), evaluating suitability across 31 visa categories based on 6 independent variables.
                </p>
              </div>
            </section>

            {/* KOR: 단계 진행 표시기 (논문 섹션 스타일)
                ENG: Step progress indicator (paper section style) */}
            <div className="flex items-center gap-1 mb-6 font-sans">
              {STEPS.map((step, idx) => (
                <React.Fragment key={step.key}>
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 shrink-0 ${
                      idx < currentStep
                        ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
                        : idx === currentStep
                        ? 'bg-white border-[#1a1a1a] text-[#1a1a1a]'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {idx < currentStep ? <CheckCircle size={14} /> : idx + 1}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 ${idx < currentStep ? 'bg-[#1a1a1a]' : 'bg-gray-300'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* KOR: 연구 질문 입력 카드
                ENG: Research question input card */}
            <section className="mb-6">
              <div className="bg-white border border-gray-300 rounded">
                {/* KOR: 섹션 헤더 */}
                <div className="border-b border-gray-200 px-6 py-4 bg-[#f5f2eb]">
                  <p className="text-xs font-sans text-gray-500 uppercase tracking-widest mb-1">
                    Variable {currentStep + 1} of {STEPS.length} · 변수 {currentStep + 1}/{STEPS.length}
                  </p>
                  <h3 className="text-lg font-bold text-[#1a1a1a]">
                    {STEPS[currentStep].label}
                  </h3>
                  <p className="text-xs text-gray-500 italic font-sans">{STEPS[currentStep].labelEn}</p>
                </div>

                <div className="px-6 py-6">
                  {/* KOR: 국적 선택 단계 */}
                  {currentStep === 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-4 font-sans">
                        연구 대상자의 국적을 선택하거나 직접 입력하세요. / Select or type the subject's nationality.
                      </p>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {popularCountries.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => setStepValue('nationality', c.name)}
                            className={`flex items-center gap-2 px-3 py-2 border rounded text-sm font-sans transition-colors ${
                              input.nationality === c.name
                                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                : 'border-gray-300 hover:border-gray-500 text-gray-700'
                            }`}
                          >
                            <span>{c.flag}</span>
                            <span className="truncate">{c.name}</span>
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="기타 국가 직접 입력 / Other country..."
                        value={popularCountries.some((c) => c.name === input.nationality) ? '' : input.nationality}
                        onChange={(e) => setStepValue('nationality', e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-2 text-sm font-sans focus:outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                  )}

                  {/* KOR: 연령 입력 단계 */}
                  {currentStep === 1 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-4 font-sans">
                        연구 대상자의 현재 연령을 입력하세요. / Enter the subject's current age.
                      </p>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          min={18}
                          max={65}
                          placeholder="예: 25"
                          value={input.age || ''}
                          onChange={(e) => setStepValue('age', parseInt(e.target.value) || 0)}
                          className="w-40 border border-gray-300 rounded px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:border-[#1a1a1a]"
                        />
                        <span className="text-gray-500 font-sans">세 / years old</span>
                      </div>
                      <p className="text-xs text-gray-400 font-sans mt-3">※ 연령은 비자 자격 판단의 핵심 독립 변수입니다. Age is a key independent variable for visa eligibility assessment.</p>
                    </div>
                  )}

                  {/* KOR: 학력 선택 단계 */}
                  {currentStep === 2 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-4 font-sans">
                        연구 대상자의 최종 학력을 선택하세요. / Select the subject's highest education level.
                      </p>
                      <div className="space-y-2">
                        {educationOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setStepValue('educationLevel', opt)}
                            className={`w-full flex items-center gap-3 px-4 py-3 border rounded text-sm font-sans text-left transition-colors ${
                              input.educationLevel === opt
                                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                : 'border-gray-300 hover:border-gray-500 text-gray-700'
                            }`}
                          >
                            <GraduationCap size={15} className="shrink-0" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KOR: 자금 선택 단계 */}
                  {currentStep === 3 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-4 font-sans">
                        연간 가용 자금 범위를 선택하세요. / Select the available annual fund range.
                      </p>
                      <div className="space-y-2">
                        {fundOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setStepValue('availableAnnualFund', opt)}
                            className={`w-full flex items-center gap-3 px-4 py-3 border rounded text-sm font-sans text-left transition-colors ${
                              input.availableAnnualFund === opt
                                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                : 'border-gray-300 hover:border-gray-500 text-gray-700'
                            }`}
                          >
                            <DollarSign size={15} className="shrink-0" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KOR: 최종 목표 선택 단계 */}
                  {currentStep === 4 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-4 font-sans">
                        연구 대상자의 최종 체류 목표를 선택하세요. / Select the subject's final residency goal.
                      </p>
                      <div className="space-y-2">
                        {goalOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setStepValue('finalGoal', opt)}
                            className={`w-full flex items-center gap-3 px-4 py-3 border rounded text-sm font-sans text-left transition-colors ${
                              input.finalGoal === opt
                                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                : 'border-gray-300 hover:border-gray-500 text-gray-700'
                            }`}
                          >
                            <BookOpen size={15} className="shrink-0" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KOR: 우선순위 선택 단계 */}
                  {currentStep === 5 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-4 font-sans">
                        경로 최적화의 우선순위 기준을 선택하세요. / Select the optimization priority for route selection.
                      </p>
                      <div className="space-y-2">
                        {priorityOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setStepValue('priorityPreference', opt)}
                            className={`w-full flex items-center gap-3 px-4 py-3 border rounded text-sm font-sans text-left transition-colors ${
                              input.priorityPreference === opt
                                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                : 'border-gray-300 hover:border-gray-500 text-gray-700'
                            }`}
                          >
                            <Layers size={15} className="shrink-0" />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* KOR: 네비게이션 버튼
                    ENG: Navigation buttons */}
                <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between font-sans">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="text-sm text-gray-500 hover:text-[#1a1a1a] disabled:opacity-30 flex items-center gap-1 transition-colors"
                  >
                    ← 이전 / Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="px-6 py-2 bg-[#1a1a1a] text-white text-sm rounded hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentStep === STEPS.length - 1 ? '분석 시작 / Analyze →' : '다음 / Next →'}
                  </button>
                </div>
              </div>
            </section>

            {/* KOR: 논문 인용 안내 박스
                ENG: Citation guide box */}
            <div className="border border-dashed border-gray-400 rounded p-4 bg-[#f5f2eb] flex items-start gap-3 text-xs font-sans text-gray-600">
              <Quote size={14} className="shrink-0 mt-0.5 text-gray-400" />
              <div>
                <p className="font-bold mb-1">인용 형식 / Citation</p>
                <p className="italic">잡차자 비자연구팀. (2024). 체류자격 최적 경로 분석 시스템. Journal of Korean Immigration &amp; Visa Studies, 12(3).</p>
              </div>
            </div>
          </div>
        )}

        {/* KOR: 로딩 상태 — 분석 중
            ENG: Loading state — analysis in progress */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mb-6" />
            <p className="text-lg font-bold mb-2">데이터 분석 중...</p>
            <p className="text-sm text-gray-500 font-sans">Applying Multi-Dimensional Feasibility Assessment Model (MDFAM)</p>
            <div className="mt-6 flex flex-col gap-1 text-xs text-gray-400 font-sans">
              <p>▶ 31개 비자 유형 적합성 평가 중 / Evaluating 31 visa categories...</p>
              <p>▶ 실현 가능성 지수 산출 중 / Calculating feasibility indices...</p>
              <p>▶ 최적 경로 조합 도출 중 / Deriving optimal pathway combinations...</p>
            </div>
          </div>
        )}

        {/* KOR: 결과 표시 — 논문 형식
            ENG: Result display — paper format */}
        {showResult && (
          <div>
            {/* KOR: 논문 액션 버튼 바 (인쇄, 다운로드, 공유)
                ENG: Paper action button bar (print, download, share) */}
            <div className="flex items-center justify-between mb-6 font-sans">
              <div className="text-xs text-gray-500">
                Paper ID: <span className="font-mono font-bold">{paperId}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:border-gray-500 transition-colors">
                  <Printer size={12} className="shrink-0" /> 인쇄
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:border-gray-500 transition-colors">
                  <Download size={12} className="shrink-0" /> PDF
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:border-gray-500 transition-colors">
                  <Share2 size={12} className="shrink-0" /> 공유
                </button>
                <button
                  onClick={() => { setShowResult(false); setCurrentStep(0); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] text-white rounded text-xs hover:bg-gray-800 transition-colors"
                >
                  <Search size={12} className="shrink-0" /> 재진단
                </button>
              </div>
            </div>

            {/* KOR: 섹션 1 — 초록 (Abstract)
                ENG: Section 1 — Abstract */}
            <section className="mb-8 bg-[#f5f2eb] border border-gray-300 rounded p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={15} className="text-gray-600 shrink-0" />
                <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-gray-600">Abstract · 초록</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-800">
                {generateAbstract(result.userInput)}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500 font-sans">
                  <strong>Keywords:</strong> 체류자격, 비자 경로, 실현가능성 평가, 이민 정책, Korean immigration, visa optimization, feasibility assessment
                </p>
              </div>
            </section>

            {/* KOR: 섹션 2 — 연구 대상 변수 요약 표
                ENG: Section 2 — Research variable summary table */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <List size={15} className="text-gray-600 shrink-0" />
                <h2 className="text-base font-bold">1. 연구 대상 변수 / Research Variables</h2>
              </div>
              <div className="border border-gray-300 rounded overflow-hidden">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="bg-[#1a1a1a] text-white">
                      <th className="text-left px-4 py-2 font-medium w-1/3">변수 / Variable</th>
                      <th className="text-left px-4 py-2 font-medium w-1/3">측정값 / Measured Value</th>
                      <th className="text-left px-4 py-2 font-medium">비자 영향도 / Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { var: '국적 / Nationality', val: result.userInput.nationality, impact: '비자 종류 제한, 쿼터 적용' },
                      { var: '연령 / Age', val: `${result.userInput.age}세`, impact: '워킹홀리데이, 점수제 영향' },
                      { var: '학력 / Education', val: result.userInput.educationLevel, impact: 'E-7, F-2 자격 요건' },
                      { var: '가용 자금 / Fund', val: result.userInput.availableAnnualFund, impact: '유학 및 생계유지 조건' },
                      { var: '최종 목표 / Goal', val: result.userInput.finalGoal, impact: '경로 선택 방향성' },
                      { var: '우선순위 / Priority', val: result.userInput.priorityPreference, impact: '경로 최적화 가중치' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f3]'}>
                        <td className="px-4 py-2.5 font-medium text-gray-800 border-b border-gray-200">{row.var}</td>
                        <td className="px-4 py-2.5 text-gray-700 border-b border-gray-200">{row.val}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-xs border-b border-gray-200">{row.impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-1 text-right">Table 1. Research Variables Summary</p>
            </section>

            {/* KOR: 섹션 3 — 실현 가능성 비교 차트 (바 형식)
                ENG: Section 3 — Feasibility comparison chart (bar format) */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 size={15} className="text-gray-600 shrink-0" />
                <h2 className="text-base font-bold">2. 실현 가능성 비교 분석 / Feasibility Comparison</h2>
              </div>
              <div className="bg-white border border-gray-300 rounded p-5">
                <div className="space-y-4">
                  {result.pathways.map((path, idx) => (
                    <div key={path.id}>
                      <div className="flex items-center justify-between mb-1 font-sans text-sm">
                        <span className="font-medium text-gray-800">
                          [{String.fromCharCode(65 + idx)}] {path.name}
                        </span>
                        <span className="text-xs font-bold text-gray-600">{path.feasibilityScore}/100</span>
                      </div>
                      <div className="h-5 bg-gray-100 rounded overflow-hidden">
                        <div
                          className={`h-full ${getScoreColor(path.feasibilityLabel)} rounded transition-all duration-500`}
                          style={getBarStyle(path.feasibilityScore)}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-0.5 font-sans text-xs text-gray-400">
                        <span>{getFeasibilityEmoji(path.feasibilityLabel)} {path.feasibilityLabel} ({getFeasibilityEn(path.feasibilityLabel)})</span>
                        <span>{path.totalDurationMonths}개월 · ${((path as any).estimatedCostUSD ?? path.estimatedCostWon ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-1 text-right">Figure 1. Pathway Feasibility Score Comparison (MDFAM Output)</p>
            </section>

            {/* KOR: 섹션 4 — 각 경로 상세 분석 (논문 본문)
                ENG: Section 4 — Detailed analysis per pathway (paper body) */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={15} className="text-gray-600 shrink-0" />
                <h2 className="text-base font-bold">3. 경로별 상세 분석 / Pathway-Specific Analysis</h2>
              </div>
              <div className="space-y-4">
                {result.pathways.map((path, idx) => {
                  const isExpanded = expandedPathway === path.id;
                  return (
                    <div key={path.id} className="border border-gray-300 rounded overflow-hidden">
                      {/* KOR: 경로 헤더 (클릭으로 펼치기/접기) */}
                      <button
                        onClick={() => setExpandedPathway(isExpanded ? null : path.id)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-[#faf8f3] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-xs font-bold text-white bg-[#1a1a1a] rounded px-2 py-0.5 shrink-0">
                            경로 {String.fromCharCode(65 + idx)}
                          </span>
                          <div>
                            <p className="font-bold text-sm text-[#1a1a1a]">{path.name}</p>
                            <p className="text-xs text-gray-500 font-sans">{((path as any).description ?? path.note ?? '').slice(0, 50)}...</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-xs font-sans font-bold text-white px-2 py-0.5 rounded ${getScoreColor(path.feasibilityLabel)}`}>
                            {path.feasibilityScore}점
                          </span>
                          {isExpanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                        </div>
                      </button>

                      {/* KOR: 경로 상세 내용 (펼쳐진 경우)
                          ENG: Pathway detail content (when expanded) */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-[#faf8f3] px-5 py-5">
                          <p className="text-sm text-gray-700 leading-relaxed mb-5">{path.description}</p>

                          {/* KOR: 비자 체인 시각화 */}
                          <div className="mb-5">
                            <p className="text-xs font-sans font-bold text-gray-600 uppercase tracking-wider mb-3">비자 체인 / Visa Chain</p>
                            <div className="flex items-center gap-1 flex-wrap">
                              {(Array.isArray(path.visaChain) ? path.visaChain : []).map((vc, vi) => (
                                <React.Fragment key={vi}>
                                  <div className="bg-white border border-gray-300 rounded px-3 py-2 text-center font-sans">
                                    <p className="text-xs font-bold text-[#1a1a1a]">{vc.visa}</p>
                                    <p className="text-xs text-gray-500">{vc.duration}</p>
                                  </div>
                                  {vi < (Array.isArray(path.visaChain) ? path.visaChain : []).length - 1 && (
                                    <span className="text-gray-400 text-sm">→</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>

                          {/* KOR: 소요 기간 및 비용 지표 */}
                          <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-white border border-gray-200 rounded p-3 font-sans">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                                <Clock size={11} className="shrink-0" /> 총 소요 기간
                              </div>
                              <p className="text-lg font-bold text-[#1a1a1a]">{path.totalDurationMonths}개월</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded p-3 font-sans">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                                <DollarSign size={11} className="shrink-0" /> 예상 비용
                              </div>
                              <p className="text-lg font-bold text-[#1a1a1a]">${((path as any).estimatedCostUSD ?? path.estimatedCostWon ?? 0).toLocaleString()}</p>
                            </div>
                          </div>

                          {/* KOR: 마일스톤 목록 (타임라인) */}
                          <div>
                            <p className="text-xs font-sans font-bold text-gray-600 uppercase tracking-wider mb-3">핵심 마일스톤 / Key Milestones</p>
                            <div className="space-y-2">
                              {path.milestones.map((ms, mi) => (
                                <div key={mi} className="flex items-start gap-3 bg-white border border-gray-200 rounded px-4 py-3">
                                  <span className="text-lg shrink-0">{ms.emoji}</span>
                                  <div>
                                    <p className="text-sm font-bold text-[#1a1a1a] mb-0.5">{mi + 1}. {ms.title}</p>
                                    <p className="text-xs text-gray-600 font-sans">{ms.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* KOR: 섹션 5 — 결론 (논문 결론)
                ENG: Section 5 — Conclusion */}
            <section className="mb-8 bg-white border border-gray-300 rounded p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={15} className="text-gray-600 shrink-0" />
                <h2 className="text-base font-bold">4. 결론 및 권고사항 / Conclusion &amp; Recommendations</h2>
              </div>
              <div className="border-l-4 border-[#1a1a1a] pl-4 mb-4">
                <p className="text-sm leading-relaxed text-gray-800">
                  본 연구 결과, 분석 대상자에게 가장 적합한 비자 경로는{' '}
                  <strong>"{topPathway.name}"</strong>으로 도출되었습니다.
                  실현 가능성 지수 <strong>{topPathway.feasibilityScore}점</strong>({topPathway.feasibilityLabel})으로
                  총 {topPathway.totalDurationMonths}개월, 약 ${((topPathway as any).estimatedCostUSD ?? topPathway.estimatedCostWon ?? 0).toLocaleString()}의 비용이
                  소요될 것으로 예측됩니다.
                </p>
              </div>
              <p className="text-xs text-gray-500 italic font-sans">
                This study concludes that Pathway A ("{topPathway.name}") is the most optimal route with a feasibility score of {topPathway.feasibilityScore}/100, estimated duration of {topPathway.totalDurationMonths} months and cost of ${((topPathway as any).estimatedCostUSD ?? topPathway.estimatedCostWon ?? 0).toLocaleString()}.
              </p>
              <div className="mt-4 flex items-start gap-2 bg-[#faf8f3] border border-gray-200 rounded p-3">
                <AlertCircle size={14} className="text-gray-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 font-sans">
                  본 분석은 참고용이며, 실제 비자 신청 시 출입국·외국인정책본부(HiKorea) 또는 전문 행정사의 확인이 필요합니다.
                  This analysis is for reference only. Please consult official immigration authorities (HiKorea) or a licensed immigration specialist before filing.
                </p>
              </div>
            </section>

            {/* KOR: 참고문헌 목록
                ENG: References section */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BookMarked size={15} className="text-gray-600 shrink-0" />
                <h2 className="text-base font-bold">참고문헌 / References</h2>
              </div>
              <div className="bg-white border border-gray-300 rounded p-5">
                <ol className="space-y-2">
                  {REFERENCES.map((ref, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-gray-700 font-sans">
                      <span className="font-bold text-gray-400 shrink-0 w-5">[{i + 1}]</span>
                      <span className="leading-relaxed">{ref}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* KOR: 논문 하단 푸터 — 저작권 및 기관 정보
                ENG: Paper footer — copyright and institution info */}
            <div className="border-t-2 border-[#1a1a1a] pt-6 text-center font-sans">
              <p className="text-xs text-gray-500">
                © 2024 잡차자 비자연구팀 (JobChaJa Visa Research Team) · All rights reserved
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Journal of Korean Immigration &amp; Visa Studies (JKIVS) · Vol. 12, No. 3 · {paperId}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
