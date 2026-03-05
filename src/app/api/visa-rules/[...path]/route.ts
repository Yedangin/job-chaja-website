import { NextRequest } from 'next/server';
import { proxyToBackend, buildBackendPath } from '@/lib/api-proxy';

/**
 * 비자 규정 API 프록시 — /api/visa-rules/* -> 백엔드 /visa-rules/*
 * Visa rules API proxy — /api/visa-rules/* -> backend /visa-rules/*
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/visa-rules', path), 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/visa-rules', path), 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/visa-rules', path), 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/visa-rules', path), 'DELETE');
}
