import { unwrapBackendResponse } from '@/lib/proxy-utils';
import { NextRequest, NextResponse } from 'next/server';

// 프로필 API는 캐싱하면 안됨 / Profile APIs must NOT be cached
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// 공통 헤더 빌더 / Common headers builder
function buildHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 쿠키 전달 (httpOnly 세션 쿠키 포함) / Forward cookies (including httpOnly session cookie)
  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  // Authorization 헤더 전달 / Forward Authorization header
  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  return headers;
}

// 백엔드 응답의 set-cookie를 프록시 응답에 복사 + 캐시 방지 헤더 설정
// Copy set-cookie from backend response to proxy response + set no-cache headers
function forwardHeaders(backendResponse: Response, nextResponse: NextResponse): NextResponse {
  const setCookie = backendResponse.headers.get('set-cookie');
  if (setCookie) {
    nextResponse.headers.set('set-cookie', setCookie);
  }
  // 브라우저 캐시 방지 / Prevent browser caching
  nextResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  nextResponse.headers.set('Pragma', 'no-cache');
  nextResponse.headers.set('Expires', '0');
  return nextResponse;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const search = request.nextUrl.search;
  const url = `${BACKEND_URL}/profile/${path.join('/')}${search}`;

  const headers = buildHeaders(request);

  try {
    const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
    const rawData = await response.json();
    const data = unwrapBackendResponse(rawData);

    const nextResponse = NextResponse.json(data, { status: response.status });
    return forwardHeaders(response, nextResponse);
  } catch (error) {
    console.error('[Proxy Profile GET] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/profile/${path.join('/')}`;

  const headers = buildHeaders(request);

  try {
    const body = await request.text();
    const response = await fetch(url, { method: 'POST', headers, body, cache: 'no-store' });
    const rawData = await response.json();
    const data = unwrapBackendResponse(rawData);

    const nextResponse = NextResponse.json(data, { status: response.status });
    return forwardHeaders(response, nextResponse);
  } catch (error) {
    console.error('[Proxy Profile POST] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/profile/${path.join('/')}`;

  const headers = buildHeaders(request);

  try {
    const body = await request.text();
    const response = await fetch(url, { method: 'PUT', headers, body, cache: 'no-store' });
    const rawData = await response.json();
    const data = unwrapBackendResponse(rawData);

    const nextResponse = NextResponse.json(data, { status: response.status });
    return forwardHeaders(response, nextResponse);
  } catch (error) {
    console.error('[Proxy Profile PUT] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/profile/${path.join('/')}`;

  const headers = buildHeaders(request);

  try {
    const response = await fetch(url, { method: 'DELETE', headers, cache: 'no-store' });
    const rawData = await response.json();
    const data = unwrapBackendResponse(rawData);

    const nextResponse = NextResponse.json(data, { status: response.status });
    return forwardHeaders(response, nextResponse);
  } catch (error) {
    console.error('[Proxy Profile DELETE] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
