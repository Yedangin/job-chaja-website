'use client';

/**
 * 기업회원 탈퇴 페이지 / Company account withdrawal page
 * - 진행 중인 공고 및 미사용 열람권 체크리스트 안내
 * - 탈퇴 사유 선택 + 확인 텍스트 입력 후 탈퇴 가능
 * - 탈퇴 전 PENDING 결제 및 ACTIVE 공고 존재 여부 확인
 * - Checklist for active jobs and unused credits before withdrawal
 * - Reason selection + confirmation text input to enable withdrawal
 * - Checks pending payments and active job postings before withdrawal
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserX, Loader2, AlertTriangle, ChevronDown, CreditCard, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

// 탈퇴 확인 텍스트 상수 / Confirmation text constant
const CONFIRM_TEXT = '탈퇴합니다';

// 탈퇴 사유 목록 / Withdrawal reason options
const WITHDRAW_REASONS: { value: string; label: string }[] = [
  { value: 'no_hiring',      label: '현재 채용 계획이 없습니다 / No current hiring plans' },
  { value: 'service_issue',  label: '서비스 이용에 불편함이 있었습니다 / Service was inconvenient' },
  { value: 'cost',           label: '비용 부담이 있습니다 / Cost concerns' },
  { value: 'found_other',    label: '다른 채용 서비스를 이용합니다 / Using a different service' },
  { value: 'temp_pause',     label: '잠시 휴업 중입니다 / Temporarily closed' },
  { value: 'etc',            label: '기타 / Other' },
];

// 탈퇴 전 체크리스트 항목 / Pre-withdrawal checklist items
const CHECKLIST_ITEMS: { icon: string; text: string; textEn: string }[] = [
  {
    icon: '📋',
    text:   '진행 중인 공고는 즉시 비공개 처리됩니다.',
    textEn: 'All active job postings will be immediately unpublished.',
  },
  {
    icon: '💳',
    text:   '미사용 열람권 및 프리미엄 잔여 기간은 환불되지 않습니다.',
    textEn: 'Unused viewing credits and premium time will not be refunded.',
  },
  {
    icon: '📁',
    text:   '공고, 지원자 데이터, 메시지 내역이 모두 삭제됩니다.',
    textEn: 'All job posts, applicant data, and messages will be deleted.',
  },
  {
    icon: '⏳',
    text:   '탈퇴 신청 후 90일이 지나면 계정이 완전히 삭제됩니다.',
    textEn: 'Your account will be permanently deleted after 90 days.',
  },
  {
    icon: '🔒',
    text:   '동일 사업자 번호로 재가입 시 이전 데이터를 복구할 수 없습니다.',
    textEn: 'Previous data cannot be recovered if you re-register with the same business number.',
  },
];

export default function CompanyWithdrawPage() {
  const router = useRouter();

  // 탈퇴 사유 / Selected withdrawal reason
  const [reason, setReason]         = useState('');
  // 기타 사유 텍스트 / Other reason text
  const [otherReason, setOtherReason] = useState('');
  // 확인 텍스트 입력 / Confirmation text input
  const [confirmInput, setConfirmInput] = useState('');
  // 약관 동의 체크박스 / Terms agreement checkbox
  const [agreed, setAgreed]         = useState(false);
  // 처리 중 상태 / Processing state
  const [loading, setLoading]       = useState(false);

  // 진행 중 결제 확인 상태 / Pending payment check state
  const [checkingPending, setCheckingPending] = useState(true);
  const [hasPendingPayment, setHasPendingPayment] = useState(false);
  // 활성 공고 확인 상태 / Active job check state
  const [hasActiveJob, setHasActiveJob] = useState(false);

  // 마운트 시 PENDING 결제 및 ACTIVE 공고 동시 확인 / Check pending payments and active jobs on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          setCheckingPending(false);
          return;
        }
        const headers = { Authorization: `Bearer ${sessionId}` };

        // 병렬로 PENDING 결제 + ACTIVE 공고 확인 / Check pending payments and active jobs in parallel
        const [paymentRes, jobRes] = await Promise.allSettled([
          fetch('/api/payments/orders?status=PENDING&limit=1', { headers }),
          fetch('/api/jobs/my/list?status=ACTIVE&limit=1', { headers }),
        ]);

        // PENDING 결제 체크 / Check pending payment result
        if (paymentRes.status === 'fulfilled' && paymentRes.value.ok) {
          const data = await paymentRes.value.json();
          const list = Array.isArray(data) ? data : (data.orders ?? []);
          setHasPendingPayment(list.length > 0);
        }

        // ACTIVE 공고 체크 / Check active job result
        if (jobRes.status === 'fulfilled' && jobRes.value.ok) {
          const data = await jobRes.value.json();
          const list = Array.isArray(data) ? data : (data.jobs ?? data.items ?? []);
          setHasActiveJob(list.length > 0);
        }
      } finally {
        setCheckingPending(false);
      }
    };
    checkStatus();
  }, []);

  // 탈퇴 버튼 활성화 조건 / Withdrawal button enablement condition
  // PENDING 결제가 있으면 탈퇴 버튼 비활성화 / Disabled when pending payment exists
  const canWithdraw =
    reason !== '' &&
    agreed &&
    confirmInput === CONFIRM_TEXT &&
    !loading &&
    !hasPendingPayment;

  // 탈퇴 핸들러 / Withdrawal handler
  const handleWithdraw = async () => {
    if (!canWithdraw) return;
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({
          reason:      reason === 'etc' ? otherReason : reason,
          userType:    'company',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { message?: string }).message || '탈퇴 처리에 실패했습니다.');

      // 탈퇴 성공 → 로컬 스토리지 정리 후 홈 이동 / Success → clear storage and redirect
      localStorage.removeItem('sessionId');
      toast.success('탈퇴 신청이 완료되었습니다. 이용해 주셔서 감사합니다.');
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '탈퇴 처리에 실패했습니다.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-red-600">회원 탈퇴</h1>
        <p className="text-sm text-gray-500 mt-0.5">Account Withdrawal</p>
      </div>

      {/* ── PENDING 결제 경고 배너 / Pending payment warning banner ── */}
      {!checkingPending && hasPendingPayment && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800 mb-1">
                진행 중인 결제가 있습니다 / Pending payment detected
              </p>
              <p className="text-sm text-amber-700 mb-3">
                현재 처리 중인 결제 1건이 있습니다. 결제 완료 또는 취소 후 탈퇴를 진행해 주세요.
                <br />
                <span className="text-xs text-amber-600">
                  Please complete or cancel your pending payment before withdrawing.
                </span>
              </p>
              <a
                href="/company/payments/history"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-lg transition"
              >
                <CreditCard className="w-3.5 h-3.5" />
                결제 내역 확인하기 / View Payments
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── 활성 공고 안내 배너 / Active job notice banner ── */}
      {!checkingPending && hasActiveJob && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800 mb-1">
                게시 중인 공고가 있습니다 / Active job postings exist
              </p>
              <p className="text-sm text-blue-700">
                탈퇴하면 공고가 자동으로 비공개 처리됩니다.
                <br />
                <span className="text-xs text-blue-500">
                  All active job postings will be automatically unpublished upon withdrawal.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 경고 박스 / Warning box ── */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800 mb-3">
              탈퇴 전 꼭 확인하세요 / Please read carefully before withdrawing:
            </p>
            {/* 체크리스트 항목 / Checklist items */}
            <ul className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item.text} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="shrink-0 mt-0.5">{item.icon}</span>
                  <span>
                    {item.text}
                    <br />
                    <span className="text-red-500 text-xs">{item.textEn}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── 탈퇴 폼 / Withdrawal form ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">

        {/* 탈퇴 사유 선택 / Withdrawal reason selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            탈퇴 사유 <span className="text-red-500">*</span>{' '}
            <span className="text-gray-400 font-normal">/ Withdrawal Reason</span>
          </label>
          <div className="relative">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-red-400 transition text-gray-700"
            >
              <option value="" disabled>
                탈퇴 사유를 선택해주세요 / Select a reason
              </option>
              {WITHDRAW_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {/* 드롭다운 아이콘 / Dropdown icon */}
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* 기타 사유 입력란 / Other reason input */}
          {reason === 'etc' && (
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="기타 사유를 입력해주세요 / Please describe your reason"
              rows={3}
              maxLength={200}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition resize-none"
            />
          )}
        </div>

        {/* 약관 동의 체크박스 / Terms agreement checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-red-500"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            위 내용을 모두 확인했으며, 회원 탈퇴에 동의합니다.
            <br />
            <span className="text-gray-400 text-xs">
              I have read the above and agree to withdraw my company account.
            </span>
          </span>
        </label>

        {/* 확인 텍스트 입력 / Confirmation text input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            아래 칸에{' '}
            <span className="text-red-600 font-bold">"{CONFIRM_TEXT}"</span>
            를 입력하세요{' '}
            <span className="text-gray-400 font-normal">/ Type to confirm</span>
          </label>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={`"${CONFIRM_TEXT}" 입력`}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
              confirmInput === CONFIRM_TEXT
                ? 'border-red-400 ring-red-300 bg-red-50'
                : 'border-gray-300 focus:ring-red-400'
            }`}
          />
          {/* 입력 일치 여부 표시 / Input match indicator */}
          {confirmInput.length > 0 && (
            <p
              className={`text-xs mt-1.5 ${
                confirmInput === CONFIRM_TEXT
                  ? 'text-red-500 font-semibold'
                  : 'text-gray-400'
              }`}
            >
              {confirmInput === CONFIRM_TEXT
                ? '확인 텍스트가 일치합니다.'
                : `"${CONFIRM_TEXT}"를 정확히 입력해주세요.`}
            </p>
          )}
        </div>

        {/* 탈퇴 버튼 / Withdrawal button */}
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={!canWithdraw || checkingPending}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              처리 중... / Processing...
            </>
          ) : checkingPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              상태 확인 중... / Checking...
            </>
          ) : (
            <>
              <UserX className="w-4 h-4" />
              회원 탈퇴 신청 / Request Withdrawal
            </>
          )}
        </button>

        {/* 버튼 비활성화 안내 / Disabled button hints */}
        {!canWithdraw && !loading && !checkingPending && (
          <p className="text-xs text-center text-gray-400">
            {hasPendingPayment
              ? '진행 중인 결제가 완료 또는 취소되어야 탈퇴가 가능합니다.'
              : reason === ''
              ? '탈퇴 사유를 선택해주세요.'
              : !agreed
              ? '위 내용에 동의해주세요.'
              : confirmInput !== CONFIRM_TEXT
              ? `"${CONFIRM_TEXT}"를 입력하면 버튼이 활성화됩니다.`
              : ''}
          </p>
        )}
      </div>
    </div>
  );
}
