'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Briefcase, FileText, Scale } from 'lucide-react';

interface SlideData {
  bg: string;
  tag: string;
  tagStyle: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
}

type InfoCategory = 'VISA_INFO' | 'EDUCATION' | 'LIVING_TIPS' | 'POLICY_LAW' | 'ANNOUNCEMENTS';

const coveredVisas = [
  { code: 'C-4', label: 'Short-Term Work' },
  { code: 'D-2', label: 'Study Abroad' },
  { code: 'D-4', label: 'General Training' },
  { code: 'D-10', label: 'Job Seeker' },
  { code: 'E-1', label: 'Professor' },
  { code: 'E-2', label: 'Language Instructor' },
  { code: 'E-3', label: 'Research' },
  { code: 'E-4', label: 'Technical Guidance' },
  { code: 'E-5', label: 'Professional' },
  { code: 'E-6', label: 'Arts and Performance' },
  { code: 'E-7', label: 'Special Occupation' },
  { code: 'E-8', label: 'Seasonal Work' },
  { code: 'E-9', label: 'Non-professional Work' },
  { code: 'E-10', label: 'Crew Employment' },
  { code: 'F-1', label: 'Visiting Family' },
  { code: 'F-2', label: 'Residence' },
  { code: 'F-3', label: 'Dependent' },
  { code: 'F-4', label: 'Overseas Korean' },
  { code: 'F-5', label: 'Permanent Resident' },
  { code: 'F-6', label: 'Marriage Migrant' },
  { code: 'H-1', label: 'Working Holiday' },
  { code: 'H-2', label: 'Working Visit' },
];

const CATEGORY_STYLES: Record<InfoCategory, { bg: string; tag: string; tagStyle: string; cta: string }> = {
  VISA_INFO: {
    bg: 'bg-gradient-to-br from-[#0052CC] to-[#0066FF]',
    tag: 'Visa',
    tagStyle: 'bg-white/20 text-white',
    cta: 'Learn more',
  },
  EDUCATION: {
    bg: 'bg-gradient-to-br from-[#B45309] to-[#F59E0B]',
    tag: 'Education',
    tagStyle: 'bg-white/20 text-white',
    cta: 'View details',
  },
  LIVING_TIPS: {
    bg: 'bg-gradient-to-br from-[#0D4F3C] to-[#03B26C]',
    tag: 'Life Tips',
    tagStyle: 'bg-white/20 text-white',
    cta: 'Open guide',
  },
  POLICY_LAW: {
    bg: 'bg-gradient-to-br from-[#991B1B] to-[#DC2626]',
    tag: 'Worker Rights',
    tagStyle: 'bg-white/20 text-white',
    cta: 'View details',
  },
  ANNOUNCEMENTS: {
    bg: 'bg-gradient-to-br from-[#3730A3] to-[#6366F1]',
    tag: 'Notice',
    tagStyle: 'bg-white/20 text-white',
    cta: 'Read update',
  },
};

const ALT_BGS: Record<InfoCategory, string[]> = {
  VISA_INFO: ['bg-gradient-to-br from-[#0052CC] to-[#0066FF]', 'bg-gradient-to-br from-[#0E4429] to-[#1B7A4A]'],
  EDUCATION: ['bg-gradient-to-br from-[#B45309] to-[#F59E0B]'],
  LIVING_TIPS: ['bg-gradient-to-br from-[#0D4F3C] to-[#03B26C]', 'bg-gradient-to-br from-[#5B21B6] to-[#7C3AED]', 'bg-gradient-to-br from-[#1A1A2E] to-[#16213E]'],
  POLICY_LAW: ['bg-gradient-to-br from-[#991B1B] to-[#DC2626]', 'bg-gradient-to-br from-[#3730A3] to-[#6366F1]'],
  ANNOUNCEMENTS: ['bg-gradient-to-br from-[#3730A3] to-[#6366F1]'],
};

