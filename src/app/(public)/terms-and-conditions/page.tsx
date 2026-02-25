/**
 * 잡차자 서비스 이용약관 (2026-02-25 시행)
 * JobChaja Terms of Service (Effective: 2026-02-25)
 * 카카오페이·KG이니시스 심사 요건 충족 포함
 */

export const metadata = {
  title: '이용약관 | 잡차자',
  description: '잡차자 서비스 이용약관',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 / Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">잡차자 서비스 이용약관</h1>
          <p className="text-sm text-gray-500 mt-2">시행일: 2026년 2월 25일</p>
        </header>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

          {/* 제1조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제1조 (목적)</h2>
            <p>
              이 약관은 주식회사 리브소프트(이하 &quot;회사&quot;)가 운영하는 잡차자(JobChaja) 서비스(이하 &quot;서비스&quot;)의
              이용조건 및 절차, 회사와 회원 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제2조 (정의)</h2>
            <ul className="space-y-2 list-none">
              {[
                ['서비스', '회사가 제공하는 외국인 채용·비자 통합 플랫폼 잡차자(JobChaja) 및 관련 제반 서비스 일체'],
                ['개인회원', '외국인 구직자로 가입한 자연인'],
                ['기업회원', '채용공고 등록 등을 위해 사업자 자격으로 가입한 법인 또는 개인사업자'],
                ['회원', '개인회원 및 기업회원을 통칭'],
                ['유료서비스', '프리미엄 채용공고, 인재 열람권, 비자 진단 서비스 등 회사가 유료로 제공하는 서비스'],
                ['열람권', '기업회원이 개인회원의 상세 프로필 및 이력서를 열람하기 위해 구매하는 이용권'],
                ['비자 진단', '구직자의 체류자격(비자) 조건을 분석하여 취업 가능 공고를 추천하는 서비스'],
              ].map(([term, def]) => (
                <li key={term} className="flex gap-2">
                  <span className="font-semibold shrink-0">{`"${term}"`}</span>
                  <span>: {def}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 제3조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제3조 (약관의 게시 및 효력)</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>이 약관은 서비스 초기화면 및 회원가입 페이지에 게시하며, 회원이 동의함으로써 효력이 발생합니다.</li>
              <li>회사는 관련 법령에 위반되지 않는 범위 내에서 약관을 개정할 수 있으며, 개정 시 시행 7일 전(불이익 변경 시 30일 전) 공지합니다.</li>
              <li>회원이 개정 약관 시행 전까지 거부 의사를 표명하지 않으면 개정 약관에 동의한 것으로 봅니다.</li>
            </ul>
          </section>

          {/* 제4조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제4조 (서비스의 내용)</h2>
            <p className="mb-3">회사는 다음 서비스를 제공합니다.</p>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>채용공고 등록·검색·지원 서비스 (정규직·계약직·아르바이트 통합)</li>
              <li>비자 매칭 서비스 (체류자격별 채용 가능 여부 자동 분석)</li>
              <li>비자 진단 및 경로 추천 서비스</li>
              <li>인재 검색 및 프로필 열람 서비스 (기업회원 대상)</li>
              <li>기업 인증 및 채용 공고 프리미엄 게시 서비스</li>
              <li>커뮤니티 및 정보 제공 서비스</li>
            </ul>
          </section>

          {/* 제5조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제5조 (회원 가입)</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>회원 가입은 이용자가 약관에 동의하고 회원정보를 입력한 후 회사가 승인함으로써 완료됩니다.</li>
              <li>만 18세 미만은 서비스에 가입할 수 없습니다.</li>
              <li>기업회원은 사업자등록번호 인증 및 기업인증 심사를 거쳐야 채용공고 게시가 가능합니다.</li>
              <li>허위 정보로 가입한 경우 회원자격을 즉시 박탈하며 관련 법적 조치를 취할 수 있습니다.</li>
            </ul>
          </section>

          {/* 제6조 — 개인회원 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제6조 (개인회원 — 외국인 구직자)</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>개인회원은 본인의 체류자격(비자) 정보를 정확히 입력해야 합니다.</li>
              <li>개인회원은 이력서 및 프로필을 등록하여 채용공고에 지원할 수 있습니다.</li>
              <li>비자 인증 완료 시 본인의 비자 조건에 맞는 채용공고만 노출됩니다.</li>
              <li>허위 비자 정보 입력 시 회원자격이 즉시 박탈되며, 기업 및 제3자에 대한 손해를 배상할 책임이 있습니다.</li>
              <li>개인회원의 비자 진단 서비스 이용 시 결과는 참고용이며, 출입국 법령 해석에 대한 법적 책임은 회사에 귀속되지 않습니다.</li>
            </ul>
          </section>

          {/* 제7조 — 기업회원 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제7조 (기업회원)</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>기업회원은 사업자등록증 등 관련 서류를 제출하고 회사의 인증 심사를 통과해야 합니다.</li>
              <li>기업인증 상태에 따른 서비스 이용 범위는 다음과 같습니다.
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>미인증: 프로필 설정만 가능</li>
                  <li>심사 중: 공고 임시저장 가능, 게시 불가</li>
                  <li>인증 완료: 모든 서비스 이용 가능</li>
                  <li>반려: 사유 확인 후 재신청 가능</li>
                </ul>
              </li>
              <li>기업회원은 채용공고에 허위 정보를 기재해서는 안 되며, 위반 시 공고 삭제 및 회원자격 박탈, 법적 조치를 받을 수 있습니다.</li>
              <li>기업회원이 제공한 담당자 정보(이름, 연락처)는 허위 채용 등 불법 행위 발생 시 법적 책임 추적에 사용될 수 있습니다.</li>
            </ul>
          </section>

          {/* 제8조 — 유료서비스 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제8조 (유료서비스 및 결제)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">① 유료서비스 종류</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>프리미엄 채용공고: 일반 공고 대비 상위 노출 및 강조 표시</li>
                  <li>인재 열람권: 개인회원 상세 프로필·이력서 열람 1건당 이용권</li>
                  <li>비자 진단 서비스: 체류자격 기반 취업 경로 상세 분석 리포트</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">② 결제 수단</h3>
                <p>신용카드, 체크카드, 간편결제(카카오페이, 네이버페이 등), 해외 카드를 통해 결제할 수 있습니다.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">③ 과세</h3>
                <p>유료서비스 이용 요금에는 부가가치세(VAT)가 포함되어 있습니다.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">④ 서비스 이용 기간</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>일반 채용공고: 결제 없이 무료 (알바 14일 / 정규직 30일 게시)</li>
                  <li>프리미엄 채용공고: 결제 완료 즉시 적용</li>
                  <li>열람권: 결제 즉시 지급, 계정 유효기간 내 사용 가능</li>
                  <li>비자 진단: 결제 즉시 서비스 제공</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 제9조 — 취소 및 환불 ← KakaoPay 필수 */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제9조 (취소 및 환불 정책)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">① 프리미엄 채용공고</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>결제 후 서비스 적용 전(공고 미게시 상태): 전액 환불 가능</li>
                  <li>서비스 적용 후(공고 게시 시작 후): 환불 불가</li>
                  <li>단, 서비스 하자 또는 회사 귀책사유가 있는 경우 전액 환불</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">② 인재 열람권</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>미사용 열람권: 결제일로부터 7일 이내 전액 환불 가능</li>
                  <li>사용된 열람권(프로필 열람 완료): 환불 불가</li>
                  <li>일부 사용 시: 미사용 수량에 해당하는 금액 환불</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">③ 비자 진단 서비스</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>결제 즉시 디지털 컨텐츠 형태로 서비스가 제공되므로 원칙적으로 환불 불가</li>
                  <li>(「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호 적용)</li>
                  <li>단, 서비스 오류 또는 회사 귀책사유로 정상 제공이 이루어지지 않은 경우 전액 환불</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">④ 환불 절차</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>환불 요청: 고객센터 이메일 또는 서비스 내 문의하기</li>
                  <li>처리 기간: 요청 후 영업일 기준 3~5일</li>
                  <li>환불 방법: 결제 수단으로 원상 복구 (카드 취소 또는 계좌 이체)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 제10조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제10조 (개인정보 보호)</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>회사는 「개인정보 보호법」 및 관련 법령에 따라 회원의 개인정보를 보호합니다.</li>
              <li>개인정보 수집·이용·제공에 관한 사항은 별도의 개인정보처리방침에 따릅니다.</li>
              <li>회원은 서비스 이용 시 타인의 개인정보를 무단 수집·이용해서는 안 됩니다.</li>
            </ul>
          </section>

          {/* 제11조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제11조 (회사의 의무)</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>회사는 서비스를 안정적으로 제공하기 위해 최선을 다합니다.</li>
              <li>회사는 회원의 개인정보를 보호하고 관련 법령을 준수합니다.</li>
              <li>회사는 서비스 장애 발생 시 지체 없이 복구하며, 불가피한 사유로 인한 서비스 중단은 사전 공지합니다.</li>
            </ul>
          </section>

          {/* 제12조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제12조 (회원의 의무)</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>회원은 허위 정보를 등록하거나 타인 정보를 도용해서는 안 됩니다.</li>
              <li>회원은 서비스를 이용하여 불법적인 행위를 해서는 안 됩니다.</li>
              <li>회원은 서비스 운영을 방해하는 행위(악성코드 배포, 과부하 유발 등)를 해서는 안 됩니다.</li>
              <li>회원은 다른 회원의 개인정보를 수집·저장·공개해서는 안 됩니다.</li>
            </ul>
          </section>

          {/* 제13조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제13조 (서비스 이용 제한)</h2>
            <p className="mb-3">회사는 회원이 다음 각 호에 해당하는 경우 서비스 이용을 제한하거나 회원자격을 박탈할 수 있습니다.</p>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>허위 정보 등록 또는 타인 정보 도용</li>
              <li>허위 채용공고 게시 또는 사기 행위</li>
              <li>부정한 방법으로 서비스를 이용하거나 운영을 방해하는 행위</li>
              <li>관련 법령 위반 행위</li>
              <li>기타 서비스 운영 정책에 위반되는 행위</li>
            </ul>
          </section>

          {/* 제14조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제14조 (손해배상 및 책임 제한)</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>회사는 무료로 제공하는 서비스에 대해 어떠한 손해도 배상하지 않습니다.</li>
              <li>회사는 비자 진단 결과의 정확성에 대해 법적 책임을 지지 않습니다. (참고 정보 제공 목적)</li>
              <li>회원 간 거래 또는 분쟁에서 발생한 손해에 대해 회사는 책임을 지지 않습니다.</li>
              <li>회원의 귀책사유로 발생한 손해는 해당 회원이 부담합니다.</li>
            </ul>
          </section>

          {/* 제15조 */}
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">제15조 (준거법 및 관할)</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>이 약관은 대한민국 법령에 따라 해석·적용됩니다.</li>
              <li>서비스 이용에 관한 분쟁이 발생한 경우, 회사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.</li>
            </ul>
          </section>

          {/* 사업자 정보 / Business info — KakaoPay 요건 ④ */}
          <section className="bg-gray-100 rounded-xl p-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">사업자 정보</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {[
                ['상호', '주식회사 리브소프트'],
                ['서비스명', '잡차자 (JobChaja)'],
                ['사업자등록번호', '485-86-03274'],
                ['대표자', '[대표자명]'],
                ['주소', '[사업장 주소]'],
                ['고객센터', '[전화번호]'],
                ['이메일', 'pch0675@naver.com'],
                ['운영시간', '평일 09:00 ~ 18:00 (주말·공휴일 휴무)'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <dt className="font-semibold text-gray-600 shrink-0">{label}</dt>
                  <dd className="text-gray-800">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="text-center text-xs text-gray-400 pb-4">
            본 약관은 2026년 2월 25일부터 시행됩니다.
          </p>
        </div>
      </div>
    </main>
  );
}
