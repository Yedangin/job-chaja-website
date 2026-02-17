'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * 구직자 공고 상세 / Worker job detail (placeholder)
 */
export default function WorkerJobDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/worker/jobs" className="p-2 text-gray-500 hover:text-gray-700 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">공고 상세 #{id}</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-sm">공고 상세 보기 (기존 /jobs/[id] 이관 예정)</p>
      </div>
    </div>
  );
}
