import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageProvider';

interface EmailVerificationProps {
  email: string;
  authCode: string;
  onEmailChange: (email: string) => void;
  onAuthCodeChange: (code: string) => void;
  onSendOtp: (email: string) => void;
  onVerifyOtp: (email: string, code: string) => void;
  isAuthSent: boolean;
  isAuthVerified: boolean;
  isSending: boolean;
  isVerifying: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

/**
 * 이메일 인증 UI (OTP 발송/검증)
 */
export function EmailVerification({
  email,
  authCode,
  onEmailChange,
  onAuthCodeChange,
  onSendOtp,
  onVerifyOtp,
  isAuthSent,
  isAuthVerified,
  isSending,
  isVerifying,
  timeLeft,
  formatTime,
}: EmailVerificationProps) {
  const { t } = useLanguage();

  // 내부 상태로 이메일 관리 (즉각 반영을 위해)
  const [localEmail, setLocalEmail] = useState(email || '');

  // 외부에서 email prop이 변경되면 내부 상태도 동기화 (초기화 등)
  useEffect(() => {
    setLocalEmail(email || '');
  }, [email]);

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isSending) return t('sending');
    if (isAuthVerified) return t('btnAuth'); // 인증 완료 시 "인증요청" 텍스트로 비활성화
    if (isAuthSent && timeLeft > 0) return t('resend'); // 타이머 중에는 "재요청" 텍스트
    if (isAuthSent) return t('resend'); // 타이머 끝나면 "재요청"
    return t('btnAuth'); // 기본 "인증요청"
  };

  // 버튼 비활성화 조건 (타이머 중에도 재전송 가능하도록 수정)
  const isButtonDisabled = isSending || !localEmail || isAuthVerified;

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="email"
          value={localEmail}
          onChange={(e) => {
            const value = e.target.value;
            // 영문, 숫자, @, ., -, _ 만 허용 (한글 등은 즉시 필터링)
            const filtered = value.replace(/[^a-zA-Z0-9@._-]/g, '');

            // 즉시 로컬 상태 업데이트 (화면에 바로 반영)
            setLocalEmail(filtered);

            // 부모 컴포넌트에도 전달
            onEmailChange(filtered);
          }}
          placeholder={t('emailPh')}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm disabled:bg-slate-50 disabled:text-slate-400"
          autoComplete="email"
          disabled={isAuthVerified}
        />
        <Button
          type="button"
          onClick={() => onSendOtp(localEmail)}
          disabled={isButtonDisabled}
          className="px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl disabled:bg-slate-400 disabled:cursor-not-allowed min-w-[80px]"
        >
          {getButtonText()}
        </Button>
      </div>

      {/* 타이머 표시 (발송 후) */}
      {isAuthSent && timeLeft > 0 && !isAuthVerified && (
        <p className="text-sm text-red-500 font-semibold mt-1 ml-1">
          ({formatTime(timeLeft)})
        </p>
      )}

      {/* 인증코드 입력 (발송 후, 검증 전) */}
      {isAuthSent && !isAuthVerified && (
        <div className="flex gap-2 mt-2 animate-in fade-in duration-300">
          <input
            type="text" // 인증번호는 숫자만 입력
            value={authCode}
            onChange={(e) => {
                // 숫자만 입력되도록 필터링
                const val = e.target.value.replace(/[^0-9]/g, '');
                onAuthCodeChange(val);
            }}
            placeholder={t('authCodePh')}
            maxLength={6}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 outline-none transition-all text-sm text-center tracking-widest font-mono"
          />
          <Button
            type="button"
            onClick={() => onVerifyOtp(localEmail, authCode)}
            disabled={isVerifying || authCode.length !== 6}
            className="px-6 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl disabled:bg-slate-300"
          >
            {isVerifying ? t('verifying') : t('verify')}
          </Button>
        </div>
      )}

      {/* 검증 완료 메시지 */}
      {isAuthVerified && (
        <p className="text-[10px] text-green-600 mt-1 ml-1 animate-in fade-in duration-300 font-semibold">
          ✓ {t('authVerified')}
        </p>
      )}
    </div>
  );
}