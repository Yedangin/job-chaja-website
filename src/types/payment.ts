export type PaymentStatusType = 'IDLE' | 'PENDING' | 'FAILED' | 'PAID';

export interface PaymentStatus {
  status: PaymentStatusType;
  message?: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
}

export interface PaymentCompleteResponse {
  status: PaymentStatusType;
  paymentId: string;
}
