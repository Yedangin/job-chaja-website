'use client';

/**
 * 해외 사용자 전용 랜딩 페이지 / International landing page
 * 비자 플래너를 메인 CTA로 하는 해외 전용 페이지
 * Visa planner as main CTA for overseas users (spec 04 §3-3)
 */

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import LanguageSwitcher from '@/components/language-switcher';
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Home,
  Plane,
  ChevronDown,
  CheckCircle2,
  Shield,
  Users,
  BarChart3,
  Globe,
  FileText,
  MapPin,
} from 'lucide-react';

/* ─── FAQ 데이터 / FAQ data (spec 04 §4-8) ─── */
const FAQ_ITEMS = [
  {
    q: 'What is the Visa Planner?',
    a: 'A free tool that analyzes your background and recommends the best visa pathway to live and work in South Korea. We evaluate 31 visa types based on your nationality, education, age, finances, and goals.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes! The basic Visa Planner is completely free. You can upgrade to Premium ($10) for a detailed roadmap with cost breakdowns, exam schedules, and employer matching.',
  },
  {
    q: 'What does the $10 Premium include?',
    a: 'Detailed pathway analysis with quarterly milestones, itemized cost estimates, relevant exam/school schedules, and the option to register your profile so verified Korean employers can reach out to you.',
  },
  {
    q: 'How accurate is the analysis?',
    a: 'Our engine evaluates 2,629 visa rules from Korean immigration law. Results are based on general eligibility criteria. Individual results may vary based on specific circumstances and policy changes.',
  },
  {
    q: 'Do I need an account?',
    a: 'The free planner works without an account. Premium analysis requires signup and profile completion so we can provide personalized recommendations.',
  },
  {
    q: 'Can employers find my profile?',
    a: 'Only if you choose to register in our Talent Pool after completing the Premium analysis. Only verified Korean companies with corporate verification can access the talent pool.',
  },
];

/* ─── 비자 경로 카드 데이터 / Visa pathway cards (spec 04 §4-4) ─── */
const VISA_PATHWAYS = [
  {
    icon: Briefcase,
    title: 'Work',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    iconColor: 'text-blue-500',
    visas: ['E-7 Professional', 'E-9 Non-professional', 'H-2 Working Visit'],
    desc: 'For employment in South Korea',
  },
  {
    icon: GraduationCap,
    title: 'Study',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    iconColor: 'text-emerald-500',
    visas: ['D-2 Study Abroad', 'D-4 Language Training', 'D-4-1 General Training'],
    desc: 'For education programs',
  },
  {
    icon: Home,
    title: 'Settle',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    iconColor: 'text-purple-500',
    visas: ['F-2 Resident', 'F-4 Overseas Korean', 'F-5 Permanent', 'F-6 Marriage'],
    desc: 'For long-term residency',
  },
  {
    icon: Plane,
    title: 'Working Holiday',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    iconColor: 'text-amber-500',
    visas: ['H-1 Working Holiday'],
    desc: 'For short-term experience',
  },
];

/* ─── 3단계 카드 / How it works steps (spec 04 §4-3) ─── */
const STEPS = [
  {
    num: '01',
    title: 'Tell Us About You',
    desc: 'Answer 6 simple questions about your background, education, and goals.',
    icon: FileText,
  },
  {
    num: '02',
    title: 'Get Pathway Analysis',
    desc: 'We analyze 31 visa types to find your best options with eligibility scores.',
    icon: BarChart3,
  },
  {
    num: '03',
    title: 'Start Your Journey',
    desc: 'Get a detailed roadmap with timelines, costs, and next steps.',
    icon: MapPin,
  },
];

