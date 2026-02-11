import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/auth/${path.join('/')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  console.log('[Proxy GET]', url);

  // 소셜 로그인 시 userType 쿼리 파라미터 추출
  const userType = request.nextUrl.searchParams.get('userType');

  try {
    // redirect: 'manual' → 백엔드의 302 리다이렉트를 따라가지 않고 그대로 브라우저에 전달
    const response = await fetch(url, { method: 'GET', headers, redirect: 'manual' });

    // 3xx 리다이렉트 → 브라우저에 그대로 전달 (소셜 로그인 OAuth 흐름)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      console.log('[Proxy GET] Redirect:', response.status, location);
      if (location) {
        const redirectResponse = NextResponse.redirect(location, response.status);
        // 소셜 로그인 시작 시 userType을 쿠키에 저장 → 콜백에서 읽기 위함
        if (userType) {
          redirectResponse.cookies.set('pending_user_type', userType, {
            path: '/',
            maxAge: 300, // 5분
            httpOnly: false,
          });
          console.log('[Proxy GET] Set pending_user_type cookie:', userType);
        }
        return redirectResponse;
      }
    }

    const data = await response.json();
    console.log('[Proxy GET] Backend status:', response.status);

    const nextResponse = NextResponse.json(data, { status: response.status });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      nextResponse.headers.set('set-cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error('[Proxy GET] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/auth/${path.join('/')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  console.log('[Proxy PUT]', url);

  try {
    const body = await request.text();
    const response = await fetch(url, { method: 'PUT', headers, body });
    const data = await response.json();

    console.log('[Proxy PUT] Backend status:', response.status);

    const nextResponse = NextResponse.json(data, { status: response.status });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      nextResponse.headers.set('set-cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error('[Proxy PUT] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/auth/${path.join('/')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  console.log('[Proxy POST]', url);

  try {
    const body = await request.text();
    const response = await fetch(url, { method: 'POST', headers, body });
    const data = await response.json();

    console.log('[Proxy POST] Backend status:', response.status);

    const nextResponse = NextResponse.json(data, { status: response.status });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      nextResponse.headers.set('set-cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error('[Proxy POST] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
