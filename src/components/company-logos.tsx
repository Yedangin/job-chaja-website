'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * 채용 기업 로고 가로 스크롤 / Hiring company logos horizontal scroll
 *
 * 시드 데이터 13개 기업 로고 표시 — 신뢰 시그널
 * Shows 13 seeded company logos — trust signal
 *
 * 3색 원칙: #0066FF(accent) + #14191E(dark) + #F0F4F8(light)
 */

const companies = [
  { name: '삼성전자', logo: '/images/logos/samsung.svg' },
  { name: '현대자동차', logo: '/images/logos/hyundai-motor.svg' },
  { name: 'SK하이닉스', logo: '/images/logos/sk-hynix.svg' },
  { name: '기아', logo: '/images/logos/kia.svg' },
  { name: '현대건설', logo: '/images/logos/hyundai-enc.svg' },
  { name: '현대모비스', logo: '/images/logos/mobis.svg' },
  { name: 'CJ대한통운', logo: '/images/logos/cj-logistics.svg' },
  { name: 'CJ제일제당', logo: '/images/logos/cj-cheiljedang.svg' },
  { name: '쿠팡로지스틱스', logo: '/images/logos/coupang.svg' },
  { name: '신라호텔', logo: '/images/logos/shilla.svg' },
  { name: '그랜드 하얏트', logo: '/images/logos/hyatt.svg' },
  { name: '대우건설', logo: '/images/logos/daewoo.svg' },
  { name: '롯데글로벌로지스', logo: '/images/logos/lotte.svg' },
];

export default function CompanyLogos() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-bold text-[#14191E]">채용 중인 기업</h2>
        <Link
          href="/register"
          className="text-[12px] text-[#9CA3AF] hover:text-[#0066FF] transition-colors"
        >
          기업 서비스 알아보기
        </Link>
      </div>

      {/* 가로 스크롤 로고 / Horizontal scrolling logos */}
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {companies.map((c) => (
          <div
            key={c.name}
            className="flex flex-col items-center gap-2 shrink-0"
          >
            <div className="w-[72px] h-[72px] rounded-xl bg-[#F0F4F8] flex items-center justify-center p-3 hover:bg-[#E2E8F0] transition-colors">
              <Image
                src={c.logo}
                alt={c.name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="text-[11px] text-[#9CA3AF] whitespace-nowrap">{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
