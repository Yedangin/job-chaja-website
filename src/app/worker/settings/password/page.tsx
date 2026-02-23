'use client';

/**
 * 비밀번호 변경 / Change password
 * - 이메일 회원: Step1(현재 비밀번호 확인) → Step2(비밀번호 변경 폼)
 * - 소셜 회원: 소셜 로그인 안내 메시지 표시
 * Email users: Step1(verify) → Step2(change form) / Social users: info message
 */

import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, Check, ShieldCheck } from 'lucide-react';

type SocialProvider = 'NONE' | 'GOOGLE' | 'KAKAO' | 'APPLE' | 'FACEBOOK' | string;

// 소셜 공급자 한글 이름 / Social provider display names
const SOCIAL_NAMES: Record<string, string> = {
  GOOGLE:   'Google',
  KAKAO:    '카카오',
  APPLE:    'Apple',
  FACEBOOK: 'Facebook',
};

export default function WorkerPasswordPage() {
  const [socialProvider, setSocialProvider] = useState<SocialProvider | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Step 1 상태 / Step 1 state
  const [step, setStep]             = useState<1 | 2>(1);
  const [verifyPw, setVerifyPw]     = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [verifying, setVerifying]   = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Step 2 상태 / Step 2 state
  const [oldPassword, setOldPassword]         = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld]         = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // 소셜 회원 여부 확인 / Check if social member
  useEffect(() => {
    const load = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const res = await fetch('/api/auth/my/profile-detail', {
          headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setSocialProvider(data.socialProvider ?? 'NONE');
        }
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
  }, []);

  // Step1: 현재 비밀번호 확인 / Step1: verify current password
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    if (!verifyPw.trim()) {
      setVerifyError('비밀번호를 입력해주세요.');
      return;
    }
    setVerifying(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({ password: verifyPw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || '비밀번호가 일치하지 않습니다.');
      // 확인 성공 → Step2 표시, 현재 비밀번호 자동 채우기
      // Verified → show Step2, pre-fill current password field
      setOldPassword(verifyPw);
      setStep(2);
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : '비밀번호가 일치하지 않습니다.');
    } finally {
      setVerifying(false);
    }
  };

  // Step2: 비밀번호 변경 / Step2: change password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다. / New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다. / Password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || '변경에 실패했습니다.');
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '변경에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 로딩 중 / Loading
  if (loadingProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-36 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  const isSocial = socialProvider && socialProvider !== 'NONE';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">비밀번호 변경</h1>
        <p className="text-sm text-gray-500 mt-0.5">Change Password</p>
      </div>

      {/* ── 소셜 회원 안내 / Social member info ── */}
      {isSocial && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            회원님은 소셜 로그인 회원입니다
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            {SOCIAL_NAMES[socialProvider] || socialProvider} 계정으로 가입하셨습니다.
          </p>
          <p className="text-sm text-gray-400">
            소셜 로그인 회원은 비밀번호를 변경할 수 없습니다.<br />
            <span className="text-xs">Social login accounts cannot change password here.</span>
          </p>
        </div>
      )}

      {/* ── 이메일 회원: Step1 비밀번호 확인 / Email member: Step1 verify ── */}
      {!isSocial && step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">본인 확인이 필요합니다</p>
              <p className="text-xs text-amber-700 mt-0.5">
                보안을 위해 현재 비밀번호를 먼저 입력해주세요.
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                현재 비밀번호{' '}
                <span className="text-gray-400 font-normal">/ Current Password</span>
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showVerify ? 'text' : 'password'}
                  value={verifyPw}
                  onChange={(e) => setVerifyPw(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowVerify((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showVerify ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {verifyError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                ⚠️ {verifyError}
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              {verifying ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 확인 중...</>
              ) : (
                <><ShieldCheck className="w-4 h-4" /> 본인 확인 / Verify</>
              )}
            </button>
          </form>
        </div>
      )}

      {/* ── 이메일 회원: Step2 비밀번호 변경 폼 / Email member: Step2 change form ── */}
      {!isSocial && step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                비밀번호가 변경되었습니다
              </h3>
              <p className="text-sm text-gray-400">Password changed successfully.</p>
              <button
                type="button"
                onClick={() => { setStep(1); setVerifyPw(''); setSuccess(false); }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                돌아가기
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-xl">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-800 font-medium">본인 확인이 완료되었습니다.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  {
                    label: '현재 비밀번호', labelEn: 'Current Password',
                    value: oldPassword, setter: setOldPassword,
                    show: showOld, toggleShow: () => setShowOld((v) => !v),
                    autoComplete: 'current-password',
                  },
                  {
                    label: '새 비밀번호', labelEn: 'New Password',
                    value: newPassword, setter: setNewPassword,
                    show: showNew, toggleShow: () => setShowNew((v) => !v),
                    autoComplete: 'new-password',
                  },
                  {
                    label: '새 비밀번호 확인', labelEn: 'Confirm Password',
                    value: confirmPassword, setter: setConfirmPassword,
                    show: showConfirm, toggleShow: () => setShowConfirm((v) => !v),
                    autoComplete: 'new-password',
                  },
                ].map((field) => (
                  <div key={field.labelEn}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {field.label}{' '}
                      <span className="text-gray-400 font-normal">/ {field.labelEn}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={field.show ? 'text' : 'password'}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        autoComplete={field.autoComplete}
                        required
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      />
                      <button
                        type="button"
                        onClick={field.toggleShow}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    ⚠️ {error}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setVerifyPw(''); setError(null); }}
                    className="px-5 py-3 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition"
                  >
                    이전으로
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {saving ? '변경 중...' : '비밀번호 변경 / Change'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