const FALLBACK_SLIDES: SlideData[] = [
  { bg: 'bg-gradient-to-br from-[#0052CC] to-[#0066FF]', tag: 'Arrival', tagStyle: 'bg-white/20 text-white', title: 'Get Your Foreigner Registration Card', desc: 'Apply within 90 days after entry at immigration', cta: 'View checklist', href: '/worker/guide/1' },
  { bg: 'bg-gradient-to-br from-[#0D4F3C] to-[#03B26C]', tag: 'Daily Life', tagStyle: 'bg-white/20 text-white', title: 'Open a Korean Bank Account', desc: 'Bring your passport and ARC for a fast setup', cta: 'Open guide', href: '/worker/guide/2' },
  { bg: 'bg-gradient-to-br from-[#5B21B6] to-[#7C3AED]', tag: 'Mobile', tagStyle: 'bg-white/20 text-white', title: 'Phone Plan Setup Guide', desc: 'Compare prepaid SIM and monthly plans', cta: 'Compare options', href: '/worker/guide/3' },
  { bg: 'bg-gradient-to-br from-[#1A1A2E] to-[#16213E]', tag: 'Healthcare', tagStyle: 'bg-[#38BDF8]/30 text-[#38BDF8]', title: 'National Health Insurance Basics', desc: 'Understand workplace vs. local enrollment', cta: 'Read overview', href: '/worker/guide/4' },
  { bg: 'bg-gradient-to-br from-[#B45309] to-[#F59E0B]', tag: 'Education', tagStyle: 'bg-white/20 text-white', title: 'Free Korean Language Programs', desc: 'Find classes from Sejong Institute and local centers', cta: 'See programs', href: '/worker/guide/5' },
  { bg: 'bg-gradient-to-br from-[#0E4429] to-[#1B7A4A]', tag: 'Visa', tagStyle: 'bg-white/20 text-white', title: 'Visa Extension and Change Process', desc: 'Know when to apply and which documents matter', cta: 'Check process', href: '/worker/guide/6' },
  { bg: 'bg-gradient-to-br from-[#991B1B] to-[#DC2626]', tag: 'Rights', tagStyle: 'bg-white/20 text-white', title: 'Employment Contract Checklist', desc: 'Review the seven items to confirm before signing', cta: 'See checklist', href: '/worker/guide/7' },
  { bg: 'bg-gradient-to-br from-[#3730A3] to-[#6366F1]', tag: 'Pay', tagStyle: 'bg-white/20 text-white', title: 'Minimum Wage and Pay Guide', desc: 'Understand hourly pay and weekly holiday allowance', cta: 'Open guide', href: '/worker/guide/8' },
];

interface ApiPost {
  id: number;
  title: string;
  category: InfoCategory;
  createdAt: string;
}

function postsToSlides(posts: ApiPost[]): SlideData[] {
  const catCounter: Record<string, number> = {};
  return posts.map((post) => {
    const style = CATEGORY_STYLES[post.category] || CATEGORY_STYLES.ANNOUNCEMENTS;
    const alts = ALT_BGS[post.category] || [style.bg];
    const idx = catCounter[post.category] || 0;
    catCounter[post.category] = idx + 1;

    return {
      bg: alts[idx % alts.length],
      tag: style.tag,
      tagStyle: style.tagStyle,
      title: post.title,
      desc: '',
      cta: style.cta,
      href: `/worker/guide/${post.id}`,
    };
  });
}

