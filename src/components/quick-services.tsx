'use client';

import Link from 'next/link';
import {
  Briefcase, ShieldCheck, GraduationCap, Globe, FileText, Scale, ArrowRight,
} from 'lucide-react';

/**
 * 서비스 벤토 그리드 — 6개 핵심 서비스
 * Service bento grid — 6 core services
 *
 * Remember-style 카드: white bg + shadow-[0_4px_12px] + hover 엘리베이션
 * Remember-style cards: white bg + shadow + hover elevation
 *
 * 비대칭 벤토 그리드로 시각적 위계 표현
 * Asymmetric bento grid for visual hierarchy
 */

/* ─── 서비스 데이터 / Service data ───────────────────── */
interface Service {
  icon: typeof Briefcase;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  href: string;
  span?: string; // grid span 클래스 / grid span class
}

const services: Service[] = [
  {
    icon: Briefcase,
    iconBg: 'bg-[#0066FF]/8',
    iconColor: 'text-[#0066FF]',
    title: '채용공고',
    desc: '비자에 맞는 알바·정규직 공고',
    href: '/alba',
    span: 'lg:col-span-2',
  },
  {
    icon: GraduationCap,
    iconBg: 'bg-[#03B26C]/8',
    iconColor: 'text-[#03B26C]',
    title: '교육·연수',
    desc: '한국어·TOPIK·직업훈련',
    href: '#education',
  },
  {
    icon: Globe,
    iconBg: 'bg-[#FE9800]/8',
    iconColor: 'text-[#FE9800]',
    title: '생활 가이드',
    desc: '은행·주거·보험·교통',
    href: '#info-hub',
  },
  {
    icon: Scale,
    iconBg: 'bg-[#DC2626]/8',
    iconColor: 'text-[#DC2626]',
    title: '근로자 권리',
    desc: '최저임금·노동법·신고',
    href: '#info-hub',
  },
  {
    icon: FileText,
    iconBg: 'bg-[#7C3AED]/8',
    iconColor: 'text-[#7C3AED]',
    title: '이력서',
    desc: '간편 작성·비자 연동',
    href: '/worker/resume',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-[#0066FF]/8',
    iconColor: 'text-[#0066FF]',
    title: '비자 정보',
    desc: '31개 비자 유형 상세 안내',
    href: '/diagnosis',
  },
];

/* ─── 메인 컴포넌트 / Main component ─────────────────── */
export default function QuickServices() {
  return (
    <section>
      <h2 className="text-[20px] font-bold text-[#191F28] mb-1">
        무엇을 도와드릴까요?
      </h2>
      <p className="text-[14px] text-[#B0B8C1] mb-6">
        한국에서 일하고 생활하는 데 필요한 모든 서비스
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {services.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className={`group relative bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#F2F4F6] hover:border-[#E2E5E9] transition-all duration-200 hover:-translate-y-0.5 ${s.span || ''}`}
          >
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}>
              <s.icon size={20} className={s.iconColor} />
            </div>
            <h3 className="text-[15px] font-bold text-[#191F28] mb-1 group-hover:text-[#0066FF] transition-colors">
              {s.title}
            </h3>
            <p className="text-[12px] text-[#B0B8C1]">{s.desc}</p>
            <ArrowRight
              size={14}
              className="absolute top-5 right-5 text-[#E2E5E9] group-hover:text-[#0066FF] transition-colors"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
