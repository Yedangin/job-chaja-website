'use client';

/**
 * 기업회원 자주 묻는 질문 (FAQ) 페이지
 * Company FAQ page with category tabs, accordion items, and search
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  MessageSquare,
  X,
} from 'lucide-react';

// ── 타입 정의 / Type definitions ──────────────────────────────────────────────

// FAQ 카테고리 / FAQ category
type FaqCategory =
  | 'all'
  | 'account'
  | 'job-posting'
  | 'payment'
  | 'visa-matching'
  | 'other';

// FAQ 항목 / Single FAQ item
interface FaqItem {
  id: number;
  category: Exclude<FaqCategory, 'all'>;
  question: string;
  answer: string;
}

// ── 카테고리 탭 설정 / Category tab config ─────────────────────────────────────

const CATEGORY_TABS: { key: FaqCategory; label: string; labelEn: string }[] = [
  { key: 'all', label: '전체', labelEn: 'All' },
  { key: 'account', label: '가입/인증', labelEn: 'Signup/Verification' },
  { key: 'job-posting', label: '공고등록', labelEn: 'Job Posting' },
  { key: 'payment', label: '결제/열람권', labelEn: 'Payment/Credits' },
  { key: 'visa-matching', label: '비자매칭', labelEn: 'Visa Matching' },
  { key: 'other', label: '기타', labelEn: 'Other' },
];

// ── 더미 FAQ 데이터 / Dummy FAQ data ──────────────────────────────────────────

const FAQ_DATA: FaqItem[] = [
  // 가입/인증 / Account & Verification
  {
    id: 1,
    category: 'account',
    question: '기업인증은 어떻게 하나요?',
    answer:
      '기업인증은 [기업 프로필 > 기업인증] 메뉴에서 진행할 수 있습니다. 사업자등록증, 대표자 신분증 등 필요 서류를 업로드하면 영업일 기준 1~2일 내에 심사 결과를 이메일로 안내드립니다.\n\nTo verify your company, go to [Company Profile > Verification] and upload your business registration certificate and ID. Results are delivered within 1–2 business days.',
  },
  {
    id: 2,
    category: 'account',
    question: '기업인증이 반려된 경우 어떻게 하나요?',
    answer:
      '반려 사유를 확인한 후 해당 서류를 수정하여 재제출하시면 됩니다. [기업 프로필 > 기업인증] 페이지에서 반려 사유를 항목별로 확인하실 수 있습니다.\n\nIf your verification is rejected, review the rejection reason and resubmit the corrected documents via [Company Profile > Verification].',
  },
  {
    id: 3,
    category: 'account',
    question: '기업 담당자 계정을 추가할 수 있나요?',
    answer:
      '네, [마이페이지 > 팀 관리] 메뉴에서 담당자를 초대할 수 있습니다. 초대받은 담당자는 이메일을 통해 계정을 활성화할 수 있습니다.\n\nYes, you can invite team members via [My Page > Team Management]. Invitees activate their accounts through the invitation email.',
  },
  // 공고등록 / Job Posting
  {
    id: 4,
    category: 'job-posting',
    question: '공고 등록 후 수정이 가능한가요?',
    answer:
      '네, 게시 중인 공고도 수정할 수 있습니다. 단, 근무조건이나 회사 정보가 크게 변경된 경우 비자 매칭 결과가 자동으로 재계산됩니다.\n\nYes, you can edit active job postings. If working conditions or company info change significantly, visa matching results will be automatically recalculated.',
  },
  {
    id: 5,
    category: 'job-posting',
    question: '등록 가능한 공고 수는 몇 개인가요?',
    answer:
      '기업인증이 완료된 경우 공고 수에 제한이 없습니다. 단, 기업인증 미완료 상태에서는 공고를 게시할 수 없습니다.\n\nThere is no limit on the number of job postings for verified companies. Unverified companies cannot publish postings.',
  },
  {
    id: 6,
    category: 'job-posting',
    question: '공고가 자동으로 만료되나요?',
    answer:
      '네, 일반 공고의 경우 알바는 14일, 정규직은 30일 후 자동 만료됩니다. 만료 3일 전에 이메일 알림을 발송해 드립니다. 프리미엄 공고는 설정한 마감일에 만료됩니다.\n\nYes. Standard part-time postings expire after 14 days and full-time after 30 days. You\'ll receive an email reminder 3 days before expiration.',
  },
  {
    id: 7,
    category: 'job-posting',
    question: '프리미엄 공고란 무엇인가요?',
    answer:
      '프리미엄 공고는 검색 결과 상단에 노출되며, 구직자 눈에 잘 띄도록 강조 표시됩니다. 프리미엄 업그레이드는 공고당 50,000원이며, 기존 공고의 tier를 변경하는 방식으로 결제합니다.\n\nPremium postings appear at the top of search results with highlighted styling. Upgrade costs ₩50,000 per posting and is applied to existing postings.',
  },
  {
    id: 8,
    category: 'job-posting',
    question: '공고 임시저장 기능이 있나요?',
    answer:
      '네, 기업인증 대기 중이거나 작성 중인 공고는 임시저장할 수 있습니다. 임시저장된 공고는 [공고 관리 > 임시저장] 탭에서 확인할 수 있습니다.\n\nYes, draft postings are saved automatically and accessible via [Job Management > Drafts].',
  },
  // 결제/열람권 / Payment & Credits
  {
    id: 9,
    category: 'payment',
    question: '열람권은 어떻게 사용하나요?',
    answer:
      '인재 열람권은 외국인 지원자의 상세 이력서를 확인할 때 사용됩니다. 지원자 목록에서 상세 프로필 보기를 누르면 열람권 1건이 차감됩니다. 열람권은 [결제 > 열람권 구매]에서 구매할 수 있습니다.\n\nViewing credits are used to access detailed applicant resumes. 1 credit is deducted each time you view a full profile. Purchase credits via [Payment > Buy Credits].',
  },
  {
    id: 10,
    category: 'payment',
    question: '열람권의 유효기간은 얼마나 되나요?',
    answer:
      '구매한 열람권은 구매일로부터 1년간 유효합니다. 유효기간 만료 30일 전에 이메일 알림을 발송해 드립니다.\n\nPurchased viewing credits are valid for 1 year from the date of purchase. You\'ll receive an email reminder 30 days before expiration.',
  },
  {
    id: 11,
    category: 'payment',
    question: '결제 취소 및 환불은 어떻게 하나요?',
    answer:
      '결제 후 7일 이내, 미사용 상품에 한해 환불이 가능합니다. [마이페이지 > 결제 내역]에서 환불 신청을 하거나, 고객센터 1:1 문의를 통해 접수해 주세요.\n\nRefunds are available within 7 days of purchase for unused products. Apply via [My Page > Payment History] or through our 1:1 inquiry.',
  },
  // 비자매칭 / Visa Matching
  {
    id: 12,
    category: 'visa-matching',
    question: '비자 매칭은 어떻게 작동하나요?',
    answer:
      '기업이 공고 등록 시 입력한 회사 정보(업종, 규모, 인력현황 등)와 근무조건을 기반으로, 잡차자의 비자 매칭 엔진이 31개 비자 유형에 대해 채용 가능 여부를 자동 분석합니다. 기업이 비자를 직접 선택하지 않아도 됩니다.\n\nJobchaja\'s visa matching engine automatically analyzes which of 31 visa types can be hired, based on your company info and job conditions. You don\'t need to manually select visa types.',
  },
  {
    id: 13,
    category: 'visa-matching',
    question: '외국인 지원자의 비자를 어떻게 확인하나요?',
    answer:
      '잡차자에서 지원자의 비자 인증을 대행합니다. 지원자가 체류자격 인증을 완료하면, 지원서에 인증된 비자 정보가 표시됩니다. 추가로 인재 열람권을 사용하면 상세 비자 정보를 확인할 수 있습니다.\n\nJobchaja handles visa verification for applicants. Once an applicant completes visa verification, their certified visa type is shown on the application. Use viewing credits to see detailed visa information.',
  },
  {
    id: 14,
    category: 'visa-matching',
    question: '비자 매칭 결과가 "채용 불가"로 나왔는데 실제로 채용할 수 있는 비자가 없나요?',
    answer:
      '비자 매칭은 현행 출입국관리법령 및 고용허가제 규정에 따라 자동 분석됩니다. "채용 불가" 결과는 현재 회사 정보와 근무조건 기준으로 법적으로 허용되지 않음을 의미합니다. 회사 정보나 근무조건을 변경하면 결과가 달라질 수 있으며, 법률 전문가 자문을 권장드립니다.\n\nVisa matching is based on current immigration laws. A "Not eligible" result means the hire is not legally permitted under current conditions. Changing company info or job conditions may yield different results. We recommend consulting a legal expert.',
  },
  // 기타 / Other
  {
    id: 15,
    category: 'other',
    question: '서비스 이용 중 오류가 발생하면 어떻게 하나요?',
    answer:
      '1:1 문의하기를 통해 오류 내용, 발생 시간, 스크린샷 등을 첨부하여 문의해 주시면 빠르게 도움을 드리겠습니다. 긴급한 경우 이메일(support@jobchaja.com)로도 접수 가능합니다.\n\nSubmit a 1:1 inquiry with details about the error, time of occurrence, and screenshots. For urgent issues, email us at support@jobchaja.com.',
  },
  {
    id: 16,
    category: 'other',
    question: '모바일 앱도 제공하나요?',
    answer:
      '네, iOS 및 Android 앱을 제공합니다. App Store 또는 Google Play에서 "잡차자"를 검색하여 다운로드할 수 있습니다.\n\nYes, we offer iOS and Android apps. Search "JobChaja" on the App Store or Google Play.',
  },
  {
    id: 17,
    category: 'other',
    question: '회원 탈퇴 시 데이터는 어떻게 되나요?',
    answer:
      '회원 탈퇴 후 개인정보는 관련 법령에 따라 일정 기간 보관 후 삭제됩니다. 게시된 공고는 즉시 비공개 처리되며, 지원자 데이터는 법령이 정한 기간 동안 보관됩니다.\n\nUpon withdrawal, personal data is retained for a legally required period then deleted. Job postings are immediately made private, and applicant data is retained as required by law.',
  },
];

// ── 유틸리티 / Utilities ───────────────────────────────────────────────────────

/**
 * 줄바꿈을 <br>로 치환하여 표시
 * Replace newlines with line break rendering
 */
