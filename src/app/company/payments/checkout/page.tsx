'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as PortOne from '@portone/browser-sdk/v2';

/**
 * 공통 결제 페이지 / Common payment checkout page
 *
 * URL params:
 * - productCode: 상품 코드 (JOB_PREMIUM, VIEW_10, etc.)
 * - targetJobId: 대상 공고 ID (공고 관련 상품만)
 */
export default function PaymentCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productCode = searchParams.get('productCode') || '';
  const targetJobId = searchParams.get('targetJobId') || '';

  const [product, setProduct] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<any>(null);
  const [finalAmount, setFinalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 상품 정보 조회 / Load product info
  useEffect(() => {
    if (!productCode) return;
    fetch(`/api/payments/products/${productCode}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError('상품 정보를 불러올 수 없습니다.');
          return;
        }
        setProduct(data);
        setFinalAmount(data.price);
      })
      .catch(() => setError('상품 정보를 불러올 수 없습니다.'));
  }, [productCode]);

  // 쿠폰 적용 / Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch(
        `/api/payments/coupons/validate?code=${couponCode}&product=${product?.category || ''}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setCouponResult(null);
        setDiscount(0);
        setFinalAmount(product?.price || 0);
        setError(data.message || '유효하지 않은 쿠폰입니다.');
        return;
      }
      setCouponResult(data);

      // 할인 계산 / Calculate discount
      let discountAmt = 0;
      if (data.type === 'FIXED_DISCOUNT') {
        discountAmt = Math.min(data.value, product.price);
      } else if (data.type === 'PERCENT_DISCOUNT') {
        discountAmt = Math.floor(product.price * (data.value / 100));
      }
      setDiscount(discountAmt);
      setFinalAmount(Math.max(0, product.price - discountAmt));
      setError('');
    } catch {
      setError('쿠폰 검증에 실패했습니다.');
    }
  };

  // 결제하기 / Process payment
  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      // 1. 주문 생성 / Create order
      const orderRes = await fetch('/api/payments/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode,
          targetJobId: targetJobId ? parseInt(targetJobId) : undefined,
          couponCode: couponResult ? couponCode : undefined,
        }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) {
        setError(order.message || '주문 생성에 실패했습니다.');
        setLoading(false);
        return;
      }

      // 2. 포트원 V2 결제창 호출 / Open PortOne V2 checkout
      const paymentResponse = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || '',
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || '',
        paymentId: order.orderNo,
        orderName: order.productName,
        totalAmount: order.totalAmount,
        currency: 'CURRENCY_KRW',
        payMethod: 'CARD',
      });

      if (!paymentResponse || paymentResponse.code) {
        // 사용자 취소 또는 결제 실패 / User cancelled or payment failed
        const msg =
          paymentResponse?.code === 'USER_CANCEL'
            ? '결제가 취소되었습니다.'
            : '결제에 실패했습니다. 다시 시도해주세요.';
        setError(msg);
        setLoading(false);
        return;
      }

      // 3. 결제 확인 / Confirm payment
      const confirmRes = await fetch(`/api/payments/orders/${order.orderId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portonePaymentId: paymentResponse.paymentId,
        }),
      });
      const confirmData = await confirmRes.json();

      if (!confirmRes.ok) {
        setError(
          '결제 확인 중 문제가 발생했습니다. 고객센터에 문의해주세요.',
        );
        setLoading(false);
        return;
      }

      // 4. 성공 → 결과 페이지 / Success → result page
      const successParams = new URLSearchParams({
        orderId: String(order.orderId),
        productCode,
        productName: order.productName || '',
      });
      router.push(`/company/payments/success?${successParams.toString()}`);
    } catch (err) {
      setError('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!productCode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">상품 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">결제하기</h1>

        {/* 주문 요약 / Order summary */}
        {product && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h2 className="font-semibold text-lg mb-3">주문 요약</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">{product.name}</span>
              <span>{product.price.toLocaleString()}원</span>
            </div>
            {product.description && (
              <p className="text-sm text-gray-500 mb-3">
                {product.description}
              </p>
            )}
          </div>
        )}

        {/* 쿠폰 입력 / Coupon input */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-lg mb-3">쿠폰</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="쿠폰 코드 입력"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
            >
              적용
            </button>
          </div>
          {couponResult && (
            <div className="mt-2 text-sm text-green-600">
              {couponResult.name} 적용됨 (-{discount.toLocaleString()}원)
            </div>
          )}
        </div>

        {/* 최종 금액 / Final amount */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">최종 결제 금액</span>
            <span className="text-2xl font-bold text-blue-600">
              {finalAmount.toLocaleString()}원
            </span>
          </div>
          {discount > 0 && (
            <div className="text-sm text-gray-500 text-right mt-1">
              {product?.price.toLocaleString()}원 - {discount.toLocaleString()}원
              할인
            </div>
          )}
        </div>

        {/* 에러 메시지 / Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* 결제 버튼 / Payment button */}
        <button
          onClick={handlePayment}
          disabled={loading || !product}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? '결제 처리 중...' : `${finalAmount.toLocaleString()}원 결제하기`}
        </button>

        <button
          onClick={() => router.back()}
          className="w-full mt-3 text-gray-500 py-2 text-sm hover:text-gray-700"
        >
          취소
        </button>
      </div>
    </div>
  );
}
