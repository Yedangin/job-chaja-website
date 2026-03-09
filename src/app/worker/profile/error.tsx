'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 / Log error for debugging
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        문제가 발생했습니다
      </h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        일시적인 오류입니다. 다시 시도해주세요.
        <br />
        문제가 계속되면 고객센터로 문의해주세요.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          다시 시도
        </button>
        <a
          href="/"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Home className="w-4 h-4" />
          홈으로
        </a>
      </div>
    </div>
  );
}
