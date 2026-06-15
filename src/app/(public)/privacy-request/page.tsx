import Link from 'next/link';

const requestTypes = [
  'Personal data access / 개인정보 열람',
  'Correction / 개인정보 정정',
  'Deletion or account withdrawal / 삭제 및 회원탈퇴',
  'Consent withdrawal / 동의 철회',
  'Processing suspension or objection / 처리정지 및 이의제기',
  'Human review of an automated matching result / 자동 매칭 결과 인적 검토',
];

export default function PrivacyRequestPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-16 text-slate-800">
      <p className="mb-3 text-sm font-semibold text-blue-700">Privacy Rights Request</p>
      <h1 className="text-3xl font-bold tracking-tight">개인정보 권리 요청</h1>
      <p className="mt-4 leading-7 text-slate-600">
        본인 확인 후 아래 권리를 요청할 수 있습니다. 요청 처리에 필요하지 않은 신분증이나 민감정보는
        이메일에 첨부하지 마세요.
      </p>

      <ul className="mt-8 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        {requestTypes.map((requestType) => (
          <li key={requestType} className="text-sm text-slate-700">
            {requestType}
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-950">요청 방법 / How to request</h2>
        <p className="mt-2 text-sm leading-6 text-blue-900">
          계정 이메일, 요청 유형, 요청 내용을 작성하여 개인정보 보호 담당자에게 보내주세요. 담당자가
          안전한 본인 확인 절차와 처리 일정을 안내합니다.
        </p>
        <a
          className="mt-5 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          href="mailto:pch0675@naver.com?subject=JobChaja%20Privacy%20Rights%20Request"
        >
          개인정보 권리 요청 이메일 보내기
        </a>
      </section>

      <p className="mt-8 text-sm text-slate-500">
        자세한 내용은 <Link className="font-semibold text-blue-700 underline" href="/privacy-policy">개인정보처리방침</Link>을 확인하세요.
      </p>
    </main>
  );
}

