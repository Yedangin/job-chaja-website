'use client';

/**
 * 글로벌 에러 페이지 / Global error page
 * Next.js App Router의 에러 바운더리 역할 (spec 12 §1-1)
 * Acts as Next.js App Router error boundary
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 / Log error (could be sent to monitoring service)
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          오류가 발생했습니다
        </h1>
        <p className="text-sm text-gray-500 mb-1">
          An unexpected error occurred. Please try again.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-red-400 font-mono mt-2 mb-4 break-all">
            {error.message}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition"
          >
            <Home className="w-4 h-4" />
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
