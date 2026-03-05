import { NextRequest } from 'next/server';
import { proxyToBackend, buildBackendPath } from '@/lib/api-proxy';

/**
 * 진단 API 프록시 / Diagnosis API proxy
 * POST /api/diagnosis -> POST http://localhost:8000/api/diagnosis
 * GET /api/diagnosis/history -> GET http://localhost:8000/api/diagnosis/history
 * GET /api/diagnosis/:sessionId -> GET http://localhost:8000/api/diagnosis/:sessionId
 * POST /api/diagnosis/:sessionId/click -> POST http://localhost:8000/api/diagnosis/:sessionId/click
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/api/diagnosis', path), 'GET', {
    errorMessage: '진단 서버 연결 실패 / Failed to connect to diagnosis server',
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await context.params;
  return proxyToBackend(request, buildBackendPath('/api/diagnosis', path), 'POST', {
    errorMessage: '진단 서버 연결 실패 / Failed to connect to diagnosis server',
  });
}
