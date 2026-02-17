import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * 이력서 API 프록시 — /api/resumes/* → backend /resumes/*
 * Resume API proxy — forwards to NestJS backend
 * [[...path]] 선택적 catch-all: POST /api/resumes 도 매칭
 */
async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
  method: string,
) {
  const { path } = await context.params;
  const search = request.nextUrl.search;
  const pathStr = path && path.length > 0 ? `/${path.join('/')}` : '';
  const url = `${BACKEND_URL}/resumes${pathStr}${search}`;

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

    const response = await fetch(url, options);
    const data = await response.json();

    const nextResponse = NextResponse.json(data, { status: response.status });
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) nextResponse.headers.set('set-cookie', setCookie);

    return nextResponse;
  } catch (error) {
    console.error(`[Proxy Resumes ${method}] Error:`, error);
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  return proxyRequest(request, context, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  return proxyRequest(request, context, 'DELETE');
}
