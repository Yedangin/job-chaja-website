export interface PortOnePaymentConfiguration {
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: 'CURRENCY_KRW';
}

export function getPortOnePaymentConfiguration(
  value: unknown,
): PortOnePaymentConfiguration {
  if (!value || typeof value !== 'object') {
    throw new Error(
      '결제 서버가 올바른 결제 정보를 반환하지 않았습니다.',
    );
  }

  const checkout = value as Record<string, unknown>;
  const storeId = typeof checkout.storeId === 'string' ? checkout.storeId : '';
  const channelKey =
    typeof checkout.channelKey === 'string' ? checkout.channelKey : '';
  const paymentId =
    typeof checkout.paymentId === 'string' ? checkout.paymentId : '';
  const orderName =
    typeof checkout.orderName === 'string' ? checkout.orderName.trim() : '';
  const totalAmount = checkout.totalAmount;

  if (
    !/^store-[A-Za-z0-9-]{10,}$/.test(storeId) ||
    !/^channel-key-[A-Za-z0-9-]{10,}$/.test(channelKey) ||
    !/^[A-Za-z0-9_-]{16,64}$/.test(paymentId) ||
    !orderName ||
    orderName.length > 100 ||
    !Number.isSafeInteger(totalAmount) ||
    (totalAmount as number) <= 0 ||
    checkout.currency !== 'KRW'
  ) {
    throw new Error('결제 서버가 올바른 결제 정보를 반환하지 않았습니다.');
  }

  return {
    storeId,
    channelKey,
    paymentId,
    orderName,
    totalAmount: totalAmount as number,
    currency: 'CURRENCY_KRW',
  };
}

export function getPortOnePaymentError(
  response: { code?: string; message?: string } | undefined,
): string {
  if (response?.code === 'USER_CANCEL') {
    return '결제가 취소되었습니다.';
  }

  return response?.message
    ? `결제에 실패했습니다: ${response.message}`
    : '결제에 실패했습니다. 잠시 후 다시 시도해주세요.';
}

export function assertPortOnePaymentResponse(
  response: { paymentId?: string },
  expectedPaymentId: string,
): void {
  if (response.paymentId !== expectedPaymentId) {
    throw new Error('결제 응답이 현재 주문과 일치하지 않습니다.');
  }
}
