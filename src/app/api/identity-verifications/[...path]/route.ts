import { unwrapBackendResponse } from '@/lib/proxy-utils';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: 'GET' | 'POST',
) {
  const { path } = await context.params;
  if (!path.length || path.some((segment) => !/^[A-Za-z0-9_-]+$/.test(segment))) {
    return NextResponse.json(
      { message: 'Invalid identity verification API path' },
      { status: 400 },
    );
  }

  const url = `${BACKEND_URL}/identity-verifications/${path.join('/')}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const cookie = request.headers.get('cookie');
  const authorization = request.headers.get('authorization');
  if (cookie) headers.Cookie = cookie;
  if (authorization) headers.Authorization = authorization;
  const origin = request.headers.get('origin');
  if (origin) headers.Origin = origin;
  const referer = request.headers.get('referer');
  if (referer) headers.Referer = referer;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: method === 'POST' ? await request.text() : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
    const contentType = response.headers.get('content-type') || '';
    const raw = contentType.includes('application/json')
      ? await response.json()
      : { message: 'Identity verification service returned an invalid response' };
    const payload = response.ok ? unwrapBackendResponse(raw) : raw;
    return NextResponse.json(payload, {
      status: response.status,
      headers: { 'Cache-Control': 'no-store, private' },
    });
  } catch {
    return NextResponse.json(
      { message: 'Identity verification service is unavailable' },
      { status: 502 },
    );
  }
}

export function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxy(request, context, 'GET');
}

export function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxy(request, context, 'POST');
}
