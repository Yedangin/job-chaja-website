import { NextRequest } from 'next/server';
import { proxyToBackend, buildBackendPath } from '@/lib/api-proxy';

/**
 * 정규직 비자 API 프록시 — /api/fulltime-visa/* -> 백엔드 /fulltime-visa/*
 * Fulltime visa API proxy — /api/fulltime-visa/* -> backend /fulltime-visa/*
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/fulltime-visa', path), 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/fulltime-visa', path), 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/fulltime-visa', path), 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/fulltime-visa', path), 'DELETE');
}
