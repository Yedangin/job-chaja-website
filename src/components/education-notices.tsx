'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';

/**
 * 교육·연수·모집 공고 — 탭 + 피처드 + compact 리스트
 * Education & training notices — Tabs + featured + compact list
 *
 * Saramin notice board 패턴: 좌측 피처드 카드 + 우측 compact rows
 * Saramin notice board pattern: Left featured card + right compact rows
 */

/* ─── 타입 / Types ───────────────────────────────────── */
type NoticeTag = '모집중' | '접수예정' | '마감임박' | '상시';
type TabKey = '전체' | '교육' | '시험' | '훈련' | '행사';

interface EducationNotice {
  tag: NoticeTag;
  category: TabKey;
  title: string;
  organizer: string;
  location: string;
  date: string;
  href: string;
  featured?: boolean;
}

/* ─── 데이터 / Data ──────────────────────────────────── */
const notices: EducationNotice[] = [
  {
    tag: '모집중', category: '교육', featured: true,
    title: '2026 상반기 무료 한국어교육 과정',
    organizer: '서울글로벌센터', location: '서울 종로구', date: '03.03 ~ 03.28', href: '#',
  },
  {
    tag: '접수예정', category: '시험',
    title: '제89회 TOPIK 시험 접수 안내',
    organizer: '국립국제교육원', location: '전국', date: '04.12 ~ 04.13', href: '#',
  },
  {
    tag: '모집중', category: '훈련',
    title: '외국인 근로자 직업훈련 프로그램',
    organizer: '한국산업인력공단', location: '경기 안산시', date: '03.10 ~ 06.30', href: '#',
  },
  {
    tag: '마감임박', category: '행사',
    title: '외국인 채용 박람회 참가자 모집',
    organizer: '고용노동부', location: '서울 COEX', date: '03.15', href: '#',
  },
  {
    tag: '상시', category: '교육',
    title: '세종학당 한국어 온라인 강좌',
    organizer: '세종학당재단', location: '온라인', date: '상시', href: '#',
  },
  {
    tag: '모집중', category: '교육',
    title: '외국인 주민 생활 정착 교육',
    organizer: '출입국·외국인청', location: '서울 양천구', date: '03.05 ~ 03.20', href: '#',
  },
  {
    tag: '접수예정', category: '훈련',
    title: '제조업 안전교육 특별과정',
    organizer: '안전보건공단', location: '인천 남동구', date: '04.01 ~ 04.15', href: '#',
  },
  {
    tag: '모집중', category: '행사',
    title: '다문화 취업 설명회',
    organizer: '여성가족부', location: '서울 영등포구', date: '03.22', href: '#',
  },
];

const tabs: TabKey[] = ['전체', '교육', '시험', '훈련', '행사'];

const tagStyle: Record<NoticeTag, string> = {
  '모집중': 'text-[#0066FF] bg-[#0066FF]/8',
  '접수예정': 'text-[#6B7684] bg-[#6B7684]/8',
  '마감임박': 'text-[#DC2626] bg-[#DC2626]/8',
  '상시': 'text-[#03B26C] bg-[#03B26C]/8',
};

/* ─── 메인 컴포넌트 / Main component ─────────────────── */
export default function EducationNotices() {
  const [activeTab, setActiveTab] = useState<TabKey>('전체');

  const filtered = activeTab === '전체'
    ? notices
    : notices.filter((n) => n.category === activeTab);

  const featured = filtered.find((n) => n.featured) || filtered[0];
  const rest = filtered.filter((n) => n !== featured);

  return (
    <section id="education">
      {/* 헤더 + 탭 / Header + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-[20px] font-bold text-[#191F28]">교육·연수·모집 공고</h2>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-[#F2F4F6] p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 ${
                  activeTab === tab
                    ? 'bg-white text-[#191F28] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'text-[#6B7684] hover:text-[#333D4B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <Link
            href="#"
            className="text-[13px] text-[#6B7684] hover:text-[#0066FF] transition-colors flex items-center gap-1 font-medium"
          >
            전체보기 <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 2컬럼: 피처드 + 리스트 / 2-column: Featured + list */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">

        {/* 피처드 카드 / Featured card */}
        {featured && (
          <Link
            href={featured.href}
            className="group relative bg-white rounded-2xl p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-[#F2F4F6] transition-all duration-200 flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md mb-4 ${tagStyle[featured.tag]}`}>
                {featured.tag}
              </span>
              <h3 className="text-[18px] font-bold text-[#191F28] group-hover:text-[#0066FF] transition-colors leading-snug mb-2">
                {featured.title}
              </h3>
              <p className="text-[14px] text-[#6B7684]">{featured.organizer}</p>
            </div>
            <div className="flex items-center gap-4 mt-4 text-[12px] text-[#B0B8C1]">
              <span className="flex items-center gap-1"><MapPin size={11} /> {featured.location}</span>
              <span className="flex items-center gap-1"><Calendar size={11} /> {featured.date}</span>
            </div>
            <ArrowRight
              size={16}
              className="absolute top-7 right-7 text-[#E2E5E9] group-hover:text-[#0066FF] transition-colors"
            />
          </Link>
        )}

        {/* compact 리스트 / Compact list */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#F2F4F6] overflow-hidden divide-y divide-[#F2F4F6]">
          {rest.slice(0, 5).map((notice, i) => (
            <Link
              key={`${notice.title}-${i}`}
              href={notice.href}
              className="group flex items-center gap-3 px-5 py-3.5 hover:bg-[#F9FAFB] transition-colors"
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 min-w-[48px] text-center ${tagStyle[notice.tag]}`}>
                {notice.tag}
              </span>
              <span className="text-[13px] text-[#333D4B] group-hover:text-[#0066FF] transition-colors truncate flex-1 font-medium">
                {notice.title}
              </span>
              <span className="text-[11px] text-[#B0B8C1] shrink-0 hidden sm:block">{notice.date}</span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
