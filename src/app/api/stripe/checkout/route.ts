import { NextRequest, NextResponse } from 'next/server';

/**
 * Stripe 체크아웃 세션 생성 API / Stripe Checkout Session creation API
 *
 * POST /api/stripe/checkout
 *
 * 요청 본문 / Request body:
 * - userId: 사용자 ID (선택) / User ID (optional)
 * - email: 사용자 이메일 / User email
 * - diagnosisType: 진단 유형 / Diagnosis type (e.g., "PROFESSIONAL")
 *
 * 환경변수 / Environment variables:
 * - STRIPE_SECRET_KEY: Stripe 시크릿 키 (서버 전용) / Stripe secret key (server-side only)
 * - NEXT_PUBLIC_BASE_URL: 프론트엔드 기본 URL / Frontend base URL (e.g., https://jobchaja.com)
 */

// Stripe SDK는 서버 전용이므로 동적 import 사용
// Stripe SDK is server-only, so we use dynamic import via fetch to Stripe API directly
const STRIPE_API_URL = 'https://api.stripe.com/v1';

/**
 * 유료 진단 상품 정보 / Paid diagnosis product information
 * 실제 운영 시에는 Stripe 대시보드에서 미리 생성된 Product/Price ID를 사용하세요.
 * In production, use pre-created Product/Price IDs from the Stripe Dashboard.
 */
const PAID_DIAGNOSIS_PRODUCT = {
  name: '전문 비자 상담 / Professional Visa Consultation',
  description:
    '전문가의 1:1 맞춤 비자 상담 서비스입니다. 상세한 경로 분석, 서류 준비 가이드, Q&A가 포함됩니다. / Professional 1:1 customized visa consultation service including detailed pathway analysis, document preparation guide, and Q&A.',
  // 금액: 49,900원 (KRW) / Amount: 49,900 KRW
  amount: 49900,
  currency: 'krw',
};

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('[Stripe Checkout] STRIPE_SECRET_KEY 환경변수 미설정 / Environment variable not set');
      return NextResponse.json(
        { error: 'Stripe 설정 오류 / Stripe configuration error' },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { userId, email, diagnosisType } = body;

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다. / Email is required.' },
        { status: 400 },
      );
    }

    // 기본 URL 결정 / Determine base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Stripe Checkout Session 생성 / Create Stripe Checkout Session
    const params = new URLSearchParams();
    params.append('mode', 'payment');
    params.append('payment_method_types[]', 'card');
    params.append('line_items[0][price_data][currency]', PAID_DIAGNOSIS_PRODUCT.currency);
    params.append(
      'line_items[0][price_data][product_data][name]',
      PAID_DIAGNOSIS_PRODUCT.name,
    );
    params.append(
      'line_items[0][price_data][product_data][description]',
      PAID_DIAGNOSIS_PRODUCT.description,
    );
    params.append(
      'line_items[0][price_data][unit_amount]',
      String(PAID_DIAGNOSIS_PRODUCT.amount),
    );
    params.append('line_items[0][quantity]', '1');
    params.append('customer_email', email);
    params.append(
      'success_url',
      `${baseUrl}/diagnosis/paid/success?session_id={CHECKOUT_SESSION_ID}`,
    );
    params.append('cancel_url', `${baseUrl}/diagnosis/paid`);
    params.append('metadata[userId]', userId || '');
    params.append('metadata[diagnosisType]', diagnosisType || 'PROFESSIONAL');
    params.append('metadata[email]', email);

    const stripeResponse = await fetch(`${STRIPE_API_URL}/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error('[Stripe Checkout] 세션 생성 실패 / Session creation failed:', session.error);
      return NextResponse.json(
        {
          error:
            session.error?.message ||
            '결제 세션 생성에 실패했습니다. / Failed to create checkout session.',
        },
        { status: stripeResponse.status },
      );
    }

    // 세션 URL 반환 / Return session URL
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[Stripe Checkout] 서버 오류 / Server error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. / Internal server error.' },
      { status: 500 },
    );
  }
}
