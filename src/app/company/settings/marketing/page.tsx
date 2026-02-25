'use client';

/**
 * 기업회원 마케팅 수신 동의 페이지 / Company marketing consent page
 * - [필수] 서비스 알림: 수신 거부 불가, "자동 발송" 뱃지 표시
 * - [선택] 마케팅 수신 동의: 이메일, SMS, 카카오 채널별 토글
 * - Mandatory service notifications with auto-send badge
 * - Optional: Email, SMS, KakaoTalk marketing consent toggles with consent date display
 */

import { useState, useEffect } from 'react';
import { Loader2, Megaphone, Info, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

// 마케팅 동의 상태 타입 / Marketing consent state type
interface MarketingSettings {
  emailMarketing:   boolean; // 이메일 마케팅 동의 / Email marketing consent
  smsMarketing:     boolean; // SMS 마케팅 동의 / SMS marketing consent
  kakaoMarketing:   boolean; // 카카오 알림톡 동의 / KakaoTalk marketing consent
  // 채널별 동의 일시 (ISO string or null) / Per-channel consent timestamps
  emailConsentAt:   string | null;
  smsConsentAt:     string | null;
  kakaoConsentAt:   string | null;
}

// ISO 날짜 → "YYYY.MM.DD" 포맷 / Format ISO date to Korean style
function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

// 토글 스위치 컴포넌트 / Toggle switch component
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      aria-checked={checked}
      role="switch"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// 자동 발송 뱃지 (필수 항목용) / Auto-send badge for mandatory items
function AutoBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
      <ShieldCheck className="w-2.5 h-2.5" />
      자동 발송
    </span>
  );
}

// 필수 서비스 알림 항목 / Mandatory service notification items
const MANDATORY_ITEMS: { icon: string; title: string; titleEn: string; desc: string }[] = [
  {
    icon: '💼',
    title: '면접 통보 / 채용 결과',
    titleEn: 'Interview & Hiring Results',
    desc: '지원자 면접 일정, 채용 결과 알림',
  },
  {
    icon: '💳',
    title: '결제 / 환불 확인',
    titleEn: 'Payment & Refund Confirmation',
    desc: '결제 완료, 환불 처리 확인 알림',
  },
  {
    icon: '🔒',
    title: '계정 보안 알림',
    titleEn: 'Account Security',
    desc: '로그인 감지, 비밀번호 변경 알림',
  },
];

// 마케팅 채널 항목 정의 / Marketing channel item definitions
const MARKETING_CHANNELS: {
  key: 'emailMarketing' | 'smsMarketing' | 'kakaoMarketing';
  consentAtKey: 'emailConsentAt' | 'smsConsentAt' | 'kakaoConsentAt';
  icon: string;
  title: string;
  titleEn: string;
  desc: string;
}[] = [
  {
    key: 'emailMarketing',
    consentAtKey: 'emailConsentAt',
    icon: '📧',
    title: '이메일 뉴스레터',
    titleEn: 'Email Newsletter',
    desc: '채용 트렌드, 서비스 업데이트, 프로모션 정보를 이메일로 받습니다.',
  },
  {
    key: 'smsMarketing',
    consentAtKey: 'smsConsentAt',
    icon: '📱',
    title: 'SMS 이벤트 소식',
    titleEn: 'SMS Events',
    desc: '이벤트, 쿠폰, 중요 채용 공고 알림을 문자로 받습니다.',
  },
  {
    key: 'kakaoMarketing',
    consentAtKey: 'kakaoConsentAt',
    icon: '💬',
    title: '카카오 추천 정보',
    titleEn: 'Kakao Recommendations',
    desc: '카카오톡으로 맞춤 채용 정보 및 이벤트 소식을 받습니다.',
  },
];

