import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = `${BACKEND_URL}/profile/${path.join('/')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;

  console.log('[Proxy Profile GET]', url);

  try {
    const response = await fetch(url, { method: 'GET', headers });
    const data = await response.json();

    console.log('[Proxy Profile GET] Backend status:', response.status);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Proxy Profile GET] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
