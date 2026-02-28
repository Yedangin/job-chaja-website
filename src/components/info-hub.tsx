'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * 정보 허브 — 외국인 취업·생활 정보 / Info hub — Foreign worker guide
 *
 * 색상: accent blue (#0066FF) + neutral gray 만 사용
 * Color: accent blue + neutral gray only
 */

/* ─── 정보 섹션 데이터 / Info section data ──────────────── */
interface HubSection {
  title: string;
  items: { label: string; href: string; tag?: string }[];
}

const hubSections: HubSection[] = [
  {
    title: '한국 생활 가이드',
    items: [
      { label: '외국인등록증 만들기', href: '#' },
      { label: '은행 계좌 개설 방법', href: '#' },
      { label: '건강보험 가입 안내', href: '#' },
      { label: '주거·교통 가이드', href: '#' },
    ],
  },
  {
    title: '비자별 취업 가이드',
    items: [
      { label: 'E-9 비전문취업 절차', href: '#', tag: '인기' },
      { label: 'H-2 방문취업 안내', href: '#' },
      { label: 'F-2 거주자격 변경', href: '#' },
      { label: 'E-7 전문직 비자', href: '#' },
    ],
  },
  {
    title: '어학 정보',
    items: [
      { label: 'TOPIK 시험 일정·접수', href: '#', tag: '시험' },
      { label: '세종학당 찾기', href: '#' },
      { label: '무료 한국어 온라인 강좌', href: '#' },
      { label: '어학당 모집 공고', href: '#' },
    ],
  },
  {
    title: '근로자 권리',
    items: [
      { label: '2026년 최저임금 안내', href: '#', tag: '최신' },
      { label: '노동법 기본 상식', href: '#' },
      { label: '부당대우 신고 방법', href: '#' },
      { label: '무료 상담 전화번호', href: '#' },
    ],
  },
  {
    title: '정책 변경 알림',
    items: [
      { label: '2026년 E-9 쿼터 변경', href: '#' },
      { label: 'H-2 체류기간 연장 안내', href: '#' },
      { label: '외국인 고용허가제 개정', href: '#' },
    ],
  },
  {
    title: '공지사항',
    items: [
      { label: '잡차자 서비스 오픈 안내', href: '#' },
      { label: '비자 진단 서비스 출시', href: '#' },
      { label: '기업 회원 모집 중', href: '#' },
    ],
  },
];

/* ─── 메인 컴포넌트 / Main component ─────────────────────── */
export default function InfoHub() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[17px] font-bold text-[#14191E]">외국인 취업·생활 정보</h2>
        <span className="text-[12px] text-[#9CA3AF]">한국에서 일하고 생활하는 데 필요한 정보</span>
      </div>

      {/* 3×2 그리드 — 무채색 + 단일 accent / 3×2 grid — neutral + single accent */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
        {hubSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-[14px] font-bold text-[#14191E] mb-3 pb-2 border-b border-[#E5E7EB]">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between py-1.5 group"
                  >
                    <span className="text-[13px] text-[#6B7280] group-hover:text-[#0066FF] transition-colors truncate pr-2">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.tag && (
                        <span className="text-[9px] font-semibold text-[#0066FF] bg-[#F0F4F8] px-1.5 py-0.5 rounded">
                          {item.tag}
                        </span>
                      )}
                      <ArrowRight size={11} className="text-[#D1D5DB] group-hover:text-[#0066FF] transition-colors" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
