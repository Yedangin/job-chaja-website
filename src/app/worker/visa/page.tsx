'use client';

/**
 * 비자센터 메인 페이지 / Visa Center main page
 * - 내 비자 현황 표시 / Display my visa status
 * - 비자별 취업 가능 현황 안내 / Guide to employment eligibility by visa type
 * - 비자 적합 공고 바로가기 / Quick links to eligible job postings
 * - 비자 연장/변경 안내 타임라인 / Visa extension/change guide timeline
 * - 자주 묻는 질문 / FAQ accordion
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  LogIn,
  BadgeCheck,
} from 'lucide-react';

// ── 타입 정의 / Type definitions ────────────────────────────────────────────

/** 프로필 응답 타입 / Profile response type */
interface ProfileData {
  id: string;
  email: string;
  name: string;
  visaType?: string;
  visaStatus?: string;
}

/** 비자 카드 정보 / Visa card info */
interface VisaInfo {
  code: string;           // 비자 코드 / Visa code (e.g. "E-9")
  nameKo: string;         // 한국어 명칭 / Korean name
  nameEn: string;         // 영문 명칭 / English name
  descKo: string;         // 한 줄 설명 (한국어) / Short description (Korean)
  tags: string[];         // 특징 태그 / Feature tags
  color: string;          // 카드 테마 색상 클래스 / Card theme color class
  badgeColor: string;     // 배지 색상 클래스 / Badge color class
}

/** FAQ 항목 / FAQ item */
interface FaqItem {
  q: string;              // 질문 / Question
  a: string;              // 답변 / Answer
}

/** 타임라인 단계 / Timeline step */
interface TimelineStep {
  step: number;
  titleKo: string;
  descKo: string;
  icon: React.ReactNode;
}

// ── 정적 데이터 / Static data ────────────────────────────────────────────────

/**
 * 주요 취업 비자 목록 / Major work visa list
 * 잡차자는 특정 비자 우선권 없이 전체 비자를 균등 표시 / No visa priority; all visas shown equally
 */
