'use client';

/**
 * 기업 이용약관 / 개인정보처리방침 / 마케팅 동의 페이지
 * Company Terms of Service / Privacy Policy / Marketing Consent Page
 * 탭 메뉴로 전환 + 인쇄 기능 제공
 * Tab-based navigation + print functionality
 */

import { useState } from 'react';
import { Printer, BookOpen, Shield, Bell } from 'lucide-react';

/** 탭 ID 타입 / Tab ID type */
type TabId = 'terms' | 'privacy' | 'marketing';

/** 탭 정의 / Tab definition */
interface Tab {
  id: TabId;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  updatedAt: string;
}

const TABS: Tab[] = [
  {
    id: 'terms',
    label: '이용약관',
    labelEn: 'Terms of Service',
    icon: <BookOpen className="w-4 h-4" />,
    updatedAt: '2024. 01. 01.',
  },
  {
    id: 'privacy',
    label: '개인정보처리방침',
    labelEn: 'Privacy Policy',
    icon: <Shield className="w-4 h-4" />,
    updatedAt: '2024. 01. 01.',
  },
  {
    id: 'marketing',
    label: '마케팅 정보 수신 동의',
    labelEn: 'Marketing Consent',
    icon: <Bell className="w-4 h-4" />,
    updatedAt: '2024. 01. 01.',
  },
];

/** 이용약관 본문 / Terms of Service body */
const TERMS_CONTENT = `
제1조 (목적)
이 약관은 잡차자(이하 "회사")가 제공하는 외국인 채용·비자 통합 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 기업 회원 간의 권리·의무 및 책임 사항 등을 규정함을 목적으로 합니다.

Article 1 (Purpose)
These Terms govern the rights, obligations, and responsibilities between the Company and corporate members in relation to the use of the foreigner employment and visa integrated platform service (hereinafter "Service") provided by Jobchaja (hereinafter "Company").

---

제2조 (정의)
① "서비스"란 기업 회원이 채용 공고를 등록하고 외국인 구직자와 매칭되는 플랫폼 서비스를 말합니다.
② "기업 회원"이란 이 약관에 동의하고 기업인증을 완료하여 서비스를 이용하는 사업자를 말합니다.
③ "열람권"이란 구직자의 상세 이력서를 열람하기 위한 유료 크레딧을 말합니다.
④ "비자 매칭"이란 기업 정보를 기반으로 채용 가능한 외국인 비자 유형을 자동으로 분석하는 기능을 말합니다.

Article 2 (Definitions)
① "Service" means the platform service through which corporate members post job listings and are matched with foreign job seekers.
② "Corporate Member" means a business entity that has agreed to these Terms and completed corporate verification.
③ "Viewing Credits" means the paid credits used to view detailed resumes of applicants.
④ "Visa Matching" means the automated analysis function that determines eligible foreign visa types based on company information.

---

제3조 (약관의 효력 및 변경)
① 이 약관은 서비스를 이용하고자 하는 기업 회원에 대하여 그 효력을 발생합니다.
② 회사는 필요한 경우 관련 법령의 범위 내에서 이 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.
③ 기업 회원이 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.

Article 3 (Effectiveness and Modification of Terms)
① These Terms take effect for corporate members who intend to use the Service.
② The Company may modify these Terms within the scope of applicable laws, and any changes will be announced through the Service's notice board.
③ If a corporate member does not agree to the modified Terms, they may discontinue using the Service and request account deletion.

---

제4조 (서비스 이용)
① 기업 회원은 기업인증 완료 후 채용 공고 게시, 지원자 관리, 열람권 구매 등 전체 서비스를 이용할 수 있습니다.
② 기업인증이 완료되지 않은 경우 공고 게시가 제한될 수 있습니다.
③ 회사는 서비스의 원활한 운영을 위해 공지 후 서비스를 일시 중단할 수 있습니다.

Article 4 (Service Use)
① Corporate members may use all services including job posting, applicant management, and viewing credit purchase after completing corporate verification.
② Job posting may be restricted if corporate verification is not completed.
③ The Company may temporarily suspend the Service with prior notice for smooth operations.

---

제5조 (결제 및 환불)
① 열람권 등 유료 서비스의 결제는 PG사를 통해 이루어집니다.
② 환불 정책은 관련 법령 및 회사의 환불 정책에 따릅니다.
③ 사용된 열람권은 환불되지 않습니다.

Article 5 (Payment and Refund)
① Payment for paid services such as viewing credits is processed through a payment gateway.
② Refund policies follow applicable laws and the Company's refund policy.
③ Used viewing credits are non-refundable.

---

제6조 (면책조항)
① 회사는 천재지변, 전쟁, 서버 장애 등 불가항력적인 사유로 인한 서비스 장애에 대해 책임을 지지 않습니다.
② 비자 매칭 결과는 참고용이며, 실제 채용 가능 여부는 관할 출입국관리사무소에 문의하시기 바랍니다.

Article 6 (Disclaimer)
① The Company is not liable for service disruptions caused by force majeure events such as natural disasters, war, or server failures.
② Visa matching results are for reference only; please consult the relevant immigration office for actual employment eligibility.
`;

