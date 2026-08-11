"use client";

import Link from "next/link";
import { COMPANY_INFO } from '@/constants/company-info';
import { useLanguage } from '@/i18n/LanguageProvider';

const FOOTER_COPY = {
  ko: {
    representative: '대표',
    businessNumber: '사업자등록번호',
    phone: '대표번호',
    terms: '이용약관',
    privacy: '개인정보처리방침',
    refund: '취소 및 환불 정책',
    privacyRequest: '개인정보 권리 요청',
  },
  en: {
    representative: 'Representative',
    businessNumber: 'Business registration no.',
    phone: 'Phone',
    terms: 'Terms',
    privacy: 'Privacy',
    refund: 'Refund policy',
    privacyRequest: 'Privacy request',
  },
} as const;

export default function Footer() {
  const { lang } = useLanguage();
  const isKorean = lang === 'ko' || lang === 'kr';
  const copy = isKorean ? FOOTER_COPY.ko : FOOTER_COPY.en;

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-400">
          <div>
            <p>
              <span className="font-semibold text-gray-500">
                {COMPANY_INFO.legalNameKo} ({COMPANY_INFO.legalNameEn})
              </span>
              <span className="mx-1.5">|</span>
              {copy.representative} {isKorean ? COMPANY_INFO.representativeKo : COMPANY_INFO.representativeEn}
              <span className="mx-1.5">|</span>
              {copy.businessNumber} {COMPANY_INFO.businessRegistrationNumber}
            </p>
            <p className="mt-1">
              {isKorean ? COMPANY_INFO.addressKo : COMPANY_INFO.addressEn}
            </p>
            <p className="mt-1">
              {copy.phone} {COMPANY_INFO.phone}
              <span className="mx-1.5">|</span>{COMPANY_INFO.email}
            </p>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Link href="/terms-and-conditions" className="hover:text-gray-600 transition-colors">{copy.terms}</Link>
            <span>|</span>
            <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">{copy.privacy}</Link>
            <span>|</span>
            <Link href="/refund-policy" className="hover:text-gray-600 transition-colors">{copy.refund}</Link>
            <span>|</span>
            <Link href="/privacy-request" className="hover:text-gray-600 transition-colors">{copy.privacyRequest}</Link>
          </div>
        </div>
        <p className="text-[11px] text-gray-300 mt-3">&copy; {new Date().getFullYear()} Jobchaja. All rights reserved.</p>
      </div>
    </footer>
  );
}
