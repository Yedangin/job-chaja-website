import { NextRequest, NextResponse } from 'next/server';

// 백엔드 URL / Backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * 진단 API 프록시 / Diagnosis API proxy
 * POST /api/diagnosis → POST http://localhost:8000/api/diagnosis
 * GET /api/diagnosis/history → GET http://localhost:8000/api/diagnosis/history
 * GET /api/diagnosis/:sessionId → GET http://localhost:8000/api/diagnosis/:sessionId
 * POST /api/diagnosis/:sessionId/click → POST http://localhost:8000/api/diagnosis/:sessionId/click
 */
async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
  method: string,
) {
  const { path } = await context.params;
  const search = request.nextUrl.search;
  const subPath = path ? `/${path.join('/')}` : '';
  const url = `${BACKEND_URL}/api/diagnosis${subPath}${search}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 쿠키/인증 전달 / Forward cookies/auth
  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;
  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;
  const anonId = request.headers.get('x-anonymous-id');
  if (anonId) headers['X-Anonymous-Id'] = anonId;

  try {
    const options: RequestInit = { method, headers };
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      options.body = await request.text();
    }

    const response = await fetch(url, options);
    const data = await response.json();

    const nextResponse = NextResponse.json(data, { status: response.status });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) nextResponse.headers.set('set-cookie', setCookie);

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: '진단 서버 연결 실패 / Failed to connect to diagnosis server' },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  return proxyRequest(request, context, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  return proxyRequest(request, context, 'POST');
}
