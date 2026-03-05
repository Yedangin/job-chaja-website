import { NextRequest, NextResponse } from 'next/server';

/**
 * 지역/국가 감지 API 엔드포인트
 * Region/Country detection API endpoint
 *
 * 사용자의 IP 주소를 기반으로 국가/지역 정보를 반환한다.
 * Returns country/region information based on the user's IP address.
 *
 * 이 엔드포인트는 프론트엔드의 지역 기반 리다이렉트 로직을 지원한다.
 * This endpoint supports the frontend's geo-redirect logic.
 */

// 한국 IP 대역 (간이 판별) / Korean IP ranges (simplified detection)
// 실제 운영 환경에서는 nginx의 GeoIP 모듈이나 Cloudflare 헤더를 활용 권장
// In production, consider using nginx GeoIP module or Cloudflare headers
const KOREA_COUNTRY_CODES = ['KR', 'kr'];

/**
 * 요청에서 클라이언트 IP 주소를 추출한다.
 * Extracts the client IP address from the request.
 *
 * 우선순위: x-forwarded-for → x-real-ip → 기본값
 * Priority: x-forwarded-for → x-real-ip → default
 */
function extractClientIp(request: NextRequest): string {
  // 프록시/로드밸런서에서 전달하는 IP / IP forwarded by proxy/load balancer
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for는 쉼표로 구분된 IP 목록일 수 있음 (첫 번째가 원본 IP)
    // x-forwarded-for can be a comma-separated list (first is the original IP)
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  // nginx 등에서 설정하는 실제 IP / Real IP set by nginx etc.
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  // 기본값 (로컬 개발 환경 등) / Default (local dev environment, etc.)
  return '127.0.0.1';
}

/**
 * 요청 헤더에서 국가 코드를 감지한다.
 * Detects the country code from request headers.
 *
 * Cloudflare, AWS CloudFront, Vercel 등의 CDN/프록시에서 제공하는
 * 지역 헤더를 우선 확인하고, 없으면 Accept-Language 헤더를 참고한다.
 *
 * Checks geo headers provided by CDN/proxies like Cloudflare, AWS CloudFront,
 * Vercel first, then falls back to Accept-Language header.
 */
function detectCountry(request: NextRequest): string {
  // Cloudflare 헤더 / Cloudflare header
  const cfCountry = request.headers.get('cf-ipcountry');
  if (cfCountry) return cfCountry.toUpperCase();

  // Vercel 헤더 / Vercel header
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  if (vercelCountry) return vercelCountry.toUpperCase();

  // AWS CloudFront 헤더 / AWS CloudFront header
  const cloudfrontCountry = request.headers.get('cloudfront-viewer-country');
  if (cloudfrontCountry) return cloudfrontCountry.toUpperCase();

  // nginx GeoIP 모듈 헤더 / nginx GeoIP module header
  const geoipCountry = request.headers.get('x-country-code');
  if (geoipCountry) return geoipCountry.toUpperCase();

  // Accept-Language 헤더 기반 추정 (폴백) / Estimate from Accept-Language header (fallback)
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const primaryLang = acceptLanguage.split(',')[0].trim().toLowerCase();
    if (primaryLang.startsWith('ko')) return 'KR';
    if (primaryLang.startsWith('ja')) return 'JP';
    if (primaryLang.startsWith('zh')) return 'CN';
    if (primaryLang.startsWith('en')) return 'US';
  }

  // 감지 불가 시 기본값 / Default when detection fails
  return 'UNKNOWN';
}

/**
 * GET /api/geo
 *
 * 사용자의 IP 주소와 감지된 국가 정보를 반환한다.
 * Returns the user's IP address and detected country information.
 *
 * 응답 형식 / Response format:
 * {
 *   country: string,    // 국가 코드 / Country code (e.g., 'KR', 'US')
 *   isKorean: boolean,  // 한국 사용자 여부 / Whether the user is from Korea
 *   ip: string          // 감지된 IP 주소 / Detected IP address
 * }
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = extractClientIp(request);
    const country = detectCountry(request);
    const isKorean = KOREA_COUNTRY_CODES.includes(country) ||
      country === 'KR';

    return NextResponse.json({
      country,
      isKorean,
      ip,
    });
  } catch {
    // 에러 발생 시 기본값 반환 / Return defaults on error
    return NextResponse.json(
      {
        country: 'UNKNOWN',
        isKorean: false,
        ip: '0.0.0.0',
        error: '지역 감지 실패 / Failed to detect region',
      },
      { status: 500 },
    );
  }
}
