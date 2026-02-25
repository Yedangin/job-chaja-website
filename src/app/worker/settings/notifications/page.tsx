'use client';

/**
 * 알림 설정 / Notification settings
 * - [필수] 서비스 알림: 수신 거부 불가, "자동 발송" 뱃지 표시
 * - [선택] 마케팅 수신 동의: 채널별 토글
 * - Mandatory service notifications (cannot opt out) + Optional marketing toggles
 * - Shows per-channel consent timestamps for marketing options
 */

import { useState, useEffect } from 'react';
import { Bell, Loader2, ShieldCheck } from 'lucide-react';

interface NotifSettings {
  sms:             boolean;
  email:           boolean;
  kakao:           boolean;
  marketing:       boolean;
  // 채널별 동의 일시 (ISO string or null) / Per-channel consent timestamps
  notifSmsEnabledAt:     string | null;
  notifEmailEnabledAt:   string | null;
  notifKakaoEnabledAt:   string | null;
  marketingConsentAt:    string | null;
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
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
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
      <ShieldCheck className="w-2.5 h-2.5" />
      자동 발송
    </span>
  );
}

// 필수 서비스 알림 항목 목록 / Mandatory service notification items
const MANDATORY_ITEMS: { icon: string; title: string; titleEn: string; desc: string }[] = [
  {
    icon: '💼',
    title: '면접 통보 / 채용 결과',
    titleEn: 'Interview & Hiring Results',
    desc: '면접 일정, 합격/불합격 결과 알림',
  },
  {
    icon: '💳',
    title: '결제 / 환불 확인',
    titleEn: 'Payment & Refund Confirmation',
    desc: '결제 완료, 환불 처리 알림',
  },
  {
    icon: '🔒',
    title: '계정 보안 알림',
    titleEn: 'Account Security',
    desc: '로그인 감지, 비밀번호 변경 알림',
  },
];

export default function WorkerNotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotifSettings>({
    sms:   false,
    email: false,
    kakao: false,
    marketing: false,
    notifSmsEnabledAt:   null,
    notifEmailEnabledAt: null,
    notifKakaoEnabledAt: null,
    marketingConsentAt:  null,
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // 설정 로드 / Load settings on mount
  useEffect(() => {
    const load = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const res = await fetch('/api/auth/my/notification-settings', {
          headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : {},
        });
        if (!res.ok) return;
        const data = await res.json();
        setSettings({
          sms:   data.notifSms   ?? false,
          email: data.notifEmail ?? false,
          kakao: data.notifKakao ?? false,
          marketing: data.marketingConsent ?? false,
          notifSmsEnabledAt:   data.notifSmsEnabledAt   || null,
          notifEmailEnabledAt: data.notifEmailEnabledAt || null,
          notifKakaoEnabledAt: data.notifKakaoEnabledAt || null,
          marketingConsentAt:  data.marketingConsentAt  || null,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (key: 'sms' | 'email' | 'kakao' | 'marketing') => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const sessionId = localStorage.getItem('sessionId');
      const res = await fetch('/api/auth/my/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
        },
        body: JSON.stringify({
          sms:      settings.sms,
          email:    settings.email,
          kakao:    settings.kakao,
          marketing: settings.marketing,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || '저장에 실패했습니다.');

      // 저장 후 갱신된 설정 반영 / Reload to get updated timestamps
      const refreshRes = await fetch('/api/auth/my/notification-settings', {
        headers: sessionId ? { Authorization: `Bearer ${sessionId}` } : {},
      });
      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        setSettings((prev) => ({
          ...prev,
          notifSmsEnabledAt:   refreshed.notifSmsEnabledAt   || null,
          notifEmailEnabledAt: refreshed.notifEmailEnabledAt || null,
          notifKakaoEnabledAt: refreshed.notifKakaoEnabledAt || null,
          marketingConsentAt:  refreshed.marketingConsentAt  || null,
        }));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-32 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
          <div className="h-24 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">알림 설정</h1>
        <p className="text-sm text-gray-500 mt-0.5">Notification Settings</p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* [필수] 서비스 알림 섹션 / [Required] Mandatory service notifications */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mb-4">
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
          <span className="text-gray-300">These are mandatory notifications required for service use and cannot be disabled.</span>
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
      <div className="mb-6">
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
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {/* 이메일 뉴스레터 / Email newsletter */}
          {([
            {
              key: 'email' as const,
              icon: '📧',
              title: '이메일 뉴스레터',
              titleEn: 'Email Newsletter',
              desc: '채용 트렌드, 서비스 업데이트를 이메일로 받습니다.',
              consentAt: settings.notifEmailEnabledAt,
            },
            {
              key: 'sms' as const,
              icon: '📱',
              title: 'SMS 이벤트 소식',
              titleEn: 'SMS Events',
              desc: '이벤트, 쿠폰, 채용 공고 알림을 문자로 받습니다.',
              consentAt: settings.notifSmsEnabledAt,
            },
            {
              key: 'kakao' as const,
              icon: '💬',
              title: '카카오 추천 정보',
              titleEn: 'Kakao Recommendations',
              desc: '카카오톡으로 맞춤 채용 정보 및 이벤트를 받습니다.',
              consentAt: settings.notifKakaoEnabledAt,
            },
          ]).map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}{' '}
                    <span className="text-gray-400 font-normal text-xs">/ {item.titleEn}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  {/* 수신 동의 일자 / Consent date */}
                  {settings[item.key] && formatDate(item.consentAt) && (
                    <p className="text-[10px] text-blue-400 mt-0.5">
                      수신 동의일: {formatDate(item.consentAt)}
                    </p>
                  )}
                </div>
              </div>
              <Toggle checked={settings[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}

          {/* 마케팅 전체 동의 (별도 필드) / Overall marketing consent */}
          <div className="flex items-center justify-between px-5 py-4 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">📣</span>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  마케팅 수신 전체 동의{' '}
                  <span className="text-gray-400 font-normal text-xs">/ All Marketing</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  이벤트, 쿠폰, 맞춤 채용 정보 등 마케팅 메시지를 수신합니다.
                </p>
                {/* 마케팅 동의 일자 / Marketing consent date */}
                {settings.marketing && formatDate(settings.marketingConsentAt) && (
                  <p className="text-[10px] text-blue-400 mt-0.5">
                    수신 동의일: {formatDate(settings.marketingConsentAt)}
                  </p>
                )}
              </div>
            </div>
            <Toggle checked={settings.marketing} onChange={() => toggle('marketing')} />
          </div>
        </div>
        {/* 마케팅 안내 문구 / Marketing notice */}
        <p className="text-[11px] text-gray-400 leading-relaxed mt-2 px-1">
          마케팅 수신 동의 시 개인정보 처리방침에 따라 정보가 활용됩니다.
          <br />
          Marketing consent is subject to the Privacy Policy.
        </p>
      </div>

      {/* 저장 버튼 / Save button */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          ⚠️ {error}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? '저장 중...' : '저장하기 / Save'}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
            <Bell className="w-3.5 h-3.5" /> 저장되었습니다.
          </span>
        )}
      </div>
    </div>
  );
}
