import { NextRequest } from 'next/server';
import { proxyToBackend, buildBackendPath } from '@/lib/api-proxy';

/**
 * 프로필 API 프록시 — /api/profile/* -> 백엔드 /profile/*
 * Profile API proxy — /api/profile/* -> backend /profile/*
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/profile', path), 'GET');
}