function renderAnswer(text: string) {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ));
}

// ── 서브 컴포넌트 / Sub components ────────────────────────────────────────────

/** 카테고리 탭 / Category tab */
function CategoryTabs({
  active,
  onChange,
  counts,
}: {
  active: FaqCategory;
  onChange: (c: FaqCategory) => void;
  counts: Record<FaqCategory, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {CATEGORY_TABS.map((tab) => {
        const isActive = active === tab.key;
        const count = counts[tab.key];
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {tab.label}
            {/* 항목 수 배지 / Item count badge */}
            {count > 0 && (
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** 아코디언 항목 / Single accordion item */
function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  // 카테고리 라벨 찾기 / Find category label
  const cat = CATEGORY_TABS.find((t) => t.key === item.category);

  return (
    <div
      className={`border rounded-xl transition-all ${
        isOpen
          ? 'border-blue-200 bg-blue-50/30'
          : 'border-gray-200 bg-white hover:border-blue-200'
      }`}
    >
      {/* 질문 헤더 / Question header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-5 py-4 text-left"
      >
        {/* Q 아이콘 / Q icon */}
        <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
          Q
        </span>

        <div className="flex-1 min-w-0">
          {/* 카테고리 배지 / Category badge */}
          {cat && cat.key !== 'all' && (
            <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full mb-1.5">
              {cat.label}
            </span>
          )}
          {/* 질문 텍스트 / Question text */}
          <p className="text-sm font-semibold text-gray-900 leading-relaxed">
            {item.question}
          </p>
        </div>

        {/* 토글 아이콘 / Toggle icon */}
        <span className="shrink-0 text-gray-400 mt-0.5">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-blue-500" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </span>
      </button>

      {/* 답변 패널 / Answer panel */}
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="flex items-start gap-3 bg-white rounded-xl border border-blue-100 p-4">
            {/* A 아이콘 / A icon */}
            <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold mt-0.5">
              A
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {renderAnswer(item.answer)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** 검색 결과 없음 / Empty search state */
function EmptySearch({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 py-14 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <HelpCircle className="w-7 h-7 text-gray-300" />
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">
        &quot;{query}&quot;에 대한 결과가 없습니다
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        다른 검색어를 시도하거나 1:1 문의를 남겨주세요.
        <br />
        No results found. Try a different search or contact us.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-blue-600 underline"
      >
        검색 초기화 / Clear search
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 / Main page
// ══════════════════════════════════════════════════════════════════════════════
export default function CompanyFaqPage() {
  // 선택된 카테고리 / Selected category
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  // 검색어 / Search query
  const [searchQuery, setSearchQuery] = useState('');
  // 열려있는 아코디언 ID / Open accordion item ID
  const [openId, setOpenId] = useState<number | null>(null);

  // 카테고리별 항목 수 / Item count per category
  const counts = useMemo<Record<FaqCategory, number>>(() => {
    const base: Record<FaqCategory, number> = {
      all: FAQ_DATA.length,
      account: 0,
      'job-posting': 0,
      payment: 0,
      'visa-matching': 0,
      other: 0,
    };
    FAQ_DATA.forEach((item) => {
      base[item.category] += 1;
    });
    return base;
  }, []);

  // 필터링 결과 / Filtered items
  const filteredItems = useMemo(() => {
    let items = FAQ_DATA;

    // 카테고리 필터 / Category filter
    if (activeCategory !== 'all') {
      items = items.filter((item) => item.category === activeCategory);
    }

    // 검색어 필터 (질문 텍스트 기준) / Search filter on question text
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  // 아코디언 토글 / Toggle accordion
  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // 검색어 변경 시 아코디언 닫기 / Close accordion on search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setOpenId(null);
  };

  // 카테고리 변경 / Category change
  const handleCategoryChange = (cat: FaqCategory) => {
    setActiveCategory(cat);
    setOpenId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">자주 묻는 질문</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Frequently Asked Questions
        </p>
      </div>

      {/* 검색 바 / Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="궁금한 내용을 검색해보세요 / Search your question..."
          className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
        />
        {/* 검색어 지우기 버튼 / Clear search button */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 카테고리 탭 / Category tabs */}
      <CategoryTabs
        active={activeCategory}
        onChange={handleCategoryChange}
        counts={counts}
      />

      {/* FAQ 목록 / FAQ list */}
      {filteredItems.length === 0 ? (
        <EmptySearch
          query={searchQuery}
          onClear={() => {
            setSearchQuery('');
            setActiveCategory('all');
          }}
        />
      ) : (
        <div className="space-y-3 mb-10">
          {filteredItems.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      )}

      {/* 하단 1:1 문의 CTA / Bottom 1:1 inquiry CTA */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              원하는 답변을 찾지 못하셨나요?
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              1:1 문의로 직접 문의하시면 빠르게 도와드립니다.
              <br />
              Can&apos;t find what you need? Contact us directly.
            </p>
          </div>
        </div>
        {/* 1:1 문의 링크 / 1:1 inquiry link */}
        <Link
          href="/company/support/inquiry"
          className="shrink-0 inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          <MessageSquare className="w-4 h-4" />
          1:1 문의하기
        </Link>
      </div>
    </div>
  );
}
