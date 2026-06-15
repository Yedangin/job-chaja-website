import Link from 'next/link';

export const metadata = {
  title: '취소 및 환불 정책 | 잡차자',
  description: '잡차자 유료서비스 취소 및 환불 정책',
};

const policies = [
  {
    title: '프리미엄 채용공고',
    items: [
      '결제 후 서비스 적용 전(공고 미게시 상태): 전액 환불 가능',
      '서비스 적용 후: 잔여 기간에 대해 일할 계산한 금액 환불',
      '사용 기간이 전체 기간의 50%를 초과한 경우 환불 제한 가능',
      '서비스 하자 또는 회사 귀책사유가 있는 경우: 전액 환불',
    ],
  },
  {
    title: '인재 열람권',
    items: [
      '유효기간: 구매일로부터 90일',
      '미사용 열람권: 결제일로부터 7일 이내 전액 환불 가능',
      '일부 사용 후 환불: 사용분을 정가 기준으로 차감 후 잔액 환불 (7일 이내)',
      '결제일로부터 7일 경과 시 환불 제한',
    ],
  },
  {
    title: '비자 진단 서비스',
    items: [
      '결제 즉시 디지털 콘텐츠 형태로 제공되는 경우 환불이 제한될 수 있음',
      '서비스 오류 또는 회사 귀책사유로 정상 제공되지 않은 경우 전액 환불',
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">취소 및 환불 정책</h1>
          <p className="mt-2 text-sm text-gray-500">시행일: 2026년 3월 2일</p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-gray-700">
          <section className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
            <h2 className="mb-2 text-base font-bold">유료 서비스 출시 준비 안내</h2>
            <p>
              현재 유료 및 예치금 서비스는 제공되지 않습니다. 실제 출시 전 법률 검토를 완료하고,
              확정된 가격·취소·환불 조건을 결제 화면에서 다시 안내합니다.
            </p>
          </section>

          {policies.map((policy) => (
            <section key={policy.title} className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-base font-bold text-gray-900">{policy.title}</h2>
              <ul className="list-inside list-disc space-y-1.5">
                {policy.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ))}

          <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="mb-3 text-base font-bold text-gray-900">환불 요청 및 처리</h2>
            <ul className="list-inside list-disc space-y-1.5">
              <li>요청 방법: 서비스 내 문의하기 또는 pch0675@naver.com</li>
              <li>고객센터: 070-8095-4474 (평일 09:00~18:00)</li>
              <li>처리 기간: 요청 후 영업일 기준 3~5일</li>
              <li>환불 방법: 원 결제 수단으로 환불</li>
            </ul>
          </section>

          <p className="text-center text-xs text-gray-500">
            상세 조건은 <Link href="/terms-and-conditions" className="font-semibold text-blue-600 underline">서비스 이용약관 제9조</Link>를 확인해 주세요.
          </p>
        </div>
      </div>
    </main>
  );
}
