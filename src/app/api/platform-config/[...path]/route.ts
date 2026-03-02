import { NextRequest, NextResponse } from 'next/server';
import { unwrapBackendResponse } from '@/lib/proxy-utils';

// API 프록시는 캐싱 금지 / API proxy must not be cached
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string,
) {
  const { path } = await context.params;
  const search = request.nextUrl.search;
  const url = `${BACKEND_URL}/platform-config/${path.join('/')}${search}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  try {
    const response = await fetch(url, { method, headers, cache: 'no-store' });
    const rawData = await response.json();
    const data = unwrapBackendResponse(rawData);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`[Proxy PlatformConfig ${method}] Error:`, error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context, 'GET');
}