export default function InternationalPage() {
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ─── Header (spec 04 §4-1) ─── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/international" className="text-lg font-bold text-gray-900">
            JobChaja
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {isLoading ? (
              <div className="w-16 h-8" />
            ) : !isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/worker/dashboard"
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  My Page
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-600"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="grow">
        {/* ─── Section 1: Hero (spec 04 §4-2) ─── */}
        <section className="relative overflow-hidden bg-linear-to-b from-blue-50 via-white to-white">
          {/* 배경 장식 / Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
            <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100/60 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              Your Path to South Korea Starts Here
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Plan Your Journey
              <br />
              <span className="text-blue-600">to Korea</span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Find the best visa pathway for your situation — Work, Study, or
              Settle in South Korea.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/diagnosis"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-full text-base font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all"
              >
                Start Free Visa Planner
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-400">
              Trusted by <strong className="text-gray-500">31 visa types</strong>{' '}
              &middot;{' '}
              <strong className="text-gray-500">2,629 matching rules</strong>
            </p>
          </div>
        </section>

        {/* ─── Section 2: How It Works (spec 04 §4-3) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
              How It Works
            </h2>
            <p className="mt-3 text-gray-500 text-center max-w-xl mx-auto">
              Three simple steps to find your best visa pathway
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="relative bg-gray-50 rounded-2xl p-6 hover:bg-blue-50/50 transition group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      {step.num}
                    </span>
                    <step.icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 3: Visa Pathways Preview (spec 04 §4-4) ─── */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
              Visa Pathways
            </h2>
            <p className="mt-3 text-gray-500 text-center max-w-xl mx-auto">
              Explore the main visa categories for entering South Korea
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {VISA_PATHWAYS.map((path) => (
                <Link
                  key={path.title}
                  href="/diagnosis"
                  className={`rounded-2xl border p-5 transition hover:shadow-md hover:-translate-y-0.5 ${path.color}`}
                >
                  <path.icon className={`w-8 h-8 ${path.iconColor} mb-3`} />
                  <h3 className="font-bold text-gray-900 mb-2">{path.title}</h3>
                  <ul className="space-y-1 mb-3">
                    {path.visas.map((v) => (
                      <li key={v} className="text-sm text-gray-600">
                        {v}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400">{path.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 4: Premium CTA (spec 04 §4-5) ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Get a Personalized Roadmap
              </h2>
              <p className="mt-2 text-blue-100 text-lg">
                for just <span className="font-bold text-white">$10 USD</span>
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                {[
                  'Detailed cost breakdown by pathway',
                  'Quarter-by-quarter timeline with milestones',
                  'Required documents checklist',
                  'Education & exam schedule integration',
                  'Register your profile for employer outreach',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                    <span className="text-sm text-blue-50">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/diagnosis"
                className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-700 rounded-full font-bold hover:bg-blue-50 transition shadow-lg"
              >
                Try Free Planner First
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Section 5: Already Have a Visa? (spec 04 §4-6) ─── */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Already Have a Korean Visa?
            </h2>
            <p className="mt-2 text-gray-500">
              Browse jobs from verified Korean companies that match your visa
              type.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition"
            >
              Browse Job Openings
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ─── Section 6: Trust Indicators (spec 04 §4-7) ─── */}
        <section className="py-14 sm:py-18 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-extrabold text-blue-600">31</p>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  visa types analyzed
                </p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-blue-600">2,629</p>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  rules in our matching engine
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  Verified employers only
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 7: FAQ Accordion (spec 04 §4-8) ─── */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
                  >
                    <span className="font-semibold text-gray-900 text-sm pr-4">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 면책 조항 / Disclaimer (spec 04 §6-6) */}
            <p className="mt-8 text-xs text-gray-400 text-center leading-relaxed">
              This tool provides general guidance only. For official advice,
              consult the{' '}
              <a
                href="https://www.immigration.go.kr/immigration_eng/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-500"
              >
                Korean Immigration Service
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-400">
            <div>
              <p className="font-semibold text-gray-500">JobChaja</p>
              <p className="mt-1 text-xs">
                Global Talent Matching Platform for South Korea
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/terms-and-conditions" className="hover:text-gray-600">
                Terms
              </Link>
              <Link href="/privacy-policy" className="hover:text-gray-600">
                Privacy
              </Link>
              <a href="mailto:pch0675@naver.com" className="hover:text-gray-600">
                Contact
              </a>
            </div>
          </div>
          <p className="text-[11px] text-gray-300 mt-4">
            &copy; {new Date().getFullYear()} JobChaja. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
