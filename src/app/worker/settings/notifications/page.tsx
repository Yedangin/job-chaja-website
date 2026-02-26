'use client';

/**
 * 알림 설정 / Notification settings
 * - 서비스 알림(SMS/카카오/이메일) + 마케팅 수신 설정
 * - 채널별 수신 동의 일자 표시 / Shows per-channel consent timestamps
 */

import { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';

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
        const accessToken = localStorage.getItem('accessToken');
        const res = await fetch('/api/auth/my/notification-settings', {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
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
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch('/api/auth/my/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
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

      {/* ── 서비스 알림 섹션 / Service notifications ── */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          서비스 알림 / Service Notifications
        </p>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {([
            {
              key: 'sms'   as const,
              icon: '📱',
              title: 'SMS 알림',
              titleEn: 'SMS',
              desc: '문자 메시지로 채용 정보와 서비스 알림을 받습니다.',
              consentAt: settings.notifSmsEnabledAt,
            },
            {
              key: 'kakao' as const,
              icon: '💬',
              title: '카카오 알림',
              titleEn: 'Kakao',
              desc: '카카오톡으로 면접·합격 알림을 받습니다.',
              consentAt: settings.notifKakaoEnabledAt,
            },
            {
              key: 'email' as const,
              icon: '📧',
              title: '이메일 알림',
              titleEn: 'Email',
              desc: '이메일로 채용 정보 및 공지를 받습니다.',
              consentAt: settings.notifEmailEnabledAt,
            },
          ]).map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}{' '}
                    <span className="text-gray-400 font-normal">/ {item.titleEn}</span>
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
        </div>
      </div>

      {/* ── 마케팅 수신 동의 섹션 / Marketing consent ── */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          마케팅 수신 동의 / Marketing Consent
        </p>
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">📣</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  마케팅 수신 동의{' '}
                  <span className="text-gray-400 font-normal">/ Marketing</span>
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
          {/* 마케팅 안내 문구 / Marketing notice */}
          <div className="px-5 pb-4">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              마케팅 수신 동의 시 개인정보 처리방침에 따라 정보가 활용됩니다.
              언제든지 수신 거부로 변경 가능합니다.
            </p>
          </div>
        </div>
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
