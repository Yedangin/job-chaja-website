'use client';

import { Suspense } from 'react';
import { JobCreateWizard } from '@/features/jobs/components/job-create-wizard';
import { Loader2 } from 'lucide-react';

/**
 * 채용공고 등록 페이지 (씬 셸)
 * Job posting creation page (thin shell)
 *
 * 모든 로직은 JobCreateWizard에 위임
 * All logic delegated to JobCreateWizard
 */
export default function CompanyJobCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <JobCreateWizard />
    </Suspense>
  );
}
