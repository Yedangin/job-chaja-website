'use client';

import Link from 'next/link';
import { UserRound } from 'lucide-react';
import LanguageSwitcher from '@/components/language-switcher';
import { getRoleHomePath, useAuth } from '@/contexts/auth-context';
import type { PlannerUiCopy } from '@/lib/planner-content';

export function PlannerHeader({ copy }: { copy: PlannerUiCopy }) {
  const { isLoggedIn, isLoading, role } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E8EB] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold text-[#191F28] transition hover:opacity-75">
          JobChaja
        </Link>
        <span className="mx-3 hidden h-4 w-px bg-[#D1D6DB] min-[430px]:block" aria-hidden="true" />
        <Link href="/diagnosis" className="hidden text-sm font-semibold text-[#0066FF] min-[430px]:block">
          {copy.nav.section}
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher compactOnMobile />
          {isLoading ? (
            <div className="h-9 w-20" />
          ) : isLoggedIn ? (
            <Link
              href={getRoleHomePath(role)}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-[#4E5968] transition hover:bg-[#F2F4F6] hover:text-[#191F28]"
            >
              <UserRound className="h-4 w-4" />
              <span className="hidden sm:inline">{copy.nav.myAccount}</span>
            </Link>
          ) : (
            <Link
              href="/login?redirect=/diagnosis"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-sm font-semibold text-white transition hover:bg-sky-700 sm:w-auto sm:px-3.5"
              aria-label={copy.nav.signIn}
            >
              <UserRound className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">{copy.nav.signIn}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function PlannerLoading({ copy }: { copy: PlannerUiCopy }) {
  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#191F28]">
      <PlannerHeader copy={copy} />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="h-2 w-32 overflow-hidden rounded-full bg-[#E5E8EB]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#0066FF]" />
        </div>
      </div>
    </main>
  );
}
