'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * 공고 상세/수정 / Job detail/edit (placeholder)
 */
export default function CompanyJobDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/company/jobs" className="p-2 text-gray-500 hover:text-gray-700 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">공고 상세 #{id}</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">공고 상세 페이지 (STEP 22에서 구현)</p>
      </div>
    </div>
  );
}
