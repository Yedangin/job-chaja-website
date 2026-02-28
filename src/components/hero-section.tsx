'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Briefcase, FileText, Scale } from 'lucide-react';

/**
 * 메인 히어로 — 3분할 (비자진단 | 가이드슬라이더+아이콘3 | 교육·생활리스트)
 * Main hero — 3-split (Visa diagnosis | Guide slider+3 icons | Education+Life list)
 *
 * 슬라이더: API에서 게시글을 불러와 동적 표시, 6초 자동 회전, 좌우 화살표
 * Slider: Fetches posts from API dynamically, 6s auto-rotate, left/right arrows
 */

/* ─── 커버 비자 전체 (CDEF순) / All covered visas (C→D→E→F→H order) ─── */
/* D-1(문화연수), D-7(주재), D-8(기업투자), D-9(무역경영)는 미지원 / Not supported */
const coveredVisas = [
  { code: 'C-4', label: '단기취업' },
  { code: 'D-2', label: '유학' },
  { code: 'D-4', label: '일반연수' },
  { code: 'D-10', label: '구직' },
  { code: 'E-1', label: '교수' },
  { code: 'E-2', label: '회화지도' },
  { code: 'E-3', label: '연구' },
  { code: 'E-4', label: '기술지도' },
  { code: 'E-5', label: '전문직업' },
  { code: 'E-6', label: '예술흥행' },
  { code: 'E-7', label: '특정활동' },
  { code: 'E-8', label: '계절근로' },
  { code: 'E-9', label: '비전문취업' },
  { code: 'E-10', label: '선원취업' },
  { code: 'F-1', label: '방문동거' },
  { code: 'F-2', label: '거주' },
  { code: 'F-3', label: '동반' },
  { code: 'F-4', label: '재외동포' },
  { code: 'F-5', label: '영주' },
  { code: 'F-6', label: '결혼이민' },
  { code: 'H-1', label: '관광취업' },
  { code: 'H-2', label: '방문취업' },
];

/* ─── 슬라이드 타입 / Slide type ─────────────────────── */
interface SlideData {
  bg: string;
  tag: string;
  tagStyle: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
}

/* ─── 카테고리별 슬라이드 스타일 매핑 / Category → slide style mapping ─── */
type InfoCategory = 'VISA_INFO' | 'EDUCATION' | 'LIVING_TIPS' | 'POLICY_LAW' | 'ANNOUNCEMENTS';

const CATEGORY_STYLES: Record<InfoCategory, { bg: string; tag: string; tagStyle: string; cta: string }> = {
  VISA_INFO: {
    bg: 'bg-gradient-to-br from-[#0052CC] to-[#0066FF]',
    tag: '비자', tagStyle: 'bg-white/20 text-white',
    cta: '자세히 보기',
  },
  EDUCATION: {
    bg: 'bg-gradient-to-br from-[#B45309] to-[#F59E0B]',
    tag: '교육', tagStyle: 'bg-white/20 text-white',
    cta: '교육 안내 보기',
  },
  LIVING_TIPS: {
    bg: 'bg-gradient-to-br from-[#0D4F3C] to-[#03B26C]',
    tag: '생활 필수', tagStyle: 'bg-white/20 text-white',
    cta: '가이드 보기',
  },
  POLICY_LAW: {
    bg: 'bg-gradient-to-br from-[#991B1B] to-[#DC2626]',
    tag: '근로자 권리', tagStyle: 'bg-white/20 text-white',
    cta: '상세 확인',
  },
  ANNOUNCEMENTS: {
    bg: 'bg-gradient-to-br from-[#3730A3] to-[#6366F1]',
    tag: '공지', tagStyle: 'bg-white/20 text-white',
    cta: '공지 확인',
  },
};

