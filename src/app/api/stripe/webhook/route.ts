import { NextRequest, NextResponse } from 'next/server';

/**
 * Stripe 웹훅 핸들러 / Stripe Webhook Handler
 *
 * POST /api/stripe/webhook
 *
 * Stripe에서 결제 이벤트가 발생하면 이 엔드포인트로 알림을 보냅니다.
 * Stripe sends payment event notifications to this endpoint.
 *
 * 처리하는 이벤트 / Handled events:
 * - checkout.session.completed: 체크아웃 세션 완료 / Checkout session completed
 * - payment_intent.succeeded: 결제 인텐트 성공 / Payment intent succeeded
 *
 * 환경변수 / Environment variables:
 * - STRIPE_WEBHOOK_SECRET: 웹훅 서명 검증용 시크릿 / Webhook signature verification secret
 * - STRIPE_SECRET_KEY: Stripe 시크릿 키 (서버 전용) / Stripe secret key (server-side only)
 * - BACKEND_URL: 백엔드 API URL / Backend API URL
 */

const STRIPE_API_URL = 'https://api.stripe.com/v1';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * HMAC-SHA256을 사용하여 Stripe 웹훅 서명을 검증합니다.
 * Verifies the Stripe webhook signature using HMAC-SHA256.
 *
 * Stripe의 서명 형식: t=timestamp,v1=signature
 * Stripe signature format: t=timestamp,v1=signature
 */
async function verifyStripeSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  try {
    // 서명 헤더 파싱 / Parse signature header
    const elements = signatureHeader.split(',');
    const timestampElement = elements.find((e) => e.startsWith('t='));
    const signatureElement = elements.find((e) => e.startsWith('v1='));

    if (!timestampElement || !signatureElement) {
      console.error('[Stripe Webhook] 서명 헤더 형식 오류 / Invalid signature header format');
      return false;
    }

    const timestamp = timestampElement.substring(2);
    const expectedSignature = signatureElement.substring(3);

    // 타임스탬프 검증 (5분 이내) / Verify timestamp (within 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const signatureTime = parseInt(timestamp, 10);
    if (Math.abs(currentTime - signatureTime) > 300) {
      console.error('[Stripe Webhook] 서명 타임스탬프 만료 / Signature timestamp expired');
      return false;
    }

    // 서명 생성 및 비교 / Generate and compare signature
    const signedPayload = `${timestamp}.${payload}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));

    // ArrayBuffer를 hex 문자열로 변환 / Convert ArrayBuffer to hex string
    const computedSignature = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // 타이밍 안전 비교 / Timing-safe comparison
    if (computedSignature.length !== expectedSignature.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < computedSignature.length; i++) {
      result |= computedSignature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    return result === 0;
  } catch (error) {
    console.error('[Stripe Webhook] 서명 검증 오류 / Signature verification error:', error);
    return false;
  }
}

/**
 * checkout.session.completed 이벤트 처리 / Handle checkout.session.completed event
 *
 * 결제가 완료되면 백엔드에 확인 요청을 보냅니다.
 * Sends a confirmation request to the backend when payment is completed.
 */
async function handleCheckoutSessionCompleted(session: Record<string, unknown>) {
  const metadata = session.metadata as Record<string, string> | undefined;
  const customerEmail = (session.customer_email as string) || metadata?.email || '';
  const userId = metadata?.userId || '';
  const diagnosisType = metadata?.diagnosisType || 'PROFESSIONAL';

  console.log(
    `[Stripe Webhook] 체크아웃 완료 / Checkout completed: sessionId=${session.id}, email=${customerEmail}`,
  );

  // 백엔드에 결제 확인 요청 / Send payment confirmation to backend
  try {
    const confirmResponse = await fetch(`${BACKEND_URL}/payments/stripe/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent,
        customerEmail,
        userId,
        diagnosisType,
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
      }),
    });

    if (!confirmResponse.ok) {
      const errorData = await confirmResponse.json().catch(() => ({}));
      console.error(
        '[Stripe Webhook] 백엔드 확인 실패 / Backend confirmation failed:',
        errorData,
      );
    } else {
      console.log('[Stripe Webhook] 백엔드 확인 성공 / Backend confirmation successful');
    }
  } catch (error) {
    console.error('[Stripe Webhook] 백엔드 요청 오류 / Backend request error:', error);
  }
}

/**
 * payment_intent.succeeded 이벤트 처리 / Handle payment_intent.succeeded event
 *
 * 결제 인텐트 성공 시 로그를 남깁니다.
 * Logs when a payment intent succeeds.
 */
async function handlePaymentIntentSucceeded(paymentIntent: Record<string, unknown>) {
  console.log(
    `[Stripe Webhook] 결제 인텐트 성공 / Payment intent succeeded: id=${paymentIntent.id}`,
  );
  // checkout.session.completed에서 이미 처리하므로 여기서는 로그만 남김
  // Already handled in checkout.session.completed, so we only log here
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error(
        '[Stripe Webhook] STRIPE_WEBHOOK_SECRET 환경변수 미설정 / Environment variable not set',
      );
      return NextResponse.json(
        { error: '웹훅 설정 오류 / Webhook configuration error' },
        { status: 500 },
      );
    }

    // 원본 요청 본문 읽기 (서명 검증을 위해 raw text 필요)
    // Read raw request body (raw text needed for signature verification)
    const payload = await request.text();

    // Stripe 서명 헤더 확인 / Check Stripe signature header
    const signatureHeader = request.headers.get('stripe-signature');
    if (!signatureHeader) {
      console.error('[Stripe Webhook] stripe-signature 헤더 누락 / Missing stripe-signature header');
      return NextResponse.json(
        { error: '서명이 누락되었습니다. / Missing signature.' },
        { status: 400 },
      );
    }

    // 서명 검증 / Verify signature
    const isValid = await verifyStripeSignature(payload, signatureHeader, webhookSecret);
    if (!isValid) {
      console.error('[Stripe Webhook] 서명 검증 실패 / Signature verification failed');
      return NextResponse.json(
        { error: '서명 검증에 실패했습니다. / Signature verification failed.' },
        { status: 400 },
      );
    }

    // 이벤트 파싱 / Parse event
    const event = JSON.parse(payload);
    const eventType = event.type as string;
    const eventData = event.data?.object as Record<string, unknown>;

    console.log(`[Stripe Webhook] 이벤트 수신 / Event received: ${eventType}`);

    // 이벤트 유형별 처리 / Handle by event type
    switch (eventType) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(eventData);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(eventData);
        break;

      default:
        console.log(`[Stripe Webhook] 미처리 이벤트 / Unhandled event: ${eventType}`);
    }

    // Stripe에 수신 확인 / Acknowledge receipt to Stripe
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[Stripe Webhook] 처리 오류 / Processing error:', error);
    return NextResponse.json(
      { error: '웹훅 처리 중 오류가 발생했습니다. / Error processing webhook.' },
      { status: 400 },
    );
  }
}
