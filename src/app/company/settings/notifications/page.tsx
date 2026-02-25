'use client';

/**
 * 기업회원 알림 설정 페이지 / Company notification settings page
 * - 채용 관련 알림 토글 (새 지원자, 면접, 공고만료, 결제, 시스템)
 * - Toggles for recruitment-related notifications (new applicants, interviews, expiry, payments, system)
 */

import { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// 알림 설정 타입 / Notification settings type
interface CompanyNotifSettings {
  newApplicant:    boolean; // 새 지원자 알림 / New applicant notification
  interviewAlarm:  boolean; // 면접 일정 알림 / Interview schedule notification
  jobExpiry:       boolean; // 공고 만료 알림 / Job posting expiry notification
  paymentAlarm:    boolean; // 결제 알림 / Payment notification
  systemAlarm:     boolean; // 시스템 알림 / System notification
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

// 알림 항목 정의 / Notification item definitions
const NOTIF_ITEMS: {
  key: keyof CompanyNotifSettings;
  icon: string;
  title: string;
  titleEn: string;
  desc: string;
}[] = [
  {
    key: 'newApplicant',
    icon: '👤',
    title: '새 지원자 알림',
    titleEn: 'New Applicants',
    desc: '공고에 새로운 지원자가 생기면 알림을 받습니다.',
  },
  {
    key: 'interviewAlarm',
    icon: '📅',
    title: '면접 일정 알림',
    titleEn: 'Interview Schedule',
    desc: '면접 예정일 전날 및 당일 알림을 받습니다.',
  },
  {
    key: 'jobExpiry',
    icon: '⏰',
    title: '공고 만료 알림',
    titleEn: 'Job Expiry',
    desc: '공고 마감 3일 전, 1일 전에 알림을 받습니다.',
  },
  {
    key: 'paymentAlarm',
    icon: '💳',
    title: '결제 알림',
    titleEn: 'Payment',
    desc: '결제 완료, 실패, 환불 등 결제 관련 알림을 받습니다.',
  },
  {
    key: 'systemAlarm',
    icon: '🔔',
    title: '시스템 알림',
    titleEn: 'System',
    desc: '서비스 점검, 정책 변경 등 중요 공지를 받습니다.',
  },
];

export default function CompanyNotificationsSettingsPage() {
  // 알림 설정 상태 / Notification settings state
  const [settings, setSettings] = useState<CompanyNotifSettings>({
    newApplicant:   false,
    interviewAlarm: false,
    jobExpiry:      false,
    paymentAlarm:   false,
    systemAlarm:    false,
  });
  // 최근 저장 일시 (표시용) / Last saved timestamp for display
  const [savedAt, setSavedAt] = useState<string | null>(null);
  // 로딩/저장 상태 / Loading and saving state
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

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
        // 백엔드 응답에서 알림 설정 필드 매핑 / Map backend fields to local state
        const profile = data.company ?? data;
        setSettings({
          newApplicant:   profile.notifNewApplicant   ?? true,
          interviewAlarm: profile.notifInterview       ?? true,
          jobExpiry:      profile.notifJobExpiry        ?? true,
          paymentAlarm:   profile.notifPayment          ?? true,
          systemAlarm:    profile.notifSystem           ?? true,
        });
        setSavedAt(profile.notifUpdatedAt ?? null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 토글 핸들러 / Toggle handler
  const toggle = (key: keyof CompanyNotifSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
          notifNewApplicant:   settings.newApplicant,
          notifInterview:       settings.interviewAlarm,
          notifJobExpiry:       settings.jobExpiry,
          notifPayment:         settings.paymentAlarm,
          notifSystem:          settings.systemAlarm,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { message?: string }).message || '저장에 실패했습니다.');
      setSavedAt(new Date().toISOString());
      toast.success('알림 설정이 저장되었습니다.');
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
          <div className="h-7 w-40 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 페이지 헤더 / Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">알림 설정</h1>
        <p className="text-sm text-gray-500 mt-0.5">Notification Settings</p>
      </div>

      {/* ── 채용 알림 섹션 / Recruitment notifications ── */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          채용 알림 / Recruitment Notifications
        </p>
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {NOTIF_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {/* 아이콘 / Icon */}
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}{' '}
                    <span className="text-gray-400 font-normal">/ {item.titleEn}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
              {/* 토글 스위치 / Toggle switch */}
              <Toggle
                checked={settings[item.key]}
                onChange={() => toggle(item.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 안내 문구 / Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
        <p className="text-xs text-blue-600 leading-relaxed">
          시스템 알림(서비스 점검, 보안 공지 등)은 수신 거부와 무관하게 발송될 수 있습니다.
          <br />
          System alerts (maintenance, security notices) may be sent regardless of settings.
        </p>
      </div>

      {/* 저장 버튼 영역 / Save button area */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? '저장 중...' : '저장하기 / Save'}
        </button>
        {/* 마지막 저장 일시 / Last saved timestamp */}
        {savedAt && !saving && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Bell className="w-3.5 h-3.5" />
            마지막 저장: {formatDate(savedAt)}
          </span>
        )}
      </div>
    </div>
  );
}
