import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

/**
 * Stripe 결제 상태 API 엔드포인트
 * Stripe Payment Status API endpoint
 *
 * 사용자의 전문 진단 결제 상태를 조회하고 업데이트한다.
 * Checks and updates the user's professional diagnosis payment status.
 *
 * GET  /api/diagnosis/paid-status → 결제 상태 조회 / Check payment status
 * POST /api/diagnosis/paid-status → 결제 상태 업데이트 / Update payment status
 */

// 백엔드 프록시 경로 / Backend proxy path
const BACKEND_PATH = '/api/diagnosis/paid-status';

/**
 * GET /api/diagnosis/paid-status
 *
 * 현재 사용자의 전문 진단 결제 여부를 확인한다.
 * Checks if the current user has paid for professional diagnosis.
 *
 * 인증 필수: 쿠키 및 Authorization 헤더를 백엔드로 전달한다.
 * Authentication required: forwards cookies and Authorization header to backend.
 *
 * 응답 예시 / Response example:
 * {
 *   paid: boolean,
 *   diagnosisType?: string,
 *   paidAt?: string
 * }
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return proxyToBackend(request, BACKEND_PATH, 'GET', {
    errorMessage: '결제 상태 조회 실패 / Failed to check payment status',
  });
}

/**
 * POST /api/diagnosis/paid-status
 *
 * Stripe 결제 성공 후 사용자의 진단 결제 상태를 업데이트한다.
 * Updates the user's diagnosis payment status after successful Stripe payment.
 *
 * 요청 본문 / Request body:
 * {
 *   sessionId: string,      // Stripe 세션 ID / Stripe session ID
 *   userId: string,         // 사용자 ID / User ID
 *   diagnosisType: string   // 진단 유형 / Diagnosis type
 * }
 *
 * 인증 필수: 쿠키 및 Authorization 헤더를 백엔드로 전달한다.
 * Authentication required: forwards cookies and Authorization header to backend.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  return proxyToBackend(request, BACKEND_PATH, 'POST', {
    errorMessage: '결제 상태 업데이트 실패 / Failed to update payment status',
  });
}
