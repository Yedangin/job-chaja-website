/**
 * 404 페이지 / 404 Not Found page
 * 존재하지 않는 경로 접근 시 표시 (spec 12 §1-1)
 * Shown when accessing non-existent routes
 */

import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Search className="w-8 h-8 text-blue-500" />
        </div>

        <h1 className="text-5xl font-extrabold text-gray-200 mb-4">404</h1>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-sm text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
          >
            <Home className="w-4 h-4" />
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
