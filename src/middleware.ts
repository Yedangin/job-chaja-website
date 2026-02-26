import { NextRequest, NextResponse } from 'next/server';

/**
 * 레거시 라우트 리다이렉트 미들웨어
 * Legacy route redirect middleware
 *
 * 루트 레벨의 레거시 라우트를 역할별 네임스페이스로 영구 리다이렉트(301).
 * Permanently redirects root-level legacy routes to role-based namespaces.
 */

/** 리다이렉트 매핑 / Redirect mapping (order matters — more specific paths first) */
const REDIRECT_MAP: Array<{ from: string; to: string; exact?: boolean }> = [
  // 결제 관련 (구체적 경로 우선) / Payment routes (specific paths first)
  { from: '/payments/checkout', to: '/company/payments/checkout' },
  { from: '/payments/success', to: '/company/payments/success' },
  { from: '/payments/credits', to: '/company/payments/credits' },
  { from: '/payment', to: '/company/payments' },

  // 비즈 라우트 / Business routes
  { from: '/biz/jobs', to: '/company/jobs' },
  { from: '/biz', to: '/company/dashboard' },

  // 공고 라우트 / Job routes
  { from: '/jobs/create', to: '/company/jobs/create' },
  { from: '/jobs', to: '/alba', exact: true },

  // 개인회원 라우트 / Worker routes
  { from: '/profile', to: '/worker/mypage' },
  { from: '/resume', to: '/worker/resume' },
  { from: '/visa-verification', to: '/worker/visa-verification' },

  // 기업회원 라우트 / Company routes
  { from: '/talents', to: '/company/talents' },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const rule of REDIRECT_MAP) {
    if (rule.exact) {
      // 정확 매칭만 허용 / Only exact match (e.g. /jobs → /alba, but /jobs/123 passes through)
      if (pathname === rule.from) {
        const searchParams = request.nextUrl.search;
        const url = new URL(rule.to + searchParams, request.url);
        return NextResponse.redirect(url, 301);
      }
    } else {
      // 정확 매칭 또는 접두사 매칭 / Exact match or prefix match
      if (pathname === rule.from || pathname.startsWith(rule.from + '/')) {
        // 하위 경로 보존 / Preserve sub-paths
        const subPath = pathname.slice(rule.from.length);
        const searchParams = request.nextUrl.search;
        const url = new URL(rule.to + subPath + searchParams, request.url);
        return NextResponse.redirect(url, 301);
      }
    }
  }

  return NextResponse.next();
}

/** 레거시 경로에만 적용 / Only apply to legacy paths */
export const config = {
  matcher: [
    '/profile/:path*',
    '/resume/:path*',
    '/talents/:path*',
    '/visa-verification/:path*',
    '/biz/:path*',
    '/jobs/:path*',
    '/payment/:path*',
    '/payments/:path*',
  ],
};
