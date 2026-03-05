import { NextRequest, NextResponse } from 'next/server';

/**
 * 미들웨어: IP 기반 지역 리다이렉트 + 레거시 라우트 리다이렉트
 * Middleware: IP-based geo redirect + legacy route redirect
 *
 * 1) 한국 외 IP → /international 랜딩 페이지로 리다이렉트
 *    Non-Korean IP → redirect to /international landing page
 * 2) 레거시 라우트를 역할별 네임스페이스로 영구 리다이렉트(301)
 *    Legacy routes permanently redirect to role-based namespaces (301)
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
  { from: '/jobs', to: '/alba' },

  // 개인회원 라우트 / Worker routes
  { from: '/profile', to: '/worker/mypage' },
  { from: '/resume', to: '/worker/resume' },
  { from: '/visa-verification', to: '/worker/visa-verification' },

  // 기업회원 라우트 / Company routes
  { from: '/talents', to: '/company/talents' },
];

/**
 * 지역 리다이렉트를 건너뛰어야 하는 경로 접두사 목록
 * Path prefixes that should skip geo redirect
 */
const GEO_REDIRECT_SKIP_PREFIXES = [
  '/international',  // 이미 인터내셔널 페이지 (무한 루프 방지) / Already on international page (prevent infinite loop)
  '/api/',           // API 라우트 / API routes
  '/_next/',         // Next.js 정적 파일 / Next.js static files
  '/diagnosis',      // 비자 진단 페이지 (목표 페이지) / Visa diagnosis page (goal page)
  '/worker/',        // 인증된 근로자 사용자 / Authenticated worker users
  '/company/',       // 인증된 기업 사용자 / Authenticated company users
  '/admin/',         // 관리자 사용자 / Admin users
];

/**
 * 지역 리다이렉트를 건너뛰어야 하는 정확한 경로 목록
 * Exact paths that should skip geo redirect
 */
const GEO_REDIRECT_SKIP_EXACT = [
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

/**
 * 한국 국가 코드 / South Korea country code
 * Next.js Edge Runtime의 request.geo 또는 Vercel/Cloudflare 헤더에서 사용
 * Used with request.geo from Next.js Edge Runtime or Vercel/Cloudflare headers
 */
const KOREA_COUNTRY_CODE = 'KR';

/**
 * 사용자의 국가 코드를 추출하는 함수
 * Extracts the user's country code from various sources
 *
 * 우선순위 / Priority:
 * 1. Next.js request.geo (Vercel Edge에서 자동 제공 / Auto-provided on Vercel Edge)
 * 2. CF-IPCountry 헤더 (Cloudflare 프록시 사용 시 / When behind Cloudflare proxy)
 * 3. X-Vercel-IP-Country 헤더 (Vercel 배포 시 / On Vercel deployments)
 *
 * @returns 국가 코드 문자열 또는 null / Country code string or null
 */
function getCountryCode(request: NextRequest): string | null {
  // 1. Next.js request.geo (Edge Runtime에서 사용 가능) / Available in Edge Runtime
  // Next.js 16에서는 request.geo가 더 이상 직접 제공되지 않을 수 있음
  // In Next.js 16, request.geo may no longer be directly available
  const geo = (request as NextRequest & { geo?: { country?: string } }).geo;
  if (geo?.country) {
    return geo.country;
  }

  // 2. Cloudflare 프록시 헤더 / Cloudflare proxy header
  const cfCountry = request.headers.get('cf-ipcountry');
  if (cfCountry) {
    return cfCountry.toUpperCase();
  }

  // 3. Vercel IP 국가 헤더 / Vercel IP country header
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  if (vercelCountry) {
    return vercelCountry.toUpperCase();
  }

  // 국가 코드를 판별할 수 없는 경우 null 반환
  // Return null if country code cannot be determined
  return null;
}

/**
 * 해당 경로가 지역 리다이렉트를 건너뛰어야 하는지 확인
 * Check if the given pathname should skip geo redirect
 */
function shouldSkipGeoRedirect(pathname: string): boolean {
  // 접두사 기반 건너뛰기 / Prefix-based skip
  for (const prefix of GEO_REDIRECT_SKIP_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix)) {
      return true;
    }
  }

  // 정확한 경로 기반 건너뛰기 / Exact path skip
  if (GEO_REDIRECT_SKIP_EXACT.includes(pathname)) {
    return true;
  }

  // 정적 파일 확장자 건너뛰기 (이미지, 폰트 등)
  // Skip static file extensions (images, fonts, etc.)
  if (/\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|css|js|map)$/.test(pathname)) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * ── 1단계: IP 기반 지역 리다이렉트 ──
   * ── Step 1: IP-based geo redirect ──
   *
   * 한국 외 IP에서 접속한 사용자를 /international로 리다이렉트
   * Redirect users accessing from non-Korean IPs to /international
   */
  if (!shouldSkipGeoRedirect(pathname)) {
    // 쿠키로 우회 설정 확인 (사용자가 "한국 사이트로 이동" 선택 시)
    // Check bypass cookie (set when user chooses "Continue to Korean Site")
    const bypassCookie = request.cookies.get('bypass_geo_redirect');
    const isBypassed = bypassCookie?.value === 'true';

    if (!isBypassed) {
      const countryCode = getCountryCode(request);

      // 국가 코드가 판별 가능하고 한국이 아닌 경우 리다이렉트
      // Redirect if country code is determinable and NOT South Korea
      if (countryCode && countryCode !== KOREA_COUNTRY_CODE) {
        const internationalUrl = new URL('/international', request.url);
        return NextResponse.redirect(internationalUrl, 302);
      }
    }
  }

  /**
   * ── 2단계: 레거시 라우트 리다이렉트 ──
   * ── Step 2: Legacy route redirect ──
   *
   * 루트 레벨의 레거시 라우트를 역할별 네임스페이스로 영구 리다이렉트(301)
   * Permanently redirect root-level legacy routes to role-based namespaces (301)
   */
  for (const rule of REDIRECT_MAP) {
    // 정확 매칭 또는 접두사 매칭 / Exact match or prefix match
    if (pathname === rule.from || pathname.startsWith(rule.from + '/')) {
      // 하위 경로 보존 / Preserve sub-paths
      const subPath = pathname.slice(rule.from.length);
      const searchParams = request.nextUrl.search;
      const url = new URL(rule.to + subPath + searchParams, request.url);
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

/**
 * 미들웨어 매처 설정 / Middleware matcher configuration
 *
 * 아래 경로에 미들웨어를 적용:
 * Apply middleware to these paths:
 * - '/' : 루트 경로 (지역 리다이렉트 대상) / Root path (geo redirect target)
 * - 공개 페이지 경로 / Public page paths
 * - 레거시 리다이렉트 경로 / Legacy redirect paths
 *
 * 제외 경로 (Next.js 내부 매칭):
 * Excluded paths (Next.js internal matching):
 * - /api/, /_next/, 정적 파일 등 / /api/, /_next/, static files, etc.
 */
export const config = {
  matcher: [
    // 루트 경로 / Root path
    '/',
    // 공개 페이지 (지역 리다이렉트 대상) / Public pages (geo redirect targets)
    '/alba/:path*',
    '/fulltime/:path*',
    '/recruit-info/:path*',
    '/privacy-policy/:path*',
    '/terms-and-conditions/:path*',
    // 레거시 리다이렉트 경로 / Legacy redirect paths
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
