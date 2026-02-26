import { NextRequest, NextResponse } from 'next/server';

// 캐싱 방지: 매 요청마다 새로 실행 / Prevent caching: run fresh on every request
export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * 비자 인증 API 프록시 — /api/visa-verification/* → backend /visa-verification/*
 * Visa verification API proxy — supports both JSON and multipart (OCR upload)
 */
async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
  method: string,
) {
  const { path } = await context.params;
  const search = request.nextUrl.search;
  const pathStr = path && path.length > 0 ? `/${path.join('/')}` : '';
  const url = `${BACKEND_URL}/visa-verification${pathStr}${search}`;

  const headers: Record<string, string> = {};

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;
  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  try {
    const contentType = request.headers.get('content-type') || '';
    const options: RequestInit = { method, headers };

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (contentType.includes('multipart/form-data')) {
        // OCR 업로드: multipart 그대로 전달 / Forward multipart for OCR upload
        const formData = await request.formData();
        options.body = formData;
        // Content-Type은 자동 설정됨 (boundary 포함) / Auto-set with boundary
      } else {
        headers['Content-Type'] = 'application/json';
        options.body = await request.text();
      }
    } else {
      headers['Content-Type'] = 'application/json';
    }

    options.headers = headers;
    options.cache = 'no-store';
    const response = await fetch(url, options);
    const data = await response.json();

    const nextResponse = NextResponse.json(data, { status: response.status });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) nextResponse.headers.set('set-cookie', setCookie);

    return nextResponse;
  } catch (error) {
    console.error(`[Proxy VisaVerification ${method}] Error:`, error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
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
