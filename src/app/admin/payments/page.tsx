'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * 결제 어드민 페이지 / Payment admin page
 *
 * 탭: 대시보드 | 주문관리 | 상품관리 | 쿠폰관리
 */

type Tab = 'dashboard' | 'orders' | 'products' | 'coupons';

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);

  // 대시보드 / Dashboard
  const [stats, setStats] = useState<any>(null);

  // 주문 / Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [orderFilter, setOrderFilter] = useState({ status: '', from: '', to: '' });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');

  // 상품 / Products
  const [products, setProducts] = useState<any[]>([]);

  // 쿠폰 / Coupons
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '', name: '', type: 'FIXED_DISCOUNT', value: 0,
    targetProduct: '', maxUses: 0, maxUsesPerUser: 1, expiresAt: '',
  });

  // ──── Data fetchers ────

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments/stats', { credentials: 'include' });
      if (res.ok) setStats(await res.json());
    } catch {}
    setLoading(false);
  };

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (orderFilter.status) params.set('status', orderFilter.status);
    if (orderFilter.from) params.set('from', orderFilter.from);
    if (orderFilter.to) params.set('to', orderFilter.to);
    try {
      const res = await fetch(`/api/admin/payments/orders?${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setOrderTotalPages(data.pagination?.totalPages || 1);
      }
    } catch {}
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments/products', { credentials: 'include' });
      if (res.ok) setProducts(await res.json());
    } catch {}
    setLoading(false);
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments/coupons', { credentials: 'include' });
      if (res.ok) setCoupons(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'dashboard') fetchStats();
    if (tab === 'orders') fetchOrders(orderPage);
    if (tab === 'products') fetchProducts();
    if (tab === 'coupons') fetchCoupons();
  }, [tab]);

  // ──── Actions ────

  const handleCancelOrder = async (orderId: number) => {
    if (!cancelReason.trim()) { alert('환불 사유를 입력하세요.'); return; }
    const res = await fetch(`/api/admin/payments/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reason: cancelReason }),
    });
    if (res.ok) {
      alert('환불 처리 완료');
      setCancelReason('');
      setSelectedOrder(null);
      fetchOrders(orderPage);
    } else {
      alert('환불 실패');
    }
  };

  const handleToggleProduct = async (id: number, isActive: boolean) => {
    await fetch(`/api/admin/payments/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchProducts();
  };

  const handleCreateCoupon = async () => {
    const res = await fetch('/api/admin/payments/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...couponForm,
        maxUses: couponForm.maxUses || undefined,
        expiresAt: couponForm.expiresAt || undefined,
      }),
    });
    if (res.ok) {
      setShowCouponForm(false);
      setCouponForm({ code: '', name: '', type: 'FIXED_DISCOUNT', value: 0, targetProduct: '', maxUses: 0, maxUsesPerUser: 1, expiresAt: '' });
      fetchCoupons();
    } else {
      alert('쿠폰 생성 실패');
    }
  };

  const handleToggleCoupon = async (id: number, isActive: boolean) => {
    await fetch(`/api/admin/payments/coupons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchCoupons();
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: '결제 대시보드' },
    { key: 'orders', label: '주문 관리' },
    { key: 'products', label: '상품 관리' },
    { key: 'coupons', label: '쿠폰 관리' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 / Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">결제 관리</h1>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">
            어드민 홈
          </Link>
        </div>
        {/* 탭 / Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                tab === t.key
                  ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
          </div>
        )}

        {/* ──── 대시보드 / Dashboard ──── */}
        {tab === 'dashboard' && stats && !loading && (
          <div className="space-y-6">
            {/* KPI 카드 / KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '오늘 매출', value: `${(stats.today?.revenue || 0).toLocaleString()}원`, sub: `${stats.today?.orderCount || 0}건` },
                { label: '주간 매출', value: `${(stats.weekly?.revenue || 0).toLocaleString()}원`, sub: `${stats.weekly?.orderCount || 0}건` },
                { label: '월간 매출', value: `${(stats.monthly?.revenue || 0).toLocaleString()}원`, sub: `${stats.monthly?.orderCount || 0}건` },
                { label: '월간 환불', value: `${(stats.monthly?.refundAmount || 0).toLocaleString()}원`, sub: `${stats.monthly?.refundCount || 0}건` },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-xl border p-4">
                  <div className="text-xs text-gray-400 mb-1">{kpi.label}</div>
                  <div className="text-lg font-bold text-gray-900">{kpi.value}</div>
                  <div className="text-xs text-gray-500">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* 상품별 매출 / Revenue by product */}
            {stats.revenueByProduct && stats.revenueByProduct.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-bold text-gray-900 mb-4">상품별 매출</h3>
                <table className="w-full text-sm">
                  <thead className="text-gray-400 border-b">
                    <tr>
                      <th className="text-left py-2">상품</th>
                      <th className="text-left py-2">카테고리</th>
                      <th className="text-right py-2">건수</th>
                      <th className="text-right py-2">매출</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.revenueByProduct.map((r: any) => (
                      <tr key={r.productCode} className="border-b border-gray-50">
                        <td className="py-2 font-medium">{r.productName}</td>
                        <td className="py-2 text-gray-500">{r.category}</td>
                        <td className="py-2 text-right">{r.orderCount}</td>
                        <td className="py-2 text-right font-medium">{r.totalRevenue.toLocaleString()}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ──── 주문 관리 / Order management ──── */}
        {tab === 'orders' && !loading && (
          <div className="space-y-4">
            {/* 필터 / Filters */}
            <div className="flex gap-3 flex-wrap">
              <select
                value={orderFilter.status}
                onChange={(e) => { setOrderFilter({ ...orderFilter, status: e.target.value }); setOrderPage(1); }}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">전체 상태</option>
                <option value="PENDING">대기중</option>
                <option value="PAID">결제완료</option>
                <option value="CANCELLED">취소됨</option>
              </select>
              <input
                type="date" value={orderFilter.from}
                onChange={(e) => setOrderFilter({ ...orderFilter, from: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="date" value={orderFilter.to}
                onChange={(e) => setOrderFilter({ ...orderFilter, to: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <button onClick={() => fetchOrders(1)} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold">
                검색
              </button>
            </div>

            {/* 주문 테이블 / Orders table */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left p-3">주문번호</th>
                    <th className="text-left p-3">상품</th>
                    <th className="text-left p-3">상태</th>
                    <th className="text-right p-3">금액</th>
                    <th className="text-left p-3">일시</th>
                    <th className="text-left p-3">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs">{o.orderNo}</td>
                      <td className="p-3">{o.productName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          o.status === 'PAID' ? 'bg-green-100 text-green-700' :
                          o.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">{o.totalAmount?.toLocaleString()}원</td>
                      <td className="p-3 text-gray-400 text-xs">
                        {new Date(o.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="text-blue-500 text-xs hover:underline"
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-400">주문 없음</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 / Pagination */}
            {orderTotalPages > 1 && (
              <div className="flex justify-center gap-2">
                {orderPage > 1 && (
                  <button onClick={() => { setOrderPage(orderPage - 1); fetchOrders(orderPage - 1); }}
                    className="px-3 py-1 border rounded text-sm">이전</button>
                )}
                <span className="px-3 py-1 text-sm text-gray-500">{orderPage}/{orderTotalPages}</span>
                {orderPage < orderTotalPages && (
                  <button onClick={() => { setOrderPage(orderPage + 1); fetchOrders(orderPage + 1); }}
                    className="px-3 py-1 border rounded text-sm">다음</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ──── 상품 관리 / Product management ──── */}
        {tab === 'products' && !loading && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left p-3">코드</th>
                  <th className="text-left p-3">이름</th>
                  <th className="text-left p-3">카테고리</th>
                  <th className="text-right p-3">가격</th>
                  <th className="text-center p-3">상태</th>
                  <th className="text-left p-3">관리</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-50">
                    <td className="p-3 font-mono text-xs">{p.code}</td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-gray-500">{p.category}</td>
                    <td className="p-3 text-right">{p.price.toLocaleString()}원</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleProduct(p.id, p.isActive)}
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {p.isActive ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button className="text-blue-500 text-xs hover:underline">수정</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ──── 쿠폰 관리 / Coupon management ──── */}
        {tab === 'coupons' && !loading && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowCouponForm(!showCouponForm)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold"
              >
                {showCouponForm ? '취소' : '+ 쿠폰 생성'}
              </button>
            </div>

            {/* 쿠폰 생성 폼 / Coupon create form */}
            {showCouponForm && (
              <div className="bg-white rounded-xl border p-6 space-y-3">
                <h3 className="font-bold text-gray-900 mb-2">새 쿠폰</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="코드 (예: SUMMER_20)"
                    value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm" />
                  <input placeholder="이름"
                    value={couponForm.name} onChange={(e) => setCouponForm({ ...couponForm, name: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm" />
                  <select value={couponForm.type}
                    onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm">
                    <option value="FIXED_DISCOUNT">정액 할인</option>
                    <option value="PERCENT_DISCOUNT">정률 할인</option>
                    <option value="FREE_ITEM">무료 아이템</option>
                  </select>
                  <input type="number" placeholder="값 (금액/퍼센트/건수)"
                    value={couponForm.value} onChange={(e) => setCouponForm({ ...couponForm, value: parseInt(e.target.value) || 0 })}
                    className="px-3 py-2 border rounded-lg text-sm" />
                  <input type="number" placeholder="최대 사용 횟수 (0=무제한)"
                    value={couponForm.maxUses} onChange={(e) => setCouponForm({ ...couponForm, maxUses: parseInt(e.target.value) || 0 })}
                    className="px-3 py-2 border rounded-lg text-sm" />
                  <input type="date" placeholder="만료일"
                    value={couponForm.expiresAt} onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm" />
                </div>
                <button onClick={handleCreateCoupon} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold">
                  생성
                </button>
              </div>
            )}

            {/* 쿠폰 테이블 / Coupon table */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left p-3">코드</th>
                    <th className="text-left p-3">이름</th>
                    <th className="text-left p-3">유형</th>
                    <th className="text-right p-3">값</th>
                    <th className="text-center p-3">사용률</th>
                    <th className="text-center p-3">상태</th>
                    <th className="text-left p-3">만료</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} className="border-t border-gray-50">
                      <td className="p-3 font-mono text-xs">{c.code}</td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3 text-gray-500 text-xs">{c.type}</td>
                      <td className="p-3 text-right">{c.value}</td>
                      <td className="p-3 text-center text-xs">
                        {c.usedCount}/{c.maxUses || '~'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleCoupon(c.id, c.isActive)}
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {c.isActive ? '활성' : '비활성'}
                        </button>
                      </td>
                      <td className="p-3 text-xs text-gray-400">
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('ko-KR') : '-'}
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-400">쿠폰 없음</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ──── 주문 상세 모달 / Order detail modal ──── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">주문 상세</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 text-xl">&times;</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">주문번호</span>
                <span className="font-mono">{selectedOrder.orderNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">상품</span>
                <span>{selectedOrder.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">상태</span>
                <span className="font-bold">{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">금액</span>
                <span>{selectedOrder.totalAmount?.toLocaleString()}원</span>
              </div>
              {selectedOrder.couponCode && (
                <div className="flex justify-between">
                  <span className="text-gray-400">쿠폰</span>
                  <span>{selectedOrder.couponCode}</span>
                </div>
              )}
              {selectedOrder.payment && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <div className="text-xs text-gray-400 mb-1">결제 정보</div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">포트원 ID</span>
                    <span className="font-mono text-xs">{selectedOrder.payment.portonePaymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">결제수단</span>
                    <span>{selectedOrder.payment.method || '-'}</span>
                  </div>
                </>
              )}
            </div>

            {/* 환불 / Refund */}
            {selectedOrder.status === 'PAID' && (
              <div className="mt-4 pt-4 border-t">
                <input
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="환불 사유 입력"
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-2"
                />
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="w-full py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600"
                >
                  환불 처리
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
