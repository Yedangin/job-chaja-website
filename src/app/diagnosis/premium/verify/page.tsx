'use client';

/**
 * Stripe 결제 완료 확인 + 프리미엄 결과 로드 페이지
 * Stripe payment verification + premium result loading page
 * Stripe redirect → verify → generate premium result → show
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Trophy,
  TrendingUp,
  Sparkles,
  DollarSign,
  Clock,
  GraduationCap,
  ArrowRight,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/** 프리미엄 경로 결과 타입 / Premium pathway result type */
interface PremiumPathway {
  pathwayId: string;
  nameKo: string;
  nameEn: string;
  finalScore: number;
  scoreBreakdown: {
    sFree: number;
    deltaUniv: number;
    deltaExp: number;
    deltaCert: number;
    deltaRole: number;
    deltaAlign: number;
    deltaKr: number;
    raw: number;
    normalized: number;
  };
  estimatedMonths: number;
  estimatedCostWon: number;
  visaChain: string;
  estimatedIncome: number | null;
  milestones: any[];
  nextSteps: any[];
  note: string;
}

/** 트랙 결과 / Track result */
interface TrackResult {
  trackCategory: string;
  trackMonths: number;
  trackKoreaMonths: number;
  isAligned: boolean;
  alignmentBonus: number;
  pathways: PremiumPathway[];
}

/** What-If 변화 / What-If pathway change */
interface WhatIfPathwayChange {
  pathwayId: string;
  nameKo: string;
  currentScore: number;
  simulatedScore: number;
  delta: number;
  isNewlyActivated: boolean;
}

/** What-If 시뮬레이션 / What-If simulation */
interface WhatIfSimulation {
  scenario: string;
  scenarioKo: string;
  condition: string;
  results: WhatIfPathwayChange[];
  activatesNewPath: boolean;
  incomeDelta: number | null;
}

/** 전체 프리미엄 결과 / Full premium result */
interface PremiumResult {
  profileSummary: {
    universityName?: string;
    universityRankTier?: string;
    majorCategory?: string;
    currentRole?: string;
    trackCount: number;
    topikLevel: number;
  };
  trackResults: TrackResult[];
  overallRecommendation: string;
  whatIfSimulations?: WhatIfSimulation[];
  meta: {
    totalPathwaysEvaluated: number;
    timestamp: string;
  };
}

type Phase = 'verifying' | 'generating' | 'done' | 'error';

/** 점수 색상 / Score color */
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-500';
}

/** 점수 배경 색상 / Score background color */
function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 60) return 'bg-blue-50 border-blue-200';
  if (score >= 40) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

/** 트랙 카테고리 한글 라벨 / Track category Korean labels */
const TRACK_LABELS: Record<string, string> = {
  IT_SW: 'IT/소프트웨어',
  ELEC: '전기/전자',
  MECH: '기계',
  SHIP: '조선',
  CHEM: '화학',
  ENV: '환경',
  BIZ: '경영/사무',
  LAW: '법률',
  DESIGN_ART: '디자인/예술',
  NONE: '학력 기반',
  OTHER: '기타',
};

/** 대학 순위 티어 라벨 / University rank tier labels */
const TIER_LABELS: Record<string, string> = {
  TOP_50: 'World Top 50',
  TOP_100: 'World Top 100',
  TOP_200: 'World Top 200',
  TOP_500: 'World Top 500',
  UNRANKED: '순위 미등록',
};

