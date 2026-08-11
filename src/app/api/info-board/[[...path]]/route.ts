import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

type RouteContext = { params: Promise<{ path?: string[] }> };

function unwrapProxyPayload(value: unknown): unknown {
  let current = value;
  for (let depth = 0; depth < 3; depth += 1) {
    if (typeof current !== 'object' || current === null || Array.isArray(current)) break;
    const record = current as Record<string, unknown>;
    if (record.data !== undefined) {
      current = record.data;
      continue;
    }
    if (record.body !== undefined) {
      current = record.body;
      continue;
    }
    break;
  }
  return current;
}

function forwardHeader(request: NextRequest, headers: Headers, name: string) {
  const value = request.headers.get(name);
  if (value) headers.set(name, value);
}

async function proxyInfoBoard(request: NextRequest, context: RouteContext, method: string) {
  const { path = [] } = await context.params;
  const suffix = path.length ? `/${path.map(encodeURIComponent).join('/')}` : '';
  const url = `${BACKEND_URL}/info-board${suffix}${request.nextUrl.search}`;
  const headers = new Headers();
  forwardHeader(request, headers, 'cookie');
  forwardHeader(request, headers, 'authorization');
  forwardHeader(request, headers, 'origin');
  forwardHeader(request, headers, 'referer');
  forwardHeader(request, headers, 'x-csrf-token');

  const contentType = request.headers.get('content-type');
  let body: BodyInit | null | undefined;
  if (!['GET', 'HEAD'].includes(method)) {
    if (contentType) headers.set('content-type', contentType);
    body = request.body;
  }

  try {
    const options: RequestInit & { duplex?: 'half' } = {
      method,
      headers,
      body,
      cache: 'no-store',
    };
    if (body) options.duplex = 'half';
    const response = await fetch(url, options);
    const responseType = response.headers.get('content-type') || '';
    const responseHeaders = new Headers({ 'Cache-Control': 'no-store' });
    if (responseType) responseHeaders.set('Content-Type', responseType);
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) responseHeaders.set('Content-Disposition', contentDisposition);

    if (!responseType.includes('application/json')) {
      if (!responseType) responseHeaders.set('Content-Type', 'application/octet-stream');
      return new NextResponse(await response.arrayBuffer(), {
        status: response.status,
        headers: responseHeaders,
      });
    }

    const raw = await response.json().catch(() => null);
    const payload = unwrapProxyPayload(raw);
    const nextResponse = NextResponse.json(payload, { status: response.status, headers: responseHeaders });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) nextResponse.headers.set('set-cookie', setCookie);
    return nextResponse;
  } catch {
    return NextResponse.json(
      { error: 'The notice backend is not reachable.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxyInfoBoard(request, context, 'GET');
}

export function POST(request: NextRequest, context: RouteContext) {
  return proxyInfoBoard(request, context, 'POST');
}

export function PUT(request: NextRequest, context: RouteContext) {
  return proxyInfoBoard(request, context, 'PUT');
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return proxyInfoBoard(request, context, 'PATCH');
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return proxyInfoBoard(request, context, 'DELETE');
}
