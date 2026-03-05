import { NextRequest } from 'next/server';
import { proxyToBackend, buildBackendPath } from '@/lib/api-proxy';

/**
 * 이력서 API 프록시 — /api/resumes/* -> 백엔드 /resumes/*
 * Resume API proxy — forwards to NestJS backend
 * [[...path]] 선택적 catch-all: POST /api/resumes 도 매칭
 * [[...path]] optional catch-all: also matches POST /api/resumes
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/resumes', path), 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/resumes', path), 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/resumes', path), 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/resumes', path), 'DELETE');
}
