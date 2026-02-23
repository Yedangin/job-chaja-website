'use client';

/**
 * 회원 탈퇴 / Account withdrawal
 */

import { useState } from 'react';
import { UserX, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function WorkerWithdrawPage() {
  const { logout } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!confirmed) return;
    setLoading(true);
    setError(null);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || '탈퇴 처리에 실패했습니다.');
      // 탈퇴 성공 → 로그아웃 처리 / Success → logout
      await logout();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '탈퇴 처리에 실패했습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-red-600">회원 탈퇴</h1>
        <p className="text-sm text-gray-500 mt-0.5">Account Withdrawal</p>
      </div>

      {/* 경고 박스 / Warning box */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 space-y-1">
            <p className="font-semibold">탈퇴 전 꼭 확인하세요 / Please read before withdrawing:</p>
            <ul className="list-disc list-inside space-y-1 text-red-700 mt-2">
              <li>탈퇴 신청 후 90일이 지나면 계정이 완전히 삭제됩니다.</li>
              <li>이력서, 지원 이력, 스크랩 데이터가 모두 삭제됩니다.</li>
              <li>동일 이메일로 재가입 시 이전 데이터를 복구할 수 없습니다.</li>
              <li>Your account will be permanently deleted after 90 days.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        {/* 확인 체크박스 / Confirmation checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-red-500"
          />
          <span className="text-sm text-gray-700">
            위 내용을 모두 확인했으며, 회원 탈퇴에 동의합니다.<br />
            <span className="text-gray-400">I have read the above and agree to withdraw my account.</span>
          </span>
        </label>

        {/* 비밀번호 확인 (이메일 계정만) / Password confirmation (email accounts) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            비밀번호 확인 <span className="text-gray-400 font-normal">/ Confirm Password</span>
            <span className="text-xs text-gray-400 font-normal ml-1">(소셜 로그인 계정은 생략 가능)</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            ⚠️ {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleWithdraw}
          disabled={!confirmed || loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> 처리 중...</>
          ) : (
            <><UserX className="w-4 h-4" /> 회원 탈퇴 신청 / Request Withdrawal</>
          )}
        </button>
      </div>
    </div>
  );
}