const VISA_LIST: VisaInfo[] = [
  {
    code: 'E-9',
    nameKo: '비전문취업',
    nameEn: 'Non-professional Employment',
    descKo: '제조업, 농축산업, 어업 등 지정 업종에 취업 가능',
    tags: ['제조업', '농축산업', '어업', '건설업'],
    color: 'border-blue-200 bg-blue-50 hover:border-blue-400',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    code: 'E-7',
    nameKo: '특정활동',
    nameEn: 'Special Occupation',
    descKo: '법무부 고시 특정 직종에 한해 전문직 취업 허용',
    tags: ['IT', '연구', '전문직', '요리사'],
    color: 'border-purple-200 bg-purple-50 hover:border-purple-400',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    code: 'H-2',
    nameKo: '방문취업',
    nameEn: 'Working Visit',
    descKo: '중국·구소련 동포 대상, 서비스업 등 폭넓은 취업 허용',
    tags: ['동포', '서비스업', '제조업', '건설업'],
    color: 'border-orange-200 bg-orange-50 hover:border-orange-400',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  {
    code: 'F-2',
    nameKo: '거주',
    nameEn: '거주 (Residence)',
    descKo: '결혼이민자 자녀, 난민 등 거주 자격으로 자유 취업',
    tags: ['자유취업', '거주자격', '제한없음'],
    color: 'border-green-200 bg-green-50 hover:border-green-400',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    code: 'F-4',
    nameKo: '재외동포',
    nameEn: 'Overseas Korean',
    descKo: '한국 국적 취득 가능 해외 동포, 단순노무직 외 자유 취업',
    tags: ['동포', '자유취업', '단순노무제외'],
    color: 'border-teal-200 bg-teal-50 hover:border-teal-400',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
  {
    code: 'F-5 / F-6',
    nameKo: '영주 / 결혼이민',
    nameEn: 'Permanent Resident / Marriage Migrant',
    descKo: '영주권자 및 한국인 배우자, 취업 제한 없음',
    tags: ['영주권', '결혼이민', '제한없음', '자유취업'],
    color: 'border-rose-200 bg-rose-50 hover:border-rose-400',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
];

/**
 * 비자 연장/변경 안내 타임라인 / Visa extension/change guide timeline
 */
const TIMELINE_STEPS: TimelineStep[] = [
  {
    step: 1,
    titleKo: '만료일 확인',
    descKo: '여권·체류카드의 비자 만료일을 확인하세요. 만료 3개월 전부터 준비를 시작하는 것이 안전합니다.',
    icon: <Clock className="w-5 h-5 text-blue-600" />,
  },
  {
    step: 2,
    titleKo: '필요 서류 준비',
    descKo: '체류자격에 따라 요구 서류가 다릅니다. 고용계약서, 재직증명서, 납세증명서 등을 미리 준비하세요.',
    icon: <FileText className="w-5 h-5 text-blue-600" />,
  },
  {
    step: 3,
    titleKo: '출입국관리사무소 방문 / 온라인 신청',
    descKo: '관할 출입국관리사무소를 방문하거나 Hi Korea(하이코리아) 홈페이지에서 온라인으로 신청할 수 있습니다.',
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
  },
  {
    step: 4,
    titleKo: '심사 및 결과 통보',
    descKo: '심사 기간은 보통 2~4주 소요됩니다. 결과는 문자 또는 방문으로 확인할 수 있습니다.',
    icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
  },
];

/**
 * 자주 묻는 질문 목록 / FAQ list
 */
const FAQ_LIST: FaqItem[] = [
  {
    q: 'E-9 비자로 아르바이트(단기 알바)를 할 수 있나요?',
    a: 'E-9(비전문취업) 비자는 고용허가제를 통해 지정된 사업장에서만 근무할 수 있으며, 허가받지 않은 사업장에서의 취업(아르바이트 포함)은 불법입니다. 반드시 지정 사업장 내에서만 근무하세요.',
  },
  {
    q: '비자 만료 전에 연장 신청을 안 하면 어떻게 되나요?',
    a: '비자가 만료된 상태로 국내에 체류하면 불법 체류가 되어 강제 출국 및 일정 기간 입국 금지 처분을 받을 수 있습니다. 반드시 만료일 전에 연장 신청을 하세요.',
  },
  {
    q: 'F-4(재외동포) 비자로 단순노무직에 취업할 수 없다고 들었는데, 어떤 직종이 해당되나요?',
    a: '단순노무직(제조업 단순 조립·포장, 청소, 경비 등 단순 반복 업무)은 F-4 비자로 취업이 제한됩니다. 잡차자는 공고 등록 시 해당 여부를 자동으로 판별해 드립니다.',
  },
  {
    q: '취업 비자로 부업(투잡)이 가능한가요?',
    a: '대부분의 취업 비자(E-7, E-9 등)는 허가된 사업장 1곳에서만 취업이 가능합니다. F-2, F-4, F-5, F-6 등 거주·동포·영주 계열 비자는 취업 활동에 별다른 제한이 없어 복수 취업이 가능합니다.',
  },
  {
    q: '공고에 "비자 매칭됨" 표시가 없으면 지원할 수 없나요?',
    a: '비자 매칭 여부는 잡차자 시스템이 법령 기반으로 자동 분석한 결과입니다. 매칭이 되지 않은 공고라도 법령 해석에 따라 지원 가능성이 있을 수 있으니, 불명확한 경우 반드시 출입국관리사무소나 전문 행정사에게 문의하세요.',
  },
  {
    q: '비자인증은 왜 해야 하나요?',
    a: '비자인증을 완료하면 기업이 내 체류자격을 신뢰할 수 있어 채용 가능성이 높아집니다. 또한 비자 매칭 필터링이 정확하게 적용되어, 내 비자로 지원 가능한 공고만 골라서 볼 수 있습니다.',
  },
];

// ── 서브 컴포넌트 / Sub-components ────────────────────────────────────────────

/**
 * 비자 카드 컴포넌트 / Visa info card component
 */
function VisaCard({ visa }: { visa: VisaInfo }) {
  return (
    <div
      className={`rounded-2xl border p-5 transition cursor-default select-none ${visa.color}`}
    >
      {/* 비자 코드 배지 / Visa code badge */}
      <span
        className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${visa.badgeColor}`}
      >
        {visa.code}
      </span>

      {/* 비자 명칭 / Visa name */}
      <h3 className="text-base font-bold text-gray-900 mb-0.5">{visa.nameKo}</h3>
      <p className="text-xs text-gray-500 mb-3">{visa.nameEn}</p>

      {/* 한 줄 설명 / Short description */}
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{visa.descKo}</p>

      {/* 특징 태그 / Feature tags */}
      <div className="flex flex-wrap gap-1.5">
        {visa.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-white/60 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * FAQ 아코디언 항목 / FAQ accordion item
 */
function FaqAccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* 질문 버튼 / Question button */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left bg-white hover:bg-gray-50 transition"
      >
        <span className="text-sm font-semibold text-gray-800 leading-relaxed">
          {item.q}
        </span>
        {/* 열림/닫힘 아이콘 / Open/close icon */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 답변 영역 / Answer area */}
      {isOpen && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  );
}

/**
 * 타임라인 단계 컴포넌트 / Timeline step component
 */
function TimelineStepItem({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  return (
    <div className="flex gap-4">
      {/* 왼쪽 인디케이터 / Left indicator */}
      <div className="flex flex-col items-center">
        {/* 원형 아이콘 / Circle icon */}
        <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center shrink-0">
          {step.icon}
        </div>
        {/* 연결선 (마지막 단계 제외) / Connector line (except last) */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-blue-100 mt-2 mb-0 min-h-6" />
        )}
      </div>

      {/* 내용 / Content */}
      <div className="pb-6">
        {/* 단계 번호 + 제목 / Step number + title */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            STEP {step.step}
          </span>
          <h4 className="text-sm font-bold text-gray-900">{step.titleKo}</h4>
        </div>
        {/* 설명 / Description */}
        <p className="text-sm text-gray-600 leading-relaxed">{step.descKo}</p>
      </div>
    </div>
  );
}

// ── 메인 페이지 컴포넌트 / Main page component ───────────────────────────────

export default function WorkerVisaPage() {
  // 프로필 데이터 / Profile data
  const [profile, setProfile] = useState<ProfileData | null>(null);
  // 프로필 로딩 상태 / Profile loading state
  const [profileLoading, setProfileLoading] = useState(true);
  // 로그인 여부 / Whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 열린 FAQ 인덱스 / Open FAQ index (null if all closed)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 마운트 시 프로필 로드 / Load profile on mount
  useEffect(() => {
    const load = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        // 세션 없음 → 미로그인 / No session → not logged in
        setProfileLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/my/profile', {
          headers: { Authorization: `Bearer ${sessionId}` },
        });

        if (res.ok) {
          const data = await res.json() as ProfileData;
          setProfile(data);
          setIsLoggedIn(true);
        } else if (res.status === 401) {
          // 인증 만료 / Auth expired
          setIsLoggedIn(false);
        }
      } catch {
        // 네트워크 오류 무시 (정적 콘텐츠는 계속 표시) / Ignore network errors (static content still shown)
      } finally {
        setProfileLoading(false);
      }
    };

    load();
  }, []);

  // FAQ 토글 핸들러 / FAQ toggle handler
  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // ── 렌더링 / Render ────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-10">

      {/* ── 섹션 1: 내 비자 현황 카드 / Section 1: My visa status card ─────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">내 비자 현황</h2>
          <span className="text-xs text-gray-400">My Visa Status</span>
        </div>

        {profileLoading ? (
          /* 로딩 스켈레톤 / Loading skeleton */
          <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </div>
        ) : isLoggedIn && profile ? (
          /* 로그인 + 프로필 있음 / Logged in with profile */
          <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-blue-100 text-sm mb-1">현재 체류자격 / Current Visa Status</p>
                {/* 비자 타입 표시 / Display visa type */}
                {profile.visaType ? (
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck className="w-5 h-5 text-blue-200" />
                    <span className="text-2xl font-bold">{profile.visaType}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-300" />
                    <span className="text-lg font-semibold text-blue-100">
                      비자 정보 미등록
                    </span>
                  </div>
                )}
                <p className="text-blue-200 text-sm">{profile.name}님</p>
              </div>

              {/* 비자인증 페이지 이동 / Link to visa verification */}
              <Link
                href="/worker/visa-verification"
                className="shrink-0 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
              >
                비자인증
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 비자 미등록 시 안내 / Guide when visa not registered */}
            {!profile.visaType && (
              <div className="mt-4 bg-white/10 rounded-xl px-4 py-3">
                <p className="text-sm text-blue-100">
                  비자인증을 완료하면 내 비자로 지원 가능한 공고만 필터링할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* 미로그인 상태 / Not logged in */
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <LogIn className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  로그인하면 내 비자 현황을 확인할 수 있습니다
                </p>
                <p className="text-xs text-gray-400">
                  Log in to view your visa status and get personalized job matches.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="shrink-0 flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                로그인
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ── 섹션 2: 비자별 취업 가능 현황 / Section 2: Employment eligibility by visa ── */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-gray-900">비자별 취업 가능 현황</h2>
          <span className="text-xs text-gray-400">Visa Employment Guide</span>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          주요 체류자격별 취업 허용 범위를 확인하세요. 실제 적용은 법령 및 개별 상황에 따라 달라질 수 있습니다.
        </p>

        {/* 비자 카드 그리드 / Visa card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VISA_LIST.map((visa) => (
            <VisaCard key={visa.code} visa={visa} />
          ))}
        </div>

        {/* 면책 안내 / Disclaimer notice */}
        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            위 정보는 일반적인 안내 목적입니다. 개별 취업 가능 여부는 출입국관리사무소 또는 전문 행정사에게 반드시 확인하세요.
          </p>
        </div>
      </section>

      {/* ── 섹션 3: 비자 적합 공고 바로가기 / Section 3: Quick links to eligible jobs ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">내 비자로 지원 가능한 공고</h2>
          <span className="text-xs text-gray-400">Eligible Jobs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 알바 채용관 / Part-time jobs */}
          <Link
            href="/worker/alba?eligibleOnly=true"
            className="group flex items-center justify-between bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-2xl px-5 py-5 transition"
          >
            <div>
              <p className="text-xs text-gray-400 mb-1">알바 / Part-time</p>
              <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition">
                알바 공고 보기
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                내 비자로 지원 가능한 알바 공고
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition shrink-0" />
          </Link>

          {/* 정규직 채용관 / Full-time jobs */}
          <Link
            href="/worker/regular?eligibleOnly=true"
            className="group flex items-center justify-between bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-2xl px-5 py-5 transition"
          >
            <div>
              <p className="text-xs text-gray-400 mb-1">정규직 / Full-time</p>
              <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition">
                정규직 공고 보기
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                내 비자로 지원 가능한 정규직 공고
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition shrink-0" />
          </Link>
        </div>

        {/* 미로그인 안내 배너 / Not logged in guide banner */}
        {!isLoggedIn && !profileLoading && (
          <div className="mt-3 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              로그인 및 비자인증 후에는 내 비자에 맞는 공고만 필터링하여 볼 수 있습니다.
            </p>
          </div>
        )}
      </section>

      {/* ── 섹션 4: 비자 연장/변경 안내 / Section 4: Visa extension/change guide ── */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">비자 연장 / 변경 안내</h2>
          <span className="text-xs text-gray-400">Extension & Change Guide</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          비자 만료 3개월 전부터 준비를 시작하세요. 만료 후 체류는 불법 체류에 해당합니다.
        </p>

        {/* 타임라인 / Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {TIMELINE_STEPS.map((step, idx) => (
            <TimelineStepItem
              key={step.step}
              step={step}
              isLast={idx === TIMELINE_STEPS.length - 1}
            />
          ))}
        </div>

        {/* 외부 링크 / External links */}
        <div className="mt-4 flex flex-wrap gap-3">
          {/* 하이코리아 (출입국·외국인 포털) / Hi Korea immigration portal */}
          <a
            href="https://www.hikorea.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition"
          >
            <ExternalLink className="w-4 h-4" />
            하이코리아(HiKorea) 바로가기
          </a>

          {/* 출입국관리사무소 찾기 / Find immigration office */}
          <a
            href="https://www.immigration.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition"
          >
            <ExternalLink className="w-4 h-4" />
            출입국관리사무소 찾기
          </a>
        </div>
      </section>

      {/* ── 섹션 5: 자주 묻는 질문 / Section 5: FAQ ────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-gray-900">자주 묻는 질문</h2>
          <span className="text-xs text-gray-400">FAQ</span>
        </div>

        {/* FAQ 아코디언 / FAQ accordion */}
        <div className="space-y-2">
          {FAQ_LIST.map((item, idx) => (
            <FaqAccordionItem
              key={idx}
              item={item}
              isOpen={openFaqIndex === idx}
              onToggle={() => toggleFaq(idx)}
            />
          ))}
        </div>

        {/* 추가 문의 링크 / Additional inquiry link */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              더 궁금한 점이 있으신가요?
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              출입국관리사무소 또는 잡차자 고객센터에 문의하세요.
            </p>
          </div>
          <Link
            href="/worker/support"
            className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            문의하기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
