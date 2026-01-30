'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight, Paperclip as PaperPlane } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  isCompanyMode: boolean;
  onToggleMode: () => void;
  onLogoClick: () => void;
}

export default function Header({ isCompanyMode, onToggleMode, onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          onClick={onLogoClick}
        >
          <div className="w-8 h-8 bg-[#0ea5e9] rounded-lg flex items-center justify-center text-white">
            <PaperPlane size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">JobChaja</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isCompanyMode && (
            <Button asChild variant="ghost" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100">
              <Link href="/payment" onClick={onToggleMode}>
                <span>기업서비스</span>
                <ChevronRight size={14} />
              </Link>
            </Button>
          )}
          <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
          <Button asChild variant="ghost" className="text-slate-600 font-medium text-sm px-2">
            <Link href="/biz">비즈페이지</Link>
          </Button>
          <Button asChild variant="ghost" className="text-slate-600 font-medium text-sm px-2">
            <Link href="/login">로그인</Link>
          </Button>
          <Button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200" asChild>
            <Link href={"/register"} target='_blank' >
              회원가입
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