/* 동일 카테고리 게시글 구분을 위한 추가 배경색 / Alternate bg for same-category posts */
const ALT_BGS: Record<InfoCategory, string[]> = {
  VISA_INFO: ['bg-gradient-to-br from-[#0052CC] to-[#0066FF]', 'bg-gradient-to-br from-[#0E4429] to-[#1B7A4A]'],
  EDUCATION: ['bg-gradient-to-br from-[#B45309] to-[#F59E0B]'],
  LIVING_TIPS: ['bg-gradient-to-br from-[#0D4F3C] to-[#03B26C]', 'bg-gradient-to-br from-[#5B21B6] to-[#7C3AED]', 'bg-gradient-to-br from-[#1A1A2E] to-[#16213E]'],
  POLICY_LAW: ['bg-gradient-to-br from-[#991B1B] to-[#DC2626]', 'bg-gradient-to-br from-[#3730A3] to-[#6366F1]'],
  ANNOUNCEMENTS: ['bg-gradient-to-br from-[#3730A3] to-[#6366F1]'],
};

/* ─── 하드코딩 폴백 슬라이드 / Hardcoded fallback slides ─── */
const FALLBACK_SLIDES: SlideData[] = [
  { bg: 'bg-gradient-to-br from-[#0052CC] to-[#0066FF]', tag: '입국 필수', tagStyle: 'bg-white/20 text-white', title: '외국인 등록증 발급', desc: '입국 후 90일 이내 · 출입국관리사무소', cta: '발급 방법 보기', href: '/worker/guide/1' },
  { bg: 'bg-gradient-to-br from-[#0D4F3C] to-[#03B26C]', tag: '생활 필수', tagStyle: 'bg-white/20 text-white', title: '한국 은행 계좌 개설', desc: '여권 + 외국인등록증으로 즉시 개설', cta: '개설 가이드', href: '/worker/guide/2' },
  { bg: 'bg-gradient-to-br from-[#5B21B6] to-[#7C3AED]', tag: '통신', tagStyle: 'bg-white/20 text-white', title: '핸드폰 개통 가이드', desc: '선불 SIM · 후불 요금제 비교 안내', cta: '개통 방법 보기', href: '/worker/guide/3' },
  { bg: 'bg-gradient-to-br from-[#1A1A2E] to-[#16213E]', tag: '의료', tagStyle: 'bg-[#38BDF8]/30 text-[#38BDF8]', title: '건강보험 가입 안내', desc: '직장가입 vs 지역가입 · 병원 이용법', cta: '보험 안내 보기', href: '/worker/guide/4' },
  { bg: 'bg-gradient-to-br from-[#B45309] to-[#F59E0B]', tag: '교육', tagStyle: 'bg-white/20 text-white', title: '한국어 무료 교육', desc: '세종학당 · 다문화센터 · 고용센터', cta: '교육 신청 안내', href: '/worker/guide/5' },
  { bg: 'bg-gradient-to-br from-[#0E4429] to-[#1B7A4A]', tag: '비자', tagStyle: 'bg-white/20 text-white', title: '비자 연장·변경 절차', desc: '만료 4개월 전 신청 · 필요 서류 안내', cta: '절차 확인하기', href: '/worker/guide/6' },
  { bg: 'bg-gradient-to-br from-[#991B1B] to-[#DC2626]', tag: '근로자 권리', tagStyle: 'bg-white/20 text-white', title: '근로계약서 체크리스트', desc: '서명 전 반드시 확인할 7가지 항목', cta: '체크리스트 보기', href: '/worker/guide/7' },
  { bg: 'bg-gradient-to-br from-[#3730A3] to-[#6366F1]', tag: '급여', tagStyle: 'bg-white/20 text-white', title: '최저임금 & 급여 계산', desc: '2025년 시급 9,860원 · 주휴수당 포함', cta: '급여 계산 안내', href: '/worker/guide/8' },
];

/* ─── API 게시글 → 슬라이드 변환 / Convert API post to slide ─── */
interface ApiPost { id: number; title: string; category: InfoCategory; createdAt: string; }

