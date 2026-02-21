'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard, Receipt, Loader2, Package, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Clock, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/** 주문 항목 / Order item */
interface OrderItem {
  id: string;
  orderNo: string;
  productCode: string;
  snapshotProductName: string;
  snapshotOriginalPrice: number;
  snapshotDiscountPrice: number;
  paidAmount: number;
  paymentStatus: string;
  paidAt: string | null;
  createdAt: string;
  jobPosting?: { id: string; title: string; status: string } | null;
}

/** 결제 상태 스타일 / Payment status styles */
const STATUS_STYLE: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  PAID: { label: '결제완료', icon: CheckCircle2, color: 'text-green-600' },
  PENDING: { label: '대기중', icon: Clock, color: 'text-yellow-600' },
  FAILED: { label: '실패', icon: XCircle, color: 'text-red-500' },
  CANCELLED: { label: '취소/환불', icon: XCircle, color: 'text-gray-500' },
};

/**
 * 기업 결제 내역 페이지 / Company payment history page
 * GET /api/payment/orders/my 연동 / Connects to GET /api/payment/orders/my
 */
export default function CompanyPaymentsPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '20' });
        const res = await fetch(`/api/payment/orders/my?${params}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.items || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const filtered = statusFilter ? orders.filter(o => o.paymentStatus === statusFilter) : orders;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 / Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">결제 관리</h1>
        <div className="flex items-center gap-2">
          <Link href="/company/payments/credits">
            <Button variant="outline" size="sm" className="text-xs gap-1"><CreditCard className="w-3 h-3" /> 열람권 구매</Button>
          </Link>
        </div>
      </div>

      {/* 빠른 링크 카드 / Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Link href="/company/payments/credits" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition text-center">
          <CreditCard className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">열람권 구매</p>
        </Link>
        <Link href="/company/payments/checkout?product=JOB_PREMIUM" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition text-center">
          <Package className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">프리미엄 공고</p>
        </Link>
        <Link href="/company/mypage/coupons" className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition text-center">
          <Receipt className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-700">쿠폰함</p>
        </Link>
      </div>

      {/* 필터 탭 / Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { value: '', label: '전체' },
          { value: 'PAID', label: '결제완료' },
          { value: 'PENDING', label: '대기중' },
          { value: 'CANCELLED', label: '취소/환불' },
        ].map(tab => (
          <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              statusFilter === tab.value
                ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 주문 목록 / Order list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">결제 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const st = STATUS_STYLE[order.paymentStatus] || STATUS_STYLE.PENDING;
            const Icon = st.icon;
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${st.color}`} />
                      <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>
                      <span className="text-xs text-gray-400">{order.orderNo}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{order.snapshotProductName}</p>
                    {order.jobPosting && (
                      <p className="text-xs text-gray-500 mt-0.5">연결 공고: {order.jobPosting.title}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {order.paidAt && ` | 결제: ${new Date(order.paidAt).toLocaleDateString('ko-KR')}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-bold text-gray-900">{order.paidAmount.toLocaleString()}원</p>
                    {order.snapshotOriginalPrice !== order.paidAmount && (
                      <p className="text-xs text-gray-400 line-through">{order.snapshotOriginalPrice.toLocaleString()}원</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 페이지네이션 / Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
