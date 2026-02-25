'use client';

/**
 * 기업회원 공지사항 페이지
 * Company notices page with pinned notices, inline expand, search, and pagination
 */

import { useState, useMemo } from 'react';
import {
  Bell,
  Search,
  ChevronDown,
  ChevronUp,
  Pin,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ── 타입 정의 / Type definitions ──────────────────────────────────────────────

// 공지 카테고리 / Notice category
type NoticeCategory = 'notice' | 'update' | 'maintenance';

// 공지 항목 / Single notice item
interface Notice {
  id: number;
  category: NoticeCategory;
  title: string;
  date: string;         // 날짜 문자열 / Date string YYYY.MM.DD
  pinned: boolean;      // 중요 공지 상단 고정 / Important notice pinned to top
  content: string;      // 상세 내용 / Detail content
}

// ── 카테고리 배지 설정 / Category badge config ──────────────────────────────

const CATEGORY_CONFIG: Record<
  NoticeCategory,
  { label: string; labelEn: string; color: string }
> = {
  notice: {
    label: '공지',
    labelEn: 'Notice',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  update: {
    label: '업데이트',
    labelEn: 'Update',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  maintenance: {
    label: '점검',
    labelEn: 'Maintenance',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
};

// ── 더미 공지 데이터 / Dummy notice data ──────────────────────────────────────

const NOTICE_DATA: Notice[] = [
  // 중요 공지 (상단 고정) / Pinned important notices
  {
    id: 1,
    category: 'notice',
    title: '[중요] 개인정보처리방침 개정 안내 (2026년 3월 1일 시행)',
    date: '2026.02.20',
    pinned: true,
    content:
      '안녕하세요, 잡차자입니다.\n\n2026년 3월 1일부로 개인정보처리방침이 개정됩니다. 주요 변경 사항은 다음과 같습니다.\n\n1. 개인정보 보유 기간 세분화\n2. 제3자 제공 항목 명확화\n3. 이용자 권리 행사 절차 간소화\n\n개정된 방침은 시행일 이후 서비스 이용 시 자동 적용됩니다. 자세한 내용은 [개인정보처리방침]에서 확인하시기 바랍니다.\n\n감사합니다.',
  },
  {
    id: 2,
    category: 'notice',
    title: '[중요] 기업인증 서류 제출 양식 변경 안내',
    date: '2026.02.15',
    pinned: true,
    content:
      '안녕하세요, 잡차자입니다.\n\n2026년 2월 18일부터 기업인증 서류 제출 양식이 변경됩니다.\n\n변경 사항:\n- 사업자등록증 사본 해상도 기준 상향 (300DPI 이상)\n- 대표자 신분증 뒷면 추가 제출 필요\n- 법인의 경우 법인등기부등본 3개월 이내 발급본 제출\n\n기존에 인증 완료된 기업은 영향 없습니다. 신규 인증 신청 시 변경된 양식을 따라주시기 바랍니다.',
  },
  // 일반 공지 / Regular notices
  {
    id: 3,
    category: 'update',
    title: '잡차자 v2.5.0 업데이트 안내 - 비자 매칭 엔진 고도화',
    date: '2026.02.10',
    pinned: false,
    content:
      '잡차자 v2.5.0이 출시되었습니다.\n\n주요 업데이트 내용:\n\n[비자 매칭 엔진]\n- E-9 비자 업종별 쿼터 자동 반영 기능 추가\n- F-2 거주 비자 점수제 계산 로직 개선\n- D-8 기업투자 비자 판단 기준 업데이트 (2026 개정 법령 반영)\n\n[UI/UX 개선]\n- 공고 등록 5단계 위자드 로딩 속도 개선\n- 지원자 목록 필터 옵션 추가\n- 모바일 반응형 레이아웃 개선\n\n문의사항이 있으시면 1:1 문의를 이용해 주세요.',
  },
  {
    id: 4,
    category: 'maintenance',
    title: '[점검 완료] 2026년 2월 서버 정기 점검',
    date: '2026.02.05',
    pinned: false,
    content:
      '2026년 2월 5일(수) 02:00 ~ 04:00에 예정된 서버 정기 점검이 완료되었습니다.\n\n점검 항목:\n- DB 인덱스 최적화\n- SSL 인증서 갱신\n- 백업 시스템 점검\n\n점검 중 불편을 드려 죄송합니다. 감사합니다.',
  },
  {
    id: 5,
    category: 'update',
    title: '인재 열람권 패키지 추가 및 가격 정책 안내',
    date: '2026.01.28',
    pinned: false,
    content:
      '2026년 2월 1일부터 인재 열람권 패키지가 개편됩니다.\n\n[변경된 패키지]\n- 1건: 3,000원 (동일)\n- 5건: 13,500원 (10% 할인)\n- 10건: 25,000원 (17% 할인)\n- 30건: 69,000원 (23% 할인)\n- 50건: 105,000원 (30% 할인)\n- 100건: 150,000원 (50% 할인)\n\n기존 구매한 열람권은 그대로 사용하실 수 있습니다.',
  },
  {
    id: 6,
    category: 'notice',
    title: '2026년 설 연휴 고객센터 운영 안내',
    date: '2026.01.20',
    pinned: false,
    content:
      '2026년 설 연휴 기간 동안 고객센터 운영이 아래와 같이 변경됩니다.\n\n- 1월 28일(수) ~ 1월 30일(금): 이메일 응대만 운영\n- 1월 31일(토) ~ 2월 2일(월): 휴무\n- 2월 3일(화)부터 정상 운영\n\n긴급 문의는 support@jobchaja.com으로 보내주시면 연휴 이후 순차적으로 처리됩니다.',
  },
  {
    id: 7,
    category: 'update',
    title: '소셜 로그인 Apple 계정 연동 기능 출시',
    date: '2026.01.15',
    pinned: false,
    content:
      'Apple ID를 통한 소셜 로그인이 추가되었습니다.\n\n기존 이메일 계정에 Apple ID를 연동하거나, Apple ID로 신규 가입하실 수 있습니다.\n\n[사용 방법]\n1. 회원가입 또는 로그인 화면에서 "Apple로 계속하기" 선택\n2. Apple ID 인증 완료\n3. 기업 또는 개인 회원 선택 후 가입 완료\n\niOS 13 이상, macOS Catalina 이상에서 이용 가능합니다.',
  },
  {
    id: 8,
    category: 'maintenance',
    title: '[사전 안내] 3월 정기 점검 예정 (3월 5일 새벽 2시)',
    date: '2026.02.25',
    pinned: false,
    content:
      '2026년 3월 5일(수) 02:00 ~ 04:00 (2시간) 동안 서버 정기 점검이 예정되어 있습니다.\n\n점검 중에는 서비스 이용이 불가합니다. 점검 완료 후 즉시 서비스가 재개됩니다.\n\n불편을 드려 죄송합니다. 감사합니다.',
  },
  {
    id: 9,
    category: 'notice',
    title: '잡차자 파트너 채용 박람회 참여 기업 모집 안내',
    date: '2026.01.10',
    pinned: false,
    content:
      '2026년 4월 개최 예정인 "잡차자 외국인 채용 박람회"에 참여할 기업을 모집합니다.\n\n[행사 개요]\n- 일시: 2026년 4월 18일(토) 10:00 ~ 17:00\n- 장소: 서울 코엑스 Hall D\n- 참가비: 무료 (기업인증 완료 기업에 한함)\n\n참여 신청은 2026년 3월 31일까지 1:1 문의를 통해 접수해 주세요.',
  },
  {
    id: 10,
    category: 'update',
    title: '공고 통계 대시보드 기능 업데이트',
    date: '2026.01.05',
    pinned: false,
    content:
      '공고별 상세 통계 대시보드가 업데이트되었습니다.\n\n[추가된 지표]\n- 공고 조회수 일별/주별 추이 그래프\n- 지원자 비자 유형 분포 차트\n- 공고 노출 대비 지원 전환율\n- 경쟁 공고 대비 지원자 수 비교\n\n[공고 관리 > 해당 공고 > 통계 보기]에서 확인하실 수 있습니다.',
  },
];

// 페이지당 공지 수 / Items per page
const ITEMS_PER_PAGE = 5;

// ── 유틸리티 / Utilities ───────────────────────────────────────────────────────

/**
 * 줄바꿈 텍스트를 JSX로 렌더링
 * Render newline-delimited text as JSX
 */
function renderContent(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

// ── 서브 컴포넌트 / Sub components ────────────────────────────────────────────

/** 카테고리 배지 / Category badge */
function CategoryBadge({ category }: { category: NoticeCategory }) {
  const config = CATEGORY_CONFIG[category];
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${config.color}`}
    >
      {config.label}
    </span>
  );
}

/** 중요 배지 / Important badge */
function ImportantBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">
      <Pin className="w-3 h-3" />
      중요
    </span>
  );
}

/** 공지 행 (인라인 펼침) / Notice row with inline expand */
function NoticeRow({
  notice,
  isOpen,
  onToggle,
}: {
  notice: Notice;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border-b border-gray-100 transition-colors last:border-b-0 ${
        notice.pinned ? 'bg-red-50/40' : 'bg-white'
      }`}
    >
      {/* 공지 헤더 행 / Notice header row */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        {/* 고정 핀 아이콘 (중요 공지) / Pin icon for important notice */}
        {notice.pinned && (
          <Pin className="w-4 h-4 text-red-500 shrink-0 fill-red-200" />
        )}

        {/* 배지 그룹 / Badge group */}
        <div className="flex items-center gap-1.5 shrink-0">
          {notice.pinned && <ImportantBadge />}
          <CategoryBadge category={notice.category} />
        </div>

        {/* 제목 / Title */}
        <span
          className={`flex-1 min-w-0 text-sm font-medium truncate ${
            notice.pinned ? 'text-gray-900 font-semibold' : 'text-gray-700'
          }`}
        >
          {notice.title}
        </span>

        {/* 날짜 + 토글 아이콘 / Date + toggle icon */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400 hidden sm:block">
            {notice.date}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-blue-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* 인라인 상세 내용 / Inline detail content */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1">
          {/* 날짜 (모바일에서만 표시) / Date shown on mobile */}
          <p className="text-xs text-gray-400 mb-3 sm:hidden">{notice.date}</p>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {renderContent(notice.content)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/** 페이지네이션 / Pagination */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  // 표시할 페이지 번호 목록 / Page numbers to display
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      {/* 이전 페이지 / Previous page */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* 페이지 번호 버튼 / Page number buttons */}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
            page === currentPage
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 페이지 / Next page */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/** 검색 결과 없음 / Empty state */
function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="py-14 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Bell className="w-7 h-7 text-gray-300" />
      </div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">
        &quot;{query}&quot;에 대한 공지가 없습니다
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        다른 검색어를 시도해보세요. / Try a different search term.
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
export default function CompanyNoticesPage() {
  // 검색어 / Search query
  const [searchQuery, setSearchQuery] = useState('');
  // 열려있는 공지 ID / Open notice ID
  const [openId, setOpenId] = useState<number | null>(null);
  // 현재 페이지 / Current page
  const [currentPage, setCurrentPage] = useState(1);

  // 고정 공지 / 일반 공지 분리 / Separate pinned and regular notices
  const pinnedNotices = useMemo(
    () => NOTICE_DATA.filter((n) => n.pinned),
    []
  );

  // 검색 적용된 일반 공지 / Search-filtered regular notices
  const regularNotices = useMemo(() => {
    let items = NOTICE_DATA.filter((n) => !n.pinned);

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }

    return items;
  }, [searchQuery]);

  // 검색어가 있을 때 고정 공지도 필터 / Filter pinned notices when searching
  const filteredPinned = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return pinnedNotices;
    return pinnedNotices.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [pinnedNotices, searchQuery]);

  // 페이지네이션 계산 / Pagination calculation
  const totalPages = Math.max(1, Math.ceil(regularNotices.length / ITEMS_PER_PAGE));
  const paginatedRegular = regularNotices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 공지 토글 / Toggle notice
  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // 검색어 변경 / Search change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setOpenId(null);
    setCurrentPage(1);
  };

  // 페이지 변경 / Page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 전체 결과 없음 여부 / No results at all
  const hasNoResults =
    filteredPinned.length === 0 && regularNotices.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">공지사항</h1>
          <p className="text-sm text-gray-500 mt-0.5">Notices</p>
        </div>
        {/* 총 공지 수 / Total count */}
        <span className="text-sm text-gray-400">
          총 {NOTICE_DATA.length}건 / Total
        </span>
      </div>

      {/* 검색 바 / Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="공지 제목을 검색해보세요 / Search notices..."
          className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
        />
        {/* 검색어 지우기 / Clear */}
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

      {/* 공지 목록 테이블 / Notice list table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* 테이블 헤더 / Table header */}
        <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-xs font-semibold text-gray-500 flex-1">
            제목 / Title
          </span>
          <span className="text-xs font-semibold text-gray-500 hidden sm:block w-24 text-right">
            날짜 / Date
          </span>
        </div>

        {/* 검색 결과 없음 / No results */}
        {hasNoResults && (
          <EmptyState
            query={searchQuery}
            onClear={() => handleSearchChange('')}
          />
        )}

        {/* 고정 공지 섹션 / Pinned notices section */}
        {filteredPinned.length > 0 && (
          <div className="border-b-2 border-red-100">
            {filteredPinned.map((notice) => (
              <NoticeRow
                key={notice.id}
                notice={notice}
                isOpen={openId === notice.id}
                onToggle={() => handleToggle(notice.id)}
              />
            ))}
          </div>
        )}

        {/* 일반 공지 목록 / Regular notices */}
        {paginatedRegular.length > 0 && (
          <div>
            {paginatedRegular.map((notice) => (
              <NoticeRow
                key={notice.id}
                notice={notice}
                isOpen={openId === notice.id}
                onToggle={() => handleToggle(notice.id)}
              />
            ))}
          </div>
        )}

        {/* 일반 공지 없음 (고정 공지는 있음) / No regular notices but pinned exist */}
        {!hasNoResults && paginatedRegular.length === 0 && regularNotices.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">
            일반 공지가 없습니다. / No regular notices.
          </div>
        )}
      </div>

      {/* 페이지네이션 / Pagination */}
      {!searchQuery && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* 검색 결과 수 표시 / Search result count */}
      {searchQuery && !hasNoResults && (
        <p className="text-center text-xs text-gray-400 mt-4">
          &quot;{searchQuery}&quot; 검색 결과:{' '}
          {filteredPinned.length + regularNotices.length}건
        </p>
      )}
    </div>
  );
}
