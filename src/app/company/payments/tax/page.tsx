'use client';

/**
 * 세금계산서 발급 안내 페이지 / Tax invoice issuance guide page
 * - 전용 API 없음 → 1:1 문의 통한 발급 안내
 * - No dedicated API → guide for issuance via 1:1 inquiry
 */

import Link from 'next/link';
import {
  FileText,
  Building2,
  Mail,
  Phone,
  CreditCard,
  MessageSquare,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

// ── 필요 정보 목록 / Required information list ───────────────────────────────

// 세금계산서 발급 필요 정보 / Information needed for tax invoice
const REQUIRED_INFO = [
  {
    icon: Building2,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    label: '사업자 등록번호',
    labelEn: 'Business Registration Number',
    desc: '10자리 사업자 등록번호 (예: 123-45-67890)',
  },
  {
    icon: Building2,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50',
    label: '상호명 (법인명)',
    labelEn: 'Company Name',
    desc: '사업자 등록증에 기재된 정확한 상호명',
  },
  {
    icon: Mail,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-50',
    label: '세금계산서 수신 이메일',
    labelEn: 'Email for Tax Invoice',
    desc: '전자 세금계산서를 수신할 담당자 이메일 주소',
  },
  {
    icon: Phone,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
    label: '담당자 연락처',
    labelEn: 'Contact Number',
    desc: '세금계산서 관련 문의를 위한 담당자 전화번호',
  },
  {
    icon: CreditCard,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
    label: '결제 주문 번호',
    labelEn: 'Order ID',
    desc: '결제 내역에서 확인 가능한 주문 번호',
  },
] as const;

// ── 처리 단계 / Processing steps ─────────────────────────────────────────────

// 발급 절차 단계 / Invoice issuance procedure steps
const PROCESS_STEPS = [
  {
    step: 1,
    title: '1:1 문의 접수',
    titleEn: 'Submit Inquiry',
    desc: '아래 버튼을 통해 1:1 문의로 세금계산서 발급을 요청하세요.',
    icon: MessageSquare,
  },
  {
    step: 2,
    title: '정보 확인',
    titleEn: 'Verification',
    desc: '담당자가 필요 정보를 검토하고 추가 확인이 필요할 경우 연락드립니다.',
    icon: CheckCircle2,
  },
  {
    step: 3,
    title: '발급 완료',
    titleEn: 'Issuance',
    desc: '영업일 기준 2~3일 내 입력하신 이메일로 전자 세금계산서가 발송됩니다.',
    icon: FileText,
  },
] as const;

// ── 유의사항 / Notes ───────────────────────────────────────────────────────────

// 세금계산서 발급 유의사항 / Tax invoice notes
const NOTES = [
  '세금계산서는 결제일 기준 익월 10일까지 신청하실 수 있습니다.',
  '취소된 결제 건에 대해서는 세금계산서가 발급되지 않습니다.',
  '발급된 세금계산서는 국세청 e세로 시스템을 통해 확인하실 수 있습니다.',
  '법인 사업자의 경우 법인 등록번호도 함께 준비해주세요.',
] as const;

// ══════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트 / Main page component
// ══════════════════════════════════════════════════════════════════════════════

export default function CompanyTaxPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">세금계산서 발급 안내</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tax Invoice Issuance Guide</p>
      </div>

      <div className="space-y-5">

        {/* ── 안내 배너 / Info banner ─────────────────────────────────────── */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-blue-800 mb-1">
                세금계산서 발급 방법 / How to Request a Tax Invoice
              </h2>
              <p className="text-sm text-blue-700 leading-relaxed">
                잡차자는 현재 세금계산서 자동 발급 시스템을 준비 중입니다.
                현재는 <strong>1:1 문의</strong>를 통해 발급을 요청해 주세요.
                영업일 기준 <strong>2~3일 이내</strong>에 처리해 드립니다.
              </p>
              <p className="text-xs text-blue-500 mt-1.5">
                JobChaja is preparing an automated tax invoice system.
                Please request via 1:1 inquiry for now. Processed within 2–3 business days.
              </p>
            </div>
          </div>
        </div>

        {/* ── 발급 절차 / Issuance procedure ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            발급 절차 / Issuance Procedure
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {PROCESS_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={step.step} className="flex-1 relative">
                  {/* 단계 카드 / Step card */}
                  <div className="flex flex-col items-center text-center">
                    {/* 아이콘 + 화살표 행 / Icon + arrow row */}
                    <div className="flex items-center w-full mb-3">
                      <div className="flex-1 flex justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center relative">
                          <StepIcon className="w-5 h-5 text-white" />
                          {/* 단계 번호 배지 / Step number badge */}
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 text-blue-600 text-xs font-black flex items-center justify-center leading-none">
                            {step.step}
                          </span>
                        </div>
                      </div>
                      {/* 화살표 (마지막 제외) / Arrow (except last) */}
                      {idx < PROCESS_STEPS.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 hidden sm:block" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{step.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 필요 정보 / Required information ────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-1">
            필요 정보 / Required Information
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            1:1 문의 시 아래 정보를 함께 보내주시면 빠르게 처리해 드립니다.
            <br />
            Please include the following information in your inquiry for faster processing.
          </p>
          <div className="space-y-3">
            {REQUIRED_INFO.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  {/* 정보 아이콘 / Info icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                    <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.labelEn}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 처리 기간 안내 / Processing time info ──────────────────────── */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800 mb-1">
                처리 기간 안내 / Processing Time
              </p>
              <p className="text-sm text-amber-700">
                문의 접수 후 <strong>영업일 기준 2~3일</strong> 이내에 처리됩니다.
                주말 및 공휴일에는 처리가 지연될 수 있습니다.
              </p>
              <p className="text-xs text-amber-500 mt-1">
                Processed within 2–3 business days after inquiry submission.
                Processing may be delayed on weekends and holidays.
              </p>
            </div>
          </div>
        </div>

        {/* ── 유의사항 / Notes ─────────────────────────────────────────────── */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-gray-500 shrink-0" />
            <h2 className="text-sm font-bold text-gray-700">유의사항 / Important Notes</h2>
          </div>
          <ul className="space-y-2">
            {NOTES.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-500">
                {/* 불릿 / Bullet */}
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── 액션 버튼 / Action buttons ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* 1:1 문의 버튼 (기업 문의 페이지로 연결) / 1:1 inquiry button */}
          <Link
            href="/company/support/inquiry"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3.5 rounded-xl hover:bg-blue-700 transition"
          >
            <MessageSquare className="w-4 h-4" />
            1:1 문의로 발급 요청하기
          </Link>

          {/* 결제 내역 바로가기 / Payment history shortcut */}
          <Link
            href="/company/payments/history"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-3.5 rounded-xl hover:border-blue-300 hover:text-blue-600 transition"
          >
            <CreditCard className="w-4 h-4" />
            결제 내역 확인하기
          </Link>
        </div>

        {/* ── 세금계산서 샘플 안내 / Sample guide ────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            세금계산서 발급 대상 / Eligible Payments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 프리미엄 공고 / Premium job posting */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                {/* 별 아이콘 (프리미엄 공고) / Star icon (premium job) */}
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-800">프리미엄 공고 업그레이드</p>
                <p className="text-xs text-amber-600">50,000원 / 건</p>
              </div>
            </div>
            {/* 이력서 열람권 / Viewing credits */}
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                {/* 눈 아이콘 (열람권) / Eye icon (viewing credits) */}
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-800">이력서 열람권 구매</p>
                <p className="text-xs text-purple-600">3,000원 ~ 150,000원</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            * 무료 공고 등록은 세금계산서 발급 대상이 아닙니다.
            <br />
            * Free job postings are not eligible for tax invoice issuance.
          </p>
        </div>

      </div>
    </div>
  );
}
