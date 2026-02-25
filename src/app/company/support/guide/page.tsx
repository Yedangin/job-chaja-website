'use client';

/**
 * 기업 이용 가이드 페이지 / Company Usage Guide Page
 * 각 기능별 가이드를 카드 형식으로 제공하며, 클릭 시 상세 내용을 인라인으로 펼침
 * Provides feature guides in card format with inline expand on click
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Building2,
  ClipboardList,
  Users,
  CreditCard,
  Globe,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

/** 가이드 카테고리 타입 / Guide category type */
interface GuideStep {
  title: string;
  titleEn: string;
  description: string;
}

interface GuideCategory {
  id: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  title: string;
  titleEn: string;
  summary: string;
  link?: string;
  steps: GuideStep[];
  videoPlaceholder?: boolean;
}

/** 가이드 카테고리 목록 / Guide category list */
const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: 'getting-started',
    icon: <UserPlus className="w-6 h-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    title: '시작하기',
    titleEn: 'Getting Started',
    summary: '회원가입부터 기업인증까지 빠르게 시작하세요.',
    link: '/auth/register',
    steps: [
      {
        title: '회원가입',
        titleEn: 'Sign Up',
        description:
          '잡차자 홈페이지에서 "기업 회원가입"을 선택하세요. 이메일 또는 소셜 계정(Google, Kakao)으로 가입할 수 있습니다.',
      },
      {
        title: '기업 정보 입력',
        titleEn: 'Enter Company Info',
        description:
          '사업자등록번호, 회사명, 대표자명, 업종 등 기본 기업 정보를 입력합니다. 모든 정보는 이후 수정 가능합니다.',
      },
      {
        title: '기업인증 신청',
        titleEn: 'Apply for Verification',
        description:
          '사업자등록증 사본을 업로드하여 기업인증을 신청합니다. 승인은 영업일 기준 1~2일이 소요됩니다.',
      },
      {
        title: '인증 완료 후 서비스 이용',
        titleEn: 'Use Service After Approval',
        description:
          '기업인증이 완료되면 채용 공고 게시, 지원자 관리, 열람권 구매 등 전체 서비스를 이용할 수 있습니다.',
      },
    ],
    videoPlaceholder: true,
  },
  {
    id: 'job-posting',
    icon: <ClipboardList className="w-6 h-6" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    title: '공고 등록',
    titleEn: 'Job Posting',
    summary: '5단계 마법사로 채용 공고를 쉽게 등록하세요.',
    link: '/company/jobs/create',
    steps: [
      {
        title: 'Step 1: 기본 정보',
        titleEn: 'Basic Information',
        description:
          '공고 제목, 직종, 고용 형태(정규직/알바), 모집 인원 등 기본 채용 정보를 입력합니다.',
      },
      {
        title: 'Step 2: 근무 조건',
        titleEn: 'Work Conditions',
        description:
          '급여, 근무 시간, 근무 위치, 복리후생 등 근무 조건을 상세히 입력합니다. 외국인 채용 가능 여부는 자동으로 분석됩니다.',
      },
      {
        title: 'Step 3: 상세 내용',
        titleEn: 'Job Details',
        description:
          '담당 업무, 자격 요건, 우대 사항, 회사 소개 등 공고 상세 내용을 작성합니다.',
      },
      {
        title: 'Step 4: 비자 매칭 확인 (자동)',
        titleEn: 'Visa Matching (Auto)',
        description:
          '입력한 기업 정보를 기반으로 잡차자가 채용 가능한 비자 유형을 자동으로 분석합니다. 별도로 설정할 필요가 없습니다.',
      },
      {
        title: 'Step 5: 미리보기 및 등록',
        titleEn: 'Preview & Publish',
        description:
          '공고 내용을 최종 확인하고 게시합니다. 일반 공고는 무료이며, 프리미엄 공고로 업그레이드할 수 있습니다.',
      },
    ],
    videoPlaceholder: true,
  },
  {
    id: 'applicant-management',
    icon: <Users className="w-6 h-6" />,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    title: '지원자 관리',
    titleEn: 'Applicant Management',
    summary: '지원자 검토, 면접 일정, 합격 처리를 한 곳에서.',
    link: '/company/applicants',
    steps: [
      {
        title: '지원자 목록 확인',
        titleEn: 'View Applicant List',
        description:
          '공고별로 지원자 목록을 확인합니다. 지원자의 비자 유형, 지원일, 상태 등을 한눈에 볼 수 있습니다.',
      },
      {
        title: '이력서 열람 (열람권 사용)',
        titleEn: 'View Resume (Credits)',
        description:
          '지원자 이력서 열람 시 열람권 1건이 사용됩니다. 열람권이 없으면 결제 후 사용 가능합니다.',
      },
      {
        title: '지원자 상태 변경',
        titleEn: 'Update Applicant Status',
        description:
          '지원자를 "서류 검토 중", "면접 제안", "불합격", "최종 합격" 등으로 상태를 변경합니다.',
      },
      {
        title: '면접 일정 관리',
        titleEn: 'Interview Scheduling',
        description:
          '면접 날짜, 시간, 장소를 설정하여 지원자에게 알림을 보낼 수 있습니다.',
      },
    ],
    videoPlaceholder: false,
  },
  {
    id: 'viewing-credits',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    title: '열람권 사용 방법',
    titleEn: 'Viewing Credits',
    summary: '이력서 열람권 구매 및 사용 방법을 확인하세요.',
    link: '/company/payments',
    steps: [
      {
        title: '열람권이란?',
        titleEn: 'What are Viewing Credits?',
        description:
          '지원자의 상세 이력서를 열람하기 위한 유료 크레딧입니다. 1건 열람 시 열람권 1개가 차감됩니다.',
      },
      {
        title: '열람권 구매',
        titleEn: 'Purchase Credits',
        description:
          '마이페이지 → 결제/열람권 메뉴에서 구매합니다. 1건(3,000원)~100건(150,000원) 패키지 중 선택 가능합니다.',
      },
      {
        title: '열람권 사용',
        titleEn: 'Using Credits',
        description:
          '지원자 상세 페이지에서 "이력서 열람하기" 버튼 클릭 시 자동으로 차감됩니다. 한 번 열람한 이력서는 추가 차감 없이 재열람 가능합니다.',
      },
      {
        title: '잔여 열람권 확인',
        titleEn: 'Check Remaining Credits',
        description:
          '대시보드 또는 마이페이지에서 잔여 열람권을 확인할 수 있습니다.',
      },
    ],
    videoPlaceholder: false,
  },
  {
    id: 'visa-matching',
    icon: <Globe className="w-6 h-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    title: '비자 매칭 이해하기',
    titleEn: 'Understanding Visa Matching',
    summary: '잡차자가 외국인 채용 가능 여부를 자동으로 판단하는 원리.',
    link: '/company/visa-guide',
    steps: [
      {
        title: '비자 매칭 원리',
        titleEn: 'How Visa Matching Works',
        description:
          '기업이 공고를 등록하면, 잡차자는 기업 업종, 규모, 고용 형태 등을 기반으로 31가지 비자 유형 각각에 대해 채용 가능 여부를 자동 분석합니다.',
      },
      {
        title: '기업이 할 필요 없는 것',
        titleEn: 'What Companies Don\'t Need to Do',
        description:
          '기업은 어떤 비자 보유자를 채용할 수 있는지 직접 설정할 필요가 없습니다. 잡차자가 알아서 판단합니다.',
      },
      {
        title: '구직자 필터링',
        titleEn: 'Applicant Filtering',
        description:
          '외국인 구직자는 자신의 비자로 지원 가능한 공고만 자동으로 필터링됩니다. 적합하지 않은 지원은 원천 차단됩니다.',
      },
      {
        title: '법령 기반 자동 업데이트',
        titleEn: 'Law-Based Auto Updates',
        description:
          '비자 규칙은 출입국관리법 등 관련 법령에 기반하며, 법령 개정 시 전문가 검토를 거쳐 업데이트됩니다.',
      },
    ],
    videoPlaceholder: false,
  },
];

