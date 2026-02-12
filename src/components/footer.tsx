"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-400">
          <div>
            <p>
              <span className="font-semibold text-gray-500">주식회사 리브소프트 (LivSoft Inc)</span>
              <span className="mx-1.5">|</span>대표 박찬호
              <span className="mx-1.5">|</span>사업자등록번호 485-86-03274
            </p>
            <p className="mt-1">
              고객센터 010-3885-0675
              <span className="mx-1.5">|</span>pch0675@naver.com
            </p>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Link href="/terms-and-conditions" className="hover:text-gray-600 transition-colors">이용약관</Link>
            <span>|</span>
            <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">개인정보처리방침</Link>
          </div>
        </div>
        <p className="text-[11px] text-gray-300 mt-3">&copy; {new Date().getFullYear()} Jobchaja. All rights reserved.</p>
      </div>
    </footer>
  );
}
