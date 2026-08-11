import { unwrapBackendResponse } from '@/lib/proxy-utils';
import { NextRequest, NextResponse } from 'next/server';

// 캐싱 방지: 매 요청마다 새로 실행 / Prevent caching: run fresh on every request
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * 결제 API 프록시 — /api/payments/* → /payments/*
 * Payment API proxy — /api/payments/* → /payments/*
 */
async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string,
) {
  const { path } = await context.params;
  if (!path.length || path.some((segment) => !/^[A-Za-z0-9_-]+$/.test(segment))) {
    return NextResponse.json({ message: 'Invalid payment API path' }, { status: 400 });
  }

  const search = request.nextUrl.search;
  const url = `${BACKEND_URL}/payments/${path.join('/')}${search}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;
  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;
  const origin = request.headers.get('origin');
  if (origin) headers.Origin = origin;
  const referer = request.headers.get('referer');
  if (referer) headers.Referer = referer;

  try {
    const options: RequestInit = { method, headers };
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      options.body = await request.text();
    }

    options.cache = 'no-store';
    options.signal = AbortSignal.timeout(15_000);
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    const rawData = contentType.includes('application/json')
      ? await response.json()
      : { message: 'Payment service returned an invalid response' };
    const data = response.ok ? unwrapBackendResponse(rawData) : rawData;

    const nextResponse = NextResponse.json(data, {
      status: response.status,
      headers: { 'Cache-Control': 'no-store, private' },
    });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) nextResponse.headers.set('set-cookie', setCookie);

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: 'Payment service is unavailable' },
      { status: 502 },
    );
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context, 'PATCH');
}