export default function CompanyGuicePage() {
  /** 현재 펼쳐진 카테고리 ID / Currently expanded category ID */
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /** 카테고리 토글 / Toggle category */
  const toggleCategory = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">이용 가이드</h1>
        </div>
        <p className="text-sm text-gray-500">Usage Guide — 잡차자 기업 서비스를 처음 이용하시나요?</p>
      </div>

      {/* 빠른 시작 배너 / Quick start banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 mb-6 text-white">
        <p className="text-xs font-medium opacity-80 mb-1">Quick Start / 빠른 시작</p>
        <h2 className="text-base font-bold mb-2">
          외국인 채용, 3단계로 시작하세요
        </h2>
        <div className="flex flex-wrap gap-3 mt-3">
          {['1. 기업 가입', '2. 기업 인증', '3. 공고 등록'].map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs bg-white/20 rounded-lg px-3 py-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 가이드 카테고리 카드 목록 / Guide category card list */}
      <div className="space-y-3">
        {GUIDE_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* 카드 헤더 (클릭 시 펼침) / Card header (click to expand) */}
            <button
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition text-left"
            >
              <div className={`w-11 h-11 ${cat.bgColor} rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {cat.title}
                  <span className="text-gray-400 font-normal ml-1.5 text-xs">/ {cat.titleEn}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{cat.summary}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                  expandedId === cat.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* 카드 상세 (펼침) / Card detail (expanded) */}
            {expandedId === cat.id && (
              <div className="px-5 pb-5 border-t border-gray-100">
                {/* 동영상 자리표시자 / Video placeholder */}
                {cat.videoPlaceholder && (
                  <div className="mt-4 mb-5 rounded-xl bg-gray-100 border border-gray-200 flex flex-col items-center justify-center py-10 gap-3">
                    <PlayCircle className="w-10 h-10 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">가이드 영상</p>
                      <p className="text-xs text-gray-400">Guide video coming soon</p>
                    </div>
                  </div>
                )}

                {/* 단계별 가이드 / Step-by-step guide */}
                <div className="space-y-4 mt-4">
                  {cat.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {step.title}
                          <span className="text-gray-400 font-normal ml-1.5 text-xs">/ {step.titleEn}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 관련 페이지 링크 / Related page link */}
                {cat.link && (
                  <div className="mt-5">
                    <Link
                      href={cat.link}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cat.color} hover:underline`}
                    >
                      바로가기 / Go to page
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 추가 문의 안내 / Additional inquiry notice */}
      <div className="mt-6 bg-gray-50 rounded-2xl border border-gray-200 p-5 flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <Building2 className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-0.5">
            가이드에서 원하는 내용을 찾지 못하셨나요?
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Can&apos;t find what you&apos;re looking for? Contact us directly.
          </p>
          <Link
            href="/company/support/inquiry"
            className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            1:1 문의하기 / Submit an Inquiry
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
