import { NextRequest } from 'next/server';
import { proxyToBackend, buildBackendPath } from '@/lib/api-proxy';

/**
 * 결제 API 프록시 — /api/payments/* -> 백엔드 /payments/*
 * Payment API proxy — /api/payments/* -> backend /payments/*
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/payments', path), 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/payments', path), 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/payments', path), 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/payments', path), 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/payments', path), 'PATCH');
}