function postsToSlides(posts: ApiPost[]): SlideData[] {
  const catCounter: Record<string, number> = {};
  return posts.map((post) => {
    const style = CATEGORY_STYLES[post.category] || CATEGORY_STYLES.ANNOUNCEMENTS;
    const alts = ALT_BGS[post.category] || [style.bg];
    const idx = catCounter[post.category] || 0;
    catCounter[post.category] = idx + 1;
    const bg = alts[idx % alts.length];
    return {
      bg,
      tag: style.tag,
      tagStyle: style.tagStyle,
      title: post.title,
      desc: '',
      cta: style.cta,
      href: `/worker/guide/${post.id}`,
    };
  });
}

/* ─── 서비스 아이콘 3개 / 3 service icons ────────────── */
const serviceIcons = [
  { icon: Briefcase, label: '채용공고', href: '#job-listings', color: 'text-[#0066FF]', bg: 'bg-[#0066FF]/8' },
  { icon: FileText, label: '이력서', href: '/worker/resume', color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/8' },
  { icon: Scale, label: '생활 가이드', href: '/worker/guide', color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/8' },
];

/* ─── 교육·생활 데이터 / Education + Life guide data ──── */
type NoticeTag = '모집중' | '접수예정' | '마감임박' | '상시';
type TabKey = '전체' | '교육' | '시험' | '훈련' | '행사' | '생활';

interface EduNotice {
  tag: NoticeTag;
  category: TabKey;
  title: string;
  date: string;
  href: string;
}

const eduNotices: EduNotice[] = [
  { tag: '접수예정', category: '시험', title: '제89회 TOPIK 시험 접수 안내', date: '04.12 ~ 04.13', href: '#' },
  { tag: '모집중', category: '훈련', title: '외국인 근로자 직업훈련 프로그램', date: '03.10 ~ 06.30', href: '#' },
  { tag: '마감임박', category: '행사', title: '외국인 채용 박람회 참가자 모집', date: '03.15', href: '#' },
  { tag: '상시', category: '교육', title: '세종학당 한국어 온라인 강좌', date: '상시', href: '/worker/guide/5' },
  { tag: '모집중', category: '교육', title: '외국인 주민 생활 정착 교육', date: '03.05 ~ 03.20', href: '#' },
  { tag: '접수예정', category: '훈련', title: '제조업 안전교육 특별과정', date: '04.01 ~ 04.15', href: '#' },
  { tag: '모집중', category: '행사', title: '다문화 취업 설명회', date: '03.22', href: '#' },
  { tag: '상시', category: '생활', title: '외국인 등록증 발급 가이드', date: '상시', href: '/worker/guide/1' },
  { tag: '상시', category: '생활', title: '은행 계좌 개설 방법', date: '상시', href: '/worker/guide/2' },
  { tag: '상시', category: '생활', title: '건강보험 가입 안내', date: '상시', href: '/worker/guide/4' },
];

const eduTabs: TabKey[] = ['전체', '교육', '시험', '훈련', '행사', '생활'];

const eduTagStyle: Record<NoticeTag, string> = {
  '모집중': 'text-[#0066FF] bg-[#0066FF]/8',
  '접수예정': 'text-[#6B7684] bg-[#6B7684]/8',
  '마감임박': 'text-[#DC2626] bg-[#DC2626]/8',
  '상시': 'text-[#03B26C] bg-[#03B26C]/8',
};

/* ─── 메인 컴포넌트 / Main component ─────────────────── */
export default function HeroSection() {
  const [slides, setSlides] = useState<SlideData[]>(FALLBACK_SLIDES);
  const [slide, setSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [eduTab, setEduTab] = useState<TabKey>('전체');

  /* API에서 게시글 불러와 슬라이더에 반영 / Fetch posts from API for slider */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/info-board?limit=8');
        if (!res.ok) return;
        const json = await res.json();
        const payload = json.data || json;
        const items = payload.items as ApiPost[] | undefined;
        if (!cancelled && items && items.length > 0) {
          setSlides(postsToSlides(items));
        }
      } catch {
        // API 실패 시 폴백 유지 / Keep fallback on failure
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const next = useCallback(() => {
    setSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  /* 6초 자동 회전 / 6-second auto-rotate */
  useEffect(() => {
    if (hovered) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, hovered]);

  /* 스무스 스크롤 핸들러 / Smooth scroll handler */
  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const s = slides[slide] || FALLBACK_SLIDES[0];
  const filteredEdu = eduTab === '전체' ? eduNotices : eduNotices.filter((n) => n.category === eduTab);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_340px] gap-5 py-6">

      {/* ═══ 1열: 비자 진단 (주력) / Col 1: Visa diagnosis (primary) ═══ */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/8 mb-5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
          <span className="text-[12px] font-semibold text-[#0066FF]">외국인 취업·생활 통합 플랫폼</span>
        </div>

        <h1 className="text-[28px] lg:text-[36px] font-bold text-[#191F28] leading-[1.2] tracking-[-0.02em] mb-3">
          한국 취업·생활,<br />비자부터 시작하세요
        </h1>

        <p className="text-[15px] text-[#6B7684] leading-[1.6] mb-6 max-w-md">
          어떤 비자를 받을 수 있는지, 내 비자로 어디서 일할 수 있는지<br />
          지금 바로 확인하세요.
        </p>

        {/* 두 서비스 버튼: 비자 플래너 + 비자 매니저 / Two service buttons: Visa Planner + Visa Manager */}
        {/* 두 서비스 버튼: 비자 플래너 + 비자 매니저 / Two service buttons: Visa Planner + Visa Manager */}
        <div className="flex gap-2.5 mb-6 max-w-[340px]">
          {/* 비자 플래너 — 비자 미보유자용 / Visa Planner — for those without a visa */}
          <Link
            href="/diagnosis"
            className="group flex-1 flex flex-col gap-1 bg-[#0066FF] hover:bg-[#0052CC] text-white px-3.5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(0,102,255,0.25)] hover:shadow-[0_6px_16px_rgba(0,102,255,0.3)] hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold">비자 플래너</span>
              <ArrowRight size={12} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-white/80">비자가 아직 없다면</span>
          </Link>

          {/* 비자 매니저 — 비자 보유자용 / Visa Manager — for those with a visa */}
          <Link
            href="/visa-manager"
            className="group flex-1 flex flex-col gap-1 bg-[#191F28] hover:bg-[#333D4B] text-white px-3.5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)] hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold">비자 매니저</span>
              <ArrowRight size={12} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-white/70">이미 비자가 있다면</span>
          </Link>
        </div>

        {/* 커버 비자 자동 스크롤 — 클릭 시 비자 안내 페이지 / Covered visas auto-scroll — click for visa guide */}
        <div className="overflow-hidden max-w-[88.2%]" style={{ height: '58px' }}>
          <span className="text-[10px] text-[#B0B8C1] mb-1.5 block">잡차자가 분석하는 비자</span>
          <div className="flex animate-marquee">
            {/* 복사본 1 / Copy 1 */}
            <div className="flex gap-1.5 shrink-0 pr-1.5">
              {coveredVisas.map((v) => (
                <Link
                  key={`a-${v.code}`}
                  href="/worker/visa-guide"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F2F4F6] hover:bg-[#0066FF] text-[11px] font-medium text-[#333D4B] hover:text-white transition-all duration-150 shrink-0"
                >
                  <span className="font-bold">{v.code}</span>
                  <span className="opacity-50">{v.label}</span>
                </Link>
              ))}
            </div>
            {/* 복사본 2 / Copy 2 */}
            <div className="flex gap-1.5 shrink-0 pr-1.5">
              {coveredVisas.map((v) => (
                <Link
                  key={`b-${v.code}`}
                  href="/worker/visa-guide"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F2F4F6] hover:bg-[#0066FF] text-[11px] font-medium text-[#333D4B] hover:text-white transition-all duration-150 shrink-0"
                >
                  <span className="font-bold">{v.code}</span>
                  <span className="opacity-50">{v.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 2열: 가이드 슬라이더 + 아이콘 3개 / Col 2: Guide slider + 3 icons ═══ */}
      <div className="flex flex-col gap-3">
        {/* 가이드 슬라이더 — API 연동 / Guide slider — API connected */}
        <div
          className="relative overflow-hidden rounded-2xl flex-1 group/slider cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => { window.location.href = s.href; }}
        >
          <div className={`${s.bg} h-full p-5 flex flex-col justify-between text-white transition-colors duration-500`}>
            {/* 배경 장식 — pointer-events-none / Background decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/3 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            {/* 좌우 화살표 / Left-right arrow buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200"
              aria-label="이전 슬라이드 / Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200"
              aria-label="다음 슬라이드 / Next slide"
            >
              <ChevronRight size={16} />
            </button>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${s.tagStyle}`}>
                  {s.tag}
                </span>
                <span className="text-[10px] text-white/40">{slide + 1}/{slides.length}</span>
              </div>
              <h3 className="text-[18px] font-bold leading-tight mb-1.5">{s.title}</h3>
              {s.desc && <p className="text-[12px] opacity-60 leading-relaxed">{s.desc}</p>}
            </div>

            <div className="relative z-10 flex items-center justify-between mt-4">
              {/* CTA 버튼 — window.location.href로 강제 이동 */}
              {/* CTA button — window.location.href for forced navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); window.location.href = s.href; }}
                className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer"
              >
                {s.cta} <ArrowRight size={12} />
              </button>
              <div className="flex items-center gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSlide(i); }}
                    className={`rounded-full transition-all duration-300 ${
                      i === slide ? 'w-3.5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`슬라이드 ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 서비스 아이콘 3개 1줄 / 3 service icons in 1 row */}
        <div className="grid grid-cols-3 gap-1">
          {serviceIcons.map((svc) => (
            <Link
              key={svc.label}
              href={svc.href}
              onClick={(e) => handleScrollLink(e, svc.href)}
              className="group flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[#F9FAFB] hover:bg-[#F2F4F6] transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${svc.bg} flex items-center justify-center`}>
                <svc.icon size={14} className={svc.color} />
              </div>
              <span className="text-[10px] font-medium text-[#6B7684] group-hover:text-[#191F28] transition-colors">
                {svc.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ 3열: 교육·생활 리스트 / Col 3: Education + Life list ═══ */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#F2F4F6] flex flex-col overflow-hidden">
        <div className="flex items-center gap-0.5 px-3 pt-3 pb-2 border-b border-[#F2F4F6]">
          {eduTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setEduTab(tab)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                eduTab === tab
                  ? 'bg-[#191F28] text-white'
                  : 'text-[#B0B8C1] hover:text-[#6B7684]'
              }`}
            >
              {tab}
            </button>
          ))}
          <Link href="/worker/guide" className="ml-auto text-[10px] text-[#B0B8C1] hover:text-[#0066FF] transition-colors flex items-center gap-0.5 shrink-0">
            전체보기 <ArrowRight size={9} />
          </Link>
        </div>

        {/* 테이블형 리스트 — 태그·제목·날짜 열 정렬 / Table-style list — tag, title, date columns aligned */}
        <div className="flex-1 divide-y divide-[#F2F4F6] overflow-y-auto">
          {filteredEdu.slice(0, 7).map((n, i) => (
            <Link
              key={`${n.title}-${i}`}
              href={n.href}
              onClick={(e) => handleScrollLink(e, n.href)}
              className="group grid grid-cols-[52px_1fr_auto] items-center px-3 py-2.5 hover:bg-[#F9FAFB] transition-colors"
            >
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-center whitespace-nowrap ${eduTagStyle[n.tag]}`}>
                {n.tag}
              </span>
              <span className="text-[12px] text-[#333D4B] group-hover:text-[#0066FF] transition-colors font-medium truncate min-w-0 pl-2">
                {n.title}
              </span>
              <span className="text-[10px] text-[#B0B8C1] pl-2 shrink-0 whitespace-nowrap">{n.date}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
