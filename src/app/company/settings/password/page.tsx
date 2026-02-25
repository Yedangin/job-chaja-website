'use client';

/**
 * 기업회원 비밀번호 변경 페이지 / Company member change password page
 * - 이메일 회원: Step1(현재 비밀번호 확인) → Step2(비밀번호 변경 폼)
 * - 소셜 회원: 소셜 로그인 안내 메시지 표시
 * - 새 비밀번호 입력 시 실시간 강도 표시기 / Real-time password strength indicator
 * Email users: Step1(verify) → Step2(change form) / Social users: info message
 */

import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, Check, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';

// 소셜 공급자 타입 / Social provider type
type SocialProvider = 'NONE' | 'GOOGLE' | 'KAKAO' | 'APPLE' | 'FACEBOOK' | string;

// 소셜 공급자 한글 이름 / Social provider display names
const SOCIAL_NAMES: Record<string, string> = {
  GOOGLE:   'Google',
  KAKAO:    '카카오',
  APPLE:    'Apple',
  FACEBOOK: 'Facebook',
};

/**
 * 비밀번호 강도 계산 / Calculate password strength
 * score 기준: 길이(8+/12+), 대소문자 혼용, 숫자, 특수문자 각 +1
 */
function getPasswordStrength(password: string): {
  level: 0 | 1 | 2 | 3;
  label: string;
  labelEn: string;
  color: string;
  barColor: string;
  bars: number; // 채울 바 개수 / Number of filled bars (1~4)
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 0, label: '약함',    labelEn: 'Weak',        color: 'text-red-500',    barColor: 'bg-red-400',    bars: 1 };
  if (score <= 2) return { level: 1, label: '보통',    labelEn: 'Fair',        color: 'text-yellow-500', barColor: 'bg-yellow-400', bars: 2 };
  if (score <= 3) return { level: 2, label: '강함',    labelEn: 'Strong',      color: 'text-blue-600',   barColor: 'bg-blue-500',   bars: 3 };
  return              { level: 3, label: '매우 강함', labelEn: 'Very Strong', color: 'text-green-600',  barColor: 'bg-green-500',  bars: 4 };
}

// 비밀번호 요건 체크 목록 / Password requirement checklist
function getPasswordChecks(password: string): { label: string; passed: boolean }[] {
  return [
    { label: '8자 이상 / 8+ chars',              passed: password.length >= 8 },
    { label: '숫자 포함 / Includes number',       passed: /[0-9]/.test(password) },
    { label: '특수문자 포함 권장 / Special char', passed: /[^A-Za-z0-9]/.test(password) },
  ];
}

