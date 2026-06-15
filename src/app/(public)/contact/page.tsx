import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-16 text-slate-800">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-700">Contact JobChaja</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">문의하기</h1>
      <p className="mt-5 leading-7 text-slate-600">
        서비스 준비 현황, 제휴, 일반 문의는 아래 채널로 접수해 주세요. 채용 중개, 결제 및 비자
        법률 자문은 현재 제공하지 않습니다.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a href="mailto:pch0675@naver.com" className="rounded-2xl border border-slate-200 p-6 hover:bg-slate-50">
          <Mail className="h-6 w-6 text-orange-700" />
          <p className="mt-5 font-bold">이메일</p>
          <p className="mt-1 text-sm text-slate-600">pch0675@naver.com</p>
        </a>
        <a href="tel:+827080954474" className="rounded-2xl border border-slate-200 p-6 hover:bg-slate-50">
          <Phone className="h-6 w-6 text-orange-700" />
          <p className="mt-5 font-bold">대표번호</p>
          <p className="mt-1 text-sm text-slate-600">070-8095-4474</p>
        </a>
      </div>
      <p className="mt-10 text-sm text-slate-500">
        개인정보 권리 요청은 <Link href="/privacy-request" className="font-bold text-blue-700 underline">전용 요청 페이지</Link>를 이용해 주세요.
      </p>
    </main>
  );
}

