'use client';

/**
 * 약관 및 정책 / Terms and Policies
 */

import Link from 'next/link';
import { BookOpen, ExternalLink, ChevronRight } from 'lucide-react';

const TERMS_ITEMS = [
  {
    title: '이용약관',
    titleEn: 'Terms of Service',
    desc: '잡차자 서비스 이용에 관한 약관입니다.',
    href: '/terms-and-conditions',
    updatedAt: '2024.01.01',
  },
  {
    title: '개인정보 처리방침',
    titleEn: 'Privacy Policy',
    desc: '수집하는 개인정보 및 처리 방침을 안내합니다.',
    href: '/privacy-policy',
    updatedAt: '2024.01.01',
  },
];

export default function WorkerSupportTermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">약관 및 정책</h1>
        <p className="text-sm text-gray-500 mt-0.5">Terms & Policies</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {TERMS_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition group"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                {item.title}
                <span className="text-gray-400 font-normal ml-1.5">/ {item.titleEn}</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">최종 업데이트: {item.updatedAt}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-gray-600 transition" />
          </Link>
        ))}

        {/* 외부 링크: 출입국 법령 / External: immigration law */}
        <a
          href="https://www.hikorea.go.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition group"
        >
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
            <ExternalLink className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">
              출입국·외국인 법령 정보
              <span className="text-gray-400 font-normal ml-1.5">/ HiKorea</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">법무부 HiKorea 공식 사이트로 이동합니다.</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
        </a>
      </div>
    </div>
  );
}
