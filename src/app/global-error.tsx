'use client';

/**
 * 전역 에러 바운더리 / Global error boundary
 * 클라이언트 사이드 에러 발생 시 에러 메시지를 표시하여 디버깅 지원
 * Shows error message on client-side exceptions for debugging
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            오류가 발생했습니다 / An error occurred
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-mono text-red-800 break-all">
              {error.message || 'Unknown error'}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">Digest: {error.digest}</p>
            )}
          </div>
          <button
            onClick={reset}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-semibold"
          >
            다시 시도 / Try again
          </button>
        </div>
      </body>
    </html>
  );
}