export default function CompanyMarketingSettingsPage() {
  // 마케팅 설정 상태 / Marketing settings state
  const [settings, setSettings] = useState<MarketingSettings>({
    emailMarketing: false,
    smsMarketing:   false,
    kakaoMarketing: false,
    emailConsentAt: null,
    smsConsentAt:   null,
    kakaoConsentAt: null,
  });
  // 로딩/저장 상태 / Loading and saving state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  // 설정 로드 / Load settings on mount
  useEffect(() => {
    const load = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const res = await fetch('/api/auth/my/profile', {
          headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : {},
        });
        if (!res.ok) return;
        const data = await res.json();
        // 백엔드 응답에서 마케팅 설정 매핑 / Map backend response to local state
        const profile = data.company ?? data;
        setSettings({
          emailMarketing: profile.marketingEmail  ?? false,
          smsMarketing:   profile.marketingSms    ?? false,
          kakaoMarketing: profile.marketingKakao  ?? false,
          emailConsentAt: profile.marketingEmailConsentAt  ?? null,
          smsConsentAt:   profile.marketingSmsConsentAt    ?? null,
          kakaoConsentAt: profile.marketingKakaoConsentAt  ?? null,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 토글 핸들러 / Toggle handler
  const toggle = (key: 'emailMarketing' | 'smsMarketing' | 'kakaoMarketing') => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 전체 동의 여부 / Whether all channels are consented
  const allConsented =
    settings.emailMarketing && settings.smsMarketing && settings.kakaoMarketing;

  // 전체 동의 토글 / Toggle all channels
  const toggleAll = () => {
    const nextValue = !allConsented;
    setSettings((prev) => ({
      ...prev,
      emailMarketing: nextValue,
      smsMarketing:   nextValue,
      kakaoMarketing: nextValue,
    }));
  };

  // 저장 핸들러 / Save handler
  const handleSave = async () => {
    setSaving(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch('/api/auth/my/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({
          marketingEmail: settings.emailMarketing,
          marketingSms:   settings.smsMarketing,
          marketingKakao: settings.kakaoMarketing,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { message?: string }).message || '저장에 실패했습니다.');

      // 저장 후 동의 일시 갱신 / Update consent timestamps after save
      const now = new Date().toISOString();
      setSettings((prev) => ({
        ...prev,
        emailConsentAt: prev.emailMarketing ? (prev.emailConsentAt ?? now) : null,
        smsConsentAt:   prev.smsMarketing   ? (prev.smsConsentAt   ?? now) : null,
        kakaoConsentAt: prev.kakaoMarketing ? (prev.kakaoConsentAt ?? now) : null,
      }));

      toast.success('마케팅 수신 설정이 저장되었습니다.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '저장에 실패했습니다.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // 로딩 스켈레톤 / Loading skeleton
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-48 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-56 bg-gray-100 rounded-2xl" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">알림 및 마케팅 수신 동의</h1>
        <p className="text-sm text-gray-500 mt-0.5">Notification & Marketing Consent</p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* [필수] 서비스 알림 섹션 / [Required] Mandatory service notifications */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mb-6">
        {/* 섹션 헤더 / Section header */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-xs font-bold text-white bg-gray-700 px-2 py-0.5 rounded">
            필수
          </span>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            서비스 알림 / Service Notifications
          </p>
        </div>
        {/* 수신 거부 불가 안내 / Opt-out not available notice */}
        <p className="text-xs text-gray-400 px-1 mb-2">
          서비스 이용에 필수적인 알림으로 수신 거부가 불가합니다.
          <br />
          <span className="text-gray-300">
            These are mandatory notifications required for service use and cannot be disabled.
          </span>
        </p>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {MANDATORY_ITEMS.map((item) => (
            <div key={item.title} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{item.titleEn}</p>
                </div>
              </div>
              {/* 자동 발송 뱃지 (토글 없음) / Auto-send badge instead of toggle */}
              <AutoBadge />
            </div>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* [선택] 마케팅 수신 동의 섹션 / [Optional] Marketing consent section   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mb-4">
        {/* 섹션 헤더 / Section header */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded">
            선택
          </span>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            마케팅 수신 동의 / Marketing Consent
          </p>
        </div>
        <p className="text-xs text-gray-400 px-1 mb-2">
          선택 항목입니다. 언제든지 수신 거부로 변경 가능합니다.
          <br />
          <span className="text-gray-300">Optional. You may opt out at any time.</span>
        </p>

        {/* 전체 동의 토글 / All-consent toggle */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-3">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">
                <Megaphone className="w-5 h-5 text-blue-500" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  마케팅 전체 수신 동의{' '}
                  <span className="text-gray-400 font-normal text-xs">/ Agree to All</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  모든 채널(이메일·SMS·카카오)의 마케팅 수신에 동의합니다.
                </p>
              </div>
            </div>
            {/* 전체 동의 토글 / All-consent toggle */}
            <Toggle checked={allConsented} onChange={toggleAll} />
          </div>
        </div>

        {/* 채널별 설정 / Per-channel settings */}
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {MARKETING_CHANNELS.map((channel) => (
            <div key={channel.key} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {/* 채널 아이콘 / Channel icon */}
                <span className="text-xl shrink-0">{channel.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {channel.title}{' '}
                    <span className="text-gray-400 font-normal text-xs">/ {channel.titleEn}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{channel.desc}</p>
                  {/* 동의 일자 표시 / Consent date display */}
                  {settings[channel.key] && formatDate(settings[channel.consentAtKey]) && (
                    <p className="text-[10px] text-blue-400 mt-0.5">
                      수신 동의일: {formatDate(settings[channel.consentAtKey])}
                    </p>
                  )}
                  {/* 미동의 표시 / Non-consent indicator */}
                  {!settings[channel.key] && (
                    <p className="text-[10px] text-gray-300 mt-0.5">수신 거부 상태</p>
                  )}
                </div>
              </div>
              {/* 채널별 토글 / Per-channel toggle */}
              <Toggle
                checked={settings[channel.key]}
                onChange={() => toggle(channel.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── 혜택 안내 / Benefits notice ── */}
      <div
        className={`rounded-xl border px-4 py-3 mb-6 transition-all ${
          allConsented
            ? 'bg-blue-50 border-blue-100'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-start gap-2">
          <Info
            className={`w-4 h-4 mt-0.5 shrink-0 ${
              allConsented ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
          {allConsented ? (
            // 동의 시 혜택 안내 / Benefits when consented
            <p className="text-xs text-blue-600 leading-relaxed">
              마케팅 수신 동의 시 채용 프로모션 쿠폰, 서비스 업데이트, 우수 구직자 추천 정보를 받으실 수 있습니다.
              <br />
              You will receive promotional coupons, service updates, and top candidate recommendations.
            </p>
          ) : (
            // 미동의 시 안내 / Notice when not consented
            <p className="text-xs text-gray-400 leading-relaxed">
              마케팅 수신에 동의하지 않으면 이벤트, 쿠폰 등 혜택 정보를 받으실 수 없습니다.
              <br />
              Opting out means you won&apos;t receive promotions, coupons, or benefit updates.
            </p>
          )}
        </div>
      </div>

      {/* 개인정보 안내 / Privacy notice */}
      <div className="mb-6">
        <p className="text-[11px] text-gray-400 leading-relaxed px-1">
          마케팅 수신 동의는 선택 사항이며, 개인정보 처리방침에 따라 정보가 활용됩니다.
          언제든지 수신 거부로 변경 가능합니다.
          <br />
          Marketing consent is optional. Information is used per the Privacy Policy. You may opt out at any time.
        </p>
      </div>

      {/* 저장 버튼 / Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {saving ? '저장 중...' : '저장하기 / Save'}
      </button>
    </div>
  );
}