export default function PremiumVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stripeSessionId = searchParams.get('stripe_session_id');

  const [phase, setPhase] = useState<Phase>('verifying');
  const [result, setResult] = useState<PremiumResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!stripeSessionId) {
      setError('결제 세션 정보가 없습니다. 다시 시도해주세요.');
      setPhase('error');
      return;
    }

    runVerifyAndGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runVerifyAndGenerate = async () => {
    try {
      // 1. 결제 확인 / Verify payment
      setPhase('verifying');
      const verifyRes = await fetch('/api/visa-planner/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stripeSessionId }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json().catch(() => ({}));
        throw new Error(data.message || '결제 확인 실패');
      }

      const verifyData = await verifyRes.json();
      const diagnosisSessionId = verifyData.diagnosisSessionId;
      if (verifyData.coupon?.couponCode) {
        setCouponCode(verifyData.coupon.couponCode);
      }

      // 2. 프리미엄 결과 생성 / Generate premium result
      setPhase('generating');

      // sessionStorage에서 경력 입력 읽기 / Read career input from sessionStorage
      const careerSlotsStr = sessionStorage.getItem('premium-careerSlots');
      const careerSlots = careerSlotsStr ? JSON.parse(careerSlotsStr) : [];

      const resultRes = await fetch(`/api/visa-planner/premium-result/${diagnosisSessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ careerSlots }),
      });

      if (!resultRes.ok) {
        const data = await resultRes.json().catch(() => ({}));
        throw new Error(data.message || '프리미엄 결과 생성 실패');
      }

      const premiumResult: PremiumResult = await resultRes.json();
      setResult(premiumResult);
      setPhase('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
      setPhase('error');
    }
  };

  // ──── 로딩 화면 / Loading screens ────

  if (phase === 'verifying') {
    return (
      <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 확인 중...</h2>
          <p className="text-gray-500">Stripe 결제를 확인하고 있습니다</p>
        </div>
      </div>
    );
  }

  if (phase === 'generating') {
    return (
      <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Sparkles className="w-20 h-20 text-indigo-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">프리미엄 분석 중...</h2>
          <p className="text-gray-500">대학 순위, 경력 트랙, 자격증 보정을 적용하고 있습니다</p>
        </div>
      </div>
    );
  }

  // ──── 에러 화면 / Error screen ────

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/diagnosis/result')}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              진단 결과로 돌아가기
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/diagnosis')}
              className="w-full"
            >
              처음부터 다시하기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  // ──── 프리미엄 결과 화면 / Premium result screen ────

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 결제 완료 배너 / Payment success banner */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">프리미엄 결제 완료</p>
            <p className="text-xs text-green-600">
              정밀 분석 결과가 생성되었습니다
              {couponCode && ` · 재진단 쿠폰: ${couponCode}`}
            </p>
          </div>
        </div>

        {/* 프로필 요약 / Profile summary */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            프로필 요약
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {result.profileSummary.universityName && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">대학</p>
                <p className="text-sm font-semibold text-gray-800">
                  {result.profileSummary.universityName}
                </p>
                <p className="text-xs text-indigo-500">
                  {TIER_LABELS[result.profileSummary.universityRankTier || ''] || ''}
                </p>
              </div>
            )}
            {result.profileSummary.majorCategory && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">전공 분야</p>
                <p className="text-sm font-semibold text-gray-800">
                  {TRACK_LABELS[result.profileSummary.majorCategory] || result.profileSummary.majorCategory}
                </p>
              </div>
            )}
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">TOPIK</p>
              <p className="text-sm font-semibold text-gray-800">
                {result.profileSummary.topikLevel > 0 ? `${result.profileSummary.topikLevel}급` : '없음'}
              </p>
            </div>
            {result.profileSummary.currentRole && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">현재 역할</p>
                <p className="text-sm font-semibold text-gray-800">
                  {result.profileSummary.currentRole}
                </p>
              </div>
            )}
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">분석 트랙 수</p>
              <p className="text-sm font-semibold text-gray-800">
                {result.profileSummary.trackCount}개
              </p>
            </div>
          </div>
        </Card>

        {/* 종합 추천 / Overall recommendation */}
        <Card className="p-6 mb-6 border-indigo-200 bg-indigo-50">
          <p className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            종합 추천
          </p>
          <p className="text-sm text-indigo-700 mt-2">{result.overallRecommendation}</p>
        </Card>

        {/* 트랙별 결과 / Track results */}
        {result.trackResults.map((track, tIdx) => (
          <Card key={track.trackCategory} className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                {TRACK_LABELS[track.trackCategory] || track.trackCategory}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {track.trackMonths > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.floor(track.trackMonths / 12)}년 {track.trackMonths % 12}개월
                  </span>
                )}
                {track.isAligned && (
                  <Badge className="bg-green-100 text-green-700 text-xs">전공 일치</Badge>
                )}
                {track.alignmentBonus > 0 && !track.isAligned && (
                  <Badge className="bg-yellow-100 text-yellow-700 text-xs">인접 분야 +{track.alignmentBonus}</Badge>
                )}
              </div>
            </div>

            {/* 경로 카드 / Pathway cards */}
            <div className="space-y-3">
              {track.pathways.map((pw, pIdx) => (
                <div
                  key={pw.pathwayId}
                  className={`p-4 rounded-xl border ${getScoreBgColor(pw.finalScore)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {tIdx === 0 && pIdx === 0 && (
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                            <Trophy className="w-3 h-3 mr-1" />
                            최적 경로
                          </Badge>
                        )}
                        <h4 className="text-base font-bold text-gray-900">{pw.nameKo}</h4>
                      </div>
                      <p className="text-xs text-gray-500">{pw.nameEn}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(pw.finalScore)}`}>
                        {pw.finalScore}
                      </p>
                      <p className="text-xs text-gray-400">점</p>
                    </div>
                  </div>

                  {/* 점수 분해 / Score breakdown */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <ScoreChip label="기본" value={pw.scoreBreakdown.sFree} />
                    {pw.scoreBreakdown.deltaUniv > 0 && (
                      <ScoreChip label="대학" value={pw.scoreBreakdown.deltaUniv} positive />
                    )}
                    {pw.scoreBreakdown.deltaExp > 0 && (
                      <ScoreChip label="경력" value={pw.scoreBreakdown.deltaExp} positive />
                    )}
                    {pw.scoreBreakdown.deltaCert > 0 && (
                      <ScoreChip label="자격증" value={pw.scoreBreakdown.deltaCert} positive />
                    )}
                    {pw.scoreBreakdown.deltaRole !== 0 && (
                      <ScoreChip label="직업" value={pw.scoreBreakdown.deltaRole} positive={pw.scoreBreakdown.deltaRole > 0} />
                    )}
                    {pw.scoreBreakdown.deltaAlign > 0 && (
                      <ScoreChip label="매칭" value={pw.scoreBreakdown.deltaAlign} positive />
                    )}
                    {pw.scoreBreakdown.deltaKr > 0 && (
                      <ScoreChip label="한국경력" value={pw.scoreBreakdown.deltaKr} positive />
                    )}
                  </div>

                  {/* 비자 체인 + 기타 / Visa chain + etc. */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      {pw.visaChain}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pw.estimatedMonths}개월
                    </span>
                    {pw.estimatedIncome && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        연 {(pw.estimatedIncome / 10000).toLocaleString()}만원
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* What-If 시뮬레이션 / What-If simulations */}
        {result.whatIfSimulations && result.whatIfSimulations.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              만약에? 시뮬레이션
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              조건을 변경하면 점수가 어떻게 변할까요?
            </p>

            <div className="space-y-4">
              {result.whatIfSimulations.map((sim, sIdx) => (
                <div key={sIdx} className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <h4 className="text-sm font-bold text-purple-900">{sim.scenarioKo}</h4>
                    {sim.activatesNewPath && (
                      <Badge className="bg-green-100 text-green-700 text-xs">신규 경로 활성화</Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    {sim.results.slice(0, 3).map((change) => (
                      <div
                        key={change.pathwayId}
                        className="flex items-center justify-between p-2 bg-white rounded-lg"
                      >
                        <div>
                          <p className="text-sm text-gray-800">{change.nameKo}</p>
                          {change.isNewlyActivated && (
                            <span className="text-xs text-green-600 font-semibold">NEW</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{change.currentScore}점</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-sm font-bold text-purple-700">
                            {change.simulatedScore}점
                          </span>
                          <span className={`text-xs font-bold ${change.delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {change.delta > 0 ? '+' : ''}{change.delta}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 재진단 쿠폰 안내 / Rediagnosis coupon info */}
        {couponCode && (
          <Card className="p-6 mb-6 border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">재진단 쿠폰 발급 완료</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  6개월 후 무료로 다시 진단받을 수 있습니다
                </p>
                <p className="text-xs font-mono text-indigo-600 mt-1">
                  쿠폰 코드: {couponCode}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 하단 액션 / Bottom actions */}
        <div className="flex gap-3 mt-8">
          <Link href="/diagnosis/result" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              무료 결과 보기
            </Button>
          </Link>
          <Link href="/diagnosis" className="flex-1">
            <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700">
              새 진단 시작
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** 점수 분해 칩 / Score breakdown chip */
function ScoreChip({
  label,
  value,
  positive,
}: {
  label: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <div className="text-center p-1.5 bg-white rounded-lg">
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className={`text-xs font-bold ${positive ? 'text-green-600' : 'text-gray-700'}`}>
        {positive && value > 0 ? '+' : ''}{value}
      </p>
    </div>
  );
}
