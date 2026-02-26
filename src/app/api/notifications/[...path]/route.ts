import { NextRequest, NextResponse } from 'next/server';

// 캐싱 방지: 매 요청마다 새로 실행 / Prevent caching: run fresh on every request
export const dynamic = 'force-dynamic';

// 백엔드 기본 URL / Backend base URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// 공통 헤더 빌더 / Common headers builder
function buildHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  return headers;
}

/**
 * GET /api/notifications/[...path]
 * 알림 목록 및 읽지 않은 알림 수 조회 프록시
 * Proxy for fetching notification list and unread count
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  // 쿼리 파라미터 포함 URL 생성 / Build URL including query params
  const queryString = request.nextUrl.search;
  const url = `${BACKEND_URL}/notifications/${path.join('/')}${queryString}`;

  const headers = buildHeaders(request);

  try {
    const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });

    // 바이너리 응답 처리 / Handle binary response
    const contentType = response.headers.get('content-type') || '';
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

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    // 쿠키 전달 / Forward cookies
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      nextResponse.headers.set('set-cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Proxy error', detail: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications/[...path]
 * 단일 알림 읽음 처리 및 전체 읽음 처리 프록시
 * Proxy for marking single or all notifications as read
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/notifications/${path.join('/')}`;

  const headers = buildHeaders(request);

  try {
    const body = await request.text();
    const response = await fetch(url, { method: 'PATCH', headers, body, cache: 'no-store' });

    const contentType = response.headers.get('content-type') || '';
    // 응답 본문이 비어있을 수 있음 (204 No Content) / Response body may be empty (204)
    if (!contentType.includes('application/json')) {
      return new NextResponse(null, { status: response.status });
    }

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      nextResponse.headers.set('set-cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Proxy error', detail: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications/[...path]
 * 알림 생성 프록시 (어드민 용도 등)
 * Proxy for creating notifications (admin usage, etc.)
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/notifications/${path.join('/')}`;

  const headers = buildHeaders(request);

  try {
    const body = await request.text();
    const response = await fetch(url, { method: 'POST', headers, body, cache: 'no-store' });
    const data = await response.json();

    const nextResponse = NextResponse.json(data, { status: response.status });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      nextResponse.headers.set('set-cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Proxy error', detail: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[...path]
 * 알림 삭제 프록시
 * Proxy for deleting notifications
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/notifications/${path.join('/')}`;

  const headers = buildHeaders(request);

  try {
    const response = await fetch(url, { method: 'DELETE', headers, cache: 'no-store' });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new NextResponse(null, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proxy error', detail: String(error) },
      { status: 500 }
    );
  }
}