/** 개인정보처리방침 본문 / Privacy Policy body */
const PRIVACY_CONTENT = `
제1조 (개인정보의 수집 및 이용 목적)
잡차자(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행합니다.

Article 1 (Purpose of Personal Information Collection and Use)
Jobchaja (hereinafter "Company") processes personal information for the following purposes. Personal information will not be used for any purpose other than those listed below.

① 회원 가입 및 관리 / Membership registration and management
② 서비스 제공 및 운영 / Service provision and operation
③ 기업인증 처리 / Corporate verification processing
④ 결제 및 환불 처리 / Payment and refund processing
⑤ 고객 문의 및 민원 처리 / Customer inquiry and complaint handling

---

제2조 (수집하는 개인정보 항목)
① 필수 항목 / Required items
   - 기업명, 사업자등록번호, 대표자명 / Company name, business registration number, representative name
   - 담당자 이름, 이메일, 연락처 / Manager name, email, contact number

② 선택 항목 / Optional items
   - 회사 로고, 홈페이지 URL, 회사 소개 / Company logo, homepage URL, company description

③ 서비스 이용 과정에서 자동 수집 / Auto-collected during service use
   - IP 주소, 쿠키, 서비스 이용 기록 / IP address, cookies, service usage records

---

제3조 (개인정보의 보유 및 이용 기간)
① 회원 탈퇴 시 즉시 삭제 (단, 관련 법령에 따라 일정 기간 보관)
② 결제 관련 정보: 5년 (전자상거래법)
③ 고객 문의 기록: 3년

Article 3 (Retention and Use Period)
① Deleted immediately upon membership withdrawal (except as required by applicable law)
② Payment-related information: 5 years (E-Commerce Act)
③ Customer inquiry records: 3 years

---

제4조 (개인정보의 제3자 제공)
회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다.
① 이용자의 사전 동의가 있는 경우
② 법령의 규정에 의거하여 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

Article 4 (Third-Party Provision)
The Company does not provide personal information to third parties in principle, except:
① When prior consent is obtained from the user
② When requested by investigative agencies pursuant to applicable laws

---

제5조 (이용자의 권리 및 행사 방법)
이용자는 언제든지 자신의 개인정보에 대해 열람, 수정, 삭제, 처리정지 요청을 할 수 있습니다.
요청은 고객센터 또는 이메일(privacy@jobchaja.kr)을 통해 할 수 있으며, 회사는 지체 없이 처리합니다.

Article 5 (User Rights)
Users may request access, correction, deletion, or suspension of processing of their personal information at any time through customer service or email (privacy@jobchaja.kr).

---

제6조 (개인정보 보호책임자)
성명: 잡차자 개인정보 보호팀
이메일: privacy@jobchaja.kr
전화: 고객센터를 통해 연락 가능

Article 6 (Privacy Officer)
Name: Jobchaja Privacy Protection Team
Email: privacy@jobchaja.kr
Phone: Contact via customer service
`;

