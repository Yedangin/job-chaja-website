'use client';

import { Suspense } from 'react';
import { JobCreateWizard } from '@/features/jobs/components/job-create-wizard';
import { Loader2 } from 'lucide-react';
import CompanyAuthGuard from '@/components/guards/company-auth-guard';

/**
 * 채용공고 등록 페이지 (씬 셸)
 * Job posting creation page (thin shell)
 *
 * 기업인증 SUBMITTED 이상만 접근 가능 (임시저장 허용)
 * Only SUBMITTED+ companies can access (drafts allowed)
 */
export default function CompanyJobCreatePage() {
  return (
    <CompanyAuthGuard requiredAccess="draft">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        }
      >
        <JobCreateWizard />
      </Suspense>
    </CompanyAuthGuard>
  );
}
