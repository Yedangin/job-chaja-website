'use client';

import Link from 'next/link';
import {
  CheckCircle2, Check, Star, Zap,
  Share2, Search, LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { JobCreateFormData, VisaMatchResult, BoardType } from '../types/job-create.types';

interface StepCompletionProps {
  form: JobCreateFormData;
  matchResult: VisaMatchResult | null;
  createdJobId: number | null;
}

/**
 * Step 6: 등록 완료 / Registration complete
 * 완료 메시지 + 프리미엄 업셀 + 다음 액션
 * Completion message + premium upsell + next actions
 */
export function StepCompletion({ form, matchResult }: StepCompletionProps) {
  // 노출 기간 / Exposure period
  const exposurePeriod = form.boardType === 'PART_TIME' ? '14일' : '30일';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      {/* 성공 아이콘 / Success icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">공고가 등록되었습니다!</h1>
      <p className="text-sm text-gray-500 mb-1">{form.title}</p>
      <p className="text-xs text-gray-400 mb-2">노출 기간: {exposurePeriod}</p>

      {/* 매칭 비자 수 / Matched visa count */}
      {matchResult && matchResult.eligibleVisas.length > 0 && (
        <p className="text-sm text-blue-600 font-medium mb-6">
          {matchResult.eligibleVisas.length}개 비자 유형 매칭
        </p>
      )}

      {/* 프리미엄 업셀 / Premium upsell */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-gray-900">프리미엄으로 업그레이드하면</h3>
        </div>
        <ul className="text-sm text-gray-600 space-y-1.5 mb-4">
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-500" /> 상단 노출
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-500" /> 추천 배지
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-amber-500" /> 노출 기간 2배
          </li>
        </ul>
        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold">
          <Zap className="w-4 h-4 mr-1" /> 프리미엄 업그레이드 — 50,000원
        </Button>
        <Link
          href="/company/jobs"
          className="block text-center text-xs text-gray-400 mt-2 hover:text-gray-600"
        >
          나중에 하기
        </Link>
      </div>

      {/* 다음 액션 버튼 / Next action buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" className="gap-2 text-sm">
          <Share2 className="w-4 h-4" /> 공고 공유
        </Button>
        <Link href="/company/talents">
          <Button variant="outline" className="gap-2 text-sm">
            <Search className="w-4 h-4" /> 인재 검색
          </Button>
        </Link>
        <Link href="/company/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm">
            <LayoutDashboard className="w-4 h-4" /> 대시보드
          </Button>
        </Link>
      </div>
    </div>
  );
}
