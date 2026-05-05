"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-400">
          <div>
            <p>
              <span className="font-semibold text-gray-500">LivSoft Inc.</span>
              <span className="mx-1.5">|</span>CEO Chanho Park
              <span className="mx-1.5">|</span>Business Registration No. 485-86-03274
            </p>
            <p className="mt-1">
              Room 519, 15 Toegye-ro, Jung-gu, Seoul, Republic of Korea
            </p>
            <p className="mt-1">
              Main line 070-8095-4474
              <span className="mx-1.5">|</span>pch0675@naver.com
            </p>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Link href="/terms-and-conditions" className="hover:text-gray-600 transition-colors">Terms & Conditions</Link>
            <span>|</span>
            <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
        <p className="text-[11px] text-gray-300 mt-3">&copy; {new Date().getFullYear()} Jobchaja. All rights reserved.</p>
      </div>
    </footer>
  );
}
