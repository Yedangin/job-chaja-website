import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { authApi } from '../api/auth.api';
import { toast } from '@/lib/toast';

interface SendHistory {
  timestamp: number;
  count: number;
}

/**
 * 이메일 인증 로직 (OTP 발송/검증)
 */
export function useEmailVerification() {
  const { t } = useLanguage();
  const [authCode, setAuthCode] = useState('');
  const [isAuthSent, setIsAuthSent] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // 남은 시간 (초)
  const [sendHistory, setSendHistory] = useState<SendHistory>({ timestamp: 0, count: 0 });
  const [lastClickTime, setLastClickTime] = useState(0); // 마지막 클릭 시간 (스팸 방지용)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 효과
  useEffect(() => {
    if (timeLeft > 0 && !isAuthVerified) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isAuthVerified]);

  /**
   * 이메일 검증 함수
   */
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  /**
   * 스팸 방지 쿨타임 확인 (3초) - 클릭할 때마다 무조건 적용
   */
  const checkSpamCooldown = (): boolean => {
    const now = Date.now();
    const cooldownMs = 3000; // 3초

    if (now - lastClickTime < cooldownMs) {
      const remainingTime = Math.ceil((cooldownMs - (now - lastClickTime)) / 1000);
      toast.error(`잠시만 기다려주세요. ${remainingTime}초 후에 다시 시도해주세요.`);
      return false;
    }

    setLastClickTime(now);
    return true;
  };

  /**
   * 발송 제한 확인 (1분에 최대 3회) - 체크만 함, 카운트 증가 안 함
   */
  const checkSendLimit = (): boolean => {
    const now = Date.now();
    const oneMinute = 60 * 1000;

    // 1분이 지났으면 OK (카운트는 성공 시에 리셋)
    if (now - sendHistory.timestamp > oneMinute) {
      return true;
    }

    // 1분 내에 3회 이상이면 제한
    if (sendHistory.count >= 3) {
      const remainingTime = Math.ceil((oneMinute - (now - sendHistory.timestamp)) / 1000);
      toast.error(`너무 많은 요청입니다. ${remainingTime}초 후에 다시 시도해주세요.`);
      return false;
    }

    return true;
  };

  /**
   * 성공한 발송 기록 (성공했을 때만 호출)
   */
  const recordSuccessfulSend = () => {
    const now = Date.now();
    const oneMinute = 60 * 1000;

    // 1분이 지났으면 카운트 리셋
    if (now - sendHistory.timestamp > oneMinute) {
      setSendHistory({ timestamp: now, count: 1 });
    } else {
      // 1분 내면 카운트 증가
      setSendHistory({ timestamp: sendHistory.timestamp, count: sendHistory.count + 1 });
    }
  };

  /**
   * OTP 발송
   */
  const sendOtp = async (email: string) => {
    if (!email) {
      toast.error(t('errEmailRequired'));
      return;
    }

    if (!validateEmail(email)) {
      toast.error(t('errEmailFormat'));
      return;
    }

    // 1. 스팸 방지 쿨타임 확인 (3초) - 클릭할 때마다 무조건 체크
    if (!checkSpamCooldown()) {
      return;
    }

    // 2. 비즈니스 로직 제한 확인 (1분 내 3회) - 체크만 함
    if (!checkSendLimit()) {
      return;
    }

    setIsSending(true);
    console.log('='.repeat(50));
    console.log('[OTP] 발송 시작');
    console.log('[OTP] 이메일:', email);
    console.log('[OTP] 시간:', new Date().toLocaleTimeString());

    try {
      await authApi.sendOtp(email);

      console.log('[OTP] ✅ 발송 성공!');
      console.log('[OTP] 타이머 시작: 300초 (5분)');
      console.log('='.repeat(50));

      // 3. 성공했을 때만 발송 히스토리 기록
      recordSuccessfulSend();

      setIsAuthSent(true);
      setTimeLeft(300); // 5분 타이머 시작
      toast.success(t('authSent'));
    } catch (error: any) {
      console.error('[OTP] ❌ 발송 실패!');
      console.error('[OTP] 에러:', error);
      console.error('[OTP] 에러 메시지:', error.message);
      console.log('='.repeat(50));

      // 실패 시에는 발송 히스토리를 기록하지 않음
      // 사용자가 3초만 기다리면 즉시 다시 시도 가능
      toast.error(error.message || t('errAuthSendFail'));
    } finally {
      setIsSending(false);
    }
  };

  /**
   * OTP 검증
   */
  const verifyOtp = async (email: string, code: string) => {
    if (!code || code.length !== 6) {
      toast.error('인증번호 6자리를 입력해주세요.');
      return;
    }

    setIsVerifying(true);
    console.log('='.repeat(50));
    console.log('[OTP] 검증 시작');
    console.log('[OTP] 이메일:', email);
    console.log('[OTP] 코드:', code);

    try {
      await authApi.verifyOtp(email, code);

      console.log('[OTP] ✅ 검증 성공!');
      console.log('[OTP] 타이머 중지');
      console.log('='.repeat(50));

      setIsAuthVerified(true);
      setTimeLeft(0); // 타이머 중지
      toast.success('인증이 완료되었습니다.');
    } catch (error: any) {
      console.error('[OTP] ❌ 검증 실패!');
      console.error('[OTP] 에러:', error);
      console.log('='.repeat(50));

      toast.error(error.message || t('errAuthCode') || 'Wrong Code');
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * 초기화
   */
  const reset = () => {
    setAuthCode('');
    setIsAuthSent(false);
    setIsAuthVerified(false);
    setTimeLeft(0);
    setSendHistory({ timestamp: 0, count: 0 });
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  /**
   * 시간 포맷 (MM:SS)
   */
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    authCode,
    setAuthCode,
    isAuthSent,
    isAuthVerified,
    isSending,
    isVerifying,
    timeLeft,
    formatTime,
    sendOtp,
    verifyOtp,
    reset,
  };
}
