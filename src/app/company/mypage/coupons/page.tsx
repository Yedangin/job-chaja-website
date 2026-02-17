'use client';

import Link from 'next/link';
import { Ticket, ArrowLeft } from 'lucide-react';

/**
 * 쿠폰함 페이지 (준비 중) / Coupon box page (coming soon)
 */
export default function CouponsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Ticket className="w-8 h-8 text-gray-400" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">쿠폰함</h1>
      <p className="text-sm text-gray-500 mb-8">이 기능은 준비 중입니다. 곧 이용하실 수 있습니다.</p>
      <Link
        href="/company/mypage"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        MY 페이지로 돌아가기
      </Link>
    </div>
  );
}