/** 마케팅 정보 수신 동의 본문 / Marketing Consent body */
const MARKETING_CONTENT = `
마케팅 정보 수신 동의 / Marketing Information Consent

잡차자는 다음과 같이 마케팅 정보를 발송할 수 있습니다.
Jobchaja may send marketing information as follows.

---

1. 수신 동의 대상 / Consent Subject
   기업 회원으로 가입한 기업 담당자 / Corporate managers registered as corporate members

2. 발송 정보 종류 / Type of Information Sent
   - 신규 서비스 및 기능 안내 / New services and feature announcements
   - 채용 트렌드 및 외국인 고용 관련 뉴스레터 / Recruitment trends and foreigner employment newsletter
   - 프로모션, 할인 혜택 안내 / Promotional and discount benefit notifications
   - 서비스 업데이트 및 공지사항 / Service updates and notices

3. 발송 채널 / Delivery Channels
   - 이메일 / Email
   - 알림톡 (카카오) / KakaoTalk notification
   - 앱 푸시 알림 / App push notifications

4. 수신 동의 및 철회 / Consent and Withdrawal
   - 마케팅 수신 동의는 선택사항이며, 동의하지 않아도 기본 서비스 이용에 제한이 없습니다.
   - Marketing consent is optional and does not affect access to basic services.
   - 수신 동의 이후에도 마이페이지 → 알림 설정에서 언제든지 동의를 철회할 수 있습니다.
   - You may withdraw consent at any time via My Page → Notification Settings.

5. 보유 기간 / Retention Period
   - 마케팅 동의 철회 시까지 / Until consent is withdrawn
   - 회원 탈퇴 시 즉시 삭제 / Deleted immediately upon membership withdrawal

---

※ 마케팅 수신에 동의하지 않더라도 서비스 이용에 필수적인 알림(결제 완료, 기업인증 결과, 지원자 알림 등)은 발송됩니다.
※ Even if you do not consent to marketing, essential notifications (payment confirmation, verification results, applicant alerts, etc.) will still be sent.
`;

/** 탭별 콘텐츠 맵 / Content map per tab */
const TAB_CONTENT: Record<TabId, string> = {
  terms: TERMS_CONTENT,
  privacy: PRIVACY_CONTENT,
  marketing: MARKETING_CONTENT,
};

export default function CompanyTermsPage() {
  /** 현재 활성 탭 / Currently active tab */
  const [activeTab, setActiveTab] = useState<TabId>('terms');

  /** 인쇄 핸들러 / Print handler */
  const handlePrint = () => {
    window.print();
  };

  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const currentContent = TAB_CONTENT[activeTab];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">약관 및 정책</h1>
          <p className="text-sm text-gray-500 mt-0.5">Terms & Policies</p>
        </div>
        {/* 인쇄 버튼 / Print button */}
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          <Printer className="w-4 h-4" />
          인쇄 / Print
        </button>
      </div>

      {/* 탭 메뉴 / Tab menu */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 약관 본문 영역 / Terms content area */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* 헤더 / Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              {currentTab.label}
              <span className="text-gray-400 font-normal ml-1.5 text-xs">/ {currentTab.labelEn}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">최종 업데이트 / Last updated: {currentTab.updatedAt}</p>
          </div>
        </div>

        {/* 본문 텍스트 / Body text */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {currentContent.trim().split('\n').map((line, idx) => {
              if (line.trim() === '---') {
                /* 구분선 / Divider */
                return <hr key={idx} className="my-4 border-gray-200" />;
              }
              if (line.trim() === '') {
                /* 빈 줄 / Empty line */
                return <div key={idx} className="h-2" />;
              }
              /* 일반 텍스트 줄 / Regular text line */
              const isBold =
                line.startsWith('제') ||
                line.startsWith('Article') ||
                line.startsWith('1.') ||
                line.startsWith('2.') ||
                line.startsWith('3.') ||
                line.startsWith('4.') ||
                line.startsWith('5.') ||
                line.startsWith('마케팅 정보');
              return (
                <p
                  key={idx}
                  className={`text-sm leading-relaxed ${
                    isBold
                      ? 'font-semibold text-gray-800 mt-4 mb-1'
                      : line.startsWith('※')
                      ? 'text-xs text-gray-500 italic'
                      : 'text-gray-600'
                  }`}
                >
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        {/* 하단 안내 / Footer notice */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            약관 관련 문의는{' '}
            <a
              href="mailto:privacy@jobchaja.kr"
              className="text-blue-500 hover:underline"
            >
              privacy@jobchaja.kr
            </a>{' '}
            또는 1:1 문의를 이용해주세요.
            {' / '}
            For questions about these terms, contact us at{' '}
            <a
              href="mailto:privacy@jobchaja.kr"
              className="text-blue-500 hover:underline"
            >
              privacy@jobchaja.kr
            </a>{' '}
            or via 1:1 inquiry.
          </p>
        </div>
      </div>
    </div>
  );
}
