import { unwrapBackendResponse } from '@/lib/proxy-utils';
import { NextRequest, NextResponse } from 'next/server';

// 캐싱 방지: 매 요청마다 새로 실행 / Prevent caching: run fresh on every request
export const dynamic = 'force-dynamic';

// 백엔드 URL 환경변수 / Backend URL from environment variable
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// 공통 헤더 추출 함수 / Helper to extract common proxy headers
function buildHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 쿠키 전달 / Forward cookies
  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  // Authorization 헤더 전달 (sessionId Bearer 토큰) / Forward Authorization header (sessionId Bearer token)
  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  return headers;
}

// 백엔드 응답의 set-cookie를 프록시 응답에 복사 / Copy set-cookie from backend response
function applyCookies(
  backendResponse: Response,
  nextResponse: NextResponse
): NextResponse {
  const setCookie = backendResponse.headers.get('set-cookie');
  if (setCookie) {
    nextResponse.headers.set('set-cookie', setCookie);
  }
  return nextResponse;
}

// GET /api/scraps/[...path] → GET http://localhost:8000/scraps/[...path]
// 스크랩 목록 조회 및 스크랩 체크 / Fetch scrap list or check scrap status
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  // 쿼리 파라미터 보존 (page, limit 등) / Preserve query params (page, limit, etc.)
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/scraps/${path.join('/')}${searchParams ? `?${searchParams}` : ''}`;

  const headers = buildHeaders(request);

  try {
    const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });

    const contentType = response.headers.get('content-type') || '';
    // 비JSON 응답 그대로 전달 / Pass through non-JSON responses
    if (!contentType.includes('application/json')) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(Buffer.from(buffer), {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(buffer.byteLength),
        },
      });
    }

    const rawData = await response.json();
    const data = unwrapBackendResponse(rawData);
    const nextResponse = NextResponse.json(data, { status: response.status });
    return applyCookies(response, nextResponse);
  } catch (error) {
    // 네트워크 오류 처리 / Handle network error
    const message = error instanceof Error ? error.message : 'Proxy error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/scraps/[...path] → POST http://localhost:8000/scraps/[...path]
// 스크랩 토글 (추가/제거) / Toggle scrap (add or remove)
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/scraps/${path.join('/')}`;

  const contentType = request.headers.get('content-type') || '';
  const isMultipart = contentType.includes('multipart/form-data');

  const headers = buildHeaders(request);
  // multipart는 Content-Type 자동 설정 / Let fetch handle multipart Content-Type boundary
  if (isMultipart) {
    delete headers['Content-Type'];
    headers['Content-Type'] = contentType;
  }

  try {
    let body: BodyInit | null = null;
    if (isMultipart) {
      body = request.body;
    } else {
      body = await request.text();
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(isMultipart ? { duplex: 'half' as any } : {}),
    });

    const resContentType = response.headers.get('content-type') || '';
    if (!resContentType.includes('application/json')) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(Buffer.from(buffer), {
        status: response.status,
        headers: {
          'Content-Type': resContentType,
          'Content-Length': String(buffer.byteLength),
        },
      });
    }

    const rawData = await response.json();
    const data = unwrapBackendResponse(rawData);
    const nextResponse = NextResponse.json(data, { status: response.status });
    return applyCookies(response, nextResponse);
  } catch (error) {
    // 네트워크 오류 처리 / Handle network error
    const message = error instanceof Error ? error.message : 'Proxy error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/scraps/[...path] → DELETE http://localhost:8000/scraps/[...path]
// 스크랩 명시적 삭제 (필요 시) / Explicit scrap deletion (if needed)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/scraps/${path.join('/')}`;

  const headers = buildHeaders(request);

  try {
    const response = await fetch(url, { method: 'DELETE', headers, cache: 'no-store' });

    const resContentType = response.headers.get('content-type') || '';
    if (!resContentType.includes('application/json')) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(Buffer.from(buffer), {
        status: response.status,
        headers: {
          'Content-Type': resContentType,
          'Content-Length': String(buffer.byteLength),
        },
      });
    }

    const rawData = await response.json();
    const data = unwrapBackendResponse(rawData);
    const nextResponse = NextResponse.json(data, { status: response.status });
    return applyCookies(response, nextResponse);
  } catch (error) {
    // 네트워크 오류 처리 / Handle network error
    const message = error instanceof Error ? error.message : 'Proxy error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