const serviceIcons = [
  { icon: Briefcase, label: 'Jobs', href: '#job-listings', color: 'text-[#0066FF]', bg: 'bg-[#0066FF]/8' },
  { icon: FileText, label: 'Resume', href: '/worker/resume', color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/8' },
  { icon: Scale, label: 'Life Guide', href: '/worker/guide', color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/8' },
];

type NoticeTag = 'Open' | 'Upcoming' | 'Closing Soon' | 'Always On';
type TabKey = 'All' | 'Education' | 'Test' | 'Training' | 'Events' | 'Life';

interface EduNotice {
  tag: NoticeTag;
  category: TabKey;
  title: string;
  date: string;
  href: string;
}

const eduNotices: EduNotice[] = [
  { tag: 'Upcoming', category: 'Test', title: 'TOPIK Registration Window', date: 'Apr 12 - Apr 13', href: '#' },
  { tag: 'Open', category: 'Training', title: 'Job Training Program for Foreign Workers', date: 'Mar 10 - Jun 30', href: '#' },
  { tag: 'Closing Soon', category: 'Events', title: 'Foreign Talent Hiring Fair', date: 'Mar 15', href: '#' },
  { tag: 'Always On', category: 'Education', title: 'Online Korean Classes from Sejong Institute', date: 'Always on', href: '/worker/guide/5' },
  { tag: 'Open', category: 'Education', title: 'Settlement Education for New Residents', date: 'Mar 05 - Mar 20', href: '#' },
  { tag: 'Upcoming', category: 'Training', title: 'Manufacturing Safety Intensive Course', date: 'Apr 01 - Apr 15', href: '#' },
  { tag: 'Open', category: 'Events', title: 'Multicultural Career Information Session', date: 'Mar 22', href: '#' },
  { tag: 'Always On', category: 'Life', title: 'Foreigner Registration Card Guide', date: 'Always on', href: '/worker/guide/1' },
  { tag: 'Always On', category: 'Life', title: 'How to Open a Bank Account', date: 'Always on', href: '/worker/guide/2' },
  { tag: 'Always On', category: 'Life', title: 'Health Insurance Enrollment Guide', date: 'Always on', href: '/worker/guide/4' },
];

const eduTabs: TabKey[] = ['All', 'Education', 'Test', 'Training', 'Events', 'Life'];

const eduTagStyle: Record<NoticeTag, string> = {
  Open: 'text-[#0066FF] bg-[#0066FF]/8',
  Upcoming: 'text-[#6B7684] bg-[#6B7684]/8',
  'Closing Soon': 'text-[#DC2626] bg-[#DC2626]/8',
  'Always On': 'text-[#03B26C] bg-[#03B26C]/8',
};

export default function HeroSection() {
  const [slides, setSlides] = useState<SlideData[]>(FALLBACK_SLIDES);
  const [slide, setSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [eduTab, setEduTab] = useState<TabKey>('All');

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
        // Keep fallback slides when the API is unavailable.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const next = useCallback(() => {
    setSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (hovered) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, hovered]);

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSlide = slides[slide] || FALLBACK_SLIDES[0];
  const filteredEdu = eduTab === 'All' ? eduNotices : eduNotices.filter((item) => item.category === eduTab);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_340px] gap-5 py-6">
      <div className="flex flex-col justify-center min-w-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/8 mb-5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
          <span className="text-[12px] font-semibold text-[#0066FF]">All-in-one platform for jobs and life in Korea</span>
        </div>

        <h1 className="text-[28px] lg:text-[36px] font-bold text-[#191F28] leading-[1.2] tracking-[-0.02em] mb-3">
          Work and live in Korea
          <br />
          with a visa plan that fits you
        </h1>

        <p className="text-[15px] text-[#6B7684] leading-[1.6] mb-6 max-w-md">
          See which visa pathways match your background and which jobs you can apply for right now.
        </p>

        <div className="flex gap-2.5 mb-6 max-w-[340px]">
          <Link
            href="/visa-planner"
            className="group flex-1 flex flex-col gap-1 bg-[#0066FF] hover:bg-[#0052CC] text-white px-3.5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(0,102,255,0.25)] hover:shadow-[0_6px_16px_rgba(0,102,255,0.3)] hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold">Visa Planner</span>
              <ArrowRight size={12} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-white/80">Start here if you are planning your move</span>
          </Link>

          <Link
            href="/worker/visa"
            className="group flex-1 flex flex-col gap-1 bg-[#191F28] hover:bg-[#333D4B] text-white px-3.5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)] hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold">Visa Center</span>
              <ArrowRight size={12} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[10px] text-white/70">Go here if you already have a visa</span>
          </Link>
        </div>

        <div className="overflow-hidden max-w-[88.2%]" style={{ height: '58px' }}>
          <span className="text-[10px] text-[#B0B8C1] mb-1.5 block">Visa categories covered by JobChaja</span>
          <div className="flex animate-marquee">
            <div className="flex gap-1.5 shrink-0 pr-1.5">
              {coveredVisas.map((visa) => (
                <Link
                  key={`a-${visa.code}`}
                  href="/worker/visa"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F2F4F6] hover:bg-[#0066FF] text-[11px] font-medium text-[#333D4B] hover:text-white transition-all duration-150 shrink-0"
                >
                  <span className="font-bold">{visa.code}</span>
                  <span className="opacity-50">{visa.label}</span>
                </Link>
              ))}
            </div>
            <div className="flex gap-1.5 shrink-0 pr-1.5">
              {coveredVisas.map((visa) => (
                <Link
                  key={`b-${visa.code}`}
                  href="/worker/visa"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F2F4F6] hover:bg-[#0066FF] text-[11px] font-medium text-[#333D4B] hover:text-white transition-all duration-150 shrink-0"
                >
                  <span className="font-bold">{visa.code}</span>
                  <span className="opacity-50">{visa.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div
          className="relative overflow-hidden rounded-2xl flex-1 group/slider cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => {
            window.location.href = currentSlide.href;
          }}
        >
          <div className={`${currentSlide.bg} h-full p-5 flex flex-col justify-between text-white transition-colors duration-500`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/3 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${currentSlide.tagStyle}`}>
                  {currentSlide.tag}
                </span>
                <span className="text-[10px] text-white/40">{slide + 1}/{slides.length}</span>
              </div>
              <h3 className="text-[18px] font-bold leading-tight mb-1.5">{currentSlide.title}</h3>
              {currentSlide.desc && <p className="text-[12px] opacity-60 leading-relaxed">{currentSlide.desc}</p>}
            </div>

            <div className="relative z-10 flex items-center justify-between mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = currentSlide.href;
                }}
                className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3.5 py-2 rounded-lg text-[12px] font-semibold transition-all cursor-pointer"
              >
                {currentSlide.cta} <ArrowRight size={12} />
              </button>
              <div className="flex items-center gap-1">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlide(index);
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      index === slide ? 'w-3.5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {serviceIcons.map((service) => (
            <Link
              key={service.label}
              href={service.href}
              onClick={(e) => handleScrollLink(e, service.href)}
              className="group flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[#F9FAFB] hover:bg-[#F2F4F6] transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${service.bg} flex items-center justify-center`}>
                <service.icon size={14} className={service.color} />
              </div>
              <span className="text-[10px] font-medium text-[#6B7684] group-hover:text-[#191F28] transition-colors">
                {service.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#F2F4F6] flex flex-col overflow-hidden">
        <div className="flex items-center gap-0.5 px-3 pt-3 pb-2 border-b border-[#F2F4F6]">
          {eduTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setEduTab(tab)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                eduTab === tab ? 'bg-[#191F28] text-white' : 'text-[#B0B8C1] hover:text-[#6B7684]'
              }`}
            >
              {tab}
            </button>
          ))}
          <Link href="/worker/guide" className="ml-auto text-[10px] text-[#B0B8C1] hover:text-[#0066FF] transition-colors flex items-center gap-0.5 shrink-0">
            View all <ArrowRight size={9} />
          </Link>
        </div>

        <div className="flex-1 divide-y divide-[#F2F4F6] overflow-y-auto">
          {filteredEdu.slice(0, 7).map((notice, index) => (
            <Link
              key={`${notice.title}-${index}`}
              href={notice.href}
              onClick={(e) => handleScrollLink(e, notice.href)}
              className="group grid grid-cols-[88px_1fr_auto] items-center px-3 py-2.5 hover:bg-[#F9FAFB] transition-colors"
            >
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-center whitespace-nowrap ${eduTagStyle[notice.tag]}`}>
                {notice.tag}
              </span>
              <span className="text-[12px] text-[#333D4B] group-hover:text-[#0066FF] transition-colors font-medium truncate min-w-0 pl-2">
                {notice.title}
              </span>
              <span className="text-[10px] text-[#B0B8C1] pl-2 shrink-0 whitespace-nowrap">{notice.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