// 비밀번호 강도 표시기 컴포넌트 / Password strength indicator component
function PasswordStrengthIndicator({ password }: { password: string }) {
  if (!password) return null;

  const strength = getPasswordStrength(password);
  const checks   = getPasswordChecks(password);

  return (
    <div className="mt-2 space-y-2">
      {/* 강도 바 + 레이블 / Strength bars + label */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= strength.bars ? strength.barColor : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-semibold shrink-0 ${strength.color}`}>
          {strength.label}
        </span>
      </div>

      {/* 요건 체크 아이템 / Requirement check items */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map((check) => (
          <span
            key={check.label}
            className={`flex items-center gap-1 text-xs ${
              check.passed ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {check.passed ? (
              <Check className="w-3 h-3" />
            ) : (
              <X className="w-3 h-3" />
            )}
            {check.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CompanyPasswordPage() {
  // 소셜 공급자 상태 / Social provider state
  const [socialProvider, setSocialProvider] = useState<SocialProvider | null>(null);
  // 프로필 로딩 / Profile loading
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Step1 상태 / Step1 state
  const [step, setStep]               = useState<1 | 2>(1);
  const [verifyPw, setVerifyPw]       = useState('');
  const [showVerify, setShowVerify]   = useState(false);
  const [verifying, setVerifying]     = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Step2 상태 / Step2 state
  const [oldPassword, setOldPassword]         = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld]         = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // 소셜 회원 여부 확인 / Check if social member on mount
  useEffect(() => {
    const load = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const res = await fetch('/api/auth/my/profile', {
          headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          // socialProvider 또는 socialAccounts 필드로 판별 / Detect via socialProvider or socialAccounts field
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
      if (!res.ok) throw new Error((data as { message?: string }).message || '비밀번호가 일치하지 않습니다.');
      // 확인 성공 → Step2 전환, 현재 비밀번호 자동 채우기
      // Verified → switch to Step2, pre-fill current password
      setOldPassword(verifyPw);
      setStep(2);
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : '비밀번호가 일치하지 않습니다.');
    } finally {
      setVerifying(false);
    }
  };

  // Step2: 비밀번호 변경 요청 / Step2: submit password change
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 유효성 검사: 8자 이상 / Validation: minimum 8 characters
    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다. / Password must be at least 8 characters.');
      return;
    }
    // 유효성 검사: 비밀번호 일치 / Validation: passwords match
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다. / New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({ currentPassword: oldPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { message?: string }).message || '변경에 실패했습니다.');
      // 성공 toast 알림 / Success toast notification
      toast.success('비밀번호가 변경되었습니다.');
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '변경에 실패했습니다.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // 로딩 스켈레톤 / Loading skeleton
  if (loadingProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-40 bg-gray-200 rounded" />
          <div className="h-52 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  // 소셜 회원 여부 / Is social member
  const isSocial = socialProvider && socialProvider !== 'NONE';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
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
            소셜 로그인 계정입니다
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            {SOCIAL_NAMES[socialProvider] || socialProvider} 계정으로 가입하셨습니다.
          </p>
          <p className="text-sm text-gray-400">
            소셜 로그인 회원은 이곳에서 비밀번호를 변경할 수 없습니다.<br />
            <span className="text-xs">Social login accounts cannot change password here.</span>
          </p>
        </div>
      )}

      {/* ── Step1: 본인 확인 / Step1: identity verification ── */}
      {!isSocial && step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {/* 본인 확인 안내 배너 / Identity verification notice banner */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">본인 확인이 필요합니다</p>
              <p className="text-xs text-amber-700 mt-0.5">
                보안을 위해 현재 비밀번호를 먼저 입력해주세요.
                {/* Security check: please enter current password first. */}
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
                {/* 비밀번호 표시 토글 / Password visibility toggle */}
                <button
                  type="button"
                  onClick={() => setShowVerify((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="비밀번호 표시 전환"
                >
                  {showVerify ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 인증 오류 메시지 / Verification error message */}
            {verifyError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {verifyError}
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

      {/* ── Step2: 비밀번호 변경 폼 / Step2: change password form ── */}
      {!isSocial && step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {/* 변경 완료 화면 / Success screen */}
          {success ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                비밀번호가 변경되었습니다
              </h3>
              <p className="text-sm text-gray-400">Password changed successfully.</p>
              {/* 처음으로 돌아가기 / Back to start */}
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
              {/* 본인 확인 완료 배너 / Identity verified banner */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-xl">
                <Check className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-800 font-medium">본인 확인이 완료되었습니다.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 현재 비밀번호 필드 / Current password field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    현재 비밀번호{' '}
                    <span className="text-gray-400 font-normal">/ Current Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="현재 비밀번호를 입력하세요"
                      autoComplete="current-password"
                      required
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {/* 표시 토글 / Visibility toggle */}
                    <button
                      type="button"
                      onClick={() => setShowOld((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="비밀번호 표시 전환"
                    >
                      {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 새 비밀번호 필드 + 강도 표시기 / New password field + strength indicator */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    새 비밀번호{' '}
                    <span className="text-gray-400 font-normal">/ New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="8자 이상 입력하세요"
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {/* 표시 토글 / Visibility toggle */}
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="비밀번호 표시 전환"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* 비밀번호 강도 표시기 / Password strength indicator */}
                  <PasswordStrengthIndicator password={newPassword} />
                </div>

                {/* 새 비밀번호 확인 필드 / Confirm password field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    새 비밀번호 확인{' '}
                    <span className="text-gray-400 font-normal">/ Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="새 비밀번호를 다시 입력하세요"
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {/* 표시 토글 / Visibility toggle */}
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="비밀번호 표시 전환"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* 새 비밀번호 불일치 인라인 표시 / Inline mismatch indicator */}
                  {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      비밀번호가 일치하지 않습니다. / Passwords do not match.
                    </p>
                  )}
                </div>

                {/* 오류 메시지 / Error message */}
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                {/* 버튼 영역 / Button area */}
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
