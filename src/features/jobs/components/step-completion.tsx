'use client';

import Link from 'next/link';
import { CheckCircle2, Share2, Search, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { JobCreateFormData, VisaMatchResult } from '../types/job-create.types';

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
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      {/* 성공 아이콘 / Success icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Review request received</h1>
      <p className="text-sm text-gray-500 mb-1">{form.title}</p>
      <p className="text-xs text-gray-400 mb-6">Your posting will be visible only after an administrator approves it.</p>

      {/* 매칭 비자 수 / Matched visa count */}
      {matchResult && matchResult.eligibleVisas.length > 0 && (
        <p className="text-sm text-blue-600 font-medium mb-6">
          {matchResult.eligibleVisas.length}개 비자 유형 매칭
        </p>
      )}

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
