import { NextRequest, NextResponse } from 'next/server';

/**
 * 공통 API 프록시 유틸리티
 * Shared API proxy utility
 *
 * 모든 API 라우트에서 공통으로 사용하는 백엔드 프록시 로직을 추출한 모듈.
 * Extracts the common backend proxy logic used across all API routes.
 */

// 백엔드 URL / Backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * 요청 헤더에서 인증/쿠키 정보를 추출하여 전달용 헤더를 구성한다.
 * Extracts auth/cookie info from request headers and builds forwarding headers.
 */
function buildForwardHeaders(
  request: NextRequest,
  options?: { includeContentType?: boolean },
): Record<string, string> {
  const headers: Record<string, string> = {};

  // 기본 Content-Type 설정 / Default Content-Type
  if (options?.includeContentType !== false) {
    headers['Content-Type'] = 'application/json';
  }

  // 쿠키 전달 / Forward cookies
  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  // 인증 헤더 전달 / Forward authorization header
  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  // 익명 사용자 ID 전달 / Forward anonymous user ID
  const anonId = request.headers.get('x-anonymous-id');
  if (anonId) headers['X-Anonymous-Id'] = anonId;

  return headers;
}

/**
 * 백엔드 응답의 set-cookie 헤더를 NextResponse에 전달한다.
 * Forwards set-cookie headers from the backend response to NextResponse.
 */
function forwardSetCookie(
  backendResponse: Response,
  nextResponse: NextResponse,
): void {
  const setCookie = backendResponse.headers.get('set-cookie');
  if (setCookie) {
    nextResponse.headers.set('set-cookie', setCookie);
  }
}

/**
 * 백엔드 서버로 요청을 프록시하는 공통 함수.
 * Common function to proxy requests to the backend server.
 *
 * @param request - Next.js 요청 객체 / Next.js request object
 * @param backendPath - 백엔드 경로 (예: '/api/diagnosis/paid-status') / Backend path
 * @param method - HTTP 메서드 / HTTP method
 * @param options - 추가 옵션 / Additional options
 * @returns NextResponse
 */
export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
  method: string,
  options?: {
    /** 쿼리 문자열 포함 여부 (기본: true) / Whether to include query string (default: true) */
    includeQueryString?: boolean;
    /** 커스텀 에러 메시지 / Custom error message */
    errorMessage?: string;
    /** 에러 시 HTTP 상태 코드 (기본: 502) / HTTP status code on error (default: 502) */
    errorStatus?: number;
  },
): Promise<NextResponse> {
  // 쿼리 문자열 처리 / Handle query string
  const includeQuery = options?.includeQueryString !== false;
  const search = includeQuery ? request.nextUrl.search : '';
  const url = `${BACKEND_URL}${backendPath}${search}`;

  // 전달 헤더 구성 / Build forwarding headers
  const headers = buildForwardHeaders(request);

  try {
    const fetchOptions: RequestInit = { method, headers };

    // POST, PUT, PATCH, DELETE 요청 시 본문 전달 / Forward body for mutation methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      fetchOptions.body = await request.text();
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    // 응답 생성 및 쿠키 전달 / Create response and forward cookies
    const nextResponse = NextResponse.json(data, { status: response.status });
    forwardSetCookie(response, nextResponse);

    return nextResponse;
  } catch {
    // 프록시 에러 처리 / Handle proxy error
    const errorMessage =
      options?.errorMessage || '프록시 오류 / Proxy error';
    const errorStatus = options?.errorStatus || 502;

    return NextResponse.json(
      { error: errorMessage },
      { status: errorStatus },
    );
  }
}

/**
 * 동적 경로 파라미터에서 백엔드 경로를 구성하는 헬퍼.
 * Helper to build a backend path from dynamic route parameters.
 *
 * @param basePath - 기본 백엔드 경로 (예: '/payment') / Base backend path
 * @param pathSegments - 경로 세그먼트 배열 / Path segments array
 * @returns 완성된 백엔드 경로 / Complete backend path
 */
export function buildBackendPath(
  basePath: string,
  pathSegments?: string[],
): string {
  const subPath = pathSegments ? `/${pathSegments.join('/')}` : '';
  return `${basePath}${subPath}`;
}

/**
 * 요청 헤더를 추출하여 반환 (외부에서 직접 사용 가능).
 * Extracts and returns forwarding headers (for external direct use).
 */
export { buildForwardHeaders };
