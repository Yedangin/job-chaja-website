import { NextRequest, NextResponse } from 'next/server';

// 캐싱 방지: 매 요청마다 새로 실행 / Prevent caching: run fresh on every request
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * 알바 API 프록시 / Alba API proxy
 * /api/alba/* → Backend /api/alba/*
 */
async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string,
) {
  const { path } = await context.params;
  const search = request.nextUrl.search;
  // 디버그: path 확인 / Debug: check path params
  console.log(`[Proxy Alba DEBUG] path params:`, JSON.stringify(path));
  const url = `${BACKEND_URL}/api/alba/${path.join('/')}${search}`;
  console.log(`[Proxy Alba DEBUG] target URL:`, url);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;
  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  try {
    const options: RequestInit = { method, headers };
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      options.body = await request.text();
    }

    console.log(`[Proxy Alba] ${method} ${url}`);
    options.cache = 'no-store';
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(`[Proxy Alba] Response status: ${response.status}`);

    const nextResponse = NextResponse.json(data, { status: response.status });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) nextResponse.headers.set('set-cookie', setCookie);

    return nextResponse;
  } catch (error) {
    console.error(`[Proxy Alba ${method}] Error:`, error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  // 디버그: 라우트 히트 테스트 / Debug: route hit test
  const { path } = await context.params;
  if (path[0] === '_test') {
    return NextResponse.json({ hit: true, path, url: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/alba/${path.join('/')}` });
  }
  return proxyRequest(request, context, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context, 'DELETE');
}
